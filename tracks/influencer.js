/* Track: Influencer Chronicles
   A track owns its people, its objectives, its step machine and its lessons.
   The world it runs in (rooms, furniture, colourway) comes from worlds/agency.js,
   and everything else from engine/. */

window.TRACK_CONFIG={
  menuLede:"A day on a creator launch, and two million followers who are not the audience."
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

CAST.sunny={name:'Sunny', role:'Brand Director, Pellow Skin', where:'Lobby',
  accent:'#e0748c', top:'#8a4a5e', topDk:'#693846', style:'knit', tee:'#8a4a5e',
  legs:'#3f4a54', legsDk:'#2e3740', shoe:'#e8e2d6',
  skin:'#b47a4e', skinDk:'#8e5c36', hair:'#241c16', hairHi:'#3c2f24', cut:'long',
  specs:false, prop:'tablet', build:0.99, bw:20, beard:false};

const OBJ_INFLUENCER={
  inf_brief:'Sunny from Pellow is waiting in the Lobby',
  vetting:'Dan in the Break Room has run the numbers on her shortlist',
  disclosure:'Kate in Servicing, before anything goes near a contract',
  creative_brief:'Mike in Creative — how to brief someone you cannot script',
  rights:'Jenny in the Studio wants to know what we are allowed to keep',
  payment:'Back to Kate. What we are actually paying for',
  measurement:'Dan again — what we tell Sunny it did',
  present_plan:'Present the roster to Sunny in the Meeting Room',
  crisis_post:'Decide. Now.',
  complete:'You run partnerships now'
};

function influencerOccupants(room){
  const s=G.step;
  const pitching=['present_plan','crisis_post'].indexOf(s)>=0;
  if(room==='lobby')     return s==='inf_brief'?[['sunny',400,300,'down']]:[];
  if(room==='servicing') return pitching?[['alex',620,240,'left']]
                                        :[['kate',400,306,'down'],['alex',620,240,'left']];
  if(room==='creative')  return [['mike',260,258,'right']];
  if(room==='studio')    return [['jenny',400,196,'down']];
  if(room==='breakroom') return [['dan',650,268,'down']];
  if(room==='meeting')   return pitching?[['sunny',360,196,'down'],['kate',470,196,'down']]:[];
  return [];
}

function influencerScript(key){
  const s=G.step;

  /* ---------- 1. reach is not the brief ---------- */
  if(key==='sunny'&&s==='inf_brief'){
    return choose('sunny',
      `Sunny Bhatt, Pellow. We're launching a barrier cream for eczema-prone skin in April. Budget's sixty thousand. I want the biggest name we can afford — there's a woman with two point one million followers and I'd like her.`,
      [
       {label:`"Two million is a strong anchor. Let's build the roster around her."`,ok:false,
        note:`You have bought a number. Sixty thousand into one post, to an audience nobody has checked, for a medicated product. Again.`},
       {label:`"Who has to believe this? If it's people managing eczema, the question is who they already trust on it — which may not be the biggest account."`,ok:true},
       {label:`"Macro influencers don't convert. We should go micro."`,ok:false,
        note:`A rule of thumb instead of a question. Sometimes the big account is right. You do not know yet, because you have not asked who the product is for. Again.`}
      ],function(){
        say('sunny',`...Mothers, mostly. Of children who scratch until they bleed at two in the morning. They do not need a celebrity, do they. They need someone who has been up at two in the morning.`,
          [{label:'That is the audience.',go:function(){
            filed('Diagnosis','Pellow','Not a reach brief — a trust brief, for people awake at 2am');
            advance('vetting','sunny',`I have been buying followers. Nobody has asked me who I was trying to reach since I got here.`);
          }}]);
      });
  }

  /* ---------- 2. vetting ---------- */
  if(key==='dan'&&s==='vetting'){
    return choose('dan',
      `Ran the shortlist. Your two-point-one-million: engagement rate nought-point-four per cent, sixty-two per cent of the audience is outside the UK, and there are three thousand new followers in one afternoon last March. There's also a woman with nineteen thousand followers, eleven per cent engagement, all UK, who posts about her son's eczema. Which do we brief?`,
      [
       {label:`"Both. The big one for awareness, the small one for credibility."`,ok:false,
        note:`You have spent most of the money on an account with bought followers to buy awareness you cannot demonstrate. Splitting a budget is not the same as having a reason. Again.`},
       {label:`"The nineteen thousand. Nought-point-four per cent and a follower spike says an audience that was purchased, and for a medicated product the wrong recommendation is worse than no recommendation."`,ok:true},
       {label:`"Neither — ask the big account for a media kit and see what their numbers say."`,ok:false,
        note:`You are asking somebody to mark their own homework, having already seen the evidence. Again.`}
      ],function(){
        filed('Vetting','Pellow','Reach account rejected — 0.4% engagement, 62% off-market, purchased follower spike');
        advance('disclosure','dan',`The small one. And I'd still ask her for thirty days of story reach before we sign anything, because screenshots are a creative medium. Kate wants you before this goes anywhere near a contract.`);
      });
  }

  /* ---------- 3. disclosure ---------- */
  if(key==='kate'&&s==='disclosure'){
    return choose('kate',
      `Right — the rules, before you promise anybody anything. She's being paid, and she's talking about a product for broken skin on children. How does the post get labelled?`,
      [
       {label:`"#ad in the hashtag block at the end, with the others."`,ok:false,
        note:`Buried where nobody reads. Disclosure has to be upfront and obvious before someone engages with the content, not filed at the bottom with the rest. That is a ruling waiting to happen. Again.`},
       {label:`"#ad at the front of the caption and the platform's paid-partnership label on — and the same if we only ever send free product, because gifting is paid too."`,ok:true},
       {label:`"We'll ask her to mention Pellow gave her the product somewhere in the video."`,ok:false,
        note:`A mention in passing, halfway through, is not a label. And "gave her the product" is precisely the case people think does not need declaring, which is why it is the one that gets enforced. Again.`}
      ],function(){
        filed('Compliance','Pellow','#ad upfront plus platform label, gifted posts included');
        advance('creative_brief','kate',`Upfront, obvious, and gifting counts — people forget the second one constantly. One more thing and then Mike: it is a medicated claim area, so she cannot say it cures anything, and we cannot let her. Go and work out how to brief someone you are not allowed to script.`);
      });
  }

  /* ---------- 4. briefing without scripting ---------- */
  if(key==='mike'&&s==='creative_brief'){
    return choose('mike',
      `Here's the tension. Her whole value is that she sounds like herself. The second she reads our copy, her audience can hear it. But we have legal lines she cannot cross. What goes in the brief?`,
      [
       {label:`"A script. It's a regulated product — we can't leave the words to chance."`,ok:false,
        note:`You have paid nineteen thousand pounds for a stranger to read an advert in a bedroom. Her audience will know inside four seconds, and so will yours. Again.`},
       {label:`"The boundaries, not the words. What we can claim, what we can't, what must appear — and the story is hers."`,ok:true},
       {label:`"No brief. Let her do what she does and approve it afterwards."`,ok:false,
        note:`Then you will be asking her to delete a post about her own child, in public, after her audience has seen it. Freedom without boundaries is a problem you have deferred, not avoided. Again.`}
      ],function(){
        filed('Creator brief','Pellow','Boundaries and mandatories — no script; the story stays hers');
        advance('rights','mike',`Boundaries, mandatories, and the two o'clock in the morning is hers to tell. Give a creator a cage and they will read it out. Give them a fence and they will do something you could not have written. Jenny wants to talk about what we are allowed to keep.`);
      });
  }

  /* ---------- 5. usage rights ---------- */
  if(key==='jenny'&&s==='rights'){
    return choose('jenny',
      `Sunny has already asked me whether we can run the video as a paid ad and put it on the website. What does the contract say?`,
      [
       {label:`"Standard contract — we're paying her, so we can use what she makes."`,ok:false,
        note:`Paying for a post buys the post. Running it as an advert is a different use, for a different length of time, in front of a different audience, and taking it is the fastest way to be the agency creators warn each other about. Again.`},
       {label:`"Nothing, yet. Paid amplification and website use are separate licences with a term and a fee — we agree them now, in writing, before she makes anything."`,ok:true},
       {label:`"We'll ask her afterwards if it goes well."`,ok:false,
        note:`After it goes well is when leverage moves to the other side of the table and the price triples. And she can say no, having already been briefed to make it. Again.`}
      ],function(){
        filed('Rights','Pellow','Organic, paid amplification and site use licensed separately — term and fee agreed up front');
        advance('payment','jenny',`Separate, termed, priced, signed before the shoot. And if we are whitelisting through her handle, that is her name on an advert she is not in the room for — which is a conversation, not a clause. Kate has the money question.`);
      });
  }

  /* ---------- 6. paying people ---------- */
  if(key==='kate'&&s==='payment'){
    return choose('kate',
      `Sunny's team have suggested we offer product instead of a fee. Three hundred pounds of cream for a woman whose posts are her income. What do you say to that?`,
      [
       {label:`"It's standard for gifting. If she likes the product she'll post about it anyway."`,ok:false,
        note:`She might. And you have built a campaign on hoping somebody works for nothing, then briefed them, then asked for usage rights. Again.`},
       {label:`"We pay her. Product on top if she wants it — but you don't ask a professional to work for samples, and a paid relationship is the one you can hold to a standard."`,ok:true},
       {label:`"Offer product and a performance bonus on sales."`,ok:false,
        note:`You have moved the risk onto the person with the least ability to carry it, and tied a medical-adjacent recommendation to how many units it shifts. Think about what that incentivises her to say. Again.`}
      ],function(){
        filed('Terms','Pellow','Fee paid, product additional — no performance-linked pay on a medicated claim');
        advance('measurement','kate',`Paid, and not on commission — the moment her income depends on volume you have put a thumb on what she tells people about their children's skin. Dan is in the kitchen. He will ask you what we are reporting back.`);
      });
  }

  /* ---------- 7. measurement ---------- */
  if(key==='dan'&&s==='measurement'){
    return choose('dan',
      `Sunny's board wants a number in six weeks. One post, nineteen thousand followers. What do we promise to show them?`,
      [
       {label:`"Total reach and impressions across the roster."`,ok:false,
        note:`The number she came in wanting, which is the number that got her here. You would be proving the thing you just spent a day arguing against. Again.`},
       {label:`"A trackable code and link for what we can count, and a before-and-after on whether people in that audience have heard of Pellow — with the honest note that one post cannot carry a launch."`,ok:true},
       {label:`"Sales during the campaign window."`,ok:false,
        note:`April also has a spring push, a retail listing and the weather. You would be handing her a number that other people's work is inside, and next time it will be used against you. Again.`}
      ],function(){
        filed('Measurement','Pellow','Codes and links for the countable, awareness lift for the rest, with what one post cannot do stated');
        advance('present_plan','dan',`Codes for what we can count, a lift study for what we cannot, and say out loud what one post will not do. She is in the meeting room. Your roster.`);
      });
  }

  /* ---------- 8. the presentation ---------- */
  if(key==='sunny'&&s==='present_plan'){
    return choose('sunny',
      `So I came in for two million followers and you're giving me nineteen thousand. Say it to me the way I have to say it to my chief executive.`,
      [
       {label:`"Engagement rate is a better predictor of performance than follower count."`,ok:false,
        note:`True, and it is a sentence for a marketing department, not a board. She will be asked why she spent sixty thousand on a small account and she will have a statistic instead of an answer. Again.`},
       {label:`"We are not buying an audience, we are borrowing a relationship — and the mothers you need already trust her with exactly this. The big account would have rented us strangers."`,ok:true},
       {label:`"The large account had purchased followers, so it would have been a waste of money."`,ok:false,
        note:`You have led with what you rejected instead of what you chose. Now the plan is a negative, and so is the meeting. Again.`}
      ],function(){
        filed('Roster recommendation','Pellow','Eleven creators with lived experience, led by trust rather than reach');
        say('sunny',`...Borrowing a relationship. Yes. I can say that one.`,
          [{label:'That is the roster.',go:function(){
            say('kate',`Good. Sign the rights before anybody films anything.`,
              [{label:'Understood.',go:function(){
                startClock(90);
                say('sunny',`One thing. The creator posted her teaser last night and it is doing rather well. Eleven thousand views. My social manager has just noticed there is no ad label on it.`,
                  [{label:'Think.',go:function(){ G.step='crisis_post'; paintHUD(); influencerCrisis(); }}]);
              }}]);
          }}]);
      });
  }
  if(key==='kate'&&s==='present_plan')
    return say('kate',`(She is letting you present. That is the test.)`);
  if((key==='sunny'||key==='kate')&&s==='crisis_post') return influencerCrisis();

  /* ---------- Alex: hints ---------- */
  if(key==='alex'){
    const h={
      inf_brief:`She is in the lobby with a follower count. Ask who has to believe this, not who has the most followers.`,
      vetting:`Engagement rate, audience location, and whether the followers arrived gradually. One of those three is always the tell.`,
      disclosure:`Upfront and obvious. And gifting counts as payment — that is the one everybody gets wrong.`,
      creative_brief:`You are paying for her voice. Give her a fence, not a cage.`,
      rights:`A post is one use. An advert is another. Price them separately, before she films.`,
      payment:`Her posts are her income. Work out what you would call it if someone offered you samples.`,
      measurement:`Promise what you can actually show, and say out loud what one post will not do.`,
      present_plan:`She has to defend nineteen thousand followers to a chief executive. Give her the sentence, not the statistic.`,
      crisis_post:`It is doing well. That is what makes it worse, not better.`,
      complete:`First roster and you turned down two million followers. Drink?`
    };
    return say('alex', h[s] || `Stuck? Tell me who has to believe it and I will tell you who to call.`);
  }

  const idle={
    kate:`Nothing goes to contract until I have seen the disclosure plan.`,
    mike:`Bring me a fence, not a script.`,
    jenny:`Tell me what we are allowed to keep and for how long.`,
    dan:`Kettle's on. I've got the follower graphs when you want to be depressed.`,
    sunny:`I'll wait. April doesn't move, mind.`
  };
  say(key, idle[key] || `...`);
}

function influencerCrisis(){
  choose('sunny',`Well? It is doing eleven thousand views and my team say taking it down will look like we have something to hide.`,[
    {label:`"Leave it up and label the next one properly."`,ok:false,
     note:`An undisclosed ad for a medicated product, left up because it is performing. That is the sentence that ends up in the ruling. Again.`},
    {label:`"She edits the caption now — #ad at the front, paid-partnership label on. The post stays, the breach stops, and it is fixed by her rather than deleted by us."`,ok:true},
    {label:`"Delete it immediately and re-post it correctly labelled."`,ok:false,
     note:`You have thrown away eleven thousand views and made a compliant creator look like she did something shameful. The label can be added in nine seconds. Again.`}
  ],function(){
    stopClock();
    G.portfolio[G.portfolio.length-1]={title:'Disclosure (corrected live)',client:'Pellow',
      line:'Caption edited and label applied in place — breach stopped without deleting her work'};
    say('sunny',`...Edited. Label on. Forty seconds. And nobody has lost anything.`,
      [{label:'The post was never the problem.',go:function(){
        say('kate',`That is the job. Not the roster — that. When something is wrong and performing, everybody in the room wants to either protect the numbers or burn the evidence. The answer is almost always the smallest correction that makes it true, applied by the person whose name is on it.`,
          [{label:'Thank you.',go:function(){ G.step='complete'; paintHUD(); closeDlg(); openCertificate(); }}]);
      }}]);
  });
}

TRACK_DEFS.influencer={
  id:'influencer', name:'Influencer Marketing', title:'Influencer Chronicles',
  blurb:'Two point one million followers, nought point four per cent of them listening, and a product for children who scratch until they bleed.',
  first:'inf_brief',
  roles:{mike:'Creative Director', kate:'Account Director', jenny:'Production',
         alex:'Copywriter', dan:'Studio & everything else',
         sunny:'Brand Director, Pellow Skin', player:'The new partnerships manager'},
  script:function(key){ return influencerScript(key); },
  occupants:function(room){ return influencerOccupants(room); },
  objectives:OBJ_INFLUENCER,
  opening:{text:`Nine in the morning. There is a woman in the lobby with sixty thousand pounds, a launch in April, and the name of an influencer she has already decided she wants.`,
           label:'Go over.'},
  certTitle:'INFLUENCER CHRONICLES',
  timeUp:{who:'kate',line:`Clock's gone. The teaser stayed up unlabelled and we are now explaining ourselves to a regulator instead of a client. Finish it anyway — missing a deadline is survivable; not knowing what you would have done in that minute is not.`},
  certBody:['built the Pellow creator roster from the ground up — vetting, disclosure,',
            'briefing, usage rights, terms and measurement — and corrected an undisclosed',
            'post that was performing, without deleting a creator’s work.'],
  lessons:[
    {t:'Reach is not the brief', c:'The brief',
     l:'Start with who has to believe this and what they already trust. Follower count is the answer to a question nobody asked.'},
    {t:'Engagement rate and audience location are the tell', c:'Vetting',
     l:'Nought-point-four per cent on two million, most of it off-market, with followers that arrived in an afternoon. The numbers that matter are the ones a media kit leaves out.'},
    {t:'Disclosure goes first, and gifting counts', c:'Compliance',
     l:'Upfront and obvious before anyone engages, not buried in the hashtags. Free product is payment — that is the case people assume is exempt, which is why it is the one enforced.'},
    {t:'Brief the fence, not the script', c:'Creative',
     l:'You are paying for a voice that sounds like itself. Give them what they cannot claim and what must appear, then let the story be theirs.'},
    {t:'A post is one use; an advert is another', c:'Rights',
     l:'Paid amplification and site use are separate licences with a term and a fee, agreed before anything is filmed. Taking them afterwards is how agencies get a reputation.'},
    {t:'Pay people for work', c:'Terms',
     l:'Samples are not a fee when posting is someone’s income. And a paid relationship is the only one you can hold to a standard.'},
    {t:'Do not tie a health claim to a sales bonus', c:'Terms',
     l:'Performance pay moves your risk onto the person least able to carry it, and quietly changes what they tell parents about their children’s skin.'},
    {t:'Promise the measurement you can actually show', c:'Measurement',
     l:'Codes and links for what is countable, awareness lift for what is not, and say plainly what one post cannot do. Claiming the sales window borrows other people’s work and it is used against you next time.'},
    {t:'Sell the choice, not the rejection', c:'The presentation',
     l:'"We are borrowing a relationship" is a sentence a client can repeat to a board. "Their followers were fake" makes the plan a negative.'},
    {t:'The smallest correction that makes it true', c:'The live breach',
     l:'When something is wrong and performing, the room splits between protecting the numbers and burning the evidence. Usually the answer is an edit, made by the person whose name is on it.'}
  ]
};
