// Service Worker Oficial - TyroFem 30D PWA
const CACHE_NAME = 'tyrofem-v4';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/circulo-marie.png',
  '/colshopi-logo.png',
  '/icon-192.png',
  '/icon-512.png'
];

// Instalación
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Algunos recursos no pudieron cachearse:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activación y limpieza de caches antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch con estrategia Stale-While-Revalidate
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Para navegaciones (HTML), intentar red primero
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html') || caches.match('/');
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// ESCUCHA DE NOTIFICACIONES PUSH (Sintaxis nativa estándar)
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = {
        title: 'TyroFem 30D • ColShopi',
        body: event.data.text() || 'Tienes un nuevo mensaje de bienestar.'
      };
    }
  } else {
    data = {
      title: 'TyroFem 30D con Tyruss Full',
      body: '¡Marié tiene un recordatorio para tu bienestar de hoy! 🌿'
    };
  }

  const title = data.title || 'TyroFem 30D';
  const options = {
    body: data.body || data.message || 'Consulta tu guía diaria en la App.',
    icon: data.icon || '/circulo-marie.png',
    badge: data.badge || '/colshopi-logo.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// CLIC EN LA NOTIFICACIÓN
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data && event.notification.data.url ? event.notification.data.url : '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          if (targetUrl && targetUrl !== '/' && 'navigate' in client) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// ESCUCHA DE MENSAJES PARA DISPARO LOCAL DESDE LA APP
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'TRIGGER_LOCAL_PUSH') {
    const { title, options } = event.data;
    self.registration.showNotification(title || 'TyroFem 30D', options || {});
  }
});
