import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2 } from 'lucide-react';

interface Review {
  id: string;
  badge: string;
  quote: string;
  author: string;
  initial: string;
  city?: string;
}

const REVIEWS: Review[] = [
  {
    id: '01',
    badge: 'Avis 01',
    quote: "La qualité ta3 le tissu vraiment chaba, w la coupe jatni parfaite. Simple, chic w tban qualité ta3ha. Rani très satisfaite de mon achat.",
    author: 'Sarah B.',
    initial: 'S',
    city: 'Alger',
  },
  {
    id: '02',
    badge: 'Avis 02',
    quote: "Franchement j'ai adoré ! Le modèle yji élégant bezaf, w t9adri tlabsih f plusieurs occasions. Même la finition ta3 le vêtement top.",
    author: 'Yasmine K.',
    initial: 'Y',
    city: 'Oran',
  },
  {
    id: '03',
    badge: 'Avis 03',
    quote: "Très belle expérience, le vêtement kif ma kont nestna w même mieux. Style intemporel w qualité tbeyen. أكيد نعاود نكوموندي من عندكم.",
    author: 'Lina M.',
    initial: 'L',
    city: 'Constantine',
  },
];

export const CustomerReviews: React.FC = () => {
  return (
    <section className="w-full bg-[#FAF9F6] py-12 sm:py-16 md:py-24 px-4 sm:px-6 md:px-12 border-t border-b border-neutral-200/60 select-none">
      <div className="max-w-[1240px] mx-auto">
        
        {/* عنوان القسم مطابق للصورة (Mobile 28px, Desktop 34px) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-neutral-400 font-semibold block mb-2">
            Témoignages &middot; Maison FREMKYS
          </span>
          <h2 className="text-[24px] sm:text-[28px] md:text-[34px] font-bold text-neutral-900 tracking-tight">
            What Our Customers Say
          </h2>
        </motion.div>

        {/* شبكة البطاقات الثلاث - مطابقة للصورة تماماً */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {REVIEWS.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-7 sm:p-8 border border-neutral-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* النجوم الخمسة الذهبية مع وسم التقييم */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-[#FBBF24] text-[#FBBF24]"
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-mono tracking-wider text-neutral-400 uppercase font-medium">
                    {review.badge}
                  </span>
                </div>

                {/* نص التقييم بالعامية الجزائرية والفرنسية كما طلب العميل */}
                <p className="text-neutral-700 text-sm sm:text-[14.5px] leading-relaxed font-normal mb-8">
                  &ldquo;{review.quote}&rdquo;
                </p>
              </div>

              {/* بيانات صاحبة التقييم: أيقونة دائرية رمادية بالحرف الأول + الاسم */}
              <div className="flex items-center pt-4 border-t border-neutral-100">
                <div className="w-10 h-10 rounded-full bg-[#E5E7EB] text-[#4B5563] font-semibold text-sm flex items-center justify-center shrink-0 mr-3">
                  {review.initial}
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-sm font-semibold text-neutral-900">
                      {review.author}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400" />
                  </div>
                  <span className="text-[11px] text-neutral-400 font-light block">
                    Achat vérifié &middot; {review.city}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
