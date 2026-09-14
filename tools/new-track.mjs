#!/usr/bin/env node
/* Scaffold a new track.
 *
 *     node tools/new-track.mjs <id> "<Display Name>" <world>
 *     node tools/new-track.mjs finance "Finance" meridian
 *
 * Writes tracks/<id>.js from a commented template, adds the entry to
 * catalogue.js, and creates the five-line shell in games/. Nothing else needs
 * touching: the landing page and every game's track picker both read the
 * catalogue, so the new track shows up in all of them.
 *
 * Then open tracks/<id>.js and write the day.
 */
import fs from 'node:fs';
import path from 'node:path';

const [id, name, world = 'meridian'] = process.argv.slice(2);
const ROOT = path.resolve(import.meta.dirname, '..');
const die = m => { console.error('new-track: ' + m); process.exit(1); };

if (!id || !name) die('usage: new-track.mjs <id> "<Display Name>" [meridian|agency]');
if (!/^[a-z][a-z0-9]*$/.test(id)) die('id must be lowercase letters and digits');
if (!['meridian', 'agency'].includes(world)) die('world must be meridian or agency');

const trackFile = path.join(ROOT, 'tracks', `${id}.js`);
if (fs.existsSync(trackFile)) die(`tracks/${id}.js already exists`);

const Title = `${name} Chronicles`;
const stem = `${id}-chronicles.html`;
const U = id.toUpperCase();

fs.writeFileSync(trackFile, `/* Track: ${Title}
   A track owns its people, its objectives, its step machine and its lessons.
   The world it runs in (rooms, furniture, colourway) comes from worlds/${world}.js,
   and everything else from engine/. */

/* Overrides for THIS GAME ONLY. Anything here beats worlds/${world}.js, which
   beats engine/defaults.js. Leave it thin -- prefer changing the engine default
   when the change should reach every game. */
window.TRACK_CONFIG={
  menuLede:'One line for the menu screen: what this day is about.'
};

/* Who is in the building. Six keys are expected -- mike, kate, jenny, alex, dan
   and one more -- because the world places them by key. Copy a CAST block from
   another track in this world and rename; the fields drive how they are drawn. */
const CAST={
  /* ... copy from tracks/security.js (meridian) or tracks/copywriting.js (agency) */
};

/* One line per step, shown at the top of the screen. Name the person you want
   found: the floor map reads these strings to work out which room to mark. */
const OBJ_${U}={
  ${id}_brief:'Find <someone> in <room>',
  complete:'You are a ${name.toLowerCase()} now'
};

/* Who is standing where, for the current step. */
function ${id}Occupants(room){
  const s=G.step;
  if(room==='lobby')     return [];
  if(room==='servicing') return [['kate',400,306,'down']];
  if(room==='creative')  return [['mike',260,258,'right'],['alex',560,268,'left']];
  if(room==='studio')    return [['jenny',400,196,'down']];
  if(room==='breakroom') return [['dan',650,268,'down']];
  if(room==='meeting')   return [];
  return [];
}

/* The day, one conversation at a time. say() for a line, choose() for a
   decision. Look at tracks/security.js for the shape. */
function ${id}Script(key){
  return say(key,\`Nothing written yet.\`);
}

TRACK_DEFS.${id}={
  id:'${id}', name:'${name}', title:'${Title}',
  blurb:'One sentence that makes someone want to play it.',
  first:'${id}_brief',
  roles:{mike:'', kate:'', jenny:'', alex:'', dan:'', player:'The new ${name.toLowerCase()}'},
  script:function(key){ return ${id}Script(key); },
  occupants:function(room){ return ${id}Occupants(room); },
  objectives:OBJ_${U},
  opening:{text:\`Nine in the morning.\`, label:'Go.'},
  certTitle:'${Title.toUpperCase()}',
  timeUp:{who:'kate',line:\`Time.\`},
  certBody:['what they did today,','in three lines,','on the certificate.'],
  lessons:[
    {t:'The first lesson', c:'Category', l:'What it actually means in the work.'}
  ]
};
`);

// catalogue entry
const catPath = path.join(ROOT, 'catalogue.js');
let cat = fs.readFileSync(catPath, 'utf8');
if (cat.includes(`id:'${id}'`)) die(`catalogue.js already lists "${id}"`);
const entry = `  { id:'${id}', name:${JSON.stringify(name)}, title:${JSON.stringify(Title)},
    world:'${world}', setting:${JSON.stringify(world === 'meridian' ? 'Meridian' : 'The agency')}, file:'${stem}',
    tone:'#58a6ff', role:${JSON.stringify('The new ' + name.toLowerCase())}, lessons:1,
    blurb:"One sentence that makes someone want to play it." }`;
cat = cat.replace(/\n\];\s*$/, ',\n' + entry + '\n];\n');
fs.writeFileSync(catPath, cat);

// shell
fs.writeFileSync(path.join(ROOT, 'games', stem),
`<!doctype html>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
<title>${Title}</title>
<body>
<script>window.CHRONICLE='${id}'</script>
<script src="../engine/boot.js"></script>
`);

console.log(`created tracks/${id}.js`);
console.log(`created games/${stem}`);
console.log(`added "${id}" to catalogue.js`);
console.log(`\nnext: write the day in tracks/${id}.js, then run  node tools/check.mjs`);
