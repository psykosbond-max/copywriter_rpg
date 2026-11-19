import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { snap } from '../lib/motion';
import { useFontsReady } from '../theme/fonts';
import { COLOR, FONT, TYPE } from '../theme/tokens';
import { EditorialCharacter, POSES, blendPose } from './EditorialCharacter';
import { WipeTearTransition } from './transitions/WipeTearTransition';
import { Rise } from './Rise';
import { TypewriterReveal } from './TypewriterReveal';
import { InkUnderline } from './stage/InkUnderline';
import { PaperBreath } from './stage/PaperBreath';

/*
  Outro: the series end card. "For more lessons like this… head to workexp.org."

  It arrives with a TEAR: the lesson's last sheet is torn away to reveal the end card underneath.
  The editor stands at the right and points to the address as it is spoken; the address is underlined by hand.
  Voice: ElevenLabs "Sasha", public/audio/shared/outro.mp3 (starts at OUTRO.voice).
*/

export const OUTRO = { wipe: 30, voice: 24, line: 28, url: 168, org: 222, point: 160, underline: 252, frames: 390 } as const;

const mono: React.CSSProperties = {
  fontFamily: FONT.mono, fontSize: TYPE.mono.size, fontWeight: 500, letterSpacing: TYPE.mono.tracking, textTransform: 'uppercase', color: COLOR.ink, lineHeight: 1,
};

export const Outro: React.FC<{ lesson: string }> = ({ lesson }) => {
  const ready = useFontsReady();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!ready) return null;

  const poseAt = (f: number) => blendPose(POSES.standing, POSES.pointing, snap(f, fps, OUTRO.point, 40));
  const handAt = (f: number) => (snap(f, fps, OUTRO.point, 40) > 0.5 ? 'point' : 'relaxed') as 'point' | 'relaxed';
  const fade = snap(frame, fps, OUTRO.frames - 40, 30);

  return (
    <>
      <WipeTearTransition at={0} dur={OUTRO.wipe} variant="tear" seed="outro">
        <AbsoluteFill style={{ opacity: 1 - fade }}>
          <div style={{ position: 'absolute', left: 160, top: 300, ...mono, color: COLOR.red }}>
            <TypewriterReveal text="For more lessons like this" startFrame={OUTRO.line} framesPerChar={2} caretHold={24} />
          </div>
          <div style={{ position: 'absolute', left: 152, top: 380, display: 'flex', alignItems: 'baseline' }}>
            <Rise words={['workexp']} at={OUTRO.url} every={0} style={{ fontFamily: FONT.display, fontSize: 190, fontWeight: 600, letterSpacing: '-0.01em', color: COLOR.ink, lineHeight: 1 }} />
            <Rise words={['.org']} at={OUTRO.org} every={0} style={{ fontFamily: FONT.display, fontSize: 190, fontWeight: 600, letterSpacing: '-0.01em', color: COLOR.red, lineHeight: 1 }} />
          </div>
          <InkUnderline width={660} at={OUTRO.underline} dur={40} thickness={9} style={{ position: 'absolute', left: 160, top: 600 }} />
          <div style={{ position: 'absolute', left: 160, top: 930, ...mono, fontSize: 18, color: COLOR.inkSoft, display: 'flex', gap: 16, alignItems: 'center' }}>
            <span style={{ width: 13, height: 13, background: COLOR.red, display: 'inline-block' }} />
            {lesson} · Copywriting fundamentals
          </div>
          <EditorialCharacter poseAt={poseAt} handAt={handAt} seed={7} flip height={520} style={{ position: 'absolute', left: 1430, top: 980 - 520 * (748 / 780) }} />
          <div style={{ position: 'absolute', left: 160, right: 160, top: 980, height: 2, background: COLOR.inkFaint }} />
        </AbsoluteFill>
        <PaperBreath />
      </WipeTearTransition>
      <Sequence from={OUTRO.voice} layout="none">
        <Audio src={staticFile('audio/shared/outro.mp3')} />
      </Sequence>
    </>
  );
};
