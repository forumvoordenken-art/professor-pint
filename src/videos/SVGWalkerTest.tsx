/**
 * SVGWalkerTest — Test composition for the hybrid SVG + procedural walker.
 *
 * Side-by-side comparison with the spritesheet version.
 */

import React from 'react';
import { useCurrentFrame, interpolate, AbsoluteFill } from 'remotion';
import { SVGWalker } from '../components/SVGWalker';

const W = 1920;
const H = 1080;

export const SVG_WALKER_TEST_FRAMES = 300; // 10 seconds at 30fps

export const SVGWalkerTest: React.FC = () => {
  const frame = useCurrentFrame();

  // Character walks from left to right
  const xPos = interpolate(frame, [0, SVG_WALKER_TEST_FRAMES], [300, W - 300]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#1a1a2e' }}>
      {/* Ground */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: 350,
          backgroundColor: '#2d4a3e',
        }}
      />

      {/* SVG Walker */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: 'absolute', width: '100%', height: '100%' }}
      >
        <SVGWalker frame={frame} x={xPos} y={H - 350} scale={0.25} direction={1} speed={1} />
      </svg>

      {/* Label */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          left: 40,
          color: 'white',
          fontFamily: 'sans-serif',
          fontSize: 32,
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        }}
      >
        SVG + Procedural Walker (Skeletal Animation)
      </div>
    </AbsoluteFill>
  );
};
