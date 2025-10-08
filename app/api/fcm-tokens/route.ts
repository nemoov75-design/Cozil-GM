import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { userId, token, deviceInfo } = await request.json();
    
    if (!userId || !token) {
      return NextResponse.json(
        { error: 'userId e token são obrigatórios' },
        { status: 400 }
      );
    }

    // Salvar token no banco de dados
    const { data, error } = await supabase
      .from('fcm_tokens')
      .upsert({
        user_id: userId,
        token: token,
        device_info: deviceInfo || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,token'
      });

    if (error) {
      console.error('❌ Erro ao salvar token FCM:', error);
      return NextResponse.json(
        { error: 'Erro ao salvar token' },
        { status: 500 }
      );
    }

    console.log('✅ Token FCM salvo:', { userId, token });
    
    return NextResponse.json({
      success: true,
      message: 'Token salvo com sucesso'
    });

  } catch (error) {
    console.error('❌ Erro na API de tokens FCM:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar tokens do usuário
    const { data, error } = await supabase
      .from('fcm_tokens')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('❌ Erro ao buscar tokens FCM:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar tokens' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      tokens: data || []
    });

  } catch (error) {
    console.error('❌ Erro na API de tokens FCM:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
