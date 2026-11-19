import React from 'react';
import { COLOR } from '../../theme/tokens';

/*
  The editorial pointer: a flat charcoal arrow with a paper trap gap (no outline), and a vermilion
  ring that blooms where it presses. Position and press are driven by the lesson at full 60 fps,
  so the pointer moves crisply against the stepped, hand-made motion around it.
*/
export const EditorialCursor: React.FC<{ x: number; y: number; press?: number; visible?: number; kind?: 'arrow' | 'text' }> = ({ x, y, press = 0, visible = 1, kind = 'arrow' }) => {
  if (visible <= 0.001) return null;
  const ring = press > 0 && press < 1;
  return (
    <div style={{ position: 'absolute', left: x, top: y, opacity: visible, pointerEvents: 'none' }}>
      {ring ? (
        <div style={{ position: 'absolute', left: -6 - 30 * press, top: -6 - 30 * press, width: 12 + 60 * press, height: 12 + 60 * press, borderRadius: '50%', background: COLOR.red, opacity: 0.32 * (1 - press) }} />
      ) : null}
      {kind === 'arrow' ? (
        <svg width={40} height={52} style={{ overflow: 'visible', transform: `scale(${1 - 0.1 * Math.sin(Math.PI * press)})`, transformOrigin: '0 0' }}>
          {/* the paper gap, a slightly larger arrow in cream under the ink one */}
          <path d="M -3 -4 L 32 30 L 17 32 L 26 50 L 17 54 L 8 36 L -3 46 Z" fill={COLOR.paper} />
          <path d="M 0 0 L 27 27 L 13 28.5 L 21.5 46 L 17 48 L 8.5 30.5 L 0 39 Z" fill={COLOR.ink} />
        </svg>
      ) : (
        <svg width={18} height={44} style={{ overflow: 'visible' }}>
          <path d="M 2 0 L 16 0 L 16 3 L 10.5 3 L 10.5 41 L 16 41 L 16 44 L 2 44 L 2 41 L 7.5 41 L 7.5 3 L 2 3 Z" fill={COLOR.ink} />
        </svg>
      )}
    </div>
  );
};
