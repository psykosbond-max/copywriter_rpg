/* Track: Account Chronicles
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
   ACCOUNT MANAGEMENT TRACK
   Content only. No engine changes — same rooms, renderer, doors, dialogue.
   ========================================================================== */

/* The client. Same CAST fields the renderer already reads. */
CAST.priya={name:'Priya', role:'Marketing Manager, Kestrelbank', where:'Lobby',
  accent:'#e08265', top:'#8c5a4a', topDk:'#6d4437', style:'blazer', tee:'#f2ece0',
  legs:'#2c2a26', legsDk:'#1f1e1b', shoe:'#33302b',
  skin:'#b07a4c', skinDk:'#8d5c34', hair:'#1b1410', hairHi:'#352418', cut:'long',
  specs:true, prop:'tablet', build:1.0, bw:21, beard:false};

const OBJ_ACCOUNT={
  client_brief:'Priya from Kestrelbank is waiting in the Lobby',
  real_brief:'Take it to Kate in Servicing',
  brief_creative:'Brief Mike in Creative',
  scope_email:'Kate has something from the client',
  scope_cost:'Find out what it costs — Dan, Break Room',
  scope_reply:'Answer Priya in the Lobby',
  date_ask:'Priya is in the Lobby about the date',
  date_check:'Ask Jenny in the Studio what it takes',
  date_reply:'Go back to Priya with an answer',
  present_work:'Present the campaign in the Meeting Room',
  crisis_brief:'Kate needs you in Servicing. Now.',
  crisis_call:'Meeting Room. Call Priya.',
  complete:'You run the account now'
};

function accountOccupants(room){
  const s=G.step;
  const lobbyClient=['client_brief','scope_reply','date_ask','date_reply'].indexOf(s)>=0;
  const pitching=(s==='present_work'), calling=(s==='crisis_call');
  if(room==='lobby')     return lobbyClient?[['priya',400,300,'down']]:[];
  if(room==='servicing') return [['kate',400,306,'down'],['alex',620,240,'left']];
  if(room==='creative')  return [['mike',260,258,'right']];
  if(room==='studio')    return [['jenny',400,196,'down']];
  if(room==='breakroom') return [['dan',650,268,'down']];
  if(room==='meeting'){
    if(pitching) return [['priya',360,196,'down'],['mike',470,196,'down']];
    if(calling)  return [['priya',400,196,'down']];
    return [];
  }
  return [];
}

function accountScript(key){
  const s=G.step;

  /* ---------- 1. the brief that isn't a brief ---------- */
  if(key==='priya'&&s==='client_brief'){
    return choose('priya',
      `You must be the new one. Priya — marketing at Kestrelbank. Right, we need a TikTok campaign. Our competitors all have one and the board's been asking.`,
      [
       {label:`"Great — I'll get the creative team on it this week."`,ok:false,
        note:`Lovely. So... six videos? What are they for?  (You have just sold a deliverable nobody has justified. When it doesn't work, that will be your agency's failure, not her brief's. Try again.)`},
       {label:`"Before I take that back — what's the thing that's actually not working?"`,ok:true},
       {label:`"Honestly, TikTok's probably not right for a building society."`,ok:false,
        note:`...Right. Well, I've been here eleven years.  (You may even be correct. You have also told the client she is stupid in the first meeting. Being right is not the job. Try again.)`}
      ],function(){
        say('priya',`...Under-25 current account openings. Down about forty per cent in eighteen months. We're told we look like our parents' bank. TikTok was my best guess at a fix, not the fix itself. Budget's forty thousand, live by end of Q3.`,
          [{label:'That I can work with.',go:function(){
            advance('real_brief','priya',`Nobody's asked me that before. They usually just take the order.`);
          }}]);
      });
  }

  if(key==='kate'&&s==='real_brief')
    return say('kate',`Forty per cent is a business problem, not a channel problem. You went in to be told what to make and came out knowing what's broken — that's the whole job, and most people take three years to learn it.`,
      [{label:'So what now?',go:function(){
        filed('Client brief','Kestrelbank','Under-25 openings down 40% — not a TikTok problem');
        advance('brief_creative','kate',`Now you brief Mike. And he will take it apart, so make it worth his time.`);
      }}]);

  /* ---------- 2. briefing creative ---------- */
  if(key==='mike'&&s==='brief_creative'){
    return choose('mike',`Kestrelbank. Go on then — what am I solving?`,
      [
       {label:`"Client wants a TikTok campaign. Six videos, by the 30th."`,ok:false,
        note:`That's an order, not a brief. You've picked the channel, the format and the count before anyone's worked out what's wrong. If you want six videos, hire a production company. Again.`},
       {label:`"Under-25 openings down 40% in 18 months. They think we're their parents' bank. £40k, live end of Q3, has to work without a branch visit."`,ok:true},
       {label:`"They're down on under-25s and open to anything — see what you come up with."`,ok:false,
        note:`No constraints isn't freedom, it's three rounds of rejected work and a client who stops trusting us. Give me the edges. Again.`}
      ],function(){
        filed('Creative brief','Kestrelbank','Problem, evidence, constraints — channel left open');
        advance('scope_email','mike',`Now that's a brief. Problem, evidence, edges, and you've left the channel open so we can actually think. Give me a week.`);
      });
  }

  /* ---------- 3. scope creep ---------- */
  if(key==='kate'&&s==='scope_email')
    return say('kate',`Two weeks in and Priya's been in touch. "Can we also get a version for the branch screens? And a radio cut? Same deadline obviously."`,
      [{label:'Obviously.',go:function(){
        advance('scope_cost','kate',`Before you answer her — go and find out what that actually costs us. Answering a client before you know the number is how agencies lose money politely.`);
      }}]);

  if(key==='dan'&&s==='scope_cost')
    return say('dan',`Branch screens and a radio cut? Different masters, different ratios, separate audio mix, and the screens need the legal rate on them. Eleven days of studio. Not eleven hours — days.`,
      [{label:'Eleven.',go:function(){
        advance('scope_reply','dan',`Eleven. Go and tell her before she assumes it's free, because right now she does.`);
      }}]);

  if(key==='priya'&&s==='scope_reply'){
    return choose('priya',`Did you get my note? The branch screens and the radio thing. Straightforward enough, I'd have thought.`,
      [
       {label:`"Of course, no problem."`,ok:false,
        note:`Wonderful, thank you.  (You have just given away eleven days of studio time and taught her that everything after this is free too. Try again.)`},
       {label:`"Both are doable. They're outside the original scope, so I'll send a revised estimate and timeline today — and if you need something by the 30th, tell me which of the two matters more."`,ok:true},
       {label:`"That wasn't in the original scope."`,ok:false,
        note:`I'm aware of what was in the scope.  (True, and now you're the department of no. She heard an obstacle, not a partner. Try again.)`}
      ],function(){
        filed('Revised scope','Kestrelbank','Both priced, prioritised, and in writing');
        advance('date_ask','priya',`Send it over. The screens matter more than the radio, since you ask — nobody's ever asked me to choose before. They just quietly do one badly.`);
      });
  }

  /* ---------- 4. the date ---------- */
  if(key==='priya'&&s==='date_ask')
    return say('priya',`One more thing and then I'll leave you alone. The board meets Friday. I'd love to have the films to show them. That's doable, isn't it?`,
      [{label:'Let me check and come straight back.',go:function(){
        advance('date_check','priya',`Good answer. The last person said yes standing exactly where you are, and then didn't deliver.`);
      }}]);

  if(key==='jenny'&&s==='date_check')
    return say('jenny',`Friday? Three days. I need four for the edit — grade, sound, three cuts, and that's if nothing comes back. I can give you one finished cut by Friday, or all three by Tuesday. I can't give you three by Friday, and if you promise it I'll find out on Thursday night.`,
      [{label:'One by Friday or three by Tuesday.',go:function(){
        advance('date_reply','jenny',`That's the choice. It's hers to make, not yours.`);
      }}]);

  if(key==='priya'&&s==='date_reply'){
    return choose('priya',`Well? Friday?`,
      [
       {label:`"We'll make Friday work."`,ok:false,
        note:`Marvellous.  (You just committed Jenny's weekend without asking her. She'll do it, and you'll do it again next month, because you got away with it once. Try again.)`},
       {label:`"Friday, but one cut rather than three — or all three on Tuesday. Which serves the board better?"`,ok:true},
       {label:`"Production says four days, so Friday isn't possible."`,ok:false,
        note:`So that's a no, then.  (You relayed a constraint instead of solving a problem. She didn't hire you to forward messages. Try again.)`}
      ],function(){
        filed('Delivery plan','Kestrelbank','One cut Friday, full set Tuesday — client chose');
        advance('present_work','priya',`One on Friday. The board only needs to see the idea, not the whole campaign — I'll take the other two on Tuesday. See you in the meeting room.`);
      });
  }

  /* ---------- 5. defending work you didn't make ---------- */
  if(key==='priya'&&s==='present_work'){
    return choose('priya',
      `So that's the headline. "Your money, before you've got any." Hmm. I don't like it, if I'm honest. My husband wouldn't get it.`,
      [
       {label:`"Fair enough — we'll change it."`,ok:false,
        note:`(Mike's face does something complicated. You have just traded a strategically sound line for one man's opinion, and Mike will stop showing you work early. Try again.)`},
       {label:`"Can I ask what your husband would be doing when he saw it? It's built for someone scrolling at eleven at night who has never chosen a bank."`,ok:true},
       {label:`"The creative team are the experts here."`,ok:false,
        note:`Are they. Then why am I in the room?  (Hiding behind the department is not defending the work. You've told the client her opinion is unwelcome. Try again.)`}
      ],function(){
        filed('Campaign approved','Kestrelbank','Strategy defended, taste separated from brief');
        say('priya',`...He's fifty-one and he's banked with the same building society since he was nineteen. He is not who this is for, is he.`,
          [{label:'No.',go:function(){
            say('mike',`(Mike says nothing, but he will remember this.)`,
              [{label:'Continue.',go:function(){
                advance('crisis_brief','priya',`Run it. All of it. And send me the Tuesday cuts.`);
              }}]);
          }}]);
      });
  }

  if(key==='mike'&&s==='present_work')
    return say('mike',`(He's letting you take it. That's the test.)`);

  /* ---------- 6. the difficult call ---------- */
  if(key==='kate'&&s==='crisis_brief'){
    startClock(90);
    return choose('kate',
      `Stop. The branch screen version went live yesterday morning with last quarter's interest rate on it. One point one, not one point six. It's been on a hundred and forty screens for thirty-one hours. What do you do first?`,
      [
       {label:`Work out how it happened, then call her.`,ok:false,
        note:`Every minute on the story is a minute it's still live and a minute closer to her finding it herself. The post-mortem happens after. Again — what first?`},
       {label:`Call Priya now, with the fix already moving.`,ok:true},
       {label:`Get Jenny to pull it, then call once it's fixed.`,ok:false,
        note:`That's the tempting one, and it's the one that ends accounts. You'd arrive with good news and no credibility, because the first thing she asks is when you knew. Again.`}
      ],function(){
        advance('crisis_call','kate',`Go. Jenny's already pulling them — I did that while you were deciding. Meeting room, phone, now.`);
      });
  }

  if(key==='priya'&&s==='crisis_call'){
    return choose('priya',`This is a surprise. Everything alright?`,
      [
       {label:`"I'm so sorry, this is completely unacceptable and I take full responsibility —"`,ok:false,
        note:`...What's happened? What are we talking about?  (Thirty seconds of apology before she knows what for. She is now frightened as well as annoyed. Lead with the thing. Try again.)`},
       {label:`"The branch screens went out with the old rate. They're coming down now, corrected version up within the hour. Then I'll tell you exactly how it happened."`,ok:true},
       {label:`"There's been an issue at our end with the branch assets — the version control on the screen masters didn't pick up the rate change from —"`,ok:false,
        note:`I'm going to stop you. Is it fixed?  (You opened with the explanation. She can't hear any of it until she knows it's handled. Try again.)`}
      ],function(){
        stopClock();
        filed('Incident handled','Kestrelbank','Called first, led with the fix');
        say('priya',`Right. Right — thank you. Send me the corrected screen when it's up.`,
          [{label:'Within the hour.',go:function(){
            say('priya',`...You know the last agency had something similar. I found it myself, in a branch in Chester, eight days later. That's why they're the last agency.`,
              [{label:'Understood.',go:function(){
                say('kate',`That's the job. Not the campaign — that. The client didn't hire you to be perfect, they hired you to be the person who tells them first. Six things on the account and one bad morning handled properly. It's your account now.`,
                  [{label:'Thank you.',go:function(){ G.step='complete'; paintHUD(); closeDlg(); openCertificate(); }}]);
              }}]);
          }}]);
      });
  }

  /* ---------- Alex: hints ---------- */
  if(key==='alex'){
    const h={
      client_brief:`She's in the lobby. Whatever she asks for, find out what's underneath it before you agree to anything.`,
      real_brief:`Kate's right there. Tell her what the actual problem is, not what the client asked for.`,
      brief_creative:`Mike will reject an order. Give him the problem, the evidence and the edges — and don't pick the channel for him.`,
      scope_email:`Extra work is fine. Extra work you've already agreed to for free isn't.`,
      scope_cost:`Dan's in the break room. Never quote a client a number you haven't been given.`,
      scope_reply:`Yes to what she wants, priced. "No" and "of course" are both wrong answers.`,
      date_ask:`Don't answer that standing here. Go and ask the person who has to do the work.`,
      date_check:`Jenny will give you the real number. She always does, and people always ignore it.`,
      date_reply:`Give her the trade-off and let her pick. It's her launch.`,
      present_work:`You didn't write it, but you're selling it. Defend the thinking, not your feelings.`,
      crisis_brief:`Whatever it is — the first question is never "how did this happen".`,
      crisis_call:`Fix first, apology second, explanation last. In that order.`,
      complete:`You've had a worse first fortnight than I did. Drink?`
    };
    return say('alex', h[s] || `Stuck? Tell me what the client asked for and I'll tell you what they want.`);
  }

  const idle={
    kate:`Not now — go and deal with it, then tell me how it went.`,
    mike:`I'm working on your brief. Let me.`,
    jenny:`Bring me a date and I'll tell you if it's real.`,
    dan:`Kettle's on. Ask me before you promise anyone anything.`,
    priya:`I'll wait. Not for long, mind.`
  };
  say(key, idle[key] || `...`);
}

TRACK_DEFS.account={
    id:'account', name:'Account Management', live:true,
    title:'Account Chronicles',
    blurb:'A client who wants the wrong thing, an agency that has to build it, and you in between.',
    first:'client_brief',
    roles:{kate:'Account Director', alex:'Account Executive', mike:'Creative Director',
           jenny:'Production', dan:'Studio & estimates',
           priya:'Marketing Manager, Kestrelbank', player:'The new account manager'},
    script:function(key){ return accountScript(key); },
    occupants:function(room){ return accountOccupants(room); },
    objectives:OBJ_ACCOUNT,
    opening:{text:`Nine in the morning and there is already a client in the lobby, which is never a good sign. Priya, from Kestrelbank. She has been waiting eleven minutes.`,
             label:'Go over.'},
    certTitle:'ACCOUNT CHRONICLES',
    timeUp:{who:'kate',line:`Time. She has found it herself — a colleague sent her a photo of a branch screen. Go and call her anyway, and lead with the fix. Late is recoverable. Silent is not.`},
    certBody:['ran the Kestrelbank account for a fortnight — took the brief apart, briefed',
              'creative, priced the scope, held the date, defended work they did not make,',
              'and made the difficult call first.'],
    lessons:[
      {t:'Take the problem, not the order', c:'The first meeting',
       l:'Clients bring solutions. The ask is a symptom — find out what is actually not working before you agree to build anything.'},
      {t:'Never correct a client in the first meeting', c:'The first meeting',
       l:'You may be right. Being right is not the job. Curiosity gets you to the same place without spending the relationship.'},
      {t:'A brief is a problem with constraints', c:'Briefing creative',
       l:'Evidence, boundaries, and no pre-chosen solution. An order is not a brief, and no constraints is not freedom.'},
      {t:'Price it before you agree to it', c:'Scope creep',
       l:'Yes to the goal, no to the free work. Never quote a number you have not been given, and always put it in writing.'},
      {t:'Do not be the department of no', c:'Scope creep',
       l:'Offer the trade-off, not the obstacle. The client should hear a partner, not an objection.'},
      {t:'Never commit someone else\u2019s time', c:'The date',
       l:'Ask the person who has to do the work before you promise the date. They will do it once, and resent it for a year.'},
      {t:'Negotiate the date, not the quality', c:'The date',
       l:'Make the trade-off visible and let the client choose. It is their launch.'},
      {t:'Taste is not a brief', c:'The presentation',
       l:'Turn "I do not like it" into "who is this for" without telling anyone they are wrong. Defend the strategy, concede on preference.'},
      {t:'Tell them first', c:'The difficult call',
       l:'Call early and lead with the fix. The apology comes second, once. The explanation comes last. You are not paid to be perfect, you are paid to be the one who tells them.'}
    ]
  };


