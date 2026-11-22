// Part I, fall. Instruments I-18 to I-25.
import { DATA, INK, INK2, GREY, PALE, GOOD, WARM, SHAPES, nice, pct, clamp, sum, mean, R, gen, walk, meterTo, meterCount, area, card, bars, title, legend, note, wrap, bounds } from './lib.js';
import { linreg, polyfit } from '../algo/stats.js';
import { dbscan, minkowski, cosine, knn, euclid } from '../algo/cluster.js';
import { logistic, sigmoid, isolationForest, confusion, metrics } from '../algo/classify.js';

// ---------- I-18 Ripples ----------
function scan(s) { const P = s.pts.map((p) => [p[0], p[1]]); return dbscan(P, s.eps, s.minPts); }
function agree(s, res) { const maj = {}; s.pts.forEach((p, i) => { if (p[2] >= 0 && res.labels[i] >= 0) { (maj[res.labels[i]] ||= {})[p[2]] = (maj[res.labels[i]][p[2]] || 0) + 1; } }); const top = {}; for (const [c, m] of Object.entries(maj)) top[c] = +Object.entries(m).sort((a, b) => b[1] - a[1])[0][0]; const used = new Set(Object.values(top)); let ok = 0; s.pts.forEach((p, i) => { const l = res.labels[i]; if (p[2] < 0) ok += l < 0 ? 1 : 0; else if (l >= 0 && top[l] === p[2]) ok++; }); const dup = Object.values(top).length - used.size; return ok / s.pts.length - dup * 0.15; }
export const I18 = {
  id: 'I-18', name: 'Ripples', short: 'DBSCAN', formula: 'a core point has at least MinPts points within Eps\na cluster is every point you can reach from core to core\nwhat is left over is noise',
  limit: 'One ring size has to suit the whole map. Where points are thin, real groups are written off as noise.',
  rounds: { play: { brief: 'Houses along a river bend, a few out in the fields. Drag the ring to set how near is near. Get the two banks as two clusters and the strays as noise.' }, twist: { brief: 'A crowded village and a scattered one. Shrink the ring until the crowded village is still one cluster. See what the method now calls the other.' }, case: { brief: 'Common Shelf readers in year six, placed by what they read. Grow the ring until most readers of common subjects are in clusters. Look at who is left grey.' } },
  hints: { play: ['Too small and everything is noise. Too large and the banks join.', 'Make the ring about as wide as the gap between neighbours on one bank.'], twist: ['Keep shrinking.', 'Stop when the scattered village has turned grey.'], case: ['Start small and grow.', 'Orange diamonds read rare subjects.'] },
  teach: ['Draw a ring around a point and count its neighbours.', 'Enough neighbours makes it a core point, and cores that touch join up.', 'Whatever no core can reach is called noise.'],
  init(round, ctx) {
    const r = ctx.rng(round); let pts, eps;
    if (round === 'case') { pts = ctx.caseData.readers.last.map((p) => [p[0] * 10, p[1] * 10, 0, p[3]]); eps = 0.05; }
    else if (round === 'twist') { pts = [...R(40, () => [r.n(3, 0.45), r.n(5, 0.45), 0]), ...R(22, () => [r.n(8, 1.3), r.n(5, 1.3), 1])]; eps = 1.6; }
    else { pts = [...R(34, (i) => { const t = (i / 33) * 2.6; return [1 + t * 3, 3 + Math.sin(t) * 2 + r.n(0, 0.16), 0]; }), ...R(34, (i) => { const t = (i / 33) * 2.6; return [1 + t * 3, 5.2 + Math.sin(t) * 2 + r.n(0, 0.16), 1]; }), ...R(7, () => [r.range(0.5, 9.5), r.chance(0.5) ? r.range(0.3, 1.6) : r.range(8.4, 9.7), -1])]; eps = 0.12; }
    return { round, pts, eps, minPts: 4, bd: bounds(pts, 0.7), probe: round === 'play' ? 12 : 3 };
  },
  draw(b, s) { b.clear(); b.view(...s.bd, true); b.axes({ xt: 0, yt: 0, xfmt: () => '', yfmt: () => '', grid: false }); const res = scan(s), pr = s.pts[s.probe]; s.pts.forEach((p, i) => { const l = res.labels[i]; b.dot(p[0], p[1], { color: l < 0 ? GREY : DATA[l % 6], shape: s.round === 'case' && p[3] ? 'diamond' : l < 0 ? 'cross' : SHAPES[l % 6], r: s.round === 'case' && p[3] ? 5 : 3.8, stroke: s.round === 'case' && p[3] ? DATA[1] : '#fff' }); }); b.circle(pr[0], pr[1], s.eps, { color: WARM, width: 2, fill: WARM, alpha: 0.12 }); b.circle(pr[0], pr[1], s.eps, { color: WARM, width: 2 }); b.handle('eps', pr[0] + s.eps, pr[1], { color: WARM, label: 'ring ' + s.eps.toFixed(2) }); },
  drag(s, id, x) { if (id === 'eps') s.eps = clamp(Math.round((x - s.pts[s.probe][0]) * 50) / 50, 0.04, 4); },
  controls(s) { return [{ type: 'slider', label: 'Neighbours needed (MinPts)', min: 2, max: 8, value: s.minPts, set: (v) => { s.minPts = v; } }]; },
  stats(s) { const res = scan(s); if (s.round === 'twist') { const d = new Set(s.pts.map((p, i) => (p[2] === 0 ? res.labels[i] : null)).filter((l) => l != null && l >= 0)), dn = s.pts.filter((p, i) => p[2] === 0 && res.labels[i] < 0).length, sn = s.pts.filter((p, i) => p[2] === 1 && res.labels[i] < 0).length / 22; return { ok: d.size === 1 && dn <= 3 && sn >= 0.8, sn, res }; } if (s.round === 'case') { const com = s.pts.filter((p) => !p[3]), rare = s.pts.filter((p) => p[3]), inC = s.pts.filter((p, i) => !p[3] && res.labels[i] >= 0).length / com.length, rn = s.pts.filter((p, i) => p[3] && res.labels[i] < 0).length / Math.max(1, rare.length); return { ok: inC >= 0.85, inC, rn, res }; } const a = agree(s, res); return { ok: a >= 0.93 && res.clusters === 2, a, res }; },
  meter(s) { const q = I18.stats(s); if (s.round === 'twist') return { label: 'Scattered village called noise', text: pct(q.sn), goal: 'goal ≥ 80%, crowded village whole', frac: q.ok ? 1 : clamp(q.sn, 0, 0.9), met: q.ok, note: q.res.clusters + ' clusters found' }; if (s.round === 'case') return { label: 'Common-subject readers in a cluster', text: pct(q.inC), goal: 'goal ≥ 85%', frac: q.ok ? 1 : clamp(q.inC, 0, 0.95), met: q.ok, note: `rare-subject readers left as noise: ${pct(q.rn)}` }; return { label: 'Points placed as the map says', text: pct(Math.max(0, q.a)), goal: 'goal ≥ 93%, two clusters', frac: q.ok ? 1 : clamp(q.a, 0, 0.9), met: q.ok, note: q.res.clusters + ' clusters found' }; },
  demo(s) { const grid = R(120, (i) => 0.04 + i * 0.03), order = s.round === 'twist' ? grid.slice().reverse() : grid; for (const mp of [4, 3, 5, 6]) { s.minPts = mp; for (const e of order) { s.eps = e; if (I18.stats(s).ok) return; } } },
};

// ---------- I-19 How far apart? ----------
export const I19 = {
  id: 'I-19', name: 'How far apart?', short: 'Distances', formula: 'Minkowski: d = (Σ |aᵢ − bᵢ|^p)^(1/p)\np = 1 city blocks, p = 2 straight line, p → ∞ largest single gap\ncosine compares direction and ignores size',
  limit: 'Choosing a distance means deciding what counts as alike. Nothing in the data can make that choice for you.',
  rounds: { play: { brief: 'The shape shows every place one step from the centre. Drag p to change the rule for measuring. Find the p at which the square point and the round point are equally far.' }, twist: { brief: 'Blue and orange read the same kinds of book, in different amounts. Green reads something else. Drag orange until the ruler says orange is nearer to blue than green is.' }, case: { brief: 'Common Shelf readers by raw counts in two fields. The ringed reader borrows little. Let the seven nearest readers vote on their taste. Make the vote come out right.' } },
  hints: { play: ['At p = 1 the corner point is farther. At large p it is nearer.', 'Try p near 1.45.'], twist: ['The ruler only sees amounts.', 'Drag orange down the line until it borrows about as much as blue.'], case: ['Light readers of every taste sit in one clump near zero.', 'Tick the box to compare shares instead of counts.'] },
  teach: ['Decide what two things being close should mean.', 'Pick the ruler that measures that: gaps, angles or shared items.', 'Check what the ruler ignores. Raw counts ignore taste.'],
  variants: [{ id: 'manhattan', name: 'City blocks' }],
  init(round, ctx) {
    const r = ctx.rng(round);
    if (round === 'play') return { round, p: 4, A: [1, 0], B: [0.62, 0.62] };
    if (round === 'twist') return { round, A: [2, 1], C: [0.6, 3.6], sc: 1 };
    const L = ctx.caseData.lightReaders, pts = L.pts, norm = (p) => { const t = p[0] + p[1]; return [p[0] / t * 10, p[1] / t * 10]; }; let q = -1;
    for (let i = 0; i < pts.length && q < 0; i++) { if (pts[i][0] + pts[i][1] > 6) continue; const rest = pts.filter((_, j) => j !== i), raw = knn(rest.map((p) => [p[0], p[1]]), rest.map((p) => p[2]), [pts[i][0], pts[i][1]], 7).label, nm = knn(rest.map(norm), rest.map((p) => p[2]), norm(pts[i]), 7).label; if (nm === pts[i][2] && raw !== pts[i][2]) q = i; }
    if (q < 0) q = pts.findIndex((p, i) => { const rest = pts.filter((_, j) => j !== i); return knn(rest.map(norm), rest.map((x) => x[2]), norm(p), 7).label === p[2]; });
    return { round, pts, q: Math.max(0, q), k: 7, norm: false, fields: L.fields };
  },
  dist(ctx) { return ctx.variant === 'manhattan' ? (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) : euclid; },
  vote(s) { const f = (p) => (s.norm ? [p[0] / (p[0] + p[1]) * 10, p[1] / (p[0] + p[1]) * 10] : [p[0], p[1]]), rest = s.pts.filter((_, j) => j !== s.q); return knn(rest.map(f), rest.map((p) => p[2]), f(s.pts[s.q]), s.k); },
  draw(b, s, ctx) {
    b.clear();
    if (s.round === 'play') { b.view(-1.5, 1.5, -1.5, 1.5, true); b.axes({ xt: 6, yt: 6 }); const pts = []; for (let i = 0; i <= 240; i++) { const t = (i / 240) * Math.PI * 2, c = Math.cos(t), sn = Math.sin(t), d = Math.pow(Math.abs(c) ** s.p + Math.abs(sn) ** s.p, 1 / s.p); pts.push([c / d, sn / d]); } b.path(pts, { color: DATA[0], width: 2.5, close: true, fill: DATA[0], alpha: 1 }); b.path(pts, { color: null, fill: '#fff', alpha: 0.85, close: true }); b.path(pts, { color: DATA[0], width: 2.5, close: true }); b.dot(s.A[0], s.A[1], { color: DATA[1], r: 7, label: 'round ' + minkowski([0, 0], s.A, s.p).toFixed(2) }); b.dot(s.B[0], s.B[1], { color: DATA[3], r: 7, shape: 'square', label: 'square ' + minkowski([0, 0], s.B, s.p).toFixed(2) }); b.line(-1.4, -1.35, 1.4, -1.35, { color: INK2, width: 3 }); b.handle('p', -1.4 + ((s.p - 0.5) / 5.5) * 2.8, -1.35, { color: WARM, label: 'p = ' + s.p.toFixed(2) }); return; }
    if (s.round === 'twist') { b.view(0, 22, 0, 12); b.axes({ x: 'history books borrowed', y: 'poetry books borrowed' }); const B = [20 * s.sc, 10 * s.sc], d = I19.dist(ctx); b.line(0, 0, 22, 11, { color: PALE, width: 2 }); b.line(s.A[0], s.A[1], B[0], B[1], { color: DATA[1], dash: [4, 4] }); b.line(s.A[0], s.A[1], s.C[0], s.C[1], { color: DATA[2], dash: [4, 4] }); b.dot(s.A[0], s.A[1], { color: DATA[0], r: 7, label: 'blue' }); b.dot(s.C[0], s.C[1], { color: DATA[2], r: 7, shape: 'tri', label: 'green ' + d(s.A, s.C).toFixed(1) + ' away' }); b.handle('B', B[0], B[1], { color: DATA[1], shape: 'square', label: 'orange ' + d(s.A, B).toFixed(1) + ' away' }); return; }
    const f = (p) => (s.norm ? [p[0] / (p[0] + p[1]) * 10, p[1] / (p[0] + p[1]) * 10] : [p[0], p[1]]), all = s.pts.map(f), bd = s.norm ? [-0.5, 10.5, -0.5, 10.5] : bounds(all, 1), v = I19.vote(s), rest = s.pts.map((_, j) => j).filter((j) => j !== s.q); b.view(...bd); b.axes({ x: s.fields[0] + (s.norm ? ' (share of ten)' : ' loans'), y: s.fields[1] + (s.norm ? ' (share of ten)' : ' loans') });
    all.forEach((p, i) => { if (i === s.q) return; const nb = v.neighbours.includes(rest.indexOf(i)); b.dot(p[0] + (s.norm ? ((i * 37) % 9 - 4) * 0.05 : 0), p[1] + (s.norm ? ((i * 53) % 9 - 4) * 0.05 : 0), { color: DATA[s.pts[i][2] ? 1 : 0], shape: s.pts[i][2] ? 'square' : 'circle', r: nb ? 6 : 3.6, stroke: nb ? INK : '#fff' }); });
    b.dot(all[s.q][0], all[s.q][1], { color: '#fff', stroke: WARM, r: 9 }); b.dot(all[s.q][0], all[s.q][1], { color: WARM, r: 4, shape: 'diamond' }); const A = area(b); legend(b, [['mostly ' + s.fields[0], DATA[0]], ['mostly ' + s.fields[1], DATA[1], 'square']], A.x + 60 * A.u, A.y + 8 * A.u);
  },
  drag(s, id, x, y) { if (id === 'p') s.p = clamp(Math.round((0.5 + ((x + 1.4) / 2.8) * 5.5) * 20) / 20, 0.5, 6); else if (id === 'B') s.sc = clamp(x / 20, 0.05, 1.05); },
  controls(s) { return s.round === 'case' ? [{ type: 'toggle', label: 'Compare shares of each reader’s loans, not raw counts', value: s.norm, set: (v) => { s.norm = v; } }, { type: 'slider', label: 'Neighbours who vote (k)', min: 1, max: 15, step: 2, value: s.k, set: (v) => { s.k = v; } }] : []; },
  meter(s, ctx) {
    if (s.round === 'play') { const a = minkowski([0, 0], s.A, s.p), bq = minkowski([0, 0], s.B, s.p); return meterTo('Gap between the two distances', Math.abs(a - bq), 0.02, { lower: true, from: 0.3, fmt: (v) => v.toFixed(3) }); }
    if (s.round === 'twist') { const d = I19.dist(ctx), B = [20 * s.sc, 10 * s.sc], ab = d(s.A, B), ac = d(s.A, s.C); return { label: 'Nearest to blue, by the ruler', text: ab < ac ? 'orange' : 'green', goal: 'goal: orange', frac: ab < ac ? 1 : clamp(ac / ab, 0, 0.9), met: ab < ac, note: `by angle (cosine) orange was always the match: ${cosine(s.A, B).toFixed(2)} against ${cosine(s.A, s.C).toFixed(2)}` }; }
    const v = I19.vote(s), truth = s.pts[s.q][2], ok = v.label === truth && s.norm; return { label: 'The neighbours’ vote', text: 'mostly ' + s.fields[v.label] + (v.label === truth ? ': right' : ': wrong'), goal: 'right, using shares', frac: ok ? 1 : v.label === truth ? 0.6 : 0.2, met: ok, note: `this reader borrowed ${s.pts[s.q][0]} and ${s.pts[s.q][1]}` };
  },
  demo(s) { if (s.round === 'play') s.p = 1.45; else if (s.round === 'twist') s.sc = 0.12; else { s.norm = true; s.k = 7; } },
};

// ---------- I-20 Pattern lock ----------
const LOCKS = { play: { yes: ['QA-276', 'PN-104', 'TK-515', 'HB-071'], no: ['QA276', 'Q-2760', 'qa-276', 'QA-27', 'XQA-2761'], sol: '^[A-Z]{2}-\\d{3}$', what: 'call numbers' }, twist: { yes: ['QA-276', 'PN-104', 'qa-276', 'QA-276b', 'pn-104', 'TK-515a'], no: ['QA276', 'Q-2760', 'QA-27', 'QA-2760', 'QA-276bb'], sol: '^[A-Za-z]{2}-\\d{3}[a-z]?$', what: 'call numbers, old cards included' }, case: { yes: ['2041 JN RENEW RENEW', '0932 CS RENEW RENEW', '1177 JN RENEW RENEW'], no: ['2041 JN RENEW', '0932 CS LOAN', '4410 ST RENEW', '5521 WS LOAN RENEW', '3310 JN RENEW RENEWAL DESK'], sol: 'RENEW RENEW$', what: 'lines the migration logged twice' } };
const rx = (p) => { try { return p ? new RegExp(p) : null; } catch { return null; } };
export const I20 = {
  id: 'I-20', name: 'Pattern lock', short: 'Regular expressions', formula: '[A-Z] one capital   \\d one digit   {3} exactly three\n? maybe   + one or more   ^ start   $ end',
  limit: 'A pattern keeps exactly what you described. A record that is correct but written another way is dropped, and nothing tells you it happened.',
  rounds: { play: { brief: 'Write one pattern that matches every call number on the left and none on the right. Type it, or tap the pieces.' }, twist: { brief: 'Your pattern threw out real records from the old catalogue: lower-case ones, and ones with a letter on the end. Widen it without letting the wrong ones in.' }, case: { brief: 'For four months two branches logged renewals twice. Write a pattern that finds only the doubled lines.' } },
  hints: { play: ['Two capitals, a dash, three digits. Say where it starts and ends.', '^[A-Z]{2}-\\d{3}$'], twist: ['Letters of either case, and maybe one small letter at the end.', '^[A-Za-z]{2}-\\d{3}[a-z]?$'], case: ['What do the doubled lines end with?', 'RENEW RENEW$'] },
  teach: ['Describe the shape of a good record, piece by piece.', 'Pin the pattern to the start and the end.', 'Then look at what it rejected. Some of that is real.'],
  init(round) { return { round, pat: round === 'twist' ? '^[A-Z]{2}-\\d{3}$' : '' }; },
  score(s) { const L = LOCKS[s.round], re = rx(s.pat); return { re, y: L.yes.map((t) => !!re && re.test(t)), n: L.no.map((t) => !!re && re.test(t)), L }; },
  draw(b, s) {
    b.clear(); const A = area(b), u = A.u, q = I20.score(s), hw = A.w / 2; title(b, 'Pattern:  ' + (s.pat || '(empty)'), s.pat && !q.re ? 'not a complete pattern yet' : q.L.what);
    [['Must match', q.L.yes, q.y, true], ['Must not match', q.L.no, q.n, false]].forEach(([nm, list, got, want], c) => { const x = A.x + c * hw + 6 * u; b.label(nm, x, A.y + 70 * u, { bold: true }); list.forEach((t, i) => { const ok = got[i] === want; card(b, null, x, A.y + 86 * u + i * 44 * u, hw - 16 * u, 38 * u, t + '   ' + (got[i] ? 'matches' : 'no match'), { mono: true, size: 12, align: 'left', fill: ok ? '#e3efe9' : '#fbe9e2', mark: ok ? GOOD : WARM }); }); });
  },
  controls(s) { const add = (t) => ({ label: t === 'DEL' ? '⌫' : t, value: t }); return [{ type: 'text', label: 'Pattern', value: s.pat, placeholder: 'type here', set: (v) => { s.pat = v; } }, { type: 'buttons', label: 'Pieces', value: null, options: ['^', '[A-Z]', '[a-z]', '[A-Za-z]', '\\d', '{2}', '{3}', '-', '?', '+', ' ', 'RENEW', '$', 'DEL'].map(add), set: (v) => { s.pat = v === 'DEL' ? s.pat.slice(0, -1) : s.pat + v; } }, { type: 'button', label: 'Clear', run: () => { s.pat = ''; } }]; },
  meter(s) { const q = I20.score(s), ok = q.y.filter(Boolean).length + q.n.filter((v) => !v).length, tot = q.y.length + q.n.length; return { label: 'Records handled correctly', text: `${q.re ? ok : 0} of ${tot}`, frac: q.re ? ok / tot : 0, met: !!q.re && ok === tot, note: `${q.y.filter((v) => !v).length} good records rejected, ${q.n.filter(Boolean).length} bad ones let in` }; },
  demo(s) { s.pat = LOCKS[s.round].sol; },
};

// ---------- I-21 Rare words matter ----------
const SHELF = {
  play: { q: ['the', 'old', 'lighthouse'], target: 3, docs: ['the history of the town and the mill and the river', 'the old road and the old bridge in the old town', 'the garden in the spring and the summer', 'a keeper and his lamp at the lighthouse', 'the birds of the marsh and the reeds of the shore'], w: [1, 1, 1] },
  twist: { q: ['old', 'lighthuose', 'keeper'], target: 3, docs: ['the road and the bridge by the old mill', 'lighthuose lighthuose index page scanned badly', 'the garden in the spring', 'the old keeper of the lamp on the rock', 'birds of the marsh'], w: null },
  case: { q: ['book', 'of', 'moss'], target: 2, docs: ['the book of the year the book everyone has read', 'a book of walks a book of days', 'moss and lichen of the north wall', 'the big book of trains', 'a book of the garden in winter'], w: [3, 2.4, 0.2] },
};
const toks = (d) => d.split(' ');
export const I21 = {
  id: 'I-21', name: 'Rare words matter', short: 'TF-IDF', formula: 'tf = how often the word is in this text\nidf = log(texts in all / texts with the word)\nscore = Σ tf × idf over the words you asked for',
  limit: 'Rarity is a good guess at importance, and only a guess. A misprint is the rarest word of all.',
  rounds: { play: { brief: 'Someone asks for “the old lighthouse”. Each bar is how much a word counts. Drag the bars until the right book comes first.' }, twist: { brief: 'Weighing by rarity has put a badly scanned page on top, because a misprint is rare. Drag the bars until the real book wins.' }, case: { brief: 'A reader asks for a “book of moss”. The bars start where Marginalia has them: common words count most. Bring the moss book to the top.' } },
  hints: { play: ['Which word is in almost every title?', 'Pull “the” down and push “lighthouse” up.'], twist: ['One of the words is misspelt.', 'Pull the misprint’s bar down to zero.'], case: ['Which word tells the books apart?', 'Push “moss” up and pull “book” down.'] },
  teach: ['Count how often each asked-for word appears in each text.', 'Give more weight to words that few texts contain.', 'Add up the weighted counts and sort.'],
  variants: [{ id: 'idf', name: 'Start from rarity' }],
  init(round, ctx) { const S = SHELF[round], docs = S.docs.map(toks), idf = S.q.map((w) => Math.log(docs.length / Math.max(1, docs.filter((d) => d.includes(w)).length)) + 0.1); return { round, w: (S.w && ctx.variant !== 'idf' ? S.w : idf.map((v) => v * 1.4)).slice(), idf }; },
  rank(s) { const S = SHELF[s.round], sc = S.docs.map((d) => { const t = toks(d); return sum(S.q.map((w, i) => s.w[i] * (t.filter((x) => x === w).length / t.length))); }), order = sc.map((v, i) => [v, i]).sort((a, b) => b[0] - a[0] || a[1] - b[1]); return { sc, order, pos: order.findIndex((o) => o[1] === S.target) + 1 }; },
  draw(b, s) {
    b.clear(); const S = SHELF[s.round], q = I21.rank(s), A = area(b), u = A.u; b.view(0, 6.2, 0, 3.4); b.pad = { l: 50, r: b.w / b.u * 0.56, t: 40, b: 50 }; b.axes({ y: 'weight', xt: 0, xfmt: () => '', yt: 3 });
    S.q.forEach((w, i) => { const x = 1 + i * 2; b.rect(x - 0.6, 0, 1.2, s.w[i], { fill: DATA[i], alpha: 0.75 }); b.handle('w' + i, x, s.w[i], { color: DATA[i], label: s.w[i].toFixed(1) }); b.text('“' + w + '”', x, 0, { dy: 14 * u, size: 12, bold: true }); }); b.pad = { l: 46, r: 18, t: 18, b: 38 };
    const X = b.w * 0.47, max = Math.max(...q.sc, 1e-9); b.label('Results', X, A.y + 14 * u, { bold: true }); q.order.forEach(([v, i], k) => { const y = A.y + 34 * u + k * 62 * u, tgt = i === S.target; b.box(X, y, b.w - X - 16 * u, 54 * u, { fill: tgt ? '#fbf3d9' : '#fbfaf6', color: tgt ? DATA[1] : PALE, width: tgt ? 2 : 1 }); b.box(X, y + 50 * u, (b.w - X - 16 * u) * (v / max), 4 * u, { fill: INK2 }); b.label(k + 1 + '.', X + 8 * u, y + 16 * u, { mono: true, size: 11 }); wrap(b, S.docs[i], X + 28 * u, y + 16 * u, b.w - X - 60 * u, { size: 11 }); });
  },
  drag(s, id, x, y) { if (id?.[0] === 'w') s.w[+id[1]] = clamp(Math.round(y * 10) / 10, 0, 3.2); },
  controls(s) { return [{ type: 'button', label: 'Weigh every word by its rarity', run: () => { s.w = s.idf.map((v) => Math.min(3.2, v * 1.4)); } }, { type: 'button', label: 'Weigh every word the same', run: () => { s.w = s.w.map(() => 1); } }]; },
  meter(s) { const q = I21.rank(s); return { label: 'The right book is', text: ['', 'first', 'second', 'third', 'fourth', 'fifth'][q.pos], goal: 'goal: first', frac: (6 - q.pos) / 5, met: q.pos === 1 }; },
  demo(s) { const S = SHELF[s.round]; s.w = S.q.map((w, i) => (s.round === 'twist' ? (i === 1 ? 0 : 2) : s.round === 'case' ? [0.2, 0.2, 3][i] : [0, 1, 3][i])); },
};

// ---------- I-22 The S-curve ----------
const xent = (pts, f) => -mean(pts.map((p) => { const q = clamp(f(p[0]), 1e-6, 1 - 1e-6); return p[1] ? Math.log(q) : Math.log(1 - q); }));
export const I22 = {
  id: 'I-22', name: 'The S-curve', short: 'Logistic regression', formula: 'p = 1 / (1 + e^−(a + b·x))\nlog-odds = a + b·x\nloss = −mean[ y·log p + (1 − y)·log(1 − p) ]',
  limit: 'Where the curve has seen no examples it still gives a number, and gives it confidently.',
  rounds: { play: { brief: 'Dots at the top were returned late, dots at the bottom on time. Drag the curve’s middle and its steepness until the loss is as low as it will go.' }, twist: { brief: 'A straight line has been fitted to the same yes-or-no dots. Drag the marker along and find a place where the line predicts a chance above 100% or below 0%.' }, case: { brief: 'Each dot is a title: how often it was shown last month, and whether it was borrowed three times or more. Fit the curve.' } },
  hints: { play: ['Put the middle where yes and no are evenly mixed.', 'Then steepen it until the loss stops falling.'], twist: ['Go to either end.', 'Drag the marker to the far right.'], case: ['There is nothing in between.', 'Put the middle anywhere in the gap and make the curve steep.'] },
  teach: ['Yes-or-no outcomes need a curve that stays between 0 and 1.', 'Slide its middle to where yes and no are evenly mixed.', 'Set its steepness to how sharply one turns into the other.'],
  init(round, ctx) {
    const r = ctx.rng(round);
    if (round === 'case') { const pts = ctx.caseData.shownSample.map((p) => [Math.log10(1 + p[0]), p[1] >= 3 ? 1 : 0]); return { round, pts, mid: 0.4, k: 1.2, x0: -0.3, x1: 3.4, lx: 'times shown last month (log scale)' }; }
    const W = walk(ctx), pts = R(36, () => { const x = r.range(0, 10); return [x, r.chance(sigmoid(1.3 * (x - 5.5))) ? 1 : 0]; }); return { round, pts, mid: 2.5, k: 0.5, x0: 0, x1: 10, q: 5, lx: round === 'twist' ? 'days on loan before the reminder' : 'days on loan before the reminder' };
  },
  f(s) { return (x) => sigmoid(s.k * (x - s.mid)); },
  best(s) { const m = logistic(s.pts.map((p) => [p[0]]), s.pts.map((p) => p[1]), { lr: 0.5, iters: 1500 }); return xent(s.pts, (x) => m.prob([x])); },
  draw(b, s) {
    b.clear(); b.view(s.x0, s.x1, -0.25, 1.25); b.axes({ x: s.lx, y: 'chance', yt: 6, yfmt: (v) => (v >= -0.01 && v <= 1.01 ? pct(v) : '') }); b.line(s.x0, 0, s.x1, 0, { color: INK2 }); b.line(s.x0, 1, s.x1, 1, { color: INK2 });
    s.pts.forEach((p, i) => b.dot(p[0] + (s.round === 'case' ? ((i * 37) % 11 - 5) * 0.02 : 0), p[1] + ((i * 53) % 7 - 3) * 0.012, { color: p[1] ? DATA[1] : DATA[0], shape: p[1] ? 'square' : 'circle', r: 4 }));
    if (s.round === 'twist') { const f = linreg(s.pts.map((p) => p[0]), s.pts.map((p) => p[1])), xa = -3, xb = 13; b.view(xa, xb, -0.25, 1.25); b.fn((x) => f.a + f.b * x, { color: INK, width: 2.5 }); const v = f.a + f.b * s.q; b.line(s.q, -0.25, s.q, v, { color: WARM, dash: [4, 4] }); b.handle('q', s.q, v, { color: WARM, shape: 'diamond', label: 'line says ' + pct(v) }); return; }
    b.fn(I22.f(s), { color: INK, width: 2.5, n: 200 }); b.handle('mid', s.mid, 0.5, { color: WARM, label: 'middle' }); b.handle('steep', s.mid + 1 / s.k, 0.731, { color: DATA[2], shape: 'diamond', label: 'steepness' });
  },
  drag(s, id, x) { if (id === 'mid') s.mid = clamp(x, s.x0, s.x1); else if (id === 'steep') s.k = clamp(1 / Math.max(0.03, x - s.mid), 0.15, 30); else if (id === 'q') s.q = clamp(x, -3, 13); },
  meter(s) {
    if (s.round === 'twist') { const f = linreg(s.pts.map((p) => p[0]), s.pts.map((p) => p[1])), v = f.a + f.b * s.q, bad = v > 1 || v < 0; return { label: 'The line’s chance of “late” here', text: pct(v), goal: 'find one above 100% or below 0%', frac: bad ? 1 : clamp(Math.abs(v - 0.5) * 2, 0, 0.9), met: bad, note: 'A chance cannot be more than certain.' }; }
    const cur = xent(s.pts, I22.f(s)), f = I22.f(s); if (s.round === 'case') return meterTo('Loss', cur, 0.1, { lower: true, from: 1, fmt: (v) => v.toFixed(3), note: `the curve gives a title shown 500 times ${pct(f(2.7))}, and one never shown ${pct(f(0), 1)}` });
    const best = I22.best(s); return meterTo('Loss', cur, best * 1.06 + 0.005, { lower: true, from: best * 3, fmt: (v) => v.toFixed(3), note: 'lowest possible about ' + best.toFixed(3) });
  },
  demo(s) { if (s.round === 'twist') { s.q = 12.5; return; } if (s.round === 'case') { s.mid = 1.3; s.k = 8; return; } const m = logistic(s.pts.map((p) => [p[0]]), s.pts.map((p) => p[1]), { lr: 0.5, iters: 1500 }); s.k = m.w[1]; s.mid = -m.w[0] / m.w[1]; },
};

// ---------- I-23 Fit and refit ----------
function polyErr(tr, te, deg) { try { const m = polyfit(tr.map((p) => p[0]), tr.map((p) => p[1]), deg), e = Math.sqrt(mean(te.map((p) => (p[1] - m.predict(p[0])) ** 2))); return Number.isFinite(e) ? Math.min(e, 99) : 99; } catch { return 99; } }
function split(s) { if (s.round === 'twist' && s.forward) { const o = s.pts.slice().sort((a, b) => a[0] - b[0]), c = Math.floor(o.length * 0.67); return [o.slice(0, c), o.slice(c)]; } return [s.pts.filter((_, i) => i % 3 !== s.fold), s.pts.filter((_, i) => i % 3 === s.fold)]; }
const cvErr = (s, d) => (s.round === 'twist' && s.forward ? polyErr(...split(s), d) : mean([0, 1, 2].map((f) => polyErr(s.pts.filter((_, i) => i % 3 !== f), s.pts.filter((_, i) => i % 3 === f), d))));
export const I23 = {
  id: 'I-23', name: 'Fit and refit', short: 'Cross-validation', formula: 'fit on the training part, score on the part held back\nk-fold: rotate which part is held back and average',
  limit: 'Holding data back only works if the held-back part resembles what comes next. Shuffle the months and you hide whatever time is going to change.',
  rounds: { play: { brief: 'Filled dots train the curve. Hollow dots were held back. Slide the wiggliness and find the setting that does best on the hollow dots, averaged over three ways of holding back.' }, twist: { brief: 'These dots are months in order. Holding back random months lets the curve peek at its future. Hold back the last third instead, then find the best wiggliness.' }, case: { brief: 'Two years of months. Drag the divider to where the test should begin if you want to know how a model does next year.' } },
  hints: { play: ['Too stiff misses the bend. Too wiggly chases noise.', 'Try two or three.'], twist: ['Tick the box first.', 'Forward in time, a stiff curve beats a wiggly one.'], case: ['Test on months that come after all the training months.', 'Put the divider at the end of year three.'] },
  teach: ['Hold some data back before you fit.', 'Score the model only on what it did not see.', 'If time matters, hold back the end, not a shuffle.'],
  init(round, ctx) {
    const r = ctx.rng(round);
    if (round === 'case') { const V = ctx.caseData.validation; return { round, cut: 4, V }; }
    const n = 30, f = round === 'twist' ? (x) => 0.4 + 0.9 * x + 0.25 * Math.sin(x * 9) : (x) => Math.sin(x * 2.6) * 0.8 + 0.3 * x, pts = r.shuffle(R(n, (i) => { const x = -1 + (2 * (i + r.range(0.1, 0.9))) / n; return [x, f(x) + r.n(0, 0.16)]; }));
    return { round, pts, deg: round === 'twist' ? 7 : 0, fold: 0, forward: false };
  },
  draw(b, s) {
    b.clear(); const A = area(b), u = A.u;
    if (s.round === 'case') { b.view(0, 24, 0, 0.16); b.axes({ x: 'months: year three, then year four', y: 'score', xt: 6, yfmt: (v) => pct(v) }); b.rect(0, 0, 12, 0.16, { fill: '#eef6f9', alpha: 0.7 }); b.text('year three (reading lists)', 6, 0.15, { size: 10.5 }); b.text('year four', 18, 0.15, { size: 10.5 }); const fwd = s.cut >= 11.5 && s.cut <= 12.5, sc = fwd ? s.V.forward : s.V.shuffled; for (let m = 0; m < 24; m++) { const test = fwd ? m >= 12 : m < 12 && m % 4 === Math.round(s.cut) % 4; b.rect(m + 0.1, 0, 0.8, m < 12 || fwd ? 0.02 : 0.006, { fill: test ? DATA[1] : m < 12 || fwd ? DATA[0] : PALE }); } b.rect(13, 0.03, 4, s.V.shuffled, { fill: fwd ? PALE : DATA[1] }); b.text('shuffled test ' + pct(s.V.shuffled, 1), 15, 0.03 + s.V.shuffled, { dy: -9 * u, size: 10.5 }); b.rect(18.5, 0.03, 4, s.V.forward, { fill: fwd ? DATA[1] : PALE }); b.text('forward test ' + (fwd ? pct(s.V.forward, 1) : '?'), 20.5, 0.03 + s.V.forward, { dy: -9 * u, size: 10.5 }); b.line(s.cut, 0, s.cut, 0.13, { color: WARM, width: 2.5 }); b.handle('cut', s.cut, 0.125, { color: WARM, shape: 'diamond', label: 'test begins' }); legend(b, [['trained on', DATA[0], 'square'], ['tested on', DATA[1], 'square']], A.x + 60 * u, A.y + A.h - 60 * u); return; }
    b.view(-1.1, 1.1, -1.4, 2); b.axes({ x: s.round === 'twist' ? 'time' : 'x', y: 'y', xt: 4 }); const [tr, te] = split(s); try { const m = polyfit(tr.map((p) => p[0]), tr.map((p) => p[1]), s.deg); b.fn((x) => clamp(m.predict(x), -9, 9), { color: INK, width: 2.5, n: 240 }); } catch { /* too wiggly to solve */ }
    tr.forEach((p) => b.dot(p[0], p[1], { color: DATA[0] })); te.forEach((p) => b.dot(p[0], p[1], { color: '#fff', stroke: DATA[3], r: 5 })); legend(b, [['trained on', DATA[0]], ['held back', DATA[3], 'ring']], A.x + 60 * u, A.y + 8 * u);
    const errs = R(10, (d) => cvErr(s, d)), mx = Math.min(1.5, Math.max(...errs)); errs.forEach((e, d) => { const x = A.x + A.w - 250 * u + d * 23 * u, h = (Math.min(e, mx) / mx) * 56 * u; b.box(x, A.y + 72 * u - h, 19 * u, h, { fill: d === s.deg ? DATA[1] : PALE }); b.label(String(d), x + 9 * u, A.y + 82 * u, { size: 9.5, mono: true, align: 'center' }); }); b.label('held-back error at each setting', A.x + A.w - 250 * u, A.y + 8 * u, { size: 10, color: INK2 });
  },
  drag(s, id, x) { if (id === 'cut') s.cut = clamp(Math.round(x), 1, 23); },
  controls(s) { if (s.round === 'case') return []; const c = [{ type: 'slider', label: 'Wiggliness (degree)', min: 0, max: 9, value: s.deg, set: (v) => { s.deg = v; } }]; if (s.round === 'play') c.push({ type: 'button', label: 'Hold back a different third', run: () => { s.fold = (s.fold + 1) % 3; } }); else c.push({ type: 'toggle', label: 'Hold back the last third, not random months', value: s.forward, set: (v) => { s.forward = v; } }); return c; },
  meter(s) {
    if (s.round === 'case') { const fwd = s.cut >= 11.5 && s.cut <= 12.5; return { label: 'What the test tells you', text: fwd ? 'next year: ' + pct(s.V.forward, 1) : 'months like the ones trained on: ' + pct(s.V.shuffled, 1), goal: 'train on year three, test on year four', frac: fwd ? 1 : 0.3, met: fwd }; }
    const errs = R(10, (d) => cvErr(s, d)), best = Math.min(...errs), cur = errs[s.deg], ok = cur <= best * 1.05 && (s.round !== 'twist' || s.forward); return { label: s.round === 'twist' && s.forward ? 'Error on the months to come' : 'Error on held-back dots', text: cur.toFixed(3), goal: 'the lowest of the ten settings' + (s.round === 'twist' ? ', held back in time' : ''), frac: ok ? 1 : clamp(best / cur, 0, 0.9), met: ok };
  },
  demo(s) { if (s.round === 'case') { s.cut = 12; return; } if (s.round === 'twist') s.forward = true; const errs = R(10, (d) => cvErr(s, d)); s.deg = errs.indexOf(Math.min(...errs)); },
};

// ---------- I-24 Four boxes ----------
function conf(s) { let tp = 0, fp = 0, tn = 0, fn = 0; for (const [sc, rel] of s.items) { const f = sc >= s.th; if (f && rel) tp++; else if (f) fp++; else if (rel) fn++; else tn++; } const prec = tp + fp ? tp / (tp + fp) : 0, rec = tp + fn ? tp / (tp + fn) : 0; return { tp, fp, tn, fn, prec, rec, f1: prec + rec ? (2 * prec * rec) / (prec + rec) : 0, acc: (tp + tn) / s.items.length }; }
export const I24 = {
  id: 'I-24', name: 'Four boxes', short: 'Precision and recall', formula: 'precision = right among those returned\nrecall = found among those that were relevant\nF1 = 2·P·R / (P + R)   accuracy = all correct / all',
  limit: 'Any single score hides a trade between two kinds of mistake. All of them also need a list of right answers, which somebody had to write.',
  rounds: { play: { brief: 'A search returns every document scoring above the cut-off. Squares are the ones that were wanted. Drag the cut-off to get the best balance of precision and recall.' }, twist: { brief: 'On a parcel belt, two parcels in forty are faulty. Find the cut-off that gives 95% accuracy while catching none of them.' }, case: { brief: 'A rule with no knowledge of the reader: show everyone the same most-borrowed titles. Drag to choose how many. Set it to five, like a screen.' } },
  hints: { play: ['Too high and you miss wanted ones. Too low and you return junk.', 'Put the cut-off where squares begin to thin out.'], twist: ['What if the alarm never rings?', 'Drag the cut-off above every dot.'], case: ['The marker shows how many titles.', 'Drag it to 5.'] },
  teach: ['Sort every case into four boxes: found and wanted, found and unwanted, missed, rightly left.', 'Precision looks down the “found” column. Recall looks along the “wanted” row.', 'When what you want is rare, ignore accuracy.'],
  init(round, ctx) {
    const r = ctx.rng(round);
    if (round === 'case') { const B = ctx.caseData.baseline; return { round, B, i: 6, T: ctx.caseData.meta.titles }; }
    if (round === 'twist') return { round, items: R(40, (i) => [clamp(r.n(i < 2 ? 0.7 : 0.35, 0.14), 0.02, 0.95), i < 2 ? 1 : 0]), th: 0.4 };
    return { round, items: R(36, (i) => [clamp(r.n(i < 14 ? 0.68 : 0.36, 0.15), 0.02, 0.98), i < 14 ? 1 : 0]), th: 0.08 };
  },
  draw(b, s) {
    b.clear(); const A = area(b), u = A.u;
    if (s.round === 'case') { b.view(-0.5, 9.5, 0, 1); b.axes({ x: 'titles the rule shows to everyone', y: 'share of last year’s loans it would have “predicted”', xt: 0, xfmt: () => '', yfmt: (v) => pct(v) }); s.B.curve.forEach((v, i) => { b.rect(i - 0.35, 0, 0.7, v, { fill: i === s.i ? DATA[1] : DATA[0] }); b.text(nice(s.B.ks[i]), i, 0, { dy: 12 * u, size: 10, mono: true }); b.text(pct(v), i, v, { dy: -8 * u, size: 10 }); }); b.line(-0.5, s.B.firstYear, 9.5, s.B.firstYear, { color: DATA[3], dash: [6, 4] }); b.text('Marginalia, year one', 8, s.B.firstYear, { dy: -8 * u, size: 10, color: DATA[3] }); b.line(-0.5, s.B.marginalia, 9.5, s.B.marginalia, { color: INK, dash: [6, 4] }); b.text('Marginalia, year six', 1, s.B.marginalia, { dy: -8 * u, size: 10 }); b.handle('i', s.i, s.B.curve[s.i], { color: WARM, shape: 'diamond' }); return; }
    b.view(0, 1, -0.6, 3); b.pad = { l: 46, r: 300, t: 18, b: 38 }; b.axes({ x: 'score', yt: 0, yfmt: () => '', grid: false }); s.items.forEach(([sc, rel], i) => b.dot(sc, 0.2 + (i % 10) * 0.24, { color: rel ? DATA[1] : DATA[0], shape: rel ? 'square' : 'circle', r: 5, alpha: sc >= s.th ? 1 : 0.4 })); b.rect(s.th, -0.2, 1 - s.th, 3, { fill: DATA[2], alpha: 0.08 }); b.line(s.th, -0.2, s.th, 2.9, { color: WARM, width: 2.5 }); b.handle('th', s.th, 2.8, { color: WARM, shape: 'diamond', label: 'cut-off' }); b.pad = { l: 46, r: 18, t: 18, b: 38 };
    const c = conf(s), X = b.w - 280 * u, Y = A.y + 30 * u, w = 128 * u, h = 84 * u, cell = (cx, cy, nm, v, col) => { b.box(X + cx * (w + 6 * u), Y + cy * (h + 6 * u), w, h, { fill: col, color: INK2 }); b.label(nm, X + cx * (w + 6 * u) + 8 * u, Y + cy * (h + 6 * u) + 16 * u, { size: 10.5 }); b.label(String(v), X + cx * (w + 6 * u) + w / 2, Y + cy * (h + 6 * u) + h / 2 + 10 * u, { size: 22, mono: true, align: 'center' }); };
    cell(0, 0, 'returned, wanted', c.tp, '#e3efe9'); cell(1, 0, 'returned, unwanted', c.fp, '#fbe9e2'); cell(0, 1, 'missed', c.fn, '#fbe9e2'); cell(1, 1, 'rightly left', c.tn, '#e3efe9');
    [['precision', c.prec], ['recall', c.rec], ['F1', c.f1], ['accuracy', c.acc]].forEach(([nm, v], i) => b.label(nm + '  ' + pct(v), X, Y + 2 * h + 34 * u + i * 20 * u, { mono: true, size: 12 }));
  },
  drag(s, id, x) { if (id === 'th') s.th = clamp(Math.round(x * 100) / 100, 0, 1); else if (id === 'i') s.i = clamp(Math.round(x), 0, 9); },
  bestF1(s) { let best = 0; for (let t = 0; t <= 1; t += 0.01) best = Math.max(best, conf({ ...s, th: t }).f1); return best; },
  meter(s) {
    if (s.round === 'case') return { label: 'The same ' + nice(s.B.ks[s.i]) + ' for everyone', text: pct(s.B.curve[s.i]), goal: 'set it to 5', frac: s.i === 2 ? 1 : 0.3, met: s.i === 2, note: `it offers ${pct(s.B.ks[s.i] / s.T, 2)} of the catalogue` };
    const c = conf(s); if (s.round === 'twist') { const ok = c.acc >= 0.95 && c.rec === 0; return { label: 'Accuracy', text: pct(c.acc) + '   faults caught: ' + c.tp + ' of 2', goal: '95% with none caught', frac: ok ? 1 : clamp(c.acc, 0, 0.9), met: ok, note: 'An alarm that never rings is right nearly all the time.' }; }
    return meterTo('F1', c.f1, I24.bestF1(s) - 0.015, { from: 0.3, fmt: (v) => v.toFixed(2), note: `precision ${pct(c.prec)}, recall ${pct(c.rec)}` });
  },
  demo(s) { if (s.round === 'case') s.i = 2; else if (s.round === 'twist') s.th = 0.99; else { let best = [0, 0]; for (let t = 0; t <= 1; t += 0.01) { const f = conf({ ...s, th: t }).f1; if (f > best[0]) best = [f, Math.round(t * 100) / 100]; } s.th = best[1]; } },
};

// ---------- I-25 Fewest cuts ----------
export const I25 = {
  id: 'I-25', name: 'Fewest cuts', short: 'Isolation forest', formula: 'cut the box at random until a point is alone\nodd points are alone after few cuts\nscore = average depth over many random trees',
  limit: 'The method finds what is unusual. It cannot tell an error from the most interesting reader in the building.',
  rounds: { play: { brief: 'Tap to slice the box, across and then down in turn. The box shrinks to the side that holds the ringed point. Leave that point alone in as few cuts as you can.' }, twist: { brief: 'Now the ringed point sits in the crowd. Cut it free. Count how many more cuts an ordinary point needs.' }, case: { brief: 'Common Shelf readers, scored by a forest of random cuts. Drag the marker to drop the five most unusual. See who they are.' } },
  hints: { play: ['Cut between the ringed point and everyone else.', 'One cut just beside it is enough to start.'], twist: ['Keep cutting close to it, on alternate sides.', 'Folio can do it.'], case: ['The marker counts readers dropped.', 'Drag it to 5.'] },
  teach: ['Slice the data at random and see who ends up alone first.', 'Repeat with many random slicings and average.', 'Those who are cut off quickest are the unusual ones. Then ask why they are unusual.'],
  two: { set: 'Bury an odd point among the dots.', solve: 'Find it in as few cuts as you can.' },
  init(round, ctx) {
    const r = ctx.rng(round);
    if (round === 'case') { const pts = ctx.caseData.readers.last.map((p) => [p[0] * 10, p[1] * 10, p[3]]), F = isolationForest(pts.map((p) => [p[0], p[1]]), ctx.rng('forest'), { trees: 80, sample: 64 }), depth = pts.map((p) => F.depth([p[0], p[1]])), order = depth.map((d, i) => [d, i]).sort((a, b) => a[0] - b[0]).map((a) => a[1]); return { round, pts, order, n: 0, bd: bounds(pts, 0.6) }; }
    const pts = R(40, () => [r.n(5, 1.1), r.n(5, 1.1)]); let t; if (round === 'play') { pts.push([9, 8.8]); t = 40; } else { t = pts.map((p, i) => [Math.hypot(p[0] - 5, p[1] - 5), i]).sort((a, b) => a[0] - b[0])[0][1]; }
    return { round, pts, t, box: [0, 10, 0, 10], cuts: [], axis: 0 };
  },
  inside(s) { const [x0, x1, y0, y1] = s.box; return s.pts.filter((p) => p[0] >= x0 && p[0] <= x1 && p[1] >= y0 && p[1] <= y1).length; },
  cut(s, x, y) { const T = s.pts[s.t], [x0, x1, y0, y1] = s.box; if (I25.inside(s) <= 1) return; if (s.axis === 0) { const c = clamp(x, x0, x1); if (Math.abs(c - T[0]) < 1e-6) return; s.cuts.push([0, c, y0, y1]); if (T[0] < c) s.box[1] = c; else s.box[0] = c; } else { const c = clamp(y, y0, y1); if (Math.abs(c - T[1]) < 1e-6) return; s.cuts.push([1, c, x0, x1]); if (T[1] < c) s.box[3] = c; else s.box[2] = c; } s.axis = 1 - s.axis; },
  draw(b, s) {
    b.clear();
    if (s.round === 'case') { b.view(...s.bd, true); b.axes({ xt: 0, yt: 0, xfmt: () => '', yfmt: () => '', grid: false }); const dropped = new Set(s.order.slice(0, s.n)); s.pts.forEach((p, i) => b.dot(p[0], p[1], { color: dropped.has(i) ? INK : p[2] ? DATA[1] : DATA[0], shape: dropped.has(i) ? 'cross' : p[2] ? 'diamond' : 'circle', r: dropped.has(i) ? 7 : p[2] ? 5 : 3.5 })); const A = area(b), u = A.u; legend(b, [['common subjects', DATA[0]], ['rare subjects', DATA[1], 'diamond'], ['dropped', INK, 'cross']], A.x + 20 * u, A.y + 8 * u); const [x0, x1, y0] = s.bd; b.line(x0 + 0.3, y0 + 0.3, x1 - 0.3, y0 + 0.3, { color: INK2, width: 3 }); b.handle('n', x0 + 0.3 + (s.n / 20) * (x1 - x0 - 0.6), y0 + 0.3, { color: WARM, label: 'drop ' + s.n }); return; }
    b.view(0, 10, 0, 10, true); b.axes({ xt: 0, yt: 0, xfmt: () => '', yfmt: () => '', grid: false }); const [x0, x1, y0, y1] = s.box; b.rect(x0, y0, x1 - x0, y1 - y0, { fill: DATA[1], alpha: 0.1, color: DATA[1], width: 2 });
    s.cuts.forEach((c) => (c[0] === 0 ? b.line(c[1], c[2], c[1], c[3], { color: INK2 }) : b.line(c[2], c[1], c[3], c[1], { color: INK2 })));
    s.pts.forEach((p, i) => { const inb = p[0] >= x0 && p[0] <= x1 && p[1] >= y0 && p[1] <= y1; b.dot(p[0], p[1], { color: i === s.t ? WARM : DATA[0], r: i === s.t ? 6 : 4, alpha: inb ? 1 : 0.3 }); }); b.circle(s.pts[s.t][0], s.pts[s.t][1], 0.35, { color: WARM, width: 2 });
    b.text('next cut: ' + (s.axis ? 'across (tap a height)' : 'down (tap a place along)'), 5, 9.7, { size: 11, color: INK2 });
  },
  click(s, x, y) { if (s.round !== 'case') I25.cut(s, x, y); },
  drag(s, id, x) { if (id === 'n') s.n = clamp(Math.round(((x - s.bd[0] - 0.3) / (s.bd[1] - s.bd[0] - 0.6)) * 20), 0, 20); },
  meter(s) {
    if (s.round === 'case') { const d = s.order.slice(0, s.n), rare = d.filter((i) => s.pts[i][2]).length, base = s.pts.filter((p) => p[2]).length / s.pts.length; return { label: 'Readers dropped', text: String(s.n), goal: 'drop 5', frac: s.n === 5 ? 1 : clamp(s.n / 10, 0, 0.9), met: s.n === 5, note: s.n ? `${rare} of them read rare subjects (${pct(rare / s.n)}). Among all readers here it is ${pct(base)}.` : '' }; }
    const left = I25.inside(s); return { label: 'Cuts made', text: s.cuts.length + (left <= 1 ? ': alone' : `   (${left - 1} still in its box)`), goal: s.round === 'play' ? 'alone in 3 or fewer' : 'alone', frac: left <= 1 ? 1 : clamp(1 - left / 41, 0, 0.9), met: left <= 1 && (s.round !== 'play' || s.cuts.length <= 3), note: s.round === 'twist' ? 'The odd point in the last round took two or three.' : '' };
  },
  clean(s) { return s.round !== 'play' || s.cuts.length <= 2; },
  demo(s) { if (s.round === 'case') { s.n = 5; return; } const T = s.pts[s.t]; for (let g = 0; g < 60 && I25.inside(s) > 1; g++) { const [x0, x1, y0, y1] = s.box, others = s.pts.filter((p, i) => i !== s.t && p[0] >= x0 && p[0] <= x1 && p[1] >= y0 && p[1] <= y1); if (s.axis === 0) { const lo = Math.max(x0, ...others.filter((p) => p[0] < T[0]).map((p) => p[0])), hi = Math.min(x1, ...others.filter((p) => p[0] > T[0]).map((p) => p[0])); I25.cut(s, T[0] - lo > hi - T[0] ? (lo === x0 ? (T[0] + hi) / 2 : (lo + T[0]) / 2) : (hi === x1 ? (lo + T[0]) / 2 : (T[0] + hi) / 2), 0); } else { const lo = Math.max(y0, ...others.filter((p) => p[1] < T[1]).map((p) => p[1])), hi = Math.min(y1, ...others.filter((p) => p[1] > T[1]).map((p) => p[1])); I25.cut(s, 0, T[1] - lo > hi - T[1] ? (lo === y0 ? (T[1] + hi) / 2 : (lo + T[1]) / 2) : (hi === y1 ? (lo + T[1]) / 2 : (T[1] + hi) / 2)); } } },
};

export const PART1C = [I18, I19, I20, I21, I22, I23, I24, I25];
