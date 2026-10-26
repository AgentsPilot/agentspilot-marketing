import { section, type FaqItem } from '@/lib/marketing/content';
import { Section, Shell, Heading } from './primitives';

/**
 * "A few things you may be wondering."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * NATIVE `<details>`, DELIBERATELY
 *
 * Keyboard operable without a line of JavaScript, works before hydration, and
 * — the reason that matters commercially — the answers stay in the document,
 * so a search engine indexes them. A custom accordion would need all three
 * rebuilt and would get one of them wrong.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE ANSWERS ARE CLAIMS, AND TWO OF THEM ARE GATED
 *
 * The content's own developer note says to confirm each answer against the
 * shipped product. Two need watching:
 *
 *   faq.contact  "You choose which activities to authorize and when approval
 *                is required… You can pause an enabled workflow." That needs
 *                the approval and pause controls to exist. If they do not, the
 *                answer must describe draft-and-review instead.
 *   faq.learns   "learns how I work" is deliberately deflated here — it says
 *                it uses the information in your workspace and explicitly
 *                does NOT mean it knows everything. Keep that sentence.
 *
 * And the note is explicit about what must NOT be added until policy exists:
 * no claims about training, security certification, data ownership, deletion
 * or export. Those are the answers a visitor most wants and we cannot yet give.
 */
export function Faq() {
  const s = section('faq');
  const items = s.items as FaqItem[];

  return (
    <Section id="questions" tone="canvas" className="!pt-0">
      <Shell className="grid gap-9 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-20">
        <Heading className="!text-[clamp(30px,4vw,52px)]">{s.heading}</Heading>

        <div>
          {items.map((item, i) => (
            <details
              key={item.id}
              className={`group border-t border-line-2 ${i === items.length - 1 ? 'border-b' : ''}`}
            >
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-[22px] text-[clamp(17px,1.7vw,21px)] font-semibold tracking-[-0.02em] [&::-webkit-details-marker]:hidden">
                <span>{item.q}</span>
                <span
                  aria-hidden="true"
                  className="grid h-[30px] w-[30px] flex-none place-items-center rounded-full border border-line-2 bg-surface text-lg font-normal transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-[66ch] pb-6 pr-12 text-ink-2">{item.a}</p>
            </details>
          ))}
        </div>
      </Shell>
    </Section>
  );
}
