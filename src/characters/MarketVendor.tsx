import React, { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';
import { getIdleState } from '../animations/idle';
import { getMouthShape, getTalkingBounce, getTalkingGesture } from '../animations/talking';
import { interpolateEmotions } from '../animations/emotions';
import type { Emotion } from '../animations/emotions';
import type { MouthShape } from '../animations/talking';

// MarketVendor: friendly market seller, apron, cap, ruddy cheeks
// Used in inflation/price scenes

interface MarketVendorProps {
  emotion?: Emotion;
  previousEmotion?: Emotion;
  emotionTransitionProgress?: number;
  talking?: boolean;
  scale?: number;
}

const COL = {
  skin: '#E8B888',
  skinShadow: '#D0A070',
  outline: '#1A1A1A',
  apron: '#F5F0E0',
  apronStripe: '#CC3333',
  shirt: '#4A7A4A',
  shirtDark: '#3A6A3A',
  cap: '#4A7A4A',
  capBrim: '#3A6A3A',
  hair: '#8B4513',
  hairDark: '#6B3010',
  mustache: '#6B3010',
  eyeWhite: '#FFFFFF',
  iris: '#5B4020',
  pupil: '#1A1A1A',
  mouth: '#8B2020',
  tongue: '#CC5555',
  blush: '#FF9999',
  shine: 'rgba(255,255,255,0.45)',
  shoe: '#5C3A1E',
};

const SW = 3.5;

export const MarketVendor: React.FC<MarketVendorProps> = ({
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
      viewBox="-130 -200 260 390"
      width={260 * scale}
      height={390 * scale}
      style={{ overflow: 'visible' }}
    >
      <g transform={`translate(${idle.sway.x}, ${bodyY}) rotate(${idle.sway.rotation})`}>
        <VendorLegs />
        <g transform={`scale(${idle.breathing.scaleX}, 1)`}>
          <VendorBody />
        </g>
        <VendorLeftArm gestureRotation={talkGesture} />
        <VendorRightArm />
        <g transform={`translate(0, -98) rotate(${emo.headTilt})`}>
          <VendorHead emo={emo} blink={idle.blink} pupil={idle.pupil} mouthShape={mouthShape} talking={talking} />
        </g>
      </g>
    </svg>
  );
};

const VendorLegs: React.FC = () => (
  <g>
    <path d="M-18,65 L-22,130 L-8,130 Z" fill="#4A4A5A" stroke={COL.outline} strokeWidth={SW} />
    <path d="M18,65 L22,130 L8,130 Z" fill="#4A4A5A" stroke={COL.outline} strokeWidth={SW} />
    <ellipse cx={-18} cy={132} rx={15} ry={6} fill={COL.shoe} stroke={COL.outline} strokeWidth={2} />
    <ellipse cx={18} cy={132} rx={15} ry={6} fill={COL.shoe} stroke={COL.outline} strokeWidth={2} />
  </g>
);

const VendorBody: React.FC = () => (
  <g>
    {/* Shirt */}
    <path
      d="M-46,-38 Q-46,-45 -34,-45 L34,-45 Q46,-45 46,-38 L46,58 Q46,70 0,73 Q-46,70 -46,58 Z"
      fill={COL.shirt} stroke={COL.outline} strokeWidth={SW}
    />
    <line x1={0} y1={-20} x2={0} y2={60} stroke={COL.shirtDark} strokeWidth={1} opacity={0.3} />

    {/* Apron */}
    <path
      d="M-32,-10 L-32,65 Q-32,72 0,74 Q32,72 32,65 L32,-10 Q32,-18 0,-20 Q-32,-18 -32,-10 Z"
      fill={COL.apron} stroke={COL.outline} strokeWidth={2.5}
    />
    {/* Apron stripes */}
    <line x1={-15} y1={-15} x2={-15} y2={68} stroke={COL.apronStripe} strokeWidth={2} opacity={0.3} />
    <line x1={15} y1={-15} x2={15} y2={68} stroke={COL.apronStripe} strokeWidth={2} opacity={0.3} />
    {/* Apron pocket */}
    <rect x={-14} y={20} width={28} height={18} rx={3} fill="none" stroke={COL.outline} strokeWidth={1.5} opacity={0.4} />
    {/* Pencil in pocket */}
    <line x1={8} y1={18} x2={10} y2={32} stroke="#D4A012" strokeWidth={2} />

    {/* Apron straps (neck) */}
    <path d="M-32,-10 L-20,-42" stroke={COL.apron} strokeWidth={5} />
    <path d="M32,-10 L20,-42" stroke={COL.apron} strokeWidth={5} />
    <path d="M-32,-10 L-20,-42" stroke={COL.outline} strokeWidth={1.5} fill="none" />
    <path d="M32,-10 L20,-42" stroke={COL.outline} strokeWidth={1.5} fill="none" />

    {/* Neck */}
    <rect x={-10} y={-48} width={20} height={10} fill={COL.skin} stroke={COL.outline} strokeWidth={SW} />
  </g>
);

const VendorLeftArm: React.FC<{ gestureRotation: number }> = ({ gestureRotation }) => (
  <g transform={`translate(-46, -22) rotate(${-10 + gestureRotation}, 0, 0)`}>
    <line x1={0} y1={0} x2={-14} y2={34} stroke={COL.shirt} strokeWidth={13} strokeLinecap="round" />
    <line x1={0} y1={0} x2={-14} y2={34} stroke={COL.outline} strokeWidth={15} strokeLinecap="round" opacity={0.12} />
    <g transform="translate(-14, 34)">
      <line x1={0} y1={0} x2={-6} y2={26} stroke={COL.skin} strokeWidth={7} strokeLinecap="round" />
      <circle cx={-8} cy={30} r={8} fill={COL.skin} stroke={COL.outline} strokeWidth={SW} />
    </g>
  </g>
);

const VendorRightArm: React.FC = () => (
  <g transform="translate(46, -22)">
    <line x1={0} y1={0} x2={14} y2={34} stroke={COL.shirt} strokeWidth={13} strokeLinecap="round" />
    <line x1={0} y1={0} x2={14} y2={34} stroke={COL.outline} strokeWidth={15} strokeLinecap="round" opacity={0.12} />
    <g transform="translate(14, 34)">
      <line x1={0} y1={0} x2={4} y2={26} stroke={COL.skin} strokeWidth={7} strokeLinecap="round" />
      <circle cx={6} cy={30} r={8} fill={COL.skin} stroke={COL.outline} strokeWidth={SW} />
    </g>
  </g>
);

interface VendorHeadProps {
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

const VendorHead: React.FC<VendorHeadProps> = ({ emo, blink, pupil, mouthShape, talking }) => (
  <g>
    {/* Round head */}
    <circle cx={0} cy={2} r={48} fill={COL.skin} stroke={COL.outline} strokeWidth={SW} />

    {/* Ruddy cheeks (always slightly rosy) */}
    <ellipse cx={-30} cy={16} rx={10} ry={6} fill={COL.blush} opacity={0.25 + emo.blushOpacity * 0.4} />
    <ellipse cx={30} cy={16} rx={10} ry={6} fill={COL.blush} opacity={0.25 + emo.blushOpacity * 0.4} />

    {/* Hair sides */}
    <path d="M-44,-8 Q-50,-18 -44,-30 Q-38,-38 -28,-40" fill={COL.hair} stroke={COL.outline} strokeWidth={2} />
    <path d="M44,-8 Q50,-18 44,-30 Q38,-38 28,-40" fill={COL.hair} stroke={COL.outline} strokeWidth={2} />

    {/* Flat cap */}
    <path
      d="M-44,-18 Q-44,-38 0,-42 Q44,-38 44,-18 L40,-14 Q20,-25 0,-26 Q-20,-25 -40,-14 Z"
      fill={COL.cap} stroke={COL.outline} strokeWidth={2.5}
    />
    {/* Cap brim */}
    <path d="M-44,-18 Q-50,-16 -46,-12 L44,-12 Q50,-16 44,-18"
      fill={COL.capBrim} stroke={COL.outline} strokeWidth={2} />

    {/* Ears */}
    <ellipse cx={-46} cy={5} rx={7} ry={11} fill={COL.skin} stroke={COL.outline} strokeWidth={2.5} />
    <ellipse cx={46} cy={5} rx={7} ry={11} fill={COL.skin} stroke={COL.outline} strokeWidth={2.5} />

    {/* Eyes */}
    <g transform={`translate(-16, ${0 + emo.eyeOffsetY})`}>
      <VendorEye blink={blink} scaleY={emo.eyeScaleY} pupilScale={emo.pupilScale} px={pupil.x} py={pupil.y} />
    </g>
    <g transform={`translate(16, ${0 + emo.eyeOffsetY})`}>
      <VendorEye blink={blink} scaleY={emo.eyeScaleY} pupilScale={emo.pupilScale} px={pupil.x} py={pupil.y} />
    </g>

    {/* Eyebrows */}
    <g transform={`translate(-16, ${-13 + emo.browLeftY}) rotate(${emo.browLeftRotation})`}>
      <rect x={-9} y={0} width={18} height={4} rx={2} fill={COL.hair} />
    </g>
    <g transform={`translate(16, ${-13 + emo.browRightY}) rotate(${emo.browRightRotation})`}>
      <rect x={-9} y={0} width={18} height={4} rx={2} fill={COL.hair} />
    </g>

    {/* Big nose */}
    <path d="M-5,8 Q-8,18 -3,20 Q0,22 3,20 Q8,18 5,8" fill={COL.skinShadow} stroke={COL.outline} strokeWidth={2} />

    {/* Handlebar mustache */}
    <path d="M-2,22 Q-10,24 -18,20 Q-22,18 -20,16" fill={COL.mustache} stroke={COL.outline} strokeWidth={1.5} />
    <path d="M2,22 Q10,24 18,20 Q22,18 20,16" fill={COL.mustache} stroke={COL.outline} strokeWidth={1.5} />

    {/* Mouth */}
    <VendorMouth shape={mouthShape} curve={emo.mouthCurve} width={emo.mouthWidth}
      emotionOpen={emo.mouthOpen} talking={talking} />
  </g>
);

interface VendorEyeProps { blink: number; scaleY: number; pupilScale: number; px: number; py: number; }

const VendorEye: React.FC<VendorEyeProps> = ({ blink, scaleY, pupilScale, px, py }) => (
  <g transform={`scale(1, ${scaleY * blink})`}>
    <ellipse cx={0} cy={0} rx={8} ry={6.5} fill={COL.eyeWhite} stroke={COL.outline} strokeWidth={1.5} />
    <circle cx={px} cy={py} r={3.8 * pupilScale} fill={COL.iris} />
    <circle cx={px} cy={py} r={2 * pupilScale} fill={COL.pupil} />
    <circle cx={px + 1.5} cy={py - 1.5} r={1.2} fill="white" opacity={0.8} />
  </g>
);

interface VendorMouthProps { shape: MouthShape; curve: number; width: number; emotionOpen: number; talking: boolean; }

const VendorMouth: React.FC<VendorMouthProps> = ({ shape, curve, width, emotionOpen, talking }) => {
  const talkOpen = talking ? [0, 3, 7, 11][shape] : emotionOpen * 10;
  const openAmount = Math.max(talkOpen, emotionOpen * 10);
  const hw = 12 * width;

  if (openAmount < 1) {
    return (
      <path d={`M${-hw},30 Q0,${30 + curve} ${hw},30`}
        fill="none" stroke={COL.outline} strokeWidth={2.5} strokeLinecap="round" />
    );
  }

  return (
    <g transform="translate(0, 30)">
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

export default MarketVendor;
