import React from 'react';
import { FONT } from '../theme/tokens';
import { INK, PrintSvg, rotAt } from './print/Print';

/*
  Props and set pieces for the lessons, cut from the same four inks as <EditorialCharacter /> and printed
  through the same grain. No outlines: every edge is a change of ink or a gap of bare paper.
  Each object stands on the bottom edge of its box, so `top = floorY - height` places it on a surface.
  Moving parts (the pour, the steam, the stopwatch hand, the lamp's arms, the strikes) are props,
  so a lesson drives them with interpolate()/snap().
*/

type Base = { height: number; flip?: boolean; grain?: number; style?: React.CSSProperties };

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// ---------- the product: a mid-century espresso machine ----------

export const CoffeeMachine: React.FC<Base & { /** 0 → 1: coffee stream running into the cup. */ pour?: number; /** gauge needle, degrees */ pressure?: number }> = ({
  pour = 0, pressure = 30, ...b
}) => (
  <PrintSvg w={360} h={440} {...b}>
    {() => (
      <>
        {/* crown: a charcoal dome with a terracotta finial */}
        <path fill={INK.charcoal} d="M176,30 L184,30 L186,52 L174,52 Z" />
        <circle fill={INK.terracotta} cx={180} cy={26} r={12} />
        <path fill={INK.charcoal} d="M92,96 C92,46 268,46 268,96 Z" />
        {/* body */}
        <rect fill={INK.slate} x={70} y={92} width={220} height={318} rx={28} />
        {/* the bright band, cut back to paper */}
        <rect fill={INK.cream} x={70} y={148} width={220} height={10} />
        {/* pressure gauge */}
        <circle fill={INK.cream} cx={180} cy={214} r={36} />
        <path fill={INK.terracotta} d="M180,214 L207,191 A36,36 0 0 1 214,206 Z" />
        <g style={rotAt(pressure, 180, 214)}>
          <path fill={INK.charcoal} d="M178.5,214 L180,186 L181.5,214 Z" />
        </g>
        <circle fill={INK.charcoal} cx={180} cy={214} r={4} />
        {/* steam knob */}
        <circle fill={INK.terracotta} cx={98} cy={262} r={11} />
        {/* the open bay where the cup stands */}
        <rect fill={INK.cream} x={108} y={300} width={144} height={98} rx={6} />
        {/* group head, spout and portafilter */}
        <path fill={INK.charcoal} d="M138,262 L222,262 L222,292 L138,292 Z" />
        <path fill={INK.charcoal} d="M164,292 L196,292 L190,306 L170,306 Z" />
        <path fill={INK.charcoal} d="M222,272 L312,276 L312,284 L222,288 Z" />
        <path fill={INK.terracotta} d="M300,275 L346,277 C352,278 352,284 346,285 L300,285 Z" />
        {/* the pour */}
        <rect fill={INK.charcoal} x={178} y={306} width={4} height={54 * clamp01(pour)} />
        {/* the cup in the bay, and the grate under it */}
        <path fill={INK.terracotta} d="M158,360 L202,360 C201,378 194,388 180,389 C166,388 159,378 158,360 Z" />
        <path fill={INK.terracotta} fillRule="evenodd" d="M200,366 a9,9 0 1 1 0,14 a5,5 0 1 0 0,-14 Z" />
        <rect fill={INK.charcoal} x={108} y={390} width={144} height={8} />
        {/* plinth */}
        <path fill={INK.charcoal} d="M40,424 C40,414 48,410 58,410 L302,410 C312,410 320,414 320,424 L320,440 L40,440 Z" />
      </>
    )}
  </PrintSvg>
);

// ---------- the promise: a cup on a saucer, steaming ----------

export const CoffeeCup: React.FC<Base & { /** time in seconds; the steam drifts slowly with it */ t?: number; steam?: number }> = ({ t = 0, steam = 1, ...b }) => {
  const wisp = (phase: number) => ({
    transform: `translateY(${-4 * Math.sin(t * 0.9 + phase)}px) scaleY(${1 + 0.05 * Math.sin(t * 0.7 + phase)})`,
    transformOrigin: '110px 112px',
    transformBox: 'view-box' as const,
    opacity: steam,
  });
  return (
    <PrintSvg w={240} h={250} {...b}>
      {({ id }) => (
        <>
          <defs>
            <clipPath id={`cup-${id}`}>
              <path d="M48,124 L172,124 C170,176 152,214 110,218 C68,214 50,176 48,124 Z" />
            </clipPath>
          </defs>
          {/* steam: three tapered slate wisps */}
          <g style={wisp(0)}>
            <path fill={INK.slate} d="M88,108 C78,88 98,74 88,54 C84,46 86,40 90,34 C86,46 94,56 94,64 C96,82 82,90 92,108 Z" />
          </g>
          <g style={wisp(2.1)}>
            <path fill={INK.slate} d="M110,104 C100,78 122,62 110,36 C106,26 108,18 112,10 C110,24 118,34 118,46 C120,70 104,80 114,104 Z" />
          </g>
          <g style={wisp(4.2)}>
            <path fill={INK.slate} d="M132,108 C124,92 140,80 132,62 C129,56 130,50 133,46 C131,56 138,62 138,70 C139,86 128,92 136,108 Z" />
          </g>
          {/* handle */}
          <path fill={INK.terracotta} fillRule="evenodd" d="M160,140 C196,130 206,170 166,192 L162,180 C186,168 182,146 162,152 Z" />
          {/* cup, with a cream band clipped to its curve */}
          <path fill={INK.terracotta} d="M48,124 L172,124 C170,176 152,214 110,218 C68,214 50,176 48,124 Z" />
          <g clipPath={`url(#cup-${id})`}>
            <rect fill={INK.cream} x={40} y={150} width={140} height={9} />
          </g>
          {/* rim and coffee, seen just from above */}
          <ellipse fill={INK.cream} cx={110} cy={124} rx={62} ry={9} />
          <ellipse fill={INK.charcoal} cx={110} cy={124.5} rx={54} ry={6} />
          {/* saucer */}
          <path fill={INK.charcoal} d="M14,224 C40,218 180,218 206,224 C200,238 170,244 110,244 C50,244 20,238 14,224 Z" />
        </>
      )}
    </PrintSvg>
  );
};

// ---------- the tool: the editor's grease pencil (charcoal barrel, red point) ----------

export const EditorsPencil: React.FC<Base & { angle?: number }> = ({ angle = 0, ...b }) => (
  <PrintSvg w={520} h={40} {...b}>
    {() => (
      <g style={rotAt(angle, 260, 20)}>
        {/* eraser, ferrule and its ribs */}
        <path fill={INK.terracotta} d="M14,7 L42,7 L42,33 L14,33 C6,33 4,28 4,20 C4,12 6,7 14,7 Z" />
        <rect fill={INK.slate} x={42} y={6} width={40} height={28} />
        <rect fill={INK.cream} x={54} y={6} width={3} height={28} />
        <rect fill={INK.cream} x={67} y={6} width={3} height={28} />
        {/* barrel with one bright facet */}
        <rect fill={INK.charcoal} x={82} y={6} width={350} height={28} />
        <rect fill={INK.cream} x={82} y={14} width={350} height={2.5} />
        {/* a grease pencil: the barrel tapers straight into a red point */}
        <path fill={INK.charcoal} d="M432,6 L490,15 L490,25 L432,34 Z" />
        <path fill={INK.terracotta} d="M488,14.5 L516,20 L488,25.5 Z" />
      </g>
    )}
  </PrintSvg>
);

// ---------- the draft: a manuscript page with red edits ----------

export type Strike = { line: number; from: number; to: number };
const LINES = [230, 270, 248, 280, 204, 262, 240, 150];

export const Manuscript: React.FC<Base & { strikes?: Strike[]; /** 0 → strikes.length: how many have been drawn */ progress?: number }> = ({
  strikes = [], progress = strikes.length, ...b
}) => (
  <PrintSvg w={380} h={480} {...b}>
    {() => (
      <>
        {/* a flat slate offset is the page's only shadow; its other edges are left to the eye */}
        <rect fill={INK.slate} x={24} y={24} width={356} height={456} />
        <rect fill={INK.cream} x={0} y={0} width={356} height={456} />
        {/* bulldog clip */}
        <path fill={INK.charcoal} d="M138,-14 L218,-14 L212,18 L144,18 Z" />
        <path fill={INK.charcoal} fillRule="evenodd" d="M156,-14 C156,-40 200,-40 200,-14 L192,-14 C192,-30 164,-30 164,-14 Z" />
        {/* headline bar and body lines */}
        <rect fill={INK.charcoal} x={36} y={52} width={168} height={14} />
        {LINES.map((w, i) => (
          <rect key={i} fill={INK.charcoal} x={36} y={100 + i * 36} width={w} height={8} />
        ))}
        {/* red edits, drawn one after another */}
        {strikes.map((s, i) => {
          const p = clamp01(progress - i);
          if (p <= 0) return null;
          const y = 100 + s.line * 36 + 2;
          return <rect key={`s${i}`} fill={INK.terracotta} x={36 + s.from} y={y} width={(s.to - s.from) * p} height={4.5} transform={`rotate(-1.2 ${36 + s.from} ${y})`} />;
        })}
        {/* a proofreader's caret: something is to be inserted here (the fact) */}
        <path fill={INK.terracotta} opacity={clamp01(progress - strikes.length + 1)} d="M186,374 L198,346 L210,374 L203,374 L198,361 L193,374 Z" />
      </>
    )}
  </PrintSvg>
);

// ---------- the proof: a stopwatch at forty seconds ----------

export const Stopwatch: React.FC<Base & { seconds?: number; showReadout?: boolean }> = ({ seconds = 40, showReadout = true, ...b }) => {
  const a = (seconds / 60) * 360;
  const rad = ((a - 90) * Math.PI) / 180;
  const r = 78;
  const large = a > 180 ? 1 : 0;
  const ex = 120 + r * Math.cos(rad);
  const ey = 160 + r * Math.sin(rad);
  return (
    <PrintSvg w={240} h={280} {...b}>
      {() => (
        <>
          {/* crown and side button */}
          <rect fill={INK.charcoal} x={104} y={4} width={32} height={16} rx={3} />
          <rect fill={INK.slate} x={113} y={20} width={14} height={20} />
          <g style={rotAt(40, 120, 160)}>
            <rect fill={INK.charcoal} x={112} y={30} width={16} height={16} rx={2} />
          </g>
          {/* case and face */}
          <circle fill={INK.slate} cx={120} cy={160} r={112} />
          <circle fill={INK.cream} cx={120} cy={160} r={94} />
          {/* the elapsed time as a terracotta sector */}
          {seconds > 0.05 ? <path fill={INK.terracotta} d={`M120,160 L120,${160 - r} A${r},${r} 0 ${large} 1 ${ex},${ey} Z`} /> : null}
          {/* ticks every five seconds */}
          {Array.from({ length: 12 }, (_, i) => (
            <g key={i} style={rotAt(i * 30, 120, 160)}>
              <rect fill={INK.charcoal} x={118} y={70} width={4} height={i % 3 === 0 ? 14 : 8} />
            </g>
          ))}
          {/* hand */}
          <g style={rotAt(a, 120, 160)}>
            <path fill={INK.charcoal} d="M117,172 L120,74 L123,172 Z" />
          </g>
          <circle fill={INK.charcoal} cx={120} cy={160} r={8} />
          <circle fill={INK.cream} cx={120} cy={160} r={3} />
          {showReadout ? (
            <text x={120} y={222} textAnchor="middle" fill={INK.charcoal} style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: 30, letterSpacing: '0.02em' }}>
              {String(Math.floor(seconds)).padStart(2, '0')}s
            </text>
          ) : null}
          {/* a flat foot so it stands on the desk */}
          <rect fill={INK.charcoal} x={84} y={266} width={72} height={14} rx={4} />
        </>
      )}
    </PrintSvg>
  );
};

// ---------- the room: a splayed-leg desk and an anglepoise lamp ----------

export const Desk: React.FC<Base> = (b) => (
  <PrintSvg w={640} h={270} {...b}>
    {() => (
      <>
        {/* far legs in slate, set in a little, for depth */}
        <path fill={INK.slate} d="M98,22 L114,22 L104,270 L94,270 Z" />
        <path fill={INK.slate} d="M526,22 L542,22 L552,270 L542,270 Z" />
        {/* near legs, splayed and tapered */}
        <path fill={INK.charcoal} d="M40,22 L64,22 L30,270 L18,270 Z" />
        <path fill={INK.charcoal} d="M576,22 L600,22 L622,270 L610,270 Z" />
        {/* drawer box with a split and a terracotta pull */}
        <rect fill={INK.slate} x={380} y={22} width={220} height={74} />
        <rect fill={INK.cream} x={380} y={57} width={220} height={3} />
        <circle fill={INK.terracotta} cx={490} cy={40} r={6} />
        <circle fill={INK.terracotta} cx={490} cy={78} r={6} />
        {/* the top: one charcoal slab */}
        <rect fill={INK.charcoal} x={0} y={0} width={640} height={22} rx={3} />
      </>
    )}
  </PrintSvg>
);

export const DeskLamp: React.FC<Base & { lower?: number; upper?: number; head?: number }> = ({ lower = 0, upper = 0, head = 0, ...b }) => (
  <PrintSvg w={300} h={360} {...b}>
    {({ gap }) => (
      <>
        {/* the arms are a jointed rig: base › lower arm › upper arm › shade */}
        <g style={rotAt(lower, 90, 340)}>
          <path fill={INK.slate} d="M86,342 L146,188 L156,192 L96,346 Z" />
          <g style={rotAt(upper, 151, 190)}>
            <path fill={INK.slate} d="M148,184 L238,114 L244,122 L154,196 Z" />
            <g style={rotAt(head, 241, 118)} filter={gap}>
              {/* shade: a terracotta cone, its open mouth a cream ellipse with the bulb inside */}
              <path fill={INK.terracotta} d="M232,100 L254,92 L296,166 C284,182 228,190 212,176 Z" />
              <ellipse fill={INK.cream} cx={254} cy={174} rx={42} ry={9} transform="rotate(-12 254 174)" />
              <circle fill={INK.charcoal} cx={241} cy={118} r={9} />
            </g>
            <circle fill={INK.charcoal} cx={151} cy={190} r={9} />
          </g>
        </g>
        {/* weighted base */}
        <path fill={INK.charcoal} d="M40,360 C40,330 140,330 140,360 Z" />
        <circle fill={INK.terracotta} cx={90} cy={340} r={7} />
      </>
    )}
  </PrintSvg>
);

// ---------- an easel to stand the page on ----------

export const Easel: React.FC<Base> = (b) => (
  <PrintSvg w={400} h={640} {...b}>
    {() => (
      <>
        <path fill={INK.slate} d="M194,0 L206,0 L334,640 L322,640 Z" />
        <path fill={INK.charcoal} d="M194,0 L206,0 L80,640 L66,640 Z" />
        <path fill={INK.charcoal} d="M194,0 L206,0 L342,640 L328,640 Z" />
        {/* a charcoal board, so a cream page reads against it */}
        <rect fill={INK.charcoal} x={22} y={-24} width={356} height={420} rx={2} />
        <rect fill={INK.charcoal} x={40} y={396} width={320} height={14} rx={2} />
      </>
    )}
  </PrintSvg>
);
