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
        
        // Words to ignore when picking the target search word
        const stopWords = [...endKeywords, ...startKeywords, 'என்ற', 'சொல்லுடன்', 'சொல்லும்', 'சொல்', 'வார்த்தை', 'kural', 'குறள்', 'with', 'word', 'the', 'என்பது', 'என்றார்'];
        
        // Target word if structural constraint exists
        let targetWord = '';
        if (isStructural) {
            // Find the most likely target word (longest word that isn't a stopword/command)
            targetWord = terms
                .filter(t => !stopWords.some(sw => t === sw || sw.includes(t)))
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
                    wealth: { range: [381, 1080], keywords: ['wealth', 'money', 'politics', 'porul', 'பொருள்', 'செல்வம்'] }
                };

                // Apply Thematic Boost if query matches a concept
                Object.values(themes).forEach(t => {
                    if (t.keywords.some(kw => cleanQuery.includes(kw))) {
                        if (k.Number >= t.range[0] && k.Number <= t.range[1]) {
                            score += 150; // Strong semantic boost
                        }
                    }
                });

                // Filter out common stop-words from the search terms for keyword matching
                const searchTerms = terms.filter(t => !stopWords.some(sw => t === sw || sw.includes(t)));

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
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
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
                const context = topMatches.map(k => 
                    `Verse #${k.Number}: ${k.Line1} ${k.Line2} 
Transliteration: ${k.transliteration1} ${k.transliteration2}
Mu. Varadarajan (Mu.Va): ${k.mv}
Kalaignar (Mu. Karunanidhi): ${k.mk}
Solomon Pappaiya: ${k.sp}
English Translation: ${k.Translation}
English Meaning: ${k.explanation}`
                ).join('\n\n');

                const systemPrompt = `You are "Thirukkural Expert", a scholarly AI assistant.
1. Strictly analyze the user's intent. If they ask for Kurals ending/starting with a word, prioritize those in your response.
2. Respond in the language of the user. Default to Tamil for scholarly analysis.
3. For translation requests, use the high-quality translations provided.
4. Format your output elegantly with verse and meaning.

Context Data:
${context}`;

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
        
        // For number searches, we provide a very minimal preview and rely on the source tag link
        const isNumberSearch = /^\d+$/.test(question.trim()) || question.toLowerCase().includes('kural');
        
        const result = matches.map(p => {
            if (isNumberSearch) {
                return `**குறள் #${p.Number}:**\n"${p.Line1}\n${p.Line2}"\n\n**பொருள்:** ${p.mv || p.explanation}`;
            } else {
                return `குறள் #${p.Number}:\n"${p.Line1}\n${p.Line2}"\n\nவிளக்கம்: ${p.mv || p.explanation}`;
            }
        }).join('\n\n---\n\n');

        return `நிபுணர் ஆய்வு / Scholarly Analysis:\n\n${result}`;
    }
}
