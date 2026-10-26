/**
 * "It gets sharper as your business runs." — DRAFT COPY.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ⚠️ NOT IN THE APPROVED CONTENT FILE.
 *
 * This block was drafted after the docx was signed off, which is why it lives
 * here rather than in `content.json`: that file is the approved copy and a
 * diff on it should mean a copy decision, not an experiment. Gated behind
 * `NEXT_PUBLIC_SHOW_INSIGHT_GROWTH`.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * IT DESCRIBES SOMETHING THE PRODUCT GENUINELY DOES
 *
 * The seven areas are the real vector maturity model: each one is `dark`,
 * `learn` or `lit`, and a detector that infers anything is held until its
 * vector is lit. So "AgentsPilot only speaks up about an area once there is
 * enough real activity behind it" is a description, not a promise — which is
 * unusual for a marketing claim and worth keeping honest.
 *
 * ⚠️ THE DAYS ARE ILLUSTRATIVE AND THE NOTE MUST SAY SO. Each area lights on
 * its own EVIDENCE — a first booking, a first client, a volume threshold — not
 * on a calendar. One real account crossed pricing at day 52 and another will
 * never cross it. Presenting day 90 as a schedule would be the one false note
 * in a section about not guessing.
 *
 * @module lib/marketing/insightGrowth
 */

export interface GrowthDay {
  label: string;
  /** Which areas begin advising at this point. */
  starts: string[];
  caption: string;
}

export const insightGrowth = {
  headline: 'It gets sharper as your business runs.',
  body:
    'AgentsPilot only speaks up about an area once there is enough real activity behind it. Nothing is guessed, and nothing is rushed.',

  /** In dashboard order, matching the product's own vector strip. */
  vectors: ['Wins', 'Conversion', 'Booking', 'Cash flow', 'Leads', 'Retention', 'Pricing'],

  days: [
    { label: 'Day 1', starts: ['Wins'], caption: 'Shows what got done' },
    { label: 'Day 4', starts: ['Conversion', 'Booking'], caption: 'Notices replies and bookings' },
    { label: 'Day 18', starts: ['Cash flow', 'Leads'], caption: 'Sees payments and where people come from' },
    { label: 'Day 60', starts: ['Retention'], caption: 'Spots who has not come back' },
    { label: 'Day 90', starts: ['Pricing'], caption: 'Has enough history to talk about pricing' },
  ] as GrowthDay[],

  /**
   * The rule-of-three.
   *
   * ⚠️ This is the sentence to check hardest before publishing: it promises an
   * OFFER after three repeats, inside the owner's approval settings. If the
   * product does not yet count repeats and offer, this line goes.
   */
  automateRule:
    'When the same fix comes up three times, AgentsPilot offers to handle it for you, within the approval settings you choose.',

  note:
    'Illustrative timeline. Each area activates on its own evidence, not on a set date.',
} as const;
