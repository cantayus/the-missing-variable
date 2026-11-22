// Deckle and the Stacks: the one invented place.
import { C } from './kit.js';
import { rails, bridge, chimney, shelfRing, sitters, train, fountain, life, egg, THREE, colonnade, hill, statue, stairs, hangar, plane, mountains, block, dome, portico, cupola, steeple, quad, arcade, gothic, chapel, gate, needle, stadium, road, terrace } from './parts.js';

export function deckle(k, flags = {}) {
  k.ground();
  // the river and the weir
  k.river([[-26, -48], [-25, -32], [-24, -12], [-22, 4], [-25, 18], [-27, 32], [-26, 48]], 7);
  const weir = k.mesh(new THREE.BoxGeometry(7.4, 0.5, 0.8), 0xf4f7f9, { transparent: true, opacity: 0.85 }); weir.position.set(-23.6, 0.25, -6);
  k.anim.push((t) => { weir.material.opacity = 0.7 + Math.sin(t * 5) * 0.12; });
  bridge(k, -27.5, 9, -19, 9.6, 2.2, C.wood);
  // the old mill: the Stacks
  k.box(-6, -14, 24, 9, 8, { color: C.brick, roof: 'none', win: 'tall' });
  for (let i = 0; i < 6; i++) { const m = k.mesh(new THREE.CylinderGeometry(0.01, 1, 1, 3, 1), C.slate); m.rotation.z = Math.PI / 2; m.rotation.y = Math.PI / 2; m.scale.set(2.1, 9.2, 1.5); m.position.set(-16 + i * 4, 8.9, -14); }
  chimney(k, -19.5, -17.5, 17, 1.1);
  // terraced reading rooms stepping down toward the plaza
  k.box(-6, -7.6, 20, 4, 5.2, { color: C.lime, roof: 'green', win: 'bands' });
  k.box(-6, -4.2, 16, 3, 3, { color: C.lime, roof: 'green', win: 'bands' });
  k.plaza(-6, 1.2, 18, 7.6);
  // the glass tower of books
  k.box(8.5, -14, 4.2, 4.2, 17, { color: 0xb8683f, roof: 'none', win: 'bands', solid: false });
  k.glass(8.5, -14, 6.4, 6.4, 18.5, { roofColor: C.copper });
  k.label('The Stacks', -6, 13, -12);
  // the retrieval aisles where Folio used to work
  k.box(15.5, -17, 7, 4, 3.2, { color: C.concrete, roof: 'solar', win: 'none' });
  // the rare shelves: dim until the end of the story
  const rare = k.box(-17, -6, 5, 5, 4.2, { color: C.brickDark, roof: 'hip', roofColor: C.copper, win: 'none' });
  const rl = k.mesh(new THREE.BoxGeometry(2.4, 1.6, 0.1), flags.finale ? 0xffe2a0 : 0x5a5f6a, { emissive: flags.finale ? 0xffd27a : 0x000000, emissiveIntensity: flags.finale ? 1.4 : 0 }); rl.position.set(-17, 2, -3.45);
  k.sign(-14.2, -2.6, 'Rare shelves');
  // the children's room: a low round pavilion with a ring of shelves and story hour on the grass
  k.cyl(11, -3.5, 4.2, 2.6, { color: 0xf1e3c0, roof: 'cone', roofColor: 0xe2b23a, roofH: 2, seg: 12 });
  k.lawn(13, 4, 12, 9);
  shelfRing(k, 13, 4.5, 3.6, 7, 0.9);
  sitters(k, 13, 4.5, 6, 1.7, true);
  k.sign(7.6, 1.2, "Children's room");
  // the bindery, with the student's room upstairs
  k.box(22, -6, 7, 6, 4.6, { color: 0xc98a5a, roof: 'gable', roofColor: C.red, win: 'grid' });
  k.box(24.6, -1.9, 2.2, 2.2, 2.6, { color: C.wood, roof: 'gable', roofColor: C.red, win: 'none' });
  k.sign(18.6, -1.6, 'Larch, bookbinders');
  // the junction: tracks, platform and signal box
  rails(k, -48, 24, 48, 24); rails(k, 4, 24, 48, 34.2);
  k.box(4, 20.6, 22, 2.6, 0.55, { color: C.concrete, roof: 'none', win: 'none', solid: false });
  for (const px of [-1.5, 3, 7.5, 9.5]) { const p = k.mesh(new THREE.CylinderGeometry(0.09, 0.09, 3, 6), C.dark); p.position.set(px, 2.1, 19.9); }
  const roofp = k.mesh(new THREE.BoxGeometry(12.6, 0.2, 2.4), C.slate); roofp.position.set(4, 3.7, 19.9);
  k.sign(-4.5, 19.4, 'Deckle Junction');
  for (const px of [26.2, 27.8]) for (const pz of [18.2, 19.8]) { const p = k.mesh(new THREE.CylinderGeometry(0.1, 0.1, 3, 6), C.dark); p.position.set(px, 1.5, pz); }
  k.box(27, 19, 3.2, 3.2, 2.4, { color: C.cream, roof: 'hip', roofColor: C.red, win: 'grid', y: 3, solid: false });
  k.obstacles.push({ x0: 25.6, x1: 28.4, z0: 17.6, z1: 20.4 });
  train(k, -44, 24, 44, 24, 3);
  // paths, light lines, trees and life
  k.path([[4, 19], [4, 10], [-6, 5]], 2); k.path([[4, 10], [14, 9], [22, 0]], 1.6); k.path([[-6, 5], [-19, 9.4]], 1.6); k.path([[22, -2.6], [22, 0]], 1.4);
  k.row(-18, -22, -18, 24, 9, 'round'); k.grove(22, 10, 12, 8, 7); k.grove(-10, 14, 10, 8, 6, 'round'); k.grove(0, -26, 40, 6, 12, ['cone', 'round']);
  fountain(k, -6, 2.4, 1.6);
  k.lamp(-12.5, 5.5); k.lamp(0.6, 5.5); k.lamp(9, 12);
  const loopA = [[4, 18], [4, 10], [-6, 5], [-12, 6], [-19, 9.4], [-12, 6], [-6, 5], [4, 10]], loopB = [[4, 10], [14, 9], [22, 0], [14, 9]], loopC = [[-14, 16], [-2, 14], [8, 15], [18, 14], [8, 15], [-2, 14]];
  k.door = { x: -6, z: -1.6 }; k.spawn = { x: 5, z: 17 };
  // the rest of the town. The High Street, with the market square, the church and the school
  road(k, [[33.4, -46], [33.4, 48]], 2.6, 0x8a8478); k.sign(31, -8, 'High Street');
  const TC = [C.brick, C.lime, C.brickDark, 0xd8c7a6, 0xc98a5a];
  terrace(k, 39.4, -42, 39.4, -12, { n: 7, h: 5, depth: 5, colors: TC, roof: 'gable', roofColor: C.slate }); terrace(k, 29.4, -42, 29.4, -22, { n: 5, h: 4.6, depth: 4, colors: [C.lime, C.brick, 0xd8c7a6], roof: 'gable', roofColor: C.red });
  k.plaza(40, -5, 11, 9, 0xd4c9b0); k.cyl(40, -5, 0.5, 2.4, { color: C.stone, roof: 'cone', roofColor: C.stone, roofH: 1.2, seg: 8 }); k.sign(40, 0.6, 'Market Square');
  for (const [x, z, c] of [[37, -7.6, 0xd24d3e], [43, -7.4, 0x3f7fb5], [43.4, -2.6, 0xe2b23a]]) { block(k, x, 0, z, 2.2, 0.9, 1.2, C.wood); block(k, x, 2, z, 2.6, 0.12, 1.6, c); for (const s of [-1.1, 1.1]) block(k, x + s, 0.9, z, 0.08, 1.1, 0.08, C.dark); }
  k.box(45, -27, 5, 9, 6, { color: C.stone, roof: 'gable', roofColor: C.slate, win: 'tall', plain: true }); steeple(k, 45, -21, 2.6, 9, { color: C.stone, kind: 'spire', capColor: C.slate, clock: true });
  k.box(40.6, 10, 9, 11, 5.6, { color: C.brick, roof: 'hip', roofColor: C.slate, win: 'grid' }); cupola(k, 40.6, 7.4, 10, 0.9, { color: C.white, capColor: C.copper }); k.sign(36.4, 16.4, 'School'); k.patch(41.6, 19, 6, 4, 0xbfc3c8, 0.03);
  // the goods shed between the two lines; the houses, the green and the allotments beyond the railway
  k.box(41, 28.2, 6.4, 3.6, 3.6, { color: C.brickDark, roof: 'gable', roofColor: C.slate, win: 'none' });
  road(k, [[-19, 40.6], [32.1, 40.6]], 2.4, 0x8a8478); k.sign(10, 38.6, 'Station Road'); terrace(k, -18, 45, 30, 45, { n: 12, h: 4.6, depth: 4, colors: TC, roof: 'gable', roofColor: C.slate });
  k.lawn(-6, 33.4, 18, 7); k.cyl(-6, 33.4, 1.6, 0.4, { color: C.stone, roof: 'none', seg: 8 }); for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; block(k, -6 + Math.cos(a) * 1.4, 0.4, 33.4 + Math.sin(a) * 1.4, 0.1, 1.9, 0.1, C.white); } { const r = k.mesh(new THREE.ConeGeometry(2, 1.1, 8), C.red); r.position.set(-6, 2.85, 33.4); } k.sign(-13.4, 37.6, 'The Green');
  for (let i = 0; i < 6; i++) k.patch(11 + i * 2.2, 35, 1.8, 4.6, i % 2 ? 0x7a9a5a : 0x8a6a4a, 0.03); for (const x of [12, 20.6]) k.box(x, 31.6, 1.4, 1.2, 1.5, { color: C.wood, roof: 'gable', roofColor: 0x6b5a4a, win: 'none', solid: false }); k.sign(16.4, 38.4, 'Allotments');
  k.path([[4, 25.6], [4, 30], [-1, 31.6]], 1.4); k.path([[4, 30], [8, 38.6]], 1.4);
  // over the river: the farm and its fields
  for (let i = 0; i < 6; i++) k.patch(-40, -40 + i * 8.6, 13, 7.4, [0xd9c96a, 0xa8b86a, 0xc9b06a][i % 3], 0.025);
  k.box(-39, 14.6, 6, 5, 4, { color: C.brick, roof: 'gable', roofColor: C.slate, win: 'grid' }); k.box(-45, 13, 4.4, 7, 4.4, { color: 0x9a3a2e, roof: 'gable', roofColor: 0x4a3a36, win: 'none' }); k.sign(-34.4, 17.6, 'Mill Farm'); k.path([[-27.5, 9], [-34, 10], [-36.4, 13.4]], 1.4);
  k.grove(-40, 38, 12, 14, 7); k.grove(-33, -20, 2, 40, 6, 'round');
  // the hill behind the mill, with the old beacon on top
  hill(k, 2, -41.6, 30, 6.4, 4.6); for (let i = 0; i < 22; i++) { const tx = k.r.range(-24, 24), tz = k.r.range(-4, 4); if (Math.abs(tx) < 3) continue; k.tree(2 + tx, -41.6 + tz, i % 3 ? 'round' : 'cone', k.r.range(0.7, 1.1), { y: Math.max(0.4, 4.3 * Math.sqrt(Math.max(0, 1 - (tx / 30) ** 2 - (tz / 6.4) ** 2))) }); }
  k.cyl(2, -41.6, 1.1, 3.4, { color: C.stone, roof: 'cone', roofColor: C.slate, roofH: 1.4, y: 4.4, solid: false, seg: 8 }); k.sign(2, -34.6, 'The Beacon');
  k.grove(24, -34, 6, 10, 4); k.grove(22, 31, 8, 3, 3); k.grove(44, 40, 6, 12, 5); k.grove(28, 3, 4, 6, 2);
  life(k, [[[35.6, -40], [35.6, 18]], [[-18, 38.8], [30, 38.8]], [[-27.5, 9], [-34, 10], [-36.4, 13.6], [-34, 10]], [[4, 25.6], [4, 30], [-1, 31.6], [4, 30], [8, 38.4], [4, 30]], loopA, loopB, loopC], { adults: 5, kids: 3, families: 2, mower: [13, 10.5, 9, 2.5], drone: true, line: [[4, 18.5], [4, 10.2], [-5.6, 5.4], [-6, 1.5]] });
  k.boat(-23.5, 22, 1.2, 5, 0.12);
  // where things are
  k.door = { x: -6, z: -1.6 }; k.spawn = { x: 5, z: 17 };
  k.room?.call;
  k.spotsAlong([[-2, 8], [9, 10], [16, 8], [-10, 7], [1, 14], [-14, 12], [20, 3], [6, 3], [-17, 3], [12, 14]], 'a');
  egg(k, 'watermark', 15.5, 4.6, 'post', 0xe9e4d6); egg(k, 'snail', 8.2, 3.4, 'ball', 0xc9a66b);
  k.points = { room: { x: 22, z: -2.4 }, odile: { x: 19.5, z: -1.2 }, tomas: { x: 24.5, z: 17 }, pip: { x: 10.4, z: 1.6 }, librarian: { x: -9, z: -1 }, cameo: { x: 11, z: 20.4 } };
}
