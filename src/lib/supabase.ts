import { createClient } from '@supabase/supabase-js'

// A integração Vercel+Supabase injeta SUPABASE_URL e SUPABASE_ANON_KEY (sem VITE_).
// O Vite expõe apenas variáveis com prefixo VITE_ para o browser.
// Por isso lemos as duas variações e usamos a que estiver preenchida.
const rawUrl = (
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.VITE_PUBLIC_SUPABASE_URL ||
  ''
).trim()

const rawKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY ||
  ''
).trim()

if (!rawUrl || !rawKey) {
  throw new Error(
    '[DISC] Variáveis de ambiente do Supabase não encontradas.\n' +
    'Certifique-se de que VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY ' +
    'estão configuradas na Vercel com o prefixo VITE_.'
  )
}

// Remove sufixos incorretos que podem ter sido colados por engano
const supabaseUrl = rawUrl
  .replace(/\/rest\/v1\/?.*$/, '')
  .replace(/\/$/, '')

export const supabase = createClient(supabaseUrl, rawKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      apikey: rawKey,
      Authorization: `Bearer ${rawKey}`,
    },
  },
})

export default supabase
