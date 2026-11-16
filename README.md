# Velasques Customer Analytics

Modernização de uma aplicação React legada para análise de clientes, compras e fidelização.

> **Dados de demonstração:** todos os registos apresentados são sintéticos. Nenhum dado real de cliente, CPF ou NIF deve ser publicado neste repositório.

## Funcionalidades

- Painel de negócio com receita, clientes, compras e ticket médio.
- Evolução mensal da receita.
- Diretório de clientes com pesquisa e ordenação.
- Ranking de fidelização baseado na frequência de compras.
- Cálculo da compra individual de maior valor.
- Testes unitários das regras de domínio.
- Pipeline CI para tipagem, lint, testes e build.

## Stack

React 19 · TypeScript · Vite · React Router · TanStack Query · Tailwind CSS 4 · Recharts · Vitest · Testing Library

## Começar

Requisitos: Node.js 22+ e Corepack.

```bash
corepack enable
corepack yarn install
corepack yarn dev
```

O projeto fixa Yarn 4.4.0 através do campo `packageManager`.

## Verificações

```bash
corepack yarn typecheck
corepack yarn lint
corepack yarn test
corepack yarn build
```

## Organização

```text
src/
  app/          # Bootstrap, rotas e layout
  data/         # Dados sintéticos de demonstração
  domain/       # Entidades e regras puras de analytics
  features/     # Dashboard, clientes e fidelização
  shared/       # Funções reutilizáveis
  test/         # Configuração de testes
```

As regras de negócio vivem em funções puras para serem testadas sem dependência de componentes. Identificadores fiscais são strings para preservar zeros à esquerda.

## Integração de dados

O projeto original utilizava endpoints Mocky legados. Eles ainda não estão ligados a esta demonstração pública porque a disponibilidade e o contrato dos payloads precisam de ser novamente validados. A aplicação utiliza, por enquanto, dados sintéticos num módulo isolado. O próximo passo é implementar cliente HTTP, schemas de validação e adapters depois de confirmar a estrutura real das respostas.

As variáveis de ambiente estão documentadas em `.env.example`. Não coloque segredos em variáveis com prefixo `VITE_`, pois são expostas no bundle do browser.

## Roadmap

- [ ] Validar os contratos dos endpoints de clientes e compras.
- [ ] Adicionar API client, schemas Zod e adapters.
- [ ] Criar detalhe do cliente e histórico de compras.
- [ ] Adicionar filtros por período e ano.
- [ ] Incluir testes end-to-end com Playwright.
- [ ] Publicar demo online e estudo de caso de arquitetura.

## Privacidade

Nunca inclua dados reais de clientes, CPF/NIF, credenciais, tokens ou exports de produção. Use apenas o conjunto sintético para screenshots e deploys públicos.