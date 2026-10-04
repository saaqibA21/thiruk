import fs from 'fs';

const text = fs.readFileSync('gdrive_raw.html', 'utf8');

const allPng = [...text.matchAll(/"(\d+)\.png"/g)].map(m => parseInt(m[1]));
const sorted = [...new Set(allPng)].sort((a, b) => a - b);
console.log('Unique PNG numbers in raw HTML:', sorted);
console.log('Total count:', sorted.length);

// Check if there are any other file extensions
const allFiles = [...text.matchAll(/"([^"]+\.(?:png|jpg|jpeg|webp|zip|tar))"/gi)].map(m => m[1]);
console.log('Other files:', [...new Set(allFiles)]);
