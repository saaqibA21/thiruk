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

        const normalize = (text) => (text || "").normalize('NFC').toLowerCase().replace(/[.,!?;:"\-_…·\s]+/g, ' ').trim();
        const cleanQuery = normalize(query);
        const allQueryWords = cleanQuery.split(/\s+/);
        
        // Structural Logic
        const startKeywords = ['தொடங்கும்', 'துடங்கும்', 'starting', 'start', 'தொடக்கம்', 'ஆரம்பம்', 'சதொடங்கு'].map(s => s.normalize('NFC'));
        const endKeywords = ['முடியும்', 'முடிகிற', 'ending', 'ends with', 'முடிவு', 'ஈறு'].map(s => s.normalize('NFC'));

        const isStartsWith = startKeywords.some(kw => cleanQuery.includes(kw));
        const isEndsWith = endKeywords.some(kw => cleanQuery.includes(kw));

        // Extract the target word for structural search
        const structuralTarget = allQueryWords.find(w => 
            !startKeywords.includes(w) && 
            !endKeywords.includes(w) && 
            w.length > 2 &&
            !['என்று', 'எண்று', 'என', 'சொல்லுடன்', 'தொடர்புடைய', 'பற்றிய', 'பற்றி'].includes(w)
        ) || allQueryWords[0];

        const stopWords = ['விளக்கம்', 'என்ன', 'படம்', 'image', 'explain', 'what', 'என்று', 'எண்று', 'சொல்லுடன்', 'தொடர்புடைய', 'மீதி', 'காட்டு', 'மற்ற', 'இன்னும்', 'குறள்களையும்', 'காட்டவும்', 'தெரிவி'].map(s => s.normalize('NFC'));
        const searchTerms = allQueryWords.filter(t => !stopWords.some(sw => t === sw) && !startKeywords.includes(t) && !endKeywords.includes(t) && t.length > 1);

        const results = this.dataset.map(k => {
            let score = 0;
            const l1 = normalize(k.Line1);
            const l2 = normalize(k.Line2);
            const verseText = `${l1} ${l2}`;
            const words = verseText.split(/\s+/);

            if (isStartsWith && structuralTarget) {
                if (l1.startsWith(structuralTarget) || words[0].startsWith(structuralTarget)) score += 1000000;
                else return { ...k, score: 0 }; 
            }
            if (isEndsWith && structuralTarget) {
                const lastWord = words[words.length - 1];
                if (l2.endsWith(structuralTarget) || lastWord.endsWith(structuralTarget)) score += 1000000;
                else return { ...k, score: 0 };
            }

            if (!isStartsWith && !isEndsWith) {
                let matchedUniqueWords = 0;
                let matchedPrefixes = 0;
                searchTerms.forEach(t => {
                    const wordWeight = t.length * 1000;
                    if (words.includes(t)) {
                        score += 20000 + wordWeight; // Heavily weight exact matches
                        matchedUniqueWords++;
                    } else if (words.some(w => w.startsWith(t.substring(0, 3)))) {
                        score += 5000 + (t.length * 500); // Significant prefix match weight
                        matchedPrefixes++;
                    }
                    if (normalize(k.mv).includes(t)) score += 1000;
                });

                // Semantic Density Bonus
                const totalDensity = matchedUniqueWords + (matchedPrefixes * 0.5);
                if (totalDensity >= 4) score += 1000000;
                else if (totalDensity >= 2.5) score += 500000;
                else if (totalDensity >= 1.5) score += 200000;

                if (verseText.includes(cleanQuery)) score += 500000;

                // Sequence Match Bonus (Perfect for fill-in-the-blanks)
                if (searchTerms.length > 1) {
                    let lastIdx = -1;
                    let matchCount = 0;
                    for (const term of searchTerms) {
                        const idx = verseText.indexOf(term, lastIdx + 1);
                        if (idx > lastIdx) {
                            matchCount++;
                            lastIdx = idx;
                        }
                    }
                    if (matchCount >= searchTerms.length) score += 1000000;
                    else if (matchCount >= 2) score += 100000;
                }
            }

            const numMatch = query.match(/\b(\d+)\b/);
            if (numMatch) {
                const matchedNum = parseInt(numMatch[1]);
                if (k.Number === matchedNum) {
                    // Image searches should almost never rely on numbers found in the image
                    score += isImageSearch ? 1000 : 500000;
                }
            }

            return { ...k, score };
        })
        .filter(k => k.score > 0)
        .sort((a, b) => b.score - a.score);

        return { results: results.slice(0, 100), searchTerms };
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
                        content: `Identify the Thirukkural from the image. 
                        Ignore question numbers like "25." or "Q1:". 
                        If you see a Kural number (1-1330), output: KURAL [number].
                        Otherwise, output the transcribed Tamil text of the verse.
                        Be extremely concise.`
                    }, {
                        role: "user",
                        content: [{ type: "image_url", image_url: { url: imageBase64 } }]
                    }],
                    max_tokens: 100
                });
                
                let transcribed = visionResp.choices[0].message.content.trim();
                const numMatch = transcribed.match(/KURAL\s*(\d+)/i);
                
                if (numMatch) {
                    const num = parseInt(numMatch[1]);
                    if (num > 0 && num <= 1330) {
                        finalQuery = `Kural ${num} ` + finalQuery;
                    }
                } else {
                    finalQuery = transcribed + " " + finalQuery;
                }
            } catch (err) { console.error("Vision Error:", err); }
        }

        if (!finalQuery.trim() && imageBase64) {
            finalQuery = "அன்பு"; // Fallback to "Love" - a very common theme
        }

        const { results: lexicalResults, searchTerms } = await this.search(finalQuery, !!imageBase64);
        const finalSources = lexicalResults;

        if (finalSources.length > 0) {
            const questionWords = ['what', 'explain', 'why', 'how', 'meaning', 'விளக்கம்', 'பொருள்', 'ஏன்', 'எப்படி', 'என்ன'].map(s => s.normalize('NFC'));
            const isQuestion = question.includes('?') || questionWords.some(w => question.toLowerCase().includes(w));
            
            if (!isQuestion && !imageBase64) {
                const count = finalSources.length;
                const intro = count > 0 
                    ? `இது குறித்து ${count} குறள்கள் கண்டறியப்பட்டுள்ளன. இதோ உங்களுக்காக:` 
                    : "மன்னிக்கவும், இது குறித்த குறள்கள் என் தரவுத்தளத்தில் இல்லை.";
                return { answer: intro, sources: finalSources };
            }

            try {
                // Limit context to top 7 matches to prevent prompt overflow
                const context = finalSources.slice(0, 7).map(k => `Kural #${k.Number}: ${k.Line1} / ${k.Line2}`).join('\n\n');
                const response = await this.openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: "You are a Thirukkural Scholar. Provide a brief, soulful insight in Tamil. STRICT RULE: Never repeat the Kural verse text or its number. Just provide the wisdom." },
                        { role: "user", content: `Context:\n${context}\n\nQuestion: ${question}` }
                    ]
                });
                return { answer: response.choices[0].message.content.trim(), sources: finalSources };
            } catch (err) { 
                console.error("AI Error:", err); 
                return { answer: "மன்னிக்கவும், பதிலைத் தயார் செய்வதில் சிறு பிழை ஏற்பட்டுள்ளது.", sources: finalSources };
            }
        }

        return { answer: this.fallback(question, finalSources, searchTerms), sources: finalSources };
    }

    fallback(question, matches, searchTerms) {
        if (matches.length === 0) return "மன்னிக்கவும், நீங்கள் கேட்ட தலைப்பில் என்னிடம் குறள்கள் இல்லை. வேறு ஏதேனும் தலைப்பை முயற்சி செய்யுங்கள்.";
        return `இது குறித்து ${matches.length} குறள்கள் கண்டறியப்பட்டுள்ளன. இதோ:`;
    }

    async refineQuery(query) { return query; }
}
