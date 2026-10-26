'use client';

import { useRef, useState } from 'react';
import { Hero } from '@/components/marketing/home/Hero';
import { Problem } from '@/components/marketing/home/Problem';
import { ADay } from '@/components/marketing/home/ADay';
import { Capabilities } from '@/components/marketing/home/Capabilities';
import { Insights } from '@/components/marketing/home/Insights';
import { Delegation } from '@/components/marketing/home/Delegation';
import { Pricing } from '@/components/marketing/home/Pricing';
import { About } from '@/components/marketing/home/About';
import { Faq } from '@/components/marketing/home/Faq';
import { Contact } from '@/components/marketing/home/Contact';
import { Closing } from '@/components/marketing/home/Closing';
import { DayDemoDialog } from '@/components/marketing/home/DayDemoDialog';

/**
 * The homepage, in the order the content configuration sets.
 *
 * Each section takes its own copy from `lib/marketing/content` rather than
 * being handed props, so this file is the running order and nothing else —
 * which is what makes the order easy to change and hard to get subtly wrong.
 *
 * The sequence is an argument, not a list:
 *
 *   hero          this could lighten my day
 *   problem       they understand the work between the tools
 *   a day         here is what that looks like, concretely
 *   capabilities  it can be shaped around MY business
 *   insights      I can see what needs me
 *   delegation    and I choose what it handles
 *   about         who built this, and why
 *   pricing       I understand what I get and pay
 *   faq           my practical worries are answered
 *   contact       and if something is still unanswered, ask
 *   closing       I know my next step
 *
 * The dialog lives here, once, because two sections open it: the hero's
 * secondary CTA and the day section. Mounting it per-section would give two
 * dialogs with two states and two focus-return targets.
 */
export default function HomePage() {
  const [demoOpen, setDemoOpen] = useState(false);

  /*
   * Where focus goes when the dialog closes.
   *
   * Tracked rather than hardcoded to the hero button, because the day section
   * opens the same dialog — and returning a keyboard user to the top of the
   * page after they opened it from halfway down is exactly the disorientation
   * the focus-return rule exists to prevent.
   */
  const opener = useRef<HTMLElement | null>(null);

  const open = (from: HTMLElement | null) => {
    opener.current = from;
    setDemoOpen(true);
  };

  return (
    <>
      <main id="main">
        <Hero onOpenDemo={() => open(document.activeElement as HTMLElement | null)} />
        <Problem />
        <ADay onOpenDemo={() => open(document.activeElement as HTMLElement | null)} />
        <Capabilities />
        <Insights />
        <Delegation />
        <About />
        <Pricing />
        <Faq />
        <Contact />
        <Closing />
      </main>

      <DayDemoDialog
        open={demoOpen}
        onClose={() => setDemoOpen(false)}
        returnFocusTo={opener as React.RefObject<HTMLElement>}
      />
    </>
  );
}
