// The map: a diagram of lines, not a picture of the world. Stops are nodes, routes are edges.
import { el, clear, bus } from '../core/util.js';
import { S } from '../core/save.js';
import { PLACES, RAIL, AIR, REGIONS, route, isAir } from '../content/places.js';
import { SESSIONS, PARTS, sessionsAt } from '../content/sessions.js';
import { BY_ID } from '../instruments/index.js';
import { stateOf, isDone, nextSuggested } from '../core/game.js';
import { sfx } from '../audio/sound.js';

const NS = 'http://www.w3.org/2000/svg', sv = (tag, attrs = {}, kids = []) => { const e = document.createElementNS(NS, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); for (const c of [].concat(kids)) e.append(c); return e; };
export function closeMap() { document.getElementById('map')?.remove(); bus.emit('overlay'); }
export function openMap({ here, onTravel, canCarriage }) {
  closeMap(); let sel = null, wantCarriage = false;
  const svg = sv('svg', { viewBox: '0 0 1600 900', role: 'img', 'aria-label': 'Map of stops' }), info = el('div.panel.info'), next = nextSuggested();
  const root = el('div#map', [el('header', [el('b', 'The lines of the Common Shelf'), el('span.note', 'Trains run along the solid lines. The night flight and the airship follow the dotted ones.'), el('span.grow'), el('button.btn.quiet', { onclick: closeMap }, 'Close')]), el('div', { style: { position: 'relative', minHeight: 0 } }, [svg, info])]);
  for (const r of REGIONS) svg.append(sv('text', { x: r.x, y: r.y, 'font-size': 22, 'font-family': 'Caveat, cursive', fill: '#7c88a0' }, r.name));
  svg.append(sv('text', { x: 1330, y: 800, 'font-size': 20, 'font-family': 'Caveat, cursive', fill: '#7c88a0' }, 'far south'));
  const edgeEls = [];
  for (const [a, b] of RAIL) { const e = sv('line', { x1: PLACES[a].x, y1: PLACES[a].y, x2: PLACES[b].x, y2: PLACES[b].y, class: 'edge' }); svg.append(e); edgeEls.push([a, b, e]); }
  for (const [a, b] of AIR) { const A = PLACES[a], B = PLACES[b], mx = (A.x + B.x) / 2, my = Math.min(A.y, B.y) - 90 + (a === 'sf' && b === 'monash' ? 330 : 0); const e = sv('path', { d: `M${A.x} ${A.y} Q${mx} ${my} ${B.x} ${B.y}`, class: 'edge air' }); svg.append(e); edgeEls.push([a, b, e]); }
  const status = (id) => { const ss = sessionsAt(id); return { ss, done: ss.length && ss.every((x) => isDone(x.id)), open: ss.some((x) => stateOf(x.id) === 'open'), next: next && next.place === id }; };
  for (const [id, p] of Object.entries(PLACES)) {
    const st = status(id), cls = 'node' + (p.kind === 'co' ? ' co' : '') + (st.done ? ' done' : '') + (id === here ? ' here' : '') + (st.next ? ' next' : '') + (!st.open && !st.done && id !== 'deckle' ? ' locked' : '');
    const g = sv('g', { class: cls, tabindex: 0, role: 'button', 'aria-label': p.name + (id === here ? ', you are here' : '') });
    g.append(p.kind === 'co' ? sv('rect', { x: p.x - 10, y: p.y - 10, width: 20, height: 20, rx: 3 }) : sv('circle', { cx: p.x, cy: p.y, r: id === 'deckle' ? 15 : 11 }));
    if (id === 'deckle') g.append(sv('circle', { cx: p.x, cy: p.y, r: 6, style: 'fill:#1c2b4a;stroke:none' }));
    g.append(sv('text', { x: p.x + 16, y: p.y + 5, 'font-size': 17 }, p.name));
    const pick = () => { sel = id; show(); sfx('tap'); }; g.addEventListener('click', pick); g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } }); svg.append(g);
  }
  function show() {
    const id = sel || here, p = PLACES[id], st = status(id), path = route(here, id), air = path.some((x, i) => i && isAir(path[i - 1], x));
    edgeEls.forEach(([a, b, e]) => { const on = path.some((x, i) => i && ((path[i - 1] === a && x === b) || (path[i - 1] === b && x === a))); e.classList.toggle('route', on && id !== here); });
    clear(info); info.append(el('div.tag', p.kind === 'home' ? 'home' : p.kind === 'co' ? 'company campus' : 'university'), el('h2', p.full), el('div.note', p.where), el('p', p.blurb));
    if (st.ss.length) { info.append(el('h3', 'Sessions here')); for (const x of st.ss) { const s = stateOf(x.id); info.append(el('div', { style: { margin: '3px 0', color: s === 'locked' ? 'var(--ink3)' : 'inherit' } }, [el('span.mono', { style: { fontSize: '0.8em' } }, x.id + (x.core ? ' ● ' : '   ')), BY_ID[x.id]?.name || x.plate[1], s === 'done' ? ' ✓' : s === 'locked' ? ` (Part ${PARTS[x.part].roman})` : ''])); } }
    if (id !== here) {
      info.append(el('h3', 'Route'), el('p.note', path.map((x) => PLACES[x].name).join(' → ') + (air ? '. Part of the way is by air, overnight.' : '.')));
      const long = path.length >= 4 || air; if (long && canCarriage) info.append(el('label.row', [el('input', { type: 'checkbox', onchange: (e) => { wantCarriage = e.target.checked; } }), 'Open a carriage problem on the way']));
      info.append(el('div.row', { style: { marginTop: '0.6rem' } }, el('button.btn.go', { onclick: () => travel(id, path) }, 'Travel to ' + p.name)));
    } else info.append(el('p.note', 'You are here.'), el('div.row', el('button.btn', { onclick: closeMap }, 'Stay')));
  }
  function travel(id, path) {
    const calm = document.body.classList.contains('calm'), dot = sv('circle', { r: 9, fill: '#b8683f', stroke: '#fff', 'stroke-width': 3 }); svg.append(dot); clear(info); info.append(el('h2', 'On the way'), el('p', path.map((x) => PLACES[x].name).join(' → ')), el('p.note', 'Tomas has set the signals.')); sfx('bell');
    const t0 = performance.now(), dur = calm ? 300 : Math.min(3200, 900 + path.length * 450);
    const step = (now) => { const f = Math.min(1, (now - t0) / dur), seg = Math.min(path.length - 2, Math.floor(f * (path.length - 1))), u = f * (path.length - 1) - seg, A = PLACES[path[seg]], B = PLACES[path[seg + 1]]; dot.setAttribute('cx', A.x + (B.x - A.x) * u); dot.setAttribute('cy', A.y + (B.y - A.y) * u); if (f < 1 && root.isConnected) requestAnimationFrame(step); else if (root.isConnected) { closeMap(); onTravel(id, { carriage: wantCarriage, path }); } };
    requestAnimationFrame(step);
  }
  document.getElementById('ui').append(root); show(); bus.emit('overlay');
  const key = (e) => { if (e.key === 'Escape') { closeMap(); window.removeEventListener('keydown', key); } }; window.addEventListener('keydown', key);
}
