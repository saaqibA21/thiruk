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
const PUBLIC_THIRUK_DIR = path.join(ROOT_DIR, 'public', 'thiruk_image');
const PUBLIC_KURAL_DIR = path.join(ROOT_DIR, 'public', 'kural_images');

[PUBLIC_THIRUK_DIR, PUBLIC_KURAL_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Load Thirukkural dataset
const dataPath = path.join(ROOT_DIR, 'thirukkural.json');
const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const allKurals = rawData.kural || rawData;
const targetKurals = allKurals.filter(k => k.Number >= 1260 && k.Number <= 1330);

function cleanTamil(text) {
  return (text || '')
    .replace(/[^\u0B80-\u0BFF\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeEng(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const indexed = targetKurals.map(k => {
  const tam1 = cleanTamil(k.Line1);
  const tam2 = cleanTamil(k.Line2);
  const tamTokens = new Set([...tam1.split(' '), ...tam2.split(' ')].filter(t => t.length > 1));

  const normTrans1 = normalizeEng(k.transliteration1 || '');
  const normTrans2 = normalizeEng(k.transliteration2 || '');
  const engTokens = new Set([...normTrans1.split(' '), ...normTrans2.split(' ')].filter(t => t.length > 2));

  return {
    number: k.Number,
    line1: k.Line1,
    line2: k.Line2,
    tamTokens,
    engTokens
  };
});

function matchText(tamText, engText) {
  const cleanT = cleanTamil(tamText);
  const tTokens = cleanT.split(' ').filter(t => t.length > 1);

  const normE = normalizeEng(engText);
  const eTokens = normE.split(' ').filter(t => t.length > 2);

  let best = null;
  let bestScore = 0;

  for (const k of indexed) {
    let score = 0;

    // Tamil exact and substring match
    for (const t of tTokens) {
      if (k.tamTokens.has(t)) {
        score += t.length * 4;
      } else {
        for (const kt of k.tamTokens) {
          if (kt.includes(t) || t.includes(kt)) {
            score += Math.min(t.length, kt.length) * 2;
            break;
          }
        }
      }
    }

    // English match
    for (const t of eTokens) {
      if (k.engTokens.has(t)) score += t.length;
    }

    if (score > bestScore) {
      bestScore = score;
      best = k;
    }
  }

  return { kural: best, score: bestScore };
}

async function saveKuralImage(sourcePath, num) {
  const inputBuf = fs.readFileSync(sourcePath);

  const webpBuf = await sharp(inputBuf)
    .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  const jpgBuf = await sharp(inputBuf)
    .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();

  fs.writeFileSync(path.join(PUBLIC_THIRUK_DIR, `${num}.webp`), webpBuf);
  fs.writeFileSync(path.join(PUBLIC_THIRUK_DIR, `${num}.jpg`), jpgBuf);
  fs.writeFileSync(path.join(PUBLIC_KURAL_DIR, `${num}.webp`), webpBuf);
  fs.writeFileSync(path.join(PUBLIC_KURAL_DIR, `${num}.jpg`), jpgBuf);
}

async function main() {
  console.log('================================================================');
  console.log('🎯 PRECISION MAPPER: KURALS 1262 - 1330 (68 Images)');
  console.log('================================================================');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const files = fs.readdirSync(DOWNLOADS_DIR)
    .filter(f => f.startsWith('Gemini_Generation_') && f.endsWith('.png'))
    .map(f => {
      const full = path.join(DOWNLOADS_DIR, f);
      return { name: f, full, mtime: fs.statSync(full).mtime };
    })
    .filter(f => f.mtime >= today)
    .sort((a, b) => a.mtime - b.mtime); // chronological

  console.log(`Processing ${files.length} images downloaded today...\n`);

  const worker = await createWorker(['tam', 'eng']);

  const matches = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      const meta = await sharp(file.full).metadata();
      const W = meta.width;
      const H = meta.height;

      // Extract top 40% where the Tamil couplet banner is
      const topBanner = await sharp(file.full)
        .extract({ left: 0, top: 0, width: W, height: Math.round(H * 0.40) })
        .grayscale()
        .linear(1.4, -20)
        .png()
        .toBuffer();

      const res = await worker.recognize(topBanner);
      const { kural, score } = matchText(res.data.text, res.data.text);

      matches.push({
        index: i,
        file,
        kural,
        score,
        ocrText: res.data.text.trim().replace(/\s+/g, ' ').slice(0, 80)
      });

      if (kural && score >= 8) {
        console.log(`[${i + 1}/${files.length}] ✅ Kural #${kural.number} (Score ${score}): "${kural.line1.slice(0, 30)}..." | ${file.name}`);
      } else {
        console.log(`[${i + 1}/${files.length}] ⚠️ Low confidence: (Score ${score}) OCR: "${res.data.text.slice(0, 40)}" | ${file.name}`);
      }
    } catch (e) {
      console.error(`[${i + 1}/${files.length}] ❌ Error on ${file.name}:`, e.message);
    }
  }

  await worker.terminate();

  fs.writeFileSync('kural_matches_68.json', JSON.stringify(matches.map(m => ({
    index: m.index,
    filename: m.file.name,
    kuralNumber: m.kural ? m.kural.number : null,
    score: m.score,
    ocrText: m.ocrText
  })), null, 2));

  console.log('\n================================================================');
  console.log('Validating sequence and saving images...');
  console.log('================================================================');

  let successCount = 0;
  const mappedNumbers = new Set();

  for (const m of matches) {
    if (m.kural && m.score >= 8) {
      await saveKuralImage(m.file.full, m.kural.number);
      mappedNumbers.add(m.kural.number);
      successCount++;
    }
  }

  console.log(`• Successfully processed & saved: ${successCount} images`);
  console.log(`• Unique Kurals added: ${mappedNumbers.size}`);
  const sorted = [...mappedNumbers].sort((a, b) => a - b);
  console.log(`• Range: ${sorted[0]} to ${sorted[sorted.length - 1]}`);
  
  const expected = Array.from({ length: 1330 - 1262 + 1 }, (_, idx) => 1262 + idx);
  const missing = expected.filter(n => !mappedNumbers.has(n));
  console.log(`• Missing in 1262-1330:`, missing);
  console.log('================================================================\n');
}

main().catch(console.error);
