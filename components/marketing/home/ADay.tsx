'use client';

import { dialog } from '@/lib/marketing/content';
import { Section, Shell, Heading, Lede, GhostCta, Check } from './primitives';

/**
 * A day with AgentsPilot, as three numbered beats.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THIS SECTION AND THE DIALOG SHARE ONE SET OF STEPS, DELIBERATELY.
 *
 * `CONTENT.dialog` was written for the modal walkthrough. The mockup rendered
 * it as a static timeline INSTEAD of building the modal, which left the
 * approved secondary CTA ("See a day with AgentsPilot") pointing at an anchor
 * rather than opening anything.
 *
 * Both now exist and read from the same three steps: the timeline is the
 * version that survives as a static screenshot and gets indexed, and the
 * dialog is the walkthrough with the approval beat you can actually click.
 * One source, so they cannot describe different days.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE NUMBERS ARE INFORMATION, NOT DECORATION
 *
 * 1-2-3 is used because this genuinely is a sequence: the work is gathered,
 * then the next move is found, then it goes out with a say. The connector line
 * between them says the same thing again, which is why it runs horizontally on
 * a wide screen and vertically on a narrow one rather than disappearing.
 */
export function ADay({ onOpenDemo }: { onOpenDemo: () => void }) {
  return (
    <Section id="a-day" tone="canvas">
      <Shell>
        <Heading className="max-w-[14ch]">{dialog.header}</Heading>
        <Lede className="mt-[18px] text-ink-2">{dialog.subtitle}</Lede>

        <ol className="relative mt-14 grid gap-7 md:grid-cols-3 md:gap-6">
          {dialog.steps.map((step, i) => (
            <li
              key={step.id}
              className="relative pl-14 md:pl-0 md:pt-14"
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 grid h-[38px] w-[38px] place-items-center rounded-full bg-ink text-[15px] font-semibold text-canvas"
              >
                {i + 1}
              </span>

              {/* The connector. Vertical on mobile, horizontal on desktop, and
                  absent after the last step. */}
              {i < dialog.steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute left-[18px] top-11 -bottom-6 w-0.5 bg-line-2 md:bottom-auto md:left-12 md:right-[-12px] md:top-[18px] md:h-0.5 md:w-auto"
                />
              ) : null}

              <h3 className="font-display text-[clamp(20px,2.2vw,26px)] font-semibold tracking-[-0.03em]">
                {step.title}
              </h3>
              <p className="mt-2 max-w-[40ch] text-ink-2">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-11 flex flex-wrap items-center gap-4">
          <p className="inline-flex items-center gap-2.5 rounded-full bg-pos-soft py-2.5 pl-3 pr-[18px] text-[15.5px] font-semibold text-pos">
            <Check className="w-[18px] stroke-current" />
            {dialog.completion}
          </p>

          {/* The same walkthrough the hero's secondary CTA opens, offered again
              where somebody has just read about it. */}
          <GhostCta onClick={onOpenDemo}>Walk through it</GhostCta>
        </div>
      </Shell>
    </Section>
  );
}
