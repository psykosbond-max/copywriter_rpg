import React from 'react';

type Props = {
  from: string;
  to: string;
  /** 0 → 1: the old text rolls up and out, the new text rolls up into place. */
  progress: number;
  /** Line height in px: the clipping window the words roll through. */
  lineHeight: number;
  /** Text colour of the incoming words (defaults to the inherited colour). */
  toColor?: string;
  style?: React.CSSProperties;
};

/**
 * Swaps one phrase for another inside a clipped window, like a split-flap roll.
 * The surrounding layout animates its width, so neighbours glide rather than jump.
 */
export const WordSwap: React.FC<Props> = ({ from, to, progress, lineHeight, toColor, style }) => (
  <span
    style={{
      position: 'relative', display: 'inline-block', height: lineHeight, overflow: 'hidden',
      whiteSpace: 'nowrap', verticalAlign: 'top', ...style,
    }}
  >
    <span style={{ display: 'block', transform: `translateY(${-progress * lineHeight}px)`, opacity: 1 - progress }}>{from}</span>
    <span
      style={{
        position: 'absolute', left: 0, top: 0, display: 'block', color: toColor,
        transform: `translateY(${(1 - progress) * lineHeight}px)`, opacity: progress,
      }}
    >
      {to}
    </span>
  </span>
);
