// A name for our cache
const CACHE_NAME = 'mattsworld-v1';

// All the files and assets we want to cache for offline use
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/my-family.jpg',
  '/images/hero-face.png',
  '/images/icons/android-chrome-192x192.png',
  '/images/icons/android-chrome-512x512.png'
];

// --- INSTALL EVENT ---
// This runs when the service worker is first installed.
self.addEventListener('install', (event) => {
  // We wait until the cache is opened and all our files are added to it.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and adding assets');
        return cache.addAll(urlsToCache);
      })
  );
});

// --- FETCH EVENT ---
// This runs every time the browser requests a file (like a page, image, or script).
self.addEventListener('fetch', (event) => {
  event.respondWith(
    // We check if the requested file is already in our cache.
    caches.match(event.request)
      .then((response) => {
        // If we found it in the cache, return the cached version.
        if (response) {
          return response;
        }
        // If it's not in the cache, go to the network and fetch it normally.
        return fetch(event.request);
      })
  );
});