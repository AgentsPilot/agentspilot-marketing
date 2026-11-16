'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

/*
 * Where the recovery email lands.
 *
 * `resetPasswordForEmail` on the login page sends people to
 * `${origin}/reset-password`, and this route is that destination — without it
 * the emailed link 404s on the marketing site.
 *
 * Supabase hands the recovery session over in the URL fragment
 * (`#access_token=...&refresh_token=...&type=recovery`). The browser client has
 * `detectSessionInUrl` on by default and will consume that fragment on its own,
 * so this page does not assume it wins the race: it subscribes to auth changes
 * first, then reads the fragment itself if it is still there. Either path ends
 * with a session, which is what `updateUser({ password })` needs.
 */
type Status = 'checking' | 'ready' | 'invalid';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('checking');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let active = true;

    // The client may have already swallowed the fragment and signed us in.
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active || !session) return;
      setStatus('ready');
      setErrorMessage('');
    });

    const linkExpired = 'This password reset link is invalid or has expired. Request a new one from the login page.';

    (async () => {
      const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));

      const hashError = params.get('error_description') || params.get('error');
      if (hashError) {
        if (!active) return;
        setStatus('invalid');
        setErrorMessage(decodeURIComponent(hashError.replace(/\+/g, ' ')));
        return;
      }

      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        // Keep the token out of the address bar and browser history.
        window.history.replaceState(null, '', window.location.pathname);

        if (!active) return;
        if (error) {
          setStatus('invalid');
          setErrorMessage(linkExpired);
        } else {
          setStatus('ready');
        }
        return;
      }

      // The other shape Supabase sends, when the email template is written with
      // `{{ .TokenHash }}` instead of `{{ .ConfirmationURL }}`.
      const query = new URLSearchParams(window.location.search);
      const tokenHash = query.get('token_hash');

      if (tokenHash) {
        const { error } = await supabase.auth.verifyOtp({ type: 'recovery', token_hash: tokenHash });

        window.history.replaceState(null, '', window.location.pathname);

        if (!active) return;
        if (error) {
          setStatus('invalid');
          setErrorMessage(linkExpired);
        } else {
          setStatus('ready');
        }
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (!active) return;
      if (data.session) {
        setStatus('ready');
      } else {
        setStatus('invalid');
        setErrorMessage(linkExpired);
      }
    })();

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirm) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setErrorMessage(error.message);
        setIsSaving(false);
        return;
      }

      setSuccessMessage('Password updated. Redirecting you to sign in...');

      // The recovery session has served its purpose — sign back in with the new password.
      await supabase.auth.signOut();
      setTimeout(() => router.push('/login'), 2000);
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
      setIsSaving(false);
    }
  };


  /*
   * The page wears the marketing shell, not the old dark one.
   *
   * This route was built against the site as it was before the 2026-10
   * redesign: `bg-zinc-900`, `text-slate-400`, `bg-orange-500`. The site went
   * light and token-driven around it and this page was missed, so someone
   * arriving from the login form crossed from a light page to a dark one in
   * the middle of a single task.
   *
   * Everything here is the login page's own vocabulary: `bg-canvas` ground,
   * one `bg-surface` card on `border-line`, `bg-accent` for the one button
   * that matters, and the same left column that says one thing and stops.
   *
   * `.rise-in` rather than `motion.div`: framer-motion writes `initial` into
   * the server-rendered HTML, so the card shipped as `opacity: 0` and stayed
   * invisible if the bundle never arrived. The CSS entrance paints at first
   * paint and honours prefers-reduced-motion. Same fix the login page carries.
   */
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-14 md:pb-24 md:pt-20 bg-canvas">
      <div className="mx-auto grid w-full max-w-shell items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
        <div className="max-w-[26rem]">
          <h1 className="font-display text-[clamp(30px,4vw,44px)] font-semibold leading-[1.08] tracking-[-0.035em] text-ink">
            Choose a new password
          </h1>
          <p className="mt-4 text-[17px] leading-[1.55] text-ink-2">
            Then sign back in and pick up where you left off.
          </p>
          <p className="mt-5 text-[15px] font-medium text-ink-3">Nothing else about your account changes.</p>
        </div>

        <div>
          <div className="rise-in">
            <div className="bg-surface backdrop-blur-xl border border-line p-6 md:p-8 h-full rounded-[22px]">

              {status === 'checking' && (
                <div className="flex items-center gap-3 py-6 text-ink-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                  Verifying your reset link…
                </div>
              )}

              {status === 'invalid' && (
                <div className="space-y-5 py-2">
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                    <p className="text-sm text-red-600">{errorMessage}</p>
                  </div>
                  <Link
                    href="/login"
                    className="flex w-full items-center justify-center rounded-xl bg-accent px-6 py-4 font-bold text-white transition-all duration-300 hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25"
                  >
                    Back to sign in
                  </Link>
                </div>
              )}

              {status === 'ready' && (
                <form onSubmit={handleReset} className="space-y-6">
                  {errorMessage && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                      <p className="text-sm text-red-600">{errorMessage}</p>
                    </div>
                  )}

                  {successMessage && (
                    <div className="rounded-xl border border-pos/30 bg-pos-soft p-3">
                      <p className="text-sm text-pos">{successMessage}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-ink-2">
                      New password *
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="At least 8 characters"
                        className="w-full rounded-xl border border-line-2 bg-sunk px-4 py-3 pr-12 text-ink placeholder-ink-3 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isSaving}
                      />
                      {/*
                        * `aria-label` + `aria-pressed`, and `px-4` for a 52px
                        * target rather than 36px: the same two fixes the login
                        * page's eye toggle carries, for the same reasons. The
                        * label says what the NEXT tap does.
                        */}
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center px-4"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isSaving}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        aria-pressed={showPassword}
                      >
                        <svg className="h-5 w-5 text-ink-2 transition-colors hover:text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {showPassword ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          ) : (
                            <>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </>
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirm" className="block text-sm font-medium text-ink-2">
                      Confirm new password *
                    </label>
                    <input
                      id="confirm"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Re-enter your new password"
                      className="w-full rounded-xl border border-line-2 bg-sunk px-4 py-3 text-ink placeholder-ink-3 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      disabled={isSaving}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving || !!successMessage}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-4 font-bold text-white transition-all duration-300 hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Updating…
                      </>
                    ) : (
                      'Update password'
                    )}
                  </button>

                  <p className="text-center text-sm text-ink-2">
                    Remembered it?{' '}
                    <Link href="/login" className="font-bold text-accent transition-colors hover:text-accent-hover">
                      Back to sign in
                    </Link>
                  </p>
                </form>
              )}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
