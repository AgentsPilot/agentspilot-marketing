'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Brain,
  Lightbulb,
  Heart,
  Rocket,
  ArrowRight,
  CheckCircle,
  Bot,
  Link2,
  Music,
  AlertCircle,
  Sparkles
} from 'lucide-react';

const AboutPage = () => {
  const [hoveredSection, setHoveredSection] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 px-4 bg-zinc-950 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1
              className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-orange-400">
                Stop Letting Things
              </span>
              <br />
              <span className="text-white">Slip Through The Cracks</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-base md:text-lg text-slate-300 max-w-4xl mx-auto mb-8 leading-relaxed"
            >
              We're building a way for everyone to get their work handled automatically. Just describe what keeps slipping, and it gets done.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="/signup"
                className="group px-8 py-4 bg-orange-500 hover:bg-orange-600 font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/50 transition flex items-center gap-2"
              >
                Get Something Handled
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* The Vision Section */}
      <section className="relative py-24 md:py-32 px-4 bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              <span className="text-orange-400">
                You're Not Falling Behind
              </span>
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              You're just doing too much manually. Things slip through. It's exhausting keeping track.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* The Problem Card */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-zinc-900/90 backdrop-blur-xl p-8 md:p-10 border border-zinc-800 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-red-500/10">
                    <AlertCircle className="w-7 h-7 text-red-400" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-white">
                    The Problem
                  </h3>
                </div>

                <div className="space-y-6 flex-1">
                  <div className="flex gap-3">
                    <div className="w-1.5 bg-red-400/30 flex-shrink-0"></div>
                    <p className="text-base md:text-lg text-slate-300 leading-relaxed">
                      People spend <span className="text-white font-semibold">hours on work that should take minutes</span>. Important emails don't get answered. Follow-ups get forgotten. Deadlines slip by.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-1.5 bg-red-400/30 flex-shrink-0"></div>
                    <p className="text-base md:text-lg text-slate-300 leading-relaxed">
                      Existing tools require <span className="text-white font-semibold">technical setup, complex workflows, and constant maintenance</span>. Most people just want things handled, not another tool to learn.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-1.5 bg-red-400/30 flex-shrink-0"></div>
                    <p className="text-base md:text-lg text-slate-300 leading-relaxed">
                      They want to <span className="text-white font-semibold">describe what keeps slipping and see it handled</span> automatically.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Our Solution Card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-zinc-900/90 backdrop-blur-xl p-8 md:p-10 border border-orange-400/30 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-orange-500/20">
                    <Sparkles className="w-7 h-7 text-orange-400" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-white">
                    Our Solution
                  </h3>
                </div>

                <div className="space-y-6 flex-1">
                  <div className="flex gap-3">
                    <div className="w-1.5 bg-orange-400/50 flex-shrink-0"></div>
                    <p className="text-base md:text-lg text-slate-200 leading-relaxed">
                      AgentsPilot <span className="text-orange-400 font-semibold">understands what you need from how you describe it</span>. Simply tell us what keeps slipping, and we figure out how to handle it.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-1.5 bg-orange-400/50 flex-shrink-0"></div>
                    <p className="text-base md:text-lg text-slate-200 leading-relaxed">
                      <span className="text-white font-semibold">No technical setup. No complex configuration. No learning curve.</span>
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-1.5 bg-orange-400/50 flex-shrink-0"></div>
                    <p className="text-base md:text-lg text-slate-200 leading-relaxed">
                      Just <span className="text-orange-400 font-semibold">describe the problem and it gets handled</span> from then on.
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-orange-400/20">
                  <Link
                    href="/signup"
                    className="group px-6 py-3.5 bg-orange-500 hover:bg-orange-600 font-bold text-white transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/50 flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Try It Free
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-24 md:py-32 px-4 bg-zinc-950 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              <span className="text-orange-400">
                Four Simple Steps
              </span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              From problem to handled in minutes
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Tell Us What's Slipping",
                description: "Describe what you need in plain English. No technical knowledge needed.",
                icon: <Lightbulb className="w-8 h-8 text-orange-400" />,
                color: "blue"
              },
              {
                step: "02",
                title: "We Ask Simple Questions",
                description: "We ask a few quick questions to understand exactly what you need handled.",
                icon: <Brain className="w-8 h-8 text-orange-400" />,
                color: "purple"
              },
              {
                step: "03",
                title: "We Handle The Setup",
                description: "We figure out the workflow, connect your tools, and configure everything automatically.",
                icon: <Rocket className="w-8 h-8 text-orange-400" />,
                color: "pink"
              },
              {
                step: "04",
                title: "It Runs By Itself",
                description: "It handles itself on demand, on schedule, or triggered by events. You never think about it again.",
                icon: <Heart className="w-8 h-8 text-orange-400" />,
                color: "green"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative group"
                onHoverStart={() => setHoveredSection(index)}
                onHoverEnd={() => setHoveredSection(null)}
              >
                <div className="bg-zinc-900/90 backdrop-blur-xl p-8 border border-zinc-800 hover:border-orange-400/30 transition-all duration-300 h-full text-center">
                  <div className="text-sm font-bold text-slate-500 mb-2">STEP {item.step}</div>
                  <div className="mb-6 flex justify-center">
                    <motion.div
                      animate={hoveredSection === index ? { scale: 1.1, rotate: 360 } : { scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {item.icon}
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="relative py-24 md:py-32 px-4 bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-black mb-12">
              <span className="text-orange-400">
                Our Philosophy
              </span>
            </h2>

            <div className="grid md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Things Shouldn't Slip Through</h3>
                  <p className="text-slate-300">Important work shouldn't depend on your memory. It should just get handled.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Describe The Problem, Not The Solution</h3>
                  <p className="text-slate-300">The best way to get things handled starts with describing what keeps slipping, not building technical workflows.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Everyone Deserves This</h3>
                  <p className="text-slate-300">Getting work handled shouldn't require technical expertise. It should be as natural as asking for help.</p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Trust Through Control</h3>
                  <p className="text-slate-300">You should always see what's happening, change it when you want, and maintain full control.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Behind AgentsPilot Section */}
      <section className="relative py-24 md:py-32 px-4 bg-zinc-950 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-zinc-900/95 backdrop-blur-2xl p-12 md:p-16 border border-zinc-800">
              <h2 className="text-3xl md:text-4xl font-black mb-8 text-center">
                <span className="text-orange-400">
                  Behind AgentsPilot
                </span>
              </h2>

              <div className="space-y-6 text-slate-300 max-w-4xl mx-auto text-center">
                <p className="text-xl leading-relaxed">
                  AgentsPilot was born from a simple frustration: watching talented people
                  waste hours on work that should take minutes because things kept slipping through.
                </p>
                <p className="text-xl leading-relaxed">
                  We experienced firsthand how existing tools failed to help.
                  AgentsPilot represents a fundamental shift: instead of building workflows, you describe what keeps slipping.
                </p>
                <p className="text-xl leading-relaxed">
                  We believe work shouldn't depend on perfect memory or constant vigilance.
                  Important things should get handled automatically, so you can focus on what truly matters.
                </p>
                <p className="text-xl leading-relaxed">
                  Every design decision prioritizes simplicity, control, and getting things handled.
                  Because work should feel lighter, not heavier.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Future of Work Section */}
      <section className="relative py-24 md:py-32 px-4 bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              <span className="text-orange-400">
                The Future We're Building
              </span>
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
              A world where nothing important slips through for anyone
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Everything Gets Handled",
                description: "Every person will have work that handles itself. Follow-ups sent, emails answered, deadlines met. Not because they remembered, but because it's automatic.",
                icon: <Bot className="w-12 h-12 text-orange-400" />
              },
              {
                title: "Works With What You Use",
                description: "It connects to everything you already use. Email, calendar, spreadsheets, all your tools working together to make sure nothing slips.",
                icon: <Link2 className="w-12 h-12 text-orange-400" />
              },
              {
                title: "You Focus On What Matters",
                description: "The best outcomes come from focusing on creative work and strategic thinking, while routine things handle themselves.",
                icon: <Music className="w-12 h-12 text-orange-400" />
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-zinc-900/90 backdrop-blur-xl p-8 border border-zinc-800 hover:border-orange-400/30 transition-all duration-300 text-center"
              >
                <div className="flex justify-center mb-6">{item.icon}</div>
                <h3 className="text-xl font-bold mb-4 text-white">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="relative py-24 md:py-32 px-4 bg-zinc-950 border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-zinc-900/95 backdrop-blur-2xl p-12 md:p-16 border border-zinc-800">
              <h2 className="text-2xl md:text-3xl font-black mb-6">
                <span className="text-orange-400">
                  Our Mission
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-white font-light leading-relaxed">
                To make sure nothing important slips through the cracks for anyone ever again.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 md:py-32 px-4 bg-zinc-900">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-zinc-900/95 backdrop-blur-2xl p-6 md:p-12 lg:p-16 border border-zinc-800 text-center">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black mb-4 md:mb-6">
                Ready to Stop Letting
                <br />
                <span className="text-orange-400">
                  Things Slip Through?
                </span>
              </h2>
              <p className="text-sm md:text-base lg:text-lg text-slate-300 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
                Tell us what keeps slipping. We'll make sure it gets handled from now on.
              </p>

              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-orange-500 hover:bg-orange-600 font-bold text-base md:text-lg hover:shadow-2xl hover:shadow-orange-500/50 transition"
              >
                Get Something Handled (Free)
                <ArrowRight className="w-5 h-5" />
              </Link>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-6 md:mt-8 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-center sm:text-left">No technical skills required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>Ready in minutes</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
