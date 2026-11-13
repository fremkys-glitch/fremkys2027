import React, { useState, useEffect, useRef } from 'react';
import { Truck, Shield, Clock, Sparkles } from 'lucide-react';

const FEATURES = [
  {
    icon: Truck,
    title: 'Livraison 58 Wilayas',
    desc: 'Expédition soignée à domicile ou stopdesk sous 24h à 48h partout en Algérie.',
  },
  {
    icon: Shield,
    title: 'Paiement à la Livraison',
    desc: 'Réglez sereinement en espèces lors de la remise de votre commande, ou par virement.',
  },
  {
    icon: Clock,
    title: 'Échanges & Retours Faciles',
    desc: "Essayage à domicile avec possibilité d'échange de taille sous 7 jours ouvrés.",
  },
  {
    icon: Sparkles,
    title: 'Haute Confection & Édition',
    desc: 'Pièces produites en séries très limitées avec packaging signature FREMKYS.',
  },
];

export const AlgeriaBenefits: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const current = sectionRef.current;
    if (!current) return;

    // Check if already in viewport on mount
    const rect = current.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      setIsVisible(true);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#121214] text-white py-12 sm:py-16 px-4 sm:px-6 md:px-12 border-b border-neutral-800 overflow-hidden select-none"
    >
      <div className="max-w-[1720px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {FEATURES.map((feature, idx) => {
          const Icon = feature.icon;
          const delaySec = idx * 0.15;

          return (
            <div key={feature.title} className="group flex items-start space-x-4">
              {/* Icon Container: scale: 0 -> 1 & rotation: -180 -> 0 */}
              <div
                className="w-10 h-10 rounded-full border border-neutral-700 bg-neutral-900/60 flex items-center justify-center shrink-0 text-neutral-300 transition-all duration-700 ease-[cubic-bezier(0.34,1.3,0.64,1)] group-hover:border-white group-hover:text-white"
                style={{
                  transform: isVisible
                    ? 'scale(1) rotate(0deg)'
                    : 'scale(0) rotate(-180deg)',
                  opacity: isVisible ? 1 : 0,
                  transitionDelay: `${delaySec}s`,
                  willChange: 'transform, opacity',
                }}
              >
                <Icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
              </div>

              {/* Text: Fade Up */}
              <div
                className="transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
                  opacity: isVisible ? 1 : 0,
                  transitionDelay: `${delaySec + 0.05}s`,
                  willChange: 'transform, opacity',
                }}
              >
                <h4 className="font-sans text-[11px] uppercase tracking-[0.2em] font-semibold text-white transition-colors duration-300 group-hover:text-neutral-100">
                  {feature.title}
                </h4>
                <p className="font-sans text-[14px] font-normal leading-[1.6] text-neutral-400 mt-1">
                  {feature.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
