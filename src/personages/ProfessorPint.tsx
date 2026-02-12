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

// ─── Color Palette (70+ unique colors) ─────────────────────
const C = {
  // Skin tones (7)
  skin: '#FDDCB5',
  skinMid: '#F0CCA3',
  skinShadow: '#E0B88E',
  skinDeep: '#D0A878',
  skinHighlight: '#FFF0DD',
  skinWarm: '#F5D4AA',
  skinKnuckle: '#E8BFA0',
  // Outline (3)
  outline: '#1A1A1A',
  outlineSoft: '#2A2A2A',
  outlineFaint: '#444444',
  // Vest (6)
  vest: '#2D5016',
  vestDark: '#1F3A0F',
  vestDeep: '#152A08',
  vestLight: '#3A6820',
  vestHighlight: '#4A7A2E',
  vestStitch: '#1A3008',
  // Shirt (5)
  shirt: '#FFFFFF',
  shirtShadow: '#E6E6E6',
  shirtFold: '#D8D8D8',
  shirtCrease: '#CCCCCC',
  shirtWarm: '#FFF8F0',
  // Bowtie (4)
  bowtie: '#D4A012',
  bowtieDark: '#B8890F',
  bowtieLight: '#E8B82A',
  bowtieShine: '#F0D060',
  // Hair (6)
  hair: '#D4D4D4',
  hairDark: '#AAAAAA',
  hairDeep: '#909090',
  hairMid: '#C0C0C0',
  hairLight: '#ECECEC',
  hairWhite: '#F8F8F8',
  // Eyes & glasses (8)
  glassFrame: '#3A3A3A',
  glassFrameLight: '#555555',
  glassLens: 'rgba(200,220,240,0.18)',
  glassShine: 'rgba(255,255,255,0.18)',
  pupil: '#1A1A1A',
  iris: '#4A6741',
  irisLight: '#5C7B52',
  irisDark: '#3A5534',
  eyeWhite: '#FFFFFF',
  eyeShadow: '#E8E0D8',
  // Mouth (5)
  mouth: '#8B2020',
  mouthDark: '#6B1515',
  mouthDeep: '#4A0A0A',
  tongue: '#CC5555',
  teeth: '#FFFEF5',
  // Blush
  blush: '#FFAAAA',
  // Beer (7)
  beerAmber: '#D4A012',
  beerDark: '#B8890F',
  beerDeep: '#9A7008',
  beerLight: '#E8C040',
  beerGlow: '#F0D868',
  foam: '#FFF8E7',
  foamWhite: '#FFFFFF',
  foamShadow: '#E8E0C8',
  // Glass (3)
  glassClear: 'rgba(255,255,255,0.08)',
  glassEdge: 'rgba(255,255,255,0.25)',
  glassRefract: 'rgba(200,180,120,0.06)',
  // Pants & shoes (6)
  pants: '#3A3A3A',
  pantsDark: '#2A2A2A',
  pantsHighlight: '#4A4A4A',
  pantsFold: '#333333',
  shoe: '#2D1A0A',
  shoeDark: '#1A0F05',
  shoeHighlight: '#4A3020',
  shoeSole: '#1A1A1A',
  // Misc
  shadow: 'rgba(0,0,0,0.08)',
  shadowMid: 'rgba(0,0,0,0.12)',
  shadowDeep: 'rgba(0,0,0,0.18)',
};

const SW = 3;

// ─── Gradient Definitions ──────────────────────────────────
const Defs: React.FC = () => (
  <defs>
    {/* Skin gradients */}
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

    {/* Clothing gradients */}
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

    {/* Accessory gradients */}
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

    {/* Beer gradients */}
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

    {/* Clip paths */}
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
        {/* Ground shadow - elongated, soft */}
        <ellipse cx={2} cy={145} rx={45} ry={6} fill={C.shadowMid} />
        <ellipse cx={2} cy={145} rx={32} ry={4} fill={C.shadowDeep} />

        <Legs />

        <g transform={`scale(${idle.breathing.scaleX}, 1)`}>
          <Body />
        </g>

        {/* Left arm OVERLAPS vest edge */}
        <LeftArm gestureRotation={talkGesture} />

        {/* Right arm OVERLAPS vest edge */}
        <RightArm beerSway={idle.beerSway} />

        <g transform={`translate(0, -108) rotate(${emo.headTilt})`}>
          <Head emo={emo} blink={idle.blink} pupil={idle.pupil} mouthShape={mouthShape} talking={talking} />
        </g>
      </g>
    </svg>
  );
};

// ─── Legs ──────────────────────────────────────────────────
const Legs: React.FC = () => (
  <g>
    {/* Left leg - slight curve, not straight */}
    <path d="M-18,70 Q-20,95 -22,115 Q-23,125 -22,135" fill="none" stroke={C.outline} strokeWidth={12} strokeLinecap="round" />
    <path d="M-18,70 Q-20,95 -22,115 Q-23,125 -22,135" fill="none" stroke="url(#pp-pants-grad)" strokeWidth={9} strokeLinecap="round" />
    {/* Left leg creases */}
    <path d="M-24,90 Q-20,92 -17,90" fill="none" stroke={C.pantsFold} strokeWidth={0.8} opacity={0.5} />
    <path d="M-25,105 Q-21,107 -18,105" fill="none" stroke={C.pantsFold} strokeWidth={0.7} opacity={0.4} />
    <path d="M-25,118 Q-21,120 -18,118" fill="none" stroke={C.pantsFold} strokeWidth={0.6} opacity={0.3} />

    {/* Right leg */}
    <path d="M18,70 Q20,95 21,115 Q22,125 21,135" fill="none" stroke={C.outline} strokeWidth={12} strokeLinecap="round" />
    <path d="M18,70 Q20,95 21,115 Q22,125 21,135" fill="none" stroke="url(#pp-pants-grad)" strokeWidth={9} strokeLinecap="round" />
    {/* Right leg creases */}
    <path d="M17,92 Q21,94 24,92" fill="none" stroke={C.pantsFold} strokeWidth={0.8} opacity={0.5} />
    <path d="M17,108 Q21,110 24,108" fill="none" stroke={C.pantsFold} strokeWidth={0.7} opacity={0.4} />

    {/* Left shoe - angled slightly outward */}
    <g transform="translate(-26, 137) rotate(-5)">
      <ellipse cx={0} cy={0} rx={18} ry={8} fill="url(#pp-shoe-grad)" stroke={C.outline} strokeWidth={2.5} />
      <ellipse cx={-4} cy={-2} rx={5} ry={2.5} fill={C.shoeHighlight} opacity={0.25} />
      <path d="M-14,2 Q-14,5 -10,5 L10,5 Q14,5 14,2" fill={C.shoeSole} opacity={0.6} />
      <path d="M-8,-3 Q-6,-4 -4,-3" fill="none" stroke={C.shoeHighlight} strokeWidth={0.6} opacity={0.3} />
    </g>
    {/* Right shoe */}
    <g transform="translate(25, 137) rotate(5)">
      <ellipse cx={0} cy={0} rx={18} ry={8} fill="url(#pp-shoe-grad)" stroke={C.outline} strokeWidth={2.5} />
      <ellipse cx={-3} cy={-2} rx={5} ry={2.5} fill={C.shoeHighlight} opacity={0.2} />
      <path d="M-14,2 Q-14,5 -10,5 L10,5 Q14,5 14,2" fill={C.shoeSole} opacity={0.6} />
    </g>
  </g>
);

// ─── Body ──────────────────────────────────────────────────
const Body: React.FC = () => (
  <g>
    {/* Torso — WIDER shoulders (-48 to 48), belly bulge at bottom */}
    <path
      d="M-48,-45 Q-48,-52 -34,-52 L34,-52 Q48,-52 48,-45
         L46,20 Q45,50 38,62 Q30,75 0,80 Q-30,75 -38,62 Q-45,50 -46,20 Z"
      fill="url(#pp-shirt-grad)" stroke={C.outline} strokeWidth={SW}
    />
    {/* Belly volume — real curve, not just shadow */}
    <path
      d="M-30,30 Q-32,55 -20,68 Q-10,75 0,76 Q10,75 20,68 Q32,55 30,30"
      fill={C.shirtShadow} opacity={0.25}
    />
    {/* Belly highlight - rounded volume */}
    <ellipse cx={-5} cy={48} rx={14} ry={10} fill="white" opacity={0.08} />
    {/* Shirt folds - more creases for fabric feel */}
    <line x1={0} y1={-15} x2={1} y2={62} stroke={C.shirtCrease} strokeWidth={1.2} opacity={0.45} />
    <path d="M-22,-10 Q-19,15 -20,35 Q-22,50 -26,62" fill="none" stroke={C.shirtFold} strokeWidth={0.9} opacity={0.35} />
    <path d="M22,-10 Q19,15 20,35 Q22,50 26,62" fill="none" stroke={C.shirtFold} strokeWidth={0.9} opacity={0.35} />
    <path d="M-12,-5 Q-10,20 -14,45" fill="none" stroke={C.shirtFold} strokeWidth={0.6} opacity={0.2} />
    <path d="M12,-5 Q10,20 14,45" fill="none" stroke={C.shirtFold} strokeWidth={0.6} opacity={0.2} />
    {/* Shirt pull at buttons */}
    <path d="M-6,-8 Q-2,-6 -6,-3" fill="none" stroke={C.shirtCrease} strokeWidth={0.5} opacity={0.3} />
    <path d="M6,-8 Q2,-6 6,-3" fill="none" stroke={C.shirtCrease} strokeWidth={0.5} opacity={0.3} />

    {/* ─── Vest left — CURVES with belly ─── */}
    <path
      d="M-45,-40 Q-45,-48 -30,-48
         L-8,-28 L-8,10 Q-10,40 -16,55 Q-22,68 -30,72
         L-35,68 Q-42,58 -44,40 Q-46,20 -45,-40 Z"
      fill="url(#pp-vest-grad-l)" stroke={C.outline} strokeWidth={SW}
    />
    {/* Vest left - lapel fold */}
    <path d="M-8,-28 Q-12,-20 -10,-10" fill="none" stroke={C.vestDark} strokeWidth={1.5} opacity={0.5} />
    {/* Vest left - fabric tension lines */}
    <path d="M-38,-30 Q-35,-15 -38,5" stroke={C.vestDark} strokeWidth={1.8} opacity={0.2} />
    <path d="M-35,15 Q-32,30 -35,45" stroke={C.vestDeep} strokeWidth={1.2} opacity={0.2} />
    {/* Vest left - edge highlight (light from left) */}
    <path d="M-44,-38 Q-44,-10 -43,20" stroke={C.vestHighlight} strokeWidth={1} opacity={0.25} />
    {/* Vest left - stitch line */}
    <path d="M-40,-35 Q-40,10 -38,45" stroke={C.vestStitch} strokeWidth={0.5} opacity={0.15} strokeDasharray="3,4" />

    {/* ─── Vest right — CURVES with belly ─── */}
    <path
      d="M45,-40 Q45,-48 30,-48
         L8,-28 L8,10 Q10,40 16,55 Q22,68 30,72
         L35,68 Q42,58 44,40 Q46,20 45,-40 Z"
      fill="url(#pp-vest-grad-r)" stroke={C.outline} strokeWidth={SW}
    />
    {/* Vest right - lapel fold */}
    <path d="M8,-28 Q12,-20 10,-10" fill="none" stroke={C.vestDark} strokeWidth={1.5} opacity={0.5} />
    {/* Vest right - shadow (light from left, so right is darker) */}
    <path d="M38,-30 Q35,-15 38,5" stroke={C.vestDeep} strokeWidth={2} opacity={0.25} />
    <path d="M35,15 Q32,30 35,45" stroke={C.vestDeep} strokeWidth={1.5} opacity={0.2} />
    {/* Vest right - stitch line */}
    <path d="M40,-35 Q40,10 38,45" stroke={C.vestStitch} strokeWidth={0.5} opacity={0.12} strokeDasharray="3,4" />

    {/* Vest buttons — golden with radial gradient */}
    {[-8, 15, 38].map((y, i) => (
      <g key={y}>
        <circle cx={0} cy={y} r={4.5} fill="url(#pp-button-grad)" stroke={C.outline} strokeWidth={1.5} />
        <circle cx={-1.2} cy={y - 1.2} r={1.5} fill={C.bowtieShine} opacity={0.5} />
        {/* Button thread holes */}
        <circle cx={-1} cy={y + 0.5} r={0.5} fill={C.bowtieDark} opacity={0.4} />
        <circle cx={1} cy={y + 0.5} r={0.5} fill={C.bowtieDark} opacity={0.4} />
        {/* Fabric pull around buttons */}
        {i < 2 && (
          <>
            <path d={`M-5,${y} Q-3,${y + 2} -5,${y + 4}`} fill="none" stroke={C.shirtCrease} strokeWidth={0.4} opacity={0.25} />
            <path d={`M5,${y} Q3,${y + 2} 5,${y + 4}`} fill="none" stroke={C.shirtCrease} strokeWidth={0.4} opacity={0.25} />
          </>
        )}
      </g>
    ))}

    {/* Neck — wider, gradient */}
    <path
      d="M-13,-50 Q-13,-55 -10,-55 L10,-55 Q13,-55 13,-50 L12,-40 L-12,-40 Z"
      fill="url(#pp-neck-grad)" stroke={C.outline} strokeWidth={SW}
    />
    {/* Neck shadow under chin */}
    <ellipse cx={0} cy={-42} rx={11} ry={3} fill={C.skinDeep} opacity={0.35} />
    {/* Neck tendon hints */}
    <line x1={-5} y1={-50} x2={-4} y2={-42} stroke={C.skinShadow} strokeWidth={0.6} opacity={0.2} />
    <line x1={5} y1={-50} x2={4} y2={-42} stroke={C.skinShadow} strokeWidth={0.6} opacity={0.2} />

    {/* ─── Bowtie — larger, with fabric folds ─── */}
    <g transform="translate(0, -44)">
      {/* Collar points */}
      <path d="M-15,0 L-9,-9 L-1,0" fill={C.shirtWarm} stroke={C.outline} strokeWidth={2} />
      <path d="M15,0 L9,-9 L1,0" fill={C.shirt} stroke={C.outline} strokeWidth={2} />
      {/* Bow left — with folds */}
      <path d="M0,0 L-19,-11 Q-20,-6 -19,0 Q-20,6 -19,11 Z" fill="url(#pp-bowtie-grad)" stroke={C.outline} strokeWidth={2} />
      <path d="M-3,-2 Q-10,-8 -16,-9" fill="none" stroke={C.bowtieDark} strokeWidth={0.8} opacity={0.4} />
      <path d="M-3,2 Q-10,8 -16,9" fill="none" stroke={C.bowtieDark} strokeWidth={0.8} opacity={0.4} />
      <path d="M-15,-6 L-12,-2" stroke={C.bowtieShine} strokeWidth={0.8} opacity={0.35} />
      {/* Bow right — with folds */}
      <path d="M0,0 L19,-11 Q20,-6 19,0 Q20,6 19,11 Z" fill="url(#pp-bowtie-grad)" stroke={C.outline} strokeWidth={2} />
      <path d="M3,-2 Q10,-8 16,-9" fill="none" stroke={C.bowtieDark} strokeWidth={0.8} opacity={0.4} />
      <path d="M3,2 Q10,8 16,9" fill="none" stroke={C.bowtieDark} strokeWidth={0.8} opacity={0.4} />
      {/* Center knot — textured */}
      <ellipse cx={0} cy={0} rx={5.5} ry={5} fill={C.bowtieDark} stroke={C.outline} strokeWidth={2} />
      <ellipse cx={-1} cy={-1} rx={2} ry={1.5} fill={C.bowtieShine} opacity={0.25} />
      <path d="M-3,2 Q0,4 3,2" fill="none" stroke={C.outline} strokeWidth={0.5} opacity={0.3} />
    </g>
  </g>
);

// ─── Left Arm — Expressive pointing hand ───────────────────
const LeftArm: React.FC<{ gestureRotation: number }> = ({ gestureRotation }) => (
  <g transform={`translate(-48, -35) rotate(${-15 + gestureRotation}, 0, 0)`}>
    {/* Sleeve cuff — rolled up, layered */}
    <ellipse cx={0} cy={3} rx={8} ry={5} fill={C.shirtShadow} stroke={C.outline} strokeWidth={2} />
    <ellipse cx={0} cy={1} rx={7.5} ry={3} fill={C.shirt} stroke={C.outline} strokeWidth={1} />

    {/* Upper arm — thicker, with muscle hint */}
    <path d="M0,0 Q-5,18 -16,38" fill="none" stroke={C.outline} strokeWidth={11} strokeLinecap="round" />
    <path d="M0,0 Q-5,18 -16,38" fill="none" stroke={C.skin} strokeWidth={7.5} strokeLinecap="round" />
    {/* Arm highlight */}
    <path d="M-2,5 Q-6,18 -14,32" fill="none" stroke={C.skinHighlight} strokeWidth={1.5} opacity={0.25} />

    <g transform="translate(-16, 38)">
      {/* Forearm — slight curve */}
      <path d="M0,0 Q-3,15 -6,32" fill="none" stroke={C.outline} strokeWidth={10} strokeLinecap="round" />
      <path d="M0,0 Q-3,15 -6,32" fill="none" stroke={C.skin} strokeWidth={7} strokeLinecap="round" />
      {/* Forearm highlight */}
      <path d="M1,3 Q-2,15 -5,28" fill="none" stroke={C.skinHighlight} strokeWidth={1.2} opacity={0.2} />

      {/* ─── HAND — Expressive pointing with foreshortening ─── */}
      <g transform="translate(-8, 34)">
        {/* Palm — larger, with depth */}
        <path
          d="M-4,-6 Q-10,-4 -12,2 Q-12,8 -6,10 L8,10 Q12,8 12,2 Q12,-4 6,-6 Z"
          fill="url(#pp-skin-grad)" stroke={C.outline} strokeWidth={2.5}
        />
        {/* Palm crease */}
        <path d="M-6,2 Q0,4 6,2" fill="none" stroke={C.skinShadow} strokeWidth={0.6} opacity={0.3} />
        <path d="M-4,5 Q0,7 4,5" fill="none" stroke={C.skinShadow} strokeWidth={0.5} opacity={0.2} />

        {/* POINTING FINGER — BIG, foreshortened toward viewer */}
        <g transform="translate(-10, -2)">
          {/* Finger base (thick, close to us) */}
          <path
            d="M0,0 Q-4,-1 -10,-2 Q-16,-3 -22,-3 Q-26,-3 -28,-1 Q-28,1 -26,3 Q-22,3 -16,3 Q-10,2 -4,1 Z"
            fill="url(#pp-skin-grad)" stroke={C.outline} strokeWidth={2.5}
          />
          {/* Fingertip - rounder, perspective */}
          <ellipse cx={-27} cy={0} rx={4} ry={3.5} fill={C.skin} stroke={C.outline} strokeWidth={2} />
          {/* Fingernail */}
          <ellipse cx={-29} cy={-0.5} rx={2} ry={1.8} fill={C.skinHighlight} stroke={C.outlineSoft} strokeWidth={0.8} />
          {/* Finger knuckle shadow */}
          <ellipse cx={-6} cy={0} rx={3} ry={2} fill={C.skinKnuckle} opacity={0.3} />
          {/* Finger joint line */}
          <path d="M-15,-2 Q-15,0 -15,2" fill="none" stroke={C.skinShadow} strokeWidth={0.8} opacity={0.3} />
        </g>

        {/* Curled middle finger */}
        <path d="M-2,8 Q-6,14 -4,17 Q-2,18 0,16 Q1,13 -1,9"
          fill={C.skinWarm} stroke={C.outline} strokeWidth={2} strokeLinecap="round" />
        <ellipse cx={-2} cy={16} rx={2.5} ry={2} fill={C.skin} opacity={0.6} />

        {/* Curled ring finger */}
        <path d="M2,9 Q-1,14 1,17 Q3,18 5,16 Q5,13 3,9"
          fill={C.skinWarm} stroke={C.outline} strokeWidth={2} strokeLinecap="round" />

        {/* Curled pinky */}
        <path d="M6,8 Q4,12 5,15 Q7,16 8,14 Q8,11 7,8"
          fill={C.skinWarm} stroke={C.outline} strokeWidth={1.8} strokeLinecap="round" />

        {/* Thumb — wrapping around toward palm */}
        <path d="M10,-4 Q13,-2 13,2 Q13,5 10,7 Q8,8 7,6"
          fill={C.skin} stroke={C.outline} strokeWidth={2.2} strokeLinecap="round" />
        <path d="M11,-2 Q12,0 11,3" fill="none" stroke={C.skinShadow} strokeWidth={0.6} opacity={0.3} />
      </g>
    </g>
  </g>
);

// ─── Pint Glass — Iconic, weighty, detailed ────────────────
const PintGlass: React.FC<{ liquidOffset: number }> = ({ liquidOffset }) => (
  <g>
    {/* Glass is wider, taller, more classic pint shape */}

    {/* Beer liquid — gradient with light refraction */}
    <g clipPath="url(#pp-pint-clip)">
      <rect x={-16} y={-46 + liquidOffset} width={32} height={60} fill="url(#pp-beer-grad)" opacity={0.88} />
      {/* Light refraction through beer */}
      <rect x={-6} y={-42 + liquidOffset} width={5} height={48} fill={C.beerGlow} opacity={0.12} />
      <rect x={6} y={-40 + liquidOffset} width={3} height={44} fill={C.beerLight} opacity={0.08} />
      {/* Darker sediment at bottom */}
      <ellipse cx={0} cy={0} rx={14} ry={6} fill={C.beerDeep} opacity={0.2} />
      {/* Carbonation bubbles */}
      <circle cx={-3} cy={-20 + liquidOffset} r={0.8} fill="white" opacity={0.3} />
      <circle cx={2} cy={-28 + liquidOffset} r={0.6} fill="white" opacity={0.25} />
      <circle cx={5} cy={-15 + liquidOffset} r={0.7} fill="white" opacity={0.2} />
      <circle cx={-6} cy={-32 + liquidOffset} r={0.5} fill="white" opacity={0.2} />
      <circle cx={0} cy={-10 + liquidOffset} r={0.9} fill="white" opacity={0.15} />
    </g>

    {/* ─── Foam head — volumetric, 3D ─── */}
    <g clipPath="url(#pp-pint-clip)">
      {/* Foam base layer */}
      <rect x={-15} y={-56 + liquidOffset} width={30} height={14} fill="url(#pp-foam-grad)" />
      {/* Foam bubbles — large, overlapping, 3D */}
      <ellipse cx={-6} cy={-54 + liquidOffset} rx={6} ry={4} fill={C.foamWhite} opacity={0.8} />
      <ellipse cx={4} cy={-53 + liquidOffset} rx={5.5} ry={3.5} fill={C.foamWhite} opacity={0.7} />
      <ellipse cx={-1} cy={-56 + liquidOffset} rx={5} ry={3} fill={C.foamWhite} opacity={0.6} />
      <ellipse cx={8} cy={-55 + liquidOffset} rx={4} ry={2.5} fill={C.foamWhite} opacity={0.55} />
      <ellipse cx={-9} cy={-52 + liquidOffset} rx={4.5} ry={3} fill={C.foamWhite} opacity={0.5} />
      {/* Foam bubble shadows */}
      <ellipse cx={-5} cy={-51 + liquidOffset} rx={5} ry={2} fill={C.foamShadow} opacity={0.2} />
      <ellipse cx={5} cy={-50 + liquidOffset} rx={4.5} ry={1.5} fill={C.foamShadow} opacity={0.15} />
      {/* Foam bubble highlights */}
      <ellipse cx={-8} cy={-56 + liquidOffset} rx={2} ry={1.2} fill="white" opacity={0.4} />
      <ellipse cx={3} cy={-55 + liquidOffset} rx={1.8} ry={1} fill="white" opacity={0.35} />
      {/* Foam dripping down side */}
      <path d={`M12,-48 Q14,-44 13,-38 Q12,-34 13,-30`} fill={C.foam} stroke={C.foamShadow} strokeWidth={0.5} opacity={0.7} />
      <ellipse cx={13} cy={-30} rx={2} ry={3} fill={C.foam} opacity={0.5} />
      {/* Second drip on left */}
      <path d={`M-11,-50 Q-13,-46 -12,-42`} fill={C.foam} stroke={C.foamShadow} strokeWidth={0.4} opacity={0.5} />
    </g>

    {/* ─── Glass body — thick, with refraction and weight ─── */}
    <path
      d="M-16,-2 L-12,-56 Q-11,-60 -9,-60 L9,-60 Q11,-60 12,-56 L16,-2 Q16,4 11,4 L-11,4 Q-16,4 -16,-2 Z"
      fill="url(#pp-glass-body)"
      stroke={C.outline}
      strokeWidth={2.8}
    />
    {/* Glass thickness — left edge */}
    <path d="M-14,-54 L-16,-2" fill="none" stroke={C.glassEdge} strokeWidth={2} />
    {/* Glass thickness — right edge */}
    <path d="M14,-54 L16,-2" fill="none" stroke={C.glassEdge} strokeWidth={1.5} opacity={0.6} />
    {/* Main highlight streak — bright, long */}
    <path d="M-9,-54 Q-8,-30 -7,-4" fill="none" stroke="white" strokeWidth={2.5} opacity={0.22} />
    {/* Secondary highlight */}
    <path d="M-6,-50 Q-5,-28 -5,-8" fill="none" stroke="white" strokeWidth={1} opacity={0.12} />
    {/* Rim highlight — bright, catches light */}
    <path d="M-9,-59 L9,-59" fill="none" stroke="white" strokeWidth={1.5} opacity={0.4} />
    {/* Rim thickness */}
    <path d="M-9,-58 L9,-58" fill="none" stroke={C.outline} strokeWidth={0.5} opacity={0.3} />
    {/* Bottom weight — thicker glass at base */}
    <rect x={-11} y={0} width={22} height={3} rx={1} fill={C.glassEdge} opacity={0.3} />
    <rect x={-10} y={2} width={20} height={1.5} rx={0.5} fill="white" opacity={0.1} />

    {/* ─── Handle — thicker, rounded, with depth ─── */}
    <path d="M16,-42 Q30,-40 30,-22 Q30,-4 16,0" fill="none" stroke={C.outline} strokeWidth={4} />
    <path d="M16,-40 Q28,-38 28,-22 Q28,-6 16,-2" fill="none" stroke={C.glassEdge} strokeWidth={2.5} />
    {/* Handle inner shadow */}
    <path d="M17,-38 Q26,-36 26,-22 Q26,-8 17,-4" fill="none" stroke={C.shadow} strokeWidth={1} />
    {/* Handle highlight */}
    <path d="M18,-36 Q24,-34 24,-22 Q24,-10 18,-6" fill="none" stroke="white" strokeWidth={0.8} opacity={0.15} />
  </g>
);

// ─── Right Arm — Gripping pint glass ───────────────────────
const RightArm: React.FC<{ beerSway: { rotation: number; liquidOffset: number } }> = ({ beerSway }) => (
  <g transform="translate(48, -30)">
    {/* Sleeve cuff */}
    <ellipse cx={0} cy={3} rx={8} ry={5} fill={C.shirtShadow} stroke={C.outline} strokeWidth={2} />
    <ellipse cx={0} cy={1} rx={7.5} ry={3} fill={C.shirt} stroke={C.outline} strokeWidth={1} />

    {/* Upper arm */}
    <path d="M0,0 Q6,16 14,32" fill="none" stroke={C.outline} strokeWidth={11} strokeLinecap="round" />
    <path d="M0,0 Q6,16 14,32" fill="none" stroke={C.skin} strokeWidth={7.5} strokeLinecap="round" />
    <path d="M1,4 Q7,16 13,28" fill="none" stroke={C.skinHighlight} strokeWidth={1.2} opacity={0.2} />

    {/* Lower arm bent to hold pint */}
    <g transform="translate(14, 32) rotate(-50)">
      <path d="M0,0 Q1,13 2,26" fill="none" stroke={C.outline} strokeWidth={10} strokeLinecap="round" />
      <path d="M0,0 Q1,13 2,26" fill="none" stroke={C.skin} strokeWidth={7} strokeLinecap="round" />

      {/* ─── Hand + pint group — GRIPPING ─── */}
      <g transform={`translate(4, 28) rotate(${50 + beerSway.rotation})`}>

        {/* Back of hand BEHIND glass */}
        <path
          d="M-8,-18 Q-12,-14 -12,-8 Q-12,-2 -8,2 L8,2 Q12,-2 12,-8 Q12,-14 8,-18 Z"
          fill="url(#pp-skin-grad)" stroke={C.outline} strokeWidth={2.5}
        />
        {/* Knuckle bumps on back of hand */}
        <ellipse cx={-4} cy={-16} rx={2.5} ry={1.5} fill={C.skinKnuckle} opacity={0.25} />
        <ellipse cx={1} cy={-16.5} rx={2.5} ry={1.5} fill={C.skinKnuckle} opacity={0.2} />
        <ellipse cx={6} cy={-16} rx={2.5} ry={1.5} fill={C.skinKnuckle} opacity={0.2} />

        {/* Pint glass */}
        <g transform="translate(0, 6)">
          <PintGlass liquidOffset={beerSway.liquidOffset} />
        </g>

        {/* ─── Fingers WRAPPING around glass — real grip ─── */}
        {/* Index finger — wraps around left side */}
        <path d="M-8,-16 Q-12,-12 -14,-6 Q-15,0 -14,4 Q-13,6 -11,5"
          fill="none" stroke={C.outline} strokeWidth={3.5} strokeLinecap="round" />
        <path d="M-8,-16 Q-12,-12 -14,-6 Q-15,0 -14,4 Q-13,6 -11,5"
          fill="none" stroke={C.skin} strokeWidth={2} strokeLinecap="round" />
        {/* Index fingertip */}
        <ellipse cx={-12} cy={5} rx={2.5} ry={2} fill={C.skin} stroke={C.outline} strokeWidth={1.5} />

        {/* Middle finger — wraps around front-left */}
        <path d="M-4,-17 Q-9,-10 -11,-2 Q-12,4 -10,8 Q-9,9 -7,8"
          fill="none" stroke={C.outline} strokeWidth={3.5} strokeLinecap="round" />
        <path d="M-4,-17 Q-9,-10 -11,-2 Q-12,4 -10,8 Q-9,9 -7,8"
          fill="none" stroke={C.skin} strokeWidth={2} strokeLinecap="round" />

        {/* Ring finger — wraps center */}
        <path d="M1,-17 Q-4,-8 -6,0 Q-7,5 -5,9 Q-4,10 -2,9"
          fill="none" stroke={C.outline} strokeWidth={3.2} strokeLinecap="round" />
        <path d="M1,-17 Q-4,-8 -6,0 Q-7,5 -5,9 Q-4,10 -2,9"
          fill="none" stroke={C.skin} strokeWidth={2} strokeLinecap="round" />

        {/* Pinky — wraps around right */}
        <path d="M6,-16 Q2,-8 0,0 Q-1,5 1,8 Q2,9 4,8"
          fill="none" stroke={C.outline} strokeWidth={2.8} strokeLinecap="round" />
        <path d="M6,-16 Q2,-8 0,0 Q-1,5 1,8 Q2,9 4,8"
          fill="none" stroke={C.skin} strokeWidth={1.8} strokeLinecap="round" />

        {/* Thumb — hooks around from right side of glass */}
        <path d="M10,-14 Q14,-10 15,-4 Q15,2 12,5"
          fill="none" stroke={C.outline} strokeWidth={3.5} strokeLinecap="round" />
        <path d="M10,-14 Q14,-10 15,-4 Q15,2 12,5"
          fill="none" stroke={C.skin} strokeWidth={2.2} strokeLinecap="round" />
        <ellipse cx={12} cy={5} rx={2.5} ry={2.2} fill={C.skin} stroke={C.outline} strokeWidth={1.5} />
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

    {/* Face — radial gradient with jaw shadow */}
    <circle cx={0} cy={0} r={50} fill="url(#pp-face-grad)" stroke={C.outline} strokeWidth={SW} />
    {/* Jaw shadow / chin definition */}
    <path d="M-35,30 Q-20,48 0,50 Q20,48 35,30" fill="none" stroke={C.skinShadow} strokeWidth={1.5} opacity={0.2} />
    {/* Forehead highlight */}
    <ellipse cx={-6} cy={-28} rx={18} ry={10} fill="white" opacity={0.18} />
    <ellipse cx={-4} cy={-34} rx={8} ry={4.5} fill="white" opacity={0.12} />
    {/* Cheekbone highlights */}
    <ellipse cx={-25} cy={8} rx={6} ry={4} fill="white" opacity={0.06} />
    <ellipse cx={25} cy={8} rx={5} ry={3.5} fill="white" opacity={0.04} />
    {/* Cheek shadows — deeper */}
    <ellipse cx={-34} cy={14} rx={10} ry={16} fill={C.skinShadow} opacity={0.18} />
    <ellipse cx={34} cy={14} rx={10} ry={16} fill={C.skinDeep} opacity={0.12} />
    {/* Under-eye area */}
    <ellipse cx={-17} cy={6} rx={8} ry={3} fill={C.skinShadow} opacity={0.06} />
    <ellipse cx={17} cy={6} rx={8} ry={3} fill={C.skinShadow} opacity={0.06} />
    {/* Temple shadow */}
    <ellipse cx={-42} cy={-5} rx={6} ry={12} fill={C.skinShadow} opacity={0.1} />
    <ellipse cx={42} cy={-5} rx={6} ry={12} fill={C.skinDeep} opacity={0.08} />

    <HairFront />
    <Glasses />

    {/* Eyes */}
    <g transform={`translate(-17, ${-2 + emo.eyeOffsetY})`}>
      <Eye blink={blink} scaleY={emo.eyeScaleY} pupilScale={emo.pupilScale} px={pupil.x} py={pupil.y} />
    </g>
    <g transform={`translate(17, ${-2 + emo.eyeOffsetY})`}>
      <Eye blink={blink} scaleY={emo.eyeScaleY} pupilScale={emo.pupilScale} px={pupil.x} py={pupil.y} />
    </g>

    {/* Eyebrows — thicker, more expressive */}
    <g transform={`translate(-17, ${-16 + emo.browLeftY}) rotate(${emo.browLeftRotation})`}>
      <rect x={-11} y={0} width={22} height={4.5} rx={2} fill={C.hairDark} />
      <rect x={-10} y={0.5} width={20} height={2.5} rx={1.2} fill={C.hairMid} opacity={0.3} />
      <rect x={-9} y={0.8} width={10} height={1.5} rx={0.8} fill={C.hairLight} opacity={0.15} />
    </g>
    <g transform={`translate(17, ${-16 + emo.browRightY}) rotate(${emo.browRightRotation})`}>
      <rect x={-11} y={0} width={22} height={4.5} rx={2} fill={C.hairDark} />
      <rect x={-10} y={0.5} width={20} height={2.5} rx={1.2} fill={C.hairMid} opacity={0.3} />
    </g>

    {/* Blush */}
    {emo.blushOpacity > 0.01 && (
      <>
        <ellipse cx={-28} cy={14} rx={10} ry={6} fill={C.blush} opacity={emo.blushOpacity * 0.7} />
        <ellipse cx={28} cy={14} rx={10} ry={6} fill={C.blush} opacity={emo.blushOpacity * 0.7} />
        <ellipse cx={-28} cy={14} rx={6} ry={3.5} fill={C.blush} opacity={emo.blushOpacity * 0.3} />
        <ellipse cx={28} cy={14} rx={6} ry={3.5} fill={C.blush} opacity={emo.blushOpacity * 0.3} />
      </>
    )}

    {/* Nose — with nostril hint and bridge */}
    <path d="M-1,-4 Q-2,4 -3,8 Q0,17 3,8 Q2,4 1,-4" fill="none" stroke={C.outline} strokeWidth={2} strokeLinecap="round" />
    <circle cx={1} cy={10} r={1.8} fill="white" opacity={0.12} />
    {/* Nostril hints */}
    <path d="M-4,13 Q-2,15 0,14" fill="none" stroke={C.skinShadow} strokeWidth={0.8} opacity={0.4} />
    <path d="M4,13 Q2,15 0,14" fill="none" stroke={C.skinShadow} strokeWidth={0.8} opacity={0.35} />

    <Stubble />

    <Mouth shape={mouthShape} curve={emo.mouthCurve} width={emo.mouthWidth} emotionOpen={emo.mouthOpen} talking={talking} />
  </g>
);

// ─── Hair Back — ASYMMETRIC, varied ────────────────────────
const HairBack: React.FC = () => (
  <g>
    {/* Main hair mass — asymmetric: left side bigger/wilder */}
    <path
      d="M-44,22 Q-58,18 -62,2 Q-66,-14 -58,-26 Q-62,-38 -54,-44 Q-48,-50 -40,-43
         L36,-42 Q44,-48 52,-42 Q60,-36 56,-24 Q62,-12 58,2 Q56,16 44,22
         L36,36 Q22,46 2,47 Q-18,46 -34,38 Z"
      fill="url(#pp-hair-grad)" stroke={C.outline} strokeWidth={2.5}
    />
    {/* Hair volume shadows */}
    <path d="M-32,30 Q-38,40 -28,42" fill="none" stroke={C.hairDark} strokeWidth={2} opacity={0.35} />
    <path d="M22,32 Q28,40 20,42" fill="none" stroke={C.hairDark} strokeWidth={1.8} opacity={0.3} />
    <path d="M-5,40 Q2,46 -6,45" fill="none" stroke={C.hairDark} strokeWidth={1.5} opacity={0.2} />
    <path d="M10,38 Q15,44 8,44" fill="none" stroke={C.hairDark} strokeWidth={1.2} opacity={0.2} />
    {/* Hair wave pattern */}
    <path d="M-20,-40 Q-15,-44 -10,-40 Q-5,-36 0,-40" fill="none" stroke={C.hairLight} strokeWidth={1.5} opacity={0.25} />
    <path d="M10,-40 Q15,-44 22,-40" fill="none" stroke={C.hairLight} strokeWidth={1.2} opacity={0.2} />
  </g>
);

// ─── Hair Front — WILD, asymmetric, loose strands ──────────
const HairFront: React.FC = () => (
  <g>
    {/* ─── LEFT SIDE — bigger, wilder tufts ─── */}
    {/* Large left tuft cluster */}
    <path
      d="M-46,-4 Q-60,-8 -64,-22 Q-66,-34 -58,-40 Q-62,-48 -56,-52 Q-50,-56 -44,-48"
      fill="url(#pp-hair-grad)" stroke={C.outline} strokeWidth={2.5}
    />
    {/* Left mid tuft */}
    <path d="M-48,10 Q-64,6 -66,-6 Q-68,-16 -62,-20"
      fill="url(#pp-hair-grad)" stroke={C.outline} strokeWidth={2.2} />
    {/* Left lower tuft */}
    <path d="M-46,22 Q-62,20 -64,8 Q-66,0 -58,-4"
      fill="url(#pp-hair-grad)" stroke={C.outline} strokeWidth={2} />
    {/* Left extra wild strand — sticks up */}
    <path d="M-52,-46 Q-58,-56 -54,-60 Q-50,-58 -50,-50"
      fill={C.hair} stroke={C.outline} strokeWidth={2} />
    {/* Left detail lines */}
    <path d="M-58,-42 Q-66,-38 -62,-30" fill="none" stroke={C.outline} strokeWidth={1.5} />
    <path d="M-60,-12 Q-68,-10 -64,-4" fill="none" stroke={C.outline} strokeWidth={1.5} />
    <path d="M-56,-50 Q-60,-48 -58,-44" fill="none" stroke={C.outlineSoft} strokeWidth={1} />
    {/* Left highlights */}
    <path d="M-54,-34 Q-52,-28 -56,-22" fill="none" stroke={C.hairWhite} strokeWidth={1.8} opacity={0.3} />
    <path d="M-58,-8 Q-56,-2 -58,4" fill="none" stroke={C.hairLight} strokeWidth={1.2} opacity={0.25} />

    {/* ─── RIGHT SIDE — slightly smaller (asymmetric) ─── */}
    <path
      d="M46,-4 Q58,-8 60,-20 Q62,-30 55,-35 Q58,-42 52,-44 Q48,-48 42,-42"
      fill="url(#pp-hair-grad)" stroke={C.outline} strokeWidth={2.5}
    />
    <path d="M48,10 Q60,6 62,-4 Q64,-12 58,-16"
      fill="url(#pp-hair-grad)" stroke={C.outline} strokeWidth={2} />
    <path d="M46,20 Q58,18 60,8 Q62,0 55,-2"
      fill="url(#pp-hair-grad-dark)" stroke={C.outline} strokeWidth={2} />
    {/* Right detail */}
    <path d="M55,-38 Q62,-35 58,-28" fill="none" stroke={C.outline} strokeWidth={1.5} />
    <path d="M57,-10 Q65,-8 62,-2" fill="none" stroke={C.outline} strokeWidth={1.5} />
    {/* Right highlights — fewer (shadow side) */}
    <path d="M52,-30 Q50,-25 53,-20" fill="none" stroke={C.hairLight} strokeWidth={1.3} opacity={0.2} />

    {/* ─── TOP — wild loose strands (asymmetric) ─── */}
    <path d="M-22,-48 Q-26,-58 -20,-56" fill="none" stroke={C.hair} strokeWidth={2.5} opacity={0.7} />
    <path d="M-12,-50 Q-15,-62 -10,-58" fill="none" stroke={C.hair} strokeWidth={2.2} opacity={0.6} />
    <path d="M4,-48 Q2,-60 7,-56" fill="none" stroke={C.hair} strokeWidth={2} opacity={0.6} />
    <path d="M-6,-49 Q-9,-58 -4,-55" fill="none" stroke={C.hairLight} strokeWidth={1.8} opacity={0.5} />
    <path d="M15,-46 Q18,-54 14,-52" fill="none" stroke={C.hair} strokeWidth={1.5} opacity={0.4} />
    {/* One dramatic wild strand on left */}
    <path d="M-30,-46 Q-38,-60 -32,-64 Q-28,-60 -28,-52"
      fill={C.hairLight} stroke={C.outline} strokeWidth={1.8} opacity={0.7} />
  </g>
);

// ─── Glasses ───────────────────────────────────────────────
const Glasses: React.FC = () => (
  <g transform="translate(0, -2)">
    {/* Left lens — with refraction */}
    <circle cx={-17} cy={0} r={14.5} fill={C.glassLens} stroke={C.glassFrame} strokeWidth={2.8} />
    <ellipse cx={-21} cy={-5} rx={5.5} ry={3.5} fill={C.glassShine} />
    <ellipse cx={-14} cy={4} rx={3} ry={2} fill={C.glassShine} opacity={0.4} />
    {/* Right lens */}
    <circle cx={17} cy={0} r={14.5} fill={C.glassLens} stroke={C.glassFrame} strokeWidth={2.8} />
    <ellipse cx={13} cy={-5} rx={5.5} ry={3.5} fill={C.glassShine} />
    <ellipse cx={20} cy={4} rx={3} ry={2} fill={C.glassShine} opacity={0.3} />
    {/* Bridge — thicker */}
    <path d="M-3,0 Q0,-4 3,0" fill="none" stroke={C.glassFrame} strokeWidth={2.8} />
    {/* Temple arms — with slight curve */}
    <path d="M-31,-2 Q-38,-4 -47,-6" fill="none" stroke={C.glassFrame} strokeWidth={2.2} />
    <path d="M31,-2 Q38,-4 47,-6" fill="none" stroke={C.glassFrame} strokeWidth={2.2} />
    {/* Frame highlight */}
    <path d="M-28,-6 Q-22,-10 -17,-10" fill="none" stroke={C.glassFrameLight} strokeWidth={0.8} opacity={0.3} />
    <path d="M28,-6 Q22,-10 17,-10" fill="none" stroke={C.glassFrameLight} strokeWidth={0.8} opacity={0.25} />
  </g>
);

// ─── Eye ───────────────────────────────────────────────────
interface EyeProps { blink: number; scaleY: number; pupilScale: number; px: number; py: number; }

const Eye: React.FC<EyeProps> = ({ blink, scaleY, pupilScale, px, py }) => (
  <g transform={`scale(1, ${scaleY * blink})`}>
    {/* Eye white with lid shadow */}
    <ellipse cx={0} cy={0} rx={9} ry={7} fill={C.eyeWhite} stroke={C.outline} strokeWidth={1.8} />
    {/* Upper lid shadow */}
    <ellipse cx={0} cy={-3.5} rx={7.5} ry={3} fill={C.eyeShadow} opacity={0.22} />
    {/* Lower lid hint */}
    <path d="M-6,4 Q0,6 6,4" fill="none" stroke={C.skinShadow} strokeWidth={0.5} opacity={0.15} />
    {/* Iris with gradient */}
    <circle cx={px} cy={py} r={4.2 * pupilScale} fill="url(#pp-iris-grad)" />
    {/* Iris ring */}
    <circle cx={px} cy={py} r={4.2 * pupilScale} fill="none" stroke={C.irisDark} strokeWidth={0.5} opacity={0.3} />
    {/* Pupil */}
    <circle cx={px} cy={py} r={2.3 * pupilScale} fill={C.pupil} />
    {/* Eye shine — main */}
    <circle cx={px + 1.5} cy={py - 1.8} r={1.5} fill="white" opacity={0.9} />
    {/* Eye shine — secondary */}
    <circle cx={px - 1.2} cy={py + 1.2} r={0.7} fill="white" opacity={0.4} />
  </g>
);

// ─── Stubble — more detailed ──────────────────────────────
const Stubble: React.FC = () => (
  <g opacity={0.5}>
    {[
      // Chin cluster
      [-6, 36, 0.9], [0, 38, 0.9], [6, 36, 0.9],
      [-3, 40, 0.85], [3, 40, 0.85], [0, 42, 0.7],
      // Jawline
      [-9, 34, 0.8], [9, 34, 0.8],
      [-14, 30, 0.75], [14, 30, 0.75],
      [-18, 26, 0.7], [18, 26, 0.7],
      [-22, 22, 0.6], [22, 22, 0.6],
      // Cheek line
      [-12, 33, 0.7], [12, 33, 0.7],
      [-4, 34, 0.65], [4, 34, 0.65], [0, 35, 0.65],
      // Under lip
      [-8, 37, 0.65], [8, 37, 0.65],
      [-16, 28, 0.6], [16, 28, 0.6],
      [-10, 36, 0.55], [10, 36, 0.55],
      // Extra sparse dots
      [-20, 24, 0.5], [20, 24, 0.5],
      [-6, 42, 0.5], [6, 42, 0.5],
      [-2, 36, 0.5], [2, 37, 0.5],
      [-11, 31, 0.45], [11, 31, 0.45],
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
        {/* Lip shadow line */}
        <path d={`M${-hw + 2},27 Q0,${27 + curve * 0.5} ${hw - 2},27`}
          fill="none" stroke={C.skinShadow} strokeWidth={0.8} opacity={0.2} />
      </g>
    );
  }

  return (
    <g transform="translate(0, 26)">
      {/* Mouth cavity — dark depth */}
      <ellipse cx={0} cy={0} rx={hw} ry={openAmount * 0.5 + Math.abs(curve) * 0.2}
        fill={C.mouth} stroke={C.outline} strokeWidth={2.5} />
      {/* Inner depth */}
      <ellipse cx={0} cy={1} rx={hw * 0.75} ry={openAmount * 0.35}
        fill={C.mouthDark} opacity={0.5} />
      <ellipse cx={0} cy={2} rx={hw * 0.5} ry={openAmount * 0.25}
        fill={C.mouthDeep} opacity={0.3} />
      {/* Tongue */}
      {openAmount > 5 && (
        <>
          <ellipse cx={2} cy={openAmount * 0.22} rx={hw * 0.5} ry={openAmount * 0.2} fill={C.tongue} />
          <ellipse cx={1} cy={openAmount * 0.18} rx={hw * 0.3} ry={openAmount * 0.1} fill="#DD7777" opacity={0.3} />
        </>
      )}
      {/* Upper teeth */}
      {openAmount > 3 && (
        <>
          <rect x={-hw * 0.6} y={-openAmount * 0.35} width={hw * 1.2} height={3} fill={C.teeth} rx={1} />
          {/* Individual tooth lines */}
          {[-0.3, -0.1, 0.1, 0.3].map((frac) => (
            <line key={frac} x1={hw * frac} y1={-openAmount * 0.35}
              x2={hw * frac} y2={-openAmount * 0.35 + 3}
              stroke={C.shirtFold} strokeWidth={0.4} opacity={0.25} />
          ))}
          {/* Teeth highlight */}
          <rect x={-hw * 0.5} y={-openAmount * 0.35} width={hw * 0.4} height={1.2} fill="white" rx={0.5} opacity={0.15} />
        </>
      )}
      {/* Upper lip line */}
      <path d={`M${-hw},0 Q${-hw * 0.5},-${openAmount * 0.15} 0,-${openAmount * 0.1} Q${hw * 0.5},-${openAmount * 0.15} ${hw},0`}
        fill="none" stroke={C.outline} strokeWidth={0.8} opacity={0.3} />
    </g>
  );
};

export default ProfessorPint;
