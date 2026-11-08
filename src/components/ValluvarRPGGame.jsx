import React, { useState, useEffect, useRef, useMemo } from 'react';
import './valluvarRPG.css';
import { 
  DoorOpen, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Play, 
  Square,
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Shield, 
  Coins, 
  Heart, 
  Share2, 
  ChevronRight, 
  Trophy, 
  BookOpen, 
  Scroll, 
  Languages, 
  Award, 
  MapPin, 
  Compass, 
  ArrowRight
} from 'lucide-react';
import { 
  RPG_ROLES, 
  RPG_SCENARIOS, 
  getMoralTitles 
} from '../utils/valluvarRPGData.js';
import { playTamilSpeech, stopTamilSpeech } from '../utils/kuralFeatures.js';

export default function ValluvarRPGGame({ 
  onExit, 
  onRewardStar, 
  initialLang = 'ta' 
}) {
  const [lang, setLang] = useState(initialLang); // 'ta' | 'en'
  const [gameStage, setGameStage] = useState('ROLE_SELECT'); // 'ROLE_SELECT' | 'DILEMMA' | 'REVELATION' | 'GAMEOVER'
  const [selectedRole, setSelectedRole] = useState('all');
  
  // Game Stats (0 - 100, starting at 50)
  const [stats, setStats] = useState({ aram: 50, porul: 50, inbam: 50 });
  const [statDeltas, setStatDeltas] = useState({ aram: 0, porul: 0, inbam: 0 });

  // Scenarios for current playthrough
  const [activeDilemmas, setActiveDilemmas] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [chosenChoice, setChosenChoice] = useState(null);
  const [learnedKurals, setLearnedKurals] = useState([]);

  // Audio / Sound state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const audioCtxRef = useRef(null);

  // Sound Synthesizer Helper
  const playTone = (freq, duration = 0.15, type = 'sine', gainVal = 0.1) => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio not permitted or failed
    }
  };

  const playChime = () => {
    playTone(523.25, 0.12, 'sine', 0.12);
    setTimeout(() => playTone(659.25, 0.16, 'sine', 0.12), 80);
    setTimeout(() => playTone(783.99, 0.25, 'sine', 0.15), 160);
  };

  const playDecisionSound = (isAramBoost) => {
    if (isAramBoost) {
      playTone(440, 0.1, 'triangle', 0.12);
      setTimeout(() => playTone(554.37, 0.18, 'triangle', 0.15), 90);
    } else {
      playTone(330, 0.12, 'sawtooth', 0.08);
      setTimeout(() => playTone(261.63, 0.22, 'sawtooth', 0.1), 100);
    }
  };

  const playFanfare = () => {
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      setTimeout(() => playTone(freq, 0.3, 'triangle', 0.15), idx * 120);
    });
  };

  // Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Start RPG Journey with selected role
  const startJourney = (roleId) => {
    stopTamilSpeech();
    setIsPlayingAudio(false);
    setSelectedRole(roleId);

    let scenarios = [];
    if (roleId === 'all') {
      scenarios = [...RPG_SCENARIOS];
    } else {
      scenarios = RPG_SCENARIOS.filter(s => s.roleId === roleId);
      // If a specific role has fewer than 4, pad with global high-stake scenarios
      if (scenarios.length < 3) {
        const others = RPG_SCENARIOS.filter(s => s.roleId !== roleId);
        scenarios = [...scenarios, ...others.slice(0, 3)];
      }
    }

    // Shuffle scenarios slightly for replayability
    const shuffled = [...scenarios].sort(() => 0.5 - Math.random());
    setActiveDilemmas(shuffled);
    setCurrentIdx(0);
    setStats({ aram: 50, porul: 50, inbam: 50 });
    setStatDeltas({ aram: 0, porul: 0, inbam: 0 });
    setLearnedKurals([]);
    setChosenChoice(null);
    setGameStage('DILEMMA');
    playChime();
  };

  // Handle Player's Choice
  const handleSelectChoice = (choice) => {
    stopTamilSpeech();
    setIsPlayingAudio(false);
    setChosenChoice(choice);

    // Calculate new stats (clamped between 0 and 100)
    const impact = choice.statImpact || { aram: 0, porul: 0, inbam: 0 };
    setStatDeltas(impact);

    setStats(prev => ({
      aram: Math.min(100, Math.max(0, prev.aram + (impact.aram || 0))),
      porul: Math.min(100, Math.max(0, prev.porul + (impact.porul || 0))),
      inbam: Math.min(100, Math.max(0, prev.inbam + (impact.inbam || 0)))
    }));

    // Record learned Kural
    if (choice.kural) {
      setLearnedKurals(prev => {
        if (!prev.find(k => k.Number === choice.kural.Number)) {
          return [...prev, choice.kural];
        }
        return prev;
      });
    }

    playDecisionSound((impact.aram || 0) > 0);
    setGameStage('REVELATION');
  };

  // Recite Kural using speech engine
  const handleReciteKural = (kural) => {
    if (isPlayingAudio) {
      stopTamilSpeech();
      setIsPlayingAudio(false);
      return;
    }
    setIsPlayingAudio(true);
    playTamilSpeech(
      kural,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false)
    );
  };

  // Continue to Next Dilemma or Game Over
  const handleContinue = () => {
    stopTamilSpeech();
    setIsPlayingAudio(false);

    if (currentIdx + 1 < activeDilemmas.length) {
      setCurrentIdx(idx => idx + 1);
      setChosenChoice(null);
      setGameStage('DILEMMA');
      playTone(440, 0.1, 'sine', 0.1);
    } else {
      // Victory / Conclusion
      setGameStage('GAMEOVER');
      playFanfare();
      if (onRewardStar) onRewardStar();
    }
  };

  // Restart Game
  const handleRestart = () => {
    stopTamilSpeech();
    setIsPlayingAudio(false);
    setGameStage('ROLE_SELECT');
  };

  // Share Result Card
  const handleShareResult = async () => {
    const moralTitle = getMoralTitles(stats.aram, stats.porul, stats.inbam);
    const shareText = `📜 வள்ளுவர் வழி (Valluvar's Path RPG)\n\nநான் பெற்ற வாழ்வியல் பட்டம்: ${moralTitle.title} ${moralTitle.badge}\n🛡️ அறம்: ${stats.aram} | 💰 பொருள்: ${stats.porul} | 🌸 இன்பம்: ${stats.inbam}\nகற்ற குறள்கள்: ${learnedKurals.length}\n\nவள்ளுவர் வழியில் உங்கள் முடிவுகளையும் சோதித்துப் பாருங்கள்!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "வள்ளுவர் வழி RPG முடிவு",
          text: shareText,
          url: window.location.href
        });
      } catch (e) {}
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        showToast("முடிவுகள் நகலெடுக்கப்பட்டன! (Copied to clipboard)");
      } catch (e) {
        showToast("நகலெடுக்க இயலவில்லை.");
      }
    }
  };

  // Current Scenario
  const currentScenario = activeDilemmas[currentIdx];
  const moralTitle = useMemo(() => {
    return getMoralTitles(stats.aram, stats.porul, stats.inbam);
  }, [stats]);

  return (
    <div className="valluvar-rpg-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="rpg-toast-popup">
          <Sparkles size={16} color="#fbbf24" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top HUD Banner */}
      <header className="rpg-hud-header">
        <div className="rpg-hud-top-row">
          <div className="rpg-brand-group">
            <div className="rpg-game-icon-badge" title="வள்ளுவர் வழி">
              ⚖️
            </div>
            <div>
              <h1 className="rpg-title-main">வள்ளுவர் வழி (Valluvar's Path)</h1>
              <p className="rpg-title-sub">
                {lang === 'ta' 
                  ? "அறம் • பொருள் • இன்பம் — நெறிமுறை வாழ்வியல் RPG விளையாட்டு"
                  : "Dharma, Wealth, Joy — A Moral Dilemma Narrative RPG"}
              </p>
            </div>
          </div>

          <div className="rpg-hud-actions">
            {/* Language Toggle */}
            <button 
              className="rpg-hud-btn"
              onClick={() => setLang(l => l === 'ta' ? 'en' : 'ta')}
              title="Change Language"
            >
              <Languages size={15} />
              <span>{lang === 'ta' ? 'English' : 'தமிழ்'}</span>
            </button>

            {/* Sound Toggle */}
            <button 
              className="rpg-hud-btn"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'ஒலி அணை' : 'ஒலி இயக்கு'}
            >
              {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            </button>

            {/* Exit Game */}
            {onExit && (
              <button 
                className="rpg-hud-btn exit-btn"
                onClick={() => {
                  stopTamilSpeech();
                  onExit();
                }}
                title="வெளியேறு (Exit Game)"
              >
                <DoorOpen size={15} />
                <span>வெளியேறு</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Three Stats: Aram (அறம்), Porul (பொருள்), Inbam (இன்பம்) */}
        <div className="rpg-stat-bars-grid">
          {/* 1. Aram (Virtue) */}
          <div className="rpg-stat-card">
            <div className="rpg-stat-meta">
              <div className="rpg-stat-label-box" style={{ color: '#34d399' }}>
                <Shield size={16} />
                <span>{lang === 'ta' ? 'அறம் (Virtue)' : 'Virtue (Aram)'}</span>
                {statDeltas.aram !== 0 && (
                  <span className={`rpg-delta-badge ${statDeltas.aram > 0 ? 'pos' : 'neg'}`}>
                    {statDeltas.aram > 0 ? `+${statDeltas.aram}` : statDeltas.aram}
                  </span>
                )}
              </div>
              <span className="rpg-stat-value" style={{ color: '#a7f3d0' }}>
                {stats.aram} / 100
              </span>
            </div>
            <div className="rpg-stat-track">
              <div 
                className="rpg-stat-fill aram" 
                style={{ width: `${stats.aram}%` }} 
              />
            </div>
          </div>

          {/* 2. Porul (Wealth) */}
          <div className="rpg-stat-card">
            <div className="rpg-stat-meta">
              <div className="rpg-stat-label-box" style={{ color: '#fbbf24' }}>
                <Coins size={16} />
                <span>{lang === 'ta' ? 'பொருள் (Wealth)' : 'Wealth (Porul)'}</span>
                {statDeltas.porul !== 0 && (
                  <span className={`rpg-delta-badge ${statDeltas.porul > 0 ? 'pos' : 'neg'}`}>
                    {statDeltas.porul > 0 ? `+${statDeltas.porul}` : statDeltas.porul}
                  </span>
                )}
              </div>
              <span className="rpg-stat-value" style={{ color: '#fde68a' }}>
                {stats.porul} / 100
              </span>
            </div>
            <div className="rpg-stat-track">
              <div 
                className="rpg-stat-fill porul" 
                style={{ width: `${stats.porul}%` }} 
              />
            </div>
          </div>

          {/* 3. Inbam (Joy) */}
          <div className="rpg-stat-card">
            <div className="rpg-stat-meta">
              <div className="rpg-stat-label-box" style={{ color: '#f472b6' }}>
                <Heart size={16} />
                <span>{lang === 'ta' ? 'இன்பம் (Joy)' : 'Joy (Inbam)'}</span>
                {statDeltas.inbam !== 0 && (
                  <span className={`rpg-delta-badge ${statDeltas.inbam > 0 ? 'pos' : 'neg'}`}>
                    {statDeltas.inbam > 0 ? `+${statDeltas.inbam}` : statDeltas.inbam}
                  </span>
                )}
              </div>
              <span className="rpg-stat-value" style={{ color: '#fbcfe8' }}>
                {stats.inbam} / 100
              </span>
            </div>
            <div className="rpg-stat-track">
              <div 
                className="rpg-stat-fill inbam" 
                style={{ width: `${stats.inbam}%` }} 
              />
            </div>
          </div>
        </div>
      </header>

      {/* ==============================================================
          STAGE 1: ROLE SELECTION SCREEN
          ============================================================== */}
      {gameStage === 'ROLE_SELECT' && (
        <section className="rpg-role-selection-card">
          <div className="rpg-intro-badge">
            <Compass size={14} />
            <span>{lang === 'ta' ? 'வாழ்வியல் களம் தேர்வு செய்க' : 'Choose Your Societal Path'}</span>
          </div>

          <h2 className="rpg-role-main-heading">
            {lang === 'ta' ? 'நீங்கள் யார் வழியில் பயணம் செய்யப் போகிறீர்கள்?' : 'Whose Path Will You Walk?'}
          </h2>

          <p className="rpg-role-main-desc">
            {lang === 'ta'
              ? 'பண்டைத் தமிழ் சமூகத்தின் முக்கியப் பாத்திரங்களின் கண்களினூடே வாழ்வின் சிக்கலான தார்மீக சோதனைகளை எதிர்கொள்ளுங்கள். உங்கள் ஒவ்வொரு முடிவும் உங்கள் அறம், பொருள், இன்பம் நிலைகளை மாற்றியமைக்கும்.'
              : 'Step into the shoes of ancient Tamil leaders, merchants, and thinkers. Each moral dilemma tests your adherence to Thirukkural principles.'}
          </p>

          <div className="rpg-roles-grid">
            {RPG_ROLES.map(role => (
              <div 
                key={role.id}
                className={`rpg-role-choice-card ${selectedRole === role.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedRole(role.id);
                  playTone(500, 0.08, 'sine', 0.1);
                }}
              >
                <div>
                  <div className="rpg-role-card-top">
                    <span className="rpg-role-icon">{role.icon}</span>
                    <div>
                      <h3 className="rpg-role-card-title">
                        {lang === 'ta' ? role.name : role.nameEn}
                      </h3>
                      <p className="rpg-role-card-subtitle">{role.title}</p>
                    </div>
                  </div>
                  <p className="rpg-role-card-desc">{role.description}</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{ 
                    fontSize: '0.82rem', 
                    fontWeight: '700', 
                    color: selectedRole === role.id ? '#d97706' : '#9ca3af',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {selectedRole === role.id ? '✓ தேர்ந்தெடுக்கப்பட்டது' : 'தேர்ந்தெடு'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button 
            className="rpg-start-journey-btn"
            onClick={() => startJourney(selectedRole)}
          >
            <Sparkles size={20} />
            <span>{lang === 'ta' ? 'பயணத்தைத் தொடங்குக (Start Journey)' : 'Begin Odyssey'}</span>
            <ArrowRight size={20} />
          </button>
        </section>
      )}

      {/* ==============================================================
          STAGE 2: DILEMMA & DECISION SCREEN
          ============================================================== */}
      {gameStage === 'DILEMMA' && currentScenario && (
        <section className="rpg-story-scroll">
          <div className="rpg-story-header">
            <div>
              <div className="rpg-stage-tag">
                <Scroll size={13} />
                <span>
                  {lang === 'ta'
                    ? `நிலை ${currentIdx + 1} / ${activeDilemmas.length} • ${currentScenario.roleName}`
                    : `Stage ${currentIdx + 1} of ${activeDilemmas.length} • ${currentScenario.roleName}`}
                </span>
              </div>
              <h2 className="rpg-dilemma-title">
                {lang === 'ta' ? currentScenario.title : currentScenario.titleEn}
              </h2>
              <div className="rpg-dilemma-location">
                <MapPin size={14} color="#d97706" />
                <span>{currentScenario.location}</span>
              </div>
            </div>
          </div>

          {/* Story Narrative Box */}
          <div className="rpg-story-box">
            {currentScenario.situation}
          </div>

          {lang === 'en' && currentScenario.situationEn && (
            <div className="rpg-story-box en-translation">
              {currentScenario.situationEn}
            </div>
          )}

          {/* Meaningful Choices */}
          <div className="rpg-choices-prompt">
            <Compass size={18} color="#d97706" />
            <span>
              {lang === 'ta' ? 'உங்கள் முடிவு என்ன? (Select Your Decision):' : 'What is your decree?'}
            </span>
          </div>

          <div className="rpg-choices-list">
            {currentScenario.choices.map(choice => (
              <button 
                key={choice.id}
                className="rpg-choice-card-btn"
                onClick={() => handleSelectChoice(choice)}
              >
                <div className="rpg-choice-letter">{choice.id}</div>
                <div className="rpg-choice-content">
                  <p className="rpg-choice-main-text">{choice.text}</p>
                  {lang === 'en' && choice.textEn && (
                    <p className="rpg-choice-sub-text">{choice.textEn}</p>
                  )}
                </div>
                <ChevronRight size={18} color="#b45309" style={{ alignSelf: 'center' }} />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ==============================================================
          STAGE 3: REVELATION & THE GUIDING THIRUKKURAL
          ============================================================== */}
      {gameStage === 'REVELATION' && chosenChoice && (
        <section className="rpg-story-scroll">
          <div className="rpg-revelation-container">
            {/* Outcome Narrative & Stat Impact */}
            <div className="rpg-outcome-banner">
              <h3 className="rpg-outcome-title">
                <CheckCircle2 size={20} color="#059669" />
                <span>{lang === 'ta' ? 'முடிவின் விளைவு (The Outcome):' : 'Consequence of Your Decision:'}</span>
              </h3>

              <p className="rpg-outcome-desc">{chosenChoice.outcome}</p>
              {lang === 'en' && chosenChoice.outcomeEn && (
                <p className="rpg-outcome-desc" style={{ fontStyle: 'italic', color: '#6b5541' }}>
                  {chosenChoice.outcomeEn}
                </p>
              )}

              {/* Stat Impact Badges */}
              <div className="rpg-stat-impact-pill-row">
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#78350f' }}>
                  {lang === 'ta' ? 'அளவுகோல் மாற்றம்:' : 'Stat Impact:'}
                </span>

                {chosenChoice.statImpact.aram !== 0 && (
                  <span className={`rpg-impact-badge ${chosenChoice.statImpact.aram > 0 ? 'pos' : 'neg'}`}>
                    <Shield size={13} />
                    <span>அறம்: {chosenChoice.statImpact.aram > 0 ? `+${chosenChoice.statImpact.aram}` : chosenChoice.statImpact.aram}</span>
                  </span>
                )}

                {chosenChoice.statImpact.porul !== 0 && (
                  <span className={`rpg-impact-badge ${chosenChoice.statImpact.porul > 0 ? 'pos' : 'neg'}`}>
                    <Coins size={13} />
                    <span>பொருள்: {chosenChoice.statImpact.porul > 0 ? `+${chosenChoice.statImpact.porul}` : chosenChoice.statImpact.porul}</span>
                  </span>
                )}

                {chosenChoice.statImpact.inbam !== 0 && (
                  <span className={`rpg-impact-badge ${chosenChoice.statImpact.inbam > 0 ? 'pos' : 'neg'}`}>
                    <Heart size={13} />
                    <span>இன்பம்: {chosenChoice.statImpact.inbam > 0 ? `+${chosenChoice.statImpact.inbam}` : chosenChoice.statImpact.inbam}</span>
                  </span>
                )}
              </div>
            </div>

            {/* The Holy Guiding Thirukkural Card */}
            {chosenChoice.kural && (
              <div className="rpg-kural-holy-scroll">
                <div className="rpg-kural-scroll-badge">
                  <BookOpen size={13} />
                  <span>வள்ளுவர் காட்டிய நெறி • திருக்குறள் {chosenChoice.kural.Number}</span>
                </div>

                <div className="rpg-holy-couplet">
                  <span className="line">{chosenChoice.kural.Line1}</span>
                  <span className="line">{chosenChoice.kural.Line2}</span>
                </div>

                <div className="rpg-kural-actions-bar">
                  <button 
                    className={`rpg-listen-speech-btn ${isPlayingAudio ? 'playing' : ''}`}
                    onClick={() => handleReciteKural(chosenChoice.kural)}
                  >
                    {isPlayingAudio ? <Square size={14} /> : <Play size={14} />}
                    <span>{isPlayingAudio ? 'நிறுத்து (Stop)' : 'குறள் ஒலி வடிவம் (Listen)'}</span>
                  </button>
                </div>

                <div className="rpg-holy-explanation">
                  <strong>பொருள் (Meaning): </strong>
                  <span>{chosenChoice.kural.mv}</span>
                  {chosenChoice.kural.trans && (
                    <div style={{ marginTop: '6px', fontStyle: 'italic', color: '#78350f', fontSize: '0.88rem' }}>
                      <strong>Translation: </strong> {chosenChoice.kural.trans}
                    </div>
                  )}
                </div>

                {chosenChoice.valluvarAdvice && (
                  <div className="rpg-valluvar-verdict">
                    <Sparkles size={18} color="#d97706" style={{ flexShrink: 0 }} />
                    <div>
                      <strong>வள்ளுவர் அறிவுரை: </strong>
                      <span>{chosenChoice.valluvarAdvice}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Continue Button */}
            <div className="rpg-next-dilemma-bar">
              <button 
                className="rpg-continue-btn"
                onClick={handleContinue}
              >
                <span>
                  {currentIdx + 1 < activeDilemmas.length
                    ? (lang === 'ta' ? 'அடுத்த சோதனைக்குச் செல்க' : 'Proceed to Next Trial')
                    : (lang === 'ta' ? 'வாழ்வியல் தீர்ப்பைப் பெறுக' : 'View Final Verdict')}
                </span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ==============================================================
          STAGE 4: GAME OVER & MORAL TITLE CELEBRATION
          ============================================================== */}
      {gameStage === 'GAMEOVER' && (
        <section className="rpg-victory-scroll">
          <div className="rpg-victory-top-badge">
            {moralTitle.badge}
          </div>

          <h2 className="rpg-victory-title">
            {moralTitle.title}
          </h2>

          <p className="rpg-victory-role-subtitle">
            {lang === 'ta' ? 'வாழ்வியல் நெறிமுறைப் பட்டம்' : 'Life Mastery Honor Title'}
          </p>

          <div className="rpg-victory-stats-card">
            <div className="rpg-stat-bars-grid" style={{ marginBottom: '1.2rem' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#059669' }}>{stats.aram}</span>
                <div style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: '600' }}>அறம் (Virtue)</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#d97706' }}>{stats.porul}</span>
                <div style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: '600' }}>பொருள் (Wealth)</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#db2777' }}>{stats.inbam}</span>
                <div style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: '600' }}>இன்பம் (Joy)</div>
              </div>
            </div>

            <div className="rpg-verdict-quote-box">
              <strong>வாழ்வியல் தீர்ப்பு: </strong>
              <p style={{ margin: '4px 0 0' }}>{moralTitle.verdictTa}</p>
              {lang === 'en' && (
                <p style={{ margin: '6px 0 0', fontStyle: 'italic', color: '#6b5541' }}>
                  {moralTitle.verdictEn}
                </p>
              )}
            </div>
          </div>

          {/* Learned Kurals Showcase */}
          {learnedKurals.length > 0 && (
            <div className="rpg-learned-kurals-section">
              <h3 className="rpg-learned-heading">
                <BookOpen size={18} color="#b45309" />
                <span>
                  {lang === 'ta'
                    ? `இப்பயணத்தில் நீங்கள் உணர்ந்த திருக்குறள்கள் (${learnedKurals.length})`
                    : `Thirukkurals Internalized on Your Journey (${learnedKurals.length})`}
                </span>
              </h3>

              <div className="rpg-learned-grid">
                {learnedKurals.map(kural => (
                  <div key={kural.Number} className="rpg-learned-kural-mini">
                    <span className="rpg-learned-badge">குறள் {kural.Number}</span>
                    <p className="rpg-learned-couplet-text">
                      {kural.Line1}<br />{kural.Line2}
                    </p>
                    <p className="rpg-learned-meaning">{kural.mv}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons: Play Again & Share */}
          <div className="rpg-victory-actions">
            <button 
              className="rpg-action-primary-btn"
              onClick={handleRestart}
            >
              <RotateCcw size={18} />
              <span>{lang === 'ta' ? 'மீண்டும் விளையாடு (Play Again)' : 'Play Again'}</span>
            </button>

            <button 
              className="rpg-action-secondary-btn"
              onClick={handleShareResult}
            >
              <Share2 size={18} />
              <span>{lang === 'ta' ? 'பட்டத்தைப் பகிர் (Share Title)' : 'Share Result'}</span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
