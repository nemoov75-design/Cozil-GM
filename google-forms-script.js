// Script do Google Apps Script para enviar dados do Google Forms para o sistema
// Cole este código no Google Apps Script (script.google.com)

function onSubmit(e) {
  try {
    // Obter dados do formulário
    const formResponse = e.response;
    const itemResponses = formResponse.getItemResponses();
    
    // Mapear as respostas para os campos do sistema
    const formData = {
      solicitante: getResponseByTitle(itemResponses, 'Solicitante') || '',
      setor: getResponseByTitle(itemResponses, 'Setor') || '',
      data_solicitacao: getResponseByTitle(itemResponses, 'Data da solicitação') || new Date().toISOString().split('T')[0],
      local: getResponseByTitle(itemResponses, 'Local') || '',
      prioridade: getResponseByTitle(itemResponses, 'Prioridade') || 'Média',
      tipo_manutencao: getResponseByTitle(itemResponses, 'Tipo de Manutenção') || 'Predial',
      descricao: getResponseByTitle(itemResponses, 'Descreva o serviço...') || ''
    };
    
    // Log para debug
    console.log('📝 Dados do formulário:', formData);
    
    // URL do seu webhook (URL final da Vercel)
    const webhookUrl = 'https://cozil-maintenance-dhkz.vercel.app/api/webhook/google-forms';
    
    // Enviar dados para o sistema
    const options = {
      'method': 'POST',
      'headers': {
        'Content-Type': 'application/json',
      },
      'payload': JSON.stringify(formData)
    };
    
    const response = UrlFetchApp.fetch(webhookUrl, options);
    const responseData = JSON.parse(response.getContentText());
    
    console.log('Resposta do sistema:', responseData);
    
    // Opcional: Enviar email de confirmação
    if (responseData.success) {
      sendConfirmationEmail(formData);
    }
    
  } catch (error) {
    console.error('Erro ao processar formulário:', error);
  }
}

function getResponseByTitle(itemResponses, title) {
  for (let i = 0; i < itemResponses.length; i++) {
    if (itemResponses[i].getItem().getTitle() === title) {
      return itemResponses[i].getResponse();
    }
  }
  return null;
}

function sendConfirmationEmail(formData) {
  try {
    const subject = 'Confirmação de Solicitação - Cozil';
    const body = `
      Sua solicitação foi recebida com sucesso!
      
      Detalhes:
      - Solicitante: ${formData.solicitante}
      - Setor: ${formData.setor}
      - Local: ${formData.local}
      - Prioridade: ${formData.prioridade}
      - Tipo: ${formData.tipo_manutencao}
      - Descrição: ${formData.descricao}
      
      Obrigado por usar o Cozil!
    `;
    
    MailApp.sendEmail({
      to: formData.solicitante + '@cozil.com', // Ajuste o domínio conforme necessário
      subject: subject,
      body: body
    });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
  }
}
