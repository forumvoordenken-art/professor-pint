// Environment variable loader for Professor Pint pipeline
// Reads from process.env (populated by dotenv in scripts, or system env)

export interface PipelineEnv {
  elevenLabsApiKey: string;
  elevenLabsVoiceId: string;
  openaiApiKey: string;
  renderConcurrency: number;
  renderCodec: string;
}

export const loadEnv = (): PipelineEnv => {
  return {
    elevenLabsApiKey: process.env.ELEVENLABS_API_KEY ?? '',
    elevenLabsVoiceId: process.env.ELEVENLABS_VOICE_ID ?? 'pNInz6obpgDQGcFmaJgB',
    openaiApiKey: process.env.OPENAI_API_KEY ?? '',
    renderConcurrency: parseInt(process.env.RENDER_CONCURRENCY ?? '50', 10),
    renderCodec: process.env.RENDER_CODEC ?? 'h264',
  };
};
