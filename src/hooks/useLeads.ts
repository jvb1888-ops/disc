import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Lead, ResultadoDisc, DiscProfile } from '../types/database'

export interface LeadFilters {
  search: string
  perfil: DiscProfile | ''
  consentimento: 'true' | 'false' | ''
  dataInicio: string
  dataFim: string
}

export interface LeadsState {
  leads: Lead[]
  total: number
  loading: boolean
  error: string | null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToLead(row: any): Lead {
  return {
    id: row.id,
    nome: row.nome,
    email: row.email,
    telefone: row.telefone,
    perfil_disc: row.perfil_disc ?? null,
    resultado_disc: row.resultado_disc ?? null,
    consentimento: row.consentimento,
    data_hora_consentimento: row.data_hora_consentimento ?? null,
    created_at: row.created_at,
  }
}

export function useLeads() {
  const [state, setState] = useState<LeadsState>({
    leads: [],
    total: 0,
    loading: false,
    error: null,
  })

  const fetchLeads = useCallback(async (
    filters: LeadFilters,
    page: number,
    pageSize: number,
    sortColumn: keyof Lead,
    sortDir: 'asc' | 'desc'
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      let query = supabase.from('leads').select('*', { count: 'exact' })

      if (filters.search) {
        query = query.or(`nome.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
      }
      if (filters.perfil) {
        query = query.eq('perfil_disc', filters.perfil)
      }
      if (filters.consentimento !== '') {
        query = query.eq('consentimento', filters.consentimento === 'true')
      }
      if (filters.dataInicio) {
        query = query.gte('created_at', filters.dataInicio)
      }
      if (filters.dataFim) {
        query = query.lte('created_at', filters.dataFim + 'T23:59:59')
      }

      query = query.order(sortColumn as string, { ascending: sortDir === 'asc' })
      query = query.range(page * pageSize, (page + 1) * pageSize - 1)

      const { data, count, error } = await query
      if (error) throw error

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const leads = ((data as any[]) || []).map(rowToLead)
      setState({ leads, total: count || 0, loading: false, error: null })
    } catch {
      setState(prev => ({ ...prev, loading: false, error: 'Erro ao carregar dados.' }))
    }
  }, [])

  const deleteLead = useCallback(async (id: string) => {
    const { error } = await supabase.from('leads').delete().eq('id', id)
    if (error) throw new Error(error.message)
  }, [])

  const deleteLeads = useCallback(async (ids: string[]) => {
    const { error } = await supabase.from('leads').delete().in('id', ids)
    if (error) throw new Error(error.message)
  }, [])

  // ─── FLUXO PÚBLICO ────────────────────────────────────────────────────────
  // Etapa 1: salva dados pessoais (sem resultado) — retorna o ID temporário.
  // O ID é passado via React Router state para a página do teste.
  // Etapa 2: ao terminar, updateLeadResult salva o resultado DISC.
  //
  // IMPORTANTE: O SQL precisa ter a policy "leads_update_anon" para permitir
  // que o usuário anônimo atualize o seu próprio registro.
  // Execute o script SQL adicional abaixo no Supabase se necessário.
  // ──────────────────────────────────────────────────────────────────────────

  const createLead = useCallback(async (data: {
    nome: string
    email: string
    telefone: string
    consentimento: boolean
    data_hora_consentimento: string
  }) => {
    const { data: result, error } = await supabase
      .from('leads')
      .insert([{
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        consentimento: data.consentimento,
        data_hora_consentimento: data.data_hora_consentimento,
        perfil_disc: null,
        resultado_disc: null,
      }])
      .select()
      .single()

    if (error) throw new Error(error.message)
    return rowToLead(result)
  }, [])

  const updateLeadResult = useCallback(async (id: string, resultado: ResultadoDisc) => {
    const { error } = await supabase
      .from('leads')
      .update({
        perfil_disc: resultado.perfil_predominante,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resultado_disc: resultado as any,
      })
      .eq('id', id)

    if (error) throw new Error(error.message)
  }, [])

  return { ...state, fetchLeads, deleteLead, deleteLeads, createLead, updateLeadResult }
}

export async function fetchAllLeadsForExport(filters: LeadFilters): Promise<Lead[]> {
  let query = supabase.from('leads').select('*')

  if (filters.search) {
    query = query.or(`nome.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
  }
  if (filters.perfil) query = query.eq('perfil_disc', filters.perfil)
  if (filters.consentimento !== '') {
    query = query.eq('consentimento', filters.consentimento === 'true')
  }
  if (filters.dataInicio) query = query.gte('created_at', filters.dataInicio)
  if (filters.dataFim) query = query.lte('created_at', filters.dataFim + 'T23:59:59')

  query = query.order('created_at', { ascending: false })

  const { data, error } = await query
  if (error) throw new Error(error.message)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((data as any[]) || []).map(rowToLead)
}
