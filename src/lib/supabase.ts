import { createClient } from '@supabase/supabase-js'

// ─── CONFIGURAÇÃO DIRETA ──────────────────────────────────────────────────
// As keys estão definidas aqui diretamente para garantir funcionamento.
// A anon key é segura para ficar no frontend — ela é pública por design.
// O que protege os dados é o RLS (Row Level Security) no Supabase.
const SUPABASE_URL = 'https://hexckqodwlvzqvvxthxc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhleGNrcW9kd2x2enF2dnh0aHhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NTA4MjYsImV4cCI6MjA5NjQyNjgyNn0.MMQquU2wWWOqEtfw665_5Z-G-NX_msM9usecYhgw270'

// Lê das variáveis de ambiente se disponíveis, caso contrário usa os valores acima
const supabaseUrl = (
  (import.meta.env.VITE_SUPABASE_URL as string) || SUPABASE_URL
).trim().replace(/\/rest\/v1\/?.*$/, '').replace(/\/$/, '')

const supabaseAnonKey = (
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || SUPABASE_ANON_KEY
).trim()

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
  },
})

export default supabase
