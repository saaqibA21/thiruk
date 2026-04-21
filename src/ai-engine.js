/**
 * THIRUKKURAL NEURAL CORE v4.5 (TEXT-MATCH SUPREMACY)
 */

import OpenAI from 'openai';

export class KuralAI {
    constructor(dataset) {
        this.dataset = dataset;
        this.openai = null;
    }

    async init(apiKey) {
        const cleanKey = apiKey?.trim();
        if (cleanKey && cleanKey.startsWith('sk-')) {
            this.openai = new OpenAI({ apiKey: cleanKey, dangerouslyAllowBrowser: true });
        }
        if (window.onNeuralProgress) window.onNeuralProgress(100);
    }

    async search(query, isImageSearch = false) {
        if (!query) return { results: [], searchTerms: [] };

        // Clean query: remove noise but KEEP Tamil characters
        const cleanQuery = query.toLowerCase().trim().normalize('NFC').replace(/[-._…·]{2,}/g, ' ');
        // Extract words, specifically prioritizing Tamil words
        const terms = cleanQuery.split(/\s+/).filter(t => t.length >= 2);
        
        const stopWords = ['விளக்கம்', 'என்ன', 'படம்', 'image', 'explain', 'what', 'is', 'this', 'text', 'verse'].map(s => s.normalize('NFC'));
        const searchTerms = terms.filter(t => !stopWords.some(sw => t === sw));

        if (searchTerms.length === 0) return { results: [], searchTerms: [] };

        const results = this.dataset.map(k => {
            let score = 0;
            const l1 = (k.Line1 || "").normalize('NFC');
            const l2 = (k.Line2 || "").normalize('NFC');
            const verseText = `${l1} ${l2}`.toLowerCase();
            
            // Primary Scoring: Keyword density in the poem itself
            let wordMatches = 0;
            searchTerms.forEach(t => {
                if (verseText.includes(t)) {
                    wordMatches++;
                    score += 2000; // Deep reward for matching poetry words
                } else if ((k.mv || k.explanation || "").toLowerCase().includes(t)) {
                    score += 100; // Smaller reward for matching meanings
                }
            });

            // Exponential bonus for multiple word matches
            if (wordMatches >= 2) score += 5000;
            if (wordMatches >= 4) score += 20000;

            // Exact phrase match (High weight)
            if (verseText.includes(cleanQuery)) score += 50000;

            // Number match (Low weight to avoid workbook confusion)
            const numMatch = query.match(/\b(\d+)\b/);
            if (numMatch && k.Number === parseInt(numMatch[1])) {
                // Only give number bonus if at least one word also matches
                if (wordMatches > 0) score += 500;
            }

            return { ...k, score };
        })
        .filter(k => k.score > 100)
        .sort((a, b) => b.score - a.score);

        return { results: results.slice(0, 15), searchTerms };
    }

    async ask(question, imageBase64 = null) {
        let finalQuery = question.trim().toLowerCase();
        const isValidKey = this.openai && this.openai.apiKey && this.openai.apiKey.startsWith('sk-');

        if (imageBase64 && isValidKey) {
            try {
                // Step 1: Pure Transcription (Don't ask for the number to avoid bias)
                const visionResp = await this.openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [{
                        role: "system",
                        content: "You are a Tamil transcriber. Transcribe the core Thirukkural verse text from the image. Ignore dashes, dots, and any small numbers at the start (labels). Output ONLY the transcribed Tamil text."
                    }, {
                        role: "user",
                        content: [{ type: "image_url", image_url: { url: imageBase64 } }]
                    }],
                    max_tokens: 100
                });
                
                const transcribed = visionResp.choices[0].message.content.trim();
                console.log("Transcription:", transcribed);
                finalQuery = `${transcribed} ${finalQuery}`;
            } catch (err) {
                console.error("Transcription Error:", err);
            }
        }

        // Step 2: Search (Lexical Supremacy)
        const { results: lexicalResults, searchTerms } = await this.search(finalQuery, !!imageBase64);
        const finalSources = lexicalResults.slice(0, 5);

        // Step 3: AI Reasoning
        if (isValidKey && finalSources.length > 0) {
            try {
                const context = finalSources.map(k => `Verse #${k.Number}: ${k.Line1} / ${k.Line2}\nTamil: ${k.mv}\nMeaning: ${k.explanation}`).join('\n\n');
                const response = await this.openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: "You are a Thirukkural Scholar. Based ONLY on the provided context, identify the Kural that matches the user's request. Output: 'Kural [Number]: [Verse] - [Direct Meaning]'. Be incredibly concise. No extra text." },
                        { role: "user", content: `Context:\n${context}\n\nQuestion: ${question}` }
                    ]
                });
                return { answer: response.choices[0].message.content.trim(), sources: finalSources };
            } catch (err) {
                console.error("AI Reasoner Error:", err);
            }
        }

        return { answer: this.fallback(question, finalSources, searchTerms), sources: finalSources };
    }

    fallback(question, matches, searchTerms) {
        if (matches.length === 0) return "மன்னிக்கவும், இது குறித்த குறள்கள் கிடைக்கவில்லை.";
        const top = matches[0];
        return `Kural ${top.Number}:\n${top.Line1}\n${top.Line2}\n\n${top.mv}`;
    }

    async refineQuery(query) {
        return query; 
    }
}
