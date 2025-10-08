// Sistema de notificações push do CozilTech
// Gerencia permissões, envio e exibição de notificações

// 🔊 Gerar som de notificação usando Web Audio API
export function playNotificationSound() {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    
    // Criar oscilador para gerar o som
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    // Conectar oscilador ao ganho e ao destino
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // Configurar som (frequências para criar um "ding" agradável)
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime) // Frequência inicial
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1) // Decai suavemente
    
    // Configurar volume com envelope (fade in/out)
    gainNode.gain.setValueAtTime(0, audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01) // Fade in rápido
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5) // Fade out suave
    
    // Tocar o som
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
    
    console.log('🔊 Som de notificação reproduzido')
  } catch (error) {
    console.error('❌ Erro ao reproduzir som:', error)
  }
}

// 🔔 Solicitar permissão para notificações
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('⚠️ Notificações não suportadas neste navegador')
    return 'denied'
  }

  if (Notification.permission === 'granted') {
    console.log('✅ Permissão já concedida')
    return 'granted'
  }

  if (Notification.permission === 'denied') {
    console.log('❌ Permissão negada')
    return 'denied'
  }

  // Solicitar permissão
  const permission = await Notification.requestPermission()
  console.log('🔔 Permissão de notificação:', permission)
  return permission
}

// 📢 Enviar notificação local (sem servidor)
export async function sendLocalNotification(title: string, options?: NotificationOptions) {
  const permission = await requestNotificationPermission()
  
  if (permission !== 'granted') {
    console.warn('⚠️ Permissão de notificação não concedida')
    return null
  }

  // Tocar som antes de mostrar notificação
  playNotificationSound()

  // Configurações padrão
  const defaultOptions: NotificationOptions = {
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [200, 100, 200],
    requireInteraction: false,
    ...options
  }

  try {
    const notification = new Notification(title, defaultOptions)
    
    // Evento ao clicar na notificação
    notification.onclick = () => {
      window.focus()
      notification.close()
    }

    console.log('🔔 Notificação enviada:', title)
    return notification
  } catch (error) {
    console.error('❌ Erro ao enviar notificação:', error)
    return null
  }
}

// 📋 Notificação de nova OS criada
export async function notifyNewOS(numeroOS: string, solicitante: string, setor: string) {
  return sendLocalNotification('🆕 Nova Ordem de Serviço!', {
    body: `OS #${numeroOS}\nSolicitante: ${solicitante}\nSetor: ${setor}`,
    tag: `os-${numeroOS}`,
    icon: '/icon-512x512.png',
    requireInteraction: true,
  })
}

// ✏️ Notificação de OS atualizada
export async function notifyOSUpdated(numeroOS: string, status: string) {
  return sendLocalNotification('✏️ OS Atualizada', {
    body: `OS #${numeroOS}\nNovo status: ${status}`,
    tag: `os-${numeroOS}`,
  })
}

// ✅ Notificação de OS concluída
export async function notifyOSCompleted(numeroOS: string) {
  return sendLocalNotification('✅ OS Concluída!', {
    body: `A Ordem de Serviço #${numeroOS} foi concluída com sucesso.`,
    tag: `os-${numeroOS}`,
  })
}

// 🔔 Registrar Service Worker
export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.warn('⚠️ Service Worker não suportado neste navegador')
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js')
    console.log('✅ Service Worker registrado:', registration)
    return registration
  } catch (error) {
    console.error('❌ Erro ao registrar Service Worker:', error)
    return null
  }
}

// 🎯 Verificar se já tem permissão
export function hasNotificationPermission(): boolean {
  return 'Notification' in window && Notification.permission === 'granted'
}

// 📊 Status das notificações
export function getNotificationStatus() {
  if (!('Notification' in window)) {
    return 'not_supported'
  }
  return Notification.permission
}

