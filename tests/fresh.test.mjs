// The same check as instruments.test.mjs, with the seeds the game really uses: each session's own seed with seven
// presses of "Fresh data", a round started from counts made at a place, and thirty workbench seeds.
import test from 'node:test';
import assert from 'node:assert/strict';
import { stubDom } from './stub.mjs';
stubDom();
const { selfTest } = await import('../dist/js/instruments/frame.js');
const { ALL } = await import('../dist/js/instruments/index.js');
const { CASE } = await import('../dist/js/sim/case-data.js');
const { hash } = await import('../dist/js/core/rng.js');
const COUNTS = [[{ v: 3, zone: 'a' }, { v: 9, zone: 'a' }, { v: 4, zone: 'b' }, { v: 7, zone: 'b' }, { v: 12, zone: 'a' }], [{ v: 20, zone: 'a' }, { v: 22, zone: 'a' }, { v: 19, zone: 'a' }, { v: 2, zone: 'b' }]];
for (const def of ALL) {
  test(def.id + ' with the seeds the game uses', () => {
    const bad = [], seed = 20261121 + hash(def.id) % 1000, runs = [];
    for (let ex = 0; ex < 8; ex++) runs.push([`session, data ${ex}`, { seed, example: ex }]);
    COUNTS.forEach((sample, i) => runs.push([`session, counts ${i}`, { seed, sample, bias: i ? 0.8 : 0.2 }]));
    for (let k = 1; k <= 30; k++) runs.push([`workbench seed ${k * 7919}`, { seed: k * 7919 }]);
    for (const [name, extra] of runs) {
      const r = selfTest(def, { caseData: CASE, ...extra });
      for (const [round, o] of Object.entries(r)) { if (o.before) bad.push(`${round}, ${name}: starts solved`); if (!o.after) bad.push(`${round}, ${name}: not solved by the demonstration (${o.text})`); }
    }
    assert.equal(bad.length, 0, `${bad.length} of ${runs.length * 3} rounds. ` + bad.slice(0, 5).join('; '));
  });
}
