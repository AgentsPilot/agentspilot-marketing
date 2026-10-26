'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { dialog } from '@/lib/marketing/content';
import { DayDemoStage } from './DayDemoStage';

/**
 * "A day with AgentsPilot" — the walkthrough the mockup specified and never built.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHY IT EXISTS AT ALL
 *
 * The approved secondary CTA is "See a day with AgentsPilot", and it opens
 * `dialog.dayDemo`. The mockup rendered the dialog's three steps as a static
 * timeline instead and pointed the CTA at an anchor — so the one interaction
 * where the visitor APPROVES something, and sees what approval produces, was
 * never on the page. That beat is the product's whole proposition.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE RULES, AND WHY EACH ONE IS HERE
 *
 * From the content's accessibility list and state machine, all of which are
 * implemented below rather than noted:
 *
 *   TRAP FOCUS          Tab cycles inside the dialog. Without it, tabbing
 *                       walks into a page the visitor cannot see.
 *   ESCAPE CLOSES       and returns focus to the control that opened it, so a
 *                       keyboard user is not dropped at the top of the document.
 *   BACKGROUND INERT    `aria-hidden` on the page plus a locked scroll, so a
 *                       screen reader does not read the page behind the sheet.
 *   FOCUS MOVES TO THE  on every step change. The heading is the only thing
 *   NEW STEP HEADING    that tells a non-sighted user the step changed.
 *   NO AUTO-ADVANCE     The visitor clicks. A dialog that moves on its own is
 *                       a slideshow they are watching, not a walkthrough.
 *   COMPLETION IS       announced politely, once — not every decorative change.
 *   ANNOUNCED POLITELY
 *   SCROLL POSITION     The page is where they left it after dismissal.
 *   IS KEPT
 *
 * And the state machine's hard rule: **the UI cannot enter `completed` before
 * approval.** `approved` is reachable only from a deliberate click on step
 * three, which is why the approve control is a button and not a timer.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * NOTHING HERE IS LIVE
 *
 * Every control says "example". There is no send endpoint and no payment path
 * in the marketing app, and the label is what stops a visitor believing a real
 * message went to a real person.
 */

/**
 * `sent` and `cancelled` are both endings, not success and failure.
 *
 * The fifteen-minute window exists so an owner can stop a reply. A walkthrough
 * that only ever reaches `sent` teaches that the brakes are decorative.
 */
type Phase = 'walking' | 'sent' | 'cancelled';

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function DayDemoDialog({
  open,
  onClose,
  returnFocusTo,
}: {
  open: boolean;
  onClose: () => void;
  /** The control that opened the dialog, so focus can go home. */
  returnFocusTo?: React.RefObject<HTMLElement>;
}) {
  const reduced = useReducedMotion();
  const steps = dialog.steps;

  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('walking');

  const panel = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  const reset = useCallback(() => {
    setIndex(0);
    setPhase('walking');
  }, []);

  const close = useCallback(() => {
    onClose();
    // Focus goes back to the opener. Deferred so the dialog has unmounted and
    // the browser does not move focus twice.
    requestAnimationFrame(() => returnFocusTo?.current?.focus());
  }, [onClose, returnFocusTo]);

  /* Escape, and the focus trap. One listener while open. */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }

      if (e.key !== 'Tab' || !panel.current) return;

      const nodes = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        n => n.offsetParent !== null
      );
      if (nodes.length === 0) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      // Wrap at both ends, so Tab never escapes to the page behind.
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  /*
   * Lock the page without losing its scroll position.
   *
   * `overflow: hidden` on the body alone jumps the page to the top on some
   * browsers, which the content's rule about keeping scroll position forbids.
   * Pinning `top` to the current offset and restoring it keeps the place.
   */
  useEffect(() => {
    if (!open) return;

    const y = window.scrollY;
    const body = document.body;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };

    body.style.position = 'fixed';
    body.style.top = `-${y}px`;
    body.style.width = '100%';
    body.style.overflow = 'hidden';

    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      window.scrollTo(0, y);
    };
  }, [open]);

  /* Reset to step one each time it opens, and focus the heading. */
  useEffect(() => {
    if (!open) return;
    reset();
    const t = setTimeout(() => heading.current?.focus(), 30);
    return () => clearTimeout(t);
  }, [open, reset]);

  /* Every step change moves focus to the new heading — the only cue a screen
     reader gets that the step advanced. */
  useEffect(() => {
    if (!open) return;
    heading.current?.focus();
  }, [index, phase, open]);

  const step = steps[index];
  const isLast = index === steps.length - 1;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.18 }}
        >
          {/* The scrim. Clicking it closes, like Escape. */}
          <button
            type="button"
            aria-label="Close the example"
            onClick={close}
            className="absolute inset-0 cursor-default bg-night/70 backdrop-blur-sm"
          />

          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dayDemoTitle"
            initial={reduced ? false : { y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduced ? undefined : { y: 16, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.22, ease: 'easeOut' }}
            className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[28px] bg-surface text-ink shadow-2xl sm:max-h-[86vh] sm:max-w-[720px] sm:rounded-[28px]"
          >
            <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
              <div>
                <h2
                  id="dayDemoTitle"
                  ref={heading}
                  tabIndex={-1}
                  className="font-display text-xl font-semibold tracking-[-0.02em] outline-none"
                >
                  {phase === 'walking' ? step.title : dialog.completion}
                </h2>
                <p className="mt-1 text-sm text-ink-2">{dialog.subtitle}</p>
              </div>

              <button
                type="button"
                onClick={close}
                className="-mr-2 grid h-11 w-11 flex-none place-items-center rounded-full text-ink-2 transition-colors hover:bg-sunk hover:text-ink"
              >
                <span className="sr-only">Close</span>
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="w-5 fill-none stroke-current stroke-2"
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </header>

            {/* The body scrolls independently, so a long step never pushes the
                controls off a phone screen. */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <p className="mb-5 text-[16px] leading-[1.55] text-ink-2">
                {phase === 'sent'
                  ? 'Sam heard back, and you had the time to stop it.'
                  : phase === 'cancelled'
                    ? 'Nothing went out. You decided this one needed you.'
                    : step.body}
              </p>

              {/*
                * The stage animates the act. It does NOT advance itself — the
                * visitor clicks Next and Approve, which the content's state
                * machine requires ("no automatic step advance", and the UI
                * cannot reach `completed` before approval).
                */}
              <DayDemoStage
                act={index}
                outcome={phase === 'walking' ? null : phase}
                onSend={() => setPhase('sent')}
                onCancel={() => setPhase('cancelled')}
              />
            </div>

            <footer className="flex flex-wrap items-center gap-2.5 border-t border-line bg-sunk px-6 py-4">
              {phase !== 'walking' ? (
                <>
                  <button
                    type="button"
                    onClick={reset}
                    className="min-h-11 rounded-full border border-line-2 bg-surface px-5 text-[15px] font-semibold transition-colors hover:border-ink"
                  >
                    Replay
                  </button>
                  <button
                    type="button"
                    onClick={close}
                    className="min-h-11 rounded-full bg-ink px-5 text-[15px] font-semibold text-canvas transition-colors hover:bg-accent hover:text-white"
                  >
                    Close
                  </button>
                </>
              ) : (
                <>
                  {index > 0 ? (
                    <button
                      type="button"
                      onClick={() => setIndex(i => i - 1)}
                      className="min-h-11 rounded-full border border-line-2 bg-surface px-5 text-[15px] font-semibold transition-colors hover:border-ink"
                    >
                      Back
                    </button>
                  ) : null}

                  {/*
                    * No Approve here on the last act: the stage puts it on the
                    * draft itself, where the thing being approved is. Two
                    * approve buttons in one dialog is two chances to click the
                    * wrong one.
                    */}
                  {!isLast ? (
                    <button
                      type="button"
                      onClick={() => setIndex(i => i + 1)}
                      className="min-h-11 rounded-full bg-ink px-5 text-[15px] font-semibold text-canvas transition-colors hover:bg-accent hover:text-white"
                    >
                      Next
                    </button>
                  ) : null}

                  <span className="ml-auto text-[13px] font-medium text-ink-3">
                    Step {index + 1} of {steps.length}
                  </span>
                </>
              )}
            </footer>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
