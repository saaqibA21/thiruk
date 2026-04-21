const fs = require('fs');
const path = require('path');

const resultsPath = path.join('c:', 'Users', 'SAAQIB', 'thirukural', 'scratch', 'perin_results.json');
const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));

let markdown = '# Kurals Ending with "பெறின்" (Perin)\n\n';
markdown += 'This report lists all Thirukkural verses that end with the word **"பெறின்"**. This word is a conditional suffix meaning "if obtained" or "if one has".\n\n';
markdown += '| Kural No | Verse (Tamil) | Explanation (Tamil) | Translation (English) |\n';
markdown += '| :--- | :--- | :--- | :--- |\n';

results.forEach(k => {
    const verse = `${k.Line1}<br>${k.Line2}`;
    const explanation = k.mk || k.sp || k.mv || k.explanation;
    markdown += `| **${k.Number}** | ${verse} | ${explanation} | ${k.Translation} |\n`;
});

const reportPath = path.join('c:', 'Users', 'SAAQIB', 'thirukural', 'REPORTS', 'Kurals_Ending_With_Perin.md');
fs.writeFileSync(reportPath, markdown, 'utf8');
console.log(`Report generated at ${reportPath}`);
