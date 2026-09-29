/**
 * Hold the logo manifest, the literal Tailwind classes and the PNGs on disk in
 * agreement. There is no jest here, so this runs as a script — `npm run
 * brand:verify`, and in CI alongside the build.
 *
 * Each check exists because the corresponding mistake is silent:
 *
 *   - manifest vs file: declaring a 109x20 wordmark as 150x150 is what the
 *     layout did. The only symptom was a console warning.
 *   - runtime-built class names: `h-[${x}px]` compiles, renders, and yields an
 *     element with no height, because Tailwind's JIT never sees it.
 *   - untrimmed art-board: a square-ish ratio means someone dropped a raw
 *     export back in, and the logo renders at a fraction of its box.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const fail = [];

const manifest = fs.readFileSync(path.join(ROOT, 'lib/brand/logo.ts'), 'utf8');
const component = fs.readFileSync(path.join(ROOT, 'components/brand/Logo.tsx'), 'utf8');
// Comments stripped: the component names the broken pattern in its own notes,
// and a check that cannot tell an example from an occurrence fails on its docs.
const code = component.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

for (const m of manifest.matchAll(/src: '(\/images\/brand\/[^']+)', width: (\d+), height: (\d+)/g)) {
  const [, src, w, h] = m;
  const file = path.join(ROOT, 'public', src.replace(/^\//, ''));
  if (!fs.existsSync(file)) { fail.push(`missing asset: ${src}`); continue; }
  const buf = fs.readFileSync(file);
  const realW = buf.readUInt32BE(16), realH = buf.readUInt32BE(20);
  if (realW !== +w || realH !== +h) fail.push(`${src}: manifest says ${w}x${h}, file is ${realW}x${realH}`);
  if (realW / realH < 3) fail.push(`${src}: ratio ${(realW / realH).toFixed(2)}:1 — looks like an untrimmed art-board`);
}

if (/[hw]-\[\$\{/.test(code)) fail.push('Logo.tsx builds a Tailwind class from a variable; the JIT will not generate it');

for (const m of manifest.matchAll(/^\s+(\w+): (\d+),$/gm)) {
  const [, name, px] = m;
  if (['width', 'height'].includes(name)) continue;
  if (!code.includes(`h-[${px}px]`)) fail.push(`LOGO_HEIGHT.${name} is ${px}px but no literal h-[${px}px] exists in Logo.tsx`);
}

if (fail.length) { console.error('brand:verify FAILED'); fail.forEach((f) => console.error('  - ' + f)); process.exit(1); }
console.log('brand:verify passed — manifest, classes and files agree');
