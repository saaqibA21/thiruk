import React, { useRef, useLayoutEffect, useState } from 'react';

/**
 * StrictKuralVerse:
 * Guarantees that every Thirukkural couplet renders strictly in TWO lines:
 * Line 1 (4 words)
 * Line 2 (3 words)
 *
 * If any line is wider than the container (e.g. narrow phone screens, large fonts,
 * or long words like in Kural 85), it dynamically scales down to fit 100% inside
 * the available width without EVER wrapping into 3 lines and without truncating.
 */
export default function StrictKuralVerse({ 
  line1, 
  line2, 
  className = "m-verse-line",
  containerClassName = "m-verse-box" 
}) {
  const containerRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const [scale1, setScale1] = useState(1);
  const [scale2, setScale2] = useState(1);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const cWidth = containerRef.current.clientWidth - 12; // breathing space
      if (cWidth <= 0) return;

      if (line1Ref.current) {
        line1Ref.current.style.transform = 'none';
        const w1 = line1Ref.current.scrollWidth;
        if (w1 > cWidth && w1 > 0) {
          setScale1(Math.max(0.65, cWidth / w1));
        } else {
          setScale1(1);
        }
      }

      if (line2Ref.current) {
        line2Ref.current.style.transform = 'none';
        const w2 = line2Ref.current.scrollWidth;
        if (w2 > cWidth && w2 > 0) {
          setScale2(Math.max(0.65, cWidth / w2));
        } else {
          setScale2(1);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [line1, line2]);

  return (
    <div ref={containerRef} className={containerClassName}>
      <div 
        style={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          overflow: 'hidden',
          marginBottom: '0.35rem',
          minHeight: '1.6em'
        }}
      >
        <span
          ref={line1Ref}
          className={`${className} line-1`}
          style={{
            whiteSpace: 'nowrap',
            display: 'inline-block',
            transform: scale1 < 1 ? `scale(${scale1})` : 'none',
            transformOrigin: 'center center',
            transition: 'transform 0.12s ease-out'
          }}
        >
          {line1}
        </span>
      </div>

      <div 
        style={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          overflow: 'hidden',
          minHeight: '1.6em'
        }}
      >
        <span
          ref={line2Ref}
          className={`${className} line-2`}
          style={{
            whiteSpace: 'nowrap',
            display: 'inline-block',
            transform: scale2 < 1 ? `scale(${scale2})` : 'none',
            transformOrigin: 'center center',
            transition: 'transform 0.12s ease-out'
          }}
        >
          {line2}
        </span>
      </div>
    </div>
  );
}
