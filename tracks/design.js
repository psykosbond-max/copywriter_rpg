/* Track: Design Chronicles
   A track owns its people, its objectives, its step machine and its lessons.
   `TRACK_CONFIG` below overrides engine/defaults.js and the world for THIS GAME
   ONLY — the place to change one game without touching the other eight. */
window.TRACK_CONFIG={
  menuLede:"A day in an agency, and the six briefs that come with it."
};

const CAST={
 mike:{name:'Mike', role:'Creative Director', where:'Creative',
   accent:'#fbbf24', top:'#c9852f', topDk:'#a06a22', style:'overshirt', tee:'#f2ece0',
   legs:'#33405c', legsDk:'#26314a', shoe:'#e8e2d6',
   skin:'#c98a56', skinDk:'#a26c3f', hair:'#5a5148', hairHi:'#7d7266', cut:'curls',
   specs:true, prop:'notebook', build:1.04, bw:23, beard:true},
 kate:{name:'Kate', role:'Project Manager', where:'Servicing',
   accent:'#f472b6', top:'#6d4a63', topDk:'#523849', style:'blazer', tee:'#f2ece0',
   legs:'#2c2a26', legsDk:'#1f1e1b', shoe:'#33302b',
   skin:'#e8b98c', skinDk:'#c2955f', hair:'#2b1f18', hairHi:'#463228', cut:'long',
   specs:false, prop:'tablet', build:1.0, bw:20, beard:false},
 jenny:{name:'Jenny', role:'Production', where:'Studio',
   accent:'#34d399', top:'#2f7d78', topDk:'#215b57', style:'hoodie', tee:'#2f7d78',
   legs:'#5e6a4f', legsDk:'#48523c', shoe:'#e08265',
   skin:'#8d5f38', skinDk:'#6d4626', hair:'#1e1710', hairHi:'#3a2c1e', cut:'puff',
   specs:false, prop:'camera', build:0.98, bw:22, beard:false},
 alex:{name:'Alex', role:'Copywriter', where:'Creative',
   accent:'#38bdf8', top:'#e08265', topDk:'#b8624a', style:'knit', tee:'#e08265',
   legs:'#a8a49c', legsDk:'#8d8981', shoe:'#33302b',
   skin:'#f0c8a0', skinDk:'#cfa079', hair:'#3a2a1c', hairHi:'#5a4430', cut:'undercut',
   specs:true, prop:'coffee', build:0.96, bw:19, beard:false},
 dan:{name:'Dan', role:'Studio & everything else', where:'Break Room',
   accent:'#a78bfa', top:'#7d9070', topDk:'#5f6f54', style:'tee', tee:'#7d9070',
   legs:'#3f4a5c', legsDk:'#2f3747', shoe:'#f2ece0',
   skin:'#a0673a', skinDk:'#7d4c28', hair:'#22201d', hairHi:'#3a352d', cut:'beanie',
   specs:false, prop:'mug', build:1.02, bw:21, beard:true},
 player:{name:'You', role:'The new writer', where:'Lobby',
   accent:'#e4ded2', top:'#4a6a86', topDk:'#3a5468', style:'overshirt', tee:'#f2ece0',
   legs:'#33405c', legsDk:'#26314a', shoe:'#e8e2d6',
   skin:'#c08a5e', skinDk:'#9c6c45', hair:'#241c16', hairHi:'#3c2f24', cut:'short',
   specs:false, prop:null, build:1.0, bw:20, beard:false}
};
/* ==========================================================================
   DESIGN FUNDAMENTALS TRACK — content only
   ========================================================================== */

CAST.owen={name:'Owen', role:'Head of Visitor Experience, Quarry Lane', where:'Meeting',
  accent:'#5b8c7e', top:'#3f5f68', topDk:'#2e474e', style:'blazer', tee:'#f2ece0',
  legs:'#4a4640', legsDk:'#37342f', shoe:'#33302b',
  skin:'#d9a877', skinDk:'#b3834f', hair:'#4a4a48', hairHi:'#6b6b68', cut:'short',
  specs:true, prop:'folder', build:1.02, bw:22, beard:true};

const OBJ_DESIGN={
  museum_brief:'Get the Quarry Lane brief from Kate in Servicing',
  hierarchy:'Take the poster to Mike in Creative',
  type_size:'Jenny in the Studio has opinions about the type',
  grid:'Back to Mike — the layout is not sitting right',
  contrast:'Dan in the Break Room, before it goes anywhere',
  production:'Jenny in the Studio for the print check',
  client_feedback:'Owen is waiting in the Meeting Room',
  crisis_fix:'Studio. Jenny. Now.',
  crisis_show:'Back to Owen in the Meeting Room',
  complete:'You are a designer now'
};

function designOccupants(room){
  const s=G.step;
  const withClient=['client_feedback','crisis_fix','crisis_show'].indexOf(s)>=0;
  if(room==='lobby')     return [];
  if(room==='servicing') return [['kate',400,306,'down']];
  if(room==='creative')  return [['mike',260,258,'right'],['alex',560,268,'left']];
  if(room==='studio')    return [['jenny',400,196,'down']];
  if(room==='breakroom') return [['dan',650,268,'down']];
  if(room==='meeting')   return withClient?[['owen',400,196,'down']]:[];
  return [];
}

function designScript(key){
  const s=G.step;

  /* ---------- the brief ---------- */
  if(key==='kate'&&s==='museum_brief')
    return say('kate',`Kate. Quarry Lane Museum reopens in six weeks after two years shut. They need a poster campaign — six-sheets, bus stops, a bit of press. Their old material looked like a parish newsletter and they know it.`,
      [{label:'What do they want it to do?',go:function(){
        say('kate',`Get people who have never been to look twice. Mike's got the first layout on his desk and he is not happy with it. Go and be not happy with it too.`,
          [{label:'On my way.',go:function(){ advance('hierarchy'); }}]);
      }}]);

  /* ---------- 1. hierarchy ---------- */
  if(key==='mike'&&s==='hierarchy'){
    return choose('mike',
      `Here it is. Museum name at 90pt, "REOPENING" at 90pt, the date at 90pt, a quote from the curator at 60pt and the funder logos at the bottom. Everything is shouting. What do you do?`,
      [
       {label:`Shrink the curator quote and the logos so the top three can breathe.`,ok:false,
        note:`You've made the quiet things quieter and left three things fighting for first. Something still has to win. Again.`},
       {label:`Decide what the one thing is — "OPEN AGAIN" — make it enormous, and demote everything else two clear steps.`,ok:true},
       {label:`Balance them all at 70pt so the poster reads as one block.`,ok:false,
        note:`Now nothing is loud. A poster with no hierarchy is a paragraph at a bus stop, and nobody reads a paragraph at a bus stop. Again.`}
      ],function(){
        filed('Poster hierarchy','Quarry Lane','One thing first — OPEN AGAIN, then the date, then everything else');
        advance('type_size','mike',`Right. Hierarchy is not making things smaller, it is deciding what wins and then being brutal about the gap. Two steps, not half a step — if people have to work out what is most important, you have not designed it. Jenny will want a word about the typeface.`);
      });
  }

  /* ---------- 2. type at size ---------- */
  if(key==='jenny'&&s==='type_size'){
    return choose('jenny',
      `You've set OPEN AGAIN in that lovely high-contrast display face. I've printed you a proof at actual size and pinned it three metres away. Go and look, then tell me what you want to do.`,
      [
       {label:`Keep it — it's the most distinctive thing on the poster.`,ok:false,
        note:`It is. It's also lost its hairlines at that size and from there it reads as OPFN AGAlN. Distinctive is worth nothing if it is not legible. Again.`},
       {label:`Keep the display face for the big line where the weight holds, and set the date and details in a plain grotesque that survives small.`,ok:true},
       {label:`Set the whole poster in the plain grotesque to be safe.`,ok:false,
        note:`Safe and forgettable. You've solved legibility by removing every reason to look. Again.`}
      ],function(){
        filed('Type system','Quarry Lane','Display face for the big line, grotesque for everything that has to survive small');
        advance('grid','jenny',`That's the pairing. One face for personality, one for work. And you looked at it printed instead of at 400% on a screen, which is the whole lesson. Mike wants you back — the layout is still sitting oddly.`);
      });
  }

  /* ---------- 3. grid and optical alignment ---------- */
  if(key==='mike'&&s==='grid'){
    return choose('mike',
      `Everything is on the grid. Every box snaps. And it still looks wrong — the big line sits left of the block beneath it, and the gaps between the three details are identical but they read as two groups and a stray. Why?`,
      [
       {label:`It isn't wrong — the numbers are right, so it's fine.`,ok:false,
        note:`The numbers are right and your eye says no. Your eye is the client. Again.`},
       {label:`Align the big line optically — the O overshoots, so nudge it — and group the details by meaning, so related things sit closer than unrelated ones.`,ok:true},
       {label:`Increase all the gaps equally until it feels more spacious.`,ok:false,
        note:`Now it is evenly wrong with more air. Equal spacing between unequal things is how you get three items that read as two groups. Again.`}
      ],function(){
        filed('Layout','Quarry Lane','Optically aligned, grouped by meaning rather than by measurement');
        advance('contrast','mike',`Yes. Round letters overshoot, and proximity means relationship whether you intended it or not. If it looks aligned, it is aligned — the ruler is a tool, not a judge. Dan needs to see this before it goes anywhere.`);
      });
  }

  /* ---------- 4. contrast and access ---------- */
  if(key==='dan'&&s==='contrast'){
    return choose('dan',
      `Dan. Studio, and everything nobody else wants to do — which today means telling you the date is mid-grey on a pale stone background and the museum is publicly funded. Also you've put the accessible-entrance information in green and the step-free route in red.`,
      [
       {label:`Darken the date until it passes contrast, and keep the colour coding for the routes.`,ok:false,
        note:`Half a fix. Anyone who cannot separate red from green still cannot read your route map, and that is about one man in twelve. Again.`},
       {label:`Darken the date to clear contrast, and label the routes as well as colouring them.`,ok:true},
       {label:`Put a white box behind everything so it all passes.`,ok:false,
        note:`You've passed a check and wrecked the poster. Accessibility is a constraint you design with, not a plaster you stick over the top. Again.`}
      ],function(){
        filed('Accessibility pass','Quarry Lane','Contrast raised, and nothing left carried by colour alone');
        advance('production','dan',`Right. Never let colour carry meaning on its own, and the publicly funded ones get audited. Jenny's got the print check.`);
      });
  }

  /* ---------- 5. production ---------- */
  if(key==='jenny'&&s==='production'){
    return choose('jenny',
      `Print check. Six-sheet, litho, and you've sent me an RGB file with the type running to the very edge of the artboard and the funder logos at 6mm tall. Tell me what is wrong with that sentence.`,
      [
       {label:`Convert to CMYK and send it over.`,ok:false,
        note:`One of three. Your type is still going to be guillotined and those logos will fill in to grey mush. Again.`},
       {label:`Convert to CMYK, add 5mm bleed with the type pulled inside the safe area, and scale the logos to their minimum reproduction size.`,ok:true},
       {label:`Leave it — the printer will sort the technical bits out.`,ok:false,
        note:`The printer will do exactly what you sent, at three in the morning, for a hundred and forty sheets. Again.`}
      ],function(){
        filed('Print-ready artwork','Quarry Lane','CMYK, bled, safe area respected, logos at minimum size');
        advance('client_feedback','jenny',`That's a file I can send. Design that cannot be made is not design, it is a picture of design. Owen's in the meeting room.`);
      });
  }

  /* ---------- 6. the client, and the thing that goes wrong ---------- */
  if(key==='owen'&&s==='client_feedback'){
    return choose('owen',
      `Owen Blackwood, visitor experience. It's smart, it really is. But — and the trustees will say this too — can we make the logo bigger? It feels like the museum isn't the main thing.`,
      [
       {label:`"Of course — I'll double it."`,ok:false,
        note:`(You have just broken the hierarchy you spent all week building, to answer a question nobody asked. He did not say the logo was too small. He said the museum did not feel like the main thing. Again.)`},
       {label:`"Making it bigger would fight the headline. Can I ask what's making the museum feel secondary — is it the size, or that the name isn't near the thing people will remember?"`,ok:true},
       {label:`"Bigger logos don't get noticed more — that's a common misconception."`,ok:false,
        note:`I'm sure you're right. I'll take it to the trustees as it is, then.  (You won the argument and lost the client. Again.)`}
      ],function(){
        say('owen',`...It's that it's down in the corner with the funders. It reads like we sponsored our own poster. If the name sat with OPEN AGAIN I don't think I'd care how big it was.`,
          [{label:'That I can fix.',go:function(){
            filed('Client revision','Quarry Lane','Name moved to the headline — the real note, not the stated one');
            startClock(90);
            say('kate',`Which is a twenty-minute fix, except the printer's file deadline is in ninety seconds and after that it's next Thursday, which is after the reopening. Jenny is in the studio. Go.`,
              [{label:'Go.',go:function(){ G.step='crisis_fix'; paintHUD(); closeDlg(); }}]);
          }}]);
      });
  }

  if(key==='jenny'&&s==='crisis_fix'){
    return choose('jenny',`Talk fast. What am I changing?`,[
      {label:`Scale the logo up 200% where it is and resend.`,ok:false,
       note:`That's the note he didn't give you. You'd be shipping the thing you just talked him out of. Again — quickly.`},
      {label:`Lock the museum name to the headline as one unit, leave the funders at the bottom, keep the safe area.`,ok:true},
      {label:`Rebuild the top third properly — it'll only take twenty minutes.`,ok:false,
       note:`We have ninety seconds and a litho slot. Twenty minutes is next Thursday, which is after they open. Again.`}
    ],function(){
      advance('crisis_show','jenny',`Done, exported, and it's gone to the printer with eleven seconds on it. Go and show him before he changes his mind about changing his mind.`);
    });
  }

  if(key==='owen'&&s==='crisis_show'){
    stopClock();
    return say('owen',`Oh. That's it. That's exactly it — and it's not any bigger, is it.`,
      [{label:'Not a point bigger.',go:function(){
        say('owen',`I've asked four agencies to make a logo bigger. You're the first who asked me why.`,
          [{label:'...',go:function(){
            say('kate',`That is the job. Not the grid, not the typeface — that. A client describes a problem in the only language they have, and your first instinct is to translate it instead of obeying it. Six pieces and a print deadline you did not miss. You are a designer now.`,
              [{label:'Thank you.',go:function(){ G.step='complete'; paintHUD(); closeDlg(); openCertificate(); }}]);
          }}]);
      }}]);
  }

  /* ---------- Alex: hints ---------- */
  if(key==='alex'){
    const h={
      museum_brief:`Kate's in Servicing. Ask what the poster has to do, not what it has to contain.`,
      hierarchy:`Three things at the same size means no things. Pick the one and be brutal about the gap.`,
      type_size:`Print it and walk away from it. Everything looks legible at 400% on a screen.`,
      grid:`If it looks aligned, it is aligned. The ruler is a tool, not a judge.`,
      contrast:`Dan will check contrast, and whether anything is carried by colour alone. Both, not one.`,
      production:`Bleed, safe area, CMYK, minimum sizes. The printer does exactly what you send.`,
      client_feedback:`"Make the logo bigger" is never about the logo. Find out what it is about.`,
      crisis_fix:`Smallest change that answers the real note. Not the best version — the shippable one.`,
      crisis_show:`Go and show him. He hasn't seen it yet.`,
      complete:`You got a client to un-ask for a bigger logo. That's a first here. Drink?`
    };
    return say('alex', h[s] || `Stuck? Tell me what has to be seen first and we'll work back from there.`);
  }

  const idle={
    kate:`Nothing new — go and finish what you've got.`,
    mike:`Bring it back when something on it wins.`,
    jenny:`Bring me a file and I'll tell you whether it can be made.`,
    dan:`Kettle's on. And check your contrast before you get comfortable.`,
    owen:`I'll wait. The trustees meet at four, mind.`
  };
  say(key, idle[key] || `...`);
}

TRACK_DEFS.design={
  id:'design', name:'Design Fundamentals', title:'Design Chronicles',
  blurb:'Hierarchy, type, grid, and work that survives production.',
  first:'museum_brief',
  roles:{mike:'Design Director', kate:'Project Manager', jenny:'Production',
         alex:'Designer', dan:'Studio & everything else',
         owen:'Head of Visitor Experience, Quarry Lane', player:'The new designer'},
  script:function(key){ return designScript(key); },
  occupants:function(room){ return designOccupants(room); },
  objectives:OBJ_DESIGN,
  opening:{text:`Nine in the morning. There is a layout on the Creative Director's desk that nobody likes, including the person who made it, and a museum that reopens in six weeks.`,
           label:'Find Kate.'},
  certTitle:'DESIGN CHRONICLES',
  timeUp:{who:'kate',line:`Time. The file slot has gone, so the posters go up next Thursday — after they reopen. Finish it anyway. Missing a deadline is survivable; not knowing what you would have changed is not.`},
  certBody:['designed the Quarry Lane reopening campaign — hierarchy, type, layout, contrast',
            'and print-ready artwork — and translated a client note into the change they',
            'actually meant, with ninety seconds on the printer\u2019s deadline.'],
  lessons:[
    {t:'Hierarchy is deciding what wins', c:'The poster',
     l:'Three things at the same size means no things. Pick the one and make the gap obvious — two clear steps, not half a step.'},
    {t:'Legibility beats personality', c:'The typeface',
     l:'A high-contrast display face loses its hairlines at size. Keep the character where the weight holds it and set the working text in something that survives.'},
    {t:'Print it and walk away', c:'The typeface',
     l:'Everything is legible at 400% on a screen. Judge it at actual size from the distance it will be read.'},
    {t:'If it looks aligned, it is aligned', c:'The layout',
     l:'Round letters overshoot. Snapping to the grid is a tool, not a verdict — your eye is the client.'},
    {t:'Proximity means relationship', c:'The layout',
     l:'Equal gaps between unequal things create groups you did not intend. Space by meaning, not by measurement.'},
    {t:'Never let colour carry meaning alone', c:'Accessibility',
     l:'Label it as well as colouring it. About one man in twelve cannot separate your red route from your green one.'},
    {t:'Accessibility is a constraint, not a plaster', c:'Accessibility',
     l:'Raise the contrast within the design. A white box behind everything passes the check and wrecks the work.'},
    {t:'Design that cannot be made is not design', c:'Production',
     l:'Bleed, safe area, CMYK, minimum reproduction size. The printer does exactly what you send, at three in the morning.'},
    {t:'"Make the logo bigger" is never about the logo', c:'The client',
     l:'A client describes a problem in the only language they have. Translate the note instead of obeying it — and instead of winning the argument.'}
  ]
};


