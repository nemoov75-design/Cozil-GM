# 🚀 Sistema Completo de Notificações e Cadastro - CozilTech

## ✅ O que foi implementado:

### 1. **Tabela de Usuários no Supabase**
- Criado schema SQL para gerenciar usuários
- Campos: nome, email, setor, cargo, telefone, notificações
- Sistema de usuários ativos/inativos

### 2. **API de Cadastro de Usuários**
- `POST /api/users` - Cadastrar novo usuário
- `GET /api/users` - Listar todos os usuários
- `DELETE /api/users?id=xxx` - Deletar usuário

### 3. **Sistema de Notificações Automáticas**
- **Envio automático de e-mail quando criar uma OS**
- E-mail enviado para todos os usuários cadastrados
- E-mail com detalhes completos da OS

### 4. **E-mail Detalhado de Nova OS**
- Número da OS
- Prioridade (com cores)
- Solicitante e setor
- Data e local
- Descrição completa
- Status atual
- Fotos anexadas (se houver)

---

## 📋 PASSO A PASSO PARA CONFIGURAR:

### **PASSO 1: Criar Tabela de Usuários no Supabase**

1. Acesse: https://fshmmbprwsfwkpkgtaww.supabase.co
2. Vá em **SQL Editor**
3. Copie e cole TODO o conteúdo do arquivo `supabase-users-schema.sql`
4. Click em **Run** para executar
5. Verifique se a tabela foi criada: vá em **Table Editor** → `users`

### **PASSO 2: Verificar se os Usuários Foram Criados**

No Supabase, vá em **Table Editor** → `users` e verifique se tem:
- ✅ Gustavo (nemoov75@gmail.com)
- ✅ Gustavo Henrique (gustavohenrique010100@gmail.com)

### **PASSO 3: Testar o Sistema**

1. **Criar uma nova OS** no sistema
2. **Verificar os logs** no terminal (deve aparecer "📧 Enviando notificação de nova OS...")
3. **Checar os e-mails** - todos os usuários cadastrados devem receber

---

## 🎯 Como Funciona:

### **Fluxo Completo:**

1. **Usuário cria uma OS** no sistema
2. **OS é salva no Supabase**
3. **Sistema busca todos os usuários ativos** que recebem notificações
4. **Envia e-mail para cada usuário** com os detalhes da OS
5. **Notificação enviada!** ✅

### **Cadastro de Novos Usuários:**

Para cadastrar um novo usuário, faça uma requisição POST:

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "setor": "Manutenção",
    "cargo": "Técnico",
    "telefone": "(11) 99999-9999",
    "receive_notifications": true
  }'
```

### **Desativar Notificações de um Usuário:**

No Supabase, edite o usuário e altere:
- `receive_notifications` = `false`

Ou desative o usuário:
- `active` = `false`

---

## 📧 Formato do E-mail de Notificação:

O e-mail enviado contém:

✅ **Cabeçalho vermelho** com título "Nova Ordem de Serviço"  
✅ **Badge de prioridade** (Alta/Média/Baixa) com cores  
✅ **Tabela com todos os detalhes** da OS  
✅ **Descrição completa** do problema  
✅ **Status atual** da OS  
✅ **Quantidade de fotos** anexadas  
✅ **Rodapé profissional** com branding  

---

## 🔧 APIs Disponíveis:

### **1. Gerenciar Usuários**
- `GET /api/users` - Listar usuários
- `POST /api/users` - Criar usuário
- `DELETE /api/users?id=xxx` - Deletar usuário

### **2. Enviar Notificação Manual**
- `POST /api/send-os-notification` 
- Body: `{ "osId": "id-da-os" }`

### **3. Criar OS (já envia notificação automática)**
- `POST /api/os` - Cria OS e envia notificação

---

## ✅ Checklist de Verificação:

- [ ] Tabela `users` criada no Supabase
- [ ] Usuários de exemplo cadastrados
- [ ] Variável `BREVO_API_KEY` no `.env.local`
- [ ] Testar criação de OS
- [ ] Verificar e-mails recebidos
- [ ] Cadastrar mais usuários se necessário

---

## 🚨 Troubleshooting:

### **E-mails não chegam:**
1. Verifique se `BREVO_API_KEY` está no `.env.local`
2. Confirme que usuários têm `receive_notifications = true`
3. Confirme que usuários têm `active = true`
4. Veja os logs no terminal

### **Erro ao criar OS:**
1. Verifique se a tabela `users` existe no Supabase
2. Veja os logs no terminal para detalhes do erro
3. Certifique-se que o Supabase está acessível

### **Usuários não aparecem:**
1. Execute o SQL no Supabase para criar a tabela
2. Insira usuários manualmente se necessário
3. Use a API POST /api/users para cadastrar

---

## 📝 Próximos Passos:

1. **Criar interface de gerenciamento de usuários** no frontend
2. **Adicionar filtros** (enviar só para setor específico)
3. **Histórico de notificações** enviadas
4. **Templates de e-mail** personalizáveis

---

**🎉 Sistema totalmente funcional e em sincronia com Supabase!**




