# workexp video lessons

Editorial kinetic-typography lessons on copywriting, built with [Remotion](https://www.remotion.dev) (React → MP4).
Warm paper, charcoal ink and one vermilion accent; Newsreader for the words, JetBrains Mono for the rules and the numbers.

| Composition | Length | Status |
|---|---|---|
| `Lesson01-AdjectivePurge` | 41 s, 1920×1080, 60 fps | done |
| `Lesson02-SoWhatLadder` | 30–45 s | next |
| `Lesson03-SentenceRhythm` | 30–45 s | next |
| `CharacterPreview` | 1 still | style check for the illustrated figure |

## Run it

Needs Node 18+.

```sh
npm install
npm run studio            # live preview with a scrubber at http://localhost:3000
npm run render:lesson01   # → out/Lesson01-AdjectivePurge.mp4
npm run render:all        # every finished lesson
npm run still:lesson01    # one frame → out/Lesson01-AdjectivePurge.png
npm run still:character   # the character rig in three poses → out/CharacterPreview.png
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
    EditorialCharacter.tsx a mid-century paper-cut figure: four inks, print grain, a jointed rig with poses
  lessons/
    Lesson01AdjectivePurge.tsx
    CharacterPreview.tsx   one still of the character in three poses
public/fonts/              Newsreader + JetBrains Mono (SIL Open Font License, licences alongside)
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

| Frame | Beat |
|---|---|
| 0 | Title card: *The Adjective Purge.* |
| 190 | Header, hairline rule and word counter |
| 260 | The first draft types in, word by word (14 words) |
| 660–1332 | Pass 1: eight redlines, one every 96 frames; the counter ticks down to 6 |
| 1404 | The survivors re-set into one line: *Our coffee machine brews a cup.* |
| 1500 / 1566 | The noun and the verb are underlined |
| 1800 | Pass 2: *cup.* → *cup in 40 seconds.* (praise swapped for proof) |
| 2040–2460 | The sentence lifts, the rule types in, the before/after metrics land |

To change the copy, edit `SENTENCE` in `src/lessons/Lesson01AdjectivePurge.tsx`: give a token `cutAt` to strike it,
`swap` to replace it, `mark` to underline it. Timings live in the `T` table at the top of the same file.

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
