import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ShoppingCart, Package, Heart, Eye, X, Plus, Minus, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'new-arrival';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'default' }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const handleImgLoad = useCallback(() => setImgLoaded(true), []);
  const handleImgError = useCallback(() => setImgError(true), []);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isModalOpen]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleModalAddToCart = () => {
    addToCart(product);
    setModalQuantity(1);
    setIsModalOpen(false);
  };

  // Mock a discount for visual fidelity to Mydawa
  const originalPrice = Math.floor(product.price * 1.15); // 15% more

  // ─── POPUP MODAL ───────────────────────────────────────────────
  const modal = createPortal(
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8">
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row max-h-[95vh] md:max-h-[90vh] overflow-y-auto md:overflow-hidden border border-slate-100"
          >
            <div className="w-full md:w-5/12 bg-slate-50 flex items-center justify-center p-4 md:p-10 h-48 md:h-auto md:max-h-none sticky top-0 z-40 border-b border-slate-100 md:border-b-0 shrink-0">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-3 right-3 md:top-4 md:right-4 z-50 w-9 h-9 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg flex items-center justify-center transition-colors shadow-sm"><X className="w-5 h-5 text-slate-500" /></button>
              {product.image ? (<img src={product.image} alt={product.title} className="w-full h-full object-contain" referrerPolicy="no-referrer" />) : (<div className="flex flex-col items-center text-slate-300"><Package className="w-16 h-16 mb-4 opacity-50" /><span className="text-xs uppercase font-semibold tracking-wider">No Visual</span></div>)}
            </div>
            <div className="w-full md:w-7/12 p-6 md:p-8 flex flex-col">
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider w-max mb-4 border border-emerald-100">{product.brand}</span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-5 tracking-tight">{product.title}</h2>
              <div className="space-y-4 mb-6 flex-grow">
                {product.composition && (<div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Composition</p><p className="text-sm text-slate-700 font-medium bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">{product.composition}</p></div>)}
                <div><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Description</p><p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{product.description || 'Professional wellness formulation focused on bioavailable results.'}</p></div>
              </div>
              <div className="border-t border-slate-100 pt-5 mt-auto space-y-4">
                <div className="flex justify-between items-center">
                  <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Price</p><p className="text-emerald-700 font-black text-2xl">Ksh {(product.price * modalQuantity).toLocaleString()}</p></div>
                  <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1.5 border border-slate-200">
                    <button onClick={() => setModalQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 rounded bg-white shadow-sm flex items-center justify-center hover:bg-slate-100"><Minus className="w-4 h-4" /></button>
                    <span className="font-semibold text-slate-900 w-6 text-center text-sm">{modalQuantity}</span>
                    <button onClick={() => setModalQuantity(q => q + 1)} className="w-8 h-8 rounded bg-white shadow-sm flex items-center justify-center hover:bg-slate-100"><Plus className="w-4 h-4" /></button>
                  </div>
                </div>
                <button onClick={handleModalAddToCart} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg">+ Add to Cart</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );

  return (
    <>
      <div className={`bg-white border border-slate-100 rounded-[1.5rem] overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col group relative ${variant === 'new-arrival' ? 'min-w-[240px] w-[240px]' : ''}`}>
        {/* Action Icons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
           <button onClick={() => setIsModalOpen(true)} className="w-8 h-8 rounded-full bg-white shadow-lg border border-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors">
              <Eye className="w-4 h-4" />
           </button>
           <button className="w-8 h-8 rounded-full bg-white shadow-lg border border-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-colors">
              <Heart className="w-4 h-4" />
           </button>
        </div>

        {/* Image Area */}
        <div className="relative aspect-square flex items-center justify-center p-6 bg-white cursor-pointer" onClick={() => setIsModalOpen(true)}>
          {product.image && !imgError ? (
            <img
              src={product.image}
              alt={product.title}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="flex flex-col items-center text-slate-200">
               <Package className="w-16 h-16 mb-2 opacity-50" />
               <span className="text-[10px] uppercase font-bold tracking-widest text-slate-300">Natural Ritual</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="mb-4">
            <h3 className="font-bold text-slate-800 text-[13px] md:text-sm leading-tight mb-2 line-clamp-2 h-[2.5em] group-hover:text-emerald-700 transition-colors">
              {product.title}
            </h3>
            <div className="flex flex-col gap-1">
               <span className="text-[11px] text-slate-400 line-through">KES {originalPrice.toLocaleString()}.00</span>
               <span className="text-[15px] font-black text-slate-950">KES {product.price.toLocaleString()}.00</span>
            </div>
          </div>

          <div className="mt-auto">
             <button
               onClick={handleAddToCart}
               disabled={added}
               className={`w-full py-3 rounded-xl border font-bold text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                  added 
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                  : 'bg-[#F2F5FF] border-[#E8EEFF] text-slate-900 hover:bg-[#E8EEFF]'
               }`}
             >
               {added ? (
                  <><Check className="w-3.5 h-3.5" /> Added</>
               ) : (
                  <>+ Add To Cart</>
               )}
             </button>
          </div>
        </div>
      </div>
      {modal}
    </>
  );
};
