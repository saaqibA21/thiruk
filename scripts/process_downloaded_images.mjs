/**
 * Thirukkural AI - Dual Engine (English + Tamil) OCR Identification Pipeline
 * 
 * Accurately detects and maps both:
 * Layout 1: Left-aligned Tamil + English Transliteration cards (Kurals 1081-1330)
 * Layout 2: Center-banner Tamil Couplet illuminated artwork (Kurals 1-1080)
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

// Load Thirukkural Dataset
const dataPath = path.join(ROOT_DIR, 'thirukkural.json');
const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const kurals = rawData.kural || rawData;

// Normalize English Text
function normalizeEngText(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Clean Tamil Text
function cleanTamilText(text) {
  return (text || '')
    .replace(/[^\u0B80-\u0BFF\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Index Kurals for English & Tamil token lookup
const indexedKurals = kurals.map(k => {
  const normTrans1 = normalizeEngText(k.transliteration1 || '');
  const normTrans2 = normalizeEngText(k.transliteration2 || '');
  const normEng = normalizeEngText(k.Translation || k.explanation || '');

  const engTokens = new Set([
    ...normTrans1.split(' '),
    ...normTrans2.split(' '),
    ...normEng.split(' ')
  ].filter(t => t.length > 2));

  const cleanTam1 = cleanTamilText(k.Line1);
  const cleanTam2 = cleanTamilText(k.Line2);
  const tamTokens = new Set([
    ...cleanTam1.split(' '),
    ...cleanTam2.split(' ')
  ].filter(t => t.length > 2));

  return {
    number: k.Number,
    line1: k.Line1,
    line2: k.Line2,
    engTokens,
    tamTokens
  };
});

function matchEnglish(text) {
  const clean = normalizeEngText(text);
  const tokens = clean.split(' ').filter(t => t.length > 2);
  let best = null;
  let bestScore = 0;

  for (const k of indexedKurals) {
    let score = 0;
    for (const t of tokens) {
      if (k.engTokens.has(t)) score += t.length;
    }
    if (score > bestScore) {
      bestScore = score;
      best = k;
    }
  }
  return { kural: best, score: bestScore };
}

function matchTamil(text) {
  const clean = cleanTamilText(text);
  const tokens = clean.split(' ').filter(t => t.length > 2);
  let best = null;
  let bestScore = 0;

  for (const k of indexedKurals) {
    let score = 0;
    for (const t of tokens) {
      if (k.tamTokens.has(t)) score += t.length * 2;
      else {
        // Substring / fuzzy match
        for (const kt of k.tamTokens) {
          if (kt.includes(t) || t.includes(kt)) {
            score += Math.min(t.length, kt.length);
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

async function main() {
  console.log('================================================================');
  console.log('🔍 DUAL (TAMIL + ENGLISH) OCR IDENTIFICATION PIPELINE');
  console.log('================================================================');

  const files = fs.readdirSync(DOWNLOADS_DIR)
    .filter(f => f.startsWith('Gemini_Generation_') && f.endsWith('.png'))
    .map(f => {
      const full = path.join(DOWNLOADS_DIR, f);
      return { name: f, full, mtime: fs.statSync(full).mtime };
    })
    .sort((a, b) => a.mtime - b.mtime);

  console.log(`Found ${files.length} Gemini images in Downloads\n`);

  const engWorker = await createWorker('eng');
  const tamWorker = await createWorker('tam');

  let matchedCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    try {
      const meta = await sharp(file.full).metadata();
      const W = meta.width;
      const H = meta.height;

      // Pass 1: English OCR on top-left
      const cropLeft = await sharp(file.full)
        .extract({ left: 0, top: 0, width: Math.round(W * 0.70), height: Math.round(H * 0.55) })
        .grayscale()
        .linear(1.4, -20)
        .png()
        .toBuffer();

      const engRes = await engWorker.recognize(cropLeft);
      let { kural, score } = matchEnglish(engRes.data.text);

      // Pass 2: Tamil OCR on top scroll banner if English score is low
      if (!kural || score < 12) {
        const cropBanner = await sharp(file.full)
          .extract({ left: Math.round(W * 0.10), top: Math.round(H * 0.04), width: Math.round(W * 0.80), height: Math.round(H * 0.28) })
          .grayscale()
          .linear(1.5, -20)
          .png()
          .toBuffer();

        const tamRes = await tamWorker.recognize(cropBanner);
        const tamMatch = matchTamil(tamRes.data.text);
        if (tamMatch.score > score) {
          kural = tamMatch.kural;
          score = tamMatch.score;
        }
      }

      if (kural && score >= 10) {
        const num = kural.number;
        console.log(`[${i + 1}/${files.length}] ✅ Identified -> Kural #${num} (Score: ${score}): "${kural.line1.slice(0, 30)}..."`);

        // Save original PNG
        fs.copyFileSync(file.full, path.join(THIRUK_DIR, `${num}.png`));

        // Generate 1024px WebP and JPG
        const inputBuf = fs.readFileSync(file.full);
        const webpBuf = await sharp(inputBuf)
          .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();

        const jpgBuf = await sharp(inputBuf)
          .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 82, mozjpeg: true })
          .toBuffer();

        // Save to public locations
        fs.writeFileSync(path.join(PUBLIC_THIRUK_DIR, `${num}.webp`), webpBuf);
        fs.writeFileSync(path.join(PUBLIC_THIRUK_DIR, `${num}.jpg`), jpgBuf);
        fs.writeFileSync(path.join(PUBLIC_KURAL_DIR, `${num}.webp`), webpBuf);
        fs.writeFileSync(path.join(PUBLIC_KURAL_DIR, `${num}.jpg`), jpgBuf);

        matchedCount++;
      } else {
        console.log(`[${i + 1}/${files.length}] ⚠️ Skipped: ${file.name} (Score: ${score})`);
        skippedCount++;
      }
    } catch (err) {
      console.error(`[${i + 1}/${files.length}] ❌ Error ${file.name}:`, err.message);
      skippedCount++;
    }
  }

  await engWorker.terminate();
  await tamWorker.terminate();

  console.log('\n================================================================');
  console.log('🎉 OCR PIPELINE COMPLETED');
  console.log('================================================================');
  console.log(`• Total Processed: ${files.length}`);
  console.log(`• Successfully Matched & Added: ${matchedCount}`);
  console.log(`• Skipped: ${skippedCount}`);
  console.log('================================================================\n');
}

main().catch(console.error);
