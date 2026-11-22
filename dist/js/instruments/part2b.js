// Part II, winter. Instruments II-9 to II-15.
import { DATA, INK, INK2, GREY, PALE, GOOD, WARM, SHAPES, nice, pct, clamp, sum, mean, R, gen, meterTo, meterCount, area, card, bars, title, legend, note, wrap, bounds } from './lib.js';
import { factorize } from '../algo/patterns.js';
import { pagerank, modularity, components, betweenness, springStep, planted } from '../algo/graph.js';
import { mlp, forward, backward, trainEpoch, predict, conv2d } from '../algo/learn.js';
import { pca } from '../algo/cluster.js';
import { RNG } from '../core/rng.js';

// ---------- II-9 Blend ----------
const rmse = (pred, truth) => Math.sqrt(mean(pred.map((p, i) => (p - truth[i]) ** 2)));
const blendOf = (s, set) => { const W = sum(s.w) || 1; return s[set].t.map((_, i) => sum(s.w.map((w, j) => w * s[set].m[j][i])) / W); };
export const II9 = {
  id: 'II-9', name: 'Blend', short: 'Ensembles and factorization', formula: 'blend = weighted average of several models\' predictions\nerrors that differ partly cancel\nfactorization: rating ≈ reader factors · title factors',
  limit: 'A blend lowers the score it was tuned on. It cannot tell you whether that score was the right thing to chase.',
  rounds: { play: { brief: 'Five models each predict the same ratings. Drag the bars to mix them. Get the error on the open set more than 10% below the house system’s.' }, twist: { brief: 'This blend aces the open set and fails the hidden one. One model had seen the open answers. Re-mix until the hidden set is beaten by 10%.' }, case: { brief: 'Readers by titles, with some cells held back. Choose how many hidden factors to use, fit, and predict the held-back cells as well as you can.' } },
  hints: { play: ['No single model gets there. Several together do.', 'Give four models the same weight.'], twist: ['Which model is far better on the open set than on the hidden one?', 'Drop the fifth model to zero and share the weight among the rest.'], case: ['Too few factors miss the pattern. Too many memorize.', 'Try two factors and press “Fit”.'] },
  teach: ['Train several different models.', 'Average their predictions, weighting the better ones more.', 'Check the blend on data none of them has seen.'],
  init(round, ctx) {
    const r = ctx.rng(round);
    if (round === 'case') { const G = ctx.caseData.grid.rows, held = [], Rm = G.map((row, i) => row.map((v, j) => { if (r.chance(0.18)) { held.push([i, j, v]); return null; } return v; })); return { round, G, Rm, held, k: 4, fit: null, names: ctx.caseData.grid.titles }; }
    const mk = (leak) => { const t = R(50, () => clamp(Math.round(r.n(3.4, 1.1) * 2) / 2, 1, 5)), c = t.map(() => r.n(0, 0.75)); return { t, m: [0, 1, 2, 3, 4].map((j) => t.map((v, i) => v + (j === 4 ? r.n(0, leak ? 0.15 : 1.35) : c[i] + r.n(0, j === 0 ? 0.66 : 0.6)))) }; }, open = mk(true), hidden = mk(false);
    return { round, open, hidden, w: round === 'twist' ? [0, 0, 0, 0, 1] : [1, 0, 0, 0, 0], names: ['House system', 'Neighbours', 'Factors', 'Time-aware', 'Mystery entry'] };
  },
  draw(b, s) {
    b.clear(); const A = area(b), u = A.u;
    if (s.round === 'case') { const n = s.G[0].length, m = s.G.length, cw = (A.w - 70 * u) / n, ch = (A.h - 60 * u) / m, pr = (i, j) => (s.fit ? clamp(s.fit.mu + sum(s.fit.P[i].map((v, f) => v * s.fit.Q[j][f])), 0, 1) : null); title(b, 'Readers by titles', 'hollow cells were held back; shading is the model’s guess'); for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) { const x = A.x + 60 * u + j * cw, y = A.y + 50 * u + i * ch, v = s.Rm[i][j], p = pr(i, j); if (p != null) b.box(x + 1, y + 1, cw - 2, ch - 2, { fill: DATA[0], alpha: p * 0.5 }); if (v == null) b.box(x + cw * 0.25, y + ch * 0.25, cw * 0.5, ch * 0.5, { color: DATA[1], width: 2 }); else if (v) b.mark(x + cw / 2, y + ch / 2, Math.min(cw, ch) * 0.22, 'square', INK); } return; }
    b.view(-0.6, 4.6, 0, 1.25); b.pad = { l: 50, r: b.w / b.u * 0.36, t: 30, b: 60 }; b.axes({ y: 'weight', xt: 0, xfmt: () => '', yt: 5 }); s.w.forEach((w, j) => { b.rect(j - 0.35, 0, 0.7, w, { fill: DATA[j], alpha: 0.8 }); b.handle('w' + j, j, w, { color: DATA[j], label: w.toFixed(2) }); b.text(s.names[j], j, 0, { dy: 14 * u, size: 10 }); b.text('alone: ' + rmse(s.open.m[j], s.open.t).toFixed(2) + (s.round === 'twist' ? ' / ' + rmse(s.hidden.m[j], s.hidden.t).toFixed(2) : ''), j, 0, { dy: 30 * u, size: 9.5, mono: true, color: INK2 }); }); b.pad = { l: 46, r: 18, t: 18, b: 38 };
    const X = b.w * 0.68, base = rmse(s.open.m[0], s.open.t), eo = rmse(blendOf(s, 'open'), s.open.t), eh = rmse(blendOf(s, 'hidden'), s.hidden.t), baseH = rmse(s.hidden.m[0], s.hidden.t), bar = (y, nm, e, bs) => { b.label(nm, X, y, { bold: true, size: 11.5 }); b.box(X, y + 10 * u, 260 * u, 16 * u, { color: PALE, fill: '#f3f5f8' }); b.box(X, y + 10 * u, clamp(e / (bs * 1.4), 0, 1) * 260 * u, 16 * u, { fill: e <= bs * 0.9 ? GOOD : DATA[0] }); b.box(X + (0.9 / 1.4) * 260 * u, y + 6 * u, 2, 24 * u, { fill: INK }); b.label('10% line', X + (0.9 / 1.4) * 260 * u + 5 * u, y + 34 * u, { size: 9.5, color: INK2 }); b.label(e.toFixed(3), X + 266 * u, y + 18 * u, { mono: true, size: 11 }); };
    bar(A.y + 40 * u, 'Open set error', eo, base); if (s.round === 'twist') bar(A.y + 110 * u, 'Hidden set error', eh, baseH); else b.label('The hidden set is scored at the end.', X, A.y + 118 * u, { size: 10.5, color: INK2 });
  },
  drag(s, id, x, y) { if (id?.[0] === 'w') s.w[+id[1]] = clamp(Math.round(y * 20) / 20, 0, 1.2); },
  controls(s, ctx) { return s.round === 'case' ? [{ type: 'slider', label: 'Hidden factors', min: 1, max: 6, value: s.k, set: (v) => { s.k = v; s.fit = null; } }, { type: 'button', go: true, label: 'Fit', run: () => { const f = factorize(s.Rm, s.k, ctx.rng('fit' + s.k), { steps: 220, lr: 0.05, reg: 0.03 }); s.fit = { P: f.P, Q: f.Q, mu: f.mu }; } }] : []; },
  heldErr(s) { return s.fit ? rmse(s.held.map(([i, j]) => clamp(s.fit.mu + sum(s.fit.P[i].map((v, f) => v * s.fit.Q[j][f])), 0, 1)), s.held.map((h) => h[2])) : null; },
  meter(s, ctx) {
    if (s.round === 'case') { const e = II9.heldErr(s), base = rmse(s.held.map(() => mean(s.Rm.flat().filter((v) => v != null))), s.held.map((h) => h[2])); if (e == null) return { label: 'Error on held-back cells', text: 'not fitted yet', frac: 0, met: false }; const top = s.G[0].map((_, j) => mean(s.G.map((row) => row[j]))), tj = top.indexOf(Math.max(...top)); return meterTo('Error on held-back cells', e, base * 0.97, { lower: true, from: base * 1.5, fmt: (v) => v.toFixed(3), note: `guessing the average everywhere scores ${base.toFixed(3)}. The model’s surest suggestion for most readers is “${s.names[tj]}”, the most-borrowed title.` }); }
    const set = s.round === 'twist' ? 'hidden' : 'open', base = rmse(s[set].m[0], s[set].t), e = rmse(blendOf(s, set), s[set].t); return meterTo(s.round === 'twist' ? 'Hidden set: better than the house system by' : 'Open set: better than the house system by', 1 - e / base, 0.1, { from: -0.3, fmt: (v) => pct(v, 1) });
  },
  demo(s, ctx) { if (s.round === 'case') { let best = null; for (const k of [1, 2, 3]) { s.k = k; const f = factorize(s.Rm, k, ctx.rng('fit' + k), { steps: 220, lr: 0.05, reg: 0.03 }); s.fit = { P: f.P, Q: f.Q, mu: f.mu }; const e = II9.heldErr(s); if (!best || e < best[0]) best = [e, k, s.fit]; } s.k = best[1]; s.fit = best[2]; } else s.w = [1, 1, 1, 1, 0]; },
};

// ---------- II-10 The random reader ----------
const ring = (n, i, r = 3.2) => [Math.cos((i / n) * 6.283 - 1.57) * r, Math.sin((i / n) * 6.283 - 1.57) * r * 0.82];
const liveEdges = (s) => [...s.edges.filter((_, i) => !s.removed.includes(i)), ...s.added];
const ranks = (s) => pagerank({ n: s.n, edges: liveEdges(s), directed: true });
export const II10 = {
  id: 'II-10', name: 'The random reader', short: 'PageRank', formula: 'a reader follows a link at random, for ever\n(and now and then jumps anywhere)\nrank of a page = share of time spent there',
  limit: 'Rank flows to whatever is already linked to. That is a measure of attention, which is a different thing from merit.',
  rounds: { play: { brief: 'Dots are pages, arrows are links, size is rank. Make the orange page the top one by adding links: tap a page, then the page it should link to. You have three links.' }, twist: { brief: 'Tap the middle of an arrow to remove that link. Find one link whose removal changes which page is on top.' }, case: { brief: 'Common Shelf titles, linked when one reader borrowed them one after the other. Release a hundred readers and let them wander until the picture settles.' } },
  hints: { play: ['A link from an important page is worth more.', 'Link the biggest pages to the orange one.'], twist: ['Look for the arrow feeding the top page from the other group.', 'Folio can point to it.'], case: ['Press the button and wait.', 'Let them walk for a while.'] },
  teach: ['Imagine a reader who follows links at random.', 'Count how often they land on each page.', 'Pages linked from busy pages become busy themselves.'],
  init(round, ctx) {
    const r = ctx.rng(round);
    if (round === 'case') { const G = ctx.caseData.tgraph, n = G.names.length; return { round, n, edges: G.edges, removed: [], added: [], names: G.names, pos: R(n, (i) => ring(n, i, 3.6)), walkers: R(100, (i) => i % n), visits: R(n, () => 0), steps: 0, run: false, seed: 7, acc: 0 }; }
    if (round === 'twist') { for (let t = 0; t < 200; t++) { const edges = []; for (const [lo, hi] of [[0, 4], [4, 8]]) for (let a = lo; a < hi; a++) for (let b = lo; b < hi; b++) if (a !== b && r.chance(0.55)) edges.push([a, b]); edges.push([r.int(4, 7), r.int(0, 3)], [r.int(4, 7), r.int(0, 3)], [r.int(0, 3), r.int(4, 7)]); const s = { n: 8, edges, removed: [], added: [] }, top = ranks(s), t0 = top.indexOf(Math.max(...top)); for (let e = 0; e < edges.length; e++) { const pr = ranks({ ...s, removed: [e] }); if (pr.indexOf(Math.max(...pr)) !== t0) return { round, n: 8, edges, removed: [], added: [], pos: R(8, (i) => ring(8, i)), top0: t0, key: e }; } } }
    const n = 8; let s = null; for (let t = 0; t < 60; t++) { const edges = []; for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) if (a !== b && b !== 7 && r.chance(0.24)) edges.push([a, b]); s = { round, n, edges, removed: [], added: [], pos: R(n, (i) => ring(n, i)), target: 7, sel: -1 }; const trial = structuredClone(s); II10.greedy(trial); const pr = ranks(trial); if (pr.indexOf(Math.max(...pr)) === 7) break; } return s;
  },
  draw(b, s) {
    b.clear(); b.view(-4.6, 4.6, -3.8, 3.8, true); const pr = s.round === 'case' && s.steps ? s.visits.map((v) => v / Math.max(1, sum(s.visits))) : ranks(s), mx = Math.max(...pr), top = pr.indexOf(mx), g = b.g;
    liveEdges(s).forEach(([a, c], k) => { const A = s.pos[a], B = s.pos[c], d = [B[0] - A[0], B[1] - A[1]], L = Math.hypot(...d) || 1, e = [B[0] - (d[0] / L) * 0.3, B[1] - (d[1] / L) * 0.3], isNew = k >= s.edges.length - s.removed.length; b.line(A[0], A[1], e[0], e[1], { color: isNew ? WARM : s.round === 'case' ? GREY : INK2, width: isNew ? 2.5 : 1, alpha: s.round === 'case' ? 0.5 : 1 }); if (s.round !== 'case') b.path([[e[0], e[1]], [e[0] - (d[0] / L) * 0.22 + (d[1] / L) * 0.1, e[1] - (d[1] / L) * 0.22 - (d[0] / L) * 0.1], [e[0] - (d[0] / L) * 0.22 - (d[1] / L) * 0.1, e[1] - (d[1] / L) * 0.22 + (d[0] / L) * 0.1]], { close: true, fill: isNew ? WARM : INK2, color: null }); });
    if (s.round === 'twist') s.edges.forEach(([a, c], i) => { if (!s.removed.includes(i)) b.handle('e' + i, s.pos[a][0] * 0.42 + s.pos[c][0] * 0.58, s.pos[a][1] * 0.42 + s.pos[c][1] * 0.58, { draw: false, r: 7 }); });
    s.pos.forEach((p, i) => { const rr = 6 + 22 * Math.sqrt(pr[i] / mx); if (s.round !== 'case') b.handle('n' + i, p[0], p[1], { draw: false, r: Math.max(10, rr) }); b.dot(p[0], p[1], { r: rr, color: i === s.target ? DATA[1] : i === top ? DATA[2] : DATA[0], stroke: s.sel === i ? INK : '#fff' }); b.text(s.names ? (rr > 12 ? s.names[i].slice(0, 16) : '') : pct(pr[i]), p[0], p[1], { dy: -(rr + 9) * b.u, size: 10, mono: !s.names }); });
    if (s.round === 'case') s.walkers.forEach((w, k) => b.dot(s.pos[w][0] + ((k * 37) % 11 - 5) * 0.035, s.pos[w][1] + ((k * 53) % 11 - 5) * 0.035, { r: 2, color: WARM, stroke: null }));
  },
  click(s, x, y, id) { if (!id || s.round === 'case') return; if (s.round === 'twist' && id[0] === 'e') { s.removed = [+id.slice(1)]; return; } if (s.round === 'play' && id[0] === 'n') { const i = +id.slice(1); if (s.sel < 0) s.sel = i; else { if (i !== s.sel && s.added.length < 3 && !liveEdges(s).some(([a, c]) => a === s.sel && c === i)) s.added.push([s.sel, i]); s.sel = -1; } } },
  tick(s, dt) { if (s.round !== 'case' || !s.run) return false; s.acc += dt; if (s.acc < 0.12) return false; s.acc = 0; const adj = R(s.n, () => []); for (const [a, c] of s.edges) adj[a].push(c); const r = new RNG(s.seed++); s.walkers = s.walkers.map((w) => (r.chance(0.15) || !adj[w].length ? r.int(0, s.n - 1) : r.pick(adj[w]))); s.walkers.forEach((w) => s.visits[w]++); s.steps++; if (s.steps >= 60) s.run = false; return true; },
  controls(s) { if (s.round === 'case') return [{ type: 'button', go: true, label: s.run ? 'They are walking…' : 'Release a hundred readers', disabled: s.run || s.steps >= 60, run: () => { s.run = true; } }]; if (s.round === 'play') return [{ type: 'button', label: 'Take my links away', run: () => { s.added = []; s.sel = -1; } }]; return [{ type: 'button', label: 'Put the link back', run: () => { s.removed = []; } }]; },
  meter(s) {
    if (s.round === 'case') { const tot = Math.max(1, sum(s.visits)), top = s.visits.slice().sort((a, c) => c - a).slice(0, 8); return { label: 'Time spent on the eight busiest titles', text: s.steps ? pct(sum(top) / tot) : 'not released yet', goal: 'let them take 60 steps', frac: s.steps / 60, met: s.steps >= 60, note: `8 of ${s.n} titles shown here;  steps taken: ${s.steps}` }; }
    const pr = ranks(s), order = pr.map((v, i) => [v, i]).sort((a, c) => c[0] - a[0]).map((a) => a[1]);
    if (s.round === 'twist') { const top = order[0]; return { label: 'Top page', text: 'page ' + (top + 1) + (top !== s.top0 ? ': changed' : ': the same as before'), goal: 'change it by removing one link', frac: top !== s.top0 ? 1 : 0.3, met: top !== s.top0 && s.removed.length === 1 }; }
    const pos = order.indexOf(s.target) + 1; return { label: 'The orange page ranks', text: pos + (pos === 1 ? 'st' : pos === 2 ? 'nd' : pos === 3 ? 'rd' : 'th') + ` of ${s.n}`, goal: 'first, with 3 links or fewer', frac: (s.n + 1 - pos) / s.n, met: pos === 1, note: `links added: ${s.added.length} of 3` };
  },
  demo(s) { if (s.round === 'case') { s.run = true; for (let i = 0; i < 80 && s.steps < 60; i++) II10.tick(s, 0.2); } else if (s.round === 'twist') s.removed = [s.key]; else II10.greedy(s); },
  greedy(s) { s.added = []; for (let k = 0; k < 3; k++) { let best = null; for (let i = 0; i < s.n; i++) { if (i === s.target || liveEdges(s).some(([a, c]) => a === i && c === s.target)) continue; const v = ranks({ ...s, added: [...s.added, [i, s.target]] })[s.target]; if (!best || v > best[0]) best = [v, i]; } if (best) s.added.push([best[1], s.target]); } },
};

// ---------- II-11 Untangle and cut ----------
const kept = (s) => s.g.edges.filter((_, i) => !s.cut.includes(i));
const commOf = (s) => components({ n: s.g.n, edges: kept(s) }).comp;
export const II11 = {
  id: 'II-11', name: 'Untangle and cut', short: 'Communities', formula: 'betweenness of a link = how many shortest paths cross it\ncut the busiest link, and repeat\nmodularity: links inside groups, compared with chance',
  limit: 'Ask a method for groups and it will give you groups. Whether they mean anything is for you to check.',
  rounds: { play: { brief: 'A tangle of friendships. Press “Untangle” to let the springs pull it apart. Thick links carry the most shortest paths. Tap links to cut them until the groups fall apart.' }, twist: { brief: 'Someone kept cutting and the groups are in pieces. Tap dashed links to mend them. Find where modularity is highest.' }, case: { brief: 'Year one: readers linked when they share reading, coloured by main field. Cut every link that joins two fields. Then look at year six.' } },
  hints: { play: ['The thick links are the bridges.', 'Cut each thick link that joins two clumps.'], twist: ['Mend links inside a clump. Leave the bridges cut.', 'Folio can mend them.'], case: ['Links between two colours are few in year one.', 'Cut the few links between colours, then press “Year six”.'] },
  teach: ['Find the links that most shortest paths run across.', 'Cut them, and the network falls into its groups.', 'Score the split, and stop before you cut the groups themselves to pieces.'],
  init(round, ctx) {
    const r = ctx.rng(round);
    if (round === 'case') { const Y = ctx.caseData.rgraph, g = Y.first, pos = R(g.n, (i) => ring(g.n, i, 3.4)); let P = pos; for (let i = 0; i < 160; i++) P = springStep(P, g, { k: 1.1, step: 0.06 }).pos; return { round, g: { n: g.n, edges: g.edges }, comm: g.field, pos: P, cut: [], year: 1, seen6: false, six: { n: Y.last.n, edges: Y.last.edges, field: Y.last.field, pos: R(Y.last.n, (i) => ring(Y.last.n, i, 3.4)), q: Y.last.modularity }, q1: g.modularity }; }
    let g; for (let t = 0; t < 50; t++) { g = planted([6, 6, 6], 0.75, 0.05, r); if (components(g).count === 1 && g.edges.filter(([a, c]) => g.comm[a] !== g.comm[c]).length >= 3) break; }
    const order = r.shuffle(R(18, (i) => i)), s = { round, g: { n: g.n, edges: g.edges }, comm: g.comm, pos: R(18, (i) => ring(18, order[i])), cut: [], best: modularity(g, g.comm), tidy: false };
    if (round === 'twist') { II11.untangle(s); s.cut = g.edges.map((e, i) => i).filter((i) => g.comm[g.edges[i][0]] !== g.comm[g.edges[i][1]]); const inner = r.shuffle(g.edges.map((e, i) => i).filter((i) => !s.cut.includes(i))); for (const i of inner) { if (components({ n: g.n, edges: kept(s) }).count >= 7) break; s.cut.push(i); } }
    return s;
  },
  untangle(s) { let P = s.pos; const g = { n: s.g.n, edges: kept(s).length ? kept(s) : s.g.edges }; for (let i = 0; i < 220; i++) P = springStep(P, g, { k: 1.2, step: 0.06 }).pos; const mx = Math.max(...P.map((p) => Math.max(Math.abs(p[0]) / 4.2, Math.abs(p[1]) / 3.4))) || 1; s.pos = P.map((p) => [p[0] / Math.max(1, mx), p[1] / Math.max(1, mx)]); s.tidy = true; },
  draw(b, s) {
    b.clear(); b.view(-4.6, 4.6, -3.8, 3.8, true);
    if (s.round === 'case' && s.year === 6) { s.six.edges.forEach(([a, c]) => b.line(...s.six.pos[a], ...s.six.pos[c], { color: s.six.field[a] === s.six.field[c] ? GREY : WARM, width: 0.6, alpha: 0.45 })); s.six.pos.forEach((p, i) => b.dot(p[0], p[1], { r: 6, color: DATA[s.six.field[i] % 6], shape: SHAPES[s.six.field[i] % 6] })); b.text(`year six: ${s.six.edges.length} links, ${s.six.edges.filter(([a, c]) => s.six.field[a] !== s.six.field[c]).length} of them between fields`, 0, 3.6, { bold: true }); return; }
    const bt = s.round === 'case' ? null : betweenness({ n: s.g.n, edges: kept(s) }).edge, mx = bt ? Math.max(1, ...bt.values()) : 1, comp = commOf(s);
    s.g.edges.forEach(([a, c], i) => { const cutq = s.cut.includes(i), A = s.pos[a], B = s.pos[c], cross = s.comm[a] !== s.comm[c], w = bt && !cutq ? 1 + 5 * ((bt.get(a < c ? a + '-' + c : c + '-' + a) || 0) / mx) : 1.2; if (cutq && s.round === 'play') return; b.line(A[0], A[1], B[0], B[1], { color: cutq ? GREY : s.round === 'case' && cross ? WARM : INK2, width: s.round === 'case' && cross ? 2.5 : w, dash: cutq ? [3, 4] : null, alpha: cutq ? 0.8 : 1 }); if (s.round !== 'case' || cross) b.handle('e' + i, (A[0] + B[0]) / 2, (A[1] + B[1]) / 2, { draw: false, r: 8 }); });
    s.pos.forEach((p, i) => b.dot(p[0], p[1], { r: 7, color: DATA[(s.round === 'case' ? s.comm[i] : comp[i]) % 6], shape: SHAPES[(s.round === 'case' ? s.comm[i] : comp[i]) % 6] }));
  },
  click(s, x, y, id) { if (id?.[0] !== 'e' || (s.round === 'case' && s.year === 6)) return; const i = +id.slice(1); if (s.cut.includes(i)) { if (s.round !== 'play') s.cut = s.cut.filter((q) => q !== i); } else if (s.round !== 'twist') s.cut.push(i); },
  controls(s) { if (s.round === 'case') return [{ type: 'buttons', label: 'Look at', value: s.year, options: [{ label: 'Year one', value: 1 }, { label: 'Year six', value: 6 }], set: (v) => { s.year = v; if (v === 6) s.seen6 = true; } }]; return [{ type: 'button', go: !s.tidy, label: 'Untangle', run: () => II11.untangle(s) }, s.round === 'play' ? { type: 'button', label: 'Mend every link', run: () => { s.cut = []; } } : { type: 'note', text: 'Dashed links are cut. Tap one to mend it.' }]; },
  meter(s) {
    if (s.round === 'case') { const left = s.g.edges.filter(([a, c], i) => s.comm[a] !== s.comm[c] && !s.cut.includes(i)).length; return { label: 'Year one: links between fields still uncut', text: String(left), goal: '0, and then look at year six', frac: left === 0 ? (s.seen6 ? 1 : 0.8) : clamp(1 - left / 12, 0, 0.7), met: left === 0 && s.seen6, note: `modularity by field: year one ${s.q1.toFixed(2)}, year six ${s.six.q.toFixed(2)}` }; }
    const q = modularity(s.g, commOf(s)); return meterTo('Modularity of the pieces', q, s.best * 0.97, { from: 0, fmt: (v) => v.toFixed(2), note: `pieces: ${components({ n: s.g.n, edges: kept(s) }).count};  links cut: ${s.cut.length}` });
  },
  clean(s) { return s.round !== 'play' || s.cut.length <= s.g.edges.filter(([a, c]) => s.comm[a] !== s.comm[c]).length; },
  demo(s) { s.cut = s.g.edges.map((e, i) => i).filter((i) => s.comm[s.g.edges[i][0]] !== s.comm[s.g.edges[i][1]]); if (s.round === 'case') { s.year = 6; s.seen6 = true; } else II11.untangle(s); },
};

// ---------- II-12 Three dials ----------
const side = (L, p) => (L.q[0] - L.p[0]) * (p[1] - L.p[1]) - (L.q[1] - L.p[1]) * (p[0] - L.p[0]) > 0;
const fire = (s, p) => (s.hidden ? side(s.lines[0], p) && side(s.lines[1], p) : side(s.lines[0], p));
function bestLine(pts) { let best = 0; for (let a = 0; a < 6.283; a += 0.05) for (let c = -0.2; c <= 1.6; c += 0.04) { const n = [Math.cos(a), Math.sin(a)], k = pts.filter((p) => (p[0] * n[0] + p[1] * n[1] > c ? 1 : 0) === p[2]).length; best = Math.max(best, k); } return best; }
export const II12 = {
  id: 'II-12', name: 'Three dials', short: 'The perceptron', formula: 'output = 1 if w₁·x₁ + w₂·x₂ + b > 0, else 0\ntwo weights and a bias are one straight line\na hidden layer combines several lines',
  limit: 'One unit draws one straight line. Whatever cannot be split by a line, it cannot learn, however long it trains.',
  rounds: { play: { brief: 'The unit says yes on the shaded side of its line. Drag the ends of the line until it says yes only when both inputs are on: the square.' }, twist: { brief: 'Now it should say yes when exactly one input is on. Try. Then wire in a hidden layer, which gives you a second line, and try again.' }, case: { brief: 'Titles by how often they are borrowed and how readers rate them. Squares are loved by a few. Fence them in. One line will not do it.' } },
  hints: { play: ['Cut off the top right corner.', 'Run the line from the middle of the top edge to the middle of the right edge.'], twist: ['With two lines, yes is where both shaded sides overlap.', 'Make a diagonal band that holds the two squares and neither circle.'], case: ['Wire in the hidden layer.', 'One line upright at the left, one level across the top. The squares sit in the corner between.'] },
  teach: ['A unit adds up its inputs, each times a weight, and compares with a threshold.', 'On a picture that is one straight line.', 'Patterns that need a corner or a band need more than one unit.'],
  init(round, ctx) {
    const r = ctx.rng(round), L0 = { p: [0.1, -0.2], q: [0.3, 1.2] };
    if (round === 'case') { const pts = R(70, () => { const x = r.range(0.03, 0.97), y = r.range(0.03, 0.97); return [x, y, x < 0.36 && y > 0.62 ? 1 : 0]; }).filter((p) => Math.abs(p[0] - 0.36) > 0.03 && Math.abs(p[1] - 0.62) > 0.03); return { round, pts, lines: [{ p: [0.7, 0.1], q: [0.72, 0.95] }, { p: [0.1, 0.2], q: [0.9, 0.22] }], hidden: false, best1: bestLine(pts) }; }
    const pts = round === 'twist' ? [[0, 0, 0], [1, 1, 0], [0, 1, 1], [1, 0, 1]] : [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 1]]; return { round, pts, lines: [L0, { p: [1.25, 0.2], q: [-0.2, 0.25] }], hidden: false };
  },
  draw(b, s) {
    b.clear(); const lo = s.round === 'case' ? 0 : -0.4, hi = s.round === 'case' ? 1 : 1.4; b.view(lo, hi, lo, hi, true); b.axes(s.round === 'case' ? { x: 'how often borrowed', y: 'how readers rate it', xt: 4, yt: 4 } : { x: 'first input', y: 'second input', xt: 0, yt: 0, xfmt: () => '', yfmt: () => '' });
    const n = 44; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const x = lo + ((i + 0.5) / n) * (hi - lo), y = lo + ((j + 0.5) / n) * (hi - lo); if (fire(s, [x, y])) b.rect(x - (hi - lo) / n / 2, y - (hi - lo) / n / 2, (hi - lo) / n, (hi - lo) / n, { fill: DATA[1], alpha: 0.16 }); }
    (s.hidden ? [0, 1] : [0]).forEach((k) => { const L = s.lines[k], d = [L.q[0] - L.p[0], L.q[1] - L.p[1]]; b.line(L.p[0] - d[0] * 5, L.p[1] - d[1] * 5, L.q[0] + d[0] * 5, L.q[1] + d[1] * 5, { color: DATA[k ? 2 : 0], width: 2.5 }); b.handle('p' + k, L.p[0], L.p[1], { color: DATA[k ? 2 : 0] }); b.handle('q' + k, L.q[0], L.q[1], { color: DATA[k ? 2 : 0], shape: 'diamond' }); });
    s.pts.forEach((p) => { const ok = (fire(s, p) ? 1 : 0) === p[2]; b.dot(p[0], p[1], { color: p[2] ? DATA[1] : DATA[0], shape: p[2] ? 'square' : 'circle', r: s.round === 'case' ? 4.5 : 11, stroke: ok ? '#fff' : DATA[3] }); });
  },
  drag(s, id, x, y) { if (id && (id[0] === 'p' || id[0] === 'q')) s.lines[+id[1]][id[0]] = [x, y]; },
  controls(s) { return s.round === 'play' ? [] : [{ type: 'toggle', label: 'Wire in a hidden layer (a second line)', value: s.hidden, set: (v) => { s.hidden = v; } }]; },
  meter(s) { const ok = s.pts.filter((p) => (fire(s, p) ? 1 : 0) === p[2]).length, n = s.pts.length; return { label: 'Points it gets right', text: `${ok} of ${n}`, frac: ok / n, met: ok === n, note: s.round === 'twist' && !s.hidden ? 'With one line, three of four is the most anyone can get.' : s.round === 'case' && !s.hidden ? `The best any single line can do here is ${s.best1} of ${n}.` : '' }; },
  demo(s) { if (s.round === 'play') s.lines[0] = { p: [0, 1.5], q: [1.5, 0] }; else if (s.round === 'twist') { s.hidden = true; s.lines = [{ p: [0, 0.5], q: [0.5, 0] }, { p: [1.5, 0], q: [0, 1.5] }]; } else { s.hidden = true; s.lines = [{ p: [0.36, 0], q: [0.36, 1] }, { p: [0, 0.62], q: [1, 0.62] }]; } },
};

// ---------- II-13 Send the blame back ----------
export const II13 = {
  id: 'II-13', name: 'Send the blame back', short: 'Back-propagation', formula: 'forward: compute the output\nbackward: pass the error to each layer in turn\nblame at a layer = blame after it × weight × slope of the unit',
  limit: 'Blame can only flow back from examples the network was actually shown. For everything else there is no signal at all.',
  rounds: { play: { brief: 'Signal runs left to right through three units. The output should be 0.9. Press to send the blame back and nudge every weight. Choose the step size and get the loss under 0.02.' }, twist: { brief: 'Eight units in a row. The bars show how much blame reaches each one. The first gets almost none. Change the kind of unit and the size of the weights until it gets a fair share.' }, case: { brief: 'Two rings of points. Choose how many hidden units the network has, then train it. Separate the rings.' } },
  hints: { play: ['A bigger step learns faster, until it overshoots.', 'Step size 2, then press ten times.'], twist: ['S-shaped units flatten the blame at every layer.', 'Switch to “ramp” units and set the weight size near 1.4.'], case: ['One hidden unit is one line.', 'Use six hidden units and train several times.'] },
  teach: ['Run the signal forward and measure the error.', 'Pass the error back, giving each weight its share of the blame.', 'Nudge every weight a little against its blame, and repeat.'],
  init(round, ctx) {
    const r = ctx.rng(round);
    if (round === 'case') { const pts = gen.rings(r, 60, 1, 2.6, 0.2); return { round, pts, h: 1, net: mlp([2, 1, 1], ctx.rng('n1'), 'tanh'), epochs: 0, seed: 0 }; }
    if (round === 'twist') return { round, act: 'sigmoid', scale: 0.6 };
    return { round, net: mlp([1, 1, 1, 1], r, 'tanh', 0.5), lr: 0.2, presses: 0, norms: null };
  },
  chain(s) { const net = mlp([1, 1, 1, 1, 1, 1, 1, 1, 1], new RNG(41), s.act, s.scale); net.layers.forEach((L) => { L.W[0][0] = Math.abs(L.W[0][0]) * 0 + s.scale; L.b[0] = 0.1; }); return backward(net, [0.8], [0.9], 0).norms; },
  acc(s) { return s.pts.filter((p) => (predict(s.net, [p[0], p[1]])[0] > 0.5 ? 1 : 0) === p[2]).length / s.pts.length; },
  draw(b, s) {
    b.clear(); const A = area(b), u = A.u;
    if (s.round === 'case') { b.view(-3.6, 3.6, -3.6, 3.6, true); const n = 36; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const x = -3.6 + ((i + 0.5) / n) * 7.2, y = -3.6 + ((j + 0.5) / n) * 7.2, p = predict(s.net, [x, y])[0]; b.rect(x - 0.1, y - 0.1, 0.2, 0.2, { fill: p > 0.5 ? DATA[1] : DATA[0], alpha: 0.08 + Math.abs(p - 0.5) * 0.3 }); } s.pts.forEach((p) => b.dot(p[0], p[1], { color: DATA[p[2] ? 1 : 0], shape: p[2] ? 'square' : 'circle', r: 4 })); return; }
    if (s.round === 'twist') { const nm = II13.chain(s), mx = Math.max(...nm, 1e-12); b.view(-0.6, 7.6, 0, 1.15); b.axes({ x: 'unit, from first to last', y: 'blame that arrives (last unit = 1)', xt: 0, xfmt: () => '' }); nm.forEach((v, i) => { b.rect(i - 0.35, 0, 0.7, Math.min(1.1, v / nm[nm.length - 1]), { fill: i === 0 ? WARM : DATA[0] }); b.text(String(i + 1), i, 0, { dy: 12 * u, size: 10.5, mono: true }); b.text((v / nm[nm.length - 1]).toPrecision(2), i, Math.min(1.1, v / nm[nm.length - 1]), { dy: -8 * u, size: 9.5, mono: true }); }); return; }
    const acts = forward(s.net, [0.8]), W = A.w / 4; title(b, 'Signal goes right. Blame comes back left.', 'target output 0.90'); acts.forEach((a, i) => { const x = A.x + W * (i + 0.5), y = A.y + A.h * 0.45; b.mark(x, y, 26 * u, 'circle', '#fff', INK, 2); b.label(a[0].toFixed(2), x, y, { align: 'center', mono: true, size: 13 }); b.label(i === 0 ? 'input' : i === 3 ? 'output' : 'unit ' + i, x, y + 44 * u, { align: 'center', size: 10.5, color: INK2 }); if (i < 3) { b.box(x + 30 * u, y - 3 * u, W - 60 * u, 6 * u, { fill: DATA[0], alpha: 0.3 + 0.7 * clamp(Math.abs(s.net.layers[i].W[0][0]) / 2, 0, 1) }); b.label('weight ' + s.net.layers[i].W[0][0].toFixed(2), x + W / 2, y - 16 * u, { align: 'center', size: 10, mono: true }); if (s.norms) { b.box(x + 30 * u, y + 12 * u, (W - 60 * u) * clamp(s.norms[i] / Math.max(...s.norms), 0.03, 1), 5 * u, { fill: WARM }); b.label('blame ' + s.norms[i].toFixed(3), x + W / 2, y + 28 * u, { align: 'center', size: 10, mono: true, color: WARM }); } } });
  },
  controls(s, ctx) {
    if (s.round === 'case') return [{ type: 'slider', label: 'Hidden units', min: 1, max: 8, value: s.h, set: (v) => { s.h = v; s.net = mlp([2, v, 1], ctx.rng('n' + v), 'tanh'); s.epochs = 0; } }, { type: 'button', go: true, label: 'Train for a while', run: () => { const r = ctx.rng('t' + s.seed++); for (let e = 0; e < 60; e++) trainEpoch(s.net, s.pts.map((p) => [p[0], p[1]]), s.pts.map((p) => [p[2]]), 0.08, r); s.epochs += 60; } }, { type: 'note', text: `passes over the data: ${s.epochs}` }];
    if (s.round === 'twist') return [{ type: 'buttons', label: 'Kind of unit', value: s.act, options: [{ label: 'S-shaped', value: 'sigmoid' }, { label: 'tanh', value: 'tanh' }, { label: 'ramp (ReLU)', value: 'relu' }], set: (v) => { s.act = v; } }, { type: 'slider', label: 'Size of the weights', min: 0.2, max: 3, step: 0.1, value: s.scale, set: (v) => { s.scale = v; }, show: (v) => v.toFixed(1) }];
    const press = () => { const q = backward(s.net, [0.8], [0.9], s.lr); s.norms = q.norms; s.presses++; };
    return [{ type: 'slider', label: 'Step size', min: 0.05, max: 6, step: 0.05, value: s.lr, set: (v) => { s.lr = v; }, show: (v) => v.toFixed(2) }, { type: 'button', go: true, label: 'Send the blame back and nudge', run: press }, { type: 'button', label: 'Ten times', run: () => { for (let i = 0; i < 10; i++) press(); } }];
  },
  meter(s) {
    if (s.round === 'case') return meterTo('Points on the right side', II13.acc(s), 0.95, { from: 0.5, fmt: (v) => pct(v), note: `hidden units: ${s.h}` });
    if (s.round === 'twist') { const nm = II13.chain(s), ratio = nm[0] / nm[nm.length - 1], ok = ratio >= 0.1 && ratio <= 10; return { label: 'Blame reaching the first unit', text: ratio.toPrecision(2) + ' of what the last unit gets', goal: 'between 0.1 and 10', frac: ok ? 1 : clamp(1 - Math.abs(Math.log10(ratio)) / 6, 0, 0.9), met: ok, note: ratio < 0.1 ? 'It fades: the early layers barely learn.' : ratio > 10 ? 'It blows up: the early layers lurch about.' : '' }; }
    const out = forward(s.net, [0.8])[3][0], loss = -(0.9 * Math.log(Math.max(out, 1e-9)) + 0.1 * Math.log(Math.max(1 - out, 1e-9))) - 0.325; return meterTo('Loss above the least possible', loss, 0.02, { lower: true, from: 0.6, fmt: (v) => v.toFixed(3), note: `output ${out.toFixed(2)};  presses: ${s.presses}` });
  },
  demo(s, ctx) { if (s.round === 'case') { for (const h of [6, 8]) { s.h = h; s.net = mlp([2, h, 1], ctx.rng('n' + h), 'tanh'); for (let k = 0; k < 12 && II13.acc(s) < 0.95; k++) { const r = ctx.rng('t' + s.seed++); for (let e = 0; e < 60; e++) trainEpoch(s.net, s.pts.map((p) => [p[0], p[1]]), s.pts.map((p) => [p[2]]), 0.08, r); s.epochs += 60; } if (II13.acc(s) >= 0.95) return; } } else if (s.round === 'twist') { s.act = 'relu'; s.scale = 1.4; for (const sc of [1.4, 1.2, 1, 1.6, 1.8]) { s.scale = sc; const nm = II13.chain(s), q = nm[0] / nm[nm.length - 1]; if (q >= 0.1 && q <= 10) return; } } else { s.lr = 2; for (let i = 0; i < 60; i++) { s.norms = backward(s.net, [0.8], [0.9], s.lr).norms; s.presses++; } } },
};

// ---------- II-14 Slide the window ----------
const SEVEN = ['.........', '.#######.', '.......#.', '......#..', '.....#...', '....#....', '....#....', '....#....', '.........'], ONE = ['.........', '....#....', '....#....', '....#....', '....#....', '....#....', '....#....', '....#....', '.........'];
const img = (rows) => rows.map((r) => [...r].map((c) => (c === '#' ? 1 : 0)));
const sloppy = (rows, r) => { const g = img(rows), dx = r.int(-1, 1), out = g.map((row, y) => row.map((_, x) => g[y]?.[x - dx] || 0)); for (let k = 0; k < 2; k++) { const y = r.int(1, 7), x = r.int(1, 7); if (out[y][x]) out[y][x + (r.chance(0.5) ? 1 : -1)] = 1; } return out; };
const corr = (a, bq) => { const x = a.flat(), y = bq.flat(), mx = mean(x), my = mean(y); let sxy = 0, sxx = 0, syy = 0; x.forEach((v, i) => { sxy += (v - mx) * (y[i] - my); sxx += (v - mx) ** 2; syy += (y[i] - my) ** 2; }); return sxx && syy ? sxy / Math.sqrt(sxx * syy) : 0; };
const maxOf = (m) => Math.max(...m.flat());
export const II14 = {
  id: 'II-14', name: 'Slide the window', short: 'Convolution', formula: 'slide a 3 × 3 window over the picture\nat each stop: multiply cell by cell, and add\nthe answers form a new picture, a feature map',
  limit: 'A window finds the small shapes it was tuned for. Handwriting it was never shown comes out as a confident mistake.',
  rounds: { play: { brief: 'Tap the nine cells of the window to set them to −1, 0 or +1. Make a window that lights up on the upright edges of the 1. Match the grey map.' }, twist: { brief: 'Now tell a 7 from a 1. Build a window that answers strongly somewhere on the 7 and weakly everywhere on the 1.' }, case: { brief: 'Six catalogue cards in real, untidy handwriting. Your window calls a card a 7 when its strongest answer passes the line. Get all six right.' } },
  hints: { play: ['An upright edge has ink on one side and paper on the other.', 'Left column −1, right column +1, middle 0.'], twist: ['What does a 7 have that a 1 has not?', 'Top row +1, bottom row −1: it finds the bar across the top.'], case: ['Use the window from the last round.', 'Top row +1, bottom row −1, and drag the line to about 2.'] },
  teach: ['Slide a small window across the picture.', 'At each stop it gives one number: how well the patch matches the window.', 'Different windows find different little shapes, wherever they are.'],
  init(round, ctx) { const r = ctx.rng(round), ker = R(3, () => [0, 0, 0]); if (round === 'play') return { round, ker, im: img(ONE), want: [[-1, 0, 1], [-1, 0, 1], [-1, 0, 1]] }; if (round === 'twist') return { round, ker, a: img(SEVEN), bq: img(ONE) }; return { round, ker, cards: [...R(3, () => [sloppy(SEVEN, r), 1]), ...R(3, () => [sloppy(ONE, r), 0])], th: 0.5 }; },
  draw(b, s) {
    b.clear(); const A = area(b), u = A.u, g = b.g, pic = (m, px, py, sz, cap, sign) => { const c = sz / m[0].length, mx = Math.max(1e-9, ...m.flat().map(Math.abs)); m.forEach((row, y) => row.forEach((v, x) => { const t = v / mx; g.fillStyle = sign ? (t > 0 ? `rgba(230,159,0,${t})` : `rgba(0,114,178,${-t})`) : v ? INK : '#fff'; g.fillRect(px + x * c, py + y * c, c - 1, c - 1); })); b.box(px - 1, py - 1, sz + 1, c * m.length + 1, { color: INK2 }); if (cap) b.label(cap, px, py - 10 * u, { size: 10.5, bold: true }); };
    const kx = A.x + 20 * u, ky = A.y + 40 * u, kc = 52 * u; b.label('Your window', kx, ky - 14 * u, { bold: true }); s.ker.forEach((row, y) => row.forEach((v, x) => card(b, 'k' + y + x, kx + x * kc, ky + y * kc, kc - 4 * u, kc - 4 * u, v > 0 ? '+1' : v < 0 ? '−1' : '0', { size: 15, mono: true, fill: v > 0 ? '#fbe9c8' : v < 0 ? '#dbe9f6' : '#fff' })));
    const X = kx + 3 * kc + 40 * u, S = Math.min(170 * u, (A.w - 3 * kc - 100 * u) / 3);
    if (s.round === 'play') { pic(s.im, X, ky, S, 'The picture'); pic(conv2d(s.im, s.ker), X + S + 26 * u, ky, S, 'What your window finds', true); pic(conv2d(s.im, s.want), X + 2 * (S + 26 * u), ky, S, 'The map to match', true); }
    else if (s.round === 'twist') { pic(s.a, X, ky, S, 'A seven'); pic(conv2d(s.a, s.ker), X + S + 26 * u, ky, S, 'strongest answer ' + maxOf(conv2d(s.a, s.ker)), true); pic(s.bq, X, ky + S + 50 * u, S, 'A one'); pic(conv2d(s.bq, s.ker), X + S + 26 * u, ky + S + 50 * u, S, 'strongest answer ' + maxOf(conv2d(s.bq, s.ker)), true); }
    else { const cs = Math.min(110 * u, (A.w - 3 * kc - 90 * u) / 6 - 10 * u); s.cards.forEach(([m, lab], i) => { const px = X + i * (cs + 10 * u), v = maxOf(conv2d(m, s.ker)), says = v >= s.th ? 1 : 0; pic(m, px, ky, cs, 'card ' + (i + 1)); b.label('answer ' + v, px, ky + cs + 14 * u, { size: 10, mono: true }); b.label('reads it as ' + (says ? '7' : '1'), px, ky + cs + 30 * u, { size: 10.5, bold: true, color: says === lab ? GOOD : WARM }); }); b.view(0, 6, 0, 1); b.pad = { l: (X) / u, r: 30, t: (ky + cs + 60 * u) / u, b: 40 }; b.line(0, 0.5, 6, 0.5, { color: INK2, width: 3 }); [0, 1, 2, 3, 4, 5, 6].forEach((v) => b.text(String(v), v, 0.5, { dy: 14 * u, size: 10, mono: true })); b.handle('th', s.th, 0.5, { color: WARM, label: 'call it a 7 at ' + s.th.toFixed(1) + ' or more' }); b.pad = { l: 46, r: 18, t: 18, b: 38 }; }
  },
  click(s, x, y, id) { if (id?.[0] === 'k') { const r = +id[1], c = +id[2]; s.ker[r][c] = s.ker[r][c] === 1 ? -1 : s.ker[r][c] + 1; } },
  drag(s, id, x) { if (id === 'th') s.th = clamp(Math.round(x * 2) / 2, 0, 6); },
  meter(s) {
    if (s.round === 'play') return meterTo('Match with the grey map', corr(conv2d(s.im, s.ker), conv2d(s.im, s.want)), 0.95, { from: 0, fmt: (v) => v.toFixed(2) });
    if (s.round === 'twist') { const d = maxOf(conv2d(s.a, s.ker)) - maxOf(conv2d(s.bq, s.ker)); return meterTo('Seven’s answer minus one’s', d, 2, { from: 0, fmt: (v) => String(v) }); }
    const ok = s.cards.filter(([m, lab]) => (maxOf(conv2d(m, s.ker)) >= s.th ? 1 : 0) === lab).length; return meterCount('Cards read correctly', ok, 6);
  },
  demo(s) { if (s.round === 'play') s.ker = s.want.map((r) => r.slice()); else { s.ker = [[1, 1, 1], [0, 0, 0], [-1, -1, -1]]; if (s.round === 'case') { for (let t = 0.5; t <= 6; t += 0.5) { s.th = t; if (s.cards.every(([m, lab]) => (maxOf(conv2d(m, s.ker)) >= t ? 1 : 0) === lab)) return; } } } },
};

// ---------- II-15 Through the keyhole ----------
const STROKES = [(x, y) => y === 1 || y === 2, (x, y) => x === 1 || x === 2, (x, y) => x === y || x === y + 1, (x, y) => y === 5 || y === 6, (x, y) => x === 5 || x === 6];
function glyphs(r) { const out = []; for (let k = 0; k < 12; k++) { const use = R(5, () => (r.chance(0.5) ? 1 : 0)); if (!sum(use)) use[r.int(0, 4)] = 1; out.push(R(64, (i) => (STROKES.some((f, j) => use[j] && f(i % 8, Math.floor(i / 8))) ? 1 : 0))); } out.push(R(64, (i) => { const x = i % 8, y = Math.floor(i / 8); return (x + y) % 3 === 0 && x > 2 ? 1 : 0; })); return out; }
const squeezed = new Map();
function squeeze(s) { if (!squeezed.has(s.sig)) { if (squeezed.size > 12) squeezed.clear(); const P = pca(s.X); squeezed.set(s.sig, { mu: P.mu, vec: P.vectors.slice(0, 13) }); } const P = squeezed.get(s.sig); return s.X.map((x) => { const z = P.vec.slice(0, s.k).map((v) => sum(v.map((c, j) => c * (x[j] - P.mu[j])))); return P.mu.map((m, j) => m + sum(z.map((q, f) => q * P.vec[f][j]))); }); }
const errs = (s) => { const Rc = squeeze(s); return s.X.map((x, i) => Math.sqrt(mean(x.map((v, j) => (v - Rc[i][j]) ** 2)))); };
export const II15 = {
  id: 'II-15', name: 'Through the keyhole', short: 'Autoencoders', formula: 'encode: squeeze each picture into k numbers\ndecode: rebuild the picture from those numbers\nerror = how far the rebuilt picture is from the real one',
  limit: 'A narrow code keeps what the pictures have in common. The thing that makes one of them different is the first thing it loses.',
  rounds: { play: { brief: 'Thirteen small pictures pass through a keyhole of k numbers and are rebuilt below. Drag k down as far as you can while the average error stays under the line.' }, twist: { brief: 'With the keyhole set at four numbers, one picture comes out worse than the rest. Tap the one you think it is.' }, case: { brief: 'Thirty-six Common Shelf readers, each stored as sixteen numbers. The bars show how badly each is rebuilt. Tap the five worst.' } },
  hints: { play: ['The pictures are built from five strokes.', 'Five numbers are enough. Four is not quite.'], twist: ['Look for the picture that is not made of the usual strokes.', 'It is the last one.'], case: ['Tall bars.', 'Tap the five tallest bars.'] },
  teach: ['Force each picture through a few numbers.', 'Rebuild it from those numbers and compare.', 'What is rebuilt badly is what was unusual.'],
  init(round, ctx) { const r = ctx.rng(round); if (round === 'case') { const C = ctx.caseData.recon, sample = r.shuffle(C.sample.slice()); return { round, sample, picked: [], k: C.k }; } return { round, X: glyphs(r), sig: r.int(0, 1e9), k: round === 'twist' ? 4 : 12, pick: -1 }; },
  draw(b, s) {
    b.clear(); const A = area(b), u = A.u, g = b.g;
    if (s.round === 'case') { b.view(-0.6, 35.6, 0, Math.max(...s.sample.map((x) => x[0])) * 1.2); b.axes({ x: 'readers', y: 'error when rebuilt from ' + s.k + ' numbers', xt: 0, xfmt: () => '' }); s.sample.forEach(([e, rs], i) => { const on = s.picked.includes(i); b.rect(i - 0.4, 0, 0.8, e, { fill: on ? DATA[1] : DATA[0] }); b.handle('r' + i, i, e, { draw: false, r: 9 }); if (on) b.text(pct(rs) + ' rare', i, e, { dy: -9 * u, size: 9.5 }); }); return; }
    const Rc = squeeze(s), er = errs(s), n = s.X.length, cw = Math.min(74 * u, (A.w - 20 * u) / n), sz = cw - 8 * u, cell = sz / 8, pic = (v, px, py) => { v.forEach((q, i) => { const t = clamp(q, 0, 1), c = Math.round(255 - t * 215); g.fillStyle = `rgb(${c},${c + 4},${c + 12})`; g.fillRect(px + (i % 8) * cell, py + Math.floor(i / 8) * cell, cell, cell); }); b.box(px, py, sz, sz, { color: INK2 }); };
    b.label('Real', A.x, A.y + 14 * u, { bold: true }); b.label('Rebuilt from ' + s.k + ' number' + (s.k === 1 ? '' : 's'), A.x, A.y + 54 * u + sz, { bold: true });
    s.X.forEach((x, i) => { const px = A.x + i * cw; pic(x, px, A.y + 26 * u); pic(Rc[i], px, A.y + 66 * u + sz); if (s.round === 'twist') { b.zone('g' + i, px, A.y + 20 * u, sz, 2 * sz + 60 * u); if (s.pick === i) b.box(px - 3, A.y + 22 * u, sz + 6, 2 * sz + 52 * u, { color: DATA[1], width: 3 }); } b.label(er[i].toFixed(2), px + sz / 2, A.y + 80 * u + 2 * sz, { align: 'center', size: 9.5, mono: true, color: INK2 }); });
    if (s.round === 'play') { b.view(0, 13, 0, 1); b.pad = { l: 40, r: 40, t: (A.y + 2 * sz + 130 * u) / u, b: 40 }; b.line(0, 0.5, 13, 0.5, { color: INK2, width: 3 }); R(14, (v) => b.text(String(v), v, 0.5, { dy: 14 * u, size: 10, mono: true })); b.handle('k', s.k, 0.5, { color: WARM, label: 'keyhole: ' + s.k + ' numbers' }); b.pad = { l: 46, r: 18, t: 18, b: 38 }; }
  },
  click(s, x, y, id) { if (s.round === 'twist' && id?.[0] === 'g') s.pick = +id.slice(1); else if (s.round === 'case' && id?.[0] === 'r') { const i = +id.slice(1); s.picked = s.picked.includes(i) ? s.picked.filter((q) => q !== i) : [...s.picked, i].slice(-5); } },
  drag(s, id, x) { if (id === 'k') s.k = clamp(Math.round(x), 0, 13); },
  kmin(s) { for (let k = 0; k <= 13; k++) if (mean(errs({ ...s, k })) <= 0.08) return k; return 13; },
  meter(s) {
    if (s.round === 'case') { const worst = s.sample.map((x, i) => [x[0], i]).sort((a, c) => c[0] - a[0]).slice(0, 5).map((a) => a[1]), ok = s.picked.filter((i) => worst.includes(i)).length, rp = s.picked.length ? mean(s.picked.map((i) => s.sample[i][1])) : 0; return meterCount('Of the five worst rebuilt, found', ok, 5, s.picked.length ? `rare-subject share of the ones you picked: ${pct(rp)}. Across all thirty-six: ${pct(mean(s.sample.map((x) => x[1])))}.` : ''); }
    const er = errs(s); if (s.round === 'twist') { const worst = er.indexOf(Math.max(...er)); return { label: 'Your pick', text: s.pick < 0 ? 'none yet' : 'picture ' + (s.pick + 1) + (s.pick === worst ? ': the worst rebuilt' : ': not the worst'), frac: s.pick === worst ? 1 : 0.2, met: s.pick === worst }; }
    const km = II15.kmin(s), e = mean(er), ok = e <= 0.08 && s.k <= km; return { label: 'Average error', text: e.toFixed(3) + '   with k = ' + s.k, goal: 'error ≤ 0.08 with the smallest k', frac: ok ? 1 : e <= 0.08 ? 0.7 : clamp(1 - e, 0, 0.6), met: ok };
  },
  demo(s) { if (s.round === 'case') s.picked = s.sample.map((x, i) => [x[0], i]).sort((a, c) => c[0] - a[0]).slice(0, 5).map((a) => a[1]); else if (s.round === 'twist') { const er = errs(s); s.pick = er.indexOf(Math.max(...er)); } else s.k = II15.kmin(s); },
};

export const PART2B = [II9, II10, II11, II12, II13, II14, II15];
