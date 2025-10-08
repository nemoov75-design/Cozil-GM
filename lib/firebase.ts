import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

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

// Inicializar Firebase Cloud Messaging
export const messaging = getMessaging(app);

// Função para solicitar permissão e obter token
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('✅ Permissão de notificação concedida');
      
      // Obter token FCM
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
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('📨 Mensagem recebida:', payload);
      resolve(payload);
    });
  });
};

export default app;
