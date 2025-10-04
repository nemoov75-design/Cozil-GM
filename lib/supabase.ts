import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fshmmbprwsfwkpkgtaww.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzaG1tYnByd3Nmd2twa2d0YXd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NDIzOTYsImV4cCI6MjA3NTExODM5Nn0.atKM3zLSMJvlFkYOdWJuUbs-JTnwIH-9yqoVUeulCr8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export interface WorkOrder {
  id: string
  solicitante: string
  setor: string
  data_solicitacao: string
  local: string
  prioridade: 'Baixa' | 'Média' | 'Alta'
  tipo_manutencao: 'Predial' | 'Mecânica'
  descricao: string
  numero_os: string
  status: string
  created_at: string
  last_updated: string
  status_history: any[]
  completed_at?: string
}

export interface User {
  id: string
  email: string
  name: string
  role: string
  image?: string
  created_at: string
}
