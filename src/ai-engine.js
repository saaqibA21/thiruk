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
        
        // Detection for structural constraints
        const isEndsWith = cleanQuery.includes('முடியும்') || cleanQuery.includes('mudiyum') || cleanQuery.includes('ends with');
        const isStartsWith = cleanQuery.includes('தொடங்கும்') || cleanQuery.includes('thodangum') || cleanQuery.includes('starts with');
        
        // Target word if structural constraint exists
        let targetWord = '';
        if (isEndsWith || isStartsWith) {
            // Pick the most significant word (usually the one before "mudiyum" or after "starts with")
            // Simple heuristic: first word that isn't a command word
            targetWord = terms.find(t => !['முடியும்', 'mudiyum', 'ends', 'with', 'தொடங்கும்', 'thodangum', 'starts', 'kural', 'குறள்'].includes(t));
        }

        return this.dataset
            .map(k => {
                let score = 0;
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

                    const cleanL1 = l1.replace(/[.,!?;:]/g, '').trim();
                    const cleanL2 = l2.replace(/[.,!?;:]/g, '').trim();
                    const cleanT1 = t1.replace(/[.,!?;:]/g, '').trim();
                    const cleanT2 = t2.replace(/[.,!?;:]/g, '').trim();

                    if (isEndsWith) {
                        if (cleanL2.endsWith(targetWord) || cleanT2.endsWith(targetWord)) score += 50;
                        else if (cleanL2.includes(targetWord) || cleanT2.includes(targetWord)) score += 5;
                    }
                    if (isStartsWith) {
                        if (cleanL1.startsWith(targetWord) || cleanT1.startsWith(targetWord)) score += 50;
                        else if (cleanL1.includes(targetWord) || cleanT1.includes(targetWord)) score += 5;
                    }
                }

                // Keyword matches
                terms.forEach(t => {
                    if (fullContent.includes(t)) {
                        score += 1;
                        // Whole word bonus
                        const regex = new RegExp(`\\b${t}\\b`, 'u');
                        if (regex.test(fullContent)) score += 2;
                        
                        // Poetic line match
                        if (k.Line1.toLowerCase().includes(t) || k.Line2.toLowerCase().includes(t)) score += 5;
                        if (tanglishContent.includes(t)) score += 3;
                    }
                });

                // Structural match (number)
                if (cleanQuery.includes(k.Number.toString())) score += 100;

                return { ...k, score };
            })
            .filter(k => k.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
    }

    async semanticSearch(query) {
        return this.search(query);
    }

    async ask(question) {
        const query = question.trim().toLowerCase();
        const topMatches = await this.search(query);

        // Security: Only call OpenAI if key is valid sk- format
        const isValidKey = this.openai && this.openai.apiKey && this.openai.apiKey.startsWith('sk-');

        if (isValidKey) {
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
2. Respond in the language of the user. We support Tamil, English, and "Tanglish" (Tamil in English script). If the user uses Tanglish, reply in clear Tamil or Tanglish as appropriate.
3. For translation requests, use the high-quality translations provided in the context (Translation/explanation fields). Ensure semantic accuracy between English and Tamil.
4. Format your output elegantly: 
   - Kural Number & Verse
   - Scholarly Interpretation
   - Practical Life Application
5. If multiple Kurals match, explain the differences.

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
        const isTamil = /[\u0B80-\u0BFF]/.test(question);
        
        const result = matches.map(p => {
            if (isTamil) {
                return `குறள் #${p.Number}:\n"${p.Line1}\n${p.Line2}"\n\nவிளக்கம்: ${p.mv || p.explanation}`;
            } else {
                return `Kural #${p.Number}:\n"${p.Line1}\n${p.Line2}"\n\nMeaning: ${p.explanation}\nTransliteration: ${p.transliteration1} ${p.transliteration2}`;
            }
        }).join('\n\n---\n\n');

        return `நிபுணர் ஆய்வு / Scholarly Analysis:\n\n${result}`;
    }
}
