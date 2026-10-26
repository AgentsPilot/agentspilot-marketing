'use client';

import { useState } from 'react';
import { Section, Shell, Tag, Heading, Lede, Check } from './primitives';

/**
 * Get in touch, on the homepage.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE FORM IS THE SAME ONE, POSTING TO THE SAME PLACE
 *
 * `/api/contact` is unchanged and still receives `{ name, email, subject,
 * message }`. Only the page around it went: a separate route for four fields
 * made somebody navigate away from the thing that persuaded them.
 *
 * The 1,000-character limit is carried over from the old page because the API
 * enforces it — dropping it here would just move the rejection from a hint
 * under the box to an error after a submit.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHAT WAS DROPPED, AND WHY
 *
 * "New York, NY · Serving customers worldwide" and "We typically respond
 * within 24 hours". The first is a location with nothing to do, and the second
 * is a promise nobody here can keep on a given Tuesday. A reply time we cannot
 * honour costs more than it buys.
 */
export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.message.length > 1000) {
      setError('That message is a bit long. Could you keep it under 1,000 characters?');
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'We could not send that.');

      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  }

  const field =
    'w-full rounded-xl border border-line-2 bg-canvas px-4 py-3 text-[16px] text-ink placeholder-ink-3 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30';

  return (
    <Section id="talk-to-us" tone="canvas">
      <Shell className="grid gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,6fr)] lg:gap-20">
        <div>
          <Tag>Talk to us</Tag>
          <Heading className="mt-[22px]">{'Got a question?\nAsk us.'}</Heading>
          <Lede className="mt-6 text-ink-2">
            Tell us what you do and what keeps getting away from you. A person reads these.
          </Lede>
        </div>

        <div className="rounded-[22px] border border-line bg-surface p-6 md:p-8">
          {sent ? (
            /* The whole form is replaced, not hidden under a banner: there is
               nothing left to do here, and leaving the fields invites a second
               send of the same message. */
            <div role="status" aria-live="polite" className="py-6 text-center">
              <span
                aria-hidden="true"
                className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-pos-soft"
              >
                <Check className="w-5 stroke-pos" />
              </span>
              <h3 className="mt-4 font-display text-xl font-semibold tracking-[-0.02em]">
                Thanks, that is with us.
              </h3>
              <p className="mt-2 text-[15px] text-ink-2">We will get back to you by email.</p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-5 text-[14.5px] font-semibold text-accent hover:underline"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[13.5px] font-semibold">Your name</span>
                  <input required value={form.name} onChange={set('name')} className={field} placeholder="Your name" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[13.5px] font-semibold">Email</span>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    className={field}
                    placeholder="you@example.com"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-[13.5px] font-semibold">What is it about?</span>
                <input
                  required
                  value={form.subject}
                  onChange={set('subject')}
                  className={field}
                  placeholder="What can we help you with?"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[13.5px] font-semibold">Your message</span>
                <textarea
                  required
                  rows={5}
                  maxLength={1000}
                  value={form.message}
                  onChange={set('message')}
                  className={`${field} resize-y`}
                  placeholder="Tell us what you do, and what keeps getting away from you."
                />
                <span className="mt-1.5 block text-right text-[12.5px] text-ink-3">
                  {form.message.length} / 1,000
                </span>
              </label>

              {error ? (
                <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-[14.5px] text-red-600">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={sending}
                className="rounded-xl bg-ink px-5 py-3.5 text-[15px] font-semibold text-canvas transition-colors hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}
        </div>
      </Shell>
    </Section>
  );
}
