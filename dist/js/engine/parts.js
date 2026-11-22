// Composite parts built from the kit. Shared by all the place recipes.
import * as THREE from 'three';
import { C } from './kit.js';

export function rails(k, x1, z1, x2, z2) {
  k.path([[x1, z1], [x2, z2]], 2.2, 0x8c8478, 0.035); k.track(x1, z1, x2, z2, 1.1, true);
  const len = Math.hypot(x2 - x1, z2 - z1), ang = Math.atan2(x2 - x1, z2 - z1), n = Math.floor(len / 1.4);
  for (let i = 0; i <= n; i++) { const t = i / n; const m = k.mesh(new THREE.BoxGeometry(1.9, 0.08, 0.28), 0x6b5a4a); m.position.set(x1 + (x2 - x1) * t, 0.07, z1 + (z2 - z1) * t); m.rotation.y = ang; m.castShadow = false; }
  for (const s of [-0.62, 0.62]) { const m = k.mesh(new THREE.BoxGeometry(0.1, 0.1, len), 0x9aa3ab, { metalness: 0.5, roughness: 0.4 }); m.position.set((x1 + x2) / 2 + Math.cos(ang) * s, 0.14, (z1 + z2) / 2 - Math.sin(ang) * s); m.rotation.y = ang; m.castShadow = false; }
}
export function colonnade(k, x, z, w, n, h, { color = C.lime, rot = 0, pediment = true, depth = 1.6 } = {}) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rot;
  for (let i = 0; i < n; i++) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, h, 8), k.mat(color)); c.position.set(-w / 2 + (w * (i + 0.5)) / n, h / 2, 0); c.castShadow = true; g.add(c); }
  const e = new THREE.Mesh(new THREE.BoxGeometry(w + 0.6, 0.7, depth), k.mat(color)); e.position.y = h + 0.35; e.castShadow = true; g.add(e);
  if (pediment) { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 1, 1, 3, 1).rotateZ(0).rotateY(Math.PI / 2), k.mat(color)); p.scale.set(depth * 0.55, h * 0.3, w * 0.58); p.position.y = h + 0.7 + h * 0.15; p.rotation.y = Math.PI / 2; g.add(p); }
  const st = new THREE.Mesh(new THREE.BoxGeometry(w + 1.6, 0.3, depth + 1.6), k.mat(C.stone)); st.position.y = 0.15; st.receiveShadow = true; g.add(st);
  k.g.add(g); return g;
}
export function hill(k, x, z, rx, rz, h, color) {
  const m = k.mesh(new THREE.IcosahedronGeometry(1, 2), color ?? k.season.grass); m.scale.set(rx, h, rz); m.position.set(x, -0.05, z); m.castShadow = false;
  k.obstacles.push({ x0: x - rx * 0.6, x1: x + rx * 0.6, z0: z - rz * 0.6, z1: z + rz * 0.6 }); return m;
}
export function fountain(k, x, z, r = 2) {
  k.cyl(x, z, r, 0.5, { color: C.stone, roof: 'none', seg: 16 });
  k.disc(x, z, r * 0.86, C.water, 0.52);
  const j = k.mesh(new THREE.ConeGeometry(0.18, 1.6, 6), 0xffffff, { transparent: true, opacity: 0.8 }); j.position.set(x, 1.3, z);
  k.anim.push((t) => { j.scale.y = 1 + Math.sin(t * 3) * 0.15; });
}
export function bridge(k, x1, z1, x2, z2, w = 2, color = C.stone) {
  const len = Math.hypot(x2 - x1, z2 - z1), ang = Math.atan2(x2 - x1, z2 - z1);
  const d = k.mesh(new THREE.BoxGeometry(w, 0.35, len), color); d.position.set((x1 + x2) / 2, 0.35, (z1 + z2) / 2); d.rotation.y = ang;
  for (const s of [-1, 1]) { const r = k.mesh(new THREE.BoxGeometry(0.12, 0.6, len), color); r.position.set((x1 + x2) / 2 + Math.cos(ang) * s * w / 2, 0.8, (z1 + z2) / 2 - Math.sin(ang) * s * w / 2); r.rotation.y = ang; }
  k.mask.rect((x1 + x2) / 2, (z1 + z2) / 2, w, len + 1.2, ang, 2, 0, true); // you can walk across
}
export function statue(k, x, z, h = 2.4, color = 0x6f7f72) {
  k.box(x, z, 1.2, 1.2, 0.9, { color: C.stone, roof: 'none', win: 'none' });
  const f = k.statueFigure(color, h / 1.5); f.position.set(x, 0.9, z); k.g.add(f);
}
export function stairs(k, x, z, w, d, steps = 5, rot = 0, color = C.stone) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rot;
  for (let i = 0; i < steps; i++) { const s = new THREE.Mesh(new THREE.BoxGeometry(w, 0.3, d * (1 - i / steps)), k.mat(color)); s.position.set(0, 0.15 + i * 0.3, -d * (i / steps) / 2); s.receiveShadow = true; g.add(s); }
  k.g.add(g); return g;
}
export function chimney(k, x, z, h, r = 0.9, color = C.brickDark) {
  k.cyl(x, z, r, h, { color, roof: 'none', seg: 10, top: r * 0.7 });
  const cap = k.mesh(new THREE.CylinderGeometry(r * 0.82, r * 0.74, 0.5, 10), C.dark); cap.position.set(x, h + 0.2, z);
}
export function hangar(k, x, z, w, d, h, color = C.steel) { // barrel roof
  const m = k.mesh(new THREE.CylinderGeometry(w / 2, w / 2, d, 14, 1, false, 0, Math.PI).rotateX(Math.PI / 2).rotateZ(Math.PI / 2), color);
  m.scale.y = (h / (w / 2)); m.position.set(x, 0, z);
  k.obstacles.push({ x0: x - w / 2, x1: x + w / 2, z0: z - d / 2, z1: z + d / 2 }); return m;
}
export function solarRows(k, x, z, w, d, n = 3) {
  for (let i = 0; i < n; i++) { const m = k.mesh(new THREE.BoxGeometry(w, 0.08, d / n * 0.7), 0x2f4a6b, { roughness: 0.3, metalness: 0.4 }); m.position.set(x, 0.9, z - d / 2 + (d * (i + 0.5)) / n); m.rotation.x = -0.35; }
}
export function shelfRing(k, x, z, r, n = 8, h = 1.1) { // low shelves in a ring, for the children's room and reading lawns
  const cols = [0xd24d3e, 0xe2b23a, 0x4f9a54, 0x3f7fb5, 0x8a6aa8];
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; const m = k.mesh(new THREE.BoxGeometry(1.6, h, 0.45), cols[i % cols.length]); m.position.set(x + Math.cos(a) * r, h / 2, z + Math.sin(a) * r); m.rotation.y = -a + Math.PI / 2; }
}
export function sitters(k, x, z, n = 6, r = 1.6, child = true, role = 'storykid', leadRole = 'storyteller') { // a ring of people sitting on the ground round one who is talking
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; k.npc(x + Math.cos(a) * r, z + Math.sin(a) * r, { kind: child ? 'child' : 'adult', pose: 'ground', face: [x, z], role, fixed: true }); }
  return k.npc(x, z, { kind: 'adult', role: leadRole, idle: 'read', pack: false });
}
export function train(k, x1, z1, x2, z2, cars = 3, color = 0xe9e4d6) {
  const g = new THREE.Group(), ang = Math.atan2(x2 - x1, z2 - z1);
  for (let i = 0; i < cars; i++) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.7, 4.6), k.mat(i === 0 ? 0x2f6f8f : color)); b.position.set(0, 1.15, -i * 5); b.castShadow = true; g.add(b);
    const s = new THREE.Mesh(new THREE.BoxGeometry(1.74, 0.5, 4.2), k.mat(0x24406e)); s.position.set(0, 1.45, -i * 5); g.add(s);
  }
  g.rotation.y = ang; k.g.add(g);
  const L = Math.hypot(x2 - x1, z2 - z1); let u = 0.35, dir = 1, wait = 3;
  k.anim.push((t, dt) => { if (wait > 0) { wait -= dt; } else { u += dir * dt * 5 / L; if (u > 1.15 || u < -0.2) { dir *= -1; } if (Math.abs(u - 0.45) < 0.004 && k.r.chance(0.6)) wait = 6; } g.position.set(x1 + (x2 - x1) * u, 0, z1 + (z2 - z1) * u); g.rotation.y = ang + (dir < 0 ? Math.PI : 0); g.visible = u > -0.15 && u < 1.1; });
  return g;
}
export function plane(k, x, y, z, s = 1, color = C.white) {
  const g = new THREE.Group();
  const f = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.25, 4, 7).rotateX(Math.PI / 2), k.mat(color)); g.add(f);
  const w = new THREE.Mesh(new THREE.BoxGeometry(5, 0.08, 0.9), k.mat(color)); w.position.z = 0.2; g.add(w);
  const t = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.08, 0.5), k.mat(color)); t.position.z = -1.8; g.add(t);
  const fin = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.8, 0.6), k.mat(C.red)); fin.position.set(0, 0.4, -1.8); g.add(fin);
  g.position.set(x, y, z); g.scale.setScalar(s); g.traverse((o) => { if (o.isMesh) o.castShadow = true; }); k.g.add(g); return g;
}
export function mountains(k, side = 'n', color = 0x9aa7b5, n = 6, h = 9) { // a far ridge along one edge of the slab
  const e = k.size / 2 - 3;
  for (let i = 0; i < n; i++) {
    const t = -e + (2 * e * (i + 0.5)) / n + k.r.range(-2, 2), hh = h * k.r.range(0.6, 1.2);
    const m = k.mesh(new THREE.ConeGeometry(hh * 0.9, hh, 5), color); m.rotation.y = k.r.u() * 3;
    if (side === 'n') m.position.set(t, hh / 2 - 0.1, -e); if (side === 'w') m.position.set(-e, hh / 2 - 0.1, t); if (side === 'e') m.position.set(e, hh / 2 - 0.1, t);
    if (k.snowCaps() || h > 10) { const c = k.mesh(new THREE.ConeGeometry(hh * 0.3, hh * 0.34, 5), 0xf4f7f9); c.position.copy(m.position); c.position.y = hh * 0.83; c.rotation.y = m.rotation.y; }
  }
}
export function horse(k, x, z, color = 0x4a3a30) {
  const g = new THREE.Group(); g.position.set(x, 0, z);
  const b = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.8, 1.9), k.mat(color)); b.position.y = 1.3; g.add(b);
  const n = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1, 0.45), k.mat(color)); n.position.set(0, 1.95, 0.95); n.rotation.x = 0.5; g.add(n);
  const h = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.42, 0.8), k.mat(color)); h.position.set(0, 2.35, 1.4); g.add(h);
  const legs = [];
  for (const [lx, lz] of [[-0.25, 0.75], [0.25, 0.75], [-0.25, -0.75], [0.25, -0.75]]) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.95, 0.16), k.mat(color)); l.position.set(lx, 0.47, lz); g.add(l); legs.push(l); }
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; }); k.g.add(g);
  return { g, legs };
}
export { THREE };

import { WILD, LAWN, PAVED, WATER, G, M } from './kit.js';

const unitBox = () => G('box', () => new THREE.BoxGeometry(1, 1, 1));
const bx = (k, color, x, y, z, sx, sy, sz, ry = 0) => { const m = new THREE.Mesh(unitBox(), M(color)); m.position.set(x, y, z); m.scale.set(sx, sy, sz); m.rotation.y = ry; m.castShadow = true; k.g.add(m); return m; };
const hitMat = new THREE.MeshBasicMaterial({ visible: false });

// ---------- small scenes people make ----------
export function picnic(k, x, z) {
  const c = k.r.pick([[0xd24d3e, 0xf7f3e8], [0x3f7fb5, 0xf7f3e8], [0xe2b23a, 0xf7f3e8], [0x4f9a54, 0xf7f3e8]]), rot = k.r.u() * 3;
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const m = new THREE.Mesh(G('plane', () => new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2)), M(c[(i + j) % 2], { roughness: 1 })); const lx = (i - 1.5) * 0.6, lz = (j - 1.5) * 0.6; m.position.set(x + lx * Math.cos(rot) + lz * Math.sin(rot), 0.045, z - lx * Math.sin(rot) + lz * Math.cos(rot)); m.scale.set(0.6, 1, 0.6); m.rotation.y = rot; m.receiveShadow = true; k.g.add(m); }
  bx(k, 0xb08a5a, x + 0.2, 0.2, z - 0.1, 0.5, 0.3, 0.34, rot); bx(k, 0xf4f2ec, x - 0.4, 0.08, z + 0.3, 0.3, 0.04, 0.3, rot); bx(k, 0xd9742b, x - 0.35, 0.14, z + 0.3, 0.1, 0.1, 0.1);
  const who = [['adult', 'picnic'], ['adult', 'picnic'], ['child', 'child'], ['child', 'child']].slice(0, k.r.int(3, 4));
  who.forEach(([kind, role], i) => { const a = (i / who.length) * Math.PI * 2 + rot; k.npc(x + Math.cos(a) * 1.5, z + Math.sin(a) * 1.5, { kind, role, pose: 'ground', face: [x, z] }); });
}
export function kite(k, x, z) {
  const kid = k.npc(x, z, { kind: 'child', role: 'kitekid', idle: 'play', face: [x + 5, z - 3], fixed: true });
  const g = new THREE.Group(), col = k.r.pick([0xd24d3e, 0xe2b23a, 0x3f7fb5, 0x8a6aa8]);
  const d = new THREE.Mesh(G('kite', () => new THREE.CircleGeometry(0.7, 4)), M(col, { side: THREE.DoubleSide })); d.scale.set(0.8, 1.15, 1); g.add(d);
  for (let i = 0; i < 4; i++) { const t = new THREE.Mesh(unitBox(), M(i % 2 ? 0xf4f2ec : col)); t.scale.set(0.14, 0.14, 0.02); t.position.y = -1.1 - i * 0.4; g.add(t); }
  k.g.add(g); const line = new THREE.Mesh(G('a-cyl', () => new THREE.CylinderGeometry(1, 1, 1, 5)), M(0xf4f2ec)); k.g.add(line); const ph = k.r.u() * 6;
  k.anim.push((t) => {
    const kx = x + 5 + Math.sin(t * 0.37 + ph) * 1.8, ky = 8.5 + Math.sin(t * 0.61 + ph) * 0.9, kz = z - 3 + Math.cos(t * 0.29 + ph) * 1.4; g.position.set(kx, ky, kz); g.rotation.set(-0.5 + Math.sin(t * 0.8) * 0.1, Math.sin(t * 0.37 + ph) * 0.4, Math.sin(t * 1.1) * 0.15);
    for (let i = 1; i < g.children.length; i++) g.children[i].position.x = Math.sin(t * 2.2 + i * 0.8) * 0.12 * i;
    const hx = x + 0.2, hy = 0.8, hz = z, L = Math.hypot(kx - hx, ky - hy, kz - hz); line.position.set((kx + hx) / 2, (ky + hy) / 2, (kz + hz) / 2); line.scale.set(0.008, L, 0.008); line.lookAt(kx, ky, kz); line.rotateX(Math.PI / 2);
  });
  return kid;
}
export function ballGame(k, x, z) {
  const pts = [0, 1].map((i) => { const a = i * Math.PI + 0.4; return [x + Math.cos(a) * 2.1, z + Math.sin(a) * 2.1]; });   // two children and a ball
  pts.forEach((p) => k.npc(p[0], p[1], { kind: 'child', role: 'ballkid', idle: 'play', face: [x, z], fixed: true }));
  const ball = new THREE.Mesh(G('ico1', () => new THREE.IcosahedronGeometry(1, 1)), M(k.r.pick([0xd24d3e, 0xe2b23a, 0xf4f2ec]))); ball.scale.setScalar(0.17); ball.castShadow = true; k.g.add(ball);
  k.anim.push((t) => { const u = (t / 2.4) % 2, i = Math.floor(u), q = u - i, a = pts[i], b = pts[(i + 1) % 2], e = q * q * (3 - 2 * q); ball.position.set(a[0] + (b[0] - a[0]) * e, 0.75 + Math.sin(q * Math.PI) * 1.3, a[1] + (b[1] - a[1]) * e); });
}
export function taichi(k, x, z, n = 4) { const face = k.r.u() * 6.28; for (let i = 0; i < n; i++) k.npc(x + (i % 2) * 1.8 - 0.9 + (Math.floor(i / 2) % 2) * 0.5, z + Math.floor(i / 2) * 1.8 - 0.9, { kind: i % 2 ? 'elder' : 'adult', role: 'taichi', idle: 'taichi', face, pack: false }); }
export function painter(k, x, z, lookAt) {
  const a = Math.atan2(lookAt[0] - x, lookAt[1] - z), ex = x + Math.sin(a) * 0.9, ez = z + Math.cos(a) * 0.9;
  for (const [dx, dz, rx] of [[-0.25, 0, 0.12], [0.25, 0, 0.12], [0, -0.3, -0.2]]) { const l = bx(k, 0x8a6a4a, ex + dx * Math.cos(a) + dz * Math.sin(a), 0.75, ez - dx * Math.sin(a) + dz * Math.cos(a), 0.04, 1.5, 0.04, a); l.rotation.x = rx; }
  const cv = bx(k, 0xf7f3e8, ex, 1.15, ez, 0.74, 0.56, 0.04, a); cv.rotation.x = -0.12; const dab = bx(k, k.r.pick([0x4d8fa8, 0x7ac08a, 0xe0a03a]), ex - Math.sin(a) * 0.03, 1.15, ez - Math.cos(a) * 0.03, 0.5, 0.3, 0.03, a); dab.rotation.x = -0.12;
  return k.npc(x, z, { role: 'painter', idle: 'paint', face: a, fixed: true, pack: false });
}
export function busker(k, x, z, face) {
  const n = k.npc(x, z, { role: 'busker', idle: 'play', face, fixed: true, pack: false }); const c = new THREE.Mesh(unitBox(), M(0x8a5a3a)); c.scale.set(0.3, 0.44, 0.12); c.position.set(0.06, 0.86, 0.2); c.rotation.z = 0.9; n.g.add(c);
  const nk = new THREE.Mesh(unitBox(), M(0x3a2a22)); nk.scale.set(0.045, 0.5, 0.04); nk.position.set(-0.3, 1.04, 0.2); nk.rotation.z = 0.9; n.g.add(nk);
  bx(k, 0x3a2a22, x + Math.sin(face) * 1.1, 0.06, z + Math.cos(face) * 1.1, 0.9, 0.1, 0.4, face); for (let i = 0; i < 4; i++) bx(k, 0xd9a441, x + Math.sin(face) * 1.1 + k.r.range(-0.3, 0.3), 0.13, z + Math.cos(face) * 1.1 + k.r.range(-0.1, 0.1), 0.06, 0.02, 0.06);
  return n;
}
export function chess(k, x, z) {
  const t = k.mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.08, 10), 0xcfc7b8); t.position.set(x, 0.74, z); const l = k.mesh(new THREE.CylinderGeometry(0.08, 0.14, 0.74, 6), 0x8f8676); l.position.set(x, 0.37, z);
  for (let i = 0; i < 16; i++) { const s = bx(k, (i + Math.floor(i / 4)) % 2 ? 0x3a4250 : 0xf4f2ec, x - 0.21 + (i % 4) * 0.14, 0.785, z - 0.21 + Math.floor(i / 4) * 0.14, 0.14, 0.012, 0.14); s.castShadow = false; }
  for (let i = 0; i < 6; i++) { const p = k.mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.12, 5), i % 2 ? 0x2a2e36 : 0xefe6d2); p.position.set(x + k.r.range(-0.22, 0.22), 0.85, z + k.r.range(-0.22, 0.22)); }
  for (const s of [-1, 1]) { const st = k.mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.44, 8), 0x8a6a4a); st.position.set(x + s * 0.95, 0.22, z); k.npc(x + s * 0.95, z, { kind: s > 0 ? 'elder' : 'adult', role: 'chess', pose: 'sit', face: [x, z], fixed: true, y: 0.02, pack: false }); }
}
export function gardener(k, x, z) {
  const soil = new THREE.Mesh(G('plane', () => new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2)), M(0x7a5f45, { roughness: 1 })); soil.position.set(x + 1.9, 0.04, z); soil.scale.set(3.2, 1, 1.7); k.g.add(soil); k.flowerBed(x + 1.9, z, 3, 1.5, 22);
  bx(k, 0x4f7d5c, x - 1.1, 0.42, z + 0.4, 0.6, 0.3, 0.9, 0.4); const wh = k.mesh(new THREE.TorusGeometry(0.18, 0.05, 5, 10).rotateY(Math.PI / 2), 0x2a2e36); wh.position.set(x - 1.3, 0.2, z + 0.9);
  const n = k.npc(x, z, { role: 'gardener', idle: 'rake', face: [x + 1.9, z], fixed: true, top: 0x5f7a4a, pack: false }); const rk = new THREE.Mesh(unitBox(), M(0x8a6a4a)); rk.scale.set(0.035, 1.5, 0.035); rk.position.set(0, 0.85, 0.42); rk.rotation.x = 0.5; n.g.add(rk); return n;
}
// A cart: 'books' is the Common Shelf's travelling shelf, with a volunteer; 'drinks' sells something hot or cold by season.
export function cart(k, x, z, kind = 'books', face = 0) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = face; const add = (color, px, py, pz, sx, sy, sz) => { const m = new THREE.Mesh(unitBox(), M(color)); m.position.set(px, py, pz); m.scale.set(sx, sy, sz); m.castShadow = true; g.add(m); return m; };
  const body = kind === 'books' ? 0x2f6f8f : k.r.pick([0xc0503f, 0x4f7d5c, 0xb07a2e]);
  add(body, 0, 0.75, 0, 2.2, 0.9, 0.95); add(0xefe6d2, 0, 1.23, 0, 2.3, 0.06, 1.05);
  for (const sx of [-0.8, 0.8]) { const w = new THREE.Mesh(G('p-wheel', () => new THREE.TorusGeometry(0.33, 0.045, 5, 14).rotateY(Math.PI / 2)), M(0x2a2e36)); w.position.set(sx, 0.33, 0.5); w.rotation.y = Math.PI / 2; g.add(w); }
  for (const [px, pz] of [[-1.05, -0.45], [1.05, -0.45], [-1.05, 0.45], [1.05, 0.45]]) add(0x3a4250, px, 1.75, pz, 0.05, 1.1, 0.05);
  for (let i = 0; i < 6; i++) add(i % 2 ? 0xf4f2ec : body, -0.92 + i * 0.37, 2.33, 0, 0.37, 0.07, 1.2);
  if (kind === 'books') { const cols = [0x9a3f3a, 0xe2b23a, 0x4f7d5c, 0xf4f2ec, 0x8a6aa8, 0xc98a3a, 0x24406e, 0xd9748a]; for (let row = 0; row < 2; row++) for (let i = 0; i < 12; i++) add(cols[(i * 3 + row * 5) % 8], -0.9 + i * 0.165, 1.42 + row * 0.02, -0.2 + row * 0.42, 0.13, k.r.range(0.26, 0.36), 0.24); }
  else { for (let i = 0; i < 5; i++) add(0xf4f2ec, -0.6 + i * 0.3, 1.34, 0.2, 0.12, 0.16, 0.12); add(0x9aa3ab, 0.7, 1.45, -0.15, 0.36, 0.4, 0.36); }
  k.g.add(g); k.obstacles.push({ x0: x - 1.3, x1: x + 1.3, z0: z - 1.3, z1: z + 1.3 }); k.mask.rect(x, z, 2.6, 2.6, 0, PAVED);
  const hot = kind !== 'books' && (k.seasonName === 'winter' || k.seasonName === 'fall');
  if (hot) for (let i = 0; i < 3; i++) { const s = new THREE.Mesh(G('ico1', () => new THREE.IcosahedronGeometry(1, 1)), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4, depthWrite: false })); k.own.push(s.material); g.add(s); k.anim.push((t) => { const u = ((t * 0.35 + i / 3) % 1); s.position.set(0.7 + Math.sin(t + i) * 0.08, 1.7 + u * 1.2, -0.15); s.scale.setScalar(0.08 + u * 0.16); s.material.opacity = 0.45 * (1 - u); }); }
  k.labels.push({ text: kind === 'books' ? 'The Common Shelf' : hot ? (k.r.chance(0.5) ? 'Hot chocolate' : 'Coffee and tea') : k.r.chance(0.5) ? 'Lemonade' : 'Ices', x, y: 3.1, z, kind: 'sign' });
  return k.npc(x - Math.sin(face) * 1.0, z - Math.cos(face) * 1.0, { role: kind === 'books' ? 'cart' : 'vendor', face, pack: false, top: kind === 'books' ? 0x2f6f8f : 0xefe6d2, fixed: false });
}
export function birder(k, x, z, lookAt) { const n = k.npc(x, z, { role: 'birder', face: lookAt, fixed: true, kind: k.r.chance(0.5) ? 'elder' : 'adult', pack: false, top: 0x6f7a52 }); const b = new THREE.Mesh(unitBox(), M(0x2a2e36)); b.scale.set(0.17, 0.07, 0.12); b.position.set(0, 1.455, 0.19); n.g.add(b); n.p.arms[0].rotation.x = n.p.arms[1].rotation.x = -2.2; return n; }
export function snowman(k, x, z) {
  for (const [y, s] of [[0.45, 0.5], [1.05, 0.36], [1.5, 0.25]]) { const m = new THREE.Mesh(G('ico1', () => new THREE.IcosahedronGeometry(1, 1)), M(0xfafcfd)); m.position.set(x, y, z); m.scale.setScalar(s); m.castShadow = true; k.g.add(m); }
  const nose = k.mesh(new THREE.ConeGeometry(0.05, 0.3, 5).rotateX(Math.PI / 2), 0xe07b22); nose.position.set(x, 1.5, z + 0.32); for (const s of [-1, 1]) { const a = bx(k, 0x6a5445, x + s * 0.55, 1.1, z, 0.6, 0.04, 0.04); a.rotation.z = s * 0.5; }
  bx(k, 0xc0503f, x, 1.3, z, 0.5, 0.08, 0.5);
  k.npc(x + 1.3, z + 0.6, { kind: 'child', role: 'snowkid', idle: 'play', face: [x, z], fixed: true }); k.npc(x - 1.1, z + 0.9, { kind: 'child', role: 'snowkid', idle: 'wave', face: [x, z] });
}
// A delivery robot: slow, polite, and willing to be spoken to.
export function robot(k, loop) {
  const g = new THREE.Group(), add = (color, px, py, pz, sx, sy, sz) => { const m = new THREE.Mesh(unitBox(), M(color)); m.position.set(px, py, pz); m.scale.set(sx, sy, sz); m.castShadow = true; g.add(m); return m; };
  add(0xf4f2ec, 0, 0.42, 0, 0.56, 0.42, 0.78); add(0x3a4250, 0, 0.66, 0, 0.58, 0.05, 0.8); add(0x9fe8ff, 0, 0.5, 0.4, 0.3, 0.06, 0.02).material = M(0x9fe8ff, { emissive: 0x7fd8f5, emissiveIntensity: 1 });
  for (const sx of [-0.3, 0.3]) for (const sz of [-0.28, 0, 0.28]) { const w = new THREE.Mesh(G('wheel6', () => new THREE.CylinderGeometry(1, 1, 1, 8).rotateZ(Math.PI / 2)), M(0x2a2e36)); w.scale.set(0.08, 0.12, 0.12); w.position.set(sx, 0.12, sz); g.add(w); }
  add(0x3a4250, 0.2, 1.05, -0.3, 0.02, 0.8, 0.02); add(0xe07b22, 0.31, 1.36, -0.3, 0.22, 0.14, 0.02);
  const hit = new THREE.Mesh(G('p-hit', () => new THREE.CylinderGeometry(0.75, 0.75, 2.2, 6)), hitMat); hit.position.y = 0.8; g.add(hit); k.g.add(g);
  const npc = { g, kind: 'robot', role: 'robot', paused: false, walker: true }; hit.userData.pick = { type: 'npc', npc }; k.picks.push(hit); k.npcs.push(npc);
  const segs = []; let total = 0; for (let i = 0; i < loop.length; i++) { const a = loop[i], b = loop[(i + 1) % loop.length], len = Math.hypot(b[0] - a[0], b[1] - a[1]); if (len > 0.01) { segs.push({ a, b, len, at: total }); total += len; } }
  let s = k.r.u() * total, v = 0, yaw = 0, rest = 0, last = -1;
  k.anim.push((t, dt) => {
    const near = Math.hypot(k.player.x - g.position.x, k.player.z - g.position.z), want = npc.paused || rest > 0 || near < 1.4 ? 0 : 0.8; if (rest > 0) rest -= dt; v += (want - v) * Math.min(1, dt * 3); s = (s + v * dt) % total;
    let sg = segs[segs.length - 1], idx = segs.length - 1; for (let i = 0; i < segs.length; i++) if (s < segs[i].at + segs[i].len) { sg = segs[i]; idx = i; break; } if (idx !== last) { if (last >= 0) rest = 1.5; last = idx; }
    const q = (s - sg.at) / sg.len, dx = sg.b[0] - sg.a[0], dz = sg.b[1] - sg.a[1]; g.position.set(sg.a[0] + dx * q + (dz / sg.len) * 0.75, 0, sg.a[1] + dz * q - (dx / sg.len) * 0.75);
    let d = Math.atan2(dx, dz) - yaw; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; yaw += d * Math.min(1, dt * 3); g.rotation.y = yaw;
  });
  return npc;
}

// ---------- everyday life for a place ----------
// Walkers on the given loops, households, people sitting and doing things, carts, animals in their proper places,
// the light line to the session room, and sampling spots (zone a = handy, zone b = out of the way).
export function life(k, loops, o = {}) {
  const r = k.r, S = k.seasonName, winter = S === 'winter', wet = k.weather === 'rain', fair = !winter && !wet;
  const { adults = 5, kids = 2, bikes = 1, dogs = 1, prams = 1, scooters = 1, families = 2, drone = false, mower = null, tour = null } = o;
  k.clearTracks();
  // quiet towns: roughly two people where a busier draft had three
  const some = (n, least = 0) => Math.max(least, Math.round(n * 0.6));
  k.crowd(loops, { adults: some(adults, 2), kids: some(kids, 1), bikes: winter ? 0 : some(bikes), dogs: Math.max(1, some(dogs)), prams: families ? 0 : prams, scooters: fair ? some(scooters) : 0, elders: 1, runners: wet ? 0 : 1, chairs: 1 });
  for (let i = 0; i < some(families, 1); i++) k.family(i % 2 ? loops[i % loops.length].slice().reverse() : loops[i % loops.length]);
  robot(k, loops[0]);
  if (drone) k.drone([[-20, -18], [18, -20], [22, 10], [-16, 14]], 13);
  if (mower && fair) k.mower(...mower);
  const d = k.door, s = k.spawn;
  k.glowLine(o.line || [[s.x, s.z - 1], [(s.x + d.x) / 2, (s.z + d.z) / 2 + 2], [d.x, d.z + 0.6]]);
  const far = [];
  for (const L of loops) for (const [x, z] of L) { const dd = Math.hypot(x - s.x, z - s.z); if (dd > 4) (dd < 22 ? k.spot(x + r.range(-1.5, 1.5), z + r.range(-1.5, 1.5), 'a') : far.push([x, z])); }
  for (const [x, z] of far) k.spot(x + r.range(-1.5, 1.5), z + r.range(-1.5, 1.5), 'b');
  const e = k.size / 2 - 5;
  for (const [x, z] of [[-e, -e + 4], [e, -e + 6], [-e + 3, e - 14], [e - 2, 4], [0, -e + 2]]) k.spot(x, z, 'b');
  // a school group on a visit
  if (tour) { const [x, z] = tour; k.npc(x, z, { role: 'guide', idle: 'wave', top: 0x2f6f8f, pack: false }); for (let i = 0; i < 3; i++) k.npc(x + 1.0 + i * 0.75, z + 0.9 + (i % 2) * 0.5, { kind: 'schoolkid', role: 'schoolkid', face: [x, z] }); }
  const all = loops.flat(), beside = (pt, within = 4.2, apart = 3.4) => k.find([LAWN, WILD], { near: pt, within, apart, margin: 3 }), open = (apart = 6.5) => k.find([LAWN, WILD], { apart, margin: 5 });
  const toward = (p, q) => Math.atan2(q[0] - p[0], q[1] - p[1]); let p;
  // carts by the way in
  if ((p = beside([s.x, s.z], 5))) cart(k, p[0], p[1], 'books', toward(p, [s.x, s.z]));
  if ((p = beside([(s.x + d.x) / 2, (s.z + d.z) / 2], 6))) cart(k, p[0], p[1], 'drinks', toward(p, [(s.x + d.x) / 2, (s.z + d.z) / 2]));
  // benches and lamps beside the paths
  let firstBench = null;
  for (let i = 0; i < 5; i++) { const pt = r.pick(all); if ((p = beside(pt, 2.6, 4))) { const rot = toward(p, pt); k.bench(p[0], p[1], rot, r.chance(0.5)); firstBench ||= p; if (i % 2 === 0) k.lamp(p[0] + Math.cos(rot) * 1.5, p[1] - Math.sin(rot) * 1.5); } }
  // people doing things
  if (fair && (p = beside(r.pick(all), 3.4))) busker(k, p[0], p[1], toward(p, r.pick(all)));
  if (fair && (p = beside(r.pick(all), 3.6))) chess(k, p[0], p[1]);
  if (fair && (p = beside(r.pick(far.length ? far : all), 5))) painter(k, p[0], p[1], [d.x, d.z]);
  if (!winter && (p = open())) gardener(k, p[0], p[1]);
  if (fair && (p = open())) picnic(k, p[0], p[1]);
  if (fair && (p = open(8))) kite(k, p[0], p[1]);
  if (fair && (p = open())) ballGame(k, p[0], p[1]);
  if (!wet && (p = open())) taichi(k, p[0], p[1], 2);
  if (fair && (p = open())) sitters(k, p[0], p[1], 2, 1.2, false, 'student', 'student');
  if (winter) { if ((p = open())) snowman(k, p[0], p[1]); if ((p = open())) snowman(k, p[0], p[1]); }
  // water and what lives on it
  const still = k.waterAreas.filter((w) => !w.river), run = k.waterAreas.filter((w) => w.river);
  const waters = [...still, ...r.sample(run, Math.min(run.length, 3))];
  waters.forEach((w, i) => { k.ducks(w, i === 0 ? 3 : 2, (S === 'spring' || S === 'summer') && i < 2); if (!w.river && w.rx > 2.6 && r.chance(0.6)) k.swan(w); });
  if (waters.length) {
    const big = waters.reduce((a, b) => (a.rx * a.rz > b.rx * b.rz ? a : b)); k.fishJumps(big);
    for (let i = 0; i < 2; i++) { const w = r.pick(waters), a = r.u() * 6.28, hx = w.x + Math.cos(a) * (w.rx + 0.7), hz = w.z + Math.sin(a) * (w.rz + 0.7); if (k.mask.get(hx, hz) !== WATER && k.mask.near(hx, hz, WATER, 1.2) && Math.abs(hx) < e + 3 && Math.abs(hz) < e + 3) { k.heron(hx, hz, toward([hx, hz], [w.x, w.z])); break; } }
    const w = waters[0]; if ((p = beside([w.x + (w.rx + 2.5) * (r.chance(0.5) ? 1 : -1), w.z + (w.rz + 2.5) * (r.chance(0.5) ? 1 : -1)], 4))) { birder(k, p[0], p[1], [w.x, w.z]); for (let i = 0; i < 2; i++) { const q = k.find([LAWN, WILD], { near: p, within: 5, apart: 1.2 }); if (q) k.goose(q[0], q[1]); } }
    if (k.tags.includes('sea')) k.flock(big.x, 9, big.z, 4, Math.max(5, Math.min(big.rx, 12)), 'gull');
  }
  // birds and small animals
  const kinds = winter ? ['robin', 'sparrow', 'blackbird'] : k.tags.includes('city') ? ['pigeon', 'pigeon', 'sparrow'] : ['sparrow', 'tit', 'blackbird', 'robin'];
  for (let i = 0; i < 4; i++) { const q = k.find([PAVED, LAWN, WILD], { apart: 5, margin: 4 }); if (q) k.songbirds(q[0], q[1], r.int(3, 5), kinds[i % kinds.length]); }
  if (!k.tags.includes('desert')) for (const t of r.sample(k.treeSpots.filter((t) => t.kind !== 'palm'), 3)) k.squirrel(t, r.chance(0.7) ? 0x8a5a3a : 0x7a7a7a);
  for (let i = 0; i < 2; i++) { const q = k.find([WILD, LAWN], { apart: 5, margin: 3 }); if (q) k.rabbit(q[0], q[1]); }
  if (firstBench) k.cat(firstBench[0] + 1.6, firstBench[1] + 0.4);
  for (let i = 0; i < 3; i++) { const q = k.find([WILD], { apart: 3, margin: 2 }); if (q) k.butterflies(q[0], q[1], 3); }
  if (k.tags.includes('woods')) for (let i = 0; i < 3; i++) { const q = k.find([WILD], { apart: 6, margin: 3 }); if (q && Math.hypot(q[0] - s.x, q[1] - s.z) > 12) k.deer(q[0], q[1], i === 0); }
  if (k.tags.includes('rural')) { const q = k.find([WILD, LAWN], { apart: 8, margin: 5 }); if (q) for (let i = 0; i < 5; i++) k.sheep(q[0] + r.range(-3, 3), q[1] + r.range(-3, 3)); }
  k.flock(r.range(-10, 10), 15, r.range(-10, 10), 4, 11);
  if (S === 'fall') k.vee();
}
// A small thing worth finding. kind picks a simple shape; the cabinet text lives in content/eggs.js.
export function egg(k, id, x, z, kind = 'box', color = 0xcc79a7, y = 0) {
  const g = new THREE.Group(); g.position.set(x, y, z);
  const mk = (geo, c = color) => { const m = new THREE.Mesh(geo, k.mat(c)); m.castShadow = true; g.add(m); return m; };
  if (kind === 'box') mk(new THREE.BoxGeometry(0.6, 0.6, 0.6)).position.y = 0.3;
  if (kind === 'ball') mk(new THREE.IcosahedronGeometry(0.4, 1)).position.y = 0.4;
  if (kind === 'bird') { mk(new THREE.IcosahedronGeometry(0.28, 1)).position.y = 0.3; const b = mk(new THREE.ConeGeometry(0.1, 0.3, 4), 0xe2b23a); b.position.set(0, 0.32, 0.3); b.rotation.x = Math.PI / 2; }
  if (kind === 'post') { mk(new THREE.CylinderGeometry(0.08, 0.08, 1.6, 6), 0x6b5a4a).position.y = 0.8; mk(new THREE.BoxGeometry(0.9, 0.5, 0.08)).position.y = 1.5; }
  if (kind === 'pot') { mk(new THREE.CylinderGeometry(0.28, 0.34, 0.6, 9)).position.y = 0.3; mk(new THREE.TorusGeometry(0.18, 0.04, 5, 10), color).position.set(0.38, 0.32, 0); }
  if (kind === 'animal') { mk(new THREE.BoxGeometry(0.35, 0.35, 0.8)).position.y = 0.32; mk(new THREE.BoxGeometry(0.3, 0.3, 0.3)).position.set(0, 0.5, 0.45); }
  if (kind === 'pumpkin') { const p = mk(new THREE.IcosahedronGeometry(0.4, 1), 0xe07b22); p.scale.y = 0.8; p.position.y = 0.3; mk(new THREE.CylinderGeometry(0.05, 0.05, 0.2, 5), 0x4f7d3a).position.y = 0.68; }
  const hit = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 3, 8), hitMat); hit.position.y = 1.2; g.add(hit);
  k.g.add(g); k.pick(g, { type: 'egg', id, x, z }); return g;
}
