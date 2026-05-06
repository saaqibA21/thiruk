const CHAPTER_INDEX = [
  "கடவுள் வாழ்த்து", "வான் சிறப்பு", "நீத்தார் பெருமை", "அறன் வலியுறுத்தல்", "இல் வாழ்க்கை", "வாழ்க்கைத் துணைநலம்", "மக்கள் பேறு", "அன்பு உடைமை", "விருந்து ஓம்பல்", "இனியவை கூறல்", "செய்ந்நன்றி அறிதல்", "நடுவு நிலைமை", "அடக்கம் உடைமை", "ஒழுக்கம் உடைமை", "பிறன் இல் விழையாமை", "பொறை உடைமை", "அழுக்காறாமை", "வெஃகாமை", "புறம் கூறாமை", "பயன் இல சொல்லாமை", "தீவினை அச்சம்", "ஒப்புரவு அறிதல்", "ஈகை", "புகழ்", "அருள் உடைமை", "புலால் மறுத்தல்", "தவம்", "கூடா ஒழுக்கம்", "கள்ளாமை", "வாய்மை", "வெகுளாமை", "இன்னா செய்யாமை", "கொல்லாமை", "நிலையாமை", "துறவு", "மெய் உணர்தல்", "அவா அறுத்தல்", "ஊழ்", "இறை மாட்சி", "கல்வி", "கல்லாமை", "கேள்வி", "அறிவு உடைமை", "குற்றம் கடிதல்", "பெரியோரைத் துணைக்கோடல்", "சிற்றினம் சேராமை", "தெரிந்து செயல் வகை", "வலி அறிதல்", "காலம் அறிதல்", "இடன் அறிதல்", "தெரிந்து தெளிதல்", "தெரிந்து வினையாடல்", "சுற்றம் தழால்", "பொச்சாவாமை", "செங்கோன்மை", "கொடுங்கோன்மை", "வெருவந்த செய்யாமை", "கண்ணோட்டம்", "ஒற்றாடல்", "ஊக்கம் உடைமை", "மடி இன்மை", "ஆள்வினை உடைமை", "இடுக்கண் அழியாமை", "அமைச்சு", "சொல்வன்மை", "வினைத் தூய்மை", "வினைத் திட்பம்", "வினை செயல் வகை", "தூது", "மன்னரைச் சேர்ந்து ஒழுகல்", "குறிப்பு அறிதல்", "அவை அறிதல்", "அவை அஞ்சாமை", "நாடு", "அரண்", "பொருள் செயல் வகை", "படை மாட்சி", "படைச் செருக்கு", "நட்பு", "நட்பு ஆராய்தல்", "பழைமை", "தீ நட்பு", "கூடா நட்பு", "பேதைமை", "புல்லறிவாண்மை", "இகல்", "பகை மாட்சி", "பகைத் திறம் தெளிதல்", "உட்பகை", "பெரியோரைப் பிழையாமை", "பெண்வழிச் சேறல்", "வரைவின் மகளிர்", "கள் உண்ணாமை", "சூது", "மருந்து", "குடிமை", "மானம்", "பெருமை", "சான்றாண்மை", "பண்பு உடைமை", "நன்றி இல் செல்வம்", "நாண் உடைமை", "குடி செயல் வகை", "உழவு", "நல்குரவு", "இரவு", "இரவு அச்சம்", "கயமை", "தகையணங்கு உறுத்தல்", "குறிப்பு அறிதல்", "புணர்ச்சி மகிழ்தல்", "நலம் புனைந்து உரைத்தல்", "காதல் சிறப்பு உரைத்தல்", "நாணுத் துறவு உரைத்தல்", "அலர் அறிவுறுத்தல்", "பிரிவு ஆற்றாமை", "படர் மெலிந்து இரங்கல்", "கண் விதுப்பு அழிதல்", "பசப்புறு பருவரல்", "தனிப்படர் மிகுதி", "நினைந்தவர் புலம்பல்", "கனவு நிலை உரைத்தல்", "பொழுது கண்டு இரங்கல்", "உறுப்பு நலன் அழிதல்", "நெஞ்சொடு கிளத்தல்", "நிறை அழிதல்", "அவர் வயின் விதும்பல்", "குறிப்பு அறிவுறுத்தல்", "புணர்ச்சி விதும்பல்", "நெஞ்சொடு புலத்தல்", "புலவி", "புலவி நுணுக்கம்", "ஊடல் உவகை"
];

const TRIVIA_KNOWLEDGE = {
    "இயல்": "திருக்குறளில் மொத்தம் 9 இயல்கள் உள்ளன. (அறத்துப்பால்-4, பொருட்பால்-7, இன்பத்துப்பால்-2).",
    "பால்": "திருக்குறளில் மொத்தம் 3 பால்கள் உள்ளன. அவை: அறத்துப்பால், பொருட்பால், காமத்துப்பால்.",
    "எழுத்து": "திருக்குறளில் உள்ள மொத்த எழுத்துக்கள்: 42,194. பயன்படுத்தப்பட்ட தமிழ் எழுத்துக்கள்: 37. 'னி' அதிக முறை (1705) வந்துள்ளது. 'ஔ' பயன்படுத்தப்படவில்லை.",
    "சொல்": "திருக்குறளில் உள்ள மொத்த சொற்கள்: 14,000.",
    "அதிகாரம்": "திருக்குறளில் மொத்தம் 133 அதிகாரங்கள் உள்ளன.",
    "பெற்றோர்": "திருவள்ளுவரின் பெற்றோர் ஆதி மற்றும் பகவன் என்று நம்பப்படுகிறது.",
    "மனைவி": "திருவள்ளுவரின் மனைவி வாசுகி.",
    "ஆண்டு": "திருக்குறள் முதன்முதலில் 1812-ம் ஆண்டு அச்சிடப்பட்டது. திருவள்ளுவர் கி.மு. 31-ம் ஆண்டு பிறந்தவராகக் கருதப்படுகிறது.",
    "மொழிபெயர்ப்பு": "திருக்குறள் 107 மொழிகளில் மொழிபெயர்க்கப்பட்டுள்ளது. ஆங்கிலத்தில் ஜி.யு. போப் முதன்முதலில் மொழிபெயர்த்தார்.",
    "மலர்": "திருக்குறளில் இடம்பெற்றுள்ள மலர்கள்: அனிச்சம் மற்றும் குவளை.",
    "மரம்": "திருக்குறளில் இடம்பெற்றுள்ள மரங்கள்: பனை மற்றும் மூங்கில்.",
    "விதை": "திருக்குறளில் இடம்பெற்றுள்ள விதை: குன்றிமணி.",
    "பழம்": "திருக்குறளில் இடம்பெற்றுள்ள பழம்: நெருஞ்சிப்பழம்.",
    "தமிழ்": "'தமிழ்' என்ற சொல் திருக்குறளில் எங்கும் பயன்படுத்தப்படவில்லை.",
    "கடவுள்": "'கடவுள்' என்ற சொல் குறட்பாக்களுக்குள் இல்லை; அதிகாரத் தலைப்பில் மட்டுமே உள்ளது."
};

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
        
        const startKeywords = ['தொடங்கும்', 'துடங்கும்', 'starting', 'start', 'தொடக்கம்'];
        const endKeywords = ['முடியும்', 'ending', 'ends', 'முடிவு'];
        
        const isStartsWith = startKeywords.some(kw => cleanQuery.includes(kw));
        const isEndsWith = endKeywords.some(kw => cleanQuery.includes(kw));
        
        const allWords = cleanQuery.split(/\s+/);
        const ignoreWords = [...startKeywords, ...endKeywords, 'குறள்', 'திருக்குறள்', 'என்று', 'என'];
        const searchTerms = allWords.filter(t => !ignoreWords.includes(t) && t.length > 1);
        const target = searchTerms[0] || allWords[0];

        const scoredResults = this.dataset.map(k => {
            let score = 0;
            const l1 = normalize(k.Line1);
            const l2 = normalize(k.Line2);
            const v = `${l1} ${l2}`;
            const words = v.split(/\s+/);

            if (isStartsWith && target) {
                const targetRoot = target.endsWith('ம்') ? target.slice(0, -1) : target;
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

        const normalize = (text) => (text || "").normalize('NFC').toLowerCase().replace(/[.,!?;:"\-_…·\s]+/g, ' ').trim();
        let queryForSearch = normalize(question);
        
        // Step 1: If image only, perform quick OCR to get text for grounding
        if (imageBase64 && queryForSearch.length < 5) {
            try {
                const ocr = await this.openai.chat.completions.create({
                    model: "gpt-4o",
                    messages: [{ role: "user", content: [{ type: "text", text: "Transcribe ONLY the Tamil text from this image. No other text." }, { type: "image_url", image_url: { url: imageBase64 } }] }],
                    max_tokens: 100
                });
                queryForSearch = normalize(ocr.choices[0].message.content.trim());
            } catch (e) { console.error("OCR Error:", e); }
        }

        // Step 2: Deterministic Trivia Shield - Check if the question is a known trivia fact
        const triviaKeys = Object.keys(TRIVIA_KNOWLEDGE);
        for (const key of triviaKeys) {
            if (queryForSearch.includes(key)) {
                return { answer: TRIVIA_KNOWLEDGE[key], sources: [] };
            }
        }

        let finalSources = [];
        const questionWords = ['என்ன', 'ஏன்', 'எப்படி', 'விளக்கம்', 'explain', 'what', 'why', 'how', '?', 'சொல்', 'கூறு'];
        const isQuestion = questionWords.some(w => queryForSearch.includes(w));

        // CRITICAL: Even in Direct Mode, we MUST use local data for images to prevent hallucinations
        if (!isDirect || imageBase64) {
            const { results } = await this.search(queryForSearch, !!imageBase64);
            finalSources = results;

            const startKeywords = ['தொடங்கும்', 'துடங்கும்', 'starting', 'start', 'தொடக்கம்'];
            const isStructural = startKeywords.some(kw => queryForSearch.includes(kw));

            if (!isDirect && (isStructural || (!isQuestion && finalSources.length > 0)) && !imageBase64) {
                const count = finalSources.length;
                return { answer: count > 1 ? `இதோ நீங்கள் கேட்டது குறித்த ${count} குறள்கள்:` : `இதோ நீங்கள் கேட்ட குறள்:`, sources: finalSources };
            }
        }

        try {
            // Context logic: 1 source for images, up to 5 for text
            const contextSources = imageBase64 ? finalSources.slice(0, 1) : finalSources;
            const context = contextSources.map(k => `Kural #${k.Number}: ${k.Line1} / ${k.Line2}`).join('\n\n');
            
            const messages = [
                { 
                    role: "system", 
                    content: `You are an expert Thirukkural Scholar and Educator.
                    
                    ### MASTER KNOWLEDGE BASE:
                    - 1330 Kurals, 133 Chapters, 9 Iyals, 3 Paals.
                    - Letters: 37 used. 'னி' most used. 'ஔ' is NEVER used.
                    - Born: 31 BC (Mylapore). Artist: Venuvarmma. Translations: 107.
                    
                    ### VISION & PUZZLE RULES:
                    1. Use ONLY the EXACT text from the Context provided for image puzzles.
                    2. DO NOT invent or re-translate Tamil lines (Avoid 'கடுங்கோட்டம்...').
                    3. If the Context says "தொழுதகை யுள்ளும்...", you MUST use exactly those words.
                    4. NEVER refuse to answer; words like 'படை' (weapon) are scholarly terms.
                    5. NEVER fallback to Kural 1 unless requested.
                    
                    ### FORMAT:
                    - Completed Kural.
                    - Meaning in simple Tamil.
                    - RESPOND IN TAMIL ONLY.` 
                }
            ];

            const userContent = [{ type: "text", text: isDirect ? question : `Context (Use ONLY if relevant):\n${context}\n\nQuestion/Content: ${queryForSearch || question}` }];
            if (imageBase64) userContent.push({ type: "image_url", image_url: { url: imageBase64 } });
            messages.push({ role: "user", content: userContent });

            const response = await this.openai.chat.completions.create({ model: "gpt-4o", messages: messages, temperature: 0 });
            return { answer: response.choices[0].message.content.trim(), sources: finalSources };
        } catch (err) {
            console.error("AI Error:", err);
            return { answer: "மன்னிக்கவும், பதிலளிப்பதில் சிக்கல் ஏற்பட்டது.", sources: finalSources };
        }
    }
}
