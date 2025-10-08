// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDOwYm1tysQmZtZIeFDuVtSYF8HHlid5uk",
  authDomain: "coziltech-notifications.firebaseapp.com",
  projectId: "coziltech-notifications",
  storageBucket: "coziltech-notifications.firebasestorage.app",
  messagingSenderId: "258685936619",
  appId: "1:258685936619:web:790175d6fb17d207df6fae"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Inicializar Firebase Cloud Messaging
const messaging = firebase.messaging();

// Escutar mensagens em background
messaging.onBackgroundMessage((payload) => {
  console.log('📨 Mensagem recebida em background:', payload);
  
  const notificationTitle = payload.notification?.title || 'Nova Notificação';
  const notificationOptions = {
    body: payload.notification?.body || 'Você tem uma nova notificação',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: 'cozil-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'Ver Detalhes',
        icon: '/favicon.svg'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/favicon.svg'
      }
    ],
    data: payload.data
  };

  // Mostrar notificação
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Escutar cliques na notificação
self.addEventListener('notificationclick', (event) => {
  console.log('🖱️ Clique na notificação:', event);
  
  event.notification.close();
  
  if (event.action === 'view') {
    // Abrir o app
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Apenas fechar a notificação
    event.notification.close();
  } else {
    // Clique padrão - abrir o app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Escutar instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker instalado');
  self.skipWaiting();
});

// Escutar ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker ativado');
  event.waitUntil(self.clients.claim());
});
