// Página de diagnóstico — acesse /diagnostico no browser para ver o status
// REMOVA ESTE ARQUIVO antes de ir para produção final
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function DiagnosticoPage() {
  const url = (import.meta.env.VITE_SUPABASE_URL as string || '').trim()
  const key = (import.meta.env.VITE_SUPABASE_ANON_KEY as string || '').trim()
  const [pingResult, setPingResult] = useState<string>('Testando...')

  useEffect(() => {
    async function ping() {
      try {
        const { error } = await supabase.from('leads').select('id').limit(1)
        if (error) {
          setPingResult(`❌ ERRO ${error.code}: ${error.message}`)
        } else {
          setPingResult('✅ Conexão OK — Supabase respondeu com sucesso!')
        }
      } catch (e) {
        setPingResult(`❌ Exceção: ${String(e)}`)
      }
    }
    ping()
  }, [])

  const style = { fontFamily: 'monospace', padding: 32, color: '#f0ede8', background: '#0d0d14', minHeight: '100vh' }
  const row = { marginBottom: 12, fontSize: 14 }
  const label = { color: '#c8a96e', fontWeight: 'bold' as const }
  const value = { color: '#a09880' }

  return (
    <div style={style}>
      <h1 style={{ color: '#c8a96e', marginBottom: 24 }}>Diagnóstico de Conexão Supabase</h1>

      <div style={row}>
        <span style={label}>VITE_SUPABASE_URL: </span>
        <span style={value}>{url || '❌ VAZIO'}</span>
      </div>

      <div style={row}>
        <span style={label}>URL válida?: </span>
        <span style={value}>{url.startsWith('https://') && url.includes('.supabase.co') ? '✅ Sim' : '❌ Formato inválido'}</span>
      </div>

      <div style={row}>
        <span style={label}>Tem /rest/v1/?: </span>
        <span style={value}>{url.includes('/rest/v1') ? '⚠️ SIM — remova esse sufixo da variável na Vercel' : '✅ Não (correto)'}</span>
      </div>

      <div style={row}>
        <span style={label}>VITE_SUPABASE_ANON_KEY (primeiros 30 chars): </span>
        <span style={value}>{key ? key.slice(0, 30) + '...' : '❌ VAZIO'}</span>
      </div>

      <div style={row}>
        <span style={label}>Key começa com eyJ?: </span>
        <span style={value}>{key.startsWith('eyJ') ? '✅ Sim (formato JWT correto)' : '❌ Não — chave provavelmente errada'}</span>
      </div>

      <div style={row}>
        <span style={label}>Comprimento da key: </span>
        <span style={value}>{key.length} caracteres {key.length > 200 ? '✅ (parece correto)' : '⚠️ (muito curta — verifique)'}</span>
      </div>

      <hr style={{ borderColor: '#333', margin: '24px 0' }} />

      <div style={row}>
        <span style={label}>Teste de INSERT na tabela leads: </span>
        <span style={{ color: pingResult.startsWith('✅') ? '#52c87a' : '#ff6b6b' }}>{pingResult}</span>
      </div>

      <hr style={{ borderColor: '#333', margin: '24px 0' }} />

      <p style={{ color: '#5a5560', fontSize: 12 }}>
        Acesse esta página em: <strong style={{ color: '#c8a96e' }}>/diagnostico</strong><br />
        Remova DiagnosticoPage.tsx e a rota /diagnostico do App.tsx antes de publicar.
      </p>
    </div>
  )
}
