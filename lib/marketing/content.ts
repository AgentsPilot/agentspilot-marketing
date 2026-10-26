/**
 * The homepage's single content configuration.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHY THE COPY IS JSON AND NOT TYPESCRIPT
 *
 * `content.json` is the approved copy, verbatim from
 * `AgentsPilot_Website_Design_and_Content.docx`. Keeping it as data rather than
 * as TS literals means it stays byte-identical to what was signed off: nobody
 * has to escape an apostrophe, re-wrap a line to satisfy a linter, or make a
 * judgement call about a curly quote. A diff on that file is a copy change and
 * nothing else.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHY THE SECTIONS ARE TYPED ONE BY ONE
 *
 * `content.json` holds them as an ARRAY of eight differently-shaped objects, so
 * TypeScript infers a union and every field becomes "possibly undefined" or
 * "does not exist on type string" at the call site. A component then either
 * drowns in `?.` or reaches for `any`, and the types stop meaning anything.
 *
 * `SectionMap` below names each shape once. `section('hero')` returns the hero's
 * type and nothing else, so a typo in a field name is a compile error rather
 * than `undefined` rendered as an empty element.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE IDS ARE A CONTRACT
 *
 * Section ids, CTA ids and anchors are referenced by analytics events and by
 * in-page links. Renaming one is a breaking change, not a tidy-up.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * FIELDS THAT MUST NEVER BE RENDERED
 *
 * Some entries are notes to the developer that sit inside the content object
 * because that is where they were written. Rendering them would put internal
 * rationale on the page:
 *
 *   hero.visual.rows[].meaning     why the row exists, not what it says
 *   interaction / motion           implementation direction
 *   restraint / accuracyRules      what NOT to claim
 *   faq.developerNote              verification instructions
 *
 * `accuracyRules` is the sharpest of these. It says, for example, to write "no
 * recorded reply" and never "you forgot to reply", because the system does not
 * see every channel. It governs copy; it is not copy.
 *
 * @module lib/marketing/content
 */

import raw from './content.json';

export interface Cta {
  id?: string;
  label: string;
  destination?: string;
  destinationMode?: string;
  opens?: string;
}

export interface NavLink {
  id: string;
  label: string;
  href: string;
}

/** A row in the hero's product window: what it was, and what it became. */
export interface BoardRow {
  id: string;
  initial: string;
  final: string;
  /** Developer rationale. NOT visitor-facing — see the module header. */
  meaning: string;
}

export interface CapabilityObject {
  kind: string;
  value: string;
  detail?: string;
  actions?: string[];
}

export interface Capability {
  id: string;
  label: string;
  description: string;
  object: CapabilityObject;
}

export interface Priority {
  id: string;
  priority: string;
  evidence: string;
  action: string;
  detail?: { title: string; explanation: string; evidenceLabel: string };
  drawer?: { title: string; items: string[]; note: string };
  behaviour?: string;
}

export interface ReviewSetting {
  id: string;
  label: string;
  default: boolean;
  revealsRules?: string;
}

export interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export interface DialogStep {
  id: string;
  title: string;
  body: string;
  controls: string[];
}

/** The eight sections, each with the fields the components actually read. */
export interface SectionMap {
  hero: {
    id: 'hero';
    eyebrow: string;
    headline: string;
    body: string;
    supportLine: string;
    visual: {
      title: string;
      rows: BoardRow[];
      storyboardMs: {
        highlightInquiry: number;
        revealSuggestedAction: number;
        approvedBadge: number;
        followUpSent: number;
        finish: number;
      };
      badge: string;
      caption: string;
    };
  };
  problem: {
    id: 'problem';
    eyebrow: string;
    headline: string;
    body: string;
    bridge: string;
    transition: string;
    visual: {
      groupLabel: string;
      slips: { id: string; task: string; detail: string }[];
    };
  };
  capabilities: {
    id: 'capabilities';
    eyebrow: string;
    headline: string;
    body: string;
    exampleBrief: string;
    workspaceLabel: string;
    defaultSelected: string;
    capabilities: Capability[];
  };
  insights: {
    id: 'insights';
    eyebrow: string;
    headline: string;
    body: string;
    supportLine: string;
    viewTitle: string;
    defaultSelected: string;
    priorities: Priority[];
    exampleNote: string;
    /** Governs copy. Never rendered. */
    accuracyRules: string[];
  };
  delegation: {
    id: 'delegation';
    eyebrow: string;
    headline: string;
    body: string;
    supportLine: string;
    panel: {
      recommendation: string;
      reason: string;
      draftReply: string;
      reviewSettings: ReviewSetting[];
      completedState: string;
      activityReceipt: string;
    };
    fallbackIfNoAutonomy: {
      removeOption: string;
      replaceBodyFirstSentence: string;
    };
  };
  pricing: {
    id: 'pricing';
    eyebrow: string;
    headline: string;
    body: string;
    planName: string;
    proposedPrice: string;
    planDescription: string;
    included: string[];
    usageHeading: string;
    usageIntroduction: string;
    fallbackIfNotReady: { headline: string; cta: string };
  };
  faq: {
    id: 'faq';
    heading: string;
    items: FaqItem[];
    /** Verification instructions. Never rendered. */
    developerNote: string;
  };
  closing: {
    id: 'closing';
    headline: string;
    body: string;
    states: string[];
  };
}

export type SectionId = keyof SectionMap;

/*
 * One cast, here, with the reason recorded.
 *
 * The JSON is data with no type of its own, and `SectionMap` is the shape we
 * have asserted it has. Narrowing it anywhere else would mean asserting the
 * same thing repeatedly at call sites that cannot see the file.
 */
const byId = Object.fromEntries(
  (raw.sections as unknown[]).map(s => [(s as { id: string }).id, s])
) as unknown as SectionMap;

export function section<K extends SectionId>(id: K): SectionMap[K] {
  const found = byId[id];
  if (!found) {
    // A bad id is a developer error, and a thrown message beats a blank page.
    throw new Error(`Unknown marketing section: ${id}`);
  }
  return found;
}

export const meta = raw.meta as { seoTitle: string; metaDescription: string };

export const cta = raw.cta as {
  primary: Cta;
  primaryFallback: Cta;
  secondary: Cta;
};

export const navigation = raw.navigation as {
  desktop: { links: NavLink[]; login: NavLink };
  mobile: { trigger: string };
};

export const dialog = raw.dialog as {
  id: string;
  header: string;
  subtitle: string;
  steps: DialogStep[];
  completion: string;
};

export const footer = raw.footer as {
  brandDescription: string;
  links: { label: string; href: string }[];
  copyright: string;
};

export default raw;
