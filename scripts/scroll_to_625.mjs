import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function main() {
  console.log('🚀 Traversing to capture remaining 601-625...');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: false,
    args: ['--no-sandbox', '--window-size=1920,1080']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const fileMap = new Map();

  function parseText(text) {
    const itemRegex = /\[\[null,"([a-zA-Z0-9_-]{25,40})"\][\s\S]*?\"(\d+\.(?:png|jpg|jpeg|webp))\"/gi;
    let match;
    while ((match = itemRegex.exec(text)) !== null) {
      const fileId = match[1];
      const filename = match[2];
      const num = parseInt(filename);
      if (num >= 500 && num <= 650) {
        fileMap.set(num, { fileId, filename });
      }
    }
  }

  page.on('response', async (res) => {
    try {
      const text = await res.text();
      parseText(text);
    } catch (e) {}
  });

  await page.goto('https://drive.google.com/drive/folders/1lySGTNQZPGTXRdjsx32bGJvAekWN0bEW', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 3000));
  parseText(await page.content());

  // Click first row
  await page.mouse.click(150, 180);
  await new Promise(r => setTimeout(r, 500));

  // Loop with continuous scrolling and clicking bottom row
  for (let loop = 0; loop < 50; loop++) {
    // Click the bottom-most row in the viewport
    await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('[data-id], [role="row"]'));
      if (rows.length > 0) {
        const lastRow = rows[rows.length - 1];
        lastRow.scrollIntoView({ block: 'end' });
        lastRow.click();
      }
    });

    for (let j = 0; j < 15; j++) {
      await page.keyboard.press('ArrowDown');
      await new Promise(r => setTimeout(r, 60));
    }
    await page.keyboard.press('PageDown');
    await new Promise(r => setTimeout(r, 800));

    // Extract from DOM
    const domFiles = await page.evaluate(() => {
      const res = [];
      const rows = document.querySelectorAll('[data-id], [role="row"]');
      for (const r of rows) {
        const id = r.getAttribute('data-id') || r.getAttribute('data-target-id');
        const text = r.getAttribute('aria-label') || r.innerText || '';
        const m = text.match(/(\d+)\.(?:png|jpg|jpeg|webp)/i);
        if (m && id) {
          res.push({ num: parseInt(m[1]), fileId: id, filename: m[0] });
        }
      }
      return res;
    });

    for (const f of domFiles) fileMap.set(f.num, f);
    parseText(await page.content());

    const maxNum = Math.max(...fileMap.keys(), 0);
    console.log(`Loop ${loop + 1}: Total captured = ${fileMap.size}, Max = ${maxNum}`);

    if (maxNum >= 625 && fileMap.size >= 125) {
      console.log('🎉 Reached Kural 625 and captured all items!');
      break;
    }
  }

  await browser.close();

  const sortedNums = [...fileMap.keys()].sort((a, b) => a - b);
  console.log(`\n=================================================`);
  console.log(`Total Kurals captured: ${fileMap.size}`);
  console.log(`Range: ${sortedNums[0]} to ${sortedNums[sortedNums.length - 1]}`);
  const missing = Array.from({ length: 125 }, (_, i) => 501 + i).filter(n => !fileMap.has(n));
  console.log(`Missing in 501-625 (${missing.length}):`, missing);
  console.log(`=================================================\n`);

  fs.writeFileSync('gdrive_all_kurals.json', JSON.stringify(Object.fromEntries(fileMap), null, 2));
}

main().catch(console.error);
