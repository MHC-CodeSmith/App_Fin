// Guarda la app en el celular para que abra sin internet.
// Los datos de los préstamos NO pasan por aquí: viven en el localStorage del navegador.
const CACHE = 'belu-bank-v36';
const FILES = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Red primero (para recibir actualizaciones), y si no hay internet, la copia guardada.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Librerías de Firebase (versión fija): se guardan la primera vez para que la app abra sin internet.
  if (e.request.url.startsWith('https://www.gstatic.com/firebasejs/')){
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res; })));
    return;
  }
  if (new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request, {ignoreSearch: true}))
  );
});
