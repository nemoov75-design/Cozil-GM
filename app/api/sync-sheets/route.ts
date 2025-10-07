import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { syncToGoogleSheets } from '@/lib/google-sheets'

export async function POST(request: NextRequest) {
  try {
    console.log('📊 Iniciando sincronização com Google Sheets...')
    
    // Buscar OSs do Supabase
    const { data: orders, error } = await supabase
      .from('work_orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Erro ao buscar OSs:', error)
      return NextResponse.json({ 
        success: false,
        error: 'Erro ao buscar dados do Supabase' 
      }, { status: 500 })
    }

    console.log(`📦 ${orders.length} OSs encontradas no Supabase`)

    // Sincronizar com Google Sheets
    const result = await syncToGoogleSheets(orders)

    console.log(`✅ Sincronização concluída: ${result.totalOSs} OSs`)

    return NextResponse.json({
      success: true,
      message: `${result.totalOSs} OSs sincronizadas com sucesso!`,
      spreadsheetUrl: result.spreadsheetUrl,
      totalOSs: result.totalOSs
    })

  } catch (error: any) {
    console.error('❌ Erro na sincronização:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Erro desconhecido',
    }, { status: 500 })
  }
}

// GET para verificar status
export async function GET() {
  return NextResponse.json({
    status: 'online',
    message: 'API de sincronização do Google Sheets ativa'
  })
}
