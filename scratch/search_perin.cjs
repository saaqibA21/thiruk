const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'SAAQIB', 'thirukural', 'thirukkural.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const kurals = data.kural || [];
const target = 'பெறின்';
const results = [];

kurals.forEach(kural => {
    let line2 = kural.Line2 || '';
    // Remove common punctuation at the end using regex
    let cleanLine2 = line2.replace(/[.!?, \u200B]+$/, '');
    if (cleanLine2.endsWith(target)) {
        results.push(kural);
    }
});

console.log(`Found ${results.length} matches.`);
results.forEach(r => {
    console.log(`Kural ${r.Number}:`);
    console.log(r.Line1);
    console.log(r.Line2);
    console.log(`Explanation: ${r.mk || r.mv || r.explanation}`);
    console.log('--------------------');
});
