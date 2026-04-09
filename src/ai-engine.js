/**
 * THIRUKKURAL NEURAL CORE v3.1 (OPENAI INTEGRATION + KNOWLEDGE BASE)
 * Uses @xenova/transformers for local semantic search 
 * and OpenAI GPT-4o-mini for scholarly generative reasoning.
 * Now with persistent Knowledge Base and improved structural search.
 */

import { pipeline } from '@xenova/transformers';
import OpenAI from 'openai';

// Simple IndexedDB Wrapper
const DB_NAME = 'NeuralKuralIndex';
const STORE_NAME = 'embeddings_cache';
const KB_STORE_NAME = 'knowledge_base';
const EMBED_CACHE_VERSION = 'v3.5_optimized_ui'; 

const getDB = () => new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 2); 
    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
        }
        if (!db.objectStoreNames.contains(KB_STORE_NAME)) {
            db.createObjectStore(KB_STORE_NAME, { keyPath: 'id', autoIncrement: true });
        }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
});

const saveToDB = async (store, id, data) => {
    const db = await getDB();
    const tx = db.transaction(store, 'readwrite');
    tx.objectStore(store).put(data, id);
    return new Promise(r => tx.oncomplete = r);
};

const loadFromDB = async (store, id) => {
    const db = await getDB();
    const tx = db.transaction(store, 'readonly');
    const request = tx.objectStore(store).get(id);
    return new Promise(r => request.onsuccess = () => r(request.result));
};

const getAllFromDB = async (store) => {
    const db = await getDB();
    const tx = db.transaction(store, 'readonly');
    const request = tx.objectStore(store).getAll();
    return new Promise(r => {
        request.onsuccess = () => r(request.result);
        request.onerror = () => r([]);
    });
};

const saveToKB = async (entry) => {
    const db = await getDB();
    const tx = db.transaction(KB_STORE_NAME, 'readwrite');
    const store = tx.objectStore(KB_STORE_NAME);
    store.add({
        ...entry,
        timestamp: Date.now()
    });
    return new Promise(r => tx.oncomplete = r);
};

export class KuralAI {
    constructor(dataset) {
        this.dataset = dataset;
        this.extractor = null;
        this.embeddings = [];
        this.openai = null;
    }

    async init(apiKey) {
        if (apiKey) {
            this.openai = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
        }

        this.extractor = await pipeline('feature-extraction', 'Xenova/paraphrase-multilingual-MiniLM-L12-v2');
        
        const cached = await loadFromDB(STORE_NAME, 'embeddings_' + EMBED_CACHE_VERSION);
        if (cached && cached.length === this.dataset.length) {
            this.embeddings = cached;
            if (window.onNeuralProgress) window.onNeuralProgress(100);
        } else {
            await this.generateEmbeddings();
        }
    }

    async generateEmbeddings() {
        this.embeddings = [];
        const batchSize = 10; // Reduced for much smoother UI updates
        for (let i = 0; i < this.dataset.length; i += batchSize) {
            const batch = this.dataset.slice(i, i + batchSize);
            const batchPromises = batch.map(async (k) => {
                const text = `${k.Line1} ${k.Line2}`; // Further slimmed context for speed
                const output = await this.extractor(text, { pooling: 'mean', normalize: true });
                return Array.from(output.data);
            });

            const results = await Promise.all(batchPromises);
            this.embeddings.push(...results);
            
            if (window.onNeuralProgress) {
                window.onNeuralProgress(Math.round(((i + batchSize) / this.dataset.length) * 100));
            }
            // Yield longer to allow browser to handle interactions
            await new Promise(r => setTimeout(r, 20)); 
        }
        await saveToDB(STORE_NAME, 'embeddings_' + EMBED_CACHE_VERSION, this.embeddings);
        if (window.onNeuralProgress) window.onNeuralProgress(100);
    }

    async getEmbedding(text) {
        const output = await this.extractor(text, { pooling: 'mean', normalize: true });
        return Array.from(output.data);
    }

    dotProduct(a, b) {
        return a.reduce((sum, val, i) => sum + val * b[i], 0);
    }

    async semanticSearch(query) {
        const userVector = await this.getEmbedding(query.toLowerCase().trim());
        const scores = this.embeddings.map((kVector, index) => ({
            index,
            score: this.dotProduct(userVector, kVector)
        }));
        
        return scores
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map(m => this.dataset[m.index]);
    }

    async getKB() {
        return await getAllFromDB(KB_STORE_NAME);
    }

    async ask(question) {
        const query = question.trim().toLowerCase();
        let topMatches = [];
        let isStructural = false;
        let targetWord = "";

        // Flexible Structural Search Patterns (handles both: "word ends with" and "ends with word")
        const endsWithPatterns = [
            /(?:ending with|முடியும் குறள்|முடிவடையும் குறள்|ஈற்றுச் சொல்)\s*["']?([\u0B80-\u0BFF\w]+)["']?/i,
            /["']?([\u0B80-\u0BFF\w]+)["']?\s*(?:என்ற|என|என்று|எனும்|ஆகிய)\s*(?:சொல்லுடன்|வாக்கியத்துடன்|ஈற்றுடன்)?\s*(?:முடியும்|முடிவடையும்|ஈற்றுச் சொல்)/i
        ];
        const startsWithPatterns = [
            /(?:starting with|starts with|தொடங்கும் குறள்|ஆரம்பிக்கும் குறள்|முதற் சொல்)\s*["']?([\u0B80-\u0BFF\w]+)["']?/i,
            /["']?([\u0B80-\u0BFF\w]+)["']?\s*(?:என்ற|என|என்று|எனும்|ஆகிய)\s*(?:சொல்லுடன்|வாக்கியத்துடன்|முதலுடன்)?\s*(?:தொடங்கும்|ஆரம்பிக்கும்|முதற் சொல்)/i
        ];

        let endMatch = null;
        for (const p of endsWithPatterns) {
            const m = query.match(p);
            if (m) { endMatch = m; break; }
        }

        let startMatch = null;
        for (const p of startsWithPatterns) {
            const m = query.match(p);
            if (m) { startMatch = m; break; }
        }

        if (endMatch) {
            isStructural = true;
            targetWord = endMatch[1].toLowerCase();
            const isTamil = /[\u0B80-\u0BFF]/.test(targetWord);
            
            topMatches = this.dataset.filter(k => {
                const line2 = k.Line2.trim().replace(/[.!,]$/, "");
                const trans2 = (k.transliteration2 || "").trim().toLowerCase().replace(/[.!,]$/, "");
                const translation = (k.explanation || "").toLowerCase();
                
                if (isTamil) {
                    // Match Tamil word at the end, handling potential extra space or punctuation
                    return line2.endsWith(targetWord) || line2.split(/\s+/).pop() === targetWord;
                } else {
                    const variants = [targetWord, targetWord.replace(/gu$/, "ku"), targetWord.replace(/ku$/, "gu")];
                    const matchesTrans = variants.some(v => trans2.endsWith(v));
                    const matchesMeaning = (targetWord === "ulagu" || targetWord === "world") && translation.endsWith("world");
                    return matchesTrans || matchesMeaning;
                }
            });
        }
 else if (startMatch) {
            isStructural = true;
            targetWord = startMatch[1].toLowerCase();
            const isTamil = /[\u0B80-\u0BFF]/.test(targetWord);

            topMatches = this.dataset.filter(k => {
                const line1 = k.Line1.trim();
                const trans1 = (k.transliteration1 || "").trim().toLowerCase();
                
                if (isTamil) {
                    return line1.startsWith(targetWord);
                } else {
                    return trans1.startsWith(targetWord);
                }
            });
        }

        // Sort matches by Kural Number to prioritize foundational ones like #1
        if (isStructural) {
            topMatches = topMatches.sort((a, b) => a.Number - b.Number).slice(0, 25);
        }

        // Fallback or Normal Semantic Search
        if (topMatches.length === 0) {
            topMatches = await this.semanticSearch(question);
        }

        if (this.openai) {
            try {
                const context = topMatches.map(k => 
                    `Verse #${k.Number}: ${k.Line1} ${k.Line2} 
Transliteration: ${k.transliteration1} ${k.transliteration2}
Mu. Varadarajan (Mu.Va): ${k.mv}
Kalaignar (Mu. Karunanidhi): ${k.mk}
Solomon Pappaiya: ${k.sp}
English Meaning: ${k.explanation}`
                ).join('\n\n');

                const systemPrompt = `You are "Thirukkural Expert", a scholarly AI assistant.

CRITICAL INSTRUCTIONS:
1. If this is a STRUCTURAL SEARCH (e.g., "starts with" or "ends with"), you MUST list the matches found in the context that exactly satisfy the structural condition.
2. For "ending with ulagu", prioritize Kural #1 and any others ending with "உலகு" or "Ulaku/Ulagu".
3. Always provide: Kural Number, the original Tamil lines, and the deep philosophical meaning.
4. If asked in Tamil, reply in Tamil. If asked in English, reply in English but keep the verses in Tamil.
5. Be concise but scholarly.

Context Data:
${context}

Mode: ${isStructural ? `STRUCTURAL SEARCH for "${targetWord}"` : 'GENERAL INQUIRY'}`;

                const response = await this.openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: question }
                    ],
                    temperature: 0.1
                });

                const answer = response.choices[0].message.content;

                await saveToKB({
                    question: question,
                    answer: answer,
                    sources: topMatches.map(m => m.Number)
                });

                return { answer, sources: topMatches };

            } catch (err) {
                console.error("OpenAI Error:", err);
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
                return `குறள் #${p.Number}:\n"${p.Line1}\n${p.Line2}"\nவிளக்கம்: ${p.mv}`;
            } else {
                return `Kural #${p.Number}:\n"${p.Line1}\n${p.Line2}"\nMeaning: ${p.explanation}`;
            }
        }).join('\n\n---\n\n');

        return `நிபுணர் ஆய்வு / Scholarly Analysis:\n\n${result}`;
    }
}
