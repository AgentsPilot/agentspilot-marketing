'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { CheckCircle, ArrowRight, DollarSign, TrendingDown, Mail, FileText, Users, Eye, Settings } from 'lucide-react'

export default function PricingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header Section */}
      <section className="relative py-24 md:py-32 px-4 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-3 tracking-tight"
          >
            Simple pricing. <span className="text-orange-500">No subscriptions.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-center text-zinc-400 mb-4 max-w-2xl mx-auto text-lg"
          >
            Start free. Only pay when work actually gets done for you.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-center text-zinc-500 mb-16 max-w-3xl mx-auto"
          >
            We figure out what needs to happen and make it happen.
            You only pay for actual work done. Nothing more.
          </motion.p>

          {/* How Pricing Works */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-orange-500">
              How Pricing Works
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Step 1 */}
              <div className="bg-zinc-900/50 border border-zinc-800 p-6">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center mb-4">
                  <span className="text-lg font-bold text-orange-500">1</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">Tell Us What You Need</h3>
                <p className="text-zinc-400 mb-4 text-sm">
                  When you describe what keeps slipping, we figure out how to handle it.
                </p>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Small one-time cost (usually just a few cents)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Only when you set something up</span>
                  </li>
                </ul>
              </div>

              {/* Step 2 */}
              <div className="bg-zinc-900/50 border border-zinc-800 p-6">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center mb-4">
                  <span className="text-lg font-bold text-orange-500">2</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">It Does The Work</h3>
                <p className="text-zinc-400 mb-4 text-sm">
                  Each time work gets done for you (checking emails, sending reports, tracking things), it uses credits.
                </p>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Cost depends on the task</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Simple tasks cost very little</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>More complex workflows use slightly more</span>
                  </li>
                </ul>
              </div>

              {/* Step 3 */}
              <div className="bg-zinc-900/50 border border-zinc-800 p-6">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center mb-4">
                  <span className="text-lg font-bold text-orange-500">3</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-3">You Stay in Control</h3>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>You see estimated cost before running</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>You can pause or limit usage anytime</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>No hidden charges</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Credit Model */}
      <section className="relative py-24 md:py-32 px-4 bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Buy credits. <span className="text-orange-500">Use them when work gets done.</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Starter */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-zinc-900/50 border border-zinc-800 p-6"
              >
                <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
                <div className="text-3xl font-bold text-orange-500 mb-4">Free</div>
                <ul className="space-y-3 text-sm text-zinc-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Get started handling one thing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Test with sample runs</span>
                  </li>
                </ul>
              </motion.div>

              {/* Pay-As-You-Go */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-b from-orange-500/10 to-zinc-900/50 border-2 border-orange-500/50 p-6 relative"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-orange-500 text-white text-xs font-bold uppercase tracking-wide">
                  Most Popular
                </div>
                <h3 className="text-xl font-bold text-orange-500 mb-2">Pay-As-You-Go</h3>
                <div className="text-3xl font-bold text-white mb-1">From $10</div>
                <ul className="space-y-3 text-sm text-zinc-300 mt-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Purchase credits anytime</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>No monthly commitment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Credits never expire</span>
                  </li>
                </ul>
              </motion.div>

              {/* Business */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-zinc-900/50 border border-zinc-800 p-6"
              >
                <h3 className="text-xl font-bold text-white mb-2">Business</h3>
                <div className="text-3xl font-bold text-white mb-4">Custom</div>
                <ul className="space-y-3 text-sm text-zinc-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Higher usage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Priority processing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Team usage support</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Real Examples */}
      <section className="relative py-24 md:py-32 px-4 bg-zinc-950 border-b border-zinc-800">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
              Real Examples
            </h2>
            <p className="text-center text-zinc-400 mb-12 text-lg">
              See what agents actually cost to run
            </p>

            <div className="space-y-6">
              {/* Example 1 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-zinc-900/50 border border-zinc-800 p-6 hover:border-orange-500/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">Never Miss Important Emails</h3>
                    <p className="text-zinc-400 text-sm mb-4">
                      Checks your inbox, finds what matters, sends you one clean summary
                    </p>
                    <div className="flex items-center gap-2 text-orange-500 font-bold text-lg">
                      <DollarSign className="w-5 h-5" />
                      <span>$0.10 – $0.30 per run</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </motion.div>

              {/* Example 2 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-zinc-900/50 border border-zinc-800 p-6 hover:border-orange-500/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">Track Every Expense Automatically</h3>
                    <p className="text-zinc-400 text-sm mb-4">
                      Finds invoices, extracts what you need, builds reports for you
                    </p>
                    <div className="flex items-center gap-2 text-orange-500 font-bold text-lg">
                      <DollarSign className="w-5 h-5" />
                      <span>A few dollars per month</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-green-500" />
                  </div>
                </div>
              </motion.div>

              {/* Example 3 */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-zinc-900/50 border border-zinc-800 p-6 hover:border-orange-500/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">Never Miss A Good Lead</h3>
                    <p className="text-zinc-400 text-sm mb-4">
                      Watches for new leads, figures out which ones matter, alerts you
                    </p>
                    <div className="flex items-center gap-2 text-orange-500 font-bold text-lg">
                      <DollarSign className="w-5 h-5" />
                      <span>$5–$15 per month depending on volume</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-teal-500" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Clarity Line */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-12 text-center"
            >
              <p className="text-2xl md:text-3xl text-white font-semibold">
                Most users spend <span className="text-orange-500">less than $20/month</span> while saving hours every week.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why This Model Works */}
      <section className="relative py-24 md:py-32 px-4 bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-2xl md:text-3xl font-bold text-center mb-12"
          >
            You only pay for real work, <span className="text-orange-500">not for access</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Traditional SaaS */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-zinc-900/50 border border-zinc-800 p-6"
            >
              <h3 className="text-xl font-bold text-zinc-400 mb-4">Traditional SaaS</h3>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li className="flex items-start gap-3">
                  <TrendingDown className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>Pay monthly</span>
                </li>
                <li className="flex items-start gap-3">
                  <TrendingDown className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>Use it or not</span>
                </li>
                <li className="flex items-start gap-3">
                  <TrendingDown className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>Limited by plan</span>
                </li>
              </ul>
            </motion.div>

            {/* AgentPilot */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-b from-orange-500/10 to-zinc-900/50 border-2 border-orange-500/50 p-6"
            >
              <h3 className="text-xl font-bold text-orange-500 mb-4">AgentPilot</h3>
              <ul className="space-y-3 text-sm text-white">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Pay based on usage</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Scale up or down anytime</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>No wasted cost</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Transparency Block */}
      <section className="relative py-24 md:py-32 px-4 bg-zinc-950 border-b border-zinc-800">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              No surprises. <span className="text-orange-500">Ever.</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-900/50 border border-zinc-800 p-6 text-center">
                <DollarSign className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <p className="text-zinc-300 text-sm">
                  Every action has a clear cost estimate
                </p>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 p-6 text-center">
                <Eye className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <p className="text-zinc-300 text-sm">
                  You'll always see usage before and after runs
                </p>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 p-6 text-center">
                <Settings className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <p className="text-zinc-300 text-sm">
                  You control limits and spending
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 md:py-32 px-4 bg-zinc-950">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              Start free. See what stops slipping. <span className="text-orange-500">Then do more.</span>
            </h2>

            <p className="text-xl md:text-2xl text-zinc-400">
              One thing handled could save you hours this week.
            </p>

            <button
              onClick={() => router.push('/signup')}
              className="px-8 py-4 bg-orange-500 hover:bg-orange-600 font-semibold transition-colors flex items-center justify-center gap-2 mx-auto text-white"
            >
              Get Something Handled (Free)
              <ArrowRight className="w-5 h-5" />
            </button>

            <p className="text-sm text-zinc-600 mt-4">
              No credit card required. Start in 2 minutes.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
