import type { TransactionSource } from '../../types/finance'
import { cn } from '../../utils/cn'

const styles: Record<TransactionSource, string> = {
  manual: 'bg-slate-100 text-slate-800 ring-slate-200',
  import_csv: 'bg-emerald-100 text-emerald-950 ring-emerald-200/90',
}

const labels: Record<TransactionSource, string> = {
  manual: 'Manual',
  import_csv: 'Extrato',
}

export function Badge({ source }: { source: TransactionSource }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset',
        styles[source],
      )}
    >
      {labels[source]}
    </span>
  )
}
