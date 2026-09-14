/* Chronicles defaults — the tunables, in one place.
 *
 * THIS IS THE "CHANGE IT ONCE" FILE. Anything set here applies to all nine
 * games. Three levels of override, each beating the one above it:
 *
 *     engine/defaults.js        <- all nine games
 *     worlds/<world>.js  config <- the five Meridian, or the four agency games
 *     tracks/<track>.js  config <- one game only
 *
 * So: retune the phone camera for everybody here; rename the work log for the
 * agency in worlds/agency.js; give one track its own coaching copy in that
 * track's file. Nothing else needs to know.
 */
window.CHRONICLE_DEFAULTS = {

  /* Wording the engine puts on screen. Worlds override these. */
  labels: {
    folio: 'Work log',            /* the HUD button, the keyboard hint, the certificate link */
    floor: 'Office floor',        /* the canvas accessible name */
    pickerTitle: 'Choose another track',
    pickerLede: 'Engineering, product, security, UX and data science run at Meridian, '
              + 'a product company. The other four share an agency — same engine, '
              + 'different job, different lessons.'
  },

  /* How fast the player walks, in world units per frame. */
  walkSpeed: 2.1,

  /* The room is 800x480 world units in a fixed 1600x960 canvas that CSS
     squeezes to the column width. Below fullWidth we zoom in and follow the
     player, reaching maxZoom at minWidth and below. At or above fullWidth the
     zoom resolves to 1 and the whole room stays in frame. */
  camera: { fullWidth: 820, minWidth: 420, maxZoom: 1.4 },

  /* Nameplates are sized from the resulting scale so they stay readable on a
     phone: target CSS pixels, clamped to these world-unit bounds. */
  nameplate: { targetCssPx: 10, min: 9, max: 16 },

  /* Tapping a room on the map walks you there. speed is a multiple of
     walkSpeed; cell is the pathfinding grid in world units. */
  travel: { enabled: true, speed: 3, cell: 10 },

  /* The floor map. Every orthogonal neighbour in this grid is a real door, so
     the grid is the floor plan. Change the rooms and change this together. */
  map: {
    enabled: true,
    grid: [['lobby', 'servicing', 'creative'],
           ['breakroom', 'studio', 'meeting']]
  },

  /* The card every run opens with. Set enabled:false to start cold. */
  coach: {
    enabled: true,
    dismiss: 'Got it',
    lines: [
      '<b>Read the line above.</b> That is your objective — who to find, and which '
      + 'room. The map next to it shows where you are; tap any room to walk there.',
      '<b>Then answer in the box below the floor.</b> Nothing moves until you tap one '
      + 'of its options — that is how the day starts.'
    ]
  }
};
