import { DISC_PROFILES } from '../../lib/disc'
import type { Lead } from '../../types/database'
import styles from './LeadDetailModal.module.css'
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer,
} from 'recharts'

interface Props {
  lead: Lead
  onClose: () => void
}

export default function LeadDetailModal({ lead, onClose }: Props) {
  const perfil = lead.perfil_disc ? DISC_PROFILES[lead.perfil_disc] : null
  const resultado = lead.resultado_disc

  const radarData = resultado
    ? [
        { subject: 'D', value: resultado.percentuais.d, fullMark: 100 },
        { subject: 'I', value: resultado.percentuais.i, fullMark: 100 },
        { subject: 'S', value: resultado.percentuais.s, fullMark: 100 },
        { subject: 'C', value: resultado.percentuais.c, fullMark: 100 },
      ]
    : []

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        style={{ maxWidth: 620 }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.modalTitle}>Detalhes do Participante</h2>
            <p className={styles.modalSub}>Resultado completo da avaliação DISC</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Personal Info */}
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Nome</span>
            <span className={styles.infoValue}>{lead.nome}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>E-mail</span>
            <span className={styles.infoValue}>{lead.email}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Telefone</span>
            <span className={styles.infoValue}>{lead.telefone}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Data do Teste</span>
            <span className={styles.infoValue}>
              {new Date(lead.created_at).toLocaleString('pt-BR')}
            </span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Consentimento</span>
            <span className={lead.consentimento ? styles.consentYes : styles.consentNo}>
              {lead.consentimento ? '✓ Autorizado' : '✕ Não autorizado'}
            </span>
          </div>
          {lead.data_hora_consentimento && (
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Data do Consentimento</span>
              <span className={styles.infoValue}>
                {new Date(lead.data_hora_consentimento).toLocaleString('pt-BR')}
              </span>
            </div>
          )}
        </div>

        <div className="divider" />

        {/* DISC Result */}
        {perfil && resultado ? (
          <>
            <div className={styles.perfilSection}>
              <div
                className={styles.perfilBadge}
                style={{ borderColor: perfil.cor, boxShadow: `0 0 20px ${perfil.cor}22` }}
              >
                <span className={styles.perfilEmoji}>{perfil.emoji}</span>
                <div>
                  <div className={styles.perfilLetter} style={{ color: perfil.cor }}>
                    {lead.perfil_disc}
                  </div>
                  <div className={styles.perfilNome}>{perfil.nome}</div>
                  <div className={styles.perfilTitulo}>{perfil.titulo}</div>
                </div>
              </div>

              {radarData.length > 0 && (
                <div className={styles.radarWrap}>
                  <ResponsiveContainer width="100%" height={180}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="rgba(255,255,255,0.08)" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: 'var(--text-secondary)', fontSize: 13, fontWeight: 700 }}
                      />
                      <Radar
                        name="Perfil"
                        dataKey="value"
                        stroke={perfil.cor}
                        fill={perfil.cor}
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Percentages */}
            <div className={styles.percentGrid}>
              {(['D', 'I', 'S', 'C'] as const).map(p => {
                const val = resultado.percentuais[p.toLowerCase() as 'd' | 'i' | 's' | 'c']
                const pInfo = DISC_PROFILES[p]
                return (
                  <div key={p} className={styles.percentItem}>
                    <div className={styles.percentTop}>
                      <span style={{ color: pInfo.cor, fontWeight: 700 }}>{p}</span>
                      <span style={{ color: pInfo.cor }}>{val}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${val}%`, background: pInfo.cor }}
                      />
                    </div>
                    <div className={styles.percentName}>{pInfo.nome}</div>
                  </div>
                )
              })}
            </div>

            <div className="divider" />

            <p className={styles.descText}>{perfil.descricao}</p>
          </>
        ) : (
          <div className={styles.noResult}>
            <span>⏳</span>
            <p>Este participante ainda não completou o teste.</p>
          </div>
        )}

        <div className={styles.modalFooter}>
          <button className="btn btn-secondary" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  )
}
