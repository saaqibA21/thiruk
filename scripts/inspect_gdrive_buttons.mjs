import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1920,1080']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.goto('https://drive.google.com/drive/folders/1lySGTNQZPGTXRdjsx32bGJvAekWN0bEW', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button, [role="button"], a')).map(b => ({
      text: (b.innerText || '').trim(),
      ariaLabel: b.getAttribute('aria-label') || '',
      title: b.getAttribute('title') || '',
      role: b.getAttribute('role'),
      tag: b.tagName
    })).filter(b => b.text || b.ariaLabel);
  });

  console.log('Buttons found:', buttons);

  await page.screenshot({ path: 'gdrive_screenshot.png' });
  console.log('Saved screenshot to gdrive_screenshot.png');

  await browser.close();
}

main().catch(console.error);
