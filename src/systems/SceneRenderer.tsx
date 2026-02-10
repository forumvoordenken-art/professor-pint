import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { Camera } from './Camera';
import { Subtitles } from './Subtitles';
import { Transition, getTransitionProgress } from './Transitions';
import type { TransitionType } from './Transitions';
import { AudioPlayer, isTalkingAtFrame } from './AudioSync';
import type { AudioSegment } from './AudioSync';
import { OverlayRenderer } from './Overlays';
import type { OverlayData } from './Overlays';
import { ProfessorPint } from '../characters/ProfessorPint';
import { AverageJoe } from '../characters/AverageJoe';
import { Pharaoh } from '../characters/Pharaoh';
import { Worker } from '../characters/Worker';
import { Pub } from '../backgrounds/Pub';
import { Classroom } from '../backgrounds/Classroom';
import { Pyramids } from '../backgrounds/Pyramids';
import { DesertConstruction } from '../backgrounds/DesertConstruction';
import { InsidePyramid } from '../backgrounds/InsidePyramid';
import { NileRiver } from '../backgrounds/NileRiver';
import { WorkersVillage } from '../backgrounds/WorkersVillage';
import { SphinxView } from '../backgrounds/SphinxView';
import type { Emotion } from '../animations/emotions';
import { MusicPlayer, SFXPlayer } from './MusicSFX';
import type { MusicTrack, SoundEffect } from './MusicSFX';

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
  characters: SceneCharacter[];
  subtitle: string;
  transition?: SceneTransition;
  overlays?: OverlayData[];
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

const renderBackground = (bg: string, boardText: string): React.ReactNode => {
  switch (bg) {
    case 'pub':
      return <Pub boardText={boardText} width={1920} height={1080} />;
    case 'classroom':
      return <Classroom boardText={boardText} width={1920} height={1080} />;
    case 'pyramids':
      return <Pyramids boardText={boardText} width={1920} height={1080} />;
    case 'desertConstruction':
      return <DesertConstruction boardText={boardText} width={1920} height={1080} />;
    case 'insidePyramid':
      return <InsidePyramid boardText={boardText} width={1920} height={1080} />;
    case 'nileRiver':
      return <NileRiver boardText={boardText} width={1920} height={1080} />;
    case 'workersVillage':
      return <WorkersVillage boardText={boardText} width={1920} height={1080} />;
    case 'sphinxView':
      return <SphinxView boardText={boardText} width={1920} height={1080} />;
    default:
      // Fallback: solid color with label
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
            BG: {bg}
          </div>
        </AbsoluteFill>
      );
  }
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
    case 'averageJoe':
      return (
        <div
          key={char.id}
          style={{
            position: 'absolute',
            left: char.x - 130 * charScale,
            top: char.y - 85 * charScale,
            transform: `scale(${charScale})`,
            transformOrigin: 'center top',
          }}
        >
          <AverageJoe
            emotion={char.emotion}
            previousEmotion={previousEmotion}
            emotionTransitionProgress={emotionProgress}
            talking={char.talking}
            scale={1}
          />
        </div>
      );
    case 'pharaoh':
      return (
        <div
          key={char.id}
          style={{
            position: 'absolute',
            left: char.x - 130 * charScale,
            top: char.y - 100 * charScale,
            transform: `scale(${charScale})`,
            transformOrigin: 'center top',
          }}
        >
          <Pharaoh
            emotion={char.emotion}
            previousEmotion={previousEmotion}
            emotionTransitionProgress={emotionProgress}
            talking={char.talking}
            scale={1}
          />
        </div>
      );
    case 'worker':
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
          <Worker
            emotion={char.emotion}
            previousEmotion={previousEmotion}
            emotionTransitionProgress={emotionProgress}
            talking={char.talking}
            scale={1}
          />
        </div>
      );
    default:
      // Placeholder for unregistered characters
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
  /** Audio segments for lip sync (from ElevenLabsTTS) */
  audioSegments?: AudioSegment[];
  /** Global overlays (shown across all scenes) */
  globalOverlays?: OverlayData[];
  /** Background music tracks */
  musicTracks?: MusicTrack[];
  /** Sound effects */
  soundEffects?: SoundEffect[];
  showDebug?: boolean;
}

export const SceneRenderer: React.FC<SceneRendererProps> = ({
  scenes,
  audioSegments = [],
  globalOverlays = [],
  musicTracks = [],
  soundEffects = [],
  showDebug = false,
}) => {
  const frame = useCurrentFrame();

  const currentScene = findSceneAtFrame(scenes, frame);
  if (!currentScene) {
    return <AbsoluteFill style={{ backgroundColor: '#1A1A1A' }} />;
  }

  const sceneIndex = findSceneIndex(scenes, currentScene);
  const previousScene = sceneIndex > 0 ? scenes[sceneIndex - 1] : null;

  // Emotion transition progress (10 frames from scene start)
  const framesIntoScene = frame - currentScene.start;
  const emotionProgress = Math.min(1, framesIntoScene / 10);

  // Camera: current + previous for smooth transition
  const cam = currentScene.camera ?? { x: 0, y: 0, zoom: 1 };
  const prevCam = previousScene?.camera ?? { x: 0, y: 0, zoom: 1 };

  // Transition
  const transition = currentScene.transition ?? { type: 'none' as TransitionType, duration: 0 };
  const transitionProgress = transition.type !== 'none'
    ? getTransitionProgress(frame, currentScene.start, transition.duration)
    : 1;

  // Audio-driven talking: if audio segments exist, override scene talking state
  const resolveCharacterTalking = (char: SceneCharacter): boolean => {
    if (audioSegments.length > 0) {
      return isTalkingAtFrame(audioSegments, char.id, frame);
    }
    return char.talking;
  };

  // Build scene content
  const sceneContent = (
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
      {/* Background */}
      <AbsoluteFill>
        {renderBackground(currentScene.bg, currentScene.boardText ?? '')}
      </AbsoluteFill>

      {/* Characters */}
      {currentScene.characters.map((char) => {
        const prevChar = previousScene?.characters.find((c) => c.id === char.id);
        const prevEmotion: Emotion = prevChar?.emotion ?? char.emotion;
        // Use audio-driven talking if available
        const talkingChar = { ...char, talking: resolveCharacterTalking(char) };

        return renderCharacter(talkingChar, prevEmotion, emotionProgress);
      })}
    </Camera>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#1A1A1A' }}>
      {/* Background music */}
      {musicTracks.length > 0 && <MusicPlayer tracks={musicTracks} />}

      {/* Sound effects */}
      {soundEffects.length > 0 && <SFXPlayer effects={soundEffects} />}

      {/* Audio playback */}
      {audioSegments.length > 0 && audioSegments.map((seg, i) => (
        <Sequence key={`audio-seq-${i}`} from={seg.startFrame}>
          <AudioPlayer segments={[seg]} volume={1} />
        </Sequence>
      ))}

      {/* Apply transition to scene content */}
      {transition.type !== 'none' && transitionProgress < 1 ? (
        <Transition type={transition.type} progress={transitionProgress}>
          {sceneContent}
        </Transition>
      ) : (
        sceneContent
      )}

      {/* Overlays (data cards, charts, etc.) */}
      {currentScene.overlays && currentScene.overlays.length > 0 && (
        <OverlayRenderer overlays={currentScene.overlays} />
      )}
      {globalOverlays.length > 0 && (
        <OverlayRenderer overlays={globalOverlays} />
      )}

      {/* Subtitles (outside camera/transition so they stay stable) */}
      <Subtitles
        text={currentScene.subtitle}
        startFrame={currentScene.start + 5}
        endFrame={currentScene.end - 5}
      />

      {/* Debug overlay */}
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
            const talking = resolveCharacterTalking(c);
            return `${c.id}: ${c.emotion}${talking ? ' (talking)' : ''}`;
          }).join(' | ')}
          {audioSegments.length > 0 && (
            <>
              <br />
              Audio: {audioSegments.length} segments
            </>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};
