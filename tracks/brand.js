/* Track: Brand Chronicles
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
   BRAND STRATEGY TRACK — content only
   ========================================================================== */

CAST.nadia={name:'Nadia', role:'Managing Director, Marrow', where:'Lobby',
  accent:'#c2703f', top:'#7a4a3c', topDk:'#5c362b', style:'knit', tee:'#7a4a3c',
  legs:'#3f4a54', legsDk:'#2e3740', shoe:'#33302b',
  skin:'#e8bb92', skinDk:'#c6956c', hair:'#6b4a2c', hairHi:'#8a6540', cut:'puff',
  specs:false, prop:null, build:1.0, bw:21, beard:false};

const OBJ_BRAND={
  client_ambition:'Nadia from Marrow is waiting in the Lobby',
  positioning:'Take it to Kate in Servicing',
  insight:'Find Dan in the Break Room — he has been in the shops',
  architecture:'Ask Jenny in the Studio what it means to build',
  brief_creative:'Turn it into something Mike can make',
  present_brand:'Present the strategy in the Meeting Room',
  crisis_salvage:'Think. Now.',
  complete:'You are a strategist now'
};

function brandOccupants(room){
  const s=G.step;
  const pitching=['present_brand','crisis_salvage'].indexOf(s)>=0;
  if(room==='lobby')     return s==='client_ambition'?[['nadia',400,300,'down']]:[];
  if(room==='servicing') return pitching?[['alex',620,240,'left']]
                                        :[['kate',400,306,'down'],['alex',620,240,'left']];
  if(room==='creative')  return [['mike',260,258,'right']];
  if(room==='studio')    return [['jenny',400,196,'down']];
  if(room==='breakroom') return [['dan',650,268,'down']];
  if(room==='meeting')   return pitching?[['nadia',360,196,'down'],['kate',470,196,'down']]:[];
  return [];
}

function brandScript(key){
  const s=G.step;

  /* ---------- 1. what the client actually wants ---------- */
  if(key==='nadia'&&s==='client_ambition'){
    return choose('nadia',
      `Nadia Fairhurst. My grandfather opened the first shop in 1961, we've got fourteen now, and last year was the first one we didn't grow. I want a rebrand. New look, new logo, the lot.`,
      [
       {label:`"A refresh could really modernise you — let's look at the identity."`,ok:false,
        note:`So you'd change the sign.  (She asked for a new logo because that is the only lever she knows the name of. A new logo on an unchanged business is an expensive apology. Again.)`},
       {label:`"Before we touch the logo — who's stopped coming, and where are they going instead?"`,ok:true},
       {label:`"Rebrands rarely fix a sales problem."`,ok:false,
        note:`Then what am I paying you for?  (Correct, and useless. You've diagnosed nothing and closed the conversation. Again.)`}
      ],function(){
        say('nadia',`...Thirty-somethings. They're not going to another butcher, they're going to the supermarket and to those recipe boxes. They'd say we're for people who know what to ask for. Which we are. That's rather the problem, isn't it.`,
          [{label:'That is the problem.',go:function(){
            filed('Diagnosis','Marrow','Not a logo problem \u2014 expertise reading as a test');
            advance('positioning','nadia',`Nobody has ever asked me who stopped coming. They ask what colour I want the bags.`);
          }}]);
      });
  }

  /* ---------- 2. positioning ---------- */
  if(key==='kate'&&s==='positioning'){
    return choose('kate',
      `Right. Fourteen shops, expertise that intimidates the people they need, supermarkets cheaper and recipe boxes easier. Give me a position. And remember a position you can't be excluded from isn't one.`,
      [
       {label:`"Quality meat, expertly sourced, for everyone."`,ok:false,
        note:`Who is that not for? Nobody. Which means it's not a position, it's a description, and every butcher in the country could put it on a window. Again.`},
       {label:`"The butcher for people who don't know what to ask for — expertise that does the deciding, not the judging."`,ok:true},
       {label:`"The anti-supermarket. Real meat, real people, no plastic."`,ok:false,
        note:`You've positioned against a competitor instead of for a customer, so the moment the supermarket improves you've got nothing left. And it flatters the people who already shop there. Again.`}
      ],function(){
        filed('Positioning','Marrow','Expertise that decides for you, rather than judging you');
        advance('insight','kate',`That one costs them something — it turns their proudest asset into a service instead of a test, and it will annoy their oldest customers. That is how you know it is a position. Now go and find out if it is true. Dan has been in four of the shops.`);
      });
  }

  /* ---------- 3. insight, not observation ---------- */
  if(key==='dan'&&s==='insight'){
    return choose('dan',
      `Four shops, three Saturdays. Here's what I've got: people queue outside rather than come in when it's busy. They rehearse the order under their breath. Two walked out when the man in front asked for something in French. Which of those is your insight?`,
      [
       {label:`"Customers find butchers intimidating."`,ok:false,
        note:`That's the observation you walked in with. An insight tells you something you could act on tomorrow. That one just tells you people are shy. Again.`},
       {label:`"The queue is the shop window, and right now it's showing them a test they might fail."`,ok:true},
       {label:`"They need clearer signage and price labelling."`,ok:false,
        note:`That's a solution, and a small one. You've skipped the thinking and gone straight to a to-do list. Again.`}
      ],function(){
        filed('Insight','Marrow','The queue is the shop window — and it is showing a test');
        advance('architecture','dan',`That's the one. Nobody's frightened of meat. They're frightened of being watched not knowing. Jenny will want to know what this means for the sub-brand — go on.`);
      });
  }

  /* ---------- 4. architecture ---------- */
  if(key==='jenny'&&s==='architecture'){
    return choose('jenny',
      `Before I design anything — they bought Pickett's, the deli chain, two years ago. Six shops, own name, own customers, slightly posher. What happens to it?`,
      [
       {label:`"Rebrand it as Marrow. One name, one system, simpler for everyone."`,ok:false,
        note:`Simpler for me. Not for the six shops full of people who chose Pickett's precisely because it wasn't a butcher. You'd save on artwork and lose a customer base. Again.`},
       {label:`"Keep Pickett's, endorsed by Marrow. Different jobs, different customers, one guarantee behind both."`,ok:true},
       {label:`"Leave them completely separate. Don't confuse anyone."`,ok:false,
        note:`Then you've paid for an acquisition and got nothing from it. No transfer of trust in either direction. Again.`}
      ],function(){
        filed('Brand architecture','Marrow','Endorsed — Pickett\u2019s keeps its name, Marrow stands behind it');
        advance('brief_creative','jenny',`Endorsed. That I can build — one guarantee mark, two personalities, and I don't have to make a deli look like a butcher. Mike's waiting.`);
      });
  }

  /* ---------- 5. strategy a creative can use ---------- */
  if(key==='mike'&&s==='brief_creative'){
    return choose('mike',
      `Strategy is only worth anything if someone can make something out of it. So: what am I actually making?`,
      [
       {label:`"A campaign that communicates warmth, expertise and accessibility."`,ok:false,
        note:`Three adjectives, no idea. Warmth, expertise and accessibility is a description of about eight thousand brands. Give me the tension. Again.`},
       {label:`"Work where Marrow does the knowing so the customer doesn't have to — the butcher answers the question you were too embarrassed to ask."`,ok:true},
       {label:`"Something that makes younger people feel welcome in the shop."`,ok:false,
        note:`That's the goal, not the idea. You've handed me the brief's outcome and kept the thinking to yourself. Again.`}
      ],function(){
        filed('Creative platform','Marrow','Marrow does the knowing, so you don\u2019t have to');
        advance('present_brand','mike',`Now there's something to make. There's a mechanic in it — the question you were too embarrassed to ask — and I can run that anywhere. Go and sell it.`);
      });
  }

  /* ---------- 6. the presentation and the thing that goes wrong ---------- */
  if(key==='nadia'&&s==='present_brand'){
    return say('nadia',`Go on then. Convince me to change what my grandfather built.`,
      [{label:'Present the strategy.',go:function(){
        say('nadia',`"Marrow does the knowing, so you don't have to." And Pickett's keeps its name with us behind it. I'll be honest, I came in wanting a new logo and you've sold me a different shop. I like it. I —`,
          [{label:'(her phone buzzes)',go:function(){
            startClock(120);
            say('nadia',`That's my daughter. She's sent me a link. Fletcher's — the chain out of Leeds — launched this morning. Their line is "No silly questions." Same idea. Same week. They've got fifty shops to our fourteen and they've beaten us to it.`,
              [{label:'Think.',go:function(){ G.step='crisis_salvage'; paintHUD(); brandCrisis(); }}]);
          }}]);
      }}]);
  }
  if(key==='kate'&&s==='present_brand')
    return say('kate',`(She is letting you present. That is the test.)`);
  if((key==='nadia'||key==='kate')&&s==='crisis_salvage') return brandCrisis();

  /* ---------- Alex: hints ---------- */
  if(key==='alex'){
    const h={
      client_ambition:`She's in the lobby. Whatever she says she wants changed, ask what stopped working first.`,
      positioning:`Kate will ask who it excludes. If the answer is nobody, go back and think again.`,
      insight:`An observation tells you what happened. An insight tells you what to do about it.`,
      architecture:`Sub-brands are a trust question, not a tidiness question. Who is borrowing credibility from whom?`,
      brief_creative:`Mike can't make an adjective. Give him a tension he can build something around.`,
      present_brand:`You're asking her to change something her grandfather started. Say that out loud before she does.`,
      crisis_salvage:`Same idea isn't the same brand. What can they say that Fletcher's can't?`,
      complete:`First strategy and it survived contact with a competitor. Drink?`
    };
    return say('alex', h[s] || `Stuck? Tell me the position and I'll tell you who it excludes.`);
  }

  const idle={
    kate:`Come back when you've got something I can argue with.`,
    mike:`Bring me a tension, not a mood board.`,
    jenny:`Tell me the architecture and I'll tell you if I can build it.`,
    dan:`Kettle's on. I've been in the shops, when you want to know what's actually happening.`,
    nadia:`I'll wait. Fourteen shops won't run themselves, mind.`
  };
  say(key, idle[key] || `...`);
}

function brandCrisis(){
  choose('nadia',`Well? Do we start again?`,[
    {label:`"Let's differentiate on tone — we'll own it better than they do."`,ok:false,
     note:`Better is not different. You're proposing we spend two years out-executing a chain with fifty shops on their own idea. Again.`},
    {label:`"They've got the line. We've got the shops your family has run for sixty years — no silly questions is a promise; a butcher who has known your mother's order since 1994 is proof. We keep the strategy and we prove it where they can't."`,ok:true},
    {label:`"We move to the Pickett's positioning instead and lead with the deli."`,ok:false,
     note:`You've abandoned a true position because someone else said something similar, and led with the smaller business. Fletcher's would have won by press release. Again.`}
  ],function(){
    stopClock();
    G.portfolio[G.portfolio.length-1]={title:'Creative platform (defended)',client:'Marrow',
      line:'Marrow does the knowing — and sixty years is the proof Fletcher\u2019s cannot buy'};
    say('nadia',`...They can say it. We can show it. That's not the same thing.`,
      [{label:'No, it is not.',go:function(){
        say('kate',`That is the job. Not the line — that. A competitor says your idea out loud and you work out in ninety seconds what they cannot prove. Strategies do not die because someone copies them. They die because the person holding them panics.`,
          [{label:'Thank you.',go:function(){ G.step='complete'; paintHUD(); closeDlg(); openCertificate(); }}]);
      }}]);
  });
}

TRACK_DEFS.brand={
  id:'brand', name:'Brand Strategy', title:'Brand Chronicles',
  blurb:'Positioning, architecture, and the discipline of saying no.',
  first:'client_ambition',
  roles:{kate:'Strategy Director', alex:'Strategist', mike:'Creative Director',
         jenny:'Design & Production', dan:'Studio & everything else',
         nadia:'Managing Director, Marrow', player:'The new strategist'},
  script:function(key){ return brandScript(key); },
  occupants:function(room){ return brandOccupants(room); },
  objectives:OBJ_BRAND,
  opening:{text:`Nine in the morning. There is a woman in the lobby who has been running fourteen butchers' shops since before you were born, and she has come to be told what is wrong with them.`,
           label:'Go over.'},
  certTitle:'BRAND CHRONICLES',
  timeUp:{who:'kate',line:`Time. She has gone back to Leeds thinking we had no answer, which is worse than having a bad one. Work it out anyway — the next competitor will be along shortly.`},
  certBody:['built the Marrow strategy from the ground up — found the position, the insight,',
            'the architecture and the platform, and held all four when a competitor',
            'launched the same idea the morning of the presentation.'],
  lessons:[
    {t:'A brief is not a diagnosis', c:'Marrow',
     l:'Clients name the lever they know the name of. A new logo on an unchanged business is an expensive apology — find out what stopped working first.'},
    {t:'A position excludes', c:'Positioning',
     l:'If nobody is excluded by it, it is a description, not a position. A real one costs you something and annoys somebody.'},
    {t:'Do not position against a competitor', c:'Positioning',
     l:'Define yourself by a customer, not a rival. Position against a competitor and you have nothing the day they improve.'},
    {t:'Observation is not insight', c:'The shop floor',
     l:'An observation tells you what happened. An insight tells you what to do tomorrow. If it does not change a decision, it is a fact you have dressed up.'},
    {t:'Go and look', c:'The shop floor',
     l:'The insight was outside the shop, in the queue, on a Saturday. It was not in the data and it was never going to be.'},
    {t:'Architecture is a trust question', c:'Pickett\u2019s',
     l:'Ask who borrows credibility from whom. Consolidating everything is tidy for the agency and expensive for the client.'},
    {t:'Strategy has to be makeable', c:'Briefing creative',
     l:'Three adjectives is not a strategy. Hand over a tension someone can build work around, or you have kept the thinking to yourself.'},
    {t:'Better is not different', c:'The competitor launch',
     l:'Out-executing someone on their own idea is a two-year plan that needs a bigger budget than yours.'},
    {t:'Copied is not lost', c:'The competitor launch',
     l:'When someone says your idea first, find what they cannot prove. Strategies rarely die from imitation — they die because the person holding them panics.'}
  ]
};


