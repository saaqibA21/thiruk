const CHAPTER_INDEX = [
  "கடவுள் வாழ்த்து", "வான் சிறப்பு", "நீத்தார் பெருமை", "அறன் வலியுறுத்தல்", "இல் வாழ்க்கை", "வாழ்க்கைத் துணைநலம்", "மக்கள் பேறு", "அன்பு உடைமை", "விருந்து ஓம்பல்", "இனியவை கூறல்", "செய்ந்நன்றி அறிதல்", "நடுவு நிலைமை", "அடக்கம் உடைமை", "ஒழுக்கம் உடைமை", "பிறன் இல் விழையாமை", "பொறை உடைமை", "அழுக்காறாமை", "வெஃகாமை", "புறம் கூறாமை", "பயன் இல சொல்லாமை", "தீவினை அச்சம்", "ஒப்புரவு அறிதல்", "ஈகை", "புகழ்", "அருள் உடைமை", "புலால் மறுத்தல்", "தவம்", "கூடா ஒழுக்கம்", "கள்ளாமை", "வாய்மை", "வெகுளாமை", "இன்னா செய்யாமை", "கொல்லாமை", "நிலையாமை", "துறவு", "மெய் உணர்தல்", "அவா அறுத்தல்", "ஊழ்", "இறை மாட்சி", "கல்வி", "கல்லாமை", "கேள்வி", "அறிவு உடைமை", "குற்றம் கடிதல்", "பெரியோரைத் துணைக்கோடல்", "சிற்றினம் சேராமை", "தெரிந்து செயல் வகை", "வலி அறிதல்", "காலம் அறிதல்", "இடன் அறிதல்", "தெரிந்து தெளிதல்", "தெரிந்து வினையாடல்", "சுற்றம் தழால்", "பொச்சாவாமை", "செங்கோன்மை", "கொடுங்கோன்மை", "வெருவந்த செய்யாமை", "கண்ணோட்டம்", "ஒற்றாடல்", "ஊக்கம் உடைமை", "மடி இன்மை", "ஆள்வினை உடைமை", "இடுக்கண் அழியாமை", "அமைச்சு", "சொல்வன்மை", "வினைத் தூய்மை", "வினைத் திட்பம்", "வினை செயல் வகை", "தூது", "மன்னரைச் சேர்ந்து ஒழுகல்", "குறிப்பு அறிதல்", "அவை அறிதல்", "அவை அஞ்சாமை", "நாடு", "அரண்", "பொருள் செயல் வகை", "படை மாட்சி", "படைச் செருக்கு", "நட்பு", "நட்பு ஆராய்தல்", "பழைமை", "தீ நட்பு", "கூடா நட்பு", "பேதைமை", "புல்லறிவாண்மை", "இகல்", "பகை மாட்சி", "பகைத் திறம் தெளிதல்", "உட்பகை", "பெரியோரைப் பிழையாமை", "பெண்வழிச் சேறல்", "வரைவின் மகளிர்", "கள் உண்ணாமை", "சூது", "மருந்து", "குடிமை", "மானம்", "பெருமை", "சான்றாண்மை", "பண்பு உடைமை", "நன்றி இல் செல்வம்", "நாண் உடைமை", "குடி செயல் வகை", "உழவு", "நல்குரவு", "இரவு", "இரவு அச்சம்", "கயமை", "தகையணங்கு உறுத்தல்", "குறிப்பு அறிதல்", "புணர்ச்சி மகிழ்தல்", "நலம் புனைந்து உரைத்தல்", "காதல் சிறப்பு உரைத்தல்", "நாணுத் துறவு உரைத்தல்", "அலர் அறிவுறுத்தல்", "பிரிவு ஆற்றாமை", "படர் மெலிந்து இரங்கல்", "கண் விதுப்பு அழிதல்", "பசப்புறு பருவரல்", "தனிப்படர் மிகுதி", "நினைந்தவர் புலம்பல்", "கனவு நிலை உரைத்தல்", "பொழுது கண்டு இரங்கல்", "உறுப்பு நலன் அழிதல்", "நெஞ்சொடு கிளத்தல்", "நிறை அழிதல்", "அவர் வயின் விதும்பல்", "குறிப்பு அறிவுறுத்தல்", "புணர்ச்சி விதும்பல்", "நெஞ்சொடு புலத்தல்", "புலவி", "புலவி நுணுக்கம்", "ஊடல் உவகை"
];

const TRIVIA_KNOWLEDGE = {
    "இயல்": "திருக்குறளில் மொத்தம் 9 இயல்கள் உள்ளன. (அறத்துப்பால்-4, பொருட்பால்-7, இன்பத்துப்பால்-2).",
    "பால்": "திருக்குறளில் மொத்தம் 3 பால்கள் உள்ளன. அவை: 1. அறத்துப்பால் (38 அதிகாரங்கள், 380 குறள்கள்), 2. பொருட்பால் (70 அதிகாரங்கள், 700 குறள்கள்), 3. காமத்துப்பால் (25 அதிகாரங்கள், 250 குறள்கள்).",
    "எழுத்து": "திருக்குறளில் உள்ள மொத்த எழுத்துக்கள்: 42,194. பயன்படுத்தப்பட்ட தமிழ் எழுத்துக்கள்: 37. அதிகம் பயன்படுத்தப்பட்ட எழுத்து 'னி' (1,705 முறை). பயன்படுத்தப்படாத உயிர் எழுத்து 'ஔ'.",
    "சொல்": "திருக்குறளில் உள்ள மொத்த சொற்கள்: 14,000.",
    "அதிகாரம்": "திருக்குறளில் மொத்தம் 133 அதிகாரங்கள் உள்ளன. ஒவ்வொரு அதிகாரத்திற்கும் 10 குறள்கள் வீதம் மொத்தம் 1,330 குறட்பாக்கள்.",
    "குறள்": "திருக்குறளில் மொத்தம் 1,330 ஈரடி வெண்பாக்கள் உள்ளன. முதல் அடியில் 4 சீர்களும், இரண்டாம் அடியில் 3 சீர்களும் என மொத்தம் 7 சீர்கள் உள்ளன.",
    "பெற்றோர்": "திருவள்ளுவரின் பெற்றோர் ஆதி மற்றும் பகவன் என்று நம்பப்படுகிறது.",
    "மனைவி": "திருவள்ளுவரின் மனைவி வாசுகி அம்மையார்.",
    "ஆண்டு": "திருக்குறள் முதன்முதலில் 1812-ம் ஆண்டு தஞ்சையில் அச்சிடப்பட்டது. திருவள்ளுவர் கி.மு. 31-ம் ஆண்டு பிறந்தவராகக் கருதப்படுகிறது.",
    "மொழிபெயர்ப்பு": "திருக்குறள் 107-க்கும் மேற்பட்ட உலக மொழிகளில் மொழிபெயர்க்கப்பட்டுள்ளது. ஆங்கிலத்தில் ஜி.யு. போப் முதன்முதலில் முழுமையாக மொழிபெயர்த்தார்.",
    "மலர்": "திருக்குறளில் இடம்பெற்றுள்ள மலர்கள்: அனிச்சம் மற்றும் குவளை.",
    "மரம்": "திருக்குறளில் இடம்பெற்றுள்ள மரங்கள்: பனை மற்றும் மூங்கில்.",
    "விதை": "திருக்குறளில் இடம்பெற்றுள்ள விதை: குன்றிமணி.",
    "பழம்": "திருக்குறளில் இடம்பெற்றுள்ள பழம்: நெருஞ்சிப்பழம்.",
    "தமிழ்": "'தமிழ்' என்ற சொல் திருக்குறளின் 1,330 பாடல்களுக்குள் எங்கும் பயன்படுத்தப்படவில்லை.",
    "கடவுள்": "'கடவுள்' என்ற சொல் திருக்குறள் பாடல்களுக்குள் இல்லை; அதிகாரத் தலைப்பில் மட்டுமே உள்ளது.",
    "தினம்": "திருவள்ளுவர் தினம் ஒவ்வோர் ஆண்டும் தை மாதம் 2-ம் நாள் (ஜனவரி 15 அல்லது 16) கொண்டாடப்படுகிறது.",
    "முதல்": "திருக்குறளின் முதல் குறள் 'அ' என்ற எழுத்தில் தொடங்குகிறது ('அகர முதல எழுத்தெல்லாம்...').",
    "கடைசி": "திருக்குறளின் கடைசி குறள் (1330) 'ன்' என்ற மெய்யெழுத்தில் முடிகிறது ('ஊடுதல் காமத்திற்கு இன்பம்...')."
};

import OpenAI from 'openai';
import { findAthigaram, ALL_ATHIGARAMS } from './utils/athigaramsData.js';

// Unicode-aware Tamil stemmer and normalizer
export function normalizeTamil(text) {
  return (text || "").normalize('NFC').toLowerCase().replace(/[.,!?;:"\-_…·'`"“”‘’\s]+/g, ' ').trim();
}

export function getTamilStem(word) {
  let w = normalizeTamil(word);
  // Strip common Tamil nominal/verbal inflection suffixes & case markers
  w = w.replace(/(?:ங்களை|ங்கள்|த்தின்|த்தில்|த்தோடு|த்த|ுக்கு|ிற்கு|ற்கு|க்கு|ோடு|ுடன்|ஆல்|இல்|இன்|ஐ|ம்|ன்|ு|்)$/, '');
  return w;
}

// 1. Specific Athigaram Lookup (Exact, sandhi, English/Tamil by name or number)
export function getAthigaramDetails(query, dataset) {
    if (!query || !dataset) return null;
    const athigaram = findAthigaram(query);
    if (!athigaram) return null;

    const start = (athigaram.n - 1) * 10 + 1;
    const end = athigaram.n * 10;
    const kurals = dataset.filter(k => k.Number >= start && k.Number <= end);

    return {
        chapterNumber: athigaram.n,
        chapterName: athigaram.name,
        chapterEnglish: athigaram.en,
        transliteration: athigaram.trans,
        paal: athigaram.paal,
        paalEn: athigaram.paalEn,
        iyal: athigaram.iyal,
        iyalEn: athigaram.iyalEn,
        startKural: start,
        endKural: end,
        kurals: kurals
    };
}

// 2. Exact Word Count in a Specific Kural (e.g. குறள் 12ல் 'துப்பு' எத்தனை முறை வந்துள்ளது?)
export function getKuralWordOccurrences(query, dataset) {
  if (!query || !dataset) return null;
  const clean = normalizeTamil(query);

  const kuralMatch = clean.match(/(?:குறள்|kural|verse)\s*[:\-\s]*(\d+)/i) || clean.match(/(\d+)\s*(?:வது|ஆம்)?\s*(?:குறள்|kural)/i);
  if (!kuralMatch) return null;

  const isCountQuery = ['எத்தனை', 'முறை', 'count', 'times', 'occur', 'appear'].some(w => clean.includes(w));
  if (!isCountQuery) return null;

  const kuralNum = parseInt(kuralMatch[1], 10);
  if (kuralNum < 1 || kuralNum > 1330) return null;

  const kural = dataset.find(k => k.Number === kuralNum);
  if (!kural) return null;

  let targetWord = '';
  const quotedMatch = query.match(/['"“‘](.*?)['"”’]/);
  if (quotedMatch && quotedMatch[1].trim()) {
    targetWord = quotedMatch[1].trim();
  } else {
    // Extract word token before 'என்ற சொல்' or 'எத்தனை'
    const wordPattern = clean.match(/([^\s]+)\s*(?:என்ற\s*சொல்|சொல்|வார்த்தை|எத்தனை)/);
    if (wordPattern && wordPattern[1] && !wordPattern[1].includes('குறள்') && !wordPattern[1].match(/^\d+$/)) {
      targetWord = wordPattern[1];
    }
  }

  if (!targetWord || targetWord.length < 2) return null;

  const normTarget = normalizeTamil(targetWord);
  const stem = getTamilStem(targetWord);
  const seers = `${kural.Line1} ${kural.Line2}`.trim().split(/\s+/);
  
  const matches = [];
  seers.forEach((seer, idx) => {
    const normSeer = normalizeTamil(seer);
    if (normSeer.includes(normTarget) || (stem.length >= 2 && normSeer.includes(stem))) {
      matches.push({ seerNum: idx + 1, word: seer });
    }
  });

  return {
    kural,
    targetWord,
    count: matches.length,
    matches,
    explanation: kural.mv || kural.sp || kural.mk
  };
}

// 3. Exact Word Frequency in Entire Thirukkural Corpus (e.g. 'அறம்' என்ற சொல் திருக்குறளில் மொத்தம் எத்தனை முறை வருகிறது?)
export function getCorpusWordFrequency(query, dataset) {
  if (!query || !dataset) return null;
  const clean = normalizeTamil(query);

  const isCorpusQuery = ['திருக்குறளில்', 'மொத்தம்', 'முழுவதும்', 'எல்லா', 'முழுக்க', 'entire', 'whole', 'total', 'all'].some(w => clean.includes(w));
  const isCountQuery = ['எத்தனை முறை', 'எத்தனை', 'முறை', 'times', 'occur', 'appear', 'count', 'frequency', 'எத்தனை குறள்'].some(w => clean.includes(w));

  if (!isCountQuery && !isCorpusQuery) return null;

  let targetWord = '';
  const quotedMatch = query.match(/['"“‘](.*?)['"”’]/);
  if (quotedMatch && quotedMatch[1].trim()) {
    targetWord = quotedMatch[1].trim();
  } else {
    const match = clean.match(/(?:சொல்|வார்த்தை|word)?\s*['"“‘]?([^\s]+)['"”’]?\s*(?:என்ற\s*சொல்|என்ற\s*வார்த்தை|சொல்|எத்தனை\s*முறை|எத்தனை)/);
    if (match && match[1] && !['திருக்குறளில்', 'குறள்', 'மொத்தம்', 'எத்தனை', 'முழுவதும்'].includes(match[1])) {
      targetWord = match[1];
    }
  }

  if (!targetWord || targetWord.length < 2) return null;

  const normTarget = normalizeTamil(targetWord);
  const stem = getTamilStem(targetWord);

  let exactWordCount = 0;
  let rootOccurrences = 0;
  const matchingKurals = [];
  let aramCount = 0, porulCount = 0, inbamCount = 0;

  for (const k of dataset) {
    const seers = `${k.Line1} ${k.Line2}`.trim().split(/\s+/);
    let countInKural = 0;
    const kuralMatches = [];

    for (const s of seers) {
      const ns = normalizeTamil(s);
      if (ns === normTarget || ns.startsWith(normTarget)) {
        exactWordCount++;
      }
      if (ns.includes(normTarget) || (stem.length >= 2 && ns.includes(stem))) {
        countInKural++;
        rootOccurrences++;
        kuralMatches.push(s);
      }
    }

    if (countInKural > 0) {
      if (k.Number <= 380) aramCount++;
      else if (k.Number <= 1080) porulCount++;
      else inbamCount++;
      matchingKurals.push({ ...k, matchCount: countInKural, matchedWords: kuralMatches });
    }
  }

  if (rootOccurrences === 0 && !isCorpusQuery) return null;

  return {
    targetWord,
    stem,
    exactWordCount,
    rootOccurrences,
    totalKurals: matchingKurals.length,
    aramCount,
    porulCount,
    inbamCount,
    firstKural: matchingKurals[0],
    lastKural: matchingKurals[matchingKurals.length - 1],
    matchingKurals: matchingKurals.slice(0, 10)
  };
}

// 4. Same Word in Different Meanings (சொல் பின்வரு நிலையணி / சிலேடை)
export function getPolysemyKurals(query, dataset) {
  if (!query) return null;
  const clean = normalizeTamil(query);

  const polysemyKeywords = [
    'ஒரே சொல்', 'ஒரே வார்த்தை', 'வெவ்வேறு பொருள்', 'வெவ்வேறு பொருளில்',
    'பல பொருள்', 'பின்வரு நிலையணி', 'சொல் பின்வரு நிலையணி', 'பொருள்பின்வரு',
    'same word', 'different meaning', 'different meanings', 'multiple meanings',
    'homonym', 'polysemy'
  ];

  const isPolysemy = polysemyKeywords.some(kw => clean.includes(kw));
  if (!isPolysemy) return null;

  const POLYSEMY_MASTER = [
    {
      kuralNumber: 12,
      word: "துப்பு (5 முறை)",
      figureOfSpeech: "சொல் பின்வரு நிலையணி",
      meaningBreakdown: [
        "1. துப்பார்க்குத் = உண்பவருக்கு (உணவு உண்பவர்)",
        "2. துப்பாய = நல்ல / நன்மையான சுவைமிக்க உணவு",
        "3. துப்பாக்கித் = உணவுப் பொருள்களை உற்பத்தி செய்து உண்டாக்கி",
        "4. துப்பார்க்குத் = உண்பவர்களுக்கு",
        "5. துப்பாய = தானும் ஓர் உணவாகிப் பயன்படுவது மழை"
      ]
    },
    {
      kuralNumber: 350,
      word: "பற்று (6 முறை)",
      figureOfSpeech: "சொல் பின்வரு நிலையணி",
      meaningBreakdown: [
        "1. பற்றுக = பற்றிக்கொள்க (இறுகப் பிடி)",
        "2. பற்றற்றான் = எதிலும் பற்று (ஆசை) இல்லாத இறைவன்",
        "3. பற்றினை = அவனது திருவருள் பற்றை",
        "4. அப்பற்றைப் பற்றுக = அந்தப் பற்றை உறுதியாகப் பிடித்துக்கொள்க",
        "5. பற்று விடற்கு = உலகப் பற்றுக்களையும் ஆசைகளையும் விடுவதற்காக"
      ]
    },
    {
      kuralNumber: 642,
      word: "ஆக்கம், கேடு, சொல்",
      figureOfSpeech: "சொற்பொருள் பின்வரு நிலையணி",
      meaningBreakdown: [
        "ஒருவரது சொல்லால் ஆக்கமும் (நன்மையும்), சொல்லாலேயே கேடும் (தீமையும்) உண்டாகும் என்பதால், பேசும் சொல்லில் சோர்வு ஏற்படாமல் காக்க வேண்டும்."
      ]
    },
    {
      kuralNumber: 1007,
      word: "செல்வம்",
      figureOfSpeech: "சொற்பொருள் பின்வரு நிலையணி",
      meaningBreakdown: [
        "வறியவருக்கு கொடுத்து உதவாதவனுடைய செல்வம், பேரழகி ஒருத்தி எவரையும் மணக்காமல் தனியே வாழ்ந்து முதுமையடைவது போன்றது."
      ]
    }
  ];

  const matched = POLYSEMY_MASTER.map(item => {
    const k = dataset.find(dk => dk.Number === item.kuralNumber);
    return { ...k, ...item };
  }).filter(Boolean);

  return matched;
}

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
        
        // Check if query is targeting a specific Athigaram
        const athigaram = getAthigaramDetails(query, this.dataset);
        if (athigaram) {
            return { results: athigaram.kurals, searchTerms: [athigaram.chapterName] };
        }

        const cleanQuery = normalizeTamil(query);
        
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
            const l1 = normalizeTamil(k.Line1);
            const l2 = normalizeTamil(k.Line2);
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
        let queryForSearch = normalizeTamil(question);
        
        // Step 1: If image only, perform quick OCR to get text for grounding
        if (imageBase64 && queryForSearch.length < 5 && this.openai) {
            try {
                const ocr = await this.openai.chat.completions.create({
                    model: "gpt-4o",
                    messages: [{ role: "user", content: [{ type: "text", text: "Transcribe ONLY the Tamil text from this image. No other text." }, { type: "image_url", image_url: { url: imageBase64 } }] }],
                    max_tokens: 100
                });
                queryForSearch = normalizeTamil(ocr.choices[0].message.content.trim());
            } catch (e) { console.error("OCR Error:", e); }
        }

        // Step 2: Polysemy / Same Word Different Meanings Query Handler
        const polysemyList = getPolysemyKurals(question, this.dataset);
        if (polysemyList && polysemyList.length > 0) {
            let polysemyText = `✨ **ஒரே சொல் வெவ்வேறு பொருள்களில் வரும் புகழ்பெற்ற குறள்கள் (சொல் பின்வரு நிலையணி):**\n\n`;
            polysemyList.forEach(item => {
                polysemyText += `📖 **குறள் ${item.Number} (${item.figureOfSpeech}):**\n` +
                                `**"${item.Line1}\n${item.Line2}"**\n` +
                                `• **பயன்படுத்தப்பட்ட சொல்:** ${item.word}\n` +
                                `• **பொருள் விளக்கம்:**\n` +
                                item.meaningBreakdown.map(m => `  ${m}`).join('\n') + `\n\n`;
            });
            return {
                answer: polysemyText.trim(),
                sources: polysemyList
            };
        }

        // Step 3: Specific Kural Word Occurrence Handler (e.g. குறள் 12ல் 'துப்பு' எத்தனை முறை வந்துள்ளது?)
        const kuralWordOcc = getKuralWordOccurrences(question, this.dataset);
        if (kuralWordOcc) {
            const { kural, targetWord, count, matches } = kuralWordOcc;
            if (count > 0) {
                let text = `📖 **குறள் எண் ${kural.Number}ல் "${targetWord}" என்ற சொல் ஆய்வு:**\n\n` +
                           `• **இக்குறளில் "${targetWord}" என்ற சொல் மொத்தம் ${count} முறை வந்துள்ளது.**\n\n` +
                           `**குறள்:**\n` +
                           `"${kural.Line1}\n${kural.Line2}"\n\n` +
                           `**இடம்பெற்றுள்ள சீர்கள்:**\n` +
                           matches.map(m => `• சீர் ${m.seerNum}: **${m.word}**`).join('\n') + `\n\n` +
                           `**உரை விளக்கம்:**\n${kural.mv || kural.sp || kural.mk}`;
                return {
                    answer: text,
                    sources: [kural]
                };
            } else {
                return {
                    answer: `குறள் எண் ${kural.Number}ல் "${targetWord}" என்ற சொல் இடம்பெறவில்லை.\n\n**குறள் ${kural.Number}:**\n"${kural.Line1}\n${kural.Line2}"`,
                    sources: [kural]
                };
            }
        }

        // Step 4: Corpus-Wide Word Frequency Query Handler (e.g. 'அறம்' என்ற சொல் திருக்குறளில் எத்தனை முறை வருகிறது?)
        const corpusFreq = getCorpusWordFrequency(question, this.dataset);
        if (corpusFreq) {
            const { targetWord, rootOccurrences, totalKurals, aramCount, porulCount, inbamCount, firstKural, lastKural, matchingKurals } = corpusFreq;
            if (rootOccurrences > 0) {
                let text = `📊 **திருக்குறள் சொல் பயன்பாட்டு ஆய்வு (Corpus Frequency Analysis):**\n\n` +
                           `• **ஆய்வு செய்யப்பட்ட சொல்:** "${targetWord}"\n` +
                           `• **திருக்குறளில் மொத்தம் வந்துள்ள எண்ணிக்கை:** **${rootOccurrences} முறை**\n` +
                           `• **இடம்பெற்றுள்ள மொத்த குறட்பாக்கள்:** **${totalKurals} குறள்கள்**\n\n` +
                           `**பால் வாரியான பகுப்பாய்வு:**\n` +
                           `• அறத்துப்பால்: **${aramCount} குறள்கள்**\n` +
                           `• பொருட்பால்: **${porulCount} குறள்கள்**\n` +
                           `• காமத்துப்பால்: **${inbamCount} குறள்கள்**\n\n` +
                           (firstKural ? `• **முதல் தோற்றம்:** குறள் ${firstKural.Number} ("${firstKural.Line1}...")\n` : '') +
                           (lastKural ? `• **இறுதித் தோற்றம்:** குறள் ${lastKural.Number} ("${lastKural.Line1}...")\n\n` : '\n') +
                           `இதோ இச்சொல் இடம்பெற்றுள்ள முதன்மை குறட்பாக்கள்:`;
                return {
                    answer: text,
                    sources: matchingKurals
                };
            } else {
                return {
                    answer: `திருக்குறளின் 1,330 பாடல்களில் **"${targetWord}"** என்ற சொல் எங்கும் நேரடியாகப் பயன்படுத்தப்படவில்லை.`,
                    sources: []
                };
            }
        }

        // Step 5: Specific Athigaram Query Handler (by Name, Sandhi, English, or Number)
        const athigaram = getAthigaramDetails(question, this.dataset) || getAthigaramDetails(queryForSearch, this.dataset);
        if (athigaram) {
            const answer = `📜 **அதிகாரம் ${athigaram.chapterNumber}: ${athigaram.chapterName} (${athigaram.chapterEnglish})**\n\n` +
                           `• **பால்:** ${athigaram.paal} (${athigaram.paalEn})\n` +
                           `• **இயல்:** ${athigaram.iyal} (${athigaram.iyalEn})\n` +
                           `• **குறட்பாக்கள்:** குறள் ${athigaram.startKural} முதல் ${athigaram.endKural} வரை (மொத்தம் 10 குறள்கள்)\n\n` +
                           `இதோ **${athigaram.chapterName}** அதிகாரத்தின் 10 திருக்குறள்களும் அவற்றின் முழுமையான உரை விளக்கங்களும்:`;
            return {
                answer,
                sources: athigaram.kurals
            };
        }

        // Step 6: Deterministic Trivia Shield
        const isCountQuery = ['எத்தனை', 'மொத்தம்', 'how many', 'total', 'count', 'யார்', 'பெயர்', 'எப்போது', 'ஆண்டு'].some(w => queryForSearch.includes(w));
        
        if (isCountQuery || queryForSearch.length < 15) {
            if ((queryForSearch.includes("அதிகாரம்") || queryForSearch.includes("அதிகாரங்கள்")) && (isCountQuery || queryForSearch === "அதிகாரம்" || queryForSearch === "அதிகாரங்கள்")) {
                return { answer: TRIVIA_KNOWLEDGE["அதிகாரம்"], sources: [] };
            }
            if ((queryForSearch.includes("பால்") || queryForSearch.includes("பால்கள்")) && (isCountQuery || queryForSearch === "பால்" || queryForSearch === "பால்கள்")) {
                return { answer: TRIVIA_KNOWLEDGE["பால்"], sources: [] };
            }
            if ((queryForSearch.includes("இயல்") || queryForSearch.includes("இயல்கள்")) && (isCountQuery || queryForSearch === "இயல்" || queryForSearch === "இயல்கள்")) {
                return { answer: TRIVIA_KNOWLEDGE["இயல்"], sources: [] };
            }
            if ((queryForSearch.includes("எழுத்து") || queryForSearch.includes("எழுத்துக்கள்")) && (isCountQuery || queryForSearch.includes("முதல் எழுத்து") || queryForSearch === "எழுத்து")) {
                return { answer: TRIVIA_KNOWLEDGE["எழுத்து"], sources: [] };
            }
            if ((queryForSearch.includes("சொல்") || queryForSearch.includes("சொற்கள்")) && isCountQuery) {
                return { answer: TRIVIA_KNOWLEDGE["சொல்"], sources: [] };
            }
            
            const otherTriviaKeys = ["பெற்றோர்", "மனைவி", "ஆண்டு", "மொழிபெயர்ப்பு", "மலர்", "மரம்", "விதை", "பழம்", "தமிழ்", "கடவுள்", "தினம்", "முதல்", "கடைசி"];
            for (const key of otherTriviaKeys) {
                if (queryForSearch.includes(key)) {
                    return { answer: TRIVIA_KNOWLEDGE[key], sources: [] };
                }
            }
        }

        let finalSources = [];
        const questionWords = ['என்ன', 'ஏன்', 'எப்படி', 'விளக்கம்', 'explain', 'what', 'why', 'how', '?', 'சொல்', 'கூறு'];
        const isQuestion = questionWords.some(w => queryForSearch.includes(w));

        // Semantic Search
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

        // LLM Generative reasoning
        const isValidKey = this.openai && this.openai.apiKey?.startsWith('sk-');
        if (!isValidKey) {
            if (finalSources.length > 0) {
                return { answer: `இதோ தொடர்புடைய ${finalSources.length} குறள்கள்:`, sources: finalSources };
            }
            return { answer: "மன்னிக்கவும், இது குறித்த குறள்கள் கிடைக்கவில்லை.", sources: [] };
        }

        try {
            const contextSources = imageBase64 ? finalSources.slice(0, 1) : finalSources;
            const context = contextSources.map(k => `Kural #${k.Number}: ${k.Line1} / ${k.Line2}`).join('\n\n');
            
            const messages = [
                { 
                    role: "system", 
                    content: `You are an expert Thirukkural Scholar and Linguistic Analyst.
                    
                    ### MASTER CORPUS KNOWLEDGE:
                    - Total 1,330 Kurals, 133 Chapters, 9 Iyals, 3 Paals (Aram: 38, Porul: 70, Inbam: 25).
                    - Total Letters: 42,194. 37 Tamil letters used. Most used letter: 'னி' (1,705). Unused vowel: 'ஔ'.
                    - Words: 14,000 total words.
                    - First letter of Thirukkural is 'அ' (Kural 1), final letter is 'ன்' (Kural 1330).
                    - Words 'தமிழ்' and 'கடவுள்' NEVER appear in the 1330 couplets directly.
                    - Born: 31 BC (Mylapore). First printed: 1812. Translations: 107 languages.
                    
                    ### VERIFICATION RULES:
                    1. Never hallucinate or invent word occurrence counts. Calculate exact facts.
                    2. Use ONLY exact classical Thirukkural texts and authenticated scholar commentaries (Mu. Va, Solomon Pappaiah, M. Karunanidhi).
                    3. RESPOND IN CLEAR, SCHOLARLY TAMIL.` 
                }
            ];

            const userContent = [{ type: "text", text: isDirect ? question : `Context:\n${context}\n\nUser Question: ${question}` }];
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

