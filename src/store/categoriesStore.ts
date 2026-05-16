import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { seedCategories } from '../data/seedFinance'
import type { ExpenseCategory } from '../types/finance'

type CategoriesState = {
  categories: ExpenseCategory[]
  upsertCategory: (c: ExpenseCategory) => void
  removeCategory: (id: string) => void
}

export const useCategoriesStore = create<CategoriesState>()(
  persist(
    (set, get) => ({
      categories: seedCategories,
      upsertCategory: (c) =>
        set({
          categories: (() => {
            const list = get().categories
            const i = list.findIndex((x) => x.id === c.id)
            if (i === -1) return [...list, c]
            const next = [...list]
            next[i] = c
            return next
          })(),
        }),
      removeCategory: (id) =>
        set({
          categories: get().categories.filter((x) => x.id !== id),
        }),
    }),
    { name: 'horizon-finance-categories' },
  ),
)
