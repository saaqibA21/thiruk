import OpenAI from 'openai';

class KuralAI {
    constructor() {
        this.kuralData = [];
        this.openai = null;
    }

    async init(apiKey) {
        const cleanKey = apiKey?.trim();
        if (cleanKey && cleanKey.startsWith('sk-')) {
            const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
            const baseURL = isLocal ? 'http://localhost:5174/api-openai/v1' : 'https://api.openai.com/v1';
            this.openai = new OpenAI({ apiKey: cleanKey, dangerouslyAllowBrowser: true, baseURL });
        }
        try {
            const response = await fetch('/thirukkural.json');
            const data = await response.json();
            this.kuralData = data.kural;
        } catch (error) { console.error(error); }
    }

    async search(query) {
        if (!query) return { results: [], searchTerms: [] };
        const searchTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);
        const results = this.kuralData.filter(k => {
            const text = `${k.Line1} ${k.Line2} ${k.Translation} ${k.mv} ${k.sp} ${k.mk}`.toLowerCase();
            return searchTerms.every(term => text.includes(term));
        });
        return { results: results.slice(0, 15), searchTerms };
    }

    async ask(query, imageBase64 = null) {
        try {
            const { results: lexicalResults } = await this.search(query);
            let context = lexicalResults.slice(0, 5).map(k => `Kural #${k.Number}: ${k.Line1} / ${k.Line2}`).join('\n\n');
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are a Thirukkural Scholar. Answer in Tamil. Chapters: Aram 38, Porul 70, Inbam 25. Kurals: Aram 380, Porul 700, Inbam 250. RULE: 1 Chapter = 10 Kurals. NEVER say 25 kurals for Inbam, say 250." },
                    { role: "user", content: `Context:\n${context}\n\nQuery: ${query}` }
                ],
                temperature: 0
            });
            return { answer: response.choices[0].message.content, sources: lexicalResults };
        } catch (error) { return { answer: "Error", sources: [] }; }
    }
}
export const engine = new KuralAI();
