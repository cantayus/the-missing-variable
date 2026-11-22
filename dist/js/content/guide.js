// The Field Guide: every idea and method the player has met. Entries open when their session is done.
import { SESSIONS } from './sessions.js';
import { DEFS, VARIATIONS, FAMILY_OF, EXTRA } from './guide-defs.js';
const key = (s) => s.toLowerCase();
export const FAMILIES = ['Data and description', 'Charts', 'Chance and belief', 'Cause', 'Patterns and recommenders', 'Fitting lines', 'Preparing data', 'Clusters', 'Distance and neighbours', 'Text', 'Judging a model', 'Outliers', 'Vectors and matrices', 'Finding the lowest point', 'Keeping models simple', 'Mixtures and shadows', 'Trees and forests', 'Graphs', 'Neural networks', 'Rules, games and search', 'Seeing', 'Remembering', 'Making new things', 'Learning by reward', 'Fairness, choices and privacy', 'Language models', 'Looking inside', 'Folklore of data'];
export const ENTRIES = [];
for (const s of SESSIONS) {
  for (const c of s.covers) ENTRIES.push({ id: s.id + ':' + key(c), name: c, from: s.id, kind: 'idea', family: FAMILY_OF[s.id] || 'Data and description', def: DEFS[key(c)] || '' });
  for (const v of VARIATIONS[s.id] || []) ENTRIES.push({ id: s.id + ':v:' + key(v), name: v, from: s.id, kind: 'variation', family: FAMILY_OF[s.id] || 'Data and description', def: DEFS[key(v)] || '' });
}
for (const [name, family, def, from] of EXTRA) ENTRIES.push({ id: 'x:' + key(name), name, from, kind: 'extra', family, def });
export const entriesFor = (id) => ENTRIES.filter((e) => e.from === id);
