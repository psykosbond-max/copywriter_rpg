import React from 'react';
import { useCurrentFrame } from 'remotion';
import { inkStroke, penEase } from '../../lib/ink';
import { stepped } from '../../lib/stepped';
import { COLOR } from '../../theme/tokens';

/*
  A hand-drawn underline for a key takeaway: a bowed, tapered wax-pencil stroke revealed at hand speed
  (fast off the mark, dragging at the tip). Once drawn it keeps breathing: its bow shifts by under a
  pixel, on twos, so it reads as drawn rather than computed.
*/
export const InkUnderline: React.FC<{ width: number; at: number; dur?: number; thickness?: number; color?: string; seed?: string | number; style?: React.CSSProperties }> = ({
  width, at, dur = 16, thickness = 10, color = COLOR.red, seed = width, style,
}) => {
  const frame = useCurrentFrame();
  const f = stepped(frame, 2);
  const p = penEase((frame - at) / dur);
  const wobble = 0.8 * Math.sin((f / 60) * 0.9) + 0.5 * Math.sin((f / 60) * 1.7 + 1);
  const s = inkStroke({ length: width, thickness, seed: `ul-${seed}`, angle: -0.8, spread: 0.9, bow: 0.025, wobble });
  if (p <= 0.001) return null;
  return (
    <svg width={s.width} height={s.height} style={{ overflow: 'visible', clipPath: `inset(-20px ${(1 - p) * 100}% -20px -20px)`, marginTop: -s.height / 2 + 12, ...style }}>
      <path d={s.d} fill={color} />
    </svg>
  );
};
