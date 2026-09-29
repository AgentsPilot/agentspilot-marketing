/**
 * The AgentsPilot logo, and which file to show where.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHY A MANIFEST RATHER THAN A PATH AT EACH CALL SITE
 *
 * The marketing layout wrote `src="/images/AgentPilot_Logo.png" width={150}
 * height={150}` in the header and `width={80} height={80}` in the footer. Two
 * things were wrong and neither announced itself:
 *
 *   1. The asset is 109x20 — a 5.45:1 wordmark. Declaring it square is what
 *      produces the "width or height modified, but not the other" console
 *      warning, and it distorts the box the image is laid out in.
 *   2. 109 source pixels drawn at 150 CSS px is an upscale before the display
 *      is considered; on a 2x screen it is 300 device pixels from 109. That is
 *      the blur.
 *
 * A path written at a call site cannot carry its own dimensions, so both call
 * sites guessed — and guessed different squares. Here the dimensions travel
 * with the file.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHY THE FILES ARE TRIMMED
 *
 * The brand exports sit on square art-boards: the 750x750 source holds a 330x60
 * wordmark and 96.5% transparent padding. Rendered into a box the glyphs shrink
 * to a fraction of it. `scripts/brand/trim-logo.js` removes the padding so the
 * file's box IS the logo's box, and a height means what it says.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * TONE IS THE BACKGROUND, NOT THE INK
 *
 * `light` is the logo FOR a light background (dark ink); `dark` is FOR a dark
 * background (light ink). Named after the background because "the dark logo" is
 * ambiguous every time it is read.
 *
 * This site needs both for a reason the app does not: its footer is
 * `bg-zinc-800/60` — permanently dark, whatever the theme. The charcoal
 * wordmark was nearly invisible there already.
 */

export interface LogoAsset {
  src: string;
  /** The file's REAL pixel dimensions. Never a guess, never a square. */
  width: number;
  height: number;
}

/**
 * The full horizontal lockup: symbol + "AGENTS PILOT".
 *
 * 330x60, trimmed from the 750x750 export — the highest-resolution source that
 * still has an alpha channel. The 1024x1024 export holds a larger 728x131
 * wordmark but is RGB with the white art-board baked in, so it would render a
 * white slab on any surface that is not pure white. This site has several.
 */
export const WORDMARK: { light: LogoAsset; dark: LogoAsset } = {
  light: { src: '/images/brand/wordmark.png', width: 330, height: 60 },
  /*
   * DERIVED, not designed. `scripts/brand/recolor-logo.js` swaps the charcoal
   * ink for #F1F5F9 and leaves the brand orange untouched — the two are eight
   * times apart in saturation, so the split is not a judgement call.
   *
   * Replace it when the brand specifies a real dark lockup; only these three
   * values change.
   */
  dark: { src: '/images/brand/wordmark-dark.png', width: 330, height: 60 },
};

/**
 * Height in CSS pixels per place the logo appears.
 *
 * Only the places it actually renders — a size for a surface nobody uses is a
 * claim the manifest cannot keep. Width is never given; it follows the ratio.
 */
export const LOGO_HEIGHT = {
  /** The marketing header. Taller than the app's: this is the first thing seen. */
  header: 34,
  /** The footer lockup, above the tagline. */
  footer: 26,
  /** Narrow viewports, where a 5.5:1 lockup competes with the nav toggle. */
  compact: 24,
} as const;

export type LogoPlacement = keyof typeof LOGO_HEIGHT;

/** Width that preserves the asset's own ratio at a given height. */
export function widthForHeight(asset: LogoAsset, height: number): number {
  return Math.round((asset.width / asset.height) * height);
}
