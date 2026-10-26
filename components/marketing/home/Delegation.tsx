import { section, type ReviewSetting } from '@/lib/marketing/content';
import { gates } from '@/lib/marketing/config';
import { Shell, Tag, Heading, Lede, PrimaryCta } from './primitives';

/**
 * "You don't have to be the follow-up person."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE GATE IS THE POINT OF THIS SECTION
 *
 * It demonstrates handing work over. The one thing it must never do is imply
 * the demonstration proves a capability that is not shipped — so when
 * `gates.autonomy` is off, the second review option ("let approved rules
 * handle future follow-ups") is REMOVED, not greyed out, and the body's first
 * sentence is replaced with the draft-and-review wording the content supplies.
 *
 * Greying it out would be worse than nothing: a disabled control that names a
 * capability still tells the visitor it exists.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE PANEL IS SHOWN FINISHED, AND NOTHING IN IT IS LIVE
 *
 * The state machine in the content has one rule that matters here: "the UI
 * cannot enter completed before approval". Rendering the panel in its
 * completed state is honest precisely because the receipt reads
 * draft → approved by you → sent, in that order, with the approval in the
 * middle. The order IS the claim.
 *
 * No control here has an endpoint. The marketing demo has no send and no
 * payment path, by design.
 */
export function Delegation() {
  const s = section('delegation');
  const panel = s.panel;
  const fallback = s.fallbackIfNoAutonomy;

  /* The approved substitution when rules do not run: replace the first
     sentence, keep the rest. */
  const body = gates.autonomy
    ? s.body
    : s.body.replace(/^[^.]*\./, fallback.replaceBodyFirstSentence);

  const settings = (panel.reviewSettings as ReviewSetting[]).filter(
    option => gates.autonomy || option.id !== fallback.removeOption
  );

  /* The receipt, as four beats. Split on the arrow the content uses. */
  const receipt = panel.activityReceipt.split('→').map(part => part.trim());

  return (
    <section id="hand-it-over" className="bg-night py-14 text-night-ink md:py-[72px] lg:py-28">
      <Shell className="grid items-center gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-[88px]">
        <div>
          <Tag tone="night">{s.eyebrow}</Tag>
          <Heading className="mt-[22px]">{s.headline}</Heading>
          <Lede className="mt-6 text-night-ink-2">{body}</Lede>
          <p className="mt-5 font-semibold text-night-ink-2">{s.supportLine}</p>
          <div className="mt-9">
            <PrimaryCta section="delegation" onNight />
          </div>
        </div>

        {/* The light panel inside the dark section. The contrast is the
            metaphor: the thing being handed over is lit. */}
        <div className="grid gap-[18px] rounded-[28px] bg-surface p-6 text-ink shadow-[0_60px_120px_-50px_rgba(0,0,0,0.8)] md:p-8">
          <h3 className="font-display text-[clamp(20px,2.2vw,28px)] font-semibold leading-tight tracking-[-0.03em]">
            {panel.recommendation}
          </h3>
          <p className="text-base text-ink-2">{panel.reason}</p>

          {/* The draft reply. A speech bubble, because it is something being
              said to a person, not a record. */}
          <p className="max-w-[92%] justify-self-start rounded-[18px_18px_18px_6px] border border-line bg-canvas px-[18px] py-4 text-base">
            {panel.draftReply}
          </p>

          <div className="grid gap-2">
            {settings.map(option => (
              <div
                key={option.id}
                className={[
                  'flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-[15.5px]',
                  option.default ? 'border-ink bg-canvas' : 'border-line',
                ].join(' ')}
              >
                <span
                  aria-hidden="true"
                  className={[
                    'mt-0.5 h-[18px] w-[18px] flex-none rounded-full',
                    option.default ? 'border-[5.5px] border-ink' : 'border-2 border-line-2',
                  ].join(' ')}
                />
                <div>
                  {option.label}
                  {option.default ? <span className="sr-only"> (selected)</span> : null}
                  {option.revealsRules ? (
                    <small className="mt-1 block text-[13.5px] leading-[1.45] text-ink-2">
                      {option.revealsRules}
                    </small>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <ol
            aria-label="Activity"
            className="grid grid-cols-2 gap-x-1.5 gap-y-4 border-t border-line pt-[18px] sm:grid-cols-4"
          >
            {receipt.map((beat, i) => (
              <li
                key={beat}
                className="relative pt-8 text-[13.5px] font-semibold leading-[1.3]"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 grid h-[22px] w-[22px] place-items-center rounded-full bg-pos"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-[13px] fill-none stroke-white stroke-[3.4]"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 12.5l4 4 8-9" />
                  </svg>
                </span>
                {/* The rail between beats, hidden on the last of each row. */}
                {i < receipt.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute left-7 right-1 top-2.5 hidden h-0.5 bg-pos/30 sm:block"
                  />
                ) : null}
                {beat}
              </li>
            ))}
          </ol>

          <p className="text-[14.5px] font-semibold text-pos">{panel.completedState}</p>
        </div>
      </Shell>
    </section>
  );
}
