import * as XLSX from 'xlsx'
import type { Lead } from '../types/database'

function formatLead(lead: Lead) {
  return {
    Nome: lead.nome,
    'E-mail': lead.email,
    Telefone: lead.telefone,
    'Perfil DISC': lead.perfil_disc || 'Incompleto',
    Consentimento: lead.consentimento ? 'Sim' : 'Não',
    'Data Consentimento': lead.data_hora_consentimento
      ? new Date(lead.data_hora_consentimento).toLocaleString('pt-BR')
      : '',
    'Data do Teste': new Date(lead.created_at).toLocaleString('pt-BR'),
  }
}

export function exportToCSV(leads: Lead[], filename = 'leads-disc') {
  const rows = leads.map(formatLead)
  const headers = Object.keys(rows[0] || {})
  const csv = [
    headers.join(','),
    ...rows.map(row =>
      headers.map(h => {
        const val = row[h as keyof typeof row] || ''
        return `"${String(val).replace(/"/g, '""')}"`
      }).join(',')
    ),
  ].join('\n')

  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export function exportToExcel(leads: Lead[], filename = 'leads-disc') {
  const rows = leads.map(formatLead)
  const ws = XLSX.utils.json_to_sheet(rows)

  // Column widths
  ws['!cols'] = [
    { wch: 30 }, { wch: 35 }, { wch: 18 }, { wch: 14 },
    { wch: 14 }, { wch: 22 }, { wch: 22 },
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Leads DISC')
  XLSX.writeFile(wb, `${filename}-${new Date().toISOString().slice(0, 10)}.xlsx`)
}
