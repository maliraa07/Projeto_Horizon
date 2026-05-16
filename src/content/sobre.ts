/**
 * Textos da página Sobre — personalize aqui (nome, links, bio e descrição do projeto).
 */
export const sobreConteudo = {
  /** Nome que aparece na seção “Sobre mim” (o nome do cabeçalho pode vir das Configurações). */
  nomePreferido: 'Marrys',
  tituloCargo: 'Desenvolvedora Full Stack',
  /** Parágrafos curtos sobre você — edite à vontade. */
  sobreMim: [
    'Sou apaixonada por tecnologia, boas experiências de uso e código que conte uma história clara. Gosto de aprender em público e de transformar ideias em produtos que as pessoas consigam usar no dia a dia.',
    'Este projeto faz parte do meu portfólio no GitHub: nele experimento uma stack moderna, organização de pastas e um problema real que me importa — o controle financeiro pessoal.',
  ],
  /** Blocos sobre o app Horizon. */
  sobreProjeto: {
    titulo: 'O que é o Horizon?',
    paragrafos: [
      'O **Horizon** é um painel web para **controlar gastos**: você registra lançamentos na mão, organiza por **categorias**, acompanha **totais e gráficos** por mês e pode **importar extratos em CSV** do seu banco, com regras para valores positivos/negativos e detecção de duplicatas.',
      'Tudo roda no **navegador**, com dados guardados em **localStorage** — ideal para estudo, portfólio e uso pessoal sem depender de um backend. A identidade visual usa **verde e tons “dinheiro”** para passar confiança e clareza.',
    ],
  },
  /** Links opcionais (deixe string vazia para ocultar o botão). */
  links: {
    github: '',
    linkedin: '',
    portfolio: '',
  },
} as const
