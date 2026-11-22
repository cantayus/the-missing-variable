// Descriptive statistics, correlation, and fitting lines. Pure functions; tested in tests/algo.test.mjs.
export const sum = (a) => { let s = 0; for (const x of a) s += x; return s; };
export const mean = (a) => (a.length ? sum(a) / a.length : NaN);
export const sorted = (a) => Array.from(a).sort((x, y) => x - y);
export function quantile(a, q) { const s = sorted(a); if (!s.length) return NaN; const p = (s.length - 1) * q, i = Math.floor(p), f = p - i; return s[i] + (s[Math.min(i + 1, s.length - 1)] - s[i]) * f; }
export const median = (a) => quantile(a, 0.5);
export function mode(a) { const m = new Map(); let best = null, bc = 0; for (const x of a) { const c = (m.get(x) || 0) + 1; m.set(x, c); if (c > bc) { bc = c; best = x; } } return best; }
export function variance(a, sample = true) { const m = mean(a); let s = 0; for (const x of a) s += (x - m) ** 2; return s / (a.length - (sample ? 1 : 0)); }
export const sd = (a, sample = true) => Math.sqrt(variance(a, sample));
export function fiveNum(a) { return { min: quantile(a, 0), q1: quantile(a, 0.25), med: quantile(a, 0.5), q3: quantile(a, 0.75), max: quantile(a, 1) }; }
export function skewness(a) { const m = mean(a), s = sd(a, false); let k = 0; for (const x of a) k += ((x - m) / s) ** 3; return k / a.length; }
export function covariance(x, y) { const mx = mean(x), my = mean(y); let s = 0; for (let i = 0; i < x.length; i++) s += (x[i] - mx) * (y[i] - my); return s / (x.length - 1); }
export function correlation(x, y) { const c = covariance(x, y), d = sd(x) * sd(y); return d ? c / d : 0; }
export function ranks(a) { const idx = a.map((v, i) => [v, i]).sort((p, q) => p[0] - q[0]), r = new Array(a.length); for (let i = 0; i < idx.length;) { let j = i; while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++; const rk = (i + j) / 2 + 1; for (let k = i; k <= j; k++) r[idx[k][1]] = rk; i = j + 1; } return r; }
export const spearman = (x, y) => correlation(ranks(x), ranks(y));
export function kendall(x, y) { let c = 0, d = 0; for (let i = 0; i < x.length; i++) for (let j = i + 1; j < x.length; j++) { const s = Math.sign(x[i] - x[j]) * Math.sign(y[i] - y[j]); if (s > 0) c++; else if (s < 0) d++; } return (c - d) / ((x.length * (x.length - 1)) / 2); }
export function histogram(a, bins, lo = Math.min(...a), hi = Math.max(...a)) { const h = new Array(bins).fill(0), w = (hi - lo) / bins || 1; for (const x of a) h[Math.max(0, Math.min(bins - 1, Math.floor((x - lo) / w)))]++; return { counts: h, lo, hi, width: w }; }
export function kde(a, xs, bw) { const h = bw ?? 1.06 * sd(a) * Math.pow(a.length, -0.2); return xs.map((x) => { let s = 0; for (const v of a) { const u = (x - v) / h; s += Math.exp(-0.5 * u * u); } return s / (a.length * h * Math.sqrt(2 * Math.PI)); }); }
export function gini(a) { const s = sorted(a), n = s.length, tot = sum(s); if (!tot) return 0; let c = 0; for (let i = 0; i < n; i++) c += (2 * (i + 1) - n - 1) * s[i]; return c / (n * tot); }
export function lorenz(a) { const s = sorted(a), tot = sum(s) || 1; let c = 0; return [[0, 0], ...s.map((v, i) => { c += v; return [(i + 1) / s.length, c / tot]; })]; }
export const zscores = (a) => { const m = mean(a), s = sd(a); return a.map((x) => (x - m) / s); };
export function trimmedMean(a, frac = 0.1) { const s = sorted(a), k = Math.floor(s.length * frac); return mean(s.slice(k, s.length - k)); }
export function tukeyFences(a, k = 1.5) { const f = fiveNum(a), iqr = f.q3 - f.q1; return [f.q1 - k * iqr, f.q3 + k * iqr]; }
export function entropy(p) { let h = 0; const t = sum(p); for (const x of p) if (x > 0) h -= (x / t) * Math.log2(x / t); return h; }

// least squares line y = a + b x
export function linreg(x, y) { const mx = mean(x), my = mean(y); let sxy = 0, sxx = 0; for (let i = 0; i < x.length; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) ** 2; } const b = sxx ? sxy / sxx : 0, a = my - b * mx; return { a, b, r2: r2(y, x.map((v) => a + b * v)) }; }
export function r2(y, yhat) { const my = mean(y); let ssr = 0, sst = 0; for (let i = 0; i < y.length; i++) { ssr += (y[i] - yhat[i]) ** 2; sst += (y[i] - my) ** 2; } return sst ? 1 - ssr / sst : 0; }
export const sse = (y, yhat) => { let s = 0; for (let i = 0; i < y.length; i++) s += (y[i] - yhat[i]) ** 2; return s; };
export const adjR2 = (r, n, p) => 1 - ((1 - r) * (n - 1)) / (n - p - 1);
// solve A x = b by Gaussian elimination with partial pivoting
export function solve(A, b) {
  const n = b.length, M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) { let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r; [M[c], M[p]] = [M[p], M[c]]; if (Math.abs(M[c][c]) < 1e-12) continue; for (let r = c + 1; r < n; r++) { const f = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; } }
  const x = new Array(n).fill(0); for (let r = n - 1; r >= 0; r--) { let s = M[r][n]; for (let k = r + 1; k < n; k++) s -= M[r][k] * x[k]; x[r] = Math.abs(M[r][r]) < 1e-12 ? 0 : s / M[r][r]; } return x;
}
// multiple regression: X rows of features (no intercept column), optional ridge penalty
export function ols(X, y, ridge = 0) { const n = X.length, p = X[0].length + 1, A = Array.from({ length: p }, () => new Array(p).fill(0)), b = new Array(p).fill(0); for (let i = 0; i < n; i++) { const row = [1, ...X[i]]; for (let j = 0; j < p; j++) { b[j] += row[j] * y[i]; for (let k = 0; k < p; k++) A[j][k] += row[j] * row[k]; } } for (let j = 1; j < p; j++) A[j][j] += ridge; const beta = solve(A, b); return { beta, predict: (r) => beta[0] + r.reduce((s, v, j) => s + v * beta[j + 1], 0) }; }
export function polyfit(x, y, deg) { const X = x.map((v) => Array.from({ length: deg }, (_, j) => v ** (j + 1))), m = ols(X, y); return { coef: m.beta, predict: (v) => m.beta.reduce((s, c, j) => s + c * v ** j, 0) }; }
// least absolute deviations line by iteratively reweighted least squares
export function ladfit(x, y, iters = 30) { let { a, b } = linreg(x, y); for (let it = 0; it < iters; it++) { let sw = 0, swx = 0, swy = 0, swxx = 0, swxy = 0; for (let i = 0; i < x.length; i++) { const w = 1 / Math.max(1e-4, Math.abs(y[i] - a - b * x[i])); sw += w; swx += w * x[i]; swy += w * y[i]; swxx += w * x[i] * x[i]; swxy += w * x[i] * y[i]; } const d = sw * swxx - swx * swx; if (Math.abs(d) < 1e-12) break; b = (sw * swxy - swx * swy) / d; a = (swy - b * swx) / sw; } return { a, b }; }
export function ransac(x, y, rng, { iters = 60, tol = 1 } = {}) { let best = null, bc = -1; for (let it = 0; it < iters; it++) { const i = rng.int(0, x.length - 1); let j = rng.int(0, x.length - 1); if (i === j || x[i] === x[j]) continue; const b = (y[j] - y[i]) / (x[j] - x[i]), a = y[i] - b * x[i]; let c = 0; for (let k = 0; k < x.length; k++) if (Math.abs(y[k] - a - b * x[k]) < tol) c++; if (c > bc) { bc = c; best = { a, b, inliers: c }; } } return best; }
// Box-Cox power transform
export const boxcox = (v, lam) => (Math.abs(lam) < 1e-9 ? Math.log(v) : (v ** lam - 1) / lam);
// Beta density (unnormalised is fine for drawing) and Beta-Binomial updating
export function betaPdf(x, a, b) { if (x <= 0 || x >= 1) return 0; return Math.exp((a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x) - lbeta(a, b)); }
function lgamma(z) { const g = 7, c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7]; if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - lgamma(1 - z); z -= 1; let x = c[0]; for (let i = 1; i < g + 2; i++) x += c[i] / (z + i); const t = z + g + 0.5; return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x); }
export const lbeta = (a, b) => lgamma(a) + lgamma(b) - lgamma(a + b);
export const betaMean = (a, b) => a / (a + b);
export const betaMode = (a, b) => (a > 1 && b > 1 ? (a - 1) / (a + b - 2) : a >= b ? 1 : 0);
export function normalPdf(x, mu = 0, s = 1) { const u = (x - mu) / s; return Math.exp(-0.5 * u * u) / (s * Math.sqrt(2 * Math.PI)); }
// bootstrap interval for any statistic
export function bootstrap(a, stat, rng, B = 400) { const out = []; for (let b = 0; b < B; b++) { const s = a.map(() => a[rng.int(0, a.length - 1)]); out.push(stat(s)); } return { lo: quantile(out, 0.025), hi: quantile(out, 0.975), dist: out }; }
export function benford(d) { return Math.log10(1 + 1 / d); }
