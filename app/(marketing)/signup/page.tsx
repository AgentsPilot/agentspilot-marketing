'use client';

import { useState, useEffect, useRef } from 'react';
import { handOffToApp } from '@/lib/authHandoff';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailCheckLoading, setEmailCheckLoading] = useState(false);
  const emailCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleGoogleSignUp = async () => {
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
      setErrorMessage('Failed to sign up with Google. Please try again.');
      setIsLoading(false);
    }
  };

  // Check if email already exists
  const checkEmailExists = async (emailToCheck: string) => {
    if (!emailToCheck.trim()) return;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailToCheck)) return;

    setEmailCheckLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/check-user-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToCheck })
      });

      if (response.ok) {
        const { exists, onboardingCompleted } = await response.json();

        if (exists) {
          if (onboardingCompleted === true) {
            setErrorMessage('This email is already registered and the account is active. Please login instead.');
          } else if (onboardingCompleted === false) {
            setErrorMessage('This email is already registered. Please login to complete your account setup.');
          } else {
            setErrorMessage('This email is already registered. Please check your email for the confirmation link.');
          }
        }
      }
    } catch (error) {
      console.error('Error checking email:', error);
    } finally {
      setEmailCheckLoading(false);
    }
  };

  // Detect autofill and validate email after a short delay
  useEffect(() => {
    // Clear any existing timeout
    if (emailCheckTimeoutRef.current) {
      clearTimeout(emailCheckTimeoutRef.current);
    }

    // If email is empty, clear errors
    if (!email.trim()) {
      setErrorMessage('');
      return;
    }

    // Validate after 500ms of no changes
    emailCheckTimeoutRef.current = setTimeout(() => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Check if email contains @ (user started typing email)
      if (email.includes('@')) {
        // If format is invalid, show format error
        if (!emailRegex.test(email)) {
          setErrorMessage('Please enter a valid email address');
        } else {
          // Format is valid, check if email exists in database
          checkEmailExists(email);
        }
      }
    }, 500);

    // Cleanup timeout on unmount
    return () => {
      if (emailCheckTimeoutRef.current) {
        clearTimeout(emailCheckTimeoutRef.current);
      }
    };
  }, [email]);

  // Also check on blur for immediate feedback
  const handleEmailBlur = async () => {
    await checkEmailExists(email);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    // Custom validation with friendly messages
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name to continue');
      setIsLoading(false);
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Please enter your email address to continue');
      setIsLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (!password) {
      setErrorMessage('Please create a password to secure your account');
      setIsLoading(false);
      return;
    }

    if (!confirmPassword) {
      setErrorMessage('Please confirm your password');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // Sign up the user with metadata only (no profile creation yet)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            onboarding_completed: false, // Track onboarding status in metadata
          },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/auth/callback`,
        },
      });

      if (error) {

        // Check if user already exists
        if (error.message.includes('already registered') || error.message.includes('already been registered')) {
          // Check onboarding status to provide specific message
          try {
            // Try to get profile by email (need to have email column in profiles or use auth.users view)
            // Since we can’t access auth.users from client, we’ll check via an API endpoint
            const response = await fetch('/api/check-user-status', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email })
            });

            if (response.ok) {
              const { onboardingCompleted } = await response.json();

              if (onboardingCompleted === true) {
                setErrorMessage('This email is already registered and the account is active. Please login instead.');
              } else if (onboardingCompleted === false) {
                setErrorMessage('This email is already registered. Please login to complete your account setup.');
              } else {
                setErrorMessage('This email is already registered. Please login instead.');
              }
            } else {
              setErrorMessage('This email is already registered. Please login instead.');
            }
          } catch (profileError) {
            console.error('Error checking user profile:', profileError);
            setErrorMessage('This email is already registered. Please login instead.');
          }
        } else if (error.message.includes('Email rate limit exceeded')) {
          setErrorMessage('Too many signup attempts. Please try again in a few minutes.');
        } else if (error.message.includes('Invalid email')) {
          setErrorMessage('Please enter a valid email address.');
        } else if (error.message.toLowerCase().includes('password')) {
          setErrorMessage('Password must be at least 6 characters long.');
        } else {
          // User-friendly generic error with actual message
          setErrorMessage(`Signup failed: ${error.message}. Please try again or contact support.`);
        }
        setIsLoading(false);
        return;
      }

      const user = data?.user;
      const session = data?.session;

      // Supabase returns user even for existing emails when confirmation is required
      // Check if this is actually a new signup or existing user
      if (!user) {
        setErrorMessage('Signup failed. Please try again.');
        setIsLoading(false);
        return;
      }

      // When email confirmation is enabled and user already exists:
      // - Supabase returns the user object
      // - But identities array will be empty (no new identity was created)
      // - And there's no session
      const hasIdentities = user.identities && user.identities.length > 0;

      if (!hasIdentities && !session) {
        // Existing user trying to sign up again (no new identity created)
        // The user.id from signup response is NOT the real user ID when user already exists
        // We need to check by email using our API endpoint
        try {
          const response = await fetch('/api/check-user-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });

          if (response.ok) {
            const { exists, onboardingCompleted } = await response.json();

            if (!exists) {
              // User doesn't exist - this shouldn't happen but handle gracefully
              setErrorMessage('A confirmation email was already sent to this address. Please check your email or wait a few minutes to try again.');
            } else if (onboardingCompleted === true) {
              // User completed onboarding - account is active
              setErrorMessage('This email is already registered and the account is active. Please login instead.');
            } else if (onboardingCompleted === false) {
              // Profile exists but onboarding not completed
              setErrorMessage('This email is already registered. Please login to complete your account setup.');
            } else {
              // Profile doesn't exist - user signed up but never confirmed email
              setErrorMessage('A confirmation email was already sent to this address. Please check your email or wait a few minutes to try again.');
            }
          } else {
            console.error('Failed to check user status');
            setErrorMessage('This email is already registered. Please login instead.');
          }
        } catch (error) {
          console.error('Error checking user status:', error);
          setErrorMessage('This email is already registered. Please login instead.');
        }

        setIsLoading(false);
        return;
      }

      // Handle success based on whether email confirmation is required

      if (!session) {
        // Email confirmation required - redirect to home page
        setSuccessMessage(
          'Signup successful! Please check your email to confirm your account.'
        );
        setTimeout(() => router.push('/'), 2000);
      } else {
        // Email confirmation disabled - redirect to main app onboarding.
        // `/onboarding-chat`, not `/onboarding`: the latter is not a route in
        // the app, so this sent every new signup to a 404.
        setSuccessMessage('Account created successfully! Redirecting to setup...');
        setTimeout(() => {
          // A single-use code, not the refresh token in a url. See
          // `lib/authHandoff`.
          void handOffToApp(session);
        }, 1500);
      }
    } catch (error) {
      console.error('Unexpected signup error:', error);
      const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred';
      setErrorMessage(`${errorMsg}. Please try again or contact support.`);
    } finally {
      setIsLoading(false);
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
              Create your account
            </h1>
            <p className="mt-4 text-[17px] leading-[1.55] text-ink-2">Tell us what you do. We set things up around your business.</p>
            <p className="mt-5 text-[15px] font-medium text-ink-3">Free for 14 days. No card needed.</p>
          </div>

          <div>

            {/* Right Column - Signup Form */}
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
              <form onSubmit={handleSignup} className="space-y-4">

                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 p-4 rounded-xl"
                  >
                    <p className="text-red-600 text-sm">{errorMessage}</p>
                  </motion.div>
                )}
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-pos-soft border border-pos/30 p-4 rounded-xl"
                  >
                    <p className="text-pos text-sm">{successMessage}</p>
                  </motion.div>
                )}

                {/* Your name */}
                <div className="space-y-1.5">
                  <label htmlFor="fullName" className="text-sm font-bold text-ink block">
                    Your name <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-sunk border border-line-2 text-ink placeholder-ink-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 rounded-xl"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={isLoading}
                    autoFocus
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-sm font-bold text-ink block">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 bg-sunk border border-line-2 text-ink placeholder-ink-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 rounded-xl"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrorMessage(''); // Clear error when user types
                      }}
                      onBlur={handleEmailBlur}
                      disabled={isLoading || emailCheckLoading}
                    />
                    {emailCheckLoading && (
                      <div className="absolute inset-y-0 right-0 flex items-center px-4">
                        <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-sm font-bold text-ink block">
                    Password <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Your password"
                      className="w-full px-4 py-3 bg-sunk border border-line-2 text-ink placeholder-ink-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 pr-12 rounded-xl"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center px-4"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      aria-pressed={showPassword}
                    >
                      <svg
                        className="w-5 h-5 text-ink-2 hover:text-ink transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {showPassword ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                          />
                        ) : (
                          <>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div className="space-y-1.5">
                  <label htmlFor="confirmPassword" className="text-sm font-bold text-ink block">
                    Confirm password <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Type it again"
                    className="w-full px-4 py-3 bg-sunk border border-line-2 text-ink placeholder-ink-3 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 rounded-xl"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                {/* Signup Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-accent hover:bg-accent-hover disabled:bg-line-2 text-white font-bold py-3 px-4 transition-all duration-200 disabled:cursor-not-allowed rounded-xl"
                >
                  {isLoading ? 'Setting things up…' : 'Create my account'}
                </button>

                {/* Divider */}
                <div className="relative flex items-center py-1">
                  <div className="flex-grow border-t border-line"></div>
                  <span className="flex-shrink mx-4 text-ink-2 text-sm">or continue with</span>
                  <div className="flex-grow border-t border-line"></div>
                </div>

                {/* Google Sign Up Button */}
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
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
                  Sign up with Google
                </button>

                {/* OAuth Info */}
                <div className="text-center">
                  <p className="text-xs text-ink-3">
                    By signing up with Google, you agree to our terms. If you already have an account, you’ll be signed in.
                  </p>
                </div>
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
              Already have an account?{' '}
              <Link href="/login" className="text-accent hover:text-accent font-bold transition-colors">
                Sign in here
              </Link>
            </p>
            <p className="text-ink-3 text-xs">
              By creating an account, you agree to our{' '}
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
    </>
  );
}
