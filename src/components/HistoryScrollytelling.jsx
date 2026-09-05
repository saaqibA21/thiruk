import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Briefcase, 
  Heart, 
  Sparkles, 
  RotateCw, 
  Compass, 
  ScrollText, 
  Feather,
  ChevronDown
} from 'lucide-react';
import ExternalResources from './ExternalResources';

const TIMELINE_STAGES = [
  {
    id: 'origin',
    chapterNum: '01',
    title: 'மாமுனிவர் திருவள்ளுவர் தோற்றம்',
    titleEn: 'The Eternal Sage & Origin',
    tag: 'கி.மு 31 • மயிலாப்பூர்',
    desc: 'சுமார் 2,000 ஆண்டுகளுக்கு முன்பு தமிழ் மண்ணில் வாழ்ந்த பெரும் புலவர் மற்றும் மெய்யியலாளர் திருவள்ளுவர். சமூகம், அரசியல், குடும்பம், காதல், அறம் ஆகிய அனைத்து வாழ்வியல் துறைகளையும் நுணுகி ஆய்ந்து ஓலைச்சுவடியில் எழுத்தாணி கொண்டு செதுக்கிய உலகப் பேரறிஞர்.',
    stats: [
      { label: 'அதிகாரங்கள்', val: '133' },
      { label: 'குறள்கள்', val: '1,330' },
      { label: 'பால்கள்', val: '3' },
      { label: 'இயல்கள்', val: '9' }
    ],
    highlight: 'எந்தவொரு குறிப்பிட்ட மதம், சாதி, இனம் சாராது மனிதகுல முழுமைக்குமான வாழ்வியல் நெறி.'
  },
  {
    id: 'philosophy',
    chapterNum: '02',
    title: 'உலகப் பொதுமறை தத்துவம்',
    titleEn: 'Universal Ethical Treatise',
    tag: 'ஈரடி வெண்பா • ஏழே சீர்கள்',
    desc: 'மனிதன் எவ்வாறு வாழ வேண்டும் என்பதை இரண்டே அடிகளில், ஏழு சீர்களில் சுருங்கச் சொல்லி விளங்க வைக்கும் அற்புதப் படைப்பு. முதல் அடியில் 4 சீர்களும், இரண்டாம் அடியில் 3 சீர்களும் கொண்ட வெண்பா யாப்பு வடிவத்தில் இயற்றப்பட்டது.',
    stats: [
      { label: 'சொற்கள்', val: '14,000' },
      { label: 'எழுத்துகள்', val: '42,194' },
      { label: 'முதல் எழுத்து', val: 'அ' },
      { label: 'கடைசி எழுத்து', val: 'ன்' }
    ],
    highlight: "'தமிழ்', 'கடவுள்' என்ற சொற்கள் பாடல்களில் நேரடியாக வராமலேயே பிரபஞ்ச உண்மைகளை உணர்த்தும் தனிச்சிறப்பு."
  },
  {
    id: 'statue',
    chapterNum: '03',
    title: 'முக்கடல் நடுவே 133 அடி திருவுருவம்',
    titleEn: '133-ft Monument at Kanyakumari',
    tag: 'கன்னியாகுமரி • 7,000 டன் கருங்கல்',
    desc: 'இந்தியாவின் தென்கோடி முனையில் அரபிக்கடல், வங்காள விரிகுடா, இந்தியப் பெருங்கடல் சங்கமிக்கும் பாறையின் மீது உயர்ந்து நிற்கும் கம்பீரச் சிலை. நூலின் அதிகார அமைப்பையே அளவுகோலாகக் கொண்டு வடிக்கப்பட்ட சிற்பக் கலை அதிசயம்.',
    stats: [
      { label: 'மொத்த உயரம்', val: '133 அடி' },
      { label: 'அறத்துப்பால் பீடம்', val: '38 அடி' },
      { label: 'பொருள் & இன்பம்', val: '95 அடி' },
      { label: 'சிற்ப எடை', val: '7,000 டன்' }
    ],
    highlight: 'அறத்தின் மீது பொருளும் இன்பமும் நிலைபெற வேண்டும் என்பதை உணர்த்தும் சிற்பத் தத்துவம்.'
  },
  {
    id: 'global',
    chapterNum: '04',
    title: 'உலகளாவிய தாக்கம் & 100+ மொழியாக்கம்',
    titleEn: 'Global Influence & 100+ Translations',
    tag: '107 உலக மொழிகள்',
    desc: 'லத்தீன் (வீரமாமுனிவர்), ஆங்கிலம் (ஜி.யு. போப், வ.வே.சு. ஐயர்), ஜெர்மன், பிரஞ்சு, சீனம், உருசியம், அரபு உட்பட உலகெங்கும் 100க்கும் மேற்பட்ட மொழிகளில் மொழிபெயர்க்கப்பட்டு போற்றப்படுகிறது.',
    stats: [
      { label: 'மொழிகள்', val: '107+' },
      { label: 'முதல் அச்சு', val: '1812' },
      { label: 'உலக மேதைகள்', val: 'காந்தி, டால்ஸ்டாய்' },
      { label: 'பெருமை', val: 'உலகப் பொதுமறை' }
    ],
    highlight: '"நான் படித்தவற்றில் மிகவும் உயர்ந்த அறம் சார்ந்த நூல் திருக்குறள்." — மகாத்மா காந்தி'
  }
];

export default function HistoryScrollytelling({ onNavigatePaal }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAutoSpin, setIsAutoSpin] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const animFrameId = useRef(null);
  const targetTimeRef = useRef(0);

  // Handle Video Metadata & Loading
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setVideoLoaded(true);
      video.pause();
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    if (video.readyState >= 1) {
      setVideoLoaded(true);
      video.pause();
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  // Smooth Video Scrubbing using Lerp (Linear Interpolation)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateVideoFrame = () => {
      if (!isAutoSpin && videoLoaded && video.duration) {
        const current = video.currentTime;
        const target = targetTimeRef.current;
        const diff = target - current;

        // Smoothly interpolate towards target time
        if (Math.abs(diff) > 0.005) {
          video.currentTime = current + diff * 0.15;
        }
      }
      animFrameId.current = requestAnimationFrame(updateVideoFrame);
    };

    animFrameId.current = requestAnimationFrame(updateVideoFrame);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isAutoSpin, videoLoaded]);

  // Scroll Listener to compute scroll progress and active milestone
  const handleScroll = useCallback(() => {
    if (!containerRef.current || isAutoSpin) return;

    const rect = containerRef.current.getBoundingClientRect();
    const totalHeight = containerRef.current.offsetHeight - window.innerHeight;
    
    if (totalHeight <= 0) return;

    // Calculate progress between 0 and 1
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / totalHeight));
    setScrollProgress(progress);

    // Update target video time based on progress
    if (videoRef.current && videoRef.current.duration) {
      targetTimeRef.current = progress * videoRef.current.duration;
    }

    // Determine current active milestone index (0 to 3)
    const stageIdx = Math.min(
      TIMELINE_STAGES.length - 1,
      Math.floor(progress * TIMELINE_STAGES.length)
    );
    setActiveStageIndex(stageIdx);
  }, [isAutoSpin]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Toggle Auto-spin Mode
  const toggleAutoSpin = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!isAutoSpin) {
      setIsAutoSpin(true);
      video.loop = true;
      video.play().catch(() => {});
    } else {
      setIsAutoSpin(false);
      video.pause();
      if (video.duration) {
        targetTimeRef.current = scrollProgress * video.duration;
      }
    }
  };

  return (
    <div className="history-scrolly-root" ref={containerRef}>
      
      {/* Sticky Presentation Viewport */}
      <div className="history-sticky-stage">
        
        {/* Ambient Golden Spiritual Aura Background */}
        <div className="history-stage-glow-aura" />

        <div className="history-stage-grid">
          
          {/* Left Column: Interactive Story Milestone Card */}
          <div className="history-content-column">
            <div className="history-header-mini">
              <span className="history-era-badge">
                <Compass size={14} /> திருக்குறள் காலப்பயணம் (Chronicle)
              </span>
              <div className="history-progress-tracker">
                {TIMELINE_STAGES.map((stage, idx) => (
                  <div 
                    key={stage.id} 
                    className={`history-tracker-pip ${idx === activeStageIndex ? 'active' : ''} ${idx < activeStageIndex ? 'completed' : ''}`}
                    title={stage.title}
                  />
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {TIMELINE_STAGES[activeStageIndex] && (
                <motion.div
                  key={TIMELINE_STAGES[activeStageIndex].id}
                  initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="history-milestone-card"
                >
                  <div className="milestone-top-tag">
                    <span className="milestone-chap-num">அத்தியாயம் {TIMELINE_STAGES[activeStageIndex].chapterNum}</span>
                    <span className="milestone-sub-tag">{TIMELINE_STAGES[activeStageIndex].tag}</span>
                  </div>

                  <h3 className="milestone-title">{TIMELINE_STAGES[activeStageIndex].title}</h3>
                  <h4 className="milestone-title-en">{TIMELINE_STAGES[activeStageIndex].titleEn}</h4>

                  <p className="milestone-desc">{TIMELINE_STAGES[activeStageIndex].desc}</p>

                  {/* Micro Stats Grid */}
                  <div className="milestone-stats-grid">
                    {TIMELINE_STAGES[activeStageIndex].stats.map((st, i) => (
                      <div key={i} className="m-stat-box">
                        <strong>{st.val}</strong>
                        <span>{st.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Highlight Quote Bar */}
                  <div className="milestone-highlight-bar">
                    <Feather size={16} className="highlight-feather-icon" />
                    <p>{TIMELINE_STAGES[activeStageIndex].highlight}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scroll Hint indicator */}
            <div className="history-scroll-hint">
              <ChevronDown size={18} className="hint-bounce-arrow" />
              <span>கீழே உருட்டவும் (Scroll down to spin & discover)</span>
            </div>
          </div>

          {/* Right Column: 3D Spinning Thiruvalluvar Video */}
          <div className="history-video-column">
            <div className="spinning-video-card">
              
              <div className="spinning-video-glow" />

              <video
                ref={videoRef}
                src="thiruvalluvar_spin.mp4"
                className="thiruvalluvar-spin-video"
                playsInline
                muted
                preload="auto"
                tabIndex={-1}
              />

              {/* Video Vignette & Shading */}
              <div className="spinning-video-overlay-gradient" />

              {/* Floating Interactive Controls */}
              <div className="spinning-video-bottom-bar">
                <div className="spin-status-indicator">
                  <div className="spin-pulsing-dot" />
                  <span>{isAutoSpin ? 'தானியங்கி சுழற்சி (Auto-Spinning)' : 'உருட்டல் சுழற்சி (Scroll-Controlled 360°)'}</span>
                </div>

                <button 
                  className={`spin-auto-toggle-btn ${isAutoSpin ? 'active' : ''}`}
                  onClick={toggleAutoSpin}
                  title="சுழற்சி முறையை மாற்றுக (Toggle continuous spin)"
                >
                  <RotateCw size={14} className={isAutoSpin ? 'spinning-icon-active' : ''} />
                  <span>{isAutoSpin ? 'கைமுறை (Scroll Mode)' : 'தானியங்கி (Auto)'}</span>
                </button>
              </div>

              {/* Rotation Angle Tracker */}
              <div className="spin-angle-badge">
                <Sparkles size={13} color="#f59e0b" />
                <span>சுழற்சி: {Math.round(scrollProgress * 360)}°</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Interactive Exploration of Three Paals (Appears after scroll sequence) */}
      <div className="history-paals-showcase-section">
        <div className="paals-showcase-header">
          <span className="paals-badge-gold">
            <ScrollText size={16} /> திருக்குறள் முப்பால்கள் அமைப்பு
          </span>
          <h2 className="paals-showcase-title">வாழ்வின் முப்பெரும் பிரிவுகள்</h2>
          <p className="paals-showcase-subtitle">
            திருக்குறள் அறம், பொருள், இன்பம் என்ற மனித வாழ்வின் மூன்று தூண்களை முழுமையாக விளக்குகிறது.
          </p>
        </div>

        <div className="history-paal-cards-grid">
          
          <div className="paal-explore-card aram-card" onClick={() => onNavigatePaal?.('அறத்துப்பால்')}>
            <div className="paal-card-icon-wrap aram-icon">
              <BookOpen size={28} />
            </div>
            <div className="paal-card-badge">38 அதிகாரங்கள் (குறள் 1 - 380)</div>
            <h3>அறத்துப்பால்</h3>
            <span className="paal-en-sub">Virtue & Righteous Living</span>
            <p>
              கடவுள் வாழ்த்து, வான் சிறப்பு, நீத்தார் பெருமை, இல்லறவியல், துறவறவியல் மற்றும் ஊழியல் ஆகிய பிரிவுகளில் அறவழியின் மேன்மையை போதிக்கிறது.
            </p>
            <button className="paal-explore-btn aram-btn">
              அறத்துப்பால் வாசிக்க <BookOpen size={15} />
            </button>
          </div>

          <div className="paal-explore-card porul-card" onClick={() => onNavigatePaal?.('பொருட்பால்')}>
            <div className="paal-card-icon-wrap porul-icon">
              <Briefcase size={28} />
            </div>
            <div className="paal-card-badge">70 அதிகாரங்கள் (குறள் 381 - 1080)</div>
            <h3>பொருட்பால்</h3>
            <span className="paal-en-sub">Wealth, Polity & Leadership</span>
            <p>
              அரசியல், அமைச்சியல், படை, நட்பு, குடிமை, கல்வி, ஆளுமை மற்றும் நாட்டின் செழுமை குறித்த உலகளாவிய சமூக மேலாண்மை நெறிகள்.
            </p>
            <button className="paal-explore-btn porul-btn">
              பொருட்பால் வாசிக்க <Briefcase size={15} />
            </button>
          </div>

          <div className="paal-explore-card inbam-card" onClick={() => onNavigatePaal?.('காமத்துப்பால்')}>
            <div className="paal-card-icon-wrap inbam-icon">
              <Heart size={28} />
            </div>
            <div className="paal-card-badge">25 அதிகாரங்கள் (குறள் 1081 - 1330)</div>
            <h3>காமத்துப்பால்</h3>
            <span className="paal-en-sub">Love, Romance & Harmony</span>
            <p>
              களவியல் மற்றும் கற்பியல் மூலம் தூய காதல், இல்லற அன்பு, உளவியல் வெளிப்பாடுகள் மற்றும் தம்பதியரின் உன்னத பிணைப்பை விவரிக்கிறது.
            </p>
            <button className="paal-explore-btn inbam-btn">
              காமத்துப்பால் வாசிக்க <Heart size={15} />
            </button>
          </div>

        </div>

        
        {/* Eminent Thirukkural Commentators / உரையாசிரியர்கள் */}
        <div className="h-side-center">
          <section className="commentators-section">
            <div className="commentators-header">
              <span className="commentators-badge">
                <Feather size={14} /> உரையாசிரியர்கள்
              </span>
              <h2>புகழ்பெற்ற திருக்குறள் உரையாசிரியர்கள்</h2>
              <p>திருக்குறளின் ஆழமான வாழ்வியல் கருத்துக்களை எளிய நடையில் உலகிற்கு எடுத்துரைத்த பெருமக்கள்</p>
            </div>

            <div className="commentators-grid">
              {/* 1. Dr. Mu. Varadarajan */}
              <div className="commentator-card">
                <div className="commentator-img-wrap">
                  <img src="mu_va.jpg" alt="Dr. Mu. Varadarajan" className="commentator-img" />
                  <div className="commentator-tag">மு.வ. உரை</div>
                </div>
                <div className="commentator-content">
                  <h3>டாக்டர் மு. வரதராசனார்</h3>
                  <span className="commentator-role">பேராசிரியர் & தமிழறிஞர் (1912 - 1974)</span>
                  <p>
                    மிகவும் எளிய, தெளிவான மற்றும் தமிழ் மாணவர்களிடையே உலகளவில் அதிகம் வாசிக்கப்படும் முதன்மைத் திருக்குறள் உரை ஆசிரியர்.
                  </p>
                  <div className="commentator-pill">
                    <span>📚 எளிய தெளிவுரை</span>
                  </div>
                </div>
              </div>

              {/* 2. Solomon Pappaiah */}
              <div className="commentator-card">
                <div className="commentator-img-wrap">
                  <img src="solomon_pappaiah.jpg" alt="Prof. Solomon Pappaiah" className="commentator-img" />
                  <div className="commentator-tag">பாப்பையா உரை</div>
                </div>
                <div className="commentator-content">
                  <h3>பேராசிரியர் சாலமன் பாப்பையா</h3>
                  <span className="commentator-role">தமிழறிஞர் & பட்டிமன்ற நடுவர் (பத்மஸ்ரீ)</span>
                  <p>
                    பாமர மக்களும் அன்றாட வாழ்வில் திருக்குறளின் அர்த்தத்தை எளிதில் உணரும் வண்ணம் எளிய நடைமுறை வாழ்வியல் சொல்லாடல்களில் உரை வழங்கியவர்.
                  </p>
                  <div className="commentator-pill">
                    <span>✨ வாழ்வியல் உரை</span>
                  </div>
                </div>
              </div>

              {/* 3. Kalaignar M. Karunanidhi */}
              <div className="commentator-card">
                <div className="commentator-img-wrap">
                  <img src="kalaignar.jpg" alt="Kalaignar M. Karunanidhi" className="commentator-img" />
                  <div className="commentator-tag">கலைஞர் உரை</div>
                </div>
                <div className="commentator-content">
                  <h3>முத்தமிழறிஞர் மு. கருணாநிதி</h3>
                  <span className="commentator-role">எழுத்தாளர் & தமிழக முன்னாள் முதல்வர் (1924 - 2018)</span>
                  <p>
                    தமிழ் நயமும் அடுக்கு மொழியும் நிறைந்த இலக்கியச் சுவைமிக்க 'குறளோவியம்' மற்றும் நவீன கால கலைஞர் உரை தந்தவர்.
                  </p>
                  <div className="commentator-pill">
                    <span>🎨 குறளோவியம் & இலக்கிய உரை</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Global Quote Tribute */}
        <div className="history-tribute-quote-card">
          <div className="quote-quote-icon">“</div>
          <p className="tribute-quote-tamil">
            "நான் படித்தவற்றில் மிகவும் உயர்ந்த அறம் சார்ந்த நூல் திருக்குறள். இது உலகிற்கே ஒரு பொதுவான வழிகாட்டி."
          </p>
          <div className="tribute-author-row">
            <div className="author-avatar-badge">MK</div>
            <div>
              <strong>மகாத்மா காந்தி (Mahatma Gandhi)</strong>
              <span>இந்திய தேசப்பிதா • திருக்குறள் வாசகர்</span>
            </div>
          </div>
        </div>

        {/* External Scholarly Resources */}
        <ExternalResources />

      </div>

    </div>
  );
}
