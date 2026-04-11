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
          <button className={activeTab === 'ask' ? 'active' : ''} onClick={() => setActiveTab('ask')}> <Cpu size={16}/> <span>கேள்வி-பதில்</span> </button>
          <button className={activeTab === 'list' ? 'active' : ''} onClick={() => setActiveTab('list')}> <BookOpen size={16}/> <span>நூல்நிலையம்</span> </button>
          <button className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}> <HistoryIcon size={16}/> <span>வரலாற்றுப் பின்னணி</span> </button>
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
                  <div className="h-decorator"></div>
                  <motion.h2 initial={{y:20}} animate={{y:0}} className="h-title">திருக்குறள்: ஒரு மாபெரும் வரலாறு</motion.h2>
                  <p className="h-subtitle">2000 ஆண்டுகால ஞானம் • உலகப் பொதுமறை • வாழ்வியல் தத்துவம்</p>
                  <div className="h-hero-chips">
                    <span><Zap size={14}/> 133 அதிகாரங்கள்</span>
                    <span><Feather size={14}/> 1330 குறட்பாக்கள்</span>
                    <span><Globe size={14}/> 100+ மொழிகள்</span>
                  </div>
               </div>

               <div className="history-content-sections">
                  {/* Creator Section */}
                  <section className="h-section alternate">
                     <div className="h-text-block">
                        <span className="h-label">படைப்பாளர்: காலத்தைக் கடந்த ஞானி</span>
                        <h3>தெய்வப்புலவர் திருவள்ளுவர்</h3>
                        <p>திருவள்ளுவர் சுமார் 2,000 ஆண்டுகளுக்கு முன்பு வாழ்ந்த ஒரு ஒப்பற்ற ஞானி. இவரது பிறப்பு மற்றும் சமயம் குறித்து பல விவாதங்கள் இருந்தாலும், இவரது கருத்துக்கள் சாதி, மதம், இனம் கடந்து அனைவருக்குமான பொது நீதியாகத் திகழ்கின்றன.</p>
                        <p>அவர் எந்த ஒரு குறிப்பிட்ட மதத்தையும் முன்னிறுத்தாமல், "பிறப்பொக்கும் எல்லா உயிர்க்கும்" என்ற சமத்துவக் கொள்கையை உலகுக்கு உணர்த்தினார். இவரை 'நாயனார்', 'தேவர்', 'தெய்வப்புலவர்', 'முதற்பாவலர்' எனப் பல பெயர்களில் தமிழர்கள் போற்றுகின்றனர்.</p>
                        <ul className="h-list">
                           <li><User size={20}/> <strong>காலம்:</strong> கி.மு. 31 (இதனை அடிப்படையாகக் கொண்டே திருவள்ளுவர் ஆண்டு கணக்கிடப்படுகிறது).</li>
                           <li><Award size={20}/> <strong>தத்துவம்:</strong> உலகளாவிய மனிதநேயம் மற்றும் வாழ்வியல் நெறிமுறைகள்.</li>
                        </ul>
                     </div>
                     <div className="h-image-wrap">
                        <img src="statue.png" alt="திருவள்ளுவர்" />
                        <div className="img-overlay">கன்னியாகுமரி: 133 அடி உயர திருவள்ளுவர் சிலை</div>
                     </div>
                  </section>

                  {/* Structural Philosophy */}
                  <section className="h-details-grid">
                     <div className="h-detail-card">
                        <div className="d-icon"><Database size={24}/></div>
                        <h4>முப்பாலில் அடங்கிய ஞானம்</h4>
                        <p>திருக்குறள் அறம், பொருள், இன்பம் என்ற மூன்று பிரிவுகளைக் கொண்டது. இது மனித வாழ்வின் அனைத்துப் பரிமாணங்களையும் உள்ளடக்கியது.</p>
                        <ul>
                           <li><strong>அறத்துப்பால்:</strong> (38 அதிகாரங்கள்) - தனிமனித ஒழுக்கம் மற்றும் அறநெறி.</li>
                           <li><strong>பொருட்பால்:</strong> (70 அதிகாரங்கள்) - அரசியல், பொருளாதாரம் மற்றும் சமூகம்.</li>
                           <li><strong>இன்பத்துப்பால்:</strong> (25 அதிகாரங்கள்) - காதல் மற்றும் அகவாழ்வு.</li>
                        </ul>
                     </div>
                     <div className="h-detail-card">
                        <div className="d-icon"><Zap size={24}/></div>
                        <h4>7 சொற்களின் ரகசியம்</h4>
                        <p>ஒவ்வொரு குறளும் இரண்டு அடிகளையும், சரியாக ஏழு சொற்களையும் (4+3) கொண்டது. இந்த ஏழு சொற்கள் ஏழு பிறவிகளையும் அல்லது பிரபஞ்சத்தின் ஏழு நிலைகளையும் குறிப்பதாக அறிஞர்கள் கருதுகின்றனர்.</p>
                     </div>
                  </section>

                  {/* Preservation Timeline */}
                  <div className="h-timeline-section">
                    <div className="h-tl-item">
                      <div className="h-tl-dot"></div>
                      <div className="h-tl-content">
                        <h4>சங்க காலம் (கி.மு. / கி.பி.)</h4>
                        <p>மதுரை தமிழ்ச் சங்கத்தில் 'திருவள்ளுவ மாலை' சான்றோர் முன்னிலையில் அரங்கேற்றப்பட்டதாக வரலாறு கூறுகிறது.</p>
                      </div>
                    </div>
                    <div className="h-tl-item">
                      <div className="h-tl-dot"></div>
                      <div className="h-tl-content">
                        <h4>அச்சியந்திர காலம் (1812)</h4>
                        <p>தஞ்சை ஞானப்பிரகாசம் அவர்களால் முதன்முதலில் திருக்குறள் நூல் வடிவில் அச்சிடப்பட்டது.</p>
                      </div>
                    </div>
                    <div className="h-tl-item">
                      <div className="h-tl-dot"></div>
                      <div className="h-tl-content">
                        <h4>உலகளாவிய அங்கீகாரம் (1886)</h4>
                        <p>ஜி.யு. போப் (G.U. Pope) அவர்களால் திருக்குறள் ஆங்கிலத்தில் முழுமையாக மொழிபெயர்க்கப்பட்டு உலக நாடுகளின் பார்வைக்குச் சென்றது.</p>
                      </div>
                    </div>
                  </div>

                  {/* Preservation Section */}
                  <section className="h-section">
                     <div className="h-image-wrap">
                        <img src="palm_leaf_manuscript_1775941365363.png" alt="ஓலைச்சுவடி" />
                        <div className="img-overlay">பண்டைக்கால ஓலைச்சுவடி (Olai Suvadi)</div>
                     </div>
                     <div className="h-text-block">
                        <span className="h-label">பாதுகாப்பு மற்றும் மீட்டெடுப்பு</span>
                        <h3>ஓலைச்சுவடியிலிருந்து டிஜிட்டல் வரை</h3>
                        <p>திருக்குறள் பல நூற்றாண்டுகளாக ஓலைச்சுவடிகளில் மட்டுமே பாதுகாக்கப்பட்டது. 'எழுத்தாணி' கொண்டு பனை ஓலைகளில் செதுக்கப்பட்ட இந்த வரிகள், இயற்கை சீற்றங்களைக் கடந்து நம்மிடம் வந்து சேர்ந்தது ஒரு அதிசயம்.</p>
                        <p>தமிழ் தாத்தா உ.வே. சாமிநாதையர் மற்றும் அறிஞர்களின் அயராத உழைப்பால் ஊர் ஊராகச் சென்று ஓலைச்சுவடிகள் சேகரிக்கப்பட்டு நூல் வடிவம் பெற்றன. இன்று SRM AI மூலம் இது டிஜிட்டல் யுகத்திலும் உயிர்ப்புடன் இருக்கிறது.</p>
                        <div className="h-stats-grid">
                           <div className="h-stat"><span>133</span> அத்தியாயங்கள்</div>
                           <div className="h-stat"><span>1330</span> குறட்பாக்கள்</div>
                           <div className="h-stat"><span>100+</span> மொழிகள்</div>
                        </div>
                     </div>
                  </section>

                  {/* Global Influence */}
                  <section className="h-section alternate">
                     <div className="h-text-block">
                        <span className="h-label">உலகளாவிய தாக்கம்</span>
                        <h3>உலகத் தலைவர்களின் வழிகாட்டி</h3>
                        <p>திருக்குறள் ஒரு மதச்சார்பற்ற நூல் என்பதால், இது உலகத் தலைவர்கள் பலரை ஈர்த்துள்ளது. மகாத்மா காந்தி, லியோ டால்ஸ்டாய் மற்றும் ஆல்பர்ட் சுவைட்சர் போன்றோர் திருக்குறளின் அறநெறிகளால் ஈர்க்கப்பட்டனர்.</p>
                        <ul className="h-list-fancy">
                          <li><strong>மகாத்மா காந்தி:</strong> திருக்குறளில் உள்ள 'இன்னா செய்தாரையும்' என்ற கருத்தே அவரது அகிம்சை கொள்கைக்கு அடித்தளம்.</li>
                          <li><strong>லியோ டால்ஸ்டாய்:</strong> ரஷ்யாவிலிருந்து திருக்குறளை மொழிபெயர்த்து படித்து வியந்தவர்.</li>
                          <li><strong>ஆல்பர்ட் சுவைட்சர்:</strong> "திருக்குறளைப் போல வாழ்வின் அனைத்துப் பகுதிகளுக்கும் வழிகாட்டும் மற்றொரு நூல் உலகில் இல்லை" எனக் குறிப்பிட்டவர்.</li>
                        </ul>
                        <div className="h-quote-box">
                          <Quote className="q-icon-big" size={40}/>
                          <p className="h-quote">"திருக்குறள் என்பது மனிதன் மனிதனாக வாழ, மனிதன் மனிதனுக்குச் சொன்ன உன்னத நெறி."</p>
                        </div>
                     </div>
                     <div className="h-image-wrap">
                        <img src="translations.png" alt="உலகத்தரம்" />
                        <div className="img-overlay">உலகின் பல மொழிகளில் திருக்குறள்</div>
                     </div>
                  </section>

                  {/* Technical & Cultural Depth */}
                  <section className="h-details-grid three-col">
                     <div className="h-detail-card highlight">
                        <div className="d-icon"><Quote size={24}/></div>
                        <h4>நூலின் சிறப்புப் பெயர்கள்</h4>
                        <p>திருக்குறள் அதன் பெருமையால் பல பெயர்களில் அழைக்கப்படுகிறது:</p>
                        <ul className="h-dot-list">
                           <li><strong>தமிழ் மறை:</strong> தமிழர்களின் வேதம்.</li>
                           <li><strong>பொய்யாமொழி:</strong> மாறாத உண்மை.</li>
                           <li><strong>தெய்வநூல்:</strong> தெய்வீகத் தன்மை கொண்ட நூல்.</li>
                           <li><strong>உலகப் பொதுமறை:</strong> உலகினர் அனைவருக்கும் பொதுவானது.</li>
                        </ul>
                     </div>
                     <div className="h-detail-card highlight">
                        <div className="d-icon"><Feather size={24}/></div>
                        <h4>பதின்மர் உரைகள் (Commentaries)</h4>
                        <p>பண்டைய காலத்தில் பத்து சிறந்த அறிஞர்கள் இதற்கு உரை எழுதினர். அவர்களுள் <strong>பரிமேலழகர்</strong> உரை மிகவும் சிறப்பானதாகக் கருதப்படுகிறது.</p>
                        <p className="tiny-text">தருமர், மணக்குடவர், தாமத்தர், நச்சர், பரிதி, பரிமேலழகர், திருமலையார், மல்லர், பரிப்பெருமாள், காலிங்கர் ஆகியோரே அந்தப் பதின்மர்.</p>
                     </div>
                     <div className="h-detail-card highlight">
                        <div className="d-icon"><Zap size={24}/></div>
                        <h4>வெண்பா யாப்பு முறை</h4>
                        <p>திருக்குறள் 'குறள் வெண்பா' என்னும் யாப்பு முறையில் அமைந்தது. இது தமிழில் மிகவும் கடினமான மற்றும் செறிவான கவிதை வடிவமாகும்.</p>
                     </div>
                  </section>

                  {/* Scholarly Resources */}
                  <div className="h-resources-section">
                    <h3>கல்வி மற்றும் ஆய்வு ஆதாரங்கள்</h3>
                    <p>திருக்குறள் குறித்த விரிவான ஆய்வுகளுக்கு கீழ்க்கண்ட தளங்களைப் பார்வையிடலாம்:</p>
                    <div className="resource-links-grid">
                      <a href="https://en.wikipedia.org/wiki/Tirukkuṟaḷ" target="_blank" rel="noreferrer" className="res-link">
                         <Globe size={18}/> <span>விக்கிப்பீடியா (Wikipedia)</span>
                      </a>
                      <a href="http://www.projectmadurai.org/pm_etexts/utf8/pmutf80001.html" target="_blank" rel="noreferrer" className="res-link">
                         <Database size={18}/> <span>புராஜெக்ட் மதுரை (Project Madurai)</span>
                      </a>
                      <a href="https://archive.org/details/thesacredkurals00popeuoft" target="_blank" rel="noreferrer" className="res-link">
                         <BookOpen size={18}/> <span>ஜி.யு. போப் ஆவணங்கள் (G.U. Pope Archives)</span>
                      </a>
                    </div>
                  </div>
               </div>

               <div className="h-legacy-footer">
                  <div className="footer-glow"></div>
                  <h3>காலம் கடந்த வழிகாட்டி</h3>
                  <p>இன்று நவீன செயற்கை நுண்ணறிவு யுகத்திலும், திருக்குறள் நமக்கு வாழ்வியல் தீர்வுகளை வழங்குகிறது. SRM ஆய்வு மையம் இந்த டிஜிட்டல் தளத்தின் மூலம் திருவள்ளுவரின் புகழை உலகெங்கும் கொண்டு செல்கிறது.</p>
                  <div className="footer-srm-tag">SRM Institute of Science and Technology • Tamil Research Centre</div>
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
        .main-header { padding: 1rem 4rem; background: var(--white); border-bottom: 2px solid var(--border); position: sticky; top: 0; z-index: 100; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
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

        .kural-source-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem; border-top: 1px solid #f1f5f9; padding-top: 1rem; }
        .k-src-tag { font-size: 0.7rem; font-weight: 900; color: var(--primary); background: #fff7ed; padding: 0.4rem 0.8rem; border-radius: 2rem; cursor: pointer; }

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
        .m-verse-box { background: #fffaf7; padding: 2.5rem 2rem; border-radius: 2rem; margin-bottom: 2.5rem; border: 1px solid #ffedd5; text-align: center; }
        .m-verse-box h3 { font-size: 1.8rem; margin: 0; line-height: 1.6; font-weight: 950; color: #431407; white-space: nowrap; }
        .m-verse-box h3:first-child { margin-bottom: 0.5rem; }
        .m-explanations-stack { display: flex; flex-direction: column; gap: 2rem; }
        .e-block h5 { margin: 0 0 0.6rem; color: var(--primary); font-weight: 950; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 8px; }
        .e-block p { margin: 0; font-size: 1.25rem; line-height: 1.6; font-weight: 700; color: #1e293b; }
        .e-block.en { background: #f8fafc; padding: 2rem; border-radius: 1.5rem; border-left: 6px solid var(--primary); }
        .e-block.en p { color: #475569; font-style: italic; font-weight: 800; font-size: 1.1rem; }

        /* History - Premium Museum Layout */
        .history-view { max-width: 1000px; margin: 0 auto; width: 100%; }
        .history-hero { text-align: center; padding: 3rem 0; margin-bottom: 3rem; border-bottom: 2px solid var(--border); position: relative; }
        .h-decorator { width: 60px; height: 4px; background: var(--primary); margin: 0 auto 1.5rem; border-radius: 2px; }
        .h-title { font-size: 2.5rem; font-weight: 950; color: var(--primary); margin: 0 0 1rem; letter-spacing: -0.01em; }
        .h-subtitle { font-size: 1rem; color: var(--muted); font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; }
        .h-hero-chips { display: flex; justify-content: center; gap: 1rem; margin-top: 1.5rem; }
        .h-hero-chips span { background: #fdf5f2; color: var(--primary); padding: 0.5rem 1rem; border-radius: 2rem; font-weight: 900; font-size: 0.75rem; display: flex; align-items: center; gap: 6px; border: 1px solid #fee2e2; }

        .h-section { display: flex; align-items: center; gap: 4rem; padding: 5rem 0; border-bottom: 1px solid #f1f5f9; }
        .h-section.alternate { flex-direction: row-reverse; }
        .h-text-block { flex: 1.2; }
        .h-image-wrap { flex: 1; border-radius: 2rem; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.1); transition: 0.5s; position: relative; }
        .h-image-wrap:hover { transform: translateY(-10px); }
        .h-image-wrap img { width: 100%; height: 400px; object-fit: cover; }
        .img-overlay { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(0,0,0,0.8)); color: white; padding: 1.5rem; font-weight: 800; font-size: 0.9rem; }

        .h-label { display: block; font-size: 0.7rem; font-weight: 950; color: var(--primary); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 1rem; }
        .h-text-block h3 { font-size: 2rem; font-weight: 950; margin: 0 0 1.5rem; color: #0f172a; }
        .h-text-block p { font-size: 1.1rem; line-height: 1.8; color: #475569; margin-bottom: 1.5rem; font-weight: 600; }
        .h-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1rem; }
        .h-list li { font-size: 1rem; font-weight: 800; color: #334155; display: flex; gap: 0.8rem; align-items: center; }
        .h-list li strong { color: var(--primary); }
        
        .h-timeline-section { padding: 4rem 2rem; background: #fffaf7; border-radius: 2.5rem; margin: 2rem 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        .h-tl-item { position: relative; }
        .h-tl-dot { width: 12px; height: 12px; background: var(--primary); border-radius: 50%; margin-bottom: 1rem; ring: 4px solid #fee2e2; }
        .h-tl-content h4 { margin: 0 0 0.5rem; color: #1e293b; font-weight: 950; font-size: 1.1rem; }
        .h-tl-content p { font-size: 0.85rem; color: #64748b; font-weight: 700; margin: 0; line-height: 1.5; }

        .h-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-top: 2.5rem; }
        .h-stat { background: white; padding: 1.25rem; border-radius: 1.25rem; text-align: center; font-weight: 900; color: #1e293b; font-size: 0.8rem; border: 1.5px solid #f1f5f9; box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
        .h-stat span { display: block; font-size: 1.8rem; color: var(--primary); margin-bottom: 0.25rem; }

        .h-quote-box { margin-top: 2rem; position: relative; padding: 2rem; }
        .q-icon-big { color: var(--primary); opacity: 0.1; position: absolute; top: 0; left: 0; }
        .h-quote { font-size: 1.4rem; font-weight: 900; color: #7c2d12; font-style: italic; position: relative; line-height: 1.5; padding-left: 1rem; border-left: 6px solid var(--primary); }

        .h-details-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; margin: 4rem 0; }
        .h-detail-card { background: white; padding: 2.5rem; border-radius: 2.5rem; border: 1.5px solid #f1f5f9; box-shadow: 0 10px 30px rgba(0,0,0,0.02); }
        .h-detail-card h4 { font-size: 1.4rem; color: var(--primary); margin: 1.5rem 0 1rem; }
        .h-detail-card p { font-size: 0.95rem; color: #64748b; line-height: 1.6; }
        .h-detail-card ul { padding-left: 1.25rem; margin-top: 1rem; }
        .h-detail-card li { margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 700; color: #334155; }
        .d-icon { width: 50px; height: 50px; background: #fff7ed; color: var(--primary); border-radius: 1rem; display: flex; align-items: center; justify-content: center; }

        .h-list-fancy { list-style: none; padding: 0; margin: 2rem 0; }
        .h-list-fancy li { background: #f8fafc; padding: 1.5rem; border-radius: 1.5rem; margin-bottom: 1rem; border-left: 5px solid var(--primary); font-size: 1rem; font-weight: 600; color: #334155; }
        .h-list-fancy li strong { color: var(--primary); display: block; font-size: 1.1rem; margin-bottom: 0.4rem; }

        .h-legacy-footer { text-align: center; padding: 6rem 3rem; background: #1e293b; color: white; border-radius: 3rem; margin-top: 5rem; position: relative; overflow: hidden; }
        .footer-glow { position: absolute; inset: 0; background: radial-gradient(circle at center, rgba(154,52,18,0.3) 0%, transparent 70%); }
        .h-legacy-footer h3 { font-size: 2rem; font-weight: 950; margin-bottom: 1.5rem; color: #fbbf24; position: relative; }
        .h-legacy-footer p { max-width: 700px; margin: 0 auto; line-height: 1.8; color: #cbd5e1; font-weight: 700; position: relative; }
        .footer-srm-tag { margin-top: 3rem; font-size: 0.75rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; position: relative; z-index: 2; }

        .h-resources-section { margin-top: 4rem; padding: 4rem; background: #fff; border: 1px solid #f1f5f9; border-radius: 3rem; text-align: center; }
        .h-resources-section h3 { font-size: 1.8rem; font-weight: 950; color: var(--text); margin-bottom: 1rem; }
        .h-resources-section p { color: var(--muted); font-weight: 700; margin-bottom: 2.5rem; }
        .resource-links-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .res-link { 
          display: flex; align-items: center; justify-content: center; gap: 10px; padding: 1.25rem; 
          background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 1.25rem; color: var(--text); 
          text-decoration: none; font-weight: 800; font-size: 0.9rem; transition: 0.3s;
        }
        .res-link:hover { border-color: var(--primary); color: var(--primary); background: #fff7ed; transform: translateY(-3px); }

        .h-details-grid.three-col { grid-template-columns: repeat(3, 1fr); }
        .h-detail-card.highlight { border-top: 4px solid var(--primary); background: #fffcfb; }
        .tiny-text { font-size: 0.75rem; color: #94a3b8; line-height: 1.4; margin-top: 1rem; font-weight: 600; }
        .h-dot-list { list-style: none; padding: 0; margin-top: 1rem; }
        .h-dot-list li { margin-bottom: 0.5rem; font-size: 0.85rem; color: #475569; display: flex; align-items: center; gap: 8px; }
        .h-dot-list li::before { content: ''; width: 6px; height: 6px; background: var(--primary); border-radius: 50%; opacity: 0.3; }

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
