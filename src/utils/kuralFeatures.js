/**
 * Thirukkural Audio Recitation, Metre/Seer Guide, and Modern Life Categories
 */

// Modern Life Application Themes
export const MODERN_LIFE_CATEGORIES = [
  {
    id: 'business',
    name: 'தொழில் & வணிக மேலாண்மை',
    nameEn: 'Business & Management',
    icon: '💼',
    desc: 'திட்டமிடல், செயல் திறன், மனிதவளம், தொழில் முனைவு மற்றும் விடாமுயற்சி',
    chapters: [47, 48, 49, 50, 51, 52, 60, 61, 62, 63, 67, 68, 76]
  },
  {
    id: 'mental_health',
    name: 'மன அமைதி & மன அழுத்தம் தவிர்த்தல்',
    nameEn: 'Mental Peace & Stress Relief',
    icon: '🧘',
    desc: 'பொறுமை, கோபமின்மை, ஆசையறுத்தல், மன அமைதி மற்றும் துன்பம் வெல்லுதல்',
    chapters: [16, 31, 32, 34, 35, 36, 37, 63]
  },
  {
    id: 'leadership',
    name: 'தலைமைப் பண்பு & ஆளுமை',
    nameEn: 'Leadership & Governance',
    icon: '🏛️',
    desc: 'வழிகாட்டுதல், முடிவெடுத்தல், சொல்லாற்றல், நடுவுநிலைமை மற்றும் நிர்வாக நெறி',
    chapters: [12, 39, 44, 45, 54, 55, 64, 65, 66]
  },
  {
    id: 'friendship',
    name: 'நட்பு & மனித உறவுகள்',
    nameEn: 'Friendship & Relationships',
    icon: '🤝',
    desc: 'உண்மையான நட்பு, நற்பண்பு, பிறருக்கு உதவுதல் மற்றும் விருந்தோம்பல்',
    chapters: [8, 9, 22, 79, 80, 81, 82, 99, 100]
  },
  {
    id: 'parenting',
    name: 'குடும்பம் & பெற்றோர் வழிகாட்டல்',
    nameEn: 'Family & Parenting',
    icon: '👨‍👩‍👧',
    desc: 'இனிய இல்லறம், நன்மக்களை வளர்த்தல் மற்றும் வாழ்க்கைத்துணை நலம்',
    chapters: [5, 6, 7, 10, 15]
  },
  {
    id: 'education',
    name: 'கல்வி & அறிவுடைமை',
    nameEn: 'Education & Wisdom',
    icon: '🎓',
    desc: 'கற்றல், கேள்வியறிவு, பகுத்தறிவு மற்றும் அறியாமை நீக்குதல்',
    chapters: [40, 41, 42, 43, 85]
  },
  {
    id: 'finance',
    name: 'நிதி மேலாண்மை & செல்வம்',
    nameEn: 'Finance & Wealth Creation',
    icon: '💰',
    desc: 'நேர்மையான வழியில் செல்வம் ஈட்டுதல், ஈகை மற்றும் சேமிப்பு',
    chapters: [23, 76, 101, 103, 104]
  },
  {
    id: 'ethics',
    name: 'ஒழுக்கம் & சுய கட்டுப்பாடு',
    nameEn: 'Ethics & Self-Discipline',
    icon: '🛡️',
    desc: 'வாய்மை, கள்ளாமை, தவம், நேர்மை மற்றும் இன்னா செய்யாமை',
    chapters: [1, 2, 3, 4, 14, 29, 30, 33]
  },
  {
    id: 'love',
    name: 'காதல் & உணர்வுகள்',
    nameEn: 'Love & Romance',
    icon: '❤️',
    desc: 'களவியல் மற்றும் கற்பியல் சார்ந்த தூய காதல் மற்றும் பாச உணர்வுகள்',
    chapters: [109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133]
  }
];

// Quick conversation starter chips on Chat Hero
export const WHISPER_PROMPTS = [
  { label: '💼 வணிக மேலாண்மை (Business)', query: 'வணிக மேலாண்மை மற்றும் தொழில் வெற்றி குறித்து திருக்குறள் கூறுவது என்ன?' },
  { label: '🧘 மன அமைதி (Stress Relief)', query: 'மன அழுத்தம் மற்றும் கோபத்தைக் கட்டுப்படுத்த திருக்குறள் தரும் அறிவுரை என்ன?' },
  { label: '🏛️ தலைமைப் பண்பு (Leadership)', query: 'ஒரு சிறந்த தலைவனுக்கு இருக்க வேண்டிய முக்கிய தகுதிகள் யாவை?' },
  { label: '🤝 நட்பு & உறவுகள் (Friendship)', query: 'நல்ல நட்பு மற்றும் துரோகம் குறித்து திருக்குறள் என்ன கூறுகிறது?' },
  { label: '🎓 கல்வி & அறிவு (Education)', query: 'கல்வியின் பெருமை மற்றும் அறிவுடைமை பற்றி விளக்குக.' },
  { label: '💰 நிதி மேலாண்மை (Wealth)', query: 'செல்வம் ஈட்டுதல் மற்றும் சேமிப்பு குறித்து திருக்குறள் நெறி என்ன?' }
];

export const getKuralLifeCategory = (kuralNumber) => {
  const chapterNum = Math.ceil(kuralNumber / 10);
  for (const cat of MODERN_LIFE_CATEGORIES) {
    if (cat.chapters.includes(chapterNum)) {
      return cat;
    }
  }
  return MODERN_LIFE_CATEGORIES[7]; // default to Ethics
};

// Metre & Seer Analysis
export const getMetreDetails = (kural) => {
  if (!kural) return { line1Seers: [], line2Seers: [], endingVaipaadu: 'மலர்', seerCount: 7 };
  const allWords = `${kural.Line1} ${kural.Line2}`.trim().split(/\s+/);
  const line1Seers = allWords.slice(0, 4);
  const line2Seers = allWords.slice(4);
  
  const lastWord = line2Seers[line2Seers.length - 1] || '';
  let endingVaipaadu = 'மலர்';
  if (lastWord.endsWith('கு') || lastWord.endsWith('டு') || lastWord.endsWith('து') || lastWord.endsWith('பு') || lastWord.endsWith('று') || lastWord.endsWith('சு')) {
    endingVaipaadu = 'காசு / பிறப்பு (நேர்பு / நிரைபு)';
  } else if (lastWord.length <= 3) {
    endingVaipaadu = 'நாள் (நேரசை)';
  } else {
    endingVaipaadu = 'மலர் (நிரையசை)';
  }

  return {
    line1Seers,
    line2Seers,
    seerCount: allWords.length,
    endingVaipaadu,
    line1Text: line1Seers.join('  •  '),
    line2Text: line2Seers.join('  •  ')
  };
};

// Web Speech API and High-Fidelity Tamil Audio Recitation Engine
let activeUtterances = [];
let activeAudio = null;
let activeTimer = null;

export const playTamilSpeech = (kural, onStart, onEnd) => {
  stopTamilSpeech();

  if (!kural || !kural.Line1 || !kural.Line2) {
    if (onEnd) onEnd();
    return;
  }

  const allWords = `${kural.Line1} ${kural.Line2}`.trim().split(/\s+/);
  const line1 = allWords.slice(0, 4).join(' ');
  const line2 = allWords.slice(4).join(' ');

  const hasSpeechSynthesis = typeof window !== 'undefined' && 'speechSynthesis' in window;
  let tamilVoice = null;
  if (hasSpeechSynthesis) {
    const voices = window.speechSynthesis.getVoices() || [];
    tamilVoice = voices.find(v => (v.lang && v.lang.toLowerCase().startsWith('ta')) || (v.name && v.name.toLowerCase().includes('tamil')));
  }

  // 1. If an authentic native Tamil voice is found in browser, use SpeechSynthesis
  if (hasSpeechSynthesis && tamilVoice) {
    const utterance1 = new SpeechSynthesisUtterance(line1);
    const utterance2 = new SpeechSynthesisUtterance(line2);

    utterance1.voice = tamilVoice;
    utterance2.voice = tamilVoice;
    utterance1.lang = 'ta-IN';
    utterance2.lang = 'ta-IN';
    utterance1.rate = 0.82; // Classical metre pace
    utterance2.rate = 0.82;
    utterance1.pitch = 1.0;
    utterance2.pitch = 1.0;

    if (onStart) onStart();

    utterance1.onend = () => {
      activeTimer = setTimeout(() => {
        if (activeUtterances.length > 0) {
          window.speechSynthesis.speak(utterance2);
        }
      }, 450);
    };

    utterance2.onend = () => {
      activeUtterances = [];
      if (onEnd) onEnd();
    };

    utterance1.onerror = () => {
      activeUtterances = [];
      if (onEnd) onEnd();
    };
    utterance2.onerror = () => {
      activeUtterances = [];
      if (onEnd) onEnd();
    };

    activeUtterances = [utterance1, utterance2];
    window.speechSynthesis.speak(utterance1);
    return;
  }

  // 2. High-Fidelity Authentic Tamil Audio Stream (via Google Tamil TTS Audio)
  try {
    const fullText = `${line1} , ${line2}`;
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(fullText)}&tl=ta&client=tw-ob`;
    
    const audio = new Audio(ttsUrl);
    activeAudio = audio;

    audio.onplay = () => {
      if (onStart) onStart();
    };

    audio.onended = () => {
      activeAudio = null;
      if (onEnd) onEnd();
    };

    audio.onerror = () => {
      activeAudio = null;
      if (hasSpeechSynthesis) {
        const fallbackUtt = new SpeechSynthesisUtterance(`${line1}. ${line2}`);
        fallbackUtt.lang = 'ta-IN';
        fallbackUtt.rate = 0.82;
        fallbackUtt.onend = () => { activeUtterances = []; if (onEnd) onEnd(); };
        fallbackUtt.onerror = () => { activeUtterances = []; if (onEnd) onEnd(); };
        activeUtterances = [fallbackUtt];
        window.speechSynthesis.speak(fallbackUtt);
      } else {
        if (onEnd) onEnd();
      }
    };

    audio.play().catch(() => {
      if (hasSpeechSynthesis) {
        const fallbackUtt = new SpeechSynthesisUtterance(`${line1}. ${line2}`);
        fallbackUtt.lang = 'ta-IN';
        fallbackUtt.rate = 0.82;
        fallbackUtt.onend = () => { activeUtterances = []; if (onEnd) onEnd(); };
        fallbackUtt.onerror = () => { activeUtterances = []; if (onEnd) onEnd(); };
        activeUtterances = [fallbackUtt];
        window.speechSynthesis.speak(fallbackUtt);
      } else {
        if (onEnd) onEnd();
      }
    });
  } catch (err) {
    if (onEnd) onEnd();
  }
};

export const stopTamilSpeech = (onStop) => {
  if (activeTimer) {
    clearTimeout(activeTimer);
    activeTimer = null;
  }
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  activeUtterances = [];
  if (onStop) onStop();
};

// Kural Artwork Images (Supports all 1,330 Kurals with graceful fallback)
export const hasKuralImage = (kuralNumber) => {
  const num = Number(kuralNumber);
  return num >= 1 && num <= 1330;
};

// Targeted Image URL Generator (Checks thiruk_image and kural_images directories for WebP and JPG)
export const getCandidateImageUrls = (kuralNumber) => {
  const num = Number(kuralNumber);
  if (!num || num < 1 || num > 1330) return [];
  const rawBase = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) || '/';
  const base = rawBase.endsWith('/') ? rawBase : (rawBase + '/');
  return [
    `${base}kural_images/${num}.webp`,
    `${base}kural_images/${num}.jpg`,
    `${base}thiruk_image/${num}.webp`,
    `${base}thiruk_image/${num}.jpg`
  ];
};
