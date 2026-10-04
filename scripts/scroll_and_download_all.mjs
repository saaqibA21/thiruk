import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: false,
    args: ['--no-sandbox', '--window-size=1920,1080']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const fileMap = new Map();

  function parseText(text) {
    const itemRegex = /\[\[null,"([a-zA-Z0-9_-]{25,40})"\][\s\S]*?\"(\d+\.png)\"/g;
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

  console.log('Navigating to Google Drive folder...');
  await page.goto('https://drive.google.com/drive/folders/1lySGTNQZPGTXRdjsx32bGJvAekWN0bEW', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 3000));
  parseText(await page.content());

  // Click on the first row (e.g. 501.png)
  console.log('Clicking on first row...');
  await page.mouse.click(150, 180);
  await new Promise(r => setTimeout(r, 500));

  // Now press ArrowDown 300 times to traverse the entire folder!
  console.log('Traversing items with ArrowDown...');
  for (let i = 0; i < 200; i++) {
    await page.keyboard.press('ArrowDown');
    if (i % 10 === 0) {
      await new Promise(r => setTimeout(r, 200));
      // Extract from DOM
      const domFiles = await page.evaluate(() => {
        const res = [];
        const rows = document.querySelectorAll('[data-id], [role="row"]');
        for (const r of rows) {
          const id = r.getAttribute('data-id') || r.getAttribute('data-target-id');
          const text = r.getAttribute('aria-label') || r.innerText || '';
          const m = text.match(/(\d+)\.png/);
          if (m && id) {
            res.push({ num: parseInt(m[1]), fileId: id, filename: `${m[1]}.png` });
          }
        }
        return res;
      });

      for (const f of domFiles) fileMap.set(f.num, f);
      parseText(await page.content());
      console.log(`[Item ${i}] Total captured: ${fileMap.size} (Max num: ${Math.max(...fileMap.keys(), 0)})`);

      if (fileMap.size >= 125) {
        console.log('🎉 All files 501-625 captured!');
        break;
      }
    }
  }

  await browser.close();

  const sortedNums = [...fileMap.keys()].sort((a, b) => a - b);
  console.log(`\n=================================================`);
  console.log(`Total Kurals captured: ${fileMap.size}`);
  console.log(`Range: ${sortedNums[0]} to ${sortedNums[sortedNums.length - 1]}`);
  console.log(`List:`, sortedNums);
  console.log(`=================================================\n`);

  fs.writeFileSync('gdrive_all_kurals.json', JSON.stringify(Object.fromEntries(fileMap), null, 2));
}

main().catch(console.error);
