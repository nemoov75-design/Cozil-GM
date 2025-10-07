# 🔧 Configuração das Variáveis de Ambiente - Cozil-GM

## 📋 Lista Completa de Variáveis Necessárias

### 1. **Supabase (Banco de Dados)**
```env
NEXT_PUBLIC_SUPABASE_URL=https://fshmmbprwsfwkpkgtaww.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. **NextAuth (Autenticação)**
```env
NEXTAUTH_SECRET=seu_secret_super_seguro_aqui
NEXTAUTH_URL=http://localhost:3000
```

### 3. **Brevo (Envio de Emails)**
```env
BREVO_API_KEY=xkeysib-sua_chave_do_brevo_aqui
```

### 4. **Google Sheets (Integração)**
```env
GOOGLE_SHEETS_CLIENT_EMAIL=seu-email@projeto.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_PRIVADA_AQUI...
GOOGLE_SHEETS_SPREADSHEET_ID=1bmM5tuSnxHXEsgsvxMCQBOdjCcMzwSvhoB12uhstpG8
```

---

## 🚀 **PASSO A PASSO PARA CONFIGURAR:**

### **PASSO 1: Criar arquivo .env.local**

1. Na raiz do projeto, crie o arquivo `.env.local`
2. Copie e cole todas as variáveis acima
3. Substitua os valores pelos seus dados reais

### **PASSO 2: Configurar Supabase**

#### **2.1. Obter URL e Chave do Supabase:**
1. Acesse: https://supabase.com/dashboard
2. Abra seu projeto: **fshmmbprwsfwkpkgtaww**
3. Vá em **Settings** → **API**
4. Copie:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### **2.2. Criar Tabelas no Supabase:**
Execute este SQL no **SQL Editor** do Supabase:

```sql
-- Tabela de usuários
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  setor VARCHAR(100),
  cargo VARCHAR(100),
  telefone VARCHAR(20),
  receive_notifications BOOLEAN DEFAULT true,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de ordens de serviço (se não existir)
CREATE TABLE work_orders (
  id SERIAL PRIMARY KEY,
  numero_os VARCHAR(50) UNIQUE NOT NULL,
  solicitante VARCHAR(255) NOT NULL,
  setor VARCHAR(100) NOT NULL,
  prioridade VARCHAR(20) NOT NULL,
  local VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'Aberta',
  data_abertura TIMESTAMP DEFAULT NOW(),
  data_fechamento TIMESTAMP,
  fotos TEXT[],
  responsavel VARCHAR(255),
  observacoes TEXT
);
```

### **PASSO 3: Configurar Brevo (Email)**

#### **3.1. Criar conta no Brevo:**
1. Acesse: https://www.brevo.com/
2. Crie uma conta gratuita
3. Vá em **SMTP & API** → **API Keys**
4. Crie uma nova chave API
5. Copie a chave → `BREVO_API_KEY`

#### **3.2. Configurar domínio (opcional):**
- Para produção, configure um domínio verificado
- Para desenvolvimento, pode usar o domínio padrão

### **PASSO 4: Configurar Google Sheets**

#### **4.1. Criar projeto no Google Cloud:**
1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto ou use existente
3. Ative a **Google Sheets API**

#### **4.2. Criar conta de serviço:**
1. Vá em **IAM & Admin** → **Service Accounts**
2. Clique em **Create Service Account**
3. Nome: `cozil-sheets-service`
4. Clique em **Create and Continue**
5. Role: **Editor** (ou **Viewer** se só leitura)
6. Clique em **Done**

#### **4.3. Gerar chave JSON:**
1. Clique na conta de serviço criada
2. Vá na aba **Keys**
3. Clique em **Add Key** → **Create new key**
4. Tipo: **JSON**
5. Baixe o arquivo JSON

#### **4.4. Extrair dados do JSON:**
Do arquivo JSON baixado, copie:
- `client_email` → `GOOGLE_SHEETS_CLIENT_EMAIL`
- `private_key` → `GOOGLE_SHEETS_PRIVATE_KEY`

#### **4.5. Criar planilha no Google Sheets:**
1. Acesse: https://docs.google.com/spreadsheets/
2. Crie uma nova planilha
3. Compartilhe com o email da conta de serviço (permissão de Editor)
4. Copie o ID da planilha da URL → `GOOGLE_SHEETS_SPREADSHEET_ID`

### **PASSO 5: Configurar NextAuth**

#### **5.1. Gerar NEXTAUTH_SECRET:**
```bash
# No terminal, execute:
openssl rand -base64 32
```
Copie o resultado → `NEXTAUTH_SECRET`

#### **5.2. Configurar NEXTAUTH_URL:**
- **Desenvolvimento**: `http://localhost:3000`
- **Produção**: `https://seu-dominio.com`

---

## 🧪 **TESTAR CONFIGURAÇÃO:**

### **1. Testar Supabase:**
```bash
# Execute no terminal:
npm run dev
```
- Acesse: http://localhost:3000
- Tente criar uma OS
- Verifique se salva no Supabase

### **2. Testar Emails:**
- Crie uma OS no sistema
- Verifique se recebeu email de notificação
- Verifique logs no terminal

### **3. Testar Google Sheets:**
- Crie uma OS
- Verifique se apareceu na planilha
- Verifique logs no terminal

---

## 🚨 **TROUBLESHOOTING:**

### **Erro de Supabase:**
- ✅ Verifique se as URLs estão corretas
- ✅ Confirme se as tabelas foram criadas
- ✅ Teste a conexão no Supabase Dashboard

### **Emails não chegam:**
- ✅ Verifique se `BREVO_API_KEY` está correto
- ✅ Confirme se a conta Brevo está ativa
- ✅ Verifique logs no terminal

### **Google Sheets não sincroniza:**
- ✅ Verifique se a conta de serviço tem permissão
- ✅ Confirme se o ID da planilha está correto
- ✅ Teste a API do Google Sheets

### **NextAuth não funciona:**
- ✅ Verifique se `NEXTAUTH_SECRET` está definido
- ✅ Confirme se `NEXTAUTH_URL` está correto
- ✅ Reinicie o servidor após mudanças

---

## 📝 **EXEMPLO DE .env.local COMPLETO:**

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://fshmmbprwsfwkpkgtaww.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzaG1tYnByd3Nmd2twZ2d0YXd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzQ4MDAsImV4cCI6MjA1MDU1MDgwMH0.exemplo

# NextAuth
NEXTAUTH_SECRET=seu_secret_super_seguro_de_32_caracteres
NEXTAUTH_URL=http://localhost:3000

# Brevo (Email)
BREVO_API_KEY=xkeysib-1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef

# Google Sheets
GOOGLE_SHEETS_CLIENT_EMAIL=cozil-sheets@seu-projeto.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n
GOOGLE_SHEETS_SPREADSHEET_ID=1bmM5tuSnxHXEsgsvxMCQBOdjCcMzwSvhoB12uhstpG8
```

---

## ✅ **CHECKLIST FINAL:**

- [ ] Arquivo `.env.local` criado
- [ ] Todas as variáveis configuradas
- [ ] Supabase conectado e tabelas criadas
- [ ] Brevo configurado e testado
- [ ] Google Sheets integrado
- [ ] NextAuth funcionando
- [ ] Sistema testado completamente

---

**🎉 Pronto! Seu sistema Cozil-GM está configurado e funcionando!**
