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

  console.log('Opening folder...');
  await page.goto('https://drive.google.com/drive/folders/1lySGTNQZPGTXRdjsx32bGJvAekWN0bEW', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  parseText(await page.content());
  console.log('Initial file count:', fileMap.size);

  // Perform continuous scrolling on c-wiz
  for (let i = 0; i < 30; i++) {
    await page.evaluate(() => {
      const cwiz = document.querySelector('c-wiz.PEfnhb') || document.querySelector('c-wiz');
      if (cwiz) {
        cwiz.scrollTop = cwiz.scrollHeight;
        cwiz.dispatchEvent(new Event('scroll', { bubbles: true }));
      }
      window.scrollTo(0, document.body.scrollHeight);
    });

    await new Promise(r => setTimeout(r, 1200));

    // Also extract from DOM
    const domFiles = await page.evaluate(() => {
      const res = [];
      const els = document.querySelectorAll('[data-id]');
      for (const el of els) {
        const id = el.getAttribute('data-id');
        const text = el.getAttribute('aria-label') || el.innerText || '';
        const m = text.match(/(\d+)\.png/);
        if (m && id) {
          res.push({ num: parseInt(m[1]), fileId: id, filename: `${m[1]}.png` });
        }
      }
      return res;
    });

    for (const f of domFiles) {
      fileMap.set(f.num, f);
    }

    parseText(await page.content());
    console.log(`Scroll pass ${i + 1}: Total files mapped = ${fileMap.size} (Max: ${Math.max(...fileMap.keys(), 0)})`);

    if (fileMap.size >= 125) {
      console.log('🎉 All files captured!');
      break;
    }
  }

  await browser.close();

  const sortedNums = [...fileMap.keys()].sort((a, b) => a - b);
  console.log(`\n=================================================`);
  console.log(`Total Kurals captured: ${fileMap.size}`);
  console.log(`Range: ${sortedNums[0]} to ${sortedNums[sortedNums.length - 1]}`);
  console.log(`=================================================\n`);

  fs.writeFileSync('gdrive_all_kurals.json', JSON.stringify(Object.fromEntries(fileMap), null, 2));
}

main().catch(console.error);
