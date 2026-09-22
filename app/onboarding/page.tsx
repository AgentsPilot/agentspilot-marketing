// Marketing site onboarding redirect
// Immediately redirects users to main app for onboarding
// The full onboarding flow lives in neuronforge (main app)

'use client';

import { useEffect } from 'react';
import { handOffToApp } from '@/lib/authHandoff';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function OnboardingRedirect() {
  const router = useRouter();

  useEffect(() => {
    const redirectToMainApp = async () => {
      try {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
          console.error('No session found, redirecting to login');
          router.push('/login');
          return;
        }

        // Redirect to main app onboarding with session tokens.
        // `/onboarding-chat`, not `/onboarding`: the latter is not a route in
        // the app. It also settles where to go next — an existing business is
        // pushed straight on to `/business-os`.
        // Hands the session over as a single-use code rather than putting
        // the refresh token in the url. See `lib/authHandoff`.
        await handOffToApp(session);
      } catch (err) {
        console.error('Error during redirect:', err);
        router.push('/login');
      }
    };

    redirectToMainApp();
  }, [router]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4"></div>
        <p className="text-slate-300">Redirecting to setup...</p>
      </div>
    </div>
  );
}