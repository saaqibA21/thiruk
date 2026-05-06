const CHAPTER_INDEX = [
  "கடவுள் வாழ்த்து", "வான் சிறப்பு", "நீத்தார் பெருமை", "அறன் வலியுறுத்தல்", "இல் வாழ்க்கை", "வாழ்க்கைத் துணைநலம்", "மக்கள் பேறு", "அன்பு உடைமை", "விருந்து ஓம்பல்", "இனியவை கூறல்", "செய்ந்நன்றி அறிதல்", "நடுவு நிலைமை", "அடக்கம் உடைமை", "ஒழுக்கம் உடைமை", "பிறன் இல் விழையாமை", "பொறை உடைமை", "அழுக்காறாமை", "வெஃகாமை", "புறம் கூறாமை", "பயன் இல சொல்லாமை", "தீவினை அச்சம்", "ஒப்புரவு அறிதல்", "ஈகை", "புகழ்", "அருள் உடைமை", "புலால் மறுத்தல்", "தவம்", "கூடா ஒழுக்கம்", "கள்ளாமை", "வாய்மை", "வெகுளாமை", "இன்னா செய்யாமை", "கொல்லாமை", "நிலையாமை", "துறவு", "மெய் உணர்தல்", "அவா அறுத்தல்", "ஊழ்", "இறை மாட்சி", "கல்வி", "கல்லாமை", "கேள்வி", "அறிவு உடைமை", "குற்றம் கடிதல்", "பெரியோரைத் துணைக்கோடல்", "சிற்றினம் சேராமை", "தெரிந்து செயல் வகை", "வலி அறிதல்", "காலம் அறிதல்", "இடன் அறிதல்", "தெரிந்து தெளிதல்", "தெரிந்து வினையாடல்", "சுற்றம் தழால்", "பொச்சாவாமை", "செங்கோன்மை", "கொடுங்கோன்மை", "வெருவந்த செய்யாமை", "கண்ணோட்டம்", "ஒற்றாடல்", "ஊக்கம் உடைமை", "மடி இன்மை", "ஆள்வினை உடைமை", "இடுக்கண் அழியாமை", "அமைச்சு", "சொல்வன்மை", "வினைத் தூய்மை", "வினைத் திட்பம்", "வினை செயல் வகை", "தூது", "மன்னரைச் சேர்ந்து ஒழுகல்", "குறிப்பு அறிதல்", "அவை அறிதல்", "அவை அஞ்சாமை", "நாடு", "அரண்", "பொருள் செயல் வகை", "படை மாட்சி", "படைச் செருக்கு", "நட்பு", "நட்பு ஆராய்தல்", "பழைமை", "தீ நட்பு", "கூடா நட்பு", "பேதைமை", "புல்லறிவாண்மை", "இகல்", "பகை மாட்சி", "பகைத் திறம் தெளிதல்", "உட்பகை", "பெரியோரைப் பிழையாமை", "பெண்வழிச் சேறல்", "வரைவின் மகளிர்", "கள் உண்ணாமை", "சூது", "மருந்து", "குடிமை", "மானம்", "பெருமை", "சான்றாண்மை", "பண்பு உடைமை", "நன்றி இல் செல்வம்", "நாண் உடைமை", "குடி செயல் வகை", "உழவு", "நல்குரவு", "இரவு", "இரவு அச்சம்", "கயமை", "தகையணங்கு உறுத்தல்", "குறிப்பு அறிதல்", "புணர்ச்சி மகிழ்தல்", "நலம் புனைந்து உரைத்தல்", "காதல் சிறப்பு உரைத்தல்", "நாணுத் துறவு உரைத்தல்", "அலர் அறிவுறுத்தல்", "பிரிவு ஆற்றாமை", "படர் மெலிந்து இரங்கல்", "கண் விதுப்பு அழிதல்", "பசப்புறு பருவரல்", "தனிப்படர் மிகுதி", "நினைந்தவர் புலம்பல்", "கனவு நிலை உரைத்தல்", "பொழுது கண்டு இரங்கல்", "உறுப்பு நலன் அழிதல்", "நெஞ்சொடு கிளத்தல்", "நிறை அழிதல்", "அவர் வயின் விதும்பல்", "குறிப்பு அறிவுறுத்தல்", "புணர்ச்சி விதும்பல்", "நெஞ்சொடு புலத்தல்", "புலவி", "புலவி நுணுக்கம்", "ஊடல் உவகை"
];

import OpenAI from 'openai';

export class KuralAI {
    constructor(dataset) {
        this.dataset = dataset;
        this.openai = null;
        this.aiHistory = [];
    }

    async init(apiKey) {
        const cleanKey = apiKey?.trim();
        if (cleanKey && cleanKey.startsWith('sk-')) {
            const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
            const baseURL = isLocal ? 'http://localhost:5174/api-openai/v1' : 'https://api.openai.com/v1';
            this.openai = new OpenAI({ apiKey: cleanKey, dangerouslyAllowBrowser: true, baseURL });
        }
    }

    async search(query, isImageSearch = false) {
        if (!query) return { results: [], searchTerms: [] };
        const normalize = (text) => (text || "").normalize('NFC').toLowerCase().replace(/[.,!?;:"\-_…·\s]+/g, ' ').trim();
        const cleanQuery = normalize(query);
        
        const startKeywords = ['தொடங்கும்', 'துடங்கும்', 'starting', 'start'];
        const endKeywords = ['முடியும்', 'ending', 'ends'];
        
        const isStartsWith = startKeywords.some(kw => cleanQuery.includes(kw));
        const isEndsWith = endKeywords.some(kw => cleanQuery.includes(kw));
        
        const allWords = cleanQuery.split(/\s+/);
        const searchTerms = allWords.filter(t => !startKeywords.includes(t) && !endKeywords.includes(t) && t.length > 1);
        const target = searchTerms[0] || allWords[0];

        const scoredResults = this.dataset.map(k => {
            let score = 0;
            const l1 = normalize(k.Line1);
            const l2 = normalize(k.Line2);
            const v = `${l1} ${l2}`;
            const words = v.split(/\s+/);

            if (isStartsWith && target) {
                const targetRoot = target.length > 2 ? target.substring(0, target.length - 1) : target;
                if (l1.startsWith(target) || words[0].startsWith(target) || l1.startsWith(targetRoot) || words[0].startsWith(targetRoot)) {
                    score += 1000000;
                }
            } else if (isEndsWith && target) {
                if (l2.endsWith(target) || words[words.length-1].endsWith(target)) score += 1000000;
            } else {
                searchTerms.forEach(t => {
                    if (words.includes(t)) score += 5000;
                    else if (v.includes(t)) score += 1000;
                });
            }

            const numMatch = query.match(/\d+/);
            if (numMatch && k.Number === parseInt(numMatch[0])) score += 2000000;
            
            return { ...k, score };
        }).filter(r => r.score > 0).sort((a, b) => b.score - a.score);

        return { results: scoredResults.slice(0, isImageSearch ? 1 : 5), searchTerms };
    }

    async ask(question, imageBase64 = null, isDirect = false) {
        const isValidKey = this.openai && this.openai.apiKey?.startsWith('sk-');
        if (!isValidKey) return { answer: "API Key invalid.", sources: [] };

        let finalSources = [];
        const questionWords = ['என்ன', 'ஏன்', 'எப்படி', 'விளக்கம்', 'explain', 'what', 'why', 'how', '?', 'சொல்', 'கூறு'];
        const isQuestion = questionWords.some(w => question.toLowerCase().includes(w));

        if (!isDirect) {
            const { results } = await this.search(question, !!imageBase64);
            finalSources = results;

            // CRITICAL: Skip AI for simple searches or structural queries
            // If it's not a question and we have a high-confidence match, return it immediately
            const hasHighConfidence = finalSources.length > 0 && finalSources[0].score > 1000000;
            if (!isQuestion && !imageBase64 && hasHighConfidence) {
                return { 
                    answer: finalSources.length > 1 ? `இதோ நீங்கள் கேட்டது குறித்த ${finalSources.length} குறள்கள்:` : `இதோ நீங்கள் கேட்ட குறள்:`, 
                    sources: finalSources 
                };
            }
            
            // For structural queries (starts with/ends with), always skip AI unless it's an explicit question
            const startKeywords = ['தொடங்கும்', 'துடங்கும்', 'starting', 'start'];
            const endKeywords = ['முடியும்', 'ending', 'ends'];
            const isStructural = startKeywords.some(kw => question.includes(kw)) || endKeywords.some(kw => question.includes(kw));
            if (isStructural && finalSources.length > 0 && !imageBase64 && !isQuestion) {
                return { answer: `இதோ நீங்கள் கேட்டது குறித்த ${finalSources.length} குறள்கள் கண்டறியப்பட்டுள்ளன:`, sources: finalSources };
            }
        }

        try {
            const context = finalSources.map(k => `Kural #${k.Number}: ${k.Line1} / ${k.Line2}`).join('\n\n');
            const messages = [
                { 
                    role: "system", 
                    content: `You are an expert Thirukkural Scholar. 
                    
                    ### MASTER KNOWLEDGE BASE (ABSOLUTE TRUTH):
                    1. STRUCTURE: 1,330 Kurals, 133 Chapters, 9 Iyals. Words: 14,000. Letters: 42,194. 'ஃ' used 14 times. 'குறிப்பறிதல்' is the only chapter title used twice.
                    2. LETTERS: Only 37 out of 247 letters used. 'னி' most used (1705). 'ஔ' is NEVER used. Starts with 'அ' and ends with 'ன'.
                    3. NUMBERS: '9' NEVER used. '7' occurs 8 times. '70 Crore' occurs once.
                    4. NATURE: Flowers (Anicham, Kuvalai), Trees (Palm, Bamboo), Fruit (Nerunjil), Seed (Kundrimani).
                    5. BIOGRAPHY: Parents (Adi, Bagavan), Wife (Vasuki). Born: Mylapore (31 BC). Artist who drew his picture: Venuvarmma (Puducherry).
                    6. HISTORY: First Printed: 1812 (Tanjore) by Nanaprakasam. First Commentator: Manakkudavar. Best Commentator: Parimelazhagar.
                    7. TRANSLATIONS: 107 languages. G.U. Pope (English), Veeramamunivar (Latin), Kittu Sironmani (Narikkuravar/Vak boli).
                    8. ABSENT: 'Tamil' and 'God' (inside verses) are NEVER used.
                    
                    ### RULES:
                    - A Kural has exactly 2 lines and 7 words. Line 1: 4 words. Line 2: 3 words.
                    - ALWAYS respond in professional Tamil.` 
                }
            ];

            const userContent = [{ type: "text", text: isDirect ? question : `Context:\n${context}\n\nUser Question: ${question}` }];
            if (imageBase64) userContent.push({ type: "image_url", image_url: { url: imageBase64 } });
            messages.push({ role: "user", content: userContent });

            const response = await this.openai.chat.completions.create({
                model: "gpt-4o",
                messages: messages,
                temperature: 0.3
            });

            return { answer: response.choices[0].message.content.trim(), sources: finalSources };
        } catch (err) {
            console.error("AI Error:", err);
            return { answer: "மன்னிக்கவும், பதிலளிப்பதில் சிக்கல் ஏற்பட்டது.", sources: finalSources };
        }
    }
}
