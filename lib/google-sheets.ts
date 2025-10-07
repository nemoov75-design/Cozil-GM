// 🛡️ SISTEMA DE ARQUIVO INTELIGENTE COM ZERO PERDA DE DADOS
// Biblioteca para integração com Google Sheets
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { JWT } from 'google-auth-library'
import { supabase } from '@/lib/supabase'

// Credenciais do Google Service Account
const GOOGLE_CREDENTIALS = {
  client_email: "planilha-zap@trans-anchor-461419-m8.iam.gserviceaccount.com",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDgxaRVSwG5BHxL\nUHl5J0iMZxPQr4yR5Z4ibfYfoDgmRiDR8rnvmA9/z+XkUoixx6lYUUzHrtBebvm0\nb/NBGUHspw68pPxYyu11NB9PmxSslW5wJLUULJaP5GYOW9Uoa+stLDiGsy5cs06j\nkC6S//VRErTFYaG/hH0rrvZ4yXRvNAtiyU5H+EFnbbuZu+1OMdE/s3qT0xKBSmW0\nMtBxfZs7a2T8/UjcI8FHlknS6k5lwvPffsi14YgoegLekbuSzAPVtp6Oaw3wpsOv\nISDB+3NlSQLF4huBnGrqPKuk4k4Qiagfb5nlAxlXix/vgoeRzLYT2EPhVa2SpaZB\nDFf2l8XnAgMBAAECggEAF10ZOfpsHpYI8MUtKJA873HZcpmExDeOFT3BKxllghOh\nCWGwZ7yybmfRmXGQyYtGSYADOfBXCAcuB84+hpeVrX/R6CmYHLH/Nm2+tsYZGIqx\n1OX5N98d9AKwLwbm+bwkpmiQeZk6FPhYZhJbHPw5EikecYk2nb3WSvT1TqnWDfw0\n0gQMJ7yh2Nvae7VK0r11A8rbQW2iLjVONiloEBfczWJka6JKzFEhejtbjUKGAwJk\n3AMDfPRAxZeqEdZbB9wkbEY3ujRICnIO65yeUqfySIahm4XEkPVRynnUoDPvLBj5\nAiVoUr7pPLKrG3AdoE2nwbnV8y98qZ2Yw2YqPlb86QKBgQD8Wwv8CWlyCn5UJVDY\nykjwaUIPAqgH78sO2BoM6x3JhrCNyPZ/tgA1c3EBaz4J0u1vFEOUdxgqFB+1TLYr\nA3aiuM2QWb78EQ7xAK526yCJVUzmJ/zHwbZq5w94lknm6tmFjAr/q0aVXhDt6I8B\n7hYYb7JKRrkDTlirI6DzcKfayQKBgQDkBJ5+PVnLVG2nOBk8gvJ2zZdxYZijhJVA\nWCsYIsjIlWZWVBliUF/+q+j85XzBu1+qxZYnTNuA+M8jiv1Y/w1D/EX1gZdpFm/k\nqDB84izian4lPei7JfNjTLptRe3qCvUCNXPuDdjNHpp9dVib/XGBFcLdOWBmJ+Fw\nM4aAS2RDLwKBgDmCKiYCoxQJDibw5g6xcpPO+O3gxhgg7l5wouckwYIGfr+g94O9\nHykPKMaRAO9OMSuqK4hu54PXWC6Bz9XXkTad9MKboSliXcxQQnH5PU3usXqVzEZd\nf8u24lCxtx+3j2CevHbtOkWZzTPaVpSzBDgHZFMG8Oyu8wf1M52mo6n5AoGARpt/\nkMvisGn2gp+GgQxzlIJZcQytvYTiysgCoDi1QBezVuw36A/Hig8l2JofpcYl+7Wv\np3/PQQLK8dCqXxKrwu+tojZ88le2UnIagbFwALTFVzbyiHFaCtfJqujKoXy/He37\ndi3ngq0FXfAmfjdfHH/mlaacyUV0M9Bgx/2QkJUCgYEAzNHu0bDdEEtOU2G706Oc\nz5cV2xxm0mrFr580Qd4NMgb7zfMPd3GJAw5V/XBz2BgyblwVZqCt93rmc3ep/zUf\nugoqstlwyb4RiPV92zKxGURt9dOUEtD5SgvlXBidYylWwzY9cgP1bMIQG8OzLBL7\n9zhcaAz4MdTSyzSevGF5aF0=\n-----END PRIVATE KEY-----\n"
}

const SPREADSHEET_ID = "1bmM5tuSnxHXEsgsvxMCQBOdjCcMzwSvhoB12uhstpG8"

// ⚙️ CONFIGURAÇÕES DO SISTEMA DE ARQUIVAMENTO
const MAX_OS_SUPABASE = 500  // Limite máximo de OSs no Supabase
const OS_PARA_ARQUIVAR = 200 // Quantidade de OSs antigas para arquivar quando atingir o limite

// Função para formatar data
function formatDate(dateString: string): string {
  if (!dateString) return ''
  
  if (dateString.includes('-') && dateString.length >= 10) {
    const dateOnly = dateString.split('T')[0]
    const [year, month, day] = dateOnly.split('-')
    return `${day}/${month}/${year}`
  }
  
  return dateString
}

// 📊 FUNÇÃO 1: Sincronizar TODAS as OSs na aba "Ativas" (BACKUP COMPLETO)
export async function syncToGoogleSheets(orders: any[]) {
  try {
    // Configurar autenticação
    const serviceAccountAuth = new JWT({
      email: GOOGLE_CREDENTIALS.client_email,
      key: GOOGLE_CREDENTIALS.private_key,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file',
      ],
    })

    // Conectar à planilha
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth)
    await doc.loadInfo()

    // 🔍 Pegar ou criar aba "Ativas"
    let sheetAtivas = doc.sheetsByTitle['📋 Ordens Ativas'] || doc.sheetsByIndex[0]
    
    if (!doc.sheetsByTitle['📋 Ordens Ativas']) {
      await sheetAtivas.updateProperties({ title: '📋 Ordens Ativas' })
    }
    
    // Limpar toda a aba
    await sheetAtivas.clear()
    
    // Configurar cabeçalhos
    await sheetAtivas.setHeaderRow([
      'Número OS',
      'Data Solicitação',
      'Setor',
      'Local/Equipamento',
      'Tipo Manutenção',
      'Prioridade',
      'Status',
      'Solicitante',
      'Responsável Setor',
      'Descrição',
      'Data Criação',
    ])

    // Preparar dados
    const rows = orders.map(os => ({
      'Número OS': os.numero_os || '',
      'Data Solicitação': formatDate(os.data_solicitacao || os.data || os.created_at),
      'Setor': os.setor || '',
      'Local/Equipamento': os.local || os.equipamento || '',
      'Tipo Manutenção': os.tipo_manutencao || '',
      'Prioridade': os.prioridade || '',
      'Status': os.status || '',
      'Solicitante': os.solicitante || '',
      'Responsável Setor': os.responsavel_setor || '',
      'Descrição': os.descricao || '',
      'Data Criação': os.created_at ? new Date(os.created_at).toLocaleString('pt-BR') : '',
    }))

    // Adicionar linhas
    if (rows.length > 0) {
      await sheetAtivas.addRows(rows)
    }

    // Formatar planilha
    await sheetAtivas.updateProperties({
      gridProperties: {
        frozenRowCount: 1,
      }
    })

    // 🎨 FORMATAR VISUALMENTE
    await formatSheet(sheetAtivas, orders.length)

    console.log(`✅ Sincronizado ${orders.length} OSs na aba "Ativas"`)

    return {
      success: true,
      totalOSs: orders.length,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}`
    }
  } catch (error: any) {
    console.error('❌ Erro na sincronização:', error)
    throw new Error(error.message || 'Erro ao sincronizar com Google Sheets')
  }
}

// 🗄️ FUNÇÃO 2: Verificar se precisa arquivar OSs antigas
export async function checkAndArchiveOldOS() {
  try {
    console.log('🔍 Verificando se precisa arquivar OSs antigas...')
    
    // Contar OSs no Supabase
    const { count, error: countError } = await supabase
      .from('work_orders')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('❌ Erro ao contar OSs:', countError)
      return { needsArchiving: false, count: 0 }
    }

    console.log(`📊 Total de OSs no Supabase: ${count}`)

    // Se passou do limite, arquivar
    if (count && count >= MAX_OS_SUPABASE) {
      console.log(`⚠️ LIMITE ATINGIDO! ${count} OSs (limite: ${MAX_OS_SUPABASE})`)
      console.log(`📦 Arquivando as ${OS_PARA_ARQUIVAR} OSs mais antigas...`)
      
      await archiveOldOrders()
      
      return { needsArchiving: true, count, archived: OS_PARA_ARQUIVAR }
    }

    return { needsArchiving: false, count }
  } catch (error: any) {
    console.error('❌ Erro ao verificar arquivamento:', error)
    return { needsArchiving: false, count: 0, error: error.message }
  }
}

// 🗄️ FUNÇÃO 3: Arquivar OSs antigas (move para Sheets e remove do Supabase)
async function archiveOldOrders() {
  try {
    // 1. Buscar as OSs mais antigas do Supabase
    const { data: oldOrders, error: fetchError } = await supabase
      .from('work_orders')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(OS_PARA_ARQUIVAR)

    if (fetchError || !oldOrders || oldOrders.length === 0) {
      console.log('⚠️ Nenhuma OS para arquivar')
      return
    }

    console.log(`📦 Arquivando ${oldOrders.length} OSs antigas...`)

    // 2. Salvar no Google Sheets (aba "Histórico")
    await saveToHistorySheet(oldOrders)

    // 3. Remover do Supabase
    const idsToDelete = oldOrders.map(os => os.id)
    const { error: deleteError } = await supabase
      .from('work_orders')
      .delete()
      .in('id', idsToDelete)

    if (deleteError) {
      console.error('❌ Erro ao deletar OSs do Supabase:', deleteError)
      throw new Error('Erro ao deletar OSs antigas')
    }

    console.log(`✅ ${oldOrders.length} OSs arquivadas com sucesso!`)
    console.log(`🗑️ Removidas do Supabase para liberar espaço`)
    
  } catch (error: any) {
    console.error('❌ Erro ao arquivar OSs:', error)
    throw error
  }
}

// 📁 FUNÇÃO 4: Salvar OSs na aba "Histórico" do Sheets
async function saveToHistorySheet(orders: any[]) {
  try {
    // Configurar autenticação
    const serviceAccountAuth = new JWT({
      email: GOOGLE_CREDENTIALS.client_email,
      key: GOOGLE_CREDENTIALS.private_key,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file',
      ],
    })

    // Conectar à planilha
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth)
    await doc.loadInfo()

    // 🔍 Pegar ou criar aba "Histórico"
    let sheetHistorico = doc.sheetsByTitle['🗄️ Histórico Arquivado']
    
    if (!sheetHistorico) {
      console.log('📝 Criando aba "Histórico Arquivado"...')
      sheetHistorico = await doc.addSheet({ 
        title: '🗄️ Histórico Arquivado',
        headerValues: [
          'Número OS',
          'Data Solicitação',
          'Setor',
          'Local/Equipamento',
          'Tipo Manutenção',
          'Prioridade',
          'Status',
          'Solicitante',
          'Responsável Setor',
          'Descrição',
          'Data Criação',
          'Data Arquivamento',
        ]
      })
    }

    // Preparar dados
    const rows = orders.map(os => ({
      'Número OS': os.numero_os || '',
      'Data Solicitação': formatDate(os.data_solicitacao || os.data || os.created_at),
      'Setor': os.setor || '',
      'Local/Equipamento': os.local || os.equipamento || '',
      'Tipo Manutenção': os.tipo_manutencao || '',
      'Prioridade': os.prioridade || '',
      'Status': os.status || '',
      'Solicitante': os.solicitante || '',
      'Responsável Setor': os.responsavel_setor || '',
      'Descrição': os.descricao || '',
      'Data Criação': os.created_at ? new Date(os.created_at).toLocaleString('pt-BR') : '',
      'Data Arquivamento': new Date().toLocaleString('pt-BR'),
    }))

    // Adicionar linhas ao histórico
    if (rows.length > 0) {
      await sheetHistorico.addRows(rows)
    }

    console.log(`✅ ${orders.length} OSs salvas no histórico do Sheets`)
    
  } catch (error: any) {
    console.error('❌ Erro ao salvar no histórico:', error)
    throw error
  }
}

// 📖 FUNÇÃO 5: Buscar OSs do histórico (para exibir no frontend)
export async function getArchivedOrders(limit = 100) {
  try {
    // Configurar autenticação
    const serviceAccountAuth = new JWT({
      email: GOOGLE_CREDENTIALS.client_email,
      key: GOOGLE_CREDENTIALS.private_key,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.file',
      ],
    })

    // Conectar à planilha
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth)
    await doc.loadInfo()

    // Pegar aba "Histórico"
    const sheetHistorico = doc.sheetsByTitle['🗄️ Histórico Arquivado']
    
    if (!sheetHistorico) {
      return []
    }

    // Carregar linhas
    const rows = await sheetHistorico.getRows()
    
    // Converter para formato de OS
    const archivedOrders = rows.slice(0, limit).map(row => ({
      numero_os: row.get('Número OS'),
      data_solicitacao: row.get('Data Solicitação'),
      setor: row.get('Setor'),
      local: row.get('Local/Equipamento'),
      tipo_manutencao: row.get('Tipo Manutenção'),
      prioridade: row.get('Prioridade'),
      status: row.get('Status'),
      solicitante: row.get('Solicitante'),
      responsavel_setor: row.get('Responsável Setor'),
      descricao: row.get('Descrição'),
      created_at: row.get('Data Criação'),
      archived_at: row.get('Data Arquivamento'),
      isArchived: true, // Flag para indicar que é do histórico
    }))

    return archivedOrders
    
  } catch (error: any) {
    console.error('❌ Erro ao buscar OSs arquivadas:', error)
    return []
  }
}

// 🎨 Função para formatar a planilha com cores
async function formatSheet(sheet: any, totalRows: number) {
  try {
    // 1. Formatar cabeçalho (linha 1) - Fundo vermelho, texto branco, negrito
    await sheet.loadCells('A1:K1')
    for (let col = 0; col < 11; col++) {
      const cell = sheet.getCell(0, col)
      cell.backgroundColor = { red: 0.86, green: 0.15, blue: 0.15 } // Vermelho CozilTech
      cell.textFormat = { 
        bold: true, 
        foregroundColor: { red: 1, green: 1, blue: 1 } // Branco
      }
      cell.horizontalAlignment = 'CENTER'
    }

    // 2. Formatar dados (colorir por prioridade e status)
    if (totalRows > 0) {
      await sheet.loadCells(`A2:K${totalRows + 1}`)
      
      for (let row = 1; row <= totalRows; row++) {
        // Coluna F - Prioridade
        const prioridadeCell = sheet.getCell(row, 5) // Coluna F (índice 5)
        const prioridade = prioridadeCell.value
        
        if (prioridade === 'Alta') {
          prioridadeCell.backgroundColor = { red: 0.95, green: 0.8, blue: 0.8 } // Vermelho claro
          prioridadeCell.textFormat = { bold: true, foregroundColor: { red: 0.8, green: 0, blue: 0 } }
        } else if (prioridade === 'Média') {
          prioridadeCell.backgroundColor = { red: 1, green: 0.95, blue: 0.8 } // Amarelo claro
          prioridadeCell.textFormat = { foregroundColor: { red: 0.8, green: 0.6, blue: 0 } }
        } else if (prioridade === 'Baixa') {
          prioridadeCell.backgroundColor = { red: 0.85, green: 0.95, blue: 0.85 } // Verde claro
          prioridadeCell.textFormat = { foregroundColor: { red: 0, green: 0.6, blue: 0 } }
        }

        // Coluna G - Status
        const statusCell = sheet.getCell(row, 6) // Coluna G (índice 6)
        const status = statusCell.value
        
        if (status === 'Concluído') {
          statusCell.backgroundColor = { red: 0.85, green: 0.95, blue: 0.85 } // Verde claro
          statusCell.textFormat = { bold: true, foregroundColor: { red: 0, green: 0.6, blue: 0 } }
        } else if (status === 'Em Andamento') {
          statusCell.backgroundColor = { red: 0.85, green: 0.92, blue: 0.98 } // Azul claro
          statusCell.textFormat = { foregroundColor: { red: 0, green: 0.4, blue: 0.8 } }
        } else if (status === 'Pendente') {
          statusCell.backgroundColor = { red: 0.95, green: 0.95, blue: 0.95 } // Cinza claro
          statusCell.textFormat = { foregroundColor: { red: 0.4, green: 0.4, blue: 0.4 } }
        }

        // Centralizar algumas colunas
        sheet.getCell(row, 0).horizontalAlignment = 'CENTER' // Número OS
        sheet.getCell(row, 1).horizontalAlignment = 'CENTER' // Data
        sheet.getCell(row, 5).horizontalAlignment = 'CENTER' // Prioridade
        sheet.getCell(row, 6).horizontalAlignment = 'CENTER' // Status
      }
    }

    // Salvar todas as alterações de formatação
    await sheet.saveUpdatedCells()

    console.log('🎨 Formatação aplicada com sucesso!')
  } catch (error) {
    console.error('⚠️ Erro ao formatar, mas dados foram salvos:', error)
  }
}

