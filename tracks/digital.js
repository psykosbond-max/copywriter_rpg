/* Track: Digital Marketing Chronicles
   A track owns its people, its objectives, its step machine and its lessons.
   The world it runs in (rooms, furniture, colourway) comes from worlds/agency.js,
   and everything else from engine/. */

window.TRACK_CONFIG={
  menuLede:"A day on a paid account, and a number the board has already believed."
};

const CAST={
 mike:{name:'Mike', role:'Creative Director', where:'Creative',
   accent:'#fbbf24', top:'#c9852f', topDk:'#a06a22', style:'overshirt', tee:'#f2ece0',
   legs:'#33405c', legsDk:'#26314a', shoe:'#e8e2d6',
   skin:'#c98a56', skinDk:'#a26c3f', hair:'#5a5148', hairHi:'#7d7266', cut:'curls',
   specs:true, prop:'notebook', build:1.04, bw:23, beard:true},
 kate:{name:'Kate', role:'Performance Lead', where:'Servicing',
   accent:'#f472b6', top:'#6d4a63', topDk:'#523849', style:'blazer', tee:'#f2ece0',
   legs:'#2c2a26', legsDk:'#1f1e1b', shoe:'#33302b',
   skin:'#e8b98c', skinDk:'#c2955f', hair:'#2b1f18', hairHi:'#463228', cut:'long',
   specs:false, prop:'tablet', build:1.0, bw:20, beard:false},
 jenny:{name:'Jenny', role:'Analytics', where:'Studio',
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
 player:{name:'You', role:'The new performance marketer', where:'Lobby',
   accent:'#e4ded2', top:'#4a6a86', topDk:'#3a5468', style:'overshirt', tee:'#f2ece0',
   legs:'#33405c', legsDk:'#26314a', shoe:'#e8e2d6',
   skin:'#c08a5e', skinDk:'#9c6c45', hair:'#241c16', hairHi:'#3c2f24', cut:'short',
   specs:false, prop:null, build:1.0, bw:20, beard:false}
};

CAST.marek={name:'Marek', role:'Marketing Director, Lofthouse Beds', where:'Lobby',
  accent:'#4f9a8f', top:'#3f5f6b', topDk:'#2e4751', style:'blazer', tee:'#f2ece0',
  legs:'#2c2a26', legsDk:'#1f1e1b', shoe:'#33302b',
  skin:'#d9a878', skinDk:'#b3855a', hair:'#4a3728', hairHi:'#665038', cut:'short',
  specs:true, prop:'tablet', build:1.02, bw:21, beard:false};

const OBJ_DIGITAL={
  dm_brief:'Marek from Lofthouse is waiting in the Lobby',
  attribution:'Take the numbers to Kate in Servicing',
  metric:'Dan in the Break Room has the dashboard nobody reads',
  audience:'Ask Jenny in the Studio who we are actually buying',
  landing:'Mike in Creative, about the page the ad promises',
  email:'Dan again — he has a list and a bad idea',
  budget:'Back to Kate. The split, and what cutting brand costs',
  present_plan:'Present it to Marek in the Meeting Room',
  crisis_number:'Decide. Now.',
  complete:'You are a performance marketer now'
};

function digitalOccupants(room){
  const s=G.step;
  const pitching=['present_plan','crisis_number'].indexOf(s)>=0;
  if(room==='lobby')     return s==='dm_brief'?[['marek',400,300,'down']]:[];
  if(room==='servicing') return pitching?[['alex',620,240,'left']]
                                        :[['kate',400,306,'down'],['alex',620,240,'left']];
  if(room==='creative')  return [['mike',260,258,'right']];
  if(room==='studio')    return [['jenny',400,196,'down']];
  if(room==='breakroom') return [['dan',650,268,'down']];
  if(room==='meeting')   return pitching?[['marek',360,196,'down'],['kate',470,196,'down']]:[];
  return [];
}

function digitalScript(key){
  const s=G.step;

  /* ---------- 1. the brief, and the number under it ---------- */
  if(key==='marek'&&s==='dm_brief'){
    return choose('marek',
      `Marek Sowa, Lofthouse Beds. Thirty-eight thousand a month on paid, and the dashboard says a return of six to one. So I've come to ask you to double it.`,
      [
       {label:`"Six to one is strong — let's scale it and keep the creative fresh."`,ok:false,
        note:`You haven't asked what the six counts. Nobody doubles a budget on a number they have not opened. Again.`},
       {label:`"Before we double anything — what would happen to your sales next month if we turned it all off?"`,ok:true},
       {label:`"Six to one probably isn't real. Platforms overstate everything."`,ok:false,
        note:`Probably. And you have just told a man his last two years were imaginary, with no evidence and no plan. Again.`}
      ],function(){
        say('marek',`...I don't know. Revenue's been flat for five quarters while the spend went up forty per cent. Which I have been explaining as market conditions.`,
          [{label:'Flat revenue and rising spend.',go:function(){
            filed('Diagnosis','Lofthouse','Spend up 40%, revenue flat — the 6x is measuring something else');
            advance('attribution','marek',`Nobody has asked me that question. They ask which creative I want to test.`);
          }}]);
      });
  }

  /* ---------- 2. attribution ---------- */
  if(key==='kate'&&s==='attribution'){
    return choose('kate',
      `I've pulled it apart. Sixty-one per cent of that six-to-one is branded search and retargeting — people typing "lofthouse beds" into Google and people who already had a mattress in the basket. What do we do about it?`,
      [
       {label:`"Move to a data-driven attribution model so the credit is shared properly."`,ok:false,
        note:`A better model still only reads the clicks the platform showed you. You would be redistributing credit inside the same closed room. Again.`},
       {label:`"Turn it off in half the country for three weeks and compare. If sales hold, the credit was never ours."`,ok:true},
       {label:`"Add view-through conversions so we capture the full picture."`,ok:false,
        note:`You have made the number bigger. That is the opposite of finding out whether it is true. Again.`}
      ],function(){
        filed('Measurement plan','Lofthouse','Geo holdout — half the regions dark for three weeks');
        advance('metric','kate',`A holdout. Crude, cheap, and the only thing in this business that answers the question. It will also make the dashboard look worse, which is the part Marek needs warning about. Dan has the dashboard — go and ask him which line on it matters.`);
      });
  }

  /* ---------- 3. the metric that decides something ---------- */
  if(key==='dan'&&s==='metric'){
    return choose('dan',
      `Here's the weekly report. Four million impressions, click-through up to one-point-eight per cent, engagement rate up, ROAS six. Marek reads it every Monday. Which of these tells him anything?`,
      [
       {label:`"Click-through rate. It's the cleanest read on whether the creative is working."`,ok:false,
        note:`It tells you which picture people prefer. It does not tell you whether anybody bought a bed. Again.`},
       {label:`"None of them. What it costs to get one new customer, and how long till that customer pays it back."`,ok:true},
       {label:`"Impressions. Reach is what builds the brand over time."`,ok:false,
        note:`Reach you cannot connect to a sale is a number you bought. Again.`}
      ],function(){
        filed('Reporting','Lofthouse','Cost per new customer and payback period — the rest moved to an appendix');
        advance('audience','dan',`Cost per new customer. Which we have never once put on that page, because it is four times what he thinks it is. Jenny will show you why — she has been through the audience settings.`);
      });
  }

  /* ---------- 4. who we are actually buying ---------- */
  if(key==='jenny'&&s==='audience'){
    return choose('jenny',
      `Found something. Every campaign is targeting everyone who visited the site in the last hundred and eighty days, and there is no exclusion list. So we are paying to advertise mattresses to people who bought a mattress last week.`,
      [
       {label:`"Exclude recent purchasers and build a lookalike from all site visitors."`,ok:false,
        note:`Half right. Seed a lookalike on all visitors and you clone browsers, not buyers. You would be buying more of the people who never spend. Again.`},
       {label:`"Exclude purchasers, and seed the lookalike on the customers who bought twice — model the good ones, not the curious ones."`,ok:true},
       {label:`"Widen the targeting. The algorithm will find the buyers itself."`,ok:false,
        note:`It will find the cheapest clicks, which is not the same thing, and you have given it no signal to aim at. Again.`}
      ],function(){
        filed('Audiences','Lofthouse','Purchasers excluded; lookalike seeded on repeat buyers');
        advance('landing','jenny',`Repeat buyers. Fourteen hundred of them, which is enough to model. And a mattress has an eight-year replacement cycle, so retargeting a purchaser for six months is an eight-year mistake made monthly. Mike is waiting — the ads are fine, the page they land on is not.`);
      });
  }

  /* ---------- 5. the ad and the page ---------- */
  if(key==='mike'&&s==='landing'){
    return choose('mike',
      `The ad says "hundred-night trial, free returns". Click it and you land on the homepage, where the trial is mentioned in the footer. Eighty-one per cent leave inside four seconds. Whose fault is that?`,
      [
       {label:`"The creative. Let's test new hooks and find one that converts better."`,ok:false,
        note:`The hook is working. Eighty-one per cent of people who wanted what it promised could not find it. You would be optimising the door while the room is empty. Again.`},
       {label:`"Ours, and it's the page. Whatever the ad promised has to be the first thing on it."`,ok:true},
       {label:`"Nobody's fault — four seconds is normal bounce for cold traffic."`,ok:false,
        note:`You have explained a number instead of fixing it. Normal is not the same as acceptable. Again.`}
      ],function(){
        filed('Landing page','Lofthouse','The ad promise becomes the page headline, above the fold');
        advance('email','mike',`The page has to keep the promise the ad made, and it has to keep it first. Everything else about this account is arithmetic — that bit is just manners. Dan is in the kitchen with an email list and a look on his face.`);
      });
  }

  /* ---------- 6. the list ---------- */
  if(key==='dan'&&s==='email'){
    return choose('dan',
      `Marek's bought a list. Forty thousand addresses, a hundred and eighty quid, "UK homeowners aged thirty to fifty-five". He wants it sent Thursday. He also has ninety thousand of his own people who have not been emailed since March.`,
      [
       {label:`"Send to the bought list Thursday, and warm up the old list after."`,ok:false,
        note:`Forty thousand strangers in one send. Spam complaints go through the roof, the domain gets throttled, and the ninety thousand who actually like him stop receiving anything. You would break the only channel he owns. Again.`},
       {label:`"Bin the bought list — it will wreck the sending domain and it is not consented. Re-engage his own ninety thousand in stages."`,ok:true},
       {label:`"Send to both, but from a separate subdomain so the main one is protected."`,ok:false,
        note:`Cleverer, still wrong. You have found a way to do the thing rather than a reason not to, and the consent problem does not move house with the subdomain. Again.`}
      ],function(){
        filed('Email','Lofthouse','Bought list refused; owned list re-engaged in staged batches');
        advance('budget','dan',`Right. And it is a hundred and eighty quid against a domain reputation that took six years, which is the easiest sum of the day. Kate wants you on the split before the meeting.`);
      });
  }

  /* ---------- 7. the split ---------- */
  if(key==='kate'&&s==='budget'){
    return choose('kate',
      `So the holdout is going to show that a good chunk of the six is people who were coming anyway. Marek will want to cut. Thirty-eight thousand a month — where does it go?`,
      [
       {label:`"All of it into prospecting. Stop paying to reach people who already know them."`,ok:false,
        note:`Cut branded search to zero and a competitor bids on his name for pennies. Some of that spend is a toll, not a tactic. Again.`},
       {label:`"Trim branded and retargeting to a defensive minimum, put the difference into reaching people who have never heard of them, and hold a slice back to prove it worked."`,ok:true},
       {label:`"Keep the split as it is until the holdout finishes. No decisions without data."`,ok:false,
        note:`Three more weeks of a spend you already know is mostly buying its own customers. Waiting is a decision and this one costs about twenty thousand pounds. Again.`}
      ],function(){
        filed('Budget','Lofthouse','Branded and retargeting to a defensive floor; the rest into prospecting, with a holdout retained');
        advance('present_plan','kate',`Defensive floor. Good. And the measurement budget stays in — the first thing anyone cuts is the only thing that tells you whether the rest is working. He is in the meeting room. This is yours to present.`);
      });
  }

  /* ---------- 8. the presentation ---------- */
  if(key==='marek'&&s==='present_plan'){
    return choose('marek',
      `Right. My board meets at four. Tell me in one sentence what I am taking in there.`,
      [
       {label:`"That we have found efficiencies and expect the return to improve to seven or eight."`,ok:false,
        note:`You have promised a bigger version of the number you came here to correct. In a quarter you will be sitting in this room explaining why it went down. Again.`},
       {label:`"That the six-to-one was mostly measuring demand you already had, that we do not yet know what the ads are worth, and that in three weeks you will — for the first time."`,ok:true},
       {label:`"That the account was badly set up and we have fixed it."`,ok:false,
        note:`True, unkind, and it makes him the fool in front of his board. He will defend the old number to defend himself. Again.`}
      ],function(){
        filed('Board recommendation','Lofthouse','What we know, what we do not, and the date we will');
        say('marek',`...So I go in and say the number I have been quoting for two years is not a number. And that the honest answer arrives on the twenty-first.`,
          [{label:'That is the recommendation.',go:function(){
            say('kate',`It is. Diane will hate it for a week and trust it for a decade.`,
              [{label:'Then we are done.',go:function(){
                startClock(90);
                say('marek',`Except we are not. My chief executive has just sent this. "Keep the six-to-one in the deck, it is the only slide the board likes." He wants an answer before four, and it is now nearly four.`,
                  [{label:'Think.',go:function(){ G.step='crisis_number'; paintHUD(); digitalCrisis(); }}]);
              }}]);
          }}]);
      });
  }
  if(key==='kate'&&s==='present_plan')
    return say('kate',`(She is letting you present. That is the test.)`);
  if((key==='marek'||key==='kate')&&s==='crisis_number') return digitalCrisis();

  /* ---------- Alex: hints ---------- */
  if(key==='alex'){
    const h={
      dm_brief:`He is in the lobby with a number he loves. Ask what happens if we switch it all off — that is the only question it cannot survive.`,
      attribution:`A new model reads the same clicks. If you want to know what the ads are worth, stop running them somewhere.`,
      metric:`Dan will offer you four metrics. Pick the one a decision hangs on.`,
      audience:`Lookalikes copy whoever you seed them with. Seed carefully.`,
      landing:`The ad is not the problem. Read what it promises, then look at where it lands.`,
      email:`A hundred and eighty pounds of strangers against six years of domain reputation.`,
      budget:`Some of that spend is a toll for keeping his own name. Do not cut a toll to zero.`,
      present_plan:`He has to say it to a board. Give him a sentence he can survive being quoted on.`,
      crisis_number:`The slide is not the problem. Who signs off the slide is.`,
      complete:`First account and you took a number off a board deck. Drink?`
    };
    return say('alex', h[s] || `Stuck? Tell me the metric and I will tell you what decision it changes.`);
  }

  const idle={
    kate:`Bring me something the holdout can prove.`,
    mike:`The ads are fine. Go and look at the page.`,
    jenny:`Ask me who we are buying. You will not like it.`,
    dan:`Kettle's on. The dashboard is a work of fiction, whenever you want to talk about it.`,
    marek:`I'll wait. The board won't, mind.`
  };
  say(key, idle[key] || `...`);
}

function digitalCrisis(){
  choose('marek',`Well? It is one slide.`,[
    {label:`"Leave it in with a footnote explaining the caveats."`,ok:false,
     note:`A footnote nobody reads under a number everybody does. You would have published it and told yourself you had not. Again.`},
    {label:`"Leave it in, labelled as what it is — platform-reported, last-click — next to the holdout date. Do not delete the number; take away its authority."`,ok:true},
    {label:`"Take it out. We do not put numbers we cannot stand behind in board decks."`,ok:false,
     note:`Right instinct, wrong move. Remove the only slide the board likes an hour before the meeting and you have made the measurement look like an excuse. Again.`}
  ],function(){
    stopClock();
    G.portfolio[G.portfolio.length-1]={title:'Board slide (defended)',client:'Lofthouse',
      line:'The 6x stays, labelled platform-reported, beside the date the real answer lands'};
    say('marek',`...So the number stays on the slide and stops being the answer.`,
      [{label:'It becomes a claim with an author.',go:function(){
        say('kate',`That is the job. Not the holdout — that. Anyone can find a bad number. Taking its authority away without humiliating the person who has been quoting it for two years, in the ninety seconds before they walk into the room — that is the whole of this trade.`,
          [{label:'Thank you.',go:function(){ G.step='complete'; paintHUD(); closeDlg(); openCertificate(); }}]);
      }}]);
  });
}

TRACK_DEFS.digital={
  id:'digital', name:'Digital Marketing', title:'Digital Marketing Chronicles',
  blurb:'Thirty-eight thousand a month, a return of six to one, and nobody has ever switched it off to check.',
  first:'dm_brief',
  roles:{mike:'Creative Director', kate:'Performance Lead', jenny:'Analytics',
         alex:'Copywriter', dan:'Studio & everything else',
         marek:'Marketing Director, Lofthouse Beds', player:'The new performance marketer'},
  script:function(key){ return digitalScript(key); },
  occupants:function(room){ return digitalOccupants(room); },
  objectives:OBJ_DIGITAL,
  opening:{text:`Nine in the morning. There is a man in the lobby who has spent nine hundred thousand pounds on advertising over two years, has the receipts to prove it worked, and has never once been asked what would happen if he stopped.`,
           label:'Go over.'},
  certTitle:'DIGITAL MARKETING CHRONICLES',
  timeUp:{who:'kate',line:`Clock's gone. The six-to-one went into the deck unlabelled and the board approved a bigger version of the same mistake. Finish it anyway — missing a meeting is survivable; not knowing what you would have put on the slide is not.`},
  certBody:['took a paid account apart at Lofthouse — attribution, the metric that decides,',
            'audiences, the landing page, a bought list and the budget split — and turned',
            'a number the board loved into a question it could finally answer.'],
  lessons:[
    {t:'Ask what happens if you stop', c:'The brief',
     l:'Every reported return survives scrutiny until you ask what sales would do at zero spend. That question, not a better dashboard, is where measurement starts.'},
    {t:'Last-click pays the closer, not the opener', c:'Attribution',
     l:'Branded search and retargeting harvest demand somebody else created. Crediting them is like paying the till for the shop.'},
    {t:'A holdout beats a model', c:'Attribution',
     l:'A new attribution model reads the same clicks in a new order. Turning spend off somewhere and comparing is crude, cheap, and the only thing that answers the question.'},
    {t:'Pick the metric a decision hangs on', c:'Reporting',
     l:'Impressions, click-through and engagement describe the advertising. Cost per new customer and payback period decide whether to keep doing it.'},
    {t:'A lookalike copies whoever you seed it with', c:'Audiences',
     l:'Seed on all site visitors and you clone browsers. Seed on repeat buyers and you clone the business. And exclude the people who just bought.'},
    {t:'The page has to keep the promise the ad made', c:'Landing pages',
     l:'When a good hook bounces, the creative is usually working and the page is not. Whatever the ad said belongs at the top of what it opens.'},
    {t:'A bought list costs more than it costs', c:'Email',
     l:'Strangers in bulk produce complaints, complaints throttle the domain, and the people who chose to hear from you stop receiving anything. The cheap list breaks the channel you own.'},
    {t:'Some spend is a toll, not a tactic', c:'Budget',
     l:'Bidding on your own name looks like waste until a competitor does it for pennies. Trim it to a defensive floor; do not cut it to zero.'},
    {t:'Protect the measurement budget first', c:'Budget',
     l:'It is the line everyone cuts and the only one that tells you whether the others are working.'},
    {t:'Take the number’s authority, not the number', c:'The board slide',
     l:'Deleting a figure an hour before a board meeting makes honesty look like an excuse. Label it as what it is, put the real answer’s date beside it, and let it lose its power in public.'}
  ]
};
