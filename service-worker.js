const CACHE_NAME = 'ismail-kitap-admin-v2.0.0';
const urlsToCache = [
  '/admin.html',
  '/index.html',
  '/manifest.json',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js',
  'https://cdn.jsdelivr.net/npm/three@0.157.0/build/three.min.js',
  'https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('İsmail Kitap Admin PWA: Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('İsmail Kitap Admin PWA: Caching assets...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('İsmail Kitap Admin PWA: All assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('İsmail Kitap Admin PWA: Cache installation failed:', error);
      })
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  console.log('İsmail Kitap Admin PWA: Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('İsmail Kitap Admin PWA: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('İsmail Kitap Admin PWA: Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch Strategy: Cache First with Network Fallback
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          console.log('İsmail Kitap Admin PWA: Serving from cache:', event.request.url);
          return response;
        }

        // Otherwise fetch from network
        console.log('İsmail Kitap Admin PWA: Fetching from network:', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // Check if response is valid
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone response for caching
            const responseToCache = response.clone();

            // Cache successful responses
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch((error) => {
            console.error('İsmail Kitap Admin PWA: Fetch failed:', error);
            
            // Return offline fallback for HTML pages
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/admin.html');
            }
            
            // Return cached response if available
            return caches.match(event.request);
          });
      })
  );
});

// Background Sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('İsmail Kitap Admin PWA: Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync-orders') {
    event.waitUntil(syncOrders());
  }
  
  if (event.tag === 'background-sync-inventory') {
    event.waitUntil(syncInventory());
  }
});

// Sync functions
async function syncOrders() {
  try {
    // Get pending orders from IndexedDB
    const pendingOrders = await getPendingOrders();
    
    for (const order of pendingOrders) {
      try {
        await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(order)
        });
        
        // Remove from pending after successful sync
        await removePendingOrder(order.id);
        console.log('İsmail Kitap Admin PWA: Order synced successfully:', order.id);
      } catch (error) {
        console.error('İsmail Kitap Admin PWA: Failed to sync order:', order.id, error);
      }
    }
  } catch (error) {
    console.error('İsmail Kitap Admin PWA: Background sync failed:', error);
  }
}

async function syncInventory() {
  try {
    // Get pending inventory updates from IndexedDB
    const pendingUpdates = await getPendingInventoryUpdates();
    
    for (const update of pendingUpdates) {
      try {
        await fetch('/api/inventory', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(update)
        });
        
        // Remove from pending after successful sync
        await removePendingInventoryUpdate(update.id);
        console.log('İsmail Kitap Admin PWA: Inventory synced successfully:', update.id);
      } catch (error) {
        console.error('İsmail Kitap Admin PWA: Failed to sync inventory:', update.id, error);
      }
    }
  } catch (error) {
    console.error('İsmail Kitap Admin PWA: Inventory sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('İsmail Kitap Admin PWA: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'İsmail Kitap Admin - Yeni bildirim',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Görüntüle',
        icon: '/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Kapat',
        icon: '/icon-96x96.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('İsmail Kitap Admin', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('İsmail Kitap Admin PWA: Notification clicked:', event.action);
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/admin.html')
    );
  }
});

// IndexedDB helper functions (simplified for demo)
async function getPendingOrders() {
  // In a real implementation, this would use IndexedDB
  return [];
}

async function removePendingOrder(id) {
  // In a real implementation, this would remove from IndexedDB
  console.log('Removing pending order:', id);
}

async function getPendingInventoryUpdates() {
  // In a real implementation, this would use IndexedDB
  return [];
}

async function removePendingInventoryUpdate(id) {
  // In a real implementation, this would remove from IndexedDB
  console.log('Removing pending inventory update:', id);
}

// Update check
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('İsmail Kitap Admin PWA: Service Worker loaded successfully');