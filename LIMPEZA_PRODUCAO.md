# 🗑️ LIMPEZA COMPLETA PARA PRODUÇÃO

## ⚠️ **ATENÇÃO: Este processo vai APAGAR TODOS os dados fictícios!**

---

## 📋 **PASSO A PASSO COMPLETO:**

### **1. 🗄️ LIMPAR BANCO DE DADOS (Supabase)**

1. **Acesse**: https://supabase.com
2. **Clique** no projeto CozilTech
3. **Vá em**: SQL Editor
4. **Execute** o script `limpar-dados-producao.sql`:

```sql
-- 🗑️ LIMPEZA COMPLETA PARA PRODUÇÃO
-- ⚠️ ATENÇÃO: Este script vai APAGAR TODOS os dados fictícios!

-- 1. Limpar todas as OSs (Ordens de Serviço)
DELETE FROM work_orders;

-- 2. Limpar todos os tokens FCM
DELETE FROM fcm_tokens;

-- 3. Verificar se está limpo
SELECT 'OSs restantes:' as tipo, COUNT(*) as quantidade FROM work_orders
UNION ALL
SELECT 'Tokens FCM restantes:' as tipo, COUNT(*) as quantidade FROM fcm_tokens
UNION ALL
SELECT 'Usuários restantes:' as tipo, COUNT(*) as quantidade FROM users;

-- ✅ DADOS LIMPOS! Sistema pronto para produção!
```

### **2. 📊 LIMPAR GOOGLE SHEETS**

1. **Acesse**: https://docs.google.com/spreadsheets
2. **Abra** sua planilha do CozilTech
3. **Vá em**: Extensões → Apps Script
4. **Cole** o código do arquivo `limpar-google-sheets.js`
5. **Execute** a função `limparDadosProducao()`

### **3. 👥 CONFIGURAR USUÁRIOS REAIS**

1. **Acesse**: https://cozil-gm.vercel.app
2. **Vá em**: Configurações → Usuários
3. **Adicione** os usuários reais da empresa:
   - Nome completo
   - Email corporativo
   - Setor
   - Cargo
   - Telefone

### **4. 🔧 CONFIGURAR SETORES REAIS**

1. **Acesse** o sistema
2. **Vá em**: Configurações → Setores
3. **Adicione** os setores da empresa:
   - Administrativo
   - Produção
   - Manutenção
   - TI
   - etc.

### **5. 📧 CONFIGURAR EMAILS REAIS**

1. **Acesse**: https://vercel.com
2. **Vá em**: Settings → Environment Variables
3. **Atualize** `BREVO_API_KEY` com chave real
4. **Teste** envio de emails

---

## ✅ **VERIFICAÇÃO FINAL:**

### **Antes de usar em produção, verifique:**

- [ ] ✅ Banco de dados limpo (0 OSs)
- [ ] ✅ Google Sheets limpo
- [ ] ✅ Usuários reais cadastrados
- [ ] ✅ Setores reais configurados
- [ ] ✅ Emails funcionando
- [ ] ✅ Notificações funcionando
- [ ] ✅ Relatório mensal funcionando

---

## 🚀 **SISTEMA PRONTO PARA PRODUÇÃO!**

### **Funcionalidades ativas:**
- ✅ **Gestão de OSs** completa
- ✅ **Notificações** (locais + email)
- ✅ **Relatórios mensais** automáticos
- ✅ **Sincronização** com Google Sheets
- ✅ **Interface profissional**
- ✅ **Sistema robusto** e confiável

### **Próximos passos:**
1. **Treinar usuários** no sistema
2. **Configurar backup** automático
3. **Monitorar** performance
4. **Coletar feedback** dos usuários

---

## 🎉 **PARABÉNS!**

Seu sistema CozilTech está **100% funcional** e pronto para uso em produção! 🚀

