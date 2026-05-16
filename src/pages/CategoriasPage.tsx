import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { useCategoriesStore } from '../store/categoriesStore'
import { useTransactionsStore } from '../store/transactionsStore'
import type { ExpenseCategory } from '../types/finance'
import { formatBRL } from '../utils/format'

const emptyCat = (): ExpenseCategory => ({
  id: crypto.randomUUID(),
  name: '',
  color: '#3b6cff',
  monthlyBudget: 0,
})

export function CategoriasPage() {
  const categories = useCategoriesStore((s) => s.categories)
  const upsert = useCategoriesStore((s) => s.upsertCategory)
  const remove = useCategoriesStore((s) => s.removeCategory)
  const transactions = useTransactionsStore((s) => s.transactions)

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ExpenseCategory | null>(null)
  const [draft, setDraft] = useState<ExpenseCategory>(emptyCat())

  const usage = useMemo(() => {
    const m = new Map<string, number>()
    for (const t of transactions) {
      m.set(t.categoryId, (m.get(t.categoryId) ?? 0) + 1)
    }
    return m
  }, [transactions])

  const openCreate = () => {
    setEditing(null)
    setDraft(emptyCat())
    setModalOpen(true)
  }

  const openEdit = (c: ExpenseCategory) => {
    setEditing(c)
    setDraft({ ...c })
    setModalOpen(true)
  }

  const save = () => {
    if (!draft.name.trim()) return
    upsert({
      ...draft,
      id: editing?.id ?? draft.id,
      name: draft.name.trim(),
      monthlyBudget: Number(draft.monthlyBudget) || 0,
    })
    setModalOpen(false)
  }

  const tryRemove = (c: ExpenseCategory) => {
    const n = usage.get(c.id) ?? 0
    if (n > 0) {
      window.alert(
        `Não é possível remover: existem ${n} lançamento(s) usando esta categoria. Edite ou exclua os lançamentos antes.`,
      )
      return
    }
    if (!window.confirm(`Remover a categoria "${c.name}"?`)) return
    remove(c.id)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          Tipos de gasto usados nos gráficos e no importador de extrato. Orçamento mensal é
          opcional.
        </p>
        <Button type="button" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Nova categoria
        </Button>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Cor</th>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Orçamento mensal</th>
                <th className="px-4 py-3">Uso</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3">
                    <span
                      className="inline-block h-6 w-6 rounded-full ring-2 ring-white shadow"
                      style={{ backgroundColor: c.color }}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">{c.name}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {c.monthlyBudget > 0 ? formatBRL(c.monthlyBudget) : '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {(usage.get(c.id) ?? 0).toString()} lançamento(s)
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        className="!p-2"
                        onClick={() => openEdit(c)}
                        aria-label="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="!p-2 text-rose-700 hover:bg-rose-50"
                        onClick={() => tryRemove(c)}
                        aria-label="Remover"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        open={modalOpen}
        title={editing ? 'Editar categoria' : 'Nova categoria'}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={save} disabled={!draft.name.trim()}>
              Salvar
            </Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Nome"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="Ex.: Assinaturas"
          />
          <label className="flex flex-col gap-1.5 text-left text-sm font-medium text-slate-700">
            Cor
            <input
              type="color"
              value={draft.color}
              onChange={(e) => setDraft({ ...draft, color: e.target.value })}
              className="h-10 w-full cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
            />
          </label>
          <Input
            label="Orçamento mensal (R$) — opcional"
            type="number"
            min={0}
            step="1"
            value={draft.monthlyBudget || ''}
            onChange={(e) =>
              setDraft({
                ...draft,
                monthlyBudget: e.target.value === '' ? 0 : Number(e.target.value),
              })
            }
            hint="Use 0 para não acompanhar limite nesta categoria."
          />
        </div>
      </Modal>
    </div>
  )
}
