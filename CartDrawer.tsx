import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { isVideoMedia } from '../lib/supabase';

interface CartDrawerProps {
  onProceedToCheckout?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    formatPrice,
  } = useShop();

  if (!isCartOpen) return null;

  const totalItemsCount = cart.reduce((a, b) => a + b.quantity, 0);

  const handleProceed = () => {
    setIsCartOpen(false);
    if (onProceedToCheckout) {
      onProceedToCheckout();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-300">
      
      {/* Drawer Container */}
      <div className="relative w-full max-w-md md:max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-serif text-lg sm:text-xl uppercase tracking-wider font-medium text-neutral-900">
              Votre Panier
            </span>
            <span className="text-xs text-neutral-500 font-sans">
              ({totalItemsCount} {totalItemsCount > 1 ? 'pièces' : 'pièce'})
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Fermer le panier"
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-black hover:border-black transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body: Products list only (Clean, No delivery inputs) */}
        <div data-lenis-prevent className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="py-24 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="font-serif text-lg text-neutral-600">Votre panier est actuellement vide.</p>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                Ajoutez des pièces d'exception pour composer votre vestiaire.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 px-6 py-3 bg-black text-white text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Explorer la Collection
              </button>
            </div>
          ) : (
            <div className="space-y-4 divide-y divide-neutral-100">
              {cart.map((item) => (
                <div key={`${item.product.id}-${item.size}-${item.color}`} className="pt-4 first:pt-0 flex items-center space-x-4">
                  {/* Media Thumbnail */}
                  <div className="w-20 h-26 bg-[#FAF9F7] border border-neutral-200 shrink-0 overflow-hidden flex items-center justify-center">
                    {isVideoMedia(item.product.image) ? (
                      <video
                        src={item.product.image}
                        muted
                        playsInline
                        preload="none"
                        width={80}
                        height={104}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        loading="lazy"
                        decoding="async"
                        width={80}
                        height={104}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-neutral-900 truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Taille: <span className="font-semibold text-neutral-800">{item.size}</span>
                      {item.color && <span> &middot; {item.color}</span>}
                    </p>
                    <p className="text-xs font-semibold text-neutral-900 mt-1 font-mono">
                      {formatPrice(
                        item.product.priceDZD * item.quantity,
                        item.product.priceEUR * item.quantity,
                        item.product.priceUSD * item.quantity
                      )}
                    </p>

                    {/* Quantity controls & Delete */}
                    <div className="flex items-center space-x-3 mt-2.5">
                      <div className="flex items-center border border-neutral-200">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                          aria-label="Diminuer la quantité"
                          className="w-8 h-8 min-w-[32px] min-h-[32px] flex items-center justify-center text-neutral-600 hover:text-black transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-medium font-mono">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                          aria-label="Augmenter la quantité"
                          className="w-8 h-8 min-w-[32px] min-h-[32px] flex items-center justify-center text-neutral-600 hover:text-black transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id, item.size)}
                        className="text-neutral-400 hover:text-red-600 transition-colors p-2 min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
                        title="Supprimer"
                        aria-label="Supprimer l'article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer / Checkout Actions */}
        {cart.length > 0 && (
          <div className="p-5 sm:p-6 border-t border-neutral-200 bg-[#FAF9F7] space-y-4">
            <div className="space-y-1.5 text-xs text-neutral-600">
              <div className="flex justify-between font-medium">
                <span>Sous-total (المجموع الفرعي)</span>
                <span className="text-black font-semibold font-mono text-sm">
                  {formatPrice(cartTotal.dzd, cartTotal.eur, cartTotal.usd)}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Frais de livraison calculés à l'étape suivante selon votre Wilaya.
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              {/* Direct Checkout Button */}
              <button
                onClick={handleProceed}
                className="w-full h-12 min-h-[48px] bg-black text-white text-xs uppercase tracking-[0.18em] font-semibold hover:bg-neutral-900 transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 space-x-reverse cursor-pointer"
              >
                <span>إتمام الطلب · Passer la commande</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Continue Shopping Button */}
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-full py-2 text-neutral-500 hover:text-black text-[11px] font-sans tracking-[0.14em] uppercase transition-colors cursor-pointer text-center"
              >
                Continuer vos achats
              </button>
            </div>

            <div className="pt-2 border-t border-neutral-200/60 flex items-center justify-center space-x-1.5 text-[11px] text-neutral-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Paiement à la livraison · Colis vérifiable (58 Wilayas)</span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
