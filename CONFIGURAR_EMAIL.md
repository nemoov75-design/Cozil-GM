# 📧 Configuração de E-mail com Resend (SUPER FÁCIL!)

## ✅ Vantagens do Resend:
- ✨ Muito mais fácil que Gmail
- 🚀 100 e-mails/dia GRÁTIS
- 🔑 Só precisa de 1 API Key
- ⚡ Configuração em 2 minutos

## 🔧 Como Configurar:

### Passo 1: Sua API Key do Resend

Você já tem a API Key: `re_aZfximsA_7hFTe74eSJiypxD7Wns2jHx8`

### Passo 2: Criar arquivo .env.local

**OPÇÃO 1 - Copiar e colar (mais fácil):**

1. Crie um arquivo chamado `.env.local` na raiz do projeto
2. Cole este conteúdo:

```
RESEND_API_KEY=re_aZfximsA_7hFTe74eSJiypxD7Wns2jHx8
```

**OPÇÃO 2 - Via terminal (mais rápido):**

Execute este comando no PowerShell:

```powershell
echo "RESEND_API_KEY=re_aZfximsA_7hFTe74eSJiypxD7Wns2jHx8" | Out-File -FilePath ".env.local" -Encoding UTF8
```

**Pronto! É só isso! 🎉**

Agora reinicie o servidor (`Ctrl+C` e rode novamente) para carregar as variáveis.

### Passo 3: Configurar Destinatários

Edite o arquivo `app/api/send-monthly-report/route.ts` na linha 18-21:

```typescript
const users = [
  { email: 'email-destinatario@exemplo.com', name: 'Nome do Destinatário' },
  // Adicione mais destinatários aqui
]
```

### Passo 4: Reiniciar o Servidor

Após criar o `.env.local`, reinicie o servidor Next.js:

```bash
# Pare o servidor (Ctrl+C)
# Inicie novamente
npm run dev
```

### Passo 3: Reiniciar o Servidor

Após criar o `.env.local`, reinicie o servidor Next.js:

1. Pare o servidor (pressione `Ctrl+C` no terminal)
2. Inicie novamente: `npm run dev`

## 🎯 Como Funciona:

- O sistema enviará relatórios mensais por e-mail
- Remetente: `CozilTech <onboarding@resend.dev>`
- Destinatários: `nemoov75@gmail.com` (e outros que você adicionar)
- Conteúdo: Relatório completo com estatísticas de OSs do mês

## 🔐 Segurança:

- O arquivo `.env.local` já está no `.gitignore`
- Suas credenciais NÃO serão enviadas para o GitHub
- A API Key é segura e fácil de renovar se necessário

## ✅ Testar o Envio:

Acesse no sistema: **Relatórios** → **Enviar Relatório Mensal**

Se aparecer erro, verifique:
1. API Key correta no `.env.local`
2. Arquivo `.env.local` na raiz do projeto
3. Servidor reiniciado após criar o arquivo

## 📝 Nota sobre o Email Remetente:

- Por padrão, o Resend usa `onboarding@resend.dev` como remetente
- Para usar seu próprio domínio (ex: `relatorio@cozil.com.br`), você precisa:
  1. Adicionar seu domínio no painel do Resend
  2. Configurar os registros DNS
  3. Alterar o `from` no código para seu domínio verificado

## ⚠️ IMPORTANTE - Limitação do Resend (Plano Gratuito):

No plano gratuito, o Resend só permite enviar e-mails para:
- E-mails de teste (delivered@resend.dev)
- Domínios que você verificou no painel

**Para enviar para qualquer e-mail (Gmail, etc), você precisa:**
1. Verificar seu domínio no Resend, OU
2. Usar outro serviço como **Brevo** (permite 300 e-mails/dia para qualquer destinatário)

