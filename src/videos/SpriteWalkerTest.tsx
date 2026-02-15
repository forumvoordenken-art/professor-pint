/**
 * SpriteWalkerTest — Test composition for the boy+dog spritesheet animation.
 *
 * Shows the character walking across a simple background so you can verify
 * the spritesheet grid alignment, speed, and scale.
 */

import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { SpriteWalker } from '../components/SpriteWalker';

const W = 1920;
const H = 1080;

export const SPRITE_TEST_FRAMES = 300; // 10 seconds at 30fps

export const SpriteWalkerTest: React.FC = () => {
  const frame = useCurrentFrame();

  // Character walks from left to right across screen
  const xPos = interpolate(frame, [0, SPRITE_TEST_FRAMES], [200, W - 200]);

  return (
    <div
      style={{
        width: W,
        height: H,
        backgroundColor: '#1a1a2e',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Simple ground */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: 300,
          backgroundColor: '#2d4a3e',
        }}
      />

      {/* Walking boy + dog */}
      <SpriteWalker
        frame={frame}
        x={xPos}
        y={H - 300}
        displayWidth={300}
        holdFrames={2}
        direction={1}
      />
    </div>
  );
};
