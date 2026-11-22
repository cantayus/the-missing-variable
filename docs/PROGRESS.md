# Where the game stands

Written at the end of the main build. It is meant to be read before anyone decides the game is ready for players.

## Finished and checked by the automated tests

- The world: 40 places as dioramas, four seasons, people to talk to, animals to note, things to count, finds for the cabinet.
- 76 sessions. Each has a recording in three lines, three questions, an evidence card and its own puzzle with three rounds (Play, Twist, Case).
- Every puzzle round starts unsolved and can be solved: `tests/instruments.test.mjs` checks all 228 rounds without a browser. `tests/fresh.test.mjs` repeats the check with the seeds the game really uses: each session’s own, the “Fresh data” button, counts made at a place, and thirty workbench seeds. A draw that comes out already solved, or that Folio cannot solve, is thrown back and dealt again.
- The library simulation, and the case data written from it. Every figure on an evidence card is read from that file.
- Challenges I to III and the finale (an experiment you design, run on a small copy of the simulation, and defend to the board).
- Field Guide: 503 entries, each with a definition.
- 17 carriage problems. 23 games for two. 32 kitchen-table activities.
- Five professors to argue with, all invented caricatures. Four turn up unannounced, one in each part, after a few of its sessions. The fifth, an external examiner, arrives at the board meeting and has to be won over before the vote. Each has an entrance with its own music, a theme that quickens as the argument goes on, and a flourish at the end.
- Octavo, a word-by-word language model built in the browser from one public-domain book, with a chat window.
- Tablet (case board, pipeline, Field Guide, syllabus, workbench, album, notes), map, home, credits, sources, the "Also play this!" page, options, a list view for browsers without 3D.

## Where it falls short of the original brief

| The brief asked for | What exists | Note |
|---|---|---|
| About 150 quotations on the title screen | 22 | Only ones whose wording and source could be confirmed. |
| About 200 margin notes | 57 | Same reason. |
| About 285 playable variations | 7, on six puzzles | 219 more variations are in the Field Guide as entries with a definition, not as playable modes. |
| Two-player set-and-solve modes | 23 written games | They are rules for two people sharing a screen or a sheet of paper. There is no separate two-player mode in the program. |
| Octavo as a small transformer | A model that predicts each word from the two before it, trained on one book | The game says what it is wherever Octavo speaks. Three rounds that need more than Octavo can do (IV-9 Twist, IV-14 Twist, IV-12 Twist) are acted out and say so. |
| Simulation targets in the brief | The cards follow the simulation | Where the model disagreed with a target (for example, reader groups blur instead of sealing off), the card reports what the model produced. |

## Not tested, or tested only by machine

- **No person has played it from start to finish.** A script clicks through all 76 sessions in a real browser, from the recording to the filed evidence, asking Folio for the answer each time, and all 76 complete without an error. Every place loads in every season. The challenges, the finale, each professor and each page were played through by script as well. None of that tells you whether it is fun, whether the puzzles are the right difficulty, or whether a sentence reads oddly. A play-through by a person is the most useful next step.
- **Only Chromium, only software rendering.** Not tried in Firefox or Safari, on a phone, on a touch screen, or on a real graphics card. The 4K setting has not been seen at 4K.
- **Sound** is synthesised in the browser. It has been checked for errors, and the professors’ music was rendered off-line and measured for loudness. Nobody has listened to any of it.
- **Facts in the recordings and the Field Guide** were written from general knowledge and checked for internal consistency. They were not each compared with a primary source. `docs/PEOPLE_AND_SOURCES_REVIEW.md` lists everyone named, for a second pair of eyes.
- **Facts about real places** in the cabinet of finds (41 short items) deserve the same spot check.
- **The larger places** were looked at as still pictures from one angle, in one season each, under software rendering, and the walk to the first session door was tried by script in eight of them. Nobody has walked round all forty. Layouts are diagrams, not surveys: distances are squeezed, and `docs/CAMPUSES.md` records the places where I worked from memory (among them Wisconsin, Cambridge, London, Berkeley, the city landmarks of Amsterdam and Montréal, and which way IBM's crescent faces).
- **The single-file copy** (`build/The-Missing-Variable.html`) has to be rebuilt with `node scripts/onefile.mjs` to pick up the larger places.
- **Screen readers.** Controls have labels and the puzzles can be driven from the keyboard, but nobody has listened to it with one.

## Case rounds that use made-up figures

Every Case round is labelled "invented data", because the Common Shelf is invented. Most take their numbers from the simulation. These take some or all of theirs from values chosen to make the point, and should not be read as results of the model:
II-3, II-6, II-12, III-4, III-5, III-6 (Twist), III-13, III-14, III-16, III-17, III-18 (which pairs), IV-2 (the scatter), IV-6 (the three quiet titles), IV-12, IV-13 (two of the titles), IV-15 (how well liked the five titles are), IV-16 (the number of loans), IV-17 (the two small weights).

## Rough edges

- Text inside the puzzles of Parts I to III is smaller than in Part IV, which was laid out later with a fit-to-width rule (`board.fit()`).
- Under software rendering the game shows a note that the picture is stuttering. It should not appear on ordinary hardware.

## Decisions taken along the way

1. Recordings describe real people's work in the third person. Nothing is put in a real person's mouth, and each plate says "Dramatization". Portraits are cartoon busts with initials, not likenesses.
2. Where the simulation and the brief disagree, the simulation wins.
3. A variation is listed as playable only where it changes the puzzle.
4. Quotations and notes were cut to what could be confirmed.
5. Names of people with a well-known cloud over them were taken out of passing mentions. The review file says which.
6. After the first play-through by its maker: the way forward is spelled out. A numbered list in the world view says what to do next, a session shows its five steps along the top, travel is one click on a stop's name, and every place has a marker for leaving. Towns hold about a third fewer people, hats became the exception, nothing grows on a railway line, and the figures were redrawn with longer legs, knees, hands, shoes and eyes.
7. After the second: every place was made larger (a slab 96 units across in place of 60) and laid out again from what is really there. Each real campus, lab and city now has the buildings people know it by, named, and roughly where they stand; `docs/CAMPUSES.md` lists them place by place with the pages that were read, and says plainly where a layout came from memory and where the model squeezes or turns the real map. Five places were rewritten because the old sketch had something on the wrong side (Cornell's gorges, Toronto's streetcar, Berlin's avenue, the highway at Microsoft, the creek at Google). Deckle grew to match. Sculptures still in copyright are named on signs and not modelled.
