
// Self-Destructing Service Worker to Clear Persistent Caches
self.addEventListener('install', (e) => {
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    self.registration.unregister().then(() => {
        return self.clients.matchAll();
    }).then((clients) => {
        clients.forEach(client => client.navigate(client.url));
    });
});

self.addEventListener('fetch', (e) => {
    // Pass through to network for everything
    return;
});
