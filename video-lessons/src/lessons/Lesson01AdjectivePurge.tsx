import React from 'react';
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { HOOK_EXIT, HookBeats, HookIntro } from '../components/HookIntro';
import { OUTRO, Outro } from '../components/Outro';
import { EditorialCharacter, POSES, blendPose } from '../components/EditorialCharacter';
import { CoffeeCup, CoffeeMachine, Desk, DeskLamp, Easel, Manuscript, Stopwatch, Strike } from '../components/EditorialObjects';
import { CUT, KineticSentence, Token, countWords } from '../components/KineticSentence';
import { TypewriterReveal } from '../components/TypewriterReveal';
import { PrintZoom } from '../components/print/Print';
import { snap } from '../lib/motion';
import { useFontsReady } from '../theme/fonts';
import { COLOR, FONT, GRID, TYPE } from '../theme/tokens';

/*
  LESSON 01 · THE ADJECTIVE PURGE (37 s at 60 fps), narrated.

  An illustrated editor at an easel, a desk with the product on it, and the sentence itself.
  The camera moves between them: wide on the scene, into the page for the redlines, back out to the
  desk for the proof, and wide again for the rule.

  0.0   Title card                                 "Lesson one. The adjective purge."
  3.4   Wide: the editor reads the draft          "Here's a first draft. Fourteen words… and most of them are praise."
  8.7   Push into the page → the sentence          "So cut every adjective. Innovative. Award-winning. Next-generation."
  15.5  The rest are struck in a run               "If a rival could say it… it goes."
  19.1  The survivors re-set; noun and verb marked "What's left does the work. A machine… that brews."
  22.8  Desk: the machine pours                    "Now swap the praise for proof."
  25    Stopwatch sweeps to forty                  "How fast is it? Forty seconds."
  27.6  The sentence: cup. → cup in 40 seconds.
  29.8  Wide: the editor marks the page; the rule  "If a rival could say it… cut it."

  Narration: ElevenLabs (eleven_v4, voice "Sasha"), one take, split into phrases placed on their beats.
  Sound: ElevenLabs sound effects (grease pencil, espresso pour, stopwatch).
*/

const BODY_CUT = 2075; // the end card's redline wipe starts here, once the metrics have landed

// Cold open (shared with lesson 02): "Give me thirty seconds… and I'll teach you how to hook your audience."
const HOOK: HookBeats = { giveMe: 10, thirty: 35, seconds: 57, teach: 135, hook: 214, audience: 229, out: 292 };
export const LESSON01_INTRO = HOOK.out + HOOK_EXIT;
export const LESSON01_FRAMES = LESSON01_INTRO + BODY_CUT + OUTRO.frames;

const T = {
  titleOut: 190,
  sceneIn: 204,
  pushEasel: 330,
  draftType: 250,
  nod: 470,
  lean: 520,
  pushPage: 520,
  toType: 576,
  typeIn: 600,
  cut0: 750,
  cut1: 810,
  cut2: 870,
  run: 940, // cuts 3–7, one every 34 frames
  runEvery: 34,
  reflow: 1145,
  noun: 1252,
  verb: 1304,
  toDesk: 1370,
  pour: 1395,
  toWatch: 1490,
  sweep: 1520,
  forty: 1610,
  toType2: 1656,
  swap: 1690,
  toWide: 1786,
  point: 1795,
  rule: 1830,
  marks: 1850,
  metrics: 2010,
} as const;

const runCut = (i: number) => T.run + i * T.runEvery;

const SENTENCE: Token[] = [
  { text: 'Our' },
  { text: 'innovative,', cutAt: T.cut0 },
  { text: 'award-winning,', cutAt: T.cut1 },
  { text: 'next-generation', cutAt: T.cut2 },
  { text: 'coffee' },
  { text: 'machine', mark: { label: 'NOUN', at: T.noun } },
  { text: 'effortlessly', cutAt: runCut(0) },
  { text: 'brews', mark: { label: 'VERB', at: T.verb } },
  { text: 'a' },
  { text: 'truly', cutAt: runCut(1) },
  { text: 'delicious,', cutAt: runCut(2) },
  { text: 'perfectly', cutAt: runCut(3) },
  { text: 'balanced', cutAt: runCut(4) },
  { text: 'cup.', swap: { to: 'cup in 40 seconds.', at: T.swap } },
];
const REVEAL_EVERY = 5;

const PAGE_STRIKES: Strike[] = [
  { line: 1, from: 64, to: 196 },
  { line: 3, from: 0, to: 150 },
  { line: 5, from: 92, to: 214 },
];

// ---------- sound ----------

// Phrases of the narration take (seconds in narration.mp3, found by silence detection) and the frame each one starts.
const VO: { from: number; to: number; at: number }[] = [
  { from: 0.0, to: 2.95, at: 15 }, // Lesson one. The adjective purge.
  { from: 3.5, to: 7.85, at: T.draftType }, // Here's a first draft. Fourteen words… and most of them are praise.
  { from: 8.33, to: 10.05, at: 640 }, // So cut every adjective.
  { from: 10.45, to: 11.05, at: T.cut0 - 4 }, // Innovative.
  { from: 11.4, to: 12.2, at: T.cut1 - 4 }, // Award-winning.
  { from: 12.55, to: 13.62, at: T.cut2 - 4 }, // Next-generation.
  { from: 14.1, to: 16.4, at: T.run - 10 }, // If a rival could say it… it goes.
  { from: 16.94, to: 18.42, at: 1150 }, // What's left does the work.
  { from: 18.77, to: 19.42, at: T.noun - 4 }, // A machine…
  { from: 19.8, to: 20.62, at: T.verb - 4 }, // that brews.
  { from: 21.14, to: 22.85, at: 1384 }, // Now swap the praise for proof.
  { from: 23.18, to: 24.02, at: 1500 }, // How fast is it?
  { from: 24.42, to: 25.34, at: T.forty - 6 }, // Forty seconds.
  { from: 25.8, to: 28.37, at: T.rule }, // If a rival could say it… cut it.
];

const PENCIL_LEAD = 20; // the pencil take has ~0.35 s of air before the scratch
const strikesAt = [
  T.cut0, T.cut1, T.cut2, ...[0, 1, 2, 3, 4].map(runCut), // the sentence
  T.marks, T.marks + 35, T.marks + 70, // the page, at the end
];

const Soundtrack: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <>
      {VO.map((v, i) => (
        <Sequence key={`vo${i}`} from={v.at} durationInFrames={Math.round((v.to - v.from) * fps)} layout="none">
          <Audio src={staticFile('audio/lesson01/narration.mp3')} trimBefore={Math.round(v.from * fps)} />
        </Sequence>
      ))}
      {strikesAt.map((at, i) => (
        <Sequence key={`p${i}`} from={at - PENCIL_LEAD} durationInFrames={60} layout="none">
          <Audio src={staticFile(`audio/lesson01/sfx-pencil-${(i % 4) + 1}.mp3`)} volume={0.85} />
        </Sequence>
      ))}
      <Sequence from={T.pour - 28} durationInFrames={250} layout="none">
        <Audio src={staticFile('audio/lesson01/sfx-espresso.mp3')} volume={(f) => interpolate(f, [0, 12, 190, 250], [0, 0.9, 0.9, 0], { extrapolateRight: 'clamp' })} />
      </Sequence>
      <Sequence from={T.sweep - 6} durationInFrames={T.forty - T.sweep + 30} layout="none">
        <Audio src={staticFile('audio/lesson01/sfx-stopwatch.mp3')} playbackRate={2} volume={(f) => interpolate(f, [0, 6, T.forty - T.sweep + 10, T.forty - T.sweep + 30], [0, 0.9, 0.9, 0], { extrapolateRight: 'clamp' })} />
      </Sequence>
    </>
  );
};

// ---------- type ----------

const mono: React.CSSProperties = {
  fontFamily: FONT.mono, fontSize: TYPE.mono.size, fontWeight: 500, letterSpacing: TYPE.mono.tracking,
  textTransform: 'uppercase', color: COLOR.ink, lineHeight: 1,
};

/** Words that rise into place out of a clipped line, one after another. */
const Rise: React.FC<{ words: string[]; at: number; every: number; style: React.CSSProperties; gap?: string }> = ({ words, at, every, style, gap = '0.26em' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <span style={{ display: 'inline-flex', gap, fontSize: style.fontSize }}>
      {words.map((w, i) => {
        const p = snap(frame, fps, at + i * every, 26);
        return (
          <span key={i} style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: '0.1em' }}>
            <span style={{ display: 'inline-block', transform: `translateY(${(1 - p) * 110}%)`, ...style }}>{w}</span>
          </span>
        );
      })}
    </span>
  );
};

const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = snap(frame, fps, T.titleOut, 24);
  return (
    <AbsoluteFill style={{ padding: `0 ${GRID.marginX}px`, justifyContent: 'center', opacity: 1 - out, transform: `translateY(${-50 * out}px)` }}>
      <div style={{ ...mono, color: COLOR.red, marginBottom: 40 }}>
        <TypewriterReveal text="Lesson 01 — Copywriting fundamentals" startFrame={6} framesPerChar={2} caretHold={20} />
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 40 }}>
        <Rise words={['The', 'adjective']} at={22} every={8} style={{ fontFamily: FONT.display, fontSize: 150, fontWeight: 560, letterSpacing: '0.02em', textTransform: 'uppercase', color: COLOR.ink, lineHeight: 1 }} />
        <Rise words={['purge.']} at={52} every={8} style={{ fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 172, fontWeight: 400, color: COLOR.red, lineHeight: 1 }} />
      </div>
    </AbsoluteFill>
  );
};

const Header: React.FC<{ words: number; delta: number; counter: number }> = ({ words, delta, counter }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const show = snap(frame, fps, T.sceneIn, 20);
  const rule = snap(frame, fps, T.sceneIn + 6, 40);
  return (
    <div style={{ position: 'absolute', left: GRID.marginX, right: GRID.marginX, top: 72, opacity: show }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', height: 30 }}>
        <div style={{ ...mono, display: 'flex', alignItems: 'center', gap: 18 }}>
          <span style={{ width: 14, height: 14, background: COLOR.red, display: 'inline-block' }} />
          <TypewriterReveal text="Lesson 01 / The adjective purge" startFrame={T.sceneIn} framesPerChar={2} caret={false} />
        </div>
        <div style={{ ...mono, display: 'flex', gap: 16, alignItems: 'baseline', opacity: counter }}>
          <span style={{ color: COLOR.inkSoft }}>Words</span>
          <span style={{ fontFamily: FONT.display, fontVariantNumeric: 'tabular-nums', minWidth: '2ch', textAlign: 'right', fontSize: 34, fontWeight: 600, letterSpacing: 0 }}>{String(words).padStart(2, '0')}</span>
          <span style={{ color: COLOR.red, minWidth: '3ch', fontVariantNumeric: 'tabular-nums', opacity: delta ? 1 : 0 }}>{delta > 0 ? `+${delta}` : `${delta}`}</span>
        </div>
      </div>
      <div style={{ marginTop: 20, height: 2, background: COLOR.ink, transformOrigin: '0 50%', transform: `scaleX(${rule})` }} />
    </div>
  );
};

const Rule: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = snap(frame, fps, T.metrics, 26);
  // "If a rival could say it…" lands word by word with the voice; "cut it." on its own beat
  return (
    <div style={{ position: 'absolute', left: GRID.marginX, top: 160 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 26 }}>
        <Rise words={['If', 'a', 'rival', 'could', 'say', 'it,']} at={T.rule + 2} every={9} style={{ fontFamily: FONT.display, fontSize: 66, fontWeight: 560, letterSpacing: '0.04em', textTransform: 'uppercase', color: COLOR.ink, lineHeight: 1 }} />
        <Rise words={['cut', 'it.']} at={T.rule + 112} every={10} gap="0.22em" style={{ fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 78, fontWeight: 400, color: COLOR.red, lineHeight: 1 }} />
      </div>
      <div style={{ ...mono, fontSize: 19, marginTop: 30, display: 'flex', gap: 44, opacity: m, transform: `translateY(${(1 - m) * 14}px)` }}>
        <span>14 words <span style={{ color: COLOR.red }}>→</span> 9 words</span>
        <span style={{ color: COLOR.inkSoft }}>8 adjectives cut</span>
        <span style={{ color: COLOR.inkSoft }}>1 fact added</span>
      </div>
    </div>
  );
};

// ---------- the scene and its camera ----------

type Shot = { cx: number; cy: number; s: number };
const SHOT = {
  wide: { cx: 960, cy: 540, s: 1 },
  easel: { cx: 620, cy: 610, s: 1.45 },
  page: { cx: 840, cy: 548, s: 5.2 },
  desk: { cx: 1350, cy: 610, s: 4 },
  watch: { cx: 1550, cy: 650, s: 6.5 },
} satisfies Record<string, Shot>;

// Camera moves: from `at`, over `dur` frames, to `shot`. dur 0 is a cut.
const MOVES: { at: number; dur: number; shot: Shot }[] = [
  // settle: the scene arrives slightly close and eases back to wide
  { at: 0, dur: 0, shot: { ...SHOT.wide, s: 1.12 } },
  { at: T.sceneIn, dur: 70, shot: SHOT.wide },
  { at: T.pushEasel, dur: 150, shot: SHOT.easel },
  // zoom-through: into the page, and on through it, as the type layer comes up out of it
  { at: T.pushPage, dur: 70, shot: SHOT.page },
  { at: T.toType - 6, dur: 40, shot: { ...SHOT.page, s: 9 } },
  // whip pan lands on the desk
  { at: T.toDesk - 12, dur: 0, shot: SHOT.desk },
  { at: T.toWatch, dur: 44, shot: SHOT.watch },
  // pull-back: from inside the page out to the whole scene
  { at: T.toWide, dur: 0, shot: SHOT.page },
  { at: T.toWide + 2, dur: 110, shot: SHOT.wide },
];

const cameraAt = (frame: number, fps: number): Shot => {
  let cur: Shot = MOVES[0].shot;
  for (const m of MOVES) {
    if (frame < m.at) break;
    const p = m.dur === 0 ? 1 : snap(frame, fps, m.at, m.dur);
    // centre moves linearly, zoom moves in log space so a push feels even
    cur = {
      cx: cur.cx + (m.shot.cx - cur.cx) * p,
      cy: cur.cy + (m.shot.cy - cur.cy) * p,
      s: Math.exp(Math.log(cur.s) + (Math.log(m.shot.s) - Math.log(cur.s)) * p),
    };
  }
  return cur;
};

const FLOOR = 980;
const DESK_TOP = 727;
const at = (left: number, floor: number, height: number): React.CSSProperties => ({ position: 'absolute', left, top: floor - height });

const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cam = cameraAt(frame, fps);

  // the editor: chin on hand while reading → leans in → (later) points with the pencil
  const lean = snap(frame, fps, T.lean, 40);
  const point = snap(frame, fps, T.point, 42);
  const nod = 4 * (snap(frame, fps, T.nod, 30) - snap(frame, fps, T.nod + 50, 40));
  let pose = blendPose(POSES.chinRest, POSES.leaningIn, lean);
  pose = { ...pose, head: pose.head + nod };
  if (frame >= T.toWide) pose = blendPose(POSES.leaningIn, POSES.pointing, point);
  const hand = frame >= T.toWide ? (point > 0.5 ? 'pencil' : 'relaxed') : lean > 0.5 ? 'relaxed' : 'chin';

  const reveal = Math.max(0, (frame - T.draftType - 30) / 12);
  const edits = frame < T.marks ? 0 : Math.min(PAGE_STRIKES.length + 1, (frame - T.marks) / 35);
  const pour = snap(frame, fps, T.pour, 50);
  const seconds = 40 * snap(frame, fps, T.sweep, T.forty - T.sweep);

  return (
    <PrintZoom value={cam.s}>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transformOrigin: '0 0', transform: `translate(${960 - cam.cx * cam.s}px, ${540 - cam.cy * cam.s}px) scale(${cam.s})` }}>
        <div style={{ position: 'absolute', left: GRID.marginX, right: GRID.marginX, top: FLOOR, height: 2, background: COLOR.inkFaint }} />
        <Easel height={640} style={at(640, FLOOR, 640)} />
        <Manuscript height={380} strikes={PAGE_STRIKES} progress={edits} reveal={reveal} style={at(690, 736, 380)} />
        <EditorialCharacter pose={pose} frontHand={hand} height={640} style={at(150, FLOOR + 640 * (32 / 780), 640)} />
        <Desk height={253} style={at(1150, FLOOR, 253)} />
        <DeskLamp height={330} flip style={at(1463, DESK_TOP, 330)} />
        <CoffeeMachine height={230} pour={pour} pressure={30 + 50 * pour} style={at(1180, DESK_TOP, 230)} />
        <CoffeeCup height={86} t={frame / fps} style={at(1395, DESK_TOP, 86)} />
        <Stopwatch height={104} seconds={seconds} style={at(1505, DESK_TOP, 104)} />
      </div>
    </PrintZoom>
  );
};

// ---------- composition ----------

/** Opacity of a layer that is on during the given windows, with short dissolves. */
const windows = (frame: number, list: [number, number][], fade = 14) =>
  Math.max(
    0,
    ...list.map(([a, b]) => Math.min(interpolate(frame, [a, a + fade], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }), interpolate(frame, [b - fade, b], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }))),
  );

const ease = Easing.inOut(Easing.cubic);
const between = (frame: number, a: number, b: number) => interpolate(frame, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });

/*
  Transitions, each one different and each one motivated:
  title → scene   the title lifts away; the scene settles back from 112% (camera)
  scene → type    ZOOM-THROUGH: the camera pushes into the page and through it; the type rises out of it, 130% → 100%
  type → desk     WHIP PAN: the sentence whips off left with motion blur, the desk whips in from the right
  watch → type    IRIS: the sentence opens out of the stopwatch face in a widening circle
  type → wide     PULL-BACK: the sentence sinks back into the page, and the camera pulls out of the page to the room
  → end card      REDLINE WIPE (in Outro)
*/
const Body: React.FC = () => {
  const ready = useFontsReady();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!ready) return <AbsoluteFill style={{ background: COLOR.paper }} />;

  // whip pan between the sentence and the desk
  const whip = between(frame, T.toDesk - 12, T.toDesk + 10);
  const whipping = frame >= T.toDesk - 12 && frame < T.toDesk + 10;
  // iris out of the stopwatch
  const iris = snap(frame, fps, T.toType2, 36);
  // the type sinks back into the page
  const sink = between(frame, T.toWide, T.toWide + 14);

  const sceneVisible =
    (frame >= T.sceneIn && frame < T.toType + 30) || (frame >= T.toDesk - 12 && frame < T.toType2 + 40) || frame >= T.toWide;
  const sceneO = frame < T.toType + 30 ? windows(frame, [[T.sceneIn, T.toType + 30]], 16) * (1 - between(frame, T.toType, T.toType + 28)) : frame >= T.toWide ? between(frame, T.toWide + 4, T.toWide + 18) : whipping ? whip : 1;

  const typeAct1 = frame >= T.toType && frame < T.toDesk + 10;
  const typeAct2 = frame >= T.toType2 && frame < T.toWide + 24;
  // zoom-through arrival, then a slow push, a lean-in on the marks and on the swap
  const rise = snap(frame, fps, T.toType, 34);
  const typeScale =
    (typeAct1 ? 1.3 - 0.3 * rise : 1) * (1 + 0.022 * between(frame, T.typeIn, T.toDesk) + 0.035 * snap(frame, fps, T.noun - 24, 70) + 0.035 * snap(frame, fps, T.swap - 16, 60)) * (1 - 0.2 * sink);
  const typeO = typeAct1 ? Math.min(1, rise * 1.6) * (1 - whip) : typeAct2 ? 1 - sink : 0;
  const counter = typeAct1 ? rise * (1 - whip) : typeAct2 ? 1 - sink : 0;

  const words = countWords(SENTENCE, frame, T.typeIn, REVEAL_EVERY);
  const changes = [...SENTENCE.flatMap((t) => (t.cutAt !== undefined ? [t.cutAt + CUT.collapseAfter + CUT.collapse / 2] : [])), T.swap + 20];
  const last = changes.filter((c) => frame >= c && frame < c + 50).pop();
  const delta = last === undefined ? 0 : last === T.swap + 20 ? 3 : -1;

  return (
    <AbsoluteFill style={{ background: COLOR.paper, overflow: 'hidden' }}>
      <Soundtrack />
      {frame < T.titleOut + 30 ? <TitleCard /> : null}

      {sceneVisible && sceneO > 0 ? (
        <AbsoluteFill style={{ opacity: sceneO, transform: whipping ? `translateX(${(1 - whip) * 1100}px)` : undefined, filter: whipping ? `blur(${Math.sin(whip * Math.PI) * 14}px)` : undefined }}>
          <Scene />
        </AbsoluteFill>
      ) : null}

      {typeO > 0.001 ? (
        <AbsoluteFill
          style={{
            background: COLOR.paper,
            opacity: typeO,
            clipPath: typeAct2 && iris < 0.999 ? `circle(${iris * 2300}px at 960px 700px)` : undefined,
            transform: whipping && typeAct1 ? `translateX(${-whip * 1100}px)` : undefined,
            filter: whipping && typeAct1 ? `blur(${Math.sin(whip * Math.PI) * 14}px)` : undefined,
          }}
        >
          <div style={{ position: 'absolute', inset: 0, transformOrigin: `${GRID.marginX}px 470px`, transform: `scale(${typeScale})` }}>
            <div style={{ position: 'absolute', left: GRID.marginX, top: 400 }}>
              <KineticSentence tokens={SENTENCE} revealAt={T.typeIn} revealEvery={REVEAL_EVERY} maxWidth={GRID.contentWidth} reflowAt={T.reflow} />
            </div>
          </div>
        </AbsoluteFill>
      ) : null}

      {frame >= T.sceneIn - 2 ? <Header words={words} delta={delta} counter={counter} /> : null}
      {frame >= T.rule - 4 ? <Rule /> : null}
    </AbsoluteFill>
  );
};

export const Lesson01AdjectivePurge: React.FC = () => (
  <AbsoluteFill style={{ background: COLOR.paper }}>
    <Sequence durationInFrames={LESSON01_INTRO} layout="none">
      <HookIntro beats={HOOK} seconds={30} />
      <Sequence from={6} layout="none">
        <Audio src={staticFile('audio/shared/hook.mp3')} />
      </Sequence>
    </Sequence>
    <Sequence from={LESSON01_INTRO} durationInFrames={BODY_CUT + OUTRO.wipe} layout="none">
      <Body />
    </Sequence>
    <Sequence from={LESSON01_INTRO + BODY_CUT} durationInFrames={OUTRO.frames} layout="none">
      <Outro lesson="Lesson 01 · The adjective purge" />
    </Sequence>
  </AbsoluteFill>
);
