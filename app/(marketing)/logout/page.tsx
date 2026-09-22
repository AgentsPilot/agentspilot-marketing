'use client';

/**
 * Sign out, on THIS origin.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHY A WHOLE PAGE EXISTS JUST TO SIGN OUT.
 *
 * The platform and this site are two applications on two origins, and browser
 * storage is per-origin. So when someone signs out in the platform, it clears
 * its own copy of the Supabase session and cannot touch the copy held here.
 *
 * A global sign-out does revoke the refresh token server-side, but `getSession()`
 * on this origin returns the stored ACCESS token without asking the server, and
 * it stays valid until it expires — up to an hour. `/auth/callback` and
 * `/onboarding` both trust that answer and forward straight back into the
 * platform. So a person who had just signed out could be handed back in.
 *
 * The platform therefore sends people here rather than to `/login`: this clears
 * the session on this origin first, then shows the login form.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function LogoutPage() {
  const router = useRouter();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const signOutHere = async () => {
      try {
        /*
         * `local`, not `global`: the platform already revoked the refresh token
         * everywhere before sending the person here. Asking for a global
         * sign-out again would fail — the token it would authenticate with is
         * the one that was just revoked — and that failure would then be the
         * thing that stopped this origin's storage from being cleared.
         */
        await supabase.auth.signOut({ scope: 'local' });
      } catch {
        /*
         * Deliberately swallowed. Whatever went wrong, this page's job is to
         * leave the person at a sign-in form rather than stranded on a spinner,
         * and `signOut` clears local storage even when the network call fails.
         */
      }

      if (cancelled) return;

      router.replace('/login');
    };

    /*
     * A visible fallback if the redirect never happens — a blank page with no
     * way forward is worse than a link, and this runs at the exact moment a
     * person expects to be logged out.
     */
    const timer = setTimeout(() => {
      if (!cancelled) setFailed(true);
    }, 5000);

    signOutHere();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4" />
        <p className="text-zinc-300">Signing you out…</p>

        {failed && (
          <p className="mt-6 text-sm text-zinc-500">
            Taking longer than expected.{' '}
            <a href="/login" className="text-orange-500 underline">
              Go to sign in
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
