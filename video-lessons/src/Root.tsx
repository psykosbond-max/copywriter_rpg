import React from 'react';
import { Composition } from 'remotion';
import { CharacterPreview } from './lessons/CharacterPreview';
import { EditDeskScene, ObjectSheet } from './lessons/EditDeskScene';
import { LESSON02_FRAMES, LESSON02_INTRO, Lesson02SoWhatLadder } from './lessons/Lesson02SoWhatLadder';
import { Lesson02Walkthrough, WALKTHROUGH_FRAMES } from './lessons/Lesson02Walkthrough';
import { makeStoryboard } from './lessons/Storyboard';

const HookStoryboard = makeStoryboard(Lesson02SoWhatLadder, 'Intro hook · give me 30 seconds', [
  { frame: 62, title: 'Give me 30 seconds', note: '“Give me” slams in; a vermilion 30 lands and the stopwatch ring starts its sweep.' },
  { frame: 228, title: 'Hook', note: 'Hard cut. The line drops in and its hook catches the word as she says “hook”.' },
  { frame: 306, title: 'The yank', note: 'The line is pulled taut: hook and word fly up out of frame, into the lesson title.' },
]);

const WalkthroughSheet = makeStoryboard(Lesson02Walkthrough, 'Lesson 02 · walkthrough draft · layout check', [
  { frame: 70, title: 'Host enters', note: 'She steps in from the left on twos and raises her hand for the two-beat wave.' },
  { frame: 240, title: 'Present the page', note: 'Open palm toward the landing page as it slides in and settles a hair off true.' },
  { frame: 640, title: 'The problem', note: 'Pushed into the hero: the pointer drags a highlight across the headline; a comment opens; she leans in.' },
  { frame: 1250, title: 'The ladder', note: 'In the draft she taps the SO WHAT? comment; the line is highlighted; the next rung types in.' },
]);

const Lesson02Storyboard = makeStoryboard(Lesson02SoWhatLadder, 'Lesson 02 · The so-what ladder · storyboard', [
  { frame: LESSON02_INTRO + 500, title: 'Top rung', note: 'The feature, stamped. Rack focus: the camera leans in 8% and the ladder below softens.' },
  { frame: LESSON02_INTRO + 1150, title: 'Mid-descent', note: 'Panning down the guide from rung 2 to rung 3; the vermilion car tracks the camera.' },
  { frame: LESSON02_INTRO + 2150, title: 'Final hook', note: 'Pushed into rung 4, underlined by hand; the climb above returns as a breadcrumb.' },
]);
import { LESSON01_FRAMES, Lesson01AdjectivePurge } from './lessons/Lesson01AdjectivePurge';
import { LESSON01_TYPE_FRAMES, Lesson01TypeOnly } from './lessons/Lesson01TypeOnly';
import { VIDEO } from './theme/tokens';

// Composition ids match the output file names, so `remotion render <id>` → <id>.mp4.
// Lessons 02 (SoWhatLadder) and 03 (SentenceRhythm) register here as they are built.
export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Lesson01-AdjectivePurge"
      component={Lesson01AdjectivePurge}
      durationInFrames={LESSON01_FRAMES}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    <Composition id="Lesson02-SoWhatLadder" component={Lesson02SoWhatLadder} durationInFrames={LESSON02_FRAMES} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    <Composition id="Lesson02-Walkthrough-Draft" component={Lesson02Walkthrough} durationInFrames={WALKTHROUGH_FRAMES} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    <Composition id="Walkthrough-Sheet" component={WalkthroughSheet} durationInFrames={WALKTHROUGH_FRAMES} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    <Composition id="Hook-Storyboard" component={HookStoryboard} durationInFrames={LESSON02_FRAMES} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    <Composition id="Lesson02-Storyboard" component={Lesson02Storyboard} durationInFrames={LESSON02_FRAMES} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    {/* the earlier, type-only cut of lesson 01 (no illustration, no narration) */}
    <Composition id="Lesson01-AdjectivePurge-TypeOnly" component={Lesson01TypeOnly} durationInFrames={LESSON01_TYPE_FRAMES} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    {/* style check for the illustrated characters: a single still */}
    <Composition id="CharacterPreview" component={CharacterPreview} durationInFrames={1} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    <Composition id="EditDeskScene" component={EditDeskScene} durationInFrames={1} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    <Composition id="ObjectSheet" component={ObjectSheet} durationInFrames={1} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
  </>
);
