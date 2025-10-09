import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Função para enviar email de conclusão
async function enviarEmailConclusao(cronograma: any) {
  try {
    // Buscar todos os usuários cadastrados para enviar notificação
    const { data: usuarios, error: usuariosError } = await supabase
      .from('users')
      .select('email, nome, setor')
    
    if (usuariosError) {
      console.error('❌ Erro ao buscar usuários:', usuariosError)
      return false
    }
    
    if (!usuarios || usuarios.length === 0) {
      console.log('⚠️ Nenhum usuário encontrado para notificação')
      return false
    }
    
    // Preparar dados do email
    const dataFormatada = new Date(cronograma.data_programada).toLocaleDateString('pt-BR')
    const horaFormatada = cronograma.hora_programada ? ` às ${cronograma.hora_programada}` : ''
    
    const assunto = `✅ Concluída: Manutenção Preventiva - ${cronograma.equipamento}`
    
    const corpoEmail = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: #16a34a; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">✅ Manutenção Preventiva Concluída</h1>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #16a34a; margin-top: 0;">Manutenção Finalizada</h2>
          
          <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #16a34a;">
              ${cronograma.equipamento}
            </p>
            <p style="margin: 5px 0 0 0; color: #666;">
              <strong>Data Programada:</strong> ${dataFormatada}${horaFormatada}
            </p>
            <p style="margin: 5px 0 0 0; color: #16a34a; font-weight: bold;">
              ✅ Status: Concluída
            </p>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
            <div>
              <h3 style="color: #374151; margin: 0 0 10px 0; font-size: 16px;">📍 Local</h3>
              <p style="margin: 0; color: #666;">${cronograma.local}</p>
            </div>
            <div>
              <h3 style="color: #374151; margin: 0 0 10px 0; font-size: 16px;">🔧 Tipo de Manutenção</h3>
              <p style="margin: 0; color: #666;">${cronograma.tipo_manutencao}</p>
            </div>
            <div>
              <h3 style="color: #374151; margin: 0 0 10px 0; font-size: 16px;">👤 Responsável</h3>
              <p style="margin: 0; color: #666;">${cronograma.responsavel || 'Não definido'}</p>
            </div>
            <div>
              <h3 style="color: #374151; margin: 0 0 10px 0; font-size: 16px;">⚡ Prioridade</h3>
              <p style="margin: 0; color: #666;">
                <span style="background-color: ${
                  cronograma.prioridade === 'Alta' ? '#fef2f2' : 
                  cronograma.prioridade === 'Média' ? '#fef3c7' : '#f0fdf4'
                }; color: ${
                  cronograma.prioridade === 'Alta' ? '#dc2626' : 
                  cronograma.prioridade === 'Média' ? '#d97706' : '#16a34a'
                }; padding: 4px 8px; border-radius: 4px; font-weight: bold;">
                  ${cronograma.prioridade}
                </span>
              </p>
            </div>
          </div>
          
          <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #16a34a; margin: 0 0 10px 0; font-size: 16px;">🎉 Manutenção Concluída com Sucesso</h3>
            <ul style="margin: 0; padding-left: 20px; color: #666;">
              <li>A manutenção preventiva foi <strong>finalizada com sucesso</strong></li>
              <li>O equipamento está <strong>funcionando normalmente</strong></li>
              <li>Próxima manutenção deve ser agendada conforme cronograma</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://cozil-gm.vercel.app/" 
               style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Acessar Sistema
            </a>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center; color: #6b7280; font-size: 14px;">
            <p style="margin: 0;">Este é um notificação automática do sistema Cozil-Maintenanc</p>
            <p style="margin: 5px 0 0 0;">Para mais informações, acesse o sistema de manutenção</p>
          </div>
        </div>
      </div>
    `
    
    // Enviar email para cada usuário
    for (const usuario of usuarios) {
      try {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: usuario.email,
            subject: assunto,
            html: corpoEmail,
            nome: usuario.nome,
            tipo: 'conclusao_cronograma'
          })
        })
        
        if (!response.ok) {
          console.error(`❌ Erro ao enviar email para ${usuario.email}:`, response.statusText)
        } else {
          console.log(`✅ Email de conclusão enviado para ${usuario.email}`)
        }
      } catch (error) {
        console.error(`❌ Erro ao enviar email para ${usuario.email}:`, error)
      }
    }
    
    return true
    
  } catch (error) {
    console.error('❌ Erro ao enviar email de conclusão:', error)
    return false
  }
}

// POST - Notificar conclusão de manutenção
export async function POST(request: NextRequest) {
  try {
    const { cronogramaId } = await request.json()
    
    if (!cronogramaId) {
      return NextResponse.json(
        { error: 'ID do cronograma é obrigatório' },
        { status: 400 }
      )
    }
    
    console.log('📧 Enviando notificação de conclusão para:', cronogramaId)
    
    // Buscar dados do cronograma
    const { data: cronograma, error } = await supabase
      .from('cronograma_manutencao')
      .select('*')
      .eq('id', cronogramaId)
      .single()
    
    if (error) {
      console.error('❌ Erro ao buscar cronograma:', error)
      return NextResponse.json(
        { 
          error: 'Erro ao buscar dados da manutenção',
          details: error.message
        },
        { status: 500 }
      )
    }
    
    if (!cronograma) {
      return NextResponse.json(
        { error: 'Manutenção não encontrada' },
        { status: 404 }
      )
    }
    
    // Enviar email de conclusão
    const sucesso = await enviarEmailConclusao(cronograma)
    
    if (!sucesso) {
      return NextResponse.json(
        { error: 'Erro ao enviar notificação de conclusão' },
        { status: 500 }
      )
    }
    
    console.log('✅ Notificação de conclusão enviada com sucesso')
    
    return NextResponse.json({
      success: true,
      message: 'Notificação de conclusão enviada com sucesso'
    })
    
  } catch (error) {
    console.error('❌ Erro ao processar notificação de conclusão:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
