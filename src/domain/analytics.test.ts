import { describe, expect, it } from 'vitest';
import { filterPurchasesByYear, getCustomerAnalytics, getDashboardMetrics, getLargestPurchase, getLoyaltyRanking } from './analytics';
import type { Customer, Purchase } from './types';

const customers: Customer[] = [
  { id: 'c-1', name: 'Ana Martins', taxId: '000000001' },
  { id: 'c-2', name: 'Bruno Costa', taxId: '000000002' },
];
const purchases: Purchase[] = [
  { id: 'p-1', customerId: 'c-1', date: '2025-02-10', totalAmount: 100, items: [{ product: 'Vinho A', quantity: 2 }] },
  { id: 'p-2', customerId: 'c-1', date: '2025-03-10', totalAmount: 250, items: [{ product: 'Vinho A' }, { product: 'Vinho B' }] },
  { id: 'p-3', customerId: 'c-2', date: '2024-05-10', totalAmount: 80, items: [] },
];

describe('dashboard analytics', () => {
  it('aggregates revenue, customers and order value', () => {
    expect(getDashboardMetrics(customers, purchases)).toEqual({
      totalCustomers: 2, totalRevenue: 430, totalPurchases: 3, averageOrderValue: 430 / 3,
    });
  });
  it('returns zero averages for empty data', () => {
    expect(getDashboardMetrics([], [])).toEqual({
      totalCustomers: 0, totalRevenue: 0, totalPurchases: 0, averageOrderValue: 0,
    });
  });
  it('filters purchase records by year', () => {
    expect(filterPurchasesByYear(purchases, 2025).map((purchase) => purchase.id)).toEqual(['p-1', 'p-2']);
  });
});

describe('customer analytics', () => {
  it('preserves leading zeroes and calculates spend and frequency', () => {
    const [ana] = getCustomerAnalytics(customers, purchases);
    expect(ana.customer.taxId).toBe('000000001');
    expect(ana.totalSpent).toBe(350);
    expect(ana.purchaseCount).toBe(2);
    expect(ana.averageOrderValue).toBe(175);
    expect(ana.mostPurchasedProduct).toBe('Vinho A');
  });
  it('counts product line occurrences instead of item quantities', () => {
    const [ana] = getCustomerAnalytics(customers, purchases);
    expect(ana.mostPurchasedProduct).toBe('Vinho A');
  });
  it('ranks by purchase frequency, then spend', () => {
    expect(getLoyaltyRanking(customers, purchases).map((item) => item.customer.id)).toEqual(['c-1', 'c-2']);
  });
});

describe('largest purchase', () => {
  it('finds the largest purchase for a selected year', () => {
    expect(getLargestPurchase(purchases, 2025)?.id).toBe('p-2');
  });
  it('returns undefined when no purchase matches', () => {
    expect(getLargestPurchase(purchases, 2023)).toBeUndefined();
  });
});