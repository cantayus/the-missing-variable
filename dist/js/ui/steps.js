// What to do next: the few steps between here and the next card of evidence, in order, with the current one marked.
import { el } from '../core/util.js';
import { S, save } from '../core/save.js';
import { PLACES } from '../content/places.js';
import { SESSIONS, PARTS, sessionsIn } from '../content/sessions.js';
import { BY_ID } from '../instruments/index.js';
import { stateOf, isDone, challengeOpen, finaleOpen } from '../core/game.js';

const title = (x) => BY_ID[x.id]?.name || x.plate[1];
const lower = (t) => t.charAt(0).toLowerCase() + t.slice(1);

// The thing to aim for now: a session, a challenge, the board meeting, or nothing left to do.
// A core session where you are standing comes before one somewhere else.
export function goal(place) {
  const s = S(), open = SESSIONS.filter((x) => stateOf(x.id) === 'open'), core = open.filter((x) => x.core);
  if (!s.finale?.done) {
    const pick = core.find((x) => x.place === place) || core[0];
    if (pick) return { kind: 'session', sess: pick };
    for (const p of [1, 2, 3]) if (challengeOpen(p) && !s.challenges[p]) return { kind: 'challenge', p };
    if (finaleOpen()) return { kind: 'finale' };
  }
  const more = open.find((x) => x.place === place) || open[0];   // sessions off the main road, for whoever wants them
  return more ? { kind: 'session', sess: more, extra: true } : { kind: 'done' };
}

// The steps for that goal. Each: { text, done, now, act? } where act is something main.js knows how to do.
export function plan(place) {
  const g = goal(place), steps = [];
  const go = (to) => ({ text: place === to ? 'You are in ' + PLACES[to].name + '.' : 'Travel to ' + PLACES[to].name + '.', done: place === to, act: { kind: 'travel', to, label: 'Travel to ' + PLACES[to].name } });
  let head = 'What to do next', part = Math.max(1, Math.min(4, S().part || 1));
  if (g.kind === 'session') {
    const x = g.sess; part = x.part; if (g.extra) head = 'Still open, if you like';
    steps.push(go(x.place));
    steps.push({ text: `Go to the blue marker and sit in on “${title(x)}”.`, act: { kind: 'door', id: x.id, label: 'Take me there' } });
    steps.push({ text: 'Hear the recording, then play three rounds: Play, Twist and Case.' });
    steps.push({ text: 'File the evidence card.' });
  } else if (g.kind === 'challenge') {
    part = g.p;
    steps.push(go('deckle'));
    steps.push({ text: `See Ines Varga at the Stacks for Challenge ${PARTS[g.p].roman}: ${lower(PARTS[g.p].challenge)}.`, act: { kind: 'ines', label: 'Take me to her' } });
    steps.push({ text: `Part ${PARTS[g.p + 1].roman} opens when the challenge is done.` });
  } else if (g.kind === 'finale') {
    part = 4;
    steps.push(go('deckle'));
    steps.push({ text: 'See Ines Varga at the Stacks. The board is meeting.', act: { kind: 'ines', label: 'Take me to her' } });
    steps.push({ text: 'Design the experiment and answer the board.' });
  } else steps.push({ text: 'The case is closed. Every stop is still open, and any session can be played again.', done: true });
  const now = steps.findIndex((t) => !t.done); steps.forEach((t, i) => { t.now = i === now; });
  const core = sessionsIn(part).filter((x) => x.core), filed = core.filter((x) => isDone(x.id)).length;
  return { goal: g, head, steps, part, filed, of: core.length };
}

// The panel. `act(a)` carries out a step's action; `redraw()` is called when the panel is folded or unfolded.
export function stepsPanel(place, act, redraw) {
  const P = plan(place), folded = S().settings.steps === false, cur = P.steps.find((t) => t.now);
  const fold = el('button.btn.quiet.small', { onclick: () => { S().settings.steps = folded; save(); redraw(); }, 'aria-expanded': String(!folded) }, folded ? 'Show steps' : 'Hide');
  const box = el('div#steps.panel' + (folded ? '.folded' : ''), { role: 'region', 'aria-label': 'What to do next' });
  const button = (t) => (t.now && t.act ? el('button.btn.go.small', { onclick: () => act(t.act) }, t.act.label) : null);
  if (folded) { box.append(el('div.one', [el('b', 'Next: '), cur ? cur.text : 'Nothing left to do.']), el('div.row', [cur ? button(cur) : null, fold])); return box; }
  box.append(el('header', [el('b', P.head), el('span.grow'), fold]));
  box.append(el('ol', P.steps.map((t, i) => el('li' + (t.done ? '.done' : t.now ? '.now' : ''), [el('span.n', { 'aria-hidden': 'true' }, t.done ? '✓' : String(i + 1)), el('span.t', [t.text, button(t)])]))));
  if (P.goal.kind !== 'done') box.append(el('div.prog', [el('span', `Part ${PARTS[P.part].roman}: ${P.filed} of ${P.of} core sessions filed`), el('div.track', el('i', { style: { width: Math.round((P.filed / Math.max(1, P.of)) * 100) + '%' } }))]));
  return box;
}
