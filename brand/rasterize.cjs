/**
 * Rasterize brand SVGs to PNG @1x/@2x/@3x, apple-touch-icon, favicon.ico
 * One-shot script; deps installed with npm install --no-save sharp to-ico
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const toIco = require('to-ico');

const root = path.join(__dirname, '..');
const brand = path.join(root, 'brand');
const pngDir = path.join(brand, 'png');
const assets = path.join(root, 'assets');

fs.mkdirSync(pngDir, { recursive: true });
fs.mkdirSync(assets, { recursive: true });

async function raster(svgName, outBase, sizes) {
  const svg = fs.readFileSync(path.join(brand, svgName));
  for (const size of sizes) {
    const suffix = size.suffix || '';
    const out = path.join(pngDir, `${outBase}${suffix}.png`);
    await sharp(svg, { density: 300 })
      .resize(size.w, size.h, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(out);
    console.log('wrote', path.relative(root, out));
  }
}

async function main() {
  // Mark: 32 / 64 / 96 (@1x @2x @3x of 32px)
  await raster('logo-mark.svg', 'logo-mark', [
    { w: 32, h: 32, suffix: '@1x' },
    { w: 64, h: 64, suffix: '@2x' },
    { w: 96, h: 96, suffix: '@3x' },
  ]);

  // Wordmark: 220×36 base
  await raster('logo-wordmark.svg', 'logo-wordmark', [
    { w: 220, h: 36, suffix: '@1x' },
    { w: 440, h: 72, suffix: '@2x' },
    { w: 660, h: 108, suffix: '@3x' },
  ]);

  // Lockup
  await raster('logo.svg', 'logo', [
    { w: 268, h: 40, suffix: '@1x' },
    { w: 536, h: 80, suffix: '@2x' },
    { w: 804, h: 120, suffix: '@3x' },
  ]);

  // Apple touch icon 180×180
  const markSvg = fs.readFileSync(path.join(brand, 'logo-mark.svg'));
  const applePath = path.join(brand, 'apple-touch-icon.png');
  await sharp(markSvg, { density: 300 })
    .resize(180, 180, { fit: 'contain', background: { r: 63, g: 111, b: 91, alpha: 1 } })
    .png()
    .toFile(applePath);
  console.log('wrote', path.relative(root, applePath));

  // Favicon.ico from 16/32/48 PNGs
  const buffers = [];
  for (const s of [16, 32, 48]) {
    buffers.push(
      await sharp(markSvg, { density: 300 })
        .resize(s, s, { fit: 'contain', background: { r: 63, g: 111, b: 91, alpha: 1 } })
        .png()
        .toBuffer()
    );
  }
  const ico = await toIco(buffers);
  const icoPath = path.join(brand, 'favicon.ico');
  fs.writeFileSync(icoPath, ico);
  console.log('wrote', path.relative(root, icoPath));

  // Copy working set into assets/
  const copies = [
    ['logo-mark.svg', 'logo-mark.svg'],
    ['logo-wordmark.svg', 'logo-wordmark.svg'],
    ['logo.svg', 'logo.svg'],
    ['logo-mark-mono-black.svg', 'logo-mark-mono-black.svg'],
    ['logo-mark-mono-white.svg', 'logo-mark-mono-white.svg'],
    ['favicon.ico', 'favicon.ico'],
    ['apple-touch-icon.png', 'apple-touch-icon.png'],
  ];
  for (const [from, to] of copies) {
    fs.copyFileSync(path.join(brand, from), path.join(assets, to));
    console.log('assets/', to);
  }
  // Also copy primary PNG mark sizes into assets
  for (const suffix of ['@1x', '@2x', '@3x']) {
    const name = `logo-mark${suffix}.png`;
    fs.copyFileSync(path.join(pngDir, name), path.join(assets, name));
    console.log('assets/', name);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
