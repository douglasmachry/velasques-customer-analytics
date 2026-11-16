# Velasques Customer Analytics

Modernização de uma aplicação React legada para análise de clientes, compras e fidelização.

> **Dados de demonstração:** o modo padrão usa registos sintéticos. Não inclua dados reais de clientes, CPF/NIF ou exports de produção neste repositório público.

## Funcionalidades

- Dashboard com indicadores de receita, clientes, compras e ticket médio.
- Gráfico mensal de receita e filtro por ano e intervalo de meses.
- Diretório de clientes com pesquisa e ordenação por valor, frequência ou nome.
- Perfil do cliente com métricas, produto recorrente e histórico de compras.
- Ranking de fidelização filtrável por período.
- Compra individual de maior valor no período selecionado.
- Testes unitários para cálculos e adaptação dos payloads legados.
- Testes end-to-end com Playwright para os fluxos principais.

## Stack

React 19 · TypeScript · Vite · React Router · TanStack Query · Tailwind CSS 4 · Recharts · Zod · Vitest · Testing Library · Playwright

## Começar

Requisitos: Node.js 22+ e Corepack.

```bash
corepack enable
corepack yarn install
corepack yarn dev
```

O projeto fixa Yarn 4.4.0 no campo `packageManager`. O ficheiro `yarn.lock` é gerado no workflow de CI enquanto a primeira instalação ainda está a ser preparada; deve ser versionado assim que estiver disponível no artefacto da execução.

## Verificações

```bash
corepack yarn typecheck
corepack yarn lint
corepack yarn test
corepack yarn test:e2e
corepack yarn build
```

Para executar os testes de browser localmente, instale o Chromium:

```bash
corepack yarn playwright install chromium
corepack yarn test:e2e
```

## Fonte de dados

Por padrão, o projeto utiliza um conjunto sintético em `src/data/demo-data.ts`. A configuração está em `.env.example`.

Para ligar uma API compatível com o contrato legado, defina no ficheiro local `.env`:

```bash
VITE_USE_MOCKS=false
VITE_CUSTOMERS_API_URL=https://seu-endpoint-de-clientes
VITE_PURCHASES_API_URL=https://seu-endpoint-de-compras
```

O adapter valida com Zod e espera os campos legados observados no código original:

- Clientes: `cpf`, `nome`.
- Compras: `cliente`, `data`, `valorTotal`, `itens`.
- Itens: `produto`, e opcionalmente `variedade`, `ano`, `pais`, `categoria`.

O adapter normaliza CPF como string, datas para `YYYY-MM-DD` e valores monetários. Os antigos endereços Mocky não puderam ser confirmados como acessíveis nesta verificação; por isso, a app não depende deles no modo padrão. A integração externa só deve ser ativada depois de validar as respostas reais e as regras de CORS.

As variáveis com prefixo `VITE_` ficam acessíveis no browser. Nunca coloque segredos nelas.

## CI

O GitHub Actions executa instalação, TypeScript, ESLint, testes unitários, build e testes end-to-end em Chromium. A pipeline publica o lockfile inicial como artefacto e guarda o relatório Playwright quando os testes falham.

## Organização

```text
src/
  app/                 # Bootstrap, rotas e layout
  data/                # Dados sintéticos de demonstração
  domain/              # Tipos e regras de analytics
  features/            # Dashboard, clientes, detalhe e fidelização
  infrastructure/      # Fonte de dados e adapter dos endpoints legados
  shared/              # Formatação, filtros e estados de carregamento
  test/                # Configuração de testes
e2e/                   # Testes end-to-end de navegação e filtros
```

## Privacidade

Nunca inclua dados reais de clientes, CPF/NIF, credenciais, tokens ou exports de produção.