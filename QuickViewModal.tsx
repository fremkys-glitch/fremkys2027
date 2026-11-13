import React, { useState } from 'react';
import { X, Check, HelpCircle, Truck, Ruler, Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, formatPrice, addToCart, products } = useShop();
  
  if (!quickViewProduct) return null;

  const [selectedSize, setSelectedSize] = useState<string>(quickViewProduct.sizes[0] || 'S');
  const [selectedColor, setSelectedColor] = useState<string>(quickViewProduct.colors?.[0]?.name || '');
  const [activeTab, setActiveTab] = useState<'desc' | 'fit' | 'material' | 'care'>('desc');
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    if (quickViewProduct.isOutOfStock) return;
    addToCart(quickViewProduct, selectedSize, selectedColor);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setQuickViewProduct(null);
    }, 900);
  };

  const complementaryProducts = (products || [])
    .filter(p => String(p.id).toLowerCase() !== String(quickViewProduct.id).toLowerCase())
    .slice(0, 3);

  return (
    <div data-lenis-prevent className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-8 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-white shadow-2xl border border-neutral-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Close Button (44x44px touch target) */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-3 right-3 z-20 w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-white/90 border border-neutral-200 flex items-center justify-center text-neutral-800 hover:bg-black hover:text-white transition-colors cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>

        <div data-lenis-prevent className="overflow-y-auto flex-1 p-5 sm:p-6 md:p-10">
          
          {/* Main Split Section (Matches Reference Images media_1790778631161.png & media_1790778655999.png) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
            
            {/* Left Editorial Column */}
            <div className="md:col-span-6 space-y-4">
              <div className="relative aspect-[3/4] bg-[#F2F1ED] overflow-hidden">
                <img
                  src={quickViewProduct.editorialImage || quickViewProduct.image}
                  alt={quickViewProduct.name}
                  loading="lazy"
                  decoding="async"
                  width={600}
                  height={800}
                  className="w-full h-full object-cover object-center"
                />
                <span className="absolute top-3 left-3 text-[10px] tracking-[0.25em] uppercase bg-black text-white px-2 py-1 font-medium">
                  FREMKYS ÉDITORIAL
                </span>
              </div>
            </div>

            {/* Right Product Details Column */}
            <div className="md:col-span-6 flex flex-col">
              
              {/* Header Title, Price & Tag */}
              <div className="flex items-start justify-between pb-4 border-b border-neutral-200">
                <div>
                  <h3 className="font-serif text-2xl md:text-3xl text-neutral-900 font-normal tracking-tight">
                    {quickViewProduct.name}
                  </h3>
                  <div className="flex items-center space-x-3 mt-1">
                    <p className={`text-lg font-medium ${quickViewProduct.isOutOfStock ? 'text-neutral-400 line-through' : 'text-neutral-900'}`}>
                      {formatPrice(quickViewProduct.priceDZD, quickViewProduct.priceEUR, quickViewProduct.priceUSD)}
                    </p>
                    {quickViewProduct.isOutOfStock && (
                      <span className="text-[10px] font-semibold tracking-wider uppercase text-neutral-800 bg-neutral-100 border border-neutral-300 px-2 py-0.5">
                        Victime de son succès (نفذت الكمية)
                      </span>
                    )}
                  </div>
                </div>
                {quickViewProduct.isOutOfStock ? (
                  <span className="text-[11px] tracking-[0.2em] uppercase font-bold text-neutral-900 bg-neutral-200 px-2.5 py-1">
                    ÉPUISÉ
                  </span>
                ) : quickViewProduct.tag ? (
                  <span className="text-[11px] tracking-[0.2em] uppercase font-bold text-neutral-900">
                    {quickViewProduct.tag}
                  </span>
                ) : null}
              </div>

              {/* Isolated Silhouette Cutout Image */}
              <div className="py-4 flex justify-center">
                <div className="w-36 h-36 bg-[#F8F7F4] flex items-center justify-center p-2 border border-neutral-100">
                  <img
                    src={quickViewProduct.image}
                    alt={quickViewProduct.name}
                    loading="lazy"
                    decoding="async"
                    width={150}
                    height={150}
                    className="max-h-full object-contain mix-blend-multiply"
                  />
                </div>
              </div>

              {/* Color Swatches if available */}
              {quickViewProduct.colors && (
                <div className="mb-6">
                  <span className="text-[11px] tracking-[0.2em] uppercase text-neutral-500 font-medium block mb-2">
                    Teinte: <span className="text-black font-semibold">{selectedColor}</span>
                  </span>
                  <div className="flex items-center space-x-2.5">
                    {quickViewProduct.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-8 h-8 rounded-full border-2 transition-all p-0.5 min-w-[32px] min-h-[32px] cursor-pointer ${
                          selectedColor === c.name ? 'border-black scale-110' : 'border-transparent hover:border-neutral-300'
                        }`}
                        title={c.name}
                      >
                        <span
                          className="w-full h-full rounded-full block border border-neutral-300"
                          style={{ backgroundColor: c.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] tracking-[0.2em] uppercase text-neutral-500 font-medium">
                    Sélectionner la Taille
                  </span>
                  <button 
                    onClick={() => alert("Guide des tailles FREMKYS : Nos coupes suivent les standards français haute couture.")}
                    className="text-[11px] text-neutral-600 hover:text-black underline underline-offset-4 flex items-center space-x-1 cursor-pointer min-h-[36px]"
                  >
                    <Ruler className="w-3 h-3" />
                    <span>Guide des tailles</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {quickViewProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[44px] min-h-[44px] px-3.5 border text-xs tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center ${
                        selectedSize === size
                          ? 'border-black bg-black text-white font-medium shadow-xs'
                          : 'border-neutral-300 hover:border-neutral-600 text-neutral-800'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Big Solid Add to Cart Button (Height 52px for optimal touch target) */}
              {quickViewProduct.isOutOfStock ? (
                <button
                  disabled
                  className="w-full h-[52px] min-h-[52px] bg-neutral-200 text-neutral-400 text-[12px] tracking-[0.2em] uppercase font-semibold cursor-not-allowed flex items-center justify-center space-x-2 border border-neutral-300"
                >
                  <span>Épuisé · Victime de son succès (نفذت الكمية)</span>
                </button>
              ) : (
                <button
                  onClick={handleAdd}
                  className="w-full h-[52px] min-h-[52px] bg-black text-white text-[12px] tracking-[0.2em] uppercase font-semibold hover:bg-neutral-800 transition-colors shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Ajouté au Panier !</span>
                    </>
                  ) : (
                    <span>Ajouter au Panier</span>
                  )}
                </button>
              )}

              {/* Tab Navigation (DESCRIPTION, SIZE & FIT, MATERIAL, CARE) */}
              <div className="mt-8 border-b border-neutral-200 flex items-center space-x-6 text-[11px] tracking-[0.2em] uppercase font-semibold overflow-x-auto no-scrollbar whitespace-nowrap">
                <button
                  onClick={() => setActiveTab('desc')}
                  className={`pb-2.5 min-h-[36px] flex items-center transition-all cursor-pointer ${
                    activeTab === 'desc' ? 'border-b-2 border-black text-black' : 'text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('fit')}
                  className={`pb-2.5 min-h-[36px] flex items-center transition-all cursor-pointer ${
                    activeTab === 'fit' ? 'border-b-2 border-black text-black' : 'text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  Coupe & Taille
                </button>
                <button
                  onClick={() => setActiveTab('material')}
                  className={`pb-2.5 min-h-[36px] flex items-center transition-all cursor-pointer ${
                    activeTab === 'material' ? 'border-b-2 border-black text-black' : 'text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  Matière
                </button>
                <button
                  onClick={() => setActiveTab('care')}
                  className={`pb-2.5 min-h-[36px] flex items-center transition-all cursor-pointer ${
                    activeTab === 'care' ? 'border-b-2 border-black text-black' : 'text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  Entretien
                </button>
              </div>

              {/* Tab Contents */}
              <div className="py-4 text-[13px] leading-relaxed text-neutral-600 min-h-[90px]">
                {activeTab === 'desc' && <p>{quickViewProduct.description}</p>}
                {activeTab === 'fit' && <p>{quickViewProduct.sizeFit}</p>}
                {activeTab === 'material' && <p>{quickViewProduct.material}</p>}
                {activeTab === 'care' && <p>{quickViewProduct.care}</p>}
              </div>

              {/* Footer Benefits Bar (Matches reference bottom line) */}
              <div className="mt-auto pt-6 border-t border-neutral-100 flex items-center justify-between text-[11px] tracking-wider uppercase text-neutral-500 font-medium">
                <a
                  href="https://wa.me/213774296525?text=Bonjour%20Maison%20FREMKYS,%20j'ai%20besoin%20d'aide."
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-black flex items-center space-x-1 min-h-[36px]"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Besoin d'aide ? Concierge</span>
                </a>
                <span className="flex items-center space-x-1">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Livraison 58 Wilayas &middot; COD</span>
                </span>
              </div>

            </div>

          </div>

          {/* SHOP THE LOOK (Matches bottom of media_1790778655999.png) */}
          <div className="mt-14 pt-10 border-t border-neutral-200">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-neutral-900 block mb-6">
              COMPLÉTER LE LOOK &middot; SHOP THE LOOK
            </span>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {complementaryProducts.map(item => (
                <div
                  key={item.id}
                  onClick={() => setQuickViewProduct(item)}
                  className="group cursor-pointer border border-neutral-200/70 p-3 hover:border-black transition-all bg-[#FAF9F6]"
                >
                  <div className="aspect-square bg-white flex items-center justify-center p-2 mb-2 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                      width={120}
                      height={120}
                      className="max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h5 className="text-[12px] font-medium text-neutral-900 line-clamp-1 group-hover:underline">
                    {item.name}
                  </h5>
                  <p className="text-[11px] text-neutral-600 mt-0.5">
                    {formatPrice(item.priceDZD, item.priceEUR, item.priceUSD)}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
