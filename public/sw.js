// SamSkrithi service worker (MVP offline for daily + cards)
const CACHE = 'samskrithi-v1';

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['/'])));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  const shouldCache = url.pathname === '/' ||
    url.pathname.startsWith('/api/daily') ||
    url.pathname.startsWith('/api/cards/') ||
    url.pathname.startsWith('/cards/');
  if (shouldCache) {
    e.respondWith(
      fetch(e.request).then((r) => {
        const copy = r.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return r;
      }).catch(() => caches.match(e.request))
    );
  }
});
