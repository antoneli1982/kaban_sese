// ============================================================
// Service Worker - Kanban SESE PWA
// ============================================================
// v2: a versão do cache foi trocada (força atualização em todos os
// navegadores) e o HTML passou a ser buscado SEMPRE da rede quando online
// (network-first), evitando que o app fique preso numa versão antiga.
const CACHE_VERSION = 'kanban-sese-v2';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './favicon.ico'
];

// Domínios externos que precisam SEMPRE da rede (Firebase em tempo real)
const NETWORK_ONLY_HOSTS = [
  'firestore.googleapis.com',
  'firebase.googleapis.com',
  'firebaseinstallations.googleapis.com',
  'identitytoolkit.googleapis.com',
  'securetoken.googleapis.com',
  'www.googleapis.com'
];

// Domínios de CDN onde cache-first faz sentido (libs estáticas)
const CDN_HOSTS = [
  'unpkg.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'www.gstatic.com'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Firebase: sempre rede (não cachear para garantir sincronização em tempo real)
  if (NETWORK_ONLY_HOSTS.some(h => url.hostname.includes(h))) {
    return; // deixa o navegador lidar normalmente
  }

  // CDN: cache-first com fallback de rede
  if (CDN_HOSTS.some(h => url.hostname.includes(h))) {
    event.respondWith(
      caches.match(req).then(cached => {
        if (cached) return cached;
        return fetch(req).then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_VERSION).then(c => c.put(req, clone));
          }
          return res;
        }).catch(() => cached);
      })
    );
    return;
  }

  // Mesma origem
  if (url.origin === self.location.origin) {
    const isHTML = req.mode === 'navigate'
      || url.pathname === '/' || url.pathname.endsWith('/')
      || url.pathname.endsWith('.html');

    // HTML/navegação: REDE PRIMEIRO. Sempre pega a versão mais nova quando online;
    // usa o cache só como reserva quando estiver offline.
    if (isHTML) {
      event.respondWith(
        fetch(req, { cache: 'no-store' }).then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_VERSION).then(c => c.put(req, clone));
          }
          return res;
        }).catch(() =>
          caches.match(req).then(c => c || caches.match('./index.html'))
        )
      );
      return;
    }

    // Demais arquivos da app (ícones, manifest): stale-while-revalidate
    event.respondWith(
      caches.match(req).then(cached => {
        const network = fetch(req).then(res => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE_VERSION).then(c => c.put(req, clone));
          }
          return res;
        }).catch(() => cached);
        return cached || network;
      })
    );
  }
});
