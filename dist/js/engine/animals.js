// Animals. Each kind is a few simple shapes in natural proportions, and each moves the way the animal does:
// ducks paddle and dabble, songbirds hop and scatter, squirrels dash and freeze, deer graze and look up.
import * as THREE from 'three';
import { Kit, G, M, WILD, LAWN, PAVED, WATER } from './kit.js';

const ell = () => G('a-ell', () => new THREE.IcosahedronGeometry(1, 1));
const cone = () => G('a-cone', () => new THREE.ConeGeometry(1, 1, 6));
const cyl = () => G('a-cyl', () => new THREE.CylinderGeometry(1, 1, 1, 5));
const box = () => G('box', () => new THREE.BoxGeometry(1, 1, 1));
const wingGeo = () => G('a-wing', () => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0.5, 0, 0, -0.5, 1, 0, -0.1], 3)); g.computeVertexNormals(); return g; });
const hitMat = new THREE.MeshBasicMaterial({ visible: false });
const P = (geo, color, x, y, z, sx, sy, sz, rx = 0, ry = 0, rz = 0, o) => { const m = new THREE.Mesh(geo, M(color, o)); m.position.set(x, y, z); m.scale.set(sx, sy, sz); m.rotation.set(rx, ry, rz); m.castShadow = true; return m; };
const wrap = (d) => { while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; return d; };

function reg(k, g, species, r = 0.9, extra = {}) {
  const hit = new THREE.Mesh(G('a-hit', () => new THREE.IcosahedronGeometry(1, 0)), hitMat); hit.scale.setScalar(r); hit.position.y = r * 0.6; g.add(hit);
  const rec = { g, species, ...extra }; hit.userData.pick = { type: 'animal', animal: rec }; k.picks.push(hit); k.fauna.push(rec); k.g.add(g); return rec;
}
function wander(k, g, o) {
  let tx = g.position.x, tz = g.position.z, wait = k.r.range(0, 3), yaw = k.r.u() * 6.28, v = 0, flee = 0;
  const target = (away) => {
    for (let i = 0; i < 14; i++) {
      let x, z; const a = k.r.u() * 6.28, d = k.r.range(0.25, 1) * o.range;
      if (away) { const ax = g.position.x - k.player.x, az = g.position.z - k.player.z, L = Math.hypot(ax, az) || 1; x = g.position.x + (ax / L) * o.range * 0.9 + k.r.range(-1.5, 1.5); z = g.position.z + (az / L) * o.range * 0.9 + k.r.range(-1.5, 1.5); }
      else { x = o.home[0] + Math.cos(a) * d; z = o.home[1] + Math.sin(a) * d; }
      if (o.ok(x, z)) { tx = x; tz = z; return true; }
    }
    return false;
  };
  g.rotation.y = yaw;
  k.anim.push((t, dt) => {
    const px = g.position.x, pz = g.position.z, near = Math.hypot(k.player.x - px, k.player.z - pz);
    if (o.flee && near < o.flee && flee <= 0 && target(true)) { flee = 2.6; wait = 0; }
    if (flee > 0) flee -= dt;
    const dx = tx - px, dz = tz - pz, L = Math.hypot(dx, dz); let moving = false;
    if (wait > 0) { wait -= dt; v += (0 - v) * Math.min(1, dt * 5); }
    else if (L < 0.18) { wait = k.r.range(o.pause[0], o.pause[1]); target(false); }
    else { moving = true; const sp = o.speed * (flee > 0 ? (o.fleeSpeed || 2.4) : 1); v += (sp - v) * Math.min(1, dt * 3); yaw += wrap(Math.atan2(dx, dz) - yaw) * Math.min(1, dt * (o.turn || 4)); const st = Math.min(L, v * dt); const nx = px + Math.sin(yaw) * st, nz = pz + Math.cos(yaw) * st; if (o.ok(nx, nz)) { g.position.x = nx; g.position.z = nz; } else { wait = 0.2; target(false); } g.rotation.y = yaw; }
    if (o.tick) o.tick(t, dt, moving, v / o.speed, near, flee > 0, wait);
  });
}
const onWater = (k) => (x, z) => k.mask.get(x, z) === WATER && k.mask.get(x + 0.7, z) === WATER && k.mask.get(x - 0.7, z) === WATER && k.mask.get(x, z + 0.7) === WATER && k.mask.get(x, z - 0.7) === WATER && Math.abs(x) < k.size / 2 - 1.5 && Math.abs(z) < k.size / 2 - 1.5;
const onGrass = (k) => (x, z) => { const v = k.mask.get(x, z); return (v === WILD || v === LAWN) && !k.blocked(x, z); };
const onGround = (k) => (x, z) => { const v = k.mask.get(x, z); return (v === WILD || v === LAWN || v === PAVED) && !k.blocked(x, z); };

// ---------- water birds ----------
function duckBody(kind) {
  const g = new THREE.Group(), drake = kind === 'drake', small = kind === 'duckling', body = small ? 0xf2d04a : drake ? 0xb9b2a4 : 0x8a6a4a;
  g.add(P(ell(), body, 0, 0.16, 0, 0.2, 0.15, 0.32)); g.add(P(cone(), small ? 0xf2d04a : drake ? 0x3a3a3a : 0x6f5238, 0, 0.2, -0.34, 0.1, 0.2, 0.1, -1.2));
  const neck = new THREE.Group(); neck.position.set(0, 0.22, 0.22); g.add(neck);
  neck.add(P(ell(), small ? 0xf2d04a : drake ? 0x1f5a45 : 0x8a6a4a, 0, 0.16, 0.04, 0.11, 0.12, 0.12)); neck.add(P(cone(), 0xe0a03a, 0, 0.14, 0.2, 0.05, 0.14, 0.05, Math.PI / 2));
  if (drake) neck.add(P(cyl(), 0xf4f2ec, 0, 0.05, 0.02, 0.085, 0.03, 0.085));
  if (!small) g.add(P(ell(), drake ? 0x6b6f7a : 0x6f5238, 0, 0.2, -0.04, 0.17, 0.08, 0.24));
  if (small) g.scale.setScalar(0.5);
  return { g, neck };
}
function ducks(k, area, n = 2, withBrood = false) {
  const ok = onWater(k), out = [];
  for (let i = 0; i < n; i++) {
    const d = duckBody(i % 2 ? 'hen' : 'drake'); let x = area.x, z = area.z; for (let t = 0; t < 20; t++) { const a = k.r.u() * 6.28, q = Math.sqrt(k.r.u()); x = area.x + Math.cos(a) * area.rx * q; z = area.z + Math.sin(a) * area.rz * q; if (ok(x, z)) break; }
    if (!ok(x, z)) continue;
    d.g.position.set(x, 0.03, z); let dab = 0; const ph = k.r.u() * 6;
    wander(k, d.g, { home: [area.x, area.z], range: Math.max(1.5, Math.min(area.rx, area.rz) * 1.2), speed: 0.55, pause: [1, 5], ok, turn: 2,
      tick: (t, dt, moving, f, near, fl, wait) => { d.g.position.y = 0.03 + Math.sin(t * 1.8 + ph) * 0.015; if (!moving && dab <= 0 && k.r.chance(dt * 0.12)) dab = 1.8; if (dab > 0) { dab -= dt; d.neck.rotation.x = Math.sin(Math.min(1, (1.8 - dab) * 2) * Math.PI * 0.5) * 1.5 * (dab > 0.3 ? 1 : dab / 0.3); } else d.neck.rotation.x = Math.sin(t * 0.7 + ph) * 0.06; } });
    out.push(reg(k, d.g, i % 2 ? 'mallard hen' : 'mallard drake', 0.7));
    if (withBrood && i % 2) { let lead = d.g; for (let j = 0; j < 4; j++) { const c = duckBody('duckling'); c.g.position.copy(d.g.position); const follow = lead, lag = 0.42; k.anim.push((t, dt) => { const dx = follow.position.x - c.g.position.x, dz = follow.position.z - c.g.position.z, L = Math.hypot(dx, dz); if (L > lag) { const st = Math.min(L - lag, dt * 1.4); c.g.position.x += (dx / L) * st; c.g.position.z += (dz / L) * st; c.g.rotation.y = Math.atan2(dx, dz); } c.g.position.y = 0.03 + Math.sin(t * 3 + j) * 0.012; }); reg(k, c.g, 'duckling', 0.5); lead = c.g; } }
  }
  return out;
}
function swan(k, area) {
  const ok = onWater(k); if (!ok(area.x, area.z)) return null; const g = new THREE.Group();
  g.add(P(ell(), 0xfaf8f2, 0, 0.24, 0, 0.3, 0.22, 0.5)); g.add(P(ell(), 0xfaf8f2, 0, 0.34, -0.12, 0.26, 0.16, 0.34, 0.2));
  const neck = new THREE.Group(); neck.position.set(0, 0.3, 0.38); g.add(neck);
  neck.add(P(cyl(), 0xfaf8f2, 0, 0.26, 0.05, 0.055, 0.5, 0.055, 0.25)); neck.add(P(cyl(), 0xfaf8f2, 0, 0.56, 0.2, 0.05, 0.28, 0.05, 1.1)); neck.add(P(ell(), 0xfaf8f2, 0, 0.6, 0.36, 0.08, 0.075, 0.1)); neck.add(P(cone(), 0xe07b22, 0, 0.57, 0.5, 0.04, 0.14, 0.04, Math.PI / 2 + 0.3));
  g.position.set(area.x, 0.03, area.z);
  wander(k, g, { home: [area.x, area.z], range: Math.max(2, Math.min(area.rx, area.rz) * 1.3), speed: 0.4, pause: [2, 7], ok, turn: 1.4, tick: (t) => { g.position.y = 0.03 + Math.sin(t * 1.2) * 0.012; neck.rotation.x = Math.sin(t * 0.4) * 0.08; } });
  return reg(k, g, 'swan', 0.9);
}
function heron(k, x, z, face = 0) {
  const g = new THREE.Group(), c = 0x9aa7b5;
  for (const s of [-0.06, 0.06]) g.add(P(cyl(), 0x8a7a52, s, 0.35, 0, 0.018, 0.7, 0.018));
  g.add(P(ell(), c, 0, 0.82, -0.05, 0.14, 0.14, 0.3, 0.5));
  const neck = new THREE.Group(); neck.position.set(0, 0.92, 0.12); g.add(neck);
  neck.add(P(cyl(), 0xdfe6ea, 0, 0.2, 0.03, 0.035, 0.42, 0.035, 0.2)); neck.add(P(ell(), 0xdfe6ea, 0, 0.44, 0.1, 0.06, 0.055, 0.09)); neck.add(P(cone(), 0xe0a03a, 0, 0.43, 0.3, 0.025, 0.3, 0.025, Math.PI / 2));
  g.position.set(x, 0, z); g.rotation.y = face; const ph = k.r.u() * 6;
  k.anim.push((t) => { neck.rotation.y = Math.sin(t * 0.23 + ph) * 0.5; neck.rotation.x = Math.max(0, Math.sin(t * 0.11 + ph)) > 0.97 ? 0.9 : 0; });
  return reg(k, g, 'heron', 1);
}
function goose(k, x, z) {
  const g = new THREE.Group(); for (const s of [-0.07, 0.07]) g.add(P(cyl(), 0x3a3a3a, s, 0.12, 0, 0.02, 0.24, 0.02));
  g.add(P(ell(), 0x8a7a66, 0, 0.36, 0, 0.17, 0.15, 0.3)); g.add(P(ell(), 0xf4f2ec, 0, 0.34, -0.22, 0.1, 0.09, 0.12));
  const neck = new THREE.Group(); neck.position.set(0, 0.42, 0.2); g.add(neck); neck.add(P(cyl(), 0x26262a, 0, 0.17, 0.02, 0.04, 0.34, 0.04, 0.15)); neck.add(P(ell(), 0x26262a, 0, 0.36, 0.07, 0.06, 0.055, 0.08)); neck.add(P(cone(), 0x26262a, 0, 0.35, 0.18, 0.025, 0.1, 0.025, Math.PI / 2)); neck.add(P(box(), 0xf4f2ec, 0, 0.33, 0.06, 0.125, 0.04, 0.05));
  g.position.set(x, 0, z); const ph = k.r.u() * 6;
  wander(k, g, { home: [x, z], range: 5, speed: 0.5, pause: [2, 8], ok: onGrass(k), flee: 2.2, fleeSpeed: 3, tick: (t, dt, moving, f) => { neck.rotation.x = moving ? Math.sin(t * 6) * 0.08 : (Math.sin(t * 0.6 + ph) > 0.2 ? 1.25 + Math.sin(t * 5) * 0.1 : 0); g.position.y = moving ? Math.abs(Math.sin(t * 7)) * 0.02 : 0; g.rotation.z = moving ? Math.sin(t * 7) * 0.06 : 0; } });
  return reg(k, g, 'goose', 0.8);
}

// ---------- small birds on the ground: they hop, peck, and lift off when you come close ----------
function birdBody(kind) {
  const g = new THREE.Group(), c = { sparrow: [0x8a6a4a, 0xd9c7a8], robin: [0x6f5a48, 0xd9642b], tit: [0x4a7fb5, 0xf2d04a], pigeon: [0x8f949c, 0x6f7480], blackbird: [0x26262a, 0x26262a], gull: [0xf4f2ec, 0xb9bfc6] }[kind], s = kind === 'pigeon' || kind === 'gull' ? 1.5 : 1;
  g.add(P(ell(), c[0], 0, 0.1, 0, 0.075, 0.07, 0.11)); g.add(P(ell(), c[1], 0, 0.085, 0.05, 0.062, 0.058, 0.07)); g.add(P(ell(), c[0], 0, 0.17, 0.08, 0.05, 0.05, 0.055));
  g.add(P(cone(), kind === 'blackbird' ? 0xe0a03a : 0x3a3a3a, 0, 0.17, 0.15, 0.016, 0.05, 0.016, Math.PI / 2)); g.add(P(box(), c[0], 0, 0.11, -0.14, 0.05, 0.012, 0.1, 0.3));
  const wings = []; for (const sx of [-1, 1]) { const w = new THREE.Mesh(wingGeo(), M(kind === 'gull' ? 0xb9bfc6 : c[0], { side: THREE.DoubleSide })); w.scale.set(sx * 0.2 * (kind === 'gull' ? 1.6 : 1), 1, 0.14); w.position.set(sx * 0.05, 0.13, 0); w.visible = false; g.add(w); wings.push(w); }
  g.scale.setScalar(s); return { g, wings };
}
function songbirds(k, x, z, n = 4, kind = 'sparrow') {
  const ok = onGround(k);
  for (let i = 0; i < n; i++) {
    const b = birdBody(kind), g = b.g, hx = x + k.r.range(-1.6, 1.6), hz = z + k.r.range(-1.6, 1.6); if (!ok(hx, hz)) continue;
    g.position.set(hx, 0, hz); let state = 'ground', timer = k.r.range(0.2, 2), yaw = k.r.u() * 6.28, tx = hx, tz = hz, fy = 0, ang = k.r.u() * 6.28; const ph = k.r.u() * 6;
    k.anim.push((t, dt) => {
      const near = Math.hypot(k.player.x - g.position.x, k.player.z - g.position.z);
      if (state === 'ground') {
        if (near < 3.2) { state = 'up'; timer = k.r.range(5, 9); for (const w of b.wings) w.visible = true; return; }
        timer -= dt; g.position.y = Math.max(0, Math.sin(Math.min(1, (0.28 - Math.min(0.28, timer)) / 0.28) * Math.PI) * 0.09);
        if (timer <= 0) { timer = k.r.range(0.5, 2.6); if (k.r.chance(0.65)) { const a = k.r.u() * 6.28, d = k.r.range(0.2, 0.6), nx = g.position.x + Math.cos(a) * d, nz = g.position.z + Math.sin(a) * d; if (ok(nx, nz) && Math.hypot(nx - hx, nz - hz) < 3) { tx = nx; tz = nz; yaw = Math.atan2(tx - g.position.x, tz - g.position.z); } } }
        g.position.x += (tx - g.position.x) * Math.min(1, dt * 8); g.position.z += (tz - g.position.z) * Math.min(1, dt * 8); g.rotation.y = yaw; g.rotation.x = Math.sin(t * 9 + ph) > 0.86 ? 0.7 : 0;
      } else {
        timer -= dt; ang += dt * 1.6; const landing = state === 'down';
        fy += ((landing ? 0 : 4.5 + Math.sin(t + ph)) - fy) * Math.min(1, dt * (landing ? 1.6 : 1.3));
        const cx = hx + (landing ? 0 : Math.cos(ang) * 3.5), cz = hz + (landing ? 0 : Math.sin(ang) * 3.5), dx = cx - g.position.x, dz = cz - g.position.z;
        g.position.x += dx * Math.min(1, dt * 1.5); g.position.z += dz * Math.min(1, dt * 1.5); g.position.y = fy; g.rotation.y = Math.atan2(dx, dz); g.rotation.x = 0;
        for (let j = 0; j < 2; j++) b.wings[j].rotation.z = (j ? -1 : 1) * Math.sin(t * 22 + ph) * 0.9;
        if (state === 'up' && timer <= 0 && near > 6) state = 'down';
        if (landing && fy < 0.06) { state = 'ground'; g.position.y = 0; tx = g.position.x; tz = g.position.z; for (const w of b.wings) w.visible = false; timer = 1; }
      }
    });
    reg(k, g, kind, 0.6);
  }
}
// birds in the sky: a loose flock that circles, or a V of geese crossing in the fall
function flock(k, x, y, z, n = 5, rad = 9, kind = 'far') {
  for (let i = 0; i < n; i++) {
    const g = new THREE.Group(); g.add(P(ell(), kind === 'gull' ? 0xf4f2ec : 0x3a4250, 0, 0, 0, 0.07, 0.06, 0.2)); const wings = [];
    for (const sx of [-1, 1]) { const w = new THREE.Mesh(wingGeo(), M(kind === 'gull' ? 0xcfd6dc : 0x3a4250, { side: THREE.DoubleSide })); w.scale.set(sx * 0.5, 1, 0.22); g.add(w); wings.push(w); }
    k.g.add(g); const ph = k.r.u() * 6, rr = rad * k.r.range(0.6, 1.25), sp = k.r.range(0.18, 0.32), hy = y + k.r.range(-1.5, 2);
    k.anim.push((t) => { const a = t * sp + ph; g.position.set(x + Math.cos(a) * rr, hy + Math.sin(t * 0.7 + ph) * 0.6, z + Math.sin(a) * rr * 0.8); g.rotation.y = -a + Math.PI; g.rotation.z = -0.25; const fl = Math.sin(t * 5 + ph) > -0.3 ? Math.sin(t * 9 + ph) * 0.7 : 0.15; wings[0].rotation.z = fl; wings[1].rotation.z = -fl; });
  }
}
function vee(k) { // geese heading south
  const g = new THREE.Group(), wings = [];
  for (let i = 0; i < 7; i++) { const b = new THREE.Group(), s = i === 0 ? 0 : (i % 2 ? 1 : -1) * Math.ceil(i / 2); b.position.set(s * 1.1, 0, -Math.abs(s) * 1.2); b.add(P(ell(), 0x4a4a4a, 0, 0, 0, 0.09, 0.07, 0.3)); for (const sx of [-1, 1]) { const w = new THREE.Mesh(wingGeo(), M(0x5a5a5a, { side: THREE.DoubleSide })); w.scale.set(sx * 0.6, 1, 0.26); b.add(w); wings.push([w, sx, i]); } g.add(b); }
  k.g.add(g); let x = -70; const zz = k.r.range(-12, 12);
  k.anim.push((t, dt) => { x += dt * 2.6; if (x > 70) x = -110; g.position.set(x, 27, zz + x * 0.12); g.rotation.y = Math.PI / 2 - 0.12; for (const [w, sx, i] of wings) w.rotation.z = sx * Math.sin(t * 6 + i * 0.5) * 0.6; });
}

// ---------- small mammals ----------
function squirrel(k, spot, color = 0x8a5a3a) {
  const g = new THREE.Group(); g.add(P(ell(), color, 0, 0.13, 0, 0.08, 0.09, 0.16)); g.add(P(ell(), color, 0, 0.2, 0.13, 0.06, 0.06, 0.07)); for (const s of [-1, 1]) g.add(P(cone(), color, s * 0.035, 0.27, 0.12, 0.018, 0.05, 0.018));
  const tail = new THREE.Group(); tail.position.set(0, 0.14, -0.14); g.add(tail); tail.add(P(ell(), color, 0, 0.12, -0.05, 0.06, 0.16, 0.07, -0.5)); tail.add(P(ell(), new THREE.Color(color).offsetHSL(0, 0, 0.12).getHex(), 0, 0.26, -0.03, 0.055, 0.09, 0.06, 0.4));
  g.position.set(spot.x + 0.8, 0, spot.z + 0.5); const ph = k.r.u() * 6;
  wander(k, g, { home: [spot.x, spot.z], range: 5, speed: 2.6, pause: [1.5, 6], ok: onGround(k), flee: 2.4, fleeSpeed: 1.8, turn: 9, tick: (t, dt, moving) => { g.position.y = moving ? Math.abs(Math.sin(t * 16)) * 0.08 : 0; tail.rotation.x = moving ? -0.9 : Math.sin(t * 5 + ph) * 0.12; g.rotation.x = !moving && Math.sin(t * 0.5 + ph) > 0.5 ? -0.55 : 0; } });
  return reg(k, g, color === 0x26262a ? 'black squirrel' : 'squirrel', 0.6);
}
function rabbit(k, x, z) {
  const g = new THREE.Group(), c = k.r.pick([0x9a8468, 0x8a7a66, 0xb9a98a]); g.add(P(ell(), c, 0, 0.13, 0, 0.1, 0.11, 0.17)); g.add(P(ell(), c, 0, 0.23, 0.13, 0.07, 0.07, 0.08)); for (const s of [-1, 1]) g.add(P(ell(), c, s * 0.03, 0.36, 0.1, 0.02, 0.09, 0.03)); g.add(P(ell(), 0xf4f2ec, 0, 0.13, -0.17, 0.045, 0.045, 0.045));
  g.position.set(x, 0, z);
  wander(k, g, { home: [x, z], range: 4.5, speed: 1.5, pause: [2, 9], ok: onGrass(k), flee: 3.2, fleeSpeed: 3.2, turn: 7, tick: (t, dt, moving) => { g.position.y = moving ? Math.abs(Math.sin(t * 9)) * 0.16 : 0; g.rotation.x = moving ? -Math.cos(t * 9) * 0.2 : 0; } });
  return reg(k, g, 'rabbit', 0.6);
}
function cat(k, x, z) {
  const g = new THREE.Group(), c = k.r.pick([0x3a3a3a, 0xd9742b, 0xcfc7b8, 0x8a8a8a, 0xf4f2ec]); g.add(P(ell(), c, 0, 0.17, -0.02, 0.1, 0.15, 0.13)); g.add(P(ell(), c, 0, 0.36, 0.07, 0.08, 0.075, 0.08)); for (const s of [-1, 1]) g.add(P(cone(), c, s * 0.045, 0.45, 0.07, 0.025, 0.06, 0.025));
  const tail = new THREE.Group(); tail.position.set(0, 0.06, -0.12); g.add(tail); tail.add(P(cyl(), c, 0, 0.02, -0.12, 0.022, 0.26, 0.022, Math.PI / 2));
  g.position.set(x, 0, z); let yaw = k.r.u() * 6.28;
  k.anim.push((t, dt) => { const near = Math.hypot(k.player.x - x, k.player.z - z); if (near < 9) yaw += wrap(Math.atan2(k.player.x - x, k.player.z - z) - yaw) * Math.min(1, dt * 2); g.rotation.y = yaw; tail.rotation.y = Math.sin(t * 1.7) * 0.7; });
  return reg(k, g, 'cat', 0.7);
}
function dog(k, owner) { // on a lead beside its person
  const g = new THREE.Group(), c = k.r.pick([0x8a6a4a, 0xd9c7a8, 0x3d3a37, 0xf4f2ec, 0xb07a4a]), s = k.r.range(0.75, 1.15);
  g.add(P(ell(), c, 0, 0.3, 0, 0.12, 0.13, 0.28)); const head = P(ell(), c, 0, 0.42, 0.28, 0.095, 0.09, 0.11); g.add(head); g.add(P(ell(), c, 0, 0.39, 0.39, 0.05, 0.045, 0.07)); for (const sx of [-1, 1]) g.add(P(ell(), new THREE.Color(c).offsetHSL(0, 0, -0.08).getHex(), sx * 0.085, 0.44, 0.24, 0.03, 0.07, 0.04));
  const legs = []; for (const [lx, lz] of [[-0.07, 0.17], [0.07, 0.17], [-0.07, -0.17], [0.07, -0.17]]) { const l = new THREE.Mesh(G('a-leg', () => new THREE.CylinderGeometry(0.03, 0.025, 0.22, 4).translate(0, -0.11, 0)), M(c)); l.position.set(lx, 0.22, lz); g.add(l); legs.push(l); }
  const tail = new THREE.Group(); tail.position.set(0, 0.36, -0.26); g.add(tail); tail.add(P(cyl(), c, 0, 0.08, -0.03, 0.02, 0.2, 0.02, -0.5));
  g.scale.setScalar(s); const lead = P(cyl(), 0x6b4a2f, 0, 0, 0, 0.012, 1, 0.012); k.g.add(lead);
  g.position.copy(owner.g.position); let yaw = 0; const side = k.r.chance(0.5) ? 1 : -1, ph = k.r.u() * 6;
  k.anim.push((t, dt) => {
    const o = owner.g, fx = Math.sin(o.rotation.y), fz = Math.cos(o.rotation.y), tx = o.position.x + fz * side * 0.7 + fx * 0.5, tz = o.position.z - fx * side * 0.7 + fz * 0.5, dx = tx - g.position.x, dz = tz - g.position.z, L = Math.hypot(dx, dz), moving = L > 0.12;
    if (moving) { const st = Math.min(L, dt * 2.4); g.position.x += (dx / L) * st; g.position.z += (dz / L) * st; yaw += wrap(Math.atan2(dx, dz) - yaw) * Math.min(1, dt * 6); }
    g.rotation.y = yaw; const sw = moving ? Math.sin(t * 13 + ph) * 0.55 : 0; legs[0].rotation.x = sw; legs[3].rotation.x = sw; legs[1].rotation.x = -sw; legs[2].rotation.x = -sw; tail.rotation.y = Math.sin(t * 9) * 0.6; head.position.y = 0.42 + (moving ? 0 : Math.sin(t * 0.8 + ph) * 0.02);
    const hx = o.position.x + fz * side * 0.3, hz = o.position.z - fx * side * 0.3, cx = g.position.x, cz = g.position.z, LL = Math.hypot(hx - cx, 0.3, hz - cz); lead.position.set((hx + cx) / 2, 0.53, (hz + cz) / 2); lead.scale.y = LL; lead.lookAt(hx, 0.68, hz); lead.rotateX(Math.PI / 2);
  });
  return reg(k, g, 'dog', 0.7, { owner });
}
function deer(k, x, z, stag = false) {
  const g = new THREE.Group(), c = 0x9a7a55; g.add(P(ell(), c, 0, 0.82, 0, 0.2, 0.2, 0.46)); g.add(P(ell(), 0xf4f2ec, 0, 0.8, -0.42, 0.09, 0.1, 0.08));
  for (const [lx, lz] of [[-0.11, 0.3], [0.11, 0.3], [-0.11, -0.3], [0.11, -0.3]]) g.add(P(cyl(), 0x7a6045, lx, 0.33, lz, 0.028, 0.66, 0.028));
  const neck = new THREE.Group(); neck.position.set(0, 0.92, 0.36); g.add(neck);
  neck.add(P(cyl(), c, 0, 0.2, 0.06, 0.07, 0.46, 0.07, 0.35)); neck.add(P(ell(), c, 0, 0.46, 0.2, 0.08, 0.08, 0.14)); for (const s of [-1, 1]) neck.add(P(ell(), c, s * 0.1, 0.55, 0.14, 0.025, 0.07, 0.04, 0, 0, s * 0.6));
  if (stag) for (const s of [-1, 1]) { neck.add(P(cyl(), 0xcbbd98, s * 0.06, 0.68, 0.14, 0.012, 0.28, 0.012, 0, 0, s * -0.35)); neck.add(P(cyl(), 0xcbbd98, s * 0.13, 0.76, 0.17, 0.01, 0.14, 0.01, 0.8, 0, s * -0.6)); }
  g.position.set(x, 0, z); const ph = k.r.u() * 6;
  wander(k, g, { home: [x, z], range: 6, speed: 0.7, pause: [4, 12], ok: onGrass(k), flee: 4.2, fleeSpeed: 4, turn: 3, tick: (t, dt, moving, f, near, fl) => { const alert = near < 10 || fl; const want = moving || alert ? 0 : (Math.sin(t * 0.35 + ph) > -0.2 ? 1.5 : 0.1); neck.rotation.x += (want - neck.rotation.x) * Math.min(1, dt * 2.5); g.position.y = moving ? Math.abs(Math.sin(t * (fl ? 10 : 5))) * (fl ? 0.14 : 0.03) : 0; } });
  return reg(k, g, stag ? 'stag' : 'deer', 1.1);
}
function sheep(k, x, z) {
  const g = new THREE.Group(); g.add(P(ell(), 0xefe9dc, 0, 0.42, 0, 0.24, 0.2, 0.34)); for (const [lx, lz] of [[-0.12, 0.2], [0.12, 0.2], [-0.12, -0.2], [0.12, -0.2]]) g.add(P(cyl(), 0x3a3a3a, lx, 0.13, lz, 0.03, 0.26, 0.03));
  const head = new THREE.Group(); head.position.set(0, 0.48, 0.32); g.add(head); head.add(P(ell(), 0x3a3a3a, 0, 0, 0.08, 0.08, 0.08, 0.12)); g.position.set(x, 0, z); const ph = k.r.u() * 6;
  wander(k, g, { home: [x, z], range: 4, speed: 0.35, pause: [5, 14], ok: onGrass(k), tick: (t, dt, moving) => { head.rotation.x += ((moving ? 0 : 0.9) - head.rotation.x) * Math.min(1, dt * 2); } });
  return reg(k, g, 'sheep', 0.9);
}
// ---------- insects and fish ----------
function butterflies(k, x, z, n = 4) {
  if (k.seasonName !== 'spring' && k.seasonName !== 'summer') return;
  for (let i = 0; i < n; i++) { const g = new THREE.Group(), col = k.r.pick([0xf2d04a, 0xf4f2ec, 0xe8745a, 0x8fa9e8, 0xf08a5a]), wings = []; for (const sx of [-1, 1]) { const w = new THREE.Mesh(wingGeo(), M(col, { side: THREE.DoubleSide })); w.scale.set(sx * 0.13, 1, 0.16); g.add(w); wings.push(w); } k.g.add(g); const ph = k.r.u() * 20, hx = x + k.r.range(-2, 2), hz = z + k.r.range(-2, 2);
    k.anim.push((t) => { const a = t * 0.5 + ph; g.position.set(hx + Math.sin(a) * 1.6 + Math.sin(a * 2.7) * 0.5, 0.7 + Math.sin(a * 3.1) * 0.35 + Math.sin(t * 6 + ph) * 0.05, hz + Math.cos(a * 0.8) * 1.6 + Math.cos(a * 2.3) * 0.5); g.rotation.y = a; const f = Math.sin(t * 16 + ph) * 1.1; wings[0].rotation.z = f; wings[1].rotation.z = -f; }); }
}
function fishJumps(k, area) {
  const fish = P(ell(), 0x9aa7b5, 0, -1, 0, 0.06, 0.08, 0.2, 0, 0, 0, { metalness: 0.4, roughness: 0.3 }); k.g.add(fish);
  const ring = new THREE.Mesh(G('a-ring', () => new THREE.RingGeometry(0.8, 1, 20).rotateX(-Math.PI / 2)), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 })); k.g.add(ring); k.own.push(ring.material);
  let next = k.r.range(4, 12), t0 = -9, x = 0, z = 0, dir = 0; const ok = onWater(k);
  k.anim.push((t) => {
    if (t > next) { for (let i = 0; i < 10; i++) { const a = k.r.u() * 6.28, q = Math.sqrt(k.r.u()); x = area.x + Math.cos(a) * area.rx * q; z = area.z + Math.sin(a) * area.rz * q; if (ok(x, z)) { t0 = t; dir = k.r.u() * 6.28; break; } } next = t + k.r.range(9, 24); }
    const u = (t - t0) / 0.9;
    if (u >= 0 && u <= 1) { fish.position.set(x + Math.sin(dir) * (u - 0.5) * 0.9, Math.sin(u * Math.PI) * 0.5 - 0.05, z + Math.cos(dir) * (u - 0.5) * 0.9); fish.rotation.set(-Math.cos(u * Math.PI) * 1.1, dir, 0); } else fish.position.y = -1;
    const w = (t - t0 - 0.75) / 1.6; if (w >= 0 && w <= 1) { ring.position.set(x + Math.sin(dir) * 0.4, 0.07, z + Math.cos(dir) * 0.4); ring.scale.setScalar(0.2 + w * 1.1); ring.material.opacity = (1 - w) * 0.6; } else ring.material.opacity = 0;
  });
}

Object.assign(Kit.prototype, {
  ducks(area, n, brood) { return ducks(this, area, n, brood); }, swan(area) { return swan(this, area); }, heron(x, z, f) { return heron(this, x, z, f); }, goose(x, z) { return goose(this, x, z); },
  songbirds(x, z, n, kind) { return songbirds(this, x, z, n, kind); }, flock(x, y, z, n, rad, kind) { return flock(this, x, y, z, n, rad, kind); }, vee() { return vee(this); },
  birds(x, y, z, n = 5, rad = 9) { return flock(this, x, y, z, n, rad); },
  squirrel(spot, c) { return squirrel(this, spot, c); }, rabbit(x, z) { return rabbit(this, x, z); }, cat(x, z) { return cat(this, x, z); }, dog(owner) { return dog(this, owner); },
  deer(x, z, stag) { return deer(this, x, z, stag); }, sheep(x, z) { return sheep(this, x, z); }, butterflies(x, z, n) { return butterflies(this, x, z, n); }, fishJumps(area) { return fishJumps(this, area); },
});
export { onGrass, onGround, onWater };
