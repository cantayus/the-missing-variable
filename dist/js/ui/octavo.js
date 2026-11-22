// The library's chat window. Octavo is a real, very small language model, and the page says what it is.
import { el } from '../core/util.js';
import { sheet } from './pages.js';
import { RNG } from '../core/rng.js';
import { CASE } from '../sim/case-data.js';
import { reply, octavo } from '../octavo.js';

const STARTERS = ['Do you have a book about a snail?', 'What is the queen like?', 'I am looking for something to read on the train.', 'Why is a raven like a writing-desk?'];
let turn = 0;
export function octavoChat() {
  sheet('Octavo, at the Common Shelf', (p) => {
    const m = octavo();
    p.append(el('p.small', `Octavo is a language model you can read from end to end. It has read one book, Lewis Carroll’s “Alice’s Adventures in Wonderland” of 1865, which is ${m.size.toLocaleString('en')} words and marks long, and it knows ${m.words.toLocaleString('en')} different words. It picks each next word from the two before it. It does not understand the question. It carries on from your last words in the only voice it has.`));
    const log = el('div.chat'), inp = el('input', { type: 'text', placeholder: 'Ask Octavo something', 'aria-label': 'Your question', maxlength: 120 });
    const ask = (q) => { q = String(q || '').trim(); if (!q) return; const r = reply(q, new RNG(20261121 + ++turn * 977 + q.length), CASE);
      log.append(el('div.q', q), el('div.a', [el('div', r.text), el('div.small', 'You might like: ' + r.titles.join(' · '))])); inp.value = ''; log.scrollTop = log.scrollHeight; };
    p.append(log, el('form.row', { onsubmit: (e) => { e.preventDefault(); ask(inp.value); } }, [inp, el('button.btn.go', { type: 'submit' }, 'Ask')]));
    p.append(el('div.row', STARTERS.map((s) => el('button.btn.quiet.small', { onclick: () => ask(s) }, s))));
    p.append(el('p.small', 'Whatever you ask, the five titles underneath stay the same. They do not come from Octavo. They are the five most-borrowed titles on Marginalia’s list.'));
  }, { cls: 'octavo' });
}
