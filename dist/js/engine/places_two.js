// Places first visited in Parts II to IV.
import { C } from './kit.js';
import { colonnade, hill, fountain, bridge, statue, stairs, mountains, life, egg, horse, rails, THREE } from './parts.js';

const P = (x, z) => [x, z];

export function unc(k) {
  k.ground();
  // the Old Well: a little rotunda at the heart of the campus
  k.disc(-4, 4, 4, 0xd6cdb8, 0.03); k.cyl(-4, 4, 1.1, 0.5, { color: C.stone, roof: 'none', solid: false });
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; const c = k.mesh(new THREE.CylinderGeometry(0.14, 0.16, 2.8, 7), 0xfaf8f2); c.position.set(-4 + Math.cos(a) * 1.9, 1.7, 4 + Math.sin(a) * 1.9); }
  const dome = k.mesh(new THREE.SphereGeometry(2.3, 14, 7, 0, Math.PI * 2, 0, Math.PI / 2), 0xfaf8f2); dome.position.set(-4, 3.1, 4); dome.scale.y = 0.7;
  k.label('The Old Well', -4, 7, 4); egg(k, 'oldwell', -4, 4, 'pot', 0x6fa59a, 0.5);
  // the quad and the library with its dome
  k.lawn(6, -8, 16, 26); k.path([P(-1, -20), P(-1, 3)], 1.4); k.path([P(13, -20), P(13, 3)], 1.4); k.path([P(-1, -8), P(13, -8)], 1.2);
  k.box(6, -25, 18, 7, 8, { color: 0xe4dccb, roof: 'flat', roofColor: C.stone, win: 'tall' }); colonnade(k, 6, -20.8, 10, 6, 7, { color: 0xe4dccb }); k.cyl(6, -25, 4, 1.5, { color: 0xe4dccb, roof: 'dome', roofColor: C.copper, y: 8, solid: false, seg: 16 });
  k.sign(14.5, -19.6, 'Polk Place');
  for (const [x, z] of [[-9, -18], [-9, -6], [21, -18], [21, -6], [21, 6]]) k.box(x, z, 8, 9, 6.5, { color: C.brick, roof: 'hip', roofColor: C.slate });
  k.box(-14, 10, 12, 7, 6, { color: C.brick, roof: 'gable', roofColor: C.slate }); k.box(8, 12, 12, 6, 6, { color: C.brickDark, roof: 'hip', roofColor: C.slate });
  k.tower(-22, 22, 3.4, 16, { color: C.brick, cap: 'spire', capColor: C.copper });
  k.grove(-20, -2, 8, 10, 6); k.grove(0, 22, 26, 8, 10); k.row(1, -19, 1, 0, 6); k.row(11, -19, 11, 0, 6);
  k.door = { x: -1.6, z: 9.4 }; k.spawn = { x: 4, z: 17 };
  k.path([P(4, 17), P(0, 10), P(-3, 7)], 1.8);
  life(k, [[P(4, 17), P(0, 10), P(-1, 2), P(-1, -18), P(13, -18), P(13, 2), P(0, 10)], [P(-16, 16), P(-2, 15), P(14, 17), P(-2, 15)]], { tour: [5, 3], mower: [6, -8, 10, 18] });
}

export function columbia(k) {
  k.ground();
  // two libraries facing each other across the steps: the dome to the north, the colonnade to the south
  k.box(0, -18, 16, 12, 8, { color: 0xe4dccb, roof: 'flat', roofColor: C.stone, win: 'tall' }); k.cyl(0, -18, 6, 2.4, { color: 0xe4dccb, roof: 'dome', roofColor: 0xcfd6d2, y: 8, solid: false, seg: 18 }); colonnade(k, 0, -11.4, 12, 10, 6.5, { color: 0xe4dccb });
  stairs(k, 0, -6, 22, 8, 6, 0, 0xd9d2c2); k.label('Low Library', 0, 18, -18);
  // the seated bronze, with an owl hidden in the folds of her robe
  k.box(0, -4.6, 2.2, 1.6, 1.4, { color: C.stone, roof: 'none', win: 'none', solid: false }); const am = k.statueFigure(0x5f7a6a, 1.5); am.position.set(0, 1.4, -4.6); k.g.add(am);
  egg(k, 'owl', 1.6, -3.8, 'bird', 0x5f7a6a, 1);
  k.plaza(0, 4, 40, 10, 0xc9b9a0); k.lawn(-9, 12.5, 12, 6); k.lawn(9, 12.5, 12, 6);
  k.box(0, 21, 30, 7, 9, { color: 0xe4dccb, roof: 'flat', roofColor: C.stone, win: 'tall' }); colonnade(k, 0, 16.8, 24, 14, 7.5, { color: 0xe4dccb, rot: Math.PI, pediment: false }); k.label('Butler Library', 0, 14, 21);
  for (const [x, z] of [[-22, -16], [-22, -2], [-22, 14], [22, -16], [22, -2], [22, 14]]) k.box(x, z, 8, 11, 10, { color: C.brick, roof: 'hip', roofColor: C.copper, win: 'grid' });
  fountain(k, -12, 4, 1.8); fountain(k, 12, 4, 1.8); k.row(-14, 9, -4, 9, 4); k.row(4, 9, 14, 9, 4);
  k.door = { x: 0, z: 15 }; k.spawn = { x: -4, z: 4 };
  life(k, [[P(-16, 2), P(16, 2), P(16, 6.5), P(-16, 6.5)], [P(-4, 4), P(0, 9), P(0, 14.4), P(0, 9)], [P(-8, -2), P(8, -2)]], { line: [[-4, 4], [0, 9], [0, 14.6]], tour: [6, 0], bikes: 0, scooters: 2 });
}

export function berkeley(k) {
  k.ground();
  hill(k, 22, -20, 18, 16, 9, 0xa9b46a);
  // the bell tower
  k.box(4, -4, 3.6, 3.6, 26, { color: 0xe9e4d6, roof: 'none', win: 'none' }); k.box(4, -4, 4.2, 4.2, 3, { color: 0xe9e4d6, roof: 'none', win: 'tall', y: 26, solid: false });
  const sp = k.mesh(new THREE.ConeGeometry(2.6, 6, 4).rotateY(Math.PI / 4), 0xe9e4d6); sp.position.set(4, 32, -4); k.plaza(4, -4, 10, 10); k.label('The Campanile', 4, 37, -4);
  // falcons nest at the top and circle it
  for (let i = 0; i < 2; i++) { const b = k.mesh(new THREE.ConeGeometry(0.22, 0.8, 3).rotateX(Math.PI / 2), 0x5a5048); k.anim.push((t) => { const a = t * 0.6 + i * 3; b.position.set(4 + Math.cos(a) * 5, 30 + Math.sin(t + i) * 1.2, -4 + Math.sin(a) * 5); b.rotation.y = -a + Math.PI; }); }
  egg(k, 'falcons', 6.6, -1.4, 'bird', 0x5a5048);
  // the glade and the old library
  k.lawn(-12, 6, 20, 16); k.box(-14, -10, 20, 9, 9, { color: 0xe4dccb, roof: 'hip', roofColor: C.red, win: 'tall' }); colonnade(k, -14, -4.8, 12, 8, 7, { color: 0xe4dccb, pediment: false }); k.sign(-3, -4, 'Doe Library');
  k.sign(-12, 15.4, 'Memorial Glade');
  k.box(-22, 20, 12, 7, 7, { color: 0xd9cdb0, roof: 'hip', roofColor: C.red }); k.box(18, 12, 12, 9, 8, { color: C.concrete, roof: 'solar', win: 'bands' }); k.box(16, 24, 10, 6, 6, { color: 0xd9cdb0, roof: 'hip', roofColor: C.red });
  k.arch(4, 20, 5, 6, { color: C.copper }); k.sign(8, 20.6, 'Sather Gate');
  k.river([P(-30, 26), P(-14, 27), P(-2, 25), P(2, 30)], 1.6);
  k.grove(22, -4, 10, 10, 8, ['cone', 'round']); k.grove(-24, 6, 6, 10, 5, 'cone'); k.row(-1, 2, -1, 16, 5);
  k.door = { x: -14, z: -3.6 }; k.spawn = { x: 4, z: 16 };
  k.path([P(4, 20), P(4, 4)], 2); k.path([P(4, 8), P(-6, 2), P(-14, -3)], 1.8);
  life(k, [[P(4, 16), P(4, 8), P(-6, 2), P(-13, -2.6), P(-6, 2), P(4, 8)], [P(-20, 12), P(-6, 13), P(2, 12), P(-6, 13)], [P(8, 2), P(14, 4), P(10, 16)]], { tour: [8, 6], bikes: 2, families: 3 });
}

export function santafe(k) {
  const sand = k.snowCaps() ? 0xe9e2d6 : 0xd9c29a;
  k.ground({ color: sand });
  mountains(k, 'n', 0x9a8f9f, 7, 12); mountains(k, 'e', 0xa89aa8, 5, 9);
  // adobe rooms stepping up a hill of juniper and pinyon
  hill(k, -4, -6, 26, 18, 3, sand);
  const A = 0xc99a6a, A2 = 0xb98a5c;
  for (const [x, z, w, d, h, y] of [[-10, -8, 12, 8, 4, 2.6], [-1, -10, 8, 7, 5.5, 2.8], [6, -6, 10, 8, 4, 2.4], [-6, -1.5, 9, 5, 3.4, 1.8], [8, 1, 7, 5, 3.4, 1.4]]) {
    k.box(x, z, w, d, h, { color: (x + z) % 2 ? A : A2, roof: 'none', win: 'grid', y });
    for (let i = 0; i < 4; i++) { const v = k.mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.9, 5).rotateX(Math.PI / 2), C.wood); v.position.set(x - w / 2 + (w * (i + 0.5)) / 4, y + h - 0.5, z + d / 2 + 0.3); v.castShadow = false; }
  }
  k.label('The Institute', -2, 13, -8);
  k.plaza(0, 5.6, 16, 4, 0xcbb089); for (const [x, z] of [[-5, 6], [0, 5.4], [5, 6.2]]) { const t = k.mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.1, 10), 0xf1e8d2); t.position.set(x, 1, z); }
  // scrub
  for (let i = 0; i < 46; i++) { const x = k.r.range(-28, 28), z = k.r.range(-26, 28); if (Math.abs(x) < 14 && z > -14 && z < 9) continue; k.tree(x, z, k.r.chance(0.6) ? 'scrub' : 'cone', k.r.range(0.5, 0.9), { colors: [0x7f8f62, 0x6f8258, 0x8a9a6a] }); }
  // a roadrunner on the path
  const rr = k.mesh(new THREE.BoxGeometry(0.2, 0.25, 0.7), 0x7a6a5a); k.anim.push((t) => { const u = (t * 0.06) % 1; rr.position.set(-22 + u * 40, 0.3, 16 + Math.sin(u * 20) * 0.4); rr.rotation.y = Math.PI / 2; });
  egg(k, 'roadrunner', 6, 17.4, 'bird', 0x7a6a5a);
  k.door = { x: 0, z: 8.4 }; k.spawn = { x: 6, z: 22 };
  k.path([P(6, 22), P(2, 14), P(0, 9)], 1.8, 0xcbb089); k.path([P(-24, 16), P(22, 16)], 1.4, 0xcbb089);
  life(k, [[P(6, 22), P(2, 14), P(0, 9.4), P(2, 14)], [P(-22, 16), P(20, 16)], [P(-8, 6), P(8, 6)]], { adults: 3, kids: 1, bikes: 1, dogs: 1, prams: 0, scooters: 0, families: 1, birds: 3, tour: [10, 12] });
}

export function cornell(k) {
  k.ground();
  // the gorge, the waterfall and the footbridge
  k.patch(-23, 0, 8, 62, 0x6f6a64, 0.02); k.river([P(-23, -30), P(-22, -8), P(-24, 10), P(-23, 30)], 3);
  const fall = k.mesh(new THREE.BoxGeometry(3.2, 0.3, 2), 0xffffff, { transparent: true, opacity: 0.8 }); fall.position.set(-22.4, 0.25, -6); k.anim.push((t) => { fall.material.opacity = 0.65 + Math.sin(t * 6) * 0.15; });
  bridge(k, -28, 6, -18, 6, 1.8, C.steel);
  // the clock tower and the library beside it
  k.tower(-6, -8, 4, 22, { color: 0xbfb5a2, cap: 'spire', capColor: 0x8a8f96 });
  const clock = k.mesh(new THREE.CircleGeometry(1.3, 16), 0xf4f2ec); clock.position.set(-6, 18, -5.95);
  k.box(-13, -10, 10, 8, 8, { color: 0xbfb5a2, roof: 'gable', roofColor: C.slate, win: 'tall' }); k.label('McGraw Tower', -6, 33, -8);
  // one October a pumpkin appeared on the very top
  const pk = k.mesh(new THREE.IcosahedronGeometry(0.45, 1), 0xe07b22); pk.position.set(-6, 30.1, -8); k.pick(pk, { type: 'egg', id: 'pumpkin', x: -6, z: -4.5 }); egg(k, 'pumpkin', -3.4, -4.6, 'pumpkin');
  // the slope down to the west, and the quad
  k.lawn(-12, 8, 12, 20); k.sign(-12, 18.6, 'The Slope'); k.lawn(10, -6, 20, 14);
  k.box(10, -20, 18, 7, 8, { color: 0xc9b89a, roof: 'hip', roofColor: C.slate, win: 'tall' }); k.box(24, -6, 7, 16, 8, { color: C.brick, roof: 'hip', roofColor: C.slate }); k.box(10, 8, 16, 6, 7, { color: 0xbfb5a2, roof: 'gable', roofColor: C.slate, win: 'tall' });
  statue(k, 4, -6, 2); statue(k, 16, -6, 2);
  k.box(14, 22, 14, 8, 9, { color: C.concrete, roof: 'solar', win: 'bands' }); k.glass(14, 17.4, 8, 1.6, 9); k.sign(5.6, 17.6, 'Gates Hall');
  k.grove(-14, 24, 8, 6, 5); k.grove(26, 14, 6, 12, 5); k.row(0, 2, 22, 2, 7);
  k.rooms = [{ x: 1, z: 6, label: 'Rosenblatt session', ids: ['II-12'] }, { x: 8.6, z: 17, label: 'Gates Hall', ids: ['IV-15'] }]; k.door = k.rooms[0]; k.spawn = { x: -2, z: 14 };
  k.path([P(-2, 14), P(-1, 6), P(-4, -4)], 1.8); k.path([P(-2, 14), P(8, 16.6)], 1.6); k.path([P(-1, 6), P(-17, 6)], 1.4);
  life(k, [[P(-2, 14), P(-1, 6), P(-4, -3), P(-1, 6)], [P(-17, 6), P(-1, 6), P(8, 4), P(-1, 6)], [P(-2, 14), P(8, 16), P(-2, 20)]], { tour: [-10, 10], bikes: 1 });
}

export function ucsd(k) {
  k.ground({ color: k.snowCaps() ? 0xbfc79a : undefined });
  // the library: a concrete stem holding up glass floors that widen as they rise
  k.cyl(0, -6, 3, 5, { color: C.concrete, roof: 'none', seg: 8 });
  for (let i = 0; i < 5; i++) { const w = [9, 13, 16, 13, 9][i]; const m = k.mesh(new THREE.CylinderGeometry(w * 0.72, w * 0.72, 2.2, 8), i % 2 ? C.concrete : C.glass, i % 2 ? {} : { transparent: true, opacity: 0.7, roughness: 0.15, metalness: 0.2 }); m.position.set(0, 6.1 + i * 2.2, -6); m.rotation.y = Math.PI / 8; }
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2 + Math.PI / 8; const s = k.mesh(new THREE.BoxGeometry(0.7, 8, 0.7), C.concrete); s.position.set(Math.cos(a) * 5.4, 3.4, -6 + Math.sin(a) * 5.4); s.rotation.z = -Math.cos(a) * 0.6; s.rotation.x = Math.sin(a) * 0.6; }
  k.obstacles.push({ x0: -6, x1: 6, z0: -12, z1: 0 }); k.plaza(0, 4, 18, 9); k.label('Geisel Library', 0, 20, -6);
  // an engineering block with a small house hanging off one corner of its roof
  k.box(20, -12, 10, 10, 15, { color: 0xd9d4c8, roof: 'flat', roofColor: C.dark, win: 'bands' });
  const hs = k.box(24.2, -7.8, 2.6, 2.6, 2, { color: 0x6fa0c8, roof: 'gable', roofColor: C.slate, win: 'none', y: 14.4, rot: 0.5, solid: false }); hs.rotation.z = 0.12;
  egg(k, 'fallenstar', 24.6, -4.6, 'post', 0x6fa0c8);
  k.box(-20, -12, 10, 12, 8, { color: C.concrete, roof: 'solar', win: 'bands' }); k.box(-20, 10, 12, 8, 6, { color: 0xd9c9a8, roof: 'green', win: 'bands' }); k.box(18, 12, 12, 8, 7, { color: C.concrete, roof: 'flat', roofColor: C.dark, win: 'bands' });
  // a walk paved like a snake, and the eucalyptus grove
  for (let i = 0; i < 22; i++) k.disc(-6 + Math.sin(i * 0.55) * 3, 9 + i * 0.9, 0.8, i % 2 ? 0x5f7a6a : 0x7f9a84, 0.04);
  for (let i = 0; i < 22; i++) { const x = k.r.range(-28, 28), z = k.r.range(14, 28); if (Math.abs(x + 6) < 5) continue; k.tree(x, z, 'gum', k.r.range(1, 1.5)); }
  for (const [x, z] of [[-10, 2], [10, 2], [-26, -24], [26, 2]]) k.tree(x, z, 'palm');
  k.door = { x: 0, z: 0.6 }; k.spawn = { x: -4, z: 14 };
  k.path([P(-4, 14), P(-2, 6), P(0, 1)], 1.8);
  life(k, [[P(-4, 14), P(-2, 6), P(0, 1.6), P(-2, 6)], [P(-16, 4), P(16, 4)], [P(8, 8), P(16, 6.4), P(22, 0)]], { tour: [6, 5], bikes: 2, scooters: 2, drone: true });
}

export function toronto(k) {
  k.ground();
  // the library: a concrete bird with its tail up
  k.box(-6, -10, 16, 14, 16, { color: 0xbdb8ae, roof: 'flat', roofColor: 0x8f8a80, win: 'bands' });
  for (const [x, z, r] of [[-17, -3, 0.5], [5, -3, -0.5], [-6, -20, 0]]) k.box(x, z, 8, 8, 12, { color: 0xbdb8ae, roof: 'flat', roofColor: 0x8f8a80, win: 'bands', rot: r });
  const beak = k.mesh(new THREE.ConeGeometry(3, 8, 3), 0xbdb8ae); beak.position.set(-6, 13, -1.6); beak.rotation.x = Math.PI / 2.4;
  k.label('Robarts Library', -6, 21, -10); egg(k, 'peacock', -1, 1.6, 'bird', 0x3f7fb5);
  // the needle on the skyline, and the old college
  k.cyl(24, -24, 0.9, 30, { color: C.concrete, roof: 'none', seg: 8, top: 0.5 }); k.cyl(24, -24, 2.2, 1.6, { color: C.concrete, roof: 'cone', roofColor: C.concrete, roofH: 9, y: 22, solid: false, seg: 10 });
  k.box(16, 8, 18, 6, 7, { color: 0xb9ab8f, roof: 'gable', roofColor: C.slate, win: 'tall' }); k.tower(16, 8, 3.6, 14, { color: 0xb9ab8f, cap: 'belfry', capColor: C.slate }); k.sign(6, 12, 'University College');
  k.lawn(14, 18, 20, 12); k.disc(14, 18, 4.5, k.season.grass, 0.03);
  k.box(-20, 14, 10, 10, 7, { color: C.brick, roof: 'hip', roofColor: C.slate }); k.box(22, -6, 8, 10, 12, { color: 0xb8c2cc, roof: 'flat', roofColor: C.dark, win: 'bands' });
  rails(k, -30, 4.5, 30, 4.5); k.vehicle([P(-26, 4.5), P(26, 4.5)], { color: 0xc0392b, len: 6.4, h: 1.9, stripe: 0xf4f2ec, speed: 5 });
  k.grove(-6, 22, 12, 8, 7, ['round', 'cone']); k.row(-24, 1, 26, 1, 10);
  k.door = { x: -6, z: -2.2 }; k.spawn = { x: 2, z: 12 };
  k.path([P(2, 12), P(0, 6), P(-5, -1.6)], 1.8);
  life(k, [[P(2, 12), P(0, 6), P(-5, -1), P(0, 6)], [P(-24, 7.4), P(24, 7.4)], [P(6, 16), P(14, 13), P(22, 16), P(14, 23)]], { tour: [-12, 7.6], bikes: 2 });
}

export function manchester(k) {
  k.ground();
  // the old quadrangle on the main road: dark stone, a tall tower over the gate
  const S = 0x9a8e7c;
  k.box(-8, -12, 26, 5, 8, { color: S, roof: 'gable', roofColor: C.slate, win: 'tall' }); k.box(-21, -2, 5, 16, 8, { color: S, roof: 'gable', roofColor: C.slate, win: 'tall' }); k.box(5, -2, 5, 16, 8, { color: S, roof: 'gable', roofColor: C.slate, win: 'tall' });
  k.box(-12, 7.4, 14, 4, 8, { color: S, roof: 'gable', roofColor: C.slate, win: 'tall' }); k.tower(-1, 7.4, 5, 17, { color: S, cap: 'belfry', capColor: C.slate }); k.arch(-1, 10.2, 4, 5, { color: S });
  k.lawn(-8, -2, 18, 10); k.label('Old Quadrangle', -8, 14, -12);
  // the main road, with buses, and red-brick mills beyond
  k.path([P(-30, 14), P(30, 14)], 4, 0x8f8a84); k.vehicle([P(-26, 13.2), P(26, 13.2)], { color: 0xe2b23a, len: 5, h: 2.6, w: 1.7, stripe: 0x24406e, speed: 4.5 }); k.vehicle([P(26, 14.9), P(-26, 14.9)], { color: 0xc0392b, len: 5, h: 2.6, w: 1.7, stripe: 0xf4f2ec, speed: 4 });
  for (let i = 0; i < 5; i++) k.box(-22 + i * 10, 22, 8, 7, 7 + (i % 2) * 3, { color: i % 2 ? C.brick : C.brickDark, roof: 'flat', roofColor: C.dark, win: 'grid' });
  k.box(20, -8, 12, 12, 9, { color: C.brick, roof: 'hip', roofColor: C.slate }); k.glass(20, 2, 10, 5, 11);
  // a bench in a small garden, with one figure sitting and an apple beside him; and the city's bees
  k.lawn(16, 8.2, 10, 5); k.bench(16, 8.4, Math.PI, false); const tb = k.statueFigure(0x6f7f72, 0.95); tb.position.set(15.6, 0.1, 8.5); k.g.add(tb); const ap = k.mesh(new THREE.IcosahedronGeometry(0.14, 1), 0xb5483f); ap.position.set(16.6, 0.6, 8.5);
  egg(k, 'bees', 12.4, 9.6, 'ball', 0xe2b23a);
  k.grove(22, 9, 5, 4, 3); k.row(-18, 2, 2, 2, 5);
  k.door = { x: -1, z: 4.6 }; k.spawn = { x: -1, z: 11.6 };
  k.path([P(-1, 11.6), P(-1, 3), P(-8, -3)], 1.8);
  life(k, [[P(-24, 11.6), P(24, 11.6)], [P(-1, 11), P(-1, 3), P(-14, -3), P(-1, 3)], [P(10, 8), P(20, 6), P(10, 6)]], { line: [[-1, 11], [-1, 5.2]], tour: [-8, 2], bikes: 2, dogs: 2 });
}

export function cmu(k) {
  k.ground();
  // two dark, angular halls joined by a ramp that winds between them
  for (const [x, z, w, d, h, r] of [[-8, -10, 14, 10, 13, 0.12], [8, -14, 12, 9, 16, -0.2], [0, -2, 9, 6, 8, 0.3]]) k.box(x, z, w, d, h, { color: 0x4a4f57, roof: 'green', win: 'grid', rot: r });
  const helix = k.mesh(new THREE.TorusGeometry(4, 0.5, 6, 20, Math.PI * 1.5), 0xb8c2cc); helix.position.set(1, 6, -8); helix.rotation.x = Math.PI / 2 - 0.25;
  k.label('Gates and Hillman Centers', 0, 20, -12);
  // the old hall with a rotunda on its roof
  k.box(-22, 8, 10, 14, 9, { color: 0xd9c9a8, roof: 'flat', roofColor: C.stone, win: 'tall' }); k.cyl(-22, 8, 2.6, 5, { color: 0xd9c9a8, roof: 'dome', roofColor: C.copper, y: 9.2, solid: false, seg: 12 });
  k.lawn(4, 12, 28, 12); k.sign(4, 19, 'The Cut');
  // the fence that students repaint by night, and a drinks machine with a network cable
  for (let i = 0; i < 9; i++) { const p = k.mesh(new THREE.BoxGeometry(0.3, 1.2, 0.3), [0xd24d3e, 0xe2b23a, 0x3f7fb5, 0x4f9a54, 0x8a6aa8][i % 5]); p.position.set(-4 + i * 1.2, 0.6, 10); } const rail = k.mesh(new THREE.BoxGeometry(10.4, 0.25, 0.3), 0xd24d3e); rail.position.set(0.8, 0.95, 10);
  k.box(13, 3.4, 1.2, 0.9, 2.2, { color: 0xc0392b, roof: 'none', win: 'none', solid: false }); egg(k, 'cokemachine', 13, 4.6, 'box', 0xc0392b);
  k.box(22, 6, 9, 12, 8, { color: C.brick, roof: 'hip', roofColor: C.slate }); k.box(20, 22, 14, 6, 6, { color: 0xd9c9a8, roof: 'flat', roofColor: C.stone }); k.box(-8, 24, 14, 5, 6, { color: C.brickDark, roof: 'hip', roofColor: C.slate });
  // a small robot car doing laps
  k.vehicle([P(-12, 16.5), P(18, 16.5)], { color: 0xf4f2ec, len: 1.6, w: 0.9, h: 0.6, y: 0.1, stripe: 0x2f6f8f, speed: 3, pause: 1 });
  k.grove(-24, -14, 8, 16, 6); k.row(-10, 6, 16, 6, 7);
  k.door = { x: 1, z: 2 }; k.spawn = { x: 4, z: 14 };
  k.path([P(4, 14), P(2, 8), P(1, 2.6)], 1.8);
  life(k, [[P(4, 14), P(2, 8), P(1, 3), P(2, 8)], [P(-14, 13), P(18, 13)], [P(-16, 4), P(-4, 5), P(14, 5), P(-4, 5)]], { tour: [8, 8], drone: true });
}

export function berlin(k) {
  k.ground();
  // a tenement courtyard in the north of the city, with a horse and a small crowd
  const T = [0xd9cdb6, 0xc9bca0, 0xe4dccb];
  k.box(-14, -18, 20, 5, 12, { color: T[0], roof: 'gable', roofColor: C.red, win: 'grid' }); k.box(-23, -8, 4.6, 16, 12, { color: T[1], roof: 'gable', roofColor: C.red, win: 'grid' }); k.box(-5, -8, 4.6, 16, 12, { color: T[2], roof: 'gable', roofColor: C.red, win: 'grid' });
  k.plaza(-14, -7, 13, 15, 0xb8ad98);
  const { legs } = horse(k, -14, -8); let tapping = true;
  k.anim.push((t) => { legs[0].rotation.x = tapping ? Math.max(0, Math.sin(t * 5)) * -0.7 : 0; });
  k.tapHorse = (v) => { tapping = v; };
  const q = k.figure(0x3a4250, 1); q.position.set(-14, 0, -4.6); q.rotation.y = Math.PI; k.g.add(q);
  for (let i = 0; i < 5; i++) { const f = k.figure(k.r.pick([0x6b6f7a, 0x8a6a4a, 0x4f6a5c]), i < 2 ? 0.6 : 0.95); f.position.set(-18 + i * 1.8, 0, -2.4 + (i % 2) * 0.6); f.rotation.y = Math.PI; k.g.add(f); }
  k.label('The courtyard', -14, 15, -14); egg(k, 'hans', -11.4, -5.2, 'post', 0xefe6d2);
  // the avenue of lindens and the university behind its forecourt
  k.path([P(-30, 12), P(30, 12)], 5, 0xb8b2a6); k.row(-26, 12, 26, 12, 14);
  k.box(8, 22, 22, 6, 8, { color: 0xe4dccb, roof: 'flat', roofColor: C.stone, win: 'tall' }); k.box(-1.4, 18, 4, 8, 8, { color: 0xe4dccb, roof: 'flat', roofColor: C.stone, win: 'tall' }); k.box(17.4, 18, 4, 8, 8, { color: 0xe4dccb, roof: 'flat', roofColor: C.stone, win: 'tall' });
  statue(k, 4, 15.6, 1.8); statue(k, 12, 15.6, 1.8); k.sign(8, 15, 'University');
  // the television tower on the skyline, and a gate with horses on top
  k.cyl(24, -22, 0.8, 26, { color: C.concrete, roof: 'none', seg: 8, top: 0.4 }); k.sphere(24, 22, -22, 2.4, 0xcfd6d8); const ant = k.mesh(new THREE.CylinderGeometry(0.08, 0.2, 8, 5), 0xc0392b); ant.position.set(24, 28, -22);
  for (let i = 0; i < 4; i++) k.box(10 + i * 2.4, -6, 0.9, 2, 6, { color: 0xd9cdb0, roof: 'none', win: 'none', solid: false }); k.box(13.6, -6, 9.4, 2.4, 1.4, { color: 0xd9cdb0, roof: 'none', win: 'none', y: 6, solid: false });
  k.box(22, 0, 8, 10, 9, { color: T[1], roof: 'hip', roofColor: C.slate }); k.box(6, -20, 10, 8, 10, { color: T[0], roof: 'hip', roofColor: C.red });
  k.vehicle([P(-26, 10.6), P(26, 10.6)], { color: 0xe2b23a, len: 5.4, h: 2.6, w: 1.7, stripe: 0x3a4250, speed: 4.2 });
  k.door = { x: -9.4, z: 2.4 }; k.spawn = { x: 0, z: 8 };
  k.path([P(0, 8), P(-8, 4), P(-12, 0)], 1.8);
  life(k, [[P(0, 8), P(-8, 4), P(-12, 1), P(-8, 4)], [P(-24, 8.6), P(24, 8.6)], [P(6, 0), P(14, -2), P(18, 4)]], { tour: [14, 4], bikes: 3 });
}

export function montreal(k) {
  k.ground();
  // the mountain with its cross, and the university tower on its flank
  hill(k, -8, -18, 30, 16, 10, k.snowCaps() ? 0xe6ecef : 0x8f9a6a); for (let i = 0; i < 26; i++) { const tx = k.r.range(-22, 22), tz = k.r.range(-9, 7); k.tree(-8 + tx, -18 + tz, 'cone', k.r.range(0.7, 1.1), { y: Math.max(0.5, 9.4 * Math.sqrt(Math.max(0, 1 - (tx / 30) ** 2 - (tz / 16) ** 2))) }); }
  const cx = k.mesh(new THREE.BoxGeometry(0.3, 5, 0.3), 0xf4f2ec, { emissive: 0xfff1c9, emissiveIntensity: 0.4 }); cx.position.set(-2, 12.4, -18); const cy = k.mesh(new THREE.BoxGeometry(2.4, 0.3, 0.3), 0xf4f2ec, { emissive: 0xfff1c9, emissiveIntensity: 0.4 }); cy.position.set(-2, 13.4, -18);
  k.box(-20, -8, 16, 6, 7, { color: 0xe2d2a8, roof: 'flat', roofColor: C.stone, win: 'tall', y: 2.6 }); k.tower(-20, -8, 4, 20, { color: 0xe2d2a8, cap: 'none' }); k.cyl(-20, -8, 2, 1.4, { color: 0xe2d2a8, roof: 'dome', roofColor: C.copper, y: 20, solid: false });
  k.sign(-12, -3, 'Université');
  // the institute: brick and glass in an old garment district
  k.box(10, 2, 16, 10, 9, { color: C.brick, roof: 'solar', win: 'grid' }); k.glass(10, 8, 8, 2.4, 9); k.box(22, 0, 7, 12, 11, { color: C.brickDark, roof: 'flat', roofColor: C.dark, win: 'grid' });
  k.label('Mila', 10, 13.6, 2);
  // row houses with outside staircases
  for (let i = 0; i < 7; i++) { k.box(-24 + i * 4.2, 22, 4, 6, 7, { color: [C.brick, 0x9a5340, 0xb86b4f, 0xa85a48][i % 4], roof: 'flat', roofColor: C.dark, win: 'grid' }); const st = k.mesh(new THREE.BoxGeometry(0.8, 0.2, 3.4), C.dark); st.position.set(-24 + i * 4.2, 1.6, 17.6); st.rotation.x = 0.7; }
  k.path([P(-30, 15), P(30, 15)], 3, 0x9a968f);
  // raccoons on the path up the mountain
  egg(k, 'raccoons', 1.6, -7.6, 'animal', 0x6b6f7a);
  k.grove(-4, 6, 10, 6, 6, ['round', 'cone']); k.row(-26, 12.4, 26, 12.4, 10);
  k.door = { x: 10, z: 10 }; k.spawn = { x: 0, z: 13 };
  k.path([P(0, 13), P(6, 11), P(10, 10)], 1.8); k.path([P(0, 13), P(0, 0), P(-6, -6)], 1.4);
  life(k, [[P(-22, 13), P(22, 13)], [P(0, 13), P(0, 0), P(-5, -5), P(0, 0)], [P(4, 11), P(16, 11)]], { tour: [-6, 10], bikes: 2, dogs: 2 });
}

export function amsterdam(k) {
  k.ground();
  // canals with narrow gabled houses, bridges and bicycles
  k.water(0, 14, 62, 5); k.water(-14, 0, 5, 62);
  bridge(k, 6, 10.8, 6, 17.2, 2.4, C.brick); bridge(k, -17.2, -8, -10.8, -8, 2.4, C.brick); bridge(k, -17.2, 22, -10.8, 22, 2.4, C.brick);
  const H = [0x8a4a3a, 0xb86b4f, 0x6b3f36, 0xd9c9a8, 0x9a5340, 0x4a3a36, 0xc98a5a];
  for (let i = 0; i < 12; i++) { const x = -8.6 + i * 3.1, h = 8 + (i * 7 % 3) * 1.4; k.box(x, 21.5, 3, 6, h, { color: H[i % 7], roof: 'gable', roofColor: C.dark, win: 'tall' }); const g = k.mesh(new THREE.BoxGeometry(1.4, 1.2, 0.4), 0xf4f2ec); g.position.set(x, h + 0.9, 18.6); }
  for (let i = 0; i < 9; i++) { const z = -24 + i * 3.1, h = 8 + (i * 5 % 3) * 1.3; k.box(-21.5, z, 6, 3, h, { color: H[(i + 3) % 7], roof: 'gable', roofColor: C.dark, win: 'tall' }); }
  const hb = k.mesh(new THREE.BoxGeometry(2, 1, 6), 0x2f6f5a); hb.position.set(-14, 0.5, 8); const hbr = k.mesh(new THREE.BoxGeometry(1.6, 0.7, 3), 0xefe6d2); hbr.position.set(-14, 1.3, 7.4);
  // a heron on the houseboat roof
  egg(k, 'heron', -14, 5.4, 'bird', 0x9aa3ab, 1.1);
  k.boat(8, 14, 16, 0.8, 0.12);
  // the Science Park: bright new buildings at the edge of town
  k.box(10, -14, 14, 9, 10, { color: 0xe9e4d6, roof: 'solar', win: 'bands' }); k.box(10, -8.6, 14, 1.4, 10, { color: 0xd24d3e, roof: 'none', win: 'none' }); k.glass(22, -6, 8, 12, 14);
  k.box(-2, -20, 8, 8, 7, { color: 0x3f7fb5, roof: 'green', win: 'bands' }); k.box(22, -22, 9, 7, 8, { color: 0xe2b23a, roof: 'flat', roofColor: C.dark, win: 'bands' });
  k.label('Science Park', 10, 15, -14); k.lawn(4, 0, 20, 10);
  for (let i = 0; i < 12; i++) { const b = k.mesh(new THREE.TorusGeometry(0.3, 0.04, 4, 10), C.dark); b.position.set(-8 + i * 0.8, 0.32, 10.6); b.castShadow = false; }
  k.grove(0, 5, 24, 4, 6); k.row(-10.4, -22, -10.4, 6, 9);
  k.door = { x: 10, z: -7.4 }; k.spawn = { x: 4, z: 9 };
  k.path([P(4, 9), P(6, 0), P(10, -7)], 1.8); k.path([P(-10, 10.6), P(26, 10.6)], 1.8, 0xb86b4f);
  life(k, [[P(-9, 10.6), P(24, 10.6)], [P(4, 9), P(6, 0), P(10, -6.6), P(6, 0)], [P(-8.6, -20), P(-8.6, 6)]], { tour: [0, 2], bikes: 5, scooters: 0 });
}

export const PLACES_TWO = { unc, columbia, berkeley, santafe, cornell, ucsd, toronto, manchester, cmu, berlin, montreal, amsterdam };
