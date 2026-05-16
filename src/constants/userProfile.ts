export const USAGE_GOALS = ['pessoal', 'familia', 'freelancer', 'pequeno_negocio', 'estudos'] as const

export type UsageGoal = (typeof USAGE_GOALS)[number]

export const USAGE_GOAL_LABELS: Record<UsageGoal, string> = {
  pessoal: 'Finanças pessoais',
  familia: 'Orçamento familiar',
  freelancer: 'Autônomo / MEI',
  pequeno_negocio: 'Pequeno negócio',
  estudos: 'Testes e estudos',
}

export function formatMemberSincePt(iso: string): string {
  if (!iso.trim()) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(d)
}
