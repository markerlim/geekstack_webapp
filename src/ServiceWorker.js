// Define a name for the current cache version
const CACHE_NAME = 'v1_cache';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/style.scss',
  '/styles/App.scss',
  '/icons/geekstackicon.svg',
  '/icons/bottomnav/DeckcreateSelected.svg',
  '/icons/bottomnav/DecklibrarySelected.svg',
  '/icons/bottomnav/FAQSelected.svg',
  '/icons/bottomnav/HomeSelected.svg',
  '/icons/bottomnav/NewsSelected.svg',
  '/images/deckimage1.jpg',
  '/images/deckimage2.jpg',
  '/images/deckimage3.jpg',
  '/images/deckimage4.jpg',
  '/images/deckimage5.jpg',
  '/images/deckimage6.jpg',
  '/images/deckimage7.jpg',
  '/images/deckimage8.jpg',
  '/images/deckimage9.jpg', 
  '/images/deckimage10.jpg',
  '/images/deckimage11.jpg',
  '/images/deckimage12.jpg',
  '/images/deckimage13.jpg',
  '/images/deckimage14.jpg',
  '/images/deckimage15.jpg',
  '/images/deckimage16.jpg',
  '/images/deckimage17.jpg',
  '/images/deckimage18.jpg',
  '/images/deckimage19.jpg',
  '/images/deckimage20.jpg',
  '/images/HMOPCGButton.jpg',
  '/images/HMUACGButton.jpg',
  '/images/COMINGSOON.png',
  '/images/LATEST RELEASE.png',
  '/images/loginBG1.png',
  '/OPTCG/optcgboostercover/OP01.webp',
  '/OPTCG/optcgboostercover/OP02.webp',
  '/OPTCG/optcgboostercover/OP03.webp',
  '/OPTCG/optcgboostercover/OP04.webp',
  '/OPTCG/optcgboostercover/OP05.webp',
  '/OPTCG/optcgboostercover/ST01.webp',
  '/OPTCG/optcgboostercover/ST02.webp',
  '/OPTCG/optcgboostercover/ST03.webp',
  '/OPTCG/optcgboostercover/ST04.webp',
  '/OPTCG/optcgboostercover/ST05.webp',
  '/OPTCG/optcgboostercover/ST06.webp',
  '/OPTCG/optcgboostercover/ST07.webp',
  '/OPTCG/optcgboostercover/ST08.webp',
  '/OPTCG/optcgboostercover/ST09.webp',
  '/OPTCG/optcgboostercover/ST10.webp',
  '/OPTCG/optcgboostercover/ST11.webp',
  '/FAQimages/FAQheader.webp',
  '/images/OPLibrary.webp',
  '/images/UALibrary.webp',

  // ... any other essential static assets
];

// Install event: cache files and assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: serve cached content or fetch from the network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // If the request matches a cache entry, return the cached response
        }
        return fetch(event.request) // Otherwise, fetch from the network
          .then(fetchResponse => {
            // Optionally, you can add dynamic caching logic here.
            // For example, cache certain assets or responses as users navigate your app.
            return fetchResponse;
          });
      })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // Delete old cache versions
          }
        })
      );
    })
  );
});
