import { format, isValid, parse } from 'date-fns'
import Papa from 'papaparse'

import type { CashFlowKind } from '../types/finance'

export function sniffDelimiter(sample: string): string {
  const first = sample.split(/\r?\n/)[0] ?? ''
  const semi = (first.match(/;/g) ?? []).length
  const comma = (first.match(/,/g) ?? []).length
  if (semi > comma) return ';'
  if (comma > 0) return ','
  return ';'
}

/** Remove linhas de cabeçalho do banco antes da linha com nomes das colunas. */
function stripCsvPreamble(csvText: string): string {
  const lines = csvText.split(/\r?\n/)
  for (let i = 0; i < Math.min(lines.length, 25); i++) {
    const line = lines[i]?.trim() ?? ''
    if (!line) continue
    const k = normalizeTextKey(line)
    const parts = line.split(/[;,]/).map((p) => p.trim().replace(/^"|"$/g, ''))
    const hasDate = /data|date|dt|movimento/.test(k) || parts.some((p) => /data|date/.test(normalizeTextKey(p)))
    const hasValue =
      /valor|amount|lancamento|debito|credito/.test(k) ||
      parts.some((p) => /valor|amount|lancamento/.test(normalizeTextKey(p)))
    if (hasDate && (hasValue || parts.length >= 3)) {
      return lines.slice(i).join('\n')
    }
  }
  return csvText
}

export function parseCsvObjects(csvText: string): {
  headers: string[]
  rows: Record<string, string>[]
} {
  const trimmed = stripCsvPreamble(csvText)
  const delimiter = sniffDelimiter(trimmed)
  const parsed = Papa.parse<Record<string, string>>(trimmed, {
    header: true,
    skipEmptyLines: 'greedy',
    delimiter,
    transformHeader: (h) => h.trim().replace(/^\uFEFF/, '').replace(/^"|"$/g, ''),
  })

  const headers = (parsed.meta.fields ?? []).filter(
    (h): h is string => Boolean(h && h.trim()),
  )
  const rows = parsed.data.filter((row) =>
    Object.values(row).some((v) => String(v ?? '').trim() !== ''),
  )
  return { headers, rows }
}

/** Interpreta valores monetários comuns em extratos BR (1.234,56, -45,90, (45,90)). */
export function parseAmountBr(raw: string): number | null {
  let s = raw
    .trim()
    .replace(/\u00a0/g, '')
    .replace(/R\$\s?/gi, '')
    .replace(/\s/g, '')
  if (!s) return null

  let negative = s.startsWith('-')
  if (s.startsWith('(') && s.endsWith(')')) {
    negative = true
    s = s.slice(1, -1)
  }

  const body = negative && s.startsWith('-') ? s.slice(1) : s

  let normalized = body
  if (body.includes(',') && body.includes('.')) {
    const lastComma = body.lastIndexOf(',')
    const lastDot = body.lastIndexOf('.')
    if (lastComma > lastDot) {
      normalized = body.replace(/\./g, '').replace(',', '.')
    } else {
      normalized = body.replace(/,/g, '')
    }
  } else if (body.includes(',')) {
    normalized = body.replace(/\./g, '').replace(',', '.')
  }

  const n = Number(normalized)
  if (!Number.isFinite(n)) return null
  return negative ? -Math.abs(n) : n
}

const DATE_FORMATS = [
  'dd/MM/yyyy',
  'dd/MM/yy',
  'yyyy-MM-dd',
  'dd-MM-yyyy',
  'dd.MM.yyyy',
  'dd/MM/yyyy HH:mm:ss',
  'dd/MM/yy HH:mm:ss',
]

export function parseBankDate(raw: string): string | null {
  const trimmed = raw.trim().split(' ')[0] ?? ''
  if (!trimmed) return null
  for (const fmt of DATE_FORMATS) {
    const d = parse(trimmed, fmt, new Date())
    if (isValid(d)) return format(d, 'yyyy-MM-dd')
  }
  return null
}

export function normalizeTextKey(s: string) {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

/** Sugere colunas comuns em exportações de banco (evita coluna Saldo como valor). */
export function guessColumns(headers: string[]) {
  let date: string | undefined
  let amount: string | undefined
  let description: string | undefined

  const amountCandidates: string[] = []
  const descCandidates: string[] = []

  for (const h of headers) {
    const k = normalizeTextKey(h)
    if (!date && /data|date|dt_mov|dtmov|dt_lanc|postado|vencimento|movimento/.test(k)) {
      date = h
    }
    if (/desc|historico|memo|titulo|estabelecimento|nome|detalhe|identificador|favorecido|lancamento/.test(k)) {
      descCandidates.push(h)
    }
    if (/valor|amount|value|debito|credito/.test(k) && !/saldo/.test(k)) {
      amountCandidates.push(h)
    }
    if (/lancamento|movimento/.test(k) && !amount) {
      amountCandidates.push(h)
    }
  }

  amount = amountCandidates[0]
  description =
    descCandidates.find((h) => /historico|descricao|desc|estabelecimento|titulo|detalhe/.test(normalizeTextKey(h))) ??
    descCandidates[0]

  if (!amount) {
    for (const h of headers) {
      const k = normalizeTextKey(h)
      if (/valor|lancamento/.test(k) && !/saldo/.test(k)) {
        amount = h
        break
      }
    }
  }

  return { date, amount, description }
}

/**
 * Extrato conta corrente misto (créditos e débitos no mesmo arquivo): valores &lt; 0 = gasto, &gt; 0 = entrada.
 * Extrato só com um sinal: trata todas as linhas como gasto (valor absoluto), cenário típico de fatura/export.
 */
export type ImportSignStrategy = 'mixed_debit_credit' | 'single_sign_expenses'

export function inferImportSignStrategy(
  rows: Record<string, string>[],
  dateCol: string,
  amountCol: string,
  sampleLimit = 80,
): ImportSignStrategy {
  let neg = 0
  let pos = 0
  for (const row of rows.slice(0, sampleLimit)) {
    const date = parseBankDate(String(row[dateCol] ?? ''))
    const parsed = parseAmountBr(String(row[amountCol] ?? ''))
    if (!date || parsed === null || parsed === 0) continue
    if (parsed < 0) neg++
    else pos++
  }
  if (neg > 0 && pos > 0) return 'mixed_debit_credit'
  return 'single_sign_expenses'
}

export type ParsedImportRow =
  | {
      ok: true
      date: string
      amount: number
      description: string
      parsedAmount: number
      cashFlowKind: CashFlowKind
    }
  | { ok: false; reason: string; description: string }

export function parseImportRow(
  row: Record<string, string>,
  opts: {
    dateCol: string
    amountCol: string
    descCol: string
    signStrategy: ImportSignStrategy
  },
): ParsedImportRow {
  const { dateCol, amountCol, descCol, signStrategy } = opts
  const rawDate = dateCol ? String(row[dateCol] ?? '') : ''
  const rawAmount = amountCol ? String(row[amountCol] ?? '') : ''
  const description = (descCol ? String(row[descCol] ?? '') : '').trim() || 'Sem descrição'

  if (!dateCol || !amountCol) {
    return { ok: false, reason: 'Defina colunas de data e valor.', description }
  }
  const date = parseBankDate(rawDate)
  const parsed = parseAmountBr(rawAmount)
  if (!date) return { ok: false, reason: 'Data inválida', description }
  if (parsed === null) return { ok: false, reason: 'Valor inválido', description }

  const amountMag = Math.abs(parsed)
  if (amountMag <= 0) return { ok: false, reason: 'Valor zerado', description }

  if (signStrategy === 'mixed_debit_credit') {
    const cashFlowKind: CashFlowKind = parsed < 0 ? 'expense' : 'income'
    return { ok: true, date, amount: amountMag, description, parsedAmount: parsed, cashFlowKind }
  }

  /** Apenas gastos — qualquer lado do sinal. */
  return {
    ok: true,
    date,
    amount: amountMag,
    description,
    parsedAmount: parsed,
    cashFlowKind: 'expense',
  }
}
