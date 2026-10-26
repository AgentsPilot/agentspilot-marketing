/**
 * Release configuration for the homepage.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHY A GATE RATHER THAN JUST WRITING THE SECTION
 *
 * Three of the page's claims depend on product behaviour that may not be
 * shipped: a price somebody can actually pay, follow-ups that genuinely run on
 * approved rules, and legal destinations that exist. The approved content
 * carries a fallback for each, and the rule is the same every time: a
 * marketing page must never imply that a demonstration proves an unreleased
 * capability.
 *
 * So each gate is a boolean here, every gated section has a written fallback,
 * and the fallback is the DEFAULT. Shipping a claim is a deliberate act.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * A LINK WITH NO DESTINATION IS NOT RENDERED AS A LINK
 *
 * Every URL comes from the environment and defaults to empty. An unset one
 * renders as plain text, never as an `href="#"` that looks clickable and does
 * nothing. Contact, Privacy and Terms are the ones this matters for most: a
 * dead Privacy link is worse than a visibly pending one.
 *
 * @module lib/marketing/config
 */

/** An env var that is present but empty counts as unset. */
function url(value: string | undefined): string {
  const v = (value ?? '').trim();
  return v.length > 0 ? v : '';
}

export const links = {
  onboarding: url(process.env.NEXT_PUBLIC_ONBOARDING_URL) || '/signup',
  scheduling: url(process.env.NEXT_PUBLIC_SCHEDULING_URL),
  signin: url(process.env.NEXT_PUBLIC_SIGNIN_URL) || '/login',
  // The contact form is a section on the homepage now, not a route.
  contact: url(process.env.NEXT_PUBLIC_CONTACT_URL) || '/#talk-to-us',
  privacy: url(process.env.NEXT_PUBLIC_PRIVACY_URL),
  terms: url(process.env.NEXT_PUBLIC_TERMS_URL),
} as const;

/**
 * Is self-service onboarding real?
 *
 * When false every primary CTA becomes "Book a demo" and points at the
 * scheduling URL — globally, never mixed. A page showing "Build my workspace"
 * in the hero and "Book a demo" in the footer tells the visitor the team does
 * not know which it is.
 */
export const selfServiceOnboarding =
  process.env.NEXT_PUBLIC_SELF_SERVICE_ONBOARDING !== 'false';

export const gates = {
  /**
   * The commercial offer.
   *
   * ⚠️ DEFAULTS TO OFF, and the reason has changed since the content was
   * written. The release gate recorded "no commercial tier is configured",
   * citing the app's `tierMatrix.ts`. That is now stale: two paid tiers are
   * configured and approved (a user decision of 2026-09-23) —
   * **Essentials $79** and **Autopilot $129** — with `shownToCustomers: true`.
   *
   * What has NOT changed is that production sells nothing:
   * `BUSINESS_OS_PLAN_PRICES_ENABLED` and `BUSINESS_OS_PLAN_CHECKOUT_ENABLED`
   * are off on Vercel, and the tier file says Stripe only becomes the source
   * of truth in a later slice. So a published price would be a number the
   * visitor cannot act on.
   *
   * Note the approved copy's own `$98 / month` single plan matches **nothing**
   * in the product. Whatever is published, it should be $79 / $129 or the
   * fallback — never $98, and never the mockup's invented $49 / $198 tiers.
   */
  pricing: process.env.NEXT_PUBLIC_SHOW_PRICING === 'true',

  /**
   * Follow-ups that run on approved rules without a person in the loop.
   *
   * Off means the delegation section drops the "let approved rules handle
   * future follow-ups" option and describes draft-and-review only, which is
   * the behaviour that exists.
   */
  autonomy: process.env.NEXT_PUBLIC_SHOW_AUTONOMY === 'true',
} as const;

/**
 * The insight-growth panel: which areas the advisor can speak about, by day.
 *
 * Draft copy, off by default — it was never in the approved content file. It
 * is also the one block on the page that describes a mechanism the product
 * genuinely has (vector maturity: an area stays quiet until it has evidence),
 * so it is worth finishing rather than deleting.
 */
export const showInsightGrowth =
  process.env.NEXT_PUBLIC_SHOW_INSIGHT_GROWTH === 'true';
