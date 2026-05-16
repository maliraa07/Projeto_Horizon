import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/cn'

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  padding?: 'sm' | 'md' | 'lg'
}

export function Card({ children, className, padding = 'md', ...props }: Props) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/90 bg-white shadow-md shadow-slate-900/[0.04] ring-1 ring-white/60',
        padding === 'sm' && 'p-4 sm:p-5',
        padding === 'md' && 'p-6 sm:p-7 md:p-8',
        padding === 'lg' && 'p-7 sm:p-8 md:p-10',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
