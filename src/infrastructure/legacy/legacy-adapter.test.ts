import { describe, expect, it } from 'vitest';
import { adaptLegacyData } from './legacy-adapter';

describe('legacy payload adapter', () => {
  it('joins customers and purchases without exposing tax identifiers in domain data', () => {
    const result = adaptLegacyData(
      [{ cpf: 'DEMO-ANA', nome: 'Ana Demonstração' }],
      [{ cliente: 'DEMO-ANA', data: '15/06/2016', valorTotal: '1.234,50', itens: [] }],
    );

    expect(result.customers).toEqual([{ id: 'customer-001', name: 'Ana Demonstração' }]);
    expect(result.customers[0]).not.toHaveProperty('taxId');
    expect(result.purchases[0]).toMatchObject({
      id: 'legacy-2016-06-15-customer-001-1',
      customerId: 'customer-001',
      date: '2016-06-15',
      totalAmount: 1234.5,
    });
    expect(result.purchases[0].id).not.toContain('DEMO-ANA');
  });

  it('normalizes CPF punctuation and leading zeroes only as an internal join key', () => {
    const result = adaptLegacyData(
      [{ cpf: '000.000.001-23', nome: 'Ana' }],
      [{ cliente: '00000000123', data: '2016-06-15', valorTotal: 100, itens: [] }],
    );

    expect(result.purchases[0].customerId).toBe('customer-001');
    expect(JSON.stringify(result)).not.toContain('00000000123');
  });

  it('maps optional product attributes from the original API contract', () => {
    const result = adaptLegacyData(
      [{ cpf: 'DEMO-ANA', nome: 'Ana' }],
      [{
        cliente: 'DEMO-ANA',
        data: '2016-06-15',
        valorTotal: 100,
        itens: [{
          produto: 'Vinho do Porto',
          variedade: 'Tawny',
          ano: 2012,
          pais: 'Portugal',
          categoria: 'Fortificado',
        }],
      }],
    );

    expect(result.purchases[0].items[0]).toEqual({
      product: 'Vinho do Porto',
      variety: 'Tawny',
      year: 2012,
      country: 'Portugal',
      category: 'Fortificado',
    });
  });

  it('rejects customer records that do not match the legacy contract', () => {
    expect(() => adaptLegacyData([{ cpf: 'DEMO-ANA' }], [])).toThrow();
  });

  it('rejects purchases without a matching customer', () => {
    expect(() => adaptLegacyData(
      [{ cpf: 'DEMO-ANA', nome: 'Ana' }],
      [{ cliente: 'DEMO-OTHER', data: '2016-06-15', valorTotal: 100, itens: [] }],
    )).toThrow(/sem cliente correspondente/);
  });

  it('rejects invalid dates and monetary values', () => {
    expect(() => adaptLegacyData(
      [{ cpf: 'DEMO-ANA', nome: 'Ana' }],
      [{ cliente: 'DEMO-ANA', data: '31/02/2016', valorTotal: 100, itens: [] }],
    )).toThrow(/Data de compra inválida/);

    expect(() => adaptLegacyData(
      [{ cpf: 'DEMO-ANA', nome: 'Ana' }],
      [{ cliente: 'DEMO-ANA', data: '2016-06-15', valorTotal: 'abc', itens: [] }],
    )).toThrow(/Valor de compra inválido/);
  });
});