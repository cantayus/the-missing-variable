// Runs the library model once at full size and writes dist/js/sim/case-data.js.
// Every number on every evidence card is read from that file. Run: node scripts/simulate.mjs
import { writeFileSync } from 'node:fs';
import { simulate, DEFAULTS, PLANTED, SUBJECTS, FIELDS, fieldOf, isRare, yearAvg } from '../dist/js/sim/model.js';
import { titleName, authorName, BRANCHES, PIP_BOOK } from '../dist/js/sim/names.js';
import { RNG } from '../dist/js/core/rng.js';
import { kmeans, kmeanspp, silhouette, pca } from '../dist/js/algo/cluster.js';
import { lasso } from '../dist/js/algo/classify.js';
import { pagerank, modularity } from '../dist/js/algo/graph.js';
import { entropy, correlation, linreg, r2 } from '../dist/js/algo/stats.js';

const R = DEFAULTS.readers, T = DEFAULTS.titles, Y = 6, rd = (x, d = 3) => Math.round(x * 10 ** d) / 10 ** d;
// the loan log, kept here only to compute what an analyst could compute from four columns
const log = { m: [], r: [], t: [], hit: [], slot: [] };
const sim = simulate({ onLoan(m, r, t, inFive, slot) { log.m.push(m); log.r.push(r); log.t.push(t); log.hit.push(inFive ? 1 : 0); log.slot.push(slot); } });
const N = log.m.length, yr = (i) => Math.floor(log.m[i] / 12);
const C = { meta: { seed: DEFAULTS.seed, readers: R, titles: T, branches: DEFAULTS.branches, months: DEFAULTS.months, loans: N, storageBelow: DEFAULTS.storageBelow }, planted: PLANTED, branches: BRANCHES, fields: FIELDS };

// ---- yearly and monthly series ----
const yv = (a, d = 3) => Array.from({ length: Y }, (_, y) => rd(yearAvg(a, y), d));
C.y = { hit: yv(sim.hit), distinct: yv(sim.distinct, 0), top100: yv(sim.top100), loans: yv(sim.loans, 0), logged: yv(sim.logged, 0), gini: yv(sim.gini), survey: yv(sim.survey), offsite: Array.from({ length: Y }, (_, y) => rd(sim.offsiteShare[y * 12 + 11])) };
C.m = { hit: sim.hit.map((x) => rd(x)), distinct: sim.distinct, top100: sim.top100.map((x) => rd(x)), loans: sim.loans, logged: sim.logged };
C.branch = sim.byBranch.map((b) => ({ loans: b.loans, distinct: b.distinct, hit: b.hit.map((x) => rd(x, 2)) }));
C.y.entropy = sim.yearTitle.map((c) => rd(entropy(Array.from(c).filter((x) => x > 0).map((x) => x / c.reduce((a, b) => a + b, 0))), 2));

// ---- titles ----
const last = sim.yearTitle[Y - 1], first = sim.yearTitle[0], sortedLast = Array.from(last).sort((a, b) => a - b);
const buckets = [[0, 0], [1, 1], [2, 2], [3, 5], [6, 10], [11, 20], [21, 50], [51, 1e9]], histOf = (c) => buckets.map(([lo, hi]) => { let n = 0; for (const x of c) if (x >= lo && x <= hi) n++; return n; });
const name = (t) => titleName(t, fieldOf(sim.tSubj[t]));
const topIds = Array.from({ length: T }, (_, i) => i).sort((a, b) => last[b] - last[a]).slice(0, 24);
C.titles = { medianLast: sortedLast[T >> 1], zeroLast: rd(sortedLast.filter((x) => x === 0).length / T), zeroFirst: rd(Array.from(first).filter((x) => x === 0).length / T), bucketLabels: ['0', '1', '2', '3–5', '6–10', '11–20', '21–50', '51+'], histFirst: histOf(first), histLast: histOf(last), maxLast: sortedLast[T - 1], top: topIds.map((t) => ({ id: t, name: name(t), author: authorName(t), subject: SUBJECTS[sim.tSubj[t]], first: first[t], last: last[t] })) };
// a sample of title loan counts for the beam and the boxplot (last year), kept sorted
{ const rng = new RNG(11); C.titles.sampleLast = rng.sample(Array.from(last), 60).sort((a, b) => a - b); C.titles.sampleFirst = rng.sample(Array.from(first), 60).sort((a, b) => a - b); }

// ---- subjects ----
const sy = (y) => Array.from(sim.yearSubj[y]), tot = (a) => a.reduce((x, y) => x + y, 0);
const s6 = sy(Y - 1), s1 = sy(0), under = s6.map((x, i) => [x / tot(s6), i]).filter((a) => a[0] < 0.01);
C.subjects = { names: SUBJECTS, first: s1, last: s6, under1: under.length, under1Share: rd(under.reduce((a, b) => a + b[0], 0)), total: 40, rareShareFirst: rd(tot(s1.filter((_, i) => isRare(i))) / tot(s1)), rareShareLast: rd(tot(s6.filter((_, i) => isRare(i))) / tot(s6)) };

// ---- planted events, measured ----
{ const b = sim.byBranch[PLANTED.outageBranch], m = PLANTED.outageMonth, av = (a, i, j) => a.slice(i, j).reduce((x, y) => x + y, 0) / (j - i);
  C.outage = { branch: BRANCHES[PLANTED.outageBranch], days: PLANTED.outageDays, month: m, distinctBefore: Math.round(av(b.distinct, m - 3, m)), distinctDuring: b.distinct[m], distinctAfter: Math.round(av(b.distinct, m + 1, m + 4)), hitBefore: rd(av(b.hit, m - 3, m), 2), hitDuring: rd(b.hit[m], 2), loansBefore: Math.round(av(b.loans, m - 3, m)), loansDuring: b.loans[m] };
  C.outage.perLoanBefore = rd(C.outage.distinctBefore / C.outage.loansBefore, 2); C.outage.perLoanDuring = rd(C.outage.distinctDuring / C.outage.loansDuring, 2);
  const [a, z] = PLANTED.migrationMonths; let real = 0, logged = 0; for (let i = a; i <= z; i++) { real += sim.loans[i]; logged += sim.logged[i]; }
  C.migration = { from: a, to: z, branches: PLANTED.migrationBranches.map((i) => BRANCHES[i]), real, logged, extra: logged - real, extraShare: rd((logged - real) / real) };
  let dn = 0, dr = 0, dt = 0, orr = 0, ot = 0; for (let r = 0; r < R; r++) { if (sim.dropped[r]) { dn++; dr += sim.rareCnt[r]; dt += sim.totCnt[r]; } else { orr += sim.rareCnt[r]; ot += sim.totCnt[r]; } }
  C.cleaning = { readers: dn, rareShareDropped: rd(dr / dt, 2), rareShareOthers: rd(orr / ot, 2) };
}

// ---- baskets: what each reader borrowed in the last two years ----
const basket = Array.from({ length: R }, () => new Set()); for (let i = 0; i < N; i++) if (log.m[i] >= 48) basket[log.r[i]].add(log.t[i]);
{ const sup = new Int32Array(T); let nb = 0; for (const b of basket) { if (!b.size) continue; nb++; for (const t of b) sup[t]++; }
  let can = 0, borrowed = 0; for (let t = 0; t < T; t++) { if (sup[t] > 0) borrowed++; if (sup[t] / nb >= 0.02) can++; }
  C.support = { min: 0.02, baskets: nb, titlesCan: can, share: rd(can / T), shareOfBorrowed: rd(can / borrowed) };
  // twelve named titles and 260 baskets cut down to them, for the basket and lattice instruments
  const ids = Array.from({ length: T }, (_, i) => i).sort((a, b) => sup[b] - sup[a]), pickIds = [...ids.slice(0, 7), ...ids.slice(60, 62), ...ids.slice(400, 403)];
  const rows = []; for (const b of basket) { const row = pickIds.map((t, j) => (b.has(t) ? j : -1)).filter((j) => j >= 0); if (row.length >= 2 && rows.length < 260) rows.push(row); }
  C.baskets = { items: pickIds.map(name), support: pickIds.map((t) => rd(sup[t] / nb)), rows };
  // a small reader-by-title grid (I-11): 14 readers, 12 titles
  const rs = []; for (let r = 0; r < R && rs.length < 14; r++) if (pickIds.filter((t) => basket[r].has(t)).length >= 3 || (rs.length < 4 && basket[r].size > 3)) rs.push(r);
  C.grid = { titles: pickIds.map(name), rows: rs.map((r) => pickIds.map((t) => (basket[r].has(t) ? 1 : 0))) };
  let pairs = 0; for (const b of basket) pairs += b.size; C.sparsity = { filled: rd(pairs / (R * T), 5), empty: rd(1 - pairs / (R * T), 4) };
}

// ---- baselines scored on the same log (last year) ----
{ const prev = Array.from({ length: 72 }, () => new Map()); for (let i = 0; i < N; i++) { const m = log.m[i]; prev[m].set(log.t[i], (prev[m].get(log.t[i]) || 0) + 1); }
  const topAll = prev.map((mp) => [...mp.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map((a) => a[0]));
  const topField = prev.map((mp) => { const by = Array.from({ length: 8 }, () => []); for (const [t, c] of mp) by[fieldOf(sim.tSubj[t])].push([c, t]); return by.map((l) => l.sort((a, b) => b[0] - a[0]).slice(0, 5).map((a) => a[1])); });
  let n = 0, h = 0, a5 = 0, f5 = 0; const dom = (r) => sim.dominant(r);
  for (let i = 0; i < N; i++) { const m = log.m[i]; if (m < 60) continue; n++; h += log.hit[i]; if (topAll[m - 1].includes(log.t[i])) a5++; if (topField[m - 1][dom(log.r[i])].includes(log.t[i])) f5++; }
  const top30 = prev.map((mp) => [...mp.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30).map((a) => a[0])), hist = Array.from({ length: R }, () => []); let pn = 0, offered = new Set();
  for (let i = 0; i < N; i++) { const m = log.m[i], r = log.r[i], t = log.t[i]; if (m >= 60) { const five = top30[m - 1].filter((x) => !hist[r].includes(x)).slice(0, 5); for (const x of five) offered.add(x); if (five.includes(t)) pn++; } hist[r].push(t); if (hist[r].length > 24) hist[r].shift(); }
  C.baseline = { marginalia: rd(h / n), topFive: rd(a5 / n), topFiveField: rd(f5 / n), popularUnread: rd(pn / n), offeredUnread: offered.size, recallFive: rd(5 / T, 4), recallUnread: rd(offered.size / T, 4), firstYear: C.y.hit[0] };
  // validation: the same popularity model scored on shuffled loans and forward in time
  const rng = new RNG(5), idx = []; for (let i = 0; i < N; i++) if (log.m[i] >= 36) idx.push(i);
  const score = (train, test) => { const c = new Map(); for (const i of train) c.set(log.t[i], (c.get(log.t[i]) || 0) + 1); const top = new Set([...c.entries()].sort((a, b) => b[1] - a[1]).slice(0, 100).map((a) => a[0])); let k = 0; for (const i of test) if (top.has(log.t[i])) k++; return k / test.length; };
  const sh = rng.shuffle(idx.slice()), cut = Math.floor(sh.length * 0.8);
  // validation: a "top five for your department" model, scored on shuffled loans of year three and then forward on year four
  const dscore = (train, test) => { const by = new Map(); for (const i of train) { const d = sim.rDept[log.r[i]]; if (d < 0) continue; const mp = by.get(d) || by.set(d, new Map()).get(d); mp.set(log.t[i], (mp.get(log.t[i]) || 0) + 1); } const top = new Map([...by].map(([d, mp]) => [d, new Set([...mp.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map((a) => a[0]))])); let k = 0, n = 0; for (const i of test) { const d = sim.rDept[log.r[i]]; if (d < 0) continue; n++; if (top.get(d)?.has(log.t[i])) k++; } return k / n; };
  const y3 = []; for (let i = 0; i < N; i++) if (log.m[i] >= 24 && log.m[i] < 36) y3.push(i); const s3 = rng.shuffle(y3.slice()), c3 = Math.floor(s3.length * 0.8), y4 = []; for (let i = 0; i < N; i++) if (log.m[i] >= 36 && log.m[i] < 48) y4.push(i);
  C.validation = { shuffled: rd(dscore(s3.slice(0, c3), s3.slice(c3))), forward: rd(dscore(y3, y4)), year: 3, next: 4 };
}

// ---- reader vectors by subject, first and last year ----
const vec = (y) => { const out = []; for (let r = 0; r < R; r++) { const v = sim.yearReaderSubj[y][r]; if (!v) continue; let s = 0; for (const x of v) s += x; if (s >= 4) out.push({ r, v: Array.from(v).map((x) => x / s), n: s }); } return out; };
const V1 = vec(0), V6 = vec(Y - 1);
{ const rng = new RNG(3), bestK = (V) => { const pts = rng.sample(V, 320).map((a) => a.v), sil = []; for (let k = 2; k <= 10; k++) { let best = -1; for (let rep = 0; rep < 3; rep++) { const res = kmeans(pts, kmeanspp(pts, k, rng)); best = Math.max(best, silhouette(pts, res.labels)); } sil.push(rd(best)); } return { sil, k: sil.indexOf(Math.max(...sil)) + 2 }; };
  const a = bestK(V1), b = bestK(V6); C.k = { first: a.k, last: b.k, silFirst: a.sil, silLast: b.sil };
  // two-dimensional maps of readers for the cluster instruments
  const proj = (V) => { const pts = rng.sample(V, 220), P = pca(pts.map((a) => a.v)), c0 = P.vectors[0], c1 = P.vectors[1]; return pts.map((a) => { let x = 0, y = 0; a.v.forEach((q, i) => { x += (q - P.mu[i]) * c0[i]; y += (q - P.mu[i]) * c1[i]; }); const top = a.v.indexOf(Math.max(...a.v)); return [rd(x), rd(y), fieldOf(top), isRare(top) ? 1 : 0]; }); };
  C.readers = { first: proj(V1), last: proj(V6) };
  const P = pca(V6.map((a) => a.v)), tv = P.values.reduce((x, y) => x + Math.max(0, y), 0), ex = P.values.slice(0, 10).reduce((x, y) => x + y, 0) / tv;
  let keptRare = 0, allRare = 0, keptCom = 0, allCom = 0; for (let i = 0; i < 40; i++) { let kept = 0, all = 0; P.vectors.forEach((c, j) => { const w = Math.max(0, P.values[j]) * c[i] * c[i]; all += w; if (j < 10) kept += w; }); if (isRare(i)) { keptRare += kept; allRare += all; } else { keptCom += kept; allCom += all; } }
  C.pca = { components: 10, explained: rd(ex), rareKept: rd(keptRare / allRare), commonKept: rd(keptCom / allCom) };
  // lasso: which subjects still help predict how much a reader follows the screen
  const fol = new Float64Array(R), cntR = new Float64Array(R); for (let i = 0; i < N; i++) if (log.m[i] >= 60) { fol[log.r[i]] += log.hit[i]; cntR[log.r[i]]++; }
  const X = V6.map((a) => a.v.map((q) => q * 5)), yv2 = V6.map((a) => (cntR[a.r] ? fol[a.r] / cntR[a.r] : 0)), my = yv2.reduce((x, y) => x + y, 0) / yv2.length, yc = yv2.map((q) => q - my); let w = null; for (let lam = 0.2; lam > 0.0005; lam *= 0.85) { w = lasso(X, yc, lam); if (w.nonzero >= 4) { C.lassoLambda = rd(lam, 4); break; } }
  const ws = w.w, kept = ws.map((q, i) => (Math.abs(q) > 1e-6 ? i : -1)).filter((i) => i >= 0);
  C.lasso = { total: 40, kept: kept.length, rareTotal: 16, rareKept: kept.filter(isRare).length, names: kept.map((i) => SUBJECTS[i]) };
  const br = (V) => V.filter((a) => { const f = new Set(); a.v.forEach((q, i) => { if (q >= 0.15) f.add(fieldOf(i)); }); return f.size >= 3; }).length / V.length;
  C.bridge = { first: rd(br(V1), 2), last: rd(br(V6), 2) };
  const mix = V1.find((a) => { const f = new Array(8).fill(0); a.v.forEach((q, i) => (f[fieldOf(i)] += q)); const s = f.slice().sort((x, y) => y - x); return a.n >= 20 && s[0] > 0.5 && s[0] < 0.68 && s[1] > 0.22 && s[2] > 0.07 && s[2] < 0.14; });
  if (mix) { const f = new Array(8).fill(0); mix.v.forEach((q, i) => (f[fieldOf(i)] += q)); C.mix = f.map((q, i) => [FIELDS[i], rd(q, 2)]).sort((a, b) => b[1] - a[1]).slice(0, 3); } else C.mix = [['History', 0.6], ['Literature', 0.3], ['Nature', 0.1]];
  const rareMain = V6.filter((a) => isRare(a.v.indexOf(Math.max(...a.v)))).length; C.noise = { rareMain: rd(rareMain / V6.length), rareMainFirst: rd(V1.filter((a) => isRare(a.v.indexOf(Math.max(...a.v)))).length / V1.length) };
}

// ---- what the ranker leans on (titles, last month) ----
{ const X = [], yb = [], rng = new RNG(9), prevYear = sim.yearTitle[Y - 2], pool = new Set(Array.from({ length: T }, (_, i) => i).sort((a, b) => sim.cntLast[b] - sim.cntLast[a]).slice(0, 160));
  for (let t = 0; t < T; t++) { if (last[t] + prevYear[t] === 0 && rng.chance(0.8)) continue; X.push([prevYear[t], sim.tQual[t], sim.tSubj[t] % 5]); yb.push(pool.has(t) ? 1 : 0); }
  let bestTh = 0, bestG = -1; const gi = (p, n) => (n ? 2 * (p / n) * (1 - p / n) : 0), P0 = yb.reduce((a, b) => a + b, 0), n0 = yb.length;
  for (let th = 1; th < 400; th++) { let nl = 0, pl = 0; for (let i = 0; i < n0; i++) if (X[i][0] <= th) { nl++; pl += yb[i]; } const nr = n0 - nl, pr = P0 - pl; if (nl < 20 || nr < 20) continue; const g = gi(P0, n0) - (nl * gi(pl, nl) + nr * gi(pr, nr)) / n0; if (g > bestG) { bestG = g; bestTh = th; } }
  let above = 0, aboveIn = 0; for (let i = 0; i < n0; i++) if (X[i][0] > bestTh) { above++; aboveIn += yb[i]; }
  C.tree = { feature: 'loans last year', threshold: bestTh, above, aboveInPool: rd(aboveIn / above, 2), pool: 160 };
  const xs = [], ys = []; for (let t = 0; t < T; t++) if (prevYear[t] + last[t] > 0) { xs.push(prevYear[t]); ys.push(last[t]); }
  const fit = linreg(xs, ys); C.regression = { r2: rd(r2(ys, xs.map((x) => fit.a + fit.b * x)), 2), slope: rd(fit.b, 2), n: xs.length };
  let sh = 0, shLoans = 0, un = 0, unLoans = 0; for (let t = 0; t < T; t++) { if (sim.shownLast[t] > 0) { sh++; shLoans += sim.cntLast[t]; } else { un++; unLoans += sim.cntLast[t]; } }
  C.shown = { titlesShown: sh, shareShown: rd(sh / T), loansPerShown: rd(shLoans / sh, 1), loansPerUnshown: rd(unLoans / un, 3) };
  C.importance = { lastMonth: rd(Math.abs(correlation(Array.from(sim.cntLast), Array.from(sim.shownLast))), 2), quality: rd(Math.abs(correlation(Array.from(sim.tQual), Array.from(sim.shownLast))), 2) };
}

// ---- graph of titles borrowed one after another (last year) ----
{ const lastOf = new Int32Array(R).fill(-1), edges = new Map(); for (let i = 0; i < N; i++) { if (log.m[i] < 60) continue; const r = log.r[i], t = log.t[i], p = lastOf[r]; if (p >= 0 && p !== t) { const k = p * T + t; edges.set(k, (edges.get(k) || 0) + 1); } lastOf[r] = t; }
  const ids = new Map(), nodes = []; const id = (t) => { if (!ids.has(t)) { ids.set(t, nodes.length); nodes.push(t); } return ids.get(t); }; const E = []; for (const [k, w] of edges) E.push([id(Math.floor(k / T)), id(k % T), w]);
  const g = { n: nodes.length, edges: E, directed: true }, pr = pagerank(g), order = pr.map((p, i) => [p, i]).sort((a, b) => b[0] - a[0]);
  C.pagerank = { nodes: nodes.length, top100: rd(order.slice(0, 100).reduce((a, b) => a + b[0], 0)) };
  // 26 titles for the walk instrument: the 8 with most rank, and 18 others
  const keep = [...order.slice(0, 8), ...order.filter((_, i) => i % Math.floor(order.length / 18) === 7).slice(0, 18)].map((a) => a[1]), km = new Map(keep.map((n, i) => [n, i]));
  C.tgraph = { names: keep.map((n) => name(nodes[n])), edges: E.filter((e) => km.has(e[0]) && km.has(e[1])).map((e) => [km.get(e[0]), km.get(e[1])]) };
}
// ---- reader graphs: two readers are linked when they share a field of reading ----
{ const mk = (V, seed) => { const rng = new RNG(seed), ps = rng.sample(V.filter((a) => a.n >= 8), 34), edges = []; for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) { let s = 0; for (let q = 0; q < 40; q++) s += Math.min(ps[i].v[q], ps[j].v[q]); if (s > 0.42) edges.push([i, j]); } return { n: ps.length, edges, field: ps.map((a) => fieldOf(a.v.indexOf(Math.max(...a.v)))) }; };
  C.rgraph = { first: mk(V1, 21), last: mk(V6, 22) };
  for (const k of ['first', 'last']) { const g = C.rgraph[k]; g.modularity = rd(modularity(g, g.field), 2); g.density = rd(g.edges.length / (g.n * (g.n - 1) / 2), 2); }
}

// ---- groups ----
C.groups = {}; for (const [k, g] of Object.entries(sim.groups)) C.groups[k] = { loansFirst: g[0].loans, loansLast: g[Y - 1].loans, distinctFirst: g[0].set.size, distinctLast: g[Y - 1].set.size, drop: rd(1 - g[Y - 1].set.size / g[Y - 1].loans / (g[0].set.size / g[0].loans), 2), rareFirst: rd(g[0].rare / g[0].loans, 3), rareLast: rd(g[Y - 1].rare / g[Y - 1].loans, 3) };
C.groupNames = { child: "Children's cards", part: 'Part-time students', small: 'Small departments', town: 'Town readers', other: 'Everyone else' };
C.slots = { adult: sim.slotAdult.map((x) => rd(x / sim.slotAdult.reduce((a, b) => a + b, 0))), child: sim.slotChild.map((x) => rd(x / sim.slotChild.reduce((a, b) => a + b, 0))) };

// ---- next-loan guessing: how often is a reader's next loan one of the 100 commonest? ----
C.guess = { first: rd(yearAvg(sim.top100, 0)), last: rd(yearAvg(sim.top100, Y - 1)), bitsFirst: C.y.entropy[0], bitsLast: C.y.entropy[Y - 1] };

// ---- Pip's book: a picture book nobody has borrowed for years ----
{ let pip = -1; for (let t = 0; t < T && pip < 0; t++) if (fieldOf(sim.tSubj[t]) === 7 && sim.yearTitle[0][t] > 0 && sim.yearTitle[3][t] + sim.yearTitle[4][t] + sim.yearTitle[5][t] === 0) pip = t;
  let lastYear = 0; for (let y = 0; y < Y; y++) if (pip >= 0 && sim.yearTitle[y][pip] > 0) lastYear = y + 1;
  C.pip = { id: pip, name: PIP_BOOK, lastBorrowedYear: lastYear, offsite: pip >= 0 ? sim.offsite[pip] : 1 };
}
// ---- a page of the loan log for the tablet ----
{ const rng = new RNG(77), rows = []; for (let k = 0; k < 14; k++) { const i = N - 1 - rng.int(0, 4000), m = log.m[i]; rows.push([1000 + ((log.r[i] * 7919) % 9000), name(log.t[i]), `Year ${Math.floor(m / 12) + 1}, month ${(m % 12) + 1}`, BRANCHES[sim.rBranch[log.r[i]]]]); } C.logPage = rows; }

// ---- small samples for the Case rounds of instruments ----
{ const rng = new RNG(31), prevYear = sim.yearTitle[Y - 2], ids = []; for (let t = 0; t < T; t++) if (prevYear[t] + last[t] > 0) ids.push(t);
  C.pairs = [...ids.slice().sort((a, b) => last[b] - last[a]).slice(0, 14), ...rng.sample(ids, 50)].map((t) => [prevYear[t], last[t]]);
  const shown = [], un = []; for (let t = 0; t < T; t++) (sim.shownLast[t] > 0 ? shown : un).push(t);
  C.shownSample = [...shown.map((t) => [sim.shownLast[t], sim.cntLast[t]]), ...rng.sample(un, 46).map((t) => [0, sim.cntLast[t]])];
  // light and heavy readers by raw counts in the two largest fields (last year)
  const fs = FIELDS.map((_, f) => [s6.slice(f * 5, f * 5 + 5).reduce((a, b) => a + b, 0), f]).sort((a, b) => b[0] - a[0]), fa = fs[0][1], fb = fs[1][1], rr = [];
  for (let r = 0; r < R; r++) { const v = sim.yearReaderSubj[Y - 1][r]; if (!v) continue; let a = 0, b = 0; for (let q = 0; q < 5; q++) { a += v[fa * 5 + q]; b += v[fb * 5 + q]; } if (a + b >= 2 && a !== b) rr.push([a, b, a > b ? 0 : 1]); }
  C.lightReaders = { fields: [FIELDS[fa], FIELDS[fb]], pts: rng.sample(rr, 70) };
  // what a tree sees: titles by last year's loans and quality, and whether they reach the shortlist
  { const pool = Array.from({ length: T }, (_, i) => i).sort((a, b) => sim.cntLast[b] - sim.cntLast[a]).slice(0, 160), ps = new Set(pool), non = ids.filter((t) => !ps.has(t));
    C.treeSample = [...shown.map((t) => [rd(Math.log10(1 + prevYear[t]), 2), rd(sim.tQual[t], 2), 1]), ...rng.sample(un.filter((t) => prevYear[t] + last[t] > 0), 64).map((t) => [rd(Math.log10(1 + prevYear[t]), 2), rd(sim.tQual[t], 2), 0])]; }
  // how much of each kind of subject survives when a reader is kept as k numbers
  { const P = pca(V6.map((a) => a.v)), cum = [], rareC = [], comC = []; let allRare = 0, allCom = 0; const per = P.vectors.map((c, j) => { let r = 0, cm = 0; for (let i = 0; i < 40; i++) { const w = Math.max(0, P.values[j]) * c[i] * c[i]; if (isRare(i)) r += w; else cm += w; } allRare += r; allCom += cm; return [r, cm]; }); let ar = 0, ac = 0, ae = 0; per.forEach(([r, cm], j) => { ar += r; ac += cm; ae += P.explained[j]; cum.push(rd(ae)); rareC.push(rd(ar / allRare)); comC.push(rd(ac / allCom)); }); C.pca.curve = cum; C.pca.rareCurve = rareC; C.pca.commonCurve = comC;
    const k = PLANTED.profile, rec = V6.map((a) => { const z = P.project(a.v, k); let e = 0; for (let i = 0; i < 40; i++) { let x = P.mu[i]; for (let j = 0; j < k; j++) x += z[j] * P.vectors[j][i]; e += (a.v[i] - x) ** 2; } let rs = 0; a.v.forEach((q, i) => { if (isRare(i)) rs += q; }); return [rd(Math.sqrt(e), 3), rd(rs, 2)]; });
    C.recon = { k, sample: rng.sample(rec, 36), errRare: rd(rec.filter((x) => x[1] >= 0.3).reduce((a, b) => a + b[0], 0) / Math.max(1, rec.filter((x) => x[1] >= 0.3).length), 3), errOther: rd(rec.filter((x) => x[1] < 0.3).reduce((a, b) => a + b[0], 0) / Math.max(1, rec.filter((x) => x[1] < 0.3).length), 3) }; }
  // "the same k titles for everyone", scored on last year's log
  const prev = Array.from({ length: 72 }, () => new Map()); for (let i = 0; i < N; i++) { const m = log.m[i]; prev[m].set(log.t[i], (prev[m].get(log.t[i]) || 0) + 1); }
  const ks = [1, 2, 5, 10, 20, 50, 100, 500, 2000, T], hit = ks.map(() => 0); let n = 0; const rank = prev.map((mp) => new Map([...mp.entries()].sort((a, b) => b[1] - a[1]).map((a, i) => [a[0], i])));
  for (let i = 0; i < N; i++) { const m = log.m[i]; if (m < 60) continue; n++; const rk = rank[m - 1].get(log.t[i]) ?? T; ks.forEach((k, j) => { if (rk < k) hit[j]++; }); }
  C.baseline.ks = ks; C.baseline.curve = hit.map((h) => rd(h / n));
  // the readers the cleaning step dropped, on the last-year map
  C.subjectShare = s6.map((x) => rd(x / tot(s6), 4)).sort((a, b) => b - a);
}

writeFileSync(new URL('../dist/js/sim/case-data.js', import.meta.url), '// Written by scripts/simulate.mjs from the seeded library model. Do not edit by hand.\nexport const CASE = ' + JSON.stringify(C) + ';\n');
const kb = (JSON.stringify(C).length / 1024).toFixed(0);
console.log(`case-data.js written (${kb} KB). loans ${N}`);
console.log('hit', C.y.hit.join(' '), '| distinct', C.y.distinct.join(' '), '| top100', C.y.top100.join(' '));
console.log('median last', C.titles.medianLast, 'zero', C.titles.zeroLast, '| under1', C.subjects.under1, '| k', C.k.first, C.k.last, '| lasso', C.lasso.kept, C.lasso.rareKept, '| tree', JSON.stringify(C.tree));
console.log('k sil', C.k.silFirst.join(' '), '|', C.k.silLast.join(' '), 'mod', C.rgraph.first.modularity, C.rgraph.last.modularity, C.rgraph.first.density, C.rgraph.last.density, 'lam', C.lassoLambda, C.lasso.names.join(','));
console.log('baseline', JSON.stringify(C.baseline), 'validation', JSON.stringify(C.validation));
console.log('outage', JSON.stringify(C.outage)); console.log('migration', JSON.stringify(C.migration), 'cleaning', JSON.stringify(C.cleaning));
console.log('support', JSON.stringify(C.support), 'pca', JSON.stringify(C.pca), 'bridge', JSON.stringify(C.bridge), 'pr', JSON.stringify(C.pagerank));
console.log('groups', JSON.stringify(C.groups)); console.log('slots', JSON.stringify(C.slots), 'mix', JSON.stringify(C.mix), 'pip', JSON.stringify(C.pip), 'shown', JSON.stringify(C.shown), 'imp', JSON.stringify(C.importance), 'reg', JSON.stringify(C.regression), 'noise', JSON.stringify(C.noise), 'sparsity', JSON.stringify(C.sparsity), 'entropy', C.y.entropy.join(' '));
