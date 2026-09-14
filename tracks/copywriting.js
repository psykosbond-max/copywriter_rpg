/* Track: Copywriter Chronicles
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
   COPYWRITING TRACK — content only
   ========================================================================== */

function inMeetingFinale(){
  return ['present_integrated','crisis_call','negotiate_time','crisis_rewrite','deliver_integrated'].indexOf(G.step)>=0;
}
function copywritingOccupants(room){
  const s=G.step, fin=inMeetingFinale();
  /* Once the client calls, Mike goes up to Creative for the whiteboard and stays
     there — the player leaves him at it, so he must not reappear downstairs. */
  const mikeUpstairs=(s==='negotiate_time'||s==='crisis_rewrite'||s==='deliver_integrated');
  if(room==='lobby')     return [];
  if(room==='servicing') return fin ? [] : [['kate',400,306,'down']];
  if(room==='creative'){
    const out=[];
    if(!fin || mikeUpstairs) out.push(['mike',260,258,'right']);
    out.push(['alex',560,268,'left']);
    return out;
  }
  if(room==='studio')    return [['jenny',400,196,'down']];
  if(room==='breakroom') return [['dan',650,268,'down']];
  if(room==='meeting'){
    if(!fin) return [];
    return mikeUpstairs ? [['kate',360,196,'down']]
                        : [['kate',360,196,'down'],['mike',470,196,'down']];
  }
  return [];
}


const OBJ_COPYWRITING={
  first_brief:'Find Kate in Servicing',
  brief_tagline:'Take the Tidewater brief to Mike',
  craft_tagline:'Choose a tagline with Mike',
  deliver_tagline:'Take the tagline to Kate',
  brief_email:'Take the Ferngate brief to Mike',
  craft_email:'Choose the email approach with Mike',
  mandatories_email:'Get it checked by Dan in the Break Room',
  deliver_email:'Take the email to Kate',
  brief_poster:'Take the Northlight brief to Mike',
  craft_poster:'Choose the poster copy with Mike',
  production_poster:'Get Jenny to sign it off in the Studio',
  deliver_poster:'Take the poster to Kate',
  brief_radio:'Take the Ambercroft brief to Mike',
  craft_radio:'Choose the radio script with Mike',
  timing_radio:'Have Jenny time the read in the Studio',
  deliver_radio:'Take the script to Kate',
  brief_landing:'Take the Loomwork brief to Mike',
  craft_landing:'Write the call to action with Mike',
  deliver_landing:'Take the page to Kate',
  revise_landing:'Ask Mike about the client objection',
  deliver_landing_v2:'Take the revised page to Kate',
  brief_integrated:'Take the Harbour & Wren brief to Mike',
  craft_integrated:'Build the campaign with Mike',
  present_integrated:'Present to Kate in the Meeting Room',
  crisis_call:'Talk to Kate',
  negotiate_time:'Get the rewrite from Mike in Creative',
  crisis_rewrite:'Rewrite it with Mike in Creative',
  deliver_integrated:'Get back to Kate in the Meeting Room',
  complete:'You are a copywriter now'
};


function copywritingScript(key){
  const s=G.step;

  /* ---------- 1. tagline ---------- */
  if(key==='kate'&&s==='first_brief')
    return say('kate',`You're the new writer — Kate, I run the projects. Briefs come from me, feedback comes from me, and if one doesn't make sense you ask before you write, not after. Straight in, then. Tidewater Swim School. Adult beginners, thirty to fifty-five. Every competitor talks about technique and qualified instructors. Research says the barrier isn't time or money — it's the embarrassment of being a beginner in public. They want a tagline.`,
      [{label:'Got it.',go:function(){ advance('brief_tagline','kate',`Take it to Mike before you write anything.`); }}]);

  if(key==='mike'&&s==='brief_tagline')
    return say('mike',`The brief hands you the answer and most people walk past it. They told you the barrier is embarrassment. So write to the embarrassment, not to the lessons.`,
      [{label:'Show me the options.',go:function(){ G.step='craft_tagline'; paintHUD(); craftTagline(); }}]);
  if(key==='mike'&&s==='craft_tagline') return craftTagline();

  if(key==='kate'&&s==='deliver_tagline')
    return say('kate',`"Nobody's watching. Everybody started here." — that's the objection handled in six words. Client's taking it to print. First one done.`,
      [{label:`What's next?`,go:function(){
        say('kate',`Ferngate Garden Centre. Forty thousand subscribers, most haven't opened anything in a year, and they want to push the spring range. They've sent over a subject line they're fond of: "Ferngate Spring Newsletter — April Edition."`,
          [{label:'Oh dear.',go:function(){ advance('brief_email','kate',`Quite. Mike's expecting you.`); }}]);
      }}]);

  /* ---------- 2. email ---------- */
  if(key==='mike'&&s==='brief_email')
    return say('mike',`Two jobs, two lines. The subject line earns the open. The first line earns the scroll. The client's version does neither — it tells them what the email is, then says hello.`,
      [{label:'Show me.',go:function(){ G.step='craft_email'; paintHUD(); craftEmail(); }}]);
  if(key==='mike'&&s==='craft_email') return craftEmail();

  if(key==='dan'&&s==='mandatories_email')
    return say('dan',`Dan — studio, and everything else nobody wants to do. Before that sends — unsubscribe link, physical address, and the offer end date in the body, not just the subject. Missing any of the three and it's not a creative problem any more, it's a legal one.`,
      [{label:'Adding them now.',go:function(){ advance('deliver_email','dan',`Good. Off you go.`); }}]);

  if(key==='kate'&&s==='deliver_email')
    return say('kate',`"Your garden is three weeks behind." Open rate came back at four times their last send. Right — Northlight Film Festival. Nine days, forty films, mostly first-time directors. Six-sheet by a bus stop, so they're standing still for two minutes but reading from three metres.`,
      [{label:'To Mike.',go:function(){ advance('brief_poster'); }}]);

  /* ---------- 3. poster ---------- */
  if(key==='mike'&&s==='brief_poster')
    return say('mike',`A poster is a hierarchy, not a paragraph. One line to stop them, one to explain, one to tell them what to do. Everything else is a website.`,
      [{label:'Show me.',go:function(){ G.step='craft_poster'; paintHUD(); craftPoster(); }}]);
  if(key==='mike'&&s==='craft_poster') return craftPoster();

  if(key==='jenny'&&s==='production_poster')
    return say('jenny',`Jenny, production. Everything you write comes through me before a client sees it, so we'll be seeing a lot of each other. Right — "Forty directors you haven't heard of yet." Six words — that'll hold at six-sheet and still read on a phone. Dates and URL are there. This is the part people skip, by the way: copy that can't be set gets rewritten by someone who isn't you.`,
      [{label:'Thanks, Jenny.',go:function(){ advance('deliver_poster'); }}]);

  if(key==='kate'&&s==='deliver_poster')
    return say('kate',`Festival's delighted. Next one's audio — Ambercroft Cider, thirty seconds, drivetime. No pictures, no second read, and the listener is driving.`,
      [{label:'To Mike.',go:function(){ advance('brief_radio'); }}]);

  /* ---------- 4. radio ---------- */
  if(key==='mike'&&s==='brief_radio')
    return say('mike',`Radio carries one thing. Not three. Decide now whether that thing is the name, the offer or the feeling, because you only get one.`,
      [{label:'Show me.',go:function(){ G.step='craft_radio'; paintHUD(); craftRadio(); }}]);
  if(key==='mike'&&s==='craft_radio') return craftRadio();

  if(key==='jenny'&&s==='timing_radio')
    return say('jenny',`Read it against the clock... sixty-eight words. Thirty seconds holds about seventy-five at a natural pace, so you've left the voice artist room to breathe. Most writers hand me ninety and wonder why it sounds rushed.`,
      [{label:'Good to know.',go:function(){ advance('deliver_radio'); }}]);

  if(key==='kate'&&s==='deliver_radio')
    return say('kate',`Booked for six weeks regional. Now something harder. Loomwork — invoicing tool for freelancers. Traffic's fine, sign-ups aren't. People reach the bottom of the page and leave. The client thinks the headline's wrong.`,
      [{label:'Is it?',go:function(){
        say('kate',`If they're reaching the bottom, no. Ask Mike.`,
          [{label:'Going.',go:function(){ advance('brief_landing'); }}]);
      }}]);

  /* ---------- 5. landing page ---------- */
  if(key==='mike'&&s==='brief_landing')
    return say('mike',`They read the whole page and didn't click. That's not a headline problem, that's the last inch. The call to action is an instruction, not a full stop — and it has to kill whatever's stopping the hand.`,
      [{label:'Show me.',go:function(){ G.step='craft_landing'; paintHUD(); craftLanding(); }}]);
  if(key==='mike'&&s==='craft_landing') return craftLanding();

  if(key==='kate'&&s==='deliver_landing')
    return say('kate',`Sign-ups up sixty per cent in a week. But the client's come back — they want the price on the page. Sales think it'll scare people off.`,
      [{label:'Ask Mike.',go:function(){ advance('revise_landing'); }}]);

  if(key==='mike'&&s==='revise_landing')
    return say('mike',`Hide a price and people don't stop wondering, they just guess — and they guess high. An objection you refuse to name gets imagined as worse than it is. Put it up, next to what it replaces.`,
      [{label:'"£9 a month. Less than one late invoice."',go:function(){
        /* the revision replaces the filed page; it is not a second piece of work */
        G.portfolio[G.portfolio.length-1]={title:'Landing page',client:'Loomwork',
          line:'Start free \u2014 no card, cancel anytime. \u00a39 a month, less than one late invoice.'};
        paintHUD();
        advance('deliver_landing_v2','mike',`That's it. You've answered the objection and reframed the number in the same breath. Take it back.`);
      }}]);

  if(key==='kate'&&s==='deliver_landing_v2')
    return say('kate',`Conversion held. Told you. Last one, and it's the big one — Harbour & Wren, homeware, new range. Teaser and launch, three weeks apart. And you're presenting it, not emailing it.`,
      [{label:'Presenting?',go:function(){
        say('kate',`Meeting room, me and Mike. Work you can't defend out loud isn't finished. Build it with him first.`,
          [{label:'Right.',go:function(){ advance('brief_integrated'); }}]);
      }}]);

  /* ---------- 6. integrated + crisis ---------- */
  if(key==='mike'&&s==='brief_integrated')
    return say('mike',`Teaser and launch. The teaser can't explain — it only has to make the launch land. Which means they have to sound like the same brand, or you've spent the client's money twice on two different companies.`,
      [{label:'Show me.',go:function(){ G.step='craft_integrated'; paintHUD(); craftIntegrated(); }}]);
  if(key==='mike'&&s==='craft_integrated') return craftIntegrated();

  if(key==='kate'&&s==='present_integrated')
    return say('kate',`Right — you're up. Off you go.`,
      [{label:'Present the campaign.',go:function(){
        say('kate',`"Made slowly, on purpose." ... "The slow ones last." Teaser and launch in the same voice, three weeks apart. That's exactly —`,
          [{label:'(her phone goes)',go:function(){
            G.step='crisis_call'; paintHUD();
            say('kate',`That's the client. Their factory is partly automated — legal won't let them say handmade. Every line you've just presented is dead. They still want the range live on Thursday.`,
              [{label:'How long have I got?',go:function(){
                startClock(90);
                say('kate',`Ninety seconds before I have to call them back with something. Mike's gone up to Creative for the whiteboard. Go.`,
                  [{label:'Going.',go:function(){ G.step='negotiate_time'; paintHUD(); closeDlg(); }},
                   {label:'Can you buy me longer?',go:function(){
                     G.bought=true; addClock(60);
                     say('kate',`...I can tell them we're pressure-testing the claim. Sixty more seconds, that's it. Asking was the right call — writers who don't ask hand me something thin and blame the clock. Now go.`,
                       [{label:'Going.',go:function(){ G.step='negotiate_time'; paintHUD(); closeDlg(); }}]);
                   }}]);
              }}]);
          }}]);
      }}]);

  if(key==='kate'&&s==='negotiate_time'&&!G.bought)
    return say('kate',`Mike. Creative. Now.`,[{label:'Going.',go:closeDlg}]);

  if(key==='mike'&&(s==='negotiate_time'||s==='crisis_rewrite')){
    G.step='crisis_rewrite'; paintHUD();
    return craftCrisis();
  }

  if(key==='kate'&&s==='deliver_integrated'){
    stopClock();
    return say('kate',`"Made in small runs, by people who are named on the box." It's the true claim that was underneath the false one — and it keeps the rhythm of the teaser, so nothing else has to change. Calling them now.`,
      [{label:'And?',go:function(){
        say('kate',`Approved. On Thursday, as booked.`,
          [{label:'...',go:function(){
            say('kate',`That's the job, by the way. Not the tagline — that. A claim dies at four in the afternoon and you find the true thing underneath it before anyone panics. Six pieces in your portfolio and one crisis you didn't flinch at. You're a copywriter now.`,
              [{label:'Thank you.',go:function(){ G.step='complete'; paintHUD(); closeDlg(); openCertificate(); }}]);
          }}]);
      }}]);
  }

  /* ---------- Alex: hints on request ---------- */
  if(key==='alex'){
    const h={
      first_brief:`Kate, in Servicing — left out of here. That's where work comes from.`,
      brief_tagline:`Specific beats clever. If it could belong to any other swim school, it isn't a tagline.`,
      craft_tagline:`They told you the barrier is embarrassment. Answer that, not the timetable.`,
      deliver_tagline:`Kate's in Servicing. She'll want to see it before it goes anywhere.`,
      brief_email:`Subject line earns the open, first line earns the scroll. Don't waste either saying hello.`,
      craft_email:`A problem the reader can check on the way to the window beats a discount every time.`,
      mandatories_email:`Dan first. He's saved me twice and I've only been here six months.`,
      brief_poster:`Three seconds from across a room. Headline, one supporting line, the practical stuff.`,
      craft_poster:`If it takes a paragraph it's a website, not a poster.`,
      production_poster:`Jenny in the studio. Better she kills it than the client does.`,
      brief_radio:`Nobody writes down a URL at sixty miles an hour. Carry the name.`,
      craft_radio:`Say it out loud. If you can't get it out in one breath, neither can the voice artist.`,
      timing_radio:`Jenny times it. Seventy-five words is the ceiling for thirty seconds.`,
      brief_landing:`They read the whole page and left. The problem is the last inch, not the first.`,
      craft_landing:`Name the action, then kill the two things stopping the click.`,
      revise_landing:`Ask Mike about the price. Hiding it never works — people guess, and they guess high.`,
      brief_integrated:`Teaser and launch have to sound like the same brand. Different beats, one voice.`,
      craft_integrated:`If you can swap the two lines between two different brands, you haven't got a campaign.`,
      present_integrated:`Meeting room, down the stairs. Present it — don't just read the deck out.`,
      negotiate_time:`Mike's at the whiteboard. And if you haven't asked Kate for more time, ask. It's not weakness.`,
      crisis_rewrite:`The true claim is underneath the false one. Find what's actually still true and say that.`,
      deliver_integrated:`Back to the meeting room. She's waiting.`,
      complete:`Six pieces and a crisis. Took me a year to get there. Drink?`
    };
    return say('alex', h[s] || `Working on something? Tell me what Kate asked for and I'll tell you what she actually wants.`);
  }

  /* ---------- everyone else, off-script ---------- */
  const idle={
    kate:`Nothing new from me yet. Finish what you've got.`,
    mike:`Not now — come back when you've got something to show me.`,
    jenny:`Bring it down when it's ready and I'll tell you if it can be made.`,
    dan:`Kettle's just boiled. Mugs are in the cupboard on the left, not the one you're looking at.`
  };
  say(key, idle[key] || `...`);
}


/* ---- the six choice sets ------------------------------------------------ */
function craftTagline(){
  choose('mike',`Three on the board. Which one is doing the job the brief asked for?`,[
    {label:`"Expert instruction, every stroke of the way."`,ok:false,
     note:`No. Well built, means nothing. That's the school's credentials, and every competitor is already saying it. Again.`},
    {label:`"Nobody's watching. Everybody started here."`,ok:true},
    {label:`"Learn to swim at any age."`,ok:false,
     note:`True, clear, completely inert. The brief handed you an emotional barrier and you answered it with a fact. Again.`}
  ],function(){
    filed('Tagline','Tidewater Swim School',`Nobody's watching. Everybody started here.`);
    advance('deliver_tagline','mike',`That's the one. It names the thing they're frightened of and takes it away in the same breath, and the second sentence pays off the first. Take it to Kate.`);
  });
}

function craftEmail(){
  choose('mike',`Subject line and opening line together. Pick the pair.`,[
    {label:`"Ferngate Spring Newsletter" / "Welcome to our April newsletter!"`,ok:false,
     note:`That's the client's. It describes the email instead of giving a reason to open it, then spends the first line saying hello. Again.`},
    {label:`"Your garden is three weeks behind" / "Everything you plant this fortnight still catches up. After that, it doesn't."`,ok:true},
    {label:`"HUGE Spring Savings Inside!" / "Don't miss out on our biggest sale of the year!"`,ok:false,
     note:`Earns an open from people who'd have bought anyway and teaches everyone else to ignore you. Urgency you haven't earned is just volume. Again.`}
  ],function(){
    filed('Email','Ferngate Garden Centre',`Subject: Your garden is three weeks behind`);
    advance('mandatories_email','mike',`Yes. A specific problem they can check by looking out of the window, and the first line pays it off with a deadline the product happens to solve. Take it past Dan before it sends.`);
  });
}

function craftPoster(){
  choose('mike',`Six-sheet. Three metres. Which one survives?`,[
    {label:`One sentence: "Northlight returns for its ninth year with forty films from emerging directors..."`,ok:false,
     note:`Everything true, nothing readable. That's a paragraph pretending to be a poster. Again.`},
    {label:`"Forty directors you haven't heard of yet." / "Northlight Film Festival, 3–11 October." / "northlight.co.uk"`,ok:true},
    {label:`"Cinema. Reimagined." / "Northlight Film Festival."`,ok:false,
     note:`Two words of atmosphere, no reason to go, no dates, and a claim the festival hasn't earned. Again.`}
  ],function(){
    filed('Poster','Northlight Film Festival',`Forty directors you haven't heard of yet.`);
    advance('production_poster','mike',`Good. It turns "unknown" into "early", which is the whole festival in four words, and the other two lines do the work nobody thanks you for. Jenny sees it before Kate does.`);
  });
}

function craftRadio(){
  choose('mike',`Thirty seconds, drivetime. Which script?`,[
    {label:`Open on the website address, then the stockist list.`,ok:false,
     note:`Nobody writes down a URL at sixty miles an hour. You've spent your one thing on something they can't use. Again.`},
    {label:`Build on one sound — the press, the pour — name said three times, one line on the orchard.`,ok:true},
    {label:`A long, writerly opening about Somerset summers.`,ok:false,
     note:`Beautiful on the page, unintelligible at speed. Say it out loud before you hand it to anyone. Again.`}
  ],function(){
    filed('Radio 30s','Ambercroft Cider',`The press, the pour, the name — three times.`);
    advance('timing_radio','mike',`Right. Sound does the work the picture would, and repetition is how a name survives a medium nobody is looking at. Jenny times it.`);
  });
}

function craftLanding(){
  choose('mike',`Bottom of the page. What goes in the button and under it?`,[
    {label:`"Learn more"`,ok:false,
     note:`A full stop pretending to be a door. They've already learned more — that's why they're at the bottom. Again.`},
    {label:`"Start free — no card, cancel anytime." / "Your first invoice takes four minutes."`,ok:true},
    {label:`"Sign up today and transform your freelance business!"`,ok:false,
     note:`Asks for commitment, promises something it can't evidence, and puts an exclamation mark where a reason should be. Again.`}
  ],function(){
    filed('Landing page','Loomwork',`Start free — no card, cancel anytime.`);
    advance('deliver_landing','mike',`That's it. Names the action, kills the two objections that stop the click, and sets an expectation small enough to act on. Kate.`);
  });
}

function craftIntegrated(){
  choose('mike',`Teaser three weeks out, launch on the day. Which pair?`,[
    {label:`"Something is coming." → "The new Harbour & Wren range. Shop now."`,ok:false,
     note:`The teaser could belong to a car brand and the launch could belong to anyone. Two halves of nothing. Again.`},
    {label:`"Made slowly, on purpose." → "The slow ones last."`,ok:true},
    {label:`"Unveiling craftsmanship." → "Beautifully made pieces for the modern home."`,ok:false,
     note:`Both perfectly decent, and they don't sound like the same company. Say them back to back — different writer, different brand. Again.`}
  ],function(){
    filed('Integrated campaign','Harbour & Wren',`Made slowly, on purpose. → The slow ones last.`);
    advance('present_integrated','mike',`Yes. Same vocabulary, same rhythm, and the launch finishes the sentence the teaser started. Meeting room — and present it, don't read it.`);
  });
}

function craftCrisis(){
  choose('mike',`Handmade is gone. Ninety seconds. What's actually still true?`,[
    {label:`Drop the claim, lead on the design instead.`,ok:false,
     note:`Then the teaser doesn't lead anywhere and we've lost the campaign to save the line. Again — what's underneath it?`},
    {label:`"Made in small runs, by people who are named on the box."`,ok:true},
    {label:`"Crafted with care in Britain."`,ok:false,
     note:`Care isn't a claim, it's a mood, and legal will ask you to prove that one too. Again.`}
  ],function(){
    G.portfolio[G.portfolio.length-1]={title:'Integrated campaign (revised)',client:'Harbour & Wren',
      line:`Made in small runs, by people who are named on the box.`};
    advance('deliver_integrated','mike',`That's the one. Small runs is verifiable, named on the box is verifiable, and it keeps the teaser's rhythm so nothing else has to move. RUN.`);
  });
}


TRACK_DEFS.copywriting={
    id:'copywriting', name:'Copywriting', live:true,
    title:'Copywriter Chronicles',
    blurb:'Six briefs, one crisis, and a client who changes their mind at four in the afternoon.',
    first:'first_brief',
    roles:{mike:'Creative Director', kate:'Project Manager', jenny:'Production',
           alex:'Copywriter', dan:'Studio & everything else', player:'The new writer'},
    script:function(key){ return copywritingScript(key); },
    occupants:function(room){ return copywritingOccupants(room); },
    objectives:OBJ_COPYWRITING,
    opening:{text:`Nine in the morning, and nobody is on reception. The agency is through the doors: Servicing to your right, everything else beyond it. Kate runs the projects and Kate has your first brief.`,
             label:'Go and find her.'},
    certTitle:'COPYWRITER CHRONICLES',
    timeUp:{who:'kate',line:`Time. I have had to call them and say we are still working on it — the one sentence a client never forgets. Go and finish it anyway. We do not stop because the clock did.`},
    certBody:['completed a full day at the agency — six briefs across tagline, email, poster,',
              'radio, landing page and integrated campaign, and one crisis rewrite',
              'delivered against the clock.'],
    lessons:[
      {t:'Taglines', c:'Tidewater Swim School',
       l:'Answer the barrier, not the surface of the brief. If a line could belong to any competitor, it is not a tagline.'},
      {t:'Email', c:'Ferngate Garden Centre',
       l:'The subject line earns the open, the first line earns the scroll. A problem the reader can check beats a discount.'},
      {t:'Posters', c:'Northlight Film Festival',
       l:'Hierarchy, not paragraphs. One line stops them, one explains, one tells them what to do.'},
      {t:'Writing to fit', c:'Northlight Film Festival',
       l:'Copy that cannot be set gets rewritten by someone who is not you. Word count is a creative constraint, not an admin one.'},
      {t:'Radio', c:'Ambercroft Cider',
       l:'Write for the ear. One thing carried, repeated. If you cannot say it in one breath, neither can the voice artist.'},
      {t:'Calls to action', c:'Loomwork',
       l:'A call to action is an instruction, not a full stop. Name the action, then kill the two objections that stop the click.'},
      {t:'Objections', c:'Loomwork',
       l:'An objection you hide gets imagined as worse than it is. Price included.'},
      {t:'Integrated work', c:'Harbour & Wren',
       l:'Teaser and launch have to sound like the same brand. One voice, different beats.'},
      {t:'Under pressure', c:'Harbour & Wren',
       l:'When a claim dies, find the true claim underneath it. And ask for time — writers who do not ask hand over something thin and blame the clock.'}
    ]
  };


