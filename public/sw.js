const CACHE_NAME = 'kural-ai-master-v8';
const ASSETS = [
    './',
    './index.html',
    './thirukkural.json',
    './manifest.json',
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/lucide@latest'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (e) => {
    // Aggressively ignore OpenAI and other non-GET API calls
    if (e.request.url.includes('openai.com')) return;
    if (e.request.method !== 'GET') return;
    
    e.respondWith(
        caches.match(e.request).then((res) => res || fetch(e.request))
    );
});
