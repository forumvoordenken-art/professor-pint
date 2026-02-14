export { Subtitles } from './Subtitles';
export { Camera } from './Camera';
export { Transition, getTransitionProgress } from './Transitions';
export type { TransitionType } from './Transitions';
export { SceneRenderer } from './SceneRenderer';
export type { SceneData, SceneCamera, SceneCharacter, SceneTransition } from './SceneRenderer';
export { SceneComposer, registerAsset, getAsset } from './SceneComposer';
export type { ComposedScene, AssetProps } from './SceneComposer';

// ── Visual Quality Post-Processing ──────────────────────
export { OilPaintFilter, SvgPaintFilterDefs, EdgeRoughenFilterDefs, Vignette, ColorGrade } from './OilPaintFilter';
export type { PaintStrength } from './OilPaintFilter';
export { CanvasTexture, SvgCanvasTexture, KuwaharaFilter, SvgKuwaharaDefs, FilmGrain, PigmentVariation } from './TextureOverlay';
export type { CanvasPreset, KuwaharaStrength } from './TextureOverlay';
export { PaintEffect } from './PaintEffect';
export type { PaintPreset } from './PaintEffect';
export { withAssetPaint, skyPaintCategory, terrainPaintCategory } from './withAssetPaint';
export type { AssetPaintCategory } from './withAssetPaint';

// ── Rive Character Integration ──────────────────────────
export { RiveCharacter, shouldBlink, breathCycle, DEFAULT_EMOTION_MAP } from './RiveIntegration';
export type { RiveCharacterProps, RiveCharacterInputs } from './RiveIntegration';

// ── Asset Metadata System ───────────────────────────────
export { getAssetMetadata, calculateAssetPosition, positionOnGround, ASSET_METADATA } from './AssetMetadata';
export type { AssetMetadata, AnchorPoint, AssetCategory } from './AssetMetadata';
