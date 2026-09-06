const CHAPTER_INDEX = [
  "கடவுள் வாழ்த்து", "வான் சிறப்பு", "நீத்தார் பெருமை", "அறன் வலியுறுத்தல்", "இல் வாழ்க்கை", "வாழ்க்கைத் துணைநலம்", "மக்கள் பேறு", "அன்பு உடைமை", "விருந்து ஓம்பல்", "இனியவை கூறல்", "செய்ந்நன்றி அறிதல்", "நடுவு நிலைமை", "அடக்கம் உடைமை", "ஒழுக்கம் உடைமை", "பிறன் இல் விழையாமை", "பொறை உடைமை", "அழுக்காறாமை", "வெஃகாமை", "புறம் கூறாமை", "பயன் இல சொல்லாமை", "தீவினை அச்சம்", "ஒப்புரவு அறிதல்", "ஈகை", "புகழ்", "அருள் உடைமை", "புலால் மறுத்தல்", "தவம்", "கூடா ஒழுக்கம்", "கள்ளாமை", "வாய்மை", "வெகுளாமை", "இன்னா செய்யாமை", "கொல்லாமை", "நிலையாமை", "துறவு", "மெய் உணர்தல்", "அவா அறுத்தல்", "ஊழ்", "இறை மாட்சி", "கல்வி", "கல்லாமை", "கேள்வி", "அறிவு உடைமை", "குற்றம் கடிதல்", "பெரியோரைத் துணைக்கோடல்", "சிற்றினம் சேராமை", "தெரிந்து செயல் வகை", "வலி அறிதல்", "காலம் அறிதல்", "இடன் அறிதல்", "தெரிந்து தெளிதல்", "தெரிந்து வினையாடல்", "சுற்றம் தழால்", "பொச்சாவாமை", "செங்கோன்மை", "கொடுங்கோன்மை", "வெருவந்த செய்யாமை", "கண்ணோட்டம்", "ஒற்றாடல்", "ஊக்கம் உடைமை", "மடி இன்மை", "ஆள்வினை உடைமை", "இடுக்கண் அழியாமை", "அமைச்சு", "சொல்வன்மை", "வினைத் தூய்மை", "வினைத் திட்பம்", "வினை செயல் வகை", "தூது", "மன்னரைச் சேர்ந்து ஒழுகல்", "குறிப்பு அறிதல்", "அவை அறிதல்", "அவை அஞ்சாமை", "நாடு", "அரண்", "பொருள் செயல் வகை", "படை மாட்சி", "படைச் செருக்கு", "நட்பு", "நட்பு ஆராய்தல்", "பழைமை", "தீ நட்பு", "கூடா நட்பு", "பேதைமை", "புல்லறிவாண்மை", "இகல்", "பகை மாட்சி", "பகைத் திறம் தெளிதல்", "உட்பகை", "பெரியோரைப் பிழையாமை", "பெண்வழிச் சேறல்", "வரைவின் மகளிர்", "கள் உண்ணாமை", "சூது", "மருந்து", "குடிமை", "மானம்", "பெருமை", "சான்றாண்மை", "பண்பு உடைமை", "நன்றி இல் செல்வம்", "நாண் உடைமை", "குடி செயல் வகை", "உழவு", "நல்குரவு", "இரவு", "இரவு அச்சம்", "கயமை", "தகையணங்கு உறுத்தல்", "குறிப்பு அறிதல்", "புணர்ச்சி மகிழ்தல்", "நலம் புனைந்து உரைத்தல்", "காதல் சிறப்பு உரைத்தல்", "நாணுத் துறவு உரைத்தல்", "அலர் அறிவுறுத்தல்", "பிரிவு ஆற்றாமை", "படர் மெலிந்து இரங்கல்", "கண் விதுப்பு அழிதல்", "பசப்புறு பருவரல்", "தனிப்படர் மிகுதி", "நினைந்தவர் புலம்பல்", "கனவு நிலை உரைத்தல்", "பொழுது கண்டு இரங்கல்", "உறுப்பு நலன் அழிதல்", "நெஞ்சொடு கிளத்தல்", "நிறை அழிதல்", "அவர் வயின் விதும்பல்", "குறிப்பு அறிவுறுத்தல்", "புணர்ச்சி விதும்பல்", "நெஞ்சொடு புலத்தல்", "புலவி", "புலவி நுணுக்கம்", "ஊடல் உவகை"
];

const TRIVIA_KNOWLEDGE = {
    "இயல்": "📜 **திருக்குறள் இயல்கள் விவரம்:**\n\nதிருக்குறளில் மொத்தம் **9 இயல்கள்** உள்ளன:\n• **அறத்துப்பால் (4 இயல்கள்):** பாயிரவியல், இல்லறவியல், துறவறவியல், ஊழியல்\n• **பொருட்பால் (7 இயல்கள்):** அரசியல், அமைச்சியல், அரணியல், கூழியல், படையியல், நட்பியல், குடியியல்\n• **காமத்துப்பால் (2 இயல்கள்):** களவியல், கற்பியல்",
    "பால்": "📖 **திருக்குறள் பால்கள் விவரம்:**\n\nதிருக்குறளில் மொத்தம் **3 பால்கள்** உள்ளன:\n1. **அறத்துப்பால்:** 38 அதிகாரங்கள் (குறள் 1 - 380)\n2. **பொருட்பால்:** 70 அதிகாரங்கள் (குறள் 381 - 1080)\n3. **காமத்துப்பால்:** 25 அதிகாரங்கள் (குறள் 1081 - 1330)",
    "எழுத்து": "🔤 **திருக்குறள் எழுத்துக்கள் புள்ளிவிவரம்:**\n\n• **மொத்த எழுத்துக்கள்:** **42,194**\n• **பயன்படுத்தப்பட்ட தமிழ் எழுத்துக்கள்:** **37**\n• **அதிகம் பயன்படுத்தப்பட்ட எழுத்து:** **'னி'** (1,705 முறை)\n• **பயன்படுத்தப்படாத ஒரே உயிர் எழுத்து:** **'ஔ'**\n• **முதல் எழுத்து:** **'அ'** (குறள் 1)\n• **கடைசி எழுத்து:** **'ன்'** (குறள் 1330)",
    "சொல்": "📊 **திருக்குறள் சொல் மற்றும் சீர் புள்ளிவிவரங்கள்:**\n\n• **மொத்த சீர்கள் (Metrical Words / Seers):** **9,310 சீர்கள்** (1,330 குறள்கள் × 7 சீர்கள்)\n• **மொத்த சொற்கள் (Lexical / Grammatical Words):** **சுமார் 14,000 சொற்கள்** (சொல் புணர்ச்சிகளைப் பிரித்து இலக்கணப்படி கணக்கிடும்போது)\n• **ஒரு குறளுக்கு:** முதல் அடியில் 4 சீர்கள், இரண்டாம் அடியில் 3 சீர்கள் என மொத்தம் 7 சீர்கள்.",
    "அதிகாரம்": "🏛️ **திருக்குறள் அதிகாரங்கள்:**\n\nதிருக்குறளில் மொத்தம் **133 அதிகாரங்கள்** உள்ளன. ஒவ்வொரு அதிகாரத்திற்கும் 10 குறள்கள் வீதம் மொத்தம் **1,330 குறட்பாக்கள்** உள்ளன.",
    "குறள்": "📖 **திருக்குறள் பாடல்கள் அமைப்பு:**\n\nதிருக்குறளில் மொத்தம் **1,330 ஈரடி வெண்பாக்கள்** உள்ளன. முதல் அடியில் 4 சீர்களும், இரண்டாம் அடியில் 3 சீர்களும் என மொத்தம் 7 சீர்கள் கொண்டு அமைக்கப்பட்டவை.",
    "பெற்றோர்": "திருவள்ளுவரின் பெற்றோர் ஆதி மற்றும் பகவன் என்று நம்பப்படுகிறது.",
    "மனைவி": "திருவள்ளுவரின் மனைவி வாசுகி அம்மையார்.",
    "ஆண்டு": "திருக்குறள் முதன்முதலில் 1812-ம் ஆண்டு தஞ்சையில் அச்சிடப்பட்டது. திருவள்ளுவர் கி.மு. 31-ம் ஆண்டு பிறந்தவராகக் தமிழ்நாடு அரசால் ஏற்கப்பட்டுள்ளது.",
    "மொழிபெயர்ப்பு": "திருக்குறள் உலகளவில் 107-க்கும் மேற்பட்ட மொழிகளில் மொழிபெயர்க்கப்பட்டுள்ளது. ஆங்கிலத்தில் ஜி.யு. போப் முதன்முதலில் முழுமையாக மொழிபெயர்த்தார்.",
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

export const TRANSLITERATION_MAP = {
  'anbu': 'அன்பு',
  'anbil': 'அன்பு',
  'anbodu': 'அன்பு',
  'anbudaimai': 'அன்புடைமை',
  'aram': 'அறம்',
  'aran': 'அறம்',
  'porul': 'பொருள்',
  'inbam': 'இன்பம்',
  'kaamam': 'காமம்',
  'natpu': 'நட்பு',
  'kalvi': 'கல்வி',
  'arivu': 'அறிவு',
  'thuppu': 'துப்பு',
  'eegai': 'ஈகை',
  'pugazh': 'புகழ்',
  'arul': 'அருள்',
  'thavam': 'தவம்',
  'vaaimai': 'வாய்மை',
  'ozhukkam': 'ஒழுக்கம்',
  'porai': 'பொறை',
  'manam': 'மனம்',
  'kan': 'கண்',
  'marunthu': 'மருந்து',
  'ookkam': 'ஊக்கம்',
  'madi': 'மடி',
  'kaalam': 'காலம்',
  'irai': 'இறை',
  'pagai': 'பகை',
  'saandraanmai': 'சான்றாண்மை',
  'kayamai': 'கயமை',
  'panbu': 'பண்பு',
  'selvam': 'செல்வம்',
  'uzhavu': 'உழவு',
  'iravu': 'இரவு',
  'naan': 'நாண்',
  'thuravu': 'துறவு',
  'mei': 'மெய்',
  'avaa': 'அவா',
  'oozh': 'ஊழ்',
  'sol': 'சொல்',
  'soll': 'சொல்',
  'vinai': 'வினை',
  'vali': 'வலி',
  'sutram': 'சுற்றம்',
  'naadu': 'நாடு',
  'aran': 'அரண்',
  'padai': 'படை',
  'kadavul': 'கடவுள்',
  'mazhai': 'மழை',
  'thaai': 'தாய்',
  'thandhai': 'தந்தை',
  'illaram': 'இல்லறம்',
  'makkal': 'மக்கள்',
  'virundhu': 'விருந்து',
  'insoL': 'இன்சொல்',
  'nandri': 'நன்றி',
  'naduvu': 'நடுவு'
};

export const CONTEXTUAL_CORE_DATABASE = {
  // அன்பு (Love / Compassion / Affection)
  71: { word: 'அன்பு', meaning: 'உள்ளத்தில் அடைத்து வைக்க முடியாத, பிறர் துன்பம் கண்டு கண்ணீராகப் பொங்கி வழியும் தூய பாச உணர்வு.' },
  72: { word: 'அன்பு', meaning: 'தம் உடம்பையும் பொருளையும் பிறர்க்கு அர்ப்பணிக்கும் தன்னலமற்ற தியாகப் பண்பு (Selfless Devotion).' },
  73: { word: 'அன்பு', meaning: 'உயிரும் உடலும் கூடி வாழும் மானுடப் பிறவியின் தலையாய குறிக்கோளும் பயனாகும் வாழ்வியல் நெறி.' },
  74: { word: 'அன்பு', meaning: 'அனைவரிடமும் எல்லையற்ற உலகளாவிய நட்பையும் பாசத்தையும் உருவாக்கும் மூல வித்து.' },
  75: { word: 'அன்பு', meaning: 'இம்மை மறுமை இன்பங்களையும் பெருமைகளையும் வாரி வழங்கும் நல்வாழ்வின் அடித்தளம்.' },
  76: { word: 'அன்பு', meaning: 'அறவழியை மட்டுமல்லாமல், வீரத்தையும் தீமையை அழிக்கும் மறத்தையும் இயக்கும் உள்ளார்ந்த ஆற்றல்.' },
  77: { word: 'அன்பு', meaning: 'உயிரைக் காக்கும் எலும்பைப் போன்ற, வாழ்வின் அத்தியாவசிய ஆன்மப் பாதுகாப்பு (அன்பில்லாதவரை அறம் சுட்டு வருத்தும்).' },
  78: { word: 'அன்பு', meaning: 'மனதை வாழ வைக்கும் ஜீவ நதி — அன்பில்லாத அக வாழ்க்கை பாலைவனப் பட்டமரத்திற்கு ஒப்பானது.' },
  79: { word: 'அன்பு', meaning: 'புற உறுப்புகளுக்கு உண்மையான அழகையும் உயிரோட்டத்தையும் தரும் உள்ளத்து மெய்யுணர்வு.' },
  80: { word: 'அன்பு', meaning: 'உயிருள்ள மனித உடலை வெறும் எலும்புக் கூட்டிலிருந்து வேறுபடுத்தும் ஜீவ நாடி.' },

  // துப்பு (Rain / Sustenance / Water)
  12: { word: 'துப்பு', meaning: '1. உண்பவருக்கு உணவுப் பொருள்களை விளைவித்துத் தருதல், 2. பருகுவார்க்குத் தானே உணவாகி உதவுதல்.' },

  // அறம் (Virtue / Righteousness)
  31: { word: 'அறம்', meaning: 'மனிதனுக்குச் சிறப்பையும் உலகச் செல்வத்தையும் ஒருங்கே தரும் ஒப்பற்ற வாழ்வியல் நெறி.' },
  32: { word: 'அறம்', meaning: 'ஒருவனது ஆக்கத்திற்கு அறத்தை விடச் சிறந்ததும் இல்லை; அதை மறப்பதை விடக் கேடானதும் இல்லை.' },
  33: { word: 'அறம்', meaning: 'மனம், வாக்கு, காயம் என்னும் மூன்றாலும் இயன்றவரை இடைவிடாது செய்யப்படும் நற்செயல்கள்.' },
  34: { word: 'அறம்', meaning: 'மனதில் எவ்விதக் குற்றமும் அழுக்கும் இல்லாமல் தூய எண்ணத்தோடு வாழ்வதே தலையாய அறம்.' },
  35: { word: 'அறம்', meaning: 'அழுக்காறு (பொறாமை), அவா (பேராசை), வெகுளி (கோபம்), இன்னாச்சொல் (கடுஞ்சொல்) ஆகிய நான்கையும் நீக்கி வாழ்வது.' },

  // கல்வி (Education / True Learning)
  391: { word: 'கல்வி', meaning: 'குற்றமறக் கற்று, கற்ற கல்விக்குத் தக்கவாறு நன்னெறியில் நின்று வாழும் தூய அறிவு.' },
  392: { word: 'கல்வி', meaning: 'எண்ணும் எழுத்தும் ஆகிய இரு கண்களைப் போன்ற மனித வாழ்வின் பார்வைத்திறன்.' },
  393: { word: 'கல்வி', meaning: 'உண்மையான கண் போன்றது (கற்காதவரின் கண்கள் முகத்தில் உள்ள இரு புண்கள்).' },
  400: { word: 'கல்வி', meaning: 'ஒருவனுக்கு அழியாத ஒப்பற்ற சிறந்த செல்வம்.' },

  // நட்பு (Friendship)
  781: { word: 'நட்பு', meaning: 'அடைவதற்கு அரிய பாதுகாப்பு அரணாகவும், வினையை முடிக்கும் சிறந்த துணையாகவும் விளங்கும் உன்னத உறவு.' },
  782: { word: 'நட்பு', meaning: 'வளர்பிறை போல நாளுக்கு நாள் மேன்மேலும் வளரும் நற்பண்புடையோரின் உறவு.' },
  784: { word: 'நட்பு', meaning: 'முகம் மட்டும் மலர்வது நட்பன்று; உள்ளம் மலர்ந்து நெஞ்சார நேசிப்பதே உண்மையான நட்பு.' },
  788: { word: 'நட்பு', meaning: 'உடுக்கை இழந்தவன் கை போல, துன்பம் வந்த காலத்தில் விரைந்து சென்று உதவும் உடனடிப் பாதுகாப்பு.' },

  // ஒழுக்கம் (Discipline / Conduct)
  131: { word: 'ஒழுக்கம்', meaning: 'உயிரை விட மேலானதாகப் போற்றிக் காக்கப்பட வேண்டிய மனித மாண்பு.' },

  // வாய்மை (Truthfulness)
  291: { word: 'வாய்மை', meaning: 'மற்றவர்க்கு எள்முனையளவும் தீமை தராத நன்மையான சொற்களைப் பேசுவது.' },

  // மருந்து (Medicine / Health)
  941: { word: 'மருந்து', meaning: 'முன் உண்ட உணவு செரித்ததை அறிந்து அளவோடு உண்பதே உடலுக்கு மருந்தாகும்.' },

  // ஊக்கம் (Enthusiasm / Drive)
  591: { word: 'ஊக்கம்', meaning: 'ஒருவனுக்கு உண்மையான உடைமை உள்ளத்து ஊக்கமே; மற்ற செல்வங்கள் நிலைக்காது.' }
};

export function getContextualWordMeaning(kural, targetWord) {
  if (!kural) return null;

  let queryWord = (targetWord || "").trim();
  if (!queryWord) return null;

  // Check Transliteration
  const lowerQuery = queryWord.toLowerCase();
  if (TRANSLITERATION_MAP[lowerQuery]) {
    queryWord = TRANSLITERATION_MAP[lowerQuery];
  }

  // 1. Direct match in curated high-value database
  if (CONTEXTUAL_CORE_DATABASE[kural.Number]) {
    const entry = CONTEXTUAL_CORE_DATABASE[kural.Number];
    const entryStem = getTamilStem(entry.word);
    const queryStem = getTamilStem(queryWord);
    if (entry.word.includes(queryWord) || queryWord.includes(entry.word) || (entryStem && entryStem === queryStem)) {
      return {
        word: entry.word,
        meaning: entry.meaning,
        source: 'curated'
      };
    }
  }

  // 2. Dynamic Semantic NLP Extraction from Scholar Commentaries (mv, sp, mk)
  const normTarget = normalizeTamil(queryWord);
  const stem = getTamilStem(queryWord);

  const commentaries = [
    { author: 'mv', text: kural.mv },
    { author: 'sp', text: kural.sp },
    { author: 'mk', text: kural.mk }
  ].filter(c => c.text && typeof c.text === 'string');

  if (commentaries.length === 0 && kural.explanation) {
    return {
      word: queryWord,
      meaning: kural.explanation,
      source: 'explanation'
    };
  }

  // Find sentences/clauses containing the target word or stem
  for (const { text } of commentaries) {
    const rawClauses = text.split(/[.;!?]/).map(s => s.trim()).filter(s => s.length > 5);
    
    // Look for definition-style patterns
    for (const clause of rawClauses) {
      const normClause = normalizeTamil(clause);
      if (normClause.includes(normTarget) || (stem.length >= 2 && normClause.includes(stem))) {
        // Clean and refine the clause
        let refined = clause
          .replace(/^\((.*?)\)\s*/, '')
          .replace(/^(ஆகையால்|ஆதலால்|எனவே|ஆனால்|மேலும்|அதாவது)\s*,?\s*/i, '')
          .trim();

        if (refined.length > 15) {
          return {
            word: queryWord,
            meaning: refined,
            source: 'commentary'
          };
        }
      }
    }
  }

  // Fallback: If no single clause isolated, use the concise commentary directly
  const fallback = kural.mv || kural.sp || kural.mk || kural.Translation;
  return {
    word: queryWord,
    meaning: fallback,
    source: 'full-commentary'
  };
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

const OFF_TOPIC_RESPONSE = `🙏 **வணக்கம்!**\n\nநான் **திருக்குறள் மற்றும் திருவள்ளுவர் வாழ்வியல் நெறிகளுக்கு** மட்டுமே பதிலளிக்கும் பிரத்யேக AI ஆய்வாளர் (Thirukkural AI Scholar) ஆவேன்.\n\nகணினி நிரலாக்கம் (Coding), மென்பொருள் உருவாக்கம் அல்லது திருக்குறள் சாராத பொதுவான தலைப்புகளுக்கு என்னால் பதிலளிக்க இயலாது.\n\n✨ **என்னிடம் நீங்கள் கேட்கக்கூடியவை:**\n• திருக்குறள் மற்றும் அதிகாரங்களின் தேடல் / விளக்கம்\n• குறிப்பிட்ட சொற்களின் பொருள், தோற்றங்கள் மற்றும் பயன்பாடு\n• பரிமேலழகர், மு.வ, சாலமன் பாப்பையா, கலைஞர் உரைகள்\n• அன்பு, நட்பு, கல்வி, அறம் போன்ற வாழ்வியல் வழிகாட்டல்கள்`;

function isOffTopicQuery(query) {
    if (!query) return false;
    const q = query.toLowerCase();

    // Specific Thirukkural contextual keywords (if present, do not block unless it asks for code)
    const kuralIndicators = [
        'குறள்', 'திருக்குறள்', 'வள்ளுவர்', 'திருவள்ளுவர்', 'அதிகாரம்', 'பால்', 'இயல்', 'உரை', 
        'மு.வ', 'சாலமன்', 'கலைஞர்', 'பரிமேலழகர்', 'பொருள் விளக்கம்', 'வாழ்வியல் நெறி',
        'kural', 'thirukkural', 'valluvar', 'athigaram'
    ];
    const isKuralRelated = kuralIndicators.some(kw => q.includes(kw));

    // Explicit Coding / Programming / Software / General Off-Topic keywords
    const codingKeywords = [
        'code', 'coding', 'script', 'program', 'programming', 'software', 'developer', 'development',
        'website', 'webpage', 'app', 'application', 'function', 'algorithm', 'backend', 'frontend',
        'database', 'sql', 'api', 'json', 'html', 'css', 'javascript', 'js', 'python', 'java', 'c++', 'c#',
        'php', 'flask', 'django', 'react', 'angular', 'vue', 'node', 'nodejs', 'express', 'tailwind', 'bootstrap',
        'மலைப்பாம்பு', 'நிரல்', 'நிரலாக்கம்', 'குறியீடு', 'புரோகிராமிங்', 'இணையதள'
    ];

    const hasCodingKeyword = codingKeywords.some(kw => q.includes(kw));

    if (hasCodingKeyword) {
        return true;
    }

    if (!isKuralRelated) {
        const generalOffTopic = [
            'recipe', 'cook', 'biryani', 'movie', 'film', 'review', 'weather', 'cricket', 'football', 'match', 'score',
            'சமையல்', 'திரைப்படம்', 'வானிலை', 'விளையாட்டு'
        ];
        if (generalOffTopic.some(kw => q.includes(kw))) {
            return true;
        }
    }

    return false;
}

function sanitizeResponse(rawAnswer) {
    if (!rawAnswer) return rawAnswer;
    
    // If response contains markdown code blocks or programming syntax, reject immediately
    const codeBlockRegex = /```[\s\S]*?```/i;
    const programmingSyntaxRegex = /(?:def\s+[a-zA-Z_]|import\s+[a-zA-Z_]|from\s+[a-zA-Z_]|app\.route|public\s+class|<html|<script|console\.log|function\s*\(|var\s+[a-zA-Z_]|const\s+[a-zA-Z_]|let\s+[a-zA-Z_]|SELECT\s+.*\s+FROM)/i;

    if (codeBlockRegex.test(rawAnswer) || programmingSyntaxRegex.test(rawAnswer)) {
        return OFF_TOPIC_RESPONSE;
    }

    return rawAnswer;
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
        if (!query) return { results: [], searchTerms: [], targetWord: '' };
        
        // 1. If query is a pure number (e.g. "40", "1", "1330"), return ONLY that specific Kural
        const pureNum = parseInt(query.trim(), 10);
        if (/^\d{1,4}$/.test(query.trim()) && pureNum >= 1 && pureNum <= 1330) {
            const exactKural = this.dataset.find(k => k.Number === pureNum);
            if (exactKural) {
                return { results: [exactKural], searchTerms: [pureNum.toString()], targetWord: '' };
            }
        }

        // 2. Check if query is targeting a specific Athigaram (e.g. "அதிகாரம் 40", "chapter 40", "கல்வி")
        const athigaram = getAthigaramDetails(query, this.dataset);
        if (athigaram) {
            const enrichedChapterKurals = athigaram.kurals.map(k => {
                const ctx = getContextualWordMeaning(k, athigaram.chapterName);
                return ctx ? { ...k, contextMeaning: ctx.meaning, contextTargetWord: ctx.word } : k;
            });
            return { results: enrichedChapterKurals, searchTerms: [athigaram.chapterName], targetWord: athigaram.chapterName };
        }

        const cleanQuery = normalizeTamil(query);
        
        const startKeywords = ['தொடங்கும்', 'துடங்கும்', 'துவங்கும்', 'ஆரம்பிக்கும்', 'starting', 'start', 'starts', 'தொடக்கம்', 'துவக்கம்'];
        const endKeywords = ['முடியும்', 'ending', 'ends', 'முடிவு'];
        
        const isStartsWith = startKeywords.some(kw => cleanQuery.includes(kw));
        const isEndsWith = endKeywords.some(kw => cleanQuery.includes(kw));
        
        const allWords = cleanQuery.split(/\s+/);
        const ignoreWords = [...startKeywords, ...endKeywords, 'குறள்', 'திருக்குறள்', 'என்று', 'என', 'என்னா', 'என்னும்', 'என்ற', 'சொல்', 'வார்த்தை', 'பொருள்', 'விளக்கம்', 'என்ன', 'கூறு', 'சொல்லுங்கள்'];
        const searchTerms = allWords.filter(t => !ignoreWords.includes(t) && t.length > 1);
        const target = searchTerms[0] || allWords[0];
        const targetPhrase = searchTerms.join(' ');

        let resolvedTarget = target;
        if (target) {
            const low = target.toLowerCase();
            if (TRANSLITERATION_MAP[low]) {
                resolvedTarget = TRANSLITERATION_MAP[low];
            }
        }

        const targetStem = resolvedTarget ? getTamilStem(resolvedTarget) : '';

        const scoredResults = this.dataset.map(k => {
            let score = 0;
            const l1 = normalizeTamil(k.Line1);
            const l2 = normalizeTamil(k.Line2);
            const v = `${l1} ${l2}`;
            const words = v.split(/\s+/);

            if (isStartsWith && target) {
                const targetRoot = target.endsWith('ம்') ? target.slice(0, -1) : target;
                if (targetPhrase && l1.startsWith(targetPhrase)) {
                    score += 3000000;
                } else if (l1.startsWith(target) || words[0].startsWith(target) || (resolvedTarget && l1.startsWith(resolvedTarget))) {
                    score += 2000000;
                } else if (l1.startsWith(targetRoot) || words[0].startsWith(targetRoot)) {
                    score += 1000000;
                } else if (target.length >= 4 && (l1.startsWith(target.slice(0, 4)) || words[0].startsWith(target.slice(0, 4)))) {
                    score += 800000;
                } else if (l1.includes(target) || (resolvedTarget && l1.includes(resolvedTarget))) {
                    score += 500000;
                } else if (v.includes(target) || (resolvedTarget && v.includes(resolvedTarget))) {
                    score += 200000;
                }
            } else if (isEndsWith && target) {
                if (l2.endsWith(target) || words[words.length-1].endsWith(target) || (resolvedTarget && l2.endsWith(resolvedTarget))) score += 2000000;
                else if (l2.includes(target) || (resolvedTarget && l2.includes(resolvedTarget))) score += 500000;
            } else {
                if (resolvedTarget) {
                    if (words.some(w => normalizeTamil(w) === normalizeTamil(resolvedTarget))) score += 8000;
                    else if (v.includes(resolvedTarget)) score += 5000;
                    else if (targetStem && targetStem.length >= 2 && v.includes(targetStem)) score += 3000;
                }
                searchTerms.forEach(t => {
                    if (words.includes(t)) score += 5000;
                    else if (v.includes(t)) score += 1000;
                });
            }

            const numMatch = query.match(/\d+/);
            if (numMatch && k.Number === parseInt(numMatch[0])) score += 2000000;
            
            return { ...k, score };
        }).filter(r => r.score > 0).sort((a, b) => b.score - a.score);

        // Attach universal contextual word meaning
        const enrichedResults = scoredResults.map(k => {
            if (resolvedTarget) {
                const ctx = getContextualWordMeaning(k, resolvedTarget);
                if (ctx && ctx.meaning) {
                    return { ...k, contextMeaning: ctx.meaning, contextTargetWord: ctx.word || resolvedTarget };
                }
            }
            return k;
        });

        const finalSearchTerms = resolvedTarget ? [resolvedTarget, ...searchTerms.filter(t => t !== target && t !== resolvedTarget)] : searchTerms;

        // Unlimited results for search (single result for image searches)
        return { 
            results: isImageSearch ? enrichedResults.slice(0, 1) : enrichedResults, 
            searchTerms: finalSearchTerms,
            targetWord: resolvedTarget || target
        };
    }

    async ask(question, imageBase64 = null, isDirect = false) {
        let queryForSearch = normalizeTamil(question);

        // Step 0: Strict Domain Guardrail (Reject Off-topic & Coding Requests)
        if (isOffTopicQuery(question) || isOffTopicQuery(queryForSearch)) {
            return {
                answer: OFF_TOPIC_RESPONSE,
                sources: []
            };
        }
        
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
                const ctx = getContextualWordMeaning(kural, targetWord);
                const enrichedKural = ctx ? { ...kural, contextMeaning: ctx.meaning, contextTargetWord: ctx.word } : kural;
                let text = `📖 **குறள் எண் ${kural.Number}ல் "${targetWord}" என்ற சொல் ஆய்வு:**\n\n` +
                           `• **இக்குறளில் "${targetWord}" என்ற சொல் மொத்தம் ${count} முறை வந்துள்ளது.**\n\n` +
                           `**குறள்:**\n` +
                           `"${kural.Line1}\n${kural.Line2}"\n\n` +
                           `**இடம்பெற்றுள்ள சீர்கள்:**\n` +
                           matches.map(m => `• சீர் ${m.seerNum}: **${m.word}**`).join('\n') + `\n\n` +
                           (ctx ? `💡 **இக்குறளில் '${targetWord}' குறிப்பது:** ${ctx.meaning}\n\n` : '') +
                           `**உரை விளக்கம்:**\n${kural.mv || kural.sp || kural.mk}`;
                return {
                    answer: text,
                    sources: [enrichedKural],
                    searchTerms: [targetWord]
                };
            } else {
                return {
                    answer: `குறள் எண் ${kural.Number}ல் "${targetWord}" என்ற சொல் இடம்பெறவில்லை.\n\n**குறள் ${kural.Number}:**\n"${kural.Line1}\n${kural.Line2}"`,
                    sources: [kural],
                    searchTerms: [targetWord]
                };
            }
        }

        // Step 4: Corpus-Wide Word Frequency Query Handler (e.g. 'அறம்' என்ற சொல் திருக்குறளில் எத்தனை முறை வருகிறது?)
        const corpusFreq = getCorpusWordFrequency(question, this.dataset);
        if (corpusFreq) {
            const { targetWord, rootOccurrences, totalKurals, aramCount, porulCount, inbamCount, firstKural, lastKural, matchingKurals } = corpusFreq;
            if (rootOccurrences > 0) {
                const enrichedMatching = matchingKurals.map(k => {
                    const ctx = getContextualWordMeaning(k, targetWord);
                    return ctx ? { ...k, contextMeaning: ctx.meaning, contextTargetWord: ctx.word } : k;
                });
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
                           `இதோ இச்சொல் இடம்பெற்றுள்ள முதன்மை குறட்பாக்கள் மற்றும் அவற்றின் சூழல் பொருள்:`;
                return {
                    answer: text,
                    sources: enrichedMatching,
                    searchTerms: [targetWord]
                };
            } else {
                return {
                    answer: `திருக்குறளின் 1,330 பாடல்களில் **"${targetWord}"** என்ற சொல் எங்கும் நேரடியாகப் பயன்படுத்தப்படவில்லை.`,
                    sources: [],
                    searchTerms: [targetWord]
                };
            }
        }

        // Step 4.5: Specific Kural Number Query Handler (e.g. "40", "1", "குறள் 40", "kural 40", "40வது குறள்")
        const rawTrimmed = question.trim();
        let targetKuralNum = null;
        if (/^\d{1,4}$/.test(rawTrimmed)) {
            const n = parseInt(rawTrimmed, 10);
            if (n >= 1 && n <= 1330) targetKuralNum = n;
        } else {
            const kMatch = rawTrimmed.match(/(?:குறள்|kural|thirukkural)\s*(?:எண்|no|number|#)?\s*[:\-\s]*(\b\d{1,4}\b)/i)
                        || rawTrimmed.match(/(\b\d{1,4}\b)\s*(?:வது|ஆம்|th|st|nd|rd)?\s*(?:குறள்|kural)/i);
            if (kMatch) {
                const kn = parseInt(kMatch[1], 10);
                if (kn >= 1 && kn <= 1330) targetKuralNum = kn;
            }
        }

        if (targetKuralNum) {
            const kural = this.dataset.find(k => k.Number === targetKuralNum);
            if (kural) {
                const chNum = Math.ceil(targetKuralNum / 10);
                const chInfo = ALL_ATHIGARAMS.find(a => a.n === chNum);
                const chTitle = chInfo ? `${chInfo.name} (${chInfo.paal})` : `அதிகாரம் ${chNum}`;
                const text = `📖 **திருக்குறள் ${kural.Number} - அதிகாரம் ${chNum}: ${chTitle}**\n\n` +
                             `**"${kural.Line1}\n${kural.Line2}"**\n\n` +
                             (kural.mv ? `• **மு. வரதராசனார் உரை:** ${kural.mv}\n` : '') +
                             (kural.sp ? `• **சாலமன் பாப்பையா உரை:** ${kural.sp}\n` : '') +
                             (kural.mk ? `• **மு. கருணாநிதி உரை:** ${kural.mk}\n` : '') +
                             (kural.Translation ? `\n• **English Translation:** ${kural.Translation}\n` : '');
                return {
                    answer: text.trim(),
                    sources: [kural],
                    searchTerms: []
                };
            }
        }

        // Step 5: Specific Athigaram Query Handler (by Name, Sandhi, English, or Explicit Chapter Number)
        const athigaram = getAthigaramDetails(question, this.dataset) || getAthigaramDetails(queryForSearch, this.dataset);
        if (athigaram) {
            const enrichedKurals = athigaram.kurals.map(k => {
                const ctx = getContextualWordMeaning(k, athigaram.chapterName);
                return ctx ? { ...k, contextMeaning: ctx.meaning, contextTargetWord: ctx.word } : k;
            });
            const answer = `📜 **அதிகாரம் ${athigaram.chapterNumber}: ${athigaram.chapterName} (${athigaram.chapterEnglish})**\n\n` +
                           `• **பால்:** ${athigaram.paal} (${athigaram.paalEn})\n` +
                           `• **இயல்:** ${athigaram.iyal} (${athigaram.iyalEn})\n` +
                           `• **குறட்பாக்கள்:** குறள் ${athigaram.startKural} முதல் ${athigaram.endKural} வரை (மொத்தம் 10 குறள்கள்)\n\n` +
                           `இதோ **${athigaram.chapterName}** அதிகாரத்தின் 10 திருக்குறள்களும் அவற்றின் முழுமையான உரை விளக்கங்களும்:`;
            return {
                answer,
                sources: enrichedKurals,
                searchTerms: [athigaram.chapterName]
            };
        }

        // Step 6: Deterministic Trivia Shield
        const isCountQuery = ['எத்தனை', 'மொத்தம்', 'how many', 'total', 'count', 'யார்', 'பெயர்', 'எப்போது', 'ஆண்டு', 'who', 'when', 'what is', 'number of'].some(w => queryForSearch.includes(w));
        
        if (isCountQuery || queryForSearch.length < 30) {
            // Words / Seers count
            if ((queryForSearch.includes("சொல்") || queryForSearch.includes("சொற்கள்") || queryForSearch.includes("word") || queryForSearch.includes("words") || queryForSearch.includes("seer") || queryForSearch.includes("சீர்")) && (isCountQuery || queryForSearch.includes("all kural") || queryForSearch.includes("thirukkural") || queryForSearch.includes("total") || queryForSearch.includes("எத்தனை"))) {
                return { answer: TRIVIA_KNOWLEDGE["சொல்"], sources: [] };
            }
            // Chapters count
            if ((queryForSearch.includes("அதிகாரம்") || queryForSearch.includes("அதிகாரங்கள்") || queryForSearch.includes("chapter") || queryForSearch.includes("chapters")) && (isCountQuery || queryForSearch === "அதிகாரம்" || queryForSearch === "அதிகாரங்கள்" || queryForSearch === "chapters")) {
                return { answer: TRIVIA_KNOWLEDGE["அதிகாரம்"], sources: [] };
            }
            // Paals count
            if ((queryForSearch.includes("பால்") || queryForSearch.includes("பால்கள்") || queryForSearch.includes("paal") || queryForSearch.includes("paals") || queryForSearch.includes("section")) && (isCountQuery || queryForSearch === "பால்" || queryForSearch === "பால்கள்")) {
                return { answer: TRIVIA_KNOWLEDGE["பால்"], sources: [] };
            }
            // Iyals count
            if ((queryForSearch.includes("இயல்") || queryForSearch.includes("இயல்கள்") || queryForSearch.includes("iyal") || queryForSearch.includes("iyals")) && (isCountQuery || queryForSearch === "இயல்" || queryForSearch === "இயல்கள்")) {
                return { answer: TRIVIA_KNOWLEDGE["இயல்"], sources: [] };
            }
            // Letters count
            if ((queryForSearch.includes("எழுத்து") || queryForSearch.includes("எழுத்துக்கள்") || queryForSearch.includes("letter") || queryForSearch.includes("letters")) && (isCountQuery || queryForSearch.includes("முதல் எழுத்து") || queryForSearch === "எழுத்து" || queryForSearch.includes("total"))) {
                return { answer: TRIVIA_KNOWLEDGE["எழுத்து"], sources: [] };
            }
            // Kurals count
            if ((queryForSearch.includes("குறள்") || queryForSearch.includes("குறள்கள்") || queryForSearch.includes("kural") || queryForSearch.includes("kurals") || queryForSearch.includes("couplet") || queryForSearch.includes("verses")) && (isCountQuery || queryForSearch.includes("how many") || queryForSearch.includes("total"))) {
                return { answer: TRIVIA_KNOWLEDGE["குறள்"], sources: [] };
            }
            
            const otherTriviaKeys = [
                { key: "பெற்றோர்", match: ["பெற்றோர்", "தந்தை", "தாய்", "parents", "father", "mother"] },
                { key: "மனைவி", match: ["மனைவி", "வாசுகி", "wife"] },
                { key: "ஆண்டு", match: ["ஆண்டு", "பிறந்த", "அச்சிடப்பட்ட", "year", "born", "printed"] },
                { key: "மொழிபெயர்ப்பு", match: ["மொழிபெயர்ப்பு", "மொழிகளில்", "translation", "languages", "pope"] },
                { key: "மலர்", match: ["மலர்", "மலர்கள்", "பூ", "flower", "flowers"] },
                { key: "மரம்", match: ["மரம்", "மரங்கள்", "tree", "trees"] },
                { key: "விதை", match: ["விதை", "விதைகள்", "seed", "seeds"] },
                { key: "பழம்", match: ["பழம்", "பழங்கள்", "fruit", "fruits"] },
                { key: "தமிழ்", match: ["தமிழ் என்ற சொல்", "தமிழ் சொல்", "tamil word"] },
                { key: "கடவுள்", match: ["கடவுள் என்ற சொல்", "கடவுள் சொல்"] },
                { key: "தினம்", match: ["தினம்", "திருவள்ளுவர் தினம்", "day", "thiruvalluvar day"] }
            ];

            for (const { key, match } of otherTriviaKeys) {
                if (match.some(m => queryForSearch.includes(m))) {
                    return { answer: TRIVIA_KNOWLEDGE[key], sources: [] };
                }
            }
        }

        let finalSources = [];
        let finalSearchTerms = [];
        let finalTargetWord = '';
        const questionWords = ['என்ன', 'ஏன்', 'எப்படி', 'விளக்கம்', 'explain', 'what', 'why', 'how', '?', 'சொல்', 'கூறு'];
        const isQuestion = questionWords.some(w => queryForSearch.includes(w));

        // Semantic Search
        if (!isDirect || imageBase64) {
            const searchRes = await this.search(queryForSearch, !!imageBase64);
            finalSources = searchRes.results;
            finalSearchTerms = searchRes.searchTerms;
            finalTargetWord = searchRes.targetWord;

            const startKeywords = ['தொடங்கும்', 'துடங்கும்', 'starting', 'start', 'தொடக்கம்'];
            const isStructural = startKeywords.some(kw => queryForSearch.includes(kw));

            if (!isDirect && (isStructural || (!isQuestion && finalSources.length > 0)) && !imageBase64) {
                const count = finalSources.length;
                const topSources = finalSources.slice(0, 5);
                const hasContextWord = finalTargetWord && finalTargetWord.length > 1;

                let customAnswer = '';
                if (hasContextWord) {
                    customAnswer = `🔍 **'${finalTargetWord}' என்ற சொல்லின் வாழ்வியல் சூழல் ஆய்வு (Contextual Word Analysis):**\n\n` +
                                   `திருக்குறளில் **'${finalTargetWord}'** என்ற சொல் சூழலுக்கு ஏற்ப தனித்துவமான ஆழமான பொருளைக் குறிக்கிறது (கண்டறியப்பட்ட குறள்கள்: **${count}**):\n\n` +
                                   topSources.map(k => `• **குறள் ${k.Number}:** 💡 இக்குறளில் '${finalTargetWord}' குறிப்பது: **${k.contextMeaning || k.mv || k.sp || ''}**`).join('\n') +
                                   (count > 5 ? `\n\n*(மேலும் கீழேயுள்ள குறள் அட்டைகளில் விரிவான உரை விளக்கங்களைக் காணலாம்)*` : '');
                } else {
                    customAnswer = count > 1 
                        ? `🔍 **தேடல் முடிவுகள்:** மொத்தம் **${count} குறள்கள்** கண்டறியப்பட்டன:` 
                        : `இதோ நீங்கள் கேட்ட குறள்:`;
                }

                return { 
                    answer: customAnswer, 
                    sources: finalSources,
                    searchTerms: finalSearchTerms,
                    targetWord: finalTargetWord
                };
            }
        }

        // LLM Generative reasoning
        const isValidKey = this.openai && this.openai.apiKey?.startsWith('sk-');
        if (!isValidKey) {
            if (finalSources.length > 0) {
                const count = finalSources.length;
                const topSources = finalSources.slice(0, 5);
                const hasContextWord = finalTargetWord && finalTargetWord.length > 1;

                let customAnswer = '';
                if (hasContextWord) {
                    customAnswer = `🔍 **'${finalTargetWord}' என்ற சொல்லின் வாழ்வியல் சூழல் ஆய்வு (Contextual Word Analysis):**\n\n` +
                                   `திருக்குறளில் **'${finalTargetWord}'** என்ற சொல் சூழலுக்கு ஏற்ப தனித்துவமான ஆழமான பொருளைக் குறிக்கிறது (கண்டறியப்பட்ட குறள்கள்: **${count}**):\n\n` +
                                   topSources.map(k => `• **குறள் ${k.Number}:** 💡 இக்குறளில் '${finalTargetWord}' குறிப்பது: **${k.contextMeaning || k.mv || k.sp || ''}**`).join('\n') +
                                   (count > 5 ? `\n\n*(மேலும் கீழேயுள்ள குறள் அட்டைகளில் விரிவான உரை விளக்கங்களைக் காணலாம்)*` : '');
                } else {
                    customAnswer = count > 1 
                        ? `🔍 **தேடல் முடிவுகள்:** மொத்தம் **${count} குறள்கள்** கண்டறியப்பட்டன:` 
                        : `இதோ நீங்கள் கேட்ட குறள்:`;
                }

                return { 
                    answer: customAnswer, 
                    sources: finalSources,
                    searchTerms: finalSearchTerms,
                    targetWord: finalTargetWord
                };
            }
            return { answer: "மன்னிக்கவும், இது குறித்த குறள்கள் கிடைக்கவில்லை.", sources: [], searchTerms: [] };
        }

        try {
            const contextSources = imageBase64 ? finalSources.slice(0, 1) : finalSources;
            const context = contextSources.map(k => `Kural #${k.Number}: ${k.Line1} / ${k.Line2}\nContext Meaning of searched term: ${k.contextMeaning || k.mv}`).join('\n\n');
            
            const messages = [
                { 
                    role: "system", 
                    content: `You are an expert Thirukkural Scholar and Classical Tamil Linguistic Analyst.
                    
                    ### STRICT DOMAIN GUARDRAILS (ABSOLUTE BOUNDARY):
                    - You are EXCLUSIVELY an AI Scholar for Thirukkural, Thiruvalluvar, and classical Tamil wisdom.
                    - You MUST NEVER provide general computer programming code (such as Python, Flask, Django, HTML, JavaScript, C++, Java, React, SQL, etc.), website development tutorials, or answers to off-topic non-Thirukkural queries.
                    - If the user asks for coding, website creation, or any off-topic request, politely decline in Tamil:
                      "மன்னிக்கவும்! நான் திருக்குறள் மற்றும் திருவள்ளுவர் வாழ்வியல் ஆய்வுகளுக்கு மட்டுமே பதிலளிக்கும் பிரத்யேக AI ஆய்வாளர். கணினி நிரலாக்கம் (Coding) அல்லது பிற பொதுத் தலைப்புகளுக்கு என்னால் பதிலளிக்க இயலாது. திருக்குறள், அதிகாரங்கள், உரை விளக்கங்கள் அல்லது வாழ்வியல் நெறிகள் பற்றி ஏதேனும் கேட்க விரும்பினால் மகிழ்ச்சியுடன் உதவுகிறேன்."
                    
                    ### MASTER CORPUS KNOWLEDGE:
                    - Total 1,330 Kurals, 133 Chapters, 9 Iyals, 3 Paals (Aram: 38, Porul: 70, Inbam: 25).
                    - Total Letters: 42,194. 37 Tamil letters used. Most used letter: 'னி' (1,705). Unused vowel: 'ஔ'.
                    - Words: 14,000 total words.
                    - First letter of Thirukkural is 'அ' (Kural 1), final letter is 'ன்' (Kural 1330).
                    - Words 'தமிழ்' and 'கடவுள்' NEVER appear in the 1330 couplets directly.
                    - Born: 31 BC (Mylapore). First printed: 1812. Translations: 107 languages.
                    
                    ### CONTEXTUAL WORD MEANING REQUIREMENT:
                    - When analyzing Kurals matching a specific concept or word (e.g. அன்பு, அறம், கல்வி, துப்பு, நட்பு, etc.), explicitly explain what that word refers to / signifies in the context of EACH Kural (e.g., '💡 இக்குறளில் [சொல்] குறிப்பது: ...').
                    
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
            const rawOutput = response.choices[0].message.content.trim();
            const sanitized = sanitizeResponse(rawOutput);
            return { 
                answer: sanitized, 
                sources: sanitized === OFF_TOPIC_RESPONSE ? [] : finalSources,
                searchTerms: finalSearchTerms,
                targetWord: finalTargetWord
            };
        } catch (err) {
            console.error("AI Error:", err);
            return { answer: "மன்னிக்கவும், பதிலளிப்பதில் சிக்கல் ஏற்பட்டது.", sources: finalSources, searchTerms: finalSearchTerms };
        }
    }
}

