import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Transaction } from '../types/finance'

type TransactionsState = {
  transactions: Transaction[]
  addTransaction: (t: Transaction) => void
  addMany: (items: Transaction[]) => void
  updateTransaction: (t: Transaction) => void
  removeTransaction: (id: string) => void
  removeByImportBatch: (batchId: string) => void
}

export const useTransactionsStore = create<TransactionsState>()(
  persist(
    (set, get) => ({
      transactions: [],
      addTransaction: (t) =>
        set({ transactions: [t, ...get().transactions] }),
      addMany: (items) =>
        set({ transactions: [...items, ...get().transactions] }),
      updateTransaction: (t) =>
        set({
          transactions: get().transactions.map((x) => (x.id === t.id ? t : x)),
        }),
      removeTransaction: (id) =>
        set({
          transactions: get().transactions.filter((x) => x.id !== id),
        }),
      removeByImportBatch: (batchId) =>
        set({
          transactions: get().transactions.filter((x) => x.importBatchId !== batchId),
        }),
    }),
    { name: 'horizon-finance-transactions' },
  ),
)
