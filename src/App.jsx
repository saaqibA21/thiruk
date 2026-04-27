import React, { useState, useEffect, useRef, useMemo } from 'react';
import './app.css';
import { Search, Send, BookOpen, MessageSquare, Database, Sparkles, User, BrainCircuit, Waves, Cpu, Zap, Info, Feather, Volume2, ArrowLeft, X, Quote, Globe, Award, History as HistoryIcon, Languages, ChevronRight, Settings, Image as ImageIcon, Camera, ExternalLink, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { KuralAI } from './ai-engine';

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
   const [showMobileMenu, setShowMobileMenu] = useState(false);
   const fileInputRef = useRef(null);

   const getInitialKey = () => {
      try {
         const envKey = import.meta.env.VITE_OPENAI_API_KEY;
         if (envKey && envKey.length > 20 && envKey.startsWith('sk-')) return envKey;
      } catch (e) {}
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

   const lastTranslatedRef = useRef('');

   useEffect(() => {
      if (!query.trim()) return;

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
                  translatedValue = data[0].map(x => x[0]).join('');
                  if (translatedValue && query === currentQuery) {
                     setQuery(translatedValue);
                  }
               }
            } else {
               const match = query.match(/(\b[a-zA-Z\s']+\b)([\s,]$)$/);
               if (!match) return;
               
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
      }, 300);

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
      if (!aiEngine) {
         setMessages(prev => [...prev, { role: 'ai', content: 'நிபுணர் தரவுத்தளம் இன்னும் தயாராகவில்லை. தயவுசெய்து சிறிது நேரம் காத்திருக்கவும்...', sources: [] }]);
         return;
      }
      
      const userMsg = { 
         role: 'user', 
         content: text || "", 
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
         if (!result) throw new Error("No response from engine");
         setMessages(prev => [...prev, { role: 'ai', content: result.answer || "இதோ உங்களுக்கான குறள்கள்:", sources: result.sources || [] }]);
      } catch (error) {
         console.error("Chat Error:", error);
         setMessages(prev => [...prev, { role: 'ai', content: "மன்னிக்கவும், பதிலைத் தேடுவதில் தொழில்நுட்பக் கோளாறு ஏற்பட்டுள்ளது. மீண்டும் ஒருமுறை முயற்சி செய்யுங்கள்.", sources: [] }]);
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
         const kuralMatch = line.match(/(?:குறள்|குறள் எண்|Kural)\s+(\d+)/i);
         if (kuralMatch) {
            const num = parseInt(kuralMatch[1]);
            const kural = kuralData.find(k => k.Number === num);
            if (kural) {
               return (
                  <div key={idx} className="chat-kural-link" onClick={() => setSelectedKural(kural)}>
                     <div className="link-meta">குறள் {num} <ExternalLink size={14} /></div>
                     {(() => {
                        const allWords = `${kural.Line1} ${kural.Line2}`.trim().split(/\s+/);
                        return (
                           <div className="link-text">
                              <p>{allWords.slice(0, 4).join(' ')}</p>
                              <p>{allWords.slice(4).join(' ')}</p>
                           </div>
                        );
                     })()}
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
                  <img src="https://upload.wikimedia.org/wikipedia/en/7/7a/SRM_Institute_of_Science_and_Technology_Logo.svg" alt="SRM" className="srm-logo-top" />
                  <div className="app-title-group">
                     <h1 className="main-title">திருக்குறள் AI</h1>
                     <p className="sub-title">SRM நிபுணர்</p>
                  </div>
               </div>
               
               <div className="header-right-group">
                  {/* Desktop Nav */}
                  <nav className="header-nav-tabs desktop-only">
                     <button className={activeTab === 'ask' ? 'active' : ''} onClick={() => setActiveTab('ask')}> <Cpu size={16} /> <span>AI நிபுணர்</span> </button>
                     <button className={activeTab === 'list' ? 'active' : ''} onClick={() => setActiveTab('list')}> <BookOpen size={16} /> <span>நூலகம்</span> </button>
                     <button className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}> <HistoryIcon size={16} /> <span>வரலாறு</span> </button>
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
                                       {m.content && (
                                          <div className="bubble-text">{parseFormattedContent(m.content)}</div>
                                       )}
                                       {m.sources && m.sources.length > 0 && (
                                          <div className="kural-source-cards">
                                              {m.sources.slice(0, m.showMore ? m.sources.length : 5).map((s, idx) => (
                                                 <div key={idx} className="kural-card-wrapper">
                                                    <div className="kural-card-score">Score: {s.score?.toLocaleString()} | Match: {s.matchedUniqueWords || 0}</div>
                                                    <KuralCard 
                                                       kural={s} 
                                                       highlight={m.searchTerms}
                                                       onSelect={() => setSelectedKural(s)} 
                                                    />
                                                 </div>
                                              ))}
                                             {m.sources.length > 5 && (
                                                <button 
                                                   className="show-more-kurals-btn"
                                                   onClick={() => {
                                                      const newMessages = [...messages];
                                                      newMessages[i].showMore = !newMessages[i].showMore;
                                                      setMessages(newMessages);
                                                   }}
                                                >
                                                   {m.showMore ? 'சுருக்கமாகக் காட்டு' : `மீதி ${m.sources.length - 5} குறள்களையும் காட்டு`}
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
                                 <button onClick={() => handleAsk(query)} disabled={loading || !aiEngine} className="send-btn-v2" title={!aiEngine ? "தயாராகிறது..." : "அனுப்பு"}>
                                    {isTranslating ? <div className="mini-loader"></div> : !aiEngine ? <div className="mini-loader-orange"></div> : <Send size={20} />}
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               ) : activeTab === 'list' ? (
                  <motion.div key="list" className="library-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                     {!selectedPaal ? (
                        <div className="paal-cards-container">
                           <h2 className="library-main-title">திருக்குறள் நூலகம்</h2>
                           <div className="paal-cards">
                              <div className="paal-card aram" onClick={() => setSelectedPaal('அறத்துப்பால்')}> 
                                 <span className="orn-bl"></span> <span className="orn-br"></span>
                                 <h3>அறத்துப்பால்</h3> 
                                 <p>38 அதிகாரங்கள்</p> 
                              </div>
                              <div className="paal-card porul" onClick={() => setSelectedPaal('பொருட்பால்')}> 
                                 <span className="orn-bl"></span> <span className="orn-br"></span>
                                 <h3>பொருட்பால்</h3> 
                                 <p>70 அதிகாரங்கள்</p> 
                              </div>
                              <div className="paal-card inbam" onClick={() => setSelectedPaal('காமத்துப்பால்')}> 
                                 <span className="orn-bl"></span> <span className="orn-br"></span>
                                 <h3>இன்பத்துப்பால்</h3> 
                                 <p>25 அதிகாரங்கள்</p> 
                              </div>
                           </div>
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
                              {filteredKurals.map(k => {
                                 const allWords = `${k.Line1} ${k.Line2}`.trim().split(/\s+/);
                                 return (
                                    <div key={k.Number} className="kural-item-card" onClick={() => setSelectedKural(k)}>
                                       <div className="k-header-row">குறள் எண்: {k.Number}</div>
                                       <p>{allWords.slice(0, 4).join(' ')}</p>
                                       <p>{allWords.slice(4).join(' ')}</p>
                                    </div>
                                 );
                              })}
                           </div>
                        </div>
                     )}
                  </motion.div>
               ) : (
                  <motion.div key="history" className="history-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div className="history-hero-v2">
                         <div className="h-hero-content">
                            <h2 className="h-title-big">திருக்குறள் வரலாறு</h2>
                            <p className="h-subtitle-gold">உலகப் பொதுமறை - ஏழே சீர்களில் வாழ்வியல் தத்துவம்</p>
                            <div className="h-hero-grid">
                               <div className="h-stat-item"> <strong>133</strong> <span>அதிகாரங்கள்</span> </div>
                               <div className="h-stat-item"> <strong>1330</strong> <span>குறள்கள்</span> </div>
                               <div className="h-stat-item"> <strong>3</strong> <span>பால்கள்</span> </div>
                               <div className="h-stat-item"> <strong>2000+</strong> <span>ஆண்டுகள்</span> </div>
                            </div>
                         </div>
                      </div>
                      
                      <div className="history-sections-stack">
                         <section className="h-section-card">
                            <div className="h-section-img"> <img src="thiruvalluvar.jpg" alt="Thiruvalluvar" /> </div>
                            <div className="h-section-text">
                               <h3>திருவள்ளுவர் பற்றி</h3>
                               <p>திருவள்ளுவர் சுமார் 2,000 ஆண்டுகளுக்கு முன்பு வாழ்ந்த ஒரு தமிழ் புலவர் மற்றும் தத்துவஞானி ஆவார். அவர் எந்த ஒரு குறிப்பிட்ட மதத்தையும் சாராதவர், எனவே திருக்குறள் "உலகப் பொதுமறை" என்று போற்றப்படுகிறது.</p>
                            </div>
                         </section>

                         <section className="h-section-card statue-focus">
                            <div className="h-section-text">
                               <h3>கன்னியாகுமரி திருவள்ளுவர் சிலை</h3>
                               <p><strong>அமைவிடம்:</strong> இந்தியாவின் தென்கோடி முனையான கன்னியாகுமரியில், மூன்று கடல்கள் சங்கமிக்கும் இடத்திற்கு அருகே கடல் நடுவே அமைந்துள்ள பிரம்மாண்டமான சிலை.</p>
                               <ul className="statue-details">
                                  <li><strong>உயரம்:</strong> 133 அடி (133 அதிகாரங்களை உணர்த்துகிறது).</li>
                                  <li><strong>பீடம்:</strong> 38 அடி உயரம் (அறத்துப்பாலை குறிக்கிறது).</li>
                                  <li><strong>சிலை:</strong> 95 அடி உயரம் (பொருட்பால் மற்றும் இன்பத்துப்பாலை குறிக்கிறது).</li>
                                  <li><strong>எடை:</strong> சுமார் 7000 டன் கருங்கற்களால் ஆனது.</li>
                                </ul>
                            </div>
                            <div className="h-section-img"> <img src="statue.png" alt="Valluvar Statue" /> </div>
                         </section>

                         <section className="h-section-card">
                            <div className="h-section-img"> <img src="manuscript.png" alt="Ancient Manuscript" /> </div>
                            <div className="h-section-text">
                               <h3>நூலின் அமைப்பு</h3>
                               <p>திருக்குறள் மூன்று பால்களாக பிரிக்கப்பட்டுள்ளது: அறத்துப்பால், பொருட்பால், மற்றும் காமத்துப்பால். 133 அதிகாரங்களில் தலா 10 குறள்கள் வீதம் 1330 குறள்கள் உள்ளன. இவை ஒவ்வொன்றும் ஈரடி வெண்பாக்களால் ஆனவை.</p>
                            </div>
                         </section>

                         <section className="h-section-card reversed">
                            <div className="h-section-text">
                               <h3>உலக அங்கீகாரம்</h3>
                               <p>லத்தீன், ஜெர்மன், பிரஞ்சு, ஆங்கிலம் உட்பட 100க்கும் மேற்பட்ட மொழிகளில் மொழிபெயர்க்கப்பட்டுள்ளது. மகாத்மா காந்தி போன்ற பல தலைவர்கள் திருக்குறளால் ஈர்க்கப்பட்டனர்.</p>
                            </div>
                            <div className="h-section-img"> <img src="translations.png" alt="Global Impact" /> </div>
                         </section>
                      </div>
                      
                      <div className="history-quote-v2">
                          <p>"நான் படித்தவற்றில் மிகவும் உயர்ந்த அறம் சார்ந்த நூல் திருக்குறள். இது உலகிற்கே ஒரு பொதுவான வழிகாட்டி."</p>
                          <span>- மகாத்மா காந்தி</span>
                       </div>
                  </motion.div>
               )}
            </AnimatePresence>
            
         </main>

         <AnimatePresence>
            {selectedKural && (
               <div className="tamil-modal-overlay" onClick={() => setSelectedKural(null)}>
                  <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="tamil-modal" onClick={e => e.stopPropagation()}>
                     <header className="m-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem'}}> 
                        <span className="m-badge">குறள் {selectedKural.Number}</span> 
                        <button className="modal-close-btn" onClick={() => setSelectedKural(null)}><X /></button> 
                     </header>
                     {(() => {
                        const allWords = `${selectedKural.Line1} ${selectedKural.Line2}`.trim().split(/\s+/);
                        return (
                           <div className="m-verse-box">
                              <h3>{allWords.slice(0, 4).join(' ')}</h3>
                              <h3>{allWords.slice(4).join(' ')}</h3>
                           </div>
                        );
                     })()}
                     <div className="m-explanations-stack">
                        {selectedKural.mv && <div className="e-block"> <h5>மு. வரதராசனார் உரை</h5> <p>{selectedKural.mv}</p> </div>}
                        {selectedKural.sp && <div className="e-block"> <h5>சாலமன் பாப்பையா உரை</h5> <p>{selectedKural.sp}</p> </div>}
                        {selectedKural.mk && <div className="e-block"> <h5>மு. கருணாநிதி உரை</h5> <p>{selectedKural.mk}</p> </div>}
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>
       </div>
    );
 };

const KuralCard = ({ kural, highlight, onSelect }) => {
   const allWords = `${kural.Line1} ${kural.Line2}`.trim().split(/\s+/);
   
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
      <div className="kural-mini-card" onClick={onSelect}>
         <div className="k-mini-info">
            <div className="k-mini-num">குறள் எண்: {kural.Number}</div>
            <div className="k-mini-lines">
               <p>{highlightText(allWords.slice(0, 4).join(' '))}</p>
               <p>{highlightText(allWords.slice(4).join(' '))}</p>
            </div>
         </div>
         <ChevronRight className="k-mini-arrow" size={20} />
      </div>
   );
};

export default App;
