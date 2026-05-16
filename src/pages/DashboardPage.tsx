import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card } from '../components/ui/Card'
import { useCategoriesStore } from '../store/categoriesStore'
import { useSettingsStore } from '../store/settingsStore'
import { useTransactionsStore } from '../store/transactionsStore'
import { budgetUsage, monthExpenseTotal, monthIncomeTotal, totalsByCategory } from '../utils/financeSummary'
import { formatBRL, formatBRLDetailed } from '../utils/format'

export function DashboardPage() {
  const categories = useCategoriesStore((s) => s.categories)
  const transactions = useTransactionsStore((s) => s.transactions)
  const monthYm = useSettingsStore((s) => s.financeReferenceMonthYm)
  const setSettings = useSettingsStore((s) => s.setSettings)

  const totalExpenses = useMemo(
    () => monthExpenseTotal(transactions, monthYm),
    [transactions, monthYm],
  )
  const totalIncome = useMemo(
    () => monthIncomeTotal(transactions, monthYm),
    [transactions, monthYm],
  )
  const byCat = useMemo(
    () => totalsByCategory(transactions, categories, monthYm),
    [transactions, categories, monthYm],
  )
  const budgets = useMemo(
    () => budgetUsage(transactions, categories, monthYm),
    [transactions, categories, monthYm],
  )

  const count = useMemo(
    () => transactions.filter((t) => t.date.startsWith(monthYm)).length,
    [transactions, monthYm],
  )

  const top = byCat[0]

  const pieData = byCat.map((x) => ({
    name: x.category.name,
    value: x.total,
    color: x.category.color,
  }))

  const barData = budgets.map((b) => ({
    name: b.category.name,
    gasto: b.spent,
    orcamento: b.budget,
    color: b.category.color,
  }))

  return (
    <div className="space-y-8 lg:space-y-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-1">
          <p className="text-[0.9375rem] leading-relaxed text-slate-600">
            Resumo dos seus gastos por categoria e acompanhamento de orçamentos.
          </p>
        </div>
        <label className="flex w-full max-w-[14rem] flex-col gap-2 text-left text-[0.9375rem] font-semibold text-slate-700">
          Mês — igual a Lançamentos
          <input
            type="month"
            value={monthYm}
            onChange={(e) => setSettings({ financeReferenceMonthYm: e.target.value })}
            className="min-h-[2.75rem] rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[0.9375rem] shadow-sm outline-none focus:border-horizon-500 focus:ring-[3px] focus:ring-horizon-200/80"
          />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-[0.9375rem] font-semibold text-slate-500">Gastos no mês</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {formatBRLDetailed(totalExpenses)}
          </p>
          {totalIncome > 0 ? (
            <p className="mt-2 text-sm font-semibold text-emerald-700">
              Entradas: {formatBRLDetailed(totalIncome)}
            </p>
          ) : null}
          <p className="mt-2 text-xs font-medium leading-relaxed text-slate-500">
            Gráficos e totais por categoria consideram apenas saídas (gastos).
          </p>
        </Card>
        <Card>
          <p className="text-[0.9375rem] font-semibold text-slate-500">Lançamentos</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {count}
          </p>
          <p className="mt-2 text-xs font-medium leading-relaxed text-slate-500">
            Manual + importados via extrato.
          </p>
        </Card>
        <Card>
          <p className="text-[0.9375rem] font-semibold text-slate-500">Maior categoria</p>
          <p className="mt-3 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            {top ? top.category.name : '—'}
          </p>
          <p className="mt-2 text-xs font-medium leading-relaxed text-slate-500">
            {top ? formatBRLDetailed(top.total) : 'Sem dados neste mês.'}
          </p>
        </Card>
        <Card>
          <p className="text-[0.9375rem] font-semibold text-slate-500">Categorias ativas</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {byCat.length}
          </p>
          <p className="mt-2 text-xs font-medium leading-relaxed text-slate-500">
            Com gasto registrado no mês.
          </p>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2 xl:gap-8">
        <Card>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
            Distribuição por tipo
          </h2>
          <p className="mt-1 text-[0.9375rem] text-slate-600">
            Onde o dinheiro está saindo neste mês.
          </p>
          <div className="mt-6 h-80">
            {pieData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={62}
                    outerRadius={102}
                    paddingAngle={2}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatBRL(Number(value ?? 0))} />
                  <Legend wrapperStyle={{ fontSize: 13 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="flex h-full items-center justify-center text-[0.9375rem] text-slate-500">
                Sem gastos neste mês para montar o gráfico.
              </p>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">Orçamento vs gasto</h2>
          <p className="mt-1 text-[0.9375rem] text-slate-600">
            Defina um valor mensal em <strong>Categorias</strong> para acompanhar barras de
            progresso.
          </p>
          <div className="mt-6 h-80">
            {barData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical" margin={{ left: 8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tickFormatter={(v) => formatBRL(v)} tick={{ fontSize: 12 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip formatter={(value) => formatBRL(Number(value ?? 0))} />
                  <Legend wrapperStyle={{ fontSize: 13 }} />
                  <Bar dataKey="gasto" name="Gasto" fill="#059669" radius={[0, 6, 6, 0]} />
                  <Bar dataKey="orcamento" name="Orçamento" fill="#a7f3d0" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="flex h-full items-center justify-center text-[0.9375rem] text-slate-500">
                Nenhuma categoria com orçamento definido ainda.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
