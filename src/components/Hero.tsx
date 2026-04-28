import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSite } from '../context/SiteContext';

const SLIDE_DURATION = 6000;

function useSwipe(onLeft: () => void, onRight: () => void) {
  const touchStart = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? onLeft() : onRight();
    touchStart.current = null;
  };
  return { onTouchStart, onTouchEnd };
}

export const Hero: React.FC = () => {
  const { hero } = useSite();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((index: number, dir: number) => {
    setDirection(dir);
    setCurrent(index);
  }, []);

  const next = useCallback(() => {
    if (!hero || hero.length <= 1) return;
    goTo((current + 1) % hero.length, 1);
  }, [current, hero, goTo]);

  const prev = useCallback(() => {
    if (!hero || hero.length <= 1) return;
    goTo(current === 0 ? hero.length - 1 : current - 1, -1);
  }, [current, hero, goTo]);

  // Auto-advance
  useEffect(() => {
    if (!hero || hero.length <= 1 || isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(next, SLIDE_DURATION);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [hero, isPaused, next]);

  // Preload the next image for instant transitions
  useEffect(() => {
    if (hero && hero.length > 1) {
      const nextIndex = (current + 1) % hero.length;
      const nextImage = hero[nextIndex].image;
      if (nextImage) {
        const img = new Image();
        img.src = nextImage;
      }
    }
  }, [current, hero]);

  const swipe = useSwipe(next, prev);

  if (!hero || hero.length === 0) {
    return (
      <div className="w-full mt-14 md:mt-24 bg-gradient-to-r from-emerald-900/10 via-emerald-900/5 to-emerald-900/10 animate-pulse flex items-center justify-center border-b border-[var(--border)]" style={{ height: 'min(56.25vw, 60vh)', minHeight: '200px' }}>
        <div className="flex flex-col items-center gap-3 opacity-40">
          <svg className="w-8 h-8 md:w-10 md:h-10 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 3h18M3 21h18" /></svg>
          <p className="text-[var(--accent)] text-[10px] md:text-xs font-semibold uppercase tracking-wider">Loading...</p>
        </div>
      </div>
    );
  }

  const currentBanner = hero[current];

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0, scale: 1.1 }),
    center: { zIndex: 1, x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ zIndex: 0, x: dir < 0 ? '100%' : '-100%', opacity: 0, scale: 0.95 }),
  };

  return (
    <main className="relative w-full overflow-hidden bg-white mt-[120px] md:mt-[140px] z-0" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)} {...swipe}>
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-10 pt-6">
        <div className="relative w-full h-[45vh] md:h-[55vh] lg:h-[65vh] overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-2xl">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentBanner?.id ?? current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', damping: 25, stiffness: 120, mass: 0.5 },
                opacity: { duration: 0.8, ease: "easeInOut" },
                scale: { duration: 0.8, ease: "easeInOut" }
              }}
              className="absolute inset-0 w-full h-full cursor-pointer group"
              onClick={() => {
                const target = currentBanner?.link;
                if (!target) {
                  document.getElementById('shop-section')?.scrollIntoView({ behavior: 'smooth' });
                  return;
                }
                if (target.startsWith('#')) {
                  document.getElementById(target.substring(1))?.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.open(target, '_blank', 'noopener');
                }
              }}
            >
              <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-slate-900/0 transition-colors duration-700 z-10" />
              {currentBanner?.image ? (
                <motion.img
                  key={currentBanner.image}
                  initial={{ scale: 1.05 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 10, ease: "linear" }}
                  src={currentBanner.image}
                  alt="Wellness Banner"
                  className="w-full h-full object-cover transition-all duration-1000"
                  referrerPolicy="no-referrer"
                  draggable={false}
                  fetchpriority="high"
                  loading="eager"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-emerald-50 border border-emerald-100">
                  <p className="font-serif italic text-3xl text-emerald-200 tracking-widest">Natural Balance</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-8 right-8 z-30 flex items-center gap-2">
             <button onClick={(e) => { e.stopPropagation(); prev(); }} className="p-3 text-slate-800 bg-white/80 hover:bg-white transition-all shadow-lg rounded-full backdrop-blur-sm active:scale-95">
               <ChevronLeft className="w-4 h-4" />
             </button>
             <button onClick={(e) => { e.stopPropagation(); next(); }} className="p-3 text-slate-800 bg-white/80 hover:bg-white transition-all shadow-lg rounded-full backdrop-blur-sm active:scale-95">
               <ChevronRight className="w-4 h-4" />
             </button>
          </div>
        </div>

        <div className="relative z-40 max-w-2xl mx-auto -mt-16 md:-mt-24 px-4 pb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] shadow-[-20px_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-50 p-6 md:p-8">
               <div className="flex flex-col items-center justify-center mb-6 gap-4 w-full">
                  <h3 className="text-sm md:text-base font-bold text-slate-900 tracking-tight text-center">What Are You Looking For?</h3>
               </div>
               <div className="relative">
                  <input type="text" placeholder="Search for Rituals & Wellness Products..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl md:rounded-[2rem] px-8 py-5 md:py-6 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all placeholder:text-slate-300" />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                     <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 md:py-4 rounded-xl md:rounded-[1.5rem] font-bold text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95">Search</button>
                  </div>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
                     <Search className="w-4 h-4 ml-1" />
                  </div>
               </div>
            </motion.div>
        </div>
      </div>
    </main>
  );
};
