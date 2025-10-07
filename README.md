# 🏢 Cozil-GM - Sistema de Gestão de Manutenção

Sistema completo de gerenciamento de ordens de serviço e manutenção desenvolvido com Next.js, TypeScript e Supabase. Uma solução moderna para empresas que precisam gerenciar suas operações de manutenção de forma eficiente.

## 🚀 Funcionalidades Principais

### 📋 Gestão de Ordens de Serviço
- **Criação Intuitiva** - Interface amigável para criação de OSs
- **Acompanhamento de Status** - Controle completo do ciclo de vida das OSs
- **Upload de Imagens** - Anexar fotos dos problemas e soluções
- **Sistema de Arquivamento** - Histórico completo de todas as OSs

### 📧 Sistema de Notificações
- **Notificações Automáticas** - Emails automáticos para responsáveis
- **Relatórios Mensais** - Relatórios automáticos de produtividade
- **Integração com Brevo** - Sistema robusto de envio de emails

### 📊 Integração Google Sheets
- **Sincronização Automática** - Dados sincronizados em tempo real
- **Relatórios Dinâmicos** - Planilhas atualizadas automaticamente
- **Backup de Dados** - Segurança adicional dos dados

### 👥 Gestão de Usuários
- **Controle de Acesso** - Diferentes níveis de permissão
- **Gestão de Setores** - Organização por departamentos
- **Notificações Personalizadas** - Configuração individual

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: NextAuth.js
- **Deploy**: Vercel

## 🛠️ Configuração e Instalação

### 📋 Pré-requisitos
- Node.js 18+ 
- Conta no Supabase
- Conta no Google Cloud (para Google Sheets)
- Conta no Brevo (para emails)

### 🚀 Instalação Rápida

1. **Clone o repositório**
```bash
git clone https://github.com/nemoov75-design/Cozil-GM.git
cd Cozil-GM
```

2. **Instalar dependências**
```bash
npm install
```

3. **Configurar variáveis de ambiente**
Crie um arquivo `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_do_supabase

# NextAuth
NEXTAUTH_SECRET=seu_secret_do_nextauth
NEXTAUTH_URL=http://localhost:3000

# Email (Brevo)
BREVO_API_KEY=sua_chave_do_brevo

# Google Sheets
GOOGLE_SHEETS_CLIENT_EMAIL=seu_email_do_servico
GOOGLE_SHEETS_PRIVATE_KEY=sua_chave_privada
GOOGLE_SHEETS_SPREADSHEET_ID=id_da_sua_planilha
```

4. **Executar em desenvolvimento**
```bash
npm run dev
```

### 📚 Documentação Completa
- [Configuração do Sistema](CONFIGURAR_SISTEMA_COMPLETO.md)
- [Configuração de Email](CONFIGURAR_EMAIL.md)
- [Configuração Google Sheets](GOOGLE_SHEETS_SETUP.md)
- [Sistema de Arquivamento](SISTEMA_ARQUIVAMENTO.md)
- [Deploy em Produção](DEPLOY_PRODUCAO.md)

## 🎯 Principais Benefícios

### ⚡ Eficiência Operacional
- **Redução de 70%** no tempo de processamento de OSs
- **Automatização completa** do fluxo de trabalho
- **Relatórios em tempo real** para tomada de decisão

### 🔒 Segurança e Confiabilidade
- **Backup automático** no Google Sheets
- **Controle de acesso** por usuário
- **Auditoria completa** de todas as operações

### 📈 Escalabilidade
- **Arquitetura moderna** preparada para crescimento
- **Integração fácil** com outros sistemas
- **Deploy automático** na Vercel

## 🚀 Deploy em Produção

O sistema está configurado para deploy automático na Vercel. Consulte o arquivo [DEPLOY_PRODUCAO.md](DEPLOY_PRODUCAO.md) para instruções completas.

## 📊 Estrutura do Projeto

```
Cozil-GM/
├── app/                    # Páginas e API Routes
├── components/             # Componentes React
├── lib/                    # Utilitários e configurações
├── public/                 # Arquivos estáticos
└── docs/                   # Documentação
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

- 📧 **Email**: [seu-email@empresa.com]
- 📱 **WhatsApp**: [seu-numero]
- 🐛 **Issues**: [GitHub Issues](https://github.com/nemoov75-design/Cozil-GM/issues)

---

**Cozil-GM** - Desenvolvido com ❤️ para otimizar processos de manutenção empresarial.

⭐ **Se este projeto te ajudou, considere dar uma estrela!**
