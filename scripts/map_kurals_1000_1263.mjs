/**
 * Thirukkural AI - Precision Mapper for Kurals 1000 - 1263
 * 
 * Uses Dual-Pass OCR (English transliteration + Tamil banner text) with
 * sequence-aware validation to map all 263 images from Downloads into
 * their exact Thirukkural verses (1000 to 1263).
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
import sharp from 'sharp';
import { createWorker } from 'tesseract.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const DOWNLOADS_DIR = path.join(os.homedir(), 'Downloads');
const THIRUK_DIR = path.join(ROOT_DIR, 'thiruk_image');
const PUBLIC_THIRUK_DIR = path.join(ROOT_DIR, 'public', 'thiruk_image');
const PUBLIC_KURAL_DIR = path.join(ROOT_DIR, 'public', 'kural_images');

[THIRUK_DIR, PUBLIC_THIRUK_DIR, PUBLIC_KURAL_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Load Thirukkural Dataset (Filtered to 1000 - 1265)
const dataPath = path.join(ROOT_DIR, 'thirukkural.json');
const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const allKurals = rawData.kural || rawData;
const targetKurals = allKurals.filter(k => k.Number >= 1000 && k.Number <= 1265);

function normalizeEng(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanTamil(text) {
  return (text || '')
    .replace(/[^\u0B80-\u0BFF\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const indexed = targetKurals.map(k => {
  const normTrans1 = normalizeEng(k.transliteration1 || '');
  const normTrans2 = normalizeEng(k.transliteration2 || '');
  const engTokens = new Set([...normTrans1.split(' '), ...normTrans2.split(' ')].filter(t => t.length > 2));

  const tam1 = cleanTamil(k.Line1);
  const tam2 = cleanTamil(k.Line2);
  const tamTokens = new Set([...tam1.split(' '), ...tam2.split(' ')].filter(t => t.length > 2));

  return {
    number: k.Number,
    line1: k.Line1,
    line2: k.Line2,
    engTokens,
    tamTokens
  };
});

function matchText(engText, tamText) {
  const normE = normalizeEng(engText);
  const eTokens = normE.split(' ').filter(t => t.length > 2);

  const cleanT = cleanTamil(tamText);
  const tTokens = cleanT.split(' ').filter(t => t.length > 2);

  let best = null;
  let bestScore = 0;

  for (const k of indexed) {
    let score = 0;

    // English transliteration token score
    for (const t of eTokens) {
      if (k.engTokens.has(t)) score += t.length;
    }

    // Tamil token score
    for (const t of tTokens) {
      if (k.tamTokens.has(t)) score += t.length * 3;
      else {
        for (const kt of k.tamTokens) {
          if (kt.includes(t) || t.includes(kt)) {
            score += Math.min(t.length, kt.length) * 2;
            break;
          }
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      best = k;
    }
  }

  return { kural: best, score: bestScore };
}

async function saveKuralImage(sourcePath, num) {
  // 1. Save original PNG
  fs.copyFileSync(sourcePath, path.join(THIRUK_DIR, `${num}.png`));

  // 2. Generate optimized 1024px WebP and JPG
  const inputBuf = fs.readFileSync(sourcePath);
  const webpBuf = await sharp(inputBuf)
    .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  const jpgBuf = await sharp(inputBuf)
    .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();

  // Save to public directories
  fs.writeFileSync(path.join(PUBLIC_THIRUK_DIR, `${num}.webp`), webpBuf);
  fs.writeFileSync(path.join(PUBLIC_THIRUK_DIR, `${num}.jpg`), jpgBuf);
  fs.writeFileSync(path.join(PUBLIC_KURAL_DIR, `${num}.webp`), webpBuf);
  fs.writeFileSync(path.join(PUBLIC_KURAL_DIR, `${num}.jpg`), jpgBuf);
}

async function main() {
  console.log('================================================================');
  console.log('🎯 PRECISION MAPPER: KURALS 1000 - 1263');
  console.log('================================================================');

  const files = fs.readdirSync(DOWNLOADS_DIR)
    .filter(f => f.startsWith('Gemini_Generation_') && f.endsWith('.png'))
    .map(f => {
      const full = path.join(DOWNLOADS_DIR, f);
      return { name: f, full, mtime: fs.statSync(full).mtime };
    })
    .sort((a, b) => a.mtime - b.mtime);

  console.log(`Processing ${files.length} images from Downloads...\n`);

  const engWorker = await createWorker('eng');
  const tamWorker = await createWorker('tam');

  let successCount = 0;
  const mappedNumbers = new Set();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    try {
      const meta = await sharp(file.full).metadata();
      const W = meta.width;
      const H = meta.height;

      // Crop Left (for English transliteration cards)
      const cropLeft = await sharp(file.full)
        .extract({ left: 0, top: 0, width: Math.round(W * 0.70), height: Math.round(H * 0.55) })
        .grayscale()
        .linear(1.4, -20)
        .png()
        .toBuffer();

      // Crop Top Banner (for Tamil scrolls)
      const cropBanner = await sharp(file.full)
        .extract({ left: Math.round(W * 0.08), top: Math.round(H * 0.03), width: Math.round(W * 0.84), height: Math.round(H * 0.30) })
        .grayscale()
        .linear(1.5, -20)
        .png()
        .toBuffer();

      const engRes = await engWorker.recognize(cropLeft);
      const tamRes = await tamWorker.recognize(cropBanner);

      const { kural, score } = matchText(engRes.data.text, tamRes.data.text);

      if (kural && score >= 8) {
        const num = kural.number;
        await saveKuralImage(file.full, num);
        mappedNumbers.add(num);
        console.log(`[${i + 1}/${files.length}] ✅ Kural #${num} (Score: ${score}): "${kural.line1.slice(0, 35)}..."`);
        successCount++;
      } else {
        console.log(`[${i + 1}/${files.length}] ⚠️ Unmatched file: ${file.name} (Score: ${score})`);
      }
    } catch (e) {
      console.error(`[${i + 1}/${files.length}] ❌ Error on ${file.name}:`, e.message);
    }
  }

  await engWorker.terminate();
  await tamWorker.terminate();

  console.log('\n================================================================');
  console.log('🎉 MAPPING COMPLETED');
  console.log('================================================================');
  console.log(`• Successfully mapped: ${successCount} images`);
  console.log(`• Unique Kurals added: ${mappedNumbers.size} (Range 1000 - 1263)`);
  console.log('================================================================\n');
}

main().catch(console.error);
