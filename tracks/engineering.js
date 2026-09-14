/* Track: Engineering Chronicles
   A track owns its people, its objectives, its step machine and its lessons.
   `TRACK_CONFIG` below overrides engine/defaults.js and the world for THIS GAME
   ONLY — the place to change one game without touching the other eight. */
window.TRACK_CONFIG={
  menuLede:"A day on a product team, and the ticket that turns out not to be about speed."
};

const CAST={
 mike:{name:'Ravi', role:'Tech Lead', where:'Engineering',
   accent:'#fbbf24', top:'#c9852f', topDk:'#a06a22', style:'overshirt', tee:'#f2ece0',
   legs:'#33405c', legsDk:'#26314a', shoe:'#e8e2d6',
   skin:'#c98a56', skinDk:'#a26c3f', hair:'#5a5148', hairHi:'#7d7266', cut:'curls',
   specs:true, prop:'notebook', build:1.04, bw:23, beard:true},
 kate:{name:'Nadia', role:'Engineering Manager', where:'Product',
   accent:'#f472b6', top:'#6d4a63', topDk:'#523849', style:'blazer', tee:'#f2ece0',
   legs:'#2c2a26', legsDk:'#1f1e1b', shoe:'#33302b',
   skin:'#e8b98c', skinDk:'#c2955f', hair:'#2b1f18', hairHi:'#463228', cut:'long',
   specs:false, prop:'tablet', build:1.0, bw:20, beard:false},
 jenny:{name:'Jen', role:'Platform / SRE', where:'Ops',
   accent:'#34d399', top:'#2f7d78', topDk:'#215b57', style:'hoodie', tee:'#2f7d78',
   legs:'#5e6a4f', legsDk:'#48523c', shoe:'#e08265',
   skin:'#8d5f38', skinDk:'#6d4626', hair:'#1e1710', hairHi:'#3a2c1e', cut:'puff',
   specs:false, prop:'camera', build:0.98, bw:22, beard:false},
 alex:{name:'Sam', role:'Senior Engineer', where:'Engineering',
   accent:'#38bdf8', top:'#e08265', topDk:'#b8624a', style:'knit', tee:'#e08265',
   legs:'#a8a49c', legsDk:'#8d8981', shoe:'#33302b',
   skin:'#f0c8a0', skinDk:'#cfa079', hair:'#3a2a1c', hairHi:'#5a4430', cut:'undercut',
   specs:true, prop:'coffee', build:0.96, bw:19, beard:false},
 dan:{name:'Theo', role:'QA & Releases', where:'Kitchen',
   accent:'#a78bfa', top:'#7d9070', topDk:'#5f6f54', style:'tee', tee:'#7d9070',
   legs:'#3f4a5c', legsDk:'#2f3747', shoe:'#f2ece0',
   skin:'#a0673a', skinDk:'#7d4c28', hair:'#22201d', hairHi:'#3a352d', cut:'beanie',
   specs:false, prop:'mug', build:1.02, bw:21, beard:true},
 player:{name:'You', role:'The new engineer', where:'Reception',
   accent:'#e4ded2', top:'#4a6a86', topDk:'#3a5468', style:'overshirt', tee:'#f2ece0',
   legs:'#33405c', legsDk:'#26314a', shoe:'#e8e2d6',
   skin:'#c08a5e', skinDk:'#9c6c45', hair:'#241c16', hairHi:'#3c2f24', cut:'short',
   specs:false, prop:null, build:1.0, bw:20, beard:false}
};
/* ==========================================================================
   DESIGN FUNDAMENTALS TRACK — content only
   ========================================================================== */

CAST.owen={name:'Rachel', role:'Head of Customer Support', where:'War Room',
   accent:'#38bdf8', top:'#3f4a5c', topDk:'#2f3747', style:'blazer', tee:'#e6edf3',
   legs:'#2c2a26', legsDk:'#1f1e1b', shoe:'#33302b',
   skin:'#f0c8a0', skinDk:'#cfa079', hair:'#3a2a1c', hairHi:'#5a4430', cut:'long',
   specs:true, prop:'tablet', build:1.0, bw:20, beard:false};

const OBJ_ENG={
  ticket_brief:'Get the ticket from Nadia in Product',
  requirements:'Ravi is on the Engineering floor — read the ticket with him first',
  code_review:'Ravi again. There is a pull request waiting on you',
  testing:'Theo is in the Kitchen with the CI dashboard open',
  tech_debt:'Back to Ravi — the bookings module is in the way',
  shipping:'Jen in Ops. It has to go out without breaking anything',
  incident:'Ops. Now. Something is on fire',
  stakeholder:'Rachel is waiting in the War Room',
  crisis_fix:'Ops. Jen. Quickly',
  crisis_show:'Back to Rachel in the War Room',
  complete:'You are an engineer now'
};

function engOccupants(room){
  const s=G.step;
  const withRachel=['stakeholder','crisis_fix','crisis_show'].indexOf(s)>=0;
  if(room==='lobby')     return [];
  if(room==='servicing') return [['kate',400,306,'down']];
  if(room==='creative')  return [['mike',260,258,'right'],['alex',560,268,'left']];
  if(room==='studio')    return [['jenny',400,196,'down']];
  if(room==='breakroom') return [['dan',650,268,'down']];
  if(room==='meeting')   return withRachel?[['owen',400,196,'down']]:[];
  return [];
}

function engScript(key){
  const s=G.step;

  /* ---------- the ticket ---------- */
  if(key==='kate'&&s==='ticket_brief')
    return say('kate',`Nadia, engineering manager. Meridian does scheduling for people who run appointments — clinics, studios, garages. You're on the bookings squad from today and there's a ticket with your name on it. MER-2291: add CSV export to the bookings list. Support have asked for it eleven times this quarter.`,
      [{label:'Sounds like an afternoon.',go:function(){
        say('kate',`Everyone says that. Ravi's on the floor and he has opinions about tickets that sound like an afternoon. Go and read it with him before you open an editor.`,
          [{label:'On my way.',go:function(){ advance('requirements'); }}]);
      }}]);

  /* ---------- 1. the problem behind the ticket ---------- */
  if(key==='mike'&&s==='requirements'){
    return choose('mike',
      `Ravi. Tech lead, which mostly means I read things twice. Your ticket is one line: "Add CSV export to the bookings list." That's not a spec, it's a wish. What do you do with it?`,
      [
       {label:`Start building. It's a small ticket — the details will surface as I write it.`,ok:false,
        note:`They will surface. On Thursday, in production, in front of a clinic with two hundred thousand bookings. Again.`},
       {label:`Find out who asked for it, what they do with the file after they download it, and what the biggest account's data actually looks like.`,ok:true},
       {label:`Send it back to Nadia and ask for a proper spec before I touch it.`,ok:false,
        note:`Nadia doesn't know either — she wrote down what support told her. The people with the answer are the eleven customers who asked. Go and be the one who finds out. Again.`}
      ],function(){
        filed('Ticket, opened properly','Meridian','Who asked, what they do with the file, and how big the biggest account is');
        advance('code_review','mike',`Right. A ticket is a symptom somebody wrote down. Support says three of them re-upload the file into their accounting tool, and our biggest account has 214,000 bookings — which changes the whole shape of the job. Now, Sam's put up a PR on the same module and it's been sitting two days. Have a look.`);
      });
  }

  /* ---------- 2. code review ---------- */
  if(key==='mike'&&s==='code_review'){
    return choose('mike',
      `Four hundred lines. It works. It also loads bookings in a loop so a hundred rows is a hundred and one queries, it pulls the whole result set into memory with no limit, and it calls a variable "data2". Sam is waiting and the sprint ends Friday. What goes in the review?`,
      [
       {label:`Approve it. It works, the team is blocked, and we can tidy it afterwards.`,ok:false,
        note:`"Afterwards" is a place nothing has ever come back from. One of those three things takes the site down at scale. Again.`},
       {label:`Leave all fourteen comments at the same weight and let Sam work out which ones matter.`,ok:false,
        note:`Fourteen equal comments is not a review, it's weather. The one that matters is now buried between a naming quibble and a missing full stop. Again.`},
       {label:`Block on the N+1 and the unbounded load, say plainly why each one breaks at 200k rows, and mark the naming as a non-blocking nit.`,ok:true}
      ],function(){
        filed('Code review','Meridian','Two blocking issues named with their consequence, the rest marked optional');
        advance('testing','mike',`That's a review. Say which comments are blocking and which are preference, and give the reason rather than the instruction — "this is 101 queries at 100 rows" is something Sam can argue with. "I'd do it differently" isn't. Theo's in the kitchen glaring at CI.`);
      });
  }

  /* ---------- 3. tests ---------- */
  if(key==='dan'&&s==='testing'){
    return choose('dan',
      `Theo. QA, releases, and the person who notices. Two things. Your new test asserts that exportRows calls formatRow exactly 214 times. And there's a test on this module that fails about one run in six, and the team's habit is to hit rerun until it's green. Go on.`,
      [
       {label:`Add an automatic retry to the flaky one so CI stops blocking, and keep my test as it is.`,ok:false,
        note:`You've taught the build to lie. That test fails one in six because something in it is genuinely racy, and now nobody will ever see it again — until it's a customer seeing it. Again.`},
       {label:`Test what the user gets — the file contents for a normal account, an empty one, and a customer called "Okafor, Jr." with a comma in the name — and treat the flaky test as a bug to fix or delete, not rerun.`,ok:true},
       {label:`Delete the flaky test, it's noise, and leave my call-count assertion so we know the loop runs.`,ok:false,
        note:`Half right and half worse. Deleting it without looking throws away the only evidence of a real race, and your assertion still breaks the moment anyone refactors the loop, without a single thing being wrong. Again.`}
      ],function(){
        filed('Test suite','Meridian','Behaviour tested at the edges, flaky test raised as a defect rather than retried');
        advance('tech_debt','dan',`Good. A test that knows how the code works breaks when the code changes and passes when the behaviour breaks — exactly backwards. And a flaky test is a bug report nobody has read yet. Ravi wants you back; the module's in your way.`);
      });
  }

  /* ---------- 4. tech debt ---------- */
  if(key==='mike'&&s==='tech_debt'){
    return choose('mike',
      `Here's your problem. The bookings query you need lives in the middle of a two-thousand-line file called bookings_service.rb that four people have sworn at this month. You need one method out of it. What's the move?`,
      [
       {label:`Rewrite the module properly first. It's the root cause and it'll pay for itself.`,ok:false,
        note:`A two-week rewrite of a file you've known for a day, to ship a one-line ticket. You'd be changing everything at once with no tests to tell you when you broke it. Again.`},
       {label:`Leave it alone entirely and copy the query into my new file so I don't have to touch it.`,ok:false,
        note:`Now the same logic exists twice and only one copy gets the fix next time. You've made the module worse by refusing to open it. Again.`},
       {label:`Carve out just the seam I need, put tests around that one method, leave the rest untouched, and open a ticket for the remainder with the cost written down in hours.`,ok:true}
      ],function(){
        filed('Refactor','Meridian','One seam extracted and tested, remainder ticketed with a cost attached');
        advance('shipping','mike',`That's how debt actually gets repaid — where you're already standing, in the path of the work, in pieces small enough to review. And a ticket that says "this costs us two days a quarter" gets prioritised; one that says "this is messy" never does. Jen's in Ops. It has to go out.`);
      });
  }

  /* ---------- 5. shipping ---------- */
  if(key==='jenny'&&s==='shipping'){
    return choose('jenny',
      `Jen, platform. Your export needs a new column on a table with forty million rows, a background job, and an endpoint. It's Thursday afternoon. How does this reach production?`,
      [
       {label:`One deploy — migration, backfill and code together. It's atomic that way, and the change is small.`,ok:false,
        note:`Atomic until it isn't. Between the migration landing and the new code running, old processes hit a table shape they've never seen, and your rollback now has to un-migrate forty million rows. Again.`},
       {label:`Add the column first and deploy code that works with the old shape and the new, backfill in batches, then switch reads over — with the endpoint behind a flag, off, then on for us, then five per cent.`,ok:true},
       {label:`Put the endpoint behind a flag, but ship the migration and the backfill in the same deploy to save a round trip.`,ok:false,
        note:`The flag protects the feature and the migration is the thing that can't be undone. You've put a seatbelt on the passenger and taken the brakes off. Again.`}
      ],function(){
        filed('Release plan','Meridian','Expand, backfill, contract — behind a flag, rolled out in stages');
        advance('incident','jenny',`Correct. Deploying and releasing are two different events and you want them on different days if you can. Additive migrations first, code that tolerates both shapes, destructive change last and only once nothing reads the old one. Right — it's live at five per cent. Go for lunch.`);
      });
  }

  /* ---------- 6. the incident ---------- */
  if(key==='jenny'&&s==='incident'){
    return choose('jenny',
      `Eleven forty. Error rate on the bookings API just went from nought point one per cent to six. p95 latency's tripled. Your rollout went to twenty-five per cent nine minutes ago. Support have two tickets already. What do you do, right now, first?`,
      [
       {label:`Pull the logs and traces and find the root cause — I don't want to flip things off blindly.`,ok:false,
        note:`Admirable, and every minute of it is customers failing to book. Understanding is not the emergency; the bleeding is. Again.`},
       {label:`Turn the flag off, watch the error rate come back down to confirm it was us, then investigate with production out of danger.`,ok:true},
       {label:`I think I know what it is — push a fix straight to prod and watch it.`,ok:false,
        note:`You think. Under pressure, untested, into an already-degraded system, while the thing that would make it stop is one toggle away. Again.`}
      ],function(){
        filed('Incident response','Meridian','Mitigated first — flag off, recovery confirmed, then diagnosis');
        advance('stakeholder','jenny',`Flag's off, errors are back to baseline in ninety seconds, and now we can be curious instead of frightened. It was the unbounded query on one enormous account, which is the thing Ravi made you look for on day one. Mitigate, then diagnose — and rolling back isn't a failure, it's the feature working. Rachel wants you in the war room, by the way. Support's escalated something.`);
      });
  }

  /* ---------- 7. the stakeholder, and what they actually mean ---------- */
  if(key==='owen'&&s==='stakeholder'){
    return choose('owen',
      `Rachel, head of support. Thanks for coming up. The export is brilliant, honestly — but can you just make it faster? Forty seconds is too long. My team have started calling it the kettle button.`,
      [
       {label:`"Of course. I'll optimise the query — I can probably get it to eight seconds."`,ok:false,
        note:`(You've committed two days to a number she never asked for. She didn't say the query was slow. She said forty seconds is too long — which is a sentence about waiting, not about queries. Again.)`},
       {label:`"Before I touch the speed — what are your team doing during those forty seconds, and what happens to the file once it lands?"`,ok:true},
       {label:`"Forty seconds is actually about right for two hundred thousand rows. It's a big export."`,ok:false,
        note:`I'm sure it is. I'll tell the team to keep waiting, then.  (Correct, and useless. Again.)`}
      ],function(){
        say('owen',`Sitting there. Watching a spinner, because if they navigate away it cancels. And every Monday at eight one of them runs it for forty accounts in a row, so that's half an hour of a person doing nothing. Then they attach the file to an email and send it on. It's not that it's slow, really. It's that they have to babysit it.`,
          [{label:'Then speed was never the fix.',go:function(){
            filed('Requirement, translated','Meridian','The problem was attended waiting, not query time');
            startClock(90);
            say('kate',`Which is a good catch and a terrible time for one, because the release freeze starts in ninety seconds and support's Monday run is Monday. After the freeze it's a fortnight. Jen's in Ops. Go.`,
              [{label:'Go.',go:function(){ G.step='crisis_fix'; paintHUD(); closeDlg(); }}]);
          }}]);
      });
  }

  if(key==='jenny'&&s==='crisis_fix'){
    return choose('jenny',`Talk fast. What am I shipping?`,[
      {label:`Optimise the query. Get it down to eight seconds and they'll stop complaining.`,ok:false,
       note:`Eight seconds of a person watching a spinner, forty times on a Monday morning. You'd be shipping the thing she just told you she didn't ask for. Again — faster.`},
      {label:`Return straight away, hand it to the job queue we already have, email the link when it's done — flag on for support only, nobody else affected.`,ok:true},
      {label:`Raise the request timeout to a hundred and twenty seconds so it stops dropping on the big accounts.`,ok:false,
       note:`That's not a fix, that's permission to wait longer. Again.`}
    ],function(){
      advance('crisis_show','jenny',`Queued, flagged, merged, and it went in with eleven seconds on the freeze. Small change, existing infrastructure, nothing new to run at three in the morning. Go and show her before she books the two-day optimisation.`);
    });
  }

  if(key==='owen'&&s==='crisis_show'){
    stopClock();
    return say('owen',`Oh — it just emails it? So they can start the next one straight away.`,
      [{label:'Forty at once, if you want.',go:function(){
        say('owen',`It's still forty seconds, isn't it. And I don't care at all.`,
          [{label:'...',go:function(){
            say('kate',`That's the job. Not the migration, not the flag — that. Someone brings you a solution dressed as a complaint, and your first instinct was to ask what they were actually doing all that time. Six pieces of work, one incident you didn't make worse, and a freeze you didn't miss. You're an engineer now.`,
              [{label:'Thank you.',go:function(){ G.step='complete'; paintHUD(); closeDlg(); openCertificate(); }}]);
          }}]);
      }}]);
  }

  /* ---------- Sam: hints ---------- */
  if(key==='alex'){
    const h={
      ticket_brief:`Nadia's in Product. Ask what the ticket is for, not what it says.`,
      requirements:`One line of ticket is somebody's summary of a conversation you weren't in. Go and find the conversation.`,
      code_review:`Some of my fourteen comments matter and some are taste. Say which is which — that's the whole skill.`,
      testing:`If the test knows how the code works, it'll break when you tidy it and pass when you break it.`,
      tech_debt:`Smallest seam that lets you finish. The rewrite you're imagining is three weeks and nobody has three weeks.`,
      shipping:`Additive first, destructive last, and the flag is not a substitute for either.`,
      incident:`Stop it happening, then find out why. In that order, every time.`,
      stakeholder:`"Make it faster" is never about the milliseconds. Find out what they're doing while they wait.`,
      crisis_fix:`Smallest change that answers the real complaint. Not the best version — the one that ships before the freeze.`,
      crisis_show:`Go and show her. She hasn't seen it yet.`,
      complete:`You got support to stop caring about a number. First time that's happened here. Pub?`
    };
    return say('alex', h[s] || `Stuck? Say out loud what breaks if you do nothing, and start there.`);
  }

  const idle={
    kate:`Nothing new from me — go and finish what you've got.`,
    mike:`Bring it back when you can tell me what happens at two hundred thousand rows.`,
    jenny:`Bring me something I can roll back and we'll get on fine.`,
    dan:`Kettle's on. Your build's still red, mind.`,
    owen:`I'll wait. My team are on the phones till five.`
  };
  say(key, idle[key] || `...`);
}

TRACK_DEFS.engineering={
  id:'engineering', name:'Software Engineering', title:'Engineering Chronicles',
  blurb:'A one-line ticket, a two-thousand-line file, and an incident at twenty to twelve.',
  first:'ticket_brief',
  roles:{mike:'Tech Lead', kate:'Engineering Manager', jenny:'Platform / SRE',
         alex:'Senior Engineer', dan:'QA & Releases',
         owen:'Head of Customer Support', player:'The new engineer'},
  script:function(key){ return engScript(key); },
  occupants:function(room){ return engOccupants(room); },
  objectives:OBJ_ENG,
  opening:{text:`Nine in the morning at Meridian. There is a ticket with one line on it, a pull request that has been open two days, and a release freeze at five o'clock that nobody has mentioned yet.`,
           label:'Find Nadia.'},
  certTitle:'ENGINEERING CHRONICLES',
  timeUp:{who:'kate',line:`Freeze. It goes out in a fortnight, which means support babysit that spinner for two more Mondays. Finish it anyway. Missing a freeze is survivable; not knowing what you would have shipped is not.`},
  certBody:['worked a ticket at Meridian from one vague line to production — review, tests,',
            'a refactor that stayed small, a staged release, and an incident mitigated in ninety',
            'seconds — then heard what a stakeholder meant instead of what they asked for.'],
  lessons:[
    {t:'A ticket is a symptom, not a spec', c:'The ticket',
     l:'One line is somebody\u2019s summary of a conversation you were not in. Find out who asked, what they do afterwards, and what the largest account looks like.'},
    {t:'Say which comments are blocking', c:'Code review',
     l:'Fourteen equal comments is weather, not review. Separate the thing that breaks production from the thing you would have named differently.'},
    {t:'Give the reason, not the instruction', c:'Code review',
     l:'"This is 101 queries at 100 rows" is something the author can argue with. "I\u2019d do it differently" is not.'},
    {t:'Test the behaviour, not the implementation', c:'Tests',
     l:'A test that asserts how the code works breaks when you tidy it and passes when you break it. Assert what the user gets, including the awkward cases.'},
    {t:'A flaky test is a bug report', c:'Tests',
     l:'Retrying until green teaches the build to lie. One failure in six is a race that a customer will find for you.'},
    {t:'Repay debt where you are standing', c:'Tech debt',
     l:'Extract the seam you need, test that, leave the rest. The three-week rewrite never gets scheduled and cannot be reviewed.'},
    {t:'Put a cost on the debt you leave', c:'Tech debt',
     l:'"This is messy" is never prioritised. "This costs us two days a quarter" is a number somebody can trade against.'},
    {t:'Deploying and releasing are different events', c:'Shipping',
     l:'Additive migration first, code that tolerates both shapes, destructive change last. The flag protects the feature; nothing protects an un-runnable rollback.'},
    {t:'Mitigate first, diagnose second', c:'Incidents',
     l:'Understanding is not the emergency. Turn it off, confirm recovery, then be curious. Rolling back is the feature working.'},
    {t:'"Make it faster" is never about milliseconds', c:'Stakeholders',
     l:'Ask what they are doing while they wait. Forty seconds you can walk away from is not the same forty seconds.'}
  ]
};


