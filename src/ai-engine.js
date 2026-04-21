/**
 * THIRUKKURAL NEURAL CORE v4.2 (PRECISION IMAGE MATCHING)
 */

import OpenAI from 'openai';

export class KuralAI {
    constructor(dataset) {
        this.dataset = dataset;
        this.openai = null;
    }

    async init(apiKey) {
        if (apiKey && apiKey.startsWith('sk-')) {
            this.openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
        }
        if (window.onNeuralProgress) window.onNeuralProgress(100);
    }

    async search(query, isImageSearch = false) {
        if (!query) return { results: [], searchTerms: [] };

        // For image searches, skip refinement to preserve literal OCR characters
        const refinedQuery = isImageSearch ? query : await this.refineQuery(query);
        const cleanQuery = refinedQuery.toLowerCase().trim().normalize('NFC');
        const terms = cleanQuery.split(/\s+/).filter(t => t.length >= 1);
        
        // Structural search keywords
        const endKeywords = ['முடியும்', 'mudiyum', 'ending', 'nding', 'முடிவு', 'ஈறு', 'கடைசி', 'ends with', 'end'].map(s => s.normalize('NFC'));
        const startKeywords = ['தொடங்கும்', 'thodangum', 'starting', 'start', 'தொடக்கம்', 'ஆரம்பம்', 'முதல்', 'starts with'].map(s => s.normalize('NFC'));
        
        const isEndsWithQuery = endKeywords.some(kw => cleanQuery.includes(kw));
        const isStartsWithQuery = startKeywords.some(kw => cleanQuery.includes(kw));
        const isStructuralQuery = isEndsWithQuery || isStartsWithQuery;
        
        const stopWords = [
            ...endKeywords, ...startKeywords, 
            'இந்த', 'படத்தின்', 'விளக்கம்', 'என்ன', 'படம்', 'image', 'explanation', 'what', 'is', 'this', 'tell', 'me'
        ].map(s => s.normalize('NFC'));
        
        const searchTerms = terms
            .map(t => t.replace(/[.,!?;:"\-_…·]/g, '').normalize('NFC'))
            .filter(t => t.length >= 1 && !stopWords.some(sw => t === sw));

        let startMatchCount = 0;
        let endMatchCount = 0;

        const results = this.dataset.map(k => {
            let score = 0;
            let hasWordMatch = false;
            let currentIsStart = false;
            let currentIsEnd = false;

            const l1 = (k.Line1 || "").toLowerCase().normalize('NFC');
            const l2 = (k.Line2 || "").toLowerCase().normalize('NFC');
            const cleanL1 = l1.replace(/[.,!?;:"\-_…·]/g, '');
            const cleanL2 = l2.replace(/[.,!?;:"\-_…·]/g, '');
            
            const wordsL1 = cleanL1.trim().split(/\s+/);
            const wordsL2 = cleanL2.trim().split(/\s+/);
            const allWords = [...wordsL1, ...wordsL2];

            const tamilContent = `${k.Line1} ${k.Line2} ${k.mv || ''} ${k.sp || ''} ${k.mk || ''} ${k.explanation || ''}`.toLowerCase().normalize('NFC');
            const fullContent = `${tamilContent} ${k.Translation || ''} ${k.transliteration1 || ''} ${k.transliteration2 || ''}`.toLowerCase();

            // 1. Literal Word Matching (High weight for exact matches)
            searchTerms.forEach(t => {
                if (allWords.includes(t)) {
                    score += 100; // Found exact word in verse
                    hasWordMatch = true;
                } else if (fullContent.includes(t)) {
                    score += 20; // Found in meaning/explanation
                    hasWordMatch = true;
                }
                
                // Structural checks
                if (cleanL1.startsWith(t)) {
                    currentIsStart = true;
                    if (isStartsWithQuery) score += 500;
                }
                if (cleanL2.endsWith(t)) {
                    currentIsEnd = true;
                    if (isEndsWithQuery) score += 500;
                }
            });

            // 2. Phrase matching
            if (cleanQuery.length > 5 && fullContent.includes(cleanQuery)) {
                score += 300;
            }

            // 3. Number matching
            const numMatch = cleanQuery.match(/\b(\d+)\b/);
            if (numMatch && k.Number === parseInt(numMatch[1])) {
                score += 5000;
            }

            // 4. Structural Filtering (Only if explicitly requested and not an image search)
            if (isStructuralQuery && !isImageSearch) {
                if (!currentIsStart && !currentIsEnd) score *= 0.1;
            }

            return { ...k, score, isAtStart: currentIsStart, isAtEnd: currentIsEnd };
        })
        .filter(k => k.score > 15)
        .sort((a, b) => b.score - a.score);

        return { 
            results, 
            searchTerms, 
            metadata: { isStructuralQuery, isStartsWithQuery, isEndsWithQuery } 
        };
    }

    async ask(question, imageBase64 = null) {
        let queryText = question.trim().toLowerCase();
        let finalQuery = queryText;
        const isValidKey = this.openai && this.openai.apiKey && this.openai.apiKey.startsWith('sk-');

        // Step 1: Image Analysis
        if (imageBase64 && isValidKey) {
            try {
                const visionResponse = await this.openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content: "You are a Thirukkural scholar. Transcribe any Tamil text in the image exactly. Extract 3-5 core philosophical themes. Output only the transcription and keywords, no labels."
                        },
                        {
                            role: "user",
                            content: [
                                { type: "text", text: "What is this image about? Read any text." },
                                { type: "image_url", image_url: { url: imageBase64 } }
                            ]
                        }
                    ],
                    max_tokens: 300
                });
                const visionText = visionResponse.choices[0].message.content.trim();
                console.log("Vision Analysis:", visionText);
                
                // If it's a generic "What is this?" question, replace it with vision results
                const isGeneric = ['விளக்கம் என்ன', 'what is this', 'explain'].some(g => queryText.includes(g));
                finalQuery = isGeneric ? visionText : `${queryText} ${visionText}`;
            } catch (err) {
                console.error("Vision Error:", err);
            }
        }

        // Step 2: Search (Lexical)
        let { results, searchTerms, metadata: searchMeta } = await this.search(finalQuery, !!imageBase64);
        
        // Step 3: Semantic Fallback (Ask AI for Kural Numbers if keyword search fails)
        if (results.length === 0 && imageBase64 && isValidKey) {
            try {
                const semanticResp = await this.openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [{
                        role: "system",
                        content: "Identify the Thirukkural number(s) mentioned or shown in this image. Output ONLY the numbers separated by commas (e.g. 72, 101). If none found, output '0'."
                    }, {
                        role: "user",
                        content: [{ type: "image_url", image_url: { url: imageBase64 } }]
                    }],
                    max_tokens: 10
                });
                const identifiedNums = semanticResp.choices[0].message.content.match(/\d+/g);
                if (identifiedNums) {
                    const semanticMatches = this.dataset.filter(k => identifiedNums.map(Number).includes(k.Number));
                    results = [...results, ...semanticMatches];
                }
            } catch (err) { console.error("Semantic identifying error:", err); }
        }

        const topMatches = results.slice(0, 15);

        // Step 4: AI Reasoning or Fallback
        if (isValidKey && topMatches.length > 0) {
            try {
                const context = topMatches.map(k => `Verse #${k.Number}: ${k.Line1} / ${k.Line2}\nTamil: ${k.mv}\nMeaning: ${k.explanation}`).join('\n\n');
                const response = await this.openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: "You are a Thirukkural Expert. You use the provided context to answer. If an image is provided, identify it and explain the Kural within it using our scholar data." },
                        { role: "user", content: `Context:\n${context}\n\nQuestion: ${question}` }
                    ]
                });
                return { answer: response.choices[0].message.content.trim(), sources: topMatches };
            } catch (err) {
                console.error("AI Reasoner Error:", err);
            }
        }

        return { answer: this.fallback(question, topMatches, searchTerms, metadata), sources: topMatches };
    }

    fallback(question, matches, searchTerms, metadata) {
        if (matches.length === 0) return "மன்னிக்கவும், இது குறித்த குறள்கள் கிடைக்கவில்லை. / Sorry, no matching Kurals were found.";
        
        let msg = `"${searchTerms.join(', ')}" தொடர்பான ${matches.length} குறள்கள் இதோ:\n\n`;
        matches.slice(0, 3).forEach(k => {
            msg += `குறள் ${k.Number}:\n${k.Line1}\n${k.Line2}\n\n`;
        });
        return msg + "மேலும் விவரங்களுக்குக் கீழே உள்ள அட்டவணையைப் பார்க்கவும்.";
    }

    async refineQuery(query) {
        if (!this.openai || query.length < 4 || /^\d+$/.test(query)) return query;
        try {
            const resp = await this.openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "system", content: "Refine this search query into official Tamil. Output ONLY the refined query." }, { role: "user", content: query }],
                max_tokens: 50
            });
            return resp.choices[0].message.content.trim();
        } catch { return query; }
    }
}
