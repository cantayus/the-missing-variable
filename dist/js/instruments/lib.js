// Shared pieces for instruments: invented datasets, small drawing helpers, meters.
import { DATA, INK, INK2, GREY, PALE, GOOD, WARM, SHAPES, nice, pct } from './board.js';
export { DATA, INK, INK2, GREY, PALE, GOOD, WARM, SHAPES, nice, pct };
export const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
export const sum = (a) => a.reduce((s, x) => s + x, 0);
export const mean = (a) => (a.length ? sum(a) / a.length : 0);
export const R = (n, f) => Array.from({ length: n }, (_, i) => f(i));
export const d2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
export const nearest = (pts, x, y, max = Infinity) => { let b = -1, bd = max * max; pts.forEach((p, i) => { const d = (p[0] - x) ** 2 + (p[1] - y) ** 2; if (d < bd) { bd = d; b = i; } }); return b; };

// ---- invented data ----
export const gen = {
  blobs(r, cents, n, sd = 0.6) { const pts = []; cents.forEach((c, k) => { for (let i = 0; i < n; i++) pts.push([r.n(c[0], sd), r.n(c[1], sd), k]); }); return pts; },
  moons(r, n, noise = 0.12) { const pts = []; for (let i = 0; i < n; i++) { const t = r.range(0, Math.PI); pts.push([Math.cos(t) * 2 + r.n(0, noise) - 0.5, Math.sin(t) * 2 + r.n(0, noise), 0]); pts.push([2 - Math.cos(t) * 2 + r.n(0, noise) - 0.5, 0.9 - Math.sin(t) * 2 + r.n(0, noise), 1]); } return pts; },
  rings(r, n, r1 = 1, r2 = 2.6, noise = 0.15) { const pts = []; for (let i = 0; i < n; i++) { const t = r.range(0, 6.283); pts.push([Math.cos(t) * r1 + r.n(0, noise), Math.sin(t) * r1 + r.n(0, noise), 0]); const u = r.range(0, 6.283); pts.push([Math.cos(u) * r2 + r.n(0, noise), Math.sin(u) * r2 + r.n(0, noise), 1]); } return pts; },
  spiral(r, n, noise = 0.08) { const pts = []; for (let i = 0; i < n; i++) { const t = 0.6 + (i / n) * 3.6; for (const k of [0, 1]) pts.push([Math.cos(t * 1.6 + k * Math.PI) * t + r.n(0, noise), Math.sin(t * 1.6 + k * Math.PI) * t + r.n(0, noise), k]); } return pts; },
  line(r, n, a, b, noise, x0 = 0, x1 = 10) { return R(n, () => { const x = r.range(x0, x1); return [x, a + b * x + r.n(0, noise)]; }); },
  skew(r, n, mu = 1.2, sd = 0.9) { return R(n, () => Math.exp(r.n(mu, sd))); },
};
// Six walks of life: every instrument can relabel its axes from one of these.
export const WALKS = [
  { name: 'Library loans', x: 'loans last year', y: 'loans this year', unit: 'loans', items: ['novels', 'atlases', 'cookbooks', 'poetry', 'manuals', 'picture books'] },
  { name: 'Bakery', x: 'loaves baked', y: 'loaves sold', unit: 'loaves', items: ['rye', 'bagels', 'buns', 'tarts', 'rolls', 'sourdough'] },
  { name: 'Bus line', x: 'minutes late', y: 'riders waiting', unit: 'riders', items: ['route 4', 'route 9', 'night bus', 'express', 'school bus', 'loop'] },
  { name: 'Orchard', x: 'rain (mm)', y: 'apples per tree', unit: 'apples', items: ['russet', 'pippin', 'crab', 'gala', 'cox', 'bramley'] },
  { name: 'Tide pools', x: 'pool depth (cm)', y: 'creatures counted', unit: 'creatures', items: ['limpets', 'crabs', 'anemones', 'snails', 'starfish', 'shrimps'] },
  { name: 'Football club', x: 'shots', y: 'goals', unit: 'goals', items: ['strikers', 'wingers', 'keepers', 'backs', 'subs', 'juniors'] },
];
export const walk = (ctx) => WALKS[(ctx.example || 0) % WALKS.length];
export const walkNames = () => WALKS.map((w) => w.name);
// fold the player's field observations into invented rows (Play rounds)
export function withSample(vals, ctx, scale = 1) { const s = (ctx.sample || []).map((o) => o.v * scale); return s.length ? [...s, ...vals.slice(s.length)] : vals; }

// ---- meters ----
export const meterTo = (label, v, target, o = {}) => { const lower = !!o.lower, met = lower ? v <= target : v >= target, span = o.from != null ? Math.abs(target - o.from) || 1 : Math.abs(target) || 1, frac = lower ? clamp(1 - (v - target) / span, 0, 1) : clamp(o.from != null ? (v - o.from) / span : v / span, 0, 1); return { label, text: (o.fmt || nice)(v), goal: o.goal === false ? '' : `goal ${lower ? '≤' : '≥'} ${(o.fmt || nice)(target)}`, frac: met ? 1 : frac, met, note: o.note }; };
export const meterCount = (label, k, n, note) => ({ label, text: `${k} of ${n}`, frac: n ? k / n : 0, met: k >= n, note });
export const meterBand = (label, v, lo, hi, o = {}) => { const met = v >= lo && v <= hi, mid = (lo + hi) / 2, span = o.span || Math.abs(mid) || 1; return { label, text: (o.fmt || nice)(v), goal: `goal ${(o.fmt || nice)(lo)} to ${(o.fmt || nice)(hi)}`, frac: met ? 1 : clamp(1 - Math.abs(v - mid) / span, 0, 0.95), met, note: o.note }; };

// ---- drawing in screen space ----
export function area(b, m = 0) { const u = b.u; return { x: (14 + m) * u, y: (14 + m) * u, w: b.w - (28 + 2 * m) * u, h: b.h - (28 + 2 * m) * u, u }; }
export function card(b, id, px, py, w, h, text, o = {}) {
  const g = b.g, u = b.u; b.box(px, py, w, h, { fill: o.fill || '#fffdf5', color: o.sel ? DATA[1] : o.color || INK, width: o.sel ? 3 : 1.2, dash: o.dash });
  const lines = String(text).split('\n'), size = o.size || 11.5, lh = size * u * 1.25, y0 = py + h / 2 - ((lines.length - 1) * lh) / 2;
  lines.forEach((ln, i) => b.label(ln, o.align === 'left' ? px + 7 * u : px + w / 2, y0 + i * lh, { align: o.align === 'left' ? 'left' : 'center', size, mono: o.mono, bold: o.bold && i === 0, color: o.ink || INK }));
  if (o.mark) { g.fillStyle = o.mark; g.fillRect(px, py, 5 * u, h); }
  if (id != null) b.zone(id, px, py, w, h);
}
export function bars(b, vals, px, py, w, h, o = {}) {
  const n = vals.length, max = o.max || Math.max(...vals, 1e-9), gap = o.gap ?? 0.2, bw = w / n, u = b.u;
  vals.forEach((v, i) => { const bh = (Math.max(0, v) / max) * h, x = px + i * bw + (bw * gap) / 2; b.box(x, py + h - bh, bw * (1 - gap), bh, { fill: Array.isArray(o.color) ? o.color[i % o.color.length] : o.color || DATA[0], alpha: o.alpha }); if (o.labels) b.label(o.labels[i], x + (bw * (1 - gap)) / 2, py + h + 9 * u, { align: 'center', size: o.size || 9.5, color: INK2 }); if (o.values) b.label(o.values[i], x + (bw * (1 - gap)) / 2, py + h - bh - 8 * u, { align: 'center', size: 9.5, mono: true }); if (o.zone) b.zone(o.zone + i, px + i * bw, py, bw, h); });
  b.box(px, py + h, w, 1, { fill: INK2 });
}
export function title(b, text, sub) { const u = b.u; b.label(text, 16 * u, 20 * u, { size: 13, bold: true }); if (sub) b.label(sub, 16 * u, 38 * u, { size: 11, color: INK2 }); }
export function legend(b, items, px, py) { const u = b.u; let x = px; items.forEach(([name, color, shape]) => { b.mark(x + 6 * u, py, 5 * u, shape || 'circle', color, '#fff'); x += 15 * u; x += b.label(name, x, py, { size: 10.5, color: INK2 }) + 14 * u; }); }
export function note(b, text, px, py, o = {}) { b.label(text, px, py, { size: o.size || 11, color: o.color || INK2, align: o.align || 'left', mono: o.mono }); }
export function spark(b, vals, px, py, w, h, o = {}) { const g = b.g, lo = o.lo ?? Math.min(...vals), hi = o.hi ?? Math.max(...vals), sp = hi - lo || 1; g.beginPath(); vals.forEach((v, i) => { const x = px + (i / (vals.length - 1)) * w, y = py + h - ((v - lo) / sp) * h; i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.strokeStyle = o.color || DATA[0]; g.lineWidth = (o.width || 2) * b.u; g.stroke(); if (o.frame !== false) b.box(px, py, w, h, { color: PALE }); if (o.name) b.label(o.name, px + 4 * b.u, py + 10 * b.u, { size: 10.5, color: o.color || INK2, bold: true }); }
export function pointShape(b, pts, o = {}) { pts.forEach((p) => b.dot(p[0], p[1], { color: p[2] == null || p[2] < 0 ? GREY : DATA[p[2] % 6], shape: p[2] == null || p[2] < 0 ? 'cross' : SHAPES[p[2] % 6], r: o.r || 4, alpha: o.alpha })); }
export function grid(b, px, py, cols, rows, cw, ch, cell) { for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) cell(r, c, px + c * cw, py + r * ch); }
export function wrap(b, text, px, py, maxW, o = {}) { const words = String(text).split(' '), u = b.u, size = o.size || 11.5; b.font(size, o.mono, o.bold); let line = '', y = py; for (const w of words) { const t = line ? line + ' ' + w : w; if (b.g.measureText(t).width > maxW && line) { b.label(line, px, y, { size, color: o.color, mono: o.mono, bold: o.bold }); line = w; y += size * u * 1.3; } else line = t; } if (line) b.label(line, px, y, { size, color: o.color, mono: o.mono, bold: o.bold }); return y + size * u * 1.3; }
export const bounds = (pts, pad = 0.6) => { let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (const p of pts) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); } return [x0 - pad, x1 + pad, y0 - pad, y1 + pad]; };
