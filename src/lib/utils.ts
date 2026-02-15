const WORDS_PER_MINUTE = 140;
const FPS = 30;
const MIN_SCENE_FRAMES = 45;

export const calculateDuration = (words: number): number => {
  const frames = Math.round((words / WORDS_PER_MINUTE) * 60 * FPS);
  return Math.max(MIN_SCENE_FRAMES, frames);
};
