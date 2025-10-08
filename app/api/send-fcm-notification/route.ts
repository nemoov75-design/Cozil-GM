import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';

// Configuração do Firebase Admin SDK
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: "coziltech-notifications",
        clientEmail: "firebase-adminsdk-fbsvc@coziltech-notifications.iam.gserviceaccount.com",
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('❌ Erro ao inicializar Firebase Admin:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { os, tokens } = await request.json();
    
    if (!os || !tokens || tokens.length === 0) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      );
    }

    // Configurar notificação
    const message = {
      notification: {
        title: `🚨 Nova OS #${os.numero_os || os.id.substring(0, 8)}`,
        body: `📋 ${os.descricao} - ${os.prioridade} Prioridade`,
      },
      data: {
        osId: os.id,
        numeroOs: os.numero_os || os.id.substring(0, 8),
        prioridade: os.prioridade,
        solicitante: os.solicitante,
        setor: os.setor,
        tipo: 'new_os'
      },
      webpush: {
        notification: {
          title: `🚨 Nova OS #${os.numero_os || os.id.substring(0, 8)}`,
          body: `📋 ${os.descricao} - ${os.prioridade} Prioridade`,
          icon: '/favicon.svg',
          badge: '/favicon.svg',
          requireInteraction: true,
          actions: [
            {
              action: 'view',
              title: 'Ver OS',
              icon: '/favicon.svg'
            }
          ]
        }
      },
      tokens: tokens
    };

    // Enviar notificação
    const response = await admin.messaging().sendMulticast(message);
    
    console.log('📨 Notificação FCM enviada:', response);
    
    return NextResponse.json({
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
      responses: response.responses
    });

  } catch (error) {
    console.error('❌ Erro ao enviar notificação FCM:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
