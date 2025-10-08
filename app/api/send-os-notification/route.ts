import { NextRequest, NextResponse } from 'next/server'
import * as brevo from '@getbrevo/brevo'
import { supabase } from '@/lib/supabase'

// Configuração do Brevo
const apiInstance = new brevo.TransactionalEmailsApi()
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const { osId } = await request.json()
    
    console.log('📧 Enviando notificação de nova OS:', osId)
    
    // Buscar OS no banco
    const { data: os, error: osError } = await supabase
      .from('work_orders')
      .select('*')
      .eq('id', osId)
      .single()
    
    if (osError || !os) {
      console.error('❌ Erro ao buscar OS:', osError)
      return NextResponse.json({ error: 'OS não encontrada' }, { status: 404 })
    }
    
    // Buscar usuários que recebem notificações
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .eq('active', true)
      .eq('receive_notifications', true)
    
    if (usersError || !users || users.length === 0) {
      console.log('⚠️ Nenhum usuário para notificar')
      return NextResponse.json({ message: 'Nenhum usuário para notificar' })
    }
    
    console.log(`📬 Enviando para ${users.length} usuários`)
    
    // Formatar data
    const dataFormatada = os.data_solicitacao 
      ? os.data_solicitacao.split('T')[0].split('-').reverse().join('/') 
      : new Date(os.created_at).toLocaleDateString('pt-BR')
    
    // Badge de prioridade mais chamativo
    const prioridadeBadge = os.prioridade === 'Alta' 
      ? '<span style="background: linear-gradient(45deg, #dc2626, #ef4444); color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; box-shadow: 0 4px 8px rgba(220, 38, 38, 0.3);">🚨 ALTA PRIORIDADE</span>'
      : os.prioridade === 'Média'
      ? '<span style="background: linear-gradient(45deg, #f59e0b, #fbbf24); color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; box-shadow: 0 4px 8px rgba(245, 158, 11, 0.3);">⚠️ MÉDIA PRIORIDADE</span>'
      : '<span style="background: linear-gradient(45deg, #10b981, #34d399); color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);">✅ BAIXA PRIORIDADE</span>'
    
    // Enviar para cada usuário
    const emailPromises = users.map(async (user) => {
      const sendSmtpEmail = new brevo.SendSmtpEmail()
      sendSmtpEmail.sender = { email: 'nemoov75@gmail.com', name: 'CozilTech - Sistema de Manutenção' }
      sendSmtpEmail.to = [{ email: user.email, name: user.name }]
      // Assunto mais chamativo baseado na prioridade
      const assunto = os.prioridade === 'Alta' 
        ? `🚨🚨 URGENTE! Nova OS #${os.numero_os || os.id.substring(0, 8)} - ALTA PRIORIDADE!`
        : `🔔 Nova OS #${os.numero_os || os.id.substring(0, 8)} - ${os.prioridade} Prioridade`
      
      sendSmtpEmail.subject = assunto
      sendSmtpEmail.htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
          <div style="background: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            
            <!-- Cabeçalho -->
            <div style="text-align: center; margin-bottom: 30px; background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 25px; border-radius: 10px;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🔔 Nova Ordem de Serviço</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">CozilTech - Sistema de Manutenção</p>
            </div>
            
            <!-- Alerta de Prioridade -->
            <div style="background: ${os.prioridade === 'Alta' ? '#fef2f2' : os.prioridade === 'Média' ? '#fef3c7' : '#f0fdf4'}; border-left: 4px solid ${os.prioridade === 'Alta' ? '#dc2626' : os.prioridade === 'Média' ? '#f59e0b' : '#10b981'}; padding: 15px; margin-bottom: 25px; border-radius: 5px;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-size: 14px; color: #374151;">Prioridade:</span>
                ${prioridadeBadge}
              </div>
            </div>
            
            <!-- Informações da OS -->
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">📋 Detalhes da Ordem de Serviço</h3>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600; width: 40%;">Número da OS:</td>
                  <td style="padding: 8px 0; color: #374151; font-weight: bold;">#${os.numero_os || os.id.substring(0, 8)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Solicitante:</td>
                  <td style="padding: 8px 0; color: #374151;">${os.solicitante || 'Não informado'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Setor:</td>
                  <td style="padding: 8px 0; color: #374151;">${os.setor || 'Não informado'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Data:</td>
                  <td style="padding: 8px 0; color: #374151;">${dataFormatada}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Local:</td>
                  <td style="padding: 8px 0; color: #374151;">${os.equipamento || os.local || 'Não especificado'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Tipo:</td>
                  <td style="padding: 8px 0; color: #374151;">${os.tipo_manutencao || 'Predial'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Responsável:</td>
                  <td style="padding: 8px 0; color: #374151;">${os.responsavel_setor || os.responsavelSetor || 'A definir'}</td>
                </tr>
              </table>
            </div>
            
            <!-- Descrição -->
            <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #374151; margin: 0 0 10px 0; font-size: 16px;">📝 Descrição do Problema</h3>
              <p style="color: #6b7280; margin: 0; line-height: 1.6;">${os.descricao || 'Sem descrição'}</p>
            </div>
            
            <!-- Status -->
            <div style="text-align: center; padding: 20px; background: #f0f9ff; border-radius: 8px; margin-bottom: 20px;">
              <p style="margin: 0 0 10px 0; color: #0c4a6e; font-size: 14px;">Status Atual</p>
              <span style="background: #0ea5e9; color: white; padding: 8px 20px; border-radius: 20px; font-weight: bold; font-size: 16px;">
                ${os.status || 'Pendente'}
              </span>
            </div>
            
            <!-- Fotos -->
            ${os.fotos && os.fotos.length > 0 ? `
            <div style="margin-bottom: 20px;">
              <h3 style="color: #374151; margin: 0 0 10px 0; font-size: 16px;">📷 Fotos Anexadas</h3>
              <p style="color: #6b7280; margin: 0; font-size: 14px;">${os.fotos.length} foto(s) anexada(s)</p>
            </div>
            ` : ''}
            
            <!-- Rodapé -->
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; margin: 0; font-size: 14px;">
                Este é um e-mail automático. Acesse o sistema para mais detalhes.
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
        return { success: true, email: user.email }
      } catch (error: any) {
        console.error(`❌ Erro ao enviar para ${user.email}:`, error)
        return { success: false, email: user.email, error: error.message }
      }
    })
    
    const results = await Promise.all(emailPromises)
    const successCount = results.filter(r => r.success).length
    
    console.log(`📊 E-mails enviados: ${successCount}/${users.length}`)
    
    return NextResponse.json({
      success: true,
      message: `Notificação enviada para ${successCount} usuários`,
      results
    })
    
  } catch (error: any) {
    console.error('❌ Erro ao enviar notificações:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}


