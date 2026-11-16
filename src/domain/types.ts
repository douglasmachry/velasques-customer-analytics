export interface Customer {
  id: string;
  name: string;
  /** Optional placeholder for local demo data only; the legacy API adapter never stores CPF here. */
  taxId?: string;
  email?: string;
  city?: string;
  createdAt?: string;
}

export interface PurchaseItem {
  product: string;
  variety?: string;
  year?: number;
  country?: string;
  category?: string;
  quantity?: number;
}

export interface Purchase {
  id: string;
  customerId: string;
  date: string;
  totalAmount: number;
  items: PurchaseItem[];
}

export interface CustomerAnalytics {
  customer: Customer;
  totalSpent: number;
  purchaseCount: number;
  averageOrderValue: number;
  lastPurchaseDate?: string;
  mostPurchasedProduct?: string;
}

export interface DashboardMetrics {
  totalCustomers: number;
  totalRevenue: number;
  totalPurchases: number;
  averageOrderValue: number;
}