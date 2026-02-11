// N8nPipeline: Integration layer for n8n automation
// Provides webhook-compatible endpoints for the full video generation pipeline.
// n8n sends a topic → this generates scenes → renders video → returns result

import { generateScript, generateScriptFromLines } from './ScriptGenerator';
import type { SceneData } from '../systems/SceneRenderer';
import { generateLLMScript } from './LLMClient';
import type { LLMConfig } from './LLMClient';
import { buildScriptSystemPrompt, generateVideoMetadata } from './StyleGuide';
import { buildFeedbackPrompt, loadFeedbackStore, getActiveRules, markRuleApplied } from './FeedbackStore';
import { findScenes, markSceneReused, buildSceneSummaryForLLM } from './SceneDatabase';
import { CAMERA_PRESETS, suggestCameraPreset } from '../systems/CameraPath';

// ---- Types ----

export interface N8nWebhookPayload {
  /** The topic to create a video about */
  topic: string;
  /** Language (default: nl) */
  language?: string;
  /** Duration in seconds (default: 60) */
  duration?: number;
  /** Tone: casual or structured */
  tone?: 'casual' | 'structured';
  /** Optional: specific background to use */
  background?: string;
  /** Optional: skip LLM generation, use template */
  useTemplate?: boolean;
  /** Optional: LLM API key override */
  llmApiKey?: string;
  /** Optional: ElevenLabs API key */
  ttsApiKey?: string;
}

export interface N8nPipelineResult {
  success: boolean;
  /** Scene data ready for rendering */
  scenes: SceneData[];
  /** Total frames */
  totalFrames: number;
  /** Video metadata for YouTube upload */
  metadata: ReturnType<typeof generateVideoMetadata>;
  /** Which feedback rules were applied */
  appliedRules: string[];
  /** Which stored scenes were reused */
  reusedScenes: string[];
  /** Errors if any */
  errors?: string[];
}

// ---- Backgrounds that support crowds ----
// pyramids, desertConstruction, insidePyramid, nileRiver, workersVillage, sphinxView

// ---- Main pipeline for n8n ----

/**
 * Process an n8n webhook request and generate a complete video.
 * This is the main entry point for automated video generation.
 */
export const processN8nWebhook = async (
  payload: N8nWebhookPayload,
): Promise<N8nPipelineResult> => {
  const {
    topic,
    language = 'nl',
    duration = 60,
    tone = 'casual',
    useTemplate = false,
    llmApiKey,
  } = payload;

  const appliedRules: string[] = [];
  const reusedScenes: string[] = [];
  const errors: string[] = [];
  const fps = 30;
  const totalFrames = duration * fps;

  try {
    let scenes: SceneData[];

    if (useTemplate || !llmApiKey) {
      // Template-based generation
      scenes = generateScript({
        topic, duration, fps, language, tone,
      });
    } else {
      // LLM-enhanced generation with style guide
      const llmConfig: LLMConfig = {
        apiKey: llmApiKey,
        model: 'gpt-4o-mini',
        language,
        temperature: 0.8,
      };

      const lines = await generateLLMScript(topic, llmConfig);
      scenes = generateScriptFromLines(lines, { duration, fps, tone });
    }

    // Apply camera paths to all scenes
    scenes = applyCameraPaths(scenes);

    // Apply feedback rules
    const rules = getActiveRules();
    for (const rule of rules) {
      appliedRules.push(rule.id);
      markRuleApplied(rule.id);
    }

    // Check for reusable scenes
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      const stored = findScenes({
        background: scene.bg,
        tags: [topic.toLowerCase()],
        minRating: 3,
      });

      if (stored.length > 0) {
        // Reuse the best matching scene's camera and crowd config
        const best = stored[0];
        if (best.cameraPath) {
          scenes[i].cameraPath = best.cameraPath;
        }
        markSceneReused(best.id);
        reusedScenes.push(best.id);
      }
    }

    const metadata = generateVideoMetadata(topic, language);

    return {
      success: true,
      scenes,
      totalFrames,
      metadata,
      appliedRules,
      reusedScenes,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    errors.push(errorMsg);

    // Fallback: generate basic template video
    const scenes = generateScript({
      topic, duration, fps, language, tone,
    });

    return {
      success: false,
      scenes,
      totalFrames,
      metadata: generateVideoMetadata(topic, language),
      appliedRules,
      reusedScenes,
      errors,
    };
  }
};

// ---- Camera path application ----

/**
 * Apply camera paths to scenes based on beat type and background.
 * This ensures every scene has dynamic camera movement.
 */
const applyCameraPaths = (scenes: SceneData[]): SceneData[] => {
  return scenes.map((scene, index) => {
    // Skip if scene already has a camera path
    if (scene.cameraPath) return scene;

    const sceneDuration = scene.end - scene.start;
    const beatType = scene.id.split('-')[0]; // Extract beat type from id
    const preset = suggestCameraPreset(beatType, index);
    const pathGenerator = CAMERA_PRESETS[preset];

    if (pathGenerator) {
      return {
        ...scene,
        cameraPath: pathGenerator(sceneDuration),
      };
    }

    return scene;
  });
};

// ---- Build LLM context with all available info ----

/**
 * Build a complete context string for Claude/GPT to generate optimal video content.
 * Includes: style guide, feedback rules, available scenes, available backgrounds.
 */
export const buildLLMContext = (topic: string, language: string = 'nl'): string => {
  const sections: string[] = [];

  // Style guide system prompt
  sections.push(buildScriptSystemPrompt(language));

  // Available scenes summary
  sections.push('\n' + buildSceneSummaryForLLM());

  // Available backgrounds
  sections.push('\nAvailable backgrounds:');
  sections.push('- pub: Classic pub interior with chalkboard');
  sections.push('- classroom: Academic setting');
  sections.push('- pyramids: Giza pyramids at dusk');
  sections.push('- desertConstruction: Pyramid construction site');
  sections.push('- insidePyramid: Dark tomb interior with torches');
  sections.push('- nileRiver: Nile riverside with boats');
  sections.push('- workersVillage: Ancient Egyptian worker settlement');
  sections.push('- sphinxView: Great Sphinx close-up');

  // Feedback rules
  sections.push('\n' + buildFeedbackPrompt({ background: undefined, beatType: undefined }));

  // Camera presets
  sections.push('\nAvailable camera presets:');
  sections.push('- slowZoomIn, slowZoomOut, panLeftToRight, panRightToLeft');
  sections.push('- tiltDown, tiltUp, establishingShot, dramaticZoom');
  sections.push('- followCharacter, sweepingPan, revealDown');

  return sections.join('\n');
};

// ---- Health check for n8n ----

export const healthCheck = (): {
  status: 'ok';
  feedbackRulesCount: number;
  storedScenesCount: number;
  availableBackgrounds: string[];
} => {
  const store = loadFeedbackStore();
  return {
    status: 'ok',
    feedbackRulesCount: store.rules.length,
    storedScenesCount: 0, // Would need to load scene DB
    availableBackgrounds: [
      'pub', 'classroom', 'pyramids', 'desertConstruction',
      'insidePyramid', 'nileRiver', 'workersVillage', 'sphinxView',
    ],
  };
};
