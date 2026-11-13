import React, { useState, useEffect, useRef } from 'react';
import { SlidersHorizontal, X, ArrowUpDown, Check } from 'lucide-react';
import type { Product } from '../data/products';
import { useShop } from '../context/ShopContext';
import { isVideoMedia } from '../lib/supabase';

interface FeaturedCollectionProps {
  onSelectProduct?: (product: Product) => void;
}

type PriceSortOption = 'default' | 'asc' | 'desc';
type PriceRangeOption = 'all' | 'under15k' | '15k-22k' | 'over22k';

export const FeaturedCollection: React.FC<FeaturedCollectionProps> = ({ onSelectProduct }) => {
  const { formatPrice, setQuickViewProduct, products, isLoadingDb } = useShop();
  const baseProducts = products;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [priceSort, setPriceSort] = useState<PriceSortOption>('default');
  const [priceRange, setPriceRange] = useState<PriceRangeOption>('all');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const currentSection = sectionRef.current;
    if (!currentSection) return;

    // Check if already in viewport on mount
    const rect = currentSection.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      setIsVisible(true);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(currentSection);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Category pills
  const categories = [
    { id: 'all', label: 'View All' },
    { id: 'manteaux', label: 'Coats & Jackets' },
    { id: 'pantalons', label: 'Bottoms' },
    { id: 'tops', label: 'Tops' },
    { id: 'robes', label: 'Dresses' },
    { id: 'accessoires', label: 'Accessories' },
    { id: 'chaussures', label: 'Shoes' },
  ];

  // Price Range options
  const priceRangeOptions = [
    { id: 'all', label: 'Tous les prix' },
    { id: 'under15k', label: '< 15 000 DA' },
    { id: '15k-22k', label: '15 000 - 22 000 DA' },
    { id: 'over22k', label: '> 22 000 DA' },
  ];

  // Filter & Sort Logic
  let filteredProducts = selectedCategory === 'all'
    ? [...baseProducts]
    : baseProducts.filter((p) => p.category === selectedCategory);

  if (priceRange === 'under15k') {
    filteredProducts = filteredProducts.filter((p) => p.priceDZD < 15000);
  } else if (priceRange === '15k-22k') {
    filteredProducts = filteredProducts.filter((p) => p.priceDZD >= 15000 && p.priceDZD <= 22000);
  } else if (priceRange === 'over22k') {
    filteredProducts = filteredProducts.filter((p) => p.priceDZD > 22000);
  }

  if (priceSort === 'asc') {
    filteredProducts.sort((a, b) => a.priceDZD - b.priceDZD);
  } else if (priceSort === 'desc') {
    filteredProducts.sort((a, b) => b.priceDZD - a.priceDZD);
  }

  const isPriceFilterActive = priceSort !== 'default' || priceRange !== 'all';

  const resetPriceFilters = () => {
    setPriceSort('default');
    setPriceRange('all');
  };

  const handleClick = (product: Product) => {
    if (onSelectProduct) {
      onSelectProduct(product);
    } else {
      setQuickViewProduct(product);
    }
  };

  return (
    <section ref={sectionRef} id="collection" className="w-full bg-[#FFFFFF] py-12 sm:py-16 md:py-24 border-b border-neutral-200 select-none">
      
      {/* 1. Cohesive Editorial Section Title: THE COLLECTION (Mobile 28px, Tablet 36px, Desktop 48px) */}
      <div className="w-full text-center pb-6 sm:pb-10 bg-[#FFFFFF] px-4">
        <span className="font-sans text-[10px] sm:text-[11px] font-medium tracking-[0.3em] uppercase text-neutral-500 block mb-2">
          Vestiaire Printemps 2026
        </span>
        <h2 className="font-serif text-[28px] sm:text-[36px] lg:text-[48px] text-[#000000] font-normal tracking-[-0.02em] leading-[1.1] uppercase text-center">
          THE COLLECTION
        </h2>
      </div>

      <div className="max-w-[1720px] mx-auto px-3 sm:px-6 md:px-12">
        
        {/* Top Bar: SPRING 26 on left, Working Filters Button on right */}
        <div className="flex items-center justify-between pb-3 md:pb-4 border-b border-neutral-100">
          <span className="font-sans text-[11px] sm:text-[12px] font-medium uppercase tracking-[0.12em] text-neutral-800">
            SPRING 26
          </span>

          {/* Interactive Filters Toggle */}
          <div className="flex items-center space-x-2.5">
            {isPriceFilterActive && (
              <button
                onClick={resetPriceFilters}
                className="inline-flex items-center space-x-1 text-[11px] text-neutral-500 hover:text-black transition-colors"
                title="Effacer le filtre de prix"
              >
                <X className="w-3 h-3" />
                <span>Réinitialiser</span>
              </button>
            )}

            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center space-x-1.5 text-[11.5px] md:text-[12px] px-2.5 py-1 transition-all rounded-none cursor-pointer ${
                isFilterOpen || isPriceFilterActive
                  ? 'bg-black text-white font-medium'
                  : 'text-[#000000] hover:opacity-60 font-normal'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 stroke-[1.8]" />
              <span>Filters</span>
              {isPriceFilterActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 ml-0.5" />
              )}
            </button>
          </div>
        </div>

        {/* Expandable Luxury Price Filter Drawer / Panel */}
        {isFilterOpen && (
          <div className="bg-[#FAF9F6] border-b border-neutral-200 p-4 sm:p-6 mb-6 animate-in slide-in-from-top-2 duration-200">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 text-xs">
              
              {/* Filter 1: Sort by Price */}
              <div className="space-y-2.5">
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-400 block">
                  Trier par prix (Sort by Price)
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setPriceSort('default')}
                    className={`px-3 py-1.5 border text-[11px] transition-colors cursor-pointer ${
                      priceSort === 'default'
                        ? 'bg-black text-white border-black font-medium'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:border-black'
                    }`}
                  >
                    Par défaut
                  </button>
                  <button
                    onClick={() => setPriceSort('asc')}
                    className={`px-3 py-1.5 border text-[11px] transition-colors cursor-pointer flex items-center space-x-1 ${
                      priceSort === 'asc'
                        ? 'bg-black text-white border-black font-medium'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:border-black'
                    }`}
                  >
                    <span>Prix croissant</span>
                    <span className="text-[10px] text-neutral-400">(&darr;)</span>
                  </button>
                  <button
                    onClick={() => setPriceSort('desc')}
                    className={`px-3 py-1.5 border text-[11px] transition-colors cursor-pointer flex items-center space-x-1 ${
                      priceSort === 'desc'
                        ? 'bg-black text-white border-black font-medium'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:border-black'
                    }`}
                  >
                    <span>Prix décroissant</span>
                    <span className="text-[10px] text-neutral-400">(&uarr;)</span>
                  </button>
                </div>
              </div>

              {/* Filter 2: Price Range Filter */}
              <div className="space-y-2.5">
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-400 block">
                  Tranches de prix (Budget DZD)
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {priceRangeOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setPriceRange(opt.id as PriceRangeOption)}
                      className={`px-3 py-1.5 border text-[11px] transition-colors cursor-pointer ${
                        priceRange === opt.id
                          ? 'bg-black text-white border-black font-medium'
                          : 'bg-white text-neutral-700 border-neutral-300 hover:border-black'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear / Close */}
              <div className="flex items-center space-x-3 pt-2 md:pt-0 self-end md:self-center">
                {isPriceFilterActive && (
                  <button
                    onClick={resetPriceFilters}
                    className="text-[11px] text-neutral-500 hover:text-black underline cursor-pointer"
                  >
                    Effacer
                  </button>
                )}
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="px-4 py-1.5 bg-black text-white text-[11px] hover:bg-neutral-800 cursor-pointer"
                >
                  Appliquer ({filteredProducts.length})
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Category Pills (Horizontal Scroll on Mobile) */}
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex items-center space-x-2 overflow-x-auto pb-6 pt-3 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`font-sans text-[12px] font-medium tracking-[0.15em] uppercase px-4 py-2 whitespace-nowrap transition-colors rounded-none cursor-pointer shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-[#000000] text-white border border-[#000000]'
                  : 'bg-white text-[#000000] hover:border-black border border-neutral-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Active Filter Summary Indicator */}
        {isPriceFilterActive && (
          <div className="mb-4 flex items-center space-x-2 text-xs text-neutral-600 bg-neutral-50 p-2.5 border border-neutral-200">
            <span className="font-semibold text-black">Filtre actif :</span>
            {priceSort !== 'default' && (
              <span className="px-2 py-0.5 bg-white border border-neutral-300 text-[11px]">
                {priceSort === 'asc' ? 'Prix croissant (Min → Max)' : 'Prix décroissant (Max → Min)'}
              </span>
            )}
            {priceRange !== 'all' && (
              <span className="px-2 py-0.5 bg-white border border-neutral-300 text-[11px]">
                {priceRangeOptions.find(o => o.id === priceRange)?.label}
              </span>
            )}
            <span className="text-neutral-400">({filteredProducts.length} pièces trouvées)</span>
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoadingDb && products.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-8 pt-1 sm:pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col space-y-3 animate-pulse">
                <div className="aspect-[3/4] w-full bg-[#F3EFEA]" />
                <div className="h-3 w-3/4 bg-[#EAE5DF]" />
                <div className="h-3 w-1/3 bg-[#EAE5DF]" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-[#FAF9F6] border border-neutral-200 p-8 my-6">
            <p className="text-sm text-neutral-600 font-light">
              Aucune création ne correspond aux critères de prix sélectionnés.
            </p>
            <button
              onClick={resetPriceFilters}
              className="px-6 py-2 bg-black text-white text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          /* 2-Columns on Mobile (gap-3), 3-Columns on Tablet (gap-5), 4-Columns on Desktop (gap-8) */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-8 pt-1 sm:pt-2">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                onClick={() => handleClick(product)}
                className="group cursor-pointer flex flex-col"
                style={{
                  transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                  opacity: isVisible ? 1 : 0,
                  transition: 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
                  transitionDelay: `${(index % 8) * 0.1}s`,
                  willChange: 'transform, opacity',
                }}
              >
                {/* Product Card Container with aspect-ratio 3/4 and soft warm-ivory / beige tone */}
                <div className="relative aspect-[3/4] w-full bg-[#F6F4F0] overflow-hidden flex items-center justify-center p-2.5 sm:p-3 rounded-none">
                  
                  {/* Out of Stock Badge */}
                  {product.isOutOfStock && (
                    <div className="absolute top-2.5 left-2.5 z-20 bg-black/90 text-white font-sans text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase px-2.5 py-1 backdrop-blur-xs shadow-sm">
                      Épuisé
                    </div>
                  )}

                  {/* Inner wrapper for scale: 0.95 -> scale: 1 entrance transition */}
                  <div
                    className={`w-full h-full flex items-center justify-center ${product.isOutOfStock ? 'opacity-80' : ''}`}
                    style={{
                      transform: isVisible ? 'scale(1)' : 'scale(0.95)',
                      transition: 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
                      transitionDelay: `${(index % 8) * 0.1}s`,
                      willChange: 'transform',
                    }}
                  >
                    {isVideoMedia(product.image) ? (
                      <video
                        src={product.image}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="none"
                        width={400}
                        height={533}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        width={400}
                        height={533}
                        className="w-full h-full object-contain filter contrast-105 transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    )}
                  </div>

                  {/* Subtle Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Name and Price rising from bottom inside the card on hover */}
                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 text-white opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out flex flex-col justify-end z-10 pointer-events-none">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-neutral-300 font-sans mb-1">
                      {product.category}
                    </span>
                    <h4 className="font-serif text-[12px] sm:text-[14px] font-normal tracking-wide text-white line-clamp-1 drop-shadow-xs">
                      {product.name}
                    </h4>
                    <p className="mt-1 text-[11px] sm:text-[12px] font-light text-neutral-200 drop-shadow-xs">
                      {formatPrice(product.priceDZD, product.priceEUR, product.priceUSD)}
                    </p>
                  </div>
                </div>

                {/* Title and Price below the card: Mobile 12px, Desktop 14px */}
                <div className="pt-2 leading-tight text-[#000000] transition-all duration-300 md:group-hover:opacity-0 md:group-hover:translate-y-1">
                  <h4 className="font-sans text-[12px] sm:text-[13px] md:text-[14px] font-normal text-black tracking-tight line-clamp-1 group-hover:underline underline-offset-2">
                    {product.name}
                  </h4>
                  <div className="flex items-center justify-between mt-0.5 sm:mt-1">
                    <p className={`font-sans text-[12px] sm:text-[13px] md:text-[14px] font-normal tracking-tight ${product.isOutOfStock ? 'text-neutral-400 line-through' : 'text-neutral-500'}`}>
                      {formatPrice(product.priceDZD, product.priceEUR, product.priceUSD)}
                    </p>
                    {product.isOutOfStock && (
                      <span className="text-[10px] text-neutral-800 font-sans tracking-wider uppercase font-semibold bg-neutral-100 px-1.5 py-0.5 border border-neutral-200">
                        نفذ
                      </span>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
