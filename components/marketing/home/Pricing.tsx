import Link from 'next/link';
import { section, cta as ctaContent } from '@/lib/marketing/content';
import { gates, links } from '@/lib/marketing/config';
import { plans, trial, formatCredits } from '@/lib/marketing/plans';
import { Section, Shell, Tag, Heading, Lede, PrimaryCta, Check } from './primitives';

/**
 * The commercial offer, from the product's own configuration.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE PRICES ARE REAL, AND THAT TOOK CHECKING
 *
 * The approved copy proposed "$98 / month" for a single plan, and the mockup
 * then invented a three-tier comparison at $49 / $98 / $198. **None of those
 * numbers exist anywhere in the product.** The real configuration is two paid
 * tiers — Essentials $79 and Autopilot $129 — decided by the user on
 * 2026-09-23 and marked `shownToCustomers: true`. See `lib/marketing/plans.ts`
 * for the provenance of every figure.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * TWO TIERS, AND THE DIFFERENCE IS EXACTLY TWO THINGS
 *
 * The entitlements config is emphatic: the paid tiers differ in chat and the
 * credit allowance, and nothing else. So Autopilot's list has two entries. The
 * temptation is to pad it until it looks worth the extra £50, and padding it
 * would mean describing Essentials as missing something it has.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE CTA GOES TO ONBOARDING, NOT TO CHECKOUT
 *
 * Production sells nothing yet: the plan-price and checkout flags are off on
 * Vercel and Stripe is not the source of truth until a later slice. A "Buy"
 * button here would open a flow that does not exist, so both plans offer the
 * same thing the rest of the page offers — start, free, for fourteen days.
 */
export function Pricing() {
  const s = section('pricing');

  return (
    <Section id="pricing" tone="canvas">
      <Shell>
        <Tag>{s.eyebrow}</Tag>
        <Heading className="mt-[22px]">{s.headline}</Heading>
        <Lede className="mt-6 text-ink-2">{s.body}</Lede>

        {gates.pricing ? <Tiers /> : <Fallback />}
      </Shell>
    </Section>
  );
}

function Tiers() {
  const s = section('pricing');

  return (
    <>
      <div className="mt-11 grid items-stretch gap-4 lg:grid-cols-2">
        {plans.map(plan => {
          const main = Boolean(plan.recommended);

          return (
            <article
              key={plan.id}
              className={[
                'relative flex flex-col gap-3.5 rounded-[28px] border p-7 md:p-9',
                main
                  ? 'border-ink bg-ink text-canvas shadow-[0_40px_80px_-40px_rgba(15,34,43,0.55)]'
                  : 'border-line bg-surface',
              ].join(' ')}
            >
              {main ? (
                <span className="-mb-1 self-start rounded-full bg-brand px-3 py-1.5 text-[12.5px] font-bold text-night">
                  Recommended
                </span>
              ) : null}

              <h3 className="font-display text-xl font-semibold tracking-[-0.02em]">
                {plan.name}
              </h3>

              <p>
                <span className="font-display text-[clamp(44px,4.4vw,60px)] font-semibold leading-none tracking-[-0.05em]">
                  ${plan.priceUsd}
                </span>
                <small className={`text-lg font-medium ${main ? 'text-canvas/70' : 'text-ink-2'}`}>
                  {' '}/ {plan.per}
                </small>
              </p>

              <p className={`max-w-[44ch] ${main ? 'text-canvas/70' : 'text-ink-2'}`}>
                {plan.description}
              </p>

              <PrimaryCta
                section={`pricing-${plan.id}`}
                onNight={main}
                className="my-1.5 !flex w-full"
              />

              {plan.inheritsLabel ? (
                <p className={`text-sm font-semibold ${main ? 'text-canvas/70' : 'text-ink-2'}`}>
                  {plan.inheritsLabel}
                </p>
              ) : null}

              <ul className="grid content-start gap-3">
                {plan.includes.map(item => (
                  <li key={item} className="flex items-start gap-3 font-medium">
                    <span
                      aria-hidden="true"
                      className={[
                        'mt-0.5 grid h-[22px] w-[22px] flex-none place-items-center rounded-full',
                        main ? 'bg-canvas/15' : 'bg-pos-soft',
                      ].join(' ')}
                    >
                      <Check className={`w-3 ${main ? 'stroke-brand' : 'stroke-pos'}`} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              {/* The allowance sits at the bottom of every card, so the two are
                  comparable at a glance — it is half the difference between them. */}
              <p
                className={[
                  'mt-auto flex items-baseline justify-between gap-3 border-t pt-4 text-[14.5px]',
                  main ? 'border-canvas/20' : 'border-line',
                ].join(' ')}
              >
                <span className={main ? 'text-canvas/70' : 'text-ink-2'}>AI allowance</span>
                <b>{formatCredits(plan.creditsPerMonth)} credits / month</b>
              </p>
            </article>
          );
        })}
      </div>

      {/* Free for 14 days. Not a third column: `trial` is a cohort pointing at
          Essentials, and showing it as a plan would invite a comparison that
          does not exist. */}
      <p className="mt-4 text-center text-[15px] font-semibold text-ink-2">
        {trial.note} {trial.name} includes {formatCredits(trial.creditsTotal)} credits to try it with.
      </p>

      <div className="mt-4 grid gap-3.5 rounded-[22px] border border-line bg-sunk px-7 py-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-center">
        <div>
          <h3 className="font-display text-lg font-semibold tracking-[-0.02em]">
            {s.usageHeading}
          </h3>
          <p className="mt-1 text-[15px] text-ink-2">{s.usageIntroduction}</p>
        </div>
        <p className="text-sm text-ink-3">
          Credits cover the AI work you ask for. Both plans include a monthly allowance;
          what you do not use does not roll over.
        </p>
      </div>
    </>
  );
}

/**
 * The gated alternative.
 *
 * Shown when pricing is not cleared to publish. It names no figure, and the
 * CTA is the approved fallback — a demo, pointed at a real destination, or at
 * contact if scheduling is not configured.
 */
function Fallback() {
  const s = section('pricing');
  const href = links.scheduling || links.contact;

  return (
    <div className="mt-11 grid items-center gap-7 rounded-[28px] border border-line bg-surface p-7 md:grid-cols-[1fr_auto] md:p-12">
      <h3 className="font-display text-[clamp(24px,3vw,40px)] font-semibold tracking-[-0.04em]">
        {s.fallbackIfNotReady.headline}
      </h3>
      <Link
        href={href}
        data-cta="pricing-fallback"
        className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-line-2 bg-surface px-6 text-base font-semibold transition-colors hover:border-ink"
      >
        {s.fallbackIfNotReady.cta || ctaContent.primaryFallback.label}
      </Link>
    </div>
  );
}
