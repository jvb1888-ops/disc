import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import styles from './AdminLogin.module.css'

export default function AdminLogin() {
  const { signIn, user, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [showPass, setShowPass] = useState(false)

  useEffect(() => {
    if (!loading && user) navigate('/admin')
  }, [user, loading, navigate])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email || !password) {
      setError('Preencha todos os campos.')
      return
    }
    setSubmitting(true)
    setError(null)
    const { error } = await signIn(email, password)
    if (error) {
      setError('Credenciais inválidas. Verifique e-mail e senha.')
      setSubmitting(false)
    } else {
      navigate('/admin')
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingPage}>
        <div className="spinner" style={{ width: 36, height: 36 }} />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.bg} />

      <div className={styles.card}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>D</div>
          <span>DISC<b>Admin</b></span>
        </div>

        <div className={styles.cardHeader}>
          <h1>Acesso Administrativo</h1>
          <p>Entre com suas credenciais de administrador</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.fields}>
            <div className="form-group">
              <label className="form-label">E-mail</label>
              <input
                type="email"
                className="form-input"
                placeholder="admin@empresa.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setEmail(e.target.value)
                  setError(null)
                }}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Senha</label>
              <div className={styles.passWrap}>
                <input
                  type={showPass ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setPassword(e.target.value)
                    setError(null)
                  }}
                  autoComplete="current-password"
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  className={styles.passToggle}
                  onClick={() => setShowPass((v: boolean) => !v)}
                  tabIndex={-1}
                >
                  {showPass ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className={styles.errorBox}>{error}</div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            style={{ width: '100%', padding: '14px', fontSize: '15px' }}
          >
            {submitting ? <><div className="spinner" /> Entrando...</> : 'Entrar'}
          </button>
        </form>

        <div className={styles.backLink}>
          <a href="/">← Voltar ao site</a>
        </div>
      </div>
    </div>
  )
}
