// VideoPipeline: Orchestrates the full flow from topic to renderable video.
// topic → ScriptGenerator → ElevenLabsTTS → SceneData[] + AudioSegment[]

import { generateScript, generateScriptFromLines } from './ScriptGenerator';
import { generateAllSpeech } from './ElevenLabsTTS';
import type { ScriptConfig, LLMScriptLine } from './ScriptGenerator';
import type { TTSConfig } from './ElevenLabsTTS';
import type { SceneData } from '../systems/SceneRenderer';
import type { AudioSegment } from '../systems/AudioSync';

// ---- Pipeline Config ----

export interface PipelineConfig {
  /** Script generation settings */
  script: ScriptConfig;
  /** TTS settings (optional - skips audio if not provided) */
  tts?: TTSConfig;
}

// ---- Pipeline Output ----

export interface PipelineOutput {
  /** Scene data ready for SceneRenderer */
  scenes: SceneData[];
  /** Audio segments ready for AudioSync (empty if no TTS) */
  audioSegments: AudioSegment[];
  /** Total duration in frames */
  totalFrames: number;
  /** Frames per second */
  fps: number;
  /** Metadata about the generation */
  meta: {
    topic: string;
    language: string;
    tone: string;
    sceneCount: number;
    hasAudio: boolean;
  };
}

// ---- Main Pipeline ----

/**
 * Generate a complete video from a topic.
 *
 * Usage:
 * ```ts
 * const result = await runPipeline({
 *   script: { topic: 'compound interest', duration: 60, language: 'en' },
 *   tts: { apiKey: process.env.ELEVENLABS_API_KEY },
 * });
 * // result.scenes → pass to SceneRenderer
 * // result.audioSegments → pass to AudioSync
 * ```
 */
export const runPipeline = async (config: PipelineConfig): Promise<PipelineOutput> => {
  const { script: scriptConfig, tts: ttsConfig } = config;
  const fps = scriptConfig.fps ?? 30;
  const duration = scriptConfig.duration ?? 60;

  // Step 1: Generate script (scene data)
  const scenes = generateScript(scriptConfig);

  // Step 2: Generate audio (if TTS config provided)
  let audioSegments: AudioSegment[] = [];
  if (ttsConfig) {
    audioSegments = await generateAllSpeech(scenes, ttsConfig);
  }

  return {
    scenes,
    audioSegments,
    totalFrames: duration * fps,
    fps,
    meta: {
      topic: scriptConfig.topic,
      language: scriptConfig.language ?? 'en',
      tone: scriptConfig.tone ?? 'casual',
      sceneCount: scenes.length,
      hasAudio: audioSegments.length > 0,
    },
  };
};

// ---- LLM-enhanced pipeline ----

/**
 * Generate a video from LLM-provided script lines.
 * Use this when you have AI-generated dialogue (e.g., from ChatGPT/Claude).
 */
export const runPipelineFromLines = async (
  lines: LLMScriptLine[],
  config: PipelineConfig,
): Promise<PipelineOutput> => {
  const { script: scriptConfig, tts: ttsConfig } = config;
  const fps = scriptConfig.fps ?? 30;
  const duration = scriptConfig.duration ?? 60;

  // Step 1: Generate scenes from LLM lines
  const scenes = generateScriptFromLines(lines, scriptConfig);

  // Step 2: Generate audio
  let audioSegments: AudioSegment[] = [];
  if (ttsConfig) {
    audioSegments = await generateAllSpeech(scenes, ttsConfig);
  }

  return {
    scenes,
    audioSegments,
    totalFrames: duration * fps,
    fps,
    meta: {
      topic: scriptConfig.topic,
      language: scriptConfig.language ?? 'en',
      tone: scriptConfig.tone ?? 'casual',
      sceneCount: scenes.length,
      hasAudio: audioSegments.length > 0,
    },
  };
};

// ---- Quick generation helpers ----

/**
 * Quick: Generate a 30-second casual video about a topic.
 */
export const quickVideo = async (
  topic: string,
  apiKey?: string,
): Promise<PipelineOutput> => {
  return runPipeline({
    script: { topic, duration: 30, tone: 'casual' },
    tts: apiKey ? { apiKey } : undefined,
  });
};

/**
 * Quick: Generate a 60-second structured lesson.
 */
export const lessonVideo = async (
  topic: string,
  language: string = 'en',
  apiKey?: string,
): Promise<PipelineOutput> => {
  return runPipeline({
    script: { topic, duration: 60, tone: 'structured', language },
    tts: apiKey ? { apiKey } : undefined,
  });
};
