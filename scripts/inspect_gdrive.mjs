import fs from 'fs';

async function main() {
  const url = 'https://drive.google.com/drive/folders/1lySGTNQZPGTXRdjsx32bGJvAekWN0bEW';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const text = await res.text();
  fs.writeFileSync('gdrive_raw.html', text);
  console.log('Saved gdrive_raw.html, size:', text.length);

  // Search for AF_initDataCallback
  const callbacks = [...text.matchAll(/AF_initDataCallback\(([\s\S]*?)\);/g)];
  console.log('AF_initDataCallback count:', callbacks.length);

  for (let i = 0; i < callbacks.length; i++) {
    const raw = callbacks[i][1];
    if (raw.includes('501') || raw.includes('kural') || raw.includes('image') || raw.includes('.png') || raw.includes('.jpg')) {
      console.log(`Callback ${i} matches! Length: ${raw.length}`);
      fs.writeFileSync(`callback_${i}.js`, raw);
    }
  }
}

main().catch(console.error);
