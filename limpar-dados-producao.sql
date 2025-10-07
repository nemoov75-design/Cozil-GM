-- 🗑️ SCRIPT PARA LIMPAR DADOS FICTÍCIOS E PREPARAR PARA PRODUÇÃO
-- ⚠️ ATENÇÃO: Este script apaga TODOS os dados das tabelas!
-- Execute este script no Supabase SQL Editor antes de colocar em produção

-- 1️⃣ Limpar todas as Ordens de Serviço
DELETE FROM work_orders;

-- 2️⃣ Limpar todos os Usuários (exceto os que você quer manter)
-- Opção A: Apagar TODOS os usuários
DELETE FROM users;

-- Opção B: Apagar apenas usuários fictícios (descomente se preferir)
-- DELETE FROM users WHERE email LIKE '%@example.com';
-- DELETE FROM users WHERE name LIKE 'Usuario%';

-- 3️⃣ Resetar os contadores de ID (para começar do 1)
ALTER SEQUENCE work_orders_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 1;

-- ✅ Pronto! Banco de dados limpo e pronto para produção
-- Agora você pode começar a usar o sistema com dados reais

-- 📝 PRÓXIMOS PASSOS:
-- 1. Execute este script no Supabase SQL Editor
-- 2. Cadastre os usuários reais no sistema
-- 3. Comece a criar OSs reais
-- 4. O Google Sheets será sincronizado automaticamente


