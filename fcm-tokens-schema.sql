-- Criar tabela para armazenar tokens FCM
CREATE TABLE IF NOT EXISTS fcm_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  device_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, token)
);

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_fcm_tokens_user_id ON fcm_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_fcm_tokens_token ON fcm_tokens(token);

-- Comentários da tabela
COMMENT ON TABLE fcm_tokens IS 'Armazena tokens FCM para notificações push';
COMMENT ON COLUMN fcm_tokens.user_id IS 'ID do usuário proprietário do token';
COMMENT ON COLUMN fcm_tokens.token IS 'Token FCM único do dispositivo';
COMMENT ON COLUMN fcm_tokens.device_info IS 'Informações do dispositivo (navegador, SO, etc.)';
