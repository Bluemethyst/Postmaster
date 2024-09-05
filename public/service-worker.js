// @ts-nocheck
// Register the service worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('pwa-cache').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/manifest.json',
                '/styles.css',
                '/script.js',
                '/icon.png'
            ])
        })
    )
})

// Handle fetch requests
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return (
                response ||
                fetch(event.request).then((response) => {
                    return caches.open('pwa-cache').then((cache) => {
                        cache.put(event.request, response.clone())
                        return response
                    })
                })
            )
        })
    )
})

// Handle cache updates
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cacheName) => cacheName !== 'pwa-cache')
                    .map((cacheName) => caches.delete(cacheName))
            )
        })
    )
})

// Handle push notifications
self.addEventListener('push', (event) => {
    if (event.data) {
        console.log('Received push data:', event.data.text())
        event.waitUntil(
            self.registration.showNotification(event.data.text(), {
                body: event.data.text(),
                icon: '/icon.png'
            })
        )
    }
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close()
    event.waitUntil(
        clients.matchAll().then((clients) => {
            if (clients.length) {
                clients[0].focus()
            } else {
                self.clients.openWindow('/')
            }
        })
    )
})
