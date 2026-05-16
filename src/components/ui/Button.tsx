import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/cn'

const variants = {
  primary:
    'bg-horizon-600 text-white shadow-sm hover:bg-horizon-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-horizon-600',
  ghost:
    'bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400',
  danger:
    'bg-rose-600 text-white hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600',
  outline:
    'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400',
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants
  children: ReactNode
}

export function Button({
  variant = 'primary',
  className,
  children,
  type = 'button',
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-[0.9375rem] font-semibold transition disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
