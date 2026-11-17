# Velasques Customer Analytics

A modernization of a legacy React application for customer, purchase, and loyalty analytics.

> **Demo data:** the default mode uses synthetic records. The integration fixtures are also fictional and do not represent real people or identity documents.

## Features

- Business dashboard with revenue, customer, purchase, and average order value metrics.
- Monthly revenue chart with year and month-range filters.
- Customer directory with search and sorting by spend, purchase frequency, or name.
- Individual customer profiles with key metrics, recurring product, and purchase history.
- Loyalty ranking that can be filtered by period.
- Zod adapter for the legacy system's API payloads.
- Unit tests and end-to-end tests that exercise the adapter using JSON fixtures in the legacy format.

## Tech Stack

React 19 · TypeScript · Vite · React Router · TanStack Query · Tailwind CSS 4 · Recharts · Zod · Vitest · Playwright

## Getting Started

Requirements: Node.js 22+ and Corepack.

```bash
corepack enable
corepack yarn install --immutable
corepack yarn dev
```

The project pins Yarn 4.4.0 through the `packageManager` field in `package.json`.

## Quality Checks

```bash
corepack yarn typecheck
corepack yarn lint
corepack yarn test
corepack yarn test:e2e
corepack yarn build
```

To run the browser tests locally, install Playwright's Chromium browser first:

```bash
corepack yarn playwright install chromium
corepack yarn test:e2e
```

## Legacy API Contract

The following fields are confirmed by the original application code:

- Customers: `cpf`, `nome`.
- Purchases: `cliente`, `data`, `valorTotal`, `itens`.
- Purchase items: `produto`; `variedade`, `ano`, `pais`, and `categoria` are supported as optional attributes.

The original application referenced two Mocky endpoints over HTTP. Their current responses could not be verified, so the application uses synthetic data by default. To connect an API, configure two HTTPS URLs in your local `.env` file. They must return arrays matching the contract above:

```bash
VITE_USE_MOCKS=false
VITE_CUSTOMERS_API_URL=https://your-customers-endpoint
VITE_PURCHASES_API_URL=https://your-purchases-endpoint
```

The adapter uses the CPF only as a temporary join key. It is not stored in the domain model or included in customer or purchase IDs. However, the browser still receives the original API response. **Do not connect endpoints containing personal data to a public frontend without authentication and a backend that controls access and minimizes the data returned to the browser.**

Synthetic endpoint-response examples are available in `public/fixtures/sample-customers.json` (10 customers) and `public/fixtures/sample-purchases.json` (30 purchases). They use the legacy API field names and contain fictional values only. The smaller `legacy-customers.json` and `legacy-purchases.json` files remain dedicated to the Playwright end-to-end tests. The test server runs the application in API mode to exercise the complete data-adaptation flow.

## CI

GitHub Actions runs an immutable dependency install, TypeScript checks, ESLint, unit tests, a production build, and end-to-end tests in Chromium. The Playwright HTML report is uploaded as a workflow artifact.

## Project Structure

```text
src/
  app/                 # Application bootstrap, routes, and layout
  data/                # Synthetic demo data
  domain/              # Analytics types and business rules
  features/            # Dashboard, customers, customer details, and loyalty
  infrastructure/      # Data source and legacy API adapter
  shared/              # Formatting, filters, and loading/error states
  test/                # Test configuration
public/fixtures/       # Synthetic payloads using the legacy API contract
e2e/                   # Browser end-to-end tests
```

## Privacy

Never commit real customer records, CPF/NIF numbers, credentials, tokens, or production data exports.
