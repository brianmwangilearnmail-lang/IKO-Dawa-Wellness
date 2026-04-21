import { ReactNode } from 'react';

export interface Product {
  id: number;
  title: string;
  brand: string;
  price: number;
  image: string;
  description: string;
  composition: string;
  inStock: boolean;
  category?: string;
}

export interface HeroBanner {
  id?: string | number;
  image: string;
  link?: string;
  title?: string;
  subtitle?: string;
}

export interface OrderItem {
  product_id: number;
  quantity: number;
  price_at_sale: number;
  products?: Partial<Product>;
}

export interface Order {
  id: string | number;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: 'pending' | 'dispatched' | 'completed';
  created_at: string;
  order_items: OrderItem[];
}

export interface AnalyticsMetric {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down';
}

export interface InventoryBatch {
  id: string;
  batchNumber: string;
  productId: number;
  expiryDate: string;
  quantity: number;
  status: 'good' | 'expiring' | 'expired';
}

export interface SiteAnalytics {
  operations: {
    totalRevenue: AnalyticsMetric;
    orderVolume: AnalyticsMetric;
    refundRate: AnalyticsMetric;
    daysOnHand: AnalyticsMetric;
    topSkus: Array<{ title: string; sales: number; revenue: number }>;
  };
}

export interface SiteContextType {
  products: Product[];
  hero: HeroBanner[];
  orders: Order[];
  analytics: SiteAnalytics;
  inventoryBatches: InventoryBatch[];
  loading: boolean;
  updateHero: (banners: HeroBanner[]) => Promise<void>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  updateOrderStatus: (id: string | number, status: Order['status']) => Promise<void>;
  createOrder: (orderData: any) => Promise<string>;
}

export interface Inquiry {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}
