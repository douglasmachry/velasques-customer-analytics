import { z } from 'zod';
import type { Customer, Purchase, PurchaseItem } from '@/domain/types';

const identifierSchema = z.union([z.string(), z.number()]);
const legacyCustomerSchema = z.object({
  cpf: identifierSchema,
  nome: z.string().min(1),
});
const legacyItemSchema = z.object({
  produto: z.string().min(1),
  variedade: z.string().optional(),
  ano: identifierSchema.optional(),
  pais: z.string().optional(),
  categoria: z.string().optional(),
});
const legacyPurchaseSchema = z.object({
  cliente: identifierSchema,
  data: z.string().min(1),
  valorTotal: z.union([z.number(), z.string()]),
  itens: z.array(legacyItemSchema),
});

function normalizeLegacyIdentifier(value: string | number): string {
  const raw = String(value).trim();
  const digits = raw.replace(/\D/g, '');
  if (digits.length > 0) return digits.length < 11 ? digits.padStart(11, '0') : digits;

  const fixtureKey = raw.toLocaleLowerCase('pt-BR').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (!fixtureKey) throw new Error('Identificador de cliente vazio recebido da API.');
  return fixtureKey;
}

function normalizeDate(value: string): string {
  const brazilianDate = value.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
  let normalized = value;

  if (brazilianDate) {
    const [, day, month, year] = brazilianDate;
    normalized = `${year}-${month}-${day}`;
  } else {
    const isoDate = value.match(/^(\d{4}-\d{2}-\d{2})/);
    if (isoDate) normalized = isoDate[1];
  }

  const parsed = new Date(`${normalized}T12:00:00`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== normalized) {
    throw new Error('Data de compra inválida recebida da API.');
  }
  return normalized;
}

function parseAmount(value: number | string): number {
  const normalized = typeof value === 'string'
    ? (value.includes(',') ? value.replace(/\./g, '').replace(',', '.') : value.trim())
    : value;
  const amount = Number(normalized);
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error('Valor de compra inválido recebido da API.');
  }
  return amount;
}

/**
 * Adapts both legacy payloads together. CPF is used only as an in-memory join key:
 * it is not copied into Customer, route IDs, or purchase IDs.
 */
export function adaptLegacyData(customersPayload: unknown, purchasesPayload: unknown): {
  customers: Customer[];
  purchases: Purchase[];
} {
  const legacyCustomers = z.array(legacyCustomerSchema).parse(customersPayload);
  const legacyPurchases = z.array(legacyPurchaseSchema).parse(purchasesPayload);

  const customerIdByLegacyIdentifier = new Map<string, string>();
  const customers = legacyCustomers.map((customer, index) => {
    const legacyIdentifier = normalizeLegacyIdentifier(customer.cpf);
    if (customerIdByLegacyIdentifier.has(legacyIdentifier)) {
      throw new Error('A API devolveu identificadores duplicados na lista de clientes.');
    }

    const id = `customer-${String(index + 1).padStart(3, '0')}`;
    customerIdByLegacyIdentifier.set(legacyIdentifier, id);
    return { id, name: customer.nome };
  });

  const purchases = legacyPurchases.map((purchase, index) => {
    const legacyIdentifier = normalizeLegacyIdentifier(purchase.cliente);
    const customerId = customerIdByLegacyIdentifier.get(legacyIdentifier);
    if (!customerId) {
      throw new Error('A API devolveu uma compra sem cliente correspondente.');
    }

    const date = normalizeDate(purchase.data);
    const items: PurchaseItem[] = purchase.itens.map((item) => ({
      product: item.produto,
      variety: item.variedade,
      year: item.ano === undefined ? undefined : Number(item.ano),
      country: item.pais,
      category: item.categoria,
    }));

    return {
      id: `legacy-${date}-${customerId}-${index + 1}`,
      customerId,
      date,
      totalAmount: parseAmount(purchase.valorTotal),
      items,
    };
  });

  return { customers, purchases };
}