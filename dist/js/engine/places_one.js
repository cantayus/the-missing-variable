// Part I places: the universities of the fall.
import { C } from './kit.js';
import { rails, colonnade, hill, fountain, bridge, statue, stairs, hangar, plane, mountains, life, egg, train, THREE, block, dome, portico, cupola, steeple, quad, arcade, gothic, chapel, gate, needle, stadium, road, terrace } from './parts.js';

const P = (x, z) => [x, z];

export function yale(k) {
  k.ground();
  // the Beinecke on Hewitt Quadrangle: a marble box lifted on four piers above a sunken court
  k.plaza(-8, -6, 22, 16); k.patch(-8, 2.5, 8, 5, 0xbfc3c8, 0.035);
  for (const [x, z] of [[-14.5, -9.5], [-1.5, -9.5], [-14.5, -3.5], [-1.5, -3.5]]) k.box(x, z, 1.2, 1.2, 1.6, { color: C.stone, roof: 'none', win: 'none', solid: false });
  k.box(-8, -6.5, 14.5, 7.5, 6.5, { color: 0xeae6da, roof: 'flat', roofColor: C.stone, win: 'grid', y: 1.6 });
  for (const [x, z, s] of [[-9.5, 2.6, 0.9], [-7.6, 3.2, 0.7], [-6.4, 2.2, 0.8]]) { const m = k.mesh(s > 0.85 ? new THREE.BoxGeometry(1, 1, 1) : s > 0.75 ? new THREE.TorusGeometry(0.5, 0.14, 6, 14) : new THREE.ConeGeometry(0.6, 1, 4), 0xfaf8f2); m.position.set(x, 0.6, z); m.scale.setScalar(s); m.rotation.set(0.6, 0.5, 0); }
  k.label('Beinecke Library', -8, 10.5, -6.5);
  // Woolsey Hall and the Commons at the corner: a domed rotunda between two colonnaded halls
  k.cyl(9, -10, 3.8, 6.5, { color: C.lime, roof: 'none', seg: 16 }); dome(k, 9, -10, 3.9, 6.5, { color: 0x8fa39a, drumColor: C.lime });
  k.box(17, -10, 12, 6, 6.5, { color: C.lime, roof: 'hip', roofColor: C.slate, win: 'tall' }); k.box(9, -1.5, 6, 11, 6.5, { color: C.lime, roof: 'hip', roofColor: C.slate, win: 'tall' }); colonnade(k, 5.4, -1.5, 9, 6, 5, { color: C.lime, rot: -Math.PI / 2, pediment: false });
  k.label('Woolsey Hall', 11, 12.5, -10);
  // Grove Street, then Hillhouse Avenue running north to Science Hill: big houses under old trees
  road(k, [P(-48, -17), P(48, -17)], 3); road(k, [P(14, -17), P(14, -46)], 3, 0x8a8478);
  for (const [z, c, r] of [[-42, C.brick, 'hip'], [-34, C.lime, 'gable'], [-26, 0xd8c7a6, 'hip']]) { k.box(21.5, z, 7, 6.5, 5, { color: c, roof: r, roofColor: C.slate }); k.box(7, z + 1.5, 6, 5.5, 4.4, { color: c === C.brick ? C.lime : C.brick, roof: 'hip', roofColor: C.roof }); }
  k.row(11.4, -45, 11.4, -20, 7); k.row(16.6, -45, 16.6, -20, 7); k.sign(12, -19.2, 'Hillhouse Ave.');
  k.box(33, -40, 6.5, 6.5, 26, { color: 0x7d5c48, roof: 'flat', roofColor: C.dark, win: 'tall' }); k.box(33, -32, 14, 6, 5, { color: 0x7d5c48, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.label('Kline Tower', 33, 29.5, -40);
  // Payne Whitney Gymnasium, a Gothic tower over a hall big enough for it
  k.box(-36, -34, 16, 10, 8, { color: 0xb9ad98, roof: 'gable', roofColor: C.slate, win: 'tall' }); steeple(k, -36, -26.5, 5.5, 19, { color: 0xb9ad98, kind: 'flat' }); k.label('Payne Whitney Gym', -36, 23, -27);
  // Cross Campus: the lawn, Sterling Memorial Library at its west end, a college range along the south
  k.lawn(-12, 14, 22, 12);
  gothic(k, -32, 14, 9, 17, 10, { color: 0xb9ad98 }); k.box(-39.5, 14, 7, 9, 19, { color: 0xb9ad98, roof: 'hip', roofColor: C.slate, win: 'tall' }); k.label('Sterling Memorial Library', -34, 22.5, 14);
  gothic(k, -14, 24.5, 20, 4.5, 5.5, { color: 0xb9ad98 }); gothic(k, 5, 12, 4.5, 14, 5.5, { color: 0xb9ad98 });
  // the flock on the lawn: seen from above it is a dinosaur
  const dino = [[0.5, 3.2], [1.2, 3.4], [1.9, 3.6], [2.6, 3.8], [3.3, 4.3], [4, 4.7], [4.8, 4.9], [5.6, 4.8], [6.2, 5.2], [6.6, 5.8], [7, 6.3], [7.6, 6.6], [8.3, 6.6], [8.9, 6.3], [8.6, 5.9], [8, 5.7], [7.4, 5.6], [6.6, 4.6], [6.4, 3.9], [7, 4.2], [7.4, 4], [5.8, 3.3], [5, 3], [4.2, 3], [3.4, 3.2], [4.4, 2.3], [4.5, 1.6], [4.6, 0.9], [5.1, 0.8], [5.6, 2.4], [5.8, 1.7], [5.9, 1], [6.4, 0.9]];
  for (const [x, y] of dino) { const b = k.mesh(new THREE.IcosahedronGeometry(0.16, 0), 0x8f949c); b.position.set(-18.5 + x * 1.25, 0.14, 19 - y * 1.25); b.castShadow = false; }
  egg(k, 'datasaurus', -12, 14.5, 'bird', 0x8f949c);
  // Elm Street, then Old Campus: a quadrangle of brownstone halls, Phelps Gate on the side toward the Green
  road(k, [P(-48, 29), P(48, 29)], 3);
  quad(k, -10, 40, 30, 15, { t: 3.6, h: 6, color: 0x9a7460, roofColor: C.slate, win: 'tall', open: 'e', gap: 3 }); steeple(k, 5, 40, 3.4, 9, { color: 0x9a7460, kind: 'flat' });
  k.box(-14, 40, 9, 3.2, 4.2, { color: C.brick, roof: 'gable', roofColor: C.slate }); k.label('Old Campus', -10, 10, 40); k.sign(-14, 42.6, 'Connecticut Hall, 1752');
  // Harkness Tower across High Street
  road(k, [P(-27.5, 29), P(-27.5, 48)], 2.6, 0x8a8478);
  steeple(k, -34, 36, 5, 25, { color: 0xb9ad98, kind: 'crown', capColor: 0xb9ad98, clock: true }); gothic(k, -40, 41, 8, 11, 6, { color: 0xb9ad98 }); gothic(k, -33, 44.5, 6, 4.5, 6, { color: 0xb9ad98, pin: false }); k.label('Harkness Tower', -34, 34, 36);
  // College Street and the New Haven Green with its three churches
  road(k, [P(9.5, 29), P(9.5, 48)], 3); k.lawn(29, 39.5, 32, 15);
  for (const [z, c, kind] of [[34, C.brick, 'spire'], [39.5, C.brick, 'spire'], [45, 0x8a7868, 'flat']]) { k.box(22, z, 7, 3.6, 4.4, { color: c, roof: 'gable', roofColor: C.slate, win: 'tall', plain: true }); steeple(k, 17.5, z, 2.2, 7.5, { color: kind === 'flat' ? c : C.white, kind, capColor: C.white, trim: C.white }); }
  k.label('New Haven Green', 32, 6, 40); k.grove(34, 39, 18, 13, 10);
  k.door = { x: -8, z: -1.6 }; k.spawn = { x: 0, z: 26.6 };
  k.path([P(0, 27), P(0, 8), P(-8, 0)], 1.8); k.path([P(0, 8), P(1, 4.5), P(4, -17)], 1.6); k.path([P(-8, 0), P(-22, -8), P(-30, -17)], 1.6); k.path([P(0, 27), P(-27.5, 27)], 1.6); k.path([P(7, 40), P(-6, 40)], 1.6);
  k.grove(-24, -8, 8, 8, 5); k.grove(-42, -6, 8, 14, 7); k.grove(38, 4, 14, 26, 12); k.grove(-42, 26, 8, 4, 3); k.grove(-12, 34.6, 16, 1, 4); k.row(-46, -19.5, 4, -19.5, 9); k.grove(40, -12, 10, 6, 5);
  life(k, [[P(0, 26), P(0, 8), P(-8, 2), P(-20, -7), P(-8, 2), P(0, 8)], [P(14, -19), P(14, -44)], [P(-22, 8), P(-4, 9), P(1, 6), P(-4, 9)], [P(-26, 27), P(8, 27), P(9.5, 46), P(8, 27)], [P(6, 40), P(-4, 40), P(-4, 36), P(-20, 36), P(-4, 36)]], { tour: [-3, 4], mower: [-12, 14, 16, 8] });
}

export function princeton(k) {
  k.ground();
  // Nassau Street and the front campus: the gate, Nassau Hall with its cupola
  road(k, [P(-48, -45), P(48, -45)], 3); k.sign(-10, -43, 'Nassau St.');
  gate(k, -28, -42.4, 5, 4.4, { rot: Math.PI, color: C.stone }); k.lawn(-28, -39.4, 22, 4);
  k.box(-28, -34, 22, 6, 6.5, { color: 0xb59a78, roof: 'hip', roofColor: C.slate, win: 'grid', plain: true }); k.box(-28, -36.6, 6, 2, 7.5, { color: 0xb59a78, roof: 'gable', roofColor: C.slate, win: 'tall', plain: true, solid: false }); cupola(k, -28, 9, -34, 1.2, { capColor: 0x6fa59a });
  k.label('Nassau Hall', -28, 15, -34);
  // Cannon Green behind it, with the twin marble temples of Whig and Clio at the far end
  k.lawn(-28, -24, 16, 10); { const c = k.mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.9, 8), 0x2a2e36); c.position.set(-28, 0.35, -24); }
  for (const x of [-33.5, -22.5]) { k.box(x, -14, 6, 7, 5.5, { color: C.white, roof: 'gable', roofColor: 0xd9d4c8, win: 'none', plain: true }); colonnade(k, x, -18, 5.4, 6, 4.6, { color: C.white, rot: Math.PI, depth: 1.2 }); }
  k.label('Whig and Clio', -28, 10, -14);
  k.box(-40, -24, 5, 12, 6, { color: 0xb59a78, roof: 'hip', roofColor: C.slate, plain: true }); k.sign(-36.8, -24, 'West College');
  // east of Nassau Hall: East Pyne, Firestone Library and the University Chapel
  quad(k, -10, -33, 12, 11, { t: 3, h: 6.5, color: 0xa08a70, roofColor: C.slate, win: 'tall', open: 'w', gap: 3, lawn: false }); k.sign(-10, -26.6, 'East Pyne');
  gothic(k, 8, -38, 16, 8, 7, { color: 0xb5ab97 }); steeple(k, 8, -32.8, 4, 12, { color: 0xb5ab97, kind: 'flat' }); k.label('Firestone Library', 8, 16, -37);
  chapel(k, 12, -25, 20, 7, 11, { color: 0xb5ab97 }); k.label('University Chapel', 12, 17, -25);
  // west: Alexander Hall, round and Romanesque, and Blair Arch above its wide steps
  k.cyl(-42, -36, 4.6, 6, { color: 0xb08a6a, roof: 'cone', roofColor: 0x8a5a48, seg: 14, roofH: 3.4 }); for (const [a, b] of [[-3.6, -3.6], [3.6, -3.6], [-3.6, 3.6], [3.6, 3.6]]) k.cyl(-42 + a, -36 + b, 1, 8, { color: 0xb08a6a, roof: 'cone', roofColor: 0x8a5a48, seg: 8, roofH: 2, solid: false }); k.label('Alexander Hall', -42, 12, -36);
  gothic(k, -42, -6, 5, 18, 6.5, { color: 0xb5ab97 }); for (const z of [-8, -4]) steeple(k, -42, z, 2.6, 10.5, { color: 0xb5ab97, kind: 'flat' }); k.arch(-42, -6, 3.6, 5, { color: 0xb5ab97, rot: Math.PI / 2 }); stairs(k, -37.4, -6, 6, 3.6, 5, -Math.PI / 2, C.stone); k.label('Blair Arch', -42, 14, -6);
  // south-east of the old campus: Fine Hall, a tall brown tower over the mathematics library
  k.box(-12, -10, 7, 7, 24, { color: 0x8a6f5a, roof: 'flat', roofColor: C.dark, win: 'tall' });
  k.box(-12, -2.5, 15, 6, 4.5, { color: 0x8a6f5a, roof: 'flat', roofColor: C.dark, win: 'bands' });
  k.label('Fine Hall', -12, 27.5, -10);
  // the Lewis Library: crumpled steel and brick
  for (const [x, z, w, d, h, r, c] of [[10, -10, 9, 7, 9, 0.25, 0xb8c2cc], [16, -5, 6, 8, 12, -0.3, C.brick], [7, -3, 7, 5, 6, -0.12, 0xd9dde2], [14, -14, 6, 5, 15, 0.5, 0xb8c2cc], [20, -12, 5, 6, 7, 0.1, C.brickDark]]) k.box(x, z, w, d, h, { color: c, roof: 'none', win: c === C.brick || c === C.brickDark ? 'grid' : 'none', rot: r });
  k.label('Lewis Library', 13, 17.5, -10);
  // collegiate Gothic and an arch on the walk south
  k.box(-2, 12, 16, 5, 6, { color: 0xb5ab97, roof: 'gable', roofColor: C.slate, win: 'tall' }); k.tower(-11.5, 12, 3.4, 12, { color: 0xb5ab97, cap: 'belfry', capColor: C.slate });
  k.arch(8.5, 12, 4, 5.5, { color: 0xb5ab97 });
  k.box(-24, 6, 5, 16, 6, { color: 0xb5ab97, roof: 'gable', roofColor: C.slate, win: 'tall' }); k.sign(-20.6, 6, 'McCosh Hall');
  k.lawn(2, 2, 18, 9); k.row(-6, 6.5, 12, 6.5, 6);
  egg(k, 'squirrel', 4.5, 2.5, 'animal', 0x26262a);
  // the stadium to the east, and Lake Carnegie along the south with a crew out on it
  stadium(k, 32, 14, 12, 9, { h: 4.5, color: 0xcfcac0 }); k.label('Princeton Stadium', 32, 9, 14);
  k.water(0, 43.5, 96, 9); k.boat(-10, 43, 14, 1.5, 0.35); k.boat(20, 44.5, 10, 1.2, 0.3); k.box(-30, 36.6, 9, 4, 3.4, { color: C.wood, roof: 'gable', roofColor: C.slate, win: 'none' }); k.sign(-24, 37, 'Boathouse'); k.label('Lake Carnegie', 8, 4, 44);
  quad(k, -32, 24, 16, 13, { t: 3.4, h: 6, color: 0xb5ab97, roofColor: C.slate, win: 'tall', open: 'e', gap: 3 }); k.sign(-22.6, 24, 'Whitman College');
  k.door = { x: -12, z: 1.2 }; k.spawn = { x: 2, z: 23 };
  k.path([P(2, 23), P(8.5, 12), P(4, 4), P(-10, 3)], 1.8); k.path([P(4, 4), P(12, -2)], 1.6); k.path([P(2, 23), P(2, 37), P(-24, 37)], 1.6); k.path([P(4, 4), P(-1, -16), P(-19, -19), P(-28, -19)], 1.6); k.path([P(-28, -19), P(-28, -30.6)], 1.6); k.path([P(-19, -19), P(-34, -6), P(-37.4, -6)], 1.5); k.path([P(-1, -16), P(2, -21)], 1.5);
  k.grove(-22, 14, 8, 4, 3); k.grove(22, 30, 12, 8, 7); k.grove(-12, 32, 14, 8, 6); k.grove(36, -32, 14, 20, 12); k.grove(-18, -42, 12, 2, 4); k.grove(38, -6, 10, 8, 5); k.row(-46, -47.4, 46, -47.4, 14); k.grove(30, -44, 20, 2, 5); k.grove(-34, 4, 6, 8, 4);
  life(k, [[P(2, 22), P(8.5, 12), P(4, 4), P(-10, 3), P(4, 4), P(8.5, 12)], [P(-20, 20), P(-6, 18), P(18, 20), P(-6, 18)], [P(4, 4), P(12, -2), P(4, 4), P(-1, -16), P(-19, -19), P(-28, -20), P(-19, -19), P(-1, -16)], [P(2, 24), P(2, 37), P(-22, 37), P(2, 37)], [P(-44, -43), P(44, -43)]], { tour: [0, 16] });
}

export function harvard(k) {
  k.ground();
  // north of the Yard: the Science Center, concrete terraces stepping down like a staircase
  for (let i = 0; i < 5; i++) k.box(-6 + i * 0.2, -16 + i * 3.4, 26 - i * 2, 3.4, 14 - i * 2.6, { color: 0xcfcac0, roof: 'flat', roofColor: 0x9a968c, win: 'bands' });
  k.box(-22, -12, 7, 12, 9, { color: 0xcfcac0, roof: 'flat', roofColor: 0x9a968c, win: 'bands' });
  k.label('Science Center', -6, 17, -15);
  k.plaza(-4, 6, 30, 10, 0xd6d0c4);
  for (const [x, c] of [[-12, 0xd24d3e], [-7, 0xe2b23a], [4, 0x3f7fb5]]) k.box(x, 7.5, 3, 2, 2.2, { color: c, roof: 'flat', roofColor: C.white, win: 'none' });
  // Memorial Hall: brick Gothic with a tall tower and a patterned roof, Sanders Theatre rounding off its east end
  k.box(24, -8, 20, 9, 9, { color: C.brick, roof: 'gable', roofColor: 0x7d5a6a, win: 'tall' });
  steeple(k, 24, -8, 6, 19, { color: C.brick, kind: 'pyramid', capColor: 0x7d5a6a, trim: C.brick }); k.cyl(36, -8, 5, 8, { color: C.brick, roof: 'cone', roofColor: 0x7d5a6a, seg: 12, roofH: 4 });
  k.label('Memorial Hall', 24, 30, -8);
  // further north: the Law School's long colonnade and the brick museums on Oxford Street
  k.box(-28, -38, 26, 6, 7, { color: C.lime, roof: 'flat', roofColor: C.stone, win: 'tall' }); colonnade(k, -28, -34.4, 20, 12, 6, { color: C.lime, pediment: false }); k.label('Langdell Hall', -28, 11, -38);
  k.box(22, -38, 22, 6, 8, { color: C.brickDark, roof: 'hip', roofColor: C.slate, win: 'grid' }); k.box(12.5, -32, 5, 8, 8, { color: C.brickDark, roof: 'hip', roofColor: C.slate }); k.box(31.5, -32, 5, 8, 8, { color: C.brickDark, roof: 'hip', roofColor: C.slate }); k.label('Museum of Natural History', 22, 12.5, -38);
  road(k, [P(6, -48), P(6, -22), P(12, -19), P(48, -19)], 3); k.sign(8.5, -27, 'Oxford St.');
  // the fence along the north of the Yard, with its gates
  k.arch(-20, 16, 5, 6, { color: C.brick }); k.arch(2.8, 16, 5, 6, { color: C.brick });
  for (const [x, w] of [[-35.5, 17], [-13, 8], [-4.7, 8.6], [22.6, 34]]) k.box(x, 16, w, 0.8, 2.2, { color: C.brick, roof: 'none', win: 'none' });
  // the Old Yard: Johnston Gate on the west, the oldest halls either side of it, and the statue everyone photographs in front of University Hall
  road(k, [P(-46, -48), P(-46, 48)], 3); k.sign(-44, 38, 'Massachusetts Ave.');
  gate(k, -43.4, 27, 5, 4.6, { rot: -Math.PI / 2 }); for (const [z, d] of [[20, 8], [38, 16]]) k.box(-43.4, z, 0.8, d, 2.2, { color: C.brick, roof: 'none', win: 'none' });
  k.box(-36, 21.5, 11, 4.6, 6, { color: 0x9c4a3a, roof: 'gable', roofColor: C.slate, plain: true }); cupola(k, -36, 8, 21.5, 0.9); k.box(-36, 32.5, 11, 4.6, 6, { color: 0x9c4a3a, roof: 'gable', roofColor: C.slate, plain: true });
  k.sign(-36, 24.6, 'Harvard Hall'); k.sign(-36, 29.4, 'Massachusetts Hall, 1720'); k.label('Johnston Gate', -43.4, 8, 27);
  k.box(-14, 26, 6, 15, 6.5, { color: 0xe6e3da, roof: 'hip', roofColor: C.slate, win: 'tall', plain: true }); k.label('University Hall', -14, 11, 26);
  statue(k, -19.4, 26, 2, 0x6f7f72); egg(k, 'shoe', -18.6, 27, 'box', 0xd9a441);
  for (const x of [-27, -11]) k.box(x, 42, 13, 4.6, 6.5, { color: 0x9c4a3a, roof: 'hip', roofColor: C.slate, plain: true });
  // Tercentenary Theatre: Memorial Church on the north, Widener's steps and columns on the south, Sever Hall on the east
  k.lawn(13, 31.5, 26, 9);
  k.box(17, 20.5, 15, 6, 6, { color: 0x9c4a3a, roof: 'gable', roofColor: C.slate, win: 'tall', plain: true }); portico(k, 17, 24.6, 8, 4, 5, { color: C.white, steps: 2 }); steeple(k, 8, 20.5, 3, 10, { color: C.white, kind: 'spire', capColor: C.white, trim: C.white, win: 'none' });
  k.label('Memorial Church', 12, 20, 20.5);
  k.box(13, 43.5, 24, 7.5, 8.5, { color: 0x9c4a3a, roof: 'flat', roofColor: C.stone, win: 'tall' }); portico(k, 13, 38.6, 17, 10, 6.5, { rot: Math.PI, color: C.lime, steps: 6, pediment: false }); k.label('Widener Library', 13, 13, 43.5);
  k.box(31.5, 31, 6.5, 13, 6.5, { color: 0x8f4436, roof: 'hip', roofColor: 0x7d4a40, win: 'grid', plain: true }); k.label('Sever Hall', 31.5, 11, 31);
  k.box(41, 40, 7, 9, 6, { color: 0xcfcac0, roof: 'flat', roofColor: 0x9a968c, win: 'bands' }); k.sign(41, 34.6, 'Art Museums');
  k.grove(-28, 27, 10, 8, 6); k.grove(-4, 22, 8, 8, 5); k.grove(-4, 36, 10, 6, 5); k.row(-2, 26.4, 28, 26.4, 7); k.row(-2, 36.8, 28, 36.8, 7); k.grove(40, 26, 8, 10, 5); k.grove(-34, 4, 12, 10, 6); k.grove(40, 6, 10, 14, 7); k.row(-16, 12.6, 12, 12.6, 8);
  k.door = { x: -5, z: 2 }; k.spawn = { x: 3, z: 30 };
  k.path([P(3, 30), P(2.8, 12), P(-5, 4)], 1.8); k.path([P(2.8, 12), P(-20, 14), P(-20, 22)], 1.6); k.path([P(2.8, 12), P(18, 6), P(24, -2.6)], 1.6); k.path([P(-41, 27), P(-19, 27), P(3, 30), P(27, 31)], 1.6); k.path([P(13, 36.6), P(13, 25.6)], 1.6);
  life(k, [[P(3, 29), P(2.8, 12), P(-5, 5), P(-14, 7), P(-5, 5), P(2.8, 12)], [P(-20, 21), P(-8, 13), P(10, 12), P(18, 6), P(10, 12), P(-8, 13)], [P(-40, 27), P(-20, 27), P(3, 30), P(26, 31), P(3, 30)], [P(13, 36), P(13, 27), P(3, 30)], [P(-46, 44), P(-46, -44)]], { tour: [8, 9], drone: true });
}

export function mit(k) {
  k.ground();
  // the Charles, Memorial Drive along it, and the long bridge that carries Massachusetts Avenue
  k.water(0, 27, 96, 12); road(k, [P(-48, 18), P(48, 18)], 2.6); road(k, [P(-30, 18), P(-30, -48)], 3);
  bridge(k, -30, 19, -30, 35, 3, C.concrete);
  for (let i = 0; i < 9; i++) { const m = k.mesh(new THREE.BoxGeometry(0.5, 0.02, 0.12), i % 3 ? 0xf4f2ec : 0xd24d3e); m.position.set(-31, 0.55, 21 + i * 1.3); m.castShadow = false; }
  egg(k, 'smoots', -31.2, 23.5, 'post', 0xf4f2ec); k.sign(-27.6, 16, 'Harvard Bridge');
  k.boat(8, 26, 12, 2.5, 0.2); k.boat(-10, 29, 8, 1.5, 0.3); k.boat(30, 28, 7, 2, 0.25);
  // Boston on the far bank: the Back Bay's brownstones and two towers behind them
  terrace(k, -46, 40, 46, 40, { n: 13, h: 4.6, depth: 5, colors: [0x8a4a3a, 0x9c5a44, 0x7a4234, 0xa8644c], roof: 'flat' }); k.row(-44, 35.2, 44, 35.2, 14);
  k.box(-34, 45, 5, 5, 15, { color: 0x8f98a3, roof: 'flat', roofColor: C.dark, win: 'bands', plain: true }); k.glass(-41, 45.5, 3, 5, 18); k.label('Boston', -12, 8, 41);
  // Killian Court: Building 10 with the Great Dome behind its colonnade, the two wings reaching toward the river
  k.box(-2, -8, 20, 8, 7, { color: C.lime, roof: 'flat', roofColor: C.stone, win: 'tall' }); colonnade(k, -2, -3.6, 12, 8, 6, { color: C.lime });
  k.cyl(-2, -8, 5.2, 2.5, { color: C.lime, roof: 'dome', roofColor: 0xd8d2c2, y: 7, solid: false, seg: 18 });
  for (const x of [-15.5, 11.5]) { k.box(x, 1.5, 5, 11, 6.5, { color: C.lime, roof: 'flat', roofColor: C.stone, win: 'tall', plain: true }); k.box(x, -8, 5, 8, 6.5, { color: C.lime, roof: 'flat', roofColor: C.stone, win: 'tall', plain: true }); }
  k.lawn(-2, 5, 22, 13); k.label('Great Dome', -2, 16.5, -8); k.sign(-2, 12.6, 'Killian Court');
  // Building 7: the small dome, the way in from the avenue
  k.box(-23, -8, 8, 9, 7.5, { color: C.lime, roof: 'flat', roofColor: C.stone, win: 'tall', plain: true }); dome(k, -23, -8, 3, 7.5, { color: 0xd8d2c2, drum: 1 }); portico(k, -27.6, -8, 7, 5, 6, { rot: -Math.PI / 2, color: C.lime, steps: 3 }); k.sign(-27.4, -2.6, '77 Massachusetts Ave.');
  // west of the avenue: Kresge Auditorium, an eighth of a sphere on three points, and the round brick chapel in its moat
  { const R = 10, th = 0.86, s = k.mesh(new THREE.SphereGeometry(R, 3, 6, 0, Math.PI * 2, 0, th), 0xe9e6dc, { side: THREE.DoubleSide }); s.position.set(-40, -R * Math.cos(th) + 0.1, -10); k.glass(-40, -10, 9, 9, 2.6, { solid: false }); k.obstacles.push({ x0: -46, x1: -34, z0: -16, z1: -4 }); k.mask.disc(-40, -10, 6.5, 6.5, 4); }
  k.label('Kresge Auditorium', -40, 7, -10);
  k.water(-40, 6, 8, 8, { round: true }); k.cyl(-40, 6, 2.7, 5, { color: C.brick, roof: 'flat', roofColor: C.dark, seg: 16 }); block(k, -40, 5.2, 6, 0.12, 3.2, 0.12, C.steel); k.label('MIT Chapel', -40, 10, 6);
  k.box(-40, -26, 12, 7, 6, { color: 0xcfcac0, roof: 'flat', roofColor: 0x9a968c, win: 'bands' }); k.sign(-33, -26, 'Student Center');
  // east: the Green Building, a tall slab on stilts with a radar ball on top, over a court with a black steel sail
  k.plaza(24, 4, 12, 9); k.box(24, -2.5, 4.5, 9, 26, { color: 0xd9d5cb, roof: 'flat', roofColor: C.concrete, win: 'tall', plain: true }); k.sphere(24, 27.6, -2.5, 1.5, 0xf4f2ec);
  { const sail = k.mesh(new THREE.ConeGeometry(2.2, 5, 3), 0x26262a); sail.position.set(25, 2.5, 6); sail.scale.z = 0.25; sail.rotation.y = 0.6; }
  k.label('Green Building', 24, 31, -2.5);
  // the economics building by the river
  k.box(38, 11, 14, 6, 9, { color: 0xe6dfcf, roof: 'flat', roofColor: C.stone, win: 'tall' }); k.box(38, 11, 5, 6.6, 11, { color: 0xe6dfcf, roof: 'flat', roofColor: C.stone, win: 'tall', solid: false });
  k.sign(30, 15.6, 'Economics');
  // Vassar Street and the Stata Center beyond it: tilted towers in brick, yellow and steel
  road(k, [P(-30, -21), P(48, -21)], 2.6); k.sign(-10, -19.4, 'Vassar St.');
  for (const [x, z, w, d, h, r, c] of [[4, -37, 6, 6, 13, 0.15, C.brick], [10, -41, 5, 5, 10, -0.25, 0xe2b23a], [2, -29, 5, 6, 9, -0.1, 0xb8c2cc], [9, -33, 4, 4, 7, 0.4, 0xf4f2ec]]) k.box(x, z, w, d, h, { color: c, roof: 'none', win: c === C.brick ? 'grid' : 'none', rot: r });
  k.cyl(6, -43, 2.4, 11, { color: 0xb8c2cc, roof: 'flat', roofColor: C.steel, top: 2.9 });
  k.sign(10.5, -27.4, 'Stata Center');
  // the Media Lab: a glass box with colored screens, and Kendall Square's towers behind
  k.glass(22, -14, 12, 9, 10); for (const [x, c] of [[17.5, 0xd24d3e], [20.5, 0xe2b23a], [23.5, 0x3f7fb5], [26.5, 0x4f9a54]]) { const m = k.mesh(new THREE.BoxGeometry(2.2, 6, 0.1), c); m.position.set(x, 5, -9.3); }
  k.sign(15.5, -7.6, 'Media Lab');
  k.glass(38, -34, 8, 8, 18); k.box(28, -38, 8, 9, 13, { color: 0xb8c2cc, roof: 'flat', roofColor: C.steel, win: 'bands', plain: true }); k.glass(40, -44, 9, 6, 12); k.label('Kendall Square', 36, 22, -36);
  k.row(-14, 14.5, 12, 14.5, 8); k.grove(-12, -30, 22, 12, 9); k.grove(-42, 14, 8, 4, 4); k.grove(-42, -40, 10, 10, 6); k.row(-26, 20.4, 46, 20.4, 16); k.grove(40, 0, 10, 8, 5);
  k.rooms = [{ x: 38, z: 14.6, label: 'Economics', ids: ['I-7'] }, { x: 8, z: -27.4, label: 'Stata Center', ids: ['III-2'] }, { x: 22, z: -8.2, label: 'Media Lab', ids: ['III-5', 'III-6'] }];
  k.door = k.rooms[0]; k.spawn = { x: -2, z: 15 };
  k.path([P(-2, 15.6), P(-2, -1)], 1.8); k.path([P(-46, 15.6), P(46, 15.6)], 2.2, 0xcfc8ba); k.path([P(8, -4.5), P(17, -7.6), P(22, -8.2)], 1.6); k.path([P(8, -21), P(8, -27)], 1.6); k.path([P(-11, -12.6), P(-11, -21)], 1.4); k.path([P(18, 15.6), P(18, 4), P(24, 4)], 1.5); k.path([P(-30, 6), P(-36, 6)], 1.4);
  life(k, [[P(-2, 15), P(-2, 2), P(-2, 15), P(18, 15.6), P(18, 4), P(18, 15.6)], [P(-44, 15.6), P(44, 15.6)], [P(-28, -19.4), P(40, -19.4)], [P(8, -22.6), P(8, -27), P(8, -22.6), P(22, -22.6)], [P(-33, -40), P(-33, 14), P(-44, 14), P(-33, 14)]], { line: [[-2, 15], [-2, 15.6], [38, 15.6]], tour: [-6, 4], drone: true });
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
  k.plaza(-24, 7, 9, 8); for (const [x, z] of [[-26, 5], [-22, 5], [-26, 9], [-22, 9]]) { const m = k.mesh(new THREE.BoxGeometry(1.6, 0.4, 1.6), C.glass, { roughness: 0.14, metalness: 0.25, envMapIntensity: 1.5 }); m.position.set(x, 0.25, z); }
  egg(k, 'morrow', -24, 12.4, 'post', C.cream);
  k.row(-9.6, -18, -9.6, 18, 8); k.row(9.6, -18, 9.6, 18, 8);
  k.rooms = [{ x: 19, z: -20, label: 'Siebel Center', ids: ['I-8'] }]; k.door = k.rooms[0]; k.spawn = { x: 0, z: 13 };
  k.path([P(8, -10), P(19, -19)], 1.6);
  // Green Street along the north of the Quad; Alma Mater at the corner with Wright Street, and Altgeld Hall with its bell tower just south of her
  road(k, [P(-48, -31.5), P(48, -31.5)], 3); k.sign(14, -29.8, 'Green St.'); road(k, [P(-31, -48), P(-31, 12)], 2.8, 0x8a8478); k.sign(-29, 4, 'Wright St.');
  k.box(-24.8, -29.2, 2.6, 1.6, 1.1, { color: C.stone, roof: 'none', win: 'none' }); for (const [dx, s] of [[0, 1.5], [-0.9, 1.1], [0.9, 1.1]]) { const f = k.statueFigure(0x5f7a6a, s); f.position.set(-24.8 + dx, 1.1, -29.2); k.g.add(f); }
  k.label('Alma Mater', -24.8, 6, -29.2);
  k.box(-24, -21, 9, 9, 6.5, { color: 0xc9b18a, roof: 'hip', roofColor: 0x9a5340, win: 'tall', plain: true }); steeple(k, -20.5, -24.5, 3, 13, { color: 0xc9b18a, kind: 'pyramid', capColor: 0x9a5340, trim: 0xc9b18a }); k.label('Altgeld Hall', -22, 19, -23);
  // across Green Street: Engineering Hall, the Bardeen Quad behind it, Grainger Library on its north side
  k.box(-6, -36.4, 20, 4.6, 7, { color: C.brick, roof: 'hip', roofColor: C.slate, win: 'grid', plain: true }); colonnade(k, -6, -33.8, 6, 4, 5, { color: C.lime, depth: 1.2 }); k.sign(6, -34, 'Engineering Hall');
  k.lawn(-6, -41, 18, 3.6); k.box(-6, -45.4, 22, 4, 6, { color: C.brick, roof: 'green', win: 'bands', plain: true }); k.label('Grainger Library', -6, 9.5, -45.4); k.sign(-16.4, -41, 'Bardeen Quad');
  k.glass(36, -40, 12, 9, 7); k.box(36, -40, 5, 9.6, 9, { color: 0xcfc7b8, roof: 'flat', roofColor: C.steel, win: 'bands', solid: false, plain: true }); k.sign(29, -34.6, 'Beckman Institute');
  // south of the auditorium: the South Quad and its bell tower, the Main Library, Smith Memorial Hall, the round Observatory by the plots
  k.lawn(0, 38.5, 12, 13); steeple(k, 0, 44, 2.6, 16, { color: C.brick, kind: 'pyramid', capColor: C.copper, trim: C.lime }); k.label('McFarland Bell Tower', 0, 22.5, 44);
  k.box(-15, 34, 13, 8, 8, { color: C.brick, roof: 'hip', roofColor: C.slate, win: 'tall', plain: true }); colonnade(k, -15, 29.6, 8, 6, 5.4, { color: C.lime, rot: Math.PI, depth: 1.2, pediment: false }); k.label('Main Library', -15, 12.5, 34);
  k.box(15, 34, 11, 7, 7, { color: C.brick, roof: 'hip', roofColor: C.slate, win: 'tall', plain: true }); portico(k, 15, 30, 7, 6, 5.6, { rot: Math.PI, color: C.lime, steps: 3 }); k.sign(15, 39, 'Smith Memorial Hall');
  k.cyl(-34, 20, 2.4, 3.6, { color: C.brick, roof: 'dome', roofColor: C.white, seg: 12 }); k.box(-34, 24, 4.4, 4, 3, { color: C.brick, roof: 'gable', roofColor: C.slate, plain: true }); k.sign(-34, 27, 'Observatory');
  stadium(k, -36, 40, 9, 6.5, { h: 4.6, color: 0xb86b4f }); k.label('Memorial Stadium', -36, 8.5, 40);
  // the shops of Campustown along the far side of Wright Street
  terrace(k, -37.5, -46, -37.5, 10, { n: 9, h: 4.2, depth: 6, colors: [C.brick, 0xd8c7a6, C.brickDark, 0xcfc7b8] });
  k.path([P(-8, -20), P(-18, -27), P(-24, -27.6)], 1.4); k.path([P(0, -28.6), P(0, -31.5)], 1.6); k.path([P(-8, 20), P(-8, 30), P(-6, 38), P(-1.6, 43)], 1.4); k.path([P(8, 20), P(8, 29), P(15, 29.6)], 1.4); k.path([P(-19.4, 12.4), P(-30, 20)], 1.3);
  k.grove(30, 2, 14, 26, 12); k.grove(32, 26, 14, 14, 8); k.row(-46, -29.4, 46, -29.4, 13); k.grove(18, -42, 10, 8, 5); k.grove(-24, -8, 6, 14, 5); k.row(-10, 46.6, 12, 46.6, 5); k.grove(40, -20, 8, 14, 6);
  life(k, [[P(-28, -29.6), P(28, -29.6)], [P(-8, 22), P(-8, 30), P(-5, 38), P(-8, 30)], [P(-16, -39.2), P(4, -39.2), P(4, -42.8), P(-16, -42.8)], [P(-8, 16), P(-8, -18), P(8, -18), P(8, 16)], [P(0, 13), P(0, 0), P(8, -10), P(18, -18), P(8, -10), P(0, 0)]], { line: [[0, 12], [0, 0], [8, -10], [19, -19.4]], tour: [3, 4], mower: [0, 6, 10, 10] });
}

export function rensselaer(k) {
  k.ground();
  // the Hudson along the west, the campus on its hill
  k.water(-43, 0, 10, 96); k.boat(-43, 6, 1.5, 16, 0.12); k.boat(-44.5, -24, 1.2, 8, 0.2);
  k.patch(-22.5, 0, 31, 96, 0x9a9a8a, 0.02);
  for (const [z, c] of [[-20, C.brick], [-10, C.brickDark], [2, 0xc98a5a], [14, C.brick]]) k.box(-15, z, 6, 7, 4.6, { color: c, roof: 'gable', roofColor: C.slate });
  hill(k, 8, -6, 26, 30, 3.2);
  stairs(k, -6.5, 6, 5, 10, 8, Math.PI / 2, C.stone); k.sign(-9.6, 10.6, 'The Approach');
  // the chapel that became a computing center
  k.box(6, -4, 8, 16, 8, { color: 0xb9ad98, roof: 'gable', roofColor: C.slate, win: 'tall', y: 3 }); k.tower(6, 5.4, 3.2, 14, { color: 0xb9ad98, cap: 'spire', capColor: C.slate });
  const rose = k.mesh(new THREE.CircleGeometry(1.5, 12), 0x4d8fa8, { emissive: 0x2f6f8f, emissiveIntensity: 0.5 }); rose.position.set(6, 9.2, 4.05);
  k.label('Computing Center', 6, 20, -4); egg(k, 'chapel', 9.6, 6.6, 'post', 0x4d8fa8, 3);
  // the glass arts center and the wooden hull of its concert hall, which shows here by pushing out through the front
  k.glass(19, 10, 11, 9, 9, { y: 2.4 }); const hull = k.mesh(new THREE.IcosahedronGeometry(1, 2), C.wood); hull.scale.set(4.2, 3, 3.2); hull.position.set(19, 6.8, 13.2);
  k.box(18, -16, 12, 7, 8, { color: C.brick, roof: 'flat', roofColor: C.dark, win: 'grid', y: 2.6 }); k.box(-2, -20, 9, 6, 7, { color: C.brickDark, roof: 'hip', roofColor: C.slate, y: 2 });
  k.grove(10, 20, 22, 8, 10, ['round', 'cone']); k.grove(-4, -10, 4, 8, 4);
  k.door = { x: 1.2, z: 6.2 }; k.spawn = { x: -10, z: 22 };
  k.path([P(-10, 22), P(-9, 9), P(-4, 6), P(1, 6)], 1.8);
  // downtown Troy between the river and the hill: brick blocks along River Street, a church spire, the bridge over the Hudson
  terrace(k, -34, -44, -34, -6, { n: 8, h: 5, depth: 5.5, colors: [C.brick, C.brickDark, 0xc98a5a, 0x9a5340] }); terrace(k, -34, 6, -34, 44, { n: 8, h: 4.6, depth: 5.5, colors: [C.brickDark, 0xc98a5a, C.brick, 0xd8c7a6] });
  for (const [z, c] of [[-40, C.brickDark], [-31, 0xc98a5a], [26, C.brick], [36, C.brickDark]]) k.box(-15, z, 6, 7, 4.6, { color: c, roof: 'gable', roofColor: C.slate });
  road(k, [P(-25, -48), P(-25, 48)], 2.6); k.sign(-23.4, -2, 'River St.'); bridge(k, -38, 0, -48, 0, 3, C.steel); road(k, [P(-25, 0), P(-37, 0)], 2.6);
  steeple(k, -24, 24, 2.6, 9, { color: 0x8a7868, kind: 'spire', capColor: C.slate, trim: 0x8a7868 }); k.box(-21.5, 28.5, 5, 7, 4.5, { color: 0x8a7868, roof: 'gable', roofColor: C.slate, win: 'tall', plain: true });
  k.label('Troy', -30, 9, -24); k.label('Hudson River', -43, 3, 22);
  // on the hill: the library that replaced the old seminary, and West Hall, once the city hospital, at the western edge
  k.label('Folsom Library', 18, 15, -16); k.sign(-2, -15.6, 'West Hall'); k.label('EMPAC', 19, 15.5, 10);
  // east of the hill: the playing field, the barrel-roofed Field House, a red-brick laboratory with green copper roofs
  k.lawn(36, 16, 16, 22); for (let i = -2; i <= 2; i++) k.patch(36, 16 + i * 4, 15, 0.16, 0xf4f2ec, 0.05, 1, false); k.label("'86 Field", 36, 4, 16);
  hangar(k, 34, 38, 16, 10, 6, 0xb8c2cc); k.label('Houston Field House', 34, 10, 38);
  k.box(34, -36, 16, 6, 7, { color: C.brick, roof: 'hip', roofColor: 0x6fa59a, win: 'grid', plain: true }); k.box(27.5, -30.5, 5, 7, 7, { color: C.brick, roof: 'hip', roofColor: 0x6fa59a, plain: true }); k.box(40.5, -30.5, 5, 7, 7, { color: C.brick, roof: 'hip', roofColor: 0x6fa59a, plain: true }); k.label('Russell Sage Laboratory', 34, 11.5, -36);
  k.box(14, -40, 12, 6, 6.5, { color: 0xc9b18a, roof: 'hip', roofColor: C.slate, win: 'tall', plain: true }); k.sign(14, -35.6, 'Pittsburgh Building');
  k.path([P(-10, 22), P(-12, 34), P(-25, 34)], 1.5); k.path([P(14, 18), P(26, 22), P(28, 30)], 1.5); k.path([P(-9, 9), P(-11, -8), P(-12, -34), P(-25, -34)], 1.5); k.path([P(28, -12), P(34, -24), P(34, -32.6)], 1.4);
  k.grove(40, -12, 10, 20, 9, ['round', 'cone']); k.grove(6, 38, 26, 12, 12, ['round', 'cone']); k.grove(6, -44, 2, 4, 2); k.row(-46.4, -44, -46.4, 44, 0); k.grove(-18, -24, 4, 6, 3); k.grove(24, 26, 4, 10, 4);
  life(k, [[P(-25, -40), P(-25, 40)], [P(14, 18), P(26, 22), P(28, 30), P(26, 22)], [P(-10, 22), P(-12, 34), P(-23, 34), P(-12, 34)], [P(-10, 21), P(-9, 9), P(-11, -8), P(-9, 9)], [P(-11, -22), P(-11, 22)], [P(-3, 12), P(8, 14), P(14, 18), P(8, 14)]], { tour: [-4, 14] });
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
  // the old town hall on the market, the goose girl's fountain in front of it
  k.box(3, 10, 4.6, 6, 6, { color: 0xb9ad98, roof: 'hip', roofColor: 0x9a5340, win: 'tall', plain: true }); for (const z of [7.4, 12.6]) k.cyl(5.2, z, 0.6, 7.6, { color: 0xb9ad98, roof: 'cone', roofColor: 0x9a5340, seg: 8, roofH: 1.6, solid: false }); k.label('Altes Rathaus', 3, 10.5, 10);
  // more of the town: St. Jacobi's tall tower to the north, streets of gabled houses, the Aula on Wilhelmsplatz
  k.box(14, -21, 6, 11, 7.5, { color: 0xb08a7a, roof: 'gable', roofColor: C.slate, win: 'tall', plain: true }); steeple(k, 14, -13.6, 3.6, 18, { color: 0xb08a7a, kind: 'dome', capColor: C.copper, trim: 0xb08a7a }); k.label('St. Jacobi', 14, 27, -14);
  terrace(k, 31, -1, 31, 19, { n: 6, h: 5, depth: 5, colors: cols, roof: 'gable', roofColor: C.red }); terrace(k, 5, 23.5, 27, 23.5, { n: 7, h: 4.8, depth: 5, colors: cols, roof: 'gable', roofColor: 0x9a5340 }); terrace(k, 22, -11, 22, -27, { n: 5, h: 5, depth: 5, colors: cols, roof: 'gable', roofColor: C.red });
  k.plaza(33, -8, 12, 6, 0xcfc4b0); k.box(33, -15, 13, 6, 6.5, { color: 0xe9dfc8, roof: 'hip', roofColor: C.slate, win: 'tall', plain: true }); portico(k, 33, -11.4, 7, 6, 5.4, { color: C.white, steps: 2 }); statue(k, 33, -7, 2, 0x6f7f72); k.label('Aula', 33, 11.5, -15);
  gothic(k, 2, -34, 16, 6, 8, { color: 0xc9b89a }); k.sign(2, -29.8, 'Paulinerkirche: the old library');
  k.box(-24, -36, 14, 6, 6, { color: 0xe4dccb, roof: 'hip', roofColor: C.slate, win: 'grid', plain: true }); k.label('Mathematical Institute', -24, 10.5, -36);
  // the Wall: the old rampart, now a walk under lime trees right round the town, with Gauss and Weber in bronze beside it
  k.path([P(-8, -42), P(40, -42), P(41.5, 32), P(-8, 34), P(-12, 30)], 2.2, 0xcbb994); k.row(-6, -44.2, 38, -44.2, 12); k.row(43.6, -40, 43.6, 30, 16); k.row(-6, 36.2, 40, 36.2, 12);
  k.box(38, 26, 2.6, 1.6, 1, { color: C.stone, roof: 'none', win: 'none' }); for (const dx of [-0.6, 0.6]) { const f = k.statueFigure(0x5f7a6a, 1.25); f.position.set(38 + dx, 1, 26); k.g.add(f); } k.label('Gauss and Weber', 38, 6, 26); k.sign(30, 31.6, 'Stadtwall');
  // the Leine canal and, beyond it, the railway station
  k.river([P(-33, -48), P(-31.5, -12), P(-33.5, 18), P(-32, 48)], 2.4); bridge(k, -35, 26, -29, 26, 2.2); bridge(k, -35, -22, -29, -22, 2.2);
  rails(k, -44.5, -48, -44.5, 48); train(k, -44.5, -30, -44.5, 30, 3, 0xc0503f); k.box(-39.5, 26, 5, 16, 5, { color: 0xd9c4a0, roof: 'hip', roofColor: C.slate, win: 'tall', plain: true }); k.box(-39.5, 26, 5.6, 5, 7, { color: 0xd9c4a0, roof: 'hip', roofColor: C.slate, win: 'tall', plain: true, solid: false }); k.label('Bahnhof', -39.5, 10.5, 26);
  k.path([P(-29, 26), P(-12, 30), P(-2, 24), P(6, 21)], 1.6, 0xcfc4b0); k.path([P(13, -1), P(13, -8), P(18, -10.5), P(18, -30), P(8, -30)], 1.5, 0xcfc4b0); k.path([P(18, -10.5), P(27, -8)], 1.5, 0xcfc4b0); k.path([P(-12, -6), P(-22, -22), P(-29, -22)], 1.4, 0xcfc4b0);
  k.grove(-20, 28, 8, 12, 6, ['round', 'cone']); k.grove(-14, -28, 8, 6, 4); k.grove(34, 6, 4, 10, 4); k.grove(-38, -8, 6, 26, 8); k.grove(-38, -40, 6, 8, 3);
  life(k, [[P(-6, -42), P(40, -42), P(41.5, 32), P(-6, 34), P(41.5, 32), P(40, -42)], [P(13, 0), P(13, -8), P(18, -10.5), P(18, -29), P(18, -10.5), P(27, -8), P(18, -10.5), P(13, -8)], [P(-28, 26), P(-12, 30), P(-2, 24), P(-12, 30)], [P(10, 10), P(2, 2), P(-12, -5), P(2, 2)], [P(8, 2), P(19, 2), P(19, 11), P(8, 11)], [P(-20, 0), P(-6, 2), P(-20, 4)]], { tour: [16, 9], bikes: 2 });
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
  // the Main Administration Building closes the east end of the mall, facing the library down its length
  k.box(35, 0, 7, 17, 8, { color: C.brick, roof: 'hip', roofColor: C.slate, win: 'grid', plain: true }); colonnade(k, 30.8, 0, 9, 6, 6.6, { color: C.white, rot: -Math.PI / 2 }); cupola(k, 35, 10.6, 0, 1, { capColor: C.white }); k.label('Main Administration', 35, 16, 0);
  // Memorial Chapel on its rise to the south-east: white columns and a white steeple seen from all over
  k.box(31, 34, 8, 14, 7, { color: C.brick, roof: 'gable', roofColor: C.slate, win: 'tall', plain: true }); portico(k, 31, 26.2, 7, 4, 6, { rot: Math.PI, color: C.white, steps: 4 }); steeple(k, 31, 29.6, 3, 9.5, { color: C.white, kind: 'spire', capColor: C.white, trim: C.white, win: 'none', clock: true }); k.label('Memorial Chapel', 31, 22, 31);
  // Campus Drive across the north, the flower bed planted as an M, the Iribe Center on its V-shaped legs by the gate
  road(k, [P(46, -29), P(-46, -29)], 3); road(k, [P(45, -48), P(45, 48)], 3); k.sign(43, 12, 'Baltimore Ave.');
  k.disc(18, -22.5, 4, k.season.lawn, 0.04); for (const [dx, r] of [[-1.5, 0], [1.5, 0], [-0.75, 0.5], [0.75, -0.5]]) { const m = block(k, 18 + dx, 0.05, -22.5, 0.5, 0.25, r ? 2.6 : 3.2, 0xe2b23a, r); m.castShadow = false; } k.label('The M', 18, 4, -22.5);
  k.glass(36, -38, 13, 8, 6, { y: 2.6 }); for (const x of [31, 36, 41]) for (const s of [-1, 1]) { const m = block(k, x + s * 0.9, 0, -35, 0.35, 3, 0.35, C.white, 0); m.rotation.z = s * 0.45; } k.box(36, -40.5, 9, 3, 2.6, { color: C.concrete, roof: 'none', win: 'none', plain: true }); k.label('Iribe Center', 36, 12, -38);
  gate(k, 45, -24, 5, 4, { rot: Math.PI / 2, color: C.brick });
  // north-west: the student union and the stadium
  k.box(0, -38, 20, 8, 7, { color: C.brick, roof: 'hip', roofColor: C.slate, win: 'grid', plain: true }); portico(k, 0, -33.4, 8, 6, 5.6, { color: C.white, steps: 2 }); k.label('Stamp Student Union', 0, 12, -38);
  stadium(k, -32, -38, 11, 8, { h: 5, color: 0xb5654a }); k.label('SECU Stadium', -32, 9, -38);
  // south: Morrill Hall, the oldest classroom building, and a Georgian quadrangle of residence halls
  k.box(-12, 28, 9, 6, 6, { color: 0x9c4a3a, roof: 'hip', roofColor: 0x5a4a4a, win: 'tall', plain: true }); k.sign(-12, 32.4, 'Morrill Hall, 1898');
  quad(k, 8, 36, 22, 14, { t: 3.6, h: 6, color: C.brick, roof: 'hip', roofColor: C.slate, open: 'n', gap: 4 }); k.sign(8, 27.4, 'South Hill');
  k.box(-36, 8, 8, 12, 7, { color: C.brick, roof: 'hip', roofColor: C.slate, win: 'grid', plain: true }); k.box(-36, -10, 8, 12, 7, { color: C.brick, roof: 'hip', roofColor: C.slate, win: 'grid', plain: true });
  k.path([P(26, 5), P(27, 22), P(31, 23)], 1.5); k.path([P(8, -19), P(8, -29)], 1.5); k.path([P(-6, 19), P(-8, 24), P(-12, 24.6)], 1.4); k.path([P(8, 19), P(8, 28)], 1.5); k.path([P(0, -19), P(0, -32)], 1.5);
  k.grove(-22, 36, 14, 16, 9); k.grove(40, 14, 4, 12, 5); k.grove(-14, -30, 8, 4, 4); k.grove(20, -40, 8, 10, 5); k.row(-44, -26.6, 28, -26.6, 13); k.grove(-40, 28, 8, 20, 7); k.grove(40, 24, 4, 8, 3);
  life(k, [[P(26, 5), P(27, 22), P(30, 23), P(27, 22)], [P(-40, -27), P(40, -27)], [P(8, -19), P(8, -27), P(0, -27), P(0, -32), P(0, -27)], [P(22, -5), P(-16, -5), P(-16, 5), P(22, 5)], [P(26, 2.5), P(-12, 2.5)], [P(0, 9), P(14, 10), P(26, 9), P(14, 10)]], { line: [[21, 1.6], [0, 1.6], [-16.4, -1.4]], tour: [6, -2.6], mower: [10, 2.6, 16, 2] });
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
  k.sign(-22, 11.4, 'Appleton Tower'); k.label('Arthur’s Seat', 22, 15, -22); k.label('Bristo Square', -1, 4, 6);
  // the castle on its rock at the top of the Royal Mile, and the crown spire of St Giles along it
  hill(k, -36, -34, 11, 9, 7.5, 0x7d7f76); k.box(-36, -34, 11, 6, 2.6, { color: 0x9a968c, roof: 'none', win: 'none', y: 6.4, solid: false }); k.box(-37, -35, 5, 3.4, 3, { color: 0x8f8676, roof: 'gable', roofColor: C.slate, win: 'grid', y: 9, solid: false, plain: true }); k.cyl(-31.5, -32.5, 1.8, 2.6, { color: 0x9a968c, roof: 'flat', roofColor: 0x8f8676, y: 6.4, solid: false, seg: 10 });
  k.label('Edinburgh Castle', -36, 16, -34);
  terrace(k, -22, -40, 16, -40, { n: 10, h: 7, depth: 5, colors: [0xa89c88, 0x8f8676, 0xb5ab97, 0x9a8f7c], roof: 'gable', roofColor: C.slate }); k.path([P(-26, -36.4), P(34, -36.4)], 2.4, 0xb8b2a6); k.sign(8, -35, 'The Royal Mile');
  k.box(-6, -33, 8, 5, 6, { color: 0x8f8676, roof: 'gable', roofColor: C.slate, win: 'tall', plain: true, solid: false }); steeple(k, -6, -33, 3, 10, { color: 0x8f8676, kind: 'crown', capColor: 0x8f8676 }); k.sign(-0.6, -33.6, 'St Giles');
  // Old College on South Bridge: a quadrangle with a dome over the gate
  quad(k, 32, 2, 15, 14, { t: 3.4, h: 6.5, color: 0xb9a98a, roof: 'flat', roofColor: 0x8f8676, win: 'tall', open: 'e', gap: 3 }); dome(k, 38, 2, 2.4, 7, { color: 0x8fa39a, drum: 2, drumColor: 0xb9a98a }); k.label('Old College', 32, 15, 2);
  // Teviot Row House, the students' union, turreted; and Greyfriars with its kirkyard
  gothic(k, 24, 21, 9, 5, 6, { color: 0xb5ab97 }); for (const x of [20.4, 27.6]) k.cyl(x, 23.2, 0.9, 7.4, { color: 0xb5ab97, roof: 'cone', roofColor: C.slate, seg: 8, roofH: 2, solid: false }); k.sign(24, 25.2, 'Teviot Row House');
  k.lawn(-36, -6, 14, 14); gothic(k, -36, -8, 6, 11, 6, { color: 0xa89c88, pin: false }); for (const [x, z] of [[-41, -2], [-39, 0.5], [-32, -1], [-31, 1.5], [-42, -12]]) block(k, x, 0, z, 0.5, 1, 0.16, 0x8f8676); k.label('Greyfriars Kirk', -36, 10.5, -8);
  // George Square: the garden, the Main Library across its south side, the tower block on the east; the Meadows beyond
  k.lawn(-4, 34, 20, 11); k.box(-4, 44, 24, 5.4, 7, { color: 0xcfcac0, roof: 'flat', roofColor: 0x9a968c, win: 'bands' }); k.label('Main Library', -4, 11, 44);
  k.box(12, 33, 5, 8, 21, { color: 0xb8b2a6, roof: 'flat', roofColor: C.dark, win: 'bands', plain: true }); k.sign(15.6, 38, '40 George Square'); terrace(k, -17, 28.5, -17, 40, { n: 4, h: 5.5, depth: 4.4, colors: [0xa89c88, 0x8f8676], roof: 'gable', roofColor: C.slate });
  k.lawn(-34, 36, 20, 18); k.path([P(-44, 28), P(-24, 45)], 1.6); k.path([P(-24, 28), P(-44, 45)], 1.6); k.row(-43, 29, -26, 43.6, 7); k.label('The Meadows', -34, 4, 36);
  k.path([P(-2, 16), P(-2, 28.4)], 1.6); k.path([P(-2, 10), P(-14, 2), P(-28, -3)], 1.5); k.path([P(8, 1), P(22, 2), P(24.4, 2)], 1.5); k.path([P(2, -1), P(2, -22), P(-2, -36.4)], 1.6); k.grove(-4, 34, 16, 8, 8); k.grove(36, 26, 12, 14, 7); k.grove(-26, 20, 6, 6, 3); k.grove(12, -28, 8, 6, 4); k.grove(40, 40, 8, 8, 4);
  life(k, [[P(-24, -36.4), P(32, -36.4)], [P(-2, 16), P(-2, 28), P(-14, 29), P(-2, 28)], [P(8, 2), P(22, 2), P(8, 2), P(2, 0), P(2, -20), P(2, 0)], [P(-42, 29), P(-26, 43), P(-34, 36)], [P(-2, 10), P(-9, 2), P(2, 4), P(8, 2), P(2, 4)], [P(-16, 11), P(14, 11)], [P(16, 4), P(22, 10), P(16, 12)]], { line: [[-2, 9.4], [-6, 4], [-10, -2]], tour: [3, 7], bikes: 0 });
}

export function wisconsin(k) {
  k.ground();
  // the lake to the north and the terrace with its bright chairs
  k.water(0, -33, 96, 30); k.boat(-34, -34, 7, 2, 0.22); k.boat(30, -30, 9, 2.5, 0.18); k.boat(-4, -42, 12, 2, 0.15); k.boat(-10, -24, 9, 2, 0.2); k.boat(14, -26, 6, 1.5, 0.28); k.boat(2, -22, 4, 1, 0.35);
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
  k.label('Lake Mendota', 20, 3, -30); k.label('Memorial Union', -12, 12, -8);
  // the Red Gym next to the Union: an armory dressed up as a castle
  k.box(5, -13, 9, 7, 6, { color: 0xa8443a, roof: 'gable', roofColor: 0x6b4a44, win: 'tall', plain: true }); for (const [x, z] of [[0.6, -9.6], [9.4, -9.6], [0.6, -16.4], [9.4, -16.4]]) k.cyl(x, z, 1.1, 7.6, { color: 0xa8443a, roof: 'flat', roofColor: 0x6b4a44, seg: 8, solid: false }); k.label('Red Gym', 5, 11, -13);
  // Library Mall and State Street, which runs straight to the dome of the State Capitol
  fountain(k, -27, -3, 1.6); k.plaza(-27, -3, 10, 8, 0xd6cdb8); k.box(-37, -12, 12, 9, 7, { color: C.lime, roof: 'flat', roofColor: C.stone, win: 'tall' }); k.label('Memorial Library', -37, 11, -12);
  k.path([P(-22, -1), P(-34, 0)], 2.4, 0xcfc4b0); terrace(k, -44, -6, -33, -6, { n: 3, h: 4.5, depth: 4, colors: [C.brick, 0xd8c7a6, C.brickDark] }); k.sign(-30, 2.2, 'State St.');
  k.box(-40, 4, 7, 7, 6, { color: 0xf0ede6, roof: 'flat', roofColor: C.stone, win: 'tall', plain: true }); for (const [dx, dz] of [[-5, 0], [5, 0], [0, -5], [0, 5]]) k.box(-40 + dx, 4 + dz, dx ? 4 : 4.4, dx ? 4.4 : 4, 5, { color: 0xf0ede6, roof: 'flat', roofColor: C.stone, win: 'tall', plain: true });
  dome(k, -40, 4, 3, 6, { color: 0xf0ede6, drum: 3.4, drumColor: 0xf0ede6 }); { const g = k.mesh(new THREE.ConeGeometry(0.22, 1.1, 5), C.gold); g.position.set(-40, 14.8, 4); } k.label('State Capitol', -40, 18.5, 4);
  // on and behind the hill: the carillon, the old observatory; and the stadium to the south-west
  steeple(k, 28, 14, 2.4, 8, { color: 0xd9c9a8, kind: 'flat' }); k.sign(31.4, 16, 'Carillon Tower'); k.cyl(27, -12, 2.2, 3, { color: 0xd9c9a8, roof: 'dome', roofColor: C.white, seg: 12 }); k.box(31, -12, 5, 4, 3, { color: 0xd9c9a8, roof: 'hip', roofColor: C.slate, plain: true }); k.sign(29, -8.6, 'Washburn Observatory');
  stadium(k, -30, 36, 10, 7.5, { h: 5, color: 0xc0503f }); k.label('Camp Randall', -30, 9, 36);
  k.box(8, 36, 14, 7, 7, { color: 0xcfc7b8, roof: 'solar', win: 'bands' }); k.sign(8, 31.4, 'Computer Sciences'); k.box(30, 36, 6, 8, 18, { color: 0xc9b89a, roof: 'flat', roofColor: C.dark, win: 'bands', plain: true }); k.sign(25.6, 36, 'Van Hise Hall');
  k.path([P(-6, 16), P(-8, 27), P(6, 31)], 1.5); k.path([P(-12, -4), P(-22, -2)], 1.6); k.path([P(-6, 16), P(-20, 30)], 1.5); k.path([P(-1, -12), P(8, -8), P(24, -10)], 1.4);
  k.grove(38, -4, 10, 14, 7); k.grove(-14, 36, 8, 10, 5); k.grove(42, 20, 6, 20, 7); k.row(-46, -16.6, -24, -16.6, 6); k.grove(20, 26, 8, 6, 4); k.row(12, -16.6, 46, -16.6, 9);
  life(k, [[P(-12, -4), P(-22, -2), P(-33, 0), P(-22, -2)], [P(-6, 16), P(-8, 27), P(6, 31), P(-8, 27)], [P(-44, -16), P(46, -16)], [P(-6, 15), P(-2, 11), P(8, 7), P(-2, 11), P(-12, -4), P(-2, 11)], [P(-22, -12), P(-2, -12)], [P(-20, 14), P(-8, 16), P(4, 17), P(-8, 16)]], { tour: [-14, -12], families: 3 });
}

export function stanford(k) {
  k.ground({ color: k.snowCaps() ? 0xcfd3a8 : undefined });
  // the Oval and the palm drive
  k.disc(0, 14, 9, k.season.lawn, 0.02).scale.set(13, 1, 7.5); k.path([P(0, 48), P(0, 22)], 3, 0xd9cdb0);
  for (let i = 0; i < 11; i++) { k.tree(-3, 22.5 + i * 2.4, 'palm'); k.tree(3, 22.5 + i * 2.4, 'palm'); }
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
  k.label('Hoover Tower', 22, 26, -16); k.label('Memorial Church', 0, 13.5, -19); k.sign(4, 24, 'Palm Drive'); k.label('The Oval', 0, 3.5, 14); k.sign(26.6, 10.6, 'Green Library');
  // the arcades along the front of the Quad, and Memorial Court behind the middle arch
  arcade(k, -17, 0.4, 17, 0.4, { color: S, roofColor: R }); arcade(k, -14, -3.8, -14, -14, { color: S, roofColor: R, depth: 1.6 }); arcade(k, 14, -3.8, 14, -14, { color: S, roofColor: R, depth: 1.6 });
  // the museum on the west side of Palm Drive, with bronzes in its garden
  k.box(-22, 36, 16, 7, 6.5, { color: 0xe4dccb, roof: 'flat', roofColor: C.stone, win: 'tall', plain: true }); portico(k, -22, 31.6, 8, 6, 5.4, { rot: Math.PI, color: 0xe4dccb, steps: 3 }); k.label('Cantor Arts Center', -22, 11, 36);
  for (const [x, z] of [[-33, 30], [-31, 33], [-34, 36]]) { const f = k.statueFigure(0x4a4a44, 1); f.position.set(x, 0, z); k.g.add(f); } k.sign(-33, 27.6, 'Rodin Garden');
  // the stadium, the engineering quad with its round hall, and the radio dish up in the golden foothills
  stadium(k, 32, 34, 11, 8.5, { h: 4.5, color: 0xcfc7b8 }); k.label('Stanford Stadium', 32, 8.5, 34);
  k.cyl(-38, -8, 4, 7, { color: S, roof: 'cone', roofColor: R, seg: 14, roofH: 2.4 }); k.box(-38, -20, 10, 8, 7, { color: S, roof: 'hip', roofColor: R, win: 'grid', plain: true }); k.box(-38, 4, 10, 7, 6, { color: S, roof: 'hip', roofColor: R, win: 'grid', plain: true }); k.label('Engineering Quad', -38, 12.5, -8);
  for (const [x, z, rx, h] of [[-30, -44, 20, 5], [8, -45, 22, 6.5], [38, -43, 14, 4.5]]) hill(k, x, z, rx, 7, h, k.snowCaps() ? 0xb9c08a : 0xcdb96a);
  { const st = k.mesh(new THREE.CylinderGeometry(0.3, 0.5, 4, 6), 0xe9e6dc); st.position.set(8, 7.5, -44); const d = k.mesh(new THREE.SphereGeometry(3, 14, 6, 0, Math.PI * 2, 0, 1.0), 0xf4f2ec, { side: THREE.DoubleSide }); d.position.set(8, 12.3, -44); d.rotation.set(Math.PI + 0.5, 0, 0.2); }
  k.label('The Dish', 8, 16.5, -44);
  k.box(32, -4, 10, 8, 7, { color: S, roof: 'hip', roofColor: R, win: 'grid', plain: true }); k.sign(32, 0.8, 'Hoover Institution'); k.box(34, 14, 12, 7, 5.5, { color: S, roof: 'hip', roofColor: R, win: 'grid', plain: true }); fountain(k, 20, 14, 1.6); k.sign(22.6, 15.6, 'White Plaza');
  k.path([P(16, 3), P(20, 10), P(27, 14)], 1.5, 0xe4d3ae); k.path([P(-16, 3), P(-32, 2)], 1.5, 0xe4d3ae); k.path([P(-10, 20), P(-18, 28), P(-22, 30)], 1.5, 0xe4d3ae); k.path([P(10, 20), P(22, 28)], 1.5, 0xe4d3ae);
  for (const [x, z] of [[-12, 30], [12, 30], [-8, 40], [8, 40], [-30, 16], [28, 22], [-44, 12], [42, 4]]) k.tree(x, z, 'palm'); k.grove(-40, 22, 10, 10, 6); k.grove(40, -20, 10, 14, 6); k.grove(-12, -30, 14, 8, 6); k.grove(12, -30, 10, 8, 4); k.grove(14, 42, 6, 8, 3); k.grove(-42, 40, 6, 10, 4);
  life(k, [[P(0, 44), P(0, 24)], [P(16, 3), P(20, 10), P(26, 14), P(20, 10)], [P(-10, 20), P(-18, 28), P(-22, 30.6), P(-18, 28)], [P(0, 6), P(0, 3), P(-16, 3), P(-21, -10), P(-16, 3), P(16, 3), P(0, 3)], [P(-12, 14), P(0, 22), P(12, 14), P(0, 6.4)]], { line: [[0, 5.6], [0, 3], [-16, 3], [-21.6, -11.6]], bikes: 3, tour: [6, -8], drone: true });
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
  k.label('Monopteros', 20, 9, -4); k.label('English Garden', 14, 3.5, 12); k.sign(9.6, 15.4, 'Eisbach');
  // Ludwigstraße past the university square: the Siegestor at its head, the twin towers of the Ludwigskirche further down
  road(k, [P(-30, -48), P(-30, 48)], 3.2, 0x9a958a); k.sign(-28, -26, 'Ludwigstr.');
  for (const sx of [-1, 1]) block(k, -30 + sx * 3.4, 0, -36, 1.6, 6, 2.4, 0xe9e2d0); block(k, -30, 6, -36, 9, 1.6, 2.6, 0xe9e2d0); for (const sx of [-1, 0, 1]) block(k, -30 + sx * 1.7, 0, -36, 0.5, 6, 2.2, 0xe9e2d0);
  { const q = k.statueFigure(0x5f7a6a, 1.1); q.position.set(-30, 7.6, -36); k.g.add(q); } k.label('Siegestor', -30, 12.5, -36);
  k.box(-39, -8, 7, 14, 7, { color: 0xe9e2d0, roof: 'gable', roofColor: 0x8a8f96, win: 'tall', plain: true }); for (const z of [-11, -5]) steeple(k, -34.6, z, 2.4, 12, { color: 0xe9e2d0, kind: 'spire', capColor: 0xe9e2d0, trim: 0xe9e2d0 }); k.label('Ludwigskirche', -37, 19, -8);
  k.box(-39, -26, 7, 14, 7, { color: 0xd9c9a8, roof: 'hip', roofColor: C.red, win: 'tall', plain: true }); k.sign(-34.6, -26, 'State Library');
  // the Chinese Tower in the garden, with the benches of its beer garden
  for (let i = 0; i < 5; i++) { const s = 3.6 - i * 0.55; block(k, 34, i * 2.1, 22, s * 0.6, 1.6, s * 0.6, 0x8a5a3c); const r = k.mesh(new THREE.ConeGeometry(s * 0.95, 0.7, 12), 0x5a4636); r.position.set(34, i * 2.1 + 1.9, 22); }
  k.obstacles.push({ x0: 32.4, x1: 35.6, z0: 20.4, z1: 23.6 }); for (let i = 0; i < 6; i++) block(k, 27 + (i % 3) * 2.2, 0.35, 26 + Math.floor(i / 3) * 2.2, 1.6, 0.12, 0.6, 0xc98a3a); k.label('Chinese Tower', 34, 13, 22);
  // the old town to the south-west: the Frauenkirche's two onion domes, the town hall's Gothic front on Marienplatz
  k.box(-14, 40, 14, 7, 9, { color: 0xb5654a, roof: 'gable', roofColor: 0x9a5340, win: 'tall', plain: true }); for (const z of [37.6, 42.4]) steeple(k, -22.6, z, 3.2, 17, { color: 0xb5654a, kind: 'dome', capColor: 0x6fa59a, trim: 0xb5654a }); k.label('Frauenkirche', -20, 26, 40);
  gothic(k, 8, 42, 16, 5, 7, { color: 0xb9ad98 }); steeple(k, 8, 39.4, 2.8, 14, { color: 0xb9ad98, kind: 'crown', capColor: 0xb9ad98, clock: true }); k.plaza(8, 35, 16, 5, 0xd9d2c2); k.label('Town Hall', 8, 22, 40);
  terrace(k, -40, 32, -40, 46, { n: 4, h: 5.5, depth: 5, colors: [0xf1e8d2, 0xe9d2a8, 0xd9b08a], roof: 'gable', roofColor: C.red }); terrace(k, 22, 46, 36, 46, { n: 4, h: 5.5, depth: 4, colors: [0xe9d2a8, 0xf1e8d2, 0xd9b08a], roof: 'gable', roofColor: 0x9a5340 });
  // the Alte Pinakothek near the technical university
  k.box(-40, 16, 6, 22, 7, { color: 0xb07a55, roof: 'hip', roofColor: C.slate, win: 'tall', plain: true }); k.lawn(-34.4, 16, 3.4, 18); k.label('Alte Pinakothek', -40, 11.5, 16);
  k.path([P(-25, -3), P(-28.4, -3)], 1.6); k.path([P(-12, 17.4), P(-10, 28), P(8, 33)], 1.6); k.path([P(18, 2), P(30, 20)], 1.5); k.path([P(-10, 28), P(-18, 34.6)], 1.5);
  k.grove(34, -6, 16, 20, 12); k.grove(34, -32, 16, 20, 12); k.grove(4, -34, 20, 16, 10); k.grove(40, 36, 8, 12, 5); k.row(-27.6, -44, -27.6, 44, 14); k.grove(-12, -34, 12, 10, 5);
  life(k, [[P(-28.4, -40), P(-28.4, 40)], [P(18, 2), P(30, 20), P(28, 27), P(30, 20)], [P(-12, 18), P(-10, 28), P(8, 33.4), P(-10, 28)], [P(-4, 6), P(-10, 0), P(-12, -8), P(-10, 0)], [P(-2, 8), P(10, 4), P(18, 4), P(24, 14), P(12, 18), P(10, 4)], [P(-24, -1), P(0, -1)]], { tour: [14, 8], families: 3, bikes: 2 });
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
  k.water(0, 40, 96, 16); k.boat(-6, 38, 12, 2, 0.2); k.boat(26, 42, 9, 2, 0.16); k.boat(-30, 43, 8, 1.6, 0.24);
  const cols = [0xf1e8d2, 0xe9d2a8, 0xf4f2ec, 0xd9c9a8];
  for (let i = 0; i < 9; i++) k.box(-24 + i * 4.6, 18 + (i % 2) * 1.6, 4, 4.4, 5 + (i % 3), { color: cols[i % 4], roof: 'gable', roofColor: i % 2 ? C.red : 0x9a5340 });
  k.tower(-12, 12, 2.6, 13, { color: 0xcfc7b8, cap: 'spire', capColor: C.copper }); k.tower(6, 12, 2.6, 12, { color: 0xcfc7b8, cap: 'belfry', capColor: C.slate });
  k.grove(-24, 6, 8, 8, 5, ['round', 'cone']); k.grove(26, -4, 6, 10, 4, 'cone');
  k.door = { x: -2, z: -4.6 }; k.spawn = { x: 2, z: 10 };
  k.path([P(2, 10), P(0, 4), P(-2, -4)], 1.8, 0xd6cfc0);
  k.label('Polyterrasse', -2, 5, -1.6); k.label('Lake Zurich', 14, 3, 41); k.sign(22.6, 16, 'Polybahn');
  // the University of Zurich next door, under its own tower
  k.box(34, -12, 14, 9, 8, { color: 0xd9cdb0, roof: 'hip', roofColor: C.red, win: 'tall', plain: true }); steeple(k, 30, -6, 3.6, 15, { color: 0xd9cdb0, kind: 'dome', capColor: 0x6fa59a, trim: 0xd9cdb0 }); k.label('University of Zurich', 33, 23, -8);
  // the Limmat running out of the lake through the old town; the two towers of the Grossmünster on one bank, a slim green spire on the other
  k.river([P(-30, 33), P(-31, 14), P(-34, -14), P(-32, -48)], 4); for (const z of [22, 4, -20]) bridge(k, -36, z, -27.4, z, 2.4, C.stone);
  k.box(-20, 27.5, 9, 6, 7, { color: 0xcfc7b8, roof: 'gable', roofColor: C.slate, win: 'tall', plain: true }); for (const z of [25.6, 29.4]) steeple(k, -25.6, z, 2.6, 12, { color: 0xcfc7b8, kind: 'dome', capColor: 0x8fa39a, trim: 0xcfc7b8 }); k.label('Grossmünster', -23, 19.5, 27.5);
  k.box(-41, 26, 6, 9, 6, { color: 0xcfc7b8, roof: 'gable', roofColor: C.slate, win: 'tall', plain: true }); steeple(k, -41, 20.4, 2.4, 9, { color: 0xcfc7b8, kind: 'spire', capColor: 0x6fa59a, trim: 0xcfc7b8, clock: true }); k.sign(-41, 31.6, 'Fraumünster');
  for (let i = 0; i < 8; i++) k.box(-8 + i * 4.8, 26.5 + (i % 2), 4.2, 4.4, 5 + (i % 3), { color: cols[(i + 1) % 4], roof: 'gable', roofColor: i % 2 ? 0x9a5340 : C.red }); terrace(k, -41, -40, -41, 12, { n: 9, h: 5.5, depth: 5, colors: cols, roof: 'gable', roofColor: C.red });
  // the station across the river, and the trams
  k.box(-41.5, -42, 9, 6, 6, { color: 0xd9cdb0, roof: 'hip', roofColor: C.slate, win: 'tall', plain: true }); k.sign(-36, -42, 'Hauptbahnhof');
  road(k, [P(-27, 8.4), P(46, 8.4)], 2.6, 0x8a8478); k.vehicle([P(-25, 8.4), P(44, 8.4)], { color: 0x2f6fb5, len: 6.4, h: 1.9, stripe: 0xf4f2ec, speed: 4.5 });
  k.path([P(2, 10), P(2, 24)], 1.6, 0xd6cfc0); k.path([P(-27.4, 22), P(-12, 22.6), P(2, 22)], 1.6, 0xd6cfc0); k.path([P(20, 21), P(20, 31)], 1.5, 0xd6cfc0); k.path([P(-22, 31.4), P(40, 31.4)], 2, 0xd6cfc0);
  k.grove(38, 4, 10, 4, 4, ['round', 'cone']); k.grove(-20, -30, 14, 20, 10, ['round', 'cone']); k.grove(36, 22, 10, 6, 4); k.grove(8, -34, 30, 10, 12, ['cone', 'round']); k.row(-20, 33.6, 42, 33.6, 14);
  life(k, [[P(-20, 31.4), P(38, 31.4)], [P(2, 11), P(2, 22), P(-12, 22.6), P(-26, 22), P(-12, 22.6), P(2, 22)], [P(-24, 10.2), P(42, 10.2)], [P(2, 10), P(0, 4), P(-2, -3), P(0, 4)], [P(-14, 0), P(12, 0)], [P(-20, 14), P(-4, 14.5), P(14, 14), P(-4, 14.5)]], { tour: [-9, 0.4], bikes: 0 });
}

export function cambridge(k) {
  k.ground();
  // the University Library: a long brick front and a tower you can see for miles
  k.box(-10, -14, 26, 7, 8, { color: 0xb07a55, roof: 'flat', roofColor: C.dark, win: 'tall' }); k.box(-10, -14, 6, 7.4, 22, { color: 0xb07a55, roof: 'hip', roofColor: C.dark, win: 'tall', solid: false });
  k.label('University Library', -10, 26, -14); k.lawn(-10, -5, 22, 8);
  // the river, the punts and a stone bridge
  k.river([P(-48, 6), P(-30, 8), P(-12, 10), P(6, 7), P(30, 11), P(48, 9)], 4); bridge(k, 0, 4.4, 0, 12, 2.4, C.lime);
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
  k.label('King’s College Chapel', 14, 17, 18); k.label('River Cam', -34, 3, 8); k.sign(-10, 14.2, 'The Backs');
  // more bridges: the covered one at St John's, the wooden one at Queens'
  bridge(k, -34, 4, -34, 11.6, 2.2, C.lime); block(k, -34, 1, 7.8, 2.2, 2, 7, 0xd8cdb6); { const r = k.mesh(new THREE.CylinderGeometry(0.01, 1, 1, 3, 1).rotateY(Math.PI / 2), C.slate); r.scale.set(4, 0.9, 1.4); r.position.set(-34, 3.45, 7.8); r.rotation.y = Math.PI / 2; } k.sign(-31, 13, 'Bridge of Sighs');
  bridge(k, 30, 7, 30, 15, 2, C.wood); for (let i = 0; i < 5; i++) { const s = block(k, 31, 0.8, 8 + i * 1.5, 0.1, 0.1, 2.2, C.wood); s.rotation.x = i % 2 ? 0.5 : -0.5; } k.sign(33, 16.4, 'Mathematical Bridge');
  // the colleges on the town side: Trinity's Great Court with its fountain, St John's, the Senate House, Great St Mary's
  quad(k, -18, 34, 22, 18, { t: 3.4, h: 6, color: 0xd8cdb6, roofColor: C.slate, win: 'tall', open: 'e', gap: 3 }); fountain(k, -18, 34, 1.5); steeple(k, -7.4, 34, 3, 8, { color: 0xd8cdb6, kind: 'flat' }); k.label('Trinity Great Court', -18, 10.5, 34);
  quad(k, -39, 30, 14, 16, { t: 3.2, h: 6, color: 0xb5654a, roofColor: C.slate, win: 'tall', open: 'e', gap: 3 }); k.sign(-39, 39.6, 'St John’s');
  k.box(-22, 19.6, 4, 9, 6.5, { color: 0xd8cdb6, roof: 'flat', roofColor: C.stone, win: 'tall', plain: true }); k.sign(-22, 14.4, 'Wren Library');
  k.box(4, 32, 12, 5, 6.5, { color: 0xf0ede6, roof: 'flat', roofColor: C.stone, win: 'tall', plain: true }); colonnade(k, 4, 35, 6, 4, 5.4, { color: 0xf0ede6, depth: 1.2 }); k.label('Senate House', 4, 11, 32);
  k.box(22, 33, 8, 5, 6, { color: 0xd8cdb6, roof: 'gable', roofColor: C.slate, win: 'tall', plain: true }); steeple(k, 16.4, 33, 3, 11, { color: 0xd8cdb6, kind: 'flat', clock: true }); k.sign(22, 36.6, 'Great St Mary’s');
  k.cyl(36, 36, 3.4, 5, { color: 0xc9b89a, roof: 'cone', roofColor: C.slate, seg: 14, roofH: 3 }); k.sign(36, 40.6, 'Round Church'); terrace(k, -4, 44, 40, 44, { n: 9, h: 5, depth: 4.6, colors: [0xd8cdb6, 0xb5654a, 0xe9dfc8, 0xc9b89a], roof: 'gable', roofColor: C.slate });
  k.path([P(-6, 27.6), P(42, 27.6)], 2.2, 0xcfc8ba); k.sign(12, 26, 'King’s Parade');
  // the west side: the mathematicians' grass-roofed pavilions and the physics laboratory, with meadows down to the river
  for (const [x, z] of [[-40, -34], [-32, -40], [-24, -34], [-32, -28]]) k.box(x, z, 6, 6, 5, { color: 0xc9a67a, roof: 'green', win: 'bands', plain: true }); k.cyl(-32, -34, 2.6, 6, { color: 0xc9a67a, roof: 'dome', roofColor: C.copper, seg: 12 }); k.label('Centre for Mathematical Sciences', -32, 11, -34);
  k.box(38, -34, 14, 8, 6, { color: 0xcfcac0, roof: 'flat', roofColor: 0x9a968c, win: 'bands' }); k.sign(38, -28.6, 'Cavendish Laboratory'); k.sign(18, -20, 'William Gates Building');
  k.path([P(2, 1), P(-12, 3), P(-34, 3.4)], 1.5); k.path([P(-4, -3), P(-22, -26), P(-27, -30)], 1.5); k.path([P(18, -8), P(32, -22), P(38, -29)], 1.5); k.path([P(0, 12), P(0, 27.6)], 1.6); k.path([P(30, 15), P(30, 27.6)], 1.4);
  k.grove(38, -6, 12, 18, 8); k.grove(-38, -8, 10, 14, 6); k.grove(0, -38, 30, 12, 12); k.row(-46, 13.4, -38, 13.6, 3); k.row(-28, 3, 40, 3.4, 12); k.grove(36, 20, 8, 6, 4); k.grove(-30, 44.6, 20, 1.5, 5);
  life(k, [[P(-4, 27.6), P(40, 27.6)], [P(2, 1), P(-12, 3), P(-33, 3.4), P(-12, 3)], [P(-4, -3), P(-22, -26), P(-27, -30), P(-22, -26)], [P(0, 13), P(0, 27), P(30, 27), P(30, 15), P(30, 27), P(0, 27)], [P(2, 1), P(-4, -3), P(-10, -8), P(-4, -3)], [P(2, 1), P(12, -6), P(18, -7), P(12, -6)], [P(-20, 14), P(-4, 14), P(0, 12), P(0, 4.4), P(0, 12), P(-4, 14)]], { tour: [-4, 17], bikes: 3 });
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
  rails(k, 26, -48, 26, 14); train(k, 26, -28, 26, 12, 3);
  k.box(20.6, 2, 5, 22, 5, { color: 0xd8d2c4, roof: 'green', win: 'bands' }); k.glass(17.6, 2, 1, 18, 5); k.label('Platform 37', 20.6, 9, 2);
  egg(k, 'platform37', 23.8, -4, 'post', 0x1c2b4a);
  k.river([P(-48, 41), P(-22, 35), P(-6, 30), P(4, 22), P(14, 19), P(30, 20), P(48, 24)], 3); const nb = k.mesh(new THREE.BoxGeometry(1.2, 0.8, 4.6), 0x2f6f5a); k.anim.push((t) => { const u = (t * 0.015) % 1; nb.position.set(-2 + u * 28, 0.4, 24.5 - u * 5); nb.rotation.y = 1.3; });
  k.box(4, -16, 12, 10, 6, { color: 0xb5553f, roof: 'shed', win: 'bands' }); k.box(1, -12, 8, 6, 4, { color: 0xb5553f, roof: 'flat', roofColor: C.slate, win: 'bands' }); k.tower(9.4, -11, 2, 11, { color: 0xb5553f, cap: 'belfry', capColor: C.slate }); k.sign(2, -7.4, 'British Library');
  // a red bus on the long road between the two quarters
  k.path([P(-6, -30), P(-2, 14), P(2, 30)], 3.4, 0xb8b2a6); k.vehicle([P(-5.6, -26), P(-2.2, 12)], { color: 0xc0392b, len: 5, h: 2.6, w: 1.7, stripe: 0xf4f2ec, speed: 4.4 });
  k.rooms = [{ x: -16.6, z: 2.6, label: 'Birkbeck', ids: ['I-22'] }, { x: -14, z: 13.6, label: 'University College', ids: ['I-23'] }, { x: 16.4, z: 4, label: 'Platform 37', ids: ['III-16', 'III-17', 'III-18'] }]; k.door = k.rooms[0]; k.spawn = { x: 2, z: 8 };
  k.path([P(2, 8), P(-8, 6), P(-16, 3)], 1.8); k.path([P(-8, 6), P(-13, 12.4)], 1.6); k.path([P(2, 8), P(15.6, 5)], 1.8); k.plaza(8, 7, 14, 8, 0xcfc8ba);
  k.label('Senate House', -20, 22, -14); k.sign(8.6, -9.4, 'British Library'); k.sign(17.2, -10.6, 'King’s Cross'); k.label('Regent’s Canal', 34, 3, 21);
  k.path([P(-8, -48), P(-6, -30)], 3.4, 0xb8b2a6); k.path([P(2, 30), P(3, 48)], 3.4, 0xb8b2a6);
  // St Pancras: a red Gothic front with a clock tower, the great train shed behind it
  hangar(k, 8, -38, 11, 16, 6.5, 0x8fa9b5); gothic(k, 8, -28, 13, 3.6, 8, { color: 0xa8443a, pin: false }); steeple(k, 15.4, -28, 2.8, 15, { color: 0xa8443a, kind: 'spire', capColor: C.slate, trim: 0xa8443a, clock: true }); k.label('St Pancras', 10, 22, -28);
  // the British Museum: a long front of columns under a pediment, the round reading room's dome in its court
  k.box(-32, -36, 24, 9, 7, { color: 0xe4dccb, roof: 'flat', roofColor: C.stone, win: 'tall', plain: true }); portico(k, -32, -30.6, 18, 12, 6, { color: 0xe4dccb, steps: 3 }); dome(k, -32, -36, 4.4, 7, { color: 0x8fa39a, drumColor: 0xe4dccb, lantern: false, squash: 0.7 }); k.label('British Museum', -32, 14.5, -36);
  // the squares and terraces of Bloomsbury, and the tower over Fitzrovia
  k.lawn(-37, -16, 12, 12); k.grove(-37, -16, 10, 10, 7); k.sign(-37, -9, 'Russell Square'); terrace(k, -45, -6, -45, 30, { n: 8, h: 5.5, depth: 4.4, colors: [0x8a6a58, 0x9a7460, 0x7a5a4a] }); terrace(k, -34, 26, -12, 26, { n: 6, h: 5.5, depth: 4.4, colors: [0x9a7460, 0x8a6a58, 0xe4dccb] });
  for (const z of [10, 22]) k.box(-31, z, 5, 5.4, 6, { color: 0xe4dccb, roof: 'flat', roofColor: C.stone, win: 'tall', plain: true });
  k.cyl(-38, 38, 1.3, 22, { color: 0xcfd6da, roof: 'none', seg: 12 }); k.cyl(-38, 38, 2.1, 4.5, { color: 0xb8c2cc, roof: 'flat', roofColor: C.steel, y: 15.5, solid: false, seg: 14 }); block(k, -38, 22, 38, 0.2, 5, 0.2, C.steel); k.label('BT Tower', -38, 29.5, 38);
  // north of the canal: the granary, its square of fountains, the frames of the old gasholders
  k.box(38, 30, 12, 6, 8, { color: 0xb5804a, roof: 'flat', roofColor: C.slate, win: 'grid', plain: true }); k.plaza(38, 37.5, 14, 7, 0xcfc8ba); for (const x of [34, 38, 42]) fountain(k, x, 38, 0.8); k.label('Granary Square', 38, 12, 31);
  for (const [x, z] of [[14, 34], [22, 38]]) { for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; block(k, x + Math.cos(a) * 3.6, 0, z + Math.sin(a) * 3.6, 0.2, 7, 0.2, 0x4a5058); } for (const y of [3.6, 7]) { const t = k.mesh(new THREE.TorusGeometry(3.6, 0.1, 5, 20).rotateX(Math.PI / 2), 0x4a5058); t.position.set(x, y, z); } k.disc(x, z, 3.2, k.season.lawn, 0.04); k.obstacles.push({ x0: x - 3.9, x1: x + 3.9, z0: z - 3.9, z1: z + 3.9 }); }
  k.label('Gasholder Park', 18, 10, 36);
  hangar(k, -18, -40, 9, 12, 7.5, 0xc98a5a); k.sign(-18, -33, 'Francis Crick Institute'); k.box(38, -10, 10, 14, 9, { color: 0xb8c2cc, roof: 'flat', roofColor: C.steel, win: 'bands', plain: true }); k.glass(38, 8, 9, 8, 12); k.sign(32, 10, 'Pancras Square');
  k.path([P(15.6, 5), P(15.6, 16.4)], 1.6); bridge(k, 15.6, 16.6, 15.6, 22, 2, C.steel); k.path([P(15.6, 22), P(20, 28), P(36, 34)], 1.6); k.path([P(-16, 3), P(-28, 4), P(-42, 4)], 1.5); k.path([P(-20, -9.6), P(-24, -22), P(-32, -27)], 1.5); k.path([P(-5, -24), P(1, -26), P(8, -25.6)], 1.6);
  k.grove(-10, 38, 14, 8, 6); k.grove(40, 46, 10, 2, 3); k.row(-46, 44.6, -24, 39, 6); k.grove(34, -34, 10, 20, 8); k.grove(-9, -6, 4, 12, 4);
  life(k, [[P(15.6, 6), P(15.6, 16), P(15.6, 22), P(20, 28), P(34, 34), P(20, 28), P(15.6, 22)], [P(-16, 4), P(-28, 4), P(-41, 4), P(-28, 4)], [P(-20, -9), P(-24, -22), P(-31, -27), P(-24, -22)], [P(2, 8), P(-8, 6), P(-15.6, 3.6), P(-8, 6), P(-13, 12), P(-8, 6)], [P(2, 8), P(14.6, 5), P(14.6, -6), P(14.6, 5)], [P(4, 12), P(12, 11), P(12, 15), P(4, 15)]], { line: [[2, 8], [-8, 6], [-16, 3]], tour: [9, 8], bikes: 2 });
}

export function cranfield(k) {
  k.ground({ color: undefined });
  // the airfield: a runway, two hangars and a tower
  k.patch(0, -18, 95, 6, 0x6f747a, 0.03); for (let i = 0; i < 20; i++) k.patch(-43.6 + i * 4.6, -18, 2.2, 0.3, 0xf4f2ec, 0.045);
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
  k.label('Cranfield Airport', 0, 4, -24); k.label('College of Aeronautics', -14, 10.5, 10);
  // the far side of the airfield: the solar farm, then fields
  for (const [x, z] of [[-30, -32], [-12, -32], [-30, -40], [-12, -40]]) k.box(x, z, 15, 6, 0.4, { color: C.concrete, roof: 'solar', win: 'none', plain: true }); k.sign(-21, -27.4, 'Solar farm');
  for (const [x, z, w, d, c] of [[22, -36, 34, 18, 0xd9c46a], [-41, 40, 12, 14, 0xc9b25a], [41, 42, 12, 10, 0xa8b86a]]) { k.patch(x, z, w, d, c, 0.025, 0, false); k.hedge(x - w / 2, z - d / 2, x + w / 2, z - d / 2); k.hedge(x - w / 2, z + d / 2, x + w / 2, z + d / 2); }
  // the research hangars along the apron, and the airliner that is a classroom now
  hangar(k, -26, -4, 14, 10, 7, 0xd9dde2); k.label('Aerospace Integration Research Centre', -26, 10, -4);
  k.glass(38, -3, 12, 8, 6.5); k.box(38, 3.6, 12, 4, 4, { color: 0xd9dde2, roof: 'flat', roofColor: C.steel, win: 'bands', plain: true }); k.label('DARTeC', 38, 10, -3); k.patch(30, -10, 22, 8, 0x868b90, 0.028);
  { const b = plane(k, 31, 0.9, -10, 2.1); b.rotation.y = 0.2; } k.sign(31, -5.6, 'Boeing 737');
  // the library that the university built later: a glass box under four shallow vaults
  k.glass(-34, 16, 11, 9, 4.6); for (let i = 0; i < 4; i++) { const v = k.mesh(new THREE.CylinderGeometry(1.7, 1.7, 11.6, 10, 1, false, 0, Math.PI).rotateZ(Math.PI / 2).rotateY(Math.PI / 2), 0xe9ecef); v.scale.y = 0.45; v.position.set(-39.1 + i * 3.4, 4.7, 16); } k.label('Kings Norton Library', -34, 9, 16);
  // halls of residence, the technology park, and the village church across the fields
  for (const x of [-22, -8, 6]) k.box(x, 36, 11, 6, 5, { color: C.brick, roof: 'gable', roofColor: C.slate, win: 'grid', plain: true }); k.sign(-8, 40.4, 'Halls of residence');
  k.box(36, 26, 14, 9, 5, { color: 0xd9dde2, roof: 'flat', roofColor: C.steel, win: 'bands' }); k.sign(36, 31.6, 'Technology Park');
  k.box(26, 42, 8, 4.4, 5, { color: 0xc9b89a, roof: 'gable', roofColor: C.slate, win: 'tall', plain: true }); steeple(k, 20.6, 42, 2.8, 8, { color: 0xc9b89a, kind: 'flat' }); k.sign(26, 45.6, 'Cranfield village');
  k.path([P(2, 20), P(2, 31), P(-8, 32.6)], 1.5); k.path([P(-12, 3), P(-24, 6), P(-34, 11)], 1.5); k.path([P(10, 8), P(24, 6), P(36, 6.4)], 1.5); k.path([P(2, 31), P(22, 36), P(30, 30)], 1.4);
  k.grove(-40, -8, 6, 10, 4); k.grove(14, 28, 8, 6, 4); k.row(-46, 26, -46, 46, 0); k.grove(-34, 28, 8, 6, 4); k.grove(8, -42, 6, 6, 3);
  life(k, [[P(2, 21), P(2, 31), P(-8, 32.6), P(2, 31), P(22, 36), P(2, 31)], [P(-12, 3.6), P(-24, 6), P(-33, 10.6), P(-24, 6)], [P(2, 20), P(0, 8), P(-12, 3.4), P(0, 8)], [P(-22, 17), P(-2, 17), P(18, 18), P(-2, 17)], [P(0, 8), P(10, 7.6), P(20, 6), P(10, 7.6)]], { tour: [4, 2.4], bikes: 1 });
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
  rails(k, -48, 28.5, 48, 28.5); k.vehicle([P(-44, 28.5), P(44, 28.5)], { color: 0x2f7d5b, len: 6, h: 1.9, stripe: 0xe2b23a, speed: 5 });
  k.door = { x: -6, z: -10.4 }; k.spawn = { x: 0, z: 14 };
  k.path([P(0, 14), P(-2, 4), P(-6, -10)], 1.8); k.path([P(-2, 4), P(12, 2)], 1.6); k.path([P(-2, 4), P(-14, 4)], 1.6);
  k.label('The Forum', -2, 3.5, -3);
  // round the Forum: the main library, the round Religious Centre, the Campus Centre
  k.box(26, 12, 14, 8, 6.5, { color: 0xcfc7b8, roof: 'flat', roofColor: 0x9a968c, win: 'bands' }); k.label('Sir Louis Matheson Library', 26, 10.5, 12);
  k.cyl(-32, -8, 4.6, 3.2, { color: 0xb5654a, roof: 'flat', roofColor: 0x6f5a4a, seg: 18 }); k.cyl(-32, -8, 2, 2.2, { color: 0xb5654a, roof: 'cone', roofColor: 0x6f5a4a, y: 3.2, solid: false, seg: 12, roofH: 1.4 }); k.label('Religious Centre', -32, 9, -8);
  k.box(-28, -24, 14, 8, 5, { color: C.concrete, roof: 'flat', roofColor: C.dark, win: 'bands' }); k.sign(-28, -19.4, 'Campus Centre');
  // the newer buildings: the Learning and Teaching Building in timber and colour, the engineers' long shed under solar panels, the Chancellery
  k.box(-32, 14, 15, 10, 7, { color: 0xc98a3a, roof: 'solar', win: 'bands' }); for (const [z, c] of [[10.5, 0xd24d3e], [14, 0xe2b23a], [17.5, 0x4f9a54]]) block(k, -24.3, 1, z, 0.3, 5, 2.4, c); k.label('Learning and Teaching Building', -32, 11.5, 14);
  k.box(10, -34, 22, 8, 7.5, { color: 0xb8c2cc, roof: 'solar', win: 'bands' }); k.label('Woodside Building', 10, 11.5, -34);
  k.glass(36, -18, 9, 12, 7); k.box(36, -18, 9.6, 12.6, 0.5, { color: C.wood, roof: 'none', win: 'none', y: 7, solid: false }); k.sign(30.4, -12, 'Chancellery');
  // the sports oval with its four white posts at each end, and the round hall of the synchrotron across the road
  k.disc(34, -38, 1, k.season.lawn, 0.035).scale.set(10, 1, 7); { const ring = k.mesh(new THREE.TorusGeometry(1, 0.012, 4, 40).rotateX(Math.PI / 2), 0xf4f2ec); ring.scale.set(9.8, 1, 6.8); ring.position.set(34, 0.06, -38); ring.castShadow = false; }
  for (const sx of [-1, 1]) for (const [dz, h] of [[-1.5, 2], [-0.5, 3.4], [0.5, 3.4], [1.5, 2]]) block(k, 34 + sx * 9.4, 0, -38 + dz, 0.1, h, 0.1, 0xf4f2ec); k.label('Sports oval', 34, 5.5, -38);
  road(k, [P(-22, -48), P(-22, -31), P(-48, -31)], 2.8); k.cyl(-36, -40, 6.4, 3.2, { color: 0xe9ecef, roof: 'flat', roofColor: 0xd9dde2, seg: 22 }); k.cyl(-36, -40, 2.4, 1.6, { color: 0xb8c2cc, roof: 'flat', roofColor: C.steel, y: 3.2, solid: false, seg: 14 }); k.label('Australian Synchrotron', -36, 8.5, -40);
  // the bus interchange by the line
  k.plaza(-10, 22.5, 22, 5, 0xcfc8ba); for (const x of [-18, -10, -2]) { block(k, x, 2.4, 22.5, 5, 0.2, 2.6, C.steel); block(k, x - 2, 0, 22.5, 0.15, 2.4, 0.15, C.steel); block(k, x + 2, 0, 22.5, 0.15, 2.4, 0.15, C.steel); } k.sign(-10, 25.6, 'Transport interchange');
  k.path([P(12, 2), P(24, 7.4)], 1.5); k.path([P(-14, 4), P(-24, 8), P(-28, -3.4)], 1.5); k.path([P(-6, -10), P(-18, -18), P(-28, -19.4)], 1.5); k.path([P(0, 14), P(-4, 20)], 1.6); k.path([P(10, -17), P(10, -29.6)], 1.5); k.path([P(18, 2), P(31, -12)], 1.4);
  for (const [x, z, w, d, n] of [[38, 30, 14, 26, 12], [-40, 36, 12, 16, 8], [-10, 38, 40, 12, 14], [-8, -42, 10, 8, 5], [40, 0, 8, 12, 5], [-42, 2, 6, 8, 3]]) for (let i = 0; i < n; i++) k.tree(x + k.r.range(-w / 2, w / 2), z + k.r.range(-d / 2, d / 2), 'gum', k.r.range(1, 1.4));
  life(k, [[P(12, 3), P(24, 7.4), P(12, 3), P(18, 2), P(30, -11), P(18, 2)], [P(-14, 5), P(-24, 8), P(-28, -3), P(-24, 8)], [P(-18, 20.4), P(-2, 20.4)], [P(0, 14), P(-2, 4), P(-6, -9), P(-2, 4)], [P(-14, 5), P(12, 3)], [P(-12, 16), P(2, 15), P(14, 14), P(2, 15)]], { tour: [4, -1], drone: true });
}

export const PLACES_ONE = { yale, princeton, harvard, mit, illinois, rensselaer, gottingen, maryland, edinburgh, wisconsin, stanford, munich, eth, cambridge, london, cranfield, monash };
