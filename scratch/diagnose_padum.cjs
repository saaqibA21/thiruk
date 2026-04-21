const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'SAAQIB', 'thirukural', 'thirukkural.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const targetWord = 'படும்'.normalize('NFC');
const k50 = data.kural.find(k => k.Number === 50);

const l2 = k50.Line2.toLowerCase().normalize('NFC');
const cleanL2 = l2.replace(/[.,!?;:"]/g, '').trim();
const wordsL2 = cleanL2.split(/\s+/);
const lastWord = wordsL2[wordsL2.length - 1];

console.log(`Original Line 2: "${k50.Line2}"`);
console.log(`Cleaned Line 2: "${cleanL2}"`);
console.log(`Last Word extracted: "${lastWord}"`);
console.log(`Target Word: "${targetWord}"`);
console.log(`Direct Match (lastWord === targetWord): ${lastWord === targetWord}`);
console.log(`EndsWith Match (cleanL2.endsWith(targetWord)): ${cleanL2.endsWith(targetWord)}`);
console.log(`Check for non-breaking space or other chars:`);
for(let i=0; i<lastWord.length; i++) {
    console.log(`Char ${i}: ${lastWord.charCodeAt(i).toString(16)}`);
}
for(let i=0; i<targetWord.length; i++) {
    console.log(`TChar ${i}: ${targetWord.charCodeAt(i).toString(16)}`);
}
