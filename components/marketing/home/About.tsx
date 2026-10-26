import { Section, Shell, Tag, Heading } from './primitives';

/**
 * About us — the About page, folded into the homepage.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHY THIS IS A SPREAD AND NOT A STACK
 *
 * The first attempt stacked five blocks down the page: a hook, two cards, an
 * origin passage, four more cards, a closing line. Every block was a rounded
 * box of the same weight, so the longest section on the page was also the
 * flattest, and nothing told the reader which part mattered.
 *
 * This is laid out as a magazine spread instead:
 *
 *   LEFT, AND IT STAYS PUT   The thesis: the headline, and the mission. On a
 *                            wide screen it sticks while the argument scrolls
 *                            past it, so the reason for the company is in
 *                            view the whole time somebody reads about it.
 *   RIGHT, AND IT MOVES      The argument, as four numbered beats with
 *                            hairlines between them. Labels in the left
 *                            gutter, text in a readable measure.
 *
 * The section also has exactly ONE filled container now, the solution, which
 * is the one beat that is an answer rather than a statement. When everything
 * is a card, nothing is emphasised.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * IT STAYS LIGHT
 *
 * A dark treatment would suit "why we exist", but `Delegation` immediately
 * above is `tone="night"` and two dark sections back to back read as one very
 * long one.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * VOICE
 *
 * Sentence case, and "by hand" rather than "manually": our owners are
 * trainers, tutors and trades, and "manually" is a word people write but do
 * not say. No em dashes in the copy, per the house rule.
 */

/** The four philosophy items, the page's own words but for sentence case. */
const BELIEFS = [
  {
    title: 'Things should not slip through',
    body: 'Important work should not depend on your memory. It should just get handled.',
  },
  {
    title: 'Describe the problem, not the solution',
    body:
      'Getting things handled starts with describing what keeps slipping, not building technical workflows.',
  },
  {
    title: 'Everyone deserves this',
    body:
      'Getting work handled should not need technical skill. It should be as natural as asking for help.',
  },
  {
    title: 'Trust through control',
    body:
      'You should always see what is happening, change it when you want, and keep full control.',
  },
];

/**
 * One beat of the argument.
 *
 * The number and label sit in a narrow gutter on a wide screen and above the
 * text on a phone, which is the one layout change the whole section makes
 * between breakpoints.
 */
function Beat({
  n,
  label,
  children,
  last = false,
}: {
  n: string;
  label: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`grid gap-x-8 gap-y-3 py-8 first:pt-0 sm:grid-cols-[140px_minmax(0,1fr)] ${
        last ? '' : 'border-b border-line'
      }`}
    >
      <div className="flex items-baseline gap-2.5 sm:flex-col sm:gap-1">
        <span
          aria-hidden="true"
          className="font-display text-[13px] font-bold tabular-nums text-brand"
        >
          {n}
        </span>
        <h3 className="text-[12.5px] font-semibold uppercase tracking-[0.09em] text-ink-3">
          {label}
        </h3>
      </div>

      <div className="max-w-[58ch]">{children}</div>
    </div>
  );
}

export function About() {
  return (
    <Section id="why-we-built-it" tone="surface">
      <Shell>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] lg:gap-20">
          {/* ── The thesis. Pinned on a wide screen. ─────────────────── */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Tag>About us</Tag>

            <Heading className="mt-[22px] !text-[clamp(32px,3.9vw,52px)] !leading-[1.03]">
              {'You are not falling behind.\nYou are doing too much by hand.'}
            </Heading>

            <p className="mt-6 max-w-[46ch] text-[17px] leading-[1.6] text-ink-2">
              Things slip through. It is exhausting keeping track. AgentsPilot came out of
              watching capable people lose hours to work that should take minutes.
            </p>

            {/*
              * The mission, under a rule, in the thesis column.
              *
              * It is the one sentence that says what the company is FOR, so it
              * belongs beside the argument rather than after it. On a wide
              * screen it is still on screen when the reader finishes reading.
              */}
            <p className="mt-8 border-t border-line pt-6 font-display text-[19px] font-semibold leading-[1.4] tracking-[-0.02em] text-ink">
              Our mission: to make sure nothing important slips through the cracks, for anyone,
              ever again.
            </p>
          </div>

          {/* ── The argument. ────────────────────────────────────────── */}
          <div>
            <Beat n="01" label="The problem">
              <p className="text-[16.5px] leading-[1.65] text-ink-2">
                People spend hours on work that should take minutes. Important emails do not get
                answered. Follow-ups get forgotten. Deadlines slip by.
              </p>
              <p className="mt-3.5 text-[16.5px] leading-[1.65] text-ink-2">
                And the tools meant to fix it want technical setup, complex workflows and constant
                upkeep. Most people do not want another tool to learn. They want to say what keeps
                slipping and see it handled.
              </p>
            </Beat>

            <Beat n="02" label="Our solution">
              {/*
                * The only filled box in the section, because this is the only
                * beat that answers another one. The brand rule on its left
                * edge marks the turn without a second colour.
                */}
              <div className="rounded-r-xl border-l-[3px] border-brand bg-accent-soft py-5 pl-5 pr-5 sm:pr-6">
                <p className="text-[16.5px] leading-[1.65] text-ink">
                  AgentsPilot understands what you need from how you describe it. Tell us what
                  keeps slipping, and we work out how to handle it.
                </p>
                <p className="mt-3.5 text-[16.5px] leading-[1.65] text-ink-2">
                  No technical setup. No complex configuration. No learning curve. Just describe
                  the problem, and it gets handled from then on.
                </p>
              </div>
            </Beat>

            <Beat n="03" label="The origin">
              <p className="text-[16.5px] leading-[1.65] text-ink-2">
                AgentsPilot was born from a simple frustration: watching talented people waste
                hours on work that should take minutes, because things kept slipping through.
              </p>
              <p className="mt-3.5 text-[16.5px] leading-[1.65] text-ink-2">
                We felt it ourselves, and the tools that were supposed to help did not. So
                AgentsPilot works the other way round. Instead of building workflows, you describe
                what keeps slipping.
              </p>
              <p className="mt-3.5 text-[16.5px] leading-[1.65] text-ink">
                Work should not depend on perfect memory or constant vigilance. Every decision we
                make comes back to the same three things: keep it simple, keep you in control, get
                it handled. Work should feel lighter, not heavier.
              </p>
            </Beat>

            <Beat n="04" label="What we believe" last>
              <ul className="grid items-start gap-x-8 gap-y-7 sm:grid-cols-2">
                {BELIEFS.map(belief => (
                  <li key={belief.title}>
                    <h4 className="font-display text-[16px] font-semibold leading-snug tracking-[-0.02em] text-ink">
                      {belief.title}
                    </h4>
                    <p className="mt-1.5 text-[15px] leading-[1.55] text-ink-2">{belief.body}</p>
                  </li>
                ))}
              </ul>
            </Beat>
          </div>
        </div>
      </Shell>
    </Section>
  );
}
