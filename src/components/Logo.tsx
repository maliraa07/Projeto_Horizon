import { cn } from '../utils/cn'

type Props = {
  className?: string
  /** Só o símbolo (padrão) ou símbolo + nome Horizon */
  variant?: 'mark' | 'wordmark'
  /** Texto claro para fundos escuros (ex.: painel de login). */
  inverted?: boolean
}

/** Logo Horizon: barras de fluxo + moeda — vibe verde finanças. */
export function Logo({ className, variant = 'mark', inverted = false }: Props) {
  const mark = (
    <svg
      className={cn('shrink-0', variant === 'wordmark' ? 'h-11 w-11' : 'h-full w-full', className)}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="horizon-logo-bg" x1="6" y1="4" x2="36" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#065f46" />
          <stop offset="0.4" stopColor="#059669" />
          <stop offset="1" stopColor="#2dd4bf" />
        </linearGradient>
        <linearGradient id="horizon-logo-shine" x1="10" y1="6" x2="26" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill="url(#horizon-logo-bg)" />
      <rect width="40" height="40" rx="12" fill="url(#horizon-logo-shine)" />
      <rect x="9" y="22" width="5" height="9" rx="1.5" fill="white" fillOpacity="0.93" />
      <rect x="16" y="17" width="5" height="14" rx="1.5" fill="white" fillOpacity="0.93" />
      <rect x="23" y="11" width="5" height="20" rx="1.5" fill="white" fillOpacity="0.93" />
      <circle cx="28" cy="26" r="5.5" fill="#fbbf24" />
      <circle cx="28" cy="26" r="3.2" fill="#fef3c7" />
      <circle cx="26.5" cy="24.5" r="1.1" fill="white" fillOpacity="0.55" />
    </svg>
  )

  if (variant === 'wordmark') {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        {mark}
        <div className="min-w-0 leading-tight">
          <p
            className={cn(
              'text-[17px] font-bold tracking-tight',
              inverted
                ? 'text-white'
                : 'bg-gradient-to-r from-emerald-900 via-emerald-600 to-teal-500 bg-clip-text text-transparent',
            )}
          >
            Horizon
          </p>
          <p
            className={cn(
              'text-xs font-semibold',
              inverted ? 'text-emerald-200/90' : 'text-emerald-700/90',
            )}
          >
            Controle de gastos
          </p>
        </div>
      </div>
    )
  }

  return mark
}
