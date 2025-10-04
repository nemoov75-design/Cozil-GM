# Instruções para Deploy - Cozil

## 🚀 Passos para Deploy

### 1. Criar Repositório no GitHub

1. Acesse: https://github.com/new
2. Nome do repositório: `cozil`
3. Descrição: `Cozil - Sistema de Manutenção - Next.js + Supabase`
4. Marque como **Público**
5. **NÃO** marque "Add a README file"
6. Clique em **"Create repository"**

### 2. Fazer Push do Código

Após criar o repositório, execute:

```bash
git remote add origin https://github.com/SEU_USUARIO/cozil.git
git branch -M main
git push -u origin main
```

### 3. Deploy na Vercel

1. Acesse: https://vercel.com
2. Clique em **"New Project"**
3. Conecte com o GitHub
4. Selecione o repositório `cozil`
5. Clique em **"Deploy"**

### 4. Configurar Variáveis de Ambiente na Vercel

Na Vercel, vá em **Settings** → **Environment Variables** e adicione:

```
NEXT_PUBLIC_SUPABASE_URL = https://fshmmbprwsfwkpkgtaww.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzaG1tYnByd3Nmd2twa2d0YXd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NDIzOTYsImV4cCI6MjA3NTExODM5Nn0.atKM3zLSMJvlFkYOdWJuUbs-JTnwIH-9yqoVUeulCr8
NEXTAUTH_SECRET = seu_secret_aqui
NEXTAUTH_URL = https://cozil.vercel.app
```

### 5. Atualizar Script do Google Forms

Após o deploy, atualize o arquivo `google-forms-script.js`:

```javascript
const webhookUrl = 'https://cozil.vercel.app/api/webhook/google-forms';
```

### 6. Configurar Supabase

Execute o script SQL no Supabase:
- Acesse: https://fshmmbprwsfwkpkgtaww.supabase.co
- Vá em **SQL Editor**
- Cole o conteúdo do arquivo `supabase-schema.sql`
- Execute o script

## ✅ Checklist de Deploy

- [ ] Repositório criado no GitHub
- [ ] Código enviado para o GitHub
- [ ] Deploy feito na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Script do Google Forms atualizado
- [ ] Supabase configurado
- [ ] Teste de integração funcionando

## 🔗 URLs Importantes

- **GitHub**: https://github.com/SEU_USUARIO/cozil
- **Vercel**: https://cozil.vercel.app
- **Supabase**: https://fshmmbprwsfwkpkgtaww.supabase.co

## 📞 Suporte

Se tiver problemas, verifique:
1. Logs da Vercel
2. Logs do Supabase
3. Console do navegador
4. Configurações do Google Apps Script
