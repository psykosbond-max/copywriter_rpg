import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { hash01 } from '../../lib/stepped';
import { COLOR } from '../../theme/tokens';

/*
  PaperSlapTransition: the incoming scene is a heavy sheet of archival paper tossed onto the desk.

  It starts a little large (1.06, i.e. nearer the lens) at a small random angle (−1.8° … +1.5°, from the
  seed), falls with accelerating speed, and stops dead: no bounce, no settle wobble. It comes to rest
  slightly off true (−0.4° by default), the way a sheet really lands. A soft shadow under it tightens as
  it falls and is gone on contact. Before `at` nothing renders; after landing the sheet simply stays.

  Children are the incoming scene, drawn on their own paper.
*/

type Props = {
  at: number;
  /** Frames from toss to contact. */
  dur?: number;
  seed?: number | string;
  /** Resting angle in degrees; never quite 0. */
  rest?: number;
  children: React.ReactNode;
};

export const SLAP_DUR = 14;

export const PaperSlapTransition: React.FC<Props> = ({ at, dur = SLAP_DUR, seed = at, rest = -0.4, children }) => {
  const frame = useCurrentFrame();
  const t = (frame - at) / dur;
  if (t < 0) return null;
  const k = Math.min(1, t);
  const fall = k * k * k; // gravity: slow off the hand, fastest at contact
  const start = -1.8 + 3.3 * hash01(seed); // −1.8° … +1.5°
  const angle = start + (rest - start) * fall;
  // the rest scale covers the corners the resting angle would otherwise expose
  const scale = 1.06 + (1.012 - 1.06) * fall;
  const lift = 1 - fall;
  // a tiny sideways drift as it falls, from the toss
  const dx = (hash01(`${seed}-x`) - 0.5) * 60 * lift;
  const dy = -18 * lift;
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${dx}px, ${dy}px) rotate(${angle}deg) scale(${scale})`,
        transformOrigin: '50% 50%',
        boxShadow: lift > 0.01 ? `0 ${30 * lift}px ${80 * lift}px rgba(20,20,19,${0.22 * lift})` : undefined,
        background: COLOR.paper,
        overflow: 'hidden',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
