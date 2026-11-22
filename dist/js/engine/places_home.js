// Deckle and the Stacks: the one invented place.
import { C } from './kit.js';
import { rails, bridge, chimney, shelfRing, sitters, train, fountain, life, egg, THREE } from './parts.js';

export function deckle(k, flags = {}) {
  k.ground({ size: 64 });
  // the river and the weir
  k.river([[-25, -32], [-24, -12], [-22, 4], [-25, 18], [-27, 32]], 7);
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
  rails(k, -32, 24, 32, 24); rails(k, 4, 24, 32, 30.5);
  k.box(4, 20.6, 22, 2.6, 0.55, { color: C.concrete, roof: 'none', win: 'none', solid: false });
  for (const px of [-1.5, 3, 7.5, 9.5]) { const p = k.mesh(new THREE.CylinderGeometry(0.09, 0.09, 3, 6), C.dark); p.position.set(px, 2.1, 19.9); }
  const roofp = k.mesh(new THREE.BoxGeometry(12.6, 0.2, 2.4), C.slate); roofp.position.set(4, 3.7, 19.9);
  k.sign(-4.5, 19.4, 'Deckle Junction');
  for (const px of [26.2, 27.8]) for (const pz of [18.2, 19.8]) { const p = k.mesh(new THREE.CylinderGeometry(0.1, 0.1, 3, 6), C.dark); p.position.set(px, 1.5, pz); }
  k.box(27, 19, 3.2, 3.2, 2.4, { color: C.cream, roof: 'hip', roofColor: C.red, win: 'grid', y: 3, solid: false });
  k.obstacles.push({ x0: 25.6, x1: 28.4, z0: 17.6, z1: 20.4 });
  train(k, -30, 24, 30, 24, 3);
  // paths, light lines, trees and life
  k.path([[4, 19], [4, 10], [-6, 5]], 2); k.path([[4, 10], [14, 9], [22, 0]], 1.6); k.path([[-6, 5], [-19, 9.4]], 1.6); k.path([[22, -2.6], [22, 0]], 1.4);
  k.row(-18, -22, -18, 24, 9, 'round'); k.grove(22, 10, 12, 8, 7); k.grove(-10, 14, 10, 8, 6, 'round'); k.grove(0, -26, 40, 6, 12, ['cone', 'round']);
  fountain(k, -6, 2.4, 1.6);
  k.lamp(-12.5, 5.5); k.lamp(0.6, 5.5); k.lamp(9, 12);
  const loopA = [[4, 18], [4, 10], [-6, 5], [-12, 6], [-19, 9.4], [-12, 6], [-6, 5], [4, 10]], loopB = [[4, 10], [14, 9], [22, 0], [14, 9]], loopC = [[-14, 16], [-2, 14], [8, 15], [18, 14], [8, 15], [-2, 14]];
  k.door = { x: -6, z: -1.6 }; k.spawn = { x: 5, z: 17 };
  life(k, [loopA, loopB, loopC], { adults: 5, kids: 3, families: 2, mower: [13, 10.5, 9, 2.5], drone: true, line: [[4, 18.5], [4, 10.2], [-5.6, 5.4], [-6, 1.5]] });
  k.boat(-23.5, 22, 1.2, 5, 0.12);
  // where things are
  k.door = { x: -6, z: -1.6 }; k.spawn = { x: 5, z: 17 };
  k.room?.call;
  k.spotsAlong([[-2, 8], [9, 10], [16, 8], [-10, 7], [1, 14], [-14, 12], [20, 3], [6, 3], [-17, 3], [12, 14]], 'a');
  egg(k, 'watermark', 15.5, 4.6, 'post', 0xe9e4d6); egg(k, 'snail', 8.2, 3.4, 'ball', 0xc9a66b);
  k.points = { room: { x: 22, z: -2.4 }, odile: { x: 19.5, z: -1.2 }, tomas: { x: 24.5, z: 17 }, pip: { x: 10.4, z: 1.6 }, librarian: { x: -9, z: -1 }, cameo: { x: 11, z: 20.4 } };
}
