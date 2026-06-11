import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Domínios permitidos — só seu site pode chamar esta função
const ALLOWED_ORIGINS = [
  'https://disc-gold.vercel.app',
  'https://disc-joao-s-project.vercel.app',
  'http://localhost:5173', // para desenvolvimento local
]

function getCorsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0]

  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '')
  return digits.length >= 10 && digits.length <= 11
}

function validatePayload(payload: Record<string, unknown>): string | null {
  if (!payload.nome || typeof payload.nome !== 'string' || payload.nome.trim().length < 3) {
    return 'Nome inválido — mínimo 3 caracteres.'
  }
  if (!payload.email || typeof payload.email !== 'string' || !isValidEmail(payload.email)) {
    return 'E-mail inválido.'
  }
  if (!payload.telefone || typeof payload.telefone !== 'string' || !isValidPhone(payload.telefone)) {
    return 'Telefone inválido.'
  }
  return null
}

serve(async (req) => {
  const origin = req.headers.get('origin')
  const corsHeaders = getCorsHeaders(origin)

  // Bloqueia origens não permitidas (exceto preflight)
  if (req.method !== 'OPTIONS' && origin && !ALLOWED_ORIGINS.includes(origin)) {
    return new Response(JSON.stringify({ error: 'Origem não permitida.' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Responde ao preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Só aceita POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Método não permitido.' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    // Cliente com service_role — bypassa RLS de forma segura no servidor
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const body = await req.json()
    const { action, payload } = body

    // ── INSERT LEAD ────────────────────────────────────────────────────────
    if (action === 'insert_lead') {
      // Valida os dados antes de salvar
      const validationError = validatePayload(payload)
      if (validationError) {
        return new Response(JSON.stringify({ error: validationError }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      // Salva apenas os campos permitidos — ignora qualquer campo extra
      const { data, error } = await supabase
        .from('leads')
        .insert([{
          nome: String(payload.nome).trim(),
          email: String(payload.email).trim().toLowerCase(),
          telefone: String(payload.telefone).trim(),
          perfil_disc: null,
          resultado_disc: null,
        }])
        .select()
        .single()

      if (error) throw error

      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // ── UPDATE RESULTADO DISC ──────────────────────────────────────────────
    if (action === 'update_lead') {
      const { id, resultado } = payload

      if (!id || typeof id !== 'string') {
        return new Response(JSON.stringify({ error: 'ID inválido.' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      if (!resultado || !resultado.perfil_predominante) {
        return new Response(JSON.stringify({ error: 'Resultado DISC inválido.' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const { error } = await supabase
        .from('leads')
        .update({
          perfil_disc: resultado.perfil_predominante,
          resultado_disc: resultado,
        })
        .eq('id', id)

      if (error) throw error

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    return new Response(JSON.stringify({ error: 'Ação inválida.' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
