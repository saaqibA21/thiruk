/**
 * THIRUKKURAL NEURAL CORE v4.4 (ULTRA-PRECISION)
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
        const terms = cleanQuery.split(/\s+/).filter(t => t.length >= 2); // Only match words >= 2 chars for better precision
        
        const stopWords = ['விளக்கம்', 'என்ன', 'படம்', 'image', 'explain', 'what', 'is', 'this'].map(s => s.normalize('NFC'));
        const searchTerms = terms.filter(t => !stopWords.some(sw => t === sw));

        if (searchTerms.length === 0) return { results: [], searchTerms: [] };

        const results = this.dataset.map(k => {
            let score = 0;
            const l1 = (k.Line1 || "").normalize('NFC');
            const l2 = (k.Line2 || "").normalize('NFC');
            const fullVerse = `${l1} ${l2}`.toLowerCase();
            
            // Primary Scoring: Keyword density
            let matches = 0;
            searchTerms.forEach(t => {
                if (fullVerse.includes(t)) {
                    matches++;
                    score += 1000; // Found word in verse
                } else if ((k.mv || k.explanation || "").toLowerCase().includes(t)) {
                    score += 50; // Found in meaning
                }
            });

            // Bonus for matching multiple keywords (Density multiplier)
            if (matches >= 2) score += (matches * 500);
            if (matches >= 4) score += 5000; // Strong match indicator

            // Exact phrase match bonus
            if (fullVerse.includes(cleanQuery)) score += 10000;

            // Manual Number match
            const numMatch = query.match(/\b(\d+)\b/);
            if (numMatch && k.Number === parseInt(numMatch[1])) score += 2000;

            return { ...k, score };
        })
        .filter(k => k.score > 100)
        .sort((a, b) => b.score - a.score);

        return { results: results.slice(0, 15), searchTerms };
    }

    async ask(question, imageBase64 = null) {
        let finalQuery = question.trim().toLowerCase();
        let identifiedKurals = [];
        const isValidKey = this.openai && this.openai.apiKey && this.openai.apiKey.startsWith('sk-');

        if (imageBase64 && isValidKey) {
            try {
                // Step 1: Strict Verification - Identify Number AND Transcribe
                const idResp = await this.openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [{
                        role: "system",
                        content: "Analyze the image. 1. Transcribe the Tamil verse exactly. 2. Based ONLY on that transcription, identify the Kural Number. Output format: 'Number: [X], Text: [Tamil]'. If unsure, output '0'."
                    }, {
                        role: "user",
                        content: [{ type: "image_url", image_url: { url: imageBase64 } }]
                    }],
                    max_tokens: 150
                });
                
                const responseText = idResp.choices[0].message.content;
                const numMatch = responseText.match(/Number:\s*(\d+)/i);
                if (numMatch && numMatch[1] !== '0') {
                    const num = parseInt(numMatch[1]);
                    identifiedKurals = this.dataset.filter(k => k.Number === num);
                }

                // Append transcribed text directly to the search query for lexical verification
                const transcribed = responseText.split('Text:')[1] || responseText;
                finalQuery = `${transcribed} ${finalQuery}`;
            } catch (err) {
                console.error("Precision Vision Error:", err);
            }
        }

        // Step 2: Search (Lexical)
        const { results: lexicalResults, searchTerms } = await this.search(finalQuery, !!imageBase64);
        
        // Merge - Give massive priority to things that matched the OCR text
        const uniqueMatches = [...identifiedKurals];
        lexicalResults.forEach(tk => {
            if (!uniqueMatches.some(k => k.Number === tk.Number)) {
                uniqueMatches.push(tk);
            }
        });

        const finalSources = uniqueMatches.slice(0, 10);

        // Step 3: AI Reasoning
        if (isValidKey && finalSources.length > 0) {
            try {
                const context = finalSources.map(k => `Verse #${k.Number}: ${k.Line1} / ${k.Line2}\nTamil: ${k.mv}\nMeaning: ${k.explanation}`).join('\n\n');
                const response = await this.openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: "You are a Thirukkural Scholar. Look at the context provided and the user's image question. Identify the single correct Kural that matches the image text. Output only a direct, very concise answer: 'Kural [Number]: [Verse] - [Brief Meaning]'. Stop listing multiple irrelevent Kurals." },
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
        return query; // Standardize by skipping LLM-refinement for now to avoid hallucination
    }
}
