// Part I places: the universities of the fall.
import { C } from './kit.js';
import { rails, colonnade, hill, fountain, bridge, statue, stairs, hangar, plane, mountains, life, egg, train, THREE } from './parts.js';

const P = (x, z) => [x, z];

export function yale(k) {
  k.ground();
  // the Beinecke: a marble box lifted on four piers above a sunken court
  k.plaza(-8, -6, 22, 16); k.patch(-8, 2.5, 8, 5, 0xbfc3c8, 0.035);
  for (const [x, z] of [[-14.5, -9.5], [-1.5, -9.5], [-14.5, -3.5], [-1.5, -3.5]]) k.box(x, z, 1.2, 1.2, 1.6, { color: C.stone, roof: 'none', win: 'none', solid: false });
  k.box(-8, -6.5, 14.5, 7.5, 6.5, { color: 0xeae6da, roof: 'flat', roofColor: C.stone, win: 'grid', y: 1.6 });
  for (const [x, z, s] of [[-9.5, 2.6, 0.9], [-7.6, 3.2, 0.7], [-6.4, 2.2, 0.8]]) { const m = k.mesh(s > 0.85 ? new THREE.BoxGeometry(1, 1, 1) : s > 0.75 ? new THREE.TorusGeometry(0.5, 0.14, 6, 14) : new THREE.ConeGeometry(0.6, 1, 4), 0xfaf8f2); m.position.set(x, 0.6, z); m.scale.setScalar(s); m.rotation.set(0.6, 0.5, 0); }
  k.label('Beinecke Library', -8, 10.5, -6.5);
  // Hillhouse Avenue: big houses under old trees
  k.path([P(14, -26), P(14, 24)], 3, 0xcfc8ba);
  for (const [z, c, r] of [[-20, C.brick, 'hip'], [-11, C.lime, 'gable'], [-2, 0xd8c7a6, 'hip'], [8, C.brickDark, 'gable']]) { k.box(21, z, 7, 6.5, 5, { color: c, roof: r, roofColor: C.slate }); k.box(8.5, z + 3, 5.5, 5.5, 4.4, { color: c === C.brick ? C.lime : C.brick, roof: 'hip', roofColor: C.roof }); }
  k.row(11.6, -25, 11.6, 20, 8); k.row(16.4, -25, 16.4, 20, 8);
  k.sign(12, 21.5, 'Hillhouse Ave.');
  // a gothic tower and a quad
  k.tower(-22, -20, 4, 19, { color: 0xb9ad98, cap: 'belfry', capColor: C.slate });
  k.box(-16, -21, 9, 5, 6, { color: 0xb9ad98, roof: 'gable', roofColor: C.slate, win: 'tall' }); k.box(-23.5, -12, 5, 11, 6, { color: 0xb9ad98, roof: 'gable', roofColor: C.slate, win: 'tall' });
  k.lawn(-12, 14, 22, 12);
  // the flock on the lawn: seen from above it is a dinosaur
  const dino = [[0.5, 3.2], [1.2, 3.4], [1.9, 3.6], [2.6, 3.8], [3.3, 4.3], [4, 4.7], [4.8, 4.9], [5.6, 4.8], [6.2, 5.2], [6.6, 5.8], [7, 6.3], [7.6, 6.6], [8.3, 6.6], [8.9, 6.3], [8.6, 5.9], [8, 5.7], [7.4, 5.6], [6.6, 4.6], [6.4, 3.9], [7, 4.2], [7.4, 4], [5.8, 3.3], [5, 3], [4.2, 3], [3.4, 3.2], [4.4, 2.3], [4.5, 1.6], [4.6, 0.9], [5.1, 0.8], [5.6, 2.4], [5.8, 1.7], [5.9, 1], [6.4, 0.9]];
  for (const [x, y] of dino) { const b = k.mesh(new THREE.IcosahedronGeometry(0.16, 0), 0x8f949c); b.position.set(-18.5 + x * 1.25, 0.14, 19 - y * 1.25); b.castShadow = false; }
  egg(k, 'datasaurus', -12, 14.5, 'bird', 0x8f949c);
  k.door = { x: -8, z: -1.6 }; k.spawn = { x: 0, z: 22 };
  k.path([P(0, 22), P(0, 8), P(-8, 0)], 1.8); k.path([P(0, 8), P(12, 8)], 1.6); k.path([P(-8, 0), P(-20, -8)], 1.6);
  life(k, [[P(0, 21), P(0, 8), P(-8, 2), P(-18, -6), P(-8, 2), P(0, 8)], [P(14, 22), P(14, -22)], [P(-22, 8), P(-4, 9), P(10, 8), P(-4, 9)]], { tour: [-3, 4], mower: [-12, 14, 16, 8] });
}

export function princeton(k) {
  k.ground();
  // Fine Hall: a tall brown tower over the mathematics library
  k.box(-12, -10, 7, 7, 24, { color: 0x8a6f5a, roof: 'flat', roofColor: C.dark, win: 'tall' });
  k.box(-12, -2.5, 15, 6, 4.5, { color: 0x8a6f5a, roof: 'flat', roofColor: C.dark, win: 'bands' });
  k.label('Fine Hall', -12, 27.5, -10);
  // the Lewis Library: crumpled steel and brick
  for (const [x, z, w, d, h, r, c] of [[10, -10, 9, 7, 9, 0.25, 0xb8c2cc], [16, -5, 6, 8, 12, -0.3, C.brick], [7, -3, 7, 5, 6, -0.12, 0xd9dde2], [14, -14, 6, 5, 15, 0.5, 0xb8c2cc], [20, -12, 5, 6, 7, 0.1, C.brickDark]]) k.box(x, z, w, d, h, { color: c, roof: 'none', win: c === C.brick || c === C.brickDark ? 'grid' : 'none', rot: r });
  k.label('Lewis Library', 13, 17.5, -10);
  // collegiate gothic and an arch
  k.box(-2, 12, 16, 5, 6, { color: 0xb5ab97, roof: 'gable', roofColor: C.slate, win: 'tall' }); k.tower(-11.5, 12, 3.4, 12, { color: 0xb5ab97, cap: 'belfry', capColor: C.slate });
  k.arch(8.5, 12, 4, 5.5, { color: 0xb5ab97 });
  k.box(-24, 6, 5, 16, 6, { color: 0xb5ab97, roof: 'gable', roofColor: C.slate, win: 'tall' });
  k.lawn(2, 2, 18, 9); k.grove(-22, -18, 10, 14, 7); k.grove(22, 14, 10, 12, 7); k.row(-6, 6.5, 12, 6.5, 6);
  egg(k, 'squirrel', 4.5, 2.5, 'animal', 0x26262a);
  k.door = { x: -12, z: 1.2 }; k.spawn = { x: 2, z: 23 };
  k.path([P(2, 23), P(8.5, 12), P(4, 4), P(-10, 3)], 1.8); k.path([P(4, 4), P(12, -2)], 1.6);
  life(k, [[P(2, 22), P(8.5, 12), P(4, 4), P(-10, 3), P(4, 4), P(8.5, 12)], [P(-20, 20), P(-6, 18), P(18, 20), P(-6, 18)], [P(4, 4), P(12, -2), P(22, 2), P(12, -2)]], { tour: [0, 16] });
}

export function harvard(k) {
  k.ground();
  // the Science Center: concrete terraces stepping down like a staircase
  for (let i = 0; i < 5; i++) k.box(-6 + i * 0.2, -16 + i * 3.4, 26 - i * 2, 3.4, 14 - i * 2.6, { color: 0xcfcac0, roof: 'flat', roofColor: 0x9a968c, win: 'bands' });
  k.box(-22, -12, 7, 12, 9, { color: 0xcfcac0, roof: 'flat', roofColor: 0x9a968c, win: 'bands' });
  k.label('Science Center', -6, 17, -15);
  k.plaza(-4, 6, 30, 10, 0xd6d0c4);
  for (const [x, c] of [[-12, 0xd24d3e], [-7, 0xe2b23a], [4, 0x3f7fb5]]) k.box(x, 7.5, 3, 2, 2.2, { color: c, roof: 'flat', roofColor: C.white, win: 'none' });
  // Memorial Hall: brick, with a tall tower and a patterned roof
  k.box(20, -8, 9, 20, 9, { color: C.brick, roof: 'gable', roofColor: 0x7d5a6a, win: 'tall' });
  k.tower(20, -8, 6, 20, { color: C.brick, cap: 'belfry', capColor: 0x7d5a6a });
  k.label('Memorial Hall', 20, 30, -8);
  // a gate into the Yard, and the statue everyone photographs
  k.arch(-20, 16, 5, 6, { color: C.brick }); k.box(-26, 16, 7, 1, 2.4, { color: C.brick, roof: 'none', win: 'none' }); k.box(-13, 16, 8, 1, 2.4, { color: C.brick, roof: 'none', win: 'none' });
  statue(k, -20, 22, 2, 0x6f7f72); egg(k, 'shoe', -19, 22.9, 'box', 0xd9a441);
  k.grove(-24, 24, 8, 8, 5); k.grove(8, 20, 20, 10, 9); k.row(-16, 12.6, 12, 12.6, 8);
  k.door = { x: -5, z: 2 }; k.spawn = { x: 4, z: 23 };
  k.path([P(4, 23), P(2, 12), P(-5, 4)], 1.8); k.path([P(2, 12), P(-20, 14)], 1.6); k.path([P(2, 12), P(15, 6)], 1.6);
  life(k, [[P(4, 22), P(2, 12), P(-5, 5), P(-14, 7), P(-5, 5), P(2, 12)], [P(-20, 20), P(-8, 13), P(10, 12), P(16, 4), P(10, 12), P(-8, 13)]], { tour: [8, 9], drone: true });
}

export function mit(k) {
  k.ground();
  // the Charles along the south edge, with the long bridge
  k.water(0, 25, 60, 10); bridge(k, -14, 17, -14, 31, 2.6, C.concrete);
  for (let i = 0; i < 9; i++) { const m = k.mesh(new THREE.BoxGeometry(0.5, 0.02, 0.12), i % 3 ? 0xf4f2ec : 0xd24d3e); m.position.set(-14.8, 0.55, 18 + i * 1.3); m.castShadow = false; }
  egg(k, 'smoots', -14.9, 20.5, 'post', 0xf4f2ec);
  k.boat(8, 25, 10, 2.5, 0.2); k.boat(-4, 27, 7, 1.5, 0.3);
  // the Great Dome
  k.box(-2, -8, 20, 8, 7, { color: C.lime, roof: 'flat', roofColor: C.stone, win: 'tall' }); colonnade(k, -2, -3.6, 12, 8, 6, { color: C.lime });
  k.cyl(-2, -8, 5.2, 2.5, { color: C.lime, roof: 'dome', roofColor: 0xd8d2c2, y: 7, solid: false, seg: 18 });
  k.lawn(-2, 5, 22, 13); k.label('MIT', -2, 16.5, -8);
  // the economics building by the river
  k.box(20, 12, 14, 6, 9, { color: 0xe6dfcf, roof: 'flat', roofColor: C.stone, win: 'tall' }); k.box(20, 12, 5, 6.6, 11, { color: 0xe6dfcf, roof: 'flat', roofColor: C.stone, win: 'tall', solid: false });
  k.sign(12, 16.6, 'Economics');
  // the Stata Center: tilted towers in brick, yellow and steel
  for (const [x, z, w, d, h, r, c] of [[-22, -16, 6, 6, 13, 0.15, C.brick], [-16, -20, 5, 5, 10, -0.25, 0xe2b23a], [-24, -8, 5, 6, 9, -0.1, 0xb8c2cc], [-17, -12, 4, 4, 7, 0.4, 0xf4f2ec]]) k.box(x, z, w, d, h, { color: c, roof: 'none', win: c === C.brick ? 'grid' : 'none', rot: r });
  k.cyl(-20, -22, 2.4, 11, { color: 0xb8c2cc, roof: 'flat', roofColor: C.steel, top: 2.9 });
  k.sign(-15.5, -6.5, 'Stata Center');
  // the Media Lab: a glass box with colored screens
  k.glass(18, -14, 12, 9, 10); for (const [x, c] of [[13.5, 0xd24d3e], [16.5, 0xe2b23a], [19.5, 0x3f7fb5], [22.5, 0x4f9a54]]) { const m = k.mesh(new THREE.BoxGeometry(2.2, 6, 0.1), c, { transparent: true, opacity: 0.7 }); m.position.set(x, 5, -9.3); }
  k.sign(11.5, -7.6, 'Media Lab');
  k.row(-12, 12, 8, 12, 7); k.grove(4, -20, 10, 6, 5);
  k.rooms = [{ x: 14.5, z: 8.4, label: 'Economics', ids: ['I-7'] }, { x: -18, z: -6.5, label: 'Stata Center', ids: ['III-2'] }, { x: 18, z: -8.2, label: 'Media Lab', ids: ['III-5', 'III-6'] }];
  k.door = k.rooms[0]; k.spawn = { x: 2, z: 16 };
  k.path([P(2, 16), P(2, 8), P(-2, -1)], 1.8); k.path([P(2, 8), P(14, 8)], 1.6); k.path([P(-2, 0), P(-17, -6)], 1.6); k.path([P(-2, 0), P(16, -8)], 1.6); k.path([P(-26, 15.5), P(26, 15.5)], 2.4, 0xcfc8ba);
  life(k, [[P(2, 15), P(2, 8), P(-2, 0), P(-16, -6), P(-2, 0), P(16, -8), P(-2, 0), P(2, 8)], [P(-26, 15.5), P(26, 15.5)], [P(14, 8), P(2, 8), P(-10, 6), P(2, 8)]], { line: [[2, 15], [2, 8.2], [14, 8.2]], tour: [-6, 4], drone: true });
}

export function illinois(k) {
  k.ground();
  k.lawn(0, 0, 14, 40); k.path([P(-8, -20), P(-8, 20)], 1.6); k.path([P(8, -20), P(8, 20)], 1.6); k.path([P(-8, 0), P(8, 0)], 1.4); k.path([P(-8, -10), P(8, 10)], 1.2); k.path([P(8, -10), P(-8, 10)], 1.2);
  // the Union at the north end, the domed auditorium at the south
  k.box(0, -25, 22, 6, 8, { color: C.brick, roof: 'hip', roofColor: C.slate, win: 'grid' }); k.cyl(0, -25, 1.6, 4, { color: C.white, roof: 'dome', roofColor: C.copper, y: 10, solid: false }); colonnade(k, 0, -21.4, 9, 6, 5, { color: C.white });
  k.box(0, 24, 14, 8, 6, { color: C.brick, roof: 'flat', roofColor: C.stone, win: 'tall' }); k.cyl(0, 24, 6, 1.2, { color: C.brick, roof: 'dome', roofColor: C.copper, y: 6, solid: false, seg: 18 }); colonnade(k, 0, 19.4, 10, 6, 5, { color: C.lime });
  k.label('Main Quad', 0, 9, 0);
  for (const [x, z, w, d] of [[-15, -12, 8, 10], [-15, 2, 8, 12], [-15, 15, 8, 8], [15, -12, 8, 10], [15, 8, 8, 14]]) k.box(x, z, w, d, 7, { color: x < 0 ? C.brick : C.brickDark, roof: 'hip', roofColor: C.slate, win: 'grid' });
  k.tower(15, -2, 3.6, 15, { color: C.stone, cap: 'spire', capColor: C.slate });
  // the Siebel Center
  k.box(24.5, -22, 9, 12, 8, { color: 0xb86b4f, roof: 'solar', win: 'bands' }); k.glass(24.5, -14.6, 6, 3, 9); k.sign(18.8, -15, 'Siebel Center');
  // the old test plots, and the library that went underground so as not to shade them
  k.patch(-24, 18, 8, 9, 0x8a7a4a, 0.03); for (let i = 0; i < 6; i++) for (let j = 0; j < 5; j++) { const m = k.mesh(new THREE.ConeGeometry(0.22, 1.5, 4), 0xb8b24a); m.position.set(-27 + i * 1.2, 0.75, 15 + j * 1.5); m.castShadow = false; }
  k.plaza(-24, 7, 9, 8); for (const [x, z] of [[-26, 5], [-22, 5], [-26, 9], [-22, 9]]) { const m = k.mesh(new THREE.BoxGeometry(1.6, 0.4, 1.6), C.glass, { transparent: true, opacity: 0.6 }); m.position.set(x, 0.25, z); }
  egg(k, 'morrow', -24, 12.4, 'post', C.cream);
  k.row(-9.6, -18, -9.6, 18, 8); k.row(9.6, -18, 9.6, 18, 8);
  k.rooms = [{ x: 19, z: -20, label: 'Siebel Center', ids: ['I-8'] }]; k.door = k.rooms[0]; k.spawn = { x: 0, z: 13 };
  k.path([P(8, -10), P(19, -19)], 1.6);
  life(k, [[P(-8, 16), P(-8, -18), P(8, -18), P(8, 16)], [P(0, 13), P(0, 0), P(8, -10), P(18, -18), P(8, -10), P(0, 0)]], { line: [[0, 12], [0, 0], [8, -10], [19, -19.4]], tour: [3, 4], mower: [0, 6, 10, 10] });
}

export function rensselaer(k) {
  k.ground();
  // the Hudson along the west, the campus on its hill
  k.water(-26, 0, 9, 60); k.boat(-26, 6, 1.5, 12, 0.12);
  k.patch(-14, 0, 14, 60, 0x9a9a8a, 0.02);
  for (const [z, c] of [[-20, C.brick], [-10, C.brickDark], [2, 0xc98a5a], [14, C.brick]]) k.box(-15, z, 6, 7, 4.6, { color: c, roof: 'gable', roofColor: C.slate });
  hill(k, 8, -6, 26, 30, 3.2);
  stairs(k, -6.5, 6, 5, 10, 8, Math.PI / 2, C.stone); k.sign(-9.6, 10.6, 'The Approach');
  // the chapel that became a computing center
  k.box(6, -4, 8, 16, 8, { color: 0xb9ad98, roof: 'gable', roofColor: C.slate, win: 'tall', y: 3 }); k.tower(6, 5.4, 3.2, 14, { color: 0xb9ad98, cap: 'spire', capColor: C.slate });
  const rose = k.mesh(new THREE.CircleGeometry(1.5, 12), 0x4d8fa8, { emissive: 0x2f6f8f, emissiveIntensity: 0.5 }); rose.position.set(6, 9.2, 4.05);
  k.label('Computing Center', 6, 20, -4); egg(k, 'chapel', 9.6, 6.6, 'post', 0x4d8fa8, 3);
  // the glass arts center with a wooden hull inside it
  k.glass(19, 10, 11, 9, 9, { y: 2.4 }); const hull = k.mesh(new THREE.IcosahedronGeometry(1, 2), C.wood); hull.scale.set(4, 3, 3); hull.position.set(19, 6.8, 10);
  k.box(18, -16, 12, 7, 8, { color: C.brick, roof: 'flat', roofColor: C.dark, win: 'grid', y: 2.6 }); k.box(-2, -20, 9, 6, 7, { color: C.brickDark, roof: 'hip', roofColor: C.slate, y: 2 });
  k.grove(10, 20, 22, 8, 10, ['round', 'cone']); k.grove(-4, -10, 4, 8, 4);
  k.door = { x: 1.2, z: 6.2 }; k.spawn = { x: -10, z: 22 };
  k.path([P(-10, 22), P(-9, 9), P(-4, 6), P(1, 6)], 1.8);
  life(k, [[P(-10, 21), P(-9, 9), P(-11, -8), P(-9, 9)], [P(-11, -22), P(-11, 22)], [P(-3, 12), P(8, 14), P(14, 18), P(8, 14)]], { tour: [-4, 14] });
}

export function gottingen(k) {
  k.ground();
  // the observatory: a calm block with a dome and two wings
  k.box(-12, -14, 12, 7, 6, { color: 0xe9dfc8, roof: 'hip', roofColor: C.slate, win: 'tall' }); k.cyl(-12, -14, 2.8, 2, { color: 0xe9dfc8, roof: 'dome', roofColor: C.copper, y: 6.8, solid: false });
  k.box(-21, -11, 6, 5, 4, { color: 0xe9dfc8, roof: 'hip', roofColor: C.slate }); k.box(-3, -11, 6, 5, 4, { color: 0xe9dfc8, roof: 'hip', roofColor: C.slate });
  colonnade(k, -12, -9.9, 6, 4, 4.4, { color: C.white }); k.label('Observatory', -12, 13.5, -14); k.lawn(-12, -3, 20, 8);
  // the old town: half-timbered houses round the market, the goose girl on her fountain
  k.plaza(13, 6, 16, 14, 0xcfc4b0);
  const cols = [0xf1e8d2, 0xe9d2a8, 0xf4f2ec, 0xd9b08a, 0xefe0b8];
  for (let i = 0; i < 6; i++) k.box(5.5 + i * 3.1, -4, 3, 5, 5 + (i % 3), { color: cols[i % 5], roof: 'gable', roofColor: i % 2 ? C.red : 0x9a5340, win: 'grid' });
  for (let i = 0; i < 5; i++) k.box(24, 0.5 + i * 3.4, 5, 3.2, 5 + ((i + 1) % 3), { color: cols[(i + 2) % 5], roof: 'gable', roofColor: C.red, win: 'grid' });
  for (let i = 0; i < 5; i++) k.box(6 + i * 3.4, 16.5, 3.2, 5, 4.6 + (i % 2), { color: cols[(i + 3) % 5], roof: 'gable', roofColor: 0x9a5340, win: 'grid' });
  fountain(k, 13, 6, 1.5); const girl = k.statueFigure(0x6f7f72, 0.8); girl.position.set(13, 1.3, 6); k.g.add(girl); egg(k, 'goosegirl', 14.6, 7.4, 'bird', 0xf4f2ec);
  // the church with two unequal towers
  k.box(-2, 12, 6, 14, 8, { color: 0xc9b89a, roof: 'gable', roofColor: C.slate, win: 'tall' }); k.tower(-4, 20.5, 2.8, 15, { color: 0xc9b89a, cap: 'spire', capColor: C.copper }); k.tower(0, 20.5, 2.8, 13, { color: 0xc9b89a, cap: 'belfry', capColor: C.copper });
  k.grove(-22, 8, 10, 22, 12, ['round', 'cone']); k.row(-22, -20, -2, -20, 7);
  k.door = { x: -12, z: -8.4 }; k.spawn = { x: 10, z: 11 };
  k.path([P(10, 11), P(2, 2), P(-12, -6)], 1.8, 0xcfc4b0);
  life(k, [[P(10, 10), P(2, 2), P(-12, -5), P(2, 2)], [P(8, 2), P(19, 2), P(19, 11), P(8, 11)], [P(-20, 0), P(-6, 2), P(-20, 4)]], { tour: [16, 9], bikes: 2 });
}

export function maryland(k) {
  k.ground();
  // the long mall with its fountain down the middle, the library at the head
  k.lawn(4, 0, 44, 16); k.water(4, 0, 24, 1.4); k.path([P(-18, -5), P(26, -5)], 1.4); k.path([P(-18, 5), P(26, 5)], 1.4);
  k.box(-23, 0, 8, 20, 9, { color: C.brick, roof: 'hip', roofColor: C.slate, win: 'grid' }); colonnade(k, -18.4, 0, 10, 6, 7, { color: C.white, rot: Math.PI / 2 });
  k.cyl(-23, 0, 1.4, 3, { color: C.white, roof: 'dome', roofColor: C.white, y: 11, solid: false }); k.label('McKeldin Library', -23, 16.5, 0);
  for (const [x, z] of [[-6, -15], [8, -15], [22, -15], [-6, 15], [8, 15], [22, 15]]) { k.box(x, z, 11, 7, 7, { color: C.brick, roof: 'hip', roofColor: C.slate, win: 'grid' }); colonnade(k, x, z + (z < 0 ? 4.1 : -4.1), 5, 4, 5, { color: C.white, rot: z < 0 ? 0 : Math.PI }); }
  // the terrapin whose nose students rub for luck
  k.box(-15.5, 3.6, 1.6, 1.2, 0.9, { color: C.stone, roof: 'none', win: 'none', solid: false }); const t = k.mesh(new THREE.IcosahedronGeometry(0.6, 1), 0x8a6a3a); t.scale.set(1.2, 0.55, 0.9); t.position.set(-15.5, 1.2, 3.6);
  egg(k, 'testudo', -15.5, 4.8, 'ball', 0xd9a441);
  k.row(-16, -8.6, 26, -8.6, 11); k.row(-16, 8.6, 26, 8.6, 11);
  k.door = { x: -17, z: -1.6 }; k.spawn = { x: 22, z: 2 };
  life(k, [[P(22, -5), P(-16, -5), P(-16, 5), P(22, 5)], [P(26, 2.5), P(-12, 2.5)], [P(0, 9), P(14, 10), P(26, 9), P(14, 10)]], { line: [[21, 1.6], [0, 1.6], [-16.4, -1.4]], tour: [6, -2.6], mower: [10, 2.6, 16, 2] });
}

export function edinburgh(k) {
  k.ground();
  hill(k, 22, -22, 16, 14, 11, 0x8a9a6a); const crag = k.mesh(new THREE.ConeGeometry(6, 9, 5), 0x7d7f76); crag.position.set(19, 6.5, -20); crag.rotation.y = 0.5;
  // the Bayes Centre and the Informatics Forum round a square
  k.box(-10, -10, 14, 10, 12, { color: 0xd9cdb6, roof: 'solar', win: 'bands' }); k.glass(-10, -4.4, 8, 2.4, 12);
  k.label('Bayes Centre', -10, 16, -10);
  k.box(8, -6, 12, 9, 11, { color: 0xcfc7b8, roof: 'green', win: 'grid' }); k.glass(8, -1, 6, 2, 11); k.sign(2.4, 0.4, 'Informatics Forum');
  k.box(-22, 6, 6, 8, 20, { color: 0xb8b2a6, roof: 'flat', roofColor: C.dark, win: 'bands' });
  k.cyl(10, 16, 6, 6, { color: 0xb9a98a, roof: 'dome', roofColor: C.copper, seg: 16 }); k.sign(3, 20, 'McEwan Hall');
  k.plaza(-1, 6, 22, 12, 0xc9c2b4);
  for (let i = 0; i < 6; i++) k.box(-20 + i * 3.2, 22, 3, 5, 7 + (i % 2), { color: [0xa89c88, 0x8f8676, 0xb5ab97][i % 3], roof: 'gable', roofColor: C.slate, win: 'grid' });
  // the little dog who waited
  k.box(-4, 9, 0.8, 0.8, 1.1, { color: C.stone, roof: 'none', win: 'none', solid: false }); egg(k, 'bobby', -4, 9.9, 'animal', 0x4a4a4a);
  k.vehicle([P(-28, 14.5), P(26, 14.5)], { color: 0x8a2f3a, len: 5.4, h: 2.4, stripe: 0xf4f2ec, speed: 4 }); k.path([P(-28, 14.5), P(28, 14.5)], 3, 0xb8b2a6);
  k.grove(22, 6, 10, 10, 6); k.row(-18, -2, 16, 0.6, 5);
  k.rooms = [{ x: -10, z: -2.4, label: 'Bayes Centre', ids: ['I-14'] }, { x: 8, z: 0.4, label: 'Informatics Forum', ids: ['IV-4'] }]; k.door = k.rooms[0]; k.spawn = { x: -2, z: 10 };
  life(k, [[P(-2, 10), P(-9, 2), P(2, 4), P(8, 2), P(2, 4)], [P(-16, 11), P(14, 11)], [P(16, 4), P(22, 10), P(16, 12)]], { line: [[-2, 9.4], [-6, 4], [-10, -2]], tour: [3, 7], bikes: 0 });
}

export function wisconsin(k) {
  k.ground();
  // the lake to the north and the terrace with its bright chairs
  k.water(0, -24, 60, 12); k.boat(-10, -24, 9, 2, 0.2); k.boat(14, -26, 6, 1.5, 0.28); k.boat(2, -22, 4, 1, 0.35);
  k.plaza(-12, -14.5, 22, 6, 0xd6cdb8); const cc = [0xe2b23a, 0xd9742b, 0x4f9a54];
  for (let i = 0; i < 16; i++) { const m = k.mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.12, 10), cc[i % 3]); m.position.set(-21 + (i % 8) * 2.5 + k.r.range(-0.3, 0.3), 0.6, -16 + Math.floor(i / 8) * 2.6); const leg = k.mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6, 5), C.dark); leg.position.set(m.position.x, 0.3, m.position.z); leg.castShadow = false; }
  k.box(-12, -8, 22, 6, 7, { color: 0xd9c9a8, roof: 'hip', roofColor: C.red, win: 'tall' }); k.label('The Terrace', -12, 5, -15);
  // Bascom Hill: a long lawn climbing to the hall at the top
  hill(k, 16, 4, 16, 22, 4.2); k.box(18, 2, 8, 18, 7, { color: 0xe4dccb, roof: 'hip', roofColor: C.slate, win: 'grid', y: 3.6 }); colonnade(k, 13.6, 2, 8, 6, 6, { color: C.white, rot: -Math.PI / 2 }).position.y = 3.6;
  k.label('Bascom Hall', 18, 16, 2); statue(k, 9, 2, 1.6, 0x4f5f52);
  k.lawn(-2, 4, 18, 14);
  // one morning the hill was covered in pink flamingos
  for (let i = 0; i < 26; i++) { const x = -9 + k.r.range(0, 14), z = -2 + k.r.range(0, 12); const m = k.mesh(new THREE.IcosahedronGeometry(0.2, 0), 0xf08aa8); m.position.set(x, 0.7, z); const l = k.mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.6, 4), 0x3a4250); l.position.set(x, 0.3, z); m.castShadow = l.castShadow = false; }
  egg(k, 'flamingos', -2, 4, 'bird', 0xf08aa8);
  k.box(-22, 8, 7, 10, 6, { color: C.brick, roof: 'hip', roofColor: C.slate }); k.box(-8, 22, 12, 6, 6, { color: 0xd9c9a8, roof: 'hip', roofColor: C.red }); k.grove(-22, 22, 10, 8, 6); k.grove(22, 24, 12, 8, 7); k.row(-10, -4, 8, -4, 6);
  k.door = { x: 10.5, z: 6 }; k.spawn = { x: -6, z: 16 };
  k.path([P(-6, 16), P(-2, 11), P(8, 6)], 1.8); k.path([P(-2, 11), P(-12, -4)], 1.6);
  life(k, [[P(-6, 15), P(-2, 11), P(8, 7), P(-2, 11), P(-12, -4), P(-2, 11)], [P(-22, -12), P(-2, -12)], [P(-20, 14), P(-8, 16), P(4, 17), P(-8, 16)]], { tour: [-14, -12], families: 3 });
}

export function stanford(k) {
  k.ground({ color: k.snowCaps() ? 0xcfd3a8 : undefined });
  // the Oval and the palm drive
  k.disc(0, 14, 9, k.season.lawn, 0.02).scale.set(13, 1, 7.5); k.path([P(0, 30), P(0, 22)], 3, 0xd9cdb0);
  for (let i = 0; i < 4; i++) { k.tree(-3, 22.5 + i * 2.4, 'palm'); k.tree(3, 22.5 + i * 2.4, 'palm'); }
  const fl = k.mesh(new THREE.CircleGeometry(1.6, 12).rotateX(-Math.PI / 2), 0xb5483f); fl.position.set(0, 0.05, 14); fl.castShadow = false;
  // the Main Quad: sandstone arcades and red tile
  const S = 0xd9bd8a, R = 0xb5553f;
  k.box(0, -2, 34, 3, 4, { color: S, roof: 'gable', roofColor: R, win: 'tall' }); k.box(-16, -9, 3, 12, 4, { color: S, roof: 'gable', roofColor: R, win: 'tall' }); k.box(16, -9, 3, 12, 4, { color: S, roof: 'gable', roofColor: R, win: 'tall' });
  k.plaza(0, -9, 28, 10, 0xe4d3ae); for (const [x, z] of [[-8, -8], [8, -8], [0, -11]]) { k.disc(x, z, 1.8, k.season.lawn, 0.05); k.tree(x, z, 'palm', 0.8); }
  k.box(0, -17, 9, 8, 9, { color: S, roof: 'gable', roofColor: R, win: 'none' }); const mos = k.mesh(new THREE.PlaneGeometry(6, 3.4), 0x3f7fb5, { emissive: 0xd9a441, emissiveIntensity: 0.25 }); mos.position.set(0, 9.4, -12.9);
  k.label('Main Quad', 0, 15, -15);
  k.tower(22, -16, 4.4, 20, { color: S, cap: 'none' }); k.cyl(22, -16, 2.4, 2, { color: S, roof: 'dome', roofColor: R, y: 20, solid: false });
  // Gates and Sequoia
  k.box(-22, -18, 10, 9, 9, { color: S, roof: 'hip', roofColor: R, win: 'grid' }); k.sign(-22.5, -12.4, 'Gates');
  k.box(-22, 6, 8, 10, 7, { color: S, roof: 'hip', roofColor: R, win: 'grid' }); k.sign(-16.8, 9, 'Sequoia Hall');
  k.box(22, 4, 8, 12, 6, { color: S, roof: 'hip', roofColor: R, win: 'grid' });
  egg(k, 'seed42', -15.6, -10.5, 'post', 0xd9bd8a);
  k.rooms = [{ x: -22, z: -12.4, label: 'Gates', ids: ['I-17'] }, { x: -17, z: 6, label: 'Sequoia Hall', ids: ['II-3'] }]; k.door = k.rooms[0]; k.spawn = { x: 0, z: 6 };
  k.path([P(0, 6), P(0, 1)], 2, 0xe4d3ae); k.path([P(0, 3), P(-16, 3), P(-22, -11)], 1.6, 0xe4d3ae); k.path([P(0, 3), P(16, 3)], 1.6, 0xe4d3ae);
  for (const [x, z] of [[-10, 20], [10, 20], [-26, -4], [26, -6], [12, 8], [-10, 8]]) k.tree(x, z, 'palm');
  k.grove(22, 20, 10, 10, 5); k.grove(-24, 22, 8, 8, 4);
  life(k, [[P(0, 6), P(0, 3), P(-16, 3), P(-21, -10), P(-16, 3), P(16, 3), P(0, 3)], [P(-12, 14), P(0, 22), P(12, 14), P(0, 6.4)]], { line: [[0, 5.6], [0, 3], [-16, 3], [-21.6, -11.6]], bikes: 3, tour: [6, -8], drone: true });
}

export function munich(k) {
  k.ground();
  // the university's main building on its square, with the two fountains
  k.box(-12, -16, 26, 7, 8, { color: 0xe9e2d0, roof: 'hip', roofColor: C.red, win: 'tall' }); k.box(-12, -11.6, 8, 2.4, 9.5, { color: 0xe9e2d0, roof: 'gable', roofColor: C.red, win: 'tall', solid: false });
  k.plaza(-12, -5, 26, 11, 0xd9d2c2); fountain(k, -19, -5, 2); fountain(k, -5, -5, 2); k.label('University', -12, 14.5, -16);
  // the English Garden: a wide meadow, a round temple on a mound, and the standing wave
  k.lawn(12, 6, 28, 30); hill(k, 20, -4, 6, 6, 2.6); k.cyl(20, -4, 2.2, 0.4, { color: C.white, roof: 'none', y: 2.2, solid: false });
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; const c = k.mesh(new THREE.CylinderGeometry(0.16, 0.16, 2.6, 6), 0xf4f2ec); c.position.set(20 + Math.cos(a) * 1.8, 3.9, -4 + Math.sin(a) * 1.8); }
  const cap = k.mesh(new THREE.SphereGeometry(2.3, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), C.copper); cap.position.set(20, 5.2, -4);
  k.river([P(4, 22), P(8, 10), P(4, -2), P(8, -12)], 2.2);
  const wave = k.mesh(new THREE.BoxGeometry(2.4, 0.5, 0.7), 0xffffff, { transparent: true, opacity: 0.85 }); wave.position.set(7.4, 0.3, 12);
  for (let i = 0; i < 2; i++) { const f = k.figure([0x24406e, 0xd24d3e][i], 0.8); k.g.add(f); k.anim.push((t) => { f.position.set(7.4 + Math.sin(t * 1.3 + i * 2.4) * 0.9, 0.45, 11.6 - i * 0.5); f.rotation.y = Math.sin(t * 1.3 + i * 2.4) * 0.7; }); }
  egg(k, 'surfers', 9.6, 12.6, 'post', 0x56b4e9);
  // the technical university with its clock tower
  k.box(-18, 12, 14, 9, 8, { color: 0xd8c9a8, roof: 'flat', roofColor: C.slate, win: 'grid' }); k.tower(-10, 16, 3.6, 17, { color: 0xd8c9a8, cap: 'belfry', capColor: C.copper });
  const clock = k.mesh(new THREE.CircleGeometry(1, 16), 0xf4f2ec); clock.position.set(-10, 14, 17.85); k.sign(-11, 21, 'Technical University');
  k.grove(18, 14, 14, 12, 12); k.grove(14, -18, 18, 8, 9); k.row(-25, -9, -25, 4, 5);
  k.rooms = [{ x: -12, z: -9.4, label: 'University', ids: ['I-18'] }, { x: -14, z: 18, label: 'Technical University', ids: ['III-10'] }]; k.door = k.rooms[0]; k.spawn = { x: -4, z: 6 };
  k.path([P(-4, 6), P(-10, 0), P(-12, -9)], 1.8); k.path([P(-4, 6), P(-12, 17.4)], 1.6); k.path([P(-4, 6), P(10, 4), P(18, 2)], 1.6);
  life(k, [[P(-4, 6), P(-10, 0), P(-12, -8), P(-10, 0)], [P(-2, 8), P(10, 4), P(18, 4), P(24, 14), P(12, 18), P(10, 4)], [P(-24, -1), P(0, -1)]], { tour: [14, 8], families: 3, bikes: 2 });
}

export function eth(k) {
  k.ground();
  mountains(k, 'n', 0x9aa7b5, 7, 11);
  // the main building with its dome, on a terrace above the town
  hill(k, -2, -10, 30, 16, 3.4, 0xb8b0a0); k.box(-2, -12, 26, 10, 9, { color: 0xd9cdb0, roof: 'flat', roofColor: C.stone, win: 'tall', y: 3 }); k.cyl(-2, -12, 4.2, 3, { color: 0xd9cdb0, roof: 'dome', roofColor: C.copper, y: 12, solid: false, seg: 16 });
  colonnade(k, -2, -6.6, 12, 8, 6, { color: 0xd9cdb0 }).position.y = 3; k.label('ETH', -2, 22, -12);
  k.plaza(-2, -1.6, 28, 7, 0xd6cfc0); for (let i = 0; i < 9; i++) { const m = k.mesh(new THREE.BoxGeometry(0.12, 0.9, 3), C.dark); m.position.set(-14 + i * 3, 0.5, 2.2); m.rotation.y = Math.PI / 2; m.castShadow = false; }
  // the little red funicular from the town
  const track = k.mesh(new THREE.BoxGeometry(1.2, 0.2, 26), 0x8c8478); track.position.set(20, 1.6, 8); track.rotation.x = 0.13;
  const car = k.mesh(new THREE.BoxGeometry(1.6, 1.8, 3.4), 0xc0392b); k.anim.push((t) => { const u = (Math.sin(t * 0.25) + 1) / 2; car.position.set(20, 1 + u * 3.4, 19 - u * 22); car.rotation.x = 0.13; });
  egg(k, 'polybahn', 17.6, 18, 'post', 0xc0392b);
  // the old town below and the lake
  k.water(0, 27, 60, 6); k.boat(-6, 27, 10, 1.4, 0.2);
  const cols = [0xf1e8d2, 0xe9d2a8, 0xf4f2ec, 0xd9c9a8];
  for (let i = 0; i < 9; i++) k.box(-24 + i * 4.6, 18 + (i % 2) * 1.6, 4, 4.4, 5 + (i % 3), { color: cols[i % 4], roof: 'gable', roofColor: i % 2 ? C.red : 0x9a5340 });
  k.tower(-12, 12, 2.6, 13, { color: 0xcfc7b8, cap: 'spire', capColor: C.copper }); k.tower(6, 12, 2.6, 12, { color: 0xcfc7b8, cap: 'belfry', capColor: C.slate });
  k.grove(-24, 6, 8, 8, 5, ['round', 'cone']); k.grove(26, -4, 6, 10, 4, 'cone');
  k.door = { x: -2, z: -4.6 }; k.spawn = { x: 2, z: 10 };
  k.path([P(2, 10), P(0, 4), P(-2, -4)], 1.8, 0xd6cfc0);
  life(k, [[P(2, 10), P(0, 4), P(-2, -3), P(0, 4)], [P(-14, 0), P(12, 0)], [P(-20, 14), P(-4, 14.5), P(14, 14), P(-4, 14.5)]], { tour: [-9, 0.4], bikes: 0 });
}

export function cambridge(k) {
  k.ground();
  // the University Library: a long brick front and a tower you can see for miles
  k.box(-10, -14, 26, 7, 8, { color: 0xb07a55, roof: 'flat', roofColor: C.dark, win: 'tall' }); k.box(-10, -14, 6, 7.4, 22, { color: 0xb07a55, roof: 'hip', roofColor: C.dark, win: 'tall', solid: false });
  k.label('University Library', -10, 26, -14); k.lawn(-10, -5, 22, 8);
  // the river, the punts and a stone bridge
  k.river([P(-30, 8), P(-12, 10), P(6, 7), P(30, 11)], 4); bridge(k, 0, 4.4, 0, 12, 2.4, C.lime);
  for (let i = 0; i < 3; i++) { const p = k.mesh(new THREE.BoxGeometry(0.9, 0.25, 3.2), C.wood); const f = k.figure(0x6f8f8a, 0.8); k.g.add(f); const ph = i * 2.1; k.anim.push((t) => { const u = ((t * 0.02 + ph / 6) % 1); const x = -26 + u * 52, z = 8.6 + Math.sin(u * 6 + ph) * 1.2; p.position.set(x, 0.18, z); p.rotation.y = Math.PI / 2; f.position.set(x - 1.2, 0.2, z); }); }
  // the chapel with four pinnacles and a court
  k.box(14, 18, 18, 6, 10, { color: 0xd8cdb6, roof: 'gable', roofColor: C.slate, win: 'tall' }); for (const [x, z] of [[5.4, 15.4], [22.6, 15.4], [5.4, 20.6], [22.6, 20.6]]) k.tower(x, z, 1.2, 12.5, { color: 0xd8cdb6, cap: 'spire', capColor: 0xd8cdb6 });
  k.lawn(-12, 19, 20, 9); k.box(-24, 19, 4, 12, 6, { color: 0xd8cdb6, roof: 'gable', roofColor: C.slate, win: 'tall' });
  // the Computer Laboratory out to the west
  k.box(18, -14, 14, 9, 7, { color: 0xc9a67a, roof: 'solar', win: 'bands' }); k.glass(18, -8.8, 6, 1.8, 7); k.sign(10.4, -8, 'Computer Laboratory');
  egg(k, 'coffeepot', 23, -8, 'pot', 0xb8c2cc);
  k.grove(-24, -4, 6, 14, 6); k.row(-22, 5, 22, 3.6, 8); k.row(4, -22, 4, -6, 5);
  k.rooms = [{ x: -10, z: -9.4, label: 'University Library', ids: ['I-21'] }]; k.door = k.rooms[0]; k.spawn = { x: 2, z: 1 };
  k.path([P(2, 1), P(-4, -3), P(-10, -9)], 1.8); k.path([P(2, 1), P(0, 4.4)], 1.6); k.path([P(2, 1), P(12, -6), P(18, -8)], 1.6); k.path([P(0, 12), P(4, 14)], 1.6);
  life(k, [[P(2, 1), P(-4, -3), P(-10, -8), P(-4, -3)], [P(2, 1), P(12, -6), P(18, -7), P(12, -6)], [P(-20, 14), P(-4, 14), P(0, 12), P(0, 4.4), P(0, 12), P(-4, 14)]], { tour: [-4, 17], bikes: 3 });
}

export function london(k) {
  k.ground();
  // Bloomsbury in the west: the white tower, Birkbeck, and the college with its portico
  k.box(-20, -14, 10, 8, 9, { color: 0xe9e4d6, roof: 'flat', roofColor: C.stone, win: 'tall' }); k.box(-20, -14, 6, 6, 18, { color: 0xe9e4d6, roof: 'flat', roofColor: C.stone, win: 'tall', solid: false }); k.box(-20, -14, 3.6, 3.6, 24, { color: 0xe9e4d6, roof: 'flat', roofColor: C.stone, win: 'tall', solid: false });
  k.sign(-13.6, -9.4, 'Senate House');
  k.box(-22, 0, 9, 8, 8, { color: C.brick, roof: 'flat', roofColor: C.dark, win: 'grid' }); k.sign(-16, 4.6, 'Birkbeck');
  k.box(-20, 16, 14, 6, 7, { color: 0xe4dccb, roof: 'flat', roofColor: C.stone, win: 'tall' }); colonnade(k, -20, 12.4, 8, 8, 6, { color: 0xe4dccb, rot: Math.PI }); k.cyl(-20, 16, 2.6, 2, { color: 0xe4dccb, roof: 'dome', roofColor: C.slate, y: 7.2, solid: false });
  k.sign(-12, 12, 'University College'); k.lawn(-9, 7, 8, 8); k.grove(-9, 7, 6, 6, 4);
  // King's Cross in the east: the station, the long low building beside the tracks, the canal and the library
  hangar(k, 14, -19, 6, 12, 5, 0xd9c9a8); hangar(k, 20.4, -19, 6, 12, 5, 0xd9c9a8); k.box(17.2, -12.4, 13, 1.6, 6, { color: 0xd9c08a, roof: 'flat', roofColor: C.stone, win: 'tall' }); k.tower(17.2, -11.4, 1.6, 9, { color: 0xd9c08a, cap: 'belfry', capColor: C.slate });
  rails(k, 26, -30, 26, 14); train(k, 26, -28, 26, 12, 3);
  k.box(20.6, 2, 5, 22, 5, { color: 0xd8d2c4, roof: 'green', win: 'bands' }); k.glass(17.6, 2, 1, 18, 5); k.label('Platform 37', 20.6, 9, 2);
  egg(k, 'platform37', 23.8, -4, 'post', 0x1c2b4a);
  k.river([P(-6, 30), P(4, 22), P(14, 19), P(30, 20)], 3); const nb = k.mesh(new THREE.BoxGeometry(1.2, 0.8, 4.6), 0x2f6f5a); k.anim.push((t) => { const u = (t * 0.015) % 1; nb.position.set(-2 + u * 28, 0.4, 24.5 - u * 5); nb.rotation.y = 1.3; });
  k.box(4, -16, 12, 10, 6, { color: 0xb5553f, roof: 'shed', win: 'bands' }); k.box(1, -12, 8, 6, 4, { color: 0xb5553f, roof: 'flat', roofColor: C.slate, win: 'bands' }); k.tower(9.4, -11, 2, 11, { color: 0xb5553f, cap: 'belfry', capColor: C.slate }); k.sign(2, -7.4, 'British Library');
  // a red bus on the long road between the two quarters
  k.path([P(-6, -30), P(-2, 14), P(2, 30)], 3.4, 0xb8b2a6); k.vehicle([P(-5.6, -26), P(-2.2, 12)], { color: 0xc0392b, len: 5, h: 2.6, w: 1.7, stripe: 0xf4f2ec, speed: 4.4 });
  k.rooms = [{ x: -16.6, z: 2.6, label: 'Birkbeck', ids: ['I-22'] }, { x: -14, z: 13.6, label: 'University College', ids: ['I-23'] }, { x: 16.4, z: 4, label: 'Platform 37', ids: ['III-16', 'III-17', 'III-18'] }]; k.door = k.rooms[0]; k.spawn = { x: 2, z: 8 };
  k.path([P(2, 8), P(-8, 6), P(-16, 3)], 1.8); k.path([P(-8, 6), P(-13, 12.4)], 1.6); k.path([P(2, 8), P(15.6, 5)], 1.8); k.plaza(8, 7, 14, 8, 0xcfc8ba);
  life(k, [[P(2, 8), P(-8, 6), P(-15.6, 3.6), P(-8, 6), P(-13, 12), P(-8, 6)], [P(2, 8), P(14.6, 5), P(14.6, -6), P(14.6, 5)], [P(4, 12), P(12, 11), P(12, 15), P(4, 15)]], { line: [[2, 8], [-8, 6], [-16, 3]], tour: [9, 8], bikes: 2 });
}

export function cranfield(k) {
  k.ground({ color: undefined });
  // the airfield: a runway, two hangars and a tower
  k.patch(0, -18, 58, 6, 0x6f747a, 0.03); for (let i = 0; i < 12; i++) k.patch(-26 + i * 4.6, -18, 2.2, 0.3, 0xf4f2ec, 0.045);
  k.patch(4, -10, 2.4, 12, 0x6f747a, 0.03); k.patch(8, -4, 30, 6, 0x868b90, 0.028);
  hangar(k, -4, -3, 12, 9, 6, 0xb8c2cc); hangar(k, 10, -3, 12, 9, 6, 0xaab4bd);
  k.cyl(22, -6, 1.4, 9, { color: C.white, roof: 'none', seg: 8 }); k.cyl(22, -6, 2.4, 2, { color: C.glass, glass: true, roof: 'flat', roofColor: C.red, y: 9, solid: false, seg: 8 });
  plane(k, -2, 0.6, -9.6, 0.9).rotation.y = 0.4; plane(k, 12, 0.6, -9.4, 0.8, 0xe2b23a).rotation.y = -0.6;
  const tx = plane(k, 0, 0.6, -18, 1); k.anim.push((t) => { const u = (t * 0.03) % 1; tx.position.set(-30 + u * 60, 0.6 + Math.max(0, u - 0.62) * 34, -18); tx.rotation.y = Math.PI / 2; tx.rotation.z = u > 0.62 ? -0.2 : 0; });
  const sock = k.mesh(new THREE.ConeGeometry(0.4, 1.8, 6).rotateZ(Math.PI / 2), 0xe07b22); sock.position.set(27, 4, -12); const pole = k.mesh(new THREE.CylinderGeometry(0.06, 0.06, 4, 5), C.dark); pole.position.set(26.2, 2, -12); k.anim.push((t) => { sock.rotation.y = Math.sin(t * 0.7) * 0.4; });
  // the College of Aeronautics and its library
  k.box(-14, 10, 16, 8, 6, { color: C.brick, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.box(-14, 5.2, 6, 2, 3.4, { color: C.concrete, roof: 'flat', roofColor: C.dark, win: 'none' }); k.label('College library', -14, 10.5, 10);
  k.box(8, 12, 12, 7, 5, { color: C.brickDark, roof: 'hip', roofColor: C.slate }); k.box(22, 12, 8, 10, 4.4, { color: C.concrete, roof: 'flat', roofColor: C.dark, win: 'bands' });
  // a drawer of index cards left on a bench
  k.bench(-6, 3.4, 0, false); egg(k, 'indexcards', -6, 3.4, 'box', 0xefe6d2, 0.5);
  k.lawn(-2, 20, 30, 10); k.grove(-24, 22, 8, 10, 6); k.grove(20, 23, 14, 6, 6); k.row(-24, 0, -24, 14, 5);
  k.door = { x: -14, z: 3.4 }; k.spawn = { x: 2, z: 20 };
  k.path([P(2, 20), P(0, 8), P(-12, 3)], 1.8); k.path([P(0, 8), P(10, 8)], 1.6);
  life(k, [[P(2, 20), P(0, 8), P(-12, 3.4), P(0, 8)], [P(-22, 17), P(-2, 17), P(18, 18), P(-2, 17)], [P(0, 8), P(10, 7.6), P(20, 6), P(10, 7.6)]], { tour: [4, 2.4], bikes: 1 });
}

export function monash(k) {
  k.ground();
  // the long tall slab everyone steers by
  k.box(-6, -14, 30, 5, 22, { color: 0xd8cdb8, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.label('Menzies Building', -6, 26, -14);
  k.box(18, -4, 12, 10, 9, { color: C.brick, roof: 'hip', roofColor: 0x6f5a4a, win: 'none' }); k.sign(11, 2, 'Blackwood Hall');
  k.box(-20, 2, 10, 12, 6, { color: C.concrete, roof: 'solar', win: 'bands' }); k.box(2, 8, 12, 6, 4.4, { color: 0xd9c9a8, roof: 'green', win: 'bands' });
  k.lawn(-2, -3, 24, 12); k.water(8, 20, 9, 6, { round: true });
  // gum trees, grey-green whatever the month
  for (let i = 0; i < 16; i++) { const x = k.r.range(-27, 27), z = k.r.range(12, 27); if (Math.hypot(x - 8, z - 20) < 6) continue; k.tree(x, z, 'gum', k.r.range(1, 1.4)); }
  // cockatoos on the lawn, loud as ever
  for (let i = 0; i < 7; i++) { const b = k.mesh(new THREE.IcosahedronGeometry(0.2, 0), 0xfaf8f2); b.position.set(-6 + k.r.range(-5, 5), 0.2, -3 + k.r.range(-3, 3)); b.castShadow = false; }
  egg(k, 'cockatoos', -6, -3, 'bird', 0xfaf8f2);
  rails(k, -30, 28.5, 30, 28.5); k.vehicle([P(-26, 28.5), P(26, 28.5)], { color: 0x2f7d5b, len: 6, h: 1.9, stripe: 0xe2b23a, speed: 5 });
  k.door = { x: -6, z: -10.4 }; k.spawn = { x: 0, z: 14 };
  k.path([P(0, 14), P(-2, 4), P(-6, -10)], 1.8); k.path([P(-2, 4), P(12, 2)], 1.6); k.path([P(-2, 4), P(-14, 4)], 1.6);
  life(k, [[P(0, 14), P(-2, 4), P(-6, -9), P(-2, 4)], [P(-14, 5), P(12, 3)], [P(-12, 16), P(2, 15), P(14, 14), P(2, 15)]], { tour: [4, -1], drone: true });
}

export const PLACES_ONE = { yale, princeton, harvard, mit, illinois, rensselaer, gottingen, maryland, edinburgh, wisconsin, stanford, munich, eth, cambridge, london, cranfield, monash };
