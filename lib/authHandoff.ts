/**
 * Handing a completed sign-in to the app, without putting a credential in a URL.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHAT THIS REPLACES
 *
 * Three places here used to send people to the app like this:
 *
 *   `${mainAppUrl}/onboarding-chat#access_token=…&refresh_token=…`
 *
 * The refresh token is a long-lived credential. A fragment is never sent to a
 * server, but it IS written into browser history — and the app's session
 * handler, which was mounted on every page, would adopt an `access_token` from
 * any url it appeared in. So returning to that history entry re-established the
 * session, and someone who had just signed out could be signed back in by a
 * Back button.
 *
 * Now: the access token goes to the app in an Authorization HEADER, the app
 * returns a code that is good for sixty seconds and one use, and the person is
 * sent to `/auth/handoff?code=…`. Replaying that url does nothing.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { Session } from '@supabase/supabase-js';

export function mainAppUrl(): string {
  return (process.env.NEXT_PUBLIC_MAIN_APP_URL || 'http://localhost:3000').replace(/\/+$/, '');
}

/**
 * Send this signed-in person to the app.
 *
 * Navigates and never returns. On any failure it falls back to the old fragment
 * handoff rather than stranding someone who has just successfully signed in:
 * the app still accepts it during the rollout window, and a person who typed
 * the right password should end up inside, not on an error.
 */
export async function handOffToApp(session: Session | null | undefined): Promise<void> {
  const app = mainAppUrl();

  if (!session?.access_token || !session.refresh_token) {
    window.location.href = `${app}/onboarding-chat`;
    return;
  }

  try {
    const response = await fetch(`${app}/api/auth/handoff`, {
      method: 'POST',
      headers: {
        // A header, not a url: it reaches no history, no referrer and no log.
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      // The account is taken from the verified token on the other side. Sending
      // a user id here would let a caller mint a sign-in for somebody else.
      body: '{}',
    });

    const payload = await response.json().catch(() => null);

    if (response.ok && payload?.success && payload.code) {
      window.location.href = `${app}/auth/handoff?code=${encodeURIComponent(payload.code)}`;
      return;
    }
  } catch {
    // Fall through to the legacy path below.
  }

  /*
   * LEGACY FALLBACK — remove once the app has been on the code flow long
   * enough. It is here so that a deploy skew between the two applications
   * cannot lock anybody out mid sign-in.
   */
  window.location.href =
    `${app}/onboarding-chat#access_token=${session.access_token}&refresh_token=${session.refresh_token}`;
}
