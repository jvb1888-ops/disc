import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  ResponsiveContainer, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
} from 'recharts'
import { DISC_PROFILES } from '../../lib/disc'
import type { ResultadoDisc } from '../../types/database'
import styles from './ResultadoPage.module.css'

export default function ResultadoPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const resultado = location.state?.resultado as ResultadoDisc | undefined
  const nome = location.state?.nome as string | undefined

  useEffect(() => {
    if (!resultado) navigate('/')
  }, [resultado, navigate])

  if (!resultado) return null

  const perfil = DISC_PROFILES[resultado.perfil_predominante]

  const radarData = [
    { subject: 'D', value: resultado.percentuais.d, fullMark: 100 },
    { subject: 'I', value: resultado.percentuais.i, fullMark: 100 },
    { subject: 'S', value: resultado.percentuais.s, fullMark: 100 },
    { subject: 'C', value: resultado.percentuais.c, fullMark: 100 },
  ]

  const barData = [
    { name: 'Dominância', value: resultado.percentuais.d, fill: 'var(--disc-d)' },
    { name: 'Influência', value: resultado.percentuais.i, fill: 'var(--disc-i)' },
    { name: 'Estabilidade', value: resultado.percentuais.s, fill: 'var(--disc-s)' },
    { name: 'Conformidade', value: resultado.percentuais.c, fill: 'var(--disc-c)' },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.bg} />

      <header className={styles.header}>
        <img src="/logo-dna.png" alt="DNA Comercial" className={styles.headerLogo} />
      </header>

      <main className={styles.main}>
        {/* Hero Result */}
        <section className={styles.heroSection}>
          <div className={styles.successBadge}>✓ Avaliação Concluída</div>
          {nome && <p className={styles.nameGreet}>Parabéns, <strong>{nome.split(' ')[0]}</strong>!</p>}
          <h1 className={styles.heroTitle}>
            Seu perfil predominante é
          </h1>
          <div
            className={styles.perfilHero}
            style={{ '--perfil-color': perfil.cor } as React.CSSProperties}
          >
            <div className={styles.perfilEmoji}>{perfil.emoji}</div>
            <div className={styles.perfilLetter}>{resultado.perfil_predominante}</div>
            <div className={styles.perfilInfo}>
              <div className={styles.perfilNome}>{perfil.nome}</div>
              <div className={styles.perfilTitulo}>{perfil.titulo}</div>
            </div>
          </div>
        </section>

        {/* Percentuais */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Distribuição do Perfil</h2>
          <div className={styles.percentGrid}>
            {barData.map(item => (
              <div key={item.name} className={styles.percentCard}>
                <div className={styles.percentValue} style={{ color: item.fill }}>
                  {item.value}%
                </div>
                <div className={styles.percentBar}>
                  <div
                    className={styles.percentFill}
                    style={{ width: `${item.value}%`, background: item.fill }}
                  />
                </div>
                <div className={styles.percentName}>{item.name}</div>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.twoCol}>
          {/* Radar Chart */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Gráfico Radar</h2>
            <div className={styles.chartWrap}>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{
                      fill: 'var(--text-secondary)',
                      fontSize: 14,
                      fontWeight: 700,
                      fontFamily: 'var(--font-display)',
                    }}
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
          </section>

          {/* Bar Chart */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Pontuação por Perfil</h2>
            <div className={styles.chartWrap}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={barData} barSize={32}>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#1e1e35',
                      border: '1px solid rgba(200,169,110,0.3)',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#f0ede8', fontWeight: 600 }}
                    itemStyle={{ color: '#c8a96e' }}
                    formatter={(val: number) => [`${val}%`, 'Pontuação']}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* Descrição */}
        <section
          className={styles.section}
          style={{ borderLeft: `3px solid ${perfil.cor}`, paddingLeft: 28 }}
        >
          <h2 className={styles.sectionTitle}>
            Sobre o Perfil {resultado.perfil_predominante} – {perfil.titulo}
          </h2>
          <p className={styles.descricao}>{perfil.descricao}</p>
        </section>

        {/* Pontos Fortes e Desafios */}
        <div className={styles.twoCol}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>✦ Pontos Fortes</h2>
            <ul className={styles.list}>
              {perfil.pontosFortres.map(item => (
                <li key={item}>
                  <span className={styles.listIcon} style={{ color: perfil.cor }}>●</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>⚡ Desafios</h2>
            <ul className={styles.list}>
              {perfil.desafios.map(item => (
                <li key={item}>
                  <span className={styles.listIcon} style={{ color: 'var(--text-muted)' }}>●</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Características */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Características do Perfil</h2>
          <div className={styles.tagsGrid}>
            {perfil.caracteristicas.map(c => (
              <span
                key={c}
                className={styles.tag}
                style={{ borderColor: `${perfil.cor}44`, color: perfil.cor }}
              >
                {c}
              </span>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaCard}>
            <h2>Quer saber mais?</h2>
            <p>
              Seu resultado foi salvo. Em breve nossa equipe entrará em contato para
              aprofundar a análise do seu perfil comportamental.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/')}
              style={{ marginTop: 8 }}
            >
              Fazer Nova Avaliação
            </button>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <img src="/logo-instituto.png" alt="Instituto Corporativo Hugo Almeida" className={styles.footerLogo} />
        <p>© {new Date().getFullYear()} DNA Comercial · Todos os direitos reservados</p>
      </footer>
    </div>
  )
}
