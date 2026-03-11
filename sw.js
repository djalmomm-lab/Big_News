// ─────────────────────────────────────────────────────────────────────────────
// Big News · Service Worker  v2.2.0
// Atualize CACHE_VERSION a cada deploy para limpar cache antigo
// ─────────────────────────────────────────────────────────────────────────────
const CACHE_VERSION = 'bignews-v2.2.0';
const CACHE_STATIC  = `${CACHE_VERSION}-static`;
const CACHE_DYNAMIC = `${CACHE_VERSION}-dynamic`;

const STATIC_ASSETS = [
  './index.html',
  './noticias.html',
  './esportes.html',
  './politica.html',
  './fact-checking.html',
  './analises.html',
  './podcast.html',
  './explica.html',
  './offline.html',
  './manifest.json',
  './favicon.ico',
  './favicon-32x32.png',
  './favicon-48x48.png',
  './icon-192x192.png',
  './icon-512x512.png',
];

// ── INSTALL ───────────────────────────────────────────────────────────────────
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_STATIC).then(cache =>
      cache.addAll(STATIC_ASSETS).catch(err =>
        console.warn('[SW] Falha ao cachear assets:', err)
      )
    )
  );
});

// ── ACTIVATE ──────────────────────────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_STATIC && k !== CACHE_DYNAMIC)
          .map(k => { console.log('[SW] Removendo cache antigo:', k); return caches.delete(k); })
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH — Network First com fallback para cache ─────────────────────────────
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_DYNAMIC).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() =>
        caches.match(event.request).then(cached => {
          if (cached) return cached;
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('./offline.html');
          }
          return new Response('Recurso não encontrado', { status: 404 });
        })
      )
  );
});
