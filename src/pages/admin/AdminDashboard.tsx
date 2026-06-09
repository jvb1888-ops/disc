import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import { supabase } from '../../lib/supabase'
import type { Lead, DiscProfile } from '../../types/database'
import styles from './AdminDashboard.module.css'

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

interface Stats {
  totalLeads: number
  totalTestes: number
  perfilCounts: Record<DiscProfile, number>
  recentLeads: Lead[]
  dailyData: { date: string; count: number }[]
  weeklyData: { date: string; count: number }[]
  monthlyData: { date: string; count: number }[]
}

const DISC_COLORS: Record<DiscProfile, string> = {
  D: '#e05252', I: '#f5a623', S: '#52c87a', C: '#4a90d9',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')

  useEffect(() => { loadStats() }, [])

  async function loadStats() {
    setLoading(true)
    try {
      const { data: rows } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const all = ((rows as any[]) || []).map(rowToLead)

      const totalLeads = all.length
      const totalTestes = all.filter((l: Lead) => l.perfil_disc !== null).length
      const perfilCounts: Record<DiscProfile, number> = { D: 0, I: 0, S: 0, C: 0 }
      all.forEach((l: Lead) => { if (l.perfil_disc) perfilCounts[l.perfil_disc]++ })

      setStats({
        totalLeads,
        totalTestes,
        perfilCounts,
        recentLeads: all.slice(0, 10),
        dailyData: buildPeriodData(all, 14, 'day'),
        weeklyData: buildPeriodData(all, 8, 'week'),
        monthlyData: buildPeriodData(all, 6, 'month'),
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className="spinner" style={{ width: 32, height: 32 }} />
        <span>Carregando dashboard...</span>
      </div>
    )
  }

  if (!stats) return null

  const pieData = (['D', 'I', 'S', 'C'] as DiscProfile[])
    .filter(p => stats.perfilCounts[p] > 0)
    .map(p => ({ name: p, value: stats.perfilCounts[p], color: DISC_COLORS[p] }))

  const periodData =
    period === 'daily' ? stats.dailyData :
    period === 'weekly' ? stats.weeklyData :
    stats.monthlyData

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>Dashboard</h1>
        <p>Visão geral do sistema DISC</p>
      </div>

      <div className={styles.kpiGrid}>
        <StatCard label="Total de Leads"     value={stats.totalLeads}        icon="👥" color="var(--color-gold)" />
        <StatCard label="Testes Realizados"  value={stats.totalTestes}       icon="✅" color="var(--disc-s)" />
        <StatCard label="Perfil D"           value={stats.perfilCounts.D}    icon="🔥" color="var(--disc-d)" />
        <StatCard label="Perfil I"           value={stats.perfilCounts.I}    icon="⚡" color="var(--disc-i)" />
        <StatCard label="Perfil S"           value={stats.perfilCounts.S}    icon="🌿" color="var(--disc-s)" />
        <StatCard label="Perfil C"           value={stats.perfilCounts.C}    icon="🔬" color="var(--disc-c)" />
      </div>

      <div className={styles.chartsRow}>
        {/* Pie */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}><h2>Distribuição de Perfis</h2></div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }: { name: string; percent: number }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [val, 'Participantes']}
                  contentStyle={{
                    background: '#1e1e35',
                    border: '1px solid rgba(200,169,110,0.3)',
                    borderRadius: 8,
                  }}
                  labelStyle={{ color: '#f0ede8', fontWeight: 600 }}
                  itemStyle={{ color: '#c8a96e' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className={styles.emptyChart}>Nenhum teste concluído ainda.</div>
          )}
        </div>

        {/* Bar */}
        <div className={styles.chartCard} style={{ flex: 2 }}>
          <div className={styles.chartHeader}>
            <h2>Testes por Período</h2>
            <div className={styles.periodTabs}>
              {(['daily', 'weekly', 'monthly'] as const).map(p => (
                <button
                  key={p}
                  className={`${styles.periodTab} ${period === p ? styles.periodTabActive : ''}`}
                  onClick={() => setPeriod(p)}
                >
                  {p === 'daily' ? 'Diário' : p === 'weekly' ? 'Semanal' : 'Mensal'}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={periodData} barSize={20}>
              <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 8 }} />
              <Bar dataKey="count" fill="var(--color-gold)" radius={[4, 4, 0, 0]} name="Testes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Leads */}
      <div className={styles.chartCard}>
        <div className={styles.chartHeader}><h2>Últimos Participantes</h2></div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nome</th><th>E-mail</th><th>Perfil</th><th>Data</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentLeads.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>
                    Nenhum participante ainda.
                  </td>
                </tr>
              ) : stats.recentLeads.map((lead: Lead) => (
                <tr key={lead.id}>
                  <td>{lead.nome}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{lead.email}</td>
                  <td>
                    {lead.perfil_disc
                      ? <span className={`badge badge-${lead.perfil_disc.toLowerCase()}`}>{lead.perfil_disc}</span>
                      : <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>—</span>
                    }
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                    {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color }: {
  label: string; value: number; icon: string; color: string
}) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon} style={{ background: `${color}15`, color }}>{icon}</div>
      <div>
        <div className={styles.statValue} style={{ color }}>{value}</div>
        <div className={styles.statLabel}>{label}</div>
      </div>
    </div>
  )
}

function buildPeriodData(leads: Lead[], count: number, type: 'day' | 'week' | 'month'): { date: string; count: number }[] {
  const data: { date: string; count: number }[] = []
  const now = new Date()
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now)
    if (type === 'day') {
      d.setDate(d.getDate() - i)
      const label = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
      const c = leads.filter(l => {
        const ld = new Date(l.created_at)
        return ld.getDate() === d.getDate() && ld.getMonth() === d.getMonth() && ld.getFullYear() === d.getFullYear()
      }).length
      data.push({ date: label, count: c })
    } else if (type === 'week') {
      d.setDate(d.getDate() - i * 7)
      const ws = new Date(d); ws.setDate(d.getDate() - d.getDay())
      const we = new Date(ws); we.setDate(ws.getDate() + 6)
      const label = ws.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
      const c = leads.filter(l => { const ld = new Date(l.created_at); return ld >= ws && ld <= we }).length
      data.push({ date: label, count: c })
    } else {
      d.setMonth(d.getMonth() - i)
      const label = d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })
      const c = leads.filter(l => {
        const ld = new Date(l.created_at)
        return ld.getMonth() === d.getMonth() && ld.getFullYear() === d.getFullYear()
      }).length
      data.push({ date: label, count: c })
    }
  }
  return data
}
