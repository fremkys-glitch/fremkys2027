import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '../data/products';
import {
  fetchProductsFromDb,
  fetchSiteSettingsFromDb,
  DEFAULT_SITE_SETTINGS,
  type SiteSettings,
} from '../lib/supabase';

export type Currency = 'DZD' | 'EUR' | 'USD';

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

interface ShopContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (priceDZD: number, priceEUR: number, priceUSD: number) => string;
  cart: CartItem[];
  addToCart: (product: Product, size: string, color?: string, quantity?: number, openDrawer?: boolean) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, qty: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  cartTotal: { dzd: number; eur: number; usd: number };
  cartCount: number;
  products: Product[];
  siteSettings: SiteSettings;
  isLoadingDb: boolean;
  refreshData: () => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const PRODUCTS_CACHE_KEY = 'fremkys_products_cache_v2';
const SETTINGS_CACHE_KEY = 'fremkys_settings_cache_v2';

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<Currency>('DZD');

  // Load immediately from cache if available so there is ZERO flash of old products on refresh
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const cached = localStorage.getItem(PRODUCTS_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const clean = parsed.filter((p: any) => !p.id?.startsWith('fremkys-'));
          if (clean.length > 0) return clean;
        }
      }
    } catch (e) {
      console.warn('Failed to parse cached products:', e);
    }
    return [];
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const cached = localStorage.getItem(SETTINGS_CACHE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {}
    return DEFAULT_SITE_SETTINGS;
  });

  const [isLoadingDb, setIsLoadingDb] = useState(true);

  const refreshData = async () => {
    setIsLoadingDb(true);
    try {
      const [fetchedProducts, fetchedSettings] = await Promise.all([
        fetchProductsFromDb(),
        fetchSiteSettingsFromDb(),
      ]);
      if (fetchedProducts && fetchedProducts.length > 0) {
        setProducts(fetchedProducts);
        try {
          localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(fetchedProducts));
        } catch (e) {}
      }
      if (fetchedSettings) {
        setSiteSettings(fetchedSettings);
        try {
          localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(fetchedSettings));
        } catch (e) {}
      }
    } catch (err) {
      console.error('Error refreshing data from Supabase:', err);
    } finally {
      setIsLoadingDb(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('fremkys_cart');
      if (savedCart) {
        return JSON.parse(savedCart);
      }
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('fremkys_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const formatPrice = (priceDZD: number, priceEUR: number, priceUSD: number) => {
    if (currency === 'DZD') {
      return `${priceDZD.toLocaleString('fr-DZ')} DZD`;
    } else if (currency === 'EUR') {
      return `€ ${priceEUR.toLocaleString('fr-FR')}`;
    } else {
      return `$ ${priceUSD.toLocaleString('en-US')}`;
    }
  };

  const addToCart = (product: Product, size: string, color?: string, quantity: number = 1, openDrawer: boolean = true) => {
    const chosenColor = color || (product.colors?.[0]?.name ?? 'Standard');
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.size === size && item.color === chosenColor
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }
      return [...prev, { product, size, color: chosenColor, quantity }];
    });
    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.size === size)));
  };

  const updateQuantity = (productId: string, size: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.size === size ? { ...item, quantity: qty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce(
    (acc, item) => ({
      dzd: acc.dzd + item.product.priceDZD * item.quantity,
      eur: acc.eur + item.product.priceEUR * item.quantity,
      usd: acc.usd + item.product.priceUSD * item.quantity,
    }),
    { dzd: 0, eur: 0, usd: 0 }
  );

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        quickViewProduct,
        setQuickViewProduct,
        cartTotal,
        cartCount,
        products,
        siteSettings,
        isLoadingDb,
        refreshData,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within ShopProvider');
  return context;
};
