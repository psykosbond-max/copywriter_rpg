/* Track: Product Chronicles
   A track owns its people, its objectives, its step machine and its lessons.
   `TRACK_CONFIG` below overrides engine/defaults.js and the world for THIS GAME
   ONLY — the place to change one game without touching the other eight. */
window.TRACK_CONFIG={
  menuLede:"A day on a product team, and a date somebody else has already promised."
};

const CAST={
 mike:{name:'Ravi', role:'Tech Lead', where:'Engineering',
   accent:'#fbbf24', top:'#c9852f', topDk:'#a06a22', style:'overshirt', tee:'#f2ece0',
   legs:'#33405c', legsDk:'#26314a', shoe:'#e8e2d6',
   skin:'#c98a56', skinDk:'#a26c3f', hair:'#5a5148', hairHi:'#7d7266', cut:'curls',
   specs:true, prop:'notebook', build:1.04, bw:23, beard:true},
 kate:{name:'Nadia', role:'Head of Product', where:'Product',
   accent:'#f472b6', top:'#6d4a63', topDk:'#523849', style:'blazer', tee:'#f2ece0',
   legs:'#2c2a26', legsDk:'#1f1e1b', shoe:'#33302b',
   skin:'#e8b98c', skinDk:'#c2955f', hair:'#2b1f18', hairHi:'#463228', cut:'long',
   specs:false, prop:'tablet', build:1.0, bw:20, beard:false},
 jenny:{name:'Jen', role:'Engineering Manager', where:'Ops',
   accent:'#34d399', top:'#2f7d78', topDk:'#215b57', style:'hoodie', tee:'#2f7d78',
   legs:'#5e6a4f', legsDk:'#48523c', shoe:'#e08265',
   skin:'#8d5f38', skinDk:'#6d4626', hair:'#1e1710', hairHi:'#3a2c1e', cut:'puff',
   specs:false, prop:'camera', build:0.98, bw:22, beard:false},
 alex:{name:'Sam', role:'Senior PM', where:'Engineering',
   accent:'#38bdf8', top:'#e08265', topDk:'#b8624a', style:'knit', tee:'#e08265',
   legs:'#a8a49c', legsDk:'#8d8981', shoe:'#33302b',
   skin:'#f0c8a0', skinDk:'#cfa079', hair:'#3a2a1c', hairHi:'#5a4430', cut:'undercut',
   specs:true, prop:'coffee', build:0.96, bw:19, beard:false},
 dan:{name:'Theo', role:'Support Lead', where:'Kitchen',
   accent:'#a78bfa', top:'#7d9070', topDk:'#5f6f54', style:'tee', tee:'#7d9070',
   legs:'#3f4a5c', legsDk:'#2f3747', shoe:'#f2ece0',
   skin:'#a0673a', skinDk:'#7d4c28', hair:'#22201d', hairHi:'#3a352d', cut:'beanie',
   specs:false, prop:'mug', build:1.02, bw:21, beard:true},
 player:{name:'You', role:'The new product manager', where:'Reception',
   accent:'#e4ded2', top:'#4a6a86', topDk:'#3a5468', style:'overshirt', tee:'#f2ece0',
   legs:'#33405c', legsDk:'#26314a', shoe:'#e8e2d6',
   skin:'#c08a5e', skinDk:'#9c6c45', hair:'#241c16', hairHi:'#3c2f24', cut:'short',
   specs:false, prop:null, build:1.0, bw:20, beard:false}
};
/* ==========================================================================
   DESIGN FUNDAMENTALS TRACK — content only
   ========================================================================== */

CAST.owen={name:'Gareth', role:'Sales Director', where:'War Room',
   accent:'#38bdf8', top:'#3f4a5c', topDk:'#2f3747', style:'blazer', tee:'#e6edf3',
   legs:'#2c2a26', legsDk:'#1f1e1b', shoe:'#33302b',
   skin:'#f0c8a0', skinDk:'#cfa079', hair:'#4a4038', hairHi:'#6b5e52', cut:'short',
   specs:false, prop:'tablet', build:1.04, bw:22, beard:true};

const OBJ_PM={
  pm_brief:'Get the quarter from Nadia in Product',
  requests:'Theo in the Kitchen has the request log open',
  outcome:'Ravi is on the Engineering floor and he has read your roadmap',
  capacity:'Jen in Ops does the sums nobody wants to do',
  slicing:'Back to Ravi — nine weeks is not a plan',
  tradeoff:'Jen again. Two things, one slot',
  saying_no:'Ravi wants an answer about his pet feature',
  stakeholder:'Gareth is waiting in the War Room',
  crisis_fix:'Engineering. Ravi. Quickly',
  crisis_show:'Back to Gareth in the War Room',
  complete:'You are a product manager now'
};

function pmOccupants(room){
  const s=G.step;
  const withGareth=['stakeholder','crisis_fix','crisis_show'].indexOf(s)>=0;
  if(room==='lobby')     return [];
  if(room==='servicing') return [['kate',400,306,'down']];
  if(room==='creative')  return [['mike',260,258,'right'],['alex',560,268,'left']];
  if(room==='studio')    return [['jenny',400,196,'down']];
  if(room==='breakroom') return [['dan',650,268,'down']];
  if(room==='meeting')   return withGareth?[['owen',400,196,'down']]:[];
  return [];
}

function pmScript(key){
  const s=G.step;

  /* ---------- the quarter ---------- */
  if(key==='kate'&&s==='pm_brief')
    return say('kate',`Nadia, head of product. Forty-one open feature requests, two squads, one quarter. Sales have promised three things, support have escalated two, the CEO mentioned a dashboard in an all-hands and everyone heard it as a commitment. You own next quarter's roadmap and it goes out at five.`,
      [{label:'And who decides what goes in?',go:function(){
        say('kate',`You do, which is the part nobody warns you about. Not by having taste — by being able to show the reasoning when six people disagree with it. Theo's in the kitchen with the request log. Start with what's actually being asked, because the list you've been handed is wrong.`,
          [{label:'On my way.',go:function(){ advance('requests'); }}]);
      }}]);

  /* ---------- 1. what is actually being asked ---------- */
  if(key==='dan'&&s==='requests'){
    return choose('dan',
      `Theo, support. Your top request is the calendar sync — thirty-eight tickets. Second is bulk reschedule, at nine. That's the list everyone's been quoting at you all week.`,
      [
       {label:`Thirty-eight to nine is a clear signal — calendar sync goes first.`,ok:false,
        note:`Thirty-eight tickets, and I should tell you now, they're from four accounts. One of them raises a ticket every time it reoccurs. Again.`},
       {label:`Count distinct accounts rather than tickets, check what each one was trying to achieve, and look at which requests are workarounds for something already broken.`,ok:true},
       {label:`Requests are a biased sample of loud customers — ignore the log and prioritise from strategy.`,ok:false,
        note:`Biased, yes. Useless, no. You've just thrown away the only direct evidence you have because it isn't clean. Again.`}
      ],function(){
        filed('Demand analysis','Meridian Q3','Counted by account not ticket; six of nine bulk-reschedule requests were an onboarding bug');
        advance('outcome','dan',`There you are. Calendar sync is four accounts, one of them very energetic. And six of the nine bulk-reschedule ones were people fixing a mess our own onboarding import made — so that's a bug, not a feature. Ravi's read your roadmap, by the way. He has views.`);
      });
  }

  /* ---------- 2. outcomes, not features ---------- */
  if(key==='mike'&&s==='outcome'){
    return choose('mike',
      `Ravi, tech lead. Your roadmap is fourteen feature names with months next to them. "Calendar sync — July." What happens in August when we learn the sync isn't what people needed?`,
      [
       {label:`We amend the roadmap and communicate the change — plans change, everyone understands that.`,ok:false,
        note:`Everyone says that and nobody means it. You've published fourteen promises, so every change is now a broken one and you'll defend the list instead of the goal. Again.`},
       {label:`Write each item as the outcome it is meant to produce, with a number and a date on the outcome rather than the implementation, and let the squad choose the how.`,ok:true},
       {label:`Add engineering estimates to each feature so the dates are more credible.`,ok:false,
        note:`More precise promises about the wrong unit. A confident date on a feature nobody has validated is worse than a vague one. Again.`}
      ],function(){
        filed('Roadmap reframed','Meridian Q3','Outcomes with numbers, not fourteen feature names with months');
        advance('capacity','mike',`Better. "Cut onboarding drop-off from 38% to 25% by end of August" survives us learning something; "calendar sync — July" doesn't. It also tells my squad what to do when the obvious approach fails, which is most weeks. Jen's in Ops. She's done the arithmetic on your plan.`);
      });
  }

  /* ---------- 3. capacity ---------- */
  if(key==='jenny'&&s==='capacity'){
    return choose('jenny',
      `Jen, engineering manager. Your plan assumes two squads of four for thirteen weeks on new work. Reality: oncall takes one person a week out permanently, we carry about twenty per cent bug and support load, there's a fortnight of leave booked in August, and one of mine is on a hiring panel. What do you do with the plan?`,
      [
       {label:`Keep the fourteen items and reprioritise in-quarter as things slip — that way we aim high.`,ok:false,
        note:`Aiming high with someone else's hours. Everything ships at sixty per cent done, nothing gets finished, and in October we'll have fourteen half-features and no outcome. Again.`},
       {label:`Plan against realistic capacity — roughly sixty per cent of nominal — keep an explicit buffer for the unplanned, and say out loud which items are dropping as a result.`,ok:true},
       {label:`Ask the team to protect the roadmap work and push the support load to next quarter.`,ok:false,
        note:`The support load is customers with broken things. You can defer it into a bigger pile, not out of existence. Again.`}
      ],function(){
        filed('Capacity plan','Meridian Q3','Planned at realistic capacity with named drops and a buffer');
        advance('slicing','jenny',`Thank you. Six items, not fourteen, and you've written down which eight aren't happening — which is the difference between a plan and a wish list. The uncomfortable bit is telling people, and you've just volunteered. Ravi's got the big one to scope.`);
      });
  }

  /* ---------- 4. slicing ---------- */
  if(key==='mike'&&s==='slicing'){
    return choose('mike',
      `The integration piece. Nine weeks, three providers, two-way sync, OAuth for each one. That's the whole quarter for one squad and we learn nothing until week nine. Cut it.`,
      [
       {label:`Build the backend sync engine first, then the UI in the second half — the hard part gets de-risked early.`,ok:false,
        note:`Nine weeks of layers and nobody can use any of it until the last one lands. That's the same risk with a project plan stapled to it. Again.`},
       {label:`Ship one provider, one direction, and a manual connect step — end to end, in two weeks, to real accounts — then decide the rest from what happens.`,ok:true},
       {label:`Cut the third provider and the two-way sync, and ship the remaining scope in six weeks.`,ok:false,
        note:`Smaller, still six weeks before anyone touches it. Trimming scope is not the same as getting something in front of a customer. Again.`}
      ],function(){
        filed('Scope slice','Meridian Q3','One provider, one direction, manual auth — end to end in two weeks');
        advance('tradeoff','mike',`Yes. Thin and vertical, not thick and horizontal — a slice a real account can use tells you in a fortnight what nine weeks of design review can't. Jen's got your next problem: two things and one slot.`);
      });
  }

  /* ---------- 5. the trade-off ---------- */
  if(key==='jenny'&&s==='tradeoff'){
    return choose('jenny',
      `One slot left this quarter. Option A: the calendar sync — four accounts, one of them our loudest, about eleven thousand a year between them, asked for in every call. Option B: the onboarding import bug — hits thirty-eight per cent of new signups in their first week, we lose an estimated one in six of them, nobody has ever raised a ticket about it because they just leave.`,
      [
       {label:`A. The revenue is known and named, and the four accounts will churn if we keep saying no.`,ok:false,
        note:`Eleven thousand you can see against an unknown number of signups you can't, and you picked the one with a face attached. That's not a decision, it's the availability heuristic with a spreadsheet. Again.`},
       {label:`B — the onboarding bug affects far more people and costs us silently — and write down the size of both, what B is expected to move, and what the four accounts get instead.`,ok:true},
       {label:`Split the slot and do a reduced version of both.`,ok:false,
        note:`Two half things, neither finished, and now both sets of people are annoyed. The slot is one slot. Again.`}
      ],function(){
        filed('Prioritisation call','Meridian Q3','Onboarding bug over calendar sync, with both sizes and the reasoning written down');
        advance('saying_no','jenny',`Right. The people who leave never file a ticket, so a request log will always over-weight the customers you already have. Writing the reasoning down is the bit that saves you in October when someone asks why sync slipped. Speaking of which — Ravi wants an answer about his own idea.`);
      });
  }

  /* ---------- 6. saying no ---------- */
  if(key==='mike'&&s==='saying_no'){
    return choose('mike',
      `Right, mine. The plugin API. I've wanted it for a year, I think it's how we stop building integrations one at a time forever, and it's not on your six. What do you say to me?`,
      [
       {label:`"It's on the backlog — we'll look at it next quarter."`,ok:false,
        note:`So that's a no in a costume. I'll ask again in October, you'll say the same thing, and by January I'll have stopped bringing you ideas. Say the actual word. Again.`},
       {label:`"No, not this quarter — it lost to the onboarding bug because that's 38% of new signups. What would change it: evidence that integrations are the reason accounts don't convert, or a second customer asking for the API itself."`,ok:true},
       {label:`"Good idea, let's get it in" — and then let it slide down the list quietly.`,ok:false,
        note:`You've bought a fortnight of peace with your credibility. I'll find out, and then nothing you tell me about the roadmap will mean anything. Again.`}
      ],function(){
        filed('Roadmap decision','Meridian Q3','Plugin API declined with the reason, what it lost to, and what would change it');
        advance('stakeholder','mike',`That I can work with. "No, because X, and here's what would change my mind" is a decision — "it's on the backlog" is a filing cabinet where ideas go to die and everyone knows it. Gareth's in the war room, and he's brought a contract.`);
      });
  }

  /* ---------- 7. the commitment ---------- */
  if(key==='owen'&&s==='stakeholder'){
    return choose('owen',
      `Gareth, sales. Northfield Health. Hundred and eighty thousand, three-year term, signature ready — conditional on single sign-on being live by March. Their security questionnaire has it as a hard requirement. I need it on the roadmap with that date and I need it today.`,
      [
       {label:`"For a hundred and eighty thousand? Put it down for March, I'll make it work."`,ok:false,
        note:`(You've committed nine weeks of a squad you already spent, to a date you invented, for a requirement you haven't read. In March you'll break it, and it will be your name on the slip. Again.)`},
       {label:`"Before I commit a date — can I speak to their IT lead about what specifically blocks sign-off? And has this come up in other enterprise deals, or just this one?"`,ok:true},
       {label:`"We can't commit to that. The quarter's planned and SSO is a nine-week build."`,ok:false,
        note:`Then I lose the deal and you own that too. You haven't found out whether they need SSO or something SSO happens to include. Again.`}
      ],function(){
        say('owen',`...Fine. I'll get you their IT lead. And it's come up in nine of the last twelve enterprise conversations, if that helps.`,
          [{label:'That changes what it is.',go:function(){
            say('owen',`How so? It's still one deal in front of me.`,
              [{label:'Nine of twelve is a pattern, not a favour.',go:function(){
                say('owen',`Right — I've had their IT lead on the phone. She says the blocker isn't the login at all. It's leavers. When a nurse leaves they need the account deactivated centrally within a day and they can't prove that today. SSO was just how their template asks for it.`,
                  [{label:'That is not nine weeks of work.',go:function(){
                    filed('Requirement translated','Meridian Q3','SSO request was central offboarding; and it is a pattern across nine of twelve deals');
                    startClock(90);
                    say('kate',`It's about two weeks, and the roadmap publishes in ninety seconds — after which Gareth sends the addendum with whatever we've written in it. Ravi's on the floor. Go.`,
                      [{label:'Go.',go:function(){ G.step='crisis_fix'; paintHUD(); closeDlg(); }}]);
                  }}]);
              }}]);
          }}]);
      });
  }

  if(key==='mike'&&s==='crisis_fix'){
    return choose('mike',`Ninety seconds. What goes in the roadmap and what goes in the contract?`,[
      {label:`Commit SSO for March — nine of twelve deals want it, so it's clearly the right call.`,ok:false,
       note:`Nine of twelve want it written on a form. One of twelve has told us what they actually need. Commit the nine weeks on that evidence and you've learned nothing from the last five minutes. Again.`},
      {label:`Commit the deactivation API this quarter with a date, put SSO on the roadmap as the next quarter's candidate with no date and the discovery attached, and let the addendum say exactly that.`,ok:true},
      {label:`Commit both — deactivation now and SSO by March — so the deal is safe either way.`,ok:false,
       note:`You've protected the deal by promising the thing you just established nobody had asked for, out of capacity you don't have. Again.`}
    ],function(){
      advance('crisis_show','mike',`Published with eleven seconds to spare. Two weeks committed with a date, nine weeks named without one, and the reasoning underneath both. Go and tell Gareth before he sends the old version.`);
    });
  }

  if(key==='owen'&&s==='crisis_show'){
    stopClock();
    return say('owen',`So I go back with deactivation in three weeks, and SSO as a "candidate, next quarter". They'll ask about the date.`,
      [{label:'And you can tell them the truth about why there isn\u2019t one.',go:function(){
        say('owen',`Which is a better call than the one where I promise March and ring them in February. I've closed eleven of these. You're the first product person who asked me to put them on the phone instead of just saying no.`,
          [{label:'...',go:function(){
            say('kate',`That is the job. Not the roadmap tool, not the framework — that. Someone hands you a date and a requirement, and you go and find out which of the two is real. Six pieces of work, eight things you said no to in writing, and a publish deadline you didn't miss. You're a product manager now.`,
              [{label:'Thank you.',go:function(){ G.step='complete'; paintHUD(); closeDlg(); openCertificate(); }}]);
          }}]);
      }}]);
  }

  /* ---------- Sam: hints ---------- */
  if(key==='alex'){
    const h={
      pm_brief:`Nadia's in Product. Ask who decides, and what you have to be able to show.`,
      requests:`Thirty-eight tickets is not thirty-eight customers. Ask Theo how many accounts.`,
      outcome:`If the roadmap names the solution, you can't change the solution.`,
      capacity:`Oncall, bugs, leave, hiring. Nobody gets thirteen clean weeks.`,
      slicing:`What could one real account use in a fortnight?`,
      tradeoff:`The people who leave never file a ticket. Count them anyway.`,
      saying_no:`"It's on the backlog" is a no that costs you the relationship as well.`,
      stakeholder:`He's brought you a date and a requirement. One of them is negotiable and one isn't real.`,
      crisis_fix:`Commit what you know, name what you don't, and don't invent a date.`,
      crisis_show:`Go and tell him before the addendum goes out.`,
      complete:`You put eight noes in writing and still have a sales director on side. Pub?`
    };
    return say('alex', h[s] || `Stuck? Ask what decision this changes, and what you'd have to show to defend it in October.`);
  }

  const idle={
    kate:`Nothing new — go and finish the quarter.`,
    mike:`Bring it back when it's a slice somebody can use.`,
    jenny:`Bring me a plan that fits in the hours we've actually got.`,
    dan:`Kettle's on. Four accounts, thirty-eight tickets, remember.`,
    owen:`I'll wait. Signature's ready, mind.`
  };
  say(key, idle[key] || `...`);
}

TRACK_DEFS.product={
  id:'product', name:'Product Management', title:'Product Chronicles',
  blurb:'Forty-one requests, two squads, one quarter, and a hundred and eighty thousand pounds with a date attached.',
  first:'pm_brief',
  roles:{mike:'Tech Lead', kate:'Head of Product', jenny:'Engineering Manager',
         alex:'Senior PM', dan:'Support Lead',
         owen:'Sales Director', player:'The new product manager'},
  script:function(key){ return pmScript(key); },
  occupants:function(room){ return pmOccupants(room); },
  objectives:OBJ_PM,
  opening:{text:`Nine in the morning at Meridian. Forty-one open requests, two squads, three things sales have already promised, and a roadmap that publishes at five o'clock whether it is right or not.`,
           label:'Find Nadia.'},
  certTitle:'PRODUCT CHRONICLES',
  timeUp:{who:'kate',line:`Published. Gareth's addendum went out with the old wording, so we've committed March for something nobody asked for. Finish it anyway — missing a deadline is survivable; not knowing what you would have written is not.`},
  certBody:['planned a quarter at Meridian — demand counted properly, outcomes instead of',
            'features, honest capacity, a two-week slice and eight documented noes — and',
            'turned a hundred-and-eighty-thousand-pound date into the requirement underneath it.'],
  lessons:[
    {t:'Count accounts, not tickets', c:'Demand',
     l:'Thirty-eight requests were four customers, one of them energetic. And some requests are workarounds for a bug you could just fix.'},
    {t:'A roadmap of features is a list of promises', c:'Roadmap',
     l:'Write the outcome and the number, not the implementation and the month. Then learning something new is progress rather than a broken commitment.'},
    {t:'Nobody gets thirteen clean weeks', c:'Capacity',
     l:'Oncall, support load, leave, hiring panels. Plan against roughly sixty per cent of nominal and say out loud what drops because of it.'},
    {t:'Slice vertically', c:'Scoping',
     l:'One provider, one direction, a manual step, in front of a real account in a fortnight. Backend-then-frontend is nine weeks of learning nothing.'},
    {t:'The people who leave never file a ticket', c:'Prioritisation',
     l:'A request log over-weights the customers you already have. The silent cost is usually bigger and always harder to argue for.'},
    {t:'Write down the size of both options', c:'Prioritisation',
     l:'The decision will be questioned in October by someone who wasn\u2019t there. The reasoning is the artefact, not the ranking.'},
    {t:'"It\u2019s on the backlog" is a no that also costs you the relationship', c:'Saying no',
     l:'Say no, say what it lost to, and say what would change your mind. Silent deprioritisation spends your credibility instead of your nerve.'},
    {t:'A date is not a requirement', c:'Stakeholders',
     l:'Ask to speak to the person who has to sign off, and ask whether it is one deal or a pattern. Those are two different answers.'},
    {t:'Commit what you know, name what you don\u2019t', c:'Commitment',
     l:'A dated promise you invented is worse than an undated candidate with the discovery attached. You only get to break it once.'}
  ]
};


