# DISC Assessment System

Sistema profissional de avaliação DISC com painel administrativo completo.

---

## Stack

- **Frontend**: React + Vite + TypeScript
- **Backend/DB**: Supabase (PostgreSQL + Auth + RLS)
- **Deploy**: Vercel
- **Charts**: Recharts
- **Export**: SheetJS (xlsx)

---

## Estrutura de Pastas

```
disc-system/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── admin/
│   │       ├── AdminLayout.tsx / .module.css
│   │       ├── ConfirmModal.tsx / .module.css
│   │       ├── LeadDetailModal.tsx / .module.css
│   │       └── ProtectedRoute.tsx
│   ├── hooks/
│   │   ├── useAuth.tsx
│   │   └── useLeads.ts
│   ├── lib/
│   │   ├── disc.ts          ← 24 perguntas + cálculo + perfis
│   │   ├── export.ts        ← CSV e Excel
│   │   └── supabase.ts      ← cliente Supabase
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx / .module.css
│   │   │   ├── AdminLeads.tsx / .module.css
│   │   │   └── AdminLogin.tsx / .module.css
│   │   └── public/
│   │       ├── LandingPage.tsx / .module.css
│   │       ├── ResultadoPage.tsx / .module.css
│   │       └── TestePage.tsx / .module.css
│   ├── styles/
│   │   └── globals.css
│   ├── types/
│   │   └── database.ts
│   ├── App.tsx
│   └── main.tsx
├── supabase/
│   └── schema.sql
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
├── vercel.json
└── vite.config.ts
```

---

## Passo 1 — Configurar o Supabase

### 1.1 Criar o projeto

1. Acesse [supabase.com](https://supabase.com) e crie uma conta (gratuita).
2. Clique em **New Project**.
3. Escolha um nome, senha do banco e região (preferencialmente South America).
4. Aguarde o projeto inicializar (~2 min).

### 1.2 Executar o SQL

1. No painel do Supabase, vá em **SQL Editor** → **New Query**.
2. Cole o conteúdo de `supabase/schema.sql`.
3. Clique em **Run**.

> **Observação**: Se aparecer erro nos índices `gin_trgm_ops`, execute antes:
> ```sql
> CREATE EXTENSION IF NOT EXISTS pg_trgm;
> ```
> Depois execute o schema novamente.

### 1.3 Criar o usuário administrador

1. Vá em **Authentication** → **Users** → **Add user**.
2. Insira o e-mail e senha do administrador.
3. Clique em **Create user**.

> Este usuário será usado para fazer login em `/admin/login`.

### 1.4 Obter as credenciais

1. Vá em **Project Settings** → **API**.
2. Copie:
   - **Project URL** (ex: `https://xyzxyzxyz.supabase.co`)
   - **anon public** key

---

## Passo 2 — Configurar o Ambiente Local

### 2.1 Instalar dependências

```bash
npm install
```

### 2.2 Criar o arquivo `.env`

Copie o `.env.example`:

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais reais do Supabase:

```env
VITE_SUPABASE_URL=https://SEU_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

> **Importante**: A URL deve ser a URL base do projeto, **sem** `/rest/v1/` no final. O cliente JavaScript adiciona esse caminho automaticamente.

### 2.3 Rodar localmente

```bash
npm run dev
```

Acesse:
- Área pública: `http://localhost:5173/`
- Admin: `http://localhost:5173/admin/login`

---

## Passo 3 — Deploy na Vercel

### 3.1 Subir o código no GitHub

```bash
git init
git add .
git commit -m "feat: DISC Assessment System"
git remote add origin https://github.com/seu-usuario/disc-system.git
git push -u origin main
```

### 3.2 Conectar na Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login.
2. Clique em **Add New Project**.
3. Importe o repositório do GitHub.
4. Em **Framework Preset**, selecione **Vite**.
5. Clique em **Environment Variables** e adicione:

| Nome | Valor |
|------|-------|
| `VITE_SUPABASE_URL` | `https://SEU_PROJECT_ID.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `sua_anon_key_aqui` |

6. Clique em **Deploy**.

### 3.3 Configurar domínio no Supabase (CORS)

1. No Supabase, vá em **Project Settings** → **API**.
2. Em **CORS allowed origins**, adicione a URL da sua Vercel (ex: `https://disc-system.vercel.app`).
3. Clique em **Save**.

---

## Funcionalidades

### Área Pública (`/`)
- Landing page profissional com visual DISC
- Formulário de captura (nome, e-mail, telefone)
- Checkbox de consentimento obrigatório (LGPD)
- 24 perguntas DISC com navegação intuitiva
- Barra de progresso animada
- Resultado completo com gráficos (Radar + Barras)
- Descrição detalhada do perfil, pontos fortes e desafios

### Área Admin (`/admin`)
- Login seguro via Supabase Auth
- Proteção de rotas (visitantes não acessam)
- **Dashboard**: KPIs, gráfico de perfis (pizza), evolução temporal (diário/semanal/mensal)
- **Leads**: tabela completa com busca, filtros, ordenação e paginação
- Visualização detalhada de cada resultado
- Exclusão individual e em lote (com confirmação)
- Exportação CSV e Excel

---

## Segurança (RLS)

| Operação | Anônimo (público) | Autenticado (admin) |
|----------|-------------------|---------------------|
| INSERT   | ✅ Permitido       | ✅ Permitido         |
| SELECT   | ❌ Bloqueado       | ✅ Permitido         |
| UPDATE   | ✅ Permitido*      | ✅ Permitido         |
| DELETE   | ❌ Bloqueado       | ✅ Permitido         |

> *UPDATE anônimo é necessário para salvar o resultado do teste após a conclusão, sem exigir login do participante.

---

## Preparado para o Futuro

A arquitetura está pronta para integração com serviços de e-mail:

```ts
// src/lib/email.ts (a ser criado)
// Exemplo com Resend:
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)
await resend.emails.send({ to: lead.email, ... })

// Exemplo com SendGrid:
import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
await sgMail.send({ to: lead.email, ... })
```

---

## Scripts Disponíveis

```bash
npm run dev       # Servidor de desenvolvimento
npm run build     # Build de produção
npm run preview   # Preview do build local
npm run lint      # Linting TypeScript
```
