
const q = 'கொளி';
const d = 'கொளி';

console.log('Query:', q, q.length, [...q].map(c => c.charCodeAt(0).toString(16)));
console.log('Data :', d, d.length, [...d].map(c => c.charCodeAt(0).toString(16)));
console.log('Match:', q === d);
