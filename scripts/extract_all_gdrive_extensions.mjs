import fs from 'fs';

const content = fs.readFileSync('gdrive_raw.html', 'utf8');

const fileMap = new Map();

// Match pattern: [null,"([a-zA-Z0-9_-]{25,40})"] followed eventually by "(\d+\.(?:png|jpg|jpeg|webp))"
const itemRegex = /\[\[null,"([a-zA-Z0-9_-]{25,40})"\][\s\S]*?\"(\d+\.(?:png|jpg|jpeg|webp))\"/gi;
let match;
while ((match = itemRegex.exec(content)) !== null) {
  const fileId = match[1];
  const filename = match[2];
  const num = parseInt(filename);
  if (num >= 500 && num <= 700) {
    fileMap.set(num, { fileId, filename });
  }
}

console.log(`Extracted ${fileMap.size} files from initial HTML:`);
const sortedNums = [...fileMap.keys()].sort((a, b) => a - b);
console.log('Range:', sortedNums[0], 'to', sortedNums[sortedNums.length - 1]);
console.log('Total unique kurals:', sortedNums.length);
console.log('Numbers:', sortedNums);

fs.writeFileSync('gdrive_file_map_all.json', JSON.stringify(Object.fromEntries(fileMap), null, 2));
