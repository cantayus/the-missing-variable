// The table top: a sheet of paper with a coordinate system, things to draw, and handles to drag.
// Everything is drawn as if with a felt pen: lines wobble a little, shapes get an ink outline, and the things
// you can pick up have faces. Sharp at any pixel density, usable from the keyboard, never relying on color alone.
export const DATA = ['#0072b2', '#e69f00', '#009e73', '#d55e00', '#cc79a7', '#56b4e9'];
export const INK = '#1c2b4a', INK2 = '#4b5a76', GREY = '#9aa3b2', PALE = '#e3e8ef', GOOD = '#2e7d5b', WARM = '#b8683f';
export const SHAPES = ['circle', 'square', 'tri', 'diamond', 'cross', 'ring'];

// a steady wobble: the same line always wobbles the same way, so nothing shimmers between redraws
const wob = (a, b) => { const v = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return v - Math.floor(v) - 0.5; };
export const PAPER = '#fffdf5';

export class Board {
  constructor(canvas) {
    this.c = canvas; this.g = canvas.getContext('2d'); this.v = { x0: 0, x1: 1, y0: 0, y1: 1 }; this.pad = { l: 46, r: 18, t: 18, b: 38 };
    this.handles = []; this.focus = -1; this.drag = null; this.on = {}; this.u = 1; this.base = 1; this.k = 1;
    canvas.tabIndex = 0; canvas.setAttribute('role', 'application');
    const pos = (e) => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    const hit = (px, py) => { let best = null, bd = 1e9; for (const h of this.handles) { if (h.zone) { const z = h.zone; if (px >= z[0] && px <= z[0] + z[2] && py >= z[1] && py <= z[1] + z[3] && bd > 1e8) { best = h; bd = 1e8; } continue; } const d = Math.hypot(this.X(h.x) - px, this.Y(h.y) - py); if (d < (h.r || 14) * this.u + 8 && d < bd) { bd = d; best = h; } } return best; };
    canvas.addEventListener('pointerdown', (e) => { canvas.setPointerCapture(e.pointerId); const [px, py] = pos(e), h = hit(px, py); this.drag = h ? { id: h.id, moved: false } : { id: null, moved: false, px, py }; if (h) this.focus = this.handles.indexOf(h); this.on.down?.(h ? h.id : null, this.ux(px), this.uy(py)); });
    canvas.addEventListener('pointermove', (e) => { const [px, py] = pos(e); if (this.drag) { if (this.drag.id != null || Math.hypot(px - this.drag.px, py - this.drag.py) > 4) this.drag.moved = true; this.on.drag?.(this.drag.id, this.ux(px), this.uy(py)); } else { const h = hit(px, py); canvas.style.cursor = h ? 'grab' : this.on.click ? 'crosshair' : 'default'; this.on.hover?.(h ? h.id : null, this.ux(px), this.uy(py)); } });
    const up = (e) => { if (!this.drag) return; const [px, py] = pos(e), d = this.drag; this.drag = null; if (!d.moved || d.id == null && !this.on.drag) this.on.click?.(this.ux(px), this.uy(py), d.id); this.on.up?.(d.id, this.ux(px), this.uy(py), d.moved); };
    canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', () => { this.drag = null; });
    canvas.addEventListener('keydown', (e) => {
      const n = this.handles.length, step = e.shiftKey ? 0.1 : 0.025, dx = (this.v.x1 - this.v.x0) * step, dy = (this.v.y1 - this.v.y0) * step;
      if (e.key === 'Tab' && n) { if (!e.shiftKey && this.focus < n - 1) { this.focus++; e.preventDefault(); } else if (e.shiftKey && this.focus > 0) { this.focus--; e.preventDefault(); } else this.focus = -1; this.on.redraw?.(); return; }
      const h = this.handles[this.focus], mv = { ArrowLeft: [-dx, 0], ArrowRight: [dx, 0], ArrowUp: [0, dy], ArrowDown: [0, -dy] }[e.key];
      if (h && mv) { e.preventDefault(); this.on.down?.(h.id, h.x, h.y); this.on.drag?.(h.id, h.x + mv[0], h.y + mv[1]); this.on.up?.(h.id, h.x + mv[0], h.y + mv[1], true); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (h) this.on.click?.(h.x, h.y, h.id); else this.on.click?.((this.v.x0 + this.v.x1) / 2, (this.v.y0 + this.v.y1) / 2, null); }
    });
    canvas.addEventListener('blur', () => { this.focus = -1; this.on.redraw?.(); });
  }
  resize() { const r = this.c.getBoundingClientRect(), d = window.devicePixelRatio || 1; if (!r.width) return; this.w = r.width; this.h = r.height; this.c.width = Math.round(r.width * d); this.c.height = Math.round(r.height * d); this.g.setTransform(d, 0, 0, d, 0, 0); this.base = Math.max(0.8, Math.min(2.4, parseFloat(getComputedStyle(document.documentElement).fontSize) / 16)); this.u = this.base * this.k; }
  // Draw as if the board were `units` wide, whatever its size on screen. For layouts made of cards and rows of text.
  fit(units = 520) { this.k = Math.max(0.6, Math.min(2.2, this.w / (units * this.base))) || 1; this.u = this.base * this.k; return this; }
  view(x0, x1, y0, y1, equal = false) { this.v = { x0, x1, y0, y1 }; if (equal && this.w) { const pw = this.w - (this.pad.l + this.pad.r) * this.u, ph = this.h - (this.pad.t + this.pad.b) * this.u, sx = (x1 - x0) / pw, sy = (y1 - y0) / ph; if (sx > sy) { const c = (y0 + y1) / 2, hh = (sx * ph) / 2; this.v.y0 = c - hh; this.v.y1 = c + hh; } else { const c = (x0 + x1) / 2, hw = (sy * pw) / 2; this.v.x0 = c - hw; this.v.x1 = c + hw; } } return this; }
  X(x) { const p = this.pad, u = this.u; return p.l * u + ((x - this.v.x0) / (this.v.x1 - this.v.x0)) * (this.w - (p.l + p.r) * u); }
  Y(y) { const p = this.pad, u = this.u; return this.h - p.b * u - ((y - this.v.y0) / (this.v.y1 - this.v.y0)) * (this.h - (p.t + p.b) * u); }
  ux(px) { const p = this.pad, u = this.u; return this.v.x0 + ((px - p.l * u) / (this.w - (p.l + p.r) * u)) * (this.v.x1 - this.v.x0); }
  uy(py) { const p = this.pad, u = this.u; return this.v.y0 + ((this.h - p.b * u - py) / (this.h - (p.t + p.b) * u)) * (this.v.y1 - this.v.y0); }
  sx(d) { return (d / (this.v.x1 - this.v.x0)) * (this.w - (this.pad.l + this.pad.r) * this.u); }
  sy(d) { return (d / (this.v.y1 - this.v.y0)) * (this.h - (this.pad.t + this.pad.b) * this.u); }
  clear(bg = PAPER) { this.handles = []; const g = this.g; g.fillStyle = bg === '#fff' ? PAPER : bg; g.fillRect(0, 0, this.w, this.h); g.lineCap = 'round'; g.lineJoin = 'round'; if (bg === PAPER || bg === '#fff') { g.strokeStyle = 'rgba(86, 180, 233, 0.13)'; g.lineWidth = 1; for (let y = 26 * this.u; y < this.h; y += 26 * this.u) { g.beginPath(); g.moveTo(0, y); g.lineTo(this.w, y); g.stroke(); } } return this; }
  // a pen stroke between two screen points
  ink(x1, y1, x2, y2, color = INK, width = 1.5, alpha = 1, dash = null) { const g = this.g, L = Math.hypot(x2 - x1, y2 - y1), k = Math.min(2.2 * this.u, L * 0.03), mx = (x1 + x2) / 2 + wob(x1 + y2, y1 - x2) * k * 2, my = (y1 + y2) / 2 + wob(y1 + x2, x1 - y2) * k * 2; g.beginPath(); g.moveTo(x1 + wob(x1, y1) * k * 0.5, y1 + wob(y1, x1) * k * 0.5); g.quadraticCurveTo(mx, my, x2 + wob(x2, y2) * k * 0.5, y2 + wob(y2, x2) * k * 0.5); g.strokeStyle = color; g.lineWidth = width; g.globalAlpha = alpha; g.setLineDash(dash ? dash.map((d) => d * this.u) : []); g.stroke(); g.setLineDash([]); g.globalAlpha = 1; }
  frame(px, py, w, h, color = INK, width = 1.5, dash = null) { this.ink(px, py, px + w, py, color, width, 1, dash); this.ink(px + w, py, px + w, py + h, color, width, 1, dash); this.ink(px + w, py + h, px, py + h, color, width, 1, dash); this.ink(px, py + h, px, py, color, width, 1, dash); }
  font(size = 12, mono = false, bold = false) { this.g.font = mono ? `${bold ? '500 ' : ''}${size * this.u}px 'DM Mono', monospace` : `${bold ? '600' : '400'} ${size * 1.36 * this.u}px 'Caveat', 'Atkinson', cursive`; }
  axes({ x = '', y = '', xt = 5, yt = 5, grid = true, xfmt = (v) => nice(v), yfmt = (v) => nice(v) } = {}) {
    const g = this.g, v = this.v, u = this.u; g.lineWidth = 1; this.font(10.5, true); g.fillStyle = INK2;
    for (let i = 0; i <= xt; i++) { const xv = v.x0 + ((v.x1 - v.x0) * i) / xt, px = this.X(xv); if (grid) this.ink(px, this.Y(v.y0), px, this.Y(v.y1), PALE, 1); g.textAlign = 'center'; g.textBaseline = 'top'; g.fillText(xfmt(xv), px, this.Y(v.y0) + 5 * u); }
    for (let i = 0; i <= yt; i++) { const yv = v.y0 + ((v.y1 - v.y0) * i) / yt, py = this.Y(yv); if (grid) this.ink(this.X(v.x0), py, this.X(v.x1), py, PALE, 1); g.textAlign = 'right'; g.textBaseline = 'middle'; g.fillText(yfmt(yv), this.X(v.x0) - 6 * u, py); }
    { const ax = this.X(v.x0), ay = this.Y(v.y0), tx = this.X(v.x1), ty = this.Y(v.y1); this.ink(ax, ay + 2 * u, ax, ty - 6 * u, INK, 2.4 * u); this.ink(ax - 2 * u, ay, tx + 6 * u, ay, INK, 2.4 * u); this.ink(ax - 5 * u, ty + 2 * u, ax, ty - 7 * u, INK, 2.2 * u); this.ink(ax + 5 * u, ty + 2 * u, ax, ty - 7 * u, INK, 2.2 * u); this.ink(tx - 2 * u, ay - 5 * u, tx + 7 * u, ay, INK, 2.2 * u); this.ink(tx - 2 * u, ay + 5 * u, tx + 7 * u, ay, INK, 2.2 * u); }
    this.font(11.5); g.fillStyle = INK; if (x) { g.textAlign = 'center'; g.textBaseline = 'bottom'; g.fillText(x, (this.X(v.x0) + this.X(v.x1)) / 2, this.h - 3 * u); }
    if (y) { g.save(); g.translate(12 * u, (this.Y(v.y0) + this.Y(v.y1)) / 2); g.rotate(-Math.PI / 2); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(y, 0, 0); g.restore(); }
    return this;
  }
  mark(px, py, r, shape = 'circle', fill = DATA[0], stroke = null, lw = 1.5) {
    const g = this.g; g.beginPath();
    if (shape === 'square') g.rect(px - r, py - r, 2 * r, 2 * r);
    else if (shape === 'tri') { g.moveTo(px, py - r * 1.2); g.lineTo(px + r * 1.1, py + r * 0.9); g.lineTo(px - r * 1.1, py + r * 0.9); g.closePath(); }
    else if (shape === 'diamond') { g.moveTo(px, py - r * 1.3); g.lineTo(px + r * 1.3, py); g.lineTo(px, py + r * 1.3); g.lineTo(px - r * 1.3, py); g.closePath(); }
    else if (shape === 'cross') { g.moveTo(px - r, py - r); g.lineTo(px + r, py + r); g.moveTo(px + r, py - r); g.lineTo(px - r, py + r); g.strokeStyle = fill; g.lineWidth = Math.max(2, r * 0.5); g.stroke(); return; }
    else g.arc(px, py, r, 0, Math.PI * 2);
    if (shape === 'ring') { g.strokeStyle = fill; g.lineWidth = Math.max(2, r * 0.4); g.stroke(); return; }
    if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); }
  }
  dot(x, y, o = {}) { const { r = 4.5, color = DATA[0], shape = 'circle', alpha = 1, label } = o, g = this.g, stroke = o.stroke === undefined || o.stroke === '#fff' ? (r >= 3 ? INK : null) : o.stroke; g.globalAlpha = alpha; this.mark(this.X(x), this.Y(y), r * this.u, shape, color, stroke, Math.max(1, r * 0.26) * this.u); g.globalAlpha = 1; if (label) this.text(label, x, y, { dx: (r + 4) * this.u, size: 10.5, align: 'left', color: o.labelColor || INK2 }); return this; }
  dots(pts, o = {}) { for (const p of pts) this.dot(p[0], p[1], o); return this; }
  line(x1, y1, x2, y2, o = {}) { this.ink(this.X(x1), this.Y(y1), this.X(x2), this.Y(y2), o.color || INK, (o.width || 1.5) * this.u * 1.15, o.alpha ?? 1, o.dash); return this; }
  path(pts, o = {}) { const g = this.g; if (!pts.length) return this; g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(this.X(p[0]), this.Y(p[1])) : g.moveTo(this.X(p[0]), this.Y(p[1])))); if (o.close) g.closePath(); g.globalAlpha = o.alpha ?? 1; if (o.fill) { g.fillStyle = o.fill; g.fill(); } if (o.color !== null) { g.strokeStyle = o.color || INK; g.lineWidth = (o.width || 1.5) * this.u; g.setLineDash((o.dash || []).map((d) => d * this.u)); g.stroke(); g.setLineDash([]); } g.globalAlpha = 1; return this; }
  fn(f, o = {}) { const pts = [], n = o.n || 120; for (let i = 0; i <= n; i++) { const x = this.v.x0 + ((this.v.x1 - this.v.x0) * i) / n, y = f(x); if (Number.isFinite(y)) pts.push([x, Math.max(this.v.y0 - 1e6, Math.min(this.v.y1 + 1e6, y))]); } return this.path(pts, o); }
  rect(x, y, w, h, o = {}) { const g = this.g, px = this.X(x), py = this.Y(y + h), pw = this.sx(w), ph = this.sy(h), a = o.alpha ?? 1; g.globalAlpha = a; if (o.fill) { g.fillStyle = o.fill; g.fillRect(px, py, pw, ph); } g.globalAlpha = 1; const bar = o.fill && !o.color && a >= 0.5 && Math.abs(Math.abs(pw) - Math.abs(ph)) > 3 * this.u && Math.min(Math.abs(pw), Math.abs(ph)) > 5 * this.u; if (o.color || bar) this.frame(px, py, pw, ph, o.color || INK, (o.width || 1.3) * this.u, o.dash); return this; }
  circle(x, y, rw, o = {}) { const g = this.g; g.beginPath(); g.ellipse(this.X(x), this.Y(y), Math.abs(this.sx(rw)), Math.abs(this.sy(o.ry ?? rw)), 0, 0, Math.PI * 2); g.globalAlpha = o.alpha ?? 1; if (o.fill) { g.fillStyle = o.fill; g.fill(); } if (o.color) { g.strokeStyle = o.color; g.lineWidth = (o.width || 1.5) * this.u; g.setLineDash((o.dash || []).map((d) => d * this.u)); g.stroke(); g.setLineDash([]); } g.globalAlpha = 1; return this; }
  text(s, x, y, o = {}) { const g = this.g; this.font(o.size || 11.5, o.mono, o.bold); g.fillStyle = o.color || INK; g.textAlign = o.align || 'center'; g.textBaseline = o.base || 'middle'; const px = this.X(x) + (o.dx || 0), py = this.Y(y) + (o.dy || 0); if (o.bg) { const w = g.measureText(s).width + 8 * this.u, h = (o.size || 11.5) * this.u * 1.5; g.fillStyle = o.bg; g.fillRect(o.align === 'left' ? px - 4 * this.u : o.align === 'right' ? px - w + 4 * this.u : px - w / 2, py - h / 2, w, h); g.fillStyle = o.color || INK; } g.fillText(s, px, py); return this; }
  // screen-space text and boxes, in units that scale with the interface
  label(s, px, py, o = {}) { const g = this.g; this.font(o.size || 11.5, o.mono, o.bold); g.fillStyle = o.color || INK; g.textAlign = o.align || 'left'; g.textBaseline = o.base || 'middle'; g.fillText(s, px, py); return g.measureText(s).width; }
  box(px, py, w, h, o = {}) { const g = this.g, a = o.alpha ?? 1, slip = o.fill && o.color && a >= 0.9 && w > 44 * this.u && h > 22 * this.u; if (slip) { g.fillStyle = 'rgba(28, 43, 74, 0.2)'; g.fillRect(px + 3 * this.u, py + 4 * this.u, w, h); } g.globalAlpha = a; if (o.fill) { g.fillStyle = o.fill; g.fillRect(px, py, w, h); } g.globalAlpha = 1; if (o.color) this.frame(px, py, w, h, o.color === PALE ? GREY : o.color, (o.width || 1.2) * this.u * (slip ? 1.4 : 1), o.dash); return this; }
  // a thing the player can take hold of
  handle(id, x, y, o = {}) { const r = (o.r || 9), px = this.X(x), py = this.Y(y), g = this.g, f = this.handles.length === this.focus; this.handles.push({ id, x, y, r }); if (o.draw !== false) { const R = Math.max(r, 9) * 1.25 * this.u, e = R * 0.3; g.fillStyle = 'rgba(28, 43, 74, 0.22)'; g.beginPath(); g.arc(px + 2.5 * this.u, py + 3.5 * this.u, R, 0, 7); g.fill(); this.mark(px, py, R, o.shape === 'ring' || o.shape === 'cross' ? 'circle' : o.shape || 'circle', o.color || INK2, INK, 2.2 * this.u); const ey = py - (o.shape === 'tri' ? -R * 0.1 : R * 0.12); for (const sx of [-1, 1]) { g.beginPath(); g.arc(px + sx * e, ey, e * 0.78, 0, 7); g.fillStyle = '#fff'; g.fill(); g.strokeStyle = INK; g.lineWidth = 1 * this.u; g.stroke(); g.beginPath(); g.arc(px + sx * e + e * 0.2, ey + e * 0.12, e * 0.36, 0, 7); g.fillStyle = INK; g.fill(); } g.beginPath(); g.arc(px, ey + e * 0.9, e * 0.9, 0.25, Math.PI - 0.25); g.strokeStyle = INK; g.lineWidth = 1.4 * this.u; g.stroke(); } if (f) { g.beginPath(); g.arc(px, py, (r + 7) * this.u, 0, 7); g.strokeStyle = DATA[1]; g.lineWidth = 3 * this.u; g.stroke(); } if (o.label) this.text(o.label, x, y, { dy: -(Math.max(r, 9) * 1.25 + 12) * this.u, size: 11.5, bold: true, bg: 'rgba(255, 253, 245, 0.9)' }); return this; }
  // a pixel-space hit area (for cards, cells and buttons drawn on the canvas)
  zone(id, px, py, w, h) { this.handles.push({ id, x: this.ux(px + w / 2), y: this.uy(py + h / 2), r: Math.max(w, h) / 2 / this.u, zone: [px, py, w, h] }); if (this.handles.length - 1 === this.focus) this.box(px - 2, py - 2, w + 4, h + 4, { color: DATA[1], width: 3 }); return this; }
}
export function nice(v) { if (!Number.isFinite(v)) return ''; const a = Math.abs(v); if (a >= 10000) return Math.round(v).toLocaleString('en-US'); if (a >= 100 || Number.isInteger(v)) return String(Math.round(v)); if (a >= 10) return v.toFixed(1); if (a >= 1) return v.toFixed(2).replace(/\.?0+$/, ''); return v.toFixed(3).replace(/0+$/, '').replace(/\.$/, '') || '0'; }
export const pct = (v, d = 0) => (v * 100).toFixed(d) + '%';
