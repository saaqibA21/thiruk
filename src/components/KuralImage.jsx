import React, { useState, useEffect } from 'react';
import { ZoomIn, X, Sparkles, Share2, Download } from 'lucide-react';
import { getCandidateImageUrls } from '../utils/kuralFeatures';

export { getCandidateImageUrls };

export const KuralImage = ({ kuralNumber, className = '', title = '', isThumbnail = false, onShare = null }) => {
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
  };

  const handleDirectDownload = () => {
    if (!currentSrc) return;
    const link = document.createElement('a');
    link.href = currentSrc;
    link.download = `${kuralNumber}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <div className="kural-img-corner-tag">
              <Sparkles size={11} /> <span>வள்ளுவம்</span>
            </div>
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
              <div className="kural-img-corner-tag">
                <Sparkles size={11} /> <span>வள்ளுவம்</span>
              </div>
            </div>
            <div className="kural-zoom-footer">
              <div className="kural-zoom-footer-info">
                <h4>குறள் {kuralNumber} • காட்சி விளக்கம்</h4>
                {title && <p className="kural-zoom-title">{title}</p>}
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button 
                  className="modal-share-btn" 
                  onClick={handleDirectDownload}
                  title={`குறள் ${kuralNumber} படத்தை பதிவிறக்குக (${kuralNumber}.jpg)`}
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                >
                  <Download size={16} /> <span>பதிவிறக்கு ({kuralNumber}.jpg)</span>
                </button>
                {onShare && (
                  <button 
                    className="modal-share-btn" 
                    onClick={() => onShare(currentSrc)}
                    title="படம் மற்றும் குறளைப் பகிரவும்"
                  >
                    <Share2 size={16} /> <span>பகிர் (Share)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
