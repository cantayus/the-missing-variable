// Company and lab campuses. Stylized models of the real architecture. No logos, no brand colors as decoration.
import { C } from './kit.js';
import { hill, fountain, bridge, hangar, mountains, life, egg, rails, train, THREE } from './parts.js';

const P = (x, z) => [x, z];

export function microsoft(k) {
  k.ground(); k.weather = 'rain';
  // the East Campus: offices of four and five storeys round a wide plaza
  k.plaza(-4, 0, 22, 18, 0xd4d0c6);
  for (const [x, z, w, d, h, c] of [[-20, -10, 9, 14, 11, 0xd9d4c8], [-6, -16, 16, 7, 13, 0xcfc7b8], [12, -12, 10, 12, 11, 0xd9d4c8], [-20, 10, 9, 12, 13, 0xcfc7b8], [12, 8, 10, 10, 11, 0xd9d4c8]]) { k.box(x, z, w, d, h, { color: c, roof: 'green', win: 'bands' }); k.glass(x + (x < 0 ? w / 2 : -w / 2), z, 1.2, d * 0.6, h); }
  k.label('East Campus', -4, 17, -14);
  k.lawn(-4, -2, 10, 8); for (const [x, z] of [[-9, 5], [1, 5], [-9, -8], [1, -8]]) k.tree(x, z, 'round', 0.9);
  // the long footbridge with a white canopy, over the highway to the light rail
  k.patch(24, 0, 7, 62, 0x6f747a, 0.03); for (let i = 0; i < 12; i++) k.patch(24, -28 + i * 5, 0.25, 2.4, 0xf4f2ec, 0.045);
  k.vehicle([P(22.4, -28), P(22.4, 28)], { color: 0xb8c2cc, len: 3, w: 1.4, h: 1.1, speed: 9, stripe: 0x3a4250, pause: 0.5 }); k.vehicle([P(25.6, 28), P(25.6, -28)], { color: 0x8a2f3a, len: 3, w: 1.4, h: 1.1, speed: 8, stripe: 0x3a4250, pause: 0.5 });
  const deck = k.mesh(new THREE.BoxGeometry(16, 0.4, 3), 0xe9e4d6); deck.position.set(23, 4, 18); for (const x of [16, 30]) { const p = k.mesh(new THREE.BoxGeometry(1, 4, 2.4), C.concrete); p.position.set(x, 2, 18); }
  for (let i = 0; i < 6; i++) { const s = k.mesh(new THREE.ConeGeometry(1.9, 1.6, 4), 0xfaf8f2); s.position.set(16.5 + i * 2.6, 6.6, 18); s.rotation.y = Math.PI / 4; }
  k.sign(13.4, 20.4, 'To the trains');
  // treehouse meeting rooms in the firs, and the pond with its old koi
  k.grove(-8, 22, 26, 8, 14, 'cone'); for (const [x, z] of [[-14, 22], [-2, 23]]) { k.box(x, z, 3, 3, 2.2, { color: C.wood, roof: 'hip', roofColor: 0x6b5a4a, win: 'none', y: 3.4, solid: false }); const p = k.mesh(new THREE.CylinderGeometry(0.2, 0.2, 3.4, 6), 0x7a5a43); p.position.set(x, 1.7, z); const st = k.mesh(new THREE.BoxGeometry(0.6, 0.15, 4), C.wood); st.position.set(x + 2, 1.8, z + 1); st.rotation.x = 0.8; }
  k.sign(-8, 17.6, 'Treehouses');
  k.water(4, 22, 8, 5, { round: true }); for (let i = 0; i < 4; i++) { const f = k.mesh(new THREE.ConeGeometry(0.14, 0.6, 4).rotateX(Math.PI / 2), i % 2 ? 0xe07b22 : 0xf4f2ec); k.anim.push((t) => { const a = t * 0.3 + i * 1.6; f.position.set(4 + Math.cos(a) * (1.4 + i * 0.4), 0.09, 22 + Math.sin(a) * (0.9 + i * 0.25)); f.rotation.y = -a; }); }
  egg(k, 'koi', 8.6, 23.6, 'post', 0xe07b22);
  k.patch(-4, -26, 22, 6, 0x7fb86a, 0.025); for (const x of [-13, 5]) { const g = k.mesh(new THREE.BoxGeometry(0.1, 1.6, 2.4), 0xf4f2ec); g.position.set(x, 0.8, -26); }
  k.door = { x: -4, z: -11.6 }; k.spawn = { x: 4, z: 14 };
  k.path([P(4, 14), P(0, 6), P(-4, -11)], 1.8); k.path([P(4, 14), P(14, 18)], 1.8);
  life(k, [[P(4, 14), P(0, 6), P(-4, -10), P(0, 6)], [P(-14, 2), P(8, 2)], [P(4, 16), P(14, 18), P(4, 18)]], { tour: [3, 3], drone: true, bikes: 2 });
}

export function google(k) {
  k.ground();
  // the bay and its marsh along the north; the old airship hangar on the skyline
  k.water(0, -27, 62, 8); k.patch(0, -21, 62, 5, 0x9aa86a, 0.03); for (let i = 0; i < 30; i++) { const m = k.mesh(new THREE.ConeGeometry(0.12, 0.9, 4), 0xb8b06a); m.position.set(k.r.range(-29, 29), 0.45, k.r.range(-23, -19)); m.castShadow = false; }
  hangar(k, 22, -17, 9, 14, 7, 0xb8c2cc).rotation.y = Math.PI / 2;
  // three low canopies, each a wide tent with a scaled solar skin
  for (const [x, z, s] of [[-14, -8, 13], [2, -10, 15], [-6, 5, 12]]) {
    k.glass(x, z, s * 1.2, s * 1.2, 3.2, { roofColor: C.steel });
    const roof = k.mesh(new THREE.ConeGeometry(s, 5.4, 4, 4), 0xc9d0d6, { metalness: 0.35, roughness: 0.45 }); roof.position.set(x, 5.9, z); roof.rotation.y = Math.PI / 4;
    for (let i = 0; i < 4; i++) { const p = k.mesh(new THREE.BoxGeometry(s * 0.9, 0.06, 0.5), 0x2f4a6b, { metalness: 0.5, roughness: 0.3 }); p.position.set(x, 5.2 + i * 0.9, z + s * (0.62 - i * 0.15)); p.rotation.x = -0.36; p.castShadow = false; }
  }
  k.label('Bay View', -6, 13, -6);
  // the older lawn campus: low offices, a volleyball court, bright bicycles, and a dinosaur
  k.box(18, 8, 12, 8, 6, { color: 0xe9e4d6, roof: 'solar', win: 'bands' }); k.box(20, 20, 10, 7, 6, { color: 0xe9e4d6, roof: 'green', win: 'bands' }); k.lawn(8, 18, 12, 10);
  k.patch(8, 18, 6, 3.4, 0xe4d3ae, 0.03); const net = k.mesh(new THREE.BoxGeometry(0.06, 1, 3.4), 0xf4f2ec); net.position.set(8, 1, 18);
  const bc = [0xd24d3e, 0xe2b23a, 0x4f9a54, 0x3f7fb5];
  for (let i = 0; i < 8; i++) { const g = new THREE.Group(); for (const dz of [-0.45, 0.45]) { const w = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.05, 5, 10).rotateY(Math.PI / 2), k.mat(bc[i % 4])); w.position.set(0, 0.3, dz); g.add(w); } const f = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.9), k.mat(bc[(i + 1) % 4])); f.position.y = 0.55; g.add(f); g.position.set(10 + i * 0.8, 0, 11.4); k.g.add(g); }
  // the skeleton on the lawn, usually wearing pink flamingos
  const sk = new THREE.Group(); sk.position.set(1, 0, 20);
  const bone = (g, c = 0xe9e4d6) => { const m = new THREE.Mesh(g, k.mat(c)); m.castShadow = true; sk.add(m); return m; };
  const b = bone(new THREE.BoxGeometry(0.5, 0.6, 3)); b.position.y = 2.2; b.rotation.x = -0.25; const hd = bone(new THREE.BoxGeometry(0.6, 0.7, 1.1)); hd.position.set(0, 3, 1.9); const tl = bone(new THREE.ConeGeometry(0.25, 2.6, 4).rotateX(-Math.PI / 2)); tl.position.set(0, 1.7, -2.6);
  for (const s of [-0.4, 0.4]) { const l = bone(new THREE.BoxGeometry(0.22, 2, 0.3)); l.position.set(s, 1, -0.2); }
  for (let i = 0; i < 5; i++) { const f = bone(new THREE.IcosahedronGeometry(0.16, 0), 0xf08aa8); f.position.set(k.r.range(-0.4, 0.4), 2.7 + k.r.range(-0.2, 0.4), k.r.range(-1.2, 1.6)); }
  k.g.add(sk); egg(k, 'trex', 2.8, 21.4, 'post', 0xf08aa8);
  for (let i = 0; i < 5; i++) { const d = k.mesh(new THREE.IcosahedronGeometry(0.2, 0), 0xfaf8f2); k.anim.push((t) => { const a = t * 0.12 + i * 1.3; d.position.set(-18 + Math.cos(a) * 6, 0.25, -26 + Math.sin(a) * 1.6); }); }
  k.grove(-22, 16, 10, 14, 8); k.row(-4, 12.4, 26, 12.4, 9);
  k.door = { x: -6, z: 13 }; k.spawn = { x: 6, z: 24 };
  k.path([P(6, 24), P(2, 14), P(-6, 13)], 1.8); k.path([P(2, 14), P(12, 13.6)], 1.6);
  life(k, [[P(6, 24), P(2, 14), P(-5, 13), P(2, 14)], [P(-20, 12), P(-4, 14), P(14, 14), P(-4, 14)], [P(-24, -17), P(16, -17)]], { tour: [4, 9.6], bikes: 4, drone: true, mower: [8, 24, 8, 2] });
}

export function apple(k) {
  k.ground({ size: 66 });
  // the ring: four storeys of curved glass round a park
  const R = 21, n = 56;
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; const m = k.mesh(new THREE.BoxGeometry(2.5, 5.4, 4.6), C.glass, { transparent: true, opacity: 0.66, roughness: 0.12, metalness: 0.25 }); m.position.set(Math.cos(a) * R, 2.7, Math.sin(a) * R); m.rotation.y = -a + Math.PI / 2; m.castShadow = true; }
  for (let f = 0; f < 4; f++) { const ring = k.mesh(new THREE.TorusGeometry(R, 0.22 + (f === 3 ? 0.2 : 0), 4, 72), 0xf4f2ec); ring.rotation.x = Math.PI / 2; ring.scale.set(1.14, 1.14, 1); ring.position.y = 1.5 + f * 1.36; ring.castShadow = false; }
  const roof = k.mesh(new THREE.RingGeometry(R - 2.4, R + 2.4, 72).rotateX(-Math.PI / 2), 0x34495e, { metalness: 0.4, roughness: 0.35 }); roof.position.y = 5.75;
  k.obstacles.push({ x0: -R - 3, x1: -R + 3, z0: -8, z1: 8 }, { x0: R - 3, x1: R + 3, z0: -8, z1: 8 }, { x0: -8, x1: 8, z0: -R - 3, z1: -R + 3 });
  k.label('Apple Park', 0, 10, -R);
  // inside the ring: orchard rows, a pond, a stage of colored arches
  k.lawn(0, 0, 30, 30); k.water(5, 4, 9, 6, { round: true });
  const fruit = k.seasonName === 'spring' ? 'blossom' : 'round';
  for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) k.tree(-13 + c * 2.6, -12 + r * 3, fruit, 0.7);
  const rb = [0xd24d3e, 0xe07b22, 0xe2b23a, 0x4f9a54, 0x3f7fb5, 0x8a6aa8];
  for (let i = 0; i < 6; i++) { const arc = k.mesh(new THREE.TorusGeometry(3.4 - i * 0.34, 0.16, 5, 18, Math.PI), rb[i]); arc.position.set(-8, 0, 9); arc.rotation.y = 0.5; }
  egg(k, 'rainbow', -5.4, 11.4, 'post', 0xe2b23a);
  // the round glass theater on its hill, and the visitor terrace
  hill(k, 24, 26, 9, 7, 2.6); k.cyl(24, 26, 3.6, 2.6, { color: C.glass, glass: true, roof: 'none', y: 2.2, seg: 20 }); const lid = k.mesh(new THREE.CylinderGeometry(4.6, 4.6, 0.25, 24), 0xe9e9e6, { metalness: 0.3 }); lid.position.set(24, 5, 26);
  k.sign(17.4, 27.6, 'Theater');
  k.box(-24, 27, 12, 6, 4, { color: C.wood, roof: 'flat', roofColor: 0xe9e9e6, win: 'bands' }); k.sign(-16.6, 30.6, 'Visitor terrace');
  k.grove(0, 29, 18, 6, 9); k.grove(-27, 0, 6, 30, 9); k.grove(28, -4, 6, 34, 9);
  k.door = { x: 0, z: 15.6 }; k.spawn = { x: -6, z: 28 };
  k.path([P(-6, 28), P(-2, 24), P(0, 16)], 1.8); k.path([P(-12, 5), P(10, 10), P(12, -4)], 1.4);
  life(k, [[P(-6, 28), P(-2, 24), P(0, 16.4), P(-2, 24)], [P(-12, 5), P(-2, 8), P(10, 10), P(12, -4), P(0, -6)], [P(-20, 28), P(16, 28)]], { tour: [-14, 25], bikes: 2, drone: true, mower: [0, -2, 12, 6] });
}

export function nvidia(k) {
  k.ground();
  // two low buildings, one a triangle and one six-sided, under rolling roofs dotted with triangular skylights
  const roofed = (x, z, r, sides, rot) => {
    const body = k.mesh(new THREE.CylinderGeometry(r, r, 4.6, sides), C.glass, { transparent: true, opacity: 0.7, roughness: 0.15, metalness: 0.25 }); body.position.set(x, 2.3, z); body.rotation.y = rot;
    const top = k.mesh(new THREE.CylinderGeometry(r * 1.08, r * 1.12, 0.7, sides), 0xe9e9e6); top.position.set(x, 4.9, z); top.rotation.y = rot;
    const hump = k.mesh(new THREE.SphereGeometry(r * 0.8, sides * 2, 6, 0, Math.PI * 2, 0, Math.PI / 2), 0xe9e9e6); hump.scale.y = 0.22; hump.position.set(x, 5.2, z); hump.rotation.y = rot;
    for (let i = 0; i < 26; i++) { const a = k.r.u() * Math.PI * 2, d = Math.sqrt(k.r.u()) * r * 0.62; const s = k.mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.08, 3), 0x2f4a6b, { metalness: 0.5, roughness: 0.3 }); s.position.set(x + Math.cos(a) * d, 5.36 + (1 - d / r) * r * 0.16, z + Math.sin(a) * d); s.rotation.y = k.r.u() * 2; s.castShadow = false; }
    k.obstacles.push({ x0: x - r * 0.8, x1: x + r * 0.8, z0: z - r * 0.8, z1: z + r * 0.8 });
  };
  roofed(-13, -8, 13, 3, Math.PI / 6); roofed(14, -6, 12.5, 6, 0);
  k.sign(-13, 4.6, 'Endeavor'); k.sign(14, 6.6, 'Voyager'); k.label('Nvidia', 0, 9, -8);
  // the park between them, paved and planted in triangles
  for (let i = 0; i < 18; i++) { const t = k.mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.06, 3), i % 3 === 0 ? k.season.lawn : i % 3 === 1 ? 0xd4d0c6 : 0xbfc3c8); t.position.set(-8 + (i % 6) * 3.2 + (Math.floor(i / 6) % 2) * 1.6, 0.04, 10 + Math.floor(i / 6) * 2.8); t.rotation.y = (i % 2) * Math.PI / 3; t.castShadow = false; }
  for (const [x, z] of [[-10, 20], [-2, 22], [6, 20], [12, 23]]) k.tree(x, z, 'round');
  egg(k, 'triangles', 9, 13.6, 'post', 0x76b900 === 0 ? 0 : 0x4f9a54);
  k.box(-24, 18, 8, 12, 5, { color: C.concrete, roof: 'solar', win: 'bands' }); k.box(24, 20, 8, 10, 5, { color: C.concrete, roof: 'solar', win: 'bands' });
  for (const [x, z] of [[-26, -24], [26, -24], [-28, 4], [28, 6]]) k.tree(x, z, 'palm');
  k.vehicle([P(-26, 27.6), P(26, 27.6)], { color: C.white, len: 3.4, w: 1.4, h: 1.2, stripe: 0x3a4250, speed: 5 }); k.path([P(-30, 27.6), P(30, 27.6)], 3, 0x8f8a84);
  k.rooms = [{ x: -8, z: 4.4, label: 'Endeavor', ids: ['II-1'] }, { x: 9, z: 6.4, label: 'Voyager', ids: ['III-8'] }]; k.door = k.rooms[0]; k.spawn = { x: 0, z: 22 };
  k.path([P(0, 22), P(0, 12), P(-8, 5)], 1.8); k.path([P(0, 12), P(9, 7)], 1.8);
  life(k, [[P(0, 22), P(0, 12), P(-7, 5.4), P(0, 12), P(8, 7.4), P(0, 12)], [P(-18, 24), P(18, 24)]], { tour: [4, 17], bikes: 2, drone: true, mower: [-18, 8, 5, 3] });
}

export function ibm(k) {
  k.ground();
  // a long crescent of glass on a wooded hill, with fieldstone at its back
  hill(k, 0, -10, 34, 20, 3.4);
  const R = 30, cx = 0, cz = 22;
  for (let i = 0; i < 26; i++) { const a = -Math.PI / 2 - 0.82 + (i / 25) * 1.64; const x = cx + Math.cos(a) * R, z = cz + Math.sin(a) * R; const g = k.mesh(new THREE.BoxGeometry(3.5, 6, 2.2), C.glass, { transparent: true, opacity: 0.7, roughness: 0.14, metalness: 0.25 }); g.position.set(x, 5.6, z); g.rotation.y = -a + Math.PI / 2;
    const s = k.mesh(new THREE.BoxGeometry(3.5, 6.6, 2.4), 0x8f8676); s.position.set(cx + Math.cos(a) * (R + 2.2), 5.6, cz + Math.sin(a) * (R + 2.2)); s.rotation.y = -a + Math.PI / 2;
    const rf = k.mesh(new THREE.BoxGeometry(3.7, 0.3, 5.2), C.dark); rf.position.set(cx + Math.cos(a) * (R + 1.1), 8.9, cz + Math.sin(a) * (R + 1.1)); rf.rotation.y = -a + Math.PI / 2; }
  k.obstacles.push({ x0: -22, x1: 22, z0: -12, z1: -4 });
  k.label('Research Center', 0, 13, -8);
  // a road curving up, woods all round, a chessboard left on a table
  const road = []; for (let i = 0; i <= 10; i++) { const t = i / 10; road.push(P(-26 + t * 34, 26 - Math.sin(t * Math.PI / 2) * 22)); } k.path(road, 2.6, 0x8f8a84);
  k.vehicle([P(-24, 24.6), P(-10, 15)], { color: 0x3f6f9f, len: 3, w: 1.4, h: 1.1, stripe: 0x3a4250, speed: 3, pause: 5 });
  k.grove(-18, 6, 16, 14, 14, ['round', 'round', 'cone']); k.grove(20, 12, 16, 22, 18, ['round', 'round', 'cone']); k.grove(0, -24, 50, 8, 16, ['round', 'cone']);
  k.plaza(4, 3, 9, 5); const tb = k.mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.1, 10), C.stone); tb.position.set(4, 0.9, 3); const lg = k.mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.9, 6), C.stone); lg.position.set(4, 0.45, 3);
  for (let i = 0; i < 16; i++) { const sq = k.mesh(new THREE.BoxGeometry(0.2, 0.02, 0.2), (i + Math.floor(i / 4)) % 2 ? 0x3a4250 : 0xf4f2ec); sq.position.set(3.7 + (i % 4) * 0.2, 0.97, 2.7 + Math.floor(i / 4) * 0.2); sq.castShadow = false; }
  egg(k, 'chessboard', 5.6, 3.4, 'post', 0x3a4250);
  k.door = { x: 0, z: -3 }; k.spawn = { x: 6, z: 12 };
  k.path([P(6, 12), P(4, 6), P(0, -2.6)], 1.8);
  life(k, [[P(6, 12), P(4, 6), P(0, -2), P(4, 6)], [P(-6, 6), P(12, 5)], [P(-2, 14), P(10, 16), P(4, 20)]], { tour: [9, 6], adults: 4, bikes: 0, scooters: 0, drone: false });
}

export function belllabs(k) {
  k.ground({ size: 64 });
  // the mirrored box at the center of an oval drive
  const oval = k.mesh(new THREE.RingGeometry(20, 22.4, 48).rotateX(-Math.PI / 2), 0x8f8a84); oval.position.y = 0.04; oval.scale.set(1.25, 1, 0.92); oval.castShadow = false;
  k.lawn(0, 0, 44, 30);
  k.box(0, -4, 26, 12, 9, { color: 0x9fb4c2, roof: 'flat', roofColor: C.dark, win: 'none' }).children[0].material = k.mat(0xa9c0cf, { metalness: 0.75, roughness: 0.12 });
  for (let i = 0; i < 12; i++) { const m = k.mesh(new THREE.BoxGeometry(0.12, 9, 12.1), C.dark); m.position.set(-12 + i * 2.18, 4.5, -4); m.castShadow = false; }
  // inside, the long atrium with its walkways (seen through the glass roof)
  const atr = k.mesh(new THREE.BoxGeometry(20, 0.1, 3), 0xfff1c9, { emissive: 0xffe2a0, emissiveIntensity: 0.5 }); atr.position.set(0, 9.3, -4);
  k.label('Bell Labs', 0, 14, -4);
  // the ponds, the geese, the water tower shaped like a transistor
  k.water(-17, 8, 10, 6, { round: true }); k.water(17, 8, 10, 6, { round: true });
  for (let i = 0; i < 6; i++) { const g = k.mesh(new THREE.BoxGeometry(0.3, 0.4, 0.6), i % 2 ? 0x6b6f7a : 0x8a8478); g.position.set(8 + (i % 3) * 0.8, 0.2, 13 + Math.floor(i / 3) * 0.9); g.castShadow = false; }
  const tx = 0, tz = 22; for (let i = 0; i < 3; i++) { const a = (i / 3) * Math.PI * 2; const leg = k.mesh(new THREE.CylinderGeometry(0.22, 0.3, 12, 6), 0xf4f2ec); leg.position.set(tx + Math.cos(a) * 2.4, 6, tz + Math.sin(a) * 2.4); leg.rotation.z = Math.cos(a) * 0.12; leg.rotation.x = -Math.sin(a) * 0.12; }
  const tank = k.mesh(new THREE.CylinderGeometry(3.6, 3.6, 2.6, 16), 0xf4f2ec); tank.position.set(tx, 13, tz); k.sign(4.6, 23, 'Water tower');
  // a small horn antenna on a mound, and a box with one switch
  hill(k, -24, 22, 4, 4, 1.6); const horn = k.mesh(new THREE.ConeGeometry(1.4, 3.4, 4, 1, true), 0xb8c2cc, { side: THREE.DoubleSide }); horn.position.set(-24, 3, 22); horn.rotation.z = Math.PI / 2.4;
  k.bench(-8, 6, 0, false); const bx = k.mesh(new THREE.BoxGeometry(0.5, 0.3, 0.4), C.wood); bx.position.set(-8, 0.68, 6);
  const hand = k.mesh(new THREE.BoxGeometry(0.08, 0.3, 0.08), 0xe8c9a8); hand.position.set(-8, 0.8, 6); k.switchBox = (on) => { hand.position.y = on ? 1.02 : 0.8; };
  egg(k, 'uselessbox', -8, 6, 'box', 0xa47148, 0.9);
  // the maze mouse
  const mouse = k.mesh(new THREE.BoxGeometry(0.2, 0.12, 0.3), 0x8f949c); k.patch(8, 6, 2.4, 2.4, 0xd9d4c8, 0.05); k.anim.push((t) => { const s = Math.floor(t * 0.8) % 8, pts = [[0, 0], [1, 0], [1, 1], [0, 1], [0, 2], [1, 2], [2, 2], [2, 0]][s]; mouse.position.set(7.2 + pts[0] * 0.8, 0.12, 5.2 + pts[1] * 0.8); });
  k.grove(-26, -20, 8, 14, 7); k.grove(26, -20, 8, 14, 7); k.grove(26, 24, 8, 6, 4);
  k.door = { x: 0, z: 2.6 }; k.spawn = { x: 4, z: 16 };
  k.path([P(4, 16), P(2, 8), P(0, 3)], 1.8);
  life(k, [[P(4, 16), P(2, 8), P(0, 3.4), P(2, 8)], [P(-12, 12), P(12, 12)], [P(-22, 2), P(-12, 12), P(12, 12), P(22, 2)]], { tour: [-3, 9], adults: 4, bikes: 0, scooters: 0 });
}

export function amazon(k) {
  k.ground();
  // three glass spheres full of plants, under the office tower beside them
  for (const [x, z, r] of [[-8, 0, 6], [0, -2, 7.4], [8.4, 0, 6]]) {
    const s = k.mesh(new THREE.IcosahedronGeometry(r, 1), C.glass, { transparent: true, opacity: 0.42, roughness: 0.1, metalness: 0.3 }); s.position.set(x, r * 0.62, z);
    const w = k.mesh(new THREE.IcosahedronGeometry(r * 1.005, 1), 0xf4f2ec, { wireframe: true }); w.position.copy(s.position); w.castShadow = false;
    for (let i = 0; i < 9; i++) { const p = k.mesh(new THREE.IcosahedronGeometry(k.r.range(0.7, 1.4), 1), k.r.pick([0x3f8a58, 0x4f9a54, 0x6bb568, 0x2f7a4a])); p.position.set(x + k.r.range(-r * 0.5, r * 0.5), k.r.range(0.8, r * 0.9), z + k.r.range(-r * 0.5, r * 0.5)); p.castShadow = false; }
    k.obstacles.push({ x0: x - r * 0.8, x1: x + r * 0.8, z0: z - r * 0.8, z1: z + r * 0.8 });
  }
  k.label('The Spheres', 0, 16.5, -2);
  k.box(-2, -18, 16, 10, 34, { color: 0xb8c2cc, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.box(20, -14, 10, 12, 22, { color: 0xcfd6dc, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.box(-22, -12, 9, 12, 16, { color: 0xd9d4c8, roof: 'green', win: 'bands' });
  // a fruit stand, dogs everywhere, and the streetcar
  k.plaza(0, 11, 30, 8, 0xd4d0c6);
  k.box(12, 11, 2.6, 1.6, 1.2, { color: 0xe2b23a, roof: 'none', win: 'none', solid: false }); const aw = k.mesh(new THREE.BoxGeometry(3.2, 0.1, 2.2), 0xf4f2ec); aw.position.set(12, 2.6, 11); for (const s of [-1.3, 1.3]) { const p = k.mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.6, 5), C.dark); p.position.set(12 + s, 1.3, 11.9); }
  for (let i = 0; i < 7; i++) { const b = k.mesh(new THREE.IcosahedronGeometry(0.16, 0), 0xf2d04a); b.position.set(11 + i * 0.3, 1.3, 11 + (i % 2) * 0.3); b.castShadow = false; }
  egg(k, 'bananas', 14.4, 11.6, 'post', 0xf2d04a);
  rails(k, -30, 20, 30, 20); k.vehicle([P(-26, 20), P(26, 20)], { color: 0x8a3f6a, len: 7, h: 2, w: 1.6, stripe: 0xf4f2ec, speed: 4.6 });
  k.box(-20, 26, 14, 6, 9, { color: C.brick, roof: 'flat', roofColor: C.dark }); k.box(8, 27, 18, 5, 12, { color: 0xb8c2cc, roof: 'flat', roofColor: C.dark, win: 'bands' });
  k.row(-14, 15.6, 14, 15.6, 8); k.grove(-20, 6, 6, 8, 4);
  k.door = { x: 0, z: 6.4 }; k.spawn = { x: -4, z: 16 };
  k.path([P(-4, 16), P(-2, 11), P(0, 7)], 1.8);
  life(k, [[P(-4, 16), P(-2, 11), P(0, 7.4), P(-2, 11)], [P(-14, 12), P(14, 12)], [P(-14, 9.4), P(14, 9.4)]], { tour: [-9, 11], dogs: 4, bikes: 2, drone: true });
}

export function netflix(k) {
  k.ground({ color: k.snowCaps() ? 0xc9cfa0 : undefined });
  mountains(k, 'n', 0x8f9a7a, 6, 9); hill(k, -20, -20, 16, 10, 6, 0x9aa86a); hill(k, 18, -22, 18, 9, 7, 0x8f9f62);
  // low stucco buildings with red tile roofs round a courtyard
  const S = 0xeadfc6, R = 0xb5553f;
  for (const [x, z, w, d, h] of [[-12, -6, 16, 8, 6], [10, -8, 14, 8, 7], [-18, 8, 8, 12, 6], [18, 6, 8, 12, 6]]) { k.box(x, z, w, d, h, { color: S, roof: 'hip', roofColor: R, win: 'tall' }); }
  k.tower(0, -9, 4, 11, { color: S, cap: 'belfry', capColor: R });
  k.plaza(0, 4, 26, 12, 0xe4d3ae); fountain(k, 0, 4, 2); k.label('Los Gatos', 0, 16, -9);
  // a small marquee over the screening room door, and a mailbox with one red envelope
  k.box(10, -3.2, 6, 1.2, 0.6, { color: 0x3a4250, roof: 'none', win: 'none', y: 3.2, solid: false }); for (let i = 0; i < 6; i++) { const b = k.mesh(new THREE.IcosahedronGeometry(0.12, 0), 0xfff1c9, { emissive: 0xffe2a0, emissiveIntensity: 1 }); b.position.set(7.6 + i * 0.95, 3.2, -2.5); b.castShadow = false; }
  k.sign(10, -1.6, 'Screening room');
  k.box(-7, 9, 0.6, 0.5, 1.2, { color: 0x3f6f9f, roof: 'none', win: 'none', solid: false }); const env = k.mesh(new THREE.BoxGeometry(0.4, 0.28, 0.03), 0xc0392b); env.position.set(-7, 1.4, 9.3); egg(k, 'envelope', -7, 10.2, 'box', 0xc0392b);
  for (const [x, z] of [[-8, 1], [8, 1], [-8, 8], [8, 8], [-24, 22], [24, 20], [-2, 22], [12, 24]]) k.tree(x, z, 'palm');
  k.grove(-10, 22, 16, 8, 6); k.grove(22, 24, 8, 6, 4);
  k.path([P(-30, 17), P(30, 17)], 3, 0x8f8a84); k.vehicle([P(-26, 17), P(26, 17)], { color: 0xd9d4c8, len: 3, w: 1.4, h: 1.1, stripe: 0x3a4250, speed: 5 });
  k.door = { x: 10, z: -2.2 }; k.spawn = { x: 2, z: 13 };
  k.path([P(2, 13), P(2, 6), P(9, -1.6)], 1.8, 0xe4d3ae);
  life(k, [[P(2, 13), P(2, 7), P(9, -1.4), P(2, 7)], [P(-10, 4), P(10, 4)], [P(-20, 14.6), P(20, 14.6)]], { tour: [-4, 6], bikes: 1, scooters: 1 });
}

export function meta(k) {
  k.ground();
  // the salt marsh and the bay trail
  k.water(0, -26, 62, 10); k.patch(0, -19.6, 62, 4, 0xa8a878, 0.03); for (let i = 0; i < 26; i++) { const m = k.mesh(new THREE.ConeGeometry(0.12, 0.8, 4), 0xb8a86a); m.position.set(k.r.range(-29, 29), 0.4, k.r.range(-21.4, -18)); m.castShadow = false; }
  k.path([P(-30, -16), P(30, -16)], 1.6, 0xd9cdb0); k.sign(-22, -14.6, 'Bay Trail');
  // one very long, low building with a park on its roof
  k.box(0, -4, 50, 14, 6, { color: 0xb8c2cc, roof: 'none', win: 'bands' });
  const park = k.mesh(new THREE.BoxGeometry(49, 0.5, 13), k.season.lawn); park.position.set(0, 6.25, -4);
  for (let i = 0; i < 22; i++) k.tree(-23 + k.r.u() * 46, -4 + k.r.range(-5, 5), k.r.chance(0.3) ? 'bush' : 'round', k.r.range(0.6, 0.95), { y: 6.5 });
  const rp = []; for (let i = 0; i <= 8; i++) rp.push([-22 + i * 5.5, -4 + Math.sin(i * 0.9) * 3]);
  for (let i = 0; i < rp.length - 1; i++) { const [x1, z1] = rp[i], [x2, z2] = rp[i + 1]; const m = k.mesh(new THREE.BoxGeometry(1, 0.06, Math.hypot(x2 - x1, z2 - z1) + 0.6), 0xe2d8c3); m.position.set((x1 + x2) / 2, 6.55, (z1 + z2) / 2); m.rotation.y = Math.atan2(x2 - x1, z2 - z1); m.castShadow = false; }
  for (let i = 0; i < 4; i++) { const f = k.figure(k.r.pick([0x35507a, 0xa64b3c, 0x4f7d5c]), 0.9); k.g.add(f); k.anim.push((t) => { const u = ((t * 0.02 + i * 0.25) % 1) * 8, j = Math.floor(u), q = u - j; const a = rp[j], b = rp[j + 1]; f.position.set(a[0] + (b[0] - a[0]) * q, 6.55, a[1] + (b[1] - a[1]) * q); f.rotation.y = Math.atan2(b[0] - a[0], b[1] - a[1]); }); }
  k.label('The roof park', 0, 12, -4);
  // a fox that lives on the campus
  const fox = k.mesh(new THREE.BoxGeometry(0.3, 0.3, 0.8), 0xd9742b); const tail = k.mesh(new THREE.ConeGeometry(0.14, 0.6, 5).rotateX(-Math.PI / 2), 0xf4f2ec); k.anim.push((t) => { const a = t * 0.15; fox.position.set(-16 + Math.cos(a) * 5, 0.25, 18 + Math.sin(a) * 3); fox.rotation.y = -a; tail.position.set(fox.position.x - Math.sin(-a) * 0.6, 0.3, fox.position.z - Math.cos(-a) * 0.6); tail.rotation.y = -a; });
  egg(k, 'fox', -16, 18, 'animal', 0xd9742b);
  k.plaza(0, 8, 30, 8, 0xd4d0c6); k.box(-20, 12, 8, 8, 5, { color: 0xd24d3e, roof: 'green', win: 'bands' }); k.box(20, 14, 10, 8, 5, { color: 0xe2b23a, roof: 'solar', win: 'bands' });
  k.grove(4, 22, 30, 8, 10); k.row(-14, 4.6, 14, 4.6, 8);
  k.rooms = [{ x: 0, z: 3.6, label: 'Session room', ids: ['IV-3', 'IV-13'] }]; k.door = k.rooms[0]; k.spawn = { x: 4, z: 16 };
  k.path([P(4, 16), P(2, 9), P(0, 4)], 1.8);
  life(k, [[P(4, 16), P(2, 9), P(0, 4.4), P(2, 9)], [P(-26, -16), P(26, -16)], [P(-12, 9), P(12, 9)]], { tour: [8, 9], bikes: 4, drone: true });
}

export function sf(k) {
  k.ground(); k.weather = 'fog';
  // the bay on the east, a ball park's worth of open water and a pier
  k.water(26, 0, 9, 62); const pier = k.mesh(new THREE.BoxGeometry(6, 0.4, 2), C.wood); pier.position.set(24, 0.4, 10); k.boat(26, -10, 1.6, 10, 0.1);
  // Mission Bay: glass buildings joined by skybridges
  for (const [x, z, w, d, h] of [[8, 12, 9, 8, 12], [8, 24, 9, 8, 14], [-3, 18, 8, 12, 10]]) k.glass(x, z, w, d, h, { roofColor: C.dark });
  for (const [x, z, w, d] of [[8, 18, 2, 4], [2.6, 14, 3, 2], [2.6, 23, 3, 2]]) { const b = k.mesh(new THREE.BoxGeometry(w, 1.6, d), C.glass, { transparent: true, opacity: 0.7 }); b.position.set(x, 7, z); }
  k.sign(1, 10.6, 'Mission Bay'); k.plaza(2, 8, 20, 4);
  // downtown: an office among towers, and one pyramid on the skyline
  for (const [x, z, w, d, h, c] of [[-16, -16, 8, 8, 20, 0xcfc7b8], [-6, -18, 7, 7, 26, 0xb8c2cc], [4, -16, 8, 8, 16, 0xd9d4c8], [-22, -6, 7, 8, 14, 0xb9ab8f], [12, -22, 6, 6, 22, 0xaab4bd]]) k.box(x, z, w, d, h, { color: c, roof: 'flat', roofColor: C.dark, win: 'bands' });
  const pyr = k.mesh(new THREE.ConeGeometry(3, 30, 4), 0xe9e4d6); pyr.position.set(18, 15, -14); pyr.rotation.y = Math.PI / 4;
  k.box(-12, -6, 9, 7, 11, { color: 0xe4dccb, roof: 'green', win: 'grid' }); k.sign(-12, -1.6, 'Downtown office');
  // the tram between the two quarters, on a steep street
  k.path([P(-10, 28), P(-8, 4), P(-4, -10)], 3, 0x8f8a84); rails(k, -9.4, 26, -7.6, 4);
  k.vehicle([P(-9.4, 24), P(-7.2, 0)], { color: 0x8a2f3a, len: 4.4, h: 1.9, w: 1.5, stripe: 0xe9d9a8, speed: 3, pause: 3 });
  // wild parrots in a small park
  k.lawn(-20, 12, 12, 12); k.grove(-20, 12, 9, 9, 6);
  for (let i = 0; i < 5; i++) { const p = k.mesh(new THREE.ConeGeometry(0.14, 0.5, 4).rotateX(Math.PI / 2), i % 2 ? 0x4fae4a : 0xd24d3e); k.anim.push((t) => { const a = t * 0.9 + i * 1.2; p.position.set(-20 + Math.cos(a) * (3 + i * 0.4), 5 + Math.sin(t * 2 + i) * 0.6, 12 + Math.sin(a) * (3 + i * 0.4)); p.rotation.y = -a + Math.PI; }); }
  egg(k, 'parrots', -16, 16, 'bird', 0x4fae4a);
  k.rooms = [{ x: 2, z: 11.4, label: 'Mission Bay', ids: ['IV-8', 'IV-9', 'IV-10', 'IV-12'] }, { x: -12, z: -1.6, label: 'Downtown office', ids: ['IV-17'] }]; k.door = k.rooms[0]; k.spawn = { x: -2, z: 4 };
  k.path([P(-2, 4), P(0, 8), P(2, 11)], 1.8); k.path([P(-2, 4), P(-8, 0), P(-12, -1.4)], 1.8);
  life(k, [[P(-2, 4), P(0, 8), P(2, 10.6), P(0, 8)], [P(-2, 4), P(-8, 1), P(-12, -1), P(-8, 1)], [P(-6, 8.2), P(14, 8.2)]], { tour: [8, 8], bikes: 2, dogs: 2 });
}

export const PLACES_CO = { microsoft, google, apple, nvidia, ibm, belllabs, amazon, netflix, meta, sf };
