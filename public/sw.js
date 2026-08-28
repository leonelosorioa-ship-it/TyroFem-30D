// Service Worker Oficial - TyroFem 30D PWA (ColShopi)
const CACHE_NAME = 'tyrofem-v5';
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
        console.warn('Algunos recursos estáticos no pudieron cachearse:', err);
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

// =========================================================================
// ESCUCHA ROBUSTA DE NOTIFICACIONES PUSH (Estándar WebPush W3C)
// =========================================================================
self.addEventListener('push', (event) => {
  let payload = {
    title: 'TyroFem 30D • ColShopi',
    body: 'Tienes un nuevo mensaje de bienestar y hábitos con Marié ✨',
    icon: '/circulo-marie.png',
    badge: '/colshopi-logo.png',
    tag: `tyrofem-push-${Date.now()}`,
    data: { url: '#calendario' }
  };

  if (event.data) {
    try {
      const dataJson = event.data.json();
      payload = { ...payload, ...dataJson };
    } catch (e) {
      payload.body = event.data.text() || payload.body;
    }
  }

  const notificationOptions = {
    body: payload.body || payload.message || 'Consulta tu guía diaria en la App.',
    icon: payload.icon || '/circulo-marie.png',
    badge: payload.badge || '/colshopi-logo.png',
    vibrate: [200, 100, 200],
    tag: payload.tag || `tyrofem-push-${Date.now()}`,
    renotify: true,
    requireInteraction: false,
    data: {
      url: payload.url || (payload.data && payload.data.url) || '#calendario',
      timestamp: Date.now()
    }
  };

  event.waitUntil(
    self.registration.showNotification(payload.title || 'TyroFem 30D', notificationOptions)
  );
});

// =========================================================================
// CLIC EN LA NOTIFICACIÓN (Apertura o Enfoque de la PWA)
// =========================================================================
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Si la ventana ya está abierta, enfocarla y navegar
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          if (targetUrl && 'navigate' in client && !targetUrl.startsWith('http')) {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      // Si la PWA está cerrada, abrir nueva ventana
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// =========================================================================
// MENSAJES LOCALES DIRECTOS (Trigger Local Push desde UI)
// =========================================================================
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'TRIGGER_LOCAL_PUSH') {
    const { title, options } = event.data;
    self.registration.showNotification(title || 'TyroFem 30D', {
      body: options?.body || 'Tienes un nuevo mensaje de bienestar.',
      icon: options?.icon || '/circulo-marie.png',
      badge: options?.badge || '/colshopi-logo.png',
      vibrate: [200, 100, 200],
      tag: options?.tag || `local-push-${Date.now()}`,
      renotify: true,
      data: options?.data || { url: '#calendario' }
    });
  }
});
