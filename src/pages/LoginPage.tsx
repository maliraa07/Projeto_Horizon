import { type FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { LGPD_POLICY_VERSION } from '../content/lgpd'
import { useAuthStore } from '../store/authStore'
import { useSettingsStore } from '../store/settingsStore'
import { cn } from '../utils/cn'
import { USAGE_GOAL_LABELS, USAGE_GOALS, type UsageGoal } from '../constants/userProfile'

type Tab = 'login' | 'register'

export function LoginPage() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const login = useAuthStore((s) => s.login)
  const setSettings = useSettingsStore((s) => s.setSettings)
  const alreadyAcceptedLgpd = useSettingsStore((s) => s.lgpdPolicyVersionAccepted === LGPD_POLICY_VERSION)

  const persistDisplayName = useSettingsStore((s) => s.displayName)
  const persistWorkEmail = useSettingsStore((s) => s.workEmail)
  const persistPhone = useSettingsStore((s) => s.phone)
  const persistJobTitle = useSettingsStore((s) => s.jobTitle)
  const persistOrganization = useSettingsStore((s) => s.organization)
  const persistUsageGoal = useSettingsStore((s) => s.usageGoal)

  const [tab, setTab] = useState<Tab>('login')

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginLgpd, setLoginLgpd] = useState(false)

  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regPasswordConfirm, setRegPasswordConfirm] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [organization, setOrganization] = useState('')
  const [usageGoal, setUsageGoal] = useState<UsageGoal>('pessoal')
  const [acceptPrivacyDoc, setAcceptPrivacyDoc] = useState(false)
  const [consentTreatment, setConsentTreatment] = useState(false)

  const [registerError, setRegisterError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

  useEffect(() => {
    setLoginLgpd(alreadyAcceptedLgpd)
  }, [alreadyAcceptedLgpd])

  useEffect(() => {
    setLoginEmail(persistWorkEmail)
  }, [persistWorkEmail])

  useEffect(() => {
    setFullName(persistDisplayName)
    setRegEmail(persistWorkEmail)
    setPhone(persistPhone)
    setJobTitle(persistJobTitle)
    setOrganization(persistOrganization)
    setUsageGoal(
      USAGE_GOALS.includes(persistUsageGoal as UsageGoal) ? (persistUsageGoal as UsageGoal) : 'pessoal',
    )
  }, [
    persistDisplayName,
    persistWorkEmail,
    persistPhone,
    persistJobTitle,
    persistOrganization,
    persistUsageGoal,
  ])

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const mail = loginEmail.trim()
    if (!mail || !loginPassword || !loginLgpd) return
    const now = new Date().toISOString()
    setSettings({
      lgpdPolicyVersionAccepted: LGPD_POLICY_VERSION,
      lgpdConsentAt: now,
    })
    login()
    navigate('/dashboard', { replace: true })
  }

  const loginSubmitDisabled = !loginEmail.trim() || !loginPassword || !loginLgpd

  const handleRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setRegisterError(null)
    const name = fullName.trim()
    const mail = regEmail.trim()
    if (!name || !mail) {
      setRegisterError('Preencha nome completo e e-mail.')
      return
    }
    if (regPassword.length < 4) {
      setRegisterError('Defina uma senha com pelo menos 4 caracteres (demonstração).')
      return
    }
    if (regPassword !== regPasswordConfirm) {
      setRegisterError('As senhas não coincidem. Confirme novamente.')
      return
    }
    if (!acceptPrivacyDoc || !consentTreatment) {
      setRegisterError('É necessário aceitar a Política de Privacidade e o tratamento de dados (LGPD).')
      return
    }

    const memberSince = useSettingsStore.getState().memberSince || new Date().toISOString()
    const goal = USAGE_GOALS.includes(usageGoal) ? usageGoal : 'pessoal'
    const now = new Date().toISOString()
    setSettings({
      displayName: name,
      workEmail: mail,
      phone: phone.trim(),
      jobTitle: jobTitle.trim(),
      organization: organization.trim(),
      usageGoal: goal,
      memberSince,
      lgpdPolicyVersionAccepted: LGPD_POLICY_VERSION,
      lgpdConsentAt: now,
    })
    login()
    navigate('/dashboard', { replace: true })
  }

  const tabBtn =
    'relative min-h-[2.75rem] flex-1 rounded-lg px-3 py-2.5 text-xs font-semibold transition sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500'

  const checkboxLabelClass =
    'flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-3 text-sm leading-snug text-slate-800'

  return (
    <div
      className={cn(
        'w-full min-w-0 rounded-2xl border border-slate-200/90 bg-white shadow-xl shadow-slate-900/[0.08]',
        'ring-1 ring-slate-900/[0.02]',
        'p-4 sm:p-6 md:p-8',
      )}
    >
      <div className="mb-5 border-b border-slate-100 pb-5 sm:mb-6 sm:pb-6">
        <h1 className="text-xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-2xl">
          Acesso ao Horizon
        </h1>
        <p className="mt-2 text-[0.8125rem] leading-relaxed text-slate-500 sm:text-sm">
          Demonstração local: escolha <strong className="font-medium text-slate-700">Entrar</strong> se já
          tiver perfil neste navegador, ou <strong className="font-medium text-slate-700">Criar conta</strong>{' '}
          para cadastrar seus dados e aceitar a LGPD.
        </p>

        <div
          className="mt-5 flex gap-1 rounded-xl bg-slate-100/90 p-1 ring-1 ring-slate-200/80 sm:mt-6"
          role="tablist"
          aria-label="Tipo de acesso"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'login'}
            className={cn(
              tabBtn,
              tab === 'login'
                ? 'bg-white text-emerald-950 shadow-sm ring-1 ring-slate-200/90'
                : 'text-slate-600 hover:text-slate-900',
            )}
            onClick={() => {
              setTab('login')
              setRegisterError(null)
            }}
          >
            Entrar
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'register'}
            className={cn(
              tabBtn,
              tab === 'register'
                ? 'bg-white text-emerald-950 shadow-sm ring-1 ring-slate-200/90'
                : 'text-slate-600 hover:text-slate-900',
            )}
            onClick={() => {
              setTab('register')
              setRegisterError(null)
            }}
          >
            Criar conta
          </button>
        </div>
      </div>

      {tab === 'login' ? (
        <form className="space-y-5" onSubmit={handleLogin} noValidate>
          <Input
            label="E-mail"
            type="email"
            name="loginEmail"
            autoComplete="username"
            inputMode="email"
            required
            placeholder="nome@exemplo.com"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
          <Input
            label="Senha"
            type="password"
            name="loginPassword"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            hint="Demonstração: não armazenamos senha no disco; use a mesma combinação que preferir ao testar."
          />

          <label className={checkboxLabelClass}>
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 shrink-0 accent-horizon-600"
              checked={loginLgpd}
              onChange={(e) => setLoginLgpd(e.target.checked)}
              required
            />
            <span className="min-w-0 flex-1">
              Confirmo que li e estou ciente do tratamento dos meus dados conforme a{' '}
              <Link
                to="/privacidade"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-emerald-700 underline decoration-emerald-200 underline-offset-2 hover:text-emerald-800"
              >
                Política de Privacidade e bases da LGPD
              </Link>
              .
            </span>
          </label>

          <Button type="submit" className="w-full" disabled={loginSubmitDisabled}>
            Entrar
          </Button>

          <p className="text-center text-sm text-slate-600">
            Novo por aqui?{' '}
            <button
              type="button"
              className="font-semibold text-emerald-700 underline decoration-emerald-200 underline-offset-2 hover:text-emerald-800"
              onClick={() => setTab('register')}
            >
              Criar uma conta
            </button>
          </p>
        </form>
      ) : (
        <form className="space-y-5 sm:space-y-6" onSubmit={handleRegister} noValidate>
          {registerError ? (
            <div
              role="alert"
              className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900"
            >
              {registerError}
            </div>
          ) : null}

          <fieldset className="space-y-4 border-0 p-0">
            <legend className="mb-1 text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-emerald-800">
              Dados da conta
            </legend>
            <Input
              label="E-mail"
              type="email"
              name="regEmail"
              autoComplete="email"
              inputMode="email"
              required
              placeholder="nome@exemplo.com"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
            />
            <Input
              label="Senha"
              type="password"
              name="regPassword"
              autoComplete="new-password"
              required
              placeholder="Mínimo 4 caracteres (demo)"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
            />
            <Input
              label="Confirmar senha"
              type="password"
              name="regPasswordConfirm"
              autoComplete="new-password"
              required
              placeholder="Repita a senha"
              value={regPasswordConfirm}
              onChange={(e) => setRegPasswordConfirm(e.target.value)}
              hint="As duas senhas devem ser iguais."
            />
          </fieldset>

          <fieldset className="space-y-4 border-0 border-t border-slate-100 p-0 pt-4">
            <legend className="mb-1 text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-emerald-800">
              Perfil (aparece no menu lateral)
            </legend>
            <Input
              label="Nome completo"
              name="fullName"
              autoComplete="name"
              required
              placeholder="Como quer ser chamado(a) no app"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <Input
              label="Telefone / WhatsApp"
              type="tel"
              name="phone"
              autoComplete="tel"
              placeholder="(11) 99999-9999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              hint="Opcional."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Cargo ou função"
                name="jobTitle"
                autoComplete="organization-title"
                placeholder="Ex.: Analista, autônomo(a)"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
              <Input
                label="Empresa, projeto ou contexto"
                name="organization"
                autoComplete="organization"
                placeholder="Ex.: Uso pessoal, MEI"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              />
            </div>
            <label className="flex flex-col gap-2 text-left text-[0.9375rem] font-semibold text-slate-700">
              <span>Objetivo principal</span>
              <select
                name="usageGoal"
                value={usageGoal}
                onChange={(e) => setUsageGoal(e.target.value as UsageGoal)}
                className="min-h-[2.75rem] rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[0.9375rem] font-normal text-slate-900 shadow-sm outline-none transition focus:border-horizon-500 focus:ring-[3px] focus:ring-horizon-200/80"
              >
                {USAGE_GOALS.map((key) => (
                  <option key={key} value={key}>
                    {USAGE_GOAL_LABELS[key]}
                  </option>
                ))}
              </select>
            </label>
          </fieldset>

          <fieldset className="space-y-3 border-0 border-t border-slate-100 p-0 pt-4">
            <legend className="mb-1 text-[0.8125rem] font-bold uppercase tracking-[0.14em] text-emerald-800">
              LGPD — consentimento
            </legend>
            <label className={checkboxLabelClass}>
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 shrink-0 accent-horizon-600"
                checked={acceptPrivacyDoc}
                onChange={(e) => setAcceptPrivacyDoc(e.target.checked)}
              />
              <span className="min-w-0 flex-1">
                Li integralmente a{' '}
                <Link
                  to="/privacidade"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-emerald-700 underline decoration-emerald-200 underline-offset-2 hover:text-emerald-800"
                >
                  Política de Privacidade
                </Link>{' '}
                (versão {LGPD_POLICY_VERSION}) e estou ciente dos dados tratados, finalidades e dos meus
                direitos como titular.
              </span>
            </label>
            <label className={checkboxLabelClass}>
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 shrink-0 accent-horizon-600"
                checked={consentTreatment}
                onChange={(e) => setConsentTreatment(e.target.checked)}
              />
              <span className="min-w-0 flex-1">
                <strong className="font-semibold text-slate-900">Autorizo o tratamento</strong> dos meus
                dados pessoais informados neste formulário para as finalidades descritas na política,
                neste ambiente de demonstração, com armazenamento apenas no meu navegador (localStorage).
              </span>
            </label>
          </fieldset>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 px-4 py-3 text-xs leading-relaxed text-emerald-950/90">
            <strong className="font-semibold">LGPD:</strong> você pode revogar o uso apagando os dados do
            site no navegador ou editando/removendo informações em Configurações e Lançamentos. Esta versão
            não envia dados a servidores do Horizon.
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!acceptPrivacyDoc || !consentTreatment}
          >
            Criar conta e entrar
          </Button>

          <p className="text-center text-sm text-slate-600">
            Já tem cadastro?{' '}
            <button
              type="button"
              className="font-semibold text-emerald-700 underline decoration-emerald-200 underline-offset-2 hover:text-emerald-800"
              onClick={() => setTab('login')}
            >
              Voltar ao login
            </button>
          </p>
        </form>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-slate-100 pt-5 text-xs text-slate-500 sm:mt-8 sm:gap-x-6 sm:pt-6 sm:text-sm">
        <Link
          to="/privacidade"
          className="font-medium text-emerald-700 underline decoration-emerald-200 underline-offset-[5px] transition hover:text-emerald-800"
        >
          Privacidade e LGPD
        </Link>
        <Link
          to="/sobre"
          className="font-medium text-emerald-700 underline decoration-emerald-200 underline-offset-[5px] transition hover:text-emerald-800"
        >
          Sobre o projeto
        </Link>
      </div>
    </div>
  )
}
