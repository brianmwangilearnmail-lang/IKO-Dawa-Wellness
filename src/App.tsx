/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage, SciencePage, PrivacyPage } from './pages/StaticPages';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { SiteProvider } from './context/SiteContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { AnimatePresence, motion } from 'motion/react';

type Page = 'home' | 'about' | 'contact' | 'science' | 'privacy' | 'admin-login' | 'admin-dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    const savedAdmin = localStorage.getItem('is_admin_authenticated');
    if (savedAdmin === 'true') {
      setIsAdminAuthenticated(true);
    }
  }, []);

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    localStorage.setItem('is_admin_authenticated', 'true');
    setCurrentPage('admin-dashboard');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('is_admin_authenticated');
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage onPageChange={(page) => setCurrentPage(page as Page)} />;
      case 'about': return <AboutPage />;
      case 'contact': return <ContactPage />;
      case 'science': return <SciencePage />;
      case 'privacy': return <PrivacyPage />;
      case 'admin-login': return <AdminLoginPage onLogin={handleAdminLogin} onBack={() => setCurrentPage('home')} />;
      case 'admin-dashboard': 
        return isAdminAuthenticated ? 
          <AdminDashboardPage onLogout={handleAdminLogout} /> : 
          <AdminLoginPage onLogin={handleAdminLogin} onBack={() => setCurrentPage('home')} />;
      default: return <HomePage />;
    }
  };

  const isFullPage = currentPage === 'admin-dashboard' || currentPage === 'admin-login';

  return (
    <SiteProvider>
      <CartProvider>
        <div className="min-h-screen bg-[var(--bg)] flex flex-col">
          {!isFullPage && (
            <Header 
              currentPage={currentPage} 
              onPageChange={(page) => setCurrentPage(page as Page)} 
              onCartToggle={() => setIsCartOpen(true)} 
            />
          )}

          <main className="flex-grow">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {renderPage()}
              </motion.div>
            </AnimatePresence>
          </main>

          {!isFullPage && <Footer onPageChange={(page) => setCurrentPage(page as Page)} />}
          
          {!isFullPage && (
            <div className="bg-slate-950 py-3 border-t border-slate-900 text-center">
              <button 
                onClick={() => setCurrentPage('admin-login')} 
                className="text-slate-600 hover:text-slate-400 text-[10px] uppercase font-bold tracking-widest transition-colors duration-300"
              >
                Admin Restricted Access
              </button>
            </div>
          )}

          <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </div>
      </CartProvider>
    </SiteProvider>
  );
}

