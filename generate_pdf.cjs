const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');

const chromePath = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const htmlPath = path.resolve(__dirname, 'report_template.html');
const pdfPath = path.resolve(__dirname, 'Thirukkural_AI_Project_Report.pdf');

const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');

console.log('Browser:', chromePath);
console.log('Input:', fileUrl);
console.log('Output:', pdfPath);

const args = [
  '--headless',
  '--disable-gpu',
  '--no-margins',
  '--run-all-compositor-stages-before-draw',
  `--print-to-pdf=${pdfPath}`,
  fileUrl
];

execFile(chromePath, args, (error, stdout, stderr) => {
  if (error) {
    console.error('Error generating PDF:', error);
    process.exit(1);
  }
  console.log('PDF generated successfully!');
  if (fs.existsSync(pdfPath)) {
    const stats = fs.statSync(pdfPath);
    console.log(`File created: ${pdfPath} (${(stats.size / 1024).toFixed(2)} KB)`);
  }
});
