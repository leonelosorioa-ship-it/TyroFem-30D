// Service Worker Oficial - TyrussFull PWA
const CACHE_NAME = 'tyrofem-v9';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/circulo-marie.png',
  '/colshopi-logo.png',
  '/icon-192.png',
  '/icon-512.png'
];

// Helper para sanear y resolver URLs de destino de forma absoluta
function getSanitizedDestinationUrl(rawUrl) {
  try {
    if (!rawUrl || typeof rawUrl !== 'string') {
      return self.location.origin + '/';
    }

    const trimmed = rawUrl.trim();

    // Enlaces externos absolutos (ej: WhatsApp https://wa.me/...)
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }

    let pathOrHash = trimmed;
    if (pathOrHash.startsWith('#')) {
      pathOrHash = '/' + pathOrHash;
    } else if (!pathOrHash.startsWith('/')) {
      pathOrHash = '/' + pathOrHash;
    }

    // Blindaje crítico: Jamás permitir navegar hacia el archivo de código sw.js
    if (pathOrHash === '/sw.js' || pathOrHash.startsWith('/sw.js#') || pathOrHash.startsWith('/sw.js?')) {
      return self.location.origin + '/';
    }

    return new URL(pathOrHash, self.location.origin).href;
  } catch (e) {
    return self.location.origin + '/';
  }
}

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

// Fetch con estrategia Network-First para activos y exclusión total de /api/
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const reqUrl = new URL(event.request.url);

  // 1. Exclusión total de rutas de API: la red manda directamente sin interferencia de caché
  if (reqUrl.pathname.startsWith('/api/')) {
    return;
  }

  // 2. Para navegaciones (HTML), intentar red primero para asegurar código actualizado
  if (event.request.mode === 'navigate') {
    // Blindaje anti-error: Si un navegador intenta navegar a sw.js como documento HTML, redirigir a la raíz
    if (reqUrl.pathname === '/sw.js' || reqUrl.pathname.endsWith('/sw.js')) {
      event.respondWith(Response.redirect(self.location.origin + '/', 302));
      return;
    }

    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html') || caches.match('/');
      })
    );
    return;
  }

  // 3. Para scripts, módulos Vite y estilos: Network First con fallback a caché
  // Esto garantiza que cualquier nuevo código de acceso o actualización se aplique de inmediato en móviles
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && (networkResponse.type === 'basic' || networkResponse.type === 'cors')) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// =========================================================================
// ESCUCHA ROBUSTA DE NOTIFICACIONES PUSH (Estándar WebPush W3C)
// =========================================================================
self.addEventListener('push', (event) => {
  let payload = {
    title: 'TyrussFull',
    body: 'Tienes un nuevo mensaje de bienestar y hábitos con Marié ✨',
    icon: '/circulo-marie.png',
    badge: '/colshopi-logo.png',
    tag: `tyrussfull-push-${Date.now()}`,
    data: { url: '/#calendario' }
  };

  if (event.data) {
    try {
      const dataJson = event.data.json();
      payload = { ...payload, ...dataJson };
    } catch (e) {
      payload.body = event.data.text() || payload.body;
    }
  }

  const sanitizedTargetUrl = getSanitizedDestinationUrl(
    payload.url || (payload.data && payload.data.url) || '/#calendario'
  );

  const notificationOptions = {
    body: payload.body || payload.message || 'Consulta tu guía diaria en la App.',
    icon: payload.icon || '/circulo-marie.png',
    badge: payload.badge || '/colshopi-logo.png',
    vibrate: [200, 100, 200],
    tag: payload.tag || `tyrofem-push-${Date.now()}`,
    renotify: true,
    requireInteraction: false,
    data: {
      url: sanitizedTargetUrl,
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

  const rawUrl = (event.notification.data && event.notification.data.url)
    ? event.notification.data.url
    : '/';
  const targetUrl = getSanitizedDestinationUrl(rawUrl);

  event.waitUntil(
    (async () => {
      // 1. Si es enlace externo (ej: WhatsApp), abrir ventana nueva directamente
      if (targetUrl.startsWith('http') && !targetUrl.startsWith(self.location.origin)) {
        if (clients.openWindow) {
          return await clients.openWindow(targetUrl);
        }
        return;
      }

      // 2. Buscar ventanas de la PWA que ya estén abiertas en este origen
      const clientList = await clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of clientList) {
        if (client.url && client.url.startsWith(self.location.origin) && 'focus' in client) {
          await client.focus();

          // Enviar mensaje a la App React para activar la pestaña correspondiente
          client.postMessage({
            type: 'PUSH_NOTIFICATION_CLICKED',
            url: targetUrl,
            rawUrl: rawUrl,
            data: event.notification.data
          });

          // Navegar si la URL de la ventana es distinta
          if ('navigate' in client && client.url !== targetUrl) {
            try {
              await client.navigate(targetUrl);
            } catch (navErr) {
              console.warn('[SW] No se pudo navegar client:', navErr);
            }
          }
          return;
        }
      }

      // 3. Si la PWA estaba cerrada, abrirla con la URL absoluta correcta (nunca sw.js)
      if (clients.openWindow) {
        return await clients.openWindow(targetUrl);
      }
    })()
  );
});

// =========================================================================
// MENSAJES LOCALES DIRECTOS (Trigger Local Push desde UI)
// =========================================================================
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'TRIGGER_LOCAL_PUSH') {
    const { title, options } = event.data;
    const sanitizedUrl = getSanitizedDestinationUrl(
      options?.data?.url || options?.url || '/#calendario'
    );

    self.registration.showNotification(title || 'TyroFem 30D', {
      body: options?.body || 'Tienes un nuevo mensaje de bienestar.',
      icon: options?.icon || '/circulo-marie.png',
      badge: options?.badge || '/colshopi-logo.png',
      vibrate: [200, 100, 200],
      tag: options?.tag || `local-push-${Date.now()}`,
      renotify: true,
      data: {
        url: sanitizedUrl,
        ...(options?.data || {})
      }
    });
  }
});
