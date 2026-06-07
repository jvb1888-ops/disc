-- ============================================================
-- EXECUTE ESTE SCRIPT NO SQL EDITOR DO SUPABASE
-- Adiciona permissão de UPDATE para usuários anônimos.
-- Necessário para salvar o resultado do teste DISC.
-- ============================================================

-- Remove a policy antiga que só permitia admins autenticados
-- (pode não existir se você já usou o schema original)
DROP POLICY IF EXISTS "leads_update_authenticated" ON public.leads;

-- Adiciona policy que permite qualquer um atualizar
-- (o usuário anônimo precisa poder salvar o resultado do teste)
CREATE POLICY "leads_update_anon"
  ON public.leads
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Mantém também a permissão para admins autenticados
CREATE POLICY "leads_update_authenticated"
  ON public.leads
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- FIM
-- ============================================================
