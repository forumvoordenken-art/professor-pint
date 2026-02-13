/**
 * PalmTreeDemo — First ChatGPT+vectorizer.ai asset test
 *
 * Shows the palm tree asset on a tropical sky + sand terrain background.
 * Tests: SVG rendering, wind animation, scaling, positioning.
 * Duration: 10 seconds (300 frames at 30fps).
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { PalmTree } from '../assets/vegetation/PalmTree';

export const PALM_DEMO_FRAMES = 300;

export const PalmTreeDemo: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: '#87CEEB' }}>
      {/* Simple sky gradient */}
      <AbsoluteFill style={{ zIndex: 1 }}>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080">
          <defs>
            <linearGradient id="demo-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E60C0" />
              <stop offset="40%" stopColor="#50A0D8" />
              <stop offset="70%" stopColor="#78BCD8" />
              <stop offset="100%" stopColor="#C0D8D0" />
            </linearGradient>
          </defs>
          <rect width="1920" height="1080" fill="url(#demo-sky)" />
          {/* Sun */}
          <circle cx="1500" cy="200" r="80" fill="#FFF4C0" opacity={0.9} />
          <circle cx="1500" cy="200" r="120" fill="#FFF4C0" opacity={0.15} />
        </svg>
      </AbsoluteFill>

      {/* Sand terrain */}
      <AbsoluteFill style={{ zIndex: 2 }}>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080">
          <defs>
            <linearGradient id="demo-sand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4A650" />
              <stop offset="100%" stopColor="#C4943C" />
            </linearGradient>
          </defs>
          <path
            d={`M0,680 Q300,660 600,670 Q900,680 1200,665 Q1500,675 1920,670 L1920,1080 L0,1080 Z`}
            fill="url(#demo-sand)"
          />
        </svg>
      </AbsoluteFill>

      {/* Palm trees at different positions and scales */}
      {/* Background palm — smaller, further away */}
      <div
        style={{
          position: 'absolute',
          left: 300,
          top: 200,
          zIndex: 3,
          transform: 'scale(0.6)',
          transformOrigin: 'center bottom',
          opacity: 0.8,
        }}
      >
        <PalmTree frame={frame} />
      </div>

      {/* Background palm — mirrored */}
      <div
        style={{
          position: 'absolute',
          left: 1400,
          top: 220,
          zIndex: 3,
          transform: 'scale(0.55) scaleX(-1)',
          transformOrigin: 'center bottom',
          opacity: 0.75,
        }}
      >
        <PalmTree frame={frame} />
      </div>

      {/* Main palm — center, larger */}
      <div
        style={{
          position: 'absolute',
          left: 780,
          top: 100,
          zIndex: 5,
          transform: 'scale(0.9)',
          transformOrigin: 'center bottom',
        }}
      >
        <PalmTree frame={frame} />
      </div>

      {/* Foreground palm — right side, large */}
      <div
        style={{
          position: 'absolute',
          left: 1100,
          top: 50,
          zIndex: 6,
          transform: 'scale(1.05) scaleX(-1)',
          transformOrigin: 'center bottom',
        }}
      >
        <PalmTree frame={frame} />
      </div>

      {/* Title overlay */}
      <AbsoluteFill
        style={{
          zIndex: 10,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingBottom: 40,
        }}
      >
        <div
          style={{
            color: '#fff',
            fontSize: 28,
            fontFamily: 'monospace',
            background: 'rgba(0,0,0,0.5)',
            padding: '8px 20px',
            borderRadius: 8,
          }}
        >
          Palm Tree — ChatGPT + vectorizer.ai → Remotion (51 paths, 25KB)
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
