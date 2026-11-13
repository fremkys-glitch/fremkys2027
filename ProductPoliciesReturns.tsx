import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, RefreshCw, ShieldCheck, Clock, ChevronDown, MessageCircle } from 'lucide-react';

interface ServiceItem {
  icon: React.ElementType;
  title: string;
  desc: React.ReactNode;
  badge: string;
}

const SERVICES: ServiceItem[] = [
  {
    icon: Truck,
    title: 'LIVRAISON 58 WILAYAS',
    desc: (
      <>
        Expédition express sécurisée en <strong className="text-black font-medium">24h à 48h</strong> à domicile partout en Algérie et dans le monde entier via nos partenaires logistiques certifiés.
      </>
    ),
    badge: 'Écrin signature sous scellé',
  },
  {
    icon: RefreshCw,
    title: 'ÉCHANGES SOUS 7 JOURS',
    desc: (
      <>
        Vous disposez de <strong className="text-black font-medium">7 jours</strong> pour essayer votre pièce et demander un échange de taille, de teinte ou un retour sans tracasserie.
      </>
    ),
    badge: 'Enlèvement à domicile',
  },
  {
    icon: ShieldCheck,
    title: 'PAIEMENT À LA LIVRAISON',
    desc: (
      <>
        Réglez en espèces à la réception بعد contrôle de votre commande, ou en ligne par <strong className="text-black font-medium">carte CIB / Edahabia</strong> et devises internationales.
      </>
    ),
    badge: "Certificat d'authenticité",
  },
  {
    icon: Clock,
    title: 'CONCIERGERIE 7J/7',
    desc: (
      <>
        Une équipe dédiée disponible 7j/7 pour vous renseigner sur le guide des tailles, organiser votre retour ou préparer une confection exclusive.
      </>
    ),
    badge: 'Assistance personnalisée',
  },
];

export const ProductPoliciesReturns: React.FC = () => {
  // -----------------------------------------------------------------
  // 2. التحكم في الأكورديون (Accordion Behavior):
  // فتح سؤال واحد فقط في كل مرة عبر useState
  // القيمة الابتدائية null ليكون كل شيء مغلقاً عند البداية
  // -----------------------------------------------------------------
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const faqs = [
    {
      q: "Comment demander un échange de taille ou un retour ?",
      a: "Il vous suffit d'envoyer un message à notre Conciergerie WhatsApp en indiquant votre nom et référence de commande. Notre équipe organise immédiatement l'enlèvement du colis à votre adresse sans démarche compliquée."
    },
    {
      q: "Quelles sont les conditions pour qu'une pièce soit acceptée en retour ?",
      a: "La pièce doit être non portée, non retouchée, dans son état d'origine impeccable, munie de son scellé et de ses étiquettes FREMKYS d'origine, accompagnée de son coffret protecteur."
    },
    {
      q: "Puis-je essayer le vêtement avant de payer le livreur ?",
      a: "Oui, parfaitement. En Algérie, notre protocole de livraison prestige permet l'essayage ou la vérification de la pièce avant le règlement en espèces au livreur."
    },
    {
      q: "Quels sont les délais et modalités de remboursement ?",
      a: "Dès réception et vérification de la pièce, le remboursement est opéré sous 24h à 48h, soit en espèces lors de la reprise, soit par virement bancaire / BaridiMob selon votre choix."
    }
  ];

  // إعدادات حركة ترويسة قسم السياسات
  const headerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const headerItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  // إعدادات تتابع بطاقات الخدمات الأربعة
  const cardsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardItemVariants = {
    hidden: { y: 40, scale: 0.95, opacity: 0 },
    visible: {
      y: 0,
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    hover: {
      y: -5,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  };

  const iconVariants = {
    initial: { rotate: 0, scale: 1 },
    hover: {
      rotate: 360,
      scale: 1.2,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  // -----------------------------------------------------------------
  // 5. إعدادات التتابع الزمني للأسئلة الشائعة (FAQ Items Stagger):
  // كل سؤال يصعد ويتلاشى للأعلى (y: 20 -> 0, opacity: 0 -> 1)
  // بفارق زمني 0.1s بين كل سؤال والآخر
  // -----------------------------------------------------------------
  const faqContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // فارق 0.1s بين الأسئلة
      },
    },
  };

  const faqItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section className="w-full bg-[#FAF9F7] border-t border-neutral-200/80 pt-12 md:pt-24 pb-14 md:pb-28 text-black select-none">
      <div className="max-w-[1580px] mx-auto px-4 sm:px-10 md:px-14 lg:px-16">
        
        {/* ترويسة قسم الالتزامات والسياسات */}
        <motion.div
          variants={headerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-10 md:mb-20"
        >
          <motion.span
            variants={headerItemVariants}
            className="font-sans text-[11px] font-medium tracking-[0.3em] uppercase text-neutral-500 block mb-2"
          >
            ENGAGEMENTS &amp; SERVICES PRIVILÈGE
          </motion.span>
          <motion.h2
            variants={headerItemVariants}
            className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-normal tracking-[-0.02em] leading-[1.1] uppercase text-black text-center"
          >
            POLITIQUES D'EXPÉDITION &amp; RETOURS
          </motion.h2>
          <motion.div
            variants={headerItemVariants}
            className="w-12 h-[1px] bg-black mx-auto mt-3 mb-3 md:mt-4 md:mb-4"
          />
          <motion.p
            variants={headerItemVariants}
            className="font-sans text-[14px] text-neutral-600 font-normal leading-[1.6]"
          >
            Chaque création FREMKYS répond à une exigence absolue de haute facture. Nous vous garantissons un accompagnement sur-mesure, de la commande jusqu'à l'essayage final.
          </motion.p>
        </motion.div>

        {/* بطاقات الخدمات الأربعة */}
        <motion.div
          variants={cardsContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-16 md:mb-24"
        >
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                variants={cardItemVariants}
                whileHover="hover"
                className="bg-white p-6 sm:p-8 rounded-lg border border-gray-100 shadow-xs hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between cursor-default group"
              >
                <div>
                  <motion.div
                    variants={iconVariants}
                    whileHover={{
                      rotate: 360,
                      scale: 1.2,
                      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                    }}
                    className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-black mb-5"
                  >
                    <Icon className="w-5 h-5 stroke-[1.6]" />
                  </motion.div>

                  <h3 className="font-sans text-[11px] font-semibold tracking-[0.16em] uppercase text-black mb-3">
                    {service.title}
                  </h3>

                  <p className="font-sans text-[14px] font-normal leading-[1.6] text-neutral-600">
                    {service.desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-neutral-100 font-sans text-[11px] tracking-[0.18em] uppercase text-neutral-400 font-normal">
                  {service.badge}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* -----------------------------------------------------------------
           قسم الأسئلة الشائعة التفاعلي (FAQ Interactive Accordion Section)
           ----------------------------------------------------------------- */}
        <div className="max-w-3xl mx-auto">
          
          {/* -----------------------------------------------------------------
             1. حركة عنوان الأسئلة الشائعة (Title Animation):
             DM Sans، حجم صغير جداً (11px)، وزن 500، tracking واسع جداً (0.3em)، uppercase، في المنتصف
             ----------------------------------------------------------------- */}
          <motion.h3
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-sans text-[11px] font-medium tracking-[0.3em] uppercase text-neutral-500 mb-6 md:mb-8 text-center"
          >
            QUESTIONS FRÉQUEMMENT POSÉES SUR LES RETOURS
          </motion.h3>

          {/* الحاوية البيضاء لعناصر الأكورديون */}
          <div className="bg-white px-6 sm:px-8 border border-neutral-200/70 shadow-xs rounded-lg">
            {/* -----------------------------------------------------------------
               5. تتابع عناصر الأسئلة (FAQ Items Stagger):
               ظهور كل سؤال وصعوده بتتابع زمني 0.1s
               ----------------------------------------------------------------- */}
            <motion.div
              variants={faqContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="divide-y divide-neutral-200/80"
            >
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <motion.div
                    key={index}
                    variants={faqItemVariants}
                    className="overflow-hidden"
                  >
                    {/* -----------------------------------------------------------------
                       3. زر السؤال (Question Button):
                       - DM Sans، حجم صغير (14px)، وزن 500
                       - عرض كامل w-full، تباعد رأسي py-6، flex justify-between
                       - سهم (ChevronDown) يدور 180 درجة عند الفتح بمدة 0.3s
                       ----------------------------------------------------------------- */}
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full py-6 flex items-center justify-between text-left font-sans text-[14px] font-medium text-black cursor-pointer hover:text-neutral-600 transition-colors group"
                    >
                      <span className="pr-4 leading-snug">{faq.q}</span>
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="shrink-0 text-neutral-500 group-hover:text-black transition-colors"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </button>

                    {/* -----------------------------------------------------------------
                       4. حركة الإجابة (Answer Animation):
                       - DM Sans، حجم صغير (14px)، وزن 400، line-height مريح (1.6)، لون رمادي غامق
                       - عند الفتح: height 0 -> auto مع opacity 0 -> 1
                       - عند الإغلاق: height auto -> 0 مع opacity 1 -> 0
                       - المدة: 0.3s مع انسيابية power3.out ([0.22, 1, 0.36, 1])
                       ----------------------------------------------------------------- */}
                    <AnimatePresence mode="wait">
                      {isOpen && (
                        <motion.div
                          key={`faq-content-${index}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.3,
                            ease: [0.22, 1, 0.36, 1], // ease power3.out
                          }}
                          className="overflow-hidden"
                        >
                          <p className="pb-6 font-sans text-[14px] font-normal leading-[1.6] text-neutral-600">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* -----------------------------------------------------------------
             6. صندوق التواصل السريع مع الكونسيرج (Contact CTA Box):
             - زر "Contacter la Conciergerie": DM Sans، حجم صغير (12px)، وزن 500، tracking واسع، uppercase
             ----------------------------------------------------------------- */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 bg-gray-50 p-8 rounded-lg border border-neutral-200/60 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left"
          >
            <div>
              <h4 className="font-sans text-[11px] font-semibold text-black uppercase tracking-[0.16em] mb-1.5">
                BESOIN D'AIDE IMMÉDIATE POUR UN RETOUR ?
              </h4>
              <p className="font-sans text-[14px] font-normal text-neutral-600 leading-[1.6] max-w-md">
                Nos conseillers prennent en charge votre demande en quelques minutes et organisent l'enlèvement sans frais.
              </p>
            </div>

            <motion.a
              href="https://wa.me/213774296525?text=Bonjour%20FREMKYS,%20je%20souhaite%20des%20renseignements%20sur%20les%20retours%20ou%20un%20échange."
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 min-h-[48px] bg-black hover:bg-neutral-800 text-white font-sans text-[12px] font-medium tracking-[0.15em] uppercase rounded-sm shrink-0 shadow-sm cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Contacter la Conciergerie</span>
            </motion.a>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
