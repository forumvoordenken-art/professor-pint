import React from 'react';
import {SceneShell} from '../components/SceneShell';

export const Scene21: React.FC = () => {
  return (
    <SceneShell title="Scene 21">
      <circle cx={960} cy={540} r={140} fill="#60a5fa" opacity={0.85} />
      <rect x={760} y={700} width={400} height={120} rx={16} fill="#111827" opacity={0.8} />
      <text x={890} y={775} fill="#f9fafb" fontSize={42} fontWeight={700}>
        TODO
      </text>
    </SceneShell>
  );
};
