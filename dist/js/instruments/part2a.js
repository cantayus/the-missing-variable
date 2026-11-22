// Part II, winter: learning from data. Instruments II-1 to II-8.
import { DATA, INK, INK2, GREY, PALE, GOOD, WARM, SHAPES, nice, pct, clamp, sum, mean, R, gen, meterTo, meterCount, area, card, bars, title, legend, note, wrap, bounds } from './lib.js';
import { emStep, logLik, gauss2 } from '../algo/cluster.js';
import { lasso, growTree, predictTree, leaves } from '../algo/classify.js';

// ---------- II-1 Bend the picture ----------
const HOUSE = [[0, 0], [1, 0], [1, 0.7], [0.5, 1.15], [0, 0.7]];
const mul = (M, p) => [M[0][0] * p[0] + M[1][0] * p[1], M[0][1] * p[0] + M[1][1] * p[1]];   // M holds the two basis arrows
export const II1 = {
  id: 'II-1', name: 'Bend the picture', short: 'Matrices', formula: 'a 2 × 2 matrix is two arrows: where (1, 0) and (0, 1) land\ndeterminant = how much area is stretched\nan eigenvector keeps its direction',
  limit: 'All a matrix can do is stretch, turn, shear and flatten. Watch the blanks, too: a table full of them multiplies as if every blank were a zero.',
  rounds: { play: { brief: 'The two arrows say where the picture’s sides go. Drag them until your house covers the grey one.' }, twist: { brief: 'This matrix is fixed. Drag the probe arrow around. Find a direction that the matrix stretches without turning.' }, case: { brief: 'Readers down, titles across. Multiplying the grid by itself counts shared titles. Do one row by hand: tap every reader who shares two or more titles with reader 1.' } },
  hints: { play: ['Each arrow carries one side of the house.', 'Drag the blue arrow to the grey house’s lower right corner, then fix the orange one.'], twist: ['Watch the angle between the probe and its image.', 'Try pointing the probe up and to the right.'], case: ['Compare each row with the top row, cell by cell.', 'Folio can mark them.'] },
  teach: ['A matrix is a rule for moving every point.', 'Its columns tell you where the two unit arrows land.', 'Multiplying is applying the rule: once to a picture, or to a million rows at a time.'],
  init(round, ctx) {
    const r = ctx.rng(round);
    if (round === 'case') { const g = ctx.caseData.grid.rows, want = g.map((row, j) => (j > 0 && sum(row.map((v, k) => v * g[0][k])) >= 2 ? 1 : 0)); return { round, g, want, mark: g.map(() => 0), names: ctx.caseData.grid.titles }; }
    if (round === 'twist') return { round, M: [[1.6, 0.6], [0.6, 1.1]], ang: 2.3 };
    return { round, M: [[1, 0], [0, 1]], T: [[r.range(1.2, 1.7), r.range(0.2, 0.6)], [r.range(-0.7, -0.3), r.range(0.9, 1.3)]] };
  },
  draw(b, s) {
    b.clear();
    if (s.round === 'case') { const A = area(b), u = A.u, n = s.g[0].length, m = s.g.length, cw = (A.w - 150 * u) / n, ch = (A.h - 40 * u) / m; title(b, 'Readers by titles', 'a filled square means “borrowed”'); s.g.forEach((row, j) => { const y = A.y + 46 * u + j * ch * 0.92, sh = sum(row.map((v, k) => v * s.g[0][k])); if (j > 0) b.zone('r' + j, A.x, y, A.w, ch * 0.9); b.box(A.x, y, A.w, ch * 0.86, { fill: j === 0 ? '#fbf3d9' : s.mark[j] ? (s.want[j] ? '#e3efe9' : '#fbe9e2') : '#fff', color: PALE }); b.label(j === 0 ? 'reader 1' : 'reader ' + (j + 1), A.x + 8 * u, y + ch * 0.43, { size: 10.5, bold: j === 0 }); row.forEach((v, k) => b.mark(A.x + 90 * u + (k + 0.5) * cw, y + ch * 0.43, Math.min(cw, ch) * 0.27, 'square', v ? (j > 0 && s.g[0][k] && s.mark[j] ? DATA[1] : DATA[0]) : '#fff', v ? null : PALE)); if (s.mark[j]) b.label('shares ' + sh, A.x + A.w - 54 * u, y + ch * 0.43, { size: 10.5, mono: true }); }); return; }
    b.view(-2.6, 3.4, -1.6, 3.2, true); b.axes({ xt: 6, yt: 5 });
    if (s.round === 'twist') { const v = [Math.cos(s.ang) * 1.3, Math.sin(s.ang) * 1.3], w = mul(s.M, v); for (let i = -2; i <= 3; i++) { b.line(...mul(s.M, [i, -2]), ...mul(s.M, [i, 3]), { color: PALE }); b.line(...mul(s.M, [-2, i]), ...mul(s.M, [3, i]), { color: PALE }); } b.line(0, 0, w[0], w[1], { color: DATA[1], width: 3 }); b.dot(w[0], w[1], { color: DATA[1], shape: 'square', r: 6, label: 'where the matrix sends it' }); b.line(0, 0, v[0], v[1], { color: DATA[0], width: 3 }); b.handle('v', v[0], v[1], { color: DATA[0], label: 'probe' }); return; }
    b.path(HOUSE.map((p) => mul(s.T, p)), { close: true, fill: GREY, alpha: 0.35, color: GREY }); b.path(HOUSE.map((p) => mul(s.M, p)), { close: true, fill: DATA[2], alpha: 0.35, color: INK, width: 2 });
    b.line(0, 0, s.M[0][0], s.M[0][1], { color: DATA[0], width: 3 }); b.line(0, 0, s.M[1][0], s.M[1][1], { color: DATA[1], width: 3 }); b.handle('e0', s.M[0][0], s.M[0][1], { color: DATA[0], label: 'first arrow' }); b.handle('e1', s.M[1][0], s.M[1][1], { color: DATA[1], shape: 'square', label: 'second arrow' });
  },
  click(s, x, y, id) { if (s.round === 'case' && id?.[0] === 'r') { const j = +id.slice(1); s.mark[j] = s.mark[j] ? 0 : 1; } },
  drag(s, id, x, y) { if (id === 'e0') s.M[0] = [clamp(x, -2.4, 3.2), clamp(y, -1.4, 3)]; else if (id === 'e1') s.M[1] = [clamp(x, -2.4, 3.2), clamp(y, -1.4, 3)]; else if (id === 'v') s.ang = Math.atan2(y, x); },
  meter(s) {
    if (s.round === 'case') { const ok = s.mark.filter((v, j) => v && s.want[j]).length, bad = s.mark.filter((v, j) => v && !s.want[j]).length, need = sum(s.want); return { label: 'Readers found who share two or more', text: `${ok} of ${need}` + (bad ? `   (${bad} marked wrongly)` : ''), frac: need ? clamp((ok - bad) / need, 0, 1) : 1, met: ok === need && !bad, note: 'Most cells are empty. An empty cell multiplies as zero.' }; }
    if (s.round === 'twist') { const v = [Math.cos(s.ang), Math.sin(s.ang)], w = mul(s.M, v), turn = Math.abs(Math.atan2(v[0] * w[1] - v[1] * w[0], v[0] * w[0] + v[1] * w[1])) * 180 / Math.PI; return meterTo('The matrix turns the probe by', turn, 1.5, { lower: true, from: 40, fmt: (q) => q.toFixed(1) + '°', note: 'stretched ×' + Math.hypot(...w).toFixed(2) }); }
    const d = Math.sqrt(sum([0, 1].map((i) => (s.M[i][0] - s.T[i][0]) ** 2 + (s.M[i][1] - s.T[i][1]) ** 2))); return meterTo('Distance from the grey house', d, 0.12, { lower: true, from: 2, fmt: (v) => v.toFixed(2), note: 'area stretched ×' + Math.abs(s.M[0][0] * s.M[1][1] - s.M[0][1] * s.M[1][0]).toFixed(2) });
  },
  clean(s) { return s.round !== 'case' || !s.mark.some((v, j) => v && !s.want[j]); },
  demo(s) { if (s.round === 'case') s.mark = s.want.slice(); else if (s.round === 'twist') { let best = [99, 0]; for (let a = 0; a < Math.PI; a += 0.002) { const v = [Math.cos(a), Math.sin(a)], w = mul(s.M, v), t = Math.abs(v[0] * w[1] - v[1] * w[0]); if (t < best[0]) best = [t, a]; } s.ang = best[1]; } else s.M = s.T.map((r) => r.slice()); },
};

// ---------- II-2 Downhill in the fog ----------
const SURF = {
  bowl: { f: (x, y) => 0.5 * ((x - 1) ** 2 + (y + 0.5) ** 2), g: (x, y) => [x - 1, y + 0.5] },
  ravine: { f: (x, y) => 0.5 * ((x - 1) ** 2 * 0.06 + (y + 0.5) ** 2 * 6), g: (x, y) => [0.06 * (x - 1), 6 * (y + 0.5)] },
  two: { f: (x, y) => 1.2 - 1.0 * Math.exp(-((x + 2) ** 2 + (y - 1) ** 2) / 1.6) - 2.2 * Math.exp(-((x - 2.4) ** 2 + (y + 1.6) ** 2) / 1.2) + 0.02 * (x * x + y * y), g: null },
};
const grad = (S, x, y) => (S.g ? S.g(x, y) : [(S.f(x + 1e-4, y) - S.f(x - 1e-4, y)) / 2e-4, (S.f(x, y + 1e-4) - S.f(x, y - 1e-4)) / 2e-4]);
export const II2 = {
  id: 'II-2', name: 'Downhill in the fog', short: 'Gradient descent', formula: 'new place = old place − step size × slope\nrepeat until the slope is nearly flat',
  limit: 'Walking downhill gets you to a low place, which may not be the lowest. The method knows the slope under its feet and nothing else.',
  rounds: { play: { brief: 'You cannot see the valley, only the slope under your feet. Choose a step size and walk downhill. Reach the bottom in twenty-five steps or fewer.' }, twist: { brief: 'This valley is a long thin ravine. Big steps bounce off the walls and small ones crawl. Try, then rescale the map and try again.' }, case: { brief: 'Marginalia starts where it already stands and goes downhill. Tap anywhere to start the walk from a different place. Find ground lower than its valley.' } },
  hints: { play: ['Steps too small never arrive. Steps too large overshoot.', 'A step size near 0.5 gets there fast.'], twist: ['Tick “Rescale” and the ravine becomes a bowl.', 'Rescale, then use a step size near 1.'], case: ['The fog hides a second valley.', 'Start the walk in the lower right.'] },
  teach: ['Feel which way is downhill from where you stand.', 'Take a step that way, and choose the step size with care.', 'Where you end up depends on where you began.'],
  variants: [{ id: 'momentum', name: 'Momentum' }],
  init(round) { const surf = round === 'play' ? 'bowl' : round === 'twist' ? 'ravine' : 'two', pos = round === 'case' ? [-3.2, 2.4] : [-3, 2.5]; return { round, surf, pos, start: pos.slice(), lr: round === 'twist' ? 0.3 : 0.05, steps: 0, path: [pos.slice()], scaled: false, vel: [0, 0], tries: 0 }; },
  S(s) { return s.surf === 'ravine' && s.scaled ? SURF.bowl : SURF[s.surf]; },
  step(s, ctx) { const S = II2.S(s), g = grad(S, s.pos[0], s.pos[1]); if (ctx?.variant === 'momentum') { s.vel = [0.8 * s.vel[0] - s.lr * g[0], 0.8 * s.vel[1] - s.lr * g[1]]; s.pos = [s.pos[0] + s.vel[0], s.pos[1] + s.vel[1]]; } else s.pos = [s.pos[0] - s.lr * g[0], s.pos[1] - s.lr * g[1]]; s.pos = s.pos.map((v) => clamp(v, -30, 30)); s.steps++; s.path.push(s.pos.slice()); if (s.path.length > 80) s.path.shift(); },
  draw(b, s) {
    b.clear('#eef1f4'); b.view(-4.5, 4.5, -3.6, 3.6, true); const S = II2.S(s), g = b.g;
    // contour lines appear only near where you have walked
    for (const lv of [0.05, 0.2, 0.5, 1, 1.6, 2.4, 3.4, 5, 8, 12]) for (const p of s.path) { for (let a = 0; a < 6.283; a += 0.5) { const x = p[0] + Math.cos(a) * 0.55, y = p[1] + Math.sin(a) * 0.55, v = S.f(x, y); if (Math.abs(v - lv) < 0.04 + lv * 0.05) b.dot(x, y, { r: 1.6, color: INK2, stroke: null, alpha: 0.5 }); } }
    b.path(s.path, { color: WARM, width: 2 }); s.path.forEach((p) => b.dot(p[0], p[1], { r: 2.5, color: WARM, stroke: null }));
    const gr = grad(S, s.pos[0], s.pos[1]), L = Math.hypot(...gr) || 1; b.line(s.pos[0], s.pos[1], s.pos[0] - (gr[0] / L) * 0.8, s.pos[1] - (gr[1] / L) * 0.8, { color: DATA[0], width: 3 }); b.dot(s.pos[0], s.pos[1], { r: 8, color: INK }); b.text('you', s.pos[0], s.pos[1], { dy: -16 * b.u, size: 10.5, bold: true });
    if (s.round === 'case') b.dot(s.start[0], s.start[1], { r: 5, color: GREY, shape: 'square', label: 'where Marginalia began' });
  },
  click(s, x, y) { if (s.round !== 'case') return; s.pos = [clamp(x, -4.2, 4.2), clamp(y, -3.3, 3.3)]; s.path = [s.pos.slice()]; s.steps = 0; s.vel = [0, 0]; s.tries++; },
  controls(s, ctx) { const c = [{ type: 'slider', label: 'Step size', min: 0.01, max: s.round === 'twist' ? 2 : 1.6, step: 0.01, value: s.lr, set: (v) => { s.lr = v; }, show: (v) => v.toFixed(2) }, { type: 'button', go: true, label: 'Take a step', run: () => II2.step(s, ctx) }, { type: 'button', label: 'Take ten steps', run: () => { for (let i = 0; i < 10; i++) II2.step(s, ctx); } }, { type: 'button', label: 'Back to the start', run: () => { s.pos = s.start.slice(); s.path = [s.pos.slice()]; s.steps = 0; s.vel = [0, 0]; } }]; if (s.round === 'twist') c.push({ type: 'toggle', label: 'Rescale the map so both directions count alike', value: s.scaled, set: (v) => { s.scaled = v; s.pos = s.start.slice(); s.path = [s.pos.slice()]; s.steps = 0; } }); return c; },
  meter(s) { const h = II2.S(s).f(s.pos[0], s.pos[1]); if (s.round === 'case') return meterTo('Height where you stand', h, -0.6, { lower: true, from: 1.2, fmt: (v) => v.toFixed(2), note: `Marginalia’s own valley bottoms out near 0.3. Walks started: ${s.tries + 1}.` }); const ok = h <= 0.02 && s.steps <= 25; return { label: 'Height above the bottom', text: (Number.isFinite(h) ? h.toFixed(3) : 'off the map') + `   after ${s.steps} steps`, goal: 'goal ≤ 0.02 in 25 steps', frac: ok ? 1 : clamp(1 - h / 10, 0, 0.9), met: ok }; },
  demo(s, ctx) { if (s.round === 'case') { s.pos = [2, -1.2]; s.path = [s.pos.slice()]; s.lr = 0.3; s.steps = 0; } else { s.pos = s.start.slice(); s.path = [s.pos.slice()]; s.steps = 0; s.vel = [0, 0]; s.scaled = s.round === 'twist'; s.lr = ctx?.variant === 'momentum' ? 0.3 : 0.9; } for (let i = 0; i < 24; i++) II2.step(s, ctx); },
};

// ---------- II-3 The budget ----------
const Q = (b, c) => { const d0 = b[0] - c.o[0], d1 = b[1] - c.o[1]; return c.a * d0 * d0 + 2 * c.h * d0 * d1 + c.b * d1 * d1; };
function constrained(c, t, shape) { let best = [Infinity, [0, 0]]; if (Q([0, 0], c) && (shape === 'diamond' ? Math.abs(c.o[0]) + Math.abs(c.o[1]) : Math.hypot(...c.o)) <= t) return c.o.slice(); for (let i = 0; i <= 2000; i++) { const a = (i / 2000) * Math.PI * 2; let p; if (shape === 'diamond') { const cs = Math.cos(a), sn = Math.sin(a), k = t / (Math.abs(cs) + Math.abs(sn)); p = [cs * k, sn * k]; } else p = [Math.cos(a) * t, Math.sin(a) * t]; const v = Q(p, c); if (v < best[0]) best = [v, p]; } for (const p of [[t, 0], [-t, 0], [0, t], [0, -t]]) if (shape === 'diamond' && Q(p, c) <= best[0] + 1e-6) best = [Q(p, c), p]; return best[1]; }
export const II3 = {
  id: 'II-3', name: 'The budget', short: 'Ridge and lasso', formula: 'ridge: least squares, with Σ β² ≤ t (a circle)\nlasso: least squares, with Σ |β| ≤ t (a diamond)\na corner of the diamond sits on an axis, where one β is 0',
  limit: 'The lasso drops whatever has the weakest evidence. Weak evidence often means few examples, not small importance.',
  rounds: { play: { brief: 'The rings are the model’s loss, lowest at the cross. The diamond is the budget. Shrink it until the best point inside sits on a corner, with one coefficient at exactly zero.' }, twist: { brief: 'Now the budget is a circle. Shrink it and try to push the second coefficient below 0.1. Watch what happens to the first.' }, case: { brief: 'Ten subjects: five common, five rare, all equally important in truth. Raise the penalty until only three are left. See which went first.' } },
  hints: { play: ['Drag the handle on the diamond’s right-hand corner inward.', 'Keep shrinking until the dot snaps to a corner.'], twist: ['A circle has no corners to snap to.', 'Shrink it almost to nothing.'], case: ['Drag the penalty handle to the right.', 'Stop when three bars are left standing.'] },
  teach: ['Give the model a budget for the size of its coefficients.', 'A round budget shrinks them all. A pointed one sets some to zero.', 'Check what was dropped: it is what had least data.'],
  init(round, ctx) {
    const r = ctx.rng(round);
    if (round === 'case') { const n = 240, p = 10, rate = [0.5, 0.45, 0.4, 0.45, 0.5, 0.06, 0.05, 0.04, 0.05, 0.06], X = R(n, () => rate.map((q) => (r.chance(q) ? 1 : 0))), y = X.map((row) => sum(row) * 1 + r.n(0, 1.2)), names = ctx.caseData.subjects.names; return { round, X, y, lam: 0, names: [0, 5, 10, 15, 20, 3, 8, 13, 18, 33].map((i) => names[i]), rare: [0, 0, 0, 0, 0, 1, 1, 1, 1, 1] }; }
    return { round, c: { o: [2.1, 0.9], a: 1, h: -0.45, b: 1.4 }, t: 3.4, shape: round === 'twist' ? 'circle' : 'diamond' };
  },
  beta(s) { return constrained(s.c, s.t, s.shape); },
  coefs(s) { const my = mean(s.y); return lasso(s.X, s.y.map((v) => v - my), s.lam).w; },
  draw(b, s) {
    b.clear();
    if (s.round === 'case') { const w = II3.coefs(s); b.view(-0.6, 9.6, 0, 1.5); b.pad = { l: 50, r: 18, t: 18, b: 96 }; b.axes({ y: 'coefficient', xt: 0, xfmt: () => '' }); w.forEach((v, i) => { b.rect(i - 0.36, 0, 0.72, Math.max(0, v), { fill: s.rare[i] ? DATA[1] : DATA[0], alpha: Math.abs(v) < 1e-6 ? 0.2 : 1 }); const g = b.g; g.save(); g.translate(b.X(i), b.Y(0) + 8 * b.u); g.rotate(-0.5); b.label(s.names[i] + (Math.abs(v) < 1e-6 ? ' (dropped)' : ''), 0, 0, { align: 'right', size: 10, color: Math.abs(v) < 1e-6 ? GREY : INK }); g.restore(); }); b.line(-0.6, 1, 9.6, 1, { color: INK2, dash: [4, 4] }); b.text('true effect of every subject', 7.5, 1, { dy: -9 * b.u, size: 10, color: INK2 }); b.line(0, 1.38, 9, 1.38, { color: INK2, width: 3 }); b.handle('lam', (s.lam / 0.4) * 9, 1.38, { color: WARM, label: 'penalty λ = ' + s.lam.toFixed(3) }); b.pad = { l: 46, r: 18, t: 18, b: 38 }; const A = area(b); legend(b, [['common subject', DATA[0], 'square'], ['rare subject', DATA[1], 'square']], A.x + 60 * A.u, A.y + A.h - 4 * A.u); return; }
    b.view(-4, 4, -3, 3, true); b.axes({ x: 'first coefficient', y: 'second coefficient', xt: 8, yt: 6 }); for (const lv of [0.15, 0.6, 1.4, 2.6, 4.2, 6.2]) { const pts = []; for (let i = 0; i <= 120; i++) { const a = (i / 120) * Math.PI * 2, d = [Math.cos(a), Math.sin(a)], q = s.c.a * d[0] * d[0] + 2 * s.c.h * d[0] * d[1] + s.c.b * d[1] * d[1], rr = Math.sqrt(lv / q); pts.push([s.c.o[0] + d[0] * rr, s.c.o[1] + d[1] * rr]); } b.path(pts, { color: GREY, close: true }); }
    b.dot(s.c.o[0], s.c.o[1], { shape: 'cross', color: INK2, r: 5, label: 'no budget' }); if (s.shape === 'diamond') b.path([[s.t, 0], [0, s.t], [-s.t, 0], [0, -s.t]], { close: true, fill: DATA[0], alpha: 0.18, color: DATA[0], width: 2 }); else b.circle(0, 0, s.t, { fill: DATA[0], alpha: 0.18, color: DATA[0], width: 2 });
    const be = II3.beta(s); b.dot(be[0], be[1], { color: WARM, r: 7, label: `(${be[0].toFixed(2)}, ${be[1].toFixed(2)})` }); b.handle('t', s.t, 0, { color: DATA[0], shape: 'diamond', label: 'budget ' + s.t.toFixed(2) });
  },
  drag(s, id, x) { if (id === 't') s.t = clamp(Math.round(x * 50) / 50, 0.02, 3.8); else if (id === 'lam') s.lam = clamp(Math.round((x / 9) * 0.4 * 400) / 400, 0, 0.4); },
  meter(s) {
    if (s.round === 'case') { const w = II3.coefs(s), kept = w.filter((v) => Math.abs(v) > 1e-6).length, rk = w.filter((v, i) => Math.abs(v) > 1e-6 && s.rare[i]).length; return { label: 'Subjects still in the model', text: `${kept} of 10`, goal: 'goal: 3', frac: kept === 3 ? 1 : clamp(1 - Math.abs(kept - 3) / 7, 0, 0.9), met: kept === 3, note: `rare subjects still in: ${rk} of 5` }; }
    const be = II3.beta(s); if (s.shape === 'circle') return { label: 'Second coefficient', text: be[1].toFixed(2) + '   first: ' + be[0].toFixed(2), goal: 'second ≤ 0.10', frac: Math.abs(be[1]) <= 0.1 ? 1 : clamp(1 - Math.abs(be[1]), 0, 0.9), met: Math.abs(be[1]) <= 0.1, note: 'A circle shrinks both together. Neither reaches zero until the budget does.' };
    const zero = Math.abs(be[1]) < 0.005 && s.t > 0.3; return { label: 'Second coefficient', text: be[1].toFixed(2) + '   first: ' + be[0].toFixed(2), goal: 'exactly zero, with budget to spare', frac: zero ? 1 : clamp(1 - Math.abs(be[1]), 0, 0.9), met: zero, note: `loss at this point ${Q(be, s.c).toFixed(2)}` };
  },
  demo(s) { if (s.round === 'case') { for (let l = 0; l <= 0.4; l += 0.0025) { s.lam = Math.round(l * 400) / 400; if (II3.coefs(s).filter((v) => Math.abs(v) > 1e-6).length === 3) return; } } else if (s.shape === 'circle') s.t = 0.08; else { for (let t = 3.4; t > 0.3; t -= 0.02) { s.t = Math.round(t * 50) / 50; if (Math.abs(II3.beta(s)[1]) < 0.005) return; } } },
};

// ---------- II-4 Two clouds, no labels ----------
const pt2 = (s) => s.pts.map((p) => [p[0], p[1]]);
export const II4 = {
  id: 'II-4', name: 'Two clouds, no labels', short: 'Expectation-maximization', formula: 'expect: how much does each cloud claim each point?\nmaximize: refit each cloud to the points it claims\nrepeat; the likelihood never falls',
  limit: 'EM climbs to the nearest peak and stays there. A different start can give a different answer.',
  rounds: { play: { brief: 'Two overlapping clouds of points, and nobody wrote down which is which. Press “Expect”, then “Maximize”, in turn, until the likelihood stops rising.' }, twist: { brief: 'Both guesses started in the same cloud, and the method has settled for a poor answer. Drag one centre to where the other cloud is, then run it again.' }, case: { brief: 'One Common Shelf reader, by field. A hard cluster keeps only the largest part. Drag the cut-off down until at least 95% of what this reader borrows is still served.' } },
  hints: { play: ['Each press does half a round.', 'Press “Ten rounds”. If it settles too low, drag a centre into the cloud it is missing.'], twist: ['One cloud has no centre near it.', 'Drag the orange centre onto the far cloud and press “Ten rounds”.'], case: ['Anything below the line is thrown away.', 'Drag the line below the smallest bar.'] },
  teach: ['Guess where the clouds are.', 'Let each cloud claim a share of every point, then move each cloud to fit its shares.', 'Repeat until nothing changes. A point can belong partly to both.'],
  init(round, ctx) {
    const r = ctx.rng(round);
    if (round === 'case') return { round, mix: ctx.caseData.mix, cut: 0.4 };
    const pts = [...R(60, () => [r.n(2.6, 0.8), r.n(3, 0.9), 0]), ...R(60, () => [r.n(6.6, 1.1), r.n(5.6, 0.8), 1])], cov = [[1.4, 0], [0, 1.4]], comps = round === 'twist' ? [{ w: 0.5, mu: [2.2, 2.6], cov }, { w: 0.5, mu: [3, 3.4], cov }] : [{ w: 0.5, mu: [1.2, 1.4], cov }, { w: 0.5, mu: [8.4, 7.2], cov }];
    const s = { round, pts, comps, resp: null, phase: 0, rounds: 0, best: 0 }; let c = [{ w: 0.5, mu: [2.6, 3], cov }, { w: 0.5, mu: [6.6, 5.6], cov }]; for (let i = 0; i < 60; i++) c = emStep(pt2(s), c).comps; s.best = logLik(pt2(s), c);
    if (round === 'twist') { for (let i = 0; i < 3; i++) s.comps = emStep(pt2(s), s.comps).comps; s.comps[1].mu = [s.comps[0].mu[0] + 0.3, s.comps[0].mu[1] + 0.2]; s.comps[1].cov = s.comps[0].cov.map((q) => q.slice()); s.resp = emStep(pt2(s), s.comps).resp; } return s;
  },
  draw(b, s) {
    b.clear(); const A = area(b), u = A.u;
    if (s.round === 'case') { b.view(-0.6, 2.6, 0, 0.8); b.axes({ y: 'share of this reader’s loans', xt: 0, xfmt: () => '', yfmt: (v) => pct(v) }); s.mix.forEach(([nm, v], i) => { b.rect(i - 0.3, 0, 0.6, v, { fill: v >= s.cut ? DATA[i] : GREY, alpha: v >= s.cut ? 1 : 0.4 }); b.text(nm + ' ' + pct(v), i, v, { dy: -10 * u, size: 11.5, bold: true }); b.text(v >= s.cut ? 'served' : 'dropped', i, 0, { dy: 13 * u, size: 10.5, color: v >= s.cut ? GOOD : WARM }); }); b.line(-0.6, s.cut, 2.6, s.cut, { color: WARM, width: 2, dash: [6, 4] }); b.handle('cut', 2.4, s.cut, { color: WARM, label: 'cut-off ' + pct(s.cut) }); return; }
    b.view(0, 10, 0, 8.5, true); b.axes({ xt: 0, yt: 0, xfmt: () => '', yfmt: () => '', grid: false }); const g = b.g;
    s.pts.forEach((p, i) => { const rr = s.resp ? s.resp[i][0] : 0.5, col = s.resp ? `rgb(${Math.round(0 * rr + 230 * (1 - rr))},${Math.round(114 * rr + 159 * (1 - rr))},${Math.round(178 * rr + 0 * (1 - rr))})` : GREY; b.dot(p[0], p[1], { color: col, r: 4 }); });
    s.comps.forEach((c, j) => { const tr = c.cov[0][0] + c.cov[1][1], det = c.cov[0][0] * c.cov[1][1] - c.cov[0][1] ** 2, l1 = tr / 2 + Math.sqrt(Math.max(0, tr * tr / 4 - det)), l2 = tr / 2 - Math.sqrt(Math.max(0, tr * tr / 4 - det)), th = Math.atan2(l1 - c.cov[0][0], c.cov[0][1] || 1e-9); for (const k of [1, 2]) { g.beginPath(); g.ellipse(b.X(c.mu[0]), b.Y(c.mu[1]), Math.abs(b.sx(Math.sqrt(Math.max(l1, 1e-4)) * k)), Math.abs(b.sy(Math.sqrt(Math.max(l2, 1e-4)) * k)), -th, 0, 7); g.strokeStyle = DATA[j]; g.lineWidth = (k === 1 ? 2.2 : 1) * u; g.stroke(); } b.handle('m' + j, c.mu[0], c.mu[1], { color: DATA[j], shape: j ? 'square' : 'circle', label: 'cloud ' + (j + 1) }); });
  },
  drag(s, id, x, y) { if (id === 'cut') s.cut = clamp(Math.round(y * 100) / 100, 0.02, 0.7); else if (id?.[0] === 'm') { s.comps[+id[1]].mu = [clamp(x, 0.3, 9.7), clamp(y, 0.3, 8.2)]; s.resp = emStep(pt2(s), s.comps).resp; } },
  round1(s) { const e = emStep(pt2(s), s.comps); s.comps = e.comps; s.resp = emStep(pt2(s), s.comps).resp; s.rounds++; s.phase = 0; },
  controls(s) { if (s.round === 'case') return []; return [{ type: 'button', go: s.phase === 0, label: 'Expect', disabled: s.phase === 1, run: () => { s.resp = emStep(pt2(s), s.comps).resp; s.phase = 1; } }, { type: 'button', go: s.phase === 1, label: 'Maximize', disabled: s.phase === 0, run: () => II4.round1(s) }, { type: 'button', label: 'Ten rounds', run: () => { for (let i = 0; i < 10; i++) II4.round1(s); } }]; },
  meter(s) { if (s.round === 'case') { const kept = sum(s.mix.filter((m) => m[1] >= s.cut).map((m) => m[1])) / sum(s.mix.map((m) => m[1])); return meterTo('Of this reader’s reading, still served', kept, 0.95, { fmt: (v) => pct(v), from: 0.5 }); } const ll = logLik(pt2(s), s.comps); return meterTo('Log-likelihood', ll, s.best - 1.5, { from: s.best - 160, fmt: (v) => v.toFixed(1), note: `the best fit reaches ${s.best.toFixed(1)};  rounds run: ${s.rounds}` }); },
  demo(s) { if (s.round === 'case') { s.cut = 0.02; return; } if (s.round === 'twist') s.comps[1].mu = [6.6, 5.6]; for (let i = 0; i < 60; i++) II4.round1(s); },
};

// ---------- II-5 The best shadow ----------
function shadow(pts, ang) { const c = [mean(pts.map((p) => p[0])), mean(pts.map((p) => p[1]))], d = [Math.cos(ang), Math.sin(ang)], pr = pts.map((p) => (p[0] - c[0]) * d[0] + (p[1] - c[1]) * d[1]), tot = mean(pts.map((p) => (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2)); return { c, d, pr, share: mean(pr.map((v) => v * v)) / tot }; }
function sep(pts, ang) { const sh = shadow(pts, ang), a = sh.pr.filter((_, i) => pts[i][2] === 0), bq = sh.pr.filter((_, i) => pts[i][2] === 1), sd = (v) => Math.sqrt(mean(v.map((x) => (x - mean(v)) ** 2))); return Math.abs(mean(a) - mean(bq)) / (sd(a) + sd(bq) + 1e-9); }
export const II5 = {
  id: 'II-5', name: 'The best shadow', short: 'Principal components', formula: 'find the direction along which the points vary most\nthat is the first component; the next is at right angles to it\nvariance explained = spread along it / total spread',
  limit: 'The first components keep what varies most across everybody. Something only a few points do lies in the directions that were thrown away.',
  rounds: { play: { brief: 'The cloud casts a shadow on the line. Turn the line until the shadow is as wide as it can be.' }, twist: { brief: 'Two kinds of point, circles and squares. Turn the line to the shadow that best tells them apart. Is it the widest shadow?' }, case: { brief: 'Marginalia keeps a few components of each reader’s taste. Drag to the number it keeps: ten. Compare what survives of common subjects and of rare ones.' } },
  hints: { play: ['Line the shadow up with the long way of the cloud.', 'Tilt the line up to the right.'], twist: ['The groups differ across the cloud, not along it.', 'Turn the line a quarter turn from the widest shadow.'], case: ['The marker shows how many are kept.', 'Drag it to 10.'] },
  teach: ['Turn the data until its shadow is as wide as possible.', 'Keep that direction, then the next widest at right angles.', 'Drop the rest, and remember that the rest is where the unusual lives.'],
  init(round, ctx) {
    const r = ctx.rng(round); if (round === 'case') return { round, P: ctx.caseData.pca, k: 30 };
    const th = r.range(0.5, 0.9), pts = R(70, (i) => { const g = i % 2, a = r.n(0, 2), c = r.n(0, 0.38) + (round === 'twist' ? (g ? 0.75 : -0.75) : 0); return [5 + a * Math.cos(th) - c * Math.sin(th), 4 + a * Math.sin(th) + c * Math.cos(th), round === 'twist' ? g : 0]; });
    return { round, pts, ang: th + (round === 'twist' ? 0.05 : 1.2), best: 0 };
  },
  draw(b, s) {
    b.clear();
    if (s.round === 'case') { b.view(0.5, 40.5, 0, 1.05); b.axes({ x: 'components kept', y: 'share that survives', xt: 8, xfmt: (v) => String(Math.round(v)), yfmt: (v) => pct(v) }); b.path(s.P.commonCurve.map((v, i) => [i + 1, v]), { color: DATA[0], width: 2.5 }); b.path(s.P.rareCurve.map((v, i) => [i + 1, v]), { color: DATA[1], width: 2.5, dash: [6, 4] }); b.line(s.k, 0, s.k, 1, { color: WARM, width: 2 }); b.handle('k', s.k, 1, { color: WARM, shape: 'diamond', label: s.k + ' kept' }); b.dot(s.k, s.P.commonCurve[s.k - 1], { color: DATA[0], r: 6 }); b.dot(s.k, s.P.rareCurve[s.k - 1], { color: DATA[1], r: 6, shape: 'square' }); const A = area(b); legend(b, [['common subjects', DATA[0]], ['rare subjects', DATA[1], 'square']], A.x + 80 * A.u, A.y + A.h - 60 * A.u); return; }
    b.view(0, 10, 0, 8, true); b.axes({ xt: 0, yt: 0, xfmt: () => '', yfmt: () => '', grid: false }); const sh = shadow(s.pts, s.ang), L = 4.6, base = [sh.c[0] + Math.sin(s.ang) * -0 , sh.c[1]];
    b.line(sh.c[0] - sh.d[0] * L, sh.c[1] - sh.d[1] * L, sh.c[0] + sh.d[0] * L, sh.c[1] + sh.d[1] * L, { color: INK, width: 2 });
    s.pts.forEach((p, i) => { const q = [sh.c[0] + sh.d[0] * sh.pr[i], sh.c[1] + sh.d[1] * sh.pr[i]]; b.line(p[0], p[1], q[0], q[1], { color: PALE }); b.dot(q[0], q[1], { r: 3, color: DATA[p[2] ? 1 : 0], shape: p[2] ? 'square' : 'circle', stroke: null, alpha: 0.9 }); });
    s.pts.forEach((p) => b.dot(p[0], p[1], { color: DATA[p[2] ? 1 : 0], shape: p[2] ? 'square' : 'circle', r: 4.2 })); b.handle('ang', sh.c[0] + sh.d[0] * 4.2, sh.c[1] + sh.d[1] * 4.2, { color: WARM, label: 'turn' });
  },
  drag(s, id, x, y) { if (id === 'ang') { const c = shadow(s.pts, 0).c; s.ang = Math.atan2(y - c[1], x - c[0]); } else if (id === 'k') s.k = clamp(Math.round(x), 1, 40); },
  meter(s) {
    if (s.round === 'case') return { label: 'Kept: ' + s.k + ' components', text: `common ${pct(s.P.commonCurve[s.k - 1])}   rare ${pct(s.P.rareCurve[s.k - 1])}`, goal: 'set it to 10', frac: s.k === 10 ? 1 : 0.3, met: s.k === 10, note: `all variation kept: ${pct(s.P.curve[s.k - 1])}` };
    let best = 0, bestSep = 0; for (let a = 0; a < Math.PI; a += 0.01) { best = Math.max(best, shadow(s.pts, a).share); bestSep = Math.max(bestSep, sep(s.pts, a)); }
    if (s.round === 'twist') { const v = sep(s.pts, s.ang); return meterTo('How well the shadow tells them apart', v, bestSep * 0.96, { from: 0, fmt: (q) => q.toFixed(2), note: `this shadow holds ${pct(shadow(s.pts, s.ang).share)} of the spread. The widest holds ${pct(best)}.` }); }
    return meterTo('Spread kept in the shadow', shadow(s.pts, s.ang).share, best * 0.995, { from: 0.1, fmt: (v) => pct(v, 1) });
  },
  demo(s) { if (s.round === 'case') { s.k = 10; return; } let best = [0, 0]; for (let a = 0; a < Math.PI; a += 0.002) { const v = s.round === 'twist' ? sep(s.pts, a) : shadow(s.pts, a).share; if (v > best[0]) best = [v, a]; } s.ang = best[1]; },
};

// ---------- II-6 The widest street ----------
function street(s) { const d = [s.q[0] - s.p[0], s.q[1] - s.p[1]], L = Math.hypot(...d) || 1, nrm = [-d[1] / L, d[0] / L]; let m = Infinity, wrong = 0; const sides = []; s.pts.forEach((pt, i) => { if (s.skip?.includes(i)) { sides.push(0); return; } const v = ((pt[0] - s.p[0]) * nrm[0] + (pt[1] - s.p[1]) * nrm[1]) * (pt[2] ? 1 : -1); sides.push(v); if (v < 0) wrong++; m = Math.min(m, v); }); return { nrm, margin: m, wrong, sides }; }
function bestStreet(pts, skipN = 0) { let best = [-9, 0, 0, []]; const A = pts.map((p, i) => i).filter((i) => pts[i][2]), B = pts.map((p, i) => i).filter((i) => !pts[i][2]); const cand = skipN ? pts.map((_, i) => [i]) : [[]]; for (const sk of cand) for (let a = 0; a < Math.PI * 2; a += 0.01) { const n = [Math.cos(a), Math.sin(a)], pa = Math.min(...A.filter((i) => !sk.includes(i)).map((i) => pts[i][0] * n[0] + pts[i][1] * n[1])), pb = Math.max(...B.filter((i) => !sk.includes(i)).map((i) => pts[i][0] * n[0] + pts[i][1] * n[1])), m = (pa - pb) / 2; if (m > best[0]) best = [m, a, (pa + pb) / 2, sk]; } return best; }
export const II6 = {
  id: 'II-6', name: 'The widest street', short: 'Support vector machine', formula: 'choose the line with the widest empty band on both sides\nthe points touching the band are the support vectors\nsoft margin: let a few points break the rule, at a cost',
  limit: 'The line is drawn between the examples it was given. Whatever it has never seen lands on one side or the other by default.',
  rounds: { play: { brief: 'Drag the two ends of the line. Keep circles on one side and squares on the other, and make the empty street between them as wide as you can.' }, twist: { brief: 'One square has wandered into the circles, so no street is clean. Tap one point to forgive it. Then widen the street.' }, case: { brief: 'Squares: shown and borrowed. Circles: shown and left. Grey: books Marginalia has never shown. Draw the widest street. Then see where the grey ones fall.' } },
  hints: { play: ['The street is as wide as its nearest point allows.', 'Turn the line so that the closest circle and the closest square are equally far.'], twist: ['Forgive the square that sits among the circles.', 'Tap the stray square, then fit the line as before.'], case: ['Fit the two coloured groups only.', 'Folio can place the line.'] },
  teach: ['Many lines separate the two groups.', 'Pick the one with the most room on both sides.', 'Only the nearest points decide it. The rest could vanish and nothing would move.'],
  init(round, ctx) {
    const r = ctx.rng(round), pts = [...R(18, () => [r.n(2.8, 0.7), r.n(5.4, 0.8), 0]), ...R(18, () => [r.n(7, 0.8), r.n(2.8, 0.8), 1])]; let grey = null;
    if (round === 'twist') pts.push([3.2, 5.2, 1]); if (round === 'case') grey = R(40, () => [r.range(0.5, 9.5), r.range(0.5, 7.5)]);
    const s = { round, pts, p: [1, 1], q: [9, 7.4], skip: [], grey }; s.best = bestStreet(pts, round === 'twist' ? 1 : 0)[0]; return s;
  },
  draw(b, s) {
    b.clear(); b.view(0, 10, 0, 8, true); b.axes({ xt: 0, yt: 0, xfmt: () => '', yfmt: () => '', grid: false }); const st = street(s), m = Math.max(0, st.margin), d = [s.q[0] - s.p[0], s.q[1] - s.p[1]], ext = (k) => [[s.p[0] - d[0] * 3 + st.nrm[0] * k, s.p[1] - d[1] * 3 + st.nrm[1] * k], [s.q[0] + d[0] * 3 + st.nrm[0] * k, s.q[1] + d[1] * 3 + st.nrm[1] * k]];
    if (m > 0) b.path([ext(m)[0], ext(m)[1], ext(-m)[1], ext(-m)[0]], { close: true, fill: DATA[2], alpha: 0.15, color: null }); b.line(...ext(0)[0], ...ext(0)[1], { color: INK, width: 2.5 }); if (m > 0) { b.line(...ext(m)[0], ...ext(m)[1], { color: INK2, dash: [5, 4] }); b.line(...ext(-m)[0], ...ext(-m)[1], { color: INK2, dash: [5, 4] }); }
    if (s.grey) s.grey.forEach((g) => b.dot(g[0], g[1], { color: GREY, shape: 'diamond', r: 3.5, alpha: 0.8 }));
    s.pts.forEach((p, i) => { const sk = s.skip.includes(i), sv = !sk && Math.abs(st.sides[i] - st.margin) < 0.03 && m > 0; if (s.round === 'twist') b.handle('pt' + i, p[0], p[1], { draw: false, r: 7 }); b.dot(p[0], p[1], { color: sk ? '#fff' : DATA[p[2] ? 1 : 0], shape: p[2] ? 'square' : 'circle', r: sv ? 7 : 5, stroke: sk ? DATA[p[2] ? 1 : 0] : sv ? INK : '#fff' }); });
    b.handle('p', s.p[0], s.p[1], { color: WARM }); b.handle('q', s.q[0], s.q[1], { color: WARM });
  },
  click(s, x, y, id) { if (s.round === 'twist' && id?.startsWith('pt')) { const i = +id.slice(2); s.skip = s.skip.includes(i) ? [] : [i]; } },
  drag(s, id, x, y) { if (id === 'p' || id === 'q') s[id] = [clamp(x, 0, 10), clamp(y, 0, 8)]; },
  meter(s) { const st = street(s), m = st.wrong ? -1 : st.margin, ok = m >= s.best * 0.94; let nt = st.wrong ? st.wrong + ' on the wrong side' : ''; if (s.round === 'case') { const no = s.grey.filter((g) => (g[0] - s.p[0]) * st.nrm[0] + (g[1] - s.p[1]) * st.nrm[1] < 0).length; nt = `never-shown books that fall on the “left” side: ${pct(no / s.grey.length)}. The line was not drawn with them in mind.`; } return { label: 'Half-width of the street', text: st.wrong ? 'no clean street' : m.toFixed(2), goal: 'goal ≥ ' + (s.best * 0.94).toFixed(2), frac: ok ? 1 : clamp(m / s.best, 0, 0.9), met: ok && !st.wrong, note: nt }; },
  demo(s) { const bq = bestStreet(s.pts, s.round === 'twist' ? 1 : 0), n = [Math.cos(bq[1]), Math.sin(bq[1])], t = [-n[1], n[0]], c = [n[0] * bq[2], n[1] * bq[2]]; s.skip = bq[3]; s.p = [c[0] - t[0] * 3, c[1] - t[1] * 3]; s.q = [c[0] + t[0] * 3, c[1] + t[1] * 3]; if (street(s).wrong) [s.p, s.q] = [s.q, s.p]; },
};

// ---------- II-7 Grow and prune ----------
function leavesOf(n, out = []) { if (n.cut) { leavesOf(n.a, out); leavesOf(n.b, out); } else out.push(n); return out; }
function giniOf(s) { const ls = leavesOf(s.tree); let g = 0; for (const l of ls) { const inb = s.pts.filter((p) => p[0] >= l.box[0] && p[0] < l.box[1] && p[1] >= l.box[2] && p[1] < l.box[3]), n = inb.length, k = inb.filter((p) => p[2]).length; if (n) g += (n / s.pts.length) * 2 * (k / n) * (1 - k / n); } return g; }
function cutAt(s, x, y, axis) { const l = leavesOf(s.tree).find((q) => x >= q.box[0] && x < q.box[1] && y >= q.box[2] && y < q.box[3]); if (!l) return; const [x0, x1, y0, y1] = l.box; if (axis === 0) { l.cut = [0, x]; l.a = { box: [x0, x, y0, y1] }; l.b = { box: [x, x1, y0, y1] }; } else { l.cut = [1, y]; l.a = { box: [x0, x1, y0, y] }; l.b = { box: [x0, x1, y, y1] }; } s.cuts++; }
const regions = (node, box, out = []) => { if (!node.left) { out.push([box, node.label]); return out; } const [x0, x1, y0, y1] = box; if (node.f === 0) { regions(node.left, [x0, Math.min(x1, node.th), y0, y1], out); regions(node.right, [Math.max(x0, node.th), x1, y0, y1], out); } else { regions(node.left, [x0, x1, y0, Math.min(y1, node.th)], out); regions(node.right, [x0, x1, Math.max(y0, node.th), y1], out); } return out; };
const accOf = (tree, pts) => pts.filter((p) => predictTree(tree, [p[0], p[1]]) === p[2]).length / pts.length;
export const II7 = {
  id: 'II-7', name: 'Grow and prune', short: 'Decision trees', formula: 'Gini impurity of a box = 2·p·(1 − p)\nchoose the cut that lowers the weighted impurity most\nprune: undo cuts that gain too little',
  limit: 'A tree can only ask about what it was given. Prune it hard and the questions about small groups are the first to go.',
  rounds: { play: { brief: 'Orchards that got frost (squares) and ones that did not. Tap to cut the map with straight lines until each piece is nearly one kind. Use five cuts or fewer.' }, twist: { brief: 'This tree was grown until every training dot was right. Hollow dots are new orchards. Drag the shears to cut it back, and find the depth that does best on the new ones.' }, case: { brief: 'Titles: loans last year across, quality up. Squares were shown by Marginalia last month. Make one cut that separates them.' } },
  hints: { play: ['Choose “down” or “across”, then tap where the kinds change.', 'First cut down the middle, then across each half.'], twist: ['A little pruning helps. A lot hurts.', 'Stop where the hollow-dot score is highest.'], case: ['One cut, straight down.', 'Tap between the two groups, with “down” selected.'] },
  teach: ['Ask the yes-or-no question that sorts the data best.', 'Ask again inside each answer, and stop before you are memorizing.', 'Prune the questions that only sorted a handful.'],
  two: { set: 'Think of an animal.', solve: 'Reach it with yes-or-no questions, each splitting what is left.' },
  init(round, ctx) {
    const r = ctx.rng(round);
    if (round === 'case') { const pts = ctx.caseData.treeSample.map((p) => [p[0], p[1], p[2]]); return { round, pts, tree: { box: [-0.2, 3.9, 0, 1.05] }, cuts: 0, axis: 0, bd: [-0.2, 3.9, 0, 1.05] }; }
    const lab = (x, y) => ((x < 5) !== (y < 4.2) ? 1 : 0), mk = (n, noise) => R(n, () => { const x = r.range(0.2, 9.8), y = r.range(0.2, 7.8); return [x, y, r.chance(noise) ? 1 - lab(x, y) : lab(x, y)]; });
    if (round === 'twist') { const corner = (x, y) => (x < 5 && y < 4.2 ? 1 : 0), mk2 = (n) => R(n, () => { const x = r.range(0.2, 9.8), y = r.range(0.2, 7.8); return [x, y, r.chance(0.2) ? 1 - corner(x, y) : corner(x, y)]; }), pts = mk2(90), test = mk2(90), full = growTree(pts.map((p) => [p[0], p[1]]), pts.map((p) => p[2]), { maxDepth: 9, minLeaf: 1 }); return { round, pts, test, full, g: 9 }; }
    return { round, pts: mk(60, 0.03), tree: { box: [0, 10, 0, 8] }, cuts: 0, axis: 0, bd: [0, 10, 0, 8] };
  },
  pruned(s) { const cutTo = (n, d) => { if (!n.left) return n; if (d <= 0) return { counts: n.counts, n: n.n, label: n.label }; return { ...n, left: cutTo(n.left, d - 1), right: cutTo(n.right, d - 1) }; }; return cutTo(s.full, s.g); },
  draw(b, s) {
    b.clear();
    if (s.round === 'twist') { b.view(0, 10, -1.2, 8); b.axes({ xt: 0, yt: 0, xfmt: () => '', yfmt: () => '', grid: false }); const t = II7.pruned(s); regions(t, [0, 10, 0, 8]).forEach(([bx, l]) => b.rect(bx[0], bx[2], bx[1] - bx[0], bx[3] - bx[2], { fill: DATA[l ? 1 : 0], alpha: 0.16, color: INK2 })); s.pts.forEach((p) => b.dot(p[0], p[1], { color: DATA[p[2] ? 1 : 0], shape: p[2] ? 'square' : 'circle', r: 3.6 })); s.test.forEach((p) => b.dot(p[0], p[1], { color: '#fff', stroke: DATA[p[2] ? 1 : 0], shape: p[2] ? 'square' : 'circle', r: 4 })); b.line(0.5, -0.7, 9.5, -0.7, { color: INK2, width: 3 }); b.handle('g', 0.5 + s.g, -0.7, { color: WARM, shape: 'diamond', label: 'questions deep: ' + s.g }); return; }
    b.view(...s.bd); b.axes(s.round === 'case' ? { x: 'loans last year (log scale)', y: 'quality' } : { xt: 0, yt: 0, xfmt: () => '', yfmt: () => '', grid: false });
    leavesOf(s.tree).forEach((l) => { const inb = s.pts.filter((p) => p[0] >= l.box[0] && p[0] < l.box[1] && p[1] >= l.box[2] && p[1] < l.box[3]), k = inb.filter((p) => p[2]).length; b.rect(l.box[0], l.box[2], l.box[1] - l.box[0], l.box[3] - l.box[2], { fill: inb.length ? DATA[k * 2 >= inb.length ? 1 : 0] : '#fff', alpha: 0.14, color: INK2 }); });
    s.pts.forEach((p) => b.dot(p[0], p[1], { color: DATA[p[2] ? 1 : 0], shape: p[2] ? 'square' : 'circle', r: 4 })); b.text('next cut: ' + (s.axis ? 'across' : 'down'), (s.bd[0] + s.bd[1]) / 2, s.bd[3], { dy: 10 * b.u, size: 11, color: INK2 });
  },
  click(s, x, y) { if (s.round === 'twist') return; if (x > s.bd[0] && x < s.bd[1] && y > s.bd[2] && y < s.bd[3]) cutAt(s, x, y, s.axis); },
  drag(s, id, x) { if (id === 'g') s.g = clamp(Math.round(x - 0.5), 0, 9); },
  controls(s) { return s.round === 'twist' ? [] : [{ type: 'buttons', label: 'Next cut goes', value: s.axis, options: [{ label: 'down', value: 0 }, { label: 'across', value: 1 }], set: (v) => { s.axis = v; } }]; },
  meter(s) {
    if (s.round === 'twist') { const t = II7.pruned(s), te = accOf(t, s.test); let best = 0; for (let g = 0; g <= 9; g++) best = Math.max(best, accOf(II7.pruned({ ...s, g }), s.test)); return meterTo('Right on the new orchards', te, best - 0.005, { from: 0.5, fmt: (v) => pct(v), note: `right on the training dots: ${pct(accOf(t, s.pts))};  leaves: ${leaves(t)}` }); }
    const g = giniOf(s), lim = s.round === 'case' ? 1 : 5, target = s.round === 'case' ? 0.02 : 0.1; return { label: 'Impurity left', text: g.toFixed(3) + `   cuts: ${s.cuts}`, goal: `goal ≤ ${target} in ${lim} cut${lim > 1 ? 's' : ''}`, frac: g <= target ? (s.cuts <= lim ? 1 : 0.7) : clamp(1 - g / 0.5, 0, 0.9), met: g <= target && s.cuts <= lim };
  },
  demo(s) { if (s.round === 'twist') { let best = [0, 0]; for (let g = 0; g <= 9; g++) { const a = accOf(II7.pruned({ ...s, g }), s.test); if (a > best[0]) best = [a, g]; } s.g = best[1]; return; } s.tree = { box: s.bd.slice() }; s.cuts = 0; if (s.round === 'case') { const lo = Math.max(...s.pts.filter((p) => !p[2]).map((p) => p[0])), hi = Math.min(...s.pts.filter((p) => p[2]).map((p) => p[0])); cutAt(s, (lo + hi) / 2, 0.5, 0); } else { cutAt(s, 5, 4, 0); cutAt(s, 2, 4.2, 1); cutAt(s, 8, 4.2, 1); } },
};

// ---------- II-8 Find the hand ----------
// A depth picture: 0 is near, 1 is far. A figure stands in front of a far wall with one arm out.
function pose(r, up = false, dx = 0) { const W = 26, H = 20, d = R(H, () => R(W, () => 1)), lab = R(H, () => R(W, () => 0)), blob = (cx, cy, rx, ry, v, l) => { cx += dx; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1) { d[y][x] = v + r.n(0, 0.01); lab[y][x] = l ? 1 : 0; } }; blob(11, 13, 3, 5.5, 0.3); blob(11, 5.6, 2, 2, 0.3); if (up) { for (let i = 0; i < 6; i++) blob(15, 9.5 - i, 1.1, 1.1, 0.3); blob(15, 2.4, 1.8, 1.8, 0.3, 1); } else { for (let i = 0; i < 7; i++) blob(14 + i, 10 - i * 0.2, 1.1, 1.1, 0.3); blob(21.5, 8.4, 1.8, 1.8, 0.3, 1); } return { d, lab, W, H }; }
const at = (P, x, y) => (x < 0 || y < 0 || x >= P.W || y >= P.H ? 1 : P.d[y][x]);
// what each tree may ask about a pixel: is the spot a few steps off in this direction far behind me, yes or no?
const BANK = [[4, 0], [-4, 0], [0, 4], [0, -4], [3, 3], [-3, 3], [3, -3], [-3, -3], [2, 0], [-2, 0], [0, 2], [0, -2]];
const feats = (P, x, y) => BANK.map((o) => (at(P, x + o[0], y + o[1]) - at(P, x, y) > 0.4 ? 1 : 0));
const body = (P) => { const out = []; for (let y = 0; y < P.H; y++) for (let x = 0; x < P.W; x++) if (P.d[y][x] < 0.9) out.push([x, y]); return out; };
function f1(P, vote) { let tp = 0, fp = 0, fn = 0; for (const [x, y] of body(P)) { const v = vote(x, y), l = P.lab[y][x]; if (v && l) tp++; else if (v) fp++; else if (l) fn++; } return tp ? (2 * tp) / (2 * tp + fp + fn) : 0; }
function bestProbe(P) { let best = [0, [4, 0]]; for (let ox = -6; ox <= 6; ox++) for (let oy = -6; oy <= 6; oy++) { const v = f1(P, (x, y) => at(P, x + ox, y + oy) - at(P, x, y) > 0.4); if (v > best[0]) best = [v, [ox, oy]]; } return best; }
const grown = new Map();
function woods(s, ctx) { const key = s.sig + ':' + s.n + ':' + (s.both ? 1 : 0); if (!grown.has(key)) { if (grown.size > 40) grown.clear(); const X = [], y = []; for (const P of s.train) for (const [px, py] of body(P)) { X.push(feats(P, px, py)); y.push(P.lab[py][px]); } const r = ctx.rng('wood' + s.both); grown.set(key, R(s.n, () => { const idx = X.map(() => r.int(0, X.length - 1)); return growTree(idx.map((i) => X[i]), idx.map((i) => y[i]), { maxDepth: 6, minLeaf: 1 }); })); } return grown.get(key); }
export const II8 = {
  id: 'II-8', name: 'Find the hand', short: 'Decision forests', formula: 'for each pixel: depth at a nearby probe − depth here\na tree asks a few such questions in a row\nmany trees, each a little different, vote',
  limit: 'A forest of simple questions is fast and steady. It still knows only the poses it was shown.',
  rounds: { play: { brief: 'A depth camera sees a figure: dark is near, pale is far. Drag the probe. A pixel is called “hand” when the probe, that many steps away, sees the far wall. Mark as much of the hand as you can.' }, twist: { brief: 'One question only goes so far. Grow a forest: each tree asks a few questions in a row, and the trees vote. Add trees until the hand is found.' }, case: { brief: 'The forest learned from an arm held out sideways. This figure has raised its arm. Add raised arms to its examples and grow it again.' } },
  hints: { play: ['Beyond the hand there is only wall.', 'Try the probe straight up, then out to the right, and compare.'], twist: ['Press “Add a tree” several times.', 'Five trees.'], case: ['It has never seen a raised arm.', 'Tick the box, then add five trees.'] },
  teach: ['Ask a very simple question about each pixel.', 'Let many trees of simple questions vote.', 'Train on every pose you expect to meet.'],
  init(round, ctx) { const r = ctx.rng(round), P = pose(r), sig = r.int(0, 1e9); if (round === 'play') return { round, P, o: [-4, 1], goal: bestProbe(P)[0] * 0.9 }; if (round === 'twist') return { round, sig, P: pose(r, false, 2), train: [P], n: 0, goal: 0.9, need: 5 }; return { round, sig, P: pose(r, true), train: [P], n: 0, both: false, goal: 0.9, need: 5 }; },
  vote(s, ctx) { if (s.round === 'play') return (x, y) => at(s.P, x + s.o[0], y + s.o[1]) - at(s.P, x, y) > 0.4; const F = woods(s, ctx); return (x, y) => { const f = feats(s.P, x, y); return F.length > 0 && F.filter((t) => predictTree(t, f) === 1).length * 2 > F.length; }; },
  draw(b, s, ctx) {
    b.clear(); const P = s.P, vote = II8.vote(s, ctx); b.view(0, P.W, 0, P.H, true);
    for (let y = 0; y < P.H; y++) for (let x = 0; x < P.W; x++) { const v = P.d[y][x], c = Math.round(60 + v * 180); b.rect(x, P.H - 1 - y, 1, 1, { fill: `rgb(${c},${c + 4},${c + 12})` }); if (v < 0.9 && vote(x, y)) b.rect(x + 0.15, P.H - 1 - y + 0.15, 0.7, 0.7, { fill: P.lab[y][x] ? DATA[2] : DATA[3], alpha: 0.85 }); else if (P.lab[y][x]) b.rect(x + 0.3, P.H - 1 - y + 0.3, 0.4, 0.4, { color: DATA[1], width: 1.5 }); }
    if (s.round === 'play') { const cx = 11.5, cy = P.H - 12.5; b.dot(cx, cy, { color: '#fff', stroke: INK, r: 5, label: 'a pixel' }); b.line(cx, cy, cx + s.o[0], cy - s.o[1], { color: DATA[1], width: 2 }); b.handle('o', cx + s.o[0], cy - s.o[1], { color: DATA[1], label: 'probe: far?' }); }
    const A = area(b); legend(b, [['hand, found', DATA[2], 'square'], ['called hand, is not', DATA[3], 'square'], ['hand, missed', DATA[1], 'ring']], A.x + 10 * A.u, A.y + A.h - 2 * A.u);
  },
  drag(s, id, x, y) { if (id === 'o') { const cx = 11.5, cy = s.P.H - 12.5; s.o = [clamp(Math.round(x - cx), -6, 6), clamp(Math.round(cy - y), -6, 6)]; } },
  controls(s, ctx) { if (s.round === 'play') return []; const c = [{ type: 'button', go: true, label: 'Add a tree', disabled: s.n >= 15, run: () => { s.n++; } }, { type: 'button', label: 'Cut the forest down', run: () => { s.n = 0; } }, { type: 'note', text: `trees: ${s.n}` }]; if (s.round === 'case') c.unshift({ type: 'toggle', label: 'Add raised arms to the examples', value: s.both, set: (v) => { s.both = v; s.train = v ? [s.train[0], pose(ctx.rng('m'), true, 1)] : [s.train[0]]; } }); return c; },
  meter(s, ctx) { const v = f1(s.P, II8.vote(s, ctx)), m = meterTo('Hand pixels marked correctly (F1)', v, s.goal, { from: 0, fmt: (q) => q.toFixed(2), note: s.round === 'case' ? (s.both ? 'trained on arms held sideways and arms raised' : 'trained on arms held sideways only') : s.round === 'twist' ? `trees voting: ${s.n}` : 'One question marks every edge that faces the wall, not only the hand.' }); if (s.need) { m.goal += `, with ${s.need} trees or more`; m.met = m.met && s.n >= s.need; } return m; },
  demo(s, ctx) { if (s.round === 'play') { s.o = bestProbe(s.P)[1]; return; } if (s.round === 'case') { s.both = true; s.train = [s.train[0], pose(ctx.rng('m'), true, 1)]; } s.n = 7; },
};

export const PART2A = [II1, II2, II3, II4, II5, II6, II7, II8];
