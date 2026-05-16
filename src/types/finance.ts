export type PaymentMethod =
  | 'debito'
  | 'credito'
  | 'pix'
  | 'dinheiro'
  | 'transferencia'
  | 'outro'

export type TransactionSource = 'manual' | 'import_csv'

/** Extrato/importação: entrada (crédito) vs saída (despesa). Ausência = despesa (compatível com dados antigos). */
export type CashFlowKind = 'expense' | 'income'

/** Detalhes de compra parcelada no cartão (só quando `method === 'credito'`). */
export type CreditInstallmentInfo = {
  isInstallment: boolean
  /** Quantidade de parcelas (≥ 2 quando parcelado). */
  installments: number
  /** Valor de cada parcela (mensal), alinhado ao `amount` do lançamento. */
  monthlyAmount: number
}

export interface ExpenseCategory {
  id: string
  name: string
  color: string
  /** Orçamento mensal opcional (0 = sem limite definido) */
  monthlyBudget: number
}

export interface Transaction {
  id: string
  date: string
  /** Valor sempre positivo; sentido pela `cashFlowKind` (entrada vs saída). */
  amount: number
  description: string
  categoryId: string
  method: PaymentMethod
  source: TransactionSource
  importBatchId?: string
  /** Entradas de extratos (valor positivo no CSV típico de conta corrente). Omitido ou `expense` = gasto. */
  cashFlowKind?: CashFlowKind
  /** Preenchido em gastos manuais no crédito parcelado. */
  creditInstallment?: CreditInstallmentInfo
}

export function isExpenseTransaction(t: Pick<Transaction, 'cashFlowKind'>): boolean {
  return t.cashFlowKind !== 'income'
}

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  debito: 'Débito',
  credito: 'Crédito',
  pix: 'Pix',
  dinheiro: 'Dinheiro',
  transferencia: 'Transferência',
  outro: 'Outro',
}

export const SOURCE_LABELS: Record<TransactionSource, string> = {
  manual: 'Cadastro manual',
  import_csv: 'Importação (CSV)',
}
