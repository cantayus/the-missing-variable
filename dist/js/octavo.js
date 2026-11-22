// Octavo: a small language model, built in the browser when it is first needed.
// It has read one book (see content/octavo-corpus.js) and guesses the next word from the two before it.
// It is an n-gram model, not a neural network. The game says so wherever Octavo speaks.
import { CORPUS } from './content/octavo-corpus.js';
import { reshape } from './algo/text.js';

let M = null, L = null;
export const tokenize = (t) => String(t).toLowerCase().match(/[a-z]+(?:['-][a-z]+)*|[.,!?;:]/g) || [];
const bump = (m, k, w) => { let x = m.get(k); if (!x) m.set(k, (x = new Map())); x.set(w, (x.get(w) || 0) + 1); };

export function octavo() {
  if (M) return M;
  const tok = tokenize(CORPUS), uni = new Map(), bi = new Map(), tri = new Map();
  for (let i = 0; i < tok.length; i++) { uni.set(tok[i], (uni.get(tok[i]) || 0) + 1); if (i > 0) bump(bi, tok[i - 1], tok[i]); if (i > 1) bump(tri, tok[i - 2] + ' ' + tok[i - 1], tok[i]); }
  const top = [...uni].sort((a, b) => b[1] - a[1]).slice(0, 40), topTot = top.reduce((s, x) => s + x[1], 0);
  M = { tokens: tok, uni, bi, tri, top, topTot, size: tok.length, words: uni.size };
  return M;
}

// The chances Octavo gives each possible next word, likeliest first.
export function next(context) {
  const m = octavo(), a = context[context.length - 2], b = context[context.length - 1], out = new Map();
  const add = (mp, w) => { if (!mp) return 0; let tot = 0; for (const c of mp.values()) tot += c; for (const [k, c] of mp) out.set(k, (out.get(k) || 0) + (w * c) / tot); return w; };
  const used = add(a !== undefined ? m.tri.get(a + ' ' + b) : null, 0.65) + add(b !== undefined ? m.bi.get(b) : null, 0.3);
  for (const [k, c] of m.top) out.set(k, (out.get(k) || 0) + ((1 - used) * c) / m.topTot);
  return [...out].sort((x, y) => y[1] - x[1]);
}

export function generate(prompt, n, rng, opts = {}) {
  const ctx = Array.isArray(prompt) ? prompt.slice() : tokenize(prompt), out = [], steps = [];
  for (let i = 0; i < n; i++) {
    const d = next(ctx.concat(out)).slice(0, 60), tot = d.reduce((s, x) => s + x[1], 0), p = reshape(d.map((x) => x[1] / tot), opts);
    const k = opts.temperature === 0 ? 0 : rng.weighted(p);
    out.push(d[k][0]); steps.push({ word: d[k][0], p: d[k][1] / tot, rank: k, top: d.slice(0, 5).map((x) => [x[0], x[1] / tot]) });
  }
  return { words: out, steps };
}

// Tokens back to a sentence a person can read.
export function say(tokens) {
  let s = '', cap = true;
  for (const t of tokens) {
    if (/^[.,!?;:]$/.test(t)) { s += t; if (/[.!?]/.test(t)) cap = true; continue; }
    let w = t === 'i' ? 'I' : t.startsWith("i'") ? 'I' + t.slice(1) : t === 'alice' ? 'Alice' : t === "alice's" ? "Alice's" : t;
    if (cap) { w = w[0].toUpperCase() + w.slice(1); cap = false; }
    s += (s ? ' ' : '') + w;
  }
  return s;
}

// Letter-level counts for the guessing game: which letter tends to follow the last few.
const ABC = 'abcdefghijklmnopqrstuvwxyz ';
export function letters() {
  if (L) return L;
  const text = CORPUS.toLowerCase().replace(/[^a-z]+/g, ' '), maps = [new Map(), new Map(), new Map(), new Map()];
  for (let i = 0; i < text.length; i++) for (let k = 0; k <= 3; k++) { if (i - k < 0) continue; bump(maps[k], text.slice(i - k, i), text[i]); }
  // rank(prev, order): the 27 symbols, likeliest first, using up to `order` earlier letters and falling back when a context was never seen
  const rank = (prev, order) => { const seen = new Set(), out = []; for (let k = Math.min(order, prev.length, 3); k >= 0; k--) { const m = maps[k].get(prev.slice(prev.length - k)); if (!m) continue; for (const [ch] of [...m].sort((x, y) => y[1] - x[1])) if (!seen.has(ch)) { seen.add(ch); out.push(ch); } } for (const ch of ABC) if (!seen.has(ch)) out.push(ch); return out; };
  L = { rank, ABC };
  return L;
}

// What the library's chat window says. The suggestions never change: they come from the same loan counts as the display.
export function reply(question, rng, caseData) {
  const words = tokenize(question).filter((w) => octavo().uni.has(w)), seed = words.slice(-2), g = generate(seed.length ? seed : ['alice'], 14, rng, { temperature: 0.9, topK: 12 });
  let w = g.words; const stop = w.findIndex((t, i) => i > 4 && /[.!?]/.test(t)); if (stop > 0) w = w.slice(0, stop + 1);
  return { text: say(w), titles: caseData ? caseData.titles.top.slice(0, 5).map((t) => t.name) : [] };
}
