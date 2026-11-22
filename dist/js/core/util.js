// Small helpers shared by everything.
export const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const sum = (a) => { let s = 0; for (const x of a) s += x; return s; };
export const mean = (a) => (a.length ? sum(a) / a.length : 0);
export const range = (n, f = (i) => i) => Array.from({ length: n }, (_, i) => f(i));
export const round = (x, d = 2) => { const p = 10 ** d; return Math.round(x * p) / p; };
export const pct = (x, d = 0) => round(x * 100, d) + '%';
export const argmax = (a) => { let b = 0; for (let i = 1; i < a.length; i++) if (a[i] > a[b]) b = i; return b; };
export const argmin = (a) => { let b = 0; for (let i = 1; i < a.length; i++) if (a[i] < a[b]) b = i; return b; };
export const dist2 = (a, b) => { let s = 0; for (let i = 0; i < a.length; i++) { const d = a[i] - b[i]; s += d * d; } return s; };
export const dist = (a, b) => Math.sqrt(dist2(a, b));
export const uniq = (a) => [...new Set(a)];
export const countBy = (a, f = (x) => x) => { const m = new Map(); for (const x of a) { const k = f(x); m.set(k, (m.get(k) || 0) + 1); } return m; };
export const sortBy = (a, f) => a.slice().sort((x, y) => { const p = f(x), q = f(y); return p < q ? -1 : p > q ? 1 : 0; });
export const fmt = (x, d = 2) => (Number.isFinite(x) ? (Math.abs(x) >= 1000 ? Math.round(x).toLocaleString('en-US') : String(round(x, d))) : '–');

// DOM builder: el('div.card', {onclick}, [children | text])
export function el(spec, attrs, kids) {
  const [tagId, ...classes] = spec.split('.');
  const [tag, id] = tagId.split('#');
  const e = document.createElement(tag || 'div');
  if (id) e.id = id;
  if (classes.length) e.className = classes.join(' ');
  if (attrs && (typeof attrs === 'string' || Array.isArray(attrs) || attrs instanceof Node)) { kids = attrs; attrs = null; }
  if (attrs) for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
    else if (k === 'style' && typeof v === 'object') Object.assign(e.style, v);
    else if (k === 'html') e.innerHTML = v;
    else if (k in e && k !== 'list') { try { e[k] = v; } catch { e.setAttribute(k, v); } }
    else e.setAttribute(k, v);
  }
  add(e, kids);
  return e;
}
export function add(parent, kids) {
  if (kids == null || kids === false) return parent;
  if (Array.isArray(kids)) { for (const k of kids) add(parent, k); return parent; }
  parent.append(kids instanceof Node ? kids : document.createTextNode(String(kids)));
  return parent;
}
export const clear = (node) => { while (node.firstChild) node.removeChild(node.firstChild); return node; };
export const $ = (sel, root = document) => root.querySelector(sel);

// tiny event bus
const subs = {};
export const bus = {
  on(ev, f) { (subs[ev] ||= []).push(f); return () => { subs[ev] = subs[ev].filter((g) => g !== f); }; },
  emit(ev, data) { for (const f of subs[ev] || []) f(data); },
};

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const ROMAN = ['', 'I', 'II', 'III', 'IV'];
