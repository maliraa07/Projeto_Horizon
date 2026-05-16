import { Link } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { USAGE_GOAL_LABELS, USAGE_GOALS, formatMemberSincePt, type UsageGoal } from '../constants/userProfile'
import { LGPD_POLICY_VERSION } from '../content/lgpd'
import { useSettingsStore } from '../store/settingsStore'

export function ConfiguracoesPage() {
  const displayName = useSettingsStore((s) => s.displayName)
  const workEmail = useSettingsStore((s) => s.workEmail)
  const phone = useSettingsStore((s) => s.phone)
  const jobTitle = useSettingsStore((s) => s.jobTitle)
  const organization = useSettingsStore((s) => s.organization)
  const usageGoal = useSettingsStore((s) => s.usageGoal)
  const memberSince = useSettingsStore((s) => s.memberSince)
  const lgpdPolicyVersionAccepted = useSettingsStore((s) => s.lgpdPolicyVersionAccepted)
  const lgpdConsentAt = useSettingsStore((s) => s.lgpdConsentAt)
  const notifyEmail = useSettingsStore((s) => s.notifyEmail)
  const notifyWeeklyDigest = useSettingsStore((s) => s.notifyWeeklyDigest)
  const setSettings = useSettingsStore((s) => s.setSettings)

  const sinceLabel = formatMemberSincePt(memberSince)
  const lgpdConsentLabel = formatMemberSincePt(lgpdConsentAt)

  return (
    <div className="mx-auto max-w-4xl space-y-8 lg:space-y-10">
      <Card>
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">Perfil</h2>
        <p className="mt-1 text-[0.9375rem] leading-relaxed text-slate-600">
          Dados usados no menu lateral e no fluxo de entrada. Tudo permanece apenas neste
          navegador.
        </p>
        {sinceLabel ? (
          <p className="mt-3 inline-flex rounded-lg border border-emerald-100 bg-emerald-50/80 px-3 py-1.5 text-sm font-medium text-emerald-900">
            Membro desde {sinceLabel}
          </p>
        ) : (
          <p className="mt-3 text-sm text-amber-800">
            Ainda sem data de cadastro: ela é definida quando você salva o perfil na tela de acesso.
          </p>
        )}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Input
            label="Nome completo"
            value={displayName}
            onChange={(e) => setSettings({ displayName: e.target.value })}
          />
          <Input
            label="E-mail"
            type="email"
            value={workEmail}
            onChange={(e) => setSettings({ workEmail: e.target.value })}
          />
          <Input
            label="Telefone / WhatsApp"
            type="tel"
            value={phone}
            onChange={(e) => setSettings({ phone: e.target.value })}
            hint="Opcional."
          />
          <Input
            label="Cargo ou função"
            value={jobTitle}
            onChange={(e) => setSettings({ jobTitle: e.target.value })}
          />
          <Input
            className="sm:col-span-2"
            label="Empresa, projeto ou contexto"
            value={organization}
            onChange={(e) => setSettings({ organization: e.target.value })}
          />
          <label className="flex flex-col gap-2 text-left text-[0.9375rem] font-semibold text-slate-700 sm:col-span-2">
            <span>Objetivo principal</span>
            <select
              value={usageGoal}
              onChange={(e) => setSettings({ usageGoal: e.target.value as UsageGoal })}
              className="min-h-[2.75rem] rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[0.9375rem] font-normal text-slate-900 shadow-sm outline-none transition focus:border-horizon-500 focus:ring-[3px] focus:ring-horizon-200/80"
            >
              {USAGE_GOALS.map((key) => (
                <option key={key} value={key}>
                  {USAGE_GOAL_LABELS[key]}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">Privacidade e LGPD</h2>
        <p className="mt-1 text-[0.9375rem] leading-relaxed text-slate-600">
          Registro do consentimento e da versão da política aceita neste aparelho.
        </p>
        <div className="mt-4 space-y-2 text-sm text-slate-700">
          <p>
            <span className="font-semibold text-slate-900">Versão da política aceita:</span>{' '}
            {lgpdPolicyVersionAccepted || '—'}{' '}
            {lgpdPolicyVersionAccepted === LGPD_POLICY_VERSION ? (
              <span className="text-emerald-700">(atual)</span>
            ) : lgpdPolicyVersionAccepted ? (
              <span className="text-amber-700">(há nova versão — aceite novamente no login)</span>
            ) : null}
          </p>
          <p>
            <span className="font-semibold text-slate-900">Último registro de consentimento:</span>{' '}
            {lgpdConsentLabel || '—'}
          </p>
        </div>
        <p className="mt-4 text-sm">
          <Link
            to="/privacidade"
            className="font-semibold text-emerald-700 underline decoration-emerald-200 underline-offset-2 hover:text-emerald-800"
          >
            Ler a Política de Privacidade completa
          </Link>
        </p>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">Preferências</h2>
        <p className="mt-1 text-[0.9375rem] leading-relaxed text-slate-600">
          Opções pensadas para uma futura versão com conta na nuvem; hoje não enviam e-mail.
        </p>
        <div className="mt-6 space-y-4">
          <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm font-medium text-slate-800">
            <span>Notificações por e-mail</span>
            <input
              type="checkbox"
              className="h-4 w-4 accent-horizon-600"
              checked={notifyEmail}
              onChange={(e) => setSettings({ notifyEmail: e.target.checked })}
            />
          </label>
          <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm font-medium text-slate-800">
            <span>Resumo semanal consolidado</span>
            <input
              type="checkbox"
              className="h-4 w-4 accent-horizon-600"
              checked={notifyWeeklyDigest}
              onChange={(e) => setSettings({ notifyWeeklyDigest: e.target.checked })}
            />
          </label>
        </div>
      </Card>
    </div>
  )
}
