'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Lock } from 'lucide-react';

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

  return (
    <section className="relative py-24 md:py-32 px-4 bg-zinc-900 min-h-[70vh]">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 p-6 md:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-orange-500/20 border border-orange-400/30 flex items-center justify-center">
              <Lock className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Choose a New Password</h1>
              <p className="text-sm text-slate-400">Then sign back in and pick up where you left off.</p>
            </div>
          </div>

          {status === 'checking' && (
            <div className="flex items-center gap-3 text-slate-300 py-6">
              <div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
              Verifying your reset link...
            </div>
          )}

          {status === 'invalid' && (
            <div className="space-y-4 py-2">
              <div className="bg-red-500/10 border border-red-500/30 p-3">
                <p className="text-red-300 text-sm">{errorMessage}</p>
              </div>
              <Link
                href="/login"
                className="block w-full text-center bg-orange-500 hover:bg-orange-600 font-bold text-white py-3 px-6 transition-all duration-300"
              >
                Back to Sign In
              </Link>
            </div>
          )}

          {status === 'ready' && (
            <form onSubmit={handleReset} className="space-y-6">
              {errorMessage && (
                <div className="bg-red-500/10 border border-red-500/30 p-3">
                  <p className="text-red-300 text-sm">{errorMessage}</p>
                </div>
              )}

              {successMessage && (
                <div className="bg-green-500/10 border border-green-500/30 p-3">
                  <p className="text-green-300 text-sm">{successMessage}</p>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-300 block">
                  New Password *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 8 characters"
                    className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 pr-12"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSaving}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSaving}
                  >
                    <svg className="w-5 h-5 text-slate-400 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <label htmlFor="confirm" className="text-sm font-medium text-slate-300 block">
                  Confirm New Password *
                </label>
                <input
                  id="confirm"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter your new password"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  disabled={isSaving}
                />
              </div>

              <button
                type="submit"
                disabled={isSaving || !!successMessage}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-white py-4 px-6 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/25 flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </button>

              <p className="text-center text-sm text-slate-400">
                Remembered it?{' '}
                <Link href="/login" className="text-orange-400 hover:text-orange-300 font-bold transition-colors">
                  Back to sign in
                </Link>
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
