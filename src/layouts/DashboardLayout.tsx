import { Bell } from 'lucide-react'
import { Outlet, useLocation } from 'react-router-dom'
import { SidebarLayout } from './SidebarLayout'
import { Button } from '../components/ui/Button'

const titles: Record<string, string> = {
  '/dashboard': 'Painel',
  '/lancamentos': 'Lançamentos',
  '/categorias': 'Categorias',
  '/analises': 'Análises',
  '/configuracoes': 'Configurações',
}

export function DashboardLayout() {
  const location = useLocation()
  const title = titles[location.pathname] ?? 'Horizon'
  return (
    <SidebarLayout>
      <header className="sticky top-0 z-10 shrink-0 border-b border-slate-200/90 bg-white/90 shadow-sm shadow-slate-900/[0.04] backdrop-blur-md">
        <div className="mx-auto flex h-[4.25rem] max-w-[min(1680px,calc(100vw-2rem))] items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Horizon
            </p>
            <h1 className="truncate text-xl font-semibold tracking-[-0.02em] text-slate-900 sm:text-2xl">
              {title}
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              className="!h-11 !w-11 !p-0 text-slate-600"
              type="button"
              aria-label="Notificações (demonstração)"
            >
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto w-full max-w-[min(1680px,calc(100vw-2rem))] px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <Outlet />
        </div>
      </main>
    </SidebarLayout>
  )
}
