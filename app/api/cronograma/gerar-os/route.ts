import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST - Gerar OS automaticamente a partir do cronograma
export async function POST(request: NextRequest) {
  try {
    const { cronogramaId } = await request.json()
    
    if (!cronogramaId) {
      return NextResponse.json(
        { error: 'ID do cronograma é obrigatório' },
        { status: 400 }
      )
    }
    
    console.log('🔧 Gerando OS a partir do cronograma:', cronogramaId)
    
    // Buscar dados do cronograma
    const { data: cronograma, error: cronogramaError } = await supabase
      .from('cronograma_manutencao')
      .select('*')
      .eq('id', cronogramaId)
      .single()
    
    if (cronogramaError || !cronograma) {
      console.error('❌ Erro ao buscar cronograma:', cronogramaError)
      return NextResponse.json(
        { error: 'Cronograma não encontrado' },
        { status: 404 }
      )
    }
    
    // Verificar se já existe OS gerada
    if (cronograma.os_gerada_id) {
      console.log('⚠️ OS já foi gerada para este cronograma:', cronograma.os_gerada_id)
      return NextResponse.json({
        success: true,
        message: 'OS já foi gerada anteriormente',
        os_id: cronograma.os_gerada_id
      })
    }
    
    // Gerar número da OS
    const generateOSNumber = () => {
      const year = new Date().getFullYear()
      const month = String(new Date().getMonth() + 1).padStart(2, '0')
      const day = String(new Date().getDate()).padStart(2, '0')
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
      return `OS-${year}${month}${day}-${random}`
    }
    
    // Preparar dados da OS
    const osData = {
      solicitante: cronograma.responsavel || 'Sistema de Cronograma',
      setor: 'Manutenção Preventiva',
      data_solicitacao: new Date().toISOString().split('T')[0],
      local: cronograma.local,
      prioridade: cronograma.prioridade,
      tipo_manutencao: cronograma.tipo_manutencao,
      descricao: `MANUTENÇÃO PREVENTIVA PROGRAMADA\n\nEquipamento: ${cronograma.equipamento}\nTipo: ${cronograma.tipo_manutencao}\nData Programada: ${cronograma.data_programada}\nHorário: ${cronograma.hora_programada || 'Não definido'}\n\nObservações do Cronograma:\n${cronograma.observacoes || 'Nenhuma observação'}`,
      responsavel_setor: cronograma.responsavel || 'Sistema de Cronograma',
      numero_os: generateOSNumber(),
      status: 'Em Andamento',
      fotos: []
    }
    
    console.log('💾 Criando OS:', osData)
    
    // Criar OS no Supabase
    const { data: newOS, error: osError } = await supabase
      .from('work_orders')
      .insert([osData])
      .select()
      .single()
    
    if (osError) {
      console.error('❌ Erro ao criar OS:', osError)
      return NextResponse.json(
        { 
          error: 'Erro ao criar OS',
          details: osError.message
        },
        { status: 500 }
      )
    }
    
    console.log('✅ OS criada:', newOS)
    
    // Atualizar cronograma com ID da OS gerada
    const { error: updateError } = await supabase
      .from('cronograma_manutencao')
      .update({ 
        os_gerada_id: newOS.id,
        status: 'Em Andamento'
      })
      .eq('id', cronogramaId)
    
    if (updateError) {
      console.error('⚠️ Erro ao atualizar cronograma:', updateError)
      // Não retornar erro, pois a OS foi criada com sucesso
    }
    
    // Enviar notificação por email
    try {
      console.log('📧 Enviando notificação de OS gerada...')
      const notificationResponse = await fetch(`${request.nextUrl.origin}/api/send-os-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ osId: newOS.id })
      })
      
      if (notificationResponse.ok) {
        console.log('✅ Notificação de OS enviada')
      } else {
        console.error('⚠️ Erro ao enviar notificação')
      }
    } catch (notifError) {
      console.error('⚠️ Erro ao enviar notificação:', notifError)
    }
    
    // Sincronizar com Google Sheets
    try {
      console.log('📊 Sincronizando com Google Sheets...')
      const syncResponse = await fetch(`${request.nextUrl.origin}/api/sync-sheets`, {
        method: 'POST',
      })
      
      if (syncResponse.ok) {
        console.log('✅ Google Sheets sincronizado')
      } else {
        console.error('⚠️ Erro ao sincronizar Sheets')
      }
    } catch (syncError) {
      console.error('⚠️ Erro ao sincronizar Sheets:', syncError)
    }
    
    return NextResponse.json({
      success: true,
      message: 'OS gerada com sucesso a partir do cronograma',
      os: newOS,
      cronograma_id: cronogramaId
    })
    
  } catch (error) {
    console.error('❌ Erro ao gerar OS:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

// GET - Listar cronogramas que podem gerar OS
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Buscando cronogramas que podem gerar OS...')
    
    // Buscar cronogramas que ainda não geraram OS
    const { data: cronogramas, error } = await supabase
      .from('cronograma_manutencao')
      .select('*')
      .is('os_gerada_id', null)
      .in('status', ['Agendada', 'Atrasada'])
      .order('data_programada', { ascending: true })
    
    if (error) {
      console.error('❌ Erro ao buscar cronogramas:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar cronogramas' },
        { status: 500 }
      )
    }
    
    console.log('✅ Cronogramas encontrados:', cronogramas?.length || 0)
    
    return NextResponse.json({
      success: true,
      cronogramas: cronogramas || [],
      total: cronogramas?.length || 0
    })
    
  } catch (error) {
    console.error('❌ Erro ao buscar cronogramas:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
