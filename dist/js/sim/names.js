// Invented titles, authors and branches for the Common Shelf. Nothing here is a real book.
import { RNG } from '../core/rng.js';
const A = ['Salt', 'Lantern', 'Orchard', 'Ferry', 'Thimble', 'Quarry', 'Harbour', 'Loom', 'Meadow', 'Signal', 'Paper', 'Winter', 'Copper', 'Tide', 'Willow', 'Marble', 'Ember', 'Thistle', 'Atlas', 'Kettle', 'Comet', 'Juniper', 'Granite', 'Sparrow', 'Velvet', 'Ladder', 'Compass', 'Barley', 'Mirror', 'Chalk'];
const B = ['Road', 'Keeper', 'Almanac', 'Letters', 'Garden', 'Machine', 'Season', 'Map', 'Question', 'House', 'Clock', 'Voyage', 'Ledger', 'Bridge', 'Notebook', 'Harvest', 'Window', 'Measure', 'Choir', 'Station', 'Field', 'Theory', 'Island', 'Engine', 'Lesson'];
const BY_FIELD = [
  ['A History of the {a} {b}', 'The {a} Kings', 'Lives of the {a} {b}', 'When the {a} {b} Fell', 'The {a} Century'],
  ['The {a} {b}', 'A {b} in {a}', '{a} and {b}', 'The Last {a} {b}', 'Songs of the {a} {b}'],
  ['The {a} {b} Explained', 'On {a} and Number', 'A Short Course in {a}', 'The {a} Constant', 'Why the {a} {b} Works'],
  ['Painting the {a} {b}', 'The {a} Studio', '{a} in Twelve Films', 'A {b} for Four Hands', 'The {a} Lens'],
  ['The {a} Vote', 'Minds and {b}s', 'The Price of {a}', 'Schools of the {a} {b}', 'The {a} Bargain'],
  ['Building the {a} {b}', 'The {a} Compiler', 'Circuits and {b}s', 'A {b} of Robots', 'The {a} Protocol'],
  ['Birds of the {a} {b}', 'The {a} Garden Year', 'Clouds over {a}', 'Stones of the {a} {b}', 'A Flora of {a}'],
  ['The {a} Who Kept the {b}', 'Little {a} and the {b}', 'Goodnight, {a} {b}', 'Ten {a} {b}s', 'The Very Quiet {b}'],
];
const FIRST = ['Ada', 'Bram', 'Cleo', 'Dov', 'Esme', 'Finn', 'Greta', 'Hale', 'Ines', 'Jory', 'Kit', 'Lune', 'Maren', 'Nico', 'Opal', 'Pell', 'Quill', 'Rhea', 'Soren', 'Tamsin', 'Una', 'Vale', 'Wim', 'Yara', 'Zed'];
const LAST = ['Ashdown', 'Birchall', 'Corvane', 'Dellow', 'Eastlake', 'Farrow', 'Glasswell', 'Hollin', 'Inkpen', 'Jessamy', 'Kestrow', 'Lindqvist', 'Marlowe-Reyes', 'Northcott', 'Okonjo', 'Pemberley', 'Quist', 'Ravenscar', 'Sandoval', 'Tolliver', 'Underhay', 'Vasquez-Lund', 'Whitlow', 'Yarrow', 'Zielinski'];
export const BRANCHES = ['The Stacks', 'Mill Lane', 'Junction', 'Weir Street', 'Hilltop', 'Canal Side', 'Old School', 'North Sidings'];
export const PIP_BOOK = 'The Snail Who Kept the Lighthouse';
export function titleName(t, field) { const r = new RNG(7919 * (t + 1)); return r.pick(BY_FIELD[field]).replace('{a}', r.pick(A)).replace('{b}', r.pick(B)); }
export function authorName(t) { const r = new RNG(104729 * (t + 3)); return r.pick(FIRST) + ' ' + r.pick(LAST); }
export function readerCode(r) { return 'R-' + String(1000 + ((r * 7919) % 9000)).padStart(4, '0'); }
