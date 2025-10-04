const cron = require('node-cron')
const fetch = require('node-fetch')

// Agendar envio para o último dia de cada mês às 18:00
const scheduleMonthlyReport = () => {
  console.log('📅 Agendando envio automático de relatórios mensais...')
  
  // Executa no último dia de cada mês às 18:00
  cron.schedule('0 18 L * *', async () => {
    console.log('📧 Executando envio automático de relatório mensal...')
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-monthly-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      const result = await response.json()
      
      if (result.success) {
        console.log('✅ Relatório mensal enviado com sucesso!')
        console.log(`📊 Detalhes: ${result.message}`)
      } else {
        console.error('❌ Erro ao enviar relatório:', result.error)
      }
      
    } catch (error) {
      console.error('❌ Erro na execução do agendamento:', error)
    }
  }, {
    scheduled: true,
    timezone: "America/Sao_Paulo"
  })
  
  console.log('✅ Agendamento configurado: Último dia de cada mês às 18:00')
}

// Função para testar o envio manualmente
const testEmailSend = async () => {
  console.log('🧪 Testando envio de relatório...')
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-monthly-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    const result = await response.json()
    console.log('📧 Resultado do teste:', result)
    
  } catch (error) {
    console.error('❌ Erro no teste:', error)
  }
}

// Exportar funções
module.exports = {
  scheduleMonthlyReport,
  testEmailSend
}

// Se executado diretamente, testar o envio
if (require.main === module) {
  testEmailSend()
}
