import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// DELETE - Deletar uma Ordem de Serviço
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const osId = searchParams.get('id')
    
    if (!osId) {
      return NextResponse.json({ error: 'ID da OS é obrigatório' }, { status: 400 })
    }

    console.log('🗑️ Deletando OS:', osId)
    
    // Deletar do Supabase
    const { error } = await supabase
      .from('work_orders')
      .delete()
      .eq('id', osId)
    
    if (error) {
      console.error('❌ Erro ao deletar OS:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    console.log('✅ OS deletada com sucesso')
    return NextResponse.json({ success: true, message: 'OS deletada com sucesso' })
    
  } catch (error: any) {
    console.error('❌ Erro ao deletar OS:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

