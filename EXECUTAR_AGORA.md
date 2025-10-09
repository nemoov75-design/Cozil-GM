# 🚀 COLOCAR EM PRODUÇÃO - PASSO A PASSO

## 1️⃣ LIMPAR DADOS FICTÍCIOS NO SUPABASE

### 📋 Copie este SQL e execute no Supabase:

1. Acesse: **https://supabase.com/dashboard**
2. Abra seu projeto: **fshmmbprwsfwkpkgtaww**
3. Vá em: **SQL Editor** (menu lateral)
4. Clique em: **New query**
5. Cole o código abaixo:

```sql
-- 🗑️ LIMPEZA COMPLETA PARA PRODUÇÃO

-- 1. Apagar TODAS as Ordens de Serviço fictícias
DELETE FROM work_orders;

-- 2. Apagar TODOS os Usuários fictícios
DELETE FROM users;

-- 3. Resetar contadores (para começar do 1)
ALTER SEQUENCE work_orders_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 1;

-- ✅ PRONTO! Banco de dados limpo
```

6. Clique em: **RUN** (ou pressione Ctrl+Enter)
7. ✅ Aguarde a mensagem de sucesso

---

## 2️⃣ LIMPAR GOOGLE SHEETS

1. Acesse: **https://docs.google.com/spreadsheets/d/1bmM5tuSnxHXEsgsvxMCQBOdjCcMzwSvhoB12uhstpG8**
2. Selecione todas as linhas de dados (exceto a linha 1 com os cabeçalhos)
3. Botão direito → **Excluir linhas**
4. Ou simplesmente delete as abas inteiras (serão recriadas automaticamente)

---

## 3️⃣ CADASTRAR USUÁRIOS REAIS

Após limpar, cadastre os usuários reais no Supabase SQL Editor:

```sql
-- Cadastrar usuários reais da empresa
INSERT INTO users (name, email, setor, cargo, telefone, receive_notifications, active) VALUES
('Seu Nome', 'seuemail@empresa.com', 'TI', 'Administrador', '(11) 99999-9999', true, true),
('Gerente Manutenção', 'gerente@empresa.com', 'Manutenção', 'Gerente', '(11) 88888-8888', true, true);

-- Adicione mais usuários conforme necessário
```

---

## 4️⃣ FAZER COMMIT E PUSH

```powershell
cd "C:\Users\apoll\OneDrive\Área de Trabalho\Sistema-cozil"
git add .
git commit -m "Sistema pronto para produção - Dados limpos e arquivamento implementado"
git push origin master
```

---

## 5️⃣ VERIFICAR DEPLOY NO VERCEL

O Vercel detecta automaticamente o push e faz o deploy!

1. Acesse: **https://vercel.com**
2. Abra seu projeto
3. Aguarde o deploy finalizar (2-3 minutos)
4. ✅ Acesse a URL de produção

---

## 6️⃣ TESTAR EM PRODUÇÃO

Na URL de produção:

- ✅ Criar uma OS de teste
- ✅ Verificar se o email foi enviado
- ✅ Verificar se sincronizou no Google Sheets
- ✅ Testar editar OS
- ✅ Testar mudar status
- ✅ Verificar aba "Histórico"

---

## ✅ PRONTO!

Sistema 100% limpo e pronto para produção! 🎉



