import React from 'react';
import { interpolateColors } from 'remotion';
import { inkStroke } from '../lib/ink';
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
  /** Font size in px, for the stroke's weight. */
  size?: number;
  style?: React.CSSProperties;
};

/**
 * One struck word: a vermilion redline slices across it, the word drains of ink,
 * then it fades as the sentence closes up around it. The layout engine owns the width.
 */
export const RedlineStrike: React.FC<Props> = ({ text, width, strike, dim, collapse, size = 84, style }) => {
  const color = interpolateColors(dim, [0, 1], [COLOR.ink, COLOR.inkFaint]);
  // a wax-pencil slash: bowed, tapered, at its own angle; overshoots the word a little at both ends
  const L = width * 1.14;
  const s = inkStroke({ length: L, thickness: size * 0.085, seed: text, angle: -1.1, spread: 0.7, bow: -0.012 });
  return (
    <span style={{ position: 'relative', display: 'inline-block', whiteSpace: 'nowrap', opacity: 1 - collapse, ...style }}>
      <span style={{ color }}>{text}</span>
      {strike > 0.001 ? (
      <svg
        width={s.width}
        height={s.height}
        style={{ position: 'absolute', left: -0.06 * width, top: `calc(47% - ${s.height / 2}px)`, overflow: 'visible', clipPath: `inset(-20px ${(1 - strike) * 100}% -20px -20px)` }}
      >
        <path d={s.d} fill={COLOR.red} />
      </svg>
      ) : null}
    </span>
  );
};
