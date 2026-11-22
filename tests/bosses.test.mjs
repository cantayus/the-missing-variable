// The professors: every claim has one reply that answers it and two that do not, and every figure resolves.
import test from 'node:test';
import assert from 'node:assert/strict';
import { BOSSES, BOSS_ORDER } from '../dist/js/content/bosses.js';
import { CASE } from '../dist/js/sim/case-data.js';
import { experiment } from '../dist/js/sim/challenges.js';
import { SESSIONS } from '../dist/js/content/sessions.js';
const e = experiment({ pool: 'all', share: 0.2, split: true, months: 6 }), o = { size: 31210, words: 2655, line: 'Said the queen, and off she went.' };
for (const id of BOSS_ORDER) test('professor: ' + id, () => {
  const B = BOSSES[id], R = B.rounds(CASE, e, o);
  assert.ok(B.name && B.chair && B.enter && B.intro && B.win && B.look, 'name, chair, entrance, opening line, concession, look');
  assert.ok(R.length >= 5, 'at least five rounds');
  if (!B.final) assert.ok(SESSIONS.filter((s) => s.part === B.part).length > B.after, 'turns up before the part runs out of sessions');
  for (const r of R) {
    assert.ok(r.idea && r.claim && r.yes?.length === 2 && r.no?.length === 2, 'a claim, one answer with a comeback, two non-answers with retorts');
    for (const t of [r.claim, ...r.yes, ...r.no.flat()]) { assert.equal(typeof t, 'string'); assert.ok(t.length > 8); assert.ok(!/undefined|NaN|null|\[object/.test(t.replace(/Professor Honoria Null|a null lightly|Null\b/g, '')), 'no unresolved figure in: ' + t); }
  }
});
