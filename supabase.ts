import { createClient } from '@supabase/supabase-js';
import type { Product } from '../data/products';

// Project URL from user dashboard: https://hvhjqqnfuqtihuipiafv.supabase.co
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://hvhjqqnfuqtihuipiafv.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2aGpxcW5mdXF0aWh1aXBpYWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NDU4MzYsImV4cCI6MjA4OTAyMTgzNn0.15bFCeL-L0IYxCKZfGYhKpSBlxL-xYD5Kzx-q6GTLN0';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY || 'dummy-anon-key'
);

export interface SiteSettings {
  id: string;
  hero_image: string;
  hero_title: string;
  hero_subtitle: string;
  dual_left_image: string;
  dual_left_title: string;
  dual_left_category: string;
  dual_right_image: string;
  dual_right_title: string;
  dual_right_category: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: 'main',
  hero_image: '/images/hero_clean.webp',
  hero_title: 'Nouvelle Collection',
  hero_subtitle: 'Édition Limitée · Printemps 2026',
  dual_left_image: '/images/dual_feature_left.webp',
  dual_left_title: 'A SILHOUETTE THAT',
  dual_left_category: 'manteaux',
  dual_right_image: '/images/dual_feature_right.webp',
  dual_right_title: 'NOTHING LOUD.',
  dual_right_category: 'chaussures',
};

// Check if a media URL is a video
export function isVideoMedia(url?: string): boolean {
  if (!url) return false;
  return /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url) || url.includes('/video/') || url.includes('video');
}

// Generate an optimal poster image for a video URL
export function getVideoPosterUrl(url?: string): string {
  if (!url) return '/images/hero_clean.webp';
  if (url.includes('res.cloudinary.com') && url.includes('/video/upload/')) {
    // Cloudinary dynamic frame extraction as lightweight webp/jpg poster
    return url
      .replace('/video/upload/', '/video/upload/q_auto:eco,w_1200,c_limit,f_auto/')
      .replace(/\.(mp4|webm|mov|ogg)(\?.*)?$/i, '.jpg');
  }
  return url.replace(/\.(mp4|webm|mov|ogg)(\?.*)?$/i, '.webp');
}

// Transform external & storage URLs to optimized responsive WebP / compressed formats
export function getOptimizedImageUrl(
  url?: string,
  options: { width?: number; quality?: number } = {}
): string {
  if (!url) return '';
  const { width = 800, quality = 78 } = options;

  // Cloudinary on-the-fly resizing and auto-format (serves WebP/AVIF compressed)
  if (url.includes('res.cloudinary.com') && url.includes('/image/upload/')) {
    if (!url.includes('/image/upload/f_auto') && !url.includes('/image/upload/w_')) {
      return url.replace(
        '/image/upload/',
        `/image/upload/f_auto,q_auto:eco,w_${width},c_limit/`
      );
    }
    return url;
  }

  // Supabase Storage dynamic image transformation
  if (url.includes('.supabase.co/storage/v1/object/public/')) {
    const renderUrl = url.replace(
      '/storage/v1/object/public/',
      '/storage/v1/render/image/public/'
    );
    const sep = renderUrl.includes('?') ? '&' : '?';
    return `${renderUrl}${sep}width=${width}&quality=${quality}&format=origin`;
  }

  // Local images: convert old jpg/png fallback paths to webp
  if (url.startsWith('/images/')) {
    return url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  }

  return url;
}

// Map color names to luxury hex colors
const COLOR_MAP: Record<string, string> = {
  noir: '#111111',
  black: '#111111',
  blanc: '#FFFFFF',
  white: '#FFFFFF',
  chocolat: '#3B2724',
  chocolate: '#3B2724',
  'dark chocolate': '#2A1F1D',
  'onyx black': '#111111',
  'warm cognac': '#6E3A22',
  camel: '#94663B',
  'camel fauve': '#94663B',
  marron: '#4E3629',
  brown: '#4E3629',
  beige: '#D4C5B9',
  ivoire: '#F8F6F0',
  ivory: '#F8F6F0',
  ecru: '#EFEBD9',
  creme: '#FFFDD0',
  ardoise: '#475569',
  gris: '#6B7280',
  grey: '#6B7280',
  gray: '#6B7280',
  dore: '#D4AF37',
  gold: '#D4AF37',
  or: '#D4AF37',
  argent: '#C0C0C0',
  silver: '#C0C0C0',
  rouge: '#991B1B',
  red: '#991B1B',
  bordeaux: '#5B1E31',
  burgundy: '#5B1E31',
  bleu: '#1E3A8A',
  blue: '#1E3A8A',
  'bleu minuit': '#1F2432',
  vert: '#14532D',
  green: '#14532D',
  kaki: '#556B2F',
  khaki: '#556B2F',
  olive: '#556B2F',
};

export function getColorHex(name: string): string {
  const clean = name.trim().toLowerCase();
  return COLOR_MAP[clean] || '#222222';
}

// Convert Supabase database row to frontend Product type
export function mapDbProductToProduct(row: any): Product {
  const mediaList = [row.media_1, row.image_2, row.image_3, row.image_4].filter(Boolean);

  const rawSizes = typeof row.sizes === 'string'
    ? row.sizes.split(',').map((s: string) => s.trim()).filter(Boolean)
    : (Array.isArray(row.sizes) ? row.sizes : ['S', 'M', 'L']);

  const colorNames = typeof row.colors === 'string'
    ? row.colors.split(',').map((c: string) => c.trim()).filter(Boolean)
    : (Array.isArray(row.colors) ? row.colors.map((c: any) => typeof c === 'string' ? c : c.name) : ['Noir']);

  const colorSwatches = colorNames.map((name: string) => ({
    name,
    hex: getColorHex(name),
  }));

  const priceDZD = Number(row.price_dzd) || 0;

  const isOutOfStock = Boolean(
    row.is_out_of_stock === true ||
    row.is_out_of_stock === 'true' ||
    row.in_stock === false ||
    row.in_stock === 'false' ||
    row.status === 'out_of_stock' ||
    row.status === 'sold_out' ||
    (typeof row.stock === 'number' && row.stock <= 0) ||
    (typeof row.quantity === 'number' && row.quantity <= 0) ||
    (typeof row.tag === 'string' && /sold[\s_-]?out|out[\s_-]?of[\s_-]?stock|épuisé|نفذ/i.test(row.tag))
  );

  return {
    id: String(row.id),
    name: row.name || 'Pièce de Collection',
    category: row.category || 'all',
    categoryLabel: row.category_label || (row.category ? row.category.toUpperCase() : 'Collection'),
    priceDZD,
    priceEUR: Math.round(priceDZD / 110),
    priceUSD: Math.round(priceDZD / 100),
    tag: row.tag || undefined,
    image: getOptimizedImageUrl(row.media_1 || '/images/cat_item_1.webp', { width: 800, quality: 78 }),
    editorialImage: getOptimizedImageUrl(row.image_2 || row.media_1 || '/images/cat_item_1.webp', { width: 800, quality: 78 }),
    galleryImages: mediaList.length > 0
      ? mediaList.map((url: string) => getOptimizedImageUrl(url, { width: 1200, quality: 80 }))
      : ['/images/cat_item_1.webp'],
    colors: colorSwatches,
    sizes: rawSizes.length > 0 ? rawSizes : ['S', 'M', 'L'],
    description: row.description || 'Création exclusive Maison FREMKYS.',
    sizeFit: 'Coupe élégante et raffinée. Prenez votre taille habituelle.',
    material: 'Confection haute facture dans les ateliers d’excellence.',
    care: 'Nettoyage délicat recommandé.',
    createdAt: row.created_at || undefined,
    isOutOfStock,
  };
}

// Fetch products from Supabase
export async function fetchProductsFromDb(): Promise<Product[]> {
  try {
    if (!isSupabaseConfigured) {
      return [];
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      if (error) console.warn('Supabase products error:', error.message);
      return [];
    }

    return data.map(mapDbProductToProduct);
  } catch (err) {
    console.error('Failed to load products from Supabase:', err);
    return [];
  }
}

// Fetch site settings from Supabase
export async function fetchSiteSettingsFromDb(): Promise<SiteSettings> {
  try {
    if (!isSupabaseConfigured) {
      return DEFAULT_SITE_SETTINGS;
    }

    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 'main')
      .single();

    if (error || !data) {
      if (error) console.warn('Supabase site_settings error:', error.message);
      return DEFAULT_SITE_SETTINGS;
    }

    return {
      id: data.id || 'main',
      hero_image: data.hero_image || DEFAULT_SITE_SETTINGS.hero_image,
      hero_title: data.hero_title || DEFAULT_SITE_SETTINGS.hero_title,
      hero_subtitle: data.hero_subtitle || DEFAULT_SITE_SETTINGS.hero_subtitle,
      dual_left_image: data.dual_left_image || DEFAULT_SITE_SETTINGS.dual_left_image,
      dual_left_title: data.dual_left_title || DEFAULT_SITE_SETTINGS.dual_left_title,
      dual_left_category: data.dual_left_category || DEFAULT_SITE_SETTINGS.dual_left_category,
      dual_right_image: data.dual_right_image || DEFAULT_SITE_SETTINGS.dual_right_image,
      dual_right_title: data.dual_right_title || DEFAULT_SITE_SETTINGS.dual_right_title,
      dual_right_category: data.dual_right_category || DEFAULT_SITE_SETTINGS.dual_right_category,
    };
  } catch (err) {
    console.error('Failed to load site settings from Supabase:', err);
    return DEFAULT_SITE_SETTINGS;
  }
}
