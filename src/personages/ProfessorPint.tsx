import React, { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';
import { getIdleState } from '../animaties/idle';
import { getMouthShape, getTalkingBounce, getTalkingGesture } from '../animaties/talking';
import { interpolateEmotions } from '../animaties/emotions';
import type { Emotion } from '../animaties/emotions';
import type { MouthShape } from '../animaties/talking';
import { PintGlass } from './PintGlass';

interface ProfessorPintProps {
  emotion?: Emotion;
  previousEmotion?: Emotion;
  emotionTransitionProgress?: number;
  talking?: boolean;
  scale?: number;
}

const COL = {
  skin: '#FDDCB5',
  skinShadow: '#E8C8A0',
  outline: '#1A1A1A',
  vest: '#2D5016',
  vestDark: '#1F3A0F',
  shirt: '#FFFFFF',
  shirtShadow: '#E8E8E8',
  bowtie: '#D4A012',
  bowtieDark: '#B8890F',
  hair: '#D4D4D4',
  hairDark: '#AAAAAA',
  hairLight: '#E8E8E8',
  glassFrame: '#3A3A3A',
  glassLens: 'rgba(200,220,240,0.22)',
  pupil: '#1A1A1A',
  iris: '#4A6741',
  eyeWhite: '#FFFFFF',
  mouth: '#8B2020',
  tongue: '#CC5555',
  blush: '#FFAAAA',
  shine: 'rgba(255,255,255,0.55)',
};

const SW = 3.5;

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
      <g transform={`translate(${idle.sway.x}, ${bodyY}) rotate(${idle.sway.rotation})`}>
        {/* Legs */}
        <Legs />

        {/* Body */}
        <g transform={`scale(${idle.breathing.scaleX}, 1)`}>
          <Body />
        </g>

        {/* Left arm (gesture) */}
        <LeftArm gestureRotation={talkGesture} />

        {/* Right arm + pint glass */}
        <RightArm beerSway={idle.beerSway} />

        {/* Head - connected to body via neck */}
        <g transform={`translate(0, -105) rotate(${emo.headTilt})`}>
          <Head emo={emo} blink={idle.blink} pupil={idle.pupil} mouthShape={mouthShape} talking={talking} />
        </g>
      </g>
    </svg>
  );
};

// ==== SUB-COMPONENTS ====

const Legs: React.FC = () => (
  <g>
    <line x1={-16} y1={68} x2={-20} y2={135} stroke={COL.outline} strokeWidth={8} strokeLinecap="round" />
    <line x1={16} y1={68} x2={20} y2={135} stroke={COL.outline} strokeWidth={8} strokeLinecap="round" />
    <ellipse cx={-24} cy={137} rx={14} ry={6} fill={COL.outline} />
    <ellipse cx={24} cy={137} rx={14} ry={6} fill={COL.outline} />
  </g>
);

const Body: React.FC = () => (
  <g>
    {/* Torso - with belly bulge at bottom */}
    <path
      d="M-42,-42 Q-42,-50 -30,-50 L30,-50 Q42,-50 42,-42 L42,40 Q42,75 0,78 Q-42,75 -42,40 Z"
      fill={COL.shirt} stroke={COL.outline} strokeWidth={SW}
    />
    {/* Belly highlight */}
    <ellipse cx={0} cy={55} rx={25} ry={15} fill="rgba(0,0,0,0.03)" />
    {/* Shirt fold hint */}
    <line x1={0} y1={-15} x2={0} y2={60} stroke={COL.shirtShadow} strokeWidth={1} opacity={0.4} />

    {/* Vest left - follows belly */}
    <path
      d="M-39,-38 L-39,45 Q-39,72 -15,75 L-8,75 L-8,-22 Q-8,-38 -22,-38 Z"
      fill={COL.vest} stroke={COL.outline} strokeWidth={SW}
    />
    {/* Vest right - follows belly */}
    <path
      d="M39,-38 L39,45 Q39,72 15,75 L8,75 L8,-22 Q8,-38 22,-38 Z"
      fill={COL.vest} stroke={COL.outline} strokeWidth={SW}
    />
    {/* Vest inner shadow */}
    <path d="M-35,-30 L-35,55" stroke={COL.vestDark} strokeWidth={2} opacity={0.3} />
    <path d="M35,-30 L35,55" stroke={COL.vestDark} strokeWidth={2} opacity={0.3} />

    {/* Vest buttons */}
    <circle cx={0} cy={-5} r={3.5} fill={COL.bowtie} stroke={COL.outline} strokeWidth={1.5} />
    <circle cx={0} cy={18} r={3.5} fill={COL.bowtie} stroke={COL.outline} strokeWidth={1.5} />
    <circle cx={0} cy={41} r={3.5} fill={COL.bowtie} stroke={COL.outline} strokeWidth={1.5} />

    {/* Neck - shorter, connects flush to head above */}
    <rect x={-11} y={-48} width={22} height={12} fill={COL.skin} stroke={COL.outline} strokeWidth={SW} />

    {/* Bowtie - sits at collar */}
    <g transform="translate(0, -42)">
      <path d="M-14,0 L-8,-8 L0,0" fill={COL.shirt} stroke={COL.outline} strokeWidth={2} />
      <path d="M14,0 L8,-8 L0,0" fill={COL.shirt} stroke={COL.outline} strokeWidth={2} />
      <path d="M0,0 L-16,-9 L-16,9 Z" fill={COL.bowtie} stroke={COL.outline} strokeWidth={2} />
      <path d="M0,0 L16,-9 L16,9 Z" fill={COL.bowtie} stroke={COL.outline} strokeWidth={2} />
      <circle cx={0} cy={0} r={4.5} fill={COL.bowtieDark} stroke={COL.outline} strokeWidth={2} />
    </g>
  </g>
);

const LeftArm: React.FC<{ gestureRotation: number }> = ({ gestureRotation }) => (
  <g transform={`translate(-44, -25) rotate(${-12 + gestureRotation}, 0, 0)`}>
    <line x1={0} y1={0} x2={-18} y2={38} stroke={COL.outline} strokeWidth={8} strokeLinecap="round" />
    <g transform="translate(-18, 38)">
      <line x1={0} y1={0} x2={-8} y2={32} stroke={COL.outline} strokeWidth={7} strokeLinecap="round" />
      <circle cx={-10} cy={36} r={8} fill={COL.skin} stroke={COL.outline} strokeWidth={SW} />
    </g>
  </g>
);

const RightArm: React.FC<{ beerSway: { rotation: number; liquidOffset: number } }> = ({ beerSway }) => (
  <g transform="translate(44, -20)">
    {/* Upper arm */}
    <line x1={0} y1={0} x2={16} y2={32} stroke={COL.outline} strokeWidth={8} strokeLinecap="round" />
    {/* Lower arm - bent to hold pint */}
    <g transform="translate(16, 32) rotate(-50)">
      <line x1={0} y1={0} x2={3} y2={26} stroke={COL.outline} strokeWidth={7} strokeLinecap="round" />
      {/* Hand + pint group - rotated back to upright */}
      <g transform={`translate(5, 28) rotate(${50 + beerSway.rotation})`}>
        {/* Hand BEHIND glass */}
        <ellipse cx={0} cy={-14} rx={10} ry={7} fill={COL.skin} stroke={COL.outline} strokeWidth={SW} />
        {/* Pint glass ON TOP of hand */}
        <g transform="translate(0, 8)">
          <PintGlass liquidOffset={beerSway.liquidOffset} scale={1.1} />
        </g>
        {/* Fingers in front of glass */}
        <path d="M-7,-20 Q-9,-15 -7,-10" fill="none" stroke={COL.outline} strokeWidth={1.5} />
        <path d="M6,-20 Q8,-15 6,-10" fill="none" stroke={COL.outline} strokeWidth={1.5} />
      </g>
    </g>
  </g>
);

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
    <EinsteinHairBack />

    <circle cx={0} cy={0} r={50} fill={COL.skin} stroke={COL.outline} strokeWidth={SW} />

    <ellipse cx={-6} cy={-28} rx={16} ry={9} fill={COL.shine} opacity={0.35} />
    <ellipse cx={-4} cy={-33} rx={7} ry={4} fill="white" opacity={0.25} />

    <EinsteinHairFront />

    <Glasses />

    <g transform={`translate(-17, ${-2 + emo.eyeOffsetY})`}>
      <Eye blink={blink} scaleY={emo.eyeScaleY} pupilScale={emo.pupilScale} px={pupil.x} py={pupil.y} />
    </g>
    <g transform={`translate(17, ${-2 + emo.eyeOffsetY})`}>
      <Eye blink={blink} scaleY={emo.eyeScaleY} pupilScale={emo.pupilScale} px={pupil.x} py={pupil.y} />
    </g>

    <g transform={`translate(-17, ${-15 + emo.browLeftY}) rotate(${emo.browLeftRotation})`}>
      <rect x={-10} y={0} width={20} height={3.5} rx={1.5} fill={COL.hairDark} />
    </g>
    <g transform={`translate(17, ${-15 + emo.browRightY}) rotate(${emo.browRightRotation})`}>
      <rect x={-10} y={0} width={20} height={3.5} rx={1.5} fill={COL.hairDark} />
    </g>

    {emo.blushOpacity > 0.01 && (
      <>
        <ellipse cx={-28} cy={14} rx={8} ry={5} fill={COL.blush} opacity={emo.blushOpacity} />
        <ellipse cx={28} cy={14} rx={8} ry={5} fill={COL.blush} opacity={emo.blushOpacity} />
      </>
    )}

    {/* Nose */}
    <path d="M-3,8 Q0,15 3,8" fill="none" stroke={COL.outline} strokeWidth={2.2} strokeLinecap="round" />

    {/* Stubble beard - dots on chin and jawline */}
    <g opacity={0.99}>
      <circle cx={-6} cy={36} r={0.8} fill={COL.hairDark} />
      <circle cx={0} cy={38} r={0.8} fill={COL.hairDark} />
      <circle cx={6} cy={36} r={0.8} fill={COL.hairDark} />
      <circle cx={-3} cy={40} r={0.8} fill={COL.hairDark} />
      <circle cx={3} cy={40} r={0.8} fill={COL.hairDark} />
      <circle cx={-9} cy={34} r={0.7} fill={COL.hairDark} />
      <circle cx={9} cy={34} r={0.7} fill={COL.hairDark} />
      <circle cx={-14} cy={30} r={0.7} fill={COL.hairDark} />
      <circle cx={14} cy={30} r={0.7} fill={COL.hairDark} />
      <circle cx={-18} cy={26} r={0.7} fill={COL.hairDark} />
      <circle cx={18} cy={26} r={0.7} fill={COL.hairDark} />
      <circle cx={-12} cy={33} r={0.7} fill={COL.hairDark} />
      <circle cx={12} cy={33} r={0.7} fill={COL.hairDark} />
      <circle cx={-4} cy={34} r={0.7} fill={COL.hairDark} />
      <circle cx={4} cy={34} r={0.7} fill={COL.hairDark} />
      <circle cx={0} cy={35} r={0.7} fill={COL.hairDark} />
    </g>

    <Mouth shape={mouthShape} curve={emo.mouthCurve} width={emo.mouthWidth} emotionOpen={emo.mouthOpen} talking={talking} />
  </g>
);

const EinsteinHairBack: React.FC = () => (
  <g>
    <path
      d="M-42,20 Q-55,15 -58,0 Q-62,-15 -55,-25 Q-58,-35 -50,-40 Q-45,-45 -38,-40
         L38,-40 Q45,-45 50,-40 Q58,-35 55,-25 Q62,-15 58,0 Q55,15 42,20
         L35,35 Q20,45 0,45 Q-20,45 -35,35 Z"
      fill={COL.hair} stroke={COL.outline} strokeWidth={2.5}
    />
    <path d="M-30,30 Q-35,38 -25,40" fill="none" stroke={COL.hairDark} strokeWidth={1.5} opacity={0.4} />
    <path d="M25,30 Q30,38 22,40" fill="none" stroke={COL.hairDark} strokeWidth={1.5} opacity={0.4} />
    <path d="M0,38 Q5,44 -3,43" fill="none" stroke={COL.hairDark} strokeWidth={1.5} opacity={0.3} />
  </g>
);

const EinsteinHairFront: React.FC = () => (
  <g>
    <path
      d="M-46,-5 Q-58,-8 -60,-20 Q-62,-30 -55,-35 Q-58,-42 -52,-44 Q-48,-48 -42,-42"
      fill={COL.hair} stroke={COL.outline} strokeWidth={2.5}
    />
    <path d="M-48,8 Q-60,5 -62,-5 Q-64,-12 -58,-15" fill={COL.hair} stroke={COL.outline} strokeWidth={2} />
    <path d="M-46,20 Q-58,18 -60,8 Q-62,0 -55,-2" fill={COL.hair} stroke={COL.outline} strokeWidth={2} />
    <path d="M-55,-38 Q-62,-35 -58,-28" fill="none" stroke={COL.outline} strokeWidth={1.5} />
    <path d="M-57,-10 Q-65,-8 -62,-2" fill="none" stroke={COL.outline} strokeWidth={1.5} />

    <path
      d="M46,-5 Q58,-8 60,-20 Q62,-30 55,-35 Q58,-42 52,-44 Q48,-48 42,-42"
      fill={COL.hair} stroke={COL.outline} strokeWidth={2.5}
    />
    <path d="M48,8 Q60,5 62,-5 Q64,-12 58,-15" fill={COL.hair} stroke={COL.outline} strokeWidth={2} />
    <path d="M46,20 Q58,18 60,8 Q62,0 55,-2" fill={COL.hair} stroke={COL.outline} strokeWidth={2} />
    <path d="M55,-38 Q62,-35 58,-28" fill="none" stroke={COL.outline} strokeWidth={1.5} />
    <path d="M57,-10 Q65,-8 62,-2" fill="none" stroke={COL.outline} strokeWidth={1.5} />

    <path d="M-52,-30 Q-50,-25 -53,-20" fill="none" stroke={COL.hairLight} strokeWidth={1.2} opacity={0.4} />
    <path d="M52,-30 Q50,-25 53,-20" fill="none" stroke={COL.hairLight} strokeWidth={1.2} opacity={0.4} />
  </g>
);

const Glasses: React.FC = () => (
  <g transform="translate(0, -2)">
    <circle cx={-17} cy={0} r={14} fill={COL.glassLens} stroke={COL.glassFrame} strokeWidth={2.5} />
    <circle cx={17} cy={0} r={14} fill={COL.glassLens} stroke={COL.glassFrame} strokeWidth={2.5} />
    <path d="M-3,0 Q0,-3 3,0" fill="none" stroke={COL.glassFrame} strokeWidth={2.5} />
    <line x1={-31} y1={-2} x2={-46} y2={-6} stroke={COL.glassFrame} strokeWidth={2} />
    <line x1={31} y1={-2} x2={46} y2={-6} stroke={COL.glassFrame} strokeWidth={2} />
    <ellipse cx={-21} cy={-5} rx={4} ry={3} fill="white" opacity={0.12} />
    <ellipse cx={13} cy={-5} rx={4} ry={3} fill="white" opacity={0.12} />
  </g>
);

interface EyeProps { blink: number; scaleY: number; pupilScale: number; px: number; py: number; }

const Eye: React.FC<EyeProps> = ({ blink, scaleY, pupilScale, px, py }) => (
  <g transform={`scale(1, ${scaleY * blink})`}>
    <ellipse cx={0} cy={0} rx={8.5} ry={6.5} fill={COL.eyeWhite} stroke={COL.outline} strokeWidth={1.5} />
    <circle cx={px} cy={py} r={4 * pupilScale} fill={COL.iris} />
    <circle cx={px} cy={py} r={2.2 * pupilScale} fill={COL.pupil} />
    <circle cx={px + 1.5} cy={py - 1.5} r={1.3} fill="white" opacity={0.8} />
  </g>
);

interface MouthProps { shape: MouthShape; curve: number; width: number; emotionOpen: number; talking: boolean; }

const Mouth: React.FC<MouthProps> = ({ shape, curve, width, emotionOpen, talking }) => {
  const talkOpen = talking ? [0, 3, 6, 10][shape] : emotionOpen * 10;
  const openAmount = Math.max(talkOpen, emotionOpen * 10);
  const hw = 12 * width;

  if (openAmount < 1) {
    return (
      <path d={`M${-hw},26 Q0,${26 + curve} ${hw},26`}
        fill="none" stroke={COL.outline} strokeWidth={2.5} strokeLinecap="round" />
    );
  }

  return (
    <g transform="translate(0, 26)">
      <ellipse cx={0} cy={0} rx={hw} ry={openAmount * 0.5 + Math.abs(curve) * 0.2}
        fill={COL.mouth} stroke={COL.outline} strokeWidth={2.5} />
      {openAmount > 6 && (
        <ellipse cx={2} cy={openAmount * 0.25} rx={hw * 0.5} ry={openAmount * 0.2} fill={COL.tongue} />
      )}
      {openAmount > 3 && (
        <rect x={-hw * 0.6} y={-openAmount * 0.35} width={hw * 1.2} height={2.5} fill="white" rx={1} />
      )}
    </g>
  );
};

export default ProfessorPint;
