// The "what to do next" list: it always names one step to take, and the step is the right one.
import test from 'node:test';
import assert from 'node:assert/strict';
import { S } from '../dist/js/core/save.js';
import { SESSIONS, sessionsIn } from '../dist/js/content/sessions.js';
import { PLACES } from '../dist/js/content/places.js';
import { goal, plan } from '../dist/js/ui/steps.js';

const wipe = () => { const s = S(); s.done = {}; s.evidence = {}; s.challenges = {}; s.finale = null; s.part = 1; s.settings.openAll = false; };
const file = (ids) => { for (const id of ids) S().done[id] = { solved: true }; };
const coreOf = (p) => sessionsIn(p).filter((x) => x.core).map((x) => x.id);

test('a new player at home is sent to the session room', () => {
  wipe(); const P = plan('deckle'), first = SESSIONS.find((x) => x.core);
  assert.equal(P.goal.kind, 'session'); assert.equal(P.goal.sess.id, first.id); assert.equal(first.place, 'deckle');
  assert.equal(P.steps[0].done, true); assert.equal(P.steps[1].now, true); assert.deepEqual(P.steps[1].act, { kind: 'door', id: first.id, label: 'Take me there' });
  assert.equal(P.steps.filter((t) => t.now).length, 1); assert.equal(P.filed, 0); assert.equal(P.of, coreOf(1).length);
});

test('away from the next session, the first step is the journey', () => {
  wipe(); const P = plan('yale'), first = SESSIONS.find((x) => x.core);
  if (SESSIONS.some((x) => x.core && x.part === 1 && x.place === 'yale')) assert.equal(P.goal.sess.place, 'yale', 'a core session where you stand comes first');
  else { assert.equal(P.steps[0].now, true); assert.equal(P.steps[0].act.kind, 'travel'); assert.equal(P.steps[0].act.to, first.place); }
});

test('every stop gives a plan with exactly one current step, all the way through Part I', () => {
  wipe(); const order = coreOf(1);
  for (let n = 0; n <= order.length; n++) {
    for (const place of Object.keys(PLACES)) {
      const P = plan(place), now = P.steps.filter((t) => t.now);
      assert.equal(now.length, 1, `${place} after ${n} sessions`); assert.ok(P.steps.every((t) => typeof t.text === 'string' && /[.!?]$/.test(t.text)), 'steps are sentences');
      if (now[0].act?.kind === 'travel') assert.ok(PLACES[now[0].act.to] && now[0].act.to !== place);
      if (now[0].act?.kind === 'door') assert.equal(SESSIONS.find((x) => x.id === now[0].act.id).place, place, 'the door step only shows where the session is');
    }
    if (n < order.length) file([order[n]]);
  }
});

test('with the core of a part filed, the challenge is next, then the next part', () => {
  wipe(); file(coreOf(1));
  assert.deepEqual(goal('deckle'), { kind: 'challenge', p: 1 }); assert.equal(plan('yale').steps[0].act.to, 'deckle'); assert.equal(plan('deckle').steps[1].act.kind, 'ines');
  S().challenges[1] = { ok: true };
  const g = goal('deckle'); assert.equal(g.kind, 'session'); assert.equal(g.sess.part, 2);
});

test('the board meeting comes last, and after it nothing is asked', () => {
  wipe(); for (const p of [1, 2, 3, 4]) file(coreOf(p)); for (const p of [1, 2, 3]) S().challenges[p] = { ok: true };
  assert.equal(goal('deckle').kind, 'finale');
  S().finale = { done: true };
  const extra = goal('deckle'); assert.equal(extra.kind, 'session'); assert.equal(extra.extra, true); assert.equal(extra.sess.core, false);
  file(SESSIONS.map((x) => x.id));
  const P = plan('deckle'); assert.equal(P.goal.kind, 'done'); assert.equal(P.steps.filter((t) => t.now).length, 0);
});
