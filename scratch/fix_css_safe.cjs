
const fs = require('fs');
const path = require('path');

const filePath = path.join('src', 'app.css');
const buffer = fs.readFileSync(filePath);

let contentUtf8 = buffer.toString('utf8');
let firstNull = contentUtf8.indexOf('\0');

if (firstNull !== -1) {
    let goodPart = contentUtf8.substring(0, firstNull);
    
    // There might be a few trailing characters in goodPart that belong to the UTF-16LE string.
    // Let's just find the last valid closing brace `}` before the first null byte.
    const lastBraceIndex = goodPart.lastIndexOf('}');
    if (lastBraceIndex !== -1) {
        goodPart = goodPart.substring(0, lastBraceIndex + 1);
    }

    const premiumCss = `

/* PREMIUM DRAG AND DROP STYLES */
.chat-view-container.drag-over {
    background-color: rgba(154, 52, 18, 0.05);
    box-shadow: inset 0 0 50px rgba(154, 52, 18, 0.1);
    transition: all 0.3s ease;
}

.drag-drop-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    border: 3px dashed var(--primary);
    margin: 1.5rem;
    border-radius: 2rem;
    pointer-events: none;
    box-shadow: 0 20px 40px rgba(154, 52, 18, 0.15);
    animation: pulseBorder 2s infinite;
}

.drop-zone-content {
    text-align: center;
    color: var(--primary);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    transform: scale(1.1);
}

.drop-zone-content p {
    font-size: 1.5rem;
    font-weight: 800;
    text-shadow: 0 2px 10px rgba(255,255,255,0.5);
}

/* Ultra-Reliable Global Drop Zone */
.global-drag-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(248, 250, 252, 0.95);
    backdrop-filter: blur(15px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
    pointer-events: auto; /* IMPORTANT: This captures the drop */
    animation: fadeIn 0.3s ease-out;
}

.drop-zone-box {
    border: 4px dashed var(--primary);
    border-radius: 2rem;
    padding: 4rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    background: linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,247,237,1) 100%);
    box-shadow: 0 30px 60px rgba(154, 52, 18, 0.15), inset 0 0 0 4px rgba(255,255,255,0.5);
    max-width: 500px;
    width: 90%;
    text-align: center;
    pointer-events: none; /* Let events pass through to the parent overlay */
    transform: translateY(0);
    animation: floatBox 3s ease-in-out infinite;
}

.drop-zone-box h2 {
    font-size: 2.2rem;
    font-weight: 900;
    color: var(--primary);
    margin: 0;
    letter-spacing: -0.5px;
}

.drop-zone-box p {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--muted);
}

@keyframes floatBox {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
}

@keyframes pulseBorder {
    0% { border-color: rgba(154, 52, 18, 0.4); }
    50% { border-color: rgba(154, 52, 18, 1); }
    100% { border-color: rgba(154, 52, 18, 0.4); }
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
`;
    fs.writeFileSync(filePath, goodPart + "\n" + premiumCss, 'utf8');
    console.log('Successfully restored app.css and added premium styles');
} else {
    console.log('No null bytes found!');
}
