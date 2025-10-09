import { NextRequest, NextResponse } from 'next/server'
import { getArchivedOrders } from '@/lib/google-sheets'

// GET - Buscar OSs arquivadas do Google Sheets
export async function GET(request: NextRequest) {
  try {
    console.log('📖 Buscando OSs arquivadas do histórico...')
    
    // Buscar OSs do Google Sheets
    const archivedOrders = await getArchivedOrders(200) // Limitar a 200 OSs

    console.log(`✅ ${archivedOrders.length} OSs arquivadas encontradas`)
    
    return NextResponse.json({
      success: true,
      orders: archivedOrders,
      total: archivedOrders.length
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar OSs arquivadas:', error)
    return NextResponse.json({ 
      error: 'Erro ao buscar OSs arquivadas',
      details: error.message 
    }, { status: 500 })
  }
}




