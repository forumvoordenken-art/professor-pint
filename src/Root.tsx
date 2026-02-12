import React from 'react';
import { Composition } from 'remotion';
import { SceneComposerTest } from './videos/TestVideo';
import { ProfessorPint } from './personages/ProfessorPint';

const ProfessorPintPreview: React.FC = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#E8E8E0',
  }}>
    <ProfessorPint emotion="happy" talking={true} scale={2} />
  </div>
);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SceneComposer-Test"
        component={SceneComposerTest}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ProfessorPint-Preview"
        component={ProfessorPintPreview}
        durationInFrames={300}
        fps={30}
        width={800}
        height={600}
      />
    </>
  );
};
