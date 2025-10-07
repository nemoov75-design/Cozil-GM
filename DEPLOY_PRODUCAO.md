# 🚀 GUIA DE DEPLOY PARA PRODUÇÃO

## ✅ CHECKLIST PRÉ-DEPLOY

### 1️⃣ **Limpar Dados Fictícios**

#### **No Supabase:**
1. Acesse: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Vá em **SQL Editor**
3. Copie e cole o conteúdo de `limpar-dados-producao.sql`
4. Clique em **RUN** para executar
5. ✅ Banco de dados limpo!

#### **No Google Sheets:**
1. Acesse: [https://docs.google.com/spreadsheets/d/1bmM5tuSnxHXEsgsvxMCQBOdjCcMzwSvhoB12uhstpG8](https://docs.google.com/spreadsheets/d/1bmM5tuSnxHXEsgsvxMCQBOdjCcMzwSvhoB12uhstpG8)
2. Exclua todas as linhas de dados (mantenha apenas os cabeçalhos)
3. Ou delete as abas e elas serão recriadas automaticamente

---

### 2️⃣ **Cadastrar Usuários Reais**

Depois de limpar os dados, cadastre os primeiros usuários:

```sql
-- Execute no Supabase SQL Editor
INSERT INTO users (name, email, setor, cargo, telefone, receive_notifications, active) VALUES
('Seu Nome', 'seuemail@cozil.com', 'TI', 'Administrador', '(11) 99999-9999', true, true),
('Nome Gerente', 'gerente@cozil.com', 'Manutenção', 'Gerente', '(11) 88888-8888', true, true);
-- Adicione mais usuários conforme necessário
```

---

### 3️⃣ **Fazer Deploy no Vercel**

#### **Opção A - Atualizar Deploy Existente:**

```powershell
cd "C:\Users\apoll\OneDrive\Área de Trabalho\Sistema-cozil"
git add .
git commit -m "Sistema de arquivamento implementado - Pronto para produção"
git push origin master
```

O Vercel detecta automaticamente e faz o deploy!

#### **Opção B - Deploy Manual via Vercel CLI:**

```powershell
npx vercel --prod
```

---

### 4️⃣ **Configurar Variáveis de Ambiente no Vercel**

1. Acesse: [https://vercel.com](https://vercel.com)
2. Vá no seu projeto **cozil-manutencao**
3. **Settings** → **Environment Variables**
4. Adicione/verifique:

```
NEXT_PUBLIC_SUPABASE_URL=https://fshmmbprwsfwkpkgtaww.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
BREVO_API_KEY=SUA_CHAVE_BREVO_AQUI
GOOGLE_SHEETS_CLIENT_EMAIL=planilha-zap@trans-anchor-461419-m8.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDgxaRVSwG5BHxL...
GOOGLE_SHEETS_SPREADSHEET_ID=1bmM5tuSnxHXEsgsvxMCQBOdjCcMzwSvhoB12uhstpG8
```

⚠️ **IMPORTANTE:** A `GOOGLE_SHEETS_PRIVATE_KEY` deve ter `\n` literalmente (não quebras de linha reais)

5. Clique em **Save**
6. **Redeploy** o projeto

---

### 5️⃣ **Testar em Produção**

Após o deploy:

1. ✅ Acesse a URL de produção (ex: `https://cozil-manutencao.vercel.app`)
2. ✅ Teste criar uma OS
3. ✅ Verifique se o email foi enviado
4. ✅ Verifique se sincronizou no Google Sheets
5. ✅ Teste editar uma OS
6. ✅ Teste mudar status
7. ✅ Teste o relatório mensal

---

## 🔒 SEGURANÇA

### **Backups Automáticos:**
- ✅ Supabase faz backup automático diário
- ✅ Google Sheets tem histórico de versões
- ✅ Sistema mantém 3 camadas de backup

### **Recomendações:**
1. 📥 Baixe backup mensal do Google Sheets (.xlsx)
2. 🔐 Não compartilhe as credenciais do Supabase
3. 🔐 Não compartilhe a chave do Google Service Account
4. 🔐 Não compartilhe a chave da API do Brevo

---

## 📊 MONITORAMENTO

### **Logs do Sistema:**

#### **Vercel:**
1. Acesse o projeto no Vercel
2. Vá em **Deployments**
3. Clique no último deploy
4. Vá em **Functions** para ver logs

#### **Supabase:**
1. Acesse o projeto no Supabase
2. Vá em **Database** → **Logs**
3. Monitore queries e erros

---

## 🆘 TROUBLESHOOTING

### **Problema: Email não está enviando**
**Solução:**
1. Verifique `BREVO_API_KEY` no Vercel
2. Acesse [https://app.brevo.com](https://app.brevo.com) e verifique a conta
3. Verifique se o email remetente está verificado

### **Problema: Google Sheets não sincroniza**
**Solução:**
1. Verifique as credenciais no Vercel
2. Certifique-se que a planilha está compartilhada com o email do Service Account
3. Verifique os logs no console do Vercel

### **Problema: OSs não aparecem**
**Solução:**
1. Verifique a conexão com Supabase
2. Abra o console do navegador (F12) e veja erros
3. Verifique se a URL do Supabase está correta

---

## 🎯 PRÓXIMOS PASSOS

Após o deploy em produção:

1. ✅ **Treinar usuários** - Mostre como usar o sistema
2. ✅ **Definir processos** - Quem cria OSs, quem aprova, etc.
3. ✅ **Configurar relatórios** - Definir frequência de envio
4. ✅ **Monitorar uso** - Acompanhar performance
5. ✅ **Ajustar limites** - Se necessário, mudar de 500 para outro valor

---

## 📞 SUPORTE

Se precisar de ajuda:

1. 📝 Verifique os logs (Vercel + Browser Console)
2. 📧 Entre em contato com o desenvolvedor
3. 📚 Consulte a documentação:
   - `README.md`
   - `SISTEMA_ARQUIVAMENTO.md`
   - `CONFIGURAR_EMAIL.md`
   - `GOOGLE_SHEETS_SETUP.md`

---

## ✅ CHECKLIST FINAL

Antes de liberar para os usuários:

- [ ] Dados fictícios removidos do Supabase
- [ ] Google Sheets limpo
- [ ] Usuários reais cadastrados
- [ ] Deploy feito no Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Sistema testado em produção
- [ ] Emails funcionando
- [ ] Google Sheets sincronizando
- [ ] Usuários treinados
- [ ] Documentação compartilhada

---

## 🎉 PRONTO PARA PRODUÇÃO!

Seu sistema está **100% pronto** para uso profissional! 🚀

**BOA SORTE!** 💪


