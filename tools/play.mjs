#!/usr/bin/env node
/* Play every game in the catalogue to the end, in a real browser.
 *
 *     node tools/play.mjs            all of them
 *     node tools/play.mjs digital    just one
 *
 * tools/check.mjs proves a track is well formed. This proves it can actually be
 * finished: it starts a run, then at every step tries each character until one
 * has something to say, and each answer until the day moves on -- following
 * single-option story beats as well as choices. It stops when the step reaches
 * `complete` and the certificate is open.
 *
 * This is the test that catches a step key that never fires, a character who is
 * never asked, or a branch that leads nowhere -- the things that make a new
 * track unfinishable while still looking correct.
 *
 * Exit code is non-zero if any game cannot be completed.
 */
import fs from 'node:fs';
import path from 'node:path';

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error('play: playwright is not installed. Run:  npm install');
  process.exit(1);
}

const ROOT = path.resolve(import.meta.dirname, '..');
const cat = new Function('window', fs.readFileSync(path.join(ROOT,'catalogue.js'),'utf8')+'; return window.CATALOGUE;')({});
const want = process.argv.slice(2);
const list = want.length ? cat.filter(e=>want.includes(e.id)) : cat;

const b = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM || '/opt/pw-browsers/chromium' });
let failed = 0;

for (const entry of list) {
  const p = await b.newPage({ viewport:{width:1100,height:900} });
  const errs=[]; p.on('pageerror', e=>errs.push(String(e).slice(0,140)));
  await p.goto(`file://${ROOT}/games/${entry.file}`);
  await p.waitForTimeout(900);
  // start a run
  await p.click('#btnPlay'); await p.waitForTimeout(150);
  await p.fill('#nameInput','Harsha'); await p.click('#nameGo'); await p.waitForTimeout(150);
  await p.click('#av0'); await p.click('#avGo'); await p.waitForTimeout(500);

  const r = await p.evaluate(async () => {
    const sleep = ms => new Promise(r=>setTimeout(r,ms));
    const keys = Object.keys(CAST).filter(k=>k!=='player'&&!k.startsWith('p_'));
    const seen = [];
    let guard = 0;

    const opts = () => [...document.querySelectorAll('#dlg .opts button')];
    const step = () => G.step;

    while (step() !== 'complete' && guard++ < 400) {
      const before = step();
      if (seen[seen.length-1] !== before) seen.push(before);

      let o = opts();
      if (o.length) {
        // try each option until the step moves or the choice set changes
        for (let i = 0; i < o.length; i++) {
          const txt = o.map(x=>x.textContent).join('|');
          o[i].click(); await sleep(60);
          if (step() !== before) break;
          const now = opts();
          if (!now.length) break;                 // dialogue closed or moved on
          if (now.map(x=>x.textContent).join('|') !== txt) break;  // follow-up appeared
          o = now;
        }
        continue;
      }
      // No dialogue open: try each character until one has something for this
      // step. A story beat can be a chain of single-option lines, so click
      // through them -- only an idle line ends with nothing having moved.
      let opened = false;
      for (const k of keys) {
        talkTo(k); await sleep(30);
        if (!opts().length) continue;
        if (opts().length > 1) { opened = true; break; }
        let chain = 0;
        while (opts().length === 1 && chain++ < 12) {
          const b4 = step();
          opts()[0].click(); await sleep(50);
          if (step() !== b4) { opened = true; break; }
        }
        if (opened || opts().length > 1) { opened = true; break; }
      }
      if (!opened && step() === before) {
        return { ok:false, stuck:before, seen, cert:false };
      }
    }
    const certOpen = getComputedStyle(document.getElementById('cert')).display !== 'none';
    return { ok: step()==='complete', stuck:null, seen, cert:certOpen,
             portfolio: G.portfolio.length, guard };
  });

  const bad = !r.ok || errs.length;
  if (bad) failed++;
  console.log(`${bad?'FAIL':'ok  '} ${entry.id.padEnd(12)} ` +
    (r.ok ? `completed ${r.seen.length} steps, ${r.portfolio} work-log entries, certificate=${r.cert}`
          : `STUCK at "${r.stuck}" after ${r.seen.length} steps`));
  if (r.seen && !r.ok) console.log('       reached:', r.seen.join(' -> '));
  errs.forEach(e=>console.log('       ', e));
  await p.close();
}
await b.close();
console.log(failed ? `\n${failed} of ${list.length} could not be completed` : `\nall ${list.length} playable end to end`);
process.exit(failed?1:0);
