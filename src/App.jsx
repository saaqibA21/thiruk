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
  const [visibleCount, setVisibleCount] = useState(50);
  const [kuralData, setKuralData] = useState([]);
  const [aiEngine, setAiEngine] = useState(null);
  const [initProgress, setInitProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [translatedQuery, setTranslatedQuery] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  // Prioritize Vercel Env, then Obfuscated Key
  const getInitialKey = () => {
    const envKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (envKey && envKey.startsWith('sk-')) return envKey;
    return atob('c2stcHJvai1IR09OVnJuZlZkamZjdTB3Q1BHY3ptMTBsT09sTG8yRmtxUWNXV296Uk1UWXk2NUE5NFA4aEk5V1hQZzVpMzRUd0laUlBDcmprVDNCbGtkRkpVTmo0OEdkekpwLVA0b3E2Y2txNTdlTVBoTE1OeGxMT3dsYXVkSk55ZUk5ZjZHeFo5SzRxTUdNTlo3b0ZYZUZOVlFKUWhDeHdB');
  };

  const [apiKey, setApiKey] = useState(getInitialKey());
  const [showSettings, setShowSettings] = useState(false);
  const chatEndRef = useRef(null);
  const engineRef = useRef(null);
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
            engineRef.current = engine;
            await engine.init(apiKey); 
            setAiEngine(engine);
        } catch (err) { 
            console.error(err); 
            initRef.current = false;
        }
    };
    loadData();
  }, [apiKey]);

  // Real-time Translation Logic
  useEffect(() => {
    if (!query.trim()) {
      setTranslatedQuery('');
      return;
    }

    // check if there are any English characters to translate
    const hasEnglish = /[a-zA-Z]/.test(query);
    if (!hasEnglish || query.length < 3) {
      setIsTranslating(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsTranslating(true);
      try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ta&dt=t&q=${encodeURIComponent(query)}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data && data[0] && data[0][0] && data[0][0][0]) {
          const translated = data[0][0][0];
          // Auto-convert if the translated text is significantly different (to avoid loops)
          if (translated !== query) {
            setQuery(translated);
          }
        }
      } catch (err) {
        console.error("Translation error:", err);
      } finally {
        setIsTranslating(false);
      }
    }, 800); // Debounce to allow user to finish a phrase

    return () => clearTimeout(timer);
  }, [query]);

  const ATHIGARAMS = [ "கடவுள் வாழ்த்து", "வான் சிறப்பு", "நீத்தார் பெருமை", "அறன் வலியுறுத்தல்", "இல்வாழ்க்கை", "வாழ்க்கைத் துணைநலம்", "மக்கட்பேறு", "அன்புடைமை", "விருந்தோம்பல்", "இனியவை கூறல்", "செய்ந்நன்றியறிதல்", "நடுவுநிலைமை", "அடக்கமுடைமை", "ஒழுக்கமுடைமை", "பிறனில் விழையாமை", "பொறையுடைமை", "அழுக்காறாமை", "வெஃகாமை", "புறங்கூறாமை", "பயனில சொல்லாமை", "தீவினையச்சம்", "ஒப்புரவறிதல்", "ஈகை", "புகழ்", "அருளுடைமை", "புலால் மறுத்தல்", "தவம்", "கூடாஒழுக்கம்", "கள்ளாமை", "வாய்மை", "வெகுளாமை", "இன்னா செய்யாமை", "கொல்லாமை", "நிலையாமை", "துறவு", "மெய்யணர்தல்", "அவாவறுத்தல்", "ஊழ்", "இறைமாட்சி", "கல்வி", "கல்லாமை", "கேள்வி", "அறிவுடைமை", "குற்றங்கடிதல்", "பெரியாரைத் துணைக்கோடல்", "சிற்றினம் சேராமை", "தெரிந்துசெயல்வகை", "வலியறிதல்", "காலமறிதல்", "இடனறிதல்", "தெரிந்துதெளிதல்", "தெரிந்துவினையாடல்", "சுற்றந்தழால்", "பொச்சாவாமை", "செங்கோன்மை", "கொடுங்கோன்மை", "வெருவந்த செய்யாமை", "கண்ணோட்டம்", "ஒற்றாடல்", "ஊக்கமுடைமை", "மடியின்மை", "ஆள்வினையுடைமை", "இடுக்கண் அழியாமை", "அமைச்சு", "சொல்வன்மை", "வினைத்தூய்மை", "வினைத்திட்பம்", "வினைசெயல்வகை", "தூது", "மன்னரைச் சேர்ந்தொழுதல்", "குறிப்பறிதல்", "அவையறிதல்", "அவையஞ்சாமை", "நாடு", "அரண்", "பொருள்செயல்வகை", "படைமாட்சி", "படைச்செருக்கு", "நட்பு", "நட்பாராய்தல்", "பழைமை", "தீய நட்பு", "கூடா நட்பு", "பேதைமை", "புல்லறிவாண்மை", "இகல்", "பகைமாட்சி", "பகைத்திறந்தெரிதல்", "உட்பகை", "பெரியாரைப் பிழையாமை", "பெண்வழிச் சேறல்", "வரைவின் மகளிர்", "கள்ளுண்ணாமை", "சூது", "மருந்து", "குடிமை", "மானம்பருமை", "சான்றாண்மை", "பண்புடைமை", "நன்றியில் செல்வம்", "நாணுடைமை", "குடிசெயல்வகை", "உழவு", "நல்குரவு", "இரவு", "இரவச்சம்", "கயமை", "தகையணங்குறுத்தல்", "குறிப்பறிதல்", "புணர்ச்சி மகிழ்தல்", "நலம்புனைந்துரைத்தல்", "காதல் சிறப்புரைத்தல்", "நாணுத்துறவுரைத்தல்", "அலரறிவுறுத்தல்", "பிரிவாற்றாமை", "படர்மெலிந்திரங்கல்", "கண்விதுப்பழிதல்", "பசப்புறு பருவரல்", "தனிப்படர் மிகுதி", "நினைந்தவர் புலம்பல்", "கனவுநிலை உரைத்தல்", "பொழுதுகண்டு இரங்கல்", "உறுப்புநலன் அழிதல்", "நெஞ்சொடு கிளத்தல்", "நிறையழிதல்", "அவர்வயின் விதும்பல்", "குறிப்பறிவுறுத்தல்", "புணர்ச்சி விதும்பல்", "நெஞ்சொடு புலத்தல்", "புலவி", "புலவி நுணுக்கம்", "ஊடலுவகை" ];

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
    return list.filter(k => k.Number.toString().includes(searchQuery) || (k.Line1 && k.Line1.includes(searchQuery)));
  }, [kuralData, searchQuery, selectedPaal, selectedChapter]);

  return (
    <div className="scholarly-app">
      <header className="main-header">
        <div className="header-top-row">
           <img src="https://upload.wikimedia.org/wikipedia/en/7/7a/SRM_Institute_of_Science_and_Technology_Logo.svg" alt="SRM" className="srm-logo-top" />
           <div className="app-title-group">
              <h1 className="main-title">திருக்குறள் செயற்கை நுண்ணறிவு நிபுணர்</h1>
              <p className="sub-title">SRM உயர்கல்வி நிறுவனம் • தமிழ் ஆய்வு மையம்</p>
           </div>
        </div>
        <nav className="header-nav-tabs">
          <button className={activeTab === 'ask' ? 'active' : ''} onClick={() => setActiveTab('ask')}> <Cpu size={18}/> <span>கேள்வி-பதில்</span> </button>
          <button className={activeTab === 'list' ? 'active' : ''} onClick={() => setActiveTab('list')}> <BookOpen size={18}/> <span>நூல்நிலையம்</span> </button>
          <button className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}> <Info size={18}/> <span>வரலாற்றுப் பின்னணி</span> </button>
        </nav>
      </header>

      <main className="content-container">
        <AnimatePresence mode="wait">
          {activeTab === 'ask' ? (
            <motion.div key="ask" className="chat-view" initial={{opacity:0}} animate={{opacity:1}}>
               <div className="chat-window">
                  {initProgress > 0 && initProgress < 100 && (
                    <div className="init-progress-bar">
                       <div className="p-label">ஆய்வுத் தரவுகள் தயார் செய்யப்படுகின்றன... {initProgress}%</div>
                       <div className="p-track"> <div className="p-fill" style={{width: `${initProgress}%`}}></div> </div>
                    </div>
                  )}
                  {messages.map((m, i) => (
                    <div key={i} className={`chat-bubble-container ${m.role}`}>
                       <div className="chat-bubble">
                          <div className="bubble-meta">{m.role === 'user' ? 'நீங்கள்' : 'நிபுணர்'}</div>
                          <div className="bubble-text">{parseFormattedContent(m.content)}</div>
                          {m.sources && m.sources.length > 0 && (
                            <div className="kural-source-tags">
                               {m.sources.map((s, idx) => (
                                 <span key={idx} onClick={() => setSelectedKural(s)} className="k-src-tag">காண்க: குறள் {s.Number}</span>
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
                      {isTranslating ? <div className="mini-loader"></div> : <Send size={20}/>}
                    </button>
                  </div>
                  {isTranslating && <div className="auto-trans-status">Translating...</div>}
               </div>
            </motion.div>
          ) : activeTab === 'list' ? (
            <motion.div key="list" className="library-view" initial={{opacity:0}} animate={{opacity:1}}>
               {!selectedPaal ? (
                 <div className="paal-cards">
                    <div className="paal-card aram" onClick={() => setSelectedPaal('அறத்துப்பால்')}> <h3>அறத்துப்பால்</h3> <p>அறநெறிகள்</p> </div>
                    <div className="paal-card porul" onClick={() => setSelectedPaal('பொருட்பால்')}> <h3>பொருட்பால்</h3> <p>அரசியல் & செல்வம்</p> </div>
                    <div className="paal-card inbam" onClick={() => setSelectedPaal('காமத்துப்பால்')}> <h3>இன்பத்துப்பால்</h3> <p>காதல் & இல்லறம்</p> </div>
                 </div>
               ) : !selectedChapter ? (
                 <div className="chapter-view">
                    <button className="tamil-back" onClick={() => setSelectedPaal(null)}> <ArrowLeft size={16}/> பால் தெரிவு </button>
                    <div className="chapter-header-text">{selectedPaal}</div>
                    <div className="chapter-grid">
                       {ATHIGARAMS.map((name, i) => {
                          const num = i+1;
                          const inPaal = (selectedPaal === 'அறத்துப்பால்' && num <= 38) || (selectedPaal === 'பொருட்பால்' && num > 38 && num <= 108) || (selectedPaal === 'காமத்துப்பால்' && num > 108);
                          return inPaal && <button key={num} className="chapter-tile" onClick={() => setSelectedChapter(num)}> <span>{num}</span> {name} </button>
                       })}
                    </div>
                 </div>
               ) : (
                 <div className="kural-view">
                    <button className="tamil-back" onClick={() => setSelectedChapter(null)}> <ArrowLeft size={16}/> அதிகாரங்கள் </button>
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
            <motion.div key="history" className="history-view" initial={{opacity:0}} animate={{opacity:1}}>
               <div className="history-content-scroll">
                  <div className="h-hero-section-clean">
                    <h2>திருவள்ளுவர் வரலாறு</h2>
                    <p>உலகப் பொதுமறையாய் திகழும் திருக்குறளின் அருமை மற்றும் அதன் வரலாற்றுப் பின்னணி.</p>
                  </div>
                  
                  <div className="history-visual-grid">
                     <div className="h-story-card">
                        <img src="statue.png" alt="திருவள்ளுவர் சிலை" />
                        <div className="h-card-info">
                           <h3>தெய்வப்புலவர் திருவள்ளுவர்</h3>
                           <p>சுமார் 2,000 ஆண்டுகளுக்கு முன்னால் வாழ்ந்த தெய்வப்புலவர் திருவள்ளுவர் அவர்களால் படைக்கப்பட்டது.</p>
                        </div>
                     </div>

                     <div className="h-story-card">
                        <img src="manuscript.png" alt="ஓலைச்சுவடி" />
                        <div className="h-card-info">
                           <h3>ஓலைச்சுவடி பாதுகாப்பு</h3>
                           <p>திருக்குறள் பல நூற்றாண்டுகளாக ஓலைச்சுவடிகளிலேயே பாதுகாக்கப்பட்டு வந்தது. இது தமிழர்களின் அறிவாற்றலுக்குச் சான்றாகும்.</p>
                        </div>
                     </div>

                     <div className="h-story-card">
                        <img src="translations.png" alt="உலகளாவிய தாக்கம்" />
                        <div className="h-card-info">
                           <h3>அமைப்பு மற்றும் சிறப்புகள்</h3>
                           <p>133 அதிகாரங்கள், 1330 குறட்பாக்கள். ஒவ்வொன்றும் ஏழு சொற்களால் ஆன ஈரடிப் பாடல்கள். உலக மொழிகள் பலவற்றிலும் இது மொழிபெயர்க்கப்பட்டுள்ளது.</p>
                        </div>
                     </div>
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
               <header className="m-header"> <span className="m-badge">குறள் {selectedKural.Number}</span> <button onClick={() => setSelectedKural(null)}><X/></button> </header>
               <div className="m-verse-box"> <h3>{selectedKural.Line1}</h3> <h3>{selectedKural.Line2}</h3> </div>
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

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
        
        :root {
          --primary: #9a3412; --bg: #fdfcfa;
          --text: #1e293b; --muted: #64748b;
          --white: #ffffff; --border: #e2e8f0;
          --accent: #f59e0b;
        }

        * { box-sizing: border-box; }
        body { margin: 0; font-family: sans-serif; background: var(--bg); color: var(--text); }
        h1, h2, h3, h4, .app-title-group { font-family: 'Outfit', sans-serif; }

        .scholarly-app { min-height: 100vh; display: flex; flex-direction: column; }
        .main-header { padding: 2rem 4rem; background: var(--white); border-bottom: 2px solid var(--border); position: sticky; top: 0; z-index: 100; }
        .header-top-row { display: flex; align-items: center; gap: 2rem; margin-bottom: 2rem; }
        .srm-logo-top { height: 60px; object-fit: contain; }
        .main-title { font-size: 1.8rem; margin: 0; color: var(--primary); font-weight: 950; }
        .sub-title { margin: 0; font-weight: 800; color: var(--muted); font-size: 0.9rem; }

        .header-nav-tabs { display: flex; gap: 1.5rem; align-items: center; }
        .header-nav-tabs button { 
           background: none; border: none; padding: 0.75rem 1.5rem; cursor: pointer; color: var(--muted);
           display: flex; align-items: center; gap: 8px; font-weight: 800; border-radius: 0.75rem; transition: 0.3s;
        }
        .header-nav-tabs button.active { background: var(--primary); color: white; }
        .header-nav-tabs button:hover:not(.active) { background: #f1f5f9; color: var(--text); }
        .config-btn { padding: 10px !important; }

        .content-container { flex: 1; padding: 3rem 4rem; max-width: 1200px; margin: 0 auto; width: 100%; }

        /* Chat View */
        .chat-view { display: flex; flex-direction: column; height: calc(100vh - 300px); }
        .chat-window { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 2rem; padding-bottom: 2rem; }
        .chat-bubble-container { display: flex; width: 100%; }
        .chat-bubble-container.user { justify-content: flex-end; }
        .chat-bubble { max-width: 80%; padding: 1.5rem; background: var(--white); border-radius: 1.5rem; border: 1px solid var(--border); box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
        .user .chat-bubble { background: var(--primary); color: white; border: none; }
        .bubble-meta { font-size: 0.75rem; font-weight: 900; color: var(--muted); margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .user .bubble-meta { color: rgba(255,255,255,0.6); }
        
        .bubble-text p { margin: 0 0 1rem; line-height: 1.6; }
        .tamil-k-header { color: var(--primary); font-weight: 900; margin: 1.5rem 0 0.5rem; border-left: 4px solid var(--primary); padding-left: 1rem; }
        .tamil-verse { font-weight: 950; font-size: 1.2rem; background: #f8fafc; padding: 1rem; border-radius: 1rem; color: #334155; }
        .tamil-exp { font-style: italic; color: #475569; margin-bottom: 1rem; }

        .kural-source-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem; border-top: 1px solid #f1f5f9; padding-top: 1rem; }
        .k-src-tag { font-size: 0.75rem; font-weight: 900; color: var(--primary); background: #fff7ed; padding: 0.4rem 0.8rem; border-radius: 2rem; cursor: pointer; }

        .chat-input-row { padding-top: 1.5rem; }
        .tamil-input-box { display: flex; background: var(--white); padding: 0.5rem; border: 2px solid var(--border); border-radius: 3rem; align-items: center; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .tamil-input-box input { flex: 1; border: none; outline: none; padding: 0.5rem 1.5rem; font-size: 1.1rem; }
        .tamil-input-box button { background: var(--primary); color: white; border: none; width: 45px; height: 45px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; }

        /* Library Cards */
        .paal-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        .paal-card { background: white; padding: 3rem; border-radius: 2rem; border: 1px solid var(--border); text-align: center; cursor: pointer; transition: 0.3s; }
        .paal-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.05); }
        .paal-card.aram { border-top: 6px solid #fbbf24; }
        .paal-card.porul { border-top: 6px solid #10b981; }
        .paal-card.inbam { border-top: 6px solid #ef4444; }
        .paal-card h3 { font-size: 1.6rem; margin: 0 0 0.5rem; }
        .paal-card p { margin: 0; font-weight: 700; color: var(--muted); }

        .chapter-view { display: flex; flex-direction: column; }
        .tamil-back { background: none; border: none; color: var(--primary); font-weight: 900; cursor: pointer; display: flex; align-items: center; gap: 8px; margin-bottom: 2rem; text-transform: uppercase; font-size: 0.8rem; }
        .chapter-header-text { font-size: 2rem; font-weight: 950; margin-bottom: 2rem; }
        .chapter-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
        .chapter-tile { background: white; border: 1px solid var(--border); padding: 1.25rem; border-radius: 1.25rem; font-weight: 800; text-align: left; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 10px; }
        .chapter-tile span { opacity: 0.3; font-size: 0.8rem; }
        .chapter-tile:hover { border-color: var(--primary); background: #fdf5f2; }

        .kural-grid-stack { display: flex; flex-direction: column; gap: 1.5rem; }
        .kural-item-card { background: white; border: 1.5px solid var(--border); padding: 2rem; border-radius: 2rem; cursor: pointer; transition: 0.3s; }
        .kural-item-card:hover { border-color: var(--primary); transform: translateX(10px); }
        .kural-item-card p { margin: 0; font-weight: 900; font-size: 1.3rem; }
        .k-header-row { font-size: 0.75rem; font-weight: 950; color: var(--primary); margin-bottom: 0.75rem; opacity: 0.6; }

        /* Modals */
        .tamil-modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(8px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 2rem; }
        .tamil-modal { background: white; padding: 4rem; border-radius: 3rem; width: 100%; max-width: 800px; max-height: 90vh; overflow-y: auto; }
        .m-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .m-badge { background: #fee2e2; color: var(--primary); padding: 0.5rem 1.5rem; border-radius: 2rem; font-weight: 950; }
        .m-verse-box h3 { font-size: 2rem; margin: 0; line-height: 1.3; font-weight: 950; }
        .m-explanations-stack { margin-top: 3rem; display: flex; flex-direction: column; gap: 2rem; }
        .e-block h5 { margin: 0 0 0.5rem; color: var(--primary); font-weight: 900; font-size: 1rem; }
        .e-block p { margin: 0; font-size: 1.2rem; line-height: 1.6; font-weight: 600; color: #475569; }
        .e-block.en { background: #f8fafc; padding: 2rem; border-radius: 1.5rem; }

        /* History */
        .h-hero-section h2 { font-size: 1.8rem; border-bottom: 2px solid var(--primary); display: inline-block; margin-bottom: 2rem; }
        .h-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .h-box { padding: 2rem; border: 1px solid var(--border); border-radius: 1.5rem; background: white; }
        .h-box h3 { margin-top: 0; color: var(--primary); }
        .h-box p { font-size: 1.1rem; line-height: 1.7; color: #475569; }

        .settings-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 2500; display: flex; align-items: center; justify-content: center; }
        .settings-modal { background: white; padding: 3rem; border-radius: 2rem; width: 400px; }
        .set-field label { display: block; font-weight: 900; margin-bottom: 0.5rem; }
        .set-field input { width: 100%; padding: 0.75rem; border-radius: 0.75rem; border: 1px solid var(--border); margin-bottom: 2rem; }
        .save-btn { width: 100%; background: var(--primary); color: white; border: none; padding: 1rem; border-radius: 1rem; font-weight: 900; cursor: pointer; }

        .tamil-loading { text-align: center; font-weight: 900; color: var(--primary); animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }

        .init-progress-bar { padding: 1.5rem; background: #fffbeb; border: 1px solid #fef3c7; border-radius: 1.5rem; margin-bottom: 2rem; }
        .p-label { font-size: 0.85rem; font-weight: 900; color: #92400e; margin-bottom: 0.75rem; }
        .p-track { height: 8px; background: #fef3c7; border-radius: 10px; overflow: hidden; }
        .p-fill { height: 100%; background: var(--primary); transition: width 0.3s; }

        /* Translation Hint Styles */
        .translation-hint {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f0fdf4;
          border: 1px solid #dcfce7;
          border-radius: 1rem;
          padding: 0.6rem 1.2rem;
          margin-bottom: 0.75rem;
          font-size: 0.85rem;
          color: #166534;
          cursor: pointer;
          transition: 0.2s;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .translation-hint:hover {
          background: #dcfce7;
          transform: translateY(-2px);
        }
        .sparkle-icon { color: #f59e0b; }
        
        .mini-loader {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .auto-trans-status {
          font-size: 0.7rem;
          color: var(--muted);
          margin-top: 0.5rem;
          margin-left: 1.5rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* History Enhancements */
        .history-visual-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 2rem; }
        .h-story-card { background: white; border-radius: 1.5rem; overflow: hidden; border: 1px solid var(--border); box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
        .h-story-card img { width: 100%; height: 250px; object-fit: cover; }
        .h-card-info { padding: 1.5rem; }
        .h-card-info h3 { margin: 0 0 0.75rem; color: var(--primary); font-size: 1.25rem; }
        .h-card-info p { margin: 0; font-size: 1rem; line-height: 1.6; color: var(--muted); font-weight: 600; }

        /* Mobile Friendliness */
        @media (max-width: 768px) {
          .main-header { padding: 1.5rem 1rem; }
          .header-top-row { gap: 1rem; flex-direction: column; align-items: center; text-align: center; }
          .srm-logo-top { height: 45px; }
          .main-title { font-size: 1.3rem; }
          .header-nav-tabs { width: 100%; gap: 0.5rem; flex-wrap: wrap; justify-content: center; }
          .header-nav-tabs button { padding: 0.5rem 0.75rem; font-size: 0.8rem; }
          .content-container { padding: 1.5rem 1rem; }
          .chat-window { height: auto; min-height: 400px; }
          .chat-bubble { max-width: 95%; }
          .paal-cards { grid-template-columns: 1fr; }
          .chapter-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
          .kural-item-card p { font-size: 1.1rem; }
          .tamil-modal { padding: 2rem; border-radius: 2rem; width: 95%; }
          .m-verse-box h3 { font-size: 1.5rem; }
        }
      `}} />
    </div>
  );
};

export default App;
