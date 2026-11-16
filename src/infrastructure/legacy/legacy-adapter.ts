import { z } from 'zod';
import type { Customer, Purchase, PurchaseItem } from '@/domain/types';

const identifierSchema = z.union([z.string(), z.number()]);
const legacyCustomerSchema = z.object({
  cpf: identifierSchema,
  nome: z.string(),
});
const legacyItemSchema = z.object({
  produto: z.string(),
  variedade: z.string().optional(),
  ano: identifierSchema.optional(),
  pais: z.string().optional(),
  categoria: z.string().optional(),
});
const legacyPurchaseSchema = z.object({
  cliente: identifierSchema,
  data: z.string(),
  valorTotal: z.union([z.number(), z.string()]),
  itens: z.array(legacyItemSchema),
});

function normalizeCpf(value: string | number): string {
  const digits = String(value).replace(/\D/g, '');
  return digits.length < 11 ? digits.padStart(11, '0') : digits;
}

function normalizeDate(value: string): string {
  const brazilianDate = value.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
  if (brazilianDate) {
    const [, day, month, year] = brazilianDate;
    return `${year}-${month}-${day}`;
  }

  const isoDate = value.match(/^(\d{4}-\d{2}-\d{2})/);
  if (isoDate) return isoDate[1];

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Data de compra inválida recebida da API: ${value}`);
  }
  return parsed.toISOString().slice(0, 10);
}

function parseAmount(value: number | string): number {
  const normalized = typeof value === 'string'
    ? (value.includes(',') ? value.replace(/\./g, '').replace(',', '.') : value.trim())
    : value;
  const amount = Number(normalized);
  if (!Number.isFinite(amount)) {
    throw new Error(`Valor de compra inválido recebido da API: ${value}`);
  }
  return amount;
}

export function adaptLegacyCustomers(payload: unknown): Customer[] {
  return z.array(legacyCustomerSchema).parse(payload).map((customer) => {
    const taxId = normalizeCpf(customer.cpf);
    return { id: `cpf:${taxId}`, taxId, name: customer.nome };
  });
}

export function adaptLegacyPurchases(payload: unknown): Purchase[] {
  return z.array(legacyPurchaseSchema).parse(payload).map((purchase, index) => {
    const taxId = normalizeCpf(purchase.cliente);
    const items: PurchaseItem[] = purchase.itens.map((item) => ({
      product: item.produto,
      variety: item.variedade,
      year: item.ano === undefined ? undefined : Number(item.ano),
      country: item.pais,
      category: item.categoria,
    }));
    const date = normalizeDate(purchase.data);

    return {
      id: `legacy-${date}-${taxId}-${index + 1}`,
      customerId: `cpf:${taxId}`,
      date,
      totalAmount: parseAmount(purchase.valorTotal),
      items,
    };
  });
}