import React from 'react';
import { SceneRenderer } from '../systems/SceneRenderer';
import { generateScript } from '../pipeline/ScriptGenerator';
import type { AudioSegment } from '../systems/AudioSync';

// ---- Pipeline-generated video composition ----
// Uses ScriptGenerator to create scenes from a topic.
// Audio segments can be passed as props (pre-generated via ElevenLabsTTS).

interface PipelineVideoProps {
  /** Topic to explain */
  topic?: string;
  /** Duration in seconds */
  duration?: number;
  /** Language */
  language?: string;
  /** Tone */
  tone?: 'casual' | 'structured';
  /** Pre-generated audio segments (from build script) */
  audioSegments?: AudioSegment[];
  /** Show debug overlay */
  showDebug?: boolean;
}

export const PipelineVideo: React.FC<PipelineVideoProps> = ({
  topic = 'Compound Interest',
  duration = 60,
  language = 'en',
  tone = 'casual',
  audioSegments = [],
  showDebug = true,
}) => {
  // Generate scenes from topic at render time
  const scenes = React.useMemo(
    () =>
      generateScript({
        topic,
        duration,
        fps: 30,
        language,
        tone,
      }),
    [topic, duration, language, tone],
  );

  return (
    <SceneRenderer
      scenes={scenes}
      audioSegments={audioSegments}
      showDebug={showDebug}
    />
  );
};

// ---- Pre-built topic compositions ----

export const CompoundInterestVideo: React.FC = () => (
  <PipelineVideo topic="Compound Interest" duration={60} tone="casual" />
);

export const InflationVideo: React.FC = () => (
  <PipelineVideo topic="Inflation" duration={45} tone="casual" />
);

export const ETFVideo: React.FC = () => (
  <PipelineVideo topic="ETF Investing" duration={60} tone="structured" />
);

export const BudgetingVideo: React.FC = () => (
  <PipelineVideo topic="The 50/30/20 Budget Rule" duration={45} tone="casual" language="en" />
);

export const DutchTaxVideo: React.FC = () => (
  <PipelineVideo topic="Box 3 Belasting" duration={60} tone="structured" language="nl" />
);

export default PipelineVideo;
