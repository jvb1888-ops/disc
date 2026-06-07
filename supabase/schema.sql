-- ============================================================
-- DISC ASSESSMENT SYSTEM — Schema Completo para Supabase
-- Execute este script no SQL Editor do Supabase
-- ============================================================

-- =========================
-- 1. EXTENSÕES
-- =========================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================
-- 2. TABELA PRINCIPAL: leads
-- =========================
CREATE TABLE IF NOT EXISTS public.leads (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome                    TEXT NOT NULL,
  email                   TEXT NOT NULL,
  telefone                TEXT NOT NULL,
  perfil_disc             TEXT CHECK (perfil_disc IN ('D', 'I', 'S', 'C')),
  resultado_disc          JSONB,
  consentimento           BOOLEAN NOT NULL DEFAULT FALSE,
  data_hora_consentimento TIMESTAMPTZ,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================
-- 3. ÍNDICES
-- =========================
CREATE INDEX IF NOT EXISTS leads_email_idx
  ON public.leads (email);

CREATE INDEX IF NOT EXISTS leads_perfil_disc_idx
  ON public.leads (perfil_disc);

CREATE INDEX IF NOT EXISTS leads_created_at_idx
  ON public.leads (created_at DESC);

CREATE INDEX IF NOT EXISTS leads_consentimento_idx
  ON public.leads (consentimento);

-- Índice para busca de texto no nome
CREATE INDEX IF NOT EXISTS leads_nome_trgm_idx
  ON public.leads USING gin (nome gin_trgm_ops);

-- Índice para busca de texto no email
CREATE INDEX IF NOT EXISTS leads_email_trgm_idx
  ON public.leads USING gin (email gin_trgm_ops);

-- Nota: Os índices trigram exigem a extensão pg_trgm.
-- Caso não esteja habilitada, execute:
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- Se não tiver permissão, remova os dois índices USING gin acima.

-- =========================
-- 4. HABILITAR RLS
-- =========================
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- =========================
-- 5. POLICIES RLS
-- =========================

-- 5.1 Visitantes podem INSERIR (criar lead e resultado)
CREATE POLICY "leads_insert_public"
  ON public.leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 5.2 Visitantes NÃO podem SELECT (ver dados)
-- (Sem policy de SELECT para anon = acesso negado por padrão)

-- 5.3 Usuários autenticados (admins) podem SELECT tudo
CREATE POLICY "leads_select_authenticated"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (true);

-- 5.4 Usuários autenticados podem UPDATE (para salvar resultado do teste)
--     Permite que o sistema salve o resultado mesmo sem login do usuário
--     via service_role no backend. Para o cliente, usamos anon com update:
CREATE POLICY "leads_update_anon"
  ON public.leads
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- 5.5 Apenas usuários autenticados podem DELETE
CREATE POLICY "leads_delete_authenticated"
  ON public.leads
  FOR DELETE
  TO authenticated
  USING (true);

-- =========================
-- 6. COMENTÁRIOS
-- =========================
COMMENT ON TABLE public.leads IS
  'Armazena todos os participantes da avaliação DISC e seus resultados.';

COMMENT ON COLUMN public.leads.id IS
  'Identificador único do lead (UUID gerado automaticamente).';

COMMENT ON COLUMN public.leads.nome IS
  'Nome completo do participante.';

COMMENT ON COLUMN public.leads.email IS
  'E-mail do participante.';

COMMENT ON COLUMN public.leads.telefone IS
  'Telefone do participante (com máscara formatada).';

COMMENT ON COLUMN public.leads.perfil_disc IS
  'Perfil DISC predominante: D, I, S ou C.';

COMMENT ON COLUMN public.leads.resultado_disc IS
  'JSON completo com pontuações, percentuais e perfil predominante.';

COMMENT ON COLUMN public.leads.consentimento IS
  'Indica se o participante autorizou o uso dos dados.';

COMMENT ON COLUMN public.leads.data_hora_consentimento IS
  'Data e hora em que o consentimento foi dado.';

COMMENT ON COLUMN public.leads.created_at IS
  'Data e hora de criação do registro.';

-- =========================
-- 7. FUNÇÃO: estatísticas gerais (opcional, para uso futuro)
-- =========================
CREATE OR REPLACE FUNCTION public.get_disc_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_leads',   COUNT(*),
    'total_testes',  COUNT(*) FILTER (WHERE perfil_disc IS NOT NULL),
    'perfil_d',      COUNT(*) FILTER (WHERE perfil_disc = 'D'),
    'perfil_i',      COUNT(*) FILTER (WHERE perfil_disc = 'I'),
    'perfil_s',      COUNT(*) FILTER (WHERE perfil_disc = 'S'),
    'perfil_c',      COUNT(*) FILTER (WHERE perfil_disc = 'C'),
    'com_consentimento', COUNT(*) FILTER (WHERE consentimento = true)
  ) INTO result
  FROM public.leads;

  RETURN result;
END;
$$;

-- Grant para usuários autenticados chamarem a função
GRANT EXECUTE ON FUNCTION public.get_disc_stats() TO authenticated;

-- =========================
-- 8. DADOS DE EXEMPLO (opcional — remova em produção)
-- =========================
-- INSERT INTO public.leads (nome, email, telefone, perfil_disc, resultado_disc, consentimento, data_hora_consentimento)
-- VALUES
--   ('João Silva', 'joao@exemplo.com', '(11) 99999-0001', 'D',
--    '{"d":10,"i":4,"s":6,"c":4,"perfil_predominante":"D","percentuais":{"d":42,"i":17,"s":25,"c":17}}',
--    true, NOW()),
--   ('Maria Souza', 'maria@exemplo.com', '(11) 99999-0002', 'I',
--    '{"d":3,"i":12,"s":5,"c":4,"perfil_predominante":"I","percentuais":{"d":13,"i":50,"s":21,"c":17}}',
--    true, NOW()),
--   ('Carlos Lima', 'carlos@exemplo.com', '(11) 99999-0003', 'S',
--    '{"d":4,"i":5,"s":11,"c":4,"perfil_predominante":"S","percentuais":{"d":17,"i":21,"s":46,"c":17}}',
--    true, NOW()),
--   ('Ana Oliveira', 'ana@exemplo.com', '(11) 99999-0004', 'C',
--    '{"d":3,"i":4,"s":5,"c":12,"perfil_predominante":"C","percentuais":{"d":13,"i":17,"s":21,"c":50}}',
--    true, NOW());

-- =========================
-- FIM DO SCRIPT
-- =========================
