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
 *
 * AND THERE IS NO LONGER A WAY BACK TO THE OLD SHAPE. A fallback to the
 * fragment survived here for the rollout, which meant the url above was still
 * reachable — on any transient failure, which in practice is the app being
 * cold. It is gone; see `handOffToApp` below for what replaced it.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import type { Session } from '@supabase/supabase-js';

export function mainAppUrl(): string {
  return (process.env.NEXT_PUBLIC_MAIN_APP_URL || 'http://localhost:3000').replace(/\/+$/, '');
}

/** How many times to ask for a code before giving up, and how long between. */
const ATTEMPT_DELAYS_MS = [0, 400, 1200, 3000];

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Ask the app for a one-time code, retrying a transient failure.
 *
 * Returns the code, or null once the attempts are spent.
 *
 * RETRIED BECAUSE THE OBSERVED FAILURE IS A COLD SERVER, not a refusal. A 401
 * or a 403 means this token is not good enough and asking again cannot change
 * that, so those stop immediately; anything else — the app still booting, a
 * dropped connection, a 500 — is worth another go a moment later.
 */
async function requestCode(app: string, accessToken: string): Promise<string | null> {
  for (const delay of ATTEMPT_DELAYS_MS) {
    if (delay) await wait(delay);

    try {
      const response = await fetch(`${app}/api/auth/handoff`, {
        method: 'POST',
        headers: {
          // A header, not a url: it reaches no history, no referrer and no log.
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        // The account is taken from the verified token on the other side.
        // Sending a user id here would let a caller mint a sign-in for
        // somebody else.
        body: '{}',
      });

      const payload = await response.json().catch(() => null);

      if (response.ok && payload?.success && payload.code) {
        return payload.code as string;
      }

      /* A verdict on the credential. Retrying asks the same question again. */
      if (response.status === 401 || response.status === 403) return null;
    } catch {
      /* Network-level: the app may simply not be listening yet. Try again. */
    }
  }

  return null;
}

/**
 * Send this signed-in person to the app.
 *
 * Navigates and never returns.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHAT THE FALLBACK USED TO BE, AND WHY IT IS GONE
 *
 * Any failure here used to fall back to the old fragment handoff:
 *
 *   `${app}/onboarding-chat#access_token=…&refresh_token=…`
 *
 * It was written so that a deploy skew between the two applications could not
 * lock anybody out mid sign-in, and it was meant to be removed once the code
 * flow had been live long enough. It has been, on both sides, since 12 Oct.
 *
 * What remained was a path that put a long-lived refresh token into a url on
 * every TRANSIENT failure — and the one that actually happens is the app being
 * cold, which locally means every restart. The header at the top of this file
 * sets out the cost: a fragment is written into browser history, and returning
 * to that entry re-established the session, so someone who had just signed out
 * could be signed back in with the Back button.
 *
 * It was also solving the wrong problem. A cold server answers a moment later,
 * which a retry handles and a credential in a url does not.
 *
 * WHERE A REAL FAILURE GOES. Not `/onboarding-chat`: with no session that page
 * starts a FRESH onboarding conversation, which for somebody who finished
 * onboarding months ago is worse than an error. `/auth/handoff` with no code
 * is already defined on the other side — it bounces to the marketing login
 * with `?error=no_session` — so a failure lands on a page that says so.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export async function handOffToApp(session: Session | null | undefined): Promise<void> {
  const app = mainAppUrl();

  /* No credential to exchange: the same honest dead end as a spent one. */
  if (!session?.access_token || !session.refresh_token) {
    window.location.href = `${app}/auth/handoff`;
    return;
  }

  const code = await requestCode(app, session.access_token);

  window.location.href = code
    ? `${app}/auth/handoff?code=${encodeURIComponent(code)}`
    : `${app}/auth/handoff`;
}
