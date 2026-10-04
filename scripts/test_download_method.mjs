import fs from 'fs';

const fileId = '1ALaz4o59RNafJp-L_r4NZkqOTL2yRhwB';

async function testMethod(name, url) {
  try {
    const res = await fetch(url);
    console.log(name, 'status:', res.status, 'contentType:', res.headers.get('content-type'), 'length:', res.headers.get('content-length'));
    if (res.ok) {
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(`test_${name}.png`, buf);
      console.log(name, 'saved successfully, size:', buf.length);
    }
  } catch (e) {
    console.error(name, 'error:', e.message);
  }
}

async function main() {
  await testMethod('lh3_w1024', `https://lh3.googleusercontent.com/d/${fileId}=w1024`);
  await testMethod('lh3_w2048', `https://lh3.googleusercontent.com/d/${fileId}=w2048`);
  await testMethod('usercontent_dl', `https://drive.usercontent.google.com/download?id=${fileId}&export=download&authuser=0`);
}

main();
