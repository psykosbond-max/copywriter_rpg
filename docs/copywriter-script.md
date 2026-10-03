# Copywriter Chronicles: Script

All the player-facing text in `games/copywriter-chronicles.html`, in play order. Edit the wording however you like. The `step` names in brackets are the IDs the game uses to move between quests, so keep them as they are if you want your edits mapped back into the code.

**How choices work:** each writing task shows three options in random order. Picking a wrong one shows its feedback and asks again. Picking the right one moves the story on.

---

## Setup

### Characters

| Key | Name | Role | Room |
|---|---|---|---|
| `kate` | Kate | Project Manager | Servicing (Meeting Room for the finale) |
| `mike` | Mike | Creative Director | Creative |
| `jenny` | Jenny | Production Manager | Studio |
| `dan` | Dan | Studio Manager | Break Room |
| `alex` | Alex | Copywriter (gives hints) | Creative |
| `player` | You | New Copywriter | Starts in the Lobby |

### Rooms

Lobby · Servicing · Creative · Break Room · Studio · Meeting Room

### Menu screen

- **Title:** Copywriter Chronicles
- **Tagline:** A day at an ad agency, and the six briefs that come with it.
- **Track blurb:** Six briefs, one crisis, and a client who changes their mind at 4 p.m.

### Opening narration

> It's 9 a.m. on your first day, and nobody is at the front desk. The agency is through the doors. Servicing is to your right, and the other rooms are past it. Kate manages the projects here, and she has your first brief.

- Button: **Go find Kate.**

---

## Quest 1: Tagline (Tidewater Swim School)

**Objective** `[first_brief]`: Find Kate in Servicing to get your first brief

**Kate:**
> Hi, you must be the new writer! I'm Kate, and I manage the projects here. Your briefs come from me, so if one doesn't make sense, ask before you start writing. First up: Tidewater Swim School, which teaches adults who never learned to swim. Other swim schools brag about their instructors. But research shows what really stops people is embarrassment. They hate being beginners in front of others. The client wants a tagline.

- **Got it.** → Kate: *Great. Talk to Mike in Creative before you write anything.*

**Objective** `[brief_tagline]`: Take the Tidewater brief to Mike in Creative

**Mike:**
> This brief gives you the answer, and most writers miss it. The research says people are embarrassed. So don't write about the lessons. Write about the embarrassment.

- **Show me the options.**

**Objective** `[craft_tagline]`: Pick a tagline with Mike

**Mike:** I've put three options on the board. Which one does what the brief asked for?

| Option | Correct? | Feedback if wrong |
|---|---|---|
| "Expert instruction, every stroke of the way." | ✗ | No. It sounds nice, but it doesn't say anything new. It just lists the school's qualifications, and every competitor already says that. Want to try another one? |
| "Nobody's watching. Everybody started here." | ✓ | |
| "Learn to swim at any age." | ✗ | It's true and clear, but it has no emotional pull. The brief told you people are embarrassed, and this line answers with a plain fact. Try again? |

**Mike (on correct):**
> That's the one. It names the thing they're afraid of and takes that fear away in the same breath. And the second sentence backs up the first. Take it to Kate.

📁 **Added to portfolio:** Tagline · Tidewater Swim School · *Nobody's watching. Everybody started here.*

**Objective** `[deliver_tagline]`: Bring the tagline to Kate in Servicing

**Kate:**
> Perfect. It deals with their biggest worry in six words. The client is sending it to print. That's your first job done!

- **What's next?**

---

## Quest 2: Email (Ferngate Garden Center)

**Kate:**
> Ferngate Garden Center. They have 40,000 email subscribers, but most of them haven't opened an email in a year. The client wants to promote their spring plants. They sent us a subject line they really like: "Ferngate Spring Newsletter, April Edition."

- **Oh no.** → Kate: *Exactly. Mike is waiting for you.*

**Objective** `[brief_email]`: Take the Ferngate brief to Mike in Creative

**Mike:**
> An email has two lines that matter. The subject line gets people to open it. The first line gets them to keep reading. The client's version fails at both. It just says what the email is, and then it opens with "hello."

- **Show me.**

**Objective** `[craft_email]`: Pick the email subject line with Mike

**Mike:** Pick the subject line and the first line of the email together.

| Option | Correct? | Feedback if wrong |
|---|---|---|
| "Ferngate Spring Newsletter" / "Welcome to our April newsletter!" | ✗ | That's the client's version. It describes the email instead of giving people a reason to open it. Then it wastes the first line saying hello. Want to try again? |
| "Your garden is three weeks behind" / "Anything you plant in the next two weeks will still catch up. After that, it won't." | ✓ | |
| "HUGE Spring Savings Inside!" / "Don't miss out on our biggest sale of the year!" | ✗ | This gets opened by people who would have bought anyway, and it teaches everyone else to ignore you. Fake urgency is just noise. Try again? |

**Mike (on correct):**
> Yes. It's a specific problem readers can check just by looking out the window. Then the first line gives them a deadline, and the store has exactly what they need. Have Dan check it before it goes out.

📁 **Added to portfolio:** Email · Ferngate Garden Center · *Subject: Your garden is three weeks behind*

**Objective** `[mandatories_email]`: Have Dan check the email in the Break Room

**Dan:**
> Hi, I'm Dan. I run the studio, and I handle everything else nobody wants to do. Nice to meet you! Before this email goes out, it needs three things: an unsubscribe link, the company's mailing address, and the sale's end date in the body of the email, not only in the subject line. If any of those are missing, it's not a writing problem anymore. It's a legal problem.

- **Adding them now.** → Dan: *Great. You're good to send it.*

**Objective** `[deliver_email]`: Bring the email to Kate in Servicing

**Kate:**
> Four times as many people opened this email as the last one. Nice work! Next up is the Northlight Film Festival. It runs for nine days and shows forty films, mostly by first-time directors. They want a bus shelter poster. People will be standing still for a couple of minutes, but they'll be reading it from about ten feet away.

- **I'll take it to Mike.**

---

## Quest 3: Poster (Northlight Film Festival)

**Objective** `[brief_poster]`: Take the Northlight brief to Mike in Creative

**Mike:**
> A poster isn't a paragraph. It's a hierarchy. You get one line to grab attention, one line to explain, and one line to tell people what to do. Everything else belongs on the website.

- **Show me.**

**Objective** `[craft_poster]`: Pick the poster copy with Mike

**Mike:** It's a bus shelter poster, read from ten feet away. Which version works?

| Option | Correct? | Feedback if wrong |
|---|---|---|
| One long sentence: "Northlight returns for its ninth year with forty films from emerging directors..." | ✗ | Everything in it is true, but nobody can read it from ten feet away. That's a paragraph pretending to be a poster. Want to try again? |
| "Forty directors you haven't heard of yet." / "Northlight Film Festival, October 3–11." / "northlightfest.org" | ✓ | |
| "Cinema. Reimagined." / "Northlight Film Festival." | ✗ | Those two words set a mood, but they give no reason to go and no dates. And it's a big claim the festival hasn't earned. Try again? |

**Mike (on correct):**
> Good. It turns "unknown directors" into "you saw them first," which sums up the whole festival. And the other two lines handle the practical details. Jenny needs to see it before Kate does.

📁 **Added to portfolio:** Poster · Northlight Film Festival · *Forty directors you haven't heard of yet.*

**Objective** `[production_poster]`: Get Jenny's approval in the Studio

**Jenny:**
> Hi, I'm Jenny. I'm in charge of production. Everything you write comes through me before the client sees it, so you'll see me a lot. Okay, this works on a full-size poster, and it's still readable on a phone. The dates and the web address are both there. Here's a tip most writers ignore: if your copy doesn't fit the layout, someone else will cut it for you.

- **Thanks, Jenny.**

**Objective** `[deliver_poster]`: Bring the poster to Kate in Servicing

**Kate:**
> The festival loves it. The next one is audio: a 30-second radio ad for Ambercroft Cider, playing during drive time. There are no pictures, people only hear it once, and they're busy driving.

- **I'll take it to Mike.**

---

## Quest 4: Radio ad (Ambercroft Cider)

**Objective** `[brief_radio]`: Take the Ambercroft brief to Mike in Creative

**Mike:**
> A radio ad can only get one idea across, not three. So decide right now what matters most: the brand name, the offer, or the feeling. You only get one.

- **Show me.**

**Objective** `[craft_radio]`: Pick the radio script with Mike

**Mike:** A 30-second ad during drive time. Which script?

| Option | Correct? | Feedback if wrong |
|---|---|---|
| Open with the website address, then list the stores that sell it. | ✗ | Nobody writes down a web address while driving 60 miles an hour. You used your one idea on something they can't use. Want to try again? |
| Build it around one sound, the apples being pressed and the cider being poured. Say the brand name three times, and add one line about the orchard. | ✓ | |
| A long, poetic opening about Vermont summers. | ✗ | It reads beautifully on paper, but nobody can follow it when they hear it once. Always read your script out loud before you hand it in. Try again? |

**Mike (on correct):**
> Right. On the radio, sound does the job a picture would. And repeating the name is how people remember it when they can't see anything. Have Jenny time it.

📁 **Added to portfolio:** Radio ad (30 sec) · Ambercroft Cider · *The press, the pour, and the name, three times.*

**Objective** `[timing_radio]`: Have Jenny time the script in the Studio

**Jenny:**
> Let me read it out loud and time it... 68 words. A 30-second ad fits about 75 words at a normal speaking pace, so the voice artist has room to breathe. Most writers give me 90 words and then wonder why the ad sounds rushed.

- **Good to know.**

**Objective** `[deliver_radio]`: Bring the script to Kate in Servicing

**Kate:**
> The client booked it for six weeks on regional radio. Now for a harder one. Loomwork makes invoicing software for freelancers. Lots of people visit their website, but very few sign up. They scroll all the way to the bottom of the page and then leave. The client thinks the headline is the problem.

- **Is it?** → Kate: *If people are reading all the way to the bottom, probably not. Ask Mike.*
  - **On my way.**

---

## Quest 5: Landing page (Loomwork)

**Objective** `[brief_landing]`: Take the Loomwork brief to Mike in Creative

**Mike:**
> People read the whole page and still didn't click. So the headline is fine. The problem is the very last step. A call to action should tell people exactly what to do, and it has to remove whatever is making them hesitate.

- **Show me.**

**Objective** `[craft_landing]`: Write the sign-up button with Mike

**Mike:** This is the bottom of the page. What goes on the button, and what goes under it?

| Option | Correct? | Feedback if wrong |
|---|---|---|
| "Learn more" | ✗ | That's a dead end pretending to be a next step. They've already learned more. That's why they scrolled to the bottom. Want to try another one? |
| "Start free. No credit card, cancel anytime." / "Your first invoice takes four minutes." | ✓ | |
| "Sign up today and transform your freelance business!" | ✗ | It asks for a commitment, promises something it can't prove, and uses an exclamation point instead of a reason. Try again? |

**Mike (on correct):**
> That's it. It tells them exactly what to do, removes the two worries that stop people from clicking, and promises something small enough to try right now. Kate is waiting.

📁 **Added to portfolio:** Landing page · Loomwork · *Start free. No credit card, cancel anytime.*

**Objective** `[deliver_landing]`: Bring the page to Kate in Servicing

**Kate:**
> Sign-ups went up 60 percent in one week! But now the client has a new question. They want to show the price on the page, and their sales team thinks it will scare people away.

- **I'll ask Mike.**

**Objective** `[revise_landing]`: Ask Mike how to handle the client's pricing question

**Mike:**
> When you hide the price, people don't stop thinking about it. They guess, and they usually guess too high. If you don't answer a customer's worry, they'll imagine something worse. So show the price, and compare it to something they already pay for.

- **"$9 a month. That's less than one late invoice."** → Mike: *That's it. You answered their question and made the price feel small at the same time. Take it back to Kate.*

📁 **Portfolio entry updated:** Landing page · Loomwork · *Start free — no credit card, cancel anytime. $9 a month, less than one late invoice.*

**Objective** `[deliver_landing_v2]`: Bring the updated page to Kate in Servicing

**Kate:**
> Sign-ups stayed high. Told you it would work! Okay, this last one is the big one. Harbor & Wren is a home goods brand launching a new product line. They need a teaser campaign and a launch campaign, three weeks apart. And this time you're presenting the work in person, not just emailing it.

- **Presenting?** → Kate: *Yes, in the Meeting Room, to me and Mike. If you can't explain your work out loud, it isn't finished. Build it with Mike first.*
  - **Okay.**

---

## Quest 6: Integrated campaign (Harbor & Wren)

**Objective** `[brief_integrated]`: Take the Harbor & Wren brief to Mike in Creative

**Mike:**
> A teaser and a launch. The teaser shouldn't explain anything. Its only job is to make people curious, so the launch has a bigger impact. That means both pieces need to sound like the same brand. Otherwise the client pays for two campaigns that feel like two different companies.

- **Show me.**

**Objective** `[craft_integrated]`: Build the campaign with Mike

**Mike:** The teaser runs three weeks before the launch. Which pair works?

| Option | Correct? | Feedback if wrong |
|---|---|---|
| "Something is coming." → "The new Harbor & Wren collection. Shop now." | ✗ | That teaser could be for a car company, and the launch line could be for any store. Neither half says anything. Want to try again? |
| "Made slowly, on purpose." → "The slow ones last." | ✓ | |
| "Unveiling craftsmanship." → "Beautifully made pieces for the modern home." | ✗ | Both lines are fine on their own, but they don't sound like the same company. Read them back to back. It sounds like two different writers and two different brands. Try again? |

**Mike (on correct):**
> Yes. Same words, same rhythm, and the launch line finishes the thought the teaser started. Now go to the Meeting Room. And present it, don't just read it.

📁 **Added to portfolio:** Integrated campaign · Harbor & Wren · *Made slowly, on purpose. → The slow ones last.*

---

## Finale: The presentation and the crisis

**Objective** `[present_integrated]`: Present the campaign to Kate in the Meeting Room

**Kate:** Okay, you're up. Whenever you're ready.

- **Present the campaign.**

**Kate:** A teaser and a launch in the same voice, three weeks apart. That's exactly what they —

- **(Her phone rings.)**

**Objective** `[crisis_call]`: Talk to Kate

**Kate:**
> That was the client. Part of their factory uses machines, so their lawyers won't let them call the products "handmade." Every line you just presented is unusable now. And they still want the new line to launch on Thursday.

- **How much time do I have?**

⏱️ **A 90-second countdown starts.**

**Kate:**
> Ninety seconds. Then I have to call them back with something. Mike already went up to Creative to use the whiteboard. Go!

- **On my way.** → the dialogue closes.
- **Can you get me more time?** → ⏱️ adds 60 seconds. Kate:
  > ...Okay. I can tell them we're double-checking the wording. That gets you sixty more seconds, but that's all. And asking was smart. Writers who don't ask for time give me something weak and then blame the deadline. Now go!
  - **On my way.**

**Objective** `[negotiate_time]`: Go to Mike in Creative for the rewrite

- If you talk to Kate again without having asked for more time: *Mike is in Creative. Go now!* → **On my way.**

**Objective** `[crisis_rewrite]`: Rewrite the line with Mike in Creative

**Mike:** We can't say "handmade" anymore, and we have ninety seconds. What's still true?

| Option | Correct? | Feedback if wrong |
|---|---|---|
| Drop the claim and focus on the design instead. | ✗ | Then the teaser doesn't connect to anything, and we lose the whole campaign just to save one line. Try again. What's true underneath the old claim? |
| "Made in small batches, by people whose names are on the box." | ✓ | |
| "Crafted with care in the USA." | ✗ | "Care" isn't a claim. It's just a feeling. And the lawyers will ask you to prove that one too. Want to try again? |

**Mike (on correct):**
> That's the one. They can prove "small batches," and they can prove the names on the box. And it keeps the teaser's rhythm, so nothing else has to change. Now run!

📁 **Portfolio entry replaced:** Integrated campaign (revised) · Harbor & Wren · *Made in small batches, by people whose names are on the box.*

**Objective** `[deliver_integrated]`: Bring the new line to Kate in the Meeting Room

⏱️ **The countdown stops.**

**Kate:**
> Yes! Under the claim they can't make, you found one they can. And it has the same rhythm as the teaser, so nothing else needs to change. I'm calling them now.

- **And?** → Kate: *They approved it. The launch is still on for Thursday.*
  - **...** → Kate:
    > That's the real job, by the way. Not writing taglines. It's what you just did. A claim falls apart at four in the afternoon, and you find something true to say before anyone panics. You have six pieces in your portfolio, and you stayed calm in a crisis. You're a copywriter now.
    - **Thank you.** → the certificate opens.

**Objective** `[complete]`: Day complete. You're a copywriter now.

### If the countdown runs out

**Kate:**
> We're out of time. I had to call the client and tell them we're still working on it, and clients never forget hearing that. Finish it anyway. We don't stop just because the deadline passed.

---

## Alex's hints

These show up when you talk to Alex in Creative. The hint depends on the current step.

| Step | Hint |
|---|---|
| `first_brief` | Kate is in Servicing. Go out of this room and to the left. That's where all the work comes from. |
| `brief_tagline` | Specific beats clever. If another swim school could use the same line, it's not a good tagline. |
| `craft_tagline` | The research says people are embarrassed. Answer that worry, not the class schedule. |
| `deliver_tagline` | Kate is in Servicing. She'll want to see it before it goes anywhere. |
| `brief_email` | The subject line gets the open, and the first line keeps them reading. Don't waste either one on "hello." |
| `craft_email` | A problem readers can check for themselves works better than a discount, every time. |
| `mandatories_email` | Go see Dan first. He's saved me from mistakes twice, and I've only been here six months. |
| `brief_poster` | People see it for three seconds from across the street. Give them a headline, one supporting line, and the practical details. |
| `craft_poster` | If it takes a whole paragraph, it belongs on a website, not a poster. |
| `production_poster` | Take it to Jenny in the Studio. It's better for her to catch a problem than the client. |
| `brief_radio` | Nobody writes down a web address while driving 60 miles an hour. Focus on the brand name instead. |
| `craft_radio` | Read it out loud. If you can't say a line in one breath, the voice artist can't either. |
| `timing_radio` | Jenny will time it. About 75 words is the limit for 30 seconds. |
| `brief_landing` | People read the whole page and then left. The problem is at the bottom, not the top. |
| `craft_landing` | Tell them exactly what to do, then remove the two things stopping them from clicking. |
| `revise_landing` | Ask Mike about the price. Hiding it never works. People guess, and they guess high. |
| `brief_integrated` | The teaser and the launch need to sound like the same brand. Different messages, one voice. |
| `craft_integrated` | If you could give each line to a different brand and nobody would notice, it's not a campaign. |
| `present_integrated` | The Meeting Room is downstairs. And really present it. Don't just read your slides out loud. |
| `negotiate_time` | Mike is at the whiteboard. If you haven't asked Kate for more time yet, do it. That's not weakness. |
| `crisis_rewrite` | There's a true claim hiding under the one they can't make. Figure out what's still true and say that. |
| `deliver_integrated` | Head back to the Meeting Room. Kate is waiting. |
| `complete` | Six pieces and a crisis, all in one day. It took me a year to get there. Want to grab a drink? |
| *(any other step)* | Working on something? Tell me what Kate asked for, and I'll tell you what she actually wants. |

---

## Idle lines

What each character says when you talk to them but they have nothing for you right now.

| Character | Line |
|---|---|
| Kate | I don't have anything new for you yet. Finish what you're working on first. |
| Mike | Not right now. Come back when you have something to show me. |
| Jenny | Bring it to me when it's ready, and I'll tell you if it works in production. |
| Dan | There's fresh coffee. The mugs are in the cabinet on the left, not the one you're looking at. |

---

## Glossary

The first time one of these words comes up in dialogue, the speaker stops and asks: *"Do you know what ___ means?"* The player can answer **Yes, I know that one** or **No, please explain**. If you rename a term, update the "Triggered by" words too, or the question won't appear.

| Term | Triggered by | Definition |
|---|---|---|
| a brief | brief | A short document that explains what a piece of work needs to do: the problem, the audience, the research, and any limits. A good brief often contains the answer if you read it carefully. |
| a tagline | tagline, slogan | A short, memorable line that goes with a brand or campaign. It usually has one job and does it in a few words. Also called a slogan. |
| a subject line | subject line | The line people see in their inbox before they open an email. The subject line gets people to open it, and the first line gets them to keep reading. |
| open rate | open rate, opened this email | The percentage of people who opened an email. It's usually the first number people look at to judge how an email did. |
| an unsubscribe link | unsubscribe link | A link that lets people remove themselves from a mailing list. By law, marketing emails must include one, along with the sender's real mailing address. |
| a bus shelter poster | bus shelter poster | A large poster in a bus stop display, read by people standing ten or so feet away. It has room for one idea, not a paragraph. |
| hierarchy | hierarchy | Deciding what people should read first, second, and third, and making that order obvious. Without it, a poster is just a paragraph on a wall. |
| a call to action | call to action, CTA | The part that tells people what to do next, usually a button like "Start free." A good one names the action and removes whatever is making people hesitate. |
| sign-ups | sign-ups | The number of people who created an account. Teams often compare it to the number of visitors to see how well a page is working. |
| drive time | drive time | The morning and evening commute hours, when most radio listeners are in their cars. There are no pictures, people hear the ad only once, and they're busy driving. |
| a voice artist | voice artist, voiceover | The professional who reads the script out loud for a radio ad or video. A 30-second ad fits about 75 words at a natural pace. |
| a teaser | teaser | An ad that runs before a launch and doesn't reveal everything on purpose. Its job is to make people curious so the launch gets more attention. |
| the launch | launch | The campaign that runs when the product comes out and explains what it is. It should sound like the teaser, or it will feel like two different companies. |
| a claim | claim | A statement of fact about a product, like "handmade," "fastest," or "made in the USA." The company must be able to prove it, or the lawyers will stop it. |
| the lawyers | lawyers, legal | The people who check that an ad doesn't say anything the company can't legally back up. They aren't being difficult. A claim you can't prove can get a company sued. |
| the layout | layout | How the words and images are arranged on the page at their real size. If your copy doesn't fit the layout, someone else will cut it for you. |
| a portfolio | portfolio | A collection of your best work. It's what you show when you apply for your next job. |
| slides | slides | The presentation you use to show your work to a client. Reading your slides out loud word for word isn't the same as presenting. |
| regional radio | regional | Ads that play in some parts of the country instead of nationwide. It costs less, and it's often how companies test a campaign. |
| a customer worry | worry, worries | The reason someone almost buys and then doesn't, like the price or the fear of getting locked in. Answering it in the copy works better than hoping they forget about it. |

---

## "What this teaches" (lessons screen)

| Lesson | Client | Text |
|---|---|---|
| Taglines | Tidewater Swim School | Answer the real reason people hold back, not just what the brief says on the surface. If a competitor could use the same line, it's not a good tagline. |
| Email | Ferngate Garden Center | The subject line gets people to open the email, and the first line keeps them reading. A problem readers can check for themselves works better than a discount. |
| Posters | Northlight Film Festival | Use hierarchy, not paragraphs. One line grabs attention, one explains, and one tells people what to do. |
| Writing to fit | Northlight Film Festival | If your copy doesn't fit the layout, someone else will cut it for you. Word count is part of the creative challenge, not paperwork. |
| Radio | Ambercroft Cider | Write for the ear. Pick one idea and repeat it. If you can't say a line in one breath, the voice artist can't either. |
| Calls to action | Loomwork | A call to action tells people exactly what to do next. Name the action, then remove the two worries that stop people from clicking. |
| Customer worries | Loomwork | If you hide something people are worried about, like the price, they'll imagine it's worse than it is. |
| Integrated campaigns | Harbor & Wren | The teaser and the launch need to sound like the same brand. Use one voice with different messages. |
| Working under pressure | Harbor & Wren | When a claim falls apart, find the true claim underneath it. And ask for more time. Writers who don't ask end up handing in weak work and blaming the deadline. |

---

## Certificate

**Title:** COPYWRITER CHRONICLES

> This certifies that **[player name]**
>
> completed a full day at the agency, writing six pieces: a tagline, an email,
> a poster, a radio ad, a landing page, and an integrated campaign,
> plus one crisis rewrite delivered on deadline.

Below this, the certificate lists each portfolio piece as *Title — Client*.

Keep each certificate line under about 90 characters, or it will run off the edge.
