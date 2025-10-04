import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

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

// POST - Receber dados do Google Forms
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📥 Dados recebidos:', JSON.stringify(body, null, 2))
    console.log('🔍 Debug responsavelSetor recebido:', body.responsavelSetor)
    
    // Mapear os dados do Google Forms para nossa estrutura
    const solicitante = body.solicitante || body['Solicitante'] || body['Nome do solicitante'] || 'Não informado';
    
    const osData: OSData = {
      setor: body.setor || body['Setor'] || '',
      data: body.data || body['Data da solicitação'] || body['Data'] || '',
      equipamento: body.equipamento || body['Local'] || body['Equipamento'] || '',
      tipoManutencao: body.tipoManutencao || body['Tipo de Manutenção'] || body['Tipo de manutencao'] || '',
      prioridade: body.prioridade || body['Prioridade'] || '',
      descricao: body.descricao || body['Descreva o serviço...'] || body['Descrição do problema'] || body['Descricao do problema'] || '',
      solicitante: solicitante,
      responsavelSetor: body.responsavelSetor || solicitante || 'Não informado',
      fotos: body.fotos || body['Upload de Foto do Problema'] || []
    }

    console.log('📋 Dados mapeados:', JSON.stringify(osData, null, 2))

    // Validar campos obrigatórios
    const requiredFields = ['setor', 'data', 'equipamento', 'tipoManutencao', 'prioridade', 'descricao', 'solicitante', 'responsavelSetor']
    const missingFields = requiredFields.filter(field => !osData[field as keyof OSData])
    
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
      data: osData.data,
      equipamento: osData.equipamento.trim(),
      tipo_manutencao: osData.tipoManutencao,
      prioridade: osData.prioridade,
      descricao: osData.descricao.trim(),
      solicitante: osData.solicitante.trim(),
      responsavel_setor: responsavelSetorValue.trim(),
      numero_os: generateOSNumber(),
      status: 'Em Andamento',
      // Limpar campos extras que podem estar causando conflito
      local: null,
      portaria: false,
      recepcao: false,
      rh: false,
      comercial: false,
      engenharia: false,
      controladoria: false,
      financeiro: false,
      diretoria: false,
      projetos: false,
      acabamento: false,
      mobiliario: false,
      cpc: false,
      caldeiraria: false,
      recebimento: false,
      laboratorio: false,
      desenvolvimento: false,
      logistica: false,
      show_room: false,
      estacionamento_1: false,
      estacionamento_2: false,
      almoxarifado: false,
      fotos: []
    }

    console.log('💾 Tentando inserir no Supabase:', JSON.stringify(insertData, null, 2))

          // Verificar se já existe uma OS com o mesmo equipamento, setor e descrição nas últimas 10 minutos
          const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()
          const { data: existingOS, error: checkError } = await supabase
            .from('work_orders')
            .select('id, numero_os, created_at, equipamento, setor, descricao')
            .eq('equipamento', insertData.equipamento.trim())
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