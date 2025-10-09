import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Interface para os dados do cronograma
interface CronogramaData {
  equipamento: string
  local: string
  tipo_manutencao: string
  data_programada: string
  hora_programada?: string
  responsavel?: string
  prioridade: 'Baixa' | 'Média' | 'Alta'
  observacoes?: string
}

// POST - Criar nova manutenção preventiva
export async function POST(request: NextRequest) {
  try {
    const body: CronogramaData = await request.json()
    
    console.log('📅 Criando nova manutenção preventiva:', body)
    
    // Validar campos obrigatórios
    const requiredFields = ['equipamento', 'local', 'tipo_manutencao', 'data_programada']
    const missingFields = requiredFields.filter(field => !body[field as keyof CronogramaData])
    
    if (missingFields.length > 0) {
      console.log('❌ Campos obrigatórios faltando:', missingFields)
      return NextResponse.json(
        { 
          error: 'Campos obrigatórios faltando', 
          missing: missingFields 
        }, 
        { status: 400 }
      )
    }
    
    // Preparar dados para inserção
    const insertData = {
      equipamento: body.equipamento.trim(),
      local: body.local.trim(),
      tipo_manutencao: body.tipo_manutencao.trim(),
      data_programada: body.data_programada,
      hora_programada: body.hora_programada || null,
      responsavel: body.responsavel?.trim() || null,
      prioridade: body.prioridade || 'Média',
      observacoes: body.observacoes?.trim() || null,
      status: 'Agendada'
    }
    
    console.log('💾 Inserindo no Supabase:', insertData)
    
    // Verificar se a tabela existe primeiro
    const { data: tableCheck, error: tableError } = await supabase
      .from('cronograma_manutencao')
      .select('id')
      .limit(1)
    
    if (tableError) {
      console.error('❌ Tabela cronograma_manutencao não existe:', tableError)
      return NextResponse.json(
        { 
          error: 'Tabela de cronograma não existe. Execute o SQL no Supabase primeiro.',
          details: tableError.message,
          sqlFile: 'cronograma-schema.sql'
        },
        { status: 500 }
      )
    }
    
    // Inserir no Supabase
    const { data: newCronograma, error } = await supabase
      .from('cronograma_manutencao')
      .insert([insertData])
      .select()
      .single()
    
    if (error) {
      console.error('❌ Erro ao criar cronograma:', error)
      return NextResponse.json(
        { 
          error: 'Erro ao criar manutenção preventiva',
          details: error.message,
          insertData: insertData
        },
        { status: 500 }
      )
    }
    
    console.log('✅ Manutenção preventiva criada:', newCronograma)
    
    return NextResponse.json({
      success: true,
      message: 'Manutenção preventiva agendada com sucesso',
      cronograma: newCronograma
    })
    
  } catch (error) {
    console.error('❌ Erro ao processar cronograma:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

// GET - Buscar todas as manutenções preventivas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const dataInicio = searchParams.get('data_inicio')
    const dataFim = searchParams.get('data_fim')
    
    console.log('🔍 Buscando cronograma com filtros:', { status, dataInicio, dataFim })
    
    let query = supabase
      .from('cronograma_manutencao')
      .select('*')
      .order('data_programada', { ascending: true })
    
    // Aplicar filtros
    if (status) {
      query = query.eq('status', status)
    }
    
    if (dataInicio) {
      query = query.gte('data_programada', dataInicio)
    }
    
    if (dataFim) {
      query = query.lte('data_programada', dataFim)
    }
    
    const { data: cronograma, error } = await query
    
    if (error) {
      console.error('❌ Erro ao buscar cronograma:', error)
      return NextResponse.json(
        { 
          error: 'Erro ao buscar cronograma',
          details: error.message
        },
        { status: 500 }
      )
    }
    
    console.log('✅ Cronograma encontrado:', cronograma?.length || 0, 'itens')
    
    return NextResponse.json({
      success: true,
      cronograma: cronograma || [],
      total: cronograma?.length || 0
    })
    
  } catch (error) {
    console.error('❌ Erro ao buscar cronograma:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

// PUT - Atualizar manutenção preventiva
export async function PUT(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID da manutenção é obrigatório' },
        { status: 400 }
      )
    }
    
    console.log('📝 Atualizando manutenção:', id, updateData)
    
    const { data: updatedCronograma, error } = await supabase
      .from('cronograma_manutencao')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('❌ Erro ao atualizar cronograma:', error)
      return NextResponse.json(
        { 
          error: 'Erro ao atualizar manutenção',
          details: error.message
        },
        { status: 500 }
      )
    }
    
    console.log('✅ Manutenção atualizada:', updatedCronograma)
    
    return NextResponse.json({
      success: true,
      message: 'Manutenção atualizada com sucesso',
      cronograma: updatedCronograma
    })
    
  } catch (error) {
    console.error('❌ Erro ao atualizar cronograma:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

// DELETE - Deletar manutenção preventiva
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID da manutenção é obrigatório' },
        { status: 400 }
      )
    }
    
    console.log('🗑️ Deletando manutenção:', id)
    
    const { error } = await supabase
      .from('cronograma_manutencao')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('❌ Erro ao deletar cronograma:', error)
      return NextResponse.json(
        { 
          error: 'Erro ao deletar manutenção',
          details: error.message
        },
        { status: 500 }
      )
    }
    
    console.log('✅ Manutenção deletada:', id)
    
    return NextResponse.json({
      success: true,
      message: 'Manutenção deletada com sucesso'
    })
    
  } catch (error) {
    console.error('❌ Erro ao deletar cronograma:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
