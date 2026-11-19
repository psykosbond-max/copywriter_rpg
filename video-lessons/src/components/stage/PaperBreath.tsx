import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { stepped } from '../../lib/stepped';

/*
  The paper itself, never quite still: a very faint fibre texture that drifts a few pixels over many
  seconds (a slow Lissajous), so a held frame still feels like a sheet under a camera, not a screen.
  Fixed noise seed; only its position moves, so it drifts and never boils.
*/
export const PaperBreath: React.FC<{ strength?: number }> = ({ strength = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = stepped(frame, 3) / fps; // the paper moves on threes: 20 drawings a second
  const x = 7 * Math.sin(t * 0.13);
  const y = 5 * Math.cos(t * 0.09);
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'multiply', opacity: 0.07 * strength }}>
      <svg width={1960} height={1120} style={{ position: 'absolute', left: -20 + x, top: -20 + y }}>
        <filter id="paper-breath" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.55 0.9" numOctaves={3} seed={7} />
          <feColorMatrix type="matrix" values="0 0 0 0 0.08  0 0 0 0 0.08  0 0 0 0 0.07  0 0 0 -1.3 1.05" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paper-breath)" />
      </svg>
    </AbsoluteFill>
  );
};
