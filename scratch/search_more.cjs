const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'SAAQIB', 'thirukural', 'thirukkural.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const kurals = data.kural || [];
const target = 'பெறின்';
const results = [];

kurals.forEach(kural => {
    let line2 = kural.Line2 || '';
    if (line2.includes(target)) {
        // Only if it's the last word or followed by punctuation
        let words = line2.split(/\s+/);
        let lastWord = words[words.length - 1].replace(/[.!?, \u200B]+$/, '');
        if (lastWord === target) {
            results.push(kural);
        }
    }
});

console.log(results.map(k => k.Number).join(', '));
console.log(`Total: ${results.length}`);
