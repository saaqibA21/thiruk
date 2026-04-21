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
        results.push(kural);
    }
});

const outPath = path.join('c:', 'Users', 'SAAQIB', 'thirukural', 'scratch', 'perin_results.json');
fs.writeFileSync(outPath, JSON.stringify(results, null, 2), 'utf8');
console.log(`Saved ${results.length} results to ${outPath}`);
