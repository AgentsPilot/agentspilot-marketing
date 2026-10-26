'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/brand/Logo';
import { useEffect, useState } from 'react'
import { X, Menu } from 'lucide-react'

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.success) {
        setMessage({ type: 'success', text: data.message })
        setEmail('')
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to subscribe' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h4 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-brand">
        Never miss updates
      </h4>
      <p className="mt-4 max-w-[30ch] text-[15px] leading-relaxed text-night-ink-2">
        Get tips on handling more and missing less.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-2">
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          className="w-full rounded-lg border border-night-line bg-white/[0.06] px-4 py-3 text-[16px] text-night-ink placeholder-night-ink-2 transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-brand px-4 py-3 text-[15px] font-semibold text-night transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-night disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </button>
        {message && (
          <p
            role="status"
            aria-live="polite"
            className={`text-[13.5px] ${message.type === 'success' ? 'text-pos-bright' : 'text-red-400'}`}
          >
            {message.text}
          </p>
        )}
      </form>
    </div>
  )
}

/*
 * A features mega-menu that nothing renders.
 *
 * Left in place rather than deleted: the `/features` page it points at exists,
 * so this reads as a dropdown that was staged and not finished rather than as
 * a leftover. Deleting it would throw away the link structure somebody wrote.
 *
 * Either wire it into the nav or remove it deliberately — it should not sit
 * here indefinitely as a lint error.
 */
/**
 * The header's own links.
 *
 * Declared once because the desktop pill and the mobile sheet both render them
 * and had drifted into two hand-written copies — four `<Link>`s each, with the
 * hover classes retyped eight times.
 *
 * These are PAGE links, not the homepage's section anchors. The mockup's nav
 * ("Built for you", "See clearly", "Hand it over") only works from the
 * homepage, and this shell wraps nine pages.
 */
/** One footer column. Three hand-written copies had drifted in spacing. */
function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { href: string; label: string }[]
}) {
  return (
    <div>
      {/*
        * The heading is `--brand`, the logo's orange. Safe here because the
        * ground is dark: brand on night is 6.1:1, where on white it is 2.7:1
        * and could not carry text at all.
        */}
      <h4 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-brand">
        {title}
      </h4>
      <ul className="mt-4 space-y-2.5 text-[15px]">
        {links.map(link => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-night-ink-2 transition-colors hover:text-night-ink"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * The header's own links.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THESE ARE SECTIONS NOW, NOT PAGES
 *
 * `/about` and `/contact` were folded into the homepage, so the nav points at
 * anchors on it. Written as `/#id` rather than `#id` on purpose: this shell
 * also wraps `/login` and `/signup`, and a bare `#why-we-built-it` from the
 * login page scrolls to nothing. The leading slash navigates home first.
 *
 * `scrolls` marks the ones that are anchors, because the active-state rule
 * differs: a page link is active when the path matches, while an anchor is
 * never "the current page" — the homepage is.
 */
const NAV = [
  { href: '/', label: 'Home', scrolls: false },
  { href: '/#pricing', label: 'Pricing', scrolls: true },
  { href: '/#why-we-built-it', label: 'About', scrolls: true },
  { href: '/#talk-to-us', label: 'Contact', scrolls: true },
] as const

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const featuresMenuItems = [
  { name: 'Natural Language Processing', href: '/features#natural-language', category: 'AI Core' },
  { name: 'Intelligent Workflows', href: '/features#intelligent-workflows', category: 'AI Core' },
  { name: 'Smart Decision Routing', href: '/features#intelligent-routing', category: 'AI Core' },
  { name: 'Enterprise Integrations', href: '/features#enterprise-integrations', category: 'Integrations' },
  { name: 'Developer API Platform', href: '/features#api-platform', category: 'Integrations' },
  { name: 'Real-time Monitoring', href: '/features#real-time-monitoring', category: 'Operations' },
  { name: 'Advanced Analytics', href: '/features#analytics-insights', category: 'Operations' },
  { name: 'Smart Scheduling', href: '/features#scheduling-automation', category: 'Operations' },
  { name: 'Enterprise Security', href: '/features#enterprise-security', category: 'Security' },
  { name: 'Compliance Framework', href: '/features#compliance-framework', category: 'Security' },
  { name: 'Visual Workflow Builder', href: '/features#visual-builder', category: 'User Experience' },
  { name: 'Team Collaboration', href: '/features#collaboration-tools', category: 'User Experience' },
  { name: 'Marketing & Social Media', href: '/features#use-cases', category: 'Use Cases' },
  { name: 'Sales & CRM', href: '/features#use-cases', category: 'Use Cases' },
  { name: 'Legal & Compliance', href: '/features#use-cases', category: 'Use Cases' },
  { name: 'Finance & Operations', href: '/features#use-cases', category: 'Use Cases' },
]

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const pathname = usePathname()

  /*
   * Lock the page behind the open menu.
   *
   * The panel is `md:hidden`, but `isMobileMenuOpen` is not: open the menu on
   * a phone and then rotate to landscape (or resize past 768px) and the panel
   * vanishes while the body stays `overflow: hidden`. The page is then frozen
   * with no visible control to unfreeze it, because the only thing that clears
   * the lock is a button that is no longer on screen. Closing the menu at the
   * breakpoint is what makes the state match what is rendered.
   */
  useEffect(() => {
    if (!isMobileMenuOpen) {
      document.body.style.overflow = ''
      return
    }

    document.body.style.overflow = 'hidden'

    const mq = window.matchMedia('(min-width: 768px)')
    const sync = () => {
      if (mq.matches) setIsMobileMenuOpen(false)
    }
    sync()
    mq.addEventListener('change', sync)

    return () => {
      mq.removeEventListener('change', sync)
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  /*
   * A section link closes the menu, but an in-page jump does not change
   * `pathname`, so navigating to `/#pricing` from the homepage leaves the
   * panel open over the section it just scrolled to. The explicit onClick on
   * each link covers that; this covers a real route change.
   */
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/*
        * The header. A dark bar on a light page, bookending the dark footer.
        *
        * Deliberately NOT the canvas colour it was: matching the page made it
        * invisible, so the logo and the call to action floated with no bar
        * around them. Dark also means the logo keeps the light-ink wordmark it
        * already ships, and the indigo CTA has something to sit against.
        *
        * The scrolled state deepens the ground and adds a hairline rather than
        * casting a shadow: a shadow under a dark bar on a light page reads as a
        * smudge.
        */}
      <nav className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
        isScrolled
          ? 'bg-night/95 backdrop-blur-2xl border-b border-night-line'
          : 'bg-night/80 backdrop-blur-xl border-b border-transparent'
      }`}>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-[72px]">
            {/* Logo */}
            <Link href="/" className="flex items-center group relative">
              <Logo
                placement="header"
                responsive
                priority
                className="group-hover:scale-105 transition-transform duration-200"
              />
            </Link>

            {/*
              * The menu.
              *
              * One pill, and it now says WHERE YOU ARE. The header had no
              * active state at all: every link looked identical on every page,
              * so the nav told the visitor nothing about their position. The
              * current page gets the raised surface and full-strength ink; the
              * rest are quiet until hovered.
              *
              * `aria-current="page"` carries the same fact to a screen reader,
              * which a background colour alone does not.
              */}
            <div className="hidden md:flex items-center gap-0.5 rounded-full border border-night-line bg-white/5 p-1 backdrop-blur-md">
              {NAV.map(item => {
                /*
                  * An anchor is never the current page — the homepage is. Only
                  * `/` can light up, and only when you are actually on it.
                  */
                const active = !item.scrolls && pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-night ${
                      active
                        ? 'bg-white/[0.12] text-night-ink'
                        : 'text-night-ink-2 hover:bg-white/[0.06] hover:text-night-ink'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>

            {/* Sign in, then the one thing we want clicked. */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-night-ink-2 transition-colors hover:text-night-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-night"
              >
                Sign In
              </Link>
              {/*
                * The platform's button colour: ORANGE.
                *
                * `bg-brand` is #F08034, sampled from the logo itself, and the
                * app uses `bg-orange-500` for the same job.
                *
                * ⚠️ The text is DARK INK, not white. White on this orange is
                * 2.68:1 and on `orange-500` 2.80:1 — both fail WCAG AA for
                * normal text, which needs 4.5. Dark ink on it is **6.11:1**.
                * The app's own `bg-orange-500 text-white` buttons have the
                * problem this avoids.
                *
                * Identical to `PrimaryCta`'s `onNight` skin, so the header and
                * the in-page dark-section buttons are one button.
                */}
              <Link
                href="/signup"
                className="rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-night transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-night"
              >
                Get Something Handled
              </Link>
            </div>

            {/*
              * The menu button, which is the ONLY nav control on a phone.
              *
              * It carried `text-ink-2` and `hover:bg-sunk` — the LIGHT theme's
              * secondary ink and sunk surface, on a `bg-night` bar. Measured:
              * **2.74:1**, under the 3:1 that even large text and icons need,
              * so the one control a phone visitor has was close to invisible;
              * and hovering painted a pale box on the dark bar.
              *
              * Night tokens fix both: `night-ink-2` is 7.28:1 here, and the
              * hover is a white wash of the kind the desktop pill already uses.
              *
              * `h-11 w-11` is the 44px minimum touch target. `p-2` around a
              * 20px icon gave 36px, which is a miss-tap on a moving train.
              *
              * `aria-expanded` is what tells a screen reader the panel opened.
              * `aria-controls` points at it. Neither was here.
              */}
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-lg text-night-ink-2 transition-colors hover:bg-white/[0.08] hover:text-night-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-night md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobileMenu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        <div
          id="mobileMenu"
          /*
            * `max-h-[calc(100vh-4rem)]` rather than `max-h-screen`: the panel
            * hangs below a 64px bar, so a full-viewport cap lets a long menu
            * run off the bottom of the phone with no way to reach it. Capped
            * to what is actually left, and scrollable inside that.
            */
          className={`overflow-y-auto transition-all duration-300 ease-in-out md:hidden ${
            isMobileMenuOpen
              ? 'max-h-[calc(100vh-4rem)] opacity-100'
              : 'max-h-0 overflow-hidden opacity-0'
          }`}
        >
          <div className="space-y-1 border-t border-night-line bg-night/95 px-4 pb-6 pt-3 backdrop-blur-md">
            {/* The same NAV data as the pill, so the two cannot drift. */}
            {NAV.map(item => {
              const active = !item.scrolls && pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                    active
                      ? 'bg-white/[0.12] text-night-ink'
                      : 'text-night-ink-2 hover:bg-white/[0.06] hover:text-night-ink'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}

            <div className="space-y-2 border-t border-night-line pt-4">
              <Link
                href="/login"
                className="block rounded-xl px-4 py-3 text-center text-base font-medium text-night-ink-2 transition-colors hover:bg-white/[0.06] hover:text-night-ink"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="block rounded-lg bg-brand px-4 py-3 text-center text-base font-semibold text-night transition-colors hover:bg-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Something Handled
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16 sm:pt-[72px]">
        {children}
      </main>

        {/*
          * The footer.
          *
          * Was `bg-zinc-800/60` — 60% opacity, which worked when the page
          * behind it was dark and turned into a flat mid-grey the moment the
          * site went light. Everything on it then sat at low contrast: grey
          * body text on a grey ground, with the headings the only thing
          * readable.
          *
          * Now solid `--night`, the same ground as the header and the problem
          * section, so the page is bookended. Colours come from the night
          * tokens rather than `zinc`/`gray`, which is what let the two drift.
          */}
        <footer className="bg-night pb-10 pt-16 text-night-ink">
          <div className="mx-auto w-full max-w-shell px-5 md:px-8 lg:px-10">
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(0,0.8fr))_minmax(0,1.3fr)] lg:gap-8">
              <div>
                {/*
                  * Default tone (`dark`) = the light-ink wordmark, which is
                  * right here and nowhere else: the footer is the one dark
                  * surface left. The header passes `tone="light"`.
                  */}
                <Logo placement="footer" />
                <p className="mt-4 max-w-[34ch] text-[15px] leading-relaxed text-night-ink-2">
                  Stop letting things slip through. Get work handled automatically.
                </p>
              </div>

              <FooterColumn
                title="Product"
                links={[
                  { href: '/#pricing', label: 'Pricing' },
                  { href: '/signup', label: 'Get Something Handled' },
                ]}
              />

              <FooterColumn
                title="Company"
                links={[
                  { href: '/#why-we-built-it', label: 'About' },
                  { href: '/#talk-to-us', label: 'Contact' },
                ]}
              />

              <NewsletterForm />
            </div>

            <div className="mt-12 flex flex-col items-center gap-3 border-t border-night-line pt-6 text-[13px] text-night-ink-2 sm:flex-row sm:justify-between">
              <p>&copy; {new Date().getFullYear()} AgentsPilot. All rights reserved.</p>
              {/*
                * Separate links, not one sentence joined by bullets. A legal
                * link has to be clickable on its own — "Privacy Policy • Terms
                * of Service" as plain text in a paragraph was neither.
                */}
              <nav className="flex items-center gap-5" aria-label="Legal">
                <Link href="/privacy" className="transition-colors hover:text-night-ink">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="transition-colors hover:text-night-ink">
                  Terms of Service
                </Link>
              </nav>
            </div>
          </div>
        </footer>
      </div>
  )
}