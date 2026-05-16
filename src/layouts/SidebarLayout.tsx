import {
  BookOpen,
  Briefcase,
  Building2,
  CalendarDays,
  ChevronRight,
  LayoutDashboard,
  LineChart,
  LogOut,
  PanelLeft,
  PanelLeftClose,
  Phone,
  Receipt,
  Settings2,
  Shield,
  Tags,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  USAGE_GOAL_LABELS,
  USAGE_GOALS,
  formatMemberSincePt,
  type UsageGoal,
} from '../constants/userProfile'
import { useAuthStore } from '../store/authStore'
import { useSettingsStore } from '../store/settingsStore'
import { useUiStore } from '../store/uiStore'
import { Logo } from '../components/Logo'
import { cn } from '../utils/cn'

const nav = [
  { to: '/dashboard', label: 'Painel', icon: LayoutDashboard },
  { to: '/lancamentos', label: 'Lançamentos', icon: Receipt },
  { to: '/categorias', label: 'Categorias', icon: Tags },
  { to: '/analises', label: 'Análises', icon: LineChart },
  { to: '/sobre', label: 'Sobre', icon: BookOpen },
  { to: '/configuracoes', label: 'Configurações', icon: Settings2 },
]

function userInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function normalizeUsageGoal(v: string): UsageGoal {
  return USAGE_GOALS.includes(v as UsageGoal) ? (v as UsageGoal) : 'pessoal'
}

export function SidebarLayout({ children }: { children: ReactNode }) {
  const collapsed = useUiStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)
  const logout = useAuthStore((s) => s.logout)
  const displayName = useSettingsStore((s) => s.displayName)
  const workEmail = useSettingsStore((s) => s.workEmail)
  const phone = useSettingsStore((s) => s.phone)
  const jobTitle = useSettingsStore((s) => s.jobTitle)
  const organization = useSettingsStore((s) => s.organization)
  const usageGoalRaw = useSettingsStore((s) => s.usageGoal)
  const memberSince = useSettingsStore((s) => s.memberSince)

  const usageGoal = normalizeUsageGoal(usageGoalRaw)
  const initials = userInitials(displayName)
  const sinceLabel = formatMemberSincePt(memberSince)

  const userCardTitle = [
    displayName.trim() || 'Perfil sem nome',
    workEmail,
    phone && `Tel. ${phone}`,
    jobTitle,
    organization,
    USAGE_GOAL_LABELS[usageGoal],
    sinceLabel && `Desde ${sinceLabel}`,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="flex min-h-dvh">
      <aside
        className={cn(
          'sticky top-0 flex h-dvh shrink-0 flex-col overflow-hidden border-r border-slate-200/90 bg-white/95 shadow-[4px_0_24px_-12px_rgb(15_23_42/0.12)] backdrop-blur-md',
          'transition-[width] duration-200 ease-out motion-reduce:transition-none',
          collapsed ? 'w-20 min-w-[5rem]' : 'w-72 min-w-[18rem]',
        )}
      >
        <div
          className={cn(
            'flex shrink-0 border-b border-slate-100',
            collapsed
              ? 'flex-col items-center gap-2 px-2 py-3'
              : 'h-[4.25rem] flex-row items-center justify-between gap-2 px-4',
          )}
        >
          <div
            className={cn(
              'flex min-w-0 items-center',
              collapsed ? 'justify-center' : 'min-w-0 flex-1',
            )}
          >
            {collapsed ? (
              <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl shadow-md shadow-emerald-900/15 ring-1 ring-emerald-900/10">
                <Logo />
              </div>
            ) : (
              <Logo variant="wordmark" className="min-w-0" />
            )}
          </div>
          <button
            type="button"
            onClick={toggleSidebar}
            title={collapsed ? 'Expandir menu' : 'Recolher menu'}
            className={cn(
              'shrink-0 rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800',
              collapsed && 'w-10',
            )}
            aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {collapsed ? (
              <PanelLeft className="mx-auto h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className={cn('shrink-0 border-b border-slate-100', collapsed ? 'px-2 py-2' : 'px-3 py-3')}>
          <Link
            to="/configuracoes"
            title={userCardTitle}
            className={cn(
              'group flex rounded-xl border border-slate-200/90 bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/50 shadow-sm ring-1 ring-emerald-100/60 transition',
              'hover:border-emerald-200 hover:shadow-md hover:ring-emerald-200/80',
              collapsed ? 'flex-col items-center justify-center p-2' : 'max-h-[min(52vh,22rem)] flex-col gap-2.5 overflow-hidden p-2.5 sm:max-h-none',
            )}
          >
            <div className={cn('flex w-full', collapsed ? 'justify-center' : 'items-start gap-3')}>
              <div
                className={cn(
                  'flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 via-teal-50 to-white text-[13px] font-bold tracking-tight text-emerald-900 ring-1 ring-emerald-200/70',
                  collapsed ? 'h-10 w-10' : 'h-11 w-11',
                )}
                aria-hidden
              >
                {initials}
              </div>
              {!collapsed ? (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold leading-tight text-slate-900">
                    {displayName.trim() || 'Defina seu nome'}
                  </p>
                  <p className="mt-0.5 truncate text-xs font-medium text-slate-500">{workEmail}</p>
                </div>
              ) : null}
            </div>

            {!collapsed ? (
              <div className="max-h-40 space-y-1.5 overflow-y-auto pr-0.5 text-xs text-slate-600">
                {phone.trim() ? (
                  <p className="flex items-start gap-2">
                    <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700/80" aria-hidden />
                    <span className="min-w-0 break-words leading-snug">{phone.trim()}</span>
                  </p>
                ) : null}
                {jobTitle.trim() ? (
                  <p className="flex items-start gap-2">
                    <Briefcase className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700/80" aria-hidden />
                    <span className="min-w-0 break-words leading-snug">{jobTitle.trim()}</span>
                  </p>
                ) : null}
                {organization.trim() ? (
                  <p className="flex items-start gap-2">
                    <Building2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700/80" aria-hidden />
                    <span className="min-w-0 break-words leading-snug">{organization.trim()}</span>
                  </p>
                ) : null}
                <p className="flex items-start gap-2">
                  <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700/80" aria-hidden />
                  <span className="leading-snug">{USAGE_GOAL_LABELS[usageGoal]}</span>
                </p>
                {sinceLabel ? (
                  <p className="flex items-start gap-2 text-slate-500">
                    <CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-700/70" aria-hidden />
                    <span className="leading-snug">Membro desde {sinceLabel}</span>
                  </p>
                ) : null}
              </div>
            ) : null}

            {!collapsed ? (
              <div className="flex items-center justify-between gap-2 border-t border-emerald-100/80 pt-2">
                <p className="flex min-w-0 flex-1 items-center gap-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-700/90">
                  Conta
                  <ChevronRight className="h-3 w-3 shrink-0 opacity-70 transition group-hover:translate-x-0.5" />
                </p>
                <p className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                  Só local
                </p>
              </div>
            ) : null}
          </Link>
        </div>

        <p
          className={cn(
            'shrink-0 px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400',
            collapsed && 'sr-only',
          )}
        >
          Navegação
        </p>
        <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden px-3 pb-3 pt-0.5">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[0.9375rem] font-medium transition',
                  collapsed && 'justify-center px-0',
                  isActive
                    ? 'bg-emerald-50 text-emerald-950 shadow-sm ring-1 ring-emerald-200/90'
                    : 'text-slate-600 hover:bg-emerald-50/50 hover:text-slate-900',
                )
              }
            >
              <item.icon className="h-[1.15rem] w-[1.15rem] shrink-0 opacity-90" />
              {!collapsed ? <span className="truncate">{item.label}</span> : null}
            </NavLink>
          ))}
        </nav>

        <div className="shrink-0 border-t border-slate-100 bg-slate-50/40 p-3">
          <button
            type="button"
            onClick={logout}
            title={collapsed ? 'Sair' : undefined}
            className={cn(
              'flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[0.9375rem] font-medium text-rose-700 transition hover:bg-rose-50',
              collapsed && 'justify-center px-0',
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed ? <span>Sair</span> : null}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  )
}
