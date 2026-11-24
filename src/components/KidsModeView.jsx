import React, { useState, useEffect, useRef } from 'react';
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
  Trophy,
  Award,
  X,
  Star
} from 'lucide-react';
import { 
  getKidsStoryAndQuest, 
  getKuralAthigaram, 
  playKidChime 
} from '../utils/kidsData.js';
import { playTamilSpeech, stopTamilSpeech } from '../utils/kuralFeatures.js';
import KuralJumpGame from './KuralJumpGame';
import KuralScrambleGame from './KuralScrambleGame';
import ValluvarRPGGame from './ValluvarRPGGame';

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
  const [activeGame, setActiveGame] = useState(null); // null, 'jump', or 'scramble'
  const [showGameModal, setShowGameModal] = useState(false);
  const [showBadgesModal, setShowBadgesModal] = useState(false);

  const kuralCardRef = useRef(null);
  const storyCardRef = useRef(null);

  const scrollToKural = () => {
    kuralCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const scrollToStory = () => {
    storyCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

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

  // If Game Mode is active, render Kural Jump or Kural Scramble mini-game
  if (activeGame === 'jump') {
    return (
      <div className="kids-mode-root" style={{ background: '#fdf8ee', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <KuralJumpGame 
          onExit={() => setActiveGame(null)} 
          onRewardStar={() => {
            setStars(s => s + 1);
            playKidChime();
          }}
          lang={lang} 
        />
      </div>
    );
  }

  if (activeGame === 'scramble') {
    return (
      <div className="kids-mode-root" style={{ background: '#fdf8ee', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <KuralScrambleGame 
          kuralData={kuralData}
          initialKuralNumber={currentNum}
          onExit={() => setActiveGame(null)} 
          onRewardStar={() => {
            setStars(s => s + 1);
            playKidChime();
          }}
          lang={lang} 
        />
      </div>
    );
  }

  if (activeGame === 'rpg') {
    return (
      <div className="kids-mode-root" style={{ background: '#fdf8ee', minHeight: '100vh', padding: '1rem 0' }}>
        <ValluvarRPGGame 
          onExit={() => setActiveGame(null)} 
          onRewardStar={() => {
            setStars(s => s + 1);
            playKidChime();
          }}
          initialLang={lang} 
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
      
      {/* Kids Mode Main Top Header with Illustration Banner */}
      <div className="kids-main-header">
        <div className="kids-header-top-nav-bar">
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

              {/* SRM & Tamil Mandram Institutional Brand Pill */}
              <div className="kids-institution-pill" title="SRM Institute of Science and Technology • SRM தமிழ் மன்றம்">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/en/7/7a/SRM_Institute_of_Science_and_Technology_Logo.svg" 
                  alt="SRM IST" 
                  className="kids-brand-logo-srm" 
                />
                <span className="kids-brand-divider" />
                <img 
                  src="mozhi_to_machine.png" 
                  alt="SRM தமிழ் மன்றம் - மொழி முதல் இயந்திரம் வரை" 
                  className="kids-brand-logo-mandram" 
                />
                <div className="kids-brand-text-col">
                  <span className="kids-brand-title">SRM</span>
                  <span className="kids-brand-sub">{lang === 'ta' ? 'தமிழ் மன்றம்' : 'Tamil Mandram'}</span>
                </div>
              </div>

              {/* Kids Mode Logo Badge */}
              <img 
                src="kids/kids_logo_header.png" 
                alt="Thirukkural for Kids" 
                className="kids-navbar-logo-badge" 
              />
            </div>

            <div className="kids-nav-right">
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
        </div>

        {/* Full-Width Header Hero Banner */}
        <div 
          className="kids-header-banner-wrap" 
          onClick={scrollToKural} 
          role="button" 
          tabIndex={0} 
          title={lang === 'ta' ? 'தொடங்குங்கள்! குறளைக் கற்க கிளிக் செய்க' : 'Start Learning! Click to explore Kural'}
        >
          <img 
            src="kids/kids_hero_banner.jpg" 
            alt="Discover the Wisdom of Thirukkural! Learn • Play • Grow - Timeless wisdom. Fun for little minds!" 
            className="kids-header-banner-img"
          />
        </div>
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


      {/* Main Content Area */}
      <main className="kids-main-content-container">

        {/* 4 Feature Interactive Cards Deck */}
        <div className="kids-features-grid-wrap">
          <div className="kids-features-grid">
            <button 
              className="kids-feature-img-card" 
              onClick={scrollToStory} 
              title={lang === 'ta' ? 'குறள் கதைகள்' : 'Kural Stories'}
            >
              <img src="kids/card_stories.png" alt="Kural Stories" />
            </button>

            <button 
              className="kids-feature-img-card" 
              onClick={() => setShowGameModal(true)} 
              title={lang === 'ta' ? 'விளையாட்டுகள்' : 'Fun Games'}
            >
              <img src="kids/card_games.png" alt="Fun Games" />
            </button>

            <button 
              className="kids-feature-img-card" 
              onClick={() => setActiveGame('scramble')} 
              title={lang === 'ta' ? 'குறள் புதிர்' : 'Quick Quiz'}
            >
              <img src="kids/card_quiz.png" alt="Quick Quiz" />
            </button>

            <button 
              className="kids-feature-img-card" 
              onClick={() => setShowBadgesModal(true)} 
              title={lang === 'ta' ? 'விருதுகள்' : 'Earn Badges'}
            >
              <img src="kids/card_badges.png" alt="Earn Badges" />
            </button>
          </div>
        </div>
        
        {/* Main Kural Verse Card */}
        <section className="kids-kural-card" ref={kuralCardRef}>
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
          <div className="kids-story-card" ref={storyCardRef}>
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

        {/* Kids Mode Institutional Footer with SRM & Tamil Mandram Branding */}
        <footer className="kids-footer-branding">
          <div className="kids-footer-logos">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/7/7a/SRM_Institute_of_Science_and_Technology_Logo.svg" 
              alt="SRM IST" 
              className="kids-footer-srm-logo" 
            />
            <span className="kids-footer-divider" />
            <img 
              src="mozhi_to_machine.png" 
              alt="SRM தமிழ் மன்றம் - மொழி முதல் இயந்திரம் வரை" 
              className="kids-footer-mandram-logo" 
            />
          </div>
          <p className="kids-footer-text">
            <strong>SRM Institute of Science and Technology</strong> • {lang === 'ta' ? 'SRM தமிழ் மன்றம் (மொழி முதல் இயந்திரம் வரை)' : 'SRM Tamil Mandram (Mozhi to Machine)'}
          </p>
        </footer>

      </main>

      {/* Interactive Game Picker Modal */}
      {showGameModal && (
        <div className="kids-modal-backdrop" onClick={() => setShowGameModal(false)}>
          <div className="kids-popup-card" onClick={e => e.stopPropagation()}>
            <div className="kids-popup-header">
              <h3>🎮 {lang === 'ta' ? 'விளையாட்டைத் தேர்ந்தெடு!' : 'Pick a Fun Game!'}</h3>
              <button className="kids-popup-close-btn" onClick={() => setShowGameModal(false)} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <div className="kids-game-options-grid">
              <button className="kids-game-choice-btn jump-card" onClick={() => { setShowGameModal(false); setActiveGame('jump'); }}>
                <span className="game-choice-emoji">🐒</span>
                <div className="game-choice-info">
                  <strong>{lang === 'ta' ? 'குறள் ஜம்ப்' : 'Kural Jump'}</strong>
                  <p>{lang === 'ta' ? 'மேடை மேடையாகக் குதித்து குறள் சொற்களைச் சேர்!' : 'Jump across platforms to collect Kural words!'}</p>
                </div>
              </button>

              <button className="kids-game-choice-btn scramble-card" onClick={() => { setShowGameModal(false); setActiveGame('scramble'); }}>
                <span className="game-choice-emoji">🧩</span>
                <div className="game-choice-info">
                  <strong>{lang === 'ta' ? 'குறள் புதிர்' : 'Kural Scramble'}</strong>
                  <p>{lang === 'ta' ? 'கலைந்த சொற்களை சரியான வரிசையில் அடுக்கு!' : 'Unscramble words into the correct Kural order!'}</p>
                </div>
              </button>

              <button className="kids-game-choice-btn rpg-card" onClick={() => { setShowGameModal(false); setActiveGame('rpg'); }}>
                <span className="game-choice-emoji">⚖️</span>
                <div className="game-choice-info">
                  <strong>{lang === 'ta' ? 'வள்ளுவர் வழி (RPG)' : "Valluvar's Path (RPG)"}</strong>
                  <p>{lang === 'ta' ? 'அரசன், வணிகனாக நற்சிந்தனை முடிவெடு!' : 'Roleplay moral dilemmas as a King, Merchant or Scholar!'}</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Badges & Achievements Modal */}
      {showBadgesModal && (
        <div className="kids-modal-backdrop" onClick={() => setShowBadgesModal(false)}>
          <div className="kids-popup-card" onClick={e => e.stopPropagation()}>
            <div className="kids-popup-header">
              <h3>🏆 {lang === 'ta' ? 'உங்கள் சாதனைகள் & பதக்கங்கள்' : 'Your Badges & Achievements'}</h3>
              <button className="kids-popup-close-btn" onClick={() => setShowBadgesModal(false)} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <div className="kids-badges-content">
              <div className="kids-badge-stats-summary">
                <div className="badge-stat-box">
                  <span className="badge-stat-num">⭐ {stars}</span>
                  <span className="badge-stat-label">{lang === 'ta' ? 'நட்சத்திரங்கள்' : 'Stars Collected'}</span>
                </div>
                <div className="badge-stat-box">
                  <span className="badge-stat-num">🔥 {streak}</span>
                  <span className="badge-stat-label">{lang === 'ta' ? 'தொடர் நாட்கள்' : 'Day Streak'}</span>
                </div>
                <div className="badge-stat-box">
                  <span className="badge-stat-num">🏅 {acceptedQuests.length}</span>
                  <span className="badge-stat-label">{lang === 'ta' ? 'முடித்த பணிகள்' : 'Quests Done'}</span>
                </div>
              </div>

              <div className="kids-badges-list">
                <div className={`badge-item ${stars >= 1 ? 'unlocked' : 'locked'}`}>
                  <span className="badge-icon">🌟</span>
                  <div className="badge-info-col">
                    <strong>{lang === 'ta' ? 'குறள் தொடக்க வீரர்' : 'Kural Starter'}</strong>
                    <p>{lang === 'ta' ? 'முதல் குறளைக் கேட்டவர்' : 'Listened to your first Kural'}</p>
                  </div>
                  <span className="badge-status-tag">{stars >= 1 ? '✓ Unlocked' : '🔒 Locked'}</span>
                </div>

                <div className={`badge-item ${stars >= 5 ? 'unlocked' : 'locked'}`}>
                  <span className="badge-icon">📖</span>
                  <div className="badge-info-col">
                    <strong>{lang === 'ta' ? 'கதை விரும்பி' : 'Story Explorer'}</strong>
                    <p>{lang === 'ta' ? '5 குறள் கதைகளைப் படித்தவர்' : 'Read 5 Kural stories'}</p>
                  </div>
                  <span className="badge-status-tag">{stars >= 5 ? '✓ Unlocked' : '🔒 5 Stars Needed'}</span>
                </div>

                <div className={`badge-item ${acceptedQuests.length >= 1 ? 'unlocked' : 'locked'}`}>
                  <span className="badge-icon">🎯</span>
                  <div className="badge-info-col">
                    <strong>{lang === 'ta' ? 'நற்பண்பு நாயகன்' : 'Virtue Champion'}</strong>
                    <p>{lang === 'ta' ? 'ஒரு நற்பணியை ஏற்று முடித்தவர்' : 'Accepted and practiced a daily quest'}</p>
                  </div>
                  <span className="badge-status-tag">{acceptedQuests.length >= 1 ? '✓ Unlocked' : '🔒 Locked'}</span>
                </div>

                <div className={`badge-item ${stars >= 10 ? 'unlocked' : 'locked'}`}>
                  <span className="badge-icon">👑</span>
                  <div className="badge-info-col">
                    <strong>{lang === 'ta' ? 'வள்ளுவர் மாவீரர்' : 'Valluvar Master'}</strong>
                    <p>{lang === 'ta' ? '10 நட்சத்திரங்கள் ஈட்டிய மாவீரர்!' : 'Collected 10 wisdom stars!'}</p>
                  </div>
                  <span className="badge-status-tag">{stars >= 10 ? '✓ Unlocked' : '🔒 10 Stars Needed'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
