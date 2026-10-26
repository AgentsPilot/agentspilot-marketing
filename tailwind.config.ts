import type { Config } from "tailwindcss";

/**
 * Tailwind, with the marketing tokens exposed as utilities.
 *
 * The colours themselves live in `app/globals.css` as custom properties, with
 * the measured contrast ratios recorded beside them. They are surfaced here so
 * a section writes `text-ink` rather than `text-[#142B36]` — a literal hex in a
 * className is how the live homepage ended up with four different oranges and
 * `text-slate-300` sitting next to `text-zinc-400`.
 *
 * ⚠️ EVERY COLOUR IS `rgb(var(--x) / <alpha-value>)`, NOT `var(--x)`.
 *
 * With a bare `var(--x)` holding a complete hex, Tailwind emits NO RULE for an
 * opacity modifier: `bg-night/80` lands in the HTML and never appears in the
 * stylesheet, so the element has no background. A dark header shipped
 * transparent that way. The tokens in `globals.css` are therefore RGB channels.
 *
 * `brand` and `accent` are deliberately two entries, not one. `brand` is the
 * orange in the logo and fails AA for text at 2.68:1 on white; `accent` is the
 * same hue darkened until it passes. Using `text-brand` on body copy is the
 * mistake this split exists to make visible.
 */
const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        canvas: "rgb(var(--canvas) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        sunk: "rgb(var(--sunk) / <alpha-value>)",

        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          2: "rgb(var(--ink-2) / <alpha-value>)",
          3: "rgb(var(--ink-3) / <alpha-value>)",
        },
        line: {
          DEFAULT: "rgb(var(--line) / <alpha-value>)",
          2: "rgb(var(--line-2) / <alpha-value>)",
        },

        /** Fills, the mark, highlights on dark. Never small text. */
        brand: "rgb(var(--brand) / <alpha-value>)",
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          hover: "rgb(var(--accent-hover) / <alpha-value>)",
          soft: "rgb(var(--accent-soft) / <alpha-value>)",
        },
        pos: {
          DEFAULT: "rgb(var(--pos) / <alpha-value>)",
          soft: "rgb(var(--pos-soft) / <alpha-value>)",
          /** Success on a DARK ground. `pos` itself is 2.5:1 there. */
          bright: "rgb(var(--pos-bright) / <alpha-value>)",
        },

        night: {
          DEFAULT: "rgb(var(--night) / <alpha-value>)",
          2: "rgb(var(--night-2) / <alpha-value>)",
          3: "rgb(var(--night-3) / <alpha-value>)",
          line: "rgb(var(--night-line) / <alpha-value>)",
          ink: "rgb(var(--night-ink) / <alpha-value>)",
          "ink-2": "rgb(var(--night-ink-2) / <alpha-value>)",
        },

        note: {
          1: "rgb(var(--note-1) / <alpha-value>)",
          2: "rgb(var(--note-2) / <alpha-value>)",
          3: "rgb(var(--note-3) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Helvetica", "Arial", "sans-serif"],
        /** Headings. Manrope, per the approved design tokens. */
        display: ["var(--font-display)", "var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      maxWidth: {
        /** The content measure the whole page is laid out on. */
        shell: "1240px",
      },
      borderRadius: {
        panel: "24px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
