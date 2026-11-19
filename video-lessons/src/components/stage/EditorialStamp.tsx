import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { shake } from '../../lib/camera';
import { COLOR, FONT } from '../../theme/tokens';

/*
  EditorialStamp: a rubber stamp in vermilion ink that slams onto the page.
  It drops from 150% to 100% in five frames (no ease-in: it is thrown), lands with a crisp damped
  horizontal shake, and stays. The ink is a little uneven, like a real impression: a fixed-seed speckle
  knocks paper-coloured flecks out of it.
*/

type Props = {
  text: string;
  /** Frame of impact. */
  at: number;
  rotate?: number;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
};

export const EditorialStamp: React.FC<Props> = ({ text, at, rotate = -7, size = 46, color = COLOR.red, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - at;
  const DROP = 5;
  if (t < -DROP) return null;
  // the throw: linear in, so it hits at full speed
  const drop = Math.min(1, Math.max(0, (t + DROP) / DROP));
  const scale = 1.5 - 0.5 * drop;
  const opacity = Math.min(1, drop * 1.6);
  const dx = shake(frame, fps, at, 9, 13, 0.08);
  const id = `stamp-${text.replace(/\W/g, '')}-${at}`;
  return (
    <div style={{ position: 'absolute', transform: `translateX(${dx}px) rotate(${rotate}deg) scale(${scale})`, opacity, transformOrigin: '50% 50%', ...style }}>
      <svg width={0} height={0} style={{ position: 'absolute' }}>
        <filter id={id}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={at % 97} result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -4 3.1" result="m" />
          <feComposite in="SourceGraphic" in2="m" operator="in" />
        </filter>
      </svg>
      <div
        style={{
          filter: `url(#${id})`, color, border: `${size * 0.09}px solid ${color}`, outline: `${size * 0.035}px solid ${color}`, outlineOffset: size * 0.1,
          padding: `${size * 0.16}px ${size * 0.34}px ${size * 0.12}px`, fontFamily: FONT.display, fontWeight: 700, fontSize: size,
          letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1, whiteSpace: 'nowrap',
        }}
      >
        {text}
      </div>
    </div>
  );
};
