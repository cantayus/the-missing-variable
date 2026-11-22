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

// Heights of a grown figure before scaling, for anything that has to meet a hand, a neck or a seat.
export const BODY = { hip: 0.72, knee: 0.4, shoulder: 1.22, neck: 1.3, head: 1.44, eye: 1.455, top: 1.6, arm: 0.56 };

const g_ = {
  torso: () => NI('p-torso', () => new THREE.CylinderGeometry(0.215, 0.162, 0.46, 10)),
  hips: () => NI('p-hips', () => new THREE.CylinderGeometry(0.165, 0.172, 0.2, 10)),
  coat: () => NI('p-coat', () => new THREE.CylinderGeometry(0.17, 0.215, 0.42, 10)),
  skirt: () => NI('p-skirt', () => new THREE.CylinderGeometry(0.16, 0.275, 0.48, 10)),
  mini: () => NI('p-mini', () => new THREE.CylinderGeometry(0.166, 0.24, 0.3, 10)),
  neck: () => NI('p-neck', () => new THREE.CylinderGeometry(0.05, 0.058, 0.13, 6)),
  head: () => NI('p-head', () => new THREE.IcosahedronGeometry(0.175, 1)),
  ball: () => NI('p-ball', () => new THREE.IcosahedronGeometry(1, 0)),
  limb: () => NI('p-limb', () => new THREE.CylinderGeometry(1, 0.8, 1, 6)),
  cap: () => NI('p-cap', () => new THREE.SphereGeometry(0.192, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2)),
  brim: () => NI('p-brim', () => new THREE.CylinderGeometry(0.32, 0.32, 0.03, 10)),
  box: () => NI('p-box', () => new THREE.BoxGeometry(1, 1, 1)),
  ring: () => NI('p-ring', () => new THREE.TorusGeometry(0.2, 0.06, 4, 9).rotateX(Math.PI / 2)),
  thigh: () => G('p-thigh', () => new THREE.CylinderGeometry(0.082, 0.064, 0.36, 6).translate(0, -0.17, 0)),
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

// Build one person. o: { kind, top, scale, mono (a statue colour), rain, hat (false: never a hat) }
// A figure is about seven heads tall, with a waist, shoulders, a neck, hands, knees that bend and shoes.
// The body is one baked mesh. Each leg is a thigh with a shin hung from its knee, each arm a single piece from the shoulder.
const SHIRTS = [0xf4f2ec, 0xe9e4d6, 0xcfe0ee, 0xf3d9c0, 0xdfe8d6];
const SHOES = [0x2a2e36, 0x4a3a2c, 0x6a4a34, 0xf0ede6, 0x3a3f5a, 0x7a2f2f];
const TIGHTS = [0x2a2e36, 0x3a3340, 0x4a3a34];
export function makePerson(k, o = {}) {
  const r = k.r, S = k.seasonName, kind = o.kind || 'adult', mono = o.mono;
  const small = kind === 'child' || kind === 'toddler' || kind === 'schoolkid', child = kind === 'child' || kind === 'toddler', elder = kind === 'elder';
  const skin = mono ?? r.pick(SKIN), hair = mono ?? (elder ? r.pick([0x9a9a9a, 0xe9e4dc, 0xcfcac2]) : r.pick(HAIR));
  const top = mono ?? o.top ?? (small ? r.pick([0xe2b23a, 0xd24d3e, 0x4f9a54, 0x3f7fb5, 0x8a6aa8, 0xf08a5a, 0x5fb0c8]) : r.pick(CLOTHES[S]));
  const legC = mono ?? (kind === 'runner' ? 0x2a2e36 : r.pick(TROUSERS)), style = r.int(0, 9), parts = [];
  const cold = S === 'winter' || (S === 'fall' && r.chance(0.4)), warm = S === 'summer' || (S === 'spring' && r.chance(0.35));
  const coat = cold && !small && r.chance(0.7), dress = !mono && !cold && !small && style === 7 && kind === 'adult', skirt = !mono && !coat && !dress && !small && kind !== 'runner' && style === 1;
  const shortSleeves = mono == null && !coat && (kind === 'runner' || (warm && r.chance(0.7))), shorts = mono == null && !dress && !skirt && !coat && (kind === 'runner' || (S === 'summer' && r.chance(small ? 0.6 : 0.3)));
  const bare = dress || skirt ? (cold || r.chance(0.3) ? r.pick(TIGHTS) : skin) : null;       // legs under a skirt: tights or skin
  const thighC = mono ?? bare ?? legC, shinC = mono ?? bare ?? (shorts ? skin : legC), shoeC = mono ?? (kind === 'runner' ? r.pick([0xe8745a, 0xf0ede6, 0x5fb0c8]) : r.pick(SHOES));
  const build = mono == null ? r.range(0.92, 1.08) : 1, wide = 0.2 * build;                    // half the width across the shoulders
  // ---- trunk ----
  parts.push([g_.hips(), 0, 0.745, 0, build, 1, 0.64, dress ? top : legC]);
  parts.push([g_.torso(), 0, 1.03, 0, build, 1, 0.58, top]);
  for (const sx of [-1, 1]) parts.push([g_.ball(), sx * wide, 1.215, 0, 0.066, 0.06, 0.066, top]);   // rounded shoulders
  if (coat) parts.push([g_.coat(), 0, 0.64, 0, build, 1, 0.64, top]);
  else if (dress) parts.push([g_.skirt(), 0, 0.6, 0, build, 1, 0.78, top]);
  else if (skirt) parts.push([g_.mini(), 0, 0.69, 0, build, 1, 0.76, legC]);
  if (mono == null && !dress && !small && (coat || style === 2 || style === 6)) {            // a jacket worn open over a shirt
    const shirt = r.pick(SHIRTS); parts.push([g_.box(), 0, 1.06, 0.118 * build, 0.085, 0.36, 0.03, shirt]); parts.push([g_.box(), 0, 1.245, 0.1, 0.13, 0.035, 0.05, shirt]);
  }
  parts.push([g_.neck(), 0, 1.295, 0, 1, 1, 1, skin]);
  // ---- head: children carry a bigger one for their size ----
  const hs = (kind === 'toddler' ? 1.4 : small ? 1.24 : 1) * 0.772, hy = BODY.head + (small ? 0.025 : 0);
  const hd = (geo, x, y, z, sx, sy, sz, color, rx = 0) => parts.push([geo, x * hs, hy + (y - 1.36) * hs, z * hs, sx * hs, sy * hs, sz * hs, color, rx]);   // placed as if on a head 0.175 across at 1.36
  hd(g_.head(), 0, 1.36, 0, 1, 1.13, 1.03, skin);
  if (mono == null) {
    for (const sx of [-1, 1]) hd(g_.box(), sx * 0.064, 1.372, 0.166, 0.026, 0.032, 0.03, 0x2a2622);   // eyes
    // Most heads show their hair. A hat is the exception: a beanie in the cold, a straw hat in summer, now and then a cap.
    const hats = o.hat !== false, beanie = hats && cold && r.chance(0.28), sun = hats && !beanie && S === 'summer' && r.chance(0.15), peak = hats && !beanie && !sun && !elder && r.chance(0.06);
    const hat = beanie || sun || peak, bald = elder ? style < 3 : !small && style === 0;
    if (beanie) { const c = r.pick([0xc0503f, 0x2f6f8f, 0xe2b23a, 0x4a5568, 0x6a8a5a]); hd(g_.cap(), 0, 1.385, 0, 1.03, 1.15, 1.05, c); hd(g_.head(), 0, 1.61, 0, 0.3, 0.3, 0.3, 0xf4f2ec); }
    else if (sun) { hd(g_.brim(), 0, 1.47, 0, 1, 1, 1, 0xe9dfc0); hd(g_.cap(), 0, 1.47, 0, 0.9, 0.75, 0.92, 0xdccfa6); }
    else if (peak) { const c = r.pick([0x35507a, 0x8a2f3a, 0x3a4250, 0x4f7d5c]); hd(g_.cap(), 0, 1.42, 0, 1.01, 0.8, 1.04, c); hd(g_.box(), 0, 1.425, 0.23, 0.25, 0.025, 0.17, c); }
    else if (!bald) {
      if (style === 5 || style === 9) hd(g_.head(), 0, 1.445, -0.03, 1.17, 1.02, 1.15, hair);            // a full head of curls
      else hd(g_.cap(), 0, 1.385, -0.012, 0.975, 1.02, 1.03, hair, -0.42);                              // swept back, the forehead clear
      if (style === 8 && !small) hd(g_.head(), 0, 1.51, -0.165, 0.42, 0.42, 0.42, hair);                // a bun
      if (small && style % 2 === 0) for (const sx of [-1, 1]) hd(g_.head(), sx * 0.19, 1.33, -0.05, 0.3, 0.42, 0.3, hair);   // bunches
    }
    if (hat && !bald) hd(g_.box(), 0, 1.3, -0.11, 0.31, 0.16, 0.16, hair);                               // what shows under the hat
    if (!bald && !beanie && style % 3 === 1 && !elder) hd(g_.box(), 0, 1.2, -0.135, 0.3, 0.4, 0.1, hair);  // long hair
    if (style === 4 && !small) hd(g_.box(), 0, 1.378, 0.178, 0.27, 0.05, 0.02, 0x2a2e36);               // glasses
    if (cold && r.chance(0.5)) parts.push([g_.ring(), 0, 1.275, 0, 0.66, 0.9, 0.62, r.pick([0xd24d3e, 0xe2b23a, 0x3f7fb5, 0xefe6d2, 0x4f7d5c])]);   // a scarf
    if ((o.pack ?? (kind === 'adult' && r.chance(0.45))) || kind === 'schoolkid') parts.push([g_.box(), 0, 1.03, -0.2, 0.3, 0.36, 0.14, r.pick([0x3a4250, 0xa64b3c, 0x4f7d5c, 0xc98a3a, 0x35507a])]);
    if (o.rain) { parts.push([g_.box(), 0.27, 1.5, 0.08, 0.025, 0.95, 0.025, 0x3a4250]); parts.push([NI('p-umb', () => new THREE.ConeGeometry(0.75, 0.28, 8)), 0.27, 2.02, 0.08, 1, 1, 1, r.pick([0x24406e, 0xc0503f, 0xe2b23a, 0x2f6f5a, 0x3a4250])]); }
  }
  const grp = new THREE.Group(), body = new THREE.Mesh(bake(parts), bodyMat); body.castShadow = true; grp.add(body);
  // ---- limbs ----
  const shin = bake([[g_.limb(), 0, -0.17, 0, 0.061, 0.36, 0.061, shinC], [g_.box(), 0, -0.368, 0.045, 0.1, 0.075, 0.225, shoeC]]);
  const arm = bake([[g_.limb(), 0, -0.14, 0, 0.056, 0.3, 0.056, top], [g_.limb(), 0, -0.405, 0.022, 0.046, 0.27, 0.046, shortSleeves ? skin : top, -0.16], [g_.ball(), 0, -0.565, 0.05, 0.046, 0.056, 0.04, skin]]);
  const legs = [], shins = [], arms = [];
  for (const sx of [-1, 1]) {
    const l = new THREE.Mesh(g_.thigh(), M(thighC)); l.position.set(sx * 0.088, BODY.hip, 0); l.castShadow = true; grp.add(l); legs.push(l);
    const sh = new THREE.Mesh(shin, bodyMat); sh.position.y = -0.32; sh.castShadow = true; l.add(sh); shins.push(sh);
  }
  for (const sx of [-1, 1]) { const a = new THREE.Mesh(arm, bodyMat); a.position.set(sx * (wide + 0.04), BODY.shoulder, 0); a.rotation.z = sx * 0.08; a.castShadow = true; grp.add(a); arms.push(a); }
  const sc = (o.scale ?? 1) * ({ child: 0.64, toddler: 0.46, elder: 0.96, schoolkid: 0.6 }[kind] || 1) * (mono == null ? r.range(0.94, 1.06) : 1);
  grp.scale.setScalar(sc);
  return { g: grp, legs, shins, arms, body, scale: sc, kind, top };
}
// Seated. On a seat the thighs lie along it and the shins hang; on the ground the legs fold. `seat` is the height of the seat's top.
export function sit(p, ground = false, seat = 0.45) {
  p.legs.forEach((l, i) => { l.rotation.x = ground ? -1.42 : -1.5; l.rotation.z = ground ? (i ? 0.42 : -0.42) : 0; }); for (const s of p.shins) s.rotation.x = ground ? 2.05 : 1.45;
  for (const a of p.arms) a.rotation.x = -0.6;
  p.g.position.y += ground ? (0.1 - BODY.hip) * p.scale : seat + (0.075 - BODY.hip) * p.scale; p.seated = true;
}
// One step of a walk: thighs swing, the knee of the leg coming forward bends, arms go the other way.
export function stride(p, phase, amp = 0.55) {
  const s = Math.sin(phase) * amp, c = Math.cos(phase) * amp; p.legs[0].rotation.x = s; p.legs[1].rotation.x = -s; p.shins[0].rotation.x = Math.max(0, -c) * 1.5; p.shins[1].rotation.x = Math.max(0, c) * 1.5;
  if (!p.armsFixed) { p.arms[0].rotation.x = -s * 0.8; p.arms[1].rotation.x = s * 0.8; }
}

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
  if (kind === 'pram') { add('box', r.pick([0x3f5f7f, 0x7a4a5a, 0x4f6a5a]), 0, 0.58, 0.78, 0.46, 0.34, 0.7); add('box', 0x2a2e36, 0, 0.86, 0.6, 0.48, 0.3, 0.36); for (const [x, z] of [[-0.22, 0.52], [0.22, 0.52], [-0.22, 1.04], [0.22, 1.04]]) add(g_.wheel(), 0x2a2e36, x, 0.14, z, 0.4, 0.4, 0.4); add('box', 0x2a2e36, 0, 0.94 * p.scale, 0.48 * p.scale, 0.42, 0.03, 0.03); for (const sx of [-0.2, 0.2]) { const bar = add('box', 0x2a2e36, sx, 0.84, 0.52, 0.025, 0.3, 0.025); bar.rotation.x = -0.5; } p.arms[0].rotation.x = p.arms[1].rotation.x = -1.0; p.armsFixed = true; }
  if (kind === 'scooter') { const hy = (BODY.shoulder - BODY.arm * Math.cos(1.1)) * p.scale, hz = BODY.arm * Math.sin(1.1) * p.scale; add('box', 0xd24d3e, 0, 0.07, 0.08, 0.12, 0.05, 0.75); add('box', 0x9aa3ab, 0, hy / 2 + 0.04, hz, 0.03, hy, 0.03); add('box', 0x2a2e36, 0, hy, hz, 0.3, 0.03, 0.03); for (const dz of [-0.26, 0.42]) add(g_.wheel(), 0x2a2e36, 0, 0.07, dz, 0.2, 0.2, 0.2); p.arms[0].rotation.x = p.arms[1].rotation.x = -1.1; p.armsFixed = true; }
  if (kind === 'bike') {   // wheels, a frame, a saddle, and bars set where the rider's hands come down
    const lean = 0.3, reach = -1.15, sc = p.scale, y0 = 0.88 - BODY.hip * Math.cos(lean) * sc, z0 = -0.2 - BODY.hip * Math.sin(lean) * sc, col = r.pick([0xc0503f, 0x2f6f8f, 0x4f7d5c, 0xe2b23a]);
    const sy = y0 + BODY.shoulder * Math.cos(lean) * sc, sz = z0 + BODY.shoulder * Math.sin(lean) * sc, ay = -Math.cos(reach), az = -Math.sin(reach);
    const hy = sy + BODY.arm * sc * (ay * Math.cos(lean) - az * Math.sin(lean)), hz = sz + BODY.arm * sc * (ay * Math.sin(lean) + az * Math.cos(lean));
    const tube = (y1, z1, y2, z2, c = col, w = 0.045) => { const m = add('box', c, 0, (y1 + y2) / 2, (z1 + z2) / 2, w, Math.hypot(y2 - y1, z2 - z1), w); m.rotation.x = Math.atan2(z2 - z1, y2 - y1); return m; };
    for (const dz of [-0.52, 0.52]) add(g_.wheel(), 0x2a2e36, 0, 0.34, dz);
    tube(0.34, -0.52, 0.84, -0.2); tube(0.36, 0.02, 0.84, -0.2); tube(0.34, -0.52, 0.36, 0.02); tube(0.8, -0.2, 0.86, 0.36); tube(0.36, 0.02, 0.84, 0.36); tube(0.34, 0.52, hy, hz, 0x9aa3ab, 0.035);
    add('box', 0x2a2e36, 0, 0.87, -0.22, 0.13, 0.04, 0.26); add('box', 0x2a2e36, 0, hy, hz, 0.44, 0.03, 0.03);
    p.g.position.set(0, y0, z0); p.g.rotation.x = lean; p.arms[0].rotation.x = p.arms[1].rotation.x = reach; p.armsFixed = true;
  }
  if (kind === 'wheelchair') { sit(p, false, 0.53); for (const sx of [-0.3, 0.3]) add(g_.wheel(), 0x2a2e36, sx, 0.36, -0.05, 1.05, 1.05, 1.05); add('box', 0x3a4250, 0, 0.5, -0.02, 0.5, 0.06, 0.5); add('box', 0x3a4250, 0, 0.82, -0.27, 0.5, 0.6, 0.05); add('box', 0x3a4250, 0, 0.12, 0.42, 0.4, 0.03, 0.16); p.arms[0].rotation.x = p.arms[1].rotation.x = -0.5; p.armsFixed = true; }
  if (kind === 'elder' && r.chance(0.6)) { extra = add('box', 0x6b4a2f, 0.275 * p.scale, 0.33 * p.scale, 0.1, 0.028, 0.68 * p.scale, 0.028); }
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
    if (kind === 'bike') { const a = Math.sin(phase), b = Math.cos(phase); p.legs[0].rotation.x = -1.02 + a * 0.36; p.legs[1].rotation.x = -1.02 - a * 0.36; p.shins[0].rotation.x = 1.2 + b * 0.42; p.shins[1].rotation.x = 1.2 - b * 0.42; }
    else if (kind === 'scooter') { const push = Math.max(0, Math.sin(phase * 0.5)) * moving; p.legs[1].rotation.x = push * 0.9; p.shins[1].rotation.x = push * 0.5; }
    else if (kind !== 'wheelchair') { stride(p, phase, (kind === 'runner' ? 0.9 : 0.5) * moving); p.g.position.y = Math.abs(Math.sin(phase)) * 0.035 * moving; }
    if (extra) extra.rotation.x = Math.sin(phase) * 0.25 * moving;
    if (k.hills.length) g.position.y += k.heightAt(g.position.x, g.position.z);   // up the skirt of a hill, not into it
  });
  return npc;
}

// ---- people who stay put: readers, painters, a busker, tai chi, a gardener ----
function npc(k, x, z, o = {}) {
  const p = makePerson(k, { kind: o.kind || 'adult', top: o.top, pack: o.pack ?? false, scale: o.scale });
  const g = p.g; g.position.set(x, o.y || k.heightAt(x, z), z); let yaw = o.face == null ? k.r.u() * 6.28 : Array.isArray(o.face) ? Math.atan2(o.face[0] - x, o.face[1] - z) : o.face; g.rotation.y = yaw;
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
    const s = new THREE.Mesh(unit, M(C.wood)); s.scale.set(1.9, 0.1, 0.5); s.position.y = 0.4; s.castShadow = true; g.add(s);
    const b = new THREE.Mesh(unit, M(C.wood)); b.scale.set(1.9, 0.42, 0.08); b.position.set(0, 0.72, -0.24); b.castShadow = true; g.add(b);
    for (const sx of [-0.8, 0.8]) { const l = new THREE.Mesh(unit, M(0x3a4250)); l.scale.set(0.08, 0.4, 0.46); l.position.set(sx, 0.2, 0); g.add(l); }
    this.g.add(g); this.mask.rect(x, z, 2, 0.8, rot, 2);
    if (sitter) {
      const fx = Math.sin(rot), fz = Math.cos(rot), cx = Math.cos(rot), cz = -Math.sin(rot), n = this.r.chance(0.35) ? 2 : 1;
      for (let i = 0; i < n; i++) { const o = n === 2 ? (i ? 0.45 : -0.45) : this.r.range(-0.4, 0.4); const who = this.npc(x + cx * o + fx * 0.05, z + cz * o + fz * 0.05, { kind: this.r.chance(0.4) ? 'elder' : 'adult', pose: 'sit', face: rot, role: 'reader', idle: 'read' }); if (i === 0 && this.r.chance(0.7)) { const bk = new THREE.Mesh(unit, M(this.r.pick([0x9a3f3a, 0x2f6f8f, 0x4f7d5c, 0xc98a3a]))); bk.scale.set(0.24, 0.03, 0.18); bk.position.set(0, 0.8, 0.38); bk.rotation.x = -0.5; who.g.add(bk); } }
    }
    return g;
  },
});
export { SKIN, HAIR };
