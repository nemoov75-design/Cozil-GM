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

// Inicializar Firebase apenas no cliente
let app: any = null;
let messaging: any = null;

if (isClient) {
  try {
    const { initializeApp } = require('firebase/app');
    const { getMessaging, getToken, onMessage } = require('firebase/messaging');
    
    app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);
    
    console.log('🔥 Firebase inicializado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase:', error);
  }
}

export { messaging };

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
      const { getToken } = require('firebase/messaging');
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
    const { onMessage } = require('firebase/messaging');
    onMessage(messaging, (payload) => {
      console.log('📨 Mensagem recebida:', payload);
      resolve(payload);
    });
  });
};

export default app;
