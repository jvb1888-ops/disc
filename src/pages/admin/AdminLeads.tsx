import { useState, useEffect, useCallback } from 'react'
import { useLeads, fetchAllLeadsForExport } from '../../hooks/useLeads'
import type { Lead, DiscProfile } from '../../types/database'
import type { LeadFilters } from '../../hooks/useLeads'
import { DISC_PROFILES } from '../../lib/disc'
import { exportToCSV, exportToExcel } from '../../lib/export'
import LeadDetailModal from '../../components/admin/LeadDetailModal'
import ConfirmModal from '../../components/admin/ConfirmModal'
import styles from './AdminLeads.module.css'

const PAGE_SIZE = 15

const defaultFilters: LeadFilters = {
  search: '', perfil: '', consentimento: '', dataInicio: '', dataFim: '',
}

export default function AdminLeads() {
  const { leads, total, loading, fetchLeads, deleteLead, deleteLeads } = useLeads()
  const [filters, setFilters] = useState<LeadFilters>(defaultFilters)
  const [page, setPage] = useState(0)
  const [sortCol, setSortCol] = useState<keyof Lead>('created_at')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [detailLead, setDetailLead] = useState<Lead | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | string[] | null>(null)
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [exporting, setExporting] = useState(false)

  const load = useCallback(() => {
    fetchLeads(filters, page, PAGE_SIZE, sortCol, sortDir)
  }, [filters, page, sortCol, sortDir, fetchLeads])

  useEffect(() => { load() }, [load])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  function notify(msg: string, type: 'success' | 'error' = 'success') {
    setNotification({ msg, type })
    setTimeout(() => setNotification(null), 3500)
  }

  function handleSort(col: keyof Lead) {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
    setPage(0)
  }

  function toggleSelect(id: string) {
    setSelected(prev => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }

  function toggleSelectAll() {
    if (selected.size === leads.length) setSelected(new Set())
    else setSelected(new Set(leads.map((l: Lead) => l.id)))
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      if (Array.isArray(deleteTarget)) {
        await deleteLeads(deleteTarget)
        setSelected(new Set())
        notify(`${deleteTarget.length} registros excluídos.`)
      } else {
        await deleteLead(deleteTarget)
        notify('Registro excluído.')
      }
      load()
    } catch {
      notify('Erro ao excluir.', 'error')
    } finally {
      setDeleteTarget(null)
    }
  }

  async function handleExportCSV() {
    setExporting(true)
    try {
      const data = await fetchAllLeadsForExport(filters)
      exportToCSV(data)
      notify('CSV exportado com sucesso.')
    } catch { notify('Erro ao exportar.', 'error') }
    setExporting(false)
  }

  async function handleExportExcel() {
    setExporting(true)
    try {
      const data = await fetchAllLeadsForExport(filters)
      exportToExcel(data)
      notify('Excel exportado com sucesso.')
    } catch { notify('Erro ao exportar.', 'error') }
    setExporting(false)
  }

  function SortIcon({ col }: { col: keyof Lead }) {
    if (sortCol !== col) return <span style={{ opacity: 0.3 }}>↕</span>
    return <span>{sortDir === 'asc' ? '↑' : '↓'}</span>
  }

  function applyFilter(key: keyof LeadFilters, val: string) {
    setFilters(prev => ({ ...prev, [key]: val }))
    setPage(0)
    setSelected(new Set())
  }

  return (
    <div className={styles.page}>
      {/* Notification */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          {notification.type === 'success' ? '✓' : '✕'} {notification.msg}
        </div>
      )}

      <div className={styles.pageHeader}>
        <div>
          <h1>Leads</h1>
          <p>{total} registro{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}</p>
        </div>
        <div className={styles.headerActions}>
          <button className="btn btn-secondary" onClick={handleExportCSV} disabled={exporting}>
            {exporting ? <div className="spinner" /> : '⬇'} CSV
          </button>
          <button className="btn btn-secondary" onClick={handleExportExcel} disabled={exporting}>
            {exporting ? <div className="spinner" /> : '⬇'} Excel
          </button>
          {selected.size > 0 && (
            <button
              className="btn btn-danger"
              onClick={() => setDeleteTarget([...selected])}
            >
              🗑 Excluir {selected.size} selecionados
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filtersRow}>
        <input
          type="text"
          className={`form-input ${styles.searchInput}`}
          placeholder="🔍 Buscar por nome ou e-mail..."
          value={filters.search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => applyFilter('search', e.target.value)}
        />

        <select
          className={`form-input ${styles.filterSelect}`}
          value={filters.perfil}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => applyFilter('perfil', e.target.value)}
        >
          <option value="">Todos os Perfis</option>
          {(['D', 'I', 'S', 'C'] as DiscProfile[]).map(p => (
            <option key={p} value={p}>{p} – {DISC_PROFILES[p].nome}</option>
          ))}
        </select>

        <select
          className={`form-input ${styles.filterSelect}`}
          value={filters.consentimento}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => applyFilter('consentimento', e.target.value)}
        >
          <option value="">Todos os Consentimentos</option>
          <option value="true">Com Consentimento</option>
          <option value="false">Sem Consentimento</option>
        </select>

        <input
          type="date"
          className={`form-input ${styles.filterDate}`}
          value={filters.dataInicio}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => applyFilter('dataInicio', e.target.value)}
          title="Data início"
        />
        <input
          type="date"
          className={`form-input ${styles.filterDate}`}
          value={filters.dataFim}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => applyFilter('dataFim', e.target.value)}
          title="Data fim"
        />

        {(filters.search || filters.perfil || filters.consentimento || filters.dataInicio || filters.dataFim) && (
          <button
            className="btn btn-ghost"
            onClick={() => { setFilters(defaultFilters); setPage(0) }}
          >
            ✕ Limpar
          </button>
        )}
      </div>

      {/* Table */}
      <div className={styles.tableCard}>
        {loading ? (
          <div className={styles.tableLoading}>
            <div className="spinner" style={{ width: 28, height: 28 }} />
            Carregando...
          </div>
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>
                      <input
                        type="checkbox"
                        checked={leads.length > 0 && selected.size === leads.length}
                        onChange={toggleSelectAll}
                        style={{ accentColor: 'var(--color-gold)', cursor: 'pointer' }}
                      />
                    </th>
                    <th onClick={() => handleSort('nome')}>Nome <SortIcon col="nome" /></th>
                    <th onClick={() => handleSort('email')}>E-mail <SortIcon col="email" /></th>
                    <th>Telefone</th>
                    <th onClick={() => handleSort('perfil_disc')}>Perfil <SortIcon col="perfil_disc" /></th>
                    <th onClick={() => handleSort('consentimento')}>Consentimento <SortIcon col="consentimento" /></th>
                    <th onClick={() => handleSort('created_at')}>Data do Teste <SortIcon col="created_at" /></th>
                    <th style={{ width: 100 }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                        Nenhum resultado encontrado.
                      </td>
                    </tr>
                  ) : leads.map((lead: Lead) => (
                    <tr key={lead.id} className={selected.has(lead.id) ? styles.rowSelected : ''}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selected.has(lead.id)}
                          onChange={() => toggleSelect(lead.id)}
                          style={{ accentColor: 'var(--color-gold)', cursor: 'pointer' }}
                        />
                      </td>
                      <td>
                        <span className={styles.leadName}>{lead.nome}</span>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{lead.email}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{lead.telefone}</td>
                      <td>
                        {lead.perfil_disc ? (
                          <span className={`badge badge-${lead.perfil_disc.toLowerCase()}`}>
                            {lead.perfil_disc} — {DISC_PROFILES[lead.perfil_disc].nome}
                          </span>
                        ) : (
                          <span className={styles.pending}>Pendente</span>
                        )}
                      </td>
                      <td>
                        <span className={lead.consentimento ? styles.consentYes : styles.consentNo}>
                          {lead.consentimento ? '✓ Sim' : '✕ Não'}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                        {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td>
                        <div className={styles.rowActions}>
                          <button
                            className="btn btn-ghost"
                            style={{ padding: '6px 10px', fontSize: 13 }}
                            onClick={() => setDetailLead(lead)}
                            title="Ver detalhes"
                          >
                            👁
                          </button>
                          <button
                            className="btn btn-danger"
                            style={{ padding: '6px 10px', fontSize: 13 }}
                            onClick={() => setDeleteTarget(lead.id)}
                            title="Excluir"
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <span className={styles.paginationInfo}>
                  Página {page + 1} de {totalPages} · {total} registros
                </span>
                <div className={styles.paginationBtns}>
                  <button className="btn btn-ghost" onClick={() => setPage(0)} disabled={page === 0}>«</button>
                  <button className="btn btn-ghost" onClick={() => setPage(p => p - 1)} disabled={page === 0}>‹</button>
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    const p = Math.max(0, Math.min(page - 3, totalPages - 7)) + i
                    return (
                      <button
                        key={p}
                        className={`btn btn-ghost ${p === page ? styles.pageActive : ''}`}
                        onClick={() => setPage(p)}
                      >
                        {p + 1}
                      </button>
                    )
                  })}
                  <button className="btn btn-ghost" onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>›</button>
                  <button className="btn btn-ghost" onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1}>»</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {detailLead && (
        <LeadDetailModal lead={detailLead} onClose={() => setDetailLead(null)} />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Confirmar Exclusão"
          message={
            Array.isArray(deleteTarget)
              ? `Tem certeza que deseja excluir ${deleteTarget.length} registros? Esta ação não pode ser desfeita.`
              : 'Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.'
          }
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
