import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Briefcase, 
  Heart, 
  Sparkles, 
  RotateCw, 
  Compass, 
  Award, 
  Globe, 
  ScrollText, 
  Feather,
  ExternalLink
} from 'lucide-react';
import ExternalResources from './ExternalResources';

const TOTAL_FRAMES_TARGET = 72; // High-fidelity 72 frames for ultra-smooth 360 spin

export default function HistoryView({ onNavigatePaal }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const framesRef = useRef([]);
  const [framesLoadedCount, setFramesLoadedCount] = useState(0);
  const [isAutoSpin, setIsAutoSpin] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const animFrameRef = useRef(null);
  const autoSpinAngleRef = useRef(0);

  // 1. Frame Extraction Engine from Video
  useEffect(() => {
    const video = document.createElement('video');
    video.src = 'thiruvalluvar_spin.mp4';
    video.playsInline = true;
    video.muted = true;
    video.preload = 'auto';
    video.crossOrigin = 'anonymous';
    videoRef.current = video;

    const offscreenCanvas = document.createElement('canvas');
    const offscreenCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });

    let isCancelled = false;

    const extractFrames = async () => {
      await new Promise((resolve) => {
        if (video.readyState >= 1) resolve();
        else video.addEventListener('loadedmetadata', resolve, { once: true });
      });

      if (isCancelled || !video.duration) return;

      const duration = video.duration;
      const width = video.videoWidth || 720;
      const height = video.videoHeight || 1280;
      offscreenCanvas.width = width;
      offscreenCanvas.height = height;

      const extracted = [];
      const step = duration / TOTAL_FRAMES_TARGET;

      for (let i = 0; i < TOTAL_FRAMES_TARGET; i++) {
        if (isCancelled) break;
        const targetTime = i * step;

        await new Promise((resolve) => {
          const onSeeked = () => {
            if (isCancelled) {
              resolve();
              return;
            }
            try {
              offscreenCtx.drawImage(video, 0, 0, width, height);
              if ('createImageBitmap' in window) {
                createImageBitmap(offscreenCanvas).then((bmp) => {
                  extracted[i] = bmp;
                  setFramesLoadedCount(extracted.filter(Boolean).length);
                  resolve();
                }).catch(() => {
                  const img = new Image();
                  img.src = offscreenCanvas.toDataURL('image/jpeg', 0.85);
                  extracted[i] = img;
                  setFramesLoadedCount(extracted.filter(Boolean).length);
                  resolve();
                });
              } else {
                const img = new Image();
                img.src = offscreenCanvas.toDataURL('image/jpeg', 0.85);
                extracted[i] = img;
                setFramesLoadedCount(extracted.filter(Boolean).length);
                resolve();
              }
            } catch {
              resolve();
            }
          };

          video.currentTime = targetTime;
          video.addEventListener('seeked', onSeeked, { once: true });
        });
      }

      if (!isCancelled) {
        framesRef.current = extracted;
      }
    };

    extractFrames();

    return () => {
      isCancelled = true;
      video.remove();
    };
  }, []);

  // 2. Draw Current Frame onto Fixed Background Canvas
  const drawFrame = useCallback((frameIdx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const frames = framesRef.current;
    const currentFrame = frames[frameIdx];

    if (currentFrame) {
      // Calculate aspect ratio cover/contain
      const imgW = currentFrame.width || (currentFrame.naturalWidth || 720);
      const imgH = currentFrame.height || (currentFrame.naturalHeight || 1280);
      const scale = Math.min(width / imgW, height / imgH) * 0.88;

      const drawW = imgW * scale;
      const drawH = imgH * scale;
      const drawX = (width - drawW) / 2;
      const drawY = (height - drawH) / 2;

      ctx.save();
      // Subtle golden shadow behind sage
      ctx.shadowColor = 'rgba(245, 158, 11, 0.45)';
      ctx.shadowBlur = 35;
      ctx.drawImage(currentFrame, drawX, drawY, drawW, drawH);
      ctx.restore();
    } else if (videoRef.current && videoRef.current.readyState >= 2) {
      // Fallback: draw directly from video
      const v = videoRef.current;
      const imgW = v.videoWidth || 720;
      const imgH = v.videoHeight || 1280;
      const scale = Math.min(width / imgW, height / imgH) * 0.88;
      const drawW = imgW * scale;
      const drawH = imgH * scale;
      const drawX = (width - drawW) / 2;
      const drawY = (height - drawH) / 2;

      ctx.drawImage(v, drawX, drawY, drawW, drawH);
    }
  }, []);

  // Resize handler for Canvas resolution
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const totalFrames = framesRef.current.length || TOTAL_FRAMES_TARGET;
      const targetIdx = Math.min(totalFrames - 1, Math.floor(scrollPercent * (totalFrames - 1)));
      drawFrame(targetIdx);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame, scrollPercent]);

  // 3. Scroll Listener to update background spinning frame
  const handleScroll = useCallback(() => {
    if (isAutoSpin) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (docHeight <= 0) return;

    const progress = Math.max(0, Math.min(1, scrollTop / docHeight));
    setScrollPercent(progress);

    const totalFrames = framesRef.current.length || TOTAL_FRAMES_TARGET;
    // Map progress to 360 degree spin frame index
    const frameIndex = Math.min(totalFrames - 1, Math.floor(progress * (totalFrames - 1)));
    drawFrame(frameIndex);
  }, [drawFrame, isAutoSpin]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // 4. Auto-spin animation loop
  useEffect(() => {
    if (!isAutoSpin) return;

    const autoSpinLoop = () => {
      autoSpinAngleRef.current = (autoSpinAngleRef.current + 0.35) % TOTAL_FRAMES_TARGET;
      const frameIdx = Math.floor(autoSpinAngleRef.current);
      drawFrame(frameIdx);
      animFrameRef.current = requestAnimationFrame(autoSpinLoop);
    };

    animFrameRef.current = requestAnimationFrame(autoSpinLoop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [drawFrame, isAutoSpin]);

  return (
    <div className="history-page-bg-layout" ref={containerRef}>

      {/* Sticky Fullscreen 3D Background Canvas */}
      <div className="history-fixed-canvas-container">
        <canvas ref={canvasRef} className="history-spinning-bg-canvas" />
        <div className="history-bg-ambient-vignette" />
        
        {/* Floating Spin Control Button */}
        <div className="history-floating-spin-pill">
          <div className="spin-dot-indicator" />
          <span>{isAutoSpin ? 'சுழல்கிறது (Auto 360°)' : `சுழற்சி: ${Math.round(scrollPercent * 360)}°`}</span>
          <button 
            className={`spin-toggle-pill-btn ${isAutoSpin ? 'active' : ''}`}
            onClick={() => setIsAutoSpin(!isAutoSpin)}
            title="சுழற்சி முறையை மாற்றவும்"
          >
            <RotateCw size={13} className={isAutoSpin ? 'spinning-icon-fast' : ''} />
            <span>{isAutoSpin ? 'நிறுத்து (Stop)' : 'சுழற்று (Spin)'}</span>
          </button>
        </div>
      </div>

      {/* Foreground Content Stack (Original Clean Structure) */}
      <div className="history-foreground-content">
        
        {/* Hero Banner with Corpus Statistics */}
        <div className="history-hero-v2 glassmorphic-hero">
          <div className="h-hero-content">
            <span className="h-hero-top-badge">
              <Sparkles size={16} /> காலத்தை வென்ற உலகப் பொதுமறை
            </span>
            <h2 className="h-title-big">திருக்குறள் வரலாறு</h2>
            <p className="h-subtitle-gold">ஏழே சீர்களில் மனிதகுல முழுமைக்குமான வாழ்வியல் வழிகாட்டி</p>
            
            <div className="h-hero-grid">
              <div className="h-stat-item">
                <strong>133</strong>
                <span>அதிகாரங்கள்</span>
              </div>
              <div className="h-stat-item">
                <strong>1,330</strong>
                <span>குறள்கள்</span>
              </div>
              <div className="h-stat-item">
                <strong>3</strong>
                <span>பால்கள்</span>
              </div>
              <div className="h-stat-item">
                <strong>2,000+</strong>
                <span>ஆண்டுகள்</span>
              </div>
            </div>
          </div>
        </div>

        {/* Informative Cards Stack */}
        <div className="history-sections-stack">
          
          {/* Section 1: About Thiruvalluvar */}
          <section className="h-section-card glass-card">
            <div className="h-section-img">
              <img src="thiruvalluvar.jpg" alt="Thiruvalluvar" />
            </div>
            <div className="h-section-text">
              <div className="card-mini-tag">
                <Feather size={14} /> ஆசிரியர் வரலாறு
              </div>
              <h3>திருவள்ளுவர் பற்றி</h3>
              <p>
                திருவள்ளுவர் சுமார் 2,000 ஆண்டுகளுக்கு முன்பு தமிழ் மண்ணில் (மயிலாப்பூர்) வாழ்ந்த ஒரு தனிப்பெரும் புலவர் மற்றும் மெய்யியலாளர் ஆவார்.
              </p>
              <p>
                அவர் எந்தவொரு குறிப்பிட்ட மதம், சாதி அல்லது மொழியை முன்னிலைப்படுத்தாமல், அனைத்து காலத்திற்கும் மனிதகுலத்திற்கும் பொருந்தும் அறநெறிகளை ஓலைச்சுவடியில் எழுத்தாணி கொண்டு வடித்ததால், திருக்குறள் <strong>"உலகப் பொதுமறை"</strong> என்று போற்றப்படுகிறது.
              </p>
            </div>
          </section>

          {/* Section 2: Kanyakumari 133-ft Statue */}
          <section className="h-section-card statue-focus glass-card">
            <div className="h-section-text">
              <div className="card-mini-tag">
                <Compass size={14} /> சிற்பக்கலை அதிசயம்
              </div>
              <h3>கன்னியாகுமரி திருவள்ளுவர் சிலை</h3>
              <p>
                <strong>அமைவிடம்:</strong> இந்தியாவின் தென்கோடி முனையான கன்னியாகுமரியில், அரபிக்கடல், வங்காள விரிகுடா மற்றும் இந்தியப் பெருங்கடல் சங்கமிக்கும் இடத்தில் கடல் நடுவே பாறையில் அமைந்துள்ள பிரம்மாண்டமான சிலை.
              </p>
              <ul className="statue-details">
                <li><strong>மொத்த உயரம்:</strong> 133 அடி (நூலின் 133 அதிகாரங்களை உணர்த்துகிறது).</li>
                <li><strong>பீடம்:</strong> 38 அடி உயரம் (அறத்துப்பாலின் 38 அதிகாரங்களை குறிக்கிறது).</li>
                <li><strong>சிலை:</strong> 95 அடி உயரம் (பொருட்பால் 70 + காமத்துப்பால் 25 அதிகாரங்களை குறிக்கிறது).</li>
                <li><strong>எடை:</strong> சுமார் 7,000 டன் கருங்கற்களால் ஆனது.</li>
              </ul>
            </div>
            <div className="h-section-img">
              <img src="statue.png" alt="Valluvar Statue at Kanyakumari" />
            </div>
          </section>

          {/* Section 3: Structure of Thirukkural & 3 Paals */}
          <section className="h-section-card glass-card">
            <div className="h-section-img">
              <img src="manuscript.png" alt="Ancient Palm-leaf Manuscript" />
            </div>
            <div className="h-section-text">
              <div className="card-mini-tag">
                <ScrollText size={14} /> நூலின் கட்டமைப்பு
              </div>
              <h3>முப்பால்கள் அமைப்பு & வாசிப்பு</h3>
              <p>
                திருக்குறள் மனித வாழ்வின் மூன்று உன்னத பரிமாணங்களாகப் பிரிக்கப்பட்டுள்ளது. கீழே உள்ளவற்றைக் கிளிக் செய்து நேரடியாக குறள்களை வாசிக்கலாம்:
              </p>
              
              <div className="history-paal-navigation">
                <button 
                  className="h-paal-btn aram" 
                  onClick={() => onNavigatePaal?.('அறத்துப்பால்')}
                >
                  <BookOpen size={16} /> அறத்துப்பால் (38)
                </button>
                <button 
                  className="h-paal-btn porul" 
                  onClick={() => onNavigatePaal?.('பொருட்பால்')}
                >
                  <Briefcase size={16} /> பொருட்பால் (70)
                </button>
                <button 
                  className="h-paal-btn inbam" 
                  onClick={() => onNavigatePaal?.('காமத்துப்பால்')}
                >
                  <Heart size={16} /> காமத்துப்பால் (25)
                </button>
              </div>
              <p style={{ marginTop: '1.2rem', fontSize: '0.92rem', color: '#64748b', fontWeight: 600 }}>
                மொத்தம் 133 அதிகாரங்கள் மற்றும் 1,330 ஈரடி வெண்பாக்களால் ஆனது.
              </p>
            </div>
          </section>

          {/* Section 4: Global Impact & Translations */}
          <section className="h-section-card reversed glass-card">
            <div className="h-section-text">
              <div className="card-mini-tag">
                <Globe size={14} /> சர்வதேசப் புகழ்
              </div>
              <h3>உலகளாவிய அங்கீகாரம்</h3>
              <p>
                லத்தீன் (வீரமாமுனிவர்), ஆங்கிலம் (ஜி.யு. போப்), ஜெர்மன், பிரஞ்சு, சீனம், உருசியம், அரபு உட்பட உலகெங்கும் <strong>100க்கும் மேற்பட்ட மொழிகளில்</strong> மொழிபெயர்க்கப்பட்டுள்ளது.
              </p>
              <p>
                மகாத்மா காந்தி, லியோ டால்ஸ்டாய், ஆல்பர்ட் சுவைட்சர் போன்ற உலகப் பேரறிஞர்கள் திருக்குறளின் அறக்கருத்துக்களால் பெரிதும் ஈர்க்கப்பட்டனர்.
              </p>
            </div>
            <div className="h-section-img">
              <img src="translations.png" alt="Global Translations of Thirukkural" />
            </div>
          </section>

        </div>

        {/* Mahatma Gandhi Tribute Quote */}
        <div className="history-quote-v2 glass-quote">
          <div className="quote-badge-avatar">MK</div>
          <p>"நான் படித்தவற்றில் மிகவும் உயர்ந்த அறம் சார்ந்த நூல் திருக்குறள். இது உலகிற்கே ஒரு பொதுவான வழிகாட்டி."</p>
          <span>— மகாத்மா காந்தி (Mahatma Gandhi)</span>
        </div>

        {/* External Scholarly Resources */}
        <ExternalResources />

      </div>

    </div>
  );
}
