import React, { useState } from 'react';
import { X, Search as SearchIcon, ArrowRight } from 'lucide-react';
import type { Product } from '../data/products';
import { useShop } from '../context/ShopContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { setQuickViewProduct, formatPrice, products } = useShop();
  const baseProducts = products;

  if (!isOpen) return null;

  const results = query.trim()
    ? baseProducts.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col justify-start items-center p-6 md:p-12 animate-in fade-in duration-200">
      
      {/* Close button (44x44px touch target) */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
        aria-label="Fermer"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Search Input Box */}
      <div className="w-full max-w-3xl mt-12 sm:mt-16">
        <div className="relative border-b-2 border-white/60 pb-3 flex items-center">
          <SearchIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white/50 mr-3 sm:mr-4 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Rechercher une pièce..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-lg sm:text-xl md:text-3xl text-white placeholder-white/30 focus:outline-none font-serif tracking-wide"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-white/60 hover:text-white text-xs uppercase tracking-widest min-h-[36px] px-2 cursor-pointer">
              Effacer
            </button>
          )}
        </div>

        {/* Quick Suggestion Tags */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-4 text-xs text-white/60">
          <span>Suggestions :</span>
          {['Veste en cuir', 'Jupe plissée', 'Velours', 'Souliers'].map((item) => (
            <button
              key={item}
              onClick={() => setQuery(item)}
              className="hover:text-white underline underline-offset-4 py-1 min-h-[36px] flex items-center cursor-pointer"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div data-lenis-prevent className="mt-10 overflow-y-auto max-h-[60vh] space-y-4">
          {query && results.length === 0 && (
            <p className="text-white/50 text-sm font-serif italic text-center py-8">
              Aucune pièce ne correspond à votre recherche "{query}".
            </p>
          )}

          {results.map((product) => (
            <div
              key={product.id}
              onClick={() => {
                setQuickViewProduct(product);
                onClose();
              }}
              className="flex items-center space-x-4 p-3 hover:bg-white/10 transition-colors cursor-pointer group rounded-xs"
            >
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
                decoding="async"
                width={64}
                height={80}
                className="w-16 h-20 object-cover bg-neutral-800"
              />
              <div className="flex-1">
                <h4 className="font-serif text-lg text-white group-hover:text-amber-300 transition-colors">
                  {product.name}
                </h4>
                <div className="flex items-center space-x-2 mt-1">
                  <p className={`text-xs ${product.isOutOfStock ? 'text-white/40 line-through' : 'text-white/60'}`}>
                    {formatPrice(product.priceDZD, product.priceEUR, product.priceUSD)}
                  </p>
                  {product.isOutOfStock && (
                    <span className="text-[10px] text-amber-300 font-sans tracking-wider uppercase font-semibold">
                      (Épuisé)
                    </span>
                  )}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
