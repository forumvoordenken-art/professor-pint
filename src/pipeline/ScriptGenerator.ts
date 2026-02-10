// ScriptGenerator: Topic → SceneData[] JSON
// Generates a complete video script from a topic string.
// Can work standalone (template-based) or with an LLM API for dynamic scripts.

import type { SceneData } from '../systems/SceneRenderer';
import type { Emotion } from '../animations/emotions';
import type { TransitionType } from '../systems/Transitions';
import type { OverlayData } from '../systems/Overlays';

// ---- Script Config ----

export interface ScriptConfig {
  /** The topic to explain */
  topic: string;
  /** Target duration in seconds (default: 60) */
  duration?: number;
  /** Frames per second (default: 30) */
  fps?: number;
  /** Language for subtitles (default: 'en') */
  language?: string;
  /** Tone: casual pub chat or more structured lesson */
  tone?: 'casual' | 'structured';
}

// ---- Internal types ----

interface ScriptBeat {
  type: 'intro' | 'hook' | 'explain' | 'example' | 'revelation' | 'recap' | 'outro';
  emotion: Emotion;
  talking: boolean;
  durationRatio: number; // fraction of total duration
  boardText?: string;
  camera: { x: number; y: number; zoom: number };
  transition: { type: TransitionType; duration: number };
}

// ---- Beat templates ----

const BEAT_TEMPLATES: Record<string, ScriptBeat[]> = {
  casual: [
    {
      type: 'intro',
      emotion: 'neutral',
      talking: false,
      durationRatio: 0.08,
      camera: { x: 0, y: -50, zoom: 1.1 },
      transition: { type: 'crossfade', duration: 20 },
    },
    {
      type: 'hook',
      emotion: 'happy',
      talking: true,
      durationRatio: 0.15,
      camera: { x: 50, y: 0, zoom: 1.3 },
      transition: { type: 'crossfade', duration: 15 },
    },
    {
      type: 'explain',
      emotion: 'thinking',
      talking: true,
      durationRatio: 0.22,
      camera: { x: -30, y: 20, zoom: 1.15 },
      transition: { type: 'wipe', duration: 18 },
    },
    {
      type: 'example',
      emotion: 'happy',
      talking: true,
      durationRatio: 0.18,
      camera: { x: 20, y: -10, zoom: 1.25 },
      transition: { type: 'slide', duration: 15 },
    },
    {
      type: 'revelation',
      emotion: 'shocked',
      talking: true,
      durationRatio: 0.15,
      camera: { x: 0, y: -20, zoom: 1.5 },
      transition: { type: 'zoomIn', duration: 15 },
    },
    {
      type: 'recap',
      emotion: 'thinking',
      talking: true,
      durationRatio: 0.12,
      camera: { x: -20, y: 10, zoom: 1.2 },
      transition: { type: 'crossfade', duration: 15 },
    },
    {
      type: 'outro',
      emotion: 'happy',
      talking: false,
      durationRatio: 0.10,
      camera: { x: 0, y: 0, zoom: 1 },
      transition: { type: 'iris', duration: 20 },
    },
  ],
  structured: [
    {
      type: 'intro',
      emotion: 'neutral',
      talking: false,
      durationRatio: 0.06,
      camera: { x: 0, y: -30, zoom: 1.05 },
      transition: { type: 'crossfade', duration: 20 },
    },
    {
      type: 'hook',
      emotion: 'happy',
      talking: true,
      durationRatio: 0.12,
      camera: { x: 40, y: 0, zoom: 1.2 },
      transition: { type: 'crossfade', duration: 15 },
    },
    {
      type: 'explain',
      emotion: 'neutral',
      talking: true,
      durationRatio: 0.25,
      camera: { x: -20, y: 10, zoom: 1.1 },
      transition: { type: 'wipe', duration: 18 },
    },
    {
      type: 'example',
      emotion: 'thinking',
      talking: true,
      durationRatio: 0.20,
      camera: { x: 30, y: -10, zoom: 1.2 },
      transition: { type: 'slide', duration: 15 },
    },
    {
      type: 'revelation',
      emotion: 'shocked',
      talking: true,
      durationRatio: 0.12,
      camera: { x: 0, y: -20, zoom: 1.4 },
      transition: { type: 'zoomIn', duration: 15 },
    },
    {
      type: 'recap',
      emotion: 'neutral',
      talking: true,
      durationRatio: 0.15,
      camera: { x: -10, y: 0, zoom: 1.1 },
      transition: { type: 'crossfade', duration: 15 },
    },
    {
      type: 'outro',
      emotion: 'happy',
      talking: false,
      durationRatio: 0.10,
      camera: { x: 0, y: 0, zoom: 1 },
      transition: { type: 'iris', duration: 20 },
    },
  ],
};

// ---- Board text generation ----

const generateBoardText = (beat: ScriptBeat, topic: string, _index: number): string => {
  switch (beat.type) {
    case 'intro':
      return `TODAY'S TOPIC`;
    case 'hook':
      return topic.toUpperCase();
    case 'explain':
      return `HOW IT WORKS`;
    case 'example':
      return `EXAMPLE`;
    case 'revelation':
      return `THE TRUTH`;
    case 'recap':
      return `KEY TAKEAWAYS`;
    case 'outro':
      return `PROFESSOR PINT`;
    default:
      return '';
  }
};

// ---- Subtitle templates per beat type ----

const SUBTITLE_TEMPLATES: Record<string, Record<string, string>> = {
  en: {
    intro: '',
    hook: `Welcome to the pub! Today we're talking about {topic}. Grab a pint and listen up.`,
    explain: `So here's the thing about {topic}. Most people get this completely wrong.`,
    example: `Let me give you a real example. Imagine you're at the bar...`,
    revelation: `And here's what nobody tells you. This changes everything.`,
    recap: `So remember: {topic} isn't as complicated as they make it seem.`,
    outro: `That's your lesson for today. Same time next week? Cheers!`,
  },
  nl: {
    intro: '',
    hook: `Welkom in de kroeg! Vandaag hebben we het over {topic}. Pak een biertje erbij.`,
    explain: `Dus dit is het ding over {topic}. De meeste mensen snappen dit helemaal verkeerd.`,
    example: `Laat me een voorbeeld geven. Stel je voor dat je aan de bar zit...`,
    revelation: `En hier is wat niemand je vertelt. Dit verandert alles.`,
    recap: `Dus onthoud: {topic} is niet zo ingewikkeld als ze het laten lijken.`,
    outro: `Dat was de les voor vandaag. Zelfde tijd volgende week? Proost!`,
  },
};

// ---- Overlay generation per beat ----

const generateOverlays = (
  beatType: string,
  topic: string,
  startFrame: number,
  endFrame: number,
): OverlayData[] => {
  const overlays: OverlayData[] = [];
  const pad = 15; // frames padding from scene edges

  switch (beatType) {
    case 'intro':
      // Topic card lower third
      overlays.push({
        type: 'topicCard',
        startFrame: startFrame + pad,
        endFrame: endFrame - pad,
        props: { topic, subtitle: 'Professor Pint explains...' },
      });
      break;

    case 'explain':
      // Fact box with key insight
      overlays.push({
        type: 'factBox',
        startFrame: startFrame + pad + 10,
        endFrame: endFrame - pad,
        props: {
          text: `Most people misunderstand ${topic}. Here's why it matters.`,
          accent: '?',
          position: 'right',
        },
      });
      break;

    case 'example':
      // Bar chart example
      overlays.push({
        type: 'barChart',
        startFrame: startFrame + pad,
        endFrame: endFrame - pad,
        props: {
          title: 'The Numbers',
          bars: [
            { label: 'Year 1', value: 100, color: '#D4A012' },
            { label: 'Year 5', value: 128, color: '#E8B830' },
            { label: 'Year 10', value: 163, color: '#F0C850' },
            { label: 'Year 20', value: 265, color: '#FFD700' },
          ],
          position: 'left',
        },
      });
      break;

    case 'revelation':
      // Stat card with big number
      overlays.push({
        type: 'statCard',
        startFrame: startFrame + pad,
        endFrame: endFrame - pad,
        props: {
          value: '165%',
          label: 'Growth over 20 years',
          position: 'right',
          color: '#FF6B35',
        },
      });
      break;

    case 'recap':
      // Summary fact box
      overlays.push({
        type: 'factBox',
        startFrame: startFrame + pad,
        endFrame: endFrame - pad,
        props: {
          text: `Key takeaway: Understand ${topic} and you're already ahead of 90% of people.`,
          accent: '★',
          position: 'right',
        },
      });
      break;
  }

  return overlays;
};

// ---- Main generator ----

/**
 * Generate a complete video script from a topic.
 * Returns SceneData[] ready for SceneRenderer.
 */
export const generateScript = (config: ScriptConfig): SceneData[] => {
  const {
    topic,
    duration = 60,
    fps = 30,
    language = 'en',
    tone = 'casual',
  } = config;

  const totalFrames = duration * fps;
  const beats = BEAT_TEMPLATES[tone] ?? BEAT_TEMPLATES.casual;
  const subtitles = SUBTITLE_TEMPLATES[language] ?? SUBTITLE_TEMPLATES.en;

  const scenes: SceneData[] = [];
  let currentFrame = 0;

  for (let i = 0; i < beats.length; i++) {
    const beat = beats[i];
    const beatFrames = Math.round(totalFrames * beat.durationRatio);
    const startFrame = currentFrame;
    const endFrame = currentFrame + beatFrames;

    const subtitleTemplate = subtitles[beat.type] ?? '';
    const subtitle = subtitleTemplate.replace(/\{topic\}/g, topic);
    const boardText = beat.boardText ?? generateBoardText(beat, topic, i);

    const overlays = generateOverlays(beat.type, topic, startFrame, endFrame);

    scenes.push({
      id: `${beat.type}-${i}`,
      start: startFrame,
      end: endFrame,
      bg: 'pub',
      boardText,
      camera: beat.camera,
      characters: [
        {
          id: 'professorPint',
          x: 960,
          y: 420,
          scale: 2,
          emotion: beat.emotion,
          talking: beat.talking,
        },
      ],
      subtitle,
      transition: beat.transition,
      overlays,
    });

    currentFrame = endFrame;
  }

  // Ensure last scene reaches totalFrames
  if (scenes.length > 0) {
    scenes[scenes.length - 1].end = totalFrames;
  }

  return scenes;
};

// ---- LLM-enhanced generation ----

export interface LLMScriptLine {
  beatType: string;
  subtitle: string;
  boardText: string;
  emotion: Emotion;
}

/**
 * Generate scenes from LLM-provided script lines.
 * Use this when you have AI-generated dialogue.
 */
export const generateScriptFromLines = (
  lines: LLMScriptLine[],
  config: Pick<ScriptConfig, 'duration' | 'fps' | 'tone'>,
): SceneData[] => {
  const { duration = 60, fps = 30, tone = 'casual' } = config;
  const totalFrames = duration * fps;
  const beats = BEAT_TEMPLATES[tone] ?? BEAT_TEMPLATES.casual;

  const scenes: SceneData[] = [];
  const framesPerLine = Math.floor(totalFrames / lines.length);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Use matching beat template for camera/transition, fallback to cycling
    const beatIndex = Math.min(i, beats.length - 1);
    const beat = beats[beatIndex];

    scenes.push({
      id: `scene-${i}`,
      start: i * framesPerLine,
      end: (i + 1) * framesPerLine,
      bg: 'pub',
      boardText: line.boardText,
      camera: beat.camera,
      characters: [
        {
          id: 'professorPint',
          x: 960,
          y: 420,
          scale: 2,
          emotion: line.emotion,
          talking: line.subtitle.length > 0,
        },
      ],
      subtitle: line.subtitle,
      transition: beat.transition,
    });
  }

  if (scenes.length > 0) {
    scenes[scenes.length - 1].end = totalFrames;
  }

  return scenes;
};
