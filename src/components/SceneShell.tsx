import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { ACT_PALETTES, ActName } from '../design-system/Palette';

type SceneShellProps = {
  title: string;
  act: ActName;
  children?: React.ReactNode;
};

export const SceneShell: React.FC<SceneShellProps> = ({ title, act, children }) => {
  const frame = useCurrentFrame();
  const palette = ACT_PALETTES[act];

  const panX = Math.sin(frame / 90) * 24;
  const panY = Math.cos(frame / 120) * 12;
  const zoom = interpolate(Math.sin(frame / 140), [-1, 1], [1, 1.06]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: `radial-gradient(circle at 30% 20%, ${palette.panel}, ${palette.background})`,
        color: palette.text,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        {children}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 48,
          top: 36,
          fontSize: 36,
          letterSpacing: 1,
          color: palette.accent,
          textTransform: 'uppercase',
          fontWeight: 700,
          textShadow: '0 2px 16px rgba(0,0,0,0.35)',
        }}
      >
        {title}
      </div>
    </div>
  );
};
