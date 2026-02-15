import React from 'react';
import { Sequence } from 'remotion';
import { calculateDuration } from './lib/utils';
import { Scene01 } from './scenes/Scene01';
import { Scene02 } from './scenes/Scene02';
import { Scene03 } from './scenes/Scene03';
import { Scene04 } from './scenes/Scene04';
import { Scene05 } from './scenes/Scene05';
import { Scene06 } from './scenes/Scene06';
import { Scene07 } from './scenes/Scene07';
import { Scene08 } from './scenes/Scene08';
import { Scene09 } from './scenes/Scene09';
import { Scene10 } from './scenes/Scene10';
import { Scene11 } from './scenes/Scene11';
import { Scene12 } from './scenes/Scene12';
import { Scene13 } from './scenes/Scene13';
import { Scene14 } from './scenes/Scene14';
import { Scene15 } from './scenes/Scene15';
import { Scene16 } from './scenes/Scene16';
import { Scene17 } from './scenes/Scene17';
import { Scene18 } from './scenes/Scene18';
import { Scene19 } from './scenes/Scene19';
import { Scene20 } from './scenes/Scene20';
import { Scene21 } from './scenes/Scene21';
import { Scene22 } from './scenes/Scene22';
import { Scene23 } from './scenes/Scene23';
import { Scene24 } from './scenes/Scene24';
import { Scene25 } from './scenes/Scene25';
import { Scene26 } from './scenes/Scene26';
import { Scene27 } from './scenes/Scene27';
import { Scene28 } from './scenes/Scene28';
import { Scene29 } from './scenes/Scene29';
import { Scene30 } from './scenes/Scene30';
import { Scene31 } from './scenes/Scene31';
import { Scene32 } from './scenes/Scene32';
import { Scene33 } from './scenes/Scene33';
import { Scene34 } from './scenes/Scene34';
import { Scene35 } from './scenes/Scene35';
import { Scene36 } from './scenes/Scene36';
import { Scene37 } from './scenes/Scene37';
import { Scene38 } from './scenes/Scene38';
import { Scene39 } from './scenes/Scene39';
import { Scene40 } from './scenes/Scene40';
import { Scene41 } from './scenes/Scene41';
import { Scene42 } from './scenes/Scene42';

const TARGET_DURATION_IN_FRAMES = 23_400;

const SCENES = [
  { id: 'Scene01', component: Scene01, words: 8 },
  { id: 'Scene02', component: Scene02, words: 31 },
  { id: 'Scene03', component: Scene03, words: 46 },
  { id: 'Scene04', component: Scene04, words: 8 },
  { id: 'Scene05', component: Scene05, words: 8 },
  { id: 'Scene06', component: Scene06, words: 62 },
  { id: 'Scene07', component: Scene07, words: 44 },
  { id: 'Scene08', component: Scene08, words: 56 },
  { id: 'Scene09', component: Scene09, words: 8 },
  { id: 'Scene10', component: Scene10, words: 8 },
  { id: 'Scene11', component: Scene11, words: 53 },
  { id: 'Scene12', component: Scene12, words: 8 },
  { id: 'Scene13', component: Scene13, words: 68 },
  { id: 'Scene14', component: Scene14, words: 12 },
  { id: 'Scene15', component: Scene15, words: 8 },
  { id: 'Scene16', component: Scene16, words: 8 },
  { id: 'Scene17', component: Scene17, words: 93 },
  { id: 'Scene18', component: Scene18, words: 8 },
  { id: 'Scene19', component: Scene19, words: 8 },
  { id: 'Scene20', component: Scene20, words: 8 },
  { id: 'Scene21', component: Scene21, words: 8 },
  { id: 'Scene22', component: Scene22, words: 8 },
  { id: 'Scene23', component: Scene23, words: 50 },
  { id: 'Scene24', component: Scene24, words: 71 },
  { id: 'Scene25', component: Scene25, words: 8 },
  { id: 'Scene26', component: Scene26, words: 31 },
  { id: 'Scene27', component: Scene27, words: 54 },
  { id: 'Scene28', component: Scene28, words: 8 },
  { id: 'Scene29', component: Scene29, words: 8 },
  { id: 'Scene30', component: Scene30, words: 80 },
  { id: 'Scene31', component: Scene31, words: 8 },
  { id: 'Scene32', component: Scene32, words: 47 },
  { id: 'Scene33', component: Scene33, words: 91 },
  { id: 'Scene34', component: Scene34, words: 8 },
  { id: 'Scene35', component: Scene35, words: 8 },
  { id: 'Scene36', component: Scene36, words: 112 },
  { id: 'Scene37', component: Scene37, words: 62 },
  { id: 'Scene38', component: Scene38, words: 60 },
  { id: 'Scene39', component: Scene39, words: 8 },
  { id: 'Scene40', component: Scene40, words: 72 },
  { id: 'Scene41', component: Scene41, words: 40 },
  { id: 'Scene42', component: Scene42, words: 45 },
] as const;

const buildSceneDurations = (): number[] => {
  const baseDurations = SCENES.map((scene) => calculateDuration(scene.words));
  const baseTotal = baseDurations.reduce((sum, duration) => sum + duration, 0);

  const scaled = baseDurations.map((duration) =>
    (duration / baseTotal) * TARGET_DURATION_IN_FRAMES,
  );

  const normalized = scaled.map(Math.floor);
  let remainingFrames = TARGET_DURATION_IN_FRAMES - normalized.reduce((sum, duration) => sum + duration, 0);

  const byFraction = scaled
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction);

  for (let i = 0; i < byFraction.length && remainingFrames > 0; i++) {
    normalized[byFraction[i].index] += 1;
    remainingFrames -= 1;
  }

  return normalized;
};

export const HistoryOfMoneyFull: React.FC = () => {
  const normalizedDurations = React.useMemo(buildSceneDurations, []);

  const startFrames = React.useMemo(() => {
    let cursor = 0;
    return normalizedDurations.map((duration) => {
      const start = cursor;
      cursor += duration;
      return start;
    });
  }, [normalizedDurations]);

  return (
    <>
      {normalizedDurations.map((durationInFrames, index) => {
        const SceneComponent = SCENES[index].component;
        const from = startFrames[index];

        return (
          <Sequence key={SCENES[index].id} from={from} durationInFrames={durationInFrames}>
            <SceneComponent />
          </Sequence>
        );
      })}
    </>
  );
};
