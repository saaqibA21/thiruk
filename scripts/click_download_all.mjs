import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DOWNLOAD_DIR = path.join(ROOT_DIR, 'tmp_gdrive_download');

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: false,
    args: ['--no-sandbox', '--window-size=1920,1080']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: DOWNLOAD_DIR
  });

  console.log('Navigating to Google Drive...');
  await page.goto('https://drive.google.com/drive/folders/1lySGTNQZPGTXRdjsx32bGJvAekWN0bEW', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 4000));

  // Find the exact coordinates of "Download all" button
  const buttonBox = await page.evaluate(() => {
    const divs = Array.from(document.querySelectorAll('*'));
    for (const d of divs) {
      if ((d.innerText || '').trim() === 'Download all') {
        const rect = d.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2, width: rect.width, height: rect.height };
        }
      }
    }
    return null;
  });

  console.log('Download all button rect:', buttonBox);

  if (buttonBox) {
    console.log(`Clicking at (${buttonBox.x}, ${buttonBox.y})...`);
    await page.mouse.click(buttonBox.x, buttonBox.y);
  }

  // Monitor DOM for toast / progress / zipping messages
  for (let i = 0; i < 45; i++) {
    await new Promise(r => setTimeout(r, 2000));

    const pageText = await page.evaluate(() => document.body.innerText);
    const toasts = pageText.split('\n').filter(t => t.includes('Zipping') || t.includes('Preparing') || t.includes('Download') || t.includes('download'));
    console.log(`[${i * 2}s] Toasts/Messages found:`, toasts.slice(0, 5));

    const files = fs.readdirSync(DOWNLOAD_DIR);
    if (files.length > 0) {
      console.log('🎉 Files in download dir:', files);
      const done = files.some(f => f.endsWith('.zip') && !f.endsWith('.crdownload'));
      if (done) {
        console.log('✅ ZIP DOWNLOAD COMPLETE!');
        break;
      }
    }
  }

  await page.screenshot({ path: 'after_click_screenshot.png' });
  await browser.close();
}

main().catch(console.error);
