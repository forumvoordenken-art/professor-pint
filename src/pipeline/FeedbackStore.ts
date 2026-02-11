// FeedbackStore: Self-learning feedback system
// Stores user feedback as rules that are automatically applied to future videos.
// Feedback is stored as JSON and loaded by the pipeline before generating new content.

import * as fs from 'fs';
import * as path from 'path';

// ---- Types ----

export type FeedbackCategory =
  | 'style'        // Visual style preferences
  | 'camera'       // Camera movement preferences
  | 'text'         // Script/dialogue writing style
  | 'timing'       // Pacing and scene duration
  | 'character'    // Character behavior/placement
  | 'background'   // Scene/background preferences
  | 'audio'        // Voice/music preferences
  | 'general';     // Catch-all

export type FeedbackSeverity = 'must' | 'should' | 'nice';

export interface FeedbackRule {
  /** Unique identifier */
  id: string;
  /** When this feedback was given */
  createdAt: string;
  /** Category for filtering */
  category: FeedbackCategory;
  /** How strictly to apply this rule */
  severity: FeedbackSeverity;
  /** The rule in natural language (used as LLM instruction) */
  rule: string;
  /** Optional: specific background this applies to */
  background?: string;
  /** Optional: specific beat type this applies to */
  beatType?: string;
  /** Optional: which video prompted this feedback */
  sourceVideo?: string;
  /** Whether this rule is currently active */
  active: boolean;
  /** Times this rule has been applied */
  appliedCount: number;
}

export interface FeedbackStore {
  version: number;
  rules: FeedbackRule[];
  /** Style profile extracted from accumulated feedback */
  styleProfile: StyleProfile;
}

export interface StyleProfile {
  /** General writing tone guidelines */
  toneGuidelines: string[];
  /** Visual style preferences */
  visualPreferences: string[];
  /** Camera movement preferences */
  cameraPreferences: string[];
  /** Pacing preferences */
  pacingPreferences: string[];
  /** Things to always avoid */
  neverDo: string[];
  /** Things to always include */
  alwaysDo: string[];
}

// ---- Default store ----

const DEFAULT_STORE: FeedbackStore = {
  version: 1,
  rules: [],
  styleProfile: {
    toneGuidelines: [
      'Spreek de kijker aan als vriend in de kroeg',
      'Gebruik humor en analogieen uit het dagelijks leven',
      'Wees niet bang om te overdrijven voor effect',
      'Houd het simpel - geen jargon tenzij je het uitlegt',
    ],
    visualPreferences: [
      'Elke scene moet levendig zijn met bewegende poppetjes',
      'Minimaal 5 crowd figures per buitenscene',
      'Achtergronden moeten gedetailleerd zijn, niet minimalistisch',
      'Gebruik warme kleuren en zachte animaties',
    ],
    cameraPreferences: [
      'Nooit een statische camera - altijd subtiele beweging',
      'Professor Pint moet altijd volledig in beeld zijn',
      'Gebruik slow zoom-in bij uitleg, dramatic zoom bij revelaties',
      'Pan-shots voor establishing shots van nieuwe locaties',
    ],
    pacingPreferences: [
      'Intro kort houden (max 5 seconden)',
      'Uitleg mag langer maar wissel af met voorbeelden',
      'Revelatie-moment moet visueel opvallen (zoom + emotie)',
    ],
    neverDo: [
      'Nooit Professor Pint half buiten beeld laten bij zoom',
      'Geen lege scenes zonder crowd/details',
      'Geen lange stiltes zonder visuele actie',
    ],
    alwaysDo: [
      'Altijd crowd workers in Egypte scenes',
      'Altijd subtiele camera-beweging',
      'Altijd een memorable one-liner als afsluiter',
    ],
  },
};

// ---- Store operations ----

const STORE_PATH = path.join(process.cwd(), 'data', 'feedback.json');

/**
 * Load the feedback store from disk.
 * Returns default store if file doesn't exist.
 */
export const loadFeedbackStore = (): FeedbackStore => {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = fs.readFileSync(STORE_PATH, 'utf-8');
      return JSON.parse(data) as FeedbackStore;
    }
  } catch (err) {
    console.warn('Failed to load feedback store, using defaults:', err);
  }
  return { ...DEFAULT_STORE };
};

/**
 * Save the feedback store to disk.
 */
export const saveFeedbackStore = (store: FeedbackStore): void => {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
};

/**
 * Add a new feedback rule.
 */
export const addFeedbackRule = (
  rule: Omit<FeedbackRule, 'id' | 'createdAt' | 'active' | 'appliedCount'>,
): FeedbackRule => {
  const store = loadFeedbackStore();
  const newRule: FeedbackRule = {
    ...rule,
    id: `fb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    active: true,
    appliedCount: 0,
  };
  store.rules.push(newRule);
  saveFeedbackStore(store);
  return newRule;
};

/**
 * Get all active rules, optionally filtered.
 */
export const getActiveRules = (filter?: {
  category?: FeedbackCategory;
  background?: string;
  beatType?: string;
}): FeedbackRule[] => {
  const store = loadFeedbackStore();
  return store.rules.filter(r => {
    if (!r.active) return false;
    if (filter?.category && r.category !== filter.category) return false;
    if (filter?.background && r.background && r.background !== filter.background) return false;
    if (filter?.beatType && r.beatType && r.beatType !== filter.beatType) return false;
    return true;
  });
};

/**
 * Mark a rule as applied (increment counter).
 */
export const markRuleApplied = (ruleId: string): void => {
  const store = loadFeedbackStore();
  const rule = store.rules.find(r => r.id === ruleId);
  if (rule) {
    rule.appliedCount++;
    saveFeedbackStore(store);
  }
};

/**
 * Update the style profile.
 */
export const updateStyleProfile = (updates: Partial<StyleProfile>): void => {
  const store = loadFeedbackStore();
  store.styleProfile = { ...store.styleProfile, ...updates };
  saveFeedbackStore(store);
};

/**
 * Build a prompt section from feedback rules for LLM consumption.
 * This is injected into the system prompt when generating scripts.
 */
export const buildFeedbackPrompt = (context?: {
  background?: string;
  beatType?: string;
}): string => {
  const store = loadFeedbackStore();
  const rules = getActiveRules({
    background: context?.background,
    beatType: context?.beatType,
  });

  const profile = store.styleProfile;

  const sections: string[] = [];

  // Style profile
  sections.push('=== STYLE GUIDELINES (learned from user feedback) ===');

  if (profile.toneGuidelines.length > 0) {
    sections.push('\nTone:');
    profile.toneGuidelines.forEach(g => sections.push(`- ${g}`));
  }

  if (profile.visualPreferences.length > 0) {
    sections.push('\nVisual style:');
    profile.visualPreferences.forEach(g => sections.push(`- ${g}`));
  }

  if (profile.cameraPreferences.length > 0) {
    sections.push('\nCamera work:');
    profile.cameraPreferences.forEach(g => sections.push(`- ${g}`));
  }

  if (profile.neverDo.length > 0) {
    sections.push('\nNEVER do:');
    profile.neverDo.forEach(g => sections.push(`- ${g}`));
  }

  if (profile.alwaysDo.length > 0) {
    sections.push('\nALWAYS do:');
    profile.alwaysDo.forEach(g => sections.push(`- ${g}`));
  }

  // Specific rules
  if (rules.length > 0) {
    sections.push('\n=== SPECIFIC RULES ===');
    const mustRules = rules.filter(r => r.severity === 'must');
    const shouldRules = rules.filter(r => r.severity === 'should');

    if (mustRules.length > 0) {
      sections.push('\nMUST follow:');
      mustRules.forEach(r => sections.push(`- ${r.rule}`));
    }

    if (shouldRules.length > 0) {
      sections.push('\nSHOULD follow:');
      shouldRules.forEach(r => sections.push(`- ${r.rule}`));
    }
  }

  return sections.join('\n');
};

/**
 * Initialize the feedback store with defaults if it doesn't exist.
 */
export const initFeedbackStore = (): void => {
  if (!fs.existsSync(STORE_PATH)) {
    saveFeedbackStore(DEFAULT_STORE);
  }
};
