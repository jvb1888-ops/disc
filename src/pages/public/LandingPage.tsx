import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLeads } from '../../hooks/useLeads'
import styles from './LandingPage.module.css'

interface FormData {
  nome: string
  email: string
  telefone: string
  consentimento: boolean
}

interface FormErrors {
  nome?: string
  email?: string
  telefone?: string
  consentimento?: string
}

function formatTelefone(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim()
  }
  return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim()
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { createLead } = useLeads()
  const [form, setForm] = useState<FormData>({
    nome: '', email: '', telefone: '', consentimento: false,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  function validate(): boolean {
    const e: FormErrors = {}
    if (!form.nome.trim() || form.nome.trim().length < 3) e.nome = 'Nome deve ter ao menos 3 caracteres.'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'E-mail inválido.'
    const digits = form.telefone.replace(/\D/g, '')
    if (digits.length < 10) e.telefone = 'Telefone inválido.'
    if (!form.consentimento) e.consentimento = 'É necessário dar consentimento para continuar.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setApiError(null)
    try {
      const lead = await createLead({
        nome: form.nome.trim(),
        email: form.email.trim().toLowerCase(),
        telefone: form.telefone,
        consentimento: true,
        data_hora_consentimento: new Date().toISOString(),
      })
      navigate('/teste', { state: { leadId: lead.id, nome: lead.nome } })
    } catch {
      setApiError('Erro ao salvar seus dados. Verifique a conexão e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      {/* Background decoration */}
      <div className={styles.bg}>
        <div className={styles.bgCircle1} />
        <div className={styles.bgCircle2} />
        <div className={styles.bgGrid} />
      </div>

      <header className={styles.header}>
        <div className={styles.headerLogo}>
          <span className={styles.headerLogoIcon}>D</span>
          <span>DISC<b>Assessment</b></span>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>
              <span>✦</span> Avaliação Comportamental Profissional
            </div>
            <h1 className={styles.heroTitle}>
              Descubra seu<br />
              <span className="text-gold">Perfil DISC</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Em apenas 10 minutos, compreenda seu estilo de comportamento,
              suas forças e como potencializar seus resultados pessoais e profissionais.
            </p>

            <div className={styles.features}>
              {[
                { icon: '⚡', text: '24 questões objetivas' },
                { icon: '📊', text: 'Resultado imediato e detalhado' },
                { icon: '🎯', text: 'Análise de 4 perfis comportamentais' },
              ].map(f => (
                <div key={f.text} className={styles.featureItem}>
                  <span>{f.icon}</span>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.discCircle}>
              {[
                { label: 'D', name: 'Dominância', color: 'var(--disc-d)' },
                { label: 'I', name: 'Influência', color: 'var(--disc-i)' },
                { label: 'S', name: 'Estabilidade', color: 'var(--disc-s)' },
                { label: 'C', name: 'Conformidade', color: 'var(--disc-c)' },
              ].map(p => (
                <div
                  key={p.label}
                  className={styles.discQuadrant}
                  style={{ '--color': p.color } as React.CSSProperties}
                >
                  <div className={styles.discLetter} style={{ color: p.color }}>{p.label}</div>
                  <div className={styles.discName}>{p.name}</div>
                </div>
              ))}
              <div className={styles.discCenter}>DISC</div>
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <h2>Comece agora</h2>
              <p>Preencha seus dados para iniciar a avaliação gratuita</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className={styles.formGrid}>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Nome completo *</label>
                  <input
                    type="text"
                    className={`form-input ${errors.nome ? 'error' : ''}`}
                    placeholder="Seu nome completo"
                    value={form.nome}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setForm(prev => ({ ...prev, nome: e.target.value }))
                      setErrors(prev => ({ ...prev, nome: undefined }))
                    }}
                  />
                  {errors.nome && <span className={styles.errorMsg}>{errors.nome}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">E-mail *</label>
                  <input
                    type="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="seu@email.com"
                    value={form.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setForm(prev => ({ ...prev, email: e.target.value }))
                      setErrors(prev => ({ ...prev, email: undefined }))
                    }}
                  />
                  {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Telefone *</label>
                  <input
                    type="tel"
                    className={`form-input ${errors.telefone ? 'error' : ''}`}
                    placeholder="(00) 00000-0000"
                    value={form.telefone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const formatted = formatTelefone(e.target.value)
                      setForm(prev => ({ ...prev, telefone: formatted }))
                      setErrors(prev => ({ ...prev, telefone: undefined }))
                    }}
                    maxLength={15}
                  />
                  {errors.telefone && <span className={styles.errorMsg}>{errors.telefone}</span>}
                </div>
              </div>

              <div className={styles.consentBox}>
                <label className="checkbox-wrap">
                  <input
                    type="checkbox"
                    checked={form.consentimento}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setForm(prev => ({ ...prev, consentimento: e.target.checked }))
                      setErrors(prev => ({ ...prev, consentimento: undefined }))
                    }}
                  />
                  <span className={styles.consentText}>
                    Autorizo o armazenamento dos meus dados para recebimento do resultado do teste DISC
                    e para contato relacionado aos serviços oferecidos pela empresa.
                  </span>
                </label>
                {errors.consentimento && <span className={styles.errorMsg}>{errors.consentimento}</span>}
              </div>

              {apiError && (
                <div className={styles.apiError}>{apiError}</div>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', padding: '16px', fontSize: '16px', marginTop: '8px' }}
              >
                {loading ? (
                  <><div className="spinner" /> Salvando...</>
                ) : (
                  <>Iniciar Avaliação DISC →</>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} DISC Assessment · Todos os direitos reservados</p>
      </footer>
    </div>
  )
}
