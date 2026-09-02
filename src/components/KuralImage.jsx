import React, { useState, useEffect } from 'react';
import { ZoomIn, X } from 'lucide-react';

export const getCandidateImageUrls = (kuralNumber) => {
  if (!kuralNumber) return [];
  const rawBase = import.meta.env.BASE_URL || '/';
  const base = rawBase.endsWith('/') ? rawBase : (rawBase + '/');
  const numStr = String(kuralNumber);
  const pad3 = numStr.padStart(3, '0');
  const pad4 = numStr.padStart(4, '0');
  return [
    base + 'kural_images/' + numStr + '.png',
    base + 'kural_images/' + numStr + '.jpg',
    base + 'kural_images/' + numStr + '.jpeg',
    base + 'kural_images/' + numStr + '.webp',
    base + 'kural_images/kural_' + numStr + '.png',
    base + 'kural_images/kural_' + numStr + '.jpg',
    base + 'kural_images/kural_' + numStr + '.jpeg',
    base + 'kural_images/kural_' + numStr + '.webp',
    base + 'kural_images/kural-' + numStr + '.png',
    base + 'kural_images/kural-' + numStr + '.jpg',
    base + 'kural_images/' + pad3 + '.png',
    base + 'kural_images/' + pad3 + '.jpg',
    base + 'kural_images/' + pad4 + '.png',
    base + 'kural_images/' + pad4 + '.jpg',
    base + 'images/kurals/' + numStr + '.png',
    base + 'images/kurals/' + numStr + '.jpg',
    base + 'images/kurals/' + numStr + '.webp',
    base + 'images/kurals/kural_' + numStr + '.png',
    base + 'images/kurals/kural_' + numStr + '.jpg'
  ];
};

export const KuralImage = ({ kuralNumber, className = '', title = '', isThumbnail = false }) => {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showZoom, setShowZoom] = useState(false);

  const candidates = getCandidateImageUrls(kuralNumber);

  useEffect(() => {
    setCandidateIndex(0);
    setHasError(false);
    setIsLoaded(false);
  }, [kuralNumber]);

  const handleImageError = () => {
    if (candidateIndex < candidates.length - 1) {
      setCandidateIndex(prev => prev + 1);
    } else {
      setHasError(true);
    }
  };

  const handleImageLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  if (hasError || candidates.length === 0) {
    return null;
  }

  const currentSrc = candidates[candidateIndex];

  if (isThumbnail) {
    return (
      <div className={'kural-img-thumb-container ' + className + (isLoaded ? ' loaded' : ' is-loading')}>
        <img
          src={currentSrc}
          alt={'குறள் ' + kuralNumber + ' படம்'}
          className="kural-img-thumb"
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <>
      <div className={'kural-visual-image-wrapper ' + className + (isLoaded ? ' loaded' : ' is-loading')}>
        <div className="kural-visual-card" onClick={() => setShowZoom(true)} title="பெரிதாக்க சொடுக்கவும் (Click to expand)">
          <div className="kural-visual-img-container">
            <img
              src={currentSrc}
              alt={'குறள் ' + kuralNumber + ' காட்சிக் விளக்கம்'}
              className="kural-visual-img"
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
            <div className="kural-visual-overlay">
              <span className="visual-zoom-badge">
                <ZoomIn size={14} /> பெரிதாக்கு (Click to Expand)
              </span>
            </div>
          </div>
          <div className="kural-visual-caption">
            <span className="visual-tag">🎨 காட்சிக் விளக்கம் (Visual Representation)</span>
            <span className="visual-kural-no">குறள் {kuralNumber}</span>
          </div>
        </div>
      </div>

      {showZoom && (
        <div className="kural-img-zoom-modal-overlay" onClick={() => setShowZoom(false)}>
          <div className="kural-img-zoom-modal-content" onClick={e => e.stopPropagation()}>
            <button className="kural-zoom-close-btn" onClick={() => setShowZoom(false)} aria-label="Close">
              <X size={20} />
            </button>
            <div className="kural-zoom-img-box">
              <img
                src={currentSrc}
                alt={'குறள் ' + kuralNumber + ' காட்சி விளக்கம்'}
                className="kural-zoom-large-img"
              />
            </div>
            <div className="kural-zoom-footer">
              <h4>குறள் {kuralNumber} • காட்சி விளக்கம்</h4>
              {title && <p className="kural-zoom-title">{title}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
