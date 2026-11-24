import React, { useState, useEffect, useRef } from 'react';
import { 
  DoorOpen, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  RotateCcw, 
  Trophy, 
  Award, 
  ArrowRight,
  Flame,
  Star,
  Volume2,
  VolumeX,
  Lightbulb
} from 'lucide-react';
import { getQuizSet, KURAL_JUMP_QUESTIONS } from '../utils/kuralJumpQuestions.js';

export default function KuralQuizGame({ onExit, onRewardStar, lang = 'ta' }) {
  const [quizLength, setQuizLength] = useState(5); // 5 or 10 questions
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [gameState, setGameState] = useState('INTRO'); // 'INTRO' | 'PLAYING' | 'SUMMARY'
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentLang, setCurrentLang] = useState(lang);

  const audioCtxRef = useRef(null);

  // Play synthesized audio
  const playSfx = (type) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      if (type === 'correct') {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
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
        [220, 180].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);
          gain.gain.setValueAtTime(0.18, now + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.12);
          osc.stop(now + idx * 0.12 + 0.22);
        });
      } else if (type === 'complete') {
        [440, 554, 659, 880, 1108].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);
          gain.gain.setValueAtTime(0.22, now + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.45);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.48);
        });
      }
    } catch (e) {}
  };

  const startQuiz = (count = 5) => {
    setQuizLength(count);
    const set = getQuizSet(count);
    setQuestions(set);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setShowHint(false);
    setGameState('PLAYING');
  };

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx) => {
    if (isAnswered) return;

    setSelectedOption(idx);
    setIsAnswered(true);

    const correct = idx === currentQ.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      playSfx('correct');
      setScore(s => s + 10);
      setStreak(st => {
        const next = st + 1;
        if (next > bestStreak) setBestStreak(next);
        return next;
      });
      setShowHint(false);
    } else {
      playSfx('wrong');
      setStreak(0);
      setShowHint(true);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
      setShowHint(false);
    } else {
      // Quiz finished
      setGameState('SUMMARY');
      playSfx('complete');
      if (onRewardStar) {
        // Reward kid based on performance
        onRewardStar();
      }
    }
  };

  return (
    <div className="kural-quiz-wrapper">
      {/* Top Navigation Bar */}
      <header className="kural-quiz-header">
        <div className="kural-quiz-header-left">
          <button 
            type="button" 
            className="kural-quiz-exit-btn" 
            onClick={onExit}
            title={currentLang === 'ta' ? 'குழந்தைகள் முறைக்குத் திரும்பு' : 'Back to Kids Mode'}
          >
            <DoorOpen size={18} />
            <span>{currentLang === 'ta' ? 'வெளியேறு' : 'Exit'}</span>
          </button>
          <div className="kural-quiz-title-badge">
            <Lightbulb size={18} color="#eab308" />
            <span>{currentLang === 'ta' ? 'குறள் வினாடி வினா' : 'Kural Quick Quiz'}</span>
          </div>
        </div>

        <div className="kural-quiz-header-right">
          <button 
            type="button" 
            className="kural-quiz-sound-btn" 
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'ஒலி அணை' : 'ஒலி இயக்கு'}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          <button 
            type="button" 
            className="kural-quiz-lang-btn" 
            onClick={() => setCurrentLang(currentLang === 'ta' ? 'en' : 'ta')}
          >
            {currentLang === 'ta' ? 'EN' : 'தமிழ்'}
          </button>
        </div>
      </header>

      {/* Main Game Screen */}
      <main className="kural-quiz-main-container">
        
        {/* INTRO SCREEN */}
        {gameState === 'INTRO' && (
          <div className="kural-quiz-card intro-card">
            <div className="kural-quiz-mascot-avatar">
              <span className="quiz-mascot-emoji">💡</span>
            </div>
            <h2 className="kural-quiz-heading">
              {currentLang === 'ta' ? 'குறள் வினாடி வினா!' : 'Kural Quick Quiz!'}
            </h2>
            <p className="kural-quiz-intro-text">
              {currentLang === 'ta' 
                ? '50+ சுவாரஸ்யமான குறள் கேள்விகளுக்கு விடையளித்து உங்களின் அறிவுத் திறனை வெளிப்படுத்துங்கள்!' 
                : 'Challenge yourself with 50+ fun Thirukkural questions and collect wisdom stars!'}
            </p>

            <div className="kural-quiz-mode-select">
              <span className="quiz-select-label">
                {currentLang === 'ta' ? 'வினாக்கள் எண்ணிக்கை:' : 'Select Questions Count:'}
              </span>
              <div className="quiz-count-btns">
                <button 
                  type="button" 
                  className={`quiz-count-btn ${quizLength === 5 ? 'active' : ''}`}
                  onClick={() => setQuizLength(5)}
                >
                  ⚡ 5 {currentLang === 'ta' ? 'வினாக்கள்' : 'Questions'}
                </button>
                <button 
                  type="button" 
                  className={`quiz-count-btn ${quizLength === 10 ? 'active' : ''}`}
                  onClick={() => setQuizLength(10)}
                >
                  🌟 10 {currentLang === 'ta' ? 'வினாக்கள்' : 'Questions'}
                </button>
              </div>
            </div>

            <button 
              type="button" 
              className="kural-quiz-start-btn"
              onClick={() => startQuiz(quizLength)}
            >
              <Sparkles size={20} />
              <span>{currentLang === 'ta' ? 'வினாடி வினாவைத் தொடங்கு!' : 'Start Quiz!'}</span>
            </button>
          </div>
        )}

        {/* ACTIVE QUESTION SCREEN */}
        {gameState === 'PLAYING' && currentQ && (
          <div className="kural-quiz-card play-card">
            
            {/* Progress Bar & Status Pill */}
            <div className="kural-quiz-status-row">
              <span className="quiz-step-tag">
                🎯 {currentLang === 'ta' ? `கேள்வி ${currentIndex + 1} / ${questions.length}` : `Question ${currentIndex + 1} / ${questions.length}`}
              </span>
              <div className="quiz-live-stats">
                <span className="quiz-score-pill">⭐ {score}</span>
                {streak > 1 && (
                  <span className="quiz-streak-pill">🔥 {streak}</span>
                )}
              </div>
            </div>

            <div className="quiz-progress-track">
              <div 
                className="quiz-progress-fill" 
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <div className="kural-quiz-question-box">
              <h3 className="kural-quiz-question-title">
                {currentLang === 'ta' ? currentQ.questionTa : currentQ.questionEn}
              </h3>
            </div>

            {/* Options List */}
            <div className="kural-quiz-options-list">
              {(currentLang === 'ta' ? currentQ.optionsTa : currentQ.optionsEn).map((opt, idx) => {
                let statusClass = '';
                if (isAnswered) {
                  if (idx === currentQ.correctIndex) {
                    statusClass = 'correct-revealed';
                  } else if (selectedOption === idx) {
                    statusClass = 'wrong-chosen';
                  } else {
                    statusClass = 'dimmed';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    className={`kural-quiz-option-btn ${statusClass}`}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                  >
                    <span className="quiz-option-letter">{['A', 'B', 'C'][idx]}</span>
                    <span className="quiz-option-label">{opt}</span>
                    {isAnswered && idx === currentQ.correctIndex && (
                      <CheckCircle2 size={20} color="#16a34a" className="quiz-opt-icon" />
                    )}
                    {isAnswered && selectedOption === idx && idx !== currentQ.correctIndex && (
                      <AlertCircle size={20} color="#dc2626" className="quiz-opt-icon" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Hint / Explanation Box */}
            {isAnswered && (
              <div className={`quiz-feedback-box ${isCorrect ? 'correct' : 'hint'}`}>
                {isCorrect ? (
                  <div className="quiz-feedback-content">
                    <span className="feedback-emoji">🎉</span>
                    <div>
                      <strong>{currentLang === 'ta' ? 'அருமையான விடை! +10 புள்ளிகள்' : 'Brilliant! +10 Points'}</strong>
                      <p>{currentLang === 'ta' ? currentQ.hintTa : currentQ.hintEn}</p>
                    </div>
                  </div>
                ) : (
                  <div className="quiz-feedback-content">
                    <span className="feedback-emoji">💡</span>
                    <div>
                      <strong>{currentLang === 'ta' ? 'சரியான விடை விளக்கக்குறிப்பு:' : 'Correct Answer Explanation:'}</strong>
                      <p>{currentLang === 'ta' ? currentQ.hintTa : currentQ.hintEn}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Next Question / Finish Button */}
            {isAnswered && (
              <div className="quiz-bottom-action">
                <button 
                  type="button" 
                  className="quiz-next-btn"
                  onClick={handleNext}
                  autoFocus
                >
                  <span>
                    {currentIndex + 1 < questions.length 
                      ? (currentLang === 'ta' ? 'அடுத்த கேள்வி' : 'Next Question')
                      : (currentLang === 'ta' ? 'முடிவுகளைப் பார்' : 'View Results')}
                  </span>
                  <ArrowRight size={18} />
                </button>
              </div>
            )}

          </div>
        )}

        {/* SUMMARY / RESULTS SCREEN */}
        {gameState === 'SUMMARY' && (
          <div className="kural-quiz-card summary-card">
            <div className="summary-trophy-avatar">
              <Trophy size={48} color="#eab308" />
            </div>
            
            <h2 className="summary-title">
              {currentLang === 'ta' ? 'வாழ்த்துகள், குறள் வெற்றியாளர்!' : 'Congratulations, Kural Champion!'}
            </h2>
            
            <p className="summary-sub">
              {currentLang === 'ta' 
                ? 'வினாடி வினாவை வெற்றிகரமாக முடித்து அறிவைப் பெருக்கிக் கொண்டீர்கள்!' 
                : 'You have completed the quiz and enriched your Kural wisdom!'}
            </p>

            <div className="summary-stats-grid">
              <div className="summary-stat-box">
                <span className="stat-big-num">⭐ {score}</span>
                <span className="stat-label">{currentLang === 'ta' ? 'மொத்த புள்ளிகள்' : 'Total Score'}</span>
              </div>
              <div className="summary-stat-box">
                <span className="stat-big-num">🔥 {bestStreak}</span>
                <span className="stat-label">{currentLang === 'ta' ? 'சிறந்த தொடர்' : 'Best Streak'}</span>
              </div>
              <div className="summary-stat-box">
                <span className="stat-big-num">🏆 {Math.round(score / 10)} / {questions.length}</span>
                <span className="stat-label">{currentLang === 'ta' ? 'சரியான விடைகள்' : 'Correct Answers'}</span>
              </div>
            </div>

            <div className="summary-actions-row">
              <button 
                type="button" 
                className="summary-play-again-btn"
                onClick={() => startQuiz(quizLength)}
              >
                <RotateCcw size={18} />
                <span>{currentLang === 'ta' ? 'மீண்டும் விளையாடு' : 'Play Again'}</span>
              </button>

              <button 
                type="button" 
                className="summary-exit-btn"
                onClick={onExit}
              >
                <DoorOpen size={18} />
                <span>{currentLang === 'ta' ? 'முதன்மைப் பக்கம்' : 'Back to Home'}</span>
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
