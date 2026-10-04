import fs from 'fs';

const content = fs.readFileSync('gdrive_raw.html', 'utf8');

// Regex to find: [[["<filename>.png",null,1]]] and file ID
// In the structure: [[null, "<fileId>"], ..., [[["501.png", ...

const fileIdMap = new Map();

// Match pattern: [null,"([a-zA-Z0-9_-]{25,40})"] followed eventually by "(\d+)\.png"
const itemRegex = /\[\[null,"([a-zA-Z0-9_-]{25,40})"\][\s\S]*?\"(\d+\.png)\"/g;
let match;
while ((match = itemRegex.exec(content)) !== null) {
  const fileId = match[1];
  const filename = match[2];
  const kuralNum = parseInt(filename);
  if (kuralNum >= 500 && kuralNum <= 650) {
    fileIdMap.set(kuralNum, { fileId, filename });
  }
}

console.log(`Extracted ${fileIdMap.size} files:`);
const sortedNums = [...fileIdMap.keys()].sort((a, b) => a - b);
console.log('Range:', sortedNums[0], 'to', sortedNums[sortedNums.length - 1]);
console.log('List of numbers:', sortedNums);

fs.writeFileSync('gdrive_file_map.json', JSON.stringify(Object.fromEntries(fileIdMap), null, 2));
