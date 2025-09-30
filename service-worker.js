// A name for our cache
const CACHE_NAME = 'mattsworld-v3'; // IMPORTANT: Increased cache version

// All the files and assets we want to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/my-family.jpg',
  '/images/hero-face.png',
  '/images/matt-cake.jpg', // Added the new drawing to the cache
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
      // NEW: Force the waiting service worker to become the active service worker.
      .then(() => self.skipWaiting())
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
          console.log('Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
    // NEW: Take control of all open pages as soon as the service worker activates.
    .then(() => self.clients.claim())
  );
});


// --- FETCH EVENT ---
// This runs every time the browser requests a file.
self.addEventListener('fetch', (event) => {
  // Using a "Stale-While-Revalidate" strategy
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      // 1. Try to get the response from the cache first.
      return cache.match(event.request).then((cachedResponse) => {
        // 2. Go to the network to get a fresh version in the background.
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // If we get a valid response from the network,
          // we update the cache with the new version for next time.
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });

        // 3. Return the cached version right away if it exists,
        // otherwise wait for the network response. This makes the app feel instant.
        return cachedResponse || fetchPromise;
      });
    })
  );
});
