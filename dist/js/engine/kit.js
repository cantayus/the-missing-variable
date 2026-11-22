// The diorama kit: the parts every place is built from.
// Places are recipes (see places_*.js). Nothing is loaded from model files and no picture is a photograph:
// ground grain, mown stripes, window panes and water ripples are all drawn by the code below.
import * as THREE from 'three';
import { RNG } from '../core/rng.js';

export const SEASONS = {
  fall:   { grass: 0xa3b066, lawn: 0xb3c074, tuft: [0x8f9c52, 0xb5b060, 0xa08a4a, 0x9aa85c], trees: [0xd98b2b, 0xc9562b, 0xe2b23a, 0x8a9a3c, 0xb8482f, 0xcf7a2a, 0xe8c24a], conifer: 0x4a7358, flowers: [0xe2b23a, 0xc9562b], sky: ['#f6e3cf', '#cfe2ee'], haze: 0xe9dcc8, water: 0x4f8ea3 },
  winter: { grass: 0xe6ecef, lawn: 0xf1f4f6, tuft: [0xcfd6d0, 0xb9b79a, 0xdfe5e6], trees: [0xdfe6ea, 0xd3dce2, 0xeef2f4], conifer: 0x466b5c, flowers: [], sky: ['#e8eef4', '#c9d9e6'], haze: 0xe4eaef, water: 0x7fa6b8 },
  spring: { grass: 0x97c873, lawn: 0xaad883, tuft: [0x86bd62, 0x9fd27a, 0x74ad58, 0xb2dc86], trees: [0x8fc46b, 0x7dba66, 0xa5d477, 0x94cc70], conifer: 0x4f8a5f, flowers: [0xffffff, 0xf7d94c, 0xf3a6c0, 0xb48ad6, 0xf08a5a], sky: ['#eaf4f8', '#bfdff2'], haze: 0xe6f0ee, water: 0x4a9ab0 },
  summer: { grass: 0x78b862, lawn: 0x8cc874, tuft: [0x69a955, 0x82bf66, 0x5c9c4e, 0x93c96f], trees: [0x4f9a54, 0x5fae5a, 0x3f8a58, 0x6bb568, 0x4a9050], conifer: 0x3f7a55, flowers: [0xffffff, 0xf7d94c, 0xe8674f, 0x8fa9e8], sky: ['#e4f2fb', '#a9d6f2'], haze: 0xe3eef2, water: 0x3f93ad },
};

export const C = {
  brick: 0xb5654a, brickDark: 0x9a5340, stone: 0xcfc7b8, lime: 0xe4dccb, sand: 0xd9c4a0, concrete: 0xd4d5d2,
  white: 0xf4f2ec, glass: 0xbfe3f2, slate: 0x6b7684, roof: 0x4a5568, copper: 0x6fa59a, wood: 0xa47148,
  red: 0xc0503f, dark: 0x3a4250, steel: 0xaab4bd, water: 0x4f8ea3, soil: 0x9a7b5a, rock: 0x7d7f86,
  path: 0xe2d8c3, plaza: 0xd9d4c8, ink: 0x1c2b4a, glow: 0x9fe8ff, gold: 0xd9a441, teal: 0x3f9aa0, cream: 0xefe6d2, bark: 0x7a5a43,
};

// ---------- shared geometry and materials ----------
const geoCache = new Map();
const cachedGeos = new WeakSet();
export function G(key, make) { if (!geoCache.has(key)) { const g = make(); geoCache.set(key, g); cachedGeos.add(g); } return geoCache.get(key); }
export const isShared = (geo) => cachedGeos.has(geo);
const matCache = new Map();
export function M(color, opts = {}) {
  const key = color + JSON.stringify(opts);
  if (!matCache.has(key)) matCache.set(key, new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.9, metalness: 0, ...opts }));
  return matCache.get(key);
}
const NI = (key, make) => G('ni:' + key, () => { const g = make(); return g.index ? g.toNonIndexed() : g; });
function lumpy(geo, amt, seed) { // push vertices about so nothing natural is a perfect ball
  const r = new RNG(seed), p = geo.attributes.position, seen = new Map();
  for (let i = 0; i < p.count; i++) {
    const key = p.getX(i).toFixed(3) + ',' + p.getY(i).toFixed(3) + ',' + p.getZ(i).toFixed(3);
    if (!seen.has(key)) seen.set(key, 1 + r.range(-amt, amt));
    const s = seen.get(key); p.setXYZ(i, p.getX(i) * s, p.getY(i) * s, p.getZ(i) * s);
  }
  return geo;
}
const blob = (i) => NI('blob' + i, () => lumpy(new THREE.IcosahedronGeometry(1, 1), 0.2, 'blob' + i));
const rockGeo = (i) => NI('rock' + i, () => lumpy(new THREE.IcosahedronGeometry(1, 0), 0.3, 'rock' + i));
const cylGeo = () => NI('cyl6', () => new THREE.CylinderGeometry(0.7, 1, 1, 6));
const coneGeo = (n = 7) => NI('cone' + n, () => new THREE.ConeGeometry(1, 1, n));
const leafGeo = () => NI('leaf', () => new THREE.ConeGeometry(0.34, 1, 3));

// ---------- textures drawn by code ----------
const texCache = new Map();
function canvasTex(key, size, draw, { repeat = 1, srgb = true } = {}) {
  if (!texCache.has(key)) {
    const c = document.createElement('canvas'); c.width = c.height = size; draw(c.getContext('2d'), size);
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace; t.anisotropy = 8; texCache.set(key, t);
  }
  const t = texCache.get(key).clone(); t.repeat.set(repeat, repeat); t.needsUpdate = true; return t;
}
const grainTex = (repeat) => canvasTex('grain', 512, (g, S) => {
  const r = new RNG('grain'); g.fillStyle = '#fff'; g.fillRect(0, 0, S, S);
  for (let i = 0; i < 20000; i++) { const v = r.chance(0.5) ? 0 : 255; g.fillStyle = `rgba(${v},${v},${v},${r.range(0.03, 0.1)})`; const s = r.range(1, 3.4); g.fillRect(r.u() * S, r.u() * S, s, s); }
  for (let i = 0; i < 160; i++) { g.fillStyle = `rgba(0,0,0,${r.range(0.015, 0.04)})`; g.beginPath(); g.arc(r.u() * S, r.u() * S, r.range(10, 44), 0, 7); g.fill(); }
}, { repeat });
const stripeTex = () => canvasTex('stripe', 256, (g, S) => { g.fillStyle = '#fff'; g.fillRect(0, 0, S, S); g.fillStyle = 'rgba(0,0,0,0.07)'; g.fillRect(0, 0, S / 2, S); const r = new RNG('st'); for (let i = 0; i < 4000; i++) { g.fillStyle = `rgba(0,0,0,${r.range(0.02, 0.06)})`; g.fillRect(r.u() * S, r.u() * S, 1, 3); } });
function rippleNormal() {
  return canvasTex('ripple', 512, (g, S) => {
    const img = g.createImageData(S, S), h = (x, y) => { const u = (x / S) * Math.PI * 2, v = (y / S) * Math.PI * 2; return Math.sin(u * 3 + Math.sin(v * 2) * 1.3) * 0.5 + Math.sin(v * 5 + u * 2) * 0.3 + Math.sin(u * 9 - v * 7) * 0.15 + Math.sin(u * 13 + v * 11) * 0.08; };
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const dx = h(x + 1, y) - h(x - 1, y), dy = h(x, y + 1) - h(x, y - 1), nx = -dx * 2.2, ny = -dy * 2.2, l = Math.hypot(nx, ny, 1), i = (y * S + x) * 4;
      img.data[i] = (nx / l * 0.5 + 0.5) * 255; img.data[i + 1] = (ny / l * 0.5 + 0.5) * 255; img.data[i + 2] = (1 / l * 0.5 + 0.5) * 255; img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
  }, { srgb: false });
}
const winCache = new Map();
function windowTextures(wall, style = 'grid') {
  const key = wall + style;
  if (winCache.has(key)) return winCache.get(key);
  const S = 256, r = new RNG(key);
  const mk = () => { const c = document.createElement('canvas'); c.width = c.height = S; return c; };
  const a = mk(), b = mk(), ca = a.getContext('2d'), cb = b.getContext('2d'), col = new THREE.Color(wall);
  ca.fillStyle = '#' + col.getHexString(); ca.fillRect(0, 0, S, S);
  for (let i = 0; i < 1800; i++) { const v = r.chance(0.5) ? 0 : 255; ca.fillStyle = `rgba(${v},${v},${v},${r.range(0.02, 0.06)})`; ca.fillRect(r.u() * S, r.u() * S, r.range(3, 16), r.range(1, 4)); }
  cb.fillStyle = '#000'; cb.fillRect(0, 0, S, S);
  const cols = style === 'bands' ? 1 : 4, rows = 4;
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
    const cw = S / cols, ch = S / rows, w = style === 'bands' ? cw : cw * 0.46, h = ch * (style === 'tall' ? 0.7 : 0.5);
    const x = i * cw + (cw - w) / 2 + r.range(-1, 1), y = j * ch + (ch - h) / 2 + r.range(-1, 1);
    const d = col.clone().multiplyScalar(0.55 + r.range(-0.05, 0.08));
    ca.fillStyle = '#' + d.getHexString(); ca.fillRect(x, y, w, h);
    ca.fillStyle = 'rgba(255,255,255,0.14)'; ca.fillRect(x, y, w, 3); ca.fillStyle = 'rgba(0,0,0,0.12)'; ca.fillRect(x, y + h, w, 3); if (style !== 'bands') { ca.fillStyle = 'rgba(255,255,255,0.1)'; ca.fillRect(x + w / 2 - 1, y, 2, h); ca.fillRect(x, y + h / 2 - 1, w, 2); }
    if (r.chance(0.6)) { cb.fillStyle = r.chance(0.5) ? '#fff' : '#bbb'; cb.fillRect(x, y, w, h); }
  }
  const ta = new THREE.CanvasTexture(a), tb = new THREE.CanvasTexture(b);
  for (const t of [ta, tb]) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = t === ta ? THREE.SRGBColorSpace : THREE.NoColorSpace; t.anisotropy = 8; }
  const out = { map: ta, emissive: tb }; winCache.set(key, out); return out;
}
function prismGeo() {
  return G('prism', () => {
    const g = new THREE.BufferGeometry();
    const v = new Float32Array([-0.5, 0, 0.5, 0.5, 0, 0.5, 0, 1, 0.5, 0.5, 0, -0.5, -0.5, 0, -0.5, 0, 1, -0.5, -0.5, 0, -0.5, -0.5, 0, 0.5, 0, 1, 0.5, -0.5, 0, -0.5, 0, 1, 0.5, 0, 1, -0.5, 0.5, 0, 0.5, 0.5, 0, -0.5, 0, 1, -0.5, 0.5, 0, 0.5, 0, 1, -0.5, 0, 1, 0.5]);
    g.setAttribute('position', new THREE.BufferAttribute(v, 3)); g.computeVertexNormals(); return g;
  });
}

// ---------- the ground mask: what is under your feet at any point ----------
export const WILD = 0, LAWN = 1, PAVED = 2, WATER = 3, BUILT = 4;
class Mask {
  constructor(size, n = 176) { this.size = size; this.n = n; this.d = new Uint8Array(n * n); this.cell = size / n; }
  ij(x, z) { return [Math.floor((x / this.size + 0.5) * this.n), Math.floor((z / this.size + 0.5) * this.n)]; }
  get(x, z) { const [i, j] = this.ij(x, z); return i < 0 || j < 0 || i >= this.n || j >= this.n ? 9 : this.d[j * this.n + i]; }
  rect(x, z, w, d, rot, v, grow = 0, force = false) {
    const rad = Math.hypot(w, d) / 2 + grow + this.cell, [i0, j0] = this.ij(x - rad, z - rad), [i1, j1] = this.ij(x + rad, z + rad), c = Math.cos(rot), s = Math.sin(rot);
    for (let j = Math.max(0, j0); j <= Math.min(this.n - 1, j1); j++) for (let i = Math.max(0, i0); i <= Math.min(this.n - 1, i1); i++) {
      const px = (i + 0.5) * this.cell - this.size / 2 - x, pz = (j + 0.5) * this.cell - this.size / 2 - z, lx = px * c - pz * s, lz = px * s + pz * c;
      if (Math.abs(lx) <= w / 2 + grow && Math.abs(lz) <= d / 2 + grow && (force || this.d[j * this.n + i] <= v)) this.d[j * this.n + i] = v;
    }
  }
  disc(x, z, rx, rz, v) {
    const [i0, j0] = this.ij(x - rx, z - rz), [i1, j1] = this.ij(x + rx, z + rz);
    for (let j = Math.max(0, j0); j <= Math.min(this.n - 1, j1); j++) for (let i = Math.max(0, i0); i <= Math.min(this.n - 1, i1); i++) {
      const px = ((i + 0.5) * this.cell - this.size / 2 - x) / rx, pz = ((j + 0.5) * this.cell - this.size / 2 - z) / rz;
      if (px * px + pz * pz <= 1 && this.d[j * this.n + i] <= v) this.d[j * this.n + i] = v;
    }
  }
  near(x, z, v, rad) { for (let a = 0; a < 8; a++) if (this.get(x + Math.cos(a * 0.785) * rad, z + Math.sin(a * 0.785) * rad) === v) return true; return false; }
}

// ---------- a batch: many small shapes baked into one mesh with vertex colors and a wind sway ----------
export class Batch {
  constructor() { this.pos = []; this.col = []; this.flex = []; this._c = new THREE.Color(); this._v = new THREE.Vector3(); this.owner = null; this.spans = []; }
  add(geo, m4, color, flex = 0, jitter = 0, r = null) {
    const p = geo.attributes.position, c = this._c.set(color), v = this._v;
    if (jitter && r) c.offsetHSL(r.range(-0.012, 0.012), r.range(-0.04, 0.04), r.range(-jitter, jitter));
    const top = flex < 0, from = this.flex.length; // negative flex: sway grows with height inside the shape
    for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const ly = v.y; v.applyMatrix4(m4); this.pos.push(v.x, v.y, v.z); this.col.push(c.r, c.g, c.b); this.flex.push(top ? -flex * Math.max(0, ly + 0.5) : flex); }
    if (this.owner) this.spans.push([this.owner, from, this.flex.length]);
  }
  // take out everything that belongs to the plants `gone(owner)` picks; returns how many plants went
  drop(gone) {
    const cut = new Set(this.spans.filter(([o]) => gone(o)).map(([o]) => o)); if (!cut.size) return 0;
    const n = this.flex.length, kill = new Uint8Array(n); for (const [o, a, b] of this.spans) if (cut.has(o)) kill.fill(1, a, b);
    const at = new Int32Array(n + 1), pos = [], col = [], flex = [];
    for (let i = 0; i < n; i++) { at[i] = flex.length; if (kill[i]) continue; pos.push(this.pos[3 * i], this.pos[3 * i + 1], this.pos[3 * i + 2]); col.push(this.col[3 * i], this.col[3 * i + 1], this.col[3 * i + 2]); flex.push(this.flex[i]); }
    at[n] = flex.length; this.pos = pos; this.col = col; this.flex = flex;
    this.spans = this.spans.filter(([o]) => !cut.has(o)).map(([o, a, b]) => [o, at[a], at[b]]); return cut.size;
  }
  mesh(wind) {
    if (!this.pos.length) return null;
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3)); g.setAttribute('aFlex', new THREE.Float32BufferAttribute(this.flex, 1));
    g.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.95 });
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.uTime = wind;
      sh.vertexShader = 'uniform float uTime;\nattribute float aFlex;\n' + sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
        float ph = position.x * 0.31 + position.z * 0.27;
        transformed.x += (sin(uTime * 1.25 + ph) + 0.4 * sin(uTime * 2.9 + ph * 2.3)) * 0.085 * aFlex;
        transformed.z += cos(uTime * 0.95 + ph * 1.2) * 0.06 * aFlex;`);
    };
    const m = new THREE.Mesh(g, mat); m.castShadow = true; m.receiveShadow = true; m.userData.batch = true; return m;
  }
}
const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3();
export function TRS(px, py, pz, sx, sy, sz, rx = 0, ry = 0, rz = 0) { _e.set(rx, ry, rz); _q.setFromEuler(_e); return _m.compose(_p.set(px, py, pz), _q, _s.set(sx, sy, sz)); }

export class Kit {
  constructor(group, { season = 'fall', seed = 'place', gfx = 2, wind = { value: 0 } } = {}) {
    this.g = group; this.season = SEASONS[season]; this.seasonName = season; this.r = new RNG(seed); this.gfx = gfx; this.wind = wind;
    this.anim = []; this.obstacles = []; this.windowMats = []; this.labels = []; this.picks = []; this.spots = [];
    this.npcs = []; this.fauna = []; this.treeSpots = []; this.lampMats = []; this.waterAreas = []; this.tracks = [];
    this.veg = new Batch(); this.own = [];
    this.door = { x: 0, z: 10 }; this.spawn = { x: 0, z: 22 }; this.size = 60; this.mask = new Mask(60);
    this.player = { x: 0, z: 0 }; this.weather = null; this.tags = [];
  }
  add(mesh, { shadow = true, receive = true } = {}) { mesh.castShadow = shadow; mesh.receiveShadow = receive; this.g.add(mesh); return mesh; }
  mat(color, opts) { return M(color, opts); }
  mesh(geo, color, opts) { const m = new THREE.Mesh(geo, M(color, opts)); return this.add(m); }
  custom(mesh) { this.g.add(mesh); return mesh; }

  // ----- ground -----
  ground({ size = 60, color } = {}) {
    this.size = size; this.mask = new Mask(size);
    const s = size, top = color ?? this.season.grass, r = this.r;
    const seg = 56, pg = new THREE.PlaneGeometry(s, s, seg, seg).rotateX(-Math.PI / 2), pos = pg.attributes.position, col = new Float32Array(pos.count * 3), base = new THREE.Color(top), c = new THREE.Color();
    const lat = Array.from({ length: 81 }, () => r.u()), noise = (x, z) => { const fx = (x / s + 0.5) * 8, fz = (z / s + 0.5) * 8, i = Math.floor(fx), j = Math.floor(fz), u = fx - i, v = fz - j, a = lat[j * 9 + i] ?? 0.5, b = lat[j * 9 + i + 1] ?? 0.5, d = lat[(j + 1) * 9 + i] ?? 0.5, e = lat[(j + 1) * 9 + i + 1] ?? 0.5, su = u * u * (3 - 2 * u), sv = v * v * (3 - 2 * v); return a + (b - a) * su + (d - a) * sv + (a - b - d + e) * su * sv; };
    for (let i = 0; i < pos.count; i++) { const n = noise(pos.getX(i), pos.getZ(i)) - 0.5 + r.range(-0.08, 0.08); c.copy(base).offsetHSL(n * 0.03, n * 0.1, n * 0.11); col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b; }
    pg.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const gm = new THREE.Mesh(pg, new THREE.MeshStandardMaterial({ vertexColors: true, map: grainTex(9), roughness: 1 })); gm.receiveShadow = true; this.g.add(gm); this.own.push(gm.material);
    const mk = (w, h, y, cc, inset = 0) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w - inset, h, w - inset), M(cc, { map: null })); m.position.y = y; return this.add(m, { shadow: false }); };
    mk(s, 0.6, -0.31, top, 0.02); mk(s, 2.2, -1.7, C.soil, 0.15); mk(s, 2.6, -4.1, C.rock, 0.5);
    for (let i = 0; i < 14; i++) { const side = i % 4, t = r.range(-s / 2 + 3, s / 2 - 3), e = s / 2 - 0.2, k = r.range(0.6, 1.6); const m = new THREE.Mesh(rockGeo(i % 3), M(i % 2 ? C.rock : 0x8d8f96)); m.position.set(side === 0 ? e : side === 1 ? -e : t, r.range(-5, -2.2), side === 2 ? e : side === 3 ? -e : t); m.scale.set(k, k * 0.8, k); this.add(m, { shadow: false }); }
    return this;
  }
  patch(x, z, w, d, color, y = 0.02, kind = PAVED, tex = true) {
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 1, map: tex ? grainTex(Math.max(1, Math.round(Math.max(w, d) / 7))) : null }); this.own.push(mat);
    const m = new THREE.Mesh(G('plane', () => new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2)), mat);
    m.position.set(x, y, z); m.scale.set(w, 1, d); m.receiveShadow = true; this.g.add(m); if (kind != null) this.mask.rect(x, z, w, d, 0, kind); return m;
  }
  lawn(x, z, w, d) {
    const t = stripeTex(); t.repeat.set(Math.max(1, Math.round(w / 2.6)), 1); const mat = new THREE.MeshStandardMaterial({ color: this.season.lawn, roughness: 1, map: this.seasonName === 'winter' ? null : t }); this.own.push(mat);
    const m = new THREE.Mesh(G('plane', () => new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2)), mat); m.position.set(x, 0.015, z); m.scale.set(w, 1, d); m.receiveShadow = true; this.g.add(m); this.mask.rect(x, z, w, d, 0, LAWN); return m;
  }
  plaza(x, z, w, d, color = C.plaza) { return this.patch(x, z, w, d, color, 0.03, PAVED); }
  disc(x, z, r, color, y = 0.03) {
    const m = new THREE.Mesh(G('disc', () => new THREE.CircleGeometry(1, 28).rotateX(-Math.PI / 2)), M(color, { roughness: 1 }));
    m.position.set(x, y, z); m.scale.set(r, 1, r); m.receiveShadow = true; this.g.add(m); this.mask.disc(x, z, r, r, color === this.season.lawn || color === this.season.grass ? LAWN : PAVED); return m;
  }
  path(pts, w = 1.6, color = C.path, y = 0.04) {
    const mat = new THREE.MeshStandardMaterial({ color, roughness: 1, map: grainTex(2) }); this.own.push(mat);
    for (let i = 0; i < pts.length - 1; i++) {
      const [x1, z1] = pts[i], [x2, z2] = pts[i + 1], len = Math.hypot(x2 - x1, z2 - z1), rot = Math.atan2(x2 - x1, z2 - z1);
      const m = new THREE.Mesh(G('plane', () => new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2)), mat);
      m.position.set((x1 + x2) / 2, y + i * 0.0004, (z1 + z2) / 2); m.scale.set(w, 1, len + w * 0.5); m.rotation.y = rot; m.receiveShadow = true; this.g.add(m);
      this.mask.rect((x1 + x2) / 2, (z1 + z2) / 2, w, len + w * 0.5, rot, PAVED);
    }
    return this;
  }

  // ----- water: a deep layer with moving ripples, pale shallows, a bank, and a fall where it meets the edge -----
  waterMat(kind = 'deep') {
    if (!this._wm) {
      const n = rippleNormal(); n.repeat.set(3, 3); this._ripple = n; const winter = this.seasonName === 'winter';
      this._wm = {
        deep: new THREE.MeshStandardMaterial({ color: this.season.water, roughness: winter ? 0.45 : 0.16, metalness: 0.05, transparent: true, opacity: 0.9, normalMap: n, normalScale: new THREE.Vector2(0.55, 0.55), envMapIntensity: 1.5 }),
        shallow: new THREE.MeshStandardMaterial({ color: new THREE.Color(this.season.water).lerp(new THREE.Color(0xd9efe6), 0.55), roughness: 0.3, transparent: true, opacity: 0.55, normalMap: n, normalScale: new THREE.Vector2(0.3, 0.3) }),
        fall: new THREE.MeshStandardMaterial({ color: new THREE.Color(this.season.water).lerp(new THREE.Color(0xffffff), 0.45), roughness: 0.3, transparent: true, opacity: 0.6, normalMap: n, normalScale: new THREE.Vector2(0.9, 0.9), side: THREE.DoubleSide }),
        bank: M(0xcbbd98, { roughness: 1 }),
      };
      this.own.push(this._wm.deep, this._wm.shallow, this._wm.fall);
      this.anim.push((t, dt) => { n.offset.x += dt * 0.012; n.offset.y += dt * 0.03; });
    }
    return this._wm[kind];
  }
  _fall(x, z, w, rot) { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, 4.6), this.waterMat('fall')); m.position.set(x, -2.25, z); m.rotation.y = rot; this.g.add(m); }
  water(x, z, w, d, { round = false } = {}) {
    const e = this.size / 2;
    if (round) {
      for (const [k, grow, y] of [['bank', 0.9, 0.022], ['shallow', 0.35, 0.036], ['deep', 0, 0.05]]) { const m = new THREE.Mesh(G('disc', () => new THREE.CircleGeometry(1, 28).rotateX(-Math.PI / 2)), this.waterMat(k)); m.position.set(x, y, z); m.scale.set(w / 2 + grow, 1, d / 2 + grow); m.receiveShadow = true; this.g.add(m); }
      this.mask.disc(x, z, w / 2, d / 2, WATER); this.waterAreas.push({ x, z, rx: w / 2 - 0.6, rz: d / 2 - 0.6, round: true }); return this;
    }
    const x0 = Math.max(-e, x - w / 2), x1 = Math.min(e, x + w / 2), z0 = Math.max(-e, z - d / 2), z1 = Math.min(e, z + d / 2), cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, ww = x1 - x0, dd = z1 - z0;
    for (const [k, grow, y] of [['bank', 0.9, 0.022], ['shallow', 0.4, 0.036], ['deep', 0, 0.05]]) {
      const gx0 = x0 <= -e + 0.01 ? x0 : x0 - grow, gx1 = x1 >= e - 0.01 ? x1 : x1 + grow, gz0 = z0 <= -e + 0.01 ? z0 : z0 - grow, gz1 = z1 >= e - 0.01 ? z1 : z1 + grow;
      const m = new THREE.Mesh(G('plane', () => new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2)), this.waterMat(k)); m.position.set((gx0 + gx1) / 2, y, (gz0 + gz1) / 2); m.scale.set(gx1 - gx0, 1, gz1 - gz0); m.receiveShadow = true; this.g.add(m);
    }
    if (x0 <= -e + 0.01) this._fall(-e - 0.02, cz, dd, -Math.PI / 2); if (x1 >= e - 0.01) this._fall(e + 0.02, cz, dd, Math.PI / 2);
    if (z0 <= -e + 0.01) this._fall(cx, -e - 0.02, ww, Math.PI); if (z1 >= e - 0.01) this._fall(cx, e + 0.02, ww, 0);
    this.mask.rect(cx, cz, ww, dd, 0, WATER); this.waterAreas.push({ x: cx, z: cz, rx: ww / 2 - 0.8, rz: dd / 2 - 0.8, round: false });
    this.obstacles.push({ x0, x1, z0, z1, soft: true });
    return this;
  }
  river(pts, w = 5) { // a smooth ribbon along the points
    const e = this.size / 2, curve = new THREE.CatmullRomCurve3(pts.map(([x, z]) => new THREE.Vector3(x, 0, z)), false, 'catmullrom', 0.4), n = Math.max(24, Math.round(curve.getLength() / 1.2)), P = curve.getSpacedPoints(n);
    const ribbon = (half, y, mat) => {
      const pos = [], uv = [], idx = []; let run = 0;
      for (let i = 0; i <= n; i++) {
        const a = P[Math.max(0, i - 1)], b = P[Math.min(n, i + 1)], tx = b.x - a.x, tz = b.z - a.z, L = Math.hypot(tx, tz) || 1, nx = -tz / L, nz = tx / L;
        if (i) run += P[i].distanceTo(P[i - 1]);
        const wob = 1 + Math.sin(i * 0.9) * 0.08;
        pos.push(P[i].x + nx * half * wob, y, P[i].z + nz * half * wob, P[i].x - nx * half * wob, y, P[i].z - nz * half * wob); uv.push(0, run / 7, 1, run / 7);
        if (i < n) { const k = i * 2; idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3); }
      }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
      const m = new THREE.Mesh(g, mat); m.receiveShadow = true; this.g.add(m);
    };
    ribbon(w / 2 + 0.9, 0.022, this.waterMat('bank')); ribbon(w / 2 + 0.35, 0.036, this.waterMat('shallow')); ribbon(w / 2, 0.05, this.waterMat('deep'));
    for (let i = 0; i <= n; i++) { this.mask.disc(P[i].x, P[i].z, w / 2 + 0.2, w / 2 + 0.2, WATER); if (i % 3 === 0 && Math.abs(P[i].x) < e - 1 && Math.abs(P[i].z) < e - 1) this.waterAreas.push({ x: P[i].x, z: P[i].z, rx: w / 2 - 0.5, rz: w / 2 - 0.5, round: true, river: true }); }
    for (const [pt, nb] of [[P[0], P[1]], [P[n], P[n - 1]]]) { if (Math.abs(pt.x) >= e - 1.5 || Math.abs(pt.z) >= e - 1.5) { const ax = Math.abs(pt.x) > Math.abs(pt.z); this._fall(ax ? Math.sign(pt.x) * (e + 0.02) : pt.x, ax ? pt.z : Math.sign(pt.z) * (e + 0.02), w * 1.05, ax ? Math.sign(pt.x) * Math.PI / 2 : (pt.z > 0 ? 0 : Math.PI)); } }
    return this;
  }

  // ----- buildings -----
  box(x, z, w, d, h, o = {}) {
    const { color = C.stone, roof = 'flat', roofColor = C.roof, win = 'grid', rot = 0, y = 0, solid = true, roofH, name } = o;
    const grp = new THREE.Group(); grp.position.set(x, y, z); grp.rotation.y = rot;
    let side;
    if (win !== 'none' && h >= 2) {
      const t = windowTextures(color, win);
      const mk = (len) => {
        const map = t.map.clone(), em = t.emissive.clone(), rx = Math.max(1, Math.round(len / 5)), ry = Math.max(1, Math.round(h / 4.5));
        map.repeat.set(rx, ry); em.repeat.set(rx, ry); map.needsUpdate = em.needsUpdate = true;
        const m = new THREE.MeshStandardMaterial({ map, emissiveMap: em, emissive: 0xffd9a0, emissiveIntensity: 0, flatShading: true, roughness: 0.9 });
        this.windowMats.push(m); return m;
      };
      const a = mk(d), b = mk(w), top = M(color); side = [a, a, top, top, b, b];
    } else side = M(color, o.glass ? { transparent: true, opacity: 0.6, roughness: 0.08, metalness: 0.3, envMapIntensity: 1.6 } : {});
    const body = new THREE.Mesh(G('box', () => new THREE.BoxGeometry(1, 1, 1)), side);
    body.scale.set(w, h, d); body.position.y = h / 2; body.castShadow = true; body.receiveShadow = true; grp.add(body);
    const unit = () => G('box', () => new THREE.BoxGeometry(1, 1, 1));
    if (roof === 'gable') {
      const rh = roofH ?? Math.min(w, d) * 0.45, along = d >= w, m = new THREE.Mesh(prismGeo(), M(roofColor)); m.castShadow = true;
      if (along) m.scale.set(w * 1.06, rh, d * 1.04); else { m.rotation.y = Math.PI / 2; m.scale.set(d * 1.06, rh, w * 1.04); }
      m.position.y = h; grp.add(m);
      if (!o.plain && Math.min(w, d) > 3.5 && this.r.chance(0.6)) { const ch = new THREE.Mesh(unit(), M(C.brickDark)); ch.scale.set(0.6, rh * 0.9, 0.6); ch.position.set(along ? w * 0.22 : d * 0.1, h + rh * 0.6, along ? d * 0.2 : w * 0.2); ch.castShadow = true; grp.add(ch); }
    } else if (roof === 'hip') {
      const rh = roofH ?? Math.min(w, d) * 0.4, m = new THREE.Mesh(G('pyr', () => new THREE.ConeGeometry(Math.SQRT1_2, 1, 4).rotateY(Math.PI / 4)), M(roofColor));
      m.scale.set(w * 1.06, rh, d * 1.06); m.position.y = h + rh / 2; m.castShadow = true; grp.add(m);
    } else if (roof === 'flat') {
      const m = new THREE.Mesh(unit(), M(roofColor)); m.scale.set(w * 1.03, 0.25, d * 1.03); m.position.y = h + 0.12; grp.add(m);
      if (!o.plain && w > 5 && d > 5 && h > 3) { for (let i = 0; i < 2; i++) { const u = new THREE.Mesh(unit(), M(i ? C.steel : C.concrete)); u.scale.set(this.r.range(0.8, 1.6), this.r.range(0.5, 0.9), this.r.range(0.8, 1.6)); u.position.set(this.r.range(-w * 0.3, w * 0.3), h + 0.6, this.r.range(-d * 0.3, d * 0.3)); u.castShadow = true; grp.add(u); } }
    } else if (roof === 'green') {
      const m = new THREE.Mesh(unit(), M(this.season.lawn)); m.scale.set(w * 0.96, 0.3, d * 0.96); m.position.y = h + 0.15; grp.add(m);
      const n = Math.round((w * d) / 30); for (let i = 0; i < n; i++) { const b = new THREE.Mesh(blob(i % 3), M(this.r.pick(this.season.trees))); b.scale.setScalar(this.r.range(0.35, 0.6)); b.position.set(this.r.range(-w * 0.4, w * 0.4), h + 0.55, this.r.range(-d * 0.4, d * 0.4)); grp.add(b); }
    } else if (roof === 'solar') {
      const rows = Math.max(1, Math.round(d / 3));
      for (let i = 0; i < rows; i++) { const m = new THREE.Mesh(unit(), M(0x2f4a6b, { roughness: 0.25, metalness: 0.5, envMapIntensity: 1.4 })); m.scale.set(w * 0.86, 0.1, (d / rows) * 0.62); m.position.set(0, h + 0.38, -d / 2 + (d * (i + 0.5)) / rows); m.rotation.x = -0.3; grp.add(m); }
      const b = new THREE.Mesh(unit(), M(C.concrete)); b.scale.set(w * 1.02, 0.2, d * 1.02); b.position.y = h + 0.1; grp.add(b);
    }
    this.g.add(grp);
    const rr = rot ? Math.max(w, d) / 2 : 0;
    if (solid) { this.obstacles.push(rot ? { x0: x - rr - 0.4, x1: x + rr + 0.4, z0: z - rr - 0.4, z1: z + rr + 0.4 } : { x0: x - w / 2 - 0.4, x1: x + w / 2 + 0.4, z0: z - d / 2 - 0.4, z1: z + d / 2 + 0.4 }); }
    if (y < 1) this.mask.rect(x, z, w, d, rot, BUILT, 0.3);
    if (name) this.label(name, x, h + 3, z);
    return grp;
  }
  glass(x, z, w, d, h, o = {}) { return this.box(x, z, w, d, h, { color: C.glass, win: 'none', glass: true, roof: 'flat', roofColor: C.steel, plain: true, ...o }); }
  cyl(x, z, r, h, o = {}) {
    const { color = C.stone, roof = 'flat', roofColor = C.roof, seg = 14, y = 0, glass = false, solid = true, top = r } = o;
    const grp = new THREE.Group(); grp.position.set(x, y, z);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(top, r, h, seg), M(color, glass ? { transparent: true, opacity: 0.58, roughness: 0.08, metalness: 0.3, envMapIntensity: 1.6 } : {}));
    m.position.y = h / 2; m.castShadow = m.receiveShadow = true; grp.add(m);
    if (roof === 'cone') { const c = new THREE.Mesh(new THREE.ConeGeometry(top * 1.08, o.roofH ?? r * 1.2, seg), M(roofColor)); c.position.y = h + (o.roofH ?? r * 1.2) / 2; c.castShadow = true; grp.add(c); }
    if (roof === 'dome') { const c = new THREE.Mesh(new THREE.SphereGeometry(top, seg, 8, 0, Math.PI * 2, 0, Math.PI / 2), M(roofColor)); c.position.y = h; c.castShadow = true; grp.add(c); }
    if (roof === 'flat') { const c = new THREE.Mesh(new THREE.CylinderGeometry(top * 1.04, top * 1.04, 0.25, seg), M(roofColor)); c.position.y = h + 0.12; grp.add(c); }
    this.g.add(grp);
    if (solid) this.obstacles.push({ x0: x - r - 0.4, x1: x + r + 0.4, z0: z - r - 0.4, z1: z + r + 0.4 });
    if (y < 1) this.mask.disc(x, z, r + 0.3, r + 0.3, BUILT);
    return grp;
  }
  sphere(x, y, z, r, color, o = {}) { const m = new THREE.Mesh(new THREE.IcosahedronGeometry(r, o.detail ?? 1), M(color, o.glass ? { transparent: true, opacity: 0.5, roughness: 0.1, metalness: 0.3 } : {})); m.position.set(x, y, z); return this.add(m); }
  tower(x, z, w, h, o = {}) {
    const { color = C.stone, cap = 'spire', capColor = C.copper } = o;
    this.box(x, z, w, w, h, { color, roof: 'none', win: 'tall' });
    if (cap === 'spire') { const c = new THREE.Mesh(new THREE.ConeGeometry(w * 0.72, h * 0.35, 4).rotateY(Math.PI / 4), M(capColor)); c.position.set(x, h + h * 0.175, z); this.add(c); }
    if (cap === 'belfry') this.box(x, z, w * 1.15, w * 1.15, w * 0.9, { color, y: h, roof: 'hip', roofColor: capColor, win: 'tall', solid: false });
    return this;
  }
  arch(x, z, w, h, o = {}) {
    const { color = C.stone, rot = 0 } = o, g = new THREE.Group(), unit = G('box', () => new THREE.BoxGeometry(1, 1, 1)); g.position.set(x, 0, z); g.rotation.y = rot;
    for (const sx of [-1, 1]) { const p = new THREE.Mesh(unit, M(color)); p.scale.set(w * 0.16, h, w * 0.16); p.position.set(sx * w * 0.42, h / 2, 0); p.castShadow = true; g.add(p); }
    const l = new THREE.Mesh(unit, M(color)); l.scale.set(w, h * 0.18, w * 0.2); l.position.y = h; l.castShadow = true; g.add(l);
    this.g.add(g); return g;
  }

  // ----- trees and plants, baked into one mesh that sways -----
  put(geo, x, y, z, sx, sy, sz, color, flex = 0, rx = 0, ry = 0, rz = 0, jitter = 0.035) { this.veg.add(geo, TRS(x, y, z, sx, sy, sz, rx, ry, rz), color, flex, jitter, this.r); }
  // kinds: round, cone, palm, blossom, bush, willow, birch, cypress, gum, scrub, bare
  tree(x, z, kind = 'round', s = 1, o = {}) {
    const low = kind === 'bush' || kind === 'scrub', own = (o.y || 0) < 1 ? { x, z, low } : null;
    if (own && this.inWay(own)) return STUB;
    const was = this.veg.owner; this.veg.owner = own; try { return this._tree(x, z, kind, s, o, own); } finally { this.veg.owner = was; }
  }
  _tree(x, z, kind, s, o, own) {
    const r = this.r, y0 = o.y || 0, S = this.seasonName, winter = S === 'winter', pal = o.colors;
    if (kind === 'blossom' && S !== 'spring') kind = 'round';
    if (kind === 'round' && winter && !pal) kind = 'bare';
    const trunk = (h, rad, col = C.bark, lean = 0) => this.put(cylGeo(), x + lean * h * 0.5, y0 + h / 2, z, rad, h, rad, col, 0.03, 0, r.u() * 3, -lean);
    if (y0 < 1) { this.treeSpots.push({ x, z, kind, s, own }); this.obstacles.push({ x0: x - 0.3, x1: x + 0.3, z0: z - 0.3, z1: z + 0.3, own }); }
    if (kind === 'cone') {
      const h = 0.8 * s; trunk(h, 0.2 * s);
      const tiers = 5, base = pal ? r.pick(pal) : this.season.conifer;
      for (let i = 0; i < tiers; i++) { const k = (1.5 - i * 0.26) * s, yy = y0 + h + i * 0.82 * s; this.put(coneGeo(7), x, yy + 0.75 * s, z, k, 1.5 * s, k, base, 0.5 + i * 0.25, 0, r.u() * 3, 0, 0.05); if (winter) this.put(coneGeo(7), x, yy + 1.0 * s, z, k * 0.72, 1.05 * s, k * 0.72, 0xf4f7f9, 0.5 + i * 0.25, 0, r.u() * 3, 0, 0.01); }
    } else if (kind === 'palm') {
      const h = 4.6 * s, lean = r.range(-0.12, 0.12);
      for (let i = 0; i < 4; i++) this.put(cylGeo(), x + lean * i * 0.6, y0 + (i + 0.5) * h / 4, z, 0.2 * s - i * 0.02, h / 4 + 0.1, 0.2 * s - i * 0.02, 0x9a8468, 0.1 * i, 0, 0, -lean * 0.5);
      const tx = x + lean * 2.2, ty = y0 + h;
      for (let i = 0; i < 9; i++) { const a = (i / 9) * Math.PI * 2 + r.u() * 0.3, droop = 0.35 + r.u() * 0.45; this.put(leafGeo(), tx + Math.cos(a) * 1.15 * s, ty - droop * 0.5, z + Math.sin(a) * 1.15 * s, 1.0 * s, 2.6 * s, 0.22 * s, i % 3 ? 0x4f9a54 : 0x62a85a, 1.4, 0, -a, -(Math.PI / 2 + droop * 0.6)); }
      for (let i = 0; i < 3; i++) this.put(blob(0), tx + r.range(-0.2, 0.2), ty - 0.25, z + r.range(-0.2, 0.2), 0.16 * s, 0.16 * s, 0.16 * s, 0x6b4a2f, 0.3);
    } else if (kind === 'bare') {
      const h = 2.0 * s; trunk(h, 0.24 * s, 0x6a5445);
      for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2 + r.u(), tilt = r.range(0.45, 0.95), L = r.range(1.3, 2.1) * s, bx = x + Math.cos(a) * Math.sin(tilt) * L * 0.5, by = y0 + h + Math.cos(tilt) * L * 0.5 - 0.2, bz = z + Math.sin(a) * Math.sin(tilt) * L * 0.5;
        this.put(cylGeo(), bx, by, bz, 0.09 * s, L, 0.09 * s, 0x6a5445, 0.35, 0, -a, -tilt);
        for (let j = 0; j < 2; j++) { const a2 = a + r.range(-0.9, 0.9), ex = x + Math.cos(a) * Math.sin(tilt) * L * (0.6 + j * 0.3), ey = y0 + h + Math.cos(tilt) * L * (0.6 + j * 0.3), ez = z + Math.sin(a) * Math.sin(tilt) * L * (0.6 + j * 0.3); this.put(cylGeo(), ex + Math.cos(a2) * 0.3, ey + 0.3, ez + Math.sin(a2) * 0.3, 0.04 * s, 0.9 * s, 0.04 * s, 0x75604f, 0.8, 0, -a2, -0.6); if (winter && r.chance(0.5)) this.put(blob(j), ex, ey + 0.08, ez, 0.26 * s, 0.1 * s, 0.26 * s, 0xf4f7f9, 0.5, 0, 0, 0, 0.01); }
      }
    } else if (kind === 'willow') {
      const h = 2.2 * s; trunk(h, 0.3 * s, 0x6f5a45, r.range(-0.1, 0.1)); const col = winter ? 0xb9b48a : pal ? r.pick(pal) : (S === 'fall' ? 0xc9b24a : 0x8fbf5a);
      this.put(blob(1), x, y0 + h + 0.9 * s, z, 2.0 * s, 1.1 * s, 2.0 * s, col, 0.7);
      for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2, rr = r.range(1.3, 2.0) * s; this.put(coneGeo(4), x + Math.cos(a) * rr, y0 + h - 0.1 * s, z + Math.sin(a) * rr, 0.22 * s, r.range(1.8, 2.7) * s, 0.22 * s, col, -1.4, Math.PI, r.u() * 3, 0); }
    } else if (kind === 'cypress') {
      trunk(0.6 * s, 0.14 * s); this.put(blob(2), x, y0 + 3.2 * s, z, 0.62 * s, 3.0 * s, 0.62 * s, pal ? r.pick(pal) : 0x3f6a4f, 0.5); if (winter) this.put(blob(0), x, y0 + 5.6 * s, z, 0.4 * s, 0.5 * s, 0.4 * s, 0xf4f7f9, 0.6, 0, 0, 0, 0.01);
    } else if (kind === 'gum') {
      const h = 3.2 * s; trunk(h, 0.2 * s, 0xd9cfc0, r.range(-0.08, 0.08));
      for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2 + r.u(), L = 1.9 * s; this.put(cylGeo(), x + Math.cos(a) * 0.5 * s, y0 + h + 0.7 * s, z + Math.sin(a) * 0.5 * s, 0.09 * s, L, 0.09 * s, 0xd9cfc0, 0.3, 0, -a, -0.55); this.put(blob(i), x + Math.cos(a) * 1.25 * s, y0 + h + 1.7 * s, z + Math.sin(a) * 1.25 * s, 1.05 * s, 0.7 * s, 1.05 * s, r.pick(pal || [0x8fa58a, 0x7f9a84, 0x9fb09a]), 1.1); }
      this.put(blob(1), x, y0 + h + 2.4 * s, z, 1.0 * s, 0.7 * s, 1.0 * s, r.pick(pal || [0x8fa58a, 0x7f9a84]), 1.2);
    } else if (kind === 'scrub' || kind === 'bush') {
      const cols = pal || (kind === 'scrub' ? [0x7f8f62, 0x8a9a6a, 0x6f8258, 0x95a07a] : winter ? [0x6f7a5f, 0x8a9078] : this.season.trees), n = 2 + (r.chance(0.5) ? 1 : 0);
      for (let i = 0; i < n; i++) this.put(blob(i % 3), x + r.range(-0.4, 0.4) * s, y0 + 0.45 * s, z + r.range(-0.4, 0.4) * s, r.range(0.55, 0.8) * s, r.range(0.4, 0.6) * s, r.range(0.55, 0.8) * s, kind === 'bush' && !winter && !pal ? new THREE.Color(r.pick(cols)).lerp(new THREE.Color(0x4f8a4f), 0.45).getHex() : r.pick(cols), 0.35);
      if (kind === 'bush' && (S === 'spring' || S === 'summer') && r.chance(0.5)) for (let i = 0; i < 6; i++) this.put(blob(0), x + r.range(-0.7, 0.7) * s, y0 + r.range(0.5, 0.9) * s, z + r.range(-0.7, 0.7) * s, 0.09, 0.09, 0.09, r.pick(this.season.flowers), 0.4, 0, 0, 0, 0);
      if (winter) this.put(blob(0), x, y0 + 0.8 * s, z, 0.5 * s, 0.14 * s, 0.5 * s, 0xf4f7f9, 0.3, 0, 0, 0, 0.01);
    } else { // round, blossom, birch
      const birch = kind === 'birch', h = (birch ? 2.6 : r.range(1.5, 2.1)) * s, lean = r.range(-0.07, 0.07);
      trunk(h, (birch ? 0.13 : 0.24) * s, birch ? 0xe9e6dc : C.bark, lean);
      for (let i = 0; i < 2; i++) { const a = r.u() * 6.28; this.put(cylGeo(), x + Math.cos(a) * 0.35 * s, y0 + h + 0.25 * s, z + Math.sin(a) * 0.35 * s, 0.08 * s, 1.0 * s, 0.08 * s, birch ? 0xe9e6dc : C.bark, 0.2, 0, -a, -0.7); }
      const base = pal ? r.pick(pal) : kind === 'blossom' ? r.pick([0xf3b6c8, 0xf7d3dc, 0xfbe6ea]) : birch ? (S === 'fall' ? 0xe2c24a : 0x9fd27a) : r.pick(this.season.trees);
      const thin = S === 'fall' && r.chance(0.22), n = thin ? 3 : birch ? 4 : 5 + (r.chance(0.5) ? 1 : 0), cx = x + lean * h;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + r.u() * 0.6, rad = i === 0 ? 0 : r.range(0.55, 0.9) * s * (birch ? 0.7 : 1), k = (i === 0 ? 1.35 : r.range(0.75, 1.05)) * s * (birch ? 0.7 : 1), yy = y0 + h + (i === 0 ? 1.0 : r.range(0.4, 1.5)) * s;
        const col = new THREE.Color(base).offsetHSL(0, 0, (yy - y0 - h) * 0.018 - 0.01).getHex();
        this.put(blob(i % 3), cx + Math.cos(a) * rad, yy, z + Math.sin(a) * rad, k, k * r.range(0.8, 0.95), k, col, 0.6 + (yy - y0 - h) * 0.3, r.u() * 3, r.u() * 3, 0, 0.045);
      }
      if (kind === 'blossom' || (S === 'fall' && r.chance(0.6))) this.litter(x, z, 2.2 * s, kind === 'blossom' ? 0xf7d3dc : base);
    }
    return STUB;
  }
  litter(x, z, rad, color) { for (let i = 0; i < 16; i++) { const a = this.r.u() * 6.28, d = Math.sqrt(this.r.u()) * rad; this.put(leafGeo(), x + Math.cos(a) * d, 0.06, z + Math.sin(a) * d, 0.3, 0.02, 0.3, color, 0, 0, this.r.u() * 3, 0, 0.06); } }
  trees(list, kind = 'round') { for (const [x, z, s] of list) this.tree(x, z, kind, s ?? this.r.range(0.85, 1.3)); return this; }
  grove(x, z, w, d, n, kind = 'round') { for (let i = 0; i < n; i++) this.tree(x + this.r.range(-w / 2, w / 2), z + this.r.range(-d / 2, d / 2), Array.isArray(kind) ? this.r.pick(kind) : kind, this.r.range(0.8, 1.35)); return this; }
  row(x1, z1, x2, z2, n, kind = 'round') { for (let i = 0; i < n; i++) { const t = n === 1 ? 0.5 : i / (n - 1); this.tree(x1 + (x2 - x1) * t, z1 + (z2 - z1) * t, kind, this.r.range(0.9, 1.15)); } return this; }
  rock(x, z, s = 1, y = 0) { this.put(rockGeo(this.r.int(0, 2)), x, y + 0.3 * s, z, s * this.r.range(0.7, 1.2), s * this.r.range(0.45, 0.8), s * this.r.range(0.7, 1.2), this.r.pick([0x8d8f96, 0x7d7f86, 0x9a968c]), 0, 0, this.r.u() * 3, 0, 0.04); if (this.seasonName === 'winter') this.put(blob(0), x, y + 0.62 * s, z, s * 0.6, s * 0.12, s * 0.6, 0xf4f7f9, 0, 0, 0, 0, 0.01); return this; }
  reeds(x, z, n = 5) { const col = this.seasonName === 'winter' ? 0xb9a878 : this.seasonName === 'fall' ? 0xa89858 : 0x6f9a52; for (let i = 0; i < n; i++) { const h = this.r.range(0.9, 1.7); this.put(coneGeo(4), x + this.r.range(-0.5, 0.5), h / 2, z + this.r.range(-0.5, 0.5), 0.06, h, 0.06, col, -1.2, this.r.range(-0.12, 0.12), 0, this.r.range(-0.12, 0.12), 0.06); if (this.r.chance(0.35)) this.put(cylGeo(), x + this.r.range(-0.5, 0.5), h + 0.1, z + this.r.range(-0.5, 0.5), 0.07, 0.34, 0.07, 0x6b4a2f, 1.1); } return this; }
  flowerBed(x, z, w, d, n = 14) { if (!this.season.flowers.length) return this; for (let i = 0; i < n; i++) { const fx = x + this.r.range(-w / 2, w / 2), fz = z + this.r.range(-d / 2, d / 2); this.put(coneGeo(4), fx, 0.18, fz, 0.03, 0.36, 0.03, 0x5f9a4f, -0.6); this.put(blob(0), fx, 0.4, fz, 0.11, 0.08, 0.11, this.r.pick(this.season.flowers), 0.7, 0, 0, 0, 0); } return this; }
  hedge(x1, z1, x2, z2) { const L = Math.hypot(x2 - x1, z2 - z1), n = Math.max(2, Math.round(L / 0.9)), col = this.seasonName === 'winter' ? 0x5f7560 : 0x4f8552; for (let i = 0; i <= n; i++) { const t = i / n; this.put(blob(i % 3), x1 + (x2 - x1) * t, 0.5, z1 + (z2 - z1) * t, 0.62, 0.55, 0.62, col, 0.2); } return this; }

  // ----- things that move and things that glow -----
  lamp(x, z) { const p = new THREE.Mesh(G('pole', () => new THREE.CylinderGeometry(0.06, 0.08, 3, 5)), M(C.dark)); p.position.set(x, 1.5, z); this.add(p); const mat = new THREE.MeshStandardMaterial({ color: 0xfff1c9, emissive: 0xffe2a0, emissiveIntensity: 0.3 }); this.lampMats.push(mat); this.own.push(mat); const l = new THREE.Mesh(G('ico0', () => new THREE.IcosahedronGeometry(1, 0)), mat); l.scale.setScalar(0.22); l.position.set(x, 3.1, z); this.g.add(l); return this; }
  sign(x, z, text, rot = 0) {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rot + this.r.range(-0.06, 0.06);
    const p = new THREE.Mesh(G('pole', () => new THREE.CylinderGeometry(0.06, 0.08, 3, 5)), M(C.wood)); p.scale.y = 0.5; p.position.y = 0.75; g.add(p);
    const b = new THREE.Mesh(G('box', () => new THREE.BoxGeometry(1, 1, 1)), M(C.cream)); b.scale.set(1.5, 0.7, 0.08); b.position.y = 1.5; b.rotation.z = this.r.range(-0.04, 0.04); b.castShadow = true; g.add(b);
    this.g.add(g); this.labels.push({ text, x, y: 2.3, z, kind: 'sign' }); return g;
  }
  glowLine(pts, color = C.glow) {
    const mat = M(color, { emissive: color, emissiveIntensity: 0.9, transparent: true, opacity: 0.8 });
    for (let i = 0; i < pts.length - 1; i++) { const [x1, z1] = pts[i], [x2, z2] = pts[i + 1], len = Math.hypot(x2 - x1, z2 - z1); const m = new THREE.Mesh(G('plane', () => new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2)), mat); m.position.set((x1 + x2) / 2, 0.075, (z1 + z2) / 2); m.scale.set(0.14, 1, len); m.rotation.y = Math.atan2(x2 - x1, z2 - z1); this.g.add(m); }
    return this;
  }
  vehicle(pathPts, { color = C.white, len = 4.6, w = 1.5, h = 1.5, speed = 5, y = 0.35, stripe = C.teal, pause = 2 } = {}) {
    const g = new THREE.Group(), unit = G('box', () => new THREE.BoxGeometry(1, 1, 1));
    const b = new THREE.Mesh(unit, M(color)); b.scale.set(w, h, len); b.position.y = y + h / 2; b.castShadow = true; g.add(b);
    const s = new THREE.Mesh(unit, M(stripe, { roughness: 0.2, metalness: 0.3 })); s.scale.set(w * 1.02, h * 0.28, len * 0.94); s.position.y = y + h * 0.62; g.add(s);
    for (const dz of [-0.3, 0.3]) for (const dx of [-1, 1]) { const wh = new THREE.Mesh(G('wheel6', () => new THREE.CylinderGeometry(1, 1, 1, 8).rotateZ(Math.PI / 2)), M(0x2a2e36)); wh.scale.set(0.16, Math.min(0.34, y + 0.05), Math.min(0.34, y + 0.05)); wh.position.set(dx * w * 0.5, Math.min(0.34, y + 0.05), dz * len); g.add(wh); }
    this.g.add(g);
    const [a, bb] = pathPts, L = Math.hypot(bb[0] - a[0], bb[1] - a[1]); let u = this.r.u(), dir = 1, wait = 0, v = 0;
    this.track(a[0], a[1], bb[0], bb[1], w / 2 + 0.25, false);
    g.rotation.y = Math.atan2(bb[0] - a[0], bb[1] - a[1]);
    this.anim.push((t, dt) => { if (wait > 0) { wait -= dt; v = 0; return; } const edge = Math.min(u, 1 - u) * L; v += (Math.min(speed, 1.2 + edge * 0.9) - v) * Math.min(1, dt * 2); u += dir * v * dt / L; if (u > 1 || u < 0) { u = Math.max(0, Math.min(1, u)); dir *= -1; wait = pause; } g.position.set(a[0] + (bb[0] - a[0]) * u, 0, a[1] + (bb[1] - a[1]) * u); });
    return g;
  }
  boat(x, z, rx = 6, rz = 2, speed = 0.25) {
    const g = new THREE.Group(); const h = new THREE.Mesh(G('hull', () => { const s = new THREE.Shape(); s.moveTo(0, 1.2); s.quadraticCurveTo(0.5, 0.5, 0.42, -1); s.lineTo(-0.42, -1); s.quadraticCurveTo(-0.5, 0.5, 0, 1.2); return new THREE.ExtrudeGeometry(s, { depth: 0.34, bevelEnabled: false }).rotateX(-Math.PI / 2); }), M(C.white)); h.position.y = 0.02; h.castShadow = true; g.add(h);
    const mast = new THREE.Mesh(G('pole', () => new THREE.CylinderGeometry(0.06, 0.08, 3, 5)), M(C.wood)); mast.scale.set(0.5, 0.75, 0.5); mast.position.y = 1.4; g.add(mast);
    const sail = new THREE.Mesh(G('sail', () => { const s = new THREE.Shape(); s.moveTo(0, 0); s.lineTo(0, 2); s.lineTo(0.95, 0.1); s.lineTo(0, 0); return new THREE.ShapeGeometry(s); }), M(0xf7f3e8, { side: THREE.DoubleSide })); sail.position.set(0, 0.5, 0.05); sail.rotation.y = Math.PI / 2; sail.castShadow = true; g.add(sail); this.g.add(g);
    const ph = this.r.u() * 6;
    this.anim.push((t) => { const a = t * speed * 0.6 + ph; g.position.set(x + Math.cos(a) * rx, 0.06 + Math.sin(t * 1.3 + ph) * 0.03, z + Math.sin(a) * rz); g.rotation.y = Math.atan2(-Math.sin(a) * rx, Math.cos(a) * rz); g.rotation.z = Math.sin(t * 0.9 + ph) * 0.05; });
    return g;
  }
  clouds(n = 5) {
    for (let i = 0; i < n; i++) {
      const g = new THREE.Group(), k = 4 + this.r.int(0, 3);
      for (let j = 0; j < k; j++) { const c = new THREE.Mesh(blob(j % 3), M(0xffffff, { transparent: true, opacity: 0.9, roughness: 1 })); c.position.set(j * 1.5 - k * 0.75, this.r.range(-0.3, 0.5), this.r.range(-0.7, 0.7)); c.scale.set(this.r.range(1.3, 2.2), this.r.range(0.7, 1.1), this.r.range(1, 1.7)); g.add(c); }
      const z0 = this.r.range(-30, 30), y0 = this.r.range(24, 32), sp = this.r.range(0.25, 0.6); let x = this.r.range(-50, 50);
      g.position.set(x, y0, z0); this.g.add(g);
      this.anim.push((t, dt) => { x += sp * dt; if (x > 56) x = -56; g.position.x = x; });
    }
    return this;
  }
  drone(loop, y = 7) {
    const g = new THREE.Group(), unit = G('box', () => new THREE.BoxGeometry(1, 1, 1)); const b = new THREE.Mesh(unit, M(C.white)); b.scale.set(0.5, 0.16, 0.5); g.add(b);
    const p = new THREE.Mesh(unit, M(0xc98a3a)); p.scale.set(0.3, 0.28, 0.3); p.position.y = -0.24; g.add(p);
    const rot = []; for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { const r = new THREE.Mesh(unit, M(0x3a4250)); r.scale.set(0.5, 0.02, 0.06); r.position.set(dx * 0.34, 0.12, dz * 0.34); g.add(r); rot.push(r); }
    this.g.add(g); let s = this.r.u();
    this.anim.push((t, dt) => { s = (s + dt * 0.02) % 1; const n = loop.length, f = s * n, i = Math.floor(f), k = f - i, kk = k * k * (3 - 2 * k), a = loop[i], c = loop[(i + 1) % n]; g.position.set(a[0] + (c[0] - a[0]) * kk, y + Math.sin(t * 1.3) * 0.25, a[1] + (c[1] - a[1]) * kk); for (const r of rot) r.rotation.y = t * 30; });
    return g;
  }
  mower(x, z, w, d) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.22, 10), M(0xe8e8e2)); m.position.y = 0.14; m.castShadow = true; this.g.add(m); const ph = this.r.u() * 6;
    this.anim.push((t) => { m.position.set(x + Math.sin(t * 0.11 + ph) * w / 2, 0.14, z + Math.sin(t * 0.07 + ph * 2) * d / 2); });
    return m;
  }
  label(text, x, y, z, kind = 'place') { this.labels.push({ text, x, y, z, kind }); return this; }
  pick(mesh, data) { mesh.traverse((o) => { if (o.isMesh) { o.userData.pick = data; this.picks.push(o); } }); return mesh; }
  spot(x, z, zone = 'a') { this.spots.push({ x, z, zone }); return this; }
  spotsAlong(pts, zone = 'a') { for (const [x, z] of pts) this.spot(x, z, zone); return this; }
  snowCaps() { return this.seasonName === 'winter'; }
  // a free point of a given ground kind, away from buildings and from points already handed out
  find(kind, { tries = 260, apart = 3.2, margin = 4, near = null, within = 99 } = {}) {
    this._used ||= []; const e = this.size / 2 - margin;
    for (let i = 0; i < tries; i++) {
      const x = near ? near[0] + this.r.range(-within, within) : this.r.range(-e, e), z = near ? near[1] + this.r.range(-within, within) : this.r.range(-e, e);
      if (Math.abs(x) > e || Math.abs(z) > e) continue;
      const v = this.mask.get(x, z); if (!(Array.isArray(kind) ? kind.includes(v) : v === kind)) continue;
      if (kind !== WATER && (this.mask.near(x, z, BUILT, 1.4) || this.mask.near(x, z, WATER, 1.0))) continue;
      if (kind !== WATER && this.onTrack(x, z, 3, 1)) continue;
      if (kind === WATER && (this.mask.get(x + 1, z) !== WATER || this.mask.get(x - 1, z) !== WATER || this.mask.get(x, z + 1) !== WATER || this.mask.get(x, z - 1) !== WATER)) continue;
      if (this._used.some((u) => Math.hypot(u[0] - x, u[1] - z) < apart)) continue;
      this._used.push([x, z]); return [x, z];
    }
    return null;
  }
  blocked(x, z) { for (const o of this.obstacles) if (!o.soft && x > o.x0 && x < o.x1 && z > o.z0 && z < o.z1) return true; return false; }
  // ----- railway lines and the ways vehicles run along: nothing is planted on them -----
  track(x1, z1, x2, z2, half = 1.1, rail = true) {
    this.tracks.push({ x1, z1, x2, z2, half, rail });
    if (rail) this.mask.rect((x1 + x2) / 2, (z1 + z2) / 2, half * 2 + 2.4, Math.hypot(x2 - x1, z2 - z1) + 2, Math.atan2(x2 - x1, z2 - z1), PAVED);   // a bare verge, so ground cover stays off the sleepers
    return this;
  }
  onTrack(x, z, pad = 0, padRoad = pad) {
    for (const t of this.tracks) { const dx = t.x2 - t.x1, dz = t.z2 - t.z1, L2 = dx * dx + dz * dz || 1, u = Math.max(0, Math.min(1, ((x - t.x1) * dx + (z - t.z1) * dz) / L2)); if (Math.hypot(x - t.x1 - dx * u, z - t.z1 - dz * u) < t.half + (t.rail ? pad : padRoad)) return true; }
    return false;
  }
  inWay(own) { return this.tracks.length > 0 && this.onTrack(own.x, own.z, own.low ? 1.0 : 1.7, own.low ? 0.4 : 0.9); }
  // trees planted before a line was laid across them come out again
  clearTracks() {
    if (!this.tracks.length) return 0; const gone = (own) => this.inWay(own), n = this.veg.drop(gone);
    this.treeSpots = this.treeSpots.filter((t) => !(t.own && gone(t.own))); this.obstacles = this.obstacles.filter((o) => !(o.own && gone(o.own))); return n;
  }
  // called once the recipe is done
  finish() { const m = this.veg.mesh(this.wind); if (m) this.g.add(m); return this; }
}
const STUB = { traverse() {}, position: {}, rotation: {}, scale: { set() {}, setScalar() {} } };
export { THREE, blob, rockGeo, cylGeo, coneGeo, leafGeo, NI };
