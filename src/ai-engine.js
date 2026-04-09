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

    // High-speed Lexical Search (Keyword + Structural)
    async search(query) {
        const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
        
        return this.dataset
            .map(k => {
                let score = 0;
                const content = `${k.Line1} ${k.Line2} ${k.mv || ''} ${k.sp || ''} ${k.explanation || ''}`.toLowerCase();
                
                // Keyword matches
                terms.forEach(t => {
                    if (content.includes(t)) score += 1;
                    if (k.Line1.toLowerCase().includes(t) || k.Line2.toLowerCase().includes(t)) score += 3;
                });

                // Structural match (number)
                if (query.includes(k.Number.toString())) score += 20;

                // Priority for Kural #1 if "ulagu" mentioned
                if (k.Number === 1 && (query.includes('ulagu') || query.includes('உலகு'))) score += 15;

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
Mu. Varadarajan (Mu.Va): ${k.mv}
Kalaignar (Mu. Karunanidhi): ${k.mk}
Solomon Pappaiya: ${k.sp}
English Meaning: ${k.explanation}`
                ).join('\n\n');

                const systemPrompt = `You are "Thirukkural Expert", a scholarly AI assistant.
1. Provide Kural Number, original Tamil lines, and deep philosophical meaning.
2. If asked in Tamil, reply in Tamil. If asked in English, reply in English.
3. Be concise but scholarly.
4. If multiple Kurals match, explain the nuances between them.

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
                // Silence 401 errors for a better UX, log other issues
                if (err.status !== 401) console.error("Neural Reasoning Error:", err);
                return { answer: this.fallback(question, topMatches), sources: topMatches };
            }
        } else {
            // High-speed Scholarly Fallback
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
                return `Kural #${p.Number}:\n"${p.Line1}\n${p.Line2}"\n\nMeaning: ${p.explanation}`;
            }
        }).join('\n\n---\n\n');

        return `நிபுணர் ஆய்வு / Scholarly Analysis:\n\n${result}`;
    }
}
