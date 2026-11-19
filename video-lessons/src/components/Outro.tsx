import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { snap } from '../lib/motion';
import { useFontsReady } from '../theme/fonts';
import { COLOR, FONT, TYPE } from '../theme/tokens';
import { EditorialCharacter, POSES, blendPose } from './EditorialCharacter';
import { Rise } from './Rise';
import { TypewriterReveal } from './TypewriterReveal';
import { InkUnderline } from './stage/InkUnderline';
import { PaperBreath } from './stage/PaperBreath';

/*
  Outro: the series end card. "For more lessons like this… head to workexp.org."

  It arrives with a REDLINE WIPE: a vermilion edge sweeps left to right across the last frame of the
  lesson, and the end card is revealed behind it, the way an editor's rule clears a page.
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

  // the wipe: eased, so the edge leaves fast and settles at the right
  const w = interpolate(frame, [0, OUTRO.wipe], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 3) });
  const edgeX = w * 1940;
  const point = snap(frame, fps, OUTRO.point, 40);
  const pose = blendPose(POSES.standing, POSES.pointing, point);
  const fade = snap(frame, fps, OUTRO.frames - 40, 30);

  return (
    <>
      <AbsoluteFill style={{ clipPath: `inset(0 ${100 - w * 100}% 0 0)`, background: COLOR.paper }}>
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
          <EditorialCharacter pose={pose} frontHand={point > 0.5 ? 'point' : 'relaxed'} flip height={520} style={{ position: 'absolute', left: 1430, top: 980 - 520 * (748 / 780) }} />
          <div style={{ position: 'absolute', left: 160, right: 160, top: 980, height: 2, background: COLOR.inkFaint }} />
        </AbsoluteFill>
        <PaperBreath />
      </AbsoluteFill>
      {/* the vermilion edge of the wipe */}
      {w < 1 ? <div style={{ position: 'absolute', top: 0, bottom: 0, left: edgeX - 10, width: 10, background: COLOR.red }} /> : null}
      <Sequence from={OUTRO.voice} layout="none">
        <Audio src={staticFile('audio/shared/outro.mp3')} />
      </Sequence>
    </>
  );
};
