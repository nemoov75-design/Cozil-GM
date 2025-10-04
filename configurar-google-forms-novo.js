/**
 * Script do Google Apps Script para enviar dados do formulário para o site Cozil
 * Configurado para o novo formulário com campos atualizados
 */

function doPost(e) {
  try {
    console.log('📧 Dados recebidos do formulário:', e.postData.contents);
    
    // Parse dos dados do formulário
    const formData = JSON.parse(e.postData.contents);
    console.log('📋 Dados processados:', formData);
    
    // Mapear os campos do novo formulário
    const solicitante = formData['Solicitante'] || formData.solicitante || 'Não informado';
    
    const osData = {
      setor: formData['Setor'] || formData.setor || '',
      data: formData['Data da solicitação'] || formData.data || new Date().toISOString().split('T')[0],
      equipamento: formData['Local'] || formData.equipamento || '',
      tipo_manutencao: formData['Tipo de Manutenção'] || formData.tipoManutencao || '',
      prioridade: formData['Prioridade'] || formData.prioridade || '',
      descricao: formData['Descreva o serviço...'] || formData.descricao || '',
      solicitante: solicitante,
      responsavel_setor: solicitante, // Usando solicitante como responsável
      fotos: formData['Upload de Foto do Problema'] || formData.fotos || '',
      numero_os: generateOSNumber(),
      status: 'Em Andamento',
      created_at: new Date().toISOString()
    };
    
    // Validar se o setor está na lista permitida
    const setoresPermitidos = [
      'Portaria', 'Recepção', 'RH', 'Comercial', 'Engenharia', 'Controladoria', 
      'Financeiro', 'Diretoria', 'Projetos', 'Acabamento', 'Mobiliário', 'CPC', 
      'Caldeiraria', 'Recebimento', 'Laboratório', 'Desenvolvimento', 'Logística', 
      'Show room', 'Estacionamento 1', 'Estacionamento 2', 'Almoxarifado'
    ];
    
    if (!setoresPermitidos.includes(osData.setor)) {
      console.warn('⚠️ Setor não reconhecido:', osData.setor);
    }
    
    console.log('🔧 OS mapeada:', osData);
    
    // Enviar para o site
    const response = sendToWebsite(osData);
    
    if (response.success) {
      console.log('✅ OS enviada com sucesso!');
      return ContentService
        .createTextOutput(JSON.stringify({ success: true, message: 'OS criada com sucesso!' }))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      console.error('❌ Erro ao enviar OS:', response.error);
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: response.error }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    console.error('❌ Erro no processamento:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendToWebsite(osData) {
  try {
    const url = 'https://cozil-sistema-qxrx.vercel.app/api/os';
    
    const payload = {
      setor: osData.setor,
      data: osData.data,
      equipamento: osData.equipamento,
      tipoManutencao: osData.tipo_manutencao,
      prioridade: osData.prioridade,
      descricao: osData.descricao,
      solicitante: osData.solicitante,
      responsavelSetor: osData.solicitante, // Usar solicitante como responsavelSetor
      fotos: osData.fotos,
      numero_os: osData.numero_os,
      status: osData.status
    };
    
    console.log('📤 Enviando para:', url);
    console.log('📦 Payload:', payload);
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      payload: JSON.stringify(payload)
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const responseText = response.getContentText();
    
    console.log('📥 Resposta do site:', responseText);
    
    return JSON.parse(responseText);
    
  } catch (error) {
    console.error('❌ Erro na comunicação:', error);
    return { success: false, error: error.toString() };
  }
}

function generateOSNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const time = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0');
  
  return `OS${year}${month}${day}${time}`;
}

// Função para testar a conexão
function testConnection() {
  try {
    console.log('🧪 Testando conexão...');
    
    // Simular dados do formulário
    const mockFormData = {
      'Solicitante': 'Sistema Teste',
      'Setor': 'Teste',
      'Data da solicitação': new Date().toISOString().split('T')[0],
      'Local': 'Equipamento Teste',
      'Tipo de Manutenção': 'Predial',
      'Prioridade': 'Média',
      'Descreva o serviço...': 'Teste de conexão',
      'Upload de Foto do Problema': ''
    };
    
    // Simular evento do formulário
    const mockEvent = {
      postData: {
        contents: JSON.stringify(mockFormData)
      }
    };
    
    // Chamar doPost com dados simulados
    const result = doPost(mockEvent);
    
    if (result) {
      const response = JSON.parse(result.getContent());
      if (response.success) {
        console.log('✅ Teste de conexão bem-sucedido!');
        return 'Conexão OK!';
      } else {
        console.log('❌ Teste de conexão falhou:', response.error);
        return 'Erro: ' + response.error;
      }
    } else {
      console.log('❌ Teste de conexão falhou: Sem resposta');
      return 'Erro: Sem resposta';
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    return 'Erro: ' + error.toString();
  }
}
