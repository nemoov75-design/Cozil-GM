import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'

// Credenciais do Google Sheets
const GOOGLE_CREDENTIALS = {
  client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL || "planilha-zap@trans-anchor-461419-m8.iam.gserviceaccount.com",
  private_key: (process.env.GOOGLE_SHEETS_PRIVATE_KEY || "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDgxaRVSwG5BHxL\nUHl5J0iMZxPQr4yR5Z4ibfYfoDgmRiDR8rnvmA9/z+XkUoixx6lYUUzHrtBebvm0\nb/NBGUHspw68pPxYyu11NB9PmxSslW5wJLUULJaP5GYOW9Uoa+stLDiGsy5cs06j\nkC6S//VRErTFYaG/hH0rrvZ4yXRvNAtiyU5H+EFnbbuZu+1OMdE/s3qT0xKBSmW0\nMtBxfZs7a2T8/UjcI8FHlknS6k5lwvPffsi14YgoegLekbuSzAPVtp6Oaw3wpsOv\nISDB+3NlSQLF4huBnGrqPKuk4k4Qiagfb5nlAxlXix/vgoeRzLYT2EPhVa2SpaZB\nDFf2l8XnAgMBAAECggEAF10ZOfpsHpYI8MUtKJA873HZcpmExDeOFT3BKxllghOh\nCWGwZ7yybmfRmXGQyYtGSYADOfBXCAcuB84+hpeVrX/R6CmYHLH/Nm2+tsYZGIqx\n1OX5N98d9AKwLwbm+bwkpmiQeZk6FPhYZhJbHPw5EikecYk2nb3WSvT1TqnWDfw0\n0gQMJ7yh2Nvae7VK0r11A8rbQW2iLjVONiloEBfczWJka6JKzFEhejtbjUKGAwJk\n3AMDfPRAxZeqEdZbB9wkbEY3ujRICnIO65yeUqfySIahm4XEkPVRynnUoDPvLBj5\nAiVoUr7pPLKrG3AdoE2nwbnV8y98qZ2Yw2YqPlb86QKBgQD8Wwv8CWlyCn5UJVDY\nykjwaUIPAqgH78sO2BoM6x3JhrCNyPZ/tgA1c3EBaz4J0u1vFEOUdxgqFB+1TLYr\nA3aiuM2QWb78EQ7xAK526yCJVUzmJ/zHwbZq5w94lknm6tmFjAr/q0aVXhDt6I8B\n7hYYb7JKRrkDTlirI6DzcKfayQKBgQDkBJ5+PVnLVG2nOBk8gvJ2zZdxYZijhJVA\nWCsYIsjIlWZWVBliUF/+q+j85XzBu1+qxZYnTNuA+M8jiv1Y/w1D/EX1gZdpFm/k\nqDB84izian4lPei7JfNjTLptRe3qCvUCNXPuDdjNHpp9dVib/XGBFcLdOWBmJ+Fw\nM4aAS2RDLwKBgDmCKiYCoxQJDibw5g6xcpPO+O3gxhgg7l5wouckwYIGfr+g94O9\nHykPKMaRAO9OMSuqK4hu54PXWC6Bz9XXkTad9MKboSliXcxQQnH5PU3usXqVzEZd\nf8u24lCxtx+3j2CevHbtOkWZzTPaVpSzBDgHZFMG8Oyu8wf1M52mo6n5AoGARpt/\nkMvisGn2gp+GgQxzlIJZcQytvYTiysgCoDi1QBezVuw36A/Hig8l2JofpcYl+7Wv\np3/PQQLK8dCqXxKrwu+tojZ88le2UnIagbFwALTFVzbyiHFaCtfJqujKoXy/He37\ndi3ngq0FXfAmfjdfHH/mlaacyUV0M9Bgx/2QkJUCgYEAzNHu0bDdEEtOU2G706Oc\nz5cV2xxm0mrFr580Qd4NMgb7zfMPd3GJAw5V/XBz2BgyblwVZqCt93rmc3ep/zUf\nugoqstlwyb4RiPV92zKxGURt9dOUEtD5SgvlXBidYylWwzY9cgP1bMIQG8OzLBL7\n9zhcaAz4MdTSyzSevGF5aF0=\n-----END PRIVATE KEY-----\n").replace(/\\n/g, '\n'),
}

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || "1bmM5tuSnxHXEsgsvxMCQBOdjCcMzwSvhoB12uhstpG8"

// DELETE - Deletar uma Ordem de Serviço
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const osId = searchParams.get('id')
    
    if (!osId) {
      return NextResponse.json({ error: 'ID da OS é obrigatório' }, { status: 400 })
    }

    console.log('🗑️ Deletando OS com ID:', osId, 'tipo:', typeof osId)
    
    // 1. Buscar a OS antes de deletar (para pegar o numero_os)
    const { data: osData, error: fetchError } = await supabase
      .from('work_orders')
      .select('*')
      .eq('id', osId)
      .single()
    
    if (fetchError || !osData) {
      console.error('❌ OS não encontrada:', fetchError)
      return NextResponse.json({ error: 'OS não encontrada: ' + (fetchError?.message || 'Não existe') }, { status: 404 })
    }

    console.log('📋 OS encontrada:', osData)
    const numeroOS = osData.numero_os

    // 2. Deletar do Supabase
    const { error: deleteError } = await supabase
      .from('work_orders')
      .delete()
      .eq('id', osId)
    
    if (deleteError) {
      console.error('❌ Erro ao deletar OS do Supabase:', deleteError)
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }
    
    console.log('✅ OS deletada do Supabase com sucesso!')

    // 3. Deletar do Google Sheets
    try {
      const serviceAccountAuth = new JWT({
        email: GOOGLE_CREDENTIALS.client_email,
        key: GOOGLE_CREDENTIALS.private_key,
        scopes: [
          'https://www.googleapis.com/auth/spreadsheets',
          'https://www.googleapis.com/auth/drive.file',
        ],
      })

      const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth)
      await doc.loadInfo()

      // Tentar deletar da aba "Ativas"
      const sheetAtivas = doc.sheetsByTitle['📋 Ordens Ativas'] || doc.sheetsByIndex[0]
      if (sheetAtivas) {
        await sheetAtivas.loadCells()
        const rows = await sheetAtivas.getRows()
        
        // Procurar e deletar a linha com o número da OS
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].get('Número OS') === numeroOS) {
            await rows[i].delete()
            console.log('✅ OS deletada do Google Sheets (Ativas)')
            break
          }
        }
      }

      // Tentar deletar da aba "Histórico" se existir
      const sheetHistorico = doc.sheetsByTitle['📜 Histórico Completo']
      if (sheetHistorico) {
        await sheetHistorico.loadCells()
        const rows = await sheetHistorico.getRows()
        
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].get('Número OS') === numeroOS) {
            await rows[i].delete()
            console.log('✅ OS deletada do Google Sheets (Histórico)')
            break
          }
        }
      }
    } catch (sheetsError) {
      console.error('⚠️ Erro ao deletar do Google Sheets (não crítico):', sheetsError)
      // Não retornar erro aqui pois a OS já foi deletada do Supabase
    }
    
    console.log('✅ OS deletada com sucesso de todos os lugares')
    return NextResponse.json({ success: true, message: 'OS deletada com sucesso' })
    
  } catch (error: any) {
    console.error('❌ Erro ao deletar OS:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

