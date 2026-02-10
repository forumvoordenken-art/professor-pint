import React from 'react';
import { Composition } from 'remotion';
import { DemoVideo } from './compositions/DemoVideo';
import {
  CompoundInterestVideo,
  InflationVideo,
  ETFVideo,
  BudgetingVideo,
  DutchTaxVideo,
} from './compositions/PipelineVideo';
import { ProfessorPint } from './characters/ProfessorPint';
import { Pub } from './backgrounds/Pub';

// Character preview wrapper for Remotion Studio
const ProfessorPintPreview: React.FC = () => {
  return (
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
};

// Pub preview wrapper
const PubPreview: React.FC = () => {
  return <Pub boardText="WELCOME TO THE PUB" width={1920} height={1080} />;
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Main demo video - 20 seconds */}
      <Composition
        id="DemoVideo"
        component={DemoVideo}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Character preview - 10 seconds loop */}
      <Composition
        id="ProfessorPint-Preview"
        component={ProfessorPintPreview}
        durationInFrames={300}
        fps={30}
        width={800}
        height={600}
      />

      {/* Pub background preview */}
      <Composition
        id="Pub-Preview"
        component={PubPreview}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* Pipeline-generated videos */}
      <Composition
        id="Compound-Interest"
        component={CompoundInterestVideo}
        durationInFrames={1800}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Inflation"
        component={InflationVideo}
        durationInFrames={1350}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="ETF-Investing"
        component={ETFVideo}
        durationInFrames={1800}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Budgeting"
        component={BudgetingVideo}
        durationInFrames={1350}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Box3-Belasting"
        component={DutchTaxVideo}
        durationInFrames={1800}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
