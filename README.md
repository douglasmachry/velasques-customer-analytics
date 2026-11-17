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
- Unit tests and end-to-end tests that exercise the adapter using synthetic JSON responses in the legacy format.

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

### Synthetic API response fixtures

The larger fixtures model realistic endpoint responses and are used by the Playwright end-to-end suite:

- `public/fixtures/sample-customers.json` — 10 fictional customers.
- `public/fixtures/sample-purchases.json` — 30 fictional purchases across 2025 and 2026.

They retain the legacy field names and include a mix of numeric and Brazilian-formatted monetary values. All purchase customer references match a customer in the customers fixture.

The smaller `legacy-customers.json` and `legacy-purchases.json` files are compact examples of the same payload contract.

The Playwright web server runs the application in API mode and points both API URLs at the larger sample fixtures. This exercises fetching, Zod validation, joining customers to purchases, data normalization, and the UI using the same flow as the external API integration.

## Deployment

The project is configured for Vercel.

1. Import `douglasmachry/velasques-customer-analytics` into your Vercel account.
2. Keep the framework preset as **Vite** (the repository includes a `vercel.json` configuration).
3. Set the project environment variable `VITE_USE_MOCKS=true` for Production, Preview, and Development.
4. Deploy the `main` branch.

The build uses `corepack yarn install --immutable` and `corepack yarn build`, and publishes the `dist/` directory. SPA rewrites are enabled so routes such as `/customers/:customerId` continue to work when opened directly or refreshed.

Only the synthetic demo dataset is intended for the public deployment. Do not configure real customer or purchase API URLs in a public frontend.

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
