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
    async search(query) {
        const cleanQuery = query.toLowerCase().trim();
        const terms = cleanQuery.split(/\s+/).filter(t => t.length > 1);
        
        // Detection for structural constraints (Tamil + Tanglish + English)
        const endKeywords = ['முடியும்', 'mudiyum', 'ending', 'nding', 'முடிவு', 'ஈறு', 'கடைசி', 'ends with', 'குறள்ந்திங்', 'end'];
        const startKeywords = ['தொடங்கும்', 'thodangum', 'starting', 'staring', 'starig', 'start', 'தொடக்கம்', 'ஆரம்பம்', 'முதல்', 'starts with', 'thodakkam'];
        
        const isEndsWith = endKeywords.some(kw => cleanQuery.includes(kw));
        const isStartsWith = startKeywords.some(kw => cleanQuery.includes(kw));
        const isStructural = isEndsWith || isStartsWith;
        
        // Words to ignore when picking the target search word or doing lexical matches
        const stopWords = [
            ...endKeywords, ...startKeywords, 
            'என்ற', 'சொல்லுடன்', 'சொல்லும்', 'சொல்', 'வார்த்தை', 'kural', 'kurals', 'குறள்', 'குறள்கள்', 
            'with', 'word', 'the', 'என்பது', 'என்றார்', 'எனக்கு', 'கொடு', 'வேண்டும்', 'கூறு', 'பற்றி', 
            'about', 'give', 'me', 'tell', 'show', 'for', 'of', 'in', 'on', 'to', 'a', 'an', 'some'
        ];
        
        // Target word if structural constraint exists
        let targetWord = '';
        if (isStructural) {
            // Find the most likely target word (longest word that isn't a stopword/command)
            targetWord = terms
                .filter(t => !stopWords.some(sw => t === sw))
                .sort((a, b) => b.length - a.length)[0] || '';
        }

        return this.dataset
            .map(k => {
                let score = 0;
                let hasStructuralMatch = false;

                const tamilContent = `${k.Line1} ${k.Line2} ${k.mv || ''} ${k.sp || ''} ${k.mk || ''} ${k.explanation || ''}`.toLowerCase();
                const englishContent = `${k.Translation || ''} ${k.explanation || ''} ${k.couplet || ''}`.toLowerCase();
                const tanglishContent = `${k.transliteration1 || ''} ${k.transliteration2 || ''}`.toLowerCase();
                
                const fullContent = `${tamilContent} ${englishContent} ${tanglishContent}`;

                // Structural match priority
                if (targetWord) {
                    const l1 = k.Line1.toLowerCase();
                    const l2 = k.Line2.toLowerCase();
                    const t1 = (k.transliteration1 || '').toLowerCase();
                    const t2 = (k.transliteration2 || '').toLowerCase();

                    // Clean punctuation
                    const cleanL1 = l1.replace(/[.,!?;:]/g, '');
                    const cleanL2 = l2.replace(/[.,!?;:]/g, '');
                    const cleanT1 = t1.replace(/[.,!?;:]/g, '');
                    const cleanT2 = t2.replace(/[.,!?;:]/g, '');

                    // Precise word-boundary check
                    const wordsL1 = cleanL1.trim().split(/\s+/);
                    const wordsL2 = cleanL2.trim().split(/\s+/);
                    const wordsT1 = cleanT1.trim().split(/\s+/);
                    const wordsT2 = cleanT2.trim().split(/\s+/);

                    if (isEndsWith) {
                        const lastWordL2 = wordsL2[wordsL2.length - 1];
                        const lastWordT2 = wordsT2[wordsT2.length - 1];
                        
                        if (lastWordL2 === targetWord || lastWordT2 === targetWord) {
                            score += 500;
                            hasStructuralMatch = true;
                        } else if (cleanL2.endsWith(targetWord) || cleanT2.endsWith(targetWord)) {
                            score += 200;
                            hasStructuralMatch = true;
                        }
                    }
                    
                    if (isStartsWith) {
                        const firstWordL1 = wordsL1[0];
                        const firstWordT1 = wordsT1[0];
                        
                        if (firstWordL1 === targetWord || firstWordT1 === targetWord) {
                            score += 500;
                            hasStructuralMatch = true;
                        } else if (cleanL1.startsWith(targetWord) || cleanT1.startsWith(targetWord)) {
                            score += 200;
                            hasStructuralMatch = true;
                        }
                    }
                }

                // Concept/Theme Mapping for Semantic Boosting
                const themes = {
                    love: { range: [1081, 1330], keywords: ['love', 'passion', 'desire', 'kaadhal', 'inbam', 'காதல்', 'இன்பம்'] },
                    friendship: { range: [781, 830], keywords: ['friend', 'friendship', 'natpu', 'thozha', 'நட்பு', 'தோழமை'] },
                    education: { range: [391, 430], keywords: ['education', 'learning', 'knowledge', 'kalvi', 'கல்வி', 'அறிவு'] },
                    rain: { range: [11, 20], keywords: ['rain', 'nature', 'vaan', 'வான்', 'மழை'] },
                    anger: { range: [301, 310], keywords: ['anger', 'vegula', 'கோபம்', 'வெகுளாமை'] },
                    virtue: { range: [1, 380], keywords: ['virtue', 'aram', 'dharma', 'அறம்'] },
                    wealth: { range: [381, 1080], keywords: ['wealth', 'money', 'politics', 'porul', 'பொருள்', 'செல்வம்'] },
                    pride: { range: [971, 980], keywords: ['pride', 'greatness', 'conceit', 'humility', 'perumai', 'sirumai', 'பெருமை', 'சிறுமை'] },
                    medicine: { range: [941, 950], keywords: ['sick', 'health', 'medicine', 'disease', 'illness', 'treatment', 'marundhu', 'nooi', 'நோய்', 'மருந்து', 'உடல்நலம்'] },
                    poverty: { range: [1041, 1050], keywords: ['poverty', 'poor', 'varumai', 'ezhmai', 'வறுமை', 'ஏழ்மை'] },
                    children: { range: [61, 70], keywords: ['son', 'sons', 'children', 'kids', 'father', 'makkal', 'pillai', 'புதல்வர்', 'மக்கள்', 'குழந்தை', 'பிள்ளை', 'புதல்வரை'] },
                    loan: { range: [1, 1330], keywords: ['loan', 'debt', 'borrow', 'kadan', 'கடன்', 'வாங்குதல்'] },
                    savings: { range: [751, 760], keywords: ['savings', 'save', 'accumulation', 'accumulation of wealth', 'semippu', 'சேமிப்பு', 'பொருள் செயல்வகை', 'ஈட்டல்'] },
                    duty: { range: [211, 220], keywords: ['duty', 'obligation', 'kadan', 'kadamai', 'கடன்', 'கடமை'] },
                    flowers: { range: [1111, 1120], keywords: ['flower', 'flowers', 'malar', 'poo', 'பூ', 'மலர்', 'அனிச்சம்'] }
                };

                // Apply Thematic Boost if query matches a concept
                Object.values(themes).forEach(t => {
                    const hasThemeKeyword = t.keywords.some(kw => cleanQuery.includes(kw));
                    if (hasThemeKeyword) {
                        if (k.Number >= t.range[0] && k.Number <= t.range[1]) {
                            score += 150; // Strong semantic boost
                        }
                        // Secondary keyword boost for specific thematic matches even outside range
                        t.keywords.forEach(kw => {
                            if (fullContent.includes(kw)) score += 30;
                        });
                    }
                });

                // Filter out common stop-words from the search terms for keyword matching
                const searchTerms = terms.filter(t => !stopWords.some(sw => t === sw));

                // If a structural match was requested but not found for this kural, 
                // we treat it as very low relevance unless it's a number match
                if (isStructural && !hasStructuralMatch) {
                    score = 0; 
                }

                // Keyword matches (only if not already rejected by structural filter)
                if (!isStructural || hasStructuralMatch) {
                    const targetTerms = searchTerms.length > 0 ? searchTerms : terms;
                    targetTerms.forEach(t => {
                        if (fullContent.includes(t)) {
                            score += 2;
                            const tamilWordRegex = new RegExp(`(^|\\s)${t}(\\s|$)`, 'u');
                            if (tamilWordRegex.test(fullContent)) score += 15;
                            if (k.Line1.toLowerCase().includes(t) || k.Line2.toLowerCase().includes(t)) score += 20;
                        }
                    });
                }

                // Strict Number Match (Isolation Mode)
                const numberMatch = cleanQuery.match(/\b(\d+)\b/);
                if (numberMatch) {
                    const searchNum = parseInt(numberMatch[1]);
                    if (k.Number === searchNum) {
                        score += 5000; // Massive boost to isolate the kural
                    } else if (isStructural || searchTerms.length > 0) {
                        // If they searched "Kural 43 love", we still want love kurals
                        // but if they just searched "43", we isolate.
                    } else {
                        score = 0; // Reject others if only a number was provided
                    }
                }

                return { ...k, score };
            })
            .filter(k => k.score > 2) 
            .sort((a, b) => b.score - a.score);
    }

    async semanticSearch(query) {
        return this.search(query);
    }

    async ask(question) {
        const query = question.trim().toLowerCase();
        const topMatches = await this.search(query);
        const isNumberOnly = /^\d+$/.test(query) || (topMatches.length === 1 && query.includes(topMatches[0].Number.toString()));

        // Security: Only call OpenAI if key is valid sk- format
        const isValidKey = this.openai && this.openai.apiKey && this.openai.apiKey.startsWith('sk-');

        if (isValidKey && !isNumberOnly) {
            try {
                // Return top 15 in the prompt context but keeping full sources list in response
                const llmContext = topMatches.slice(0, 15).map(k => 
                    `Verse #${k.Number}: ${k.Line1} ${k.Line2} 
Meaning: ${k.explanation}
English: ${k.Translation}`
                ).join('\n\n');

                const systemPrompt = `You are "Thirukkural Expert". 
The user is asking for verses related to a topic. I have found ${topMatches.length} related kurals.
1. Provide a scholarly summary of the most important verses.
2. DO NOT list every single verse in this text response if there are more than 10. Instead, summarize the key themes and tell the user they can see the full list of ${topMatches.length} verses in the cards below.
3. If they ask for "all", mention they can scroll through all ${topMatches.length} results in the source section.
4. Respond in the language of the user (Tamil/English).

Context Data (Top 15):
${llmContext}`;

                const response = await this.openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: question }
                    ],
                    temperature: 0.1
                });

                const answer = response.choices[0].message.content;
                return { answer, sources: topMatches };

            } catch (err) {
                if (err.status !== 401) console.error("Neural Reasoning Error:", err);
                return { answer: this.fallback(question, topMatches), sources: topMatches };
            }
        } else {
            return { answer: this.fallback(question, topMatches), sources: topMatches };
        }
    }

    fallback(question, matches) {
        if (matches.length === 0) return "மன்னிக்கவும், இது குறித்த குறள்கள் கிடைக்கவில்லை. / Sorry, no matching Kurals were found.";
        
        const isNumberSearch = /^\d+$/.test(question.trim());
        const count = matches.length;

        if (isNumberSearch) {
           return `குறள் எண் ${matches[0].Number} கண்டறியப்பட்டது. முழு விவரங்களுக்குக் கீழே உள்ள கார்டைச் சொடுக்கவும்:`;
        }

        return `உங்கள் தேடலுக்குத் தொடர்புடைய ${count} குறள்கள் கண்டறியப்பட்டுள்ளன. அவற்றை கீழே உள்ள கார்டுகளில் விரிவாகக் காணலாம்:`;
    }
}
