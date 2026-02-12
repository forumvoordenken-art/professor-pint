import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';

interface CameraProps {
  children: React.ReactNode;
  x?: number;
  y?: number;
  zoom?: number;
  startFrame?: number;
  transitionDuration?: number;
  previousX?: number;
  previousY?: number;
  previousZoom?: number;
  width?: number;
  height?: number;
}

export const Camera: React.FC<CameraProps> = ({
  children,
  x = 0,
  y = 0,
  zoom = 1,
  startFrame = 0,
  transitionDuration = 30,
  previousX = 0,
  previousY = 0,
  previousZoom = 1,
  width = 1920,
  height = 1080,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [startFrame, startFrame + transitionDuration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    }
  );

  const currentX = interpolate(progress, [0, 1], [previousX, x]);
  const currentY = interpolate(progress, [0, 1], [previousY, y]);
  const currentZoom = interpolate(progress, [0, 1], [previousZoom, zoom]);

  const centerX = width / 2;
  const centerY = height / 2;

  return (
    <div
      style={{
        width,
        height,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          transform: `translate(${centerX}px, ${centerY}px) scale(${currentZoom}) translate(${-centerX - currentX}px, ${-centerY - currentY}px)`,
          transformOrigin: '0 0',
          width,
          height,
          position: 'absolute',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Camera;