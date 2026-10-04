/**
 * Thirukkural AI - OpenAI Image Generation Pipeline
 * 
 * Generates images for Thirukkural using OpenAI image models (gpt-image-1-mini)
 * Saves directly to: C:\Users\SAAQIB\thirukural_pro\thiruk_image\<kuralNumber>.jpg
 * Also syncs to: public/thiruk_image/ and public/kural_images/ for the web app
 * 
 * Usage:
 *   node scripts/generate_openai_images.mjs --start 11 --end 100
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Load .env
const envPath = path.join(ROOT_DIR, '.env');
let envOpenAIKey = '';
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  const match = content.match(/(?:OPENAI_API_KEY|VITE_OPENAI_API_KEY)\s*=\s*(.+)/);
  if (match) envOpenAIKey = match[1].trim().replace(/^['"]|['"]$/g, '');
}

// Parse args
const args = process.argv.slice(2);
function getArg(flag, defaultValue = null) {
  const idx = args.indexOf(flag);
  if (idx !== -1 && idx + 1 < args.length) return args[idx + 1];
  return defaultValue;
}
const hasFlag = (flag) => args.includes(flag);

const API_KEY = getArg('--key', process.env.OPENAI_API_KEY || envOpenAIKey);
const START_NUM = parseInt(getArg('--start', '11'), 10);
const END_NUM = parseInt(getArg('--end', '100'), 10);
const MODEL = getArg('--model', 'gpt-image-1-mini');
const DELAY_MS = parseInt(getArg('--delay', '1500'), 10);
const IS_DRY_RUN = hasFlag('--dry-run');
const IS_FORCE = hasFlag('--force');

// Target output directories
const PRIMARY_OUTPUT_DIR = path.join(ROOT_DIR, 'thiruk_image');
const PUBLIC_THIRUK_DIR = path.join(ROOT_DIR, 'public', 'thiruk_image');
const PUBLIC_KURAL_DIR = path.join(ROOT_DIR, 'public', 'kural_images');
const METADATA_FILE = path.join(PRIMARY_OUTPUT_DIR, 'metadata.json');

[PRIMARY_OUTPUT_DIR, PUBLIC_THIRUK_DIR, PUBLIC_KURAL_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Load Kural data
const dataPath = path.join(ROOT_DIR, 'thirukkural.json');
const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const kurals = rawData.kural || rawData;

function buildPrompt(kural) {
  const num = kural.Number;
  const line1 = kural.Line1;
  const line2 = kural.Line2;
  const translation = (kural.Translation || kural.explanation || kural.couplet || '').replace(/["']/g, '').trim();
  const tamilExp = (kural.mv || kural.sp || kural.mk || '').replace(/["']/g, '').trim();

  let sceneDetails = '';
  if (num <= 380) {
    sceneDetails = `Serene natural sanctuary with ancient banyan trees, temple courtyards, sacred lotus ponds, and morning sunlight breaking through misty skies`;
  } else if (num <= 1080) {
    sceneDetails = `Majestic ancient Tamil stone halls, flourishing paddy fields, royal courts, wise scholars engaged in governance, and glowing golden lamps`;
  } else {
    sceneDetails = `Poetic moonlit courtyard, blossoming night jasmine flowers, peaceful riverbanks under starry skies, and classical Sangam era romantic ambiance`;
  }

  return `A magnificent, culturally authentic cinematic fine art painting representing Thirukkural Verse #${num}.

SCENE DESCRIPTION & VISUAL METAPHOR:
${sceneDetails}. Expressing the moral concept: ${tamilExp}.
Style: classical Tamil Sangam era aesthetics, ancient South Indian spiritual atmosphere, dramatic cinematic lighting, rich oil painting, hyper-detailed textures, 8k resolution, masterpiece.

TEXT & INSCRIPTION REQUIREMENT (MANDATORY IN THE IMAGE):
In the bottom foreground, render a prominent, beautifully carved ancient stone slab / weathered granite tablet engraved with the authentic 2-line Tamil Thirukkural couplet:
"${line1}
${line2}"

Along with a small bronze plaque at the bottom with the English translation:
"${translation}"`;
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function downloadImage(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download image: ${res.statusText}`);
  const arrayBuffer = await res.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
}

function saveImageToAllLocations(buffer, kuralNumber) {
  const fileName = `${kuralNumber}.jpg`;
  const primaryPath = path.join(PRIMARY_OUTPUT_DIR, fileName);
  const publicThirukPath = path.join(PUBLIC_THIRUK_DIR, fileName);
  const publicKuralPath = path.join(PUBLIC_KURAL_DIR, fileName);

  fs.writeFileSync(primaryPath, buffer);
  fs.writeFileSync(publicThirukPath, buffer);
  fs.writeFileSync(publicKuralPath, buffer);
}

async function main() {
  console.log('================================================================');
  console.log('🏛️  THIRUKKURAL AI - OPENAI IMAGE GENERATION PIPELINE');
  console.log('================================================================');
  console.log(`• Range: Kurals ${START_NUM} to ${END_NUM} (Total: ${END_NUM - START_NUM + 1})`);
  console.log(`• Model: ${MODEL}`);
  console.log(`• Primary Target: ${PRIMARY_OUTPUT_DIR}`);
  console.log(`• Web App Mirrors: ${PUBLIC_THIRUK_DIR} & ${PUBLIC_KURAL_DIR}`);
  console.log(`• Mode: ${IS_DRY_RUN ? 'DRY-RUN (Preview Only)' : 'LIVE GENERATION'}`);
  console.log('================================================================\n');

  if (!IS_DRY_RUN && (!API_KEY || !API_KEY.startsWith('sk-'))) {
    console.error('❌ Error: Valid OpenAI API Key (starting with sk-...) is required!');
    process.exit(1);
  }

  let openai = null;
  if (!IS_DRY_RUN) {
    openai = new OpenAI({ apiKey: API_KEY });
  }

  let metadata = {};
  if (fs.existsSync(METADATA_FILE)) {
    try {
      metadata = JSON.parse(fs.readFileSync(METADATA_FILE, 'utf8'));
    } catch (e) {
      metadata = {};
    }
  }

  const target = kurals.filter(k => k.Number >= START_NUM && k.Number <= END_NUM);
  let successCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (let i = 0; i < target.length; i++) {
    const kural = target[i];
    const primaryPath = path.join(PRIMARY_OUTPUT_DIR, `${kural.Number}.jpg`);
    const exists = fs.existsSync(primaryPath);
    const prompt = buildPrompt(kural);

    console.log(`\n[${i + 1}/${target.length}] 📜 Kural #${kural.Number}: "${kural.Line1}..."`);

    if (IS_DRY_RUN) {
      console.log(`   [DRY-RUN] Target file: ${primaryPath}`);
      continue;
    }

    if (exists && !IS_FORCE) {
      console.log(`   ⏭️ Skipped: ${kural.Number}.jpg already exists.`);
      skippedCount++;
      continue;
    }

    let success = false;
    let retries = 0;
    const maxRetries = 3;

    while (!success && retries < maxRetries) {
      try {
        process.stdout.write(`   ⏳ Generating with OpenAI (${MODEL})... `);
        
        const params = {
          model: MODEL,
          prompt: prompt,
          n: 1
        };

        const response = await openai.images.generate(params);
        const dataItem = response.data[0];

        let buffer;
        if (dataItem.b64_json) {
          buffer = Buffer.from(dataItem.b64_json, 'base64');
        } else if (dataItem.url) {
          const res = await fetch(dataItem.url);
          const arrayBuffer = await res.arrayBuffer();
          buffer = Buffer.from(arrayBuffer);
        } else {
          throw new Error('No b64_json or url returned in OpenAI image response');
        }

        saveImageToAllLocations(buffer, kural.Number);

        metadata[kural.Number] = {
          kuralNumber: kural.Number,
          prompt: prompt,
          model: MODEL,
          generatedAt: new Date().toISOString(),
          file: `${kural.Number}.jpg`
        };
        fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2));

        console.log(`✅ Saved -> ${PRIMARY_OUTPUT_DIR}\\${kural.Number}.jpg`);
        successCount++;
        success = true;
      } catch (err) {
        retries++;
        console.log(`\n   ⚠️ Attempt ${retries} failed: ${err.message}`);
        if (retries < maxRetries) {
          const backoff = retries * 3000;
          console.log(`   ⏳ Waiting ${backoff / 1000}s before retry...`);
          await sleep(backoff);
        } else {
          console.error(`   ❌ Failed to generate Kural #${kural.Number} after ${maxRetries} attempts.`);
          errorCount++;
        }
      }
    }

    if (i < target.length - 1 && !IS_DRY_RUN && success) {
      await sleep(DELAY_MS);
    }
  }

  console.log('\n================================================================');
  console.log('🎉 PIPELINE COMPLETED');
  console.log('================================================================');
  console.log(`• Total Processed: ${target.length}`);
  console.log(`• Newly Generated: ${successCount}`);
  console.log(`• Skipped (Already existed): ${skippedCount}`);
  console.log(`• Errors: ${errorCount}`);
  console.log(`• Saved To: ${PRIMARY_OUTPUT_DIR}`);
  console.log('================================================================\n');
}

main().catch(err => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
