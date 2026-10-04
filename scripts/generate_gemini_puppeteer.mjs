/**
 * Thirukkural AI - Google Gemini Web UI Puppeteer Automation
 * 
 * Automates Google Gemini (gemini.google.com) to generate Thirukkural artwork
 * using prompts extracted directly from KURAL_ART_PROMPTS.md.
 * 
 * Usage:
 *   node scripts/generate_gemini_puppeteer.mjs --start 11 --end 20
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer-core';
import { loadAllPrompts } from './prompt_parser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
function getArg(flag, defaultValue = null) {
  const idx = args.indexOf(flag);
  if (idx !== -1 && idx + 1 < args.length) return args[idx + 1];
  return defaultValue;
}
const hasFlag = (flag) => args.includes(flag);

const START_NUM = parseInt(getArg('--start', '11'), 10);
const END_NUM = parseInt(getArg('--end', '20'), 10);
const DELAY_MS = parseInt(getArg('--delay', '5000'), 10);
const IS_FORCE = hasFlag('--force');

const PRIMARY_OUTPUT_DIR = path.join(ROOT_DIR, 'thiruk_image');
const PUBLIC_THIRUK_DIR = path.join(ROOT_DIR, 'public', 'thiruk_image');
const PUBLIC_KURAL_DIR = path.join(ROOT_DIR, 'public', 'kural_images');
const USER_DATA_DIR = path.resolve(ROOT_DIR, '.chrome_gemini_profile');

[PRIMARY_OUTPUT_DIR, PUBLIC_THIRUK_DIR, PUBLIC_KURAL_DIR, USER_DATA_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function findChromeExecutable() {
  const candidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe')
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function promptUser(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
  console.log('🌐 THIRUKKURAL AI - GEMINI WEB UI PUPPETEER PIPELINE');
  console.log('================================================================');
  console.log(`• Range: Kurals ${START_NUM} to ${END_NUM} (Total: ${END_NUM - START_NUM + 1})`);
  console.log(`• Output Target: ${PRIMARY_OUTPUT_DIR}`);
  console.log(`• Mirror Targets: ${PUBLIC_THIRUK_DIR} & ${PUBLIC_KURAL_DIR}`);
  console.log('================================================================\n');

  const chromePath = findChromeExecutable();
  if (!chromePath) {
    console.error('❌ Could not locate Google Chrome on this system!');
    process.exit(1);
  }

  const promptMap = loadAllPrompts();
  console.log(` Loaded ${promptMap.size} prompts from KURAL_ART_PROMPTS.md\n`);

  console.log('🚀 Launching Google Chrome window...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: false,
    userDataDir: USER_DATA_DIR,
    ignoreDefaultArgs: ['--enable-automation'],
    args: [
      '--start-maximized',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--no-first-run',
      '--no-default-browser-check'
    ]
  });

  const pages = await browser.pages();
  const page = pages[0] || (await browser.newPage());

  console.log('🔗 Navigating to https://gemini.google.com/app ...');
  await page.goto('https://gemini.google.com/app', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await sleep(3000);

  // Check login
  const pageContent = await page.content();
  const needsLogin = page.url().includes('accounts.google.com') ||
                     pageContent.includes('Sign in') ||
                     pageContent.includes('Sign In') ||
                     (await page.$('a[href*="accounts.google.com"]')) !== null;

  if (needsLogin) {
    console.log('\n================================================================');
    console.log('🔑 GOOGLE LOGIN REQUIRED');
    console.log('================================================================');
    console.log('👉 Please click "Sign In" in the Chrome window and sign into your Google account.');
    console.log('================================================================\n');
    await promptUser('👉 Once you are logged in and see the Gemini prompt box, press [ENTER] here: ');
  }

  let successCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (let num = START_NUM; num <= END_NUM; num++) {
    const primaryPath = path.join(PRIMARY_OUTPUT_DIR, `${num}.jpg`);
    const rawPrompt = promptMap.get(num);

    console.log(`\n----------------------------------------------------------------`);
    console.log(`📜 [Kural #${num}] Processing...`);

    if (!rawPrompt) {
      console.log(`⚠️ No prompt found for Kural #${num} in KURAL_ART_PROMPTS.md! Skipping.`);
      errorCount++;
      continue;
    }

    if (fs.existsSync(primaryPath) && !IS_FORCE) {
      console.log(`⏭️ Skipped: ${num}.jpg already exists.`);
      skippedCount++;
      continue;
    }

    // Explicitly command Gemini to generate an image so it uses Imagen
    const prompt = `Generate an image:\n\n${rawPrompt}`;

    try {
      // Start a fresh conversation for clean context
      const newChatBtn = await page.$('a[href*="/app"], button[aria-label*="New chat"], [data-test-id="new-chat-button"]');
      if (newChatBtn) {
        try { await newChatBtn.click(); await sleep(1500); } catch(e) {}
      }

      // Record image count before prompt
      const previousImageCount = await page.evaluate(() => {
        return document.querySelectorAll('img[src*="googleusercontent.com"], img[src*="blob:"]').length;
      });

      console.log(`📝 Inserting prompt for Kural #${num}...`);

      const inputSelector = 'div[contenteditable="true"], textarea, .ql-editor, p[data-placeholder]';
      await page.waitForSelector(inputSelector, { timeout: 30000 });
      
      const inputElem = await page.$(inputSelector);
      await inputElem.click();
      await sleep(500);

      // Focus and fill prompt
      await page.evaluate((sel, text) => {
        const el = document.querySelector(sel);
        if (el) {
          el.focus();
          if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
            el.value = text;
          } else {
            el.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
          }
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, inputSelector, prompt);

      await sleep(1000);

      console.log('🚀 Sending prompt to Gemini...');
      const sendButtonSelector = 'button[aria-label*="Send"], button.send-button, mat-icon[fonticon="send"], button[aria-label*="Submit"]';
      const sendButton = await page.$(sendButtonSelector);

      if (sendButton) {
        await sendButton.click();
      } else {
        await page.keyboard.press('Enter');
      }

      console.log('⏳ Waiting for Gemini to generate the image (up to 80s)...');
      
      const imageResult = await page.waitForFunction((prevCount) => {
        const imgs = Array.from(document.querySelectorAll('img'));
        const genImgs = imgs.filter(img => 
          (img.src && (img.src.includes('googleusercontent.com') || img.src.includes('blob:'))) &&
          img.naturalWidth > 200 && img.naturalHeight > 200
        );
        if (genImgs.length > prevCount) {
          return genImgs[genImgs.length - 1].src;
        }
        return null;
      }, { timeout: 80000, polling: 2000 }, previousImageCount);

      const imgSrc = await imageResult.jsonValue();
      console.log('🖼️ Generated image received!');

      const base64Data = await page.evaluate(async (url) => {
        const res = await fetch(url);
        const blob = await res.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result.split(',')[1]);
          reader.readAsDataURL(blob);
        });
      }, imgSrc);

      const buffer = Buffer.from(base64Data, 'base64');
      saveImageToAllLocations(buffer, num);

      console.log(`✅ Saved Kural #${num} -> ${PRIMARY_OUTPUT_DIR}\\${num}.jpg`);
      successCount++;

    } catch (err) {
      console.error(`❌ Error on Kural #${num}:`, err.message);
      errorCount++;
    }

    if (num < END_NUM) {
      console.log(`⏳ Waiting ${DELAY_MS / 1000}s before next prompt...`);
      await sleep(DELAY_MS);
    }
  }

  console.log('\n================================================================');
  console.log('🎉 BATCH COMPLETE');
  console.log('================================================================');
  console.log(`• Total: ${END_NUM - START_NUM + 1}`);
  console.log(`• Successfully Saved: ${successCount}`);
  console.log(`• Skipped: ${skippedCount}`);
  console.log(`• Errors: ${errorCount}`);
  console.log(`• Destination: ${PRIMARY_OUTPUT_DIR}`);
  console.log('================================================================\n');
}

main().catch(err => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
