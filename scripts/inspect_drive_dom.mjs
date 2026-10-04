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

  // Find scrollable elements
  const scrollables = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    const scrollNodes = [];
    for (const el of all) {
      if (el.scrollHeight > el.clientHeight && el.clientHeight > 100) {
        scrollNodes.push({
          tag: el.tagName,
          id: el.id,
          className: el.className,
          role: el.getAttribute('role'),
          scrollHeight: el.scrollHeight,
          clientHeight: el.clientHeight
        });
      }
    }
    return scrollNodes;
  });

  console.log('Scrollable elements:', scrollables);

  // Click on the first file item
  const clicked = await page.evaluate(() => {
    const item = document.querySelector('[role="row"], [role="gridcell"], [data-target="doclist"] [role="button"], [data-id]');
    if (item) {
      item.click();
      return true;
    }
    return false;
  });

  console.log('Clicked first item:', clicked);

  // Press ArrowDown 200 times and monitor newly added items
  for (let step = 0; step < 10; step++) {
    for (let j = 0; j < 30; j++) {
      await page.keyboard.press('ArrowDown');
      await new Promise(r => setTimeout(r, 50));
    }
    await new Promise(r => setTimeout(r, 1000));

    const fileCount = await page.evaluate(() => {
      const texts = Array.from(document.querySelectorAll('*'))
        .map(el => el.getAttribute('aria-label') || el.innerText || '')
        .filter(t => t.includes('.png'));
      return new Set(texts.map(t => t.match(/(\d+)\.png/)?.[1]).filter(Boolean)).size;
    });

    console.log(`Step ${step + 1}: Rendered file count in DOM = ${fileCount}`);
  }

  await browser.close();
}

main().catch(console.error);
