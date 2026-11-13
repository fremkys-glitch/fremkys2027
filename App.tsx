import React, { useState, useEffect, Suspense, lazy } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { SmoothScrollProvider } from './context/SmoothScroll';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DualFeature } from './components/DualFeature';
import { FeaturedCollection } from './components/FeaturedCollection';
import { CustomerReviews } from './components/CustomerReviews';
import { AlgeriaBenefits } from './components/AlgeriaBenefits';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import type { Product } from './data/products';

// Code-split non-critical pages and modals for instant initial page speed
const CatalogPage = lazy(() => import('./components/CatalogPage').then((m) => ({ default: m.CatalogPage })));
const ProductDetailPage = lazy(() => import('./components/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })));
const CheckoutPage = lazy(() => import('./components/CheckoutPage').then((m) => ({ default: m.CheckoutPage })));
const AboutPage = lazy(() => import('./components/AboutPage').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./components/ContactPage').then((m) => ({ default: m.ContactPage })));
const QuickViewModal = lazy(() => import('./components/QuickViewModal').then((m) => ({ default: m.QuickViewModal })));
const SearchModal = lazy(() => import('./components/SearchModal').then((m) => ({ default: m.SearchModal })));
const WishlistDrawer = lazy(() => import('./components/WishlistDrawer').then((m) => ({ default: m.WishlistDrawer })));

type ViewMode = 'home' | 'shop' | 'about' | 'contact' | 'product-detail' | 'checkout';

const AppContent: React.FC = () => {
  const { isCartOpen, setIsCartOpen, quickViewProduct, products } = useShop();
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const activeProduct = selectedProduct || (products && products.length > 0 ? products[0] : null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const isModalOrDrawerOpen = isCartOpen || !!quickViewProduct || isSearchOpen || isWishlistOpen;

  // Synchronize view and selected product with browser URL (?product=... or ?page=...)
  useEffect(() => {
    const handleUrlSync = () => {
      const params = new URLSearchParams(window.location.search);
      const prodId = params.get('product') || params.get('id');
      const page = params.get('page');

      if (prodId && products && products.length > 0) {
        const found = products.find(
          (p) => String(p.id).toLowerCase() === String(prodId).toLowerCase()
        );
        if (found) {
          setSelectedProduct(found);
          setCurrentView('product-detail');
          return;
        }
      }

      if (page === 'checkout') {
        setCurrentView('checkout');
      } else if (page === 'shop') {
        setCurrentView('shop');
      } else if (page === 'about') {
        setCurrentView('about');
      } else if (page === 'contact') {
        setCurrentView('contact');
      } else if (!prodId && (!page || page === 'home')) {
        setCurrentView('home');
      }
    };

    handleUrlSync();

    window.addEventListener('popstate', handleUrlSync);
    return () => window.removeEventListener('popstate', handleUrlSync);
  }, [products]);

  const navigateTo = (view: ViewMode) => {
    if (view === 'checkout') {
      setIsCartOpen(false);
    }
    setCurrentView(view);

    // Update browser address bar
    const newUrl = view === 'home' ? window.location.pathname : `?page=${view}`;
    window.history.pushState({ view }, '', newUrl);

    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');

    // Update browser address bar with dedicated product link
    const newUrl = `?product=${encodeURIComponent(product.id)}`;
    window.history.pushState({ productId: product.id }, '', newUrl);

    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <SmoothScrollProvider isPaused={isModalOrDrawerOpen}>
      <div className="min-h-screen bg-[#FBFBFB] text-[#111111] flex flex-col font-sans selection:bg-neutral-900 selection:text-white relative w-full overflow-x-hidden">
      
      {/* Top Main Navigation (Matching media_1790807602108.png) */}
      <Navbar
        currentView={currentView}
        onNavigate={navigateTo}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />

      {/* Main Content Router with Suspense for ultra-fast instant load */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            {/* Hero Section */}
            <Hero onExplore={() => navigateTo('shop')} />

            {/* Dual Feature split cards */}
            <DualFeature onSelectFeature={() => navigateTo('shop')} />

            {/* Spring 26 Collection Preview */}
            <FeaturedCollection onSelectProduct={handleSelectProduct} />

            {/* What Our Customers Say */}
            <CustomerReviews />

            {/* Algerian Luxury Concierge & Shipping Benefits */}
            <AlgeriaBenefits />
          </>
        )}

        <Suspense fallback={<div className="min-h-[50vh] bg-white flex items-center justify-center animate-pulse" />}>
          {currentView === 'shop' && (
            <CatalogPage
              onSelectProduct={handleSelectProduct}
              onBackToHome={() => navigateTo('home')}
            />
          )}

          {currentView === 'product-detail' && activeProduct && (
            <ProductDetailPage
              product={activeProduct}
              onBack={() => navigateTo('shop')}
              onSelectProduct={handleSelectProduct}
              onGoToCheckout={() => navigateTo('checkout')}
            />
          )}

          {currentView === 'checkout' && (
            <CheckoutPage
              onBack={() => navigateTo('shop')}
              onNavigateHome={() => navigateTo('home')}
              onSelectProduct={handleSelectProduct}
              onGoToShop={() => navigateTo('shop')}
            />
          )}

          {currentView === 'about' && (
            <AboutPage
              onBackToHome={() => navigateTo('home')}
              onGoToShop={() => navigateTo('shop')}
            />
          )}

          {currentView === 'contact' && (
            <ContactPage
              onBackToHome={() => navigateTo('home')}
            />
          )}
        </Suspense>
      </main>

      {/* Footer (Manifesto banner appears ONLY on the main home page) */}
      <Footer onNavigate={navigateTo} showManifesto={currentView === 'home'} />

      {/* Drawers and Modals (Rendered only on demand with Suspense) */}
      <CartDrawer onProceedToCheckout={() => navigateTo('checkout')} />
      
      <Suspense fallback={null}>
        {quickViewProduct && <QuickViewModal />}
        {isSearchOpen && <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />}
        {isWishlistOpen && (
          <WishlistDrawer
            isOpen={isWishlistOpen}
            onClose={() => setIsWishlistOpen(false)}
            onSelectProduct={handleSelectProduct}
          />
        )}
      </Suspense>

      </div>
    </SmoothScrollProvider>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
