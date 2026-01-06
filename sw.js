// Service Worker للـ PWA
const CACHE_NAME = 'alwadiyayn-v1.0';
const urlsToCache = [
    '/',
    '/ALWADIYAYNFORM.html',
    '/admin-new.html',
    '/ALWADIYAYNFORM.css',
    '/ALWADIYAYNFORM.js',
    '/professional-system.js',
    '/cyber-security.js',
    '/protection.js',
    '/hijri-calendar-simple.js'
];

// تثبيت Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// استرجاع الملفات من Cache
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // إرجاع الملف من Cache أو جلبه من الشبكة
                return response || fetch(event.request);
            })
    );
});

// تحديث Cache
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});