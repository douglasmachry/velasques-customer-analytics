import type { Customer, Purchase } from '@/domain/types';
import { demoCustomers, demoPurchases } from '@/data/demo-data';
import { adaptLegacyCustomers, adaptLegacyPurchases } from './legacy/legacy-adapter';

export interface AnalyticsData {
  customers: Customer[];
  purchases: Purchase[];
}

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new Error(`Falha ao consultar ${url}: HTTP ${response.status}`);
  }
  return response.json() as Promise<unknown>;
}

export async function loadAnalyticsData(): Promise<AnalyticsData> {
  const useMocks = import.meta.env.VITE_USE_MOCKS !== 'false';

  if (useMocks) {
    return { customers: demoCustomers, purchases: demoPurchases };
  }

  const customersUrl = import.meta.env.VITE_CUSTOMERS_API_URL;
  const purchasesUrl = import.meta.env.VITE_PURCHASES_API_URL;

  if (!customersUrl || !purchasesUrl) {
    throw new Error(
      'Configure VITE_CUSTOMERS_API_URL e VITE_PURCHASES_API_URL para utilizar a API real.',
    );
  }

  const [customersPayload, purchasesPayload] = await Promise.all([
    fetchJson(customersUrl),
    fetchJson(purchasesUrl),
  ]);

  const customers = adaptLegacyCustomers(customersPayload);
  const purchases = adaptLegacyPurchases(purchasesPayload);
  const knownCustomerIds = new Set(customers.map((customer) => customer.id));
  const unknownCustomerPurchases = purchases.filter(
    (purchase) => !knownCustomerIds.has(purchase.customerId),
  );

  if (unknownCustomerPurchases.length > 0) {
    throw new Error(
      `A API devolveu ${unknownCustomerPurchases.length} compra(s) sem cliente correspondente.`,
    );
  }

  return { customers, purchases };
}

export const analyticsDataMode =
  import.meta.env.VITE_USE_MOCKS === 'false' ? 'API externa' : 'Dados sintéticos';
