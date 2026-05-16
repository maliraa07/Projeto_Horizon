import { format, subMonths } from 'date-fns'
import { useMemo, useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useCategoriesStore } from '../store/categoriesStore'
import { useTransactionsStore } from '../store/transactionsStore'
import { monthExpenseTotal } from '../utils/financeSummary'
import { exportTransactionsCsv, formatBRLDetailed } from '../utils/format'

function ym(d: Date) {
  return format(d, 'yyyy-MM')
}

export function AnalisesPage() {
  const categories = useCategoriesStore((s) => s.categories)
  const transactions = useTransactionsStore((s) => s.transactions)

  const [a, setA] = useState(() => ym(subMonths(new Date(), 1)))
  const [b, setB] = useState(() => ym(new Date()))

  const totalA = useMemo(() => monthExpenseTotal(transactions, a), [transactions, a])
  const totalB = useMemo(() => monthExpenseTotal(transactions, b), [transactions, b])

  const delta = totalB - totalA
  const pct = totalA > 0 ? Math.round((delta / totalA) * 100) : null

  const catName = useMemo(() => {
    const m = new Map<string, string>()
    for (const c of categories) m.set(c.id, c.name)
    return m
  }, [categories])

  const exportAll = () => {
    exportTransactionsCsv(
      transactions.map((t) => {
        const ci = t.creditInstallment
        const parcelado =
          t.method === 'credito' && ci?.isInstallment ? 'sim' : t.method === 'credito' ? 'nao' : ''
        return {
          date: t.date,
          amount: t.amount,
          description: t.description,
          category: catName.get(t.categoryId) ?? '—',
          method: t.method,
          source: t.source,
          creditoParcelado: parcelado,
          creditoParcelas: ci?.isInstallment ? String(ci.installments) : '',
          creditoValorParcela:
            ci?.isInstallment ? ci.monthlyAmount.toFixed(2).replace('.', ',') : '',
        }
      }),
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-semibold text-slate-900">Comparar meses</h2>
        <p className="mt-1 text-sm text-slate-600">
          Compare dois meses para ver se o período atual ficou mais caro que o outro.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Mês base
            <input
              type="month"
              value={a}
              onChange={(e) => setA(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-horizon-500 focus:ring-2 focus:ring-horizon-200"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Mês para comparar
            <input
              type="month"
              value={b}
              onChange={(e) => setB(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-horizon-500 focus:ring-2 focus:ring-horizon-200"
            />
          </label>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm font-medium text-slate-500">Gastos no mês base</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{formatBRLDetailed(totalA)}</p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-slate-500">Gastos no mês comparado</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{formatBRLDetailed(totalB)}</p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-slate-500">Variação (comparado − base)</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{formatBRLDetailed(delta)}</p>
          <p className="mt-1 text-xs text-slate-500">
            {pct == null
              ? 'Sem gastos no mês base para calcular o percentual.'
              : `${pct}% em relação ao mês base`}
          </p>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Exportar tudo</h2>
            <p className="text-sm text-slate-600">
              Gera um CSV com separador <code className="rounded bg-slate-100 px-1">;</code> e
              valores no padrão brasileiro.
            </p>
          </div>
          <Button type="button" variant="outline" onClick={exportAll} disabled={!transactions.length}>
            Baixar CSV
          </Button>
        </div>
      </Card>
    </div>
  )
}
