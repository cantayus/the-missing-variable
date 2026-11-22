// Part IV, summer. Instruments IV-1 to IV-9.
import { DATA, INK, INK2, GREY, PALE, GOOD, WARM, nice, pct, clamp, sum, mean, R, meterTo, meterCount, area, card, wrap } from './lib.js';
import { letters, octavo, next, generate, say } from '../octavo.js';
import { bpeInit, bpePairs, bpeBest, bpeMerge, bpeTrain, bpeEncode } from '../algo/text.js';
import { cosine } from '../algo/cluster.js';
import { FIELDS, SUBJECTS } from '../sim/model.js';
import { RNG } from '../core/rng.js';

const memo = (m, k, f) => { if (!m.has(k)) { if (m.size > 300) m.clear(); m.set(k, f()); } return m.get(k); };
const PAPER = '#fffdf5', YES = '#cfeadb', NO = '#fbe0d6', SEL = '#ffe9a8';

// ---------- IV-1 Guess the next letter ----------
const HIDDEN = ['the mill whistle blew at six and the whole town looked up', 'pip wanted the book about the snail and the lighthouse', 'the river ran brown in spring and green in summer'];
const YOURS = ['thank you very much', 'once upon a time', 'see you tomorrow'];
const ABC = 'abcdefghijklmnopqrstuvwxyz ';
const gcache = new Map();
const guessesFor = (t, order) => memo(gcache, order + t, () => { const L = letters(); return [...t].map((ch, i) => L.rank(t.slice(0, i), order).indexOf(ch) + 1); });
export const IV1 = {
  id: 'IV-1', name: 'Guess the next letter', short: 'Language as prediction',
  formula: 'surprise of a letter = log2(1 / its chance), counted in bits\nentropy = the average surprise\nn-gram model: guess the next symbol from the n − 1 before it',
  limit: 'A text that is easy to predict is not a better text. Low surprise only says there was little left to find out.',
  rounds: {
    play: { brief: 'The machine guesses a sentence it cannot see, one letter at a time, likeliest first. Choose how many earlier letters it may look at, until it needs under half the guesses it needed with none.' },
    twist: { brief: 'Your turn. Tap a letter to guess what comes next. Wrong letters grey out. Finish the phrase, then compare your count with the machine’s.' },
    case: { brief: 'How hard is a reader’s next loan to guess? Each yes-or-no question halves the titles left. Set the dial to the fewest questions that pin down a loan in year six.' } },
  hints: { play: ['With no memory it can only use how common each letter is.', 'Let it look at three.'], twist: ['After “q” comes “u”. After “th” comes “e” more often than not.', 'Folio can finish it.'], case: ['Seven questions tell apart 128 titles. Eight tell apart 256.', 'Eight.'] },
  teach: ['Guess what comes next from what came before.', 'Count how often you are surprised: that is the entropy.', 'A longer memory means fewer surprises.'],
  two: { set: 'Think of a sentence and keep it hidden.', solve: 'Guess it one letter at a time. Count the guesses.' },
  init(round, ctx) {
    const r = ctx.rng(round);
    if (round === 'case') { const g = ctx.caseData.guess; return { round, q: 14, first: g.bitsFirst, last: g.bitsLast }; }
    if (round === 'twist') return { round, t: r.pick(YOURS), pos: 0, wrong: [], mine: 0 };
    const ok = HIDDEN.filter((t) => mean(guessesFor(t, 3)) < mean(guessesFor(t, 0)) / 2);
    return { round, t: r.pick(ok.length ? ok : HIDDEN), order: 0 };
  },
  draw(b, s) {
    b.clear(); b.fit(); const A = area(b), u = A.u;
    if (s.round === 'case') {
      const row = (y, name, bits, col) => { b.label(name, A.x + 8 * u, y, { bold: true }); b.box(A.x + 8 * u, y + 12 * u, (A.w - 30 * u) * (bits / 14), 18 * u, { fill: col }); b.label(`${bits.toFixed(1)} bits: as open as a fair pick from ${nice(Math.round(2 ** bits))} titles`, A.x + 8 * u, y + 42 * u, { size: 11.5 }); };
      row(A.y + 20 * u, 'Year one', s.first, DATA[0]); row(A.y + 86 * u, 'Year six', s.last, DATA[1]);
      b.label('Your questions', A.x + 8 * u, A.y + 164 * u, { bold: true });
      for (let i = 0; i < 14; i++) b.mark(A.x + 20 * u + i * ((A.w - 60 * u) / 14), A.y + 190 * u, 9 * u, 'circle', i < s.q ? DATA[2] : PAPER, INK);
      b.label(`${s.q} questions tell apart ${nice(2 ** s.q)} titles`, A.x + 8 * u, A.y + 218 * u, { size: 12 });
      b.view(0, 14, 0, 1); b.pad = { l: 30, r: 40, t: b.h / b.u - 60, b: 30 }; b.line(0, 0.5, 14, 0.5, { color: INK2, width: 3 }); b.handle('q', s.q, 0.5, { color: WARM, label: 'questions: ' + s.q }); b.pad = { l: 46, r: 18, t: 18, b: 38 }; return;
    }
    const per = Math.max(8, Math.floor((A.w - 16 * u) / (22 * u))), cell = (i) => [A.x + 8 * u + (i % per) * 22 * u, A.y + 26 * u + Math.floor(i / per) * (s.round === 'twist' ? 34 : 88) * u];
    if (s.round === 'play') {
      const g = guessesFor(s.t, s.order); b.label('What it had to guess, and how many tries each letter took', A.x + 8 * u, A.y + 8 * u, { size: 11, color: INK2 });
      [...s.t].forEach((ch, i) => { const [x, y] = cell(i), h = Math.max(2 * u, (g[i] / 27) * 40 * u); b.box(x, y, 19 * u, 22 * u, { fill: PAPER, color: INK }); b.label(ch === ' ' ? '␣' : ch, x + 9.5 * u, y + 11 * u, { align: 'center', size: 13, mono: true }); b.box(x + 3 * u, y + 26 * u, 13 * u, h, { fill: g[i] === 1 ? GOOD : g[i] <= 3 ? DATA[0] : DATA[1] }); b.label(String(g[i]), x + 9.5 * u, y + 34 * u + h, { align: 'center', size: 9, mono: true }); });
      return;
    }
    b.label('The phrase', A.x + 8 * u, A.y + 8 * u, { size: 11, color: INK2 });
    [...s.t].forEach((ch, i) => { const [x, y] = cell(i), open = i < s.pos; b.box(x, y, 19 * u, 24 * u, { fill: i === s.pos ? SEL : PAPER, color: INK }); b.label(open ? (ch === ' ' ? '␣' : ch) : i === s.pos ? '?' : '', x + 9.5 * u, y + 12 * u, { align: 'center', size: 14, mono: true }); });
    const y0 = A.y + 26 * u + (Math.floor((s.t.length - 1) / per) + 1) * 34 * u + 20 * u, cw = Math.min(40 * u, (A.w - 16 * u) / 9);
    [...ABC].forEach((ch, k) => card(b, s.pos < s.t.length ? 'k' + k : null, A.x + 8 * u + (k % 9) * cw, y0 + Math.floor(k / 9) * 38 * u, cw - 5 * u, 32 * u, ch === ' ' ? 'space' : ch, { size: ch === ' ' ? 10 : 15, mono: ch !== ' ', fill: s.wrong.includes(ch) ? '#e4e0d4' : PAPER, ink: s.wrong.includes(ch) ? GREY : INK }));
  },
  click(s, x, y, id) { if (s.round !== 'twist' || id?.[0] !== 'k' || s.pos >= s.t.length) return; const ch = ABC[+id.slice(1)]; if (ch === s.t[s.pos]) { s.mine++; s.pos++; s.wrong = []; } else if (!s.wrong.includes(ch)) { s.wrong.push(ch); s.mine++; } },
  drag(s, id, x) { if (id === 'q') s.q = clamp(Math.round(x), 0, 14); },
  controls(s) { return s.round === 'play' ? [{ type: 'buttons', label: 'Earlier letters it may look at', value: s.order, options: [0, 1, 2, 3].map((v) => ({ label: v ? String(v) : 'none', value: v })), set: (v) => { s.order = v; } }] : []; },
  meter(s) {
    if (s.round === 'case') { const need = Math.ceil(s.last), ok = s.q === need; return { label: 'Yes-or-no questions', text: String(s.q), goal: 'the fewest that pin down a year-six loan', frac: ok ? 1 : s.q > need ? 0.6 : 0.3, met: ok, note: s.q < need ? 'Not enough to tell the titles apart.' : `A loan in year one needed ${Math.ceil(s.first)}.` }; }
    if (s.round === 'twist') { const done = s.pos >= s.t.length; return { label: 'Letters found', text: `${s.pos} of ${s.t.length}`, frac: s.pos / s.t.length, met: done, note: `your guesses so far: ${s.mine}` + (done ? `. The machine, looking back three letters, needed ${sum(guessesFor(s.t, 3))}.` : '') }; }
    const base = mean(guessesFor(s.t, 0)); return meterTo('Guesses per letter', mean(guessesFor(s.t, s.order)), base / 2, { lower: true, from: base, fmt: (v) => v.toFixed(1), note: `with no memory: ${base.toFixed(1)}` });
  },
  demo(s) { if (s.round === 'case') s.q = Math.ceil(s.last); else if (s.round === 'twist') { s.pos = s.t.length; s.wrong = []; s.mine = sum(guessesFor(s.t, 3)); } else s.order = 3; },
};

// ---------- IV-2 Words as places ----------
const SENT = ['the cat sleeps on the warm mat', 'the dog sleeps on the warm rug', 'a cat chases the grey mouse', 'a dog chases the red ball', 'the cat climbs the tree', 'the dog digs up the garden',
  'rain falls on the roof all night', 'snow falls on the roof all winter', 'cold rain soaks the road', 'cold snow covers the road', 'rain fills the pond', 'snow hides the path',
  'she reads a long novel by the fire', 'he reads a long atlas by the fire', 'the novel sits on the shelf', 'the atlas sits on the shelf', 'the novel made her cry', 'the atlas shows the coast',
  'bread and cheese for lunch', 'bread and butter for lunch', 'she cuts the cheese', 'she spreads the butter', 'cheese from the farm', 'butter melts in the pan',
  'the owl flies at night', 'the bat flies at night', 'the moth flies at night', 'an owl hides in the barn', 'a bat hides in the barn', 'a moth hides in the barn',
  'she hits the ball with a racket', 'she hits the ball with a bat', 'she hits the ball with a paddle', 'he swings the racket hard', 'he swings the bat hard', 'he swings the paddle hard'].map((t) => t.split(' '));
const VOCAB = [...new Set(SENT.flat())], PAIRS = [['cat', 'dog'], ['rain', 'snow'], ['novel', 'atlas'], ['cheese', 'butter']], TWO = ['owl', 'moth', 'bat', 'racket', 'paddle', 'cat', 'rain'];
const vcache = new Map();
const company = (word, w) => memo(vcache, word + w, () => { const v = VOCAB.map(() => 0); for (const t of SENT) t.forEach((x, i) => { if (x !== word) return; for (let j = Math.max(0, i - w); j <= Math.min(t.length - 1, i + w); j++) if (j !== i) v[VOCAB.indexOf(t[j])]++; }); return v; });
const nearest = (word, list, w) => { let best = null, bc = 0; for (const y of list) if (y !== word) { const c = cosine(company(word, w), company(y, w)); if (c > bc) { bc = c; best = y; } } return best; };
export const IV2 = {
  id: 'IV-2', name: 'Words as places', short: 'Word vectors',
  formula: 'for each word, count the words that turn up near it\nthat list of counts is the word’s position\nwords that keep the same company end up close together',
  limit: 'A word gets one place, however many meanings it has. And a word seen only a few times is placed by guesswork.',
  rounds: {
    play: { brief: 'Thirty-six short sentences. The machine knows no meanings. It only counts which words sit near which. Widen the window it counts in, until each word’s nearest neighbour is its partner.' },
    twist: { brief: 'Across: how much company a word shares with “racket”. Up: with “owl”. One word keeps both kinds of company. Tap dots to read them, and find it.' },
    case: { brief: 'Marginalia places a title by the reading lists it appears in. Each dot is one try at placing the same title. Drag the number of lists until the tries agree.' } },
  hints: { play: ['With a window of nothing, every word looks the same.', 'One word either side is enough.'], twist: ['Look for a dot that is high and far to the right.', 'It flies at night and hits a ball.'], case: ['Few lists, scattered tries.', 'About fifty lists.'] },
  teach: ['Slide a window along the text and note which words appear together.', 'Give each word a position from those counts.', 'Close together means “used in the same way”, which is often “means something similar”.'],
  init(round, ctx) { const r = ctx.rng(round); if (round === 'case') return { round, n: 2, seed: r.int(1, 1e6), median: ctx.caseData.titles.medianLast }; if (round === 'twist') return { round, pick: null, seen: [] }; return { round, w: 0 }; },
  spread(s) { const r = new RNG(s.seed), pts = R(14, () => [r.n(0, 1), r.n(0, 1)]), k = 1 / Math.sqrt(s.n); return { pts: pts.map((p) => [p[0] * k, p[1] * k]), sd: Math.sqrt(mean(pts.map((p) => p[0] * p[0] + p[1] * p[1]))) * k }; },
  draw(b, s) {
    b.clear(); b.fit(); const A = area(b), u = A.u;
    if (s.round === 'case') { const q = IV2.spread(s); b.view(-1.6, 1.6, -1.3, 1.3, true); b.axes({ xt: 0, yt: 0, xfmt: () => '', yfmt: () => '', grid: false }); b.circle(0, 0, 0.3, { color: GOOD, dash: [4, 4] }); b.text('where it belongs', 0, 0.3, { dy: -10 * u, size: 10.5, color: GOOD }); q.pts.forEach((p) => b.dot(clamp(p[0], -1.55, 1.55), clamp(p[1], -1.25, 1.25), { color: DATA[1], r: 5 })); b.view(0, 1, 0, 1); b.pad = { l: 40, r: 40, t: b.h / b.u - 56, b: 28 }; b.line(0, 0.5, 1, 0.5, { color: INK2, width: 3 }); b.handle('n', Math.log(s.n) / Math.log(200), 0.5, { color: WARM, label: `appears in ${s.n} ${s.n === 1 ? 'list' : 'lists'}` }); b.pad = { l: 46, r: 18, t: 18, b: 38 }; return; }
    if (s.round === 'twist') { b.view(-0.05, 1.12, -0.05, 1.12); b.axes({ x: 'shares company with “racket”', y: 'shares company with “owl”', xt: 5, yt: 5 }); TWO.forEach((wd, i) => { const x = cosine(company(wd, 2), company('racket', 2)), y = cosine(company(wd, 2), company('owl', 2)), open = wd === 'owl' || wd === 'racket' || s.seen.includes(wd); b.handle('w' + i, x, y, { color: s.pick === wd ? WARM : DATA[0], r: 8, label: open ? wd : '' }); }); return; }
    const words = PAIRS.flat(), cw = (A.w - 16 * u) / 4; b.label('Each word, and the word that keeps the most similar company', A.x + 8 * u, A.y + 8 * u, { size: 11, color: INK2 });
    words.forEach((wd, i) => { const nn = s.w ? nearest(wd, words, s.w) : null, ok = nn === PAIRS[i >> 1][1 - (i & 1)], x = A.x + 8 * u + (i % 4) * cw, y = A.y + 30 * u + (i >> 2) * 70 * u; card(b, null, x, y, cw - 8 * u, 54 * u, wd + '\n' + (nn ? '→ ' + nn : '→ ?'), { size: 13, fill: ok ? YES : PAPER, bold: true }); });
    const t = SENT[0], y = A.y + 200 * u; b.label('The window, on one sentence:', A.x + 8 * u, y, { size: 11, color: INK2 }); let x = A.x + 8 * u; t.forEach((wd, i) => { const inWin = i !== 1 && Math.abs(i - 1) <= s.w; b.font(13, false, i === 1); const wpx = b.g.measureText(wd).width + 12 * u; b.box(x, y + 12 * u, wpx, 24 * u, { fill: i === 1 ? SEL : inWin ? YES : PAPER, color: INK }); b.label(wd, x + 6 * u, y + 24 * u, { size: 13, bold: i === 1 }); x += wpx + 4 * u; });
  },
  click(s, x, y, id) { if (s.round === 'twist' && id?.[0] === 'w') { s.pick = TWO[+id.slice(1)]; if (!s.seen.includes(s.pick)) s.seen.push(s.pick); } },
  drag(s, id, x) { if (id === 'n') s.n = clamp(Math.round(Math.pow(200, clamp(x, 0, 1))), 1, 200); },
  controls(s) { return s.round === 'play' ? [{ type: 'buttons', label: 'Words counted on each side', value: s.w, options: [0, 1, 2, 3].map((v) => ({ label: v ? String(v) : 'none', value: v })), set: (v) => { s.w = v; } }] : []; },
  meter(s) {
    if (s.round === 'case') return meterTo('How far the tries scatter', IV2.spread(s).sd, 0.2, { lower: true, from: 1.4, fmt: (v) => v.toFixed(2), note: `The middle title at the Common Shelf was borrowed ${s.median} times last year.` });
    if (s.round === 'twist') return { label: 'Your pick', text: s.pick || 'nothing yet', goal: 'the word with two kinds of company', frac: s.pick === 'bat' ? 1 : s.pick ? 0.3 : 0, met: s.pick === 'bat', note: s.pick === 'bat' ? 'One word, two meanings, one place on the map.' : '' };
    const words = PAIRS.flat(), k = s.w ? PAIRS.filter(([a, c]) => nearest(a, words, s.w) === c && nearest(c, words, s.w) === a).length : 0; return meterCount('Pairs that found each other', k, 4);
  },
  demo(s) { if (s.round === 'case') s.n = 60; else if (s.round === 'twist') { s.pick = 'bat'; if (!s.seen.includes('bat')) s.seen.push('bat'); } else s.w = 2; },
};

// ---------- IV-3 Pieces of words ----------
const pieces = (w, n) => { const out = new Set(); if (n === 1) { for (const ch of w) out.add(ch); return out; } const t = '<' + w + '>'; for (let i = 0; i + n <= t.length; i++) out.add(t.slice(i, i + n)); return out; };
const shared = (a, c, n) => { const A = pieces(a, n), B = pieces(c, n); let k = 0; for (const x of A) if (B.has(x)) k++; return { k, j: k / (A.size + B.size - k || 1) }; };
const NEWWORDS = [['unsnackable', ['snack', 'unlockable', 'table', 'unhappy', 'snail', 'breakable']], ['bookishness', ['book', 'foolishness', 'business', 'bookshelf', 'kindness', 'fish']], ['rereadable', ['read', 'reread', 'readable', 'table', 'bread', 'ready']]];
const flat = (t) => t.toLowerCase().replace(/[^a-z ]/g, '');
export const IV3 = {
  id: 'IV-3', name: 'Pieces of words', short: 'Subword features',
  formula: 'cut each word into overlapping pieces of a few letters\nthe word’s position = the sum of its pieces’ positions\na new word built from known pieces gets a place at once',
  limit: 'Pieces carry spelling, not meaning. Words that look alike are placed together whether or not they have anything to do with each other.',
  rounds: {
    play: { brief: 'A word nobody has seen before, cut into pieces of three letters. Tap a known word to see how many pieces it shares. Find the one that shares the most.' },
    twist: { brief: '“listen” and “silent” use the same letters. Choose a piece length where they stop looking alike, while “listen” and “listening” still do.' },
    case: { brief: 'Pip’s book has hardly any loans, so Marginalia cannot place it. Place it by its parts. Tap the well-known title that shares the most pieces with its name.' } },
  hints: { play: ['Look for long runs of the same letters.', 'Folio can pick it.'], twist: ['Pieces of one letter cannot tell the order.', 'Two or three.'], case: ['Read the middle of each title.', 'Folio can pick it.'] },
  teach: ['Break a word into small overlapping pieces.', 'Learn a position for each piece, not each word.', 'Any new word can then be placed from its pieces.'],
  init(round, ctx) {
    const r = ctx.rng(round); if (round === 'twist') return { round, n: 1 };
    if (round === 'case') { const C = ctx.caseData; return { round, word: C.pip.name, list: C.baskets.items.slice(0, 8), pick: -1, loans: C.baskets.items.slice(0, 8).map((nm) => C.titles.top.find((t) => t.name === nm)?.last ?? null) }; }
    const ok = NEWWORDS.filter(([w, l]) => { const k = l.map((x) => shared(w, x, 3).k); return k.filter((v) => v === Math.max(...k)).length === 1; }), [word, list] = r.pick(ok.length ? ok : NEWWORDS); return { round, word, list: r.shuffle(list.slice()), pick: -1 };
  },
  best(s) { return Math.max(...s.list.map((x) => shared(flat(s.word), flat(x), 3).k)); },
  draw(b, s) {
    b.clear(); b.fit(); const A = area(b), u = A.u;
    if (s.round === 'twist') { const rows = [['listen', 'silent'], ['listen', 'listening']]; rows.forEach(([a, c], k) => { const y = A.y + 20 * u + k * 120 * u, q = shared(a, c, s.n), P = pieces(a, s.n), Q = pieces(c, s.n); b.label(`“${a}” and “${c}”`, A.x + 8 * u, y, { bold: true, size: 13 }); [[a, P, Q], [c, Q, P]].forEach(([wd, mine, other], j) => { let x = A.x + 8 * u; [...mine].forEach((p) => { b.font(12, true); const wpx = b.g.measureText(p).width + 10 * u; b.box(x, y + 14 * u + j * 30 * u, wpx, 24 * u, { fill: other.has(p) ? YES : PAPER, color: INK }); b.label(p, x + 5 * u, y + 26 * u + j * 30 * u, { size: 12, mono: true }); x += wpx + 4 * u; }); }); b.label(`alike: ${pct(q.j)}`, A.x + A.w - 90 * u, y, { size: 12, color: INK2 }); }); return; }
    const word = flat(s.word), P = [...pieces(word, 3)]; b.label(s.round === 'case' ? 'Pip’s book, in pieces of three letters' : 'The new word, in pieces of three letters', A.x + 8 * u, A.y + 8 * u, { size: 11, color: INK2 }); b.label(s.word, A.x + 8 * u, A.y + 30 * u, { size: 17, bold: true });
    const sel = s.pick >= 0 ? pieces(flat(s.list[s.pick]), 3) : new Set(); let x = A.x + 8 * u, y = A.y + 48 * u; P.forEach((p) => { b.font(11, true); const wpx = b.g.measureText(p).width + 9 * u; if (x + wpx > A.x + A.w) { x = A.x + 8 * u; y += 26 * u; } b.box(x, y, wpx, 21 * u, { fill: sel.has(p) ? YES : PAPER, color: INK }); b.label(p.replace(/ /g, '␣'), x + 4.5 * u, y + 10.5 * u, { size: 11, mono: true }); x += wpx + 3 * u; });
    const cols = s.round === 'case' ? 2 : 3, cw = (A.w - 16 * u) / cols, y0 = y + 44 * u; s.list.forEach((nm, i) => { const k = shared(word, flat(nm), 3).k; card(b, 'p' + i, A.x + 8 * u + (i % cols) * cw, y0 + Math.floor(i / cols) * 44 * u, cw - 8 * u, 36 * u, i === s.pick ? `${nm}\nshares ${k} ${k === 1 ? 'piece' : 'pieces'}` : nm, { size: s.round === 'case' ? 11 : 13, sel: i === s.pick, fill: i === s.pick ? (k === IV3.best(s) ? YES : SEL) : PAPER }); });
  },
  click(s, x, y, id) { if (id?.[0] === 'p') s.pick = +id.slice(1); },
  controls(s) { return s.round === 'twist' ? [{ type: 'buttons', label: 'Letters in a piece', value: s.n, options: [1, 2, 3, 4, 5, 6].map((v) => ({ label: String(v), value: v })), set: (v) => { s.n = v; } }] : []; },
  meter(s) {
    if (s.round === 'twist') { const a = shared('listen', 'silent', s.n).j, c = shared('listen', 'listening', s.n).j, ok = a < 0.2 && c >= 0.45; return { label: 'Alike', text: `listen/silent ${pct(a)}   listen/listening ${pct(c)}`, goal: 'first under 20%, second 45% or more', frac: ok ? 1 : (a < 0.2 ? 0.5 : 0) + (c >= 0.45 ? 0.4 : 0), met: ok }; }
    const best = IV3.best(s), k = s.pick >= 0 ? shared(flat(s.word), flat(s.list[s.pick]), 3).k : 0, ok = s.pick >= 0 && k === best; return { label: 'Pieces shared with your pick', text: s.pick >= 0 ? String(k) : 'nothing picked', goal: 'the most of any', frac: ok ? 1 : best ? (k / best) * 0.8 : 0, met: ok, note: ok && s.round === 'case' && s.loans[s.pick] != null ? `By its parts, Pip’s book sits beside a title borrowed ${nice(s.loans[s.pick])} times last year.` : '' };
  },
  demo(s) { if (s.round === 'twist') { s.n = 3; return; } const best = IV3.best(s); s.pick = s.list.findIndex((x) => shared(flat(s.word), flat(x), 3).k === best); },
};

// ---------- IV-4 Merge the commonest pair ----------
const rep = (w, n) => R(n, () => w);
const BWORDS = [...rep('book', 4), ...rep('books', 3), ...rep('booked', 2), ...rep('look', 4), ...rep('looks', 2), ...rep('looked', 3), ...rep('cook', 2), ...rep('cooks', 2), ...rep('cooked', 2), ...rep('took', 3)];
const tcache = new Map();
const trained = (m) => memo(tcache, 'b' + m, () => bpeTrain(BWORDS, m).rules);
const octavoRules = () => memo(tcache, 'octavo', () => bpeTrain(octavo().tokens.filter((x) => /^[a-z]+$/.test(x)).slice(0, 8000), 200).rules);
const show = (toks) => toks.map((t) => t.replace('_', '')).filter(Boolean);
export const IV4 = {
  id: 'IV-4', name: 'Merge the commonest pair', short: 'Tokenization',
  formula: 'start with single letters\nfind the pair of neighbours that turns up most often and glue it into one piece\nrepeat until the list of pieces is as long as you want',
  limit: 'The pieces follow the text they were counted on. Names and words from outside it are spelled out letter by letter, at greater cost.',
  rounds: {
    play: { brief: 'Ten words, split into letters. The cards show pairs of neighbours and how often each turns up. Tap the commonest pair to glue it. Do it five times.' },
    twist: { brief: 'Drag the number of merges. Watch “looked” join up into one piece, and see what happens to a word that was never in the list.' },
    case: { brief: 'Octavo’s pieces, after two hundred merges on its one book. Tap a word to see how it is cut. Find the word that breaks into the most pieces.' } },
  hints: { play: ['Read the counts.', 'Folio can do the merges.'], twist: ['Each merge glues one more pair.', 'About ten merges.'], case: ['Words from the book come out whole.', 'Try the surnames.'] },
  teach: ['Begin with letters.', 'Glue the commonest neighbouring pair, again and again.', 'Common words become one piece; rare ones stay in bits.'],
  init(round, ctx) {
    if (round === 'twist') return { round, m: 0 };
    if (round === 'case') { const C = ctx.caseData, names = C.titles.top.slice(0, 3).map((t) => t.author.split(' ').pop().toLowerCase().replace(/[^a-z]/g, '')); return { round, list: ctx.rng(round).shuffle(['the', 'little', 'thought', ...names]), pick: -1, seen: [] }; }
    return { round, c: bpeInit(BWORDS), good: 0, msg: '' };
  },
  count(s, i) { return bpeEncode(s.list[i], octavoRules()).filter((t) => t !== '_').length; },
  draw(b, s) {
    b.clear(); b.fit(); const A = area(b), u = A.u;
    const tiles = (toks, x, y, size = 12) => { toks.forEach((t) => { b.font(size, true); const wpx = b.g.measureText(t).width + 9 * u; b.box(x, y, wpx, 22 * u, { fill: t.length > 1 ? YES : PAPER, color: INK }); b.label(t, x + 4.5 * u, y + 11 * u, { size, mono: true }); x += wpx + 2 * u; }); return x; };
    if (s.round === 'case') { b.label('Tap a word', A.x + 8 * u, A.y + 8 * u, { size: 11, color: INK2 }); s.list.forEach((wd, i) => { const y = A.y + 24 * u + i * 42 * u; card(b, 'w' + i, A.x + 8 * u, y, 130 * u, 34 * u, wd, { size: 14, sel: i === s.pick }); if (s.seen.includes(i)) { const x = tiles(show(bpeEncode(wd, octavoRules())), A.x + 150 * u, y + 6 * u, 13); b.label(`${IV4.count(s, i)} ${IV4.count(s, i) === 1 ? 'piece' : 'pieces'}`, x + 10 * u, y + 17 * u, { size: 11, color: INK2 }); } }); return; }
    if (s.round === 'twist') { const rules = trained(s.m); b.label('The pieces so far', A.x + 8 * u, A.y + 8 * u, { size: 11, color: INK2 }); let x = A.x + 8 * u, y = A.y + 22 * u; rules.forEach((r) => { const t = (r[0] + r[1]).replace('_', '·'); b.font(12, true); const wpx = b.g.measureText(t).width + 10 * u; if (x + wpx > A.x + A.w) { x = A.x + 8 * u; y += 26 * u; } b.box(x, y, wpx, 22 * u, { fill: YES, color: INK }); b.label(t, x + 5 * u, y + 11 * u, { size: 12, mono: true }); x += wpx + 4 * u; }); [['looked', 'in the list'], ['book', 'in the list'], ['snailkeeper', 'never seen']].forEach(([wd, why], i) => { const yy = y + 60 * u + i * 40 * u; b.label(`${wd} (${why})`, A.x + 8 * u, yy, { size: 12 }); tiles(show(bpeEncode(wd, rules)), A.x + 190 * u, yy - 11 * u, 13); }); b.view(0, 12, 0, 1); b.pad = { l: 40, r: 40, t: b.h / b.u - 56, b: 28 }; b.line(0, 0.5, 12, 0.5, { color: INK2, width: 3 }); b.handle('m', s.m, 0.5, { color: WARM, label: 'merges: ' + s.m }); b.pad = { l: 46, r: 18, t: 18, b: 38 }; return; }
    const types = [...new Set(s.c.map((w) => w.join(' ')))]; b.label('The words', A.x + 8 * u, A.y + 8 * u, { size: 11, color: INK2 }); types.forEach((t, i) => { const n = s.c.filter((w) => w.join(' ') === t).length, x = A.x + 8 * u + (i % 2) * (A.w / 2), y = A.y + 22 * u + (i >> 1) * 27 * u; b.label(n + ' ×', x, y + 11 * u, { size: 11, mono: true, color: INK2 }); tiles(show(t.split(' ')), x + 30 * u, y); });
    const pairs = [...bpePairs(s.c)].sort((a, c) => (a[0] < c[0] ? -1 : 1)).filter((p) => p[1] > 1).slice(0, 12), y0 = A.y + 34 * u + Math.ceil(types.length / 2) * 27 * u, cw = (A.w - 16 * u) / 6; b.label('Pairs of neighbours, and how often (a dot marks the end of a word)', A.x + 8 * u, y0, { size: 11, color: INK2 }); pairs.forEach(([k, n], i) => card(b, 'p' + i, A.x + 8 * u + (i % 6) * cw, y0 + 12 * u + Math.floor(i / 6) * 46 * u, cw - 6 * u, 40 * u, k.replace(/_/g, '·').replace(' ', ' + ') + '\n' + n, { size: 12, mono: true })); if (s.msg) b.label(s.msg, A.x + 8 * u, A.y + A.h - 6 * u, { color: WARM, size: 12 });
  },
  click(s, x, y, id) {
    if (s.round === 'case' && id?.[0] === 'w') { s.pick = +id.slice(1); if (!s.seen.includes(s.pick)) s.seen.push(s.pick); return; }
    if (s.round !== 'play' || id?.[0] !== 'p') return; const pairs = [...bpePairs(s.c)].sort((a, c) => (a[0] < c[0] ? -1 : 1)).filter((p) => p[1] > 1).slice(0, 12), p = pairs[+id.slice(1)]; if (!p) return; const top = Math.max(...[...bpePairs(s.c).values()]);
    if (p[1] === top) { s.c = bpeMerge(s.c, p[0].split(' ')); s.good++; s.msg = ''; } else s.msg = `That pair turns up ${p[1]} times. Another turns up ${top}.`;
  },
  drag(s, id, x) { if (id === 'm') s.m = clamp(Math.round(x), 0, 12); },
  meter(s) {
    if (s.round === 'case') { const most = Math.max(...s.list.map((_, i) => IV4.count(s, i))), k = s.pick >= 0 ? IV4.count(s, s.pick) : 0, ok = s.pick >= 0 && k === most; return { label: 'Pieces in your pick', text: s.pick >= 0 ? String(k) : 'nothing picked', goal: 'the most of any', frac: ok ? 1 : (k / most) * 0.8, met: ok, note: ok ? 'A common word costs Octavo one piece. This name costs it ' + k + '.' : '' }; }
    if (s.round === 'twist') { const rules = trained(s.m), k = show(bpeEncode('looked', rules)).length; return { label: 'Pieces in “looked”', text: String(k), goal: 'one', frac: k === 1 ? 1 : clamp(1 - (k - 1) / 6, 0, 0.9), met: k === 1, note: `“snailkeeper” is in ${show(bpeEncode('snailkeeper', rules)).length} pieces` }; }
    return meterCount('Merges of the commonest pair', Math.min(5, s.good), 5);
  },
  demo(s) { if (s.round === 'case') { const most = Math.max(...s.list.map((_, i) => IV4.count(s, i))); s.pick = s.list.findIndex((_, i) => IV4.count(s, i) === most); if (!s.seen.includes(s.pick)) s.seen.push(s.pick); } else if (s.round === 'twist') { for (let m = 0; m <= 12; m++) { s.m = m; if (show(bpeEncode('looked', trained(m))).length === 1) return; } } else while (s.good < 5) { const q = bpeBest(s.c); if (!q) break; s.c = bpeMerge(s.c, q.pair); s.good++; s.msg = ''; } },
};

// ---------- IV-5 Where to look ----------
const SRC = ['I', 'have', 'read', 'the', 'book'], OUT = ['Ich', 'habe', 'das', 'Buch', 'gelesen'], ALIGN = [0, 1, 3, 4, 2];
const LONG = 'every morning the old signalman walked along the river path to the mill before the whistle blew'.split(' ');
const budget = (sh, k) => { const w = sh.map((v) => Math.pow(v, k)), t = sum(w); return w.map((v) => v / t); };
export const IV5 = {
  id: 'IV-5', name: 'Where to look', short: 'Attention',
  formula: 'for each word it writes, the model gives every source word a weight\nthe weights are positive and add up to 1\nit reads the source through those weights',
  limit: 'The weights add up to one. Whatever attention goes to one thing is taken from the rest.',
  rounds: {
    play: { brief: 'English across the top, German down the side. German puts “read” at the end. For each German word, tap the English word the translator should be looking at.' },
    twist: { brief: 'Before attention, a translator squeezed the whole sentence into one summary. This toy summary holds four words. Get a twelve-word sentence across with every word kept.' },
    case: { brief: 'Six subjects share Marginalia’s attention in proportion to their loans. Flatten the shares until the rare subject gets at least a tenth.' } },
  hints: { play: ['“gelesen” means “read”.', '“das Buch” is “the book”.'], twist: ['Let it look back at the source while it writes.', 'Tick the box.'], case: ['At full sharpness, attention follows the loan counts.', 'Sharpness under 0.2.'] },
  teach: ['While writing each word, look back at the source.', 'Give each source word a weight, and let the model learn the weights.', 'The weights are a budget of one.'],
  init(round, ctx) { if (round === 'case') { const sh = ctx.caseData.subjectShare; return { round, k: 1, sh: [0, 1, 2, 5, 12, 30].map((i) => sh[i]) }; } if (round === 'twist') return { round, n: 12, look: false }; return { round, pick: [-1, -1, -1, -1, -1] }; },
  draw(b, s) {
    b.clear(); b.fit(); const A = area(b), u = A.u;
    if (s.round === 'case') { const w = budget(s.sh, s.k), names = ['most borrowed', 'second', 'third', 'sixth', 'thirteenth', 'a rare subject']; b.view(-0.6, 5.6, 0, 0.62); b.axes({ xt: 0, xfmt: () => '', y: 'share of attention', yfmt: (v) => pct(v) }); w.forEach((v, i) => { b.rect(i - 0.35, 0, 0.7, v, { fill: i === 5 ? DATA[1] : DATA[0] }); b.text(pct(v, v < 0.1 ? 1 : 0), i, v, { dy: -10 * u, size: 11 }); b.text(names[i], i, 0, { dy: 13 * u, size: 10.5 }); }); b.line(-0.4, 0.56, 5.4, 0.56, { color: INK2, width: 3 }); b.handle('k', -0.4 + s.k * 5.8, 0.56, { color: WARM, label: 'sharpness ' + s.k.toFixed(2) }); return; }
    if (s.round === 'twist') { const kept = s.look ? s.n : Math.min(4, s.n), words = LONG.slice(0, s.n); const row = (y, name, keep) => { b.label(name, A.x + 8 * u, y, { size: 11, color: INK2 }); let x = A.x + 8 * u, yy = y + 12 * u; words.forEach((wd, i) => { b.font(12); const wpx = b.g.measureText(wd).width + 12 * u; if (x + wpx > A.x + A.w) { x = A.x + 8 * u; yy += 28 * u; } const ok = keep(i); b.box(x, yy, wpx, 23 * u, { fill: ok ? PAPER : '#e4e0d4', color: ok ? INK : GREY }); b.label(ok ? wd : '?', x + (ok ? 6 * u : wpx / 2), yy + 11.5 * u, { size: 12, color: ok ? INK : GREY, align: ok ? 'left' : 'center' }); x += wpx + 4 * u; }); }; row(A.y + 14 * u, 'The sentence', () => true); row(A.y + 110 * u, s.look ? 'What reaches the writer, looking back word by word' : 'What reaches the writer through a four-word summary', (i) => i < kept); return; }
    const cw = Math.min(86 * u, (A.w - 110 * u) / 5), ch = Math.min(44 * u, (A.h - 60 * u) / 5), x0 = A.x + 100 * u, y0 = A.y + 44 * u; SRC.forEach((wd, c) => b.label(wd, x0 + c * cw + cw / 2, y0 - 14 * u, { align: 'center', size: 14, bold: true })); OUT.forEach((wd, r) => { b.label(wd, x0 - 12 * u, y0 + r * ch + ch / 2, { align: 'right', size: 14, bold: true }); SRC.forEach((_, c) => { const on = s.pick[r] === c; card(b, `c${r}_${c}`, x0 + c * cw, y0 + r * ch, cw - 4 * u, ch - 4 * u, on ? (c === ALIGN[r] ? 'looks here' : 'here?') : '', { size: 10.5, fill: on ? (c === ALIGN[r] ? YES : NO) : PAPER }); }); });
  },
  click(s, x, y, id) { if (s.round === 'play' && id?.[0] === 'c') { const [r, c] = id.slice(1).split('_').map(Number); s.pick[r] = c; } },
  drag(s, id, x) { if (id === 'k') s.k = clamp(Math.round(((x + 0.4) / 5.8) * 50) / 50, 0, 1); },
  controls(s) { return s.round === 'twist' ? [{ type: 'slider', label: 'Words in the sentence', min: 4, max: 16, step: 1, value: s.n, set: (v) => { s.n = v; } }, { type: 'toggle', label: 'Let it look back at the sentence while it writes', value: s.look, set: (v) => { s.look = v; } }] : []; },
  meter(s) {
    if (s.round === 'case') { const w = budget(s.sh, s.k); return meterTo('Attention on the rare subject', w[5], 0.1, { from: 0, fmt: (v) => pct(v, 1), note: `the most borrowed subject gets ${pct(w[0])}` }); }
    if (s.round === 'twist') { const kept = s.look ? s.n : Math.min(4, s.n), ok = s.n >= 12 && kept === s.n; return { label: 'Words that get across', text: `${kept} of ${s.n}`, goal: 'all of twelve or more', frac: ok ? 1 : (kept / s.n) * 0.8, met: ok }; }
    return meterCount('Words looking at the right place', s.pick.filter((c, r) => c === ALIGN[r]).length, 5);
  },
  demo(s) { if (s.round === 'case') s.k = 0.1; else if (s.round === 'twist') { s.look = true; s.n = Math.max(12, s.n); } else s.pick = ALIGN.slice(); },
};

// ---------- IV-6 Every word looks at every word ----------
const IT = ['the trophy did not fit in the case because it was too big'.split(' '), 'the trophy did not fit in the case because it was too small'.split(' ')], REF = [1, 7];
const pulled = (s) => { const on = s.quiet.map((c) => 0.9 * Math.pow(c, s.p)), off = s.loud.map((c) => 0.15 * Math.pow(c, s.p)), t = sum(on) + sum(off); return { on: on.map((v) => v / t), off: off.map((v) => v / t), share: sum(on) / t }; };
export const IV6 = {
  id: 'IV-6', name: 'Every word looks at every word', short: 'Self-attention',
  formula: 'each word asks a question of every other word at once\nthe better the match, the more of that word it takes in\nposition marks tell it the order',
  limit: 'What a word attends to is learned from text. Things written about most draw the most attention, whether or not they are what you asked about.',
  rounds: {
    play: { brief: 'Two sentences, one word apart. In each, tap the word that “it” stands for.' },
    twist: { brief: 'Attention alone sees a sentence as a bag of words. “Dog bites man” and “man bites dog” are the same bag. Give the model what it needs to tell them apart.' },
    case: { brief: 'A reader asks Octavo about a quiet subject. Three titles fit. Three bestsellers do not. Lower the pull of loan counts until the fitting titles get most of its attention.' } },
  hints: { play: ['What was too big? What was too small?', 'The trophy, then the case.'], twist: ['Number the words.', 'Tick the box.'], case: ['Loan counts in the thousands swamp a good fit.', 'Pull under 0.15.'] },
  teach: ['Let every word look at every other word in one step.', 'Weigh each by how well it answers this word’s question.', 'Add position marks, or order is lost.'],
  init(round, ctx) { if (round === 'case') { const C = ctx.caseData; return { round, p: 1, loud: C.titles.top.slice(0, 3).map((t) => t.last), loudNames: C.titles.top.slice(0, 3).map((t) => t.name), quiet: [2, 3, 1] }; } if (round === 'twist') return { round, pos: false }; return { round, pick: [-1, -1] }; },
  draw(b, s) {
    b.clear(); b.fit(); const A = area(b), u = A.u;
    if (s.round === 'case') { const q = pulled(s), names = [...s.loudNames.map((n, i) => `${n} (${nice(s.loud[i])} loans, poor fit)`), ...s.quiet.map((c, i) => `Fits the question: title ${'ABC'[i]} (${c} ${c === 1 ? 'loan' : 'loans'})`)], vals = [...q.off, ...q.on]; b.label('Where Octavo’s attention goes', A.x + 8 * u, A.y + 8 * u, { size: 11, color: INK2 }); vals.forEach((v, i) => { const y = A.y + 24 * u + i * 34 * u; b.label(names[i], A.x + 8 * u, y + 6 * u, { size: 11 }); b.box(A.x + 8 * u, y + 14 * u, Math.max(2 * u, (A.w - 90 * u) * v), 12 * u, { fill: i < 3 ? DATA[1] : DATA[2] }); b.label(pct(v, v < 0.1 ? 1 : 0), A.x + 16 * u + (A.w - 90 * u) * v, y + 20 * u, { size: 10.5, mono: true }); }); b.view(0, 1, 0, 1); b.pad = { l: 40, r: 40, t: b.h / b.u - 56, b: 28 }; b.line(0, 0.5, 1, 0.5, { color: INK2, width: 3 }); b.handle('p', s.p, 0.5, { color: WARM, label: 'pull of loan counts ' + s.p.toFixed(2) }); b.pad = { l: 46, r: 18, t: 18, b: 38 }; return; }
    if (s.round === 'twist') { const S2 = [['dog', 'bites', 'man'], ['man', 'bites', 'dog']]; S2.forEach((wd, k) => { const y = A.y + 24 * u + k * 110 * u; b.label('“' + wd.join(' ') + '”', A.x + 8 * u, y, { size: 14, bold: true }); b.label('what the model is given:', A.x + 8 * u, y + 26 * u, { size: 11, color: INK2 }); const seen = s.pos ? wd.map((w, i) => `${i + 1}:${w}`) : wd.slice().sort(); seen.forEach((t, i) => card(b, null, A.x + 8 * u + i * 104 * u, y + 38 * u, 96 * u, 32 * u, t, { size: 13, mono: s.pos })); }); b.label(s.pos ? 'Different. It can tell who bit whom.' : 'Identical. It cannot tell who bit whom.', A.x + 8 * u, A.y + 250 * u, { size: 13, color: s.pos ? GOOD : WARM, bold: true }); return; }
    IT.forEach((wd, k) => { const y = A.y + 40 * u + k * 120 * u; let x = A.x + 8 * u; const xs = []; wd.forEach((w, i) => { b.font(13); const wpx = b.g.measureText(w).width + 12 * u, isIt = w === 'it', on = s.pick[k] === i; card(b, isIt ? null : `w${k}_${i}`, x, y, wpx, 28 * u, w, { size: 13, fill: isIt ? SEL : on ? (i === REF[k] ? YES : NO) : PAPER, sel: on, bold: isIt }); xs.push(x + wpx / 2); x += wpx + 3 * u; }); if (s.pick[k] >= 0) { const g = b.g, x1 = xs[9], x2 = xs[s.pick[k]]; g.beginPath(); g.moveTo(x1, y); g.quadraticCurveTo((x1 + x2) / 2, y - 44 * u, x2, y); g.strokeStyle = s.pick[k] === REF[k] ? GOOD : WARM; g.lineWidth = 2.5 * u; g.stroke(); } });
  },
  click(s, x, y, id) { if (s.round === 'play' && id?.[0] === 'w') { const [k, i] = id.slice(1).split('_').map(Number); s.pick[k] = i; } },
  drag(s, id, x) { if (id === 'p') s.p = clamp(Math.round(x * 50) / 50, 0, 1); },
  controls(s) { return s.round === 'twist' ? [{ type: 'toggle', label: 'Mark each word with its position', value: s.pos, set: (v) => { s.pos = v; } }] : []; },
  meter(s) {
    if (s.round === 'case') return meterTo('Attention on titles that fit', pulled(s).share, 0.6, { from: 0, fmt: (v) => pct(v) });
    if (s.round === 'twist') return { label: 'Can it tell the two sentences apart?', text: s.pos ? 'yes' : 'no', frac: s.pos ? 1 : 0, met: s.pos };
    return meterCount('Sentences read correctly', s.pick.filter((p, k) => p === REF[k]).length, 2);
  },
  demo(s) { if (s.round === 'case') s.p = 0.1; else if (s.round === 'twist') s.pos = true; else s.pick = REF.slice(); },
};

// ---------- IV-7 Fill the blank ----------
const CLOZE = [['Pip opened the', 'and began to read.', ['book', 'river', 'seven', 'quickly']], ['The mill', 'blew at six.', ['whistle', 'table', 'slowly', 'green']], ['Rain fell on the', 'all night.', ['roof', 'idea', 'sang', 'under']]];
const GAPS = [['of', 'having', 'to', 'do', 'nothing'], ['had', 'never', 'seen', 'a', 'before'], ['at', 'the', 'it', 'all', 'time'], ['white', 'rabbit', 'pink', 'eyes', 'with']];
const fcache = new Map();
// Octavo's guess for a gap: from the two words before it, or from those and the two words after as well.
const fill = (e, both) => memo(fcache, e.join(' ') + both, () => { const cands = next([e[0], e[1]]).slice(0, 80); if (!both) return cands[0][0]; let best = null, bs = -1; for (const [c, p] of cands) { const a = next([e[1], c]).find((x) => x[0] === e[2]), d = next([c, e[2]]).find((x) => x[0] === e[3]), sc = p * (a ? a[1] : 1e-6) * (d ? d[1] : 1e-6); if (sc > bs) { bs = sc; best = c; } } return best; });
export const IV7 = {
  id: 'IV-7', name: 'Fill the blank', short: 'Masked language models',
  formula: 'hide a word, and ask the model for it\nit may use the words on both sides\nwhat it learns doing this carries over to other tasks',
  limit: 'The model fills a gap with what was usual in its training text. Usual is not the same as right.',
  rounds: {
    play: { brief: 'Three sentences, each with a word missing. Tap the word that belongs in each gap.' },
    twist: { brief: 'Now Octavo fills gaps in lines from its one book. It is only reading the words before the gap. Let it read the words after as well.' },
    case: { brief: 'Five departments’ reading lists, each with a gap. Tap a gap to see what the model writes in. Then count the different titles.' } },
  hints: { play: ['Read to the end of the sentence before choosing.', 'Book, whistle, roof.'], twist: ['Half the clue is on the other side.', 'Tick the box.'], case: ['Tap all five gaps.', 'How many different titles is that?'] },
  teach: ['Hide some words in ordinary text.', 'Train a model to put them back, using both sides.', 'It fills gaps with the usual thing, so check what “usual” was.'],
  init(round, ctx) {
    const r = ctx.rng(round);
    if (round === 'case') { const C = ctx.caseData, top = C.titles.top, lists = ['History', 'Science', 'Arts', 'Technology', 'Nature'].map((f) => { const hit = top.find((t) => FIELDS[Math.floor(SUBJECTS.indexOf(t.subject) / 5)] === f); return { field: f, fill: (hit || top[0]).name, own: !!hit }; }); return { round, lists, open: [] }; }
    if (round === 'twist') return { round, after: false, ex: r.shuffle(GAPS.slice()).slice(0, 3) };
    return { round, opts: CLOZE.map((c) => r.shuffle(c[2].slice())), pick: [-1, -1, -1] };
  },
  draw(b, s) {
    b.clear(); b.fit(); const A = area(b), u = A.u;
    if (s.round === 'case') { s.lists.forEach((l, i) => { const y = A.y + 14 * u + i * 52 * u, open = s.open.includes(i); b.label(`${l.field}: reading list`, A.x + 8 * u, y + 6 * u, { size: 11, color: INK2 }); card(b, 'g' + i, A.x + 8 * u, y + 14 * u, A.w - 16 * u, 30 * u, open ? l.fill : 'tap to see what it writes in', { size: 12.5, fill: open ? SEL : PAPER, ink: open ? INK : GREY, dash: open ? null : [4, 4] }); }); return; }
    if (s.round === 'twist') { s.ex.forEach((e, i) => { const y = A.y + 20 * u + i * 86 * u, g = fill(e, s.after), ok = g === e[4]; let x = A.x + 8 * u; [e[0], e[1], null, e[2], e[3]].forEach((w, k) => { const seen = k < 2 || s.after, txt = w === null ? g : w; b.font(14, false, w === null); const wpx = b.g.measureText(txt).width + 16 * u; b.box(x, y, wpx, 30 * u, { fill: w === null ? (ok ? YES : NO) : seen ? PAPER : '#e4e0d4', color: seen || w === null ? INK : GREY }); b.label(seen || w === null ? txt : '···', x + 8 * u, y + 15 * u, { size: 14, bold: w === null, color: seen || w === null ? INK : GREY }); x += wpx + 5 * u; }); b.label(ok ? 'as in the book' : `the book has “${e[4]}”`, A.x + 8 * u, y + 44 * u, { size: 11, color: ok ? GOOD : WARM }); }); return; }
    CLOZE.forEach((c, i) => { const y = A.y + 16 * u + i * 92 * u, got = s.pick[i] >= 0 ? s.opts[i][s.pick[i]] : '______'; b.label(`${c[0]} ${got} ${c[1]}`, A.x + 8 * u, y + 8 * u, { size: 15, bold: true }); s.opts[i].forEach((o, k) => card(b, `o${i}_${k}`, A.x + 8 * u + k * 112 * u, y + 26 * u, 104 * u, 32 * u, o, { size: 13, sel: s.pick[i] === k, fill: s.pick[i] === k ? (o === c[2][0] ? YES : NO) : PAPER })); });
  },
  click(s, x, y, id) { if (s.round === 'case' && id?.[0] === 'g') { const i = +id.slice(1); if (!s.open.includes(i)) s.open.push(i); } else if (s.round === 'play' && id?.[0] === 'o') { const [i, k] = id.slice(1).split('_').map(Number); s.pick[i] = k; } },
  controls(s) { return s.round === 'twist' ? [{ type: 'toggle', label: 'Let it read the words after the gap', value: s.after, set: (v) => { s.after = v; } }] : []; },
  meter(s) {
    if (s.round === 'case') { const all = s.open.length === 5, kinds = new Set(s.lists.map((l) => l.fill)).size; return { label: 'Gaps looked at', text: `${s.open.length} of 5`, frac: s.open.length / 5, met: all, note: all ? `Five gaps, ${kinds} different ${kinds === 1 ? 'title' : 'titles'}. Each is the most-borrowed title it could find.` : '' }; }
    if (s.round === 'twist') return meterCount('Gaps filled as in the book', s.ex.filter((e) => fill(e, s.after) === e[4]).length, 3);
    return meterCount('Gaps filled', s.pick.filter((p, i) => p >= 0 && s.opts[i][p] === CLOZE[i][2][0]).length, 3);
  },
  demo(s) { if (s.round === 'case') s.open = [0, 1, 2, 3, 4]; else if (s.round === 'twist') s.after = true; else s.pick = s.opts.map((o, i) => o.indexOf(CLOZE[i][2][0])); },
};

// ---------- IV-8 One token at a time ----------
const lcache = new Map();
const lines3 = (seed, T) => memo(lcache, seed + '|' + T, () => R(3, (k) => generate(['alice', 'was'], 12, new RNG(seed + k * 97), { temperature: T })));
const chanceOf = (L) => mean(L.flatMap((l) => l.steps.map((x) => x.p)));
function retrain(counts, rng, n) { const cum = []; let a = 0; for (const c of counts) cum.push((a += c)); const out = counts.map(() => 0); for (let i = 0; i < n; i++) { const x = rng.u() * a; let lo = 0, hi = cum.length - 1; while (lo < hi) { const m = (lo + hi) >> 1; if (cum[m] < x) lo = m + 1; else hi = m; } out[lo]++; } return out; }
export const IV8 = {
  id: 'IV-8', name: 'One token at a time', short: 'Next-token prediction',
  formula: 'given the text so far, the model gives every possible next piece a chance\none is drawn, added to the text, and the model is asked again\ntemperature: low sticks to the likeliest, high spreads the draw',
  limit: 'The model writes what is likely, not what is true. Trained again on its own writing, it loses the unusual first.',
  rounds: {
    play: { brief: 'Octavo has read one book. Give it two words and ask for the next, again and again. The bars are its five likeliest choices each time. Write twelve words.' },
    twist: { brief: 'Three lines from the same start. At temperature zero they are identical. Too hot and they fall apart. Find a setting where all three differ and the words are still likely ones.' },
    case: { brief: 'Have Octavo write a book’s worth of words, then learn again from only that. Do it five times and watch how many different words it still knows.' } },
  hints: { play: ['Press “Next word”.', 'Twelve times.'], twist: ['Somewhere between cold and hot.', 'About 0.6.'], case: ['Press the button five times.', 'Which words went first?'] },
  teach: ['Predict the next piece of text from what came before.', 'Draw one, add it, and predict again.', 'A model fed on its own output narrows with every round.'],
  init(round, ctx) {
    const seed = ctx.rng(round).int(1, 1e6);
    if (round === 'case') { const m = octavo(), words = [...m.uni].filter((x) => /^[a-z]/.test(x[0])).sort((a, c) => c[1] - a[1]); return { round, seed, counts: words.map((x) => x[1]), sizes: [words.length], lost: [] }; }
    if (round === 'twist') return { round, seed, T: 0 };
    return { round, seed, words: [], top: [], T: 0.8 };
  },
  draw(b, s) {
    b.clear(); b.fit(); const A = area(b), u = A.u;
    if (s.round === 'case') { b.view(-0.6, 5.6, 0, s.sizes[0] * 1.15); b.axes({ x: 'times retrained on its own writing', y: 'different words it still knows', xt: 0, xfmt: () => '' }); s.sizes.forEach((v, i) => { b.rect(i - 0.35, 0, 0.7, v, { fill: i ? DATA[1] : DATA[0] }); b.text(nice(v), i, v, { dy: -10 * u, size: 11, mono: true }); b.text(i ? String(i) : 'the book', i, 0, { dy: 13 * u, size: 10.5 }); }); if (s.lost.length) b.label('Among the first to go: ' + s.lost.slice(0, 7).join(', '), A.x + 60 * u, A.y + 10 * u, { size: 11.5, color: WARM }); return; }
    if (s.round === 'twist') { const L = lines3(s.seed, s.T); L.forEach((l, i) => { const y = A.y + 26 * u + i * 76 * u; b.label('Line ' + (i + 1), A.x + 8 * u, y - 12 * u, { size: 11, color: INK2 }); wrap(b, 'Alice was ' + say(l.words).replace(/^./, (c) => c.toLowerCase()), A.x + 8 * u, y + 6 * u, A.w - 20 * u, { size: 14 }); }); return; }
    b.label('Octavo writes', A.x + 8 * u, A.y + 8 * u, { size: 11, color: INK2 }); const yy = wrap(b, 'Alice was ' + (s.words.length ? say(s.words).replace(/^./, (c) => c.toLowerCase()) : '…'), A.x + 8 * u, A.y + 30 * u, A.w - 20 * u, { size: 16, bold: true });
    if (s.top.length) { b.label('Its five likeliest choices for the last word', A.x + 8 * u, yy + 18 * u, { size: 11, color: INK2 }); s.top.forEach(([w, p], i) => { const y = yy + 34 * u + i * 26 * u, chosen = w === s.words[s.words.length - 1]; b.label(w, A.x + 8 * u, y + 9 * u, { size: 13, bold: chosen }); b.box(A.x + 110 * u, y, Math.max(2 * u, (A.w - 190 * u) * p), 18 * u, { fill: chosen ? DATA[1] : DATA[0] }); b.label(pct(p, p < 0.1 ? 1 : 0), A.x + 118 * u + (A.w - 190 * u) * p, y + 9 * u, { size: 10.5, mono: true }); }); }
  },
  controls(s) {
    if (s.round === 'case') return [{ type: 'button', go: true, label: 'Write, then learn from what it wrote', disabled: s.sizes.length > 5, run: () => { const before = s.counts, total = sum(before); s.counts = retrain(before, new RNG(s.seed + s.sizes.length), total); s.sizes.push(s.counts.filter((c) => c > 0).length); if (s.sizes.length === 2) { const m = octavo(), words = [...m.uni].filter((x) => /^[a-z]/.test(x[0])).sort((a, c) => c[1] - a[1]).map((x) => x[0]); s.lost = words.filter((w, i) => before[i] > 0 && s.counts[i] === 0 && w.length > 5).slice(0, 12); } } }];
    if (s.round === 'twist') return [{ type: 'slider', label: 'Temperature', min: 0, max: 2, step: 0.1, value: s.T, set: (v) => { s.T = v; }, show: (v) => v.toFixed(1) }];
    return [{ type: 'button', go: true, label: 'Next word', disabled: s.words.length >= 12, run: () => { const g = generate(['alice', 'was', ...s.words], 1, new RNG(s.seed + s.words.length * 31), { temperature: s.T }); s.words.push(g.words[0]); s.top = g.steps[0].top; } }, { type: 'slider', label: 'Temperature', min: 0, max: 2, step: 0.1, value: s.T, set: (v) => { s.T = v; }, show: (v) => v.toFixed(1) }];
  },
  meter(s) {
    if (s.round === 'case') { const k = s.sizes.length - 1; return { label: 'Rounds of retraining', text: `${k} of 5`, frac: k / 5, met: k >= 5, note: `words it knows: ${nice(s.sizes[0])} at the start, ${nice(s.sizes[k])} now` }; }
    if (s.round === 'twist') { const L = lines3(s.seed, s.T), kinds = new Set(L.map((l) => l.words.join(' '))).size, p = chanceOf(L), ok = kinds === 3 && p >= 0.3; return { label: 'Different lines, and how likely the words', text: `${kinds} of 3   ${pct(p)}`, goal: 'three different, 30% or more', frac: ok ? 1 : (kinds / 3) * 0.5 + (p >= 0.3 ? 0.4 : 0), met: ok }; }
    return meterCount('Words written', s.words.length, 12);
  },
  demo(s) { if (s.round === 'case') { const c = IV8.controls(s)[0]; while (s.sizes.length <= 5) c.run(); } else if (s.round === 'twist') { for (const T of [0.6, 0.5, 0.7, 0.4, 0.8, 0.3, 0.9, 0.2, 1]) { s.T = T; if (IV8.meter(s).met) return; } } else { const c = IV8.controls(s)[0]; while (s.words.length < 12) c.run(); } },
};

// ---------- IV-9 Asking well ----------
const SHELVES = ['Birds', 'Weather', 'Stars'];
const EXAMPLES = [['Owls of the Old Wood', 0], ['A Year of Garden Birds', 0], ['Storm Clouds and Rain', 1], ['Why the Wind Blows', 1], ['The Night Sky in Winter', 2], ['Planets and Their Moons', 2]];
const TESTS = [['Garden Owls at Night', 0], ['Rain Clouds over the Hills', 1], ['Moons of the Winter Sky', 2], ['The Wind and the Storm', 1]];
const SMALL = new Set('the a of and in at over their why'.split(' '));
const keys = (t) => t.toLowerCase().split(' ').filter((w) => !SMALL.has(w));
// The stand-in: it sorts a title onto the shelf whose examples share the most words with it. No examples, no answer.
const shelfFor = (title, used) => { const sc = [0, 0, 0]; used.forEach((i) => { const k = keys(EXAMPLES[i][0]); keys(title).forEach((w) => { if (k.includes(w)) sc[EXAMPLES[i][1]]++; }); }); const m = Math.max(...sc); return m > 0 && sc.filter((v) => v === m).length === 1 ? sc.indexOf(m) : -1; };
const SUMS = [['A shelf has 3 rows of 12 books. 5 are out on loan. How many are on the shelf?', '36', '3 × 12 = 36.  36 − 5 = 31.', '31'], ['The van brings 4 boxes of 25 books and takes 30 away. How many more books are there now?', '100', '4 × 25 = 100.  100 − 30 = 70.', '70'], ['Pip reads 6 pages a night for 7 nights, then 8 more. How many pages?', '42', '6 × 7 = 42.  42 + 8 = 50.', '50']];
const ASKS = ['Something about birds, please.', 'A quiet book for a rainy day.', 'Surprise me.', 'What do other children read?'];
export const IV9 = {
  id: 'IV-9', name: 'Asking well', short: 'Prompts',
  formula: 'zero-shot: ask, with no examples\nfew-shot: put a few worked examples in the request\nstep by step: have the working written out before the answer',
  limit: 'A better request gets more out of what the model already has. It cannot add what the model was never given.',
  rounds: {
    play: { brief: 'A helper must sort four titles onto three shelves. It has had no training for this: it goes by the examples you put in your request. Tap examples to add them, until all four are right.' },
    twist: { brief: 'This round is acted out, because Octavo is too small for sums. Three questions each need two steps. Change how they are asked so that every answer is right.' },
    case: { brief: 'Octavo, the library’s chat window, answers from Marginalia’s list. Ask it four different things and compare what it suggests.' } },
  hints: { play: ['Give it at least one example for each shelf.', 'Folio adds them all.'], twist: ['Ask it to show its working.', 'Tick the box.'], case: ['Press all four.', 'Count the different titles.'] },
  teach: ['Say what you want plainly.', 'Show a few examples of it done well.', 'For anything with steps, ask for the steps.'],
  init(round) { if (round === 'case') return { round, asked: [], last: -1 }; if (round === 'twist') return { round, steps: false }; return { round, used: [] }; },
  draw(b, s, ctx) {
    b.clear(); b.fit(); const A = area(b), u = A.u;
    if (s.round === 'case') { const top = ctx.caseData.titles.top.slice(0, 5).map((t) => t.name); b.label('Ask Octavo', A.x + 8 * u, A.y + 8 * u, { size: 11, color: INK2 }); ASKS.forEach((q, i) => card(b, 'a' + i, A.x + 8 * u + (i % 2) * (A.w / 2 - 4 * u), A.y + 20 * u + (i >> 1) * 40 * u, A.w / 2 - 12 * u, 34 * u, q, { size: 12, sel: s.last === i, fill: s.asked.includes(i) ? SEL : PAPER })); if (s.last >= 0) { b.label('Octavo suggests', A.x + 8 * u, A.y + 116 * u, { size: 11, color: INK2 }); R(5, (k) => top[(k + s.last) % 5]).forEach((t, k) => b.label(`${k + 1}. ${t}`, A.x + 14 * u, A.y + 136 * u + k * 22 * u, { size: 13 })); } return; }
    if (s.round === 'twist') { SUMS.forEach((q, i) => { const y = A.y + 12 * u + i * 92 * u; const yy = wrap(b, q[0], A.x + 8 * u, y + 6 * u, A.w - 20 * u, { size: 12.5, bold: true }); b.label(s.steps ? 'Work it out step by step, then answer.' : 'Answer:', A.x + 8 * u, yy + 6 * u, { size: 11, color: INK2 }); card(b, null, A.x + 8 * u, yy + 16 * u, A.w - 16 * u, 30 * u, s.steps ? `${q[2]}  Answer: ${q[3]}` : q[1], { size: 13, mono: true, align: 'left', fill: s.steps ? YES : NO }); }); return; }
    b.label('Examples you could put in the request (tap to add or take out)', A.x + 8 * u, A.y + 8 * u, { size: 11, color: INK2 }); const cw = (A.w - 16 * u) / 2; EXAMPLES.forEach(([t, k], i) => { const on = s.used.includes(i); card(b, 'e' + i, A.x + 8 * u + (i % 2) * cw, A.y + 20 * u + (i >> 1) * 38 * u, cw - 8 * u, 32 * u, `“${t}” → ${SHELVES[k]}`, { size: 11.5, fill: on ? SEL : PAPER, sel: on }); });
    b.label('The helper sorts', A.x + 8 * u, A.y + 146 * u, { size: 11, color: INK2 }); TESTS.forEach(([t, k], i) => { const g = shelfFor(t, s.used), ok = g === k, y = A.y + 158 * u + i * 30 * u; card(b, null, A.x + 8 * u, y, A.w - 16 * u, 25 * u, `“${t}” → ${g < 0 ? 'not sure' : SHELVES[g]}`, { size: 12, align: 'left', fill: ok ? YES : g < 0 ? PAPER : NO }); });
  },
  click(s, x, y, id) { if (s.round === 'case' && id?.[0] === 'a') { s.last = +id.slice(1); if (!s.asked.includes(s.last)) s.asked.push(s.last); } else if (s.round === 'play' && id?.[0] === 'e') { const i = +id.slice(1); s.used = s.used.includes(i) ? s.used.filter((v) => v !== i) : [...s.used, i]; } },
  controls(s) { return s.round === 'twist' ? [{ type: 'toggle', label: 'Ask for the working, step by step', value: s.steps, set: (v) => { s.steps = v; } }] : []; },
  meter(s) {
    if (s.round === 'case') { const all = s.asked.length === 4; return { label: 'Questions asked', text: `${s.asked.length} of 4`, frac: s.asked.length / 4, met: all, note: all ? 'Four questions. The same five titles each time, in a different order.' : '' }; }
    if (s.round === 'twist') return meterCount('Right answers', s.steps ? 3 : 0, 3);
    return meterCount('Titles on the right shelf', TESTS.filter(([t, k]) => shelfFor(t, s.used) === k).length, 4, `examples in the request: ${s.used.length}`);
  },
  demo(s) { if (s.round === 'case') { s.asked = [0, 1, 2, 3]; s.last = 3; } else if (s.round === 'twist') s.steps = true; else s.used = [0, 1, 2, 3, 4, 5]; },
};

export const PART4A = [IV1, IV2, IV3, IV4, IV5, IV6, IV7, IV8, IV9];
