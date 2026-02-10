import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { ProfessorPint } from '../characters/ProfessorPint';
import { Pub } from '../backgrounds/Pub';
import { Subtitles } from '../systems/Subtitles';
import { Camera } from '../systems/Camera';
import type { Emotion } from '../animations/emotions';

// Demo: 20 seconds at 30fps = 600 frames
// Scenes showcase all animation features

interface SceneConfig {
  startFrame: number;
  endFrame: number;
  emotion: Emotion;
  talking: boolean;
  subtitle: string;
  boardText: string;
}

const SCENES: SceneConfig[] = [
  {
    startFrame: 0,
    endFrame: 120,
    emotion: 'neutral',
    talking: false,
    subtitle: '',
    boardText: "TODAY'S TOPIC",
  },
  {
    startFrame: 120,
    endFrame: 240,
    emotion: 'happy',
    talking: true,
    subtitle: 'Welcome to the pub! Pull up a stool.',
    boardText: "TODAY'S TOPIC",
  },
  {
    startFrame: 240,
    endFrame: 360,
    emotion: 'thinking',
    talking: true,
    subtitle: "Ever wondered why your brain lies to you about money?",
    boardText: 'WHY YOU\'RE BROKE',
  },
  {
    startFrame: 360,
    endFrame: 480,
    emotion: 'shocked',
    talking: true,
    subtitle: 'Your savings account is losing value every single day!',
    boardText: 'INFLATION = -3%/yr',
  },
  {
    startFrame: 480,
    endFrame: 540,
    emotion: 'angry',
    talking: true,
    subtitle: "And nobody told you. That's the real scandal.",
    boardText: 'THE TRUTH',
  },
  {
    startFrame: 540,
    endFrame: 600,
    emotion: 'happy',
    talking: false,
    subtitle: "But don't worry. That's what I'm here for.",
    boardText: 'PROFESSOR PINT',
  },
];

export const DemoVideo: React.FC = () => {
  const frame = useCurrentFrame();

  // Find current scene
  const currentScene = SCENES.find(
    (s) => frame >= s.startFrame && frame < s.endFrame
  ) || SCENES[0];

  // Find previous scene for emotion transitions
  const sceneIndex = SCENES.indexOf(currentScene);
  const previousScene = sceneIndex > 0 ? SCENES[sceneIndex - 1] : currentScene;

  // Calculate emotion transition progress (over 10 frames from scene start)
  const framesIntoScene = frame - currentScene.startFrame;
  const emotionProgress = Math.min(1, framesIntoScene / 10);

  // Character position (centered, standing behind bar area)
  const charX = 960;
  const charY = 420;

  return (
    <AbsoluteFill style={{ backgroundColor: '#1A1A1A' }}>
      {/* Background */}
      <AbsoluteFill>
        <Pub boardText={currentScene.boardText} width={1920} height={1080} />
      </AbsoluteFill>

      {/* Character */}
      <div
        style={{
          position: 'absolute',
          left: charX - 240,
          top: charY - 180,
          transform: 'scale(2)',
          transformOrigin: 'center top',
        }}
      >
        <ProfessorPint
          emotion={currentScene.emotion}
          previousEmotion={previousScene.emotion}
          emotionTransitionProgress={emotionProgress}
          talking={currentScene.talking}
          scale={1}
        />
      </div>

      {/* Subtitles */}
      <Subtitles
        text={currentScene.subtitle}
        startFrame={currentScene.startFrame + 5}
        endFrame={currentScene.endFrame - 5}
      />

      {/* Scene indicator (debug, remove later) */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          color: 'rgba(255,255,255,0.3)',
          fontSize: 14,
          fontFamily: 'monospace',
        }}
      >
        Scene {sceneIndex + 1}/{SCENES.length} | Frame {frame} | {currentScene.emotion} | {currentScene.talking ? 'talking' : 'idle'}
      </div>
    </AbsoluteFill>
  );
};

export default DemoVideo;
