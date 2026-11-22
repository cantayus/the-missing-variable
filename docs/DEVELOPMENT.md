# Development notes

A static site in `dist/`. No build step. Nothing is fetched from another host at runtime unless whoever hosts the game switches something on in `dist/js/config.js`. Open `dist/index.html` through any static server.

## Layout
- `dist/js/main.js`: start-up, world view, HUD, glue. URL helpers for testing: `?place=yale&unlock&gfx=0`, `&open=I-2` (workbench), `&sit=I-2`, `&page=credits|also|family|howto|sources|tablet|map|finale|challenge|room|carriage|octavo` (`&n=2` picks the challenge, `&id=bridges` the carriage problem, `&tab=guide` the tablet page).
- `dist/js/engine/`: the diorama kit, people, animals, nature, the 40 place recipes, the scene (`scene.js`).
- `dist/js/engine/parts.js`: pieces shared by the recipes. Besides the older ones (`rails`, `bridge`, `colonnade`, `hill`, `life`, `egg`) there is a set for real buildings: `block`, `dome`, `portico`, `cupola`, `steeple` (kinds `spire`, `crown`, `pyramid`, `point`, `dome`, `flat`), `quad`, `arcade`, `gothic`, `chapel`, `gate`, `needle`, `stadium`, `road`, `terrace`. Recipes are in `places_one.js` (Part I), `places_two.js` (Parts II and III), `places_co.js` (companies) and `places_home.js` (Deckle).
- `docs/CAMPUSES.md`: for each real place, what stands where in life, where the model departs from it, and which pages were read. It also says where a layout came from memory. Read the entry before changing a place.
- `dist/js/instruments/`: `board.js` (canvas), `frame.js` (the one frame for all instruments), `lib.js` (helpers), `partN*.js` (the instruments), `index.js` (registry), `carriage.js`.
- `dist/js/content/`: places, sessions (76), field guide, people's lines, quotations, margin notes, finds, kitchen table.
- `dist/js/sim/model.js`: the seeded library model. `scripts/simulate.mjs` runs it and writes `dist/js/sim/case-data.js`. Every number on an evidence card is read from that file. Never type a case number into the game by hand.
- `dist/js/ui/`: pages, session flow, tablet, map, talk, challenges, finale, Octavo's chat window.
- `dist/js/ui/steps.js`: the “What to do next” list at the top left of the world view. `goal(place)` picks what to aim for (a core session where you stand, else the next one in roster order, then the challenge, then the board meeting, then anything optional). `plan(place)` turns that into numbered steps with exactly one marked `now`. `main.js` carries out a step's `act` (`travel`, `door`, `ines`). Tested in `tests/steps.test.mjs`.
- `dist/js/ui/map.js`: one click on a stop's name or dot travels there. Pointing at a stop shows what is there. `openMap({ go })` sets off at once, which is how the step list travels. The carriage puzzle is a tick box in the map's header (`settings.carriage`).
- `dist/js/octavo.js`: Octavo, a word-by-word model built at first use from `content/octavo-corpus.js` (public-domain text).
- `dist/js/content/bosses.js` and `dist/js/ui/boss.js`: the five professors (claims, replies, retorts), their drawn portraits and the argument screen. `bossDue()` decides when one turns up. Their music is in `audio/sound.js` (`bossSound`, `bossMusic`, and `probe` for measuring it without ears). Try one with `&page=boss&id=average|overfit|blackbox|octavo|nul`.
- `dist/js/sim/challenges.js`: the sums behind the challenges and the finale, kept free of screen code.
- `dist/js/algo/`: the algorithms, pure functions, tested in `tests/algo.test.mjs`.

## The world
- A place is a square slab 96 units across (it was 60), so coordinates run from -48 to 48. North is -z and east is +x. The camera starts in the south-east, so anything tall near the south or east edge stands in front of everything else: keep towers to the north and west where the real layout allows. `kit.ground({ size })` can still make a smaller slab, and the scene sizes its camera, fog, shadows and walking speed from `kit.size`; the scatter in `nature.js` scales with the area. Zooming in makes the camera follow the student.
- A building facing: `rot` 0 looks south, π/2 east, π north, -π/2 west. Obstacles are exact for quarter turns. Trees never stand in a building or in water (`kit.inWay`).
- A recipe ends with `life(k, loops, opts)`. The loops are the lines people walk, as straight segments, so they must stay on paths and clear of buildings. `life` also lays the sampling spots (zone `a` near the way in, `b` further off), moves any that land in a building or in water, and keeps the far ones to about fourteen.
- Works of art that are still in copyright (the Stuart Collection at UC San Diego, for one) are named on a sign where they stand and not modelled.
- Every place has an orange `travel` marker (it opens the map), beside the blue `door` markers for sessions. A click on a marker always ends in its action: if the walk takes more than four seconds or something is in the way, the student is set down at the marker.
- Railways and vehicle routes are lines: `rails()` and `kit.vehicle()` call `kit.track()`. `kit.tree()` will not plant on a line, `kit.find()` keeps clear of one, and `kit.clearTracks()` (run after each recipe and at the start of `life()`) takes out trees planted before the line was laid. `scripts/check_places.py` fails a place that still has a tree on a line.
- People (`engine/people.js`): one baked body, two thighs with a shin hung from each knee (`p.legs`, `p.shins`), two arms. `BODY` holds the heights of hip, shoulder, neck, eyes and the length of an arm. Anything that meets a person (a handlebar, a book, a scarf, a seat) is placed from those numbers, never from a typed height. `sit(p, ground, seat)` takes the height of the seat. Hair is the rule and a hat the exception. A place has about forty people.

## An instrument
A plain object: `{ id, name, short, formula, limit, rounds: {play, twist, case: {brief}}, hints: {play, twist, case: [nudge, pointer]}, teach: [three steps in order], variants?, init(round, ctx) -> state, draw(board, state, ctx), meter(state, ctx) -> {label, text, goal?, frac, met, note?}, controls?(state, ctx), down/drag/up/click?(state, ...), tick?, demo(state, ctx), clean? }`.
State is plain data (it is cloned for undo). Briefs are at most 40 words. `demo` must reach the goal in every round: `tests/instruments.test.mjs` checks this for all of them without a browser.

## Checks
- `node --test tests/*.test.mjs` (algorithms, every puzzle round, the same rounds on the game's real seeds, the professors, the step list)
- `node scripts/simulate.mjs` (rewrites the case data; rerun the tests after)
- `python3 scripts/check_places.py` (loads every place in every season in headless Chromium, and fails on a tree left on a line)
- `python3 scripts/walk.py I-1 IV-15 ...` (clicks through whole sessions, from the recording to the filed evidence)
- `node scripts/onefile.mjs` (packs the game into `build/The-Missing-Variable.html`, which opens with a double click)
- `python3 scripts/play.py "index.html?place=yale&unlock&gfx=0&open=I-2" out.png` (a screenshot)
- `python3 scripts/tour.py outdir [solved] I-2 IV-7 ...` (each round of the named puzzles, side by side)
- `python3 scripts/smoke.py "index.html?gfx=0&unlock&page=credits" ...` (console errors for a list of pages)
- `node scripts/wording.mjs dump.txt` (every sentence a player can read, with stock wording flagged)

## House rules
- Recordings describe real people's work in the third person. No invented words in a real person's mouth. Plates say "Dramatization".
- The player's university is never named. Deckle and everything in it are invented.
- Plain words. No timers, no scores sent anywhere, nothing unsuitable for a child.
- The numbers in the story come from the simulation, even where they differ from the targets in the original brief.
- Layouts made of cards and rows of text start with `b.fit()`, which draws as if the board were 520 units wide. Parts I to III predate it.
- Text: plain sentences, typographic quotes and apostrophes, no dashes as punctuation, no exclamation marks outside speech, no counts used as slogans. The word for the other game is "Also play this!". The credits name the maker and say nothing about how the code was written. They are kept plain: his name, one sentence about what he does (no degrees, titles or figures), who in the game is real and who is invented, what the game is made with, and thanks. No jokes or toys on that page. Host settings in `config.js` are never mentioned in the game.
- People: nobody with a well-known cloud over them is named, even in passing. See `docs/PEOPLE_AND_SOURCES_REVIEW.md`.
