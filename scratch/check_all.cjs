const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'SAAQIB', 'thirukural', 'thirukkural.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const kurals = data.kural || [];
const target = 'பெறின்';
const results = [];

kurals.forEach(kural => {
    let line2 = kural.Line2 || '';
    let cleanLine2 = line2.replace(/[.!?, \u200B]+$/, '');
    if (cleanLine2.endsWith(target)) {
        results.push(kural.Number);
    }
});

console.log(results.join(', '));
console.log(`Total: ${results.length}`);
