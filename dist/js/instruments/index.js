// Every instrument in the game, by session id.
import { PART1A } from './part1a.js';
import { PART1B } from './part1b.js';
import { PART1C } from './part1c.js';
import { PART2A } from './part2a.js';
import { PART2B } from './part2b.js';
import { PART3A } from './part3a.js';
import { PART3B } from './part3b.js';
import { PART4A } from './part4a.js';
import { PART4B } from './part4b.js';
export const ALL = [...PART1A, ...PART1B, ...PART1C, ...PART2A, ...PART2B, ...PART3A, ...PART3B, ...PART4A, ...PART4B];
export const BY_ID = Object.fromEntries(ALL.map((d) => [d.id, d]));
