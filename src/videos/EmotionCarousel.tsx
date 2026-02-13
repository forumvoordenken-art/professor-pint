/**
 * EmotionCarousel — toont alle 12 emoties van Professor Pint
 *
 * Elke emotie duurt 2 seconden (60 frames bij 30fps).
 * Emotienaam wordt als label getoond zodat je kunt zien welke emotie actief is.
 * 12 emoties × 60 frames = 720 frames totaal.
 */

import React from 'react';
import { useCurrentFrame } from 'remotion';
import { ProfessorPint } from '../personages/ProfessorPint';
import { PaintEffect } from '../motor/PaintEffect';
import type { Emotion } from '../animaties/emotions';

const EMOTIONS: Emotion[] = [
  'neutral', 'happy', 'excited', 'proud',
  'thinking', 'confused', 'skeptical', 'whisper',
  'shocked', 'dramatic', 'angry', 'sad',
];

const FRAMES_PER_EMOTION = 60; // 2 seconds at 30fps

export const ProfessorPintEmotionCarousel: React.FC = () => {
  const frame = useCurrentFrame();

  const emotionIndex = Math.min(
    Math.floor(frame / FRAMES_PER_EMOTION),
    EMOTIONS.length - 1
  );
  const previousIndex = Math.max(0, emotionIndex - 1);
  const frameInEmotion = frame - emotionIndex * FRAMES_PER_EMOTION;

  // Transition over first 10 frames of each new emotion
  const transitionProgress = Math.min(1, frameInEmotion / 10);

  const currentEmotion = EMOTIONS[emotionIndex];
  const previousEmotion = EMOTIONS[previousIndex];

  // Talk during some emotions for variety
  const talkingEmotions: Emotion[] = ['excited', 'dramatic', 'angry', 'happy'];
  const isTalking = talkingEmotions.includes(currentEmotion) && frameInEmotion > 10;

  return (
    <PaintEffect preset="standard" id="emotions">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#E8E0D4',
      }}>
        {/* Emotion label */}
        <div style={{
          fontFamily: 'Georgia, serif',
          fontSize: 42,
          fontWeight: 'bold',
          color: '#1A1A1A',
          marginBottom: 20,
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}>
          {currentEmotion}
        </div>

        {/* Professor Pint */}
        <ProfessorPint
          emotion={currentEmotion}
          previousEmotion={previousEmotion}
          emotionTransitionProgress={transitionProgress}
          talking={isTalking}
          scale={2.5}
        />

        {/* Progress bar */}
        <div style={{
          marginTop: 30,
          display: 'flex',
          gap: 6,
        }}>
          {EMOTIONS.map((emo, i) => (
            <div
              key={emo}
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: i === emotionIndex ? '#2D5016' : i < emotionIndex ? '#D4A012' : '#CCC',
                border: '2px solid #1A1A1A',
              }}
            />
          ))}
        </div>

        {/* Counter */}
        <div style={{
          fontFamily: 'monospace',
          fontSize: 18,
          color: '#666',
          marginTop: 12,
        }}>
          {emotionIndex + 1} / {EMOTIONS.length}
        </div>
      </div>
    </PaintEffect>
  );
};
