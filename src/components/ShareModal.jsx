import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Share2, 
  Download, 
  Copy, 
  Check, 
  MessageCircle, 
  Sparkles, 
  ExternalLink,
  Loader2
} from 'lucide-react';
import { generateKuralShareCard, getKuralShareText, executeNativeShare } from '../utils/shareKural';

export default function ShareModal({ kural, customImageUrl, onClose }) {
  const [loading, setLoading] = useState(true);
  const [cardData, setCardData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (kural) {
      setLoading(true);
      generateKuralShareCard(kural, customImageUrl)
        .then((data) => {
          if (isMounted) {
            setCardData(data);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error("Error generating share card:", err);
          if (isMounted) setLoading(false);
        });
    }
    return () => { isMounted = false; };
  }, [kural, customImageUrl]);

  if (!kural) return null;

  const shareText = getKuralShareText(kural);

  // 1. Direct Native Share
  const handleNativeShare = async () => {
    const res = await executeNativeShare(kural, customImageUrl);
    if (res.success) {
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    }
  };

  // 2. Download Image
  const handleDownload = () => {
    if (!cardData?.dataUrl) return;
    const link = document.createElement('a');
    link.download = `thirukkural_${kural.Number}.png`;
    link.href = cardData.dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 3. Copy Text to Clipboard
  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn("Copy failed:", e);
    }
  };

  // 4. WhatsApp Share
  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <motion.div 
        className="share-modal-card" 
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
      >
        
        {/* Modal Header */}
        <div className="share-modal-header">
          <div className="share-modal-title-row">
            <Share2 size={20} className="share-icon-gold" />
            <div>
              <h3>குறள் பகிர்வு (Share Kural)</h3>
              <span>படம் மற்றும் முழு உரையுடன் பகிருங்கள்</span>
            </div>
          </div>
          <button className="share-modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Card Preview Container */}
        <div className="share-card-preview-box">
          {loading ? (
            <div className="share-card-loading">
              <div className="share-spinner"></div>
              <span>பட அட்டை தயாராகிறது...</span>
            </div>
          ) : cardData?.dataUrl ? (
            <img 
              src={cardData.dataUrl} 
              alt={`குறள் ${kural.Number} பகிர்வு அட்டை`} 
              className="share-preview-img" 
            />
          ) : (
            <div className="share-card-fallback-text">
              <pre>{shareText}</pre>
            </div>
          )}
        </div>

        {/* Action Buttons Grid */}
        <div className="share-actions-container">
          
          {/* Main Native Share Button */}
          <button 
            className="share-main-action-btn"
            onClick={handleNativeShare}
            disabled={loading}
          >
            <Share2 size={18} />
            <span>{shareSuccess ? "பகிரப்பட்டது!" : "நேரடிப் பகிர்வு (Share Image & Text)"}</span>
          </button>

          {/* Secondary Action Buttons */}
          <div className="share-secondary-buttons-row">
            
            <button 
              className="share-sec-btn whatsapp-btn"
              onClick={handleWhatsAppShare}
              title="WhatsApp வழியே பகிருங்கள்"
            >
              <MessageCircle size={17} />
              <span>WhatsApp</span>
            </button>

            <button 
              className="share-sec-btn download-btn"
              onClick={handleDownload}
              disabled={loading || !cardData}
              title="படத்தைப் பதிவிறக்கவும்"
            >
              <Download size={17} />
              <span>பதிவிறக்கு (Download)</span>
            </button>

            <button 
              className="share-sec-btn copy-btn"
              onClick={handleCopyText}
              title="குறள் உரையை நகலெடுக்கவும்"
            >
              {copied ? <Check size={17} color="#22c55e" /> : <Copy size={17} />}
              <span>{copied ? "நகலெடுக்கப்பட்டது!" : "உரை நகல் (Copy Text)"}</span>
            </button>

          </div>

        </div>

      </motion.div>
    </div>
  );
}
