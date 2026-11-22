// One seeded random generator for the whole game. Same seed, same result.
export function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

export class RNG {
  constructor(seed = 1) {
    this.a = (typeof seed === 'string' ? hash(seed) : seed) >>> 0;
    this._spare = null;
  }
  // mulberry32
  u() {
    this.a = (this.a + 0x6D2B79F5) | 0;
    let t = Math.imul(this.a ^ (this.a >>> 15), 1 | this.a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  range(a, b) { return a + (b - a) * this.u(); }
  int(a, b) { return Math.floor(this.range(a, b + 1)); }
  chance(p) { return this.u() < p; }
  n(mu = 0, sd = 1) {
    if (this._spare !== null) { const s = this._spare; this._spare = null; return mu + sd * s; }
    let u = 0, v = 0;
    while (u === 0) u = this.u();
    v = this.u();
    const r = Math.sqrt(-2 * Math.log(u));
    this._spare = r * Math.sin(2 * Math.PI * v);
    return mu + sd * r * Math.cos(2 * Math.PI * v);
  }
  pick(arr) { return arr[Math.floor(this.u() * arr.length)]; }
  shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(this.u() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  weighted(ws) {
    let tot = 0; for (const w of ws) tot += w;
    let r = this.u() * tot;
    for (let i = 0; i < ws.length; i++) { r -= ws[i]; if (r <= 0) return i; }
    return ws.length - 1;
  }
  sample(arr, k) { return this.shuffle(arr).slice(0, k); }
  fork(tag) { return new RNG(hash(String(this.a) + ':' + tag)); }
}

export const rng = (seed) => new RNG(seed);
