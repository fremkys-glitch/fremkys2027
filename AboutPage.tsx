import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

interface AboutPageProps {
  onBackToHome: () => void;
  onGoToShop: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBackToHome, onGoToShop }) => {
  return (
    <div className="w-full min-h-screen bg-white text-[#111827] pt-24 sm:pt-28 pb-16 px-4 sm:px-6 md:px-10 flex flex-col justify-between select-none">
      <div className="max-w-[1440px] w-full mx-auto">
        
        {/* زر العودة للصفحة الرئيسية */}
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="group inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-medium text-neutral-500 hover:text-black transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span>Back to home</span>
          </button>

          <button
            onClick={onGoToShop}
            className="hidden sm:inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-medium text-neutral-700 hover:text-black transition-colors cursor-pointer"
          >
            <span>Explore Boutique</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* القسم الرئيسي: صورة واحدة عريضة وكبيرة مع الأعمدة الثلاثة في الأسفل (مطابق للصورة تماماً) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full min-h-[580px] h-auto md:h-[84vh] overflow-hidden rounded-2xl md:rounded-3xl bg-neutral-900 shadow-xl flex flex-col justify-end"
        >
          {/* الصورة الوحيدة في القسم (بدون أي صور إضافية) */}
          <motion.img
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            src="/images/footer_editorial.webp"
            alt="Maison FREMKYS - Founded in Algiers"
            loading="lazy"
            decoding="async"
            width={1600}
            height={900}
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.92]"
          />

          {/* تدرج لوني داكن وناعم أسفل الصورة لتوضيح وقراءة النصوص */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none" />

          {/* الأعمدة الثلاثة الموضعة في أسفل الصورة: OUR MISSION, OUR MATERIALS, OUR NAME */}
          <div className="relative z-10 w-full p-6 sm:p-10 md:p-14 lg:p-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16 text-white">
              
              {/* العمود الأول: OUR MISSION */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-2.5"
              >
                <h3 className="text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-white/95">
                  OUR MISSION
                </h3>
                <div className="h-[1px] w-12 bg-white/30 my-2" />
                <p className="text-xs sm:text-[13px] text-white/80 leading-relaxed font-light">
                  FREMKYS has never been just a collection, but rather an attitude of care toward the craft and the modern woman. Founded in Algiers, our mission is to create enduring silhouettes that transcend seasonal noise.
                </p>
              </motion.div>

              {/* العمود الثاني: OUR MATERIALS */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="space-y-2.5"
              >
                <h3 className="text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-white/95">
                  OUR MATERIALS
                </h3>
                <div className="h-[1px] w-12 bg-white/30 my-2" />
                <p className="text-xs sm:text-[13px] text-white/80 leading-relaxed font-light">
                  From supple full-grain nappa leather to tailored wools, each fabric is selected for its noble touch and lasting permanence. We treat materiality with uncompromising dedication and tactile sensitivity.
                </p>
              </motion.div>

              {/* العمود الثالث: OUR NAME (تأسست في الجزائر) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="space-y-2.5"
              >
                <h3 className="text-xs sm:text-sm font-bold tracking-[0.25em] uppercase text-white/95">
                  OUR NAME
                </h3>
                <div className="h-[1px] w-12 bg-white/30 my-2" />
                <p className="text-xs sm:text-[13px] text-white/80 leading-relaxed font-light">
                  FREMKYS represents contemporary Algerian haute couture. Founded in Algiers, the maison creates an effortless uniform designed for everyday distinction, delivered with bespoke care across all 58 Wilayas.
                </p>
              </motion.div>

            </div>
          </div>
        </motion.div>

        {/* زر التوجيه للجوال */}
        <div className="mt-8 text-center sm:hidden">
          <button
            onClick={onGoToShop}
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-semibold text-neutral-900 border-b border-black pb-1 cursor-pointer"
          >
            <span>Explore Boutique</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
