// One frame for every instrument: data in, state, a meter, three rounds, evidence out.
// An instrument is a plain object (see docs/DEVELOPMENT.md). Tests drive the same object without a browser.
import { Board } from './board.js';
import { el, clear, bus } from '../core/util.js';
import { RNG, hash } from '../core/rng.js';

export const ROUND_NAMES = { play: 'Play', twist: 'Twist', case: 'Case' };
const FOLIO = ['A nudge', 'A pointer', 'Show me'];

export function makeCtx(def, extra = {}) {
  const seed = extra.seed ?? 20261121;
  return { seed, rng: (tag = '') => new RNG(hash(def.id + ':' + seed + ':' + tag + ':' + (extra.example || 0) + (extra.attempt ? ':' + extra.attempt : ''))), sample: extra.sample || [], bias: extra.bias || 0, caseData: extra.caseData || null, variant: extra.variant || null, example: extra.example || 0, mode: extra.mode || 'session', two: extra.two || null };
}

// Deal a round. Data are drawn at random, so now and then a draw comes out already solved, or beyond what Folio's
// demonstration can do. Such a draw is thrown back and another is taken. The first draw is used if none will do.
export function deal(def, round, extra = {}) {
  let first = null;
  for (let attempt = 0; attempt < 40; attempt++) {
    const ctx = makeCtx(def, { ...extra, attempt }); ctx.round = round;
    const s = def.init(round, ctx); if (!first) first = { ctx, s };
    try { if (def.meter(s, ctx).met) continue; if (!def.demo) return { ctx, s }; const c = structuredClone(s); def.demo(c, ctx); if (def.meter(c, ctx).met) return { ctx, s }; } catch { continue; }
  }
  return first;
}

export function runInstrument(def, opts = {}) {
  const rounds = opts.rounds || ['play', 'twist', 'case'], host = opts.host || document.getElementById('ui');
  let ri = Math.max(0, rounds.indexOf(opts.start || rounds[0])), ctx, s, undo = [], usedDemo = false, hintLevel = 0, done = {}, raf = 0, last = 0, closed = false, variant = opts.variant || null, example = 0;
  const veil = el('div.veil'), panel = el('div.panel.table'), head = el('header'), boardEl = el('div.board'), canvas = el('canvas', { 'aria-label': def.name }), side = el('div.side'), live = el('div.sr', { 'aria-live': 'polite' });
  boardEl.append(canvas); panel.append(head, boardEl, side, live); veil.append(panel); host.append(veil);
  const b = new Board(canvas);
  const round = () => rounds[ri];
  function start(i) {
    ri = i; const d = deal(def, rounds[i], { ...opts.ctx, variant, example, mode: opts.mode || 'session' }); ctx = d.ctx; s = d.s;
    undo = []; hintLevel = 0; usedDemo = false; renderHead(); renderSide(); redraw();
    if (def.tick && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
  }
  function loop(now) { if (closed) return; const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now; if (def.tick && def.tick(s, dt, ctx)) { redraw(); refreshMeter(); } raf = requestAnimationFrame(loop); }
  function snap() { try { undo.push(structuredClone(s)); if (undo.length > 80) undo.shift(); } catch { /* state must stay plain data */ } }
  function redraw() { b.resize(); if (!b.w) return; def.draw(b, s, ctx); }
  function after() { redraw(); renderControls(); refreshMeter(); }
  let meterEl, ctlEl, doneEl, hintEl, faceEl;
  function refreshMeter() {
    const m = def.meter(s, ctx); if (!meterEl) return;
    clear(meterEl); meterEl.className = 'meter' + (m.met ? ' met' : '');
    meterEl.append(el('div.l', m.goal ? m.label + ' · ' + m.goal : m.label), el('div.v', m.text), el('div.track', [el('i', { style: { width: Math.round(Math.max(0, Math.min(1, m.frac ?? 0)) * 100) + '%' } })]));
    if (m.note) meterEl.append(el('div.note', m.note));
    live.textContent = def.describe ? def.describe(s, ctx) : `${m.label}: ${m.text}${m.goal ? ', ' + m.goal : ''}${m.met ? '. Goal met.' : ''}`;
    drawFolio(faceEl, m.frac ?? 0, !!m.met); bus.emit('meter', { frac: m.frac ?? 0, met: !!m.met, id: def.id });
    if (m.met && !done[round()]) { done[round()] = { clean: !usedDemo && (def.clean ? !!def.clean(s, ctx) : true), demo: usedDemo }; opts.onRound?.(round(), done[round()]); renderHead(); renderDone(); }
  }
  function renderHead() {
    clear(head);
    const tabs = rounds.map((r, i) => { const sp = el('span' + (i === ri ? '.on' : done[r] ? '.done' : ''), ROUND_NAMES[r] || r); if (opts.mode === 'workbench' || done[r] || i <= ri) { sp.style.cursor = 'pointer'; sp.tabIndex = 0; sp.onclick = () => start(i); sp.onkeydown = (e) => { if (e.key === 'Enter') start(i); }; } return sp; });
    // in a session the three rounds sit between the recording and the evidence card, numbered, so the way through is plain
    head.append(el('h2', def.name), opts.steps ? el('div.rounds.steps', [el('i.done', 'Recording'), ...tabs, el('i', 'Evidence')]) : el('div.rounds', tabs), el('div.grow'));
    if (def.formula) head.append(el('button.btn.quiet.small', { onclick: () => { const f = side.querySelector('.formula'); f.classList.toggle('hidden'); } }, 'Formula'));
    head.append(el('button.btn.quiet.small', { onclick: () => { if (undo.length) { s = undo.pop(); after(); } }, title: 'Undo the last move' }, 'Undo'), el('button.btn.quiet.small', { onclick: () => start(ri) }, 'Put it back'), el('button.btn.quiet.small', { onclick: close }, opts.mode === 'workbench' ? 'Close' : 'Step away'));
  }
  function renderSide() {
    clear(side); const R = def.rounds[round()] || {};
    side.append(el('div.tag', (ROUND_NAMES[round()] || round()) + (round() === 'case' ? ' · the Common Shelf · invented data' : opts.mode === 'workbench' ? ' · workbench' : ' · invented data')));
    side.append(el('div.brief', R.brief || ''));
    if (round() === 'twist' && opts.talk) side.append(el('div.wren', [el('b', opts.wren ? 'Wren asks: ' : 'Talk it over: '), opts.talk]));
    meterEl = el('div.meter'); faceEl = el('canvas.folioface', { width: 132, height: 104, 'aria-hidden': 'true' }); side.append(el('div.meterrow', [faceEl, meterEl]));
    ctlEl = el('div', { style: { display: 'grid', gap: '10px' } }); side.append(ctlEl);
    if (opts.mode === 'workbench') {
      const row = el('div', { style: { display: 'grid', gap: '8px' } });
      if (def.variants?.length) row.append(seg('Method', [{ label: def.short || 'As taught', value: null }, ...def.variants.map((v) => ({ label: v.name, value: v.id }))], variant, (v) => { variant = v; opts.onVariant?.(v); start(ri); }));
      const names = def.exampleNames ? def.exampleNames(ctx) : null;
      if (names) row.append(seg('Data', names.map((n, i) => ({ label: n, value: i })), example, (v) => { example = v; start(ri); }));
      row.append(el('button.btn.quiet.small', { onclick: () => { opts.ctx = { ...opts.ctx, seed: (opts.ctx?.seed ?? 1) + 1 }; start(ri); } }, 'Fresh data'));
      side.append(row);
    }
    side.append(el('div.formula.hidden', def.formula || ''));
    hintEl = el('div'); side.append(hintEl); renderHint();
    doneEl = el('div'); side.append(doneEl); renderDone(); renderControls(); refreshMeter();
  }
  function seg(label, options, value, set) { return el('div.ctl', [el('label', label), el('div.seg', options.map((o) => el('button' + (o.value === value ? '.on' : ''), { onclick: () => set(o.value) }, o.label)))]); }
  function renderControls() {
    if (!ctlEl) return; const list = def.controls ? def.controls(s, ctx) : [], focusIdx = [...ctlEl.querySelectorAll('input,button')].indexOf(document.activeElement); clear(ctlEl);
    for (const c of list) {
      if (c.type === 'slider') { const out = el('output', c.show ? c.show(c.value) : String(c.value)), inp = el('input', { type: 'range', min: c.min, max: c.max, step: c.step ?? 1, value: c.value, 'aria-label': c.label }); let first = true; inp.oninput = () => { if (first) { snap(); first = false; } c.set(+inp.value); out.textContent = c.show ? c.show(+inp.value) : inp.value; redraw(); refreshMeter(); }; inp.onchange = () => { first = true; after(); }; ctlEl.append(el('div.ctl', [el('label', [c.label, out]), inp])); }
      else if (c.type === 'buttons') ctlEl.append(seg(c.label || '', c.options, c.value, (v) => { snap(); c.set(v); after(); }));
      else if (c.type === 'button') ctlEl.append(el('button.btn' + (c.go ? '.go' : '.quiet'), { disabled: !!c.disabled, onclick: () => { snap(); c.run(); after(); } }, c.label));
      else if (c.type === 'toggle') ctlEl.append(el('label.ctl', { style: { display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'flex-start' } }, [el('input', { type: 'checkbox', checked: !!c.value, onchange: (e) => { snap(); c.set(e.target.checked); after(); } }), c.label]));
      else if (c.type === 'text') { const inp = el('input', { type: 'text', value: c.value || '', placeholder: c.placeholder || '', 'aria-label': c.label, style: { width: '100%', padding: '6px 8px', fontFamily: 'var(--mono)', border: '1px solid var(--line2)', borderRadius: '4px' } }); inp.oninput = () => { c.set(inp.value); redraw(); refreshMeter(); }; ctlEl.append(el('div.ctl', [el('label', c.label), inp])); }
      else if (c.type === 'note') ctlEl.append(el('div.note', c.text));
    }
    const f = [...ctlEl.querySelectorAll('input,button')][focusIdx]; if (f && focusIdx >= 0) f.focus();
  }
  function renderHint() {
    clear(hintEl); const hs = (def.hints && def.hints[round()]) || [];
    const txt = hintLevel > 0 ? (hs[hintLevel - 1] || (hintLevel === 3 ? 'Watch.' : 'Move one thing and watch the number.')) : null;
    hintEl.append(el('div.row', [el('button.btn.quiet.small', { onclick: () => { hintLevel = Math.min(3, hintLevel + 1); if (hintLevel === 3 && def.demo) { snap(); usedDemo = true; def.demo(s, ctx); after(); } renderHint(); } }, hintLevel < 3 ? 'Ask Folio: ' + FOLIO[hintLevel].toLowerCase() : 'Folio has shown you')]));
    if (txt) hintEl.append(el('div.folio', [el('b', 'FOLIO  '), txt]));
  }
  function renderDone() {
    if (!doneEl) return; clear(doneEl); const r = round(), d = done[r]; if (!d && opts.mode !== 'workbench') return;
    if (d) {
      if (def.limit && (r === 'case' || opts.mode === 'workbench' || rounds.length === 1)) doneEl.append(el('div.limit', def.limit));
      if (ri < rounds.length - 1) doneEl.append(el('div.row', { style: { marginTop: '10px' } }, [el('button.btn.go', { onclick: () => start(ri + 1) }, 'On to ' + (ROUND_NAMES[rounds[ri + 1]] || rounds[ri + 1]).toLowerCase())]));
      else if (opts.mode !== 'workbench') doneEl.append(el('div.row', { style: { marginTop: '10px' } }, [el('button.btn.go', { onclick: () => { const res = { done, state: s, ctx }; close(true); opts.onFinish?.(res); } }, opts.finishLabel || 'File the evidence')]));
    }
  }
  b.on.down = (id, x, y) => { snap(); def.down?.(s, id, x, y, ctx); if (def.down) after(); };
  b.on.drag = (id, x, y) => { if (def.drag) { def.drag(s, id, x, y, ctx); redraw(); refreshMeter(); } };
  b.on.up = (id, x, y, moved) => { def.up?.(s, id, x, y, ctx, moved); after(); };
  if (def.click) b.on.click = (x, y, id) => { def.click(s, x, y, id, ctx); after(); };
  if (def.hover) b.on.hover = (id, x, y) => { if (def.hover(s, id, x, y, ctx)) redraw(); };
  b.on.redraw = redraw;
  const ro = new ResizeObserver(() => redraw()); ro.observe(boardEl); document.fonts?.ready.then(() => { if (!closed) redraw(); });
  const key = (e) => { if (e.key === 'Escape') close(); if ((e.ctrlKey || e.metaKey) && e.key === 'z' && undo.length) { s = undo.pop(); after(); } };
  window.addEventListener('keydown', key);
  function close(finished = false) { if (closed) return; closed = true; cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener('keydown', key); veil.remove(); bus.emit('meter', { frac: 0, met: false, id: null }); if (!finished) opts.onClose?.({ done }); }
  start(ri);
  return { close, get state() { return s; }, get ctx() { return ctx; }, solveNow() { if (def.demo) { def.demo(s, ctx); after(); } return def.meter(s, ctx).met; }, next() { if (ri < rounds.length - 1) start(ri + 1); }, done };
}

// Folio watches the meter: doubtful at first, pleased when the goal is met.
function drawFolio(c, frac, met) {
  if (!c) return; const g = c.getContext('2d'), W = c.width, H = c.height, ink = '#1c2b4a'; g.clearRect(0, 0, W, H); g.lineJoin = 'round'; g.lineCap = 'round'; g.lineWidth = 4; g.strokeStyle = ink;
  g.beginPath(); g.moveTo(96, 30); g.lineTo(104, met ? 6 : 12); g.stroke(); g.fillStyle = met ? '#e69f00' : '#9aa3b2'; g.beginPath(); g.arc(104, met ? 6 : 12, 6, 0, 7); g.fill(); g.stroke();
  g.fillStyle = 'rgba(28,43,74,0.2)'; g.fillRect(24, 36, 92, 60); g.fillStyle = '#efe8d6'; g.fillRect(18, 28, 92, 60); g.strokeRect(18, 28, 92, 60);
  g.fillStyle = '#3a4250'; for (const x of [22, 86]) { g.beginPath(); g.arc(x + 9, 92, 9, 0, 7); g.fill(); }
  g.fillStyle = '#9fe8ff'; g.fillRect(28, 38, 72, 26); g.lineWidth = 3; g.strokeRect(28, 38, 72, 26);
  const open = met ? 0 : 3 + 6 * Math.min(1, frac); for (const x of [48, 80]) { g.beginPath(); if (met) { g.arc(x, 54, 8, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); } else { g.ellipse(x, 51, 5, open, 0, 0, 7); g.fillStyle = ink; g.fill(); } }
  g.lineWidth = 3.5; g.beginPath(); if (met) g.arc(64, 68, 12, 0.15, Math.PI - 0.15); else if (frac > 0.6) g.arc(64, 70, 9, 0.3, Math.PI - 0.3); else if (frac > 0.25) { g.moveTo(54, 76); g.lineTo(74, 76); } else g.arc(64, 82, 9, Math.PI + 0.4, -0.4); g.stroke();
}

// Without a browser: set up each round, let Folio demonstrate, and report whether the goal is met.
export function selfTest(def, extra = {}) {
  const out = {};
  for (const r of Object.keys(def.rounds)) { const { ctx, s } = deal(def, r, extra), before = def.meter(s, ctx); if (def.demo) def.demo(s, ctx); const after = def.meter(s, ctx); out[r] = { before: !!before.met, after: !!after.met, text: after.text }; }
  return out;
}
