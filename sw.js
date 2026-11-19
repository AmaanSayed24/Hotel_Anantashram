/* ============================================================================
   Hotel Anantashram - Service Worker (cache-first for static assets)
   ============================================================================ */

const CACHE_NAME = 'anantashram-v3';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/tailwind.config.js',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml',
  '/favicon.ico',
  '/logo-header.png',
  '/hero-thali.jpg'
];

// Install - cache static assets
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
});

// Activate - clean old caches
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.filter(function (name) {
          return name !== CACHE_NAME;
        }).map(function (name) {
          return caches.delete(name);
        })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

// Fetch - cache-first for static assets, network-first for HTML
self.addEventListener('fetch', function (event) {
  var request = event.request;
  var url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests (fonts, CDN) - let browser handle
  if (url.origin !== location.origin) {
    // For Google Fonts and Tailwind CDN, use stale-while-revalidate
    event.respondWith(
      caches.match(request).then(function (cached) {
        var networkFetch = fetch(request).then(function (response) {
          if (response && response.status === 200) {
            var responseClone = response.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(request, responseClone);
            });
          }
          return response;
        }).catch(function () {
          return cached;
        });
        return cached || networkFetch;
      })
    );
    return;
  }

  // For same-origin requests: cache-first for assets, network-first for HTML
  var isHTML = request.headers.get('accept') && request.headers.get('accept').includes('text/html');

  if (isHTML) {
    // Network-first for HTML
    event.respondWith(
      fetch(request).then(function (response) {
        if (response && response.status === 200) {
          var responseClone = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(request, responseClone);
          });
        }
        return response;
      }).catch(function () {
        return caches.match(request);
      })
    );
  } else {
    // Cache-first for CSS, JS, images, etc.
    event.respondWith(
      caches.match(request).then(function (cached) {
        if (cached) return cached;
        return fetch(request).then(function (response) {
          if (response && response.status === 200) {
            var responseClone = response.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      })
    );
  }
});

// Handle messages from client
self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});