/**
 * Versão da política — ao alterar textos jurídicos relevantes, incremente para solicitar novo aceite.
 */
export const LGPD_POLICY_VERSION = '2026-05-1'

export const lgpdPoliticaMeta = {
  titulo: 'Política de Privacidade e Proteção de Dados (LGPD)',
  subtitulo:
    'Horizon — ambiente de demonstração. Texto informativo; ajuste com assessoria jurídica antes de uso comercial.',
  atualizacao: 'Maio de 2026',
} as const

export const lgpdSecoes: { id: string; titulo: string; paragrafos: string[] }[] = [
  {
    id: 'controladora',
    titulo: '1. Quem é responsável pelos dados (controladora)',
    paragrafos: [
      'Nesta versão de **demonstração**, o Horizon funciona **inteiramente no seu navegador**. Não há servidor da aplicação recebendo ou armazenando seus dados em nuvem: a controladora do tratamento, na prática, é **você** ao usar o app no seu dispositivo, e os dados ficam sob sua posse no **armazenamento local (localStorage)** do navegador.',
      'Para um produto comercial, a empresa ou profissional que oferece o serviço deve ser identificado como controladora, com CNPJ/CPF, canal de contato e eventual Encarregado de Dados (DPO), conforme o art. 41 da LGPD.',
    ],
  },
  {
    id: 'dados',
    titulo: '2. Quais dados são tratados',
    paragrafos: [
      'Podem ser armazenados localmente, conforme você preencher: **nome**, **e-mail**, **telefone**, **cargo**, **empresa/contexto**, **objetivo de uso**, **preferências** e **dados financeiros** (lançamentos, categorias, importações de extrato).',
      '**Senha:** nesta demonstração a senha **não é armazenada** de forma persistente; serve apenas para simular o fluxo de acesso na mesma sessão de uso que você configurar.',
    ],
  },
  {
    id: 'finalidades',
    titulo: '3. Finalidades e bases legais (LGPD)',
    paragrafos: [
      'Os dados são tratados para **permitir o uso do painel** (controle de gastos, categorias, relatórios e exportações), com base no **consentimento** do titular (art. 7º, I) quando você marca as opções de aceite no cadastro, e no **legítimo interesse** de melhoria da experiência local, quando aplicável (art. 7º, IX), sempre respeitando seus direitos.',
      'Não vendemos seus dados. Não há perfilização comercial nesta demo.',
    ],
  },
  {
    id: 'direitos',
    titulo: '4. Direitos do titular (arts. 18 e 19 da LGPD)',
    paragrafos: [
      'Você pode **confirmar a existência** de tratamento, **acessar** e **corrigir** dados nas telas de **Configurações** e **Lançamentos**, e **eliminar** os dados apagando o armazenamento do site no navegador ou usando as funções de exclusão dentro do app, quando existirem.',
      'O **revogamento do consentimento** pode ser feito ao encerrar o uso e apagar os dados locais; em ambiente comercial, deve haver canal objetivo para solicitações.',
    ],
  },
  {
    id: 'seguranca',
    titulo: '5. Segurança e retenção',
    paragrafos: [
      'Os dados permanecem no **seu dispositivo** até você apagá-los ou limpar o site. **Faça backup** se precisar guardar histórico: a demonstração não oferece recuperação na nuvem.',
      'Use dispositivo e navegador atualizados e evite extensões desconhecidas que possam ler páginas.',
    ],
  },
  {
    id: 'contato',
    titulo: '6. Contato e encarregado',
    paragrafos: [
      'Em ambiente de portfólio, utilize o canal indicado na página **Sobre** do projeto para dúvidas sobre privacidade. Em produção, informe e-mail institucional e, se obrigatório, o **Encarregado (DPO)**.',
    ],
  },
]
