// A name for our cache
const CACHE_NAME = 'mattsworld-v2'; // Note: I've updated the cache version name

// All the files and assets we want to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/my-family.jpg',
  '/images/hero-face.png',
  '/images/icons/android-chrome-192x192.png',
  '/images/icons/android-chrome-512x512.png',
  '/images/icons/apple-touch-icon.png'
];

// --- INSTALL EVENT ---
// This runs when the service worker is first installed.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and adding assets');
        return cache.addAll(urlsToCache);
      })
  );
});

// --- ACTIVATE EVENT ---
// This runs after the install event and is a good place to clean up old caches.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          // Find all caches that aren't our current one and delete them
          return cacheName.startsWith('mattsworld-') && cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});


// --- FETCH EVENT ---
// This runs every time the browser requests a file.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      // 1. Try to get the response from the cache first.
      return cache.match(event.request).then((cachedResponse) => {
        // 2. Go to the network to get a fresh version.
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // If we get a valid response from the network,
          // we update the cache with the new version.
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });

        // 3. Return the cached version right away if it exists,
        // otherwise wait for the network response.
        return cachedResponse || fetchPromise;
      });
    })
  );
});
