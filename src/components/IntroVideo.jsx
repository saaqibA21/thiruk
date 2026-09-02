import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, FastForward } from 'lucide-react';

export const IntroVideo = ({ onComplete }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const videoRef = useRef(null);

  // Use base URL for GitHub Pages compatibility
  const videoSrc = `${import.meta.env.BASE_URL || '/'}intro_video.mp4`;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.warn("Autoplay was prevented:", err);
      });
    }
  }, []);

  const handleEnded = () => {
    finishIntro();
  };

  const finishIntro = () => {
    setIsVisible(false);
    sessionStorage.setItem('thirukural_intro_seen', 'true');
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 600); // Allow fade-out animation to complete
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="intro-video-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {/* Ambient blur background */}
          <div className="intro-video-ambient-bg" />

          {/* Main Video Container - No pause on click */}
          <div className="intro-video-container">
            <video
              ref={videoRef}
              src={videoSrc}
              className="intro-video-player"
              playsInline
              autoPlay
              muted={isMuted}
              onEnded={handleEnded}
            />

            {/* Subtle Vignette Overlay */}
            <div className="intro-video-vignette" />

            {/* Top Bar with Skip & Mute */}
            <div className="intro-video-controls-top" onClick={(e) => e.stopPropagation()}>
              <button
                className="intro-sound-btn"
                onClick={toggleMute}
                title={isMuted ? "ஒலி இயக்கு (Unmute)" : "ஒலி நிறுத்து (Mute)"}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                <span>{isMuted ? "Unmute" : "Mute"}</span>
              </button>

              <button
                className="intro-skip-btn"
                onClick={finishIntro}
                title="தொடங்கு (Skip to App)"
              >
                <span>தொடங்கு / Skip</span>
                <FastForward size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
