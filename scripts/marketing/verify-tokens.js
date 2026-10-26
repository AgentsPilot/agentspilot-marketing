/**
 * Keep the colour tokens and the Tailwind config in a form where opacity works.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE FAILURE THIS CATCHES
 *
 * Tailwind cannot apply an opacity modifier to a colour that is already a
 * complete value. Given `ink: "var(--ink)"` where `--ink` holds `#142B36`,
 * `bg-ink/70` emits **no rule at all** — the class sits in the HTML, the
 * stylesheet has nothing for it, and the element simply has no background.
 *
 * It shipped exactly that way once: the marketing header was `bg-night/80`,
 * the markup was correct, and the bar was transparent. Nothing failed. The
 * build passed, `tsc` passed, the class was present in the rendered HTML, and
 * only grepping the compiled CSS for the rule showed it missing.
 *
 * So two things must hold together, and neither is visible from the other:
 *
 *   1. every token in `globals.css` is RGB CHANNELS — `20 43 54`, not a hex;
 *   2. every colour in `tailwind.config.ts` wraps it as
 *      `rgb(var(--x) / <alpha-value>)`.
 *
 * There is no jest in this repo, so this runs as a script —
 * `npm run verify:tokens`, and in CI beside the build, next to
 * `scripts/brand/verify.js` which exists for the same class of silent mistake.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const fail = [];

const css = fs.readFileSync(path.join(ROOT, 'app/globals.css'), 'utf8');
const config = fs.readFileSync(path.join(ROOT, 'tailwind.config.ts'), 'utf8');

/*
 * Legacy, and deliberately hex: these predate the token system, are read
 * directly as `var(--background)` by other pages, and take no modifier.
 */
const HEX_ALLOWED = new Set(['background', 'foreground']);

// ── 1. Tokens are channels, not hex ─────────────────────────────────────────
for (const m of css.matchAll(/^\s*--([a-z0-9-]+):\s*(#[0-9a-fA-F]{3,8})\s*;/gm)) {
  const [, name, hex] = m;
  if (HEX_ALLOWED.has(name)) continue;
  fail.push(
    `globals.css: --${name} is ${hex}. Use RGB channels so opacity modifiers ` +
      `compile (e.g. "20 43 54"), or add it to HEX_ALLOWED with a reason.`
  );
}

// ── 2. Every Tailwind COLOUR supports an alpha value ────────────────────────
/*
 * Scoped to the `colors` block. `fontFamily` also holds `var(--font-sans)`,
 * and a font is not a colour — an earlier version of this check failed on it,
 * which is the right way round for a guard to be wrong.
 */
const colorsStart = config.indexOf('      colors: {');
const colorsEnd = config.indexOf('      fontFamily: {');
if (colorsStart < 0 || colorsEnd < 0 || colorsEnd < colorsStart) {
  fail.push('tailwind.config.ts: could not find the colors block; this check needs updating.');
}
const colorsBlock = colorsStart >= 0 && colorsEnd > colorsStart
  ? config.slice(colorsStart, colorsEnd)
  : '';

for (const m of colorsBlock.matchAll(/"(rgb\()?var\(--([a-z0-9-]+)\)[^"]*"/g)) {
  const [full, wrapped, name] = m;
  if (HEX_ALLOWED.has(name)) continue;
  if (!wrapped || !full.includes('<alpha-value>')) {
    fail.push(
      `tailwind.config.ts: --${name} is exposed as ${full}. ` +
        `Use "rgb(var(--${name}) / <alpha-value>)" or every /opacity class on ` +
        `it silently emits no rule.`
    );
  }
}

// ── 3. The parser is alive (no dead check) ──────────────────────────────────
if (!/--ink:\s*\d+ \d+ \d+/.test(css)) {
  fail.push('globals.css: expected --ink as channels; the token block moved or was renamed.');
}
if (!/rgb\(var\(--ink\) \/ <alpha-value>\)/.test(config)) {
  fail.push('tailwind.config.ts: expected ink wrapped with <alpha-value>; the colour block moved.');
}

if (fail.length) {
  console.error('\nverify:tokens FAILED\n');
  for (const f of fail) console.error('  - ' + f);
  console.error('');
  process.exit(1);
}

console.log('verify:tokens passed — tokens are channels and every colour takes an alpha value');
