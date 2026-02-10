import React, { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';
import { getIdleState } from '../animations/idle';
import { getMouthShape, getTalkingBounce, getTalkingGesture } from '../animations/talking';
import { interpolateEmotions } from '../animations/emotions';
import type { Emotion } from '../animations/emotions';
import type { MouthShape } from '../animations/talking';

// Pharaoh: ancient Egyptian ruler — gold headdress, kohl eyes, regal bearing
// Used in scenes where Professor Pint visits the pyramids

interface PharaohProps {
  emotion?: Emotion;
  previousEmotion?: Emotion;
  emotionTransitionProgress?: number;
  talking?: boolean;
  scale?: number;
}

const COL = {
  skin: '#C8956A',
  skinShadow: '#A87850',
  outline: '#1A1A1A',
  headdress: '#1E3A8A',
  headdressStripe: '#D4A012',
  headdressGold: '#FFD700',
  cobra: '#2D5016',
  cobraGold: '#D4A012',
  collar: '#D4A012',
  collarGem: '#DC2626',
  collarGem2: '#1E3A8A',
  robe: '#F5F0E1',
  robeShadow: '#E0D8C0',
  sash: '#D4A012',
  kohl: '#1A1A1A',
  eyeWhite: '#FFFFFF',
  iris: '#4A3520',
  pupil: '#1A1A1A',
  mouth: '#6B2020',
  tongue: '#AA4444',
  blush: '#D4A080',
  shine: 'rgba(255,255,255,0.4)',
};

const SW = 3.5;

export const Pharaoh: React.FC<PharaohProps> = ({
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
      viewBox="-130 -220 260 420"
      width={260 * scale}
      height={420 * scale}
      style={{ overflow: 'visible' }}
    >
      <g transform={`translate(${idle.sway.x}, ${bodyY}) rotate(${idle.sway.rotation})`}>
        {/* Legs (hidden under robe, just feet) */}
        <PharaohLegs />

        {/* Body */}
        <g transform={`scale(${idle.breathing.scaleX}, 1)`}>
          <PharaohBody />
        </g>

        {/* Left arm with crook */}
        <PharaohLeftArm gestureRotation={talkGesture} />

        {/* Right arm with flail */}
        <PharaohRightArm />

        {/* Head */}
        <g transform={`translate(0, -110) rotate(${emo.headTilt})`}>
          <PharaohHead emo={emo} blink={idle.blink} pupil={idle.pupil} mouthShape={mouthShape} talking={talking} />
        </g>
      </g>
    </svg>
  );
};

const PharaohLegs: React.FC = () => (
  <g>
    <path d="M-18,110 L-22,140 L-8,140 Z" fill={COL.robe} stroke={COL.outline} strokeWidth={2} />
    <path d="M18,110 L22,140 L8,140 Z" fill={COL.robe} stroke={COL.outline} strokeWidth={2} />
    {/* Sandals */}
    <ellipse cx={-18} cy={142} rx={15} ry={5} fill="#8B6B4A" stroke={COL.outline} strokeWidth={2} />
    <ellipse cx={18} cy={142} rx={15} ry={5} fill="#8B6B4A" stroke={COL.outline} strokeWidth={2} />
  </g>
);

const PharaohBody: React.FC = () => (
  <g>
    {/* Robe */}
    <path
      d="M-40,-40 Q-40,-48 -28,-48 L28,-48 Q40,-48 40,-40 L44,105 Q44,115 0,118 Q-44,115 -44,105 Z"
      fill={COL.robe} stroke={COL.outline} strokeWidth={SW}
    />
    {/* Robe fold lines */}
    <line x1={-10} y1={-20} x2={-15} y2={100} stroke={COL.robeShadow} strokeWidth={1.5} opacity={0.4} />
    <line x1={10} y1={-20} x2={15} y2={100} stroke={COL.robeShadow} strokeWidth={1.5} opacity={0.4} />

    {/* Gold sash/belt */}
    <rect x={-38} y={10} width={76} height={12} rx={3} fill={COL.sash} stroke={COL.outline} strokeWidth={2} />
    <circle cx={0} cy={16} r={5} fill={COL.collarGem} stroke={COL.outline} strokeWidth={1.5} />

    {/* Broad collar (usekh) */}
    <path
      d="M-38,-42 Q-32,-52 0,-55 Q32,-52 38,-42 L32,-30 Q16,-38 0,-40 Q-16,-38 -32,-30 Z"
      fill={COL.collar} stroke={COL.outline} strokeWidth={2}
    />
    {/* Collar gem row */}
    <circle cx={-18} cy={-38} r={3} fill={COL.collarGem} stroke={COL.outline} strokeWidth={1} />
    <circle cx={0} cy={-42} r={3} fill={COL.collarGem2} stroke={COL.outline} strokeWidth={1} />
    <circle cx={18} cy={-38} r={3} fill={COL.collarGem} stroke={COL.outline} strokeWidth={1} />
    <circle cx={-9} cy={-40} r={2.5} fill={COL.collarGem2} stroke={COL.outline} strokeWidth={1} />
    <circle cx={9} cy={-40} r={2.5} fill={COL.collarGem2} stroke={COL.outline} strokeWidth={1} />

    {/* Neck */}
    <rect x={-10} y={-52} width={20} height={10} fill={COL.skin} stroke={COL.outline} strokeWidth={SW} />
  </g>
);

const PharaohLeftArm: React.FC<{ gestureRotation: number }> = ({ gestureRotation }) => (
  <g transform={`translate(-42, -22) rotate(${-10 + gestureRotation}, 0, 0)`}>
    <line x1={0} y1={0} x2={-16} y2={36} stroke={COL.robe} strokeWidth={12} strokeLinecap="round" />
    <line x1={0} y1={0} x2={-16} y2={36} stroke={COL.outline} strokeWidth={14} strokeLinecap="round" opacity={0.12} />
    <g transform="translate(-16, 36)">
      <line x1={0} y1={0} x2={-6} y2={28} stroke={COL.skin} strokeWidth={7} strokeLinecap="round" />
      {/* Hand holding crook */}
      <circle cx={-8} cy={32} r={7} fill={COL.skin} stroke={COL.outline} strokeWidth={SW} />
      {/* Crook */}
      <path d="M-8,24 L-8,-10 Q-8,-22 -18,-22 Q-28,-22 -28,-14" fill="none"
        stroke={COL.headdressGold} strokeWidth={3.5} strokeLinecap="round" />
    </g>
  </g>
);

const PharaohRightArm: React.FC = () => (
  <g transform="translate(42, -22)">
    <line x1={0} y1={0} x2={14} y2={36} stroke={COL.robe} strokeWidth={12} strokeLinecap="round" />
    <line x1={0} y1={0} x2={14} y2={36} stroke={COL.outline} strokeWidth={14} strokeLinecap="round" opacity={0.12} />
    <g transform="translate(14, 36)">
      <line x1={0} y1={0} x2={4} y2={28} stroke={COL.skin} strokeWidth={7} strokeLinecap="round" />
      <circle cx={6} cy={32} r={7} fill={COL.skin} stroke={COL.outline} strokeWidth={SW} />
      {/* Flail */}
      <line x1={6} y1={24} x2={6} y2={-5} stroke={COL.headdressGold} strokeWidth={3} strokeLinecap="round" />
      <line x1={6} y1={-5} x2={16} y2={5} stroke={COL.headdressGold} strokeWidth={2.5} />
      <line x1={6} y1={-5} x2={18} y2={-2} stroke={COL.headdressGold} strokeWidth={2.5} />
      <line x1={6} y1={-5} x2={14} y2={-10} stroke={COL.headdressGold} strokeWidth={2.5} />
    </g>
  </g>
);

interface PharaohHeadProps {
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

const PharaohHead: React.FC<PharaohHeadProps> = ({ emo, blink, pupil, mouthShape, talking }) => (
  <g>
    {/* Nemes headdress - back */}
    <path
      d="M-55,10 Q-65,-10 -55,-40 Q-45,-65 0,-70 Q45,-65 55,-40 Q65,-10 55,10
         L50,50 L42,55 L42,10 Q42,-30 0,-35 Q-42,-30 -42,10 L-42,55 L-50,50 Z"
      fill={COL.headdress} stroke={COL.outline} strokeWidth={2.5}
    />
    {/* Headdress stripes */}
    <path d="M-48,-20 Q0,-55 48,-20" fill="none" stroke={COL.headdressStripe} strokeWidth={3} />
    <path d="M-52,-5 Q0,-40 52,-5" fill="none" stroke={COL.headdressStripe} strokeWidth={3} />
    <path d="M-54,10 Q0,-25 54,10" fill="none" stroke={COL.headdressStripe} strokeWidth={3} />

    {/* Face */}
    <ellipse cx={0} cy={2} rx={42} ry={46} fill={COL.skin} stroke={COL.outline} strokeWidth={SW} />

    {/* Headdress front band */}
    <path d="M-42,-28 Q0,-50 42,-28" fill={COL.headdressGold} stroke={COL.outline} strokeWidth={2} />

    {/* Cobra (uraeus) */}
    <g transform="translate(0, -48)">
      <path d="M0,0 L0,-15 Q-4,-22 -2,-25 Q0,-28 2,-25 Q4,-22 0,-15"
        fill={COL.cobra} stroke={COL.outline} strokeWidth={1.5} />
      <circle cx={0} cy={-22} r={3.5} fill={COL.cobraGold} stroke={COL.outline} strokeWidth={1.5} />
      <circle cx={-1} cy={-23} r={1} fill={COL.outline} />
      <circle cx={1} cy={-23} r={1} fill={COL.outline} />
    </g>

    {/* Kohl eyes - thicker outline */}
    <g transform={`translate(-15, ${0 + emo.eyeOffsetY})`}>
      <PharaohEye blink={blink} scaleY={emo.eyeScaleY} pupilScale={emo.pupilScale} px={pupil.x} py={pupil.y} />
    </g>
    <g transform={`translate(15, ${0 + emo.eyeOffsetY})`}>
      <PharaohEye blink={blink} scaleY={emo.eyeScaleY} pupilScale={emo.pupilScale} px={pupil.x} py={pupil.y} />
    </g>

    {/* Eyebrows */}
    <g transform={`translate(-15, ${-14 + emo.browLeftY}) rotate(${emo.browLeftRotation})`}>
      <rect x={-9} y={0} width={18} height={3} rx={1.5} fill={COL.kohl} />
    </g>
    <g transform={`translate(15, ${-14 + emo.browRightY}) rotate(${emo.browRightRotation})`}>
      <rect x={-9} y={0} width={18} height={3} rx={1.5} fill={COL.kohl} />
    </g>

    {/* Blush */}
    {emo.blushOpacity > 0.01 && (
      <>
        <ellipse cx={-24} cy={15} rx={7} ry={4} fill={COL.blush} opacity={emo.blushOpacity} />
        <ellipse cx={24} cy={15} rx={7} ry={4} fill={COL.blush} opacity={emo.blushOpacity} />
      </>
    )}

    {/* Nose */}
    <path d="M-3,8 Q0,16 3,8" fill="none" stroke={COL.outline} strokeWidth={2} strokeLinecap="round" />

    {/* False beard (thin ceremonial beard) */}
    <path d="M-4,38 L-3,65 Q0,70 3,65 L4,38" fill={COL.headdress} stroke={COL.outline} strokeWidth={2} />

    {/* Mouth */}
    <PharaohMouth shape={mouthShape} curve={emo.mouthCurve} width={emo.mouthWidth}
      emotionOpen={emo.mouthOpen} talking={talking} />

    {/* Headdress side flaps */}
    <path d="M-42,10 L-42,55 L-34,50 L-34,10" fill={COL.headdress} stroke={COL.outline} strokeWidth={2} />
    <path d="M42,10 L42,55 L34,50 L34,10" fill={COL.headdress} stroke={COL.outline} strokeWidth={2} />
    <line x1={-38} y1={20} x2={-38} y2={48} stroke={COL.headdressStripe} strokeWidth={2} />
    <line x1={38} y1={20} x2={38} y2={48} stroke={COL.headdressStripe} strokeWidth={2} />
  </g>
);

interface PharaohEyeProps { blink: number; scaleY: number; pupilScale: number; px: number; py: number; }

const PharaohEye: React.FC<PharaohEyeProps> = ({ blink, scaleY, pupilScale, px, py }) => (
  <g transform={`scale(1, ${scaleY * blink})`}>
    {/* Kohl outline - extended wing */}
    <path d="M-12,0 Q0,-9 12,0 Q0,7 -12,0 Z" fill={COL.eyeWhite} stroke={COL.kohl} strokeWidth={2.5} />
    {/* Kohl wing extending outward */}
    <path d="M12,0 L18,-4" fill="none" stroke={COL.kohl} strokeWidth={2} strokeLinecap="round" />
    <circle cx={px} cy={py} r={4 * pupilScale} fill={COL.iris} />
    <circle cx={px} cy={py} r={2.2 * pupilScale} fill={COL.pupil} />
    <circle cx={px + 1.5} cy={py - 1.5} r={1.2} fill="white" opacity={0.8} />
  </g>
);

interface PharaohMouthProps { shape: MouthShape; curve: number; width: number; emotionOpen: number; talking: boolean; }

const PharaohMouth: React.FC<PharaohMouthProps> = ({ shape, curve, width, emotionOpen, talking }) => {
  const talkOpen = talking ? [0, 3, 6, 10][shape] : emotionOpen * 10;
  const openAmount = Math.max(talkOpen, emotionOpen * 10);
  const hw = 11 * width;

  if (openAmount < 1) {
    return (
      <path d={`M${-hw},26 Q0,${26 + curve} ${hw},26`}
        fill="none" stroke={COL.outline} strokeWidth={2.5} strokeLinecap="round" />
    );
  }

  return (
    <g transform="translate(0, 26)">
      <ellipse cx={0} cy={0} rx={hw} ry={openAmount * 0.5}
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

export default Pharaoh;
