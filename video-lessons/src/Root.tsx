import React from 'react';
import { Composition } from 'remotion';
import { CharacterPreview } from './lessons/CharacterPreview';
import { EditDeskScene, ObjectSheet } from './lessons/EditDeskScene';
import { LESSON01_FRAMES, Lesson01AdjectivePurge } from './lessons/Lesson01AdjectivePurge';
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
    {/* style check for the illustrated characters: a single still */}
    <Composition id="CharacterPreview" component={CharacterPreview} durationInFrames={1} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    <Composition id="EditDeskScene" component={EditDeskScene} durationInFrames={1} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
    <Composition id="ObjectSheet" component={ObjectSheet} durationInFrames={1} fps={VIDEO.fps} width={VIDEO.width} height={VIDEO.height} />
  </>
);
