import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Plus } from 'lucide-react';
import type { Product } from '../data/products';
import { useShop } from '../context/ShopContext';
import { isVideoMedia } from '../lib/supabase';

interface ShopTheLookProps {
  currentProductId?: string;
  products?: Product[];
  onSelectProduct?: (product: Product) => void;
  className?: string;
}

export const ShopTheLook: React.FC<ShopTheLookProps> = ({
  currentProductId,
  products: propProducts,
  onSelectProduct,
  className = '',
}) => {
  const { formatPrice, addToCart, products: shopProducts } = useShop();
  const [addedItemId, setAddedItemId] = useState<string | null>(null);

  // استخدام المنتجات الحالية الحقيقية من قاعدة البيانات (Supabase)
  const sourceProducts = (propProducts && propProducts.length > 0 ? propProducts : shopProducts) || [];

  // استبعاد المنتج المعروض حالياً حتى لا يقترح المتجر نفس المنتج الذي يشاهده العميل
  const availableProducts = sourceProducts.filter(
    (p) => String(p.id).toLowerCase() !== String(currentProductId || '').toLowerCase()
  );

  // اختيار أحدث 3 منتجات تمت إضافتها إلى الموقع
  const lookProducts: Product[] = availableProducts
    .slice()
    .sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    })
    .slice(0, 3);

  // إذا لم تتوفر منتجات، لا يتم عرض القسم نهائياً لمنع ظهور مساحة فارغة أو بيانات قديمة
  if (!lookProducts || lookProducts.length === 0) {
    return null;
  }

  // -----------------------------------------------------------------
  // 2. إعدادات الحركة المتتالية للبطاقات (Product Cards Stagger Animation):
  // -----------------------------------------------------------------
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const handleQuickAdd = (e: React.MouseEvent, item: Product) => {
    e.stopPropagation();
    if (item.isOutOfStock) return;
    addToCart(item, item.sizes[0] || 'S', item.colors?.[0]?.name);
    setAddedItemId(item.id);
    setTimeout(() => setAddedItemId(null), 2000);
  };

  return (
    <section className={`w-full max-w-[1580px] mx-auto px-4 sm:px-10 md:px-14 lg:px-16 pt-12 md:pt-20 pb-16 md:pb-24 ${className}`}>
      {/* -----------------------------------------------------------------
         1. حركة عنوان القسم (Section Title Animation)
         ----------------------------------------------------------------- */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-8 md:mb-12"
      >
        <span className="font-sans text-[11px] font-medium tracking-[0.3em] uppercase text-neutral-400 block mb-1.5">
          Compléter le vestiaire
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-normal tracking-[-0.02em] leading-[1.1] uppercase text-black">
          SHOP THE LOOK
        </h2>
      </motion.div>

      {/* -----------------------------------------------------------------
         2. شبكة المنتجات الثلاثة مع التتابع الزمني (Staggered Grid)
         ----------------------------------------------------------------- */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        {lookProducts.map((item) => (
          <motion.div
            key={item.id}
            variants={cardVariants}
            onClick={() => onSelectProduct && onSelectProduct(item)}
            className="group flex flex-col cursor-pointer"
          >
            {/* حاوية بطاقة المنتج */}
            <div className="relative aspect-[3/4] bg-[#FAF9F7] rounded-lg overflow-hidden flex items-center justify-center p-4 sm:p-6">
              {item.isOutOfStock && (
                <div className="absolute top-2.5 left-2.5 z-20 bg-black/90 text-white font-sans text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase px-2.5 py-1 backdrop-blur-xs shadow-sm">
                  Épuisé
                </div>
              )}

              {isVideoMedia(item.image) ? (
                <video
                  src={item.image}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="none"
                  width={400}
                  height={533}
                  className={`w-full h-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 ${item.isOutOfStock ? 'opacity-80' : ''}`}
                />
              ) : (
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  decoding="async"
                  width={400}
                  height={533}
                  className={`w-full h-full object-contain filter contrast-105 transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 ${item.isOutOfStock ? 'opacity-80' : ''}`}
                />
              )}

              {/* طبقة التعتيم الخفيفة عند التحويم */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />

              {/* زر الإضافة السريعة إلى السلة عند التحويم */}
              {item.isOutOfStock ? (
                <div className="absolute inset-x-4 bottom-4 py-2.5 bg-neutral-200/95 text-neutral-600 font-sans text-[11px] font-medium tracking-[0.15em] uppercase text-center opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all pointer-events-none shadow-xs">
                  Épuisé (نفذ)
                </div>
              ) : (
                <button
                  onClick={(e) => handleQuickAdd(e, item)}
                  className="absolute inset-x-4 bottom-4 py-3 bg-black text-white font-sans text-[12px] font-medium tracking-[0.15em] uppercase transition-all duration-300 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 flex items-center justify-center space-x-1.5 shadow-md hover:bg-neutral-800"
                >
                  {addedItemId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
                      <span>Ajouté</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter au panier</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* تفاصيل المنتج: الاسم والسعر */}
            <div className="mt-3.5 space-y-1">
              <h3 className="font-sans text-[14px] font-normal text-black transition-colors duration-300 group-hover:text-gray-600 tracking-tight leading-snug line-clamp-1">
                {item.name}
              </h3>

              <div className="flex items-center justify-between">
                <p className={`font-sans text-[14px] font-normal tracking-tight ${item.isOutOfStock ? 'text-neutral-400 line-through' : 'text-neutral-500'}`}>
                  {formatPrice(item.priceDZD, item.priceEUR, item.priceUSD)}
                </p>
                {item.isOutOfStock && (
                  <span className="text-[10px] text-neutral-800 font-sans tracking-wider uppercase font-semibold bg-neutral-100 px-1.5 py-0.5 border border-neutral-200">
                    نفذ
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
