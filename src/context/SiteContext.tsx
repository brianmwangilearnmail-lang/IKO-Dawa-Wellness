import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, HeroBanner, Order, SiteAnalytics, InventoryBatch, SiteContextType, SiteContent } from '../types';

const SiteContext = createContext<SiteContextType | undefined>(undefined);

// ─────────────────────────────────────────────────────────────────────────────
// Sample Data (replaced by Supabase later)
// ─────────────────────────────────────────────────────────────────────────────
const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Zinc Citrate 50mg',
    brand: 'Natural Factors',
    price: 1250,
    image: 'https://picsum.photos/seed/zinc/400/400',
    description: 'Zinc Citrate is a more absorbable form of zinc that helps support immune function and maintain healthy skin.',
    composition: 'Zinc (Citrate) 50mg',
    inStock: true,
  },
  {
    id: 2,
    title: 'Vitamin C 1000mg',
    brand: 'Natural Factors',
    price: 1800,
    image: 'https://picsum.photos/seed/vitaminc/400/400',
    description: 'Time-release Vitamin C with Bioflavonoids for superior absorption and immune support.',
    composition: 'Vitamin C 1000mg, Rosehips',
    inStock: true,
  },
];

const SAMPLE_HERO: HeroBanner[] = [
  { id: 1, image: 'https://picsum.photos/seed/wellness/1920/600', link: '/shop' },
];

const SAMPLE_ANALYTICS: SiteAnalytics = {
  operations: {
    totalRevenue: { label: 'Net Revenue', value: 'Ksh 45,200', change: 12.5, trend: 'up' },
    orderVolume: { label: 'Order Volume', value: 124, change: 8.2, trend: 'up' },
    refundRate: { label: 'Refunds', value: '0.5%', change: -2.1, trend: 'down' },
    daysOnHand: { label: 'Inventory Health', value: '18 Days', change: 5.4, trend: 'up' },
    topSkus: [
      { title: 'Zinc Citrate 50mg', sales: 45, revenue: 56250 },
      { title: 'Vitamin C 1000mg', sales: 38, revenue: 68400 },
    ],
  },
};

const SAMPLE_INVENTORY: InventoryBatch[] = [
  { id: 'B-001', batchNumber: 'LOT-9982', productId: 1, expiryDate: '2025-12-01', quantity: 50, status: 'good' },
  { id: 'B-002', batchNumber: 'LOT-9983', productId: 2, expiryDate: '2024-06-15', quantity: 12, status: 'expiring' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Default editable site content — every hardcoded string lives here
// ─────────────────────────────────────────────────────────────────────────────
export const DEFAULT_SITE_CONTENT: SiteContent = {
  // ── Header / Branding ──────────────────────────────────────────────────────
  site_name: 'IKO DAWA Wellness',
  site_tagline: 'Precision Health',

  // ── Footer ─────────────────────────────────────────────────────────────────
  footer_tagline: 'Premium dietary supplements formulated for maximum efficacy and daily wellness.',
  footer_email: 'info@ikodawa.com',
  footer_phone: '+254 714 279143',
  footer_copyright: `© ${new Date().getFullYear()} IKO DAWA. All rights reserved.`,

  // ── Home — Shop Section ────────────────────────────────────────────────────
  shop_eyebrow: 'Precision Selection',
  shop_heading: 'Essentials for Daily Life',

  // ── Home — Mission Section ──────────────────────────────────────────────────
  mission_heading_plain: 'IKO',
  mission_heading_italic: 'DAWA',
  mission_body_1: "At IKO DAWA Wellness Centre, the divide between nature and clinical efficacy doesn't exist. We operate at the intersection of biological wisdom and laboratory precision.",
  mission_body_2: 'Founded by clinical researchers who grew tired of industry opaque blends, we built a sanctuary for purity. We remove the excess, keep the essence, and ensure every grain serves your health.',
  mission_btn_philosophy: 'Our Philosophy',
  mission_btn_contact: 'Contact Us',
  mission_btn_trials: 'View Trials',

  // ── About Page ─────────────────────────────────────────────────────────────
  about_eyebrow: 'Our Heritage',
  about_heading: 'Built on Truth',
  about_intro: 'IKO DAWA Wellness Centre was founded to bridge the gap between ancient biological wisdom and modern pharmaceutical precision.',
  about_image_url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop',
  about_story_heading: 'A radical commitment to purity',
  about_beginning_title: 'The Beginning',
  about_beginning_text: 'What began as a small research initiative is now a global search for the most potent, bio-active ingredients on earth. We don\'t just source; we verify.',
  about_standards_title: 'The Standards',
  about_standards_text: 'By partnering with elite clinical labs and regenerative farms, we\'ve created a supply chain that is as transparent as it is effective.',
  about_cta_title: 'Join the Movement',
  about_cta_subtitle: 'Stay updated on our latest clinical trials.',
  about_cta_btn: 'Subscribe',
  value1_title: 'Ethically Yielded',
  value1_text: 'Our botanicals are harvested at peak potency using methods that regenerate the soil rather than deplete it.',
  value2_title: 'Unrivaled Safety',
  value2_text: 'We conduct rigorous third-party screening for contaminants, ensuring every dose is as pure as nature intended.',
  value3_title: 'Active Design',
  value3_text: 'Formulated with molecular precision to ensure maximum bioavailability and targeted nutrient release.',

  // ── Contact Page ───────────────────────────────────────────────────────────
  contact_heading: "Let's Begin",
  contact_subtext: "Whether you're seeking guidance on protocol or tracking an order, our specialists are standing by.",
  contact_email: 'info@ikodawa.com',
  contact_phone: '+254 714 279143',
  contact_email_label: 'Direct Inquiries',
  contact_phone_label: 'Call Us',

  // ── Science Page ───────────────────────────────────────────────────────────
  science_eyebrow: 'Precision Research',
  science_heading: 'Rigorous Proofs',
  science_intro: 'Every IKO DAWA formulation begins in the lab, validated by third-party clinical data and molecular bioavailability screening.',
  science_image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop',
  science_story_heading: 'Documented Bioavailability',
  science_story_body: 'We believe in transparency. We use clinical dosages proven in human trials, ensuring nutrient delivery is targeted and measurable.',
  science_card1_title: 'cGMP Verified',
  science_card1_text: 'Manufactured in elite facilities under stringent environmental controls.',
  science_card2_title: 'Zero Contaminants',
  science_card2_text: 'Systematic screening for heavy metals, pesticides, and residual solvents.',

  // ── Privacy Page ───────────────────────────────────────────────────────────
  privacy_intro: 'Trust Framework',
  privacy_revised: 'Revised: April 2026',
  privacy_section1_title: '01. Data Governance',
  privacy_section1_text: 'We prioritize the security of your biological and transactional data. Information collected during checkout is for the sole intention of order fulfillment and clinical updates.',
  privacy_section2_title: '02. Ethical Use',
  privacy_section2_text: 'We do not engage in the monetization of customer browsing habits or purchase histories. Your data is your property.',
  privacy_section3_title: '03. Security Integrity',
  privacy_section3_text: 'Utilizing PCI-compliant encryption pipelines and cold-storage strategies, we ensure your personal identifier information remains isolated from public vectors.',
};

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────
import { supabase } from '../lib/supabase';

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [hero, setHero] = useState<HeroBanner[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics] = useState<SiteAnalytics>(SAMPLE_ANALYTICS);
  const [inventoryBatches] = useState<InventoryBatch[]>(SAMPLE_INVENTORY);
  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [loading, setLoading] = useState(true);

  // 1. Fetch from Supabase on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      
      try {
        const isAdmin = localStorage.getItem('is_admin_authenticated') === 'true';

        // Parallel fetching for public data
        const [productsRes, heroRes, contentRes] = await Promise.all([
          supabase.from('products').select('*').order('id', { ascending: true }),
          supabase.from('hero_banners').select('*').order('order_index', { ascending: true }),
          supabase.from('site_content').select('*')
        ]);

        if (productsRes.data) {
          setProducts(productsRes.data.map((p: any) => ({ ...p, inStock: p.in_stock })) as Product[]);
        }

        if (heroRes.data) {
          setHero(heroRes.data as HeroBanner[]);
        }

        if (contentRes.data) {
          const contentMap: SiteContent = { ...DEFAULT_SITE_CONTENT };
          contentRes.data.forEach(item => {
            contentMap[item.key] = item.value;
          });
          setSiteContent(contentMap);
        }

        // Only fetch orders if admin is authenticated to save bandwidth and speed up public load
        if (isAdmin) {
          const { data: dbOrders } = await supabase
            .from('orders')
            .select('*, order_items(*)')
            .order('created_at', { ascending: false });
          if (dbOrders) setOrders(dbOrders as Order[]);
        }

      } catch (error) {
        console.error('Data loading failed:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  // 2. Wrap update functions to push to Supabase
  const updateHero = async (banners: HeroBanner[]) => {
    setHero(banners);
    for (const b of banners) {
      // Strip UI-only specific dummy fields the db does not know about
      const { titleTop, titleBottom, active, ...dbPayload } = b as any; 
      
      if (dbPayload.id) {
        await supabase.from('hero_banners').update(dbPayload).eq('id', dbPayload.id);
      } else {
        await supabase.from('hero_banners').insert([dbPayload]);
      }
    }
  };

  const updateProduct = async (id: number, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    
    // Map camelCase to snake_case for Supabase
    const { inStock, ...rest } = updates;
    const dbPayload = { ...rest, ...(inStock !== undefined && { in_stock: inStock }) };
    
    await supabase.from('products').update(dbPayload).eq('id', id);
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    // Map camelCase to snake_case
    const { inStock, ...rest } = product;
    const dbPayload = { ...rest, in_stock: inStock };
    
    const { data, error } = await supabase.from('products').insert([dbPayload]).select().single();
    if (data) {
      setProducts(prev => [...prev, { ...data, inStock: data.in_stock } as Product]);
    } else {
      console.error('Failed to add product:', error);
    }
  };

  const deleteProduct = async (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    await supabase.from('products').delete().eq('id', id);
  };

  const updateOrderStatus = async (id: string | number, status: Order['status']) => {
    setOrders(prev => prev.map(o => (o.id === id ? { ...o, status } : o)));
    await supabase.from('orders').update({ status }).eq('id', id);
  };

  const createOrder = async (orderData: any) => {
    try {
      // Create the parent order
      const { data: orderResult, error: orderErr } = await supabase
        .from('orders')
        .insert([{
          customer_name: orderData.customer_name,
          customer_email: orderData.customer_email,
          total_amount: orderData.total_amount,
          status: orderData.status
        }])
        .select()
        .single();
        
      if (orderErr) throw orderErr;
      
      // Create the order items
      if (orderData.order_items && orderData.order_items.length > 0) {
        const itemsToInsert = orderData.order_items.map((item: any) => ({
          ...item,
          order_id: orderResult.id
        }));
        
        const { error: itemsErr } = await supabase.from('order_items').insert(itemsToInsert);
        if (itemsErr) throw itemsErr;
      }
      
      // Prepend to local state
      setOrders(prev => [{...orderResult, order_items: orderData.order_items} as Order, ...prev]);
      
      return { success: true, id: orderResult.id };
    } catch (e: any) {
      console.error('Order creation failed:', e);
      return { success: false, error: e.message };
    }
  };

  const updateSiteContent = async (updates: SiteContent) => {
    const merged = { ...siteContent, ...updates };
    setSiteContent(merged);
    
    // Sync to Supabase
    // Supabase needs individual rows updated or upserted
    const upserts = Object.keys(updates).map(key => ({
      key,
      value: updates[key]
    }));
    
    await supabase.from('site_content').upsert(upserts, { onConflict: 'key' });
  };

  return (
    <SiteContext.Provider
      value={{
        products,
        hero,
        orders,
        analytics,
        inventoryBatches,
        siteContent,
        loading,
        updateHero,
        updateProduct,
        addProduct,
        deleteProduct,
        updateOrderStatus,
        createOrder,
        updateSiteContent,
      }}
    >
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
