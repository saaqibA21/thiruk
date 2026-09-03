import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Briefcase, 
  Heart, 
  Sparkles, 
  Compass, 
  ScrollText, 
  Feather,
  Globe
} from 'lucide-react';
import ExternalResources from './ExternalResources';

export default function HistoryView({ onNavigatePaal }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const animFrameRef = useRef(null);
  const targetTimeRef = useRef(0);

  // Initialize video settings
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0.01;
    video.pause();

    const handleLoadedMetadata = () => {
      video.pause();
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata);
  }, []);

  // Smooth lerp frame updater loop based purely on user scroll
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const renderLoop = () => {
      if (video.duration) {
        const current = video.currentTime;
        const target = targetTimeRef.current;
        const diff = target - current;

        // Smoothly interpolate towards target time
        if (Math.abs(diff) > 0.002) {
          video.currentTime = current + diff * 0.2;
        }
      }

      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameRef.current = requestAnimationFrame(renderLoop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Universal Scroll & Wheel Listener: ensures scrolling works anywhere cursor is placed
  useEffect(() => {
    const findScrollableParent = (node) => {
      let current = node;
      while (current && current !== document.body && current !== document.documentElement) {
        const style = window.getComputedStyle(current);
        const overflowY = style.overflowY;
        if (overflowY === 'auto' || overflowY === 'scroll') {
          return current;
        }
        current = current.parentElement;
      }
      return window;
    };

    const scrollContainer = findScrollableParent(containerRef.current);

    // Global Wheel forwarding so wheel works anywhere cursor is placed on screen
    const handleGlobalWheel = (e) => {
      if (!scrollContainer || scrollContainer === window) return;
      if (!scrollContainer.contains(e.target)) {
        scrollContainer.scrollTop += e.deltaY;
      }
    };

    // Global keyboard navigation
    const handleGlobalKeyDown = (e) => {
      if (!scrollContainer || scrollContainer === window) return;
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (e.key === 'ArrowDown') {
        scrollContainer.scrollTop += 80;
      } else if (e.key === 'ArrowUp') {
        scrollContainer.scrollTop -= 80;
      } else if (e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
        scrollContainer.scrollTop += window.innerHeight * 0.75;
      } else if (e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
        scrollContainer.scrollTop -= window.innerHeight * 0.75;
      }
    };

    const handleAnyScroll = () => {
      let scrollTop = 0;
      let scrollHeight = 0;
      let clientHeight = 0;

      if (scrollContainer === window) {
        scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
        clientHeight = window.innerHeight;
        scrollHeight = document.documentElement.scrollHeight;
      } else if (scrollContainer) {
        scrollTop = scrollContainer.scrollTop || 0;
        clientHeight = scrollContainer.clientHeight;
        scrollHeight = scrollContainer.scrollHeight;
      }

      const maxScroll = scrollHeight - clientHeight;
      if (maxScroll > 0) {
        const progress = Math.max(0, Math.min(1, scrollTop / maxScroll));
        setScrollProgress(progress);

        if (videoRef.current && videoRef.current.duration) {
          targetTimeRef.current = progress * videoRef.current.duration;
        }
      }
    };

    if (scrollContainer && scrollContainer !== window) {
      scrollContainer.addEventListener('scroll', handleAnyScroll, { passive: true });
    }
    window.addEventListener('scroll', handleAnyScroll, { passive: true });
    document.addEventListener('scroll', handleAnyScroll, { passive: true });
    window.addEventListener('wheel', handleGlobalWheel, { passive: true });
    window.addEventListener('keydown', handleGlobalKeyDown);

    handleAnyScroll();

    return () => {
      if (scrollContainer && scrollContainer !== window) {
        scrollContainer.removeEventListener('scroll', handleAnyScroll);
      }
      window.removeEventListener('scroll', handleAnyScroll);
      document.removeEventListener('scroll', handleAnyScroll);
      window.removeEventListener('wheel', handleGlobalWheel);
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  return (
    <div className="history-page-bg-layout" ref={containerRef}>

      {/* Fixed Fullscreen 3D Background Container */}
      <div className="history-fixed-bg-stage">
        
        <div className="history-video-ambient-glow" />

        {/* 3D Spinning Sage Video */}
        <video
          ref={videoRef}
          src="thiruvalluvar_spin.mp4"
          className="history-bg-spinning-video"
          playsInline
          muted
          preload="auto"
          tabIndex={-1}
        />

        {/* Vignette & Soft Gradient Overlay */}
        <div className="history-bg-ambient-vignette" />

      </div>

      {/* Foreground Content Pushed Far to Outer Wings to Reveal Sage in Center */}
      <div className="history-foreground-content">
        
        {/* Compact Top Banner with Corpus Statistics */}
        <div className="history-hero-v2 glassmorphic-hero">
          <div className="h-hero-content">
            <span className="h-hero-top-badge">
              <Sparkles size={13} /> காலத்தை வென்ற உலகப் பொதுமறை
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

        {/* Staggered Far-Edge Side Cards with Embedded Images */}
        <div className="history-sections-stack">
          
          {/* Card 1 (Far Left): About Thiruvalluvar */}
          <section className="h-section-card glass-card h-side-left">
            <div className="h-section-img-wrapper">
              <img src="thiruvalluvar.jpg" alt="Thiruvalluvar" className="h-card-inner-img" />
            </div>
            <div className="h-section-text">
              <div className="card-mini-tag">
                <Feather size={13} /> ஆசிரியர் வரலாறு
              </div>
              <h3>திருவள்ளுவர் பற்றி</h3>
              <p>
                சுமார் 2,000 ஆண்டுகளுக்கு முன்பு தமிழ் மண்ணில் (மயிலாப்பூர்) வாழ்ந்த தனிப்பெரும் புலவர் மற்றும் மெய்யியலாளர்.
              </p>
              <p>
                எந்தவொரு குறிப்பிட்ட மதம், சாதி, இனம் சாராது அனைத்து மனிதகுலத்திற்குமான அறநெறிகளை ஓலைச்சுவடியில் எழுத்தாணி கொண்டு செதுக்கிய உலகப் பேரறிஞர்.
              </p>
            </div>
          </section>

          {/* Card 2 (Far Right): Structure of Thirukkural & 3 Paals */}
          <section className="h-section-card glass-card h-side-right">
            <div className="h-section-img-wrapper">
              <img src="manuscript.png" alt="Ancient Palm-leaf Manuscript" className="h-card-inner-img" />
            </div>
            <div className="h-section-text">
              <div className="card-mini-tag">
                <ScrollText size={13} /> நூலின் கட்டமைப்பு
              </div>
              <h3>முப்பால்கள் அமைப்பு</h3>
              <p>
                திருக்குறள் மனித வாழ்வின் மூன்று உன்னத பரிமாணங்களாகப் பிரிக்கப்பட்டுள்ளது:
              </p>
              
              <div className="history-paal-navigation">
                <button 
                  className="h-paal-btn aram" 
                  onClick={() => onNavigatePaal?.('அறத்துப்பால்')}
                >
                  <BookOpen size={13} /> அறத்துப்பால் (38)
                </button>
                <button 
                  className="h-paal-btn porul" 
                  onClick={() => onNavigatePaal?.('பொருட்பால்')}
                >
                  <Briefcase size={13} /> பொருட்பால் (70)
                </button>
                <button 
                  className="h-paal-btn inbam" 
                  onClick={() => onNavigatePaal?.('காமத்துப்பால்')}
                >
                  <Heart size={13} /> காமத்துப்பால் (25)
                </button>
              </div>
            </div>
          </section>

          {/* Card 3 (Far Left): Kanyakumari 133-ft Statue */}
          <section className="h-section-card statue-focus glass-card h-side-left">
            <div className="h-section-img-wrapper">
              <img src="statue.png" alt="Valluvar Statue at Kanyakumari" className="h-card-inner-img" />
            </div>
            <div className="h-section-text">
              <div className="card-mini-tag">
                <Compass size={13} /> சிற்பக்கலை அதிசயம்
              </div>
              <h3>கன்னியாகுமரி திருவள்ளுவர் சிலை</h3>
              <p>
                முக்கடல் சங்கமிக்கும் கன்னியாகுமரியில் அமைந்துள்ள 133 அடி வானுயர்ந்த கருங்கல் சிலை.
              </p>
              <ul className="statue-details">
                <li><strong>மொத்த உயரம்:</strong> 133 அடி (133 அதிகாரங்கள்).</li>
                <li><strong>பீடம்:</strong> 38 அடி உயரம் (அறத்துப்பால் 38).</li>
                <li><strong>சிலை:</strong> 95 அடி (பொருள் 70 + இன்பம் 25).</li>
                <li><strong>எடை:</strong> சுமார் 7,000 டன் கருங்கற்கள்.</li>
              </ul>
            </div>
          </section>

          {/* Card 4 (Far Right): Global Impact & Translations */}
          <section className="h-section-card glass-card h-side-right">
            <div className="h-section-img-wrapper">
              <img src="translations.png" alt="Global Translations of Thirukkural" className="h-card-inner-img" />
            </div>
            <div className="h-section-text">
              <div className="card-mini-tag">
                <Globe size={13} /> சர்வதேசப் புகழ்
              </div>
              <h3>உலகளாவிய அங்கீகாரம்</h3>
              <p>
                லத்தீன், ஆங்கிலம் (ஜி.யு. போப்), ஜெர்மன், பிரஞ்சு, சீனம், உருசியம், அரபு உட்பட உலகெங்கும் <strong>100க்கும் மேற்பட்ட மொழிகளில்</strong> மொழிபெயர்க்கப்பட்டுள்ளது.
              </p>
              <p>
                மகாத்மா காந்தி, லியோ டால்ஸ்டாய் போன்ற உலகப் பேரறிஞர்கள் பெரிதும் போற்றினர்.
              </p>
            </div>
          </section>

        </div>

        {/* Bottom Section: Gandhi Tribute & Resources */}
        <div className="h-side-center">
          <div className="history-quote-v2 glass-quote">
            <div className="quote-badge-avatar">MK</div>
            <p>"நான் படித்தவற்றில் மிகவும் உயர்ந்த அறம் சார்ந்த நூல் திருக்குறள். இது உலகிற்கே ஒரு பொதுவான வழிகாட்டி."</p>
            <span>— மகாத்மா காந்தி (Mahatma Gandhi)</span>
          </div>

          <ExternalResources />
        </div>

      </div>

    </div>
  );
}
