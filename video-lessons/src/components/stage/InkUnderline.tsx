import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { snap } from '../../lib/motion';
import { COLOR } from '../../theme/tokens';

/*
  A hand-drawn underline for a key takeaway. It is drawn left to right with strokeDashoffset, swelling
  slightly as a marker does, and once drawn it never quite freezes: its control points breathe by
  under a pixel on slow, unrelated sine waves.
*/
export const InkUnderline: React.FC<{ width: number; at: number; dur?: number; thickness?: number; color?: string; style?: React.CSSProperties }> = ({
  width, at, dur = 34, thickness = 8, color = COLOR.red, style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = snap(frame, fps, at, dur);
  const t = frame / fps;
  const w1 = 0.8 * Math.sin(t * 0.7);
  const w2 = 0.8 * Math.sin(t * 0.53 + 1.3);
  const h = 24;
  const d = `M 2 ${14 + w1} C ${width * 0.25} ${9 + w2}, ${width * 0.6} ${16 - w1}, ${width - 2} ${10 + w2}`;
  const len = width * 1.04;
  return (
    <svg width={width} height={h} style={{ overflow: 'visible', ...style }}>
      <path d={d} fill="none" stroke={color} strokeWidth={thickness} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
    </svg>
  );
};
