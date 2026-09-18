# Chronicles

Short, story-driven games where you work one real day in one real job. Nine of
them so far, sharing one engine.

    index.html          the landing page
    catalogue.js        every game, in one list
    engine/             the shared engine
    worlds/             the buildings: meridian, agency
    tracks/             the nine days
    games/              a five-line file per game
    tools/              scaffold a track, check every track

Open `index.html`. Nothing to install and nothing to build — the games are
plain files, and a change to the engine is live the moment you push it.

## Changing something

Three layers. Each one beats the layer above it, so you choose how far a change
reaches:

| Change it in | It reaches |
| --- | --- |
| `engine/defaults.js` | **all nine games** |
| `worlds/<world>.js` → `config` | the five Meridian games, or the four agency ones |
| `tracks/<track>.js` → `TRACK_CONFIG` | **that one game** |

So to slow the walk everywhere, edit `walkSpeed` in `engine/defaults.js`. To
slow it only in Brand Chronicles, put `walkSpeed: 1.6` in `TRACK_CONFIG` at the
top of `tracks/brand.js`. Nothing else needs to know.

One thing to watch: a default only applies where nothing below claims it. Both
worlds set `labels.folio` — Meridian calls it a work log, the agency calls it a
portfolio — so changing that default alone changes neither. Grep the worlds for
a key before assuming the default is what you are seeing.

The same applies to the code itself. `engine/core.js` and `engine/frontend.js`
are shared by every game: fix a bug there once and all nine have it.

What you can tune without touching engine code — the full list is in
`engine/defaults.js`, with a comment on each:

- `labels` — the work log's name, the canvas's accessible name, the picker copy
- `walkSpeed` — how fast the player walks
- `camera` — when the phone camera zooms in, and how far
- `nameplate` — how large character names are drawn
- `travel` — tap-a-room-to-walk-there: on/off, speed, pathfinding grid
- `map` — the floor map: on/off, and the room grid it draws
- `coach` — the card each run opens with: on/off, and its wording

## Adding a game

    node tools/new-track.mjs finance "Finance" meridian

That writes `tracks/finance.js`, adds it to `catalogue.js`, and creates
`games/finance-chronicles.html`. The landing page and every existing game's
"Choose another track" list both read the catalogue, so the new game appears in
all of them immediately — there is no list to update by hand.

Then open `tracks/finance.js` and write the day. A track owns five things:

- **`CAST`** — who is in the building. Copy the block from a track in the same
  world and rename; the fields drive how each person is drawn.
- **`OBJ_<ID>`** — one line per step, shown at the top of the screen. Name the
  person you want found: the floor map reads these strings to work out which
  room to mark, so "Find Nadia in Product" lights up Product by itself.
- **`<id>Occupants(room)`** — who is standing where, for the current step.
- **`<id>Script(key)`** — the day, one conversation at a time. `say()` for a
  line, `choose()` for a decision.
- **`TRACK_DEFS.<id>`** — the roles, the opening, the certificate, the lessons.

`tracks/security.js` is the fullest example; `tracks/brand.js` is the shortest.

## Checking your work

    npm install        once, for the tools
    npm run check      every game is well formed
    npm run play       every game can actually be finished
    npm run check -- security

It drives a real browser and reports, per game: whether it boots without
errors, whether the config layers merged, whether the track declared everything
the engine reads, whether every objective points at a room the map can find,
whether every room is reachable from every other, and whether the pathfinder
can cross each room and reach everyone in it. It exits non-zero on failure, so
it works in CI as-is.

An objective with no room is reported as a note, not a failure — some lines
genuinely have no destination ("Think. Now.").

`npm run play` is the one that catches an unfinishable track. It starts a run and
plays it through: at each step it tries every character until one has something to
say, and every answer until the day moves on, and it only passes when the run
reaches the certificate. A step key that never fires, a character nobody thinks to
ask, or a branch that leads nowhere will all pass `check` and fail `play`.

## Adding a world

A world owns the rooms, the furniture that paints them, and the colourway —
`worlds/meridian.js` and `worlds/agency.js` are the two. A new one needs:

- `theme` — the CSS custom properties. The whole stylesheet is written against
  these, so a world only supplies values, never rules.
- `paint()` — anything to add to the palette once the engine's exists.
- `ROOMS` — six rooms keyed `lobby`, `servicing`, `creative`, `studio`,
  `breakroom`, `meeting`, each with a `floor()` and a `draw()`.

The six rooms sit in a 3×2 grid where every orthogonal neighbour is a real
door — that grid is `map.grid` in `engine/defaults.js`, and it is what the floor
map draws. Change the rooms and change the grid together.

## How a game loads

`games/<name>.html` names its track and loads `engine/boot.js`. Everything else
follows from the catalogue:

    engine/defaults.js   the tunables
    catalogue.js         which world this track belongs to
    engine/core.js       palette, drawing, movement, map, camera, travel
    worlds/<world>.js    colourway, furniture, rooms
    tracks/<track>.js    cast, objectives, step machine, lessons
    engine/frontend.js   menu, avatars, picker, certificate, and the run itself

Core loads before the world and the track and reads what it needs from them
inside functions, never at load time — which is why the order works.
