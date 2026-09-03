import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, FastForward, Play } from 'lucide-react';

export const IntroVideo = ({ onComplete }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  // Use base URL for GitHub Pages compatibility
  const videoSrc = `${import.meta.env.BASE_URL || '/'}intro_video.mp4`;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Mobile Autoplay strict properties
    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');

    const tryPlay = () => {
      if (video && video.paused) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(err => {
              console.warn("Mobile autoplay waiting for touch interaction:", err);
              setIsPlaying(false);
            });
        }
      }
    };

    // Immediate attempt
    tryPlay();

    // Event hooks for mobile media loading
    video.addEventListener('loadedmetadata', tryPlay);
    video.addEventListener('loadeddata', tryPlay);
    video.addEventListener('canplay', tryPlay);
    video.addEventListener('canplaythrough', tryPlay);
    video.addEventListener('playing', () => setIsPlaying(true));
    video.addEventListener('play', () => setIsPlaying(true));

    // Global touch fallback for mobile devices where media policy requires gesture
    const handleGesturePlay = () => {
      tryPlay();
    };

    window.addEventListener('touchstart', handleGesturePlay, { passive: true });
    window.addEventListener('pointerdown', handleGesturePlay, { passive: true });
    document.addEventListener('click', handleGesturePlay, { passive: true });

    return () => {
      video.removeEventListener('loadedmetadata', tryPlay);
      video.removeEventListener('loadeddata', tryPlay);
      video.removeEventListener('canplay', tryPlay);
      video.removeEventListener('canplaythrough', tryPlay);
      window.removeEventListener('touchstart', handleGesturePlay);
      window.removeEventListener('pointerdown', handleGesturePlay);
      document.removeEventListener('click', handleGesturePlay);
    };
  }, []);

  const handleEnded = () => {
    finishIntro();
  };

  const finishIntro = () => {
    setIsVisible(false);
    sessionStorage.setItem('thirukural_intro_seen', 'true');
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 500); // Allow fade-out animation to complete
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleContainerTap = () => {
    if (videoRef.current && videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="intro-video-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          onClick={handleContainerTap}
        >
          {/* Ambient blur background */}
          <div className="intro-video-ambient-bg" />

          {/* Main Video Container */}
          <div className="intro-video-container">
            <video
              ref={videoRef}
              src={videoSrc}
              className="intro-video-player"
              playsInline
              webkit-playsinline="true"
              autoPlay
              muted
              preload="auto"
              onEnded={handleEnded}
              disablePictureInPicture
              disableRemotePlayback
            />

            {/* Tap to Play prompt if mobile strict policy paused it */}
            {!isPlaying && (
              <div className="intro-tap-to-play-badge" onClick={handleContainerTap}>
                <div className="intro-play-pulsing-circle">
                  <Play size={28} fill="white" color="white" />
                </div>
                <span>தொடங்க தட்டவும் (Tap to Play)</span>
              </div>
            )}

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
