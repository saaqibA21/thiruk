
import fs from 'fs';
import { KuralAI } from '../src/ai-engine.js';

const dataset = JSON.parse(fs.readFileSync('./thirukkural.json', 'utf8')).kural;
const ai = new KuralAI(dataset);

async function test() {
    const query = "நல்லார்கண் என்னா துடாங்கும் குறள்";
    const result = await ai.search(query);
    console.log("Query:", query);
    console.log("Clean Query:", query.normalize('NFC').toLowerCase().replace(/[.,!?;:"\-_…·\s]+/g, ' ').trim());
    const tudaangum = "துடாங்கும்";
    console.log("Tudaangum Hex:", Buffer.from(tudaangum).toString('hex'));
    console.log("Query Part Hex:", Buffer.from(query.split(' ')[2]).toString('hex'));
    console.log("IsStartsWith:", result.isStartsWith);
    console.log("Results count:", result.results.length);
    if (result.results.length > 0) {
        console.log("Top Match Number:", result.results[0].Number);
        console.log("Top Match Score:", result.results[0].score);
        console.log("Top Match Line1:", result.results[0].Line1);
    } else {
        console.log("No results found.");
    }
}

test();
