import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST - Atualizar status da OS
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { osId, status } = body
    
    console.log('🔄 API Update Status - Dados recebidos:', { osId, status });
    
    if (!osId || !status) {
      console.log('❌ API Update Status - Campos obrigatórios faltando');
      return NextResponse.json(
        { error: 'ID da OS e status são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar a OS atual
    console.log('🔍 Buscando OS com ID:', osId);
    
    // Primeiro, tentar buscar por ID
    let { data: currentOS, error: fetchError } = await supabase
      .from('work_orders')
      .select('*')
      .eq('id', osId)
      .single()
    
    console.log('📋 Resultado da busca por ID:', { currentOS, fetchError });
    
    // Se não encontrou por ID, tentar buscar por numero_os
    if (fetchError || !currentOS) {
      console.log('🔄 Tentando buscar por numero_os...');
      const { data: currentOSByNumber, error: fetchErrorByNumber } = await supabase
        .from('work_orders')
        .select('*')
        .eq('numero_os', osId)
        .single()
      
      console.log('📋 Resultado da busca por numero_os:', { currentOSByNumber, fetchErrorByNumber });
      
      if (currentOSByNumber) {
        currentOS = currentOSByNumber;
        fetchError = null;
      }
    }
    
    if (fetchError || !currentOS) {
      console.log('❌ OS não encontrada. Erro:', fetchError);
      return NextResponse.json(
        { error: 'OS não encontrada', details: fetchError?.message },
        { status: 404 }
      )
    }

    // Preparar dados para atualização (mínimo possível)
    const updateData: any = {
      status: status
    }
    
    console.log('🔍 OS encontrada:', {
      id: currentOS.id,
      numero_os: currentOS.numero_os,
      status_atual: currentOS.status,
      campos_disponiveis: Object.keys(currentOS)
    });

    // Atualizar no Supabase
    console.log('💾 Dados para atualização:', updateData);
    
    try {
      const { data: updatedOS, error: updateError } = await supabase
        .from('work_orders')
        .update(updateData)
        .eq('id', currentOS.id)  // Usar o ID da OS encontrada
        .select()
        .single()

      console.log('📋 Resultado da atualização:', { updatedOS, updateError });

      if (updateError) {
        console.error('❌ Erro ao atualizar OS:', updateError)
        
        // Tentar uma abordagem alternativa - usar numero_os
        console.log('🔄 Tentando atualizar por numero_os...');
        const { data: updatedOS2, error: updateError2 } = await supabase
          .from('work_orders')
          .update(updateData)
          .eq('numero_os', currentOS.numero_os)
          .select()
          .single()
        
        console.log('📋 Resultado da segunda tentativa:', { updatedOS2, updateError2 });
        
        if (updateError2) {
          return NextResponse.json(
            { error: 'Erro ao atualizar OS no banco de dados', details: updateError2.message },
            { status: 500 }
          )
        }
        
        return NextResponse.json({
          success: true,
          message: `Status atualizado para: ${status}`,
          os: updatedOS2
        })
      }
      
      return NextResponse.json({
        success: true,
        message: `Status atualizado para: ${status}`,
        os: updatedOS
      })
      
    } catch (error) {
      console.error('❌ Erro geral na atualização:', error)
      return NextResponse.json(
        { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Erro ao atualizar status da OS:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}