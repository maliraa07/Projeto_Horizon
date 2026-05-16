import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { Button } from './Button'
import { cn } from '../../utils/cn'

type Props = {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
}

export function Modal({ open, title, onClose, children, footer }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="horizon-modal-title"
    >
      <div
        className={cn(
          'w-full max-w-xl rounded-2xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-900/15 ring-1 ring-slate-900/[0.03]',
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-7 py-5 sm:px-8">
          <h2 id="horizon-modal-title" className="pr-2 text-xl font-semibold tracking-tight text-slate-900">
            {title}
          </h2>
          <Button
            type="button"
            variant="ghost"
            className="!h-10 !w-10 shrink-0 !p-0 text-slate-500"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="px-7 py-6 sm:px-8 sm:py-7">{children}</div>
        {footer ? (
          <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-7 py-4 sm:px-8">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  )
}
