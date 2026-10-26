'use client';

import { section, cta } from '@/lib/marketing/content';
import { Shell, Tag, Heading, Lede, PrimaryCta, GhostCta } from './primitives';
import { HeroDayBoard } from './HeroDayBoard';

/**
 * The hero. One job: this could lighten my day.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * TWO COLUMNS ON DESKTOP, WHICH IS WHAT THE LAYOUT SPEC ASKED FOR
 *
 * The content's layout section says the desktop hero is "five columns of copy,
 * one spacer, six columns of visual". The mockup centred everything and put
 * the product window underneath instead, so this is the approved arrangement
 * rather than a departure from it.
 *
 * Copy is given SIX of the eleven columns rather than five. The headline's
 * second line is 23 characters, and a five-column measure is about 495px —
 * enough for a 43-46px headline before it re-wraps into three rows. Six
 * columns buys ~600px and a 50px headline, which keeps the two authored rows
 * intact with margin for font-metric variation.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE HEADLINE IS SMALLER HERE, AND ONLY HERE
 *
 * A one-column hero can carry 100px type; half the width cannot. The override
 * is local to this section — the shared `Heading` scale is untouched, because
 * changing it moved every heading on the page the last time.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * MOBILE PUTS THE COPY AND THE CTA FIRST
 *
 * Per the spec: copy and CTA before the visual, and full-width buttons. The
 * grid stacks in source order, so that happens without a reorder.
 */
export function Hero({ onOpenDemo }: { onOpenDemo: () => void }) {
  const s = section('hero');

  return (
    <section id="top" className="overflow-hidden bg-canvas py-14 text-ink lg:py-20">
      <Shell className="grid items-center gap-12 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-14">
        <div>
          <Tag>{s.eyebrow}</Tag>

          {/*
            * No `max-w-[Nch]`: the headline is two authored lines and a
            * character cap re-breaks the 23-character second one, which is
            * what rendered the hero across three rows.
            */}
          <Heading
            level={1}
            className="mt-7 !text-[clamp(34px,4.6vw,50px)] !leading-[1.02] !tracking-[-0.04em]"
          >
            {s.headline}
          </Heading>

          <Lede className="mt-6 text-ink-2">{s.body}</Lede>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <PrimaryCta section="hero" />
            <GhostCta onClick={onOpenDemo}>{cta.secondary.label}</GhostCta>
          </div>

          <p className="mt-5 text-[15px] font-medium text-ink-3">{s.supportLine}</p>
        </div>

        <HeroDayBoard />
      </Shell>
    </section>
  );
}
