import React from 'react';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import type { Product } from '../data/products';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (p: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const { formatPrice, addToCart, products } = useShop();

  if (!isOpen) return null;

  // Curated favorite items to display when opened
  const wishlistItems = (products || []).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl text-neutral-900 uppercase tracking-wider">
              Vos Favoris
            </h3>
            <span className="text-xs text-neutral-400 font-light">
              Maison FREMKYS
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Fermer les favoris"
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black hover:border-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body List */}
        <div data-lenis-prevent className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-neutral-100">
          {wishlistItems.map((item) => (
            <div key={item.id} className="pt-4 flex items-center space-x-4 group">
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                decoding="async"
                width={64}
                height={80}
                className="w-16 h-20 object-contain bg-neutral-100 mix-blend-multiply border border-neutral-200 shrink-0 cursor-pointer"
                onClick={() => {
                  onSelectProduct(item);
                  onClose();
                }}
              />

              <div className="flex-1 min-w-0">
                <h4
                  onClick={() => {
                    onSelectProduct(item);
                    onClose();
                  }}
                  className="text-xs font-medium text-neutral-900 truncate hover:underline cursor-pointer"
                >
                  {item.name}
                </h4>
                <p className="text-xs font-semibold text-neutral-900 mt-1">
                  {formatPrice(item.priceDZD, item.priceEUR, item.priceUSD)}
                </p>

                <div className="mt-2.5 flex items-center space-x-2">
                  <button
                    onClick={() => {
                      addToCart(item, item.sizes[0]);
                      onClose();
                    }}
                    className="px-3.5 py-2 min-h-[40px] bg-black text-white text-[11px] uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center space-x-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Ajouter</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-200 bg-neutral-50">
          <button
            onClick={onClose}
            className="w-full h-12 min-h-[48px] bg-white text-black border border-neutral-300 text-xs uppercase tracking-widest font-semibold hover:border-black transition-colors"
          >
            Continuer la navigation
          </button>
        </div>

      </div>
    </div>
  );
};
