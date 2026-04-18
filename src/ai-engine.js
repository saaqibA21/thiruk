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
        const cleanQuery = query.toLowerCase().trim().normalize('NFC');
        const terms = cleanQuery.split(/\s+/).filter(t => t.length > 1);
        
        // Detection for structural constraints (Tamil + Tanglish + English)
        const endKeywords = ['முடியும்', 'mudiyum', 'ending', 'nding', 'முடிவு', 'ஈறு', 'கடைசி', 'ends with', 'குறள்ந்திங்', 'end', 'முடிகின்ற', 'முடிகிறது'].map(s => s.normalize('NFC'));
        const startKeywords = ['தொடங்கும்', 'thodangum', 'starting', 'staring', 'starig', 'start', 'தொடக்கம்', 'ஆரம்பம்', 'முதல்', 'starts with', 'thodakkam', 'தொடங்குகிறது', 'தொடங்குகின்ற'].map(s => s.normalize('NFC'));
        
        const isEndsWith = endKeywords.some(kw => cleanQuery.includes(kw));
        const isStartsWith = startKeywords.some(kw => cleanQuery.includes(kw));
        const isStructural = isEndsWith || isStartsWith;
        
        // Words to ignore when picking the target search word or doing lexical matches
        const stopWords = [
            ...endKeywords, ...startKeywords, 
            'என்ற', 'சொல்லுடன்', 'சொல்லும்', 'சொல்', 'வார்த்தை', 'kural', 'kurals', 'குறள்', 'குறள்கள்', 
            'with', 'word', 'the', 'என்பது', 'என்றார்', 'எனக்கு', 'கொடு', 'வேண்டும்', 'கூறு', 'பற்றி', 
            'என', 'என்று', 'ஆன', 'ஆக', 'எனும்',
            'about', 'give', 'me', 'tell', 'show', 'for', 'of', 'in', 'on', 'to', 'a', 'an', 'some'
        ].map(s => s.normalize('NFC'));
        
        // Identification of potential search targets (words that aren't commands/stopwords)
        const searchTerms = terms
            .map(t => t.replace(/[.,!?;:]/g, '').normalize('NFC'))
            .filter(t => t.length > 1 && !stopWords.some(sw => t === sw));

        return this.dataset
            .map(k => {
                let score = 0;
                let hasStructuralMatch = false;

                const tamilContent = `${k.Line1} ${k.Line2} ${k.mv || ''} ${k.sp || ''} ${k.mk || ''} ${k.explanation || ''}`.toLowerCase().normalize('NFC');
                const englishContent = `${k.Translation || ''} ${k.explanation || ''} ${k.couplet || ''}`.toLowerCase().normalize('NFC');
                const tanglishContent = `${k.transliteration1 || ''} ${k.transliteration2 || ''}`.toLowerCase().normalize('NFC');
                
                const fullContent = `${tamilContent} ${englishContent} ${tanglishContent}`;

                // --- 1. Structural Match Logic ---
                if (isStructural && searchTerms.length > 0) {
                    const l1 = k.Line1.toLowerCase().normalize('NFC');
                    const l2 = k.Line2.toLowerCase().normalize('NFC');
                    const cleanL1 = l1.replace(/[.,!?;:]/g, '');
                    const cleanL2 = l2.replace(/[.,!?;:]/g, '');
                    
                    const wordsL1 = cleanL1.trim().split(/\s+/);
                    const wordsL2 = cleanL2.trim().split(/\s+/);

                    searchTerms.forEach(targetWord => {
                        if (isEndsWith) {
                            if (wordsL2[wordsL2.length - 1] === targetWord) {
                                score += 800; // Exact word match at end
                                hasStructuralMatch = true;
                            } else if (cleanL2.endsWith(targetWord)) {
                                score += 400; // Substring match at end
                                hasStructuralMatch = true;
                            }
                        }
                        
                        if (isStartsWith) {
                            if (wordsL1[0] === targetWord) {
                                score += 800; // Exact word match at start
                                hasStructuralMatch = true;
                            } else if (cleanL1.startsWith(targetWord)) {
                                score += 400; // Substring match at start
                                hasStructuralMatch = true;
                            }
                        }
                    });
                }

                // --- 2. Phrase & Keyword Matching ---
                // Higher score for exact phrase match
                if (cleanQuery.length > 3 && fullContent.includes(cleanQuery)) {
                    score += 100;
                }

                // Individual keyword matches
                searchTerms.forEach(t => {
                    if (fullContent.includes(t)) {
                        score += 5; // Base inclusion
                        
                        // Word boundary boost
                        const wordBoundaryRegex = new RegExp(`(^|\\s)${t}(\\s|$)`, 'u');
                        if (wordBoundaryRegex.test(fullContent)) score += 30;
                        
                        // Core verse boost
                        if (k.Line1.toLowerCase().includes(t) || k.Line2.toLowerCase().includes(t)) {
                           score += 50;
                           // Exact word in verse boost
                           if (wordBoundaryRegex.test(k.Line1.toLowerCase() + " " + k.Line2.toLowerCase())) {
                               score += 100;
                           }
                        }
                    }
                });

                // --- 3. Thematic Concepts ---
                const themes = {
                    love: { range: [1081, 1330], keywords: ['love', 'passion', 'desire', 'kaadhal', 'inbam', 'காதல்', 'இன்பம்', 'காமத்துப்பால்'] },
                    friendship: { range: [781, 830], keywords: ['friend', 'friendship', 'natpu', 'thozha', 'நட்பு', 'தோழமை'] },
                    education: { range: [391, 430], keywords: ['education', 'learning', 'knowledge', 'kalvi', 'கல்வி', 'அறிவு', 'கல்விக்'] },
                    rain: { range: [11, 20], keywords: ['rain', 'nature', 'vaan', 'வான்', 'மழை', 'பெய்யென'] },
                    anger: { range: [301, 310], keywords: ['anger', 'vegula', 'கோபம்', 'வெகுளாமை'] },
                    virtue: { range: [1, 380], keywords: ['virtue', 'aram', 'dharma', 'அறம்', 'அறத்துப்பால்'] },
                    wealth: { range: [381, 1080], keywords: ['wealth', 'money', 'politics', 'porul', 'பொருள்', 'செல்வம்', 'பொருட்பால்'] },
                    children: { range: [61, 70], keywords: ['son', 'sons', 'children', 'kids', 'father', 'makkal', 'pillai', 'புதல்வர்', 'மக்கள்', 'குழந்தை', 'பிள்ளை'] }
                };

                Object.values(themes).forEach(t => {
                    const hasThemeKeyword = t.keywords.some(kw => cleanQuery.includes(kw));
                    if (hasThemeKeyword) {
                        if (k.Number >= t.range[0] && k.Number <= t.range[1]) score += 150;
                        t.keywords.forEach(kw => { if (fullContent.includes(kw)) score += 10; });
                    }
                });

                // --- 4. Logic Fix: No Strict Rejection ---
                // If it was structural but didn't match the position, it still lives via keyword score above.
                if (isStructural && !hasStructuralMatch) {
                    score = score * 0.2; 
                }

                // --- 5. Strict Number Match ---
                const numberMatch = cleanQuery.match(/\b(\d+)\b/);
                if (numberMatch) {
                    const searchNum = parseInt(numberMatch[1]);
                    if (k.Number === searchNum) score += 5000;
                    else if (!isStructural && searchTerms.length === 0) score = 0; 
                }

                return { ...k, score };
            })
            .filter(k => k.score > 3) 
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
