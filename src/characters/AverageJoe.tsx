import React, { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';
import { getIdleState } from '../animations/idle';
import { getMouthShape, getTalkingBounce, getTalkingGesture } from '../animations/talking';
import { interpolateEmotions } from '../animations/emotions';
import type { Emotion } from '../animations/emotions';
import type { MouthShape } from '../animations/talking';

// Average Joe: a regular pub patron
// Shorter, rounder, casual clothes (hoodie + jeans), no glasses, short brown hair, friendly face

interface AverageJoeProps {
  emotion?: Emotion;
  previousEmotion?: Emotion;
  emotionTransitionProgress?: number;
  talking?: boolean;
  scale?: number;
}

const COL = {
  skin: '#F5CBA7',
  skinShadow: '#E0B090',
  outline: '#1A1A1A',
  hoodie: '#3B6DAA',
  hoodieDark: '#2D5580',
  hoodieZip: '#888888',
  shirt: '#F0F0F0',
  jeans: '#3D4F6A',
  jeansDark: '#2E3D52',
  hair: '#6B4226',
  hairDark: '#4A2E1A',
  hairLight: '#8B5E3C',
  eyeWhite: '#FFFFFF',
  iris: '#5B7553',
  pupil: '#1A1A1A',
  mouth: '#8B2020',
  tongue: '#CC5555',
  blush: '#FFBBBB',
  shine: 'rgba(255,255,255,0.5)',
  shoe: '#2A2A2A',
};

const SW = 3.5;

export const AverageJoe: React.FC<AverageJoeProps> = ({
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
    [previousEmotion, emotion, emotionTransitionProgress],
  );

  const bodyY = idle.breathing.y + talkBounce;

  return (
    <svg
      viewBox="-130 -190 260 380"
      width={260 * scale}
      height={380 * scale}
      style={{ overflow: 'visible' }}
    >
      <g transform={`translate(${idle.sway.x}, ${bodyY}) rotate(${idle.sway.rotation})`}>
        {/* Legs */}
        <JoeLegs />

        {/* Body */}
        <g transform={`scale(${idle.breathing.scaleX}, 1)`}>
          <JoeBody />
        </g>

        {/* Left arm (gesture) */}
        <JoeLeftArm gestureRotation={talkGesture} />

        {/* Right arm */}
        <JoeRightArm />

        {/* Head */}
        <g transform={`translate(0, -95) rotate(${emo.headTilt})`}>
          <JoeHead emo={emo} blink={idle.blink} pupil={idle.pupil} mouthShape={mouthShape} talking={talking} />
        </g>
      </g>
    </svg>
  );
};

// ==== SUB-COMPONENTS ====

const JoeLegs: React.FC = () => (
  <g>
    {/* Jeans */}
    <path
      d="M-18,65 L-22,130 L-8,130 L-6,70 Z"
      fill={COL.jeans} stroke={COL.outline} strokeWidth={SW}
    />
    <path
      d="M18,65 L22,130 L8,130 L6,70 Z"
      fill={COL.jeans} stroke={COL.outline} strokeWidth={SW}
    />
    {/* Seam lines */}
    <line x1={-15} y1={75} x2={-16} y2={125} stroke={COL.jeansDark} strokeWidth={1} opacity={0.3} />
    <line x1={15} y1={75} x2={16} y2={125} stroke={COL.jeansDark} strokeWidth={1} opacity={0.3} />
    {/* Shoes */}
    <ellipse cx={-18} cy={133} rx={16} ry={7} fill={COL.shoe} stroke={COL.outline} strokeWidth={2} />
    <ellipse cx={18} cy={133} rx={16} ry={7} fill={COL.shoe} stroke={COL.outline} strokeWidth={2} />
  </g>
);

const JoeBody: React.FC = () => (
  <g>
    {/* Torso - slightly wider/rounder than Professor */}
    <path
      d="M-45,-35 Q-45,-42 -32,-42 L32,-42 Q45,-42 45,-35 L45,42 Q45,72 0,75 Q-45,72 -45,42 Z"
      fill={COL.hoodie} stroke={COL.outline} strokeWidth={SW}
    />
    {/* Belly roundness */}
    <ellipse cx={0} cy={50} rx={30} ry={18} fill="rgba(0,0,0,0.05)" />

    {/* Hoodie pocket (kangaroo pocket) */}
    <path
      d="M-25,25 L-25,50 Q-25,55 -20,55 L20,55 Q25,55 25,50 L25,25"
      fill="none" stroke={COL.hoodieDark} strokeWidth={2} opacity={0.5}
    />

    {/* Zip line */}
    <line x1={0} y1={-38} x2={0} y2={70} stroke={COL.hoodieZip} strokeWidth={1.5} opacity={0.4} />

    {/* Hoodie drawstrings */}
    <line x1={-6} y1={-38} x2={-8} y2={-20} stroke={COL.hoodieZip} strokeWidth={1.2} opacity={0.5} />
    <line x1={6} y1={-38} x2={8} y2={-20} stroke={COL.hoodieZip} strokeWidth={1.2} opacity={0.5} />
    <circle cx={-9} cy={-18} r={2} fill={COL.hoodieZip} opacity={0.5} />
    <circle cx={9} cy={-18} r={2} fill={COL.hoodieZip} opacity={0.5} />

    {/* T-shirt collar visible */}
    <path
      d="M-12,-42 Q0,-35 12,-42"
      fill={COL.shirt} stroke={COL.outline} strokeWidth={2}
    />

    {/* Neck */}
    <rect x={-10} y={-46} width={20} height={10} fill={COL.skin} stroke={COL.outline} strokeWidth={SW} />

    {/* Hoodie collar/hood edge */}
    <path
      d="M-20,-40 Q-22,-48 -12,-48 L12,-48 Q22,-48 20,-40"
      fill={COL.hoodieDark} stroke={COL.outline} strokeWidth={2}
    />
  </g>
);

const JoeLeftArm: React.FC<{ gestureRotation: number }> = ({ gestureRotation }) => (
  <g transform={`translate(-46, -20) rotate(${-8 + gestureRotation}, 0, 0)`}>
    {/* Upper arm (hoodie sleeve) */}
    <line x1={0} y1={0} x2={-14} y2={35} stroke={COL.hoodie} strokeWidth={14} strokeLinecap="round" />
    <line x1={0} y1={0} x2={-14} y2={35} stroke={COL.outline} strokeWidth={16} strokeLinecap="round" opacity={0.15} />
    {/* Forearm */}
    <g transform="translate(-14, 35)">
      <line x1={0} y1={0} x2={-6} y2={28} stroke={COL.skin} strokeWidth={8} strokeLinecap="round" />
      <line x1={0} y1={0} x2={-6} y2={28} stroke={COL.outline} strokeWidth={10} strokeLinecap="round" opacity={0.12} />
      {/* Hand */}
      <circle cx={-8} cy={32} r={8} fill={COL.skin} stroke={COL.outline} strokeWidth={SW} />
    </g>
  </g>
);

const JoeRightArm: React.FC = () => (
  <g transform="translate(46, -20)">
    {/* Upper arm */}
    <line x1={0} y1={0} x2={14} y2={35} stroke={COL.hoodie} strokeWidth={14} strokeLinecap="round" />
    <line x1={0} y1={0} x2={14} y2={35} stroke={COL.outline} strokeWidth={16} strokeLinecap="round" opacity={0.15} />
    {/* Forearm resting */}
    <g transform="translate(14, 35)">
      <line x1={0} y1={0} x2={4} y2={28} stroke={COL.skin} strokeWidth={8} strokeLinecap="round" />
      <line x1={0} y1={0} x2={4} y2={28} stroke={COL.outline} strokeWidth={10} strokeLinecap="round" opacity={0.12} />
      {/* Hand */}
      <circle cx={6} cy={32} r={8} fill={COL.skin} stroke={COL.outline} strokeWidth={SW} />
    </g>
  </g>
);

interface JoeHeadProps {
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

const JoeHead: React.FC<JoeHeadProps> = ({ emo, blink, pupil, mouthShape, talking }) => (
  <g>
    {/* Short brown hair (back) */}
    <JoeHairBack />

    {/* Head - slightly rounder than Professor */}
    <ellipse cx={0} cy={2} rx={46} ry={48} fill={COL.skin} stroke={COL.outline} strokeWidth={SW} />

    {/* Forehead highlight */}
    <ellipse cx={-4} cy={-25} rx={14} ry={8} fill={COL.shine} opacity={0.3} />

    {/* Hair front */}
    <JoeHairFront />

    {/* Ears */}
    <ellipse cx={-44} cy={5} rx={8} ry={12} fill={COL.skin} stroke={COL.outline} strokeWidth={2.5} />
    <ellipse cx={44} cy={5} rx={8} ry={12} fill={COL.skin} stroke={COL.outline} strokeWidth={2.5} />
    <path d="M-44,0 Q-41,5 -44,10" fill="none" stroke={COL.skinShadow} strokeWidth={1.5} />
    <path d="M44,0 Q41,5 44,10" fill="none" stroke={COL.skinShadow} strokeWidth={1.5} />

    {/* Eyes */}
    <g transform={`translate(-15, ${0 + emo.eyeOffsetY})`}>
      <JoeEye blink={blink} scaleY={emo.eyeScaleY} pupilScale={emo.pupilScale} px={pupil.x} py={pupil.y} />
    </g>
    <g transform={`translate(15, ${0 + emo.eyeOffsetY})`}>
      <JoeEye blink={blink} scaleY={emo.eyeScaleY} pupilScale={emo.pupilScale} px={pupil.x} py={pupil.y} />
    </g>

    {/* Eyebrows - thicker, more casual */}
    <g transform={`translate(-15, ${-13 + emo.browLeftY}) rotate(${emo.browLeftRotation})`}>
      <rect x={-9} y={0} width={18} height={4} rx={2} fill={COL.hair} />
    </g>
    <g transform={`translate(15, ${-13 + emo.browRightY}) rotate(${emo.browRightRotation})`}>
      <rect x={-9} y={0} width={18} height={4} rx={2} fill={COL.hair} />
    </g>

    {/* Blush */}
    {emo.blushOpacity > 0.01 && (
      <>
        <ellipse cx={-26} cy={16} rx={8} ry={5} fill={COL.blush} opacity={emo.blushOpacity} />
        <ellipse cx={26} cy={16} rx={8} ry={5} fill={COL.blush} opacity={emo.blushOpacity} />
      </>
    )}

    {/* Nose - slightly bigger, friendlier */}
    <path d="M-4,10 Q0,18 4,10" fill="none" stroke={COL.outline} strokeWidth={2.2} strokeLinecap="round" />
    <circle cx={-3} cy={13} r={2.5} fill={COL.skinShadow} opacity={0.15} />
    <circle cx={3} cy={13} r={2.5} fill={COL.skinShadow} opacity={0.15} />

    {/* Mouth */}
    <JoeMouth shape={mouthShape} curve={emo.mouthCurve} width={emo.mouthWidth} emotionOpen={emo.mouthOpen} talking={talking} />
  </g>
);

const JoeHairBack: React.FC = () => (
  <g>
    <path
      d="M-40,5 Q-48,-5 -45,-20 Q-42,-35 -35,-40 Q-25,-48 0,-50 Q25,-48 35,-40 Q42,-35 45,-20 Q48,-5 40,5
         L38,10 Q20,15 0,15 Q-20,15 -38,10 Z"
      fill={COL.hair} stroke={COL.outline} strokeWidth={2.5}
    />
  </g>
);

const JoeHairFront: React.FC = () => (
  <g>
    {/* Short messy fringe */}
    <path
      d="M-30,-35 Q-28,-48 -15,-50 Q-5,-52 5,-50 Q18,-48 25,-40 Q30,-35 28,-28
         L20,-30 Q10,-42 -5,-42 Q-18,-42 -25,-32 Z"
      fill={COL.hair} stroke={COL.outline} strokeWidth={2}
    />
    {/* Some texture lines */}
    <path d="M-15,-42 Q-10,-48 -5,-44" fill="none" stroke={COL.hairDark} strokeWidth={1.5} opacity={0.4} />
    <path d="M5,-44 Q10,-50 15,-42" fill="none" stroke={COL.hairDark} strokeWidth={1.5} opacity={0.4} />
    <path d="M-8,-46 Q-3,-52 2,-46" fill="none" stroke={COL.hairLight} strokeWidth={1} opacity={0.3} />

    {/* Side hair - left */}
    <path d="M-42,-5 Q-48,-15 -44,-25 Q-42,-32 -36,-36" fill={COL.hair} stroke={COL.outline} strokeWidth={2} />
    {/* Side hair - right */}
    <path d="M42,-5 Q48,-15 44,-25 Q42,-32 36,-36" fill={COL.hair} stroke={COL.outline} strokeWidth={2} />
  </g>
);

interface JoeEyeProps { blink: number; scaleY: number; pupilScale: number; px: number; py: number; }

const JoeEye: React.FC<JoeEyeProps> = ({ blink, scaleY, pupilScale, px, py }) => (
  <g transform={`scale(1, ${scaleY * blink})`}>
    <ellipse cx={0} cy={0} rx={9} ry={7} fill={COL.eyeWhite} stroke={COL.outline} strokeWidth={1.5} />
    <circle cx={px} cy={py} r={4.2 * pupilScale} fill={COL.iris} />
    <circle cx={px} cy={py} r={2.3 * pupilScale} fill={COL.pupil} />
    <circle cx={px + 1.5} cy={py - 1.5} r={1.4} fill="white" opacity={0.8} />
  </g>
);

interface JoeMouthProps { shape: MouthShape; curve: number; width: number; emotionOpen: number; talking: boolean; }

const JoeMouth: React.FC<JoeMouthProps> = ({ shape, curve, width, emotionOpen, talking }) => {
  const talkOpen = talking ? [0, 3, 7, 11][shape] : emotionOpen * 10;
  const openAmount = Math.max(talkOpen, emotionOpen * 10);
  const hw = 13 * width;

  if (openAmount < 1) {
    return (
      <path d={`M${-hw},28 Q0,${28 + curve} ${hw},28`}
        fill="none" stroke={COL.outline} strokeWidth={2.5} strokeLinecap="round" />
    );
  }

  return (
    <g transform="translate(0, 28)">
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

export default AverageJoe;
