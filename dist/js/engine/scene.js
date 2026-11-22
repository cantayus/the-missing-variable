// The 3D stage: one renderer, an orbit camera the player turns, the walking student, and the things you can walk up to.
import * as THREE from 'three';
import { Kit, SEASONS, C, isShared, WATER } from './kit.js';
import { makePerson, stride, BODY } from './people.js';
import './animals.js';
import { scatter, airborne } from './nature.js';
import { clamp, lerp, el, clear } from '../core/util.js';

const W = {
  ok: false, renderer: null, scene: null, camera: null, world: null, actors: null, kit: null,
  az: 0.7, pol: 1.0, dist: 122, target: new THREE.Vector3(0, 2, 0), auto: false,
  hour: 9, season: 'fall', handlers: {}, markers: [], labelsEl: null, labelNodes: [],
  avatar: null, folio: null, wren: null, goal: null, onArrive: null, t: 0, last: 0, motion: true, you: null, youOn: true, wind: { value: 0 },
  ray: new THREE.Raycaster(), ground: new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), keys: {}, held: null, stuck: 0,
};

export function initWorld(canvas, labelsEl, { gfx = 2 } = {}) {
  try { W.renderer = new THREE.WebGLRenderer({ canvas, antialias: gfx > 0, alpha: true, powerPreference: 'high-performance' }); }
  catch (e) { W.ok = false; return false; }
  W.ok = true; W.canvas = canvas; W.labelsEl = labelsEl; W.gfx = gfx;
  W.scale = 1; applyResolution();
  W.renderer.shadowMap.enabled = gfx > 0; W.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  W.renderer.outputColorSpace = THREE.SRGBColorSpace;
  // Neutral tone mapping keeps colours as bright and as saturated as they were painted. The filmic curve used before greyed them.
  W.renderer.toneMapping = THREE.NeutralToneMapping; W.renderer.toneMappingExposure = 1.0;
  W.scene = new THREE.Scene();
  W.camera = new THREE.PerspectiveCamera(30, 1, 1, 700);
  // Three lights: a warm sky with warm light coming back off the ground, the sun, and a soft fill from the side the sun is not on,
  // so that no wall the camera can see is left dull and shadows on the ground are never heavy.
  W.hemi = new THREE.HemisphereLight(0xfff6ea, 0xbfb08c, 0.9); W.scene.add(W.hemi);
  W.fill = new THREE.DirectionalLight(0xffe6d2, 0.4); W.scene.add(W.fill); W.scene.add(W.fill.target);
  W.sun = new THREE.DirectionalLight(0xfff0d6, 2.0); W.sun.castShadow = gfx > 0;
  const sm = gfx === 2 ? Math.min(4096, W.renderer.capabilities.maxTextureSize) : 1024; W.sun.shadow.mapSize.set(sm, sm);
  const sc = W.sun.shadow.camera; sc.left = -48; sc.right = 48; sc.top = 48; sc.bottom = -48; sc.near = 10; sc.far = 240; W.sun.shadow.bias = -0.0005; W.sun.shadow.normalBias = 0.05;
  W.scene.add(W.sun); W.scene.add(W.sun.target);
  W.world = new THREE.Group(); W.actors = new THREE.Group(); W.scene.add(W.world, W.actors);
  makeEnv();
  resize(); window.addEventListener('resize', resize);
  bindInput(canvas);
  W.last = performance.now(); requestAnimationFrame(loop);
  return true;
}
// A plain sky for glass and water to reflect: pale at the horizon, blue overhead, a warm patch for the sun.
function makeEnv() {
  const pm = new THREE.PMREMGenerator(W.renderer), sc = new THREE.Scene(), geo = new THREE.SphereGeometry(50, 24, 14), p = geo.attributes.position, col = [];
  const top = new THREE.Color(0x9cc8ea), mid = new THREE.Color(0xfff2e0), bot = new THREE.Color(0xb9ae8c), c = new THREE.Color();
  for (let i = 0; i < p.count; i++) { const t = p.getY(i) / 50; c.copy(mid).lerp(t > 0 ? top : bot, Math.min(1, Math.abs(t) * 1.4)); col.push(c.r, c.g, c.b); }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  sc.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })));
  const sun = new THREE.Mesh(new THREE.SphereGeometry(7, 12, 8), new THREE.MeshBasicMaterial({ color: 0xfff1d0 })); sun.position.set(18, 30, 22); sc.add(sun);
  W.scene.environment = pm.fromScene(sc, 0.03).texture; W.scene.environmentIntensity = 0.5; pm.dispose(); geo.dispose();
}
// Resolution: the picture is drawn at the display's own pixels, up to 4K (3840 by 2160). That is the standard setting.
// Graphics level 1 stops at 1.5 times, level 0 at 1 times. "Smooth" mode lowers W.scale when frames run long.
function applyResolution() {
  const w = window.innerWidth, h = window.innerHeight, dpr = window.devicePixelRatio || 1;
  let pr = W.gfx === 2 ? Math.min(dpr, 3840 / w, 2160 / h) : W.gfx === 1 ? Math.min(dpr, 1.5) : 1;
  if (W.gfx === 2) pr = Math.max(pr, Math.min(1, dpr));
  W.renderer.setPixelRatio(pr * (W.scale || 1));
}
export function setSmooth(v) { W.smooth = v; if (!v) { W.scale = 1; applyResolution(); resize(); } }
export function renderInfo() { const s = W.renderer.getDrawingBufferSize(new THREE.Vector2()); return { width: s.x, height: s.y, scale: W.scale, fps: W.fps || 0 }; }
function resize() {
  if (!W.ok) return; const w = window.innerWidth, h = window.innerHeight;
  applyResolution(); W.renderer.setSize(w, h, false); W.camera.aspect = w / h; W.camera.updateProjectionMatrix();
}

export function setHour(h) {
  W.hour = h; if (!W.ok) return;
  const day = clamp((h - 6) / 13, 0, 1), mid = 1 - Math.abs(day - 0.5) * 2, ang = lerp(-1.25, 1.25, day);
  W.sun.position.set(Math.sin(ang) * 70, 28 + mid * 55, 38 + Math.cos(ang) * 20);
  W.sun.color.set(0xffb97f).lerp(new THREE.Color(0xfff0d8), Math.pow(mid, 0.6));
  W.fill.position.set(-Math.sign(W.sun.position.x || 1) * 60, 36, 48); W.fill.color.set(0xffd0b4).lerp(new THREE.Color(0xffeede), Math.pow(mid, 0.6));
  const dull = W.kit && W.kit.weather ? 0.72 : 1;
  W.sun.intensity = (1.0 + mid * 0.8) * dull; W.fill.intensity = (0.32 + mid * 0.2) * dull; W.hemi.intensity = 0.7 + mid * 0.28 + (1 - dull) * 0.45; W.scene.environmentIntensity = 0.35 + mid * 0.25;
  const s = SEASONS[W.season], top = new THREE.Color(s.sky[1]), bot = new THREE.Color(s.sky[0]);
  const duskTop = new THREE.Color(day < 0.5 ? 0xd7c3d6 : 0x8d97c4), duskBot = new THREE.Color(day < 0.5 ? 0xfbe0c8 : 0xf6c0a0), k = 1 - Math.pow(mid, 0.5);
  top.lerp(duskTop, k); bot.lerp(duskBot, k);
  if (dull < 1) { top.lerp(new THREE.Color(0xc9d0d6), 0.6); bot.lerp(new THREE.Color(0xdfe3e6), 0.6); }
  document.documentElement.style.setProperty('--sky-top', '#' + top.getHexString());
  document.documentElement.style.setProperty('--sky-bot', '#' + bot.getHexString());
  const far = W.big || 1; W.scene.fog = new THREE.Fog(new THREE.Color(s.haze).lerp(bot, 0.5).lerp(new THREE.Color(0xfff0dc), 0.25), (dull < 1 ? 110 : 150) * far, (dull < 1 ? 300 : 400) * far);
  const glow = clamp(1 - mid * 2.2, 0, 1); // windows: a few lamps are on indoors all day, and more as the light goes
  if (W.kit) { for (const m of W.kit.windowMats) m.emissiveIntensity = 0.14 + glow * 1.2 + (dull < 1 ? 0.3 : 0); for (const m of W.kit.lampMats) m.emissiveIntensity = 0.25 + glow * 2 + (dull < 1 ? 0.5 : 0); }
}

function disposeGroup(g) {
  g.traverse((o) => { if ((o.isMesh || o.isPoints) && !isShared(o.geometry)) o.geometry.dispose(); });
  while (g.children.length) g.remove(g.children[0]);
}
function disposeKit(k) {
  for (const m of k.windowMats) { m.map?.dispose(); m.emissiveMap?.dispose(); m.dispose(); }
  for (const m of k.own) { m.map?.dispose(); m.normalMap?.dispose(); m.dispose(); }
}

// Build a place from its recipe. recipe(kit) lays out the diorama; the ground cover and the weather follow.
export function loadPlace(recipe, { season = 'fall', hour = 9, seed = 'x', az, pol, dist, tags = [], flags = {}, companions = { folio: true, wren: false } } = {}) {
  if (!W.ok) return null;
  if (W.kit) disposeKit(W.kit);
  disposeGroup(W.world); disposeGroup(W.actors); W.markers = []; W.goal = null; W.onArrive = null; W.held = null;
  W.season = season;
  const kit = new Kit(W.world, { season, seed, gfx: W.gfx, wind: W.wind }); kit.tags = tags; W.kit = kit;
  recipe(kit, flags); kit.clearTracks();
  scatter(kit); airborne(kit); kit.finish();
  if (W.gfx > 0) kit.clouds(W.gfx === 2 ? 9 : 4);
  // everything that frames the slab goes by its size: how far back the camera sits, how far it may go, where the haze starts, what the sun's shadow covers
  const big = kit.size / 60; W.big = big; W.fit = 122 * big;
  const sc = W.sun.shadow.camera, half = 48 * big; sc.left = -half; sc.right = half; sc.top = half; sc.bottom = -half; sc.far = 240 * big; sc.updateProjectionMatrix();
  setHour(hour);
  W.az = az ?? 0.75; W.pol = pol ?? 0.98; W.dist = dist ?? W.fit; W.target.set(0, 2, 0);
  W.student = makeStudent(kit); W.avatar = W.student.g; W.avatar.position.set(kit.spawn.x, 0, kit.spawn.z); W.actors.add(W.avatar);
  W.you = makeYou(W.student); W.actors.add(W.you.g);
  W.folio = companions.folio ? makeFolio() : null; if (W.folio) { W.folio.position.set(kit.spawn.x + 1.4, 0, kit.spawn.z + 1); W.actors.add(W.folio); }
  W.wrenP = companions.wren ? makeWren(kit) : null; W.wren = W.wrenP ? W.wrenP.g : null; if (W.wren) { W.wren.position.set(kit.spawn.x - 1.3, 0, kit.spawn.z + 1.2); W.actors.add(W.wren); }
  kit.player.x = kit.spawn.x; kit.player.z = kit.spawn.z;
  buildLabels(kit);
  return kit;
}
// ---- which figure is the player's ----
// Three things mark the student. A green ring lies on the ground around the feet. A green "You" tag floats over the head; it is HTML, so nothing in the place
// can stand in front of it. And wherever a building, a tree or another person comes between the camera and the student, the student is drawn there as a flat
// green shape, so the figure is never lost. The shape is drawn after the place and before the student, and only where something nearer is already in the
// picture (`depthFunc: GreaterDepth`); the student, drawn last, covers nothing of it. The order is set with `renderOrder`: place 0, ring 8, shapes 9, student 10.
const YOU = 0x1ec866;
function makeYou(student) {
  const behind = { color: YOU, fog: false, depthFunc: THREE.GreaterDepth, depthWrite: false };
  const shape = new THREE.MeshBasicMaterial({ ...behind, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -8 });   // the offset keeps the soles from showing through the path they stand on
  const own = []; student.g.traverse((o) => { if (o.isMesh && o.material.visible !== false) own.push(o); });
  for (const m of own) { m.renderOrder = 10; const s = new THREE.Mesh(m.geometry, shape); s.renderOrder = 9; m.add(s); }
  const g = new THREE.Group(), flat = (geo) => geo.rotateX(-Math.PI / 2);
  const band = flat(new THREE.RingGeometry(0.6, 0.84, 48)), ring = new THREE.Mesh(band, new THREE.MeshBasicMaterial({ color: YOU, fog: false }));
  const rim = new THREE.Mesh(flat(new THREE.RingGeometry(0.84, 0.93, 48)), new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false }));
  const pool = new THREE.Mesh(flat(new THREE.CircleGeometry(0.6, 32)), new THREE.MeshBasicMaterial({ color: YOU, fog: false, transparent: true, opacity: 0.2, depthWrite: false }));
  const ghost = new THREE.Mesh(band, new THREE.MeshBasicMaterial(behind));
  ring.renderOrder = 8; rim.renderOrder = 8; ghost.renderOrder = 9; pool.position.y = -0.02;
  g.add(pool, ring, rim, ghost); g.position.y = 0.09;
  return { g, shape, tag: null };
}
function makeStudent(kit) {
  const p = makePerson(kit, { kind: 'adult', top: 0x24406e, pack: true, scale: 1.04, hat: false });
  const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.125, 0.06, 5, 10).rotateX(Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xd24d3e, flatShading: true })); scarf.position.y = 1.275; scarf.scale.z = 0.72; p.g.add(scarf);
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.3, 0.035), scarf.material); tail.position.set(0.07, 1.12, 0.125); tail.rotation.z = -0.12; p.g.add(tail);
  return p;
}
function makeFolio() {
  const g = new THREE.Group(), mat = (c, e) => new THREE.MeshStandardMaterial({ color: c, flatShading: true, emissive: e || 0, emissiveIntensity: e ? 1 : 0 });
  const b = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.5, 0.74), mat(0xe9e4d6)); b.position.y = 0.42; b.castShadow = true; g.add(b);
  const tray = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.06, 0.5), mat(0x8a6a4a)); tray.position.set(0, 0.72, -0.05); g.add(tray);
  const book = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.4), mat(0x9a3f3a)); book.position.set(-0.05, 0.8, -0.05); book.rotation.y = 0.2; g.add(book);
  const eye = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.1, 0.03), mat(0x9fe8ff, 0x7fd8f5)); eye.position.set(0, 0.5, 0.38); g.add(eye);
  for (const sx of [-1, 1]) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.1, 10).rotateZ(Math.PI / 2), mat(0x3a4250)); w.position.set(sx * 0.36, 0.16, 0); g.add(w); }
  const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.4, 4), mat(0x3a4250)); ant.position.set(0.2, 0.9, -0.25); g.add(ant);
  return g;
}
function makeWren(kit) {
  const p = makePerson(kit, { kind: 'child', top: 0xe2b23a, pack: false, hat: false });
  const hat = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.3, 8), new THREE.MeshStandardMaterial({ color: 0xc0503f, flatShading: true })); hat.position.y = 1.75; p.g.add(hat);
  return p;
}

function buildLabels(kit) {
  clear(W.labelsEl); W.labelNodes = [];
  for (const L of kit.labels) { const n = el('div.wlabel.' + L.kind, L.text); W.labelsEl.append(n); W.labelNodes.push({ n, p: new THREE.Vector3(L.x, L.y, L.z), kind: L.kind }); }
  if (W.you) { const n = el('div.wlabel.you', 'You'); W.labelsEl.append(n); W.you.tag = { n, p: new THREE.Vector3(), kind: 'you' }; W.labelNodes.push(W.you.tag); }
}

// Markers the player can walk to: door (session room), sample spots, talk points.
export function setMarkers(list) {
  for (const m of W.markers) W.actors.remove(m.obj);
  W.labelNodes = W.labelNodes.filter((L) => { if (L.marker) { L.n.remove(); return false; } return true; });
  W.markers = [];
  for (const d of list) {
    const gy = W.kit ? W.kit.heightAt(d.x, d.z) : 0, g = new THREE.Group(); g.position.set(d.x, gy, d.z);
    const col = d.type === 'door' ? 0x7fd8f5 : d.type === 'sample' ? 0xf2c14e : d.type === 'talk' ? 0xf4f2ec : d.type === 'travel' ? 0xff8a3d : 0xcc79a7, big = d.type === 'door' || d.type === 'travel';
    const mat = new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.9, transparent: true, opacity: 0.9 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(big ? 1.2 : 0.55, 0.07, 6, 24).rotateX(Math.PI / 2), mat); ring.position.y = 0.1; g.add(ring);
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(big ? 0.42 : 0.24), mat); gem.position.y = big ? 3.4 : 2.3; g.add(gem);
    const hit = new THREE.Mesh(new THREE.CylinderGeometry(big ? 1.6 : 1.1, big ? 1.6 : 1.1, 4, 8), new THREE.MeshBasicMaterial({ visible: false })); hit.position.y = 2; g.add(hit);
    hit.userData.pick = d; W.actors.add(g); W.markers.push({ obj: g, gem, ring, d, hit, y0: gem.position.y });
    if (d.label) { const n = el('div.wlabel.marker' + (d.type === 'travel' ? '.travel' : d.type === 'door' ? '.door' : ''), d.label); W.labelsEl.append(n); W.labelNodes.push({ n, p: new THREE.Vector3(d.x, gy + (big ? 4.6 : 3.2), d.z), kind: 'marker', marker: g }); }
  }
}
export function removeMarker(pred) {
  const keep = [];
  for (const m of W.markers) { if (pred(m.d)) { W.actors.remove(m.obj); W.labelNodes = W.labelNodes.filter((L) => { if (L.marker === m.obj) { L.n.remove(); return false; } return true; }); } else keep.push(m); }
  W.markers = keep;
}

export function onWorld(handlers) { W.handlers = handlers; }
export function setAuto(v) { W.auto = v; }
export function setMotion(v) { W.motion = v; }
export function setYou(v) { W.youOn = v; }   // the ring, the tag and the green shape; off on the title screen
export function setView({ az, pol, dist }) { if (az != null) W.az = az; if (pol != null) W.pol = pol; if (dist != null) W.dist = dist; }
export function worldOK() { return W.ok; }
export function kitNow() { return W.kit; }
export function avatarPos() { return W.avatar ? { x: W.avatar.position.x, z: W.avatar.position.z } : { x: 0, z: 0 }; }
export function release(npc) { if (npc) npc.paused = false; if (W.held === npc) W.held = null; }

// `sure`: run `then` even if something is in the way and the walk stops short
export function walkTo(x, z, then, sure = false) {
  if (!W.avatar) return; const lim = (W.kit?.size ?? 60) / 2 - 1.2;
  W.goal = { x: clamp(x, -lim, lim), z: clamp(z, -lim, lim) }; W.onArrive = then || null; W.sure = sure; W.by = performance.now() + 4000; W.stuck = 0;
}

function pickAt(e) {
  const r = W.canvas.getBoundingClientRect();
  W.ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), W.camera);
  const targets = [...W.markers.map((m) => m.hit), ...(W.kit ? W.kit.picks : [])];
  return W.ray.intersectObjects(targets, false)[0];
}
function bindInput(c) {
  let down = null, moved = false, pinch = 0, lastHover = 0; const pts = new Map();
  c.addEventListener('pointerdown', (e) => { c.setPointerCapture(e.pointerId); pts.set(e.pointerId, e); down = { x: e.clientX, y: e.clientY, az: W.az, pol: W.pol }; moved = false; if (pts.size === 2) { const [a, b] = [...pts.values()]; pinch = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY); } });
  c.addEventListener('pointermove', (e) => {
    if (!pts.has(e.pointerId)) { const now = performance.now(); if (now - lastHover > 70 && W.handlers.active && W.handlers.active()) { lastHover = now; c.style.cursor = pickAt(e) ? 'pointer' : 'grab'; } return; }
    pts.set(e.pointerId, e);
    if (pts.size === 2) { const [a, b] = [...pts.values()]; const d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY); if (pinch) W.dist = clamp(W.dist * pinch / d, 38, 170 * (W.big || 1)); pinch = d; moved = true; return; }
    if (!down) return; const dx = e.clientX - down.x, dy = e.clientY - down.y;
    if (Math.abs(dx) + Math.abs(dy) > 5) moved = true;
    if (moved) { W.az = down.az - dx * 0.006; W.pol = clamp(down.pol - dy * 0.005, 0.35, 1.42); W.auto = false; c.style.cursor = 'grabbing'; }
  });
  const up = (e) => { pts.delete(e.pointerId); if (down && !moved && pts.size === 0) click(e); if (pts.size === 0) down = null; };
  c.addEventListener('pointerup', up); c.addEventListener('pointercancel', (e) => { pts.delete(e.pointerId); down = null; });
  c.addEventListener('wheel', (e) => { e.preventDefault(); W.dist = clamp(W.dist * (1 + Math.sign(e.deltaY) * 0.08), 38, 170 * (W.big || 1)); }, { passive: false });
  window.addEventListener('keydown', (e) => { if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return; W.keys[e.key.toLowerCase()] = true; });
  window.addEventListener('keyup', (e) => { W.keys[e.key.toLowerCase()] = false; });
}
function approach(d, at, stop) {
  const a = W.avatar.position, dx = at.x - a.x, dz = at.z - a.z, L = Math.hypot(dx, dz) || 1;
  walkTo(at.x - (dx / L) * stop, at.z - (dz / L) * stop, () => W.handlers.onPick && W.handlers.onPick(d), !d.npc && !d.animal);   // a marker always answers, a creature only when reached
}
// walk the student to one of the markers and do what a click on it would do
export function walkToMark(d) { if (!W.avatar || !d) return false; if (W.held) { W.held.paused = false; W.held = null; } approach(d, d, d.type === 'door' ? 1.0 : 1.3); return true; }
function click(e) {
  if (!W.handlers.active || !W.handlers.active()) return;
  if (W.held) { W.held.paused = false; W.held = null; }
  const hit = pickAt(e);
  if (hit && hit.object.userData.pick) {
    const d = hit.object.userData.pick;
    if (d.npc) { d.npc.paused = true; W.held = d.npc; approach(d, d.npc.g.position, 1.5); }
    else if (d.animal) approach(d, d.animal.g.position, 2.6);
    else approach(d, d.x != null ? d : { x: hit.point.x, z: hit.point.z }, d.type === 'door' ? 1.0 : 1.3);
    return;
  }
  const pt = new THREE.Vector3(), slope = W.kit && W.kit.hills.length ? W.ray.intersectObjects(W.kit.hills.map((h) => h.m), false)[0] : null;   // a click on a hillside means that spot on the hill, not the ground behind it
  if (slope) walkTo(slope.point.x, slope.point.z);
  else if (W.ray.ray.intersectPlane(W.ground, pt)) walkTo(pt.x, pt.z);
}
// keyboard: walk to the nearest marker, person or animal
export function pickNearest(type) {
  let best = null, bd = 1e9; const a = W.avatar.position;
  const consider = (d, x, z) => { const dd = Math.hypot(x - a.x, z - a.z); if (dd < bd) { bd = dd; best = [d, { x, z }]; } };
  if (type === 'npc') for (const n of W.kit.npcs) consider({ type: 'npc', npc: n }, n.g.position.x, n.g.position.z);
  else if (type === 'animal') for (const f of W.kit.fauna) consider({ type: 'animal', animal: f }, f.g.position.x, f.g.position.z);
  else for (const m of W.markers) if (!type || m.d.type === type) consider(m.d, m.d.x, m.d.z);
  if (!best) return false;
  if (W.held) { W.held.paused = false; W.held = null; }
  if (best[0].npc) { best[0].npc.paused = true; W.held = best[0].npc; }
  approach(best[0], best[1], best[0].type === 'door' ? 1 : 1.5); return true;
}

function blocked(x, z) { return W.kit.blocked(x, z, true) || W.kit.mask.get(x, z) === WATER; }
// The height of the ground under someone, looked up again only when they have moved.
function ground(obj) {
  const p = obj.position, u = obj.userData;
  if (u.gx !== p.x || u.gz !== p.z) { u.gx = p.x; u.gz = p.z; u.gy = W.kit && W.kit.hills.length ? W.kit.heightAt(p.x, p.z) : 0; }
  return u.gy;
}
function stepActor(obj, tx, tz, speed, dt, stop = 0.05) {
  const dx = tx - obj.position.x, dz = tz - obj.position.z, L = Math.hypot(dx, dz);
  if (L < stop) return 1;
  const st = Math.min(L, speed * dt), nx = obj.position.x + (dx / L) * st, nz = obj.position.z + (dz / L) * st; let ok = true;
  if (!blocked(nx, nz)) { obj.position.x = nx; obj.position.z = nz; }
  else if (!blocked(nx, obj.position.z)) obj.position.x = nx;
  else if (!blocked(obj.position.x, nz)) obj.position.z = nz;
  else ok = false;
  let d = Math.atan2(dx, dz) - obj.rotation.y; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; obj.rotation.y += d * Math.min(1, dt * 10);
  return ok ? 0 : -1;
}

function loop(now) {
  requestAnimationFrame(loop);
  if (!W.ok) return;
  const raw = Math.max(0, (now - W.last) / 1000), dt = Math.min(0.05, raw); W.last = now; W.t += dt; W.wind.value = W.t;
  W.fps = (W.fps || 60) * 0.97 + (1 / Math.max(raw, 0.001)) * 0.03; W.fpsT = (W.fpsT || 0) + raw;
  if (W.fpsT > 4) { W.fpsT = 0; if (W.smooth && W.fps < 34 && W.scale > 0.5) { W.scale = Math.max(0.5, W.scale - 0.12); resize(); } else if (W.smooth && W.fps > 56 && W.scale < 1) { W.scale = Math.min(1, W.scale + 0.06); resize(); } else if (!W.smooth && W.fps < 18 && !W.slowTold && W.handlers.onSlow) { W.slowTold = true; W.handlers.onSlow(); } }
  if (W.paused) return;
  const k = W.keys, live = W.handlers.active && W.handlers.active();
  if (live) {
    if (k['arrowleft']) W.az += dt * 1.2; if (k['arrowright']) W.az -= dt * 1.2;
    if (k['arrowup']) W.pol = clamp(W.pol - dt * 0.8, 0.35, 1.42); if (k['arrowdown']) W.pol = clamp(W.pol + dt * 0.8, 0.35, 1.42);
    if (k['='] || k['+']) W.dist = clamp(W.dist * (1 - dt), 38, 170 * (W.big || 1)); if (k['-']) W.dist = clamp(W.dist * (1 + dt), 38, 170 * (W.big || 1));
    if (W.avatar && (k['w'] || k['a'] || k['s'] || k['d'])) {
      const f = (k['w'] ? 1 : 0) - (k['s'] ? 1 : 0), r = (k['d'] ? 1 : 0) - (k['a'] ? 1 : 0);
      const fx = -Math.sin(W.az), fz = -Math.cos(W.az), rx = Math.cos(W.az), rz = -Math.sin(W.az);
      walkTo(W.avatar.position.x + (fx * f + rx * r) * 2.5, W.avatar.position.z + (fz * f + rz * r) * 2.5);
    }
  }
  if (W.auto && W.motion) W.az += dt * 0.04;
  if (W.kit) { if (W.avatar) { W.kit.player.x = W.avatar.position.x; W.kit.player.z = W.avatar.position.z; } for (const f of W.kit.anim) f(W.t, dt); }
  let walking = false;
  if (W.avatar && W.goal) {
    const res = stepActor(W.avatar, W.goal.x, W.goal.z, 7.5 * Math.sqrt(W.big || 1), dt, 0.12); walking = res === 0;   // a longer stride on a bigger slab
    if (res === -1) W.stuck += dt; else W.stuck = Math.max(0, W.stuck - dt);
    const late = W.sure && W.onArrive && performance.now() > W.by;   // a slow machine should not keep anyone waiting for a door
    if (late && !blocked(W.goal.x, W.goal.z)) W.avatar.position.set(W.goal.x, 0, W.goal.z);
    if (res === 1 || W.stuck > 0.5 || late) { const close = res === 1 || Math.hypot(W.goal.x - W.avatar.position.x, W.goal.z - W.avatar.position.z) < 9; W.goal = null; W.stuck = 0; const f = W.onArrive; W.onArrive = null; if (f && (close || W.sure)) f(); else if (W.held) { W.held.paused = false; W.held = null; } }
  }
  if (W.student) { W.stride = (W.stride || 0) + (walking ? dt * 11 : 0); stride(W.student, W.stride, walking ? 0.6 : 0); W.avatar.position.y = ground(W.avatar) + (walking ? Math.abs(Math.sin(W.stride)) * 0.05 : 0); }
  if (W.avatar) {
    const a = W.avatar.position;
    if (W.folio) { const d = Math.hypot(a.x - W.folio.position.x, a.z - W.folio.position.z); if (d > 2.2) stepActor(W.folio, a.x, a.z, 7.2 * Math.sqrt(W.big || 1), dt, 2); }
    if (W.wren) { const d = Math.hypot(a.x - W.wren.position.x, a.z - W.wren.position.z), run = d > 2.6; if (run) stepActor(W.wren, a.x, a.z, 7.8 * Math.sqrt(W.big || 1), dt, 2.2); W.wrenStride = (W.wrenStride || 0) + (run ? dt * 15 : 0); stride(W.wrenP, W.wrenStride, run ? 0.7 : 0); W.wren.position.y = ground(W.wren) + (run ? Math.abs(Math.sin(W.wrenStride)) * 0.09 : 0); }
    if (W.folio) W.folio.position.y = ground(W.folio);
  }
  if (W.you && W.avatar) {
    const a = W.avatar.position, far = clamp(W.dist / 70, 1, 2.4);   // the ring grows as the camera pulls back, so it stays about the same size on the screen
    W.you.g.visible = W.youOn; W.you.shape.visible = W.youOn;
    const gy = ground(W.avatar); W.you.g.position.set(a.x, gy + 0.09, a.z); W.you.g.scale.setScalar(far * (W.motion ? 1 + Math.sin(W.t * 2.6) * 0.07 : 1));
    if (W.you.tag) W.you.tag.p.set(a.x, gy + BODY.top * W.avatar.scale.y + 0.42, a.z);
  }
  for (const m of W.markers) { m.gem.rotation.y = W.t * 1.2; m.gem.position.y = m.y0 + Math.sin(W.t * 1.8 + m.d.x) * 0.12; m.ring.scale.setScalar(1 + Math.sin(W.t * 2 + m.d.z) * 0.05); }
  // zoomed out, the camera looks at the middle of the slab. The closer it comes, the more it keeps the student in the middle instead.
  if (W.avatar && W.fit) { const near = clamp((W.fit - W.dist) / (W.fit - 50), 0, 1), ease = Math.min(1, dt * 3); W.target.x += (W.avatar.position.x * near - W.target.x) * ease; W.target.z += (W.avatar.position.z * near - W.target.z) * ease; }
  const cp = Math.cos(W.pol), sp = Math.sin(W.pol);
  W.camera.position.set(W.target.x + Math.sin(W.az) * sp * W.dist, W.target.y + cp * W.dist, W.target.z + Math.cos(W.az) * sp * W.dist);
  W.camera.lookAt(W.target); W.sun.target.position.copy(W.target);
  W.renderer.render(W.scene, W.camera);
  const w = window.innerWidth, h = window.innerHeight, v = new THREE.Vector3();
  for (const L of W.labelNodes) {
    v.copy(L.p).project(W.camera);
    const vis = v.z < 1 && Math.abs(v.x) < 1.05 && Math.abs(v.y) < 1.05 && (L.kind !== 'sign' || W.dist < 84 * (W.big || 1)) && (L.kind !== 'you' || W.youOn);
    L.n.style.display = vis ? '' : 'none'; L.vis = vis; L.sx = ((v.x + 1) / 2) * w; L.sy = ((1 - v.y) / 2) * h;
    if (vis && L.kind !== 'you') L.n.style.transform = `translate(-50%,-100%) translate(${L.sx}px,${L.sy}px)`;
  }
  // The "You" tag sits over the student's head. Where it would cover another label there (a door's, most often), it hangs under the ring instead.
  const Y = W.you && W.you.tag;
  if (Y && Y.vis) {
    const size = (L) => { if (!L.w || W.t - L.at > 2) { L.w = L.n.offsetWidth; L.h = L.n.offsetHeight; L.at = W.t; } return L; };   // measured now and then, not every frame
    size(Y); let under = false;
    for (const L of W.labelNodes) {
      if (L === Y || !L.vis || Math.abs(L.sx - Y.sx) > 320 || Math.abs(L.sy - Y.sy) > 90) continue;
      size(L); if (Math.abs(L.sx - Y.sx) < (L.w + Y.w) / 2 + 4 && Y.sy - 9 > L.sy - L.h - 4 && Y.sy - 9 - Y.h < L.sy + 4) { under = true; break; }
    }
    if (under !== Y.under) { Y.under = under; Y.n.classList.toggle('under', under); }
    if (under) { const a = W.avatar.position, R = 0.93 * W.you.g.scale.x; v.set(a.x + Math.sin(W.az) * R, ground(W.avatar), a.z + Math.cos(W.az) * R).project(W.camera); Y.n.style.transform = `translate(-50%,0) translate(${Y.sx}px,${((1 - v.y) / 2) * h}px)`; }
    else Y.n.style.transform = `translate(-50%,-100%) translate(${Y.sx}px,${Y.sy}px)`;
  }
  if (W.handlers.onFrame) W.handlers.onFrame(W.t, dt);
}

export function pauseWorld(v) { W.paused = v; }
export function snapshot(maxW = 3840) {
  if (!W.ok) return null;
  const you = W.you && W.youOn; if (you) { W.you.g.visible = false; W.you.shape.visible = false; }   // a postcard shows the place, not the pointer
  W.renderer.render(W.scene, W.camera);
  if (you) { W.you.g.visible = true; W.you.shape.visible = true; }
  const src = W.canvas, sc = Math.min(1, maxW / src.width), c = document.createElement('canvas');
  c.width = Math.round(src.width * sc); c.height = Math.round(src.height * sc);
  const g = c.getContext('2d'), grad = g.createLinearGradient(0, 0, 0, c.height), cs = getComputedStyle(document.documentElement);
  grad.addColorStop(0, cs.getPropertyValue('--sky-top') || '#bfe0f5'); grad.addColorStop(1, cs.getPropertyValue('--sky-bot') || '#eef6fb');
  g.fillStyle = grad; g.fillRect(0, 0, c.width, c.height); g.drawImage(src, 0, 0, c.width, c.height);
  return c;
}
export { W as _world, THREE, C };
