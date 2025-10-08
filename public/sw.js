// Service Worker para notificações push
// Este arquivo roda em background e gerencia as notificações

const CACHE_NAME = 'coziltech-v1'
const urlsToCache = [
  '/',
  '/icon-192x192.png',
  '/icon-512x512.png',
]

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Instalando...')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Cache aberto')
        return cache.addAll(urlsToCache)
      })
  )
  self.skipWaiting()
})

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: Ativado!')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Removendo cache antigo:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  return self.clients.claim()
})

// Interceptar requisições (para funcionar offline)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - retorna resposta
        if (response) {
          return response
        }
        return fetch(event.request)
      }
    )
  )
})

// 🔔 RECEBER NOTIFICAÇÕES PUSH
self.addEventListener('push', (event) => {
  console.log('🔔 Notificação Push recebida!')
  
  let notificationData = {
    title: 'CozilTech',
    body: 'Nova notificação',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    tag: 'coziltech-notification',
    requireInteraction: false,
  }

  if (event.data) {
    try {
      notificationData = event.data.json()
    } catch (e) {
      notificationData.body = event.data.text()
    }
  }

  const options = {
    body: notificationData.body,
    icon: notificationData.icon || '/icon-192x192.png',
    badge: notificationData.badge || '/icon-192x192.png',
    tag: notificationData.tag || 'coziltech-notification',
    data: notificationData.data || {},
    requireInteraction: notificationData.requireInteraction || false,
    vibrate: [200, 100, 200], // Padrão de vibração
    sound: '/notification-sound.mp3', // Som personalizado
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  )
})

// 🖱️ QUANDO CLICA NA NOTIFICAÇÃO
self.addEventListener('notificationclick', (event) => {
  console.log('🖱️ Notificação clicada!')
  
  event.notification.close()

  // Abrir ou focar no app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Se já tem uma janela aberta, foca nela
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i]
          if (client.url === '/' && 'focus' in client) {
            return client.focus()
          }
        }
        // Se não, abre uma nova janela
        if (clients.openWindow) {
          return clients.openWindow('/')
        }
      })
  )
})

// 🔕 QUANDO FECHA A NOTIFICAÇÃO
self.addEventListener('notificationclose', (event) => {
  console.log('🔕 Notificação fechada')
})

