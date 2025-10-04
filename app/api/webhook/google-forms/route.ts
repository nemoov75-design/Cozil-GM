import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Log para debug
    console.log('Dados recebidos do Google Forms:', body)
    
    // Extrair dados do formulário
    const formData = {
      solicitante: body.solicitante || '',
      setor: body.setor || '',
      data_solicitacao: body.data_solicitacao || new Date().toISOString(),
      local: body.local || '',
      prioridade: body.prioridade || 'Média',
      tipo_manutencao: body.tipo_manutencao || 'Predial',
      descricao: body.descricao || '',
      status: 'Pendente',
      created_at: new Date().toISOString(),
      last_updated: new Date().toISOString(),
      status_history: [{
        status: 'Pendente',
        timestamp: new Date().toISOString(),
        user: 'Sistema'
      }]
    }
    
    // Inserir no Supabase
    const { data, error } = await supabase
      .from('work_orders')
      .insert([formData])
      .select()
    
    if (error) {
      console.error('Erro ao inserir no Supabase:', error)
      return NextResponse.json(
        { error: 'Erro ao salvar dados' },
        { status: 500 }
      )
    }
    
    console.log('Dados salvos com sucesso:', data)
    
    return NextResponse.json({
      success: true,
      message: 'Dados salvos com sucesso',
      data: data[0]
    })
    
  } catch (error) {
    console.error('Erro no webhook:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Permitir apenas POST
export async function GET() {
  return NextResponse.json(
    { error: 'Método não permitido' },
    { status: 405 }
  )
}