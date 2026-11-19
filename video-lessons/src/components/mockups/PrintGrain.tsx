import React, { useId } from 'react';

/*
  The screen-print speckle for flat UI: laid over a mockup, it lifts a sparse scatter of ink back to
  paper, exactly as PrintSvg does for the illustrations, so the browser, the doc and the figure all
  look pulled from the same screens. Fixed seed: identical on every frame.
*/
export const PrintGrain: React.FC<{ seed?: number; strength?: number; radius?: number }> = ({ seed = 11, strength = 1, radius = 0 }) => {
  const id = useId().replace(/:/g, '');
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', borderRadius: radius }}>
      <filter id={`pg-${id}`} x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves={1} seed={seed} />
        {/* only the top of the noise range shows, as paper-coloured flecks */}
        <feColorMatrix type="matrix" values={`0 0 0 0 0.969  0 0 0 0 0.961  0 0 0 0 0.941  0 0 0 ${3.4 * strength} ${-3.4 * strength * 0.68}`} />
      </filter>
      <rect width="100%" height="100%" filter={`url(#pg-${id})`} />
    </svg>
  );
};
