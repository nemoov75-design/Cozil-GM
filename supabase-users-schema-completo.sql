-- 🗄️ SCHEMA COMPLETO DA TABELA DE USUÁRIOS COM AUTENTICAÇÃO
-- Execute este SQL no Supabase (SQL Editor)

-- 1. Adicionar coluna password se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='users' AND column_name='password'
    ) THEN
        ALTER TABLE users ADD COLUMN password VARCHAR(255);
    END IF;
END $$;

-- 2. Atualizar tabela para garantir que todos os campos existem
DO $$
BEGIN
    -- Adicionar campo setor se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='users' AND column_name='setor'
    ) THEN
        ALTER TABLE users ADD COLUMN setor VARCHAR(100);
    END IF;
    
    -- Adicionar campo cargo se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='users' AND column_name='cargo'
    ) THEN
        ALTER TABLE users ADD COLUMN cargo VARCHAR(100);
    END IF;
    
    -- Adicionar campo telefone se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='users' AND column_name='telefone'
    ) THEN
        ALTER TABLE users ADD COLUMN telefone VARCHAR(20);
    END IF;
    
    -- Adicionar campo receive_notifications se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='users' AND column_name='receive_notifications'
    ) THEN
        ALTER TABLE users ADD COLUMN receive_notifications BOOLEAN DEFAULT true;
    END IF;
    
    -- Adicionar campo active se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='users' AND column_name='active'
    ) THEN
        ALTER TABLE users ADD COLUMN active BOOLEAN DEFAULT true;
    END IF;
END $$;

-- 3. Atualizar usuários existentes sem senha
UPDATE users 
SET password = 'senha123' 
WHERE password IS NULL OR password = '';

-- 4. Tornar password obrigatório
ALTER TABLE users ALTER COLUMN password SET NOT NULL;

-- 5. Inserir usuários de exemplo (se não existirem)
INSERT INTO users (name, email, password, setor, cargo, telefone, receive_notifications, active)
VALUES 
  ('Administrador Cozil', 'admin@cozil.com', 'admin123', 'TI', 'Administrador', '(11) 99999-9999', true, true),
  ('Técnico Cozil', 'tecnico@cozil.com', 'tecnico123', 'Manutenção', 'Técnico', '(11) 88888-8888', true, true),
  ('Gestor Cozil', 'gestor@cozil.com', 'gestor123', 'Gestão', 'Gestor', '(11) 77777-7777', true, true)
ON CONFLICT (email) DO NOTHING;

-- ✅ PRONTO! Tabela atualizada com sistema de autenticação completo

