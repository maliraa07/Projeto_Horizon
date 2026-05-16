import type { ExpenseCategory, Transaction } from '../types/finance'

const RECEITA_KEYWORDS: { categoryId: string; keywords: string[] }[] = [
  {
    categoryId: 'cat-receitas',
    keywords: [
      'salario',
      'salário',
      'folha pagamento',
      'pagamento empresa',
      'credit salario',
      'transferencia recebida',
      'transferência recebida',
      'pix recebido',
      'pix creditado',
      'ted recebid',
      'doc recebid',
      'deposito ted',
      'depósito',
      'antecipação',
      'antecipacao',
      'beneficio previdenciario',
      'benefício',
      'seguro desemprego',
      'fgts',
      'rescisor',
      '13 salario',
      '13º',
      'reembolso',
      'estorno credito',
      'cashback creditado',
      'rendimento',
      'dividendo',
      'aluguel recebido',
    ],
  },
]

/** Palavras-chave por id de categoria padrão (ordem: regras mais específicas primeiro no array por categoria). */
const KEYWORD_RULES: { categoryId: string; keywords: string[] }[] = [
  {
    categoryId: 'cat-assinaturas',
    keywords: [
      'netflix',
      'spotify',
      'amazon prime',
      'prime video',
      'disney',
      'disney+',
      'hbo',
      'max.com',
      'apple.com',
      'icloud',
      'google storage',
      'google one',
      'youtube premium',
      'deezer',
      'paramount',
      'crunchyroll',
      'microsoft 365',
      'office 365',
      'adobe',
      'assinatura',
      'mensalidade app',
      'playstation plus',
      'xbox game',
      'nubank ultravioleta',
      'amazon music',
    ],
  },
  {
    categoryId: 'cat-saude',
    keywords: [
      'farmacia',
      'drogaria',
      'droga raia',
      'drogasil',
      'pacheco',
      'pague menos',
      'hospital',
      'clinica',
      'laboratorio',
      'laboratório',
      'unimed',
      'amil',
      'bradesco saude',
      'sulamerica',
      'odont',
      'dentista',
      'psicolog',
      'fisioterap',
    ],
  },
  {
    categoryId: 'cat-transporte',
    keywords: [
      'uber',
      '99app',
      '99 pop',
      '99pay',
      'cabify',
      'indriver',
      'posto',
      'ipiranga',
      'shell',
      'br distribuidora',
      'combustivel',
      'combustível',
      'estacionamento',
      'estapar',
      'sem parar',
      'veloe',
      'conectcar',
      'metro',
      'metrô',
      'cptm',
      'onibus',
      'ônibus',
      'taxi',
      'táxi',
      'mobilidade',
      'bike itau',
      'tem bici',
    ],
  },
  {
    categoryId: 'cat-alimentacao',
    keywords: [
      'ifood',
      'rappi',
      'aiqfome',
      'ze delivery',
      'mercado',
      'supermercado',
      'mercadolivre',
      'carrefour',
      'extra hiper',
      'pao de acucar',
      'pão de açúcar',
      'assai',
      'atacadao',
      'atacadão',
      'savegnago',
      'dia supermercado',
      'padaria',
      'restaurante',
      'lanchonete',
      'burger',
      'pizzaria',
      'mc donald',
      'mcdonald',
      'starbucks',
      'cafe ',
      'café',
      'açougue',
      'acougue',
      'hortifruti',
      'feira',
      'bar do',
      'boteco',
    ],
  },
  {
    categoryId: 'cat-moradia',
    keywords: [
      'aluguel',
      'condominio',
      'condomínio',
      'iptu',
      'imobiliaria',
      'imobiliária',
      'energia',
      'eletropaulo',
      'enel',
      'cpfl',
      'cemig',
      'copel',
      'light',
      'equatorial',
      'sabesp',
      'copasa',
      'sanepar',
      'agua e esgoto',
      'água',
      'gas natural',
      'gás',
      'claro net',
      'vivo fibra',
      'oi fibra',
      'tim live',
    ],
  },
  {
    categoryId: 'cat-lazer',
    keywords: [
      'cinema',
      'ingresso',
      'ticketmaster',
      'eventim',
      'steam',
      'playstation',
      'xbox',
      'nintendo',
      'epic games',
      'riot games',
      'hotel',
      'booking.com',
      'airbnb',
      'decolar',
      'latam',
      'gol linhas',
      'azul linhas',
      'viagem',
      'parque',
      'museu',
      'show ',
      'teatro',
      'bar ',
      'pub ',
      'balada',
    ],
  },
  {
    categoryId: 'cat-educacao',
    keywords: [
      'udemy',
      'alura',
      'coursera',
      'faculdade',
      'universidade',
      'escola',
      'curso',
      'livraria',
      'saraiva',
      'cultura inglesa',
      'wizard',
      'ccaa',
      'workana',
      'coworking',
      'linkedin premium',
    ],
  },
]

function normalizeForMatch(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function resolveCategoryId(
  preferredId: string,
  categories: ExpenseCategory[],
): string | null {
  if (categories.some((c) => c.id === preferredId)) return preferredId
  return null
}

function outrosId(categories: ExpenseCategory[], fallback: string): string {
  return (
    categories.find((c) => c.id === 'cat-outros')?.id ??
    categories.find((c) => /outros/i.test(c.name))?.id ??
    fallback
  )
}

/** Aprende descrições exatas já categorizadas pelo usuário. */
function buildHistoryMap(transactions: Transaction[]): Map<string, string> {
  const counts = new Map<string, Map<string, number>>()

  for (const t of transactions) {
    const key = normalizeForMatch(t.description)
    if (!key || key.length < 3) continue
    let byCat = counts.get(key)
    if (!byCat) {
      byCat = new Map()
      counts.set(key, byCat)
    }
    byCat.set(t.categoryId, (byCat.get(t.categoryId) ?? 0) + 1)
  }

  const result = new Map<string, string>()
  for (const [desc, byCat] of counts) {
    let bestId = ''
    let bestN = 0
    for (const [catId, n] of byCat) {
      if (n > bestN) {
        bestN = n
        bestId = catId
      }
    }
    if (bestId && bestN >= 1) result.set(desc, bestId)
  }
  return result
}

export type CategoryGuessSource = 'history' | 'keyword' | 'fallback'

export type CategoryGuess = {
  categoryId: string
  source: CategoryGuessSource
}

export type CategoryGuessOptions = {
  /** Fluxo previsto pela linha do extrato. */
  transactionKind?: 'expense' | 'income'
  /** Fallback para categorias de entrada quando não houver correspondência. */
  incomeFallbackId?: string
}

/**
 * Sugere categoria pela descrição do extrato.
 * 1) Histórico (mesma descrição já lançada antes)
 * 2) Palavras-chave por tipo de gasto ou receita
 * 3) Categoria padrão / Outros
 */
export function guessCategoryId(
  description: string,
  categories: ExpenseCategory[],
  fallbackCategoryId: string,
  historyTransactions: Transaction[] = [],
  options?: CategoryGuessOptions,
): CategoryGuess {
  const fallback =
    resolveCategoryId(fallbackCategoryId, categories) ??
    categories[0]?.id ??
    outrosId(categories, '')

  if (!categories.length || !fallback) {
    return { categoryId: fallbackCategoryId, source: 'fallback' }
  }

  const normalized = normalizeForMatch(description)
  if (!normalized) {
    return { categoryId: fallback, source: 'fallback' }
  }

  const txKind = options?.transactionKind ?? 'expense'
  const incomeFallback =
    resolveCategoryId(options?.incomeFallbackId ?? 'cat-receitas', categories) ?? outrosId(categories, fallback)

  const history = buildHistoryMap(historyTransactions)
  const fromHistory = history.get(normalized)
  if (fromHistory && resolveCategoryId(fromHistory, categories)) {
    return { categoryId: fromHistory, source: 'history' }
  }

  if (txKind === 'income') {
    let bestKeywordId: string | null = null
    let bestKeywordLen = 0
    for (const rule of RECEITA_KEYWORDS) {
      const catId = resolveCategoryId(rule.categoryId, categories)
      if (!catId) continue
      for (const kw of rule.keywords) {
        const nkw = normalizeForMatch(kw)
        if (!nkw) continue
        if (normalized.includes(nkw) && nkw.length > bestKeywordLen) {
          bestKeywordLen = nkw.length
          bestKeywordId = catId
        }
      }
    }
    if (bestKeywordId) {
      return { categoryId: bestKeywordId, source: 'keyword' }
    }
    return { categoryId: incomeFallback, source: 'fallback' }
  }

  let bestKeywordId: string | null = null
  let bestKeywordLen = 0

  for (const rule of KEYWORD_RULES) {
    const catId = resolveCategoryId(rule.categoryId, categories)
    if (!catId) continue

    for (const kw of rule.keywords) {
      const nkw = normalizeForMatch(kw)
      if (!nkw) continue
      if (normalized.includes(nkw) && nkw.length > bestKeywordLen) {
        bestKeywordLen = nkw.length
        bestKeywordId = catId
      }
    }
  }

  if (bestKeywordId) {
    return { categoryId: bestKeywordId, source: 'keyword' }
  }

  /** Nome da categoria customizada aparecendo na descrição (ex.: categoria "Pet"). */
  for (const cat of categories) {
    const nameKey = normalizeForMatch(cat.name)
    if (nameKey.length >= 4 && normalized.includes(nameKey)) {
      return { categoryId: cat.id, source: 'keyword' }
    }
  }

  return { categoryId: fallback, source: 'fallback' }
}

export function categoryNameById(
  categories: ExpenseCategory[],
  categoryId: string,
): string {
  return categories.find((c) => c.id === categoryId)?.name ?? '—'
}
