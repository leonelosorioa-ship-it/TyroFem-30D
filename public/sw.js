// Service Worker for TyroFem 30D PWA
const CACHE_NAME = 'tyrofem-v3';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/circulo-marie.png',
  '/colshopi-logo.png',
  '/favicon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('PWA: Some static assets failed to cache', err);
      });
    })
  );
  self.skipWaiting();
});

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

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  // For navigation requests, try network first then cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html') || caches.match('/');
      })
    );
    return;
  }

  // Cache-first / stale-while-revalidate for static assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});

// =========================================================================
// PUSH NOTIFICATIONS EVENT LISTENER (ColShopi TyroFem 30D)
// =========================================================================
self.addEventListener('push', function(event) {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { 
        title: 'TyroFem 30D • ColShopi', 
        body: event.data.text() || 'Recordatorio de tu Reto TyroFem 30D' 
      };
    }
  } else {
    data = {
      title: 'TyroFem 30D con Tyruss Full',
      body: '¡Marié tiene un recordatorio para tu bienestar de hoy! 🌿'
    };
  }

  const title = data.title || 'TyroFem 30D con Tyruss Full';
  const options = {
    body: data.body || data.message || 'Recordatorio de tu Reto TyroFem 30D',
    icon: data.icon || '/circulo-marie.png',
    badge: data.badge || '/colshopi-logo.png',
    image: data.image || undefined,
    vibrate: [100, 50, 100],
    data: { 
      url: data.url || '/',
      timestamp: Date.now(),
      id: data.id || `push-${Date.now()}`
    },
    actions: [
      { action: 'open', title: 'Abrir App 🌿' },
      { action: 'close', title: 'Cerrar' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// =========================================================================
// NOTIFICATION CLICK EVENT LISTENER
// =========================================================================
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const notificationData = event.notification.data || {};
  const targetUrl = notificationData.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there is already a window open with this app
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          if (targetUrl && targetUrl !== '/') {
            client.navigate(targetUrl);
          }
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Message listener from web app to display notification via Service Worker
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'TRIGGER_LOCAL_PUSH') {
    const { title, options } = event.data;
    self.registration.showNotification(title || 'TyroFem 30D', options || {});
  }
});

