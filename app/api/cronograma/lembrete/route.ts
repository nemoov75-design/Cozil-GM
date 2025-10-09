import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST - Enviar lembretes automáticos
export async function POST(request: NextRequest) {
  try {
    console.log('⏰ Verificando lembretes de manutenção preventiva...')
    
    const hoje = new Date()
    const hojeStr = hoje.toISOString().split('T')[0]
    
    // Buscar manutenções que precisam de lembretes
    const { data: manutencoes, error } = await supabase
      .from('cronograma_manutencao')
      .select('*')
      .in('status', ['Agendada', 'Atrasada'])
      .lte('data_programada', hojeStr)
      .order('data_programada', { ascending: true })
    
    if (error) {
      console.error('❌ Erro ao buscar manutenções:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar manutenções' },
        { status: 500 }
      )
    }
    
    if (!manutencoes || manutencoes.length === 0) {
      console.log('✅ Nenhuma manutenção precisa de lembrete hoje')
      return NextResponse.json({
        success: true,
        message: 'Nenhuma manutenção precisa de lembrete hoje',
        lembretes_enviados: 0
      })
    }
    
    console.log(`📅 Encontradas ${manutencoes.length} manutenções para lembrete`)
    
    // Buscar usuários que recebem notificações
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .eq('active', true)
      .eq('receive_notifications', true)
    
    if (usersError || !users || users.length === 0) {
      console.log('⚠️ Nenhum usuário para notificar')
      return NextResponse.json({
        success: true,
        message: 'Nenhum usuário para notificar',
        lembretes_enviados: 0
      })
    }
    
    console.log(`📧 Enviando lembretes para ${users.length} usuários`)
    
    // Enviar lembretes para cada manutenção
    let lembretesEnviados = 0
    
    for (const manutencao of manutencoes) {
      try {
        // Determinar tipo de lembrete baseado na data
        const dataManutencao = new Date(manutencao.data_programada)
        const diasRestantes = Math.ceil((dataManutencao.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
        
        let tipoLembrete = ''
        let assunto = ''
        let corpo = ''
        
        if (diasRestantes < 0) {
          // Atrasada
          tipoLembrete = 'atrasada'
          assunto = `🚨 MANUTENÇÃO ATRASADA - ${manutencao.equipamento}`
          corpo = `
            <h2>🚨 MANUTENÇÃO ATRASADA</h2>
            <p><strong>Equipamento:</strong> ${manutencao.equipamento}</p>
            <p><strong>Local:</strong> ${manutencao.local}</p>
            <p><strong>Data Programada:</strong> ${manutencao.data_programada}</p>
            <p><strong>Dias de Atraso:</strong> ${Math.abs(diasRestantes)} dias</p>
            <p><strong>Prioridade:</strong> ${manutencao.prioridade}</p>
            <p><strong>Responsável:</strong> ${manutencao.responsavel || 'Não definido'}</p>
            <p><strong>Observações:</strong> ${manutencao.observacoes || 'Nenhuma'}</p>
            <br>
            <p style="color: red; font-weight: bold;">⚠️ ATENÇÃO: Esta manutenção está atrasada e precisa ser executada urgentemente!</p>
          `
        } else if (diasRestantes === 0) {
          // Hoje
          tipoLembrete = 'hoje'
          assunto = `📅 MANUTENÇÃO HOJE - ${manutencao.equipamento}`
          corpo = `
            <h2>📅 MANUTENÇÃO PROGRAMADA PARA HOJE</h2>
            <p><strong>Equipamento:</strong> ${manutencao.equipamento}</p>
            <p><strong>Local:</strong> ${manutencao.local}</p>
            <p><strong>Horário:</strong> ${manutencao.hora_programada || 'Não definido'}</p>
            <p><strong>Prioridade:</strong> ${manutencao.prioridade}</p>
            <p><strong>Responsável:</strong> ${manutencao.responsavel || 'Não definido'}</p>
            <p><strong>Observações:</strong> ${manutencao.observacoes || 'Nenhuma'}</p>
            <br>
            <p style="color: blue; font-weight: bold;">✅ Lembrete: Esta manutenção está programada para hoje!</p>
          `
        } else if (diasRestantes === 1) {
          // Amanhã
          tipoLembrete = 'amanha'
          assunto = `⏰ MANUTENÇÃO AMANHÃ - ${manutencao.equipamento}`
          corpo = `
            <h2>⏰ MANUTENÇÃO PROGRAMADA PARA AMANHÃ</h2>
            <p><strong>Equipamento:</strong> ${manutencao.equipamento}</p>
            <p><strong>Local:</strong> ${manutencao.local}</p>
            <p><strong>Data:</strong> ${manutencao.data_programada}</p>
            <p><strong>Horário:</strong> ${manutencao.hora_programada || 'Não definido'}</p>
            <p><strong>Prioridade:</strong> ${manutencao.prioridade}</p>
            <p><strong>Responsável:</strong> ${manutencao.responsavel || 'Não definido'}</p>
            <p><strong>Observações:</strong> ${manutencao.observacoes || 'Nenhuma'}</p>
            <br>
            <p style="color: orange; font-weight: bold;">⏰ Lembrete: Esta manutenção está programada para amanhã!</p>
          `
        } else if (diasRestantes <= 7) {
          // Próxima semana
          tipoLembrete = 'proxima_semana'
          assunto = `📅 MANUTENÇÃO EM ${diasRestantes} DIAS - ${manutencao.equipamento}`
          corpo = `
            <h2>📅 MANUTENÇÃO PROGRAMADA</h2>
            <p><strong>Equipamento:</strong> ${manutencao.equipamento}</p>
            <p><strong>Local:</strong> ${manutencao.local}</p>
            <p><strong>Data:</strong> ${manutencao.data_programada}</p>
            <p><strong>Dias restantes:</strong> ${diasRestantes} dias</p>
            <p><strong>Prioridade:</strong> ${manutencao.prioridade}</p>
            <p><strong>Responsável:</strong> ${manutencao.responsavel || 'Não definido'}</p>
            <p><strong>Observações:</strong> ${manutencao.observacoes || 'Nenhuma'}</p>
            <br>
            <p style="color: green; font-weight: bold;">📅 Lembrete: Esta manutenção está programada para os próximos dias!</p>
          `
        } else {
          // Muito longe, pular
          continue
        }
        
        // Enviar email para todos os usuários
        for (const user of users) {
          try {
            const emailResponse = await fetch(`${request.nextUrl.origin}/api/send-email`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                to: user.email,
                subject: assunto,
                html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
                    <div style="background: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                      <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #dc2626; margin: 0;">🔧 CozilTech - Cronograma de Manutenção</h1>
                        <p style="color: #6b7280; margin: 10px 0 0 0;">Sistema de Manutenção Preventiva</p>
                      </div>
                      
                      ${corpo}
                      
                      <div style="margin-top: 30px; padding: 20px; background: #f3f4f6; border-radius: 8px;">
                        <h3 style="margin: 0 0 10px 0; color: #374151;">📋 Ações Recomendadas:</h3>
                        <ul style="margin: 0; padding-left: 20px; color: #6b7280;">
                          <li>Verificar disponibilidade do equipamento</li>
                          <li>Confirmar com o responsável técnico</li>
                          <li>Preparar materiais necessários</li>
                          <li>Agendar horário específico se necessário</li>
                        </ul>
                      </div>
                      
                      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                        <p style="color: #9ca3af; font-size: 14px; margin: 0;">
                          Este é um lembrete automático do sistema CozilTech
                        </p>
                      </div>
                    </div>
                  </div>
                `
              })
            })
            
            if (emailResponse.ok) {
              lembretesEnviados++
              console.log(`✅ Lembrete enviado para ${user.email} - ${tipoLembrete}`)
            } else {
              console.error(`❌ Erro ao enviar lembrete para ${user.email}`)
            }
          } catch (emailError) {
            console.error(`❌ Erro ao enviar email para ${user.email}:`, emailError)
          }
        }
        
        // Atualizar status se estiver atrasada
        if (diasRestantes < 0) {
          await supabase
            .from('cronograma_manutencao')
            .update({ status: 'Atrasada' })
            .eq('id', manutencao.id)
        }
        
      } catch (manutencaoError) {
        console.error(`❌ Erro ao processar manutenção ${manutencao.id}:`, manutencaoError)
      }
    }
    
    console.log(`✅ Lembretes enviados: ${lembretesEnviados}`)
    
    return NextResponse.json({
      success: true,
      message: 'Lembretes processados com sucesso',
      lembretes_enviados: lembretesEnviados,
      manutencoes_processadas: manutencoes.length
    })
    
  } catch (error) {
    console.error('❌ Erro ao processar lembretes:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
