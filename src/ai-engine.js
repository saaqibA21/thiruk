/**
 * THIRUKKURAL NEURAL CORE v4.0 (INSTANT LOAD + SCHOLARLY FALLBACK)
 * Optimized for millisecond loading by using high-speed lexical search.
 * GPT-4o-mini is used for deep reasoning when a valid key is provided.
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
        // Instantaneous ready state
        if (window.onNeuralProgress) window.onNeuralProgress(100);
    }

    // High-speed Lexical Search (Keyword + Structural + Tanglish)
    async search(query, skipRefine = false) {
        // First, refine the query to ensure meaningful sentence formation (Tamil grammar)
        const refinedQuery = skipRefine ? query : await this.refineQuery(query);
        const cleanQuery = refinedQuery.toLowerCase().trim().normalize('NFC');
        const terms = cleanQuery.split(/\s+/).filter(t => t.length >= 1);
        
        // Detection for structural constraints (Tamil + Tanglish + English)
        const endKeywords = ['முடியும்', 'mudiyum', 'ending', 'nding', 'முடிவு', 'ஈறு', 'கடைசி', 'ends with', 'குறள்ந்திங்', 'end', 'முடிகின்ற', 'முடிகிறது', 'முடிவடைகிறது', 'முடிவது', 'முடிவில்', 'முடிவுற்ற', 'முடிவடைய'].map(s => s.normalize('NFC'));
        const startKeywords = ['தொடங்கும்', 'thodangum', 'starting', 'staring', 'starig', 'start', 'தொடக்கம்', 'ஆரம்பம்', 'முதல்', 'starts with', 'thodakkam', 'தொடங்குகிறது', 'தொடங்குகின்ற', 'துவக்கம்', 'துவங்கும்', 'தொடங்கிய', 'ஆரம்பமாகும்', 'துடக்கம்', 'துடங்கும்', 'துடுங்கும்', 'துவங்க'].map(s => s.normalize('NFC'));
        
        const isEndsWithQuery = endKeywords.some(kw => cleanQuery.includes(kw));
        const isStartsWithQuery = startKeywords.some(kw => cleanQuery.includes(kw));
        const isStructuralQuery = isEndsWithQuery || isStartsWithQuery;
        
        // Words to ignore when picking the target search word or doing lexical matches
        const stopWords = [
            ...endKeywords, ...startKeywords, 
            'என்ற', 'சொல்லுடன்', 'சொல்லும்', 'சொல்', 'வார்த்தை', 'kural', 'kurals', 'குறள்', 'குறள்கள்', 
            'with', 'word', 'the', 'என்பது', 'என்றார்', 'எனக்கு', 'கொடு', 'வேண்டும்', 'கூறு', 'பற்றி', 
            'என', 'என்று', 'எண்று', 'ஆன', 'ஆக', 'எனும்', 'உடன்', 'ஆகிய', 'கொண்ட',
            'இந்த', 'என்ன', 'எப்படி', 'எங்கே', 'ஏன்', 'எது', 'எவை', 'யார்', 'யாருடைய', 'விளக்கம்', 'படம்', 'படத்தின்',
            'about', 'give', 'me', 'tell', 'show', 'for', 'of', 'in', 'on', 'to', 'a', 'an', 'some', 'what', 'why', 'how', 'where', 'which', 'who', 'image', 'picture', 'explanation'
        ].map(s => s.normalize('NFC'));
        
        // Identification of potential search targets (words that aren't commands/stopwords)
        const searchTerms = terms
            .map(t => t.replace(/[.,!?;:"\-_…·]/g, '').normalize('NFC'))
            .filter(t => t.length >= 1 && !stopWords.some(sw => t === sw));

        let startMatchCount = 0;
        let endMatchCount = 0;

        const results = this.dataset.map(k => {
            let score = 0;
            let hasStructuralMatch = false;
            let hasExactWordMatch = false;
            let currentIsStart = false;
            let currentIsEnd = false;

            const l1 = k.Line1.toLowerCase().normalize('NFC');
            const l2 = k.Line2.toLowerCase().normalize('NFC');
            const cleanL1 = l1.replace(/[.,!?;:"\-_…·]/g, '');
            const cleanL2 = l2.replace(/[.,!?;:"\-_…·]/g, '');
            
            const wordsL1 = cleanL1.trim().split(/\s+/);
            const wordsL2 = cleanL2.trim().split(/\s+/);

            const tamilContent = `${k.Line1} ${k.Line2} ${k.mv || ''} ${k.sp || ''} ${k.mk || ''} ${k.explanation || ''}`.toLowerCase().normalize('NFC');
            const englishContent = `${k.Translation || ''} ${k.explanation || ''} ${k.couplet || ''}`.toLowerCase().normalize('NFC');
            const tanglishContent = `${k.transliteration1 || ''} ${k.transliteration2 || ''}`.toLowerCase().normalize('NFC');
            const fullContent = `${tamilContent} ${englishContent} ${tanglishContent}`;

            // --- 1. Structural Match Logic ---
            if (searchTerms.length > 0) {
                searchTerms.forEach(targetWord => {
                    const firstWord = wordsL1[0] || "";
                    const lastWord = wordsL2[wordsL2.length - 1] || "";

                    const isStart = (firstWord === targetWord || cleanL1.startsWith(targetWord));
                    const isEnd = (lastWord === targetWord || cleanL2.endsWith(targetWord));

                    if (isStart) {
                        currentIsStart = true;
                        startMatchCount++;
                        if (isStartsWithQuery) { 
                            score += 2000; 
                            hasStructuralMatch = true; 
                        } else {
                            score += 500; // Natural boost if it starts even if not asked
                        }
                    }

                    if (isEnd) {
                        currentIsEnd = true;
                        endMatchCount++;
                        if (isEndsWithQuery) { 
                            score += 2000; 
                            hasStructuralMatch = true; 
                        } else {
                            score += 500; // Natural boost if it ends even if not asked
                        }
                    }
                });
            }

            // --- 2. Phrase & Keyword Matching ---
            if (cleanQuery.length > 3 && fullContent.includes(cleanQuery)) {
                score += 500;
            }

            searchTerms.forEach(t => {
                const escapedT = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const pattern = `(^|[\\s.,!?;:"])${escapedT}([\\s.,!?;:"]|்|ை|்|$)`;
                const regex = new RegExp(pattern, 'u');
                
                if (regex.test(fullContent)) {
                    score += 50;
                    hasExactWordMatch = true;
                    if (regex.test(l1 + " " + l2)) {
                        score += 200;
                        if (l1.includes(t) || l2.includes(t)) score += 100;
                    }
                } else if (fullContent.includes(t)) {
                    score += 5;
                }
            });

            // --- 3. Thematic Concepts ---
            const themedBoost = this.checkThemes(cleanQuery, k, fullContent);
            score += themedBoost;

            // --- 4. Logic Fix: Context-Aware Filtering ---
            if (isStructuralQuery && !hasStructuralMatch) {
                if (!hasExactWordMatch) score = 0;
                else score = score * 0.1; 
            }

            // --- 5. Strict Number Match ---
            const numberMatch = cleanQuery.match(/\b(\d+)\b/);
            if (numberMatch) {
                const searchNum = parseInt(numberMatch[1]);
                if (k.Number === searchNum) score += 10000;
            }

            return { ...k, score, isStructuralMatch: hasStructuralMatch, isWordMatch: hasExactWordMatch, isAtStart: currentIsStart, isAtEnd: currentIsEnd };
        })
        .filter(k => k.score > 10) 
        .sort((a, b) => b.score - a.score);

        return { 
            results, 
            searchTerms, 
            metadata: { 
                isStructuralQuery, 
                isStartsWithQuery, 
                isEndsWithQuery,
                startMatchCount,
                endMatchCount
            } 
        };
    }

    checkThemes(query, k, fullContent) {
        let boost = 0;
        const themes = {
            love: { range: [1081, 1330], keywords: ['love', 'passion', 'desire', 'kaadhal', 'inbam', 'காதல்', 'இன்பம்', 'காமத்துப்பால்', 'அன்பு'] },
            friendship: { range: [781, 830], keywords: ['friend', 'friendship', 'natpu', 'thozha', 'நட்பு', 'தோழமை'] },
            education: { range: [391, 430], keywords: ['education', 'learning', 'knowledge', 'kalvi', 'கல்வி', 'அறிவு', 'கல்விக்'] },
            rain: { range: [11, 20], keywords: ['rain', 'nature', 'vaan', 'வான்', 'மழை', 'பெய்யென'] },
            anger: { range: [301, 310], keywords: ['anger', 'vegula', 'கோபம்', 'வெகுளாமை'] },
            virtue: { range: [1, 380], keywords: ['virtue', 'aram', 'dharma', 'அறம்', 'அறத்துப்பால்'] },
            wealth: { range: [381, 1080], keywords: ['wealth', 'money', 'politics', 'porul', 'பொருள்', 'செல்வம்', 'பொருட்பால்'] },
            children: { range: [61, 70], keywords: ['son', 'sons', 'children', 'kids', 'father', 'makkal', 'pillai', 'புதல்வர்', 'மக்கள்', 'குழந்தை', 'பிள்ளை'] }
        };

        Object.values(themes).forEach(t => {
            const hasThemeKeyword = t.keywords.some(kw => query.includes(kw));
            if (hasThemeKeyword) {
                if (k.Number >= t.range[0] && k.Number <= t.range[1]) boost += 150;
                t.keywords.forEach(kw => { if (fullContent.includes(kw)) boost += 10; });
            }
        });
        return boost;
    }

    async semanticSearch(query) {
        const { results } = await this.search(query);
        return results;
    }

    async ask(question, imageBase64 = null) {
        let query = question.trim().toLowerCase();
        const isValidKey = this.openai && this.openai.apiKey && this.openai.apiKey.startsWith('sk-');

        // Step 1: Intelligent Image-to-Keyword mapping if image is present
        if (imageBase64 && isValidKey) {
            try {
                const visionResponse = await this.openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content: "You are a Thirukkural expert. Analyze the image. 1. If the image contains Tamil text (especially Thirukkural verses), transcribe the text exactly. 2. Identify 3-5 high-relevance Tamil keywords or themes. Output only the transcribed text and keywords separated by spaces. Avoid numbering or labels."
                        },
                        {
                            role: "user",
                            content: [
                                { type: "text", text: "Transcribe any Tamil text and identify themes in this image." },
                                { type: "image_url", image_url: { url: imageBase64 } }
                            ]
                        }
                    ],
                    max_tokens: 300
                });
                const extractedKeywords = visionResponse.choices[0].message.content.trim();
                console.log("Image Keywords Extracted:", extractedKeywords);
                // Combine original query with vision-extracted keywords for better retrieval
                query = `${query} ${extractedKeywords}`;
            } catch (err) {
                console.error("Vision Keyword Extraction Error:", err);
            }
        }

        // Step 2: Use search engine (skip refinement if we have vision-derived keywords to avoid losing precision)
        const searchResult = await this.search(query, !!imageBase64);
        const topMatches = searchResult.results || [];
        const searchTerms = searchResult.searchTerms || [];
        const metadata = searchResult.metadata || {};

        const isNumberOnly = /^\d+$/.test(query) || (topMatches.length === 1 && query.includes(topMatches[0].Number.toString()));

        if (isValidKey && !isNumberOnly) {
            try {
                const llmContext = topMatches.slice(0, 20).map(k => 
                    `Verse #${k.Number}: ${k.Line1} ${k.Line2} 
Meaning: ${k.explanation}
Tamil Meanings: MV: ${k.mv || ''}, MK: ${k.mk || ''}, SP: ${k.sp || ''}
English: ${k.Translation}`
                ).join('\n\n');

                const systemPrompt = `You are "Thirukkural Expert AI". 
CRITICAL RULE: USE ONLY THE PROVIDED THIRUKKURAL DATA BELOW TO ANSWER. DO NOT USE EXTERNAL KNOWLEDGE OR OTHER VERSES.
If the answer is not in the provided context, politely say that you can only answer based on Thirukkural.

The user is asking a question ${imageBase64 ? 'about an image they uploaded' : ''}.
I have found ${topMatches.length} related kurals from our database.

Context Data (Our Only Source):
${llmContext}

Instructions:
1. Analyze the user's query ${imageBase64 ? 'and the image' : ''}.
2. Find the most relevant Kurals from the Context Data.
3. Provide a scholarly answer in the language of the user (Tamil/English).
4. If an image is provided, identify any themes, objects, or situations in it and relate them to specific Kurals in the Context.
5. Be precise and quote the Verse Number and text.`;

                const messages = [
                    { role: "system", content: systemPrompt }
                ];

                const userContent = [{ type: "text", text: question }];
                
                if (imageBase64) {
                    userContent.push({
                        type: "image_url",
                        image_url: {
                            url: imageBase64 // Expecting data:image/jpeg;base64,...
                        }
                    });
                }

                messages.push({ role: "user", content: userContent });

                const response = await this.openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: messages,
                    temperature: 0.1
                });

                return { answer: response.choices[0].message.content, sources: topMatches };

            } catch (err) {
                console.error("AI Error:", err);
                return { answer: this.fallback(question, topMatches, searchTerms, metadata), sources: topMatches };
            }
        } else {
            return { answer: this.fallback(question, topMatches, searchTerms, metadata), sources: topMatches };
        }
    }

    fallback(question, matches, searchTerms = [], metadata = {}) {
        if (matches.length === 0) return "மன்னிக்கவும், இது குறித்த குறள்கள் கிடைக்கவில்லை. / Sorry, no matching Kurals were found.";
        
        const count = matches.length;
        const target = (searchTerms && searchTerms.length > 0) ? searchTerms.join(', ') : question;

        if (/^\d+$/.test(question.trim())) {
           return `குறள் எண் ${matches[0].Number} கண்டறியப்பட்டது. முழு விவரங்களுக்குக் கீழே உள்ள கார்டைச் சொடுக்கவும்:`;
        }

        // Structural Case: User asked for start/end
        if (metadata.isStructuralQuery) {
            const hasRequestedMatch = (metadata.isStartsWithQuery && metadata.startMatchCount > 0) || 
                                      (metadata.isEndsWithQuery && metadata.endMatchCount > 0);

            if (hasRequestedMatch) {
                return `நிச்சயமாக, உங்கள் தேடலுக்குத் துல்லியமாகப் பொருந்தும் ${count} குறள்கள் இதோ:`;
            } else {
                let msg = `மன்னிக்கவும், நீங்கள் குறிப்பிட்டபடி ${metadata.isStartsWithQuery ? 'தொங்கும்' : 'முடியும்'} குறள் எதுவும் இல்லை. `;
                if (metadata.startMatchCount > 0 || metadata.endMatchCount > 0) {
                    msg += `ஆனால் "${target}" என்ற சொல்லைக் கொண்ட ${count} குறள்கள் இதோ (இதில் ${metadata.startMatchCount} தொடக்கத்திலும், ${metadata.endMatchCount} இறுதியிலும் வரும் குறள்கள் அடங்கும்):`;
                } else {
                    msg += `ஆனால் அந்தச் சொல்லைக் கொண்ட ${count} குறள்கள் இதோ:`;
                }
                return msg;
            }
        }

        // Generic Case: User just typed a word
        let genericMsg = `"${target}" என்ற சொல்லைக் கொண்ட ${count} குறள்கள் கண்டறியப்பட்டுள்ளன. `;
        if (metadata.startMatchCount > 0 || metadata.endMatchCount > 0) {
            genericMsg += `(இதில் ${metadata.startMatchCount} ஒரு வரியின் தொடக்கத்திலும், ${metadata.endMatchCount} வரியின் இறுதியிலும் அமைகின்றன.)`;
        }
        return genericMsg + "\n\nவிவரங்களைக் கீழே காணலாம்:";
    }


    async refineQuery(query) {
        if (!this.openai || !query || query.length < 3 || /^\d+$/.test(query.trim())) return query;
        
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { 
                        role: "system", 
                        content: "You are a Tamil grammar expert. The user is providing a search query for a Thirukkural database. It might be in English, broken Tamil, or a mix. Transform it into one grammatically correct, natural, and meaningful Tamil sentence or phrase. Output only the corrected Tamil text." 
                    },
                    { role: "user", content: query }
                ],
                temperature: 0,
                max_tokens: 100
            });
            const result = response.choices[0].message.content.trim();
            console.log("Refined Query:", query, "=>", result);
            return result;
        } catch (e) {
            return query;
        }
    }
}
