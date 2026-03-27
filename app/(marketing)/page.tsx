'use client';

import React, { useState } from 'react';

// Force dynamic rendering to prevent build-time errors
export const dynamic = 'force-dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Brain,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Clock,
  FileText,
  AlertCircle,
  BarChart3,
  Users,
  Shield,
  Eye,
  StopCircle,
  TrendingUp,
  Zap,
  ChevronDown,
  Send,
  PlayCircle,
  Link2,
  Lock,
  Activity,
  Code
} from 'lucide-react';
import PilotCreditCalculator from '@/components/billing/PilotCreditCalculator';
import DevelopmentVsAgentsPilotCalculator from '@/components/marketing/DevelopmentVsAgentsPilotCalculator';
import { useRouter } from 'next/navigation';

export default function MarketingPage() {
  const router = useRouter();
  const [expandedUseCase, setExpandedUseCase] = useState<number | null>(null);
  const [userInput, setUserInput] = useState('');

  const handleSubscribe = async (monthlyCredits: number, inputs: any) => {
    // Redirect to signup page with pricing info
    router.push(`/signup?credits=${monthlyCredits}&agents=${inputs.numAgents}&plugins=${inputs.avgPluginsPerAgent}`);
  };

  const useCases = [
    {
      title: "Email Assistant",
      subtitle: "Finds important emails, summarizes them, and sends follow-ups",
      icon: Mail,
      color: "#3b82f6",
      details: {
        what: ["Reads incoming emails", "Identifies urgency", "Summarizes key points", "Drafts responses if needed"],
        see: ["A short summary", "A suggestion", "An alert if needed"],
        dont: ["No rules", "No conditions", "No setup"]
      }
    },
    {
      title: "Expense Tracker",
      subtitle: "Extracts invoices and tracks expenses automatically",
      icon: FileText,
      color: "#10b981",
      details: {
        what: ["Monitors email for invoices", "Extracts expense data", "Categorizes spending", "Generates reports"],
        see: ["Expense summaries", "Category breakdowns", "Trend analysis"],
        dont: ["No manual entry", "No receipt hunting", "No spreadsheet updates"]
      }
    },
    {
      title: "Business Reports",
      subtitle: "Builds summaries without touching spreadsheets",
      icon: BarChart3,
      color: "#8b5cf6",
      details: {
        what: ["Connects to your tools", "Gathers activity data", "Identifies patterns", "Creates digestible summaries"],
        see: ["Weekly overview", "Key highlights", "Trends worth noting"],
        dont: ["No manual tracking", "No spreadsheets", "No data collection"]
      }
    },
    {
      title: "Lead Manager",
      subtitle: "Tracks and prioritizes leads for you",
      icon: Users,
      color: "#14b8a6",
      details: {
        what: ["Reviews lead information", "Checks fit criteria", "Scores priority", "Routes to right team"],
        see: ["Qualified leads", "Priority ranking", "Next best action"],
        dont: ["No manual screening", "No wasted calls", "No missed opportunities"]
      }
    },
    {
      title: "Smart Alerts",
      subtitle: "Notifies you only when something needs attention",
      icon: AlertCircle,
      color: "#ef4444",
      details: {
        what: ["Monitors your systems", "Detects anomalies", "Assesses severity", "Notifies you immediately"],
        see: ["Clear alert", "Context provided", "Suggested actions"],
        dont: ["No manual checking", "No complex rules", "No false alarms"]
      }
    },
    {
      title: "Follow-up Handler",
      subtitle: "Handles routine follow-ups so you don't have to",
      icon: Clock,
      color: "#06b6d4",
      details: {
        what: ["Tracks pending items", "Determines timing", "Drafts follow-ups", "Sends when appropriate"],
        see: ["Scheduled follow-ups", "Response tracking", "Completion status"],
        dont: ["No manual reminders", "No forgotten tasks", "No awkward delays"]
      }
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* 1. HERO SECTION */}
      <section className="relative flex items-center justify-center overflow-hidden pt-12 md:pt-16 pb-8 md:pb-12 border-b border-zinc-800 bg-zinc-950">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

        {/* Accent gradient - more subtle */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">

            {/* Left: Plain Language */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                  Your Business.
                  <br />
                  <span className="text-orange-500">Running Itself.</span>
                </h1>

                <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed font-light">
                  Stop letting things slip through the cracks. Your work gets done automatically.
                </p>

                <p className="text-base md:text-lg text-zinc-500 font-light">
                  Emails answered. Follow-ups sent. Reports built. Nothing missed.
                </p>
              </div>

              {/* Primary CTA - Chat-style input */}
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="What's falling through the cracks for you?"
                    className="w-full px-6 py-4 pr-40 md:pr-44 bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors font-mono text-sm"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 px-4 md:px-6 py-2 bg-orange-500 hover:bg-orange-600 font-medium transition-colors flex items-center gap-2 text-sm md:text-base whitespace-nowrap">
                    Get It Handled (Free)
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <span className="text-xs text-zinc-600">No credit card. Takes 2 minutes.</span>
                </div>
              </div>
            </motion.div>

            {/* Right: Simple Clean Visualization */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="bg-zinc-900 border border-zinc-800 p-8">
                <div className="space-y-4">
                  {[
                    { icon: Mail, label: 'Monitor inbox', sublabel: 'Draft replies', iconColor: '#3b82f6', borderColor: '#3b82f6', delay: 0.5 },
                    { icon: FileText, label: 'Review documents', sublabel: 'Extract key info', iconColor: '#8b5cf6', borderColor: '#8b5cf6', delay: 0.7 },
                    { icon: BarChart3, label: 'Track metrics', sublabel: 'Spot trends', iconColor: '#10b981', borderColor: '#10b981', delay: 0.9 },
                    { icon: MessageSquare, label: 'Follow up', sublabel: 'Never miss a beat', iconColor: '#f59e0b', borderColor: '#f59e0b', delay: 1.1 }
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: item.delay, ease: [0.16, 1, 0.3, 1] }}
                        whileHover={{ x: 8, scale: 1.02, transition: { duration: 0.2 } }}
                        className="flex items-start gap-4 p-4 bg-zinc-800/50 border-l-2 cursor-pointer group"
                        style={{ borderColor: item.borderColor }}
                      >
                        <div className="flex-shrink-0 mt-1">
                          <motion.div
                            animate={{ rotate: [0, 5, 0, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
                          >
                            <Icon className="w-6 h-6" style={{ color: item.iconColor }} />
                          </motion.div>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-white mb-1 transition-colors group-hover:opacity-80">
                            {item.label}
                          </div>
                          <div className="text-sm text-zinc-400 font-mono">
                            {item.sublabel}
                          </div>
                        </div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: idx * 0.5 }}
                          className="w-2 h-2 rounded-full bg-green-500 mt-2"
                        />
                      </motion.div>
                    );
                  })}
                </div>

                {/* Status bar */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.3 }}
                  className="mt-6 pt-6 border-t border-zinc-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-green-500"
                    />
                    <span className="text-xs font-mono text-zinc-500">All systems active</span>
                  </div>
                  <div className="text-xs font-mono text-zinc-600">24/7 monitoring</div>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. THE PAIN (Emotional Hook) */}
      <section className="relative py-24 md:py-32 px-4 bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 md:mb-16 tracking-tight"
          >
            You're not behind. <span className="text-orange-500">You're doing too much.</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="space-y-4 mb-12"
          >
            <p className="text-xl md:text-2xl text-zinc-400 text-center mb-8">Every day you:</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Check emails manually",
                "Forget to follow up",
                "Re-open the same spreadsheets",
                "Track things in your head",
                "Repeat the same tasks",
                "Wonder what you missed"
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + (idx * 0.1), duration: 0.5 }}
                  className="flex items-center gap-3 bg-zinc-800/50 border border-zinc-700 p-4"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                  <span className="text-zinc-300 text-lg">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
            className="text-center"
          >
            <p className="text-2xl md:text-3xl text-white font-light leading-relaxed">
              It's not your job to keep everything running.
              <br />
              <span className="text-orange-500 font-semibold">But right now, you are.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. WHY CURRENT TOOLS FAIL */}
      <section className="relative py-24 md:py-32 px-4 bg-zinc-950 border-b border-zinc-800">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 tracking-tight"
          >
            Tools help you work. <span className="text-orange-500">They don't do the work.</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-center mb-12"
          >
            <p className="text-xl md:text-2xl text-zinc-400 mb-8">
              Automation tools can connect apps…
            </p>
            <p className="text-lg text-zinc-500 mb-8">But they can't:</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-8">
              {[
                "Understand what matters",
                "Make decisions",
                "Handle real-world scenarios",
                "Adapt when things change"
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + (idx * 0.1), duration: 0.5 }}
                  className="bg-zinc-900 border border-zinc-800 p-6 text-center"
                >
                  <StopCircle className="w-8 h-8 text-red-500/50 mx-auto mb-3" />
                  <span className="text-zinc-300 text-base">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
            className="text-2xl md:text-3xl text-center text-orange-500 font-semibold"
          >
            So you still end up doing everything yourself.
          </motion.p>
        </div>
      </section>

      {/* 4. THE SHIFT (Key Turning Point) */}
      <section className="relative py-24 md:py-32 px-4 bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 tracking-tight"
          >
            What if nothing ever <span className="text-orange-500">slipped through?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-xl md:text-2xl text-zinc-400 text-center mb-12"
          >
            Instead of setting rules…
            <br />
            <span className="text-white font-semibold">You describe what you want.</span>
          </motion.p>

          {/* Example Block */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="bg-gradient-to-r from-orange-500/10 to-orange-500/5 border-2 border-orange-500/30 p-8 md:p-12 mb-12"
          >
            <p className="text-2xl md:text-3xl text-white font-light italic text-center leading-relaxed">
              "Check my emails, find invoices above $50, save them, and send me a summary every day."
            </p>
          </motion.div>

          {/* Result */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            className="space-y-6"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-8">
              <span className="text-orange-500">Here's what happens:</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {[
                { icon: Mail, text: "Reads your emails", color: "#3b82f6" },
                { icon: Sparkles, text: "Identifies what matters", color: "#8b5cf6" },
                { icon: Activity, text: "Takes action", color: "#10b981" },
                { icon: Send, text: "Sends results", color: "#f59e0b" }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 + (idx * 0.1), duration: 0.5 }}
                    className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 p-6"
                  >
                    <Icon className="w-6 h-6 flex-shrink-0" style={{ color: item.color }} />
                    <span className="text-white text-lg">{item.text}</span>
                  </motion.div>
                );
              })}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2, duration: 0.7 }}
              className="text-2xl md:text-3xl text-center text-orange-500 font-bold mt-8"
            >
              Automatically.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* 5. HOW IT ACTUALLY WORKS */}
      <section className="relative py-24 md:py-32 px-4 bg-zinc-950 border-b border-zinc-800">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4 tracking-tight"
          >
            You don't need to be technical. <span className="text-orange-500">Just describe the problem.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-center text-zinc-500 mb-16 text-base uppercase tracking-wider font-mono"
          >
            Getting Started Takes Minutes
          </motion.p>

          <div className="space-y-8 md:space-y-12">
            {[
              {
                number: "1",
                title: "Tell us what keeps slipping",
                description: "Just type it like you would tell a person",
                icon: MessageSquare,
                color: "#f97316"
              },
              {
                number: "2",
                title: "We ask a few simple questions",
                description: "No technical knowledge required",
                icon: Brain,
                color: "#3b82f6"
              },
              {
                number: "3",
                title: "It handles itself from now on",
                description: "Daily, weekly, or in real-time",
                icon: Zap,
                color: "#10b981"
              }
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2, duration: 0.6 }}
                  whileHover={{ x: 8, scale: 1.02, transition: { duration: 0.3 } }}
                  className="flex items-start gap-6 bg-zinc-900/50 border border-zinc-800 p-8 hover:border-zinc-700 transition-all"
                >
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center" style={{ borderColor: step.color }}>
                      <span className="text-2xl font-bold" style={{ color: step.color }}>{step.number}</span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="w-6 h-6" style={{ color: step.color }} />
                      <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                    </div>
                    <p className="text-lg text-zinc-400">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. REAL LIFE USE CASES */}
      <section id="use-cases" className="relative py-24 md:py-32 px-4 bg-zinc-950 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-6 md:mb-8"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 tracking-tight">
              Things you'll never have to <span className="text-orange-500">think about again</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {useCases.map((useCase, idx) => {
              const Icon = useCase.icon;
              const isExpanded = expandedUseCase === idx;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                  className={`cursor-pointer transition-all ${isExpanded ? 'md:col-span-2 lg:col-span-3' : ''}`}
                  onClick={() => setExpandedUseCase(isExpanded ? null : idx)}
                >
                  <div className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-6 transition-colors h-full">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${useCase.color}20` }}>
                        <Icon className="w-5 h-5" style={{ color: useCase.color }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg mb-2">{useCase.title}</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">{useCase.subtitle}</p>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-6 space-y-6"
                            >
                              <div>
                                <h4 className="text-sm font-semibold text-orange-400 mb-3">What the agent does</h4>
                                <ul className="space-y-2">
                                  {useCase.details.what.map((item, i) => (
                                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                      <span className="text-orange-500 flex-shrink-0 mt-0.5">•</span>
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <h4 className="text-sm font-semibold text-orange-400 mb-3">What you see</h4>
                                <ul className="space-y-2">
                                  {useCase.details.see.map((item, i) => (
                                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                      <span className="text-orange-500 flex-shrink-0 mt-0.5">•</span>
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <h4 className="text-sm font-semibold text-orange-400 mb-3">What you don't do</h4>
                                <ul className="space-y-2">
                                  {useCase.details.dont.map((item, i) => (
                                    <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                                      <span className="text-orange-500 flex-shrink-0 mt-0.5">•</span>
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <button className="mt-4 px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-xl font-semibold transition-colors flex items-center gap-2">
                                Create this agent
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. DIFFERENTIATION (Your MOAT) */}
      <section className="relative py-24 md:py-32 px-4 bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4 tracking-tight"
          >
            This isn't automation. <span className="text-orange-500">This is execution.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-center text-zinc-400 mb-12 md:mb-16 text-lg max-w-3xl mx-auto"
          >
            Stop building workflows. Start getting results.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Traditional Tools */}
            <motion.div
              initial={{ opacity: 0, x: -50, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="bg-zinc-900/50 border border-zinc-800 p-8"
            >
              <h3 className="text-xl font-bold text-zinc-400 mb-2">Traditional Tools</h3>
              <p className="text-sm text-zinc-500 mb-6">Zapier, Make, n8n</p>
              <ul className="space-y-4">
                {[
                  "You build workflows",
                  "You define rules",
                  "You fix when it breaks"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-zinc-400 text-base">
                    <div className="w-5 h-5 border border-zinc-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 bg-zinc-600" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* AgentPilot */}
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="bg-gradient-to-b from-orange-500/10 to-zinc-900/50 border-2 border-orange-500/50 p-8"
            >
              <h3 className="text-xl font-bold text-orange-500 mb-2">AgentPilot</h3>
              <p className="text-sm text-orange-400/80 mb-6">Intelligent execution platform</p>
              <ul className="space-y-4">
                {[
                  "You describe the outcome",
                  "It figures out the process",
                  "It runs and adapts"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-white text-base">
                    <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            className="mt-12 text-center"
          >
            <p className="text-2xl md:text-3xl text-white font-light">
              It doesn't help you work.
              <br />
              <span className="text-orange-500 font-bold">It works for you.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* 5. HOW AGENTS WORK */}
      <section className="relative py-24 md:py-32 px-4 bg-zinc-950 border-b border-zinc-800">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-3 tracking-tight"
          >
            How it <span className="text-orange-500">actually works</span>
          </motion.h2>
          <p className="text-center text-zinc-500 mb-16 md:mb-20 font-mono text-sm uppercase tracking-wider"></p>

          <div className="relative max-w-3xl mx-auto">
            {/* Vertical Timeline Line - More Prominent */}
            <div className="absolute left-6 md:left-12 top-0 bottom-0 w-0.5 bg-zinc-800 hidden md:block">
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full bg-gradient-to-b from-orange-500 via-orange-500/50 to-orange-500"
              />
            </div>

            <div className="space-y-12 md:space-y-16">
              {[
                {
                  title: "Understand",
                  description: "Figures out what you're trying to accomplish. No rigid rules, just natural understanding.",
                  icon: Brain,
                  delay: 0,
                  color: "#f97316"
                },
                {
                  title: "Connect",
                  description: "Safely accesses the tools you already use. Only what you give permission for.",
                  icon: Link2,
                  delay: 0.2,
                  color: "#3b82f6"
                },
                {
                  title: "Handle It",
                  description: "Does the work or watches for changes. You approve important decisions.",
                  icon: Activity,
                  delay: 0.4,
                  color: "#10b981"
                },
                {
                  title: "Learn",
                  description: "Gets better over time. Learns your preferences and what matters most.",
                  icon: TrendingUp,
                  delay: 0.6,
                  color: "#8b5cf6"
                }
              ].map((step, idx) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: step.delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="relative flex items-start gap-6 md:gap-8"
                  >
                    {/* Timeline Icon */}
                    <div className="relative flex-shrink-0 z-10">
                      {/* Icon container */}
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: step.delay + 0.1, duration: 0.5, type: "spring" }}
                        className="relative w-12 h-12 md:w-16 md:h-16 bg-black border-4 flex items-center justify-center"
                        style={{ borderColor: step.color }}
                      >
                        <Icon className="w-6 h-6 md:w-8 md:h-8" style={{ color: step.color }} />
                      </motion.div>

                      {/* Step number badge */}
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-zinc-900 border-2 flex items-center justify-center" style={{ borderColor: step.color }}>
                        <span className="text-xs font-bold font-mono" style={{ color: step.color }}>
                          {idx + 1}
                        </span>
                      </div>
                    </div>

                    {/* Content Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: step.delay + 0.3, duration: 0.6 }}
                      whileHover={{ x: 8, transition: { duration: 0.3 } }}
                      className="flex-1 bg-zinc-900/50 border border-zinc-800 p-6 md:p-8 group hover:bg-zinc-900 hover:border-zinc-700 transition-all duration-300"
                    >
                      <h3 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight transition-colors duration-300" style={{ color: step.color }}>
                        {step.title}
                      </h3>
                      <p className="text-zinc-400 text-base md:text-lg leading-relaxed group-hover:text-zinc-300 transition-colors duration-300">
                        {step.description}
                      </p>

                      {/* Progress indicator */}
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: step.delay + 0.5, duration: 0.8 }}
                        className="h-1 mt-6 origin-left"
                        style={{ backgroundColor: step.color, opacity: 0.3 }}
                      />
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom flow indicator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="mt-12 flex items-center justify-center gap-3"
            >
              <div className="flex items-center gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1 + (i * 0.1), duration: 0.4 }}
                    className="w-2 h-2 bg-orange-500/50"
                  />
                ))}
              </div>
              <ArrowRight className="w-4 h-4 text-orange-500/50" />
              <span className="text-xs font-mono text-zinc-600 uppercase tracking-wider">Continuous improvement</span>
            </motion.div>
          </div>
        </div>
      </section>


      {/* 7. TRUST & SAFETY */}
      <section className="relative py-24 md:py-32 px-4 bg-zinc-950 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12 tracking-tight"
          >
            You're always <span className="text-orange-500">in control</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {[
              { icon: Eye, text: "You approve actions" },
              { icon: Activity, text: "You see every result" },
              { icon: StopCircle, text: "You can stop any agent" },
              { icon: Lock, text: "Nothing runs without your permission" }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -8, scale: 1.05, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
                  className="bg-zinc-900 border border-zinc-800 p-6 text-center"
                >
                  <Icon className="w-8 h-8 text-orange-500 mx-auto mb-4" />
                  <p className="text-white font-medium text-sm">{item.text}</p>
                </motion.div>
              );
            })}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-center text-zinc-500 mt-6 md:mt-8 text-sm"
          >
            Built with enterprise grade security without enterprise complexity.
          </motion.p>
        </div>
      </section>

      {/* 8. SMART INSIGHTS */}
      <section className="relative py-24 md:py-32 px-4 bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-6 md:mb-8"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 tracking-tight">
              It doesn't just execute <span className="text-orange-500">it notices things</span>
            </h2>
            <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto font-light">
              It tells you what changed, what matters, and what you might want to know about.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { text: "Response times are slowing", color: "#f59e0b" },
              { text: "This client's tone shifted", color: "#8b5cf6" },
              { text: "This task could be automated further", color: "#3b82f6" }
            ].map((insight, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.05, x: 8, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
                className="bg-zinc-900 border-l-2 p-6" style={{ borderColor: insight.color }}
              >
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: insight.color }} />
                  <p className="text-zinc-300 font-mono text-sm">"{insight.text}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. WHO IT'S FOR */}
      <section className="relative py-24 md:py-32 px-4 bg-zinc-950 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12 tracking-tight"
          >
            Built for people who <span className="text-orange-500">run things</span>
          </motion.h2>

          <div className="grid grid-cols-2 md:flex md:flex-wrap md:justify-center gap-4 md:gap-5 max-w-4xl mx-auto">
            {[
              { icon: Users, label: "Business owners" },
              { icon: Sparkles, label: "Consultants" },
              { icon: Activity, label: "Operators" },
              { icon: Users, label: "Teams" },
              { icon: Brain, label: "Professionals" }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ scale: 1.1, y: -8, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
                  className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 px-6 py-6 md:px-8 transition-colors flex flex-col items-center justify-center min-h-[120px] md:min-h-[140px]"
                >
                  <Icon className="w-7 h-7 text-orange-500 mb-3" />
                  <p className="text-white font-medium text-center text-sm whitespace-nowrap">{item.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. PRICING */}
      <section className="relative py-24 md:py-32 px-4 bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-3 tracking-tight"
          >
            Simple pricing. <span className="text-orange-500">No subscriptions.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-center text-zinc-400 mb-4 max-w-2xl mx-auto text-lg"
          >
            Start free. Pay as you go based on how your agents are created and how they run.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-center text-zinc-500 mb-12 md:mb-16 max-w-3xl mx-auto"
          >
            AgentPilot uses AI to create your agents and run them on your data.
            You only pay for actual usage. Nothing more.
          </motion.p>

          {/* How Pricing Works */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="mb-12 space-y-6 max-w-4xl mx-auto"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 text-orange-500">
              How Pricing Works
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="bg-zinc-900/50 border border-zinc-800 p-6">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center mb-4">
                  <span className="text-lg font-bold text-orange-500">1</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-3">Create Your Agent</h4>
                <p className="text-zinc-400 mb-4 text-sm">
                  When you describe what you want, AgentPilot uses AI to build your agent.
                </p>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Small one-time cost (usually just a few cents)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Only when you create or update an agent</span>
                  </li>
                </ul>
              </div>

              {/* Step 2 */}
              <div className="bg-zinc-900/50 border border-zinc-800 p-6">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center mb-4">
                  <span className="text-lg font-bold text-orange-500">2</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-3">Run Your Agent</h4>
                <p className="text-zinc-400 mb-4 text-sm">
                  Each time your agent works reading data, analyzing, taking action it uses credits.
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
                </ul>
              </div>

              {/* Step 3 */}
              <div className="bg-zinc-900/50 border border-zinc-800 p-6">
                <div className="w-10 h-10 rounded-full bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center mb-4">
                  <span className="text-lg font-bold text-orange-500">3</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-3">You Stay in Control</h4>
                <p className="text-zinc-400 mb-4 text-sm">
                  Full transparency and control over every run.
                </p>
                <ul className="space-y-2 text-sm text-zinc-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>See estimated cost before running</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Pause or limit usage anytime</span>
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

      {/* 11. FINAL CTA */}
      <section className="relative py-24 md:py-32 px-4 bg-zinc-950">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 md:space-y-8"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              Stop letting things
              <br />
              fall through the cracks.
            </h2>

            <p className="text-xl md:text-2xl text-zinc-400 font-light">
              Get everything handled <span className="text-orange-500 font-semibold">starting today.</span>
            </p>

            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="What keeps slipping through for you?"
                  className="flex-1 px-6 py-4 bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-base focus:outline-none focus:border-orange-500 transition-colors"
                />
                <button className="px-8 py-4 bg-orange-500 hover:bg-orange-600 font-semibold transition-colors flex items-center justify-center gap-2 whitespace-nowrap text-white">
                  Get It Handled (Free)
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-zinc-600 mt-4">
                No credit card required. Start in 2 minutes.
              </p>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-base md:text-lg text-zinc-500 font-mono mt-8"
            >
              "If it keeps slipping through, we can handle it."
            </motion.p>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
