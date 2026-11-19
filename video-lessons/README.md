# workexp video lessons

Editorial kinetic-typography lessons on copywriting, built with [Remotion](https://www.remotion.dev) (React → MP4).
Warm paper, charcoal ink and one vermilion accent; Newsreader for the words, JetBrains Mono for the rules and the numbers,
and Jost, a geometric display sans in the mid-century poster tradition, for titles, big numbers and object names.

| Composition | Length | Status |
|---|---|---|
| `Lesson01-AdjectivePurge` | 46 s, 1920×1080, 60 fps, narrated | done: hook, illustrated scene, camera, voice and sound, end card |
| `Lesson01-AdjectivePurge-TypeOnly` | 41 s, silent | the earlier type-only cut |
| `Lesson02-SoWhatLadder` | 40 s, 1920×1080, 60 fps | built; storyboard in review |
| `Lesson02-Storyboard` | 1 still | three frozen frames of lesson 02 |
| `Lesson03-SentenceRhythm` | 30–45 s | next |
| `CharacterPreview` | 1 still | style check for the illustrated figure |
| `EditDeskScene` | 1 still | the figure and the objects together in one scene |
| `ObjectSheet` | 1 still | every illustrated object on its own, named in Jost |

## Run it

Needs Node 18+.

```sh
npm install
npm run studio            # live preview with a scrubber at http://localhost:3000
npm run render:lesson01   # → out/Lesson01-AdjectivePurge.mp4
npm run render:all        # every finished lesson
npm run still:lesson01    # one frame → out/Lesson01-AdjectivePurge.png
npm run still:character   # the character rig in three poses → out/CharacterPreview.png
npm run still:scene       # the editor at the easel, the desk and its objects → out/EditDeskScene.png
npm run still:objects     # the object specimen sheet → out/ObjectSheet.png
npm run typecheck
```

Remotion downloads its own headless Chrome on the first render. To use a browser you already have instead:
`REMOTION_BROWSER=/path/to/chrome npm run render:lesson01`.
Any composition can also be rendered by id: `npx remotion render src/index.ts <id> out/<id>.mp4`.

## Layout

```
src/
  index.ts                 registers the root
  Root.tsx                 one <Composition> per lesson (id = output file name)
  theme/tokens.ts          colours, fonts, grid, type scale, the house spring
  theme/fonts.ts           loads the bundled fonts; useFontsReady() blocks rendering until they are in
  lib/motion.ts            snap() spring helper, ramp(), deterministic caret blink
  lib/sentenceLayout.ts    text measuring + greedy line breaking
  components/
    TypewriterReveal.tsx   types text in place (by character or by word), with a caret
    RedlineStrike.tsx      a vermilion line slices a word, the word drains and fades
    WordSwap.tsx           rolls one phrase out and another in, inside a clipped window
    KineticSentence.tsx    sets a sentence word by word and animates cuts, swaps and marks
    print/Print.tsx        the shared print layer: four inks, paper grain, the paper trap gap
    EditorialCharacter.tsx a mid-century paper-cut figure: four inks, print grain, a jointed rig with poses
    EditorialObjects.tsx   the lesson's props in the same print: espresso machine, cup, stopwatch, page, pencil, desk, lamp, easel
  lessons/
    Lesson01AdjectivePurge.tsx
    CharacterPreview.tsx   one still of the character in three poses
    EditDeskScene.tsx      the scene still and the object sheet
public/fonts/              Newsreader, JetBrains Mono and Jost (SIL Open Font License, licences alongside)
```

## How the motion works

- Every animation is a pure function of `useCurrentFrame()`, so scrubbing in the Studio and rendering always match.
- `snap(frame, fps, at, dur)` is the one spring used everywhere: `damping: 200`, `stiffness: 180`, no overshoot.
  `dur` stretches the same curve, so a strike can take 16 frames and a camera-style lift 44.
- `KineticSentence` measures each word with the real font and lays the sentence out itself. While words are
  being cut, every word keeps its line and each line closes up sideways. Then, at `reflowAt`, the survivors re-set
  into tight lines: each original line travels as one phrase, sliding along before it rises, so no word ever
  crosses another. A swap animates the same way.
- Holds are deliberate: the first draft stays still for about 4 s before the first cut, and each cut is 1.6 s apart.

## Lesson 01 timeline (frames at 60 fps)

The scene (the editor at her easel, the desk with the product) is drawn once; a camera moves between shots of it:
`wide`, `easel`, `page`, `desk` and `watch` in `SHOT`, with the moves listed in `MOVES`. The sentence is its own layer,
reached by pushing into the page so the cream page becomes the paper the type is set on.

| Frame | Picture | Voice |
|---|---|---|
| 0 | Title card, Jost and Newsreader italic | "Lesson one. The adjective purge." |
| 204 | Wide, then a slow push: the editor reads, chin on hand, as the page types in | "Here's a first draft. Fourteen words… and most of them are praise." |
| 520 | She leans in; the camera pushes into the page and dissolves to the sentence | |
| 640–1110 | Eight redlines: three on the spoken words, five in a run (a pencil scratch on each) | "So cut every adjective. Innovative. Award-winning. Next-generation. If a rival could say it… it goes." |
| 1145 | The survivors re-set; noun and verb underlined on the words | "What's left does the work. A machine… that brews." |
| 1370 | Cut to the desk: the machine pours (espresso sound) | "Now swap the praise for proof." |
| 1490 | Pan to the stopwatch; it sweeps to forty (ticking) | "How fast is it? Forty seconds." |
| 1656 | The sentence: *cup.* → *cup in 40 seconds.* | |
| 1786 | Wide: she points with the pencil and marks the page; the rule and the metrics land | "If a rival could say it… cut it." |

## Sound

Narration and sound effects were made with ElevenLabs and live in `public/audio/lesson01/`:

- `narration.mp3`: one take (model `eleven_v4`, voice "Sasha"), loudness-normalised to −16 LUFS. The `VO` table in the lesson
  lists each phrase's start and end in this file (found with ffmpeg silence detection) and the frame it plays at, so every
  phrase lands on its picture. To re-voice, replace the file and update those times.
- `sfx-pencil-1…4.mp3` (one per redline, rotated), `sfx-espresso.mp3`, `sfx-stopwatch.mp3`: ElevenLabs sound effects
  (`eleven_text_to_sound_v3`), normalised to sit under the voice.

## Adding a lesson

1. Create `src/lessons/LessonNN<Name>.tsx` exporting the component and its frame count.
2. Register it in `src/Root.tsx` with `id="LessonNN-<Name>"`.
3. Add `"render:lessonNN"` to `package.json` and append it to `render:all`.

## The editorial character

`<EditorialCharacter pose={...} frontHand="point" />` draws a figure in the manner of a mid-century magazine spot
illustration: flat shapes with no outlines, a 1 : 7.5 head-to-body ratio, small features, and only four inks
(charcoal `#141413`, terracotta `#C85A32`, slate `#4A5D6E`, cream `#F7F5F0`). A fixed-seed `feTurbulence` filter
lifts a fine speckle out of the ink, like a screen print, and never changes between frames. The near arm carries
a thin band of bare paper around it, so it reads against the torso and face without a stroke.

The rig is nested `<g>` groups (`UpperBody › Torso, Head, UpperArm › Forearm › Hand`), each rotating about an explicit
`transformOrigin`. A pose is a set of joint angles; `POSES` has `standing`, `pointing`, `chinRest` and `leaningIn`.
To animate a posture shift, blend two poses with a spring:

```tsx
const t = snap(frame, fps, 600, 40);
<EditorialCharacter pose={blendPose(POSES.standing, POSES.pointing, t)} frontHand={t > 0.5 ? 'point' : 'relaxed'} />
```

## The objects

`EditorialObjects.tsx` draws the lesson's world in the same print as the character (`<PrintSvg>` gives every piece
the same inks, grain and paper gap). Each object stands on the bottom edge of its box, so `top = surfaceY - height`
sets it on a desk or the floor. Moving parts are props for a lesson to drive:

| Object | Moving parts |
|---|---|
| `CoffeeMachine` | `pour` 0 → 1 runs the stream into the cup; `pressure` turns the gauge needle |
| `CoffeeCup` | `t` (seconds) lets the steam drift slowly; `steam` fades it |
| `Stopwatch` | `seconds` sweeps the hand and the terracotta sector; the readout is set in Jost |
| `Manuscript` | `strikes` and `progress` draw the red edits one after another, then the insertion caret |
| `DeskLamp` | `lower`, `upper`, `head`: a jointed rig, like the figure's arm |
| `EditorsPencil`, `Desk`, `Easel` | static; the figure can also hold the pencil (`frontHand="pencil"`) |

## The editorial stage (lessons 02 on)

`components/stage/` holds the frame later lessons are built in:

- `EditorialStage`: a 70% stage seen through a 2D camera (`moves`, from `lib/camera.ts`) and a fixed 30% **Editor's Margin**,
  split by a vertical hairline. `rack` (0 → 1, from `rackAt`) pushes the camera in a further 8% and blurs (2 px) and dims
  (to 35%) every `<Defocus>` layer not marked `active`, so the eye goes to the edit.
- `MarginMetric` / `MarginNote`: readouts that count to new values on the house spring and flash a vermilion delta.
- `EditorialStamp`: a vermilion rubber stamp thrown on in 5 frames, landing with a damped horizontal shake (`shake`).
- `InkUnderline`: a hand-drawn underline drawn with `strokeDashoffset`, which keeps breathing by under a pixel once drawn.
- `PaperBreath`: a faint paper-fibre layer that drifts a few pixels over many seconds, so no frame is ever frozen.
- `lessons/Storyboard.tsx`: `makeStoryboard(Lesson, heading, panels)` freezes the real lesson at chosen frames for review.
  The storyboard composition must be as long as the lesson, or `<Freeze>` renders nothing past its end.

## The intro hook

`components/HookIntro.tsx` is a cold open before a lesson's title: "Give me thirty seconds… and I'll teach you how to hook
your audience." It plays in hard beats (GIVE ME slams in; a vermilion 30 with a stopwatch ring; a hard cut; a fishing line
drops in and its hook catches the word *hook*, then yanks it up out of frame into the title). The beats are frames tied to
words in the narration (`HOOK` in the lesson). Lesson 02 opens with it; the voice is ElevenLabs "Sasha",
`public/audio/lesson02/hook.mp3`. `Hook-Storyboard` freezes three of its frames.

## The end card and the transitions

`components/Outro.tsx` closes every lesson: a **redline wipe** (a vermilion edge sweeps across the last frame) reveals
"For more lessons like this · workexp.org", spoken, with the editor pointing at the address and a hand-drawn underline.
Voice: `public/audio/shared/outro.mp3`. Lessons are assembled as `<Sequence>`s: hook → body → end card, so a lesson's
own timings never change when the bookends do.

Lesson 01's cuts are each a different, motivated move:

| From → to | Transition |
|---|---|
| hook → title | the hook's line yanks the word *hook* up out of frame |
| title → scene | the title lifts away; the scene settles back from 112% |
| scene → sentence | zoom-through: the camera pushes into the page and through it; the sentence rises out of it (130% → 100%) |
| sentence → desk | whip pan: the sentence whips off left with motion blur as the desk whips in |
| stopwatch → sentence | iris: the sentence opens out of the stopwatch face |
| sentence → room | pull-back: the sentence sinks into the page and the camera pulls out of it |
| → end card | redline wipe |

The sentence layer has its own camera: a slow push through the cuts and a lean-in on the noun/verb marks and on the swap.
It scales from the left margin, so the text stays on the 160 px grid line with the header.
