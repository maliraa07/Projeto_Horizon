import type { PaymentMethod, TransactionSource } from '../types/finance'
import { PAYMENT_LABELS, SOURCE_LABELS } from '../types/finance'

export function formatBRL(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatBRLDetailed(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function exportTransactionsCsv(
  rows: Array<{
    date: string
    amount: number
    description: string
    category: string
    method: PaymentMethod
    source: TransactionSource
    creditoParcelado?: string
    creditoParcelas?: string
    creditoValorParcela?: string
  }>,
) {
  const header = [
    'data',
    'valor',
    'descricao',
    'categoria',
    'forma_pagamento',
    'origem',
    'credito_parcelado',
    'credito_parcelas',
    'credito_valor_parcela',
  ]
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`
  const lines = [
    header.join(';'),
    ...rows.map((r) =>
      [
        r.date,
        r.amount.toFixed(2).replace('.', ','),
        esc(r.description),
        esc(r.category),
        esc(PAYMENT_LABELS[r.method]),
        esc(SOURCE_LABELS[r.source]),
        esc(r.creditoParcelado ?? ''),
        esc(r.creditoParcelas ?? ''),
        esc(r.creditoValorParcela ?? ''),
      ].join(';'),
    ),
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `gastos-export-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
