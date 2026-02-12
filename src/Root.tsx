import React from 'react';
import { Composition } from 'remotion';
import { DemoVideo } from './compositions/DemoVideo';
import { DialogueDemo } from './compositions/DialogueDemo';
import { SceneComposerTest } from './compositions/SceneComposerTest';
import { PyramidsOfGiza } from './compositions/PyramidsOfGiza';
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
import { Worker } from './characters/Worker';
import { WallStreetBroker } from './characters/WallStreetBroker';
import { CryptoBro } from './characters/CryptoBro';
import { Banker } from './characters/Banker';
import { MarketVendor } from './characters/MarketVendor';
import { TaxAdvisor } from './characters/TaxAdvisor';
import { Pub } from './backgrounds/Pub';
import { Classroom } from './backgrounds/Classroom';
import { Pyramids } from './backgrounds/Pyramids';
import { DesertConstruction } from './backgrounds/DesertConstruction';
import { InsidePyramid } from './backgrounds/InsidePyramid';
import { NileRiver } from './backgrounds/NileRiver';
import { WorkersVillage } from './backgrounds/WorkersVillage';
import { SphinxView } from './backgrounds/SphinxView';
import { BattleScene } from './backgrounds/BattleScene';
import { Tenochtitlan } from './backgrounds/Tenochtitlan';
import { AztecMarket } from './backgrounds/AztecMarket';
import { AztecSacrifice } from './backgrounds/AztecSacrifice';
import { Chinampas } from './backgrounds/Chinampas';
import { AztecPlague } from './backgrounds/AztecPlague';

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
const WorkerPreview: React.FC = () => (
  <CharPreview><Worker emotion="happy" talking={true} scale={2} /></CharPreview>
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
const DesertConstructionPreview: React.FC = () => (
  <DesertConstruction boardText="BUILDING A PYRAMID" width={1920} height={1080} />
);
const InsidePyramidPreview: React.FC = () => (
  <InsidePyramid boardText="INSIDE THE TOMB" width={1920} height={1080} />
);
const NileRiverPreview: React.FC = () => (
  <NileRiver boardText="THE GREAT NILE" width={1920} height={1080} />
);
const WorkersVillagePreview: React.FC = () => (
  <WorkersVillage boardText="WORKERS VILLAGE" width={1920} height={1080} />
);
const SphinxViewPreview: React.FC = () => (
  <SphinxView boardText="THE GREAT SPHINX" width={1920} height={1080} />
);
const BattleScenePreview: React.FC = () => (
  <BattleScene boardText="DE SLAG OM TENOCHTITLAN" width={1920} height={1080} />
);
const TenochtitlanPreview: React.FC = () => (
  <Tenochtitlan boardText="TENOCHTITLAN" width={1920} height={1080} />
);
const AztecMarketPreview: React.FC = () => (
  <AztecMarket boardText="DE MARKT VAN TLATELOLCO" width={1920} height={1080} />
);
const AztecSacrificePreview: React.FC = () => (
  <AztecSacrifice boardText="TEMPLO MAYOR CEREMONIE" width={1920} height={1080} />
);
const ChinampasPreview: React.FC = () => (
  <Chinampas boardText="DRIJVENDE TUINEN" width={1920} height={1080} />
);
const AztecPlaguePreview: React.FC = () => (
  <AztecPlague boardText="DE GROTE STERFTE" width={1920} height={1080} />
);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ===== PHASE 0: SCENE COMPOSER PROTOTYPE ===== */}
      <Composition
        id="SceneComposer-Test"
        component={SceneComposerTest}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />

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

      {/* ===== PYRAMIDS OF GIZA (12 min) ===== */}
      <Composition
        id="Pyramids-of-Giza"
        component={PyramidsOfGiza}
        durationInFrames={21600}
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

      <Composition
        id="Worker-Preview"
        component={WorkerPreview}
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

      <Composition
        id="DesertConstruction-Preview"
        component={DesertConstructionPreview}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="InsidePyramid-Preview"
        component={InsidePyramidPreview}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="NileRiver-Preview"
        component={NileRiverPreview}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="WorkersVillage-Preview"
        component={WorkersVillagePreview}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="SphinxView-Preview"
        component={SphinxViewPreview}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* ===== AZTEC BACKGROUND PREVIEWS ===== */}
      <Composition
        id="BattleScene-Preview"
        component={BattleScenePreview}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Tenochtitlan-Preview"
        component={TenochtitlanPreview}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AztecMarket-Preview"
        component={AztecMarketPreview}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AztecSacrifice-Preview"
        component={AztecSacrificePreview}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Chinampas-Preview"
        component={ChinampasPreview}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="AztecPlague-Preview"
        component={AztecPlaguePreview}
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
