# Email Templates

> **Last Updated**: 2026-11-16

## Overview

The HTML bodies of the Supabase Auth emails, kept here so they are reviewable and
version controlled. **They are not read from this folder at runtime.** Supabase stores
the live copy, so a change here is not a change to what users receive until it is
pasted into the dashboard.

| File | Dashboard location | Subject line |
|---|---|---|
| `reset-password.html` | Authentication → Emails → **Reset Password** | `Reset your AgentsPilot password` |
| `confirm-signup.html` | Authentication → Emails → **Confirm signup** | `Confirm your email address` |
| `change-email.html` | Authentication → Emails → **Change email address** | `Confirm your new email address` |

Both share one design: the night header band with the wordmark, a card, the orange button
with dark ink, the same footer, and the same dark-mode block. A change to one is usually a
change to both.

---

## Applying a change

1. Edit the file here and commit it, so the repo stays the source of the design.
2. Paste the whole file into the matching template body in the Supabase dashboard,
   and set the subject line from the table above.
3. Send one real email to yourself and open it, in Gmail and on a phone. A template
   that renders in a browser can still break in a mail client.

---

## Things that will bite

**The logo is served from the marketing site.** Both templates point at
`https://agentspilot-marketing.vercel.app/images/brand/wordmark-dark.png`. Mail clients
cannot resolve a relative path, so it has to be absolute. **If the site moves to a custom
domain, this URL has to be updated here and in the dashboard**, or the logo silently
breaks in every email already sent and every one after it. The `alt="AgentsPilot"` text is
what shows while images are blocked, which is the default in several clients.

**The button text is dark ink, not white.** White on the brand orange measures 2.68:1 and
fails WCAG AA. Dark ink `#0f222b` on it is 6.11:1. This matches the site's own buttons.

**`{{ .ConfirmationURL }}` must stay.** It carries the one-time token *and* honours the
`redirectTo` that the login page passes per request, which is what lands the user on the
marketing site's `/reset-password`. Rewriting the link as `{{ .SiteURL }}/reset-password`
would send people to the **app's** origin instead, because the project's Site URL is the
app, and that page does not read a `token_hash` from the query.

**One email-change template is read by two different people.** With Supabase's Secure
email change setting on (the default), the same body is sent to the OLD address and the
NEW one, and both have to be confirmed. The copy therefore never says who it was sent to,
and the closing note says "if this reached both addresses, confirm it from each" rather
than asserting that it did. `{{ .NewEmail }}` only resolves in this template.

The security line is a fact about the app, not a formality: `app/api/user/change-email/route.ts`
verifies the current password before calling `updateUser({ email })`, so a change nobody
asked for means someone has that password. Hence "sign in and change yours". That route
also passes no `emailRedirectTo`, so the confirmation link lands on the project's Site URL,
which is currently the app, not the marketing site. If a dedicated landing page is ever
wanted for this, the route is where to add it.

**The claims in these emails come from `lib/marketing/content.json`, not from memory.**
That file carries the approved copy *and* a `corrections` array recording each claim that
was checked against the code and rewritten, plus `releaseGates` for claims that are not
evidenced yet. Three of them shaped `confirm-signup.html`:

- The morning brief list (today's appointments, who has not returned intake, who has not
  paid, what money landed) is the one from `BriefingFactsService`, which the corrections
  array evidences. Keep it specific to those, and do not add to it from imagination.
- `gate.learns` is **UNVERIFIED**, so the email does not say AgentsPilot learns how you
  work. The delegation line uses the approved fallback phrasing instead.
- `gate.pricing` is **BLOCKED**, so no price, plan or allowance appears in any email.

The previous version of this template promised "Build intelligent AI agents with simple
prompts", "Schedule tasks and let AI handle the rest", and integrations with Gmail, Notion
and Slack. That is the old agent-builder positioning, and the signup confirmation was the
first thing a new account ever read. **If a claim is not in `content.json`, it does not go
in an email.**

**"The link works for one hour" in `reset-password.html` is a reading of the dashboard
setting**, Authentication → Email OTP Expiration, whose default is 3600 seconds. If that
setting is changed, the sentence becomes wrong and has to change with it. The confirm
email deliberately says only that the link can be used once, because the signup link's
expiry is commonly set much longer.

**Dark mode is handled by a `<style>` block, which is why the file is a whole HTML
document** rather than a fragment. A mail client cannot be given a stylesheet any other
way, and `@media (prefers-color-scheme: dark)` has to live somewhere. Two rules follow
from that:

- **Every colour in the dark block is also written inline on the element.** Several
  clients strip `<style>` entirely; they then show the light design, intact. The block
  only ever overrides a colour that is already set inline, so nothing depends on it.
- **Outlook.com ignores `prefers-color-scheme`** and rewrites the document instead,
  stamping `data-ogsc` on it. The same rules are repeated under `[data-ogsc]` selectors.
  Editing one copy and not the other is how this drifts.

Checked by rendering at `prefers-color-scheme: dark`, and again with the logo request
blocked, which is the case below.

**Images are blocked by default in Outlook and in Gmail for an unknown sender**, so the
`alt` text is what most first-time recipients actually see. It carries `color`,
`font-size`, `font-weight` and `letter-spacing` on the `<img>` itself, because that is
what alt text inherits. Without them it renders near-black on the near-black band and the
header reads as empty. **The Supabase dashboard preview also blocks the image**, so the
logo showing as alt text in that pane is the preview sandbox, not a broken URL.

**`supported-color-schemes` will be flagged as an unknown property by editors.** It is a
mail-client property, not a web one, and Apple Mail reads it. Leave it.

**On the built-in email sender, Supabase appends its own footer** to whatever is here
("You're receiving this email because you signed up for an application powered by
Supabase", plus an opt-out link). Nothing in the template can remove it. It goes away when
a custom SMTP sender is configured, which is also what lifts the 2 emails per hour limit.

---

## Change History

| Date | Change | Details |
|---|---|---|
| 2026-11-16 | Added `reset-password.html` | Replaced the Supabase default body (an `<h2>` and a bare link) with the AgentsPilot template |
| 2026-11-16 | Added `change-email.html` | Rebuilt the change-email confirmation on the same design, with the old and new addresses shown and a security note tied to the password check in the change-email route |
| 2026-11-16 | Added `confirm-signup.html` | Rebuilt the confirm-signup email on the same design, and replaced the old agent-builder claims with copy grounded in `content.json` |
| 2026-11-16 | Dark mode and blocked-image fallback | Added the `prefers-color-scheme` and `[data-ogsc]` overrides, and styled the logo's alt text so the header still reads when images are blocked |
