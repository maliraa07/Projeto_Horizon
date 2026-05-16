import type { InputHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  hint?: string
}

export function Input({ label, hint, id, className, ...props }: Props) {
  const inputId = id ?? label.replace(/\s+/g, '-').toLowerCase()
  return (
    <label className="flex flex-col gap-2 text-left text-[0.9375rem] font-semibold text-slate-700">
      <span>{label}</span>
      <input
        id={inputId}
        className={cn(
          'min-h-[2.75rem] rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[0.9375rem] font-normal text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-horizon-500 focus:ring-[3px] focus:ring-horizon-200/80',
          className,
        )}
        {...props}
      />
      {hint ? <span className="text-xs font-medium leading-relaxed text-slate-500">{hint}</span> : null}
    </label>
  )
}
