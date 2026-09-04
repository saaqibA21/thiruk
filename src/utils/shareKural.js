import { getCandidateImageUrls } from '../components/KuralImage';

/**
 * Get formatted text for sharing a Kural
 */
export function getKuralShareText(kural) {
  if (!kural) return '';
  const allWords = `${kural.Line1} ${kural.Line2}`.trim().split(/\s+/);
  const line1 = allWords.slice(0, 4).join(' ');
  const line2 = allWords.slice(4).join(' ');
  const meaning = kural.mv || kural.sp || kural.mk || kural.Translation || '';

  return `📜 திருக்குறள் — குறள் ${kural.Number}

${line1}
${line2}

📖 உரை விளக்கம்:
${meaning}

🏛️ SRM தமிழ் மன்றம் • மொழி முதல் இயந்திரம் வரை (Thirukkural AI)
🌐 https://saaqibA21.github.io/thiruk/`;
}

/**
 * Generate a high-resolution shareable card image combining the artwork and Kural
 */
export async function generateKuralShareCard(kural, customImageUrl) {
  const canvas = document.createElement('canvas');
  const width = 1080;
  const height = 1350;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Candidate images list
  const candidates = customImageUrl ? [customImageUrl] : getCandidateImageUrls(kural.Number);
  const base = import.meta.env.BASE_URL || '/';
  candidates.push(`${base}thiruvalluvar.jpg`);
  candidates.push(`${base}temple_hero.jpg`);

  const loadImage = (src) => new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load ' + src));
    img.src = src;
  });

  let loadedImg = null;
  for (const src of candidates) {
    try {
      loadedImg = await loadImage(src);
      break;
    } catch (e) {
      // try next candidate
    }
  }

  // Draw background image
  if (loadedImg) {
    const imgHeight = height * 0.60;
    ctx.drawImage(loadedImg, 0, 0, width, imgHeight);

    // Gradient transition
    const grad = ctx.createLinearGradient(0, imgHeight * 0.40, 0, imgHeight);
    grad.addColorStop(0, 'rgba(15, 23, 42, 0)');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, imgHeight * 0.40, width, imgHeight * 0.60);
  } else {
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#78350f');
    bgGrad.addColorStop(0.5, '#1e1b18');
    bgGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);
  }

  // Bottom card background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, height * 0.58, width, height * 0.42);

  // Outer border with gold stroke
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 14;
  ctx.strokeRect(20, 20, width - 40, height - 40);

  // Inner subtle gold border
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(34, 34, width - 68, height - 68);

  // Header Badge (Top Center)
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.beginPath();
  ctx.roundRect(width / 2 - 210, 50, 420, 54, 27);
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 24px "Outfit", "Noto Sans Tamil", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`📜 திருக்குறள் • குறள் எண்: ${kural.Number}`, width / 2, 85);

  // Verse Lines
  const allWords = `${kural.Line1} ${kural.Line2}`.trim().split(/\s+/);
  const line1 = allWords.slice(0, 4).join(' ');
  const line2 = allWords.slice(4).join(' ');

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px "Outfit", "Noto Sans Tamil", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(line1, width / 2, height * 0.69);
  ctx.fillText(line2, width / 2, height * 0.76);

  // Golden accent line
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 260, height * 0.80);
  ctx.lineTo(width / 2 + 260, height * 0.80);
  ctx.stroke();

  // Meaning / Commentary
  const meaning = kural.mv || kural.sp || kural.mk || kural.Translation || '';
  if (meaning) {
    ctx.fillStyle = '#fef3c7';
    ctx.font = '500 24px "Outfit", "Noto Sans Tamil", sans-serif';
    ctx.textAlign = 'center';

    const words = meaning.split(' ');
    let currentLine = '';
    let startY = height * 0.84;
    let lineCount = 0;

    for (let n = 0; n < words.length; n++) {
      const testLine = currentLine + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 920 && n > 0) {
        ctx.fillText(currentLine.trim(), width / 2, startY);
        currentLine = words[n] + ' ';
        startY += 36;
        lineCount++;
        if (lineCount >= 3) break;
      } else {
        currentLine = testLine;
      }
    }
    if (lineCount < 3 && currentLine) {
      ctx.fillText(currentLine.trim(), width / 2, startY);
    }
  }

  // Footer Branding
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 20px "Outfit", "Noto Sans Tamil", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SRM Institute of Science and Technology • SRM தமிழ் மன்றம் • Thirukkural AI', width / 2, height - 55);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve({
        blob,
        file: new File([blob], `thirukkural_${kural.Number}.png`, { type: 'image/png' }),
        dataUrl: canvas.toDataURL('image/png')
      });
    }, 'image/png');
  });
}

/**
 * Execute native share with image and text
 */
export async function executeNativeShare(kural, customImageUrl) {
  const shareText = getKuralShareText(kural);
  const shareTitle = `திருக்குறள் - குறள் ${kural.Number}`;
  const shareUrl = window.location.href;

  try {
    const cardData = await generateKuralShareCard(kural, customImageUrl);
    
    if (navigator.canShare && navigator.canShare({ files: [cardData.file] })) {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        files: [cardData.file]
      });
      return { success: true, method: 'files' };
    } else if (navigator.share) {
      await navigator.share({
        title: shareTitle,
        text: shareText,
        url: shareUrl
      });
      return { success: true, method: 'text' };
    }
  } catch (e) {
    if (e.name !== 'AbortError') {
      console.warn('Native share error, falling back:', e);
    }
  }

  return { success: false };
}
