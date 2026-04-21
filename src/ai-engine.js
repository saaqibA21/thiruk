/**
 * THIRUKKURAL NEURAL CORE v4.3 (MAXIMUM IMAGE RELIABILITY)
 */

import OpenAI from 'openai';

export class KuralAI {
    constructor(dataset) {
        this.dataset = dataset;
        this.openai = null;
    }

    async init(apiKey) {
        const cleanKey = apiKey?.trim();
        console.log("KuralAI Init - Key detected:", !!cleanKey, "Length:", cleanKey?.length);
        if (cleanKey && cleanKey.startsWith('sk-')) {
            this.openai = new OpenAI({ apiKey: cleanKey, dangerouslyAllowBrowser: true });
        }
        if (window.onNeuralProgress) window.onNeuralProgress(100);
    }

    async search(query, isImageSearch = false) {
        if (!query) return { results: [], searchTerms: [] };

        const refinedQuery = isImageSearch ? query : await this.refineQuery(query);
        const cleanQuery = refinedQuery.toLowerCase().trim().normalize('NFC').replace(/[-._…·]{2,}/g, ' ');
        const terms = cleanQuery.split(/\s+/).filter(t => t.length >= 1);
        
        const stopWords = [
            'முடியும்', 'mudiyum', 'ending', 'nding', 'முடிவு', 'ஈறு', 'கடைசி', 'ends with', 'end',
            'தொடங்கும்', 'thodangum', 'starting', 'start', 'தொடக்கம்', 'ஆரம்பம்', 'முதல்', 'starts with',
            'இந்த', 'படத்தின்', 'விளக்கம்', 'என்ன', 'படம்', 'image', 'explanation', 'what', 'is', 'this'
        ].map(s => s.normalize('NFC'));
        
        const searchTerms = terms
            .map(t => t.replace(/[.,!?;:"\-_…·]/g, '').normalize('NFC'))
            .filter(t => t.length >= 1 && !stopWords.some(sw => t === sw));

        const results = this.dataset.map(k => {
            let score = 0;
            const l1 = (k.Line1 || "").toLowerCase().normalize('NFC');
            const l2 = (k.Line2 || "").toLowerCase().normalize('NFC');
            const cleanL1 = l1.replace(/[.,!?;:"\-_…·]/g, '');
            const cleanL2 = l2.replace(/[.,!?;:"\-_…·]/g, '');
            
            const wordsL1 = cleanL1.trim().split(/\s+/);
            const wordsL2 = cleanL2.trim().split(/\s+/);
            const allWords = [...wordsL1, ...wordsL2];
            const fullContent = `${l1} ${l2} ${k.mv || ''} ${k.sp || ''} ${k.mk || ''} ${k.Translation || ''}`.toLowerCase();

            searchTerms.forEach(t => {
                if (allWords.includes(t)) score += 100;
                else if (fullContent.includes(t)) score += 20;
            });

            if (cleanQuery.length > 5 && fullContent.includes(cleanQuery)) score += 300;

            const numMatch = cleanQuery.match(/\b(\d+)\b/);
            if (numMatch && k.Number === parseInt(numMatch[1])) score += 5000;

            return { ...k, score };
        })
        .filter(k => k.score > 15)
        .sort((a, b) => b.score - a.score);

        return { results, searchTerms };
    }

    async ask(question, imageBase64 = null) {
        let finalQuery = question.trim().toLowerCase();
        let identifiedKurals = [];
        const isValidKey = this.openai && this.openai.apiKey && this.openai.apiKey.startsWith('sk-');

        // Step 1: Visual identification (The most reliable for textbook images)
        if (imageBase64 && isValidKey) {
            try {
                const idResp = await this.openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [{
                        role: "system",
                        content: "Analyze the image. Identify the ONE REAL Thirukkural number that matches the verse TEXT. Ignore any workbook question numbers (like '25' if it's just a label). Trust the Tamil words over the numbers. Output ONLY the number."
                    }, {
                        role: "user",
                        content: [{ type: "image_url", image_url: { url: imageBase64 } }]
                    }],
                    max_tokens: 10
                });
                const nums = idResp.choices[0].message.content.match(/\d+/g);
                if (nums) identifiedKurals = this.dataset.filter(k => nums.map(Number).includes(k.Number));
                
                // Also get keywords for the search loop
                const kwResp = await this.openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [{
                        role: "system",
                        content: "Extract core Tamil keywords from this verse image. Ignore dashes/dots. Output only words."
                    }, {
                        role: "user",
                        content: [{ type: "image_url", image_url: { url: imageBase64 } }]
                    }],
                    max_tokens: 100
                });
                finalQuery += " " + kwResp.choices[0].message.content.trim();
            } catch (err) {
                console.error("Vision Identification Error:", err);
                const isAuthError = err.status === 401 || err.code === 'invalid_api_key' || err.message?.includes('401');
                if (isAuthError) {
                    return { answer: "பிழை: உங்கள் OpenAI API Key தவறானது அல்லது காலாவதியானது. (Error: 401). தயவுசெய்து உங்கள் OpenAI Usage Credits ($0.00 balance?) மற்றும் Vercel Settings-ஐச் சரிபார்க்கவும்.", sources: [] };
                }
                return { answer: "இணைப்பு பிழை! உங்கள் இணையதளம் அல்லது API Key அமைப்புகளைச் சரிபார்க்கவும். (Network/CORS Error). குறிப்பு: Vercel-ல் API Key சேர்த்த பிறகு 'Redeploy' செய்துள்ளீர்களா என உறுதிப்படுத்தவும்.", sources: [] };
            }
        }

        // Step 2: Search (Lexical)
        const { results: lexicalResults, searchTerms } = await this.search(finalQuery, !!imageBase64);
        
        // Combine (Prioritize identified ones)
        const allMatches = [...identifiedKurals, ...lexicalResults];
        const uniqueMatches = Array.from(new Set(allMatches.map(k => k.Number)))
            .map(num => allMatches.find(k => k.Number === num))
            .slice(0, 15);

        // Step 3: AI Reasoning or Fallback
        if (isValidKey && uniqueMatches.length > 0) {
            try {
                const context = uniqueMatches.map(k => `Verse #${k.Number}: ${k.Line1} / ${k.Line2}\nTamil: ${k.mv}\nMeaning: ${k.explanation}`).join('\n\n');
                const response = await this.openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: "You are a Thirukkural Scholar. Be extremely direct and concise. For an image matching a Kural, output ONLY the Kural Number, the Verse, and a very brief meaning (1 sentence). If there are multiple hits but one clearly matches the text in the image, prioritize only that one. No long explanations." },
                        { role: "user", content: `Context:\n${context}\n\nQuestion: ${question}` }
                    ]
                });
                return { answer: response.choices[0].message.content.trim(), sources: uniqueMatches };
            } catch (err) {
                console.error("AI Reasoner Error:", err);
            }
        }

        return { answer: this.fallback(question, uniqueMatches, searchTerms), sources: uniqueMatches };
    }

    fallback(question, matches, searchTerms) {
        if (matches.length === 0) return "மன்னிக்கவும், இது குறித்த குறள்கள் கிடைக்கவில்லை. / Sorry, no matching Kurals were found.";
        let msg = `"${searchTerms.join(', ')}" தொடர்பான குறள்கள் இதோ:\n\n`;
        matches.slice(0, 3).forEach(k => { msg += `குறள் ${k.Number}:\n${k.Line1}\n${k.Line2}\n\n`; });
        return msg;
    }

    async refineQuery(query) {
        if (!this.openai || query.length < 4) return query;
        try {
            const resp = await this.openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "system", content: "Refine query into Tamil. Output only text." }, { role: "user", content: query }],
                max_tokens: 50
            });
            return resp.choices[0].message.content.trim();
        } catch { return query; }
    }
}
