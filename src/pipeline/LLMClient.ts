// LLM Client for dynamic script generation
// Uses OpenAI-compatible API (works with OpenAI, Azure, or local models)
// Generates structured dialogue from a topic using the scene schema.

import type { LLMScriptLine } from './ScriptGenerator';
import type { Emotion } from '../animations/emotions';

// ---- Config ----

export interface LLMConfig {
  /** OpenAI API key */
  apiKey: string;
  /** Model ID (default: gpt-4o-mini) */
  model?: string;
  /** API base URL (default: OpenAI) */
  baseUrl?: string;
  /** Temperature 0-2 (default: 0.8) */
  temperature?: number;
  /** Language for output (default: en) */
  language?: string;
}

// ---- System prompt ----

const SYSTEM_PROMPT = `You are a scriptwriter for "Professor Pint", an animated YouTube series where a quirky Einstein-like professor explains financial topics at a pub.

Your job is to write dialogue scripts. Each line has:
- beatType: one of "intro", "hook", "explain", "example", "revelation", "recap", "outro"
- subtitle: the spoken dialogue (1-2 sentences, conversational)
- boardText: short text for the pub's chalkboard (5 words max, ALL CAPS)
- emotion: one of "neutral", "happy", "shocked", "thinking", "angry", "sad"

Guidelines:
- Keep it casual and fun, like explaining to a friend at a pub
- Use analogies and everyday examples
- Include a surprising fact or "revelation" moment
- The professor is witty, slightly eccentric, and passionate
- Always start with a greeting/hook and end with a memorable takeaway
- Keep each subtitle under 120 characters for readability

Return ONLY a valid JSON array of objects with those 4 fields. No markdown, no explanation.`;

const DIALOGUE_SYSTEM_PROMPT = `You are a scriptwriter for "Professor Pint", an animated YouTube series. You're writing a dialogue between:
- Professor Pint: a quirky Einstein-like professor who explains financial concepts
- Average Joe: a regular pub patron learning about finance

Each line has:
- beatType: one of "intro", "hook", "explain", "example", "revelation", "recap", "outro"
- subtitle: the spoken dialogue (1-2 sentences, conversational)
- boardText: short text for the chalkboard (5 words max, ALL CAPS)
- emotion: one of "neutral", "happy", "shocked", "thinking", "angry", "sad"
- character: either "professorPint" or "averageJoe"

Guidelines:
- Natural back-and-forth conversation
- Joe asks questions, Professor explains
- Joe reacts with surprise/confusion, Professor clarifies
- Include humor and pub atmosphere references
- Keep each subtitle under 120 characters

Return ONLY a valid JSON array. No markdown, no explanation.`;

// ---- Types for response ----

interface LLMScriptLineWithCharacter extends LLMScriptLine {
  character?: string;
}

// ---- Main generation function ----

/**
 * Generate a script from a topic using an LLM.
 * Returns structured dialogue lines ready for ScriptGenerator.
 */
export const generateLLMScript = async (
  topic: string,
  config: LLMConfig,
): Promise<LLMScriptLine[]> => {
  const {
    apiKey,
    model = 'gpt-4o-mini',
    baseUrl = 'https://api.openai.com/v1',
    temperature = 0.8,
    language = 'en',
  } = config;

  if (!apiKey) {
    return generateFallbackScript(topic, language);
  }

  const langInstruction = language === 'nl'
    ? 'Write ALL dialogue in Dutch (Nederlands).'
    : language !== 'en'
      ? `Write ALL dialogue in ${language}.`
      : '';

  const userPrompt = `Write a 7-beat script about: "${topic}"

The video is about 60 seconds. Each beat should have 1-2 sentences of dialogue.
${langInstruction}

Topic context: This is for a YouTube Shorts/TikTok style financial education video.`;

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature,
      max_tokens: 1500,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`LLM API error ${response.status}: ${errorText}`);
    return generateFallbackScript(topic, language);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content ?? '';

  return parseLLMResponse(content, topic, language);
};

/**
 * Generate a dialogue script (two characters) from a topic using an LLM.
 */
export const generateLLMDialogue = async (
  topic: string,
  config: LLMConfig,
): Promise<LLMScriptLineWithCharacter[]> => {
  const {
    apiKey,
    model = 'gpt-4o-mini',
    baseUrl = 'https://api.openai.com/v1',
    temperature = 0.8,
    language = 'en',
  } = config;

  if (!apiKey) {
    return generateFallbackDialogue(topic, language);
  }

  const langInstruction = language === 'nl'
    ? 'Write ALL dialogue in Dutch (Nederlands).'
    : '';

  const userPrompt = `Write a 7-beat dialogue script about: "${topic}"

Professor Pint teaches Average Joe about this topic. Include natural reactions.
${langInstruction}`;

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: DIALOGUE_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    return generateFallbackDialogue(topic, language);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content ?? '';

  return parseDialogueResponse(content, topic, language);
};

// ---- Response parsing ----

const parseLLMResponse = (
  content: string,
  topic: string,
  language: string,
): LLMScriptLine[] => {
  try {
    // Try to extract JSON from the response (handle markdown wrapping)
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.warn('Could not find JSON array in LLM response, using fallback');
      return generateFallbackScript(topic, language);
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return generateFallbackScript(topic, language);
    }

    // Validate and sanitize each line
    return parsed.map((line: Record<string, unknown>) => ({
      beatType: validateBeatType(line.beatType as string),
      subtitle: String(line.subtitle ?? '').slice(0, 200),
      boardText: String(line.boardText ?? topic.toUpperCase()).slice(0, 40),
      emotion: validateEmotion(line.emotion as string),
    }));
  } catch {
    console.warn('Failed to parse LLM response, using fallback');
    return generateFallbackScript(topic, language);
  }
};

const parseDialogueResponse = (
  content: string,
  topic: string,
  language: string,
): LLMScriptLineWithCharacter[] => {
  try {
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return generateFallbackDialogue(topic, language);
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return generateFallbackDialogue(topic, language);
    }

    return parsed.map((line: Record<string, unknown>) => ({
      beatType: validateBeatType(line.beatType as string),
      subtitle: String(line.subtitle ?? '').slice(0, 200),
      boardText: String(line.boardText ?? topic.toUpperCase()).slice(0, 40),
      emotion: validateEmotion(line.emotion as string),
      character: line.character === 'averageJoe' ? 'averageJoe' : 'professorPint',
    }));
  } catch {
    return generateFallbackDialogue(topic, language);
  }
};

// ---- Validation helpers ----

const VALID_BEAT_TYPES = ['intro', 'hook', 'explain', 'example', 'revelation', 'recap', 'outro'];
const VALID_EMOTIONS: Emotion[] = ['neutral', 'happy', 'shocked', 'thinking', 'angry', 'sad'];

const validateBeatType = (type: string): string => {
  return VALID_BEAT_TYPES.includes(type) ? type : 'explain';
};

const validateEmotion = (emotion: string): Emotion => {
  return VALID_EMOTIONS.includes(emotion as Emotion) ? (emotion as Emotion) : 'neutral';
};

// ---- Fallback scripts (no API needed) ----

const generateFallbackScript = (topic: string, language: string): LLMScriptLine[] => {
  if (language === 'nl') {
    return [
      { beatType: 'intro', subtitle: '', boardText: "VANDAAG'S ONDERWERP", emotion: 'neutral' as Emotion },
      { beatType: 'hook', subtitle: `Welkom in de kroeg! Vandaag gaan we het hebben over ${topic}.`, boardText: topic.toUpperCase(), emotion: 'happy' as Emotion },
      { beatType: 'explain', subtitle: `Dus ${topic}... de meeste mensen begrijpen dit helemaal verkeerd.`, boardText: 'HOE HET WERKT', emotion: 'thinking' as Emotion },
      { beatType: 'example', subtitle: 'Laat me een simpel voorbeeld geven dat alles duidelijk maakt.', boardText: 'VOORBEELD', emotion: 'happy' as Emotion },
      { beatType: 'revelation', subtitle: 'En hier komt het... dit is wat niemand je vertelt!', boardText: 'DE WAARHEID', emotion: 'shocked' as Emotion },
      { beatType: 'recap', subtitle: `Dus onthoud: ${topic} is makkelijker dan je denkt.`, boardText: 'SAMENVATTING', emotion: 'thinking' as Emotion },
      { beatType: 'outro', subtitle: 'Dat was het voor vandaag. Proost!', boardText: 'PROFESSOR PINT', emotion: 'happy' as Emotion },
    ];
  }

  return [
    { beatType: 'intro', subtitle: '', boardText: "TODAY'S TOPIC", emotion: 'neutral' as Emotion },
    { beatType: 'hook', subtitle: `Welcome to the pub! Today we're diving into ${topic}.`, boardText: topic.toUpperCase(), emotion: 'happy' as Emotion },
    { beatType: 'explain', subtitle: `So ${topic}... most people get this completely wrong.`, boardText: 'HOW IT WORKS', emotion: 'thinking' as Emotion },
    { beatType: 'example', subtitle: 'Let me give you a simple example that makes it all click.', boardText: 'EXAMPLE', emotion: 'happy' as Emotion },
    { beatType: 'revelation', subtitle: 'And here\'s the kicker... this is what nobody tells you!', boardText: 'THE TRUTH', emotion: 'shocked' as Emotion },
    { beatType: 'recap', subtitle: `So remember: ${topic} is simpler than you think.`, boardText: 'KEY TAKEAWAYS', emotion: 'thinking' as Emotion },
    { beatType: 'outro', subtitle: 'That\'s your lesson for today. Cheers!', boardText: 'PROFESSOR PINT', emotion: 'happy' as Emotion },
  ];
};

const generateFallbackDialogue = (topic: string, language: string): LLMScriptLineWithCharacter[] => {
  if (language === 'nl') {
    return [
      { beatType: 'intro', subtitle: '', boardText: topic.toUpperCase(), emotion: 'neutral' as Emotion, character: 'professorPint' },
      { beatType: 'hook', subtitle: `Joe, vandaag ga ik je alles uitleggen over ${topic}.`, boardText: topic.toUpperCase(), emotion: 'happy' as Emotion, character: 'professorPint' },
      { beatType: 'explain', subtitle: `${topic}? Ik heb er weleens van gehoord maar snap het niet echt.`, boardText: topic.toUpperCase(), emotion: 'thinking' as Emotion, character: 'averageJoe' },
      { beatType: 'example', subtitle: 'Oké, stel je voor dat je elke maand een tientje opzij zet...', boardText: 'VOORBEELD', emotion: 'happy' as Emotion, character: 'professorPint' },
      { beatType: 'revelation', subtitle: 'Wacht even... dat wordt zóveel geld?!', boardText: 'DE WAARHEID', emotion: 'shocked' as Emotion, character: 'averageJoe' },
      { beatType: 'recap', subtitle: 'Precies! En hoe eerder je begint, hoe beter.', boardText: 'SAMENVATTING', emotion: 'happy' as Emotion, character: 'professorPint' },
      { beatType: 'outro', subtitle: 'Oké, ik ga vanavond nog beginnen. Proost professor!', boardText: 'PROOST!', emotion: 'happy' as Emotion, character: 'averageJoe' },
    ];
  }

  return [
    { beatType: 'intro', subtitle: '', boardText: topic.toUpperCase(), emotion: 'neutral' as Emotion, character: 'professorPint' },
    { beatType: 'hook', subtitle: `Alright Joe, today I'm going to explain ${topic} to you.`, boardText: topic.toUpperCase(), emotion: 'happy' as Emotion, character: 'professorPint' },
    { beatType: 'explain', subtitle: `${topic}? I've heard of it but never really understood it.`, boardText: topic.toUpperCase(), emotion: 'thinking' as Emotion, character: 'averageJoe' },
    { beatType: 'example', subtitle: 'Okay, imagine you put just ten bucks aside every month...', boardText: 'EXAMPLE', emotion: 'happy' as Emotion, character: 'professorPint' },
    { beatType: 'revelation', subtitle: 'Hold on... that becomes THAT much money?!', boardText: 'THE TRUTH', emotion: 'shocked' as Emotion, character: 'averageJoe' },
    { beatType: 'recap', subtitle: 'Exactly! And the earlier you start, the better it gets.', boardText: 'KEY TAKEAWAYS', emotion: 'happy' as Emotion, character: 'professorPint' },
    { beatType: 'outro', subtitle: 'Alright, I\'m starting tonight. Cheers, Professor!', boardText: 'CHEERS!', emotion: 'happy' as Emotion, character: 'averageJoe' },
  ];
};
