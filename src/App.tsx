/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
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

// ─── Protected admin route ───────────────────────────────────────────────────
function AdminRoute({ isAuthenticated, onLogin, onLogout }: {
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
}) {
  if (!isAuthenticated) {
    return <AdminLoginPage onLogin={onLogin} />;
  }
  return <AdminDashboardPage onLogout={onLogout} />;
}

// ─── Public layout wrapper (header + footer + cart) ──────────────────────────
function PublicLayout({ children, onCartToggle }: { children: React.ReactNode; onCartToggle: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">
      <Header
        currentPage={location.pathname.replace('/', '') || 'home'}
        onPageChange={(page) => navigate(page === 'home' ? '/' : `/${page}`)}
        onCartToggle={onCartToggle}
      />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer onPageChange={(page) => navigate(page === 'home' ? '/' : `/${page}`)} />
    </div>
  );
}

// ─── Root App ────────────────────────────────────────────────────────────────
export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('is_admin_authenticated') === 'true';
  });

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    localStorage.setItem('is_admin_authenticated', 'true');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('is_admin_authenticated');
  };

  return (
    <SiteProvider>
      <CartProvider>
        <Routes>
          {/* ── Admin routes — no header/footer ── */}
          <Route
            path="/admin"
            element={
              <AdminRoute
                isAuthenticated={isAdminAuthenticated}
                onLogin={handleAdminLogin}
                onLogout={handleAdminLogout}
              />
            }
          />

          {/* ── Public routes — full layout ── */}
          <Route
            path="/"
            element={
              <PublicLayout onCartToggle={() => setIsCartOpen(true)}>
                <HomePage />
              </PublicLayout>
            }
          />
          <Route
            path="/about"
            element={
              <PublicLayout onCartToggle={() => setIsCartOpen(true)}>
                <AboutPage />
              </PublicLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <PublicLayout onCartToggle={() => setIsCartOpen(true)}>
                <ContactPage />
              </PublicLayout>
            }
          />
          <Route
            path="/science"
            element={
              <PublicLayout onCartToggle={() => setIsCartOpen(true)}>
                <SciencePage />
              </PublicLayout>
            }
          />
          <Route
            path="/privacy"
            element={
              <PublicLayout onCartToggle={() => setIsCartOpen(true)}>
                <PrivacyPage />
              </PublicLayout>
            }
          />

          {/* ── Catch-all ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Cart drawer is global */}
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </CartProvider>
    </SiteProvider>
  );
}
