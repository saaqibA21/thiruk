import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

export function loadAllPrompts() {
  const filePath = path.join(ROOT_DIR, 'KURAL_ART_PROMPTS.md');
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split(/\r?\n/);

  const promptMap = new Map();
  let currentKural = null;
  let capturing = false;
  let promptBuffer = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const kuralMatch = trimmed.match(/^###\s+குறள்\s+(\d+):/);
    if (kuralMatch) {
      if (currentKural && promptBuffer.length > 0) {
        promptMap.set(currentKural, promptBuffer.join('\n').trim());
        promptBuffer = [];
      }
      currentKural = parseInt(kuralMatch[1], 10);
      capturing = false;
      continue;
    }

    if (trimmed === '```text' && currentKural) {
      capturing = true;
      promptBuffer = [];
      continue;
    }

    if (capturing) {
      if (trimmed === '```') {
        capturing = false;
        if (currentKural) {
          promptMap.set(currentKural, promptBuffer.join('\n').trim());
          promptBuffer = [];
        }
      } else {
        promptBuffer.push(line);
      }
    }
  }

  if (currentKural && promptBuffer.length > 0) {
    promptMap.set(currentKural, promptBuffer.join('\n').trim());
  }

  return promptMap;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const prompts = loadAllPrompts();
  console.log(`Successfully parsed ${prompts.size} prompts from KURAL_ART_PROMPTS.md`);
  console.log('Prompt #1:\n' + prompts.get(1));
  console.log('---------------------------------');
  console.log('Prompt #11:\n' + prompts.get(11));
}
