// 🗑️ LIMPAR GOOGLE SHEETS PARA PRODUÇÃO
// Execute este script no Google Apps Script

function limparDadosProducao() {
  console.log('🗑️ Iniciando limpeza do Google Sheets...');
  
  // IDs das planilhas (substitua pelos seus)
  const SPREADSHEET_ID = 'SUA_PLANILHA_ID_AQUI';
  const SHEET_ATIVAS = '📋 Ordens Ativas';
  const SHEET_HISTORICO = '📜 Histórico Completo';
  
  try {
    // Abrir planilha
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Limpar planilha de OSs Ativas
    const sheetAtivas = spreadsheet.getSheetByName(SHEET_ATIVAS);
    if (sheetAtivas) {
      // Manter apenas cabeçalho (linha 1)
      const lastRow = sheetAtivas.getLastRow();
      if (lastRow > 1) {
        sheetAtivas.getRange(2, 1, lastRow - 1, sheetAtivas.getLastColumn()).clear();
        console.log('✅ Planilha "Ordens Ativas" limpa');
      }
    }
    
    // Limpar planilha de Histórico
    const sheetHistorico = spreadsheet.getSheetByName(SHEET_HISTORICO);
    if (sheetHistorico) {
      // Manter apenas cabeçalho (linha 1)
      const lastRow = sheetHistorico.getLastRow();
      if (lastRow > 1) {
        sheetHistorico.getRange(2, 1, lastRow - 1, sheetHistorico.getLastColumn()).clear();
        console.log('✅ Planilha "Histórico Completo" limpa');
      }
    }
    
    console.log('🎉 Google Sheets limpo com sucesso!');
    console.log('✅ Sistema pronto para produção!');
    
  } catch (error) {
    console.error('❌ Erro ao limpar Google Sheets:', error);
  }
}

// Executar limpeza
limparDadosProducao();

