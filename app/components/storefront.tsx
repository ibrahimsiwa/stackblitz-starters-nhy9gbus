'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Eye, X, Lock, Package } from 'lucide-react';

interface StorefrontProps {
  products?: any[];
  setRole: (role: 'visitor' | 'cashier' | 'owner') => void;
  heroBanner?: string;
}

export default function Storefront({ products = [], setRole, heroBanner = '' }: StorefrontProps) {
  const [visitorCart, setVisitorCart] = useState<any>({});
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showVisitorCartModal, setShowVisitorCartModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  const visitorSubtotal = Object.values(visitorCart).reduce((s: number, i: any) => s + (i.price * i.quantity), 0);
  const totalItemsCount = Object.values(visitorCart).reduce((s: number, i: any) => s + i.quantity, 0);

  const addToVisitorCart = (p: any) => {
    setVisitorCart((prev: any) => ({
      ...prev,
      [p.id]: { ...p, quantity: (prev[p.id]?.quantity || 0) + 1 }
    }));
  };

  const updateVisitorCartQty = (id: number, change: number) => {
    setVisitorCart((prev: any) => {
      const item = prev[id]; if (!item) return prev;
      const nextQty = item.quantity + change;
      if (nextQty <= 0) { const { [id]: _, ...rest } = prev; return rest; }
      return { ...prev, [id]: { ...item, quantity: nextQty } };
    });
  };

  const handleSendWhatsAppOrder = () => {
    let itemsLines = '';
    Object.values(visitorCart).forEach((i: any) => {
      itemsLines += `• ${i.name} (عدد ${i.quantity}) -> ${i.price * i.quantity} ج.م\n`;
    });
    
    const message = `✨ طلب شراء موحد - متجر ابن شالي الفاخر ✨\n------------------------\nيسعدني طلب باقة المنتجات الطبيعية التالية:\n\n${itemsLines}\n------------------------\nإجمالي قيمة الطلب: ${visitorSubtotal} ج.م\n------------------------\nبرجاء مراجعة الطلب وتأكيد الشحن والتوصيل للمنزل.\nخلاصة الود.`;
    window.open(`https://wa.me/201094241177?text=${encodeURIComponent(message)}`, '_blank');
    setVisitorCart({});
    setShowVisitorCartModal(false);
  };

  const handleVerifyAccess = () => {
    if (passwordInput === "325748619") {
      setRole('cashier');
      setShowAuthModal(false);
      setPasswordInput('');
    } else {
      alert("رمز الأمان الموحد غير صحيح. يرجى مراجعة ميثاق العهدة.");
    }
  };

  return (
    <div className="min-h-screen bg-siwa-beige text-siwa-brown font-sans antialiased selection:bg-siwa-spring/10 selection:text-siwa-spring">
      <header className="py-12 text-center bg-white/90 backdrop-blur-sm border-b border-siwa-brown/5 sticky top-0 z-30 shadow-sm">
        <h1 className="text-4xl md:text-5xl font-black tracking-widest text-siwa-brown font-serif">ابن شالي</h1>
        <p className="text-[10px] uppercase tracking-widest text-siwa-spring font-black mt-1.5 tracking-wider">IBN SHALI • خلاصة الود</p>
      </header>

      <section className="relative h-80 md:h-[400px] w-full bg-siwa-brown/5 overflow-hidden flex items-center justify-center border-b border-siwa-brown/5">
        {heroBanner ? (
          <Image src={heroBanner} alt="واحة سيوة الطبيعية" fill unoptimized className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-siwa-brown/10 to-siwa-beige flex flex-col items-center justify-center text-center p-6 space-y-2">
            <h2 className="text-2xl font-bold tracking-wide text-siwa-brown font-serif">جماليات البساطة العريقة</h2>
            <p className="text-xs text-siwa-brown/60 max-w-sm font-medium leading-relaxed">تتنفس الواجهة عبر هوامش عريضة ومساحات ممتدة تعكس طابع النخبوية والفخامة الهادئة.</p>
          </div>
        )}
      </section>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((p) => (
            <div key={p.id} className="bg-white border border-siwa-brown/10 rounded-2xl p-6 flex flex-col justify-between hover:shadow-xl hover:border-siwa-spring/20 transition-all duration-300 group">
              <div className="space-y-4">
                <div onClick={() => setSelectedProduct(p)} className="w-full h-52 bg-siwa-beige rounded-xl overflow-hidden cursor-pointer relative border border-stone-200/40">
                  {p.image_live || p.imageLive ? (
                    <Image src={p.image_live || p.imageLive} alt="" fill unoptimized className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                      <Package className="w-10 h-10 stroke-[1.2]" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 rounded-lg text-[9px] text-siwa-brown font-black border border-siwa-brown/5 flex items-center gap-1 shadow-sm">
                    <Eye className="w-3 h-3 text-siwa-spring" /> استعراض التوثيق والتحاليل
                  </div>
                </div>
                <div className="space-y-1 pt-1">
                  <h3 onClick={() => setSelectedProduct(p)} className="font-bold text-sm text-siwa-brown cursor-pointer hover:text-siwa-spring transition-colors tracking-wide">{p.name}</h3>
                  <p className="text-xs text-siwa-spring font-mono font-black">{p.price} ج.م</p>
                </div>
              </div>
              <button onClick={() => addToVisitorCart(p)} className="w-full bg-siwa-brown hover:bg-siwa-spring text-white font-black text-xs py-3.5 rounded-xl mt-6 tracking-widest shadow-sm transition-all duration-350">
                إضافة إلى السلة +
              </button>
            </div>
          ))}
        </div>
      </main>

      {totalItemsCount > 0 && (
        <button onClick={() => setShowVisitorCartModal(true)} className="fixed bottom-8 left-8 bg-siwa-spring text-white p-4.5 rounded-full shadow-2xl flex items-center gap-2 animate-bounce z-40 border border-siwa-spring/20">
          <ShoppingCart className="w-5 h-5" />
          <span className="bg-white text-siwa-spring rounded-full w-5 h-5 text-[10px] font-black flex items-center justify-center shadow-inner">{totalItemsCount}</span>
          <span className="text-xs font-black font-mono pl-1">{visitorSubtotal} ج</span>
        </button>
      )}

      <footer className="bg-white border-t border-siwa-brown/5 py-12 text-center text-xs text-siwa-brown/50 space-y-2">
        <p className="font-medium tracking-wide">ابن شالي — خلاصة الود © 2026</p>
        <button onClick={() => setShowAuthModal(true)} className="text-[9px] text-stone-400 font-black tracking-widest uppercase block mx-auto pt-2 border-t border-stone-100 w-36 hover:text-siwa-spring transition-colors">
          [ بوابة الولوج والتحقق للعهدات ]
        </button>
      </footer>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-siwa-brown/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-white border border-siwa-brown/20 rounded-3xl p-6 max-w-4xl w-full relative shadow-2xl space-y-6">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-5 left-5 text-siwa-brown/40 hover:text-siwa-brown p-1.5 rounded-full hover:bg-stone-100 transition-all"><X className="w-5 h-5" /></button>
            
            <div className="border-b border-siwa-brown/5 pb-3 text-right">
              <h3 className="text-base font-black text-siwa-brown tracking-wide">{selectedProduct.name}</h3>
              <p className="text-[10px] text-siwa-spring font-black tracking-widest uppercase mt-0.5 font-mono">ORIGIN SPECIFICATION • وثيقة التوثيق والتحاليل الفنية</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start pt-2">
              <div className="space-y-2 bg-siwa-beige/60 p-4 rounded-2xl border border-siwa-brown/5 text-xs leading-relaxed font-semibold">
                <span className="text-[9px] text-siwa-spring font-black uppercase tracking-wider block mb-1">🌿 ميثاق الحيوية والصحة</span>
                <p className="text-siwa-brown font-medium">{selectedProduct.benefits || selectedProduct.description}</p>
              </div>

              <div className="flex flex-col items-center justify-center space-y-3 py-2">
                {selectedProduct.image_live || selectedProduct.imageLive ? (
                  <div className="relative w-40 h-40 rounded-xl overflow-hidden shadow border border-stone-200">
                    <Image src={selectedProduct.image_live || selectedProduct.imageLive} alt="" fill unoptimized className="object-cover" />
                  </div>
                ) : (
                  <div className="w-40 h-40 bg-siwa-beige rounded-xl flex items-center justify-center text-stone-300 border border-dashed border-stone-300/60"><Package className="w-8 h-8" /></div>
                )}
                <span className="text-siwa-spring font-mono font-black text-sm bg-siwa-spring/5 px-3 py-1 rounded-xl border border-siwa-spring/10">{selectedProduct.price} ج.م</span>
              </div>

              <div className="space-y-2 bg-siwa-beige/60 p-4 rounded-2xl border border-siwa-brown/5 text-xs leading-relaxed font-medium">
                <span className="text-[9px] text-siwa-spring font-black uppercase tracking-wider block mb-1">🔬 المقاييس والتحاليل التقنية</span>
                <p className="text-siwa-brown font-black bg-white p-2.5 rounded-xl border border-stone-200/40 text-center tracking-wide">{selectedProduct.specification || 'المنشأ: واحة سيوة الطبيعية البكر الموثقة.'}</p>
                <p className="text-[11px] text-siwa-brown/70 mt-1 leading-relaxed">{selectedProduct.description}</p>
              </div>
            </div>

            <button onClick={() => { addToVisitorCart(selectedProduct); setSelectedProduct(null); }} className="w-full bg-siwa-spring hover:brightness-90 text-white font-black text-xs py-3.5 rounded-xl transition tracking-widest shadow-md">إضافة الصنف وتأكيد الحجز بالسلة الفاخرة</button>
          </div>
        </div>
      )}

      {showVisitorCartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-siwa-brown/70 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-3xl border border-siwa-brown/10 bg-white p-6 space-y-4 shadow-2xl relative">
            <button onClick={() => setShowVisitorCartModal(false)} className="absolute top-4 left-4 text-stone-400 hover:text-stone-700"><X className="w-4 h-4" /></button>
            <h3 className="text-xs font-black text-siwa-brown uppercase border-b border-stone-100 pb-2 flex items-center gap-1.5"><ShoppingCart className="w-4 h-4 text-siwa-spring" /> باقة طلباتك الحالية الفاخرة</h3>
            
            <div className="space-y-2 max-h-52 overflow-y-auto">
              {Object.values(visitorCart).map((item: any) => (
                <div key={item.id} className="flex justify-between items-center text-xs bg-siwa-beige/40 p-2.5 rounded-xl border border-stone-200/40">
                  <span className="font-bold text-siwa-brown truncate max-w-[160px]">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateVisitorCartQty(item.id, -1)} className="bg-stone-200 w-5 h-5 rounded flex items-center justify-center font-bold text-siwa-brown">-</button>
                    <span className="font-mono font-black text-siwa-brown">{item.quantity}</span>
                    <button onClick={() => updateVisitorCartQty(item.id, 1)} className="bg-stone-200 w-5 h-5 rounded flex items-center justify-center font-bold text-siwa-brown">+</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-100 flex justify-between items-center text-xs font-black text-siwa-spring">
              <span>إجمالي قيمة المشتريات:</span><span className="font-mono text-sm font-black">{visitorSubtotal} ج.م</span>
            </div>

            <button onClick={handleSendWhatsAppOrder} className="w-full bg-siwa-spring hover:brightness-90 text-white font-black text-xs py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-md tracking-widest">
              <span>إرسال الطلب موحداً عبر واتساب</span> 📱
            </button>
          </div>
        </div>
      )}

      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-siwa-brown/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-siwa-brown/20 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-siwa-spring/10 border border-siwa-spring/20 flex items-center justify-center mx-auto"><Lock className="w-5 h-5 text-siwa-spring" /></div>
            <div className="space-y-1"><h3 className="text-sm font-black text-siwa-brown">بوابة الولوج والتحقق للعهدات</h3><p className="text-[11px] text-siwa-brown/60">يرجى إدخال رمز الأمان الموثق لبراند ابن شالي لفتح شاشة المبيعات والفرع.</p></div>
            <input type="password" placeholder="أدخل رمز التحقق الفاخر..." value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full bg-white border border-siwa-brown/10 rounded-xl px-3 py-3 text-center text-xs tracking-widest font-mono focus:outline-none" />
            <div className="flex gap-2 pt-2">
              <button onClick={handleVerifyAccess} className="flex-1 bg-siwa-spring text-white text-xs font-black py-2.5 rounded-xl transition">تأكيد والولوج</button>
              <button onClick={() => { setShowAuthModal(false); setPasswordInput(''); }} className="bg-stone-100 text-siwa-brown text-xs px-4 rounded-xl transition">إلغاء</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}