import React from 'react';
import { interpolateColors } from 'remotion';
import { COLOR } from '../theme/tokens';

type Props = {
  text: string;
  /** Natural width of the word in px (measured), so the cut line spans it exactly. */
  width: number;
  /** 0 → 1: the red line slicing through, left to right. */
  strike: number;
  /** 0 → 1: the struck word drains to a faint grey. */
  dim: number;
  /** 0 → 1: the word is pulled out of the sentence (fades; its box shrinks in the layout). */
  collapse: number;
  style?: React.CSSProperties;
};

/**
 * One struck word: a vermilion redline slices across it, the word drains of ink,
 * then it fades as the sentence closes up around it. The layout engine owns the width.
 */
export const RedlineStrike: React.FC<Props> = ({ text, width, strike, dim, collapse, style }) => {
  const color = interpolateColors(dim, [0, 1], [COLOR.ink, COLOR.inkFaint]);
  return (
    <span style={{ position: 'relative', display: 'inline-block', whiteSpace: 'nowrap', opacity: 1 - collapse, ...style }}>
      <span style={{ color }}>{text}</span>
      <span
        style={{
          position: 'absolute', left: -0.06 * width, top: '54%', height: '0.075em',
          width: width * 1.12, background: COLOR.red, transformOrigin: '0 50%',
          transform: `rotate(-1.4deg) scaleX(${strike})`,
        }}
      />
    </span>
  );
};
