// Challenge IV: design an experiment on a small copy of the library, then answer for it in front of the board.
import { el, clear } from '../core/util.js';
import { S, save } from '../core/save.js';
import { sheet } from './pages.js';
import { sfx } from '../audio/sound.js';
import { CASE } from '../sim/case-data.js';
import { SESSION } from '../content/sessions.js';
import { experiment } from '../sim/challenges.js';
import { runBoss } from './boss.js';

const pc = (v, d = 0) => (v * 100).toFixed(d) + '%', signed = (v) => (v >= 0 ? '+' : '−') + Math.abs(v * 100).toFixed(0) + '%';
const POOLS = [['Any title in the catalogue', 'all'], ['Only titles that have hardly been borrowed', 'tail']];
const SHARES = [['One slot in twenty', 0.05], ['One slot in five', 0.2], ['Two slots in five', 0.4]];
const WHERE = [['Every branch', false], ['Two branches, with two left alone', true]];
const LENGTHS = [['One month', 1], ['Six months', 6], ['A year', 12]];
const seg = (label, options, value, set) => el('div.ctl', [el('label', label), el('div.seg', options.map(([name], i) => el('button' + (i === value ? '.on' : ''), { onclick: () => set(i) }, name)))]);

function cards(e) {
  const per100 = (v) => (v * 100 < 1 ? (v * 100).toFixed(2) : Math.round(v * 100));
  return [
    { key: 'shown', title: 'Shown by lot', body: [`A title picked by lot and put in a slot was borrowed ${per100(e.rate)} times for every 100 readers who saw it.`, `Give or take ${per100(2 * e.se)}, from ${e.shown.toLocaleString('en')} showings.`, `The same titles, left off the screen: ${per100(e.offRate)} times in 100.`] },
    { key: 'breadth', title: 'How widely readers ranged', body: e.split ? [`Trial branches: different titles borrowed each month went ${signed(e.breadthT)} against the year before.`, `Branches left alone: ${signed(e.breadthC)} over the same months.`] : [`All branches: different titles borrowed each month went ${signed(e.breadthT)} against the year before.`, 'There is nothing to set this beside.'] },
    { key: 'cost', title: 'What readers said, and the hit rate', body: e.split ? [`Survey score in the trial branches: ${e.surveyBefore.toFixed(2)} before, ${e.surveyT.toFixed(2)} during.`, `In the branches left alone: ${e.surveyCBefore.toFixed(2)} before, ${e.surveyC.toFixed(2)} during.`, `Hit rate in the trial branches: ${pc(e.hitBefore)} before, ${pc(e.hitT)} during.`] : [`Survey score: ${e.surveyBefore.toFixed(2)} before, ${e.surveyT.toFixed(2)} during.`, `Hit rate: ${pc(e.hitBefore)} before, ${pc(e.hitT)} during.`] },
  ];
}
const cardEl = (c, onclick, cls = '') => el('div.board.rcard' + cls, onclick ? { tabindex: 0, role: 'button', onclick, onkeydown: (ev) => { if (ev.key === 'Enter' || ev.key === ' ') onclick(); } } : null, [el('h4', c.title), ...c.body.map((t) => el('p', t))]);

export function runFinale(done) {
  const st = { pool: 0, share: 1, where: 0, len: 0, e: null, stage: 'design', q: 0, wrong: '' };
  let finished = false;
  sheet('Challenge IV: the experiment and the board', (p, close) => {
    const body = el('div'); p.append(body);
    const design = () => {
      clear(body);
      body.append(el('p', 'The board meets on the last Friday of summer. Ines Varga will not ask them to act on a hunch, so you are to try something on a small copy of the library first: put a title chosen by lot into some of the slots, and see what readers do.'));
      body.append(el('div.cols', [seg('What goes into those slots', POOLS, st.pool, (i) => { st.pool = i; st.e = null; design(); }), seg('How many slots', SHARES, st.share, (i) => { st.share = i; st.e = null; design(); }), seg('Where', WHERE, st.where, (i) => { st.where = i; st.e = null; design(); }), seg('For how long', LENGTHS, st.len, (i) => { st.len = i; st.e = null; design(); })]));
      body.append(el('div.row', [el('button.btn.go', { onclick: () => { st.e = experiment({ pool: POOLS[st.pool][1], share: SHARES[st.share][1], split: WHERE[st.where][1], months: LENGTHS[st.len][1], seed: S().seed || 20261121 }); sfx('page'); design(); } }, st.e ? 'Run it again' : 'Run the experiment')]));
      if (st.e) { body.append(el('h4', 'What came back'), el('div.cols', cards(st.e).map((c) => cardEl(c)))); body.append(el('p.small', 'The copy has 320 readers, 900 titles and four branches, and runs on the same rules as the simulation behind the whole case.')); body.append(el('div.row', [el('button.btn.go', { onclick: () => { st.stage = 'board'; st.q = 0; st.wrong = ''; meeting(); } }, 'Take it to the board')])); }
    };
    const QUESTIONS = [
      { who: 'Dov Achterberg, engineer', ask: `“Marginalia shows people what they were going to borrow anyway. That is what a hit rate of ${pc(CASE.y.hit[5])} means. Show me one figure that says otherwise.”`, want: 'shown',
        ok: (e) => e.enough, yes: (e) => `Dov reads the card twice. “You put titles up that nobody chose. Readers took them ${Math.round(e.rate / Math.max(e.offRate, 1e-6))} times as often as when they were on the shelf. So some of my hit rate is the screen agreeing with itself.” He writes that down.`, no: (e) => `“${e.shown.toLocaleString('en')} showings,” says Dov. “Give or take ${Math.round(2 * e.se * 100)} in a hundred. I would not rebuild anything on that.” He hands the card back.` },
      { who: 'The chair', ask: '“Did readers go further afield where you tried this? And further than what?”', want: 'breadth',
        ok: (e) => e.split && e.breadthT > (e.breadthC ?? 0) + 0.05, yes: (e) => `“${signed(e.breadthT)} where you tried it, ${signed(e.breadthC)} where you did not, in the same months.” The chair nods. “Then it was not the season.”`, no: (e) => (e.split ? '“The two sets of branches look much the same to me,” says the chair. “Was it too little, or too short?”' : '“Compared with last year,” says the chair. “A great deal changes between one year and the next. Which branches did you leave alone?” There were none.') },
      { who: 'The treasurer', ask: '“And what did it cost us? Were readers less pleased with what they took home?”', want: 'cost',
        ok: () => true, yes: (e) => `“${e.surveyBefore.toFixed(2)} before and ${e.surveyT.toFixed(2)} during,” the treasurer reads. “And the hit rate where it was. ${e.surveyT < e.surveyBefore - 0.015 ? 'A little lower. I can live with a little.' : 'I cannot see a cost in that.'}”`, no: () => '' },
    ];
    const meeting = () => {
      clear(body); const e = st.e, q = QUESTIONS[st.q];
      body.append(el('p.tag', `The board room at the Stacks · question ${st.q + 1} of 3`));
      body.append(el('p', [el('b', q.who + '. '), q.ask]));
      if (st.wrong) body.append(el('p.verdict', st.wrong));
      body.append(el('p.small', 'Hand over the card that answers it.'), el('div.cols', cards(e).map((c) => cardEl(c, () => {
        if (c.key !== q.want) { st.wrong = 'That card is about something else. The question is still on the table.'; meeting(); return; }
        st.wrong = ''; clear(body); const good = q.ok(e);
        body.append(el('p.tag', `The board room at the Stacks · question ${st.q + 1} of 3`), el('p', [el('b', q.who + '. '), q.ask]), cardEl(c, null, '.picked'), el('p.verdict' + (good ? '.good' : ''), good ? q.yes(e) : q.no(e)));
        body.append(el('div.row', [good ? el('button.btn.go', { onclick: () => { if (st.q < 2) { st.q++; meeting(); } else examiner(); } }, st.q < 2 ? 'Next question' : 'The vote') : el('button.btn.go', { onclick: () => { st.stage = 'design'; design(); } }, 'Ask for an adjournment and run it again')]));
      }, '.pick'))));
    };
    const examiner = () => {
      clear(body); body.append(el('p.tag', 'The board room at the Stacks'), el('p', 'Three questions, three answers. The chair looks round the table and reaches for the gavel.'), el('p', 'Then the door opens.'));
      const face = () => runBoss('nul', (won) => { if (won) ending(); else { clear(body); body.append(el('p', 'Professor Null is still in the board room, and the board will not vote while she objects.'), el('div.row', [el('button.btn.go', { onclick: face }, 'Go back in')])); } }, { e: st.e });
      body.append(el('div.row', [el('button.btn.go', { onclick: face }, 'Look up')]));
    };
    const ending = () => {
      clear(body); sfx('file');
      S().finale = { done: true, design: [POOLS[st.pool][0], SHARES[st.share][0], WHERE[st.where][0], LENGTHS[st.len][0]], rate: st.e.rate, breadth: st.e.breadthT, e: { ...st.e } }; S().challenges[4] = { pass: true }; save(); finished = true;
      body.append(el('p', 'The board votes on two things, and both pass. From Monday every screen at the Common Shelf keeps a record of what it showed. And for a year, at two branches, one slot in five will hold a title picked by lot.'));
      body.append(el('p', 'Professor Null abstains. The chair says afterwards that it is the nearest she has ever come to voting yes.'));
      body.append(el('table.data', [el('tr', ['reader', 'title', 'date', 'branch', 'shown'].map((h, i) => el('th' + (i === 4 ? '.new' : ''), h))), el('tr', ['R-0412', CASE.pip.name, 'Year 7, month 1', 'Weir Street', 'slot 5, by lot'].map((c) => el('td', c)))]));
      body.append(el('p', `That first Monday Pip Larch stands at the screen in the children’s room. Four of the five titles are the ones that are always there. The fifth is “${CASE.pip.name}”, which had not been borrowed since year ${CASE.pip.lastBorrowedYear} and had gone to the store. Pip does not say anything. Pip takes it to the desk.`));
      body.append(el('p', 'Ines Varga pins the old table of loans to the wall of her office, with the last column still blank, and writes one word above it in pencil.'));
      body.append(el('h4', 'What this story cannot tell you'));
      body.append(el('p.small', 'Deckle, the Common Shelf and every figure in the case are invented. They come from one simulation, written for this game, in which plain rules narrow what a town reads. That shows the paradox can happen. It does not show that it has happened in any real library, or how large it would be there. The people in the recordings are real, and so is their work. If you want to read how researchers have studied this in real systems, start here:'));
      body.append(el('ul.small', ['IV-15', 'III-19', 'I-6'].flatMap((id) => SESSION[id]?.src || []).map((c) => el('li', c))));
      body.append(el('div.row', [el('button.btn.go', { onclick: () => { close(); } }, 'Walk home along the river')]));
    };
    design();
  }, { wide: true, cls: 'finale', onClose: () => done(finished) });
}
