import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Sparkles, Box, Maximize2, Compass } from 'lucide-react';
import Thiruvalluvar3D from './Thiruvalluvar3D';

export default function Thiruvalluvar3DModal({ isOpen, onClose }) {
  const [autoRotate, setAutoRotate] = useState(true);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="share-modal-backdrop" onClick={onClose} style={{ zIndex: 10000 }}>
        <motion.div 
          className="thiruvalluvar-3d-modal-container"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="thiruvalluvar-3d-modal-header">
            <div className="thiruvalluvar-3d-title-group">
              <span className="thiruvalluvar-3d-badge">
                <Sparkles size={16} /> 3D வடிவம்
              </span>
              <h3>தெய்வப்புலவர் திருவள்ளுவர் 3D காட்சி</h3>
            </div>
            <button className="thiruvalluvar-3d-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          {/* 3D Canvas Area */}
          <div className="thiruvalluvar-3d-canvas-wrap">
            <Thiruvalluvar3D autoRotate={autoRotate} enableControls={true} mouseParallax={true} />
            
            {/* Interactive hint floating badge */}
            <div className="thiruvalluvar-3d-hint">
              <Compass size={14} /> சுழற்றிப் பார்க்க திரையைத் தொடவும் / மவுஸை இழுக்கவும் (360° Interactive)
            </div>
          </div>

          {/* Controls Footer */}
          <div className="thiruvalluvar-3d-footer">
            <div className="thiruvalluvar-3d-detail-info">
              <p>🪶 <strong>ஓலைச்சுவடி & எழுத்தாணி:</strong> வலக்கையில் அறநெறிப் பாடல் ஓலைச்சுவடியுடன்.</p>
              <p>✨ <strong>ஞான ஒளிவட்டம்:</strong> திருவள்ளுவரின் அறிவொளியைக் குறிக்கும் சுழலும் பொற்கதிர்.</p>
            </div>
            <div className="thiruvalluvar-3d-btn-group">
              <button 
                className={`thiruvalluvar-3d-action-btn ${autoRotate ? 'active' : ''}`}
                onClick={() => setAutoRotate(!autoRotate)}
              >
                <RotateCcw size={15} /> {autoRotate ? 'சுழற்சி நிறுத்து' : 'சுழற்சி இயக்கு'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
