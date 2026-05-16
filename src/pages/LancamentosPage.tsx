import { format } from 'date-fns'
import { FileUp, Pencil, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ImportExtratoModal } from '../components/ImportExtratoModal'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { useCategoriesStore } from '../store/categoriesStore'
import { useSettingsStore } from '../store/settingsStore'
import { useTransactionsStore } from '../store/transactionsStore'
import type { CreditInstallmentInfo, PaymentMethod, Transaction } from '../types/finance'
import { isExpenseTransaction, PAYMENT_LABELS } from '../types/finance'
import { inMonth } from '../utils/financeSummary'
import { formatBRLDetailed } from '../utils/format'

const emptyTx = (categoryId: string): Transaction => ({
  id: crypto.randomUUID(),
  date: format(new Date(), 'yyyy-MM-dd'),
  amount: 0,
  description: '',
  categoryId,
  method: 'pix',
  source: 'manual',
})

function defaultCreditBlock(amount: number): CreditInstallmentInfo {
  return {
    isInstallment: false,
    installments: 2,
    monthlyAmount: amount > 0 ? amount : 0,
  }
}

function formatFormaCell(t: Transaction): string {
  const base = PAYMENT_LABELS[t.method]
  if (t.method === 'credito' && t.creditInstallment?.isInstallment) {
    const { installments, monthlyAmount } = t.creditInstallment
    return `${base} · ${installments}x ${formatBRLDetailed(monthlyAmount)}/mês`
  }
  return base
}

export function LancamentosPage() {
  const categories = useCategoriesStore((s) => s.categories)
  const transactions = useTransactionsStore((s) => s.transactions)
  const upsert = useTransactionsStore((s) => s.updateTransaction)
  const add = useTransactionsStore((s) => s.addTransaction)
  const remove = useTransactionsStore((s) => s.removeTransaction)

  const monthYm = useSettingsStore((s) => s.financeReferenceMonthYm)
  const setSettings = useSettingsStore((s) => s.setSettings)

  const [importOpen, setImportOpen] = useState(false)
  const [importNotice, setImportNotice] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [draft, setDraft] = useState<Transaction>(() => emptyTx(''))

  const defaultCat = categories[0]?.id ?? ''

  const list = useMemo(() => {
    return transactions
      .filter((t) => inMonth(t.date, monthYm))
      .sort((a, b) => (a.date === b.date ? b.amount - a.amount : b.date.localeCompare(a.date)))
  }, [transactions, monthYm])

  const catName = useMemo(() => {
    const m = new Map<string, string>()
    for (const c of categories) m.set(c.id, c.name)
    return m
  }, [categories])

  const openCreate = () => {
    setEditing(null)
    setDraft(emptyTx(defaultCat))
    setModalOpen(true)
  }

  const openEdit = (t: Transaction) => {
    setEditing(t)
    setDraft({ ...t })
    setModalOpen(true)
  }

  const save = () => {
    const amountRaw = Number(draft.amount)
    if (
      !draft.description.trim() ||
      !draft.categoryId ||
      !Number.isFinite(amountRaw) ||
      amountRaw <= 0
    ) {
      return
    }

    let amount = amountRaw
    let creditInstallment: Transaction['creditInstallment']

    if (draft.method === 'credito') {
      const ci = draft.creditInstallment
      if (ci?.isInstallment) {
        const n = Math.round(Number(ci.installments))
        if (n < 2 || n > 60) return
        amount = amountRaw
        creditInstallment = { isInstallment: true, installments: n, monthlyAmount: amount }
      } else {
        creditInstallment = undefined
      }
    } else {
      creditInstallment = undefined
    }

    const record: Transaction = {
      ...draft,
      id: editing?.id ?? draft.id,
      amount,
      description: draft.description.trim(),
      source: editing?.source ?? 'manual',
      importBatchId: editing?.importBatchId,
      creditInstallment,
    }
    if (editing) upsert(record)
    else add(record)
    setSettings({ financeReferenceMonthYm: record.date.slice(0, 7) })
    setModalOpen(false)
  }

  const credParcel = draft.method === 'credito' && draft.creditInstallment?.isInstallment
  const instN = Math.round(Number(draft.creditInstallment?.installments ?? 0))
  const parcelFieldsInvalid =
    credParcel && (instN < 2 || instN > 60 || !Number.isFinite(instN))

  const amountNum = Number(draft.amount)
  const saveDisabled =
    !draft.description.trim() ||
    !draft.categoryId ||
    !Number.isFinite(amountNum) ||
    amountNum <= 0 ||
    parcelFieldsInvalid

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex max-w-md flex-col gap-1">
          <label className="flex flex-col gap-1 text-left text-sm font-medium text-slate-700">
            Mês de referência
            <input
              type="month"
              value={monthYm}
              onChange={(e) => {
                setSettings({ financeReferenceMonthYm: e.target.value })
                setImportNotice(null)
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-horizon-500 focus:ring-2 focus:ring-horizon-200"
            />
          </label>
          <p className="text-xs text-slate-500">
            Só aparecem lançamentos deste mês. O mesmo período vale para o <strong>Painel</strong>. Ao
            salvar ou importar, o mês muda para o dos lançamentos incluídos.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => setImportOpen(true)}>
            <FileUp className="h-4 w-4" />
            Importar extrato (CSV)
          </Button>
          <Button type="button" onClick={openCreate} disabled={!defaultCat}>
            <Plus className="h-4 w-4" />
            Novo gasto
          </Button>
        </div>
      </div>

      {importNotice ? (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950"
        >
          {importNotice}
        </div>
      ) : null}

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Descrição</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Forma</th>
                <th className="px-4 py-3">Origem</th>
                <th className="px-4 py-3 text-right">Valor</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {list.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 whitespace-nowrap text-slate-700">
                    {format(new Date(t.date + 'T12:00:00'), 'dd/MM/yyyy')}
                  </td>
                  <td className="max-w-[240px] px-4 py-3">
                    <p className="truncate font-medium text-slate-900">{t.description}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            categories.find((c) => c.id === t.categoryId)?.color ?? '#94a3b8',
                        }}
                      />
                      {catName.get(t.categoryId) ?? '—'}
                    </span>
                  </td>
                  <td className="max-w-[200px] px-4 py-3 text-slate-600">
                    <span className="text-sm leading-snug">{formatFormaCell(t)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge source={t.source} />
                  </td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums">
                    {isExpenseTransaction(t) ? (
                      <span className="text-slate-900">{formatBRLDetailed(t.amount)}</span>
                    ) : (
                      <span className="text-emerald-700">+{formatBRLDetailed(t.amount)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        className="!p-2"
                        onClick={() => openEdit(t)}
                        aria-label="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="!p-2 text-rose-700 hover:bg-rose-50"
                        onClick={() => {
                          if (window.confirm('Excluir este lançamento?')) remove(t.id)
                        }}
                        aria-label="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {list.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-500">
                    {transactions.some((t) => !inMonth(t.date, monthYm))
                      ? 'Nenhum gasto neste mês na lista — altere o "Mês de referência" acima ou importe de novo.'
                      : 'Nenhum gasto neste mês. Adicione manualmente ou importe um CSV de extrato.'}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>

      <ImportExtratoModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImported={({ count, monthYm: ym }) => {
          if (ym) setSettings({ financeReferenceMonthYm: ym })
          setImportNotice(
            `${count} lançamento(s) importado(s).${ym ? ` Exibindo o mês ${ym.slice(5, 7)}/${ym.slice(0, 4)}.` : ''}`,
          )
        }}
      />

      <Modal
        open={modalOpen}
        title={editing ? 'Editar gasto' : 'Novo gasto'}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={save} disabled={saveDisabled}>
              Salvar
            </Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Data"
            type="date"
            value={draft.date}
            onChange={(e) => setDraft({ ...draft, date: e.target.value })}
          />
          <Input
            label={
              draft.method === 'credito' && draft.creditInstallment?.isInstallment
                ? 'Valor de cada parcela (R$)'
                : 'Valor (R$)'
            }
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            value={draft.amount === 0 ? '' : draft.amount}
            onChange={(e) => {
              const v = e.target.value === '' ? 0 : Number(e.target.value)
              setDraft((d) => ({
                ...d,
                amount: v,
                creditInstallment:
                  d.method === 'credito' && d.creditInstallment
                    ? { ...d.creditInstallment, monthlyAmount: v }
                    : d.creditInstallment,
              }))
            }}
          />
          <div className="sm:col-span-2">
            <Input
              label="Descrição"
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              placeholder="Ex.: Mercado, Uber, Netflix…"
            />
          </div>
          <label className="flex flex-col gap-1.5 text-left text-sm font-medium text-slate-700">
            Categoria
            <select
              value={draft.categoryId}
              onChange={(e) => setDraft({ ...draft, categoryId: e.target.value })}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-horizon-500 focus:ring-2 focus:ring-horizon-200"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-left text-sm font-medium text-slate-700">
            Forma de pagamento
            <select
              value={draft.method}
              onChange={(e) => {
                const method = e.target.value as PaymentMethod
                setDraft((d) => {
                  const next: Transaction = { ...d, method }
                  if (method === 'credito') {
                    next.creditInstallment = d.creditInstallment ?? defaultCreditBlock(d.amount)
                  } else {
                    next.creditInstallment = undefined
                  }
                  return next
                })
              }}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-horizon-500 focus:ring-2 focus:ring-horizon-200"
            >
              {(Object.keys(PAYMENT_LABELS) as PaymentMethod[]).map((k) => (
                <option key={k} value={k}>
                  {PAYMENT_LABELS[k]}
                </option>
              ))}
            </select>
          </label>

          {draft.method === 'credito' ? (
            <div className="sm:col-span-2 space-y-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-sm font-semibold text-slate-800">Detalhes do crédito</p>
              <fieldset className="flex flex-wrap gap-6 border-0 p-0">
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
                  <input
                    type="radio"
                    name="cred-parcela"
                    className="h-4 w-4 accent-horizon-600"
                    checked={!draft.creditInstallment?.isInstallment}
                    onChange={() =>
                      setDraft((d) => ({
                        ...d,
                        creditInstallment: {
                          ...(d.creditInstallment ?? defaultCreditBlock(d.amount)),
                          isInstallment: false,
                        },
                      }))
                    }
                  />
                  À vista (uma cobrança)
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
                  <input
                    type="radio"
                    name="cred-parcela"
                    className="h-4 w-4 accent-horizon-600"
                    checked={!!draft.creditInstallment?.isInstallment}
                    onChange={() =>
                      setDraft((d) => {
                        const base = d.creditInstallment ?? defaultCreditBlock(d.amount)
                        const amt = d.amount > 0 ? d.amount : base.monthlyAmount
                        return {
                          ...d,
                          amount: amt > 0 ? amt : d.amount,
                          creditInstallment: {
                            ...base,
                            isInstallment: true,
                            installments: Math.max(2, base.installments),
                            monthlyAmount: amt > 0 ? amt : base.monthlyAmount,
                          },
                        }
                      })
                    }
                  />
                  Parcelado
                </label>
              </fieldset>

              {draft.creditInstallment?.isInstallment ? (
                <div className="space-y-3">
                  <Input
                    label="Em quantas vezes?"
                    type="number"
                    inputMode="numeric"
                    min={2}
                    max={60}
                    step={1}
                    value={
                      draft.creditInstallment.installments === 0
                        ? ''
                        : draft.creditInstallment.installments
                    }
                    onChange={(e) => {
                      const raw = e.target.value
                      const n = raw === '' ? 0 : Math.round(Number(raw))
                      setDraft((d) => {
                        const ci = d.creditInstallment
                        if (!ci) return d
                        return {
                          ...d,
                          creditInstallment: { ...ci, installments: n },
                        }
                      })
                    }}
                    hint="Entre 2 e 60 parcelas. O valor por mês é o campo acima (valor de cada parcela)."
                  />
                  {Number.isFinite(amountNum) &&
                  amountNum > 0 &&
                  instN >= 2 &&
                  instN <= 60 ? (
                    <p className="rounded-lg border border-emerald-100 bg-emerald-50/80 px-3 py-2 text-xs leading-relaxed text-emerald-950">
                      <strong className="font-semibold">Total estimado da compra:</strong>{' '}
                      {formatBRLDetailed(amountNum * instN)} ({instN} × {formatBRLDetailed(amountNum)})
                    </p>
                  ) : null}
                  {parcelFieldsInvalid ? (
                    <p className="text-xs font-medium text-rose-700">
                      Informe entre 2 e 60 parcelas para salvar.
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="text-xs leading-relaxed text-slate-600">
                  No crédito à vista, use o campo &quot;Valor (R$)&quot; acima como o valor total cobrado
                  na fatura.
                </p>
              )}
            </div>
          ) : null}
        </div>
      </Modal>
    </div>
  )
}
