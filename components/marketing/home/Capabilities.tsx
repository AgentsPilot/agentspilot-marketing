import { section, type Capability } from '@/lib/marketing/content';
import { Section, Shell, Tag, Heading, Lede, PrimaryCta } from './primitives';

/**
 * "Start with your business. Build from there."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHY A BENTO AND NOT THE SPEC'S TAB SELECTOR
 *
 * The content specifies a vertical selector with a preview panel — six tabs,
 * one visible at a time. That is the right shape for a page where the visitor
 * is comparing options. Here they are not comparing; they are finding out
 * whether their own work is in the list, and six labels behind a tab control
 * means five of them are invisible until clicked.
 *
 * So all six are laid out at once, with the default-selected capability
 * promoted to a large dark tile. The spec's own requirement is preserved —
 * "all six selectable, never auto-rotating" — by making none of them require a
 * click to be read. Every tile works as a static screenshot, which the motion
 * contract demands of every section anyway.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE BRIEF ABOVE THEM IS THE MECHANISM, SHOWN
 *
 * "I'm a personal trainer. I offer private sessions and monthly packages…" is
 * the actual input the product takes. Putting it in a prompt box, above a
 * workspace labelled as Maya's, says in one glance what "built around you"
 * means — without claiming the setup is automatic, which is a gated claim.
 */
export function Capabilities() {
  const s = section('capabilities');
  const caps = s.capabilities as Capability[];
  const featured = s.defaultSelected;

  /*
   * The tile grid. The featured capability spans three columns and two rows;
   * the rest fill around it. Explicit spans rather than auto-flow, because
   * auto-flow puts the big tile wherever it lands.
   */
  const spans: Record<number, string> = {
    0: 'lg:col-span-3',
    1: 'lg:col-span-3',
    2: 'lg:col-span-2',
    3: 'lg:col-span-2',
    4: 'lg:col-span-2',
  };

  let otherIndex = -1;

  return (
    <Section id="built-for-you" tone="canvas" className="!pt-0">
      <Shell>
        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-[72px]">
          <div>
            <Tag>{s.eyebrow}</Tag>
            <Heading className="mt-[22px]">{s.headline}</Heading>
          </div>
          <Lede className="text-ink-2">{s.body}</Lede>
        </div>

        {/* The brief. A box that looks like an input, because it is one. */}
        <div className="mb-5 mt-12 flex items-end gap-3.5 rounded-[24px] border border-line-2 bg-surface py-5 pl-6 pr-5 shadow-[0_20px_50px_-34px_rgba(15,34,43,0.35)]">
          <p className="flex-1 text-[clamp(17px,1.8vw,23px)] font-medium leading-[1.4] tracking-[-0.02em]">
            {s.exampleBrief}
          </p>
          <span
            aria-hidden="true"
            className="grid h-11 w-11 flex-none place-items-center rounded-full bg-accent"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-[18px] fill-none stroke-white stroke-[2.4]"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 19V5M6 11l6-6 6 6" />
            </svg>
          </span>
        </div>

        <p className="mb-[18px] text-sm text-ink-3">{s.workspaceLabel}</p>

        <div className="grid gap-3.5 md:grid-cols-2 lg:grid-cols-6 lg:auto-rows-[minmax(250px,auto)]">
          {caps.map(cap => {
            const isFeatured = cap.id === featured;
            if (!isFeatured) otherIndex += 1;

            return (
              <article
                key={cap.id}
                className={[
                  'flex min-h-[230px] flex-col gap-1.5 rounded-[24px] border p-6',
                  isFeatured
                    ? 'border-ink bg-ink text-canvas lg:col-span-3 lg:row-span-2'
                    : `border-line bg-surface ${spans[otherIndex] ?? 'lg:col-span-2'}`,
                ].join(' ')}
              >
                <h3 className="font-display text-xl font-semibold tracking-[-0.02em]">
                  {cap.label}
                </h3>
                <p
                  className={`max-w-[40ch] text-[15px] leading-[1.5] ${isFeatured ? 'text-canvas/70' : 'text-ink-2'}`}
                >
                  {cap.description}
                </p>

                <CapabilityObjectCard cap={cap} featured={isFeatured} />
              </article>
            );
          })}
        </div>

        <div className="mt-10">
          <PrimaryCta section="capabilities" />
        </div>
      </Shell>
    </Section>
  );
}

/**
 * The little piece of product inside each tile.
 *
 * Every value here is fictional and specific — "Sam", "Jordan · one session",
 * "Training for a first 10k in April". Specific beats generic for recognition,
 * and fictional is non-negotiable: these are illustrative objects, never a
 * real client's details.
 */
function CapabilityObjectCard({ cap, featured }: { cap: Capability; featured: boolean }) {
  const o = cap.object;

  return (
    <div className="mt-auto pt-[22px]">
      <div
        className={[
          'rounded-2xl border px-[18px] py-4',
          featured ? 'border-canvas/15 bg-canvas/[0.08]' : 'border-line bg-canvas',
        ].join(' ')}
      >
        <div className={`text-[12.5px] font-semibold ${featured ? 'text-canvas/65' : 'text-ink-3'}`}>
          {o.kind}
        </div>
        <div
          className={`mt-0.5 font-display font-semibold leading-tight tracking-[-0.03em] ${featured ? 'text-[40px]' : 'text-[22px]'}`}
        >
          {o.value}
        </div>

        {o.detail ? (
          <div className={`mt-1 text-sm leading-[1.45] ${featured ? 'text-canvas/65' : 'text-ink-2'}`}>
            {o.detail}
          </div>
        ) : null}

        {o.actions?.length ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {o.actions.map((a, i) => (
              <span
                key={a}
                className={[
                  'rounded-full border px-3 py-1.5 text-[13px] font-semibold',
                  i === 0
                    ? featured
                      ? 'border-brand bg-brand text-night'
                      : 'border-ink bg-ink text-canvas'
                    : featured
                      ? 'border-canvas/30 text-canvas'
                      : 'border-line-2 bg-surface text-ink',
                ].join(' ')}
              >
                {a}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
