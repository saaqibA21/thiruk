import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const KURAL_DIR = path.join(ROOT_DIR, 'public', 'kural_images');
const THIRUK_DIR = path.join(ROOT_DIR, 'public', 'thiruk_image');

const startArg = parseInt(process.argv[2]) || 1;
const endArg = parseInt(process.argv[3]) || 1330;

console.log(`=======================================================`);
console.log(`🧹 BLURRING GEMINI WATERMARK: Kurals ${startArg} to ${endArg}`);
console.log(`=======================================================\n`);

async function blurImageWatermark(filePath, isWebp) {
  if (!fs.existsSync(filePath)) return false;
  const fileBuffer = fs.readFileSync(filePath);
  const meta = await sharp(fileBuffer).metadata();
  const W = meta.width, H = meta.height;
  if (!W || !H || W < 200 || H < 200) return false;

  const scale = W / 1024;
  const width = Math.round(96 * scale);
  const height = Math.round(96 * scale);
  const left = Math.max(0, Math.round(W - (128 * scale)));
  const top = Math.max(0, Math.round(H - (126 * scale)));

  if (left + width > W || top + height > H) return false;

  const svgMask = Buffer.from(`
    <svg width="${width}" height="${height}">
      <defs>
        <radialGradient id="grad" cx="50%" cy="50%" r="50%">
          <stop offset="55%" stop-color="white" stop-opacity="1" />
          <stop offset="100%" stop-color="white" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad)" />
    </svg>
  `);

  const maskPng = await sharp(svgMask).png().toBuffer();

  const blurredBox = await sharp(fileBuffer)
    .extract({ left, top, width, height })
    .blur(18)
    .composite([{ input: maskPng, blend: 'dest-in' }])
    .png()
    .toBuffer();

  let pipeline = sharp(fileBuffer)
    .composite([{ input: blurredBox, left, top }]);

  if (isWebp) {
    pipeline = pipeline.webp({ quality: 80 });
  } else {
    pipeline = pipeline.jpeg({ quality: 82, mozjpeg: true });
  }

  const outBuf = await pipeline.toBuffer();
  fs.writeFileSync(filePath, outBuf);
  return true;
}

async function processKural(num) {
  const tasks = [];
  
  // 1. public/kural_images
  const kWebp = path.join(KURAL_DIR, `${num}.webp`);
  const kJpg = path.join(KURAL_DIR, `${num}.jpg`);
  if (fs.existsSync(kWebp)) tasks.push(blurImageWatermark(kWebp, true));
  if (fs.existsSync(kJpg)) tasks.push(blurImageWatermark(kJpg, false));

  // 2. public/thiruk_image
  const tWebp = path.join(THIRUK_DIR, `${num}.webp`);
  const tJpg = path.join(THIRUK_DIR, `${num}.jpg`);
  if (fs.existsSync(tWebp)) tasks.push(blurImageWatermark(tWebp, true));
  if (fs.existsSync(tJpg)) tasks.push(blurImageWatermark(tJpg, false));

  if (tasks.length === 0) return { num, processed: false };

  await Promise.all(tasks);
  return { num, processed: true };
}

async function main() {
  const nums = [];
  for (let i = startArg; i <= endArg; i++) nums.push(i);

  const CONCURRENCY = 10;
  let count = 0;

  for (let i = 0; i < nums.length; i += CONCURRENCY) {
    const chunk = nums.slice(i, i + CONCURRENCY);
    const results = await Promise.all(chunk.map(processKural));
    count += results.filter(r => r.processed).length;
    if ((i + CONCURRENCY) % 50 === 0 || i + CONCURRENCY >= nums.length) {
      console.log(`Progress: ${Math.min(i + CONCURRENCY, nums.length)} / ${nums.length} Kurals processed...`);
    }
  }

  console.log(`\n🎉 Completed blurring for ${count} Kurals in range ${startArg}-${endArg}!\n`);
}

main().catch(console.error);
