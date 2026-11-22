// All seventy-six sessions, the four Parts, the five suspects and the pipeline.
import { PART1, PART2 } from './sessions1.js';
import { PART3, PART4 } from './sessions2.js';
export const SESSIONS = [...PART1, ...PART2, ...PART3, ...PART4];
export const SESSION = Object.fromEntries(SESSIONS.map((s) => [s.id, s]));
export const PARTS = [null,
  { n: 1, roman: 'I', season: 'fall', title: 'What the data say', sub: 'Data mining', challenge: 'Forecast next month’s loans' },
  { n: 2, roman: 'II', season: 'winter', title: 'Learning from data', sub: 'Statistical learning', challenge: 'Rebuild the ranking model' },
  { n: 3, roman: 'III', season: 'spring', title: 'Thinking machines', sub: 'Artificial intelligence', challenge: 'Audit Marginalia' },
  { n: 4, roman: 'IV', season: 'summer', title: 'Language models, and the missing column', sub: 'How a language model works', challenge: 'The experiment and the board' },
];
export const SUSPECTS = [null,
  { n: 1, name: 'Readers changed', say: 'People simply want fewer kinds of book than they used to.' },
  { n: 2, name: 'The collection changed', say: 'Books went to off-site storage, so there is less to choose from.' },
  { n: 3, name: 'The count is wrong', say: 'The numbers in the report are an accident of how loans were logged.' },
  { n: 4, name: 'The engine is simply better', say: 'Marginalia has learned what readers want and gives it to them.' },
  { n: 5, name: 'The engine narrowed them', say: 'What is shown gets borrowed, what is borrowed gets logged, and what is logged decides what is shown.' },
];
export const SLOTS = ['collect', 'clean', 'describe', 'engineer', 'model', 'evaluate', 'explain'];
export const sessionsAt = (place) => SESSIONS.filter((s) => s.place === place);
export const sessionsIn = (part) => SESSIONS.filter((s) => s.part === part);
// What to count at each stop. [what, unit, busy-zone range, quiet-zone range]
export const FIELD = {
  deckle: ['books on each returns trolley', 'books', [9, 22], [1, 6]], yale: ['bicycles at each rack', 'bicycles', [8, 20], [1, 6]], princeton: ['people on each bench', 'people', [2, 5], [0, 2]], harvard: ['chess moves in a minute', 'moves', [6, 14], [1, 5]],
  mit: ['boats passing in a minute', 'boats', [3, 9], [0, 3]], illinois: ['squirrels in each tree', 'squirrels', [2, 6], [0, 2]], rensselaer: ['steps on each staircase', 'steps', [18, 40], [4, 12]], gottingen: ['geese at each fountain', 'geese', [3, 9], [0, 3]],
  maryland: ['turtles sunning on each log', 'turtles', [2, 7], [0, 2]], edinburgh: ['umbrellas on each street', 'umbrellas', [6, 16], [1, 5]], wisconsin: ['chairs taken on the terrace', 'chairs', [8, 20], [2, 7]], stanford: ['bicycles passing in a minute', 'bicycles', [7, 18], [1, 5]],
  munich: ['surfers waiting at the wave', 'surfers', [3, 10], [0, 3]], eth: ['trams in ten minutes', 'trams', [3, 8], [0, 3]], cambridge: ['punts on each stretch of river', 'punts', [3, 9], [0, 3]], london: ['pigeons on each square', 'pigeons', [8, 22], [1, 6]],
  cranfield: ['aircraft on each stand', 'aircraft', [1, 5], [0, 2]], monash: ['cockatoos in each gum tree', 'cockatoos', [2, 9], [0, 2]], unc: ['people queueing at the well', 'people', [3, 10], [0, 3]], columbia: ['readers on the library steps', 'readers', [8, 20], [1, 6]],
  berkeley: ['bells heard in a minute', 'bells', [2, 8], [0, 2]], santafe: ['lizards on each wall', 'lizards', [2, 6], [0, 2]], cornell: ['people on each path up the slope', 'people', [5, 14], [1, 4]], ucsd: ['skateboards passing in a minute', 'skateboards', [3, 9], [0, 3]],
  toronto: ['streetcars in ten minutes', 'streetcars', [3, 8], [0, 3]], manchester: ['bees at each flower bed', 'bees', [4, 12], [0, 4]], cmu: ['robots crossing the lawn', 'robots', [1, 5], [0, 2]], berlin: ['bicycles in the courtyard', 'bicycles', [6, 15], [1, 5]],
  montreal: ['raccoon tracks on each path', 'tracks', [2, 8], [0, 3]], amsterdam: ['boats on each canal', 'boats', [4, 11], [0, 4]], microsoft: ['umbrellas at each door', 'umbrellas', [6, 14], [1, 5]], google: ['coloured bicycles at each rack', 'bicycles', [8, 20], [1, 6]],
  apple: ['fruit on each orchard tree', 'apricots', [10, 30], [2, 9]], nvidia: ['triangles in each roof panel', 'triangles', [12, 30], [4, 10]], ibm: ['deer at the edge of the woods', 'deer', [1, 5], [0, 2]], belllabs: ['doors along each corridor', 'doors', [12, 28], [3, 9]],
  amazon: ['plants on each shelf of the spheres', 'plants', [10, 26], [2, 8]], netflix: ['parcels at each door', 'parcels', [3, 9], [0, 3]], meta: ['herons on the salt marsh', 'herons', [1, 5], [0, 2]], sf: ['cable cars in ten minutes', 'cable cars', [2, 7], [0, 2]],
};
