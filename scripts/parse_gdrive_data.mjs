import fs from 'fs';

function parseCallback(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let data = null;
  const mockInit = (obj) => {
    data = obj.data;
  };

  const fn = new Function('AF_initDataCallback', content);
  try {
    fn(mockInit);
    return data;
  } catch (e) {
    console.error('Error executing callback:', e);
    return null;
  }
}

const d2 = parseCallback('callback_2.js');
const d4 = parseCallback('callback_4.js');

console.log('d2 type:', typeof d2, Array.isArray(d2));
console.log('d4 type:', typeof d4, Array.isArray(d4));

fs.writeFileSync('d2.json', JSON.stringify(d2, null, 2));
fs.writeFileSync('d4.json', JSON.stringify(d4, null, 2));
console.log('Saved d2.json and d4.json');
