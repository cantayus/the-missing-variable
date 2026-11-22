// Part I, fall. Instruments I-10 to I-17.
import { DATA, INK, INK2, GREY, PALE, GOOD, WARM, SHAPES, nice, pct, clamp, sum, mean, R, nearest, gen, walk, meterTo, meterCount, meterBand, area, card, bars, title, legend, note, spark, wrap, pointShape, bounds } from './lib.js';
import { linreg, ladfit, skewness, histogram, boxcox, betaPdf, quantile } from '../algo/stats.js';
import { itemSim } from '../algo/patterns.js';
import { kmeans, kmeanspp, assign, update, inertia, silhouette } from '../algo/cluster.js';

// ---------- I-10 Punch cards ----------
const shared = (a, b) => a.filter((t) => b.includes(t));
function bestSet(lists, k, among) { const idx = among || lists.map((_, i) => i); let best = null; const rec = (start, cur, tids) => { if (cur.length === k) { if (!best || tids.length > best[1]) best = [cur.slice(), tids.length]; return; } for (let i = start; i < idx.length; i++) rec(i + 1, [...cur, idx[i]], cur.length ? shared(tids, lists[idx[i]]) : lists[idx[i]]); }; rec(0, [], []); return best; }
export const I10 = {
  id: 'I-10', name: 'Punch cards', short: 'Eclat', formula: 'tidlist(A) = the baskets that contain A\nsupport(A and B) = size of tidlist(A) ∩ tidlist(B)',
  limit: 'Intersecting lists counts what happened together. A short list is cheap to count, and says nothing about why it is short.',
  rounds: { play: { brief: 'Each card has a hole for every basket that held that item. Tap two cards to hold them to the light. Find the pair that shares the most holes.' }, twist: { brief: 'Now three cards at once. Find three items that share at least four baskets.' }, case: { brief: 'Three rare titles and three common ones. Count every pair among the rare three. Watch how little work it takes.' } },
  hints: { play: ['Long rows of holes overlap more.', 'Try the two cards with the most holes.'], twist: ['Start from your best pair and add a third.', 'Folio can show you.'], case: ['The rare titles are marked.', 'Tap two rare cards, then the next pair, then the last.'] },
  teach: ['Give each item a list of the baskets it is in.', 'Lay two lists together and keep what they share.', 'The number left is the support of the pair.'],
  init(round, ctx) {
    const r = ctx.rng(round), n = 18;
    if (round === 'case') { const C = ctx.caseData.baskets, pick = [0, 1, 2, 9, 10, 11], rows = C.rows.slice(0, 60), lists = pick.map((j) => rows.map((row, t) => (row.includes(j) ? t : -1)).filter((t) => t >= 0)); return { round, n: 60, k: 2, names: pick.map((j) => C.items[j]), lists, sel: [], seen: {}, rare: [3, 4, 5], cost: 0 }; }
    const base = [0.7, 0.55, 0.45, 0.3, 0.25, 0.2], lists = base.map((p0, i) => R(n, (t) => t).filter((t) => r.chance(i === 1 && r.chance(0.5) ? 0.75 : p0)));
    return { round, n, k: round === 'twist' ? 3 : 2, names: walk(ctx).items, lists, sel: [], seen: {}, rare: [], cost: 0 };
  },
  draw(b, s) {
    b.clear(); const A = area(b), u = A.u, rows = s.lists.length, rh = Math.min(64 * u, (A.h - 90 * u) / rows), hw = (A.w - 190 * u) / s.n, both = s.sel.length === s.k ? s.sel.map((i) => s.lists[i]).reduce(shared) : null;
    title(b, 'Cards', `tap ${s.k} to overlay them`);
    s.lists.forEach((l, i) => { const y = A.y + 50 * u + i * rh, on = s.sel.includes(i); card(b, 'c' + i, A.x, y, A.w, rh - 6 * u, '', { fill: on ? '#fbf3d9' : '#f6f1e4', sel: on }); b.label(s.names[i].slice(0, 22) + (s.rare.includes(i) ? ' (rare)' : ''), A.x + 8 * u, y + (rh - 6 * u) / 2, { size: 10.5, bold: on }); for (let t = 0; t < s.n; t++) { const has = l.includes(t), hit = both && both.includes(t) && on; b.mark(A.x + 180 * u + (t + 0.5) * hw, y + (rh - 6 * u) / 2, Math.min(7 * u, hw * 0.36), 'circle', hit ? DATA[1] : has ? INK : '#fff', has ? null : PALE); } });
    if (both) b.label(`shared holes: ${both.length} of ${s.n} baskets`, A.x + 180 * u, A.y + A.h - 14 * u, { bold: true, size: 13 });
  },
  click(s, x, y, id) { if (id?.[0] !== 'c') return; const i = +id.slice(1); if (s.sel.includes(i)) s.sel = s.sel.filter((q) => q !== i); else { if (s.sel.length >= s.k) s.sel = []; s.sel.push(i); if (s.sel.length === s.k) { const key = s.sel.slice().sort().join('-'); if (!s.seen[key]) { s.seen[key] = s.sel.map((q) => s.lists[q]).reduce(shared).length; s.cost += sum(s.sel.map((q) => s.lists[q].length)); } } } },
  meter(s) {
    if (s.round === 'case') { const need = ['3-4', '3-5', '4-5'], k = need.filter((q) => q in s.seen).length; return meterCount('Rare pairs counted', k, 3, `holes compared so far: ${s.cost}`); }
    const best = bestSet(s.lists, s.k), found = Math.max(0, ...Object.values(s.seen)), target = s.round === 'twist' ? Math.min(4, best[1]) : best[1];
    return meterTo('Most shared holes found', found, target, { fmt: (v) => String(v), note: Object.keys(s.seen).length + ' overlays tried' });
  },
  clean(s) { return Object.keys(s.seen).length <= 4; },
  demo(s) { const pairs = s.round === 'case' ? [[3, 4], [3, 5], [4, 5]] : [bestSet(s.lists, s.k)[0]]; for (const p of pairs) { s.sel = p; s.seen[p.slice().sort().join('-')] = p.map((q) => s.lists[q]).reduce(shared).length; } },
};

// ---------- I-11 Also borrowed ----------
export const I11 = {
  id: 'I-11', name: 'Also borrowed', short: 'Item-to-item', formula: 'count(A, B) = readers who took both\ncosine(A, B) = count / √(readers of A × readers of B)',
  limit: 'Two books borrowed by the same people may be alike, or may both simply have been on the screen.',
  rounds: { play: { brief: 'Rows are readers, columns are books. Tap two columns to lay one over the other. Find the pair with the highest cosine similarity.' }, twist: { brief: 'Counting shared readers alone, one bestseller looks similar to everything. Find a pair with cosine above 0.7 that leaves the bestseller out.' }, case: { brief: 'Fourteen Common Shelf readers and twelve titles. Find the two titles most often borrowed by the same reader.' } },
  hints: { play: ['Look for two columns filled in the same rows.', 'Folio can point at them.'], twist: ['The bestseller is the column that is nearly all filled.', 'Try two thin columns that match.'], case: ['The fullest columns share the most readers.', 'Tap the two fullest columns.'] },
  teach: ['Lay two books\u2019 columns side by side.', 'Count the readers who took both.', 'Divide by how popular each is, or the bestseller wins everything.'],
  variants: [{ id: 'jaccard', name: 'Jaccard' }],
  init(round, ctx) {
    const r = ctx.rng(round);
    if (round === 'case') { const C = ctx.caseData.grid; return { round, grid: C.rows, names: C.titles, sel: [], how: 'count', tried: 0 }; }
    const taste = R(12, () => r.int(0, 2)), cols = [0, 0, 1, 1, 2, 2, 3], grid = taste.map((t) => cols.map((c) => (c === 3 ? (r.chance(0.92) ? 1 : 0) : r.chance(c === t ? 0.85 : 0.08) ? 1 : 0)));
    return { round, grid, names: ['Tide tables', 'Knots', 'Moths', 'Beetles', 'Sonnets', 'Odes', 'The Bestseller'], sel: [], how: 'cosine', best: 6, tried: 0 };
  },
  sim(s, a, b, how) { return itemSim(s.grid, a, b, how || s.how); },
  top(s, how, skip = -1) { let best = null; const n = s.grid[0].length; for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) { if (a === skip || b === skip) continue; const v = I11.sim(s, a, b, how); if (!best || v > best[2]) best = [a, b, v]; } return best; },
  draw(b, s) {
    b.clear(); const A = area(b), u = A.u, n = s.grid[0].length, m = s.grid.length, cw = (A.w - 70 * u) / n, ch = (A.h - 120 * u) / m;
    for (let c = 0; c < n; c++) { const on = s.sel.includes(c), x = A.x + 60 * u + c * cw; if (on) b.box(x + 2, A.y + 70 * u, cw - 4, m * ch + 8 * u, { fill: '#fbf3d9', color: DATA[1], width: 2 }); const g = b.g; g.save(); g.translate(x + cw / 2, A.y + 62 * u); g.rotate(-0.45); b.label(s.names[c].slice(0, 20), 0, 0, { size: 10, bold: on }); g.restore(); b.zone('c' + c, x, A.y + 10 * u, cw, m * ch + 70 * u);
      for (let rr = 0; rr < m; rr++) { const v = s.grid[rr][c], bothOn = s.sel.length === 2 && s.grid[rr][s.sel[0]] && s.grid[rr][s.sel[1]] && on; b.mark(x + cw / 2, A.y + 76 * u + (rr + 0.5) * ch, Math.min(ch, cw) * 0.3, 'square', v ? (bothOn ? DATA[1] : DATA[0]) : '#fff', v ? null : PALE); } }
    for (let rr = 0; rr < m; rr++) b.label('reader ' + (rr + 1), A.x, A.y + 76 * u + (rr + 0.5) * ch, { size: 9.5, color: INK2 });
    if (s.sel.length === 2) b.label(`shared readers ${I11.sim(s, s.sel[0], s.sel[1], 'count')}    cosine ${I11.sim(s, s.sel[0], s.sel[1], 'cosine').toFixed(2)}`, A.x + 60 * u, A.y + A.h - 8 * u, { bold: true, size: 13 });
  },
  click(s, x, y, id) { if (id?.[0] !== 'c') return; const c = +id.slice(1); if (s.sel.includes(c)) s.sel = s.sel.filter((q) => q !== c); else { if (s.sel.length >= 2) s.sel = []; s.sel.push(c); if (s.sel.length === 2) s.tried++; } },
  meter(s, ctx) {
    const how = s.round === 'case' ? 'count' : ctx.variant === 'jaccard' ? 'jaccard' : 'cosine', have = s.sel.length === 2, v = have ? I11.sim(s, s.sel[0], s.sel[1], how) : 0;
    if (s.round === 'twist') { const ok = have && !s.sel.includes(s.best) && I11.sim(s, s.sel[0], s.sel[1], 'cosine') >= 0.7; return { label: 'Cosine, bestseller left out', text: have ? I11.sim(s, s.sel[0], s.sel[1], 'cosine').toFixed(2) + (s.sel.includes(s.best) ? '  (includes the bestseller)' : '') : 'pick two columns', goal: 'goal ≥ 0.70', frac: ok ? 1 : clamp(v, 0, 0.9), met: ok, note: 'By shared readers alone, the top partner of every book is the bestseller.' }; }
    const best = I11.top(s, how); return { label: s.round === 'case' ? 'Readers who took both' : 'Similarity of the pair', text: have ? (how === 'count' ? String(v) : v.toFixed(2)) : 'pick two columns', goal: 'find the highest', frac: have ? clamp(v / best[2], 0, 1) : 0, met: have && v >= best[2] - 1e-9 };
  },
  clean(s) { return s.tried <= 4; },
  demo(s, ctx) { const how = s.round === 'case' ? 'count' : ctx.variant === 'jaccard' ? 'jaccard' : 'cosine', t = s.round === 'twist' ? I11.top(s, 'cosine', s.best) : I11.top(s, how); s.sel = [t[0], t[1]]; },
};

// ---------- I-12 Where will Ceres be? ----------
const sse = (pts, f) => sum(pts.map((p) => (p[1] - f(p[0])) ** 2));
export const I12 = {
  id: 'I-12', name: 'Where will Ceres be?', short: 'Least squares', formula: 'choose the line that makes the sum of squared misses smallest\nR² = 1 − (squared misses) / (squared spread)',
  limit: 'The line describes the points it was fitted to, and past the last of them it is a guess. Nor does a steep slope mean that one thing causes the other.',
  rounds: { play: { brief: 'Each sighting is a dot. Drag the two ends of the line. The squares show how far it misses. Make their total area as small as you can.' }, twist: { brief: 'You only saw the first few weeks. Fit them, then press “Look at day 12”. Bend the path until it finds the planet.' }, case: { brief: 'Each dot is a title: loans last year across, loans this year up (both on a log scale). Fit the line.' } },
  hints: { play: ['Big squares cost far more than small ones.', 'Run the line through the middle of the cloud, with as many dots above as below.'], twist: ['A straight line keeps going straight. An orbit does not.', 'Drag the middle handle downward.'], case: ['Popular last year, popular this year.', 'The line runs corner to corner.'] },
  teach: ['Draw a line and measure how far each dot is from it.', 'Square the misses so big ones count more, and add them up.', 'Move the line until that total is as small as it can be.'],
  variants: [{ id: 'lad', name: 'Least absolute deviations' }],
  init(round, ctx) {
    const r = ctx.rng(round);
    if (round === 'case') { const pts = ctx.caseData.pairs.map((p) => [Math.log10(1 + p[0]), Math.log10(1 + p[1])]); return { round, pts, y0: 2.5, y1: 0.5, x0: 0, x1: 3.6, ylo: -0.2, yhi: 3.8, lx: 'loans last year (log)', ly: 'loans this year (log)' }; }
    if (round === 'twist') { const f = (x) => 2 + 1.5 * x - 0.11 * x * x, pts = R(9, (i) => [0.4 + i * 0.45, f(0.4 + i * 0.45) + r.n(0, 0.12)]); return { round, pts, y0: 2, y1: 14, bend: 0, x0: 0, x1: 13, ylo: 0, yhi: 22, truth: [12, f(12)], look: false, lx: 'days since first sighting', ly: 'position in the sky' }; }
    const W = walk(ctx), a = r.range(1, 3), bb = r.range(0.5, 1.1), pts = gen.line(r, 16, a, bb, 1.1, 0.5, 9.5); return { round, pts, y0: 8, y1: 3, x0: 0, x1: 10, ylo: 0, yhi: 14, lx: W.x, ly: W.y };
  },
  draw(b, s, ctx) {
    b.clear(); b.view(s.x0, s.x1, s.ylo, s.yhi); b.axes({ x: s.lx, y: s.ly }); const f = I12.f(s);
    if (s.round !== 'twist' || !s.look) s.pts.forEach((p) => { const d = f(p[0]) - p[1], side = Math.abs(d); if (ctx.variant === 'lad') b.line(p[0], p[1], p[0], f(p[0]), { color: DATA[1], width: 2 }); else b.rect(p[0], Math.min(p[1], f(p[0])), b.ux(b.X(p[0]) + Math.abs(b.sy(side))) - p[0], side, { fill: DATA[1], alpha: 0.22, color: DATA[1] }); });
    b.fn(f, { color: INK, width: 2 }); s.pts.forEach((p) => b.dot(p[0], p[1], { color: DATA[0] }));
    b.handle('a', s.x0, s.y0, { color: WARM }); b.handle('b', s.x1, s.y1, { color: WARM });
    if (s.round === 'twist') { b.handle('bend', (s.x0 + s.x1) / 2, f((s.x0 + s.x1) / 2), { color: DATA[2], shape: 'diamond', label: 'bend' }); if (s.look) { b.dot(s.truth[0], s.truth[1], { color: DATA[3], r: 8, shape: 'diamond', label: 'Ceres, day 12' }); b.line(12, f(12), 12, s.truth[1], { color: DATA[3], dash: [4, 4] }); } }
  },
  controls(s) { return s.round === 'twist' ? [{ type: 'button', go: !s.look, label: s.look ? 'Hide day 12' : 'Look at day 12', run: () => { s.look = !s.look; } }] : []; },
  meter(s, ctx) {
    const f = I12.f(s);
    if (s.round === 'twist') { const miss = Math.abs(f(12) - s.truth[1]), fit = Math.sqrt(sse(s.pts, f) / s.pts.length); return { label: 'Miss on day 12', text: s.look ? miss.toFixed(2) : 'not looked yet', goal: 'goal ≤ 0.8', frac: s.look ? clamp(1 - miss / 12, 0, 1) : 0, met: s.look && miss <= 0.8 && fit < 0.6, note: `miss on the sightings you had: ${fit.toFixed(2)}` }; }
    if (ctx.variant === 'lad') { const l = ladfit(s.pts.map((p) => p[0]), s.pts.map((p) => p[1])), sad = (g) => sum(s.pts.map((p) => Math.abs(p[1] - g(p[0])))), bestA = sad((x) => l.a + l.b * x); return meterTo('Total length of the misses', sad(f), bestA * 1.08, { lower: true, from: bestA * 4, fmt: (v) => v.toFixed(1), note: 'Absolute misses are less swayed by one far-off dot.' }); }
    const fit = linreg(s.pts.map((p) => p[0]), s.pts.map((p) => p[1])), best = sse(s.pts, (x) => fit.a + fit.b * x), cur = sse(s.pts, f);
    return meterTo('Total area of the squares', cur, best * 1.12, { lower: true, from: best * 6, fmt: (v) => v.toFixed(1), note: `least possible ${best.toFixed(1)};  R² of your line ${(1 - cur / sum(s.pts.map((p) => (p[1] - mean(s.pts.map((q) => q[1]))) ** 2))).toFixed(2)}` });
  },
};
// the path is a line plus a bend: f(x) = line(x) + bend · 0.04 · (x − x0)(x − x1)
I12.f = (s) => { const m = (s.y1 - s.y0) / (s.x1 - s.x0); return (x) => s.y0 + m * (x - s.x0) + (s.bend || 0) * 0.04 * (x - s.x0) * (x - s.x1); };
I12.drag = (s, id, x, y) => { if (id === 'a') s.y0 = clamp(y, s.ylo, s.yhi); else if (id === 'b') s.y1 = clamp(y, s.ylo - 8, s.yhi + 8); else if (id === 'bend') { const mid = (s.x0 + s.x1) / 2, lin = (s.y0 + s.y1) / 2; s.bend = clamp((y - lin) / (0.04 * (mid - s.x0) * (mid - s.x1)), -6, 6); } };
I12.demo = (s, ctx) => { if (ctx?.variant === 'lad' && s.round !== 'twist') { const l = ladfit(s.pts.map((p) => p[0]), s.pts.map((p) => p[1])); s.y0 = l.a + l.b * s.x0; s.y1 = l.a + l.b * s.x1; return; } if (s.round === 'twist') { s.look = true; const f = (x) => 2 + 1.5 * x - 0.11 * x * x, mid = (s.x0 + s.x1) / 2; s.y0 = f(s.x0); s.y1 = f(s.x1); s.bend = (f(mid) - (s.y0 + s.y1) / 2) / (0.04 * (mid - s.x0) * (mid - s.x1)); } else { const fit = linreg(s.pts.map((p) => p[0]), s.pts.map((p) => p[1])); s.y0 = fit.a + fit.b * s.x0; s.y1 = fit.a + fit.b * s.x1; } };

// ---------- I-13 Three questions ----------
const JOBS = { play: [['How many buses ran late last month?', 0], ['How many riders will wait at this stop tomorrow?', 1], ['Would a second door on each bus cut the delays?', 2]], case: [['How many loans did each branch make last year?', 0], ['Which titles will be borrowed next month?', 1], ['Did Marginalia narrow what people read?', 2]] };
const TOOLS = { play: ['Count and chart the records', 'Fit a model and test it on new days', 'Try it on some buses chosen by coin'], case: ['Count and chart the loan log', 'Marginalia\u2019s prediction score', 'Show some readers shelves chosen by coin'] };
export const I13 = {
  id: 'I-13', name: 'Three questions', short: 'Describe, predict, explain', formula: 'describe: what happened?\npredict: what will happen?\nexplain: what would happen if we changed something?',
  limit: 'Sorting the question does not answer it. It only stops you answering a different one by mistake.',
  rounds: { play: { brief: 'Three requests have come in. Tap a tool, then the request it suits. One asks what happened, one what will happen, one what would happen if.' }, twist: { brief: 'Ice-cream sales predict sunburn very well. Cut sunburn below 20 cases a day. Drag any dial and see which one works.' }, case: { brief: 'Three requests from the Common Shelf. Give each the tool that can answer it.' } },
  hints: { play: ['“Would” is the word to watch.', 'Counting describes. A tested model predicts. A coin explains.'], twist: ['A good predictor is not always a cause.', 'Turn down the hours of strong sun, or turn up the sunscreen.'], case: ['Which tool did the board use for the third question?', 'A prediction score cannot answer a “did it cause” question.'] },
  teach: ['Ask what kind of question it is: what happened, what will, or what if.', 'Pick the tool made for that kind.', 'Do not let a good prediction stand in for an explanation.'],
  init(round) { if (round === 'twist') return { round, ice: 80, sun: 8, cream: 10 }; return { round, put: [-1, -1, -1], sel: -1, msg: '' }; },
  burn(s) { return Math.max(0, 6 * s.sun * (1 - s.cream / 100)); },
  draw(b, s) {
    b.clear(); const A = area(b), u = A.u;
    if (s.round === 'twist') { b.view(0, 10, 0, 110); b.axes({ yt: 5, xt: 0, xfmt: () => '', y: '' }); const dials = [['ice creams sold (hundreds)', s.ice, 'ice', DATA[0]], ['hours of strong sun × 10', s.sun * 10, 'sun', DATA[1]], ['people using sunscreen %', s.cream, 'cream', DATA[2]]]; dials.forEach(([nm, v, id, col], i) => { const x = 1.6 + i * 2.3; b.rect(x - 0.5, 0, 1, v, { fill: col, alpha: 0.75 }); b.handle(id, x, v, { color: col, label: nice(v) }); b.text(nm, x, 0, { dy: 14 * u, size: 10 }); }); const bn = I13.burn(s); b.rect(8.3, 0, 1, bn, { fill: DATA[3] }); b.text('sunburn cases ' + Math.round(bn), 8.8, bn, { dy: -10 * u, bold: true }); b.line(7.9, 20, 9.8, 20, { color: INK, dash: [5, 4] }); b.text('goal', 9.6, 20, { dy: -8 * u, size: 10 }); return; }
    const jobs = JOBS[s.round], tools = TOOLS[s.round], jw = A.w / 3; title(b, 'Requests', 'tap a tool, then a request');
    jobs.forEach(([q], i) => { const x = A.x + i * jw + 4 * u, y = A.y + 56 * u, h = A.h * 0.42; b.box(x, y, jw - 8 * u, h, { fill: '#f6f8fa', color: INK2 }); wrap(b, q, x + 10 * u, y + 20 * u, jw - 28 * u, { size: 12.5, bold: true }); b.zone('j' + i, x, y, jw - 8 * u, h); const t = s.put[i]; if (t >= 0) card(b, null, x + 10 * u, y + h - 58 * u, jw - 28 * u, 46 * u, tools[t], { size: 10.5, fill: t === jobs[i][1] ? '#e3efe9' : '#fbe9e2', mark: t === jobs[i][1] ? GOOD : WARM }); });
    tools.forEach((t, i) => { if (!s.put.includes(i)) card(b, 't' + i, A.x + i * jw + 4 * u, A.y + A.h - 80 * u, jw - 8 * u, 50 * u, t, { sel: s.sel === i, size: 11 }); });
    if (s.msg) note(b, s.msg, A.x + 4 * u, A.y + A.h * 0.42 + 80 * u, { color: WARM });
  },
  click(s, x, y, id) { if (!id || s.round === 'twist') return; if (id[0] === 't') s.sel = +id.slice(1); else if (id[0] === 'j' && s.sel >= 0) { const j = +id.slice(1), was = s.put[j]; s.put = s.put.map((t) => (t === s.sel ? -1 : t)); s.put[j] = s.sel; const ok = JOBS[s.round][j][1] === s.sel; s.msg = ok ? '' : s.round === 'case' && j === 2 && s.sel === 1 ? 'That is what the board did. A score for guessing the next loan cannot say what caused it.' : 'That tool answers a different kind of question.'; s.sel = -1; } else if (id[0] === 'j') { const j = +id.slice(1); s.put[j] = -1; } },
  drag(s, id, x, y) { if (id === 'ice') s.ice = clamp(Math.round(y), 0, 100); else if (id === 'sun') s.sun = clamp(Math.round(y) / 10, 0, 10); else if (id === 'cream') s.cream = clamp(Math.round(y), 0, 100); },
  meter(s) { if (s.round === 'twist') return meterTo('Sunburn cases a day', I13.burn(s), 20, { lower: true, from: 48, fmt: (v) => String(Math.round(v)), note: 'Ice-cream sales and sunburn both follow the sun.' }); return meterCount('Requests matched', s.put.filter((t, i) => t === JOBS[s.round][i][1]).length, 3); },
  clean(s) { return !s.msg; },
  demo(s) { if (s.round === 'twist') s.sun = 3; else { s.put = [0, 1, 2]; s.msg = ''; } },
};

// ---------- I-14 Before and after ----------
export const I14 = {
  id: 'I-14', name: 'Before and after', short: 'Bayes\u2019 rule', formula: 'posterior ∝ prior × likelihood\nwith a Beta(a, b) prior and k late out of n:\nposterior = Beta(a + k, b + n − k)',
  limit: 'Where you end up depends on where you started. With little data, two honest people with different priors can look at the same evidence and still disagree.',
  rounds: { play: { brief: 'How often does this book come back late? Drag the hill to set your belief. Then reveal returns one by one until your belief settles on the true rate.' }, twist: { brief: 'This belief is stubborn and wrong. Twenty returns cannot move it. Drag the hill lower and wider, to hold the belief more loosely, and try again.' }, case: { brief: 'A new reader loves poetry. Marginalia starts from what the average reader borrows. Reveal loans until it believes this reader likes poetry more than not.' } },
  hints: { play: ['Press “Reveal a return” a number of times.', 'Twenty returns is plenty if the hill starts low and wide.'], twist: ['A tall, narrow hill means “I am sure”.', 'Drag the top of the hill down, then reveal again.'], case: ['The starting belief says poetry is rare.', 'Keep revealing. Count how many loans it takes.'] },
  teach: ['Start with a belief, drawn as a hill.', 'Each new observation pulls the hill toward what was seen.', 'The more sure you were, the more evidence it takes to move you.'],
  init(round, ctx) { const r = ctx.rng(round), truth = round === 'case' ? 0.8 : r.range(0.25, 0.4), obs = r.shuffle(R(40, (i) => (i < Math.round(truth * 40) ? 1 : 0))); return round === 'play' ? { round, truth, obs, k: 0, m: 0.6, w: 6 } : round === 'twist' ? { round, truth, obs, k: 20, m: 0.85, w: 400 } : { round, truth, obs, k: 0, m: 0.06, w: 12, fixed: true }; },
  post(s) { const k = sum(s.obs.slice(0, s.k)), a = s.m * s.w + k, b = (1 - s.m) * s.w + s.k - k; return { a, b, mean: a / (a + b) }; },
  draw(b, s) {
    b.clear(); const P = I14.post(s), a0 = s.m * s.w, b0 = (1 - s.m) * s.w, peak = Math.max(...R(99, (i) => Math.max(betaPdf((i + 1) / 100, a0, b0), betaPdf((i + 1) / 100, P.a, P.b))), 1);
    b.view(0, 1, 0, peak * 1.2); b.axes({ x: s.round === 'case' ? 'share of this reader\u2019s loans that are poetry' : 'chance the book comes back late', yt: 0, yfmt: () => '', xfmt: (v) => pct(v) });
    b.fn((x) => betaPdf(x, a0, b0), { color: GREY, width: 2, dash: [5, 4], n: 200 }); b.fn((x) => betaPdf(x, P.a, P.b), { color: DATA[0], width: 2.5, n: 200 });
    b.line(s.truth, 0, s.truth, peak * 1.15, { color: DATA[3], dash: [2, 4] }); b.text('true rate', s.truth, peak * 1.15, { size: 10, color: DATA[3] });
    if (!s.fixed) b.handle('hill', s.m, Math.min(peak * 1.1, betaPdf(clamp((a0 - 1) / Math.max(1e-6, a0 + b0 - 2), 0.01, 0.99), a0, b0)), { color: WARM, label: 'your belief before' });
    const A = area(b), u = A.u; s.obs.slice(0, s.k).forEach((o, i) => b.mark(A.x + 60 * u + i * 13 * u, A.y + 12 * u, 4.5 * u, o ? 'square' : 'ring', o ? DATA[1] : INK2)); legend(b, [['before', GREY], ['after ' + s.k + ' seen', DATA[0]]], A.x + 60 * u, A.y + 30 * u);
  },
  drag(s, id, x, y) { if (id !== 'hill') return; s.m = clamp(x, 0.03, 0.97); const t = clamp(y / 14, 0.02, 1); s.w = clamp(2 + 400 * t * t, 2, 400); },
  controls(s) { return [{ type: 'button', go: true, label: s.round === 'case' ? 'Reveal a loan' : 'Reveal a return', disabled: s.k >= 40, run: () => { s.k = Math.min(40, s.k + 1); } }, { type: 'button', label: 'Reveal five', disabled: s.k >= 40, run: () => { s.k = Math.min(40, s.k + 5); } }, s.round === 'case' ? { type: 'note', text: `loans seen: ${s.k}` } : { type: 'button', label: 'Start the returns again', run: () => { s.k = 0; } }]; },
  meter(s) { const P = I14.post(s); if (s.round === 'case') return meterTo('Belief that this reader likes poetry', P.mean, 0.5, { fmt: (v) => pct(v), from: 0.06, note: `after ${s.k} loans, ${sum(s.obs.slice(0, s.k))} of them poetry` }); const err = Math.abs(P.mean - s.truth); return { label: 'Your belief now', text: pct(P.mean) + '  (true rate ' + pct(s.truth) + ')', goal: 'within 6 points, after 20 or more', frac: clamp(1 - err / 0.5, 0, s.k >= 20 ? 1 : 0.8), met: err <= 0.06 && s.k >= 20 }; },
  demo(s) { if (s.round === 'case') { while (I14.post(s).mean < 0.5 && s.k < 40) s.k++; } else { s.w = 4; s.m = 0.5; s.k = 40; } },
};

// ---------- I-15 The workbench ----------
export const I15 = {
  id: 'I-15', name: 'The workbench', short: 'Transform, bin, merge', formula: 'Box–Cox: y = (x^λ − 1) / λ, and log x when λ = 0\nskew near 0 means the two sides balance',
  limit: 'Every tidy step throws something away. What goes first is whatever was rare.',
  rounds: { play: { brief: 'These amounts have a long tail to the right. Drag the power dial until the histogram stands up straight and the skew is near zero.' }, twist: { brief: 'Four bins of equal width put nearly everything in the first. Drag the three bin edges until each bin holds a quarter of the dots.' }, case: { brief: 'Forty subjects by their share of loans. Drag the line to 1%. Everything below it will be merged into “Other”.' } },
  hints: { play: ['A power below 1 pulls the tail in.', 'Try a power near 0. That is the logarithm.'], twist: ['The dots are crowded on the left.', 'Move all three edges left, among the crowded dots.'], case: ['The line shows its own value.', 'Drag it to 1.0%.'] },
  teach: ['Look at the shape before you model.', 'Squeeze a long tail with a log or a power.', 'Merging small groups is tidy, and it erases them.'],
  init(round, ctx) { const r = ctx.rng(round); if (round === 'case') return { round, sh: ctx.caseData.subjectShare, cut: 0.05 }; const v = gen.skew(r, 120, 2.2, 0.8); return round === 'play' ? { round, v, lam: 1 } : { round, v: v.slice(0, 80).sort((a, b) => a - b), e: [0.25, 0.5, 0.75].map((q) => q * Math.max(...v.slice(0, 80))), max: Math.max(...v.slice(0, 80)) }; },
  draw(b, s) {
    b.clear(); const A = area(b), u = A.u;
    if (s.round === 'play') { const t = s.v.map((x) => boxcox(x, s.lam)), h = histogram(t, 18); bars(b, h.counts, A.x + 30 * u, A.y + 30 * u, A.w - 60 * u, A.h - 150 * u, { color: DATA[0], gap: 0.08 }); b.label('transformed amounts', A.x + A.w / 2, A.y + A.h - 104 * u, { align: 'center', size: 10.5, color: INK2 }); b.view(-1, 2, 0, 1); b.pad = { l: 60, r: 60, t: b.h / b.u - 80, b: 30 }; b.line(-1, 0.5, 2, 0.5, { color: INK2, width: 3 }); [-1, -0.5, 0, 0.5, 1, 1.5, 2].forEach((v) => b.text(String(v), v, 0.5, { dy: 16 * u, size: 10, mono: true })); b.handle('lam', s.lam, 0.5, { color: WARM, label: 'power λ = ' + s.lam.toFixed(2) }); b.pad = { l: 46, r: 18, t: 18, b: 38 }; return; }
    if (s.round === 'twist') { b.view(0, s.max, -1, 4); b.axes({ x: 'amount', yt: 0, yfmt: () => '', grid: false }); const cnt = I15.counts(s); s.v.forEach((x, i) => b.dot(x, 0.3 + (i % 9) * 0.22, { r: 3, color: DATA[0], alpha: 0.8 })); [0, ...s.e, s.max].forEach((e, i, arr) => { if (i < 4) { b.rect(e, 2.6, arr[i + 1] - e, 0.8, { fill: i % 2 ? '#eef2f6' : '#e3e8ef', color: INK2 }); b.text(cnt[i] + ' dots', (e + arr[i + 1]) / 2, 3, { size: 10.5, mono: true }); } }); s.e.forEach((e, i) => { b.line(e, -0.2, e, 3.4, { color: WARM, width: 2 }); b.handle('e' + i, e, 2.4, { color: WARM, shape: 'diamond' }); }); return; }
    b.view(-0.6, 39.6, 0, Math.max(...s.sh) * 1.1); b.axes({ x: 'subjects, most borrowed first', y: 'share of loans', xt: 0, xfmt: () => '', yfmt: (v) => pct(v) }); s.sh.forEach((v, i) => b.rect(i - 0.38, 0, 0.76, v, { fill: v >= s.cut ? DATA[0] : GREY })); b.line(-0.6, s.cut, 39.6, s.cut, { color: WARM, width: 2, dash: [6, 4] }); b.handle('cut', 38, s.cut, { color: WARM, label: 'merge below ' + pct(s.cut, 1) });
  },
  counts(s) { const e = [0, ...s.e, Infinity]; return [0, 1, 2, 3].map((i) => s.v.filter((x) => x >= e[i] && x < e[i + 1]).length); },
  drag(s, id, x, y) { if (id === 'lam') s.lam = clamp(Math.round(x * 20) / 20, -1, 2); else if (id === 'cut') s.cut = clamp(Math.round(y * 1000) / 1000, 0.001, 0.12); else if (id?.[0] === 'e') { const i = +id[1]; s.e[i] = clamp(x, i ? s.e[i - 1] + 0.01 : 0.01, i < 2 ? s.e[i + 1] - 0.01 : s.max); } },
  meter(s, ctx) {
    if (s.round === 'play') return meterTo('Skew (0 is balanced)', Math.abs(skewness(s.v.map((x) => boxcox(x, s.lam)))), 0.25, { lower: true, from: 3, fmt: (v) => v.toFixed(2) });
    if (s.round === 'twist') { const c = I15.counts(s), off = Math.max(...c.map((n) => Math.abs(n - 20))); return meterTo('Most any bin is off by', off, 3, { lower: true, from: 50, fmt: (v) => v + ' dots' }); }
    const n = s.sh.filter((v) => v < s.cut).length; return { label: 'Subjects merged into “Other”', text: `${n} of 40`, goal: 'cut at 1.0%', frac: clamp(1 - Math.abs(s.cut - 0.01) / 0.05, 0, 1), met: Math.abs(s.cut - 0.01) < 0.0006, note: `together they hold ${pct(sum(s.sh.filter((v) => v < s.cut)))} of loans` };
  },
  demo(s) { if (s.round === 'play') { let best = [9, 0]; for (let l = -1; l <= 2.001; l += 0.05) { const k = Math.abs(skewness(s.v.map((x) => boxcox(x, l)))); if (k < best[0]) best = [k, Math.round(l * 20) / 20]; } s.lam = best[1]; } else if (s.round === 'twist') s.e = [0.25, 0.5, 0.75].map((q) => quantile(s.v, q)); else s.cut = 0.01; },
};

// ---------- I-16 Drop the centroids ----------
function lloyd(s) { const pts = s.pts.map((p) => [p[0], p[1]]); s.lab = assign(pts, s.c); s.c = update(pts, s.lab, s.c.length, s.c); s.lab = assign(pts, s.c); s.steps++; }
const inert = (s) => { const pts = s.pts.map((p) => [p[0], p[1]]); return inertia(pts, assign(pts, s.c), s.c); };
export const I16 = {
  id: 'I-16', name: 'Drop the centroids', short: 'k-means', formula: 'repeat: give each point to its nearest centre,\nthen move each centre to the mean of its points\ninertia = sum of squared distances to the centres',
  limit: 'k-means will hand back k round groups of similar size whether or not the data have any, and it makes every point belong to exactly one of them.',
  rounds: { play: { brief: 'Drag the markers into the field, then press “One round”: each dot joins its nearest marker and each marker moves to the middle of its dots. Bring the inertia down to the goal.' }, twist: { brief: 'These markers started in a bad place and got stuck. Running again changes nothing. Drag them out of the rut and run again.' }, case: { brief: 'Readers in year one, placed by what they borrow. Marginalia 2 used eight clusters. Place eight markers and run until they settle well.' } },
  hints: { play: ['One marker for each clump.', 'Drop a marker in the middle of each clump and press “Run until still”.'], twist: ['Two markers are sharing one clump.', 'Drag one of the sharing markers to the clump that has none.'], case: ['Spread the markers out before you run.', 'Folio can place them.'] },
  teach: ['Put down as many markers as you want groups.', 'Give each dot to its nearest marker, then move each marker to the middle of its dots.', 'Repeat until nothing moves. Where you start can change where you end.'],
  init(round, ctx) {
    const r = ctx.rng(round); let pts, k, c;
    if (round === 'case') { pts = ctx.caseData.readers.first.map((p) => [p[0] * 10, p[1] * 10, p[2]]); k = 8; const bd = bounds(pts, 0); c = R(k, (i) => [bd[0] + 0.3 + i * 0.2, bd[3] - 0.3]); }
    else if (round === 'twist') { const cs = [[2, 2], [8, 2], [2, 8], [8, 8]]; pts = gen.blobs(r, cs, 22, 0.8); k = 4; c = [[1.6, 1.8], [2.4, 2.2], [7.6, 5], [5, 8.2]]; }
    else { const cs = [[2.5, 3], [7.5, 2.5], [5, 8]]; pts = gen.blobs(r, cs, 24, 0.9); k = 3; c = [[0.6, 9.4], [1.4, 9.4], [2.2, 9.4]]; }
    const P = pts.map((p) => [p[0], p[1]]); let best = Infinity; const rr = ctx.rng('best'); for (let i = 0; i < 8; i++) best = Math.min(best, kmeans(P, kmeanspp(P, k, rr)).inertia);
    const s = { round, pts, c, lab: null, steps: 0, best, bd: bounds(pts, 0.8) }; if (round === 'twist') { for (let i = 0; i < 12; i++) lloyd(s); s.steps = 0; } return s;
  },
  draw(b, s) { b.clear(); b.view(...s.bd, true); b.axes({ xt: 0, yt: 0, xfmt: () => '', yfmt: () => '', grid: false }); s.pts.forEach((p, i) => b.dot(p[0], p[1], { color: s.lab ? DATA[s.lab[i] % 6] : GREY, shape: s.lab ? SHAPES[s.lab[i] % 6] : 'circle', r: 3.6 })); s.c.forEach((c, j) => b.handle('c' + j, c[0], c[1], { color: DATA[j % 6], shape: SHAPES[j % 6], r: 10 })); },
  drag(s, id, x, y) { if (id?.[0] === 'c') { s.c[+id.slice(1)] = [clamp(x, s.bd[0], s.bd[1]), clamp(y, s.bd[2], s.bd[3])]; s.lab = assign(s.pts.map((p) => [p[0], p[1]]), s.c); } },
  controls(s) { return [{ type: 'button', go: true, label: 'One round', run: () => lloyd(s) }, { type: 'button', label: 'Run until still', run: () => { for (let i = 0; i < 40; i++) lloyd(s); } }]; },
  meter(s) { return meterTo('Inertia', inert(s), s.best * (s.round === 'case' ? 1.15 : 1.06), { lower: true, from: s.best * 8, fmt: (v) => v.toFixed(1), note: `rounds run: ${s.steps}` }); },
  demo(s, ctx) { const P = s.pts.map((p) => [p[0], p[1]]), rr = ctx.rng('demo'); let best = null; for (let i = 0; i < 10; i++) { const k = kmeans(P, kmeanspp(P, s.c.length, rr)); if (!best || k.inertia < best.inertia) best = k; } s.c = best.cents; s.lab = best.labels; s.steps = best.iters; },
};

// ---------- I-17 Spin for seeds ----------
export const I17 = {
  id: 'I-17', name: 'Spin for seeds', short: 'k-means++ and choosing k', formula: 'pick the next seed with chance ∝ (distance to nearest seed)²\nsilhouette = (b − a) / max(a, b): a is the distance to your own group, b to the next nearest',
  limit: 'A silhouette score rewards compact, well-separated blobs. Groups of another shape score badly even when they are real.',
  rounds: { play: { brief: 'Choose four starting points by tapping dots. The rings show how far each dot is from your seeds. Far is good. Then the method runs. Reach the goal.' }, twist: { brief: 'Two crescents. Drag the marker to try each number of groups. Find the number the silhouette score likes best. Is it two?' }, case: { brief: 'Silhouette scores for Common Shelf readers, in year one and in year six. Drag the marker to the best number of groups for year one.' } },
  hints: { play: ['Pick one seed in each clump.', 'After the first seed, always take a dot with a big ring.'], twist: ['Try every number.', 'The score peaks where the crescents are chopped into round pieces.'], case: ['Higher is better.', 'The year-one line peaks on the right.'] },
  teach: ['Start with seeds that are far apart.', 'Try several numbers of groups and score each.', 'Check the picture: a good score is not proof of real groups.'],
  init(round, ctx) {
    const r = ctx.rng(round);
    if (round === 'case') { const C = ctx.caseData.k; return { round, a: C.silFirst, bq: C.silLast, k: 2 }; }
    if (round === 'twist') { const pts = gen.moons(r, 45, 0.14), P = pts.map((p) => [p[0], p[1]]), rr = ctx.rng('k'), sil = [], labs = []; for (let k = 2; k <= 8; k++) { let best = null; for (let i = 0; i < 4; i++) { const res = kmeans(P, kmeanspp(P, k, rr)), sc = silhouette(P, res.labels); if (!best || sc > best[0]) best = [sc, res.labels]; } sil.push(best[0]); labs.push(best[1]); } return { round, pts, sil, labs, k: 2, bd: bounds(pts, 0.5), seen: {} }; }
    const pts = gen.blobs(r, [[2, 2.5], [8, 2], [3, 8], [8.5, 7.5]], 20, 0.85), P = pts.map((p) => [p[0], p[1]]); let best = Infinity; const rr = ctx.rng('b'); for (let i = 0; i < 8; i++) best = Math.min(best, kmeans(P, kmeanspp(P, 4, rr)).inertia);
    return { round, pts, seeds: [], lab: null, c: null, inertia: null, best, bd: bounds(pts, 0.8) };
  },
  draw(b, s) {
    b.clear();
    if (s.round === 'case') { b.view(1.5, 10.5, 0, Math.max(...s.a) * 1.25); b.axes({ x: 'number of groups k', y: 'silhouette', xt: 9, xfmt: (v) => String(Math.round(v)) }); b.path(s.a.map((v, i) => [i + 2, v]), { color: DATA[0], width: 2.5 }); b.path(s.bq.map((v, i) => [i + 2, v]), { color: DATA[3], width: 2.5, dash: [6, 4] }); s.a.forEach((v, i) => b.dot(i + 2, v, { color: DATA[0] })); s.bq.forEach((v, i) => b.dot(i + 2, v, { color: DATA[3], shape: 'square' })); const A = area(b); legend(b, [['year one', DATA[0]], ['year six', DATA[3], 'square']], A.x + 60 * A.u, A.y + 10 * A.u); b.handle('k', s.k, s.a[s.k - 2], { color: WARM, shape: 'diamond', label: 'k = ' + s.k }); return; }
    b.view(...s.bd, true); b.axes({ xt: 0, yt: 0, xfmt: () => '', yfmt: () => '', grid: false });
    if (s.round === 'twist') { const lab = s.labs[s.k - 2]; s.pts.forEach((p, i) => b.dot(p[0], p[1], { color: DATA[lab[i] % 6], shape: SHAPES[lab[i] % 6], r: 4 })); const A = area(b), u = A.u; s.sil.forEach((v, i) => { const x = A.x + 70 * u + i * 62 * u; b.box(x, A.y + A.h - 22 * u, 54 * u, -Math.max(2, v * 90 * u), { fill: i + 2 === s.k ? DATA[1] : PALE }); b.label('k=' + (i + 2), x + 27 * u, A.y + A.h - 10 * u, { align: 'center', size: 10, mono: true }); b.zone('k' + (i + 2), x, A.y + A.h - 80 * u, 54 * u, 80 * u); }); b.label('silhouette ' + s.sil[s.k - 2].toFixed(2), A.x + 70 * u, A.y + 14 * u, { bold: true }); return; }
    const P = s.pts.map((p) => [p[0], p[1]]); s.pts.forEach((p, i) => { const isSeed = s.seeds.includes(i), d = s.seeds.length ? Math.min(...s.seeds.map((j) => Math.hypot(p[0] - P[j][0], p[1] - P[j][1]))) : 0; if (!s.lab && s.seeds.length && !isSeed) b.circle(p[0], p[1], d * 0.09, { color: DATA[1], alpha: 0.5, width: 1 }); b.handle('p' + i, p[0], p[1], { draw: false, r: 6 }); b.dot(p[0], p[1], { color: isSeed ? WARM : s.lab ? DATA[s.lab[i] % 6] : INK2, shape: isSeed ? 'diamond' : s.lab ? SHAPES[s.lab[i] % 6] : 'circle', r: isSeed ? 8 : 4 }); });
  },
  click(s, x, y, id) { if (s.round === 'twist' && id?.[0] === 'k') { s.k = +id.slice(1); s.seen[s.k] = 1; return; } if (s.round !== 'play' || id?.[0] !== 'p') return; const i = +id.slice(1); if (s.lab) { s.seeds = []; s.lab = null; s.inertia = null; } if (!s.seeds.includes(i)) s.seeds.push(i); if (s.seeds.length === 4) { const P = s.pts.map((p) => [p[0], p[1]]), res = kmeans(P, s.seeds.map((j) => P[j])); s.lab = res.labels; s.inertia = res.inertia; } },
  drag(s, id, x) { if (id === 'k') s.k = clamp(Math.round(x), 2, 10); },
  meter(s) {
    if (s.round === 'play') return s.inertia == null ? { label: 'Seeds chosen', text: s.seeds.length + ' of 4', frac: s.seeds.length / 8, met: false } : meterTo('Inertia after running', s.inertia, s.best * 1.06, { lower: true, from: s.best * 4, fmt: (v) => v.toFixed(1), note: 'Tap a dot to start again with new seeds.' });
    if (s.round === 'twist') { const best = s.sil.indexOf(Math.max(...s.sil)) + 2; return { label: 'Number of groups', text: 'k = ' + s.k + (s.k === best ? ': the highest score' : ''), frac: s.k === best ? 1 : 0.3, met: s.k === best && Object.keys(s.seen).length >= 3, note: best === 2 ? 'Here the score agrees with your eyes.' : 'The score prefers ' + best + ' round pieces to two crescents.' }; }
    const best = s.a.indexOf(Math.max(...s.a)) + 2; return { label: 'Year one, best number of groups', text: 'k = ' + s.k + '  silhouette ' + s.a[s.k - 2].toFixed(2), frac: s.k === best ? 1 : 0.3, met: s.k === best, note: `year six never rises above ${Math.max(...s.bq).toFixed(2)}` };
  },
  demo(s, ctx) { if (s.round === 'case') s.k = s.a.indexOf(Math.max(...s.a)) + 2; else if (s.round === 'twist') { s.seen = { 2: 1, 3: 1, 4: 1 }; s.k = s.sil.indexOf(Math.max(...s.sil)) + 2; } else { const P = s.pts.map((p) => [p[0], p[1]]); let best = null; for (let t = 0; t < 12; t++) { const seeds = [0, 1, 2, 3].map((c) => c * 20 + ((t * 7 + c * 3) % 20)), res = kmeans(P, seeds.map((j) => P[j])); if (!best || res.inertia < best[1].inertia) best = [seeds, res]; } s.seeds = best[0]; s.lab = best[1].labels; s.inertia = best[1].inertia; } },
};

export const PART1B = [I10, I11, I12, I13, I14, I15, I16, I17];
