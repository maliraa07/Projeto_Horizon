import type { ExpenseCategory } from '../types/finance'

/** Categoria criada/sobrescrita quando o extrato traz valores positivos (entradas). */
export const receitasSeedCategory: ExpenseCategory = {
  id: 'cat-receitas',
  name: 'Receitas',
  color: '#059669',
  monthlyBudget: 0,
}

export const seedCategories: ExpenseCategory[] = [
  { id: 'cat-moradia', name: 'Moradia', color: '#6366f1', monthlyBudget: 0 },
  { id: 'cat-alimentacao', name: 'Alimentação', color: '#22c55e', monthlyBudget: 0 },
  { id: 'cat-transporte', name: 'Transporte', color: '#0ea5e9', monthlyBudget: 0 },
  { id: 'cat-saude', name: 'Saúde', color: '#f43f5e', monthlyBudget: 0 },
  { id: 'cat-assinaturas', name: 'Assinaturas', color: '#a855f7', monthlyBudget: 0 },
  { id: 'cat-lazer', name: 'Lazer', color: '#f59e0b', monthlyBudget: 0 },
  { id: 'cat-educacao', name: 'Educação / Trabalho', color: '#14b8a6', monthlyBudget: 0 },
  receitasSeedCategory,
  { id: 'cat-outros', name: 'Outros', color: '#64748b', monthlyBudget: 0 },
]
