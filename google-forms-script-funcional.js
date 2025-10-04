/**
 * Google Apps Script para formulário Cozil
 * Script funcional - VERSÃO CORRIGIDA
 */

function onSubmit(e) {
  console.log('=== FORMULÁRIO ENVIADO ===');
  console.log('Evento recebido:', e);
  
  // Verificar se os dados existem
  if (!e || !e.response) {
    console.error('Resposta do formulário não encontrada');
    return;
  }
  
  const response = e.response;
  const itemResponses = response.getItemResponses();
  
  console.log('Respostas do formulário:', itemResponses);
  
  // Criar objeto com os dados
  const formData = {};
  itemResponses.forEach(function(itemResponse) {
    const title = itemResponse.getItem().getTitle();
    const response = itemResponse.getResponse();
    formData[title] = response;
  });
  
  console.log('Dados mapeados:', formData);
  
  // ROTA CORRETA - webhook específico para Google Forms
  const webhookUrl = 'https://cozil-sistema-qxrx.vercel.app/api/webhook/google-forms';
  
  const payload = {
    'Solicitante': formData['Solicitante'] || '',
    'Setor': formData['Setor'] || '',
    'Data da solicitação': formData['Data da solicitação'] || '',
    'Local/Equipamento': formData['Local/Equipamento'] || '',
    'Prioridade': formData['Prioridade'] || '',
    'Tipo de Manutenção': formData['Tipo de Manutenção'] || '',
    'Descreva o serviço...': formData['Descreva o serviço...'] || '',
    'Upload de Foto do Problema': formData['Upload de Foto do Problema'] || []
  };
  
  console.log('Payload preparado:', payload);
  
  const options = {
    'method': 'POST',
    'headers': {
      'Content-Type': 'application/json'
    },
    'payload': JSON.stringify(payload)
  };
  
  try {
    console.log('Enviando webhook...');
    const response = UrlFetchApp.fetch(webhookUrl, options);
    console.log('Webhook enviado com sucesso:', response.getContentText());
  } catch (error) {
    console.error('Erro ao enviar webhook:', error);
  }
}

// Função para testar a conexão
function testConnection() {
  try {
    console.log('🧪 Testando conexão...');
    
    // Simular dados do formulário
    const mockFormData = {
      'Solicitante': 'Sistema Teste',
      'Setor': 'Portaria',
      'Data da solicitação': new Date().toISOString().split('T')[0],
      'Local/Equipamento': 'Equipamento Teste',
      'Prioridade': 'Média',
      'Tipo de Manutenção': 'Predial',
      'Descreva o serviço...': 'Teste de conexão automático',
      'Upload de Foto do Problema': ''
    };
    
    const webhookUrl = 'https://cozil-sistema-qxrx.vercel.app/api/webhook/google-forms';
    
    const options = {
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json'
      },
      'payload': JSON.stringify(mockFormData)
    };
    
    console.log('📤 Enviando teste...');
    const response = UrlFetchApp.fetch(webhookUrl, options);
    const result = response.getContentText();
    console.log('✅ Resposta:', result);
    
    return 'Conexão OK! ' + result;
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    return 'Erro: ' + error.toString();
  }
}