// Definitions, variations and families for the Field Guide, gathered from the three files beside this one.
import { DEFS1 } from './guide-defs1.js';
import { DEFS2 } from './guide-defs2.js';
import { VARS, FAMILY, FOLKLORE } from './guide-vars.js';

export const DEFS = { ...DEFS1, ...DEFS2 };
export const VARIATIONS = {};
for (const [id, list] of Object.entries(VARS)) { VARIATIONS[id] = list.map((v) => v[0]); for (const [name, def] of list) DEFS[name.toLowerCase()] = def; }
export const FAMILY_OF = {};
for (const [family, ids] of Object.entries(FAMILY)) for (const id of ids) FAMILY_OF[id] = family;
export const EXTRA = FOLKLORE.map(([name, def, from]) => [name, 'Folklore of data', def, from]);
