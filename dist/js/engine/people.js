// People: everyone in a scene is someone the player can walk up to and talk with.
// Each person is one baked body (torso, head, hair, whatever they carry) plus two legs and two arms that swing.
import * as THREE from 'three';
import { Kit, G, M, NI, C } from './kit.js';

const SKIN = [0xf1d3b8, 0xe8c19c, 0xd9ad84, 0xc08a5e, 0x9a6a46, 0x74492f, 0x5a3825];
const HAIR = [0x2a211c, 0x4a3526, 0x6f4f32, 0xc9a46a, 0x9a9a9a, 0xe9e4dc, 0x8a3f2a, 0x14110f, 0x3a2a22];
const CLOTHES = {
  fall: [0x7a3b2e, 0x35507a, 0x4f6a4a, 0xb07a2e, 0x5a4a6a, 0x8a6a4a, 0x2f5d62, 0x9a4a4a, 0xc9b28a],
  winter: [0x2f3f5a, 0x5a2f3a, 0x3f5a4a, 0x6a6a72, 0x8a2f2f, 0x2f4f6a, 0x4a3f5a, 0xb9a98a],
  spring: [0x4d8fa8, 0xe0a03a, 0x6aa86a, 0xd9748a, 0x7a8fd0, 0xe9e4d6, 0x9a7ac8, 0x5fa08f],
  summer: [0xe9e4d6, 0x5fb0c8, 0xf0b84a, 0xe8745a, 0x7ac08a, 0xf3a6c0, 0x8fa9e8, 0xd9c08a],
};
const TROUSERS = [0x2f3a4f, 0x3a3a40, 0x5a4a3a, 0x40506a, 0x6a6a6a, 0x2a2e36, 0x7a6a52];

const g_ = {
  torso: () => NI('p-torso', () => new THREE.CylinderGeometry(0.2, 0.27, 0.66, 7)),
  coat: () => NI('p-coat', () => new THREE.CylinderGeometry(0.2, 0.34, 0.92, 7)),
  dress: () => NI('p-dress', () => new THREE.CylinderGeometry(0.17, 0.38, 0.84, 8)),
  head: () => NI('p-head', () => new THREE.IcosahedronGeometry(0.175, 1)),
  cap: () => NI('p-cap', () => new THREE.SphereGeometry(0.192, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2)),
  brim: () => NI('p-brim', () => new THREE.CylinderGeometry(0.32, 0.32, 0.03, 10)),
  box: () => NI('p-box', () => new THREE.BoxGeometry(1, 1, 1)),
  ring: () => NI('p-ring', () => new THREE.TorusGeometry(0.2, 0.06, 4, 9).rotateX(Math.PI / 2)),
  leg: () => G('p-leg', () => new THREE.CylinderGeometry(0.08, 0.065, 0.52, 5).translate(0, -0.26, 0)),
  arm: () => G('p-arm', () => new THREE.CylinderGeometry(0.058, 0.05, 0.5, 5).translate(0, -0.25, 0)),
  hit: () => G('p-hit', () => new THREE.CylinderGeometry(0.75, 0.75, 2.2, 6)),
  wheel: () => G('p-wheel', () => new THREE.TorusGeometry(0.33, 0.045, 5, 14).rotateY(Math.PI / 2)),
};
const bodyMat = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.95 });
const hitMat = new THREE.MeshBasicMaterial({ visible: false });

function bake(parts) { // parts: [geo, x, y, z, sx, sy, sz, color, rx?]
  const pos = [], col = [], v = new THREE.Vector3(), c = new THREE.Color(), m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  for (const [geo, x, y, z, sx, sy, sz, color, rx = 0, rz = 0] of parts) {
    e.set(rx, 0, rz); q.setFromEuler(e); m.compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(sx, sy, sz)); c.set(color);
    const p = geo.attributes.position; for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i).applyMatrix4(m); pos.push(v.x, v.y, v.z); col.push(c.r, c.g, c.b); }
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.computeVertexNormals(); return g;
}

// Build one person. o: { kind, top, scale, mono (a statue colour), rain }
export function makePerson(k, o = {}) {
  const r = k.r, S = k.seasonName, kind = o.kind || 'adult', mono = o.mono;
  const child = kind === 'child' || kind === 'toddler', elder = kind === 'elder';
  const skin = mono ?? r.pick(SKIN), hair = mono ?? (elder ? r.pick([0x9a9a9a, 0xe9e4dc, 0xcfcac2]) : r.pick(HAIR));
  const top = mono ?? o.top ?? (child ? r.pick([0xe2b23a, 0xd24d3e, 0x4f9a54, 0x3f7fb5, 0x8a6aa8, 0xf08a5a, 0x5fb0c8]) : r.pick(CLOTHES[S]));
  const legC = mono ?? (kind === 'runner' ? skin : r.pick(TROUSERS)), style = r.int(0, 9), parts = [];
  const cold = S === 'winter' || (S === 'fall' && r.chance(0.4)), dress = !mono && !cold && !child && style === 7 && kind === 'adult';
  if (cold && !child && r.chance(0.7)) parts.push([g_.coat(), 0, 0.72, 0, 1, 1, 1, top]);
  else if (dress) parts.push([g_.dress(), 0, 0.74, 0, 1, 1, 1, top]);
  else parts.push([g_.torso(), 0, 0.85, 0, 1, 1, 1, top]);
  parts.push([g_.head(), 0, 1.36, 0, 1, 1, 1, skin]);
  if (mono == null) {
    const beanie = cold && r.chance(0.45), sun = S === 'summer' && r.chance(0.22), capc = beanie ? r.pick([0xc0503f, 0x2f6f8f, 0xe2b23a, 0x4a5568, 0x6a8a5a]) : hair;
    if (!(elder && style < 2)) parts.push([g_.cap(), 0, 1.37, 0, 1, beanie ? 1.15 : 1, 1, capc]);
    if (beanie) parts.push([g_.head(), 0, 1.6, 0, 0.3, 0.3, 0.3, 0xf4f2ec]);
    if (sun) parts.push([g_.brim(), 0, 1.44, 0, 1, 1, 1, 0xe9dfc0]);
    if (!beanie && style % 3 === 1 && !elder) parts.push([g_.box(), 0, 1.22, -0.13, 0.3, 0.34, 0.1, hair]);        // long hair
    if (style === 4 && !child) parts.push([g_.box(), 0, 1.38, 0.17, 0.26, 0.05, 0.03, 0x2a2e36]);                  // glasses
    if (cold && r.chance(0.5)) parts.push([g_.ring(), 0, 1.16, 0, 1, 1, 1, r.pick([0xd24d3e, 0xe2b23a, 0x3f7fb5, 0xefe6d2, 0x4f7d5c])]);
    if ((o.pack ?? (kind === 'adult' && r.chance(0.45))) || kind === 'schoolkid') parts.push([g_.box(), 0, 0.92, -0.24, 0.32, 0.38, 0.16, r.pick([0x3a4250, 0xa64b3c, 0x4f7d5c, 0xc98a3a, 0x35507a])]);
    if (o.rain) { parts.push([g_.box(), 0.22, 1.5, 0.05, 0.03, 0.9, 0.03, 0x3a4250]); parts.push([NI('p-umb', () => new THREE.ConeGeometry(0.75, 0.28, 8)), 0.22, 2.0, 0.05, 1, 1, 1, r.pick([0x24406e, 0xc0503f, 0xe2b23a, 0x2f6f5a, 0x3a4250])]); }
  }
  const grp = new THREE.Group(), body = new THREE.Mesh(bake(parts), bodyMat); body.castShadow = true; grp.add(body);
  const legs = [], arms = [];
  for (const sx of [-1, 1]) { const l = new THREE.Mesh(g_.leg(), M(legC)); l.position.set(sx * 0.1, 0.52, 0); l.castShadow = true; grp.add(l); legs.push(l); }
  for (const sx of [-1, 1]) { const a = new THREE.Mesh(g_.arm(), M(top)); a.position.set(sx * 0.27, 1.13, 0); a.rotation.z = sx * 0.1; a.castShadow = true; grp.add(a); arms.push(a); }
  const sc = (o.scale ?? 1) * ({ child: 0.64, toddler: 0.46, elder: 0.96, schoolkid: 0.6 }[kind] || 1) * (mono == null ? r.range(0.94, 1.06) : 1);
  grp.scale.setScalar(sc);
  return { g: grp, legs, arms, body, scale: sc, kind, top };
}
export function stride(p, phase, amp = 0.55) { const s = Math.sin(phase) * amp; p.legs[0].rotation.x = s; p.legs[1].rotation.x = -s; p.arms[0].rotation.x = -s * 0.8; p.arms[1].rotation.x = s * 0.8; }
export function sit(p, ground = false) { for (const l of p.legs) l.rotation.x = -1.45; for (const a of p.arms) a.rotation.x = -0.6; p.g.position.y += (ground ? -0.42 : -0.1) * p.scale; p.seated = true; }

function register(k, p, info) {
  const hit = new THREE.Mesh(g_.hit(), hitMat); hit.position.y = 1.0; p.g.add(hit);
  const npc = { g: p.g, p, paused: false, hold: 0, ...info }; hit.userData.pick = { type: 'npc', npc }; k.picks.push(hit); k.npcs.push(npc); return npc;
}
const ROLE_FOR = { adult: ['student', 'student', 'staff', 'visitor'], elder: ['elder'], child: ['child'], runner: ['runner'], pram: ['parent'], scooter: ['child'], bike: ['cyclist'], wheelchair: ['student', 'staff'], dogwalker: ['dogwalker'] };

// ---- walkers: people who go round a loop of points, pause now and then, and stop when spoken to ----
function walker(k, loop, kind = 'adult', o = {}) {
  const r = k.r, rain = k.weather === 'rain' && r.chance(0.7);
  const base = { adult: 'adult', child: 'child', pram: 'adult', scooter: 'child', bike: 'adult', elder: 'elder', runner: 'runner', wheelchair: 'adult', dogwalker: 'adult' }[kind] || 'adult';
  const p = makePerson(k, { kind: base, rain: rain && !['bike', 'scooter', 'runner', 'wheelchair'].includes(kind), ...o });
  const g = new THREE.Group(); g.add(p.g); let extra = null;
  const unit = g_.box();
  const add = (geo, color, x, y, z, sx = 1, sy = 1, sz = 1) => { const m = new THREE.Mesh(geo === 'box' ? G('box', () => new THREE.BoxGeometry(1, 1, 1)) : geo, M(color)); m.position.set(x, y, z); m.scale.set(sx, sy, sz); m.castShadow = true; g.add(m); return m; };
  if (kind === 'pram') { add('box', r.pick([0x3f5f7f, 0x7a4a5a, 0x4f6a5a]), 0, 0.58, 0.78, 0.46, 0.34, 0.7); add('box', 0x2a2e36, 0, 0.86, 0.6, 0.48, 0.3, 0.36); for (const [x, z] of [[-0.22, 0.52], [0.22, 0.52], [-0.22, 1.04], [0.22, 1.04]]) add(g_.wheel(), 0x2a2e36, x, 0.14, z, 0.4, 0.4, 0.4); add('box', 0x2a2e36, 0, 0.95, 0.38, 0.4, 0.03, 0.03); p.arms[0].rotation.x = p.arms[1].rotation.x = -1.0; p.armsFixed = true; }
  if (kind === 'scooter') { add('box', 0xd24d3e, 0, 0.07, 0.1, 0.12, 0.05, 0.8); add('box', 0x9aa3ab, 0, 0.45, 0.45, 0.03, 0.8, 0.03); add('box', 0x2a2e36, 0, 0.84, 0.45, 0.34, 0.03, 0.03); p.arms[0].rotation.x = p.arms[1].rotation.x = -1.1; p.armsFixed = true; }
  if (kind === 'bike') { for (const dz of [-0.55, 0.55]) add(g_.wheel(), 0x2a2e36, 0, 0.34, dz); add('box', r.pick([0xc0503f, 0x2f6f8f, 0x4f7d5c, 0xe2b23a]), 0, 0.5, 0, 0.05, 0.05, 1.1); add('box', 0x2a2e36, 0, 0.78, 0.5, 0.4, 0.03, 0.03); p.g.position.y = 0.26; p.g.rotation.x = 0.18; p.arms[0].rotation.x = p.arms[1].rotation.x = -1.0; p.armsFixed = true; }
  if (kind === 'wheelchair') { sit(p); p.g.position.y = 0.16; for (const sx of [-0.3, 0.3]) add(g_.wheel(), 0x2a2e36, sx, 0.36, -0.05, 1.05, 1.05, 1.05); add('box', 0x3a4250, 0, 0.5, -0.05, 0.5, 0.06, 0.5); add('box', 0x3a4250, 0, 0.82, -0.3, 0.5, 0.6, 0.05); p.arms[0].rotation.x = p.arms[1].rotation.x = -0.5; p.armsFixed = true; }
  if (kind === 'elder' && r.chance(0.6)) { extra = add('box', 0x6b4a2f, 0.32 * p.scale, 0.45, 0.2, 0.03, 0.9, 0.03); }
  k.g.add(g);
  const v0 = o.speed ?? ({ adult: 1.25, child: 1.5, pram: 1.05, scooter: 2.6, bike: 3.6, elder: 0.85, runner: 2.8, wheelchair: 1.5, dogwalker: 1.15 })[kind] * r.range(0.9, 1.12);
  const off = o.off ?? r.range(-0.55, 0.55), segs = []; let total = 0;
  for (let i = 0; i < loop.length; i++) { const a = loop[i], b = loop[(i + 1) % loop.length], len = Math.hypot(b[0] - a[0], b[1] - a[1]); if (len > 0.01) { segs.push({ a, b, len, at: total }); total += len; } }
  let s = o.start ?? r.u() * total, v = 0, rest = 0, phase = r.u() * 6, lastSeg = -1, yaw = 0;
  const npc = register(k, p, { kind, role: o.role || r.pick(ROLE_FOR[kind] || ['visitor']), walker: true, root: g, group: o.group });
  npc.g = g;
  k.anim.push((t, dt) => {
    const near = Math.hypot(k.player.x - g.position.x, k.player.z - g.position.z);
    let want = v0; if (npc.paused || rest > 0) want = 0; else if (near < 1.6) want = v0 * 0.35;
    if (rest > 0) rest -= dt;
    v += (want - v) * Math.min(1, dt * 3.5); s = (s + v * dt) % total;
    let sg = segs[segs.length - 1], idx = segs.length - 1; for (let i = 0; i < segs.length; i++) if (s < segs[i].at + segs[i].len) { sg = segs[i]; idx = i; break; }
    if (idx !== lastSeg) { if (lastSeg >= 0 && !o.noRest && kind !== 'bike' && kind !== 'runner' && r.chance(0.14)) rest = r.range(2, 5); lastSeg = idx; }
    const q = (s - sg.at) / sg.len, dx = sg.b[0] - sg.a[0], dz = sg.b[1] - sg.a[1], nx = dz / sg.len, nz = -dx / sg.len;
    g.position.set(sg.a[0] + dx * q + nx * off, 0, sg.a[1] + dz * q + nz * off);
    let target = Math.atan2(dx, dz); if (npc.paused && near < 7) target = Math.atan2(k.player.x - g.position.x, k.player.z - g.position.z);
    let d = target - yaw; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; yaw += d * Math.min(1, dt * 5); g.rotation.y = yaw;
    phase += v * dt * (kind === 'child' || kind === 'scooter' ? 7.5 : 5.2) / p.scale * 0.62;
    const moving = v / v0;
    if (kind === 'bike') { p.legs[0].rotation.x = Math.sin(phase) * 0.7 - 0.6; p.legs[1].rotation.x = -Math.sin(phase) * 0.7 - 0.6; }
    else if (kind === 'scooter') { p.legs[1].rotation.x = Math.max(0, Math.sin(phase * 0.5)) * 0.9 * moving; }
    else if (kind !== 'wheelchair') { const a = (kind === 'runner' ? 0.9 : 0.5) * moving; const sn = Math.sin(phase) * a; p.legs[0].rotation.x = sn; p.legs[1].rotation.x = -sn; if (!p.armsFixed) { p.arms[0].rotation.x = -sn * 0.8; p.arms[1].rotation.x = sn * 0.8; } p.g.position.y = Math.abs(Math.sin(phase)) * 0.035 * moving; }
    if (extra) extra.rotation.x = Math.sin(phase) * 0.25 * moving;
  });
  return npc;
}

// ---- people who stay put: readers, painters, a busker, tai chi, a gardener ----
function npc(k, x, z, o = {}) {
  const p = makePerson(k, { kind: o.kind || 'adult', top: o.top, pack: o.pack ?? false, scale: o.scale });
  const g = p.g; g.position.set(x, o.y || 0, z); let yaw = o.face == null ? k.r.u() * 6.28 : Array.isArray(o.face) ? Math.atan2(o.face[0] - x, o.face[1] - z) : o.face; g.rotation.y = yaw;
  if (o.pose === 'sit') sit(p); if (o.pose === 'ground') sit(p, true);
  k.g.add(g);
  const rec = register(k, p, { kind: o.kind || 'adult', role: o.role || 'visitor', local: o.local, still: true });
  const home = yaw, ph = k.r.u() * 6, baseY = g.position.y, idle = o.idle || 'breathe';
  k.anim.push((t, dt) => {
    const near = Math.hypot(k.player.x - x, k.player.z - z);
    if (idle !== 'taichi' && !o.fixed) { let target = near < 5.5 || rec.paused ? Math.atan2(k.player.x - x, k.player.z - z) : home; let d = target - yaw; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; if (p.seated) d = Math.max(-0.9, Math.min(0.9, target - home)) + home - yaw; yaw += d * Math.min(1, dt * 2.5); g.rotation.y = yaw; }
    g.position.y = baseY + Math.sin(t * 1.6 + ph) * 0.008;
    if (idle === 'taichi') { const a = Math.sin(t * 0.5) * 1.1; p.arms[0].rotation.x = -1.2 + a * 0.5; p.arms[1].rotation.x = -1.2 - a * 0.5; p.arms[0].rotation.z = -0.3 - a * 0.3; p.arms[1].rotation.z = 0.3 - a * 0.3; g.rotation.y = home + Math.sin(t * 0.25) * 0.5; p.legs[0].rotation.x = Math.sin(t * 0.25) * 0.2; }
    if (idle === 'paint') p.arms[1].rotation.x = -1.3 + Math.sin(t * 1.7 + ph) * 0.25;
    if (idle === 'wave' && near < 9) { p.arms[1].rotation.z = 2.6 + Math.sin(t * 7) * 0.3; } else if (idle === 'wave') p.arms[1].rotation.z = 0.1;
    if (idle === 'play') { p.arms[1].rotation.x = -1.0 + Math.sin(t * 2.2 + ph) * 0.3; p.arms[0].rotation.x = -0.8; }
    if (idle === 'rake') { p.arms[0].rotation.x = p.arms[1].rotation.x = -0.9 + Math.sin(t * 1.3 + ph) * 0.35; }
    if (idle === 'read' && !p.seated) { p.arms[0].rotation.x = p.arms[1].rotation.x = -1.1; }
  });
  return rec;
}

Object.assign(Kit.prototype, {
  walker(loop, kind, o) { return walker(this, loop, kind, o); },
  npc(x, z, o) { return npc(this, x, z, o); },
  // compat: a plain standing figure (not interactive), used for statues and small scene dressing
  figure(color = 0x35507a, scale = 1) { const p = makePerson(this, { kind: scale < 0.75 ? 'child' : 'adult', top: color, scale: scale < 0.75 ? scale / 0.64 : scale, pack: false }); return p.g; },
  statueFigure(color = 0x6f7f72, scale = 1) { return makePerson(this, { mono: color, scale }).g; },
  // a household out together: they share a loop and keep step
  family(loop) {
    const start = this.r.u() * 40, sp = 1.0, grp = 'f' + this.npcs.length, n = this.r.int(1, 2);
    this.walker(loop, this.r.chance(0.5) ? 'pram' : 'adult', { speed: sp, off: 0, start, role: 'parent', group: grp, noRest: true });
    if (this.r.chance(0.6)) this.walker(loop, 'adult', { speed: sp, off: 0.7, start: start + 0.3, role: 'parent', group: grp, noRest: true });
    for (let i = 0; i < n; i++) this.walker(loop, 'child', { speed: sp, off: -0.7 - i * 0.5, start: start + 0.9 + i * 0.5, role: 'child', group: grp, noRest: true });
    if (this.r.chance(0.3)) this.walker(loop, 'elder', { speed: sp, off: 1.3, start: start - 0.6, role: 'elder', group: grp, noRest: true });
    return this;
  },
  crowd(loops, { adults = 5, kids = 2, bikes = 1, dogs = 1, prams = 1, scooters = 1, elders = 2, runners = 1, chairs = 1 } = {}) {
    const L = (i) => (this.r.chance(0.5) ? loops[i % loops.length] : loops[i % loops.length].slice().reverse());
    for (let i = 0; i < adults; i++) this.walker(L(i), 'adult');
    for (let i = 0; i < kids; i++) this.walker(L(i + 1), 'child');
    for (let i = 0; i < elders; i++) this.walker(L(i + 2), 'elder');
    for (let i = 0; i < runners; i++) this.walker(L(i), 'runner');
    for (let i = 0; i < chairs; i++) this.walker(L(i + 1), 'wheelchair');
    for (let i = 0; i < bikes; i++) this.walker(L(i + 2), 'bike');
    for (let i = 0; i < prams; i++) this.walker(L(i + 1), 'pram');
    for (let i = 0; i < scooters; i++) this.walker(L(i + 2), 'scooter');
    for (let i = 0; i < dogs; i++) { const owner = this.walker(L(i), 'dogwalker'); if (this.dog) this.dog(owner); }
    return this;
  },
  bench(x, z, rot = 0, sitter = true) {
    const g = new THREE.Group(), unit = G('box', () => new THREE.BoxGeometry(1, 1, 1)); g.position.set(x, 0, z); g.rotation.y = rot;
    const s = new THREE.Mesh(unit, M(C.wood)); s.scale.set(1.9, 0.1, 0.5); s.position.y = 0.46; s.castShadow = true; g.add(s);
    const b = new THREE.Mesh(unit, M(C.wood)); b.scale.set(1.9, 0.45, 0.08); b.position.set(0, 0.78, -0.24); b.castShadow = true; g.add(b);
    for (const sx of [-0.8, 0.8]) { const l = new THREE.Mesh(unit, M(0x3a4250)); l.scale.set(0.08, 0.46, 0.46); l.position.set(sx, 0.23, 0); g.add(l); }
    this.g.add(g); this.mask.rect(x, z, 2, 0.8, rot, 2);
    if (sitter) {
      const fx = Math.sin(rot), fz = Math.cos(rot), cx = Math.cos(rot), cz = -Math.sin(rot), n = this.r.chance(0.35) ? 2 : 1;
      for (let i = 0; i < n; i++) { const o = n === 2 ? (i ? 0.45 : -0.45) : this.r.range(-0.4, 0.4); const who = this.npc(x + cx * o + fx * 0.05, z + cz * o + fz * 0.05, { kind: this.r.chance(0.4) ? 'elder' : 'adult', pose: 'sit', face: rot, role: 'reader', idle: 'read' }); if (i === 0 && this.r.chance(0.7)) { const bk = new THREE.Mesh(unit, M(this.r.pick([0x9a3f3a, 0x2f6f8f, 0x4f7d5c, 0xc98a3a]))); bk.scale.set(0.24, 0.03, 0.18); bk.position.set(0, 0.86, 0.36); bk.rotation.x = -0.5; who.g.add(bk); } }
    }
    return g;
  },
});
export { SKIN, HAIR };
