-- Script SQL para criar a tabela no Supabase
-- Execute este script no SQL Editor do Supabase

-- Criar tabela work_orders
CREATE TABLE IF NOT EXISTS work_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  solicitante TEXT NOT NULL,
  setor TEXT NOT NULL,
  data_solicitacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  local TEXT NOT NULL,
  prioridade TEXT CHECK (prioridade IN ('Baixa', 'Média', 'Alta')) DEFAULT 'Média',
  tipo_manutencao TEXT CHECK (tipo_manutencao IN ('Predial', 'Mecânica')) DEFAULT 'Predial',
  descricao TEXT NOT NULL,
  numero_os TEXT UNIQUE,
  status TEXT DEFAULT 'Pendente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status_history JSONB DEFAULT '[]'::jsonb,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_work_orders_status ON work_orders(status);
CREATE INDEX IF NOT EXISTS idx_work_orders_setor ON work_orders(setor);
CREATE INDEX IF NOT EXISTS idx_work_orders_prioridade ON work_orders(prioridade);
CREATE INDEX IF NOT EXISTS idx_work_orders_created_at ON work_orders(created_at);

-- Criar função para gerar número da OS automaticamente
CREATE OR REPLACE FUNCTION generate_os_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  year_part TEXT;
  month_part TEXT;
  sequence_part TEXT;
BEGIN
  year_part := EXTRACT(YEAR FROM NOW())::TEXT;
  month_part := LPAD(EXTRACT(MONTH FROM NOW())::TEXT, 2, '0');
  
  -- Buscar o último número da sequência do mês
  SELECT COALESCE(
    MAX(CAST(SUBSTRING(numero_os FROM 8) AS INTEGER)), 0
  ) + 1
  INTO sequence_part
  FROM work_orders
  WHERE numero_os LIKE year_part || month_part || '%';
  
  new_number := year_part || month_part || LPAD(sequence_part::TEXT, 4, '0');
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para gerar número da OS automaticamente
CREATE OR REPLACE FUNCTION trigger_generate_os_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.numero_os IS NULL OR NEW.numero_os = '' THEN
    NEW.numero_os := generate_os_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_work_orders_os_number
  BEFORE INSERT ON work_orders
  FOR EACH ROW
  EXECUTE FUNCTION trigger_generate_os_number();

-- Criar trigger para atualizar last_updated
CREATE OR REPLACE FUNCTION trigger_update_last_updated()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_work_orders_last_updated
  BEFORE UPDATE ON work_orders
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_last_updated();

-- Habilitar Row Level Security (RLS)
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir leitura e escrita para usuários autenticados
CREATE POLICY "Permitir acesso completo para usuários autenticados" ON work_orders
  FOR ALL USING (auth.role() = 'authenticated');

-- Criar política para permitir inserção via webhook (sem autenticação)
CREATE POLICY "Permitir inserção via webhook" ON work_orders
  FOR INSERT WITH CHECK (true);
