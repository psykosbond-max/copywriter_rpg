/* Track: Data Chronicles
   A track owns its people, its objectives, its step machine and its lessons.
   `TRACK_CONFIG` below overrides engine/defaults.js and the world for THIS GAME
   ONLY — the place to change one game without touching the other eight. */
window.TRACK_CONFIG={
  menuLede:"A day on a product team, and a number somebody has already decided."
};

const CAST={
 mike:{name:'Ravi', role:'Staff Data Scientist', where:'Engineering',
   accent:'#fbbf24', top:'#c9852f', topDk:'#a06a22', style:'overshirt', tee:'#f2ece0',
   legs:'#33405c', legsDk:'#26314a', shoe:'#e8e2d6',
   skin:'#c98a56', skinDk:'#a26c3f', hair:'#5a5148', hairHi:'#7d7266', cut:'curls',
   specs:true, prop:'notebook', build:1.04, bw:23, beard:true},
 kate:{name:'Nadia', role:'Product Lead', where:'Product',
   accent:'#f472b6', top:'#6d4a63', topDk:'#523849', style:'blazer', tee:'#f2ece0',
   legs:'#2c2a26', legsDk:'#1f1e1b', shoe:'#33302b',
   skin:'#e8b98c', skinDk:'#c2955f', hair:'#2b1f18', hairHi:'#463228', cut:'long',
   specs:false, prop:'tablet', build:1.0, bw:20, beard:false},
 jenny:{name:'Jen', role:'Data Platform', where:'Ops',
   accent:'#34d399', top:'#2f7d78', topDk:'#215b57', style:'hoodie', tee:'#2f7d78',
   legs:'#5e6a4f', legsDk:'#48523c', shoe:'#e08265',
   skin:'#8d5f38', skinDk:'#6d4626', hair:'#1e1710', hairHi:'#3a2c1e', cut:'puff',
   specs:false, prop:'camera', build:0.98, bw:22, beard:false},
 alex:{name:'Sam', role:'Senior Analyst', where:'Engineering',
   accent:'#38bdf8', top:'#e08265', topDk:'#b8624a', style:'knit', tee:'#e08265',
   legs:'#a8a49c', legsDk:'#8d8981', shoe:'#33302b',
   skin:'#f0c8a0', skinDk:'#cfa079', hair:'#3a2a1c', hairHi:'#5a4430', cut:'undercut',
   specs:true, prop:'coffee', build:0.96, bw:19, beard:false},
 dan:{name:'Theo', role:'Analytics Engineering', where:'Kitchen',
   accent:'#a78bfa', top:'#7d9070', topDk:'#5f6f54', style:'tee', tee:'#7d9070',
   legs:'#3f4a5c', legsDk:'#2f3747', shoe:'#f2ece0',
   skin:'#a0673a', skinDk:'#7d4c28', hair:'#22201d', hairHi:'#3a352d', cut:'beanie',
   specs:false, prop:'mug', build:1.02, bw:21, beard:true},
 player:{name:'You', role:'The new analyst', where:'Reception',
   accent:'#e4ded2', top:'#4a6a86', topDk:'#3a5468', style:'overshirt', tee:'#f2ece0',
   legs:'#33405c', legsDk:'#26314a', shoe:'#e8e2d6',
   skin:'#c08a5e', skinDk:'#9c6c45', hair:'#241c16', hairHi:'#3c2f24', cut:'short',
   specs:false, prop:null, build:1.0, bw:20, beard:false}
};
/* ==========================================================================
   DESIGN FUNDAMENTALS TRACK — content only
   ========================================================================== */

CAST.owen={name:'Diane', role:'VP Revenue', where:'War Room',
   accent:'#f472b6', top:'#5c4a63', topDk:'#453749', style:'blazer', tee:'#e6edf3',
   legs:'#2c2a26', legsDk:'#1f1e1b', shoe:'#33302b',
   skin:'#e8b98c', skinDk:'#c2955f', hair:'#4a4038', hairHi:'#6b5e52', cut:'short',
   specs:true, prop:'tablet', build:1.0, bw:20, beard:false};

const OBJ_DATA={
  data_brief:'Get the question from Nadia in Product',
  metric:'Ravi is on the Engineering floor — agree what churn means first',
  confound:'Theo in the Kitchen has a chart he is excited about',
  survivorship:'Back to Ravi. Something is missing from your data, by definition',
  simpson:'Jen in Ops — conversion is up and down at the same time',
  ab_test:'Theo again, and he wants to ship the experiment',
  leakage:'Jen in Ops. Ninety-four per cent accuracy is the problem, not the result',
  stakeholder:'Diane is waiting in the War Room',
  crisis_fix:'Ops. Jen. Quickly',
  crisis_show:'Back to Diane in the War Room',
  complete:'You are an analyst now'
};

function dataOccupants(room){
  const s=G.step;
  const withDiane=['stakeholder','crisis_fix','crisis_show'].indexOf(s)>=0;
  if(room==='lobby')     return [];
  if(room==='servicing') return [['kate',400,306,'down']];
  if(room==='creative')  return [['mike',260,258,'right'],['alex',560,268,'left']];
  if(room==='studio')    return [['jenny',400,196,'down']];
  if(room==='breakroom') return [['dan',650,268,'down']];
  if(room==='meeting')   return withDiane?[['owen',400,196,'down']]:[];
  return [];
}

function dataScript(key){
  const s=G.step;

  /* ---------- the question ---------- */
  if(key==='kate'&&s==='data_brief')
    return say('kate',`Nadia, product. Churn is up four points this quarter and we put prices up in February, so everyone has already decided what happened. Diane needs something for the board on Thursday. What she'll ask you for is a number. What she needs is to know whether to roll the price rise back.`,
      [{label:`Those aren't the same request.`,go:function(){
        say('kate',`No, they aren't, and you'll find that out the hard way at about four o'clock. Ravi's on the floor. Start with him, because three teams in this building count churn three different ways and two of them are wrong for this question.`,
          [{label:'On my way.',go:function(){ advance('metric'); }}]);
      }}]);

  /* ---------- 1. the metric ---------- */
  if(key==='mike'&&s==='metric'){
    return choose('mike',
      `Ravi, staff data scientist. Before you open anything: finance count churn as revenue lost over revenue at the start of the month, support count any account that raises a cancellation, and the dashboard counts logins going to zero for thirty days. All three say "churn" and they disagree by nine points. Which do you use?`,
      [
       {label:`The dashboard figure — it's the one the company already looks at, so the numbers will match what people expect.`,ok:false,
        note:`Consistent with a number nobody chose for this purpose. Thirty days of no logins includes every seasonal business that's shut for the winter. Again.`},
       {label:`Whichever is highest, so we're being conservative about the size of the problem.`,ok:false,
        note:`Picking the number that makes the best story is the thing you're here to stop other people doing. Again.`},
       {label:`Work back from the decision — she's deciding whether to reverse a price rise, so it's revenue retained by cohort, measured from the month each account signed — and write the definition into the analysis so it can be argued with.`,ok:true}
      ],function(){
        filed('Metric definition','Meridian churn','Revenue retention by signup cohort, chosen from the decision and written down');
        advance('confound','mike',`Right. Choosing a metric is a decision, not a lookup, and the decision it serves is the only thing that makes one choice better than another. Write the definition down where people can see it, or in six weeks somebody will quote your number for something it can't answer. Theo's in the kitchen with a chart he's very pleased about.`);
      });
  }

  /* ---------- 2. the confounder ---------- */
  if(key==='dan'&&s==='confound'){
    return choose('dan',
      `Theo, analytics engineering. Look at this. Accounts with the mobile app installed churn thirty-one per cent less. Thirty-one. I've already written the slide — push the app harder, churn goes down. Tell me I'm a genius.`,
      [
       {label:`It's a big effect on a big sample, so recommend the app push and monitor churn afterwards.`,ok:false,
        note:`It's a big effect on the wrong question. You'd be spending a quarter's roadmap on something that might be entirely backwards. Again.`},
       {label:`Ask what else is true of accounts that install the app, compare like with like on size and engagement — and say plainly that only a randomised rollout settles direction.`,ok:true},
       {label:`Dismiss it — correlation isn't causation, so the finding tells us nothing.`,ok:false,
        note:`Too far the other way. It's a real pattern and worth chasing; it just isn't a cause yet. "Correlation isn't causation" is the beginning of the work, not a way out of it. Again.`}
      ],function(){
        filed('Confounder check','Meridian churn','App effect explained by account size and engagement; experiment proposed');
        advance('survivorship','dan',`Ah. It's the busy multi-practitioner accounts that install it, and they were never going to leave. Engaged people install apps; apps don't create engaged people — or not by thirty-one points, anyway. Ravi's after you. Something about your data being missing on purpose.`);
      });
  }

  /* ---------- 3. survivorship ---------- */
  if(key==='mike'&&s==='survivorship'){
    return choose('mike',
      `Two things in your working. Your satisfaction scores come from the onboarding survey, which only fires on the last step of onboarding. And your feature-usage table was rebuilt in March from currently active accounts. You're about to conclude that satisfied, feature-using accounts churn less.`,
      [
       {label:`Note both as limitations in an appendix and carry on with the conclusion.`,ok:false,
        note:`A limitation in an appendix is a conclusion in the summary. Your survey cannot contain anyone who gave up during onboarding, and your usage table cannot contain anyone who already left — so of course the survivors look happy and busy. Again.`},
       {label:`Recognise that both sources exclude the people the question is about, go back for a source that includes churned accounts, and weight or reframe rather than concluding from survivors.`,ok:true},
       {label:`Increase the sample by pulling twelve months instead of three, which will dilute the bias.`,ok:false,
        note:`Twelve months of the same missing people. More data with the same hole in it is a more confident wrong answer. Again.`}
      ],function(){
        filed('Survivorship check','Meridian churn','Survivor-only sources identified and replaced with full-population history');
        advance('simpson','mike',`Yes. Ask who is definitionally absent from every table you touch — the answer is usually the people you're asking about. Jen's in Ops, and she's got conversion going up and down simultaneously.`);
      });
  }

  /* ---------- 4. the mix shift ---------- */
  if(key==='jenny'&&s==='simpson'){
    return choose('jenny',
      `Jen, data platform. Trial-to-paid conversion is up two points overall this quarter. It is down in clinics, down in salons, down in garages and down in "other" — every single segment. Both of those are correct. Explain it or you can't use either.`,
      [
       {label:`The overall figure is the one that matters — segments are noisy at that size.`,ok:false,
        note:`You've picked the number you liked and called the others noise. They aren't noise; they're every segment we have. Again.`},
       {label:`The mix changed — we got a lot more of whichever segment converts best, so the total rose while each segment fell. Report the mix shift and the per-segment trend together, because the average is hiding the story.`,ok:true},
       {label:`It's a data quality problem — the segments must be double-counting somewhere.`,ok:false,
        note:`Tempting, and no. This happens with perfectly clean data and it has a name. Again.`}
      ],function(){
        filed('Mix analysis','Meridian conversion','Simpson\u2019s paradox identified — clinic share up, every segment down');
        advance('ab_test','jenny',`Correct — marketing went hard at clinics in January, clinics convert best, and the weighted average went up while we got worse at everything. An aggregate is a weighted average of things you chose not to look at. Theo's found statistical significance, by the way, and he's ready to ship.`);
      });
  }

  /* ---------- 5. the experiment ---------- */
  if(key==='dan'&&s==='ab_test'){
    return choose('dan',
      `The new pricing page test. Day three, p equals nought point nought four, variant's up eleven per cent. Nadia's asking whether we can call it. Our pre-registered plan said two weeks and eighteen thousand sessions, and we're at four thousand.`,
      [
       {label:`Ship it — significance is significance, and two more weeks of a worse page costs money.`,ok:false,
        note:`You've stopped at the moment the noise was flattering. Peek often enough and a coin looks significant; that's why we wrote the plan down before we started. Again.`},
       {label:`Keep it running and check daily — if it stays significant, ship it early with confidence.`,ok:false,
        note:`Checking daily and stopping when you like the answer is the same error with more steps. Again.`},
       {label:`Run to the pre-registered sample and stop rule, report the effect with its interval rather than just the p-value, and note that eleven per cent on day three will shrink.`,ok:true}
      ],function(){
        filed('Experiment discipline','Meridian pricing test','Ran to the pre-registered stop rule; effect reported with interval');
        advance('leakage','dan',`Fine. It settled at three per cent, which is still worth having and is a completely different conversation about the roadmap than eleven. Jen wants you — she says your churn model is too good.`);
      });
  }

  /* ---------- 6. leakage and base rates ---------- */
  if(key==='jenny'&&s==='leakage'){
    return choose('jenny',
      `Your churn model reports ninety-four per cent accuracy. Churn in this population runs at about six per cent. Two of your features are "days since last login", computed as of today, and "cancellation_reason_is_null". You split train and test randomly across two years. Go on then.`,
      [
       {label:`Ninety-four per cent on a six per cent base rate is roughly "predict nobody churns", so switch to precision, recall and a proper baseline comparison.`,ok:false,
        note:`Right about the base rate and you've left both time bombs in. Your cancellation-reason feature is the answer written on the back of the card, and a random split lets the model learn from next March to predict last January. Again.`},
       {label:`Drop the features that are only knowable after the outcome, split by time so training never sees the future, and judge it on precision and recall against the base-rate baseline rather than accuracy.`,ok:true},
       {label:`Retrain with class weights to handle the imbalance and keep the feature set — the model should learn to discount weak signals itself.`,ok:false,
        note:`You've fixed the imbalance and kept the leak. A model with the outcome in its inputs will happily learn it, weighted or not. Again.`}
      ],function(){
        filed('Model validation','Meridian churn model','Post-outcome features removed, time-based split, precision and recall against base rate');
        advance('stakeholder','jenny',`Good. It scores far worse and it's now worth something. Accuracy on a rare event is a vanity metric, a feature that only exists after the event has happened is the answer on the back of the card, and a random split over time is quiet time travel. Right — Diane's in the war room and she wants a number.`);
      });
  }

  /* ---------- 7. the stakeholder who knows the answer ---------- */
  if(key==='owen'&&s==='stakeholder'){
    return choose('owen',
      `Diane, revenue. I've got fifteen minutes. I need the slide that shows the February price rise didn't drive the churn — because I've read the cohorts and I don't think it did, and I'd rather not spend Thursday being shouted at by people who haven't. Can you get me that number?`,
      [
       {label:`"I can — I'll pull the comparison that supports it."`,ok:false,
        note:`(You've agreed to find evidence for a conclusion. If the data goes the other way you now have to choose between your analysis and your credibility, and you set that trap yourself. Again.)`},
       {label:`"I can tell you what the data supports, which might not be that. What decision is Thursday actually making — whether to reverse the rise?"`,ok:true},
       {label:`"I can't produce a number to support a predetermined conclusion."`,ok:false,
        note:`Nor can I use that. I'll go with my own reading, then.  (Correct, and you've just removed the only careful person from the decision. Again.)`}
      ],function(){
        say('owen',`...Whether to reverse it, yes. And if we reverse it we lose the margin that pays for next year's hiring, so I'd like to be right rather than comfortable. What does it actually say?`,
          [{label:'Mostly what you think. Not entirely.',go:function(){
            say('owen',`Go on.`,
              [{label:'Retention held in four segments and fell hard in two.',go:function(){
                filed('Question, translated','Meridian','Reframed from "prove it wasn\u2019t the price" to "should we reverse it"');
                startClock(90);
                say('kate',`Which is the honest answer and a terrible moment for it, because the board pack locks in ninety seconds. Jen's in Ops — get one chart in there. Go.`,
                  [{label:'Go.',go:function(){ G.step='crisis_fix'; paintHUD(); closeDlg(); }}]);
              }}]);
          }}]);
      });
  }

  if(key==='jenny'&&s==='crisis_fix'){
    return choose('jenny',`One chart, ninety seconds. What goes in?`,[
      {label:`The headline number — churn attributable to price is not significant overall — with the segment detail in the appendix.`,ok:false,
       note:`That's a true sentence that will be read as "the price rise was fine", and the two segments where it bit are the two she's about to make a decision about. Again.`},
      {label:`Retention by cohort before and after February with intervals shown, the two segments where it fell called out on the same chart, and one line on what this cannot tell us.`,ok:true},
      {label:`A clean single-line chart of overall retention — anything more and a board audience will stop looking.`,ok:false,
       note:`Simplify the presentation, not the finding. You'd be hiding the only part of this that changes what they do. Again.`}
    ],function(){
      advance('crisis_show','jenny',`In the pack with eleven seconds to spare. Cohorts, intervals, the two bad segments named, and a sentence saying what it can't answer. Go and show her.`);
    });
  }

  if(key==='owen'&&s==='crisis_show'){
    stopClock();
    return say('owen',`So I keep the rise, and I go in on Thursday with the two segments we hurt and what we're doing about them.`,
      [{label:'And with what the chart cannot tell you.',go:function(){
        say('owen',`That line is the reason I'll be believed. I asked you for a number and you gave me a decision — nobody in this building does that.`,
          [{label:'...',go:function(){
            say('kate',`That's the job. Not the model, not the p-value — that. Someone asked you to prove something and your first move was to find out what they were deciding. Seven pieces of work, a model you made worse on purpose, and a board pack you didn't miss. You're an analyst now.`,
              [{label:'Thank you.',go:function(){ G.step='complete'; paintHUD(); closeDlg(); openCertificate(); }}]);
          }}]);
      }}]);
  }

  /* ---------- Sam: hints ---------- */
  if(key==='alex'){
    const h={
      data_brief:`Nadia's in Product. Ask what gets decided, not what gets reported.`,
      metric:`Three definitions, nine points apart. Pick from the decision, then write it down.`,
      confound:`Ask what else is true of the people in the flattering group.`,
      survivorship:`Ask who cannot possibly be in the table you're querying.`,
      simpson:`Up overall, down in every segment. Something about the mix changed.`,
      ab_test:`We wrote the stopping rule down for exactly this moment.`,
      leakage:`Six per cent base rate. Work out what "predict nobody churns" would score.`,
      stakeholder:`She's asking for a conclusion. Find out what she's deciding.`,
      crisis_fix:`One chart, the uncertainty visible, and the bit she needs to act on.`,
      crisis_show:`Go and show her — she hasn't seen it.`,
      complete:`You got a VP to ask for a decision instead of a number. Pub?`
    };
    return say('alex', h[s] || `Stuck? Ask what decision changes depending on the answer, and work back from that.`);
  }

  const idle={
    kate:`Nothing new — go and finish what you've got.`,
    mike:`Bring it back when you can tell me who's missing from the table.`,
    jenny:`Bring me something with an interval on it and we'll get on fine.`,
    dan:`Kettle's on. I've unpublished the app slide, before you ask.`,
    owen:`I'll wait. Fifteen minutes, mind.`
  };
  say(key, idle[key] || `...`);
}

TRACK_DEFS.data={
  id:'data', name:'Data Science', title:'Data Chronicles',
  blurb:'Churn is up four points, everyone already knows why, and the board meets Thursday.',
  first:'data_brief',
  roles:{mike:'Staff Data Scientist', kate:'Product Lead', jenny:'Data Platform',
         alex:'Senior Analyst', dan:'Analytics Engineering',
         owen:'VP Revenue', player:'The new analyst'},
  script:function(key){ return dataScript(key); },
  occupants:function(room){ return dataOccupants(room); },
  objectives:OBJ_DATA,
  opening:{text:`Nine in the morning at Meridian. Churn is up four points, the price rise in February has already been convicted by everyone in the building, and the board pack locks at five.`,
           label:'Find Nadia.'},
  certTitle:'DATA CHRONICLES',
  timeUp:{who:'kate',line:`Pack's locked. Diane goes in with her own reading and the two segments we hurt go unmentioned. Finish it anyway — missing a deadline is survivable; not knowing what you would have put in the chart is not.`},
  certBody:['investigated four points of churn at Meridian — metric definition, confounding,',
            'survivorship, mix shift, experiment discipline and a leaking model — and turned',
            'a request to prove a conclusion into the decision it was actually for.'],
  lessons:[
    {t:'Choose the metric from the decision', c:'Definitions',
     l:'Three teams counted churn three ways, nine points apart. The question being decided is the only thing that makes one definition better than another. Write yours down.'},
    {t:'Ask what else is true of that group', c:'Confounding',
     l:'App installers churned 31% less because busy accounts install apps. "Correlation isn\u2019t causation" is the start of the work, not an exit from it.'},
    {t:'Only randomisation settles direction', c:'Confounding',
     l:'Matching on what you can see narrows it. An experiment is what tells you which way the arrow points.'},
    {t:'Ask who cannot be in the table', c:'Survivorship',
     l:'An onboarding survey excludes everyone who quit onboarding; a table rebuilt from active accounts excludes everyone who left. More rows with the same hole is a more confident wrong answer.'},
    {t:'An average hides what you did not split by', c:'Mix',
     l:'Conversion rose overall and fell in every segment, because the mix changed. Report the trend and the mix together or neither.'},
    {t:'Write the stopping rule before you look', c:'Experiments',
     l:'Peek often enough and a coin reaches significance. Day-three effects shrink; 11% became 3%, which is a different roadmap conversation.'},
    {t:'Report the interval, not just the verdict', c:'Experiments',
     l:'A p-value says "probably something". The effect size and its range say what to do about it.'},
    {t:'Accuracy on a rare event is a vanity metric', c:'Models',
     l:'94% on a 6% base rate is roughly "predict nobody churns". Compare against that baseline with precision and recall.'},
    {t:'A feature that exists only after the outcome is the answer on the back of the card', c:'Models',
     l:'Cancellation reason, closure timestamps, anything computed as of today. And split by time — a random split over two years is quiet time travel.'},
    {t:'When asked to prove something, find out what is being decided', c:'Stakeholders',
     l:'Agreeing to support a conclusion traps you; refusing removes you from the room. Ask what changes depending on the answer, then say what the data can and cannot tell them.'}
  ]
};


