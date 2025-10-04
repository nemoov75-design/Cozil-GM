# Cozil - Sistema de Manutenção

Sistema completo de gerenciamento de ordens de serviço e manutenção desenvolvido com Next.js, TypeScript e Supabase.

## 🚀 Funcionalidades

- **Sistema de Autenticação** com NextAuth.js
- **Integração com Google Forms** para recebimento de solicitações
- **Banco de dados Supabase** para armazenamento
- **Interface moderna** com componentes UI
- **Sistema de notificações** por email
- **Relatórios mensais** automáticos
- **Dashboard** com métricas e gráficos

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: NextAuth.js
- **Deploy**: Vercel

## 📋 Configuração

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
Crie um arquivo `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_do_supabase
NEXTAUTH_SECRET=seu_secret_do_nextauth
NEXTAUTH_URL=http://localhost:3000
```

### 3. Executar em desenvolvimento
```bash
npm run dev
```

## 🔧 Integração Google Forms

O sistema está configurado para receber dados do Google Forms em tempo real através de webhooks.

### Configuração:
1. Execute o script SQL no Supabase (`supabase-schema.sql`)
2. Configure o Google Apps Script (`google-forms-script.js`)
3. Configure o trigger no Google Forms

## 📱 Deploy

O sistema está configurado para deploy automático na Vercel.

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação ou entre em contato com a equipe de desenvolvimento.

---

**Cozil** - Desenvolvido com ❤️ para otimizar processos de manutenção.
