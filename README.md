# Velasques Customer Analytics

Modernização de uma aplicação React legada para análise de clientes, compras e fidelização.

> **Dados de demonstração:** o modo padrão usa dados sintéticos. Os fixtures de integração também são fictícios e não representam pessoas ou documentos reais.

## Funcionalidades

- Dashboard com indicadores de receita, clientes, compras e ticket médio.
- Gráfico mensal de receita e filtro por ano e intervalo de meses.
- Diretório de clientes com pesquisa e ordenação por valor, frequência ou nome.
- Perfil do cliente com métricas, produto recorrente e histórico de compras.
- Ranking de fidelização filtrável por período.
- Adapter Zod para os payloads do sistema legado.
- Testes unitários e testes end-to-end que percorrem o adapter a partir de JSON no formato legado.

## Stack

React 19 · TypeScript · Vite · React Router · TanStack Query · Tailwind CSS 4 · Recharts · Zod · Vitest · Playwright

## Começar

Requisitos: Node.js 22+ e Corepack.

```bash
corepack enable
corepack yarn install --immutable
corepack yarn dev
```

## Verificações

```bash
corepack yarn typecheck
corepack yarn lint
corepack yarn test
corepack yarn test:e2e
corepack yarn build
```

Para executar os testes browser localmente:

```bash
corepack yarn playwright install chromium
corepack yarn test:e2e
```

## Contrato legado confirmado no código original

- Clientes: `cpf`, `nome`.
- Compras: `cliente`, `data`, `valorTotal`, `itens`.
- Itens: `produto`; `variedade`, `ano`, `pais` e `categoria` são aceites como atributos opcionais.

Os endpoints antigos apontavam para dois IDs Mocky em HTTP. Não consegui confirmar as respostas atuais desses endereços, pelo que a integração real permanece desligada. Para ativar uma API, configure no ficheiro local `.env` dois URLs HTTPS que devolvam os arrays no contrato acima:

```bash
VITE_USE_MOCKS=false
VITE_CUSTOMERS_API_URL=https://seu-endpoint-de-clientes
VITE_PURCHASES_API_URL=https://seu-endpoint-de-compras
```

A aplicação usa o CPF apenas como chave de junção transitória no adapter. O valor não é guardado no modelo de domínio nem copiado para IDs de cliente ou de compra. Mesmo assim, o browser recebe a resposta original; **não ligue endpoints com dados pessoais a uma aplicação pública sem autenticação e uma API de backend que controle o acesso e minimize os dados devolvidos**.

Os fixtures sintéticos usados no Playwright estão em `public/fixtures/`; o servidor de testes configura a aplicação em modo API para validar o fluxo completo de adaptação.

## CI

O GitHub Actions executa instalação imutável, TypeScript, ESLint, testes unitários, build e testes end-to-end em Chromium. O relatório Playwright é publicado como artefacto.

## Organização

```text
src/
  app/                 # Bootstrap, rotas e layout
  data/                # Dados sintéticos para demonstração
  domain/              # Tipos e regras de analytics
  features/            # Dashboard, clientes, detalhe e fidelização
  infrastructure/      # Fonte de dados e adapter legado
  shared/              # Formatação, filtros e estados de carregamento
  test/                # Configuração de testes
public/fixtures/       # Payloads sintéticos no contrato legado
e2e/                   # Testes de browser
```

## Privacidade

Nunca inclua dados reais de clientes, CPF/NIF, credenciais, tokens ou exports de produção.