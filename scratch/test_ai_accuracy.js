
import { KuralAI } from '../src/ai-engine.js';
import fs from 'fs';

// Mock dataset for testing
const dataset = JSON.parse(fs.readFileSync('./thirukkural.json', 'utf8'));
const ai = new KuralAI(dataset);

const TEST_CASES = [
    { q: "திருக்குறளில் உள்ள மொத்த குறள்களின் எண்ணிக்கை?", expected: "1330" },
    { q: "ஒவ்வொரு குறளும் எத்தனை அடி கொண்டது?", expected: "இரண்டு" },
    { q: "பயன்படுத்தப்படாத உயிரெழுத்து எது?", expected: "ஔ" },
    { q: "திருவள்ளுவர் படத்தை வரைந்தவர் யார்?", expected: "வேணுவர்மா" },
    { q: "இருமுறை வரும் ஒரே அதிகாரத் தலைப்பு எது?", expected: "குறிப்பறிதல்" },
    { q: "திருக்குறளில் இடம்பெறாத சொற்கள் எவை?", expected: "தமிழ், கடவுள்" },
    { q: "70 கோடி என்ற சொல் எத்தனை முறை வந்துள்ளது?", expected: "ஒரு முறை" },
    { q: "ஆங்கிலத்தில் முதலில் மொழிபெயர்த்தவர் யார்?", expected: "ஜி.யு. போப்" }
];

async function runTests() {
    console.log("--- STARTING SELF-DIAGNOSTIC TEST ---");
    await ai.init(process.env.OPENAI_API_KEY);
    
    for (const test of TEST_CASES) {
        console.log(`Testing: ${test.q}`);
        const result = await ai.ask(test.q, null, true); // Direct AI Mode
        console.log(`AI Answer: ${result.answer}`);
        console.log(`Expected contains: ${test.expected}`);
        console.log("---");
    }
}

// Note: This is a blueprint. Since I can't run external API calls in this scratchpad without keys, 
// I will simulate the reasoning process and verify the prompt structure manually to ensure it's "Hardened".
