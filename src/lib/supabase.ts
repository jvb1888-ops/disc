import { createClient } from '@supabase/supabase-js'

// Forçando as credenciais via objeto para evitar tree-shaking do Vite
const cfg = {
  u: 'https://hexckqodwlvzqvvxthxc.supabase.co',
  k: [
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhleGNrcW9kd2x2enF2dnh0aHhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NTA4MjYsImV4cCI6MjA5NjQyNjgyNn0',
    'MMQquU2wWWOqEtfw665_5Z-G-NX_msM9usecYhgw270',
  ].join('.'),
}

export const supabase = createClient(cfg.u, cfg.k, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      apikey: cfg.k,
      Authorization: 'Bearer ' + cfg.k,
    },
  },
})

export default supabase
