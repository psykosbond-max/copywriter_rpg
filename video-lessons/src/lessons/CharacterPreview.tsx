import React from 'react';
import { AbsoluteFill } from 'remotion';
import { EditorialCharacter, POSES } from '../components/EditorialCharacter';
import { RedlineStrike } from '../components/RedlineStrike';
import { textWidth } from '../lib/sentenceLayout';
import { useFontsReady } from '../theme/fonts';
import { COLOR, FONT, GRID, TYPE } from '../theme/tokens';

/*
  One still to judge the illustration style before any lesson animates it:
  the same rig in three poses — standing, pointing at a redline edit, chin on hand.
*/

const mono: React.CSSProperties = {
  fontFamily: FONT.mono, fontSize: TYPE.mono.size, fontWeight: 500, letterSpacing: TYPE.mono.tracking,
  textTransform: 'uppercase', color: COLOR.ink, lineHeight: 1,
};

const FIG_H = 640;
const FLOOR = 980;
const WORD_X = 1075;
const WORD_Y = 482;

const Label: React.FC<{ x: number; n: string; text: string }> = ({ x, n, text }) => (
  <div style={{ position: 'absolute', left: x, top: FLOOR + 30, ...mono, fontSize: 18, color: COLOR.inkSoft, display: 'flex', gap: 14 }}>
    <span style={{ color: COLOR.red }}>{n}</span>
    <span>{text}</span>
  </div>
);

export const CharacterPreview: React.FC = () => {
  const ready = useFontsReady();
  if (!ready) return <AbsoluteFill style={{ background: COLOR.paper }} />;
  const word = 'award-winning';
  const style = { fontFamily: FONT.serif, fontSize: 56, fontWeight: TYPE.sentence.weight } as const;
  const w = textWidth(word, { fontSize: 56, fontWeight: TYPE.sentence.weight, fontFamily: FONT.serif });
  return (
    <AbsoluteFill style={{ background: COLOR.paper }}>
      {/* header */}
      <div style={{ position: 'absolute', left: GRID.marginX, right: GRID.marginX, top: 72 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ ...mono, display: 'flex', alignItems: 'center', gap: 18 }}>
            <span style={{ width: 14, height: 14, background: COLOR.red, display: 'inline-block' }} />
            Editorial character · rig preview
          </div>
          <div style={{ ...mono, color: COLOR.inkSoft }}>Charcoal · Terracotta · Slate · Cream</div>
        </div>
        <div style={{ marginTop: 22, height: 2, background: COLOR.ink }} />
      </div>

      {/* floor hairline */}
      <div style={{ position: 'absolute', left: GRID.marginX, right: GRID.marginX, top: FLOOR, height: 2, background: COLOR.inkFaint }} />

      {/* 01 standing */}
      <EditorialCharacter pose={POSES.standing} height={FIG_H} style={{ position: 'absolute', left: 40, top: FLOOR - FIG_H * (748 / 780) }} />
      <Label x={GRID.marginX} n="01" text="Standing" />

      {/* 02 pointing at a redline */}
      <div style={{ position: 'absolute', left: WORD_X, top: WORD_Y, ...style, lineHeight: 1, color: COLOR.ink, whiteSpace: 'nowrap' }}>
        <RedlineStrike text={word} width={w} strike={1} dim={0.6} collapse={0} />
      </div>
      <EditorialCharacter pose={POSES.pointing} frontHand="point" height={FIG_H} style={{ position: 'absolute', left: 520, top: FLOOR - FIG_H * (748 / 780) }} />
      <Label x={650} n="02" text="Pointing to an edit" />

      {/* 03 chin on hand */}
      <EditorialCharacter pose={POSES.chinRest} frontHand="chin" height={FIG_H} flip style={{ position: 'absolute', left: 1420, top: FLOOR - FIG_H * (748 / 780) }} />
      <Label x={1540} n="03" text="Chin on hand" />
    </AbsoluteFill>
  );
};
