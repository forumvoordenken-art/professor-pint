import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Camera } from './Camera';
import { CameraPath } from './CameraPath';
import type { CameraPathData } from './CameraPath';
import { Subtitles } from './Subtitles';
import { Transition, getTransitionProgress } from './Transitions';
import type { TransitionType } from './Transitions';
import { ProfessorPint } from '../personages/ProfessorPint';
import type { Emotion } from '../animaties/emotions';

// ---- Scene JSON Types ----

export interface SceneCamera {
  x: number;
  y: number;
  zoom: number;
}

export interface SceneCharacter {
  id: string;
  x: number;
  y: number;
  scale?: number;
  emotion: Emotion;
  talking: boolean;
  gesture?: string;
}

export interface SceneTransition {
  type: TransitionType;
  duration: number;
}

export interface SceneData {
  id: string;
  start: number;
  end: number;
  bg: string;
  boardText?: string;
  camera?: SceneCamera;
  cameraPath?: CameraPathData;
  characters: SceneCharacter[];
  subtitle: string;
  transition?: SceneTransition;
}

// ---- Helper: find scene at frame ----

const findSceneAtFrame = (scenes: SceneData[], frame: number): SceneData | null => {
  for (let i = scenes.length - 1; i >= 0; i--) {
    if (frame >= scenes[i].start && frame < scenes[i].end) {
      return scenes[i];
    }
  }
  return null;
};

const findSceneIndex = (scenes: SceneData[], scene: SceneData): number => {
  return scenes.findIndex((s) => s.id === scene.id);
};

// ---- Background Renderer ----
// In the new asset library system, backgrounds are composed via SceneComposer.
// This fallback renders a placeholder for any bg string.

const renderBackground = (bg: string, boardText: string): React.ReactNode => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#2A2A2A' }}>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'rgba(255,255,255,0.2)',
          fontSize: 24,
          fontFamily: 'monospace',
        }}
      >
        BG: {bg}{boardText ? ` | ${boardText}` : ''}
      </div>
    </AbsoluteFill>
  );
};

// ---- Character Renderer ----

const renderCharacter = (
  char: SceneCharacter,
  previousEmotion: Emotion,
  emotionProgress: number,
): React.ReactNode => {
  const charScale = char.scale ?? 2;

  switch (char.id) {
    case 'professorPint':
      return (
        <div
          key={char.id}
          style={{
            position: 'absolute',
            left: char.x - 130 * charScale,
            top: char.y - 90 * charScale,
            transform: `scale(${charScale})`,
            transformOrigin: 'center top',
          }}
        >
          <ProfessorPint
            emotion={char.emotion}
            previousEmotion={previousEmotion}
            emotionTransitionProgress={emotionProgress}
            talking={char.talking}
            scale={1}
          />
        </div>
      );
    default:
      return (
        <div
          key={char.id}
          style={{
            position: 'absolute',
            left: char.x - 30,
            top: char.y - 40,
            width: 60,
            height: 80,
            backgroundColor: 'rgba(255,100,100,0.3)',
            border: '2px dashed rgba(255,100,100,0.6)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255,255,255,0.5)',
            fontSize: 10,
            fontFamily: 'monospace',
          }}
        >
          {char.id}
        </div>
      );
  }
};

// ---- Main SceneRenderer ----

interface SceneRendererProps {
  scenes: SceneData[];
  showDebug?: boolean;
}

export const SceneRenderer: React.FC<SceneRendererProps> = ({
  scenes,
  showDebug = false,
}) => {
  const frame = useCurrentFrame();

  const currentScene = findSceneAtFrame(scenes, frame);
  if (!currentScene) {
    return <AbsoluteFill style={{ backgroundColor: '#1A1A1A' }} />;
  }

  const sceneIndex = findSceneIndex(scenes, currentScene);
  const previousScene = sceneIndex > 0 ? scenes[sceneIndex - 1] : null;

  const framesIntoScene = frame - currentScene.start;
  const emotionProgress = Math.min(1, framesIntoScene / 10);

  const cam = currentScene.camera ?? { x: 0, y: 0, zoom: 1 };
  const prevCam = previousScene?.camera ?? { x: 0, y: 0, zoom: 1 };

  const transition = currentScene.transition ?? { type: 'none' as TransitionType, duration: 0 };
  const transitionProgress = transition.type !== 'none'
    ? getTransitionProgress(frame, currentScene.start, transition.duration)
    : 1;

  const characterPositions = currentScene.characters.map(c => ({
    id: c.id, x: c.x, y: c.y,
  }));

  const sceneInner = (
    <>
      <AbsoluteFill>
        {renderBackground(currentScene.bg, currentScene.boardText ?? '')}
      </AbsoluteFill>

      {currentScene.characters.map((char) => {
        const prevChar = previousScene?.characters.find((c) => c.id === char.id);
        const prevEmotion: Emotion = prevChar?.emotion ?? char.emotion;
        return renderCharacter(char, prevEmotion, emotionProgress);
      })}
    </>
  );

  const sceneContent = currentScene.cameraPath ? (
    <CameraPath
      path={currentScene.cameraPath}
      x={cam.x}
      y={cam.y}
      zoom={cam.zoom}
      sceneStart={currentScene.start}
      sceneEnd={currentScene.end}
      previousX={prevCam.x}
      previousY={prevCam.y}
      previousZoom={prevCam.zoom}
      characterPositions={characterPositions}
      width={1920}
      height={1080}
    >
      {sceneInner}
    </CameraPath>
  ) : (
    <Camera
      x={cam.x}
      y={cam.y}
      zoom={cam.zoom}
      previousX={prevCam.x}
      previousY={prevCam.y}
      previousZoom={prevCam.zoom}
      startFrame={currentScene.start}
      transitionDuration={28}
      width={1920}
      height={1080}
    >
      {sceneInner}
    </Camera>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#1A1A1A' }}>
      {transition.type !== 'none' && transitionProgress < 1 ? (
        <Transition type={transition.type} progress={transitionProgress}>
          {sceneContent}
        </Transition>
      ) : (
        sceneContent
      )}

      <Subtitles
        text={currentScene.subtitle}
        startFrame={currentScene.start + 5}
        endFrame={currentScene.end - 5}
      />

      {showDebug && (
        <div
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            color: 'rgba(255,255,255,0.3)',
            fontSize: 14,
            fontFamily: 'monospace',
            textAlign: 'right',
            lineHeight: 1.6,
          }}
        >
          Scene {sceneIndex + 1}/{scenes.length} [{currentScene.id}]
          <br />
          Frame {frame} | {currentScene.start}-{currentScene.end}
          <br />
          {currentScene.characters.map((c) => {
            return `${c.id}: ${c.emotion}${c.talking ? ' (talking)' : ''}`;
          }).join(' | ')}
        </div>
      )}
    </AbsoluteFill>
  );
};
