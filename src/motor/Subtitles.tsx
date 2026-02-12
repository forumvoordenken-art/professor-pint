import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';

interface SubtitleProps {
  text: string;
  startFrame: number;
  endFrame: number;
}

export const Subtitles: React.FC<SubtitleProps> = ({ text, startFrame, endFrame }) => {
  const frame = useCurrentFrame();

  if (frame < startFrame || frame > endFrame || !text) return null;

  const localFrame = frame - startFrame;
  const duration = endFrame - startFrame;

  // Fade in over 8 frames, fade out over 8 frames
  const opacity = interpolate(
    localFrame,
    [0, 8, duration - 8, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Slight slide up on entrance
  const translateY = interpolate(
    localFrame,
    [0, 8],
    [10, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    }
  );

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 80,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          color: '#FFFFFF',
          fontSize: 36,
          fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
          fontWeight: 600,
          padding: '12px 32px',
          borderRadius: 8,
          maxWidth: '80%',
          textAlign: 'center',
          lineHeight: 1.4,
          letterSpacing: 0.5,
        }}
      >
        {text}
      </div>
    </div>
  );
};

export default Subtitles;
