'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { section } from '@/lib/marketing/content';
import { Check } from './primitives';

/**
 * The animated stage inside the day walkthrough.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE ANIMATION IS THE ARGUMENT, NOT DECORATION
 *
 * Three acts, and each one does something a static panel cannot:
 *
 *   1. GATHER   three things settle into one place, staggered, so you watch a
 *               scattered day become a list. The point of the product in four
 *               hundred milliseconds.
 *   2. NOTICE   one card lifts out of the stack and the reasoning draws in
 *               beneath it. Movement is what makes "this one needs you"
 *               legible without a word of explanation.
 *   3. DECIDE   the reply types itself, a countdown appears, and there are two
 *               ways out. Then the receipt ticks across in sequence. The ORDER
 *               is the claim — written, your window, sent — and showing it in
 *               order is the only way to make it felt.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * EVERY STRING IS APPROVED CONTENT
 *
 * The cards are the capability objects, the evidence line is the insights
 * section's own `evidenceLabel`, and the draft is the delegation panel's
 * `draftReply`. Nothing here is written for the animation — a demo that
 * invents its own copy is a demo of something that does not exist.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * REDUCED MOTION GETS THE DESTINATION, NOT A FASTER TRIP
 *
 * Every act renders its finished state: cards present, evidence shown, draft
 * complete, receipt ticked. No stagger, no typing, no springs. The content is
 * identical — only the pacing is removed, which is the whole point of the
 * preference.
 */

const CAPS = section('capabilities').capabilities;
const PANEL = section('delegation').panel;
const LEAD = section('insights').priorities[0];

/**
 * What actually goes out: the business's services, each with a booking link.
 *
 * Not a composed message. `buildLeadReplyCandidates` walks the active services
 * and attaches a booking URL to each, plus one "Everything we offer" catch-all
 * pointing at the page itself. Showing chips rather than prose is the honest
 * picture of it — and it is why the whole thing sends NOTHING when there is no
 * bookable link.
 */
const OFFERED = (CAPS.find(c => c.id === 'cap.day')?.object.actions ?? []).slice(0, 4);

/** The three things that land in act one, taken from the capability objects. */
const INBOX = [
  CAPS.find(c => c.id === 'cap.enquiries')!,
  CAPS.find(c => c.id === 'cap.day')!,
  CAPS.find(c => c.id === 'cap.moving')!,
].filter(Boolean);

/** A spring with a little overshoot. Linear easing is what makes UI feel cheap. */
const SPRING = { type: 'spring' as const, stiffness: 420, damping: 30, mass: 0.8 };

export function DayDemoStage({
  act,
  outcome,
  onSend,
  onCancel,
}: {
  /** 0 gather, 1 notice, 2 the reply and its window. */
  act: number;
  /** null while deciding. Both endings are real: it sends, or you stop it. */
  outcome: 'sent' | 'cancelled' | null;
  onSend: () => void;
  onCancel: () => void;
}) {
  const reduced = useReducedMotion();

  return (
    <div className="relative min-h-[320px]">
      {/*
        * A warm wash that only appears once something has been approved. The
        * colour is the reward, and holding it back until act three is what
        * makes it read as a result rather than as styling.
        */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-10%] rounded-full blur-3xl"
        initial={false}
        animate={{ opacity: outcome === 'sent' ? 1 : 0 }}
        transition={{ duration: reduced ? 0 : 0.6 }}
        style={{ background: 'radial-gradient(45% 45% at 50% 45%, rgb(var(--pos) / 0.14), transparent 70%)' }}
      />

      <div className="relative">
        <AnimatePresence mode="wait" initial={false}>
          {outcome ? (
            <Receipt key="receipt" reduced={Boolean(reduced)} outcome={outcome} />
          ) : act === 0 ? (
            <Gather key="gather" reduced={Boolean(reduced)} />
          ) : act === 1 ? (
            <Notice key="notice" reduced={Boolean(reduced)} />
          ) : (
            <Approve
              key="approve"
              reduced={Boolean(reduced)}
              onApprove={onSend}
              onCancel={onCancel}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Shared act wrapper: a short cross-fade, so acts replace rather than jump. */
function Act({
  children,
  reduced,
}: {
  children: React.ReactNode;
  reduced: boolean;
}) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduced ? undefined : { opacity: 0, y: -6 }}
      transition={{ duration: reduced ? 0 : 0.22, ease: 'easeOut' }}
      className="grid gap-2.5"
    >
      {children}
    </motion.div>
  );
}

/**
 * Act one: the day arrives.
 *
 * Staggered so the three cards land one after another. A simultaneous fade
 * would show a finished list; a stagger shows it being assembled, which is the
 * difference between "here is your day" and "your day came together".
 */
function Gather({ reduced }: { reduced: boolean }) {
  return (
    <Act reduced={reduced}>
      {INBOX.map((cap, i) => (
        <motion.div
          key={cap.id}
          initial={reduced ? false : { opacity: 0, y: 18, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={reduced ? { duration: 0 } : { ...SPRING, delay: 0.09 * i }}
          className="rounded-2xl border border-line bg-surface px-4 py-3.5"
        >
          <div className="text-[12.5px] font-semibold text-ink-3">{cap.object.kind}</div>
          <div className="font-display text-[19px] font-semibold tracking-[-0.02em]">
            {cap.object.value}
          </div>
          {cap.object.detail ? (
            <div className="mt-0.5 text-[13.5px] leading-[1.45] text-ink-2">{cap.object.detail}</div>
          ) : null}
        </motion.div>
      ))}
    </Act>
  );
}

/**
 * Act two: one of them needs you.
 *
 * Sam's card lifts — raised shadow, accent ring — while the other two dim and
 * settle back. Then a rail draws down and the evidence appears beneath it.
 *
 * The evidence is `evidenceLabel` from the insights section, and it matters
 * that it reads "no recorded reply" rather than "you forgot": the accuracy
 * rules in the content are explicit that the platform cannot see every
 * channel, and the animation must not overclaim where the copy does not.
 */
function Notice({ reduced }: { reduced: boolean }) {
  return (
    <Act reduced={reduced}>
      {INBOX.map(cap => {
        const lead = cap.id === 'cap.enquiries';

        return (
          <motion.div
            key={cap.id}
            initial={false}
            animate={
              lead
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 0.45, scale: 0.985, y: 0 }
            }
            transition={reduced ? { duration: 0 } : SPRING}
            className={[
              'rounded-2xl border px-4 py-3.5',
              lead
                ? 'border-accent bg-surface shadow-[0_18px_40px_-22px_rgb(var(--ink)/0.35)] ring-1 ring-accent/30'
                : 'border-line bg-surface',
            ].join(' ')}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[12.5px] font-semibold text-ink-3">{cap.object.kind}</div>
                <div className="font-display text-[19px] font-semibold tracking-[-0.02em]">
                  {cap.object.value}
                </div>
              </div>

              {lead ? (
                <motion.span
                  initial={reduced ? false : { opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={reduced ? { duration: 0 } : { ...SPRING, delay: 0.18 }}
                  className="flex-none rounded-full bg-accent-soft px-2.5 py-1 text-[12px] font-bold text-accent"
                >
                  Needs you
                </motion.span>
              ) : null}
            </div>

            {lead ? (
              <div className="mt-3 flex gap-3">
                {/* The rail draws downward, which is what makes the evidence
                    read as derived FROM the card rather than placed beside it. */}
                <motion.span
                  aria-hidden="true"
                  className="mt-1 w-0.5 flex-none rounded bg-accent/40"
                  initial={reduced ? false : { scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  style={{ originY: 0 }}
                  transition={reduced ? { duration: 0 } : { duration: 0.32, delay: 0.2, ease: 'easeOut' }}
                />
                <motion.div
                  initial={reduced ? false : { opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={reduced ? { duration: 0 } : { duration: 0.28, delay: 0.42 }}
                >
                  <p className="text-[14.5px] font-semibold">{LEAD.priority}</p>
                  <p className="mt-0.5 text-[13px] text-ink-3">
                    {LEAD.detail?.evidenceLabel ?? LEAD.evidence}
                  </p>
                </motion.div>
              </div>
            ) : null}
          </motion.div>
        );
      })}
    </Act>
  );
}

/**
 * Act three: the draft, typed, and the window to stop it.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THIS USED TO SHOW AN APPROVE BUTTON, AND THAT WAS NOT WHAT HAPPENS
 *
 * The platform does not draft a reply and wait to be approved.
 * `reply_to_enquiries` is keyed on `lead_autosend_enabled`: the reply is
 * queued and a drain sends it FIFTEEN MINUTES LATER. `pending` in
 * `lead_responses` means awaiting send, not awaiting approval — the repository
 * says so in as many words. The fifteen minutes exists so the owner can change
 * or cancel it (`cancelPending`, `skip_reason: 'cancelled_by_owner'`).
 *
 * So the control is not Approve. It is a countdown with two ways out, which is
 * both true and the better story: help that does not need watching, with the
 * brakes still under your foot.
 *
 * AND IT DOES NOT WRITE THE MESSAGE EITHER.
 *
 * `buildLeadReplyCandidates` attaches a booking link to each active service,
 * plus an "Everything we offer" catch-all. There is no composition. So the
 * stage types one short line and then reveals the LINKS, which is what the
 * recipient actually gets — and a demo that typed out a thoughtful paragraph
 * would be showing a feature nobody built.
 */
function Approve({
  reduced,
  onApprove,
  onCancel,
}: {
  reduced: boolean;
  onApprove: () => void;
  onCancel: () => void;
}) {
  const full = PANEL.draftReply;
  const [typed, setTyped] = useState(() => (reduced ? full : ''));
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (reduced) {
      setTyped(full);
      return;
    }

    setTyped('');
    let i = 0;
    /* Three characters a tick: fast enough not to test anybody's patience,
       slow enough to read as composition. */
    timer.current = setInterval(() => {
      i = Math.min(i + 3, full.length);
      setTyped(full.slice(0, i));
      if (i >= full.length && timer.current) clearInterval(timer.current);
    }, 16);

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [full, reduced]);

  const done = typed.length >= full.length;

  return (
    <Act reduced={reduced}>
      <div className="rounded-2xl border border-line bg-surface px-4 py-3.5">
        <div className="flex items-baseline justify-between gap-3">
          <div className="text-[12.5px] font-semibold text-ink-3">Reply to Sam</div>
          {/* The real mechanism, stated. Not "awaiting your approval". */}
          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: done ? 1 : 0 }}
            transition={{ duration: reduced ? 0 : 0.3 }}
            className="text-[12.5px] font-semibold text-accent"
          >
            Sending in 15 minutes
          </motion.div>
        </div>

        <p className="mt-1.5 text-[15px] leading-[1.5]">
          {typed}
          {!done ? (
            <motion.span
              aria-hidden="true"
              className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[2px] bg-accent"
              animate={{ opacity: [1, 0.15, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
          ) : null}
        </p>

        {/*
          * The booking links, revealed once the line has typed. These ARE the
          * message — the platform attaches one per service plus a catch-all,
          * and composes no prose of its own.
          */}
        <div className="mt-2.5 flex min-h-[64px] flex-wrap gap-1.5">
          <AnimatePresence>
            {done
              ? OFFERED.map((label, i) => (
                  <motion.span
                    key={label}
                    initial={reduced ? false : { opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={reduced ? { duration: 0 } : { ...SPRING, delay: 0.05 * i }}
                    className="rounded-lg border border-line-2 bg-canvas px-3 py-1.5 text-[13px] font-semibold text-accent"
                  >
                    {label}
                  </motion.span>
                ))
              : null}
          </AnimatePresence>
        </div>

        {/*
          * Two ways out, because the owner genuinely has two. Letting it send
          * is the default path — it is what happens if they do nothing — so it
          * is the filled button; cancelling is the deliberate act.
          */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: done ? 1 : 0.5, y: 0 }}
          transition={reduced ? { duration: 0 } : { ...SPRING, delay: 0.1 }}
          className="mt-3 flex flex-col gap-2 sm:flex-row"
        >
          <motion.button
            type="button"
            onClick={onApprove}
            whileHover={reduced ? undefined : { scale: 1.015 }}
            whileTap={reduced ? undefined : { scale: 0.985 }}
            className="flex-1 rounded-xl bg-ink px-5 py-3 text-[15px] font-semibold text-canvas transition-colors hover:bg-accent hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Let it send
          </motion.button>
          <motion.button
            type="button"
            onClick={onCancel}
            whileHover={reduced ? undefined : { scale: 1.015 }}
            whileTap={reduced ? undefined : { scale: 0.985 }}
            className="rounded-xl border border-line-2 px-5 py-3 text-[15px] font-semibold text-ink-2 transition-colors hover:border-ink hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Cancel this one
          </motion.button>
        </motion.div>

        <p className="mt-2 text-center text-[12.5px] text-ink-3">
          Nothing is sent. This is an example.
        </p>
      </div>
    </Act>
  );
}

/**
 * What the decision produced — either ending.
 *
 * Cancelling is not a failure state and is not styled as one. It is the
 * feature: the fifteen-minute window exists so an owner can stop a reply, and
 * a demo that only ever shows the happy path quietly teaches that the brakes
 * are decorative.
 *
 * `role="status"` with `aria-live="polite"` announces the outcome once, not
 * once per beat — the content's rule about not announcing decorative changes.
 */
function Receipt({ reduced, outcome }: { reduced: boolean; outcome: 'sent' | 'cancelled' }) {
  const sent = outcome === 'sent';

  const beats = sent
    ? PANEL.activityReceipt.split('\u2192').map(b => b.trim())
    : [
        "Sam's inquiry",
        'Reply written',
        'You cancelled it',
        'Nothing was sent',
      ];

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduced ? 0 : 0.2 }}
      role="status"
      aria-live="polite"
      className="grid gap-2"
    >
      {beats.map((beat, i) => {
        /* The last beat of a cancellation is the thing that did NOT happen, so
           it gets a neutral mark rather than a green tick. */
        const stopped = !sent && i >= beats.length - 2;

        return (
          <motion.div
            key={beat}
            initial={reduced ? false : { opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={reduced ? { duration: 0 } : { ...SPRING, delay: 0.1 + 0.12 * i }}
            className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 text-[15px] font-semibold"
          >
            <motion.span
              aria-hidden="true"
              className={[
                'grid h-[22px] w-[22px] flex-none place-items-center rounded-full',
                stopped ? 'bg-ink-3' : 'bg-pos',
              ].join(' ')}
              initial={reduced ? false : { scale: 0.4 }}
              animate={{ scale: 1 }}
              transition={reduced ? { duration: 0 } : { ...SPRING, delay: 0.16 + 0.12 * i }}
            >
              {stopped ? (
                <svg viewBox="0 0 24 24" className="w-3 fill-none stroke-white stroke-[3]" strokeLinecap="round">
                  <path d="M7 12h10" />
                </svg>
              ) : (
                <Check className="w-3 stroke-white" />
              )}
            </motion.span>
            {beat}
          </motion.div>
        );
      })}

      <motion.p
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : 0.1 + 0.12 * beats.length }}
        className={`mt-1 text-[14.5px] font-semibold ${sent ? 'text-pos' : 'text-ink-2'}`}
      >
        {sent ? PANEL.completedState : 'Example complete · You stopped it in time'}
      </motion.p>
    </motion.div>
  );
}
