import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { isVideoMedia, getVideoPosterUrl, getOptimizedImageUrl } from '../lib/supabase';

interface HeroProps {
  onExplore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore }) => {
  const { siteSettings } = useShop();
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Trigger animations on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const currentHeroImg = siteSettings?.hero_image || '/images/hero_clean.webp';
  const heroTitle = siteSettings?.hero_title || 'Nouvelle Collection';
  const heroSubtitle = siteSettings?.hero_subtitle || 'Classic & timeless';
  const isVideo = isVideoMedia(currentHeroImg);
  const posterUrl = isVideo ? getVideoPosterUrl(currentHeroImg) : getOptimizedImageUrl(currentHeroImg, { width: 1600, quality: 78 });

  const titleWords = heroTitle.split(' ').map((word, idx) => ({
    word,
    offset: idx * 8,
  }));

  // Parallax calculations (disabled on mobile < 768px for performance)
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const imageParallax = isMobile ? 0 : scrollY * 0.38;
  const textParallax = isMobile ? 0 : scrollY * 0.16;
  const textOpacity = isMobile ? 1 : Math.max(0, 1 - scrollY / 650);

  return (
    <section className="relative w-full h-[70vh] sm:h-[80vh] lg:h-[100dvh] min-h-[460px] overflow-hidden bg-[#1A1615] select-none flex items-center justify-center">
      
      {/* Background Hero Media with Clip-Path Reveal & Parallax */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none transition-[clip-path] duration-[1400ms] ease-[cubic-bezier(0.19,1,0.22,1)]"
        style={{
          clipPath: isLoaded
            ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
            : 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
          WebkitClipPath: isLoaded
            ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
            : 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
          transform: isMobile ? 'none' : `translate3d(0, ${imageParallax}px, 0)`,
          willChange: isMobile ? 'auto' : 'transform, clip-path',
        }}
      >
        {isVideo ? (
          <>
            {/* Mobile Fallback: Fast, low-bandwidth static poster image instead of streaming video */}
            <div className="w-full h-full block md:hidden">
              <img
                src={posterUrl}
                alt="FREMKYS Nouvelle Collection"
                fetchPriority="high"
                decoding="async"
                width={720}
                height={1080}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Desktop / Tablet: Single Video stream with poster and metadata preload */}
            <div className="relative w-full h-full hidden md:flex items-center justify-center overflow-hidden">
              {/* Lightweight CSS ambient background atmosphere (no duplicate video stream) */}
              <div
                className="absolute inset-0 w-full h-full bg-cover bg-center filter blur-3xl opacity-35 scale-125 pointer-events-none"
                style={{ backgroundImage: `url(${posterUrl})` }}
              />

              {/* Crisp Center Video: Perfectly framed on laptop/desktop */}
              <video
                src={currentHeroImg}
                poster={posterUrl}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                width={760}
                height={1080}
                className="relative w-full h-full md:w-auto md:max-w-[640px] lg:max-w-[760px] xl:max-w-[860px] object-cover object-center md:object-[center_12%] transition-transform duration-[1800ms] ease-[cubic-bezier(0.19,1,0.22,1)]"
                style={{
                  transform: isLoaded ? 'scale(1)' : 'scale(1.04)',
                }}
              />
            </div>
          </>
        ) : (
          <img
            src={posterUrl}
            alt="FREMKYS Nouvelle Collection"
            fetchPriority="high"
            decoding="async"
            width={1600}
            height={900}
            className="w-full h-full object-cover object-center md:object-[center_20%] transition-transform duration-[1800ms] ease-[cubic-bezier(0.19,1,0.22,1)]"
            style={{
              transform: isLoaded ? 'scale(1)' : 'scale(1.08)',
            }}
          />
        )}

        {/* Subtle cinematic gradient overlays */}
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/35 pointer-events-none" />
      </div>

      {/* Center Content Box: Parallax-enabled with staggered reveals */}
      <div
        className="relative z-10 text-center text-white px-4 py-12 sm:px-6 sm:py-16 md:py-20 max-w-4xl mx-auto flex flex-col items-center w-full"
        style={{
          transform: isMobile ? 'none' : `translate3d(0, ${textParallax}px, 0)`,
          opacity: textOpacity,
          willChange: isMobile ? 'auto' : 'transform, opacity',
        }}
      >
        
        {/* Title: Responsive 32px-36px mobile, 48px tablet, 64px-80px desktop */}
        <h1
          aria-label={heroTitle}
          className="font-serif text-[32px] sm:text-[36px] md:text-[48px] lg:text-[64px] xl:text-[80px] font-normal text-white tracking-[-0.02em] leading-[1.1] drop-shadow-sm flex flex-wrap justify-center items-center gap-x-2 sm:gap-x-4"
        >
          {titleWords.map(({ word, offset }, wordIdx) => (
            <span key={wordIdx} className="inline-flex whitespace-nowrap overflow-hidden py-1">
              {word.split('').map((char, charIdx) => {
                const charDelay = isMobile ? 200 + (offset + charIdx) * 20 : 420 + (offset + charIdx) * 35;
                return (
                  <span
                    key={charIdx}
                    aria-hidden="true"
                    className="inline-block transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{
                      transform: isLoaded ? 'translateY(0)' : 'translateY(115%)',
                      opacity: isLoaded ? 1 : 0,
                      transitionDelay: `${charDelay}ms`,
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p
          className="font-serif italic text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] text-white/90 tracking-[0.14em] sm:tracking-[0.18em] font-light mt-2 sm:mt-4 drop-shadow-xs transition-all duration-800 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
            opacity: isLoaded ? 1 : 0,
            transitionDelay: isMobile ? '500ms' : '980ms',
          }}
        >
          {heroSubtitle}
        </p>

        {/* Button: Shop Now */}
        <div
          className="pt-6 sm:pt-8 w-full sm:w-auto transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] flex justify-center"
          style={{
            transform: isLoaded ? 'translateY(0)' : 'translateY(32px)',
            opacity: isLoaded ? 1 : 0,
            transitionDelay: isMobile ? '650ms' : '1180ms',
          }}
        >
          <button
            onClick={onExplore}
            className="group w-full sm:w-auto h-[48px] sm:h-[52px] min-h-[48px] px-8 sm:px-9 bg-white text-black font-sans text-[12px] uppercase tracking-[0.2em] font-medium hover:bg-black hover:text-white border border-white transition-all duration-300 shadow-xl flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Shop Now</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

      </div>

    </section>
  );
};

