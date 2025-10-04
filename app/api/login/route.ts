import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Senha padrão apenas para admin (não exposta na interface)
const defaultPasswords = {
  'admin@cozil.com': 'admin123'
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log('🔐 Tentativa de login:', { email, password })
    
    // Verificar se é uma senha padrão de desenvolvimento (admin)
    if (defaultPasswords[email as keyof typeof defaultPasswords] === password) {
      // Buscar usuário no Supabase
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()
      
      if (error || !user) {
        console.log('❌ Usuário não encontrado no banco')
        return NextResponse.json({
          success: false,
          error: 'Email ou senha incorretos'
        }, { status: 401 })
      }
      
      console.log('✅ Login bem-sucedido (Supabase):', user.name)
      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ef4444&color=fff`
        }
      })
    } else {
      // Para usuários cadastrados localmente, retornar erro
      // O frontend deve lidar com login local
      console.log('❌ Login falhou - credenciais inválidas (não é admin)')
      return NextResponse.json({
        success: false,
        error: 'Email ou senha incorretos'
      }, { status: 401 })
    }
  } catch (error) {
    console.log('❌ Erro no servidor:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 })
  }
}
