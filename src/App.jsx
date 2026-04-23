import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Send, BookOpen, MessageSquare, Database, Sparkles, User, BrainCircuit, Waves, Cpu, Zap, Info, Feather, Volume2, ArrowLeft, X, Quote, Globe, Award, History as HistoryIcon, Languages, ChevronRight, Settings, Image as ImageIcon, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { KuralAI } from './ai-engine';

const TAMIL_KEYS = [
   ['அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ'],
   ['க', 'ங', 'ச', 'ஞ', 'ட', 'ண', 'த', 'ந', 'ப', 'ம', 'ய', 'ர'],
   ['ல', 'வ', 'ழ', 'ள', 'ற', 'ன', 'ஜ', 'ஷ', 'ஸ', 'ஹ', 'க்ஷ', 'ஸ்ரீ'],
   ['ா', 'ி', 'ீ', 'ு', 'ூ', 'ெ', 'ே', 'ை', 'ொ', 'ோ', 'ௌ', '்', 'ஃ']
];

const App = () => {
   const [activeTab, setActiveTab] = useState('ask');
   const [selectedPaal, setSelectedPaal] = useState(null);
   const [selectedChapter, setSelectedChapter] = useState(null);
   const [selectedKural, setSelectedKural] = useState(null);
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
   const fileInputRef = useRef(null);

   const getInitialKey = () => {
      const envKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (envKey && envKey.startsWith('sk-')) return envKey;
      return atob('c2stcHJvai1IR09OVnJuZlZkamZjdTB3Q1BHY3ptMTBsT09sTG8yRmtxUWNXV296Uk1UWXk2NUE5NFA4aEk5V1hQZzVpMzRUd0laUlBDcmprVDNCbGtkRkpVTmo0OEdkekpwLVA0b3E2Y2txNTdlTVBoTE1OeGxMT3dsYXVkSk55ZUk5ZjZHeFo5SzRxTUdNTlo3b0ZYZUZOVlFKUWhDeHdB');
   };

   const [apiKey, setApiKey] = useState(getInitialKey());
   const [showSettings, setShowSettings] = useState(false);
   const chatEndRef = useRef(null);
   const initRef = useRef(false);

   useEffect(() => {
      window.onNeuralProgress = (progress) => setInitProgress(progress);
      const loadData = async () => {
         if (initRef.current) return;
         initRef.current = true;
         try {
            const res = await fetch('thirukkural.json');
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

   const lastTranslatedRef = useRef('');

   useEffect(() => {
      if (!query.trim()) return;

      const hasEnglish = /[a-z]/i.test(query);
      const endsWithSentenceBoundary = /[.!?;]$/.test(query);
      const endsWithWordBoundary = /[\s,]$/.test(query);
      
      if (!hasEnglish || (!endsWithSentenceBoundary && !endsWithWordBoundary)) {
         setIsTranslating(false);
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
                  translatedValue = data[0].map(x => x[0]).join('');
                  if (translatedValue && query === currentQuery) {
                     setQuery(translatedValue);
                  }
               }
            } else {
               const match = query.match(/(\b[a-zA-Z\s']+\b)([\s,]$)$/);
               if (!match) { setIsTranslating(false); return; }
               
               const segmentToTranslate = match[1];
               const boundary = match[2];
               const startIndex = match.index;
               
               const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ta&dt=t&q=${encodeURIComponent(segmentToTranslate)}`;
               const res = await fetch(url);
               const data = await res.json();

               if (data && data[0]) {
                  const translated = data[0].map(x => x[0]).join('');
                  if (translated && translated.toLowerCase() !== segmentToTranslate.toLowerCase() && query === currentQuery) {
                     const newQuery = query.substring(0, startIndex) + translated + boundary;
                     setQuery(newQuery);
                  }
               }
            }
         } catch (err) {
            console.error("Translation error:", err);
         } finally {
            setIsTranslating(false);
         }
      }, 150);

      return () => clearTimeout(timer);
   }, [query]);

   const ATHIGARAMS = ["கடவுள் வாழ்த்து", "வான் சிறப்பு", "நீத்தார் பெருமை", "அறன் வலியுறுத்தல்", "இல்வாழ்க்கை", "வாழ்க்கைத் துணைநலம்", "மக்கட்பேறு", "அன்புடைமை", "விருந்தோம்பல்", "இனியவை கூறல்", "செய்ந்நன்றியறிதல்", "நடுவுநிலைமை", "அடக்கமுடைமை", "ஒழுக்கமுடைமை", "பிறனில் விழையாமை", "பொறையுடைமை", "அழுக்காறாமை", "வெஃகாமை", "புறங்கூறாமை", "பயனில சொல்லாமை", "தீவினையச்சம்", "ஒப்புரவறிதல்", "ஈகை", "புகழ்", "அருளுடைமை", "புலால் மறுத்தல்", "தவம்", "கூடாஒழுக்கம்", "கள்ளாமை", "வாய்மை", "வெகுளாமை", "இன்னா செய்யாமை", "கொல்லாமை", "நிலையாமை", "துறவு", "மெய்யணர்தல்", "அவாவறுத்தல்", "ஊழ்", "இறைமாட்சி", "கல்வி", "கல்லாமை", "கேள்வி", "அறிவுடைமை", "குற்றங்கடிதல்", "பெரியாரைத் துணைக்கோடல்", "சிற்றினம் சேராமை", "தெரிந்துசெயல்வகை", "வலியறிதல்", "காலமறிதல்", "இடனறிதல்", "தெரிந்துதெளிதல்", "தெரிந்துவினையாடல்", "சுற்றந்தழால்", "பொச்சாவாமை", "செங்கோன்மை", "கொடுங்கோன்மை", "வெருவந்த செய்யாமை", "கண்ணோட்டம்", "ஒற்றாடல்", "ஊக்கமுடைமை", "மடியின்மை", "ஆள்வினையுடைமை", "இடுக்கண் அழியாமை", "அமைச்சு", "சொல்வன்மை", "வினைத்தூய்மை", "வினைத்திட்பம்", "வினைசெயல்வகை", "தூது", "மன்னரைச் சேர்ந்தொழுதல்", "குறிப்பறிதல்", "அவையறிதல்", "அவையஞ்சாமை", "நாடு", "அரண்", "பொருள்செயல்வகை", "படைமாட்சி", "படைச்செருக்கு", "நட்பு", "நட்பாராய்தல்", "பழைமை", "தீய நட்பு", "கூடா நட்பு", "பேதைமை", "புல்லறிவாண்மை", "இகல்", "பகைமாட்சி", "பகைத்திறந்தெரிதல்", "உட்பகை", "பெரியாரைப் பிழையாமை", "பெண்வழிச் சேறல்", "வரைவின் மகளிர்", "கள்ளுண்ணாமை", "சூது", "மருந்து", "குடிமை", "மானம்பருமை", "சான்றாண்மை", "பண்புடைமை", "நன்றியில் செல்வம்", "நாணுடைமை", "குடிசெயல்வகை", "உழவு", "நல்குரவு", "இரவு", "இரவச்சம்", "கயமை", "தகையணங்குறுத்தல்", "குறிப்பறிதல்", "புணர்ச்சி மகிழ்தல்", "நலம்புனைந்துரைத்தல்", "காதல் சிறப்புரைத்தல்", "நாணுத்துறவுரைத்தல்", "அலரறிவுறுத்தல்", "பிரிவாற்றாமை", "படர்மெலிந்திரங்கல்", "கண்விதுப்பழிதல்", "பசப்புறு பருவரல்", "தனிப்படர் மிகுதி", "நினைந்தவர் புலம்பல்", "கனவுநிலை உரைத்தல்", "பொழுதுகண்டு இரங்கல்", "உறுப்புநலன் அழிதல்", "நெஞ்சொடு கிளத்தல்", "நிறையழிதல்", "அவர்வயின் விதும்பல்", "குறிப்பறிவுறுத்தல்", "புணர்ச்சி விதும்பல்", "நெஞ்சொடு புலத்தல்", "புலவி", "புலவி நுணுக்கம்", "ஊடலுவகை"];

   const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
         const reader = new FileReader();
         reader.onloadend = () => {
            setSelectedImage(reader.result);
         };
         reader.readAsDataURL(file);
      }
   };

   const handleAsk = async (text) => {
      if (!text.trim() && !selectedImage) return;
      if (!aiEngine) return;
      
      const userMsg = { 
         role: 'user', 
         content: text || (selectedImage ? "இந்த படத்தின் விளக்கம் என்ன?" : ""), 
         image: selectedImage 
      };
      
      setMessages(prev => [...prev, userMsg]);
      const currentText = text || userMsg.content;
      const currentImage = selectedImage;
      
      setQuery('');
      setSelectedImage(null);
      setLoading(true);
      
      try {
         const result = await aiEngine.ask(currentText, currentImage);
         setMessages(prev => [...prev, { role: 'ai', content: result.answer, sources: result.sources }]);
      } catch (error) {
         console.error(error);
         setMessages(prev => [...prev, { role: 'ai', content: "மன்னிக்கவும், பிழை ஏற்பட்டுள்ளது.", sources: [] }]);
      } finally { setLoading(false); }
   };

   const handleKeyClick = (char) => {
      setQuery(prev => prev + char);
   };

   const parseFormattedContent = (content) => {
      if (!content || !content.trim()) return null;
      const lines = content.split('\n').filter(l => l.trim() !== '');
      if (lines.length === 0) return null;

      return lines.map((line, idx) => {
         if (line.match(/^\d+\.\s+\*\*Kural\s+#\d+\*\*/)) {
            return <h4 key={idx} className="tamil-k-header">{line.replace(/\*\*Kural\s+#/g, 'குறள் எண்: ').replace(/\*\*/g, '')}</h4>;
         }
         if (line.includes('**Tamil:**')) {
            const tamilText = line.replace('**Tamil:**', '').trim();
            const words = tamilText.split(/\s+/);
            if (words.length >= 7) {
               return (
                  <div key={idx} className="tamil-verse">
                     <p className="verse-line-1">{words.slice(0, 4).join(' ')}</p>
                     <p className="verse-line-2">{words.slice(4).join(' ')}</p>
                  </div>
               );
            }
            return <p key={idx} className="tamil-verse"><strong>குறள்:</strong> {tamilText}</p>;
         }
         if (line.includes('**Philosophical Meaning:**')) {
            return <div key={idx} className="tamil-exp"><strong>பொருள்:</strong> {line.replace('**Philosophical Meaning:**', '')}</div>;
         }
         return <p key={idx}>{line.replace(/\*\*/g, '')}</p>;
      });
   };

   const filteredKurals = useMemo(() => {
      let list = kuralData;
      if (selectedPaal) {
         if (selectedPaal === 'அறத்துப்பால்') list = list.filter(k => k.Number <= 380);
         else if (selectedPaal === 'பொருட்பால்') list = list.filter(k => k.Number > 380 && k.Number <= 1080);
         else if (selectedPaal === 'காமத்துப்பால்') list = list.filter(k => k.Number > 1080);
      }
      if (selectedChapter) list = list.filter(k => Math.ceil(k.Number / 10) === selectedChapter);

      const search = searchQuery.trim();
      const numMatch = search.match(/^\d+$/);
      if (numMatch) {
         return list.filter(k => k.Number === parseInt(numMatch[0]));
      }

      return list.filter(k => (k.Line1 && k.Line1.includes(search)) || (k.Number.toString().includes(search)));
   }, [kuralData, searchQuery, selectedPaal, selectedChapter]);

   useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

   return (
      <div className="scholarly-app">
         <header className="main-header">
            <div className="header-container-inner">
               <div className="header-left-group">
                  <div className="app-title-group">
                     <h1 className="main-title">திருக்குறள் AI நிபுணர்</h1>
                     <p className="sub-title">SRM உயர்கல்வி நிறுவனம்</p>
                  </div>
                  <img src="https://upload.wikimedia.org/wikipedia/en/7/7a/SRM_Institute_of_Science_and_Technology_Logo.svg" alt="SRM" className="srm-logo-top" />
               </div>
               <div className="header-right-group">
                  <nav className="header-nav-tabs">
                     <button className={activeTab === 'ask' ? 'active' : ''} onClick={() => setActiveTab('ask')}> <Cpu size={16} /> <span>AI நிபுணர்</span> </button>
                     <button className={activeTab === 'list' ? 'active' : ''} onClick={() => setActiveTab('list')}> <BookOpen size={16} /> <span>நூலகம்</span> </button>
                     <button className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}> <HistoryIcon size={16} /> <span>வரலாறு</span> </button>
                  </nav>
               </div>
            </div>
         </header>

         <main className="content-container">
            <AnimatePresence mode="wait">
               {activeTab === 'ask' ? (
                  <motion.div key="ask" className="chat-view-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                     <div className="chat-view">
                        <div className="chat-window">
                           <div className="chat-messages-scroll-area">
                              {initProgress > 0 && initProgress < 100 && (
                                 <div className="init-progress-bar">
                                    <div className="p-label">ஆய்வுத் தரவுகள் தயார் செய்யப்படுகின்றன... {initProgress}%</div>
                                    <div className="p-track"> <div className="p-fill" style={{ width: `${initProgress}%` }}></div> </div>
                                 </div>
                              )}
                              {messages.map((m, i) => (
                                 <div key={i} className={`chat-bubble-container ${m.role}`}>
                                    <div className="chat-bubble">
                                       <div className="bubble-meta">{m.role === 'user' ? 'நீங்கள்' : 'நிபுணர்'}</div>
                                       {m.image && (
                                          <div className="chat-bubble-image">
                                             <img src={m.image} alt="Uploaded" style={{maxWidth: '100%', borderRadius: '10px'}} />
                                          </div>
                                       )}
                                       {m.sources && m.sources.length > 0 && (
                                          <div className="kural-source-cards">
                                             {m.sources.slice(0, m.showAllSources ? m.sources.length : 3).map((s, idx) => (
                                                <div key={idx} onClick={() => setSelectedKural(s)} className="kural-mini-card">
                                                   <div className="k-mini-info">
                                                      <span className="k-mini-num">குறள் {s.Number}:</span>
                                                      <div className="k-mini-lines">
                                                         <p>{s.Line1}</p>
                                                         <p>{s.Line2}</p>
                                                      </div>
                                                   </div>
                                                   <ChevronRight size={20} className="k-mini-arrow" />
                                                </div>
                                             ))}
                                          </div>
                                       )}
                                       {m.content && (
                                          <div className="bubble-text">{parseFormattedContent(m.content)}</div>
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
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="image-preview-container" style={{position: 'absolute', bottom: '100%', left: 0, marginBottom: '1rem', background: 'white', padding: '0.5rem', borderRadius: '1rem', border: '1px solid #ddd'}}>
                                       <img src={selectedImage} alt="Preview" style={{height: '60px', borderRadius: '8px'}} />
                                       <button onClick={() => setSelectedImage(null)} style={{position: 'absolute', top: -10, right: -10, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer'}}>×</button>
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
                              <div className="tamil-input-box-v2">
                                 <button className={`kb-toggle-v2 ${showKeyboard ? 'active' : ''}`} onClick={() => setShowKeyboard(!showKeyboard)}>
                                    <Languages size={20} />
                                 </button>
                                 <button className="kb-toggle-v2" onClick={() => fileInputRef.current?.click()}>
                                    <Camera size={20} />
                                 </button>
                                 <input 
                                    type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" 
                                    onChange={handleImageUpload} 
                                 />
                                 <input
                                    placeholder="எதையும் கேளுங்கள்..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAsk(query)}
                                 />
                                 <button onClick={() => handleAsk(query)} disabled={loading} className="send-btn-v2">
                                    {isTranslating ? <div className="mini-loader"></div> : <Send size={20} />}
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               ) : activeTab === 'list' ? (
                  <motion.div key="list" className="library-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                     {!selectedPaal ? (
                        <div className="paal-cards">
                           <div className="paal-card aram" onClick={() => setSelectedPaal('அறத்துப்பால்')}> <h3>அறத்துப்பால்</h3> <p>அறநெறிகள்</p> </div>
                           <div className="paal-card porul" onClick={() => setSelectedPaal('பொருட்பால்')}> <h3>பொருட்பால்</h3> <p>அரசியல் & செல்வம்</p> </div>
                           <div className="paal-card inbam" onClick={() => setSelectedPaal('காமத்துப்பால்')}> <h3>இன்பத்துப்பால்</h3> <p>காதல் & இல்லறம்</p> </div>
                        </div>
                     ) : !selectedChapter ? (
                        <div className="chapter-view">
                           <button className="tamil-back" onClick={() => setSelectedPaal(null)}> <ArrowLeft size={16} /> Back </button>
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
                              {filteredKurals.map(k => (
                                 <div key={k.Number} className="kural-item-card" onClick={() => setSelectedKural(k)}>
                                    <div className="k-header-row">குறள் எண்: {k.Number}</div>
                                    <p>{k.Line1}</p>
                                    <p>{k.Line2}</p>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}
                  </motion.div>
               ) : (
                  <motion.div key="history" className="history-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                     <div className="history-hero">
                        <h2 className="h-title">திருக்குறள் வரலாறு</h2>
                        <p className="h-subtitle">உலகப் பொதுமறை</p>
                        <div className="h-hero-stats">
                           <div className="h-hero-stat-card"> <span className="h-stat-num">133</span> <span className="h-stat-lbl">அதிகாரங்கள்</span> </div>
                           <div className="h-hero-stat-card"> <span className="h-stat-num">1330</span> <span className="h-stat-lbl">குறள்கள்</span> </div>
                        </div>
                     </div>
                     <div style={{padding: '2rem', background: 'white', borderRadius: '2rem', border: '1px solid #eee', marginTop: '2rem'}}>
                        <h3>திருவள்ளுவர் பற்றி</h3>
                        <p>திருவள்ளுவர் சுமார் 2,000 ஆண்டுகளுக்கு முன்பு வாழ்ந்த ஒரு தமிழ் புலவர் மற்றும் தத்துவஞானி ஆவார். அவர் மனித குலத்திற்கு தேவையான அறநெறிகளை 'திருக்குறள்' மூலம் வழங்கியுள்ளார்.</p>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
            
            <div className="nav-scroll-wrapper">
               <nav className="header-nav-tabs-mobile">
                  <button className={activeTab === 'ask' ? 'active' : ''} onClick={() => setActiveTab('ask')}> <Cpu size={24} /> <span>நிபுணர்</span> </button>
                  <button className={activeTab === 'list' ? 'active' : ''} onClick={() => setActiveTab('list')}> <BookOpen size={24} /> <span>நூலகம்</span> </button>
                  <button className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}> <HistoryIcon size={24} /> <span>வரலாறு</span> </button>
               </nav>
            </div>
         </main>

         <AnimatePresence>
            {selectedKural && (
               <div className="tamil-modal-overlay" onClick={() => setSelectedKural(null)}>
                  <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="tamil-modal" onClick={e => e.stopPropagation()}>
                     <header className="m-header"> <span className="m-badge">குறள் {selectedKural.Number}</span> <button onClick={() => setSelectedKural(null)}><X /></button> </header>
                     <div className="m-verse-box">
                        <h3>{selectedKural.Line1}</h3>
                        <h3>{selectedKural.Line2}</h3>
                     </div>
                     <div className="m-explanations-stack">
                        <div className="e-block"> <h5>விளக்கம்</h5> <p>{selectedKural.explanation || selectedKural.mv}</p> </div>
                        <div className="e-block en"> <h5>English Translation</h5> <p>{selectedKural.Translation}</p> </div>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>

         <style dangerouslySetInnerHTML={{
            __html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        
        :root {
          --primary: #9a3412; --bg: #fdfcfa;
          --text: #1e293b; --muted: #64748b;
          --white: #ffffff; --border: #e2e8f0;
          --accent: #f59e0b;
        }

        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'Outfit', sans-serif; background: var(--bg); color: var(--text); overflow: hidden; width: 100vw; height: 100vh; }

        /* Full-Screen Layout */
        .scholarly-app { 
            height: 100vh; 
            width: 100vw;
            display: flex; 
            flex-direction: column; 
            background: var(--bg); 
            overflow: hidden;
            position: fixed;
            top: 0; left: 0;
        }
        
        .main-header { 
            flex: 0 0 auto;
            padding: 1.25rem 2.5rem; 
            background: white; 
            border-bottom: 2px solid var(--border); 
            z-index: 1000; 
            box-shadow: 0 2px 15px rgba(0,0,0,0.03);
        }
        .header-container-inner { display: flex; justify-content: space-between; align-items: center; max-width: 1600px; margin: 0 auto; width: 100%; }
        .header-left-group { display: flex; align-items: center; gap: 1.5rem; }
        .srm-logo-top { height: 60px; width: auto; }
        .main-title { font-size: 1.8rem; margin: 0; color: var(--primary); font-weight: 900; line-height: 1.1; }
        .sub-title { margin: 4px 0 0; font-weight: 700; color: var(--muted); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.15em; }

        .header-right-group { display: flex; align-items: center; gap: 1.5rem; }
        .header-nav-tabs { display: flex; gap: 0.5rem; background: #f1f5f9; padding: 0.4rem; border-radius: 2rem; }
        .header-nav-tabs button { 
           background: none; border: none; padding: 0.8rem 1.5rem; cursor: pointer; color: var(--muted);
           display: flex; align-items: center; gap: 10px; font-weight: 800; border-radius: 1.5rem; transition: 0.3s;
           font-size: 1rem;
        }
        .header-nav-tabs button.active { background: white; color: var(--primary); box-shadow: 0 4px 15px rgba(0,0,0,0.08); }

        .content-container { 
            flex: 1; 
            width: 100%; 
            max-width: 1600px; 
            margin: 0 auto; 
            overflow: hidden;
            display: flex; 
            flex-direction: column; 
            position: relative;
        }
        
        .content-container > div { flex: 1; display: flex; flex-direction: column; height: 100%; overflow: hidden; }

        /* Universal Scrollable View */
        .chat-view-container, .library-view, .history-view, .chapter-view, .kural-view { 
            flex: 1; 
            display: flex; 
            flex-direction: column; 
            height: 100%; 
            width: 100%; 
            overflow-y: auto; 
            padding: 2.5rem;
            background: white;
        }

        .chat-view { flex: 1; display: flex; flex-direction: column; width: 100%; height: 100%; }
        .chat-window { flex: 1; overflow-y: auto; padding-bottom: 2rem; }
        .chat-messages-scroll-area { max-width: 1000px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; gap: 2rem; }
        
        .chat-input-sticky-area { 
            flex: 0 0 auto;
            padding: 1.5rem 2.5rem; 
            border-top: 2px solid var(--border); 
            background: #fafafa;
            z-index: 100;
        }
        .chat-input-container-inner { max-width: 1000px; margin: 0 auto; width: 100%; position: relative; }

        .nav-scroll-wrapper { 
            flex: 0 0 auto;
            background: white; 
            border-top: 2px solid var(--border); 
            height: 85px; 
            display: none; 
            visibility: hidden;
        }

        /* Mobile Optimization */
        @media (max-width: 768px) {
          .main-header { padding: 0.75rem 1.5rem; }
          .srm-logo-top { height: 45px; }
          .main-title { font-size: 1.3rem; }
          .header-right-group { display: none; }
          .nav-scroll-wrapper { display: block; visibility: visible; }
          
          .chat-view-container, .library-view, .history-view, .chapter-view, .kural-view { padding: 1.5rem 1rem; }
          .chat-input-sticky-area { padding: 1rem; }
          
          .h-title { font-size: 1.8rem !important; }
        }

        .chat-bubble-container { display: flex; width: 100%; }
        .chat-bubble-container.user { justify-content: flex-end; }
        .chat-bubble { max-width: 85%; padding: 1.5rem; background: var(--white); border-radius: 1.5rem; border: 1.5px solid var(--border); box-shadow: 0 4px 20px rgba(0,0,0,0.02); font-size: 1.1rem; line-height: 1.6; }
        .user .chat-bubble { background: var(--primary); color: white; border: none; }
        .bubble-meta { font-size: 0.8rem; font-weight: 900; color: var(--muted); margin-bottom: 0.75rem; text-transform: uppercase; }
        
        .tamil-verse { font-weight: 900; font-size: 1.4rem; background: #f8fafc; padding: 2rem; border-radius: 1.5rem; color: #1e293b; margin: 1.5rem 0; border: 1px solid #e2e8f0; }
        .tamil-exp { color: #475569; margin-bottom: 1.5rem; font-weight: 700; font-size: 1.1rem; }

        .tamil-input-box-v2 { display: flex; background: white; padding: 0.6rem; border: 2px solid #e2e8f0; border-radius: 1.5rem; align-items: center; box-shadow: 0 10px 30px rgba(0,0,0,0.06); gap: 0.6rem; }
        .tamil-input-box-v2 input { flex: 1; border: none; outline: none; padding: 0.8rem 1.2rem; font-size: 1.2rem; font-weight: 700; }
        .send-btn-v2 { background: var(--primary); color: white; border: none; width: 50px; height: 50px; border-radius: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
        .send-btn-v2:hover { transform: scale(1.05); background: #7c2d12; }

        .history-hero { text-align: center; padding: 6rem 3rem; background: white; border-radius: 3rem; margin-bottom: 4rem; border: 1.5px solid #f1f5f9; box-shadow: 0 20px 40px rgba(0,0,0,0.02); }
        .h-title { font-size: 3.2rem; font-weight: 950; line-height: 1.1; margin-bottom: 2rem; color: #1e293b; }
        .h-subtitle { color: var(--primary); font-weight: 900; font-size: 1.2rem; text-transform: uppercase; letter-spacing: 0.2em; }
        
        .paal-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2.5rem; margin-top: 3rem; }
        .paal-card { background: white; padding: 3.5rem 2rem; border-radius: 2rem; border: 1.5px solid var(--border); text-align: center; cursor: pointer; transition: 0.4s; }
        .paal-card:hover { transform: translateY(-10px); box-shadow: 0 30px 60px rgba(0,0,0,0.05); border-color: var(--primary); }
        .paal-card h3 { font-size: 2rem; margin-bottom: 1rem; }
        .paal-card p { font-size: 1.1rem; color: var(--muted); }

        .mini-loader { border: 3px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; width: 22px; height: 22px; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}} />
      </div>
   );
};

export default App;
