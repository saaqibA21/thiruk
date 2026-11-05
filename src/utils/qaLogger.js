/**
 * Q&A Logger for Thirukkural AI
 * - Automatically saves every question & answer to localStorage (thiruk_qa_logs)
 * - Attempts to sync with local Express server (http://localhost:5175/api/log) if active
 * - Provides export function to download the latest JSON dataset for Git tracking
 */

const LOCAL_STORAGE_KEY = 'thiruk_qa_logs';

export function logQAInteraction({ query, answer, mode = 'chat', sources = [] }) {
  if (!query || !query.trim() || !answer) return;

  const entry = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    query: query.trim(),
    answer: answer.trim(),
    mode,
    sourceCount: sources.length || 0,
    sources: sources.map(s => ({
      number: s.Number,
      line1: s.Line1,
      line2: s.Line2,
      meaning: s.mv || s.sp || s.mk || s.Translation
    }))
  };

  // 1. Save to browser's persistent localStorage
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    // Keep max 500 recent queries to prevent storage exhaustion
    const updated = [entry, ...existing].slice(0, 500);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated, null, 2));
  } catch (e) {
    console.warn('[QALogger] LocalStorage write failed:', e);
  }

  // 2. Try posting to local Express log server if running (port 5175)
  try {
    fetch('http://localhost:5175/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: entry.query,
        answer: entry.answer,
        timestamp: entry.timestamp,
        mode: entry.mode,
        sourceCount: entry.sourceCount
      })
    }).catch(() => {
      // Server not running locally; safely ignore
    });
  } catch (e) {
    // Ignore offline errors
  }
}

export function getStoredQALogs() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

export function downloadQALogsJSON() {
  const logs = getStoredQALogs();
  const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ai_queries_log_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
