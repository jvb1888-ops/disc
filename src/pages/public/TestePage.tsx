import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { DISC_QUESTIONS, calculateDiscResult } from '../../lib/disc'
import type { DiscProfile } from '../../types/database'
import { useLeads } from '../../hooks/useLeads'
import styles from './TestePage.module.css'

export default function TestePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { updateLeadResult } = useLeads()

  const leadId = location.state?.leadId as string | undefined
  const nome = location.state?.nome as string | undefined

  const [currentQ, setCurrentQ] = useState(0)
  const [respostas, setRespostas] = useState<Record<number, DiscProfile>>({})
  const [selected, setSelected] = useState<DiscProfile | null>(null)
  const [animating, setAnimating] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!leadId) navigate('/')
  }, [leadId, navigate])

  const total = DISC_QUESTIONS.length
  const question = DISC_QUESTIONS[currentQ]

  function handleSelect(perfil: DiscProfile) {
    if (animating) return
    setSelected(perfil)
  }

  async function handleNext() {
    if (!selected || animating) return
    const newRespostas = { ...respostas, [question.id]: selected }
    setRespostas(newRespostas)

    if (currentQ < total - 1) {
      setAnimating(true)
      setTimeout(() => {
        setCurrentQ(q => q + 1)
        setSelected(null)
        setAnimating(false)
      }, 300)
    } else {
      setSubmitting(true)
      const resultado = calculateDiscResult(newRespostas)
      if (leadId) {
        try {
          await updateLeadResult(leadId, resultado)
        } catch {
          // Even if save fails, show result
        }
      }
      navigate('/resultado', { state: { resultado, nome } })
    }
  }

  function handlePrev() {
    if (currentQ === 0 || animating) return
    setAnimating(true)
    setTimeout(() => {
      setCurrentQ(q => q - 1)
      setSelected(respostas[DISC_QUESTIONS[currentQ - 1].id] ?? null)
      setAnimating(false)
    }, 200)
  }

  if (!leadId) return null

  return (
    <div className={styles.page}>
      <div className={styles.bg} />

      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>D</div>
          <span className={styles.logoText}>DISC Assessment</span>
        </div>
        {nome && <span className={styles.userName}>Olá, {nome.split(' ')[0]} 👋</span>}
      </header>

      <main className={styles.main}>
        {/* Progress */}
        <div className={styles.progressSection}>
          <div className={styles.progressInfo}>
            <span className={styles.progressLabel}>Questão {currentQ + 1} de {total}</span>
            <span className={styles.progressPct}>{Math.round(((currentQ + 1) / total) * 100)}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentQ + 1) / total) * 100}%` }}
            />
          </div>
          <div className={styles.progressDots}>
            {DISC_QUESTIONS.map((_, i) => (
              <div
                key={i}
                className={`${styles.dot} ${i < currentQ ? styles.dotDone : ''} ${i === currentQ ? styles.dotCurrent : ''}`}
              />
            ))}
          </div>
        </div>

        {/* Question Card */}
        <div className={`${styles.questionCard} ${animating ? styles.animatingOut : styles.animatingIn}`}>
          <div className={styles.questionNumber}>
            {String(currentQ + 1).padStart(2, '0')}
          </div>
          <h2 className={styles.questionText}>{question.texto}</h2>

          <div className={styles.options}>
            {question.opcoes.map((opcao, idx) => (
              <button
                key={idx}
                className={`${styles.option} ${selected === opcao.perfil ? styles.optionSelected : ''}`}
                onClick={() => handleSelect(opcao.perfil)}
                style={{
                  animationDelay: `${idx * 0.06}s`,
                  '--disc-color': getColor(opcao.perfil),
                } as React.CSSProperties}
              >
                <span className={styles.optionLetter} style={{ color: getColor(opcao.perfil) }}>
                  {opcao.perfil}
                </span>
                <span className={styles.optionText}>{opcao.texto}</span>
                {selected === opcao.perfil && (
                  <span className={styles.optionCheck}>✓</span>
                )}
              </button>
            ))}
          </div>

          <div className={styles.actions}>
            <button
              className="btn btn-ghost"
              onClick={handlePrev}
              disabled={currentQ === 0 || animating}
            >
              ← Anterior
            </button>

            <button
              className="btn btn-primary"
              onClick={handleNext}
              disabled={!selected || animating || submitting}
              style={{ minWidth: 160 }}
            >
              {submitting ? (
                <><div className="spinner" /> Calculando...</>
              ) : currentQ === total - 1 ? (
                'Ver Resultado →'
              ) : (
                'Próxima →'
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

function getColor(perfil: DiscProfile): string {
  const map: Record<DiscProfile, string> = {
    D: 'var(--disc-d)',
    I: 'var(--disc-i)',
    S: 'var(--disc-s)',
    C: 'var(--disc-c)',
  }
  return map[perfil]
}
