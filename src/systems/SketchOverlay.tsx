// Hand-drawn / sketchy pop-up overlay system
// Tekst en getallen die eruit zien alsof ze met een dikke marker zijn getekend
// Bounce-in animatie, schuin, levendig

import React from 'react';
import { useCurrentFrame, interpolate, Easing } from 'remotion';

export type SketchOverlayType = 'sketchText' | 'sketchNumber' | 'sketchArrow' | 'sketchBox';

export interface SketchOverlayData {
  type: SketchOverlayType;
  startFrame: number;
  endFrame: number;
  props: Record<string, unknown>;
}

// ---- Sketchy Text Pop-up ----
interface SketchTextProps {
  text: string;
  startFrame: number;
  endFrame: number;
  x?: number;
  y?: number;
  color?: string;
  fontSize?: number;
  rotation?: number;
}

export const SketchText: React.FC<SketchTextProps> = ({
  text,
  startFrame,
  endFrame,
  x = 960,
  y = 200,
  color = '#FFD700',
  fontSize = 64,
  rotation = -3,
}) => {
  const frame = useCurrentFrame();
  if (frame < startFrame || frame > endFrame) return null;

  const localFrame = frame - startFrame;
  const duration = endFrame - startFrame;

  const scale = interpolate(
    localFrame,
    [0, 6, 10, 14],
    [0, 1.2, 0.9, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) },
  );

  const opacity = interpolate(
    localFrame,
    [0, 4, duration - 8, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const wobble = Math.sin(localFrame * 0.15) * 1.5;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation + wobble}deg)`,
        opacity,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          color,
          fontSize,
          fontFamily: "'Comic Sans MS', 'Marker Felt', 'Patrick Hand', cursive",
          fontWeight: 900,
          textShadow: '3px 3px 0 rgba(0,0,0,0.5), -1px -1px 0 rgba(0,0,0,0.3)',
          letterSpacing: 2,
          lineHeight: 1.2,
          textAlign: 'center',
          WebkitTextStroke: '1.5px rgba(0,0,0,0.4)',
          paintOrder: 'stroke fill',
        }}
      >
        {text}
      </div>
    </div>
  );
};

// ---- Sketchy Number (big stat) ----
interface SketchNumberProps {
  value: string;
  label?: string;
  startFrame: number;
  endFrame: number;
  x?: number;
  y?: number;
  color?: string;
}

export const SketchNumber: React.FC<SketchNumberProps> = ({
  value,
  label,
  startFrame,
  endFrame,
  x = 1500,
  y = 250,
  color = '#FF6B1A',
}) => {
  const frame = useCurrentFrame();
  if (frame < startFrame || frame > endFrame) return null;

  const localFrame = frame - startFrame;
  const duration = endFrame - startFrame;

  const scale = interpolate(
    localFrame,
    [0, 5, 8, 12],
    [0, 1.3, 0.95, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const opacity = interpolate(
    localFrame,
    [0, 3, duration - 6, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const wobble = Math.sin(localFrame * 0.12) * 2;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale}) rotate(${wobble}deg)`,
        opacity,
        textAlign: 'center',
        pointerEvents: 'none',
      }}
    >
      <svg width={200} height={200} viewBox="-100 -100 200 200"
        style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
        <ellipse cx={0} cy={0} rx={85 + wobble} ry={75 - wobble * 0.5}
          fill="rgba(0,0,0,0.6)" stroke={color} strokeWidth={4}
          strokeDasharray="12 4" transform={`rotate(${-5 + wobble * 0.5})`} />
      </svg>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            color,
            fontSize: 72,
            fontFamily: "'Comic Sans MS', 'Marker Felt', cursive",
            fontWeight: 900,
            textShadow: '2px 2px 0 rgba(0,0,0,0.5)',
            WebkitTextStroke: '1px rgba(0,0,0,0.3)',
            paintOrder: 'stroke fill',
          }}
        >
          {value}
        </div>
        {label && (
          <div
            style={{
              color: 'white',
              fontSize: 22,
              fontFamily: "'Comic Sans MS', 'Marker Felt', cursive",
              fontWeight: 700,
              marginTop: -4,
              textShadow: '1px 1px 0 rgba(0,0,0,0.5)',
            }}
          >
            {label}
          </div>
        )}
      </div>
    </div>
  );
};

// ---- Sketchy Arrow ----
interface SketchArrowProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  startFrame: number;
  endFrame: number;
  color?: string;
  label?: string;
}

export const SketchArrow: React.FC<SketchArrowProps> = ({
  fromX,
  fromY,
  toX,
  toY,
  startFrame,
  endFrame,
  color = '#FFD700',
  label,
}) => {
  const frame = useCurrentFrame();
  if (frame < startFrame || frame > endFrame) return null;

  const localFrame = frame - startFrame;
  const duration = endFrame - startFrame;

  const drawProgress = interpolate(
    localFrame,
    [0, 15],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) },
  );

  const opacity = interpolate(
    localFrame,
    [0, 5, duration - 8, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const currentToX = fromX + (toX - fromX) * drawProgress;
  const currentToY = fromY + (toY - fromY) * drawProgress;
  const angle = Math.atan2(toY - fromY, toX - fromX);
  const arrowSize = 15;

  return (
    <svg
      style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, pointerEvents: 'none', opacity }}
    >
      <line
        x1={fromX} y1={fromY} x2={currentToX} y2={currentToY}
        stroke={color} strokeWidth={4} strokeLinecap="round"
        strokeDasharray="8 3"
      />
      {drawProgress > 0.8 && (
        <g transform={`translate(${currentToX}, ${currentToY}) rotate(${angle * 180 / Math.PI})`}>
          <path d={`M0,0 L${-arrowSize},${-arrowSize * 0.5} L${-arrowSize},${arrowSize * 0.5} Z`}
            fill={color} />
        </g>
      )}
      {label && drawProgress > 0.5 && (
        <text
          x={(fromX + toX) / 2}
          y={(fromY + toY) / 2 - 15}
          textAnchor="middle"
          fill="white"
          fontSize={20}
          fontFamily="'Comic Sans MS', cursive"
          fontWeight={700}
          opacity={Math.min(1, (drawProgress - 0.5) * 4)}
        >
          {label}
        </text>
      )}
    </svg>
  );
};

// ---- Sketchy Highlight Box ----
interface SketchBoxProps {
  text: string;
  startFrame: number;
  endFrame: number;
  x?: number;
  y?: number;
  color?: string;
  bgColor?: string;
}

export const SketchBox: React.FC<SketchBoxProps> = ({
  text,
  startFrame,
  endFrame,
  x = 960,
  y = 200,
  color = '#FFD700',
  bgColor = 'rgba(0,0,0,0.7)',
}) => {
  const frame = useCurrentFrame();
  if (frame < startFrame || frame > endFrame) return null;

  const localFrame = frame - startFrame;
  const duration = endFrame - startFrame;

  const scale = interpolate(
    localFrame,
    [0, 4, 8, 12],
    [0.3, 1.1, 0.95, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const opacity = interpolate(
    localFrame,
    [0, 4, duration - 6, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const wobble = Math.sin(localFrame * 0.1) * 1;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale}) rotate(${-2 + wobble}deg)`,
        opacity,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          backgroundColor: bgColor,
          border: `3px solid ${color}`,
          borderRadius: 8,
          padding: '14px 28px',
          boxShadow: '4px 4px 0 rgba(0,0,0,0.4)',
        }}
      >
        <div
          style={{
            color,
            fontSize: 32,
            fontFamily: "'Comic Sans MS', 'Marker Felt', cursive",
            fontWeight: 800,
            textShadow: '1px 1px 0 rgba(0,0,0,0.3)',
            textAlign: 'center',
            lineHeight: 1.3,
          }}
        >
          {text}
        </div>
      </div>
    </div>
  );
};

// ---- Sketch Overlay Renderer ----
interface SketchOverlayRendererProps {
  overlays: SketchOverlayData[];
}

export const SketchOverlayRenderer: React.FC<SketchOverlayRendererProps> = ({ overlays }) => {
  return (
    <>
      {overlays.map((overlay, i) => {
        const p = overlay.props;
        switch (overlay.type) {
          case 'sketchText':
            return (
              <SketchText
                key={`sketch-${i}`}
                text={p.text as string}
                startFrame={overlay.startFrame}
                endFrame={overlay.endFrame}
                x={p.x as number}
                y={p.y as number}
                color={p.color as string}
                fontSize={p.fontSize as number}
                rotation={p.rotation as number}
              />
            );
          case 'sketchNumber':
            return (
              <SketchNumber
                key={`sketch-${i}`}
                value={p.value as string}
                label={p.label as string}
                startFrame={overlay.startFrame}
                endFrame={overlay.endFrame}
                x={p.x as number}
                y={p.y as number}
                color={p.color as string}
              />
            );
          case 'sketchArrow':
            return (
              <SketchArrow
                key={`sketch-${i}`}
                fromX={p.fromX as number}
                fromY={p.fromY as number}
                toX={p.toX as number}
                toY={p.toY as number}
                startFrame={overlay.startFrame}
                endFrame={overlay.endFrame}
                color={p.color as string}
                label={p.label as string}
              />
            );
          case 'sketchBox':
            return (
              <SketchBox
                key={`sketch-${i}`}
                text={p.text as string}
                startFrame={overlay.startFrame}
                endFrame={overlay.endFrame}
                x={p.x as number}
                y={p.y as number}
                color={p.color as string}
                bgColor={p.bgColor as string}
              />
            );
          default:
            return null;
        }
      })}
    </>
  );
};
