/**
 * The plans, as the product actually configures them.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PROVENANCE, BECAUSE A PRICE ON A WEBSITE IS A PROMISE
 *
 * Every figure here is copied from the app's own entitlements config —
 * `lib/business-os/entitlements/config/tierMatrix.ts` in the main repo — and
 * verified against the values, not the comments:
 *
 *   Essentials   $79   `presentation.basic.monthlyPriceUsd`
 *                      19,750/mo  `BASIC['credits.allowance'].perMonth`
 *   Autopilot    $129  `presentation.pro.monthlyPriceUsd`
 *                      32,250/mo  `PRO['credits.allowance'].perMonth`
 *
 * Both carry `shownToCustomers: true`. The tiers are a user decision of
 * 2026-09-23; the names come from `presentation.labels.en`.
 *
 * ⚠️ THE APPROVED WEBSITE COPY SAYS "$98 / month". That number exists nowhere
 * in the product, and the mockup's three draft tiers ($49 / $98 / $198) were
 * invented. Neither is used here. If pricing changes, it changes in the tier
 * matrix first and this file follows — never the other way round.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE DIFFERENTIATOR IS TWO THINGS, AND SAYING MORE WOULD BE WRONG
 *
 * The tier matrix is explicit: "the paid tiers differ in exactly TWO ways:
 * chat and the credit allowance. Everything else that exists is in every
 * tier." So Essentials must not be described as missing features it has, and
 * Autopilot must not be padded with inclusions that are not real. That is why
 * Autopilot's list is short: it is Essentials plus chat plus credits, and
 * that is the whole truth of it.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHY THE CTA GOES TO ONBOARDING AND NOT TO CHECKOUT
 *
 * `availableToBuy` is on for internal testing, but production sells nothing:
 * `BUSINESS_OS_PLAN_PRICES_ENABLED` and `BUSINESS_OS_PLAN_CHECKOUT_ENABLED`
 * are off on Vercel, and Stripe only becomes the source of truth in a later
 * slice. A "Buy now" here would open a flow that does not exist.
 *
 * @module lib/marketing/plans
 */

export interface Plan {
  id: string;
  /** `presentation.labels.en` in the tier matrix. */
  name: string;
  priceUsd: number;
  per: string;
  /** What this plan is for, in the owner's terms. */
  description: string;
  /** Named when a plan builds on the one before it, so nothing is repeated. */
  inheritsLabel?: string;
  includes: string[];
  /** Monthly credit allowance, from `credits.allowance.perMonth`. */
  creditsPerMonth: number;
  recommended?: boolean;
}

export const plans: Plan[] = [
  {
    id: 'plan.essentials',
    name: 'Essentials',
    priceUsd: 79,
    per: 'month',
    description:
      'Everything you need to run the business day to day, with AI to help you set it up and keep things moving.',
    // The five inclusions from the approved content's `included` list. They are
    // true of BOTH tiers, which is the point: Essentials is not a cut-down
    // product, it is the product without chat.
    includes: [
      'Help people discover what you offer',
      'Keep inquiries and client details together',
      'Organize your time and next steps',
      'See what is still owed',
      'Review useful insights and proposed actions',
    ],
    creditsPerMonth: 19750,
  },
  {
    id: 'plan.autopilot',
    name: 'Autopilot',
    priceUsd: 129,
    per: 'month',
    description:
      'For when you would rather ask than look, and you want more room to let AgentsPilot work.',
    inheritsLabel: 'Everything in Essentials, plus',
    /*
     * Exactly two additions, because exactly two things differ. Padding this
     * list is how a pricing page starts lying.
     */
    includes: [
      'Ask about your business in your own words, and get an answer',
      'Close to twice the monthly AI allowance',
    ],
    creditsPerMonth: 32250,
    recommended: true,
  },
];

/**
 * The free way in.
 *
 * `trial` is a cohort rather than a tier — it points at `basic` — so it is not
 * a third column. It is the line under the plans, which is also how it reads
 * to somebody deciding: not a plan to compare, a reason to start.
 */
export const trial = {
  name: 'Test Flight',
  days: 14,
  creditsTotal: 2000,
  note: 'Free for 14 days. No card needed.',
} as const;

/** Formats an allowance without implying a precision it does not have. */
export function formatCredits(n: number): string {
  return n.toLocaleString('en-US');
}
