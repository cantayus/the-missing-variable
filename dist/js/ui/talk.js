// Talking to people, noting animals, and picking up finds.
import { el, clear, bus } from '../core/util.js';
import { S, save } from '../core/save.js';
import { RNG, hash } from '../core/rng.js';
import { ROLE_NAME, LINES, RUMOUR, ANIMALS, HOME } from '../content/npcs.js';
import { NOTES, EGGS } from '../content/extras.js';
import { toast } from './pages.js';
import { sfx } from '../audio/sound.js';

const NAMES = ['Ada', 'Bram', 'Cleo', 'Dov', 'Esme', 'Finn', 'Greta', 'Hale', 'Ines', 'Jory', 'Kit', 'Lune', 'Maren', 'Nico', 'Opal', 'Pell', 'Quill', 'Rhea', 'Soren', 'Tamsin', 'Una', 'Vale', 'Wim', 'Yara', 'Zed', 'Aiko', 'Bashir', 'Chidi', 'Dalia', 'Emre', 'Farah', 'Goran', 'Hana', 'Imani', 'Joon', 'Kofi', 'Leila', 'Mateo', 'Nour', 'Oksana', 'Pablo', 'Rin', 'Sunita', 'Tariq', 'Uma', 'Viktor', 'Wanjiru', 'Xavier', 'Yusuf', 'Zofia'];
let panel = null, held = null, onRelease = null;
export function closeTalk() { if (panel) { panel.remove(); panel = null; if (held) onRelease?.(held); held = null; } }
function open(title, sub) {
  closeTalk(); panel = el('div#talk.panel', { role: 'dialog', 'aria-label': title, style: { position: 'fixed', left: '1.1rem', bottom: '1.1rem', width: 'min(30rem, 92vw)', padding: '0.8rem 1rem', zIndex: 15 } });
  panel.append(el('div.row', [el('div.grow', [el('b', title), sub ? el('span.note', '  ' + sub) : null]), el('button.btn.quiet.small', { onclick: closeTalk }, 'Goodbye')]));
  document.getElementById('ui').append(panel); return panel;
}
function giveNote(p, r) {
  const left = NOTES.map((_, i) => i).filter((i) => !S().notes[i]); if (!left.length) return;
  const i = left[r.int(0, left.length - 1)]; S().notes[i] = true; save(); sfx('find');
  p.append(el('div.pipnote', { style: { marginTop: '0.5rem', fontSize: '1.1rem' } }, NOTES[i]), el('div.note', `A margin note. ${Object.keys(S().notes).length} of ${NOTES.length} collected.`));
}
export function talkNpc(npc, { place, part, idx, release }) {
  const r = new RNG(hash(place + ':' + idx)), role = npc.role || 'visitor', name = role === 'robot' ? 'Unit ' + (10 + (idx % 80)) : NAMES[r.int(0, NAMES.length - 1)], pool = LINES[role] || LINES.visitor;
  let k = r.int(0, pool.length - 1), noted = false; held = npc; onRelease = release; S().talked = (S().talked || 0) + 1;
  const p = open(name, ROLE_NAME[role] || 'a passer-by'), body = el('div'), btns = el('div.ask'); p.append(body, btns);
  const say = (t) => { clear(body); body.append(el('p.line', t)); sfx('tap'); if (!noted && role !== 'robot' && r.chance(0.4)) { noted = true; giveNote(body, r); } };
  btns.append(el('button.btn.quiet.small', { onclick: () => { k = (k + 1) % pool.length; say(pool[k]); } }, 'Go on'));
  if (role !== 'robot' && role !== 'child' && !role.endsWith('kid')) btns.append(el('button.btn.quiet.small', { onclick: () => { const q = RUMOUR[Math.min(3, part - 1)]; say(q[r.int(0, q.length - 1)]); } }, 'Ask about the library screen'));
  say(pool[k]);
}
export function talkHome(who, stage) {
  const h = HOME[who]; if (!h) return; const lines = h.lines[Math.min(stage, h.lines.length - 1)]; let k = 0;
  const p = open(h.name, h.role), body = el('div'), btns = el('div.ask'); p.append(body, btns);
  const say = () => { clear(body); body.append(el('p.line', lines[k])); sfx('tap'); };
  if (lines.length > 1) btns.append(el('button.btn.quiet.small', { onclick: () => { k = (k + 1) % lines.length; say(); } }, 'Go on'));
  say(); return { panel: p, btns };
}
export function noteAnimal(animal) {
  const sp = animal.species || 'bird', text = ANIMALS[sp] || ANIMALS[sp.split(' ').pop()] || 'You make a note of it.'; S().fauna[sp] = (S().fauna[sp] || 0) + 1; save(); sfx('tap');
  const p = open(sp[0].toUpperCase() + sp.slice(1), 'field note ' + S().fauna[sp]); p.append(el('p.line', text), el('div.note', `Kinds noted so far: ${Object.keys(S().fauna).length}. Your field notes are on the tablet.`));
}
export function findEgg(id) {
  const e = EGGS[id]; if (!e) return; const first = !S().eggs[id]; S().eggs[id] = true; save(); sfx('find');
  const p = open(e[1], e[0]); p.append(el('p.line', e[2]), el('div.note', first ? `A find for your cabinet. ${Object.keys(S().eggs).length} of ${Object.keys(EGGS).length}.` : 'Already in your cabinet.'));
}
