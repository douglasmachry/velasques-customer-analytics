import { describe, expect, it } from 'vitest';
import { adaptLegacyCustomers, adaptLegacyPurchases } from './legacy-adapter';

describe('legacy payload adapters', () => {
  it('normalizes customer CPF while retaining leading zeroes', () => {
    expect(adaptLegacyCustomers([{ cpf: 123, nome: 'Ana' }])).toEqual([
      { id: 'cpf:00000000123', taxId: '00000000123', name: 'Ana' },
    ]);
  });

  it('maps the original Portuguese purchase contract into domain fields', () => {
    const [purchase] = adaptLegacyPurchases([{
      cliente: '00123456789',
      data: '15/06/2016',
      valorTotal: '1.234,50',
      itens: [{ produto: 'Vinho do Porto', variedade: 'Tawny', ano: 2012, pais: 'Portugal', categoria: 'Fortificado' }],
    }]);

    expect(purchase).toMatchObject({
      customerId: 'cpf:00123456789',
      date: '2016-06-15',
      totalAmount: 1234.5,
      items: [{ product: 'Vinho do Porto', variety: 'Tawny', year: 2012, country: 'Portugal', category: 'Fortificado' }],
    });
  });

  it('rejects payloads that do not match the legacy contract', () => {
    expect(() => adaptLegacyCustomers([{ cpf: '123' }])).toThrow();
  });
});