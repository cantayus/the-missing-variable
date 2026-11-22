// The Missing Variable. Start-up, the world view, and the glue between the parts.
import { el, clear, bus } from './core/util.js';
import { S, save, reset, load } from './core/save.js';
import { RNG, hash } from './core/rng.js';
import { initWorld, loadPlace, setMarkers, removeMarker, onWorld, setAuto, setMotion, setView, worldOK, kitNow, release, pickNearest, snapshot, setSmooth } from './engine/scene.js';
import { RECIPES, TAGS } from './engine/dioramas.js';
import { PLACES } from './content/places.js';
import { SESSIONS, SESSION, PARTS, FIELD, sessionsAt } from './content/sessions.js';
import { FOLIO_LATE } from './content/npcs.js';
import { EGGS } from './content/extras.js';
import { BY_ID } from './instruments/index.js';
import { stateOf, isDone, seasonNow, challengeOpen, finaleOpen, coreLeft, counts, partOpen } from './core/game.js';
import { showTitle, hideTitle, sheet, toast, introLetter, alsoPlay, family, credits, howTo, sources, options } from './ui/pages.js';
import { initTablet, openTablet, closeTablet, tabletOpen } from './ui/tablet.js';
import { openMap, closeMap } from './ui/map.js';
import { sitIn, workbench } from './ui/session.js';
import { talkNpc, talkHome, noteAnimal, findEgg, closeTalk } from './ui/talk.js';
import { octavoChat } from './ui/octavo.js';
import { runChallenge } from './ui/challenge.js';
import { runBoss, bossDue } from './ui/boss.js';
import { runFinale } from './ui/finale.js';
import { carriageProblem } from './instruments/carriage.js';
import { initAudio, setVolumes, setPatch, sfx } from './audio/sound.js';
import { median, mean } from './algo/stats.js';
import { countVisit } from './core/visits.js';

const ui = document.getElementById('ui'), Q = new URLSearchParams(location.search);
const G = { place: null, samples: [], taken: new Set(), visit: 0, hud: null, slowTold: false };
const active = () => !document.querySelector('#ui .veil, #map, #title') && !tabletOpen();
const stage = () => (S().finale?.done ? 4 : Math.max(0, (S().part || 1) - 1));

function applySettings() { const st = S().settings; document.documentElement.style.setProperty('--fs', st.text); document.body.classList.toggle('calm', !st.motion); setVolumes({ music: st.music, amb: st.amb, sfx: st.sfx }); if (worldOK()) { setMotion(st.motion); setSmooth(!!st.smooth); } refresh(); }

// ---- entering a place ----
function enterPlace(id, o = {}) {
  const s = S(); closeTalk(); s.place = id; s.started = true; G.place = id; G.visit = s.intro['v:' + id] = (s.intro['v:' + id] || 0) + 1; G.samples = (s.samples[id] || []).slice(); G.taken = new Set(); save();
  const hour = o.hour ?? [9.5, 13, 16.5, 19.3][(G.visit - 1) % 4];
  if (worldOK()) { loadPlace(RECIPES[id], { season: seasonNow(), hour, seed: id, tags: TAGS[id] || [], flags: { finale: !!s.finale?.done }, companions: { folio: true, wren: !!s.wren && id !== 'deckle' } }); setAuto(false); }
  setPatch(id === 'deckle' ? 'home' : seasonNow()); refresh();
  if (!o.quiet) toast(PLACES[id].full + '. ' + PLACES[id].blurb, 5200);
  if (id !== 'deckle' && s.part >= 3 && G.visit === 1 && Object.keys(s.intro).length % 5 === 0) setTimeout(() => active() && toast(FOLIO_LATE[Math.min(FOLIO_LATE.length - 1, s.part - 3 + (s.finale ? 1 : 0))], 7000), 6000);
}
function doors() { const k = worldOK() ? kitNow() : null, all = sessionsAt(G.place); if (k?.rooms) return k.rooms.map((r) => ({ x: r.x, z: r.z, label: r.label, ids: r.ids })); return all.length ? [{ x: k?.door?.x ?? 0, z: k?.door?.z ?? 0, label: G.place === 'deckle' ? 'Session room' : 'Session room', ids: all.map((x) => x.id) }] : []; }
function refresh() {
  if (!G.place) return; const k = worldOK() ? kitNow() : null, marks = [];
  for (const d of doors()) { const ss = d.ids.map((i) => SESSION[i]).filter(Boolean); if (ss.some((x) => stateOf(x.id) !== 'locked')) marks.push({ type: 'door', x: d.x, z: d.z, label: ss.some((x) => stateOf(x.id) === 'open') ? d.label : d.label + ' ✓', ids: d.ids }); }
  if (k) { k.spots.forEach((sp, i) => { if (!G.taken.has(i) && G.taken.size < 8) marks.push({ type: 'sample', x: sp.x, z: sp.z, zone: sp.zone, i }); });
    if (G.place === 'deckle' && k.points) { const P = k.points; marks.push({ type: 'home', x: P.room.x, z: P.room.z, label: 'Your room' }); for (const who of ['odile', 'tomas', 'pip', 'librarian', 'cameo']) marks.push({ type: 'talk', x: P[who].x, z: P[who].z, who, label: who === 'cameo' ? null : { odile: 'Odile', tomas: 'Tomas', pip: 'Pip', librarian: 'Ines Varga' }[who] }); marks.push({ type: 'talk', x: P.librarian.x + 2.2, z: P.librarian.z + 1.6, who: 'engineer', label: 'Dov' }); if (!S().wren) marks.push({ type: 'talk', x: P.room.x - 1.8, z: P.room.z + 2.2, who: 'wren', label: 'Wren' }); }
    setMarkers(marks); }
  G.marks = marks; hud();
}
function hud() {
  document.getElementById('hud-place')?.remove(); document.getElementById('hud-btns')?.remove(); document.getElementById('fallback')?.remove(); if (!G.place) return;
  const p = PLACES[G.place], here = sessionsAt(G.place), open = here.filter((x) => stateOf(x.id) === 'open').length, F = FIELD[G.place];
  ui.append(el('div#hud-place.panel', [el('b', p.name), el('span', `Part ${PARTS[S().part].roman} · ${seasonNow()}` + (here.length ? ` · ${open ? open + ' session' + (open > 1 ? 's' : '') + ' open here' : 'all done here'}` : '')), F && G.samples.length ? el('span', { style: { display: 'block' } }, `Counted: ${G.samples.map((o) => o.v).join(', ')} ${F[1]}`) : null]));
  ui.append(el('div#hud-btns', [el('button.btn', { onclick: () => openTablet(), title: 'T' }, 'Tablet'), el('button.btn', { onclick: showMap, title: 'M' }, 'Map'), worldOK() ? el('button.btn', { onclick: postcard, title: 'C' }, 'Camera') : null, el('button.btn.quiet', { onclick: toTitle }, 'Menu')]));
  if (!worldOK()) fallback();
}
// without WebGL the places are lists; everything else works
function fallback() {
  const box = el('div#fallback.panel', { style: { position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 'min(34rem, 92vw)', padding: '1rem 1.2rem' } }, [el('h2', PLACES[G.place].full), el('p', PLACES[G.place].blurb), el('p.note', 'This browser cannot draw the 3D view, so the place is shown as a list. Sessions, the tablet and the map all work.')]);
  for (const m of G.marks || []) { if (m.type === 'door') box.append(el('div.row', { style: { margin: '4px 0' } }, el('button.btn.go', { onclick: () => onPick(m) }, 'Go in: ' + m.label))); else if (m.type === 'talk' && m.label) box.append(el('div.row', { style: { margin: '4px 0' } }, el('button.btn.quiet', { onclick: () => onPick(m) }, 'Talk to ' + m.label))); else if (m.type === 'home') box.append(el('div.row', { style: { margin: '4px 0' } }, el('button.btn.quiet', { onclick: () => onPick(m) }, 'Go up to your room'))); }
  if (FIELD[G.place] && G.samples.length < 8) box.append(el('div.row', { style: { marginTop: '6px' } }, [el('button.btn.quiet', { onclick: () => takeSample({ zone: 'a', i: 100 + G.samples.length }) }, 'Count on the busy side'), el('button.btn.quiet', { onclick: () => takeSample({ zone: 'b', i: 200 + G.samples.length }) }, 'Count on the quiet side')]));
  ui.append(box);
}

// ---- things the player can walk up to ----
function onPick(d) {
  if (d.type === 'door') doorSheet(d);
  else if (d.type === 'sample') takeSample(d);
  else if (d.type === 'npc') { const k = kitNow(); talkNpc(d.npc, { place: G.place, part: S().part, idx: k.npcs.indexOf(d.npc), release }); }
  else if (d.type === 'animal') noteAnimal(d.animal);
  else if (d.type === 'egg') findEgg(d.id);
  else if (d.type === 'home') homeRoom();
  else if (d.type === 'talk') { const t = talkHome(d.who, stage()); if (!t) return;
    if (d.who === 'wren') t.btns.append(el('button.btn.go.small', { onclick: () => { S().wren = true; save(); closeTalk(); toast('Wren fetches her coat. She will come along, and can always be left at home from your room.'); refresh(); } }, 'Invite Wren along'));
    if (d.who === 'librarian' && finaleOpen() && !S().finale?.done) t.btns.append(el('button.btn.go.small', { onclick: () => { closeTalk(); runFinale(afterFinale); } }, 'The board is meeting'));
    if (d.who === 'librarian') [1, 2, 3].forEach((p) => { if (challengeOpen(p) && !S().challenges[p]) t.btns.append(el('button.btn.go.small', { onclick: () => { closeTalk(); runChallenge(p, afterChallenge); } }, 'Challenge ' + PARTS[p].roman)); }); }
}
function takeSample(d) {
  const F = FIELD[G.place]; if (!F) return; const r = new RNG(hash(G.place + ':' + d.i + ':' + G.visit)), [lo, hi] = d.zone === 'a' ? F[2] : F[3], v = r.int(lo, hi);
  G.samples.push({ v, zone: d.zone }); G.taken.add(d.i); S().samples[G.place] = G.samples.slice(-12); save(); sfx('find'); if (worldOK()) removeMarker((m) => m === d);
  let msg = `Counted ${F[0]}: ${v}. `; const vs = G.samples.map((o) => o.v), n = vs.length, says = [];
  if (S().settings.folioTalk && n >= 3) {
    if (G.samples.every((o) => o.zone === G.samples[0].zone)) says.push(`Folio: every count so far is from the ${G.samples[0].zone === 'a' ? 'busy' : 'quiet'} side.`);
    if (isDone('I-4')) says.push(`Folio: median ${median(vs)}, mean ${mean(vs).toFixed(1)}.`);
    if (isDone('I-12')) says.push(`Folio fits a line and predicts the next count: ${Math.max(0, Math.round(vs[n - 1] + (vs[n - 1] - vs[0]) / (n - 1)))}. Folio has been wrong before.`);
    if (isDone('I-25') && Math.max(...vs) > 2.2 * median(vs)) says.push(`Folio flags ${Math.max(...vs)} as an outlier. It may only be the busy spot.`);
    if (isDone('I-16') && n >= 5) says.push('Folio sorts your counts into two clusters: high and low. It did not ask whether there are two.');
  }
  if (says.length) msg += says[r.int(0, says.length - 1)]; else msg += n < 4 ? `${n} so far. Four or more make a fair sample.` : `${n} counts here.`;
  toast(msg, 5200); hud();
}
function doorSheet(d) {
  const ss = d.ids.map((i) => SESSION[i]).filter(Boolean), F = FIELD[G.place];
  sheet(d.label === 'Session room' ? PLACES[G.place].name + ': session room' : d.label, (p, close) => {
    if (F) p.append(el('p.note', G.samples.length ? `You have counted ${G.samples.length} time${G.samples.length > 1 ? 's' : ''} here (${F[0]}). Those counts go into the first round.` : `You have not counted anything here yet (${F[0]}: the yellow markers). You can go in anyway, and the first round will use invented rows.`));
    for (const x of ss) { const st = stateOf(x.id), def = BY_ID[x.id], go = () => { close(); sitIn(x, { sample: G.samples, bias: G.samples.length ? G.samples.filter((o) => o.zone === 'a').length / G.samples.length - 0.5 : 0 }, afterSession); };
      p.append(el('div.card', { style: { margin: '0.5rem 0' } }, [el('div.n', `${x.id} · Part ${PARTS[x.part].roman}${x.core ? ' · core' : ''}${st === 'done' ? ' · done' : ''}`), el('b', def?.name || x.plate[1]), el('div.note', x.plate[0] + ' · ' + x.plate[1] + ', ' + x.plate[2]), st === 'locked' ? el('div.note', `Opens with Part ${PARTS[x.part].roman}.`) : el('div.row', { style: { marginTop: '6px' } }, [el('button.btn' + (st === 'done' ? '.quiet' : '.go'), { onclick: go }, st === 'done' ? 'Sit in again' : 'Sit in'), st === 'done' ? el('button.btn.quiet', { onclick: () => { close(); workbench(x, G.samples); } }, 'Workbench') : null])])); }
  });
}
function afterSession(done) {
  setPatch(G.place === 'deckle' ? 'home' : seasonNow()); refresh(); if (!done) return;
  const prof = bossDue(); if (prof) { setTimeout(() => runBoss(prof, () => refresh()), 700); return; }
  for (const p of [1, 2, 3]) if (challengeOpen(p) && !S().challenges[p] && !S().intro['ch' + p]) { S().intro['ch' + p] = 1; save(); setTimeout(() => toast(`Every core session of Part ${PARTS[p].roman} is done. Challenge ${PARTS[p].roman} is open: see Ines at the Stacks, or the Pipeline page of your tablet.`, 8000), 600); return; }
  if (finaleOpen() && !S().finale?.done && !S().intro.fin) { S().intro.fin = 1; save(); setTimeout(() => toast('Every core session is done. Ines Varga is waiting at the Stacks. The board meets at the end of summer.', 9000), 600); return; }
  if (worldOK() && !S().intro.cam) { S().intro.cam = 1; save(); setTimeout(() => toast('Before you leave, you can frame a postcard with the Camera button.', 6000), 600); }
}
function afterChallenge(p, result) { if (result) { const first = !S().challenges[p]; S().challenges[p] = result; if (S().part < p + 1 && p < 4) S().part = p + 1; save(); if (first) toast(`Part ${PARTS[p + 1].roman} is open: ${PARTS[p + 1].title}. It is ${PARTS[p + 1].season}.`, 8000); if (G.place) enterPlace(G.place, { quiet: true }); } refresh(); }
function afterFinale(done) { if (done) { save(); enterPlace('deckle', { quiet: true, hour: 17 }); } else refresh(); }

// ---- the room above the bindery ----
function homeRoom() {
  sheet('Your room above the bindery', (p, close) => {
    const s = S(), c = counts(), st = stage(), pip = ['A drawing has been pushed under the door: a snail, in green crayon.', 'Under the door: a snail in a scarf. “It is cold” is written beside it.', 'Under the door: a snail looking at a screen with five squares on it. The snail looks cross.', 'Under the door: a snail with a question mark over its head, and a lighthouse.', 'Under the door: a snail at the top of a lighthouse. It has a book.'][st];
    const wall = el('div.wall'); s.postcards.slice(-9).forEach((pc, i) => wall.append(el('div.pin', { style: { '--rot': ((i * 37) % 7) - 3 + 'deg' } }, [el('img', { src: pc.img, alt: '' }), PLACES[pc.place].name])));
    wall.append(el('div.pin', { style: { '--rot': '2deg' }, onclick: () => { close(); alsoPlay(); } }, [el('div.img', { style: { background: 'linear-gradient(#f2d9a0, #e9b77a 55%, #5f7a55 56%)' } }), 'from Bellwether']));
    p.append(el('div.room', [el('div', [el('h3', 'The wall'), wall]), el('div', [el('h3', 'Under the door'), el('div.pipnote', pip), el('h3', 'On the shelf'), el('p', `Cabinet: ${c.eggs} of ${Object.keys(EGGS).length} finds. Margin notes: ${c.notes}. Field notes: ${Object.keys(s.fauna).length} kinds of animal.`), el('p', `Sessions done: ${c.done}. Solved cleanly: ${c.clean}. Taught: ${c.taught}.`), el('p.note', 'Folio is charging in the corner. Its tray still has a slot labelled “rare books”.'),
      el('div.row', [el('button.btn.quiet', { onclick: () => { close(); openTablet('notes'); } }, 'Open the cabinet'), el('button.btn.quiet', { onclick: () => { close(); family(); } }, 'Kitchen table'), s.wren ? el('button.btn.quiet', { onclick: () => { s.wren = false; save(); close(); toast('Wren stays home this time.'); refresh(); } }, 'Leave Wren at home') : null])])]));
  }, { wide: true });
}

// ---- map, camera, title ----
function showMap() { closeTalk(); closeTablet(); openMap({ here: G.place || 'deckle', canCarriage: true, onTravel: (id, o) => { if (o.carriage) carriageProblem(() => enterPlace(id)); else enterPlace(id); } }); }
function postcard() {
  const full = snapshot(3840); if (!full) return; sfx('find');
  const small = document.createElement('canvas'), w = 520, h = Math.round((full.height / full.width) * w); small.width = w; small.height = h; small.getContext('2d').drawImage(full, 0, 0, w, h);
  sheet('A postcard from ' + PLACES[G.place].name, (p, close) => {
    p.append(el('div.postcard', [el('img', { src: small.toDataURL('image/jpeg', 0.8), alt: 'The view you framed', style: { width: '100%', display: 'block' } }), el('p.hand', { style: { fontSize: '1.3rem', margin: '0.5rem 0.3rem 0' } }, PLACES[G.place].name + ', ' + seasonNow())]));
    p.append(el('div.row', [el('button.btn.go', { onclick: () => { const s = S(); s.postcards.push({ place: G.place, when: s.part, img: small.toDataURL('image/jpeg', 0.72) }); if (s.postcards.length > 24) s.postcards.shift(); save(); close(); toast('Pinned to the wall of your room.'); } }, 'Keep it'), el('button.btn.quiet', { onclick: () => { full.toBlob((b) => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `the-missing-variable-${G.place}.png`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 3000); }); } }, `Save the full picture (${full.width} × ${full.height})`), el('button.btn.quiet', { onclick: close }, 'Throw it back')]));
    p.append(el('p.note', 'Turn the view and zoom before you press Camera to frame it differently.'));
  });
}
function toTitle() {
  closeTalk(); closeTablet(); closeMap(); document.getElementById('hud-place')?.remove(); document.getElementById('hud-btns')?.remove(); document.getElementById('fallback')?.remove();
  if (worldOK()) { if (G.place !== 'deckle' || !kitNow()) loadPlace(RECIPES.deckle, { season: seasonNow(), hour: 17.2, seed: 'deckle', tags: TAGS.deckle, flags: { finale: !!S().finale?.done }, companions: { folio: true, wren: false } }); setMarkers([]); setAuto(true); setView({ az: 0.6, pol: 1.02, dist: 96 }); }
  G.place = null;
  showTitle({
    begin: () => { const go = () => { hideTitle(); introLetter(() => enterPlace('deckle', { hour: 9.5 })); }; if (S().started) { if (confirm('Begin again from the start? Your progress on this device will be cleared.')) { reset(); applySettings(); go(); } } else go(); },
    cont: () => { hideTitle(); enterPlace(S().place || 'deckle'); },
    map: () => { hideTitle(); enterPlace(S().place || 'deckle', { quiet: true }); showMap(); },
    guide: () => openTablet('guide'), onOptions: applySettings,
  });
}

// ---- start ----
load(); if (Q.has('unlock')) S().settings.openAll = true;
for (const f of ['400 16px Caveat', '600 16px Caveat', '400 14px "DM Mono"', '700 16px Atkinson']) document.fonts?.load(f);
initWorld(document.getElementById('scene'), document.getElementById('labels'), { gfx: Q.has('gfx') ? +Q.get('gfx') : S().settings.gfx });
onWorld({ active, onPick, onSlow: () => { if (!G.slowTold && !S().settings.smooth) { G.slowTold = true; toast('The picture is stuttering. Options has a Smooth setting and a lighter level of detail.', 7000); } } });
initTablet({ onOptions: applySettings, challenge: (p) => runChallenge(p, afterChallenge), finale: () => runFinale(afterFinale) });
document.getElementById('scene').addEventListener('pointerdown', () => { initAudio(); closeTalk(); });
window.addEventListener('pointerdown', initAudio, { once: true }); window.addEventListener('keydown', initAudio, { once: true });
window.addEventListener('keydown', (e) => {
  if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return; const k = e.key.toLowerCase();
  if (k === 't' && G.place && !document.querySelector('#ui .veil, #map, #title')) { tabletOpen() ? closeTablet() : openTablet(); return; }
  if (!active() || !G.place) return;
  if (k === 'm') showMap(); else if (k === 'c') postcard(); else if (worldOK()) { if (k === 'e') pickNearest('door'); else if (k === 'f') pickNearest('sample'); else if (k === 'n') pickNearest('npc'); else if (k === 'b') pickNearest('animal'); }
});
bus.on('progress', () => hud());
applySettings(); countVisit();
if (Q.has('place')) enterPlace(Q.get('place'), { quiet: true, hour: Q.has('hour') ? +Q.get('hour') : undefined }); else toTitle();
if (Q.has('open') && SESSION[Q.get('open')]) workbench(SESSION[Q.get('open')], []);
if (Q.has('sit') && SESSION[Q.get('sit')]) sitIn(SESSION[Q.get('sit')], { sample: [] }, afterSession);
if (Q.has('page')) ({ credits, also: alsoPlay, family, howto: howTo, sources, tablet: () => openTablet(Q.get('tab') || 'case'), map: showMap, finale: () => runFinale(afterFinale), challenge: () => runChallenge(+Q.get('n') || 1, afterChallenge), room: homeRoom, carriage: () => carriageProblem(() => {}, Q.get('id')), octavo: () => octavoChat(), boss: () => runBoss(Q.get('id') || 'average', () => {}) })[Q.get('page')]?.();
window.__game = { G, S, enterPlace, onPick };
