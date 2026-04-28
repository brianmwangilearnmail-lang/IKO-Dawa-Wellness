/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { SiteProvider } from './context/SiteContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { AnimatePresence, motion } from 'motion/react';

// Lazy load pages for code splitting
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const StaticPages = lazy(() => import('./pages/StaticPages'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));

// Helper to extract named exports from static pages
const ContactPage = (props: any) => (
  <Suspense fallback={<PageLoader />}><StaticPages.ContactPage {...props} /></Suspense>
);
const SciencePage = (props: any) => (
  <Suspense fallback={<PageLoader />}><StaticPages.SciencePage {...props} /></Suspense>
);
const PrivacyPage = (props: any) => (
  <Suspense fallback={<PageLoader />}><StaticPages.PrivacyPage {...props} /></Suspense>
);

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

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
              <Suspense fallback={<PageLoader />}>
                <AdminRoute
                  isAuthenticated={isAdminAuthenticated}
                  onLogin={handleAdminLogin}
                  onLogout={handleAdminLogout}
                />
              </Suspense>
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
                <Suspense fallback={<PageLoader />}>
                  <AboutPage />
                </Suspense>
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
