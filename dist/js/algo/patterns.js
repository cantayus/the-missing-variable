// Frequent patterns and simple recommenders.
export function support(baskets, items) { let c = 0; for (const b of baskets) if (items.every((i) => b.includes(i))) c++; return c / baskets.length; }
export function rule(baskets, A, B) { const sA = support(baskets, A), sB = support(baskets, B), sAB = support(baskets, [...A, ...B]); return { support: sAB, confidence: sA ? sAB / sA : 0, lift: sA && sB ? sAB / (sA * sB) : 0, leverage: sAB - sA * sB, conviction: sA && sAB / sA < 1 ? (1 - sB) / (1 - sAB / sA) : Infinity }; }
const key = (s) => s.slice().sort().join('|');
// Apriori: returns { frequent: Map(key -> {items, count}), scans, counted, pruned }
export function apriori(baskets, minCount) {
  const frequent = new Map(); let scans = 0, counted = 0, pruned = 0;
  const items = [...new Set(baskets.flat())].sort();
  let level = items.map((i) => [i]);
  while (level.length) {
    scans++; const next = [];
    for (const c of level) { counted++; let n = 0; for (const b of baskets) if (c.every((i) => b.includes(i))) n++; if (n >= minCount) { frequent.set(key(c), { items: c, count: n }); next.push(c); } }
    const cand = new Map();
    for (let i = 0; i < next.length; i++) for (let j = i + 1; j < next.length; j++) {
      const a = next[i], b = next[j]; if (a.slice(0, -1).join('|') !== b.slice(0, -1).join('|')) continue;
      const c = [...a, b[b.length - 1]].sort();
      const ok = c.every((_, k) => frequent.has(key(c.filter((_, m) => m !== k))));   // the Apriori principle
      if (ok) cand.set(key(c), c); else pruned++;
    }
    level = [...cand.values()];
  }
  return { frequent, scans, counted, pruned };
}
// Eclat: vertical format, intersect transaction-id lists
export function tidlists(baskets) { const m = new Map(); baskets.forEach((b, t) => { for (const i of b) { if (!m.has(i)) m.set(i, []); m.get(i).push(t); } }); return m; }
export const intersect = (a, b) => { const out = []; let i = 0, j = 0; while (i < a.length && j < b.length) { if (a[i] === b[j]) { out.push(a[i]); i++; j++; } else if (a[i] < b[j]) i++; else j++; } return out; };
export function eclat(baskets, minCount) { const tl = tidlists(baskets), out = new Map(); const rec = (prefix, list) => { for (let i = 0; i < list.length; i++) { const [it, tids] = list[i]; if (tids.length < minCount) continue; const items = [...prefix, it]; out.set(key(items), { items, count: tids.length }); const ext = []; for (let j = i + 1; j < list.length; j++) { const t = intersect(tids, list[j][1]); if (t.length >= minCount) ext.push([list[j][0], t]); } rec(items, ext); } }; rec([], [...tl.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1))); return out; }
export function closedAndMaximal(frequent) { const all = [...frequent.values()], closed = [], maximal = []; for (const f of all) { const sup = all.filter((g) => g.items.length === f.items.length + 1 && f.items.every((i) => g.items.includes(i))); if (!sup.some((g) => g.count === f.count)) closed.push(f); if (!sup.length) maximal.push(f); } return { closed, maximal }; }
// item-to-item similarity from a reader-by-title 0/1 grid (columns are titles)
export function itemSim(grid, a, b, how = 'cosine') { let ab = 0, na = 0, nb = 0; for (const row of grid) { ab += row[a] * row[b]; na += row[a]; nb += row[b]; } if (how === 'count') return ab; if (how === 'jaccard') return na + nb - ab ? ab / (na + nb - ab) : 0; return na && nb ? ab / Math.sqrt(na * nb) : 0; }
export function recommendFor(grid, reader, how = 'count', n = 5) { const m = grid[0].length, score = new Array(m).fill(0); for (let t = 0; t < m; t++) { if (grid[reader][t]) continue; for (let u = 0; u < m; u++) if (grid[reader][u]) score[t] += itemSim(grid, t, u, how); } return score.map((s, t) => [s, t]).filter((x) => !grid[reader][x[1]]).sort((x, y) => y[0] - x[0]).slice(0, n).map((x) => x[1]); }
// matrix factorisation by stochastic gradient descent: R has nulls where unknown
export function factorize(R, k, rng, { steps = 60, lr = 0.02, reg = 0.02 } = {}) { const n = R.length, m = R[0].length, P = Array.from({ length: n }, () => Array.from({ length: k }, () => rng.range(-0.3, 0.3))), Q = Array.from({ length: m }, () => Array.from({ length: k }, () => rng.range(-0.3, 0.3))), known = []; for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) if (R[i][j] != null) known.push([i, j]); const mu = known.reduce((s, [i, j]) => s + R[i][j], 0) / (known.length || 1); const pred = (i, j) => mu + P[i].reduce((s, v, f) => s + v * Q[j][f], 0); const trace = []; for (let s = 0; s < steps; s++) { for (const [i, j] of known) { const e = R[i][j] - pred(i, j); for (let f = 0; f < k; f++) { const p = P[i][f], q = Q[j][f]; P[i][f] += lr * (e * q - reg * p); Q[j][f] += lr * (e * p - reg * q); } } trace.push(Math.sqrt(known.reduce((t, [i, j]) => t + (R[i][j] - pred(i, j)) ** 2, 0) / (known.length || 1))); } return { P, Q, mu, pred, trace }; }
// sketches for large data
export function bloom(m, k) { const bits = new Uint8Array(m), h = (s, seed) => { let x = 2166136261 ^ seed; for (let i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 16777619); } return (x >>> 0) % m; }; return { bits, add(s) { for (let i = 0; i < k; i++) bits[h(s, i * 7919)] = 1; }, has(s) { for (let i = 0; i < k; i++) if (!bits[h(s, i * 7919)]) return false; return true; }, fill: () => bits.reduce((a, b) => a + b, 0) / m }; }
export function reservoir(stream, k, rng) { const out = []; stream.forEach((x, i) => { if (i < k) out.push(x); else { const j = rng.int(0, i); if (j < k) out[j] = x; } }); return out; }
export function mapReduce(rows, mapper, reducer, workers = 4) { const parts = Array.from({ length: workers }, () => []); rows.forEach((r, i) => parts[i % workers].push(r)); const mapped = parts.map((p) => p.flatMap(mapper)), groups = new Map(); for (const part of mapped) for (const [k, v] of part) { if (!groups.has(k)) groups.set(k, []); groups.get(k).push(v); } const out = new Map(); for (const [k, vs] of groups) out.set(k, reducer(k, vs)); return { parts, mapped, groups, out }; }
