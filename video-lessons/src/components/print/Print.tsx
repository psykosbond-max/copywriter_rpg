import React, { createContext, useContext, useId } from 'react';

/*
  The shared print layer for every illustration: the four inks, the screen-print paper grain and the
  "trap gap" (a thin band of bare paper around a piece, so overlapping shapes of the same ink stay apart).
  Characters and objects both draw inside <PrintSvg>, so they always look printed by the same hand.
*/

export const INK = {
  charcoal: '#141413',
  terracotta: '#C85A32',
  slate: '#4A5D6E',
  cream: '#F7F5F0',
} as const;

export type PrintIds = { gap: string; id: string };

/*
  The camera's zoom, for illustrations inside a moving shot. The grain is drawn in the illustration's own
  units, so a 5× push would blow each speckle up into a blotch; instead the texture eases back as the
  camera moves in, the way a close-up of a print shows flat ink.
*/
const ZoomContext = createContext(1);
export const PrintZoom: React.FC<{ value: number; children: React.ReactNode }> = ({ value, children }) => (
  <ZoomContext.Provider value={value}>{children}</ZoomContext.Provider>
);

type Props = {
  /** Drawing units of the illustration; the bottom edge (y = h) is where it stands. */
  w: number;
  h: number;
  /** Rendered height in px. The width follows the aspect ratio. */
  height: number;
  flip?: boolean;
  /** Paper-grain strength 0 → 1. */
  grain?: number;
  style?: React.CSSProperties;
  children: (ids: PrintIds) => React.ReactNode;
};

export const PrintSvg: React.FC<Props> = ({ w, h, height, flip = false, grain: grainProp = 1, style, children }) => {
  const zoom = useContext(ZoomContext);
  const grain = grainProp * Math.min(1, 1.6 / zoom);
  const id = useId().replace(/:/g, '');
  const grainId = `grain-${id}`;
  const gap = `gap-${id}`;
  return (
    <svg width={(height * w) / h} height={height} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined, ...style }}>
      <defs>
        {/*
          Screen-print paper grain: fractal noise becomes a sparse speckle mask that lifts a little ink
          (the paper shows through), and a faint displacement roughens edges like a pulled print.
          Fixed seeds: identical on every frame, so the texture never boils.
        */}
        <filter id={grainId} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves={1} seed={3} result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale={1.2 * grain} xChannelSelector="R" yChannelSelector="G" result="rough" />
          {/* the speckle is printed in paper colour on top of the ink, never cut as holes, so nothing behind shows through */}
          <feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves={1} seed={11} result="noise" />
          <feColorMatrix in="noise" type="matrix" values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${3 * grain} ${-3 * 0.64 * grain}`} result="speckle" />
          <feFlood floodColor={INK.cream} result="paper" />
          <feComposite in="paper" in2="speckle" operator="in" result="dots" />
          <feComposite in="dots" in2="rough" operator="in" result="dotsOnInk" />
          <feMerge>
            <feMergeNode in="rough" />
            <feMergeNode in="dotsOnInk" />
          </feMerge>
        </filter>
        {/* Trap gap: a dilated copy of the piece's own shape, filled cream, laid under it. Not a stroke. */}
        <filter id={gap} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feMorphology in="SourceAlpha" operator="dilate" radius={2.2} result="fat" />
          <feFlood floodColor={INK.cream} result="paper" />
          <feComposite in="paper" in2="fat" operator="in" result="halo" />
          <feMerge>
            <feMergeNode in="halo" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter={grain > 0 ? `url(#${grainId})` : undefined} stroke="none">
        {children({ gap: `url(#${gap})`, id })}
      </g>
    </svg>
  );
};

/** Rotation about an explicit pivot, in drawing units. */
export const rotAt = (deg: number, x: number, y: number): React.CSSProperties => ({
  transformOrigin: `${x}px ${y}px`,
  transform: `rotate(${deg}deg)`,
  transformBox: 'view-box',
});
