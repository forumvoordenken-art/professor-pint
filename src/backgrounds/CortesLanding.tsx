import React from 'react';
import { useCurrentFrame } from 'remotion';
import { sineWave } from '../animations/easing';
import { AztecCrowdLayer, AZTEC_CROWD_CONFIGS } from '../crowds/AztecCrowd';

interface CortesLandingProps {
  boardText?: string;
  width?: number;
  height?: number;
}

const C = {
  // Sky & atmosphere
  skyTop: '#1A3868',
  skyMid: '#3A6898',
  skyBottom: '#8AA8C0',
  skyGold: '#C8A060',
  sunCore: '#FFF0C0',
  sunGlow: '#FFD070',
  sunHaze: 'rgba(255,200,80,0.15)',
  cloudLight: '#D8C8B0',
  cloudDark: '#9A8A78',
  mist: 'rgba(180,170,155,0.25)',
  // Ocean & water
  oceanDeep: '#0A3058',
  oceanMid: '#185888',
  oceanLight: '#2878A8',
  oceanFoam: '#C8D8E0',
  waveWhite: '#E8F0F0',
  spray: 'rgba(220,235,240,0.7)',
  reflection: 'rgba(255,220,140,0.12)',
  // Beach & land
  sandDry: '#E0C880',
  sandMid: '#D0B870',
  sandWet: '#A09060',
  sandDark: '#887848',
  mudTrack: '#7A6840',
  shells: '#E8D8C0',
  // Vegetation
  jungleDeep: '#0A3008',
  jungleMid: '#1A5010',
  jungleLight: '#2D7020',
  jungleCanopy: '#184010',
  palmTrunk: '#6A5030',
  palmFrond: '#1E6018',
  palmFrondLight: '#2A8020',
  undergrowth: '#1A4810',
  flowerRed: '#C83030',
  flowerYellow: '#D8B030',
  // Ships & boats
  hullDark: '#3A2818',
  hullMid: '#5A3A1C',
  hullLight: '#7B4E2C',
  hullWet: '#4A3020',
  deck: '#8B6B4A',
  mast: '#6A5038',
  sailWhite: '#F0EDE0',
  sailShadow: '#D0C8B8',
  ropeColor: '#8A7A60',
  crossRed: '#B02818',
  flagRed: '#C03020',
  flagGold: '#D4A020',
  cannon: '#4A4A50',
  // Soldiers & armor
  steelBright: '#C0C8D0',
  steelMid: '#8A9098',
  steelDark: '#606870',
  leatherBrown: '#6A4828',
  fabricDark: '#2A2828',
  bootBlack: '#1A1818',
  swordSteel: '#B0B8C0',
  crossbowWood: '#5A3A1C',
  // Aztec warriors
  aztecSkin: '#B07840',
  aztecPaint: '#C03020',
  aztecTurquoise: '#2EA8A0',
  aztecGold: '#D4A020',
  aztecFeatherGreen: '#1A8040',
  aztecFeatherRed: '#C82020',
  aztecShieldRed: '#B82818',
  aztecShieldOcher: '#C89840',
  aztecCloth: '#F0E8D0',
  obsidian: '#2A2A3A',
  // Structure
  templeStone: '#A8987A',
  templeShadow: '#887860',
  outline: '#1A1A1A',
  boardBg: '#B8906A',
  boardFrame: '#7B4E2C',
  chalk: '#F5E8C8',
};

// --- Sub-components ---

const SpanishSoldier: React.FC<{ x: number; y: number; scale?: number; type?: 'sword' | 'crossbow' | 'spear' | 'jumping'; flip?: boolean }> = ({
  x, y, scale = 1, type = 'sword', flip = false,
}) => {
  const frame = useCurrentFrame();
  const idle = sineWave(frame, 0.08 + Math.abs(x) * 0.0001) * 1.5;
  const tx = flip ? `translate(${x}, ${y}) scale(${-scale}, ${scale})` : `translate(${x}, ${y}) scale(${scale})`;

  return (
    <g transform={tx}>
      {/* Boots */}
      <rect x={-5} y={24} width={5} height={6} rx={1} fill={C.bootBlack} />
      <rect x={2} y={24} width={5} height={6} rx={1} fill={C.bootBlack} />
      {/* Legs */}
      <rect x={-4} y={14} width={4} height={12} fill={C.fabricDark} />
      <rect x={2} y={14} width={4} height={12} fill={C.fabricDark} />
      {/* Body - breastplate */}
      <path d={`M-7,${0 + idle} L-6,-8 Q0,-12 6,-8 L7,${0 + idle} Q0,${4 + idle} -7,${0 + idle} Z`}
        fill={C.steelBright} stroke={C.outline} strokeWidth={0.8} />
      <path d={`M3,-8 L7,${0 + idle} Q0,${4 + idle} -1,${2 + idle} Z`}
        fill={C.steelMid} opacity={0.5} />
      {/* Arms */}
      <line x1={-7} y1={-4 + idle} x2={-12} y2={8 + idle} stroke={C.steelDark} strokeWidth={3} strokeLinecap="round" />
      <line x1={7} y1={-4 + idle} x2={12} y2={6 + idle} stroke={C.steelDark} strokeWidth={3} strokeLinecap="round" />
      {/* Helmet - morion */}
      <path d="M-6,-12 Q-7,-18 0,-20 Q7,-18 6,-12 Z" fill={C.steelBright} stroke={C.outline} strokeWidth={0.8} />
      <path d="M-8,-12 L8,-12" stroke={C.steelMid} strokeWidth={2} />
      <path d="M0,-20 Q1,-22 0,-24" fill="none" stroke={C.steelDark} strokeWidth={1.2} />
      {/* Face */}
      <rect x={-3} y={-12} width={6} height={4} fill="#E0C0A0" rx={1} />
      <circle cx={-1.5} cy={-11} r={0.5} fill={C.outline} />
      <circle cx={1.5} cy={-11} r={0.5} fill={C.outline} />
      {/* Weapon */}
      {type === 'sword' && (
        <g>
          <line x1={12} y1={6 + idle} x2={18} y2={-4 + idle} stroke={C.swordSteel} strokeWidth={1.5} strokeLinecap="round" />
          <line x1={10} y1={5 + idle} x2={14} y2={5 + idle} stroke={C.flagGold} strokeWidth={1.5} />
        </g>
      )}
      {type === 'crossbow' && (
        <g transform={`translate(-12, ${4 + idle})`}>
          <line x1={0} y1={0} x2={-8} y2={-6} stroke={C.crossbowWood} strokeWidth={2} />
          <line x1={-8} y1={-10} x2={-8} y2={-2} stroke={C.crossbowWood} strokeWidth={1.5} />
          <line x1={-12} y1={-6} x2={-4} y2={-6} stroke={C.ropeColor} strokeWidth={0.8} />
        </g>
      )}
      {type === 'spear' && (
        <line x1={12} y1={8 + idle} x2={12} y2={-30 + idle} stroke={C.mast} strokeWidth={1.5} strokeLinecap="round" />
      )}
      {type === 'jumping' && (
        <>
          {/* One boot in water, one on sand */}
          <rect x={-6} y={26} width={6} height={4} rx={1} fill={C.bootBlack} opacity={0.7} />
          <line x1={12} y1={6 + idle} x2={18} y2={-2 + idle} stroke={C.swordSteel} strokeWidth={1.5} strokeLinecap="round" />
          <line x1={10} y1={5 + idle} x2={14} y2={5 + idle} stroke={C.flagGold} strokeWidth={1.5} />
        </>
      )}
    </g>
  );
};

const AztecWarrior: React.FC<{ x: number; y: number; scale?: number; type?: 'jaguar' | 'eagle' | 'shield' | 'chief'; flip?: boolean }> = ({
  x, y, scale = 1, type = 'shield', flip = false,
}) => {
  const frame = useCurrentFrame();
  const idle = sineWave(frame, 0.09 + Math.abs(x) * 0.0001) * 1.5;
  const tx = flip ? `translate(${x}, ${y}) scale(${-scale}, ${scale})` : `translate(${x}, ${y}) scale(${scale})`;

  return (
    <g transform={tx}>
      {/* Legs */}
      <rect x={-3} y={14} width={3} height={14} fill={C.aztecSkin} />
      <rect x={2} y={14} width={3} height={14} fill={C.aztecSkin} />
      {/* Sandals */}
      <rect x={-4} y={27} width={5} height={3} rx={1} fill={C.leatherBrown} />
      <rect x={1} y={27} width={5} height={3} rx={1} fill={C.leatherBrown} />
      {/* Loincloth */}
      <path d="M-5,12 L7,12 L5,18 Q1,20 -3,18 Z" fill={C.aztecCloth} stroke={C.outline} strokeWidth={0.6} />
      {/* Torso */}
      <path d={`M-6,${0 + idle} L-5,-8 Q0,-11 5,-8 L6,${0 + idle} Q0,${3 + idle} -6,${0 + idle} Z`}
        fill={C.aztecSkin} stroke={C.outline} strokeWidth={0.6} />
      {/* War paint stripes */}
      <line x1={-4} y1={-2 + idle} x2={4} y2={-2 + idle} stroke={C.aztecPaint} strokeWidth={1.2} opacity={0.7} />
      <line x1={-3} y1={2 + idle} x2={3} y2={2 + idle} stroke={C.aztecPaint} strokeWidth={0.8} opacity={0.5} />
      {/* Arms */}
      <line x1={-6} y1={-4 + idle} x2={-12} y2={6 + idle} stroke={C.aztecSkin} strokeWidth={3} strokeLinecap="round" />
      <line x1={6} y1={-4 + idle} x2={12} y2={4 + idle} stroke={C.aztecSkin} strokeWidth={3} strokeLinecap="round" />
      {/* Head */}
      <circle cx={0} cy={-14} r={5} fill={C.aztecSkin} stroke={C.outline} strokeWidth={0.6} />
      <circle cx={-1.5} cy={-15} r={0.5} fill={C.outline} />
      <circle cx={1.5} cy={-15} r={0.5} fill={C.outline} />
      {/* Hair */}
      <path d="M-5,-16 Q-5,-20 0,-21 Q5,-20 5,-16" fill="#1A1A1A" />

      {type === 'jaguar' && (
        <>
          {/* Jaguar headdress */}
          <path d="M-7,-18 Q-8,-26 0,-28 Q8,-26 7,-18 Z" fill="#D4A020" stroke={C.outline} strokeWidth={0.8} />
          <circle cx={-2} cy={-24} r={1.2} fill={C.outline} />
          <circle cx={2} cy={-24} r={1.2} fill={C.outline} />
          {/* Spots on headdress */}
          <circle cx={-4} cy={-22} r={0.8} fill="#8A6818" />
          <circle cx={4} cy={-22} r={0.8} fill="#8A6818" />
          {/* Macuahuitl */}
          <g transform={`translate(12, ${4 + idle}) rotate(-15)`}>
            <rect x={-1.5} y={-20} width={3} height={22} fill={C.crossbowWood} rx={0.5} />
            {[...Array(5)].map((_, i) => (
              <rect key={i} x={-2.5} y={-18 + i * 4} width={1} height={2.5} fill={C.obsidian} />
            ))}
            {[...Array(5)].map((_, i) => (
              <rect key={`r${i}`} x={1.5} y={-18 + i * 4} width={1} height={2.5} fill={C.obsidian} />
            ))}
          </g>
        </>
      )}
      {type === 'eagle' && (
        <>
          {/* Eagle headdress with beak */}
          <path d="M-8,-18 Q-6,-30 0,-32 Q6,-30 8,-18 Z" fill="#F0E8D0" stroke={C.outline} strokeWidth={0.8} />
          <path d="M-2,-32 Q0,-36 2,-32" fill="#D4A020" stroke={C.outline} strokeWidth={0.6} />
          {/* Feathers */}
          <path d="M-8,-22 L-14,-26 L-8,-24" fill={C.aztecFeatherRed} />
          <path d="M8,-22 L14,-26 L8,-24" fill={C.aztecFeatherGreen} />
          {/* Spear */}
          <line x1={12} y1={6 + idle} x2={12} y2={-32 + idle} stroke={C.crossbowWood} strokeWidth={1.5} />
          <path d={`M10,-32 L12,-38 L14,-32 Z`} fill={C.obsidian} />
        </>
      )}
      {type === 'shield' && (
        <>
          {/* Feather headband */}
          <path d="M-5,-19 L-3,-24 L0,-19" fill={C.aztecFeatherGreen} />
          <path d="M0,-19 L3,-25 L5,-19" fill={C.aztecFeatherRed} />
          {/* Round shield */}
          <circle cx={-13} cy={4 + idle} r={8} fill={C.aztecShieldRed} stroke={C.outline} strokeWidth={1} />
          <circle cx={-13} cy={4 + idle} r={5} fill={C.aztecShieldOcher} />
          <circle cx={-13} cy={4 + idle} r={2} fill={C.aztecGold} />
          {/* Club */}
          <line x1={12} y1={6 + idle} x2={16} y2={-8 + idle} stroke={C.crossbowWood} strokeWidth={2} strokeLinecap="round" />
        </>
      )}
      {type === 'chief' && (
        <>
          {/* Grand feather headdress */}
          {[-3, -1.5, 0, 1.5, 3].map((fx, i) => (
            <path key={i} d={`M${fx},-19 Q${fx + (i - 2) * 2},-35 ${fx + (i - 2) * 4},-40`}
              fill="none" stroke={i % 2 === 0 ? C.aztecFeatherGreen : C.aztecFeatherRed} strokeWidth={2} />
          ))}
          {/* Gold earrings */}
          <circle cx={-6} cy={-12} r={1.5} fill={C.aztecGold} />
          <circle cx={6} cy={-12} r={1.5} fill={C.aztecGold} />
          {/* Jade necklace */}
          <path d="M-4,-8 Q0,-6 4,-8" fill="none" stroke={C.aztecTurquoise} strokeWidth={2} />
          {/* Ornate shield */}
          <circle cx={-14} cy={3 + idle} r={9} fill={C.aztecTurquoise} stroke={C.outline} strokeWidth={1} />
          <circle cx={-14} cy={3 + idle} r={6} fill={C.aztecGold} />
          <path d="M-14,-3 L-11,3 L-14,9 L-17,3 Z" fill={C.aztecFeatherRed} opacity={0.7} />
        </>
      )}
    </g>
  );
};

const LandingBoat: React.FC<{ x: number; y: number; scale?: number; soldiers?: number; inWater?: boolean }> = ({
  x, y, scale = 1, soldiers = 4, inWater = false,
}) => {
  const frame = useCurrentFrame();
  const rock = inWater ? sineWave(frame, 0.1) * 2.5 : 0;
  const oarDip = sineWave(frame, 0.15) * 8;

  return (
    <g transform={`translate(${x}, ${y + rock}) scale(${scale})`}>
      {/* Water splash around boat */}
      {inWater && (
        <>
          <ellipse cx={0} cy={10} rx={45} ry={6} fill={C.oceanFoam} opacity={0.3} />
          <path d={`M-40,8 Q-30,${4 + rock} -20,8 Q-10,${12 - rock} 0,8 Q10,${4 + rock} 20,8 Q30,${12 - rock} 40,8`}
            fill="none" stroke={C.waveWhite} strokeWidth={1.5} opacity={0.5} />
        </>
      )}
      {/* Hull - detailed with planks */}
      <path d="M-38,0 Q-42,-8 -32,-14 L32,-14 Q42,-8 38,0 Q0,10 -38,0 Z"
        fill={C.hullMid} stroke={C.outline} strokeWidth={1.5} />
      <path d="M-32,-14 L32,-14 L36,-8 Q0,-4 -36,-8 Z" fill={C.hullDark} opacity={0.4} />
      {/* Plank lines */}
      <line x1={-30} y1={-10} x2={30} y2={-10} stroke={C.hullDark} strokeWidth={0.5} opacity={0.4} />
      <line x1={-34} y1={-5} x2={34} y2={-5} stroke={C.hullDark} strokeWidth={0.5} opacity={0.3} />
      {/* Gunwale */}
      <path d="M-38,0 Q-42,-8 -32,-14" fill="none" stroke={C.hullDark} strokeWidth={2} />
      <path d="M38,0 Q42,-8 32,-14" fill="none" stroke={C.hullDark} strokeWidth={2} />
      {/* Oars */}
      {inWater && [-20, 0, 15].map((ox, i) => (
        <g key={`oar-${i}`}>
          <line x1={ox - 3} y1={-4} x2={ox - 18} y2={8 + oarDip * (i % 2 === 0 ? 1 : -1)}
            stroke={C.mast} strokeWidth={1.5} opacity={0.7} />
          <line x1={ox + 3} y1={-4} x2={ox + 18} y2={8 + oarDip * (i % 2 === 0 ? -1 : 1)}
            stroke={C.mast} strokeWidth={1.5} opacity={0.7} />
        </g>
      ))}
      {/* Soldiers sitting in boat */}
      {[...Array(Math.min(soldiers, 5))].map((_, i) => {
        const sx = -24 + i * 12;
        return (
          <g key={`bs-${i}`} transform={`translate(${sx}, -18)`}>
            {/* Helmet */}
            <path d="M-3,-6 Q-4,-10 0,-12 Q4,-10 3,-6 Z" fill={C.steelBright} stroke={C.outline} strokeWidth={0.6} />
            <line x1={-4} y1={-6} x2={4} y2={-6} stroke={C.steelMid} strokeWidth={1} />
            {/* Face */}
            <rect x={-2} y={-6} width={4} height={3} fill="#E0C0A0" rx={0.5} />
            {/* Body */}
            <rect x={-3} y={-3} width={6} height={8} fill={C.steelMid} rx={0.5} />
            {i === 0 && (
              <line x1={4} y1={-2} x2={6} y2={-14} stroke={C.mast} strokeWidth={1} />
            )}
          </g>
        );
      })}
    </g>
  );
};

const PalmTree: React.FC<{ x: number; y: number; height?: number; lean?: number; scale?: number }> = ({
  x, y, height: h = 120, lean = 0, scale: s = 1,
}) => {
  const frame = useCurrentFrame();
  const sway = sineWave(frame, 0.06 + Math.abs(x) * 0.00005) * 4;
  const topX = lean + sway;
  const topY = -h;
  const midX = lean * 0.4 + sway * 0.3;
  const midY = -h * 0.5;

  return (
    <g transform={`translate(${x}, ${y}) scale(${s})`}>
      {/* Shadow on ground */}
      <ellipse cx={lean * 1.5 + 20} cy={5} rx={h * 0.4} ry={4} fill="rgba(0,0,0,0.08)" />
      {/* Trunk - curved with segments */}
      <path d={`M-3,0 Q${midX - 2},${midY} ${topX - 2},${topY} L${topX + 2},${topY} Q${midX + 2},${midY} 3,0 Z`}
        fill={C.palmTrunk} stroke={C.outline} strokeWidth={1} />
      {/* Trunk ring marks */}
      {[0.15, 0.3, 0.45, 0.6, 0.75].map((pct, i) => {
        const ringX = midX * pct * 2;
        const ringY = -h * pct;
        return (
          <line key={i} x1={ringX - 3} y1={ringY} x2={ringX + 3} y2={ringY}
            stroke={C.outline} strokeWidth={0.6} opacity={0.3} />
        );
      })}
      {/* Coconuts */}
      <circle cx={topX - 2} cy={topY + 6} r={2.5} fill="#8A6830" stroke={C.outline} strokeWidth={0.5} />
      <circle cx={topX + 3} cy={topY + 5} r={2.5} fill="#7A5828" stroke={C.outline} strokeWidth={0.5} />
      {/* Fronds - 7 detailed fronds */}
      {[
        { angle: -80, len: 50 }, { angle: -50, len: 55 }, { angle: -20, len: 45 },
        { angle: 10, len: 50 }, { angle: 40, len: 55 }, { angle: 70, len: 48 },
        { angle: 100, len: 42 },
      ].map((frond, i) => {
        const rad = (frond.angle + sway * 2) * Math.PI / 180;
        const endX = topX + Math.cos(rad) * frond.len;
        const endY = topY + Math.sin(rad) * frond.len * 0.6;
        const ctrlX = topX + Math.cos(rad) * frond.len * 0.5;
        const ctrlY = topY + Math.sin(rad) * frond.len * 0.3 - 8;
        return (
          <g key={i}>
            {/* Main stem */}
            <path d={`M${topX},${topY} Q${ctrlX},${ctrlY} ${endX},${endY}`}
              fill="none" stroke={i % 2 === 0 ? C.palmFrond : C.palmFrondLight} strokeWidth={2} />
            {/* Leaflets along stem */}
            {[0.3, 0.5, 0.7, 0.9].map((t, j) => {
              const lx = topX + (endX - topX) * t;
              const ly = topY + (endY - topY) * t + (ctrlY - topY) * 4 * t * (1 - t);
              return (
                <g key={j}>
                  <line x1={lx} y1={ly} x2={lx - 6} y2={ly + 4} stroke={C.palmFrond} strokeWidth={1} opacity={0.7} />
                  <line x1={lx} y1={ly} x2={lx + 6} y2={ly + 4} stroke={C.palmFrond} strokeWidth={1} opacity={0.7} />
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
};

const SupplyCrate: React.FC<{ x: number; y: number; scale?: number; type?: 'box' | 'barrel' | 'sack' }> = ({
  x, y, scale = 1, type = 'box',
}) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    {type === 'box' && (
      <>
        <rect x={-8} y={-10} width={16} height={10} fill={C.hullLight} stroke={C.outline} strokeWidth={1} rx={0.5} />
        <line x1={-8} y1={-5} x2={8} y2={-5} stroke={C.hullDark} strokeWidth={0.6} opacity={0.5} />
        <rect x={-2} y={-7} width={4} height={2} fill={C.steelDark} rx={0.5} />
      </>
    )}
    {type === 'barrel' && (
      <>
        <ellipse cx={0} cy={0} rx={7} ry={3} fill={C.hullDark} stroke={C.outline} strokeWidth={0.8} />
        <rect x={-7} y={-14} width={14} height={14} rx={2} fill={C.hullMid} stroke={C.outline} strokeWidth={0.8} />
        <ellipse cx={0} cy={-14} rx={7} ry={3} fill={C.hullLight} stroke={C.outline} strokeWidth={0.8} />
        <line x1={-7} y1={-4} x2={7} y2={-4} stroke={C.steelDark} strokeWidth={1} />
        <line x1={-7} y1={-10} x2={7} y2={-10} stroke={C.steelDark} strokeWidth={1} />
      </>
    )}
    {type === 'sack' && (
      <>
        <path d="M-6,0 Q-8,-6 -5,-12 Q0,-14 5,-12 Q8,-6 6,0 Z"
          fill="#C8B898" stroke={C.outline} strokeWidth={0.8} />
        <path d="M-2,-12 Q0,-15 2,-12" fill="none" stroke={C.ropeColor} strokeWidth={1} />
      </>
    )}
  </g>
);

export const CortesLanding: React.FC<CortesLandingProps> = ({
  boardText = '',
  width = 1920,
  height = 1080,
}) => {
  const frame = useCurrentFrame();
  const waveCycle = sineWave(frame, 0.12) * 4;
  const waveCycle2 = sineWave(frame, 0.09, 0.7) * 3;
  const shipRock = sineWave(frame, 0.08) * 2;
  const shipRock2 = sineWave(frame, 0.06, 1.2) * 1.5;
  const flagWave = sineWave(frame, 0.2) * 5;
  const sailBillow = sineWave(frame, 0.06) * 3;
  const mistDrift = (frame * 0.08) % 200;
  const lightPulse = 1 + sineWave(frame, 0.04) * 0.03;
  const birdFloat = sineWave(frame, 0.05) * 10;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      <defs>
        {/* Sky gradient - golden dawn */}
        <linearGradient id="cort-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.skyTop} />
          <stop offset="40%" stopColor={C.skyMid} />
          <stop offset="75%" stopColor={C.skyBottom} />
          <stop offset="100%" stopColor={C.skyGold} />
        </linearGradient>
        {/* Ocean gradient */}
        <linearGradient id="cort-ocean" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.oceanLight} />
          <stop offset="60%" stopColor={C.oceanMid} />
          <stop offset="100%" stopColor={C.oceanDeep} />
        </linearGradient>
        {/* Sun glow radial */}
        <radialGradient id="cort-sun-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={C.sunCore} />
          <stop offset="30%" stopColor={C.sunGlow} />
          <stop offset="100%" stopColor="rgba(255,200,80,0)" />
        </radialGradient>
        {/* Sand gradient */}
        <linearGradient id="cort-sand" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.sandWet} />
          <stop offset="30%" stopColor={C.sandMid} />
          <stop offset="100%" stopColor={C.sandDry} />
        </linearGradient>
        {/* Light beam */}
        <linearGradient id="cort-light-beam" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,230,160,0.12)" />
          <stop offset="100%" stopColor="rgba(255,230,160,0)" />
        </linearGradient>
      </defs>

      {/* ============ SKY ============ */}
      <rect x={0} y={0} width={width} height={height * 0.48} fill="url(#cort-sky)" />

      {/* Sun breaking through haze */}
      <g transform={`translate(${width * 0.2}, ${height * 0.15}) scale(${lightPulse})`}>
        <circle cx={0} cy={0} r={120} fill="url(#cort-sun-glow)" opacity={0.4} />
        <circle cx={0} cy={0} r={60} fill={C.sunGlow} opacity={0.5} />
        <circle cx={0} cy={0} r={28} fill={C.sunCore} opacity={0.8} />
      </g>

      {/* God rays - light beams from sun */}
      <g opacity={0.08}>
        <polygon points={`${width * 0.2},${height * 0.15} ${width * 0.05},${height * 0.65} ${width * 0.15},${height * 0.65}`} fill={C.sunGlow} />
        <polygon points={`${width * 0.2},${height * 0.15} ${width * 0.25},${height * 0.7} ${width * 0.38},${height * 0.65}`} fill={C.sunGlow} />
        <polygon points={`${width * 0.2},${height * 0.15} ${width * 0.42},${height * 0.6} ${width * 0.5},${height * 0.65}`} fill={C.sunGlow} />
      </g>

      {/* Heavy atmospheric clouds */}
      {[
        { cx: width * 0.08, cy: height * 0.06, rx: 90, ry: 25, o: 0.5 },
        { cx: width * 0.35, cy: height * 0.04, rx: 110, ry: 30, o: 0.4 },
        { cx: width * 0.55, cy: height * 0.08, rx: 80, ry: 22, o: 0.45 },
        { cx: width * 0.75, cy: height * 0.03, rx: 100, ry: 28, o: 0.35 },
        { cx: width * 0.92, cy: height * 0.07, rx: 70, ry: 20, o: 0.4 },
        { cx: width * 0.15, cy: height * 0.14, rx: 65, ry: 18, o: 0.3 },
        { cx: width * 0.65, cy: height * 0.12, rx: 85, ry: 24, o: 0.3 },
      ].map((cloud, i) => (
        <g key={`cloud-${i}`}>
          <ellipse cx={cloud.cx} cy={cloud.cy} rx={cloud.rx} ry={cloud.ry}
            fill={C.cloudLight} opacity={cloud.o} />
          <ellipse cx={cloud.cx + cloud.rx * 0.3} cy={cloud.cy - cloud.ry * 0.2}
            rx={cloud.rx * 0.7} ry={cloud.ry * 0.8} fill={C.cloudLight} opacity={cloud.o * 0.8} />
          <ellipse cx={cloud.cx - cloud.rx * 0.2} cy={cloud.cy + cloud.ry * 0.3}
            rx={cloud.rx * 0.6} ry={cloud.ry * 0.6} fill={C.cloudDark} opacity={cloud.o * 0.5} />
        </g>
      ))}

      {/* Break in clouds - golden light strip */}
      <path d={`M${width * 0.1},${height * 0.18} Q${width * 0.3},${height * 0.14} ${width * 0.55},${height * 0.16}
        Q${width * 0.7},${height * 0.17} ${width * 0.9},${height * 0.2}
        L${width * 0.85},${height * 0.24} Q${width * 0.6},${height * 0.21} ${width * 0.3},${height * 0.22}
        L${width * 0.08},${height * 0.22} Z`}
        fill={C.skyGold} opacity={0.15} />

      {/* Distant birds */}
      {[[width * 0.4, height * 0.1], [width * 0.45, height * 0.08], [width * 0.42, height * 0.12],
        [width * 0.6, height * 0.06], [width * 0.63, height * 0.04]].map(([bx, by], i) => (
        <path key={`bird-${i}`}
          d={`M${bx - 4},${by + birdFloat * (i % 2 === 0 ? 1 : -1)} Q${bx},${by - 2 + birdFloat * (i % 2 === 0 ? 1 : -1)} ${bx + 4},${by + birdFloat * (i % 2 === 0 ? 1 : -1)}`}
          fill="none" stroke={C.outline} strokeWidth={0.8} opacity={0.3} />
      ))}

      {/* ============ JUNGLE COASTLINE (left side) ============ */}

      {/* Far jungle silhouette */}
      <path d={`M0,${height * 0.38}
        Q${width * 0.02},${height * 0.28} ${width * 0.05},${height * 0.32}
        Q${width * 0.07},${height * 0.24} ${width * 0.1},${height * 0.30}
        Q${width * 0.12},${height * 0.22} ${width * 0.15},${height * 0.28}
        Q${width * 0.17},${height * 0.20} ${width * 0.20},${height * 0.26}
        Q${width * 0.22},${height * 0.18} ${width * 0.25},${height * 0.24}
        Q${width * 0.27},${height * 0.20} ${width * 0.30},${height * 0.28}
        Q${width * 0.32},${height * 0.22} ${width * 0.35},${height * 0.30}
        Q${width * 0.37},${height * 0.26} ${width * 0.40},${height * 0.34}
        L${width * 0.40},${height * 0.52} L0,${height * 0.52} Z`}
        fill={C.jungleDeep} opacity={0.8} />

      {/* Mid jungle layer */}
      <path d={`M0,${height * 0.40}
        Q${width * 0.03},${height * 0.34} ${width * 0.06},${height * 0.37}
        Q${width * 0.09},${height * 0.30} ${width * 0.12},${height * 0.35}
        Q${width * 0.14},${height * 0.28} ${width * 0.17},${height * 0.33}
        Q${width * 0.20},${height * 0.27} ${width * 0.23},${height * 0.34}
        Q${width * 0.26},${height * 0.30} ${width * 0.28},${height * 0.36}
        Q${width * 0.30},${height * 0.32} ${width * 0.32},${height * 0.38}
        L${width * 0.32},${height * 0.52} L0,${height * 0.52} Z`}
        fill={C.jungleMid} opacity={0.7} />

      {/* Near jungle with detail */}
      <path d={`M0,${height * 0.43}
        Q${width * 0.02},${height * 0.38} ${width * 0.05},${height * 0.42}
        Q${width * 0.07},${height * 0.36} ${width * 0.10},${height * 0.40}
        Q${width * 0.12},${height * 0.34} ${width * 0.14},${height * 0.39}
        Q${width * 0.16},${height * 0.35} ${width * 0.18},${height * 0.41}
        L${width * 0.18},${height * 0.52} L0,${height * 0.52} Z`}
        fill={C.jungleLight} opacity={0.8} />

      {/* Temple structure peeking through jungle */}
      <g transform={`translate(${width * 0.12}, ${height * 0.30})`}>
        {/* Stone platform */}
        <rect x={-25} y={40} width={50} height={8} fill={C.templeStone} stroke={C.outline} strokeWidth={0.8} />
        <rect x={-20} y={30} width={40} height={12} fill={C.templeStone} stroke={C.outline} strokeWidth={0.8} />
        <rect x={-15} y={20} width={30} height={12} fill={C.templeStone} stroke={C.outline} strokeWidth={0.8} />
        {/* Shadow */}
        <rect x={5} y={20} width={10} height={28} fill={C.templeShadow} opacity={0.3} />
        {/* Steps */}
        <rect x={-8} y={32} width={16} height={4} fill={C.templeShadow} />
        <rect x={-6} y={28} width={12} height={4} fill={C.templeShadow} />
        {/* Figures in silhouette on platform */}
        <g opacity={0.5}>
          <rect x={-12} y={14} width={4} height={8} fill={C.outline} rx={1} />
          <rect x={-5} y={12} width={4} height={10} fill={C.outline} rx={1} />
          <rect x={4} y={14} width={4} height={8} fill={C.outline} rx={1} />
          <rect x={10} y={15} width={3} height={7} fill={C.outline} rx={1} />
        </g>
      </g>

      {/* Undergrowth and ferns near beach edge */}
      {[[width * 0.05, height * 0.48], [width * 0.12, height * 0.47], [width * 0.20, height * 0.46],
        [width * 0.28, height * 0.47], [width * 0.35, height * 0.48]].map(([ux, uy], i) => (
        <g key={`fern-${i}`} transform={`translate(${ux}, ${uy})`}>
          <path d={`M0,5 Q${-8 - i * 2},-5 ${-15 - i},${-2}`} fill="none" stroke={C.undergrowth} strokeWidth={2} />
          <path d={`M0,5 Q${8 + i * 2},-5 ${15 + i},${-2}`} fill="none" stroke={C.undergrowth} strokeWidth={2} />
          <path d={`M0,5 Q${-4 - i},-10 ${-10},${-8}`} fill="none" stroke={C.jungleLight} strokeWidth={1.5} />
          <path d={`M0,5 Q${4 + i},-10 ${10},${-8}`} fill="none" stroke={C.jungleLight} strokeWidth={1.5} />
          {i % 2 === 0 && <circle cx={3} cy={-2} r={2} fill={C.flowerRed} opacity={0.6} />}
          {i % 3 === 0 && <circle cx={-5} cy={0} r={1.5} fill={C.flowerYellow} opacity={0.7} />}
        </g>
      ))}

      {/* ============ OCEAN ============ */}
      <rect x={width * 0.30} y={height * 0.38} width={width * 0.70} height={height * 0.22}
        fill="url(#cort-ocean)" />

      {/* Sun reflection on water */}
      <ellipse cx={width * 0.35} cy={height * 0.44} rx={80} ry={30}
        fill={C.reflection} opacity={0.3 + sineWave(frame, 0.1) * 0.1} />

      {/* Detailed wave system */}
      {[0.39, 0.42, 0.45, 0.48, 0.51, 0.54, 0.57].map((wy, i) => (
        <g key={`wave-${i}`}>
          <path
            d={`M${width * 0.28},${height * wy + waveCycle * (i % 2 === 0 ? 1 : -1)}
              Q${width * 0.4},${height * wy - 4 + waveCycle2 * (i % 2 === 0 ? -1 : 1)}
              ${width * 0.55},${height * wy + waveCycle * (i % 2 === 0 ? 1 : -1) * 0.7}
              Q${width * 0.7},${height * wy + 3 - waveCycle * (i % 2 === 0 ? 1 : -1)}
              ${width * 0.85},${height * wy + waveCycle2 * (i % 2 === 0 ? 1 : -1)}
              Q${width * 0.95},${height * wy - 2 + waveCycle * 0.5}
              ${width},${height * wy + waveCycle * (i % 2 === 0 ? -1 : 1)}`}
            fill="none" stroke={C.oceanFoam} strokeWidth={i < 3 ? 0.8 : 1.2}
            opacity={0.15 + i * 0.05} />
        </g>
      ))}

      {/* Foam caps on waves */}
      {[[width * 0.5, height * 0.44], [width * 0.65, height * 0.46], [width * 0.8, height * 0.42],
        [width * 0.45, height * 0.50], [width * 0.72, height * 0.48]].map(([fx, fy], i) => (
        <ellipse key={`foam-${i}`} cx={fx + waveCycle * (i % 2 === 0 ? 2 : -2)}
          cy={fy + waveCycle2 * (i % 2 === 0 ? -1 : 1)}
          rx={12 + i * 3} ry={2} fill={C.waveWhite} opacity={0.3 + sineWave(frame, 0.15 + i * 0.02) * 0.15} />
      ))}

      {/* ============ BEACH ============ */}
      <path d={`M0,${height * 0.50} L${width * 0.38},${height * 0.50}
        Q${width * 0.42},${height * 0.52} ${width * 0.48},${height * 0.56}
        Q${width * 0.55},${height * 0.58} ${width * 0.65},${height * 0.59}
        L${width},${height * 0.60} L${width},${height} L0,${height} Z`}
        fill="url(#cort-sand)" />

      {/* Wet sand near waterline */}
      <path d={`M${width * 0.30},${height * 0.52}
        Q${width * 0.40},${height * 0.51} ${width * 0.48},${height * 0.56}
        Q${width * 0.55},${height * 0.58} ${width * 0.65},${height * 0.59}
        L${width},${height * 0.60} L${width},${height * 0.63}
        Q${width * 0.7},${height * 0.61} ${width * 0.5},${height * 0.59}
        L${width * 0.35},${height * 0.55} Z`}
        fill={C.sandWet} opacity={0.6} />

      {/* Boat tracks in wet sand */}
      {[[width * 0.55, width * 0.58], [width * 0.62, width * 0.65]].map(([x1, x2], i) => (
        <g key={`track-${i}`}>
          <line x1={x1} y1={height * 0.57 + i * 8} x2={x2} y2={height * 0.62 + i * 5}
            stroke={C.mudTrack} strokeWidth={4} opacity={0.2} strokeLinecap="round" />
          <line x1={x1 + 10} y1={height * 0.57 + i * 8} x2={x2 + 10} y2={height * 0.62 + i * 5}
            stroke={C.mudTrack} strokeWidth={4} opacity={0.15} strokeLinecap="round" />
        </g>
      ))}

      {/* Foam line at water edge */}
      <path d={`M${width * 0.32},${height * 0.52 + waveCycle}
        Q${width * 0.40},${height * 0.51 - waveCycle * 0.3}
        ${width * 0.50},${height * 0.56 + waveCycle * 0.5}
        Q${width * 0.58},${height * 0.58 - waveCycle * 0.4}
        ${width * 0.68},${height * 0.59 + waveCycle * 0.3}
        Q${width * 0.80},${height * 0.60 - waveCycle * 0.2}
        ${width},${height * 0.60 + waveCycle * 0.4}`}
        fill="none" stroke={C.waveWhite} strokeWidth={3} opacity={0.5} />
      <path d={`M${width * 0.33},${height * 0.525 + waveCycle * 0.8}
        Q${width * 0.41},${height * 0.515 - waveCycle * 0.2}
        ${width * 0.51},${height * 0.562 + waveCycle * 0.4}
        Q${width * 0.59},${height * 0.582 - waveCycle * 0.3}
        ${width * 0.69},${height * 0.592 + waveCycle * 0.2}
        Q${width * 0.81},${height * 0.602}
        ${width},${height * 0.602}`}
        fill="none" stroke={C.waveWhite} strokeWidth={1.5} opacity={0.3} />

      {/* Scattered shells and debris on beach */}
      {[[width * 0.42, height * 0.58], [width * 0.50, height * 0.62], [width * 0.56, height * 0.64],
        [width * 0.63, height * 0.66], [width * 0.70, height * 0.63], [width * 0.48, height * 0.68],
        [width * 0.75, height * 0.67], [width * 0.58, height * 0.70]].map(([sx, sy], i) => (
        <g key={`shell-${i}`}>
          <ellipse cx={sx} cy={sy} rx={2 + i % 3} ry={1 + i % 2} fill={C.shells}
            opacity={0.4} transform={`rotate(${i * 37}, ${sx}, ${sy})`} />
        </g>
      ))}

      {/* Footprints in sand */}
      {[[width * 0.52, height * 0.63], [width * 0.54, height * 0.65], [width * 0.56, height * 0.67],
        [width * 0.58, height * 0.69], [width * 0.60, height * 0.71]].map(([fpx, fpy], i) => (
        <g key={`foot-${i}`} opacity={0.15}>
          <ellipse cx={fpx} cy={fpy} rx={2} ry={3.5} fill={C.sandDark} />
          <ellipse cx={fpx + 4} cy={fpy + 1} rx={2} ry={3.5} fill={C.sandDark} />
        </g>
      ))}

      {/* ============ PALM TREES ============ */}
      <PalmTree x={width * 0.02} y={height * 0.49} height={140} lean={8} scale={1.1} />
      <PalmTree x={width * 0.08} y={height * 0.47} height={160} lean={-5} scale={1.2} />
      <PalmTree x={width * 0.16} y={height * 0.46} height={130} lean={12} scale={1.0} />
      <PalmTree x={width * 0.24} y={height * 0.47} height={150} lean={-8} scale={1.1} />
      <PalmTree x={width * 0.32} y={height * 0.49} height={120} lean={15} scale={0.9} />
      <PalmTree x={width * 0.38} y={height * 0.50} height={100} lean={-3} scale={0.8} />

      {/* ============ SPANISH SHIPS (3 in harbor) ============ */}

      {/* Ship 3 - small, distant */}
      <g transform={`translate(${width * 0.92}, ${height * 0.37 + shipRock2})`}>
        <path d="M-25,0 Q-28,-4 -20,-8 L20,-8 Q28,-4 25,0 Q0,5 -25,0 Z"
          fill={C.hullMid} stroke={C.outline} strokeWidth={1} />
        <line x1={0} y1={-8} x2={0} y2={-42} stroke={C.mast} strokeWidth={2} />
        <path d={`M-12,-38 Q0,${-34 + sailBillow * 0.4} 12,-38 L12,-18 Q0,${-15 + sailBillow * 0.2} -12,-18 Z`}
          fill={C.sailWhite} stroke={C.outline} strokeWidth={0.6} />
        <line x1={0} y1={-32} x2={0} y2={-22} stroke={C.crossRed} strokeWidth={1.5} />
        <line x1={-7} y1={-27} x2={7} y2={-27} stroke={C.crossRed} strokeWidth={1.5} />
      </g>

      {/* Ship 2 - medium */}
      <g transform={`translate(${width * 0.82}, ${height * 0.39 + shipRock * 0.8})`}>
        <path d="M-38,0 Q-42,-6 -32,-12 L32,-12 Q42,-6 38,0 Q0,7 -38,0 Z"
          fill={C.hullMid} stroke={C.outline} strokeWidth={1.5} />
        <path d="M-30,-12 L30,-12 L34,-6 Q0,-2 -34,-6 Z" fill={C.hullDark} opacity={0.4} />
        {/* Mast */}
        <line x1={0} y1={-12} x2={0} y2={-70} stroke={C.mast} strokeWidth={3} />
        {/* Rigging lines */}
        <line x1={-32} y1={-6} x2={0} y2={-65} stroke={C.ropeColor} strokeWidth={0.6} opacity={0.4} />
        <line x1={32} y1={-6} x2={0} y2={-65} stroke={C.ropeColor} strokeWidth={0.6} opacity={0.4} />
        {/* Sail */}
        <path d={`M-22,-64 Q0,${-58 + sailBillow * 0.6} 22,-64 L22,-30 Q0,${-26 + sailBillow * 0.3} -22,-30 Z`}
          fill={C.sailWhite} stroke={C.outline} strokeWidth={0.8} />
        <path d={`M22,-64 L22,-30 Q12,${-28 + sailBillow * 0.2} 5,-32 L5,-62 Z`}
          fill={C.sailShadow} opacity={0.3} />
        {/* Cross */}
        <line x1={0} y1={-58} x2={0} y2={-36} stroke={C.crossRed} strokeWidth={2.5} />
        <line x1={-12} y1={-47} x2={12} y2={-47} stroke={C.crossRed} strokeWidth={2.5} />
        {/* Flag */}
        <line x1={0} y1={-70} x2={0} y2={-80} stroke={C.mast} strokeWidth={1.5} />
        <path d={`M0,-80 L${14 + flagWave * 0.4},-77 L${flagWave * 0.2},-73`}
          fill={C.flagRed} stroke={C.outline} strokeWidth={0.5} />
      </g>

      {/* Ship 1 - large flagship, closest */}
      <g transform={`translate(${width * 0.68}, ${height * 0.43 + shipRock})`}>
        {/* Hull - detailed */}
        <path d="M-55,0 Q-60,-8 -48,-18 L48,-18 Q60,-8 55,0 Q0,10 -55,0 Z"
          fill={C.hullMid} stroke={C.outline} strokeWidth={2} />
        <path d="M-48,-18 L48,-18 L52,-10 Q0,-4 -52,-10 Z" fill={C.hullDark} opacity={0.4} />
        {/* Hull planking */}
        <line x1={-45} y1={-13} x2={45} y2={-13} stroke={C.hullDark} strokeWidth={0.6} opacity={0.3} />
        <line x1={-50} y1={-8} x2={50} y2={-8} stroke={C.hullDark} strokeWidth={0.6} opacity={0.25} />
        <line x1={-52} y1={-3} x2={52} y2={-3} stroke={C.hullDark} strokeWidth={0.6} opacity={0.2} />
        {/* Stern and bow details */}
        <path d="M-55,0 Q-58,-4 -55,-8" fill="none" stroke={C.hullDark} strokeWidth={2.5} />
        <path d="M55,0 Q60,-6 58,-12" fill="none" stroke={C.hullDark} strokeWidth={2.5} />
        {/* Cannon ports */}
        {[-30, -15, 0, 15, 30].map((cx, i) => (
          <g key={`cannon-${i}`}>
            <rect x={cx - 3} y={-8} width={6} height={4} fill={C.cannon} stroke={C.outline} strokeWidth={0.5} rx={0.5} />
          </g>
        ))}
        {/* Main mast */}
        <line x1={0} y1={-18} x2={0} y2={-100} stroke={C.mast} strokeWidth={4} strokeLinecap="round" />
        {/* Fore mast */}
        <line x1={-30} y1={-16} x2={-30} y2={-75} stroke={C.mast} strokeWidth={3} strokeLinecap="round" />
        {/* Rigging */}
        <line x1={-50} y1={-10} x2={0} y2={-95} stroke={C.ropeColor} strokeWidth={0.8} opacity={0.4} />
        <line x1={50} y1={-10} x2={0} y2={-95} stroke={C.ropeColor} strokeWidth={0.8} opacity={0.4} />
        <line x1={-50} y1={-10} x2={-30} y2={-70} stroke={C.ropeColor} strokeWidth={0.6} opacity={0.3} />
        <line x1={0} y1={-60} x2={-30} y2={-70} stroke={C.ropeColor} strokeWidth={0.6} opacity={0.3} />
        {/* Crow's nest */}
        <rect x={-5} y={-90} width={10} height={5} fill={C.deck} stroke={C.outline} strokeWidth={0.8} />
        {/* Main sail */}
        <path d={`M-28,-90 Q0,${-82 + sailBillow} 28,-90 L28,-42 Q0,${-36 + sailBillow * 0.5} -28,-42 Z`}
          fill={C.sailWhite} stroke={C.outline} strokeWidth={1} />
        <path d={`M28,-90 L28,-42 Q14,${-38 + sailBillow * 0.3} 5,-44 L5,-88 Z`}
          fill={C.sailShadow} opacity={0.25} />
        {/* Cross on main sail */}
        <line x1={0} y1={-82} x2={0} y2={-50} stroke={C.crossRed} strokeWidth={3.5} />
        <line x1={-18} y1={-66} x2={18} y2={-66} stroke={C.crossRed} strokeWidth={3.5} />
        {/* Fore sail */}
        <path d={`M-42,-68 Q-30,${-62 + sailBillow * 0.5} -18,-68 L-18,-38 Q-30,${-34 + sailBillow * 0.3} -42,-38 Z`}
          fill={C.sailWhite} stroke={C.outline} strokeWidth={0.8} />
        <line x1={-30} y1={-62} x2={-30} y2={-44} stroke={C.crossRed} strokeWidth={2} />
        <line x1={-38} y1={-53} x2={-22} y2={-53} stroke={C.crossRed} strokeWidth={2} />
        {/* Flag on main mast */}
        <line x1={0} y1={-100} x2={0} y2={-112} stroke={C.mast} strokeWidth={1.5} />
        <path d={`M0,-112 L${16 + flagWave},-108 L${flagWave * 0.5},-103`}
          fill={C.flagRed} stroke={C.outline} strokeWidth={0.5} />
        <path d={`M0,-109 L${12 + flagWave * 0.7},-107 L${flagWave * 0.3},-105`}
          fill={C.flagGold} opacity={0.6} />
      </g>

      {/* ============ LANDING BOATS ============ */}

      {/* Boat 1 - in water, approaching */}
      <LandingBoat x={width * 0.58} y={height * 0.52} scale={1.1} soldiers={5} inWater={true} />

      {/* Boat 2 - half beached */}
      <LandingBoat x={width * 0.48} y={height * 0.56} scale={1.0} soldiers={3} inWater={false} />

      {/* Boat 3 - beached, soldiers disembarking */}
      <g transform={`translate(${width * 0.52}, ${height * 0.58})`}>
        <path d="M-32,0 Q-36,-6 -26,-12 L26,-12 Q36,-6 32,0 Q0,8 -32,0 Z"
          fill={C.hullMid} stroke={C.outline} strokeWidth={1.5} />
        <line x1={-24} y1={-8} x2={24} y2={-8} stroke={C.hullDark} strokeWidth={0.5} opacity={0.4} />
      </g>

      {/* ============ SOLDIERS ON BEACH ============ */}

      {/* The jumping soldier - iconic moment */}
      <SpanishSoldier x={width * 0.51} y={height * 0.56} scale={1.4} type="jumping" />

      {/* Soldiers forming up on beach */}
      <SpanishSoldier x={width * 0.55} y={height * 0.62} scale={1.2} type="sword" />
      <SpanishSoldier x={width * 0.58} y={height * 0.63} scale={1.1} type="crossbow" />
      <SpanishSoldier x={width * 0.61} y={height * 0.64} scale={1.2} type="spear" />
      <SpanishSoldier x={width * 0.64} y={height * 0.63} scale={1.0} type="sword" flip />
      <SpanishSoldier x={width * 0.57} y={height * 0.66} scale={1.0} type="crossbow" />
      <SpanishSoldier x={width * 0.60} y={height * 0.67} scale={1.1} type="spear" />
      <SpanishSoldier x={width * 0.63} y={height * 0.68} scale={0.9} type="sword" />
      <SpanishSoldier x={width * 0.66} y={height * 0.66} scale={1.0} type="spear" flip />

      {/* ============ AZTEC WARRIORS ON SHORE (left/center) ============ */}

      {/* Front line warriors */}
      <AztecWarrior x={width * 0.30} y={height * 0.56} scale={1.4} type="chief" />
      <AztecWarrior x={width * 0.34} y={height * 0.58} scale={1.3} type="jaguar" />
      <AztecWarrior x={width * 0.37} y={height * 0.57} scale={1.3} type="eagle" />
      <AztecWarrior x={width * 0.40} y={height * 0.59} scale={1.2} type="shield" />
      <AztecWarrior x={width * 0.43} y={height * 0.58} scale={1.2} type="shield" flip />

      {/* Second row */}
      <AztecWarrior x={width * 0.28} y={height * 0.62} scale={1.1} type="shield" />
      <AztecWarrior x={width * 0.32} y={height * 0.63} scale={1.0} type="jaguar" flip />
      <AztecWarrior x={width * 0.35} y={height * 0.64} scale={1.1} type="eagle" />
      <AztecWarrior x={width * 0.38} y={height * 0.63} scale={1.0} type="shield" />
      <AztecWarrior x={width * 0.41} y={height * 0.64} scale={0.9} type="shield" flip />

      {/* Back rows (smaller = further away) */}
      <AztecWarrior x={width * 0.26} y={height * 0.55} scale={0.8} type="shield" />
      <AztecWarrior x={width * 0.29} y={height * 0.54} scale={0.7} type="eagle" />
      <AztecWarrior x={width * 0.33} y={height * 0.55} scale={0.8} type="jaguar" />
      <AztecWarrior x={width * 0.36} y={height * 0.54} scale={0.7} type="shield" flip />

      {/* ============ SUPPLIES & FLAG ON BEACH ============ */}

      {/* Spanish flag planted */}
      <g transform={`translate(${width * 0.62}, ${height * 0.60})`}>
        <line x1={0} y1={0} x2={0} y2={-55} stroke={C.mast} strokeWidth={3} strokeLinecap="round" />
        <path d={`M0,-55 L${22 + flagWave},-50 L${flagWave * 0.4},-43`}
          fill={C.flagRed} stroke={C.outline} strokeWidth={0.8} />
        <path d={`M0,-51 L${16 + flagWave * 0.7},-48 L${flagWave * 0.3},-46`}
          fill={C.flagGold} opacity={0.7} />
      </g>

      {/* Supply dump */}
      <SupplyCrate x={width * 0.67} y={height * 0.66} scale={1.2} type="box" />
      <SupplyCrate x={width * 0.69} y={height * 0.67} scale={1.0} type="barrel" />
      <SupplyCrate x={width * 0.72} y={height * 0.66} scale={0.9} type="box" />
      <SupplyCrate x={width * 0.71} y={height * 0.68} scale={1.1} type="sack" />
      <SupplyCrate x={width * 0.74} y={height * 0.67} scale={1.0} type="barrel" />
      <SupplyCrate x={width * 0.68} y={height * 0.69} scale={0.8} type="sack" />
      <SupplyCrate x={width * 0.76} y={height * 0.68} scale={1.1} type="box" />

      {/* Animated crowd layer */}
      <AztecCrowdLayer config={AZTEC_CROWD_CONFIGS.cortesLanding} />

      {/* ============ LIGHT BEAM (the decisive moment) ============ */}
      {/* Beam of golden light falling precisely on the beach meeting point */}
      <polygon points={`${width * 0.22},${height * 0.15} ${width * 0.38},${height * 0.55} ${width * 0.55},${height * 0.55}`}
        fill="url(#cort-light-beam)" opacity={0.6} />

      {/* ============ MIST LAYERS ============ */}
      <ellipse cx={width * 0.15 + mistDrift} cy={height * 0.42} rx={120} ry={15}
        fill={C.mist} opacity={0.3} />
      <ellipse cx={width * 0.45 + mistDrift * 0.6} cy={height * 0.48} rx={100} ry={12}
        fill={C.mist} opacity={0.2} />
      <ellipse cx={width * 0.75 - mistDrift * 0.4} cy={height * 0.44} rx={90} ry={10}
        fill={C.mist} opacity={0.15} />

      {/* ============ STONE TABLET BOARD ============ */}
      <g transform={`translate(${width / 2 - 200}, ${height * 0.78})`}>
        <rect x={-8} y={-8} width={416} height={156} rx={4} fill={C.boardFrame} stroke={C.outline} strokeWidth={2} />
        <rect x={0} y={0} width={400} height={140} fill={C.boardBg} />
        {/* Corner decorations */}
        <path d="M15,15 L25,5 L35,15 L25,25 Z" fill={C.flagGold} opacity={0.3} />
        <path d="M365,15 L375,5 L385,15 L375,25 Z" fill={C.flagGold} opacity={0.3} />
        <path d="M15,125 L25,115 L35,125 L25,135 Z" fill={C.flagGold} opacity={0.3} />
        <path d="M365,125 L375,115 L385,125 L375,135 Z" fill={C.flagGold} opacity={0.3} />
        {boardText && (
          <text x={200} y={80} textAnchor="middle" fill={C.chalk}
            fontSize={36} fontFamily="'Courier New', monospace" fontWeight="bold" opacity={0.9}>
            {boardText}
          </text>
        )}
      </g>
    </svg>
  );
};

export default CortesLanding;
