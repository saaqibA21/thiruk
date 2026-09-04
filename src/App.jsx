import React, { useState, useEffect, useRef, useMemo } from 'react';
import './app.css';
import { Share2, Search, Send, BookOpen, MessageSquare, Sparkles, User, BrainCircuit, Waves, Cpu, Zap, Info, Feather, Volume2, VolumeX, Play, Square, Headphones, Tag, ArrowLeft, X, Quote, Globe, Award, History as HistoryIcon, Languages, ChevronRight, ChevronLeft, Settings, Image as ImageIcon, Camera, Mic, MicOff, ExternalLink, Menu, Briefcase, Heart, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { KuralAI } from './ai-engine';
import {
   MODERN_LIFE_CATEGORIES,
   WHISPER_PROMPTS,
   getKuralLifeCategory,
   getMetreDetails,
   playTamilSpeech,
   stopTamilSpeech
} from './utils/kuralFeatures';
import { KuralImage } from './components/KuralImage';
import ShareModal from './components/ShareModal';
import { IntroVideo } from './components/IntroVideo';
import HistoryView from './components/HistoryView';
import AboutView from './components/AboutView';
import { findAthigaram, ATHIGARAMS, ALL_ATHIGARAMS } from './utils/athigaramsData.js';

const TAMIL_KEYS = [
   ['அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ'],
   ['எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ'],
   ['க', 'ங', 'ச', 'ஞ', 'ட', 'ண'],
   ['த', 'ந', 'ப', 'ம', 'ய', 'ர'],
   ['ல', 'வ', 'ழ', 'ள', 'ற', 'ன'],
   ['ஜ', 'ஷ', 'ஸ', 'ஹ', 'க்ஷ', 'ஸ்ரீ'],
   ['ா', 'ி', 'ீ', 'ு', 'ூ', 'ெ'],
   ['ே', 'ை', 'ொ', 'ோ', 'ௌ', '்', 'ஃ']
];

const ExternalResources = () => (
   <div className="external-resources-section">
      <h3>கூடுதல் ஆதாரங்கள் (External Resources)</h3>
      <div className="resources-grid">
         <a href="https://library.bjp.org/jspui/bitstream/123456789/1495/1/Thirukkural.pdf" target="_blank" rel="noopener noreferrer" className="resource-link">
            <ExternalLink size={18} />
            <span>BJP Library - Thirukkural (PDF)</span>
         </a>
         <a href="https://www.tamilvu.org/library/nationalized/pdf/59-puliyurkesigan/013.thirukuralputhiyaurai.pdf" target="_blank" rel="noopener noreferrer" className="resource-link">
            <ExternalLink size={18} />
            <span>Tamil Virtual Academy - (PDF)</span>
         </a>
         <a href="https://ta.wikipedia.org/wiki/%E0%AE%A4%E0%AE%BF%E0%AE%B0%E0%AF%81%E0%AE%95%E0%AF%8D%E0%AE%95%E0%AF%81%E0%AE%B1%E0%AE%B3%E0%AF%8D" target="_blank" rel="noopener noreferrer" className="resource-link">
            <ExternalLink size={18} />
            <span>Wikipedia - திருக்குறள்</span>
         </a>
         <a href="https://tamilvalarchithurai.tn.gov.in/wp-content/uploads/2019/03/Thirukural-2-converted-1.pdf" target="_blank" rel="noopener noreferrer" className="resource-link">
            <ExternalLink size={18} />
            <span>Tamil Valarchi Thurai - Thirukkural (PDF)</span>
         </a>
         <a href="https://www.tnpscjob.com/last-10-years-tnpsc-question-papers-with-answers-pdf/" target="_blank" rel="noopener noreferrer" className="resource-link">
            <ExternalLink size={18} />
            <span>TNPSC Job - Previous Year Q&A (PDF)</span>
         </a>
      </div>
   </div>
);

const UsageInstructions = () => (
   <div className="chat-usage-instructions">
      <div className="instruction-header"> <Info size={16} /> பயன்பாட்டு வழிமுறைகள் (Usage Tips) </div>
      <div className="instruction-list">
         <div className="instruction-item">
            <Zap size={16} className="instruction-bullet" />
            <span>ஆங்கிலத்தில் தட்டச்சு செய்து 'Space' அழுத்தினால் அது தானாகவே தமிழில் மாறும்.</span>
         </div>
         <div className="instruction-item">
            <MessageSquare size={16} className="instruction-bullet" />
            <span>கேள்விகளைத் தெளிவாகவும் பிழையின்றியும் கேட்கவும் (Be specific to avoid errors).</span>
         </div>
         <div className="instruction-item">
            <Sparkles size={16} className="instruction-bullet" />
            <span>கடினமான கேள்விகள் அல்லது படங்களை ஆய்வு செய்ய மட்டும் 'Direct AI' முறையைப் பயன்படுத்தவும்.</span>
         </div>
      </div>
   </div>
);




const PAGE_FLIP_VARIANTS = {
   enter: (dir) => ({
      x: dir > 0 ? 60 : -60,
      rotateY: dir > 0 ? 30 : -30,
      opacity: 0,
      scale: 0.96,
      transformPerspective: 1200
   }),
   center: {
      x: 0,
      rotateY: 0,
      opacity: 1,
      scale: 1,
      transformPerspective: 1200,
      transition: {
         x: { type: "spring", stiffness: 350, damping: 32 },
         rotateY: { duration: 0.35, ease: [0.25, 1, 0.5, 1] },
         opacity: { duration: 0.22 }
      }
   },
   exit: (dir) => ({
      x: dir > 0 ? -60 : 60,
      rotateY: dir > 0 ? -30 : 30,
      opacity: 0,
      scale: 0.96,
      transformPerspective: 1200,
      transition: {
         duration: 0.2
      }
   })
};

const KuralCard = ({ kural, highlight, onSelect, onPlayAudio, isPlaying, onShare }) => {
   const allWords = `${kural.Line1} ${kural.Line2}`.trim().split(/\s+/);
   const lifeCat = getKuralLifeCategory(kural.Number);

   const highlightText = (text) => {
      if (!highlight || highlight.length === 0) return text;
      let highlighted = text;
      highlight.forEach(term => {
         const regex = new RegExp(`(${term})`, 'gi');
         highlighted = highlighted.replace(regex, '<mark>$1</mark>');
      });
      return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
   };

   return (
      <div className="kural-mini-card">
         <button 
            className={`kural-audio-action ${isPlaying ? 'playing' : ''}`}
            title={isPlaying ? "நிறுத்து (Stop)" : "குறள் ஒலி வடிவம் (Listen to Kural)"}
            onClick={(e) => {
               e.stopPropagation();
               if (onPlayAudio) onPlayAudio(kural);
            }}
         >
            {isPlaying ? <Square size={14} /> : <Volume2 size={16} />}
         </button>
         <KuralImage kuralNumber={kural.Number} isThumbnail={true} />
         <div className="k-mini-info" onClick={onSelect} style={{ flex: 1, cursor: 'pointer' }}>
            <div className="k-mini-num" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <span>குறள் எண்: {kural.Number}</span>
               <span className="life-tag-badge mini">{lifeCat.icon} {lifeCat.nameEn}</span>
            </div>
            <div className="k-mini-lines">
               <p>{highlightText(allWords.slice(0, 4).join(' '))}</p>
               <p>{highlightText(allWords.slice(4).join(' '))}</p>
            </div>
         </div>
         <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button 
               className="kural-share-action"
               title="படம் மற்றும் உரையுடன் பகிரவும் (Share Kural)"
               onClick={(e) => {
                  e.stopPropagation();
                  if (onShare) onShare(kural);
               }}
            >
               <Share2 size={14} />
            </button>
            <ChevronRight className="k-mini-arrow" size={20} onClick={onSelect} style={{ cursor: 'pointer' }} />
         </div>
      </div>
   );
};

const App = () => {
   // Core Navigation & State
   const [activeTab, setActiveTab] = useState('ask');
   const [selectedPaal, setSelectedPaal] = useState(null);
   const [selectedChapter, setSelectedChapter] = useState(null);
   const [selectedTheme, setSelectedTheme] = useState(null);
   const [libraryMode, setLibraryMode] = useState('paals');
   const [selectedKural, setSelectedKural] = useState(null);
   const [playingKuralId, setPlayingKuralId] = useState(null);
   const [sharingKural, setSharingKural] = useState(null);
   const [sharingCustomImage, setSharingCustomImage] = useState(null);
   const [pageDirection, setPageDirection] = useState(1);
   const [query, setQuery] = useState('');
   const [messages, setMessages] = useState([
      { role: 'ai', content: 'வணக்கம்! நான் உங்கள் திருக்குறள் நிபுணர். திருக்குறளின் ஆழமான வாழ்வியல் நெறிகளைப் பற்றி நீங்கள் என்னிடம் உரையாடலாம்.', sources: [] }
   ]);
   const [loading, setLoading] = useState(false);
   const [initProgress, setInitProgress] = useState(0);
   const [searchQuery, setSearchQuery] = useState('');
   const [isTranslating, setIsTranslating] = useState(false);
   const [kuralData, setKuralData] = useState([]);
   const [aiEngine, setAiEngine] = useState(null);
   const [showKeyboard, setShowKeyboard] = useState(false);
   const [selectedImage, setSelectedImage] = useState(null);
   const [showMobileMenu, setShowMobileMenu] = useState(false);
   const [directAI, setDirectAI] = useState(false);
   const [isDragging, setIsDragging] = useState(false);
   const [isRecording, setIsRecording] = useState(false);
   const fileInputRef = useRef(null);
   const recognitionRef = useRef(null);
   const chatEndRef = useRef(null);
   const initRef = useRef(false);
   const lastTranslatedRef = useRef('');

   const getInitialKey = () => {
      try {
         const envKey = import.meta.env.VITE_OPENAI_API_KEY;
         if (envKey && envKey.length > 20 && envKey.startsWith('sk-')) return envKey;
      } catch (e) { }
      return '';
   };

   const [apiKey, setApiKey] = useState(getInitialKey());
   const [showSettings, setShowSettings] = useState(false);
   const [showIntro, setShowIntro] = useState(() => {
      return !sessionStorage.getItem('thirukural_intro_seen');
   });

   // Kural Modal Page Turning Navigation Handlers
   const handleNextKural = (e) => {
      if (e) e.stopPropagation();
      if (!selectedKural || !kuralData || kuralData.length === 0) return;
      const currentNum = Number(selectedKural.Number);
      const totalKurals = kuralData.length || 1330;
      if (currentNum >= totalKurals) return;
      const nextK = kuralData.find(k => Number(k.Number) === currentNum + 1);
      if (nextK) {
         if (playingKuralId) stopTamilSpeech(() => setPlayingKuralId(null));
         setPageDirection(1);
         setSelectedKural(nextK);
      }
   };

   const handlePrevKural = (e) => {
      if (e) e.stopPropagation();
      if (!selectedKural || !kuralData || kuralData.length === 0) return;
      const currentNum = Number(selectedKural.Number);
      if (currentNum <= 1) return;
      const prevK = kuralData.find(k => Number(k.Number) === currentNum - 1);
      if (prevK) {
         if (playingKuralId) stopTamilSpeech(() => setPlayingKuralId(null));
         setPageDirection(-1);
         setSelectedKural(prevK);
      }
   };

   // Keyboard Navigation (Arrow Keys)
   useEffect(() => {
      if (!selectedKural) return;
      const handleKeyDown = (e) => {
         if (e.key === 'ArrowRight') {
            handleNextKural();
         } else if (e.key === 'ArrowLeft') {
            handlePrevKural();
         }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
   }, [selectedKural, kuralData, playingKuralId]);

   // Voice Recognition Toggle
   const handleToggleVoice = () => {
      if (isRecording) {
         try {
            recognitionRef.current?.stop();
         } catch (e) { }
         setIsRecording(false);
         return;
      }

      // Stop any active TTS recitation before listening
      if (playingKuralId) {
         stopTamilSpeech(() => setPlayingKuralId(null));
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
         alert("உங்கள் உலாவியில் குரல் உள்ளீடு (Speech Recognition) ஆதரிக்கப்படவில்லை. Google Chrome, Microsoft Edge அல்லது Safari உலாவியைப் பயன்படுத்தவும்.");
         return;
      }

      try {
         if (recognitionRef.current) {
            try { recognitionRef.current.abort(); } catch (e) { }
         }

         const recognition = new SpeechRecognition();
         recognition.lang = 'ta-IN';
         recognition.continuous = true;
         recognition.interimResults = true;
         recognition.maxAlternatives = 1;

         recognition.onstart = () => {
            setIsRecording(true);
         };

         recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';
            for (let i = 0; i < event.results.length; i++) {
               const transcript = event.results[i][0]?.transcript || '';
               if (event.results[i].isFinal) {
                  finalTranscript += transcript + ' ';
               } else {
                  interimTranscript += transcript;
               }
            }
            const combined = (finalTranscript + interimTranscript).trim();
            if (combined) {
               setQuery(combined);
            }
         };

         recognition.onerror = (event) => {
            console.warn("Speech recognition notice:", event.error);
            if (event.error === 'not-allowed' || event.error === 'permission-denied') {
               alert("மைக் அனுமதி (Microphone Permission) தேவை. உங்கள் உலாவி அமைப்புகளில் மைக் அனுமதியை இயக்கிவிட்டு மீண்டும் முயற்சிக்கவும்.");
               setIsRecording(false);
            } else if (event.error === 'network') {
               console.warn("Speech recognition network error");
               setIsRecording(false);
            } else if (event.error !== 'no-speech') {
               setIsRecording(false);
            }
         };

         recognition.onend = () => {
            setIsRecording(false);
         };

         recognitionRef.current = recognition;
         recognition.start();
      } catch (err) {
         console.error("Speech Recognition initialization error:", err);
         setIsRecording(false);
      }
   };

   // Audio Toggle
   const handleToggleAudio = (kural) => {
      if (playingKuralId === kural.Number) {
         stopTamilSpeech(() => setPlayingKuralId(null));
      } else {
         setPlayingKuralId(kural.Number);
         playTamilSpeech(
            kural,
            () => setPlayingKuralId(kural.Number),
            () => setPlayingKuralId(null)
         );
      }
   };

   // Data & Neural Model Loading
   useEffect(() => {
      window.onNeuralProgress = (progress) => setInitProgress(progress);
      const loadData = async () => {
         if (initRef.current) return;
         initRef.current = true;
         try {
            const res = await fetch(`thirukkural.json?v=${Date.now()}`);
            const data = await res.json();
            setKuralData(data.kural);
            const engine = new KuralAI(data.kural);
            await engine.init(apiKey);
            setAiEngine(engine);
         } catch (err) {
            console.error(err);
            initRef.current = false;
         }
      };
      loadData();
   }, [apiKey]);

   // Real-time Phonetic Translation
   useEffect(() => {
      if (!query.trim() || isRecording) return;

      const hasEnglish = /[a-z]/i.test(query);
      const endsWithSentenceBoundary = /[.!?;]$/.test(query);
      const endsWithWordBoundary = /[\s,]$/.test(query);

      if (!hasEnglish || (!endsWithSentenceBoundary && !endsWithWordBoundary)) {
         return;
      }

      const currentQuery = query;

      const timer = setTimeout(async () => {
         if (currentQuery !== query) return;

         setIsTranslating(true);
         try {
            let translatedValue = "";

            if (endsWithSentenceBoundary) {
               const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ta&dt=t&q=${encodeURIComponent(query)}`;
               const res = await fetch(url);
               const data = await res.json();
               if (data && data[0]) {
                  translatedValue = data[0].map(item => item[0]).join('');
               }
            } else {
               const match = query.match(/([a-zA-Z]+)[\s,]$/);
               if (match) {
                  const englishWord = match[1];
                  const url = `https://inputtools.google.com/request?text=${encodeURIComponent(englishWord)}&itc=ta-t-i0-und&num=1`;
                  const res = await fetch(url);
                  const data = await res.json();
                  if (data && data[1] && data[1][0] && data[1][0][1] && data[1][0][1][0]) {
                     const tamilWord = data[1][0][1][0];
                     const trailingPunctuation = query.slice(match.index + englishWord.length);
                     const prefix = query.slice(0, match.index);
                     translatedValue = prefix + tamilWord + trailingPunctuation;
                  }
               }
            }

            if (translatedValue && translatedValue !== currentQuery) {
               setQuery(translatedValue);
            }
         } catch (err) {
            console.warn("Translation API error, falling back:", err);
         } finally {
            setIsTranslating(false);
         }
      }, 250);

      return () => clearTimeout(timer);
   }, [query]);

   const dragCounter = useRef(0);

   const processImageFile = (file) => {
      if (file && file.type && file.type.startsWith('image/')) {
         const reader = new FileReader();
         reader.onloadend = () => {
            setSelectedImage(reader.result);
         };
         reader.readAsDataURL(file);
      }
   };

   const handleImageUpload = (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
         processImageFile(file);
      }
   };

   const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
         if (items[i].type && items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            if (blob) processImageFile(blob);
         }
      }
   };

   const handleDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current++;
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
         setIsDragging(true);
      }
   };

   const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
   };

   const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current--;
      if (dragCounter.current <= 0) {
         setIsDragging(false);
         dragCounter.current = 0;
      }
   };

   const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounter.current = 0;
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
         processImageFile(files[0]);
      }
   };

   const handleAsk = async (text, imageOverride = null) => {
      if (isRecording || recognitionRef.current) {
         try { recognitionRef.current?.stop(); } catch (e) { }
         setIsRecording(false);
      }
      const currentImage = imageOverride || selectedImage;
      if (!text.trim() && !currentImage) return;
      if (!aiEngine) {
         setMessages(prev => [...prev, { role: 'ai', content: 'நிபுணர் தரவுத்தளம் இன்னும் தயாராகவில்லை. தயவுசெய்து சிறிது நேரம் காத்திருக்கவும்...', sources: [] }]);
         return;
      }

      const userMsg = {
         role: 'user',
         content: text || "",
         image: currentImage
      };

      setMessages(prev => [...prev, userMsg]);
      const currentText = text || userMsg.content;

      if (!imageOverride) {
         setQuery('');
         setSelectedImage(null);
      }
      
      setLoading(true);
      if (currentImage) setIsTranslating(true);
      try {
         const result = await aiEngine.ask(currentText, currentImage, directAI);
         if (!result) throw new Error("No response from engine");

         // If engine transcribed text from an image, we keep it in the backend but don't clutter the UI
         // if (result.transcribed) {
         //    setMessages(prev => {
         //       const newMsgs = [...prev];
         //       const lastIdx = newMsgs.length - 1;
         //       if (newMsgs[lastIdx] && newMsgs[lastIdx].role === 'user') {
         //          newMsgs[lastIdx].content = result.transcribed;
         //       }
         //       return newMsgs;
         //    });
         // }

         setMessages(prev => [...prev, { role: 'ai', content: result.answer || "இதோ உங்களுக்கான குறள்கள்:", sources: result.sources || [] }]);
      } catch (error) {
         console.error("Chat Error:", error);
         setMessages(prev => [...prev, { role: 'ai', content: "மன்னிக்கவும், பதிலைத் தேடுவதில் தொழில்நுட்பக் கோளாறு ஏற்பட்டுள்ளது. மீண்டும் ஒருமுறை முயற்சி செய்யுங்கள்.", sources: [] }]);
      } finally {
         setLoading(false);
         setIsTranslating(false);
      }
   };

   const handleKeyClick = (char) => {
      setQuery(prev => prev + char);
   };

   const parseFormattedContent = (content) => {
      if (!content || !content.trim()) return null;
      const lines = content.split('\n').filter(l => l.trim() !== '');
      if (lines.length === 0) return null;

      return lines.map((line, idx) => {
         const kuralMatch = line.match(/(?:குறள்|குறள் எண்|Kural)\s+#?(\d+)/i);
         if (kuralMatch) {
            const num = parseInt(kuralMatch[1]);
            const kural = kuralData.find(k => k.Number === num);
            if (kural) {
               return (
                  <div key={idx} className="kural-card-wrapper" style={{ margin: '0.85rem 0' }}>
                     <KuralCard
                        kural={kural}
                        onSelect={() => setSelectedKural(kural)}
                        onPlayAudio={handleToggleAudio}
                        isPlaying={playingKuralId === kural.Number}
                        onShare={(k) => setSharingKural(k)}
                     />
                  </div>
               );
            }
         }

         if (line.includes('**Tamil:**')) {
            const tamilText = line.replace('**Tamil:**', '').trim();
            const words = tamilText.split(/\s+/);
            return (
               <div key={idx} className="tamil-verse">
                  <p className="verse-line-1">{words.slice(0, 4).join(' ')}</p>
                  <p className="verse-line-2">{words.slice(4).join(' ')}</p>
               </div>
            );
         }
         if (line.includes('**Philosophical Meaning:**')) {
            return <div key={idx} className="tamil-exp"><strong>பொருள்:</strong> {line.replace('**Philosophical Meaning:**', '')}</div>;
         }
         return <p key={idx}>{line.replace(/\*\*/g, '')}</p>;
      });
   };

   const filteredKurals = useMemo(() => {
      let list = kuralData;
      if (libraryMode === 'themes') {
         if (selectedTheme) {
            list = list.filter(k => selectedTheme.chapters.includes(Math.ceil(k.Number / 10)));
         }
      } else if (libraryMode === 'paals') {
         if (selectedPaal === 'அறத்துப்பால்') list = list.filter(k => k.Number <= 380);
         else if (selectedPaal === 'பொருட்பால்') list = list.filter(k => k.Number > 380 && k.Number <= 1080);
         else if (selectedPaal === 'காமத்துப்பால்') list = list.filter(k => k.Number > 1080);
      }
      if (selectedChapter) list = list.filter(k => Math.ceil(k.Number / 10) === selectedChapter);

      const search = searchQuery.trim();
      if (!search) return list;

      const numMatch = search.match(/^\d+$/);
      if (numMatch) {
         return list.filter(k => k.Number === parseInt(numMatch[0]));
      }

      // Athigaram Name / Transliteration Search
      const matchedAthigaram = findAthigaram(search);
      if (matchedAthigaram) {
         const start = (matchedAthigaram.n - 1) * 10 + 1;
         const end = matchedAthigaram.n * 10;
         const chapterKurals = list.filter(k => k.Number >= start && k.Number <= end);
         if (chapterKurals.length > 0) return chapterKurals;
      }

      const cleanSearch = search.toLowerCase();
      return list.filter(k => 
         (k.Line1 && k.Line1.includes(search)) || 
         (k.Line2 && k.Line2.includes(search)) ||
         (k.Translation && k.Translation.toLowerCase().includes(cleanSearch)) ||
         (k.mv && k.mv.includes(search)) ||
         (k.Number.toString().includes(search))
      );
   }, [kuralData, searchQuery, selectedPaal, selectedChapter, selectedTheme, libraryMode]);

   useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

   return (
      <div className="scholarly-app">
         {/* Cinematic Fullscreen Website Intro Video */}
         {showIntro && <IntroVideo onComplete={() => setShowIntro(false)} />}

         <div className="app-heritage-background" style={{ backgroundImage: "url('valluvar_hero.jpg')" }}>
            <div className="heritage-bg-overlay"></div>
         </div>
         <header className="main-header">
            <div className="header-container-inner">
               <div className="header-left-group">
                  <img src="https://upload.wikimedia.org/wikipedia/en/7/7a/SRM_Institute_of_Science_and_Technology_Logo.svg" alt="SRM" className="srm-logo-top" />
                  <img src="mozhi_to_machine.png" alt="Mozhi to Machine" className="mozhi-logo-top" title="Mozhi to Machine" />
                  <div className="app-title-group">
                     <h1 className="main-title">திருக்குறள் AI</h1>
                     <p className="sub-title">SRM நிபுணர்</p>
                  </div>
               </div>

               <div className="header-right-group">
                   <div className="direct-ai-header-control">
                      <span className="toggle-label desktop-only">{directAI ? 'Direct AI' : 'Search AI'}</span>
                      <button
                         className={`ai-switch ${directAI ? 'on' : 'off'}`}
                         onClick={() => setDirectAI(!directAI)}
                      >
                         <div className="switch-track">
                            <div className="switch-thumb">
                               {directAI ? <Sparkles size={12} /> : <Search size={12} />}
                            </div>
                         </div>
                      </button>
                   </div>
                  {/* Desktop Nav */}
                  <nav className="header-nav-tabs desktop-only">
                     <button className={activeTab === 'ask' ? 'active' : ''} onClick={() => setActiveTab('ask')}> <Cpu size={16} /> <span>AI நிபுணர்</span> </button>
                     <button className={activeTab === 'list' ? 'active' : ''} onClick={() => setActiveTab('list')}> <BookOpen size={16} /> <span>நூலகம்</span> </button>
                     <button className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}> <HistoryIcon size={16} /> <span>வரலாறு</span> </button>
                     <button className={activeTab === 'about' ? 'active' : ''} onClick={() => setActiveTab('about')}> <Users size={16} /> <span>தமிழ் மன்றம்</span> </button>
                  </nav>

                  {/* Mobile Nav Button */}
                  <div className="mobile-menu-container">
                     <button className="mobile-menu-btn" onClick={() => setShowMobileMenu(!showMobileMenu)}>
                        <Menu size={24} />
                     </button>
                     <AnimatePresence>
                        {showMobileMenu && (
                           <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="mobile-dropdown-menu"
                           >
                              <button onClick={() => { setActiveTab('ask'); setShowMobileMenu(false); }}> <Cpu size={18} /> AI நிபுணர் </button>
                              <button onClick={() => { setActiveTab('list'); setShowMobileMenu(false); }}> <BookOpen size={18} /> நூலகம் </button>
                              <button onClick={() => { setActiveTab('history'); setShowMobileMenu(false); }}> <HistoryIcon size={18} /> வரலாறு </button>
                              <button onClick={() => { setActiveTab('about'); setShowMobileMenu(false); }}> <Users size={18} /> தமிழ் மன்றம் </button>
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
               </div>
            </div>
         </header>

         <main className="content-container">
            <AnimatePresence mode="wait">
                {activeTab === 'ask' ? (
                  <motion.div 
                    key="ask" 
                    className={`chat-view-container ${isDragging ? 'drag-over' : ''}`} 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                  >
                      <AnimatePresence>
                        {isDragging && (
                           <motion.div 
                              initial={{ opacity: 0 }} 
                              animate={{ opacity: 1 }} 
                              exit={{ opacity: 0 }}
                              className="global-drag-overlay"
                           >
                              <div className="drop-zone-box">
                                 <ImageIcon size={64} color="var(--primary)" />
                                 <h2>படத்தை இங்கே விடவும்</h2>
                                 <p>Drop your image here to analyze it with AI</p>
                              </div>
                           </motion.div>
                        )}
                     </AnimatePresence>
                     <div className="chat-view">
                        <div className="chat-window">
                           <div className="chat-messages-scroll-area">
                              {initProgress > 0 && initProgress < 100 && (
                                 <div className="init-progress-bar">
                                    <div className="p-label">ஆய்வுத் தரவுகள் தயார் செய்யப்படுகின்றன... {initProgress}%</div>
                                    <div className="p-track"> <div className="p-fill" style={{ width: `${initProgress}%` }}></div> </div>
                                 </div>
                              )}
                              <UsageInstructions />
                              <div className="whisper-chips-container">
                                 {WHISPER_PROMPTS.map((wp, i) => (
                                    <button key={i} className="whisper-chip" onClick={() => handleAsk(wp.query)}>
                                       {wp.label}
                                    </button>
                                 ))}
                              </div>
                              <AnimatePresence>
                                 {isDragging && (
                                    <motion.div 
                                       initial={{ opacity: 0, scale: 0.95 }} 
                                       animate={{ opacity: 1, scale: 1 }} 
                                       exit={{ opacity: 0, scale: 0.95 }}
                                       className="drag-drop-overlay"
                                    >
                                       <div className="drop-zone-content">
                                          <ImageIcon size={48} />
                                          <p>படத்தை இங்கே விடவும் (Drop image here)</p>
                                       </div>
                                    </motion.div>
                                 )}
                              </AnimatePresence>
                              {messages.map((m, i) => (
                                 <div key={i} className={`chat-bubble-container ${m.role}`}>
                                    <div className="chat-bubble">
                                       <div className="bubble-meta">{m.role === 'user' ? 'நீங்கள்' : 'நிபுணர்'}</div>
                                       {m.image && (
                                          <div className="chat-bubble-image">
                                             <img src={m.image} alt="Uploaded" style={{ maxWidth: '100%', borderRadius: '10px' }} />
                                          </div>
                                       )}
                                       {m.content && (
                                          <div className="bubble-text">{parseFormattedContent(m.content)}</div>
                                       )}
                                       {m.sources && m.sources.length > 0 && (
                                          <div className="kural-source-cards">
                                             {m.sources.slice(0, m.showMore ? m.sources.length : 5).map((s, idx) => (
                                                <div key={idx} className="kural-card-wrapper">
                                                   <KuralCard
                                                      kural={s}
                                                      highlight={m.searchTerms}
                                                      onSelect={() => setSelectedKural(s)}
                                                      onPlayAudio={handleToggleAudio}
                                                      isPlaying={playingKuralId === s.Number}
                                                      onShare={(k) => setSharingKural(k)}
                                                   />
                                                </div>
                                             ))}
                                             {m.sources.length > 5 && (
                                                <button
                                                   className="show-more-kurals-btn"
                                                   onClick={() => {
                                                      const newMessages = [...messages];
                                                      const msgIdx = messages.findIndex(msg => msg === m);
                                                      newMessages[msgIdx].showMore = !newMessages[msgIdx].showMore;
                                                      setMessages(newMessages);
                                                   }}
                                                >
                                                   {m.showMore ? '▲ குறைவாகக் காட்டு (Show Less)' : `▼ மேலும் ${m.sources.length - 5} குறள்களைக் காட்டு (Show More — மொத்தம் ${m.sources.length} குறள்கள்)`}
                                                </button>
                                             )}
                                          </div>
                                       )}
                                    </div>
                                 </div>
                              ))}
                              {loading && <div className="tamil-loading">நிபுணர் விளக்கம் அளிக்கிறார்...</div>}
                              <div ref={chatEndRef} style={{ height: '1px' }} />
                           </div>
                        </div>

                        <div className="chat-input-sticky-area">
                           <div className="chat-input-container-inner">
                              <AnimatePresence>
                                 {selectedImage && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="image-preview-container" style={{ position: 'absolute', bottom: '100%', left: 0, marginBottom: '1rem', background: 'white', padding: '0.5rem', borderRadius: '1rem', border: '1px solid #ddd' }}>
                                       <img src={selectedImage} alt="Preview" style={{ height: '60px', borderRadius: '8px' }} />
                                       <button onClick={() => setSelectedImage(null)} style={{ position: 'absolute', top: -10, right: -10, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer' }}>×</button>
                                    </motion.div>
                                 )}
                              </AnimatePresence>
                              {showKeyboard && (
                                 <div className="tamil-keyboard-popup">
                                    <div className="tk-grid-wrapper">
                                       {TAMIL_KEYS.map((row, i) => (
                                          <div key={i} className="tk-row">
                                             {row.map(char => (
                                                <button key={char} className="tk-key" onClick={() => handleKeyClick(char)}>{char}</button>
                                             ))}
                                          </div>
                                       ))}
                                       <div className="tk-row tk-controls">
                                          <button className="tk-key ctrl space" onClick={() => handleKeyClick(' ')}>Space</button>
                                          <button className="tk-key ctrl bs" onClick={() => setQuery(prev => prev.slice(0, -1))}>Delete</button>
                                       </div>
                                    </div>
                                 </div>
                              )}
                              <div className={`tamil-input-box-v2 ${isRecording ? 'recording-mode' : ''}`}>
                                 <button className={`kb-toggle-v2 ${showKeyboard ? 'active' : ''}`} onClick={() => setShowKeyboard(!showKeyboard)} title="தமிழ் விசைப்பலகை (Tamil Keyboard)">
                                    <Languages size={20} />
                                 </button>
                                 <button className="kb-toggle-v2" onClick={() => fileInputRef.current?.click()} title="படத்தைப் பதிவேற்றவும் (Upload Image / Puzzle)">
                                    <Camera size={20} />
                                 </button>
                                 <button 
                                    className={`kb-toggle-v2 voice-mic-btn ${isRecording ? 'recording-active' : ''}`} 
                                    onClick={handleToggleVoice}
                                    title={isRecording ? "குரல் பதிவை நிறுத்தவும் (Stop Recording)" : "குரல் மூலம் பேசவும் (Voice Message / Speech Input)"}
                                    type="button"
                                 >
                                    {isRecording ? <MicOff size={20} className="mic-recording-icon" /> : <Mic size={20} />}
                                 </button>
                                 <input
                                    type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*"
                                    onChange={handleImageUpload}
                                 />
                                 <input
                                    placeholder={isRecording ? "🎙️ பேசவும் (Listening...)" : "எதையும் கேளுங்கள்..."}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                       if (e.key === 'Enter' && !e.shiftKey) {
                                          e.preventDefault();
                                          if (isRecording || recognitionRef.current) {
                                             try { recognitionRef.current?.stop(); } catch (err) { }
                                             setIsRecording(false);
                                          }
                                          handleAsk(query);
                                       }
                                    }}
                                    onPaste={handlePaste}
                                    className={isRecording ? "input-recording-active" : ""}
                                 />
                                 <button 
                                    onClick={() => {
                                       if (isRecording || recognitionRef.current) {
                                          try { recognitionRef.current?.stop(); } catch (err) { }
                                          setIsRecording(false);
                                       }
                                       handleAsk(query);
                                    }} 
                                    disabled={loading || !aiEngine} 
                                    className="send-btn-v2" 
                                    title={!aiEngine ? "தயாராகிறது..." : "அனுப்பு"}
                                 >
                                    {isTranslating ? <div className="mini-loader"></div> : !aiEngine ? <div className="mini-loader-orange"></div> : <Send size={20} />}
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               ) : activeTab === 'list' ? (
                   <motion.div key="list" className="library-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div className="library-tab-switcher">
                         <button 
                            className={`lib-switch-btn ${libraryMode === 'paals' ? 'active' : ''}`}
                            onClick={() => { setLibraryMode('paals'); setSelectedTheme(null); setSelectedChapter(null); }}
                         >
                            <BookOpen size={16} /> பாரம்பரிய பால்கள் (3 Paals)
                         </button>
                         <button 
                            className={`lib-switch-btn ${libraryMode === 'themes' ? 'active' : ''}`}
                            onClick={() => { setLibraryMode('themes'); setSelectedPaal(null); setSelectedChapter(null); }}
                         >
                            <Sparkles size={16} /> நவீன வாழ்வியல் பிரிவுகள் (Life Themes)
                         </button>
                      </div>

                      {libraryMode === 'paals' ? (
                         !selectedPaal ? (
                            <div className="paal-cards-container">
                               <h2 className="library-main-title">திருக்குறள் நூலகம்</h2>
                               <div className="paal-cards">
                                  <div className="paal-card aram" onClick={() => { setSelectedPaal('அறத்துப்பால்'); setSelectedChapter(null); }}>
                                     <span className="orn-bl"></span> <span className="orn-br"></span>
                                     <h3>அறத்துப்பால்</h3>
                                     <p>38 அதிகாரங்கள்</p>
                                  </div>
                                  <div className="paal-card porul" onClick={() => { setSelectedPaal('பொருட்பால்'); setSelectedChapter(null); }}>
                                     <span className="orn-bl"></span> <span className="orn-br"></span>
                                     <h3>பொருட்பால்</h3>
                                     <p>70 அதிகாரங்கள்</p>
                                  </div>
                                  <div className="paal-card inbam" onClick={() => { setSelectedPaal('காமத்துப்பால்'); setSelectedChapter(null); }}>
                                     <span className="orn-bl"></span> <span className="orn-br"></span>
                                     <h3>இன்பத்துப்பால்</h3>
                                     <p>25 அதிகாரங்கள்</p>
                                  </div>
                               </div>
                            </div>
                         ) : !selectedChapter ? (
                            <div className="chapter-view">
                               <button className="tamil-back" onClick={() => { setSelectedPaal(null); setSelectedChapter(null); }}> <ArrowLeft size={16} /> Back to Paals </button>
                               <h2>{selectedPaal}</h2>
                               <div className="chapter-grid">
                                  {ATHIGARAMS.map((name, i) => {
                                     const num = i + 1;
                                     const inPaal = (selectedPaal === 'அறத்துப்பால்' && num <= 38) || (selectedPaal === 'பொருட்பால்' && num > 38 && num <= 108) || (selectedPaal === 'காமத்துப்பால்' && num > 108);
                                     return inPaal && <button key={num} className="chapter-tile" onClick={() => setSelectedChapter(num)}> <span>{num}</span> {name} </button>
                                  })}
                               </div>
                            </div>
                         ) : (
                            <div className="kural-view">
                               <button className="tamil-back" onClick={() => setSelectedChapter(null)}> <ArrowLeft size={16} /> Back </button>
                               <div className="kural-grid-stack">
                                  {filteredKurals.map(k => {
                                     const allWords = `${k.Line1} ${k.Line2}`.trim().split(/\s+/);
                                     const isPlaying = playingKuralId === k.Number;
                                     return (
                                        <div key={k.Number} className="kural-item-card" onClick={() => setSelectedKural(k)}>
                                           <div className="k-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                              <span>குறள் எண்: {k.Number}</span>
                                              <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                                 <button 
                                                    className={`kural-audio-action ${isPlaying ? 'playing' : ''}`}
                                                    onClick={(e) => { e.stopPropagation(); handleToggleAudio(k); }}
                                                    title="ஒலி வடிவம் (Listen to Kural)"
                                                 >
                                                    {isPlaying ? <Square size={13} /> : <Volume2 size={15} />}
                                                 </button>
                                                 <button 
                                                    className="kural-share-action"
                                                    onClick={(e) => { e.stopPropagation(); setSharingCustomImage(null); setSharingKural(k); }}
                                                    title="படம் மற்றும் உரையுடன் பகிரவும் (Share Kural & Image)"
                                                 >
                                                    <Share2 size={14} />
                                                 </button>
                                              </div>
                                           </div>
                                           <p>{allWords.slice(0, 4).join(' ')}</p>
                                           <p>{allWords.slice(4).join(' ')}</p>
                                        </div>
                                     );
                                  })}
                               </div>
                            </div>
                         )
                      ) : (
                         /* Modern Life Themes View */
                         !selectedTheme ? (
                            <div className="paal-cards-container">
                               <h2 className="library-main-title">நவீன வாழ்வியல் பிரிவுகள் (Modern Life Themes)</h2>
                               <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '20px' }}>
                                  திருக்குறளின் 1,330 வாழ்வியல் நெறிகளை சமகால வாழ்க்கைத் தேவைகளோடு இணைத்துப் பயிலுங்கள்.
                                </p>
                               <div className="modern-life-grid">
                                  {MODERN_LIFE_CATEGORIES.map(cat => (
                                     <div key={cat.id} className="life-category-card" onClick={() => { setSelectedTheme(cat); setSelectedChapter(null); }}>
                                        <div className="life-card-header">
                                           <span className="life-card-icon">{cat.icon}</span>
                                           <div>
                                              <h3>{cat.name}</h3>
                                              <span>{cat.nameEn}</span>
                                           </div>
                                        </div>
                                        <p className="life-card-desc">{cat.desc}</p>
                                        <div className="life-card-footer">
                                           <span>{cat.chapters.length} அதிகாரங்கள் ({cat.chapters.length * 10} குறள்கள்)</span>
                                           <ChevronRight size={16} />
                                        </div>
                                     </div>
                                  ))}
                               </div>
                            </div>
                          ) : !selectedChapter ? (
                             <div className="chapter-view">
                                <button className="tamil-back" onClick={() => { setSelectedTheme(null); setSelectedChapter(null); }}> <ArrowLeft size={16} /> Back to Themes </button>
                                <h2>{selectedTheme.icon} {selectedTheme.name} ({selectedTheme.nameEn})</h2>
                                <p style={{ color: '#64748b', marginBottom: '15px' }}>{selectedTheme.desc}</p>
                                <div className="chapter-grid">
                                   {selectedTheme.chapters.map(num => (
                                      <button key={num} className="chapter-tile" onClick={() => setSelectedChapter(num)}>
                                         <span>{num}</span> {ATHIGARAMS[num - 1]}
                                      </button>
                                   ))}
                                </div>
                             </div>
                          ) : (
                             <div className="kural-view">
                                <button className="tamil-back" onClick={() => setSelectedChapter(null)}> <ArrowLeft size={16} /> Back to Chapters </button>
                                <div className="chapter-kural-header" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                                   <span className="life-tag-badge" style={{ marginBottom: '0.5rem' }}>{selectedTheme.icon} {selectedTheme.name}</span>
                                   <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginTop: '4px' }}>அதிகாரம் {selectedChapter}: {ATHIGARAMS[selectedChapter - 1]}</h2>
                                </div>
                                <div className="kural-grid-stack">
                                   {filteredKurals.map(k => {
                                      const allWords = `${k.Line1} ${k.Line2}`.trim().split(/\s+/);
                                      const isPlaying = playingKuralId === k.Number;
                                      return (
                                         <div key={k.Number} className="kural-item-card" onClick={() => setSelectedKural(k)}>
                                            <div className="k-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                               <span>குறள் எண்: {k.Number}</span>
                                               <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                                  <button 
                                                     className={`kural-audio-action ${isPlaying ? 'playing' : ''}`}
                                                     onClick={(e) => { e.stopPropagation(); handleToggleAudio(k); }}
                                                     title="ஒலி வடிவம் (Listen to Kural)"
                                                  >
                                                     {isPlaying ? <Square size={13} /> : <Volume2 size={15} />}
                                                  </button>
                                                  <button 
                                                     className="kural-share-action"
                                                     onClick={(e) => { e.stopPropagation(); setSharingCustomImage(null); setSharingKural(k); }}
                                                     title="படம் மற்றும் உரையுடன் பகிரவும் (Share Kural & Image)"
                                                  >
                                                     <Share2 size={14} />
                                                  </button>
                                               </div>
                                            </div>
                                            <p>{allWords.slice(0, 4).join(' ')}</p>
                                            <p>{allWords.slice(4).join(' ')}</p>
                                         </div>
                                      );
                                   })}
                                </div>
                             </div>
                          )
                      )}
                   </motion.div>

                ) : activeTab === 'history' ? (
                    <motion.div key="history" className="history-view-wrapper" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                       <HistoryView 
                          onNavigatePaal={(paalName) => {
                            setActiveTab('list');
                            setSelectedPaal(paalName);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                         }}
                      />
                   </motion.div>
                ) : (
                   <motion.div key="about" className="about-view-wrapper" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <AboutView 
                         onNavigateTab={(tab) => {
                            setActiveTab(tab);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                         }}
                      />
                   </motion.div>
                )}
             </AnimatePresence>

         </main>

         <AnimatePresence>
             {selectedKural && (() => {
                const allWords = `${selectedKural.Line1} ${selectedKural.Line2}`.trim().split(/\s+/);
                const lifeCat = getKuralLifeCategory(selectedKural.Number);
                const metre = getMetreDetails(selectedKural);
                const isPlaying = playingKuralId === selectedKural.Number;
                const currentNum = Number(selectedKural.Number);
                const totalKurals = kuralData?.length || 1330;

                return (
                   <div className="tamil-modal-overlay" onClick={() => setSelectedKural(null)}>
                      <div className="tamil-modal-wrapper-with-nav" onClick={e => e.stopPropagation()}>
                         
                         {/* Floating Side Page Turn - Previous Button */}
                         <button 
                            className="modal-side-page-turn-btn prev"
                            onClick={handlePrevKural}
                            disabled={currentNum <= 1}
                            title={currentNum > 1 ? `முந்தைய குறள் ${currentNum - 1}` : "முதல் குறள்"}
                            aria-label="Previous Kural"
                         >
                            <ChevronLeft size={26} />
                            <span className="side-btn-kural-label">குறள் {Math.max(1, currentNum - 1)}</span>
                         </button>

                         {/* Floating Side Page Turn - Next Button */}
                         <button 
                            className="modal-side-page-turn-btn next"
                            onClick={handleNextKural}
                            disabled={currentNum >= totalKurals}
                            title={currentNum < totalKurals ? `அடுத்த குறள் ${currentNum + 1}` : "கடைசி குறள்"}
                            aria-label="Next Kural"
                         >
                            <ChevronRight size={26} />
                            <span className="side-btn-kural-label">குறள் {Math.min(totalKurals, currentNum + 1)}</span>
                         </button>

                         <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="tamil-modal">
                            <header className="m-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem 1.5rem 0.6rem' }}>
                               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                  <span className="m-badge">குறள் {selectedKural.Number}</span>
                                  <div className="m-header-stepper">
                                     <button onClick={handlePrevKural} disabled={currentNum <= 1} title="முந்தைய குறள்">
                                        <ChevronLeft size={16} />
                                     </button>
                                     <span>{selectedKural.Number} / {totalKurals}</span>
                                     <button onClick={handleNextKural} disabled={currentNum >= totalKurals} title="அடுத்த குறள்">
                                        <ChevronRight size={16} />
                                     </button>
                                  </div>
                                  <span className="life-tag-badge">{lifeCat.icon} {lifeCat.name}</span>
                               </div>
                               <button className="modal-close-btn" onClick={() => setSelectedKural(null)}><X /></button>
                            </header>

                            {/* Page Sheet Container with 3D Page Turn Animation */}
                            <AnimatePresence initial={false} custom={pageDirection} mode="wait">
                               <motion.div 
                                  key={selectedKural.Number} 
                                  custom={pageDirection} 
                                  variants={PAGE_FLIP_VARIANTS} 
                                  initial="enter" 
                                  animate="center" 
                                  exit="exit" 
                                  className="tamil-modal-page-sheet"
                               >
                                  {/* Audio Recitation Bar */}
                                  <div className="modal-audio-player-bar">
                                     <div className="audio-player-info">
                                        <Headphones size={20} color="#b45309" />
                                        <div>
                                           <strong style={{ fontSize: '0.9rem', color: '#78350f', display: 'block' }}>திருக்குறள் வெண்பா ஒலி வடிவம்</strong>
                                           <span style={{ fontSize: '0.75rem', color: '#92400e' }}>சீர் மற்றும் அசை நிறுத்தங்களுடன் கூடிய தூய உச்சரிப்பு</span>
                                        </div>
                                     </div>
                                     <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <button 
                                           className={`audio-play-large-btn ${isPlaying ? 'active' : ''}`}
                                           onClick={() => handleToggleAudio(selectedKural)}
                                        >
                                           {isPlaying ? <Square size={16} /> : <Volume2 size={16} />}
                                           {isPlaying ? 'நிறுத்து (Stop)' : 'கேளுங்கள் (Listen)'}
                                        </button>
                                        <button 
                                           className="modal-share-btn"
                                           onClick={() => {
                                              setSharingCustomImage(null);
                                              setSharingKural(selectedKural);
                                           }}
                                           title="படம் மற்றும் உரையுடன் பகிரவும் (Share Kural & Image)"
                                        >
                                           <Share2 size={16} />
                                           <span>பகிர் (Share)</span>
                                        </button>
                                     </div>
                                  </div>

                                  {/* Verse Display */}
                                  <div className="m-verse-box">
                                     <h3>{allWords.slice(0, 4).join(' ')}</h3>
                                     <h3>{allWords.slice(4).join(' ')}</h3>
                                  </div>

                                  {/* Kural Visual Representation Image */}
                                  <KuralImage 
                                     kuralNumber={selectedKural.Number} 
                                     title={`${allWords.join(' ')} - ${selectedKural.mv || selectedKural.Translation || ''}`} 
                                     onShare={(imgSrc) => {
                                        setSharingCustomImage(imgSrc);
                                        setSharingKural(selectedKural);
                                     }}
                                  />

                                  {/* Explanations Stack */}
                                  <div className="m-explanations-stack">
                                     {selectedKural.mv && <div className="e-block"> <h5>மு. வரதராசனார் உரை</h5> <p>{selectedKural.mv}</p> </div>}
                                     {selectedKural.sp && <div className="e-block"> <h5>சாலமன் பாப்பையா உரை</h5> <p>{selectedKural.sp}</p> </div>}
                                     {selectedKural.mk && <div className="e-block"> <h5>மு. கருணாநிதி உரை</h5> <p>{selectedKural.mk}</p> </div>}
                                  </div>

                                  {/* Bottom Page Turn Navigation Bar */}
                                  <div className="modal-bottom-page-turn-bar">
                                     <button 
                                        className="bottom-turn-btn prev"
                                        onClick={handlePrevKural}
                                        disabled={currentNum <= 1}
                                     >
                                        <ChevronLeft size={18} />
                                        <span>முந்தைய குறள்</span>
                                     </button>
                                     <span className="bottom-page-indicator">
                                        📖 குறள் {selectedKural.Number} / {totalKurals}
                                     </span>
                                     <button 
                                        className="bottom-turn-btn next"
                                        onClick={handleNextKural}
                                        disabled={currentNum >= totalKurals}
                                     >
                                        <span>அடுத்த குறள்</span>
                                        <ChevronRight size={18} />
                                     </button>
                                  </div>

                               </motion.div>
                            </AnimatePresence>
                         </motion.div>
                      </div>
                   </div>
                );
             })()}
          </AnimatePresence>

         {/* Kural Share Card Modal */}
         <AnimatePresence>
            {sharingKural && (
               <ShareModal 
                  kural={sharingKural} 
                  customImageUrl={sharingCustomImage} 
                  onClose={() => {
                     setSharingKural(null);
                     setSharingCustomImage(null);
                  }} 
               />
            )}
         </AnimatePresence>
      </div>
   );
};


export default App;
