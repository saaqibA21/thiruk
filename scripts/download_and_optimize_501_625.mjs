import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const PUBLIC_THIRUK_DIR = path.join(ROOT_DIR, 'public', 'thiruk_image');
const PUBLIC_KURAL_DIR = path.join(ROOT_DIR, 'public', 'kural_images');

[PUBLIC_THIRUK_DIR, PUBLIC_KURAL_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const rawMap = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'gdrive_all_kurals.json'), 'utf8'));
const allItems = Object.entries(rawMap).map(([num, data]) => ({
  num: parseInt(num),
  fileId: data.fileId,
  filename: data.filename
})).sort((a, b) => a.num - b.num);

// Filter out already processed valid files
const items = allItems.filter(item => {
  const p1 = path.join(PUBLIC_THIRUK_DIR, `${item.num}.webp`);
  const p2 = path.join(PUBLIC_THIRUK_DIR, `${item.num}.jpg`);
  return !fs.existsSync(p1) || !fs.existsSync(p2) || fs.statSync(p1).size < 1000;
});

console.log(`=======================================================`);
console.log(`🚀 PROCESSING KURALS 501 - 625 (${items.length} remaining of ${allItems.length})`);
console.log(`=======================================================\n`);

async function fetchBufferWithRetry(fileId, retries = 3) {
  const urls = [
    `https://lh3.googleusercontent.com/d/${fileId}=w2048`,
    `https://drive.usercontent.google.com/download?id=${fileId}&export=download&authuser=0`,
    `https://lh3.googleusercontent.com/d/${fileId}=w1600`
  ];

  for (let attempt = 0; attempt < retries; attempt++) {
    for (const url of urls) {
      try {
        const res = await fetch(url, {
          signal: AbortSignal.timeout(7000),
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        if (res.ok) {
          const buf = Buffer.from(await res.arrayBuffer());
          if (buf.length > 5000) return buf;
        }
      } catch (e) {
        // try next url
      }
    }
    await new Promise(r => setTimeout(r, 600 * (attempt + 1)));
  }
  throw new Error(`Failed to download fileId ${fileId} after ${retries} attempts`);
}

async function processItem(item) {
  const { num, fileId, filename } = item;
  try {
    const rawBuffer = await fetchBufferWithRetry(fileId);

    // 1. WebP (1024px max, quality 80)
    const webpBuf = await sharp(rawBuffer)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    // 2. MozJPEG (1024px max, quality 82)
    const jpgBuf = await sharp(rawBuffer)
      .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();

    // Save to both public paths
    fs.writeFileSync(path.join(PUBLIC_THIRUK_DIR, `${num}.webp`), webpBuf);
    fs.writeFileSync(path.join(PUBLIC_THIRUK_DIR, `${num}.jpg`), jpgBuf);
    fs.writeFileSync(path.join(PUBLIC_KURAL_DIR, `${num}.webp`), webpBuf);
    fs.writeFileSync(path.join(PUBLIC_KURAL_DIR, `${num}.jpg`), jpgBuf);

    console.log(`✅ Kural #${num} processed (${filename}): WebP = ${Math.round(webpBuf.length/1024)}KB, JPG = ${Math.round(jpgBuf.length/1024)}KB`);
    return { success: true, num };
  } catch (e) {
    console.error(`❌ Error on Kural #${num}:`, e.message);
    return { success: false, num, error: e.message };
  }
}

async function main() {
  const CONCURRENCY = 6;
  const results = [];
  
  for (let i = 0; i < items.length; i += CONCURRENCY) {
    const chunk = items.slice(i, i + CONCURRENCY);
    const chunkResults = await Promise.all(chunk.map(processItem));
    results.push(...chunkResults);
    console.log(`Progress: ${Math.min(i + CONCURRENCY, items.length)} / ${items.length} completed...`);
  }

  const successes = results.filter(r => r.success);
  const failures = results.filter(r => !r.success);

  console.log(`\n=======================================================`);
  console.log(`🎉 COMPLETED BATCH!`);
  console.log(`• Successfully processed: ${successes.length} / ${items.length}`);
  if (failures.length > 0) {
    console.log(`• Failures:`, failures);
  }
  console.log(`=======================================================\n`);
}

main().catch(console.error);
