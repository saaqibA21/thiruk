import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const dataPath = path.join(ROOT_DIR, 'thirukkural.json');
const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const kurals = rawData.kural || rawData;

function getAthigaramName(kuralNum) {
  const chNum = Math.ceil(kuralNum / 10);
  return `Chapter ${chNum}`;
}

function buildPrompt(kural) {
  const num = kural.Number;
  const translation = (kural.Translation || kural.explanation || kural.couplet || '').replace(/["']/g, '').trim();
  const tamilExp = (kural.mv || kural.sp || kural.mk || '').replace(/["']/g, '').trim();

  let theme = 'classical Tamil Sangam era aesthetics, ancient South Indian atmosphere, dramatic cinematic lighting, rich oil painting, detailed textures, 8k resolution, fine art masterpiece';
  
  if (num <= 380) {
    theme += ', serene natural landscapes, spiritual grace, temple architecture, morning sunlight, palm leaf manuscripts';
  } else if (num <= 1080) {
    theme += ', majestic ancient Tamil royal courts, grand stone pillars, bustling village markets, wise kings, lush paddy fields';
  } else {
    theme += ', poetic romance, moonlit lotus ponds, traditional Sangam attire, tender emotion, soft twilight colors';
  }

  return `Generate a culturally authentic, cinematic fine art painting representing Thirukkural Verse #${num}: "${translation}". Visual Metaphor: Expressing "${tamilExp.slice(0, 100)}...". Style: ${theme}. Pure fine art, no typography or modern elements.`;
}

let md = `# 🏛️ Thirukkural - Universal 1,330 Visual Art Prompts\n\n`;
md += `Use these prompts directly in **Google Gemini (gemini.google.com)**, **ChatGPT (DALL·E 3)**, **Bing Image Creator (Copilot)**, or **Midjourney** to generate authentic, culturally rich visual artworks for each Thirukkural.\n\n`;
md += `> **💡 How to use:**\n`;
md += `> 1. Copy any prompt below.\n`;
md += `> 2. Paste into [gemini.google.com](https://gemini.google.com).\n`;
md += `> 3. Download the generated image and save it into your project folder as \`public/kural_images/<number>.jpg\` (e.g., \`11.jpg\`).\n`;
md += `> 4. The website will automatically render the artwork on the Kural card!\n\n`;
md += `---\n\n`;

for (let i = 0; i < kurals.length; i++) {
  const k = kurals[i];
  const num = k.Number;
  if (num % 10 === 1) {
    const chNum = Math.ceil(num / 10);
    md += `\n## 📖 அதிகாரம் ${chNum} (Chapter ${chNum})\n\n`;
  }

  const prompt = buildPrompt(k);
  md += `### குறள் ${num} (${k.Line1}...)\n`;
  md += `**குறள்:**\n> *${k.Line1}*\n> *${k.Line2}*\n\n`;
  md += `**பொருள்:** ${k.mv || k.sp || k.explanation}\n\n`;
  md += `**🎨 AI Art Prompt:**\n\`\`\`text\n${prompt}\n\`\`\`\n\n`;
  md += `---\n\n`;
}

const outputPath = path.join(ROOT_DIR, 'KURAL_ART_PROMPTS.md');
fs.writeFileSync(outputPath, md, 'utf8');
console.log(`✅ Successfully generated all 1,330 prompts in ${outputPath}`);
