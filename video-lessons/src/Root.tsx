import React from 'react';
import { Composition } from 'remotion';
import { CharacterPreview } from './lessons/CharacterPreview';
import { EditDeskScene, ObjectSheet } from './lessons/EditDeskScene';
import { LESSON02_FRAMES, Lesson02SoWhatLadder } from './lessons/Lesson02SoWhatLadder';
import { makeStoryboard } from './lessons/Storyboard';

const Lesson02Storyboard = makeStoryboard(Lesson02SoWhatLadder, 'Lesson 02 · The so-what ladder · storyboard', [
  { frame: 500, title: 'Top rung', note: 'The feature, stamped. Rack focus: the camera leans in 8% and the ladder below softens.' },
  { frame: 1150, title: 'Mid-descent', note: 'Panning down the guide from rung 2 to rung 3; the vermilion car tracks the camera.' },
  { frame: 2150, title: 'Final hook', note: 'Pushed into rung 4, underlined by hand; the climb above returns as a breadcrumb.' },
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
    <Composition id="Lesson02-Storyboard" component={Lesson02Storyboard} durationInFrames={LESSON02_FRAMES} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    {/* the earlier, type-only cut of lesson 01 (no illustration, no narration) */}
    <Composition id="Lesson01-AdjectivePurge-TypeOnly" component={Lesson01TypeOnly} durationInFrames={LESSON01_TYPE_FRAMES} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    {/* style check for the illustrated characters: a single still */}
    <Composition id="CharacterPreview" component={CharacterPreview} durationInFrames={1} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    <Composition id="EditDeskScene" component={EditDeskScene} durationInFrames={1} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    <Composition id="ObjectSheet" component={ObjectSheet} durationInFrames={1} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
  </>
);
