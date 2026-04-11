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

  useEffect(() => {
    if (!query.trim()) return;
    const hasEnglish = /[a-z]{2,}/i.test(query);
    if (!hasEnglish) {
      setIsTranslating(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsTranslating(true);
      try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ta&dt=t&q=${encodeURIComponent(query)}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data && data[0] && data[0][0] && data[0][0][0]) {
          const translated = data[0][0][0];
          if (translated !== query) {
            setQuery(translated);
          }
        }
      } catch (err) {
        console.error("Translation error:", err);
      } finally {
        setIsTranslating(false);
      }
    }, 800);

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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
               <div className="history-hero">
                  <motion.h2 initial={{y:20}} animate={{y:0}} className="h-title">திருக்குறள்: ஒரு மாபெரும் வரலாறு</motion.h2>
                  <p className="h-subtitle">2000 ஆண்டுகால ஞானம், உலகப் பொதுமறையின் மகத்துவம்.</p>
               </div>

               <div className="history-content-sections">
                  <section className="h-section alternate">
                     <div className="h-text-block">
                        <span className="h-label">படைப்பாளர்</span>
                        <h3>தெய்வப்புலவர் திருவள்ளுவர்</h3>
                        <p>திருவள்ளுவர் சுமார் 2,000 ஆண்டுகளுக்கு முன்பு வாழ்ந்த ஒரு ஒப்பற்ற ஞானி. இவரது பிறப்பு மற்றும் சமயம் குறித்து பல விவாதங்கள் இருந்தாலும், இவரது கருத்துக்கள் சாதி, மதம், இனம் கடந்து அனைவருக்குமான பொது நீதியாகத் திகழ்கின்றன.</p>
                        <ul className="h-list">
                           <li><strong>காலம்:</strong> கி.மு. 31 (திருவள்ளுவர் ஆண்டு)</li>
                           <li><strong>பட்டங்கள்:</strong> நாயனார், தேவர், முதற்பாவலர், தெய்வப்புலவர்.</li>
                        </ul>
                     </div>
                     <div className="h-image-wrap">
                        <img src="statue.png" alt="திருவள்ளுவர்" />
                     </div>
                  </section>

                  <section className="h-section">
                     <div className="h-image-wrap">
                        <img src="manuscript.png" alt="ஓலைச்சுவடி" />
                     </div>
                     <div className="h-text-block">
                        <span className="h-label">நூல் அமைப்பு</span>
                        <h3>முப்பாலில் அடங்கிய ஞானம்</h3>
                        <p>திருக்குறள் 133 அதிகாரங்களையும், அதிகாரத்திற்கு 10 குறள்கள் வீதம் 1330 குறட்பாக்களையும் கொண்டுள்ளது. இது அறம், பொருள், இன்பம் என்ற மூன்று பெரும் பிரிவுகளாக (முப்பால்) பிரிக்கப்பட்டுள்ளது.</p>
                        <div className="h-stats-grid">
                           <div className="h-stat"><span>133</span> அத்தியாயங்கள்</div>
                           <div className="h-stat"><span>1330</span> குறட்பாக்கள்</div>
                           <div className="h-stat"><span>7</span> சொற்கள்</div>
                        </div>
                     </div>
                  </section>

                  <section className="h-section alternate">
                     <div className="h-text-block">
                        <span className="h-label">உலகளாவியது</span>
                        <h3>உலகப் பொதுமறை</h3>
                        <p>திருக்குறள் பைபிள் மற்றும் குரானுக்கு அடுத்தபடியாக உலகிலேயே அதிக மொழிகளில் (80-க்கும் மேற்பட்ட மொழிகள்) மொழிபெயர்க்கப்பட்ட நூலாகும். இது மனித வாழ்வின் அனைத்து பரிமாணங்களையும் - அரசியல், பொருளாதாரம், குடும்பம், காதல் - தெளிவாக விளக்குகிறது.</p>
                        <p className="h-quote">"திருக்குறள் என்பது மனிதன் மனிதனாக வாழ, மனிதன் மனிதனுக்குச் சொன்ன உன்னத நெறி."</p>
                     </div>
                     <div className="h-image-wrap">
                        <img src="translations.png" alt="உலகத்தரம்" />
                     </div>
                  </section>
               </div>

               <div className="h-legacy-footer">
                  <h3>காலம் கடந்த வழிகாட்டி</h3>
                  <p>இன்று நவீன செயற்கை நுண்ணறிவு யுகத்திலும், திருக்குறள் நமக்கு வாழ்வியல் தீர்வுகளை வழங்குகிறது. SRM ஆய்வு மையம் இந்த டிஜிட்டல் தளத்தின் மூலம் திருவள்ளுவரின் புகழை உலகெங்கும் கொண்டு செல்கிறது.</p>
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

        .content-container { flex: 1; padding: 3rem 4rem; max-width: 1200px; margin: 0 auto; width: 100%; }

        /* Chat View */
        .chat-view { display: flex; flex-direction: column; height: calc(100vh - 300px); }
        .chat-window { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 2rem; padding-bottom: 2rem; }
        .chat-bubble-container { display: flex; width: 100%; }
        .chat-bubble-container.user { justify-content: flex-end; }
        .chat-bubble { max-width: 80%; padding: 1.5rem; background: var(--white); border-radius: 1.5rem; border: 1px solid var(--border); box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
        .user .chat-bubble { background: var(--primary); color: white; border: none; }
        .bubble-meta { font-size: 0.75rem; font-weight: 900; color: var(--muted); margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
        
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

        /* Modals - Enlarged & Enhanced */
        .tamil-modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.7); backdrop-filter: blur(12px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 2rem; }
        .tamil-modal { background: white; padding: 4rem 5rem; border-radius: 3.5rem; width: 100%; max-width: 1000px; max-height: 92vh; overflow-y: auto; box-shadow: 0 30px 60px rgba(0,0,0,0.2); }
        .m-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; }
        .m-badge { background: #fee2e2; color: var(--primary); padding: 0.75rem 2rem; border-radius: 2rem; font-weight: 950; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.1em; }
        .m-verse-box { background: #fdf5f2; padding: 3rem; border-radius: 2.5rem; margin-bottom: 3.5rem; border: 1.5px solid #fed7aa; }
        .m-verse-box h3 { font-size: 2.6rem; margin: 0; line-height: 1.4; font-weight: 950; color: #431407; }
        .m-explanations-stack { display: flex; flex-direction: column; gap: 2.5rem; }
        .e-block h5 { margin: 0 0 0.8rem; color: var(--primary); font-weight: 900; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .e-block p { margin: 0; font-size: 1.4rem; line-height: 1.7; font-weight: 700; color: #1e293b; }
        .e-block.en { background: #f8fafc; padding: 2.5rem; border-radius: 2rem; border-left: 6px solid var(--primary); }
        .e-block.en p { color: #475569; font-style: italic; font-weight: 800; }

        /* History - Premium Museum Layout */
        .history-view { max-width: 1100px; margin: 0 auto; width: 100%; }
        .history-hero { text-align: center; padding: 4rem 0; margin-bottom: 4rem; border-bottom: 2px solid var(--border); }
        .h-title { font-size: 3rem; font-weight: 950; color: var(--primary); margin: 0 0 1rem; }
        .h-subtitle { font-size: 1.2rem; color: var(--muted); font-weight: 800; }

        .h-section { display: flex; align-items: center; gap: 5rem; padding: 6rem 0; border-bottom: 1px solid #f1f5f9; }
        .h-section.alternate { flex-direction: row-reverse; }
        .h-text-block { flex: 1; }
        .h-image-wrap { flex: 1; border-radius: 3rem; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.1); transition: 0.5s; }
        .h-image-wrap:hover { transform: scale(1.02); }
        .h-image-wrap img { width: 100%; height: 500px; object-fit: cover; }

        .h-label { display: block; font-size: 0.75rem; font-weight: 950; color: var(--primary); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 1.5rem; }
        .h-text-block h3 { font-size: 2.5rem; font-weight: 950; margin: 0 0 2rem; color: #0f172a; }
        .h-text-block p { font-size: 1.25rem; line-height: 1.8; color: #475569; margin-bottom: 2rem; font-weight: 600; }
        .h-list { list-style: none; padding: 0; margin: 0; }
        .h-list li { font-size: 1.1rem; font-weight: 800; color: #334155; margin-bottom: 0.75rem; display: flex; gap: 1rem; align-items: center; }
        .h-list li::before { content: '•'; color: var(--primary); font-size: 2rem; }

        .h-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 3rem; }
        .h-stat { background: #f8fafc; padding: 1.5rem; border-radius: 1.5rem; text-align: center; font-weight: 900; color: #1e293b; font-size: 0.9rem; border: 1px solid #e2e8f0; }
        .h-stat span { display: block; font-size: 2rem; color: var(--primary); margin-bottom: 0.5rem; }

        .h-quote { border-left: 8px solid var(--primary); padding: 2rem 3rem; background: #fff7ed; border-radius: 0 2rem 2rem 0; font-size: 1.5rem; font-weight: 900; color: #7c2d12; font-style: italic; }

        .h-legacy-footer { text-align: center; padding: 8rem 4rem; background: #fafaf9; border-radius: 4rem; margin-top: 6rem; }
        .h-legacy-footer h3 { font-size: 2rem; font-weight: 950; margin-bottom: 1.5rem; color: var(--primary); }
        .h-legacy-footer p { max-width: 800px; margin: 0 auto; line-height: 1.8; color: #64748b; font-weight: 700; }

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
          .main-header { padding: 1.5rem 1rem; }
          .header-top-row { flex-direction: column; text-align: center; }
          .content-container { padding: 1.5rem 1rem; }
          .paal-cards { grid-template-columns: 1fr; }
          .tamil-modal { padding: 2.5rem; border-radius: 2.5rem; width: 98%; }
          .m-verse-box h3 { font-size: 1.6rem; }
          .h-title { font-size: 2rem; }
          .h-section { flex-direction: column !important; gap: 3rem; padding: 4rem 0; }
          .h-image-wrap img { height: 300px; }
          .h-text-block h3 { font-size: 1.8rem; }
          .h-stats-grid { grid-template-columns: 1fr; }
        }
      `}} />
    </div>
  );
};

export default App;
