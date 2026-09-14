#!/usr/bin/env node
/* Check every game in the catalogue, in a real browser.
 *
 *     node tools/check.mjs            all of them
 *     node tools/check.mjs security   just one
 *
 * Loads each game, then verifies the things that actually break when a track is
 * new or an engine change goes wrong:
 *
 *   - the page loads with no console errors
 *   - the config layers merged and the world's colourway reached the CSS
 *   - the track declared everything the engine reads
 *   - every objective line points at a room the map can find (or is an end state)
 *   - every room is reachable from every other over the door graph
 *   - the pathfinder can cross each room and reach everyone standing in it
 *   - the picker lists the whole catalogue
 *
 * Exit code is non-zero if anything fails, so it works in CI as-is.
 */
import fs from 'node:fs';
import path from 'node:path';

/* Playwright drives a real browser, which is the only way to check a canvas
   game honestly. It is a devDependency, not a runtime one -- the games
   themselves need nothing installed. */
let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error('check: playwright is not installed. Run:  npm install');
  process.exit(1);
}

const ROOT = path.resolve(import.meta.dirname, '..');
const only = process.argv[2];

const cat = new Function(
  'window',
  fs.readFileSync(path.join(ROOT, 'catalogue.js'), 'utf8') + '; return window.CATALOGUE;'
)({});

const wanted = only ? cat.filter(e => e.id === only) : cat;
if (!wanted.length) {
  console.error(`check: "${only}" is not in catalogue.js`);
  process.exit(1);
}

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM || '/opt/pw-browsers/chromium',
});
let failed = 0;

for (const entry of wanted) {
  const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0, 140)); });

  await page.goto('file://' + path.join(ROOT, 'games', entry.file));
  await page.waitForTimeout(1200);

  /* A half-broken track can leave the page mid-boot, where even `typeof TRACK`
     throws because the declaration is in its temporal dead zone. Report that as
     a failure -- a new track that does not boot is the main thing this catches. */
  let r;
  try {
    r = await page.evaluate(() => {
    const problems = [];
    const need = ['first', 'roles', 'script', 'occupants', 'objectives', 'opening',
                  'certTitle', 'certBody', 'lessons', 'blurb', 'name', 'title'];
    let T = null;
    try { T = TRACK; } catch (e) { /* declared but not yet initialised */ }
    if (!T) return { problems: ['track never loaded'], objectives: 0, resolved: 0,
                     lessons: 0, unresolved: [] };
    need.forEach(k => { if (T[k] == null) problems.push(`TRACK is missing "${k}"`); });
    if (typeof CFG === 'undefined' || !CFG.camera) problems.push('config did not merge');
    if (!getComputedStyle(document.documentElement).getPropertyValue('--bg').trim())
      problems.push('world theme did not reach the CSS');
    if (!window.WORLD || !ROOMS) problems.push('world did not load');

    // the picker should list the whole catalogue
    if (typeof TRACKS !== 'undefined' &&
        Object.keys(TRACKS).length !== (window.CATALOGUE || []).length)
      problems.push('picker does not list the whole catalogue');

    // every room reachable from every other
    const ids = MAP_IDS;
    ids.forEach(a => ids.forEach(b => {
      if (a !== b && !(roomRoute(a, b) || []).length) problems.push(`no route ${a} -> ${b}`);
    }));

    // the pathfinder can cross each room and reach whoever stands in it
    const save = { room: G.room, px: G.px, py: G.py };
    ids.forEach(a => {
      G.room = a; cur = a;
      const doors = (DOORS[a] || []).map(doorPoint);
      [...doors, { x: 400, y: 392 }].forEach(from => {
        doors.forEach(to => {
          if (!findPath(from.x, from.y, to.x, to.y)) problems.push(`no path across ${a}`);
        });
        (occupants(a) || []).forEach(o => {
          if (!findPath(from.x, from.y, o[1], o[2] + 26))
            problems.push(`cannot reach ${CAST[o[0]].name} in ${a}`);
        });
      });
    });

    // every objective should point somewhere, bar the end states
    const objs = TRACK.objectives || {};
    const keys = Object.keys(objs);
    let resolved = 0;
    const unresolved = [];
    keys.forEach(k => {
      G.step = k;
      if (goalRoom()) resolved++;
      else if (k !== 'complete') unresolved.push(`${k}: "${objs[k]}"`);
    });
    G.room = save.room; cur = save.room; G.px = save.px; G.py = save.py; G.step = TRACK.first;

    return { problems: [...new Set(problems)], objectives: keys.length, resolved, unresolved,
             lessons: (TRACK.lessons || []).length };
    });
  } catch (e) {
    r = { problems: ['did not finish booting: ' + String(e.message || e).split('\n')[0]],
          objectives: 0, resolved: 0, lessons: 0, unresolved: [] };
  }

  const bad = r.problems.length || errs.length;
  if (bad) failed++;
  const tag = bad ? 'FAIL' : 'ok  ';
  console.log(`${tag} ${entry.id.padEnd(12)} ${r.objectives} objectives, ${r.resolved} mapped, ` +
              `${r.lessons} lessons`);
  [...r.problems, ...errs].forEach(p => console.log(`       ${p}`));
  (r.unresolved || []).forEach(u => console.log(`       note: no room for ${u}`));
  await page.close();
}

await browser.close();
console.log(failed ? `\n${failed} of ${wanted.length} failed` : `\nall ${wanted.length} ok`);
process.exit(failed ? 1 : 0);
