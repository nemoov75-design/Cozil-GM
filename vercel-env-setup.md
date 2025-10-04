# Configuração de Variáveis de Ambiente na Vercel

## 🔧 Variáveis Necessárias

Configure estas variáveis na Vercel (Settings → Environment Variables):

### Produção:
```
NEXT_PUBLIC_SUPABASE_URL = https://fshmmbprwsfwkpkgtaww.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzaG1tYnByd3Nmd2twa2d0YXd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NDIzOTYsImV4cCI6MjA3NTExODM5Nn0.atKM3zLSMJvlFkYOdWJuUbs-JTnwIH-9yqoVUeulCr8
NEXTAUTH_SECRET = sistema-cozil-secret-key-2024
NEXTAUTH_URL = https://sistema-cozil.vercel.app
```

### Desenvolvimento:
```
NEXT_PUBLIC_SUPABASE_URL = https://fshmmbprwsfwkpkgtaww.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzaG1tYnByd3Nmd2twa2d0YXd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NDIzOTYsImV4cCI6MjA3NTExODM5Nn0.atKM3zLSMJvlFkYOdWJuUbs-JTnwIH-9yqoVUeulCr8
NEXTAUTH_SECRET = sistema-cozil-secret-key-2024
NEXTAUTH_URL = http://localhost:3000
```

## 📋 Passos para Configurar:

1. Acesse o projeto na Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione cada variável clicando em **"Add New"**
4. Configure para **Production** e **Preview**
5. Clique em **"Save"**
6. Faça um novo deploy
