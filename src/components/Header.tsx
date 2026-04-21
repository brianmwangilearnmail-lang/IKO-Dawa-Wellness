import React, { useState } from 'react';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSite } from '../context/SiteContext';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  onPageChange: (page: string) => void;
  currentPage: string;
  onCartToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onCartToggle }) => {
  const { totalItems } = useCart();
  const { siteContent } = useSite();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentPage = location.pathname.replace('/', '') || 'home';

  const goTo = (path: string) => {
    setIsMobileMenuOpen(false);
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToShop = () => {
    setIsMobileMenuOpen(false);
    navigate('/');
    setTimeout(() => document.getElementById('shop-section')?.scrollIntoView({ behavior: 'smooth' }), 150);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="px-3 h-10 bg-emerald-600 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform shadow-lg shadow-emerald-600/20">
              <span className="text-white font-black text-lg tracking-tighter">IKO</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl md:text-3xl font-black text-slate-950 tracking-tighter leading-none uppercase">
                DAWA <span className="italic font-serif text-emerald-800 lowercase">wellness</span>
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-emerald-600/60 mt-0.5 whitespace-nowrap">
                {siteContent.site_tagline}
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-8">
            <button
              onClick={goToShop}
              className={`text-[12px] font-bold text-slate-600 hover:text-slate-950 flex items-center gap-1.5 transition-colors group ${currentPage === 'home' ? 'text-emerald-700' : ''}`}
            >
              Shop by Category
              <svg className="w-3.5 h-3.5 opacity-20 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button onClick={() => goTo('/science')} className={`text-[12px] font-bold transition-colors ${currentPage === 'science' ? 'text-emerald-700' : 'text-slate-600 hover:text-slate-950'}`}>Science</button>
            <button onClick={() => goTo('/about')} className={`text-[12px] font-bold transition-colors ${currentPage === 'about' ? 'text-emerald-700' : 'text-slate-600 hover:text-slate-950'}`}>About</button>
            <button onClick={() => goTo('/contact')} className={`text-[12px] font-bold transition-colors ${currentPage === 'contact' ? 'text-emerald-700' : 'text-slate-600 hover:text-slate-950'}`}>Contact</button>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button className="text-slate-500 hover:text-slate-900 transition-colors p-2 lg:hidden">
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={onCartToggle}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5 text-slate-700" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-emerald-600 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-950"
            >
              <Menu className="w-7 h-7" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[90] lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-screen w-full max-w-[320px] bg-white z-[100] shadow-2xl flex flex-col lg:hidden"
            >
              <div className="p-6 flex items-center justify-between border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="px-2 h-7 bg-emerald-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-black text-xs tracking-tighter">IKO</span>
                  </div>
                  <span className="text-sm font-black tracking-[0.1em] text-slate-950 uppercase leading-none">DAWA <span className="italic font-serif text-emerald-800 lowercase">wellness</span></span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-slate-950 rounded-full hover:bg-slate-50 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col p-8 space-y-6 flex-grow">
                <button onClick={goToShop} className="text-left py-2 border-b border-slate-50">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1 font-black">Shop</p>
                  <span className="text-2xl font-serif italic text-slate-950">Collections</span>
                </button>
                <button onClick={() => goTo('/about')} className="text-left py-2 border-b border-slate-50">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1 font-black">History</p>
                  <span className="text-2xl font-serif italic text-slate-950">Our Story</span>
                </button>
                <button onClick={() => goTo('/science')} className="text-left py-2 border-b border-slate-50">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1 font-black">Evidence</p>
                  <span className="text-2xl font-serif italic text-slate-950">The Science</span>
                </button>
                <button onClick={() => goTo('/contact')} className="text-left py-2 border-b border-slate-50">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1 font-black">Help</p>
                  <span className="text-2xl font-serif italic text-slate-950">Contact Us</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
