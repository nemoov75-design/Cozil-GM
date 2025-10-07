-- Corrigir tabela work_orders para funcionar com o sistema
-- Execute este SQL no Supabase SQL Editor

-- Adicionar colunas que estão faltando
ALTER TABLE work_orders 
ADD COLUMN IF NOT EXISTS equipamento VARCHAR(255),
ADD COLUMN IF NOT EXISTS local VARCHAR(255),
ADD COLUMN IF NOT EXISTS tipo_manutencao VARCHAR(100),
ADD COLUMN IF NOT EXISTS data_solicitacao DATE,
ADD COLUMN IF NOT EXISTS responsavel_setor VARCHAR(255),
ADD COLUMN IF NOT EXISTS fotos JSONB DEFAULT '[]';

-- Atualizar dados existentes (equipamento = local se não tiver)
UPDATE work_orders 
SET equipamento = COALESCE(equipamento, local, 'Não especificado')
WHERE equipamento IS NULL;

-- Atualizar tipo_manutencao padrão
UPDATE work_orders 
SET tipo_manutencao = COALESCE(tipo_manutencao, 'Predial')
WHERE tipo_manutencao IS NULL;

-- Atualizar data_solicitacao
UPDATE work_orders 
SET data_solicitacao = COALESCE(data_solicitacao::date, created_at::date)
WHERE data_solicitacao IS NULL;

-- Verificar estrutura atualizada
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'work_orders' 
ORDER BY ordinal_position;


