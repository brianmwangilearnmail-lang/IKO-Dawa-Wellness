import React from 'react';
import { Hero } from '../components/Hero';
import { NewArrivalSlider } from '../components/NewArrivalSlider';
import { ProductCard } from '../components/ProductCard';
import { ArrowRight } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const { products, siteContent } = useSite();
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      <Hero />

      <NewArrivalSlider />

      {/* Shop Section */}
      <section id="shop-section" className="relative z-20 py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <p className="text-[10px] uppercase tracking-[0.4em] text-emerald-600 font-black mb-4">
                {siteContent.shop_eyebrow}
              </p>
              <h2 className="text-4xl md:text-6xl font-black text-slate-950 leading-[0.9] tracking-tight mb-2">
                {siteContent.shop_heading}
              </h2>
            </div>
            <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-600 hover:opacity-80 transition-all group border-b border-emerald-600 pb-1">
              View All Products <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {useSite().loading ? (
              <div className="col-span-full py-12 flex flex-col items-center justify-center gap-4 animate-pulse">
                <div className="w-12 h-12 border-[3px] border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-emerald-800 font-black tracking-widest text-xs uppercase">Curating Products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
                <p className="text-slate-400 font-medium italic">Our collection is currently being updated. Please check back shortly.</p>
              </div>
            ) : (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative z-20 bg-white py-32 border-t border-slate-50 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-5xl md:text-8xl font-black text-slate-950 leading-[0.9] mb-12 tracking-tight">
              {siteContent.mission_heading_plain}{' '}
              <span className="italic text-emerald-800">{siteContent.mission_heading_italic}</span>
            </h2>
            <div className="space-y-8 text-slate-500 text-lg md:text-xl leading-relaxed font-medium mb-16">
              <p>{siteContent.mission_body_1}</p>
              <p>{siteContent.mission_body_2}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-10">
              <button
                onClick={() => navigate('/about')}
                className="w-full sm:w-auto bg-slate-950 text-white px-12 py-5 rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl active:scale-95"
              >
                {siteContent.mission_btn_philosophy}
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="w-full sm:w-auto bg-emerald-600 text-white px-12 py-5 rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl active:scale-95"
              >
                {siteContent.mission_btn_contact}
              </button>
              <button
                onClick={() => navigate('/science')}
                className="text-slate-950 font-black text-xs uppercase tracking-widest flex items-center gap-2 group"
              >
                {siteContent.mission_btn_trials} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-emerald-600" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
