import Image from 'next/image';
import { WORDMARK, LOGO_HEIGHT, widthForHeight, type LogoPlacement } from '@/lib/brand/logo';

/**
 * The AgentsPilot logo.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THIS SITE IS DARK. THERE IS NO THEME TO FOLLOW.
 *
 * The page is `bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900`, the
 * nav is `bg-zinc-900/95`, the footer is `bg-zinc-800/60`. All of it is dark by
 * explicit colour, and `<html>` never receives a `dark` class — the only
 * `dark:` variants anywhere in this repo were the two this file used to emit.
 *
 * So `tone` defaults to `dark`, and there is no `auto`.
 *
 * An earlier version of this component was ported from the app, where dark mode
 * IS a class on `<html>`, and defaulted to following it. On this site that
 * resolved to "no dark class, therefore light", so the charcoal wordmark
 * rendered on a near-black nav — the exact problem the dark variant exists to
 * fix, reintroduced by assuming a mechanism this site does not have.
 *
 * If a light section is ever added, pass `tone="light"` there. Do not
 * reintroduce a theme-following mode unless something starts setting the class.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHY THE SIZES ARE LITERAL CLASS STRINGS
 *
 * `h-[${height}px]` fails in a way that compiles, renders, and produces an
 * element with no height: Tailwind's JIT scans source text for whole class
 * names, so a class assembled at runtime is never generated. Hence `SIZING`,
 * with every class written out.
 *
 * Not a client component: no state, no effects, no JavaScript shipped.
 */

/** Literal Tailwind classes per placement. Must match `LOGO_HEIGHT`. */
const SIZING: Record<LogoPlacement, { responsive: string; fixed: string }> = {
  header: { responsive: 'h-[24px] sm:h-[34px] w-auto', fixed: 'h-[34px] w-auto' },
  footer: { responsive: 'h-[24px] sm:h-[26px] w-auto', fixed: 'h-[26px] w-auto' },
  compact: { responsive: 'h-[24px] w-auto', fixed: 'h-[24px] w-auto' },
};

interface LogoProps {
  /** Where this is shown — which decides the height. A place, not a number. */
  placement?: LogoPlacement;
  /**
   * Which background this sits on. Defaults to `dark` — see the note above.
   * `light` is here for a light section that does not yet exist.
   */
  tone?: 'light' | 'dark';
  /** Shrink on narrow viewports, where the lockup competes with the nav. */
  responsive?: boolean;
  /** Above the fold — the header is. */
  priority?: boolean;
  className?: string;
}

export function Logo({
  placement = 'header',
  tone = 'dark',
  responsive = true,
  priority = false,
  className = '',
}: LogoProps) {
  const height = LOGO_HEIGHT[placement];
  const sizing = responsive ? SIZING[placement].responsive : SIZING[placement].fixed;

  /*
   * `width`/`height` describe the IMAGE's own ratio — the contract Next.js
   * wants. They are not the box; the CSS class does the sizing and `w-auto`
   * holds the ratio. Passing a square for a 5.5:1 asset is what produced the
   * aspect-ratio warning this replaces.
   */
  const render = (asset: typeof WORDMARK.light, cls: string) => (
    <Image
      src={asset.src}
      alt="AgentsPilot"
      width={widthForHeight(asset, height)}
      height={height}
      priority={priority}
      className={`${sizing} ${cls} ${className}`.replace(/\s+/g, ' ').trim()}
    />
  );

  // One surface, one background, one file — and no second request for a
  // variant that a `dark:` class would never have revealed anyway.
  return render(tone === 'light' ? WORDMARK.light : WORDMARK.dark, '');
}
