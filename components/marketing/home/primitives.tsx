/**
 * The handful of shapes every section on the homepage reuses.
 *
 * These exist so a section file is about its content, not about remembering
 * that the page measure is 1240px and the gutter is 40px at desktop. The live
 * homepage repeated those numbers inline and drifted: four oranges,
 * `text-slate-300` beside `text-zinc-400`, and three different max-widths.
 *
 * @module components/marketing/home/primitives
 */

import Link from 'next/link';
import type { ReactNode } from 'react';
import { cta as ctaContent, type Cta } from '@/lib/marketing/content';
import { links, selfServiceOnboarding } from '@/lib/marketing/config';

/** The page measure. Every section's content sits inside one of these. */
export function Shell({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-shell px-5 md:px-8 lg:px-10 ${className}`}>
      {children}
    </div>
  );
}

/**
 * A page section, with the vertical rhythm the layout spec sets:
 * 56px mobile, 72px tablet, 104-120px desktop.
 */
export function Section({
  id,
  children,
  className = '',
  tone = 'canvas',
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  /** `night` is the two deliberately dark sections, not a theme. */
  tone?: 'canvas' | 'surface' | 'night';
}) {
  const tones = {
    canvas: 'bg-canvas text-ink',
    surface: 'bg-surface text-ink',
    night: 'bg-night text-night-ink',
  } as const;

  return (
    <section id={id} className={`${tones[tone]} py-14 md:py-[72px] lg:py-28 ${className}`}>
      {children}
    </section>
  );
}

/**
 * The eyebrow label above a heading.
 *
 * The dot uses `--brand` — the logo's own orange — because it is a 8px shape
 * and not text, so the contrast floor that keeps `--brand` away from copy does
 * not apply to it.
 */
export function Tag({ children, tone = 'light' }: { children: ReactNode; tone?: 'light' | 'night' }) {
  const shell =
    tone === 'night'
      ? 'bg-night-2 border-night-line text-night-ink-2'
      : 'bg-surface border-line text-ink-2';

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border py-1.5 pl-2 pr-3.5 text-[12.5px] font-semibold uppercase tracking-[0.08em] ${shell}`}
    >
      <span
        aria-hidden="true"
        className="h-2 w-2 rounded-full bg-brand ring-4 ring-brand/15"
      />
      {children}
    </span>
  );
}

/**
 * Headings, on the display face, with the tight tracking the design uses.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE LINE BREAKS ARE AUTHORED, SO THEY ARE STRUCTURAL
 *
 * Every headline in the content carries a `\n`, and all seven are two lines by
 * design — "Your business." / "Less on your shoulders." is two beats, and the
 * pause between them is the copy doing its job.
 *
 * This used to render them with `whitespace-pre-line` plus `text-balance`,
 * which fought the author twice over:
 *
 *   - `text-balance` re-wraps a heading to even out its lines. That is right
 *     for prose that happens to wrap and wrong for breaks somebody chose;
 *   - a `max-w-[12ch]` cap at the call site then forced a SECOND break inside
 *     a 23-character line, so the hero's two rows rendered as three.
 *
 * Splitting on the newline and giving each line its own block makes the break
 * a fact of the markup. A line still wraps if it genuinely cannot fit — which
 * is what should happen on a narrow phone — but nothing re-flows a heading
 * that already fits.
 */
export function Heading({
  level = 2,
  children,
  className = '',
}: {
  level?: 1 | 2 | 3;
  children: ReactNode;
  className?: string;
}) {
  const sizes = {
    1: 'text-[clamp(40px,8vw,100px)] leading-[0.95] tracking-[-0.055em]',
    2: 'text-[clamp(32px,5.2vw,64px)] leading-[1.02] tracking-[-0.045em]',
    3: 'text-xl leading-tight tracking-[-0.02em]',
  } as const;

  const Tag_ = (`h${level}`) as 'h1' | 'h2' | 'h3';

  /* Only a plain string can carry authored breaks; anything else passes through. */
  const lines = typeof children === 'string' ? children.split('\n') : null;

  return (
    <Tag_ className={`font-display font-semibold ${sizes[level]} ${className}`}>
      {lines
        ? lines.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))
        : children}
    </Tag_>
  );
}

/** Body copy at the measure the layout spec sets: 55-65 characters. */
export function Lede({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`max-w-[56ch] text-[clamp(17px,1.4vw,20px)] leading-[1.55] ${className}`}>
      {children}
    </p>
  );
}

/**
 * The primary call to action, resolved once.
 *
 * ONE LABEL EVERYWHERE. When self-service onboarding is unavailable every
 * primary CTA becomes "Book a demo" and points at scheduling — globally, never
 * per-section. A page offering "Build my workspace" in the hero and "Book a
 * demo" in the footer tells the visitor nobody knows which it is.
 */
export function resolvePrimaryCta(): { label: string; href: string; mode: string } {
  const chosen: Cta = selfServiceOnboarding
    ? ctaContent.primary
    : ctaContent.primaryFallback;

  const href = selfServiceOnboarding
    ? links.onboarding
    : links.scheduling || links.contact;

  return {
    label: chosen.label,
    href,
    mode: chosen.destinationMode ?? 'onboarding',
  };
}

function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="-mr-2.5 grid h-[22px] w-[22px] place-items-center rounded-full bg-brand transition-colors group-hover:bg-white/25"
    >
      <svg viewBox="0 0 24 24" className="w-3 fill-none stroke-white stroke-[2.4]" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </span>
  );
}

export function PrimaryCta({
  section,
  arrow = true,
  className = '',
  onNight = false,
}: {
  /** Which section the click came from, for analytics. */
  section: string;
  arrow?: boolean;
  className?: string;
  onNight?: boolean;
}) {
  const { label, href, mode } = resolvePrimaryCta();

  const skin = onNight
    ? 'bg-brand text-night hover:bg-white'
    : 'bg-ink text-canvas hover:bg-accent hover:text-white';

  return (
    <Link
      href={href}
      data-cta={section}
      data-cta-mode={mode}
      className={`group inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full px-6 text-base font-semibold transition-colors ${skin} ${className}`}
    >
      {label}
      {arrow ? <Arrow /> : null}
    </Link>
  );
}

export function GhostCta({
  children,
  href,
  onClick,
  className = '',
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}) {
  const shell =
    'inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full border border-line-2 bg-surface px-6 text-base font-semibold text-ink transition-colors hover:border-ink';

  if (href) {
    return (
      <Link href={href} className={`${shell} ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={`${shell} ${className}`}>
      {children}
    </button>
  );
}

/** A tick, used wherever something is done or included. */
export function Check({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`fill-none stroke-[3] ${className}`}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 12.5l4 4 8-9" />
    </svg>
  );
}
