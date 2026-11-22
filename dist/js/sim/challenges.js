// The sums behind the three challenges. No screen code here, so the tests can run it.
import { RNG } from '../core/rng.js';
import { polyfit } from '../algo/stats.js';
import { simulate } from './model.js';

// ---- Challenge I: forecast the number of different titles borrowed each month in year six, from years one to five ----
export const WINDOWS = [['All five years', 0], ['The last two years', 36], ['The last year', 48]];
export const SHAPES = [['Flat: the average', 0], ['A straight line', 1], ['A bendy curve', 6]];
const mape = (pred, act) => pred.reduce((s, p, i) => s + Math.abs(p - act[i]) / act[i], 0) / act.length;
export function forecast(C, from, deg) {
  const d = C.m.distinct, xs = [], ys = []; for (let m = from; m < 60; m++) { xs.push((m - 30) / 30); ys.push(d[m]); }
  const f = polyfit(xs, ys, deg), at = (m) => f.predict((m - 30) / 30), truth = d.slice(60);
  return { fit: xs.map((_, i) => [from + i, at(from + i)]), ahead: truth.map((_, i) => [60 + i, at(60 + i)]), pub: mape(xs.map((_, i) => at(from + i)), ys), hid: mape(truth.map((_, i) => at(60 + i)), truth) };
}

// ---- Challenge II: a small library with a screen. The log is bent by the screen; an open-shelf week is not. ----
export function library(seed = 7) {
  const r = new RNG(seed), T = 60, R = 150, S = 6;
  const subj = Array.from({ length: T }, (_, t) => t % S), qual = Array.from({ length: T }, () => 0.4 + r.u() * 0.6);
  const taste = Array.from({ length: R }, () => { const a = r.int(0, S - 1), b = r.int(0, S - 1), w = Array.from({ length: S }, () => 0.04); w[a] += 0.7; w[b] += 0.3; return w; });
  const want = (rd, t) => taste[rd][subj[t]] * qual[t];
  const freePick = (rd) => r.weighted(Array.from({ length: T }, (_, t) => want(rd, t)));
  // last year's log: most loans came off a screen that showed the five most-borrowed titles
  const pop = Array.from({ length: T }, (_, t) => (t < 5 ? 40 : 1) * qual[t]), log = [], history = Array.from({ length: R }, () => new Array(S).fill(0));
  for (let rd = 0; rd < R; rd++) for (let k = 0; k < 6; k++) { let t; if (r.chance(0.7)) { const top = pop.map((v, i) => [v, i]).sort((a, c) => c[0] - a[0]).slice(0, 5).map((x) => x[1]); t = top[r.weighted([0.4, 0.24, 0.16, 0.11, 0.09])]; } else t = freePick(rd); log.push([rd, t]); pop[t] += 1; history[rd][subj[t]]++; }
  const count = new Array(T).fill(0); log.forEach(([, t]) => count[t]++);
  // held back from everyone: a week with the screens off, every reader choosing from the open shelves
  const open = []; for (let rd = 0; rd < R; rd++) for (let k = 0; k < 3; k++) open.push([rd, freePick(rd)]);
  // a part of the log held out for the public board
  const pub = log.filter((_, i) => i % 4 === 0);
  return { T, R, S, subj, count, history, pub, open };
}
export function rank(L, a, b, slot) {
  const mx = Math.max(...L.count), score = (rd, t) => { const h = L.history[rd], tot = h.reduce((x, y) => x + y, 0) || 1; return a * (L.count[t] / mx) + b * (h[L.subj[t]] / tot); };
  const five = (rd) => { const top = Array.from({ length: L.T }, (_, t) => [score(rd, t), t]).sort((x, y) => y[0] - x[0] || x[1] - y[1]).map((x) => x[1]); if (!slot) return top.slice(0, 5); const quiet = top.filter((t) => L.count[t] <= 2); return [...top.slice(0, 4), quiet[(rd * 7) % (quiet.length || 1)] ?? top[4]]; };
  const lists = Array.from({ length: L.R }, (_, rd) => five(rd)), hit = (set) => set.filter(([rd, t]) => lists[rd].includes(t)).length / set.length;
  return { pub: hit(L.pub), hid: hit(L.open), kinds: new Set(lists.flat()).size };
}

// ---- Challenge III: the audit. Which groups lost the most breadth? ----
export function audit(C) {
  const rows = Object.entries(C.groups).map(([k, g]) => ({ key: k, name: C.groupNames[k], loans: g.loansLast, first: g.distinctFirst, last: g.distinctLast, drop: g.drop, rareFirst: g.rareFirst, rareLast: g.rareLast }));
  const worst = rows.slice().sort((a, b) => b.drop - a.drop).slice(0, 2).map((r) => r.key);
  return { rows, worst };
}

// ---- The finale: an experiment on a small copy of the library. Some slots show a title picked by lot. ----
const runs = new Map();
export function experiment({ pool = 'all', share = 0.2, split = true, months = 6, seed = 20261121 } = {}) {
  const key = [pool, share, split, months, seed].join('|'); if (runs.has(key)) return runs.get(key);
  const T = 900, R = 320, start = 72, active = new Set(); let off = 0;
  const q = simulate({ readers: R, titles: T, branches: 4, events: false, months: start + months, seed, explore: { share, pool, from: start, branches: split ? [0, 1] : null },
    onLoan: (m, r, t, inFive, slot, five, b) => { if (m < start) return; active.add(m * 1000 + r); if (slot < 0) off++; } });
  const shown = q.slotRandom.reduce((s, x) => s + x[0], 0), taken = q.slotRandom.reduce((s, x) => s + x[1], 0), p = shown ? taken / shown : 0, se = shown ? Math.sqrt((p * (1 - p)) / shown) : 0;
  const avg = (br, key2, a, b) => { let s = 0, n = 0; for (const j of br) for (let m = a; m < b; m++) { s += q.byBranch[j][key2][m]; n++; } return s / n; };
  const tr = split ? [0, 1] : [0, 1, 2, 3], co = split ? [2, 3] : [];
  const change = (br, key2) => avg(br, key2, start, start + months) / avg(br, key2, start - 12, start) - 1;
  const out = { shown, taken, rate: p, se, offRate: off / (T * active.size), split, months, share, pool,
    breadthT: change(tr, 'distinct'), breadthC: co.length ? change(co, 'distinct') : null,
    hitT: avg(tr, 'hit', start, start + months), hitBefore: avg(tr, 'hit', start - 12, start), hitC: co.length ? avg(co, 'hit', start, start + months) : null,
    surveyT: avg(tr, 'survey', start, start + months), surveyBefore: avg(tr, 'survey', start - 12, start), surveyC: co.length ? avg(co, 'survey', start, start + months) : null, surveyCBefore: co.length ? avg(co, 'survey', start - 12, start) : null,
    enough: shown >= 300 && se * 2 <= p * 0.3 };
  runs.set(key, out); return out;
}
