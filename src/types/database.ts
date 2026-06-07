export type DiscProfile = 'D' | 'I' | 'S' | 'C'

export interface ResultadoDisc {
  d: number
  i: number
  s: number
  c: number
  perfil_predominante: DiscProfile
  percentuais: {
    d: number
    i: number
    s: number
    c: number
  }
}

export interface Lead {
  id: string
  nome: string
  email: string
  telefone: string
  perfil_disc: DiscProfile | null
  resultado_disc: ResultadoDisc | null
  consentimento: boolean
  data_hora_consentimento: string | null
  created_at: string
}
