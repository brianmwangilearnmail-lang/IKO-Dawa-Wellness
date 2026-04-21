import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useSite } from '../context/SiteContext';

export const NewArrivalSlider: React.FC = () => {
  const { products } = useSite();
  // For demonstration, taking the last 8 items as "new arrivals"
  const newArrivals = products.slice(-8).reverse();

  return (
    <section className="relative z-20 bg-[var(--bg)] py-16 border-t border-[var(--border)] w-full">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="flex justify-between items-center mb-8 border-b border-[var(--border)] pb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            New to <span className="text-emerald-700">IKO DAWA Wellness</span>
          </h2>
          <a href="#shop-section" className="text-[var(--accent)] hover:bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors text-sm font-semibold">
            View All <ArrowRight className="w-4 h-4 md:w-4 md:h-4" />
          </a>
        </div>
        
        <div className="flex overflow-x-auto gap-6 pb-6 pt-2 snap-x snap-mandatory custom-scrollbar">
          {newArrivals.map((product) => (
            <div key={`new-${product.id}`} className="snap-start shrink-0">
              <ProductCard product={product} variant="new-arrival" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
