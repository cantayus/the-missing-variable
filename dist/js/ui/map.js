// The map: a diagram of lines, not a picture of the world. Stops are nodes, routes are edges.
import { el, clear, bus } from '../core/util.js';
import { S, save } from '../core/save.js';
import { PLACES, RAIL, AIR, REGIONS, route, isAir } from '../content/places.js';
import { SESSIONS, PARTS, sessionsAt } from '../content/sessions.js';
import { BY_ID } from '../instruments/index.js';
import { stateOf, isDone, nextSuggested } from '../core/game.js';
import { sfx } from '../audio/sound.js';

const NS = 'http://www.w3.org/2000/svg', sv = (tag, attrs = {}, kids = []) => { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); for (const c of [].concat(kids)) e.append(c); return e; };
export function closeMap() { document.getElementById('map')?.remove(); bus.emit('overlay'); }
// One click on a stop's name or dot sets off for it. Pointing at a stop (or tabbing to it) shows what is there.
// `go` names a stop to leave for at once, used by the "what to do next" list.
export function openMap({ here, onTravel, canCarriage, go = null }) {
  closeMap(); let shown = null, going = false;
  const svg = sv('svg', { viewBox: '40 40 1570 820', role: 'group', 'aria-label': 'Map of stops' }), info = el('div.panel.info'), next = nextSuggested();
  const puzzle = canCarriage ? el('label.row.note', { title: 'A puzzle to pass the time on journeys of three stops or more, and on flights' }, [el('input', { type: 'checkbox', checked: !!S().settings.carriage, onchange: (e) => { S().settings.carriage = e.target.checked; save(); } }), 'Carriage puzzle on long trips']) : null;
  const root = el('div#map', [el('header', [el('b', 'Where to?'), el('span.note', 'Click the name of a stop to travel there.'), el('span.grow'), puzzle, el('button.btn.quiet', { onclick: closeMap }, 'Close')]), el('div.mapgrid', [el('div.mapview', svg), info])]);
  for (const r of REGIONS) svg.append(sv('text', { x: r.x, y: r.y, 'font-size': 24, 'font-family': 'Caveat, cursive', fill: '#7c88a0' }, r.name));
  svg.append(sv('text', { x: 1330, y: 800, 'font-size': 22, 'font-family': 'Caveat, cursive', fill: '#7c88a0' }, 'far south'));
  const edgeEls = [], nodeEls = {};
  for (const [a, b] of RAIL) { const e = sv('line', { x1: PLACES[a].x, y1: PLACES[a].y, x2: PLACES[b].x, y2: PLACES[b].y, class: 'edge' }); svg.append(e); edgeEls.push([a, b, e]); }
  for (const [a, b] of AIR) { const A = PLACES[a], B = PLACES[b], mx = (A.x + B.x) / 2, my = Math.min(A.y, B.y) - 90 + (a === 'sf' && b === 'monash' ? 330 : 0); const e = sv('path', { d: `M${A.x} ${A.y} Q${mx} ${my} ${B.x} ${B.y}`, class: 'edge air' }); svg.append(e); edgeEls.push([a, b, e]); }
  const status = (id) => { const ss = sessionsAt(id); return { ss, done: ss.length && ss.every((x) => isDone(x.id)), open: ss.some((x) => stateOf(x.id) === 'open'), next: next && next.place === id }; };
  for (const [id, p] of Object.entries(PLACES)) {
    const st = status(id), cls = 'node' + (p.kind === 'co' ? ' co' : '') + (st.done ? ' done' : '') + (id === here ? ' here' : '') + (st.next ? ' next' : '') + (!st.open && !st.done && id !== 'deckle' ? ' locked' : '');
    const g = sv('g', { class: cls, tabindex: 0, role: 'button', 'aria-label': id === here ? p.name + ', you are here' : 'Travel to ' + p.name });
    g.append(sv('circle', { cx: p.x, cy: p.y, r: 30, class: 'hit' }));   // a roomier target than the dot itself
    g.append(p.kind === 'co' ? sv('rect', { x: p.x - 11, y: p.y - 11, width: 22, height: 22, rx: 3, class: 'dot' }) : sv('circle', { cx: p.x, cy: p.y, r: id === 'deckle' ? 16 : 12, class: 'dot' }));
    if (id === 'deckle') g.append(sv('circle', { cx: p.x, cy: p.y, r: 6, style: 'fill:#1c2b4a;stroke:none' }));
    g.append(sv('text', { x: p.x + 18, y: p.y + 6 }, p.name));
    const pick = () => { if (id === here) { show(id); sfx('tap'); } else travel(id); };
    g.addEventListener('click', pick); g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
    g.addEventListener('pointerenter', (e) => { if (e.pointerType !== 'touch') show(id); }); g.addEventListener('focus', () => show(id));
    svg.append(g); nodeEls[id] = g;
  }
  svg.addEventListener('pointerleave', () => show(null));
  function show(want) {
    if (going) return; const id = want || here; if (id === shown) return; shown = id;
    const p = PLACES[id], st = status(id), path = route(here, id), air = path.some((x, i) => i && isAir(path[i - 1], x));
    edgeEls.forEach(([a, b, e]) => { const on = path.some((x, i) => i && ((path[i - 1] === a && x === b) || (path[i - 1] === b && x === a))); e.classList.toggle('route', on && id !== here); });
    for (const [k, g] of Object.entries(nodeEls)) g.classList.toggle('sel', k === id && id !== here);
    clear(info); info.append(el('div.tag', (p.kind === 'home' ? 'home' : p.kind === 'co' ? 'company campus' : 'university') + (st.next && id !== here ? ' · your next session is here' : '')), el('h2', p.full), el('div.note', p.where));
    if (id !== here) info.append(el('div.row', { style: { margin: '0.7rem 0 0.4rem' } }, el('button.btn.go.big', { onclick: () => travel(id) }, 'Travel to ' + p.name)), el('p.note', path.map((x) => PLACES[x].name).join(' → ') + (air ? '. Part of the way is by air, overnight.' : '.')));
    else info.append(el('p.note', { style: { marginTop: '0.6rem' } }, 'You are here.'));
    info.append(el('p', p.blurb));
    if (st.ss.length) { info.append(el('h3', 'Sessions here')); for (const x of st.ss) { const s = stateOf(x.id); info.append(el('div', { style: { margin: '3px 0', color: s === 'locked' ? 'var(--ink3)' : 'inherit' } }, [el('span.mono', { style: { fontSize: '0.8em' } }, x.id + (x.core ? ' ● ' : '   ')), BY_ID[x.id]?.name || x.plate[1], s === 'done' ? ' ✓' : s === 'locked' ? ` (Part ${PARTS[x.part].roman})` : ''])); } }
    if (id === here) {   // the same journey as a plain list of names, for anyone who would rather not hunt on the map
      const open = Object.keys(PLACES).filter((k) => k !== here && status(k).open).sort((a, b) => (status(b).next ? 1 : 0) - (status(a).next ? 1 : 0) || route(here, a).length - route(here, b).length);
      if (open.length) info.append(el('h3', 'Stops with something open'), el('div.stops', open.map((k) => el('button.btn.small' + (status(k).next ? '.go' : ''), { onclick: () => travel(k), title: status(k).next ? 'Your next session is here' : '' }, PLACES[k].name))));
    }
    info.append(el('p.note.key', 'Filled dot: where you are. Thick ring: your next session. Dashed: opens in a later Part. Pale green: finished.'));
    info.scrollTop = 0;
  }
  function travel(id) {
    if (going || id === here || !PLACES[id]) return; show(id); going = true; const path = route(here, id), air = path.some((x, i) => i && isAir(path[i - 1], x));
    const carriage = !!canCarriage && !!S().settings.carriage && (path.length >= 4 || air);
    const calm = document.body.classList.contains('calm'), dot = sv('circle', { r: 11, fill: '#b8683f', stroke: '#fff', 'stroke-width': 3 }); svg.append(dot); root.classList.add('going');
    clear(info); info.append(el('div.tag', 'on the way'), el('h2', PLACES[id].full), el('p', path.map((x) => PLACES[x].name).join(' → ')), el('p.note', 'Tomas has set the signals.')); sfx('bell');
    const t0 = performance.now(), dur = calm ? 250 : Math.min(2200, 650 + path.length * 260);
    const step = (now) => { const f = Math.max(0, Math.min(1, (now - t0) / dur)), seg = Math.min(path.length - 2, Math.floor(f * (path.length - 1))), u = f * (path.length - 1) - seg, A = PLACES[path[seg]], B = PLACES[path[seg + 1]]; dot.setAttribute('cx', A.x + (B.x - A.x) * u); dot.setAttribute('cy', A.y + (B.y - A.y) * u); if (f < 1 && root.isConnected) requestAnimationFrame(step); else if (root.isConnected) { closeMap(); onTravel(id, { carriage, path }); } };
    requestAnimationFrame(step);
  }
  document.getElementById('ui').append(root); show(null); bus.emit('overlay');
  nodeEls[here]?.scrollIntoView({ block: 'center', inline: 'center' });   // on a narrow screen the map is wider than the window
  const key = (e) => { if (e.key === 'Escape') { closeMap(); window.removeEventListener('keydown', key); } }; window.addEventListener('keydown', key);
  if (go) travel(go);
}
