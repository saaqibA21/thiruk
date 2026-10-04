import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DOWNLOAD_DIR = path.join(ROOT_DIR, 'tmp_gdrive_download');

if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

async function main() {
  console.log('🚀 Launching Chrome to click "Download all"...');
  console.log('Target download folder:', DOWNLOAD_DIR);

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: false, // headed can help prevent zip download throttling
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1920,1080'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const client = await page.target().createCDPSession();
  await client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: DOWNLOAD_DIR
  });

  console.log('Navigating to Google Drive folder...');
  await page.goto('https://drive.google.com/drive/folders/1lySGTNQZPGTXRdjsx32bGJvAekWN0bEW', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 3000));

  console.log('Clicking "Download all" button...');
  const clicked = await page.evaluate(() => {
    const divs = Array.from(document.querySelectorAll('div, button'));
    for (const d of divs) {
      if ((d.innerText || '').trim() === 'Download all' || d.getAttribute('aria-label') === 'Download all') {
        d.click();
        return true;
      }
    }
    return false;
  });

  console.log('Clicked "Download all":', clicked);

  // Monitor the DOWNLOAD_DIR for zip files or downloaded files
  console.log('Waiting for zip / download to start and complete (Google Drive zips files on server)...');

  let completed = false;
  for (let i = 0; i < 180; i++) {
    await new Promise(r => setTimeout(r, 2000));

    const files = fs.readdirSync(DOWNLOAD_DIR);
    const crdownloads = files.filter(f => f.endsWith('.crdownload') || f.endsWith('.tmp'));
    const zipFiles = files.filter(f => f.endsWith('.zip') && !f.endsWith('.crdownload'));
    const otherFiles = files.filter(f => !f.endsWith('.crdownload') && !f.endsWith('.tmp'));

    if (i % 5 === 0) {
      console.log(`[${i * 2}s] Files in download folder:`, files);
    }

    if (zipFiles.length > 0 && crdownloads.length === 0) {
      console.log('🎉 Download completed successfully! Zip file:', zipFiles);
      completed = true;
      break;
    }

    // Also check if multiple individual files are downloading
    if (otherFiles.length >= 100 && crdownloads.length === 0) {
      console.log('🎉 Downloaded files count:', otherFiles.length);
      completed = true;
      break;
    }
  }

  await browser.close();

  if (!completed) {
    console.log('Timed out waiting for zip download.');
  }
}

main().catch(console.error);
