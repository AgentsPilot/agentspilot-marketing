'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { X, Menu, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <h4 className="font-semibold text-orange-400 mb-4">Never Miss Updates</h4>
      <p className="text-gray-400 text-sm mb-4">Get tips on handling more and missing less.</p>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </button>
        {message && (
          <p className={`text-sm ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
            {message.text}
          </p>
        )}
      </form>
    </div>
  )
}

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

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900">
      {/* Navigation - Ultra Futuristic Design */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-zinc-900/95 backdrop-blur-2xl shadow-2xl shadow-zinc-800/20'
          : 'bg-zinc-900/60 backdrop-blur-xl'
      }`}>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            {/* Logo */}
            <Link href="/" className="flex items-center group relative">
              <Image
                src="/images/AgentPilot_Logo.png"
                alt="AgentsPilots"
                width={150}
                height={150}
                className="group-hover:scale-105 transition-transform duration-200"
                priority
              />
            </Link>

            {/* Navigation Links - Futuristic pill design */}
            <div className="hidden md:flex items-center gap-1 bg-zinc-900/50 backdrop-blur-md rounded-full p-1 border border-white/10">
              <Link href="/" className="relative px-4 py-2 text-sm text-slate-300 hover:text-white rounded-full transition-all duration-300 group overflow-hidden">
                <span className="relative z-10">Home</span>
                <div className="absolute inset-0 bg-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link href="/pricing" className="relative px-4 py-2 text-sm text-slate-300 hover:text-white rounded-full transition-all duration-300 group overflow-hidden">
                <span className="relative z-10">Pricing</span>
                <div className="absolute inset-0 bg-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link href="/about" className="relative px-4 py-2 text-sm text-slate-300 hover:text-white rounded-full transition-all duration-300 group overflow-hidden">
                <span className="relative z-10">About</span>
                <div className="absolute inset-0 bg-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link href="/contact" className="relative px-4 py-2 text-sm text-slate-300 hover:text-white rounded-full transition-all duration-300 group overflow-hidden">
                <span className="relative z-10">Contact</span>
                <div className="absolute inset-0 bg-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>

            {/* CTA Buttons - Futuristic glow effect */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login" className="relative px-4 py-2 text-sm text-slate-300 hover:text-white transition-all duration-300 group">
                <span className="relative z-10">Sign In</span>
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-orange-500 group-hover:w-full transition-all duration-300"></div>
              </Link>
              <Link
                href="/signup"
                className="px-3 py-1.5 text-sm bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-200 font-medium"
              >
                Get Something Handled
              </Link>
            </div>

            {/* Mobile menu button - Futuristic */}
            <button
              className="md:hidden relative text-slate-300 hover:text-white transition-colors duration-200 p-2 hover:bg-white/5 rounded-lg group"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="absolute inset-0 bg-orange-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 relative z-10" />
              ) : (
                <Menu className="w-5 h-5 relative z-10" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen
              ? 'max-h-screen opacity-100'
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="px-4 pt-2 pb-6 space-y-3 bg-zinc-900/95 backdrop-blur-md border-t border-white/10">
            <Link
              href="/"
              className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/pricing"
              className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>

            {/* Mobile CTA Buttons */}
            <div className="pt-4 space-y-3 border-t border-white/10">
              <Link
                href="/login"
                className="block px-4 py-3 text-center text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="block px-4 py-3 text-center bg-orange-500 text-white hover:bg-orange-600 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Something Handled
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-24">
        {children}
      </main>

        {/* Footer */}
        <footer className="py-8 bg-zinc-800/60 text-gray-300">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <div className="flex items-center mb-4">
                  <Image
                    src="/images/AgentPilot_Logo.png"
                    alt="AgentsPilots"
                    width={80}
                    height={80}
                  />
                </div>
                <p className="text-gray-400">Stop letting things slip through. Get work handled automatically.</p>
              </div>
              <div>
                <h4 className="font-semibold text-orange-400 mb-4">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                  <li><Link href="/signup" className="hover:text-white transition-colors">Get Something Handled</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-orange-400 mb-4">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                </ul>
              </div>
              {/* Newsletter Signup */}
              <NewsletterForm />
            </div>
            <div className="border-t border-gray-800 mt-6 pt-6 text-center text-xs text-gray-400">
              <p>&copy; 2026 AgentsPilot. All rights reserved. • Privacy Policy • Terms of Service</p>
            </div>
          </div>
        </footer>
      </div>
  )
}