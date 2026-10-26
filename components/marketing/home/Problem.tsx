import { section } from '@/lib/marketing/content';
import { Shell, Tag, Heading, Lede } from './primitives';

/**
 * "Somehow, every tool still needs you." — the pile of things on the owner's desk.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHY THE SLIPS LOOK LIKE PAPER
 *
 * They are the one place on the page that is not product UI. The argument is
 * that the work between the tools lands on a person, and paper is what that
 * work actually looks like: a note, in handwriting, that no software knows
 * about. Rendering them as neat cards would make them look like something the
 * platform already holds, which is the opposite of the point.
 *
 * The rotation is desktop-only and capped at two degrees. The spec is explicit
 * that slips may never overlap text and must not rotate on mobile, where a
 * tilted card in a narrow column just reads as broken.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE RESTRAINT IS PART OF THE DESIGN
 *
 * No competitor marks, no subscription totals, no invented "you are wasting
 * £X" figure, and no second call to action. The section earns its place by
 * being recognisable, not by scaring anybody with arithmetic nobody did.
 */
export function Problem() {
  const s = section('problem');
  const slips = s.visual.slips;

  /* Three paper colours, cycled. More would read as a colour code that means
     something; one would read as a stack of the same note. */
  const papers = ['bg-note-1', 'bg-note-2', 'bg-note-1', 'bg-note-3', 'bg-note-1'];

  /* Tilt per slip, desktop only. Fixed values rather than random so the layout
     is identical on every render and on the server. */
  const tilts = [
    'lg:-rotate-2',
    'lg:rotate-[1.8deg] lg:translate-y-3.5',
    'lg:rotate-[1.2deg] lg:translate-x-2',
    'lg:-rotate-[1.4deg] lg:translate-y-3',
    'lg:-rotate-[0.6deg] lg:col-span-2 lg:w-[58%] lg:justify-self-center lg:mt-2',
  ];

  return (
    <section id="the-problem" className="bg-night pt-14 text-night-ink md:pt-[72px] lg:pt-28">
      <Shell className="grid items-center gap-14 lg:grid-cols-2 lg:gap-[88px]">
        <div>
          <Tag tone="night">{s.eyebrow}</Tag>
          <Heading className="mt-[22px]">{s.headline}</Heading>
          <Lede className="mt-6 text-night-ink-2">{s.body}</Lede>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold text-night-ink-2">
            {s.visual.groupLabel}
          </p>
          <ul className="grid gap-3 md:grid-cols-2 md:gap-4">
            {slips.map((slip, i) => (
              <li
                key={slip.id}
                className={`rounded px-[18px] pb-5 pt-4 text-[15px] leading-[1.4] text-[#1E2B31] shadow-[0_18px_30px_-18px_rgba(0,0,0,0.6)] ${papers[i % papers.length]} ${tilts[i] ?? ''}`}
              >
                <b className="mb-0.5 block text-lg font-semibold tracking-[-0.02em]">
                  {slip.task}
                </b>
                <span className="text-[#5A6368]">{slip.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </Shell>

      <Bridge />
    </section>
  );
}

/**
 * The turn: "you wanted help running your business. You got more to manage."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ITS OWN BAND, BECAUSE IT IS ITS OWN BEAT
 *
 * This used to sit on `--night`, the same ground as the slips above it, with
 * only a hairline between them — so the page's emotional turn looked like the
 * tail of the previous paragraph. It now has `--night-3`, a lighter dark that
 * is a 1.33 luminance step rather than the 1.18 of `--night-2`, which on
 * screen was no step at all.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * IT SPANS THE PAGE
 *
 * The statement was capped at 22 characters a line, which stacked it into four
 * short rows down the left and left the right half of a 1240px page empty. At
 * full measure it runs about 47 characters a line and reads as three long
 * ones — which is also how the sentence is built: two clauses and a verdict.
 *
 * The second half is dimmed rather than emphasised. It is the quiet admission
 * after the complaint, and shouting it would make the page sound bitter.
 */
function Bridge() {
  const s = section('problem');
  const bridge = s.bridge;
  const cut = bridge.indexOf('You wanted');
  const head = cut > 0 ? bridge.slice(0, cut) : bridge;
  const tail = cut > 0 ? bridge.slice(cut) : '';

  return (
    <div className="mt-16 border-y border-night-line bg-night-3 py-[clamp(64px,8vw,112px)] lg:mt-24">
      <Shell>
        {/* No character cap: the whole measure, so the sentence spreads. */}
        <p className="font-display text-[clamp(26px,3.6vw,48px)] font-semibold leading-[1.1] tracking-[-0.04em]">
          {head}
          {tail ? <span className="text-night-ink-2">{tail}</span> : null}
        </p>

        <a
          href="#a-day"
          className="group mt-10 inline-flex items-center gap-3 text-lg font-semibold text-brand transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:ring-offset-night-3"
        >
          {s.transition}
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="w-5 fill-none stroke-current stroke-[2.2] transition-transform group-hover:translate-y-0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M6 13l6 6 6-6" />
          </svg>
        </a>
      </Shell>
    </div>
  );
}
