import fs from 'fs';
import path from 'path';

const filePath = path.join('c:', 'Users', 'SAAQIB', 'thirukural', 'thirukkural.json');
const content = fs.readFileSync(filePath, 'utf8');

const target = "தடை";
const target_nfc = target.normalize('NFC');
const target_nfd = target.normalize('NFD');

console.log(`Target NFC Bytes: ${Array.from(target_nfc).map(c => c.charCodeAt(0).toString(16))}`);
console.log(`Target NFD Bytes: ${Array.from(target_nfd).map(c => c.charCodeAt(0).toString(16))}`);

const found_nfc = content.includes(target_nfc);
const found_nfd = content.includes(target_nfd);

console.log(`Found NFC: ${found_nfc}`);
console.log(`Found NFD: ${found_nfd}`);

if (found_nfc) {
    const idx = content.indexOf(target_nfc);
    console.log(`Occurrence at ${idx}: ${content.substring(idx - 10, idx + 20)}`);
}
