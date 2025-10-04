import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Testar conexão com Supabase
    const { data, error } = await supabase
      .from('work_orders')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('Erro ao conectar com Supabase:', error)
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Conexão com Supabase funcionando!',
      data: data
    })
    
  } catch (error) {
    console.error('Erro no teste:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
      details: error
    })
  }
}

export async function POST() {
  try {
    // Testar inserção no Supabase
    const testData = {
      solicitante: 'Teste Sistema',
      setor: 'TI',
      data_solicitacao: new Date().toISOString(),
      local: 'Sala de Teste',
      prioridade: 'Média',
      tipo_manutencao: 'Predial',
      descricao: 'Teste de integração do sistema',
      status: 'Pendente',
      created_at: new Date().toISOString(),
      last_updated: new Date().toISOString(),
      status_history: [{
        status: 'Pendente',
        timestamp: new Date().toISOString(),
        user: 'Sistema'
      }]
    }
    
    const { data, error } = await supabase
      .from('work_orders')
      .insert([testData])
      .select()
    
    if (error) {
      console.error('Erro ao inserir no Supabase:', error)
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Teste de inserção no Supabase funcionando!',
      data: data[0]
    })
    
  } catch (error) {
    console.error('Erro no teste de inserção:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor',
      details: error
    })
  }
}
