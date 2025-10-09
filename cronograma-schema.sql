-- 🗓️ CRONOGRAMA DE MANUTENÇÃO PREVENTIVA - CozilTech
-- Execute este script no SQL Editor do Supabase

-- Criar tabela para cronograma de manutenção preventiva
CREATE TABLE IF NOT EXISTS cronograma_manutencao (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  equipamento TEXT NOT NULL,
  local TEXT NOT NULL,
  tipo_manutencao TEXT NOT NULL,
  data_programada DATE NOT NULL,
  hora_programada TIME,
  responsavel TEXT,
  prioridade TEXT CHECK (prioridade IN ('Baixa', 'Média', 'Alta')) DEFAULT 'Média',
  status TEXT CHECK (status IN ('Agendada', 'Em Andamento', 'Concluída', 'Cancelada', 'Atrasada')) DEFAULT 'Agendada',
  observacoes TEXT,
  os_gerada_id UUID REFERENCES work_orders(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_cronograma_data ON cronograma_manutencao(data_programada);
CREATE INDEX IF NOT EXISTS idx_cronograma_status ON cronograma_manutencao(status);
CREATE INDEX IF NOT EXISTS idx_cronograma_equipamento ON cronograma_manutencao(equipamento);
CREATE INDEX IF NOT EXISTS idx_cronograma_responsavel ON cronograma_manutencao(responsavel);

-- Criar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION trigger_update_cronograma_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cronograma_updated_at
  BEFORE UPDATE ON cronograma_manutencao
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_cronograma_updated_at();

-- Habilitar Row Level Security (RLS)
ALTER TABLE cronograma_manutencao ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir acesso completo para usuários autenticados
CREATE POLICY "Permitir acesso completo para usuários autenticados" ON cronograma_manutencao
  FOR ALL USING (auth.role() = 'authenticated');

-- Criar política para permitir inserção via webhook (sem autenticação)
CREATE POLICY "Permitir inserção via webhook" ON cronograma_manutencao
  FOR INSERT WITH CHECK (true);

-- Inserir alguns dados de exemplo
INSERT INTO cronograma_manutencao (equipamento, local, tipo_manutencao, data_programada, hora_programada, responsavel, prioridade, observacoes) VALUES
('Ar Condicionado - Sala 1', 'Sala de Reuniões', 'Limpeza de Filtros', CURRENT_DATE + INTERVAL '7 days', '09:00', 'João Silva', 'Média', 'Limpeza mensal dos filtros do ar condicionado'),
('Elevador Principal', 'Prédio Principal', 'Inspeção Geral', CURRENT_DATE + INTERVAL '14 days', '08:00', 'Maria Santos', 'Alta', 'Inspeção trimestral completa do elevador'),
('Gerador de Emergência', 'Subsolo', 'Teste de Funcionamento', CURRENT_DATE + INTERVAL '21 days', '10:00', 'Carlos Oliveira', 'Alta', 'Teste mensal do gerador de emergência'),
('Sistema de Incêndio', 'Prédio Todo', 'Verificação de Sensores', CURRENT_DATE + INTERVAL '30 days', '14:00', 'Ana Costa', 'Alta', 'Verificação semestral de todos os sensores');

-- ✅ CRONOGRAMA DE MANUTENÇÃO PREVENTIVA CRIADO COM SUCESSO!
