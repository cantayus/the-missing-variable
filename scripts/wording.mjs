// Dev helper: gather every sentence a player can read, and flag wording that reads as machine-made or as marketing.
// usage: node scripts/wording.mjs [dump.txt]
import fs from 'node:fs';
import { SESSIONS, PARTS, SUSPECTS } from '../dist/js/content/sessions.js';
import * as X from '../dist/js/content/extras.js';
import * as N from '../dist/js/content/npcs.js';
import { ENTRIES } from '../dist/js/content/guide.js';
import { PLACES } from '../dist/js/content/places.js';
import { ALL } from '../dist/js/instruments/index.js';
import { PROBLEMS } from '../dist/js/instruments/carriage.js';
import { CASE } from '../dist/js/sim/case-data.js';

const out = []; const add = (where, t) => { if (typeof t === 'string' && t.trim()) out.push([where, t]); };
const walk = (where, v) => { if (typeof v === 'string') add(where, v); else if (Array.isArray(v)) v.forEach((x, i) => walk(where, x)); else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(where + '.' + k, x); };
for (const s of SESSIONS) { walk('session ' + s.id + ' lines', s.lines); walk('session ' + s.id + ' qa', s.qa); add('session ' + s.id + ' ev', typeof s.ev === 'function' ? s.ev(CASE) : s.ev); add('session ' + s.id + ' talk', s.talk); add('session ' + s.id + ' wren', s.wren); walk('session ' + s.id + ' plate', s.plate); }
for (const d of ALL) { add('instrument ' + d.id + ' name', d.name); add('instrument ' + d.id + ' short', d.short); add('instrument ' + d.id + ' formula', d.formula); add('instrument ' + d.id + ' limit', d.limit); for (const r of ['play', 'twist', 'case']) { add('instrument ' + d.id + ' brief.' + r, d.rounds[r]?.brief); walk('instrument ' + d.id + ' hint.' + r, d.hints[r]); } walk('instrument ' + d.id + ' teach', d.teach); walk('instrument ' + d.id + ' two', d.two); }
walk('extras', X); walk('npcs', N); walk('parts', PARTS); walk('suspects', SUSPECTS);
for (const e of ENTRIES) { add('guide ' + e.from + ' ' + e.name, e.def); }
for (const p of Object.values(PLACES)) walk('place ' + (p.id || p.name), p);
for (const q of PROBLEMS) walk('carriage ' + q.id, q);
{ const { BOSSES } = await import('../dist/js/content/bosses.js'); const { experiment } = await import('../dist/js/sim/challenges.js'); const e = experiment({ pool: 'all', share: 0.2, split: true, months: 6 }); for (const [id, B] of Object.entries(BOSSES)) { walk('professor ' + id, [B.name, B.chair, B.enter, B.intro, B.win]); walk('professor ' + id + ' rounds', B.rounds(CASE, e, { size: 31210, words: 2655, line: 'Said the queen.' })); } }
// strings in the screen code: anything in quotes that reads like a sentence
for (const f of ['ui/pages.js', 'ui/session.js', 'ui/tablet.js', 'ui/map.js', 'ui/talk.js', 'ui/challenge.js', 'ui/finale.js', 'ui/octavo.js', 'ui/boss.js', 'main.js', 'instruments/frame.js']) { const src = fs.readFileSync(new URL('../dist/js/' + f, import.meta.url), 'utf8'); for (const m of src.matchAll(/(['`"])((?:\\.|(?!\1).)*?)\1/g)) { const t = m[2]; if (/[a-z] [a-z]+ [a-z]/.test(t) && !/^[.#]|=>|\bconst\b|\bfunction\b|[{};]$|^\s*$/.test(t) && t.length > 14) add('code ' + f, t); } }

const FLAGS = [
  [/—/, 'em dash'], [/ – /, 'spaced en dash'], [/\b(delve|tapestry|testament|realm|landscape|embark|unleash|unlock|harness|seamless|pivotal|crucial|vital|foster|elevate|vibrant|intricate|nuanced|multifaceted|myriad|plethora|showcase|boasts?|nestled|bustling|meticulous|underscore|game-changer|cutting-edge|state-of-the-art|revolutioni[sz]e|transformative|groundbreaking|ever-evolving|leverage[sd]?|utili[sz]e|robust|holistic|synergy|empower|supercharge|effortless|comprehensive|curated|immersive|beacon|treasure trove|deep dive|dive into|dives into)\b/i, 'stock word'],
  [/\b(at its core|in essence|in today’s|in the world of|when it comes to|it’s worth noting|it is worth noting|it’s important to|it is important to|plays a (key|crucial|vital) role|serves as a|stands as a|a testament to|not just|not only|more than just|rather than|whether you’re|whether you are|let’s|let us|imagine a|picture this|here’s the thing|the truth is|make no mistake|needless to say|in conclusion|ultimately|essentially|fundamentally|importantly|interestingly|remarkably|notably)\b/i, 'stock phrase'],
  [/\b(welcome to|get ready|ready to|join us|discover|explore the|journey)\b/i, 'brochure'], [/!/, 'exclamation mark'], [/\b\d+ (sessions|places|universities|instruments|entries|puzzles|dioramas|quotations)\b/i, 'count tagline'],
  [/\b(sister)\b/i, 'the word sister'], [/\b(AI-generated|generative AI|genAI|language model wrote|written by an AI)\b/i, 'mentions how it was made'],
  [/: [A-Z][^.]{3,40}\.$/, 'colon then punchline'], [/\b(really|truly|simply|just) [a-z]+\b.*\b(really|truly|simply|just)\b/i, 'two intensifiers'], [/;/, 'semicolon'],
];
const seen = new Set(); let n = 0; const tally = {};
for (const [where, t] of out) for (const [re, why] of FLAGS) if (re.test(t)) { const k = why + t; if (seen.has(k)) continue; seen.add(k); n++; tally[why] = (tally[why] || 0) + 1; console.log(`[${why}] ${where}: ${t.length > 220 ? t.slice(0, 220) + '…' : t}`); }
console.error(`${out.length} strings, ${out.reduce((s, x) => s + x[1].split(/\s+/).length, 0)} words, ${n} flags`, tally);
if (process.argv[2]) fs.writeFileSync(process.argv[2], out.map(([w, t]) => w + '\t' + t.replace(/\n/g, ' / ')).join('\n'));
