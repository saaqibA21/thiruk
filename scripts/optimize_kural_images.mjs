/**
 * Thirukkural AI - Image Web Optimization Pipeline
 * 
 * Converts heavy raw 9MB PNGs into lightweight 1024px WebP / JPG images (~100KB)
 * Keeps uncompressed PNGs safely in root `thiruk_image/` while `public/thiruk_image/`
 * contains optimized web-ready assets for instant loading and GitHub Pages deployment.
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const SRC_DIR = path.join(ROOT_DIR, 'thiruk_image');
const PUBLIC_THIRUK_DIR = path.join(ROOT_DIR, 'public', 'thiruk_image');
const PUBLIC_KURAL_DIR = path.join(ROOT_DIR, 'public', 'kural_images');

[PUBLIC_THIRUK_DIR, PUBLIC_KURAL_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

async function optimizeImage(num) {
  const pngPath = path.join(SRC_DIR, `${num}.png`);
  const jpgPath = path.join(SRC_DIR, `${num}.jpg`);
  const sourcePath = fs.existsSync(pngPath) ? pngPath : (fs.existsSync(jpgPath) ? jpgPath : null);

  if (!sourcePath) return false;

  const targetWebp1 = path.join(PUBLIC_THIRUK_DIR, `${num}.webp`);
  const targetJpg1 = path.join(PUBLIC_THIRUK_DIR, `${num}.jpg`);
  const targetWebp2 = path.join(PUBLIC_KURAL_DIR, `${num}.webp`);
  const targetJpg2 = path.join(PUBLIC_KURAL_DIR, `${num}.jpg`);

  try {
    const inputBuffer = fs.readFileSync(sourcePath);

    // Generate 1024px WebP (~100KB)
    const webpBuffer = await sharp(inputBuffer)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80, effort: 4 })
      .toBuffer();

    // Generate 1024px JPG (~130KB)
    const jpgBuffer = await sharp(inputBuffer)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();

    fs.writeFileSync(targetWebp1, webpBuffer);
    fs.writeFileSync(targetJpg1, jpgBuffer);
    fs.writeFileSync(targetWebp2, webpBuffer);
    fs.writeFileSync(targetJpg2, jpgBuffer);

    // Remove heavy raw PNG from public directory if exists
    const pubPng1 = path.join(PUBLIC_THIRUK_DIR, `${num}.png`);
    const pubPng2 = path.join(PUBLIC_KURAL_DIR, `${num}.png`);
    if (fs.existsSync(pubPng1)) fs.unlinkSync(pubPng1);
    if (fs.existsSync(pubPng2)) fs.unlinkSync(pubPng2);

    return true;
  } catch (err) {
    console.error(`Error optimizing Kural #${num}:`, err.message);
    return false;
  }
}

async function main() {
  console.log('================================================================');
  console.log('⚡ OPTIMIZING 500 KURAL IMAGES FOR WEB & GITHUB PAGES');
  console.log('================================================================');

  const files = fs.readdirSync(SRC_DIR);
  const kuralNums = [];

  for (const f of files) {
    const match = f.match(/^(\d+)\.(png|jpg|jpeg|webp)$/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (!kuralNums.includes(num)) kuralNums.push(num);
    }
  }

  kuralNums.sort((a, b) => a - b);
  console.log(`Found ${kuralNums.length} Kural source images in ${SRC_DIR}`);

  const batchSize = 15;
  let completed = 0;

  for (let i = 0; i < kuralNums.length; i += batchSize) {
    const batch = kuralNums.slice(i, i + batchSize);
    await Promise.all(batch.map(num => optimizeImage(num)));
    completed += batch.length;
    process.stdout.write(`\rProgress: ${completed}/${kuralNums.length} (${Math.round(completed / kuralNums.length * 100)}%)`);
  }

  console.log('\n================================================================');
  console.log('🎉 IMAGE OPTIMIZATION COMPLETE!');
  console.log('================================================================\n');
}

main().catch(console.error);
