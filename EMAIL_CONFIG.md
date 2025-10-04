# 📧 Configuração de Email para Relatórios Automáticos

## 🔧 Configuração Necessária

Para o sistema de envio automático de relatórios funcionar, você precisa configurar as variáveis de ambiente:

### 1. **Variáveis de Ambiente (.env.local)**

```bash
# Configuração de Email
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app

# URL da aplicação
NEXT_PUBLIC_APP_URL=https://cozil-sistema-qxrx.vercel.app
```

### 2. **Configuração do Gmail**

1. **Ative a verificação em 2 etapas** na sua conta Google
2. **Gere uma senha de app**:
   - Vá em: Conta Google → Segurança → Verificação em 2 etapas
   - Clique em "Senhas de app"
   - Gere uma senha para "Email"
   - Use essa senha no `EMAIL_PASS`

### 3. **Outros Provedores de Email**

#### **Outlook/Hotmail:**
```bash
EMAIL_USER=seu-email@outlook.com
EMAIL_PASS=sua-senha
```

#### **Yahoo:**
```bash
EMAIL_USER=seu-email@yahoo.com
EMAIL_PASS=sua-senha-de-app
```

## 🚀 Como Funciona

### **📅 Agendamento Automático**
- **Frequência:** Último dia de cada mês às 18:00
- **Fuso horário:** America/Sao_Paulo
- **Execução:** Automática via cron job

### **👥 Destinatários**
- Todos os usuários cadastrados no sistema
- Lista atualizada automaticamente
- Emails coletados do localStorage

### **📊 Conteúdo do Relatório**
- **Resumo executivo** com estatísticas
- **Análise de performance** do mês
- **Recomendações inteligentes**
- **Design profissional** em HTML

## 🛠️ Configuração no Vercel

### **1. Adicionar Variáveis de Ambiente:**

1. Acesse o painel do Vercel
2. Vá em Settings → Environment Variables
3. Adicione:
   - `EMAIL_USER` = seu-email@gmail.com
   - `EMAIL_PASS` = sua-senha-de-app
   - `NEXT_PUBLIC_APP_URL` = https://cozil-sistema-qxrx.vercel.app

### **2. Deploy das Alterações:**

```bash
git add .
git commit -m "feat: Adicionar sistema de relatórios por email"
git push
```

## 🧪 Testando o Sistema

### **1. Teste Manual:**
```bash
# Executar localmente
node scripts/schedule-monthly-report.js
```

### **2. Teste via Interface:**
- Acesse "Configurações" no sistema
- Clique em "Relatórios por Email"
- Use o botão "Enviar Relatório Agora"

### **3. Verificar Logs:**
- Console do navegador
- Logs do Vercel
- Status dos emails enviados

## 📋 Checklist de Configuração

- [ ] Variáveis de ambiente configuradas
- [ ] Senha de app do Gmail gerada
- [ ] Deploy realizado no Vercel
- [ ] Teste manual executado
- [ ] Emails de teste recebidos
- [ ] Agendamento automático ativo

## 🔍 Solução de Problemas

### **Erro: "Invalid login"**
- Verifique se a senha de app está correta
- Confirme se a verificação em 2 etapas está ativa

### **Erro: "Connection timeout"**
- Verifique a conexão com a internet
- Confirme se o Gmail permite conexões de apps

### **Emails não chegam**
- Verifique a pasta de spam
- Confirme se os emails dos usuários estão corretos
- Teste com seu próprio email primeiro

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs do console
2. Teste com um email simples primeiro
3. Confirme as configurações de ambiente
4. Verifique se o Vercel está processando as variáveis

---

**🎉 Sistema de relatórios automáticos configurado com sucesso!**
