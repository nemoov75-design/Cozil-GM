-- 🗑️ LIMPEZA COMPLETA PARA PRODUÇÃO
-- ⚠️ ATENÇÃO: Este script vai APAGAR TODOS os dados fictícios!

-- 1. Limpar todas as OSs (Ordens de Serviço)
DELETE FROM work_orders;

-- 2. Limpar todos os tokens FCM
DELETE FROM fcm_tokens;

-- 3. Limpar todos os usuários (exceto se quiser manter alguns)
-- DELETE FROM users;

-- 4. Verificar se está limpo
SELECT 'OSs restantes:' as tipo, COUNT(*) as quantidade FROM work_orders
UNION ALL
SELECT 'Tokens FCM restantes:' as tipo, COUNT(*) as quantidade FROM fcm_tokens
UNION ALL
SELECT 'Usuários restantes:' as tipo, COUNT(*) as quantidade FROM users;

-- 5. Resetar contadores (se necessário)
-- ALTER SEQUENCE work_orders_id_seq RESTART WITH 1;

-- ✅ DADOS LIMPOS! Sistema pronto para produção!