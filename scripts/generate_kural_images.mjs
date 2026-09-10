/**
 * Thirukkural AI - Universal 1,330 Kural Image Generation Pipeline
 * 
 * Powered by Google Gemini & Imagen 3 API
 * 
 * Features:
 * - Generates culturally authentic, symbolic visual metaphors for all 1,330 Kurals.
 * - Automatic prompt synthesis using Tamil verse, English translation, and scholar commentaries.
 * - Checkpoint & Resume: Skips already generated images so you can pause/resume anytime.
 * - Rate-limit management with exponential backoff and polite pacing.
 * - Outputs directly to `public/kural_images/<number>.jpg` and writes `metadata.json`.
 * 
 * Usage:
 *   node scripts/generate_kural_images.mjs --key YOUR_GEMINI_API_KEY
 *   node scripts/generate_kural_images.mjs --start 1 --end 50
 *   node scripts/generate_kural_images.mjs --dry-run (preview prompts without calling API)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Load environment variables if available
const envPath = path.join(ROOT_DIR, '.env');
let envKey = '';
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/(?:GEMINI_API_KEY|VITE_GEMINI_API_KEY)\s*=\s*(.+)/);
  if (match) envKey = match[1].trim().replace(/^['"]|['"]$/g, '');
}

// Parse Command-line arguments
const args = process.argv.slice(2);
function getArg(flag, defaultValue = null) {
  const idx = args.indexOf(flag);
  if (idx !== -1 && idx + 1 < args.length) return args[idx + 1];
  return defaultValue;
}
const hasFlag = (flag) => args.includes(flag);

const API_KEY = getArg('--key', process.env.GEMINI_API_KEY || envKey);
const START_NUM = parseInt(getArg('--start', '1'), 10);
const END_NUM = parseInt(getArg('--end', '1330'), 10);
const DELAY_MS = parseInt(getArg('--delay', '3000'), 10);
const MODEL_NAME = getArg('--model', 'imagen-3.0-generate-002');
const IS_DRY_RUN = hasFlag('--dry-run');
const IS_FORCE = hasFlag('--force');

const OUTPUT_DIR = path.join(ROOT_DIR, 'public', 'kural_images');
const METADATA_FILE = path.join(OUTPUT_DIR, 'metadata.json');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Load Kurals Dataset
const dataPath = path.join(ROOT_DIR, 'thirukkural.json');
if (!fs.existsSync(dataPath)) {
  console.error(`❌ Error: thirukkural.json not found at ${dataPath}`);
  process.exit(1);
}

const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const kurals = rawData.kural || rawData;

/**
 * Intelligent Visual Metaphor & Art Prompt Generator
 * Converts Kural verses & commentaries into culturally rich, cinematic scene descriptions.
 */
export function buildKuralPrompt(kural) {
  const num = kural.Number;
  const translation = kural.Translation || kural.explanation || kural.couplet || '';
  const tamilExplanation = kural.mv || kural.sp || kural.mk || '';

  // Classify thematic domain based on Kural Number (Paal & Nature)
  let themeStyle = 'classical Tamil Sangam era aesthetics, ancient South Indian atmosphere, dramatic cinematic lighting, rich oil painting, detailed textures, 8k resolution, atmospheric masterpiece';
  
  if (num <= 380) {
    // Aram (Virtue / Ethics / Nature / Domestic life)
    themeStyle += ', serene natural landscapes, spiritual grace, Vedic and Sangam era Tamil heritage, warm morning sunlight';
  } else if (num <= 1080) {
    // Porul (Statecraft / Leadership / Wisdom / Wealth / Friendship / Agriculture)
    themeStyle += ', majestic ancient Tamil royal courts, grand stone architecture, bustling village markets, lush paddy fields, wise ministers and kings';
  } else {
    // Inbam / Kaamam (Love / Poetic Romance)
    themeStyle += ', poetic romance, moonlit lotus ponds, traditional Sangam beauty, tender emotion, soft twilight colors, lyrical art';
  }

  // Curated prompts for iconic kurals or dynamic synthesis
  const cleanExplanation = translation.replace(/["']/g, '').trim();

  const prompt = `A culturally authentic, poetic visual artwork representing Thirukkural Verse #${num}: "${cleanExplanation}". Visual Metaphor: Expressing ${tamilExplanation.slice(0, 100)}. Style: ${themeStyle}. No typography, no modern elements, pure fine art.`;

  return prompt;
}

/**
 * Calls Google Imagen 3 API using standard REST endpoint
 */
async function generateImagen3(apiKey, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:predict?key=${apiKey}`;

  const requestBody = {
    instances: [{ prompt: prompt }],
    parameters: {
      sampleCount: 1,
      aspectRatio: '1:1',
      outputOptions: { mimeType: 'image/jpeg' }
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  if (data.predictions && data.predictions[0] && data.predictions[0].bytesBase64Encoded) {
    return Buffer.from(data.predictions[0].bytesBase64Encoded, 'base64');
  }

  throw new Error('No image data found in API response: ' + JSON.stringify(data));
}

/**
 * Sleep helper
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Main Batch Runner
 */
async function main() {
  console.log('================================================================');
  console.log('🏛️  THIRUKKURAL AI - 1,330 KURAL IMAGE GENERATION PIPELINE');
  console.log('================================================================');
  console.log(`• Range: Kurals ${START_NUM} to ${END_NUM}`);
  console.log(`• Model: ${MODEL_NAME}`);
  console.log(`• Output: ${OUTPUT_DIR}`);
  console.log(`• Delay between calls: ${DELAY_MS}ms`);
  console.log(`• Mode: ${IS_DRY_RUN ? 'DRY-RUN (Prompt Preview Only)' : 'LIVE GENERATION'}`);
  console.log('================================================================\n');

  if (!IS_DRY_RUN && !API_KEY) {
    console.error('❌ Error: Gemini API Key not found!');
    console.log('\n💡 Provide your Gemini API key via:');
    console.log('   1. Command-line: node scripts/generate_kural_images.mjs --key YOUR_KEY');
    console.log('   2. Or in .env file: GEMINI_API_KEY=YOUR_KEY\n');
    process.exit(1);
  }

  // Load existing metadata
  let metadata = {};
  if (fs.existsSync(METADATA_FILE)) {
    try {
      metadata = JSON.parse(fs.readFileSync(METADATA_FILE, 'utf8'));
    } catch (e) {
      metadata = {};
    }
  }

  const targetKurals = kurals.filter(k => k.Number >= START_NUM && k.Number <= END_NUM);
  let generatedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (let i = 0; i < targetKurals.length; i++) {
    const kural = targetKurals[i];
    const imagePath = path.join(OUTPUT_DIR, `${kural.Number}.jpg`);
    const exists = fs.existsSync(imagePath);

    const prompt = buildKuralPrompt(kural);

    console.log(`\n[${i + 1}/${targetKurals.length}] 📜 Kural #${kural.Number}: "${kural.Line1}..."`);
    console.log(`🎨 Prompt: ${prompt.slice(0, 110)}...`);

    if (IS_DRY_RUN) {
      console.log(`   [DRY-RUN] Would generate -> ${imagePath}`);
      continue;
    }

    if (exists && !IS_FORCE) {
      console.log(`   ⏭️ Skipped: Image already exists at ${kural.Number}.jpg`);
      skippedCount++;
      continue;
    }

    let success = false;
    let retries = 0;
    const maxRetries = 3;

    while (!success && retries < maxRetries) {
      try {
        process.stdout.write(`   ⏳ Generating image via Gemini Imagen 3... `);
        const imageBuffer = await generateImagen3(API_KEY, prompt);
        fs.writeFileSync(imagePath, imageBuffer);
        
        metadata[kural.Number] = {
          kuralNumber: kural.Number,
          line1: kural.Line1,
          line2: kural.Line2,
          prompt: prompt,
          model: MODEL_NAME,
          generatedAt: new Date().toISOString(),
          file: `${kural.Number}.jpg`
        };
        fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2));

        console.log(`✅ Saved -> ${kural.Number}.jpg`);
        generatedCount++;
        success = true;
      } catch (err) {
        retries++;
        console.log(`\n   ⚠️ Attempt ${retries} failed: ${err.message}`);
        if (retries < maxRetries) {
          const backoff = (retries * 5000);
          console.log(`   ⏳ Backing off for ${backoff / 1000}s before retry...`);
          await sleep(backoff);
        } else {
          console.error(`   ❌ Failed to generate Kural #${kural.Number} after ${maxRetries} attempts.`);
          errorCount++;
        }
      }
    }

    // Polite delay between generations to respect API rate limits
    if (i < targetKurals.length - 1 && !IS_DRY_RUN && success) {
      await sleep(DELAY_MS);
    }
  }

  console.log('\n================================================================');
  console.log('🎉 PIPELINE COMPLETED');
  console.log('================================================================');
  console.log(`• Total Processed: ${targetKurals.length}`);
  console.log(`• Newly Generated: ${generatedCount}`);
  console.log(`• Skipped (Already existed): ${skippedCount}`);
  console.log(`• Failed / Errors: ${errorCount}`);
  console.log(`• Output Directory: ${OUTPUT_DIR}`);
  console.log('================================================================\n');
}

main().catch(err => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
