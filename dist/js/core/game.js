// Progress rules: what is open, what is done, and what the evidence adds up to.
import { S, save } from './save.js';
import { SESSIONS, SESSION, PARTS, sessionsIn } from '../content/sessions.js';
import { bus } from './util.js';

export const openAll = () => !!S().settings.openAll;
export const partOpen = (p) => p === 1 || openAll() || !!S().challenges[p - 1];
export const isDone = (id) => !!S().done[id]?.solved;
export const stateOf = (id) => (isDone(id) ? 'done' : partOpen(SESSION[id].part) ? 'open' : 'locked');
export const coreLeft = (p) => sessionsIn(p).filter((s) => s.core && !isDone(s.id));
export const challengeOpen = (p) => partOpen(p) && (openAll() || coreLeft(p).length === 0);
export const finaleOpen = () => openAll() || ([1, 2, 3, 4].every((p) => coreLeft(p).length === 0) && [1, 2, 3].every((p) => S().challenges[p]));
export const currentPart = () => { let p = 1; for (let q = 2; q <= 4; q++) if (partOpen(q) && (S().challenges[q - 1] || S().part >= q)) p = q; return p; };
export const seasonNow = () => PARTS[Math.max(1, Math.min(4, S().part || 1))].season;
export function counts() { const s = S(); return { done: SESSIONS.filter((x) => isDone(x.id)).length, core: SESSIONS.filter((x) => x.core && isDone(x.id)).length, clean: SESSIONS.filter((x) => s.done[x.id]?.clean).length, taught: SESSIONS.filter((x) => s.done[x.id]?.taught).length, eggs: Object.keys(s.eggs).length, notes: Object.keys(s.notes).length, cards: s.postcards.length }; }
// how strongly the filed evidence points at each suspect: -1 (ruled out) to +1
export function suspectScores() { const tot = [0, 0, 0, 0, 0, 0], max = [0, 0, 0, 0, 0, 0]; for (const x of SESSIONS) for (const [k, v] of x.sus) { max[k] += Math.abs(v); if (S().evidence[x.id]) tot[k] += v; } return [1, 2, 3, 4, 5].map((k) => ({ k, score: tot[k], max: max[k], frac: max[k] ? tot[k] / max[k] : 0 })); }
export function complete(id, res = {}) {
  const s = S(), d = (s.done[id] ||= {}); d.solved = true; if (res.clean) d.clean = true; if (res.taught) d.taught = true; s.evidence[id] = true;
  const part = SESSION[id].part; if (part > s.part) s.part = part; save(); bus.emit('progress', id);
}
export function markVariant(id, v) { const d = (S().done[id] ||= {}); (d.var ||= {})[v] = true; save(); }
export function nextSuggested(place) { // the next unfinished session in roster order, preferring core, within open Parts
  const open = SESSIONS.filter((x) => stateOf(x.id) === 'open'); return open.find((x) => x.core) || open[0] || null;
}
