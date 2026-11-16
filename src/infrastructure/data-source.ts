import type { Customer, Purchase } from '@/domain/types';
import { demoCustomers, demoPurchases } from '@/data/demo-data';
import { adaptLegacyData } from './legacy/legacy-adapter';

export interface AnalyticsData {
  customers: Customer[];
  purchases: Purchase[];
}

function assertSecureApiUrl(rawUrl: string): string {
  const url = new URL(rawUrl, window.location.origin);
  const localHosts = new Set(['localhost', '127.0.0.1']);
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && localHosts.has(url.hostname))) {
    throw new Error('A API deve utilizar HTTPS. HTTP só é permitido para testes locais.');
  }
  return url.toString();
}

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(assertSecureApiUrl(url), {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    throw new Error(`Falha ao consultar a API (HTTP ${response.status}).`);
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
      'Configure VITE_CUSTOMERS_API_URL e VITE_PURCHASES_API_URL para utilizar a API externa.',
    );
  }

  const [customersPayload, purchasesPayload] = await Promise.all([
    fetchJson(customersUrl),
    fetchJson(purchasesUrl),
  ]);

  return adaptLegacyData(customersPayload, purchasesPayload);
}

export const analyticsDataMode =
  import.meta.env.VITE_USE_MOCKS === 'false' ? 'API externa' : 'Dados sintéticos';