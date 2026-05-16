import { useEffect, useMemo, useState } from 'react'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { Modal } from './ui/Modal'
import { useCategoriesStore } from '../store/categoriesStore'
import { useTransactionsStore } from '../store/transactionsStore'
import type { PaymentMethod, Transaction } from '../types/finance'
import { receitasSeedCategory } from '../data/seedFinance'
import {
  guessColumns,
  inferImportSignStrategy,
  parseCsvObjects,
  parseImportRow,
} from '../utils/bankCsv'
import {
  categoryNameById,
  guessCategoryId,
} from '../utils/categoryMatcher'
import { formatBRLDetailed } from '../utils/format'

type Props = {
  open: boolean
  onClose: () => void
  onImported?: (result: { count: number; monthYm: string | null }) => void
}

function fingerprint(t: Pick<Transaction, 'date' | 'amount' | 'description' | 'cashFlowKind'>) {
  const kind = t.cashFlowKind === 'income' ? 'in' : 'out'
  const d = t.description.trim().toLowerCase().replace(/\s+/g, ' ')
  return `${kind}|${t.date}|${t.amount.toFixed(2)}|${d}`
}

export function ImportExtratoModal({ open, onClose, onImported }: Props) {
  const categories = useCategoriesStore((s) => s.categories)
  const upsertCategory = useCategoriesStore((s) => s.upsertCategory)
  const addMany = useTransactionsStore((s) => s.addMany)
  const existing = useTransactionsStore((s) => s.transactions)

  const [rawText, setRawText] = useState('')
  const [headers, setHeaders] = useState<string[]>([])
  const [rows, setRows] = useState<Record<string, string>[]>([])
  const [dateCol, setDateCol] = useState<string>('')
  const [amountCol, setAmountCol] = useState<string>('')
  const [descCol, setDescCol] = useState<string>('')
  const [fallbackCategoryId, setFallbackCategoryId] = useState<string>('')
  const [autoCategorize, setAutoCategorize] = useState(true)
  const [method, setMethod] = useState<PaymentMethod>('transferencia')
  const [skipDuplicates, setSkipDuplicates] = useState(true)
  const [importFeedback, setImportFeedback] = useState<{
    type: 'error' | 'success'
    message: string
  } | null>(null)

  useEffect(() => {
    if (!open) return
    if (fallbackCategoryId) return
    const outros =
      categories.find((c) => c.id === 'cat-outros') ??
      categories.find((c) => /outros/i.test(c.name)) ??
      categories[0]
    if (outros) setFallbackCategoryId(outros.id)
  }, [open, categories, fallbackCategoryId])

  useEffect(() => {
    if (!open) {
      setImportFeedback(null)
      setRawText('')
      setHeaders([])
      setRows([])
      setDateCol('')
      setAmountCol('')
      setDescCol('')
    }
  }, [open])

  const existingKeys = useMemo(() => {
    const s = new Set<string>()
    for (const t of existing) {
      s.add(fingerprint(t))
    }
    return s
  }, [existing])

  const signStrategy = useMemo(() => {
    if (!dateCol || !amountCol || !rows.length) return inferImportSignStrategy([], '', '')
    return inferImportSignStrategy(rows, dateCol, amountCol)
  }, [rows, dateCol, amountCol])

  /** Garante categoria para classificar valores positivos no modo misto. */
  useEffect(() => {
    if (!open) return
    if (signStrategy !== 'mixed_debit_credit') return
    const hasReceitas = categories.some((c) => c.id === receitasSeedCategory.id)
    if (hasReceitas) return
    upsertCategory(receitasSeedCategory)
  }, [open, signStrategy, categories, upsertCategory])

  const loadFile = async (file: File) => {
    setImportFeedback(null)
    const text = await file.text()
    setRawText(text)
    const { headers: h, rows: r } = parseCsvObjects(text)
    setHeaders(h)
    setRows(r.slice(0, 5000))
    const guess = guessColumns(h)
    const dCol = guess.date ?? h[0] ?? ''
    const aCol = guess.amount ?? h[1] ?? ''
    const desc = guess.description ?? h[2] ?? ''
    setDateCol(dCol)
    setAmountCol(aCol)
    setDescCol(desc)
  }

  const receitasCategoryId = categories.find((c) => c.id === receitasSeedCategory.id)?.id

  const resolveRowCategory = (
    description: string,
    transactionKind: 'expense' | 'income',
  ) => {
    const incomeFb = receitasCategoryId ?? fallbackCategoryId
    if (!fallbackCategoryId) {
      return { categoryId: incomeFb, source: 'fallback' as const }
    }
    if (!autoCategorize) {
      return {
        categoryId: transactionKind === 'income' ? incomeFb : fallbackCategoryId,
        source: 'fallback' as const,
      }
    }
    return guessCategoryId(description, categories, fallbackCategoryId, existing, {
      transactionKind,
      incomeFallbackId: incomeFb,
    })
  }

  const preview = useMemo(() => {
    if (!dateCol || !amountCol) return []
    return rows.slice(0, 25).map((row) => {
      const parsed = parseImportRow(row, {
        dateCol,
        amountCol,
        descCol,
        signStrategy,
      })
      if (!parsed.ok)
        return {
          ...parsed,
          categoryId: '',
          categoryName: '—',
          guessSource: undefined,
          cashFlowKind: undefined,
        }
      const txKind = parsed.cashFlowKind === 'income' ? 'income' : 'expense'
      const guess = resolveRowCategory(parsed.description, txKind)
      return {
        ...parsed,
        categoryId: guess.categoryId,
        categoryName: categoryNameById(categories, guess.categoryId),
        guessSource: guess.source,
      }
    })
  }, [
    rows,
    dateCol,
    amountCol,
    descCol,
    signStrategy,
    autoCategorize,
    fallbackCategoryId,
    receitasCategoryId,
    categories,
    existing,
  ])

  const importableCount = useMemo(() => {
    if (!dateCol || !amountCol || !fallbackCategoryId) return 0
    const seen = new Set<string>(existingKeys)
    let count = 0
    for (const row of rows) {
      const parsed = parseImportRow(row, { dateCol, amountCol, descCol, signStrategy })
      if (!parsed.ok) continue
      const fp = fingerprint(parsed)
      if (skipDuplicates && seen.has(fp)) continue
      seen.add(fp)
      count++
    }
    return count
  }, [rows, dateCol, amountCol, descCol, signStrategy, fallbackCategoryId, skipDuplicates, existingKeys])

  const previewOkCount = preview.filter((p) => p.ok).length

  const importAll = () => {
    setImportFeedback(null)
    if (!fallbackCategoryId || !dateCol || !amountCol) {
      setImportFeedback({
        type: 'error',
        message: 'Selecione a categoria de fallback e as colunas de data e valor antes de importar.',
      })
      return
    }

    const batchId = crypto.randomUUID()
    const next: Transaction[] = []
    const seen = new Set<string>(existingKeys)
    const monthCounts = new Map<string, number>()

    for (const row of rows) {
      const parsed = parseImportRow(row, { dateCol, amountCol, descCol, signStrategy })
      if (!parsed.ok) continue

      const fp = fingerprint(parsed)
      if (skipDuplicates && seen.has(fp)) continue
      seen.add(fp)

      const txKind = parsed.cashFlowKind === 'income' ? 'income' : 'expense'
      const { categoryId: rowCategoryId } = resolveRowCategory(parsed.description, txKind)

      const record: Transaction = {
        id: crypto.randomUUID(),
        date: parsed.date,
        amount: parsed.amount,
        description: parsed.description,
        categoryId: rowCategoryId,
        method,
        source: 'import_csv',
        importBatchId: batchId,
      }
      if (parsed.cashFlowKind === 'income') {
        record.cashFlowKind = 'income'
      }
      next.push(record)

      const ym = parsed.date.slice(0, 7)
      monthCounts.set(ym, (monthCounts.get(ym) ?? 0) + 1)
    }

    if (!next.length) {
      const dupHint =
        skipDuplicates && previewOkCount > 0
          ? ' Parece que as linhas já existem (duplicatas) — desmarque "Pular duplicatas" ou mude a regra de valor.'
          : previewOkCount === 0
            ? ' Na prévia, nenhuma linha está "Conforme". Revise o mapeamento das colunas ou o arquivo.'
            : ' Revise a prévia e o mapeamento das colunas.'

      setImportFeedback({
        type: 'error',
        message: `Nenhum lançamento foi importado.${dupHint}`,
      })
      return
    }

    addMany(next)

    let topMonth: string | null = null
    let top = 0
    for (const [ym, n] of monthCounts) {
      if (n > top) {
        top = n
        topMonth = ym
      }
    }

    onImported?.({ count: next.length, monthYm: topMonth })
    setImportFeedback({
      type: 'success',
      message: `${next.length} lançamento(s) importado(s).${
        topMonth
          ? ` A lista foi ajustada para ${topMonth.slice(5, 7)}/${topMonth.slice(0, 4)}.`
          : ''
      }`,
    })

    setTimeout(() => {
      onClose()
      setRawText('')
      setHeaders([])
      setRows([])
      setImportFeedback(null)
    }, 1200)
  }

  return (
    <Modal
      open={open}
      title="Importar extrato (CSV)"
      onClose={onClose}
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={importAll}
            disabled={!headers.length || !dateCol || !amountCol || !fallbackCategoryId || !rows.length}
          >
            Importar{importableCount > 0 ? ` (${importableCount})` : ''}
          </Button>
        </>
      }
    >
      <div className="space-y-4 text-left text-sm text-slate-700">
        <p>
          Exporte o extrato do seu banco em <strong>CSV</strong> (UTF-8 ou separado por{' '}
          <code className="rounded bg-slate-100 px-1">;</code>) e envie aqui. Depois, associe as
          colunas de <strong>data</strong>, <strong>valor</strong> e, se houver,{' '}
          <strong>descrição</strong>.
        </p>

        {importFeedback ? (
          <div
            role="alert"
            className={
              importFeedback.type === 'success'
                ? 'rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950'
                : 'rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950'
            }
          >
            {importFeedback.message}
          </div>
        ) : null}

        <label className="flex cursor-pointer flex-col gap-2">
          <span className="font-medium text-slate-800">Arquivo</span>
          <input
            type="file"
            accept=".csv,.txt,text/csv,text/plain"
            className="text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-horizon-600 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-horizon-500"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) void loadFile(f)
              e.target.value = ''
            }}
          />
        </label>

        {headers.length ? (
          <Card padding="sm" className="bg-slate-50">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Mapeamento de colunas
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
                Data
                <select
                  value={dateCol}
                  onChange={(e) => {
                    setDateCol(e.target.value)
                    setImportFeedback(null)
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm"
                >
                  <option value="">Selecione…</option>
                  {headers.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
                Valor
                <select
                  value={amountCol}
                  onChange={(e) => {
                    setAmountCol(e.target.value)
                    setImportFeedback(null)
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm"
                >
                  <option value="">Selecione…</option>
                  {headers.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
                Descrição (opcional)
                <select
                  value={descCol}
                  onChange={(e) => setDescCol(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm"
                >
                  <option value="">—</option>
                  {headers.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
                Categoria quando não houver correspondência
                <select
                  value={fallbackCategoryId}
                  onChange={(e) => setFallbackCategoryId(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm"
                >
                  {categories.length === 0 ? (
                    <option value="">Crie uma categoria antes</option>
                  ) : (
                    categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))
                  )}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
                Forma de pagamento (lote)
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as PaymentMethod)}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm"
                >
                  <option value="transferencia">Transferência / conta</option>
                  <option value="credito">Cartão de crédito</option>
                  <option value="debito">Débito</option>
                  <option value="pix">Pix</option>
                  <option value="outro">Outro</option>
                </select>
              </label>
            </div>

            <label className="mt-3 flex items-start gap-2 text-xs font-medium text-slate-800">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={autoCategorize}
                onChange={(e) => {
                  setAutoCategorize(e.target.checked)
                  setImportFeedback(null)
                }}
              />
              <span>
                Categorizar automaticamente pela descrição (ex.: Uber → Transporte, Netflix →
                Assinaturas). Usa também lançamentos que você já cadastrou antes.
              </span>
            </label>

            <div className="mt-3 rounded-lg border border-slate-200/80 bg-white px-3 py-2">
              <p className="text-[11px] font-semibold text-slate-700">Interpretação dos valores</p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
                {signStrategy === 'mixed_debit_credit' ? (
                  <>
                    Detectamos valores <strong>positivos</strong> e <strong>negativos</strong>{' '}
                    no arquivo: valores negativos entram como <strong>saídas</strong> (gastos) e
                    positivos como <strong>entradas</strong>. A categoria <strong>Receitas</strong>{' '}
                    é criada quando necessário para classificar entradas.
                  </>
                ) : (
                  <>
                    Este arquivo só traz valores com o mesmo sinal; todos foram tratados como{' '}
                    <strong>saídas</strong> usando o valor absoluto (cenário típico de só fatura ou
                    só gastos positivos).
                  </>
                )}
              </p>
            </div>

            <label className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-800">
              <input
                type="checkbox"
                checked={skipDuplicates}
                onChange={(e) => {
                  setSkipDuplicates(e.target.checked)
                  setImportFeedback(null)
                }}
              />
              Pular duplicatas (mesma data, valor e descrição de um lançamento já existente)
            </label>
          </Card>
        ) : null}

        {headers.length ? (
          <p className="text-xs text-slate-500">
            {rows.length} linhas detectadas
            {importableCount > 0
              ? ` · ${importableCount} pronta(s) para importar`
              : ' · nenhuma linha elegível (valores zerados ou colunas incompletas)'}
            {rawText ? ` · ${Math.round(rawText.length / 1024)} KB` : ''}
          </p>
        ) : null}

        {headers.length ? (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Prévia (25 linhas) — linhas &quot;Conforme&quot; entram na importação
            </p>
            <div className="max-h-56 overflow-auto rounded-xl border border-slate-200">
              <table className="min-w-full text-xs">
                <thead className="bg-slate-50 text-left text-[11px] font-semibold uppercase text-slate-500">
                  <tr>
                    <th className="px-2 py-2">Status</th>
                    <th className="px-2 py-2">Data</th>
                    <th className="px-2 py-2">Tipo</th>
                    <th className="px-2 py-2">Valor</th>
                    <th className="px-2 py-2">Descrição</th>
                    <th className="px-2 py-2">Categoria</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {preview.map((p, i) => (
                    <tr key={i} className={p.ok ? '' : 'bg-amber-50/60'}>
                      <td className="px-2 py-1.5">{p.ok ? 'Conforme' : p.reason}</td>
                      <td className="px-2 py-1.5">{p.ok ? p.date : '—'}</td>
                      <td className="px-2 py-1.5">
                        {p.ok ? (
                          p.cashFlowKind === 'income' ? (
                            <span className="font-medium text-emerald-700">Entrada</span>
                          ) : (
                            'Saída'
                          )
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-2 py-1.5 tabular-nums">
                        {p.ok ? (
                          p.cashFlowKind === 'income' ? (
                            <span className="font-medium text-emerald-700">
                              +{formatBRLDetailed(p.amount)}
                            </span>
                          ) : (
                            formatBRLDetailed(p.amount)
                          )
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="max-w-[160px] truncate px-2 py-1.5">{p.description}</td>
                      <td className="max-w-[120px] truncate px-2 py-1.5 text-slate-600">
                        {p.ok ? (
                          <>
                            {p.categoryName}
                            {autoCategorize && p.guessSource === 'history' ? (
                              <span className="ml-1 text-[10px] text-emerald-600" title="Igual a um lançamento anterior">
                                · hist.
                              </span>
                            ) : null}
                          </>
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  )
}
