import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Logo } from '../components/Logo'
import { cn } from '../utils/cn'

const highlights = [
  'Lançamentos e categorias no mesmo fluxo',
  'Importação de extrato (CSV) na demo',
  'Gráficos e análises sem sair do painel',
]

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh w-full grid-rows-[auto_1fr] bg-slate-950 lg:grid-cols-[minmax(0,11fr)_minmax(0,13fr)] lg:grid-rows-1 xl:grid-cols-2">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_-15%,_rgb(16_185_129/0.22),_transparent_55%)] lg:hidden"
      />

      {/* Mobile / tablet: faixa compacta */}
      <header className="relative z-10 shrink-0 border-b border-emerald-900/25 bg-gradient-to-b from-emerald-950 to-slate-950 px-4 py-5 sm:px-6 sm:py-6 lg:hidden">
        <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-3 text-center sm:flex-row sm:items-center sm:gap-4 sm:text-left">
          <Logo variant="wordmark" inverted className="shrink-0 sm:max-w-[200px]" />
          <p className="text-sm leading-snug text-emerald-100/85 sm:min-w-0 sm:flex-1">
            Controle de gastos no navegador — demonstração local, sem servidor.
          </p>
        </div>
      </header>

      {/* Desktop: painel de descrições */}
      <aside
        className={cn(
          'relative hidden min-h-0 flex-col justify-center border-emerald-900/25 bg-gradient-to-b from-emerald-950 to-slate-950 lg:flex lg:h-dvh lg:border-r lg:overflow-y-auto',
          'px-8 py-10 xl:px-14 xl:py-12',
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_0%_0%,_rgb(16_185_129/0.2),_transparent_55%)]"
        />
        <div className="relative z-10 mx-auto w-full max-w-md space-y-6 xl:max-w-lg">
          <div className="font-display text-white">
            <Logo variant="wordmark" inverted />
          </div>
          <div className="space-y-3">
            <p className="font-display text-[clamp(1.25rem,2.2vw,1.75rem)] font-semibold leading-[1.2] tracking-[-0.02em] text-white/95">
              Seu dinheiro, organizado em um só lugar.
            </p>
            <p className="text-sm leading-relaxed text-emerald-100/80 lg:text-[0.9375rem]">
              O Horizon reúne lançamentos, categorias e visão analítica para você enxergar para onde
              vai cada real — com interface pensada para o dia a dia.
            </p>
          </div>
          <ul className="space-y-2.5">
            {highlights.map((line) => (
              <li key={line} className="flex gap-2.5 text-sm leading-snug text-emerald-50/90">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/30">
                  <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden />
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4 text-xs leading-relaxed text-emerald-100/75">
            <strong className="font-semibold text-emerald-50">Modo demonstração:</strong> use
            qualquer e-mail e senha. Nada é enviado a um servidor; os dados ficam neste aparelho. Leia a{' '}
            <Link
              to="/privacidade"
              className="font-semibold text-emerald-50 underline decoration-emerald-300/50 underline-offset-2 hover:text-white"
            >
              Política de Privacidade (LGPD)
            </Link>
            .
          </div>
          <p className="text-xs text-emerald-200/55">Horizon · portfólio</p>
        </div>
      </aside>

      {/* Formulário */}
      <main className="relative z-10 flex min-h-0 min-h-[50dvh] flex-1 flex-col lg:h-dvh lg:min-h-0">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_50%_at_50%_0%,_rgb(16_185_129/0.08),_transparent_50%)]"
        />
        <div
          className={cn(
            'relative flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain',
            'px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10 xl:px-14',
            'pb-[max(1.5rem,env(safe-area-inset-bottom))]',
          )}
        >
          <div className="mx-auto flex w-full min-w-0 max-w-[min(100%,28rem)] flex-1 flex-col justify-center sm:max-w-md lg:max-w-[26rem] xl:max-w-md">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
