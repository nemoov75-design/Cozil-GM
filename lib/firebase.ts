import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Verificar se está no cliente
const isClient = typeof window !== 'undefined';

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
const app = initializeApp(firebaseConfig);

// Inicializar Firebase Cloud Messaging apenas no cliente
export const messaging = isClient ? getMessaging(app) : null;

// Função para solicitar permissão e obter token
export const requestNotificationPermission = async () => {
  console.log('🔥 Firebase - Verificando disponibilidade...')
  console.log('🔥 isClient:', isClient)
  console.log('🔥 messaging:', messaging)
  
  if (!isClient || !messaging) {
    console.log('❌ Firebase não disponível no servidor');
    return null;
  }

  try {
    console.log('🔥 Firebase - Solicitando permissão...')
    const permission = await Notification.requestPermission();
    console.log('🔥 Firebase - Permissão:', permission)
    
    if (permission === 'granted') {
      console.log('✅ Permissão de notificação concedida');
      
      // Obter token FCM
      console.log('🔥 Firebase - Obtendo token FCM...')
      const token = await getToken(messaging, {
        vapidKey: 'BGv00Xb8Wg-01ciS-irK08eh9YzcYytJsS9mngWRuuljm_cSS4XTU1PzFG178flbRqa5xF7ULI7zwT-MjGMbFM'
      });
      
      if (token) {
        console.log('🔑 Token FCM:', token);
        return token;
      } else {
        console.log('❌ Não foi possível obter token FCM');
        return null;
      }
    } else {
      console.log('❌ Permissão de notificação negada');
      return null;
    }
  } catch (error) {
    console.error('❌ Erro ao solicitar permissão:', error);
    return null;
  }
};

// Função para escutar mensagens em tempo real
export const onMessageListener = () => {
  if (!isClient || !messaging) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('📨 Mensagem recebida:', payload);
      resolve(payload);
    });
  });
};

export default app;
