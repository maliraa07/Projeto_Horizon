import { type ExpenseCategory, type Transaction, isExpenseTransaction } from '../types/finance'

export function inMonth(dateIso: string, monthYm: string) {
  return dateIso.startsWith(monthYm)
}

/** Soma só saídas (gastos) no mês. */
export function monthExpenseTotal(transactions: Transaction[], monthYm: string) {
  return transactions
    .filter((t) => inMonth(t.date, monthYm) && isExpenseTransaction(t))
    .reduce((s, t) => s + t.amount, 0)
}

/** Entradas (importadas como créditos) no mês. */
export function monthIncomeTotal(transactions: Transaction[], monthYm: string) {
  return transactions
    .filter((t) => inMonth(t.date, monthYm) && !isExpenseTransaction(t))
    .reduce((s, t) => s + t.amount, 0)
}

/** Alias: total de gastos no mês (comportamento legado compatível para gráficos e comparações). */
export function monthTotal(transactions: Transaction[], monthYm: string) {
  return monthExpenseTotal(transactions, monthYm)
}

export function totalsByCategory(
  transactions: Transaction[],
  categories: ExpenseCategory[],
  monthYm: string,
) {
  const map = new Map<string, number>()
  for (const t of transactions) {
    if (!inMonth(t.date, monthYm) || !isExpenseTransaction(t)) continue
    map.set(t.categoryId, (map.get(t.categoryId) ?? 0) + t.amount)
  }
  return categories
    .map((c) => ({
      category: c,
      total: map.get(c.id) ?? 0,
    }))
    .filter((x) => x.total > 0)
    .sort((a, b) => b.total - a.total)
}

export function budgetUsage(
  transactions: Transaction[],
  categories: ExpenseCategory[],
  monthYm: string,
) {
  return categories
    .filter((c) => c.monthlyBudget > 0)
    .map((c) => {
      const spent = transactions
        .filter(
          (t) => t.categoryId === c.id && inMonth(t.date, monthYm) && isExpenseTransaction(t),
        )
        .reduce((s, t) => s + t.amount, 0)
      return { category: c, spent, budget: c.monthlyBudget }
    })
    .sort((a, b) => b.spent / b.budget - a.spent / a.budget)
}
