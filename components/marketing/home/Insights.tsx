import { section, type Priority } from '@/lib/marketing/content';
import { showInsightGrowth } from '@/lib/marketing/config';
import { insightGrowth } from '@/lib/marketing/insightGrowth';
import { Section, Shell, Tag, Heading, Lede } from './primitives';

/**
 * "Know what needs you. And what can wait."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE ACCURACY RULES ARE THE SECTION
 *
 * The content carries three, and they are the difference between a useful
 * advisor and one nobody believes:
 *
 *   1. "no recorded reply", never "you forgot to reply". The platform does not
 *      see every channel — she may well have phoned him — so it reports what
 *      it has, not what she did.
 *   2. Available capacity is NOT lost revenue. An empty Tuesday is an empty
 *      Tuesday; pricing it as a loss invents money.
 *   3. A suggested follow-up is not a guaranteed conversion.
 *
 * Every string rendered here already obeys them. They are listed because the
 * next person to edit this copy needs to know they exist, and because
 * `accuracyRules` lives in the content object where it looks like copy and is
 * not.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * EVIDENCE BEFORE ACTION, ALWAYS TOGETHER
 *
 * Each card states the finding, then what it is based on, then what to do. The
 * spec puts 180ms between evidence and action for a reason, and it sets one
 * hard rule for mobile: "explanation and action always appear together". A
 * finding with its action hidden behind a tap is a claim with no recourse, so
 * nothing here is collapsed.
 */
export function Insights() {
  const s = section('insights');
  const priorities = s.priorities as Priority[];

  return (
    <Section id="see-clearly" tone="surface">
      <Shell className="grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-[88px]">
        <div>
          <Tag>{s.eyebrow}</Tag>
          <Heading className="mt-[22px]">{s.headline}</Heading>
          <Lede className="mt-6 text-ink-2">{s.body}</Lede>
          <p className="mt-[26px] font-semibold">{s.supportLine}</p>
          <p className="mt-2.5 text-sm text-ink-2">{s.exampleNote}</p>
        </div>

        <div className="rounded-[28px] border border-line bg-canvas p-4 md:p-6">
          <div className="flex items-center justify-between px-2 pb-4 pt-1.5">
            <h3 className="font-display text-lg font-semibold tracking-[-0.02em]">
              {s.viewTitle}
            </h3>
          </div>

          <ul className="grid gap-2.5">
            {priorities.map(p => {
              const lead = p.id === s.defaultSelected;
              return (
                <li
                  key={p.id}
                  className={[
                    'rounded-[18px] border bg-surface px-5 py-[18px]',
                    lead
                      ? 'border-ink shadow-[0_18px_40px_-26px_rgba(15,34,43,0.4)]'
                      : 'border-line',
                  ].join(' ')}
                >
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-2.5 w-2.5 flex-none rounded-full bg-accent"
                    />
                    <b className="text-[17px] font-semibold tracking-[-0.015em]">
                      {p.priority}
                    </b>
                  </div>

                  <p className="ml-[22px] mt-1 text-[14.5px] text-ink-2">{p.evidence}</p>

                  {lead && p.detail ? (
                    <div className="ml-[22px] mt-3 rounded-xl bg-canvas px-3.5 py-3 text-[14.5px]">
                      {p.detail.explanation}
                      {/* The provenance line. "Based on: …" is what makes the
                          claim checkable rather than asserted. */}
                      <small className="mt-1.5 block text-[12.5px] text-ink-3">
                        {p.detail.evidenceLabel}
                      </small>
                    </div>
                  ) : null}

                  {p.drawer ? (
                    <div className="ml-[22px] mt-3 flex flex-wrap gap-1.5">
                      {p.drawer.items.map(item => (
                        <span
                          key={item}
                          className="rounded-lg border border-line bg-canvas px-2.5 py-1.5 text-[13px]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <span className="ml-[22px] mt-3.5 inline-flex text-[13.5px] font-semibold text-accent">
                    {p.action}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </Shell>

      {showInsightGrowth ? <GrowthPanel /> : null}
    </Section>
  );
}

/**
 * Which areas the advisor can speak about, by the time there is evidence.
 *
 * A table rather than a graphic, because it IS tabular: seven areas against
 * five points in time. Screen readers get row and column headers and an
 * "active"/"not yet" state per cell; the dots are `aria-hidden` decoration on
 * top of that.
 */
function GrowthPanel() {
  const g = insightGrowth;
  const startAt = (vector: string) => g.days.findIndex(d => d.starts.includes(vector));

  return (
    <Shell className="mt-[72px]">
      <div className="grid gap-9 rounded-[28px] border border-line bg-canvas p-6 md:p-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:items-start">
        <div>
          <h3 className="font-display text-[clamp(24px,3vw,40px)] font-semibold leading-[1.05] tracking-[-0.04em]">
            {g.headline}
          </h3>
          <p className="mt-3.5 max-w-[44ch] text-ink-2">{g.body}</p>
        </div>

        <div>
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-separate border-spacing-0">
              <caption className="sr-only">
                Which areas AgentsPilot can advise on, by day
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="w-[78px] pb-3.5 sm:w-24">
                    <span className="sr-only">Area</span>
                  </th>
                  {g.days.map(d => (
                    <th
                      key={d.label}
                      scope="col"
                      className="pb-3.5 text-[12px] font-semibold text-ink-3 sm:text-[13px]"
                    >
                      {d.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {g.vectors.map(vector => {
                  const start = startAt(vector);
                  return (
                    <tr key={vector}>
                      <th
                        scope="row"
                        className="whitespace-nowrap py-2.5 pr-3 text-left text-[12.5px] font-semibold sm:text-[14.5px]"
                      >
                        {vector}
                      </th>
                      {g.days.map((d, i) => {
                        const on = start >= 0 && i >= start;
                        const isStart = i === start;
                        return (
                          <td key={d.label} className="relative h-10 text-center">
                            {/* The connecting rail, clipped at the first and
                                last cell so the row does not run off the edge. */}
                            <span
                              aria-hidden="true"
                              className={[
                                'absolute top-1/2 h-0.5 -translate-y-px',
                                on ? 'bg-accent/45' : 'bg-line',
                                i === 0 || isStart ? 'left-1/2' : 'left-0',
                                i === g.days.length - 1 ? 'right-1/2' : 'right-0',
                              ].join(' ')}
                            />
                            <span
                              aria-hidden="true"
                              className={[
                                'relative inline-block rounded-full border-2',
                                on ? 'border-accent bg-accent' : 'border-line-2 bg-surface',
                                isStart ? 'h-[18px] w-[18px] ring-[5px] ring-accent-soft' : 'h-3 w-3',
                              ].join(' ')}
                            />
                            <span className="sr-only">{on ? 'active' : 'not yet'}</span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div
            aria-hidden="true"
            className="mt-[18px] hidden grid-cols-[78px_repeat(5,minmax(0,1fr))] gap-2.5 sm:grid sm:grid-cols-[96px_repeat(5,minmax(0,1fr))]"
          >
            <span />
            {g.days.map(d => (
              <p key={d.label} className="text-center text-[13px] leading-[1.4] text-ink-2">
                {d.caption}
              </p>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-[18px] border border-line bg-surface px-5 py-4 lg:col-span-full">
          <span aria-hidden="true" className="flex flex-none gap-1">
            <i className="h-7 w-2.5 rounded bg-accent" />
            <i className="h-7 w-2.5 rounded bg-accent opacity-70" />
            <i className="h-7 w-2.5 rounded bg-accent opacity-45" />
          </span>
          <p className="text-[15.5px] font-medium">{g.automateRule}</p>
        </div>

        <p className="text-[12.5px] text-ink-3 lg:col-span-full">{g.note}</p>
      </div>
    </Shell>
  );
}
