// One seeded model of the Common Shelf. The Node script runs it at full size and writes the case data;
// the finale runs a smaller copy in the browser for the player's experiment. All of it is invented data.
import { RNG } from '../core/rng.js';

export const FIELDS = ['History', 'Literature', 'Science', 'Arts', 'Society', 'Technology', 'Nature', 'Children'];
export const SUBJECTS = [
  'Ancient worlds', 'Modern history', 'Biography', 'Local history', 'Medieval lives',
  'Novels', 'Mystery', 'Essays', 'Poetry', 'Plays',
  'Biology', 'Physics', 'Mathematics', 'Astronomy', 'Chemistry',
  'Film', 'Music', 'Painting', 'Photography', 'Architecture',
  'Psychology', 'Economics', 'Politics', 'Education', 'Law',
  'Computing', 'Data and statistics', 'Engineering', 'Design', 'Robotics',
  'Gardening', 'Birds', 'Weather', 'Geology', 'Botany',
  'Picture books', 'Animal stories', 'Fairy tales', 'First readers', 'Puzzles and games',
];
export const fieldOf = (s) => Math.floor(s / 5);
const SUBJ_W = [0.4, 0.27, 0.18, 0.1, 0.05];           // within a field: the last two subjects are the rare ones
const FIELD_W = [0.12, 0.2, 0.13, 0.1, 0.13, 0.12, 0.08, 0.12];
export const isRare = (s) => s % 5 >= 3;
export const POS_ADULT = [0.4, 0.24, 0.16, 0.11, 0.09], POS_CHILD = [0.68, 0.16, 0.08, 0.05, 0.03];

export const DEFAULTS = {
  seed: 20261121, readers: 2000, titles: 6000, branches: 8, months: 72,
  prominence: [0.27, 0.43, 0.6],     // how much of the screen the five suggestions take up in each version
  friction: 0.62,                    // chance a reader gives up on a book that is in off-site storage
  storageBelow: 2,                   // loans in a year below which a title is sent to storage
  events: true,                      // the planted events of the story
  explore: null,                     // { share, pool: 'all'|'tail', branches: [..], from, noise }
  engine: null,                      // force one engine version (0, 1 or 2) for the whole run
};

// Planted facts of the story that are not produced by the loop itself. Every card reads them from the data file.
export const PLANTED = { screenLogDays: 30, outageDays: 11, outageMonth: 52, outageBranch: 3, migrationMonths: [40, 43], migrationBranches: [2, 5], cleanedShare: 0.01, handCards: 12000, deskRules: 40, clusters: 8, profile: 16, components: 10, remembers: 3, forgets: 30 };

export function simulate(opts = {}) {
  const o = { ...DEFAULTS, ...opts }, R = o.readers, T = o.titles, B = o.branches, M = o.months, rng = new RNG(o.seed);
  // ---- titles ----
  const tSubj = new Uint8Array(T), tQual = new Float32Array(T), tFame = new Float32Array(T), bySubj = Array.from({ length: 40 }, () => []);
  for (let t = 0; t < T; t++) { const f = rng.weighted(FIELD_W), s = f * 5 + rng.weighted(SUBJ_W); tSubj[t] = s; tQual[t] = Math.max(0.05, Math.min(1, rng.n(0.55, 0.18))); bySubj[s].push(t); }
  for (const list of bySubj) list.forEach((t, i) => { tFame[t] = Math.pow(i + 4, -0.55); });
  const offsite = new Uint8Array(T);
  const subjCum = bySubj.map((list) => { let a = 0; return list.map((t) => (a += Math.sqrt(tFame[t]) * (0.3 + tQual[t]))); });
  const pickIn = (s) => { const cum = subjCum[s], list = bySubj[s]; if (!list.length) return -1; const x = rng.u() * cum[cum.length - 1]; let lo = 0, hi = cum.length - 1; while (lo < hi) { const m = (lo + hi) >> 1; if (cum[m] < x) lo = m + 1; else hi = m; } return list[lo]; };
  // ---- readers ----
  const rType = new Uint8Array(R), rBranch = new Uint8Array(R), rDept = new Int8Array(R), rPart = new Uint8Array(R), rRate = new Float32Array(R), rTaste = [], rHouse = new Int32Array(R).fill(-1);
  // types: 0 student, 1 staff, 2 town, 3 child
  let house = 0;
  for (let r = 0; r < R; r++) {
    const child = r % 6 === 5; rType[r] = child ? 3 : rng.weighted([0.55, 0.15, 0.3]);
    rDept[r] = rType[r] < 2 ? (rng.chance(0.12) ? 12 + rng.int(0, 3) : rng.int(0, 11)) : -1;       // departments 12 to 15 are small
    rPart[r] = rType[r] === 0 && rng.chance(0.25) ? 1 : 0;
    rBranch[r] = rDept[r] >= 0 ? rDept[r] % B : rng.int(0, B - 1);
    const f1 = child ? 7 : rDept[r] >= 0 ? (rng.chance(0.7) ? rDept[r] % 7 : rng.int(0, 6)) : rng.weighted([0.14, 0.26, 0.1, 0.12, 0.12, 0.08, 0.18, 0]);
    const s1 = f1 * 5 + rng.weighted(SUBJ_W), f2 = child ? (rng.chance(0.6) ? 7 : 6) : rng.chance(0.5) ? f1 : rng.int(0, 6), s2 = f2 * 5 + rng.weighted(SUBJ_W);
    const f3 = child ? rng.pick([7, 6, 1]) : rng.int(0, 6), s3 = f3 * 5 + (rng.chance(0.55) ? 3 + rng.int(0, 1) : rng.weighted(SUBJ_W));
    rTaste.push([s1, s2, s3]);
    rRate[r] = Math.min(12, Math.exp(rng.n(0.62, 0.6))) * (rPart[r] ? 0.55 : 1) * (child ? 1.25 : 1);
    if ((rType[r] === 2 || child) && rng.chance(0.5)) { rHouse[r] = house; if (rng.chance(0.4)) house++; }
  }
  // the planted reading lists: six departments, five titles each, in year three
  const lists = {};
  if (o.events) for (const d of [0, 2, 3, 5, 8, 9]) { const f = d % 7, s = f * 5 + rng.int(0, 1), l = bySubj[s]; lists[d] = [0, 1, 2, 3, 4].map(() => l[10 + rng.int(0, Math.min(40, l.length - 11))]); }
  // ---- state ----
  const monthCnt = [], cnt12 = new Int32Array(T), cntLast = new Int32Array(T), shownLast = new Int32Array(T), shownNow = new Int32Array(T);
  const recent = Array.from({ length: R }, () => []), fieldCnt = Array.from({ length: R }, () => new Uint16Array(8)), rareCnt = new Uint32Array(R), totCnt = new Uint32Array(R);
  const dropped = new Uint8Array(R); let subjTop = [], clusterTop = [], globalTop = [], v3Top = [];
  const out = {
    o, hit: [], distinct: [], top100: [], loans: [], logged: [], gini: [], offsiteShare: [], byBranch: Array.from({ length: B }, () => ({ loans: [], distinct: [], hit: [], survey: [] })),
    slotAdult: [0, 0, 0, 0, 0], slotChild: [0, 0, 0, 0, 0], yearTitle: [], yearSubj: [], yearReaderSubj: [], groups: {}, randomShown: 0, randomTaken: 0, baseShown: 0, baseTaken: 0, slotRandom: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]], survey: [],
    tSubj, tQual, tFame, offsite, rType, rBranch, rDept, rPart, rTaste, rHouse, dropped, lists,
  };
  const version = (m) => (o.engine != null ? o.engine : m < 24 ? 0 : m < 48 ? 1 : 2);
  const dominant = (r) => { let b = 0; const f = fieldCnt[r]; for (let i = 1; i < 8; i++) if (f[i] > f[b]) b = i; return totCnt[r] ? b : fieldOf(rTaste[r][0]); };
  const topN = (ids, score, n) => ids.map((t) => [score(t), t]).filter((a) => a[0] > 0).sort((a, b) => b[0] - a[0] || a[1] - b[1]).slice(0, n).map((a) => a[1]);
  const all = Array.from({ length: T }, (_, i) => i);
  function retrain(m) {
    const v = version(m);
    if (v === 0) subjTop = bySubj.map((l) => topN(l, (t) => cnt12[t] + tFame[t] * 0.5, 36));
    if (v >= 1 && o.events) { // the cleaning step: drop the 1% of readers whose loans are the most unusual
      const sc = []; for (let r = 0; r < R; r++) if (totCnt[r] >= 6) sc.push([rareCnt[r] / totCnt[r], r]); sc.sort((a, b) => b[0] - a[0]); dropped.fill(0); for (let i = 0; i < Math.round(R * 0.01) && i < sc.length; i++) dropped[sc[i][1]] = 1;
    }
    globalTop = topN(all, (t) => cnt12[t], 12);
    if (v === 1) { const cc = Array.from({ length: 8 }, () => new Map()); for (let r = 0; r < R; r++) { if (dropped[r]) continue; const c = cc[dominant(r)]; for (const t of recent[r]) c.set(t, (c.get(t) || 0) + 1); } clusterTop = cc.map((c) => [...c.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0]).slice(0, 30).map((a) => a[0])); }
    if (v === 2) { const base = topN(all, (t) => Math.pow(cntLast[t], 1.1) * (1 + 0.6 * Math.min(1, shownLast[t] / (R * 0.2))), 160); v3Top = Array.from({ length: 8 }, (_, f) => base.map((t) => [Math.pow(cntLast[t], 1.1) * (1 + 0.6 * Math.min(1, shownLast[t] / (R * 0.2))) * (fieldOf(tSubj[t]) === f ? 1.25 : 1), t]).sort((a, b) => b[0] - a[0]).slice(0, 14).map((a) => a[1])); }
  }
  function recommend(r, m) {
    const v = version(m), seen = recent[r]; let cand;
    if (v === 0) { const subs = seen.length ? [...new Set(seen.slice(-6).map((t) => tSubj[t]))] : [rTaste[r][0]]; const sc = []; subs.forEach((s, i) => { for (const t of subjTop[s] || []) sc.push([(cnt12[t] + 1) ** 0.9 * (i === subs.length - 1 ? 1 : 0.7), t]); }); sc.sort((a, b) => b[0] - a[0] || a[1] - b[1]); cand = sc.map((a) => a[1]); }
    else if (v === 1) cand = dropped[r] ? globalTop : (clusterTop[dominant(r)] || globalTop);
    else cand = v3Top[dominant(r)] || globalTop;
    const five = [];
    if (v < 2) { // the early engines were looser: they drew five from a longer list, favouring the top of it
      const pool = cand.filter((t) => !seen.includes(t)).slice(0, v === 0 ? 40 : 24), w = pool.map((_, i) => 1 / (i + (v === 0 ? 6 : 3)));
      while (five.length < 5 && pool.length) { const i = rng.weighted(w); five.push(pool[i]); pool.splice(i, 1); w.splice(i, 1); }
    } else for (const t of cand) { if (five.length === 5) break; if (!seen.includes(t) && !five.includes(t)) five.push(t); }
    for (const t of globalTop) { if (five.length === 5) break; if (!five.includes(t)) five.push(t); }
    while (five.length < 5) five.push(rng.int(0, T - 1));
    return five;
  }
  const ex = o.explore, tail = ex && ex.pool === 'tail' ? (() => { const f = all.filter((t) => tFame[t] < 0.08); return f.length >= 30 ? f : all.slice().sort((x, y) => tFame[x] - tFame[y]).slice(0, Math.floor(T / 3)); })() : all;
  // ---- months ----
  for (let m = 0; m < M; m++) {
    if (m % 12 === 0 && m > 0 && o.storageBelow > 0) for (let t = 0; t < T; t++) if (cnt12[t] < o.storageBelow) offsite[t] = 1;
    retrain(m);
    const v = version(m), cnt = new Int32Array(T), bLoans = new Int32Array(B), bHit = new Int32Array(B), bSat = new Float64Array(B), bSet = Array.from({ length: B }, () => new Set());
    let loans = 0, hits = 0, logged = 0, sat = 0; shownNow.fill(0);
    const yr = Math.floor(m / 12); if (m % 12 === 0) { out.yearTitle.push(new Int32Array(T)); out.yearSubj.push(new Int32Array(40)); out.yearReaderSubj.push(Array.from({ length: R }, () => null)); }
    for (let r = 0; r < R; r++) {
      const child = rType[r] === 3, b = rBranch[r]; let n = 0; { const L = Math.exp(-rRate[r]); let p = 1; do { n++; p *= rng.u(); } while (p > L); n--; }
      if (!n) continue;
      const five = recommend(r, m), rand = [0, 0, 0, 0, 0];
      const exOn = ex && m >= (ex.from || 0) && (!ex.branches || ex.branches.includes(b));
      if (exOn) for (let j = 0; j < 5; j++) if (rng.chance(ex.share)) { five[j] = tail[rng.int(0, tail.length - 1)]; rand[j] = 1; }
      for (const t of five) shownNow[t]++;
      const outage = o.events && m === 52 && b === 3, pos = child ? POS_CHILD : POS_ADULT;
      for (let j = 0; j < 5; j++) { if (rand[j]) out.slotRandom[j][0]++; }
      for (let i = 0; i < n; i++) {
        let t = -1, slot = -1; const off = outage && rng.chance(11 / 30);
        const follow = off ? 0 : o.prominence[v] * (child ? 1.2 : 1);
        const fromScreen = () => { const w = five.map((x, j) => pos[j] * (0.55 + 0.9 * (rTaste[r].includes(tSubj[x]) ? 1 : fieldOf(tSubj[x]) === fieldOf(rTaste[r][0]) ? 0.5 : 0.12) + 0.4 * tQual[x])); slot = rng.weighted(w); return five[slot]; };
        if (rng.chance(follow)) t = fromScreen();
        else {
          let s = rng.chance(0.08) ? rng.int(0, 39) : rTaste[r][rng.weighted([0.6, 0.3, 0.1])];
          const L = lists[rDept[r]]; if (L && m >= 24 && m < 36 && rType[r] === 0 && rng.chance(0.25)) t = rng.pick(L); else t = pickIn(s);
          if (t < 0) continue;
          if (offsite[t] && !off && rng.chance(o.friction)) { if (rng.chance(0.78)) t = fromScreen(); else continue; }
        }
        loans++; cnt[t]++; bLoans[b]++; bSet[b].add(t); out.yearTitle[yr][t]++; out.yearSubj[yr][tSubj[t]]++;
        (out.yearReaderSubj[yr][r] ||= new Uint8Array(40))[tSubj[t]]++;
        const inFive = five.includes(t); if (inFive) { hits++; bHit[b]++; }
        if (o.onLoan) o.onLoan(m, r, t, inFive, slot, five, b);
        if (slot >= 0) { (child ? out.slotChild : out.slotAdult)[slot]++; if (rand[slot]) { out.randomTaken++; out.slotRandom[slot][1]++; } }
        { const glad = tQual[t] * (rTaste[r].includes(tSubj[t]) ? 1 : 0.45); sat += glad; bSat[b] += glad; }
        recent[r].push(t); if (recent[r].length > 24) recent[r].shift(); fieldCnt[r][fieldOf(tSubj[t])]++; totCnt[r]++; if (isRare(tSubj[t])) rareCnt[r]++;
        logged += 1 + (o.events && m >= 40 && m < 44 && (b === 2 || b === 5) && rng.chance(0.35) ? 1 : 0);
        const key = child ? 'child' : rPart[r] ? 'part' : rDept[r] >= 12 ? 'small' : rType[r] === 2 ? 'town' : 'other'; const gy = (out.groups[key] ||= Array.from({ length: Math.ceil(M / 12) }, () => ({ loans: 0, set: new Set(), rare: 0 }))); gy[yr].loans++; gy[yr].set.add(t); if (isRare(tSubj[t])) gy[yr].rare++;
      }
      for (let j = 0; j < 5; j++) if (rand[j]) out.randomShown += n; else out.baseShown += n;
    }
    // bookkeeping
    monthCnt.push(cnt); for (let t = 0; t < T; t++) { cnt12[t] += cnt[t]; if (m >= 12) cnt12[t] -= monthCnt[m - 12][t]; cntLast[t] = cnt[t]; shownLast[t] = shownNow[t]; }
    if (m >= 12) monthCnt[m - 12] = null;
    const sorted = Array.from(cnt).sort((a, b) => b - a); let d = 0, top = 0, cum = 0, g = 0; for (let i = 0; i < T; i++) { if (sorted[i] > 0) d++; if (i < Math.round(T / 60)) top += sorted[i]; }
    for (let i = T - 1, k = 1; i >= 0; i--, k++) { cum += sorted[i]; g += cum; } g = loans ? 1 - (2 * g) / (T * loans) + 1 / T : 0;
    out.hit.push(loans ? hits / loans : 0); out.distinct.push(d); out.top100.push(loans ? top / loans : 0); out.loans.push(loans); out.logged.push(logged); out.gini.push(g); out.survey.push(loans ? sat / loans : 0);
    let offc = 0; for (let t = 0; t < T; t++) offc += offsite[t]; out.offsiteShare.push(offc / T);
    for (let b = 0; b < B; b++) { out.byBranch[b].loans.push(bLoans[b]); out.byBranch[b].distinct.push(bSet[b].size); out.byBranch[b].hit.push(bLoans[b] ? bHit[b] / bLoans[b] : 0); out.byBranch[b].survey.push(bLoans[b] ? bSat[b] / bLoans[b] : 0); }
  }
  out.recent = recent; out.fieldCnt = fieldCnt; out.totCnt = totCnt; out.rareCnt = rareCnt; out.cnt12 = cnt12; out.cntLast = cntLast; out.shownLast = shownLast; out.dominant = dominant; out.recommend = recommend;
  return out;
}
const avg = (a, i, j) => { let s = 0; for (let k = i; k < j; k++) s += a[k]; return s / (j - i); };
export const yearAvg = (a, y) => avg(a, y * 12, y * 12 + 12);
