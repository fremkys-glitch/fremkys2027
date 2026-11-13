import React, { useState } from 'react';
import { 
  ArrowRight, 
  MapPin, 
  Building2, 
  Check,
  ShieldCheck, 
  Truck,
  Clock,
  Package
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ALGERIA_58_WILAYAS } from '../data/algeriaWilayas';
import type { WilayaData } from '../data/algeriaWilayas';
import type { Product } from '../data/products';
import { isVideoMedia } from '../lib/supabase';

interface CheckoutPageProps {
  onBack: () => void;
  onNavigateHome: () => void;
  onSelectProduct?: (p: Product) => void;
  onGoToShop?: () => void;
}

interface ConfirmedOrderData {
  orderNumber: string;
  timestamp: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  wilayaName: string;
  deliveryType: string;
  items: Array<{
    product: Product;
    size: string;
    color?: string;
    quantity: number;
  }>;
  subtotal: number;
  shippingCost: number;
  total: number;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ 
  onBack, 
  onNavigateHome,
  onSelectProduct,
  onGoToShop
}) => {
  const { cart, clearCart, products } = useShop();
  const baseProducts = products;

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [selectedWilayaCode, setSelectedWilayaCode] = useState<string>('');
  const [deliveryType, setDeliveryType] = useState<'home' | 'desk'>('home');
  const [notes, setNotes] = useState('');
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrderData | null>(null);

  // حساب المجموع الفرعي الحالي بدقة من المنتجات الموجودة في السلة فقط
  const subtotalDZD = cart.reduce((sum, item) => sum + (item.product.priceDZD * item.quantity), 0);

  const selectedWilaya: WilayaData | undefined = ALGERIA_58_WILAYAS.find(w => w.code === selectedWilayaCode);
  const isDeskSupported = selectedWilaya ? selectedWilaya.deskPrice > 0 : true;
  const activeDeliveryType = (!isDeskSupported && deliveryType === 'desk') ? 'home' : deliveryType;

  const shippingCost = selectedWilaya 
    ? (!selectedWilaya.isAvailable 
        ? 0 
        : (activeDeliveryType === 'home' ? selectedWilaya.homePrice : selectedWilaya.deskPrice))
    : 0;

  const totalDZD = subtotalDZD + shippingCost;
  const recommendedProducts = baseProducts.slice(0, 3);

  const handleFinalOrderSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (cart.length === 0) {
      alert("سلة التسوق فارغة، يرجى اختيار منتج أولاً.");
      return;
    }
    if (!fullName.trim()) {
      alert("يرجى إدخال الاسم الكامل.");
      return;
    }
    if (!phone.trim()) {
      alert("يرجى إدخال رقم الهاتف للتواصل.");
      return;
    }
    if (!address.trim()) {
      alert("يرجى إدخال عنوان التوصيل.");
      return;
    }
    if (!selectedWilayaCode) {
      alert("يرجى اختيار الولاية لمعرفة سعر التوصيل المناسب.");
      return;
    }
    if (selectedWilaya && !selectedWilaya.isAvailable) {
      alert(`نعتذر منكم، خدمة التوصيل غير متوفرة حالياً لولاية ${selectedWilaya.nameAr}.`);
      return;
    }

    const generatedOrderNum = `#ZR-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const itemsToSave = cart.map(item => ({
      product: { ...item.product },
      size: item.size,
      color: item.color,
      quantity: item.quantity,
    }));
    const orderSubtotal = itemsToSave.reduce((sum, item) => sum + (item.product.priceDZD * item.quantity), 0);
    const orderShipping = shippingCost;
    const orderTotal = orderSubtotal + orderShipping;

    const now = new Date();
    const formatted = now.toLocaleDateString('ar-DZ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) + ` · ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const confirmed: ConfirmedOrderData = {
      orderNumber: generatedOrderNum,
      timestamp: formatted,
      fullName: fullName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      wilayaName: selectedWilaya ? `${selectedWilaya.code} - ${selectedWilaya.nameAr} (${selectedWilaya.name})` : 'الجزائر',
      deliveryType: activeDeliveryType === 'home' ? 'توصيل لباب المنزل' : 'توصيل للمكتب (Stop Desk)',
      items: itemsToSave,
      subtotal: orderSubtotal,
      shippingCost: orderShipping,
      total: orderTotal,
    };

    setConfirmedOrder(confirmed);

    // تجهيز ملخص المنتجات لإرسالها إلى Google Sheets
    const productsSummary = itemsToSave
      .map(
        (it) =>
          `${it.product.name} (Taille: ${it.size}${it.color ? `, Couleur: ${it.color}` : ''}, Qté: ${it.quantity}, Prix: ${it.product.priceDZD} DA)`
      )
      .join(' | ');

    // Send order data to Google Sheets
    const GOOGLE_SHEET_URL = import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK_URL ||
      'https://script.google.com/macros/s/AKfycbxILxkXjqbjBnP6VLex9RnCjMSKlyjRHMMbAko74vSmR2QD4NcB7B1pvBKMpVNo1mwY/exec';

    if (GOOGLE_SHEET_URL) {
      const orderPayload = {
        status: 'جديد (في انتظار الاتصال)',
        productsSummary,
        phone: phone.trim(),
        fullName: fullName.trim(),
        wilaya: confirmed.wilayaName,
        city: city.trim(),
        address: address.trim(),
        deliveryType: confirmed.deliveryType,
        subtotal: orderSubtotal,
        shippingCost: orderShipping,
        total: orderTotal,
        notes: notes.trim(),
        orderNumber: generatedOrderNum,
        timestamp: formatted,
      };

      try {
        fetch(GOOGLE_SHEET_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(orderPayload),
        }).catch((err) => console.warn('Google Sheets delivery note:', err));
      } catch (err) {
        console.warn('Google Sheets error:', err);
      }
    }

    setIsSuccess(true);
    clearCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-[#FFFFFF] min-h-screen text-[#000000] font-sans pt-[100px] md:pt-[115px] pb-24 select-none">
      
      {/* Main Container */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8">
        
        {/* SUCCESS CONFIRMATION VIEW */}
        {isSuccess && confirmedOrder ? (
          <div className="max-w-2xl mx-auto space-y-8 animate-in zoom-in-95 duration-300">
            
            {/* TOP CARD: ORDER SUCCESS DETAILS */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-lg text-center">
              
              {/* Solid Green Circle with White Checkmark */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#22C55E] text-white rounded-full flex items-center justify-center mx-auto shadow-sm mb-4">
                <Check className="w-8 h-8 sm:w-10 sm:h-10 stroke-[3]" />
              </div>

              {/* Main Title: ORDER SUCCESSFULLY PLACED! */}
              <h2 className="font-sans text-xl sm:text-2xl md:text-3xl font-light text-neutral-900 tracking-wider uppercase">
                ORDER SUCCESSFULLY PLACED!
              </h2>

              {/* Order Number */}
              <p className="text-xs sm:text-sm text-neutral-500 mt-2 font-sans font-medium">
                Order Number: <strong className="text-neutral-900 font-bold tracking-wider">{confirmedOrder.orderNumber}</strong>
              </p>

              {/* ETA Requirement: سيتم الاتصال بكم في 96 ساعة قادمة لتأكيد طلبكم */}
              <div className="mt-5 inline-flex items-center space-x-2 space-x-reverse px-5 py-2.5 rounded-full bg-neutral-50 border border-neutral-200 text-xs sm:text-sm font-semibold text-neutral-800 shadow-2xs">
                <span className="text-base">📞</span>
                <span>سيتم الاتصال بكم في 96 ساعة قادمة لتأكيد طلبكم</span>
              </div>

              {/* Blue Callout Box */}
              <div className="mt-4 p-3.5 bg-[#F0F7FF] border border-[#D0E2FF] rounded-xl text-xs text-[#1E40AF] leading-relaxed max-w-md mx-auto text-center font-sans">
                <span>✉️ تم تسجيل بياناتكم بنجاح · سيتواصل معكم مستشار خدمة العملاء هاتفياً على الرقم <strong className="font-bold underline">{confirmedOrder.phone}</strong></span>
              </div>

              {/* Full Order Breakdown */}
              <div id="order-details-section" className="mt-8 pt-8 border-t border-neutral-100 text-right space-y-5">
                
                {/* 1. Date and Time of Order */}
                <div className="flex items-center justify-between bg-neutral-50 px-4 py-3 rounded-xl border border-neutral-200/80 text-xs text-neutral-700">
                  <span className="font-bold text-neutral-800 flex items-center space-x-1.5 space-x-reverse">
                    <Clock className="w-3.5 h-3.5 text-neutral-500" />
                    <span>تاريخ ووقت الطلبية:</span>
                  </span>
                  <span className="font-semibold text-black font-mono">
                    {confirmedOrder.timestamp}
                  </span>
                </div>

                {/* 2. Delivery Location */}
                <div className="bg-neutral-50/70 p-4 sm:p-5 rounded-xl border border-neutral-200/80 text-xs text-neutral-700 space-y-2.5">
                  <div className="flex items-center space-x-2 space-x-reverse border-b border-neutral-200 pb-2">
                    <MapPin className="w-4 h-4 text-black shrink-0" />
                    <span className="text-[12px] uppercase tracking-wider font-bold text-neutral-900">
                      مكان التوصيل والبيانات الشخصية
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-right pt-1">
                    <p><span className="text-neutral-500">الاسم الكامل:</span> <strong className="text-black">{confirmedOrder.fullName}</strong></p>
                    <p><span className="text-neutral-500">رقم الهاتف:</span> <strong className="text-black font-mono">{confirmedOrder.phone}</strong></p>
                    <p className="sm:col-span-2">
                      <span className="text-neutral-500">العنوان الكامل:</span> <strong className="text-black">{confirmedOrder.address} {confirmedOrder.city ? `- ${confirmedOrder.city}` : ''} ({confirmedOrder.wilayaName})</strong>
                    </p>
                    <p className="sm:col-span-2">
                      <span className="text-neutral-500">نوع التوصيل:</span> <strong className="text-black">{confirmedOrder.deliveryType}</strong>
                    </p>
                  </div>
                </div>

                {/* 3. Ordered Products with Image, Quantity and Real Price */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[12px] uppercase tracking-wider font-bold text-neutral-900 flex items-center space-x-1.5 space-x-reverse">
                      <Package className="w-4 h-4 text-black" />
                      <span>المنتجات المطلوبة</span>
                    </span>
                    <span className="text-neutral-500 font-medium">
                      ({confirmedOrder.items.reduce((acc, it) => acc + it.quantity, 0)} قطعة)
                    </span>
                  </div>

                  <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                    {confirmedOrder.items.map((item, idx) => (
                      <div key={idx} className="p-4 flex items-center space-x-4 space-x-reverse text-right">
                        {/* Product Image / Video */}
                        {isVideoMedia(item.product.image) ? (
                          <video
                            src={item.product.image}
                            muted
                            playsInline
                            preload="none"
                            width={80}
                            height={104}
                            className="w-18 h-24 sm:w-20 sm:h-26 object-cover rounded-lg bg-neutral-100 border border-neutral-200 shrink-0"
                          />
                        ) : (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            loading="lazy"
                            decoding="async"
                            width={80}
                            height={104}
                            className="w-18 h-24 sm:w-20 sm:h-26 object-cover rounded-lg bg-neutral-100 border border-neutral-200 shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <h4 className="text-sm font-bold text-neutral-900 truncate">
                            {item.product.name}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-600">
                            <span className="bg-neutral-100 px-2 py-0.5 rounded text-neutral-800 font-medium">المقاس: {item.size}</span>
                            {item.color && (
                              <span className="bg-neutral-100 px-2 py-0.5 rounded text-neutral-800 font-medium">اللون: {item.color}</span>
                            )}
                            <span className="bg-black text-white px-2 py-0.5 rounded font-bold">الكمية: {item.quantity}</span>
                          </div>
                          <p className="text-sm font-black text-neutral-900 pt-1 font-mono">
                            {(item.product.priceDZD * item.quantity).toFixed(0)} DA
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Total Amount Breakdown (دقيق 100% ومطابق لطلب العميل) */}
                <div className="bg-neutral-50 p-4 sm:p-5 rounded-xl border border-neutral-200 text-xs text-neutral-700 space-y-2.5">
                  <div className="flex justify-between items-center text-neutral-600">
                    <span>المجموع الفرعي:</span>
                    <span className="font-semibold font-mono">{confirmedOrder.subtotal.toFixed(0)} DA</span>
                  </div>
                  <div className="flex justify-between items-center text-neutral-600">
                    <span>مصاريف الشحن ({confirmedOrder.wilayaName}):</span>
                    <span className="font-semibold font-mono">{confirmedOrder.shippingCost > 0 ? `${confirmedOrder.shippingCost} DA` : 'مجاناً'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm sm:text-base font-bold text-neutral-900 pt-2.5 border-t border-neutral-200">
                    <span>المبلغ الإجمالي المستحق:</span>
                    <span className="text-lg sm:text-xl font-black text-black font-mono">{confirmedOrder.total.toFixed(0)} DA</span>
                  </div>
                  <div className="text-[11px] text-neutral-500 text-center pt-2 border-t border-neutral-200 flex items-center justify-center space-x-1.5 space-x-reverse">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>الدفع نقداً عند استلام ومعاينة الطلبية (Cash on Delivery)</span>
                  </div>
                </div>

              </div>

            </div>

            {/* BOTTOM CARD: CONTINUE SHOPPING & RECOMMENDED PRODUCTS */}
            <div className="bg-white border border-neutral-200/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm text-center space-y-6">
              <div>
                <h3 className="font-sans text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-neutral-900">
                  CONTINUE SHOPPING
                </h3>
                <p className="text-xs text-neutral-500 font-sans mt-1">
                  منتجات أخرى قد تنال إعجابكم من تشكيلة FREMKYS
                </p>
              </div>

              {/* 3 Product Cards in 1 Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recommendedProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onSelectProduct ? onSelectProduct(p) : onNavigateHome()}
                    className="group bg-[#FAFAFA] border border-neutral-200 rounded-xl p-4 hover:border-black hover:bg-white hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center"
                  >
                    {/* Thumbnail Container */}
                    <div className="w-full aspect-square bg-white rounded-lg overflow-hidden flex items-center justify-center p-2 mb-3 border border-neutral-100 group-hover:border-neutral-300 transition-colors">
                      {isVideoMedia(p.image) ? (
                        <video
                          src={p.image}
                          muted
                          playsInline
                          preload="none"
                          width={200}
                          height={200}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <img
                          src={p.image}
                          alt={p.name}
                          loading="lazy"
                          decoding="async"
                          width={200}
                          height={200}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                        />
                      )}
                    </div>
                    
                    {/* Product Category/Title */}
                    <h4 className="font-sans text-[12px] font-bold uppercase tracking-wider text-neutral-900 group-hover:underline truncate w-full">
                      {p.name}
                    </h4>
                    
                    {/* Price */}
                    <span className="text-xs font-bold text-neutral-900 mt-2 font-mono">
                      {p.priceDZD} DA
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom Two Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <button
                  onClick={onGoToShop || onNavigateHome}
                  className="w-full h-12 bg-black text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-[0.2em] transition-colors flex items-center justify-center cursor-pointer rounded-lg shadow-sm"
                >
                  <span>CONTINUE SHOPPING</span>
                </button>

                <button
                  onClick={() => {
                    const detailsEl = document.getElementById('order-details-section');
                    if (detailsEl) {
                      detailsEl.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full h-12 bg-white text-black border border-black hover:bg-neutral-50 text-xs font-bold uppercase tracking-[0.2em] transition-colors flex items-center justify-center cursor-pointer rounded-lg"
                >
                  <span>VIEW ORDER DETAILS</span>
                </button>
              </div>

            </div>

          </div>
        ) : cart.length === 0 ? (
          /* حالة السلة فارغة */
          <div className="py-24 text-center space-y-4 max-w-md mx-auto animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
              <Package className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-light uppercase tracking-wider text-black">
              سلة التسوق فارغة
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
              لم تقم بإضافة أي قطعة إلى سلتك بعد. تفضل بتصفح التشكيلة الحصرية واختيار ما يناسبك.
            </p>
            <div className="pt-2">
              <button
                onClick={onGoToShop || onNavigateHome}
                className="px-8 py-3.5 bg-black text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                تصفح التشكيلة الآن
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Back Link */}
            <div className="mb-6 flex items-center justify-start">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 space-x-reverse text-neutral-600 hover:text-black transition-colors text-[13px] font-medium cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                <span>العودة</span>
              </button>
            </div>

            {/* Page Title & Subtitle */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-medium text-black tracking-tight">
                إتمام الطلب
              </h1>
              <p className="text-xs sm:text-[13px] text-neutral-500 font-sans mt-1.5 flex items-center justify-center space-x-1.5 space-x-reverse">
                <Truck className="w-3.5 h-3.5 text-black" />
                <span>الدفع نقداً عند استلام ومعاينة طلبيتك</span>
              </p>
            </div>
          
            {/* 2-COLUMN CHECKOUT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column (Width ~ 60% in Desktop): Single Step Order Form */}
            <div className="lg:col-span-7 bg-white border border-neutral-200/90 p-6 sm:p-8 shadow-xs">
              
              <form onSubmit={handleFinalOrderSubmit} className="space-y-5 text-right">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 border border-emerald-200">
                    الدفع عند الاستلام
                  </span>
                  <h2 className="text-[16px] font-bold text-black flex items-center space-x-2 space-x-reverse">
                    <MapPin className="w-4 h-4 text-black" />
                    <span>معلومات الشحن والتوصيل</span>
                  </h2>
                </div>

                {/* 1. Full Name Single Input */}
                <div>
                  <label className="block text-[13px] font-medium text-neutral-800 mb-1.5">
                    الاسم الكامل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="الاسم واللقب"
                    className="w-full px-3.5 py-2.5 text-base sm:text-[13px] bg-white border border-neutral-300 rounded-none focus:border-black focus:outline-none transition-colors text-right"
                  />
                </div>

                {/* 2. Phone Number Input */}
                <div>
                  <label className="block text-[13px] font-medium text-neutral-800 mb-1.5">
                    رقم الهاتف <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    dir="ltr"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05 / 06 / 07 XX XX XX XX"
                    className="w-full px-3.5 py-2.5 text-base sm:text-[13px] bg-white border border-neutral-300 rounded-none focus:border-black focus:outline-none transition-colors text-right font-mono"
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">سنتصل بك على هذا الرقم لتأكيد تفاصيل وموعد الاستلام</p>
                </div>

                {/* 3. Wilaya Select */}
                <div>
                  <label className="block text-[13px] font-medium text-neutral-800 mb-1.5">
                    الولاية <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={selectedWilayaCode}
                    onChange={(e) => setSelectedWilayaCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-base sm:text-[13px] bg-white border border-neutral-300 rounded-none focus:border-black focus:outline-none transition-colors text-right cursor-pointer"
                  >
                    <option value="">-- اختر ولايتك من الـ 58 ولاية --</option>
                    {ALGERIA_58_WILAYAS.map((w) => (
                      <option key={w.code} value={w.code} disabled={!w.isAvailable}>
                        {w.code} - {w.nameAr} ({w.name}) {!w.isAvailable ? '- (غير متوفر)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. City & Address */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[13px] font-medium text-neutral-800 mb-1.5">
                      البلدية / الدائرة
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="مثال: سيدي امحمد، حيدرة..."
                      className="w-full px-3.5 py-2.5 text-base sm:text-[13px] bg-white border border-neutral-300 rounded-none focus:border-black focus:outline-none transition-colors text-right"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[13px] font-medium text-neutral-800 mb-1.5">
                      العنوان الكامل (الحي / الشارع / رقم المنزل) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="الحي، اسم الشارع، رقم العمارة أو المنزل..."
                      className="w-full px-3.5 py-2.5 text-base sm:text-[13px] bg-white border border-neutral-300 rounded-none focus:border-black focus:outline-none transition-colors text-right"
                    />
                  </div>
                </div>

                {/* 5. Delivery Type */}
                <div className="pt-2">
                  <label className="block text-[13px] font-medium text-neutral-800 mb-2">
                    طريقة التوصيل المفضلة
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Option 1: توصيل لباب المنزل */}
                    <button
                      type="button"
                      onClick={() => setDeliveryType('home')}
                      className={`py-3.5 px-4 border flex flex-col items-center justify-center space-y-1.5 transition-all cursor-pointer rounded-none ${
                        activeDeliveryType === 'home'
                          ? 'bg-black text-white border-black font-medium shadow-sm'
                          : 'bg-white text-black border-neutral-300 hover:border-black'
                      }`}
                    >
                      <Truck className="w-4 h-4" />
                      <span className="text-[13px]">توصيل لباب المنزل</span>
                      {selectedWilaya && (
                        <span className={`text-[11px] ${activeDeliveryType === 'home' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                          {selectedWilaya.isAvailable && selectedWilaya.homePrice > 0 ? `${selectedWilaya.homePrice} DA` : 'غير متوفر'}
                        </span>
                      )}
                    </button>

                    {/* Option 2: توصيل للمكتب (Stop Desk) */}
                    <button
                      type="button"
                      disabled={!selectedWilaya || !selectedWilaya.isAvailable || selectedWilaya.deskPrice === 0}
                      onClick={() => {
                        if (selectedWilaya && selectedWilaya.deskPrice > 0) {
                          setDeliveryType('desk');
                        }
                      }}
                      className={`py-3.5 px-4 border flex flex-col items-center justify-center space-y-1.5 transition-all rounded-none ${
                        activeDeliveryType === 'desk' && selectedWilaya?.deskPrice && selectedWilaya.deskPrice > 0
                          ? 'bg-black text-white border-black font-medium shadow-sm cursor-pointer'
                          : (!selectedWilaya || !selectedWilaya.isAvailable || selectedWilaya.deskPrice === 0)
                            ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed'
                            : 'bg-white text-black border-neutral-300 hover:border-black cursor-pointer'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      <span className="text-[13px]">توصيل للمكتب (Stop Desk)</span>
                      {selectedWilaya && (
                        <span className={`text-[11px] ${activeDeliveryType === 'desk' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                          {selectedWilaya.deskPrice > 0 ? `${selectedWilaya.deskPrice} DA` : 'غير متوفر للمكتب'}
                        </span>
                      )}
                    </button>
                  </div>

                  <p className="mt-2 text-[11.5px] text-neutral-500">
                    {selectedWilaya 
                      ? (!selectedWilaya.isAvailable 
                          ? 'التوصيل غير متوفر لهذه الولاية'
                          : `سعر الشحن للولاية المختارة (${selectedWilaya.nameAr}) - ${activeDeliveryType === 'home' ? 'توصيل للمنزل' : 'توصيل للمكتب'}: ${shippingCost} DA`
                        )
                      : 'اختر الولاية أولاً لمعرفة الأسعار المتاحة'
                    }
                  </p>
                </div>

                {/* 6. طريقة الدفع: الدفع نقداً عند الاستلام فقط (COD) */}
                <div className="p-4 bg-[#FAF9F7] border border-neutral-200 text-right space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 border border-emerald-200 uppercase tracking-wider">
                      دفع مضمون
                    </span>
                    <div className="flex items-center space-x-2 space-x-reverse font-bold text-[13px] text-black">
                      <Truck className="w-4 h-4 text-black" />
                      <span>الدفع نقداً عند استلام ومعاينة الطلبية (COD)</span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed pr-6">
                    ادفع نقداً لمندوب التوصيل بعد استلام الطرد وفحص المنتج والاطمئنان عليه.
                  </p>
                </div>

                {/* 7. Notes (Optional) Textarea */}
                <div>
                  <label className="block text-[13px] font-medium text-neutral-800 mb-1.5">
                    ملاحظات للطلب (اختياري)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="أي ملاحظات إضافية بخصوص وقت التسليم أو العنوان..."
                    className="w-full px-3.5 py-2.5 text-[13px] bg-white border border-neutral-300 rounded-none focus:border-black focus:outline-none transition-colors text-right resize-none"
                  />
                </div>

                {/* 8. Security Guarantee Badge */}
                <div className="flex items-center space-x-2 space-x-reverse text-xs text-neutral-600 bg-neutral-50 p-3 border border-neutral-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>ضمان الجودة والأصالة 100% مع إمكانية المعاينة قبل الدفع ومهلة 7 أيام للاستبدال.</span>
                </div>

                {/* Big Black CTA: تأكيد الطلب مباشرة */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 bg-black hover:bg-neutral-900 text-white text-[14px] font-bold tracking-wide transition-colors rounded-none cursor-pointer flex items-center justify-center space-x-2 space-x-reverse shadow-md"
                  >
                    <span>تأكيد الطلب الآن ({totalDZD.toFixed(0)} DA)</span>
                  </button>
                </div>
              </form>

            </div>

            {/* Right Column (Width ~ 38% in Desktop): ملخص الطلب Card */}
            <div className="lg:col-span-5 bg-white border border-neutral-200/90 p-6 shadow-xs text-right">
              
              <h2 className="text-[16px] font-bold text-black pb-3 border-b border-neutral-100 mb-5">
                ملخص الطلب ({cart.reduce((a, b) => a + b.quantity, 0)} قطعة)
              </h2>

              {/* Items in Cart */}
              <div className="divide-y divide-neutral-100">
                {cart.map((item, idx) => (
                  <div key={idx} className="py-3.5 flex items-center justify-between first:pt-0">
                    
                    {/* Price on Left */}
                    <div className="text-[13.5px] font-medium text-black font-sans font-mono">
                      {(item.product.priceDZD * item.quantity).toFixed(0)} DA
                    </div>

                    {/* Image & Details on Right */}
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="text-right">
                        <h4 className="text-[13px] font-medium text-black leading-snug">
                          {item.product.name}
                        </h4>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          المقاس: {item.size}{item.color ? ` | اللون: ${item.color}` : ''} | الكمية: {item.quantity}
                        </p>
                      </div>

                      <div className="w-13 h-15 bg-[#F6F4F0] border border-neutral-200/60 overflow-hidden shrink-0 flex items-center justify-center">
                        {isVideoMedia(item.product.image) ? (
                          <video
                            src={item.product.image}
                            muted
                            playsInline
                            preload="none"
                            width={60}
                            height={70}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            loading="lazy"
                            decoding="async"
                            width={60}
                            height={70}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </div>

                  </div>
                ))}
              </div>

              {/* Subtotal, Shipping, Total Breakdown */}
              <div className="mt-4 pt-4 border-t border-neutral-200/80 space-y-3 text-[13px]">
                
                {/* المجموع الفرعي */}
                <div className="flex items-center justify-between">
                  <span className="font-sans font-medium text-black font-mono">{subtotalDZD.toFixed(0)} DA</span>
                  <span className="text-neutral-700">المجموع الفرعي</span>
                </div>

                {/* الشحن (للمنزل أو للمكتب) */}
                <div className="flex items-center justify-between">
                  <span className={`font-sans font-mono ${selectedWilaya ? 'font-medium text-black' : 'text-neutral-500'}`}>
                    {selectedWilaya 
                      ? (!selectedWilaya.isAvailable 
                          ? 'غير متوفر' 
                          : `${shippingCost.toFixed(0)} DA`) 
                      : 'اختر الولاية'}
                  </span>
                  <span className="text-neutral-700">
                    الشحن ({activeDeliveryType === 'home' ? 'للمنزل' : 'للمكتب'})
                  </span>
                </div>

                {/* Divider Line */}
                <div className="pt-2 border-t border-neutral-300" />

                {/* المجموع الكلي */}
                <div className="flex items-center justify-between text-[15px] md:text-[16px]">
                  <span className="font-bold text-black font-sans font-mono">{totalDZD.toFixed(0)} DA</span>
                  <span className="font-bold text-black">المجموع الكلي</span>
                </div>

              </div>

              {/* Guarantee Note */}
              <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center space-x-2 space-x-reverse text-[11px] text-neutral-500">
                <Truck className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span>توصيل سريع وآمن لجميع الـ 58 ولاية جزائرية</span>
              </div>

            </div>

          </div>
          </>
        )}

      </div>

    </div>
  );
};
