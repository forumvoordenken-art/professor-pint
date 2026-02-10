// Music and Sound Effects system
// Provides background music and sound effect layering for videos.
// Audio files are referenced from public/ directory.

import React from 'react';
import { Audio, Sequence, useCurrentFrame, interpolate } from 'remotion';

// ---- Types ----

export interface MusicTrack {
  /** Path to audio file relative to public/ */
  src: string;
  /** Volume 0-1 */
  volume?: number;
  /** Start frame (default: 0) */
  startFrame?: number;
  /** End frame (default: end of composition) */
  endFrame?: number;
  /** Fade in duration in frames */
  fadeIn?: number;
  /** Fade out duration in frames */
  fadeOut?: number;
  /** Loop the track */
  loop?: boolean;
}

export interface SoundEffect {
  /** Path to SFX file relative to public/ */
  src: string;
  /** Frame to trigger the sound */
  triggerFrame: number;
  /** Volume 0-1 */
  volume?: number;
}

// ---- Pre-defined SFX types (for future asset mapping) ----

export type SFXType =
  | 'whoosh'      // Transition sounds
  | 'pop'         // Overlay appear
  | 'ding'        // Revelation moment
  | 'chalkWrite'  // Chalkboard text appearing
  | 'glassClink'  // Cheers gesture
  | 'pageTurn'    // Topic change
  | 'crowd';      // Background pub ambience

export const SFX_PATHS: Record<SFXType, string> = {
  whoosh: 'sfx/whoosh.mp3',
  pop: 'sfx/pop.mp3',
  ding: 'sfx/ding.mp3',
  chalkWrite: 'sfx/chalk-write.mp3',
  glassClink: 'sfx/glass-clink.mp3',
  pageTurn: 'sfx/page-turn.mp3',
  crowd: 'sfx/crowd-ambience.mp3',
};

// ---- Music Player Component ----

interface MusicPlayerProps {
  tracks: MusicTrack[];
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ tracks }) => {
  return (
    <>
      {tracks.map((track, i) => (
        <MusicTrackPlayer key={`music-${i}`} track={track} />
      ))}
    </>
  );
};

const MusicTrackPlayer: React.FC<{ track: MusicTrack }> = ({ track }) => {
  const frame = useCurrentFrame();
  const {
    src,
    volume = 0.3,
    startFrame = 0,
    endFrame,
    fadeIn = 30,
    fadeOut = 30,
  } = track;

  // Calculate volume with fade in/out
  const fadeInEnd = startFrame + fadeIn;
  const fadeOutStart = endFrame ? endFrame - fadeOut : Infinity;

  let currentVolume = volume;

  // Fade in
  if (frame < fadeInEnd) {
    currentVolume = interpolate(
      frame,
      [startFrame, fadeInEnd],
      [0, volume],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
    );
  }

  // Fade out
  if (endFrame && frame > fadeOutStart) {
    currentVolume = interpolate(
      frame,
      [fadeOutStart, endFrame],
      [volume, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
    );
  }

  return (
    <Sequence from={startFrame}>
      <Audio
        src={src}
        volume={currentVolume}
        loop={track.loop}
      />
    </Sequence>
  );
};

// ---- SFX Player Component ----

interface SFXPlayerProps {
  effects: SoundEffect[];
}

export const SFXPlayer: React.FC<SFXPlayerProps> = ({ effects }) => {
  return (
    <>
      {effects.map((sfx, i) => (
        <Sequence key={`sfx-${i}`} from={sfx.triggerFrame}>
          <Audio
            src={sfx.src}
            volume={sfx.volume ?? 0.5}
          />
        </Sequence>
      ))}
    </>
  );
};

// ---- Helper: generate SFX from scene transitions ----

export const generateTransitionSFX = (
  scenes: Array<{ start: number; transition?: { type: string } }>,
): SoundEffect[] => {
  const effects: SoundEffect[] = [];

  for (const scene of scenes) {
    if (!scene.transition || scene.transition.type === 'none') continue;

    // Add whoosh for transitions
    effects.push({
      src: SFX_PATHS.whoosh,
      triggerFrame: scene.start,
      volume: 0.25,
    });
  }

  return effects;
};

// ---- Helper: generate SFX from overlays ----

export const generateOverlaySFX = (
  overlays: Array<{ startFrame: number; type: string }>,
): SoundEffect[] => {
  return overlays.map((overlay) => ({
    src: SFX_PATHS.pop,
    triggerFrame: overlay.startFrame,
    volume: 0.2,
  }));
};
