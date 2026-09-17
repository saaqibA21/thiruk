import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const dataPath = path.join(ROOT_DIR, 'thirukkural.json');
const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const kurals = rawData.kural || rawData;

function buildPromptWithInscribedText(kural) {
  const num = kural.Number;
  const line1 = kural.Line1;
  const line2 = kural.Line2;
  const translation = (kural.Translation || kural.explanation || kural.couplet || '').replace(/["']/g, '').trim();
  const tamilExp = (kural.mv || kural.sp || kural.mk || '').replace(/["']/g, '').trim();

  let sceneDetails = '';
  let themeStyle = 'classical Tamil Sangam era aesthetics, ancient South Indian spiritual atmosphere, dramatic cinematic lighting, rich oil painting, hyper-detailed textures, 8k resolution, masterpiece';

  if (num <= 380) {
    // Aram
    sceneDetails = `Serene natural sanctuary with ancient banyan trees, temple courtyards, sacred lotus ponds, and morning sunlight breaking through misty skies. Expressing the moral concept: ${tamilExp.slice(0, 110)}.`;
  } else if (num <= 1080) {
    // Porul
    sceneDetails = `Majestic ancient Tamil stone halls, granite pillars, prosperous village harvest, wise scholars and noble leaders in Sangam attire. Expressing the governance & wisdom concept: ${tamilExp.slice(0, 110)}.`;
  } else {
    // Inbam
    sceneDetails = `Poetic moonlit courtyard, lotus pond, flowering jasmine vines, delicate traditional Sangam elegance, soft twilight atmosphere. Expressing the romance concept: ${tamilExp.slice(0, 110)}.`;
  }

  const prompt = `A magnificent, culturally authentic cinematic fine art painting representing Thirukkural Verse #${num}.

SCENE DESCRIPTION & VISUAL METAPHOR:
${sceneDetails}
Style: ${themeStyle}.

TEXT & INSCRIPTION REQUIREMENT (MANDATORY IN THE IMAGE):
In the bottom foreground, render a prominent, beautifully carved ancient stone slab / weathered granite tablet engraved with the authentic 2-line Tamil Thirukkural couplet:
"${line1}
${line2}"

Along with a small bronze plaque at the bottom with the English translation:
"${translation}"`;

  return prompt;
}

let md = `# 🏛️ Thirukkural - Universal 1,330 Visual Art Prompts (With In-Image Tamil Kural Inscription)\n\n`;
md += `Every prompt below explicitly instructs **Google Gemini (gemini.google.com)**, **ChatGPT (DALL·E 3)**, **Bing Image Creator (Copilot)**, or **Midjourney** to render both the **cinematic visual metaphor** AND the **engraved Tamil Kural text tablet** directly inside the image (matching the style of Kural 1–10 cards)!\n\n`;
md += `> **💡 How to use:**\n`;
md += `> 1. Copy any prompt below.\n`;
md += `> 2. Paste into [gemini.google.com](https://gemini.google.com) or ChatGPT.\n`;
md += `> 3. Download the generated image and save it as \`public/kural_images/<number>.jpg\` (e.g. \`11.jpg\`).\n`;
md += `> 4. The website will automatically render the artwork with the Kural on your site!\n\n`;
md += `---\n\n`;

for (let i = 0; i < kurals.length; i++) {
  const k = kurals[i];
  const num = k.Number;
  if (num % 10 === 1) {
    const chNum = Math.ceil(num / 10);
    md += `\n## 📖 அதிகாரம் ${chNum} (Chapter ${chNum})\n\n`;
  }

  const prompt = buildPromptWithInscribedText(k);
  md += `### குறள் ${num}: ${k.Line1}...\n\n`;
  md += `**குறள்:**\n> *${k.Line1}*\n> *${k.Line2}*\n\n`;
  md += `**பொருள்:** ${k.mv || k.sp || k.explanation}\n\n`;
  md += `**🎨 AI Image Prompt (With Tamil Kural Text in Image):**\n\`\`\`text\n${prompt}\n\`\`\`\n\n`;
  md += `---\n\n`;
}

const outputPath = path.join(ROOT_DIR, 'KURAL_ART_PROMPTS.md');
fs.writeFileSync(outputPath, md, 'utf8');
console.log(`✅ Successfully updated all 1,330 prompts with in-image Kural inscriptions in ${outputPath}`);
