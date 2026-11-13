import React from 'react';
import { useShop } from '../context/ShopContext';
import { isVideoMedia, getOptimizedImageUrl, getVideoPosterUrl } from '../lib/supabase';

interface DualFeatureProps {
  onSelectFeature: (category: string) => void;
}

export const DualFeature: React.FC<DualFeatureProps> = ({ onSelectFeature }) => {
  const { siteSettings } = useShop();

  const rawLeft = siteSettings?.dual_left_image || '/images/dual_feature_left.webp';
  const isLeftVideo = isVideoMedia(rawLeft);
  const leftImage = isLeftVideo ? rawLeft : getOptimizedImageUrl(rawLeft, { width: 1200, quality: 78 });
  const leftPoster = isLeftVideo ? getVideoPosterUrl(rawLeft) : undefined;
  const leftTitle = siteSettings?.dual_left_title || 'A SILHOUETTE THAT';
  const leftCategory = siteSettings?.dual_left_category || 'manteaux';

  const rawRight = siteSettings?.dual_right_image || '/images/dual_feature_right.webp';
  const isRightVideo = isVideoMedia(rawRight);
  const rightImage = isRightVideo ? rawRight : getOptimizedImageUrl(rawRight, { width: 1200, quality: 78 });
  const rightPoster = isRightVideo ? getVideoPosterUrl(rawRight) : undefined;
  const rightTitle = siteSettings?.dual_right_title || 'NOTHING LOUD.';
  const rightCategory = siteSettings?.dual_right_category || 'chaussures';

  return (
    <section className="w-full bg-[#111111] text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-900">
        
        {/* Left Card: First feature image/video */}
        <div
          onClick={() => onSelectFeature(leftCategory)}
          className="group relative aspect-[4/3] sm:aspect-[4/3] md:aspect-auto md:h-[600px] lg:h-[680px] w-full overflow-hidden cursor-pointer bg-neutral-950"
        >
          {isLeftVideo ? (
            <video
              src={leftImage}
              poster={leftPoster}
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              width={800}
              height={1000}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <img
              src={leftImage}
              alt="FREMKYS Collection Feature 1"
              loading="lazy"
              decoding="async"
              width={800}
              height={1000}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          )}
          {/* Subtle gradient at bottom for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 pointer-events-none" />

          {/* Centered Caption at Bottom */}
          <div className="absolute bottom-5 sm:bottom-6 inset-x-0 text-center px-4 pointer-events-none">
            <span className="font-sans text-[11px] md:text-[12px] tracking-[0.25em] uppercase font-medium text-white drop-shadow-sm">
              {leftTitle}
            </span>
          </div>
        </div>

        {/* Right Card: Second feature image/video */}
        <div
          onClick={() => onSelectFeature(rightCategory)}
          className="group relative aspect-[4/3] sm:aspect-[4/3] md:aspect-auto md:h-[600px] lg:h-[680px] w-full overflow-hidden cursor-pointer bg-neutral-950"
        >
          {isRightVideo ? (
            <video
              src={rightImage}
              poster={rightPoster}
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              width={800}
              height={1000}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <img
              src={rightImage}
              alt="FREMKYS Collection Feature 2"
              loading="lazy"
              decoding="async"
              width={800}
              height={1000}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          )}
          {/* Subtle gradient at bottom for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 pointer-events-none" />

          {/* Centered Caption at Bottom */}
          <div className="absolute bottom-5 sm:bottom-6 inset-x-0 text-center px-4 pointer-events-none">
            <span className="font-sans text-[11px] md:text-[12px] tracking-[0.25em] uppercase font-medium text-white drop-shadow-sm">
              {rightTitle}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
