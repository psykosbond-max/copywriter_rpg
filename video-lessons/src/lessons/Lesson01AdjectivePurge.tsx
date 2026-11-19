import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';
import { CUT, KineticSentence, Token, countWords } from '../components/KineticSentence';
import { TypewriterReveal } from '../components/TypewriterReveal';
import { snap } from '../lib/motion';
import { useFontsReady } from '../theme/fonts';
import { COLOR, FONT, GRID, TYPE } from '../theme/tokens';

/*
  LESSON 01 · THE ADJECTIVE PURGE (41 s at 60 fps)
  0.0  Title card
  3.2  Header + the first draft types in, word by word; the counter climbs to 14
  11   Pass 1: eight redlines slice the adjectives and adverbs, one every 1.6 s; the sentence closes up
  23.7 What's left: the noun and the verb are underlined
  29   Pass 2: praise is swapped for proof ("cup." → "cup in 40 seconds.")
  34   The sentence lifts; the rule types in; the before/after metrics land
*/

export const LESSON01_FRAMES = 2460;

const T = {
  titleOut: 170,
  header: 190,
  draft: 260,
  pass1: 600,
  cut0: 660,
  cutEvery: 96,
  reflow: 1404,
  left: 1420,
  noun: 1500,
  verb: 1566,
  pass2: 1740,
  swap: 1800,
  proof: 1870,
  lift: 2040,
  rule: 2090,
  metrics: 2230,
} as const;

const cut = (n: number) => T.cut0 + n * T.cutEvery;

const SENTENCE: Token[] = [
  { text: 'Our' },
  { text: 'innovative,', cutAt: cut(0) },
  { text: 'award-winning,', cutAt: cut(1) },
  { text: 'next-generation', cutAt: cut(2) },
  { text: 'coffee' },
  { text: 'machine', mark: { label: 'NOUN', at: T.noun } },
  { text: 'effortlessly', cutAt: cut(3) },
  { text: 'brews', mark: { label: 'VERB', at: T.verb } },
  { text: 'a' },
  { text: 'truly', cutAt: cut(4) },
  { text: 'delicious,', cutAt: cut(5) },
  { text: 'perfectly', cutAt: cut(6) },
  { text: 'balanced', cutAt: cut(7) },
  { text: 'cup.', swap: { to: 'cup in 40 seconds.', at: T.swap } },
];
const REVEAL_EVERY = 10;

const mono: React.CSSProperties = {
  fontFamily: FONT.mono, fontSize: TYPE.mono.size, fontWeight: 500, letterSpacing: TYPE.mono.tracking,
  textTransform: 'uppercase', color: COLOR.ink, lineHeight: 1,
};

// ---------- pieces ----------

const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out = snap(frame, fps, T.titleOut, 28);
  const words = ['The', 'Adjective', 'Purge.'];
  return (
    <AbsoluteFill style={{ padding: `0 ${GRID.marginX}px`, justifyContent: 'center', opacity: 1 - out, transform: `translateY(${-60 * out}px)` }}>
      <div style={{ ...mono, color: COLOR.red, marginBottom: 36 }}>
        <TypewriterReveal text="Lesson 01 — Copywriting fundamentals" startFrame={8} framesPerChar={2} caretHold={20} />
      </div>
      <div style={{ fontFamily: FONT.serif, fontSize: 168, fontWeight: 380, letterSpacing: '-0.025em', lineHeight: 1, color: COLOR.ink, display: 'flex', gap: '0.24em' }}>
        {words.map((w, i) => {
          const p = snap(frame, fps, 30 + i * 9, 26);
          return (
            <span key={w} style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: '0.08em' }}>
              <span style={{ display: 'inline-block', transform: `translateY(${(1 - p) * 105}%)`, fontStyle: i === 2 ? 'italic' : 'normal', color: i === 2 ? COLOR.red : COLOR.ink }}>{w}</span>
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Header: React.FC<{ words: number; delta: number }> = ({ words, delta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rule = snap(frame, fps, T.header + 10, 40);
  const show = snap(frame, fps, T.header, 20);
  return (
    <div style={{ position: 'absolute', left: GRID.marginX, right: GRID.marginX, top: GRID.headerY, opacity: show }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ ...mono, display: 'flex', alignItems: 'center', gap: 18 }}>
          <span style={{ width: 14, height: 14, background: COLOR.red, display: 'inline-block' }} />
          <TypewriterReveal text="Lesson 01 / The adjective purge" startFrame={T.header} framesPerChar={2} caret={false} />
        </div>
        <div style={{ ...mono, display: 'flex', gap: 16, alignItems: 'baseline' }}>
          <span style={{ color: COLOR.inkSoft }}>Words</span>
          <span style={{ fontVariantNumeric: 'tabular-nums', minWidth: '2ch', textAlign: 'right', fontSize: 30, fontWeight: 600 }}>{String(words).padStart(2, '0')}</span>
          <span style={{ color: COLOR.red, minWidth: '3ch', fontVariantNumeric: 'tabular-nums', opacity: delta ? 1 : 0 }}>{delta > 0 ? `+${delta}` : `${delta}`}</span>
        </div>
      </div>
      <div style={{ marginTop: 26, height: 2, background: COLOR.ink, transformOrigin: '0 50%', transform: `scaleX(${rule})` }} />
    </div>
  );
};

const CAPTIONS: { at: number; until: number; text: string }[] = [
  { at: T.draft - 20, until: T.pass1, text: 'The first draft' },
  { at: T.pass1, until: T.left, text: 'Pass 1 — cut every adjective and adverb' },
  { at: T.left, until: T.pass2, text: "What's left does the work" },
  { at: T.pass2, until: T.lift, text: 'Pass 2 — swap praise for proof' },
];

const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      {CAPTIONS.map((c) => {
        if (frame < c.at || frame > c.until + 20) return null;
        const out = snap(frame, fps, c.until, 16);
        return (
          <div key={c.text} style={{ position: 'absolute', left: GRID.marginX, top: GRID.captionY, ...mono, color: COLOR.inkSoft, opacity: 1 - out, display: 'flex', gap: 18, alignItems: 'center' }}>
            <span style={{ width: 28, height: 2, background: COLOR.red, display: 'inline-block' }} />
            <TypewriterReveal text={c.text} startFrame={c.at} framesPerChar={2} caretHold={30} />
          </div>
        );
      })}
    </>
  );
};

const Rule: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const m = snap(frame, fps, T.metrics, 26);
  return (
    <div style={{ position: 'absolute', left: GRID.marginX, top: 640, width: GRID.contentWidth }}>
      <div style={{ fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 72, fontWeight: 400, lineHeight: 1.1, color: COLOR.ink, letterSpacing: '-0.01em' }}>
        <TypewriterReveal text="If a rival could say it, cut it." startFrame={T.rule} byWord framesPerWord={9} caretHold={50} />
      </div>
      <div style={{ ...mono, marginTop: 56, display: 'flex', gap: 48, opacity: m, transform: `translateY(${(1 - m) * 16}px)` }}>
        <span>14 words <span style={{ color: COLOR.red }}>→</span> 9 words</span>
        <span style={{ color: COLOR.inkSoft }}>8 adjectives cut</span>
        <span style={{ color: COLOR.inkSoft }}>1 fact added</span>
      </div>
    </div>
  );
};

// ---------- composition ----------

export const Lesson01AdjectivePurge: React.FC = () => {
  const ready = useFontsReady();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!ready) return <AbsoluteFill style={{ background: COLOR.paper }} />;

  const words = countWords(SENTENCE, frame, T.draft, REVEAL_EVERY);
  // the red delta beside the counter flashes for a moment after each change
  const changes = [...SENTENCE.flatMap((t) => (t.cutAt !== undefined ? [t.cutAt + CUT.collapseAfter + CUT.collapse / 2] : [])), T.swap + 20];
  const last = changes.filter((c) => frame >= c && frame < c + 50).pop();
  const delta = last === undefined ? 0 : last === T.swap + 20 ? 3 : -1;
  const lift = snap(frame, fps, T.lift, 44);

  return (
    <AbsoluteFill style={{ background: COLOR.paper }}>
      <Sequence durationInFrames={T.titleOut + 40} layout="none">
        <TitleCard />
      </Sequence>
      <Sequence from={0} layout="none">
        {frame >= T.header - 2 ? <Header words={words} delta={delta} /> : null}
        <Caption />
        <div style={{ position: 'absolute', left: GRID.marginX, top: 372 }}>
          <KineticSentence tokens={SENTENCE} revealAt={T.draft} revealEvery={REVEAL_EVERY} maxWidth={GRID.contentWidth} offsetY={-118 * lift} reflowAt={T.reflow} />
        </div>
        {frame >= T.rule - 5 ? <Rule /> : null}
      </Sequence>
    </AbsoluteFill>
  );
};
