-- ========================================
-- DELETAR A ÚNICA OS DE TESTE
-- ========================================
-- Execute este SQL no Supabase SQL Editor
-- https://supabase.com → Seu Projeto → SQL Editor

-- PASSO 1: Ver qual OS existe (para confirmar antes de deletar)
SELECT 
  id,
  numero_os,
  solicitante,
  setor,
  equipamento,
  descricao,
  created_at,
  status
FROM work_orders
ORDER BY created_at DESC
LIMIT 5;

-- PASSO 2: DELETAR a OS de teste
-- Como só tem 1 OS, este comando vai deletar ela
DELETE FROM work_orders;

-- OU se quiser deletar apenas a OS específica, use um destes:
-- DELETE FROM work_orders WHERE numero_os = 'OS-20251007-986';
-- DELETE FROM work_orders WHERE id = 'f1affbb7-8f3b-4369-ad9f-678d54528c9a';

-- PASSO 3: Confirmar que foi deletada (deve retornar 0)
SELECT COUNT(*) as total_os FROM work_orders;

