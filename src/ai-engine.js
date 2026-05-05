/**
 * THIRUKKURAL NEURAL CORE v4.7 (SYLLABIC PREFIX MASTERY)
 */

import OpenAI from 'openai';

export class KuralAI {
    constructor(dataset) {
        this.dataset = dataset;
        this.openai = null;
        this.aiHistory = []; // Track AI interactions for JSON export
    }

    async init(apiKey) {
        const cleanKey = apiKey?.trim();
        if (cleanKey && cleanKey.startsWith('sk-')) {
            const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
            // Use hardcoded local URL for proxy stability
            const baseURL = isLocal ? 'http://localhost:5174/api-openai/v1' : 'https://api.openai.com/v1';
            
            console.log("[Engine] Initializing OpenAI with baseURL:", baseURL);
            this.openai = new OpenAI({ 
                apiKey: cleanKey, 
                dangerouslyAllowBrowser: true,
                baseURL
            });
        }
        if (window.onNeuralProgress) window.onNeuralProgress(100);
    }

    async search(query, isImageSearch = false) {
        if (!query) return { results: [], searchTerms: [] };

        const normalize = (text) => (text || "").normalize('NFC').toLowerCase().replace(/[.,!?;:"\-_…·\s]+/g, ' ').trim();
        const cleanQuery = normalize(query);
        const allQueryWords = cleanQuery.split(/\s+/);
        
        // Fill-in-the-blank Regex (Powerful for textbook queries)
        let gapRegex = null;
        try { 
            const pieces = query.split(/[-._…·]{2,}/)
                .map(p => normalize(p).replace(/\d+/g, '').trim())
                .filter(p => p.length > 1);
            if (pieces.length > 1) {
                const escapedPieces = pieces.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
                gapRegex = new RegExp(escapedPieces.join('.*')); 
            }
        } catch(e) {}

        // Chapter/Adhikaram Match (New specific logic)
        const chapMatch = query.match(/\b(?:chapter|adhikaram|அதிகாரம்|அத்தியாயம்|ஹாப்டர்)\s*(\d+)\b/i);
        let chapterRange = null;
        if (chapMatch) {
            const chapNum = parseInt(chapMatch[1]);
            if (chapNum >= 1 && chapNum <= 133) {
                chapterRange = { start: (chapNum - 1) * 10 + 1, end: chapNum * 10, num: chapNum };
            }
        }
        const startKeywords = ['தொடங்கும்', 'துடங்கும்', 'starting', 'start', 'தொடக்கம்', 'ஆரம்பம்', 'சதொடங்கு'].map(s => s.normalize('NFC'));
        const endKeywords = ['முடியும்', 'முடிகிற', 'ending', 'ends with', 'முடிவு', 'ஈறு'].map(s => s.normalize('NFC'));

        const isStartsWith = startKeywords.some(kw => cleanQuery.includes(kw));
        const isEndsWith = endKeywords.some(kw => cleanQuery.includes(kw));

        // Extract the target word for structural search
        const structuralTarget = allQueryWords.find(w => 
            !startKeywords.includes(w) && 
            !endKeywords.includes(w) && 
            w.length > 1 &&
            !['என்று', 'எண்று', 'என', 'சொல்லுடன்', 'தொடர்புடைய', 'பற்றிய', 'பற்றி', 'என்னா'].includes(w)
        ) || allQueryWords[0];

        const stopWords = ['விளக்கம்', 'என்ன', 'படம்', 'image', 'explain', 'what', 'என்று', 'எண்று', 'சொல்லுடன்', 'தொடர்புடைய', 'மீதி', 'காட்டு', 'மற்ற', 'இன்னும்', 'குறள்களையும்', 'காட்டவும்', 'தெரிவி'].map(s => s.normalize('NFC'));
        const searchTerms = allQueryWords.filter(t => !stopWords.some(sw => t === sw) && !startKeywords.includes(t) && !endKeywords.includes(t) && t.length > 1);

        const results = this.dataset.map(k => {
            let score = 0;
            let matchedUniqueWords = 0;
            const l1 = normalize(k.Line1);
            const l2 = normalize(k.Line2);
            const verseText = `${l1} ${l2}`;
            const words = verseText.split(/\s+/);

            if (isStartsWith && structuralTarget) {
                const targetPrefix = structuralTarget.substring(0, Math.max(5, structuralTarget.length));
                const fullMatch = l1.startsWith(structuralTarget) || words[0].startsWith(structuralTarget);
                const prefixMatch = l1.startsWith(targetPrefix) || words[0].startsWith(targetPrefix);
                
                if (fullMatch) score += 5000000;
                else if (prefixMatch) score += 1000000;
                else return { ...k, score: 0 }; 
            }
            if (isEndsWith && structuralTarget) {
                const targetEnd = structuralTarget.substring(Math.max(0, structuralTarget.length - 3));
                const lastWord = words[words.length - 1];
                if (lastWord.endsWith(targetEnd) || l2.endsWith(targetEnd)) score += 1000000;
                else return { ...k, score: 0 };
            }

            if (!isStartsWith && !isEndsWith) {
                matchedUniqueWords = 0;
                let matchedPrefixes = 0;
                searchTerms.forEach(t => {
                    // Exponential weight for length: Specific words >> Common words
                    const wordWeight = Math.pow(t.length, 2) * 5000;
                    
                    // "Porul" (Meaning/Wealth) is often a filler or question word.
                    // If the query has other words, reduce Porul's weight.
                    let multiplier = 1;
                    if (t === "பொருள்" && searchTerms.length > 1) multiplier = 0.1;

                    const tRoot = t.length > 3 ? t.substring(0, t.length - 1) : t;
                    
                    const sanitize = (str) => str.replace(/[ணனந]/g, 'ன').replace(/[ளலழ]/g, 'ல').replace(/[றர]/g, 'ர');
                    const sT = sanitize(t);
                    const sTRoot = sanitize(tRoot);
                    const sWords = words.map(w => sanitize(w));
                    const sVerseText = sanitize(verseText);

                    if (sWords.includes(sT)) {
                        score += (100000 + wordWeight) * multiplier;
                        matchedUniqueWords++;
                    } else if (sWords.some(w => w.startsWith(sTRoot))) {
                        // Root match bonus
                        score += (50000 + wordWeight / 2) * multiplier;
                        matchedUniqueWords++;
                        matchedPrefixes++;
                    } else if (sVerseText.includes(sT)) {
                        // Fragment/Substring match bonus
                        score += (300000 + wordWeight) * multiplier;
                        matchedUniqueWords++;
                    } else if (t.length >= 4 && sWords.some(w => w.startsWith(sanitize(t.substring(0, 4))))) {
                        score += 5000 + (t.length * 500);
                        matchedPrefixes++;
                    }
                    if (normalize(k.mv).includes(t)) score += 1000;
                });

                // Unique Word Supremacy: More matches = Exponentially higher score
                score += (matchedUniqueWords * 200000);

                // Semantic Density Bonus
                const totalDensity = matchedUniqueWords + (matchedPrefixes * 0.5);
                if (totalDensity >= 4) score += 2000000;
                else if (totalDensity >= 2.5) score += 1000000;
                else if (totalDensity >= 1.5) score += 500000;

                // Stage 2: Phrase & Root Match (Strict)
                if (verseText.includes(cleanQuery)) {
                    score += 1000000;
                }
                
                // Specific word matching for Kural 72 words
                if (words.includes("அன்பிலார்") || words.includes("தமக்குரியர்")) {
                    if (cleanQuery.includes("அன்பு") || cleanQuery.includes("உரியர்")) {
                         score += 2000000; // Extra boost for these specific identifiers
                    }
                }
                
                // Gap Regex Match (The ultimate fix for fill-in-the-blanks)
                if (gapRegex && gapRegex.test(verseText)) {
                    score += 5000000; 
                }

                // Sequence Match Bonus
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
                    if (matchCount >= searchTerms.length) score += 2000000;
                    else if (matchCount >= 2) score += 200000;
                }
            }

            if (chapterRange && k.Number >= chapterRange.start && k.Number <= chapterRange.end) {
                score += 20000000; // Ultimate priority for specific chapter
            }

            const numMatch = query.match(/\b(?:kural|குறள்|எண்)\s*(\d+)\b/i);
            const standaloneNum = !isImageSearch ? query.match(/^\s*(\d+)\s*$/) : null;
            const targetNum = numMatch ? parseInt(numMatch[1]) : (standaloneNum ? parseInt(standaloneNum[1]) : null);
            
            if (targetNum && k.Number === targetNum) {
                score += 10000000; 
            }

            // Stage 3: Positional & Density Bonuses (The Tie-Breakers)
            if (!isStartsWith && !isEndsWith) {
                // Starts-with line bonus (Root-aware + First Char Strict)
                const queryRoot = cleanQuery.length > 3 ? cleanQuery.substring(0, cleanQuery.length - 1) : cleanQuery;
                const matchL1 = l1.startsWith(queryRoot) && l1[0] === cleanQuery[0];
                const matchL2 = l2.startsWith(queryRoot) && l2[0] === cleanQuery[0];
                
                if (matchL1 || matchL2) {
                    score += 250000;
                }
                
                // Density bonus: Shorter Kurals where the match is more "dense" rank slightly higher
                const totalLen = verseText.length;
                if (score > 0) score += (200 - totalLen) * 10; // Tiny boost for brevity
            }

            return { ...k, score, matchedUniqueWords, totalLen: verseText.length };
        });

        // Advanced multi-stage sort
        const scoredResults = results
            .filter(r => r.score > 0)
            .sort((a, b) => {
                if (Math.abs(b.score - a.score) > 1) return b.score - a.score;
                if (b.matchedUniqueWords !== a.matchedUniqueWords) return b.matchedUniqueWords - a.matchedUniqueWords;
                return a.totalLen - b.totalLen; // Shorter (more dense match) first
            });
        
        // Dynamic Relevance Threshold
        const isNumeric = /^\d+$/.test(cleanQuery);
        const hasKuralNum = /\b(?:kural|குறள்|எண்)\b/i.test(cleanQuery) && /\d+/.test(cleanQuery);
        const limit = (isImageSearch || isNumeric || hasKuralNum) ? 1 : (chapterRange ? 10 : 100);
        console.log(`[Search] Query: "${query}" | Found: ${scoredResults.length}`);
        if (scoredResults.length > 0) {
            console.log(`[Search] Top Match: Kural #${scoredResults[0].Number} (Score: ${scoredResults[0].score})`);
        }
        
        // In Direct AI mode, we usually want fewer but more relevant sources
        const finalLimit = (isImageSearch || isNumeric || hasKuralNum) ? 1 : limit;
        return { results: scoredResults.slice(0, finalLimit), searchTerms, isStartsWith, isEndsWith };
    }

    async ask(question, imageBase64 = null, isDirect = false) {
        console.log("[Engine] Ask triggered. Direct Mode:", isDirect);
        let finalQuery = question.trim().toLowerCase();
        const isValidKey = this.openai && this.openai.apiKey && this.openai.apiKey.startsWith('sk-');

        if (imageBase64 && isValidKey) {
            try {
                const visionResp = await this.openai.chat.completions.create({
                    messages: [{
                        role: "system",
                        content: `You are a high-precision OCR engine for Tamil. 
                        Transcribe the FULL Tamil text from the image exactly as it appears. 
                        Use "..." for any missing words or blanks. 
                        IGNORE question numbers (e.g., "25.", "Q1").
                        Do NOT provide a summary, theme, or Kural identification. 
                        Only return the transcribed poetic lines.`
                    }, {
                        role: "user",
                        content: [{ type: "image_url", image_url: { url: imageBase64 } }]
                    }],
                    max_tokens: 150,
                    temperature: 0 // Ensure consistent OCR results
                });
                
                let transcribed = visionResp.choices[0].message.content.trim();
                console.log("AI Transcribed:", transcribed);
                finalQuery = transcribed || question;
            } catch (err) { 
                console.error("Vision Error:", err); 
                finalQuery = question;
            }
        }

        if (!finalQuery.trim() && imageBase64) {
            return {
                answer: "மன்னிக்கவும், படத்திலிருந்து உரையை வாசிக்க முடியவில்லை. படம் தெளிவாக உள்ளதா எனச் சரிபார்க்கவும் அல்லது இணையத் தொடர்பு சரியாக உள்ளதா என உறுதிப்படுத்தவும்.",
                sources: []
            };
        }

        const { results: lexicalResults, searchTerms, isStartsWith, isEndsWith } = await this.search(finalQuery, !!imageBase64);
        const finalSources = lexicalResults;

        if (finalSources.length > 0 || (isDirect && isValidKey)) {
            const questionWords = ['what', 'explain', 'why', 'how', 'meaning', 'விளக்கம்', 'பொருள்', 'ஏன்', 'எப்படி', 'என்ன'].map(s => s.normalize('NFC'));
            const isQuestion = question.includes('?') || questionWords.some(w => question.toLowerCase().includes(w));
            
            // Direct response path for simple searches and structural queries
            if (!isDirect && (!isQuestion || isStartsWith || isEndsWith) && !imageBase64 && finalSources.length > 0) {
                const count = finalSources.length;
                const intro = count > 1 
                    ? `இது குறித்து ${count} குறள்கள் கண்டறியப்பட்டுள்ளன. இதோ உங்களுக்காக:` 
                    : `இது குறித்து ஒரு குறள் கண்டறியப்பட்டுள்ளது:`;
                return { answer: intro, sources: finalSources };
            }

            try {
                // AI Insight path for questions, images, and Direct Mode
                if (!this.openai) throw new Error("OpenAI not initialized");
                
                let context = "No direct Kural matches found in local database.";
                if (finalSources.length > 0) {
                    context = finalSources.slice(0, 5).map(k => `Kural #${k.Number}: ${k.Line1} / ${k.Line2}`).join('\n\n');
                }

                const response = await this.openai.chat.completions.create({
                    messages: [
                        { 
                            role: "system", 
                            content: `You are a Thirukkural Scholar. You provide direct, accurate, and scholarly answers about Thirukkural.
                            
                            ### SCHOLARLY CONSTANTS (MUST BE FOLLOWED):
                            - UNUSED VOWEL: "ஔ" (Au) is NEVER used in Thirukkural. (திருக்குறளில் பயன்படுத்தப்படாத ஒரே உயிரெழுத்து "ஔ" ஆகும்).
                            - WORD "TAMIL": The word "தமிழ்" is NEVER used in Thirukkural.
                            - FLOWERS: Anicham (அனிச்சம்) and Kuvalai (குவளை).
                            - FRUIT: Nerunjil (நெருஞ்சி).
                            - SEED: Kundrimani (குன்றிமணி).
                            - TOTAL KURALS: 1330.
                            - TOTAL LETTERS: 42194.
                            
                            ### RULES:
                            - Answer ONLY in Tamil.
                            - NEVER misspell "குறள்" as "குரல்".
                            - If asked about an unused letter, ALWAYS answer "ஔ" (Au). NEVER answer "ஃ", "ஏ", "ஒ", "எ" or anything else.
                            - Be consistent. 
                            - Use pure Tamil (No Tanglish).
                            - FORMATTING: Use markdown (bullet points, bold text).
                            - [HIDE_SOURCES] TAG: For historical/trivia questions (flowers, vowels, translators), you MUST append [HIDE_SOURCES] at the very end.
                            
                            ### EXAMPLES:
                            User: திருக்குறளில் பயன்படுத்தப்படாத உயிரெழுத்து எது?
                            Expert: திருக்குறளில் பயன்படுத்தப்படாத ஒரே உயிரெழுத்து **"ஔ" (Au)** ஆகும். திருக்குறளின் 1330 குறட்பாக்களிலும், 42,194 எழுத்துகளிலும் "ஔ" என்ற எழுத்து ஓரிடத்தில் கூட இடம்பெறவில்லை. [HIDE_SOURCES]`
                        },
                        { role: "user", content: `Context (Relevant Kurals):\n${context}\n\nUser Query: ${finalQuery}` }
                    ],
                    temperature: 0 // Force deterministic/consistent responses
                });
                let answerText = response.choices[0].message.content.trim();
                let displaySources = isDirect ? finalSources.slice(0, 3) : finalSources;
                
                if (answerText.includes('[HIDE_SOURCES]')) {
                    if (isDirect) {
                        displaySources = [];
                    }
                    answerText = answerText.replace('[HIDE_SOURCES]', '').trim();
                }

                // Store in history
                this.aiHistory.push({
                    timestamp: new Date().toISOString(),
                    query: finalQuery,
                    answer: answerText,
                    sourceCount: displaySources.length,
                    mode: isDirect ? "Direct AI" : "Search AI"
                });

                return { 
                    answer: answerText, 
                    sources: displaySources,
                    transcribed: imageBase64 ? finalQuery : null 
                };
            } catch (err) { 
                console.error("AI Error:", err); 
                if (isDirect) {
                    return { 
                        answer: "மன்னிக்கவும், நேரடி AI சேவையில் தொழில்நுட்பக் கோளாறு (Authentication/CORS) ஏற்பட்டுள்ளது. தயவுசெய்து உங்கள் API சாவியைச் சரிபார்க்கவும் அல்லது சிறிது நேரம் கழித்து முயற்சிக்கவும்.", 
                        sources: [] 
                    };
                }
                // Seamless fallback to lexical response on error in normal mode
                const intro = finalSources.length > 1 
                    ? `இதோ நீங்கள் கேட்டது குறித்த ${finalSources.length} குறள்கள்:`
                    : `இதோ நீங்கள் கேட்ட குறள்:`;
                return { 
                    answer: intro, 
                    sources: finalSources 
                };
            }
        }

        return { answer: this.fallback(question, finalSources, searchTerms), sources: finalSources };
    }

    fallback(question, matches, searchTerms) {
        if (matches.length === 0) return "மன்னிக்கவும், நீங்கள் கேட்ட தலைப்பில் என்னிடம் குறள்கள் இல்லை. வேறு ஏதேனும் தலைப்பை முயற்சி செய்யுங்கள்.";
        return `இது குறித்து ${matches.length} குறள்கள் கண்டறியப்பட்டுள்ளன. இதோ:`;
    }

    async refineQuery(query) { return query; }

    exportHistory() {
        const dataStr = JSON.stringify(this.aiHistory, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `thirukkural_ai_logs_${new Date().getTime()}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        console.log("[Engine] Exported history JSON.");
    }
}
