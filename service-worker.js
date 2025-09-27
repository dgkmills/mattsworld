// Define a name for the cache
const CACHE_NAME = 'matts-world-cache-v1';

// List all the files and assets to be cached
// This is the "app shell" - the minimal resources needed to run offline.
const urlsToCache = [
  '/',
  '/index.html',
  // NOTE: We don't cache external resources from CDNs like tailwind or google fonts.
  // The browser will handle caching those. We only cache our own files.
  '/images/hero-face.jpg' 
];

// Installation event: triggered when the service worker is first installed.
self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: triggered for every network request made by the page.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response from the cache
        if (response) {
          return response;
        }
        // Not in cache - fetch from the network
        return fetch(event.request);
      }
    )
  );
});
