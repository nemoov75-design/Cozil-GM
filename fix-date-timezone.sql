-- Corrigir problema de timezone na coluna data_solicitacao
-- Execute este SQL no Supabase SQL Editor

-- 1. Garantir que data_solicitacao seja do tipo DATE (sem timestamp)
ALTER TABLE work_orders 
ALTER COLUMN data_solicitacao TYPE DATE;

-- 2. Atualizar registros existentes que podem ter timezone incorreto
-- Converter usando a data local (não UTC)
UPDATE work_orders 
SET data_solicitacao = (created_at AT TIME ZONE 'America/Sao_Paulo')::date
WHERE data_solicitacao IS NULL OR data_solicitacao < '2025-01-01';

-- 3. Para OSs criadas recentemente, ajustar a data
UPDATE work_orders 
SET data_solicitacao = (created_at AT TIME ZONE 'America/Sao_Paulo')::date
WHERE created_at >= '2025-10-06' AND data_solicitacao = '2025-10-05';

-- 4. Verificar as datas atualizadas
SELECT 
  numero_os,
  data_solicitacao,
  created_at,
  (created_at AT TIME ZONE 'America/Sao_Paulo')::date as data_sp
FROM work_orders 
ORDER BY created_at DESC 
LIMIT 10;


