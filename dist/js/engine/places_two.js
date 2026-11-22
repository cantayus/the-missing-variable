// Places first visited in Parts II to IV.
import { C } from './kit.js';
import { colonnade, hill, fountain, bridge, statue, stairs, mountains, life, egg, horse, rails, THREE, hangar, plane, train, block, dome, portico, cupola, steeple, quad, arcade, gothic, chapel, gate, needle, stadium, road, terrace, kite, chimney } from './parts.js';

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
  k.label('Wilson Library', 6, 18, -25); k.sign(8, 16.4, 'South Building'); k.sign(-14, 14.6, 'Old West');
  portico(k, 8, 8.4, 6, 4, 5, { rot: Math.PI, color: C.white, steps: 2, depth: 1.4 });
  // McCorkle Place, the first quad: the old poplar in the middle, Old East on its edge, Franklin Street along the far side
  k.lawn(0, 31, 20, 22); k.tree(0, 30, 'round', 2.4); k.box(0, 32.6, 1.6, 0.5, 0.5, { color: C.stone, roof: 'none', win: 'none', solid: false }); k.label('Davie Poplar', 0, 9, 30);
  k.box(16, 24, 5, 12, 6, { color: 0xc9a67a, roof: 'hip', roofColor: C.slate, win: 'grid', plain: true }); k.sign(16, 31, 'Old East, 1793'); k.box(-16, 28, 5, 10, 6, { color: C.brick, roof: 'hip', roofColor: C.slate, win: 'grid', plain: true });
  road(k, [P(-48, 44), P(48, 44)], 3); k.sign(-6, 42, 'Franklin St.'); terrace(k, -46, 39, -24, 39, { n: 6, h: 4.4, depth: 4.4, colors: [C.brick, 0xd8c7a6, C.brickDark, 0xe4dccb] });
  k.cyl(30, 34, 4.4, 4, { color: C.brick, roof: 'dome', roofColor: 0x8fa39a, seg: 16 }); k.box(30, 28, 12, 4, 5, { color: C.brick, roof: 'flat', roofColor: C.stone, win: 'tall', plain: true }); colonnade(k, 30, 25.4, 8, 6, 4.4, { color: C.white, rot: Math.PI, depth: 1.2, pediment: false }); k.label('Morehead Planetarium', 30, 11, 33);
  // beyond the library: South Road, the brick bell tower with its pointed cap, and the stadium in the pines
  road(k, [P(-48, -32), P(48, -32)], 2.8); k.sign(-10, -30.4, 'South Rd.');
  steeple(k, 6, -39, 3.4, 13, { color: C.brick, kind: 'spire', capColor: 0x8fa39a, trim: C.lime, clock: true }); for (const sx of [-1, 1]) arcade(k, 6 + sx * 4.6, -42, 6 + sx * 4.6, -36, { h: 2.4, color: C.brick, roofColor: C.slate, depth: 1.6 }); k.label('Bell Tower', 6, 24, -39);
  stadium(k, -24, -40, 11, 6.5, { h: 4.6, color: 0xcfc7b8 }); k.label('Kenan Stadium', -24, 8.5, -40);
  // the big modern library and the sunken square the students call the Pit; the computer science building
  k.box(36, -22, 12, 12, 11, { color: 0xb5654a, roof: 'flat', roofColor: C.concrete, win: 'bands' }); k.label('Davis Library', 36, 15, -22); k.patch(35, -8, 9, 8, 0xb9a48a, 0.025); k.sign(35, -3.4, 'The Pit'); k.box(36, 6, 12, 8, 6, { color: C.brick, roof: 'flat', roofColor: C.dark, win: 'bands' });
  k.box(-34, -16, 12, 9, 7, { color: C.brick, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.glass(-34, -10.6, 6, 2, 7); k.label('Sitterson Hall', -34, 11, -16); k.box(-36, 8, 10, 14, 6, { color: C.white, roof: 'hip', roofColor: C.slate, win: 'grid', plain: true }); colonnade(k, -30.4, 8, 8, 6, 5, { color: C.white, rot: Math.PI / 2, depth: 1.2, pediment: false }); k.sign(-29, 15.6, 'Carolina Inn');
  k.path([P(4, 17), P(2, 22), P(0, 41)], 1.6); k.path([P(6, -28.6), P(6, -36)], 1.6); k.path([P(13, -8), P(17, -10), P(29, -10)], 1.5); k.path([P(-1, -8), P(-16, -12), P(-27, -12)], 1.5); k.path([P(2, 22), P(22, 24.6)], 1.4);
  k.grove(-34, -30, 14, 2, 4, 'cone'); k.grove(-40, -40, 6, 12, 5, 'cone'); k.grove(24, -40, 20, 10, 8, ['cone', 'round']); k.grove(-8, 30, 4, 18, 6); k.grove(9, 34, 4, 12, 4); k.grove(-34, 28, 14, 10, 6); k.grove(42, 20, 6, 30, 8);
  life(k, [[P(4, 18), P(2, 22), P(0, 40), P(2, 22)], [P(-44, 42.4), P(44, 42.4)], [P(6, -29), P(6, -35), P(-10, -34), P(6, -35)], [P(13, -8), P(17, -10), P(28, -10), P(17, -10)], [P(4, 17), P(0, 10), P(-1, 2), P(-1, -18), P(13, -18), P(13, 2), P(0, 10)], [P(-16, 16), P(-2, 15), P(14, 17), P(-2, 15)]], { tour: [5, 3], mower: [6, -8, 10, 18] });
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
  k.label('Butler Library', 0, 13.5, 21); k.label('College Walk', 10, 3, 4); k.label('Alma Mater', 0, 5.5, -4.6);
  // College Walk runs from the gates on Broadway to the gates on Amsterdam Avenue
  k.plaza(-30, 4, 20, 5, 0xc9b9a0); k.plaza(30, 4, 20, 5, 0xc9b9a0); gate(k, -35.6, 4, 5, 5, { rot: -Math.PI / 2, color: 0xe4dccb }); gate(k, 35.6, 4, 5, 5, { rot: Math.PI / 2, color: 0xe4dccb });
  road(k, [P(-38.5, -48), P(-38.5, 48)], 3.4); road(k, [P(38.5, -48), P(38.5, 48)], 3.4); k.sign(-40.6, 14, 'Broadway'); k.sign(40.6, 14, 'Amsterdam Ave.');
  k.box(-41.6, 9, 2.4, 3, 2.6, { color: 0x4f7d5c, roof: 'hip', roofColor: 0x3a5a44, win: 'none', plain: true }); k.sign(-41.6, 11.6, '116 St · subway');
  // either side of Low on its cross-axis: Earl Hall and St. Paul's Chapel, a matched pair of domed brick buildings
  for (const [x, rot] of [[-13.5, -Math.PI / 2], [13.5, Math.PI / 2]]) { k.box(x, -31, 7, 8, 6.5, { color: C.brick, roof: 'flat', roofColor: C.stone, win: 'tall', plain: true }); dome(k, x, -31, 2.8, 6.5, { color: x < 0 ? 0x8fa39a : 0xb5804a, drum: 1.2, drumColor: C.brick }); portico(k, x + Math.sign(x) * 4.4, -31, 5, 4, 5, { rot, color: 0xe4dccb, steps: 2, depth: 1.4 }); }
  k.label('Earl Hall', -13.5, 13, -31); k.label('St. Paul’s Chapel', 13.5, 13, -31);
  // the north of the campus: the business school behind Low, the physics tower with its little observatory dome
  k.box(0, -38, 12, 7, 9, { color: 0xcfcac0, roof: 'flat', roofColor: 0x9a968c, win: 'bands' }); k.sign(0, -33.6, 'Uris Hall');
  k.box(-26, -40, 8, 8, 16, { color: C.brick, roof: 'flat', roofColor: C.copper, win: 'tall', plain: true }); dome(k, -26, -40, 1.6, 16.3, { color: 0x6fa59a, lantern: false }); k.label('Pupin Hall', -26, 21.5, -40);
  k.box(26, -40, 14, 8, 10, { color: C.brick, roof: 'hip', roofColor: C.copper, win: 'tall', plain: true }); k.sign(26, -35.4, 'Schermerhorn Hall'); statue(k, 16.4, -9, 1.6, 0x4a4a44); k.sign(16.4, -7, 'The Thinker');
  // across Broadway: Barnard, and the tall Gothic tower of Riverside Church; across Amsterdam: the cathedral
  k.box(-44.4, -6, 5, 16, 7, { color: C.brick, roof: 'flat', roofColor: C.stone, win: 'tall', plain: true }); k.sign(-44.4, 3.4, 'Barnard'); steeple(k, -44.6, -34, 4.4, 24, { color: 0xcfc7b8, kind: 'crown', capColor: 0xcfc7b8 }); k.box(-44.6, -42.6, 5.4, 9, 9, { color: 0xcfc7b8, roof: 'gable', roofColor: C.slate, win: 'tall', plain: true }); k.label('Riverside Church', -44.6, 34, -34);
  k.box(44.2, 32, 6.4, 22, 11, { color: 0xb9ad98, roof: 'gable', roofColor: C.slate, win: 'tall', plain: true }); for (const z of [20.4]) for (const sx of [-1, 1]) block(k, 44.2 + sx * 2.4, 0, z, 1.6, 13, 1.6, 0xb9ad98); dome(k, 44.2, 36, 3, 11, { color: 0x8fa39a, drumColor: 0xb9ad98, lantern: false, squash: 0.6 }); k.label('St. John the Divine', 44.2, 16.5, 32);
  // the city behind Butler: 114th Street and rows of brownstones
  road(k, [P(-38.5, 28.6), P(38.5, 28.6)], 2.6); k.sign(10, 30.2, 'W 114th St.'); terrace(k, -34, 34.5, 34, 34.5, { n: 12, h: 6, depth: 5, colors: [0x8a5a4a, 0x9a6a54, 0x7a4a3e, 0xb08a70] }); terrace(k, -34, 42.5, 34, 42.5, { n: 10, h: 8, depth: 6, colors: [0xb08a70, 0x8a5a4a, 0xcfc7b8] });
  terrace(k, 44.2, -44, 44.2, 14, { n: 8, h: 7, depth: 5, colors: [0x8a5a4a, 0xb08a70, 0x9a6a54] });
  k.path([P(-8, -24), P(-9, -31)], 1.5); k.path([P(8, -24), P(9, -31)], 1.5); k.path([P(-16, 2), P(-34, 4)], 1.6); k.path([P(16, 2), P(34, 4)], 1.6); k.path([P(-9, -31), P(-9, -34), P(-22, -40)], 1.4);
  k.row(-34, 0.8, -18, 0.8, 5); k.row(18, 0.8, 34, 0.8, 5); k.row(-34, 7.2, -18, 7.2, 5); k.row(18, 7.2, 34, 7.2, 5); k.grove(-6, -44.6, 30, 2, 6); k.grove(-33, 22, 4, 8, 3); k.grove(33, 22, 4, 8, 3);
  life(k, [[P(-34, 4), P(-16, 2), P(16, 2), P(34, 4), P(16, 6.5), P(-16, 6.5)], [P(-38.5, 40), P(-38.5, -40)], [P(-8, -24.4), P(-9, -31), P(-9, -34), P(8, -34), P(9, -31), P(8, -24.4)], [P(-16, 2), P(16, 2), P(16, 6.5), P(-16, 6.5)], [P(-4, 4), P(0, 9), P(0, 14.4), P(0, 9)], [P(-8, -2), P(8, -2)]], { line: [[-4, 4], [0, 9], [0, 14.6]], tour: [6, 0], bikes: 0, scooters: 2 });
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
  k.river([P(-41.6, 22), P(-30, 26), P(-14, 27), P(-2, 25), P(0, 28)], 1.6);
  k.grove(22, -4, 10, 10, 8, ['cone', 'round']); k.grove(-24, 6, 6, 10, 5, 'cone'); k.row(-1, 2, -1, 16, 5);
  k.door = { x: -14, z: -3.6 }; k.spawn = { x: 4, z: 16 };
  k.path([P(4, 20), P(4, 4)], 2); k.path([P(4, 8), P(-6, 2), P(-14, -3)], 1.8);
  k.label('Doe Library', -14, 14, -10); k.sign(-22, 24.6, 'Strawberry Creek'); k.label('Berkeley Hills', 26, 13, -24);
  { const c = k.mesh(new THREE.TorusGeometry(1.5, 0.34, 5, 12, 4.6), 0xe2b23a); c.position.set(19, 8.2, -17); c.rotation.set(-1.0, 0, 0.8); } k.sign(15, -11.4, 'The Big C');
  k.cyl(30, -28, 3, 2.6, { color: C.white, roof: 'dome', roofColor: 0xd9dde2, y: 6.2, solid: false, seg: 14 }); k.label('Lawrence Berkeley Lab', 30, 14, -28);
  // through Sather Gate to Sproul Plaza: the white hall with its columns, the student union, Telegraph Avenue running south
  k.plaza(4, 30, 9, 16, 0xd9d2c2); k.box(13.5, 30, 8, 16, 8, { color: 0xf0ede6, roof: 'hip', roofColor: C.red, win: 'tall', plain: true }); colonnade(k, 9, 30, 8, 6, 6.4, { color: 0xf0ede6, rot: -Math.PI / 2, depth: 1.2, pediment: false }); k.label('Sproul Hall', 13.5, 13, 30);
  k.box(-6, 32, 9, 10, 6, { color: 0xcfcac0, roof: 'flat', roofColor: 0x9a968c, win: 'bands' }); k.sign(-6, 38, 'Student Union'); road(k, [P(-48, 40.6), P(48, 40.6)], 2.8); k.sign(-14, 39, 'Bancroft Way');
  road(k, [P(4, 40.6), P(4, 48)], 2.6, 0x8a8478); terrace(k, 8.6, 44.6, 30, 44.6, { n: 6, h: 4.4, depth: 4.4, colors: [0xd8c7a6, C.brick, 0xe4dccb, 0x9a7460] }); terrace(k, -24, 44.6, -1, 44.6, { n: 6, h: 4.4, depth: 4.4, colors: [C.brick, 0xe4dccb, 0xd8c7a6] }); k.sign(6.6, 46.6, 'Telegraph Ave.');
  // classical halls in white granite under red tile
  k.box(-9, 20.4, 12, 5.6, 7, { color: 0xf0ede6, roof: 'hip', roofColor: C.red, win: 'tall', plain: true }); k.sign(-9, 16.8, 'Wheeler Hall');
  k.box(-6, -32, 16, 8, 7.5, { color: 0xe4dccb, roof: 'hip', roofColor: C.red, win: 'tall', plain: true }); k.label('Hearst Mining Building', -6, 12, -32);
  k.box(-34, 6, 9, 18, 8, { color: 0xf0ede6, roof: 'flat', roofColor: C.stone, win: 'tall' }); k.sign(-28.6, 6, 'Valley Life Sciences'); k.box(-28, -34, 12, 7, 7, { color: 0x7a9a8a, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.label('Soda Hall', -28, 11, -34);
  // the Greek Theatre cut into the hill, and the stadium below it
  stadium(k, 38, 4, 5.5, 5, { h: 2.6, color: 0xe4dccb, pitch: false }); block(k, 38, 0, 9.6, 7, 3, 1, 0xe4dccb); k.label('Greek Theatre', 38, 7, 4); stadium(k, 36, 26, 9, 7, { h: 4.6, color: 0xe4dccb }); k.label('Memorial Stadium', 36, 8.5, 26);
  // far to the west, the bay, and in line with the tower the red bridge at its mouth
  k.water(-45.2, 0, 5.4, 96); for (const z of [-6, -2]) block(k, -46, 0, z, 0.4, 5, 0.4, 0xc0503f); block(k, -46, 1.6, -4, 0.3, 0.2, 8, 0xc0503f); k.label('The Bay', -45, 7, -4);
  k.path([P(4, 20), P(4, 40)], 2); k.path([P(-6, 2), P(-24, 4), P(-29, 6)], 1.5); k.path([P(-14, -14.6), P(-8, -24), P(-6, -27.6)], 1.5); k.path([P(14, 4), P(26, 8), P(31, 6)], 1.4); k.path([P(10, 16), P(22, 22), P(26, 26)], 1.4);
  k.grove(-36, -16, 10, 16, 8, ['cone', 'round']); k.grove(10, -34, 10, 8, 6, 'cone'); k.grove(40, -44, 12, 6, 6, 'cone'); k.grove(24, 14, 8, 6, 4); k.grove(-30, 34, 14, 6, 6); k.grove(42, 42, 8, 8, 4); k.grove(-20, -24, 8, 6, 4, 'cone');
  life(k, [[P(4, 20), P(4, 38)], [P(-6, 2), P(-24, 4), P(-28, 6), P(-24, 4)], [P(-44, 39), P(44, 39)], [P(14, 4), P(26, 8), P(30, 6), P(26, 8)], [P(4, 16), P(4, 8), P(-6, 2), P(-13, -2.6), P(-6, 2), P(4, 8)], [P(-20, 12), P(-6, 13), P(2, 12), P(-6, 13)], [P(8, 2), P(14, 4), P(10, 16)]], { tour: [8, 6], bikes: 2, families: 3 });
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
  for (let i = 0; i < 130; i++) { const x = k.r.range(-46, 46), z = k.r.range(-44, 46); if (Math.abs(x) < 14 && z > -14 && z < 9) continue; if (x < -19 && z > 30) continue; k.tree(x, z, k.r.chance(0.6) ? 'scrub' : 'cone', k.r.range(0.5, 0.9), { colors: [0x7f8f62, 0x6f8258, 0x8a9a6a] }); }
  // a roadrunner on the path
  const rr = k.mesh(new THREE.BoxGeometry(0.2, 0.25, 0.7), 0x7a6a5a); k.anim.push((t) => { const u = (t * 0.035) % 1; rr.position.set(-40 + u * 80, 0.3, 16 + Math.sin(u * 20) * 0.4); rr.rotation.y = Math.PI / 2; });
  egg(k, 'roadrunner', 6, 17.4, 'bird', 0x7a6a5a);
  k.door = { x: 0, z: 8.4 }; k.spawn = { x: 6, z: 22 };
  k.path([P(6, 22), P(2, 14), P(0, 9)], 1.8, 0xcbb089); k.path([P(-44, 16), P(44, 16)], 1.4, 0xcbb089);
  // more of the building: the low wings of shared offices added later, stepping down the hill
  const up = (x, z) => Math.max(0, 3 * Math.sqrt(Math.max(0, 1 - ((x + 4) / 26) ** 2 - ((z + 6) / 18) ** 2)) - 0.5);
  for (const [x, z, w, d, h] of [[-18, -5, 8, 6, 3.4], [-14.5, 3.5, 6, 5, 3], [10, -15, 7, 5, 3.4]]) k.box(x, z, w, d, h, { color: (x + z) % 2 ? A : A2, roof: 'none', win: 'grid', y: up(x, z) });
  block(k, -10, 0, 12.6, 1.3, 4.6, 0.5, 0x26262b); k.sign(-10, 14.2, 'Monolith Alpha'); k.box(31, 3, 6, 4.4, 3, { color: A2, roof: 'none', win: 'grid' }); k.sign(31, 6.6, 'Heliotown II');
  // the road that climbs past the gate on its way up to the ski basin, and where the cars are left
  const HP = [P(-48, 29.5), P(-30, 29), P(-12, 26), P(8, 28.6), P(24, 24), P(36, 10), P(42, -10), P(48, -22)]; road(k, HP, 3, 0x8a8478); k.sign(-2, 24.6, 'Hyde Park Rd.'); k.sign(44, -12, 'to the ski basin');
  k.vehicle([P(-46, 29.4), ...HP.slice(1, -1), P(46.6, -20.6)], { color: 0xc9d2d8, speed: 5 });
  k.path([P(6, 22), P(7.4, 28.4)], 2.2, 0x9a8f80); k.patch(14, 21.6, 9, 4.6, 0x9a8f80, 0.03); for (const [x, c] of [[11, 0xb9c2c8], [13.6, 0x9a4a3a], [17, 0xe9e4d6]]) { block(k, x, 0.25, 21.6, 1.5, 0.8, 3.4, c); block(k, x, 1.05, 21.8, 1.4, 0.6, 1.8, 0x2f3a44); }
  // the hills behind, with a trail between them
  hill(k, -30, -36, 16, 9, 4.5, sand); hill(k, 26, -34, 18, 10, 6, sand); k.label('Sangre de Cristo Mountains', 12, 15, -45);
  k.path([P(6, 8.6), P(18, 10), P(25, 2), P(25, -12), P(18, -22), P(4, -27), P(-4, -34), P(-2, -44)], 1.1, 0xcbb089); k.sign(26.8, -6, 'trail');
  // down the road, the old town: the plaza with the long adobe palace on its north side, and the cathedral a block to the east
  k.lawn(-40, 40.4, 7, 6.4); block(k, -40, 0, 40.4, 0.6, 3, 0.6, C.stone); k.box(-40, 34.4, 12, 2.8, 2.6, { color: A2, roof: 'none', win: 'grid' }); arcade(k, -46, 36.5, -34, 36.5, { h: 2.1, color: A, roofColor: A2, depth: 1.2 }); k.sign(-33, 33.6, 'Palace of the Governors');
  k.box(-26.5, 40.4, 9, 5.4, 6.5, { color: 0xc9a878, roof: 'gable', roofColor: 0x8a6a4a, win: 'tall', plain: true }); for (const z of [38.6, 42.2]) steeple(k, -31.8, z, 1.9, 8.4, { color: 0xc9a878, kind: 'flat', capColor: 0xc9a878 }); k.label('Santa Fe', -33, 12.5, 40.4); k.sign(-26.5, 44.4, 'Cathedral of St. Francis');
  for (const [x, z, w, d, h] of [[-45, 46, 5, 3, 2.6], [-37.6, 46.2, 6, 3, 3], [-30, 46.4, 5, 2.6, 2.4], [-22.4, 34.4, 5, 4, 2.8], [-22, 46, 6, 3, 2.6], [-28.6, 33.6, 5, 3, 2.4]]) k.box(x, z, w, d, h, { color: (x + z) % 2 ? A : A2, roof: 'none', win: 'grid' });
  life(k, [[P(6, 8.6), P(18, 10), P(25, 2), P(25, -12), P(18, -22), P(4, -27), P(-4, -34), P(-2, -43), P(-4, -34), P(4, -27), P(18, -22), P(25, -12), P(25, 2), P(18, 10)], [P(-45, 44.3), P(-34.6, 44.3), P(-34.6, 37.6), P(-45, 37.6)], [P(6, 22), P(2, 14), P(0, 9.4), P(2, 14)], [P(-42, 16), P(42, 16)], [P(-8, 6), P(8, 6)]], { adults: 3, kids: 1, bikes: 1, dogs: 1, prams: 0, scooters: 0, families: 1, birds: 3, tour: [10, 12] });
}

export function cornell(k) {
  k.ground();
  const ST = 0xa9a59b, TAN = 0xc9b89a;
  // Fall Creek gorge across the north: the lake behind its dam, the falls, the footbridge hung over the drop, the road bridge
  k.patch(0, -36.5, 96, 8, 0x6f6a64, 0.02); k.water(41, -36.5, 12, 6.4); k.river([P(36, -36.5), P(14, -37.2), P(-10, -36), P(-30, -37), P(-42, -38)], 3); k.water(-45.4, -40, 5.2, 16);
  const fall = k.mesh(new THREE.BoxGeometry(2, 0.3, 3.2), 0xffffff, { transparent: true, opacity: 0.8 }); fall.position.set(34.4, 0.25, -36.6); k.anim.push((t) => { fall.material.opacity = 0.65 + Math.sin(t * 6) * 0.15; });
  k.sign(42, -31.6, 'Beebe Lake'); k.sign(-41.4, -44.6, 'Cayuga Lake'); k.sign(8, -31.6, 'Fall Creek gorge');
  bridge(k, -20, -41.4, -20, -31.6, 1.6, C.steel); for (const z of [-40.6, -32.4]) for (const sx of [-1, 1]) block(k, -20 + sx * 0.9, 0, z, 0.25, 4.2, 0.25, C.steel); k.sign(-17, -31.4, 'Suspension Bridge');
  road(k, [P(31.5, -48), P(31.5, 30)], 2.8); bridge(k, 31.5, -41.4, 31.5, -31.6, 3.2, C.stone); k.sign(34, -29.4, 'East Ave.');
  k.box(-2, -45.8, 14, 3.4, 5, { color: C.brick, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.box(15, -45.8, 12, 3.4, 6.5, { color: 0xcfc7b8, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.sign(6.6, -43.4, 'North Campus'); k.path([P(-20, -41.6), P(-16, -42.6), P(29.6, -42.6)], 1.3);
  // the clock tower and the library beside it, at the top of the slope
  k.tower(-6, -8, 4, 22, { color: 0xbfb5a2, cap: 'spire', capColor: 0x8a8f96 });
  const clock = k.mesh(new THREE.CircleGeometry(1.3, 16), 0xf4f2ec); clock.position.set(-6, 18, -5.95);
  k.box(-13, -10, 10, 8, 8, { color: 0xbfb5a2, roof: 'gable', roofColor: C.slate, win: 'tall' }); k.label('McGraw Tower', -6, 33, -8); k.sign(-13, -4.6, 'Uris Library');
  // one October a pumpkin appeared on the very top
  const pk = k.mesh(new THREE.IcosahedronGeometry(0.45, 1), 0xe07b22); pk.position.set(-6, 30.1, -8); k.pick(pk, { type: 'egg', id: 'pumpkin', x: -6, z: -4.5 }); egg(k, 'pumpkin', -3.4, -4.6, 'pumpkin');
  // the Stone Row along the crest: three grey halls, the middle one with its tower on the slope side, and the founder between them
  for (const z of [-17.5, -22.5, -27.5]) k.box(-12, z, 6, 4.2, 7, { color: ST, roof: 'hip', roofColor: C.slate, win: 'tall', plain: true });
  steeple(k, -15.8, -22.5, 1.9, 9, { color: ST, kind: 'pyramid', capColor: C.slate }); k.sign(-8, -25, 'The Stone Row'); statue(k, -7, -20, 2); k.sign(-7, -18.4, 'Ezra Cornell');
  // the Arts Quad: Goldwin Smith Hall behind its columns on the east, the domed hall on the north, the museum on the corner of the slope
  k.lawn(9, -14.5, 24, 20); k.sign(9, -3.6, 'Arts Quad');
  k.box(25.5, -14.5, 6, 16, 7.5, { color: 0xcfc7b8, roof: 'hip', roofColor: C.slate, win: 'tall', plain: true }); portico(k, 21.6, -14.5, 7, 4, 5.6, { rot: -Math.PI / 2, color: 0xe4dccb, steps: 3, depth: 1.8 }); statue(k, 17.4, -14.5, 2); k.sign(17.4, -12.6, 'A. D. White'); k.sign(21, -5.4, 'Goldwin Smith Hall');
  k.box(9, -28.6, 20, 4.8, 7, { color: TAN, roof: 'hip', roofColor: C.slate, win: 'tall', plain: true }); dome(k, 9, -28.6, 2.4, 7.6, { color: 0x8a8f96, drum: 1, drumColor: TAN }); k.label('Sibley Hall', 9, 13.5, -28.6);
  k.box(25.5, -27.6, 6, 6, 7, { color: C.brick, roof: 'hip', roofColor: C.slate, win: 'tall', plain: true });
  k.box(-25, -29, 5, 5, 11, { color: C.concrete, roof: 'flat', roofColor: 0x9a968c, win: 'none' }); block(k, -25, 7.6, -27.4, 7.4, 2.6, 3.6, C.concrete); k.label('Johnson Museum', -25, 15, -29);
  k.box(10, 8, 16, 6, 7, { color: 0xbfb5a2, roof: 'gable', roofColor: C.slate, win: 'tall' });
  for (const [x, z] of [[9, -7.6], [9, -21.6], [2, -14.5], [16, -14.5]]) k.tree(x, z, 'round', 1.4);
  // south of the tower: the plaza, the students' union on the brow of the slope, the brick chapel
  k.plaza(-2.5, 12, 6, 14, 0xcfc7b8); k.sign(1.6, 12.4, 'Ho Plaza'); gothic(k, -12, 9.5, 9, 7, 7, { color: ST }); k.sign(-6.6, 14.6, 'Willard Straight Hall');
  k.box(10, 16.6, 12, 5.2, 6, { color: C.brick, roof: 'gable', roofColor: C.slate, win: 'tall', plain: true }); steeple(k, 2.8, 16.6, 2.2, 8, { color: C.brick, kind: 'spire', capColor: C.slate }); k.sign(16.8, 20.6, 'Sage Chapel');
  // the slope down to the west, and the Gothic houses and the war memorial at the foot of it
  k.lawn(-30, -8, 20, 34); k.sign(-21, 6.4, 'Libe Slope');
  for (const z of [-14, -3]) steeple(k, -44, z, 3, 11, { color: ST, kind: 'crown', capColor: ST }); arcade(k, -44, -12.2, -44, -4.8, { h: 3, color: ST, roofColor: C.slate, depth: 2 }); k.label('War Memorial', -44, 19, -8.5);
  gothic(k, -43.5, 8, 6, 11, 6, { color: ST }); k.box(-33, 17, 11, 5, 6, { color: ST, roof: 'gable', roofColor: C.slate, win: 'grid', plain: true }); k.sign(-36, 13, 'West Campus');
  // east of the avenue: the round hall, the farm school's quad, the drill hall, computing, the football field
  k.cyl(39, -26, 4.4, 5, { color: 0xd8cfb8, roof: 'dome', roofColor: 0x8a8f96, seg: 16 }); colonnade(k, 39, -21.2, 7, 6, 4.4, { color: C.white, depth: 1.2, pediment: false }); k.sign(44.6, -21.4, 'Bailey Hall');
  k.lawn(39, -12, 9, 11); k.sign(39, -5.4, 'Ag Quad'); k.box(45.6, -12, 3.6, 11, 7, { color: 0xcfc7b8, roof: 'flat', roofColor: C.dark, win: 'tall', plain: true }); k.sign(44.6, -18.4, 'Mann Library');
  hangar(k, 40.5, 6.5, 11, 9, 7, ST); for (const sx of [-1, 1]) for (const sz of [-1, 1]) block(k, 40.5 + sx * 5.6, 0, 6.5 + sz * 4.6, 1.5, 8, 1.5, ST); k.label('Barton Hall', 40.5, 11, 6.5);
  k.box(40, 22, 12, 8, 9, { color: C.concrete, roof: 'solar', win: 'bands' }); k.glass(40, 17.4, 8, 1.6, 9);
  stadium(k, 40.5, 37, 6.5, 5.2, { h: 4.2, color: ST }); k.sign(33.4, 33, 'Schoellkopf Field');
  // the engineers' quad with its sundial, the law school's tower, and the second gorge along the south
  k.lawn(8, 35.5, 18, 8); k.box(8, 27.6, 16, 4, 6, { color: C.concrete, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.glass(8, 30, 10, 1, 5); k.box(21, 35.5, 5, 9, 7, { color: 0xb9c2c8, roof: 'flat', roofColor: C.dark, win: 'bands' });
  k.cyl(8, 35.5, 0.9, 0.4, { color: C.stone, roof: 'none', seg: 12 }); block(k, 8, 0.4, 35.5, 0.12, 1, 0.9, 0x8a8f96); k.sign(8, 40.4, 'Engineering Quad');
  gothic(k, -17, 35, 11, 6, 7, { color: ST }); steeple(k, -17, 30.2, 2.8, 11, { color: ST, kind: 'crown', capColor: ST }); k.sign(-9.6, 39, 'Myron Taylor Hall');
  k.patch(0, 45.4, 96, 5.2, 0x6f6a64, 0.02); k.river([P(48, 45), P(20, 46), P(-10, 45.2), P(-48, 46)], 2); bridge(k, -6, 42.2, -6, 48, 2.2, C.stone); k.sign(-10.6, 41.8, 'Cascadilla Gorge');
  k.grove(4, -41.3, 44, 1, 8, 'cone'); k.grove(40, -31.6, 12, 1.2, 4, 'cone'); k.grove(-36, -31, 12, 2, 5, 'cone'); k.grove(-36, 2, 8, 8, 4); k.grove(-35, -22, 8, 6, 3); k.grove(26, 13, 7, 5, 4); k.grove(-30, 28, 12, 8, 6); k.grove(-41, 34, 10, 14, 6); k.grove(26, 0, 6, 5, 3); k.row(34.6, -18.2, 43, -18.2, 4); k.row(0, 2, 22, 2, 7); k.grove(20, 42, 14, 1, 4, 'cone'); k.grove(-30, 42, 30, 1, 6, 'cone');
  k.rooms = [{ x: 1, z: 6, label: 'Rosenblatt session', ids: ['II-12'] }, { x: 33, z: 22, label: 'Gates Hall', ids: ['IV-15'] }]; k.door = k.rooms[0]; k.spawn = { x: -2, z: 14 };
  k.path([P(-2, 14), P(-1, 6), P(-4, -4)], 1.8); k.path([P(-4, -4), P(-2.4, -8), P(-3, -14), P(-3.6, -26)], 1.6); k.path([P(-3, -5), P(9, -14.5), P(19, -22.5)], 1.4); k.path([P(-3.4, -24), P(9, -14.5), P(19, -6.5)], 1.4);
  k.path([P(-3.6, -26), P(-6, -32), P(-20, -32)], 1.3); k.path([P(-5.4, 3), P(-20, -2), P(-39, -8)], 1.4); k.path([P(-2, 16), P(2, 22), P(33, 22)], 1.6); k.path([P(-2, 19), P(-2, 30), P(-6, 42)], 1.6); k.path([P(19, -6.5), P(30, -8), P(34.6, -11)], 1.3);
  life(k, [[P(-2, 14), P(-1, 6), P(-2, -4), P(-1, 6)], [P(-2, -4), P(9, -14.5), P(18, -22), P(9, -14.5), P(-3.4, -25), P(-2.6, -14)], [P(-2, 16), P(2, 22), P(32, 22), P(2, 22)], [P(-5, 3), P(-20, -2), P(-38, -8), P(-20, -2)], [P(-3.6, -26), P(-6, -32), P(-20, -32), P(-20, -41.6), P(-16, -42.6), P(28, -42.6), P(-16, -42.6), P(-20, -41.6), P(-20, -32), P(-6, -32)], [P(-2, 19), P(-2, 30), P(-6, 41.6), P(-2, 30)]], { tour: [13, -10], bikes: 1 });
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
  for (let i = 0; i < 24; i++) k.disc(8.6 + i * 0.85, -2.4 + Math.sin(i * 0.55) * 1.7, 0.8, i % 2 ? 0x5f7a6a : 0x7f9a84, 0.04);
  for (const [x0, x1, z0, z1, n] of [[26, 36.5, 16, 46, 14], [-27, -6, -46, -22, 12], [8, 25, -46, -20, 12], [-12, 26, 10, 21, 8], [-27, -8, 14, 28, 8], [26, 36.5, -12, 10, 6]]) for (let i = 0; i < n; i++) { const x = k.r.range(x0, x1), z = k.r.range(z0, z1); if (Math.abs(x + 3) < 4) continue; k.tree(x, z, 'gum', k.r.range(1, 1.5)); }
  for (const [x, z] of [[-10, 2], [10, 2], [-26, -24], [26, 2]]) k.tree(x, z, 'palm');
  k.door = { x: 0, z: 0.6 }; k.spawn = { x: -4, z: 14 };
  k.path([P(-4, 14), P(-2, 6), P(0, 1)], 1.8);
  k.sign(17, 0.8, 'Snake Path'); k.sign(17, -5.6, 'Jacobs Hall');
  // Library Walk runs south from the library, past the student centre, to the medical school
  k.plaza(-3, 25, 5, 34, 0xd9d2c2); k.sign(0.8, 19, 'Library Walk'); k.box(9, 27, 13, 9, 7, { color: 0xd9d4c8, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.plaza(21, 27, 9, 8, 0xd9d2c2); k.label('Price Center', 9, 11, 27);
  k.box(12, 40, 14, 8, 8, { color: 0xd9c9a8, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.sign(12, 35.2, 'School of Medicine');
  k.lawn(-13, 22, 9, 8); k.sign(-13, 26.8, 'Sun God Lawn');
  // the oldest college in the south-west corner: a plaza with a fountain, tall concrete laboratories
  k.plaza(-14, 38, 12, 8, 0xd9d2c2); fountain(k, -14, 38, 1.8); k.sign(-14, 43, 'Revelle Plaza'); k.box(-24, 33, 6, 10, 12, { color: C.concrete, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.sign(-24, 39, 'Urey Hall'); k.box(-13, 30.8, 10, 3.6, 6, { color: C.concrete, roof: 'flat', roofColor: C.dark, win: 'bands' });
  // engineering and computing to the east, then the trolley and the freeway
  k.box(31, -20, 8, 10, 9, { color: 0xb9c2c8, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.sign(31, -13.8, 'Atkinson Hall'); k.box(31, -34, 10, 8, 7, { color: 0xd9d4c8, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.sign(31, -28.8, 'Computer Science'); k.lawn(32, -2.4, 8, 6); k.sign(32, 1.6, 'Warren Mall');
  rails(k, 41, -48, 41, 48); train(k, 41, -44, 41, 44, 3, 0xc0392b); block(k, 38.7, 0, 12, 2, 0.45, 14, C.concrete); block(k, 38.7, 3, 12, 2.4, 0.18, 12, 0xd9dde2); for (const z of [7, 12, 17]) block(k, 38.7, 0.45, z, 0.2, 2.6, 0.2, 0x8a8f96); k.sign(36.8, 12, 'Trolley · Central Campus');
  road(k, [P(46, -48), P(46, 48)], 3.4, 0x6f7278); k.vehicle([P(46.6, -47), P(46.6, 47)], { color: 0xe9e4d6, speed: 9, pause: 0 }); k.vehicle([P(45.4, 47), P(45.4, -47)], { color: 0x4a6a8a, speed: 8, pause: 0 });
  // north: the arena and its playing field
  k.box(0, -38, 18, 9, 7, { color: 0xcfcac0, roof: 'flat', roofColor: 0x9a968c, win: 'bands' }); k.label('RIMAC Arena', 0, 11, -38); k.lawn(-16, -30, 10, 12); k.path([P(0, -12.6), P(0, -33)], 1.6);
  // west, across the road: the laboratories that face each other over a bare court, the glider field, the cliffs and the sea
  road(k, [P(-30, -48), P(-29, -10), P(-30, 20), P(-32, 48)], 3); k.sign(-27, -22, 'N. Torrey Pines Rd.');
  k.plaza(-36.5, -34, 7, 5.4, 0xe8e0d0); k.patch(-36.5, -34, 7, 0.36, 0x6fb4d8, 0.05, 1, false); for (const z of [-38.6, -29.4]) k.box(-36.5, z, 7, 3.4, 6, { color: C.concrete, roof: 'flat', roofColor: 0x9a968c, win: 'bands' }); k.label('Salk Institute', -36.5, 10, -34);
  k.lawn(-36, -17, 8, 9); kite(k, -36, -17); k.sign(-33, -11.6, 'Gliderport');
  k.patch(-41.4, 0, 1.8, 96, 0xd9c29a, 0.03); k.water(-45.2, 0, 5.8, 96); k.label('Pacific Ocean', -45, 5, -6);
  block(k, -43.6, 0.9, 30, 8.8, 0.25, 1.2, 0x8a7a66); for (const x of [-47, -45, -43]) for (const s of [-0.45, 0.45]) block(k, x, 0, 30 + s, 0.28, 0.9, 0.28, 0x6b5a4a); k.label('Scripps Pier', -44, 5, 30);
  k.box(-35.6, 24, 7, 5, 4.5, { color: 0xe4dccb, roof: 'flat', roofColor: 0x9a968c, win: 'bands' }); k.box(-35.6, 34, 7, 6, 5, { color: 0xe4dccb, roof: 'flat', roofColor: 0x9a968c, win: 'bands' }); k.sign(-35.6, 29, 'Scripps Oceanography');
  k.grove(-39.4, 6, 2, 24, 6, 'cone'); k.path([P(-39.6, -24), P(-39.6, 20)], 1.1, 0xd9c9a8);
  life(k, [[P(-3, 9), P(-3, 41)], [P(8.6, -2.4), P(18, -2.6), P(27, -2.4)], [P(0, -13.4), P(0, -32)], [P(-39.6, -23), P(-39.6, 19)], [P(-4, 14), P(-2, 6), P(0, 1.6), P(-2, 6)], [P(-16, 4), P(16, 4)], [P(8, 8), P(16, 6.4), P(22, 0)]], { tour: [6, 5], bikes: 2, scooters: 2, drone: true });
}

export function toronto(k) {
  k.ground();
  const UC = 0xb9ab8f;
  // the library: a concrete bird with its tail up
  k.box(-6, -10, 16, 14, 16, { color: 0xbdb8ae, roof: 'flat', roofColor: 0x8f8a80, win: 'bands' });
  for (const [x, z, r] of [[-17, -3, 0.5], [5, -3, -0.5], [-6, -20, 0]]) k.box(x, z, 8, 8, 12, { color: 0xbdb8ae, roof: 'flat', roofColor: 0x8f8a80, win: 'bands', rot: r });
  const beak = k.mesh(new THREE.ConeGeometry(3, 8, 3), 0xbdb8ae); beak.position.set(-6, 13, -1.6); beak.rotation.x = Math.PI / 2.4;
  k.label('Robarts Library', -6, 21, -10); egg(k, 'peacock', -1, 1.6, 'bird', 0x3f7fb5);
  // the streets of the grid, and the red streetcars on two of them
  road(k, [P(-48, 5), P(48, 5)], 2.8); k.sign(-24, 3, 'Harbord St.'); k.sign(40, 3, 'Hoskin Ave.');
  road(k, [P(14, -48), P(14, 41.4)], 2.8); k.sign(16.4, -14, 'St. George St.');
  road(k, [P(-48, -41), P(48, -41)], 3); k.sign(-10, -38.6, 'Bloor St.');
  road(k, [P(-48, 43), P(48, 43)], 3.2); rails(k, -48, 43, 48, 43); k.sign(6, 40.6, 'College St.'); k.vehicle([P(-44, 43), P(44, 43)], { color: 0xc0392b, len: 6.4, h: 1.9, stripe: 0xf4f2ec, speed: 5 });
  road(k, [P(-41, -48), P(-41, 48)], 3.2); rails(k, -41, -48, -41, 17.2); rails(k, -41, 30.8, -41, 48); k.sign(-38, -12, 'Spadina Ave.'); k.vehicle([P(-41, -45), P(-41, 15)], { color: 0xc0392b, len: 6.4, h: 1.9, stripe: 0xf4f2ec, speed: 4.5 });
  k.disc(-41, 24, 6.6, 0x7d8087, 0.036); k.disc(-41, 24, 5.2, k.season.grass, 0.04); gothic(k, -41, 23.4, 5, 6, 7, { color: UC }); steeple(k, -41, 27.4, 2, 10, { color: UC, kind: 'spire', capColor: C.slate }); k.sign(-34, 26.4, '1 Spadina Crescent');
  // Bloor Street along the top: the museum with its glass crystal, the stadium, the brick houses of the Annex
  k.box(41.5, -33, 9, 8, 7, { color: UC, roof: 'hip', roofColor: C.slate, win: 'tall', plain: true }); { const cr = k.mesh(new THREE.TetrahedronGeometry(3.6), 0xc9d6de, { metalness: 0.4, roughness: 0.3 }); cr.position.set(39.6, 2.2, -37.4); cr.rotation.set(0.5, 0.7, 0.2); } k.label('Royal Ontario Museum', 41.5, 11.5, -33);
  stadium(k, 25, -33, 8, 5, { h: 3.4, color: C.concrete }); k.sign(25, -26.8, 'Varsity Stadium'); k.box(4, -33.6, 10, 8, 10, { color: 0xbdb8ae, roof: 'flat', roofColor: 0x8f8a80, win: 'bands' });
  terrace(k, -36, -32, -16, -32, { n: 6, h: 5, depth: 5, colors: [C.brick, 0x9a5a48, C.brickDark, 0xb5654a], roof: 'gable', roofColor: C.slate }); terrace(k, -36, -20, -25, -20, { n: 3, h: 5, depth: 5, colors: [0x9a5a48, C.brick, C.brickDark], roof: 'gable', roofColor: C.slate }); k.sign(-26, -26.4, 'The Annex');
  terrace(k, -45.8, -38, -45.8, 14, { n: 9, h: 4.4, depth: 3.4, colors: [C.brick, 0xd8c7a6, C.brickDark, 0x9a5a48] });
  k.box(-30, -4, 11, 9, 7, { color: C.concrete, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.sign(-30, 1.6, 'Athletic Centre');
  gothic(k, 25, -3.4, 14, 5, 6.5, { color: UC }); steeple(k, 25, -3.4, 2.6, 9.5, { color: UC, kind: 'point' }); k.sign(25, 0.8, 'Trinity College');
  k.path([P(35.4, -28.6), P(33.6, -18), P(36, -8), P(34.6, 3.4)], 1.3); k.sign(38, -22, 'Philosopher’s Walk');
  // the old college with the circle of lawn in front of it; the domed hall; the house with the memorial tower
  k.lawn(27, 10, 14, 4.6); k.box(28, 17, 18, 5, 7, { color: UC, roof: 'gable', roofColor: C.slate, win: 'tall' }); k.tower(28, 17, 3.6, 14, { color: UC, cap: 'belfry', capColor: C.slate }); k.label('University College', 28, 19.5, 17);
  steeple(k, 39.4, 11, 2.6, 13, { color: UC, kind: 'point', clock: true }); k.sign(36.4, 9.2, 'Soldiers’ Tower'); gothic(k, 43, 17.6, 8, 9, 6.5, { color: UC }); k.sign(43, 23.4, 'Hart House');
  k.disc(28, 28, 6.8, 0xc9c2b4, 0.032); k.disc(28, 28, 5.6, k.season.grass, 0.04); k.sign(28, 28, 'King’s College Circle');
  k.cyl(19.2, 33.6, 3.4, 5.5, { color: 0xd9cfb8, roof: 'dome', roofColor: 0x8fa39a, seg: 16 }); colonnade(k, 22.1, 31.7, 5, 5, 4.4, { color: 0xe4dccb, rot: 2.14, depth: 1.2, pediment: false }); k.label('Convocation Hall', 19.2, 12, 33.6);
  gothic(k, 18.9, 25.4, 4.6, 7, 6, { color: 0xa9a18f }); k.sign(18.9, 20.6, 'Knox College');
  k.box(42, 29, 8, 9, 7, { color: 0xcfc7b8, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.sign(37, 29, 'Medical Sciences'); k.path([P(28, 34.8), P(28, 41.4)], 2.4, 0xc9c2b4);
  // the provincial legislature, pink stone, at the top of the avenue
  const PK = 0xb07a66; k.box(40, 38, 12, 5, 6.5, { color: PK, roof: 'hip', roofColor: 0x6f8f86, win: 'tall', plain: true }); k.box(40, 38.4, 4.4, 5.8, 8.5, { color: PK, roof: 'hip', roofColor: 0x6f8f86, win: 'tall', plain: true }); for (const sx of [-1, 1]) steeple(k, 40 + sx * 3.1, 40.3, 1.3, 9, { color: PK, kind: 'dome', capColor: 0x6f8f86 }); k.label('Queen’s Park', 40, 13.5, 38);
  // west of St. George Street: lecture halls, the physics tower with its two domes, the computing building
  k.box(-9, 17, 12, 8, 7, { color: 0xcfcac0, roof: 'flat', roofColor: 0x9a968c, win: 'bands' }); k.sign(-9, 22.2, 'Sidney Smith Hall');
  k.box(-7, 33, 14, 8, 9, { color: C.brick, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.glass(-7, 28.4, 8, 1.4, 9); k.label('Bahen Centre', -7, 13.5, 33);
  k.box(-26, 31, 9, 9, 13, { color: 0xbdb8ae, roof: 'flat', roofColor: 0x8f8a80, win: 'bands' }); for (const dx of [-2, 2]) dome(k, -26 + dx, 31, 1.3, 13.2, { color: 0xd9dde2, lantern: false }); k.sign(-26, 37, 'McLennan Physical Labs');
  k.box(-28, 14, 10, 8, 6, { color: C.brick, roof: 'hip', roofColor: C.slate }); k.sign(-28, 19.2, 'New College');
  // south of College Street the city begins, and the tower stands over it
  needle(k, -22, 46.2, 30, 'cn'); for (const [x, w, h, c] of [[-8, 8, 5, 0xb8c2cc], [8, 10, 6.5, 0xc9d6de], [24, 8, 5, 0xb8c2cc], [38, 10, 6, 0xcfcac0]]) k.box(x, 46.4, w, 2.6, h, { color: c, roof: 'flat', roofColor: C.dark, win: 'bands' });
  k.row(-36, 9, 10, 9, 9); k.row(-24, 1, 10, 1, 7); k.grove(-18, 26, 6, 8, 4, ['round', 'cone']); k.grove(4, 20, 6, 8, 4); k.grove(40.5, -15, 5, 18, 7); k.grove(44, 9, 6, 3, 3);
  k.door = { x: -6, z: -2.2 }; k.spawn = { x: 2, z: 12 };
  k.path([P(2, 12), P(0, 6), P(-5, -1.6)], 1.8); k.path([P(2, 12), P(3, 24), P(6, 41)], 1.6); k.path([P(2, 12), P(12.6, 13)], 1.6); k.path([P(15.4, 13), P(17.6, 20.8), P(22, 22.4)], 1.5);
  life(k, [[P(2, 12), P(0, 6), P(-5, -1), P(0, 6)], [P(-36, 7.4), P(11.6, 7.4)], [P(34.2, 28), P(32.4, 32.4), P(28, 34.2), P(23.6, 32.4), P(21.8, 28), P(23.6, 23.6), P(28, 21.8), P(32.4, 23.6)], [P(-36, 41), P(44, 41)], [P(35.4, -28.6), P(33.6, -18), P(36, -8), P(34.6, 3.2), P(36, -8), P(33.6, -18)], [P(2, 12), P(3, 24), P(6, 40), P(3, 24)]], { tour: [-12, 7.6], bikes: 2 });
}

export function manchester(k) {
  k.ground();
  // the old quadrangle on the main road: dark stone, a tall tower over the gate
  const S = 0x9a8e7c;
  k.box(-8, -12, 26, 5, 8, { color: S, roof: 'gable', roofColor: C.slate, win: 'tall' }); k.box(-21, -2, 5, 16, 8, { color: S, roof: 'gable', roofColor: C.slate, win: 'tall' }); k.box(5, -2, 5, 16, 8, { color: S, roof: 'gable', roofColor: C.slate, win: 'tall' });
  k.box(-12, 7.4, 14, 4, 8, { color: S, roof: 'gable', roofColor: C.slate, win: 'tall' }); k.tower(-1, 7.4, 5, 17, { color: S, cap: 'belfry', capColor: C.slate }); k.arch(-1, 10.2, 4, 5, { color: S });
  k.lawn(-8, -2, 18, 10); k.label('Old Quadrangle', -8, 14, -12);
  // the main road, with buses
  k.path([P(-48, 14), P(48, 14)], 4, 0x8f8a84); k.vehicle([P(-44, 13.2), P(44, 13.2)], { color: 0xe2b23a, len: 5, h: 2.6, w: 1.7, stripe: 0x24406e, speed: 4.5 }); k.vehicle([P(44, 14.9), P(-44, 14.9)], { color: 0xc0392b, len: 5, h: 2.6, w: 1.7, stripe: 0xf4f2ec, speed: 4 });
  k.sign(-12, 10.8, 'Whitworth Hall'); k.sign(-8, -8.2, 'John Owens Building'); k.sign(-18, 11.2, 'Oxford Road');
  k.box(20, -8, 12, 12, 9, { color: C.brick, roof: 'hip', roofColor: C.slate }); k.glass(20, 2, 10, 5, 11);
  // a bench in a small garden, with one figure sitting and an apple beside him; and the city's bees
  k.lawn(42.5, 6, 8, 5); k.bench(42.5, 6.2, Math.PI, false); const tb = k.statueFigure(0x6f7f72, 0.95); tb.position.set(42.1, 0.1, 6.3); k.g.add(tb); const ap = k.mesh(new THREE.IcosahedronGeometry(0.14, 1), 0xb5483f); ap.position.set(43.1, 0.6, 6.3);
  egg(k, 'bees', 39, 9.8, 'ball', 0xe2b23a);
  k.grove(46, 9.8, 3, 2, 2); k.row(-18, 2, 2, 2, 5);
  k.door = { x: -1, z: 4.6 }; k.spawn = { x: -1, z: 11.6 };
  k.path([P(-1, 11.6), P(-1, 3), P(-8, -3)], 1.8);
  k.label('Manchester Museum', 20, 13.5, -8); k.sign(42.5, 9.6, 'Sackville Gardens');
  // across the road: the dark cube of the computer scientists, the steel drum, the swimming pool, and behind them the park and the mathematicians
  k.box(-8, 24, 12, 11, 8, { color: 0x3f444c, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.label('Kilburn Building', -8, 12.5, 24);
  k.cyl(9, 22.5, 4.6, 9, { color: 0xb8c2cc, roof: 'none', seg: 18 }); k.disc(9, 22.5, 4.6, 0x9aa3ab, 9.02); k.box(9, 29.6, 12, 4, 7, { color: 0xd9d4c8, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.sign(15.4, 18.4, 'University Place');
  hangar(k, 22.5, 23, 11, 8, 5.5, 0xb8c2cc); k.sign(22.5, 17.6, 'Aquatics Centre');
  k.box(-32, 22, 10, 8, 6, { color: C.brick, roof: 'flat', roofColor: C.dark, win: 'grid' }); k.sign(-25.6, 19, 'Students’ Union');
  k.lawn(-8, 33.4, 16, 5); k.sign(-17.4, 33.4, 'Brunswick Park'); k.box(-8, 40.4, 18, 6, 7, { color: 0xd9d4c8, roof: 'solar', win: 'bands' }); k.label('Alan Turing Building', -8, 11.5, 40.4);
  k.box(18, 39, 20, 7, 7, { color: 0x2f3338, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.label('Nancy Rothwell Building', 18, 11.5, 39); k.box(-27, 38, 8, 7, 7, { color: 0x2a2d31, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.sign(-27, 43, 'Graphene Institute');
  road(k, [P(-48, 45.8), P(48, 45.8)], 2.6); k.sign(4, 44, 'Upper Brook St.');
  // behind the quadrangle: the old physics laboratory and its neighbours, the libraries, a long row of terraces
  k.box(-10, -24, 12, 6, 7, { color: C.brick, roof: 'hip', roofColor: C.slate, win: 'tall', plain: true }); k.sign(-10, -19.6, 'Rutherford Building'); k.box(6, -24, 12, 6, 7, { color: C.brickDark, roof: 'hip', roofColor: C.slate, win: 'tall', plain: true }); k.sign(6, -19.6, 'Coupland Building');
  k.path([P(-25.6, -17.6), P(26, -17.6)], 1.8, 0x8f8a84); k.path([P(-25.6, 12), P(-25.6, -30)], 2, 0x8f8a84); k.sign(-23.4, -28, 'Burlington St.');
  k.box(-33, 5, 9, 7, 7, { color: 0xd8d2c4, roof: 'flat', roofColor: C.stone, win: 'tall', plain: true }); portico(k, -33, 9.3, 6, 4, 5.4, { color: 0xe4dccb, steps: 2, depth: 1.4 }); k.sign(-27.4, 9.6, 'Samuel Alexander Building');
  k.box(-33, -6.5, 9, 8, 7, { color: 0xd9dde2, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.sign(-27.4, -6.5, 'Learning Commons'); k.box(-33, -20, 10, 12, 8, { color: C.brick, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.label('Main Library', -33, 12, -20);
  terrace(k, -22, -37, 24, -37, { n: 11, h: 4.4, depth: 4.4, colors: [C.brick, C.brickDark, 0x9a5a48], roof: 'gable', roofColor: C.slate });
  // down the road: the gallery in its park
  k.box(-43.5, 4, 7, 9, 6, { color: 0xa5503a, roof: 'hip', roofColor: C.slate, win: 'tall', plain: true }); k.sign(-43.5, 9.6, 'The Whitworth'); k.lawn(-43, -14, 9, 22); k.sign(-37.6, -14, 'Whitworth Park');
  // up the road towards town: the flyover, the railway on its viaduct and the station, the great red college of technology, the clock tower
  road(k, [P(30.5, -48), P(30.5, 48)], 3.4, 0x6f7278); bridge(k, 30.5, 9.6, 30.5, 18.4, 4, C.concrete); k.sign(28, -30, 'Mancunian Way');
  rails(k, 35.6, -48, 35.6, 48); train(k, 35.6, -44, 35.6, 44, 3, 0x4a4f8a); block(k, 37.7, 0, 22, 1.6, 0.5, 10, C.concrete); hangar(k, 39.8, 22, 3.6, 9, 3.2, 0xc9a67a); k.sign(38, 28.2, 'Oxford Road station');
  k.box(42.5, -10, 8, 14, 9, { color: 0xa5503a, roof: 'hip', roofColor: C.slate, win: 'tall', plain: true }); for (const sx of [-1, 1]) steeple(k, 42.5 + sx * 3.3, -2.6, 1.5, 10.5, { color: 0xa5503a, kind: 'dome', capColor: 0x8fa39a }); k.label('Sackville Street Building', 42.5, 15, -10);
  steeple(k, 43.5, 33, 3, 15, { color: 0xa5503a, kind: 'dome', capColor: 0x8fa39a, clock: true }); k.box(43.5, 38.6, 7, 7, 8, { color: 0xa5503a, roof: 'flat', roofColor: C.dark, win: 'tall', plain: true }); k.sign(39.4, 31, 'the Refuge clock tower');
  k.box(42, -30, 10, 8, 9, { color: C.brickDark, roof: 'flat', roofColor: C.dark, win: 'grid' }); chimney(k, 46, -37, 14); k.sign(42, -24.6, 'an old cotton mill');
  k.path([P(4, 16), P(2.4, 31), P(-8, 36.6)], 1.5); k.path([P(2.4, 31), P(8, 34.4)], 1.4);
  k.grove(-8, 33.4, 14, 4, 5); k.grove(-43, -14, 8, 20, 9); k.grove(8, -31, 30, 4, 6); k.grove(-18, -31, 10, 4, 3); k.grove(-40, 34, 12, 14, 6); k.grove(22, -30, 10, 8, 4);
  life(k, [[P(-25.6, 11), P(-25.6, -28)], [P(-44, 16.6), P(44, 16.6)], [P(4, 16.6), P(2.4, 31), P(-8, 36.4), P(2.4, 31)], [P(-46, -4), P(-39, -4), P(-39, -24), P(-46, -24)], [P(-24, -17.6), P(25, -17.6)], [P(-44, 11.6), P(44, 11.6)], [P(-1, 11), P(-1, 3), P(-14, -3), P(-1, 3)], [P(39, 9.4), P(46, 9.4), P(39, 10.6)]], { line: [[-1, 11], [-1, 5.2]], tour: [-8, 2], bikes: 2, dogs: 2 });
}

export function cmu(k) {
  k.ground();
  // two dark, angular halls joined by a ramp that winds between them
  for (const [x, z, w, d, h, r] of [[-8, -10, 14, 10, 13, 0.12], [8, -14, 12, 9, 16, -0.2], [0, -2, 9, 6, 8, 0.3]]) k.box(x, z, w, d, h, { color: 0x4a4f57, roof: 'green', win: 'grid', rot: r });
  const helix = k.mesh(new THREE.TorusGeometry(4, 0.5, 6, 20, Math.PI * 1.5), 0xb8c2cc); helix.position.set(1, 6, -8); helix.rotation.x = Math.PI / 2 - 0.25;
  k.label('Gates and Hillman Centers', 0, 20, -12);
  // the old hall with a rotunda on its roof
  k.box(-22, 8, 10, 14, 9, { color: 0xd9c9a8, roof: 'flat', roofColor: C.stone, win: 'tall' }); k.cyl(-22, 8, 2.6, 5, { color: 0xd9c9a8, roof: 'dome', roofColor: C.copper, y: 9.2, solid: false, seg: 12 });
  k.lawn(8, 12, 40, 12); k.sign(-4, 19, 'The Mall');
  // the fence that students repaint by night, and a drinks machine with a network cable
  for (let i = 0; i < 9; i++) { const p = k.mesh(new THREE.BoxGeometry(0.3, 1.2, 0.3), [0xd24d3e, 0xe2b23a, 0x3f7fb5, 0x4f9a54, 0x8a6aa8][i % 5]); p.position.set(-4 + i * 1.2, 0.6, 10); } const rail = k.mesh(new THREE.BoxGeometry(10.4, 0.25, 0.3), 0xd24d3e); rail.position.set(0.8, 0.95, 10);
  k.box(13, 3.4, 1.2, 0.9, 2.2, { color: 0xc0392b, roof: 'none', win: 'none', solid: false }); egg(k, 'cokemachine', 13, 4.6, 'box', 0xc0392b);
  k.box(25, -4, 9, 12, 8, { color: C.brick, roof: 'hip', roofColor: C.slate }); k.box(22, 25, 12, 7, 9, { color: 0xc9cdd2, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.box(-8, 24, 22, 5, 6, { color: 0xd9c9a8, roof: 'hip', roofColor: C.slate, win: 'tall' });
  // a small robot car doing laps
  k.vehicle([P(-12, 16.5), P(18, 16.5)], { color: 0xf4f2ec, len: 1.6, w: 0.9, h: 0.6, y: 0.1, stripe: 0x2f6f8f, speed: 3, pause: 1 });
  k.grove(-24, -14, 8, 16, 6); k.row(-10, 6, 16, 6, 7);
  k.door = { x: 1, z: 2 }; k.spawn = { x: 4, z: 14 };
  k.path([P(4, 14), P(2, 8), P(1, 2.6)], 1.8);
  k.label('Hamerschlag Hall', -22, 17, 8); k.sign(17, 1.6, 'The Cut'); k.sign(1, 8.6, 'The Fence'); k.sign(22, 29.8, 'Hunt Library'); k.sign(-8, 20.4, 'Baker and Porter Halls'); k.sign(25, 3.4, 'Cohon University Center');
  // the Cut: the strip of grass that comes down from the avenue, with the bridge of coloured lights across it
  k.lawn(17, -12, 4.2, 24); k.box(25, -17, 9, 8, 8, { color: C.brick, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.sign(25, -11.6, 'Purnell Center');
  for (let i = 0; i < 6; i++) block(k, 15.2 + i, 5, -15, 1, 0.3, 1.5, [0xd24d3e, 0xe2b23a, 0x4f9a54, 0x3f7fb5, 0x8a6aa8, 0xd24d3e][i]); for (const x of [14.9, 20.4]) block(k, x, 0, -15, 0.3, 5, 0.3, 0x8a8f96); k.sign(17, -19, 'Pausch Bridge');
  // the avenue along the north, and the business school beyond it
  road(k, [P(-48, -28), P(48, -28)], 3); k.sign(4, -25.4, 'Forbes Ave.'); k.vehicle([P(-44, -27.3), P(44, -27.3)], { color: 0x3f7fb5, len: 5, h: 2.4, w: 1.7, stripe: 0xf4f2ec, speed: 5 });
  k.box(-4, -38, 20, 9, 9, { color: 0xd9dde2, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.glass(-4, -32.8, 12, 1.4, 9); k.label('Tepper Quad', -4, 13.5, -38); k.lawn(13, -37, 8, 9); k.box(30, -38, 14, 7, 7, { color: C.brick, roof: 'hip', roofColor: C.slate, win: 'grid' }); k.sign(30, -33.4, 'Morewood Gardens');
  // computing and robotics on the west side, above the hollow where the freight trains run
  k.box(-27, -6, 10, 8, 9, { color: C.concrete, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.sign(-27, -1.2, 'Wean Hall'); k.box(-27, -19, 10, 7, 8, { color: 0xb9c2c8, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.sign(-27, -14.6, 'Newell-Simon Hall');
  rails(k, -36, -26, -36, 48); train(k, -36, -22, -36, 44, 4, 0x7a5a4a); bridge(k, -41, -28, -31, -28, 3.4, C.steel); k.sign(-33, 20, 'Panther Hollow');
  // up the avenue: the museums, and the tall Gothic tower of the university next door
  k.box(-43, -18, 8, 12, 7, { color: 0xcfc7b8, roof: 'flat', roofColor: C.stone, win: 'tall', plain: true }); portico(k, -43, -24.8, 6, 4, 5, { rot: Math.PI, color: 0xe4dccb, steps: 1, depth: 1.2 }); k.label('Carnegie Museums', -43, 11, -18);
  k.box(-42, -40, 9, 9, 6, { color: 0xcfc7b8, roof: 'flat', roofColor: C.stone, win: 'tall', plain: true }); steeple(k, -42, -40, 4.4, 18, { color: 0xcfc7b8, kind: 'crown', capColor: 0xcfc7b8 }); k.label('Cathedral of Learning', -42, 32, -40);
  // the east end of the lawn: the arts building facing the old hall down the length of it; the stadium
  k.box(34.5, 12, 7, 14, 8, { color: 0xd9c9a8, roof: 'hip', roofColor: 0x8a6a4a, win: 'tall', plain: true }); k.label('College of Fine Arts', 34.5, 13, 12);
  stadium(k, 39, -6, 6.5, 8.5, { h: 3.6, color: C.concrete }); k.sign(39, 3.8, 'Gesling Stadium'); k.box(41, 26, 8, 7, 6, { color: 0xd9c9a8, roof: 'hip', roofColor: 0x8a6a4a, win: 'tall' }); k.sign(41, 21.4, 'Margaret Morrison');
  // the park to the south: the glasshouse, and the hill for kites
  road(k, [P(-30, 32), P(48, 32)], 2.6); k.sign(6, 30.2, 'Frew St.');
  k.box(-20, 40, 12, 6, 4, { color: 0xcfe3e8, roof: 'gable', roofColor: 0xb8d3da, win: 'grid', plain: true }); dome(k, -20, 40, 3, 4.4, { color: 0xcfe3e8 }); k.label('Phipps Conservatory', -20, 11, 40);
  hill(k, 10, 41, 12, 5.5, 2.4); kite(k, 26, 40); k.sign(10, 35.2, 'Flagstaff Hill'); k.label('Schenley Park', 32, 6, 44);
  k.grove(-4, 44.4, 10, 5, 5); k.grove(34, 42, 14, 8, 7, ['round', 'cone']); k.grove(-29, 40, 4, 12, 4); k.grove(-44, 6, 6, 22, 6, ['round', 'cone']); k.grove(-44, 36, 8, 20, 7); k.grove(40, -22, 12, 6, 4); k.grove(-14, -24, 10, 3, 3);
  k.path([P(19.6, -26.4), P(19.6, 1), P(12, 7)], 1.6); k.path([P(14.4, 18), P(14.4, 30.8)], 1.5);
  life(k, [[P(19.6, -25.6), P(19.6, 1), P(12, 7), P(19.6, 1)], [P(-30, -25.4), P(44, -25.4)], [P(14.4, 18.4), P(14.4, 30.4)], [P(20, 36), P(40, 37), P(30, 45.6)], [P(4, 14), P(2, 8), P(1, 3), P(2, 8)], [P(-14, 13), P(28, 13)], [P(-16, 4), P(-4, 5), P(14, 5), P(-4, 5)]], { tour: [8, 8], drone: true });
}

export function berlin(k) {
  k.ground();
  // a tenement courtyard in the north of the city, with a horse and a small crowd
  const T = [0xd9cdb6, 0xc9bca0, 0xe4dccb];
  k.box(-14, -38, 20, 5, 12, { color: T[0], roof: 'gable', roofColor: C.red, win: 'grid' }); k.box(-23, -28, 4.6, 16, 12, { color: T[1], roof: 'gable', roofColor: C.red, win: 'grid' }); k.box(-5, -28, 4.6, 16, 12, { color: T[2], roof: 'gable', roofColor: C.red, win: 'grid' });
  k.plaza(-14, -27, 13, 15, 0xb8ad98);
  const { legs } = horse(k, -14, -28); let tapping = true;
  k.anim.push((t) => { legs[0].rotation.x = tapping ? Math.max(0, Math.sin(t * 5)) * -0.7 : 0; });
  k.tapHorse = (v) => { tapping = v; };
  const q = k.figure(0x3a4250, 1); q.position.set(-14, 0, -24.6); q.rotation.y = Math.PI; k.g.add(q);
  for (let i = 0; i < 5; i++) { const f = k.figure(k.r.pick([0x6b6f7a, 0x8a6a4a, 0x4f6a5c]), i < 2 ? 0.6 : 0.95); f.position.set(-18 + i * 1.8, 0, -22.4 + (i % 2) * 0.6); f.rotation.y = Math.PI; k.g.add(f); }
  k.label('The courtyard', -14, 15, -34); egg(k, 'hans', -11.4, -25.2, 'post', 0xefe6d2);
  // the streets round it: more tenements, and the church with the tall spire on its square
  k.path([P(-32, -13), P(6, -13)], 2.6, 0x9a968f); k.sign(-20, -11.2, 'Griebenowstraße');
  terrace(k, -44, -45.4, 0, -45.4, { n: 8, h: 8, depth: 4.6, colors: T, roof: 'gable', roofColor: C.red }); terrace(k, 6, -42, 30, -42, { n: 5, h: 7.5, depth: 6, colors: T, roof: 'gable', roofColor: C.red });
  k.box(9, -30, 10, 8, 10, { color: T[0], roof: 'hip', roofColor: C.red }); k.box(22, -22, 8, 10, 9, { color: T[1], roof: 'hip', roofColor: C.slate });
  k.box(-37, -36, 5, 8, 7, { color: 0xc98a5a, roof: 'gable', roofColor: C.slate, win: 'tall', plain: true }); steeple(k, -37, -30.4, 2.8, 13, { color: 0xc98a5a, kind: 'spire', capColor: 0x6fa59a }); k.label('Zionskirche', -37, 24, -30.4); k.grove(-37, -22, 8, 6, 4);
  // the river, bending round the island of museums and away to the west past the parliament
  k.river([P(33, 48), P(33, 20), P(33.4, 2), P(30, -5), P(16, -8), P(-10, -8), P(-30, -9), P(-48, -10)], 3); k.river([P(46.4, 48), P(46.4, 2), P(42, -4), P(31, -6)], 2.4); k.boat(-6, -8, 18, 0.4, 0.1); k.sign(12, -4.6, 'the Spree');
  road(k, [P(-9, 48), P(-9, -13)], 2.6, 0x8a8478); bridge(k, -9, -10.8, -9, -5.2, 3, C.steel); k.sign(-6.6, 28, 'Friedrichstraße');
  // the avenue of lindens, from the gate with the horses on top to the bridge on to the island
  k.path([P(-31.5, 14), P(31.4, 14)], 5, 0xb8b2a6); k.row(-30, 14, 28, 14, 15); k.sign(-22, 10.6, 'Unter den Linden');
  k.vehicle([P(-30, 12.6), P(30, 12.6)], { color: 0xe2b23a, len: 5.4, h: 2.6, w: 1.7, stripe: 0x3a4250, speed: 4.2 });
  k.plaza(-35, 14, 7, 10, 0xc9c2b4); for (let i = 0; i < 6; i++) k.box(-40, 9.5 + i * 1.8, 2, 0.9, 6, { color: 0xd9cdb0, roof: 'none', win: 'none', solid: false }); k.box(-40, 14, 2.4, 10.4, 1.4, { color: 0xd9cdb0, roof: 'none', win: 'none', y: 6, solid: false }); block(k, -40, 7.4, 14, 0.8, 1, 2.4, 0x6f7f72);
  k.label('Brandenburg Gate', -40, 11.5, 14); k.path([P(-48, 14), P(-41.2, 14)], 4, 0xb8b2a6); k.grove(-45, 26, 5, 16, 8); k.grove(-45.4, 6, 4, 6, 3); k.sign(-45, 17.6, 'Tiergarten');
  k.box(-35, 6.4, 7, 4.6, 6, { color: T[2], roof: 'flat', roofColor: C.stone, win: 'tall' }); k.box(-35, 21.6, 7, 4.6, 6, { color: T[0], roof: 'flat', roofColor: C.stone, win: 'tall' });
  k.box(-38, -1, 12, 7, 7, { color: 0xb9ad98, roof: 'flat', roofColor: C.stone, win: 'tall', plain: true }); dome(k, -38, -1, 2.8, 7, { color: 0xcfe3e8, lantern: false }); for (const sx of [-1, 1]) for (const sz of [-1, 1]) block(k, -38 + sx * 5.6, 0, -1 + sz * 3.1, 1.6, 8.6, 1.6, 0xb9ad98); portico(k, -45, -1, 5, 6, 5.4, { rot: -Math.PI / 2, color: 0xcfc7b8, steps: 2, depth: 1.4 }); k.label('Reichstag', -38, 13, -1);
  terrace(k, -29, 8, -11.6, 8, { n: 4, h: 7, depth: 6, colors: T }); terrace(k, -29, 20.6, -11.6, 20.6, { n: 4, h: 7, depth: 6, colors: [T[1], T[2], T[0]] });
  // the university behind its forecourt, the brothers on their plinths at the gate; the guardhouse; the old arsenal
  k.box(4, 3, 22, 5.6, 8, { color: 0xe4dccb, roof: 'flat', roofColor: C.stone, win: 'tall' }); k.box(-5.4, 8.2, 4, 4.8, 8, { color: 0xe4dccb, roof: 'flat', roofColor: C.stone, win: 'tall' }); k.box(13.4, 8.2, 4, 4.8, 8, { color: 0xe4dccb, roof: 'flat', roofColor: C.stone, win: 'tall' });
  statue(k, 0.6, 10.8, 1.8); statue(k, 7.4, 10.8, 1.8); k.label('Humboldt University', 4, 13, 3); statue(k, 5.3, 14, 2.6, 0x5f6f62); k.sign(9.6, 11.4, 'Frederick the Great');
  k.box(19.6, 7.6, 4.4, 4.4, 4.4, { color: 0xd9d2c2, roof: 'flat', roofColor: C.stone, win: 'none' }); colonnade(k, 19.6, 10.4, 4.2, 6, 3.6, { color: 0xe4dccb, depth: 1 }); k.sign(22.6, 11, 'Neue Wache');
  k.box(26.6, 6.2, 7, 7.6, 6.5, { color: 0xe6b8a8, roof: 'flat', roofColor: C.stone, win: 'tall', plain: true }); k.sign(27.6, 11, 'Zeughaus');
  // across the avenue: the square with the opera house, the round cathedral, the old library; further on, the square of the two domed churches
  k.plaza(6, 22, 9, 9, 0xc9c2b4); k.sign(6, 27.4, 'Bebelplatz'); k.box(14.6, 23.6, 6.4, 9, 7, { color: 0xe8c9c0, roof: 'gable', roofColor: C.slate, win: 'tall', plain: true }); portico(k, 14.6, 18.4, 5, 6, 5, { rot: Math.PI, color: 0xe4dccb, steps: 2, depth: 1.2 }); k.sign(19, 18.4, 'State Opera');
  k.cyl(12, 31.8, 2.8, 4.4, { color: 0xd9d2c2, roof: 'dome', roofColor: 0x6fa59a, seg: 16 }); k.sign(16, 31.8, 'St. Hedwig’s'); k.box(-1.6, 22, 5, 9, 6.5, { color: 0xe4dccb, roof: 'flat', roofColor: C.stone, win: 'tall', plain: true });
  k.plaza(1.4, 38.6, 8.6, 16, 0xc9c2b4); k.box(-3.8, 38.6, 4.4, 6, 6.5, { color: 0xe4dccb, roof: 'gable', roofColor: C.slate, win: 'tall', plain: true }); portico(k, -0.8, 38.6, 4.6, 6, 5, { rot: Math.PI / 2, color: 0xe4dccb, steps: 3, depth: 1.2 });
  for (const z of [32.4, 44.8]) { k.box(-1.6, z, 4, 3.4, 5, { color: 0xe4dccb, roof: 'gable', roofColor: C.slate, win: 'tall', plain: true }); steeple(k, 1.6, z, 2.4, 7, { color: 0xe4dccb, kind: 'dome', capColor: 0x6fa59a }); } k.label('Gendarmenmarkt', 1, 15, 38.6);
  terrace(k, 18, 40, 30, 40, { n: 3, h: 7, depth: 6, colors: T }); k.box(-40, 40, 6, 6, 14, { color: 0xb8c2cc, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.box(-32.6, 42, 5, 5, 10, { color: 0xc9d6de, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.box(-26, 40, 5, 6, 7, { color: C.brick, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.label('Potsdamer Platz', -37, 18.5, 40);
  // the island: the pleasure garden with the museum behind its long colonnade, the cathedral, the rebuilt palace
  bridge(k, 31.2, 14, 35, 14, 5, C.stone); k.path([P(35, 14), P(44.8, 14)], 4, 0xb8b2a6); bridge(k, 44.6, 14, 48, 14, 4, C.stone); k.sign(33.2, 17.8, 'Schlossbrücke');
  k.lawn(38.4, 7.6, 6, 7); fountain(k, 38.4, 7.6, 1.2); k.box(39, -0.6, 8.4, 4.4, 5.6, { color: 0xd9d2c2, roof: 'flat', roofColor: C.stone, win: 'none' }); colonnade(k, 39, 2.2, 8, 9, 4.8, { color: 0xe4dccb, depth: 1, pediment: false }); dome(k, 39, -0.6, 1.6, 5.6, { color: 0x8fa39a, lantern: false, squash: 0.5 }); k.label('Museum Island', 39, 10.5, -0.6);
  k.box(42.9, 8, 3.4, 7, 7, { color: 0xb9ad98, roof: 'flat', roofColor: C.stone, win: 'tall', plain: true }); dome(k, 42.9, 8, 2.1, 7, { color: 0x6fa59a, drum: 1.6, drumColor: 0xb9ad98 }); for (const z of [5, 11]) steeple(k, 41.5, z, 1, 7.4, { color: 0xb9ad98, kind: 'dome', capColor: 0x6fa59a }); k.sign(42.6, 12.2, 'Berliner Dom');
  k.box(40, 21.6, 9, 9, 7, { color: 0xe0d6bf, roof: 'flat', roofColor: C.stone, win: 'tall', plain: true }); dome(k, 36.8, 21.6, 1.5, 7, { color: 0x6fa59a, drum: 0.8, drumColor: 0xe0d6bf }); k.sign(40, 27, 'Humboldt Forum');
  // beyond the river to the north-east: the square with the world clock, the red town hall, and the television tower over everything
  needle(k, 40, -26, 28, 'tv'); k.label('Fernsehturm', 40, 37, -26); k.plaza(39, -18.6, 12, 7, 0xc9c2b4); k.cyl(35.6, -18.6, 0.22, 2.2, { color: 0x6b6f7a, roof: 'none', seg: 6, solid: false }); k.disc(35.6, -18.6, 1.1, 0x3f5f8f, 2.3); k.sign(35.6, -16.6, 'World Clock'); k.sign(43, -15.6, 'Alexanderplatz');
  k.box(43.4, -11, 7, 4.4, 6, { color: 0xa5503a, roof: 'flat', roofColor: C.dark, win: 'tall', plain: true }); steeple(k, 43.4, -11, 2, 10.5, { color: 0xa5503a, kind: 'flat', capColor: 0xa5503a, clock: true }); k.sign(38.4, -11, 'Rotes Rathaus');
  k.grove(14, -18, 8, 6, 4); k.grove(30, -34, 6, 6, 3); k.grove(-30, -22, 4, 6, 2); k.grove(22, 30, 10, 6, 4); k.grove(-20, 34, 12, 12, 6); k.grove(40, 38, 8, 14, 5);
  k.door = { x: -9.4, z: -17.6 }; k.spawn = { x: 0, z: -12 };
  k.path([P(0, -12), P(-8, -16), P(-12, -20)], 1.8); k.path([P(35.6, 11.6), P(35.6, 3.8), P(41.4, 3.8)], 1.3);
  life(k, [[P(0, -12), P(-8, -16), P(-12, -19), P(-8, -16)], [P(-30, 17.1), P(30, 17.1)], [P(-30, 11.2), P(-11, 11.2)], [P(0, -12.6), P(-9, -12.6), P(-9, 10), P(-9, -12.6)], [P(35.2, 12), P(41.6, 12), P(41.6, 3.6), P(35.2, 3.6)], [P(35, -19), P(44, -18), P(40, -21)], [P(4, 33), P(4, 44.6)], [P(-30, -13), P(4, -13)]], { tour: [4, 8.4], bikes: 3 });
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
  for (let i = -5; i < 17; i++) { if ((i + 6) % 6 === 5) continue; k.box(-24 + i * 4.2, 22, 4, 6, 7, { color: [C.brick, 0x9a5340, 0xb86b4f, 0xa85a48][(i + 8) % 4], roof: 'flat', roofColor: C.dark, win: 'grid' }); const st = k.mesh(new THREE.BoxGeometry(0.8, 0.2, 3.4), C.dark); st.position.set(-24 + i * 4.2, 1.6, 17.6); st.rotation.x = 0.7; }
  k.path([P(-48, 15), P(48, 15)], 3, 0x9a968f);
  // raccoons on the path up the mountain
  egg(k, 'raccoons', 1.6, -7.6, 'animal', 0x6b6f7a);
  k.grove(-4, 6, 10, 6, 6, ['round', 'cone']); k.row(-44, 12.4, -4, 12.4, 8); k.row(15, 12.4, 44, 12.4, 6);
  k.door = { x: 10, z: 10 }; k.spawn = { x: 0, z: 13 };
  k.path([P(0, 13), P(6, 11), P(10, 10)], 1.8); k.path([P(0, 13), P(0, 0), P(-6, -6)], 1.4);
  k.sign(20, 13.4, 'rue Saint-Urbain'); k.label('Mount Royal', 4, 16.5, -24);
  // the mountain's second summit, and the great domed church on its slope with the long flight of steps
  hill(k, -38, -22, 14, 12, 7, k.snowCaps() ? 0xe6ecef : 0x8f9a6a); for (let i = 0; i < 14; i++) { const tx = k.r.range(-10, 10), tz = k.r.range(-8, 4); k.tree(-38 + tx, -22 + tz, 'cone', k.r.range(0.7, 1.1), { y: Math.max(0.5, 6.6 * Math.sqrt(Math.max(0, 1 - (tx / 14) ** 2 - (tz / 12) ** 2))) }); }
  k.box(-40, -7, 9, 7, 8, { color: 0xd9d2c2, roof: 'flat', roofColor: C.stone, win: 'tall', plain: true, y: 2 }); dome(k, -40, -7, 3.6, 10, { color: 0x6fa59a, drum: 2, drumColor: 0xd9d2c2 }); stairs(k, -40, 0.4, 5, 7, 8, 0, C.stone); k.label('Saint Joseph’s Oratory', -40, 21, -7); k.path([P(-40, 13.5), P(-40, 4.4)], 1.6);
  // more of the old garment district: brick lofts with a water tank on the roof
  k.box(35, 2, 10, 9, 8, { color: C.brick, roof: 'flat', roofColor: C.dark, win: 'grid' }); k.cyl(37, 3, 1, 1.6, { color: 0x8a6a4a, roof: 'cone', roofColor: 0x6b5a4a, y: 9.4, solid: false, seg: 10 }); for (const [dx, dz] of [[-0.6, -0.6], [0.6, -0.6], [-0.6, 0.6], [0.6, 0.6]]) block(k, 37 + dx, 8, 3 + dz, 0.12, 1.4, 0.12, 0x6b5a4a); k.sign(35, 7.8, 'Mile-Ex');
  terrace(k, 31, -26, 31, -8, { n: 5, h: 6, depth: 5, colors: [C.brick, 0x9a5340, 0xb86b4f, 0xa85a48] }); k.sign(34.6, -17, 'Le Plateau');
  // behind the row houses: the lane, the railway, the market halls, the park
  for (const x of [-28.2, -3, 22.2]) k.path([P(x, 15), P(x, 29.4)], 2.4, 0x9a968f); k.grove(0, 27.4, 84, 1.6, 12); rails(k, -48, 31, 48, 31); train(k, -44, 31, 44, 31, 4, 0x8a4a3a);
  for (const [z, c] of [[37.6, 0xb5483f], [42.2, 0x4f7d5c]]) k.box(18, z, 18, 3, 3, { color: C.white, roof: 'gable', roofColor: c, win: 'none' }); for (let i = 0; i < 6; i++) block(k, 10.5 + i * 3, 0, 39.9, 2, 1, 1, [0xe07b22, 0xd24d3e, 0x4f9a54, 0xe2b23a][i % 4]); k.label('Jean-Talon Market', 18, 7.5, 40);
  k.lawn(-22, 40, 20, 11); k.water(-26, 41, 6, 4, { round: true }); k.sign(-22, 34.2, 'Parc Jarry'); k.grove(-14, 40, 8, 9, 5); k.grove(-34, 40, 4, 9, 3); k.grove(38, 40, 10, 10, 5);
  // far to the east, the stadium with the leaning tower
  stadium(k, 40, -35, 7, 5.5, { h: 3.6, color: 0xd9d2c2, pitch: false }); { const rf = k.mesh(new THREE.CylinderGeometry(1, 1, 0.3, 24), 0xe9e4d6); rf.scale.set(6.6, 1, 5.1); rf.position.set(40, 3.7, -35); const tw = k.mesh(new THREE.BoxGeometry(2.2, 15, 2.4), 0xd9d2c2); tw.position.set(40, 6.6, -43.2); tw.rotation.x = 0.5; } k.label('Olympic Stadium', 40, 16, -39);
  life(k, [[P(8, 34.6), P(28, 34.6)], [P(-31, 34.8), P(-12.6, 34.8), P(-12.6, 45.4), P(-31, 45.4)], [P(-40, 13.4), P(-40, 4.6)], [P(-44, 13), P(44, 13)], [P(0, 13), P(0, 0), P(-5, -5), P(0, 0)], [P(4, 11), P(16, 11)]], { tour: [-6, 10], bikes: 2, dogs: 2 });
}

export function amsterdam(k) {
  k.ground();
  // canals with narrow gabled houses, bridges and bicycles
  k.water(0, 14, 96, 5); k.water(-14, 5, 5, 86); k.water(0, 31, 96, 4.4);
  bridge(k, 6, 10.8, 6, 17.2, 2.4, C.brick); bridge(k, -17.2, -8, -10.8, -8, 2.4, C.brick); bridge(k, -17.2, 22, -10.8, 22, 2.4, C.brick);
  const H = [0x8a4a3a, 0xb86b4f, 0x6b3f36, 0xd9c9a8, 0x9a5340, 0x4a3a36, 0xc98a5a];
  for (let i = -12; i < 18; i++) { if (i > -5 && i < 0) continue; const x = -8.6 + i * 3.1, h = 8 + ((i + 12) * 7 % 3) * 1.4; k.box(x, 21.5, 3, 6, h, { color: H[(i + 14) % 7], roof: 'gable', roofColor: C.dark, win: 'tall' }); const g = k.mesh(new THREE.BoxGeometry(1.4, 1.2, 0.4), 0xf4f2ec); g.position.set(x, h + 0.9, 18.6); }
  for (let i = -5; i < 9; i++) { const z = -24 + i * 3.1, h = 8 + ((i + 6) * 5 % 3) * 1.3; k.box(-21.5, z, 6, 3, h, { color: H[(i + 10) % 7], roof: 'gable', roofColor: C.dark, win: 'tall' }); }
  const hb = k.mesh(new THREE.BoxGeometry(2, 1, 6), 0x2f6f5a); hb.position.set(-14, 0.5, 8); const hbr = k.mesh(new THREE.BoxGeometry(1.6, 0.7, 3), 0xefe6d2); hbr.position.set(-14, 1.3, 7.4);
  // a heron on the houseboat roof
  egg(k, 'heron', -14, 5.4, 'bird', 0x9aa3ab, 1.1);
  k.boat(8, 14, 16, 0.8, 0.12);
  // the Science Park: bright new buildings at the edge of town
  k.box(10, -14, 14, 9, 10, { color: 0xe9e4d6, roof: 'solar', win: 'bands' }); k.box(10, -8.6, 14, 1.4, 10, { color: 0xd24d3e, roof: 'none', win: 'none' }); k.glass(22, -6, 8, 12, 14);
  k.box(-2, -20, 8, 8, 7, { color: 0x3f7fb5, roof: 'green', win: 'bands' }); k.box(22, -22, 9, 7, 8, { color: 0xe2b23a, roof: 'flat', roofColor: C.dark, win: 'bands' });
  k.label('Science Park', 10, 15, -14); k.lawn(4, 0, 20, 10);
  for (let i = 0; i < 12; i++) { const b = k.mesh(new THREE.TorusGeometry(0.3, 0.04, 4, 10), C.dark); b.position.set(-8 + i * 0.8, 0.32, 10.6); b.castShadow = false; }
  k.grove(0, 5, 24, 4, 6); k.row(-10.4, -36, -10.4, 6, 13);
  k.door = { x: 10, z: -7.4 }; k.spawn = { x: 4, z: 9 };
  k.path([P(4, 9), P(6, 0), P(10, -7)], 1.8); k.path([P(-10, 10.6), P(44, 10.6)], 1.8, 0xb86b4f);
  // a third canal and another row of gables beyond it; the church tower with the crown
  for (let i = 0; i < 29; i++) { const x = -46.4 + i * 3.3, h = 6.4 + (i * 4 % 3) * 1.2; if (Math.abs(x + 34) < 5 || Math.abs(x + 14) < 3.4) continue; k.box(x, 38.8, 3.2, 6, h, { color: H[(i + 2) % 7], roof: 'gable', roofColor: C.dark, win: 'tall' }); const g = k.mesh(new THREE.BoxGeometry(1.4, 1.2, 0.4), 0xf4f2ec); g.position.set(x, h + 0.9, 35.9); }
  k.box(-34, 42.4, 6, 7, 7, { color: C.brick, roof: 'gable', roofColor: C.slate, win: 'tall', plain: true }); steeple(k, -34, 37.6, 2.6, 14, { color: C.brick, kind: 'crown', capColor: 0x3f7fb5, clock: true }); k.label('Westerkerk', -34, 26, 37.6);
  for (const x of [-30, 6, 30]) bridge(k, x, 28.2, x, 33.8, 2.4, C.brick); bridge(k, 30, 10.8, 30, 17.2, 2, C.white); for (const z of [11.4, 16.6]) for (const sx of [-1, 1]) { block(k, 30 + sx * 0.9, 0.5, z, 0.16, 3, 0.16, C.white); } for (const z of [11.4, 16.6]) block(k, 30, 3.4, z + (z < 14 ? 0.9 : -0.9), 2, 0.16, 2.6, C.white); k.sign(33, 10, 'Magere Brug'); k.boat(-20, 31, 20, 0.5, 0.1);
  // the big wooden windmill on the way out of town
  k.lawn(-32, 6, 12, 7); k.cyl(-32, 6, 2.3, 3.6, { color: C.brick, roof: 'none', seg: 8 }); k.cyl(-32, 6, 1.9, 7, { color: 0x5a4a3a, roof: 'cone', roofColor: 0x3a3a3a, y: 3.6, seg: 8, top: 0.55, solid: false });
  { const sails = new THREE.Group(); for (let i = 0; i < 4; i++) { const arm = new THREE.Group(), b = new THREE.Mesh(new THREE.BoxGeometry(0.6, 6, 0.08), k.mat(0xefe6d2)); b.position.y = 3.2; arm.add(b); arm.rotation.z = i * Math.PI / 2; sails.add(arm); } sails.position.set(-32, 9.8, 8); k.g.add(sails); k.anim.push((t) => { sails.rotation.z = t * 0.5; }); } k.label('De Gooyer', -32, 17, 6);
  // the main station on the harbour, and the line that runs out east to the Science Park's own stop
  rails(k, -48, -42, 48, -42); train(k, -44, -42, 44, -42, 4, 0xf2c230); k.water(-34, -46.6, 28, 2.8);
  k.box(-36, -37.4, 18, 4.4, 7, { color: 0xa5503a, roof: 'hip', roofColor: C.slate, win: 'tall', plain: true }); for (const sx of [-1, 1]) steeple(k, -36 + sx * 3.4, -35.6, 1.8, 10, { color: 0xa5503a, kind: 'pyramid', capColor: C.slate, clock: sx > 0 }); k.label('Centraal Station', -36, 16, -37.4);
  block(k, 6, 0, -39.9, 16, 0.4, 1.5, C.concrete); block(k, 6, 2.8, -39.9, 14, 0.16, 2, 0xd9dde2); for (const x of [0, 6, 12]) block(k, x, 0.4, -39.9, 0.18, 2.4, 0.18, 0x8a8f96); k.sign(15.4, -38.6, 'Station Science Park');
  // the rest of the Science Park: mathematics and computing, the physicists, the new timber building, the college, the dark data tower
  k.sign(10, -4.4, 'Faculty of Science'); k.sign(1, 4.6, 'Anna’s Tuin'); k.box(-4.6, -6, 5, 4, 3, { color: 0xe4dccb, roof: 'gable', roofColor: 0x8a6a4a, win: 'grid' }); k.sign(-4.6, -3, 'Polder');
  k.box(-3, -33, 9, 7, 7, { color: 0xcfcac0, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.cyl(1.2, -30, 2, 7, { color: 0xb8c2cc, roof: 'none', seg: 14 }); k.label('CWI', -3, 11, -33);
  k.box(12, -33, 10, 7, 6, { color: 0x4a4f8a, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.sign(12, -28.4, 'Nikhef'); k.box(26, -34, 10, 6, 6, { color: 0xd9d4c8, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.sign(26, -29.8, 'AMOLF');
  k.box(33, -19, 10, 8, 7, { color: 0xc9a67a, roof: 'solar', win: 'bands' }); k.glass(33, -14.4, 6, 1.2, 7); k.label('LAB42', 33, 11, -19);
  k.box(36, -5, 8, 8, 7, { color: 0x6b4a3e, roof: 'flat', roofColor: C.dark, win: 'grid' }); k.sign(36, -0.2, 'Amsterdam University College');
  k.box(40.4, -31, 4.6, 4.6, 15, { color: 0x2f3338, roof: 'flat', roofColor: C.dark, win: 'none' }); k.sign(40.4, -27.4, 'data tower');
  for (const [dx, c] of [[-2.8, 0xd24d3e], [0, 0xe2b23a], [2.8, 0x3f7fb5]]) k.box(38 + dx, 5, 2.6, 6, 6, { color: c, roof: 'flat', roofColor: C.dark, win: 'grid' }); k.sign(38, 1.2, 'student rooms');
  road(k, [P(46, -40.6), P(46, 48)], 3, 0x6f7278); for (const z of [14, 31]) bridge(k, 46, z - 3.2, 46, z + 3.2, 3.4, C.concrete); k.sign(43.6, -12, 'A10');
  k.path([P(6, 0), P(1.6, -8), P(2.5, -26), P(4, -38.6)], 1.1); k.path([P(-44, 26.6), P(44, 26.6)], 1.6, 0xb86b4f);
  k.grove(18, -27, 14, 2, 4); k.grove(-30, -8, 8, 16, 6); k.grove(-38, 6.4, 3, 5, 2); k.grove(-42, -22, 8, 16, 5); k.grove(28, 0, 6, 8, 3);
  life(k, [[P(6, 0), P(1.6, -8), P(2.5, -26), P(4, -38.4), P(2.5, -26), P(1.6, -8)], [P(-44, 26.6), P(44, 26.6)], [P(-44, 10.4), P(-18, 10.4)], [P(-9, 10.6), P(43, 10.6)], [P(4, 9), P(6, 0), P(10, -6.6), P(6, 0)], [P(-8.6, -35), P(-8.6, 6)]], { tour: [0, 2], bikes: 5, scooters: 0 });
}

export const PLACES_TWO = { unc, columbia, berkeley, santafe, cornell, ucsd, toronto, manchester, cmu, berlin, montreal, amsterdam };
