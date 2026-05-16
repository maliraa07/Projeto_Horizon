import { format } from 'date-fns'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UsageGoal } from '../constants/userProfile'

function financeMonthDefault(): string {
  return format(new Date(), 'yyyy-MM')
}

type SettingsState = {
  /** Mês yyyy-MM sincronizado em Painel + Lançamentos (e ajustado ao salvar/importar). */
  financeReferenceMonthYm: string
  displayName: string
  workEmail: string
  phone: string
  jobTitle: string
  organization: string
  usageGoal: UsageGoal
  /** ISO — preenchido no primeiro cadastro / login com perfil completo */
  memberSince: string
  /** Versão da política de privacidade aceita pelo titular (LGPD). */
  lgpdPolicyVersionAccepted: string
  /** ISO do último registro de consentimento / reafirmação. */
  lgpdConsentAt: string
  notifyEmail: boolean
  notifyWeeklyDigest: boolean
  setSettings: (patch: SettingsPatch) => void
}

export type SettingsPatch = Partial<
  Pick<
    SettingsState,
    | 'financeReferenceMonthYm'
    | 'displayName'
    | 'workEmail'
    | 'phone'
    | 'jobTitle'
    | 'organization'
    | 'usageGoal'
    | 'memberSince'
    | 'lgpdPolicyVersionAccepted'
    | 'lgpdConsentAt'
    | 'notifyEmail'
    | 'notifyWeeklyDigest'
  >
>

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      financeReferenceMonthYm: financeMonthDefault(),
      displayName: 'Mariana Silva',
      workEmail: 'mariana@empresa.com',
      phone: '',
      jobTitle: '',
      organization: '',
      usageGoal: 'pessoal',
      memberSince: '',
      lgpdPolicyVersionAccepted: '',
      lgpdConsentAt: '',
      notifyEmail: true,
      notifyWeeklyDigest: false,
      setSettings: (patch) => set((s) => ({ ...s, ...patch })),
    }),
    {
      name: 'horizon-settings',
      merge: (persisted, current) => ({
        ...current,
        ...(typeof persisted === 'object' && persisted !== null ? (persisted as object) : {}),
      }) as SettingsState,
    },
  ),
)
