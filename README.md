# Projeto_HorizonSaas — Controle de gastos (Horizon)

App para **registrar gastos manualmente** e **importar extratos em CSV** do seu banco, com **categorias**, **dashboard** (totais, pizza por tipo, orçamento vs gasto), **comparativo entre meses** e **exportação CSV** — tudo com dados **persistidos no navegador** (`localStorage`), sem backend.

## Acesso online

**Demo publicada:** [https://maliraa07.github.io/Projeto_Horizon/](https://maliraa07.github.io/Projeto_Horizon/)

No login use **qualquer e-mail e senha** — é apenas uma simulação local no navegador.

Repositório: [github.com/maliraa07/Projeto_Horizon](https://github.com/maliraa07/Projeto_Horizon)

## Stack

- React 19 + TypeScript + Vite 8  
- Tailwind CSS v4 (`@tailwindcss/vite`)  
- React Router, Zustand (persistência local), Framer Motion, Recharts, `date-fns`, Papa Parse (CSV), Lucide  

## Como rodar

```bash
cd Projeto_HorizonSaas
npm install
npm run dev
```

Abra o endereço exibido no terminal (por padrão `http://localhost:5173`).

## Importar extrato

1. No banco, exporte o movimento em **CSV** (UTF-8; em geral separador `;` no Brasil).  
2. Em **Lançamentos → Importar extrato**, envie o arquivo.  
3. Associe as colunas de **data**, **valor** e (opcional) **descrição**.  
4. Escolha a regra de valor típica de **fatura de cartão** (só negativos) ou **débito** (só positivos), ou importe pelo **valor absoluto**.  
5. Opcional: marque **pular duplicatas** para evitar repetir o mesmo lançamento.

Formatos de data aceitos na importação incluem `dd/MM/yyyy`, `dd/MM/yy` e `yyyy-MM-dd`.

## Scripts

- `npm run dev` — desenvolvimento  
- `npm run build` — build de produção  
- `npm run preview` — pré-visualização do build  

## Deploy (GitHub Pages)

Publicação em [https://maliraa07.github.io/Projeto_Horizon/](https://maliraa07.github.io/Projeto_Horizon/)

Configuração no GitHub (**Settings → Pages**):

- **Source:** Deploy from a branch  
- **Branch:** `main`  
- **Folder:** `/docs`

A cada push na `main`, o workflow `.github/workflows/deploy-pages.yml` gera o build e atualiza a pasta `docs/`.

## Observações

- Não há servidor: **não envie dados sensíveis** esperando criptografia em trânsito além do HTTPS do host.  
- Para backup, use **Análises → Baixar CSV** ou exporte o extrato original do banco.
