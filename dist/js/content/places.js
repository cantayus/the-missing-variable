// The forty stops. x and y place each one on the schematic map (1600 by 900); they are not geography.
export const PLACES = {
  deckle: { name: 'Deckle', full: 'Deckle: the Stacks, the bindery and the junction', where: 'an invented mill town', x: 800, y: 470, kind: 'home', blurb: 'Home. The Common Shelf keeps its books in the old paper mill.' },
  // east
  cornell: { name: 'Cornell', full: 'Cornell University', where: 'Ithaca, New York', x: 640, y: 330, kind: 'uni', blurb: 'A clock tower, a long slope and two gorges.' },
  toronto: { name: 'Toronto', full: 'University of Toronto', where: 'Toronto, Ontario', x: 600, y: 230, kind: 'uni', blurb: 'Robarts Library, a concrete peacock of a building.' },
  montreal: { name: 'Montréal', full: 'Mila and the mountain', where: 'Montréal, Québec', x: 730, y: 170, kind: 'uni', blurb: 'A research institute below Mount Royal.' },
  rensselaer: { name: 'Rensselaer', full: 'Rensselaer Polytechnic Institute', where: 'Troy, New York', x: 800, y: 260, kind: 'uni', blurb: 'A hill above the Hudson, and a chapel full of computers.' },
  harvard: { name: 'Harvard', full: 'Harvard University', where: 'Cambridge, Massachusetts', x: 930, y: 230, kind: 'uni', blurb: 'The Science Center, by the Yard.' },
  mit: { name: 'MIT', full: 'Massachusetts Institute of Technology', where: 'Cambridge, Massachusetts', x: 990, y: 300, kind: 'uni', blurb: 'Along the river: economists, a crooked building and the Media Lab.' },
  yale: { name: 'Yale', full: 'Yale University', where: 'New Haven, Connecticut', x: 930, y: 370, kind: 'uni', blurb: 'A library of thin marble, and Hillhouse Avenue.' },
  columbia: { name: 'Columbia', full: 'Columbia University', where: 'New York City', x: 880, y: 440, kind: 'uni', blurb: 'Butler Library, facing the lawn.' },
  ibm: { name: 'IBM', full: 'IBM Research', where: 'Yorktown Heights, New York', x: 820, y: 370, kind: 'co', blurb: 'A long curved building in the woods.' },
  belllabs: { name: 'Bell Labs', full: 'Bell Labs', where: 'Murray Hill, New Jersey', x: 880, y: 530, kind: 'co', blurb: 'Long corridors where a great deal began.' },
  princeton: { name: 'Princeton', full: 'Princeton University', where: 'Princeton, New Jersey', x: 840, y: 610, kind: 'uni', blurb: 'Fine Hall tower and the Lewis Library.' },
  maryland: { name: 'Maryland', full: 'University of Maryland', where: 'College Park, Maryland', x: 770, y: 680, kind: 'uni', blurb: 'McKeldin Mall, and a bronze terrapin.' },
  unc: { name: 'Chapel Hill', full: 'University of North Carolina', where: 'Chapel Hill, North Carolina', x: 700, y: 760, kind: 'uni', blurb: 'The Old Well and Polk Place.' },
  cmu: { name: 'Carnegie Mellon', full: 'Carnegie Mellon University', where: 'Pittsburgh, Pennsylvania', x: 660, y: 520, kind: 'uni', blurb: 'The Gates and Hillman Centers.' },
  illinois: { name: 'Illinois', full: 'University of Illinois', where: 'Urbana-Champaign, Illinois', x: 540, y: 560, kind: 'uni', blurb: 'The Main Quad, and the Siebel Center to the north.' },
  wisconsin: { name: 'Wisconsin', full: 'University of Wisconsin', where: 'Madison, Wisconsin', x: 500, y: 430, kind: 'uni', blurb: 'Bascom Hill and a terrace on the lake.' },
  // west
  santafe: { name: 'Santa Fe', full: 'Santa Fe Institute', where: 'Santa Fe, New Mexico', x: 400, y: 660, kind: 'uni', blurb: 'A low building on a desert hill.' },
  ucsd: { name: 'San Diego', full: 'UC San Diego', where: 'La Jolla, California', x: 270, y: 760, kind: 'uni', blurb: 'Geisel Library, standing on its concrete arms.' },
  netflix: { name: 'Netflix', full: 'Netflix', where: 'Los Gatos, California', x: 190, y: 690, kind: 'co', blurb: 'Red roofs under the hills.' },
  nvidia: { name: 'Nvidia', full: 'Nvidia', where: 'Santa Clara, California', x: 250, y: 620, kind: 'co', blurb: 'Two buildings made of triangles.' },
  apple: { name: 'Apple', full: 'Apple', where: 'Cupertino, California', x: 160, y: 590, kind: 'co', blurb: 'A glass ring around an orchard.' },
  google: { name: 'Google', full: 'Google', where: 'Mountain View, California', x: 230, y: 530, kind: 'co', blurb: 'Bicycles in four colours, by the bay.' },
  stanford: { name: 'Stanford', full: 'Stanford University', where: 'Stanford, California', x: 140, y: 480, kind: 'uni', blurb: 'The Oval, the Gates building and Sequoia Hall.' },
  meta: { name: 'Meta', full: 'Meta', where: 'Menlo Park, California', x: 250, y: 440, kind: 'co', blurb: 'A roof garden beside the salt marsh.' },
  sf: { name: 'San Francisco', full: 'San Francisco: OpenAI and Anthropic', where: 'San Francisco, California', x: 170, y: 380, kind: 'co', blurb: 'Two labs, a hill and the fog.' },
  berkeley: { name: 'Berkeley', full: 'UC Berkeley', where: 'Berkeley, California', x: 270, y: 320, kind: 'uni', blurb: 'The Campanile and Memorial Glade.' },
  microsoft: { name: 'Microsoft', full: 'Microsoft', where: 'Redmond, Washington', x: 260, y: 180, kind: 'co', blurb: 'A campus in the firs. It is raining.' },
  amazon: { name: 'Amazon', full: 'Amazon', where: 'Seattle, Washington', x: 160, y: 130, kind: 'co', blurb: 'Three glass spheres full of plants.' },
  // europe
  london: { name: 'London', full: 'London: Bloomsbury and King’s Cross', where: 'London, England', x: 1220, y: 470, kind: 'uni', blurb: 'Birkbeck, University College, and a lab by the station.' },
  cambridge: { name: 'Cambridge', full: 'University of Cambridge', where: 'Cambridge, England', x: 1270, y: 380, kind: 'uni', blurb: 'The University Library tower and the Computer Laboratory.' },
  cranfield: { name: 'Cranfield', full: 'Cranfield', where: 'Bedfordshire, England', x: 1180, y: 350, kind: 'uni', blurb: 'A college library beside an airfield.' },
  manchester: { name: 'Manchester', full: 'University of Manchester', where: 'Manchester, England', x: 1150, y: 250, kind: 'uni', blurb: 'The old quadrangle on Oxford Road.' },
  edinburgh: { name: 'Edinburgh', full: 'University of Edinburgh', where: 'Edinburgh, Scotland', x: 1180, y: 150, kind: 'uni', blurb: 'The Bayes Centre and the Informatics Forum.' },
  amsterdam: { name: 'Amsterdam', full: 'University of Amsterdam', where: 'Amsterdam, the Netherlands', x: 1350, y: 430, kind: 'uni', blurb: 'The Science Park, and canals on the way.' },
  berlin: { name: 'Berlin', full: 'Berlin', where: 'Berlin, Germany', x: 1470, y: 380, kind: 'uni', blurb: 'A courtyard in the north, and the university on Unter den Linden.' },
  gottingen: { name: 'Göttingen', full: 'University of Göttingen', where: 'Göttingen, Germany', x: 1420, y: 480, kind: 'uni', blurb: 'An observatory and an old town.' },
  munich: { name: 'Munich', full: 'Munich', where: 'Munich, Germany', x: 1470, y: 590, kind: 'uni', blurb: 'Two universities and the English Garden.' },
  eth: { name: 'Zurich', full: 'ETH Zurich', where: 'Zurich, Switzerland', x: 1370, y: 660, kind: 'uni', blurb: 'A terrace above the city and the lake.' },
  // oceania
  monash: { name: 'Monash', full: 'Monash University', where: 'Melbourne, Australia', x: 1420, y: 820, kind: 'uni', blurb: 'Gum trees and cockatoos.' },
};
// rail within a continent
export const RAIL = [
  ['deckle', 'cornell'], ['deckle', 'cmu'], ['deckle', 'belllabs'], ['deckle', 'ibm'], ['cornell', 'toronto'], ['toronto', 'montreal'], ['montreal', 'rensselaer'], ['rensselaer', 'ibm'], ['rensselaer', 'harvard'], ['harvard', 'mit'], ['mit', 'yale'], ['yale', 'columbia'], ['columbia', 'ibm'], ['columbia', 'belllabs'], ['belllabs', 'princeton'], ['princeton', 'maryland'], ['maryland', 'unc'], ['cmu', 'illinois'], ['illinois', 'wisconsin'], ['illinois', 'santafe'],
  ['santafe', 'ucsd'], ['ucsd', 'netflix'], ['netflix', 'nvidia'], ['nvidia', 'apple'], ['nvidia', 'google'], ['apple', 'stanford'], ['google', 'stanford'], ['google', 'meta'], ['meta', 'sf'], ['stanford', 'sf'], ['sf', 'berkeley'], ['berkeley', 'microsoft'], ['microsoft', 'amazon'],
  ['london', 'cambridge'], ['cambridge', 'cranfield'], ['cranfield', 'manchester'], ['manchester', 'edinburgh'], ['london', 'cranfield'], ['london', 'amsterdam'], ['amsterdam', 'berlin'], ['amsterdam', 'gottingen'], ['berlin', 'gottingen'], ['gottingen', 'munich'], ['munich', 'eth'],
];
// the night flight and the airship cross the oceans
export const AIR = [['deckle', 'london'], ['deckle', 'sf'], ['london', 'monash'], ['sf', 'monash']];
export const REGIONS = [{ name: 'The western line', x: 60, y: 70 }, { name: 'The eastern line', x: 520, y: 110 }, { name: 'Across the ocean', x: 1130, y: 80 }];
export function route(from, to) {
  const adj = {}; for (const [a, b] of [...RAIL, ...AIR]) { (adj[a] ||= []).push(b); (adj[b] ||= []).push(a); }
  const prev = { [from]: null }, q = [from]; for (let i = 0; i < q.length; i++) { if (q[i] === to) break; for (const n of adj[q[i]] || []) if (!(n in prev)) { prev[n] = q[i]; q.push(n); } }
  const path = []; for (let n = to; n != null; n = prev[n]) path.unshift(n); return path[0] === from ? path : [from, to];
}
export const isAir = (a, b) => AIR.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
