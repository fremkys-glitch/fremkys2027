import React, { useState } from 'react';
import { SlidersHorizontal, ArrowLeft, ArrowUpDown } from 'lucide-react';
import type { Product } from '../data/products';
import { useShop } from '../context/ShopContext';
import { isVideoMedia } from '../lib/supabase';

interface CatalogPageProps {
  onSelectProduct: (product: Product) => void;
  onBackToHome: () => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ onSelectProduct, onBackToHome }) => {
  const { formatPrice, products, isLoadingDb } = useShop();
  const baseProducts = products;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string | null>(null);

  // Exact pills from media_1790917782451.png
  const categories = [
    { id: 'all', label: 'View All' },
    { id: 'manteaux', label: 'Coats & Jackets' },
    { id: 'pantalons', label: 'Bottoms' },
    { id: 'tops', label: 'Tops' },
    { id: 'robes', label: 'Dresses' },
    { id: 'accessoires', label: 'Accessories' },
    { id: 'chaussures', label: 'Shoes' },
  ];

  let filtered = selectedCategory === 'all'
    ? baseProducts
    : baseProducts.filter((p) => p.category === selectedCategory);

  if (selectedSizeFilter) {
    filtered = filtered.filter((p) => p.sizes.includes(selectedSizeFilter));
  }

  if (sortBy === 'price-asc') {
    filtered = [...filtered].sort((a, b) => a.priceDZD - b.priceDZD);
  } else if (sortBy === 'price-desc') {
    filtered = [...filtered].sort((a, b) => b.priceDZD - a.priceDZD);
  }

  return (
    <div className="w-full bg-[#FFFFFF] min-h-screen pt-28 pb-24 px-6 md:px-12 animate-in fade-in duration-300">
      <div className="max-w-[1720px] mx-auto">
        
        {/* Back Link Breadcrumb */}
        <div className="mb-6">
          <button
            onClick={onBackToHome}
            className="flex items-center space-x-1.5 font-sans text-[11px] text-neutral-500 hover:text-black transition-colors uppercase tracking-[0.2em]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retour à l'Accueil</span>
          </button>
        </div>

        {/* Top Header Row: Season Title & Filters */}
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-baseline space-x-3">
            <h2 className="font-sans text-[12px] font-semibold uppercase tracking-[0.2em] text-[#000000]">
              SPRING 26
            </h2>
            <span className="font-sans text-[11px] text-neutral-400 font-light">
              ({filtered.length} pièces)
            </span>
          </div>

          <div className="flex items-center space-x-6">
            {/* Sort Toggle */}
            <div className="hidden sm:flex items-center space-x-1.5 text-xs text-neutral-600">
              <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-sans text-[12px] text-[#000000] focus:outline-none cursor-pointer"
              >
                <option value="featured">Sélection FREMKYS</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>
            </div>

            {/* Filters Button */}
            <button
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className="flex items-center space-x-1.5 font-sans text-[12px] font-medium tracking-[0.15em] uppercase text-[#000000] hover:opacity-60 transition-opacity"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 stroke-[1.8]" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Filter Drawer / Expandable Bar */}
        {isFilterDrawerOpen && (
          <div className="p-4 bg-neutral-50 border-y border-neutral-200 flex flex-wrap items-center justify-between gap-4 animate-in fade-in slide-in-from-top-1 text-xs mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-neutral-500 font-medium">Filtrer par taille :</span>
              {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSizeFilter(selectedSizeFilter === size ? null : size)}
                  className={`px-3 py-1 border text-xs tracking-wider transition-colors rounded-none ${
                    selectedSizeFilter === size ? 'bg-[#000000] text-white border-black font-semibold' : 'bg-white text-neutral-700 border-neutral-300 hover:border-black'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {selectedSizeFilter && (
              <button
                onClick={() => setSelectedSizeFilter(null)}
                className="text-neutral-500 hover:text-black underline underline-offset-4"
              >
                Réinitialiser le filtre
              </button>
            )}
          </div>
        )}

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-8 pt-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`font-sans text-[12px] font-medium tracking-[0.15em] uppercase px-4 py-2 whitespace-nowrap transition-colors rounded-none cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#000000] text-white border border-[#000000]'
                  : 'bg-white text-[#000000] hover:border-black border border-neutral-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Responsive Product Grid: 2 columns mobile (gap-3), 3 tablet, 4 desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 pt-2">
          {filtered.map((product) => (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="group cursor-pointer flex flex-col"
            >
              {/* Image Frame with 3/4 aspect ratio */}
              <div className="relative aspect-[3/4] w-full bg-[#F6F4F0] overflow-hidden flex items-center justify-center p-2.5 sm:p-3 rounded-none transition-transform duration-500 ease-out group-hover:scale-[1.01]">
                {/* Out of Stock Badge */}
                {product.isOutOfStock && (
                  <div className="absolute top-2.5 left-2.5 z-20 bg-black/90 text-white font-sans text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase px-2.5 py-1 backdrop-blur-xs shadow-sm">
                    Épuisé
                  </div>
                )}

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
                    className={`w-full h-full object-cover ${product.isOutOfStock ? 'opacity-80' : ''}`}
                  />
                ) : (
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    width={400}
                    height={533}
                    className={`w-full h-full object-contain filter contrast-105 ${product.isOutOfStock ? 'opacity-80' : ''}`}
                  />
                )}

                {/* Subtle Hover Action overlay (desktop only) */}
                <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden md:block">
                  <div className="w-full bg-[#000000] text-white font-sans text-[11px] py-2.5 text-center uppercase tracking-[0.18em] font-medium">
                    {product.isOutOfStock ? 'Voir la pièce (Épuisé)' : 'Découvrir la pièce'}
                  </div>
                </div>
              </div>

              {/* Title & Price underneath: Mobile 12px, Desktop 14px */}
              <div className="pt-2 leading-tight text-[#000000]">
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

        {/* Empty state if filtered out */}
        {filtered.length === 0 && (
          <div className="py-24 text-center space-y-4">
            <p className="font-serif text-lg text-neutral-500">Aucune pièce ne correspond à vos critères de sélection.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSelectedSizeFilter(null); }}
              className="text-xs uppercase tracking-widest font-semibold underline underline-offset-4 text-black"
            >
              Afficher toute la collection SPRING 26
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
