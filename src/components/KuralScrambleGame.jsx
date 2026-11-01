import React, { useState, useEffect, useRef } from 'react';
import './kuralScramble.css';
import { 
  DoorOpen, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Play, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Timer, 
  Brain, 
  Eye, 
  Shuffle, 
  ChevronRight, 
  Trophy, 
  Smile, 
  Lightbulb, 
  BookOpen 
} from 'lucide-react';
import { playTamilSpeech, stopTamilSpeech } from '../utils/kuralFeatures.js';
import { getKidsStoryAndQuest, getKuralAthigaram, playKidChime } from '../utils/kidsData.js';

export default function KuralScrambleGame({ 
  kuralData = [], 
  initialKuralNumber = 1, 
  onExit, 
  onRewardStar, 
  lang = 'ta' 
}) {
  const [currentNum, setCurrentNum] = useState(Number(initialKuralNumber) || 1);
  const [gameMode, setGameMode] = useState('memory'); // 'practice' | 'memory' | 'challenge'
  const [phase, setPhase] = useState('LEARN'); // 'LEARN' | 'PUZZLE' | 'CELEBRATE'
  
  // Game stats
  const [score, setScore] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Phase 1 Study Timer
  const [studyTimeLeft, setStudyTimeLeft] = useState(10);
  const [showMeaning, setShowMeaning] = useState(false);
  const [showPeek, setShowPeek] = useState(false);

  // Phase 2 Challenge Timer
  const [challengeTimeLeft, setChallengeTimeLeft] = useState(45);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Board & Tiles State
  // 7 slots: index 0..3 (Line 1), 4..6 (Line 2)
  const [targetSlots, setTargetSlots] = useState(Array(7).fill(null));
  const [scrambledPool, setScrambledPool] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [validationResult, setValidationResult] = useState(null); // array of booleans [true, false, ...]

  const audioCtxRef = useRef(null);

  // Find Current Kural
  const currentKural = kuralData.find(k => Number(k.Number) === currentNum) || {
    Number: currentNum,
    Line1: "அகர முதல எழுத்தெல்லாம் ஆதி",
    Line2: "பகவன் முதற்றே உலகு.",
    Translation: "As the letter A is the first of all letters, so the eternal God is the first in the world."
  };

  const athigaram = getKuralAthigaram(currentNum);
  const kidsContent = getKidsStoryAndQuest(currentKural);

  // Exactly 7 words of the Kural
  const correctWords = `${currentKural.Line1 || ''} ${currentKural.Line2 || ''}`
    .trim()
    .split(/\s+/)
    .slice(0, 7);

  // Setup / Reset on Kural change
  useEffect(() => {
    stopTamilSpeech();
    setIsPlayingAudio(false);
    setPhase('LEARN');
    setStudyTimeLeft(10);
    setChallengeTimeLeft(45);
    setIsTimeUp(false);
    setShowMeaning(false);
    setShowPeek(false);
    setTargetSlots(Array(7).fill(null));
    setValidationResult(null);

    // Create shuffled tiles
    const tiles = correctWords.map((word, idx) => ({
      id: `${currentNum}-${idx}-${word}`,
      text: word,
      correctSlot: idx
    }));
    setScrambledPool(shuffleArray([...tiles]));
  }, [currentNum]);

  // Phase 1 Study 10s Timer (in Memory mode)
  useEffect(() => {
    let timer = null;
    if (phase === 'LEARN' && gameMode === 'memory') {
      timer = setInterval(() => {
        setStudyTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            startPuzzle();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [phase, gameMode]);

  // Phase 2 Challenge 45s Timer (in Challenge mode)
  useEffect(() => {
    let timer = null;
    if (phase === 'PUZZLE' && gameMode === 'challenge' && !isTimeUp) {
      timer = setInterval(() => {
        setChallengeTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsTimeUp(true);
            playSfx('wrong');
            return 0;
          }
          if (prev <= 5) playSfx('tick');
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [phase, gameMode, isTimeUp]);

  // Web Audio SFX
  const playSfx = (type) => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      if (type === 'pop') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.14);

      } else if (type === 'correct') {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.2, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.38);
        });

      } else if (type === 'wrong') {
        [240, 190].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);
          gain.gain.setValueAtTime(0.18, now + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.18);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.2);
        });

      } else if (type === 'tick') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    } catch (e) {}
  };

  // Audio Playback
  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopTamilSpeech(() => setIsPlayingAudio(false));
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      playTamilSpeech(
        currentKural,
        () => setIsPlayingAudio(true),
        () => setIsPlayingAudio(false)
      );
    }
  };

  // Start Puzzle phase
  const startPuzzle = () => {
    stopTamilSpeech();
    setIsPlayingAudio(false);
    setPhase('PUZZLE');
    playSfx('pop');
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, item, source, sourceIndex) => {
    setDraggedItem({ item, source, sourceIndex });
    e.dataTransfer.setData('text/plain', JSON.stringify({ item, source, sourceIndex }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropOnSlot = (e, slotIndex) => {
    e.preventDefault();
    if (!draggedItem) return;

    const { item, source, sourceIndex } = draggedItem;
    playSfx('pop');

    const newTargetSlots = [...targetSlots];
    const newPool = [...scrambledPool];

    // If target slot is already filled, move existing item to pool or swap
    const existingSlotItem = newTargetSlots[slotIndex];

    if (source === 'pool') {
      newPool.splice(sourceIndex, 1);
      if (existingSlotItem) {
        newPool.push(existingSlotItem);
      }
      newTargetSlots[slotIndex] = item;
    } else if (source === 'slot') {
      // Swapping slots
      newTargetSlots[sourceIndex] = existingSlotItem;
      newTargetSlots[slotIndex] = item;
    }

    setTargetSlots(newTargetSlots);
    setScrambledPool(newPool);
    setDraggedItem(null);
    setValidationResult(null);
  };

  const handleDropOnPool = (e) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.source !== 'slot') return;

    const { item, sourceIndex } = draggedItem;
    playSfx('pop');

    const newTargetSlots = [...targetSlots];
    newTargetSlots[sourceIndex] = null;

    setTargetSlots(newTargetSlots);
    setScrambledPool(prev => [...prev, item]);
    setDraggedItem(null);
    setValidationResult(null);
  };

  // Tap-to-Place (Mobile Friendly)
  const handleTapPoolTile = (item, poolIndex) => {
    playSfx('pop');
    // Find first empty slot
    const firstEmptyIndex = targetSlots.findIndex(s => s === null);
    if (firstEmptyIndex === -1) return; // all slots filled

    const newSlots = [...targetSlots];
    newSlots[firstEmptyIndex] = item;

    const newPool = [...scrambledPool];
    newPool.splice(poolIndex, 1);

    setTargetSlots(newSlots);
    setScrambledPool(newPool);
    setValidationResult(null);
  };

  // Tap to Return from Slot
  const handleTapSlotTile = (slotIndex) => {
    const item = targetSlots[slotIndex];
    if (!item) return;

    playSfx('pop');
    const newSlots = [...targetSlots];
    newSlots[slotIndex] = null;

    setTargetSlots(newSlots);
    setScrambledPool(prev => [...prev, item]);
    setValidationResult(null);
  };

  // Hint Button: Automatically places the next unplaced correct word
  const handleUseHint = () => {
    playSfx('pop');
    // Find first unfilled or incorrectly placed slot
    for (let i = 0; i < 7; i++) {
      const current = targetSlots[i];
      if (!current || current.text !== correctWords[i]) {
        // Find the matching tile in pool or in other slot
        let foundTile = scrambledPool.find(t => t.text === correctWords[i]);
        let fromPool = true;
        let fromSlotIdx = -1;

        if (!foundTile) {
          // Look in other slots
          fromSlotIdx = targetSlots.findIndex(t => t && t.text === correctWords[i]);
          if (fromSlotIdx !== -1) {
            foundTile = targetSlots[fromSlotIdx];
            fromPool = false;
          }
        }

        if (foundTile) {
          const newSlots = [...targetSlots];
          const newPool = [...scrambledPool];

          // Clear previous location
          if (fromPool) {
            const pIdx = newPool.findIndex(t => t.id === foundTile.id);
            if (pIdx !== -1) newPool.splice(pIdx, 1);
          } else {
            newSlots[fromSlotIdx] = null;
          }

          // If target had something, push to pool
          if (newSlots[i]) {
            newPool.push(newSlots[i]);
          }

          newSlots[i] = foundTile;
          setTargetSlots(newSlots);
          setScrambledPool(newPool);
          setValidationResult(null);
          return;
        }
      }
    }
  };

  // Reshuffle Pool
  const handleReshufflePool = () => {
    playSfx('pop');
    setScrambledPool(prev => shuffleArray([...prev]));
  };

  // Reset Board to Pool
  const handleResetBoard = () => {
    playSfx('pop');
    const allTiles = [
      ...scrambledPool,
      ...targetSlots.filter(Boolean)
    ];
    setTargetSlots(Array(7).fill(null));
    setScrambledPool(shuffleArray(allTiles));
    setValidationResult(null);
  };

  // Check Answer Validation
  const handleCheckAnswer = () => {
    const results = targetSlots.map((tile, idx) => {
      return tile && tile.text === correctWords[idx];
    });

    const isAllCorrect = results.every(Boolean);

    if (isAllCorrect) {
      playSfx('correct');
      setScore(s => s + 100);
      setSolvedCount(c => c + 1);
      if (onRewardStar) onRewardStar();

      setPhase('CELEBRATE');

      // Read Kural aloud upon completion
      setTimeout(() => {
        playTamilSpeech(currentKural);
      }, 400);

    } else {
      playSfx('wrong');
      setValidationResult(results);
    }
  };

  // Next Kural Navigation
  const handleNextKural = () => {
    const total = kuralData.length || 1330;
    if (currentNum < total) {
      setCurrentNum(prev => prev + 1);
    } else {
      setCurrentNum(1);
    }
  };

  const isAllFilled = targetSlots.every(Boolean);

  return (
    <div className="kural-scramble-container">
      
      {/* Top HUD Bar */}
      <header className="scramble-hud">
        <div className="scramble-hud-left">
          <button className="scramble-exit-btn" onClick={onExit} title="வெளியேறு (Exit to Kids Mode)">
            <DoorOpen size={16} />
            <span>{lang === 'ta' ? 'வெளியேறு' : 'Exit'}</span>
          </button>

          <div className="game-hud-branding-pill" title="SRM & SRM தமிழ் மன்றம்">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/7/7a/SRM_Institute_of_Science_and_Technology_Logo.svg" 
              alt="SRM IST" 
              className="game-hud-srm-logo" 
            />
            <span className="game-hud-divider" />
            <img 
              src="mozhi_to_machine.png" 
              alt="SRM தமிழ் மன்றம்" 
              className="game-hud-mandram-logo" 
            />
          </div>

          <div className="scramble-game-title">
            <span>🧩 குறள் புதிர் (Scramble)</span>
          </div>
        </div>

        <div className="scramble-hud-right">
          {/* Mode Switcher */}
          <div className="scramble-mode-toggle">
            <button 
              className={`scramble-mode-btn ${gameMode === 'practice' ? 'active' : ''}`}
              onClick={() => { setGameMode('practice'); setPhase('PUZZLE'); }}
            >
              {lang === 'ta' ? 'பயிற்சி' : 'Practice'}
            </button>
            <button 
              className={`scramble-mode-btn ${gameMode === 'memory' ? 'active' : ''}`}
              onClick={() => { setGameMode('memory'); setPhase('LEARN'); setStudyTimeLeft(10); }}
            >
              {lang === 'ta' ? 'நினைவாற்றல்' : 'Memory'}
            </button>
            <button 
              className={`scramble-mode-btn ${gameMode === 'challenge' ? 'active' : ''}`}
              onClick={() => { setGameMode('challenge'); setPhase('PUZZLE'); setChallengeTimeLeft(45); setIsTimeUp(false); }}
            >
              {lang === 'ta' ? 'சவால்' : 'Challenge'}
            </button>
          </div>

          <div className="scramble-stat-pill">
            <span>⭐ {score}</span>
          </div>
          <div className="scramble-stat-pill">
            <span>🏆 {solvedCount}</span>
          </div>

          <button 
            className="kids-social-icon-btn" 
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'ஒலி அணை' : 'ஒலி இயக்கு'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>
      </header>

      {/* PHASE 1: STUDY & LEARN CARD */}
      {phase === 'LEARN' && (
        <section className="scramble-learn-card">
          <div className="scramble-chapter-pill">
            <BookOpen size={15} />
            <span>
              {lang === 'ta' 
                ? `${athigaram.paal} • அதிகாரம் ${athigaram.chapterNumber}: ${athigaram.chapterName}` 
                : `${athigaram.paalEn} • Ch ${athigaram.chapterNumber}: ${athigaram.chapterEn}`}
            </span>
          </div>

          <div className="scramble-original-verse">
            <p className="scramble-verse-line">{currentKural.Line1}</p>
            <p className="scramble-verse-line">{currentKural.Line2}</p>
          </div>

          {/* Action Row: Listen & Meaning */}
          <div className="scramble-actions-row">
            <button 
              className={`scramble-action-btn ${isPlayingAudio ? 'playing' : ''}`}
              onClick={handleToggleAudio}
            >
              <Volume2 size={18} />
              <span>{isPlayingAudio ? (lang === 'ta' ? 'நிறுத்து' : 'Stop') : (lang === 'ta' ? 'கேள் (Listen)' : 'Listen')}</span>
            </button>

            <button 
              className="scramble-action-btn"
              onClick={() => setShowMeaning(!showMeaning)}
            >
              <Lightbulb size={18} />
              <span>{lang === 'ta' ? 'பொருள் (Meaning)' : 'Meaning'}</span>
            </button>
          </div>

          {/* Child-friendly meaning toggle */}
          {showMeaning && (
            <div className="scramble-peek-banner" style={{ maxWidth: 640, margin: '0 auto 1.5rem' }}>
              {currentKural.explanation || currentKural.simple_explanation || currentKural.Translation}
            </div>
          )}

          {/* 10s Study Countdown in Memory Mode */}
          {gameMode === 'memory' && (
            <div className="scramble-countdown-box">
              <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#92400e' }}>
                👀 {lang === 'ta' ? 'குறளை நினைவில் நிறுத்துங்கள்:' : 'Memorize the Kural:'}
              </span>
              <div className="scramble-countdown-num">{studyTimeLeft}s</div>
              <div className="scramble-countdown-bar-track">
                <div 
                  className="scramble-countdown-bar-fill"
                  style={{ width: `${(studyTimeLeft / 10) * 100}%` }}
                />
              </div>
            </div>
          )}

          <button className="scramble-ready-btn" onClick={startPuzzle}>
            <Play size={20} />
            <span>{lang === 'ta' ? 'நான் தயார்! புதிரைத் தொடங்கு 🚀' : "I'm Ready! Start Puzzle 🚀"}</span>
          </button>
        </section>
      )}

      {/* PHASE 2: JUMBLE & TARGET PUZZLE BOARD */}
      {phase === 'PUZZLE' && (
        <section className="scramble-board-container">
          
          {/* Target Drop Board */}
          <div className="scramble-target-board">
            
            <div className="scramble-board-header">
              <div className="scramble-board-prompt">
                <span>✋ {lang === 'ta' ? 'வார்த்தைகளைச் சரியான வரிசையில் அடுக்கவும்:' : 'Arrange the words in correct order:'}</span>
              </div>

              {/* Challenge Mode Timer Indicator */}
              {gameMode === 'challenge' && (
                <div className={`kural-jump-timer-badge ${challengeTimeLeft <= 10 ? 'urgent' : ''}`}>
                  <Timer size={15} />
                  <span>{challengeTimeLeft}s</span>
                </div>
              )}
            </div>

            {/* In Practice Mode or Peek: reference view */}
            {showPeek && (
              <div className="scramble-peek-banner">
                {currentKural.Line1} • {currentKural.Line2}
              </div>
            )}

            {/* Target Slots: Line 1 (4 Slots) */}
            <div className="scramble-target-line">
              {[0, 1, 2, 3].map((slotIdx) => {
                const item = targetSlots[slotIdx];
                let validationClass = '';
                if (validationResult) {
                  validationClass = validationResult[slotIdx] ? 'correct-placed' : 'wrong-placed';
                }

                return (
                  <div
                    key={slotIdx}
                    className={`scramble-target-slot ${item ? 'filled' : ''} ${validationClass}`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnSlot(e, slotIdx)}
                  >
                    <span className="scramble-slot-index-badge">{slotIdx + 1}</span>

                    {item ? (
                      <div
                        className="scramble-word-tile in-slot"
                        draggable
                        onDragStart={(e) => handleDragStart(e, item, 'slot', slotIdx)}
                        onClick={() => handleTapSlotTile(slotIdx)}
                        title="மீண்டும் கீழே அனுப்ப தட்டவும்"
                      >
                        {item.text}
                      </div>
                    ) : (
                      <span className="scramble-slot-empty-text">
                        {lang === 'ta' ? `சீர் ${slotIdx + 1}` : `Word ${slotIdx + 1}`}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Target Slots: Line 2 (3 Slots) */}
            <div className="scramble-target-line">
              {[4, 5, 6].map((slotIdx) => {
                const item = targetSlots[slotIdx];
                let validationClass = '';
                if (validationResult) {
                  validationClass = validationResult[slotIdx] ? 'correct-placed' : 'wrong-placed';
                }

                return (
                  <div
                    key={slotIdx}
                    className={`scramble-target-slot ${item ? 'filled' : ''} ${validationClass}`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnSlot(e, slotIdx)}
                  >
                    <span className="scramble-slot-index-badge">{slotIdx + 1}</span>

                    {item ? (
                      <div
                        className="scramble-word-tile in-slot"
                        draggable
                        onDragStart={(e) => handleDragStart(e, item, 'slot', slotIdx)}
                        onClick={() => handleTapSlotTile(slotIdx)}
                        title="மீண்டும் கீழே அனுப்ப தட்டவும்"
                      >
                        {item.text}
                      </div>
                    ) : (
                      <span className="scramble-slot-empty-text">
                        {lang === 'ta' ? `சீர் ${slotIdx + 1}` : `Word ${slotIdx + 1}`}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* Scrambled Word Pool */}
          <div 
            className="scramble-pool-container"
            onDragOver={handleDragOver}
            onDrop={handleDropOnPool}
          >
            <div className="scramble-pool-header">
              <span>🧩 {lang === 'ta' ? 'கலைக்கப்பட்ட வார்த்தைத் துண்டுகள் (இழுக்கவும் அல்லது தட்டவும்):' : 'Scrambled Word Tiles (Drag or Tap):'}</span>
            </div>

            <div className="scramble-tiles-pool">
              {scrambledPool.map((tile, pIdx) => (
                <div
                  key={tile.id}
                  className="scramble-word-tile"
                  draggable
                  onDragStart={(e) => handleDragStart(e, tile, 'pool', pIdx)}
                  onClick={() => handleTapPoolTile(tile, pIdx)}
                >
                  {tile.text}
                </div>
              ))}
              {scrambledPool.length === 0 && (
                <span style={{ color: '#16a34a', fontWeight: 800 }}>
                  ✨ {lang === 'ta' ? 'எல்லா வார்த்தைகளும் அடுக்கப்பட்டுவிட்டன!' : 'All words are placed!'}
                </span>
              )}
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="scramble-action-bar">
            <div className="scramble-btn-group-left">
              <button className="scramble-secondary-btn" onClick={handleUseHint} title="ஒரு வார்த்தையை சரியாக வைக்க">
                <Lightbulb size={16} color="#d97706" />
                <span>{lang === 'ta' ? 'குறிப்பு (Hint)' : 'Hint'}</span>
              </button>

              <button className="scramble-secondary-btn" onClick={handleReshufflePool} title="கீழே உள்ள வார்த்தைகளை கலைக்க">
                <Shuffle size={16} />
                <span>{lang === 'ta' ? 'கலை' : 'Shuffle'}</span>
              </button>

              <button className="scramble-secondary-btn" onClick={handleResetBoard} title="அனைத்தையும் மீண்டும் தொடங்க">
                <RotateCcw size={16} />
                <span>{lang === 'ta' ? 'மீளமை' : 'Reset'}</span>
              </button>

              {gameMode === 'practice' && (
                <button 
                  className="scramble-secondary-btn" 
                  onClick={() => setShowPeek(!showPeek)}
                >
                  <Eye size={16} />
                  <span>{showPeek ? (lang === 'ta' ? 'மறை' : 'Hide') : (lang === 'ta' ? 'குறளைப் பார்' : 'Peek Kural')}</span>
                </button>
              )}
            </div>

            <button 
              className="scramble-check-btn" 
              onClick={handleCheckAnswer}
              disabled={!isAllFilled}
            >
              <CheckCircle2 size={18} />
              <span>{lang === 'ta' ? 'சரிபார் (CHECK ANSWER)' : 'CHECK ANSWER'}</span>
            </button>
          </div>

        </section>
      )}

      {/* PHASE 4: CELEBRATION CARD */}
      {phase === 'CELEBRATE' && (
        <section className="scramble-celebration-card">
          <div className="scramble-celeb-icon">🎉⭐</div>
          <h2 className="scramble-celeb-title">
            {lang === 'ta' ? 'அற்புதம்! சரியான வரிசை!' : 'Bravo! Perfectly Arranged!'}
          </h2>
          <p className="scramble-celeb-score">
            {lang === 'ta' ? '+100 புள்ளிகள் சேர்க்கப்பட்டன! ⭐ +1 நட்சத்திரம்!' : '+100 Points Earned! ⭐ +1 Star!'}
          </p>

          <div className="scramble-solved-kural-box">
            <p className="scramble-verse-line" style={{ color: '#15803d', marginBottom: '0.5rem' }}>
              {currentKural.Line1}
            </p>
            <p className="scramble-verse-line" style={{ color: '#15803d' }}>
              {currentKural.Line2}
            </p>
          </div>

          <button className="scramble-next-btn" onClick={handleNextKural}>
            <span>{lang === 'ta' ? 'அடுத்த குறள் புதிர்' : 'Next Kural Puzzle'}</span>
            <ChevronRight size={20} />
          </button>
        </section>
      )}

    </div>
  );
}

// Utility: Fisher-Yates array shuffler
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
