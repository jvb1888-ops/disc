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

// URL da Edge Function — substitui chamadas diretas à tabela para anon
const FUNCTION_URL = 'https://hexckqodwlvzqvvxthxc.supabase.co/functions/v1/insert-lead'
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhleGNrcW9kd2x2enF2dnh0aHhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NTA4MjYsImV4cCI6MjA5NjQyNjgyNn0.MMQquU2wWWOqEtfw665_5Z-G-NX_msM9usecYhgw270'

async function callFunction(action: string, payload: unknown) {
  const res = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ANON_KEY}`,
      'apikey': ANON_KEY,
    },
    body: JSON.stringify({ action, payload }),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Erro na função')
  return json
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
      if (filters.perfil) query = query.eq('perfil_disc', filters.perfil)
      if (filters.consentimento !== '') {
        query = query.eq('consentimento', filters.consentimento === 'true')
      }
      if (filters.dataInicio) query = query.gte('created_at', filters.dataInicio)
      if (filters.dataFim) query = query.lte('created_at', filters.dataFim + 'T23:59:59')

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

  // INSERT via Edge Function (usa service_role no servidor — seguro)
  const createLead = useCallback(async (data: {
    nome: string
    email: string
    telefone: string
    consentimento: boolean
    data_hora_consentimento: string
  }) => {
    const result = await callFunction('insert_lead', {
      nome: data.nome,
      email: data.email,
      telefone: data.telefone,
      consentimento: data.consentimento,
      data_hora_consentimento: data.data_hora_consentimento,
      perfil_disc: null,
      resultado_disc: null,
    })
    return rowToLead(result.data)
  }, [])

  // UPDATE via Edge Function (usa service_role no servidor — seguro)
  const updateLeadResult = useCallback(async (id: string, resultado: ResultadoDisc) => {
    await callFunction('update_lead', { id, resultado })
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
