/* Track: UX Chronicles
   A track owns its people, its objectives, its step machine and its lessons.
   `TRACK_CONFIG` below overrides engine/defaults.js and the world for THIS GAME
   ONLY — the place to change one game without touching the other eight. */
window.TRACK_CONFIG={
  menuLede:"A day on a product team, and a request to hide the cancel button."
};

const CAST={
 mike:{name:'Ravi', role:'Design Lead', where:'Engineering',
   accent:'#fbbf24', top:'#c9852f', topDk:'#a06a22', style:'overshirt', tee:'#f2ece0',
   legs:'#33405c', legsDk:'#26314a', shoe:'#e8e2d6',
   skin:'#c98a56', skinDk:'#a26c3f', hair:'#5a5148', hairHi:'#7d7266', cut:'curls',
   specs:true, prop:'notebook', build:1.04, bw:23, beard:true},
 kate:{name:'Nadia', role:'Product Lead', where:'Product',
   accent:'#f472b6', top:'#6d4a63', topDk:'#523849', style:'blazer', tee:'#f2ece0',
   legs:'#2c2a26', legsDk:'#1f1e1b', shoe:'#33302b',
   skin:'#e8b98c', skinDk:'#c2955f', hair:'#2b1f18', hairHi:'#463228', cut:'long',
   specs:false, prop:'tablet', build:1.0, bw:20, beard:false},
 jenny:{name:'Jen', role:'Design Systems & Accessibility', where:'Ops',
   accent:'#34d399', top:'#2f7d78', topDk:'#215b57', style:'hoodie', tee:'#2f7d78',
   legs:'#5e6a4f', legsDk:'#48523c', shoe:'#e08265',
   skin:'#8d5f38', skinDk:'#6d4626', hair:'#1e1710', hairHi:'#3a2c1e', cut:'puff',
   specs:false, prop:'camera', build:0.98, bw:22, beard:false},
 alex:{name:'Sam', role:'Senior Designer', where:'Engineering',
   accent:'#38bdf8', top:'#e08265', topDk:'#b8624a', style:'knit', tee:'#e08265',
   legs:'#a8a49c', legsDk:'#8d8981', shoe:'#33302b',
   skin:'#f0c8a0', skinDk:'#cfa079', hair:'#3a2a1c', hairHi:'#5a4430', cut:'undercut',
   specs:true, prop:'coffee', build:0.96, bw:19, beard:false},
 dan:{name:'Theo', role:'Support Lead', where:'Kitchen',
   accent:'#a78bfa', top:'#7d9070', topDk:'#5f6f54', style:'tee', tee:'#7d9070',
   legs:'#3f4a5c', legsDk:'#2f3747', shoe:'#f2ece0',
   skin:'#a0673a', skinDk:'#7d4c28', hair:'#22201d', hairHi:'#3a352d', cut:'beanie',
   specs:false, prop:'mug', build:1.02, bw:21, beard:true},
 player:{name:'You', role:'The new designer', where:'Reception',
   accent:'#e4ded2', top:'#4a6a86', topDk:'#3a5468', style:'overshirt', tee:'#f2ece0',
   legs:'#33405c', legsDk:'#26314a', shoe:'#e8e2d6',
   skin:'#c08a5e', skinDk:'#9c6c45', hair:'#241c16', hairHi:'#3c2f24', cut:'short',
   specs:false, prop:null, build:1.0, bw:20, beard:false}
};
/* ==========================================================================
   DESIGN FUNDAMENTALS TRACK — content only
   ========================================================================== */

CAST.owen={name:'Marcus', role:'Head of Growth', where:'War Room',
   accent:'#38bdf8', top:'#3f4a5c', topDk:'#2f3747', style:'knit', tee:'#e6edf3',
   legs:'#2c2a26', legsDk:'#1f1e1b', shoe:'#e8e2d6',
   skin:'#8d5f38', skinDk:'#6d4626', hair:'#1e1710', hairHi:'#3a2c1e', cut:'short',
   specs:false, prop:'coffee', build:1.03, bw:21, beard:true};

const OBJ_UX={
  ux_brief:'Get the problem from Nadia in Product',
  research:'Ravi is on the Engineering floor — do not open Figma yet',
  ia_labels:'Theo in the Kitchen has heard this complaint forty times',
  states:'Back to Ravi. Your designs only show one version of the world',
  forms:'Jen in Ops, and bring the booking form with you',
  a11y:'Jen again — try it without touching the mouse',
  disclosure:'Ravi. There are eleven things on one screen',
  dark_pattern:'Marcus is waiting in the War Room',
  crisis_fix:'Engineering. Ravi. Quickly',
  crisis_show:'Back to Marcus in the War Room',
  complete:'You are a designer now'
};

function uxOccupants(room){
  const s=G.step;
  const withMarcus=['dark_pattern','crisis_fix','crisis_show'].indexOf(s)>=0;
  if(room==='lobby')     return [];
  if(room==='servicing') return [['kate',400,306,'down']];
  if(room==='creative')  return [['mike',260,258,'right'],['alex',560,268,'left']];
  if(room==='studio')    return [['jenny',400,196,'down']];
  if(room==='breakroom') return [['dan',650,268,'down']];
  if(room==='meeting')   return withMarcus?[['owen',400,196,'down']]:[];
  return [];
}

function uxScript(key){
  const s=G.step;

  /* ---------- the problem ---------- */
  if(key==='kate'&&s==='ux_brief')
    return say('kate',`Nadia, product lead. Meridian does scheduling for clinics, studios and garages, and the thing our customers' customers actually touch is the booking flow. Four steps. Sixty-one per cent of people who start it don't finish. Support think it's step three. Sales think it's the price shown at the end. The CEO thinks it's the colour of the button.`,
      [{label:'And what do you think?',go:function(){
        say('kate',`That three people have three theories and nobody has watched anyone do it. Ravi's on the floor. He'll stop you opening Figma, which is the most useful thing anyone will do for you today.`,
          [{label:'On my way.',go:function(){ advance('research'); }}]);
      }}]);

  /* ---------- 1. research ---------- */
  if(key==='mike'&&s==='research'){
    return choose('mike',
      `Ravi, design lead. Sixty-one per cent abandon and we have three theories in the building. How do you find out which one is right?`,
      [
       {label:`Send a survey to everyone who abandoned, asking what put them off.`,ok:false,
        note:`The people who abandoned have left. The few who answer will tell you a tidy story they invented afterwards, because nobody remembers why they gave up — they remember that they did. Again.`},
       {label:`Get five real customers to book an appointment while you watch and say nothing, and see where their hands stop.`,ok:true},
       {label:`Take all three theories to the team and have the discussion properly in a workshop.`,ok:false,
        note:`Six people with opinions and no evidence. The loudest theory wins and you've spent an afternoon deciding nothing. Again.`}
      ],function(){
        filed('Usability sessions','Meridian booking flow','Five people, one real task, no leading questions');
        advance('ia_labels','mike',`Good. Research is watching behaviour, not collecting opinions — people are unreliable narrators of their own clicking. Five is enough to find most of it; you're not measuring, you're finding out. And four of your five stopped dead in the same place, which Theo has been telling everyone about for a year.`);
      });
  }

  /* ---------- 2. labels and IA ---------- */
  if(key==='dan'&&s==='ia_labels'){
    return choose('dan',
      `Theo. I take the support calls that come through here. Step three is called "Manage availability" and what it actually does is let you pick a time. People ring us to ask what it means. Forty-odd times, by my count.`,
      [
       {label:`Add a tooltip on the heading explaining what the step does.`,ok:false,
        note:`A tooltip is a note apologising for your label. Nobody hovers over a heading when they're trying to book a haircut. Again.`},
       {label:`Rename it to what people call it — "Choose a time" — and use their words for the other steps too.`,ok:true},
       {label:`Write a help-centre article and link it from the step.`,ok:false,
        note:`You've built a manual for a four-step form. If people have to read something to get past a label, the label is the bug. Again.`}
      ],function(){
        filed('Naming pass','Meridian booking flow','Steps renamed in customers\u2019 words, tooltips deleted');
        advance('states','dan',`Thank you. Forty calls, one word. "Manage availability" is what it's called in our database, and the database is not a customer. Ravi wants you back — apparently your screens only show one version of the world.`);
      });
  }

  /* ---------- 3. states ---------- */
  if(key==='mike'&&s==='states'){
    return choose('mike',
      `Eleven screens, all beautiful, all showing a clinic with three practitioners and six free slots this week. What happens when a new salon has no availability set up yet, when the slots are still loading, when the payment fails, and when a physio has four hundred slots in one week?`,
      [
       {label:`Design the happy path now and let engineering handle the edge cases as they come up.`,ok:false,
        note:`Then a developer will invent them at half past four on a Friday, and your empty screen will say "No data". Those aren't edge cases — the empty state is the first thing every new customer ever sees. Again.`},
       {label:`Design empty, loading, error and too-much as first-class screens, with words for each, before anything gets built.`,ok:true},
       {label:`Add a generic error component and a spinner that can be reused anywhere.`,ok:false,
        note:`A spinner and a shrug. "Something went wrong" tells a person nothing about whether to try again, wait, or ring you. Again.`}
      ],function(){
        filed('State coverage','Meridian booking flow','Empty, loading, error and overflow designed and written');
        advance('forms','mike',`Right. The empty state is onboarding, the error state is support, and the overflowing one is your biggest customer. All three get seen more than the screenshot you'd put in a case study. Jen's in Ops and she has the form open.`);
      });
  }

  /* ---------- 4. forms ---------- */
  if(key==='jenny'&&s==='forms'){
    return choose('jenny',
      `Jen, design systems. Your booking form: fourteen fields in two columns, validation on submit, and it clears the whole thing when it fails. The postcode field rejects lowercase and the phone field rejects spaces. Four of your five testers failed here. Fix it.`,
      [
       {label:`Keep the fourteen fields but validate inline and stop clearing the form on error.`,ok:false,
        note:`Better, and still fourteen fields to book a massage. Half of them are things we could ask after the booking exists, or not at all. Again.`},
       {label:`One column, only the fields needed to make the booking, inline validation that never clears what they typed, and accept whatever shape they write a postcode or phone number in and normalise it ourselves.`,ok:true},
       {label:`Split the fourteen fields across three shorter steps so each screen feels light.`,ok:false,
        note:`Same fourteen fields, now with three chances to give up and a progress bar to demoralise them. Shorter screens is not the same as less asking. Again.`}
      ],function(){
        filed('Form redesign','Meridian booking flow','One column, fewer fields, inline validation, input normalised not rejected');
        advance('a11y','jenny',`That's it. Two columns makes people's eyes zigzag, every field is a question you're making someone answer, and rejecting a lowercase postcode is us being lazy and calling it their mistake. Now — put the mouse down and try to book something.`);
      });
  }

  /* ---------- 5. accessibility that isn't contrast ---------- */
  if(key==='jenny'&&s==='a11y'){
    return choose('jenny',
      `Keyboard only, from the top. Tab goes to the footer before the form because of the source order, the date picker can't be operated without a mouse at all, the confirmation modal doesn't trap focus so tab wanders off behind it, and the three icon buttons are announced as "button, button, button". Your contrast all passes, mind.`,
      [
       {label:`Add aria-labels to the icon buttons and aria-hidden to the background when the modal opens.`,ok:false,
        note:`You've named three buttons and papered over the modal. The date picker — the actual point of the product — still cannot be used at all. Again.`},
       {label:`Fix the focus order in the markup, make the date picker fully operable by keyboard with visible focus, trap and return focus in the modal, and give every control a real accessible name.`,ok:true},
       {label:`Run the automated accessibility checker and clear everything it flags.`,ok:false,
        note:`It flags about a third of this and nothing that matters most. An automated pass is a spellcheck, not a proofread. Again.`}
      ],function(){
        filed('Accessibility pass','Meridian booking flow','Focus order, keyboard operability, focus trap, accessible names');
        advance('disclosure','jenny',`Good. Contrast is the easy half and the half tools can see. Whether a person can get through your flow with a keyboard is the other half, and it's the half that decides whether they can book at all. Ravi's got a screen with eleven things on it.`);
      });
  }

  /* ---------- 6. progressive disclosure ---------- */
  if(key==='mike'&&s==='disclosure'){
    return choose('mike',
      `The manage-booking screen. Eleven options, all visible, all the same size: reschedule, cancel, add a note, invite a second guest, change practitioner, repeat weekly, export, print, add to calendar, request a reminder, share. Support say ninety per cent of visits to this screen are people trying to cancel or move. What do you do?`,
      [
       {label:`Group all eleven into three labelled sections so the screen reads as an organised list.`,ok:false,
        note:`Tidy and still eleven. You've organised the haystack. The two things nearly everyone wants are still one of eleven equal choices. Again.`},
       {label:`Put reschedule and cancel first and obvious, collapse the rest behind one "More options", and order what's left by how often it's actually used.`,ok:true},
       {label:`Hide the advanced options — including cancel — behind "More", so the screen is clean.`,ok:false,
        note:`You've hidden the thing people came for to make the page look calm, which is how a design decision quietly becomes a dark pattern. Again.`}
      ],function(){
        filed('Disclosure','Meridian booking flow','Ordered by frequency of need, not by tidiness');
        advance('dark_pattern','mike',`Yes. Progressive disclosure is about what people need, not what looks calm in a portfolio — hiding the common thing is the same mistake as showing everything, with better press. Marcus wants you in the war room. Be careful.`);
      });
  }

  /* ---------- 7. the request you should not simply obey ---------- */
  if(key==='owen'&&s==='dark_pattern'){
    return choose('owen',
      `Marcus, growth. Love the new flow, genuinely. One ask: move cancel off that screen, put it two clicks deeper behind a confirmation, maybe make the "keep my booking" button the big green one. Other companies do it. Churn's up four points and the board meets Thursday.`,
      [
       {label:`"Fair enough — I'll bury the cancel button behind a confirm step."`,ok:false,
        note:`(You've made cancelling harder and changed nobody's mind. They'll cancel by ringing Theo, or by charging it back, and they will tell people. Again.)`},
       {label:`"That'll cost us more than it saves — but before I argue, what result do you actually need, and do we know what the people who cancel have in common?"`,ok:true},
       {label:`"That's a dark pattern and I'm not designing it. There's regulation about this now."`,ok:false,
        note:`Noted. I'll ask someone else, then, and you'll find out what got shipped in April.  (You were right and you're now outside the conversation. Again.)`},
       {label:`"I'll A/B test it — if it reduces churn we ship it, if not we don't."`,ok:false,
        note:`It will reduce cancellations this month, because friction always does, and the test will tell you nothing about the refund requests in March. Some things are measurable and still wrong. Again.`}
      ],function(){
        say('owen',`...I need four points of churn back, is what I need. And no, I don't know what they have in common. I assumed they'd found someone cheaper.`,
          [{label:'Let me look.',go:function(){
            say('owen',`Theo pulled the cancellation reasons while you were downstairs. Half of them are seasonal — swim schools, ski hire, wedding florists — and they all say some version of "we'll be back in the spring". They're not leaving. They're closing for the winter and cancelling is the only button we gave them.`,
              [{label:'Then we gave them the wrong button.',go:function(){
                filed('Request, translated','Meridian','The churn was seasonal pausing with no pause option');
                startClock(90);
                say('kate',`Which is the right answer and a terrible moment for it — the board pack locks in ninety seconds and Marcus presents Thursday. Ravi's on the floor. Go.`,
                  [{label:'Go.',go:function(){ G.step='crisis_fix'; paintHUD(); closeDlg(); }}]);
              }}]);
          }}]);
      });
  }

  if(key==='mike'&&s==='crisis_fix'){
    return choose('mike',`Talk fast. What's the change?`,[
      {label:`Design the whole subscription-management area properly — pause, resume, billing holidays, the lot.`,ok:false,
       note:`Three weeks of work and nothing in the pack. We have ninety seconds. Again.`},
      {label:`Add "pause until a date" to the cancel screen, above cancel, with the resume date in plain words — and leave cancel exactly where it is.`,ok:true},
      {label:`Keep cancel where it is but add a "are you sure? you'll lose your history" step to slow people down.`,ok:false,
       note:`That's Marcus's original ask wearing a coat. You'd be adding friction to a door people are walking through for a reason. Again.`}
    ],function(){
      advance('crisis_show','mike',`Drawn, written, in the pack with eleven seconds spare. One option, on the screen people already reach, above the destructive one and not instead of it. Go and show him.`);
    });
  }

  if(key==='owen'&&s==='crisis_show'){
    stopClock();
    return say('owen',`So they press pause, and in April they come back on their own. And cancel's still right there.`,
      [{label:'Exactly where it was.',go:function(){
        say('owen',`I asked four designers to hide that button. You're the first one who asked me what I was actually trying to fix.`,
          [{label:'...',go:function(){
            say('kate',`That's the job. Not the grid, not the components — that. Someone hands you a solution dressed as a request, and your instinct was to go and find out what was underneath it. Seven pieces of work, five real users watched, and a board pack you didn't miss. You're a designer now.`,
              [{label:'Thank you.',go:function(){ G.step='complete'; paintHUD(); closeDlg(); openCertificate(); }}]);
          }}]);
      }}]);
  }

  /* ---------- Sam: hints ---------- */
  if(key==='alex'){
    const h={
      ux_brief:`Nadia's in Product. Ask what people do, not what the team thinks.`,
      research:`Three theories, no evidence. Go and watch somebody's hands.`,
      ia_labels:`If people need an explanation to get past a word, the word is the bug.`,
      states:`Every new customer sees your empty state before they see anything you'd screenshot.`,
      forms:`Every field is a question you're making a stranger answer. Count them again.`,
      a11y:`Put the mouse down and try to book something. That's the test.`,
      disclosure:`Ninety per cent come to cancel or move. Design for the ninety.`,
      dark_pattern:`He's asking for a solution. Find out what result he needs.`,
      crisis_fix:`Smallest change that answers the real problem, and don't touch cancel.`,
      crisis_show:`Go and show him — he hasn't seen it.`,
      complete:`You talked growth out of a dark pattern with evidence. Pub?`
    };
    return say('alex', h[s] || `Stuck? Say what the person is trying to get done, in their words, and start there.`);
  }

  const idle={
    kate:`Nothing new — go and finish what you've got.`,
    mike:`Bring it back when you can tell me what the empty version looks like.`,
    jenny:`Bring me something I can use with a keyboard and we'll get on fine.`,
    dan:`Kettle's on. Phones have been quieter since you fixed that label, mind.`,
    owen:`I'll wait. Board's Thursday, though.`
  };
  say(key, idle[key] || `...`);
}

TRACK_DEFS.ux={
  id:'ux', name:'UX Design', title:'UX Chronicles',
  blurb:'Sixty-one per cent abandon the flow, three people have theories, and nobody has watched anyone use it.',
  first:'ux_brief',
  roles:{mike:'Design Lead', kate:'Product Lead', jenny:'Design Systems & Accessibility',
         alex:'Senior Designer', dan:'Support Lead',
         owen:'Head of Growth', player:'The new designer'},
  script:function(key){ return uxScript(key); },
  occupants:function(room){ return uxOccupants(room); },
  objectives:OBJ_UX,
  opening:{text:`Nine in the morning at Meridian. Sixty-one per cent of the people who start a booking never finish it, three colleagues have three theories about why, and the board pack locks at five.`,
           label:'Find Nadia.'},
  certTitle:'UX CHRONICLES',
  timeUp:{who:'kate',line:`Pack's locked. Marcus presents what was already in it, which means we do this again in a quarter. Finish it anyway — missing a deadline is survivable; not knowing what you would have drawn is not.`},
  certBody:['redesigned the Meridian booking flow from five usability sessions — naming,',
            'states, forms, keyboard access and disclosure — and turned a request to hide',
            'the cancel button into a pause option that kept it exactly where it was.'],
  lessons:[
    {t:'Research is watching, not asking', c:'Discovery',
     l:'People are unreliable narrators of their own clicking. Five people attempting the real task beats two thousand survey answers about preference.'},
    {t:'If the label needs explaining, the label is the bug', c:'Naming',
     l:'A tooltip is a note apologising for your wording. Use the words customers use, not the ones in your database.'},
    {t:'Empty, loading, error and too-much are the product', c:'States',
     l:'Every new customer meets your empty state first, support meets your error state, and your biggest account meets the overflowing one. Design and write all four.'},
    {t:'Every field is a question you are making someone answer', c:'Forms',
     l:'One column, only what the task needs now, and ask the rest later or not at all.'},
    {t:'Never reject what you could normalise', c:'Forms',
     l:'A lowercase postcode or a spaced phone number is us being lazy and calling it their mistake. Validate inline, and never clear what they typed.'},
    {t:'Accessibility is mostly not contrast', c:'Accessibility',
     l:'Focus order, keyboard operability, focus trapped and returned in modals, a real name on every control. The automated checker is a spellcheck, not a proofread.'},
    {t:'Disclose by need, not by tidiness', c:'Hierarchy',
     l:'Showing eleven equal options and hiding the one people came for are the same mistake. Order by how often something is actually needed.'},
    {t:'Friction is not persuasion', c:'Ethics',
     l:'Making the exit harder reduces this month\u2019s cancellations and produces chargebacks, support calls and the story people tell about you.'},
    {t:'Measurable is not the same as right', c:'Ethics',
     l:'A dark pattern will win its A/B test. The test cannot see the refund request in March or the review in June.'},
    {t:'A request is usually a solution in disguise', c:'Stakeholders',
     l:'Ask what result they need and what the affected people have in common. "Hide the cancel button" was four points of seasonal pausing.'}
  ]
};


