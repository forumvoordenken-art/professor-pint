import React from 'react';
import { useCurrentFrame } from 'remotion';
import { sineWave } from '../animations/easing';
import { AztecCrowdLayer, AZTEC_CROWD_CONFIGS } from '../crowds/AztecCrowd';

// =============================================================================
// AztecPlague - The Devastating Smallpox Epidemic (1520)
// =============================================================================
// A dark, somber scene depicting the catastrophic plague that destroyed the
// Aztec Empire. Inspired by Goya's Black Paintings - heavy, oppressive
// atmosphere with muted, desaturated colors. Funeral pyres provide the only
// warm light in an otherwise cold, ash-covered world.
// =============================================================================

// ---- Color Constants (organized by category) ----
const C = {
  // Sky & Atmosphere
  skyTop: '#1A1C1E',
  skyMid: '#2A2D2B',
  skyBottom: '#3A3C38',
  skyHaze: '#3E3F3A',
  cloudDark: '#2E302C',
  cloudMid: '#3A3D38',
  cloudLight: '#4A4D47',
  cloudGreen: '#3B3E35',
  fogNear: 'rgba(58,60,54,0.45)',
  fogFar: 'rgba(42,45,43,0.6)',
  hazeGreen: 'rgba(70,75,60,0.25)',
  ashHaze: 'rgba(90,88,82,0.15)',

  // Ground & Earth
  groundDark: '#2E2A24',
  groundMid: '#3E382E',
  groundLight: '#4E473A',
  groundAsh: '#504A40',
  mud: '#3A3428',
  mudDark: '#2A2620',
  dirt: '#4A4234',
  dirtLight: '#5A5244',
  pathStone: '#4E4840',
  pathDark: '#3E3830',
  dust: '#6A6458',

  // Stone & Architecture
  stoneLight: '#6A6458',
  stoneMid: '#5A5448',
  stoneDark: '#4A4438',
  stoneVeryDark: '#3A3428',
  stoneRed: '#6A4A3A',
  stoneRedDark: '#5A3A2A',
  stoneCarved: '#5E5648',
  mortar: '#4E4A40',
  plaster: '#6E685C',
  plasterDamaged: '#5E584C',

  // Fire & Pyres
  fireCore: '#D4842A',
  fireMid: '#B86A20',
  fireOuter: '#8A4A18',
  fireDim: '#6A3A14',
  ember: '#C47020',
  emberDim: '#8A4A14',
  coalDark: '#2A1A10',
  coalGlow: '#5A3018',
  smokeBlack: '#1A1A18',
  smokeDark: '#2E2C28',
  smokeMid: '#4A4840',
  smokeLight: '#6A6860',

  // Sickness & Death
  skinSick: '#7A7A5A',
  skinSickDark: '#5A5A40',
  skinPale: '#8A886A',
  skinGray: '#6A685A',
  spots: '#5A3A2A',
  spotsDark: '#4A2A1A',
  spotsLight: '#6A4A3A',
  clothWhite: '#7A786E',
  clothDirty: '#6A6858',
  clothDark: '#4A4840',
  wrapLinen: '#6E6A5E',
  wrapDirty: '#5E5A4E',
  wrapDark: '#4E4A3E',

  // Aztec Colors (muted/desaturated)
  aztecRed: '#6A3A2A',
  aztecRedDark: '#4A2A1A',
  aztecBlue: '#3A4A5A',
  aztecBlueDark: '#2A3A4A',
  aztecGold: '#7A6A3A',
  aztecGoldDark: '#5A4A2A',
  aztecGreen: '#3A5A3A',
  aztecGreenDark: '#2A4A2A',
  aztecTurquoise: '#3E5A5A',
  aztecOrange: '#7A5A2A',
  jade: '#4A6A4A',
  jadeDark: '#3A5A3A',

  // Wood & Organic
  wood: '#4A3A28',
  woodDark: '#3A2A18',
  woodLight: '#5A4A38',
  thatch: '#5A5040',
  thatchDark: '#4A4030',
  reed: '#5E5840',
  reedDry: '#6E6850',

  // Herbs & Medicine
  herbGreen: '#4A5A3A',
  herbDark: '#3A4A2A',
  incense: '#8A7A5A',
  incenseSmoke: 'rgba(120,110,90,0.3)',

  // UI Elements
  boardBg: '#3E382E',
  boardFrame: '#2E2820',
  boardStone: '#5A5448',
  boardText: '#9A9488',
  chalk: '#A09A8A',
  glyphColor: '#6A6458',

  // Outline
  outline: '#1A1A18',
  outlineSoft: '#2A2A28',
};

// ---- Interface ----
interface AztecPlagueProps {
  boardText?: string;
  width?: number;
  height?: number;
}

// =============================================================================
// Sub-component: AbandonedBuilding
// =============================================================================
// Aztec-style building with ornate carved stone, now abandoned and decaying.
// Door marked with death symbol. Plaster crumbling, dark interior visible.
// =============================================================================
const AbandonedBuilding: React.FC<{
  x: number;
  y: number;
  scale?: number;
  variant?: number;
  hasDoorMark?: boolean;
  frame: number;
}> = ({ x, y, scale = 1, variant = 0, hasDoorMark = true, frame }) => {
  const windSway = sineWave(frame, 0.06, variant * 2.1) * 1.5;
  const clothFlutter = sineWave(frame, 0.25, variant * 3.7) * 3;
  const bW = 120 + variant * 20;
  const bH = 100 + variant * 15;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Building shadow on ground */}
      <ellipse cx={bW / 2} cy={5} rx={bW * 0.6} ry={8} fill="rgba(0,0,0,0.2)" />

      {/* Main building body */}
      <rect x={0} y={-bH} width={bW} height={bH} fill={C.stoneMid} stroke={C.outline} strokeWidth={1.5} />

      {/* Stone block texture */}
      {Array.from({ length: Math.floor(bH / 18) }, (_, row) => (
        <React.Fragment key={`row-${row}`}>
          <line
            x1={0} y1={-bH + row * 18}
            x2={bW} y2={-bH + row * 18}
            stroke={C.stoneVeryDark} strokeWidth={0.6} opacity={0.4}
          />
          {Array.from({ length: 3 + (row % 2) }, (_, col) => (
            <line
              key={`col-${col}`}
              x1={bW * (col + (row % 2 === 0 ? 0.5 : 0)) / (3 + (row % 2))}
              y1={-bH + row * 18}
              x2={bW * (col + (row % 2 === 0 ? 0.5 : 0)) / (3 + (row % 2))}
              y2={-bH + (row + 1) * 18}
              stroke={C.stoneVeryDark} strokeWidth={0.4} opacity={0.3}
            />
          ))}
        </React.Fragment>
      ))}

      {/* Aztec decorative band at top */}
      <rect x={-3} y={-bH - 12} width={bW + 6} height={14} fill={C.stoneCarved} stroke={C.outline} strokeWidth={1} />
      {/* Step-fret pattern (simplified) */}
      {Array.from({ length: Math.floor(bW / 14) }, (_, i) => (
        <path
          key={`fret-${i}`}
          d={`M${i * 14 + 2},${-bH - 3} l4,-4 l4,0 l0,4 l-4,0 l0,4`}
          fill="none" stroke={C.aztecRedDark} strokeWidth={1} opacity={0.5}
        />
      ))}

      {/* Damaged plaster patches */}
      <path
        d={`M${bW * 0.6},${-bH * 0.7} q8,-5 15,2 q3,8 -5,12 q-10,2 -12,-6 z`}
        fill={C.plasterDamaged} opacity={0.5}
      />
      <path
        d={`M${bW * 0.15},${-bH * 0.3} q5,-8 12,-2 q4,6 -2,10 q-8,3 -12,-4 z`}
        fill={C.plasterDamaged} opacity={0.4}
      />

      {/* Doorway */}
      <rect x={bW * 0.3} y={-bH * 0.7} width={bW * 0.35} height={bH * 0.7}
        fill={C.stoneVeryDark} stroke={C.outline} strokeWidth={1.2} />
      {/* Doorway carved frame */}
      <rect x={bW * 0.28} y={-bH * 0.72} width={bW * 0.39} height={bH * 0.04}
        fill={C.stoneCarved} stroke={C.outline} strokeWidth={0.8} />

      {/* Door mark (death symbol) */}
      {hasDoorMark && (
        <g transform={`translate(${bW * 0.47}, ${-bH * 0.55})`}>
          {/* Skull-like death mark painted in red/brown */}
          <circle cx={0} cy={0} r={8} fill="none" stroke={C.aztecRed} strokeWidth={2} opacity={0.7} />
          <line x1={-3} y1={-2} x2={-1} y2={-2} stroke={C.aztecRed} strokeWidth={1.5} opacity={0.7} />
          <line x1={1} y1={-2} x2={3} y2={-2} stroke={C.aztecRed} strokeWidth={1.5} opacity={0.7} />
          <line x1={-2} y1={3} x2={2} y2={3} stroke={C.aztecRed} strokeWidth={1} opacity={0.7} />
          <line x1={-4} y1={8} x2={4} y2={8} stroke={C.aztecRed} strokeWidth={1.5} opacity={0.6} />
          <line x1={0} y1={5} x2={0} y2={11} stroke={C.aztecRed} strokeWidth={1} opacity={0.6} />
        </g>
      )}

      {/* Tattered cloth hanging from doorway */}
      <path
        d={`M${bW * 0.32},${-bH * 0.68} q${2 + clothFlutter},${bH * 0.15} ${1 + clothFlutter * 0.5},${bH * 0.35}
           q${-1 + clothFlutter * 0.3},${bH * 0.1} ${clothFlutter * 0.5},${bH * 0.2}`}
        fill="none" stroke={C.clothDirty} strokeWidth={3} opacity={0.5}
      />

      {/* Window (dark, empty) */}
      {variant % 2 === 0 && (
        <g>
          <rect x={bW * 0.75} y={-bH * 0.65} width={bW * 0.15} height={bH * 0.15}
            fill={C.stoneVeryDark} stroke={C.outline} strokeWidth={0.8} />
          <line x1={bW * 0.825} y1={-bH * 0.65} x2={bW * 0.825} y2={-bH * 0.5}
            stroke={C.stoneDark} strokeWidth={0.8} />
        </g>
      )}

      {/* Hanging thatch remnant on roof */}
      <path
        d={`M${bW * 0.1},${-bH - 10} q${windSway * 0.5},-8 ${windSway},-2
           M${bW * 0.5},${-bH - 8} q${windSway * 0.3},-6 ${windSway * 0.8},-1
           M${bW * 0.8},${-bH - 10} q${windSway * 0.6},-7 ${windSway * 0.4},-3`}
        fill="none" stroke={C.thatchDark} strokeWidth={2} opacity={0.5}
      />

      {/* Scattered debris at base */}
      <circle cx={-8} cy={-3} r={2.5} fill={C.stoneDark} opacity={0.5} />
      <circle cx={bW + 5} cy={-2} r={3} fill={C.stoneMid} opacity={0.4} />
      <rect x={-12} y={-5} width={6} height={2} fill={C.wood}
        transform={`rotate(${15 + variant * 10}, -9, -4)`} opacity={0.5} />
    </g>
  );
};

// =============================================================================
// Sub-component: FuneralPyre
// =============================================================================
// Burning funeral pyre with animated flames, smoke, and embers. Provides the
// only warm light source in the dark, cold scene.
// =============================================================================
const FuneralPyre: React.FC<{
  x: number;
  y: number;
  scale?: number;
  intensity?: number;
  seed?: number;
  frame: number;
}> = ({ x, y, scale = 1, intensity = 1, seed = 0, frame }) => {
  const flicker1 = sineWave(frame, 0.35, seed);
  const flicker2 = sineWave(frame, 0.55, seed + 1.3);
  const flicker3 = sineWave(frame, 0.42, seed + 2.7);
  const emberFloat = sineWave(frame, 0.12, seed + 0.5);
  const smokeRise = (frame * 0.8 + seed * 50) % 200;
  const fireH = 45 * intensity;
  const fireW = 35 * intensity;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Ground glow */}
      <ellipse cx={0} cy={5} rx={50 * intensity} ry={10}
        fill={C.fireOuter} opacity={0.15 + flicker1 * 0.05} />

      {/* Wood pile base */}
      <line x1={-20} y1={0} x2={20} y2={-3} stroke={C.coalDark} strokeWidth={5} strokeLinecap="round" />
      <line x1={-18} y1={-4} x2={22} y2={-1} stroke={C.coalDark} strokeWidth={4} strokeLinecap="round" />
      <line x1={-15} y1={-7} x2={18} y2={-6} stroke={C.coalGlow} strokeWidth={4} strokeLinecap="round" />
      <line x1={-22} y1={3} x2={24} y2={1} stroke={C.woodDark} strokeWidth={5} strokeLinecap="round" />
      <line x1={-8} y1={-2} x2={-5} y2={5} stroke={C.coalDark} strokeWidth={3} strokeLinecap="round" />
      <line x1={10} y1={-3} x2={12} y2={4} stroke={C.coalDark} strokeWidth={3} strokeLinecap="round" />

      {/* Wrapped form on pyre (suggesting a body) */}
      <path
        d={`M${-14},${-8} q${5},${-6} ${14},${-5} q${10},${1} ${14},${5}
           q${-5},{3} ${-14},{4} q${-10},${0} ${-14},${-4} z`}
        fill={C.wrapDirty} stroke={C.wrapDark} strokeWidth={0.8} opacity={0.6}
      />

      {/* Main fire body - outer flame */}
      <path
        d={`M${-fireW},0
           Q${-fireW * 0.8 + flicker2 * 3},${-fireH * 0.4}
            ${-fireW * 0.3 + flicker1 * 4},${-fireH * 0.7}
           Q${flicker3 * 5},${-fireH - flicker1 * 8}
            ${fireW * 0.3 + flicker2 * 3},${-fireH * 0.65}
           Q${fireW * 0.8 + flicker3 * 4},${-fireH * 0.35}
            ${fireW},0 Z`}
        fill={C.fireOuter} opacity={0.7 + flicker1 * 0.1}
      />

      {/* Mid flame */}
      <path
        d={`M${-fireW * 0.7},${-2}
           Q${-fireW * 0.5 + flicker3 * 2},${-fireH * 0.45}
            ${flicker1 * 3},${-fireH * 0.8 - flicker2 * 6}
           Q${fireW * 0.5 + flicker1 * 2},${-fireH * 0.4}
            ${fireW * 0.7},${-2} Z`}
        fill={C.fireMid} opacity={0.65 + flicker2 * 0.1}
      />

      {/* Core flame (brightest) */}
      <path
        d={`M${-fireW * 0.4},${-4}
           Q${-fireW * 0.2 + flicker2 * 2},${-fireH * 0.5}
            ${flicker3 * 2},${-fireH * 0.65 - flicker1 * 5}
           Q${fireW * 0.3 + flicker3},${-fireH * 0.4}
            ${fireW * 0.4},${-4} Z`}
        fill={C.fireCore} opacity={0.6 + flicker3 * 0.15}
      />

      {/* Embers floating upward */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const ePhase = (frame * 0.6 + i * 33 + seed * 17) % 120;
        const eX = sineWave(frame, 0.18, i * 1.7 + seed) * 15;
        const eY = -10 - ePhase * 0.8;
        const eOp = Math.max(0, 1 - ePhase / 100) * 0.7;
        return (
          <circle
            key={`ember-${i}`}
            cx={eX} cy={eY}
            r={1 + Math.random() * 0.5}
            fill={i % 2 === 0 ? C.ember : C.emberDim}
            opacity={eOp}
          />
        );
      })}

      {/* Glow on surrounding area */}
      <circle cx={0} cy={-fireH * 0.3} r={fireW * 2}
        fill={C.fireOuter} opacity={0.04 + flicker1 * 0.02} />
    </g>
  );
};

// =============================================================================
// Sub-component: SickMat
// =============================================================================
// A sick person lying on a woven mat, covered in smallpox spots. Subtle
// breathing animation. Conveys suffering through posture and detail.
// =============================================================================
const SickMat: React.FC<{
  x: number;
  y: number;
  scale?: number;
  variant?: number;
  frame: number;
}> = ({ x, y, scale = 1, variant = 0, frame }) => {
  const breathe = sineWave(frame, 0.08, variant * 1.4) * 1.2;
  const shiver = sineWave(frame, 0.6, variant * 2.3) * 0.4;
  const flip = variant % 2 === 0 ? 1 : -1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * flip}, ${scale})`}>
      {/* Woven mat */}
      <rect x={-30} y={-2} width={65} height={8} rx={1}
        fill={C.reed} stroke={C.reedDry} strokeWidth={0.5} opacity={0.7} />
      {/* Mat weave pattern */}
      {Array.from({ length: 8 }, (_, i) => (
        <line key={`weave-${i}`}
          x1={-30 + i * 8} y1={-2} x2={-30 + i * 8} y2={6}
          stroke={C.reedDry} strokeWidth={0.4} opacity={0.3} />
      ))}

      {/* Body lying down */}
      <g transform={`translate(0, ${breathe})`}>
        {/* Torso */}
        <ellipse cx={5} cy={-8} rx={12} ry={6 + breathe * 0.3}
          fill={C.skinSick} stroke={C.outlineSoft} strokeWidth={0.8} />

        {/* Blanket/cloth over body */}
        <path
          d={`M${-10},${-12 + breathe * 0.2} q${15},${-4} ${30},${-1}
             q${5},${3 + breathe * 0.2} ${2},${8} l${-34},${2} z`}
          fill={C.clothDirty} stroke={C.clothDark} strokeWidth={0.6} opacity={0.7}
        />

        {/* Head */}
        <g transform={`translate(${-18 + shiver}, ${-10})`}>
          <ellipse cx={0} cy={0} rx={6} ry={5.5}
            fill={C.skinSick} stroke={C.outlineSoft} strokeWidth={0.8} />
          {/* Hair */}
          <path d="M-5,-4 q-2,-3 0,-5 q3,-2 6,-1 q3,1 4,4"
            fill={C.stoneVeryDark} opacity={0.6} />
          {/* Closed eyes (suffering) */}
          <line x1={-3} y1={-1} x2={-1} y2={-0.5}
            stroke={C.outline} strokeWidth={0.7} />
          <line x1={1} y1={-0.5} x2={3} y2={-1}
            stroke={C.outline} strokeWidth={0.7} />
          {/* Open mouth (pain) */}
          <ellipse cx={0} cy={2.5} rx={2} ry={1.2}
            fill={C.stoneVeryDark} opacity={0.5} />

          {/* Smallpox spots on face */}
          <circle cx={-3} cy={1} r={0.8} fill={C.spots} opacity={0.6} />
          <circle cx={2} cy={0} r={0.7} fill={C.spots} opacity={0.5} />
          <circle cx={4} cy={2} r={0.6} fill={C.spotsDark} opacity={0.5} />
          <circle cx={-1} cy={3} r={0.7} fill={C.spots} opacity={0.6} />
          <circle cx={-4} cy={-1} r={0.5} fill={C.spotsLight} opacity={0.4} />
        </g>

        {/* Arm visible outside blanket */}
        <path
          d={`M${-8},${-6} q${-5},${3} ${-10},${8}`}
          fill="none" stroke={C.skinSickDark} strokeWidth={3} strokeLinecap="round"
        />
        {/* Hand */}
        <circle cx={-18} cy={2} r={2.5} fill={C.skinSick} opacity={0.7} />

        {/* Spots on arm */}
        <circle cx={-12} cy={-2} r={0.6} fill={C.spots} opacity={0.5} />
        <circle cx={-14} cy={1} r={0.7} fill={C.spots} opacity={0.5} />
        <circle cx={-10} cy={0} r={0.5} fill={C.spotsDark} opacity={0.4} />
      </g>

      {/* Water bowl nearby */}
      <ellipse cx={30} cy={-2} rx={5} ry={2} fill={C.stoneDark} stroke={C.outline} strokeWidth={0.5} />
      <ellipse cx={30} cy={-3} rx={4} ry={1.5} fill={C.aztecBlueDark} opacity={0.4} />

      {/* Scattered herbs */}
      <line x1={25} y1={-1} x2={27} y2={-4} stroke={C.herbDark} strokeWidth={0.8} opacity={0.4} />
      <line x1={33} y1={0} x2={35} y2={-3} stroke={C.herbGreen} strokeWidth={0.6} opacity={0.3} />
    </g>
  );
};

// =============================================================================
// Sub-component: HealerFigure
// =============================================================================
// A medicine man/healer performing traditional remedies. Burning incense,
// applying herbs. Animated gestures show desperation.
// =============================================================================
const HealerFigure: React.FC<{
  x: number;
  y: number;
  scale?: number;
  variant?: number;
  frame: number;
}> = ({ x, y, scale = 1, variant = 0, frame }) => {
  const armMove = sineWave(frame, 0.12, variant * 1.8) * 8;
  const bodyRock = sineWave(frame, 0.08, variant * 0.9) * 2;
  const headTilt = sineWave(frame, 0.1, variant * 1.2) * 3;
  const incenseWisp = sineWave(frame, 0.3, variant * 2.5);
  const flip = variant % 2 === 0 ? 1 : -1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * flip}, ${scale})`}>
      {/* Shadow */}
      <ellipse cx={0} cy={2} rx={14} ry={4} fill="rgba(0,0,0,0.2)" />

      {/* Kneeling legs */}
      <path d="M-4,0 q-2,-6 -6,-10 q-2,-4 0,-8"
        fill="none" stroke={C.skinSickDark} strokeWidth={3.5} strokeLinecap="round" />
      <path d="M4,0 q-1,-8 2,-14"
        fill="none" stroke={C.skinSick} strokeWidth={3.5} strokeLinecap="round" />

      {/* Torso with robe */}
      <g transform={`translate(0, ${bodyRock})`}>
        <path
          d={`M${-6},${-18} q${-2},${-10} ${0},${-22}
             q${3},${-4} ${8},${-3}
             q${2},${10} ${0},${22} z`}
          fill={C.clothDirty} stroke={C.outlineSoft} strokeWidth={0.8}
        />

        {/* Headdress/medicine man indicator */}
        <g transform={`translate(1, ${-42 + headTilt * 0.3}) rotate(${headTilt})`}>
          {/* Head */}
          <circle cx={0} cy={0} r={6} fill={C.skinSick} stroke={C.outlineSoft} strokeWidth={0.8} />
          {/* Face features */}
          <circle cx={-2} cy={-1} r={0.8} fill={C.outline} opacity={0.7} />
          <circle cx={2} cy={-1} r={0.8} fill={C.outline} opacity={0.7} />
          <path d="M-1.5,2.5 q1.5,1 3,0" fill="none" stroke={C.outline} strokeWidth={0.6} />

          {/* Feather headdress */}
          <path d="M-4,-5 q-3,-8 -1,-14" fill="none" stroke={C.aztecGreenDark} strokeWidth={1.5} opacity={0.7} />
          <path d="M0,-6 q0,-10 2,-15" fill="none" stroke={C.aztecRedDark} strokeWidth={1.5} opacity={0.6} />
          <path d="M3,-5 q3,-9 5,-13" fill="none" stroke={C.aztecGreenDark} strokeWidth={1.2} opacity={0.5} />

          {/* Face paint (healer markings) */}
          <line x1={-5} y1={0} x2={-3} y2={1} stroke={C.aztecRed} strokeWidth={0.8} opacity={0.5} />
          <line x1={3} y1={1} x2={5} y2={0} stroke={C.aztecRed} strokeWidth={0.8} opacity={0.5} />
        </g>

        {/* Arms - one holding incense, one gesturing */}
        {/* Right arm with incense burner */}
        <path
          d={`M${6},${-28} q${8 + armMove * 0.5},${5} ${12 + armMove},${10}`}
          fill="none" stroke={C.skinSick} strokeWidth={3} strokeLinecap="round"
        />
        {/* Incense bowl */}
        <g transform={`translate(${18 + armMove}, ${-18})`}>
          <ellipse cx={0} cy={0} rx={4} ry={2} fill={C.stoneDark} stroke={C.outline} strokeWidth={0.5} />
          {/* Incense smoke wisps */}
          <path
            d={`M0,-2 q${incenseWisp * 2},-6 ${incenseWisp * 3},-12
               q${-incenseWisp},-4 ${incenseWisp * 2},-18`}
            fill="none" stroke={C.incenseSmoke} strokeWidth={2} opacity={0.4}
          />
          <path
            d={`M1,-3 q${-incenseWisp * 1.5},-5 ${-incenseWisp * 2},-10
               q${incenseWisp * 0.8},-6 ${-incenseWisp},-14`}
            fill="none" stroke={C.incenseSmoke} strokeWidth={1.5} opacity={0.3}
          />
          {/* Glowing ember in bowl */}
          <circle cx={0} cy={-1} r={1.5} fill={C.emberDim} opacity={0.6 + incenseWisp * 0.1} />
        </g>

        {/* Left arm with herb bundle */}
        <path
          d={`M${-6},${-28} q${-6 - armMove * 0.3},${4} ${-10 - armMove * 0.5},${12}`}
          fill="none" stroke={C.skinSickDark} strokeWidth={3} strokeLinecap="round"
        />
        {/* Herb bundle */}
        <g transform={`translate(${-16 - armMove * 0.5}, ${-16})`}>
          <line x1={0} y1={0} x2={-3} y2={-6} stroke={C.herbDark} strokeWidth={1.5} />
          <line x1={0} y1={0} x2={1} y2={-7} stroke={C.herbGreen} strokeWidth={1.2} />
          <line x1={0} y1={0} x2={3} y2={-5} stroke={C.herbDark} strokeWidth={1} />
          <circle cx={-3} cy={-7} r={1.5} fill={C.herbGreen} opacity={0.5} />
          <circle cx={1} cy={-8} r={1.2} fill={C.herbDark} opacity={0.4} />
        </g>
      </g>

      {/* Pouches and tools on ground */}
      <rect x={10} y={-3} width={6} height={4} rx={1}
        fill={C.clothDirty} stroke={C.outlineSoft} strokeWidth={0.4} opacity={0.5} />
      <circle cx={-10} cy={-1} r={2} fill={C.stoneDark} opacity={0.4} />
    </g>
  );
};

// =============================================================================
// Sub-component: MarkedDoor
// =============================================================================
// A standalone doorway/entrance with Aztec death markers painted on it.
// Used to mark houses of the dead/infected.
// =============================================================================
const MarkedDoor: React.FC<{
  x: number;
  y: number;
  scale?: number;
  variant?: number;
  frame: number;
}> = ({ x, y, scale = 1, variant = 0, frame }) => {
  const clothSway = sineWave(frame, 0.15, variant * 3.1) * 2;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Door frame - stone */}
      <rect x={-18} y={-60} width={36} height={60}
        fill={C.stoneMid} stroke={C.outline} strokeWidth={1.2} />

      {/* Door opening (dark interior) */}
      <rect x={-14} y={-55} width={28} height={55}
        fill={C.stoneVeryDark} />

      {/* Carved lintel */}
      <rect x={-20} y={-63} width={40} height={6}
        fill={C.stoneCarved} stroke={C.outline} strokeWidth={0.8} />
      {/* Serpent motif on lintel */}
      <path d="M-15,-61 q5,-2 10,0 q5,2 10,0 q5,-2 10,0"
        fill="none" stroke={C.aztecRedDark} strokeWidth={1} opacity={0.5} />

      {/* Death marker - red X */}
      <line x1={-8} y1={-45} x2={8} y2={-25}
        stroke={C.aztecRed} strokeWidth={3} strokeLinecap="round" opacity={0.7} />
      <line x1={8} y1={-45} x2={-8} y2={-25}
        stroke={C.aztecRed} strokeWidth={3} strokeLinecap="round" opacity={0.7} />

      {/* Mictlantecuhtli symbol (death god - simplified skull) */}
      <g transform="translate(0, -15)" opacity={0.6}>
        <circle cx={0} cy={0} r={5} fill="none" stroke={C.aztecRed} strokeWidth={1.5} />
        <circle cx={-2} cy={-1} r={1} fill={C.aztecRed} />
        <circle cx={2} cy={-1} r={1} fill={C.aztecRed} />
        <line x1={-2} y1={3} x2={2} y2={3} stroke={C.aztecRed} strokeWidth={0.8} />
        {/* Teeth marks */}
        <line x1={-1} y1={2.5} x2={-1} y2={3.5} stroke={C.aztecRed} strokeWidth={0.4} />
        <line x1={0} y1={2.5} x2={0} y2={3.5} stroke={C.aztecRed} strokeWidth={0.4} />
        <line x1={1} y1={2.5} x2={1} y2={3.5} stroke={C.aztecRed} strokeWidth={0.4} />
      </g>

      {/* Torn cloth draped over doorway */}
      <path
        d={`M-14,-53 q${clothSway},-3 ${2 + clothSway * 0.5},-20
           q${1 + clothSway * 0.3},-8 ${3 + clothSway * 0.2},-25`}
        fill="none" stroke={C.clothDirty} strokeWidth={2.5} opacity={0.4}
      />
      <path
        d={`M14,-55 q${-clothSway * 0.8},${-5} ${-1 - clothSway * 0.4},-15`}
        fill="none" stroke={C.clothDark} strokeWidth={2} opacity={0.35}
      />

      {/* Dried flowers/offerings at base (withered) */}
      <circle cx={-8} cy={-2} r={1.5} fill={C.aztecRedDark} opacity={0.3} />
      <circle cx={-5} cy={-1} r={1} fill={C.herbDark} opacity={0.3} />
      <line x1={-7} y1={-1} x2={-9} y2={-5} stroke={C.reedDry} strokeWidth={0.6} opacity={0.3} />
      <line x1={-4} y1={0} x2={-3} y2={-4} stroke={C.reedDry} strokeWidth={0.5} opacity={0.25} />
    </g>
  );
};

// =============================================================================
// Sub-component: EmptyMarketStall
// =============================================================================
// Abandoned market stall with scattered goods, overturned pottery,
// collapsed canopy. Signs of sudden abandonment.
// =============================================================================
const EmptyMarketStall: React.FC<{
  x: number;
  y: number;
  scale?: number;
  variant?: number;
  frame: number;
}> = ({ x, y, scale = 1, variant = 0, frame }) => {
  const canopyFlap = sineWave(frame, 0.18, variant * 2.4) * 3;
  const windRattle = sineWave(frame, 0.4, variant * 1.6) * 1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Ground shadow */}
      <ellipse cx={20} cy={3} rx={30} ry={5} fill="rgba(0,0,0,0.15)" />

      {/* Stall posts (one broken/leaning) */}
      <line x1={-15} y1={0} x2={-15} y2={-55}
        stroke={C.wood} strokeWidth={4} strokeLinecap="round" />
      <line x1={40} y1={0} x2={38} y2={-50}
        stroke={C.wood} strokeWidth={4} strokeLinecap="round" />
      {/* Broken crossbar */}
      <line x1={-15} y1={-50} x2={25} y2={-48}
        stroke={C.woodDark} strokeWidth={3} strokeLinecap="round" />

      {/* Torn canopy (flapping) */}
      <path
        d={`M${-18},${-52} q${10 + canopyFlap},${-5 + canopyFlap * 0.5} ${25},${-3}
           q${10 + canopyFlap * 0.3},${2} ${15},${5 + canopyFlap}`}
        fill={C.clothDirty} stroke={C.clothDark} strokeWidth={0.8} opacity={0.5}
      />
      {/* Canopy tattered edge */}
      <path
        d={`M${22 + canopyFlap * 0.5},${-50 + canopyFlap}
           q${3},${4} ${2},${10} q${-2},${3} ${-1},${6}`}
        fill="none" stroke={C.clothDark} strokeWidth={1.5} opacity={0.4}
      />

      {/* Counter/table surface (tilted/broken) */}
      <rect x={-12} y={-20} width={50} height={4} rx={1}
        fill={C.woodLight} stroke={C.woodDark} strokeWidth={0.8}
        transform={`rotate(${3 + variant}, 13, -18)`} />

      {/* Overturned pottery */}
      <g transform={`translate(${-8}, ${-3}) rotate(${75 + variant * 15})`}>
        <ellipse cx={0} cy={0} rx={6} ry={4}
          fill={C.stoneRed} stroke={C.stoneRedDark} strokeWidth={0.8} opacity={0.7} />
        <ellipse cx={0} cy={-1} rx={4} ry={2.5}
          fill={C.stoneRedDark} opacity={0.5} />
      </g>
      {/* Another pot, broken */}
      <path d={`M${20},${-2} q${3},${-5} ${1},${-10} q${3},${0} ${6},${0}
               q${-1},${5} ${1},${10} z`}
        fill={C.stoneRed} stroke={C.stoneRedDark} strokeWidth={0.6} opacity={0.6} />
      {/* Pottery shard */}
      <path d={`M${28},${0} l${3},${-4} l${3},${2} z`}
        fill={C.stoneRedDark} opacity={0.4} />

      {/* Scattered goods */}
      {/* Fallen corn/maize */}
      <ellipse cx={35} cy={-1} rx={3} ry={1.5}
        fill={C.aztecGold} stroke={C.aztecGoldDark} strokeWidth={0.4} opacity={0.4}
        transform="rotate(30, 35, -1)" />
      <ellipse cx={38} cy={1} rx={2.5} ry={1.2}
        fill={C.aztecGold} opacity={0.35}
        transform="rotate(-20, 38, 1)" />

      {/* Dropped cloth/textile */}
      <path d={`M${5},${-1} q${3 + windRattle},${-2} ${8},${-1} q${2},${2} ${0},${3} q${-5},${1} ${-9},${0} z`}
        fill={C.aztecRedDark} opacity={0.35} />

      {/* Abandoned tool */}
      <line x1={42} y1={2} x2={48} y2={-15}
        stroke={C.woodDark} strokeWidth={2} strokeLinecap="round" opacity={0.4} />
    </g>
  );
};

// =============================================================================
// Sub-component: WrappedBody
// =============================================================================
// A wrapped body in traditional burial cloth/petate mat. Somber detail showing
// the scale of death. Subtle cloth movement from wind.
// =============================================================================
const WrappedBody: React.FC<{
  x: number;
  y: number;
  scale?: number;
  variant?: number;
  frame: number;
}> = ({ x, y, scale = 1, variant = 0, frame }) => {
  const clothRipple = sineWave(frame, 0.1, variant * 2.2) * 0.5;
  const angle = variant % 3 === 0 ? -5 : variant % 3 === 1 ? 8 : 0;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale}) rotate(${angle})`}>
      {/* Shadow beneath */}
      <ellipse cx={0} cy={3} rx={22} ry={4} fill="rgba(0,0,0,0.15)" />

      {/* Petate mat underneath */}
      <rect x={-24} y={-1} width={48} height={5} rx={1}
        fill={C.reedDry} stroke={C.reed} strokeWidth={0.4} opacity={0.5} />

      {/* Wrapped body form */}
      <path
        d={`M${-20},${-2 + clothRipple}
           q${2},${-8} ${8},${-10}
           q${8},${-3} ${16},${-2 + clothRipple * 0.5}
           q${6},${1} ${12},${4}
           q${2},${4} ${0},${8}
           q${-6},${2} ${-16},${2}
           q${-12},${0} ${-18},${-2} z`}
        fill={C.wrapLinen} stroke={C.wrapDark} strokeWidth={0.8}
      />

      {/* Wrap binding lines */}
      <line x1={-10} y1={-10 + clothRipple} x2={-10} y2={3}
        stroke={C.wrapDark} strokeWidth={0.8} opacity={0.4} />
      <line x1={0} y1={-12 + clothRipple * 0.5} x2={0} y2={4}
        stroke={C.wrapDark} strokeWidth={0.8} opacity={0.4} />
      <line x1={10} y1={-10 + clothRipple * 0.3} x2={10} y2={2}
        stroke={C.wrapDark} strokeWidth={0.8} opacity={0.4} />

      {/* Head area slightly visible through wrap */}
      <ellipse cx={-15} cy={-5} rx={6} ry={5}
        fill={C.wrapDirty} stroke={C.wrapDark} strokeWidth={0.5} opacity={0.7} />

      {/* Flowers/offering placed on body */}
      {variant % 2 === 0 && (
        <g transform="translate(2, -12)">
          <circle cx={0} cy={0} r={2} fill={C.aztecRedDark} opacity={0.3} />
          <circle cx={3} cy={1} r={1.5} fill={C.aztecRedDark} opacity={0.25} />
          <line x1={1} y1={0} x2={0} y2={4} stroke={C.herbDark} strokeWidth={0.5} opacity={0.3} />
        </g>
      )}
    </g>
  );
};

// =============================================================================
// Sub-component: SmokePlume
// =============================================================================
// Rising smoke column from funeral pyres. Animated billowing clouds that
// rise and dissipate. Creates the oppressive atmospheric haze.
// =============================================================================
const SmokePlume: React.FC<{
  x: number;
  y: number;
  scale?: number;
  seed?: number;
  darkness?: number;
  frame: number;
}> = ({ x, y, scale = 1, seed = 0, darkness = 0.5, frame }) => {
  const drift = sineWave(frame, 0.04, seed) * 20;
  const drift2 = sineWave(frame, 0.06, seed + 1.5) * 15;
  const expand = sineWave(frame, 0.03, seed + 3.0);
  const billow1 = sineWave(frame, 0.08, seed + 0.7);
  const billow2 = sineWave(frame, 0.11, seed + 2.1);
  const billow3 = sineWave(frame, 0.07, seed + 4.3);

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Base smoke - dense, dark */}
      <ellipse
        cx={drift * 0.2} cy={-20}
        rx={18 + expand * 3} ry={12 + billow1 * 2}
        fill={C.smokeBlack} opacity={darkness * 0.6}
      />
      <ellipse
        cx={drift * 0.4 + 5} cy={-45}
        rx={22 + expand * 4 + billow2 * 3} ry={15 + billow1 * 3}
        fill={C.smokeDark} opacity={darkness * 0.5}
      />

      {/* Mid-level smoke */}
      <ellipse
        cx={drift * 0.6 + 3} cy={-75}
        rx={28 + expand * 5 + billow3 * 4} ry={18 + billow2 * 3}
        fill={C.smokeMid} opacity={darkness * 0.35}
      />
      <ellipse
        cx={drift * 0.8 - 5} cy={-100}
        rx={32 + expand * 6} ry={20 + billow3 * 4}
        fill={C.smokeMid} opacity={darkness * 0.3}
      />

      {/* High-level smoke - spreading and thinning */}
      <ellipse
        cx={drift + drift2 * 0.5} cy={-135}
        rx={40 + expand * 8 + billow1 * 5} ry={22 + billow2 * 5}
        fill={C.smokeLight} opacity={darkness * 0.2}
      />
      <ellipse
        cx={drift * 1.2 + drift2} cy={-170}
        rx={50 + expand * 10} ry={25 + billow3 * 6}
        fill={C.smokeLight} opacity={darkness * 0.12}
      />

      {/* Highest wisps */}
      <ellipse
        cx={drift * 1.5 + drift2 * 0.8} cy={-210}
        rx={60 + expand * 12} ry={28}
        fill={C.ashHaze} opacity={darkness * 0.08}
      />
    </g>
  );
};

// =============================================================================
// Helper: DistantTemple
// =============================================================================
// Silhouette of an Aztec pyramid temple visible through haze in the distance.
// =============================================================================
const DistantTemple: React.FC<{
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
}> = ({ x, y, scale = 1, opacity = 0.3 }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={opacity}>
      {/* Stepped pyramid silhouette */}
      <path
        d={`M${-60},0 L${-55},${-15} L${-40},${-15} L${-38},${-30}
           L${-25},${-30} L${-22},${-45} L${-10},${-45} L${-8},${-60}
           L${8},${-60} L${10},${-45} L${22},${-45} L${25},${-30}
           L${38},${-30} L${40},${-15} L${55},${-15} L${60},0 Z`}
        fill={C.stoneVeryDark}
      />
      {/* Temple structure on top */}
      <rect x={-6} y={-72} width={12} height={12} fill={C.stoneVeryDark} />
      <path d="M-8,-72 L0,-80 L8,-72 Z" fill={C.stoneVeryDark} />
    </g>
  );
};

// =============================================================================
// Helper: ScatteredDebris
// =============================================================================
// Random debris, pottery, tools scattered on the ground.
// =============================================================================
const ScatteredDebris: React.FC<{
  x: number;
  y: number;
  variant?: number;
}> = ({ x, y, variant = 0 }) => {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Broken pottery */}
      {variant % 3 === 0 && (
        <>
          <path d={`M0,0 l4,-6 l3,2 l-2,5 z`}
            fill={C.stoneRed} opacity={0.4} />
          <path d={`M6,-1 l3,-4 l2,3 z`}
            fill={C.stoneRedDark} opacity={0.35} />
        </>
      )}
      {/* Stone tools */}
      {variant % 3 === 1 && (
        <>
          <line x1={0} y1={0} x2={8} y2={-3}
            stroke={C.woodDark} strokeWidth={2} strokeLinecap="round" opacity={0.4} />
          <path d="M8,-3 l3,-2 l1,3 l-2,1 z"
            fill={C.stoneDark} opacity={0.5} />
        </>
      )}
      {/* Cloth scraps */}
      {variant % 3 === 2 && (
        <path d={`M0,0 q3,-2 6,-1 q2,2 1,4 q-4,1 -7,0 z`}
          fill={C.clothDirty} opacity={0.3} />
      )}
      {/* Scattered corn kernels */}
      <circle cx={10} cy={1} r={1} fill={C.aztecGold} opacity={0.2} />
      <circle cx={13} cy={-1} r={0.8} fill={C.aztecGoldDark} opacity={0.2} />
    </g>
  );
};

// =============================================================================
// Helper: AshParticles
// =============================================================================
// Floating ash and embers in the air, adding to the oppressive atmosphere.
// =============================================================================
const AshParticles: React.FC<{
  width: number;
  height: number;
  frame: number;
}> = ({ width, height, frame }) => {
  const particles = Array.from({ length: 35 }, (_, i) => {
    const seed = i * 7.3;
    const baseX = ((seed * 137.5) % width);
    const baseY = ((seed * 89.3) % (height * 0.8));
    const driftX = sineWave(frame, 0.03 + i * 0.002, seed) * 30;
    const driftY = -((frame * 0.3 + seed * 20) % (height * 0.5));
    const size = 0.5 + (i % 5) * 0.3;
    const opacity = 0.08 + (i % 4) * 0.03;
    return { x: baseX + driftX, y: baseY + driftY, size, opacity, i };
  });

  return (
    <g>
      {particles.map(({ x, y, size, opacity, i }) => (
        <circle
          key={`ash-${i}`}
          cx={x} cy={y + height * 0.2}
          r={size}
          fill={i % 3 === 0 ? C.ashHaze : i % 3 === 1 ? C.smokeMid : C.dust}
          opacity={opacity}
        />
      ))}
    </g>
  );
};

// =============================================================================
// Helper: GriefFigure
// =============================================================================
// Small silhouette figure in a grief pose - kneeling, head bowed, arms
// clasped. Used in midground/background for emotional weight.
// =============================================================================
const GriefFigure: React.FC<{
  x: number;
  y: number;
  scale?: number;
  variant?: number;
  frame: number;
}> = ({ x, y, scale = 1, variant = 0, frame }) => {
  const rockMotion = sineWave(frame, 0.06, variant * 1.9) * 2;
  const flip = variant % 2 === 0 ? 1 : -1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * flip}, ${scale})`}>
      {/* Shadow */}
      <ellipse cx={0} cy={2} rx={8} ry={3} fill="rgba(0,0,0,0.15)" />

      {/* Kneeling body */}
      <g transform={`translate(${rockMotion * 0.5}, 0)`}>
        {/* Legs (kneeling) */}
        <path d="M-3,0 q-1,-5 -3,-10"
          fill="none" stroke={C.skinGray} strokeWidth={2.5} strokeLinecap="round" />
        <path d="M3,0 q1,-6 0,-12"
          fill="none" stroke={C.skinGray} strokeWidth={2.5} strokeLinecap="round" />

        {/* Torso bent forward */}
        <path d={`M0,-12 q${-2 + rockMotion * 0.3},-8 ${-4 + rockMotion},-16`}
          fill="none" stroke={C.clothDirty} strokeWidth={4} strokeLinecap="round" />

        {/* Head bowed down */}
        <circle cx={-4 + rockMotion} cy={-30} r={4}
          fill={C.skinGray} stroke={C.outlineSoft} strokeWidth={0.6} />

        {/* Arms clasped to face/head */}
        <path d={`M${-2},${-20} q${-3 + rockMotion * 0.2},${-4} ${-5 + rockMotion * 0.3},${-8}`}
          fill="none" stroke={C.skinSickDark} strokeWidth={2} strokeLinecap="round" />
        <path d={`M${2},${-20} q${-4 + rockMotion * 0.2},${-5} ${-3 + rockMotion * 0.3},${-9}`}
          fill="none" stroke={C.skinSick} strokeWidth={2} strokeLinecap="round" />

        {/* Cloth draped */}
        <path
          d={`M${-5},${-25} q${3},${8} ${8},${14} q${-5},${3} ${-10},${2}`}
          fill={C.clothDark} opacity={0.4} />
      </g>
    </g>
  );
};

// =============================================================================
// Helper: CrumblingWall
// =============================================================================
// Partially collapsed Aztec wall with carved details still visible.
// =============================================================================
const CrumblingWall: React.FC<{
  x: number;
  y: number;
  wallWidth?: number;
  wallHeight?: number;
  collapseRight?: boolean;
}> = ({ x, y, wallWidth = 80, wallHeight = 50, collapseRight = false }) => {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Main wall section */}
      <rect x={0} y={-wallHeight} width={wallWidth * 0.6} height={wallHeight}
        fill={C.stoneMid} stroke={C.outline} strokeWidth={1} />

      {/* Collapsed/broken edge */}
      <path
        d={`M${wallWidth * 0.6},${-wallHeight}
           l${collapseRight ? 5 : -2},${wallHeight * 0.2}
           l${collapseRight ? 8 : 3},${wallHeight * 0.15}
           l${collapseRight ? -3 : 5},${wallHeight * 0.25}
           l${collapseRight ? 10 : -4},${wallHeight * 0.4}
           L${wallWidth * 0.6},0 Z`}
        fill={C.stoneDark} stroke={C.outline} strokeWidth={0.8}
      />

      {/* Stone block lines */}
      {Array.from({ length: Math.floor(wallHeight / 12) }, (_, i) => (
        <line
          key={`wl-${i}`}
          x1={0} y1={-wallHeight + i * 12}
          x2={wallWidth * 0.6} y2={-wallHeight + i * 12}
          stroke={C.stoneVeryDark} strokeWidth={0.5} opacity={0.3}
        />
      ))}

      {/* Carved Aztec motif (partially visible) */}
      <g transform={`translate(${wallWidth * 0.15}, ${-wallHeight * 0.5})`} opacity={0.3}>
        <circle cx={0} cy={0} r={8} fill="none" stroke={C.stoneCarved} strokeWidth={1.5} />
        <path d="M-5,-5 L5,5 M-5,5 L5,-5" stroke={C.stoneCarved} strokeWidth={1} />
        <circle cx={0} cy={0} r={3} fill="none" stroke={C.stoneCarved} strokeWidth={0.8} />
      </g>

      {/* Rubble at base */}
      <circle cx={wallWidth * 0.65} cy={-3} r={4} fill={C.stoneDark} opacity={0.5} />
      <circle cx={wallWidth * 0.7} cy={-1} r={3} fill={C.stoneMid} opacity={0.4} />
      <circle cx={wallWidth * 0.58} cy={-1} r={2.5} fill={C.stoneDark} opacity={0.45} />
      <rect x={wallWidth * 0.62} y={-6} width={5} height={3} fill={C.stoneMid}
        transform={`rotate(25, ${wallWidth * 0.64}, -4.5)`} opacity={0.4} />
    </g>
  );
};

// =============================================================================
// Helper: CopalBurner
// =============================================================================
// Aztec copal incense burner (ritual purification). Stone bowl with smoking
// resin, carved decorations.
// =============================================================================
const CopalBurner: React.FC<{
  x: number;
  y: number;
  scale?: number;
  seed?: number;
  frame: number;
}> = ({ x, y, scale = 1, seed = 0, frame }) => {
  const smokeWisp = sineWave(frame, 0.2, seed);
  const glowPulse = sineWave(frame, 0.15, seed + 1.2);

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Burner base (tripod) */}
      <line x1={-6} y1={0} x2={-3} y2={-8} stroke={C.stoneDark} strokeWidth={1.5} />
      <line x1={6} y1={0} x2={3} y2={-8} stroke={C.stoneDark} strokeWidth={1.5} />
      <line x1={0} y1={2} x2={0} y2={-8} stroke={C.stoneDark} strokeWidth={1.5} />

      {/* Bowl */}
      <ellipse cx={0} cy={-10} rx={8} ry={3}
        fill={C.stoneDark} stroke={C.outline} strokeWidth={0.6} />
      <ellipse cx={0} cy={-11} rx={6} ry={2}
        fill={C.coalDark} />

      {/* Glowing copal resin */}
      <ellipse cx={0} cy={-11} rx={4} ry={1.5}
        fill={C.emberDim} opacity={0.4 + glowPulse * 0.15} />

      {/* Smoke from copal */}
      <path
        d={`M0,-13 q${smokeWisp * 3},-8 ${smokeWisp * 4},-18
           q${-smokeWisp * 2},-6 ${smokeWisp * 5},-28`}
        fill="none" stroke={C.incenseSmoke} strokeWidth={2.5} opacity={0.3}
      />
      <path
        d={`M1,-14 q${-smokeWisp * 2},-6 ${-smokeWisp * 3},-14
           q${smokeWisp},-8 ${-smokeWisp * 2},-22`}
        fill="none" stroke={C.incenseSmoke} strokeWidth={1.8} opacity={0.2}
      />

      {/* Carved decoration on bowl */}
      <path d="M-7,-10 q0,-1 1,-1 q1,0 1,1"
        fill="none" stroke={C.stoneCarved} strokeWidth={0.5} opacity={0.4} />
      <path d="M5,-10 q0,-1 1,-1 q1,0 1,1"
        fill="none" stroke={C.stoneCarved} strokeWidth={0.5} opacity={0.4} />
    </g>
  );
};

// =============================================================================
// Main Component: AztecPlague
// =============================================================================
export const AztecPlague: React.FC<AztecPlagueProps> = ({
  boardText = '',
  width = 1920,
  height = 1080,
}) => {
  const frame = useCurrentFrame();

  // ---- Animation values ----
  const windSlow = sineWave(frame, 0.03);
  const windMed = sineWave(frame, 0.07, 1.2);
  const cloudDrift1 = sineWave(frame, 0.015, 0);
  const cloudDrift2 = sineWave(frame, 0.02, 2.5);
  const cloudDrift3 = sineWave(frame, 0.018, 5.0);
  const hazeFlicker = sineWave(frame, 0.04, 0.8);
  const vignetteBreath = sineWave(frame, 0.025, 3.3);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      <defs>
        {/* Sky gradient - dark, overcast, greenish-gray */}
        <linearGradient id="aztec-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.skyTop} />
          <stop offset="40%" stopColor={C.skyMid} />
          <stop offset="75%" stopColor={C.skyBottom} />
          <stop offset="100%" stopColor={C.skyHaze} />
        </linearGradient>

        {/* Ground gradient */}
        <linearGradient id="aztec-ground" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.groundMid} />
          <stop offset="30%" stopColor={C.groundDark} />
          <stop offset="100%" stopColor={C.mudDark} />
        </linearGradient>

        {/* Fire glow radial gradient */}
        <radialGradient id="pyre-glow-1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={C.fireOuter} stopOpacity="0.12" />
          <stop offset="60%" stopColor={C.fireDim} stopOpacity="0.05" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="pyre-glow-2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={C.fireOuter} stopOpacity="0.08" />
          <stop offset="70%" stopColor={C.fireDim} stopOpacity="0.03" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>

        {/* Vignette gradient */}
        <radialGradient id="vignette" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="transparent" stopOpacity="0" />
          <stop offset="70%" stopColor={C.skyTop} stopOpacity="0.3" />
          <stop offset="100%" stopColor={C.skyTop} stopOpacity="0.7" />
        </radialGradient>

        {/* Fog/haze gradient */}
        <linearGradient id="ground-fog" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.fogNear} />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>

        {/* Sickly green atmospheric filter */}
        <linearGradient id="sick-atmosphere" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={C.hazeGreen} />
          <stop offset="50%" stopColor="rgba(60,65,50,0.15)" />
          <stop offset="100%" stopColor={C.hazeGreen} />
        </linearGradient>

        {/* Stone texture pattern */}
        <pattern id="stone-texture" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill={C.stoneMid} />
          <circle cx="5" cy="5" r="0.5" fill={C.stoneVeryDark} opacity="0.2" />
          <circle cx="15" cy="12" r="0.4" fill={C.stoneVeryDark} opacity="0.15" />
          <circle cx="8" cy="18" r="0.3" fill={C.stoneDark} opacity="0.1" />
        </pattern>

        {/* Smoke blur filter */}
        <filter id="smoke-blur">
          <feGaussianBlur stdDeviation="3" />
        </filter>

        {/* Distant haze filter */}
        <filter id="distant-haze">
          <feGaussianBlur stdDeviation="2" />
        </filter>

        {/* Fire glow filter */}
        <filter id="fire-glow">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* ================================================================== */}
      {/* LAYER 1: SKY                                                       */}
      {/* ================================================================== */}

      {/* Base sky - dark, ominous */}
      <rect x={0} y={0} width={width} height={height * 0.55} fill="url(#aztec-sky)" />

      {/* Cloud layer 1 - heavy, oppressive dark clouds */}
      <ellipse
        cx={width * 0.2 + cloudDrift1 * 15} cy={height * 0.08}
        rx={280} ry={50}
        fill={C.cloudDark} opacity={0.7}
      />
      <ellipse
        cx={width * 0.35 + cloudDrift1 * 10} cy={height * 0.12}
        rx={200} ry={40}
        fill={C.cloudMid} opacity={0.5}
      />
      <ellipse
        cx={width * 0.6 + cloudDrift2 * 12} cy={height * 0.06}
        rx={320} ry={55}
        fill={C.cloudDark} opacity={0.65}
      />
      <ellipse
        cx={width * 0.8 + cloudDrift2 * 8} cy={height * 0.1}
        rx={250} ry={45}
        fill={C.cloudGreen} opacity={0.55}
      />
      <ellipse
        cx={width * 0.45 + cloudDrift3 * 10} cy={height * 0.16}
        rx={350} ry={60}
        fill={C.cloudMid} opacity={0.6}
      />

      {/* Cloud layer 2 - lower, thicker */}
      <ellipse
        cx={width * 0.15 + cloudDrift2 * 8} cy={height * 0.22}
        rx={220} ry={35}
        fill={C.cloudGreen} opacity={0.4}
      />
      <ellipse
        cx={width * 0.5 + cloudDrift1 * 6} cy={height * 0.2}
        rx={300} ry={45}
        fill={C.cloudDark} opacity={0.5}
      />
      <ellipse
        cx={width * 0.75 + cloudDrift3 * 10} cy={height * 0.18}
        rx={260} ry={40}
        fill={C.cloudMid} opacity={0.45}
      />
      <ellipse
        cx={width * 0.9 + cloudDrift1 * 5} cy={height * 0.25}
        rx={200} ry={50}
        fill={C.cloudDark} opacity={0.55}
      />

      {/* Greenish sickly tint across sky */}
      <rect x={0} y={0} width={width} height={height * 0.55}
        fill="url(#sick-atmosphere)" />

      {/* ================================================================== */}
      {/* LAYER 2: DISTANT BACKGROUND                                        */}
      {/* ================================================================== */}

      {/* Distant haze layer */}
      <rect x={0} y={height * 0.28} width={width} height={height * 0.2}
        fill={C.fogFar} />

      {/* Distant temple silhouettes (barely visible through haze) */}
      <g filter="url(#distant-haze)">
        <DistantTemple x={width * 0.12} y={height * 0.38} scale={0.8} opacity={0.15} />
        <DistantTemple x={width * 0.35} y={height * 0.36} scale={1.2} opacity={0.2} />
        <DistantTemple x={width * 0.7} y={height * 0.37} scale={1.0} opacity={0.18} />
        <DistantTemple x={width * 0.88} y={height * 0.39} scale={0.7} opacity={0.12} />
      </g>

      {/* Distant fires (tiny orange glows through haze) */}
      <g filter="url(#fire-glow)">
        <circle cx={width * 0.25} cy={height * 0.35}
          r={8} fill={C.fireOuter} opacity={0.15 + hazeFlicker * 0.05} />
        <circle cx={width * 0.55} cy={height * 0.33}
          r={10} fill={C.fireMid} opacity={0.12 + hazeFlicker * 0.04} />
        <circle cx={width * 0.78} cy={height * 0.36}
          r={7} fill={C.fireOuter} opacity={0.1 + hazeFlicker * 0.03} />
      </g>

      {/* Distant smoke columns rising from burning city */}
      <g filter="url(#smoke-blur)" opacity={0.3}>
        <SmokePlume x={width * 0.25} y={height * 0.35} scale={0.6} seed={0} darkness={0.25} frame={frame} />
        <SmokePlume x={width * 0.55} y={height * 0.33} scale={0.7} seed={3.5} darkness={0.3} frame={frame} />
        <SmokePlume x={width * 0.78} y={height * 0.36} scale={0.5} seed={7.1} darkness={0.2} frame={frame} />
      </g>

      {/* ================================================================== */}
      {/* LAYER 3: MIDGROUND - VILLAGE/CITY STREETS                          */}
      {/* ================================================================== */}

      {/* Ground plane */}
      <rect x={0} y={height * 0.45} width={width} height={height * 0.55}
        fill="url(#aztec-ground)" />

      {/* Stone path/road surface */}
      <path
        d={`M0,${height * 0.55} Q${width * 0.25},${height * 0.52} ${width * 0.5},${height * 0.54}
           Q${width * 0.75},${height * 0.56} ${width},${height * 0.53}
           L${width},${height * 0.62} Q${width * 0.75},${height * 0.64} ${width * 0.5},${height * 0.62}
           Q${width * 0.25},${height * 0.6} 0,${height * 0.63} Z`}
        fill={C.pathStone} opacity={0.4}
      />
      {/* Path stone texture lines */}
      {Array.from({ length: 15 }, (_, i) => (
        <line
          key={`path-${i}`}
          x1={width * (i / 15)} y1={height * (0.54 + Math.sin(i * 0.8) * 0.02)}
          x2={width * (i / 15)} y2={height * (0.62 + Math.sin(i * 0.8) * 0.02)}
          stroke={C.pathDark} strokeWidth={0.5} opacity={0.2}
        />
      ))}

      {/* Abandoned buildings - left side */}
      <AbandonedBuilding x={width * 0.02} y={height * 0.52} scale={1.1} variant={0} hasDoorMark={true} frame={frame} />
      <AbandonedBuilding x={width * 0.12} y={height * 0.50} scale={1.3} variant={1} hasDoorMark={true} frame={frame} />
      <AbandonedBuilding x={width * 0.25} y={height * 0.51} scale={1.0} variant={2} hasDoorMark={false} frame={frame} />

      {/* Abandoned buildings - right side */}
      <AbandonedBuilding x={width * 0.68} y={height * 0.50} scale={1.2} variant={3} hasDoorMark={true} frame={frame} />
      <AbandonedBuilding x={width * 0.82} y={height * 0.52} scale={1.0} variant={4} hasDoorMark={true} frame={frame} />
      <AbandonedBuilding x={width * 0.92} y={height * 0.51} scale={0.9} variant={5} hasDoorMark={false} frame={frame} />

      {/* Crumbling walls */}
      <CrumblingWall x={width * 0.38} y={height * 0.53} wallWidth={90} wallHeight={45} collapseRight={true} />
      <CrumblingWall x={width * 0.58} y={height * 0.54} wallWidth={70} wallHeight={35} collapseRight={false} />

      {/* Marked doors (standalone) in midground */}
      <MarkedDoor x={width * 0.45} y={height * 0.54} scale={0.9} variant={0} frame={frame} />
      <MarkedDoor x={width * 0.54} y={height * 0.53} scale={0.8} variant={1} frame={frame} />

      {/* Empty market stalls */}
      <EmptyMarketStall x={width * 0.33} y={height * 0.58} scale={1.0} variant={0} frame={frame} />
      <EmptyMarketStall x={width * 0.6} y={height * 0.57} scale={0.9} variant={1} frame={frame} />

      {/* Midground funeral pyres */}
      <FuneralPyre x={width * 0.2} y={height * 0.50} scale={0.7} intensity={0.8} seed={1.0} frame={frame} />
      <FuneralPyre x={width * 0.75} y={height * 0.49} scale={0.6} intensity={0.7} seed={4.2} frame={frame} />

      {/* Pyre glow on surrounding area */}
      <circle cx={width * 0.2} cy={height * 0.50} r={80}
        fill="url(#pyre-glow-2)" opacity={0.5 + hazeFlicker * 0.1} />
      <circle cx={width * 0.75} cy={height * 0.49} r={70}
        fill="url(#pyre-glow-2)" opacity={0.4 + hazeFlicker * 0.08} />

      {/* Midground smoke plumes from pyres */}
      <SmokePlume x={width * 0.2} y={height * 0.48} scale={0.9} seed={1.5} darkness={0.45} frame={frame} />
      <SmokePlume x={width * 0.75} y={height * 0.47} scale={0.8} seed={5.0} darkness={0.4} frame={frame} />

      {/* Grief figures in midground */}
      <GriefFigure x={width * 0.18} y={height * 0.56} scale={0.8} variant={0} frame={frame} />
      <GriefFigure x={width * 0.42} y={height * 0.55} scale={0.7} variant={1} frame={frame} />
      <GriefFigure x={width * 0.72} y={height * 0.56} scale={0.75} variant={2} frame={frame} />

      {/* Scattered debris throughout midground */}
      <ScatteredDebris x={width * 0.15} y={height * 0.56} variant={0} />
      <ScatteredDebris x={width * 0.3} y={height * 0.58} variant={1} />
      <ScatteredDebris x={width * 0.48} y={height * 0.55} variant={2} />
      <ScatteredDebris x={width * 0.63} y={height * 0.57} variant={0} />
      <ScatteredDebris x={width * 0.85} y={height * 0.56} variant={1} />

      {/* Copal burners (ritual purification attempts) */}
      <CopalBurner x={width * 0.4} y={height * 0.56} scale={1.0} seed={2.0} frame={frame} />
      <CopalBurner x={width * 0.65} y={height * 0.55} scale={0.8} seed={6.3} frame={frame} />

      {/* ================================================================== */}
      {/* LAYER 4: CROWD FIGURES                                             */}
      {/* ================================================================== */}

      <AztecCrowdLayer config={AZTEC_CROWD_CONFIGS.plague} />

      {/* ================================================================== */}
      {/* LAYER 5: FOREGROUND                                                */}
      {/* ================================================================== */}

      {/* Foreground funeral pyre (larger, more detail) */}
      <FuneralPyre x={width * 0.35} y={height * 0.72} scale={1.3} intensity={1.2} seed={2.5} frame={frame} />
      {/* Pyre glow */}
      <circle cx={width * 0.35} cy={height * 0.72} r={150}
        fill="url(#pyre-glow-1)" opacity={0.6 + hazeFlicker * 0.15} />

      {/* Foreground smoke from main pyre */}
      <SmokePlume x={width * 0.35} y={height * 0.68} scale={1.2} seed={2.8} darkness={0.55} frame={frame} />

      {/* Sick people on mats - foreground left */}
      <SickMat x={width * 0.05} y={height * 0.82} scale={1.2} variant={0} frame={frame} />
      <SickMat x={width * 0.15} y={height * 0.85} scale={1.1} variant={1} frame={frame} />
      <SickMat x={width * 0.08} y={height * 0.90} scale={1.0} variant={2} frame={frame} />

      {/* Sick people on mats - foreground right */}
      <SickMat x={width * 0.72} y={height * 0.83} scale={1.15} variant={3} frame={frame} />
      <SickMat x={width * 0.82} y={height * 0.86} scale={1.0} variant={4} frame={frame} />
      <SickMat x={width * 0.90} y={height * 0.82} scale={0.95} variant={5} frame={frame} />

      {/* Healers tending to the sick */}
      <HealerFigure x={width * 0.12} y={height * 0.80} scale={1.1} variant={0} frame={frame} />
      <HealerFigure x={width * 0.78} y={height * 0.81} scale={1.0} variant={1} frame={frame} />

      {/* Wrapped bodies in foreground */}
      <WrappedBody x={width * 0.50} y={height * 0.78} scale={1.2} variant={0} frame={frame} />
      <WrappedBody x={width * 0.55} y={height * 0.82} scale={1.1} variant={1} frame={frame} />
      <WrappedBody x={width * 0.60} y={height * 0.80} scale={1.0} variant={2} frame={frame} />
      <WrappedBody x={width * 0.48} y={height * 0.84} scale={0.95} variant={3} frame={frame} />

      {/* Grief figures in foreground */}
      <GriefFigure x={width * 0.52} y={height * 0.76} scale={1.2} variant={3} frame={frame} />
      <GriefFigure x={width * 0.62} y={height * 0.78} scale={1.1} variant={4} frame={frame} />

      {/* Foreground debris and abandoned goods */}
      <ScatteredDebris x={width * 0.02} y={height * 0.88} variant={2} />
      <ScatteredDebris x={width * 0.25} y={height * 0.84} variant={0} />
      <ScatteredDebris x={width * 0.68} y={height * 0.88} variant={1} />
      <ScatteredDebris x={width * 0.88} y={height * 0.90} variant={2} />

      {/* Abandoned large pottery in foreground */}
      <g transform={`translate(${width * 0.03}, ${height * 0.92})`}>
        <ellipse cx={0} cy={0} rx={14} ry={10}
          fill={C.stoneRed} stroke={C.stoneRedDark} strokeWidth={1.2} opacity={0.6} />
        <ellipse cx={0} cy={-3} rx={10} ry={6}
          fill={C.stoneRedDark} opacity={0.4} />
        {/* Aztec pattern on pot */}
        <path d="M-8,2 q4,-2 8,-1 q4,1 8,0"
          fill="none" stroke={C.aztecGold} strokeWidth={0.8} opacity={0.3} />
        <path d="M-6,-4 q3,-1 6,0 q3,1 6,0"
          fill="none" stroke={C.aztecRed} strokeWidth={0.6} opacity={0.3} />
      </g>

      {/* Overturned grinding stone (metate) */}
      <g transform={`translate(${width * 0.93}, ${height * 0.88}) rotate(15)`}>
        <rect x={-12} y={-4} width={24} height={8} rx={2}
          fill={C.stoneDark} stroke={C.outlineSoft} strokeWidth={0.8} opacity={0.5} />
        <ellipse cx={-14} cy={0} rx={3} ry={4}
          fill={C.stoneMid} opacity={0.4} />
      </g>

      {/* Scattered maize/corn cobs */}
      <g transform={`translate(${width * 0.28}, ${height * 0.87})`}>
        <ellipse cx={0} cy={0} rx={4} ry={1.8}
          fill={C.aztecGold} stroke={C.aztecGoldDark} strokeWidth={0.4} opacity={0.35}
          transform="rotate(-25)" />
        <ellipse cx={6} cy={2} rx={3.5} ry={1.5}
          fill={C.aztecGoldDark} opacity={0.3}
          transform="rotate(40, 6, 2)" />
      </g>

      {/* Abandoned obsidian blade */}
      <g transform={`translate(${width * 0.7}, ${height * 0.90})`}>
        <path d="M0,0 l2,-10 l2,0 l-1,10 z"
          fill={C.stoneVeryDark} opacity={0.5} />
        <line x1={1} y1={0} x2={1} y2={6}
          stroke={C.woodDark} strokeWidth={2} strokeLinecap="round" opacity={0.4} />
      </g>

      {/* Copal burner in foreground */}
      <CopalBurner x={width * 0.22} y={height * 0.83} scale={1.3} seed={8.7} frame={frame} />

      {/* ================================================================== */}
      {/* LAYER 6: STONE TABLET FOR BOARD TEXT                               */}
      {/* ================================================================== */}

      <g transform={`translate(${width / 2 - 210}, ${height * 0.68})`}>
        {/* Tablet shadow */}
        <rect x={4} y={4} width={420} height={170} rx={4}
          fill="rgba(0,0,0,0.3)" />

        {/* Stone tablet frame */}
        <rect x={-8} y={-8} width={436} height={186} rx={6}
          fill={C.boardFrame} stroke={C.outline} strokeWidth={2} />

        {/* Inner stone surface */}
        <rect x={0} y={0} width={420} height={170} rx={2}
          fill={C.boardBg} />
        {/* Stone texture overlay */}
        <rect x={0} y={0} width={420} height={170} rx={2}
          fill="url(#stone-texture)" opacity={0.3} />

        {/* Aztec border carvings - top */}
        <g opacity={0.4}>
          {Array.from({ length: 14 }, (_, i) => (
            <g key={`glyph-t-${i}`} transform={`translate(${10 + i * 30}, 8)`}>
              <rect x={0} y={0} width={4} height={4} fill={C.glyphColor} />
              <rect x={6} y={0} width={4} height={2} fill={C.glyphColor} />
              <rect x={6} y={4} width={2} height={2} fill={C.glyphColor} />
            </g>
          ))}
        </g>

        {/* Aztec border carvings - bottom */}
        <g opacity={0.4}>
          {Array.from({ length: 14 }, (_, i) => (
            <g key={`glyph-b-${i}`} transform={`translate(${10 + i * 30}, 155)`}>
              <rect x={0} y={0} width={4} height={4} fill={C.glyphColor} />
              <rect x={6} y={2} width={4} height={2} fill={C.glyphColor} />
              <rect x={0} y={6} width={2} height={2} fill={C.glyphColor} />
            </g>
          ))}
        </g>

        {/* Side carvings - left */}
        <g opacity={0.35}>
          {Array.from({ length: 5 }, (_, i) => (
            <g key={`glyph-l-${i}`} transform={`translate(5, ${25 + i * 28})`}>
              <circle cx={3} cy={3} r={2} fill="none" stroke={C.glyphColor} strokeWidth={0.8} />
              <line x1={0} y1={8} x2={6} y2={8} stroke={C.glyphColor} strokeWidth={0.6} />
            </g>
          ))}
        </g>

        {/* Side carvings - right */}
        <g opacity={0.35}>
          {Array.from({ length: 5 }, (_, i) => (
            <g key={`glyph-r-${i}`} transform={`translate(407, ${25 + i * 28})`}>
              <circle cx={3} cy={3} r={2} fill="none" stroke={C.glyphColor} strokeWidth={0.8} />
              <line x1={0} y1={8} x2={6} y2={8} stroke={C.glyphColor} strokeWidth={0.6} />
            </g>
          ))}
        </g>

        {/* Death god skull carving - corners */}
        {[
          [15, 18],
          [395, 18],
          [15, 145],
          [395, 145],
        ].map(([cx, cy], i) => (
          <g key={`skull-${i}`} transform={`translate(${cx}, ${cy})`} opacity={0.25}>
            <circle cx={0} cy={0} r={6} fill="none" stroke={C.glyphColor} strokeWidth={0.8} />
            <circle cx={-2} cy={-1} r={1} fill={C.glyphColor} />
            <circle cx={2} cy={-1} r={1} fill={C.glyphColor} />
            <line x1={-2} y1={3} x2={2} y2={3} stroke={C.glyphColor} strokeWidth={0.5} />
          </g>
        ))}

        {/* Board text */}
        {boardText && (
          <text
            x={210} y={95}
            textAnchor="middle"
            fill={C.chalk}
            fontSize={34}
            fontFamily="'Courier New', monospace"
            fontWeight="bold"
            opacity={0.85}
          >
            {boardText}
          </text>
        )}
      </g>

      {/* ================================================================== */}
      {/* LAYER 7: ATMOSPHERIC OVERLAYS                                      */}
      {/* ================================================================== */}

      {/* Ground fog layer */}
      <rect x={0} y={height * 0.7} width={width} height={height * 0.3}
        fill="url(#ground-fog)" opacity={0.4 + hazeFlicker * 0.1} />

      {/* Low-lying smoke haze across entire scene */}
      <ellipse
        cx={width * 0.3 + windSlow * 30} cy={height * 0.65}
        rx={400} ry={40}
        fill={C.smokeMid} opacity={0.08 + windMed * 0.02}
      />
      <ellipse
        cx={width * 0.7 + windSlow * 20} cy={height * 0.60}
        rx={350} ry={35}
        fill={C.smokeDark} opacity={0.06 + windMed * 0.02}
      />
      <ellipse
        cx={width * 0.5 + windMed * 25} cy={height * 0.75}
        rx={500} ry={50}
        fill={C.smokeMid} opacity={0.1 + hazeFlicker * 0.03}
      />

      {/* Ash particles floating in air */}
      <AshParticles width={width} height={height} frame={frame} />

      {/* Additional midground haze wisps */}
      <path
        d={`M0,${height * 0.55} Q${width * 0.2 + windSlow * 15},${height * 0.52}
           ${width * 0.4},${height * 0.54 + windMed * 3}
           Q${width * 0.6 + windSlow * 10},${height * 0.51}
           ${width * 0.8},${height * 0.53 + windMed * 2}
           Q${width * 0.9},${height * 0.55} ${width},${height * 0.54}
           L${width},${height * 0.58} L0,${height * 0.58} Z`}
        fill={C.fogNear} opacity={0.25}
      />

      {/* Sickly green atmospheric wash */}
      <rect x={0} y={0} width={width} height={height}
        fill={C.hazeGreen} opacity={0.08} />

      {/* Dark vignette overlay */}
      <rect x={0} y={0} width={width} height={height}
        fill="url(#vignette)" opacity={0.85 + vignetteBreath * 0.05} />

      {/* Top darkness (heavy clouds pressing down) */}
      <rect x={0} y={0} width={width} height={height * 0.15}
        fill={C.skyTop} opacity={0.4} />

      {/* Bottom darkness */}
      <rect x={0} y={height * 0.9} width={width} height={height * 0.1}
        fill={C.skyTop} opacity={0.3} />

      {/* Very subtle warm glow near foreground pyre */}
      <g filter="url(#fire-glow)">
        <circle cx={width * 0.35} cy={height * 0.72} r={200}
          fill={C.fireOuter} opacity={0.03 + hazeFlicker * 0.01} />
      </g>

      {/* Final desaturation/darkness layer */}
      <rect x={0} y={0} width={width} height={height}
        fill="rgba(20,22,18,0.15)" />
    </svg>
  );
};
