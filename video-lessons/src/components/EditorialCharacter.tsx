import React from 'react';
import { interpolate } from 'remotion';
import { INK, PrintSvg } from './print/Print';

/*
  EditorialCharacter — a mid-century editorial figure built as an articulated paper cut-out.

  Rules this component keeps:
  - No outlines anywhere (every shape is stroke="none"); form comes from flat shapes and negative space.
  - Editorial proportions: the head is 100 units of a 750-unit figure (1 : 7.5), features are small and quiet.
  - Four inks only: charcoal, terracotta, slate and paper cream, printed through a fixed paper-grain filter.
  - A rig of nested <g> groups (Torso › Head, UpperArm › Forearm › Hand) that pivot on explicit
    transformOrigin coordinates, so lessons pose it with interpolate() — small, deliberate shifts.

  Units: the figure is drawn facing right in a 600 × 780 box; feet rest on y = 748.
*/

export { INK };

export type HandShape = 'relaxed' | 'point' | 'chin' | 'pencil';

/** Joint angles in degrees. 0 = hanging straight down. Negative swings a limb forward (towards where the figure faces). */
export type Pose = {
  lean: number; // whole upper body about the hips; positive leans forward
  head: number; // head about the neck; positive nods forward/down
  frontUpper: number;
  frontFore: number; // relative to the upper arm
  frontHand: number; // relative to the forearm
  backUpper: number;
  backFore: number;
  backHand: number;
};

export const POSES = {
  standing: { lean: 0, head: 0, frontUpper: -3, frontFore: -6, frontHand: 0, backUpper: 5, backFore: 4, backHand: 0 },
  pointing: { lean: 3, head: 3, frontUpper: -80, frontFore: -8, frontHand: -6, backUpper: 6, backFore: 6, backHand: 0 },
  chinRest: { lean: 0, head: 13, frontUpper: -52, frontFore: -166, frontHand: 0, backUpper: -5, backFore: -96, backHand: -60 },
  leaningIn: { lean: 7, head: 6, frontUpper: -24, frontFore: -40, frontHand: -10, backUpper: 4, backFore: 10, backHand: 0 },
} satisfies Record<string, Pose>;

/** Blend two poses (t 0 → 1). Drive t with interpolate()/snap() for a posture shift. */
export const blendPose = (a: Pose, b: Pose, t: number): Pose => {
  const out = { ...a };
  (Object.keys(a) as (keyof Pose)[]).forEach((k) => {
    out[k] = interpolate(t, [0, 1], [a[k], b[k]]);
  });
  return out;
};

// Pivots (the explicit transform origins of the rig), in figure units.
const PIVOT = {
  hips: [306, 380],
  neck: [306, 128],
  frontShoulder: [320, 156],
  frontElbow: [320, 300],
  frontWrist: [320, 420],
  backShoulder: [294, 154],
  backElbow: [294, 296],
  backWrist: [294, 414],
} as const;

const origin = (p: readonly [number, number]) => `${p[0]}px ${p[1]}px`;
const rot = (deg: number, p: readonly [number, number]): React.CSSProperties => ({ transformOrigin: origin(p), transform: `rotate(${deg}deg)`, transformBox: 'view-box' });

// ---------- shapes ----------

const Hand: React.FC<{ shape: HandShape; dx?: number }> = ({ shape, dx = 0 }) => {
  const t = `translate(${dx} 0)`;
  if (shape === 'point') {
    return (
      <g transform={t} fill={INK.terracotta}>
        {/* palm, a short folded wedge */}
        <path d="M313,417 C310,432 314,446 322,450 C328,446 330,430 327,417 Z" />
        {/* index finger, long and tapered */}
        <path d="M317,444 L322,486 L327,444 Z" />
        {/* thumb */}
        <path d="M326,424 L334,436 L326,438 Z" />
      </g>
    );
  }
  if (shape === 'pencil') {
    return (
      <g transform={t}>
        {/* the editor's grease pencil (charcoal barrel, red point) in a loose fist */}
        <path fill={INK.charcoal} d="M316.5,440 L323.5,440 L323.5,498 L321.6,508 L318.4,508 L316.5,498 Z" />
        <path fill={INK.terracotta} d="M318.4,507.5 L321.6,507.5 L320,518 Z" />
        <path fill={INK.terracotta} d="M313,417 C310,430 312,444 320,448 C328,446 331,432 327,417 Z" />
        <path fill={INK.terracotta} d="M326,422 L333,433 L325,437 Z" />
      </g>
    );
  }
  if (shape === 'chin') {
    return (
      <g transform={t} fill={INK.terracotta}>
        {/* loosely curled fingers under the jaw */}
        <path d="M312,417 C308,432 310,448 318,454 C328,456 334,446 331,432 C330,426 329,420 328,417 Z" />
      </g>
    );
  }
  return (
    <g transform={t} fill={INK.terracotta}>
      <path d="M313,417 C310,432 311,452 318,462 C324,464 329,456 329,444 C330,434 329,424 327,417 Z" />
    </g>
  );
};

const Arm: React.FC<{ upper: number; fore: number; hand: number; shape: HandShape; front: boolean }> = ({ upper, fore, hand, shape, front }) => {
  const sh = front ? PIVOT.frontShoulder : PIVOT.backShoulder;
  const el = front ? PIVOT.frontElbow : PIVOT.backElbow;
  const wr = front ? PIVOT.frontWrist : PIVOT.backWrist;
  const dx = front ? 0 : -26; // the back arm is the front arm's geometry shifted behind the body
  const sleeve = front ? INK.slate : INK.charcoal; // the far arm sits in shadow, so the two never merge
  return (
    <g data-part={front ? 'UpperArmFront' : 'UpperArmBack'} style={rot(upper, sh)}>
      {/* the sleeve has a domed cap centred on the shoulder pivot, so it stays round as the arm swings */}
      <path fill={sleeve} transform={`translate(${dx} 0)`} d="M306,166 C305,150 312,141 320,141 C329,141 336,150 335,166 C336,200 334,250 331,302 L309,302 C305,250 304,200 306,166 Z" />
      <g data-part={front ? 'ForearmFront' : 'ForearmBack'} style={rot(fore, el)}>
        <path fill={sleeve} transform={`translate(${dx} 0)`} d="M309,296 L313,420 L327,420 L332,296 Z" />
        {/* a sliver of shirt cuff, cut out of the sleeve as negative space */}
        <path fill={INK.cream} transform={`translate(${dx} 0)`} d="M313,411 L327,411 L327,416 L313,416 Z" />
        <g data-part={front ? 'HandFront' : 'HandBack'} style={rot(hand, wr)}>
          <Hand shape={shape} dx={dx} />
        </g>
      </g>
    </g>
  );
};

const Head: React.FC<{ tilt: number }> = ({ tilt }) => (
  <g data-part="Head" style={rot(tilt, PIVOT.neck)}>
    {/* face and neck in one flat terracotta shape: forehead, a straight nose, small lips, a defined jaw */}
    <path
      fill={INK.terracotta}
      d="M290,140 L292,112 C268,100 258,52 286,22 C300,8 328,6 342,22 C350,31 352,42 351,52
         C352,58 356,66 365,76 C360,80 356,81 354,82 C356,85 355,88 353,90 C355,93 353,96 350,97
         C351,104 345,110 335,111 C329,112 324,111 321,110 L326,140 Z"
    />
    {/* a sleek bob with a blunt fringe; the hair carries the silhouette of the back of the head */}
    <path
      fill={INK.charcoal}
      d="M347,40 C342,24 330,6 306,4 C270,2 250,34 254,74 C256,96 258,110 262,121 L306,117
         C300,100 299,80 304,62 C312,52 330,46 347,40 Z"
    />
    {/* one cream highlight cut through the hair: the screen-print gap */}
    <path fill={INK.cream} d="M268,40 C276,22 292,13 310,12 C294,18 280,30 272,46 Z" />
    {/* features: a narrow lidded eye, a thin brow, a short mouth — no more */}
    <path fill={INK.charcoal} d="M330,54 Q337,50 343,54 Q337,56.5 330,54 Z" />
    <path fill={INK.charcoal} d="M328,46 Q337,42 346,46 L346,47.5 Q337,44.5 328,48 Z" />
    <path fill={INK.charcoal} d="M345,91 L353,90.5 L353,92 L345,92.5 Z" />
    {/* earring: a cream dot against the hair */}
    <circle fill={INK.cream} cx={283} cy={118} r={4.5} />
  </g>
);

const Torso: React.FC = () => (
  <g data-part="Torso">
    {/* slate turtleneck: tapered from the shoulders to a narrow waist, ending at the hip */}
    <path fill={INK.slate} d="M289,126 L326,126 L331,142 C348,150 351,172 346,212 L335,330 L338,384 L278,384 L281,330 L270,212 C265,170 270,150 287,142 Z" />
    {/* the fold of the roll neck, cut as a cream sliver */}
    <path fill={INK.cream} d="M290,139 L328,139 L329,142 L289,142 Z" />
  </g>
);

const Legs: React.FC = () => (
  <g data-part="Legs">
    {/* wide charcoal trousers; the gap between the legs is left as paper */}
    <path fill={INK.charcoal} d="M279,376 L339,376 L347,560 L353,730 L319,730 L310,560 L305,468 L299,560 L292,730 L258,730 L266,560 Z" />
    {/* bare ankles */}
    <path fill={INK.terracotta} d="M322,729 L338,729 L338,737 L322,737 Z" />
    <path fill={INK.terracotta} d="M262,729 L278,729 L278,737 L262,737 Z" />
    {/* pointed flats */}
    <path fill={INK.charcoal} d="M318,736 L346,736 C358,737 368,741 371,748 L318,748 Z" />
    <path fill={INK.charcoal} d="M258,736 L286,736 C296,737 304,742 306,748 L256,748 Z" />
  </g>
);

// ---------- the component ----------

type Props = {
  pose?: Pose;
  frontHand?: HandShape;
  backHand?: HandShape;
  /** Rendered height of the figure in px. */
  height?: number;
  /** Mirror so the figure faces left. */
  flip?: boolean;
  /** Paper-grain strength 0 → 1 (0 turns the print texture off). */
  grain?: number;
  style?: React.CSSProperties;
};

export const EditorialCharacter: React.FC<Props> = ({
  pose = POSES.standing, frontHand = 'relaxed', backHand = 'relaxed', height = 760, flip = false, grain = 1, style,
}) => (
  <PrintSvg w={600} h={780} height={height} flip={flip} grain={grain} style={style}>
    {({ gap }) => (
      <>
        <Legs />
        <g data-part="UpperBody" style={rot(pose.lean, PIVOT.hips)}>
          <Arm front={false} upper={pose.backUpper} fore={pose.backFore} hand={pose.backHand} shape={backHand} />
          <Torso />
          <Head tilt={pose.head} />
          {/* the near arm carries the paper trap gap, so it reads against the torso and the face */}
          <g filter={gap}>
            <Arm front upper={pose.frontUpper} fore={pose.frontFore} hand={pose.frontHand} shape={frontHand} />
          </g>
        </g>
      </>
    )}
  </PrintSvg>
);
