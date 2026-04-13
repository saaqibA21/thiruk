import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Send, BookOpen, MessageSquare, Database, Sparkles, User, BrainCircuit, Waves, Cpu, Zap, Info, Feather, Volume2, ArrowLeft, X, Quote, Globe, Award, History as HistoryIcon, Languages, ChevronRight, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { KuralAI } from './ai-engine';

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
      
      // CRITICAL: If input contains ANY Tamil characters, skip translation immediately
      const hasTamil = /[\u0B80-\u0BFF]/.test(query);
      if (hasTamil) {
         setIsTranslating(false);
         return;
      }

      const hasEnglish = /[a-z]{2,}/i.test(query);
      if (!hasEnglish) {
         setIsTranslating(false);
         return;
      }

      const currentQuery = query;
      const timer = setTimeout(async () => {
         // Don't translate if the user has already moved on significantly
         if (currentQuery !== query) return;

         setIsTranslating(true);
         try {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ta&dt=t&q=${encodeURIComponent(query)}`;
            const res = await fetch(url);
            const data = await res.json();

            if (data && data[0]) {
               // Merge multiple translation segments if Google splits the sentence
               const translated = data[0].map(x => x[0]).join('');

               if (translated && translated !== query && query === currentQuery) {
                  lastTranslatedRef.current = translated;
                  setQuery(translated);
               }
            }
         } catch (err) {
            console.error("Translation error:", err);
         } finally {
            setIsTranslating(false);
         }
      }, 1000); // 1s debounce for better typing experience

      return () => clearTimeout(timer);
   }, [query]);

   const ATHIGARAMS = ["கடவுள் வாழ்த்து", "வான் சிறப்பு", "நீத்தார் பெருமை", "அறன் வலியுறுத்தல்", "இல்வாழ்க்கை", "வாழ்க்கைத் துணைநலம்", "மக்கட்பேறு", "அன்புடைமை", "விருந்தோம்பல்", "இனியவை கூறல்", "செய்ந்நன்றியறிதல்", "நடுவுநிலைமை", "அடக்கமுடைமை", "ஒழுக்கமுடைமை", "பிறனில் விழையாமை", "பொறையுடைமை", "அழுக்காறாமை", "வெஃகாமை", "புறங்கூறாமை", "பயனில சொல்லாமை", "தீவினையச்சம்", "ஒப்புரவறிதல்", "ஈகை", "புகழ்", "அருளுடைமை", "புலால் மறுத்தல்", "தவம்", "கூடாஒழுக்கம்", "கள்ளாமை", "வாய்மை", "வெகுளாமை", "இன்னா செய்யாமை", "கொல்லாமை", "நிலையாமை", "துறவு", "மெய்யணர்தல்", "அவாவறுத்தல்", "ஊழ்", "இறைமாட்சி", "கல்வி", "கல்லாமை", "கேள்வி", "அறிவுடைமை", "குற்றங்கடிதல்", "பெரியாரைத் துணைக்கோடல்", "சிற்றினம் சேராமை", "தெரிந்துசெயல்வகை", "வலியறிதல்", "காலமறிதல்", "இடனறிதல்", "தெரிந்துதெளிதல்", "தெரிந்துவினையாடல்", "சுற்றந்தழால்", "பொச்சாவாமை", "செங்கோன்மை", "கொடுங்கோன்மை", "வெருவந்த செய்யாமை", "கண்ணோட்டம்", "ஒற்றாடல்", "ஊக்கமுடைமை", "மடியின்மை", "ஆள்வினையுடைமை", "இடுக்கண் அழியாமை", "அமைச்சு", "சொல்வன்மை", "வினைத்தூய்மை", "வினைத்திட்பம்", "வினைசெயல்வகை", "தூது", "மன்னரைச் சேர்ந்தொழுதல்", "குறிப்பறிதல்", "அவையறிதல்", "அவையஞ்சாமை", "நாடு", "அரண்", "பொருள்செயல்வகை", "படைமாட்சி", "படைச்செருக்கு", "நட்பு", "நட்பாராய்தல்", "பழைமை", "தீய நட்பு", "கூடா நட்பு", "பேதைமை", "புல்லறிவாண்மை", "இகல்", "பகைமாட்சி", "பகைத்திறந்தெரிதல்", "உட்பகை", "பெரியாரைப் பிழையாமை", "பெண்வழிச் சேறல்", "வரைவின் மகளிர்", "கள்ளுண்ணாமை", "சூது", "மருந்து", "குடிமை", "மானம்பருமை", "சான்றாண்மை", "பண்புடைமை", "நன்றியில் செல்வம்", "நாணுடைமை", "குடிசெயல்வகை", "உழவு", "நல்குரவு", "இரவு", "இரவச்சம்", "கயமை", "தகையணங்குறுத்தல்", "குறிப்பறிதல்", "புணர்ச்சி மகிழ்தல்", "நலம்புனைந்துரைத்தல்", "காதல் சிறப்புரைத்தல்", "நாணுத்துறவுரைத்தல்", "அலரறிவுறுத்தல்", "பிரிவாற்றாமை", "படர்மெலிந்திரங்கல்", "கண்விதுப்பழிதல்", "பசப்புறு பருவரல்", "தனிப்படர் மிகுதி", "நினைந்தவர் புலம்பல்", "கனவுநிலை உரைத்தல்", "பொழுதுகண்டு இரங்கல்", "உறுப்புநலன் அழிதல்", "நெஞ்சொடு கிளத்தல்", "நிறையழிதல்", "அவர்வயின் விதும்பல்", "குறிப்பறிவுறுத்தல்", "புணர்ச்சி விதும்பல்", "நெஞ்சொடு புலத்தல்", "புலவி", "புலவி நுணுக்கம்", "ஊடலுவகை"];

   const handleAsk = async (text) => {
      if (!text.trim() || !aiEngine) return;
      const userMsg = { role: 'user', content: text };
      setMessages(prev => [...prev, userMsg]);
      setQuery('');
      setLoading(true);
      try {
         const result = await aiEngine.ask(text);
         setMessages(prev => [...prev, { role: 'ai', content: result.answer, sources: result.sources }]);
      } catch (error) {
         setMessages(prev => [...prev, { role: 'ai', content: "மன்னிக்கவும், பிழை ஏற்பட்டுள்ளது.", sources: [] }]);
      } finally { setLoading(false); }
   };

   const parseFormattedContent = (content) => {
      const lines = content.split('\n');
      return lines.map((line, idx) => {
         if (line.match(/^\d+\.\s+\*\*Kural\s+#\d+\*\*/)) {
            return <h4 key={idx} className="tamil-k-header">{line.replace(/\*\*Kural\s+#/g, 'குறள் எண்: ').replace(/\*\*/g, '')}</h4>;
         }
         if (line.includes('**Tamil:**')) {
            return <p key={idx} className="tamil-verse"><strong>குறள்:</strong> {line.replace('**Tamil:**', '')}</p>;
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
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.role === 'ai') {
         // Scroll to the start of the bubble
         const bubbles = document.querySelectorAll('.chat-bubble-container.ai');
         if (bubbles.length > 0) {
            bubbles[bubbles.length - 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
         }
      } else {
         chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
   }, [messages]);

   return (
      <div className="scholarly-app">
         <header className="main-header">
        <div className="header-top-row">
           <img src="https://upload.wikimedia.org/wikipedia/en/7/7a/SRM_Institute_of_Science_and_Technology_Logo.svg" alt="SRM" className="srm-logo-top" />
           <div className="app-title-group">
              <h1 className="main-title">திருக்குறள் AI நிபுணர்</h1>
              <p className="sub-title">SRM உயர்கல்வி நிறுவனம்</p>
           </div>
        </div>
        <div className="nav-scroll-wrapper">
          <nav className="header-nav-tabs">
            <button className={activeTab === 'ask' ? 'active' : ''} onClick={() => setActiveTab('ask')}> <Cpu size={16} /> <span>கேள்வி</span> </button>
            <button className={activeTab === 'list' ? 'active' : ''} onClick={() => setActiveTab('list')}> <BookOpen size={16} /> <span>நூலகம்</span> </button>
            <button className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}> <HistoryIcon size={16} /> <span>வரலாறு</span> </button>
          </nav>
        </div>
      </header>

         <main className="content-container">
            <AnimatePresence mode="wait">
               {activeTab === 'ask' ? (
                  <motion.div key="ask" className="chat-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                     <div className="chat-window">
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
                                 <div className="bubble-text">{parseFormattedContent(m.content)}</div>
                                 {m.sources && m.sources.length > 0 && (
                                    <div className="kural-source-cards">
                                       {m.sources.map((s, idx) => (
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
                              </div>
                           </div>
                        ))}
                        {loading && <div className="tamil-loading">நிபுணர் விளக்கம் அளிக்கிறார்...</div>}
                        <div ref={chatEndRef} />
                     </div>
                     <div className="chat-input-row">
                        <div className="tamil-input-box">
                           <input
                              placeholder="Type in English (it will auto-translate)..."
                              value={query}
                              onChange={(e) => setQuery(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleAsk(query)}
                           />
                           <button onClick={() => handleAsk(query)} disabled={loading}>
                              {isTranslating ? <div className="mini-loader"></div> : <Send size={20} />}
                           </button>
                        </div>
                        {isTranslating && <div className="auto-trans-status">Translating...</div>}
                     </div>
                  </motion.div>
               ) : activeTab === 'list' ? (
                  <motion.div key="list" className="library-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                     {!selectedPaal ? (
                        <>
                           <div className="library-resource-header-box">
                              <h3 className="res-title-main"><BookOpen size={20} /> டிஜிட்டல் ஆராய்ச்சி நூலகம் / Research Archives</h3>
                              <div className="res-grid-premium">
                                 <a href="https://www.tamildigitallibrary.in/book-detail?id=jZY9lKy2kZpc7979ITXlLyeYkZyc" target="_blank" rel="noreferrer" className="res-card-v2">
                                    <Database className="res-ico" size={24} />
                                    <div className="res-card-text">
                                       <strong>தமிழ் டிஜிட்டல் நூலகம்</strong>
                                       <span>அரிய ஓலைச்சுவடி பதிப்புகள் (PDF)</span>
                                    </div>
                                 </a>
                                 <a href="https://archive.org/details/thesacredkurals00popeuoft" target="_blank" rel="noreferrer" className="res-card-v2">
                                    <Feather className="res-ico" size={24} />
                                    <div className="res-card-text">
                                       <strong>G.U. Pope Translation</strong>
                                       <span>Classic English verse (Internet Archive)</span>
                                    </div>
                                 </a>
                                 <a href="http://www.projectmadurai.org/pm_etexts/utf8/pmutf80001.html" target="_blank" rel="noreferrer" className="res-card-v2">
                                    <Globe className="res-ico" size={24} />
                                    <div className="res-card-text">
                                       <strong>புராஜெக்ட் மதுரை</strong>
                                       <span>மின்னணு தமிழ் இலக்கியத் தொகுப்பு</span>
                                    </div>
                                 </a>
                              </div>
                           </div>

                           <div className="library-section-title">மூல நூல்கள் (Main Sections)</div>
                           <div className="paal-cards">
                              <div className="paal-card aram" onClick={() => setSelectedPaal('அறத்துப்பால்')}> <h3>அறத்துப்பால்</h3> <p>அறநெறிகள்</p> </div>
                              <div className="paal-card porul" onClick={() => setSelectedPaal('பொருட்பால்')}> <h3>பொருட்பால்</h3> <p>அரசியல் & செல்வம்</p> </div>
                              <div className="paal-card inbam" onClick={() => setSelectedPaal('காமத்துப்பால்')}> <h3>இன்பத்துப்பால்</h3> <p>காதல் & இல்லறம்</p> </div>
                           </div>
                        </>
                     ) : !selectedChapter ? (
                        <div className="chapter-view">
                           <button className="tamil-back" onClick={() => setSelectedPaal(null)}> <ArrowLeft size={16} /> பால் தெரிவு </button>
                           <div className="chapter-header-text">{selectedPaal}</div>
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
                           <button className="tamil-back" onClick={() => setSelectedChapter(null)}> <ArrowLeft size={16} /> அதிகாரங்கள் </button>
                           <div className="kural-grid-stack">
                              {filteredKurals.map(k => (
                                 <div key={k.Number} className="kural-item-card" onClick={() => setSelectedKural(k)}>
                                    <div className="k-header-row">குறள் எண்: {k.Number}</div>
                                    <p className="kural-line-1">{k.Line1}</p>
                                    <p className="kural-line-2">{k.Line2}</p>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}
                  </motion.div>
               ) : (
                  <motion.div key="history" className="history-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                     <div className="history-hero">
                        <div className="h-hero-bg"></div>
                        <div className="h-decorator"></div>
                        <motion.div
                           initial={{ opacity: 0, scale: 0.9 }}
                           animate={{ opacity: 1, scale: 1 }}
                           transition={{ duration: 0.8 }}
                        >
                           <h2 className="h-title">திருக்குறள்: காலத்தைக் கடந்த ஒரு மாபெரும் வரலாறு</h2>
                           <p className="h-subtitle">2000 ஆண்டுகால ஞானம் • உலகப் பொதுமறை • விவேகத்தின் சிகரம்</p>
                        </motion.div>
                        <div className="h-hero-stats">
                           <div className="h-hero-stat-card">
                              <span className="h-stat-num">133</span>
                              <span className="h-stat-lbl">அதிகாரங்கள்</span>
                           </div>
                           <div className="h-hero-stat-card">
                              <span className="h-stat-num">1330</span>
                              <span className="h-stat-lbl">குறட்பாக்கள்</span>
                           </div>
                           <div className="h-hero-stat-card">
                              <span className="h-stat-num">100+</span>
                              <span className="h-stat-lbl">மொழிகள்</span>
                           </div>
                        </div>
                     </div>

                     <div className="history-content-sections">
                        <section className="h-section-split">
                           <div className="h-card-premium creator-card">
                              <div className="h-img-container">
                                 <img src="statue.png" alt="திருவள்ளுவர்" className="h-main-img" />
                                 <div className="h-img-badge">தெய்வப்புலவர்</div>
                              </div>
                              <div className="h-content-box">
                                 <span className="h-label-top">வாழ்வியல் வழிகாட்டி</span>
                                 <h3>திருவள்ளுவர்: காலக் கண்ணாடி</h3>
                                 <p>சுமார் 2,000 ஆண்டுகளுக்கு முன்பே சாதி, மதம், இனம் எனப் பாராமல் மனித குலம் முழுமைக்கும் பொதுவான நீதியை வழங்கியவர் திருவள்ளுவர்.</p>
                                 <div className="h-info-grid">
                                    <div className="h-info-item">
                                       <Award className="h-icon" size={20} />
                                       <div>
                                          <strong>காலம்</strong>
                                          <span>கி.மு. 31 (திருவள்ளுவர் ஆண்டு)</span>
                                       </div>
                                    </div>
                                    <div className="h-info-item">
                                       <BrainCircuit className="h-icon" size={20} />
                                       <div>
                                          <strong>தத்துவம்</strong>
                                          <span>உலகளாவிய மனிதநேயம்</span>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </section>

                        <div className="h-pillars-section">
                           <div className="h-section-header-center">
                              <span className="h-label">கட்டமைப்பு</span>
                              <h3>முப்பால்: வாழ்வின் மூன்று பரிமாணங்கள்</h3>
                           </div>
                           <div className="h-pillars-grid">
                              <motion.div whileHover={{ y: -10 }} className="h-pillar-card aram">
                                 <div className="p-icon"><BookOpen size={24} /></div>
                                 <h4>அறத்துப்பால்</h4>
                                 <p>38 அதிகாரங்கள்</p>
                                 <span className="p-desc">தனிமனித ஒழுக்கம், இல்லறம் மற்றும் துறவறம் குறித்த நெறிகள்.</span>
                              </motion.div>
                              <motion.div whileHover={{ y: -10 }} className="h-pillar-card porul">
                                 <div className="p-icon"><Database size={24} /></div>
                                 <h4>பொருட்பால்</h4>
                                 <p>70 அதிகாரங்கள்</p>
                                 <span className="p-desc">அரசியல், அமைச்சியல், படை, அரண் மற்றும் சமூக நிர்வகிப்பு.</span>
                              </motion.div>
                              <motion.div whileHover={{ y: -10 }} className="h-pillar-card inbam">
                                 <div className="p-icon"><Sparkles size={24} /></div>
                                 <h4>இன்பத்துப்பால்</h4>
                                 <p>25 அதிகாரங்கள்</p>
                                 <span className="p-desc">காதல், அன்பு மற்றும் அகவாழ்வின் ஆழமான உணர்வுகள்.</span>
                              </motion.div>
                           </div>
                        </div>

                        <div className="h-timeline-vertical-section">
                           <div className="h-section-header">
                              <span className="h-label">காலப்பயணம்</span>
                              <h3>வரலாற்று மைல்கற்கள்</h3>
                           </div>
                           <div className="h-v-timeline">
                              <div className="h-tl-line"></div>
                              <div className="h-tl-node-item">
                                 <div className="h-tl-year">கி.மு / கி.பி</div>
                                 <div className="h-tl-marker"></div>
                                 <div className="h-tl-info">
                                    <h4>சங்க காலம் (அரங்கேற்றம்)</h4>
                                    <p>மதுரை தமிழ்ச் சங்கத்தில் 'திருவள்ளுவ மாலை' சான்றோர் முன்னிலையில் அரங்கேற்றப்பட்டது.</p>
                                 </div>
                              </div>
                              <div className="h-tl-node-item">
                                 <div className="h-tl-year">1812</div>
                                 <div className="h-tl-marker"></div>
                                 <div className="h-tl-info">
                                    <h4>அச்சு வடிவம்</h4>
                                    <p>தஞ்சை ஞானப்பிரகாசம் அவர்களால் முதன்முதலில் நூல் வடிவில் அச்சிடப்பட்டது.</p>
                                 </div>
                              </div>
                              <div className="h-tl-node-item">
                                 <div className="h-tl-year">1886</div>
                                 <div className="h-tl-marker"></div>
                                 <div className="h-tl-info">
                                    <h4>உலகளாவிய அங்கீகாரம்</h4>
                                    <p>ஜி.யு. போப் (G.U. Pope) அவர்களால் ஆங்கிலத்தில் மொழிபெயர்க்கப்பட்டு உலகிற்கு அறிமுகமானது.</p>
                                 </div>
                              </div>
                              <div className="h-tl-node-item active">
                                 <div className="h-tl-year">இன்று</div>
                                 <div className="h-tl-marker"></div>
                                 <div className="h-tl-info">
                                    <h4>டிஜிட்டல் யுகம் (SRM AI)</h4>
                                    <p>நவீன தொழில்நுட்பத்தின் மூலம் திருக்குறள் அடுத்த தலைமுறைக்குக் கொண்டு செல்லப்படுகிறது.</p>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <section className="h-manuscript-feature">
                           <div className="h-feature-content">
                              <div className="h-img-glow">
                                 <img src="manuscript.png" alt="ஓலைச்சுவடி" />
                              </div>
                              <div className="h-feature-text">
                                 <span className="h-label">மீட்டெடுப்பு</span>
                                 <h3>ஓலைச்சுவடியிலிருந்து டிஜிட்டல் வரை</h3>
                                 <p>திருக்குறள் பல நூற்றாண்டுகளாக ஓலைச்சுவடிகளில் மட்டுமே பாதுகாக்கப்பட்டது. 'எழுத்தாணி' கொண்டு பனை ஓலைகளில் செதுக்கப்பட்ட இந்த வரிகள், இயற்கை சீற்றங்களைக் கடந்து நம்மிடம் வந்து சேர்ந்தது ஒரு அதிசயம்.</p>
                                 <p>தமிழ் தாத்தா உ.வே. சாமிநாதையர் அவர்களின் அயராத உழைப்பால் இவை மீட்டெடுக்கப்பட்டு இன்று உங்கள் விரல் நுனியில் உள்ளது.</p>
                              </div>
                           </div>
                        </section>

                        <section className="h-global-influence">
                           <div className="h-section-header-center">
                              <span className="h-label">உலகளாவிய தாக்கம்</span>
                              <h3>உலகத் தலைவர்களின் உந்துதல்</h3>
                           </div>
                           <div className="h-influence-grid">
                              <div className="h-influence-card">
                                 <div className="h-card-inner">
                                    <p><strong>மகாத்மா காந்தி:</strong> "திருக்குறளில் உள்ள 'இன்னா செய்தாரையும்' என்ற கருத்தே அகிம்சை கொள்கைக்கு அடித்தளம்."</p>
                                 </div>
                              </div>
                              <div className="h-influence-card">
                                 <div className="h-card-inner">
                                    <p><strong>ஆல்பர்ட் சுவைட்சர்:</strong> "திருக்குறளைப் போல வாழ்வின் அனைத்துப் பகுதிகளுக்கும் வழிகாட்டும் மற்றொரு நூல் உலகில் இல்லை."</p>
                                 </div>
                              </div>
                              <div className="h-influence-card">
                                 <div className="h-card-inner">
                                    <p><strong>லியோ டால்ஸ்டாய்:</strong> ரஷ்யாவிலிருந்து திருக்குறளை மொழிபெயர்த்துப் படித்து வியந்தவர்.</p>
                                 </div>
                              </div>
                           </div>
                           <div className="h-mega-quote">
                              <Quote className="h-q-icon" size={60} />
                              <blockquote>"திருக்குறள் என்பது மனிதன் மனிதனாக வாழ, மனிதன் மனிதனுக்குச் சொன்ன உன்னத நெறி."</blockquote>
                           </div>
                        </section>

                        <div className="h-resources-v2">
                           <h3>கல்வி மற்றும் ஆய்வு ஆதாரங்கள்</h3>
                           <div className="h-links-flex">
                              <a href="https://en.wikipedia.org/wiki/Tirukkuṟaḷ" target="_blank" rel="noreferrer" className="h-link">
                                 <Globe size={18} /> <span>விக்கிப்பீடியா</span>
                              </a>
                              <a href="http://www.projectmadurai.org/pm_etexts/utf8/pmutf80001.html" target="_blank" rel="noreferrer" className="h-link">
                                 <Database size={18} /> <span>புராஜெக்ட் மதுரை</span>
                              </a>
                              <a href="https://archive.org/details/thesacredkurals00popeuoft" target="_blank" rel="noreferrer" className="h-link">
                                 <BookOpen size={18} /> <span>ஆவணக் காப்பகம்</span>
                              </a>
                           </div>
                        </div>
                     </div>

                     <div className="h-footer-premium">
                        <div className="h-footer-content">
                           <h3>காலம் கடந்த வழிகாட்டி</h3>
                           <p>இன்று நவீன செயற்கை நுண்ணறிவு யுகத்திலும், திருக்குறள் நமக்கு வாழ்வியல் தீர்வுகளை வழங்குகிறது.</p>
                           <div className="h-srm-badge">SRM Institute of Science and Technology • Tamil Research Centre</div>
                        </div>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
         </main>

         <AnimatePresence>
            {selectedKural && (
               <div className="tamil-modal-overlay" onClick={() => setSelectedKural(null)}>
                  <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="tamil-modal" onClick={e => e.stopPropagation()}>
                     <header className="m-header"> <span className="m-badge">குறள் {selectedKural.Number}</span> <button onClick={() => setSelectedKural(null)}><X /></button> </header>
                     <div className="m-verse-box"> 
                        <h3>{(`${selectedKural.Line1} ${selectedKural.Line2}`).split(/\s+/).slice(0, 4).join(' ')}</h3> 
                        <h3>{(`${selectedKural.Line1} ${selectedKural.Line2}`).split(/\s+/).slice(4).join(' ')}</h3> 
                     </div>
                     <div className="m-explanations-stack">
                        <div className="e-block"> <h5>மு. வரதராசனார் விளக்கம்</h5> <p>{selectedKural.mv || selectedKural.explanation}</p> </div>
                        <div className="e-block"> <h5>மு. கருணாநிதி விளக்கம்</h5> <p>{selectedKural.mk || "தகவல் இல்லை"}</p> </div>
                        <div className="e-block"> <h5>சாலமன் பாப்பையா விளக்கம்</h5> <p>{selectedKural.sp || "தகவல் இல்லை"}</p> </div>
                        <div className="e-block en"> <h5>ஆங்கில மொழிபெயர்ப்பு</h5> <p>{selectedKural.Translation}</p> </div>
                     </div>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>

         <AnimatePresence>
            {showSettings && (
               <div className="settings-modal-overlay" onClick={() => setShowSettings(false)}>
                  <div className="settings-modal" onClick={e => e.stopPropagation()}>
                     <h3>அமைப்புகள்</h3>
                     <div className="set-field">
                        <label>OpenAI சாவி (API Key)</label>
                        <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} />
                     </div>
                     <button className="save-btn" onClick={() => setShowSettings(false)}>சரி</button>
                  </div>
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
        body { margin: 0; font-family: sans-serif; background: var(--bg); color: var(--text); overflow-x: hidden; width: 100%; }
        h1, h2, h3, h4, .app-title-group { font-family: 'Outfit', sans-serif; }

        .scholarly-app { min-height: 100vh; display: flex; flex-direction: column; width: 100%; overflow-x: hidden; }
        .main-header { padding: 1rem 4rem; background: var(--white); border-bottom: 2px solid var(--border); position: sticky; top: 0; z-index: 100; box-shadow: 0 4px 20px rgba(0,0,0,0.03); width: 100%; }
        .nav-scroll-wrapper { width: 100%; }
        .header-top-row { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1rem; }
        .srm-logo-top { height: 45px; object-fit: contain; }
        .main-title { font-size: 1.4rem; margin: 0; color: var(--primary); font-weight: 950; letter-spacing: -0.02em; }
        .sub-title { margin: 0; font-weight: 800; color: var(--muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }

        .header-nav-tabs { display: flex; gap: 1rem; align-items: center; }
        .header-nav-tabs button { 
           background: none; border: none; padding: 0.5rem 1.25rem; cursor: pointer; color: var(--muted);
           display: flex; align-items: center; gap: 6px; font-weight: 800; border-radius: 0.5rem; transition: 0.3s;
           font-size: 0.85rem;
        }
        .header-nav-tabs button.active { background: var(--primary); color: white; }
        .header-nav-tabs button:hover:not(.active) { background: #f1f5f9; color: var(--text); }

        .content-container { flex: 1; padding: 2rem 4rem; max-width: 1200px; margin: 0 auto; width: 100%; }

        /* Chat View */
        .chat-view { display: flex; flex-direction: column; height: calc(100vh - 220px); }
        .chat-window { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 1.5rem; padding-bottom: 1.5rem; }
        .chat-bubble-container { display: flex; width: 100%; }
        .chat-bubble-container.user { justify-content: flex-end; }
        .chat-bubble { max-width: 80%; padding: 1.25rem; background: var(--white); border-radius: 1.25rem; border: 1px solid var(--border); box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
        .user .chat-bubble { background: var(--primary); color: white; border: none; }
        .bubble-meta { font-size: 0.7rem; font-weight: 950; color: var(--muted); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; }
        
        .bubble-text p { margin: 0 0 1rem; line-height: 1.6; }
        .tamil-k-header { color: var(--primary); font-weight: 900; margin: 1rem 0 0.5rem; border-left: 4px solid var(--primary); padding-left: 1rem; }
        .tamil-verse { font-weight: 950; font-size: 1.1rem; background: #f8fafc; padding: 1rem; border-radius: 1rem; color: #334155; }
        .tamil-exp { color: #475569; margin-bottom: 1rem; font-weight: 600; line-height: 1.5; }

        .kural-source-cards { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1.5rem; border-top: 1px solid #f1f5f9; padding-top: 1.5rem; }
        .kural-mini-card { 
           display: flex; align-items: center; justify-content: space-between; 
           background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 1.25rem; 
           padding: 1.25rem 1.5rem; cursor: pointer; transition: 0.3s; 
        }
        .kural-mini-card:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); border-color: #7dd3fc; }
        .k-mini-info { flex: 1; }
        .k-mini-num { display: block; font-size: 0.75rem; font-weight: 900; color: #0369a1; margin-bottom: 0.5rem; opacity: 0.8; }
        .k-mini-lines p { margin: 0; font-size: 1.15rem; font-weight: 950; color: #0c4a6e; line-height: 1.4; }
        .k-mini-arrow { color: #0369a1; opacity: 0.5; margin-left: 1rem; }

        .chat-input-row { padding-top: 1rem; }
        .tamil-input-box { display: flex; background: var(--white); padding: 0.4rem; border: 2px solid var(--border); border-radius: 3rem; align-items: center; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .tamil-input-box input { flex: 1; border: none; outline: none; padding: 0.4rem 1.25rem; font-size: 1rem; }
        .tamil-input-box button { background: var(--primary); color: white; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; }

        /* Library Cards */
        .paal-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .paal-card { background: white; padding: 2.5rem; border-radius: 1.5rem; border: 1px solid var(--border); text-align: center; cursor: pointer; transition: 0.3s; }
        .paal-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.05); }
        .paal-card.aram { border-top: 6px solid #fbbf24; }
        .paal-card.porul { border-top: 6px solid #10b981; }
        .paal-card.inbam { border-top: 6px solid #ef4444; }
        .paal-card h3 { font-size: 1.4rem; margin: 0 0 0.5rem; }
        .paal-card p { margin: 0; font-weight: 700; color: var(--muted); font-size: 0.9rem; }

        .library-resource-header-box { margin-bottom: 3rem; background: #f8fafc; padding: 2.5rem; border-radius: 2rem; border: 1px solid var(--border); }
        .res-title-main { display: flex; align-items: center; gap: 10px; font-size: 1.25rem; font-weight: 950; margin-bottom: 2rem; color: var(--primary); }
        .library-section-title { font-size: 1.1rem; font-weight: 950; color: #64748b; margin-bottom: 1.5rem; text-transform: uppercase; letter-spacing: 1px; }

        .res-grid-premium { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .res-card-v2 { 
           display: flex; align-items: center; gap: 1.25rem; background: white; 
           padding: 1.5rem; border-radius: 1.5rem; text-decoration: none; 
           border: 1px solid var(--border); transition: 0.3s;
        }
        .res-card-v2:hover { border-color: var(--primary); transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .res-ico { color: var(--primary); }
        .res-card-text { display: flex; flex-direction: column; }
        .res-card-text strong { font-size: 1rem; color: #1e293b; font-weight: 950; }
        .res-card-text span { font-size: 0.8rem; color: #64748b; font-weight: 700; }

        .chapter-view { display: flex; flex-direction: column; }
        .tamil-back { background: none; border: none; color: var(--primary); font-weight: 900; cursor: pointer; display: flex; align-items: center; gap: 8px; margin-bottom: 1.5rem; text-transform: uppercase; font-size: 0.75rem; }
        .chapter-header-text { font-size: 1.8rem; font-weight: 950; margin-bottom: 1.5rem; }
        .chapter-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0.75rem; }
        .chapter-tile { background: white; border: 1px solid var(--border); padding: 1rem; border-radius: 1rem; font-weight: 800; text-align: left; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 8px; font-size: 0.9rem; }
        .chapter-tile span { opacity: 0.3; font-size: 0.7rem; }
        .chapter-tile:hover { border-color: var(--primary); background: #fdf5f2; }

        .kural-grid-stack { display: flex; flex-direction: column; gap: 1rem; }
        .kural-item-card { background: white; border: 1.5px solid var(--border); padding: 1.5rem; border-radius: 1.5rem; cursor: pointer; transition: 0.3s; }
        .kural-item-card:hover { border-color: var(--primary); transform: translateX(5px); }
        .kural-item-card p { margin: 0; font-weight: 900; font-size: 1.1rem; }
        .k-header-row { font-size: 0.7rem; font-weight: 950; color: var(--primary); margin-bottom: 0.5rem; opacity: 0.6; }

        /* Modals - Fixed and optimized */
        .tamil-modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.8); backdrop-filter: blur(8px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 1rem; }
        .tamil-modal { background: white; padding: 2rem 3rem; border-radius: 2.5rem; width: 100%; max-width: 950px; max-height: 92vh; overflow-y: auto; box-shadow: 0 40px 80px rgba(0,0,0,0.3); position: relative; }
        .m-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; position: sticky; top: -2rem; background: white; padding-top: 1rem; padding-bottom: 1rem; z-index: 10; border-bottom: 1px solid #f1f5f9; }
        .m-badge { background: #fff7ed; color: var(--primary); padding: 0.5rem 1.25rem; border-radius: 2rem; font-weight: 950; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; border: 1px solid #ffedd5; }
        .m-verse-box { 
           background: #fffaf2; padding: 4.5rem 8%; border-radius: 4rem; 
           margin-bottom: 3.5rem; border: 1.5px solid #fde68a; text-align: center; 
           box-shadow: inset 0 0 80px rgba(154,52,18,0.03), 0 20px 40px rgba(0,0,0,0.02); 
           width: 100%; overflow: hidden;
        }
        .m-verse-box h3 { 
           font-size: clamp(0.9rem, 2.8vw, 1.8rem); 
           margin: 0; line-height: 1.4; font-weight: 950; 
           color: #431407; letter-spacing: -0.04em; 
           white-space: nowrap; text-rendering: optimizeLegibility;
        }
        .m-verse-box h3:first-child { margin-bottom: 2rem; }
        .m-explanations-stack { display: flex; flex-direction: column; gap: 2rem; }
        .e-block h5 { margin: 0 0 0.6rem; color: var(--primary); font-weight: 950; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 8px; }
        .e-block p { margin: 0; font-size: 1.25rem; line-height: 1.6; font-weight: 700; color: #1e293b; }
        .e-block.en { background: #f8fafc; padding: 2rem; border-radius: 1.5rem; border-left: 6px solid var(--primary); }
        .e-block.en p { color: #475569; font-style: italic; font-weight: 800; font-size: 1.1rem; }

        /* History - Premium Museum Layout V2 */
        .history-view { max-width: 1100px; margin: 0 auto; width: 100%; padding-bottom: 5rem; }
        
        .history-hero { 
          text-align: center; padding: 6rem 2rem; margin-bottom: 4rem; position: relative; 
          background: #fff; border-radius: 3rem; overflow: hidden; border: 1px solid #f1f5f9;
          box-shadow: 0 20px 50px rgba(0,0,0,0.03);
        }
        .h-hero-bg { 
          position: absolute; inset: 0; opacity: 0.05; pointer-events: none;
          background-image: radial-gradient(#9a3412 1px, transparent 1px);
          background-size: 30px 30px;
        }
        .h-decorator { width: 80px; height: 5px; background: linear-gradient(90deg, var(--primary), var(--accent)); margin: 0 auto 2rem; border-radius: 10px; }
        .h-title { font-size: 3rem; font-weight: 950; color: #1e293b; margin: 0 0 1.5rem; letter-spacing: -0.02em; line-height: 1.2; }
        .h-subtitle { font-size: 1.1rem; color: var(--primary); font-weight: 950; text-transform: uppercase; letter-spacing: 0.15em; }
        
        .h-hero-stats { display: flex; justify-content: center; gap: 2rem; margin-top: 3.5rem; flex-wrap: wrap; }
        .h-hero-stat-card { 
          background: #fdfcfa; padding: 2rem 3rem; border-radius: 2rem; border: 1px solid #f1f5f9;
          box-shadow: 0 10px 25px rgba(0,0,0,0.02); min-width: 200px;
        }
        .h-stat-num { display: block; font-size: 2.5rem; font-weight: 950; color: var(--primary); margin-bottom: 0.5rem; }
        .h-stat-lbl { font-size: 0.85rem; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }

        .h-section-split { margin: 4rem 0; }
        .h-card-premium { 
          display: flex; background: white; border-radius: 3rem; overflow: hidden; 
          border: 1px solid #f1f5f9; box-shadow: 0 30px 60px rgba(0,0,0,0.05);
        }
        .h-img-container { flex: 1; position: relative; min-height: 400px; }
        .h-main-img { width: 100%; height: 100%; object-fit: cover; }
        .h-img-badge { 
          position: absolute; top: 2rem; left: 2rem; background: var(--primary); color: white; 
          padding: 0.6rem 1.5rem; border-radius: 2rem; font-weight: 950; font-size: 0.8rem;
          box-shadow: 0 10px 20px rgba(154,52,18,0.3);
        }
        .h-content-box { flex: 1.2; padding: 4rem; display: flex; flex-direction: column; justify-content: center; }
        .h-label-top { color: var(--primary); font-weight: 950; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 1rem; }
        .h-content-box h3 { font-size: 2.2rem; margin: 0 0 1.5rem; color: #0f172a; font-weight: 950; }
        .h-content-box p { font-size: 1.15rem; line-height: 1.8; color: #475569; margin-bottom: 2rem; font-weight: 600; }
        
        .h-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .h-info-item { display: flex; gap: 1rem; align-items: flex-start; }
        .h-icon { color: var(--primary); background: #fff7ed; padding: 0.75rem; border-radius: 1rem; box-sizing: content-box; }
        .h-info-item strong { display: block; font-size: 0.85rem; color: #1e293b; margin-bottom: 0.25rem; }
        .h-info-item span { font-size: 0.9rem; color: #64748b; font-weight: 800; }

        .h-pillars-section { padding: 6rem 0; }
        .h-section-header-center { text-align: center; margin-bottom: 4rem; }
        .h-label { display: block; font-size: 0.75rem; font-weight: 950; color: var(--primary); text-transform: uppercase; letter-spacing: 3px; margin-bottom: 1rem; }
        .h-section-header-center h3 { font-size: 2.4rem; font-weight: 950; }
        
        .h-pillars-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        .h-pillar-card { 
          background: white; padding: 3rem 2rem; border-radius: 2.5rem; text-align: center;
          border: 1px solid #f1f5f9; box-shadow: 0 15px 35px rgba(0,0,0,0.03); transition: 0.4s;
        }
        .h-pillar-card:hover { transform: translateY(-10px); border-color: var(--primary); }
        .p-icon { 
          width: 70px; height: 70px; background: #fdfcfa; color: var(--primary); 
          border-radius: 2rem; display: flex; align-items: center; justify-content: center; 
          margin: 0 auto 2rem; box-shadow: 0 10px 20px rgba(0,0,0,0.03);
        }
        .h-pillar-card h4 { font-size: 1.6rem; margin: 0 0 0.5rem; color: #1e293b; font-weight: 950; }
        .h-pillar-card p { font-size: 0.9rem; color: var(--primary); font-weight: 950; margin-bottom: 1.5rem; }
        .p-desc { font-size: 0.95rem; color: #64748b; line-height: 1.6; font-weight: 700; }
        .h-pillar-card.aram { border-top: 6px solid #fbbf24; }
        .h-pillar-card.porul { border-top: 6px solid #10b981; }
        .h-pillar-card.inbam { border-top: 6px solid #ef4444; }

        .h-timeline-vertical-section { margin: 6rem 0; padding: 4rem; background: #fff; border-radius: 3rem; border: 1px solid #f1f5f9; }
        .h-v-timeline { position: relative; padding-left: 3rem; margin-top: 4rem; }
        .h-tl-line { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: #f1f5f9; border-radius: 2px; }
        .h-tl-node-item { position: relative; padding-bottom: 4rem; }
        .h-tl-node-item:last-child { padding-bottom: 0; }
        .h-tl-marker { 
          position: absolute; left: -35px; top: 0; width: 14px; height: 14px; 
          background: white; border: 4px solid #f1f5f9; border-radius: 50%; z-index: 2;
          transition: 0.3s;
        }
        .h-tl-node-item.active .h-tl-marker { border-color: var(--primary); background: var(--primary); box-shadow: 0 0 15px rgba(154,52,18,0.4); }
        .h-tl-year { 
          position: absolute; left: -140px; top: -3px; width: 100px; text-align: right;
          font-weight: 950; color: var(--primary); font-size: 0.9rem;
        }
        .h-tl-info h4 { margin: 0 0 0.5rem; font-size: 1.3rem; color: #1e293b; font-weight: 950; }
        .h-tl-info p { margin: 0; color: #64748b; font-weight: 700; line-height: 1.5; font-size: 1rem; }

        .h-manuscript-feature { margin: 6rem 0; background: #1e293b; border-radius: 4rem; padding: 5rem; color: white; position: relative; overflow: hidden; }
        .h-feature-content { display: flex; gap: 4rem; align-items: center; position: relative; z-index: 2; }
        .h-img-glow { flex: 1; position: relative; border-radius: 2rem; overflow: hidden; box-shadow: 0 0 50px rgba(0,0,0,0.5); }
        .h-img-glow img { width: 100%; height: 400px; object-fit: cover; }
        .h-feature-text { flex: 1.2; }
        .h-feature-text h3 { font-size: 2.5rem; margin: 1rem 0 1.5rem; color: #fbbf24; font-weight: 950; }
        .h-feature-text p { font-size: 1.2rem; line-height: 1.8; color: #cbd5e1; font-weight: 700; margin-bottom: 1.5rem; }

        .h-global-influence { padding: 6rem 0; }
        .h-influence-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-top: 4rem; }
        .h-influence-card { 
          background: #fff; border-radius: 2rem; padding: 2rem; border: 1px solid #f1f5f9;
          box-shadow: 0 10px 30px rgba(0,0,0,0.02);
        }
        .h-influence-card strong { display: block; color: var(--primary); margin-bottom: 0.75rem; font-size: 1.1rem; }
        .h-influence-card p { margin: 0; color: #475569; font-weight: 700; line-height: 1.7; font-size: 1rem; }
        
        .h-mega-quote { 
          margin-top: 5rem; text-align: center; padding: 5rem; background: #fff7ed; 
          border-radius: 4rem; position: relative; border: 1px solid #ffedd5;
        }
        .h-q-icon { position: absolute; top: 2rem; left: 50%; transform: translateX(-50%); color: var(--primary); opacity: 0.1; }
        .h-mega-quote blockquote { 
          font-size: 2rem; font-weight: 950; color: #431407; font-style: italic; 
          margin: 0; position: relative; line-height: 1.4;
        }

        .h-resources-v2 { text-align: center; margin-top: 6rem; padding: 4rem; background: #fff; border-radius: 3rem; border: 1px solid #f1f5f9; }
        .h-resources-v2 h3 { margin-bottom: 2.5rem; font-weight: 950; font-size: 1.8rem; }
        .h-links-flex { display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap; }
        .h-link { 
          display: flex; align-items: center; gap: 10px; padding: 1rem 2rem; 
          background: #fdfcfa; border: 1px solid #e2e8f0; border-radius: 1.5rem;
          color: #1e293b; text-decoration: none; font-weight: 950; transition: 0.3s;
        }
        .h-link:hover { border-color: var(--primary); color: var(--primary); transform: translateY(-5px); }

        .h-footer-premium { 
          margin-top: 6rem; padding: 8rem 4rem; background: #0f172a; border-radius: 5rem; 
          color: white; text-align: center; position: relative; overflow: hidden;
        }
        .h-footer-premium h3 { font-size: 2.5rem; margin-bottom: 1.5rem; color: #fbbf24; font-weight: 950; }
        .h-footer-premium p { font-size: 1.25rem; font-weight: 800; color: #94a3b8; max-width: 800px; margin: 0 auto 3rem; }
        .h-srm-badge { 
          display: inline-block; padding: 0.75rem 2rem; background: rgba(255,255,255,0.05); 
          border-radius: 2rem; font-weight: 950; color: #64748b; text-transform: uppercase; 
          letter-spacing: 2px; font-size: 0.8rem; border: 1px solid rgba(255,255,255,0.1);
        }

        @media (max-width: 992px) {
          .h-card-premium { flex-direction: column; }
          .h-pillars-grid, .h-influence-grid { grid-template-columns: 1fr; }
          .h-title { font-size: 2.2rem; }
          .h-v-timeline { padding-left: 1.5rem; }
          .h-tl-year { position: static; text-align: left; margin-bottom: 0.5rem; display: block; }
          .h-feature-content { flex-direction: column; }
          .h-content-box { padding: 3rem 2rem; }
        }

        .tamil-loading { text-align: center; font-weight: 900; color: var(--primary); animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }

        .init-progress-bar { padding: 1.5rem; background: #fffbeb; border: 1px solid #fef3c7; border-radius: 1.5rem; margin-bottom: 2rem; }
        .p-label { font-size: 0.85rem; font-weight: 900; color: #92400e; margin-bottom: 0.75rem; }
        .p-track { height: 8px; background: #fef3c7; border-radius: 10px; overflow: hidden; }
        .p-fill { height: 100%; background: var(--primary); transition: width 0.3s; }

        .auto-trans-status {
          font-size: 0.7rem;
          color: var(--muted);
          margin-top: 0.5rem;
          margin-left: 1.5rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .main-header { padding: 1rem; }
          .header-top-row { gap: 1rem; margin-bottom: 1rem; }
          .srm-logo-top { width: 50px; height: 50px; }
          .main-title { font-size: 1.2rem; }
          .sub-title { font-size: 0.7rem; }
          
          .nav-scroll-wrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; margin: 0 -1rem; padding: 0 1rem; }
          .header-nav-tabs { width: max-content; gap: 0.5rem; }
          .header-nav-tabs button { padding: 0.6rem 1rem; font-size: 0.8rem; }
          
          .content-container { padding: 1rem; }
          .chat-view { height: calc(100vh - 180px); }
          .chat-window { gap: 1rem; }
          .chat-bubble { max-width: 90%; padding: 1rem; }
          
          .paal-cards { grid-template-columns: 1fr; gap: 1rem; }
          .paal-card { padding: 1.5rem; }
          
          .tamil-modal { padding: 1.5rem; border-radius: 1.5rem; width: 95%; max-height: 85vh; }
          .m-verse-box { padding: 1.5rem 1rem; margin-bottom: 1.5rem; }
          .m-verse-box h3 { font-size: 1.3rem; }
          .e-block p { font-size: 1.1rem; }
          .e-block.en p { font-size: 1rem; }
          
          .h-title { font-size: 1.8rem; }
          .h-stat-num { font-size: 1.8rem; }
          .h-hero-stat-card { min-width: 120px; padding: 1rem; }
          .h-content-box { padding: 2rem 1.5rem; }
          .h-content-box h3 { font-size: 1.6rem; }
          .h-info-grid { grid-template-columns: 1fr; gap: 1rem; }
          .h-pillars-section { padding: 3rem 0; }
          .h-section-header-center h3 { font-size: 1.7rem; }
          
          .res-grid-premium { grid-template-columns: 1fr; }
          .library-resource-header-box { padding: 1.5rem; margin-bottom: 2rem; }
          .library-section-title { font-size: 0.9rem; }
          
          .h-pillar-card { padding: 2rem 1.5rem; }
          .h-v-timeline { padding-left: 1.5rem; }
          .h-tl-year { position: static; text-align: left; margin-bottom: 0.5rem; }
          .h-tl-marker { left: -25px; }
          .h-manuscript-feature { padding: 2rem; border-radius: 2rem; }
          .h-img-glow img { height: 250px; }
          .h-feature-text h3 { font-size: 1.6rem; }
          .h-feature-text p { font-size: 1rem; }
          .h-mega-quote { padding: 2rem; border-radius: 2rem; }
          .h-mega-quote blockquote { font-size: 1.3rem; }
          .h-footer-premium { padding: 4rem 2rem; border-radius: 2rem; }
          .h-footer-premium h3 { font-size: 1.6rem; }
          .h-footer-premium p { font-size: 1rem; }
        }
      `}} />
      </div>
   );
};

export default App;
