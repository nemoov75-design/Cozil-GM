# CozilTech - Sistema Inteligente de Manutenção

Sistema completo de gerenciamento de ordens de serviço e manutenção desenvolvido com Next.js, TypeScript e Supabase.

## 🚀 Funcionalidades

- **Sistema de Autenticação** com NextAuth.js
- **Criação de Ordens de Serviço** diretamente no sistema
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

## 🔧 Criação de Ordens de Serviço

O sistema permite criar ordens de serviço diretamente na interface, com formulário completo e validação.

### Funcionalidades:
1. **Formulário Intuitivo** - Interface amigável para criação de OSs
2. **Validação de Dados** - Campos obrigatórios e validação automática
3. **Upload de Imagens** - Anexar fotos dos problemas
4. **Gestão Completa** - Acompanhamento do status das OSs

## 📱 Deploy

O sistema está configurado para deploy automático na Vercel.

## 📞 Suporte

Para dúvidas ou problemas, consulte a documentação ou entre em contato com a equipe de desenvolvimento.

---

**Cozil** - Desenvolvido com ❤️ para otimizar processos de manutenção.
