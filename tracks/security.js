/* Track: Security Chronicles
   A track owns its people, its objectives, its step machine and its lessons.
   `TRACK_CONFIG` below overrides engine/defaults.js and the world for THIS GAME
   ONLY — the place to change one game without touching the other eight. */
window.TRACK_CONFIG={
  menuLede:"A day on a product team, and a notice designed to say nothing."
};

const CAST={
 mike:{name:'Ravi', role:'Security Lead', where:'Engineering',
   accent:'#fbbf24', top:'#c9852f', topDk:'#a06a22', style:'overshirt', tee:'#f2ece0',
   legs:'#33405c', legsDk:'#26314a', shoe:'#e8e2d6',
   skin:'#c98a56', skinDk:'#a26c3f', hair:'#5a5148', hairHi:'#7d7266', cut:'curls',
   specs:true, prop:'notebook', build:1.04, bw:23, beard:true},
 kate:{name:'Nadia', role:'CTO', where:'Product',
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
 dan:{name:'Theo', role:'IT & Support', where:'Kitchen',
   accent:'#a78bfa', top:'#7d9070', topDk:'#5f6f54', style:'tee', tee:'#7d9070',
   legs:'#3f4a5c', legsDk:'#2f3747', shoe:'#f2ece0',
   skin:'#a0673a', skinDk:'#7d4c28', hair:'#22201d', hairHi:'#3a352d', cut:'beanie',
   specs:false, prop:'mug', build:1.02, bw:21, beard:true},
 player:{name:'You', role:'The new security engineer', where:'Reception',
   accent:'#e4ded2', top:'#4a6a86', topDk:'#3a5468', style:'overshirt', tee:'#f2ece0',
   legs:'#33405c', legsDk:'#26314a', shoe:'#e8e2d6',
   skin:'#c08a5e', skinDk:'#9c6c45', hair:'#241c16', hairHi:'#3c2f24', cut:'short',
   specs:false, prop:null, build:1.0, bw:20, beard:false}
};
/* ==========================================================================
   DESIGN FUNDAMENTALS TRACK — content only
   ========================================================================== */

CAST.owen={name:'Ellis', role:'Head of Communications', where:'War Room',
   accent:'#f472b6', top:'#5c4a63', topDk:'#453749', style:'knit', tee:'#e6edf3',
   legs:'#2c2a26', legsDk:'#1f1e1b', shoe:'#e8e2d6',
   skin:'#c98a56', skinDk:'#a26c3f', hair:'#2b1f18', hairHi:'#463228', cut:'undercut',
   specs:true, prop:'coffee', build:0.98, bw:20, beard:false};

const OBJ_SEC={
  sec_brief:'Get the pen test report from Nadia in Product',
  threat_model:'Ravi is on the Engineering floor — model it before you fix anything',
  authz:'Back to Ravi. Finding number one',
  secrets:'Jen in Ops, and somebody has already force-pushed',
  phishing:'Theo in the Kitchen, about the invoice email',
  logging:'Jen again — read what we are actually writing to the log service',
  vendor:'Theo has two questionnaires and no time',
  incident:'Ops. Now. One token, forty thousand requests',
  disclosure:'Ellis is waiting in the War Room',
  crisis_fix:'Engineering. Ravi. Quickly',
  crisis_show:'Back to Ellis in the War Room',
  complete:'You are a security engineer now'
};

function secOccupants(room){
  const s=G.step;
  const withEllis=['disclosure','crisis_fix','crisis_show'].indexOf(s)>=0;
  if(room==='lobby')     return [];
  if(room==='servicing') return [['kate',400,306,'down']];
  if(room==='creative')  return [['mike',260,258,'right'],['alex',560,268,'left']];
  if(room==='studio')    return [['jenny',400,196,'down']];
  if(room==='breakroom') return [['dan',650,268,'down']];
  if(room==='meeting')   return withEllis?[['owen',400,196,'down']]:[];
  return [];
}

function secScript(key){
  const s=G.step;

  /* ---------- the report ---------- */
  if(key==='kate'&&s==='sec_brief')
    return say('kate',`Nadia, CTO. Three things landed this morning. A pen test report with eleven findings. A two-hundred-question security questionnaire from a customer who wants to sign next week. And Jen says there's something odd in the API logs that she doesn't like the shape of.`,
      [{label:'Which one is urgent?',go:function(){
        say('kate',`Ask me again at lunchtime. Ravi's on the floor — start with him, and start by modelling the thing rather than working down the report in the order a consultant typed it.`,
          [{label:'On my way.',go:function(){ advance('threat_model'); }}]);
      }}]);

  /* ---------- 1. threat modelling ---------- */
  if(key==='mike'&&s==='threat_model'){
    return choose('mike',
      `Ravi, security lead. Before we touch the findings: the bookings export is new and it hands customer data to whoever asks nicely. How do you model it?`,
      [
       {label:`Work through the OWASP Top Ten against it and check each item off.`,ok:false,
        note:`A checklist tells you about categories of bug. It won't tell you that our export runs as a service account with read access to every tenant. Again.`},
       {label:`Walk the data flow — what data, crossing which trust boundaries, reachable by whom — then ask for each boundary what someone could do, what stops them, and what we would see if they did it.`,ok:true},
       {label:`Wait for the pen test findings on it — they've just tested the whole product.`,ok:false,
        note:`A pen test is a sample of what one person found in eight days. It is evidence, not a model. Again.`}
      ],function(){
        filed('Threat model','Meridian export','Data flows, trust boundaries, and what we would detect at each one');
        advance('authz','mike',`Good. Threat modelling is data flows and trust boundaries, not an encyclopaedia of attacks — and "what would we see" matters as much as "what could they do", because most of this job is noticing. Which brings us to finding number one.`);
      });
  }

  /* ---------- 2. authorisation ---------- */
  if(key==='mike'&&s==='authz'){
    return choose('mike',
      `Finding one. GET /api/bookings/1042 returns a booking. Any authenticated user can request any ID and get somebody else's — a different clinic's patient name, time and phone number. The IDs are sequential. Fix it.`,
      [
       {label:`Switch the IDs to UUIDs so they can't be guessed or enumerated.`,ok:false,
        note:`Now they're unguessable and still returned to anyone who has one — and they leak in referrers, support tickets and shared links. You've made the hole harder to find. Again.`},
       {label:`Authorise every request server-side against the caller's tenant, deny by default, and add a test that a token from tenant A gets a 404 for tenant B's booking.`,ok:true},
       {label:`Stop exposing the ID in the UI and filter the list endpoint so people can't discover other IDs.`,ok:false,
        note:`The UI is not the client you have to worry about. The endpoint is the product. Again.`}
      ],function(){
        filed('Access control fix','Meridian API','Tenant-scoped authorisation server-side, deny by default, regression test added');
        advance('secrets','mike',`Right. Being logged in is not the same as being allowed, and that confusion is the single most common serious bug in every product I have ever reviewed. The test is the half that keeps it fixed. Jen's in Ops and somebody has already made her day worse.`);
      });
  }

  /* ---------- 3. secrets ---------- */
  if(key==='jenny'&&s==='secrets'){
    return choose('jenny',
      `Jen, platform. Someone found an AWS access key committed to the repo fourteen months ago. It's been removed and force-pushed already, and the developer says we're fine now. Are we?`,
      [
       {label:`Yes — it's out of the history, so there's nothing left to find.`,ok:false,
        note:`Fourteen months on a repo with contractors, forks, three laptops and a CI cache. That key is public and has been all year. Again.`},
       {label:`No — rotate the credential first, then check what it was used for in the logs, assume it's compromised for the whole period, and clean the history afterwards as tidying rather than as the fix.`,ok:true},
       {label:`Rewrite the history properly with a history-scrubbing tool and add a secrets scanner to pre-commit.`,ok:false,
        note:`Both good, neither urgent, and the key is still live while you do them. Rotate first. Again.`}
      ],function(){
        filed('Secret rotation','Meridian infrastructure','Key rotated and usage reviewed; history cleanup treated as tidying, not remediation');
        advance('phishing','jenny',`Correct, and it was used twice from an address in a hosting range last March, which we will be coming back to. A committed secret is compromised at the moment of the commit — deleting it removes the evidence, not the exposure. Theo wants you about an email.`);
      });
  }

  /* ---------- 4. people ---------- */
  if(key==='dan'&&s==='phishing'){
    return choose('dan',
      `Theo, IT. Someone in finance got an invoice email that looked exactly like our supplier, right down to the thread history, and nearly paid it. She spotted it and rang me. The plan on the table upstairs is mandatory annual training and a monthly leaderboard of who clicked.`,
      [
       {label:`Run the training and the leaderboard — people need to feel the consequences or they don't take it seriously.`,ok:false,
        note:`Then the next person who clicks won't ring me, they'll sit on it and hope. Naming people buys you silence, and silence is the expensive part. Again.`},
       {label:`Make reporting easy and blameless, thank her publicly for ringing, and put in controls that don't depend on anyone being sharp — phishing-resistant MFA, a callback rule on payment detail changes, DMARC enforced — and measure reporting rate rather than click rate.`,ok:true},
       {label:`Block all external email attachments and links from unrecognised domains.`,ok:false,
        note:`And within a week everybody's forwarding invoices to their personal accounts to get any work done. A control people route around is worse than none, because now you can't see it. Again.`}
      ],function(){
        filed('Human controls','Meridian','Blameless reporting, phishing-resistant MFA, payment callback rule, DMARC enforced');
        advance('logging','dan',`Thank you. She's the control that worked — reward that and you get told about the next one in ten minutes rather than ten days. Jen wants you to read what we're writing to the log service, by the way. Bring a coffee.`);
      });
  }

  /* ---------- 5. logging ---------- */
  if(key==='jenny'&&s==='logging'){
    return choose('jenny',
      `Our export endpoint logs its full response payload — patient names, phone numbers, appointment reasons — to a third-party log service, four hundred days' retention, and about thirty people here can search it. We also have no alert on repeated authorisation failures. Sort out the priorities.`,
      [
       {label:`Encrypt the logs at rest and tighten who can query the log service.`,ok:false,
        note:`You've put a better lock on a room we should never have filled. It's still four hundred days of patient data in a vendor we don't control. Again.`},
       {label:`Stop logging the payload — log identifiers and outcomes, not content — cut retention to what we actually investigate with, and add alerting on repeated authorisation failures and unusual export volume.`,ok:true},
       {label:`Keep the logs — you can't investigate what you didn't record — and add the alerting on top.`,ok:false,
        note:`Investigation needs to know who called what and whether it failed. It does not need the patient's phone number. You're arguing for a breach in advance. Again.`}
      ],function(){
        filed('Logging pass','Meridian','Payload logging removed, retention cut, detection alerts added');
        advance('vendor','jenny',`That's it. A log store is a database of your worst secrets with none of the controls of a database — log for detection, not for hoarding. And an authorisation failure nobody is alerted on is a free enumeration tool. Theo's drowning in questionnaires.`);
      });
  }

  /* ---------- 6. vendors, both directions ---------- */
  if(key==='dan'&&s==='vendor'){
    return choose('dan',
      `Two forms. Theirs: two hundred questions from the customer who signs next week, and sales have pencilled "yes" against all of them. Ours: marketing want a new analytics SDK that reads the whole DOM on every page, including the booking form, and it sub-processes to two companies I've never heard of.`,
      [
       {label:`Answer theirs accurately, and approve the SDK — it's a standard analytics tool that half the industry uses.`,ok:false,
        note:`Half right. That SDK will read patient names out of the booking form and ship them to two subprocessors, and "everyone uses it" is not a data protection basis. Again.`},
       {label:`Answer theirs honestly — with compensating controls and dates where the answer is "not yet" — and for the SDK ask what data leaves, who can see it, what the subprocessors do, and configure it to capture nothing from that form, or decline it.`,ok:true},
       {label:`Answer theirs optimistically to get the deal signed, and fix the gaps in the following quarter.`,ok:false,
        note:`Those answers get attached to a contract. You'd be writing a lie with a legal consequence, and the gap will be found by the same audit that finds the incident. Again.`}
      ],function(){
        filed('Vendor review','Meridian','Questionnaire answered honestly with dated gaps; analytics SDK scoped away from patient data');
        advance('incident','dan',`Good. A questionnaire answered aspirationally is a contractual promise, and every vendor we add is a piece of our attack surface we don't run. Jen's shouting for you. Something about a token.`);
      });
  }

  /* ---------- 7. the incident ---------- */
  if(key==='jenny'&&s==='incident'){
    return choose('jenny',
      `This is the shape I didn't like. One API token, forty-one thousand requests over nine days, sequential booking IDs, spread across eleven tenants, from a hosting range. It's the token belonging to an account that trialled us in March. It is still working right now. What do you do first?`,
      [
       {label:`Revoke the token immediately, then work out what happened.`,ok:false,
        note:`Close, and you've just destroyed your own timeline — the token record tells us which tenants, which IDs and when, and some of that is in stores that roll over. Snapshot first. It's a minute. Again.`},
       {label:`Preserve the evidence first — snapshot the relevant logs and token records — then revoke, then scope exactly which records were returned successfully, keeping a written timeline as you go, and close the hole once containment holds.`,ok:true},
       {label:`Leave it running and monitor, so we can see what they do next and identify them.`,ok:false,
        note:`Nine days of patient data already and you'd like some more for the report? We are not a research project. Again.`}
      ],function(){
        filed('Incident handling','Meridian','Evidence preserved, token revoked, scope established, timeline kept contemporaneously');
        advance('disclosure','jenny',`Done. Snapshot, revoke, scope: one thousand four hundred and six bookings across eleven tenants, names, phone numbers and appointment reasons, nothing financial. Contain, preserve, scope, fix — in that order, and write the timeline while you can still remember it, because in three weeks you'll be quoting it to a regulator. Ellis is in the war room. Ellis has thoughts about wording.`);
      });
  }

  /* ---------- 8. disclosure ---------- */
  if(key==='owen'&&s==='disclosure'){
    return choose('owen',
      `Ellis, communications. Right. Draft says "a security incident involving a third-party integration". No mention of data, no numbers, and it goes out next Friday with the product update so it lands soft. Tell me that's fine.`,
      [
       {label:`"That's fine — it's technically accurate and we're not hiding anything."`,ok:false,
        note:`(It is technically accurate and it is a lie by construction. Eleven clinics will find their own audit logs before Friday, and then the story is the cover-up rather than the bug. Again.)`},
       {label:`"Before I redraft it — what are you actually trying to protect us from here? Churn, the press, or the regulator? Because those want different things and one of them has a seventy-two-hour clock on it."`,ok:true},
       {label:`"We have to disclose fully within 72 hours under GDPR, so that draft isn't an option."`,ok:false,
        note:`I'm sure you're right and you've told me nothing about what I should write instead. I'll send mine, then.  (You won the point and lost the pen. Again.)`}
      ],function(){
        say('owen',`...Churn, mostly. Two of those eleven are our biggest clinics and they'll go to procurement over this. And I'd rather not read our name in the trade press with the word "leak" next to it.`,
          [{label:'Then vagueness is the worst option you have.',go:function(){
            say('owen',`Go on.`,
              [{label:'Because they will find out from their own logs first.',go:function(){
                say('owen',`...and then it's a cover-up, not a bug. Yes. All right — what goes in it?`,
                  [{label:'Everything they need to act on, today.',go:function(){
                    filed('Disclosure reframed','Meridian','From vague and late to specific and early, because affected clinics have their own logs');
                    startClock(90);
                    say('kate',`And you have ninety seconds, because the seventy-two hours started when Jen confirmed scope and the notice has to be with the affected clinics before the regulator's. Ravi's on the floor. Go.`,
                      [{label:'Go.',go:function(){ G.step='crisis_fix'; paintHUD(); closeDlg(); }}]);
                  }}]);
              }}]);
          }}]);
      });
  }

  if(key==='mike'&&s==='crisis_fix'){
    return choose('mike',`Ninety seconds. What's in the notice?`,[
      {label:`Hold it until forensics are finished next week, then publish something complete and accurate.`,ok:false,
       note:`Complete, accurate and a week after the deadline, by which time two clinics have found it themselves. The notice does not have to be final, it has to be honest and useful. Again.`},
      {label:`What was accessed and over what dates, which clinics and how many records, what we have done, what we are still establishing, what they should tell their patients, and a named person to contact — plus the regulator inside seventy-two hours.`,ok:true},
      {label:`The full technical write-up of the vulnerability, so nobody can accuse us of hiding the detail.`,ok:false,
       note:`A root-cause analysis is for us and for later. A clinic manager needs to know whose data, when, and what to do this afternoon. Again.`}
    ],function(){
      advance('crisis_show','mike',`Sent to eleven clinics with eleven seconds spare, regulator notified, and a line saying what we're still working out — which is the line that makes the rest of it believable. Go and show Ellis.`);
    });
  }

  if(key==='owen'&&s==='crisis_show'){
    stopClock();
    return say('owen',`Names, dates, numbers, a person to ring. It's much worse reading and it's much better, isn't it.`,
      [{label:'And it is the version they can act on.',go:function(){
        say('owen',`Two of them have already replied to say thanks for telling us first. I have written nine of these and I have spent all nine of them trying to use fewer words. You're the first person to explain what the vagueness was costing me.`,
          [{label:'...',go:function(){
            say('kate',`That is the job. Not the CVE, not the pen test — that. Someone brings you wording designed to make a problem smaller, and you work out what they are frightened of before you argue with them. Seven pieces of work, an incident scoped without destroying the evidence, and a seventy-two-hour clock you did not miss. You're a security engineer now.`,
              [{label:'Thank you.',go:function(){ G.step='complete'; paintHUD(); closeDlg(); openCertificate(); }}]);
          }}]);
      }}]);
  }

  /* ---------- Sam: hints ---------- */
  if(key==='alex'){
    const h={
      sec_brief:`Nadia's in Product. Don't work the report in the order it was typed.`,
      threat_model:`Follow the data. Who can reach it, and what would we see if they did?`,
      authz:`Being logged in isn't being allowed. Unguessable isn't the same as protected.`,
      secrets:`Fourteen months. Assume it's public and act accordingly.`,
      phishing:`She rang Theo. Whatever you do, don't make the next person hesitate.`,
      logging:`Read what we log, then ask what an attacker would do with our log service.`,
      vendor:`Both forms are the same question: what data leaves, and who can see it.`,
      incident:`Snapshot before you revoke. You get one chance at the timeline.`,
      disclosure:`He's asking for words. Find out what he's frightened of.`,
      crisis_fix:`It doesn't have to be final. It has to be honest and useful today.`,
      crisis_show:`Go and show him — he hasn't seen it.`,
      complete:`You got comms to publish more detail voluntarily. Nobody does that. Pub?`
    };
    return say('alex', h[s] || `Stuck? Ask what an attacker would try next, and whether we'd notice.`);
  }

  const idle={
    kate:`Nothing new — go and finish what you've got.`,
    mike:`Bring it back when you can tell me what we'd detect.`,
    jenny:`Bring me something with an alert on it and we'll get on fine.`,
    dan:`Kettle's on. And she rang me, remember. That's the bit that worked.`,
    owen:`I'll wait. Clock's running, though.`
  };
  say(key, idle[key] || `...`);
}

TRACK_DEFS.security={
  id:'security', name:'Security', title:'Security Chronicles',
  blurb:'Eleven findings, a questionnaire nobody reads, and one token making forty thousand requests.',
  first:'sec_brief',
  roles:{mike:'Security Lead', kate:'CTO', jenny:'Platform / SRE',
         alex:'Senior Engineer', dan:'IT & Support',
         owen:'Head of Communications', player:'The new security engineer'},
  script:function(key){ return secScript(key); },
  occupants:function(room){ return secOccupants(room); },
  objectives:OBJ_SEC,
  opening:{text:`Nine in the morning at Meridian. A pen test report with eleven findings, a two-hundred-question questionnaire from a customer who signs next week, and something in the API logs that Jen does not like the shape of.`,
           label:'Find Nadia.'},
  certTitle:'SECURITY CHRONICLES',
  timeUp:{who:'kate',line:`Clock's gone. The clinics hear it from their own logs and we answer to the regulator late as well as second. Finish it anyway — missing a deadline is survivable; not knowing what you would have written is not.`},
  certBody:['handled a week at Meridian in a day — threat model, broken access control,',
            'a leaked key, phishing controls, logging, vendor review and a live incident —',
            'and turned a notice designed to say nothing into one eleven clinics could act on.'],
  lessons:[
    {t:'Threat modelling is data flows, not attack lists', c:'Design',
     l:'What data, crossing which trust boundaries, reachable by whom — and for each one, what would we actually see if somebody tried?'},
    {t:'Authenticated is not authorised', c:'Access control',
     l:'Check the caller against the tenant on every request, deny by default, and write the test that proves tenant A gets a 404 for tenant B.'},
    {t:'Unguessable is not protected', c:'Access control',
     l:'UUIDs stop enumeration and leak in referrers, tickets and shared links. Obscurity buys time, not control.'},
    {t:'A committed secret is compromised at the commit', c:'Secrets',
     l:'Rotate first, then review what it was used for. Rewriting history removes the evidence, not the exposure.'},
    {t:'Build controls that survive human error', c:'People',
     l:'Phishing-resistant MFA, callbacks on payment changes, enforced DMARC. And measure reporting rate, not click rate.'},
    {t:'Blame buys silence', c:'People',
     l:'Name the people who click and the next one sits on it and hopes. The person who rang IT is the control that worked.'},
    {t:'A log store is a database of your worst secrets', c:'Logging',
     l:'Log identifiers and outcomes, not payloads. Short retention. And alert on the things that indicate an attack — unalerted auth failures are a free enumeration tool.'},
    {t:'Your security includes your vendors', c:'Third parties',
     l:'Ask what data leaves, who can see it, and who they pass it to. An SDK that reads the DOM reads your patient form too.'},
    {t:'A questionnaire answered aspirationally is a contractual lie', c:'Third parties',
     l:'Say "not yet, here is the compensating control and the date". That answer gets attached to an agreement.'},
    {t:'Contain, preserve, scope, then fix', c:'Incidents',
     l:'Snapshot before you revoke — you get one chance at the timeline — and write it contemporaneously, because you will be quoting it to a regulator.'},
    {t:'Vague and late is the most expensive notice', c:'Disclosure',
     l:'Affected customers have their own logs. Specific and early makes it a bug; slow and careful makes it a cover-up.'}
  ]
};


