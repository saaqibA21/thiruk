import puppeteer from 'puppeteer-core';
import fs from 'fs';

async function main() {
  console.log('🚀 Launching Chrome to extract all 501-625 IDs...');
  
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1920,1080'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const fileMap = new Map();

  // Parse any text chunk for files
  function parseText(text) {
    // Pattern: [null,"([a-zA-Z0-9_-]{25,40})"] followed eventually by "(\d+)\.png"
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

  // Intercept all network responses
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

  // Extract from initial HTML
  const initialContent = await page.content();
  parseText(initialContent);
  console.log(`Initial capture: ${fileMap.size} files`);

  // Focus on the list
  await page.mouse.click(500, 500);

  // Scroll using PageDown and Mouse Wheel
  for (let i = 0; i < 40; i++) {
    await page.keyboard.press('PageDown');
    await page.mouse.wheel({ deltaY: 3000 });
    await new Promise(r => setTimeout(r, 600));

    // Also extract from DOM
    const domItems = await page.evaluate(() => {
      const items = [];
      const els = document.querySelectorAll('[data-id], [data-target="doclist"] *');
      for (const el of els) {
        const text = el.getAttribute('aria-label') || el.innerText || '';
        const id = el.getAttribute('data-id') || el.getAttribute('data-target-id');
        if (text.includes('.png') && id) {
          items.push({ text, id });
        }
      }
      return items;
    });

    for (const item of domItems) {
      const match = item.text.match(/(\d+)\.png/);
      if (match) {
        const num = parseInt(match[1]);
        if (num >= 500 && num <= 650) {
          fileMap.set(num, { fileId: item.id, filename: `${num}.png` });
        }
      }
    }

    const currentContent = await page.content();
    parseText(currentContent);

    console.log(`Pass ${i + 1}: Found ${fileMap.size} files (Max: ${Math.max(...fileMap.keys(), 0)})`);
    if (fileMap.size >= 125) break;
  }

  await browser.close();

  const sortedNums = [...fileMap.keys()].sort((a, b) => a - b);
  console.log(`\n=================================================`);
  console.log(`Total Kurals captured: ${fileMap.size}`);
  if (sortedNums.length > 0) {
    console.log(`Range: ${sortedNums[0]} to ${sortedNums[sortedNums.length - 1]}`);
  }
  console.log(`=================================================\n`);

  fs.writeFileSync('gdrive_all_kurals.json', JSON.stringify(Object.fromEntries(fileMap), null, 2));
}

main().catch(console.error);
