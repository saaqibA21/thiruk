/**
 * Image Watermark Cleaner using Node.js + Sharp
 * 
 * Performs seamless patch inpainting & texture reconstruction on the bottom-right
 * watermark region across all background images and Kural cards.
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Clean a single image by reading into memory first
export async function cleanImageWatermark(imagePath) {
  if (!fs.existsSync(imagePath)) return false;

  const fileBuffer = fs.readFileSync(imagePath);
  const image = sharp(fileBuffer);
  const meta = await image.metadata();
  const { width, height } = meta;

  if (!width || !height || width < 120 || height < 120) return false;

  // Watermark bounding box at bottom-right
  const boxW = Math.min(85, Math.round(width * 0.10));
  const boxH = Math.min(85, Math.round(height * 0.10));
  const boxX = width - boxW;
  const boxY = height - boxH;

  // Extract raw pixels for clean reconstruction
  const { data, info } = await sharp(fileBuffer)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const channels = info.channels; // 3 or 4

  // Inpaint: reconstruct the watermark box by blending neighboring clean columns & rows
  for (let y = boxY; y < height; y++) {
    for (let x = boxX; x < width; x++) {
      const idx = (y * width + x) * channels;
      
      const u = (x - boxX) / boxW;
      const v = (y - boxY) / boxH;

      const leftX = Math.max(0, boxX - 1 - Math.round(u * 12));
      const leftIdx = (y * width + leftX) * channels;

      const topY = Math.max(0, boxY - 1 - Math.round(v * 12));
      const topIdx = (topY * width + x) * channels;

      const wLeft = 1 - u;
      const wTop = 1 - v;
      const totalW = (wLeft + wTop) || 1;

      for (let c = 0; c < channels; c++) {
        const valLeft = data[leftIdx + c];
        const valTop = data[topIdx + c];
        data[idx + c] = Math.round((valLeft * wLeft + valTop * wTop) / totalW);
      }
    }
  }

  // Write cleaned image back
  const format = meta.format || 'jpeg';
  let pipeline = sharp(data, {
    raw: {
      width,
      height,
      channels
    }
  });

  if (format === 'png') {
    pipeline = pipeline.png({ quality: 95 });
  } else if (format === 'webp') {
    pipeline = pipeline.webp({ quality: 92 });
  } else {
    pipeline = pipeline.jpeg({ quality: 92 });
  }

  const cleanBuffer = await pipeline.toBuffer();
  fs.writeFileSync(imagePath, cleanBuffer);
  return true;
}

async function main() {
  console.log('================================================================');
  console.log('🧹 CLEANING WATERMARKS FROM BACKGROUND IMAGES & MEDIA');
  console.log('================================================================');

  const targetDirs = [
    path.join(ROOT_DIR, 'public'),
    path.join(ROOT_DIR, 'public', 'thiruk_image'),
    path.join(ROOT_DIR, 'public', 'kural_images'),
    path.join(ROOT_DIR, 'thiruk_image')
  ];

  let cleaned = 0;

  for (const dir of targetDirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(file).toLowerCase())) {
        const fullPath = path.join(dir, file);
        const isDir = fs.statSync(fullPath).isDirectory();
        if (isDir) continue;

        try {
          const ok = await cleanImageWatermark(fullPath);
          if (ok) {
            console.log(`✅ Cleaned: ${path.relative(ROOT_DIR, fullPath)}`);
            cleaned++;
          }
        } catch (e) {
          console.warn(`⚠️ Skipped ${file}: ${e.message}`);
        }
      }
    }
  }

  console.log('\n================================================================');
  console.log(`🎉 All images cleanly processed: ${cleaned} files!`);
  console.log('================================================================\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(console.error);
}
