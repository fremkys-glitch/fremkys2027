import React, { createContext, useContext, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

interface SmoothScrollContextType {
  lenis: Lenis | null;
  scrollTo: (
    target: string | number | HTMLElement,
    options?: { offset?: number; immediate?: boolean; duration?: number }
  ) => void;
  stop: () => void;
  start: () => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  lenis: null,
  scrollTo: () => {},
  stop: () => {},
  start: () => {},
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

interface SmoothScrollProviderProps {
  children: React.ReactNode;
  isPaused?: boolean;
}

export const SmoothScrollProvider: React.FC<SmoothScrollProviderProps> = ({ children, isPaused = false }) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Configure Lenis with bespoke luxury tuning
    const lenis = new Lenis({
      duration: 1.1, // Cinematic smooth scroll duration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Luxurious exponential ease-out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95, // Weighty, fluid feel
      touchMultiplier: 1.1,
      syncTouch: false, // Native 120Hz responsive touch on mobile
      autoRaf: true, // Automatically run RAF loop
      anchors: true, // Smoothly glide to anchor links
    });

    lenisRef.current = lenis;

    // Attach to global window object for convenience
    (window as any).lenis = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      delete (window as any).lenis;
    };
  }, []);

  // Sync pause/resume state (e.g., when modals/drawers are open)
  useEffect(() => {
    if (!lenisRef.current) return;
    if (isPaused) {
      lenisRef.current.stop();
    } else {
      lenisRef.current.start();
    }
  }, [isPaused]);

  const scrollTo = (
    target: string | number | HTMLElement,
    options?: { offset?: number; immediate?: boolean; duration?: number }
  ) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, options);
    } else {
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: options?.immediate ? 'auto' : 'smooth' });
      } else if (typeof target === 'string') {
        const el = document.querySelector(target);
        el?.scrollIntoView({ behavior: options?.immediate ? 'auto' : 'smooth' });
      }
    }
  };

  const stop = () => lenisRef.current?.stop();
  const start = () => lenisRef.current?.start();

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisRef.current, scrollTo, stop, start }}>
      {children}
    </SmoothScrollContext.Provider>
  );
};
