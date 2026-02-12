import React, { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';
import { getIdleState } from '../animaties/idle';
import { getMouthShape, getTalkingBounce, getTalkingGesture } from '../animaties/talking';
import { interpolateEmotions } from '../animaties/emotions';
import type { Emotion } from '../animaties/emotions';
import type { MouthShape } from '../animaties/talking';

interface ProfessorPintProps {
  emotion?: Emotion;
  previousEmotion?: Emotion;
  emotionTransitionProgress?: number;
  talking?: boolean;
  scale?: number;
}

// ─── Color Palette (70+) ───────────────────────────────────
const C = {
  skin: '#FDDCB5', skinMid: '#F0CCA3', skinShadow: '#E0B88E',
  skinDeep: '#D0A878', skinHighlight: '#FFF0DD', skinWarm: '#F5D4AA',
  skinKnuckle: '#E8BFA0',
  outline: '#1A1A1A', outlineSoft: '#2A2A2A', outlineFaint: '#444444',
  vest: '#2D5016', vestDark: '#1F3A0F', vestDeep: '#152A08',
  vestLight: '#3A6820', vestHighlight: '#4A7A2E', vestStitch: '#1A3008',
  shirt: '#FFFFFF', shirtShadow: '#E6E6E6', shirtFold: '#D8D8D8',
  shirtCrease: '#CCCCCC', shirtWarm: '#FFF8F0',
  bowtie: '#D4A012', bowtieDark: '#B8890F', bowtieLight: '#E8B82A', bowtieShine: '#F0D060',
  hair: '#D4D4D4', hairDark: '#AAAAAA', hairDeep: '#909090',
  hairMid: '#C0C0C0', hairLight: '#ECECEC', hairWhite: '#F8F8F8',
  glassFrame: '#3A3A3A', glassFrameLight: '#555555',
  glassLens: 'rgba(200,220,240,0.18)', glassShine: 'rgba(255,255,255,0.18)',
  pupil: '#1A1A1A', iris: '#4A6741', irisLight: '#5C7B52', irisDark: '#3A5534',
  eyeWhite: '#FFFFFF', eyeShadow: '#E8E0D8',
  mouth: '#8B2020', mouthDark: '#6B1515', mouthDeep: '#4A0A0A',
  tongue: '#CC5555', teeth: '#FFFEF5',
  blush: '#FFAAAA',
  beerAmber: '#D4A012', beerDark: '#B8890F', beerDeep: '#9A7008',
  beerLight: '#E8C040', beerGlow: '#F0D868',
  foam: '#FFF8E7', foamWhite: '#FFFFFF', foamShadow: '#E8E0C8',
  glassClear: 'rgba(255,255,255,0.08)', glassEdge: 'rgba(255,255,255,0.25)',
  glassRefract: 'rgba(200,180,120,0.06)',
  pants: '#3A3A3A', pantsDark: '#2A2A2A', pantsHighlight: '#4A4A4A', pantsFold: '#333333',
  shoe: '#2D1A0A', shoeDark: '#1A0F05', shoeHighlight: '#4A3020', shoeSole: '#1A1A1A',
  shadow: 'rgba(0,0,0,0.08)', shadowMid: 'rgba(0,0,0,0.12)', shadowDeep: 'rgba(0,0,0,0.18)',
};

const SW = 3;

// ─── Gradient Definitions ──────────────────────────────────
const Defs: React.FC = () => (
  <defs>
    <linearGradient id="pp-skin-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={C.skinHighlight} />
      <stop offset="35%" stopColor={C.skin} />
      <stop offset="100%" stopColor={C.skinMid} />
    </linearGradient>
    <radialGradient id="pp-face-grad" cx="0.4" cy="0.35" r="0.65">
      <stop offset="0%" stopColor={C.skinHighlight} />
      <stop offset="45%" stopColor={C.skin} />
      <stop offset="80%" stopColor={C.skinMid} />
      <stop offset="100%" stopColor={C.skinShadow} />
    </radialGradient>
    <linearGradient id="pp-neck-grad" x1="0.3" y1="0" x2="0.7" y2="1">
      <stop offset="0%" stopColor={C.skin} />
      <stop offset="100%" stopColor={C.skinDeep} />
    </linearGradient>
    <linearGradient id="pp-vest-grad-l" x1="1" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={C.vestHighlight} />
      <stop offset="25%" stopColor={C.vestLight} />
      <stop offset="55%" stopColor={C.vest} />
      <stop offset="100%" stopColor={C.vestDark} />
    </linearGradient>
    <linearGradient id="pp-vest-grad-r" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor={C.vestLight} />
      <stop offset="40%" stopColor={C.vest} />
      <stop offset="100%" stopColor={C.vestDeep} />
    </linearGradient>
    <radialGradient id="pp-shirt-grad" cx="0.5" cy="0.3" r="0.7">
      <stop offset="0%" stopColor={C.shirtWarm} />
      <stop offset="40%" stopColor={C.shirt} />
      <stop offset="70%" stopColor={C.shirtShadow} />
      <stop offset="100%" stopColor={C.shirtFold} />
    </radialGradient>
    <linearGradient id="pp-sleeve-grad" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0%" stopColor={C.vestLight} />
      <stop offset="40%" stopColor={C.vest} />
      <stop offset="100%" stopColor={C.vestDark} />
    </linearGradient>
    <linearGradient id="pp-pants-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={C.pantsHighlight} />
      <stop offset="35%" stopColor={C.pants} />
      <stop offset="100%" stopColor={C.pantsDark} />
    </linearGradient>
    <linearGradient id="pp-shoe-grad" x1="0.2" y1="0" x2="0.8" y2="1">
      <stop offset="0%" stopColor={C.shoeHighlight} />
      <stop offset="50%" stopColor={C.shoe} />
      <stop offset="100%" stopColor={C.shoeDark} />
    </linearGradient>
    <linearGradient id="pp-bowtie-grad" x1="0" y1="0" x2="0.2" y2="1">
      <stop offset="0%" stopColor={C.bowtieShine} />
      <stop offset="30%" stopColor={C.bowtieLight} />
      <stop offset="60%" stopColor={C.bowtie} />
      <stop offset="100%" stopColor={C.bowtieDark} />
    </linearGradient>
    <radialGradient id="pp-button-grad" cx="0.35" cy="0.3" r="0.65">
      <stop offset="0%" stopColor={C.bowtieShine} />
      <stop offset="50%" stopColor={C.bowtie} />
      <stop offset="100%" stopColor={C.bowtieDark} />
    </radialGradient>
    <linearGradient id="pp-hair-grad" x1="0.3" y1="0" x2="0.7" y2="1">
      <stop offset="0%" stopColor={C.hairWhite} />
      <stop offset="30%" stopColor={C.hairLight} />
      <stop offset="60%" stopColor={C.hair} />
      <stop offset="100%" stopColor={C.hairDark} />
    </linearGradient>
    <linearGradient id="pp-hair-grad-dark" x1="0.5" y1="0" x2="0.5" y2="1">
      <stop offset="0%" stopColor={C.hair} />
      <stop offset="100%" stopColor={C.hairDeep} />
    </linearGradient>
    <radialGradient id="pp-iris-grad" cx="0.4" cy="0.35" r="0.6">
      <stop offset="0%" stopColor={C.irisLight} />
      <stop offset="55%" stopColor={C.iris} />
      <stop offset="100%" stopColor={C.irisDark} />
    </radialGradient>
    <linearGradient id="pp-beer-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={C.beerGlow} />
      <stop offset="30%" stopColor={C.beerLight} />
      <stop offset="60%" stopColor={C.beerAmber} />
      <stop offset="100%" stopColor={C.beerDeep} />
    </linearGradient>
    <linearGradient id="pp-foam-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={C.foamWhite} />
      <stop offset="60%" stopColor={C.foam} />
      <stop offset="100%" stopColor={C.foamShadow} />
    </linearGradient>
    <linearGradient id="pp-glass-body" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor={C.glassEdge} />
      <stop offset="25%" stopColor={C.glassClear} />
      <stop offset="50%" stopColor={C.glassRefract} />
      <stop offset="75%" stopColor={C.glassClear} />
      <stop offset="100%" stopColor={C.glassEdge} />
    </linearGradient>
    <clipPath id="pp-pint-clip">
      <path d="M-16,4 L-12,-56 Q-11,-60 -9,-60 L9,-60 Q11,-60 12,-56 L16,4 Z" />
    </clipPath>
  </defs>
);

// ─── Main Component ────────────────────────────────────────
export const ProfessorPint: React.FC<ProfessorPintProps> = ({
  emotion = 'neutral',
  previousEmotion = 'neutral',
  emotionTransitionProgress = 1,
  talking = false,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const idle = getIdleState(frame);
  const mouthShape = getMouthShape(frame, talking);
  const talkBounce = getTalkingBounce(frame, talking);
  const talkGesture = getTalkingGesture(frame, talking);

  const emo = useMemo(
    () => interpolateEmotions(previousEmotion, emotion, emotionTransitionProgress),
    [previousEmotion, emotion, emotionTransitionProgress]
  );

  const bodyY = idle.breathing.y + talkBounce;

  return (
    <svg
      viewBox="-140 -220 280 420"
      width={280 * scale}
      height={420 * scale}
      style={{ overflow: 'visible' }}
    >
      <Defs />
      <g transform={`translate(${idle.sway.x}, ${bodyY}) rotate(${idle.sway.rotation})`}>
        <ellipse cx={2} cy={145} rx={45} ry={6} fill={C.shadowMid} />
        <ellipse cx={2} cy={145} rx={32} ry={4} fill={C.shadowDeep} />

        <Legs />
        <Pelvis />

        <g transform={`scale(${idle.breathing.scaleX}, 1)`}>
          <Body />
        </g>

        <LeftArm gestureRotation={talkGesture} />
        <RightArm beerSway={idle.beerSway} />

        <g transform={`translate(0, -108) rotate(${emo.headTilt})`}>
          <Head emo={emo} blink={idle.blink} pupil={idle.pupil} mouthShape={mouthShape} talking={talking} />
        </g>
      </g>
    </svg>
  );
};

// ─── Legs — originate from pelvis anchor points ───────────
const Legs: React.FC = () => (
  <g>
    {/* Left leg — anchored at pelvis left (x=-14) */}
    <path d="M-14,78 Q-18,95 -22,115 Q-23,125 -22,135" fill="none" stroke={C.outline} strokeWidth={12} strokeLinecap="round" />
    <path d="M-14,78 Q-18,95 -22,115 Q-23,125 -22,135" fill="none" stroke="url(#pp-pants-grad)" strokeWidth={9} strokeLinecap="round" />
    <path d="M-20,92 Q-17,94 -14,92" fill="none" stroke={C.pantsFold} strokeWidth={0.8} opacity={0.5} />
    <path d="M-24,107 Q-20,109 -17,107" fill="none" stroke={C.pantsFold} strokeWidth={0.7} opacity={0.4} />
    <path d="M-25,120 Q-21,122 -18,120" fill="none" stroke={C.pantsFold} strokeWidth={0.6} opacity={0.3} />

    {/* Right leg — anchored at pelvis right (x=+14) */}
    <path d="M14,78 Q18,95 21,115 Q22,125 21,135" fill="none" stroke={C.outline} strokeWidth={12} strokeLinecap="round" />
    <path d="M14,78 Q18,95 21,115 Q22,125 21,135" fill="none" stroke="url(#pp-pants-grad)" strokeWidth={9} strokeLinecap="round" />
    <path d="M14,92 Q18,94 21,92" fill="none" stroke={C.pantsFold} strokeWidth={0.8} opacity={0.5} />
    <path d="M14,108 Q18,110 21,108" fill="none" stroke={C.pantsFold} strokeWidth={0.7} opacity={0.4} />

    {/* Inner gap hint — separates the two legs visually */}
    <line x1={0} y1={78} x2={0} y2={86} stroke={C.pantsDark} strokeWidth={1.2} opacity={0.35} />

    {/* Left shoe */}
    <g transform="translate(-26, 137) rotate(-5)">
      <ellipse cx={0} cy={0} rx={18} ry={8} fill="url(#pp-shoe-grad)" stroke={C.outline} strokeWidth={2.5} />
      <ellipse cx={-4} cy={-2} rx={5} ry={2.5} fill={C.shoeHighlight} opacity={0.25} />
      <path d="M-14,2 Q-14,5 -10,5 L10,5 Q14,5 14,2" fill={C.shoeSole} opacity={0.6} />
    </g>
    {/* Right shoe */}
    <g transform="translate(25, 137) rotate(5)">
      <ellipse cx={0} cy={0} rx={18} ry={8} fill="url(#pp-shoe-grad)" stroke={C.outline} strokeWidth={2.5} />
      <ellipse cx={-3} cy={-2} rx={5} ry={2.5} fill={C.shoeHighlight} opacity={0.2} />
      <path d="M-14,2 Q-14,5 -10,5 L10,5 Q14,5 14,2" fill={C.shoeSole} opacity={0.6} />
    </g>
  </g>
);

// ─── Pelvis/Hip — connects torso to legs ──────────────────
// Subtle weight shift: 2px right offset + 1° rotation for natural "smart" stance
const Pelvis: React.FC = () => (
  <g transform="translate(2, 0) rotate(1, 0, 74)">
    {/* Main pelvis shape — rounded trapezoid, narrower than vest */}
    <path
      d="M-30,64 Q-32,66 -28,80 L-14,82 Q0,84 14,82 L28,80 Q32,66 30,64 Z"
      fill="url(#pp-pants-grad)" stroke={C.outline} strokeWidth={2.5}
      strokeLinejoin="round"
    />
    {/* Belt/waistband hint */}
    <path
      d="M-29,65 Q0,62 29,65"
      fill="none" stroke={C.pantsDark} strokeWidth={2.5} strokeLinecap="round"
    />
    {/* Center seam */}
    <line x1={0} y1={66} x2={0} y2={82} stroke={C.pantsDark} strokeWidth={1} opacity={0.3} />
    {/* Fabric fold — left side */}
    <path d="M-20,68 Q-18,74 -20,80" fill="none" stroke={C.pantsFold} strokeWidth={0.8} opacity={0.3} />
    {/* Fabric fold — right side */}
    <path d="M18,68 Q16,74 18,80" fill="none" stroke={C.pantsFold} strokeWidth={0.8} opacity={0.25} />
  </g>
);

// ─── Body ──────────────────────────────────────────────────
// Vest covers EVERYTHING — shirt only visible in the V-opening
const Body: React.FC = () => (
  <g>
    {/* Shirt visible only in V-opening between vest panels */}
    <path
      d="M-8,-48 L-8,72 Q-4,78 0,80 Q4,78 8,72 L8,-48 Z"
      fill="url(#pp-shirt-grad)" stroke="none"
    />
    {/* Shirt folds in V */}
    <line x1={0} y1={-15} x2={1} y2={65} stroke={C.shirtCrease} strokeWidth={1} opacity={0.4} />
    <path d="M-5,-5 Q-3,10 -6,30" fill="none" stroke={C.shirtFold} strokeWidth={0.6} opacity={0.25} />
    <path d="M5,-5 Q3,10 6,30" fill="none" stroke={C.shirtFold} strokeWidth={0.6} opacity={0.25} />

    {/* Belly volume under shirt */}
    <path d="M-6,40 Q0,52 6,40" fill={C.shirtShadow} opacity={0.2} />

    {/* ─── VEST — full torso coverage including shoulders ─── */}
    {/* Vest left panel — covers from shoulder to hip, left flap hangs 3px lower (asymmetric) */}
    <path
      d="M-48,-48 Q-48,-52 -34,-52 L-8,-52 L-8,-28
         L-8,10 Q-10,40 -16,58 Q-20,68 -26,73
         Q-28,75 -30,74 L-36,70 Q-44,60 -46,40 Q-48,15 -48,-48 Z"
      fill="url(#pp-vest-grad-l)" stroke={C.outline} strokeWidth={SW}
    />
    {/* Vest left lapel edge */}
    <path d="M-8,-28 Q-12,-18 -10,-6" fill="none" stroke={C.vestDark} strokeWidth={1.5} opacity={0.5} />
    {/* Vest left fabric tension */}
    <path d="M-40,-35 Q-38,-15 -40,10" stroke={C.vestDark} strokeWidth={1.5} opacity={0.2} />
    <path d="M-36,18 Q-34,35 -38,52" stroke={C.vestDeep} strokeWidth={1.2} opacity={0.2} />
    {/* Vest left highlight (light from left) */}
    <path d="M-46,-45 Q-46,-10 -45,25" stroke={C.vestHighlight} strokeWidth={1} opacity={0.2} />
    {/* Vest left stitch */}
    <path d="M-42,-40 Q-42,5 -40,40" stroke={C.vestStitch} strokeWidth={0.5} opacity={0.12} strokeDasharray="3,4" />

    {/* Vest right panel — right flap ends slightly higher than left */}
    <path
      d="M48,-48 Q48,-52 34,-52 L8,-52 L8,-28
         L8,10 Q10,40 16,58 Q22,68 28,71
         Q30,72 30,71 L36,68 Q44,58 46,40 Q48,15 48,-48 Z"
      fill="url(#pp-vest-grad-r)" stroke={C.outline} strokeWidth={SW}
    />
    {/* Vest right lapel */}
    <path d="M8,-28 Q12,-18 10,-6" fill="none" stroke={C.vestDark} strokeWidth={1.5} opacity={0.5} />
    {/* Vest right shadow (darker — light from left) */}
    <path d="M40,-35 Q38,-15 40,10" stroke={C.vestDeep} strokeWidth={2} opacity={0.25} />
    <path d="M36,18 Q34,35 38,52" stroke={C.vestDeep} strokeWidth={1.5} opacity={0.2} />
    {/* Vest right stitch */}
    <path d="M42,-40 Q42,5 40,40" stroke={C.vestStitch} strokeWidth={0.5} opacity={0.1} strokeDasharray="3,4" />

    {/* ─── Shoulder seam lines — where sleeve meets body ─── */}
    <path d="M-46,-44 Q-48,-42 -50,-38" fill="none" stroke={C.vestDark} strokeWidth={1.2} opacity={0.4} />
    <path d="M46,-44 Q48,-42 50,-38" fill="none" stroke={C.vestDeep} strokeWidth={1.2} opacity={0.4} />

    {/* Vest buttons */}
    {[-8, 15, 38].map((y, i) => (
      <g key={y}>
        <circle cx={0} cy={y} r={4.5} fill="url(#pp-button-grad)" stroke={C.outline} strokeWidth={1.5} />
        <circle cx={-1.2} cy={y - 1.2} r={1.5} fill={C.bowtieShine} opacity={0.5} />
        <circle cx={-1} cy={y + 0.5} r={0.5} fill={C.bowtieDark} opacity={0.4} />
        <circle cx={1} cy={y + 0.5} r={0.5} fill={C.bowtieDark} opacity={0.4} />
        {i < 2 && (
          <>
            <path d={`M-5,${y} Q-3,${y + 2} -5,${y + 4}`} fill="none" stroke={C.shirtCrease} strokeWidth={0.4} opacity={0.2} />
            <path d={`M5,${y} Q3,${y + 2} 5,${y + 4}`} fill="none" stroke={C.shirtCrease} strokeWidth={0.4} opacity={0.2} />
          </>
        )}
      </g>
    ))}

    {/* Neck */}
    <path
      d="M-13,-50 Q-13,-55 -10,-55 L10,-55 Q13,-55 13,-50 L12,-42 L-12,-42 Z"
      fill="url(#pp-neck-grad)" stroke={C.outline} strokeWidth={SW}
    />
    <ellipse cx={0} cy={-44} rx={11} ry={3} fill={C.skinDeep} opacity={0.35} />
    <line x1={-5} y1={-52} x2={-4} y2={-44} stroke={C.skinShadow} strokeWidth={0.6} opacity={0.2} />
    <line x1={5} y1={-52} x2={4} y2={-44} stroke={C.skinShadow} strokeWidth={0.6} opacity={0.2} />

    {/* Bowtie */}
    <g transform="translate(0, -46)">
      <path d="M-15,0 L-9,-9 L-1,0" fill={C.shirtWarm} stroke={C.outline} strokeWidth={2} />
      <path d="M15,0 L9,-9 L1,0" fill={C.shirt} stroke={C.outline} strokeWidth={2} />
      <path d="M0,0 L-19,-11 Q-20,-6 -19,0 Q-20,6 -19,11 Z" fill="url(#pp-bowtie-grad)" stroke={C.outline} strokeWidth={2} />
      <path d="M-3,-2 Q-10,-8 -16,-9" fill="none" stroke={C.bowtieDark} strokeWidth={0.8} opacity={0.4} />
      <path d="M-3,2 Q-10,8 -16,9" fill="none" stroke={C.bowtieDark} strokeWidth={0.8} opacity={0.4} />
      <path d="M0,0 L19,-11 Q20,-6 19,0 Q20,6 19,11 Z" fill="url(#pp-bowtie-grad)" stroke={C.outline} strokeWidth={2} />
      <path d="M3,-2 Q10,-8 16,-9" fill="none" stroke={C.bowtieDark} strokeWidth={0.8} opacity={0.4} />
      <path d="M3,2 Q10,8 16,9" fill="none" stroke={C.bowtieDark} strokeWidth={0.8} opacity={0.4} />
      <ellipse cx={0} cy={0} rx={5.5} ry={5} fill={C.bowtieDark} stroke={C.outline} strokeWidth={2} />
      <ellipse cx={-1} cy={-1} rx={2} ry={1.5} fill={C.bowtieShine} opacity={0.25} />
    </g>
  </g>
);

// ─── Left Arm — Vest sleeve + simple open hand ─────────────
const LeftArm: React.FC<{ gestureRotation: number }> = ({ gestureRotation }) => (
  <g transform={`translate(-46, -40) rotate(${-15 + gestureRotation}, 0, 0)`}>
    {/* ─── VEST SLEEVE — upper arm ─── */}
    <path
      d="M-2,-6 Q-6,-4 -10,8 Q-14,22 -16,32 Q-14,34 -8,34 Q-2,32 0,22 Q2,10 2,-2 Z"
      fill="url(#pp-sleeve-grad)" stroke={C.outline} strokeWidth={2.5}
    />
    {/* Sleeve fold lines */}
    <path d="M-4,5 Q-8,15 -10,25" fill="none" stroke={C.vestDark} strokeWidth={1} opacity={0.3} />
    <path d="M-2,8 Q-5,18 -6,28" fill="none" stroke={C.vestDark} strokeWidth={0.8} opacity={0.2} />
    {/* Sleeve highlight */}
    <path d="M0,2 Q-2,12 -3,22" fill="none" stroke={C.vestHighlight} strokeWidth={0.8} opacity={0.2} />
    {/* Sleeve cuff edge */}
    <ellipse cx={-8} cy={33} rx={8} ry={3.5} fill={C.vest} stroke={C.outline} strokeWidth={2} />

    {/* ─── Bare forearm ─── */}
    <g transform="translate(-12, 34)">
      <path d="M0,0 Q-3,15 -6,30" fill="none" stroke={C.outline} strokeWidth={9} strokeLinecap="round" />
      <path d="M0,0 Q-3,15 -6,30" fill="none" stroke={C.skin} strokeWidth={6.5} strokeLinecap="round" />
      <path d="M1,3 Q-2,15 -5,26" fill="none" stroke={C.skinHighlight} strokeWidth={1} opacity={0.2} />

      {/* ─── Simple open hand ─── */}
      <g transform="translate(-8, 32)">
        <ellipse cx={0} cy={0} rx={10} ry={8} fill="url(#pp-skin-grad)" stroke={C.outline} strokeWidth={2.5} />
        {/* Palm line */}
        <path d="M-5,1 Q0,3 5,1" fill="none" stroke={C.skinShadow} strokeWidth={0.6} opacity={0.3} />
        {/* Thumb */}
        <path d="M8,-4 Q12,-1 11,3 Q10,5 8,4" fill={C.skin} stroke={C.outline} strokeWidth={2} strokeLinecap="round" />
        {/* Finger bumps at top of hand */}
        <path d="M-7,-5 Q-5,-9 -3,-5" fill={C.skin} stroke={C.outline} strokeWidth={1.5} strokeLinecap="round" />
        <path d="M-3,-6 Q-1,-10 1,-6" fill={C.skin} stroke={C.outline} strokeWidth={1.5} strokeLinecap="round" />
        <path d="M1,-5 Q3,-9 5,-5" fill={C.skin} stroke={C.outline} strokeWidth={1.5} strokeLinecap="round" />
        <path d="M5,-4 Q6.5,-7 8,-4" fill={C.skin} stroke={C.outline} strokeWidth={1.3} strokeLinecap="round" />
      </g>
    </g>
  </g>
);

// ─── Pint Glass ────────────────────────────────────────────
const PintGlass: React.FC<{ liquidOffset: number }> = ({ liquidOffset }) => (
  <g>
    <g clipPath="url(#pp-pint-clip)">
      <rect x={-16} y={-46 + liquidOffset} width={32} height={60} fill="url(#pp-beer-grad)" opacity={0.88} />
      <rect x={-6} y={-42 + liquidOffset} width={5} height={48} fill={C.beerGlow} opacity={0.12} />
      <rect x={6} y={-40 + liquidOffset} width={3} height={44} fill={C.beerLight} opacity={0.08} />
      <ellipse cx={0} cy={0} rx={14} ry={6} fill={C.beerDeep} opacity={0.2} />
      <circle cx={-3} cy={-20 + liquidOffset} r={0.8} fill="white" opacity={0.3} />
      <circle cx={2} cy={-28 + liquidOffset} r={0.6} fill="white" opacity={0.25} />
      <circle cx={5} cy={-15 + liquidOffset} r={0.7} fill="white" opacity={0.2} />
      <circle cx={-6} cy={-32 + liquidOffset} r={0.5} fill="white" opacity={0.2} />
      <circle cx={0} cy={-10 + liquidOffset} r={0.9} fill="white" opacity={0.15} />
    </g>

    <g clipPath="url(#pp-pint-clip)">
      <rect x={-15} y={-56 + liquidOffset} width={30} height={14} fill="url(#pp-foam-grad)" />
      <ellipse cx={-6} cy={-54 + liquidOffset} rx={6} ry={4} fill={C.foamWhite} opacity={0.8} />
      <ellipse cx={4} cy={-53 + liquidOffset} rx={5.5} ry={3.5} fill={C.foamWhite} opacity={0.7} />
      <ellipse cx={-1} cy={-56 + liquidOffset} rx={5} ry={3} fill={C.foamWhite} opacity={0.6} />
      <ellipse cx={8} cy={-55 + liquidOffset} rx={4} ry={2.5} fill={C.foamWhite} opacity={0.55} />
      <ellipse cx={-9} cy={-52 + liquidOffset} rx={4.5} ry={3} fill={C.foamWhite} opacity={0.5} />
      <ellipse cx={-5} cy={-51 + liquidOffset} rx={5} ry={2} fill={C.foamShadow} opacity={0.2} />
      <ellipse cx={5} cy={-50 + liquidOffset} rx={4.5} ry={1.5} fill={C.foamShadow} opacity={0.15} />
      <ellipse cx={-8} cy={-56 + liquidOffset} rx={2} ry={1.2} fill="white" opacity={0.4} />
      <ellipse cx={3} cy={-55 + liquidOffset} rx={1.8} ry={1} fill="white" opacity={0.35} />
      <path d={`M12,-48 Q14,-44 13,-38 Q12,-34 13,-30`} fill={C.foam} stroke={C.foamShadow} strokeWidth={0.5} opacity={0.7} />
      <ellipse cx={13} cy={-30} rx={2} ry={3} fill={C.foam} opacity={0.5} />
    </g>

    <path
      d="M-16,-2 L-12,-56 Q-11,-60 -9,-60 L9,-60 Q11,-60 12,-56 L16,-2 Q16,4 11,4 L-11,4 Q-16,4 -16,-2 Z"
      fill="url(#pp-glass-body)" stroke={C.outline} strokeWidth={2.8}
    />
    <path d="M-14,-54 L-16,-2" fill="none" stroke={C.glassEdge} strokeWidth={2} />
    <path d="M14,-54 L16,-2" fill="none" stroke={C.glassEdge} strokeWidth={1.5} opacity={0.6} />
    <path d="M-9,-54 Q-8,-30 -7,-4" fill="none" stroke="white" strokeWidth={2.5} opacity={0.22} />
    <path d="M-6,-50 Q-5,-28 -5,-8" fill="none" stroke="white" strokeWidth={1} opacity={0.12} />
    <path d="M-9,-59 L9,-59" fill="none" stroke="white" strokeWidth={1.5} opacity={0.4} />
    <rect x={-11} y={0} width={22} height={3} rx={1} fill={C.glassEdge} opacity={0.3} />

    <path d="M16,-42 Q30,-40 30,-22 Q30,-4 16,0" fill="none" stroke={C.outline} strokeWidth={4} />
    <path d="M16,-40 Q28,-38 28,-22 Q28,-6 16,-2" fill="none" stroke={C.glassEdge} strokeWidth={2.5} />
    <path d="M17,-38 Q26,-36 26,-22 Q26,-8 17,-4" fill="none" stroke={C.shadow} strokeWidth={1} />
  </g>
);

// ─── Right Arm — Vest sleeve + simple hand holding pint ────
const RightArm: React.FC<{ beerSway: { rotation: number; liquidOffset: number } }> = ({ beerSway }) => (
  <g transform="translate(46, -40)">
    {/* ─── VEST SLEEVE — upper arm ─── */}
    <path
      d="M2,-6 Q6,-4 12,10 Q16,24 18,34 Q14,36 8,36 Q2,34 0,24 Q-2,12 -2,-2 Z"
      fill="url(#pp-sleeve-grad)" stroke={C.outline} strokeWidth={2.5}
    />
    {/* Sleeve fold lines */}
    <path d="M6,5 Q10,16 12,26" fill="none" stroke={C.vestDark} strokeWidth={1} opacity={0.3} />
    <path d="M4,8 Q7,18 8,28" fill="none" stroke={C.vestDark} strokeWidth={0.8} opacity={0.2} />
    <path d="M2,2 Q4,12 5,22" fill="none" stroke={C.vestHighlight} strokeWidth={0.8} opacity={0.2} />
    {/* Sleeve cuff edge */}
    <ellipse cx={10} cy={35} rx={8} ry={3.5} fill={C.vest} stroke={C.outline} strokeWidth={2} />

    {/* ─── Bare forearm — bent ─── */}
    <g transform="translate(14, 36) rotate(-50)">
      <path d="M0,0 Q1,13 2,26" fill="none" stroke={C.outline} strokeWidth={9} strokeLinecap="round" />
      <path d="M0,0 Q1,13 2,26" fill="none" stroke={C.skin} strokeWidth={6.5} strokeLinecap="round" />
      <path d="M1,3 Q2,13 3,23" fill="none" stroke={C.skinHighlight} strokeWidth={1} opacity={0.2} />

      {/* ─── Hand + pint — rotated upright ─── */}
      <g transform={`translate(4, 28) rotate(${50 + beerSway.rotation})`}>
        {/* Simple hand behind glass */}
        <ellipse cx={0} cy={-8} rx={11} ry={8} fill="url(#pp-skin-grad)" stroke={C.outline} strokeWidth={2.5} />
        {/* Palm shadow */}
        <ellipse cx={0} cy={-6} rx={8} ry={4} fill={C.skinShadow} opacity={0.15} />

        {/* Pint glass centered in hand */}
        <g transform="translate(0, 10)">
          <PintGlass liquidOffset={beerSway.liquidOffset} />
        </g>

        {/* Thumb visible on right side of glass */}
        <path d="M10,-12 Q14,-8 14,-2 Q14,4 11,6"
          fill={C.skin} stroke={C.outline} strokeWidth={2.5} strokeLinecap="round" />
      </g>
    </g>
  </g>
);

// ─── Head ──────────────────────────────────────────────────
interface HeadProps {
  emo: {
    eyeScaleY: number; eyeOffsetY: number; pupilScale: number;
    browLeftY: number; browRightY: number; browLeftRotation: number; browRightRotation: number;
    mouthCurve: number; mouthWidth: number; mouthOpen: number;
    blushOpacity: number; headTilt: number;
  };
  blink: number;
  pupil: { x: number; y: number };
  mouthShape: MouthShape;
  talking: boolean;
}

const Head: React.FC<HeadProps> = ({ emo, blink, pupil, mouthShape, talking }) => (
  <g>
    <HairBack />

    <circle cx={0} cy={0} r={50} fill="url(#pp-face-grad)" stroke={C.outline} strokeWidth={SW} />
    <path d="M-35,30 Q-20,48 0,50 Q20,48 35,30" fill="none" stroke={C.skinShadow} strokeWidth={1.5} opacity={0.2} />
    <ellipse cx={-6} cy={-28} rx={18} ry={10} fill="white" opacity={0.18} />
    <ellipse cx={-4} cy={-34} rx={8} ry={4.5} fill="white" opacity={0.12} />
    <ellipse cx={-34} cy={14} rx={10} ry={16} fill={C.skinShadow} opacity={0.18} />
    <ellipse cx={34} cy={14} rx={10} ry={16} fill={C.skinDeep} opacity={0.12} />
    <ellipse cx={-42} cy={-5} rx={6} ry={12} fill={C.skinShadow} opacity={0.1} />
    <ellipse cx={42} cy={-5} rx={6} ry={12} fill={C.skinDeep} opacity={0.08} />

    <HairFront />
    <Glasses />

    <g transform={`translate(-17, ${-2 + emo.eyeOffsetY})`}>
      <Eye blink={blink} scaleY={emo.eyeScaleY} pupilScale={emo.pupilScale} px={pupil.x} py={pupil.y} />
    </g>
    <g transform={`translate(17, ${-2 + emo.eyeOffsetY})`}>
      <Eye blink={blink} scaleY={emo.eyeScaleY} pupilScale={emo.pupilScale} px={pupil.x} py={pupil.y} />
    </g>

    <g transform={`translate(-17, ${-16 + emo.browLeftY}) rotate(${emo.browLeftRotation})`}>
      <rect x={-11} y={0} width={22} height={4.5} rx={2} fill={C.hairDark} />
      <rect x={-10} y={0.5} width={20} height={2.5} rx={1.2} fill={C.hairMid} opacity={0.3} />
    </g>
    <g transform={`translate(17, ${-16 + emo.browRightY}) rotate(${emo.browRightRotation})`}>
      <rect x={-11} y={0} width={22} height={4.5} rx={2} fill={C.hairDark} />
      <rect x={-10} y={0.5} width={20} height={2.5} rx={1.2} fill={C.hairMid} opacity={0.3} />
    </g>

    {emo.blushOpacity > 0.01 && (
      <>
        <ellipse cx={-28} cy={14} rx={10} ry={6} fill={C.blush} opacity={emo.blushOpacity * 0.7} />
        <ellipse cx={28} cy={14} rx={10} ry={6} fill={C.blush} opacity={emo.blushOpacity * 0.7} />
      </>
    )}

    <path d="M-1,-4 Q-2,4 -3,8 Q0,17 3,8 Q2,4 1,-4" fill="none" stroke={C.outline} strokeWidth={2} strokeLinecap="round" />
    <circle cx={1} cy={10} r={1.8} fill="white" opacity={0.12} />
    <path d="M-4,13 Q-2,15 0,14" fill="none" stroke={C.skinShadow} strokeWidth={0.8} opacity={0.4} />
    <path d="M4,13 Q2,15 0,14" fill="none" stroke={C.skinShadow} strokeWidth={0.8} opacity={0.35} />

    <Stubble />
    <Mouth shape={mouthShape} curve={emo.mouthCurve} width={emo.mouthWidth} emotionOpen={emo.mouthOpen} talking={talking} />
  </g>
);

// ─── Hair Back — connected, asymmetric ─────────────────────
const HairBack: React.FC = () => (
  <g>
    <path
      d="M-44,22 Q-58,18 -62,2 Q-66,-14 -58,-26 Q-62,-38 -54,-44 Q-48,-50 -40,-43
         L36,-42 Q44,-48 52,-42 Q60,-36 56,-24 Q62,-12 58,2 Q56,16 44,22
         L36,36 Q22,46 2,47 Q-18,46 -34,38 Z"
      fill="url(#pp-hair-grad)" stroke={C.outline} strokeWidth={2.5}
    />
    <path d="M-32,30 Q-38,40 -28,42" fill="none" stroke={C.hairDark} strokeWidth={2} opacity={0.35} />
    <path d="M22,32 Q28,40 20,42" fill="none" stroke={C.hairDark} strokeWidth={1.8} opacity={0.3} />
    <path d="M-5,40 Q2,46 -6,45" fill="none" stroke={C.hairDark} strokeWidth={1.5} opacity={0.2} />
    <path d="M-20,-40 Q-15,-44 -10,-40 Q-5,-36 0,-40" fill="none" stroke={C.hairLight} strokeWidth={1.5} opacity={0.25} />
    <path d="M10,-40 Q15,-44 22,-40" fill="none" stroke={C.hairLight} strokeWidth={1.2} opacity={0.2} />
  </g>
);

// ─── Hair Front — all tufts CONNECT to head mass ───────────
const HairFront: React.FC = () => (
  <g>
    {/* ─── LEFT — bigger, wilder (all connected to hair mass) ─── */}
    <path
      d="M-46,-4 Q-60,-8 -64,-22 Q-66,-34 -58,-40 Q-62,-48 -56,-50 Q-50,-52 -46,-46 Q-44,-42 -44,-38"
      fill="url(#pp-hair-grad)" stroke={C.outline} strokeWidth={2.5}
    />
    <path d="M-48,10 Q-64,6 -66,-6 Q-68,-16 -62,-20 Q-58,-22 -56,-18"
      fill="url(#pp-hair-grad)" stroke={C.outline} strokeWidth={2.2} />
    <path d="M-46,22 Q-62,20 -64,8 Q-66,0 -58,-4 Q-54,-6 -52,-2"
      fill="url(#pp-hair-grad)" stroke={C.outline} strokeWidth={2} />
    {/* Left detail */}
    <path d="M-58,-42 Q-64,-38 -60,-30" fill="none" stroke={C.outline} strokeWidth={1.5} />
    <path d="M-60,-12 Q-66,-10 -64,-4" fill="none" stroke={C.outline} strokeWidth={1.5} />
    <path d="M-54,-34 Q-52,-28 -56,-22" fill="none" stroke={C.hairWhite} strokeWidth={1.8} opacity={0.3} />

    {/* ─── RIGHT — slightly smaller (all connected) ─── */}
    <path
      d="M46,-4 Q58,-8 60,-20 Q62,-30 55,-35 Q58,-42 52,-44 Q48,-46 44,-40 Q42,-36 42,-32"
      fill="url(#pp-hair-grad)" stroke={C.outline} strokeWidth={2.5}
    />
    <path d="M48,10 Q60,6 62,-4 Q64,-12 58,-16 Q54,-18 52,-14"
      fill="url(#pp-hair-grad)" stroke={C.outline} strokeWidth={2} />
    <path d="M46,20 Q58,18 60,8 Q62,0 55,-2 Q52,-4 50,0"
      fill="url(#pp-hair-grad-dark)" stroke={C.outline} strokeWidth={2} />
    <path d="M55,-38 Q62,-35 58,-28" fill="none" stroke={C.outline} strokeWidth={1.5} />
    <path d="M52,-30 Q50,-25 53,-20" fill="none" stroke={C.hairLight} strokeWidth={1.3} opacity={0.2} />

    {/* ─── TOP strands — all start FROM the hair mass ─── */}
    <path d="M-22,-46 Q-26,-56 -22,-54 Q-20,-48 -20,-44" fill="none" stroke={C.hair} strokeWidth={2.5} opacity={0.7} />
    <path d="M-12,-48 Q-15,-58 -12,-56 Q-10,-50 -10,-46" fill="none" stroke={C.hair} strokeWidth={2.2} opacity={0.6} />
    <path d="M4,-47 Q2,-56 5,-54 Q6,-48 5,-44" fill="none" stroke={C.hair} strokeWidth={2} opacity={0.6} />
    <path d="M-6,-47 Q-9,-55 -6,-53 Q-5,-48 -5,-44" fill="none" stroke={C.hairLight} strokeWidth={1.8} opacity={0.5} />
    <path d="M15,-44 Q18,-52 15,-50 Q14,-46 14,-42" fill="none" stroke={C.hair} strokeWidth={1.5} opacity={0.4} />
    {/* Left wild tuft — starts from left hair edge, curves up */}
    <path d="M-44,-38 Q-50,-52 -46,-56 Q-42,-54 -42,-46"
      fill="url(#pp-hair-grad)" stroke={C.outline} strokeWidth={1.8} />
  </g>
);

// ─── Glasses ───────────────────────────────────────────────
const Glasses: React.FC = () => (
  <g transform="translate(0, -2)">
    <circle cx={-17} cy={0} r={14.5} fill={C.glassLens} stroke={C.glassFrame} strokeWidth={2.8} />
    <ellipse cx={-21} cy={-5} rx={5.5} ry={3.5} fill={C.glassShine} />
    <ellipse cx={-14} cy={4} rx={3} ry={2} fill={C.glassShine} opacity={0.4} />
    <circle cx={17} cy={0} r={14.5} fill={C.glassLens} stroke={C.glassFrame} strokeWidth={2.8} />
    <ellipse cx={13} cy={-5} rx={5.5} ry={3.5} fill={C.glassShine} />
    <ellipse cx={20} cy={4} rx={3} ry={2} fill={C.glassShine} opacity={0.3} />
    <path d="M-3,0 Q0,-4 3,0" fill="none" stroke={C.glassFrame} strokeWidth={2.8} />
    <path d="M-31,-2 Q-38,-4 -47,-6" fill="none" stroke={C.glassFrame} strokeWidth={2.2} />
    <path d="M31,-2 Q38,-4 47,-6" fill="none" stroke={C.glassFrame} strokeWidth={2.2} />
  </g>
);

// ─── Eye ───────────────────────────────────────────────────
interface EyeProps { blink: number; scaleY: number; pupilScale: number; px: number; py: number; }

const Eye: React.FC<EyeProps> = ({ blink, scaleY, pupilScale, px, py }) => (
  <g transform={`scale(1, ${scaleY * blink})`}>
    <ellipse cx={0} cy={0} rx={9} ry={7} fill={C.eyeWhite} stroke={C.outline} strokeWidth={1.8} />
    <ellipse cx={0} cy={-3.5} rx={7.5} ry={3} fill={C.eyeShadow} opacity={0.22} />
    <circle cx={px} cy={py} r={4.2 * pupilScale} fill="url(#pp-iris-grad)" />
    <circle cx={px} cy={py} r={4.2 * pupilScale} fill="none" stroke={C.irisDark} strokeWidth={0.5} opacity={0.3} />
    <circle cx={px} cy={py} r={2.3 * pupilScale} fill={C.pupil} />
    <circle cx={px + 1.5} cy={py - 1.8} r={1.5} fill="white" opacity={0.9} />
    <circle cx={px - 1.2} cy={py + 1.2} r={0.7} fill="white" opacity={0.4} />
  </g>
);

// ─── Stubble ───────────────────────────────────────────────
const Stubble: React.FC = () => (
  <g opacity={0.5}>
    {[
      [-6, 36, 0.9], [0, 38, 0.9], [6, 36, 0.9],
      [-3, 40, 0.85], [3, 40, 0.85], [0, 42, 0.7],
      [-9, 34, 0.8], [9, 34, 0.8],
      [-14, 30, 0.75], [14, 30, 0.75],
      [-18, 26, 0.7], [18, 26, 0.7],
      [-22, 22, 0.6], [22, 22, 0.6],
      [-12, 33, 0.7], [12, 33, 0.7],
      [-4, 34, 0.65], [4, 34, 0.65], [0, 35, 0.65],
      [-8, 37, 0.65], [8, 37, 0.65],
      [-16, 28, 0.6], [16, 28, 0.6],
      [-10, 36, 0.55], [10, 36, 0.55],
      [-20, 24, 0.5], [20, 24, 0.5],
      [-6, 42, 0.5], [6, 42, 0.5],
      [-2, 36, 0.5], [2, 37, 0.5],
    ].map(([cx, cy, r], i) => (
      <circle key={i} cx={cx} cy={cy} r={r as number} fill={C.hairDark} />
    ))}
  </g>
);

// ─── Mouth ─────────────────────────────────────────────────
interface MouthProps { shape: MouthShape; curve: number; width: number; emotionOpen: number; talking: boolean; }

const Mouth: React.FC<MouthProps> = ({ shape, curve, width, emotionOpen, talking }) => {
  const talkOpen = talking ? [0, 3, 6, 10][shape] : emotionOpen * 10;
  const openAmount = Math.max(talkOpen, emotionOpen * 10);
  const hw = 13 * width;

  if (openAmount < 1) {
    return (
      <g>
        <path d={`M${-hw},26 Q0,${26 + curve} ${hw},26`}
          fill="none" stroke={C.outline} strokeWidth={2.5} strokeLinecap="round" />
        <path d={`M${-hw + 2},27 Q0,${27 + curve * 0.5} ${hw - 2},27`}
          fill="none" stroke={C.skinShadow} strokeWidth={0.8} opacity={0.2} />
      </g>
    );
  }

  return (
    <g transform="translate(0, 26)">
      <ellipse cx={0} cy={0} rx={hw} ry={openAmount * 0.5 + Math.abs(curve) * 0.2}
        fill={C.mouth} stroke={C.outline} strokeWidth={2.5} />
      <ellipse cx={0} cy={1} rx={hw * 0.75} ry={openAmount * 0.35}
        fill={C.mouthDark} opacity={0.5} />
      <ellipse cx={0} cy={2} rx={hw * 0.5} ry={openAmount * 0.25}
        fill={C.mouthDeep} opacity={0.3} />
      {openAmount > 5 && (
        <>
          <ellipse cx={2} cy={openAmount * 0.22} rx={hw * 0.5} ry={openAmount * 0.2} fill={C.tongue} />
          <ellipse cx={1} cy={openAmount * 0.18} rx={hw * 0.3} ry={openAmount * 0.1} fill="#DD7777" opacity={0.3} />
        </>
      )}
      {openAmount > 3 && (
        <>
          <rect x={-hw * 0.6} y={-openAmount * 0.35} width={hw * 1.2} height={3} fill={C.teeth} rx={1} />
          {[-0.3, -0.1, 0.1, 0.3].map((frac) => (
            <line key={frac} x1={hw * frac} y1={-openAmount * 0.35}
              x2={hw * frac} y2={-openAmount * 0.35 + 3}
              stroke={C.shirtFold} strokeWidth={0.4} opacity={0.25} />
          ))}
        </>
      )}
    </g>
  );
};

export default ProfessorPint;
