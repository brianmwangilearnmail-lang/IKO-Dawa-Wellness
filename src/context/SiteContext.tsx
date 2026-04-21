import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, HeroBanner, Order, SiteAnalytics, InventoryBatch, SiteContextType } from '../types';

const SiteContext = createContext<SiteContextType | undefined>(undefined);

// Sample Data
const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 1,
    title: "Zinc Citrate 50mg",
    brand: "Natural Factors",
    price: 1250,
    image: "https://picsum.photos/seed/zinc/400/400",
    description: "Zinc Citrate is a more absorbable form of zinc that helps support immune function and maintain healthy skin.",
    composition: "Zinc (Citrate) 50mg",
    inStock: true
  },
  {
    id: 2,
    title: "Vitamin C 1000mg",
    brand: "Natural Factors",
    price: 1800,
    image: "https://picsum.photos/seed/vitaminc/400/400",
    description: "Time-release Vitamin C with Bioflavonoids for superior absorption and immune support.",
    composition: "Vitamin C 1000mg, Rosehips",
    inStock: true
  }
];

const SAMPLE_HERO: HeroBanner[] = [
  {
    id: 1,
    image: "https://picsum.photos/seed/wellness/1920/600",
    link: "/shop"
  }
];

const SAMPLE_ANALYTICS: SiteAnalytics = {
  operations: {
    totalRevenue: { label: "Net Revenue", value: "Ksh 45,200", change: 12.5, trend: "up" },
    orderVolume: { label: "Order Volume", value: 124, change: 8.2, trend: "up" },
    refundRate: { label: "Refunds", value: "0.5%", change: -2.1, trend: "down" },
    daysOnHand: { label: "Inventory Health", value: "18 Days", change: 5.4, trend: "up" },
    topSkus: [
      { title: "Zinc Citrate 50mg", sales: 45, revenue: 56250 },
      { title: "Vitamin C 1000mg", sales: 38, revenue: 68400 }
    ]
  }
};

const SAMPLE_INVENTORY: InventoryBatch[] = [
  { id: "B-001", batchNumber: "LOT-9982", productId: 1, expiryDate: "2025-12-01", quantity: 50, status: "good" },
  { id: "B-002", batchNumber: "LOT-9983", productId: 2, expiryDate: "2024-06-15", quantity: 12, status: "expiring" }
];

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [hero, setHero] = useState<HeroBanner[]>(SAMPLE_HERO);
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics] = useState<SiteAnalytics>(SAMPLE_ANALYTICS);
  const [inventoryBatches] = useState<InventoryBatch[]>(SAMPLE_INVENTORY);
  const [loading, setLoading] = useState(false);

  const updateHero = async (banners: HeroBanner[]) => {
    setHero(banners);
  };

  const updateProduct = async (id: number, product: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...product } : p));
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Math.max(0, ...products.map(p => p.id)) + 1 };
    setProducts(prev => [...prev, newProduct]);
  };

  const deleteProduct = async (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateOrderStatus = async (id: string | number, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const createOrder = async (orderData: any) => {
    const newId = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const newOrder: Order = {
      ...orderData,
      id: newId,
      created_at: new Date().toISOString(),
      status: 'pending'
    };
    setOrders(prev => [newOrder, ...prev]);
    return newId;
  };

  return (
    <SiteContext.Provider value={{
      products,
      hero,
      orders,
      analytics,
      inventoryBatches,
      loading,
      updateHero,
      updateProduct,
      addProduct,
      deleteProduct,
      updateOrderStatus,
      createOrder
    }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};
