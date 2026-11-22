// The tablet: case board, pipeline, Field Guide, syllabus, album, workbench, notes.
import { el, clear, bus } from '../core/util.js';
import { octavoChat } from './octavo.js';
import { runBoss, bossTally, portrait } from './boss.js';
import { BOSSES } from '../content/bosses.js';
import { S, save } from '../core/save.js';
import { CASE } from '../sim/case-data.js';
import { SESSIONS, SESSION, PARTS, SUSPECTS, SLOTS, sessionsIn } from '../content/sessions.js';
import { PLACES } from '../content/places.js';
import { ENTRIES, FAMILIES } from '../content/guide.js';
import { NOTES, EGGS } from '../content/extras.js';
import { ANIMALS } from '../content/npcs.js';
import { BY_ID } from '../instruments/index.js';
import { isDone, stateOf, suspectScores, challengeOpen, finaleOpen, coreLeft, counts, partOpen } from '../core/game.js';
import { workbench } from './session.js';
import { family, options, toast } from './pages.js';
import { sfx } from '../audio/sound.js';

let root = null, tab = 'case', hooks = {}, fam = 0;
const TABS = [['case', 'Case board'], ['pipe', 'Pipeline'], ['guide', 'Field Guide'], ['syll', 'Syllabus'], ['bench', 'Workbench'], ['album', 'Album'], ['notes', 'Notes and finds']];
export function initTablet(h) { hooks = h; root = el('div#tablet', { 'aria-hidden': 'true' }); document.getElementById('ui').append(root); window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && root.classList.contains('open')) closeTablet(); }); }
export const tabletOpen = () => root?.classList.contains('open');
export function closeTablet() { root.classList.remove('open'); root.setAttribute('aria-hidden', 'true'); bus.emit('overlay'); }
export function openTablet(t) { if (t) tab = t; root.classList.add('open'); root.setAttribute('aria-hidden', 'false'); render(); bus.emit('overlay'); sfx('page'); }
function render() {
  clear(root); const nav = el('nav'), body = el('div.body');
  for (const [k, name] of TABS) nav.append(el('button' + (k === tab ? '.on' : ''), { onclick: () => { tab = k; render(); } }, name));
  nav.append(el('span.sp'), el('button', { onclick: () => octavoChat() }, 'Ask Octavo'), el('button', { onclick: () => family() }, 'For two'), el('button', { onclick: () => options(hooks.onOptions) }, 'Options'), el('button', { onclick: closeTablet, 'aria-label': 'Close the tablet' }, 'Close ✕'));
  root.append(nav, body); ({ case: caseBoard, pipe: pipeline, guide, syll, bench, album, notes })[tab](body);
}

function caseBoard(b) {
  const named = isDone('IV-15'), sc = suspectScores(), c = counts();
  b.append(el('h2', 'The case'), el('p', ['Marginalia’s hit rate rose from ', el('b', pct(CASE.y.hit[0])), ' to ', el('b', pct(CASE.y.hit[5])), '. Different titles borrowed each month fell from ', el('b', num(CASE.y.distinct[0])), ' to ', el('b', num(CASE.y.distinct[5])), '. Did readers’ tastes narrow, or did the engine narrow them?']));
  b.append(el('h3', 'loan_log'), el('table.data', [el('tr', ['reader', 'title', 'date', 'branch', named ? 'shown' : ''].map((h, i) => el('th' + (i === 4 && !named ? '.blank' : ''), h || ' '))), ...CASE.logPage.slice(0, 5).map((r) => el('tr', ['R-' + r[0], r[1], r[2], r[3], named ? '?' : ''].map((x) => el('td', x))))]), el('p.note', named ? 'The fifth column has its name. Its past values were never kept.' : 'The fifth column has no header. Nobody recalls what it was for.'));
  b.append(el('h3', 'Five explanations'), el('div.suspects', sc.map((x) => el('div.suspect', [el('b', x.k + '. ' + SUSPECTS[x.k].name), SUSPECTS[x.k].say, el('div.bar', el('i', { style: { width: Math.round(Math.abs(x.frac) * 100) + '%', background: x.frac < 0 ? 'var(--ink3)' : 'var(--warm)' } })), el('div.note', x.score > 0 ? 'evidence for' : x.score < 0 ? 'evidence against' : 'nothing filed yet')]))));
  b.append(el('h3', `Evidence (${c.done} cards)`)); const cards = el('div.cards');
  for (const s of SESSIONS) { if (isDone(s.id)) cards.append(el('div.card.evidence', [el('div.n', s.id + ' · ' + PLACES[s.place].name), s.ev(CASE)])); else if (s.core && stateOf(s.id) === 'open') cards.append(el('div.card.todo', [el('div.n', s.id + ' · ' + PLACES[s.place].name + ' · core'), 'Not yet filed.'])); }
  b.append(cards);
}
function pipeline(b) {
  b.append(el('h2', 'Pipeline'), el('p', 'Every instrument you finish becomes a tile. The challenges ask you to build with them.'));
  const row = el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' } });
  for (const slot of SLOTS) { const col = el('div.suspect', [el('b', slot)]); for (const s of SESSIONS) if (s.slot === slot && isDone(s.id)) col.append(el('div.card', { style: { padding: '3px 6px', margin: '4px 0', fontSize: '0.85em' } }, [el('span.n', s.id + ' '), BY_ID[s.id]?.name || s.plate[1]])); row.append(col); } b.append(row);
  b.append(el('h3', 'Challenges'));
  for (const p of [1, 2, 3]) { const open = challengeOpen(p), done = S().challenges[p], left = coreLeft(p); b.append(el('div.card', { style: { margin: '0.4rem 0', maxWidth: '46rem' } }, [el('div.n', 'Challenge ' + PARTS[p].roman + (done ? ' · done' : '')), el('b', PARTS[p].challenge + '. '), !partOpen(p) ? 'Opens with Part ' + PARTS[p].roman + '.' : open ? '' : `${left.length} core session${left.length === 1 ? '' : 's'} to go: ${left.map((x) => x.id).join(', ')}.`, open ? el('div.row', { style: { marginTop: '6px' } }, el('button.btn' + (done ? '.quiet' : '.go'), { onclick: () => { closeTablet(); hooks.challenge(p); } }, done ? 'Try it again' : 'Begin')) : null])); }
  b.append(el('div.card', { style: { margin: '0.4rem 0', maxWidth: '46rem' } }, [el('div.n', 'Challenge IV · the last week of summer'), el('b', 'The experiment and the board. '), finaleOpen() ? '' : 'Needs every core session and the first three challenges.', finaleOpen() ? el('div.row', { style: { marginTop: '6px' } }, el('button.btn.go', { onclick: () => { closeTablet(); hooks.finale(); } }, S().finale?.done ? 'See it again' : 'Go to the Stacks')) : null]));
}
function guide(b) {
  const known = (e) => !e.from || isDone(e.from), total = ENTRIES.length, have = ENTRIES.filter(known).length;
  b.append(el('h2', 'Field Guide'), el('p.note', `${have} of ${total} entries. An entry opens when its session is done.`));
  const fams = FAMILIES.filter((f) => ENTRIES.some((e) => e.family === f)), wrap = el('div.fg'), side = el('div.fam'), list = el('div.list');
  fams.forEach((f, i) => { const es = ENTRIES.filter((e) => e.family === f); side.append(el('button' + (i === fam ? '.on' : ''), { onclick: () => { fam = i; render(); } }, [f, el('span.mono', { style: { fontSize: '0.8em' } }, es.filter(known).length + '/' + es.length)])); });
  for (const e of ENTRIES.filter((x) => x.family === fams[fam])) list.append(known(e) ? el('div.entry', { onclick: () => { if (SESSION[e.from] && BY_ID[e.from]) { closeTablet(); workbench(SESSION[e.from], S().samples[SESSION[e.from].place]); } } }, [el('span.math', e.kind === 'variation' ? 'variation' : e.from || 'idea'), el('h4', e.name), el('p', e.def || 'Met in session ' + e.from + '.')]) : el('div.entry.unknown', [el('h4', '· · ·'), el('p', 'Session ' + e.from + ', ' + PLACES[SESSION[e.from].place].name)]));
  wrap.append(side, list); b.append(wrap);
}
function syll(b) {
  b.append(el('h2', 'Syllabus'), el('p', 'The topics of the year, in an order in which each builds on the last. Core sessions carry the story.'));
  for (const p of [1, 2, 3, 4]) { b.append(el('h3', `Part ${PARTS[p].roman}, ${PARTS[p].season}: ${PARTS[p].title}`)); const t = el('table.data', { style: { width: '100%', fontFamily: 'var(--ui)', fontSize: '0.88em' } }); for (const s of sessionsIn(p)) t.append(el('tr', [el('td.mono', s.id + (s.core ? ' ●' : '')), el('td', PLACES[s.place].name), el('td', s.covers.join(' · ')), el('td', isDone(s.id) ? '✓' : '')])); b.append(t); }
  b.append(el('p.note', '● core session'));
}
function bench(b) {
  b.append(el('h2', 'Workbench'), el('p', 'Any finished instrument can be played again with fresh data, another example, a variation, or the counts you made at its place.'));
  const cards = el('div.cards'); for (const s of SESSIONS) if (isDone(s.id) && BY_ID[s.id]) { const d = S().done[s.id]; cards.append(el('div.card', { style: { cursor: 'pointer' }, tabIndex: 0, onclick: () => { closeTablet(); workbench(s, S().samples[s.place]); } }, [el('div.n', s.id + ' · ' + PLACES[s.place].name), el('b', BY_ID[s.id].name), el('div.note', ['solved', d.clean ? 'cleanly' : null, d.taught ? 'taught' : null].filter(Boolean).join(' · ') + (BY_ID[s.id].variants?.length ? ` · ${BY_ID[s.id].variants.length} variation${BY_ID[s.id].variants.length > 1 ? 's' : ''}` : ''))])); }
  if (!cards.children.length) cards.append(el('div.card.todo', 'Nothing here yet. Finish a session and its instrument moves in.')); b.append(cards);
}
function album(b) {
  b.append(el('h2', 'Album'), el('p', 'Postcards you have framed. Use the camera button in any place.'));
  const wall = el('div.wall'); S().postcards.forEach((pc, i) => wall.append(el('div.pin', { style: { '--rot': ((i * 37) % 7) - 3 + 'deg' }, onclick: () => { const a = document.createElement('a'); a.href = pc.img; a.download = 'postcard-' + pc.place + '.jpg'; a.click(); } }, [el('img', { src: pc.img, alt: 'Postcard from ' + PLACES[pc.place].name }), PLACES[pc.place].name])));
  if (!S().postcards.length) wall.append(el('div.note', 'The wall is bare.')); b.append(wall);
}
function notes(b) {
  const s = S(), ids = Object.keys(s.notes).map(Number).sort((a, c) => a - c);
  b.append(el('h2', 'Notes and finds'), el('h3', `Cabinet (${Object.keys(s.eggs).length} of ${Object.keys(EGGS).length})`)); const cab = el('div.cabinet');
  for (const [id, e] of Object.entries(EGGS)) cab.append(s.eggs[id] ? el('div.it', { title: e[2] }, [el('b', e[1]), el('div.note', e[0])]) : el('div.it.empty', ['?', el('div.note', e[0])])); b.append(cab);
  b.append(el('h3', `Margin notes (${ids.length} of ${NOTES.length})`)); const ul = el('ul'); ids.forEach((i) => ul.append(el('li', NOTES[i]))); b.append(ids.length ? ul : el('p.note', 'People hand these out. Talk to them.'));
  const profs = bossTally(); if (profs.met.length) { b.append(el('h3', `Professors (${profs.won.length} won over)`)); const row = el('div.profs'); profs.met.forEach((id) => row.append(el('div.prof', [el('div.bosspic', { html: portrait(BOSSES[id].look, profs.won.includes(id) ? 2 : 0) }), el('b', BOSSES[id].name), el('button.btn.quiet.small', { onclick: () => runBoss(id, () => render()) }, profs.won.includes(id) ? 'Argue again' : 'Find them')]))); b.append(row); }
  const fa = Object.entries(s.fauna).sort((a, c) => c[1] - a[1]); b.append(el('h3', `Field notes (${fa.length} kinds)`));
  if (fa.length) { const max = fa[0][1], t = el('table.data'); fa.forEach(([sp, n]) => t.append(el('tr', [el('td', sp), el('td', String(n)), el('td', { style: { width: '14rem' } }, el('div.bar', { style: { margin: 0 } }, el('i', { style: { width: (n / max) * 100 + '%', background: 'var(--d3)' } })))]))); b.append(t, el('p.note', 'A tally of what you stopped to look at. It says as much about you as about the animals.')); } else b.append(el('p.note', 'Stop to look at an animal and it goes in here.'));
}
const pct = (v) => Math.round(v * 100) + '%', num = (v) => Math.round(v).toLocaleString('en-US');
