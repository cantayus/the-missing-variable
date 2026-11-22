# Development notes

A static site in `dist/`. No build step. Nothing is fetched from another host at runtime unless whoever hosts the game switches something on in `dist/js/config.js`. Open `dist/index.html` through any static server.

## Layout
- `dist/js/main.js`: start-up, world view, HUD, glue. URL helpers for testing: `?place=yale&unlock&gfx=0`, `&open=I-2` (workbench), `&sit=I-2`, `&page=credits|also|family|howto|sources|tablet|map|finale|challenge|room|carriage|octavo` (`&n=2` picks the challenge, `&id=bridges` the carriage problem, `&tab=guide` the tablet page).
- `dist/js/engine/`: the diorama kit, people, animals, nature, the 40 place recipes, the scene (`scene.js`).
- `dist/js/instruments/`: `board.js` (canvas), `frame.js` (the one frame for all instruments), `lib.js` (helpers), `partN*.js` (the instruments), `index.js` (registry), `carriage.js`.
- `dist/js/content/`: places, sessions (76), field guide, people's lines, quotations, margin notes, finds, kitchen table.
- `dist/js/sim/model.js`: the seeded library model. `scripts/simulate.mjs` runs it and writes `dist/js/sim/case-data.js`. Every number on an evidence card is read from that file. Never type a case number into the game by hand.
- `dist/js/ui/`: pages, session flow, tablet, map, talk, challenges, finale, Octavo's chat window.
- `dist/js/octavo.js`: Octavo, a word-by-word model built at first use from `content/octavo-corpus.js` (public-domain text).
- `dist/js/content/bosses.js` and `dist/js/ui/boss.js`: the five professors (claims, replies, retorts), their drawn portraits and the argument screen. `bossDue()` decides when one turns up. Their music is in `audio/sound.js` (`bossSound`, `bossMusic`, and `probe` for measuring it without ears). Try one with `&page=boss&id=average|overfit|blackbox|octavo|nul`.
- `dist/js/sim/challenges.js`: the sums behind the challenges and the finale, kept free of screen code.
- `dist/js/algo/`: the algorithms, pure functions, tested in `tests/algo.test.mjs`.

## An instrument
A plain object: `{ id, name, short, formula, limit, rounds: {play, twist, case: {brief}}, hints: {play, twist, case: [nudge, pointer]}, teach: [three steps in order], variants?, init(round, ctx) -> state, draw(board, state, ctx), meter(state, ctx) -> {label, text, goal?, frac, met, note?}, controls?(state, ctx), down/drag/up/click?(state, ...), tick?, demo(state, ctx), clean? }`.
State is plain data (it is cloned for undo). Briefs are at most 40 words. `demo` must reach the goal in every round: `tests/instruments.test.mjs` checks this for all of them without a browser.

## Checks
- `node --test tests/*.test.mjs` (algorithms, every puzzle round, the same rounds on the game's real seeds, the professors)
- `node scripts/simulate.mjs` (rewrites the case data; rerun the tests after)
- `python3 scripts/check_places.py` (loads every place in every season in headless Chromium)
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
- Text: plain sentences, typographic quotes and apostrophes, no dashes as punctuation, no exclamation marks outside speech, no counts used as slogans. The word for the other game is "Also play this!". The credits name the maker and say nothing about how the code was written. Host settings in `config.js` are never mentioned in the game.
- People: nobody with a well-known cloud over them is named, even in passing. See `docs/PEOPLE_AND_SOURCES_REVIEW.md`.
