// Service Worker for GhanaTransit PWA
// This is a simplified version that works in development environments

const CACHE_NAME = "ghanatransit-v1"
const urlsToCache = ["/", "/offline.html"]

// Install event - simplified caching
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...")
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Opened cache")
        return cache.addAll(urlsToCache)
      })
      .catch((error) => {
        console.log("Cache addAll failed:", error)
      }),
  )
  self.skipWaiting()
})

// Activate event
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...")
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

// Fetch event - simplified offline support
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") {
    return
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If request is successful, clone and cache it
        if (response.status === 200) {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
        }
        return response
      })
      .catch(() => {
        // If network fails, try to serve from cache
        return caches.match(event.request).then((response) => {
          if (response) {
            return response
          }
          // If not in cache, serve offline page for navigation requests
          if (event.request.mode === "navigate") {
            return caches.match("/offline.html")
          }
        })
      }),
  )
})

// Push event - handle push notifications
self.addEventListener("push", (event) => {
  console.log("Push event received")

  let data = {
    title: "GhanaTransit",
    body: "You have a new notification",
    icon: "/icon-192x192.png",
    badge: "/badge-72x72.png",
  }

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() }
    } catch (e) {
      data.body = event.data.text() || data.body
    }
  }

  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    tag: data.tag || "ghanatransit-notification",
    data: data.data || {},
    requireInteraction: data.priority === "urgent",
    silent: data.priority === "low",
    actions: [
      {
        action: "view",
        title: "View",
      },
      {
        action: "dismiss",
        title: "Dismiss",
      },
    ],
  }

  event.waitUntil(self.registration.showNotification(data.title, options))
})

// Notification click event
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked")

  event.notification.close()

  const action = event.action
  const data = event.notification.data || {}

  // Send message to all clients
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      // Send message to existing clients
      clients.forEach((client) => {
        client.postMessage({
          type: "NOTIFICATION_CLICKED",
          data: { action, ...data },
        })
      })

      // If no clients are open, open a new window
      if (clients.length === 0) {
        return self.clients.openWindow(data.url || "/")
      }
    }),
  )
})

// Notification close event
self.addEventListener("notificationclose", (event) => {
  console.log("Notification closed")

  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: "NOTIFICATION_CLOSED",
          data: event.notification.data || {},
        })
      })
    }),
  )
})

// Message event - handle messages from main thread
self.addEventListener("message", (event) => {
  console.log("Service Worker received message:", event.data)

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})
