'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { section, type BoardRow } from '@/lib/marketing/content';
import { Check } from './primitives';

/**
 * The hero's product window: three rows that go from "still on me" to "done".
 *
 * Sits in the hero's RIGHT COLUMN, beside the copy, which is the arrangement
 * the content's layout spec describes for desktop. It therefore sizes to its
 * column rather than to the page, and is fully rounded — it used to be a
 * full-width slab with a flat bottom edge that bled into the next section.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE MOTION CONTRACT, AND WHY IT IS NOT DECORATION
 *
 * The storyboard is the argument of the page: an inquiry arrives, a next step
 * is suggested, and an action goes out AFTER APPROVAL. The approval beat is the
 * one the whole product rests on, so it gets its own step and its own badge
 * rather than being implied.
 *
 * Four rules the spec sets, each for a reason:
 *
 *   - PAUSE AND REPLAY are controls, not nice-to-haves. A 6.5-second sequence
 *     that a visitor cannot stop or repeat is a sequence they will miss.
 *   - IT RUNS ONCE while visible, and stops when the tab is hidden. An
 *     animation looping behind a background tab is spending a battery to show
 *     nobody anything.
 *   - REDUCED MOTION gets the finished board, not a faster animation. The
 *     final state IS the message; the sequence only paces it.
 *   - LAYOUT SPACE IS RESERVED. Every row is in the DOM from the first paint
 *     and only its opacity changes, so nothing reflows mid-story.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHAT A SCREEN READER GETS
 *
 * Not the animation. The rows are a list with their before and after states
 * labelled in text, present from the start. The visual sequence is an
 * enhancement on top of a static, readable board — which is also exactly what
 * a visitor with `prefers-reduced-motion` sees.
 */

const V = section('hero').visual;

/** The storyboard, in ms from the start. Straight from the content config. */
const BEATS = V.storyboardMs;

/** Which rows are lit at a given beat, and when the badge appears. */
const STEPS = [
  { at: 0, rows: 0, badge: false },
  { at: BEATS.highlightInquiry, rows: 1, badge: false },
  { at: BEATS.revealSuggestedAction, rows: 2, badge: false },
  { at: BEATS.approvedBadge, rows: 2, badge: true },
  { at: BEATS.followUpSent, rows: 3, badge: true },
] as const;

export function HeroDayBoard() {
  const reduced = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);

  /** How many rows have landed. Starts complete for reduced motion. */
  const [step, setStep] = useState(() => (reduced ? STEPS.length - 1 : 0));
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(() => Boolean(reduced));
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const run = useCallback(
    (from = 0) => {
      clear();
      setPlaying(true);
      setFinished(false);
      STEPS.forEach((s, i) => {
        if (i < from) return;
        timers.current.push(setTimeout(() => setStep(i), s.at));
      });
      timers.current.push(
        setTimeout(() => {
          setPlaying(false);
          setFinished(true);
        }, BEATS.finish)
      );
    },
    [clear]
  );

  /*
   * Start once, when the board is actually on screen.
   *
   * `IntersectionObserver` rather than a mount effect: the hero is above the
   * fold on a desktop and below it on a phone in landscape, and a sequence
   * that has already finished by the time somebody scrolls to it has told them
   * nothing.
   */
  useEffect(() => {
    if (reduced || !wrap.current) return;

    let started = false;
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting && !started) {
            started = true;
            run();
            io.disconnect();
          }
        }
      },
      { threshold: 0.35 }
    );

    io.observe(wrap.current);
    return () => io.disconnect();
  }, [reduced, run]);

  /* A hidden tab gets no animation. Resume is the visitor's choice, not ours. */
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        clear();
        setPlaying(false);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      clear();
    };
  }, [clear]);

  const shown = STEPS[step];
  const rows = V.rows as BoardRow[];

  return (
    <div ref={wrap} className="relative">
      {/* The warm bloom behind the window. Decorative, and never over text. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-12%] z-0 blur-[40px]"
        style={{
          background:
            // `rgb(var(--brand))`, not `var(--brand)`: the token is RGB channels now.
            'radial-gradient(50% 50% at 50% 40%, rgb(var(--brand) / 0.26), transparent 70%)',
        }}
      />

      <figure
        className="relative z-10 overflow-hidden rounded-[22px] border border-line bg-surface text-left shadow-[0_40px_90px_-40px_rgba(15,34,43,0.35)]"
        aria-labelledby="boardTitle"
      >
        <div
          aria-hidden="true"
          className="flex items-center gap-2 border-b border-line bg-sunk px-[18px] py-3.5"
        >
          <i className="h-[11px] w-[11px] rounded-full bg-line-2" />
          <i className="h-[11px] w-[11px] rounded-full bg-line-2" />
          <i className="h-[11px] w-[11px] rounded-full bg-line-2" />
          <span className="ml-3 text-[13px] font-medium text-ink-3">AgentsPilot</span>
        </div>

        <div className="px-[18px] pb-7 pt-6 md:px-6">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
            <h3 id="boardTitle" className="font-display text-[clamp(20px,2vw,26px)] font-semibold tracking-[-0.02em]">
              {V.title}
            </h3>

            {/* Controls, per the contract. Hidden when motion is off: there is
                nothing to pause. */}
            {!reduced ? (
              <button
                type="button"
                onClick={() => (playing ? (clear(), setPlaying(false)) : run(finished ? 0 : step))}
                className="rounded-full border border-line-2 bg-surface px-3.5 py-1.5 text-[13px] font-semibold text-ink-2 transition-colors hover:border-ink hover:text-ink"
              >
                {playing ? 'Pause' : finished ? 'Replay' : 'Play example'}
              </button>
            ) : null}
          </div>

          <ol className="grid gap-2.5">
            {rows.map((row, i) => {
              const landed = i < shown.rows;
              return (
                <motion.li
                  key={row.id}
                  // Opacity and transform only, and the row holds its space
                  // from the first paint so nothing reflows.
                  initial={false}
                  animate={{ opacity: landed ? 1 : 0.38, y: landed ? 0 : 4 }}
                  transition={{ duration: reduced ? 0 : 0.26, ease: 'easeOut' }}
                  className="grid grid-cols-[36px_1fr] items-center gap-3.5 rounded-2xl border border-line bg-surface px-[18px] py-4 sm:grid-cols-[36px_1fr_auto]"
                >
                  <span
                    aria-hidden="true"
                    className="grid h-9 w-9 place-items-center rounded-[11px] bg-pos-soft"
                  >
                    <Check className="w-4 stroke-pos" />
                  </span>

                  <div>
                    <span className="block text-[13.5px] text-ink-3 line-through">
                      <span className="sr-only">Before: </span>
                      {row.initial}
                    </span>
                    <span className="block text-[16.5px] font-semibold leading-[1.35]">
                      <span className="sr-only">Now: </span>
                      {row.final}
                    </span>
                  </div>

                  {i === rows.length - 1 ? (
                    <motion.span
                      initial={false}
                      animate={{ opacity: shown.badge ? 1 : 0 }}
                      transition={{ duration: reduced ? 0 : 0.2 }}
                      className="col-start-2 inline-flex justify-self-start rounded-full bg-pos-soft px-2.5 py-1 text-[12.5px] font-semibold text-pos sm:col-start-3"
                    >
                      {V.badge}
                    </motion.span>
                  ) : null}
                </motion.li>
              );
            })}
          </ol>

          <figcaption className="mt-[18px] text-[13.5px] text-ink-3">{V.caption}</figcaption>
        </div>
      </figure>
    </div>
  );
}
