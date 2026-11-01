import React, { useState, useEffect, useRef } from 'react';
import './kuralJump.css';
import { 
  DoorOpen, 
  Sparkles, 
  Trophy, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Play, 
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Timer
} from 'lucide-react';
import { KURAL_JUMP_QUESTIONS, getRandomQuestion } from '../utils/kuralJumpQuestions.js';

export default function KuralJumpGame({ onExit, onRewardStar, lang = 'ta' }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const audioCtxRef = useRef(null);

  // Game High-Level States: 'START' | 'PLAYING' | 'QUESTION' | 'JUMPING' | 'GAMEOVER'
  const [gameState, setGameState] = useState('START');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [distance, setDistance] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Active Question State & 20s Timer
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Internal Game Engine Mutable Refs (to avoid state lag in 60fps loop)
  const engineRef = useRef({
    distance: 0,
    speed: 3.8,
    targetSpeed: 3.8,
    groundY: 0,
    // Character Physics
    player: {
      x: 130,
      y: 0,
      baseY: 0,
      vy: 0,
      width: 48,
      height: 64,
      isGrounded: true,
      isJumping: false,
      squashX: 1,
      squashY: 1,
      runCycle: 0,
      scarfWave: 0
    },
    // Obstacles
    obstacles: [],
    nextObstacleDist: 400,
    activeObstacle: null,
    // Parallax Offsets
    cloudOffset: 0,
    hillsOffset: 0,
    palmsOffset: 0,
    groundOffset: 0,
    // Particle Pools
    particles: [],
    dustPuffs: [],
    // Question Trigger Flag
    inQuestionZone: false
  });

  // Sound Synthesizer via Web Audio API
  const playSfx = (type) => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;

      if (type === 'jump') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(750, now + 0.22);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.32);

      } else if (type === 'correct') {
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);

          gain.gain.setValueAtTime(0.22, now + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.38);
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

      } else if (type === 'tick') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(820, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    } catch (e) {}
  };

  // Start / Restart Game
  const startGame = () => {
    const engine = engineRef.current;
    engine.distance = 0;
    engine.speed = 3.8;
    engine.targetSpeed = 3.8;
    engine.obstacles = [];
    engine.nextObstacleDist = 320;
    engine.activeObstacle = null;
    engine.particles = [];
    engine.dustPuffs = [];
    engine.inQuestionZone = false;
    engine.player.vy = 0;
    engine.player.isGrounded = true;
    engine.player.isJumping = false;
    engine.player.squashX = 1;
    engine.player.squashY = 1;

    setScore(0);
    setStreak(0);
    setDistance(0);
    setSelectedOption(null);
    setIsAnswerCorrect(null);
    setShowHint(false);
    setCurrentQuestion(null);
    setTimeLeft(20);
    setIsTimeUp(false);
    setGameState('PLAYING');
  };

  // 20-Second Countdown Timer for Questions
  useEffect(() => {
    let timer = null;
    if (gameState === 'QUESTION' && currentQuestion && !isAnswerCorrect && !isTimeUp) {
      setTimeLeft(20);
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleTimeUp();
            return 0;
          }
          if (prev <= 6 && soundEnabled) {
            playSfx('tick');
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameState, currentQuestion, isAnswerCorrect, isTimeUp, soundEnabled]);

  // Handle Time's Up (20s Expired)
  const handleTimeUp = () => {
    setIsTimeUp(true);
    setShowHint(true);
    playSfx('wrong');

    // Auto-resume after 2.8 seconds so child has time to read the answer
    setTimeout(() => {
      handleSkipAndResume();
    }, 2800);
  };

  // Skip obstacle and resume running after time-up
  const handleSkipAndResume = () => {
    const engine = engineRef.current;
    engine.player.isJumping = true;
    engine.player.isGrounded = false;
    engine.player.vy = -14;
    engine.speed = 3.8;
    setGameState('JUMPING');

    setTimeout(() => {
      setGameState('PLAYING');
      setCurrentQuestion(null);
      setSelectedOption(null);
      setIsAnswerCorrect(null);
      setIsTimeUp(false);
      setShowHint(false);
      engine.inQuestionZone = false;
      engine.activeObstacle = null;
    }, 700);
  };

  // Main Canvas Setup & 60 FPS Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const engine = engineRef.current;

    let dpr = window.devicePixelRatio || 1;
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      engine.groundY = rect.height - 75;
      engine.player.baseY = engine.groundY;
      engine.player.y = engine.groundY;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let lastTime = performance.now();

    const render = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const rect = canvas.getBoundingClientRect();
      const W = rect.width;
      const H = rect.height;

      // Update Parallax Offsets
      const currentSpeed = engine.speed;
      engine.cloudOffset = (engine.cloudOffset + currentSpeed * 0.12) % W;
      engine.hillsOffset = (engine.hillsOffset + currentSpeed * 0.35) % W;
      engine.palmsOffset = (engine.palmsOffset + currentSpeed * 0.65) % W;
      engine.groundOffset = (engine.groundOffset + currentSpeed * 1.0) % W;

      if (gameState === 'PLAYING' || gameState === 'JUMPING') {
        engine.distance += currentSpeed * 0.05;
        setDistance(Math.floor(engine.distance));
      }

      // 1. Draw Sky Gradient & Sunlight Aura
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
      skyGrad.addColorStop(0, '#bae6fd');
      skyGrad.addColorStop(0.65, '#fef3c7');
      skyGrad.addColorStop(1, '#ffedd5');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H);

      // Sun with pulsing golden aura
      const sunPulse = 1 + Math.sin(time * 0.003) * 0.05;
      const sunGrad = ctx.createRadialGradient(90, 70, 10, 90, 70, 75 * sunPulse);
      sunGrad.addColorStop(0, '#fde047');
      sunGrad.addColorStop(0.5, '#facc15');
      sunGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(90, 70, 75 * sunPulse, 0, Math.PI * 2);
      ctx.fill();

      // Sun core
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(90, 70, 32, 0, Math.PI * 2);
      ctx.fill();

      // 2. Layer 1: Volumetric Clouds
      drawCloud(ctx, (W * 0.2 - engine.cloudOffset * 0.5 + W * 2) % (W + 160) - 80, 50, 60);
      drawCloud(ctx, (W * 0.7 - engine.cloudOffset * 0.5 + W * 2) % (W + 160) - 80, 75, 80);

      // 3. Layer 2: Distant Temple Gopuram & Mountain Silhouettes
      drawDistantGopuramAndHills(ctx, W, H, engine.hillsOffset);

      // 4. Layer 3: Midground Palmyra Palm Trees
      drawPalmyraTrees(ctx, W, engine.groundY, engine.palmsOffset);

      // 5. Layer 4: Earthy Paved Running Path
      drawGroundTrack(ctx, W, H, engine.groundY, engine.groundOffset);

      // 6. Update & Draw Obstacles
      if (gameState === 'PLAYING' || gameState === 'QUESTION' || gameState === 'JUMPING') {
        engine.nextObstacleDist -= currentSpeed;
        if (engine.nextObstacleDist <= 0 && engine.obstacles.length === 0) {
          engine.obstacles.push({
            x: W + 60,
            y: engine.groundY - 38,
            width: 36,
            height: 48,
            type: Math.random() > 0.5 ? 'stone_pillar' : 'mossy_log',
            passed: false,
            triggered: false
          });
          engine.nextObstacleDist = Math.floor(Math.random() * 320) + 480;
        }

        for (let i = engine.obstacles.length - 1; i >= 0; i--) {
          const obs = engine.obstacles[i];
          obs.x -= currentSpeed;

          // Check if obstacle entered Question Zone (~220px in front of player)
          if (!obs.triggered && obs.x <= engine.player.x + 220 && obs.x > engine.player.x) {
            obs.triggered = true;
            engine.activeObstacle = obs;
            engine.inQuestionZone = true;
            // Smoothly slow down speed to pause
            engine.speed = 0;
            // Pick a fun question
            const q = getRandomQuestion();
            setCurrentQuestion(q);
            setSelectedOption(null);
            setIsAnswerCorrect(null);
            setShowHint(false);
            setTimeLeft(20);
            setIsTimeUp(false);
            setGameState('QUESTION');
          }

          // Draw the Obstacle
          drawObstacle(ctx, obs);

          // Remove off-screen obstacles
          if (obs.x < -80) {
            engine.obstacles.splice(i, 1);
          }
        }
      }

      // 7. Update & Draw Character ("சின்னத் திரு" / Little Thiru)
      updateAndDrawCharacter(ctx, engine, time);

      // 8. Update & Draw Particles (Dust & Stars)
      updateAndDrawParticles(ctx, engine);

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameState, soundEnabled]);

  // Handle Question Option Click
  const handleSelectOption = (idx) => {
    if (isTimeUp || (selectedOption !== null && isAnswerCorrect)) return;

    setSelectedOption(idx);
    const correct = idx === currentQuestion.correctIndex;

    if (correct) {
      setIsAnswerCorrect(true);
      playSfx('correct');
      playSfx('jump');

      // Trigger High Leap & Jump Physics
      const engine = engineRef.current;
      engine.player.isJumping = true;
      engine.player.isGrounded = false;
      engine.player.vy = -16.5; // Upward parabolic velocity
      engine.player.squashX = 0.75;
      engine.player.squashY = 1.35; // Vertical stretch on launch

      // Spawn burst of golden celebration sparkles
      spawnStarConfetti(engine, engine.player.x + 20, engine.player.y - 40);

      // Reward Stars & Streak
      setScore(s => s + 10);
      setStreak(st => st + 1);
      if (onRewardStar) onRewardStar();

      // Resume game speed with a punch
      engine.speed = 4.2;
      setGameState('JUMPING');

      setTimeout(() => {
        setGameState('PLAYING');
        setCurrentQuestion(null);
        setSelectedOption(null);
        setIsAnswerCorrect(null);
        setShowHint(false);
        setIsTimeUp(false);
        engine.inQuestionZone = false;
        engine.activeObstacle = null;
      }, 750);

    } else {
      setIsAnswerCorrect(false);
      setShowHint(true);
      playSfx('wrong');

      const engine = engineRef.current;
      engine.player.squashX = 1.15;
      engine.player.squashY = 0.88;
    }
  };

  // Keyboard Navigation: Keys 1, 2, 3
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'QUESTION' || !currentQuestion || isTimeUp) return;
      if (e.key === '1') handleSelectOption(0);
      else if (e.key === '2') handleSelectOption(1);
      else if (e.key === '3') handleSelectOption(2);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, currentQuestion, selectedOption, isAnswerCorrect, isTimeUp]);

  return (
    <div className="kural-jump-container">
      
      {/* Top HUD Bar */}
      <header className="kural-jump-hud">
        <div className="kural-jump-hud-left">
          <button className="kural-jump-exit-btn" onClick={onExit} title="வெளியேறு (Exit to Reading)">
            <DoorOpen size={16} />
            <span>{lang === 'ta' ? 'வெளியேறு' : 'Exit'}</span>
          </button>
          <div className="kural-jump-game-title">
            <span>🐒 குறள் ஜம்ப்</span>
          </div>
        </div>

        <div className="kural-jump-hud-right">
          <div className="kural-jump-stat-pill">
            <span>⭐ {score}</span>
          </div>
          <div className="kural-jump-stat-pill">
            <span>🔥 {streak}</span>
          </div>
          <div className="kural-jump-stat-pill">
            <span>🏃 {distance}m</span>
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

      {/* Main Canvas Viewport */}
      <div className="kural-jump-canvas-wrapper">
        <canvas ref={canvasRef} className="kural-jump-canvas" />

        {/* Start Game Overlay */}
        {gameState === 'START' && (
          <div className="kural-jump-screen-overlay">
            <div className="kural-jump-big-icon">🏃‍♂️📜</div>
            <h2 className="kural-jump-screen-title">
              {lang === 'ta' ? 'குறள் ஜம்ப் சாகசம்!' : 'Kural Jump Adventure!'}
            </h2>
            <p className="kural-jump-screen-desc">
              {lang === 'ta' 
                ? 'சின்னத் திரு ஓடி வருகிறான்! தடைகளைத் தாண்டி குதிக்க 20 வினாடிகளுக்குள் திருக்குறள் வினாக்களுக்குச் சரியான விடையளியுங்கள்!' 
                : 'Little Thiru is running! Answer Thirukkural questions within 20 seconds to jump obstacles and collect stars!'}
            </p>
            <button className="kural-jump-start-btn" onClick={startGame}>
              <Play size={20} />
              <span>{lang === 'ta' ? 'விளையாட்டைத் தொடங்கு!' : 'Start Running!'}</span>
            </button>
          </div>
        )}

        {/* Question Modal Overlay during Obstacle Approach */}
        {gameState === 'QUESTION' && currentQuestion && (
          <div className="kural-jump-question-overlay">
            <div className="kural-jump-question-card">
              
              {/* Card Header with Question Badge and 20s Animated Timer */}
              <div className="kural-jump-card-top-row">
                <span className="kural-jump-card-badge">
                  <HelpCircle size={14} />
                  <span>{lang === 'ta' ? 'குதிப்பதற்கான கேள்வி' : 'Question to Jump!'}</span>
                </span>

                <div className={`kural-jump-timer-badge ${timeLeft <= 5 ? 'urgent' : ''}`}>
                  <Timer size={15} />
                  <span>{timeLeft}s</span>
                </div>
              </div>

              {/* 20-Second Shrinking Progress Bar */}
              <div className="kural-jump-timer-bar-track">
                <div 
                  className={`kural-jump-timer-bar-fill ${timeLeft <= 5 ? 'urgent' : ''}`}
                  style={{ width: `${(timeLeft / 20) * 100}%` }}
                />
              </div>

              <h3 className="kural-jump-question-text">
                {lang === 'ta' ? currentQuestion.questionTa : currentQuestion.questionEn}
              </h3>

              <div className="kural-jump-options-grid">
                {(lang === 'ta' ? currentQuestion.optionsTa : currentQuestion.optionsEn).map((opt, idx) => {
                  let statusClass = '';
                  if (selectedOption === idx) {
                    statusClass = isAnswerCorrect ? 'correct' : 'wrong';
                  } else if (isTimeUp && idx === currentQuestion.correctIndex) {
                    statusClass = 'correct'; // Reveal correct answer on time-up
                  }

                  return (
                    <button
                      key={idx}
                      className={`kural-jump-option-btn ${statusClass}`}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswerCorrect === true || isTimeUp}
                    >
                      <span className="kural-jump-option-num">{idx + 1}</span>
                      <span style={{ flex: 1, textAlign: 'center' }}>{opt}</span>
                      {selectedOption === idx && isAnswerCorrect && <CheckCircle2 size={18} color="#15803d" />}
                      {selectedOption === idx && isAnswerCorrect === false && <AlertCircle size={18} color="#b91c1c" />}
                    </button>
                  );
                })}
              </div>

              {/* Time's Up Banner */}
              {isTimeUp && (
                <div className="kural-jump-timeup-banner">
                  <span>⏱️ {lang === 'ta' ? 'நேரம் முடிந்தது! அடுத்த முறை விரைவாக முயற்சி செய்!' : "Time's up! Try faster next time!"}</span>
                  <button className="kural-jump-continue-btn" onClick={handleSkipAndResume}>
                    {lang === 'ta' ? 'தொடரவும் ➡️' : 'Continue ➡️'}
                  </button>
                </div>
              )}

              {/* Helpful Hint on Wrong Choice */}
              {showHint && !isTimeUp && (
                <div className="kural-jump-hint-box">
                  💡 <strong>{lang === 'ta' ? 'குறிப்பு:' : 'Hint:'}</strong> {lang === 'ta' ? currentQuestion.hintTa : currentQuestion.hintEn}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Bottom Instructions / Keyboard Hints */}
      <footer className="kural-jump-controls-bar">
        <div className="kural-jump-instructions">
          <span>விடையளிக்க 20 வினாடிகள்:</span>
          <span className="kural-jump-key-badge">1</span>
          <span className="kural-jump-key-badge">2</span>
          <span className="kural-jump-key-badge">3</span>
        </div>

        <button className="kids-bottom-nav-btn kids-random-kural-btn" onClick={startGame}>
          <RotateCcw size={16} />
          <span>{lang === 'ta' ? 'மீண்டும் தொடங்கு' : 'Restart'}</span>
        </button>
      </footer>

    </div>
  );
}

// ==========================================
// PROCEDURAL CANVAS DRAWING UTILITIES
// ==========================================

function drawCloud(ctx, x, y, size) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
  ctx.beginPath();
  ctx.arc(x, y, size * 0.4, 0, Math.PI * 2);
  ctx.arc(x + size * 0.35, y - size * 0.2, size * 0.45, 0, Math.PI * 2);
  ctx.arc(x + size * 0.7, y, size * 0.38, 0, Math.PI * 2);
  ctx.fill();
}

function drawDistantGopuramAndHills(ctx, W, H, offset) {
  ctx.fillStyle = 'rgba(167, 243, 208, 0.45)';
  ctx.beginPath();
  ctx.moveTo(0, H - 75);
  for (let x = 0; x <= W; x += 30) {
    const y = (H - 120) + Math.sin((x + offset) * 0.006) * 35;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(W, H - 75);
  ctx.closePath();
  ctx.fill();

  const gopuramX = (W * 0.65 - offset * 0.4 + W * 2) % (W + 200) - 100;
  ctx.fillStyle = 'rgba(110, 231, 183, 0.35)';
  ctx.beginPath();
  ctx.moveTo(gopuramX + 20, H - 165);
  ctx.lineTo(gopuramX + 10, H - 125);
  ctx.lineTo(gopuramX + 35, H - 125);
  ctx.lineTo(gopuramX + 2, H - 85);
  ctx.lineTo(gopuramX + 44, H - 85);
  ctx.lineTo(gopuramX + 22, H - 165);
  ctx.fill();
}

function drawPalmyraTrees(ctx, W, groundY, offset) {
  const spacing = 280;
  for (let i = -1; i < W / spacing + 2; i++) {
    const treeX = (i * spacing - offset + W * 3) % (W + spacing) - 60;
    const trunkHeight = 110;

    ctx.strokeStyle = '#a16207';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(treeX, groundY);
    ctx.quadraticCurveTo(treeX - 8, groundY - trunkHeight * 0.6, treeX - 3, groundY - trunkHeight);
    ctx.stroke();

    ctx.fillStyle = '#65a30d';
    const topX = treeX - 3;
    const topY = groundY - trunkHeight;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      ctx.beginPath();
      ctx.ellipse(topX + Math.cos(a) * 14, topY + Math.sin(a) * 14, 18, 7, a, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawGroundTrack(ctx, W, H, groundY, offset) {
  const roadGrad = ctx.createLinearGradient(0, groundY, 0, H);
  roadGrad.addColorStop(0, '#fde68a');
  roadGrad.addColorStop(0.3, '#d97706');
  roadGrad.addColorStop(1, '#92400e');
  ctx.fillStyle = roadGrad;
  ctx.fillRect(0, groundY, W, H - groundY);

  ctx.fillStyle = '#84cc16';
  ctx.fillRect(0, groundY - 4, W, 6);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 2;
  const stripeDist = 60;
  for (let x = -stripeDist; x < W + stripeDist; x += stripeDist) {
    const lineX = (x - offset + W * 2) % (W + stripeDist);
    ctx.beginPath();
    ctx.moveTo(lineX, groundY + 12);
    ctx.lineTo(lineX + 22, groundY + 12);
    ctx.stroke();
  }
}

function drawObstacle(ctx, obs) {
  ctx.save();
  ctx.translate(obs.x, obs.y);

  if (obs.type === 'stone_pillar') {
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.roundRect(0, 0, 32, 45, 6);
    ctx.fill();

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(16, 0, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(6, 15); ctx.lineTo(26, 15);
    ctx.moveTo(8, 25); ctx.lineTo(24, 25);
    ctx.moveTo(6, 35); ctx.lineTo(26, 35);
    ctx.stroke();

  } else {
    ctx.fillStyle = '#854d0e';
    ctx.beginPath();
    ctx.roundRect(0, 10, 38, 30, 8);
    ctx.fill();

    ctx.fillStyle = '#a16207';
    ctx.beginPath();
    ctx.ellipse(34, 25, 4, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#84cc16';
    ctx.beginPath();
    ctx.ellipse(16, 10, 12, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function updateAndDrawCharacter(ctx, engine, time) {
  const p = engine.player;

  if (p.isJumping) {
    p.y += p.vy;
    p.vy += 0.62;

    if (p.vy < 0) {
      p.squashX = 0.88;
      p.squashY = 1.15;
    } else {
      p.squashX = 1.05;
      p.squashY = 0.95;
    }

    if (p.y >= p.baseY) {
      p.y = p.baseY;
      p.vy = 0;
      p.isJumping = false;
      p.isGrounded = true;
      p.squashX = 1.25;
      p.squashY = 0.78;

      spawnDustPuff(engine, p.x + 20, p.baseY);
    }
  } else {
    p.squashX += (1 - p.squashX) * 0.18;
    p.squashY += (1 - p.squashY) * 0.18;

    if (engine.speed > 1 && Math.random() < 0.2) {
      spawnDustPuff(engine, p.x + 6, p.baseY);
    }
  }

  const isRunning = engine.speed > 0.5 && p.isGrounded;
  if (isRunning) {
    p.runCycle += 0.28;
  }
  const strideBob = isRunning ? Math.sin(p.runCycle) * 3 : 0;
  const legAngle = isRunning ? Math.sin(p.runCycle) * 0.55 : 0;

  ctx.save();
  ctx.translate(p.x, p.y + strideBob);
  ctx.scale(p.squashX, p.squashY);

  // Scarf
  ctx.strokeStyle = '#f43f5e';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  const scarfWave = Math.sin(time * 0.015) * 8;
  ctx.beginPath();
  ctx.moveTo(10, -32);
  ctx.quadraticCurveTo(-15, -34 + scarfWave, -35, -28 - scarfWave);
  ctx.stroke();

  // Legs
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(14, -10);
  ctx.lineTo(14 - Math.sin(legAngle) * 16, 0);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(24, -10);
  ctx.lineTo(24 + Math.sin(legAngle) * 16, 0);
  ctx.stroke();

  // Dhoti
  ctx.fillStyle = '#fffdfa';
  ctx.beginPath();
  ctx.roundRect(8, -36, 24, 28, 6);
  ctx.fill();

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(8, -12);
  ctx.lineTo(32, -12);
  ctx.stroke();

  // Arms & Manuscript
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(12, -30);
  ctx.lineTo(4 - Math.sin(legAngle) * 8, -20);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(26, -30);
  ctx.lineTo(36, -24);
  ctx.stroke();

  ctx.fillStyle = '#fef08a';
  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(32, -28, 18, 7, 2);
  ctx.fill();
  ctx.stroke();

  // Head
  ctx.fillStyle = '#fcd34d';
  ctx.beginPath();
  ctx.arc(20, -46, 12, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#451a03';
  ctx.beginPath();
  ctx.arc(24, -48, 1.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#451a03';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(23, -44, 4, 0.1, Math.PI * 0.8);
  ctx.stroke();

  // Hair
  ctx.fillStyle = '#1e1b18';
  ctx.beginPath();
  ctx.arc(14, -58, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.arc(17, -54, 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function spawnDustPuff(engine, x, y) {
  engine.dustPuffs.push({
    x,
    y: y - 2,
    vx: -Math.random() * 2 - 1,
    vy: -Math.random() * 1,
    radius: Math.random() * 4 + 3,
    alpha: 0.65
  });
}

function spawnStarConfetti(engine, x, y) {
  for (let i = 0; i < 22; i++) {
    const angle = (Math.PI * 2 * i) / 22;
    const speed = Math.random() * 5 + 3;
    engine.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      size: Math.random() * 5 + 3,
      color: ['#facc15', '#f43f5e', '#38bdf8', '#4ade80', '#c084fc'][i % 5],
      alpha: 1,
      gravity: 0.18
    });
  }
}

function updateAndDrawParticles(ctx, engine) {
  for (let i = engine.dustPuffs.length - 1; i >= 0; i--) {
    const d = engine.dustPuffs[i];
    d.x += d.vx;
    d.y += d.vy;
    d.radius += 0.25;
    d.alpha -= 0.035;

    if (d.alpha <= 0) {
      engine.dustPuffs.splice(i, 1);
      continue;
    }

    ctx.fillStyle = `rgba(253, 230, 138, ${d.alpha})`;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = engine.particles.length - 1; i >= 0; i--) {
    const p = engine.particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.gravity;
    p.alpha -= 0.025;

    if (p.alpha <= 0) {
      engine.particles.splice(i, 1);
      continue;
    }

    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}
