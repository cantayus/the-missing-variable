// Arguing with a professor. One claim at a time, three replies to choose from. A right reply knocks out one of the
// professor's certainties. A wrong one gives the professor heart, and one comes back. Nothing else can be lost.
import { el, clear } from '../core/util.js';
import { S, save } from '../core/save.js';
import { sheet } from './pages.js';
import { sfx, bossSound, bossMusic } from '../audio/sound.js';
import { RNG } from '../core/rng.js';
import { CASE } from '../sim/case-data.js';
import { SESSIONS } from '../content/sessions.js';
import { BOSSES, BOSS_ORDER } from '../content/bosses.js';
import { experiment } from '../sim/challenges.js';
import { octavo, generate, say } from '../octavo.js';

const INK = '#1c2740';
// A caricature in felt pen. mood: 0 sure of themselves, 1 rattled, 2 won over.
export function portrait(L, mood = 0) {
  const P = (d, fill, w = 5) => `<path d="${d}" fill="${fill}" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`;
  const mouth = mood === 2 ? 'M82 133 Q100 149 118 133' : mood === 1 ? 'M90 138 Q100 130 110 138 Q100 146 90 138 Z' : 'M82 138 Q100 130 118 138';
  let s = '<svg viewBox="0 0 200 230" aria-hidden="true">';
  if (L.kind === 'screen') {
    s += P('M60 230 L70 186 L130 186 L140 230 Z', L.gown) + P('M92 168 L108 168 L112 188 L88 188 Z', '#b9c4d6');
    s += `<rect x="34" y="62" width="132" height="108" rx="16" fill="#fffdf5" stroke="${INK}" stroke-width="5"/>`;
    s += `<circle cx="78" cy="106" r="6" fill="${INK}"/><circle cx="122" cy="106" r="6" fill="${INK}"/>`;
    s += mood === 1 ? P('M70 92 L88 86', 'none', 4) + P('M112 86 L130 92', 'none', 4) : '';
    s += P(mood === 2 ? 'M80 134 Q100 150 120 134' : mood === 1 ? 'M84 140 L92 134 L100 140 L108 134 L116 140' : 'M82 138 L118 138', 'none', 4);
    s += P('M30 50 L100 26 L170 50 L100 74 Z', INK, 4) + P('M150 56 L156 84', 'none', 4) + `<circle cx="157" cy="90" r="6" fill="#e69f00" stroke="${INK}" stroke-width="3"/>`;
    return s + '</svg>';
  }
  s += P('M20 230 Q28 168 100 162 Q172 168 180 230 Z', L.gown) + P('M78 165 L100 198 L122 165', '#fffdf5', 4);
  if (L.hair === 'bob') s += P('M42 118 Q30 36 100 30 Q170 36 158 118 L160 146 Q148 156 140 142 L140 84 L60 84 L60 142 Q52 156 40 146 Z', L.hairColor);
  if (L.hair === 'tufts') s += P('M54 96 Q30 100 28 82 Q16 70 32 60 Q30 44 50 48 Q58 52 56 66 Z', L.hairColor) + P('M146 96 Q170 100 172 82 Q184 70 168 60 Q170 44 150 48 Q142 52 144 66 Z', L.hairColor);
  if (L.hair === 'bun') s += `<circle cx="100" cy="30" r="21" fill="${L.hairColor}" stroke="${INK}" stroke-width="5"/>`;
  s += `<ellipse cx="46" cy="104" rx="8" ry="12" fill="${L.skin}" stroke="${INK}" stroke-width="4"/><ellipse cx="154" cy="104" rx="8" ry="12" fill="${L.skin}" stroke="${INK}" stroke-width="4"/>`;
  s += `<ellipse cx="100" cy="102" rx="52" ry="60" fill="${L.skin}" stroke="${INK}" stroke-width="5"/>`;
  if (L.hair === 'bun') s += P('M50 86 Q58 44 100 42 Q142 44 150 86 Q128 60 100 60 Q72 60 50 86 Z', L.hairColor);
  if (L.hair === 'bob') s += P('M54 82 Q70 50 100 48 Q130 50 146 82 Q122 66 100 68 Q78 66 54 82 Z', L.hairColor);
  if (L.hair === 'bald') s += P('M50 92 Q44 80 50 70', 'none', 4) + P('M150 92 Q156 80 150 70', 'none', 4);
  const brows = mood === 2 ? ['M66 86 L90 80', 'M110 80 L134 86'] : mood === 1 ? ['M66 78 L90 74', 'M110 80 L134 72'] : ['M66 78 L90 86', 'M110 86 L134 78'];
  s += P(brows[0], 'none', 5) + P(brows[1], 'none', 5);
  if (L.glasses === 'dark') s += `<rect x="62" y="90" width="34" height="20" rx="7" fill="${INK}"/><rect x="104" y="90" width="34" height="20" rx="7" fill="${INK}"/>` + P('M96 98 L104 98', 'none', 4);
  else { s += `<circle cx="80" cy="100" r="4.5" fill="${INK}"/><circle cx="120" cy="100" r="4.5" fill="${INK}"/>`;
    if (L.glasses === 'round') s += `<circle cx="80" cy="100" r="15" fill="none" stroke="${INK}" stroke-width="4"/><circle cx="120" cy="100" r="15" fill="none" stroke="${INK}" stroke-width="4"/>` + P('M95 100 L105 100', 'none', 4);
    if (L.glasses === 'monocle') s += `<circle cx="120" cy="100" r="16" fill="none" stroke="${INK}" stroke-width="4"/>` + P('M134 108 Q150 140 128 168', 'none', 3);
    if (L.glasses === 'half') s += P('M64 104 Q80 122 96 104', 'none', 4) + P('M104 104 Q120 122 136 104', 'none', 4) + P('M96 106 L104 106', 'none', 4); }
  s += P('M100 104 q-8 16 3 20', 'none', 4);
  s += P(mouth, mood === 1 ? INK : 'none', 4);
  if (L.extra === 'pearls') for (let i = 0; i < 7; i++) { const a = 0.5 + i * 0.36; s += `<circle cx="${(100 - Math.cos(a) * 30).toFixed(1)}" cy="${(170 + Math.sin(a) * 16).toFixed(1)}" r="5" fill="#fffdf5" stroke="${INK}" stroke-width="3"/>`; }
  if (L.extra === 'bowtie') s += P('M100 176 L78 164 L78 190 Z', '#e69f00', 4) + P('M100 176 L122 164 L122 190 Z', '#e69f00', 4) + `<circle cx="100" cy="177" r="6" fill="#e69f00" stroke="${INK}" stroke-width="4"/>`;
  if (L.extra === 'scarf') s += P('M58 160 Q100 184 142 160 L146 176 Q100 200 54 176 Z', '#d55e00', 4) + P('M118 180 L132 226 L112 226 L104 190 Z', '#d55e00', 4);
  if (L.extra === 'chain') s += P('M66 170 Q100 214 134 170', 'none', 4) + `<circle cx="100" cy="200" r="10" fill="#e69f00" stroke="${INK}" stroke-width="4"/>`;
  return s + '</svg>';
}

const facts = () => { const m = octavo(), g = generate(['said', 'the'], 14, new RNG((S().seed || 7) + 404), { temperature: 0.7, topK: 8 }); let w = g.words; const stop = w.findIndex((t, i) => i > 3 && /[.!?]/.test(t)); if (stop > 0) w = w.slice(0, stop + 1); return { size: m.size, words: m.words, line: 'Said the ' + say(w).replace(/^./, (c) => c.toLowerCase()) }; };
const trial = () => S().finale?.e || experiment({ pool: 'all', share: 0.2, split: true, months: 6, seed: S().seed || 20261121 });
const shuffled = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
export const roundsOf = (id, e) => BOSSES[id].rounds(CASE, e || trial(), id === 'octavo' ? facts() : null);

// Which professor, if any, is about to turn up. Each appears once a few sessions of their part are done.
export function bossDue() {
  const s = S(); s.bosses ||= {};
  for (const id of BOSS_ORDER) { const B = BOSSES[id]; if (B.final || s.bosses[id]) continue; if (SESSIONS.filter((x) => x.part === B.part && s.done[x.id]).length >= B.after) return id; }
  return null;
}
export const bossTally = () => { const b = S().bosses || {}; return { met: BOSS_ORDER.filter((id) => b[id]), won: BOSS_ORDER.filter((id) => b[id] === 'won') }; };

export function runBoss(id, done, opts = {}) {
  const B = BOSSES[id], R = roundsOf(id, opts.e), st = { phase: 'enter', i: 0, said: null, won: false };
  S().bosses ||= {}; if (!S().bosses[id]) { S().bosses[id] = 'met'; save(); }
  let reported = false, themeAt = 0; const report = () => { clearTimeout(themeAt); bossMusic(false); if (!reported) { reported = true; done?.(st.won); } };
  // the entrance is played once, and the theme comes in underneath when it has finished
  const lead = bossSound(B.final ? 'final' : 'enter'); themeAt = setTimeout(() => { if (!st.won) bossMusic(true, 0); }, Math.max(200, lead * 1000 - 300));
  sheet(null, (p, close) => {
    const pic = el('div.bosspic'), bar = el('div.certain'), bubble = el('div.bubble'), under = el('div.replies');
    p.append(el('div.bossgrid', [el('div.bossleft', [pic, el('div.plate', [el('b', B.name), el('span', B.chair)]), bar]), el('div.bossright', [bubble, under])]));
    const left = () => R.length - st.i, mood = () => (st.won ? 2 : left() <= Math.ceil(R.length / 2) ? 1 : 0);
    const paint = (shake) => {
      pic.innerHTML = portrait(B.look, mood()); pic.classList.remove('hit'); if (shake) { void pic.offsetWidth; pic.classList.add('hit'); }
      clear(bar); bar.append(el('span.small', st.won ? 'Won over' : `Certainties left: ${left()} of ${R.length}`), el('div.pips', R.map((_, k) => el('i' + (k < left() && !st.won ? '.on' : '')))));
    };
    const say1 = (who, text, cls = '') => { clear(bubble); bubble.className = 'bubble' + cls; bubble.append(el('div.who', who), el('div.says', text)); };
    const show = () => {
      clear(under);
      if (st.phase === 'enter') { paint(); say1(B.name, `“${B.intro}”`); under.append(el('p.small', B.enter), el('div.row', [el('button.btn.go', { onclick: () => { st.phase = 'ask'; show(); } }, 'Stand your ground'), el('button.btn.quiet', { onclick: close }, 'Not now')])); return; }
      if (st.phase === 'won') { paint(true); say1(B.name, id === 'octavo' ? B.win : `“${B.win}”`, ' good'); const t = bossTally(); under.append(el('p.small', `Professors won over: ${t.won.length}. You can argue with any of them again from the Notes page of your tablet.`), el('div.row', [el('button.btn.go', { onclick: close }, 'Carry on')])); return; }
      const r = R[st.i];
      if (st.phase === 'ask') { paint(); say1(B.name, `“${r.claim}”`); under.append(el('p.small', 'Your reply:')); shuffled([[r.yes[0], true, r.yes[1]], ...r.no.map((x) => [x[0], false, x[1]])]).forEach(([text, ok, back]) => under.append(el('button.reply', { onclick: () => {
        st.said = { text, ok, back, idea: r.idea };
        if (ok) { st.i++; bossSound('hit'); } else { st.i = Math.max(0, st.i - 1); bossSound('miss'); }
        bossMusic(st.i < R.length, st.i / R.length);
        st.phase = 'heard'; show(); } }, text))); return; }
      // heard: the professor answers back
      const h = st.said; paint(h.ok); say1(B.name, `“${h.back}”`, h.ok ? ' good' : ' bad');
      under.append(el('div.yousaid', [el('span.small', 'You said'), el('div', h.text)]));
      if (h.ok) under.append(el('p.small', `In the Field Guide: ${h.idea}.`)); else under.append(el('p.small', 'That gave the professor heart. One certainty is back.'));
      const last = h.ok && st.i >= R.length;
      under.append(el('div.row', [el('button.btn.go', { onclick: () => { if (last) { st.won = true; st.phase = 'won'; S().bosses[id] = 'won'; save(); bossMusic(false); bossSound('won'); sfx('file'); } else st.phase = 'ask'; show(); } }, last ? 'Wait for it' : h.ok ? 'Go on' : 'Try again')]));
    };
    show();
  }, { cls: 'boss', onClose: report });
}
