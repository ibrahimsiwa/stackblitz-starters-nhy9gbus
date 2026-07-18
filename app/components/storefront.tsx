'use client';

import React, { useState } from 'react';
import { ShoppingCart, Eye, X, Lock, Package } from 'lucide-react';

interface StorefrontProps {
  products: any[];
  setRole: (role: 'visitor' | 'cashier' | 'owner') => void;
  heroBanner: string;
}

export default function Storefront({ products, setRole, heroBanner }: StorefrontProps) {
  const [visitorCart, setVisitorCart] = useState<any>({});
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showVisitorCartModal, setShowVisitorCartModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');

  // إجماليات سلة المشتريات للزائر
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

  // تجميع الطلبات وإرسالها دفعة واحدة بالواتساب إلى رقمك المعتمد
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

  // جدار حماية بوابة الإدارة بالرمز السري الجديد المعتمد
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
    <div className="min-h-screen bg-[#f5f2eb] text-[#3d2e24] font-sans antialiased selection:bg-[#1e6b65]/10 selection:text-[#1e6b65]">
      
      {/* هيدر الشعار المـُحرر المنساب بوقار ونقاء الـ v0 */}
      <header className="py-12 text-center bg-[#fcfbfa]/90 backdrop-blur-sm border-b border-[#3d2e24]/5 sticky top-0 z-30 shadow-sm">
        <h1 className="text-4xl md:text-5xl font-black tracking-widest text-[#3d2e24] font-serif">ابن شالي</h1>
        <p className="text-[10px] uppercase tracking-widest text-[#1e6b65] font-black mt-1.5 tracking-wider">IBN SHALI • خلاصة الود</p>
      </header>

      {/* مشهد البانر السيوي الواقعي */}
      <section className="relative h-80 md:h-[400px] w-full bg-[#3d2e24]/5 overflow-hidden flex items-center justify-center border-b border-[#3d2e24]/5">
        {heroBanner ? (
          <img src={heroBanner} alt="واحة سيوة الطبيعية" className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#3d2e24]/10 to-[#f5f2eb] flex flex-col items-center justify-center text-center p-6 space-y-2">
            <h2 className="text-2xl font-bold tracking-wide text-[#3d2e24] font-serif">جماليات البساطة العريقة</h2>
            <p className="text-xs text-[#4a3b32]/60 max-w-sm font-medium leading-relaxed">تتنفس الواجهة عبر هوامش عريضة ومساحات ممتدة تعكس طابع النخبوية والفخامة الهادئة.</p>
          </div>
        )}
      </section>

      {/* معرض كروت المنتجات المجرّدة الصافية */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((p) => (
            <div key={p.id} className="bg-[#fcfbfa] border border-[#3d2e24]/10 rounded-2xl p-6 flex flex-col justify-between hover:shadow-xl hover:border-[#1e6b65]/20 transition-all duration-300 group">
              <div className="space-y-4">
                <div onClick={() => setSelectedProduct(p)} className="w-full h-52 bg-[#f5f2eb] rounded-xl overflow-hidden cursor-pointer relative border border-stone-200/40">
                  {p.image_live || p.imageLive ? (
                    <img src={p.image_live || p.imageLive} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-300">
                      <Package className="w-10 h-10 stroke-[1.2]" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-[#fcfbfa]/95 px-2.5 py-1 rounded-lg text-[9px] text-[#4a3b32] font-black border border-[#4a3b32]/5 flex items-center gap-1 shadow-sm">
                    <Eye className="w-3 h-3 text-[#1e6b65]" /> استعراض التوثيق والتحاليل
                  </div>
                </div>
                <div className="space-y-1 pt-1">
                  <h3 onClick={() => setSelectedProduct(p)} className="font-bold text-sm text-[#3d2e24] cursor-pointer hover:text-[#1e6b65] transition-colors tracking-wide">{p.name}</h3>
                  <p className="text-xs text-[#1e6b65] font-mono font-black">{p.price} ج.م</p>
                </div>
              </div>
              <button onClick={() => addToVisitorCart(p)} className="w-full bg-[#3d2e24] hover:bg-[#1e6b65] text-[#fcfbfa] font-black text-xs py-3.5 rounded-xl mt-6 tracking-widest shadow-sm transition-all duration-350">
                إضافة إلى السلة +
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* أيقونة وعربة مبيعات الزائر العائمة الفخمة */}
      {totalItemsCount > 0 && (
        <button onClick={() => setShowVisitorCartModal(true)} className="fixed bottom-8 left-8 bg-[#1e6b65] text-white p-4.5 rounded-full shadow-2xl flex items-center gap-2 animate-bounce z-40 border border-[#1e6b65]/20">
          <ShoppingCart className="w-5 h-5" />
          <span className="bg-[#fcfbfa] text-[#1e6b65] rounded-full w-5 h-5 text-[10px] font-black flex items-center justify-center shadow-inner">{totalItemsCount}</span>
          <span className="text-xs font-black font-mono pl-1">{visitorSubtotal} ج</span>
        </button>
      )}

      {/* فوتر البوابة السرية لرمز التحقق */}
      <footer className="bg-[#fcfbfa] border-t border-[#3d2e24]/5 py-12 text-center text-xs text-[#4a3b32]/50 space-y-2">
        <p className="font-medium tracking-wide">ابن شالي — خلاصة الود © 2026</p>
        <button onClick={() => setShowAuthModal(true)} className="text-[9px] text-stone-400 font-black tracking-widest uppercase block mx-auto pt-2 border-t border-stone-100 w-36 hover:text-[#1e6b65] transition-colors">
          [ بوابة الولوج والتحقق للعهدات ]
        </button>
      </footer>

      {/* نافذة استعراض تفاصيل المنتج والتوثيق المجهري الفخم بنظام الكتل الثلاث الصارم */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3d2e24]/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-[#fcfbfa] border border-[#3d2e24]/20 rounded-3xl p-6 max-w-4xl w-full relative shadow-2xl space-y-6">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-5 left-5 text-[#3d2e24]/40 hover:text-[#3d2e24] p-1.5 rounded-full hover:bg-stone-100 transition-all"><X className="w-5 h-5" /></button>
            
            <div className="border-b border-[#3d2e24]/5 pb-3 text-right">
              <h3 className="text-base font-black text-[#3d2e24] tracking-wide">{selectedProduct.name}</h3>
              <p className="text-[10px] text-[#1e6b65] font-black tracking-widest uppercase mt-0.5 font-mono">ORIGIN SPECIFICATION • وثيقة التوثيق والتحاليل الفنية</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start pt-2">
              <div className="space-y-2 bg-[#f5f2eb]/60 p-4 rounded-2xl border border-[#3d2e24]/5 text-xs leading-relaxed font-semibold">
                <span className="text-[9px] text-[#1e6b65] font-black uppercase tracking-wider block mb-1">🌿 ميثاق الحيوية والصحة</span>
                <p className="text-[#4a3b32] font-medium">{selectedProduct.benefits || selectedProduct.description}</p>
              </div>

              <div className="flex flex-col items-center justify-center space-y-3 py-2">
                {selectedProduct.image_live || selectedProduct.imageLive ? (
                  <img src={selectedProduct.image_live || selectedProduct.imageLive} alt="" className="w-40 h-40 object-cover rounded-xl shadow border border-stone-200" />
                ) : (
                  <div className="w-40 h-40 bg-[#f5f2eb] rounded-xl flex items-center justify-center text-stone-300 border border-dashed border-stone-300/60"><Package className="w-8 h-8" /></div>
                )}
                <span className="text-[#1e6b65] font-mono font-black text-sm bg-[#1e6b65]/5 px-3 py-1 rounded-xl border border-[#1e6b65]/10">{selectedProduct.price} ج.م</span>
              </div>

              <div className="space-y-2 bg-[#f5f2eb]/60 p-4 rounded-2xl border border-[#3d2e24]/5 text-xs leading-relaxed font-medium">
                <span className="text-[9px] text-[#1e6b65] font-black uppercase tracking-wider block mb-1">🔬 المقاييس والتحاليل التقنية</span>
                <p className="text-[#3d2e24] font-black bg-[#fcfbfa] p-2.5 rounded-xl border border-stone-200/40 text-center tracking-wide">{selectedProduct.specification || 'المنشأ: واحة سيوة الطبيعية البكر الموثقة.'}</p>
                <p className="text-[11px] text-[#4a3b32]/70 mt-1 leading-relaxed">{selectedProduct.description}</p>
              </div>
            </div>

            <button onClick={() => { addToVisitorCart(selectedProduct); setSelectedProduct(null); }} className="w-full bg-[#1e6b65] hover:bg-[#154d49] text-white font-black text-xs py-3.5 rounded-xl transition tracking-widest shadow-md">إضافة الصنف وتأكيد الحجز بالسلة الفاخرة</button>
          </div>
        </div>
      )}

      {/* نافذة باقة طلبات السلة الموحدة للزائر */}
      {showVisitorCartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3d2e24]/70 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-3xl border border-[#3d2e24]/10 bg-[#fcfbfa] p-6 space-y-4 shadow-2xl relative">
            <button onClick={() => setShowVisitorCartModal(false)} className="absolute top-4 left-4 text-stone-400 hover:text-stone-700"><X className="w-4 h-4" /></button>
            <h3 className="text-xs font-black text-[#3d2e24] uppercase border-b border-stone-100 pb-2 flex items-center gap-1.5"><ShoppingCart className="w-4 h-4 text-[#1e6b65]" /> باقة طلباتك الحالية الفاخرة</h3>
            
            <div className="space-y-2 max-h-52 overflow-y-auto">
              {Object.values(visitorCart).map((item: any) => (
                <div key={item.id} className="flex justify-between items-center text-xs bg-[#f5f2eb]/40 p-2.5 rounded-xl border border-stone-200/40">
                  <span className="font-bold text-[#3d2e24] truncate max-w-[160px]">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateVisitorCartQty(item.id, -1)} className="bg-stone-200 w-5 h-5 rounded flex items-center justify-center font-bold text-[#3d2e24]">-</button>
                    <span className="font-mono font-black text-[#3d2e24]">{item.quantity}</span>
                    <button onClick={() => updateVisitorCartQty(item.id, 1)} className="bg-stone-200 w-5 h-5 rounded flex items-center justify-center font-bold text-[#3d2e24]">+</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-100 flex justify-between items-center text-xs font-black text-[#1e6b65]">
              <span>إجمالي قيمة المشتريات:</span><span className="font-mono text-sm font-black">{visitorSubtotal} ج.م</span>
            </div>

            <button onClick={handleSendWhatsAppOrder} className="w-full bg-[#1e6b65] hover:bg-[#154d49] text-white font-black text-xs py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-md tracking-widest">
              <span>إرسال الطلب موحداً عبر واتساب</span> 📱
            </button>
          </div>
        </div>
      )}

      {/* نافذة جدار حماية الولوج ببوابة المدير */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3d2e24]/60 backdrop-blur-sm p-4">
          <div className="bg-[#fcfbfa] border border-[#3d2e24]/20 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-[#1e6b65]/10 border border-[#1e6b65]/20 flex items-center justify-center mx-auto"><Lock className="w-5 h-5 text-[#1e6b65]" /></div>
            <div className="space-y-1"><h3 className="text-sm font-black text-[#3d2e24]">بوابة الولوج والتحقق للعهدات</h3><p className="text-[11px] text-[#4a3b32]/60">يرجى إدخال رمز الأمان الموثق لبراند ابن شالي لفتح شاشة المبيعات والفرع.</p></div>
            <input type="password" placeholder="أدخل رمز التحقق الفاخر..." value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full bg-[#fcfbfa] border border-[#4a3b32]/10 rounded-xl px-3 py-3 text-center text-xs tracking-widest font-mono focus:outline-none" />
            <div className="flex gap-2 pt-2">
              <button onClick={handleVerifyAccess} className="flex-1 bg-[#1e6b65] text-white text-xs font-black py-2.5 rounded-xl transition">تأكيد والولوج</button>
              <button onClick={() => { setShowAuthModal(false); setPasswordInput(''); }} className="bg-stone-100 text-[#3d2e24] text-xs px-4 rounded-xl transition">إلغاء</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}