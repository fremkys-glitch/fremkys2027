import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingBag, Menu, X, ArrowRight, MessageCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: 'home' | 'shop' | 'about' | 'contact') => void;
  onOpenSearch: () => void;
  onOpenWishlist: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenSearch,
  onOpenWishlist,
}) => {
  const { cartCount, setIsCartOpen } = useShop();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  // 2. Scroll Behavior: Listen to scroll events (threshold > 50px)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on view change
  const handleNavClick = (view: 'home' | 'shop' | 'about' | 'contact') => {
    setIsMobileMenuOpen(false);
    onNavigate(view);
  };

  const isLightPage = currentView !== 'home';

  // Navigation Links definition
  const navLinks: Array<{ id: 'home' | 'shop' | 'about' | 'contact'; label: string }> = [
    { id: 'home', label: 'Accueil' },
    { id: 'shop', label: 'Boutique' },
    { id: 'about', label: 'À propos' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <>
      {/* 1. Initial Load Animation: Slide down from top (y: -20 -> 0, opacity: 0 -> 1, duration: 0.8s, ease: power3.out) */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 h-[60px] md:h-auto ${
          currentView === 'product-detail'
            ? isScrolled
              ? 'bg-white/95 backdrop-blur-md text-neutral-900 border-b border-neutral-200/80 md:py-4 shadow-sm'
              : 'bg-transparent text-neutral-900 md:py-5 border-none'
            : isScrolled || isLightPage
            ? 'bg-white/95 backdrop-blur-md text-neutral-900 border-b border-neutral-200/80 shadow-sm'
            : 'bg-gradient-to-b from-black/40 via-black/10 to-transparent text-white md:py-6'
        }`}
      >
        {/* Top Black Announcement Marquee Bar on Checkout */}
        {currentView === 'checkout' && (
          <div className="w-full bg-[#000000] text-white py-1.5 px-3 overflow-hidden border-b border-neutral-800 text-[10.5px] md:text-[12px] font-medium tracking-wide">
            <div className="flex items-center justify-center space-x-4 md:space-x-6 space-x-reverse whitespace-nowrap">
              <span>🇩🇿 التوصيل إلى جميع ولايات الجزائر</span>
              <span className="opacity-40">|</span>
              <span>🚚 Livraison partout en Algérie</span>
              <span className="hidden sm:inline opacity-40">|</span>
              <span className="hidden sm:inline">🇩🇿 التوصيل إلى جميع ولايات الجزائر</span>
            </div>
          </div>
        )}

        <div
          className={`w-full max-w-[1720px] mx-auto px-3 sm:px-6 md:px-12 h-full flex items-center justify-between text-[13px] md:text-[14px] ${
            currentView === 'checkout' ? 'py-1 md:py-3' : isScrolled || isLightPage ? 'md:py-4' : ''
          }`}
        >
          {/* Left Navigation on Desktop | Hamburger on Mobile */}
          <div className="flex items-center">
            {/* Mobile Hamburger Button (44x44px touch target) */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center -ml-2 hover:opacity-70 transition-opacity cursor-pointer"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5 stroke-[1.8]" />
            </button>

            {/* Desktop Navigation Links (Tablet 11px, Desktop 12px) */}
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
              {navLinks.map((link) => {
                const isActive = currentView === link.id;
                const isHovered = hoveredNav === link.id;

                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    onMouseEnter={() => setHoveredNav(link.id)}
                    onMouseLeave={() => setHoveredNav(null)}
                    className={`relative py-1 font-sans text-[11px] lg:text-[12px] uppercase tracking-[0.2em] lg:tracking-[0.22em] transition-colors cursor-pointer select-none min-h-[44px] flex items-center ${
                      isActive ? 'font-medium' : 'font-medium opacity-80 hover:opacity-100'
                    }`}
                  >
                    <span>{link.label}</span>

                    {/* Active State Underline with smooth layoutId physics */}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active-underline"
                        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-current"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}

                    {/* 3. Hover Underline Animation: Animates from left to right (scaleX: 0 -> 1) with Framer Motion layoutId */}
                    {!isActive && isHovered && (
                      <motion.div
                        layoutId="navbar-hover-underline"
                        className="absolute bottom-0 left-0 right-0 h-[1px] bg-current origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        exit={{ scaleX: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Center Brand: Playfair Display (Mobile 20px, Tablet 22px, Desktop 28px) */}
          <div
            className="absolute left-1/2 -translate-x-1/2 cursor-pointer flex items-center justify-center"
            onClick={() => handleNavClick('home')}
          >
            <span className="font-serif text-[20px] md:text-[22px] lg:text-[28px] font-semibold tracking-[-0.02em] uppercase leading-none select-none transition-transform duration-300 hover:scale-105">
              FREMKYS
            </span>
          </div>

          {/* Right Icons: Search, User, Cart (Touch Targets >= 44x44px) */}
          <div className="flex items-center space-x-0.5 sm:space-x-1 md:space-x-2">
            {/* Search Icon */}
            <button
              onClick={onOpenSearch}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:opacity-70 transition-opacity cursor-pointer"
              title="Rechercher"
              aria-label="Recherche"
            >
              <Search className="w-[18px] h-[18px] stroke-[1.6]" />
            </button>

            {/* Wishlist / Favorites Icon (Shown on sm+) */}
            <button
              onClick={onOpenWishlist}
              className="relative min-w-[44px] min-h-[44px] items-center justify-center hover:opacity-70 transition-opacity cursor-pointer hidden sm:flex"
              title="Vos Favoris"
              aria-label="Favoris"
            >
              <Heart className="w-[18px] h-[18px] stroke-[1.6]" />
            </button>

            {/* Cart Icon with Cart Badge Animation */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative min-w-[44px] min-h-[44px] flex items-center justify-center hover:opacity-70 transition-opacity cursor-pointer"
              title="Mon Panier"
              aria-label="Panier"
            >
              <ShoppingBag className="w-[18px] h-[18px] stroke-[1.6]" />

              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="absolute top-1.5 right-1 min-w-[16px] h-4 px-1 rounded-full bg-black text-white text-[9.5px] font-semibold flex items-center justify-center border border-white"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* 5. Mobile Menu: Slide in from LEFT (80% screen width), semi-transparent backdrop, top close button */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Full-screen Overlay with Fade Effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Hamburger Drawer sliding in from LEFT (width 80%) */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-0 left-0 w-[80%] max-w-[320px] h-full bg-white shadow-2xl flex flex-col justify-between overflow-y-auto z-10"
              data-lenis-prevent
            >
              {/* Drawer Header with Close Button */}
              <div className="h-[60px] px-5 border-b border-neutral-100 flex items-center justify-between">
                <span className="font-serif text-[20px] font-semibold tracking-[-0.02em] uppercase text-black">
                  FREMKYS
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="min-w-[44px] min-h-[44px] flex items-center justify-center text-neutral-500 hover:text-black cursor-pointer -mr-2"
                  aria-label="Fermer le menu"
                >
                  <X className="w-5 h-5 stroke-[1.8]" />
                </button>
              </div>

              {/* Drawer Navigation Links - Staggered in from bottom */}
              <div className="p-6 space-y-6 flex-1">
                <nav className="space-y-4">
                  {navLinks.map((link, idx) => (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: 0.12 + idx * 0.07,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <button
                        onClick={() => handleNavClick(link.id)}
                        className="w-full text-left py-2 min-h-[44px] hover:opacity-60 flex items-center justify-between font-sans text-[13px] font-medium tracking-[0.2em] uppercase cursor-pointer"
                      >
                        <span className={currentView === link.id ? 'font-semibold text-black' : 'text-neutral-700'}>
                          {link.label === 'Boutique' ? 'Boutique · Spring 26' : link.label}
                        </span>
                        <ArrowRight className="w-4 h-4 text-neutral-400" />
                      </button>
                    </motion.div>
                  ))}
                </nav>

                {/* Categories Shortcut with Stagger */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.42 }}
                  className="pt-6 border-t border-neutral-100"
                >
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-400 block mb-2">
                    Collections
                  </span>
                  <ul className="space-y-1 text-[13px] text-neutral-700 font-sans">
                    <li>
                      <button onClick={() => handleNavClick('shop')} className="w-full text-left py-2 min-h-[40px] flex items-center hover:text-black cursor-pointer">
                        Manteaux &amp; Vestes en Cuir
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleNavClick('shop')} className="w-full text-left py-2 min-h-[40px] flex items-center hover:text-black cursor-pointer">
                        Pantalons &amp; Jupes Structurées
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleNavClick('shop')} className="w-full text-left py-2 min-h-[40px] flex items-center hover:text-black cursor-pointer">
                        Robes &amp; Silhouettes Sculpturales
                      </button>
                    </li>
                    <li>
                      <button onClick={() => handleNavClick('shop')} className="w-full text-left py-2 min-h-[40px] flex items-center hover:text-black cursor-pointer">
                        Tops &amp; Débardeurs en Maille
                      </button>
                    </li>
                  </ul>
                </motion.div>

                {/* Wishlist Shortcut with Stagger */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.5 }}
                  className="pt-4"
                >
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenWishlist();
                    }}
                    className="w-full py-3 px-3 min-h-[44px] bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 flex items-center justify-between rounded-none cursor-pointer"
                  >
                    <span className="flex items-center space-x-2">
                      <Heart className="w-3.5 h-3.5 text-neutral-600" />
                      <span>Vos Favoris sauvegardés</span>
                    </span>
                    <ArrowRight className="w-3 h-3 text-neutral-400" />
                  </button>
                </motion.div>
              </div>

              {/* Drawer Footer: Wilayas & WhatsApp */}
              <div className="p-5 border-t border-neutral-100 bg-[#FAFAFA] space-y-3 text-[11px]">
                <div className="text-neutral-600 leading-snug">
                  🇩🇿 <strong>Livraison 58 Wilayas</strong> &middot; Paiement à la livraison
                </div>
                <a
                  href="https://wa.me/213774296525?text=Bonjour%20Maison%20FREMKYS,%20je%20souhaite%20une%20assistance."
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 min-h-[44px] bg-black hover:bg-neutral-800 text-white text-[11px] uppercase tracking-wider font-medium flex items-center justify-center space-x-2 rounded-none"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Conciergerie WhatsApp</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
