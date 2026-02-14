/**
 * AssetMetadata — Positioning metadata voor SVG assets
 *
 * Probleem: Elementen zijn apart gegenereerd zonder gedeelde schaal.
 * Oplossing: Per asset metadata met:
 *   - Anchor point (waar het element "vastgemaakt" is aan de scene)
 *   - Natural size (hoe groot het hoort te zijn relatief aan canvas)
 *   - Ground line (waar het de grond raakt, voor verticale alignment)
 *
 * Workflow:
 * 1. Genereer eerst een complete scene-PNG in ChatGPT als referentie
 * 2. Genereer elk element apart op witte achtergrond
 * 3. Vectoriseer elk element via vectorizer.ai
 * 4. Definieer metadata voor elk element op basis van de referentie-PNG
 * 5. Scene composer gebruikt metadata om elementen correct te positioneren
 */

export type AnchorPoint =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type AssetCategory =
  | 'sky'
  | 'terrain'
  | 'structure'
  | 'prop'
  | 'character'
  | 'vegetation'
  | 'foreground'
  | 'atmosphere';

/**
 * Metadata voor één asset
 */
export interface AssetMetadata {
  /** Unieke asset ID (bijv. "struct-pub-exterior") */
  id: string;

  /** Categorie (sky, terrain, structure, prop, etc.) */
  category: AssetCategory;

  /** Anchor point — waar het element "vastgemaakt" is */
  anchor: AnchorPoint;

  /**
   * Natural width als fractie van canvas breedte (0-1)
   * Bijv. 0.7 = 70% van canvas breedte
   */
  naturalWidth: number;

  /**
   * Natural height als fractie van canvas hoogte (0-1)
   * Bijv. 0.85 = 85% van canvas hoogte
   */
  naturalHeight: number;

  /**
   * Ground line — y-positie waar het element de grond raakt (0-1)
   * 0 = bovenkant canvas, 1 = onderkant canvas
   * Bijv. 0.92 = raakt de grond op 92% van canvas hoogte
   *
   * Alleen relevant voor elementen die op de grond staan.
   * Voor sky/atmosphere: undefined
   */
  groundLine?: number;

  /**
   * Optioneel: originele viewBox uit SVG
   * Gebruikt om aspect ratio te behouden
   */
  viewBox?: {
    width: number;
    height: number;
  };

  /**
   * Optioneel: extra notities voor context
   */
  notes?: string;
}

/**
 * Asset metadata registry
 * Mapping van asset ID naar metadata
 */
export const ASSET_METADATA: Record<string, AssetMetadata> = {
  // ─── Pub Exterior Scene Assets ───────────────────────────

  'sky-evening-warm': {
    id: 'sky-evening-warm',
    category: 'sky',
    anchor: 'top-center',
    naturalWidth: 1.0,
    naturalHeight: 1.0,
    viewBox: { width: 1536, height: 1024 },
    notes: 'Warme avondlucht, vult hele achtergrond',
  },

  'terrain-cobblestone-street': {
    id: 'terrain-cobblestone-street',
    category: 'terrain',
    anchor: 'bottom-center',
    naturalWidth: 1.0,
    naturalHeight: 0.55,
    groundLine: 1.0,
    viewBox: { width: 1536, height: 1024 },
    notes: 'Keistraat, onderste 55% van canvas',
  },

  'struct-pub-exterior': {
    id: 'struct-pub-exterior',
    category: 'structure',
    anchor: 'bottom-center',
    naturalWidth: 0.7,
    naturalHeight: 0.85,
    groundLine: 0.92,
    viewBox: { width: 1536, height: 1024 },
    notes: 'Pub gebouw, centraal gepositioneerd',
  },

  'prop-street-lamp': {
    id: 'prop-street-lamp',
    category: 'prop',
    anchor: 'bottom-center',
    naturalWidth: 0.08,  // 8% canvas breedte
    naturalHeight: 0.78, // 78% canvas hoogte
    groundLine: 0.92,
    viewBox: { width: 1024, height: 1536 },
    notes: 'Victoriaanse lantaarnpaal, portret-orientatie',
  },

  'prop-moon-crescent': {
    id: 'prop-moon-crescent',
    category: 'prop',
    anchor: 'center',
    naturalWidth: 0.12,
    naturalHeight: 0.12,
    viewBox: { width: 1536, height: 1024 },
    notes: 'Wassende maan, rechtsboven in de lucht',
  },
};

/**
 * Haal metadata op voor een asset ID
 */
export function getAssetMetadata(assetId: string): AssetMetadata | undefined {
  return ASSET_METADATA[assetId];
}

/**
 * Bereken absolute positie op basis van metadata
 *
 * @param metadata - Asset metadata
 * @param canvasWidth - Canvas breedte (bijv. 1920)
 * @param canvasHeight - Canvas hoogte (bijv. 1080)
 * @param customPosition - Optionele override voor x/y positie (fractie 0-1)
 * @returns { x, y, width, height } in pixels
 */
export function calculateAssetPosition(
  metadata: AssetMetadata,
  canvasWidth: number,
  canvasHeight: number,
  customPosition?: { x?: number; y?: number },
): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  // Bereken natural size in pixels
  const width = metadata.naturalWidth * canvasWidth;
  const height = metadata.naturalHeight * canvasHeight;

  // Default positie op basis van anchor point
  let x = 0;
  let y = 0;

  // Gebruik custom positie als gegeven (fractie 0-1), anders anchor point
  const posX = customPosition?.x !== undefined
    ? customPosition.x * canvasWidth
    : canvasWidth * 0.5; // Default center

  const posY = customPosition?.y !== undefined
    ? customPosition.y * canvasHeight
    : (metadata.groundLine !== undefined
        ? metadata.groundLine * canvasHeight
        : canvasHeight * 0.5); // Default center

  // Adjust voor anchor point
  switch (metadata.anchor) {
    case 'top-left':
      x = posX;
      y = posY;
      break;
    case 'top-center':
      x = posX - width / 2;
      y = posY;
      break;
    case 'top-right':
      x = posX - width;
      y = posY;
      break;
    case 'center-left':
      x = posX;
      y = posY - height / 2;
      break;
    case 'center':
      x = posX - width / 2;
      y = posY - height / 2;
      break;
    case 'center-right':
      x = posX - width;
      y = posY - height / 2;
      break;
    case 'bottom-left':
      x = posX;
      y = posY - height;
      break;
    case 'bottom-center':
      x = posX - width / 2;
      y = posY - height;
      break;
    case 'bottom-right':
      x = posX - width;
      y = posY - height;
      break;
  }

  return { x, y, width, height };
}

/**
 * Convenience: positioneer een element op de grond
 * Gebruikt groundLine en anchor point om het correct te plaatsen
 */
export function positionOnGround(
  metadata: AssetMetadata,
  canvasWidth: number,
  canvasHeight: number,
  xPosition: number, // 0-1 fractie van canvas breedte
): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  if (metadata.groundLine === undefined) {
    throw new Error(`Asset ${metadata.id} has no groundLine defined`);
  }

  return calculateAssetPosition(
    metadata,
    canvasWidth,
    canvasHeight,
    { x: xPosition, y: metadata.groundLine },
  );
}
