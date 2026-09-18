/* Track: AI Chronicles
   A track owns its people, its objectives, its step machine and its lessons.
   The world it runs in (rooms, furniture, colourway) comes from worlds/agency.js,
   and everything else from engine/. */

window.TRACK_CONFIG={
  menuLede:"A day spent working out which forty per cent of the work a machine can have."
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

CAST.imogen={name:'Imogen', role:'Chief Marketing Officer, Wrenfield', where:'Lobby',
  accent:'#9b8cf0', top:'#4a4468', topDk:'#36314e', style:'blazer', tee:'#f2ece0',
  legs:'#2c2a26', legsDk:'#1f1e1b', shoe:'#33302b',
  skin:'#8d5f38', skinDk:'#6d4626', hair:'#1e1710', hairHi:'#3a2c1e', cut:'undercut',
  specs:true, prop:'tablet', build:1.0, bw:20, beard:false};

const OBJ_AI={
  ai_brief:'Imogen from Wrenfield is waiting in the Lobby',
  where_it_helps:'Take it to Kate in Servicing — which work, exactly',
  claim:'Jenny in the Studio has read the generated policy copy',
  voice:'Mike in Creative, about what the drafts sound like',
  data:'Dan in the Break Room, about what people are pasting in',
  synthetic:'Jenny again — the face in the new ad does not exist',
  saving:'Back to Kate. Whether any of it actually saved anything',
  present_plan:'Present the proposal to Imogen in the Meeting Room',
  crisis_live:'Decide. Now.',
  complete:'You lead on this now'
};

function aiOccupants(room){
  const s=G.step;
  const pitching=['present_plan','crisis_live'].indexOf(s)>=0;
  if(room==='lobby')     return s==='ai_brief'?[['imogen',400,300,'down']]:[];
  if(room==='servicing') return pitching?[['alex',620,240,'left']]
                                        :[['kate',400,306,'down'],['alex',620,240,'left']];
  if(room==='creative')  return [['mike',260,258,'right']];
  if(room==='studio')    return [['jenny',400,196,'down']];
  if(room==='breakroom') return [['dan',650,268,'down']];
  if(room==='meeting')   return pitching?[['imogen',360,196,'down'],['kate',470,196,'down']]:[];
  return [];
}

function aiScript(key){
  const s=G.step;

  /* ---------- 1. the brief under the brief ---------- */
  if(key==='imogen'&&s==='ai_brief'){
    return choose('imogen',
      `Imogen Baptiste, Wrenfield. Home and contents insurance, four hundred thousand policyholders. My board has asked me why our retainer is what it is when everybody now has AI. I would like you to use it and cut the number by forty per cent.`,
      [
       {label:`"Absolutely — we can bring AI into the workflow and pass the saving on."`,ok:false,
        note:`You have agreed a forty per cent cut before establishing what the work is. In three months you will be delivering the same volume at a loss with nobody checking the output. Again.`},
       {label:`"Which forty per cent? Show me the work you'd be happy for a machine to have, and I'll tell you honestly what it can take."`,ok:true},
       {label:`"AI can't do most of what we do — the quality would fall off a cliff."`,ok:false,
        note:`Defensive, and not entirely true. You have made it a fight about your fee rather than a conversation about the work. Again.`}
      ],function(){
        say('imogen',`...Honestly? Nobody has separated it out. The board said the word and I wrote it down. If you told me which parts it genuinely helps with, I could go back with something better than a percentage.`,
          [{label:'Then we start there.',go:function(){
            filed('Diagnosis','Wrenfield','Not a cost brief — a scope brief; nobody had separated the work');
            advance('where_it_helps','imogen',`Everyone tells me what it can do. Nobody has told me which of my problems it is for.`);
          }}]);
      });
  }

  /* ---------- 2. where it actually helps ---------- */
  if(key==='kate'&&s==='where_it_helps'){
    return choose('kate',
      `Here's what we do for Wrenfield in a month. Eight hundred paid social variants. Synthesis of four hundred customer service transcripts. The quarterly positioning. Response to a competitor undercutting them. Which of those goes to the machine?`,
      [
       {label:`"All of it, with a human review step at the end of each."`,ok:false,
        note:`Review is not a step you add to the end of everything. Put positioning through a model and you get the average of what everyone else has already published, then pay someone to explain why it is wrong. Again.`},
       {label:`"The eight hundred variants and the transcript synthesis. The positioning and the competitor response are judgment under uncertainty, which is the part that is not a text problem."`,ok:true},
       {label:`"None of it yet — let's pilot on something internal with no client exposure."`,ok:false,
        note:`Safe, and it answers nothing. She has a board meeting, not a research budget. You have deferred the decision and called it caution. Again.`}
      ],function(){
        filed('Scope','Wrenfield','Volume and synthesis to the model; judgment work stays human');
        advance('claim','kate',`Volume and synthesis. Which is real — that is most of the hours and almost none of the thinking. Now go and look at what came back. Jenny has read the policy copy and she has gone a bit quiet.`);
      });
  }

  /* ---------- 3. the confident false claim ---------- */
  if(key==='jenny'&&s==='claim'){
    return choose('jenny',
      `Four hundred and twelve generated variants for the contents product. Nineteen of them say some version of "covers accidental damage as standard". It does not. That is a six-pound-a-month add-on. The copy is fluent, it is on brand, and it is a lie that would be sold to four hundred thousand people.`,
      [
       {label:`"Tighten the prompt with the exact policy wording and regenerate."`,ok:false,
        note:`Better prompting reduces the rate. It does not make the output trustworthy, and you have just described a process with no one accountable for the nineteenth mistake. Again.`},
       {label:`"Regenerate with the policy wording, and nothing about cover gets published without a named person signing it — the model drafts, a human is responsible."`,ok:true},
       {label:`"Route everything through the compliance team before it goes out."`,ok:false,
        note:`Half right, and you have just moved eight hundred variants a month onto two people who did not agree to it. A review gate nobody can staff is a rubber stamp by the second week. Again.`}
      ],function(){
        filed('Controls','Wrenfield','Named human sign-off on any claim about cover; model drafts only');
        advance('voice','jenny',`A name against it. Not a team, a person — because "the process approved it" is not a sentence anybody can say to a regulator. Mike has been reading the rest of them and he wants a word about how they sound.`);
      });
  }

  /* ---------- 4. voice ---------- */
  if(key==='mike'&&s==='voice'){
    return choose('mike',
      `They're clean. Grammatical. Every one of them says "peace of mind" and "in today's fast-paced world". Wrenfield's whole thing was that they answer the phone in Carlisle and they will send a man out on a Sunday. None of that survived. Why not?`,
      [
       {label:`"The prompt needs the tone-of-voice guidelines pasted in."`,ok:false,
        note:`You have fed it three adjectives. It will produce a fluent average that uses those adjectives. The specifics were never in the prompt to lose. Again.`},
       {label:`"Because it writes toward the middle of everything ever written about insurance, and the man in Carlisle on a Sunday is a fact it was never given."`,ok:true},
       {label:`"Fine-tune a model on Wrenfield's back catalogue."`,ok:false,
        note:`An expensive way to average their own past work, most of which was the generic stuff we have spent two years getting rid of. Again.`}
      ],function(){
        filed('Voice','Wrenfield','Drafting brief carries the specifics — names, places, promises — not adjectives');
        advance('data','mike',`It cannot invent the thing that makes them them, so we have to hand it over. Specifics in, not adjectives. Dan has been watching what people are actually pasting into these things, and it is worse than the copy.`);
      });
  }

  /* ---------- 5. what goes into the prompt ---------- */
  if(key==='dan'&&s==='data'){
    return choose('dan',
      `Two things. Somebody on the account pasted a spreadsheet of nine hundred claims into a free chatbot to get the themes out. Names, postcodes, claim values. And the transcript synthesis you just approved is four hundred real phone calls. What do we do?`,
      [
       {label:`"Tell the team not to use free tools and carry on with the transcripts."`,ok:false,
        note:`A reminder in a channel nobody reads. And you waved through four hundred recordings of people describing a burglary without asking what happens to them. Again.`},
       {label:`"Strip the identifying details before anything goes in, use a tool with terms we've actually read, and tell Wrenfield about the spreadsheet today."`,ok:true},
       {label:`"Get a paid enterprise account so the data isn't used for training."`,ok:false,
        note:`Necessary, not sufficient, and it does nothing about the nine hundred people whose postcodes have already gone. You have bought a subscription instead of making a disclosure. Again.`}
      ],function(){
        filed('Data handling','Wrenfield','Identifiers stripped, reviewed terms, and the existing exposure disclosed same day');
        advance('synthetic','dan',`Strip it, read the terms, and ring the client about the one that already happened — today, not in the quarterly. The bit people get wrong is the last one. Jenny's got one more and it has a face on it.`);
      });
  }

  /* ---------- 6. synthetic people ---------- */
  if(key==='jenny'&&s==='synthetic'){
    return choose('jenny',
      `The new display set. There's a woman on it, mid-fifties, kitchen, warm smile, holding a mug. She does not exist. Underneath it says "Wrenfield sorted my leak in a day — Margaret, Carlisle". Margaret does not exist either.`,
      [
       {label:`"The image is fine — stock photography is generated all the time. Lose the quote."`,ok:false,
        note:`Right about the quote, and you have waved through a synthetic person presented as a customer of a regulated product. The image is doing the same job as the words. Again.`},
       {label:`"Both go. A made-up customer is a fabricated testimonial however it was produced — and if we use a generated person at all, it is labelled and it is not pretending to be a policyholder."`,ok:true},
       {label:`"Replace Margaret with a real customer's quote and keep the image."`,ok:false,
        note:`Now a real woman's words are in the mouth of a face that does not exist. You have made it more convincing and more dishonest. Again.`}
      ],function(){
        filed('Synthetic media','Wrenfield','Fabricated testimonial pulled; generated people labelled and never shown as customers');
        advance('saving','jenny',`Both. And if we do use generated imagery, it says so, and it is never a customer. Kate is waiting — she has been adding up whether any of this saved anybody anything.`);
      });
  }

  /* ---------- 7. did it save anything ---------- */
  if(key==='kate'&&s==='saving'){
    return choose('kate',
      `The month's numbers. Drafting time down sixty-one per cent. Review and correction time up two hundred and forty per cent. Net, we saved about nine hours out of four hundred. So what do we tell her?`,
      [
       {label:`"Report the sixty-one per cent — that's the headline the board asked for."`,ok:false,
        note:`You would be reporting the half of the sum that flatters us. It is the same trick as the drafts that said accidental damage was included. Again.`},
       {label:`"Nine hours. And that the drafting saving is real but the review load is what ate it — which tells us where to put the effort next."`,ok:true},
       {label:`"That it's too early to measure and we need another quarter."`,ok:false,
        note:`You have the numbers in your hand. Asking for more time when you already know the answer is how a pilot becomes permanent without ever being judged. Again.`}
      ],function(){
        filed('Results','Wrenfield','Nine net hours saved — drafting down 61%, review up 240%');
        advance('present_plan','kate',`Nine hours. Which sounds like a failure and is not — it is the first honest measurement anybody in this industry has shown a client all year, and it points straight at what to fix. She is in the meeting room.`);
      });
  }

  /* ---------- 8. the presentation ---------- */
  if(key==='imogen'&&s==='present_plan'){
    return choose('imogen',
      `My board wants forty per cent. What am I telling them?`,
      [
       {label:`"That we can deliver the forty per cent by moving all production to AI with review."`,ok:false,
        note:`You have promised the number knowing the review load is what consumed the saving. You would be selling her the nineteen variants that said accidental damage was included. Again.`},
       {label:`"That we can take about twelve per cent out of production now, that the rest of the saving is real but sits behind a review problem we can name, and that the work your regulator cares about stays with people."`,ok:true},
       {label:`"That forty per cent isn't achievable without unacceptable risk."`,ok:false,
        note:`True, and it is a no with nothing attached. She has to go back to a board with something. Again.`}
      ],function(){
        filed('Board recommendation','Wrenfield','12% now, the rest named as a review problem, judgment work stays human');
        say('imogen',`...Twelve, honestly, with a route to more. That is a harder meeting and a much easier year.`,
          [{label:'That is the proposal.',go:function(){
            say('kate',`It is. And the sentence that matters is the last one — the work a regulator asks about has a person's name on it.`,
              [{label:'Then we are done.',go:function(){
                startClock(90);
                say('imogen',`We are not, quite. My digital team have had a generated FAQ block live on the contents page since Tuesday. Someone has just noticed one of the answers says flood damage is covered as standard. It is not. Fourteen thousand people have seen the page.`,
                  [{label:'Think.',go:function(){ G.step='crisis_live'; paintHUD(); aiCrisis(); }}]);
              }}]);
          }}]);
      });
  }
  if(key==='kate'&&s==='present_plan')
    return say('kate',`(She is letting you present. That is the test.)`);
  if((key==='imogen'||key==='kate')&&s==='crisis_live') return aiCrisis();

  /* ---------- Alex: hints ---------- */
  if(key==='alex'){
    const h={
      ai_brief:`She has been given a percentage, not a problem. Ask which forty per cent.`,
      where_it_helps:`Volume and synthesis are hours. Positioning is judgment. Sort the list into those two piles.`,
      claim:`Better prompting lowers the error rate. It does not put a name against the output.`,
      voice:`It writes toward the middle of everything ever written. What makes them them was never in the prompt.`,
      data:`Two problems in there. One is what we do next; the other already happened.`,
      synthetic:`The picture is making the same claim as the caption.`,
      saving:`You have both halves of the sum. Report both halves.`,
      present_plan:`She needs a number she can defend in twelve months, not one that sounds like the one she was given.`,
      crisis_live:`Fourteen thousand people have read it. Work out who they are before you decide what to do.`,
      complete:`First AI proposal and you talked a client down from forty per cent to the truth. Drink?`
    };
    return say('alex', h[s] || `Stuck? Tell me whether it is an hours problem or a judgment problem.`);
  }

  const idle={
    kate:`Sort the work into hours and judgment, then come back.`,
    mike:`It cannot invent what makes them different. We have to give it to it.`,
    jenny:`I have four hundred and twelve variants and nineteen problems.`,
    dan:`Kettle's on. Ask me what people have been pasting into these things.`,
    imogen:`I'll wait. The board meets on Thursday, mind.`
  };
  say(key, idle[key] || `...`);
}

function aiCrisis(){
  choose('imogen',`Well? My team want to pull the whole FAQ block.`,[
    {label:`"Pull the block and investigate how it got there."`,ok:false,
     note:`You have removed the evidence and left fourteen thousand people believing they are covered for flood. The page was the smaller problem. Again.`},
    {label:`"Correct the answer now, and get the list of who saw it — anyone who bought contents cover since Tuesday needs telling directly, because some of them chose it believing that line."`,ok:true},
    {label:`"Correct it quietly and add a note to the terms page."`,ok:false,
     note:`A quiet fix and a note nobody opens. If someone claims for a flood in March, that decision is what the conversation will be about. Again.`}
  ],function(){
    stopClock();
    G.portfolio[G.portfolio.length-1]={title:'Live error (contained)',client:'Wrenfield',
      line:'Answer corrected, and every policy sold since Tuesday contacted directly'};
    say('imogen',`...Corrected, and we write to the people who bought it. Which is four hundred and six letters and a conversation with my chief executive.`,
      [{label:'And the page is the smaller half.',go:function(){
        say('kate',`That is the job. Not the guardrails — that. Everyone in this industry is going to publish something a machine wrote and nobody checked. The ones who survive it are the ones who ask who read it before they ask who broke it.`,
          [{label:'Thank you.',go:function(){ G.step='complete'; paintHUD(); closeDlg(); openCertificate(); }}]);
      }}]);
  });
}

TRACK_DEFS.ai={
  id:'ai', name:'AI in Marketing', title:'AI Chronicles',
  blurb:'A board that has heard the word, a forty per cent cut already written down, and nineteen drafts that quietly invented the cover.',
  first:'ai_brief',
  roles:{mike:'Creative Director', kate:'Managing Partner', jenny:'Production',
         alex:'Copywriter', dan:'Studio & everything else',
         imogen:'Chief Marketing Officer, Wrenfield', player:'The new AI lead'},
  script:function(key){ return aiScript(key); },
  occupants:function(room){ return aiOccupants(room); },
  objectives:OBJ_AI,
  opening:{text:`Nine in the morning. There is a woman in the lobby whose board has heard the word "AI" and turned it into a number, and she has come to find out which forty per cent of the work she is allowed to lose.`,
           label:'Go over.'},
  certTitle:'AI CHRONICLES',
  timeUp:{who:'kate',line:`Clock's gone. The FAQ stayed up and four hundred people bought flood cover they do not have. Finish it anyway — missing a meeting is survivable; not knowing what you would have done in that minute is not.`},
  certBody:['scoped AI into a regulated account at Wrenfield — what it can take, what it',
            'invents, what it strips out, what must never be pasted into it — and contained',
            'a generated answer that was live, wrong and already read.'],
  lessons:[
    {t:'Ask which forty per cent', c:'The brief',
     l:'Boards arrive with a percentage rather than a problem. Separating the work into hours and judgment turns a cost demand into a scope conversation.'},
    {t:'Volume and synthesis, not judgment', c:'Scope',
     l:'Drafting eight hundred variants and reading four hundred transcripts are hours. Positioning and a competitor response are judgment under uncertainty, which is not a text problem.'},
    {t:'Fluent is not true', c:'Claims',
     l:'A model will produce a confident, on-brand sentence that invents your cover. Better prompting lowers the rate; it never makes the output trustworthy.'},
    {t:'A name, not a process', c:'Claims',
     l:'"The workflow approved it" cannot be said to a regulator. Anything making a claim needs a person who signed it — and a review gate nobody can staff is a rubber stamp by week two.'},
    {t:'It writes toward the middle', c:'Voice',
     l:'Models average everything written on a subject. The man in Carlisle who comes out on a Sunday is a fact, not a tone — if it is not in the brief it cannot come out in the draft.'},
    {t:'Specifics in, not adjectives', c:'Voice',
     l:'Pasting three tone words produces a fluent average that uses those words. Hand over the names, places and promises instead.'},
    {t:'Watch what people paste in', c:'Data',
     l:'Strip identifying details, use tools whose terms you have read — and when it has already happened, tell the client the same day rather than in the quarterly.'},
    {t:'A generated customer is a fabricated testimonial', c:'Synthetic media',
     l:'However it was produced. A made-up face doing the job of a made-up quote is the same claim; if generated people appear at all, label them and never present them as customers.'},
    {t:'Moved work is not saved work', c:'Measurement',
     l:'Drafting down sixty-one per cent against review up two hundred and forty is a net of nine hours. Report both halves of the sum, or you are doing the thing the bad drafts did.'},
    {t:'Ask who read it before you ask who broke it', c:'The live error',
     l:'Pulling the page removes the evidence and leaves the people who believed it. Correct it, find who saw it, and tell the ones who acted on it.'}
  ]
};
