import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { EditorialCharacter, HandShape, POSES, Pose, blendPose, nodAt, waveAt } from '../components/EditorialCharacter';
import { EditorialBrowserMockup, HERO } from '../components/mockups/EditorialBrowserMockup';
import { EditorialCursor } from '../components/mockups/EditorialCursor';
import { DocComment, DocLine, EditorialDocMockup } from '../components/mockups/EditorialDocMockup';
import { PaperBreath } from '../components/stage/PaperBreath';
import { PaperSlapTransition } from '../components/transitions/PaperSlapTransition';
import { Move, cameraAt } from '../lib/camera';
import { snap } from '../lib/motion';
import { useFontsReady } from '../theme/fonts';
import { COLOR, FONT, TYPE } from '../theme/tokens';

/*
  LESSON 02 · THE SO-WHAT LADDER, as a guided walkthrough (draft: acts 1–3).

  1  Cold open (0–6.5 s)      The host walks in from the left, waves, and offers the landing page as it slides in.
  2  The problem (6.5–14 s)   The camera pushes into the hero; the pointer drags a highlight across the bloated
                              headline; a margin comment opens; the host leans in to study it.
  3  The ladder (14–32 s)     Paper slap to the working draft. For each rung she taps the SO WHAT? comment, the
                              line is highlighted, and the next, plainer line types in under a blinking caret.
  4  The payoff (32–40 s)     (next) Tear back to the page and a phone; the four-word headline snaps into the hero.
*/

export const WALKTHROUGH_FRAMES = 1920;

const T = {
  enter: 0, arrive: 96, wave: 64, slideIn: 150, present: 168,
  push: 390, cursorIn: 450, press: 500, drag: 506, comment: 572, inspect: 596,
  toDoc: 840,
  tap1: 950, type1: 1000,
  tap2: 1236, type2: 1280,
  tap3: 1520, type3: 1564,
} as const;

// lines spoken in each act (placeholder windows until the narration is recorded): drive her mouth
const SPEAKING: [number, number][] = [[40, 360], [420, 520], [600, 800], [880, 940], [1150, 1230], [1440, 1515], [1660, 1800]];
const speakingAt = (f: number) => SPEAKING.some(([a, b]) => f >= a && f < b);

const FPS = 60;
const FLOOR = 980;
const H = 640;
const top = (h: number) => FLOOR - h * (748 / 780);

// ---------- act 1–2: the host and the landing page ----------

const BROWSER_AT = { x: 600, y: 180 };

const hostPoseAt = (f: number): Pose => {
  const wave = waveAt(f, T.wave + 26, FPS, 2);
  const up = snap(f, FPS, T.wave, 22) - snap(f, FPS, T.wave + 26 + 52, 24);
  const present = snap(f, FPS, T.present, 30) - snap(f, FPS, T.inspect, 34);
  const inspect = snap(f, FPS, T.inspect, 34);
  let p = blendPose(POSES.standing, POSES.waveGreeting, up);
  p = { ...p, frontFore: p.frontFore + wave * up };
  p = blendPose(p, POSES.presentOpen, present);
  p = blendPose(p, POSES.inspectLean, inspect);
  return p;
};
const hostHandAt = (f: number): HandShape => {
  const up = snap(f, FPS, T.wave, 22) - snap(f, FPS, T.wave + 26 + 52, 24);
  if (up > 0.4) return 'open';
  const present = snap(f, FPS, T.present, 30) - snap(f, FPS, T.inspect, 34);
  return present > 0.5 ? 'open' : 'relaxed';
};
const hostWalkAt = (f: number) => (f < T.arrive ? 1 - snap(f, FPS, T.arrive - 16, 16) : 0);

const MOVES: Move[] = [
  { at: 0, dur: 0, shot: { cx: 960, cy: 540, s: 1 } },
  // push into the hero headline; the host stays in at the left edge
  { at: T.push, dur: 70, shot: { cx: BROWSER_AT.x + HERO.x + 300, cy: BROWSER_AT.y + HERO.y + 70, s: 1.42 } },
];

const HEADLINE = 'Our platform features automated multi-channel invoice reconciliation.';

const PageScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = cameraAt(MOVES, frame, fps);

  // the host walks in from beyond the left edge, stepping on twos
  const walkX = interpolate(snap(frame, fps, T.enter, T.arrive), [0, 1], [-520, 70]);
  // the page slides in from the right and comes to rest a hair off true
  const slide = snap(frame, fps, T.slideIn, 40);
  const bx = BROWSER_AT.x + (1 - slide) * 1500;
  const brot = (1 - slide) * 2.2 - 0.3;

  // the pointer: in from below-right, onto the first word, press, drag across the headline
  const cIn = snap(frame, fps, T.cursorIn, 44);
  const hx = bx + HERO.x;
  const hy = BROWSER_AT.y + HERO.y;
  const drag = interpolate(frame, [T.drag, T.drag + 56], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => t * t * (3 - 2 * t) });
  const cx = interpolate(cIn, [0, 1], [hx + 900, hx - 6]) + drag * 520;
  const cy = interpolate(cIn, [0, 1], [hy + 520, hy + 18]) + drag * 112;
  const press = frame >= T.press ? Math.min(1, (frame - T.press) / 18) : 0;

  return (
    <div style={{ position: 'absolute', inset: 0, transformOrigin: '0 0', transform: `translate(${960 - cam.cx * cam.s}px, ${540 - cam.cy * cam.s}px) scale(${cam.s})` }}>
      <div style={{ position: 'absolute', left: 160, right: 160, top: FLOOR, height: 2, background: COLOR.inkFaint }} />
      <EditorialBrowserMockup
        headline={HEADLINE}
        selection={frame >= T.drag ? { from: 0, to: 6, p: drag } : undefined}
        style={{ left: bx, top: BROWSER_AT.y, transform: `rotate(${brot}deg)`, transformOrigin: '50% 100%' }}
      >
        {/* the margin comment, opening beside the headline */}
        <BrowserComment at={T.comment} x={HERO.x + HERO.w - 30} y={HERO.y + 128} />
      </EditorialBrowserMockup>
      <EditorialCharacter
        poseAt={hostPoseAt}
        handAt={hostHandAt}
        walkAt={hostWalkAt}
        speakingAt={speakingAt}
        seed={5}
        height={H}
        style={{ position: 'absolute', left: walkX, top: top(H) }}
      />
      <EditorialCursor x={cx} y={cy} press={press} visible={frame >= T.cursorIn ? cIn : 0} />
    </div>
  );
};

const BrowserComment: React.FC<{ at: number; x: number; y: number }> = ({ at, x, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = snap(frame, fps, at, 16);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: 330, padding: '16px 18px 18px 22px', boxSizing: 'border-box', background: '#FBFAF6', borderRadius: 10, opacity: p, transform: `scale(${0.86 + 0.14 * p})`, transformOrigin: '0 100%', outline: `2px solid ${COLOR.red}` }}>
      <div style={{ position: 'absolute', left: 0, top: 12, bottom: 12, width: 5, borderRadius: 3, background: COLOR.red }} />
      <div style={{ fontFamily: FONT.mono, fontSize: 11, letterSpacing: TYPE.mono.tracking, textTransform: 'uppercase', color: COLOR.inkSoft }}>Editor · comment</div>
      <div style={{ fontFamily: FONT.serif, fontSize: 22, lineHeight: 1.3, color: COLOR.ink, marginTop: 8 }}>
        Nobody buys “reconciliation.” <span style={{ color: COLOR.red }}>What does it do for me?</span>
      </div>
    </div>
  );
};

// ---------- act 3: the working draft ----------

const DOC_AT = { x: 160, y: 140 };
const RUNGS = [
  { label: 'Feature', text: HEADLINE },
  { label: 'Rung 01 · So what?', text: 'It matches bank transfers to open invoices automatically.', at: T.type1, tap: T.tap1 },
  { label: 'Rung 02 · So what?', text: 'You stop spending Friday nights hunting down missing payments.', at: T.type2, tap: T.tap2 },
  { label: 'Rung 03 · The hook', text: 'Get your weekends back.', at: T.type3, tap: T.tap3, final: true },
];
const TAPS = [T.tap1, T.tap2, T.tap3];

const editorDocPoseAt = (f: number): Pose => {
  // between taps she stands presenting the draft; for each tap she reaches out and touches the comment
  const reach = TAPS.reduce((m, t) => Math.max(m, snap(f, FPS, t - 22, 20) - snap(f, FPS, t + 26, 26)), 0);
  const base = blendPose(POSES.standing, POSES.presentOpen, 0.4);
  const p = blendPose(base, POSES.tapCallout, reach);
  return { ...p, head: p.head + nodAt(f, T.type3 + 90, 4) };
};
const editorDocHandAt = (f: number): HandShape => {
  const reach = TAPS.reduce((m, t) => Math.max(m, snap(f, FPS, t - 22, 20) - snap(f, FPS, t + 26, 26)), 0);
  return reach > 0.35 ? 'point' : 'relaxed';
};
const editorDocWalkAt = (f: number) => (f < T.toDoc + 70 ? 1 - snap(f, FPS, T.toDoc + 54, 16) : 0);

const DocScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lines: DocLine[] = RUNGS.map((r, i) => {
    if (i === 0) {
      const sel = frame >= T.tap1 - 46 && frame < T.type1 ? { from: 0, to: 6, p: snap(frame, fps, T.tap1 - 46, 22) } : undefined;
      return { label: r.label, text: r.text, selection: sel, struck: snap(frame, fps, T.type1 - 6, 10) * 0.0 + (frame > T.type1 ? 0 : 0) };
    }
    const typed = Math.max(0, (frame - (r.at as number)) / (r.final ? 3 : 1.9));
    const next = RUNGS[i + 1];
    const sel = next && next.tap && frame >= next.tap - 46 && frame < (next.at as number) ? { from: 0, to: r.text.split(' ').length - 1, p: snap(frame, fps, next.tap - 46, 22) } : undefined;
    return { label: r.label, text: r.text, typed, show: snap(frame, fps, (r.at as number) - 10, 12), selection: sel, final: r.final };
  });
  const comments: DocComment[] = TAPS.map((t, i) => ({ line: i, at: t, title: i === 2 ? 'So what? (again)' : 'So what?', body: ['Who is this for, and what changes?', 'Closer. What does that feel like?', 'There it is. Say only that.'][i], resolved: snap(frame, fps, (RUNGS[i + 1].at as number) + 60, 20) }));
  // she walks in from the right edge, facing left, toward the draft
  const walkX = interpolate(snap(frame, fps, T.toDoc + 4, 70), [0, 1], [1980, 1372]);
  return (
    <>
      <EditorialDocMockup title="Homepage hero · draft 3" lines={lines} comments={comments} style={{ left: DOC_AT.x, top: DOC_AT.y }} />
      <EditorialCharacter
        poseAt={editorDocPoseAt}
        handAt={editorDocHandAt}
        walkAt={editorDocWalkAt}
        speakingAt={speakingAt}
        seed={5}
        flip
        height={H}
        style={{ position: 'absolute', left: walkX, top: top(H) }}
      />
      <div style={{ position: 'absolute', left: 160, right: 160, top: FLOOR, height: 2, background: COLOR.inkFaint }} />
    </>
  );
};

// ---------- composition ----------

export const Lesson02Walkthrough: React.FC = () => {
  const ready = useFontsReady();
  const frame = useCurrentFrame();
  if (!ready) return <AbsoluteFill style={{ background: COLOR.paper }} />;
  return (
    <AbsoluteFill style={{ background: COLOR.paper, overflow: 'hidden' }}>
      {frame < T.toDoc + 16 ? <PageScene /> : null}
      {frame >= T.toDoc ? (
        <PaperSlapTransition at={T.toDoc} seed="doc" rest={-0.35}>
          <DocScene />
        </PaperSlapTransition>
      ) : null}
      <div style={{ position: 'absolute', left: 160, top: 64, display: 'flex', alignItems: 'center', gap: 16, fontFamily: FONT.mono, fontSize: 18, fontWeight: 500, letterSpacing: TYPE.mono.tracking, textTransform: 'uppercase', color: COLOR.ink }}>
        <span style={{ width: 13, height: 13, background: COLOR.red, display: 'inline-block' }} />
        Lesson 02 / The so-what ladder
      </div>
      <PaperBreath />
    </AbsoluteFill>
  );
};

