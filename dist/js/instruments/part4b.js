// Part IV, summer. Instruments IV-10 to IV-17.
import { DATA, INK, INK2, GREY, GOOD, WARM, SHAPES, nice, pct, clamp, sum, mean, R, meterTo, meterCount, area, card, wrap } from './lib.js';
import { logistic } from '../algo/classify.js';
import { rrAnswer, rrEstimate, laplace } from '../algo/learn.js';
import { RNG } from '../core/rng.js';

const PAPER = '#fffdf5', YES = '#cfeadb', NO = '#fbe0d6', SEL = '#ffe9a8';
const slider = (b, id, v, lo, hi, label) => { b.view(lo, hi, 0, 1); b.pad = { l: 40, r: 40, t: b.h / b.u - 56, b: 28 }; b.line(lo, 0.5, hi, 0.5, { color: INK2, width: 3 }); b.handle(id, v, 0.5, { color: WARM, label }); b.pad = { l: 46, r: 18, t: 18, b: 38 }; };

// ---------- IV-10 Which is better? ----------
const FEATS = ['different subjects', 'bestseller stickers', 'a poster on top'];
const display = (r) => ({ v: r.int(1, 5), b: r.int(0, 5), p: r.chance(0.5) ? 1 : 0 });
const pairOf = (r) => { for (;;) { const a = display(r), c = display(r); if (a.v !== c.v) return [a, c]; } };
const diff = ([a, c]) => [(a.v - c.v) / 4, (a.b - c.b) / 5, a.p - c.p];
const fit = (X, y) => (X.length ? logistic(X, y, { lr: 0.8, iters: 400, l2: 0.02 }).w : [0, 0, 0, 0]);
const says = (w, d) => w[0] + w[1] * d[0] + w[2] * d[1] + w[3] * d[2] >= 0;
function drawDisplay(b, d, px, py, w, h, u) { const cols = [DATA[0], DATA[1], DATA[2], DATA[3], DATA[4] || '#7a5ea8'], bw = (w - 20 * u) / 5; b.box(px, py, w, h, { fill: PAPER, color: INK }); if (d.p) { b.box(px + w / 2 - 16 * u, py + 6 * u, 32 * u, 20 * u, { fill: '#ffd98a', color: INK }); b.mark(px + w / 2, py + 16 * u, 5 * u, 'triangle', DATA[2], INK); } for (let i = 0; i < 5; i++) { const x = px + 10 * u + i * bw, hh = h - 46 * u; b.box(x + 2 * u, py + 34 * u, bw - 4 * u, hh, { fill: cols[i % d.v], color: INK }); if (i < d.b) b.mark(x + bw / 2, py + 34 * u + hh - 10 * u, 5 * u, 'diamond', '#ffe066', INK); } }
export const IV10 = {
  id: 'IV-10', name: 'Which is better?', short: 'Learning from preferences',
  formula: 'show a person two results and ask which is better\ntrain a second model to predict the choices\nuse that model’s score as the reward',
  limit: 'The reward model learns whatever explains the choices. If the judge had a different reason from the one intended, that is the reason it learns.',
  rounds: {
    play: { brief: 'You are the judge. The better display is the one with more different subjects, shown as colours. Tap the better of each pair until the reward model agrees with that rule nine times in ten.' },
    twist: { brief: 'Wren judged twelve pairs. A reward model learned from her choices. The bars are what it now rewards. Tap what it learned to care about.' },
    case: { brief: 'Loans say Marginalia does better every year. The yearly reader survey is a second signal. Drag the marker to the first year the survey falls below where it started.' } },
  hints: { play: ['Count the colours on each shelf.', 'About eight pairs will do.'], twist: ['Look at which display she ticked each time.', 'She liked the poster.'], case: ['Read the lower line from left to right.', 'Year three.'] },
  teach: ['When a goal is hard to write down, ask people to compare.', 'Fit a model to their choices.', 'Check what the model learned, because it may not be what was meant.'],
  two: { set: 'Judge pairs of drawings by a secret rule.', solve: 'Work out the rule from the choices alone.' },
  init(round, ctx) {
    const r = ctx.rng(round);
    if (round === 'case') { const y = ctx.caseData.y; return { round, yr: 1, hit: y.hit.slice(), survey: y.survey.slice() }; }
    if (round === 'twist') { const pairs = R(12, () => { for (;;) { const q = pairOf(r); if (q[0].p !== q[1].p) return q; } }), X = pairs.map(diff), y = pairs.map((q) => (q[0].p ? 1 : 0)); return { round, pairs: pairs.slice(0, 4), w: fit(X, y), pick: -1 }; }
    return { round, queue: R(24, () => pairOf(r)), tests: R(40, () => diff(pairOf(r))), X: [], y: [], w: [0, 0, 0, 0] };
  },
  agree(s) { return s.tests.filter((d) => says(s.w, d) === d[0] > 0).length / s.tests.length; },
  draw(b, s) {
    b.clear(); b.fit(); const A = area(b), u = A.u;
    if (s.round === 'case') { b.view(0.5, 6.5, 0, 0.85); b.axes({ x: 'year', xt: 6, xfmt: (v) => String(Math.round(v)), yfmt: (v) => v.toFixed(1) }); b.path(s.hit.map((v, i) => [i + 1, v]), { color: DATA[0], width: 2.5 }); b.path(s.survey.map((v, i) => [i + 1, v]), { color: DATA[1], width: 2.5 }); b.text('hit rate: loans that came from the screen', 2.6, 0.8, { size: 11, color: DATA[0] }); b.text('survey: readers glad of what they borrowed', 2.6, 0.74, { size: 11, color: DATA[1] }); b.line(0.5, s.survey[0], 6.5, s.survey[0], { color: GREY, dash: [4, 4] }); b.handle('yr', s.yr, s.survey[s.yr - 1], { color: WARM, label: 'year ' + s.yr }); return; }
    if (s.round === 'twist') { b.label('Four of the twelve pairs. The tick is Wren’s choice.', A.x + 8 * u, A.y + 8 * u, { size: 11, color: INK2 }); const w = (A.w - 40 * u) / 4; s.pairs.forEach((q, i) => { const x = A.x + 8 * u + i * (w + 8 * u); q.forEach((d, k) => { drawDisplay(b, d, x, A.y + 20 * u + k * 64 * u, w, 58 * u, u); if (d.p) b.label('✓', x + w - 14 * u, A.y + 32 * u + k * 64 * u, { size: 16, color: GOOD, bold: true }); }); }); const y0 = A.y + 160 * u, mx = Math.max(...s.w.slice(1).map(Math.abs), 1e-6); b.label('What the reward model now pays for', A.x + 8 * u, y0, { size: 11, color: INK2 }); FEATS.forEach((f, i) => { const y = y0 + 12 * u + i * 40 * u, v = s.w[i + 1] / mx; card(b, 'f' + i, A.x + 8 * u, y, 170 * u, 34 * u, f, { size: 12, sel: s.pick === i, fill: s.pick === i ? (i === 2 ? YES : NO) : PAPER }); b.box(A.x + 190 * u + (v < 0 ? v * 120 * u : 0) + 120 * u, y + 9 * u, Math.max(2 * u, Math.abs(v) * 120 * u), 16 * u, { fill: v >= 0 ? DATA[2] : DATA[3] }); }); return; }
    const q = s.queue[s.X.length % s.queue.length], w = (A.w - 40 * u) / 2; b.label(`Pair ${s.X.length + 1}. Tap the better display.`, A.x + 8 * u, A.y + 10 * u, { size: 12, bold: true }); q.forEach((d, k) => { const x = A.x + 8 * u + k * (w + 24 * u); drawDisplay(b, d, x, A.y + 26 * u, w, 120 * u, u); b.zone('d' + k, x, A.y + 26 * u, w, 120 * u); });
    const y0 = A.y + 176 * u, mx = Math.max(...s.w.slice(1).map(Math.abs), 1e-6); b.label('What the reward model pays for so far', A.x + 8 * u, y0, { size: 11, color: INK2 }); FEATS.forEach((f, i) => { const y = y0 + 14 * u + i * 26 * u, v = s.X.length ? s.w[i + 1] / mx : 0; b.label(f, A.x + 8 * u, y + 8 * u, { size: 12 }); b.box(A.x + 280 * u + (v < 0 ? v * 110 * u : 0), y, Math.max(2 * u, Math.abs(v) * 110 * u), 16 * u, { fill: v >= 0 ? DATA[2] : DATA[3] }); });
  },
  click(s, x, y, id) { if (s.round === 'twist' && id?.[0] === 'f') s.pick = +id.slice(1); else if (s.round === 'play' && id?.[0] === 'd') { const q = s.queue[s.X.length % s.queue.length]; s.X.push(diff(q)); s.y.push(id === 'd0' ? 1 : 0); s.w = fit(s.X, s.y); } },
  drag(s, id, x) { if (id === 'yr') s.yr = clamp(Math.round(x), 1, 6); },
  meter(s) {
    if (s.round === 'case') { const first = s.survey.findIndex((v) => v < s.survey[0]) + 1, ok = s.yr === first; return { label: 'Year ' + s.yr, text: `hit rate ${pct(s.hit[s.yr - 1])}   survey ${s.survey[s.yr - 1].toFixed(2)}`, goal: 'first year the survey is below year one', frac: ok ? 1 : 0.3, met: ok, note: ok ? 'From here on the two signals point opposite ways. Marginalia was only ever trained on one.' : '' }; }
    if (s.round === 'twist') return { label: 'Your pick', text: s.pick < 0 ? 'nothing yet' : FEATS[s.pick], goal: 'what the model learned to reward', frac: s.pick === 2 ? 1 : s.pick >= 0 ? 0.3 : 0, met: s.pick === 2, note: s.pick === 2 ? 'Nobody asked for posters. The choices said posters, so that is what it learned.' : '' };
    return meterTo('Agrees with the rule', IV10.agree(s), 0.9, { from: 0.4, fmt: (v) => pct(v), note: `pairs judged: ${s.X.length}` });
  },
  demo(s) { if (s.round === 'case') s.yr = s.survey.findIndex((v) => v < s.survey[0]) + 1; else if (s.round === 'twist') s.pick = 2; else for (let i = 0; i < 24 && IV10.agree(s) < 0.9; i++) { const q = s.queue[s.X.length % s.queue.length]; s.X.push(diff(q)); s.y.push(q[0].v > q[1].v ? 1 : 0); s.w = fit(s.X, s.y); } },
};

// ---------- IV-11 A small patch ----------
const SHADE = ['#fffdf5', '#b9c4d6', '#52607a'];
export const IV11 = {
  id: 'IV-11', name: 'A small patch', short: 'Fine-tuning with low-rank updates',
  formula: 'leave the big table of weights W as it is\nadd a patch made from two thin strips: W + B × A\nonly the strips are trained',
  limit: 'A patch learns from the data it is tuned on and from nothing else. Where that data is silent, the patch is too.',
  rounds: {
    play: { brief: 'Thirty-six frozen weights on the left. The picture on the right is what the layer should become. Switch cells in the two thin strips. Their product is added on top. Match the picture.' },
    twist: { brief: 'Count what gets trained. Choose the size of the layer and the width of the strips. For a layer of a thousand by a thousand, train under one weight in a hundred.' },
    case: { brief: 'Ten titles and their loans last year. Tune the assistant on those loans. Then tap every title the patch has nothing to say about.' } },
  hints: { play: ['A cell changes when both its row switch and its column switch are on.', 'Folio can set them.'], twist: ['For a small layer the strips are no saving at all.', 'A thousand wide, strips of four or fewer.'], case: ['Press the button first.', 'The ones that were not borrowed.'] },
  teach: ['Freeze the model.', 'Train a pair of thin matrices beside each layer.', 'Keep the small patch, and swap it for another when the job changes.'],
  init(round, ctx) {
    const r = ctx.rng(round);
    if (round === 'case') { const C = ctx.caseData, idx = [0, 7, 14, 20, 30, 38, 46, 52, 57, 59], loans = r.shuffle(idx.map((i) => C.titles.sampleLast[i])); return { round, loans, marks: loans.map(() => `${r.pick(['QH', 'PN', 'TJ', 'ND', 'GB', 'SB'])} ${r.int(100, 899)}`), tuned: false, picks: [], zero: C.titles.zeroLast }; }
    if (round === 'twist') return { round, n: 6, r: 8 };
    const pickStrip = () => { for (;;) { const v = R(6, () => (r.chance(0.45) ? 1 : 0)), k = sum(v); if (k >= 2 && k <= 4) return v; } };
    return { round, W: R(6, () => R(6, () => (r.chance(0.35) ? 1 : 0))), tu: pickStrip(), tv: pickStrip(), u: R(6, () => 0), v: R(6, () => 0) };
  },
  draw(b, s) {
    b.clear(); b.fit(); const A = area(b), u = A.u;
    if (s.round === 'case') { const cw = (A.w - 16 * u) / 5, mx = Math.max(...s.loans); b.label('Ten titles, by shelf mark, with their loans last year', A.x + 8 * u, A.y + 8 * u, { size: 11, color: INK2 }); s.loans.forEach((n, i) => { const x = A.x + 8 * u + (i % 5) * cw, y = A.y + 22 * u + Math.floor(i / 5) * 112 * u, on = s.picks.includes(i); card(b, s.tuned ? 't' + i : null, x, y, cw - 8 * u, 100 * u, '', { sel: on, fill: on ? (n === 0 ? YES : NO) : PAPER }); b.label(s.marks[i], x + (cw - 8 * u) / 2, y + 14 * u, { align: 'center', size: 12, mono: true }); b.label(`${n} ${n === 1 ? 'loan' : 'loans'}`, x + (cw - 8 * u) / 2, y + 32 * u, { align: 'center', size: 12 }); if (s.tuned) { b.label(n ? 'nudged' : 'no nudge', x + (cw - 8 * u) / 2, y + 54 * u, { align: 'center', size: 10.5, color: INK2 }); if (n) b.box(x + 10 * u, y + 66 * u, Math.max(3 * u, (cw - 28 * u) * (n / mx)), 14 * u, { fill: DATA[1] }); } }); return; }
    if (s.round === 'twist') { const full = s.n * s.n, patch = 2 * s.n * s.r, sz = 110 * u, th = Math.max(3 * u, Math.min(sz, sz * (s.r / s.n))); b.label('the layer', A.x + 30 * u, A.y + 14 * u, { size: 11, color: INK2 }); b.box(A.x + 30 * u, A.y + 26 * u, sz, sz, { fill: SHADE[1], color: INK }); b.label(`${nice(s.n)} × ${nice(s.n)} = ${nice(full)} weights`, A.x + 30 * u, A.y + 26 * u + sz + 16 * u, { size: 12 }); const x = A.x + 200 * u; b.label('the patch', x, A.y + 14 * u, { size: 11, color: INK2 }); b.box(x, A.y + 26 * u, th, sz, { fill: DATA[1], color: INK }); b.box(x + th + 14 * u, A.y + 26 * u, sz, th, { fill: DATA[1], color: INK }); b.label(`2 × ${nice(s.n)} × ${s.r} = ${nice(patch)} numbers`, x, A.y + 26 * u + sz + 16 * u, { size: 12 }); return; }
    const c = 26 * u, x0 = A.x + 44 * u, y0 = A.y + 56 * u, cell = (v) => SHADE[clamp(v, 0, 2)];
    b.label('frozen weights + your patch', x0, A.y + 10 * u, { size: 11, color: INK2 }); b.label('wanted', x0 + 8 * c + 30 * u, A.y + 10 * u, { size: 11, color: INK2 });
    for (let j = 0; j < 6; j++) card(b, 'v' + j, x0 + j * c, y0 - c - 8 * u, c - 3 * u, c - 3 * u, s.v[j] ? '1' : '0', { size: 12, mono: true, fill: s.v[j] ? DATA[1] : PAPER });
    for (let i = 0; i < 6; i++) { card(b, 'u' + i, x0 - c - 8 * u, y0 + i * c, c - 3 * u, c - 3 * u, s.u[i] ? '1' : '0', { size: 12, mono: true, fill: s.u[i] ? DATA[1] : PAPER }); for (let j = 0; j < 6; j++) { const now = s.W[i][j] + s.u[i] * s.v[j], want = s.W[i][j] + s.tu[i] * s.tv[j]; b.box(x0 + j * c, y0 + i * c, c - 3 * u, c - 3 * u, { fill: cell(now), color: now === want ? INK : WARM, width: now === want ? 1 : 3 }); b.box(x0 + 8 * c + 30 * u + j * c, y0 + i * c, c - 3 * u, c - 3 * u, { fill: cell(want), color: INK }); } }
    b.label('Twelve switches steer thirty-six weights.', x0 - c, y0 + 6 * c + 22 * u, { size: 11.5, color: INK2 });
  },
  click(s, x, y, id) { if (s.round === 'play' && id?.[0] === 'u') s.u[+id.slice(1)] ^= 1; else if (s.round === 'play' && id?.[0] === 'v') s.v[+id.slice(1)] ^= 1; else if (s.round === 'case' && id?.[0] === 't') { const i = +id.slice(1); s.picks = s.picks.includes(i) ? s.picks.filter((k) => k !== i) : [...s.picks, i]; } },
  controls(s) {
    if (s.round === 'case') return [{ type: 'button', go: !s.tuned, label: 'Tune on last year’s loans', disabled: s.tuned, run: () => { s.tuned = true; } }];
    if (s.round === 'twist') return [{ type: 'buttons', label: 'Size of the layer', value: s.n, options: [6, 100, 1000].map((v) => ({ label: `${nice(v)} × ${nice(v)}`, value: v })), set: (v) => { s.n = v; } }, { type: 'slider', label: 'Width of the strips', min: 1, max: 8, step: 1, value: s.r, set: (v) => { s.r = v; } }];
    return [];
  },
  meter(s) {
    if (s.round === 'case') { const zeros = s.loans.map((n, i) => (n === 0 ? i : -1)).filter((i) => i >= 0), good = s.picks.filter((i) => zeros.includes(i)).length, bad = s.picks.length - good, ok = s.tuned && good === zeros.length && !bad; return { label: 'Titles the patch is silent about', text: `${good} of ${zeros.length} found` + (bad ? `, ${bad} wrong` : ''), frac: ok ? 1 : s.tuned ? (good / zeros.length) * 0.8 : 0, met: ok, note: ok ? `Across the whole catalogue, ${pct(s.zero)} of titles were not borrowed last year.` : s.tuned ? '' : 'Tune it first.' }; }
    if (s.round === 'twist') { const share = (2 * s.n * s.r) / (s.n * s.n), ok = s.n === 1000 && share < 0.01; return { label: 'Trained, as a share of the layer', text: share >= 1 ? `${Math.round(share * 100)}%` : pct(share, 1), goal: 'under 1%, for 1,000 × 1,000', frac: ok ? 1 : s.n === 1000 ? 0.6 : 0.2, met: ok, note: share >= 1 ? 'For a layer this small the patch is bigger than the layer.' : '' }; }
    let k = 0; for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) if (s.u[i] * s.v[j] === s.tu[i] * s.tv[j]) k++; return meterCount('Weights that match', k, 36);
  },
  demo(s) { if (s.round === 'case') { s.tuned = true; s.picks = s.loans.map((n, i) => (n === 0 ? i : -1)).filter((i) => i >= 0); } else if (s.round === 'twist') { s.n = 1000; s.r = 4; } else { s.u = s.tu.slice(); s.v = s.tv.slice(); } },
};

// ---------- IV-12 Match the caption ----------
function icon(b, kind, cx, cy, r) {
  const g = b.g, u = b.u; g.save(); g.lineWidth = 2 * u; g.strokeStyle = INK; g.lineJoin = 'round'; g.lineCap = 'round';
  const fill = (c) => { g.fillStyle = c; g.fill(); g.stroke(); };
  if (kind === 'sun') { g.beginPath(); g.arc(cx, cy, r * 0.45, 0, 6.3); fill('#ffd24a'); for (let i = 0; i < 8; i++) { const a = (i / 8) * 6.283; g.beginPath(); g.moveTo(cx + Math.cos(a) * r * 0.6, cy + Math.sin(a) * r * 0.6); g.lineTo(cx + Math.cos(a) * r * 0.9, cy + Math.sin(a) * r * 0.9); g.stroke(); } }
  else if (kind === 'boat') { g.beginPath(); g.moveTo(cx - r * 0.8, cy + r * 0.3); g.lineTo(cx + r * 0.8, cy + r * 0.3); g.lineTo(cx + r * 0.5, cy + r * 0.7); g.lineTo(cx - r * 0.5, cy + r * 0.7); g.closePath(); fill(DATA[3]); g.beginPath(); g.moveTo(cx, cy + r * 0.3); g.lineTo(cx, cy - r * 0.8); g.lineTo(cx + r * 0.6, cy + r * 0.15); g.closePath(); fill('#ffffff'); }
  else if (kind === 'tree') { g.beginPath(); g.rect(cx - r * 0.12, cy + r * 0.1, r * 0.24, r * 0.7); fill('#a9744a'); g.beginPath(); g.arc(cx, cy - r * 0.2, r * 0.55, 0, 6.3); fill(DATA[2]); }
  else if (kind === 'fish') { g.beginPath(); g.ellipse(cx - r * 0.1, cy, r * 0.6, r * 0.35, 0, 0, 6.3); fill(DATA[0]); g.beginPath(); g.moveTo(cx + r * 0.45, cy); g.lineTo(cx + r * 0.9, cy - r * 0.35); g.lineTo(cx + r * 0.9, cy + r * 0.35); g.closePath(); fill(DATA[0]); g.beginPath(); g.arc(cx - r * 0.4, cy - r * 0.08, r * 0.06, 0, 6.3); g.fillStyle = INK; g.fill(); }
  else if (kind === 'kite') { g.beginPath(); g.moveTo(cx, cy - r * 0.8); g.lineTo(cx + r * 0.5, cy - r * 0.1); g.lineTo(cx, cy + r * 0.5); g.lineTo(cx - r * 0.5, cy - r * 0.1); g.closePath(); fill(DATA[1]); g.beginPath(); g.moveTo(cx, cy + r * 0.5); g.quadraticCurveTo(cx + r * 0.4, cy + r * 0.7, cx + r * 0.1, cy + r * 0.95); g.stroke(); }
  else if (kind === 'bird') { g.beginPath(); g.moveTo(cx - r * 0.8, cy - r * 0.1); g.quadraticCurveTo(cx - r * 0.4, cy - r * 0.6, cx, cy); g.quadraticCurveTo(cx + r * 0.4, cy - r * 0.6, cx + r * 0.8, cy - r * 0.1); g.stroke(); }
  else if (kind === 'apple') { g.beginPath(); g.arc(cx, cy + r * 0.1, r * 0.55, 0, 6.3); fill('#e8604c'); g.beginPath(); g.moveTo(cx, cy - r * 0.45); g.lineTo(cx + r * 0.1, cy - r * 0.8); g.stroke(); g.beginPath(); g.rect(cx - r * 0.42, cy - r * 0.05, r * 0.84, r * 0.36); fill('#ffffff'); g.fillStyle = INK; g.font = `${r * 0.26}px 'DM Mono', monospace`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('boat', cx, cy + r * 0.14); }
  g.restore();
}
const PICS = ['sun', 'boat', 'tree', 'fish'];
// A toy of the real thing: pictures and labels as lists of what is in them. The nearest label wins. Writing in a picture counts for a lot.
const ATTR = ['sky', 'string', 'wings', 'water', 'sail', 'round', 'stalk', 'word boat'];
const vec = (list, heavy = {}) => ATTR.map((a) => (list.includes(a) ? heavy[a] || 1 : 0));
const LABELS = [['a kite', vec(['sky', 'string'])], ['a bird', vec(['sky', 'wings'])], ['a boat', vec(['water', 'sail', 'word boat'])], ['an apple', vec(['round', 'stalk'])]];
const NEWPICS = [['kite', vec(['sky', 'string']), 0], ['bird', vec(['sky', 'wings']), 1], ['boat', vec(['water', 'sail']), 2], ['apple', vec(['round', 'stalk', 'word boat'], { 'word boat': 3 }), 3]];
const cosv = (a, c) => sum(a.map((v, i) => v * c[i])) / (Math.hypot(...a) * Math.hypot(...c) || 1);
const labelOf = (v) => { let best = 0, bs = -1; LABELS.forEach(([, t], i) => { const c = cosv(v, t); if (c > bs) { bs = c; best = i; } }); return best; };
export const IV12 = {
  id: 'IV-12', name: 'Match the caption', short: 'Pictures and text in one space',
  formula: 'one network turns a picture into a position, another does the same for a caption\ntrain so that each picture lands beside its own caption and away from the others\nto label a new picture, see which label’s text is nearest',
  limit: 'It matches what goes with the words, and that includes words written inside the picture. It has no way to check what the thing is.',
  rounds: {
    play: { brief: 'Four pictures, four captions, in a jumble. For each picture, tap the caption that should be pulled close. Every other pair gets pushed apart.' },
    twist: { brief: 'Four new pictures. The model labels each by the nearest caption. This toy copies a slip reported for the real model. Tap the picture it gets wrong.' },
    case: { brief: 'Marginalia places books partly by how the cover looks. One quiet book looks like a bestseller. Drag the weight from cover to contents until its nearest neighbour shares its subject.' } },
  hints: { play: ['One caption per picture.', 'Folio can match them.'], twist: ['Read what is written on the pictures.', 'The apple with the note.'], case: ['By the cover, it sits with the bestsellers.', 'Weight on the cover under 0.4.'] },
  teach: ['Collect pictures with their captions.', 'Pull each matching pair together and push the rest apart.', 'Label new pictures by the nearest text.'],
  two: { set: 'Draw a picture and write three captions, one true.', solve: 'Pick the caption that fits.' },
  init(round, ctx) {
    const r = ctx.rng(round);
    if (round === 'case') return { round, w: 1, look: [[2.4, 2.2], [2.9, 1.7], [2.1, 1.5], [2.7, 2.6]], subj: [[-2.4, -1.8], [-1.8, -2.4], [-2.8, -2.5]], me: { look: [2.5, 2.0], subj: [-2.3, -2.2] } };
    if (round === 'twist') return { round, pick: -1 };
    return { round, order: r.shuffle([0, 1, 2, 3]), pick: [-1, -1, -1, -1] };
  },
  where(s) { return [s.w * s.me.look[0] + (1 - s.w) * s.me.subj[0], s.w * s.me.look[1] + (1 - s.w) * s.me.subj[1]]; },
  near(s) { const p = IV12.where(s), d = (q) => Math.hypot(q[0] - p[0], q[1] - p[1]); return Math.min(...s.subj.map(d)) < Math.min(...s.look.map(d)); },
  draw(b, s) {
    b.clear(); b.fit(); const A = area(b), u = A.u;
    if (s.round === 'case') { b.view(-4, 4, -3.4, 3.4, true); b.axes({ xt: 0, yt: 0, xfmt: () => '', yfmt: () => '', grid: false }); s.look.forEach((p) => b.dot(p[0], p[1], { color: DATA[1], shape: 'square', r: 6 })); s.subj.forEach((p) => b.dot(p[0], p[1], { color: DATA[2], r: 6 })); b.text('bestsellers', 2.5, 3.0, { size: 11, color: DATA[1] }); b.text('books on its subject', -2.3, -3.0, { size: 11, color: DATA[2] }); const p = IV12.where(s); b.dot(p[0], p[1], { color: WARM, shape: 'diamond', r: 8, label: 'the quiet book' }); slider(b, 'w', s.w, 0, 1, `weight on the cover ${s.w.toFixed(2)}`); return; }
    if (s.round === 'twist') { const cw = (A.w - 16 * u) / 4; b.label('The labels on offer: a kite, a bird, a boat, an apple', A.x + 8 * u, A.y + 10 * u, { size: 12 }); NEWPICS.forEach(([k, v, truth], i) => { const x = A.x + 8 * u + i * cw, on = s.pick === i, g = labelOf(v); card(b, 'n' + i, x, A.y + 26 * u, cw - 8 * u, 150 * u, '', { sel: on, fill: on ? (g !== truth ? YES : NO) : PAPER }); icon(b, k, x + (cw - 8 * u) / 2, A.y + 82 * u, 44 * u); b.label('it says: ' + LABELS[g][0], x + (cw - 8 * u) / 2, A.y + 156 * u, { align: 'center', size: 12.5, bold: true }); }); return; }
    const cw = Math.min(96 * u, (A.w - 90 * u) / 4), ch = Math.min(60 * u, (A.h - 60 * u) / 4), x0 = A.x + 78 * u, y0 = A.y + 40 * u; s.order.forEach((c, j) => b.label('a ' + PICS[c], x0 + j * cw + cw / 2, y0 - 14 * u, { align: 'center', size: 13, bold: true })); PICS.forEach((k, r) => { icon(b, k, x0 - 40 * u, y0 + r * ch + ch / 2, 24 * u); s.order.forEach((c, j) => { const on = s.pick[r] === j; card(b, `c${r}_${j}`, x0 + j * cw, y0 + r * ch, cw - 4 * u, ch - 4 * u, on ? 'pull' : s.pick[r] >= 0 ? 'push' : '', { size: 11, fill: on ? (c === r ? YES : NO) : PAPER, ink: on ? INK : GREY }); }); });
  },
  click(s, x, y, id) { if (s.round === 'twist' && id?.[0] === 'n') s.pick = +id.slice(1); else if (s.round === 'play' && id?.[0] === 'c') { const [r, j] = id.slice(1).split('_').map(Number); s.pick[r] = j; } },
  drag(s, id, x) { if (id === 'w') s.w = clamp(Math.round(x * 50) / 50, 0, 1); },
  meter(s) {
    if (s.round === 'case') { const ok = IV12.near(s); return { label: 'Its nearest neighbour is', text: ok ? 'a book on its subject' : 'a bestseller', goal: 'a book on its subject', frac: ok ? 1 : 1 - s.w * 0.8, met: ok }; }
    if (s.round === 'twist') { const ok = s.pick >= 0 && labelOf(NEWPICS[s.pick][1]) !== NEWPICS[s.pick][2]; return { label: 'Your pick', text: s.pick < 0 ? 'nothing yet' : 'the ' + NEWPICS[s.pick][0], goal: 'the one it labels wrongly', frac: ok ? 1 : s.pick >= 0 ? 0.3 : 0, met: ok, note: ok ? 'It read the note. In 2021 researchers showed the real model doing the same.' : '' }; }
    return meterCount('Pictures matched to their captions', s.pick.filter((j, r) => j >= 0 && s.order[j] === r).length, 4);
  },
  demo(s) { if (s.round === 'case') s.w = 0.2; else if (s.round === 'twist') s.pick = NEWPICS.findIndex(([, v, t]) => labelOf(v) !== t); else s.pick = PICS.map((_, r) => s.order.indexOf(r)); },
};

// ---------- IV-13 Open book ----------
const PASSAGES = ['The mill whistle blows at six each morning and again at six in the evening.', 'The Larch bindery is on Weir Street, under the rooms where the family lives.', 'Tomas Larch works the signal box at the junction.', 'The Stacks opens at nine and closes at five, except on Sundays.', 'Deckle paper is made from rags and river water.', 'The ferry crosses below the weir when the river is low.'];
const ASKED = [['When does the mill whistle blow?', 0, 'At noon, I should think.'], ['Where is the bindery?', 1, 'Next to the station, probably.'], ['Who works the signal box?', 2, 'A Mr Brown, I believe.']];
const DULL = new Set('the a at in on is and when does do i what where who of to each again under'.split(' '));
const wordsOf = (t) => t.toLowerCase().replace(/[^a-z ]/g, '').split(' ').filter((w) => w && !DULL.has(w));
const overlap = (q, p) => { const P = wordsOf(p); return wordsOf(q).filter((w) => P.includes(w)).length; };
const fetched = (q) => { const sc = PASSAGES.map((p) => overlap(q, p)), m = Math.max(...sc); return m > 0 && sc.filter((v) => v === m).length === 1 ? sc.indexOf(m) : -1; };
const PHRASINGS = ['When does the hooter sound?', 'What time is the mill whistle?', 'When do I hear the hooter?'];
export const IV13 = {
  id: 'IV-13', name: 'Open book', short: 'Retrieval',
  formula: 'first fetch the passages that best match the question\nthen write the answer with those passages in view\nthe answer can point to where it came from',
  limit: 'The answer is only as good as what was fetched. Whatever decides what gets fetched decides what can be said.',
  rounds: {
    play: { brief: 'With the book shut, the model guesses. Open it: for each question, tap the passage to fetch, and the answer is read from there. Get all three right.' },
    twist: { brief: 'This fetcher matches words. The question says “hooter” and the passage says “whistle”, so nothing is found. Choose a wording that fetches the right passage.' },
    case: { brief: 'A child asks Octavo for a book about a snail. Octavo fetches three titles. Change what it ranks by until all three are about the subject.' } },
  hints: { play: ['Read the passages for the words in the question.', 'Folio can fetch them.'], twist: ['Use the words the passage uses.', 'The second wording.'], case: ['It is ranking by loan counts.', 'Rank by match.'] },
  teach: ['Keep the facts in a library outside the model.', 'Fetch what matches the question, then answer from it.', 'Watch what the fetching step leaves out.'],
  init(round, ctx) {
    if (round === 'case') { const C = ctx.caseData; return { round, by: 'loans', list: [...C.titles.top.slice(0, 5).map((t) => [t.name, t.last, 0]), [C.pip.name, 0, 1], ['Slow Things of the Shore', 2, 1], ['A Garden Snail’s Year', 1, 1]] }; }
    if (round === 'twist') return { round, ph: 0 };
    return { round, q: 0, got: [-1, -1, -1] };
  },
  top3(s) { return s.list.slice().sort((a, c) => (s.by === 'loans' ? c[1] - a[1] : c[2] - a[2] || c[1] - a[1])).slice(0, 3); },
  draw(b, s) {
    b.clear(); b.fit(); const A = area(b), u = A.u;
    if (s.round === 'case') { const top = IV13.top3(s); b.label('“Do you have a book about a snail?”', A.x + 8 * u, A.y + 12 * u, { size: 14, bold: true }); b.label('Octavo fetches', A.x + 8 * u, A.y + 36 * u, { size: 11, color: INK2 }); top.forEach((t, i) => card(b, null, A.x + 8 * u, A.y + 46 * u + i * 40 * u, A.w - 16 * u, 34 * u, `${t[0]}   (${nice(t[1])} ${t[1] === 1 ? 'loan' : 'loans'} last year)`, { size: 12, align: 'left', fill: t[2] ? YES : NO })); b.label('Not fetched', A.x + 8 * u, A.y + 176 * u, { size: 11, color: INK2 }); s.list.filter((t) => !top.includes(t)).forEach((t, i) => b.label(`${t[0]}  (${nice(t[1])})`, A.x + 14 * u + (i % 2) * (A.w / 2), A.y + 194 * u + (i >> 1) * 20 * u, { size: 11.5, color: t[2] ? INK : GREY })); return; }
    const cw = (A.w - 16 * u) / 2, pass = (y0, hot, id) => PASSAGES.forEach((p, i) => { const x = A.x + 8 * u + (i % 2) * cw, y = y0 + (i >> 1) * 52 * u; b.box(x, y, cw - 8 * u, 46 * u, { fill: hot === i ? SEL : PAPER, color: INK, width: hot === i ? 3 : 1.2 }); wrap(b, p, x + 7 * u, y + 13 * u, cw - 24 * u, { size: 11 }); if (id) b.zone(id + i, x, y, cw - 8 * u, 46 * u); });
    if (s.round === 'twist') { const f = fetched(PHRASINGS[s.ph]); b.label('Ask it this way:', A.x + 8 * u, A.y + 8 * u, { size: 11, color: INK2 }); PHRASINGS.forEach((q, i) => card(b, 'q' + i, A.x + 8 * u, A.y + 18 * u + i * 32 * u, A.w - 16 * u, 27 * u, q, { size: 12.5, align: 'left', sel: s.ph === i, fill: s.ph === i ? SEL : PAPER })); b.label(f < 0 ? 'No passage shares a word with the question.' : 'Fetched: the highlighted passage.', A.x + 8 * u, A.y + 126 * u, { size: 12, color: f === 0 ? GOOD : WARM, bold: true }); pass(A.y + 138 * u, f, null); return; }
    const q = ASKED[Math.min(s.q, 2)]; ASKED.forEach((a, i) => { const y = A.y + 8 * u + i * 34 * u, g = s.got[i]; b.label(a[0], A.x + 8 * u, y + 6 * u, { size: 12.5, bold: i === s.q }); b.label(g < 0 ? `Book shut: “${a[2]}”` : g === a[1] ? `From the passage: “${PASSAGES[g]}”` : 'That passage does not say.', A.x + 18 * u, y + 21 * u, { size: 11, color: g < 0 ? INK2 : g === a[1] ? GOOD : WARM }); });
    b.label(s.q < 3 ? `Fetch a passage for: ${q[0]}` : 'All three answered from the book.', A.x + 8 * u, A.y + 118 * u, { size: 11, color: INK2 }); pass(A.y + 128 * u, s.q < 3 ? -1 : -1, s.q < 3 ? 'p' : null);
  },
  click(s, x, y, id) { if (s.round === 'twist' && id?.[0] === 'q') s.ph = +id.slice(1); else if (s.round === 'play' && id?.[0] === 'p' && s.q < 3) { const i = +id.slice(1); s.got[s.q] = i; if (i === ASKED[s.q][1]) s.q++; } },
  controls(s) { return s.round === 'case' ? [{ type: 'buttons', label: 'Rank the catalogue by', value: s.by, options: [{ label: 'loans last year', value: 'loans' }, { label: 'match to the question', value: 'match' }], set: (v) => { s.by = v; } }] : []; },
  meter(s) {
    if (s.round === 'case') return meterCount('Fetched titles that are about a snail', IV13.top3(s).filter((t) => t[2]).length, 3, s.by === 'loans' ? 'Fetching by loan count is the display again, under another name.' : '');
    if (s.round === 'twist') { const ok = fetched(PHRASINGS[s.ph]) === 0; return { label: 'Fetched the passage about the whistle', text: ok ? 'yes' : 'no', frac: ok ? 1 : 0, met: ok }; }
    return meterCount('Answers read from the right passage', s.got.filter((g, i) => g === ASKED[i][1]).length, 3);
  },
  demo(s) { if (s.round === 'case') s.by = 'match'; else if (s.round === 'twist') s.ph = PHRASINGS.findIndex((q) => fetched(q) === 0); else { s.got = ASKED.map((a) => a[1]); s.q = 3; } },
};

// ---------- IV-14 Think, act, look ----------
const TOOLS = [['Read the noticeboard', 'The notice is two years old. It says five o’clock.'], ['Open the timetable', 'Monday to Saturday: nine to five. Sunday: ask at the desk.'], ['Ask at the desk', 'On Sundays we close at one.']];
const READERS = ['a child of seven', 'a geology student', 'a part-time student', 'a reader from the town'];
const HAS = ['search the catalogue', 'ask what they like', 'new arrivals', 'the bestseller list'];
function agentRun(stop) { const log = []; let known = false; for (let i = 0; i < 12; i++) { if (stop && known) { log.push(['think', 'I have the answer. Stop.']); log.push(['answer', 'One o’clock.']); return { log, steps: log.filter((l) => l[0] === 'act').length + 1, right: true }; } const t = i % 2 === 0 ? 1 : 2; log.push(['think', t === 1 ? 'Check the timetable.' : 'The timetable says ask the desk.']); log.push(['act', TOOLS[t][0]]); log.push(['look', TOOLS[t][1]]); if (t === 2) known = true; } return { log, steps: 12, right: false }; }
export const IV14 = {
  id: 'IV-14', name: 'Think, act, look', short: 'Tools and agents',
  formula: 'think: write down what to do next\nact: use a tool, such as a search\nlook: read what came back, then think again',
  limit: 'An agent can only use the tools it was given, and it tends to reach for the one that worked before.',
  rounds: {
    play: { brief: 'You are the agent. Find out when the Stacks closes on a Sunday. Each tool tells you something. Not all of it can be trusted. Answer when you are sure.' },
    twist: { brief: 'Acted out. This agent thinks, acts and looks in turn, and has no rule for when to stop. Run it. Then give it one, and get the answer in four steps or fewer.' },
    case: { brief: 'Four readers each ask the library’s agent for “something good”. Ask for each of them and read what it does.' } },
  hints: { play: ['How old is the notice?', 'Timetable, then the desk, then answer.'], twist: ['Tick the box, then run it again.', 'It should check whether it already knows.'], case: ['Press all four.', 'Count the tools it used.'] },
  teach: ['Let the model write a thought, then take an action.', 'Feed back what the action returned.', 'Give it a way to tell when it is done.'],
  init(round) { if (round === 'case') return { round, tried: [], last: -1 }; if (round === 'twist') return { round, stop: false, ran: false, was: false }; return { round, log: [], said: null }; },
  draw(b, s, ctx) {
    b.clear(); b.fit(); const A = area(b), u = A.u, row = (kind, text, y) => { b.label(kind === 'think' ? 'thinks' : kind === 'act' ? 'acts' : kind === 'look' ? 'sees' : 'answers', A.x + 8 * u, y, { size: 10.5, color: kind === 'act' ? DATA[0] : kind === 'look' ? DATA[2] : kind === 'answer' ? WARM : INK2, bold: true }); b.label(text, A.x + 62 * u, y, { size: 12 }); };
    if (s.round === 'case') { const top = ctx.caseData.titles.top[0].name; b.label('Ask for', A.x + 8 * u, A.y + 8 * u, { size: 11, color: INK2 }); READERS.forEach((r, i) => card(b, 'r' + i, A.x + 8 * u + (i % 2) * (A.w / 2 - 4 * u), A.y + 18 * u + (i >> 1) * 36 * u, A.w / 2 - 12 * u, 30 * u, r, { size: 12, sel: s.last === i, fill: s.tried.includes(i) ? SEL : PAPER })); b.label('Its tools: ' + HAS.join(', '), A.x + 8 * u, A.y + 104 * u, { size: 11, color: INK2 }); if (s.last >= 0) [['think', `“Something good” for ${READERS[s.last]}. What is borrowed most?`], ['act', 'the bestseller list'], ['look', `1. ${top}`], ['answer', `Try “${top}”.`]].forEach(([k, t], i) => row(k, t, A.y + 130 * u + i * 24 * u)); return; }
    if (s.round === 'twist') { b.label('Question: when does the Stacks close on a Sunday?', A.x + 8 * u, A.y + 10 * u, { size: 12.5, bold: true }); if (!s.ran) { b.label('Not run yet.', A.x + 8 * u, A.y + 40 * u, { size: 12, color: INK2 }); return; } const q = agentRun(s.was), show = q.log.slice(0, 11); show.forEach(([k, t], i) => row(k, t, A.y + 34 * u + i * 21 * u)); if (q.log.length > 11) b.label(`… and round again, ${q.steps} steps in all, until it was stopped.`, A.x + 8 * u, A.y + 34 * u + 11 * 21 * u, { size: 12, color: WARM, bold: true }); return; }
    b.label('Question: when does the Stacks close on a Sunday?', A.x + 8 * u, A.y + 10 * u, { size: 12.5, bold: true }); const cw = (A.w - 16 * u) / 2; [...TOOLS.map((t) => t[0]), 'Answer'].forEach((t, i) => card(b, s.said || s.log.length >= 6 ? null : 'a' + i, A.x + 8 * u + (i % 2) * cw, A.y + 24 * u + (i >> 1) * 36 * u, cw - 6 * u, 30 * u, t, { size: 12.5, fill: i === 3 ? SEL : PAPER })); s.log.forEach(([k, t], i) => row(k, t, A.y + 116 * u + i * 22 * u)); if (s.said) b.label(s.said === 'right' ? 'Right. The desk knew.' : 'Not right. Press “Put it back” and try again.', A.x + 8 * u, A.y + 122 * u + s.log.length * 22 * u, { size: 12.5, bold: true, color: s.said === 'right' ? GOOD : WARM });
  },
  click(s, x, y, id) {
    if (s.round === 'case' && id?.[0] === 'r') { s.last = +id.slice(1); if (!s.tried.includes(s.last)) s.tried.push(s.last); return; }
    if (s.round !== 'play' || id?.[0] !== 'a' || s.said) return; const i = +id.slice(1);
    if (i < 3) { s.log.push(['act', TOOLS[i][0]]); s.log.push(['look', TOOLS[i][1]]); return; }
    const asked = s.log.some((l) => l[1] === TOOLS[2][0]), notice = s.log.some((l) => l[1] === TOOLS[0][0]); s.log.push(['answer', asked ? 'One o’clock.' : notice ? 'Five o’clock.' : 'I do not know.']); s.said = asked ? 'right' : 'wrong';
  },
  controls(s) { return s.round === 'twist' ? [{ type: 'toggle', label: 'Before each step, ask: do I already have the answer?', value: s.stop, set: (v) => { s.stop = v; } }, { type: 'button', go: true, label: 'Run the agent', run: () => { s.ran = true; s.was = s.stop; } }] : []; },
  meter(s) {
    if (s.round === 'case') { const all = s.tried.length === 4; return { label: 'Readers asked for', text: `${s.tried.length} of 4`, frac: s.tried.length / 4, met: all, note: all ? 'Four readers, one answer. It has four tools and used one.' : '' }; }
    if (s.round === 'twist') { if (!s.ran) return { label: 'Steps', text: 'not run yet', goal: 'the answer in four or fewer', frac: 0, met: false }; const q = agentRun(s.was), ok = q.right && q.steps <= 4; return { label: 'Steps', text: `${q.steps}` + (q.right ? ', and the right answer' : ', and no answer'), goal: 'the answer in four or fewer', frac: ok ? 1 : 0.2, met: ok }; }
    return { label: 'Your answer', text: s.said === 'right' ? 'one o’clock' : s.said ? 'not right' : 'none yet', frac: s.said === 'right' ? 1 : Math.min(0.6, s.log.length / 8), met: s.said === 'right', note: `tools used: ${s.log.filter((l) => l[0] === 'act').length}` };
  },
  demo(s) { if (s.round === 'case') { s.tried = [0, 1, 2, 3]; s.last = 3; } else if (s.round === 'twist') { s.stop = true; s.ran = true; s.was = true; } else { s.log = [['act', TOOLS[1][0]], ['look', TOOLS[1][1]], ['act', TOOLS[2][0]], ['look', TOOLS[2][1]], ['answer', 'One o’clock.']]; s.said = 'right'; } },
};

// ---------- IV-15 What the screen did ----------
const NAMES5 = ['A', 'B', 'C', 'D', 'E'];
const weekOf = (order, appeal, share) => { const out = [0, 0, 0, 0, 0]; order.forEach((t, slot) => { out[t] = Math.round(1000 * share[slot] * appeal[t]); }); return out; };
export const IV15 = {
  id: 'IV-15', name: 'What the screen did', short: 'Exposure and selection',
  formula: 'a loan is logged only for a title that was shown\nthe chance of being chosen depends on the slot as well as the title\nif you know the chance each title had of being shown, divide by it to undo the screen',
  limit: 'The correction needs the one thing the library did not keep: what was on the screen. And it cannot be applied to a title that was never shown at all.',
  rounds: {
    play: { brief: 'Five titles that readers like about equally, in five slots. Tap two slots to swap them. Move the title that started last to the top, run a week, and see who gets the most loans.' },
    twist: { brief: 'These five are not equally liked, and the weakest is on top. Raw loans mislead. Divide each count by its slot’s share of choices, then tap the title readers like best.' },
    case: { brief: 'The bars show how loans from a screen split across its five slots. The loans table has a blank column. Tap the name it should have had.' } },
  hints: { play: ['Tap slot 5, then slot 1, then run.', 'The loans follow the slot.'], twist: ['Tick the box and read the new bars.', 'Title E.'], case: ['What was never written down?', 'Shown.'] },
  teach: ['People can only choose from what they are shown.', 'Where a thing is shown changes how often it is chosen.', 'Record what was shown, and you can separate the screen from the taste.'],
  init(round, ctx) {
    const C = ctx.caseData;
    if (round === 'case') return { round, adult: C.slots.adult.slice(), child: C.slots.child.slice(), name: null, opts: ctx.rng(round).shuffle(['liked', 'shown', 'reserved', 'returned late']) };
    if (round === 'twist') return { round, share: C.slots.adult.slice(), appeal: [0.7, 0.9, 1.0, 1.2, 1.5], order: [0, 1, 2, 3, 4], fix: false, pick: -1 };
    return { round, share: C.slots.adult.slice(), appeal: [1.0, 1.02, 0.98, 1.01, 0.99], order: [0, 1, 2, 3, 4], sel: -1, last: null, first: null };
  },
  draw(b, s) {
    b.clear(); b.fit(); const A = area(b), u = A.u;
    if (s.round === 'case') { const bw = (A.w - 40 * u) / 11; b.label('Share of choices by slot, where a loan came from a screen', A.x + 8 * u, A.y + 10 * u, { size: 11, color: INK2 }); [s.adult, s.child].forEach((sh, k) => sh.forEach((v, i) => { const x = A.x + 14 * u + (k * 6 + i) * bw, h = v * 130 * u; b.box(x, A.y + 160 * u - h, bw - 5 * u, h, { fill: DATA[k] }); b.label(pct(v), x + (bw - 5 * u) / 2, A.y + 152 * u - h, { align: 'center', size: 10, mono: true }); b.label('slot ' + (i + 1), x + (bw - 5 * u) / 2, A.y + 170 * u, { align: 'center', size: 10 }); })); b.label('adult cards', A.x + 14 * u + 2.5 * bw, A.y + 186 * u, { align: 'center', size: 11, color: DATA[0] }); b.label('the children’s room', A.x + 14 * u + 8.5 * bw, A.y + 186 * u, { align: 'center', size: 11, color: DATA[1] });
      const y = A.y + 206 * u, cw = (A.w - 16 * u) / 5; ['reader', 'title', 'date', 'branch', s.name || '?'].forEach((h, i) => card(b, null, A.x + 8 * u + i * cw, y, cw - 4 * u, 26 * u, h, { size: 12, mono: true, bold: true, fill: i === 4 ? (s.name === 'shown' ? YES : s.name ? NO : SEL) : '#eee9da' })); s.opts.forEach((o, i) => card(b, 'o' + i, A.x + 8 * u + i * ((A.w - 16 * u) / 4), y + 40 * u, (A.w - 16 * u) / 4 - 6 * u, 30 * u, o, { size: 13, sel: s.name === o })); return; }
    const twist = s.round === 'twist', raw = twist ? weekOf(s.order, s.appeal, s.share) : s.last, lw = 150 * u; b.label('The screen', A.x + 8 * u, A.y + 8 * u, { size: 11, color: INK2 });
    s.order.forEach((t, slot) => card(b, twist ? null : 's' + slot, A.x + 8 * u, A.y + 18 * u + slot * 38 * u, lw, 32 * u, `slot ${slot + 1}:  title ${NAMES5[t]}`, { size: 12.5, align: 'left', sel: s.sel === slot, fill: s.sel === slot ? SEL : PAPER }));
    const x0 = A.x + lw + 40 * u, bw = (A.w - lw - 60 * u) / 5, base = A.y + 190 * u; b.label(twist ? (s.fix ? 'Loans, each divided by its slot’s share' : 'Loans last week, as counted') : raw ? 'Loans this week, by title' : 'No week run yet', x0, A.y + 8 * u, { size: 11, color: INK2 });
    if (raw) { const vals = twist && s.fix ? raw.map((v, t) => v / s.share[s.order.indexOf(t)]) : raw, mx = Math.max(...vals); vals.forEach((v, t) => { const h = (v / mx) * 140 * u, x = x0 + t * bw; b.box(x, base - h, bw - 8 * u, h, { fill: twist && s.pick === t ? WARM : DATA[t % 5] }); b.label(nice(Math.round(v)), x + (bw - 8 * u) / 2, base - h - 8 * u, { align: 'center', size: 10.5, mono: true }); if (!twist && s.first) b.label('was ' + s.first[t], x + (bw - 8 * u) / 2, base + 26 * u, { align: 'center', size: 10, color: INK2 }); if (twist) b.zone('t' + t, x, base - 150 * u, bw - 8 * u, 170 * u); b.label('title ' + NAMES5[t], x + (bw - 8 * u) / 2, base + 12 * u, { align: 'center', size: 11.5, bold: twist && s.pick === t }); }); }
  },
  click(s, x, y, id) {
    if (s.round === 'case' && id?.[0] === 'o') { s.name = s.opts[+id.slice(1)]; return; }
    if (s.round === 'twist' && id?.[0] === 't') { s.pick = +id.slice(1); return; }
    if (s.round === 'play' && id?.[0] === 's') { const k = +id.slice(1); if (s.sel < 0) s.sel = k; else { [s.order[s.sel], s.order[k]] = [s.order[k], s.order[s.sel]]; s.sel = -1; } }
  },
  controls(s) { if (s.round === 'play') return [{ type: 'button', go: true, label: 'Run a week', run: () => { s.last = weekOf(s.order, s.appeal, s.share); if (!s.first) s.first = weekOf([0, 1, 2, 3, 4], s.appeal, s.share); } }]; if (s.round === 'twist') return [{ type: 'toggle', label: 'Divide each count by its slot’s share of choices', value: s.fix, set: (v) => { s.fix = v; } }]; return []; },
  meter(s) {
    if (s.round === 'case') return { label: 'The blank column', text: s.name || 'no name yet', frac: s.name === 'shown' ? 1 : s.name ? 0.3 : 0, met: s.name === 'shown', note: s.name === 'shown' ? 'Every loan was logged as a reader’s choice. Whether the title had been on a screen was never written down.' : '' };
    if (s.round === 'twist') { const ok = s.fix && s.pick === 4; return { label: 'Your pick', text: s.pick < 0 ? 'nothing yet' : 'title ' + NAMES5[s.pick], goal: 'the best-liked title, with the correction on', frac: ok ? 1 : s.fix ? 0.5 : 0.2, met: ok }; }
    const top = s.last ? s.last.indexOf(Math.max(...s.last)) : -1, ok = top === 4; return { label: 'Most loans this week', text: s.last ? 'title ' + NAMES5[top] : 'no week run yet', goal: 'title E, which started in slot 5', frac: ok ? 1 : s.last ? 0.4 : 0, met: ok, note: ok ? 'Same book, same readers. Only the slot changed.' : '' };
  },
  demo(s) { if (s.round === 'case') s.name = 'shown'; else if (s.round === 'twist') { s.fix = true; s.pick = 4; } else { s.order = [4, 1, 2, 3, 0]; s.sel = -1; s.first = weekOf([0, 1, 2, 3, 4], s.appeal, s.share); s.last = weekOf(s.order, s.appeal, s.share); } },
};

// ---------- IV-16 A coin for privacy ----------
export const IV16 = {
  id: 'IV-16', name: 'A coin for privacy', short: 'Privacy by noise',
  formula: 'each person flips a coin in private: heads, answer truthfully; tails, say yes\nno single yes means anything\nacross the group: true share ≈ 2 × (share who said yes) − 1',
  limit: 'Privacy bought with noise is paid for in accuracy. Small groups pay most, and every extra question spends more of the budget.',
  rounds: {
    play: { brief: 'Forty pupils were asked if they skipped breakfast. Each flipped a coin first: heads, tell the truth; tails, say yes. Drag your guess of the true number until it explains the yeses.' },
    twist: { brief: 'A count is published twenty times with random noise added. Find a noise level big enough to hide one person, 2 or more, where sixteen of the twenty still land within 5 of the truth.' },
    case: { brief: 'The library could keep the missing column as counts per slot, with noise and no reader attached. Add enough noise to hide any one loan, and check the first slot’s share still reads the same.' } },
  hints: { play: ['Half of them said yes whatever the truth.', 'Line the two bars up.'], twist: ['Too little noise hides nobody. Too much hides the count.', 'About 2.'], case: ['The counts are in the thousands.', 'Noise of 2 or a little more.'] },
  teach: ['Let every answer be partly random, so no one answer gives a person away.', 'Undo the randomness across the whole group.', 'Decide how much accuracy the privacy is worth.'],
  two: { set: 'Ask a group a yes-or-no question, with a coin flip first.', solve: 'Work out the true share from the yeses.' },
  init(round, ctx) {
    const r = ctx.rng(round);
    if (round === 'case') { const sh = ctx.caseData.slots.adult, counts = sh.map((v) => Math.round(v * 12000)); return { round, counts, unit: R(5, () => laplace(1, r)), b: 0 }; }
    if (round === 'twist') { for (;;) { const unit = R(20, () => laplace(1, r)); if (unit.filter((x) => Math.abs(x * 2) <= 5).length >= 17) return { round, unit, b: 0.2, truth: r.int(30, 44) }; } }
    for (;;) { const truth = r.int(8, 18), yes = R(40, (i) => rrAnswer(i < truth, r)).filter(Boolean).length; if (yes >= 23 && Math.abs(rrEstimate(yes / 40) * 40 - truth) <= 4) return { round, truth, yes, g: 0 }; }
  },
  draw(b, s) {
    b.clear(); b.fit(660); const u = b.u;
    if (s.round === 'case') { const noisy = s.counts.map((c, i) => Math.max(0, c + s.unit[i] * s.b)), t0 = sum(s.counts), t1 = sum(noisy); b.view(-0.6, 4.6, 0, 0.6); b.axes({ xt: 0, xfmt: () => '', y: 'share of choices', yfmt: (v) => pct(v) }); s.counts.forEach((c, i) => { b.rect(i - 0.38, 0, 0.36, c / t0, { fill: DATA[0] }); b.rect(i + 0.02, 0, 0.36, noisy[i] / t1, { fill: DATA[1] }); b.text(pct(noisy[i] / t1, 1), i + 0.2, noisy[i] / t1, { dy: -10 * u, size: 10.5 }); b.text('slot ' + (i + 1), i, 0, { dy: 13 * u, size: 10.5 }); }); b.text('blue: exact counts   orange: published with noise', 2.6, 0.55, { size: 11, color: INK2 }); b.line(-0.4, 0.5, 4.4, 0.5, { color: INK2, width: 3 }); b.handle('b', -0.4 + (Math.log10(s.b + 1) / Math.log10(2001)) * 4.8, 0.5, { color: WARM, label: 'noise ' + (s.b < 10 ? s.b.toFixed(1) : Math.round(s.b)) }); return; }
    if (s.round === 'twist') { b.view(-1, 20, s.truth - 22, s.truth + 22); b.axes({ x: 'twenty publications of the same count', xt: 0, xfmt: () => '', y: 'published count' }); b.rect(-1, s.truth - 5, 21, 10, { fill: GOOD, alpha: 0.15, stroke: null }); b.line(-1, s.truth, 20, s.truth, { color: GOOD, width: 2 }); b.text('the true count: ' + s.truth, 16, s.truth, { dy: -10 * u, size: 11, color: GOOD }); s.unit.forEach((x, i) => { const v = clamp(s.truth + x * s.b, s.truth - 21, s.truth + 21); b.dot(i, v, { color: Math.abs(x * s.b) <= 5 ? DATA[0] : DATA[1], r: 5 }); }); return; }
    const pred = 20 + s.g / 2; b.view(-0.6, 1.6, 0, 44); b.axes({ xt: 0, xfmt: () => '', y: 'pupils who said yes' }); b.rect(-0.3, 0, 0.6, s.yes, { fill: DATA[0] }); b.text(`said yes: ${s.yes} of 40`, 0, s.yes, { dy: -10 * u, bold: true }); b.rect(0.7, 0, 0.6, 20, { fill: GREY }); b.rect(0.7, 20, 0.6, s.g / 2, { fill: DATA[1] }); b.text(`your guess predicts ${pred % 1 ? pred.toFixed(1) : pred}`, 1, pred, { dy: -10 * u, bold: true }); b.text('20 said yes on tails', 1, 10, { size: 10.5, color: '#fff' }); b.line(-0.5, 42, 1.5, 42, { color: INK2, width: 3 }); b.handle('g', -0.5 + (s.g / 40) * 2, 42, { color: WARM, label: `your guess: ${s.g} skipped breakfast` });
  },
  drag(s, id, x) { if (id === 'g') s.g = clamp(Math.round(((x + 0.5) / 2) * 40), 0, 40); else if (id === 'b') { const v = Math.pow(2001, clamp((x + 0.4) / 4.8, 0, 1)) - 1; s.b = v < 10 ? Math.round(v * 10) / 10 : Math.round(v); } },
  controls(s) { return s.round === 'twist' ? [{ type: 'slider', label: 'Size of the noise', min: 0.2, max: 8, step: 0.2, value: s.b, set: (v) => { s.b = v; }, show: (v) => v.toFixed(1) }] : []; },
  meter(s) {
    if (s.round === 'case') { const noisy = s.counts.map((c, i) => Math.max(0, c + s.unit[i] * s.b)), shift = Math.abs(noisy[0] / sum(noisy) - s.counts[0] / sum(s.counts)), ok = s.b >= 2 && shift <= 0.01; return { label: 'First slot’s share has moved by', text: pct(shift, 2), goal: 'noise 2 or more, moved under 1 point', frac: ok ? 1 : s.b >= 2 ? 0.5 : 0.2, met: ok, note: s.b < 2 ? 'Not enough noise to hide a single loan.' : ok ? 'No reader is named anywhere in these counts.' : 'Too much: the counts no longer say anything.' }; }
    if (s.round === 'twist') { const k = s.unit.filter((x) => Math.abs(x * s.b) <= 5).length, ok = s.b >= 2 && k >= 16; return { label: 'Within 5 of the truth', text: `${k} of 20`, goal: 'noise 2 or more, and 16 of 20', frac: ok ? 1 : s.b >= 2 ? (k / 20) * 0.8 : 0.3, met: ok, note: s.b < 2 ? 'One person joining or leaving would still show.' : '' }; }
    const gap = Math.abs(20 + s.g / 2 - s.yes), ok = gap <= 0.5; return { label: 'Gap between the bars', text: gap.toFixed(1) + ' pupils', goal: 'half a pupil or less', frac: ok ? 1 : clamp(1 - gap / 8, 0, 0.9), met: ok, note: ok ? `Your estimate: ${s.g}. The truth, which nobody had to own up to: ${s.truth}.` : '' };
  },
  demo(s) { if (s.round === 'case') s.b = 3; else if (s.round === 'twist') s.b = 2; else s.g = clamp((s.yes - 20) * 2, 0, 40); },
};

// ---------- IV-17 What is this unit for? ----------
const KINDS = ['gardening books', 'picture books', 'books with long titles', 'books returned late'];
const ANG = [0, 0.785, 1.571, 2.356];
function dictionary(pts, k) { const unit = pts.map((p) => { const n = Math.hypot(p[0], p[1]) || 1; return [p[0] / n, p[1] / n]; }); let cents = [unit[0]]; while (cents.length < k) { let far = 0, fd = -1; unit.forEach((p, i) => { const d = Math.min(...cents.map((c) => 1 - (p[0] * c[0] + p[1] * c[1]))); if (d > fd) { fd = d; far = i; } }); cents.push(unit[far]); } let lab = []; for (let it = 0; it < 12; it++) { lab = unit.map((p) => { let bi = 0, bs = -2; cents.forEach((c, j) => { const d = p[0] * c[0] + p[1] * c[1]; if (d > bs) { bs = d; bi = j; } }); return bi; }); cents = cents.map((c, j) => { const m = unit.filter((_, i) => lab[i] === j); if (!m.length) return c; const x = mean(m.map((p) => p[0])), y = mean(m.map((p) => p[1])), n = Math.hypot(x, y) || 1; return [x / n, y / n]; }); } return { cents, lab }; }
export const IV17 = {
  id: 'IV-17', name: 'What is this unit for?', short: 'Looking inside a network',
  formula: 'a network has fewer units than things it keeps track of, so one unit answers to several\ntrain a second, sparse network to rewrite a layer’s activity as a longer list of features\nturn a feature up and see what changes',
  limit: 'A feature’s name is a person’s reading of what sets it off. Features are found for part of what a network does, not all of it.',
  rounds: {
    play: { brief: 'One unit inside Marginalia, and how strongly it answers to twelve titles. It answers to two kinds of book that have nothing to do with each other. Tap the two kinds.' },
    twist: { brief: 'Two units, four kinds of book: too few units, so the kinds overlap. Lengthen the list of features until every kind has a feature of its own.' },
    case: { brief: 'Three features found inside Marginalia 3. Turn each one up and watch what it suggests. Then tap the right name for feature 3.' } },
  hints: { play: ['Look for the tall bars.', 'Gardening, and returned late.'], twist: ['As many features as kinds.', 'Four.'], case: ['Compare its list with last month’s screen.', 'It tracks what was on a screen.'] },
  teach: ['Record what a layer does on many inputs.', 'Rewrite that activity as a longer, sparser list of features.', 'Name a feature by what sets it off, and test the name by turning it up.'],
  init(round, ctx) {
    const r = ctx.rng(round);
    if (round === 'case') { const C = ctx.caseData, top = C.titles.top; return { round, up: -1, name: null, opts: r.shuffle(['how good the book is', 'was on a screen last month', 'has a long title', 'is a new arrival']), screen: top.slice(0, 5).map((t) => t.name), kids: top.filter((t) => t.subject === 'Picture books').slice(0, 5).map((t) => t.name), long: top.slice().sort((a, c) => c.name.length - a.name.length).slice(0, 5).map((t) => t.name), weight: [0.02, 0.01, C.importance.lastMonth] }; }
    if (round === 'twist') { const pts = []; for (let i = 0; i < 32; i++) { const k = i % 4, m = r.range(0.6, 1.3), a = ANG[k] + r.n(0, 0.07); pts.push([Math.cos(a) * m, Math.sin(a) * m, k]); } return { round, pts, k: 2 }; }
    const order = r.shuffle(R(12, (i) => i % 4)); return { round, items: order.map((k) => [k, (k === 0 || k === 3 ? 0.9 : 0.1) + r.range(-0.07, 0.07)]), picks: [] };
  },
  own(s) { const q = dictionary(s.pts, s.k); return [0, 1, 2, 3].filter((kind) => q.cents.some((_, j) => { const m = s.pts.filter((_, i) => q.lab[i] === j); return m.length && m.every((p) => p[2] === kind); })).length; },
  draw(b, s) {
    b.clear();
    if (s.round === 'twist') { const q = dictionary(s.pts, s.k); b.fit(660); b.view(-2.1, 2.1, -0.3, 1.7, true); b.axes({ x: 'unit one', y: 'unit two', xt: 0, yt: 0, xfmt: () => '', yfmt: () => '' }); q.cents.forEach((c) => b.line(0, 0, c[0] * 1.5, c[1] * 1.5, { color: WARM, width: 3 })); s.pts.forEach((p) => b.dot(p[0], p[1], { color: DATA[p[2]], shape: SHAPES[p[2]], r: 5 })); KINDS.forEach((k, i) => b.text(k, Math.cos(ANG[i]) * 1.5, Math.sin(ANG[i]) * 1.4 + 0.12, { size: 10.5, color: DATA[i] })); return; }
    b.fit(); const A = area(b), u = A.u;
    if (s.round === 'case') { const names = ['feature 1', 'feature 2', 'feature 3'], list = s.up === 0 ? s.kids : s.up === 1 ? s.long : s.up === 2 ? s.screen : null; names.forEach((n, i) => { const y = A.y + 12 * u + i * 34 * u; card(b, 'f' + i, A.x + 8 * u, y, 150 * u, 28 * u, `turn up ${n}`, { size: 12, sel: s.up === i, fill: s.up === i ? SEL : PAPER }); b.box(A.x + 170 * u, y + 6 * u, Math.max(3 * u, s.weight[i] * 220 * u), 16 * u, { fill: DATA[i] }); b.label(`${pct(s.weight[i])} of what decides its picks`, A.x + 178 * u + s.weight[i] * 220 * u, y + 14 * u, { size: 10.5 }); });
      const y0 = A.y + 124 * u; b.label(list ? 'With it turned up, Marginalia suggests' : 'Turn a feature up.', A.x + 8 * u, y0, { size: 11, color: INK2 }); b.label('Last month’s screen', A.x + A.w / 2 + 8 * u, y0, { size: 11, color: INK2 }); for (let i = 0; i < 5; i++) { if (list) b.label(`${i + 1}. ${list[i] || ''}`.slice(0, 40), A.x + 8 * u, y0 + 18 * u + i * 18 * u, { size: 11 }); b.label(`${i + 1}. ${s.screen[i]}`.slice(0, 40), A.x + A.w / 2 + 8 * u, y0 + 18 * u + i * 18 * u, { size: 11 }); }
      b.label('Feature 3 is:', A.x + 8 * u, y0 + 122 * u, { size: 11, color: INK2 }); s.opts.forEach((o, i) => card(b, 'o' + i, A.x + 8 * u + (i % 2) * (A.w / 2 - 4 * u), y0 + 132 * u + (i >> 1) * 32 * u, A.w / 2 - 12 * u, 27 * u, o, { size: 11.5, sel: s.name === o, fill: s.name === o ? (o === 'was on a screen last month' ? YES : NO) : PAPER })); return; }
    const bw = (A.w - 16 * u) / 12; b.label('How strongly the unit answers', A.x + 8 * u, A.y + 8 * u, { size: 11, color: INK2 }); s.items.forEach(([k, v], i) => { const x = A.x + 8 * u + i * bw, h = v * 110 * u; b.box(x + 3 * u, A.y + 136 * u - h, bw - 6 * u, h, { fill: DATA[k] }); b.mark(x + bw / 2, A.y + 148 * u, 5 * u, SHAPES[k], DATA[k], INK); });
    KINDS.forEach((k, i) => { const on = s.picks.includes(i), x = A.x + 8 * u + (i % 2) * (A.w / 2 - 4 * u), y = A.y + 170 * u + (i >> 1) * 38 * u; card(b, 'k' + i, x, y, A.w / 2 - 12 * u, 32 * u, '     ' + k, { size: 12.5, align: 'left', sel: on, fill: on ? (i === 0 || i === 3 ? YES : NO) : PAPER }); b.mark(x + 14 * u, y + 16 * u, 6 * u, SHAPES[i], DATA[i], INK); });
  },
  click(s, x, y, id) { if (s.round === 'case' && id?.[0] === 'f') s.up = +id.slice(1); else if (s.round === 'case' && id?.[0] === 'o') s.name = s.opts[+id.slice(1)]; else if (s.round === 'play' && id?.[0] === 'k') { const i = +id.slice(1); s.picks = s.picks.includes(i) ? s.picks.filter((k) => k !== i) : [...s.picks, i].slice(-2); } },
  controls(s) { return s.round === 'twist' ? [{ type: 'slider', label: 'Features in the list', min: 2, max: 6, step: 1, value: s.k, set: (v) => { s.k = v; } }] : []; },
  meter(s) {
    if (s.round === 'case') { const ok = s.name === 'was on a screen last month'; return { label: 'Feature 3', text: s.name || 'no name yet', frac: ok ? 1 : s.name ? 0.3 : s.up >= 0 ? 0.15 : 0, met: ok, note: ok ? 'What Marginalia learned best was its own display from the month before.' : '' }; }
    if (s.round === 'twist') return meterCount('Kinds with a feature of their own', IV17.own(s), 4, `two units, ${s.k} features`);
    const ok = s.picks.length === 2 && s.picks.includes(0) && s.picks.includes(3); return { label: 'Kinds picked', text: `${s.picks.length} of 2`, goal: 'the two it answers to', frac: ok ? 1 : s.picks.filter((p) => p === 0 || p === 3).length * 0.4, met: ok, note: ok ? 'One unit, two jobs.' : '' };
  },
  demo(s) { if (s.round === 'case') { s.up = 2; s.name = 'was on a screen last month'; } else if (s.round === 'twist') { for (const k of [4, 5, 6]) { s.k = k; if (IV17.own(s) === 4) return; } } else s.picks = [0, 3]; },
};

export const PART4B = [IV10, IV11, IV12, IV13, IV14, IV15, IV16, IV17];
