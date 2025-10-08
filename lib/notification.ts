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
    // FALLBACK: Usar alert como alternativa
    alert(`🔔 ${title}\n\n${options?.body || ''}`)
    return null
  }

  // Tocar som antes de mostrar notificação
  playNotificationSound()

  // Configurações padrão
  const defaultOptions: NotificationOptions = {
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [300, 100, 300, 100, 300], // Vibração mais chamativa
    requireInteraction: true, // Força interação
    ...options
  }

  try {
    console.log('🔔 Criando notificação com título:', title)
    console.log('🔔 Opções:', defaultOptions)
    
    // Forçar foco da janela antes de criar notificação
    if (document.hidden) {
      console.log('🔄 Janela em background, tentando focar...')
      window.focus()
    }
    
    const notification = new Notification(title, defaultOptions)
    
    // Evento ao clicar na notificação
    notification.onclick = () => {
      console.log('🖱️ Notificação clicada!')
      window.focus()
      notification.close()
    }

    // Verificar se a notificação foi realmente exibida
    setTimeout(() => {
      if (notification) {
        console.log('✅ Notificação ainda ativa após 1 segundo')
      }
    }, 1000)

    console.log('✅ Notificação criada com sucesso:', title)
    return notification
  } catch (error) {
    console.error('❌ Erro ao enviar notificação:', error)
    // FALLBACK: Usar alert como alternativa
    alert(`🔔 ${title}\n\n${options?.body || ''}`)
    return null
  }
}

// 📋 Notificação de nova OS criada
export async function notifyNewOS(numeroOS: string, solicitante: string, setor: string) {
  // Tentar notificação nativa primeiro
  const notification = await sendLocalNotification('🚨 NOVA ORDEM DE SERVIÇO!', {
    body: `📋 OS #${numeroOS}\n👤 Solicitante: ${solicitante}\n🏢 Setor: ${setor}\n\n⚡ Clique para ver detalhes!`,
    tag: `os-${numeroOS}`,
    icon: '/icon-512x512.png',
    requireInteraction: true,
    vibrate: [300, 100, 300, 100, 300], // Vibração mais longa e chamativa
  })
  
  // Se não funcionou, usar toast personalizado
  if (!notification) {
    showCustomToast(
      '🚨 NOVA ORDEM DE SERVIÇO!',
      `📋 OS #${numeroOS}\n👤 ${solicitante}\n🏢 ${setor}`,
      'warning'
    )
  }
  
  return notification
}

// ✏️ Notificação de OS atualizada
export async function notifyOSUpdated(numeroOS: string, status: string) {
  return sendLocalNotification('📝 ATUALIZAÇÃO IMPORTANTE!', {
    body: `📋 OS #${numeroOS}\n🔄 Status: ${status}\n\n👀 Verifique as mudanças!`,
    tag: `os-${numeroOS}`,
    vibrate: [200, 100, 200],
  })
}

// ✅ Notificação de OS concluída
export async function notifyOSCompleted(numeroOS: string) {
  // Tentar notificação nativa primeiro
  const notification = await sendLocalNotification('🎉 MISSÃO CUMPRIDA!', {
    body: `✅ OS #${numeroOS} CONCLUÍDA!\n🏆 Parabéns pelo trabalho!\n\n🎯 Nova missão pode estar chegando...`,
    tag: `os-${numeroOS}`,
    vibrate: [200, 50, 200, 50, 200], // Vibração de comemoração
  })
  
  // Se não funcionou, usar toast personalizado
  if (!notification) {
    showCustomToast(
      '🎉 MISSÃO CUMPRIDA!',
      `✅ OS #${numeroOS} CONCLUÍDA!\n🏆 Parabéns pelo trabalho!`,
      'success'
    )
  }
  
  return notification
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

// 🚨 Notificação de OS URGENTE (Alta prioridade)
export async function notifyUrgentOS(numeroOS: string, solicitante: string, setor: string) {
  return sendLocalNotification('🚨🚨 URGENTE! 🚨🚨', {
    body: `🔥 OS #${numeroOS} - ALTA PRIORIDADE!\n👤 ${solicitante}\n🏢 ${setor}\n\n⚡ ATENÇÃO IMEDIATA NECESSÁRIA!`,
    tag: `urgent-${numeroOS}`,
    vibrate: [500, 200, 500, 200, 500], // Vibração URGENTE
    requireInteraction: true,
  })
}

// 📅 Notificação de OS atrasada
export async function notifyOverdueOS(numeroOS: string, daysLate: number) {
  return sendLocalNotification('⏰ OS ATRASADA!', {
    body: `📋 OS #${numeroOS}\n⏰ ${daysLate} dias de atraso\n\n🚨 Ação necessária!`,
    tag: `overdue-${numeroOS}`,
    vibrate: [400, 100, 400, 100, 400],
    requireInteraction: true,
  })
}

// 🎯 Notificação de nova OS no seu setor
export async function notifyNewOSInYourSector(numeroOS: string, setor: string) {
  return sendLocalNotification('🎯 NOVA OS NO SEU SETOR!', {
    body: `📋 OS #${numeroOS}\n🏢 Setor: ${setor}\n\n👀 Esta OS é para você!`,
    tag: `sector-${numeroOS}`,
    vibrate: [300, 100, 300, 100, 300],
    requireInteraction: true,
  })
}

// 🔔 Notificação de lembrete
export async function notifyReminder(message: string) {
  return sendLocalNotification('🔔 LEMBRETE', {
    body: `💡 ${message}\n\n⏰ Não esqueça!`,
    tag: 'reminder',
    vibrate: [200, 100, 200],
  })
}

// 🎯 Toast personalizado que SEMPRE funciona
export function showCustomToast(title: string, message: string, type: 'success' | 'warning' | 'info' = 'info') {
  // Criar elemento de toast
  const toast = document.createElement('div')
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
    color: white;
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    z-index: 9999;
    max-width: 300px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    line-height: 1.4;
    animation: slideIn 0.3s ease-out;
  `
  
  toast.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 4px;">${title}</div>
    <div>${message}</div>
  `
  
  // Adicionar animação CSS
  const style = document.createElement('style')
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `
  document.head.appendChild(style)
  
  // Adicionar ao DOM
  document.body.appendChild(toast)
  
  // Tocar som
  playNotificationSound()
  
  // Remover após 5 segundos
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-in'
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    }, 300)
  }, 5000)
  
  // Remover ao clicar
  toast.onclick = () => {
    toast.style.animation = 'slideOut 0.3s ease-in'
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    }, 300)
  }
  
  console.log('🎯 Toast personalizado exibido:', title)
  return toast
}

