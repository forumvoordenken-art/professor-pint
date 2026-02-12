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

// ─── Color Palette ─────────────────────────────────────────
const C = {
  // Skin
  skin: '#FDDCB5',
  skinMid: '#F0CCA3',
  skinShadow: '#E0B88E',
  skinHighlight: '#FFF0DD',
  // Outline
  outline: '#1A1A1A',
  outlineSoft: '#2A2A2A',
  // Vest
  vest: '#2D5016',
  vestDark: '#1F3A0F',
  vestLight: '#3A6820',
  vestHighlight: '#4A7A2E',
  // Shirt
  shirt: '#FFFFFF',
  shirtShadow: '#E6E6E6',
  shirtFold: '#D8D8D8',
  // Bowtie
  bowtie: '#D4A012',
  bowtieDark: '#B8890F',
  bowtieLight: '#E8B82A',
  // Hair
  hair: '#D4D4D4',
  hairDark: '#AAAAAA',
  hairMid: '#C0C0C0',
  hairLight: '#ECECEC',
  // Eyes & glasses
  glassFrame: '#3A3A3A',
  glassLens: 'rgba(200,220,240,0.18)',
  glassShine: 'rgba(255,255,255,0.15)',
  pupil: '#1A1A1A',
  iris: '#4A6741',
  irisLight: '#5C7B52',
  irisDark: '#3A5534',
  eyeWhite: '#FFFFFF',
  eyeShadow: '#E8E0D8',
  // Mouth
  mouth: '#8B2020',
  mouthDark: '#6B1515',
  tongue: '#CC5555',
  teeth: '#FFFEF5',
  // Blush
  blush: '#FFAAAA',
  // Beer
  beerAmber: '#D4A012',
  beerDark: '#B8890F',
  beerLight: '#E8C040',
  foam: '#FFF8E7',
  foamWhite: '#FFFFFF',
  // Pants & shoes
  pants: '#3A3A3A',
  pantsDark: '#2A2A2A',
  pantsHighlight: '#4A4A4A',
  shoe: '#2D1A0A',
  shoeDark: '#1A0F05',
  shoeHighlight: '#4A3020',
  // Misc
  shadow: 'rgba(0,0,0,0.08)',
};

const SW = 3; // Stroke width

// ─── Gradient Definitions ──────────────────────────────────
const Defs: React.FC = () => (
  <defs>
    <linearGradient id="pp-skin-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={C.skinHighlight} />
      <stop offset="40%" stopColor={C.skin} />
      <stop offset="100%" stopColor={C.skinMid} />
    </linearGradient>
    <linearGradient id="pp-vest-grad" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0%" stopColor={C.vestLight} />
      <stop offset="30%" stopColor={C.vest} />
      <stop offset="100%" stopColor={C.vestDark} />
    </linearGradient>
    <linearGradient id="pp-shirt-grad" x1="0.3" y1="0" x2="0.7" y2="1">
      <stop offset="0%" stopColor={C.shirt} />
      <stop offset="60%" stopColor={C.shirtShadow} />
      <stop offset="100%" stopColor={C.shirtFold} />
    </linearGradient>
    <linearGradient id="pp-pants-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={C.pantsHighlight} />
      <stop offset="40%" stopColor={C.pants} />
      <stop offset="100%" stopColor={C.pantsDark} />
    </linearGradient>
    <linearGradient id="pp-shoe-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={C.shoeHighlight} />
      <stop offset="100%" stopColor={C.shoe} />
    </linearGradient>
    <radialGradient id="pp-face-grad" cx="0.4" cy="0.35" r="0.65">
      <stop offset="0%" stopColor={C.skinHighlight} />
      <stop offset="50%" stopColor={C.skin} />
      <stop offset="100%" stopColor={C.skinMid} />
    </radialGradient>
    <radialGradient id="pp-iris-grad" cx="0.4" cy="0.35" r="0.6">
      <stop offset="0%" stopColor={C.irisLight} />
      <stop offset="60%" stopColor={C.iris} />
      <stop offset="100%" stopColor={C.irisDark} />
    </radialGradient>
    <linearGradient id="pp-bowtie-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={C.bowtieLight} />
      <stop offset="50%" stopColor={C.bowtie} />
      <stop offset="100%" stopColor={C.bowtieDark} />
    </linearGradient>
    <linearGradient id="pp-hair-grad" x1="0.3" y1="0" x2="0.7" y2="1">
      <stop offset="0%" stopColor={C.hairLight} />
      <stop offset="40%" stopColor={C.hair} />
      <stop offset="100%" stopColor={C.hairDark} />
    </linearGradient>
    <linearGradient id="pp-beer-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={C.beerLight} />
      <stop offset="50%" stopColor={C.beerAmber} />
      <stop offset="100%" stopColor={C.beerDark} />
    </linearGradient>
    <clipPath id="pp-pint-clip">
      <path d="M-14,2 L-11,-52 Q-10,-55 -8,-55 L8,-55 Q10,-55 11,-52 L14,2 Z" />
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
      viewBox="-130 -210 260 400"
      width={260 * scale}
      height={400 * scale}
      style={{ overflow: 'visible' }}
    >
      <Defs />
      <g transform={`translate(${idle.sway.x}, ${bodyY}) rotate(${idle.sway.rotation})`}>
        {/* Ground shadow */}
        <ellipse cx={0} cy={142} rx={38} ry={5} fill={C.shadow} />

        {/* Legs & shoes */}
        <Legs />

        {/* Body (shirt + vest + bowtie + neck) */}
        <g transform={`scale(${idle.breathing.scaleX}, 1)`}>
          <Body />
        </g>

        {/* Left arm (gesture / pointing) */}
        <LeftArm gestureRotation={talkGesture} />

        {/* Right arm + pint glass */}
        <RightArm beerSway={idle.beerSway} />

        {/* Head */}
        <g transform={`translate(0, -105) rotate(${emo.headTilt})`}>
          <Head emo={emo} blink={idle.blink} pupil={idle.pupil} mouthShape={mouthShape} talking={talking} />
        </g>
      </g>
    </svg>
  );
};

// ─── Legs ──────────────────────────────────────────────────
const Legs: React.FC = () => (
  <g>
    {/* Left leg */}
    <path
      d="M-16,68 Q-18,100 -20,130"
      fill="none" stroke={C.outline} strokeWidth={10} strokeLinecap="round"
    />
    <path
      d="M-16,68 Q-18,100 -20,130"
      fill="none" stroke="url(#pp-pants-grad)" strokeWidth={7} strokeLinecap="round"
    />
    {/* Right leg */}
    <path
      d="M16,68 Q18,100 20,130"
      fill="none" stroke={C.outline} strokeWidth={10} strokeLinecap="round"
    />
    <path
      d="M16,68 Q18,100 20,130"
      fill="none" stroke="url(#pp-pants-grad)" strokeWidth={7} strokeLinecap="round"
    />
    {/* Knee fold hints */}
    <line x1={-20} y1={100} x2={-15} y2={101} stroke={C.pantsDark} strokeWidth={0.8} opacity={0.4} />
    <line x1={20} y1={100} x2={15} y2={101} stroke={C.pantsDark} strokeWidth={0.8} opacity={0.4} />
    {/* Left shoe */}
    <ellipse cx={-24} cy={135} rx={16} ry={7} fill="url(#pp-shoe-grad)" stroke={C.outline} strokeWidth={2.5} />
    <ellipse cx={-27} cy={133} rx={4} ry={2} fill={C.shoeHighlight} opacity={0.3} />
    {/* Right shoe */}
    <ellipse cx={24} cy={135} rx={16} ry={7} fill="url(#pp-shoe-grad)" stroke={C.outline} strokeWidth={2.5} />
    <ellipse cx={21} cy={133} rx={4} ry={2} fill={C.shoeHighlight} opacity={0.3} />
  </g>
);

// ─── Body ──────────────────────────────────────────────────
const Body: React.FC = () => (
  <g>
    {/* Torso with slight belly bulge */}
    <path
      d="M-42,-42 Q-42,-50 -30,-50 L30,-50 Q42,-50 42,-42 L42,40 Q42,75 0,78 Q-42,75 -42,40 Z"
      fill="url(#pp-shirt-grad)" stroke={C.outline} strokeWidth={SW}
    />
    {/* Belly shadow */}
    <ellipse cx={2} cy={55} rx={26} ry={16} fill={C.shadow} />
    {/* Shirt center fold */}
    <line x1={0} y1={-15} x2={0} y2={60} stroke={C.shirtFold} strokeWidth={1.2} opacity={0.5} />
    {/* Shirt side folds */}
    <path d="M-20,-10 Q-18,20 -22,50" fill="none" stroke={C.shirtFold} strokeWidth={0.8} opacity={0.3} />
    <path d="M20,-10 Q18,20 22,50" fill="none" stroke={C.shirtFold} strokeWidth={0.8} opacity={0.3} />

    {/* Vest left */}
    <path
      d="M-39,-38 L-39,45 Q-39,72 -15,75 L-8,75 L-8,-22 Q-8,-38 -22,-38 Z"
      fill="url(#pp-vest-grad)" stroke={C.outline} strokeWidth={SW}
    />
    {/* Vest left inner shadow */}
    <path d="M-35,-30 L-35,60" stroke={C.vestDark} strokeWidth={2.5} opacity={0.25} />
    {/* Vest left highlight edge */}
    <path d="M-38,-35 L-38,45" stroke={C.vestHighlight} strokeWidth={0.8} opacity={0.2} />

    {/* Vest right */}
    <path
      d="M39,-38 L39,45 Q39,72 15,75 L8,75 L8,-22 Q8,-38 22,-38 Z"
      fill="url(#pp-vest-grad)" stroke={C.outline} strokeWidth={SW}
    />
    {/* Vest right inner shadow */}
    <path d="M35,-30 L35,60" stroke={C.vestDark} strokeWidth={2.5} opacity={0.25} />

    {/* Vest buttons - golden with highlight */}
    {[-5, 18, 41].map((y) => (
      <g key={y}>
        <circle cx={0} cy={y} r={4} fill="url(#pp-bowtie-grad)" stroke={C.outline} strokeWidth={1.5} />
        <circle cx={-1} cy={y - 1} r={1.2} fill={C.bowtieLight} opacity={0.5} />
      </g>
    ))}

    {/* Neck */}
    <rect x={-12} y={-49} width={24} height={13} rx={2} fill="url(#pp-skin-grad)" stroke={C.outline} strokeWidth={SW} />
    {/* Neck shadow */}
    <ellipse cx={0} cy={-40} rx={10} ry={3} fill={C.skinShadow} opacity={0.3} />

    {/* Bowtie */}
    <g transform="translate(0, -42)">
      {/* Collar points */}
      <path d="M-14,0 L-8,-8 L0,0" fill={C.shirt} stroke={C.outline} strokeWidth={2} />
      <path d="M14,0 L8,-8 L0,0" fill={C.shirt} stroke={C.outline} strokeWidth={2} />
      {/* Bow left */}
      <path d="M0,0 L-17,-10 L-17,10 Z" fill="url(#pp-bowtie-grad)" stroke={C.outline} strokeWidth={2} />
      <path d="M-15,-6 L-12,-2" stroke={C.bowtieLight} strokeWidth={0.8} opacity={0.4} />
      {/* Bow right */}
      <path d="M0,0 L17,-10 L17,10 Z" fill="url(#pp-bowtie-grad)" stroke={C.outline} strokeWidth={2} />
      <path d="M15,-6 L12,-2" stroke={C.bowtieLight} strokeWidth={0.8} opacity={0.4} />
      {/* Center knot */}
      <circle cx={0} cy={0} r={5} fill={C.bowtieDark} stroke={C.outline} strokeWidth={2} />
      <circle cx={-1} cy={-1} r={1.5} fill={C.bowtieLight} opacity={0.3} />
    </g>
  </g>
);

// ─── Left Arm (pointing / gesturing) ──────────────────────
const LeftArm: React.FC<{ gestureRotation: number }> = ({ gestureRotation }) => (
  <g transform={`translate(-44, -25) rotate(${-12 + gestureRotation}, 0, 0)`}>
    {/* Rolled-up sleeve cuff */}
    <ellipse cx={0} cy={2} rx={7} ry={4} fill={C.shirtShadow} stroke={C.outline} strokeWidth={2} />
    {/* Upper arm */}
    <line x1={0} y1={0} x2={-18} y2={38} stroke={C.outline} strokeWidth={9} strokeLinecap="round" />
    <line x1={0} y1={0} x2={-18} y2={38} stroke={C.skin} strokeWidth={6} strokeLinecap="round" />
    <g transform="translate(-18, 38)">
      {/* Forearm */}
      <line x1={0} y1={0} x2={-8} y2={32} stroke={C.outline} strokeWidth={8} strokeLinecap="round" />
      <line x1={0} y1={0} x2={-8} y2={32} stroke={C.skin} strokeWidth={5.5} strokeLinecap="round" />
      {/* Hand - pointing */}
      <g transform="translate(-10, 34)">
        {/* Palm */}
        <ellipse cx={2} cy={0} rx={9} ry={7} fill="url(#pp-skin-grad)" stroke={C.outline} strokeWidth={SW} />
        {/* Pointing finger */}
        <line x1={-5} y1={-3} x2={-18} y2={-6} stroke={C.outline} strokeWidth={5} strokeLinecap="round" />
        <line x1={-5} y1={-3} x2={-18} y2={-6} stroke={C.skin} strokeWidth={3.5} strokeLinecap="round" />
        {/* Curled fingers */}
        <path d="M0,5 Q-4,9 -2,11" fill="none" stroke={C.outline} strokeWidth={2} strokeLinecap="round" />
        <path d="M3,6 Q0,10 2,12" fill="none" stroke={C.outline} strokeWidth={2} strokeLinecap="round" />
        <path d="M6,5 Q4,9 6,11" fill="none" stroke={C.outline} strokeWidth={2} strokeLinecap="round" />
        {/* Thumb hint */}
        <path d="M8,-2 Q10,2 8,5" fill="none" stroke={C.outlineSoft} strokeWidth={1.5} strokeLinecap="round" />
      </g>
    </g>
  </g>
);

// ─── Pint Glass (integrated) ──────────────────────────────
const PintGlass: React.FC<{ liquidOffset: number }> = ({ liquidOffset }) => (
  <g transform="scale(1.1)">
    {/* Beer liquid */}
    <g clipPath="url(#pp-pint-clip)">
      <rect x={-14} y={-42 + liquidOffset} width={28} height={54} fill="url(#pp-beer-grad)" opacity={0.85} />
      {/* Beer darker bottom */}
      <rect x={-14} y={-10} width={28} height={12} fill={C.beerDark} opacity={0.25} />
      {/* Amber light refraction */}
      <rect x={-4} y={-38 + liquidOffset} width={6} height={40} fill={C.beerLight} opacity={0.15} />
    </g>

    {/* Foam */}
    <g clipPath="url(#pp-pint-clip)">
      <rect x={-13} y={-52 + liquidOffset} width={26} height={12} fill={C.foam} opacity={0.95} />
      <ellipse cx={-5} cy={-50 + liquidOffset} rx={5} ry={3.5} fill={C.foamWhite} opacity={0.7} />
      <ellipse cx={4} cy={-49 + liquidOffset} rx={4.5} ry={3} fill={C.foamWhite} opacity={0.6} />
      <ellipse cx={-1} cy={-52 + liquidOffset} rx={4} ry={2.5} fill={C.foamWhite} opacity={0.5} />
      <ellipse cx={7} cy={-51 + liquidOffset} rx={3} ry={2} fill={C.foamWhite} opacity={0.5} />
      <ellipse cx={-8} cy={-48 + liquidOffset} rx={3.5} ry={2.5} fill={C.foamWhite} opacity={0.4} />
      {/* Foam drip */}
      <ellipse cx={11} cy={-38} rx={2} ry={4} fill={C.foam} opacity={0.6} />
    </g>

    {/* Glass body */}
    <path
      d="M-14,-2 L-11,-52 Q-10,-55 -8,-55 L8,-55 Q10,-55 11,-52 L14,-2 Q14,2 10,2 L-10,2 Q-14,2 -14,-2 Z"
      fill="rgba(255,255,255,0.10)"
      stroke={C.outline}
      strokeWidth={2.5}
    />
    {/* Glass highlight streak */}
    <line x1={-8} y1={-50} x2={-6} y2={-5} stroke="white" strokeWidth={2} opacity={0.2} />
    {/* Glass rim highlight */}
    <line x1={-8} y1={-54} x2={8} y2={-54} stroke="white" strokeWidth={1} opacity={0.3} />

    {/* Handle */}
    <path d="M14,-38 Q26,-36 26,-20 Q26,-4 14,-2" fill="none" stroke={C.outline} strokeWidth={3} />
    <path d="M14,-36 Q24,-34 24,-20 Q24,-6 14,-4" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={2} />
  </g>
);

// ─── Right Arm (holding pint) ──────────────────────────────
const RightArm: React.FC<{ beerSway: { rotation: number; liquidOffset: number } }> = ({ beerSway }) => (
  <g transform="translate(44, -20)">
    {/* Rolled-up sleeve cuff */}
    <ellipse cx={0} cy={2} rx={7} ry={4} fill={C.shirtShadow} stroke={C.outline} strokeWidth={2} />
    {/* Upper arm */}
    <line x1={0} y1={0} x2={16} y2={32} stroke={C.outline} strokeWidth={9} strokeLinecap="round" />
    <line x1={0} y1={0} x2={16} y2={32} stroke={C.skin} strokeWidth={6} strokeLinecap="round" />
    {/* Lower arm bent to hold pint */}
    <g transform="translate(16, 32) rotate(-50)">
      <line x1={0} y1={0} x2={3} y2={26} stroke={C.outline} strokeWidth={8} strokeLinecap="round" />
      <line x1={0} y1={0} x2={3} y2={26} stroke={C.skin} strokeWidth={5.5} strokeLinecap="round" />
      {/* Hand + pint group */}
      <g transform={`translate(5, 28) rotate(${50 + beerSway.rotation})`}>
        {/* Hand behind glass */}
        <ellipse cx={0} cy={-14} rx={10} ry={7} fill="url(#pp-skin-grad)" stroke={C.outline} strokeWidth={SW} />
        {/* Pint glass */}
        <g transform="translate(0, 8)">
          <PintGlass liquidOffset={beerSway.liquidOffset} />
        </g>
        {/* Fingers in front of glass */}
        <path d="M-7,-20 Q-9,-15 -7,-10" fill="none" stroke={C.outline} strokeWidth={2} />
        <path d="M-7,-20 Q-9,-15 -7,-10" fill="none" stroke={C.skin} strokeWidth={1} opacity={0.5} />
        <path d="M6,-20 Q8,-15 6,-10" fill="none" stroke={C.outline} strokeWidth={2} />
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
    {/* Hair back layer */}
    <HairBack />

    {/* Face circle with radial gradient */}
    <circle cx={0} cy={0} r={50} fill="url(#pp-face-grad)" stroke={C.outline} strokeWidth={SW} />

    {/* Face highlight (forehead) */}
    <ellipse cx={-6} cy={-28} rx={16} ry={9} fill="white" opacity={0.2} />
    <ellipse cx={-4} cy={-33} rx={7} ry={4} fill="white" opacity={0.15} />

    {/* Cheek shadow */}
    <ellipse cx={-32} cy={12} rx={10} ry={14} fill={C.skinShadow} opacity={0.15} />
    <ellipse cx={32} cy={12} rx={10} ry={14} fill={C.skinShadow} opacity={0.1} />

    {/* Hair front layer */}
    <HairFront />

    {/* Glasses */}
    <Glasses />

    {/* Left eye */}
    <g transform={`translate(-17, ${-2 + emo.eyeOffsetY})`}>
      <Eye blink={blink} scaleY={emo.eyeScaleY} pupilScale={emo.pupilScale} px={pupil.x} py={pupil.y} />
    </g>
    {/* Right eye */}
    <g transform={`translate(17, ${-2 + emo.eyeOffsetY})`}>
      <Eye blink={blink} scaleY={emo.eyeScaleY} pupilScale={emo.pupilScale} px={pupil.x} py={pupil.y} />
    </g>

    {/* Left eyebrow */}
    <g transform={`translate(-17, ${-15 + emo.browLeftY}) rotate(${emo.browLeftRotation})`}>
      <rect x={-10} y={0} width={20} height={4} rx={2} fill={C.hairDark} />
      <rect x={-9} y={0.5} width={18} height={2} rx={1} fill={C.hairMid} opacity={0.3} />
    </g>
    {/* Right eyebrow */}
    <g transform={`translate(17, ${-15 + emo.browRightY}) rotate(${emo.browRightRotation})`}>
      <rect x={-10} y={0} width={20} height={4} rx={2} fill={C.hairDark} />
      <rect x={-9} y={0.5} width={18} height={2} rx={1} fill={C.hairMid} opacity={0.3} />
    </g>

    {/* Blush */}
    {emo.blushOpacity > 0.01 && (
      <>
        <ellipse cx={-28} cy={14} rx={9} ry={5.5} fill={C.blush} opacity={emo.blushOpacity * 0.8} />
        <ellipse cx={28} cy={14} rx={9} ry={5.5} fill={C.blush} opacity={emo.blushOpacity * 0.8} />
      </>
    )}

    {/* Nose */}
    <path d="M-3,8 Q0,16 3,8" fill="none" stroke={C.outline} strokeWidth={2.2} strokeLinecap="round" />
    {/* Nose highlight */}
    <circle cx={1} cy={10} r={1.5} fill="white" opacity={0.15} />

    {/* Stubble */}
    <Stubble />

    {/* Mouth */}
    <Mouth shape={mouthShape} curve={emo.mouthCurve} width={emo.mouthWidth} emotionOpen={emo.mouthOpen} talking={talking} />
  </g>
);

// ─── Hair Back ─────────────────────────────────────────────
const HairBack: React.FC = () => (
  <g>
    {/* Main hair mass */}
    <path
      d="M-42,20 Q-55,15 -58,0 Q-62,-15 -55,-25 Q-58,-35 -50,-40 Q-45,-45 -38,-40
         L38,-40 Q45,-45 50,-40 Q58,-35 55,-25 Q62,-15 58,0 Q55,15 42,20
         L35,35 Q20,45 0,45 Q-20,45 -35,35 Z"
      fill="url(#pp-hair-grad)" stroke={C.outline} strokeWidth={2.5}
    />
    {/* Hair volume shadows */}
    <path d="M-30,30 Q-35,38 -25,40" fill="none" stroke={C.hairDark} strokeWidth={1.8} opacity={0.35} />
    <path d="M25,30 Q30,38 22,40" fill="none" stroke={C.hairDark} strokeWidth={1.8} opacity={0.35} />
    <path d="M0,38 Q5,44 -3,43" fill="none" stroke={C.hairDark} strokeWidth={1.5} opacity={0.25} />
    {/* Hair highlights */}
    <path d="M-15,-38 Q-10,-42 -5,-38" fill="none" stroke={C.hairLight} strokeWidth={1.5} opacity={0.3} />
    <path d="M10,-38 Q15,-42 20,-38" fill="none" stroke={C.hairLight} strokeWidth={1.5} opacity={0.3} />
  </g>
);

// ─── Hair Front ────────────────────────────────────────────
const HairFront: React.FC = () => (
  <g>
    {/* Left wild tufts */}
    <path
      d="M-46,-5 Q-58,-8 -60,-20 Q-62,-30 -55,-35 Q-58,-42 -52,-44 Q-48,-48 -42,-42"
      fill="url(#pp-hair-grad)" stroke={C.outline} strokeWidth={2.5}
    />
    <path d="M-48,8 Q-60,5 -62,-5 Q-64,-12 -58,-15" fill="url(#pp-hair-grad)" stroke={C.outline} strokeWidth={2} />
    <path d="M-46,20 Q-58,18 -60,8 Q-62,0 -55,-2" fill="url(#pp-hair-grad)" stroke={C.outline} strokeWidth={2} />
    {/* Left tuft detail lines */}
    <path d="M-55,-38 Q-62,-35 -58,-28" fill="none" stroke={C.outline} strokeWidth={1.5} />
    <path d="M-57,-10 Q-65,-8 -62,-2" fill="none" stroke={C.outline} strokeWidth={1.5} />
    {/* Left highlights */}
    <path d="M-52,-30 Q-50,-25 -53,-20" fill="none" stroke={C.hairLight} strokeWidth={1.5} opacity={0.35} />

    {/* Right wild tufts */}
    <path
      d="M46,-5 Q58,-8 60,-20 Q62,-30 55,-35 Q58,-42 52,-44 Q48,-48 42,-42"
      fill="url(#pp-hair-grad)" stroke={C.outline} strokeWidth={2.5}
    />
    <path d="M48,8 Q60,5 62,-5 Q64,-12 58,-15" fill="url(#pp-hair-grad)" stroke={C.outline} strokeWidth={2} />
    <path d="M46,20 Q58,18 60,8 Q62,0 55,-2" fill="url(#pp-hair-grad)" stroke={C.outline} strokeWidth={2} />
    {/* Right tuft detail lines */}
    <path d="M55,-38 Q62,-35 58,-28" fill="none" stroke={C.outline} strokeWidth={1.5} />
    <path d="M57,-10 Q65,-8 62,-2" fill="none" stroke={C.outline} strokeWidth={1.5} />
    {/* Right highlights */}
    <path d="M52,-30 Q50,-25 53,-20" fill="none" stroke={C.hairLight} strokeWidth={1.5} opacity={0.35} />

    {/* Top wild strands */}
    <path d="M-20,-48 Q-22,-55 -18,-52" fill="none" stroke={C.hair} strokeWidth={2} opacity={0.6} />
    <path d="M5,-48 Q3,-56 7,-53" fill="none" stroke={C.hair} strokeWidth={2} opacity={0.6} />
    <path d="M-8,-47 Q-10,-54 -6,-51" fill="none" stroke={C.hair} strokeWidth={1.5} opacity={0.5} />
  </g>
);

// ─── Glasses ───────────────────────────────────────────────
const Glasses: React.FC = () => (
  <g transform="translate(0, -2)">
    {/* Left lens */}
    <circle cx={-17} cy={0} r={14} fill={C.glassLens} stroke={C.glassFrame} strokeWidth={2.5} />
    <ellipse cx={-21} cy={-5} rx={5} ry={3.5} fill={C.glassShine} />
    {/* Right lens */}
    <circle cx={17} cy={0} r={14} fill={C.glassLens} stroke={C.glassFrame} strokeWidth={2.5} />
    <ellipse cx={13} cy={-5} rx={5} ry={3.5} fill={C.glassShine} />
    {/* Bridge */}
    <path d="M-3,0 Q0,-3 3,0" fill="none" stroke={C.glassFrame} strokeWidth={2.5} />
    {/* Temple arms */}
    <line x1={-31} y1={-2} x2={-46} y2={-6} stroke={C.glassFrame} strokeWidth={2} />
    <line x1={31} y1={-2} x2={46} y2={-6} stroke={C.glassFrame} strokeWidth={2} />
  </g>
);

// ─── Eye ───────────────────────────────────────────────────
interface EyeProps { blink: number; scaleY: number; pupilScale: number; px: number; py: number; }

const Eye: React.FC<EyeProps> = ({ blink, scaleY, pupilScale, px, py }) => (
  <g transform={`scale(1, ${scaleY * blink})`}>
    {/* Eye white with subtle shadow at top */}
    <ellipse cx={0} cy={0} rx={8.5} ry={6.5} fill={C.eyeWhite} stroke={C.outline} strokeWidth={1.5} />
    <ellipse cx={0} cy={-3} rx={7} ry={2.5} fill={C.eyeShadow} opacity={0.2} />
    {/* Iris with gradient */}
    <circle cx={px} cy={py} r={4 * pupilScale} fill="url(#pp-iris-grad)" />
    {/* Pupil */}
    <circle cx={px} cy={py} r={2.2 * pupilScale} fill={C.pupil} />
    {/* Eye shine */}
    <circle cx={px + 1.5} cy={py - 1.5} r={1.4} fill="white" opacity={0.85} />
    <circle cx={px - 1} cy={py + 1} r={0.6} fill="white" opacity={0.4} />
  </g>
);

// ─── Stubble ───────────────────────────────────────────────
const Stubble: React.FC = () => (
  <g opacity={0.55}>
    {/* Chin and jawline stubble dots */}
    {[
      [-6, 36, 0.8], [0, 38, 0.8], [6, 36, 0.8],
      [-3, 40, 0.8], [3, 40, 0.8],
      [-9, 34, 0.7], [9, 34, 0.7],
      [-14, 30, 0.7], [14, 30, 0.7],
      [-18, 26, 0.7], [18, 26, 0.7],
      [-12, 33, 0.7], [12, 33, 0.7],
      [-4, 34, 0.6], [4, 34, 0.6], [0, 35, 0.6],
      [-8, 37, 0.6], [8, 37, 0.6],
      [-16, 28, 0.6], [16, 28, 0.6],
      [-10, 36, 0.5], [10, 36, 0.5],
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
  const hw = 12 * width;

  // Closed mouth
  if (openAmount < 1) {
    return (
      <path d={`M${-hw},26 Q0,${26 + curve} ${hw},26`}
        fill="none" stroke={C.outline} strokeWidth={2.5} strokeLinecap="round" />
    );
  }

  // Open mouth
  return (
    <g transform="translate(0, 26)">
      {/* Mouth opening with gradient */}
      <ellipse cx={0} cy={0} rx={hw} ry={openAmount * 0.5 + Math.abs(curve) * 0.2}
        fill={C.mouth} stroke={C.outline} strokeWidth={2.5} />
      {/* Inner mouth darker */}
      <ellipse cx={0} cy={1} rx={hw * 0.8} ry={openAmount * 0.35}
        fill={C.mouthDark} opacity={0.4} />
      {/* Tongue */}
      {openAmount > 6 && (
        <ellipse cx={2} cy={openAmount * 0.25} rx={hw * 0.5} ry={openAmount * 0.2} fill={C.tongue} />
      )}
      {/* Teeth */}
      {openAmount > 3 && (
        <>
          <rect x={-hw * 0.6} y={-openAmount * 0.35} width={hw * 1.2} height={2.8} fill={C.teeth} rx={1} />
          {/* Tooth gaps */}
          <line x1={-hw * 0.15} y1={-openAmount * 0.35} x2={-hw * 0.15} y2={-openAmount * 0.35 + 2.8}
            stroke={C.shirtFold} strokeWidth={0.5} opacity={0.3} />
          <line x1={hw * 0.15} y1={-openAmount * 0.35} x2={hw * 0.15} y2={-openAmount * 0.35 + 2.8}
            stroke={C.shirtFold} strokeWidth={0.5} opacity={0.3} />
        </>
      )}
    </g>
  );
};

export default ProfessorPint;
