// Service Worker للـ Progressive Web App
const CACHE_NAME = 'alwadiyayn-sales-v1.0';
const urlsToCache = [
  '/',
  '/ALWADIYAYNFORM.html',
  '/admin-new.html',
  '/success.html',
  '/index.html',
  '/ALWADIYAYNFORM.css',
  '/ALWADIYAYNFORM.js',
  '/hijri-calendar-simple.js',
  '/cyber-security.js',
  '/protection.js',
  '/professional-system.js',
  '/manifest.json',
  '/favicon.svg'
];

// تثبيت Service Worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('📦 تم فتح الكاش');
        return cache.addAll(urlsToCache);
      })
  );
});

// تفعيل Service Worker
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ حذف كاش قديم:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// اعتراض الطلبات
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // إرجاع الملف من الكاش إذا وُجد
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          function(response) {
            // تحقق من صحة الاستجابة
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // نسخ الاستجابة
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

// معالجة الرسائل
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// إشعارات Push (اختياري)
self.addEventListener('push', function(event) {
  const options = {
    body: event.data ? event.data.text() : 'إشعار جديد من نظام المبيعات',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'فتح النظام',
        icon: '/favicon.svg'
      },
      {
        action: 'close',
        title: 'إغلاق',
        icon: '/favicon.svg'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('نظام تقارير المبيعات', options)
  );
});

// معالجة النقر على الإشعارات
self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/ALWADIYAYNFORM.html')
    );
  } else if (event.action === 'close') {
    event.notification.close();
  } else {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('🚀 Service Worker مُحمّل بنجاح!');