# Projeto_HorizonSaas — Controle de gastos (Horizon)

App para **registrar gastos manualmente** e **importar extratos em CSV** do seu banco, com **categorias**, **dashboard** (totais, pizza por tipo, orçamento vs gasto), **comparativo entre meses** e **exportação CSV** — tudo com dados **persistidos no navegador** (`localStorage`), sem backend.

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
No login use **qualquer e-mail e senha** — sessão local apenas para simular acesso ao painel.

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

## GitHub Pages

Site: **https://maliraa07.github.io/Projeto_Horizon/**

1. No GitHub: **Settings → Pages → Build and deployment**
2. **Source:** Deploy from a branch
3. **Branch:** `main` · **Folder:** `/docs` (não use `/ (root)`)
4. Salve e aguarde 1–2 minutos

O workflow em `.github/workflows/deploy-pages.yml` atualiza a pasta `docs/` automaticamente a cada push no `main`.

## Observações

- Não há servidor: **não envie dados sensíveis** esperando criptografia em trânsito além do HTTPS do host.  
- Para backup, use **Análises → Baixar CSV** ou exporte o extrato original do banco.
