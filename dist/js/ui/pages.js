// Title screen and the plain pages: how to play, options, sources, credits, the other game, the listening room, the family page.
import { CONFIG } from '../config.js';
import { el, add, clear, bus } from '../core/util.js';
import { S, save, reset, exportFile, importFile } from '../core/save.js';
import { QUOTES, HOWTO, KITCHEN, TWO_PLAYER } from '../content/extras.js';
import { SESSIONS, PARTS } from '../content/sessions.js';
import { counts, finaleOpen } from '../core/game.js';
import { initAudio, setVolumes, setPatch, patchNow, PATCH_NAMES, sfx, bossSound, bossMusic } from '../audio/sound.js';

const ui = () => document.getElementById('ui');
export function sheet(title, build, o = {}) {
  const veil = el('div.veil'), p = el('div.panel.sheet' + (o.wide ? '.wide' : '') + (o.cls ? '.' + o.cls : ''), { role: 'dialog', 'aria-label': title || 'Page' });
  const close = () => { if (!veil.isConnected) return; veil.remove(); window.removeEventListener('keydown', key); o.onClose?.(); bus.emit('overlay'); };
  const key = (e) => { if (e.key === 'Escape' && veil === [...ui().querySelectorAll('.veil')].pop()) { e.stopPropagation(); close(); } };
  if (!o.modal) { p.append(el('button.btn.quiet.small.x', { onclick: close }, 'Close')); veil.addEventListener('pointerdown', (e) => { if (e.target === veil) close(); }); window.addEventListener('keydown', key); }
  if (title) p.append(el('h2', title)); build(p, close); veil.append(p); ui().append(veil); bus.emit('overlay'); sfx('page');
  (p.querySelector('button.go') || p.querySelector('button'))?.focus({ preventScroll: true });
  return { el: p, close };
}
export function toast(text, ms = 3600) { document.querySelectorAll('.toast').forEach((t) => t.remove()); const t = el('div.panel.toast', { role: 'status' }, text); ui().append(t); setTimeout(() => t.remove(), ms); }

// ---- title: the town, the name of the game, and a short quiet list ----
export function showTitle(act) {
  document.getElementById('title')?.remove();
  const s = S(), q = QUOTES[Math.floor(Math.random() * QUOTES.length)], ended = !!s.finale?.done;
  const items = [['Begin', act.begin, false], ['Continue', act.cont, !s.started], ['How to play', () => howTo()], ['Map', act.map, !s.started], ['Field Guide', act.guide], ['Listening room', () => listening()], ['Options', () => options(act.onOptions)], ['Sources', () => sources()], ['Credits', () => credits()], ['Also play this!', () => alsoPlay()]];
  const menu = el('nav', { 'aria-label': 'Menu' }, items.filter((it) => !it[2]).map(([name, fn]) => el('button', { onclick: () => { initAudio(); sfx('tap'); fn(); } }, name)));
  menu.append(el('span.blank', { title: ended ? 'The fifth column' : 'A column with no name' }, ended ? 'shown' : '\u00a0'));
  const t = el('div#title', [el('h1', 'The Missing Variable'), menu, el('div.quote', [q[0], el('small', q[1])])]);
  ui().append(t); bus.emit('overlay'); menu.querySelector('button')?.focus({ preventScroll: true }); return t;
}
export const hideTitle = () => { document.getElementById('title')?.remove(); bus.emit('overlay'); };

export function howTo() { sheet('How to play', (p) => { p.append(el('p', 'You are a first-year student with a room above a bindery, a part-time job at a library, and a rail pass. The library has a puzzle. Each stop on the map teaches one idea and gives you one piece of evidence.')); for (const [h, t] of HOWTO) p.append(el('h3', h), el('p', t)); p.append(el('h3', 'Pace'), el('p', 'There are no timers and nothing to lose. The game saves by itself. Stop anywhere.')); }); }

export function options(onChange) {
  sheet('Options', (p) => {
    const st = S().settings, ch = () => { save(); setVolumes({ music: st.music, amb: st.amb, sfx: st.sfx }); document.documentElement.style.setProperty('--fs', st.text); document.body.classList.toggle('calm', !st.motion); onChange?.(); };
    const slider = (label, key, min = 0, max = 1, step = 0.05, show = (v) => Math.round(v * 100) + '%') => { const out = el('output', show(st[key])), inp = el('input', { type: 'range', min, max, step, value: st[key], 'aria-label': label, oninput: () => { st[key] = +inp.value; out.textContent = show(st[key]); ch(); } }); return el('div.ctl', [el('label', [label, out]), inp]); };
    const check = (label, key, note) => el('label.row', { style: { margin: '6px 0' } }, [el('input', { type: 'checkbox', checked: !!st[key], onchange: (e) => { st[key] = e.target.checked; ch(); } }), el('span', [label, note ? el('span.note', ' ' + note) : null])]);
    p.append(el('h3', 'Sound'), slider('Music', 'music'), slider('Wind and birds', 'amb'), slider('Effects', 'sfx'));
    p.append(el('h3', 'Reading'), slider('Text size', 'text', 0.85, 1.5, 0.05, (v) => Math.round(v * 100) + '%'), check('Motion', 'motion', '(off: no swaying, no camera drift)'), check('Folio speaks up while sampling', 'folioTalk'));
    p.append(el('h3', 'Picture'), el('div.ctl', [el('label', 'Detail'), el('div.seg', [['Light', 0], ['Standard', 1], ['Full, up to 4K', 2]].map(([n, v]) => el('button' + (st.gfx === v ? '.on' : ''), { onclick: (e) => { st.gfx = v; ch(); [...e.target.parentNode.children].forEach((b) => b.classList.toggle('on', b === e.target)); toast('Detail changes the next time a place loads.'); } }, n)))]), check('Smooth: lower the resolution a little when the picture stutters', 'smooth'));
    p.append(el('h3', 'For teachers and the impatient'), check('Open every Part and every session', 'openAll', '(the story reads best in order)'));
    p.append(el('h3', 'Your save'), el('div.row', [el('button.btn.quiet', { onclick: exportFile }, 'Save to a file'), el('label.btn.quiet', ['Load from a file', el('input', { type: 'file', accept: 'application/json', style: { display: 'none' }, onchange: async (e) => { try { await importFile(e.target.files[0]); toast('Loaded.'); location.reload(); } catch (err) { toast(err.message); } } })]), el('button.btn.quiet', { onclick: () => { if (confirm('Start over? This clears your progress on this device.')) { reset(); location.reload(); } } }, 'Start over')]), el('p.note', 'Your progress is kept in this browser.'));
  });
}

export function sources() {
  sheet('Sources', (p) => {
    p.append(el('p', 'Every session is about real work by real people. The recordings describe that work in the third person, and each plate says “Dramatization” because the settings and the staging are ours. Where a name is listed as credited, that person is named on the plate and here and is not shown.'), el('p', 'The Common Shelf, Deckle, Marginalia, Octavo, Folio, the Larch family and every reader, title and number in the case are invented. The numbers come from one seeded simulation that ships with the game.'));
    p.append(el('h3', 'Research behind the story'), el('p', 'Fleder and Hosanagar (2009), on recommenders and the diversity of sales. Chaney, Stewart and Engelhardt (2018), on algorithmic confounding. Schnabel and colleagues (2016), “Recommendations as Treatments”. Li, Chu, Langford and Schapire (2010), on randomized exposure in news recommendation. Shumailov and colleagues (2024), on models trained on their own output.'));
    for (const part of [1, 2, 3, 4]) { p.append(el('h3', 'Part ' + PARTS[part].roman + ': ' + PARTS[part].title)); const ul = el('ul', { style: { fontSize: '0.9em', paddingLeft: '1.1rem' } }); for (const x of SESSIONS.filter((q) => q.part === part)) for (const src of x.src) ul.append(el('li', src)); p.append(ul); }
    p.append(el('h3', 'Made with'), el('p.note', 'three.js (MIT licence). Typefaces: Atkinson Hyperlegible, DM Mono and Caveat (SIL Open Font Licence). Octavo’s reading is Lewis Carroll’s “Alice’s Adventures in Wonderland” of 1865, which is in the public domain. All pictures are drawn by the program. All sound is made in your browser.'));
  }, { wide: true });
}

// ---- credits ----
export const CREATOR = { name: 'Cantay Caliskan', letters: 'PhD, MBA', title: 'Associate Professor of Instruction in Data Science and Artificial Intelligence', site: 'https://www.cantaycaliskan.net/', photo: CONFIG.creatorPhoto };
export function credits() {
  sheet('Credits', (p) => {
    const pic = el('div.portrait', { style: { background: '#2f6f8f', width: '10.5rem', height: '13rem', fontSize: '2.4rem' } }, ['CC', el('small', 'portrait')]);
    if (CREATOR.photo) { const img = new Image(); img.onload = () => { clear(pic); pic.classList.add('photo'); img.style.cssText = 'width:100%;height:100%;object-fit:cover'; pic.append(img); }; img.src = CREATOR.photo; img.alt = 'Cantay Caliskan'; }
    p.classList.add('credits');
    p.append(el('div.me', [el('div', [pic, el('div', { style: { marginTop: '0.6rem' } }, el('span.plate', [el('b', 'Cantay Caliskan'), '. Deckle, this year. Not a dramatization.']))]), el('div', [
      el('p', { style: { fontSize: '1.15em', marginTop: 0 } }, [el('b', CREATOR.name), ', ' + CREATOR.letters + ', made this game.']),
      el('p', 'He is an ' + CREATOR.title + '. He has taught data science to more than 1,760 students since 2018, which is one reason every puzzle here can be undone.'),
      el('p', 'His research uses machine learning, networks, language and images to study how people and politics behave, and lately it includes video games. He also runs a summer institute in computational social science, and a research group with ten current members and seventy-five who have moved on.'),
      el('p', 'He speaks Turkish and German, some French and some Swedish, is learning Arabic, and reports that he cannot speak Latin fluently.'),
      el('p', el('a', { href: CREATOR.site, target: '_blank', rel: 'noopener' }, 'cantaycaliskan.net')),
    ])]));
    p.append(el('h3', 'Field Guide, specimen 000'), el('div.entry', { style: { cursor: 'default', maxWidth: '40rem' } }, [el('h4', 'Caliskan, C. (creator)'), el('p', 'Habitat: lecture halls, office hours, and the platform at Deckle around six in the evening. Identifying marks: a laptop, a plot on the screen, a question about your data. Often found between two fields. Harmless.')]));
    // one line cannot sort him
    const cv = el('canvas', { width: 520, height: 300, style: { width: '100%', maxWidth: '32rem', border: '1px solid var(--line2)', borderRadius: '4px', background: '#fff' } }), out = el('p.mono', ''), g = cv.getContext('2d'); let hidden = false, ang = 0.6;
    const pts = [[0.2, 0.25, 0], [0.3, 0.15, 0], [0.75, 0.8, 0], [0.85, 0.7, 0], [0.2, 0.8, 1], [0.28, 0.72, 1], [0.8, 0.2, 1], [0.72, 0.3, 1]], me = [0.5, 0.5];
    const draw = () => { g.clearRect(0, 0, 520, 300); g.font = '13px Atkinson, sans-serif'; g.fillStyle = '#4b5a76'; g.fillText('papers about people and politics →', 300, 290); g.save(); g.translate(14, 200); g.rotate(-Math.PI / 2); g.fillText('papers full of code and models →', 0, 0); g.restore();
      const X = (x) => 40 + x * 440, Y = (y) => 270 - y * 250; let right = 0;
      if (!hidden) { const nx = Math.cos(ang), ny = Math.sin(ang); g.strokeStyle = '#1c2b4a'; g.lineWidth = 2; g.beginPath(); g.moveTo(X(0.5 - ny), Y(0.5 + nx)); g.lineTo(X(0.5 + ny), Y(0.5 - nx)); g.stroke(); for (const q of pts) if (((q[0] - 0.5) * nx + (q[1] - 0.5) * ny > 0 ? 1 : 0) === q[2]) right++; }
      else { g.strokeStyle = '#1c2b4a'; g.lineWidth = 2; g.setLineDash([6, 4]); g.beginPath(); g.moveTo(X(0), Y(0.5)); g.lineTo(X(1), Y(0.5)); g.moveTo(X(0.5), Y(0)); g.lineTo(X(0.5), Y(1)); g.stroke(); g.setLineDash([]); right = 8; }
      for (const q of pts) { g.fillStyle = q[2] ? '#e69f00' : '#0072b2'; g.beginPath(); if (q[2]) g.rect(X(q[0]) - 6, Y(q[1]) - 6, 12, 12); else g.arc(X(q[0]), Y(q[1]), 7, 0, 7); g.fill(); }
      g.fillStyle = '#b8683f'; g.beginPath(); g.moveTo(X(me[0]), Y(me[1]) - 11); g.lineTo(X(me[0]) + 10, Y(me[1]) + 8); g.lineTo(X(me[0]) - 10, Y(me[1]) + 8); g.closePath(); g.fill(); g.fillStyle = '#1c2b4a'; g.fillText('C. C.', X(me[0]) + 14, Y(me[1]) + 4);
      out.textContent = hidden ? 'With a hidden layer: 8 of 8 sorted. Output for C. C.: both.' : `One line: ${Math.max(right, 8 - right)} of 8 sorted. Output for C. C.: undecided. Drag to turn the line.`; };
    cv.addEventListener('pointermove', (e) => { if (e.buttons && !hidden) { const r = cv.getBoundingClientRect(); ang = Math.atan2(-(e.clientY - r.top - r.height / 2), e.clientX - r.left - r.width / 2); draw(); } });
    p.append(el('h3', 'A perceptron tries to sort him'), el('p', 'Blue circles: political scientists. Orange squares: data scientists. Triangle: the creator of this game.'), cv, out, el('div.row', [el('button.btn', { onclick: (e) => { hidden = !hidden; e.target.textContent = hidden ? 'Take the hidden layer out' : 'Add a hidden layer'; draw(); } }, 'Add a hidden layer')])); draw();
    p.append(el('h3', 'His row in the loan log'), el('table.data', [el('tr', ['reader', 'title', 'date', 'branch', S().finale?.done ? 'shown' : ''].map((h, i) => el('th' + (i === 4 && !h ? '.blank' : ''), h || ' '))), el('tr', ['R-0001', 'The Missing Variable', 'this year', 'The Stacks', S().finale?.done ? 'no: he wrote it' : ''].map((c) => el('td', c)))]));
    p.append(el('h3', 'Also in this game'), el('p', 'The people whose work the sessions describe are listed under Sources. The Larch family, the staff of the Common Shelf and every reader are invented. He can be found in person on the platform at Deckle.'));
    p.append(el('h3', 'Thanks'), el('p', 'To the students who asked “but why?” until the slides got better.'));
  }, { wide: true });
}

export function alsoPlay() {
  sheet('Also play this!', (p) => {
    p.append(el('div.postcard', [el('div.art', [el('div', { style: { position: 'absolute', inset: 0, background: 'linear-gradient(#f2d9a0 0%, #e9b77a 45%, #7d8f6a 46%, #5f7a55 100%)' } }), el('div', { style: { position: 'absolute', left: '8%', bottom: '38%', width: '26%', height: '34%', background: '#b5533c', clipPath: 'polygon(0 100%, 0 30%, 50% 0, 100% 30%, 100% 100%)' } }), el('div', { style: { position: 'absolute', left: '40%', bottom: '38%', width: '14%', height: '52%', background: '#8c6a4f', clipPath: 'polygon(0 100%, 0 12%, 50% 0, 100% 12%, 100% 100%)' } }), el('div', { style: { position: 'absolute', right: '9%', bottom: '38%', width: '30%', height: '26%', background: '#c9a66b' } }), el('div.hand', { style: { position: 'absolute', left: '5%', top: '6%', fontSize: '2.1rem', color: '#3a2c22' } }, 'Greetings from Bellwether')]), el('p.hand', { style: { fontSize: '1.35rem', margin: '0.6rem 0.4rem 0.2rem' } }, 'You would like it here. They ask what the numbers mean for the people in them. Come and visit when your column is found.'), el('p.mono', { style: { fontSize: '0.75rem', margin: '0 0.4rem' } }, 'To: the room above the bindery, Deckle')]));
    p.append(el('h3', 'The Society Atlas'), el('p', 'The Society Atlas is the other game by the same author. It is about the social sciences: the people who study how societies work, and the campuses where they did it. If this game asks what the data say, that one asks about the people the data describe.'), el('p', 'It runs in a browser, like this one.'), el('div.row', [el('a.btn.go', { href: 'https://thesocietyatlas.net', target: '_blank', rel: 'noopener' }, 'Open thesocietyatlas.net')]));
  });
}

export function listening() {
  sheet('The listening room', (p) => {
    initAudio(); p.append(el('p', 'The music is played by the program as you listen, so no two hearings are the same. Choose a piece and leave it on.'));
    const list = el('div.teach'); for (const [k, name] of Object.entries(PATCH_NAMES)) list.append(el('button.btn' + (patchNow() === k ? '.go' : '.quiet'), { onclick: (e) => { setPatch(k); [...list.children].forEach((b) => { b.classList.toggle('go', b === e.target); b.classList.toggle('quiet', b !== e.target); }); } }, name)); p.append(list);
    p.append(el('p.note', 'During a session the music also follows the meter: as you get closer to the goal, a quiet tone rises.'));
    if (Object.keys(S().bosses || {}).length) { let on = false; p.append(el('h3', 'For professors'), el('div.row', [el('button.btn.quiet', { onclick: () => bossSound('enter') }, 'An entrance'), el('button.btn.quiet', { onclick: () => bossSound('final') }, 'The examiner’s entrance'), el('button.btn.quiet', { onclick: (e) => { on = !on; bossMusic(on, 0.4); e.target.textContent = on ? 'Stop the argument' : 'The argument'; } }, 'The argument'), el('button.btn.quiet', { onclick: () => bossSound('won') }, 'Won over')])); }
  }, { onClose: () => bossMusic(false) });
}

export function family() {
  sheet('For two, and for the kitchen table', (p) => {
    p.append(el('p', 'Two people can share one screen and one save. Before each Twist round the game shows a question to settle aloud. Below are games for two built on the instruments: one of you sets the puzzle, on paper or out loud, and the other solves it.'));
    const ul = el('ul'); for (const [id, name, how] of TWO_PLAYER) ul.append(el('li', [el('b', name + ' '), el('span.mono', { style: { fontSize: '0.8em' } }, id + '  '), how])); p.append(ul);
    p.append(el('div.row', [el('h3.grow', 'Kitchen table'), el('button.btn.quiet.small', { onclick: () => window.print() }, 'Print this page')]), el('p', 'Things to do away from the screen, with coins, cards, buttons, string or a bag of sweets.'));
    for (const part of ['I', 'II', 'III', 'IV']) { p.append(el('h3', 'Part ' + part)); const kt = el('div.kt'); for (const [pt, name, need, how] of KITCHEN) if (pt === part) kt.append(el('section', [el('b', name), el('div.note', 'You need: ' + need.toLowerCase() + '.'), el('div', how)])); p.append(kt); }
  }, { wide: true });
}

export function introLetter(then) {
  sheet(null, (p, close) => {
    p.append(el('div.tag', 'A note pinned to your door'), el('h2.hand', { style: { fontSize: '2rem' } }, 'Welcome to Deckle'),
      el('p', 'Your room is above the bindery. Mind the third stair. Odile Larch has the key if you lose yours, her son Tomas works the signal box, and Wren and Pip will find you whether you like it or not.'),
      el('p', 'Your job at the Stacks starts this morning. The head librarian, Ines Varga, has asked for you by name. She says she has two numbers that cannot both be good news, and a rail pass with your name on it.'),
      el('p', 'Folio will show you the way. It is the small robot by the door. It used to shelve books.'),
      el('p.hand', { style: { fontSize: '1.3rem' } }, 'P.S. The loan log on your tablet has a column with no name. Nobody knows what it was for. Ask around.'),
      el('div.row', { style: { marginTop: '1rem' } }, [el('button.btn.go', { onclick: () => { close(); then(); } }, 'Go downstairs')]));
  }, { modal: true });
}
