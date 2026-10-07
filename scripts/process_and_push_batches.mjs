import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const KURAL_DIR = path.join(ROOT_DIR, 'public', 'kural_images');
const THIRUK_DIR = path.join(ROOT_DIR, 'public', 'thiruk_image');

async function blurImageWatermark(filePath, isWebp) {
  if (!fs.existsSync(filePath)) return false;
  try {
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
  } catch (e) {
    console.error(`Error blurring ${path.basename(filePath)}:`, e.message);
    return false;
  }
}

async function processKural(num) {
  const tasks = [];
  
  // public/kural_images
  const kWebp = path.join(KURAL_DIR, `${num}.webp`);
  const kJpg = path.join(KURAL_DIR, `${num}.jpg`);
  if (fs.existsSync(kWebp)) tasks.push(blurImageWatermark(kWebp, true));
  if (fs.existsSync(kJpg)) tasks.push(blurImageWatermark(kJpg, false));

  // public/thiruk_image
  const tWebp = path.join(THIRUK_DIR, `${num}.webp`);
  const tJpg = path.join(THIRUK_DIR, `${num}.jpg`);
  if (fs.existsSync(tWebp)) tasks.push(blurImageWatermark(tWebp, true));
  if (fs.existsSync(tJpg)) tasks.push(blurImageWatermark(tJpg, false));

  if (tasks.length === 0) return false;
  await Promise.all(tasks);
  return true;
}

const BATCHES = [
  { start: 1, end: 200 },
  { start: 201, end: 400 },
  { start: 401, end: 600 },
  { start: 601, end: 800 },
  { start: 801, end: 1000 },
  { start: 1001, end: 1200 },
  { start: 1201, end: 1330 }
];

async function run() {
  console.log(`=======================================================`);
  console.log(`🚀 STARTING WATERMARK REMOVAL ACROSS ALL 1330 KURALS`);
  console.log(`=======================================================\n`);

  for (let b = 0; b < BATCHES.length; b++) {
    const { start, end } = BATCHES[b];
    console.log(`\n-------------------------------------------------------`);
    console.log(`[Batch ${b + 1}/${BATCHES.length}] Processing Kurals ${start} to ${end}...`);
    console.log(`-------------------------------------------------------`);

    const nums = [];
    for (let i = start; i <= end; i++) nums.push(i);

    const CONCURRENCY = 12;
    for (let i = 0; i < nums.length; i += CONCURRENCY) {
      const chunk = nums.slice(i, i + CONCURRENCY);
      await Promise.all(chunk.map(processKural));
    }

    console.log(`[Batch ${b + 1}] Staging and committing to git...`);
    try {
      execSync('git add public/kural_images', { cwd: ROOT_DIR, stdio: 'inherit' });
      execSync(`git commit -m "Blur Gemini watermark on Kurals ${start}-${end}"`, { cwd: ROOT_DIR, stdio: 'inherit' });
      console.log(`[Batch ${b + 1}] Pushing to origin main...`);
      execSync('git push origin main', { cwd: ROOT_DIR, stdio: 'inherit' });
      console.log(`✅ [Batch ${b + 1}/${BATCHES.length}] Kurals ${start}-${end} successfully pushed!`);
    } catch (e) {
      console.log(`Notice on commit/push: ${e.message}`);
    }
  }

  console.log(`\n=======================================================`);
  console.log(`🎉 ALL 7 BATCHES COMPLETE!`);
  console.log(`Building production bundle & deploying to GitHub Pages...`);
  console.log(`=======================================================\n`);

  execSync('npm run build', { cwd: ROOT_DIR, stdio: 'inherit' });
  execSync('node scripts/deploy.mjs', { cwd: ROOT_DIR, stdio: 'inherit' });

  console.log(`\n🎉 FULL DEPLOYMENT TO GITHUB PAGES & VERCEL COMPLETE!\n`);
}

run().catch(console.error);
