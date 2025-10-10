import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { checkAndArchiveOldOS } from '@/lib/google-sheets'

// Interface para os dados da OS
interface OSData {
  setor: string
  data: string
  equipamento: string
  tipoManutencao: string
  prioridade: string
  descricao: string
  solicitante: string
  responsavelSetor: string
  fotos?: string[]
}

// Função para gerar número único da OS
function generateOSNumber(): string {
  const year = new Date().getFullYear()
  const month = String(new Date().getMonth() + 1).padStart(2, '0')
  const day = String(new Date().getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `OS-${year}${month}${day}-${random}`
}

// POST - Receber dados do formulário
export async function POST(request: NextRequest) {
  try {
    // Verificar se é FormData ou JSON pelo Content-Type
    const contentType = request.headers.get('content-type')
    console.log('📥 Content-Type recebido:', contentType)
    let body: any = {}
    
    // Se é JSON (com imagens Base64)
    if (contentType?.includes('application/json')) {
      console.log('📥 JSON recebido (provavelmente com Base64)')
      body = await request.json()
      console.log('📷 Fotos Base64 recebidas:', body.fotos?.length || 0)
    } 
    // Se é FormData (legado - só nomes de arquivo)
    else {
      console.log('📥 FormData recebido')
      const formData = await request.formData()
      
      // Extrair campos do FormData
      body = {
        solicitante: formData.get('solicitante') as string,
        setor: formData.get('setor') as string,
        data_solicitacao: formData.get('data_solicitacao') as string,
        local: formData.get('local') as string,
        prioridade: formData.get('prioridade') as string,
        tipo_manutencao: formData.get('tipo_manutencao') as string,
        descricao: formData.get('descricao') as string,
        responsavelSetor: formData.get('responsavelSetor') as string,
        fotos: []
      }
      
      // Processar fotos (apenas nomes)
      const fotos: string[] = []
      try {
        const entries = Array.from(formData.entries())
        for (const [key, value] of entries) {
          if (key.startsWith('foto_') && value instanceof File) {
            console.log('📷 Foto encontrada:', key, value.name, value.size)
            fotos.push(value.name)
          }
        }
      } catch (error) {
        console.log('📷 Erro ao processar fotos:', error)
      }
      body.fotos = fotos
      console.log('📷 Total de fotos processadas:', fotos.length)
    }
    
    // Log sem mostrar as imagens Base64 completas (muito grandes)
    const bodyLog = { ...body }
    if (bodyLog.fotos && Array.isArray(bodyLog.fotos)) {
      bodyLog.fotos = bodyLog.fotos.map((f: string) => 
        f.startsWith('data:image') ? `[Base64 Image: ${f.substring(0, 30)}...]` : f
      )
    }
    console.log('📥 Dados recebidos:', JSON.stringify(bodyLog, null, 2))
    console.log('🔍 Debug responsavelSetor recebido:', body.responsavelSetor)
    
    // Mapear os dados do formulário para nossa estrutura
    const solicitante = body.solicitante || 'Não informado';
    
    const osData: OSData = {
      setor: body.setor || '',
      data: body.data_solicitacao || new Date().toISOString().split('T')[0],
      equipamento: body.local || 'Não especificado',
      tipoManutencao: body.tipo_manutencao || 'Predial',
      prioridade: body.prioridade || 'Média',
      descricao: body.descricao || '',
      solicitante: solicitante,
      responsavelSetor: body.responsavelSetor || solicitante || 'Não informado',
      fotos: body.fotos || []
    }

    console.log('📋 Dados mapeados:', JSON.stringify(osData, null, 2))

    // Validar campos obrigatórios (apenas os essenciais)
    const requiredFields = ['setor', 'descricao', 'solicitante']
    const missingFields = requiredFields.filter(field => !osData[field as keyof OSData] || osData[field as keyof OSData] === '')
    
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
    const responsavelSetorValue = osData.responsavelSetor || osData.solicitante || 'Não informado';
    console.log('🔍 Debug responsavelSetor:', {
      original: osData.responsavelSetor,
      solicitante: osData.solicitante,
      final: responsavelSetorValue
    });
    
    const insertData = {
      setor: osData.setor.trim(),
      tipo_manutencao: osData.tipoManutencao,
      prioridade: osData.prioridade,
      descricao: osData.descricao.trim(),
      solicitante: osData.solicitante.trim(),
      responsavel_setor: responsavelSetorValue.trim(),
      numero_os: generateOSNumber(),
      status: 'Em Andamento',
      local: osData.equipamento.trim(),
      data_solicitacao: osData.data,
      fotos: osData.fotos || []
    }

    console.log('💾 Tentando inserir no Supabase:', JSON.stringify(insertData, null, 2))

          // Verificar se já existe uma OS com o mesmo setor e descrição nas últimas 10 minutos
          const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()
          const { data: existingOS, error: checkError } = await supabase
            .from('work_orders')
            .select('id, numero_os, created_at, setor, descricao')
            .eq('setor', insertData.setor.trim())
            .eq('descricao', insertData.descricao)
            .gte('created_at', tenMinutesAgo)
            .limit(1)

    if (checkError) {
      console.error('❌ Erro ao verificar duplicatas:', checkError)
    } else if (existingOS && existingOS.length > 0) {
      console.log('⚠️ OS duplicada detectada, retornando existente:', existingOS[0])
      return NextResponse.json({
        success: true,
        message: 'OS já existe (duplicata evitada)',
        os: existingOS[0]
      })
    }

    // Tentar inserir no Supabase
    const { data: newOS, error } = await supabase
      .from('work_orders')
      .insert([insertData])
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao criar OS no Supabase:', error)
      return NextResponse.json(
        { 
          error: 'Erro ao criar OS no banco de dados',
          details: error.message,
          code: error.code,
          hint: error.hint,
          fullError: JSON.stringify(error),
          insertData: insertData
        },
        { status: 500 }
      )
    }

    console.log('✅ Nova OS criada com sucesso:', newOS)

    // 🗄️ VERIFICAR SE PRECISA ARQUIVAR OSs ANTIGAS (Sistema de Limite Inteligente)
    try {
      console.log('🔍 Verificando necessidade de arquivamento...')
      const archiveResult = await checkAndArchiveOldOS()
      
      if (archiveResult.needsArchiving) {
        console.log(`📦 Arquivadas ${archiveResult.archived} OSs antigas automaticamente!`)
      } else {
        console.log(`✅ Ainda não precisa arquivar (${archiveResult.count} OSs no Supabase)`)
      }
    } catch (archiveError) {
      console.error('⚠️ Erro ao verificar arquivamento:', archiveError)
      // Não retornar erro, pois a OS foi criada com sucesso
    }

      // 📧 Enviar notificação por email para todos os usuários cadastrados
      try {
        console.log('📧 Enviando notificação de nova OS por email...')
        const notificationResponse = await fetch(`${request.nextUrl.origin}/api/send-os-notification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ osId: newOS.id })
        })
        
        if (notificationResponse.ok) {
          console.log('✅ Emails de notificação enviados com sucesso')
        } else {
          console.error('⚠️ Erro ao enviar emails, mas OS foi criada')
        }
      } catch (notifError) {
        console.error('⚠️ Erro ao enviar emails:', notifError)
        // Não retornar erro, pois a OS foi criada com sucesso
      }

    // 🔄 Sincronizar automaticamente com Google Sheets
    try {
      console.log('📊 Sincronizando com Google Sheets...')
      const syncResponse = await fetch(`${request.nextUrl.origin}/api/sync-sheets`, {
        method: 'POST',
      })
      
      if (syncResponse.ok) {
        console.log('✅ Google Sheets sincronizado')
      } else {
        console.error('⚠️ Erro ao sincronizar Sheets, mas OS foi criada')
      }
    } catch (syncError) {
      console.error('⚠️ Erro ao sincronizar Sheets:', syncError)
      // Não retornar erro, pois a OS foi criada com sucesso
    }

    return NextResponse.json({
      success: true,
      message: 'OS criada com sucesso',
      os: newOS
    })

  } catch (error) {
    console.error('❌ Erro ao processar OS:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

// GET - Buscar todas as OSs
export async function GET() {
  try {
    console.log('🔍 Buscando OSs no Supabase...')
    
    const { data: orders, error } = await supabase
      .from('work_orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Erro ao buscar OSs:', error)
      return NextResponse.json(
        { 
          error: 'Erro ao buscar OSs no banco de dados',
          details: error.message,
          code: error.code
        },
        { status: 500 }
      )
    }

    console.log('✅ OSs encontradas:', orders?.length || 0)

    return NextResponse.json({
      success: true,
      orders: orders || [],
      total: orders?.length || 0
    })
  } catch (error) {
    console.error('❌ Erro ao buscar OSs:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}