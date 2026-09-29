/**
 * Trim a PNG to its visible content.
 *
 * The brand exports sit on square art-boards: the 750x750 file contains a
 * 330x60 wordmark and 96.5% transparent padding. Rendered into any box the
 * glyphs shrink to a fraction of it, off-centre — which is what "the logo looks
 * bad" turns out to be, before resolution is even considered.
 *
 * Padding cannot be removed in CSS without hard-coding a crop per asset, so it
 * is removed from the file. See ./png.js for why there is no image library.
 */
const fs = require('fs');
const { decode, encode, bounds } = require('./png');

const [src, dest, padArg] = process.argv.slice(2);
if (!src || !dest) { console.error('usage: trim-logo.js <src.png> <dest.png> [padding-px]'); process.exit(2); }
const pad = Number(padArg || 0);

const img = decode(src);
const b = bounds(img);
const x0 = Math.max(0, b.minX - pad), y0 = Math.max(0, b.minY - pad);
const x1 = Math.min(img.w - 1, b.maxX + pad), y1 = Math.min(img.h - 1, b.maxY + pad);
const cw = x1 - x0 + 1, ch = y1 - y0 + 1;

const out = Buffer.alloc(cw * ch * img.bpp);
for (let y = 0; y < ch; y++) {
  const from = (y0 + y) * img.w * img.bpp + x0 * img.bpp;
  img.px.copy(out, y * cw * img.bpp, from, from + cw * img.bpp);
}
fs.writeFileSync(dest, encode({ w: cw, h: ch, bpp: img.bpp, ctype: img.ctype, px: out }));
console.log(`  ${src.split('/').pop()} ${img.w}x${img.h}  ->  ${dest.split('/').pop()} ${cw}x${ch}  (${(cw / ch).toFixed(2)}:1, ${(fs.statSync(dest).size / 1024).toFixed(1)}KB)`);
