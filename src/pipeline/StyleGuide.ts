// StyleGuide: Consistent text generation in the user's style
// Provides system prompts, style rules, and Dutch/English templates
// that ensure every video feels like Professor Pint

import { buildFeedbackPrompt } from './FeedbackStore';

// ---- The Professor Pint voice ----

export const PROFESSOR_PINT_VOICE = {
  personality: [
    'Een excentrieke, Einstein-achtige professor die financiele concepten uitlegt in een kroeg',
    'Houdt altijd een pint vast - bier is zijn metafoor voor alles',
    'Gebruikt straattaal gemengd met academisch vocabulaire',
    'Maakt vergelijkingen met dagelijkse dingen: bier, boodschappen, voetbal, dating',
    'Is soms theatraal verrast door zijn eigen uitleg',
    'Eindigt altijd met een oneliner die blijft hangen',
  ],
  toneMarkers: {
    nl: {
      greetings: [
        'Zo! Pak een biertje en luister.',
        'Welkom terug in de kroeg der wijsheid!',
        'Ah, daar ben je weer. Perfect timing.',
        'Oke luister, dit gaat je verbazen.',
      ],
      transitions: [
        'Maar wacht, het wordt beter...',
        'En hier komt het mooie...',
        'Nu denk je misschien...',
        'Stel je dit eens voor...',
        'Hier wordt het interessant...',
      ],
      revelations: [
        'BAM! Daar heb je het.',
        'En DAT is wat ze je niet vertellen.',
        'Mind. Blown.',
        'Kijk, en nu snap je het.',
        'Precies. Laat dat even inzinken.',
      ],
      closings: [
        'Proost, en tot volgende week!',
        'Dat was je les voor vandaag. Proost!',
        'Onthoud dit de volgende keer dat je een biertje bestelt.',
        'Nu weet je meer dan 90% van de mensen. Proost!',
      ],
    },
    en: {
      greetings: [
        'Right! Grab a pint and listen up.',
        'Welcome back to the pub of wisdom!',
        'Ah, there you are. Perfect timing.',
        'Okay listen, this is gonna blow your mind.',
      ],
      transitions: [
        'But wait, it gets better...',
        'And here\'s the beautiful part...',
        'Now you might be thinking...',
        'Picture this...',
        'Here\'s where it gets interesting...',
      ],
      revelations: [
        'BOOM! There you have it.',
        'And THAT is what they don\'t tell you.',
        'Mind. Blown.',
        'See? Now you get it.',
        'Exactly. Let that sink in.',
      ],
      closings: [
        'Cheers, and see you next week!',
        'That\'s your lesson for today. Cheers!',
        'Remember this next time you order a pint.',
        'Now you know more than 90% of people. Cheers!',
      ],
    },
  },
};

// ---- System prompts for LLM generation ----

export const buildScriptSystemPrompt = (language: string = 'nl'): string => {
  const feedbackRules = buildFeedbackPrompt();
  const lang = language === 'nl' ? 'Dutch (Nederlands)' : 'English';
  const voice = PROFESSOR_PINT_VOICE;

  return `You are the scriptwriter for "Professor Pint", an animated YouTube series.

CHARACTER:
${voice.personality.map(p => `- ${p}`).join('\n')}

LANGUAGE: Write ALL dialogue in ${lang}.

FORMAT: Return a JSON array where each object has:
- beatType: "intro" | "hook" | "explain" | "example" | "revelation" | "recap" | "outro"
- subtitle: spoken dialogue (1-2 sentences, max 120 chars, conversational)
- boardText: chalkboard text (5 words max, ALL CAPS)
- emotion: "neutral" | "happy" | "shocked" | "thinking" | "angry" | "sad"
- cameraPreset: "slowZoomIn" | "slowZoomOut" | "panLeftToRight" | "panRightToLeft" | "establishingShot" | "dramaticZoom" | "sweepingPan" | "revealDown" | "tiltDown"

SCRIPT STRUCTURE:
1. intro: Short establishing shot, no dialogue or just a few words
2. hook: Grab attention immediately. Use humor or a surprising statement.
3. explain: Core concept. Use analogies. Make complex things simple.
4. example: Concrete, relatable example. Numbers if relevant.
5. revelation: The "aha!" moment. This should surprise.
6. recap: Quick summary of what we learned.
7. outro: Memorable closing line. Must be quotable.

IMPORTANT RULES:
- Keep subtitles SHORT (under 120 chars). People read, not study.
- Each beat should have exactly ONE key message.
- Use the chalkboard for KEY TERMS only, not full sentences.
- Board text in the language of the video.
- Vary emotions across beats - don't repeat the same emotion.
- The hook must be intriguing, not a generic "welcome".
- The revelation must genuinely surprise or reframe.
- The outro must be a one-liner people remember.

${feedbackRules}

Return ONLY valid JSON. No markdown, no explanation, no code blocks.`;
};

export const buildDialogueSystemPrompt = (language: string = 'nl'): string => {
  const feedbackRules = buildFeedbackPrompt();
  const lang = language === 'nl' ? 'Dutch (Nederlands)' : 'English';

  return `You are the scriptwriter for "Professor Pint". Write a DIALOGUE between:
- Professor Pint: eccentric professor explaining concepts (witty, uses analogies)
- Average Joe: regular pub patron, curious but clueless (asks good questions, reacts naturally)

LANGUAGE: ${lang}

FORMAT: JSON array, each object has:
- beatType: "intro" | "hook" | "explain" | "example" | "revelation" | "recap" | "outro"
- subtitle: spoken line (max 120 chars)
- boardText: chalkboard text (5 words max, ALL CAPS)
- emotion: "neutral" | "happy" | "shocked" | "thinking" | "angry" | "sad"
- character: "professorPint" | "averageJoe"
- cameraPreset: camera movement type (see list above)

DIALOGUE RULES:
- Natural back-and-forth, not a lecture
- Joe asks questions that viewers would ask
- Professor uses humor to explain
- Joe has genuine "aha!" moments
- Include pub atmosphere references (beer, peanuts, bartender)
- Joe sometimes misunderstands, Professor corrects with humor

${feedbackRules}

Return ONLY valid JSON.`;
};

// ---- Scene description prompt for background generation ----

export const buildSceneDescriptionPrompt = (
  background: string,
  context: string,
): string => {
  const feedbackRules = buildFeedbackPrompt({ background });

  return `Describe what crowd figures and props should appear in this scene.

BACKGROUND: ${background}
CONTEXT: ${context}

Available crowd figure types:
- stonePuller: bent forward pulling rope attached to stone
- stoneCarrier: walking with stone block on shoulder
- chiselWorker: kneeling, chiseling a stone block
- waterCarrier: walking with yoke and two water jars
- overseer: standing with staff, watching workers
- fanBearer: waving a large palm fan
- seated: sitting cross-legged, resting
- kneeling: kneeling forward (praying/working)
- rowerLeft/rowerRight: sitting, rowing
- baker: kneading/tending food
- sweeper: sweeping the ground

Return a JSON array of figures with: type, x (0-1920), y (0-1080), scale (0.5-1.2), flip (boolean).
Place figures where they make sense for the scene. At least 6 figures per outdoor scene.

${feedbackRules}

Return ONLY valid JSON.`;
};

// ---- Text style consistency ----

export const applyStyleConsistency = (
  text: string,
  language: string = 'nl',
): string => {
  let styled = text;

  if (language === 'nl') {
    // Ensure Dutch conversational style
    styled = styled.replace(/\bu\b/gi, 'je');
    // Don't capitalize every sentence start after ...
    styled = styled.replace(/\.\.\.\s*([A-Z])/g, (_, c) => `... ${c.toLowerCase()}`);
  }

  // Ensure max subtitle length
  if (styled.length > 120) {
    const lastSpace = styled.lastIndexOf(' ', 120);
    if (lastSpace > 80) {
      styled = styled.slice(0, lastSpace) + '...';
    }
  }

  return styled;
};

// ---- Video metadata for consistent YouTube upload ----

export interface VideoMetadata {
  title: string;
  description: string;
  tags: string[];
  category: string;
}

export const generateVideoMetadata = (
  topic: string,
  language: string = 'nl',
): VideoMetadata => {
  if (language === 'nl') {
    return {
      title: `Professor Pint legt ${topic} uit | Financieel Onderwijs`,
      description: `Professor Pint legt ${topic} uit op een manier die iedereen snapt. Pak een biertje en leer iets nieuws!

🍺 Abonneer voor wekelijkse financiele lessen van Professor Pint
📚 Meer weten? Check de links in de beschrijving

#ProfessorPint #Financien #${topic.replace(/\s+/g, '')} #Geld #Investeren`,
      tags: [
        'Professor Pint', 'financieel onderwijs', topic,
        'geld', 'investeren', 'beleggen', 'financien uitgelegd',
        'Nederlandse finance', 'geld tips',
      ],
      category: 'Education',
    };
  }

  return {
    title: `Professor Pint explains ${topic} | Financial Education`,
    description: `Professor Pint breaks down ${topic} in a way everyone can understand. Grab a pint and learn something new!

🍺 Subscribe for weekly financial lessons from Professor Pint
📚 Want more? Check the links below

#ProfessorPint #Finance #${topic.replace(/\s+/g, '')} #Money #Investing`,
    tags: [
      'Professor Pint', 'financial education', topic,
      'money', 'investing', 'finance explained',
      'personal finance', 'money tips',
    ],
    category: 'Education',
  };
};
