/* SoundKeleles — Push Service Worker
 * Solo gestiona notificaciones push. NO cachea la app (no offline PWA).
 * Registrado únicamente en producción (fuera de preview/iframe).
 */

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (_) {
    payload = { title: 'SoundKeleles', body: event.data ? event.data.text() : '' };
  }
  const title = payload.title || 'SoundKeleles';
  const options = {
    body: payload.body || '',
    icon: payload.icon || '/isologo-soundkeleles.jpg',
    badge: payload.badge || '/isologo-soundkeleles.jpg',
    tag: payload.tag || undefined,
    data: { url: payload.url || '/', ...payload.data },
    requireInteraction: false,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of allClients) {
        try {
          const url = new URL(client.url);
          if (url.origin === self.location.origin) {
            await client.focus();
            if ('navigate' in client) {
              await client.navigate(targetUrl);
            }
            return;
          }
        } catch (_) {}
      }
      if (self.clients.openWindow) {
        await self.clients.openWindow(targetUrl);
      }
    })(),
  );
});

self.addEventListener('pushsubscriptionchange', (event) => {
  // Best-effort re-subscribe with same appServerKey; the client will re-register on next visit.
  event.waitUntil(Promise.resolve());
});
