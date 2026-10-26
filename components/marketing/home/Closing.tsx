import { section } from '@/lib/marketing/content';
import { Section, Shell, Heading, Lede, PrimaryCta } from './primitives';

/**
 * "Make room for the part of your business you love."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE RESTRAINT IS WRITTEN INTO THE CONTENT, AND IT IS THE RIGHT CALL
 *
 * Two instructions: leave generous open space, and avoid a fabricated
 * "hours saved" number. The second is the one worth defending — an invented
 * figure is the single easiest thing to put here and the fastest way to lose
 * somebody who has read this far honestly.
 *
 * So the section ends on three words rather than a statistic: Organized,
 * Needs your decision, Handled with approval. They are the three states the
 * whole page has been describing, and the middle one is deliberately not
 * flattering — some things will still need her.
 *
 * The dots are coloured, but the words carry the meaning on their own: the
 * accessibility rules forbid relying on orange or green alone to convey state.
 */
export function Closing() {
  const s = section('closing');

  /* Neutral, attention, done — matching the three states in order. */
  const dots = ['bg-ink-3', 'bg-accent', 'bg-pos'];

  return (
    <Section id="get-started" tone="canvas" className="pb-10 text-center">
      <Shell>
        <Heading className="mx-auto !text-[clamp(36px,6.6vw,92px)] !leading-[0.96] !tracking-[-0.055em]">
          {s.headline}
        </Heading>

        <Lede className="mx-auto mt-7 text-ink-2">{s.body}</Lede>

        <div className="mt-9 flex justify-center">
          <PrimaryCta section="closing" />
        </div>

        <ul
          aria-label="Example states"
          className="mx-auto mt-14 flex flex-wrap justify-center gap-2.5"
        >
          {s.states.map((state, i) => (
            <li
              key={state}
              className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface py-2.5 pl-3 pr-[18px] text-[15px] font-semibold"
            >
              <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${dots[i] ?? 'bg-ink-3'}`} />
              {state}
            </li>
          ))}
        </ul>
      </Shell>
    </Section>
  );
}
