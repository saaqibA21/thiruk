import fs from 'fs';
import path from 'path';

const filePath = path.join('c:', 'Users', 'SAAQIB', 'thirukural', 'thirukkural.json');
const content = fs.readFileSync(filePath, 'utf8');

const target = "தடை".normalize('NFC');

let count = 0;
let pos = content.indexOf(target);
while (pos !== -1) {
    count++;
    // find the Number of the kural containing this position
    // search backwards for "Number":
    const startOfObject = content.lastIndexOf('{', pos);
    const numberMatch = content.substring(startOfObject, pos + 100).match(/"Number":\s*(\d+)/);
    const kuralNum = numberMatch ? numberMatch[1] : 'unknown';
    
    console.log(`Match ${count} at pos ${pos} (Kural ${kuralNum}): ...${content.substring(pos - 20, pos + 20)}...`);
    pos = content.indexOf(target, pos + 1);
}
console.log(`Total matches for "தடை": ${count}`);
