import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '../data/products';

export interface GalleryMediaItem {
  id?: string | number;
  type: 'image' | 'video';
  url: string;
  poster?: string;
  alt?: string;
}

interface ProductGalleryProps {
  product?: Product;
  media?: (string | GalleryMediaItem)[];
  className?: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  product,
  media,
  className = '',
}) => {
  // تجميع الوسائط من بيانات المنتج الحالية أو عبر مصفوفة الوسائط المخصصة
  const rawItems: (string | GalleryMediaItem)[] = media || (product ? (
    product.galleryImages && product.galleryImages.length > 0
      ? product.galleryImages.map((url, idx) => ({
          type: /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url) || url.includes('video') ? ('video' as const) : ('image' as const),
          url,
          alt: `${product.name} - Vue ${idx + 1}`,
        }))
      : [
          {
            type: 'image',
            url: product.editorialImage || product.image,
            alt: `${product.name} - Vue éditoriale`,
          },
          {
            type: 'image',
            url: product.image,
            alt: `${product.name} - Vue studio`,
          },
          ...(product.shopTheLook?.modelImg ? [{
            type: 'image' as const,
            url: product.shopTheLook.modelImg,
            alt: `${product.name} - Porté mannequin`,
          }] : []),
          ...(product.colors?.filter((c) => c.img).map((c) => ({
            type: 'image' as const,
            url: c.img!,
            alt: `${product.name} - ${c.name}`,
          })) || []),
        ]
  ) : [
    { type: 'image', url: '/images/jacket_editorial.webp', alt: 'FREMKYS Éditorial' },
    { type: 'image', url: '/images/jacket_cutout.webp', alt: 'FREMKYS Pièce' },
  ]);

  // توحيد بنية الوسائط وفحص صيغ الفيديو تلقائياً (.mp4, .webm)
  const items: GalleryMediaItem[] = rawItems.map((item, idx) => {
    if (typeof item === 'string') {
      const isVideo = /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(item) || item.includes('video');
      return {
        id: idx,
        type: isVideo ? 'video' : 'image',
        url: item,
        poster: product?.editorialImage || product?.image,
        alt: product?.name || 'FREMKYS Media',
      };
    }
    return {
      id: item.id || idx,
      ...item,
    };
  });

  const [activeIndex, setActiveIndex] = useState(0);

  // -----------------------------------------------------------------
  // 2. حركة التكبير التفاعلي (Zoom on Hover):
  // تتبع إحداثيات مؤشر الفأرة ونسبتها المئوية لتحريك transform-origin
  // -----------------------------------------------------------------
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => {
    setIsZoomed(false);
    setZoomOrigin({ x: 50, y: 50 });
  };

  const currentMedia = items[activeIndex] || items[0];

  return (
    /* -----------------------------------------------------------------
       6. حركة تحميل الصفحة (Page Load Animation):
       تدفق المعرض من اليسار مع التلاشي: x: -50 -> 0, opacity: 0 -> 1 مدة 1s
       ----------------------------------------------------------------- */
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className={`w-full flex flex-col-reverse md:flex-row gap-4 lg:gap-6 items-start ${className}`}
    >
      {/* -----------------------------------------------------------------
         1. تحسين التخطيط (Layout Improvement - Thumbnails Column):
         - على الحاسوب (Desktop): عمود الصور المصغرة على اليسار بعرض 80px (w-20)
         - على الهاتف (Mobile): أسفل الصورة الرئيسية مع تمرير أفقي
         ----------------------------------------------------------------- */}
      <div className="w-full md:w-20 shrink-0 flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar py-1">
        {items.map((thumb, idx) => {
          const isActive = activeIndex === idx;

          return (
            /* -----------------------------------------------------------------
               3. حركات الصور المصغرة (Thumbnail Animations):
               - تكبير عند التمرير: whileHover={{ scale: 1.05 }}
               - ضغط عند النقر: whileTap={{ scale: 0.95 }}
               - الإطار الأسود الفعال: layoutId="active-thumb-indicator"
               ----------------------------------------------------------------- */
            <motion.button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative w-16 h-20 sm:w-20 sm:h-24 md:w-20 md:h-24 rounded-lg overflow-hidden shrink-0 cursor-pointer bg-[#F2F1ED] transition-colors border-2 ${
                isActive
                  ? 'border-transparent'
                  : 'border-transparent hover:border-neutral-300'
              }`}
              title={thumb.alt || `Vue ${idx + 1}`}
              aria-label={`Afficher l'image ${idx + 1}`}
            >
              {thumb.type === 'video' ? (
                <div className="relative w-full h-full flex items-center justify-center bg-neutral-900">
                  {thumb.poster ? (
                    <img
                      src={thumb.poster}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      width={100}
                      height={133}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-[10px]">VIDEO</span>
                  )}
                  {/* شارة فيديو صغيرة على الصورة المصغرة */}
                  <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[8px] px-1 py-0.5 rounded-xs">
                    ▶
                  </span>
                </div>
              ) : (
                <img
                  src={thumb.url}
                  alt={thumb.alt || ''}
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                  width={100}
                  height={133}
                />
              )}

              {/* إطار التحديد الأسود المتحرك بنعومة عبر layoutId */}
              {isActive && (
                <motion.div
                  layoutId="active-thumb-indicator"
                  className="absolute inset-0 border-2 border-black rounded-lg pointer-events-none"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* -----------------------------------------------------------------
         1. الحاوية الرئيسية للصورة/الفيديو (Main Image/Video Container):
         - تشغل المساحة المتبقية (flex-1)
         - زوايا مستديرة ناعمة rounded-2xl مع قص الحواف overflow-hidden
         - تفعيل أحداث التكبير (onMouseMove, onMouseEnter, onMouseLeave)
         ----------------------------------------------------------------- */}
      <div
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="flex-1 relative aspect-[3/4] w-full bg-[#EBE9E4] rounded-2xl overflow-hidden shadow-xs cursor-crosshair select-none"
      >
        {/* -----------------------------------------------------------------
           2. شارة التكبير (Zoom Badge):
           تظهر في الزاوية العلوية اليمنى عند تحويم الفأرة فوق الصورة
           ----------------------------------------------------------------- */}
        <AnimatePresence>
          {isZoomed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.2 }}
              className="absolute top-4 right-4 z-20 bg-black/75 backdrop-blur-md text-white text-[11px] font-sans font-medium tracking-wider uppercase px-3 py-1.5 rounded-full shadow-lg flex items-center space-x-1.5 pointer-events-none"
            >
              <span>🔍 Zoom</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* -----------------------------------------------------------------
           4. انتقال الصور والفيديو (Image/Video Transitions via AnimatePresence):
           - خروج الصورة السابقة: opacity: 0, scale: 0.95
           - دخول الصورة الجديدة: opacity: 1, scale: 1
           - مدة الانتقال: 0.6s مع منحنى power3.out ([0.22, 1, 0.36, 1])
           ----------------------------------------------------------------- */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full flex items-center justify-center overflow-hidden"
          >
            {/* -----------------------------------------------------------------
               5. دعم الفيديو (Video Support):
               تشغيل تلقائي، تكرار مستمر، كتم الصوت، ملائمة الهاتف، وصورة بديلة
               ----------------------------------------------------------------- */}
            {currentMedia.type === 'video' ? (
              <video
                src={currentMedia.url}
                poster={currentMedia.poster}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
                style={{
                  transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                  transform: isZoomed ? 'scale(1.5)' : 'scale(1)',
                  transition: isZoomed
                    ? 'transform 0.1s ease-out'
                    : 'transform 0.3s ease-out',
                }}
              />
            ) : (
              <img
                src={currentMedia.url}
                alt={currentMedia.alt || 'FREMKYS Haute Confection'}
                loading="eager"
                decoding="async"
                width={800}
                height={1067}
                className="w-full h-full object-cover object-center"
                style={{
                  transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                  transform: isZoomed ? 'scale(1.5)' : 'scale(1)',
                  transition: isZoomed
                    ? 'transform 0.1s ease-out'
                    : 'transform 0.3s ease-out',
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
