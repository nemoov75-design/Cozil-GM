# Configuração do Google Forms para Sistema Cozil

## 📋 Passo a Passo para Configurar a Integração

### 1. Configurar o Supabase

1. Acesse o Supabase: https://fshmmbprwsfwkpkgtaww.supabase.co
2. Vá para **SQL Editor**
3. Execute o script SQL do arquivo `supabase-schema.sql`
4. Verifique se a tabela `work_orders` foi criada

### 2. Configurar o Google Apps Script

1. Acesse: https://script.google.com
2. Clique em **"Novo Projeto"**
3. Cole o código do arquivo `google-forms-script.js`
4. **IMPORTANTE**: Substitua a URL do webhook na linha:
   ```javascript
   const webhookUrl = 'https://seu-dominio.com/api/webhook/google-forms';
   ```
   Pela URL do seu sistema (ex: `http://localhost:3000/api/webhook/google-forms`)

### 3. Configurar o Google Forms

1. No seu Google Form, vá em **"Respostas"** → **"Mais"** → **"Script do Apps"**
2. Selecione o script que você criou
3. Configure o trigger:
   - **Tipo de evento**: "Envio de formulário"
   - **Função**: `onSubmit`

### 4. Testar a Integração

1. Envie um formulário de teste
2. Verifique se os dados aparecem no Supabase
3. Verifique se aparecem no seu sistema

## 🔧 Configurações Adicionais

### Variáveis de Ambiente (Opcional)

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://fshmmbprwsfwkpkgtaww.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzaG1tYnByd3Nmd2twa2d0YXd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NDIzOTYsImV4cCI6MjA3NTExODM5Nn0.atKM3zLSMJvlFkYOdWJuUbs-JTnwIH-9yqoVUeulCr8
```

### Estrutura dos Dados

O sistema espera os seguintes campos do Google Forms:

- **Solicitante**: Nome da pessoa que fez a solicitação
- **Setor**: Setor da empresa
- **Data da solicitação**: Data em que foi feita a solicitação
- **Local**: Local onde precisa ser feito o serviço
- **Prioridade**: Baixa, Média ou Alta
- **Tipo de Manutenção**: Predial ou Mecânica
- **Descreva o serviço...**: Descrição detalhada do serviço

## 🚨 Troubleshooting

### Se os dados não estão chegando:

1. Verifique se o webhook está acessível
2. Verifique os logs do Google Apps Script
3. Verifique se a tabela foi criada no Supabase
4. Verifique se as políticas RLS estão configuradas

### Para desenvolvimento local:

Use ngrok para expor seu localhost:
```bash
npx ngrok http 3000
```
E use a URL do ngrok no Google Apps Script.

## 📞 Suporte

Se tiver problemas, verifique:
1. Console do navegador
2. Logs do Google Apps Script
3. Logs do Supabase
4. Logs do seu sistema
