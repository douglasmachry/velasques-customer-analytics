import type { Customer, CustomerAnalytics, DashboardMetrics, Purchase } from './types';

export function filterPurchasesByYear(purchases: Purchase[], year?: number): Purchase[] {
  if (year === undefined) return purchases;
  return purchases.filter((purchase) => {
    const date = new Date(purchase.date);
    return !Number.isNaN(date.getTime()) && date.getFullYear() === year;
  });
}

export function getDashboardMetrics(customers: Customer[], purchases: Purchase[]): DashboardMetrics {
  const totalRevenue = purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
  return {
    totalCustomers: customers.length,
    totalRevenue,
    totalPurchases: purchases.length,
    averageOrderValue: purchases.length === 0 ? 0 : totalRevenue / purchases.length,
  };
}

export function getCustomerAnalytics(customers: Customer[], purchases: Purchase[]): CustomerAnalytics[] {
  return customers.map((customer) => {
    const customerPurchases = purchases.filter((purchase) => purchase.customerId === customer.id);
    const totalSpent = customerPurchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
    const productCounts = new Map<string, number>();

    // The legacy product recommendation counts occurrences of each product line,
    // rather than multiplying by the quantity purchased.
    for (const purchase of customerPurchases) {
      for (const item of purchase.items) {
        productCounts.set(item.product, (productCounts.get(item.product) ?? 0) + 1);
      }
    }

    const mostPurchasedProduct = [...productCounts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0];
    const lastPurchaseDate = customerPurchases
      .map((purchase) => purchase.date)
      .filter((date) => !Number.isNaN(Date.parse(date)))
      .sort((a, b) => Date.parse(b) - Date.parse(a))[0];

    return {
      customer,
      totalSpent,
      purchaseCount: customerPurchases.length,
      averageOrderValue: customerPurchases.length === 0 ? 0 : totalSpent / customerPurchases.length,
      lastPurchaseDate,
      mostPurchasedProduct,
    };
  });
}

export function getLargestPurchase(purchases: Purchase[], year?: number): Purchase | undefined {
  return filterPurchasesByYear(purchases, year).reduce<Purchase | undefined>(
    (largest, purchase) => !largest || purchase.totalAmount > largest.totalAmount ? purchase : largest,
    undefined,
  );
}

export function getLoyaltyRanking(customers: Customer[], purchases: Purchase[]): CustomerAnalytics[] {
  return getCustomerAnalytics(customers, purchases).sort(
    (a, b) => b.purchaseCount - a.purchaseCount || b.totalSpent - a.totalSpent,
  );
}