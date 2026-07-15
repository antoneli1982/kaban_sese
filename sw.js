// ============================================================
// Service Worker AUTODESTRUTIVO
// ------------------------------------------------------------
// O service worker era a causa do app ficar preso numa versão antiga
// de cache no Chrome/Edge. Esta versão apaga todo o cache, se remove
// e recarrega as abas — matando o SW preso automaticamente.
// Depois disso o app não usa mais service worker: carrega sempre a
// versão mais recente direto do servidor.
// ============================================================

self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.registration.unregister(); })
      .then(function () { return self.clients.matchAll({ type: 'window' }); })
      .then(function (clients) {
        clients.forEach(function (client) {
          try { client.navigate(client.url); } catch (e) {}
        });
      })
      .catch(function () {})
  );
});

// Não intercepta nada: toda requisição vai direto para a rede.
self.addEventListener('fetch', function () {});
