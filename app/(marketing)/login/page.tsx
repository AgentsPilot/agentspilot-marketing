'use client';

import { useState } from 'react';
import { handOffToApp } from '@/lib/authHandoff';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail } from 'lucide-react';

export default function LoginPage() {
  /*
   * No `router` here on purpose: nothing in this page calls it. Sign-in hands
   * the session over with a hard navigation (see the auth flow), so a client
   * push would race it. Restored only if a client-side redirect is wanted.
   */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password states
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotError, setForgotError] = useState('');

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
      }
      // If successful, user will be redirected to Google OAuth flow
    } catch {
      setErrorMessage('Failed to sign in with Google. Please try again.');
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setErrorMessage(loginError.message);

        // AUDIT TRAIL: Log failed login attempt
        try {
          await fetch('/api/audit/log', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': 'anonymous' // No user ID for failed login
            },
            body: JSON.stringify({
              action: 'USER_LOGIN_FAILED',
              entityType: 'user',
              entityId: null,
              userId: null,
              resourceName: email,
              details: {
                email,
                error: loginError.message,
                timestamp: new Date().toISOString()
              },
              severity: 'warning',
              complianceFlags: ['SOC2']
            })
          });
        } catch (auditError) {
          console.error('Audit logging failed (non-critical):', auditError);
        }
      } else {
        // AUDIT TRAIL: Log successful login
        try {
          await fetch('/api/audit/log', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-user-id': data.user?.id || ''
            },
            body: JSON.stringify({
              action: 'USER_LOGIN',
              entityType: 'user',
              entityId: data.user?.id,
              userId: data.user?.id,
              resourceName: data.user?.email || email,
              details: {
                email: data.user?.email,
                timestamp: new Date().toISOString(),
                login_method: 'password'
              },
              severity: 'info',
              complianceFlags: ['SOC2']
            })
          });
        } catch (auditError) {
          console.error('Audit logging failed (non-critical):', auditError);
        }

        /*
         * One destination, and the app decides where it leads.
         *
         * This branched on `user_metadata.onboarding_completed` and sent people
         * to one of two routes. Both were wrong:
         *
         *   `/onboarding`     does not exist in the app — the routes are
         *                     `/onboarding-chat` and `/onboarding-build`
         *   `/v2/dashboard`   exists, and is the OLD interface. Business OS is
         *                     at `/business-os`, and nothing sent anyone there,
         *                     which is why signing in landed you in V2.
         *
         * `/onboarding-chat` settles it on arrival: it reads
         * `business_profiles.onboarding_completed` and pushes an existing
         * business straight to `/business-os`. That is also the trustworthy
         * source — `user_metadata` is a copy that nothing keeps in step, so a
         * user who finished onboarding could still be told they had not.
         */
        // Hands the session over as a single-use code rather than putting
        // the refresh token in the url. See `lib/authHandoff`.
        await handOffToApp(data.session);
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setForgotError(error.message);
      } else {
        setForgotSuccess('Password reset link sent to your email.');
        setTimeout(() => {
          setIsForgotOpen(false);
          setForgotEmail('');
          setForgotSuccess('');
        }, 2000);
      }
    } catch {
      setForgotError('Something went wrong. Please try again.');
    }
  };

  return (
    <>
      {/*
        * `overflow-hidden`: the form card animates in from `x: 40`, which on a
        * 390px phone puts it 24px past the right edge for the length of the
        * animation. Measured in headless Chromium at 390x844: the document
        * scrollWidth was 414 against a 390 clientWidth, so the page could be
        * dragged sideways while it settled. Clipping the section costs nothing
        * (nothing here is sticky, and it has no vertical overflow) and is the
        * same guard the homepage hero already uses.
        */}
      <section className="relative overflow-hidden px-4 pb-16 pt-14 md:pb-24 md:pt-20 bg-canvas">
        {/*
          * Words on the left, the form on the right.
          *
          * This page used to carry a two-line hero, three feature blocks with
          * icons and a four-item list beside the box — a landing page wrapped
          * around a form. Somebody arriving here has mostly decided, so the
          * left column says one thing and stops. The argument lives on the
          * homepage, one click away.
          */}
        <div className="mx-auto grid w-full max-w-shell items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
          <div className="max-w-[26rem]">
            <h1 className="font-display text-[clamp(30px,4vw,44px)] font-semibold leading-[1.08] tracking-[-0.035em] text-ink">
              Welcome back
            </h1>
            <p className="mt-4 text-[17px] leading-[1.55] text-ink-2">Your work kept going while you were away.</p>
            <p className="mt-5 text-[15px] font-medium text-ink-3">Sign in to see what got done.</p>
          </div>

          <div>
            {/* Right Column - Login Form */}
            {/*
              * A plain div with a CSS entrance, NOT `motion.div`.
              *
              * `initial={{ opacity: 0 }}` is server-rendered as an inline
              * `opacity:0`, so the form was invisible until framer-motion
              * hydrated, and stayed invisible if the bundle never arrived.
              * See `.rise-in` in globals.css. It also respects
              * prefers-reduced-motion, which the motion version did not.
              */}
            <div className="rise-in">
              <div className="bg-surface backdrop-blur-xl border border-line p-6 md:p-8 h-full rounded-[22px]">
                <form onSubmit={handleLogin} className="space-y-6">
                  {/* Error Message */}
                  {errorMessage && (
                    <div className="bg-red-50 border border-red-200 p-3 rounded-xl">
                      <p className="text-red-600 text-sm">{errorMessage}</p>
                    </div>
                  )}

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-ink-2 block">
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 bg-sunk border border-line-2 text-ink placeholder-ink-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 rounded-xl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-ink-2 block">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Your password"
                        className="w-full px-4 py-3 bg-sunk border border-line-2 text-ink placeholder-ink-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 pr-12 rounded-xl"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                      {/*
                        * `aria-label` + `aria-pressed`: this button had no
                        * accessible name at all, so a screen reader announced
                        * "button" and nothing else. The label also has to say
                        * what the NEXT tap does, which is why it flips.
                        *
                        * `px-4` rather than `pr-4` widens the hit area from
                        * 36px to 52px. On a phone this control sits a thumb's
                        * width from the field's own tap area, and a narrow
                        * target here means tapping the eye and getting the
                        * keyboard instead.
                        */}
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center px-4"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        aria-pressed={showPassword}
                      >
                        <svg className="w-5 h-5 text-ink-2 hover:text-ink transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                  {/* Forgot Password Link */}
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setIsForgotOpen(true)}
                      className="inline-flex min-h-11 items-center px-1 text-sm text-ink-2 transition-colors duration-200 hover:text-accent"
                    >
                      Forgotten your password?
                    </button>
                  </div>

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed font-bold text-white py-4 px-6 transition-all duration-300 hover:shadow-lg hover:shadow-accent/25 flex items-center justify-center gap-2 rounded-xl"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-ink border-t-transparent rounded-full animate-spin"></div>
                        Signing you in…
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        Sign in
                      </>
                    )}
                  </button>

                  {/* Divider */}
                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-line"></div>
                    <span className="flex-shrink mx-4 text-ink-2 text-sm">or continue with</span>
                    <div className="flex-grow border-t border-line"></div>
                  </div>

                  {/* Google Sign In Button */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="w-full bg-sunk hover:bg-line-2 border border-line-2 hover:border-line-2 text-ink font-semibold py-3 px-4 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Info Section */}
      <section className="relative py-12 px-4 bg-canvas border-t border-line">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="text-center space-y-4">
            <p className="text-ink-2 text-sm">
              Don’t have an account?{' '}
              <Link href="/signup" className="text-accent hover:text-accent font-bold transition-colors">
                Sign up here
              </Link>
            </p>
            <p className="text-ink-3 text-xs">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="text-ink-2 hover:text-ink transition-colors">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-ink-2 hover:text-ink transition-colors">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Forgot Password Modal */}
      {isForgotOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-night/70 backdrop-blur-sm flex items-center justify-center z-50 px-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md w-full"
          >
            <div className="bg-surface border border-line p-6 rounded-[22px]">
              <h2 className="text-2xl font-bold text-ink mb-6">Reset your password</h2>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-sunk border border-line-2 text-ink placeholder-ink-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent rounded-xl"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
                {forgotSuccess && (
                  <p className="text-pos text-sm bg-pos-soft border border-pos/30 p-3 rounded-xl">
                    {forgotSuccess}
                  </p>
                )}
                {forgotError && (
                  <p className="text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded-xl">
                    {forgotError}
                  </p>
                )}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotOpen(false)}
                    className="flex-1 px-4 py-3 bg-sunk hover:bg-line-2 text-ink font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-accent hover:bg-accent-hover text-white font-semibold transition-all shadow-lg hover:shadow-xl rounded-xl"
                  >
                    Send Link
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
