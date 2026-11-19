import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { HOOK_EXIT, HookBeats, HookIntro } from '../components/HookIntro';
import { OUTRO, Outro } from '../components/Outro';
import { EditorialCharacter, HandShape, POSES, Pose, blendPose } from '../components/EditorialCharacter';
import { Rise } from '../components/Rise';
import { TypewriterReveal } from '../components/TypewriterReveal';
import { Defocus, EditorialStage, STAGE, stageMono } from '../components/stage/EditorialStage';
import { EditorialStamp } from '../components/stage/EditorialStamp';
import { InkUnderline } from '../components/stage/InkUnderline';
import { MarginMetric, MarginNote } from '../components/stage/Margin';
import { Move, Pulse, cameraAt, rackAt } from '../lib/camera';
import { snap } from '../lib/motion';
import { textWidth } from '../lib/sentenceLayout';
import { useFontsReady } from '../theme/fonts';
import { COLOR, FONT } from '../theme/tokens';

/*
  LESSON 02 · THE SO-WHAT LADDER (40 s at 60 fps)

  A feature means nothing to a reader until it reaches their life. The lesson descends a vertical
  ladder of four rungs; each time a "SO WHAT?" stamp lands, the camera travels down the dashed guide
  to the next, plainer, more human rung, and the Editor's Margin scores the copy.

  0.0   Title card
  2.5   Rung 1, the feature, types in; the editor stands looking up at it
  7.8   SO WHAT? (rack focus on the rung) → pan down
  12    Rung 2, the function                    16.3  SO WHAT? → pan down
  20.5  Rung 3, the benefit                     24.8  SO WHAT? → push in
  29    Rung 4, the outcome, large; underlined; the editor rests her chin and nods;
        the three rungs above return as a breadcrumb
*/

// The cold open: "Give me thirty seconds… and I'll teach you how to hook your audience." (ElevenLabs, voice "Sasha").
// Beats are the frames each word lands, from the take's loudness envelope (voice starts at frame 6).
const HOOK: HookBeats = { giveMe: 10, thirty: 35, seconds: 57, teach: 135, hook: 214, audience: 229, out: 292 };
export const LESSON02_INTRO = HOOK.out + HOOK_EXIT;
const LESSON02_CUT = 2330; // the end card's wipe starts once the closing line has landed
export const LESSON02_FRAMES = LESSON02_INTRO + LESSON02_CUT + OUTRO.frames;

const T = {
  titleOut: 140,
  open: 150,
  r1: 210,
  s1: 470,
  pan1: 620,
  r2: 675,
  s2: 980,
  pan2: 1130,
  r3: 1185,
  s3: 1490,
  push: 1640,
  r4: 1760,
  chin: 1700,
  underline: 1880,
  crumbs: 1930,
  nod1: 1990,
  nod2: 2120,
  close: 2170,
} as const;

// ---------- the ladder ----------

const Y = [140, 660, 1180, 1700];
const TEXT_X = 220;
const GUIDE_X = 160;
const RUNGS = [
  { label: 'Rung 01 · The feature', text: 'Our platform features automated multi-channel invoice reconciliation.', at: T.r1 },
  { label: 'Rung 02 · The function', text: 'It matches bank transfers to invoices automatically.', at: T.r2 },
  { label: 'Rung 03 · The benefit', text: 'You don’t spend Friday nights hunting down missing payments.', at: T.r3 },
];
const STAMPS = [T.s1, T.s2, T.s3];
const R4 = { label: 'Rung 04 · The outcome', lines: ['Get your', 'weekends back.'], size: 104 };

const rungFocusY = (k: number) => Y[k] + 260;

const MOVES: Move[] = [
  { at: 0, dur: 0, shot: { cx: STAGE.width / 2, cy: rungFocusY(0), s: 1 } },
  { at: T.pan1, dur: 90, shot: { cx: STAGE.width / 2, cy: rungFocusY(1), s: 1 } },
  { at: T.pan2, dur: 90, shot: { cx: STAGE.width / 2, cy: rungFocusY(2), s: 1 } },
  { at: T.push, dur: 110, shot: { cx: STAGE.width / 2, cy: Y[3] + 138, s: 1.12 } },
];

// hold, snap, breathe: the frame is still before the stamp; the rack lands with it, never ahead of it
const PULSES: Pulse[] = STAMPS.map((s) => ({ at: s, until: s + 84, rise: 14 }));

/** Foley cue markers (rendered to audio in the sound pass). */
export const LESSON02_CUES = [
  ...STAMPS.map((at) => ({ at, kind: 'stamp' as const })),
  ...[T.pan1, T.pan2, T.push].map((at) => ({ at, kind: 'slide' as const })),
  { at: T.underline, kind: 'pencil' as const },
];

const rungText: React.CSSProperties = { fontFamily: FONT.serif, fontSize: 64, fontWeight: 420, lineHeight: 1.16, color: COLOR.ink, letterSpacing: '-0.005em' };

const Rung: React.FC<{ k: number; active: boolean }> = ({ k, active }) => {
  const r = RUNGS[k];
  return (
    <Defocus active={active}>
      <div style={{ position: 'absolute', left: TEXT_X, top: Y[k], width: 900 }}>
        <div style={{ ...stageMono, fontSize: 16, color: COLOR.inkSoft }}>
          <TypewriterReveal text={r.label} startFrame={T.open + 30 + k * 16} framesPerChar={1} caret={false} />
        </div>
        <div style={{ ...rungText, marginTop: 26 }}>
          <TypewriterReveal text={r.text} startFrame={r.at} byWord framesPerWord={7} caretHold={30} />
        </div>
      </div>
      <EditorialStamp text="So what?" at={STAMPS[k]} rotate={-7 + k * 3} style={{ left: 930, top: Y[k] + 52 }} />
    </Defocus>
  );
};

const FinalRung: React.FC = () => {
  const underlineW = textWidth('weekends', { fontSize: R4.size, fontWeight: 600, fontFamily: FONT.serif });
  return (
    <Defocus active>
      <div style={{ position: 'absolute', left: TEXT_X, top: Y[3] }}>
        <div style={{ ...stageMono, fontSize: 16, color: COLOR.red }}>
          <TypewriterReveal text={R4.label} startFrame={T.open + 78} framesPerChar={1} caret={false} />
        </div>
        <div style={{ marginTop: 30 }}>
          {R4.lines.map((l, i) => (
            <div key={l} style={{ position: 'relative', height: R4.size * 1.1 }}>
              <Rise words={l.split(' ')} at={T.r4 + i * 20} every={12} style={{ fontFamily: FONT.serif, fontSize: R4.size, fontWeight: 600, lineHeight: 1.02, color: COLOR.ink, letterSpacing: '-0.02em' }} />
              {/* the takeaway word, underlined by hand just under its baseline */}
              {i === 1 ? <InkUnderline width={underlineW} at={T.underline} style={{ position: 'absolute', left: 0, top: R4.size * 0.98 }} /> : null}
            </div>
          ))}
        </div>
      </div>
    </Defocus>
  );
};

const Guide: React.FC<{ markerY: number }> = ({ markerY }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const draw = snap(frame, fps, T.open + 10, 90);
  const top = Y[0] + 8;
  const bottom = Y[3] + 8;
  return (
    <Defocus>
      <svg width={STAGE.width} height={Y[3] + 400} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {/* the dashed guide down the ladder, and the travelled part in vermilion */}
        <line x1={GUIDE_X} y1={top} x2={GUIDE_X} y2={top + (bottom - top) * draw} stroke={COLOR.ink} strokeOpacity={0.3} strokeWidth={2} strokeDasharray="6 12" />
        <line x1={GUIDE_X} y1={top} x2={GUIDE_X} y2={Math.max(top, markerY)} stroke={COLOR.red} strokeWidth={3} />
        {Y.map((y, i) => (
          <g key={i}>
            <line x1={GUIDE_X - 18} x2={GUIDE_X + 18} y1={y + 8} y2={y + 8} stroke={COLOR.ink} strokeWidth={2} />
            <circle cx={GUIDE_X} cy={y + 8} r={7} fill={markerY >= y + 6 ? COLOR.red : COLOR.paper} stroke={markerY >= y + 6 ? COLOR.red : COLOR.ink} strokeWidth={2} />
          </g>
        ))}
        {/* the elevator car */}
        <rect x={GUIDE_X - 8} y={markerY - 8} width={16} height={16} fill={COLOR.red} />
      </svg>
    </Defocus>
  );
};

/** The three rungs above, in miniature, returning as a breadcrumb over the final hook. */
const Breadcrumb: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: 'absolute', left: 210, top: 150, width: 1000 }}>
      {RUNGS.map((r, i) => {
        const p = snap(frame, fps, T.crumbs + i * 12, 26);
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 18, height: 50, opacity: p, transform: `translateY(${(1 - p) * -12}px)` }}>
            <span style={{ ...stageMono, fontSize: 14, color: COLOR.inkSoft, width: 34 }}>0{i + 1}</span>
            <span style={{ fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 25, color: COLOR.inkSoft, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 660 }}>{r.text}</span>
            <span style={{ ...stageMono, fontSize: 13, color: COLOR.red, whiteSpace: 'nowrap' }}>↓ so what?</span>
          </div>
        );
      })}
    </div>
  );
};

const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = snap(frame, fps, T.titleOut, 22);
  return (
    <AbsoluteFill style={{ padding: '0 160px', justifyContent: 'center', opacity: 1 - out, transform: `translateY(${-40 * out}px)`, background: COLOR.paper }}>
      <div style={{ ...stageMono, fontSize: 22, color: COLOR.red, marginBottom: 40 }}>
        <TypewriterReveal text="Lesson 02 — Copywriting fundamentals" startFrame={4} framesPerChar={2} caretHold={16} />
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 40 }}>
        <Rise words={['The', 'so-what']} at={18} every={8} style={{ fontFamily: FONT.display, fontSize: 150, fontWeight: 560, letterSpacing: '0.02em', textTransform: 'uppercase', color: COLOR.ink, lineHeight: 1 }} />
        <Rise words={['ladder.']} at={46} every={8} style={{ fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 172, fontWeight: 400, color: COLOR.red, lineHeight: 1 }} />
      </div>
    </AbsoluteFill>
  );
};

// ---------- the editor ----------

const editorPose = (frame: number, fps: number): { pose: Pose; hand: HandShape } => {
  // looks up at rung 1, then her gaze follows the camera down
  const head = -8 + 6 * snap(frame, fps, T.pan1, 90) + 5 * snap(frame, fps, T.pan2, 90) + 3 * snap(frame, fps, T.push, 90);
  // a small flinch back at each stamp
  const flinch = STAMPS.reduce((a, s) => a - 2.5 * (snap(frame, fps, s, 6) - snap(frame, fps, s + 8, 26)), 0);
  const stand: Pose = { ...POSES.standing, head, lean: -1.5 + flinch };
  const c = snap(frame, fps, T.chin, 50);
  const nod = [T.nod1, T.nod2].reduce((a, n) => a + 3.5 * (snap(frame, fps, n, 22) - snap(frame, fps, n + 26, 30)), 0);
  const pose = blendPose(stand, POSES.chinRest, c);
  return { pose: { ...pose, head: pose.head + nod }, hand: c > 0.5 ? 'chin' : 'relaxed' };
};

// ---------- composition ----------

const Lesson02Body: React.FC = () => {
  const ready = useFontsReady();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!ready) return <AbsoluteFill style={{ background: COLOR.paper }} />;

  const open = snap(frame, fps, T.open, 40);
  const rack = rackAt(PULSES, frame, fps);
  const cam = cameraAt(MOVES, frame, fps);
  const active = frame < T.pan1 + 45 ? 0 : frame < T.pan2 + 45 ? 1 : frame < T.push + 45 ? 2 : 3;
  const markerY = cam.cy - 260 + 8 + (cam.s > 1.01 ? (Y[3] + 8 - (cam.cy - 260 + 8)) * Math.min(1, (cam.s - 1) / 0.12) : 0);
  const close = snap(frame, fps, T.close, 30);

  const world = (
    <div style={{ opacity: open }}>
      <Guide markerY={Math.min(markerY, Y[3] + 8)} />
      {RUNGS.map((_, k) => (
        <Rung key={k} k={k} active={k === active} />
      ))}
      <FinalRung />
    </div>
  );

  const foreground = (
    <>
      <EditorialCharacter poseAt={(f) => editorPose(f, fps).pose} handAt={(f) => editorPose(f, fps).hand} seed={5} flip height={540} style={{ position: 'absolute', left: 1010, top: 1030 - 540 * (748 / 780), opacity: open }} />
      <Breadcrumb />
      <div style={{ position: 'absolute', left: 120, top: 930, ...stageMono, fontSize: 18, color: COLOR.inkSoft, opacity: close, display: 'flex', gap: 16, alignItems: 'center' }}>
        <span style={{ width: 28, height: 2, background: COLOR.red, display: 'inline-block' }} />
        Keep asking “so what?” until a person appears
      </div>
    </>
  );

  const at = (i: number) => [0, T.r2 + 70, T.r3 + 80, T.r4 + 40][i];
  const margin = (
    <>
      <MarginMetric label="Rung" steps={[1, 2, 3, 4].map((v, i) => ({ at: [0, T.pan1, T.pan2, T.push][i], value: v }))} max={4} format={(v) => `${Math.round(v)}/4`} appearAt={T.open + 20} />
      <MarginMetric label="Jargon terms" steps={[4, 1, 0, 0].map((v, i) => ({ at: at(i), value: v }))} max={5} appearAt={T.open + 28} />
      <MarginMetric label="Reading grade" steps={[16, 8, 5, 2].map((v, i) => ({ at: at(i), value: v }))} max={18} appearAt={T.open + 36} />
      <MarginMetric label="Words about the reader" steps={[0, 0, 2, 2].map((v, i) => ({ at: at(i), value: v }))} max={3} appearAt={T.open + 44} />
      <MarginMetric label="Emotional pull" steps={[5, 20, 70, 95].map((v, i) => ({ at: at(i), value: v }))} max={100} unit="%" appearAt={T.open + 52} />
      <MarginNote
        notes={[
          { at: T.r1 + 60, text: 'Describes the machine.' },
          { at: at(1), text: 'Describes what it does.' },
          { at: at(2), text: 'Describes the reader’s Friday.' },
          { at: at(3), text: 'Describes what they want.' },
        ]}
      />
    </>
  );

  return (
    <AbsoluteFill style={{ background: COLOR.paper }}>
      <EditorialStage moves={MOVES} rack={rack} open={open} title="Lesson 02 / The so-what ladder" world={world} foreground={foreground} margin={margin} />
      {frame < T.titleOut + 30 ? <TitleCard /> : null}
    </AbsoluteFill>
  );
};

export const Lesson02SoWhatLadder: React.FC = () => (
  <AbsoluteFill style={{ background: COLOR.paper }}>
    <Sequence durationInFrames={LESSON02_INTRO} layout="none">
      <HookIntro beats={HOOK} seconds={30} />
      <Sequence from={6} layout="none">
        <Audio src={staticFile('audio/shared/hook.mp3')} />
      </Sequence>
    </Sequence>
    <Sequence from={LESSON02_INTRO} durationInFrames={LESSON02_CUT + OUTRO.wipe} layout="none">
      <Lesson02Body />
    </Sequence>
    <Sequence from={LESSON02_INTRO + LESSON02_CUT} durationInFrames={OUTRO.frames} layout="none">
      <Outro lesson="Lesson 02 · The so-what ladder" />
    </Sequence>
  </AbsoluteFill>
);
