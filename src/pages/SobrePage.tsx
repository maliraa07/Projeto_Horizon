import { BookOpen, ExternalLink } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useAuthStore } from '../store/authStore'
import { useSettingsStore } from '../store/settingsStore'
import { sobreConteudo } from '../content/sobre'

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

const outlineLinkClass =
  'inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-[0.9375rem] font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400'

export function SobrePage() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const displayName = useSettingsStore((s) => s.displayName)
  const nome = displayName?.trim() ? displayName.trim() : sobreConteudo.nomePreferido

  const { links } = sobreConteudo
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
          <div className="flex shrink-0 items-center gap-2">
            {isAuthenticated ? (
              <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                Ir ao painel
              </Button>
            ) : (
              <Button type="button" onClick={() => navigate('/login')}>
                Entrar
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-10 flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/80">
            <BookOpen className="h-6 w-6" aria-hidden />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Sobre</h1>
            <p className="mt-2 text-[0.9375rem] text-slate-600">
              Um pouco do projeto Horizon e de quem está por trás do código.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <Card padding="lg" className="border-emerald-100/80 bg-white/95">
            <h2 className="text-xl font-semibold tracking-tight text-emerald-950">
              {sobreConteudo.sobreProjeto.titulo}
            </h2>
            <div className="mt-4 space-y-4">
              {sobreConteudo.sobreProjeto.paragrafos.map((p, i) => (
                <RichParagraph key={i} text={p} />
              ))}
            </div>
          </Card>

          <Card padding="lg" className="border-emerald-100/80 bg-white/95">
            <h2 className="text-xl font-semibold tracking-tight text-emerald-950">Sobre mim</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">
              {nome} · {sobreConteudo.tituloCargo}
            </p>
            <div className="mt-4 space-y-4">
              {sobreConteudo.sobreMim.map((p, i) => (
                <p key={i} className="text-[0.9375rem] leading-relaxed text-slate-700">
                  {p}
                </p>
              ))}
            </div>

            {(links.github || links.linkedin || links.portfolio) && (
              <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-100 pt-6">
                {links.github ? (
                  <a
                    href={links.github}
                    target="_blank"
                    rel="noreferrer"
                    className={outlineLinkClass}
                  >
                    GitHub
                    <ExternalLink className="h-4 w-4 opacity-70" />
                  </a>
                ) : null}
                {links.linkedin ? (
                  <a
                    href={links.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className={outlineLinkClass}
                  >
                    LinkedIn
                    <ExternalLink className="h-4 w-4 opacity-70" />
                  </a>
                ) : null}
                {links.portfolio ? (
                  <a
                    href={links.portfolio}
                    target="_blank"
                    rel="noreferrer"
                    className={outlineLinkClass}
                  >
                    Portfólio
                    <ExternalLink className="h-4 w-4 opacity-70" />
                  </a>
                ) : null}
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  )
}
