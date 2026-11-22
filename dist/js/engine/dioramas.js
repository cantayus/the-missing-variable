// Registry of place recipes. Each recipe lays out one diorama with the kit.
import { deckle } from './places_home.js';
import { PLACES_ONE } from './places_one.js';
import { PLACES_TWO } from './places_two.js';
import { PLACES_CO } from './places_co.js';

export const RECIPES = { deckle, ...PLACES_ONE, ...PLACES_TWO, ...PLACES_CO };
// What kind of country a place is in: it decides which animals turn up.
export const TAGS = {
  deckle: ['woods'], ibm: ['woods'], rensselaer: ['woods'], cornell: ['woods'], berkeley: ['woods'], santafe: ['desert'], cranfield: ['rural'],
  mit: ['sea', 'city'], wisconsin: ['sea'], google: ['sea'], meta: ['sea'], sf: ['sea', 'city'], eth: ['sea'], cambridge: ['rural'],
  london: ['city'], berlin: ['city'], manchester: ['city'], amsterdam: ['city'], toronto: ['city'], montreal: ['city'], columbia: ['city'], amazon: ['city'], harvard: ['city'],
};
