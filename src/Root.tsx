import React from 'react';
import { Composition } from 'remotion';
import { DemoVideo } from './compositions/DemoVideo';
import { DialogueDemo } from './compositions/DialogueDemo';
import {
  CompoundInterestVideo,
  InflationVideo,
  ETFVideo,
  BudgetingVideo,
  DutchTaxVideo,
} from './compositions/PipelineVideo';
import { ProfessorPint } from './characters/ProfessorPint';
import { AverageJoe } from './characters/AverageJoe';
import { Pharaoh } from './characters/Pharaoh';
import { WallStreetBroker } from './characters/WallStreetBroker';
import { CryptoBro } from './characters/CryptoBro';
import { Banker } from './characters/Banker';
import { MarketVendor } from './characters/MarketVendor';
import { TaxAdvisor } from './characters/TaxAdvisor';
import { Pub } from './backgrounds/Pub';
import { Classroom } from './backgrounds/Classroom';
import { Pyramids } from './backgrounds/Pyramids';

// ---- Character preview helper ----
const CharPreview: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#E8E8E0',
  }}>
    {children}
  </div>
);

// Character preview wrappers
const ProfessorPintPreview: React.FC = () => (
  <CharPreview><ProfessorPint emotion="happy" talking={true} scale={2} /></CharPreview>
);
const AverageJoePreview: React.FC = () => (
  <CharPreview><AverageJoe emotion="happy" talking={true} scale={2} /></CharPreview>
);
const PharaohPreview: React.FC = () => (
  <CharPreview><Pharaoh emotion="happy" talking={true} scale={2} /></CharPreview>
);
const WallStreetBrokerPreview: React.FC = () => (
  <CharPreview><WallStreetBroker emotion="happy" talking={true} scale={2} /></CharPreview>
);
const CryptoBroPreview: React.FC = () => (
  <CharPreview><CryptoBro emotion="happy" talking={true} scale={2} /></CharPreview>
);
const BankerPreview: React.FC = () => (
  <CharPreview><Banker emotion="neutral" talking={true} scale={2} /></CharPreview>
);
const MarketVendorPreview: React.FC = () => (
  <CharPreview><MarketVendor emotion="happy" talking={true} scale={2} /></CharPreview>
);
const TaxAdvisorPreview: React.FC = () => (
  <CharPreview><TaxAdvisor emotion="thinking" talking={true} scale={2} /></CharPreview>
);

// Background preview wrappers
const PubPreview: React.FC = () => (
  <Pub boardText="WELCOME TO THE PUB" width={1920} height={1080} />
);
const ClassroomPreview: React.FC = () => (
  <Classroom boardText="WELCOME TO CLASS" width={1920} height={1080} />
);
const PyramidsPreview: React.FC = () => (
  <Pyramids boardText="ANCIENT ECONOMICS" width={1920} height={1080} />
);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ===== MAIN VIDEOS ===== */}
      <Composition
        id="DemoVideo"
        component={DemoVideo}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="DialogueDemo"
        component={DialogueDemo}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ===== CHARACTER PREVIEWS ===== */}
      <Composition
        id="ProfessorPint-Preview"
        component={ProfessorPintPreview}
        durationInFrames={300}
        fps={30}
        width={800}
        height={600}
      />
      <Composition
        id="AverageJoe-Preview"
        component={AverageJoePreview}
        durationInFrames={300}
        fps={30}
        width={800}
        height={600}
      />
      <Composition
        id="Pharaoh-Preview"
        component={PharaohPreview}
        durationInFrames={300}
        fps={30}
        width={800}
        height={600}
      />
      <Composition
        id="WallStreetBroker-Preview"
        component={WallStreetBrokerPreview}
        durationInFrames={300}
        fps={30}
        width={800}
        height={600}
      />
      <Composition
        id="CryptoBro-Preview"
        component={CryptoBroPreview}
        durationInFrames={300}
        fps={30}
        width={800}
        height={600}
      />
      <Composition
        id="Banker-Preview"
        component={BankerPreview}
        durationInFrames={300}
        fps={30}
        width={800}
        height={600}
      />
      <Composition
        id="MarketVendor-Preview"
        component={MarketVendorPreview}
        durationInFrames={300}
        fps={30}
        width={800}
        height={600}
      />
      <Composition
        id="TaxAdvisor-Preview"
        component={TaxAdvisorPreview}
        durationInFrames={300}
        fps={30}
        width={800}
        height={600}
      />

      {/* ===== BACKGROUND PREVIEWS ===== */}
      <Composition
        id="Pub-Preview"
        component={PubPreview}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Classroom-Preview"
        component={ClassroomPreview}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Pyramids-Preview"
        component={PyramidsPreview}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ===== PIPELINE VIDEOS ===== */}
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
