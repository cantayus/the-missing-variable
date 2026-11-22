# The Missing Variable

A browser game about data science and artificial intelligence, by Cantay Caliskan. It is a companion to [The Society Atlas](https://thesocietyatlas.net).

**Play it: https://cantayus.github.io/the-missing-variable/**

You are a first-year student lodging above a bindery in Deckle, a paper-mill town that does not exist. You work at its library, where a recommender called Marginalia keeps getting more accurate while the town reads fewer and fewer different books. A rail pass takes you to forty places where the methods you need were worked out. Each stop has a short recording about real work by real people, a puzzle in three rounds, and one piece of evidence for the case.

## Run it

The game is a static site in `dist/`. There is no build step.

```
python3 -m http.server 8000 --directory dist
```

Then open http://localhost:8000. Any static host works. Nothing has to be installed on the server.

For a copy that opens with a double click, with no server at all:

```
(cd tools && npm install esbuild)   # once
node scripts/onefile.mjs            # writes build/The-Missing-Variable.html
```

## Publishing

The game is served by GitHub Pages. `.github/workflows/deploy-pages.yml` publishes the `dist/` folder every time `main` changes, and can also be run by hand from the Actions tab. The one-time setup is in the repository's Settings, under Pages: set the source to GitHub Actions.

## What is in it

| | |
|---|---|
| Sessions, each with its own puzzle | 76, in four parts (31 carry the story) |
| Places | 40 dioramas, in four seasons |
| Field Guide | 503 entries with definitions |
| Challenges | three, and a finale in which you design an experiment and answer to the board |
| Professors to argue with | five, four of whom turn up unannounced |
| Carriage problems | 17 |
| Games for two, kitchen-table activities | 23 and 32 |
| Octavo | a small language model that runs in the browser |

Every number in the case comes from one seeded simulation, `dist/js/sim/model.js`. Nothing is typed in by hand.

## Layout

```
dist/            the game
  js/main.js       start-up and the world view
  js/engine/       dioramas, people, animals, weather
  js/instruments/  the puzzles, the canvas they draw on, the carriage problems
  js/content/      sessions, places, Field Guide, lines, notes, finds
  js/sim/          the library simulation and the data it writes
  js/ui/           pages, tablet, map, challenges, finale
  js/algo/         the algorithms, as plain functions
  js/config.js     settings for whoever hosts the game
scripts/         development helpers
tests/           node tests: the algorithms, and every round of every puzzle
docs/            development notes, status and review notes
```

## Checks

```
node --test tests/*.test.mjs       # every puzzle round starts unsolved and can be solved
node scripts/simulate.mjs          # rebuild the case data from the model
node scripts/wording.mjs           # flag wording that reads as stock or as marketing
python3 scripts/check_places.py    # load every place in every season (needs Playwright)
```

## The photo in the credits

The credits show `dist/img/creator.jpg`. To change the picture, replace that file, or point `creatorPhoto` in `dist/js/config.js` at another one. Leave the setting empty to show initials.

## Licences of what is bundled

three.js (MIT). Atkinson Hyperlegible, DM Mono and Caveat (SIL Open Font Licence). Octavo's reading is Lewis Carroll's *Alice's Adventures in Wonderland* (1865), which is in the public domain. Licence files sit beside the files they cover.

## Status

See `docs/PROGRESS.md` for what is finished, what falls short of the original brief, and what has not been tested.
