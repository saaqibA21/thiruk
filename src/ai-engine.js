/**
 * THIRUKKURAL NEURAL CORE v4.7 (SYLLABIC PREFIX MASTERY)
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

        const cleanQuery = query.toLowerCase().trim().normalize('NFC').replace(/[-._…·]{2,}/g, ' ');
        
        // Structural Logic
        const startKeywords = ['தொடங்கும்', 'துடங்கும்', 'starting', 'start', 'தொடக்கம்', 'ஆரம்பம்', 'சதொடங்கு'].map(s => s.normalize('NFC'));
        const endKeywords = ['முடியும்', 'முடிகிற', 'ending', 'ends with', 'முடிவு', 'ஈறு'].map(s => s.normalize('NFC'));

        const isStartsWith = startKeywords.some(kw => cleanQuery.includes(kw));
        const isEndsWith = endKeywords.some(kw => cleanQuery.includes(kw));

        // Extract the target word for structural search
        let structuralTarget = "";
        const allQueryWords = cleanQuery.split(/\s+/);
        structuralTarget = allQueryWords.find(w => 
            !startKeywords.includes(w) && 
            !endKeywords.includes(w) && 
            w.length > 2 &&
            !['என்று', 'எண்று', 'என', 'சொல்லுடன்', 'தொடர்புடைய'].includes(w)
        ) || allQueryWords[0];

        // Clean target prefix (first 3-4 chars are usually enough for Tamil stems)
        const targetPrefix = structuralTarget.substring(0, 4);

        const stopWords = ['விளக்கம்', 'என்ன', 'படம்', 'image', 'explain', 'what', 'என்று', 'எண்று', 'சொல்லுடன்', 'தொடர்புடைய'].map(s => s.normalize('NFC'));
        const searchTerms = allQueryWords.filter(t => !stopWords.some(sw => t === sw) && !startKeywords.includes(t) && !endKeywords.includes(t));

        const results = this.dataset.map(k => {
            let score = 0;
            const l1 = (k.Line1 || "").normalize('NFC').toLowerCase().replace(/[.,!?;:"\-_…·]/g, '');
            const l2 = (k.Line2 || "").normalize('NFC').toLowerCase().replace(/[.,!?;:"\-_…·]/g, '');
            const verseText = `${l1} ${l2}`;
            const words = verseText.trim().split(/\s+/);

            // 1. Structural Matches (High Priority)
            if (isStartsWith || true) { // Always give some weight to prefix match even if not explicit
                const weight = isStartsWith ? 10000 : 2000;
                if (l1.startsWith(structuralTarget)) score += weight;
                else if (l1.startsWith(targetPrefix)) score += (weight / 2);
                else if (words[0].startsWith(targetPrefix)) score += (weight / 3);
            }

            if (isEndsWith && structuralTarget) {
                const targetSuffix = structuralTarget.length > 4 ? structuralTarget.slice(-4) : structuralTarget;
                const lastWord = words[words.length - 1].replace(/[.,!?;:"\-_…·]$/, '');
                if (l2.endsWith(structuralTarget)) score += 10000;
                else if (lastWord.endsWith(structuralTarget)) score += 5000;
                else if (lastWord.endsWith(targetSuffix)) score += 2000;
            }

            // 2. Keyword Density & Intelligent Partial Matches
            let matches = 0;
            searchTerms.forEach(t => {
                const tPrefix = t.substring(0, 4);
                // Exact word match
                if (words.some(w => w === t)) {
                    matches++;
                    score += 2000;
                } 
                // Syllabic Prefix Match (very robust for Tamil sandhi)
                else if (words.some(w => w.startsWith(tPrefix))) {
                    matches += 0.7;
                    score += 1500;
                }
                // Meaning match
                else if ((k.mv || "").toLowerCase().includes(t)) {
                    score += 100;
                }
            });

            if (matches >= 2) score += 5000;
            if (verseText.includes(cleanQuery)) score += 50000;

            const numMatch = query.match(/\b(\d+)\b/);
            if (numMatch && k.Number === parseInt(numMatch[1])) score += 5000;

            return { ...k, score };
        })
        .filter(k => k.score > 300)
        .sort((a, b) => b.score - a.score);

        return { results: results.slice(0, 15), searchTerms };
    }

    async ask(question, imageBase64 = null) {
        let finalQuery = question.trim().toLowerCase();
        const isValidKey = this.openai && this.openai.apiKey && this.openai.apiKey.startsWith('sk-');

        if (imageBase64 && isValidKey) {
            try {
                const visionResp = await this.openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [{
                        role: "system",
                        content: "Transcribe the core Tamil verse from this image. Ignore labels. Output ONLY text."
                    }, {
                        role: "user",
                        content: [{ type: "image_url", image_url: { url: imageBase64 } }]
                    }],
                    max_tokens: 100
                });
                finalQuery = visionResp.choices[0].message.content.trim() + " " + finalQuery;
            } catch (err) { console.error("Vision Error:", err); }
        }

        const { results: lexicalResults, searchTerms } = await this.search(finalQuery, !!imageBase64);
        const finalSources = lexicalResults.slice(0, 10);

        if (isValidKey && finalSources.length > 0) {
            try {
                const context = finalSources.map(k => `Verse #${k.Number}: ${k.Line1} / ${k.Line2}\nTamil: ${k.mv}`).join('\n\n');
                const response = await this.openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: "You are a Thirukkural Expert. Answer directly and concisely based on the context. If the user asks for kurals starting/ending with something, list them clearly." },
                        { role: "user", content: `Context:\n${context}\n\nQuestion: ${question}` }
                    ]
                });
                return { answer: response.choices[0].message.content.trim(), sources: finalSources };
            } catch (err) { console.error("AI Error:", err); }
        }

        return { answer: this.fallback(question, finalSources, searchTerms), sources: finalSources };
    }

    fallback(question, matches, searchTerms) {
        if (matches.length === 0) return "மன்னிக்கவும், இது குறித்த குறள்கள் கிடைக்கவில்லை.";
        let msg = "இதோ நீங்கள் தேடிய குறள்கள்:\n\n";
        matches.slice(0, 8).forEach(k => { msg += `குறள் ${k.Number}:\n${k.Line1}\n${k.Line2}\n\n`; });
        return msg;
    }

    async refineQuery(query) { return query; }
}
