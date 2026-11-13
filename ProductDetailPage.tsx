import React from 'react';
import type { Product } from '../data/products';
import { useShop } from '../context/ShopContext';
import { ProductPoliciesReturns } from './ProductPoliciesReturns';
import { ProductGallery } from './ProductGallery';
import { ProductInfo } from './ProductInfo';
import { ShopTheLook } from './ShopTheLook';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onGoToCheckout?: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onBack: _onBack,
  onSelectProduct,
  onGoToCheckout,
}) => {
  const { products } = useShop();

  return (
    <div className="w-full bg-[#FFFFFF] min-h-screen animate-in fade-in duration-300 relative pt-16 sm:pt-20 md:pt-24">
      
      {/* 50 / 50 Split Layout on Tablet and Desktop, Stacked on Mobile */}
      <div className="w-full max-w-[1720px] mx-auto grid grid-cols-1 md:grid-cols-2 min-h-[85vh] items-start gap-8 lg:gap-12 px-4 sm:px-6 md:px-12">
        
        {/* Left Column: Premium Product Gallery with 80px Thumbnails, Zoom & Transitions */}
        <div className="w-full bg-[#FAF9F6] flex items-center justify-center p-3 sm:p-5 md:p-6 lg:p-8 rounded-2xl overflow-hidden min-h-[380px] sm:min-h-[420px]">
          <ProductGallery product={product} />
        </div>

        {/* Right Column: Premium Sticky Product Info Panel with Framer Motion animations */}
        <div className="w-full flex items-start justify-center">
          <ProductInfo product={product} onGoToCheckout={onGoToCheckout} />
        </div>

      </div>

      {/* SHOP THE LOOK Section with 3 Products & Framer Motion animations */}
      <ShopTheLook currentProductId={product.id} products={products} onSelectProduct={onSelectProduct} />


      {/* POLICIES & RETURNS SECTION */}
      <ProductPoliciesReturns />

    </div>
  );
};
