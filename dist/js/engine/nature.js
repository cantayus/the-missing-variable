// Ground cover and weather: grass that moves in the wind, wildflowers, fallen leaves, reeds, lily pads,
// and whatever is drifting down through the air this season.
import * as THREE from 'three';
import { WILD, LAWN, PAVED, WATER, BUILT, G, M, blob } from './kit.js';

function windy(mat, wind, amp = 0.16) {
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = wind;
    sh.vertexShader = 'uniform float uTime;\n' + sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
      #ifdef USE_INSTANCING
        float ph = instanceMatrix[3][0] * 0.55 + instanceMatrix[3][2] * 0.4;
        float bend = position.y * position.y;
        transformed.x += (sin(uTime * 1.5 + ph) + 0.5 * sin(uTime * 3.3 + ph * 1.7)) * ${amp.toFixed(3)} * bend;
        transformed.z += cos(uTime * 1.1 + ph * 1.3) * ${(amp * 0.6).toFixed(3)} * bend;
      #endif`);
  };
  return mat;
}
function tuftGeo() {
  return G('tuft', () => {
    const pos = []; for (let b = 0; b < 4; b++) { const a = (b / 4) * Math.PI + 0.3 * b, c = Math.cos(a), s = Math.sin(a), lean = (b - 1.5) * 0.12, w = 0.09; pos.push(-w * c, 0, -w * s, w * c, 0, w * s, lean * c + (b % 2 ? 0.05 : -0.05), 1 - b * 0.12, lean * s); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.computeVertexNormals(); return g;
  });
}
function instanced(k, geo, mat, list, { shadow = false } = {}) { // list: [x,y,z, ry, sx,sy,sz, color]
  if (!list.length) return null;
  const im = new THREE.InstancedMesh(geo, mat, list.length), m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), c = new THREE.Color();
  list.forEach((it, i) => { e.set(it[8] || 0, it[3], it[9] || 0); q.setFromEuler(e); m.compose(new THREE.Vector3(it[0], it[1], it[2]), q, new THREE.Vector3(it[4], it[5], it[6])); im.setMatrixAt(i, m); im.setColorAt(i, c.set(it[7])); });
  im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true; im.castShadow = shadow; im.receiveShadow = true; im.frustumCulled = false; k.g.add(im); k.own.push(mat); return im;
}

export function scatter(k) {
  const r = k.r.fork('scatter'), S = k.seasonName, e = k.size / 2 - 0.5, sn = k.season, col = new THREE.Color();
  const vary = (hex, l = 0.06) => col.set(hex).offsetHSL(r.range(-0.015, 0.015), r.range(-0.05, 0.05), r.range(-l, l)).getHex();
  // grass
  const want = [0, 3200, 6400][k.gfx], tufts = [];
  for (let i = 0; i < want * 2.2 && tufts.length < want; i++) {
    const x = r.range(-e, e), z = r.range(-e, e), v = k.mask.get(x, z);
    if (v === WILD) { if (S === 'winter' && r.chance(0.72)) continue; const h = S === 'winter' ? r.range(0.18, 0.4) : r.range(0.34, 0.8) * (S === 'summer' ? 1.15 : 1); tufts.push([x, 0, z, r.u() * 6.28, r.range(0.8, 1.5), h, r.range(0.8, 1.5), vary(r.pick(sn.tuft))]); }
    else if (v === LAWN && S !== 'winter' && r.chance(0.3)) tufts.push([x, 0, z, r.u() * 6.28, 0.7, r.range(0.12, 0.2), 0.7, vary(sn.lawn, 0.04)]);
  }
  if (tufts.length) instanced(k, tuftGeo(), windy(new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide, flatShading: true, roughness: 1 }), k.wind), tufts);
  // wildflowers in drifts
  if (sn.flowers.length && k.gfx > 0) {
    const fl = [], st = [];
    for (let c = 0; c < 22; c++) { const p = k.find([WILD], { apart: 2, margin: 2 }); if (!p) break; const hue = r.pick(sn.flowers); for (let i = 0; i < r.int(7, 16); i++) { const x = p[0] + r.range(-1.7, 1.7), z = p[1] + r.range(-1.7, 1.7); if (k.mask.get(x, z) !== WILD) continue; const h = r.range(0.25, 0.5); fl.push([x, h, z, r.u() * 6, 0.09, 0.06, 0.09, vary(hue, 0.04)]); st.push([x, 0, z, r.u() * 6, 0.25, h, 0.25, vary(0x5f9a4f)]); } }
    instanced(k, G('ico0', () => new THREE.IcosahedronGeometry(1, 0)), windy(new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true, roughness: 0.8 }), k.wind, 0.0), fl);
    instanced(k, tuftGeo(), windy(new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide, flatShading: true }), k.wind), st);
  }
  // fallen leaves in autumn, more of them under the trees
  if (S === 'fall' && k.gfx > 0) {
    const lv = [], n = k.gfx === 2 ? 900 : 450;
    for (let i = 0; i < n; i++) { let x, z; if (k.treeSpots.length && r.chance(0.7)) { const t = r.pick(k.treeSpots), a = r.u() * 6.28, d = Math.sqrt(r.u()) * 3.4; x = t.x + Math.cos(a) * d; z = t.z + Math.sin(a) * d; } else { x = r.range(-e, e); z = r.range(-e, e); } const v = k.mask.get(x, z); if (v === WATER || v === BUILT || v === 9) continue; lv.push([x, 0.07, z, r.u() * 6.28, 0.2, 1, 0.13, vary(r.pick(sn.trees), 0.05), 0, r.range(-0.2, 0.2)]); }
    instanced(k, G('leafq', () => new THREE.CircleGeometry(1, 4).rotateX(-Math.PI / 2)), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, side: THREE.DoubleSide }), lv);
  }
  // rocks and low shrubs out on the rough grass
  for (let i = 0; i < 9; i++) { const p = k.find([WILD], { apart: 4, margin: 2 }); if (p) k.tree(p[0], p[1], k.tags.includes('desert') ? 'scrub' : 'bush', r.range(0.7, 1.1)); }
  for (let i = 0; i < 8; i++) { const p = k.find([WILD], { apart: 3, margin: 1.5 }); if (p) { k.rock(p[0], p[1], r.range(0.35, 0.9)); if (r.chance(0.5)) k.rock(p[0] + r.range(-0.8, 0.8), p[1] + r.range(-0.8, 0.8), r.range(0.2, 0.45)); } }
  // reeds where grass meets water, lily pads on still ponds
  const pads = [];
  for (const w of k.waterAreas) {
    const per = Math.round((w.rx + w.rz) * (w.river ? 0.5 : 1.3));
    for (let i = 0; i < per; i++) { const a = r.u() * 6.28, x = w.x + Math.cos(a) * (w.rx + 1.0 + r.u() * 0.5) * (w.round ? 1 : 1.25), z = w.z + Math.sin(a) * (w.rz + 1.0 + r.u() * 0.5) * (w.round ? 1 : 1.25); const v = k.mask.get(x, z); if ((v === WILD || v === LAWN) && k.mask.near(x, z, WATER, 1.3) && Math.abs(x) < e && Math.abs(z) < e && r.chance(0.55)) k.reeds(x, z, r.int(3, 7)); else if (v === WILD && r.chance(0.2)) k.rock(x, z, r.range(0.25, 0.5)); }
    if (w.round && !w.river && S !== 'winter') for (let i = 0; i < 7; i++) { const a = r.u() * 6.28, q = Math.sqrt(r.u()) * 0.8, x = w.x + Math.cos(a) * w.rx * q, z = w.z + Math.sin(a) * w.rz * q; pads.push([x, 0.062, z, r.u() * 6.28, r.range(0.18, 0.3), 1, r.range(0.18, 0.3), vary(0x5f9a52)]); if ((S === 'summer' || S === 'spring') && r.chance(0.3)) k.put(blob(0), x, 0.11, z, 0.07, 0.05, 0.07, r.pick([0xf7d3dc, 0xffffff]), 0, 0, 0, 0, 0); }
  }
  instanced(k, G('pad', () => new THREE.CircleGeometry(1, 9, 0.3, Math.PI * 1.85).rotateX(-Math.PI / 2)), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 }), pads);
  // snow lying against things in winter
  if (S === 'winter') for (let i = 0; i < 26; i++) { const p = k.find([WILD, LAWN], { apart: 2.2, margin: 1.5 }); if (p) k.put(blob(1), p[0], 0.02, p[1], r.range(0.9, 2.2), r.range(0.1, 0.22), r.range(0.9, 2.2), 0xf7f9fb, 0, 0, r.u() * 3, 0, 0.01); }
}

// What is in the air: leaves, snow, petals, seeds, rain. One Points object, moved by the shader.
export function airborne(k) {
  if (k.gfx === 0) return;
  const S = k.seasonName, W = k.weather;
  const cfg = W === 'rain' ? { n: 520, a: 0xbfd0dc, b: 0xdfe8ee, size: 2.2, fall: 13, sway: 0.05, op: 0.42, streak: 1 }
    : S === 'fall' ? { n: 46, a: 0xe2a23a, b: 0xcf6a2b, size: 4.2, fall: 0.7, sway: 1.9, op: 0.9 }
    : S === 'winter' ? { n: 260, a: 0xffffff, b: 0xeef3f7, size: 3.2, fall: 0.85, sway: 0.9, op: 0.9 }
    : S === 'spring' ? { n: 50, a: 0xf7d3dc, b: 0xffffff, size: 3.6, fall: 0.5, sway: 2.1, op: 0.9 }
    : { n: 30, a: 0xffffff, b: 0xf7f3d8, size: 2.6, fall: 0.1, sway: 1.5, op: 0.7 };
  const n = Math.round(cfg.n * (k.gfx === 2 ? 1 : 0.6)), pos = new Float32Array(n * 3), seed = new Float32Array(n), r = k.r.fork('air'), half = k.size / 2 + 4;
  for (let i = 0; i < n; i++) { pos[i * 3] = r.range(-half, half); pos[i * 3 + 1] = r.range(0, 26); pos[i * 3 + 2] = r.range(-half, half); seed[i] = r.u(); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uTime: k.wind, uA: { value: new THREE.Color(cfg.a) }, uB: { value: new THREE.Color(cfg.b) }, uSize: { value: cfg.size }, uFall: { value: cfg.fall }, uSway: { value: cfg.sway }, uOp: { value: cfg.op }, uStreak: { value: cfg.streak || 0 } },
    vertexShader: `uniform float uTime, uSize, uFall, uSway; attribute float aSeed; varying float vSeed;
      void main() { vSeed = aSeed; vec3 p = position; float H = 26.0;
        p.y = H - mod(uTime * uFall * (0.7 + aSeed * 0.6) + position.y, H);
        p.x += sin(uTime * 0.6 + aSeed * 31.0) * uSway + uTime * 0.25 * uSway; p.z += cos(uTime * 0.45 + aSeed * 17.0) * uSway;
        p.x = mod(p.x + 40.0, 80.0) - 40.0;
        vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = uSize * (0.6 + aSeed * 0.8) * 110.0 / -mv.z; }`,
    fragmentShader: `uniform vec3 uA, uB; uniform float uOp, uStreak, uTime; varying float vSeed;
      void main() { vec2 q = gl_PointCoord - 0.5; float a = vSeed * 6.28 + uTime * (0.6 + vSeed);
        vec2 rq = vec2(q.x * cos(a) - q.y * sin(a), q.x * sin(a) + q.y * cos(a));
        float d = uStreak > 0.5 ? max(abs(q.x) * 5.0, abs(q.y)) : length(rq * vec2(1.0, 1.0 + (1.0 - uStreak) * 0.9 * step(0.3, vSeed)));
        if (d > 0.5) discard; gl_FragColor = vec4(mix(uA, uB, vSeed), uOp * smoothstep(0.5, 0.25, d)); }`,
  });
  const pts = new THREE.Points(g, mat); pts.frustumCulled = false; k.g.add(pts); k.own.push(mat);
  if (W === 'fog') for (let i = 0; i < 7; i++) {
    const m = new THREE.Mesh(blob(2), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2, depthWrite: false })); k.own.push(m.material);
    const z0 = r.range(-28, 28), y0 = r.range(5, 13), sp = r.range(0.25, 0.6); let x = r.range(-44, 44); m.scale.set(r.range(9, 16), r.range(1.6, 3), r.range(6, 10)); k.g.add(m);
    k.anim.push((t, dt) => { x += sp * dt; if (x > 52) x = -52; m.position.set(x, y0 + Math.sin(t * 0.2 + i) * 0.6, z0); });
  }
}
