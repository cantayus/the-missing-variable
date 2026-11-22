// The three challenges that close Parts I, II and III. Each is one sheet: make an entry, hand it in, read the result.
import { el, clear } from '../core/util.js';
import { S } from '../core/save.js';
import { sheet } from './pages.js';
import { sfx } from '../audio/sound.js';
import { CASE } from '../sim/case-data.js';
import { WINDOWS, SHAPES, forecast, library, rank, audit } from '../sim/challenges.js';

const pc = (v, d = 1) => (v > 9.99 ? 'over 999%' : (v * 100).toFixed(d) + '%');
const seg = (label, options, value, set) => el('div.ctl', [el('label', label), el('div.seg', options.map(([name], i) => el('button' + (i === value ? '.on' : ''), { onclick: () => set(i) }, name)))]);
const board = (title, rows, lowerWins, note) => el('div.board', [el('h4', title), el('table.lb', rows.slice().sort((a, b) => (lowerWins ? a[1] - b[1] : b[1] - a[1])).map((r, i) => el('tr' + (r[2] ? '.me' : ''), [el('td', String(i + 1)), el('td', r[0]), el('td.mono', pc(r[1]))]))), note ? el('p.small', note) : null]);

// A small line chart in SVG: the record, the fitted line, the forecast, and (once handed in) what happened.
function chart(C, f, reveal) {
  const W = 640, H = 230, d = C.m.distinct, X = (m) => 40 + (m / 71) * (W - 56), lo = 600, hi = 2900, Y = (v) => H - 26 - ((Math.max(lo, Math.min(hi, v)) - lo) / (hi - lo)) * (H - 44);
  const path = (pts) => pts.map(([m, v], i) => (i ? 'L' : 'M') + X(m).toFixed(1) + ' ' + Y(v).toFixed(1)).join(' ');
  const rec = d.slice(0, 60).map((v, m) => [m, v]), after = d.slice(60).map((v, i) => [60 + i, v]);
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Different titles borrowed each month">`;
  for (let y = 1; y <= 6; y++) s += `<line x1="${X((y - 1) * 12)}" y1="14" x2="${X((y - 1) * 12)}" y2="${H - 26}" stroke="#d9d3c2" stroke-dasharray="3 4"/><text x="${X((y - 1) * 12 + 6)}" y="${H - 8}" text-anchor="middle" font-size="12" fill="#5b6478">year ${y}</text>`;
  for (const v of [1000, 1500, 2000, 2500]) s += `<text x="34" y="${Y(v) + 4}" text-anchor="end" font-size="11" fill="#5b6478">${v}</text>`;
  s += `<rect x="${X(60)}" y="14" width="${X(71) - X(60)}" height="${H - 40}" fill="#fff3c4" opacity="0.6"/>`;
  s += `<path d="${path(rec)}" fill="none" stroke="#1c2740" stroke-width="2.4" stroke-linejoin="round"/>`;
  s += `<path d="${path(f.fit)}" fill="none" stroke="#e69f00" stroke-width="2"/><path d="${path(f.ahead)}" fill="none" stroke="#e69f00" stroke-width="3" stroke-dasharray="7 5"/>`;
  if (reveal) s += `<path d="${path(after)}" fill="none" stroke="#1c2740" stroke-width="2.4"/>`;
  else s += `<text x="${X(66)}" y="30" text-anchor="middle" font-size="12" fill="#5b6478">not yet known</text>`;
  return el('div.chart', { innerHTML: s + '</svg>' });
}

function finish(p, close, done, result, words) { return el('div', [el('p.verdict.good', words), el('div.row', [el('button.btn.go', { onclick: () => { close(); done(p, result); } }, 'Take it to Ines Varga')])]); }

// ---- I. The forecast ----
function one(p, close, done) {
  const st = { w: 0, s: 2, sent: false }, body = el('div');
  const rivals = () => [['Dov Achterberg, engineer: the last year, bendy curve', forecast(CASE, 48, 6)], ['Wren: “the same as this year”', forecast(CASE, 48, 0)], ['Folio: all five years, straight line', forecast(CASE, 0, 1)]];
  const render = () => {
    clear(body); const f = forecast(CASE, WINDOWS[st.w][1], SHAPES[st.s][1]), rv = rivals();
    body.append(el('p', 'It is the end of year five. The board wants to know how many different titles will go out each month next year. You have the record so far. Make the forecast you would have made then.'));
    body.append(el('div.row', [seg('Learn from', WINDOWS, st.w, (i) => { st.w = i; st.sent = false; render(); }), seg('Shape of the forecast', SHAPES, st.s, (i) => { st.s = i; st.sent = false; render(); })]));
    body.append(chart(CASE, f, st.sent));
    const pub = board('The public board: how closely each entry fits the months it learned from', [...rv.map(([n, q]) => [n, q.pub, false]), ['Your entry', f.pub, true]], true, 'Lower is better. This is the average miss, as a share of the true figure.');
    const cols = el('div.cols', [pub]);
    if (st.sent) cols.append(board('What happened: the same entries, scored on year six', [...rv.map(([n, q]) => [n, q.hid, false]), ['Your entry', f.hid, true]], true, 'Nobody could see these twelve months when the entries went in.'));
    body.append(cols);
    if (!st.sent) body.append(el('div.row', [el('button.btn.go', { onclick: () => { st.sent = true; sfx('page'); render(); } }, 'Hand it in')]));
    else if (f.hid <= 0.1) body.append(finish(p, close, done, { pass: true, pub: f.pub, hid: f.hid, entry: [WINDOWS[st.w][0], SHAPES[st.s][0]] }, `Your forecast missed by ${pc(f.hid)} on average. The engineer\u2019s bendy curve had the best score on the public board and then missed by ${pc(rv[0][1].hid)}. It followed every wobble of the months it learned from, and went on bending into a year that had none of them.`));
    else body.append(el('p.verdict', `Your forecast missed year six by ${pc(f.hid)} on average. ${st.s === 2 ? 'The curve fitted the past closely and then kept bending.' : 'Look at where the record changes level. Should the early years count as much as the last one?'} Change the entry and hand it in again. Nothing is lost by trying.`));
  };
  render(); p.append(body);
}

// ---- II. The ranking ----
function two(p, close, done) {
  const L = library(S().seed || 7), st = { a: 10, b: 0, slot: false, sent: false }, body = el('div');
  const slider = (label, k) => { const out = el('output', String(st[k])), inp = el('input', { type: 'range', min: 0, max: 10, step: 1, value: st[k], 'aria-label': label }); inp.oninput = () => { st[k] = +inp.value; out.textContent = inp.value; st.sent = false; table(); }; return el('div.ctl', [el('label', [label, out]), inp]); };
  const res = el('div'), table = () => {
    clear(res); const q = rank(L, st.a, st.b, st.slot), dov = rank(L, 10, 0, false), fol = rank(L, 5, 5, false);
    const cols = el('div.cols', [board('The public board: hits against a held-out part of last year’s log', [['Dov Achterberg: most-borrowed only', dov.pub, false], ['Folio: half and half', fol.pub, false], ['Your ranking', q.pub, true]], false, 'Higher is better. Most loans in the log came off a screen showing the five most-borrowed titles.')]);
    if (st.sent) cols.append(board('What happened: one week with the screens switched off', [['Dov Achterberg: most-borrowed only', dov.hid, false], ['Folio: half and half', fol.hid, false], ['Your ranking', q.hid, true]], false, 'How often a reader, choosing from the open shelves, took one of the five titles your ranking would have shown them.'));
    res.append(cols, el('p.small', `Across all readers your ranking would show ${q.kinds} different titles. Dov’s shows ${dov.kinds}.`));
    if (!st.sent) res.append(el('div.row', [el('button.btn.go', { onclick: () => { st.sent = true; sfx('page'); table(); } }, 'Hand it in')]));
    else if (q.hid >= dov.hid + 0.03) res.append(finish(p, close, done, { pass: true, pub: q.pub, hid: q.hid, entry: [st.a, st.b, st.slot] }, `With the screens off, readers took one of your five ${pc(q.hid, 0)} of the time, against ${pc(dov.hid, 0)} for the ranking that topped the public board. The log rewarded whatever had been on the screen. The open shelves rewarded knowing the reader.`));
    else res.append(el('p.verdict', `With the screens off, readers took one of your five ${pc(q.hid, 0)} of the time, which is about what the most-borrowed list managed (${pc(dov.hid, 0)}). The public board is scored on a log that the old screen helped to write. What does a reader’s own history tell you that the bestseller list does not? Change the weights and hand it in again.`));
  };
  body.append(el('p', 'The board wants Marginalia rebuilt. You decide what the five suggestions are ranked by. There are two boards: the public one, which you can see now, and one week of real choices that nobody sees until the rankings are handed in.'));
  body.append(el('div.row', [slider('Weight on what was borrowed most last year', 'a'), slider('Weight on what this reader has borrowed before', 'b')]));
  body.append(el('label.ctl', { style: { display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'flex-start' } }, [el('input', { type: 'checkbox', onchange: (e) => { st.slot = e.target.checked; st.sent = false; table(); } }), 'Keep the fifth slot for a title that has hardly been borrowed']));
  body.append(res); table(); p.append(body);
}

// ---- III. The audit ----
function three(p, close, done) {
  const A = audit(CASE), st = { measure: -1, picks: [], says: -1, sent: false }, body = el('div');
  const MEASURES = ['One number for everyone: the hit rate', 'Different titles borrowed, group by group', 'Loans, group by group'];
  const SAYS = [`Marginalia is right ${pc(CASE.y.hit[5], 0)} of the time. No group is badly served. No action.`, 'Two groups have lost more than half the range of what they borrow. Before anything is changed, the library should start recording what each screen showed.', 'Marginalia is harmful and should be switched off this week.'];
  const render = () => {
    clear(body);
    body.append(el('p', 'Ines Varga has asked for an audit before the board meets: is anyone served worse than the rest? She will read whatever you hand in, so it has to stand on figures.'));
    body.append(el('h4', '1. Choose what to measure'), el('div.seg.tall', MEASURES.map((m, i) => el('button' + (i === st.measure ? '.on' : ''), { onclick: () => { st.measure = i; st.picks = []; st.sent = false; render(); } }, m))));
    if (st.measure === 0) body.append(el('p.note', `Year one: ${pc(CASE.y.hit[0], 0)}. Year six: ${pc(CASE.y.hit[5], 0)}. One figure for the whole town cannot show who it is an average of.`));
    if (st.measure === 2) body.append(el('table.lb.wide', [el('tr', [el('th', 'Group'), el('th', 'Loans, year one'), el('th', 'Loans, year six')]), ...A.rows.map((r) => el('tr', [el('td', r.name), el('td.mono', CASE.groups[r.key].loansFirst.toLocaleString('en')), el('td.mono', r.loans.toLocaleString('en'))]))]), el('p.note', 'Every group borrows about as much as it did. Counting loans does not show what the loans were.'));
    if (st.measure === 1) {
      body.append(el('h4', '2. Tap the two groups that lost the most'));
      body.append(el('table.lb.wide.pick', [el('tr', [el('th', 'Group'), el('th', 'Different titles, year one'), el('th', 'Year six'), el('th', 'Lost')]), ...A.rows.map((r) => el('tr' + (st.picks.includes(r.key) ? '.me' : ''), { tabindex: 0, role: 'button', onclick: () => { st.picks = st.picks.includes(r.key) ? st.picks.filter((k) => k !== r.key) : [...st.picks, r.key].slice(-2); st.sent = false; render(); }, onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') e.currentTarget.click(); } }, [el('td', r.name), el('td.mono', r.first.toLocaleString('en')), el('td.mono', r.last.toLocaleString('en')), el('td.mono', pc(r.drop, 0))]))]));
      body.append(el('h4', '3. Choose what the report says'), el('div.seg.tall', SAYS.map((m, i) => el('button' + (i === st.says ? '.on' : ''), { onclick: () => { st.says = i; st.sent = false; render(); } }, m))));
      const ready = st.picks.length === 2 && st.says >= 0;
      if (!st.sent) body.append(el('div.row', [el('button.btn.go', { disabled: !ready, onclick: () => { st.sent = true; sfx('page'); render(); } }, 'Hand it to Ines')]));
      else { const right = A.worst.every((k) => st.picks.includes(k));
        if (right && st.says === 1) body.append(finish(p, close, done, { pass: true, groups: st.picks, says: st.says }, `Ines reads it twice. “${A.rows.find((r) => r.key === A.worst[0]).name} and ${A.rows.find((r) => r.key === A.worst[1]).name.toLowerCase()}. They borrow as much as ever, from half as many titles. And you are not telling me to pull the plug. You are telling me what we failed to write down. That I can take to the board.”`));
        else if (!right) body.append(el('p.verdict', 'Ines checks your two groups against the table and shakes her head. “These are not the two that lost the most. Read the last column again.”'));
        else if (st.says === 0) body.append(el('p.verdict', 'Ines puts the page down. “Your own table says two groups lost more than half their range. Your conclusion says nobody is badly served. Which is it?”'));
        else body.append(el('p.verdict', 'Ines frowns. “Switched off, on what evidence? We know breadth fell. We do not yet know the screen did it. If I say this to the board and I am wrong, nobody listens to the next audit.”')); }
    }
  };
  render(); p.append(body);
}

export function runChallenge(n, done) {
  const names = { 1: 'Challenge I: the forecast', 2: 'Challenge II: the ranking', 3: 'Challenge III: the audit' }, build = { 1: one, 2: two, 3: three }[n];
  if (!build) { done(n, null); return; }
  let handed = false;
  sheet(names[n], (p, close) => build(p, close, (k, r) => { handed = true; done(k, r); }), { wide: true, cls: 'challenge', onClose: () => { if (!handed) done(n, null); } });
}
