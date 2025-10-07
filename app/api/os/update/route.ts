import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Atualizar campos de uma OS (exceto status, que tem rota própria)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🔄 API Update - Dados recebidos:', body)
    
    const { osId, updates } = body as { osId?: string; updates?: Record<string, any> }

    if (!osId || !updates || typeof updates !== 'object') {
      console.log('❌ Parâmetros inválidos:', { osId, updates })
      return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 })
    }

    // Permitir apenas campos conhecidos
    const allowedFields = new Set([
      'setor',
      'equipamento',
      'tipo_manutencao',
      'prioridade',
      'descricao',
      'solicitante',
      'responsavel_setor',
      'fotos',
      'data',
      'data_solicitacao'
    ])

    const updateData: Record<string, any> = {}
    Object.entries(updates).forEach(([key, value]) => {
      if (allowedFields.has(key)) {
        // Se o campo for 'data', converter para 'data_solicitacao'
        const fieldName = key === 'data' ? 'data_solicitacao' : key
        updateData[fieldName] = value
      }
    })

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Nenhum campo permitido para atualizar' }, { status: 400 })
    }

    console.log('💾 Tentando atualizar OS:', { osId, updateData })
    
    const { data: updated, error } = await supabase
      .from('work_orders')
      .update(updateData)
      .eq('id', osId)
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao atualizar OS no Supabase:', error)
      return NextResponse.json({ 
        error: 'Erro ao atualizar OS', 
        details: error.message,
        code: error.code,
        hint: error.hint 
      }, { status: 500 })
    }

    console.log('✅ OS atualizada com sucesso:', updated)
    
    // 🔄 Sincronizar automaticamente com Google Sheets
    try {
      console.log('📊 Sincronizando com Google Sheets...')
      const syncResponse = await fetch(`${request.nextUrl.origin}/api/sync-sheets`, {
        method: 'POST',
      })
      
      if (syncResponse.ok) {
        console.log('✅ Google Sheets sincronizado')
      }
    } catch (syncError) {
      console.error('⚠️ Erro ao sincronizar Sheets:', syncError)
    }
    
    return NextResponse.json({ success: true, os: updated })
  } catch (error: any) {
    return NextResponse.json({ error: 'Erro interno do servidor', details: error.message }, { status: 500 })
  }
}


