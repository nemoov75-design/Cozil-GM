import { NextRequest, NextResponse } from 'next/server'
import * as brevo from '@getbrevo/brevo'

// Configuração do Brevo (300 e-mails/dia GRÁTIS!)
const apiInstance = new brevo.TransactionalEmailsApi()
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    console.log('📧 Iniciando envio de relatório mensal...')
    
    // Buscar usuários cadastrados do banco
    const usersResponse = await fetch(`${request.nextUrl.origin}/api/users`)
    const usersData = await usersResponse.json()
    const users = usersData.users || []
    
    const currentMonth = new Date().toLocaleDateString('pt-BR', { 
      month: 'long', 
      year: 'numeric' 
    })
    
    // Buscar dados reais do banco diretamente do Supabase
    const { createClient } = require('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    
    const { data: workOrders, error: workOrdersError } = await supabase
      .from('work_orders')
      .select('*')
    
    if (workOrdersError) {
      console.error('❌ Erro ao buscar OSs:', workOrdersError)
      return NextResponse.json({
        success: false,
        error: 'Erro ao buscar dados do banco'
      }, { status: 500 })
    }
    
    // Calcular dados reais do relatório
    console.log('📊 Dados encontrados:', { total: workOrders?.length || 0 })
    console.log('📊 Primeiras 3 OSs:', workOrders?.slice(0, 3))
    
    const totalOSs = workOrders?.length || 0
    const concluidas = workOrders?.filter((os: any) => os.status === 'Concluído').length || 0
    const pendentes = workOrders?.filter((os: any) => os.status !== 'Concluído').length || 0
    const altas = workOrders?.filter((os: any) => os.prioridade === 'Alta').length || 0
    const eficiencia = totalOSs > 0 ? ((concluidas / totalOSs) * 100).toFixed(1) : 0
    
    console.log('📊 Dados calculados:', { totalOSs, concluidas, pendentes, altas, eficiencia })
    
    const reportData = {
      totalOSs,
      concluidas,
      pendentes,
      altas,
      eficiencia: parseFloat(eficiencia).toString()
    }
    
    // Enviar para cada usuário
    const emailPromises = users.map(async (user) => {
      const sendSmtpEmail = new brevo.SendSmtpEmail()
      sendSmtpEmail.sender = { email: 'nemoov75@gmail.com', name: 'CozilTech' }
      sendSmtpEmail.to = [{ email: user.email, name: user.name }]
      sendSmtpEmail.subject = `📊 Relatório Mensal - ${currentMonth} | CozilTech`
      sendSmtpEmail.htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
            <div style="background: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              
              <!-- Cabeçalho -->
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #dc2626; margin: 0; font-size: 28px;">🔧 CozilTech</h1>
                <h2 style="color: #374151; margin: 10px 0; font-size: 20px;">Relatório Mensal - ${currentMonth}</h2>
                <p style="color: #6b7280; margin: 0;">Olá, ${user.name}!</p>
              </div>
              
              <!-- Resumo Executivo -->
              <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin-bottom: 25px; border-radius: 5px;">
                <h3 style="color: #dc2626; margin: 0 0 15px 0;">📈 Resumo Executivo</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                  <div>
                    <p style="margin: 5px 0; color: #374151;"><strong>Total de OSs:</strong> ${reportData.totalOSs}</p>
                    <p style="margin: 5px 0; color: #374151;"><strong>Concluídas:</strong> ${reportData.concluidas}</p>
                  </div>
                  <div>
                    <p style="margin: 5px 0; color: #374151;"><strong>Pendentes:</strong> ${reportData.pendentes}</p>
                    <p style="margin: 5px 0; color: #374151;"><strong>Alta Prioridade:</strong> ${reportData.altas}</p>
                  </div>
                </div>
                <div style="text-align: center; margin-top: 15px;">
                  <span style="background: #dc2626; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold;">
                    Eficiência: ${reportData.eficiencia}%
                  </span>
                </div>
              </div>
              
              <!-- Análise de Performance -->
              <div style="margin-bottom: 25px;">
                <h3 style="color: #374151; margin: 0 0 15px 0;">📊 Análise de Performance</h3>
                <div style="background: #f9fafb; padding: 15px; border-radius: 5px;">
                  <p style="margin: 5px 0; color: #374151;">• Taxa de conclusão: <strong>${((reportData.concluidas/reportData.totalOSs)*100).toFixed(1)}%</strong></p>
                  <p style="margin: 5px 0; color: #374151;">• OSs de alta prioridade: <strong>${reportData.altas} (${((reportData.altas/reportData.totalOSs)*100).toFixed(1)}%)</strong></p>
                  <p style="margin: 5px 0; color: #374151;">• Performance geral: <strong>${reportData.eficiencia > 80 ? 'Excelente' : reportData.eficiencia > 60 ? 'Boa' : 'Necessita atenção'}</strong></p>
                </div>
              </div>
              
              <!-- Recomendações -->
              <div style="background: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 20px; margin-bottom: 25px; border-radius: 5px;">
                <h3 style="color: #0ea5e9; margin: 0 0 15px 0;">💡 Recomendações Inteligentes</h3>
                <ul style="margin: 0; padding-left: 20px; color: #374151;">
                  <li>Implementar manutenção preventiva para reduzir emergências</li>
                  <li>Treinar equipe em diferentes tipos de manutenção</li>
                  <li>Estabelecer cronograma de revisões periódicas</li>
                  <li>Monitorar indicadores de performance mensalmente</li>
                </ul>
              </div>
              
              <!-- Rodapé -->
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; margin: 0; font-size: 14px;">
                  Este relatório foi gerado automaticamente pelo CozilTech.<br>
                  Para mais informações, acesse o sistema.
                </p>
                <p style="color: #dc2626; margin: 10px 0 0 0; font-weight: bold;">
                  © 2025 CozilTech - Sistema de Gestão de Manutenção
                </p>
              </div>
              
            </div>
          </div>
        `
      
      try {
        const result = await apiInstance.sendTransacEmail(sendSmtpEmail)
        console.log(`✅ Email enviado para: ${user.email}`)
        return { success: true, email: user.email, id: result.response?.body?.messageId }
      } catch (error: any) {
        console.error(`❌ Erro ao enviar para ${user.email}:`, error)
        return { success: false, email: user.email, error: error.message || 'Erro desconhecido' }
      }
    })
    
    // Aguardar todos os envios
    const results = await Promise.all(emailPromises)
    
    const successCount = results.filter(r => r.success).length
    const errorCount = results.filter(r => !r.success).length
    
    console.log(`📊 Relatório enviado: ${successCount} sucessos, ${errorCount} erros`)
    
    return NextResponse.json({
      success: true,
      message: `Relatório mensal enviado para ${successCount} usuários`,
      details: {
        total: users.length,
        success: successCount,
        errors: errorCount,
        results: results
      }
    })
    
  } catch (error) {
    console.error('❌ Erro no envio do relatório:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}
