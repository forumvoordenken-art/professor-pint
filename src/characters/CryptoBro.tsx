import React, { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';
import { getIdleState } from '../animations/idle';
import { getMouthShape, getTalkingBounce, getTalkingGesture } from '../animations/talking';
import { interpolateEmotions } from '../animations/emotions';
import type { Emotion } from '../animations/emotions';
import type { MouthShape } from '../animations/talking';

// CryptoBro: backwards cap, tech hoodie, oversized headphones, phone in hand
// Used in cryptocurrency / blockchain scenes

interface CryptoBroProps {
  emotion?: Emotion;
  previousEmotion?: Emotion;
  emotionTransitionProgress?: number;
  talking?: boolean;
  scale?: number;
}

const COL = {
  skin: '#F0C8A0',
  skinShadow: '#D8B088',
  outline: '#1A1A1A',
  hoodie: '#1A1A2E',
  hoodieLogo: '#F7931A', // Bitcoin orange
  hoodieAccent: '#2D2D44',
  tshirt: '#222222',
  cap: '#2D2D44',
  capBrim: '#1A1A30',
  headphones: '#333333',
  headphonePad: '#444444',
  headphoneAccent: '#00D4AA', // crypto green
  hair: '#FFD700',
  hairDark: '#DAA520',
  eyeWhite: '#FFFFFF',
  iris: '#40A0A0',
  pupil: '#1A1A1A',
  mouth: '#8B2020',
  tongue: '#CC5555',
  blush: '#FFBBAA',
  shine: 'rgba(255,255,255,0.5)',
  shoe: '#FFFFFF', // white sneakers
  shoeSole: '#333333',
  phone: '#1A1A1A',
  phoneScreen: '#00D4AA',
};

const SW = 3.5;

export const CryptoBro: React.FC<CryptoBroProps> = ({
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
      viewBox="-130 -210 260 400"
      width={260 * scale}
      height={400 * scale}
      style={{ overflow: 'visible' }}
    >
      <g transform={`translate(${idle.sway.x}, ${bodyY}) rotate(${idle.sway.rotation})`}>
        <CryptoLegs />
        <g transform={`scale(${idle.breathing.scaleX}, 1)`}>
          <CryptoBody />
        </g>
        <CryptoLeftArm gestureRotation={talkGesture} />
        <CryptoRightArm />
        <g transform={`translate(0, -100) rotate(${emo.headTilt})`}>
          <CryptoHead emo={emo} blink={idle.blink} pupil={idle.pupil} mouthShape={mouthShape} talking={talking} />
        </g>
      </g>
    </svg>
  );
};

const CryptoLegs: React.FC = () => (
  <g>
    {/* Joggers */}
    <path d="M-18,65 L-22,130 L-6,130 L-4,70 Z" fill={COL.outline} stroke={COL.outline} strokeWidth={2} />
    <path d="M18,65 L22,130 L6,130 L4,70 Z" fill={COL.outline} stroke={COL.outline} strokeWidth={2} />
    {/* White sneakers */}
    <ellipse cx={-18} cy={133} rx={16} ry={7} fill={COL.shoe} stroke={COL.outline} strokeWidth={2} />
    <ellipse cx={18} cy={133} rx={16} ry={7} fill={COL.shoe} stroke={COL.outline} strokeWidth={2} />
    <line x1={-28} y1={133} x2={-8} y2={133} stroke={COL.shoeSole} strokeWidth={2} />
    <line x1={8} y1={133} x2={28} y2={133} stroke={COL.shoeSole} strokeWidth={2} />
  </g>
);

const CryptoBody: React.FC = () => (
  <g>
    {/* Oversized hoodie */}
    <path
      d="M-48,-38 Q-48,-45 -35,-45 L35,-45 Q48,-45 48,-38 L48,60 Q48,72 0,75 Q-48,72 -48,60 Z"
      fill={COL.hoodie} stroke={COL.outline} strokeWidth={SW}
    />
    {/* Bitcoin logo on chest */}
    <circle cx={0} cy={10} r={14} fill={COL.hoodieLogo} opacity={0.8} />
    <text x={0} y={16} textAnchor="middle" fontSize={18} fontWeight="bold"
      fill="white" fontFamily="sans-serif">₿</text>

    {/* Hoodie pocket */}
    <path d="M-28,30 L-28,55 Q-28,60 -22,60 L22,60 Q28,60 28,55 L28,30"
      fill="none" stroke={COL.hoodieAccent} strokeWidth={2} opacity={0.5} />

    {/* Hood */}
    <path d="M-22,-42 Q-25,-50 -14,-50 L14,-50 Q25,-50 22,-42"
      fill={COL.hoodieAccent} stroke={COL.outline} strokeWidth={2} />

    {/* Neck */}
    <rect x={-10} y={-48} width={20} height={10} fill={COL.skin} stroke={COL.outline} strokeWidth={SW} />
  </g>
);

const CryptoLeftArm: React.FC<{ gestureRotation: number }> = ({ gestureRotation }) => (
  <g transform={`translate(-48, -22) rotate(${-8 + gestureRotation}, 0, 0)`}>
    <line x1={0} y1={0} x2={-14} y2={35} stroke={COL.hoodie} strokeWidth={14} strokeLinecap="round" />
    <line x1={0} y1={0} x2={-14} y2={35} stroke={COL.outline} strokeWidth={16} strokeLinecap="round" opacity={0.12} />
    <g transform="translate(-14, 35)">
      <line x1={0} y1={0} x2={-6} y2={28} stroke={COL.skin} strokeWidth={7} strokeLinecap="round" />
      <circle cx={-8} cy={32} r={7.5} fill={COL.skin} stroke={COL.outline} strokeWidth={SW} />
    </g>
  </g>
);

const CryptoRightArm: React.FC = () => (
  <g transform="translate(48, -22)">
    <line x1={0} y1={0} x2={14} y2={35} stroke={COL.hoodie} strokeWidth={14} strokeLinecap="round" />
    <line x1={0} y1={0} x2={14} y2={35} stroke={COL.outline} strokeWidth={16} strokeLinecap="round" opacity={0.12} />
    <g transform="translate(14, 35)">
      <line x1={0} y1={0} x2={6} y2={22} stroke={COL.skin} strokeWidth={7} strokeLinecap="round" />
      <circle cx={8} cy={26} r={7.5} fill={COL.skin} stroke={COL.outline} strokeWidth={SW} />
      {/* Phone in hand */}
      <rect x={0} y={12} width={14} height={24} rx={3} fill={COL.phone} stroke={COL.outline} strokeWidth={1.5} />
      <rect x={2} y={15} width={10} height={16} rx={1} fill={COL.phoneScreen} opacity={0.7} />
      {/* Chart line on screen */}
      <path d="M4,28 L6,24 L8,26 L10,20" fill="none" stroke="white" strokeWidth={1} />
    </g>
  </g>
);

interface CryptoHeadProps {
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

const CryptoHead: React.FC<CryptoHeadProps> = ({ emo, blink, pupil, mouthShape, talking }) => (
  <g>
    {/* Head */}
    <ellipse cx={0} cy={2} rx={44} ry={46} fill={COL.skin} stroke={COL.outline} strokeWidth={SW} />

    {/* Blonde/dyed hair peek from under cap */}
    <path d="M-38,-15 Q-42,-25 -35,-30 Q-25,-35 0,-36 Q25,-35 35,-30 Q42,-25 38,-15"
      fill={COL.hair} stroke={COL.outline} strokeWidth={2} />

    {/* Backwards cap */}
    <path d="M-40,-18 Q-38,-40 0,-44 Q38,-40 40,-18 L38,-12 Q20,-28 0,-30 Q-20,-28 -38,-12 Z"
      fill={COL.cap} stroke={COL.outline} strokeWidth={2.5} />
    {/* Cap brim (backwards) */}
    <path d="M-25,-10 Q-35,-8 -40,-15 Q-42,-20 -38,-22"
      fill={COL.capBrim} stroke={COL.outline} strokeWidth={2} />

    {/* Headphones */}
    <path d="M-44,0 Q-50,-20 -42,-35" fill="none" stroke={COL.headphones} strokeWidth={5} strokeLinecap="round" />
    <path d="M44,0 Q50,-20 42,-35" fill="none" stroke={COL.headphones} strokeWidth={5} strokeLinecap="round" />
    {/* Headphone band across top */}
    <path d="M-42,-35 Q0,-52 42,-35" fill="none" stroke={COL.headphones} strokeWidth={4} />
    {/* Ear pads */}
    <ellipse cx={-46} cy={4} rx={10} ry={14} fill={COL.headphonePad} stroke={COL.outline} strokeWidth={2} />
    <ellipse cx={46} cy={4} rx={10} ry={14} fill={COL.headphonePad} stroke={COL.outline} strokeWidth={2} />
    <ellipse cx={-46} cy={4} rx={6} ry={10} fill={COL.headphoneAccent} opacity={0.3} />
    <ellipse cx={46} cy={4} rx={6} ry={10} fill={COL.headphoneAccent} opacity={0.3} />

    {/* Eyes */}
    <g transform={`translate(-14, ${0 + emo.eyeOffsetY})`}>
      <CryptoEye blink={blink} scaleY={emo.eyeScaleY} pupilScale={emo.pupilScale} px={pupil.x} py={pupil.y} />
    </g>
    <g transform={`translate(14, ${0 + emo.eyeOffsetY})`}>
      <CryptoEye blink={blink} scaleY={emo.eyeScaleY} pupilScale={emo.pupilScale} px={pupil.x} py={pupil.y} />
    </g>

    {/* Eyebrows */}
    <g transform={`translate(-14, ${-13 + emo.browLeftY}) rotate(${emo.browLeftRotation})`}>
      <rect x={-8} y={0} width={16} height={3.5} rx={1.5} fill={COL.hair} />
    </g>
    <g transform={`translate(14, ${-13 + emo.browRightY}) rotate(${emo.browRightRotation})`}>
      <rect x={-8} y={0} width={16} height={3.5} rx={1.5} fill={COL.hair} />
    </g>

    {emo.blushOpacity > 0.01 && (
      <>
        <ellipse cx={-26} cy={16} rx={7} ry={4} fill={COL.blush} opacity={emo.blushOpacity} />
        <ellipse cx={26} cy={16} rx={7} ry={4} fill={COL.blush} opacity={emo.blushOpacity} />
      </>
    )}

    {/* Nose */}
    <path d="M-3,10 Q0,17 3,10" fill="none" stroke={COL.outline} strokeWidth={2} strokeLinecap="round" />

    {/* Small goatee */}
    <ellipse cx={0} cy={38} rx={5} ry={4} fill={COL.hairDark} opacity={0.4} />

    {/* Mouth */}
    <CryptoMouth shape={mouthShape} curve={emo.mouthCurve} width={emo.mouthWidth}
      emotionOpen={emo.mouthOpen} talking={talking} />
  </g>
);

interface CryptoEyeProps { blink: number; scaleY: number; pupilScale: number; px: number; py: number; }

const CryptoEye: React.FC<CryptoEyeProps> = ({ blink, scaleY, pupilScale, px, py }) => (
  <g transform={`scale(1, ${scaleY * blink})`}>
    <ellipse cx={0} cy={0} rx={9} ry={7} fill={COL.eyeWhite} stroke={COL.outline} strokeWidth={1.5} />
    <circle cx={px} cy={py} r={4.2 * pupilScale} fill={COL.iris} />
    <circle cx={px} cy={py} r={2.3 * pupilScale} fill={COL.pupil} />
    <circle cx={px + 1.5} cy={py - 1.5} r={1.3} fill="white" opacity={0.8} />
  </g>
);

interface CryptoMouthProps { shape: MouthShape; curve: number; width: number; emotionOpen: number; talking: boolean; }

const CryptoMouth: React.FC<CryptoMouthProps> = ({ shape, curve, width, emotionOpen, talking }) => {
  const talkOpen = talking ? [0, 3, 7, 11][shape] : emotionOpen * 10;
  const openAmount = Math.max(talkOpen, emotionOpen * 10);
  const hw = 12 * width;

  if (openAmount < 1) {
    return (
      <path d={`M${-hw},28 Q0,${28 + curve} ${hw},28`}
        fill="none" stroke={COL.outline} strokeWidth={2.5} strokeLinecap="round" />
    );
  }

  return (
    <g transform="translate(0, 28)">
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

export default CryptoBro;
