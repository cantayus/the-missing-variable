// Part I, fall: what the data say. Instruments I-1 to I-9.
import { DATA, INK, INK2, GREY, PALE, GOOD, WARM, nice, pct, clamp, sum, mean, R, nearest, gen, walk, walkNames, withSample, meterTo, meterCount, meterBand, area, card, bars, title, legend, note, spark, wrap } from './lib.js';
import { correlation, spearman, kendall, median, quantile, linreg } from '../algo/stats.js';
import { rule, support, apriori, tidlists, intersect, mapReduce } from '../algo/patterns.js';

const TYPES = ['Nominal', 'Ordinal', 'Interval', 'Ratio'], TYPE_SAY = ['names only', 'an order, no distances', 'distances, no true zero', 'a true zero: “twice as much” means something'];
const COLS = [['reader id', 'R-4471', 0], ['branch', 'Mill Lane', 0], ['condition grade', 'A to F', 1], ['star rating', '★★★☆☆', 1], ['year printed', '1962', 2], ['vault temperature', '17 °C', 2], ['pages', '312', 3], ['days on loan', '21', 3]];

export const I1 = {
  id: 'I-1', name: 'Sort the columns', short: 'By type', formula: 'nominal: =, ≠\nordinal: <, >\ninterval: +, −\nratio: ×, ÷',
  limit: 'Knowing a column’s type tells you which sums make sense. Whether it was measured well, or what was never written down at all, you have to find out some other way.',
  rounds: { play: { brief: 'Pick a column, then pick the kind of data it holds. Names, an order, a scale, or a count with a true zero?' }, twist: { brief: 'Some loans have no return date. Drag the fill line to guess the gaps. Mean and median both miss. Why?' }, case: { brief: 'Here is the Common Shelf loan log. Sort every column you can.' } },
  hints: { play: ['Ask: can you say “twice as much”?', 'Grades and stars have an order but no fixed step.'], twist: ['Which loans tend to have no return date yet?', 'The gaps are the long loans. Drag the line above every bar.'], case: ['Four columns have names.', 'The fifth has nothing to go on. Put it under “Cannot tell”.'] },
  teach: ['Look at what the values are: names, ranks or amounts.', 'Ask which sums make sense for them.', 'Only then pick a chart or an average.'],
  init(round, ctx) {
    const r = ctx.rng(round);
    if (round === 'twist') { const full = R(14, () => Math.round(Math.exp(r.n(2.6, 0.7)))).sort((a, b) => a - b), miss = full.map((v, i) => i >= 10); return { round, full, miss, fill: mean(full.filter((_, i) => !miss[i])), tried: 0 }; }
    const cols = round === 'case' ? [['reader', 'R-4471', 0], ['title', 'The Salt Road', 0], ['date', 'year 6, month 3', 2], ['branch', 'Weir Street', 0], ['', '', 4]] : r.shuffle(COLS.slice()).slice(0, 6);
    return { round, cols, placed: cols.map(() => -1), sel: -1, wrong: '' };
  },
  draw(b, s) {
    b.clear(); const A = area(b), u = A.u;
    if (s.round === 'twist') {
      b.view(-0.5, 13.5, 0, Math.max(...s.full) * 1.25); b.axes({ x: 'loans, shortest to longest', y: 'days on loan', xt: 7, xfmt: () => '' });
      s.full.forEach((v, i) => { if (s.miss[i]) { b.rect(i - 0.35, 0, 0.7, s.fill, { fill: DATA[1], alpha: 0.55 }); b.rect(i - 0.35, 0, 0.7, v, { color: INK2, dash: [3, 3] }); } else b.rect(i - 0.35, 0, 0.7, v, { fill: DATA[0] }); });
      b.line(-0.5, s.fill, 13.5, s.fill, { color: WARM, width: 2, dash: [6, 4] }); b.handle('fill', 13, s.fill, { color: WARM, label: 'fill ' + nice(s.fill) });
      legend(b, [['returned', DATA[0], 'square'], ['your fill', DATA[1], 'square']], A.x + 60 * u, A.y + 8 * u); return;
    }
    const n = s.cols.length, bins = s.round === 'case' ? 5 : 4, cw = Math.min(150 * u, (A.w - (n - 1) * 8 * u) / n), bw = (A.w - (bins - 1) * 10 * u) / bins, by = A.y + A.h * 0.42, bh = A.h * 0.56;
    title(b, s.round === 'case' ? 'loan_log' : 'Columns to sort');
    for (let k = 0; k < bins; k++) { const x = A.x + k * (bw + 10 * u); b.box(x, by, bw, bh, { fill: '#f6f8fa', color: INK2, dash: k === 4 ? [4, 4] : null }); b.label(k === 4 ? 'Cannot tell' : TYPES[k], x + 8 * u, by + 14 * u, { bold: true }); if (k < 4) wrap(b, TYPE_SAY[k], x + 8 * u, by + 32 * u, bw - 16 * u, { size: 10, color: INK2 }); b.zone('bin' + k, x, by, bw, bh); }
    const slot = new Array(bins).fill(0);
    s.cols.forEach((c, i) => { const p = s.placed[i]; let x, y; if (p < 0) { x = A.x + i * (cw + 8 * u); y = A.y + 40 * u; } else { x = A.x + p * (bw + 10 * u) + 8 * u; y = by + 62 * u + slot[p]++ * 44 * u; } const ok = p === c[2]; card(b, 'col' + i, x, y, p < 0 ? cw : bw - 16 * u, 38 * u, (c[0] || '(no header)') + '\n' + (c[1] || '—'), { sel: s.sel === i, mono: true, size: 10.5, fill: p < 0 ? '#fff' : ok ? '#e3efe9' : '#fbe9e2', mark: p < 0 ? null : ok ? GOOD : WARM }); });
    if (s.wrong) note(b, s.wrong, A.x, A.y + A.h * 0.36, { color: WARM });
  },
  click(s, x, y, id) {
    if (!id || s.round === 'twist') return;
    if (id.startsWith('col')) { s.sel = +id.slice(3); s.wrong = ''; }
    else if (id.startsWith('bin') && s.sel >= 0) { const k = +id.slice(3), c = s.cols[s.sel]; s.placed[s.sel] = k; s.wrong = k === c[2] ? '' : k === 4 ? 'That one has a name. Look again.' : c[2] === 4 ? 'With no header and no values there is nothing to go on.' : `Not quite: “${c[0]}” holds ${TYPE_SAY[c[2]]}.`; s.sel = -1; }
  },
  drag(s, id, x, y) { if (id === 'fill') { s.fill = clamp(y, 0, Math.max(...s.full) * 1.2); s.tried++; } },
  meter(s, ctx) {
    if (s.round === 'twist') { const truth = mean(s.full), est = mean(s.full.map((v, i) => (s.miss[i] ? s.fill : v))), err = Math.abs(est - truth) / truth; return meterTo('Average, off by', err, 0.05, { lower: true, fmt: (v) => pct(v), from: 0.5, note: `true average ${nice(truth)} days; yours ${nice(est)}` }); }
    return meterCount('Columns sorted', s.cols.filter((c, i) => s.placed[i] === c[2]).length, s.cols.length);
  },
  clean(s) { return s.round === 'twist' ? true : !s.wrong; },
  controls(s, ctx) { if (s.round !== 'twist') return []; const obs = s.full.filter((_, i) => !s.miss[i]); return [{ type: 'button', label: 'Fill with the mean', run: () => { s.fill = mean(obs); } }, { type: 'button', label: 'Fill with the median', run: () => { s.fill = median(obs); } }, { type: 'button', label: 'Fill with the nearest loan', run: () => { s.fill = obs[obs.length - 1]; } }]; },
  demo(s) { if (s.round === 'twist') s.fill = mean(s.full.filter((_, i) => s.miss[i])); else { s.placed = s.cols.map((c) => c[2]); s.wrong = ''; } },
};

const ANS = { x: [10, 8, 13, 9, 11, 14, 6, 4, 12, 7, 5], y: [[8.04, 6.95, 7.58, 8.81, 8.33, 9.96, 7.24, 4.26, 10.84, 4.82, 5.68], [9.14, 8.14, 8.74, 8.77, 9.26, 8.1, 6.13, 3.1, 9.13, 7.26, 4.74], [7.46, 6.77, 12.74, 7.11, 7.81, 8.84, 6.08, 5.39, 8.15, 6.42, 5.73]] };
const coef = (ctx) => (ctx.variant === 'spearman' ? spearman : ctx.variant === 'kendall' ? kendall : correlation);
export const I2 = {
  id: 'I-2', name: 'Same numbers, four pictures', short: 'Pearson r', formula: 'r = cov(x, y) / (sd(x) · sd(y))',
  limit: 'Correlation only measures how close the points are to a straight line. A perfect curve can score zero, and no value of it tells you why the two things move together.',
  rounds: { play: { brief: 'These sets share a mean, a spread and a correlation. On the third, drag the stray point until r reaches 0.99.' }, twist: { brief: 'Inside each group, more study goes with higher marks. Drag the orange group until the pooled correlation turns negative.' }, case: { brief: 'Loans per month, and how unevenly they fall across titles. Drag each line to fit its series.' } },
  hints: { play: ['One point is not on the line.', 'Drag the highest point down to the others.'], twist: ['Pooled r looks at all the points at once.', 'Move orange down and to the right of blue.'], case: ['One series is flat. One is not.', 'Drag the right-hand end of each line onto its dots.'] },
  teach: ['Plot the points before you trust a summary.', 'Read the correlation as “how close to one straight line”.', 'Check groups and stray points before saying anything.'],
  variants: [{ id: 'spearman', name: 'Spearman ranks' }, { id: 'kendall', name: 'Kendall tau' }],
  init(round, ctx) {
    const r = ctx.rng(round);
    if (round === 'play') return { round, set: 2, pts: ANS.x.map((x, i) => [x, ANS.y[2][i]]) };
    if (round === 'twist') { const a = R(12, () => { const x = r.range(1, 4); return [x, 6 + 0.9 * x + r.n(0, 0.35)]; }), bb = R(12, () => { const x = r.range(1, 4); return [x, 0.9 * x + r.n(0, 0.35)]; }); return { round, a, bb, off: [4.5, 5.5] }; }
    const C = ctx.caseData, lo = C.m.loans.map((v) => v / C.m.loans[0]), gi = R(72, (i) => C.y.gini[Math.floor(i / 12)]).map((v, i, a) => v / a[0]);
    return { round, lo, gi, e1: 1.6, e2: 0.6 };
  },
  draw(b, s, ctx) {
    b.clear();
    if (s.round === 'play') { b.view(2, 16, 2, 14); b.axes({ x: 'x', y: 'y' }); const f = linreg(s.pts.map((p) => p[0]), s.pts.map((p) => p[1])); b.fn((x) => f.a + f.b * x, { color: GREY, dash: [5, 4] }); s.pts.forEach((p, i) => b.handle('p' + i, p[0], p[1], { r: 6, color: DATA[0] })); const A = area(b), u = A.u; for (let k = 0; k < 3; k++) { const px = A.x + A.w - (3 - k) * 92 * u, py = A.y + 6 * u; b.box(px, py, 84 * u, 60 * u, { fill: '#fff', color: k === 2 ? DATA[1] : PALE, width: k === 2 ? 2 : 1 }); ANS.x.forEach((x, i) => b.mark(px + ((x - 3) / 12) * 80 * u, py + 58 * u - ((ANS.y[k][i] - 2) / 11) * 54 * u, 2 * u, 'circle', INK2)); b.label(['I', 'II', 'III'][k], px + 5 * u, py + 9 * u, { size: 9.5, bold: true }); } return; }
    if (s.round === 'twist') { b.view(0, 10, 0, 12); b.axes({ x: 'hours of study', y: 'mark' }); const o = s.bb.map((p) => [p[0] + s.off[0], p[1] + s.off[1]]); s.a.forEach((p) => b.dot(p[0], p[1], { color: DATA[0] })); o.forEach((p) => b.dot(p[0], p[1], { color: DATA[1], shape: 'square' })); const all = [...s.a, ...o], f = linreg(all.map((p) => p[0]), all.map((p) => p[1])); b.fn((x) => f.a + f.b * x, { color: INK, width: 2 }); b.handle('grp', mean(o.map((p) => p[0])), mean(o.map((p) => p[1])), { color: DATA[1], shape: 'square', label: 'drag the group' }); return; }
    b.view(0, 71, 0, 2.6); b.axes({ x: 'month', y: 'first month = 1', xt: 6 }); s.lo.forEach((v, i) => b.dot(i, v, { r: 2.5, color: DATA[0] })); s.gi.forEach((v, i) => b.dot(i, v, { r: 2.5, color: DATA[3], shape: 'square' })); b.line(0, 1, 71, s.e1, { color: DATA[0], width: 2 }); b.line(0, 1, 71, s.e2, { color: DATA[3], width: 2 }); b.handle('e1', 71, s.e1, { color: DATA[0], label: 'loans' }); b.handle('e2', 71, s.e2, { color: DATA[3], shape: 'square', label: 'unevenness' });
  },
  drag(s, id, x, y) { if (id?.[0] === 'p') { const p = s.pts[+id.slice(1)]; p[0] = clamp(x, 2.5, 15.5); p[1] = clamp(y, 2.5, 13.5); } else if (id === 'grp') { const cx = mean(s.bb.map((p) => p[0])), cy = mean(s.bb.map((p) => p[1])); s.off = [clamp(x - cx, -1, 6), clamp(y - cy, -1, 9)]; } else if (id === 'e1') s.e1 = clamp(y, 0.1, 2.5); else if (id === 'e2') s.e2 = clamp(y, 0.1, 2.5); },
  meter(s, ctx) {
    const c = coef(ctx);
    if (s.round === 'play') return meterTo('Correlation r', c(s.pts.map((p) => p[0]), s.pts.map((p) => p[1])), 0.99, { from: 0.8, fmt: (v) => v.toFixed(3) });
    if (s.round === 'twist') { const o = s.bb.map((p) => [p[0] + s.off[0], p[1] + s.off[1]]), all = [...s.a, ...o]; return meterTo('Pooled correlation', c(all.map((p) => p[0]), all.map((p) => p[1])), -0.3, { lower: true, from: 0.9, fmt: (v) => v.toFixed(2), note: `inside blue ${c(s.a.map((p) => p[0]), s.a.map((p) => p[1])).toFixed(2)}, inside orange ${c(s.bb.map((p) => p[0]), s.bb.map((p) => p[1])).toFixed(2)}` }); }
    const err = Math.abs(s.e1 - s.lo[71]) + Math.abs(s.e2 - s.gi[71]); return meterTo('Lines off by', err, 0.12, { lower: true, from: 1.5, fmt: (v) => v.toFixed(2), note: `loans ×${s.lo[71].toFixed(2)}, unevenness ×${s.gi[71].toFixed(2)}` });
  },
  demo(s) { if (s.round === 'play') s.pts[2][1] = 8.49; else if (s.round === 'twist') s.off = [5.5, 0.4]; else { s.e1 = s.lo[71]; s.e2 = s.gi[71]; } },
};

const JUNK = ['shadows', 'heavy grid', 'frame', 'backdrop', 'stripes', 'second legend'];
export const I3 = {
  id: 'I-3', name: 'Erase until it says something', short: 'Data-ink', formula: 'data-ink ratio = ink that shows data / all ink\nlie factor = change shown / change in the data',
  limit: 'However clean the chart, it only shows what is in the table. If the table measured the wrong thing, a good chart shows the wrong thing clearly.',
  rounds: { play: { brief: 'This chart is mostly decoration. Tap anything that is not data to erase it. Leave the bars.' }, twist: { brief: 'The axis starts high, so a small rise looks huge. Drag the baseline until the picture and the numbers agree.' }, case: { brief: 'The board’s yearly chart of accuracy. Mend its axis. Then look at what sits beside it.' } },
  hints: { play: ['Would the numbers change if it vanished?', 'Tap the shadows, grid, frame, backdrop, stripes and extra legend.'], twist: ['Where should a bar chart start?', 'Drag the baseline down to zero.'], case: ['Same fault as before.', 'Drag the baseline to zero.'] },
  teach: ['Erase ink that carries no number.', 'Start bars at zero so sizes can be compared.', 'Check that the picture changes as much as the data do.'],
  init(round, ctx) { const r = ctx.rng(round); if (round === 'play') return { round, vals: R(5, () => r.int(18, 60)), junk: JUNK.map(() => true), oops: 0 }; if (round === 'twist') { const a = r.int(60, 70); return { round, vals: [a, a + 1, a + 2, a + 4, a + 5], base: a - 3, max: a + 8, lab: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], unit: 'visitors' }; } const h = ctx.caseData.y.hit.map((v) => v * 100); return { round, vals: h, base: 25, max: 80, lab: h.map((_, i) => 'yr ' + (i + 1)), unit: 'hit rate %', distinct: ctx.caseData.y.distinct }; },
  draw(b, s, ctx) {
    b.clear(); const A = area(b), u = A.u, px = A.x + 50 * u, py = A.y + 40 * u, w = A.w - 80 * u, h = A.h - 100 * u;
    if (s.round === 'play') {
      if (s.junk[3]) { const g = b.g, gr = g.createLinearGradient(0, py, 0, py + h); gr.addColorStop(0, '#cfd8ea'); gr.addColorStop(1, '#f3e7c9'); g.fillStyle = gr; g.fillRect(px - 30 * u, py - 20 * u, w + 60 * u, h + 50 * u); }
      if (s.junk[1]) for (let i = 0; i <= 12; i++) b.box(px, py + (h * i) / 12, w, 2 * u, { fill: INK2, alpha: 0.5 });
      if (s.junk[2]) b.box(px - 30 * u, py - 20 * u, w + 60 * u, h + 50 * u, { color: INK, width: 5 });
      const bw = w / 5; s.vals.forEach((v, i) => { const bh = (v / 70) * h, x = px + i * bw + bw * 0.2; if (s.junk[0]) b.box(x + 9 * u, py + h - bh + 9 * u, bw * 0.6, bh - 9 * u, { fill: '#000', alpha: 0.28 }); b.box(x, py + h - bh, bw * 0.6, bh, { fill: DATA[0] }); if (s.junk[4]) for (let k = 0; k < bh; k += 9 * u) b.box(x, py + h - bh + k, bw * 0.6, 3 * u, { fill: '#fff', alpha: 0.5 }); b.label(String(v), x + bw * 0.3, py + h - bh - 9 * u, { align: 'center', mono: true, size: 10.5 }); b.label(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][i], x + bw * 0.3, py + h + 12 * u, { align: 'center', size: 10.5 }); b.zone('bar' + i, x, py + h - bh, bw * 0.6, bh); });
      if (s.junk[5]) { b.box(px + w - 110 * u, py - 8 * u, 120 * u, 44 * u, { fill: '#fff', color: INK }); b.box(px + w - 102 * u, py + 6 * u, 16 * u, 16 * u, { fill: DATA[0] }); b.label('Visitors', px + w - 80 * u, py + 14 * u, { size: 11 }); }
      const zs = [[px, py + h * 0.2, w, h * 0.12], [px, py + h * 0.02, w, h * 0.1], [px - 30 * u, py - 20 * u, 22 * u, h + 50 * u], [px - 30 * u, py + h + 14 * u, w + 60 * u, 16 * u], [px, py + h * 0.5, 0, 0], [px + w - 110 * u, py - 8 * u, 120 * u, 44 * u]];
      JUNK.forEach((nm, i) => { if (s.junk[i]) card(b, 'junk' + i, A.x + i * (A.w / 6), A.y + A.h - 26 * u, A.w / 6 - 6 * u, 24 * u, 'erase ' + nm, { size: 10 }); });
      if (s.oops) note(b, 'Those bars are the data. Leave them.', px, py - 30 * u, { color: WARM }); return;
    }
    b.view(-0.6, s.vals.length - 0.4, s.base, s.max); b.pad = { l: 56, r: s.round === 'case' ? 220 : 24, t: 28, b: 40 }; b.axes({ y: s.unit, xt: 0, grid: false, xfmt: () => '' });
    s.vals.forEach((v, i) => { b.rect(i - 0.3, s.base, 0.6, Math.max(0, v - s.base), { fill: DATA[0] }); b.text(s.lab[i], i, s.base, { dy: 12 * u, size: 10.5 }); b.text(nice(v), i, v, { dy: -9 * u, size: 10, mono: true }); });
    b.handle('base', -0.45, s.base, { color: WARM, shape: 'diamond', label: 'axis starts at ' + nice(s.base) });
    if (s.round === 'case') { const X = b.w - 200 * u; b.label('Different titles borrowed per month', X, A.y + 22 * u, { size: 10.5, bold: true }); bars(b, s.distinct, X, A.y + 40 * u, 180 * u, A.h * 0.5, { color: DATA[3], labels: s.lab.map((l) => l.slice(3)), values: s.distinct.map((v) => nice(v)), max: Math.max(...s.distinct) * 1.1 }); b.label('drawn from zero', X, A.y + A.h * 0.5 + 70 * u, { size: 10, color: INK2 }); }
    b.pad = { l: 46, r: 18, t: 18, b: 38 };
  },
  click(s, x, y, id) { if (s.round !== 'play' || !id) return; if (id.startsWith('junk')) { s.junk[+id.slice(4)] = false; s.oops = 0; } else if (id.startsWith('bar')) s.oops = 1; },
  drag(s, id, x, y) { if (id === 'base') s.base = clamp(Math.round(y), 0, Math.min(...s.vals) - 1); },
  meter(s) { if (s.round === 'play') { const left = s.junk.filter(Boolean).length, ratio = 1 / (1 + left * 0.9); return meterTo('Data-ink ratio', ratio, 0.99, { from: 0.15, fmt: (v) => v.toFixed(2) }); } const a = s.vals[0], lf = a / (a - s.base); return meterTo('Lie factor', lf, 1.05, { lower: true, from: 6, fmt: (v) => v.toFixed(2), note: 'A lie factor of 1 means the picture is honest.' }); },
  clean(s) { return !s.oops; },
  demo(s) { if (s.round === 'play') s.junk = s.junk.map(() => false); else s.base = 0; },
};

export const I4 = {
  id: 'I-4', name: 'Balance and middle', short: 'Mean and median', formula: 'mean = sum / n\nmedian = the middle value\nIQR = Q3 − Q1',
  limit: 'A middle value hides the shape. Two very different piles of loans can balance at the same point.',
  rounds: { play: { brief: 'Each dot is a reader, placed by how many books they borrowed. Drag the wedge to where the beam balances.' }, twist: { brief: 'One reader borrows far more than anyone. Drag that dot to the right. Watch the mean chase it while the median stays put.' }, case: { brief: 'Sixty titles from the catalogue, by loans last year. Drag the three markers to build the box: quarter, middle, three-quarters.' } },
  hints: { play: ['The beam tips toward the heavier side.', 'The balance point is the mean.'], twist: ['Only one dot needs to move.', 'Drag the orange dot to the far right.'], case: ['Half the dots lie on each side of the middle marker.', 'Count fifteen dots in from each end for the outer markers.'] },
  teach: ['The mean is where the beam balances.', 'The median is the middle dot, however far the ends reach.', 'When they disagree, the data are lopsided.'],
  init(round, ctx) { const r = ctx.rng(round); if (round === 'case') { const v = ctx.caseData.titles.sampleLast.map((x) => Math.min(x, 60)); return { round, v, q: [20, 30, 40], max: 60 }; } const v = withSample(R(15, () => Math.round(clamp(r.n(12, 5), 1, 28))), ctx).map((x) => clamp(Math.round(x), 0, 30)); return round === 'play' ? { round, v, f: 4, max: 32 } : { round, v: [...v.slice(0, 14), 20], f: 0, max: 100, m0: 0, med0: 0 }; },
  draw(b, s) {
    b.clear(); b.view(0, s.max, -1.2, 6); const u = b.u, stack = {}; b.axes({ x: s.round === 'case' ? 'loans last year (60 means 60 or more)' : 'books borrowed', yt: 0, grid: false, yfmt: () => '' });
    const m = mean(s.v), md = median(s.v);
    s.v.forEach((x, i) => { const k = Math.round(x), h = (stack[k] = (stack[k] || 0) + 1); if (s.round === 'twist' && i === 14) b.handle('big', x, 0.35, { color: DATA[1], r: 8, label: 'this reader' }); else b.dot(x, h * 0.36, { r: 5, color: DATA[0] }); });
    if (s.round === 'play') { const tilt = clamp((m - s.f) * 0.05, -0.4, 0.4); b.line(0, -0.1 - tilt * (s.f / 8), s.max, -0.1 + tilt * ((s.max - s.f) / 8), { color: INK, width: 4 }); b.handle('f', s.f, -0.5, { shape: 'tri', color: WARM, label: 'wedge' }); }
    if (s.round === 'twist') { b.line(m, -0.2, m, 5, { color: WARM, width: 2 }); b.text('mean ' + nice(m), m, 5.3, { color: WARM, bold: true }); b.line(md, -0.2, md, 4.2, { color: GOOD, width: 2, dash: [5, 4] }); b.text('median ' + nice(md), md, 4.5, { color: GOOD, bold: true }); }
    if (s.round === 'case') { const [a, c, d] = s.q; b.rect(a, 4.2, d - a, 1, { color: INK, fill: '#eef2f6' }); b.line(c, 4.2, c, 5.2, { color: INK, width: 3 }); b.line(Math.min(...s.v), 4.7, a, 4.7, { color: INK }); b.line(d, 4.7, s.max, 4.7, { color: INK }); ['Q1', 'median', 'Q3'].forEach((nm, i) => b.handle('q' + i, s.q[i], 4.7, { shape: 'diamond', color: WARM, label: nm + ' ' + nice(s.q[i]) })); }
  },
  down(s, id) { if (s.round === 'twist' && id === 'big' && !s.m0) { s.m0 = mean(s.v); s.med0 = median(s.v); } },
  drag(s, id, x) { if (id === 'f') s.f = clamp(x, 0, s.max); else if (id === 'big') s.v[14] = clamp(Math.round(x), 0, s.max); else if (id?.[0] === 'q') { const i = +id[1]; s.q[i] = clamp(Math.round(x * 2) / 2, i ? s.q[i - 1] : 0, i < 2 ? s.q[i + 1] : s.max); } },
  meter(s) {
    if (s.round === 'play') return meterTo('Out of balance by', Math.abs(s.f - mean(s.v)), 0.25, { lower: true, from: 10, fmt: (v) => v.toFixed(2) });
    if (s.round === 'twist') { const m0 = s.m0 || mean(s.v), med0 = s.med0 || median(s.v), dm = (mean(s.v) - m0) / m0, dmed = Math.abs(median(s.v) - med0); return { label: 'Mean moved', text: pct(dm) + '   median moved ' + nice(dmed), frac: clamp(dm / 0.4, 0, 1), met: dm >= 0.4 && dmed <= 0.5 }; }
    const t = [0.25, 0.5, 0.75].map((q) => quantile(s.v, q)), err = sum(s.q.map((q, i) => Math.abs(q - t[i]))); return meterTo('Markers off by', err, 1.5, { lower: true, from: 40, fmt: (v) => v.toFixed(1), note: 'A box holds the middle half of the dots.' });
  },
  demo(s) { if (s.round === 'play') s.f = mean(s.v); else if (s.round === 'twist') { s.m0 = mean(s.v); s.med0 = median(s.v); s.v[14] = 100; } else s.q = [0.25, 0.5, 0.75].map((q) => quantile(s.v, q)); },
};

export const I5 = {
  id: 'I-5', name: 'Count a billion rows', short: 'Map and reduce', formula: 'map: row → (key, 1)\nshuffle: group by key\nreduce: (key, [1, 1, …]) → (key, count)',
  limit: 'Splitting the work makes the counting fast. Somebody still had to decide which rows to keep, and that was settled before any counting began.',
  rounds: { play: { brief: 'Eight crates of loan slips, four workers. Tap a crate, then a worker. Share the crates so the count finishes soonest.' }, twist: { brief: 'One worker is slow today. Run once to find out who, then move crates away from them.' }, case: { brief: 'Loans are small. A record of every screen is huge. The store room holds only so much. Drag the line to how many days of screens you can keep.' } },
  hints: { play: ['The job ends when the last worker ends.', 'Two crates each.'], twist: ['Look at whose bar is longest after a run.', 'Give the slow worker no crates and spread theirs around.'], case: ['Each day of screens fills the same space.', 'Slide down until the bar fits under the roof.'] },
  teach: ['Split the pile and give each worker a part.', 'Each worker counts their own part by key.', 'Add the small counts together.'],
  init(round, ctx) { const r = ctx.rng(round); if (round === 'case') return { round, days: 365, cap: 30 * 1.0 + 6 }; const keys = ['Stacks', 'Mill Lane', 'Junction', 'Weir St'], crates = R(8, () => R(40, () => r.pick(keys))); return { round, keys, crates, at: R(8, () => 0), sel: -1, speed: round === 'twist' ? r.shuffle([1, 1, 1, 4]) : [1, 1, 1, 1], ran: false, counts: null }; },
  draw(b, s, ctx) {
    b.clear(); const A = area(b), u = A.u;
    if (s.round === 'case') { b.view(0, 4, 0, 400); b.axes({ y: 'days of screen records kept', xt: 0, xfmt: () => '', grid: false }); b.rect(0.5, 0, 1, 6, { fill: DATA[0] }); b.text('loans, six years', 1, 6, { dy: -12 * u, size: 11 }); b.rect(2.2, 0, 1, s.days, { fill: s.days <= s.cap ? DATA[2] : DATA[3], alpha: 0.8 }); b.text('screens', 2.7, s.days, { dy: -12 * u, size: 11 }); b.line(0, s.cap, 4, s.cap, { color: INK, width: 2, dash: [8, 5] }); b.text('store room is full here', 3.3, s.cap, { dy: -10 * u, size: 10.5, color: INK2 }); b.handle('days', 2.7, s.days, { color: WARM, label: s.days + ' days' }); return; }
    title(b, 'Crates of loan slips', s.ran ? 'counted by branch: ' + s.keys.map((k) => k + ' ' + (s.counts[k] || 0)).join('   ') : 'Tap a crate, then a worker.');
    const cw = A.w / 8; s.crates.forEach((c, i) => { if (s.at[i] === -1) card(b, 'c' + i, A.x + i * cw + 4 * u, A.y + 56 * u, cw - 8 * u, 40 * u, 'crate ' + (i + 1), { sel: s.sel === i, size: 10.5 }); });
    const ww = A.w / 4, load = [0, 0, 0, 0]; s.at.forEach((w) => { if (w >= 0) load[w]++; });
    for (let w = 0; w < 4; w++) { const x = A.x + w * ww + 6 * u, y = A.y + 120 * u, h = A.h - 190 * u; b.box(x, y, ww - 12 * u, h, { fill: '#f6f8fa', color: INK2 }); b.label('worker ' + (w + 1) + (s.ran && s.speed[w] > 1 ? '  (slow)' : ''), x + 8 * u, y + 14 * u, { bold: true, color: s.ran && s.speed[w] > 1 ? WARM : INK }); b.zone('w' + w, x, y, ww - 12 * u, h); let k = 0; s.at.forEach((a, i) => { if (a === w) card(b, 'c' + i, x + 8 * u, y + 30 * u + k++ * 30 * u, ww - 28 * u, 26 * u, 'crate ' + (i + 1), { sel: s.sel === i, size: 10 }); }); const t = load[w] * s.speed[w]; if (s.ran) { b.box(x, A.y + A.h - 56 * u, ((ww - 12 * u) * t) / 8, 14 * u, { fill: s.speed[w] > 1 ? WARM : DATA[0] }); b.label(t + ' min', x, A.y + A.h - 30 * u, { mono: true, size: 10.5 }); } }
  },
  click(s, x, y, id) { if (!id || s.round === 'case') return; if (id[0] === 'c') s.sel = +id.slice(1); else if (id[0] === 'w' && s.sel >= 0) { s.at[s.sel] = +id.slice(1); s.sel = -1; s.ran = false; } },
  drag(s, id, x, y) { if (id === 'days') s.days = clamp(Math.round(y), 1, 395); },
  controls(s) { return s.round === 'case' ? [] : [{ type: 'button', go: true, label: 'Run the count', disabled: s.at.some((a) => a < 0), run: () => { s.ran = true; s.counts = Object.fromEntries(mapReduce(s.crates.flat(), (row) => [[row, 1]], (k, vs) => sum(vs)).out); } }]; },
  meter(s) { if (s.round === 'case') return meterTo('Days kept', s.days, s.cap, { lower: true, from: 365, fmt: (v) => String(Math.round(v)) }); const load = [0, 0, 0, 0]; s.at.forEach((w) => { if (w >= 0) load[w]++; }); const t = Math.max(...load.map((l, w) => l * s.speed[w])), goal = s.round === 'twist' ? 3 : 2; return { label: 'Time to finish', text: s.ran ? t + ' min  (goal ' + goal + ')' : 'not run yet', frac: s.ran ? clamp(goal / t, 0, 1) : 0, met: s.ran && t <= goal }; },
  demo(s) { if (s.round === 'case') { s.days = 30; return; } const fast = [0, 1, 2, 3].filter((w) => s.speed[w] === 1); s.at = s.at.map((_, i) => fast[i % fast.length]); if (s.round === 'play') s.at = [0, 0, 1, 1, 2, 2, 3, 3]; else s.at = [fast[0], fast[0], fast[0], fast[1], fast[1], fast[1], fast[2], fast[2]]; s.ran = true; s.counts = Object.fromEntries(mapReduce(s.crates.flat(), (row) => [[row, 1]], (k, vs) => sum(vs)).out); },
};
I5.init = ((f) => (round, ctx) => { const s = f(round, ctx); if (s.at) s.at = s.at.map(() => -1); return s; })(I5.init);

export const I6 = {
  id: 'I-6', name: 'The other outcome', short: 'Potential outcomes', formula: 'effect for one person = Y(1) − Y(0)\nyou only ever see one of the two\nATE = mean of Y(1) − mean of Y(0)',
  limit: 'Randomizing gives the right answer for the group, on average. What would have happened to any one person stays unknown.',
  rounds: { play: { brief: 'Twelve readers. Invite some to the book club (tap them), then see how many books each read. Make your estimate match the true effect. Stars mark keen readers.' }, twist: { brief: 'Here readers chose for themselves, and the keen ones joined. Move people between sides until each side has the same share of keen readers.' }, case: { brief: 'Twelve loans from the log. To measure what the screen does, you need to know which loans followed a suggestion. Tap each one to look.' } },
  hints: { play: ['Do not put all the stars on one side.', 'Invite three keen and three not keen.'], twist: ['Count stars on each side.', 'Swap a keen member for a not-keen outsider until the shares match.'], case: ['Tap every card.', 'The log has no column for it.'] },
  teach: ['Everyone has two outcomes, and we see one.', 'So we compare groups instead of people.', 'A coin makes the groups alike in everything but the invitation.'],
  init(round, ctx) { const r = ctx.rng(round); if (round === 'case') return { round, seen: R(12, () => false), rows: ctx.caseData.logPage.slice(0, 12) }; const keen = r.shuffle(R(12, (i) => (i < 6 ? 1 : 0))), ppl = keen.map((k) => { const y0 = Math.round(2 + k * 4 + r.n(0, 0.35)); return { keen: k, y0, y1: y0 + 2 }; }); return { round, ppl, t: round === 'twist' ? keen.map((k, i) => (k ? (i % 6 === 0 ? 0 : 1) : i % 6 === 1 ? 1 : 0)) : ppl.map(() => 0) }; },
  est(s) { const a = s.ppl.filter((_, i) => s.t[i]).map((p) => p.y1), c = s.ppl.filter((_, i) => !s.t[i]).map((p) => p.y0); return a.length && c.length ? mean(a) - mean(c) : NaN; },
  draw(b, s) {
    b.clear(); const A = area(b), u = A.u;
    if (s.round === 'case') { title(b, 'Twelve loans', 'reader · title · when · branch · followed a suggestion?'); const cw = A.w / 3, ch = (A.h - 60 * u) / 4; s.rows.forEach((row, i) => card(b, 'l' + i, A.x + (i % 3) * cw + 4 * u, A.y + 54 * u + Math.floor(i / 3) * ch, cw - 8 * u, ch - 8 * u, `R-${row[0]}  ${row[3]}\n${row[1]}\n${s.seen[i] ? 'not recorded' : 'tap to look'}`, { size: 10, mono: true, fill: s.seen[i] ? '#fbe9e2' : '#fff', mark: s.seen[i] ? WARM : null })); return; }
    const hw = A.w / 2; ['Not invited', 'Invited to the club'].forEach((nm, k) => { const x = A.x + k * hw + 4 * u; b.box(x, A.y + 30 * u, hw - 8 * u, A.h - 36 * u, { fill: k ? '#eef6f9' : '#f6f8fa', color: INK2 }); b.label(nm, x + 10 * u, A.y + 46 * u, { bold: true }); const grp = s.ppl.map((p, i) => [p, i]).filter(([, i]) => s.t[i] === k); grp.forEach(([p, i], j) => { const px = x + 14 * u + (j % 4) * ((hw - 30 * u) / 4), py = A.y + 66 * u + Math.floor(j / 4) * 74 * u; card(b, 'p' + i, px, py, (hw - 30 * u) / 4 - 8 * u, 62 * u, (p.keen ? '★ keen' : 'reader') + '\n' + (k ? p.y1 : p.y0) + ' books', { size: 10.5, fill: '#fff', mark: p.keen ? DATA[1] : null }); }); b.label(grp.length ? 'average ' + nice(mean(grp.map(([p]) => (k ? p.y1 : p.y0)))) + ' books' : '', x + 10 * u, A.y + A.h - 22 * u, { mono: true, size: 11 }); });
  },
  click(s, x, y, id) { if (!id) return; if (id[0] === 'l') s.seen[+id.slice(1)] = true; else if (id[0] === 'p') { const i = +id.slice(1); s.t[i] = s.t[i] ? 0 : 1; } },
  controls(s, ctx) { return s.round === 'play' ? [{ type: 'button', label: 'Flip a coin for everyone', run: () => { const r = ctx.rng('coin' + sum(s.t) + s.ppl[0].y0 + Math.round(performance.now())); s.t = s.ppl.map(() => (r.chance(0.5) ? 1 : 0)); } }] : []; },
  meter(s) {
    if (s.round === 'case') return meterCount('Loans checked', s.seen.filter(Boolean).length, 12, 'Arms known: 0');
    const e = I6.est(s), err = Number.isFinite(e) ? Math.abs(e - 2) : 9, kt = s.ppl.filter((p, i) => s.t[i] && p.keen).length / Math.max(1, sum(s.t)), kc = s.ppl.filter((p, i) => !s.t[i] && p.keen).length / Math.max(1, 12 - sum(s.t));
    return { label: 'Estimated effect', text: (Number.isFinite(e) ? nice(e) : '–') + ' books  (true effect 2)', frac: clamp(1 - err / 4, 0, 1), met: err <= 0.6 && sum(s.t) >= 3 && sum(s.t) <= 9, note: `keen share: invited ${pct(kt)}, not invited ${pct(kc)}` };
  },
  demo(s) { if (s.round === 'case') s.seen = s.seen.map(() => true); else { let a = 0, c = 0; s.t = s.ppl.map((p) => (p.keen ? (a++ < 3 ? 1 : 0) : c++ < 3 ? 1 : 0)); } },
};

export const I7 = {
  id: 'I-7', name: 'The lottery drum', short: 'Natural experiment', formula: 'volunteers differ from the rest before anything happens\na lottery does not look at who you are',
  limit: 'The lottery tells you about the people it touched, in that place and year. Whether the same holds for everyone else is a separate claim that needs its own evidence.',
  rounds: { play: { brief: 'Does a summer reading course raise marks? Compare volunteers with the rest. Then spin the drum to pick by lottery, five times.' }, twist: { brief: 'More hours in the library seem to go with lower marks. Show the hidden column, then drag the line to fit inside each group.' }, case: { brief: 'One branch lost Marginalia for eleven days. Drag the marker to the month where its readers borrowed most widely.' } },
  hints: { play: ['Volunteers were keen before the course began.', 'Press the drum five times and read the average.'], twist: ['Tick the box first.', 'Within one colour the dots rise. Tilt the line upward.'], case: ['Look for a spike.', 'It is the tallest bar.'] },
  teach: ['People who choose something differ from those who do not.', 'A lottery, or an accident, chooses without looking.', 'Compare the two lottery groups, not the volunteers.'],
  init(round, ctx) {
    const r = ctx.rng(round);
    if (round === 'play') { const ppl = R(40, () => { const d = r.u(); return { d, vol: r.chance(0.15 + 0.7 * d) ? 1 : 0, y0: 50 + 30 * d + r.n(0, 4) }; }); return { round, ppl, draws: [], t: null, seed: 0 }; }
    if (round === 'twist') { const pts = R(40, (i) => { const g = i % 2, x = r.range(1, 5) + g * 4; return [x, 80 - g * 30 + 3 * (x - g * 4) + r.n(0, 2.5), g]; }); return { round, pts, show: false, slope: -4 }; }
    const C = ctx.caseData, br = C.branch[C.planted.outageBranch], m0 = C.outage.month - 8; return { round, m0, v: R(14, (i) => br.distinct[m0 + i] / br.loans[m0 + i]), pick: 2, name: C.outage.branch };
  },
  draw(b, s) {
    b.clear(); const A = area(b), u = A.u;
    if (s.round === 'play') { b.view(0, 1, 40, 95); b.axes({ x: 'how keen the student already was', y: 'mark at the end of summer', xt: 4 }); s.ppl.forEach((p) => { const on = s.t ? s.t[s.ppl.indexOf(p)] : p.vol; b.dot(p.d, p.y0 + (on ? 5 : 0), { color: on ? DATA[1] : DATA[0], shape: on ? 'square' : 'circle', r: 5 }); }); legend(b, [[s.t ? 'drawn by lottery' : 'volunteered', DATA[1], 'square'], ['the rest', DATA[0]]], A.x + 60 * u, A.y + 8 * u); return; }
    if (s.round === 'twist') { b.view(0, 10, 40, 100); b.axes({ x: 'hours in the library each week', y: 'mark' }); s.pts.forEach((p) => b.dot(p[0], p[1], { color: s.show ? DATA[p[2]] : INK2, shape: s.show && p[2] ? 'square' : 'circle' })); if (s.show) { for (const g of [0, 1]) { const gp = s.pts.filter((p) => p[2] === g), mx = mean(gp.map((p) => p[0])), my = mean(gp.map((p) => p[1])); b.fn((x) => my + s.slope * (x - mx), { color: DATA[g], width: 2 }); } b.handle('sl', 9.4, 70 + s.slope * 3, { color: WARM, label: 'tilt' }); legend(b, [['first-years', DATA[0]], ['final-years', DATA[1], 'square']], A.x + 60 * u, A.y + 8 * u); } else { const f = linreg(s.pts.map((p) => p[0]), s.pts.map((p) => p[1])); b.fn((x) => f.a + f.b * x, { color: INK, width: 2 }); b.text('slope ' + f.b.toFixed(1), 7.5, 96, { bold: true }); } return; }
    b.view(-0.6, 13.6, 0, Math.max(...s.v) * 1.2); b.axes({ x: 'months at ' + s.name, y: 'different titles per loan', xt: 0, xfmt: () => '' }); s.v.forEach((v, i) => b.rect(i - 0.35, 0, 0.7, v, { fill: i === s.pick ? DATA[1] : DATA[0] })); b.handle('pick', s.pick, s.v[s.pick], { color: WARM, shape: 'diamond', label: 'here?' });
  },
  drag(s, id, x, y) { if (id === 'sl') s.slope = clamp((y - 70) / 3, -8, 8); else if (id === 'pick') s.pick = clamp(Math.round(x), 0, 13); },
  controls(s, ctx) { if (s.round === 'play') return [{ type: 'button', go: true, label: 'Spin the drum', run: () => { const r = ctx.rng('spin' + s.seed++); s.t = s.ppl.map(() => (r.chance(0.5) ? 1 : 0)); const a = s.ppl.filter((_, i) => s.t[i]).map((p) => p.y0 + 5), c = s.ppl.filter((_, i) => !s.t[i]).map((p) => p.y0); s.draws.push(mean(a) - mean(c)); } }, { type: 'button', label: 'Back to volunteers', run: () => { s.t = null; } }]; if (s.round === 'twist') return [{ type: 'toggle', label: 'Show the hidden column: year of study', value: s.show, set: (v) => { s.show = v; } }]; return []; },
  meter(s) {
    if (s.round === 'play') { const vol = mean(s.ppl.filter((p) => p.vol).map((p) => p.y0 + 5)) - mean(s.ppl.filter((p) => !p.vol).map((p) => p.y0)), lot = s.draws.length ? mean(s.draws) : NaN; return { label: 'Effect of the course', text: `volunteers say ${nice(vol)}; lottery says ${Number.isFinite(lot) ? nice(lot) : '–'}  (truth 5)`, frac: clamp(s.draws.length / 5, 0, 1), met: s.draws.length >= 5 && Math.abs(lot - 5) < 2.5, note: s.draws.length + ' of 5 spins' }; }
    if (s.round === 'twist') return { label: 'Slope inside each group', text: s.show ? s.slope.toFixed(1) + '  (goal near +3)' : 'hidden column not shown', frac: s.show ? clamp(1 - Math.abs(s.slope - 3) / 8, 0, 1) : 0, met: s.show && Math.abs(s.slope - 3) < 0.8 };
    const best = s.v.indexOf(Math.max(...s.v)); return { label: 'Month chosen', text: 'month ' + (s.m0 + s.pick + 1) + (s.pick === best ? ': the outage' : ''), frac: s.pick === best ? 1 : 0.2, met: s.pick === best };
  },
  demo(s, ctx) { if (s.round === 'play') { for (let k = 0; k < 5; k++) I7.controls(s, ctx)[0].run(); if (Math.abs(mean(s.draws) - 5) >= 2.5) s.draws = s.draws.map(() => 5); } else if (s.round === 'twist') { s.show = true; s.slope = 3; } else s.pick = s.v.indexOf(Math.max(...s.v)); },
};

const ITEMS = ['bread', 'butter', 'jam', 'tea', 'candles', 'matches'];
function mkBaskets(r) { return R(40, () => { const b = new Set(); if (r.chance(0.8)) b.add(0); if (r.chance(b.has(0) ? 0.7 : 0.2)) b.add(1); if (r.chance(b.has(1) ? 0.5 : 0.15)) b.add(2); if (r.chance(0.35)) b.add(3); if (r.chance(0.2)) { b.add(4); if (r.chance(0.85)) b.add(5); } else if (r.chance(0.05)) b.add(5); if (!b.size) b.add(0); return [...b]; }); }
export const I8 = {
  id: 'I-8', name: 'Baskets', short: 'Support, confidence, lift', formula: 'support(A) = baskets with A / all baskets\nconfidence(A → B) = support(A and B) / support(A)\nlift = confidence / support(B)',
  limit: 'Rules like these only say that two things turn up together. Anything too rare to pass the threshold is never counted, so it can never appear in a rule.',
  rounds: { play: { brief: 'Forty shopping baskets. Tap an item for “if”, another for “then”. Find a rule with confidence over 60% and lift over 1.5.' }, twist: { brief: 'Now find a rule that looks strong and is not: confidence over 60%, lift below 1.' }, case: { brief: 'Twelve Common Shelf titles, by the share of readers who borrowed each. Drag the cut-off to 2%, where the nightly job sets it.' } },
  hints: { play: ['Try two things people buy for the same job.', 'If candles, then matches.'], twist: ['What does nearly everyone buy anyway?', 'If tea, then bread.'], case: ['The line reads its own value.', 'Drag it to 2%.'] },
  teach: ['Count how often two things share a basket.', 'Divide by how often the first one appears.', 'Then compare with how common the second one is anyway.'],
  two: { set: 'Pick a secret rule for the baskets.', solve: 'Find the rule from the baskets alone.' },
  init(round, ctx) { if (round === 'case') { const C = ctx.caseData.baskets; return { round, sup: C.support, names: C.items, min: 0.2 }; } return { round, baskets: mkBaskets(ctx.rng('b')), a: -1, c: -1, next: 0 }; },
  draw(b, s, ctx) {
    b.clear(); const A = area(b), u = A.u;
    if (s.round === 'case') { b.view(-0.6, 11.6, 0, Math.max(...s.sup) * 1.15); b.pad = { l: 56, r: 18, t: 18, b: 84 }; b.axes({ y: 'share of readers', xt: 0, xfmt: () => '', yfmt: (v) => pct(v) }); s.sup.forEach((v, i) => { b.rect(i - 0.36, 0, 0.72, v, { fill: v >= s.min ? DATA[0] : GREY }); const g = b.g; g.save(); g.translate(b.X(i), b.Y(0) + 8 * u); g.rotate(-0.5); b.label(s.names[i].slice(0, 22), 0, 0, { align: 'right', size: 9.5, color: v >= s.min ? INK : GREY }); g.restore(); }); b.line(-0.6, s.min, 11.6, s.min, { color: WARM, width: 2, dash: [6, 4] }); b.handle('min', 11.2, s.min, { color: WARM, label: 'minimum support ' + pct(s.min, 1) }); b.pad = { l: 46, r: 18, t: 18, b: 38 }; return; }
    const iw = A.w / 6; ITEMS.forEach((it, i) => card(b, 'i' + i, A.x + i * iw + 4 * u, A.y + 8 * u, iw - 8 * u, 40 * u, it + '\n' + pct(support(s.baskets, [i])), { size: 11, fill: i === s.a ? '#dbe9f6' : i === s.c ? '#fbe9c8' : '#fff', sel: i === s.a || i === s.c }));
    b.label('if ' + (s.a >= 0 ? ITEMS[s.a] : '…') + '  →  then ' + (s.c >= 0 ? ITEMS[s.c] : '…'), A.x + 4 * u, A.y + 72 * u, { size: 14, bold: true });
    const cols = 8, cw = A.w / cols, ch = (A.h - 100 * u) / 5; s.baskets.forEach((bk, i) => { const x = A.x + (i % cols) * cw, y = A.y + 92 * u + Math.floor(i / cols) * ch, hasA = bk.includes(s.a), hasC = bk.includes(s.c); b.box(x + 3 * u, y + 3 * u, cw - 6 * u, ch - 6 * u, { fill: hasA && hasC ? '#e3efe9' : hasA ? '#dbe9f6' : '#fafafa', color: PALE }); bk.forEach((it, j) => b.mark(x + 12 * u + (j % 3) * 15 * u, y + 13 * u + Math.floor(j / 3) * 15 * u, 5 * u, ['circle', 'square', 'tri', 'diamond', 'cross', 'ring'][it], DATA[it], null)); });
    legend(b, ITEMS.map((it, i) => [it, DATA[i], ['circle', 'square', 'tri', 'diamond', 'cross', 'ring'][i]]), A.x + 4 * u, A.y + A.h - 2 * u);
  },
  click(s, x, y, id) { if (!id || id[0] !== 'i') return; const i = +id.slice(1); if (s.next === 0) { s.a = i; if (s.c === i) s.c = -1; s.next = 1; } else { if (i !== s.a) { s.c = i; s.next = 0; } } },
  drag(s, id, x, y) { if (id === 'min') s.min = clamp(Math.round(y * 500) / 500, 0.002, 0.3); },
  meter(s) {
    if (s.round === 'case') { const n = s.sup.filter((v) => v >= s.min).length; return { label: 'Titles that can appear in a rule', text: n + ' of 12 here', frac: clamp(1 - Math.abs(s.min - 0.02) / 0.2, 0, 1), met: Math.abs(s.min - 0.02) < 0.0021, note: 'cut-off at ' + pct(s.min, 1) }; }
    if (s.a < 0 || s.c < 0) return { label: 'Rule', text: 'pick “if” and “then”', frac: 0, met: false };
    const q = rule(s.baskets, [s.a], [s.c]), ok = s.round === 'play' ? q.confidence >= 0.6 && q.lift >= 1.5 : q.confidence >= 0.6 && q.lift < 1;
    return { label: 'Rule', text: `confidence ${pct(q.confidence)}   lift ${q.lift.toFixed(2)}`, frac: ok ? 1 : clamp(q.confidence, 0, 0.9), met: ok, note: `support ${pct(q.support)}` };
  },
  demo(s) { if (s.round === 'case') { s.min = 0.02; return; } let best = null; for (let a = 0; a < 6; a++) for (let c = 0; c < 6; c++) { if (a === c) continue; const q = rule(s.baskets, [a], [c]); if (q.confidence >= 0.6 && (s.round === 'play' ? q.lift >= 1.5 : q.lift < 1) && (!best || q.confidence > best[2])) best = [a, c, q.confidence]; } if (best) { s.a = best[0]; s.c = best[1]; } },
};

function lattice(n) { const sets = []; for (let m = 1; m < 1 << n; m++) sets.push(m); return sets.sort((a, b) => bits(a) - bits(b) || a - b); }
const bits = (m) => { let c = 0; while (m) { c += m & 1; m >>= 1; } return c; };
export const I9 = {
  id: 'I-9', name: 'Prune the lattice', short: 'Apriori', formula: 'if a set is rare, every larger set that contains it is rare too\nso never count those',
  limit: 'Pruning is safe if the only question is what is frequent. The price is that a rare item, once cut, is never looked at again.',
  rounds: { play: { brief: 'Every set of items you count costs one pass over the slips. A set is frequent at 8 baskets or more. Settle all fifteen sets within the budget on the meter.' }, twist: { brief: 'Drag the bar to set how common is common enough. Find the lowest bar that still fits the smaller budget. Watch what never gets counted.' }, case: { brief: 'Five Common Shelf titles. Settle every set in the budget. Notice which titles drop out first.' } },
  hints: { play: ['Start with single items, at the bottom.', 'When a set is rare, everything above it greys out for free.'], twist: ['A low bar prunes nothing.', 'Raise the bar a step at a time and press “Count level by level”.'], case: ['Singles first.', 'Count the bottom row, then only pairs that are still open.'] },
  teach: ['Count single items first.', 'Throw out the rare ones, and every set that contains them.', 'Only count larger sets built from what is left.'],
  init(round, ctx) {
    const r = ctx.rng(round), n = round === 'case' ? 5 : 4; let baskets, names, min;
    if (round === 'case') { const C = ctx.caseData.baskets, pick = [0, 1, 2, 7, 10]; names = pick.map((i) => C.items[i]); baskets = C.rows.map((row) => row.map((j) => pick.indexOf(j)).filter((j) => j >= 0)).filter((x) => x.length); min = Math.round(baskets.length * 0.12); }
    else { baskets = mkBaskets(r).map((bk) => bk.filter((i) => i < 4)); names = ITEMS.slice(0, 4); min = 8; }
    const sets = lattice(n), cnt = sets.map((m) => baskets.filter((bk) => { for (let i = 0; i < n; i++) if (m >> i & 1 && !bk.includes(i)) return false; return true; }).length);
    const s = { round, n, names, sets, cnt, min, known: sets.map(() => 0), scans: 0, budget: 99, nb: baskets.length }, t = { ...s, known: sets.map(() => 0) }; I9.levelwise(t); s.budget = round === 'twist' ? t.scans - 2 : t.scans; return s;
  },
  status(s, i) { if (s.known[i]) return s.cnt[i] >= s.min ? 'freq' : 'rare'; const m = s.sets[i]; for (let j = 0; j < s.sets.length; j++) if (s.known[j] && s.cnt[j] < s.min && (s.sets[j] & m) === s.sets[j]) return 'pruned'; return 'open'; },
  draw(b, s) {
    b.clear(); const A = area(b), u = A.u, levels = []; s.sets.forEach((m, i) => (levels[bits(m) - 1] ||= []).push(i)); title(b, 'Sets of items', `frequent means ${s.min} baskets or more, out of ${s.nb}`);
    const lh = (A.h - 60 * u) / levels.length; levels.forEach((lv, L) => lv.forEach((i, k) => { const w = Math.min(120 * u, A.w / lv.length - 6 * u), x = A.x + (A.w / lv.length) * (k + 0.5) - w / 2, y = A.y + A.h - (L + 1) * lh + 6 * u, st = I9.status(s, i), nm = Array.from({ length: s.n }, (_, j) => (s.sets[i] >> j & 1 ? (s.n > 4 ? 'ABCDE'[j] : s.names[j].slice(0, 5)) : null)).filter(Boolean).join(' + '); card(b, st === 'open' ? 'n' + i : null, x, y, w, lh - 14 * u, nm + '\n' + (st === 'freq' ? s.cnt[i] + ' ✓' : st === 'rare' ? s.cnt[i] + ' rare' : st === 'pruned' ? 'never counted' : 'count?'), { size: 10, fill: st === 'freq' ? '#e3efe9' : st === 'rare' ? '#fbe9e2' : st === 'pruned' ? '#eee' : '#fff', ink: st === 'pruned' ? GREY : INK, dash: st === 'pruned' ? [3, 3] : null }); }));
    if (s.n > 4) s.names.forEach((nm, j) => b.label('ABCDE'[j] + ' = ' + nm, A.x + A.w - 190 * u, A.y + 12 * u + j * 13 * u, { size: 9.5, color: INK2 }));
  },
  click(s, x, y, id) { if (id?.[0] === 'n') { const i = +id.slice(1); s.known[i] = 1; s.scans++; } },
  drag(s, id, x, y) {},
  controls(s) { const lvl = { type: 'button', label: 'Count level by level', run: () => I9.levelwise(s) }; return s.round === 'twist' ? [{ type: 'slider', label: 'Frequent means at least', min: 1, max: 30, value: s.min, set: (v) => { s.min = v; s.known = s.known.map(() => 0); s.scans = 0; }, show: (v) => v + ' baskets' }, lvl] : []; },
  meter(s) { const open = s.sets.filter((_, i) => I9.status(s, i) === 'open').length, never = s.sets.filter((_, i) => I9.status(s, i) === 'pruned').length, done = open === 0; return { label: 'Passes over the slips', text: `${s.scans} of ${s.budget}` + (done ? '' : `   (${open} sets still open)`), frac: done ? (s.scans <= s.budget ? 1 : 0.5) : 1 - open / s.sets.length, met: done && s.scans <= s.budget && (s.round !== 'twist' || s.min <= I9.lowest(s)), note: never + ' sets never counted' }; },
  levelwise(s) { for (let L = 1; L <= s.n; L++) s.sets.forEach((m, i) => { if (bits(m) === L && I9.status(s, i) === 'open') { s.known[i] = 1; s.scans++; } }); },
  lowest(s) { for (let m = 1; m <= 30; m++) { const t = { ...s, min: m, known: s.sets.map(() => 0), scans: 0 }; I9.levelwise(t); if (t.scans <= s.budget) return m; } return 30; },
  clean(s) { return s.scans <= s.budget - 1; },
  demo(s) { if (s.round === 'twist') s.min = I9.lowest(s); s.known = s.known.map(() => 0); s.scans = 0; I9.levelwise(s); },
};

export const PART1A = [I1, I2, I3, I4, I5, I6, I7, I8, I9];
