import React from 'react';
import { useCurrentFrame } from 'remotion';
import { sineWave } from '../animations/easing';
import { AztecCrowdLayer, AZTEC_CROWD_CONFIGS } from '../crowds/AztecCrowd';

// ---- Color palette: Monet-inspired morning light on Aztec floating gardens ----
const C = {
  // Sky
  skyTop: '#3B5998',
  skyMid: '#7B9FD4',
  skyBottom: '#E8C8A0',
  skyPink: '#E8A0A0',
  skyGold: '#F0D080',
  skyLavender: '#C8B0D8',
  cloudWhite: '#F8F0E8',
  cloudPink: '#F0D0C0',
  cloudGold: '#F0E0B0',
  cloudShadow: 'rgba(100,80,120,0.15)',

  // Mountains & Tenochtitlan
  mountainFar: '#6878A8',
  mountainMid: '#5A6888',
  mountainNear: '#4A5870',
  mountainSnow: '#D8E0F0',
  cityGold: '#D4A840',
  cityStone: '#A89878',
  cityWhite: '#E8E0D0',
  templePyramid: '#B8986A',
  templeRed: '#B85040',
  templeTop: '#D4A040',

  // Water
  waterDeep: '#2A5060',
  waterMid: '#3A7080',
  waterLight: '#4A9098',
  waterSurface: '#5AABB0',
  waterReflect: '#80C8D0',
  waterHighlight: 'rgba(200,230,240,0.4)',
  waterShadow: 'rgba(20,40,50,0.3)',
  waterGold: 'rgba(240,200,120,0.15)',
  waterRipple: 'rgba(255,255,255,0.12)',

  // Chinampa earth & structure
  earthDark: '#3A2A18',
  earthMid: '#5A4228',
  earthRich: '#6A5030',
  earthLight: '#8A6838',
  earthWet: '#4A3420',
  wickerwork: '#7A6040',
  wickerDark: '#5A4030',
  mudBank: '#6A5838',
  stakeWood: '#5A3820',

  // Crops - Corn (Maize)
  cornStalk: '#4A8A30',
  cornLeaf: '#5AA838',
  cornLeafDark: '#387828',
  cornSilk: '#F0E080',
  cornCob: '#E8C840',
  cornTassel: '#C8A040',

  // Crops - Squash
  squashGreen: '#4A7A30',
  squashOrange: '#D87830',
  squashYellow: '#E0A830',
  squashLeaf: '#3A6828',
  squashVine: '#508838',

  // Crops - Flowers (Marigold / Cempasuchil)
  marigoldYellow: '#F0C020',
  marigoldOrange: '#E89020',
  marigoldDeep: '#D07018',
  marigoldPetal: '#F8D040',
  flowerPurple: '#8040A0',
  flowerWhite: '#F0E8E0',
  flowerPink: '#D080A0',

  // Crops - Tomatoes & Chili
  tomatoRed: '#C83028',
  tomatoGreen: '#5A8830',
  tomatoDark: '#A02820',
  chiliRed: '#D03020',
  chiliGreen: '#488028',
  chiliDark: '#A02018',

  // Trees (Ahuejote willows)
  willowTrunk: '#5A4838',
  willowTrunkDark: '#3A2828',
  willowTrunkLight: '#7A6848',
  willowBark: '#4A3828',
  willowLeaf: '#4A8838',
  willowLeafLight: '#68A848',
  willowLeafDark: '#387028',
  willowDroop: '#58A040',

  // Canoe
  canoeWood: '#6A4828',
  canoeDark: '#4A3018',
  canoeLight: '#8A6838',
  canoeInside: '#5A3820',
  paddle: '#7A5830',
  paddleBlade: '#6A4828',

  // Reeds & lilies
  reedGreen: '#4A7838',
  reedDark: '#387028',
  reedLight: '#68A850',
  reedTip: '#7A9860',
  lilyPadGreen: '#3A7038',
  lilyPadLight: '#4A8848',
  lilyPadDark: '#2A5828',
  lilyFlower: '#F0D0E0',
  lilyFlowerPink: '#E0A0B0',
  lilyCenter: '#F0E080',

  // Birds
  heronWhite: '#E8E4D8',
  heronGray: '#A0A098',
  heronBeak: '#D0A040',
  heronLeg: '#808070',
  duckBrown: '#7A5A38',
  duckGreen: '#2A6838',
  duckBeak: '#D09030',

  // Atmosphere
  mistWhite: 'rgba(230,235,240,0.12)',
  mistGold: 'rgba(240,210,160,0.08)',
  mistBlue: 'rgba(140,180,210,0.06)',
  morningGlow: 'rgba(255,200,140,0.1)',
  atmosphereHaze: 'rgba(180,190,210,0.08)',

  // Stone tablet
  stoneTablet: '#8A7A6A',
  stoneTabletDark: '#6A5A4A',
  stoneTabletLight: '#A89A8A',
  stoneFrame: '#5A4A3A',
  glyphColor: '#4A3A2A',
  chalkText: '#F0E8D8',

  // Canvas texture
  canvasOverlay: 'rgba(200,190,170,0.04)',

  // General
  outline: '#1A1A1A',
  shadow: 'rgba(0,0,0,0.15)',
};

// ---- Interface ----
interface ChinampasProps {
  boardText?: string;
  width?: number;
  height?: number;
}

// =============================================================================
// SUB-COMPONENT: WillowTree (Ahuejote)
// Aztec willows with drooping branches that sway gently in morning breeze
// =============================================================================
const WillowTree: React.FC<{
  x: number;
  y: number;
  scale?: number;
  seed?: number;
  trunkHeight?: number;
}> = ({ x, y, scale = 1, seed = 0, trunkHeight = 180 }) => {
  const frame = useCurrentFrame();
  const sway = sineWave(frame, 0.08, seed) * 3;
  const breeze = sineWave(frame, 0.12, seed + 1.5) * 2;
  const leafSway1 = sineWave(frame, 0.15, seed + 0.3) * 4;
  const leafSway2 = sineWave(frame, 0.1, seed + 0.7) * 3;
  const leafSway3 = sineWave(frame, 0.13, seed + 1.1) * 5;

  const th = trunkHeight;
  const crownSpread = th * 0.7;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Shadow on water */}
      <ellipse
        cx={15}
        cy={8}
        rx={crownSpread * 0.5}
        ry={12}
        fill={C.shadow}
        opacity={0.3}
      />

      {/* Main trunk */}
      <path
        d={`M0,0 Q${sway * 0.5},-${th * 0.4} ${sway},-${th}`}
        fill="none"
        stroke={C.willowTrunkDark}
        strokeWidth={14}
        strokeLinecap="round"
      />
      <path
        d={`M0,0 Q${sway * 0.5},-${th * 0.4} ${sway},-${th}`}
        fill="none"
        stroke={C.willowTrunk}
        strokeWidth={10}
        strokeLinecap="round"
      />
      {/* Bark texture lines */}
      {[0.15, 0.3, 0.45, 0.6, 0.75, 0.88].map((r, i) => {
        const tx = sway * r * 0.5;
        const ty = -th * r;
        return (
          <line
            key={`bark-${i}`}
            x1={tx - 4}
            y1={ty - 3}
            x2={tx + 4}
            y2={ty + 3}
            stroke={C.willowBark}
            strokeWidth={1}
            opacity={0.3}
          />
        );
      })}
      {/* Secondary trunk branch going left */}
      <path
        d={`M${sway * 0.6},-${th * 0.65} Q${sway - 30},-${th * 0.8} ${sway - 50 + breeze},-${th * 0.7}`}
        fill="none"
        stroke={C.willowTrunk}
        strokeWidth={5}
        strokeLinecap="round"
      />
      {/* Secondary trunk branch going right */}
      <path
        d={`M${sway * 0.7},-${th * 0.7} Q${sway + 25},-${th * 0.85} ${sway + 45 + breeze},-${th * 0.75}`}
        fill="none"
        stroke={C.willowTrunk}
        strokeWidth={4}
        strokeLinecap="round"
      />

      {/* Crown foliage mass (background layer) */}
      <ellipse
        cx={sway}
        cy={-th - 10}
        rx={crownSpread * 0.55}
        ry={th * 0.3}
        fill={C.willowLeafDark}
        opacity={0.6}
      />

      {/* Drooping willow branches - left side */}
      {[-60, -45, -30, -18].map((offsetX, i) => {
        const branchSway = leafSway1 * (0.5 + i * 0.15);
        const startX = sway + offsetX;
        const startY = -th + 10 - i * 8;
        const endX = startX + offsetX * 0.8 + branchSway;
        const endY = startY + th * 0.55 + i * 10;
        return (
          <g key={`lbranch-${i}`}>
            <path
              d={`M${startX},${startY} Q${startX + offsetX * 0.4 + branchSway * 0.5},${startY + (endY - startY) * 0.5} ${endX},${endY}`}
              fill="none"
              stroke={C.willowLeafDark}
              strokeWidth={2}
              opacity={0.4}
            />
            <path
              d={`M${startX},${startY} Q${startX + offsetX * 0.3 + branchSway * 0.6},${startY + (endY - startY) * 0.4} ${endX + 3},${endY - 5}`}
              fill="none"
              stroke={C.willowLeaf}
              strokeWidth={3.5}
              strokeLinecap="round"
              opacity={0.7}
            />
            {/* Leaf clusters along branch */}
            {[0.3, 0.5, 0.7, 0.9].map((t, j) => {
              const lx = startX + (endX - startX) * t + branchSway * t * 0.3;
              const ly = startY + (endY - startY) * t;
              return (
                <ellipse
                  key={`lleaf-${i}-${j}`}
                  cx={lx}
                  cy={ly}
                  rx={6 + j}
                  ry={3}
                  fill={j % 2 === 0 ? C.willowLeaf : C.willowLeafLight}
                  opacity={0.6 + j * 0.05}
                  transform={`rotate(${offsetX * 0.5 + branchSway * 2}, ${lx}, ${ly})`}
                />
              );
            })}
          </g>
        );
      })}

      {/* Drooping willow branches - right side */}
      {[18, 30, 45, 55].map((offsetX, i) => {
        const branchSway = leafSway2 * (0.5 + i * 0.12);
        const startX = sway + offsetX;
        const startY = -th + 5 - i * 6;
        const endX = startX + offsetX * 0.75 + branchSway;
        const endY = startY + th * 0.5 + i * 12;
        return (
          <g key={`rbranch-${i}`}>
            <path
              d={`M${startX},${startY} Q${startX + offsetX * 0.35 + branchSway * 0.4},${startY + (endY - startY) * 0.5} ${endX},${endY}`}
              fill="none"
              stroke={C.willowLeaf}
              strokeWidth={3}
              strokeLinecap="round"
              opacity={0.65}
            />
            {[0.25, 0.5, 0.75, 0.95].map((t, j) => {
              const lx = startX + (endX - startX) * t + branchSway * t * 0.2;
              const ly = startY + (endY - startY) * t;
              return (
                <ellipse
                  key={`rleaf-${i}-${j}`}
                  cx={lx}
                  cy={ly}
                  rx={5 + j}
                  ry={3}
                  fill={j % 2 === 0 ? C.willowLeafLight : C.willowDroop}
                  opacity={0.55 + j * 0.06}
                  transform={`rotate(${-offsetX * 0.4 + branchSway * 1.5}, ${lx}, ${ly})`}
                />
              );
            })}
          </g>
        );
      })}

      {/* Front drooping branches (foreground, more opaque) */}
      {[-35, 0, 25].map((offsetX, i) => {
        const branchSway = leafSway3 * (0.6 + i * 0.1);
        const startX = sway + offsetX;
        const startY = -th - 5;
        const endX = startX + offsetX * 0.9 + branchSway;
        const endY = startY + th * 0.65;
        return (
          <path
            key={`fbranch-${i}`}
            d={`M${startX},${startY} C${startX + offsetX * 0.3},${startY + 40} ${endX - branchSway * 0.5},${endY - 30} ${endX},${endY}`}
            fill="none"
            stroke={C.willowLeafLight}
            strokeWidth={2.5}
            strokeLinecap="round"
            opacity={0.5}
          />
        );
      })}

      {/* Top crown highlight */}
      <ellipse
        cx={sway + 5}
        cy={-th - 15}
        rx={crownSpread * 0.3}
        ry={th * 0.15}
        fill={C.willowLeafLight}
        opacity={0.3}
      />
    </g>
  );
};

// =============================================================================
// SUB-COMPONENT: ChinampaPlot
// A rectangular floating garden bed with wicker edges and varied crops
// =============================================================================
const ChinampaPlot: React.FC<{
  x: number;
  y: number;
  plotWidth: number;
  plotHeight: number;
  cropType: 'corn' | 'squash' | 'marigold' | 'tomato' | 'chili' | 'mixed';
  seed?: number;
}> = ({ x, y, plotWidth, plotHeight, cropType, seed = 0 }) => {
  const frame = useCurrentFrame();
  const cropSway = sineWave(frame, 0.1, seed) * 2;
  const growPulse = sineWave(frame, 0.06, seed + 2) * 0.5;

  const renderCorn = (cx: number, cy: number, idx: number) => {
    const stalkSway = sineWave(frame, 0.09, seed + idx * 0.3) * 3;
    const stalkH = 35 + idx * 3;
    return (
      <g key={`corn-${idx}`} transform={`translate(${cx}, ${cy})`}>
        {/* Stalk */}
        <line
          x1={0}
          y1={0}
          x2={stalkSway}
          y2={-stalkH}
          stroke={C.cornStalk}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        {/* Leaves */}
        <path
          d={`M${stalkSway * 0.3},-${stalkH * 0.4} Q${-12 + stalkSway * 0.5},-${stalkH * 0.5} ${-15 + stalkSway * 0.6},-${stalkH * 0.35}`}
          fill="none"
          stroke={C.cornLeaf}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <path
          d={`M${stalkSway * 0.5},-${stalkH * 0.6} Q${10 + stalkSway * 0.4},-${stalkH * 0.7} ${14 + stalkSway * 0.3},-${stalkH * 0.55}`}
          fill="none"
          stroke={C.cornLeafDark}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <path
          d={`M${stalkSway * 0.7},-${stalkH * 0.75} Q${-8 + stalkSway * 0.6},-${stalkH * 0.85} ${-11 + stalkSway * 0.7},-${stalkH * 0.7}`}
          fill="none"
          stroke={C.cornLeaf}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        {/* Corn cob */}
        <ellipse
          cx={stalkSway * 0.5 + 3}
          cy={-stalkH * 0.5}
          rx={3}
          ry={6}
          fill={C.cornCob}
          stroke={C.cornStalk}
          strokeWidth={0.5}
        />
        {/* Tassel top */}
        <path
          d={`M${stalkSway},-${stalkH} L${stalkSway - 4},-${stalkH + 6} M${stalkSway},-${stalkH} L${stalkSway + 3},-${stalkH + 5} M${stalkSway},-${stalkH} L${stalkSway},-${stalkH + 7}`}
          fill="none"
          stroke={C.cornTassel}
          strokeWidth={1}
        />
      </g>
    );
  };

  const renderSquash = (cx: number, cy: number, idx: number) => {
    const leafWiggle = sineWave(frame, 0.11, seed + idx * 0.5) * 2;
    return (
      <g key={`squash-${idx}`} transform={`translate(${cx}, ${cy})`}>
        {/* Large leaf */}
        <ellipse
          cx={leafWiggle}
          cy={-6}
          rx={10}
          ry={7}
          fill={C.squashLeaf}
          opacity={0.8}
          transform={`rotate(${leafWiggle * 3}, ${leafWiggle}, -6)`}
        />
        <ellipse
          cx={leafWiggle + 8}
          cy={-4}
          rx={8}
          ry={6}
          fill={C.squashGreen}
          opacity={0.7}
          transform={`rotate(${-leafWiggle * 2}, ${leafWiggle + 8}, -4)`}
        />
        {/* Vine */}
        <path
          d={`M${leafWiggle - 5},-5 Q${leafWiggle - 15},-8 ${leafWiggle - 18},-3`}
          fill="none"
          stroke={C.squashVine}
          strokeWidth={1.5}
        />
        {/* Squash fruit */}
        {idx % 2 === 0 ? (
          <ellipse cx={5} cy={-2} rx={6} ry={4} fill={C.squashOrange} stroke={C.earthDark} strokeWidth={0.5} />
        ) : (
          <ellipse cx={-3} cy={-2} rx={5} ry={3.5} fill={C.squashYellow} stroke={C.earthDark} strokeWidth={0.5} />
        )}
      </g>
    );
  };

  const renderMarigold = (cx: number, cy: number, idx: number) => {
    const flowerSway = sineWave(frame, 0.14, seed + idx * 0.4) * 2;
    const petalPulse = 1 + sineWave(frame, 0.08, seed + idx) * 0.05;
    return (
      <g key={`marigold-${idx}`} transform={`translate(${cx}, ${cy})`}>
        {/* Stem */}
        <line
          x1={0}
          y1={0}
          x2={flowerSway}
          y2={-18}
          stroke={C.cornStalk}
          strokeWidth={1.5}
        />
        {/* Leaves */}
        <path
          d={`M${flowerSway * 0.3},-8 Q${-6},-10 ${-8},-6`}
          fill={C.squashGreen}
          opacity={0.7}
        />
        {/* Flower head */}
        <g transform={`translate(${flowerSway}, -18) scale(${petalPulse})`}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, pi) => (
            <ellipse
              key={`petal-${pi}`}
              cx={0}
              cy={-4}
              rx={2.5}
              ry={4}
              fill={pi % 2 === 0 ? C.marigoldYellow : C.marigoldOrange}
              transform={`rotate(${angle}, 0, 0)`}
              opacity={0.85}
            />
          ))}
          <circle cx={0} cy={0} r={2.5} fill={C.marigoldDeep} />
        </g>
      </g>
    );
  };

  const renderTomato = (cx: number, cy: number, idx: number) => {
    const leafWave = sineWave(frame, 0.1, seed + idx * 0.6) * 1.5;
    return (
      <g key={`tomato-${idx}`} transform={`translate(${cx}, ${cy})`}>
        {/* Support stake */}
        <line x1={0} y1={2} x2={0} y2={-22} stroke={C.stakeWood} strokeWidth={1.5} />
        {/* Vine */}
        <path
          d={`M0,-5 Q${5 + leafWave},-10 ${3 + leafWave},-18`}
          fill="none"
          stroke={C.tomatoGreen}
          strokeWidth={1.5}
        />
        {/* Leaves */}
        <ellipse cx={6 + leafWave} cy={-12} rx={6} ry={3.5} fill={C.tomatoGreen} opacity={0.7}
          transform={`rotate(${15 + leafWave * 3}, ${6 + leafWave}, -12)`} />
        <ellipse cx={-4 + leafWave * 0.5} cy={-16} rx={5} ry={3} fill={C.squashGreen} opacity={0.6}
          transform={`rotate(${-20 + leafWave * 2}, ${-4}, -16)`} />
        {/* Tomato fruits */}
        <circle cx={4 + leafWave * 0.3} cy={-8} r={3.5} fill={C.tomatoRed} stroke={C.tomatoDark} strokeWidth={0.5} />
        {idx % 3 === 0 && <circle cx={-2} cy={-5} r={2.8} fill={C.tomatoRed} stroke={C.tomatoDark} strokeWidth={0.5} />}
        {idx % 2 === 0 && <circle cx={6} cy={-15} r={2} fill={C.tomatoGreen} stroke={C.squashGreen} strokeWidth={0.4} />}
      </g>
    );
  };

  const renderChili = (cx: number, cy: number, idx: number) => {
    const chiliSway = sineWave(frame, 0.12, seed + idx * 0.35) * 2;
    return (
      <g key={`chili-${idx}`} transform={`translate(${cx}, ${cy})`}>
        {/* Stem */}
        <line x1={0} y1={0} x2={chiliSway * 0.5} y2={-16} stroke={C.chiliGreen} strokeWidth={1.5} />
        {/* Leaves */}
        <path d={`M${chiliSway * 0.2},-8 Q${-7},-10 ${-9},-6`} fill={C.chiliGreen} opacity={0.65} />
        <path d={`M${chiliSway * 0.4},-12 Q${6},-15 ${8},-10`} fill={C.squashGreen} opacity={0.6} />
        {/* Chili peppers hanging */}
        <path
          d={`M${chiliSway * 0.5 + 2},-14 Q${chiliSway * 0.5 + 6},-10 ${chiliSway * 0.5 + 4},-5`}
          fill="none"
          stroke={idx % 2 === 0 ? C.chiliRed : C.chiliGreen}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        {idx % 3 === 0 && (
          <path
            d={`M${chiliSway * 0.5 - 3},-12 Q${chiliSway * 0.5 - 6},-8 ${chiliSway * 0.5 - 5},-4`}
            fill="none"
            stroke={C.chiliRed}
            strokeWidth={2}
            strokeLinecap="round"
          />
        )}
      </g>
    );
  };

  // Generate crop positions based on plot size
  const cropCount = Math.floor(plotWidth / 16);
  const rowCount = Math.floor(plotHeight / 18);

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Wicker edge / retaining wall */}
      <rect
        x={-2}
        y={-2}
        width={plotWidth + 4}
        height={plotHeight + 4}
        rx={3}
        fill={C.wickerwork}
        stroke={C.wickerDark}
        strokeWidth={1.5}
        opacity={0.8}
      />
      {/* Wicker texture lines */}
      {Array.from({ length: Math.floor(plotHeight / 6) }, (_, i) => (
        <line
          key={`wicker-h-${i}`}
          x1={0}
          y1={i * 6}
          x2={plotWidth}
          y2={i * 6}
          stroke={C.wickerDark}
          strokeWidth={0.5}
          opacity={0.2}
        />
      ))}

      {/* Rich earth fill */}
      <rect
        x={2}
        y={2}
        width={plotWidth - 4}
        height={plotHeight - 4}
        rx={1}
        fill={C.earthRich}
      />
      {/* Soil texture - dark patches that shift subtly */}
      <rect x={8 + cropSway * 0.2} y={5} width={plotWidth * 0.3} height={plotHeight * 0.4} fill={C.earthDark} opacity={0.2} rx={2} />
      <rect x={plotWidth * 0.5} y={plotHeight * 0.3} width={plotWidth * 0.35} height={plotHeight * 0.5} fill={C.earthWet} opacity={0.15} rx={2} />

      {/* Moisture line at edges */}
      <rect x={2} y={plotHeight - 5} width={plotWidth - 4} height={3} fill={C.earthWet} opacity={0.4 + growPulse * 0.05} rx={1} />
      <rect x={2} y={2} width={plotWidth - 4} height={2} fill={C.earthWet} opacity={0.3} rx={1} />

      {/* Crops */}
      {Array.from({ length: rowCount }, (_, row) =>
        Array.from({ length: cropCount }, (_, col) => {
          const cx = 8 + col * (plotWidth / cropCount);
          const cy = 8 + row * (plotHeight / rowCount);
          const idx = row * cropCount + col;

          switch (cropType) {
            case 'corn':
              return renderCorn(cx, cy, idx);
            case 'squash':
              return renderSquash(cx, cy, idx);
            case 'marigold':
              return renderMarigold(cx, cy, idx);
            case 'tomato':
              return renderTomato(cx, cy, idx);
            case 'chili':
              return renderChili(cx, cy, idx);
            case 'mixed':
              if (idx % 5 === 0) return renderMarigold(cx, cy, idx);
              if (idx % 5 === 1) return renderCorn(cx, cy, idx);
              if (idx % 5 === 2) return renderSquash(cx, cy, idx);
              if (idx % 5 === 3) return renderTomato(cx, cy, idx);
              return renderChili(cx, cy, idx);
            default:
              return renderCorn(cx, cy, idx);
          }
        })
      )}
    </g>
  );
};

// =============================================================================
// SUB-COMPONENT: Canoe
// Wooden dugout canoe with optional produce load
// =============================================================================
const Canoe: React.FC<{
  x: number;
  y: number;
  scale?: number;
  seed?: number;
  flip?: boolean;
  loaded?: boolean;
}> = ({ x, y, scale = 1, seed = 0, flip = false, loaded = true }) => {
  const frame = useCurrentFrame();
  const bob = sineWave(frame, 0.12, seed) * 2;
  const rock = sineWave(frame, 0.09, seed + 0.5) * 1.5;
  const fDir = flip ? -1 : 1;

  return (
    <g transform={`translate(${x}, ${y + bob}) scale(${scale * fDir}, ${scale}) rotate(${rock})`}>
      {/* Water shadow/reflection */}
      <ellipse cx={0} cy={6} rx={40} ry={4} fill={C.waterShadow} opacity={0.3} />

      {/* Canoe hull */}
      <path
        d="M-40,0 Q-45,-6 -35,-8 L35,-8 Q45,-6 40,0 Q35,5 -35,5 Q-45,3 -40,0 Z"
        fill={C.canoeWood}
        stroke={C.canoeDark}
        strokeWidth={1.5}
      />
      {/* Hull wood grain */}
      <path d="M-30,-5 Q0,-7 30,-5" fill="none" stroke={C.canoeLight} strokeWidth={0.8} opacity={0.4} />
      <path d="M-28,-2 Q0,-4 28,-2" fill="none" stroke={C.canoeLight} strokeWidth={0.6} opacity={0.3} />
      {/* Inside shadow */}
      <path
        d="M-30,-4 Q0,-6 30,-4 Q25,1 -25,1 Z"
        fill={C.canoeInside}
        opacity={0.5}
      />

      {/* Loaded goods */}
      {loaded && (
        <g>
          {/* Baskets of produce */}
          <ellipse cx={-12} cy={-8} rx={7} ry={5} fill={C.wickerwork} stroke={C.wickerDark} strokeWidth={0.8} />
          <ellipse cx={-12} cy={-10} rx={5} ry={3} fill={C.cornCob} opacity={0.8} />
          <circle cx={-14} cy={-11} r={2} fill={C.tomatoRed} />
          <circle cx={-10} cy={-11.5} r={1.5} fill={C.marigoldYellow} />

          <ellipse cx={8} cy={-7} rx={6} ry={4.5} fill={C.wickerwork} stroke={C.wickerDark} strokeWidth={0.8} />
          <ellipse cx={8} cy={-9} rx={4} ry={2.5} fill={C.squashGreen} opacity={0.7} />
          <ellipse cx={10} cy={-9.5} rx={3} ry={2} fill={C.squashOrange} opacity={0.8} />

          {/* Marigold flowers piled */}
          {[0, 3, -3, 1.5, -1.5].map((ox, i) => (
            <circle key={`flwr-${i}`} cx={-2 + ox} cy={-10 - i * 0.5} r={2} fill={i % 2 === 0 ? C.marigoldYellow : C.marigoldOrange} opacity={0.8} />
          ))}
        </g>
      )}

      {/* Paddle */}
      <g transform={`translate(25, -6)`}>
        <line x1={0} y1={-15} x2={5} y2={10} stroke={C.paddle} strokeWidth={2} strokeLinecap="round" />
        <ellipse cx={5.5} cy={12} rx={3} ry={6} fill={C.paddleBlade} stroke={C.canoeDark} strokeWidth={0.5} />
      </g>
    </g>
  );
};

// =============================================================================
// SUB-COMPONENT: CropRow
// Dense row of crops rendered along a line for foreground detail
// =============================================================================
const CropRow: React.FC<{
  x: number;
  y: number;
  length: number;
  cropType: 'corn' | 'marigold' | 'mixed';
  seed?: number;
  density?: number;
}> = ({ x, y, length, cropType, seed = 0, density = 12 }) => {
  const frame = useCurrentFrame();

  return (
    <g transform={`translate(${x}, ${y})`}>
      {Array.from({ length: density }, (_, i) => {
        const cx = (i / density) * length;
        const sway = sineWave(frame, 0.1, seed + i * 0.2) * 2;
        const h = 25 + sineWave(frame, 0.03, seed + i) * 2;

        if (cropType === 'corn' || (cropType === 'mixed' && i % 2 === 0)) {
          return (
            <g key={`crow-${i}`} transform={`translate(${cx}, 0)`}>
              <line x1={0} y1={0} x2={sway} y2={-h} stroke={C.cornStalk} strokeWidth={2} strokeLinecap="round" />
              <path
                d={`M${sway * 0.4},-${h * 0.5} Q${-8 + sway * 0.3},-${h * 0.6} ${-10 + sway * 0.4},-${h * 0.45}`}
                fill="none"
                stroke={C.cornLeaf}
                strokeWidth={1.5}
              />
              <path
                d={`M${sway * 0.6},-${h * 0.7} Q${6 + sway * 0.3},-${h * 0.8} ${8 + sway * 0.2},-${h * 0.65}`}
                fill="none"
                stroke={C.cornLeafDark}
                strokeWidth={1.5}
              />
              {i % 3 === 0 && (
                <ellipse cx={sway * 0.4 + 2} cy={-h * 0.45} rx={2} ry={4} fill={C.cornCob} opacity={0.7} />
              )}
            </g>
          );
        }

        // Marigold
        const petalScale = 1 + sineWave(frame, 0.07, seed + i * 0.5) * 0.04;
        return (
          <g key={`crow-${i}`} transform={`translate(${cx}, 0)`}>
            <line x1={0} y1={0} x2={sway * 0.7} y2={-14} stroke={C.cornStalk} strokeWidth={1.2} />
            <g transform={`translate(${sway * 0.7}, -14) scale(${petalScale})`}>
              {[0, 60, 120, 180, 240, 300].map((a, pi) => (
                <ellipse key={`p-${pi}`} cx={0} cy={-3} rx={2} ry={3} fill={pi % 2 === 0 ? C.marigoldYellow : C.marigoldOrange}
                  transform={`rotate(${a}, 0, 0)`} opacity={0.8} />
              ))}
              <circle cx={0} cy={0} r={2} fill={C.marigoldDeep} />
            </g>
          </g>
        );
      })}
    </g>
  );
};

// =============================================================================
// SUB-COMPONENT: WaterLily
// Floating lily pad with optional flower
// =============================================================================
const WaterLily: React.FC<{
  x: number;
  y: number;
  scale?: number;
  seed?: number;
  hasFlower?: boolean;
}> = ({ x, y, scale = 1, seed = 0, hasFlower = false }) => {
  const frame = useCurrentFrame();
  const drift = sineWave(frame, 0.06, seed) * 3;
  const bob = sineWave(frame, 0.1, seed + 1) * 1;
  const padRotate = sineWave(frame, 0.04, seed + 2) * 5;

  return (
    <g transform={`translate(${x + drift}, ${y + bob}) scale(${scale})`}>
      {/* Water ripple around pad */}
      <ellipse cx={0} cy={2} rx={16} ry={5} fill="none" stroke={C.waterRipple} strokeWidth={1} opacity={0.4} />

      {/* Lily pad */}
      <g transform={`rotate(${padRotate})`}>
        <ellipse cx={0} cy={0} rx={12} ry={8} fill={C.lilyPadGreen} />
        <ellipse cx={-2} cy={-1} rx={10} ry={6.5} fill={C.lilyPadLight} opacity={0.5} />
        {/* Pad notch */}
        <path d="M0,0 L3,-8 L-3,-8 Z" fill={C.waterMid} />
        {/* Vein lines */}
        <line x1={0} y1={0} x2={-8} y2={-4} stroke={C.lilyPadDark} strokeWidth={0.5} opacity={0.4} />
        <line x1={0} y1={0} x2={8} y2={-3} stroke={C.lilyPadDark} strokeWidth={0.5} opacity={0.4} />
        <line x1={0} y1={0} x2={-5} y2={5} stroke={C.lilyPadDark} strokeWidth={0.5} opacity={0.4} />
        <line x1={0} y1={0} x2={6} y2={4} stroke={C.lilyPadDark} strokeWidth={0.5} opacity={0.4} />
      </g>

      {/* Flower */}
      {hasFlower && (
        <g transform={`translate(2, -8)`}>
          {/* Outer petals */}
          {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((angle, i) => (
            <ellipse
              key={`lp-${i}`}
              cx={0}
              cy={-4}
              rx={2.5}
              ry={5}
              fill={i % 3 === 0 ? C.lilyFlower : C.lilyFlowerPink}
              opacity={0.85}
              transform={`rotate(${angle}, 0, 0)`}
            />
          ))}
          {/* Inner petals */}
          {[20, 70, 120, 170, 220, 270, 320].map((angle, i) => (
            <ellipse
              key={`lip-${i}`}
              cx={0}
              cy={-2.5}
              rx={1.5}
              ry={3.5}
              fill={C.lilyFlower}
              opacity={0.9}
              transform={`rotate(${angle}, 0, 0)`}
            />
          ))}
          {/* Center */}
          <circle cx={0} cy={0} r={2.5} fill={C.lilyCenter} />
          <circle cx={0.5} cy={-0.5} r={1} fill="#F8E8A0" opacity={0.7} />
        </g>
      )}
    </g>
  );
};

// =============================================================================
// SUB-COMPONENT: ReedCluster
// Cluster of reeds/cattails growing at water's edge
// =============================================================================
const ReedCluster: React.FC<{
  x: number;
  y: number;
  count?: number;
  maxHeight?: number;
  seed?: number;
}> = ({ x, y, count = 7, maxHeight = 60, seed = 0 }) => {
  const frame = useCurrentFrame();

  return (
    <g transform={`translate(${x}, ${y})`}>
      {Array.from({ length: count }, (_, i) => {
        const reedSway = sineWave(frame, 0.1 + i * 0.01, seed + i * 0.5) * 3;
        const h = maxHeight * (0.5 + (i % 3) * 0.2);
        const xOff = (i - count / 2) * 5;
        const hasCattail = i % 2 === 0;

        return (
          <g key={`reed-${i}`}>
            {/* Reed stem */}
            <path
              d={`M${xOff},0 Q${xOff + reedSway * 0.5},-${h * 0.5} ${xOff + reedSway},-${h}`}
              fill="none"
              stroke={C.reedGreen}
              strokeWidth={2}
              strokeLinecap="round"
            />
            {/* Leaf blade */}
            <path
              d={`M${xOff + reedSway * 0.3},-${h * 0.4}
                Q${xOff + reedSway * 0.3 + (i % 2 === 0 ? -12 : 10)},-${h * 0.5}
                ${xOff + reedSway * 0.3 + (i % 2 === 0 ? -15 : 13)},-${h * 0.35}`}
              fill="none"
              stroke={C.reedLight}
              strokeWidth={1.5}
              strokeLinecap="round"
              opacity={0.7}
            />
            {/* Cattail top */}
            {hasCattail && (
              <ellipse
                cx={xOff + reedSway}
                cy={-h - 4}
                rx={2.5}
                ry={7}
                fill={C.earthMid}
                stroke={C.earthDark}
                strokeWidth={0.5}
              />
            )}
            {/* Thin leaf tip */}
            {!hasCattail && (
              <line
                x1={xOff + reedSway}
                y1={-h}
                x2={xOff + reedSway + 2}
                y2={-h - 8}
                stroke={C.reedTip}
                strokeWidth={1}
                strokeLinecap="round"
                opacity={0.6}
              />
            )}
          </g>
        );
      })}
    </g>
  );
};

// =============================================================================
// SUB-COMPONENT: Heron
// Standing heron in the shallows
// =============================================================================
const Heron: React.FC<{
  x: number;
  y: number;
  scale?: number;
  seed?: number;
  flip?: boolean;
}> = ({ x, y, scale = 1, seed = 0, flip = false }) => {
  const frame = useCurrentFrame();
  const headBob = sineWave(frame, 0.06, seed) * 2;
  const neckShift = sineWave(frame, 0.04, seed + 1) * 1.5;
  const legShift = sineWave(frame, 0.03, seed + 2) * 0.5;
  const fDir = flip ? -1 : 1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * fDir}, ${scale})`}>
      {/* Shadow on water */}
      <ellipse cx={0} cy={3} rx={15} ry={4} fill={C.shadow} opacity={0.2} />

      {/* Back leg */}
      <line x1={-2} y1={-2} x2={-4 + legShift} y2={-30} stroke={C.heronLeg} strokeWidth={1.5} />
      <line x1={-4 + legShift} y1={-30} x2={-4 + legShift} y2={-28} stroke={C.heronLeg} strokeWidth={1} />

      {/* Front leg */}
      <line x1={3} y1={-2} x2={5 - legShift} y2={-30} stroke={C.heronLeg} strokeWidth={1.5} />
      <line x1={5 - legShift} y1={-30} x2={5 - legShift} y2={-28} stroke={C.heronLeg} strokeWidth={1} />
      {/* Foot */}
      <path d={`M${5 - legShift},-30 L${8 - legShift},-30.5 M${5 - legShift},-30 L${3 - legShift},-30.5 M${5 - legShift},-30 L${5 - legShift},-31`}
        stroke={C.heronLeg} strokeWidth={0.8} />

      {/* Body */}
      <ellipse cx={0} cy={-38} rx={10} ry={7} fill={C.heronWhite} stroke={C.heronGray} strokeWidth={0.8} />
      {/* Wing detail */}
      <path d="M-5,-40 Q-10,-35 -8,-32" fill="none" stroke={C.heronGray} strokeWidth={1} opacity={0.5} />
      <path d="M-3,-42 Q-12,-38 -10,-34" fill="none" stroke={C.heronGray} strokeWidth={0.8} opacity={0.4} />
      {/* Tail feathers */}
      <path d="M-8,-36 L-16,-34 M-7,-37 L-15,-36" fill="none" stroke={C.heronGray} strokeWidth={1} opacity={0.6} />

      {/* Neck (S-curve) */}
      <path
        d={`M2,-44 Q${5 + neckShift},-52 ${3 + neckShift},-58 Q${1 + neckShift},-62 ${neckShift},-65`}
        fill="none"
        stroke={C.heronWhite}
        strokeWidth={3.5}
        strokeLinecap="round"
      />
      <path
        d={`M2,-44 Q${5 + neckShift},-52 ${3 + neckShift},-58 Q${1 + neckShift},-62 ${neckShift},-65`}
        fill="none"
        stroke={C.heronGray}
        strokeWidth={0.5}
        strokeLinecap="round"
        opacity={0.3}
      />

      {/* Head */}
      <g transform={`translate(${neckShift}, ${-66 + headBob})`}>
        <ellipse cx={0} cy={0} rx={5} ry={3.5} fill={C.heronWhite} stroke={C.heronGray} strokeWidth={0.5} />
        {/* Eye */}
        <circle cx={3} cy={-1} r={1} fill={C.outline} />
        <circle cx={3.3} cy={-1.2} r={0.3} fill="white" />
        {/* Crest */}
        <line x1={-3} y1={-2} x2={-8} y2={-4} stroke={C.outline} strokeWidth={0.8} opacity={0.6} />
        <line x1={-2} y1={-2.5} x2={-7} y2={-5} stroke={C.outline} strokeWidth={0.6} opacity={0.4} />
        {/* Beak */}
        <path d="M5,-0.5 L14,0 L5,0.8 Z" fill={C.heronBeak} stroke={C.outline} strokeWidth={0.5} />
      </g>
    </g>
  );
};

// =============================================================================
// SUB-COMPONENT: Duck
// Swimming duck with gentle bobbing
// =============================================================================
const Duck: React.FC<{
  x: number;
  y: number;
  scale?: number;
  seed?: number;
  flip?: boolean;
}> = ({ x, y, scale = 1, seed = 0, flip = false }) => {
  const frame = useCurrentFrame();
  const bob = sineWave(frame, 0.15, seed) * 1.5;
  const headTilt = sineWave(frame, 0.08, seed + 1) * 3;
  const fDir = flip ? -1 : 1;

  return (
    <g transform={`translate(${x}, ${y + bob}) scale(${scale * fDir}, ${scale})`}>
      {/* Wake/ripples behind */}
      <path d="M-12,2 Q-18,0 -25,2" fill="none" stroke={C.waterRipple} strokeWidth={0.8} opacity={0.4} />
      <path d="M-10,4 Q-20,2 -28,4" fill="none" stroke={C.waterRipple} strokeWidth={0.6} opacity={0.3} />

      {/* Body */}
      <ellipse cx={0} cy={0} rx={10} ry={5} fill={C.duckBrown} />
      <ellipse cx={-1} cy={-1} rx={8} ry={3.5} fill={C.duckBrown} opacity={0.8} />
      {/* Wing highlight */}
      <path d="M-4,-2 Q0,-4 5,-2 Q3,0 -2,0 Z" fill={C.duckGreen} opacity={0.4} />

      {/* Tail */}
      <path d="M-9,-1 L-14,-4 L-12,0 Z" fill={C.duckBrown} />

      {/* Head and neck */}
      <g transform={`translate(8, -4) rotate(${headTilt})`}>
        <ellipse cx={0} cy={-3} rx={4} ry={3.5} fill={C.duckGreen} />
        {/* Eye */}
        <circle cx={2} cy={-4} r={0.8} fill={C.outline} />
        <circle cx={2.2} cy={-4.2} r={0.2} fill="white" />
        {/* Beak */}
        <path d="M4,-3 L8,-2.5 L4,-1.5 Z" fill={C.duckBeak} />
      </g>
    </g>
  );
};

// =============================================================================
// MAIN COMPONENT: Chinampas
// Aztec floating gardens - full scene with Monet water lily quality
// =============================================================================
export const Chinampas: React.FC<ChinampasProps> = ({
  boardText = '',
  width = 1920,
  height = 1080,
}) => {
  const frame = useCurrentFrame();

  // ---- Global animation values ----
  const cloudDrift = sineWave(frame, 0.02, 0) * 15;
  const waterShimmer = sineWave(frame, 0.08, 0) * 2;
  const mistPulse = sineWave(frame, 0.04, 0.5);
  const morningGlow = 0.6 + sineWave(frame, 0.03, 1) * 0.1;
  const waterWave1 = sineWave(frame, 0.12, 0);
  const waterWave2 = sineWave(frame, 0.09, 1.2);
  const waterWave3 = sineWave(frame, 0.07, 2.4);
  const reflectionShift = sineWave(frame, 0.05, 0.8) * 3;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
      <defs>
        {/* Sky gradient - morning pink/gold tones */}
        <linearGradient id="chin-sky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.skyTop} />
          <stop offset="30%" stopColor={C.skyMid} />
          <stop offset="60%" stopColor={C.skyLavender} />
          <stop offset="80%" stopColor={C.skyPink} />
          <stop offset="95%" stopColor={C.skyGold} />
          <stop offset="100%" stopColor={C.skyBottom} />
        </linearGradient>

        {/* Water gradient - deep blues and teals */}
        <linearGradient id="chin-water" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.waterSurface} />
          <stop offset="30%" stopColor={C.waterMid} />
          <stop offset="70%" stopColor={C.waterDeep} />
          <stop offset="100%" stopColor={C.waterDeep} />
        </linearGradient>

        {/* Sun glow radial */}
        <radialGradient id="chin-sun-glow" cx="25%" cy="25%" r="35%">
          <stop offset="0%" stopColor="rgba(255,220,150,0.35)" />
          <stop offset="50%" stopColor="rgba(255,200,130,0.12)" />
          <stop offset="100%" stopColor="rgba(255,180,100,0)" />
        </radialGradient>

        {/* Morning mist gradient */}
        <linearGradient id="chin-mist" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="rgba(230,235,240,0.2)" />
          <stop offset="40%" stopColor="rgba(230,235,240,0.08)" />
          <stop offset="100%" stopColor="rgba(230,235,240,0)" />
        </linearGradient>

        {/* Water reflection pattern */}
        <pattern id="chin-water-ripple" x="0" y="0" width="80" height="20" patternUnits="userSpaceOnUse">
          <path
            d={`M0,10 Q20,${8 + waterWave1 * 2} 40,10 Q60,${12 + waterWave2 * 2} 80,10`}
            fill="none"
            stroke={C.waterHighlight}
            strokeWidth={0.6}
            opacity={0.3}
          />
        </pattern>

        {/* Canvas texture overlay pattern */}
        <pattern id="chin-canvas" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="4" height="4" fill="transparent" />
          <rect x="0" y="0" width="1" height="1" fill={C.canvasOverlay} />
          <rect x="2" y="2" width="1" height="1" fill={C.canvasOverlay} />
        </pattern>

        {/* Mountain haze gradient */}
        <linearGradient id="chin-mt-haze" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.mountainFar} />
          <stop offset="100%" stopColor={C.atmosphereHaze} />
        </linearGradient>

        {/* Chinampa earth texture */}
        <pattern id="chin-earth-tex" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="6" height="6" fill={C.earthRich} />
          <circle cx="2" cy="2" r="0.8" fill={C.earthDark} opacity={0.3} />
          <circle cx="5" cy="4" r="0.5" fill={C.earthLight} opacity={0.2} />
        </pattern>

        {/* Water gold reflection for morning light */}
        <linearGradient id="chin-water-gold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(240,200,120,0)" />
          <stop offset="20%" stopColor="rgba(240,200,120,0.08)" />
          <stop offset="50%" stopColor="rgba(255,220,150,0.15)" />
          <stop offset="80%" stopColor="rgba(240,200,120,0.06)" />
          <stop offset="100%" stopColor="rgba(240,200,120,0)" />
        </linearGradient>

        {/* Stone tablet gradient */}
        <linearGradient id="chin-stone-tab" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={C.stoneTabletLight} />
          <stop offset="100%" stopColor={C.stoneTablet} />
        </linearGradient>
      </defs>

      {/* ============================================================= */}
      {/* SKY                                                           */}
      {/* ============================================================= */}
      <rect x={0} y={0} width={width} height={height * 0.45} fill="url(#chin-sky)" />

      {/* Sun glow overlay */}
      <rect x={0} y={0} width={width} height={height * 0.5} fill="url(#chin-sun-glow)" />

      {/* Morning sun (low on horizon, left side) */}
      <g transform={`translate(${width * 0.2}, ${height * 0.32})`}>
        {/* Outer glow rings */}
        <circle cx={0} cy={0} r={80} fill="rgba(255,210,140,0.06)" />
        <circle cx={0} cy={0} r={55} fill="rgba(255,200,130,0.1)" />
        <circle cx={0} cy={0} r={35} fill="rgba(255,220,160,0.15)" />
        {/* Sun disc */}
        <circle cx={0} cy={0} r={22} fill="#FFE090" opacity={0.9} />
        <circle cx={0} cy={0} r={18} fill="#FFF0B0" opacity={0.6} />
        <circle cx={-4} cy={-4} r={6} fill="white" opacity={0.2} />
      </g>

      {/* Clouds - soft morning clouds */}
      {/* Cloud 1 - large, left */}
      <g transform={`translate(${200 + cloudDrift}, ${height * 0.08})`} opacity={0.5}>
        <ellipse cx={0} cy={0} rx={90} ry={25} fill={C.cloudPink} />
        <ellipse cx={-30} cy={-8} rx={60} ry={18} fill={C.cloudWhite} />
        <ellipse cx={25} cy={-5} rx={50} ry={15} fill={C.cloudGold} opacity={0.6} />
        <ellipse cx={-10} cy={5} rx={70} ry={12} fill={C.cloudShadow} />
      </g>

      {/* Cloud 2 - wispy, center */}
      <g transform={`translate(${750 + cloudDrift * 0.7}, ${height * 0.12})`} opacity={0.4}>
        <ellipse cx={0} cy={0} rx={120} ry={15} fill={C.cloudWhite} />
        <ellipse cx={30} cy={-3} rx={80} ry={10} fill={C.cloudPink} opacity={0.5} />
        <ellipse cx={-20} cy={3} rx={90} ry={8} fill={C.cloudShadow} />
      </g>

      {/* Cloud 3 - small, right */}
      <g transform={`translate(${1400 + cloudDrift * 0.5}, ${height * 0.06})`} opacity={0.45}>
        <ellipse cx={0} cy={0} rx={65} ry={18} fill={C.cloudGold} />
        <ellipse cx={-15} cy={-5} rx={45} ry={12} fill={C.cloudWhite} />
        <ellipse cx={20} cy={3} rx={40} ry={10} fill={C.cloudShadow} />
      </g>

      {/* Cloud 4 - high wisp */}
      <g transform={`translate(${1100 + cloudDrift * 0.3}, ${height * 0.04})`} opacity={0.3}>
        <ellipse cx={0} cy={0} rx={100} ry={8} fill={C.cloudWhite} />
        <ellipse cx={40} cy={2} rx={60} ry={5} fill={C.cloudPink} opacity={0.4} />
      </g>

      {/* Cloud 5 - bottom, near horizon */}
      <g transform={`translate(${500 + cloudDrift * 0.6}, ${height * 0.22})`} opacity={0.3}>
        <ellipse cx={0} cy={0} rx={150} ry={10} fill={C.cloudGold} />
        <ellipse cx={-30} cy={-2} rx={100} ry={7} fill={C.cloudWhite} opacity={0.6} />
      </g>

      {/* ============================================================= */}
      {/* DISTANT MOUNTAINS WITH TENOCHTITLAN                           */}
      {/* ============================================================= */}

      {/* Far mountains - hazy blue */}
      <path
        d={`M0,${height * 0.38}
          Q${width * 0.05},${height * 0.32} ${width * 0.12},${height * 0.34}
          Q${width * 0.18},${height * 0.28} ${width * 0.25},${height * 0.3}
          L${width * 0.3},${height * 0.32}
          Q${width * 0.38},${height * 0.25} ${width * 0.45},${height * 0.27}
          Q${width * 0.5},${height * 0.22} ${width * 0.55},${height * 0.26}
          Q${width * 0.62},${height * 0.24} ${width * 0.68},${height * 0.28}
          Q${width * 0.75},${height * 0.3} ${width * 0.82},${height * 0.26}
          Q${width * 0.88},${height * 0.23} ${width * 0.93},${height * 0.29}
          Q${width * 0.97},${height * 0.32} ${width},${height * 0.35}
          L${width},${height * 0.45} L0,${height * 0.45} Z`}
        fill={C.mountainFar}
        opacity={0.5}
      />

      {/* Mountain snow caps */}
      <path
        d={`M${width * 0.18},${height * 0.28} L${width * 0.2},${height * 0.29} L${width * 0.16},${height * 0.295} Z`}
        fill={C.mountainSnow}
        opacity={0.4}
      />
      <path
        d={`M${width * 0.5},${height * 0.22} L${width * 0.52},${height * 0.235} L${width * 0.48},${height * 0.24} Z`}
        fill={C.mountainSnow}
        opacity={0.5}
      />
      <path
        d={`M${width * 0.88},${height * 0.23} L${width * 0.9},${height * 0.245} L${width * 0.86},${height * 0.25} Z`}
        fill={C.mountainSnow}
        opacity={0.45}
      />

      {/* Mid mountains */}
      <path
        d={`M0,${height * 0.4}
          Q${width * 0.08},${height * 0.36} ${width * 0.15},${height * 0.37}
          Q${width * 0.22},${height * 0.33} ${width * 0.3},${height * 0.35}
          Q${width * 0.4},${height * 0.34} ${width * 0.48},${height * 0.36}
          Q${width * 0.55},${height * 0.33} ${width * 0.62},${height * 0.35}
          Q${width * 0.7},${height * 0.37} ${width * 0.78},${height * 0.34}
          Q${width * 0.85},${height * 0.36} ${width * 0.92},${height * 0.38}
          L${width},${height * 0.4}
          L${width},${height * 0.45} L0,${height * 0.45} Z`}
        fill={C.mountainMid}
        opacity={0.5}
      />

      {/* Tenochtitlan skyline on the far shore */}
      <g transform={`translate(${width * 0.55}, ${height * 0.36})`} opacity={0.55}>
        {/* Temple pyramid - Templo Mayor silhouette */}
        <path d="M-20,0 L-15,-35 L-5,-40 L5,-40 L15,-35 L20,0 Z" fill={C.templePyramid} />
        <path d="M-5,-40 L-3,-50 L3,-50 L5,-40 Z" fill={C.templeRed} />
        <rect x={-2} y={-53} width={4} height={5} fill={C.templeTop} />

        {/* Secondary temples */}
        <path d="M-60,0 L-55,-22 L-45,-25 L-40,-22 L-35,0 Z" fill={C.cityStone} />
        <rect x={-48} y={-28} width={6} height={5} fill={C.templeRed} opacity={0.7} />

        <path d="M40,0 L45,-20 L50,-22 L55,-20 L60,0 Z" fill={C.cityStone} />
        <rect x={46} y={-25} width={5} height={4} fill={C.cityGold} opacity={0.6} />

        {/* City buildings */}
        {[-80, -70, -30, 25, 35, 70, 80, 95].map((bx, i) => {
          const bh = 8 + (i % 3) * 5;
          return (
            <rect key={`bldg-${i}`} x={bx} y={-bh} width={8} height={bh} fill={C.cityWhite} opacity={0.5} />
          );
        })}

        {/* Causeways extending into water */}
        <rect x={-100} y={-2} width={80} height={3} fill={C.cityStone} opacity={0.3} />
        <rect x={60} y={-1} width={70} height={3} fill={C.cityStone} opacity={0.3} />
      </g>

      {/* Atmospheric haze over mountains */}
      <rect x={0} y={height * 0.25} width={width} height={height * 0.2}
        fill={C.atmosphereHaze} opacity={0.5 + mistPulse * 0.1} />

      {/* ============================================================= */}
      {/* LAKE WATER BASE                                               */}
      {/* ============================================================= */}
      <rect x={0} y={height * 0.42} width={width} height={height * 0.58} fill="url(#chin-water)" />

      {/* Water surface reflection of sky */}
      <rect x={0} y={height * 0.42} width={width} height={height * 0.15}
        fill="url(#chin-water-gold)" opacity={morningGlow} />

      {/* Water ripple pattern overlay */}
      <rect x={0} y={height * 0.42} width={width} height={height * 0.58}
        fill="url(#chin-water-ripple)" opacity={0.5} />

      {/* Animated water waves - horizontal lines */}
      {Array.from({ length: 18 }, (_, i) => {
        const wy = height * 0.44 + i * (height * 0.56 / 18);
        const waveOffset = sineWave(frame, 0.06 + i * 0.005, i * 0.4) * 8;
        const waveAmp = sineWave(frame, 0.08, i * 0.7) * 3;
        return (
          <path
            key={`wave-${i}`}
            d={`M${-20 + waveOffset},${wy}
              Q${width * 0.15 + waveOffset},${wy + waveAmp}
              ${width * 0.3 + waveOffset},${wy}
              Q${width * 0.45 + waveOffset},${wy - waveAmp}
              ${width * 0.6 + waveOffset},${wy}
              Q${width * 0.75 + waveOffset},${wy + waveAmp * 0.8}
              ${width * 0.9 + waveOffset},${wy}
              Q${width + waveOffset},${wy - waveAmp * 0.6}
              ${width + 20},${wy}`}
            fill="none"
            stroke={C.waterHighlight}
            strokeWidth={0.5 + (i < 5 ? 0.3 : 0)}
            opacity={0.15 + (i < 4 ? 0.1 : 0)}
          />
        );
      })}

      {/* Sun reflection pillar on water */}
      <g opacity={0.15 + sineWave(frame, 0.05, 0) * 0.05} transform={`translate(${reflectionShift}, 0)`}>
        {Array.from({ length: 12 }, (_, i) => {
          const ry = height * 0.43 + i * 15;
          const rx = width * 0.2 + sineWave(frame, 0.1, i * 0.3) * 8;
          return (
            <ellipse
              key={`sunref-${i}`}
              cx={rx}
              cy={ry}
              rx={15 - i * 0.5}
              ry={2}
              fill="#FFE0A0"
              opacity={0.3 - i * 0.02}
            />
          );
        })}
      </g>

      {/* ============================================================= */}
      {/* MIDGROUND: CHINAMPA GRID                                      */}
      {/* ============================================================= */}

      {/* Far chinampas (small, background) */}
      <ChinampaPlot x={200} y={height * 0.44} plotWidth={140} plotHeight={40} cropType="corn" seed={10} />
      <ChinampaPlot x={380} y={height * 0.43} plotWidth={120} plotHeight={35} cropType="marigold" seed={11} />
      <ChinampaPlot x={550} y={height * 0.445} plotWidth={130} plotHeight={38} cropType="squash" seed={12} />
      <ChinampaPlot x={730} y={height * 0.44} plotWidth={110} plotHeight={35} cropType="tomato" seed={13} />
      <ChinampaPlot x={900} y={height * 0.445} plotWidth={140} plotHeight={40} cropType="mixed" seed={14} />
      <ChinampaPlot x={1100} y={height * 0.44} plotWidth={120} plotHeight={36} cropType="corn" seed={15} />
      <ChinampaPlot x={1280} y={height * 0.443} plotWidth={130} plotHeight={38} cropType="chili" seed={16} />
      <ChinampaPlot x={1460} y={height * 0.445} plotWidth={110} plotHeight={35} cropType="marigold" seed={17} />
      <ChinampaPlot x={1620} y={height * 0.44} plotWidth={140} plotHeight={38} cropType="squash" seed={18} />

      {/* Water channels between far chinampas - reflections */}
      {[340, 510, 680, 840, 1040, 1220, 1410, 1570, 1760].map((cx, i) => (
        <rect
          key={`chan-far-${i}`}
          x={cx}
          y={height * 0.44}
          width={40}
          height={40}
          fill={C.waterReflect}
          opacity={0.15 + sineWave(frame, 0.08, i) * 0.05}
        />
      ))}

      {/* Willow trees anchoring far chinampas */}
      <WillowTree x={340} y={height * 0.44} scale={0.35} seed={20} trunkHeight={100} />
      <WillowTree x={680} y={height * 0.445} scale={0.3} seed={21} trunkHeight={90} />
      <WillowTree x={1040} y={height * 0.44} scale={0.35} seed={22} trunkHeight={95} />
      <WillowTree x={1410} y={height * 0.445} scale={0.32} seed={23} trunkHeight={85} />

      {/* Mid-distance chinampas (medium size) */}
      <ChinampaPlot x={100} y={height * 0.52} plotWidth={180} plotHeight={55} cropType="corn" seed={30} />
      <ChinampaPlot x={340} y={height * 0.51} plotWidth={160} plotHeight={50} cropType="marigold" seed={31} />
      <ChinampaPlot x={560} y={height * 0.525} plotWidth={200} plotHeight={55} cropType="squash" seed={32} />
      <ChinampaPlot x={820} y={height * 0.52} plotWidth={170} plotHeight={50} cropType="chili" seed={33} />
      <ChinampaPlot x={1050} y={height * 0.515} plotWidth={190} plotHeight={55} cropType="mixed" seed={34} />
      <ChinampaPlot x={1300} y={height * 0.525} plotWidth={160} plotHeight={50} cropType="tomato" seed={35} />
      <ChinampaPlot x={1520} y={height * 0.52} plotWidth={180} plotHeight={52} cropType="corn" seed={36} />
      <ChinampaPlot x={1750} y={height * 0.515} plotWidth={150} plotHeight={48} cropType="marigold" seed={37} />

      {/* Water channels between mid chinampas */}
      {[280, 500, 760, 990, 1240, 1460, 1700].map((cx, i) => {
        const shimmer = sineWave(frame, 0.07, i * 0.8 + 5) * 2;
        return (
          <g key={`chan-mid-${i}`}>
            <rect
              x={cx}
              y={height * 0.52}
              width={60}
              height={55}
              fill={C.waterMid}
              opacity={0.2}
            />
            {/* Channel reflections */}
            <line
              x1={cx + 10}
              y1={height * 0.53 + shimmer}
              x2={cx + 50}
              y2={height * 0.53 + shimmer}
              stroke={C.waterHighlight}
              strokeWidth={0.8}
              opacity={0.2}
            />
            <line
              x1={cx + 15}
              y1={height * 0.55 + shimmer * 0.7}
              x2={cx + 45}
              y2={height * 0.55 + shimmer * 0.7}
              stroke={C.waterHighlight}
              strokeWidth={0.5}
              opacity={0.15}
            />
          </g>
        );
      })}

      {/* Willow trees at mid chinampas */}
      <WillowTree x={280} y={height * 0.52} scale={0.5} seed={40} trunkHeight={130} />
      <WillowTree x={760} y={height * 0.525} scale={0.55} seed={41} trunkHeight={140} />
      <WillowTree x={1240} y={height * 0.52} scale={0.5} seed={42} trunkHeight={125} />
      <WillowTree x={1700} y={height * 0.515} scale={0.45} seed={43} trunkHeight={120} />

      {/* ============================================================= */}
      {/* CANOES IN WATER CHANNELS                                      */}
      {/* ============================================================= */}

      {/* Canoe navigating far channels */}
      <Canoe x={510} y={height * 0.47} scale={0.5} seed={50} loaded={true} />
      <Canoe x={1200} y={height * 0.48} scale={0.45} seed={51} flip={true} loaded={true} />

      {/* Canoes in mid channels */}
      <Canoe x={500} y={height * 0.56} scale={0.65} seed={52} loaded={true} />
      <Canoe x={990} y={height * 0.555} scale={0.6} seed={53} flip={true} loaded={false} />
      <Canoe x={1460} y={height * 0.56} scale={0.6} seed={54} loaded={true} />

      {/* ============================================================= */}
      {/* FOREGROUND: LARGE CHINAMPAS                                   */}
      {/* ============================================================= */}

      {/* Large foreground chinampa - left */}
      <ChinampaPlot x={50} y={height * 0.65} plotWidth={280} plotHeight={80} cropType="corn" seed={60} />

      {/* Large foreground chinampa - center-left */}
      <ChinampaPlot x={400} y={height * 0.64} plotWidth={250} plotHeight={75} cropType="marigold" seed={61} />

      {/* Large foreground chinampa - center */}
      <ChinampaPlot x={720} y={height * 0.66} plotWidth={300} plotHeight={85} cropType="mixed" seed={62} />

      {/* Large foreground chinampa - center-right */}
      <ChinampaPlot x={1100} y={height * 0.64} plotWidth={260} plotHeight={78} cropType="squash" seed={63} />

      {/* Large foreground chinampa - right */}
      <ChinampaPlot x={1440} y={height * 0.65} plotWidth={280} plotHeight={80} cropType="chili" seed={64} />

      {/* Large foreground chinampa - far right */}
      <ChinampaPlot x={1780} y={height * 0.66} plotWidth={120} plotHeight={70} cropType="tomato" seed={65} />

      {/* Extra crop rows on foreground chinampas for detail */}
      <CropRow x={80} y={height * 0.65} length={240} cropType="corn" seed={70} density={15} />
      <CropRow x={430} y={height * 0.64} length={210} cropType="marigold" seed={71} density={18} />
      <CropRow x={750} y={height * 0.66} length={260} cropType="mixed" seed={72} density={16} />

      {/* Water channels between foreground chinampas */}
      {[330, 650, 1020, 1360, 1720].map((cx, i) => {
        const chanWidth = 70;
        return (
          <g key={`chan-fg-${i}`}>
            {/* Water fill */}
            <rect
              x={cx}
              y={height * 0.64}
              width={chanWidth}
              height={85}
              fill={C.waterMid}
              opacity={0.25}
            />
            {/* Reflections in channel */}
            {[0, 1, 2, 3].map((j) => {
              const lineY = height * 0.65 + j * 18 + sineWave(frame, 0.08, i + j) * 2;
              return (
                <line
                  key={`ref-${i}-${j}`}
                  x1={cx + 8}
                  y1={lineY}
                  x2={cx + chanWidth - 8}
                  y2={lineY}
                  stroke={C.waterHighlight}
                  strokeWidth={0.8}
                  opacity={0.18 - j * 0.03}
                />
              );
            })}
            {/* Dark water edge shadows */}
            <line x1={cx} y1={height * 0.64} x2={cx} y2={height * 0.64 + 85}
              stroke={C.waterShadow} strokeWidth={2} opacity={0.3} />
            <line x1={cx + chanWidth} y1={height * 0.64} x2={cx + chanWidth} y2={height * 0.64 + 85}
              stroke={C.waterShadow} strokeWidth={2} opacity={0.3} />
          </g>
        );
      })}

      {/* Foreground canoes in channels */}
      <Canoe x={365} y={height * 0.7} scale={0.8} seed={80} loaded={true} />
      <Canoe x={685} y={height * 0.72} scale={0.75} seed={81} flip={true} loaded={true} />
      <Canoe x={1055} y={height * 0.7} scale={0.8} seed={82} loaded={false} />
      <Canoe x={1395} y={height * 0.71} scale={0.7} seed={83} flip={true} loaded={true} />

      {/* ============================================================= */}
      {/* WILLOW TREES (AHUEJOTES) - FOREGROUND                         */}
      {/* ============================================================= */}
      <WillowTree x={50} y={height * 0.65} scale={0.75} seed={90} trunkHeight={180} />
      <WillowTree x={330} y={height * 0.64} scale={0.7} seed={91} trunkHeight={170} />
      <WillowTree x={650} y={height * 0.66} scale={0.8} seed={92} trunkHeight={190} />
      <WillowTree x={1020} y={height * 0.64} scale={0.7} seed={93} trunkHeight={175} />
      <WillowTree x={1360} y={height * 0.65} scale={0.75} seed={94} trunkHeight={185} />
      <WillowTree x={1720} y={height * 0.66} scale={0.65} seed={95} trunkHeight={160} />

      {/* ============================================================= */}
      {/* REED CLUSTERS AND WATER LILIES                                */}
      {/* ============================================================= */}

      {/* Reed clusters at chinampa edges */}
      <ReedCluster x={45} y={height * 0.73} count={8} maxHeight={50} seed={100} />
      <ReedCluster x={330} y={height * 0.72} count={6} maxHeight={45} seed={101} />
      <ReedCluster x={650} y={height * 0.74} count={7} maxHeight={55} seed={102} />
      <ReedCluster x={1020} y={height * 0.72} count={6} maxHeight={48} seed={103} />
      <ReedCluster x={1360} y={height * 0.73} count={8} maxHeight={52} seed={104} />
      <ReedCluster x={1720} y={height * 0.74} count={5} maxHeight={42} seed={105} />
      <ReedCluster x={1860} y={height * 0.75} count={9} maxHeight={58} seed={106} />

      {/* Water lilies floating in channels */}
      <WaterLily x={350} y={height * 0.69} scale={1.2} seed={110} hasFlower={true} />
      <WaterLily x={375} y={height * 0.71} scale={0.9} seed={111} hasFlower={false} />
      <WaterLily x={660} y={height * 0.73} scale={1.1} seed={112} hasFlower={true} />
      <WaterLily x={685} y={height * 0.7} scale={0.8} seed={113} hasFlower={false} />
      <WaterLily x={695} y={height * 0.72} scale={1.0} seed={114} hasFlower={true} />
      <WaterLily x={1035} y={height * 0.69} scale={0.9} seed={115} hasFlower={false} />
      <WaterLily x={1055} y={height * 0.72} scale={1.2} seed={116} hasFlower={true} />
      <WaterLily x={1375} y={height * 0.7} scale={1.0} seed={117} hasFlower={true} />
      <WaterLily x={1395} y={height * 0.72} scale={0.85} seed={118} hasFlower={false} />
      <WaterLily x={1740} y={height * 0.73} scale={1.1} seed={119} hasFlower={true} />

      {/* Additional lily pads in far channels */}
      <WaterLily x={520} y={height * 0.49} scale={0.5} seed={120} hasFlower={false} />
      <WaterLily x={860} y={height * 0.48} scale={0.45} seed={121} hasFlower={true} />
      <WaterLily x={1210} y={height * 0.49} scale={0.5} seed={122} hasFlower={false} />

      {/* ============================================================= */}
      {/* BIRDS: HERONS AND DUCKS                                       */}
      {/* ============================================================= */}

      {/* Herons standing in shallow water near chinampas */}
      <Heron x={110} y={height * 0.74} scale={0.8} seed={130} />
      <Heron x={1550} y={height * 0.73} scale={0.7} seed={131} flip={true} />
      <Heron x={850} y={height * 0.5} scale={0.4} seed={132} />

      {/* Ducks swimming in channels */}
      <Duck x={380} y={height * 0.685} scale={0.9} seed={140} />
      <Duck x={400} y={height * 0.695} scale={0.7} seed={141} flip={true} />
      <Duck x={1050} y={height * 0.695} scale={0.8} seed={142} />
      <Duck x={1070} y={height * 0.685} scale={0.6} seed={143} flip={true} />
      <Duck x={1740} y={height * 0.7} scale={0.75} seed={144} />

      {/* Distant flying birds (V-shapes) */}
      {[
        { bx: 350, by: height * 0.15, bs: 0.6 },
        { bx: 380, by: height * 0.14, bs: 0.5 },
        { bx: 400, by: height * 0.16, bs: 0.45 },
        { bx: 1300, by: height * 0.1, bs: 0.5 },
        { bx: 1330, by: height * 0.09, bs: 0.4 },
        { bx: 1280, by: height * 0.11, bs: 0.45 },
      ].map((bird, i) => {
        const wingFlap = sineWave(frame, 0.2 + i * 0.02, i * 0.5) * 3;
        return (
          <g key={`fbird-${i}`} transform={`translate(${bird.bx + cloudDrift * 0.3}, ${bird.by}) scale(${bird.bs})`}>
            <path
              d={`M-8,${wingFlap} L0,0 L8,${wingFlap}`}
              fill="none"
              stroke={C.outline}
              strokeWidth={1.5}
              opacity={0.4}
            />
          </g>
        );
      })}

      {/* ============================================================= */}
      {/* ANIMATED CROWD WORKERS                                        */}
      {/* ============================================================= */}
      <AztecCrowdLayer config={AZTEC_CROWD_CONFIGS.chinampas} />

      {/* ============================================================= */}
      {/* FOREGROUND WATER & BOTTOM EDGE                                */}
      {/* ============================================================= */}

      {/* Bottom foreground water - darker, closer */}
      <rect x={0} y={height * 0.82} width={width} height={height * 0.18} fill={C.waterDeep} opacity={0.3} />

      {/* Foreground water ripples */}
      {Array.from({ length: 8 }, (_, i) => {
        const fy = height * 0.84 + i * 12;
        const fWave = sineWave(frame, 0.1 + i * 0.008, i * 0.6) * 12;
        return (
          <path
            key={`fgwave-${i}`}
            d={`M${-10 + fWave},${fy}
              Q${width * 0.2 + fWave},${fy + sineWave(frame, 0.09, i * 0.9) * 4}
              ${width * 0.4 + fWave},${fy}
              Q${width * 0.6 + fWave},${fy - sineWave(frame, 0.11, i * 0.7) * 3}
              ${width * 0.8 + fWave},${fy}
              Q${width + fWave},${fy + sineWave(frame, 0.08, i * 1.1) * 3}
              ${width + 20},${fy}`}
            fill="none"
            stroke={C.waterHighlight}
            strokeWidth={0.7}
            opacity={0.12}
          />
        );
      })}

      {/* Foreground reed clusters */}
      <ReedCluster x={30} y={height * 0.88} count={10} maxHeight={70} seed={150} />
      <ReedCluster x={180} y={height * 0.9} count={8} maxHeight={60} seed={151} />
      <ReedCluster x={1750} y={height * 0.88} count={9} maxHeight={65} seed={152} />
      <ReedCluster x={1880} y={height * 0.9} count={7} maxHeight={55} seed={153} />

      {/* Foreground lily pads */}
      <WaterLily x={250} y={height * 0.86} scale={1.4} seed={160} hasFlower={true} />
      <WaterLily x={310} y={height * 0.88} scale={1.2} seed={161} hasFlower={false} />
      <WaterLily x={1600} y={height * 0.87} scale={1.3} seed={162} hasFlower={true} />
      <WaterLily x={1650} y={height * 0.89} scale={1.0} seed={163} hasFlower={false} />

      {/* ============================================================= */}
      {/* STONE TABLET FOR BOARD TEXT                                    */}
      {/* ============================================================= */}
      <g transform={`translate(${width / 2 - 210}, ${height * 0.78})`}>
        {/* Tablet shadow */}
        <rect x={-4} y={4} width={420} height={170} rx={6} fill={C.shadow} opacity={0.3} />

        {/* Tablet frame - carved stone border */}
        <rect x={-8} y={-8} width={436} height={186} rx={8} fill={C.stoneFrame} stroke={C.outline} strokeWidth={2} />

        {/* Inner carved border */}
        <rect x={-4} y={-4} width={428} height={178} rx={5} fill={C.stoneTabletDark} />

        {/* Main tablet face */}
        <rect x={0} y={0} width={420} height={170} rx={3} fill="url(#chin-stone-tab)" />

        {/* Stone texture */}
        {[15, 45, 80, 115, 150].map((sy, i) => (
          <line
            key={`stone-line-${i}`}
            x1={10}
            y1={sy}
            x2={410}
            y2={sy + sineWave(frame, 0.01, i) * 0.5}
            stroke={C.stoneTabletDark}
            strokeWidth={0.5}
            opacity={0.15}
          />
        ))}

        {/* Aztec decorative border glyphs */}
        <g opacity={0.3}>
          {/* Top border pattern - step fret (xicalcoliuhqui) */}
          {Array.from({ length: 14 }, (_, i) => {
            const gx = 15 + i * 30;
            return (
              <path
                key={`fret-top-${i}`}
                d={`M${gx},12 L${gx + 8},12 L${gx + 8},18 L${gx + 16},18 L${gx + 16},12 L${gx + 24},12`}
                fill="none"
                stroke={C.glyphColor}
                strokeWidth={1.5}
              />
            );
          })}
          {/* Bottom border pattern */}
          {Array.from({ length: 14 }, (_, i) => {
            const gx = 15 + i * 30;
            return (
              <path
                key={`fret-bot-${i}`}
                d={`M${gx},155 L${gx + 8},155 L${gx + 8},149 L${gx + 16},149 L${gx + 16},155 L${gx + 24},155`}
                fill="none"
                stroke={C.glyphColor}
                strokeWidth={1.5}
              />
            );
          })}
          {/* Side glyphs - simplified Aztec calendar symbols */}
          <circle cx={20} cy={85} r={8} fill="none" stroke={C.glyphColor} strokeWidth={1} />
          <circle cx={20} cy={85} r={4} fill="none" stroke={C.glyphColor} strokeWidth={0.8} />
          <circle cx={400} cy={85} r={8} fill="none" stroke={C.glyphColor} strokeWidth={1} />
          <circle cx={400} cy={85} r={4} fill="none" stroke={C.glyphColor} strokeWidth={0.8} />
          {/* Small decorative dots */}
          {[30, 50, 70].map((dy, i) => (
            <g key={`dot-l-${i}`}>
              <circle cx={12} cy={dy} r={1.5} fill={C.glyphColor} />
              <circle cx={408} cy={dy} r={1.5} fill={C.glyphColor} />
              <circle cx={12} cy={dy + 70} r={1.5} fill={C.glyphColor} />
              <circle cx={408} cy={dy + 70} r={1.5} fill={C.glyphColor} />
            </g>
          ))}
        </g>

        {/* Board text */}
        {boardText && (
          <text
            x={210}
            y={95}
            textAnchor="middle"
            fill={C.chalkText}
            fontSize={36}
            fontFamily="'Courier New', monospace"
            fontWeight="bold"
            opacity={0.9}
          >
            {boardText}
          </text>
        )}
      </g>

      {/* ============================================================= */}
      {/* MORNING MIST OVERLAYS                                         */}
      {/* ============================================================= */}

      {/* Low mist over water surface */}
      <rect x={0} y={height * 0.42} width={width} height={height * 0.15}
        fill="url(#chin-mist)" opacity={0.6 + mistPulse * 0.15} />

      {/* Mist wisps - animated */}
      {[
        { mx: 200, my: height * 0.5, mw: 250, mh: 25 },
        { mx: 600, my: height * 0.48, mw: 200, mh: 20 },
        { mx: 1000, my: height * 0.51, mw: 280, mh: 22 },
        { mx: 1400, my: height * 0.49, mw: 220, mh: 18 },
        { mx: 100, my: height * 0.53, mw: 180, mh: 15 },
        { mx: 1650, my: height * 0.52, mw: 200, mh: 20 },
      ].map((mist, i) => {
        const mistDrift = sineWave(frame, 0.03 + i * 0.005, i * 1.5) * 20;
        const mistFade = 0.08 + sineWave(frame, 0.04, i * 0.8) * 0.04;
        return (
          <ellipse
            key={`mist-${i}`}
            cx={mist.mx + mistDrift}
            cy={mist.my}
            rx={mist.mw}
            ry={mist.mh}
            fill={C.mistWhite}
            opacity={mistFade}
          />
        );
      })}

      {/* Golden morning mist wisps */}
      {[
        { mx: 300, my: height * 0.46 },
        { mx: 800, my: height * 0.47 },
        { mx: 1200, my: height * 0.45 },
      ].map((gm, i) => {
        const gDrift = sineWave(frame, 0.025, i * 2) * 15;
        return (
          <ellipse
            key={`gmist-${i}`}
            cx={gm.mx + gDrift}
            cy={gm.my}
            rx={180}
            ry={15}
            fill={C.mistGold}
            opacity={0.1 + sineWave(frame, 0.035, i) * 0.03}
          />
        );
      })}

      {/* ============================================================= */}
      {/* ATMOSPHERIC OVERLAYS                                          */}
      {/* ============================================================= */}

      {/* Overall morning golden wash */}
      <rect x={0} y={0} width={width} height={height}
        fill={C.morningGlow} opacity={0.15 + sineWave(frame, 0.02, 0) * 0.03} />

      {/* Soft vignette edges */}
      <rect x={0} y={0} width={width * 0.1} height={height}
        fill="rgba(30,30,50,0.08)" />
      <rect x={width * 0.9} y={0} width={width * 0.1} height={height}
        fill="rgba(30,30,50,0.08)" />
      <rect x={0} y={height * 0.9} width={width} height={height * 0.1}
        fill="rgba(20,30,40,0.12)" />

      {/* Canvas texture overlay */}
      <rect x={0} y={0} width={width} height={height} fill="url(#chin-canvas)" opacity={0.3} />

      {/* Subtle warm color grade overlay */}
      <rect x={0} y={0} width={width} height={height * 0.5}
        fill="rgba(255,240,210,0.03)" />
      <rect x={0} y={height * 0.5} width={width} height={height * 0.5}
        fill="rgba(180,210,230,0.03)" />

      {/* Water surface shimmer highlight at horizon */}
      <rect
        x={waterWave3 * 2}
        y={height * 0.42}
        width={width}
        height={8}
        fill={C.waterHighlight}
        opacity={0.15 + waterShimmer * 0.05}
      />
    </svg>
  );
};

export default Chinampas;
