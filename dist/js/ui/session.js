// A session: the recording, the instrument, and the card that goes on the case board.
import { el, clear, bus } from '../core/util.js';
import { S, save } from '../core/save.js';
import { hash, RNG } from '../core/rng.js';
import { CASE } from '../sim/case-data.js';
import { SUSPECTS, PARTS } from '../content/sessions.js';
import { BY_ID } from '../instruments/index.js';
import { runInstrument } from '../instruments/frame.js';
import { complete, isDone, markVariant } from '../core/game.js';
import { sheet, toast } from './pages.js';
import { sfx, setPatch } from '../audio/sound.js';
import { entriesFor } from '../content/guide.js';

const HUES = ['#2f6f8f', '#8a5a3c', '#4f7d5c', '#7a5c8e', '#a0553f', '#3f6a8a', '#6b7a3a'];
const initials = (name) => name.replace(/\(.*?\)/g, '').split(/[\s-]+/).filter((w) => /^[A-ZÀ-Ý]/.test(w)).map((w) => w[0]).slice(0, 3).join('');
export function portraits(names) { return el('div.portraits', names.slice(0, 4).map((n) => el('div.portrait', { style: { background: HUES[hash(n) % HUES.length] }, title: n }, [initials(n), el('small', n.split(',')[0].split(' ').slice(-1)[0])]))); }
const hostNames = (sess) => sess.plate[0].split(/,| and |;/).map((s) => s.trim()).filter((s) => s && !/colleagues|team|co-authors|librarian/.test(s));

// where you are in a session: the same five steps along the top of each of its screens
const STEPS = ['Recording', 'Play', 'Twist', 'Case', 'Evidence'];
const strip = (at) => el('div.rounds.steps', { role: 'img', 'aria-label': `Step ${at + 1} of 5: ${STEPS[at]}` }, STEPS.map((t, i) => el('i' + (i === at ? '.on' : i < at ? '.done' : ''), t)));

export function sitIn(sess, ctx, onDone) {
  const def = BY_ID[sess.id];
  sheet(null, (p, close) => {
    p.classList.add('session');
    const names = hostNames(sess); let shown = 1;
    p.append(strip(0), el('div.tag', `Part ${PARTS[sess.part].roman} · session ${sess.id}${sess.core ? ' · core' : ''}`), el('h2', def ? def.name : sess.plate[1]));
    p.append(el('div.plate', [el('b', sess.plate[0]), ' · ' + sess.plate[1] + ' · ' + sess.plate[2] + ' · ' + sess.plate[3] + ' · Dramatization']));
    if (sess.credited.length) p.append(el('div.note', { style: { marginTop: '4px' } }, 'Credited: ' + sess.credited.join(', ') + '.'));
    const lines = el('div'), host = el('div.host', [el('div.recorded', portraits(names.length ? names : [sess.plate[0]])), lines]); p.append(host);
    const ask = el('div.ask'), qs = ['What were they trying to do?', 'What goes wrong?', 'Where is it used now?'], asked = [false, false, false];
    const render = () => { clear(lines); sess.lines.slice(0, shown).forEach((t) => lines.append(el('p.line', t))); asked.forEach((a, i) => { if (a) lines.append(el('p.line.q', [el('b', qs[i] + ' '), sess.qa[i]])); });
      clear(ask); if (shown < sess.lines.length) ask.append(el('button.btn.go', { onclick: () => { shown++; sfx('tap'); render(); } }, 'Go on')); else { qs.forEach((q, i) => { if (!asked[i]) ask.append(el('button.btn.quiet', { onclick: () => { asked[i] = true; render(); } }, q)); }); ask.append(el('button.btn.go', { onclick: () => { close(); play(sess, ctx, onDone); } }, isDone(sess.id) ? 'Back to the table' : 'To the table')); }
      ask.querySelector('button.go')?.focus({ preventScroll: true }); };
    p.append(ask); p.append(el('p.note', { style: { marginTop: '0.8rem' } }, 'Covers: ' + sess.covers.join(' · '))); render();
  }, { onClose: () => {} });
}

export function play(sess, ctx, onDone, mode = 'session') {
  const def = BY_ID[sess.id]; if (!def) { toast('This instrument is still on the bench.'); onDone?.(false); return; }
  setPatch('table');
  runInstrument(def, {
    mode, steps: mode === 'session', rounds: ['play', 'twist', 'case'], talk: sess.talk && (S().wren ? sess.wren : sess.talk), wren: !!S().wren,
    ctx: { seed: S().seed + hash(sess.id) % 1000, caseData: CASE, sample: ctx?.sample || [], bias: ctx?.bias || 0 },
    onVariant: (v) => { if (v) markVariant(sess.id, v); },
    onFinish: (res) => fileEvidence(sess, def, res, onDone),
    onClose: () => { bus.emit('overlay'); onDone?.(false); },
  });
  bus.emit('overlay');
}

function fileEvidence(sess, def, res, onDone) {
  const first = !isDone(sess.id), clean = Object.values(res.done).every((d) => d.clean);
  complete(sess.id, { clean }); sfx('file');
  sheet('Evidence filed', (p, close) => {
    p.append(strip(4));
    p.append(el('div.card.evidence', { style: { fontSize: '1.05em', maxWidth: '44rem' } }, [el('div.n', sess.id + ' · the Common Shelf · from the simulation'), sess.ev(CASE)]));
    if (sess.sus.length) p.append(el('p', sess.sus.map(([k, v]) => el('span', { style: { display: 'inline-block', margin: '2px 8px 2px 0' } }, [el('b', v > 0 ? 'Supports: ' : 'Weakens: '), SUSPECTS[k].name]))));
    p.append(el('p.note', `${clean ? 'Solved cleanly. ' : 'Solved. '}The instrument is now a “${sess.slot}” tile in your pipeline${first ? `, and ${entriesFor(sess.id).length} entries are new in the Field Guide` : ''}.`));
    if (def.limit) p.append(el('div.limit', def.limit));
    // teach it: three steps in order
    if (!S().done[sess.id]?.taught) {
      const order = new RNG(hash(sess.id) + 7).shuffle([0, 1, 2]), picked = [], box = el('div.teach'), who = S().wren ? 'Wren' : 'Folio';
      const draw = () => { clear(box); box.append(el('div', [el('b', `Explain it to ${who}. `), 'Tap the three steps in order.'])); order.forEach((i) => { const n = picked.indexOf(i); box.append(el('button.btn' + (n >= 0 ? '.go' : '.quiet'), { onclick: () => { if (n >= 0) picked.splice(n, 1); else picked.push(i); if (picked.length === 3) { if (picked.every((v, k) => v === k)) { S().done[sess.id].taught = true; save(); sfx('met'); clear(box); box.append(el('div.wren', who === 'Wren' ? 'Wren: “Oh. I could explain that to Pip.”' : 'Folio beeps twice. It has filed the method.')); return; } toast('Not quite in order. Try again.'); picked.length = 0; } draw(); } }, (n >= 0 ? n + 1 + '. ' : '') + def.teach[i])); }); };
      draw(); p.append(el('div.hr'), box);
    }
    p.append(el('div.row', { style: { marginTop: '1rem' } }, [el('button.btn.go', { onclick: () => { close(); onDone?.(true); } }, 'Step outside')]));
  }, { modal: true });
}

// replay a finished instrument with fresh data, another example or a variation
export function workbench(sess, sample) {
  const def = BY_ID[sess.id]; if (!def) return; setPatch('table');
  runInstrument(def, { mode: 'workbench', rounds: ['play', 'twist', 'case'], talk: sess.talk, ctx: { seed: Math.floor(Math.random() * 1e6), caseData: CASE, sample: sample || [] }, onVariant: (v) => { if (v) markVariant(sess.id, v); }, onClose: () => bus.emit('overlay') });
  bus.emit('overlay');
}
