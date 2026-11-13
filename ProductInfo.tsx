import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Check } from 'lucide-react';
import type { Product } from '../data/products';
import { useShop } from '../context/ShopContext';

interface ProductInfoProps {
  product: Product;
  onGoToCheckout?: () => void;
  className?: string;
}

type TabType = 'desc' | 'fit' | 'material' | 'care';

export const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  onGoToCheckout,
  className = '',
}) => {
  const { formatPrice, addToCart, setIsCartOpen } = useShop();

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'S');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0]?.name || '');
  const [activeTab, setActiveTab] = useState<TabType>('desc');
  const [isAdded, setIsAdded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('product', product.id);
    navigator.clipboard.writeText(url.toString());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2400);
  };

  const handleAddToCart = () => {
    if (product.isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };

  const handleBuyNow = () => {
    if (product.isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, 1, false);
    setIsCartOpen(false);
    if (onGoToCheckout) {
      onGoToCheckout();
    }
  };

  const tabs: Array<{ id: TabType; label: string }> = [
    { id: 'desc', label: 'DESCRIPTION' },
    { id: 'fit', label: 'SIZE & FIT' },
    { id: 'material', label: 'MATERIAL' },
    { id: 'care', label: 'CARE' },
  ];

  return (
    /* -----------------------------------------------------------------
       5. السلوك المثبت على الشاشات الكبيرة (Sticky Behavior on Desktop):
       lg:sticky lg:top-24 lg:h-fit
       يحافظ على ثبات لوحة معلومات المنتج بجانب المعرض أثناء التمرير
       ----------------------------------------------------------------- */
    <div
      className={`w-full bg-white px-4 sm:px-6 md:px-10 lg:px-12 py-5 lg:py-8 lg:sticky lg:top-24 lg:h-fit select-none font-sans ${className}`}
    >
      {/* -----------------------------------------------------------------
         1. الحركات الأولية المتتالية (Initial Staggered Animations):
         - فتات الخبز (Breadcrumbs): DM Sans، حجم صغير (10px على الموبايل، 11px على الديسكتوب)، tracking واسع، uppercase
         ----------------------------------------------------------------- */}
      <motion.nav
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center space-x-2 font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-neutral-400 mb-3"
      >
        <span>Accueil</span>
        <span>/</span>
        <span>{product.categoryLabel || 'Collection'}</span>
        <span>/</span>
        <span className="text-black font-medium line-clamp-1">{product.name}</span>
      </motion.nav>

      {/* الرأس: اسم المنتج، السعر والشارة */}
      <div className="space-y-2 pb-5 border-b border-neutral-100">
        <div className="flex items-start justify-between gap-4">
          {/* - عنوان المنتج (Product Title): Playfair Display (Mobile 28px, Tablet 32px, Desktop 40px) */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-[26px] sm:text-[28px] md:text-[32px] lg:text-[40px] font-normal text-black tracking-[-0.02em] leading-[1.15]"
          >
            {product.name}
          </motion.h1>

          {product.isOutOfStock ? (
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase bg-neutral-900 text-neutral-200 border border-neutral-700 px-2.5 py-1 shrink-0"
            >
              ÉPUISÉ · OUT OF STOCK
            </motion.span>
          ) : product.tag ? (
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="font-sans text-[10px] font-semibold tracking-[0.2em] uppercase bg-black text-white px-2.5 py-1 shrink-0"
            >
              {product.tag}
            </motion.span>
          ) : null}
        </div>

        {/* - السعر (Price) وحالة المخزون */}
        <div className="flex flex-wrap items-center gap-3">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`font-sans text-[20px] sm:text-[22px] md:text-[24px] font-light tracking-[0.06em] ${
              product.isOutOfStock ? 'text-neutral-400 line-through' : 'text-black'
            }`}
          >
            {formatPrice(product.priceDZD, product.priceEUR, product.priceUSD)}
          </motion.p>
          {product.isOutOfStock && (
            <span className="text-[11px] font-medium tracking-wider uppercase text-neutral-800 bg-neutral-100 border border-neutral-300 px-2.5 py-0.5 font-sans">
              Victime de son succès (نفذت الكمية)
            </span>
          )}
        </div>
      </div>

      {/* خيارات الألوان (Color Swatches) إن وجدت */}
      {product.colors && product.colors.length > 0 && (
        <div className="py-4 border-b border-neutral-100 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-600">
            <span className="uppercase tracking-wider text-[11px] font-medium text-neutral-400">
              Couleur
            </span>
            <span className="font-medium text-black">{selectedColor}</span>
          </div>
          <div className="flex items-center space-x-2.5">
            {product.colors.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedColor(c.name)}
                className={`w-8 h-8 rounded-full transition-all cursor-pointer p-0.5 border-2 ${
                  selectedColor === c.name
                    ? 'border-black scale-105'
                    : 'border-transparent hover:border-neutral-300'
                }`}
                title={c.name}
              >
                {c.img ? (
                  <img
                    src={c.img}
                    alt={c.name}
                    loading="lazy"
                    decoding="async"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span
                    className="w-full h-full block rounded-full border border-black/10"
                    style={{ backgroundColor: c.hex }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* -----------------------------------------------------------------
         2. محدد المقاسات المحسن (Size Selector Enhancement):
         - أزرار دائرية: w-12 h-12, rounded-full, border-2
         - المقاس المختار: خلفية سوداء، نص أبيض
         - حركة انسيابية للزر المختار عبر layoutId و spring (stiffness: 300, damping: 30)
         - تفاعل الفأرة واللمس: whileHover={{ scale: 1.1 }}, whileTap={{ scale: 0.9 }}
         ----------------------------------------------------------------- */}
      {/* -----------------------------------------------------------------
         2. محدد المقاسات المحسن (Size Selector Enhancement):
         - عنوان "Sélectionner la taille": DM Sans، حجم صغير جداً (11px)، وزن 500، tracking واسع جداً، uppercase
         - أزرار المقاسات (S, M, L): DM Sans، حجم صغير (14px)، وزن 500
         ----------------------------------------------------------------- */}
      <div className="py-5 border-b border-neutral-100 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-sans text-[11px] font-medium tracking-[0.2em] uppercase text-neutral-400">
            Sélectionner la Taille
          </span>
          <button
            onClick={() =>
              alert(
                'Guide des tailles Maison FREMKYS :\nXS = 34 FR\nS = 36 FR\nM = 38 FR\nL = 40 FR\nXL = 42 FR'
              )
            }
            className="font-sans text-[11px] font-medium text-neutral-500 hover:text-black transition-colors duration-200 hover:underline underline-offset-4 cursor-pointer uppercase tracking-wider"
          >
            Guide des tailles
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {product.sizes.map((size) => {
            const isSelected = selectedSize === size;

            return (
              <motion.button
                key={size}
                onClick={() => setSelectedSize(size)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className={`relative min-w-[44px] min-h-[44px] w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center font-sans text-[13px] sm:text-[14px] font-medium uppercase cursor-pointer select-none transition-colors duration-200 ${
                  isSelected
                    ? 'border-black text-white'
                    : 'border-neutral-200 text-neutral-800 hover:border-neutral-400'
                }`}
              >
                {/* مؤشر الخلفية السوداء المتحرك بنعومة عبر layoutId */}
                {isSelected && (
                  <motion.div
                    layoutId="selected-size-indicator"
                    className="absolute inset-0 bg-black rounded-full -z-0"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{size}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* -----------------------------------------------------------------
         3. أزرار الشراء الفوري وإضافة إلى السلة:
         - زر "Commander": أسود مع توهج خفيف وفاخر (Black with subtle luxury glow)
         - زر "Ajouter au panier": أبيض مع إطار أنيق (White with crisp border)
         ----------------------------------------------------------------- */}
      <div className="py-5 space-y-3">
        {/* زر إتمام الطلب الفوري */}
        {product.isOutOfStock ? (
          <button
            disabled
            className="w-full h-[52px] min-h-[52px] bg-neutral-200 text-neutral-500 font-sans text-[12px] font-semibold tracking-[0.16em] uppercase rounded-none cursor-not-allowed flex items-center justify-center border border-neutral-300"
          >
            <span>Produit Épuisé · Victime de son succès</span>
          </button>
        ) : (
          <motion.button
            onClick={handleBuyNow}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="relative w-full h-[52px] min-h-[52px] bg-black text-white font-sans text-[12px] font-semibold tracking-[0.16em] uppercase rounded-none cursor-pointer flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.32)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.48)] hover:bg-neutral-900 transition-all duration-300 border border-neutral-800"
          >
            <span>Commander · Paiement à la livraison</span>
          </motion.button>
        )}

        {/* زر إضافة إلى السلة */}
        {product.isOutOfStock ? (
          <button
            disabled
            className="w-full h-[48px] min-h-[48px] bg-neutral-100 text-neutral-400 font-sans text-[12px] font-medium tracking-[0.15em] uppercase rounded-none cursor-not-allowed flex items-center justify-center border border-neutral-200"
          >
            <span>Non disponible pour le moment (نفذ من المخزون)</span>
          </button>
        ) : (
          <motion.button
            onClick={handleAddToCart}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="relative w-full h-[48px] min-h-[48px] bg-white hover:bg-neutral-50 text-black font-sans text-[12px] font-medium tracking-[0.15em] uppercase rounded-none cursor-pointer overflow-hidden flex items-center justify-center border border-neutral-300 hover:border-black transition-all duration-200"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isAdded ? (
                <motion.span
                  key="added"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="flex items-center space-x-2 text-emerald-600 font-semibold"
                >
                  <span className="text-sm">✓</span>
                  <span>Ajouté au panier</span>
                </motion.span>
              ) : (
                <motion.span
                  key="default"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="flex items-center space-x-2"
                >
                  <span>Ajouter au panier</span>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )}

        {/* زر نسخ / مشاركة رابط المنتج الفريد */}
        <button
          type="button"
          onClick={handleCopyLink}
          className="w-full py-2.5 text-neutral-500 hover:text-black hover:border-black text-[11px] font-sans tracking-[0.16em] uppercase transition-all flex items-center justify-center space-x-2 space-x-reverse cursor-pointer border border-neutral-200 bg-white"
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-bold">تم نسخ رابط المنتج بنجاح!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>نسخ رابط المنتج لمشاركته</span>
            </>
          )}
        </button>
      </div>

      {/* -----------------------------------------------------------------
         4. التبويبات التفاعلية (Tabs Animation):
         - Tabs: DM Sans، حجم 11px، horizontal scroll على الموبايل لمنع أي انكسار
         - نص الوصف: DM Sans، حجم 14px، line-height مريح (1.6)
         ----------------------------------------------------------------- */}
      <div className="pt-2 border-t border-neutral-100">
        {/* عناوين التبويبات مع خاصية التمرير الأفقي للشاشات الصغيرة */}
        <div className="flex items-center space-x-5 sm:space-x-6 border-b border-neutral-200 font-sans text-[11px] font-medium tracking-[0.18em] uppercase overflow-x-auto no-scrollbar whitespace-nowrap pb-0.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative pb-2.5 transition-colors cursor-pointer select-none shrink-0 min-h-[36px] flex items-center ${
                  isActive ? 'text-black font-medium' : 'text-neutral-400 hover:text-black font-normal'
                }`}
              >
                <span>{tab.label}</span>

                {/* مؤشر الخط السفلي المتحرك بنعومة عبر layoutId */}
                {isActive && (
                  <motion.div
                    layoutId="active-tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-black"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* محتوى التبويب مع حركة الدخول والتلاشي */}
        <div className="pt-4 min-h-[90px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="font-sans text-[14px] font-normal leading-[1.6] text-neutral-700 space-y-2"
            >
              {activeTab === 'desc' && (
                <>
                  <p className="text-neutral-700">{product.description}</p>
                  <p className="text-neutral-500 font-light">{product.sizeFit}</p>
                </>
              )}
              {activeTab === 'fit' && (
                <p className="text-neutral-700">{product.sizeFit}</p>
              )}
              {activeTab === 'material' && (
                <p className="text-neutral-700">{product.material}</p>
              )}
              {activeTab === 'care' && (
                <p className="text-neutral-700">{product.care}</p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* -----------------------------------------------------------------
         5. الروابط السفلية (Bottom Links):
         - DM Sans، حجم صغير (10px على الموبايل، 11px على الديسكتوب)، متجاوبة بالكامل
         ----------------------------------------------------------------- */}
      <div className="pt-5 mt-4 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-2.5 font-sans text-[10px] sm:text-[11px] font-medium tracking-[0.16em] uppercase text-neutral-500">
        <a
          href="https://wa.me/213774296525?text=Bonjour%20Maison%20FREMKYS,%20j'ai%20besoin%20d'aide."
          target="_blank"
          rel="noreferrer"
          className="text-neutral-500 hover:text-black transition-colors duration-200 hover:underline underline-offset-4 cursor-pointer py-1 min-h-[40px] flex items-center"
        >
          NEED HELP?
        </a>

        <button
          onClick={() =>
            alert(
              'Livraison offerte & Colis vérifiable à domicile sur les 58 Wilayas d’Algérie.'
            )
          }
          className="text-neutral-500 hover:text-black transition-colors duration-200 hover:underline underline-offset-4 cursor-pointer uppercase py-1 min-h-[40px] flex items-center"
        >
          LIVRAISON 58 WILAYAS
        </button>

        <span className="text-neutral-500 hover:text-black transition-colors duration-200 hover:underline underline-offset-4 cursor-pointer py-1 min-h-[40px] flex items-center">
          RETOURS 7 JOURS
        </span>
      </div>
    </div>
  );
};
