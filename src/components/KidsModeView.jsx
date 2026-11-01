import React, { useState, useEffect } from 'react';
import './kidsMode.css';
import { 
  Volume2, 
  Square, 
  ChevronLeft, 
  ChevronRight, 
  Shuffle, 
  Sparkles, 
  Share2, 
  DoorOpen, 
  BookOpen, 
  Zap, 
  CheckCircle2,
  Heart,
  Gamepad2
} from 'lucide-react';
import { 
  getKidsStoryAndQuest, 
  getKuralAthigaram, 
  playKidChime 
} from '../utils/kidsData.js';
import { playTamilSpeech, stopTamilSpeech } from '../utils/kuralFeatures.js';
import KuralJumpGame from './KuralJumpGame';

export default function KidsModeView({ 
  kuralData = [], 
  onExit, 
  initialKuralNumber = 1 
}) {
  const [currentNum, setCurrentNum] = useState(Number(initialKuralNumber) || 1);
  const [lang, setLang] = useState('ta'); // 'ta' | 'en'
  const [isPlaying, setIsPlaying] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [jumpInput, setJumpInput] = useState('');
  const [showGame, setShowGame] = useState(false);

  // Sync when initialKuralNumber changes from parent
  useEffect(() => {
    if (initialKuralNumber) {
      setCurrentNum(Number(initialKuralNumber) || 1);
    }
  }, [initialKuralNumber]);

  // Local Storage for Gamification
  const [stars, setStars] = useState(() => {
    try {
      const saved = localStorage.getItem('thiruk_kids_stars');
      return saved !== null ? Number(saved) : 2;
    } catch (e) {
      return 2;
    }
  });

  const [streak, setStreak] = useState(() => {
    try {
      const saved = localStorage.getItem('thiruk_kids_streak');
      return saved !== null ? Number(saved) : 1;
    } catch (e) {
      return 1;
    }
  });

  const [starredKurals, setStarredKurals] = useState(() => {
    try {
      const saved = localStorage.getItem('thiruk_kids_starred_list');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [acceptedQuests, setAcceptedQuests] = useState(() => {
    try {
      const saved = localStorage.getItem('thiruk_kids_accepted_quests');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('thiruk_kids_stars', String(stars));
      localStorage.setItem('thiruk_kids_streak', String(streak));
      localStorage.setItem('thiruk_kids_starred_list', JSON.stringify(starredKurals));
      localStorage.setItem('thiruk_kids_accepted_quests', JSON.stringify(acceptedQuests));
    } catch (e) {}
  }, [stars, streak, starredKurals, acceptedQuests]);

  // Clean up audio on unmount or Kural change
  useEffect(() => {
    return () => {
      stopTamilSpeech();
      setIsPlaying(false);
    };
  }, [currentNum]);

  // If Game Mode is active, render Kural Jump mini-game
  if (showGame) {
    return (
      <div className="kids-mode-root" style={{ background: '#fdf8ee', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <KuralJumpGame 
          onExit={() => setShowGame(false)} 
          onRewardStar={() => {
            setStars(s => s + 1);
            playKidChime();
          }}
          lang={lang} 
        />
      </div>
    );
  }

  // Find Current Kural
  const currentKural = kuralData.find(k => Number(k.Number) === currentNum) || {
    Number: currentNum,
    Line1: "அகர முதல எழுத்தெல்லாம் ஆதி",
    Line2: "பகவன் முதற்றே உலகு.",
    Translation: "As the letter A is the first of all letters, so the eternal God is the first in the world."
  };

  const athigaram = getKuralAthigaram(currentNum);
  const kidsContent = getKidsStoryAndQuest(currentKural);

  // Audio Playback Handler
  const handleToggleAudio = () => {
    if (isPlaying) {
      stopTamilSpeech(() => setIsPlaying(false));
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      playTamilSpeech(
        currentKural,
        () => setIsPlaying(true),
        () => {
          setIsPlaying(false);
          // Reward kid for listening completely
          addStarReward(lang === 'ta' ? 'குறளைக் கேட்டதற்கு ⭐ +1 நட்சத்திரம்!' : 'Listening complete! ⭐ +1 Star!');
        }
      );
    }
  };

  // Add Stars & Celebration
  const addStarReward = (message) => {
    setStars(prev => prev + 1);
    playKidChime();
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Star Toggle
  const isCurrentStarred = starredKurals.includes(currentNum);
  const handleToggleStar = () => {
    if (isCurrentStarred) {
      setStarredKurals(prev => prev.filter(n => n !== currentNum));
    } else {
      setStarredKurals(prev => [...prev, currentNum]);
      addStarReward(lang === 'ta' ? 'நட்சத்திரம் சேர்க்கப்பட்டது! ⭐ +1' : 'Star collected! ⭐ +1');
    }
  };

  // Quest Acceptance
  const isQuestAccepted = acceptedQuests.includes(currentNum);
  const handleAcceptQuest = () => {
    if (!isQuestAccepted) {
      setAcceptedQuests(prev => [...prev, currentNum]);
      setStreak(prev => prev + 1);
      addStarReward(lang === 'ta' ? 'பணி ஏற்கப்பட்டது! ⭐ +1 நட்சத்திரம் & 🔥 +1 தொடர்ச்சி!' : 'Quest accepted! ⭐ +1 Star & 🔥 +1 Streak!');
    }
  };

  // Navigation Handlers
  const handlePrev = () => {
    if (currentNum > 1) {
      stopTamilSpeech();
      setIsPlaying(false);
      setCurrentNum(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentNum < (kuralData.length || 1330)) {
      stopTamilSpeech();
      setIsPlaying(false);
      setCurrentNum(prev => prev + 1);
    }
  };

  const handleRandom = () => {
    stopTamilSpeech();
    setIsPlaying(false);
    const total = kuralData.length || 1330;
    const randomNum = Math.floor(Math.random() * total) + 1;
    setCurrentNum(randomNum);
  };

  const handleJumpSubmit = (e) => {
    e.preventDefault();
    const val = parseInt(jumpInput, 10);
    const maxVal = kuralData.length || 1330;
    if (!isNaN(val) && val >= 1 && val <= maxVal) {
      stopTamilSpeech();
      setIsPlaying(false);
      setCurrentNum(val);
      setJumpInput('');
    }
  };

  const handleShare = () => {
    const text = `📖 திருக்குறள் - குறள் ${currentNum}:\n${currentKural.Line1}\n${currentKural.Line2}\n\nhttps://saaqibA21.github.io/thiruk/`;
    if (navigator.share) {
      navigator.share({ title: `குறள் ${currentNum}`, text });
    } else {
      navigator.clipboard?.writeText(text);
      setToastMessage(lang === 'ta' ? 'குறள் நகலெடுக்கப்பட்டது!' : 'Kural copied to clipboard!');
      setTimeout(() => setToastMessage(null), 2000);
    }
  };

  // Kural Verse Breakdown
  const allWords = `${currentKural.Line1 || ''} ${currentKural.Line2 || ''}`.trim().split(/\s+/);
  const line1 = allWords.slice(0, 4).join(' ');
  const line2 = allWords.slice(4).join(' ');

  return (
    <div className="kids-mode-root">
      
      {/* Landscape Header Area with Sun & Rolling Hills */}
      <div className="kids-sky-landscape">
        
        {/* Animated Sun */}
        <div className="kids-sun-wrapper">
          <div className="kids-sun-core" />
        </div>

        {/* Floating Clouds */}
        <div className="kids-cloud kids-cloud-1" />

        {/* Top Action Navigation Bar */}
        <nav className="kids-top-navbar">
          <div className="kids-nav-left">
            <button 
              className="kids-exit-btn" 
              onClick={onExit}
              title="இயல்பு நிலைக்குத் திரும்பு (Exit to Main App)"
            >
              <DoorOpen size={18} />
              <span>{lang === 'ta' ? 'வெளியேறு' : 'Exit'}</span>
            </button>
          </div>

          <div className="kids-nav-right">
            {/* Kural Jump Game Launcher Button */}
            <button 
              className="kids-game-nav-btn"
              onClick={() => setShowGame(true)}
              title="குறள் ஜம்ப் விளையாட்டு (Play Kural Jump Game)"
            >
              <Gamepad2 size={17} />
              <span>{lang === 'ta' ? 'குறள் ஜம்ப் 🐒' : 'Kural Jump 🐒'}</span>
            </button>

            {/* Star & Streak Counter Pill */}
            <div className="kids-stats-pill" title="உங்கள் நட்சத்திரங்கள் மற்றும் தொடர்ச்சி">
              <span className="kids-stat-badge">⭐ {stars}</span>
              <span>-</span>
              <span className="kids-stat-badge">🔥 {streak}</span>
            </div>

            {/* Language Toggle */}
            <div className="kids-lang-toggle">
              <button 
                className={`kids-lang-btn ${lang === 'en' ? 'active' : ''}`}
                onClick={() => setLang('en')}
              >
                EN
              </button>
              <button 
                className={`kids-lang-btn ${lang === 'ta' ? 'active' : ''}`}
                onClick={() => setLang('ta')}
              >
                த
              </button>
            </div>
          </div>
        </nav>

        {/* SVG Rolling Green Hills */}
        <svg 
          className="kids-hills-svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          {/* Back Hill Layer */}
          <path 
            d="M0,70 C300,10 600,85 1200,35 L1200,120 L0,120 Z" 
            fill="#a3e635" 
            opacity="0.55"
          />
          {/* Front Hill Layer */}
          <path 
            d="M0,45 C250,90 550,20 850,75 C1050,110 1150,55 1200,65 L1200,120 L0,120 Z" 
            fill="#84cc16" 
          />
        </svg>

      </div>

      {/* Floating Chapter Card resting at the Hill Crest */}
      <div className="kids-chapter-pill-wrapper">
        <div className="kids-chapter-card">
          <div className="kids-chapter-paal">
            {lang === 'ta' 
              ? `${athigaram.paal} • அதிகாரம் ${athigaram.chapterNumber}` 
              : `${athigaram.paalEn} • Chapter ${athigaram.chapterNumber}`}
          </div>
          <h2 className="kids-chapter-title">
            {lang === 'ta' ? athigaram.chapterName : athigaram.chapterEn}
          </h2>
          <div className="kids-chapter-kuralno">
            <button 
              className="kids-quick-nav-arrow" 
              onClick={handlePrev} 
              disabled={currentNum <= 1}
              title={lang === 'ta' ? 'முந்தைய குறள்' : 'Previous Kural'}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="kids-kural-selector-badge">
              {lang === 'ta' ? `குறள் ${currentNum} / 1330` : `Kural ${currentNum} / 1330`}
            </span>
            <button 
              className="kids-quick-nav-arrow" 
              onClick={handleNext} 
              disabled={currentNum >= (kuralData.length || 1330)}
              title={lang === 'ta' ? 'அடுத்த குறள்' : 'Next Kural'}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Thiru Cartoon Avatar & Speech Bubble */}
      <div className="kids-mascot-section">
        <div className="kids-mascot-avatar-frame">
          <img 
            src="thiru_avatar_circ.png" 
            alt="திரு (Thiru)" 
            className="kids-mascot-img"
            onError={(e) => {
              e.currentTarget.src = "thiruvalluvar.jpg";
            }}
          />
        </div>
        <div className="kids-speech-bubble">
          {lang === 'ta' ? (
            <span>
              வணக்கம், நான் <span className="kids-speech-highlight">திரு!</span> குறள் {currentNum} படித்து விளையாடலாம்.
              <button className="kids-bubble-game-btn" onClick={() => setShowGame(true)}>
                🎮 குறள் ஜம்ப் விளையாடு
              </button>
            </span>
          ) : (
            <span>
              Hello, I'm <span className="kids-speech-highlight">Thiru!</span> Let's explore Kural {currentNum} and play.
              <button className="kids-bubble-game-btn" onClick={() => setShowGame(true)}>
                🎮 Play Kural Jump
              </button>
            </span>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="kids-main-content-container">
        
        {/* Main Kural Verse Card */}
        <section className="kids-kural-card">
          <div className="kids-kural-verse-lines">
            <p className="kids-verse-line">{line1 || currentKural.Line1}</p>
            <p className="kids-verse-line">{line2 || currentKural.Line2}</p>
          </div>

          {/* Big Pink Audio Listen Button */}
          <button 
            className={`kids-audio-btn ${isPlaying ? 'playing' : ''}`}
            onClick={handleToggleAudio}
          >
            {isPlaying ? <Square size={20} /> : <Volume2 size={22} />}
            <span>{isPlaying ? (lang === 'ta' ? 'நிறுத்து' : 'Stop') : (lang === 'ta' ? 'கேள்' : 'Listen')}</span>
          </button>

          {/* Child-Friendly Meaning Line */}
          <p className="kids-meaning-text">
            {currentKural.explanation || currentKural.Translation || currentKural.simple_explanation || currentKural.mv}
          </p>

          {/* Gold Star Button in Bottom Right */}
          <button 
            className={`kids-star-action-btn ${isCurrentStarred ? 'starred' : ''}`}
            onClick={handleToggleStar}
            title={isCurrentStarred ? 'நட்சத்திரம் சேர்க்கப்பட்டுள்ளது' : 'நட்சத்திரம் சேர்க்க கிளிக் செய்க'}
          >
            {isCurrentStarred ? '⭐' : '☆'}
          </button>
        </section>

        {/* Lower Two Cards Grid: Short Story & Daily Quest */}
        <div className="kids-lower-grid">
          
          {/* Card 1: Short Story (Green Tint) */}
          <div className="kids-story-card">
            <div className="kids-card-tag">
              <BookOpen size={16} />
              <span>{lang === 'ta' ? 'ஒரு சிறு கதை' : 'A Short Story'}</span>
            </div>
            <p className="kids-story-paragraph">
              {lang === 'ta' ? kidsContent.storyTa : kidsContent.storyEn}
            </p>
          </div>

          {/* Card 2: Daily Quest Challenge (Pink Tint) */}
          <div className="kids-quest-card">
            <div className="kids-card-tag">
              <Zap size={16} />
              <span>{lang === 'ta' ? 'இன்று முயற்சி செய்' : 'Try Today'}</span>
            </div>
            <p className="kids-quest-text">
              {lang === 'ta' ? kidsContent.questTa : kidsContent.questEn}
            </p>
            <button 
              className={`kids-quest-accept-btn ${isQuestAccepted ? 'accepted' : ''}`}
              onClick={handleAcceptQuest}
            >
              {isQuestAccepted ? (
                <>
                  <CheckCircle2 size={18} />
                  <span>{lang === 'ta' ? 'பணி முடிந்தது! ⭐' : 'Quest Accepted! ⭐'}</span>
                </>
              ) : (
                <span>{lang === 'ta' ? 'பணியை ஏற்கிறேன்! 🌈' : 'I Accept the Quest! 🚀'}</span>
              )}
            </button>
          </div>

        </div>

        {/* Bottom Navigation & Discovery Bar */}
        <div className="kids-bottom-nav-bar">
          <button 
            className="kids-bottom-nav-btn" 
            onClick={handlePrev}
            disabled={currentNum <= 1}
          >
            <ChevronLeft size={18} />
            <span>{lang === 'ta' ? 'முந்தைய குறள்' : 'Previous'}</span>
          </button>

          <button 
            className="kids-bottom-nav-btn kids-random-kural-btn" 
            onClick={handleRandom}
          >
            <Shuffle size={16} />
            <span>{lang === 'ta' ? 'மற்றொரு குறள்' : 'Random Kural'}</span>
          </button>

          <button 
            className="kids-bottom-nav-btn" 
            onClick={handleNext}
            disabled={currentNum >= (kuralData.length || 1330)}
          >
            <span>{lang === 'ta' ? 'அடுத்த குறள்' : 'Next'}</span>
            <ChevronRight size={18} />
          </button>

          {/* Quick Jump Input */}
          <form className="kids-jump-form" onSubmit={handleJumpSubmit}>
            <input 
              type="number"
              min="1"
              max={kuralData.length || 1330}
              placeholder={lang === 'ta' ? 'குறள் எண்...' : 'Kural No...'}
              value={jumpInput}
              onChange={(e) => setJumpInput(e.target.value)}
              className="kids-jump-input"
            />
            <button type="submit" className="kids-jump-btn">
              {lang === 'ta' ? 'செல்' : 'Go'}
            </button>
          </form>

          {/* Quick Share */}
          <div className="kids-share-mini-row">
            <button 
              className="kids-social-icon-btn" 
              onClick={handleShare}
              title="பகிர் (Share)"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

      </main>

      {/* Floating Celebration Toast */}
      {toastMessage && (
        <div className="kids-celebration-toast">
          <Sparkles size={20} color="#facc15" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
