import React from 'react';
import { Audio, useCurrentFrame, staticFile } from 'remotion';
import { getMouthShapeFromPhonemes } from '../animations/talking';
import type { MouthShape } from '../animations/talking';

// ---- Types ----

export interface PhonemeData {
  time: number; // seconds
  phoneme: string;
}

export interface AudioSegment {
  /** Character ID this audio belongs to */
  characterId: string;
  /** Start frame in the composition */
  startFrame: number;
  /** Audio file path (relative to public/) */
  audioFile: string;
  /** Phoneme timestamps from ElevenLabs */
  phonemes: PhonemeData[];
}

// ---- Audio Player Component ----

interface AudioPlayerProps {
  /** Audio segments to play */
  segments: AudioSegment[];
  /** Volume (0-1) */
  volume?: number;
}

/**
 * Renders <Audio> components for each audio segment at the correct frame offset.
 * Place this inside a Remotion composition.
 */
export const AudioPlayer: React.FC<AudioPlayerProps> = ({ segments, volume = 1 }) => {
  return (
    <>
      {segments.map((segment, i) => (
        <Audio
          key={`audio-${segment.characterId}-${i}`}
          src={staticFile(segment.audioFile)}
          startFrom={0}
          endAt={Infinity}
          volume={volume}
          // Remotion's Sequence-like behavior via from prop not available on Audio,
          // so we handle timing via the segment's startFrame in the parent Sequence
        />
      ))}
    </>
  );
};

// ---- Phoneme-based lip sync hooks ----

/**
 * Get the current mouth shape for a character based on phoneme data.
 * Call this from within a Remotion composition.
 */
export const useLipSync = (
  segments: AudioSegment[],
  characterId: string,
  fps: number = 30,
): { mouthShape: MouthShape; isTalking: boolean } => {
  const frame = useCurrentFrame();

  // Find active segment for this character
  const activeSegment = segments.find((seg) => {
    if (seg.characterId !== characterId) return false;
    if (seg.phonemes.length === 0) return false;
    const lastPhonemeTime = seg.phonemes[seg.phonemes.length - 1].time;
    const segEndFrame = seg.startFrame + Math.ceil(lastPhonemeTime * fps) + fps; // +1s buffer
    return frame >= seg.startFrame && frame <= segEndFrame;
  });

  if (!activeSegment) {
    return { mouthShape: 0, isTalking: false };
  }

  // Offset frame relative to segment start
  const relativeFrame = frame - activeSegment.startFrame;
  const mouthShape = getMouthShapeFromPhonemes(relativeFrame, fps, activeSegment.phonemes);

  return { mouthShape, isTalking: mouthShape > 0 };
};

/**
 * Determine if a character should be marked as "talking" at the current frame.
 * Simpler version that just checks if we're within an audio segment's time range.
 */
export const isTalkingAtFrame = (
  segments: AudioSegment[],
  characterId: string,
  frame: number,
  fps: number = 30,
): boolean => {
  return segments.some((seg) => {
    if (seg.characterId !== characterId) return false;
    if (seg.phonemes.length === 0) return false;
    const lastPhonemeTime = seg.phonemes[seg.phonemes.length - 1].time;
    const segEndFrame = seg.startFrame + Math.ceil(lastPhonemeTime * fps);
    return frame >= seg.startFrame && frame <= segEndFrame;
  });
};
