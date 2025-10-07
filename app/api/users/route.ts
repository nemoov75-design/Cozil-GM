import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET - Buscar todos os usuários
export async function GET(request: NextRequest) {
  try {
    console.log('📋 Buscando usuários...')
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Erro ao buscar usuários:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    console.log(`✅ ${data?.length || 0} usuários encontrados`)
    return NextResponse.json({ users: data || [] })
    
  } catch (error: any) {
    console.error('❌ Erro ao buscar usuários:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// POST - Criar novo usuário
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📝 Criando novo usuário:', body.email)
    
    const { name, email, setor, cargo, telefone, receive_notifications = true } = body
    
    // Validação
    if (!name || !email) {
      return NextResponse.json({ error: 'Nome e e-mail são obrigatórios' }, { status: 400 })
    }
    
    // Criar usuário
    const { data, error } = await supabase
      .from('users')
      .insert([{
        name,
        email,
        setor,
        cargo,
        telefone,
        receive_notifications,
        active: true
      }])
      .select()
      .single()
    
    if (error) {
      console.error('❌ Erro ao criar usuário:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    console.log('✅ Usuário criado:', data.id)
    return NextResponse.json({ user: data }, { status: 201 })
    
  } catch (error: any) {
    console.error('❌ Erro ao criar usuário:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// DELETE - Deletar usuário
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id')
    
    if (!userId) {
      return NextResponse.json({ error: 'ID do usuário é obrigatório' }, { status: 400 })
    }
    
    console.log('🗑️ Deletando usuário:', userId)
    
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)
    
    if (error) {
      console.error('❌ Erro ao deletar usuário:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    console.log('✅ Usuário deletado')
    return NextResponse.json({ success: true })
    
  } catch (error: any) {
    console.error('❌ Erro ao deletar usuário:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}


