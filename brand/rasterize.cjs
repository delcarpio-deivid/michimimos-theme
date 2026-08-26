/**

 * Rasterize brand PNGs to @1x/@2x/@3x, apple-touch-icon, favicon.ico

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



async function rasterPng(inputPath, outBase, sizes) {

  for (const size of sizes) {

    const suffix = size.suffix || '';

    const out = path.join(pngDir, `${outBase}${suffix}.png`);

    await sharp(inputPath)

      .resize(size.w, size.h, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })

      .png()

      .toFile(out);

    console.log('wrote', path.relative(root, out));

  }

}



async function main() {

  const markSource = path.join(assets, 'logo-mark@3x.png');

  const markMeta = await sharp(markSource).metadata();

  const aspect = markMeta.width / markMeta.height;

  const baseW = 301;

  const baseH = Math.round(baseW / aspect);



  await rasterPng(markSource, 'logo-mark', [

    { w: baseW, h: baseH, suffix: '' },

    { w: baseW * 2, h: baseH * 2, suffix: '@2x' },

    { w: baseW * 3, h: baseH * 3, suffix: '@3x' },

  ]);



  const applePath = path.join(brand, 'apple-touch-icon.png');

  await sharp(markSource)

    .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })

    .png()

    .toFile(applePath);

  console.log('wrote', path.relative(root, applePath));



  const buffers = [];

  for (const s of [16, 32, 48]) {

    buffers.push(

      await sharp(markSource)

        .resize(s, s, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })

        .png()

        .toBuffer()

    );

  }

  const icoPath = path.join(brand, 'favicon.ico');

  fs.writeFileSync(icoPath, await toIco(buffers));

  console.log('wrote', path.relative(root, icoPath));



  const copies = [

    ['favicon.ico', 'favicon.ico'],

    ['apple-touch-icon.png', 'apple-touch-icon.png'],

  ];

  for (const [from, to] of copies) {

    fs.copyFileSync(path.join(brand, from), path.join(assets, to));

    console.log('assets/', to);

  }



  for (const suffix of ['', '@2x', '@3x']) {

    const name = `logo-mark${suffix}.png`;

    fs.copyFileSync(path.join(pngDir, name), path.join(assets, name));

    console.log('assets/', name);

  }



  for (const name of ['logo-lockup.png', 'logo-wordmark.png']) {

    const src = path.join(assets, name);

    if (fs.existsSync(src)) {

      console.log('kept', name);

    }

  }

}



main().catch((err) => {

  console.error(err);

  process.exit(1);

});


