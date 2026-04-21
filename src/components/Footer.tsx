import React from 'react';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSite } from '../context/SiteContext';

interface FooterProps {
  onPageChange: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = () => {
  const navigate = useNavigate();
  const { siteContent } = useSite();

  const goToShop = () => {
    navigate('/');
    setTimeout(() => document.getElementById('shop-section')?.scrollIntoView({ behavior: 'smooth' }), 150);
  };

  return (
    <footer className="relative z-20 bg-[var(--card-bg)] border-t border-[var(--border)] pt-12 md:pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-6 cursor-default">
              <div className="px-2.5 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm tracking-tighter">IKO</span>
              </div>
              <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tight block uppercase leading-none">
                DAWA <span className="italic font-serif text-emerald-800 lowercase text-lg">wellness</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm mb-4 md:mb-6">{siteContent.footer_tagline}</p>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-slate-100 hover:border-slate-300 text-slate-400 hover:text-slate-600 transition-colors"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-slate-100 hover:border-slate-300 text-slate-400 hover:text-slate-600 transition-colors"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-slate-100 hover:border-slate-300 text-slate-400 hover:text-slate-600 transition-colors"><Instagram className="w-4 h-4" /></a>
            </div>
            <div className="space-y-2 text-slate-500 text-sm">
              <p>Email: <a href={`mailto:${siteContent.footer_email}`} className="hover:text-[var(--accent)] font-medium transition-colors">{siteContent.footer_email}</a></p>
              <p>Phone: <a href={`tel:${siteContent.footer_phone}`} className="hover:text-[var(--accent)] font-medium transition-colors">{siteContent.footer_phone}</a></p>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-6">Shop</h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li><button onClick={goToShop} className="hover:text-[var(--accent)] transition-colors">All Products</button></li>
              <li><button onClick={goToShop} className="hover:text-[var(--accent)] transition-colors">Vitamins &amp; Minerals</button></li>
              <li><button onClick={goToShop} className="hover:text-[var(--accent)] transition-colors">Omega &amp; Fish Oils</button></li>
              <li><button onClick={goToShop} className="hover:text-[var(--accent)] transition-colors">Proteins</button></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-6">Company</h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li><button onClick={() => navigate('/about')} className="hover:text-[var(--accent)] transition-colors">About Us</button></li>
              <li><button onClick={() => navigate('/science')} className="hover:text-[var(--accent)] transition-colors">Our Science</button></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-6">Support</h4>
            <ul className="space-y-4 text-slate-500 text-sm">
              <li><button onClick={() => navigate('/contact')} className="hover:text-[var(--accent)] transition-colors">Contact Us</button></li>
              <li><button onClick={() => navigate('/privacy')} className="hover:text-[var(--accent)] transition-colors">Privacy Policy</button></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
          <p>{siteContent.footer_copyright}</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <button onClick={() => navigate('/privacy')} className="hover:text-slate-600 transition-colors">Privacy Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
