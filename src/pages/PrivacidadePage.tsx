import { Shield } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useAuthStore } from '../store/authStore'
import { LGPD_POLICY_VERSION, lgpdPoliticaMeta, lgpdSecoes } from '../content/lgpd'

function RichParagraph({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return (
    <p className="text-[0.9375rem] leading-relaxed text-slate-700">
      {parts.map((chunk, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-slate-900">
            {chunk}
          </strong>
        ) : (
          <span key={i}>{chunk}</span>
        ),
      )}
    </p>
  )
}

export function PrivacidadePage() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const logoHref = isAuthenticated ? '/dashboard' : '/login'

  return (
    <div className="min-h-dvh bg-[#f4faf7]">
      <header className="border-b border-emerald-200/40 bg-white/90 shadow-sm shadow-emerald-900/[0.04] backdrop-blur-md">
        <div className="mx-auto flex max-w-[min(1680px,calc(100vw-2rem))] items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link
            to={logoHref}
            className="min-w-0 rounded-xl outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <Logo variant="wordmark" className="max-w-[min(100%,280px)]" />
          </Link>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => navigate('/login')}>
              Entrar
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/sobre')}>
              Sobre
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-10 flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/80">
            <Shield className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {lgpdPoliticaMeta.titulo}
            </h1>
            <p className="mt-2 text-[0.9375rem] text-slate-600">{lgpdPoliticaMeta.subtitulo}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
              Versão da política: {LGPD_POLICY_VERSION} · Atualização: {lgpdPoliticaMeta.atualizacao}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {lgpdSecoes.map((sec) => (
            <Card key={sec.id} padding="lg" className="border-emerald-100/80 bg-white/95">
              <h2 className="text-xl font-semibold tracking-tight text-emerald-950">{sec.titulo}</h2>
              <div className="mt-4 space-y-4">
                {sec.paragrafos.map((p, i) => (
                  <RichParagraph key={i} text={p} />
                ))}
              </div>
            </Card>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-slate-500">
          <Link
            to="/login"
            className="font-medium text-emerald-700 underline decoration-emerald-200 underline-offset-[5px] transition hover:text-emerald-800"
          >
            Voltar ao acesso
          </Link>
        </p>
      </main>
    </div>
  )
}
