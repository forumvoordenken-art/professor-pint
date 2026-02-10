import React from 'react';
import { AbsoluteFill, interpolate, Easing } from 'remotion';

export type TransitionType = 'crossfade' | 'wipe' | 'zoomIn' | 'slide' | 'iris' | 'none';

interface TransitionProps {
  type: TransitionType;
  /** Progress from 0 (start of transition) to 1 (fully transitioned) */
  progress: number;
  children: React.ReactNode;
}

/**
 * Wraps outgoing or incoming scene content and applies the transition effect.
 * Use for the INCOMING scene (progress 0→1 means scene fading/sliding IN).
 */
export const Transition: React.FC<TransitionProps> = ({ type, progress, children }) => {
  if (type === 'none' || progress >= 1) {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }

  if (progress <= 0) {
    return null;
  }

  switch (type) {
    case 'crossfade':
      return <CrossfadeTransition progress={progress}>{children}</CrossfadeTransition>;
    case 'wipe':
      return <WipeTransition progress={progress}>{children}</WipeTransition>;
    case 'zoomIn':
      return <ZoomInTransition progress={progress}>{children}</ZoomInTransition>;
    case 'slide':
      return <SlideTransition progress={progress}>{children}</SlideTransition>;
    case 'iris':
      return <IrisTransition progress={progress}>{children}</IrisTransition>;
    default:
      return <AbsoluteFill>{children}</AbsoluteFill>;
  }
};

/** Opacity crossfade */
const CrossfadeTransition: React.FC<{ progress: number; children: React.ReactNode }> = ({
  progress,
  children,
}) => {
  const opacity = interpolate(progress, [0, 1], [0, 1], {
    easing: Easing.out(Easing.cubic),
  });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

/** Horizontal wipe from left to right */
const WipeTransition: React.FC<{ progress: number; children: React.ReactNode }> = ({
  progress,
  children,
}) => {
  const clipPercent = interpolate(progress, [0, 1], [0, 100], {
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill
      style={{
        clipPath: `inset(0 ${100 - clipPercent}% 0 0)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Zoom in from center */
const ZoomInTransition: React.FC<{ progress: number; children: React.ReactNode }> = ({
  progress,
  children,
}) => {
  const scale = interpolate(progress, [0, 1], [0.6, 1], {
    easing: Easing.out(Easing.cubic),
  });
  const opacity = interpolate(progress, [0, 0.3], [0, 1], {
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        opacity,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Slide in from right */
const SlideTransition: React.FC<{ progress: number; children: React.ReactNode }> = ({
  progress,
  children,
}) => {
  const translateX = interpolate(progress, [0, 1], [100, 0], {
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${translateX}%)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Circular iris reveal from center */
const IrisTransition: React.FC<{ progress: number; children: React.ReactNode }> = ({
  progress,
  children,
}) => {
  // Circle radius grows from 0% to ~142% (diagonal of screen)
  const radius = interpolate(progress, [0, 1], [0, 142], {
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill
      style={{
        clipPath: `circle(${radius}% at 50% 50%)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/**
 * Calculate transition progress given frame timing.
 * Returns 0 before transition, 0-1 during, 1 after.
 */
export const getTransitionProgress = (
  frame: number,
  transitionStartFrame: number,
  transitionDuration: number,
): number => {
  return interpolate(
    frame,
    [transitionStartFrame, transitionStartFrame + transitionDuration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
};
