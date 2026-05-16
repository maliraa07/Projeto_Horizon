<div align="center">

# Horizon

### Controle de gastos pessoal — simples, visual e no seu navegador

[![Demo ao vivo](https://img.shields.io/badge/🚀_Demo_ao_vivo-Abrir_Horizon-059669?style=for-the-badge&logo=githubpages&logoColor=white)](https://maliraa07.github.io/Projeto_Horizon/)
[![Repositório](https://img.shields.io/badge/GitHub-Projeto__Horizon-181717?style=for-the-badge&logo=github)](https://github.com/maliraa07/Projeto_Horizon)

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![GitHub Pages](https://img.shields.io/badge/Pages-Publicado-success?style=flat-square&logo=githubpages)](https://maliraa07.github.io/Projeto_Horizon/)

**[👉 Acesse agora: maliraa07.github.io/Projeto_Horizon](https://maliraa07.github.io/Projeto_Horizon/)**

*Login de demonstração: use **qualquer e-mail e senha** — os dados ficam só no seu navegador.*

</div>

---

## O que é?

O **Horizon** é um app de finanças pessoais para **registrar gastos**, **importar extratos CSV** do banco, organizar por **categorias** e acompanhar tudo em um **dashboard** com gráficos e comparativos entre meses.

Sem cadastro em servidor, sem backend: tudo roda no **navegador** com `localStorage` — ideal para portfólio, estudo e uso pessoal.

| | |
|:---:|:---:|
| 📊 **Dashboard** | Totais, pizza por categoria, orçamento vs gasto |
| 📥 **Importar CSV** | Extrato do banco com mapeamento de colunas |
| 🏷️ **Categorias** | Organize e edite seus tipos de gasto |
| 📈 **Análises** | Comparativo entre meses e exportação CSV |
| 🔒 **Privacidade** | Dados só no seu dispositivo |

---

## Destaques

- **Importação inteligente** — fatura (negativos), débito (positivos) ou valor absoluto; opção de pular duplicatas  
- **Visual “dinheiro”** — paleta verde, tipografia Fraunces + Outfit, animações com Framer Motion  
- **LGPD-friendly** — páginas de privacidade e sobre integradas ao fluxo  
- **100% front-end** — React 19, Zustand, Recharts, Papa Parse  

---

## Stack

| Camada | Tecnologias |
|--------|-------------|
| UI | React 19, TypeScript, Tailwind CSS v4, Framer Motion, Lucide |
| Dados | Zustand + persistência local |
| Gráficos & CSV | Recharts, Papa Parse, date-fns |
| Build | Vite 8, React Router 7 |

---

## Rodar localmente

```bash
git clone https://github.com/maliraa07/Projeto_Horizon.git
cd Projeto_Horizon
npm install
npm run dev
```

Abra `http://localhost:5173` e entre com qualquer e-mail/senha.

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Pré-visualizar o build |

---

## Importar extrato do banco

1. Exporte o movimento em **CSV** (UTF-8; no Brasil costuma ser `;`)  
2. **Lançamentos → Importar extrato** → envie o arquivo  
3. Mapeie **data**, **valor** e (opcional) **descrição**  
4. Escolha a regra: cartão, débito ou valor absoluto  
5. Opcional: **pular duplicatas**  

Datas aceitas: `dd/MM/yyyy`, `dd/MM/yy`, `yyyy-MM-dd`.

---

## Deploy (GitHub Pages)

| Configuração | Valor |
|--------------|--------|
| URL pública | [maliraa07.github.io/Projeto_Horizon](https://maliraa07.github.io/Projeto_Horizon/) |
| Source | Deploy from a branch |
| Branch | `main` |
| Folder | `/docs` |

O workflow [deploy-pages.yml](.github/workflows/deploy-pages.yml) atualiza a pasta `docs/` a cada push na `main`.

---

## Observações

> **Demonstração:** não há servidor próprio — evite dados sensíveis reais. Para backup, use **Análises → Baixar CSV** ou guarde o extrato original do banco.

---

<div align="center">

**Desenvolvido com foco em clareza financeira e experiência de uso.**

[⭐ Star no GitHub](https://github.com/maliraa07/Projeto_Horizon) · [🌐 Abrir demo](https://maliraa07.github.io/Projeto_Horizon/)

</div>
