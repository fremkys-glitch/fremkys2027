import React, { useState, useEffect, useRef } from 'react';

const MISSION_ITEMS = [
  {
    title: 'NOTRE MISSION',
    text: "FREMKYS n'a jamais été une simple collection, mais une démarche d'élégance sincère et une véritable forme d'art contemporain.",
  },
  {
    title: 'NOS MATIÈRES',
    text: "Des cuirs pleine fleur d'exception, des soies fluides et des lainages nobles rigoureusement sélectionnés auprès des meilleurs ateliers.",
  },
  {
    title: 'NOTRE SIGNATURE',
    text: "Une allure silencieuse, architecturale et intemporelle conçue pour transcender les saisons sans artifice ostentatoire.",
  },
];

export const MissionSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  // Trigger animations on scroll into view
  useEffect(() => {
    const currentSection = sectionRef.current;
    if (!currentSection) return;

    // Check if already in viewport on mount
    const rect = currentSection.getBoundingClientRect();
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
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(currentSection);

    // Subtle Parallax Scroll listener (disabled on mobile < 768px for performance)
    let ticking = false;
    const handleScroll = () => {
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        setParallaxOffset(0);
        return;
      }
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (currentSection) {
            const r = currentSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            if (r.top < windowHeight && r.bottom > 0) {
              const diff = r.top - windowHeight / 2;
              setParallaxOffset(diff * 0.14); // subtle, elegant parallax
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[640px] sm:h-[580px] md:h-[640px] overflow-hidden bg-[#1E1B18] select-none"
    >
      {/* Background Image with Clip-Path Reveal & Subtle Parallax */}
      <div
        className="absolute -top-[12%] left-0 w-full h-[124%] pointer-events-none transition-[clip-path] duration-[1400ms] ease-[cubic-bezier(0.19,1,0.22,1)]"
        style={{
          clipPath: isVisible
            ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
            : 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
          WebkitClipPath: isVisible
            ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
            : 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
          transform: isMobile ? 'none' : `translate3d(0, ${parallaxOffset}px, 0)`,
          willChange: isMobile ? 'auto' : 'transform, clip-path',
        }}
      >
        <img
          src="/images/footer_editorial.webp"
          alt="FREMKYS Campagne Éditoriale"
          loading="lazy"
          decoding="async"
          width={1600}
          height={900}
          className="w-full h-full object-cover object-center transition-transform duration-[1800ms] ease-[cubic-bezier(0.19,1,0.22,1)]"
          style={{
            transform: isVisible ? 'scale(1)' : 'scale(1.08)',
          }}
        />

        {/* Gradient shadow for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/20 pointer-events-none" />
      </div>

      {/* 3 Columns Manifesto at Bottom */}
      <div className="absolute inset-x-0 bottom-0 pb-8 sm:pb-10 md:pb-14 px-5 sm:px-8 md:px-14 max-w-[1720px] mx-auto text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
          {MISSION_ITEMS.map((item, itemIdx) => {
            const words = item.title.split(' ');
            return (
              <div key={item.title} className="space-y-2.5">
                {/* Title with SplitText (Letter by Letter Reveal) */}
                <h4
                  aria-label={item.title}
                  className="font-sans text-[11px] md:text-[12px] font-semibold uppercase tracking-[0.2em] text-white flex flex-wrap gap-x-2"
                >
                  {words.map((word, wordIdx) => {
                    const wordOffset = wordIdx === 0 ? 0 : words[0].length + 1;
                    return (
                      <span key={wordIdx} className="inline-flex whitespace-nowrap overflow-hidden py-0.5">
                        {word.split('').map((char, charIdx) => {
                          const charDelay = itemIdx * 180 + (wordOffset + charIdx) * 35 + 450;
                          return (
                            <span
                              key={charIdx}
                              aria-hidden="true"
                              className="inline-block transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                              style={{
                                transform: isVisible ? 'translateY(0)' : 'translateY(115%)',
                                opacity: isVisible ? 1 : 0,
                                transitionDelay: `${charDelay}ms`,
                              }}
                            >
                              {char}
                            </span>
                          );
                        })}
                      </span>
                    );
                  })}
                </h4>

                {/* Description: Fade Up */}
                <p
                  className="font-sans text-[11px] md:text-[12px] text-white/85 font-light leading-relaxed transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    transform: isVisible ? 'translateY(0)' : 'translateY(22px)',
                    opacity: isVisible ? 1 : 0,
                    transitionDelay: `${itemIdx * 180 + 720}ms`,
                  }}
                >
                  {item.text}
                </p>

                {/* Thin Editorial Divider: Scales from left */}
                <div
                  className="w-full h-[1px] bg-white/40 transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] origin-left pt-0.5"
                  style={{
                    transform: isVisible ? 'scaleX(1)' : 'scaleX(0)',
                    transitionDelay: `${itemIdx * 180 + 850}ms`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
