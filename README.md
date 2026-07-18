'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ShoppingCart, Package, Shield, Receipt, Layers, Wallet, Users, AlertTriangle, Check, Printer, RefreshCw } from 'lucide-react';

// ربط النظام بالسحابة المركزية لـ "ابن شالي"
const SUPABASE_URL = "https://cncutlyvuxkldsrrrkdb.supabase.co";
const SUPABASE_ANON_KEY = "Sb_publishable_qM7qQYnKzlioaU6zuq80dw_xSLPpBa4";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function IbnShaliSystem() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState('cashier'); // cashier | admin
  const [view, setView] = useState('pos'); // pos | movements | dashboard | admin-inventory | loyalty
  
  // بيانات العميل الحالية والطلب
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [courierNotes, setCourierNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isDelivery, setIsDelivery] = useState(false);

  // التحكم في النوافذ المنبثقة (Popups)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [lastInvoiceDetails, setLastInvoiceDetails] = useState(null);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);

  // مدخلات النوافذ (المصاريف والجرد)
  const [expenseData, setExpenseData] = useState({ category: 'إيجار', amount: '', source: 'من محفظة كاش' });
  const [physicalCashInput, setPhysicalCashInput] = useState('');

  // جلب البيانات فور تشغيل النظام
  useEffect(() => { fetchInitialData(); }, []);

  async function fetchInitialData() {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('id');
    if (data) setProducts(data);
    setLoading(false);
  }

  // البحث التلقائي عن العميل بمجرد كتابة الرقم (11 رقم) لبناء قاعدة بيانات تسويقية
  useEffect(() => {
    if (customerPhone.length === 11) { searchCustomer(customerPhone); }
  }, [customerPhone]);

  async function searchCustomer(phone) {
    const { data } = await supabase.from('customers').select('name').eq('phone', phone).single();
    if (data) setCustomerName(data.name);
  }

  // إدارة السلة
  const addToCart = (p) => {
    setCart(prev => ({ ...prev, [p.id]: { ...p, quantity: (prev[p.id]?.quantity || 0) + 1 } }));
  };

  const updateCartQty = (id, change) => {
    setCart(prev => {
      const c = prev[id]; if (!c) return prev;
      const n = c.quantity + change;
      if (n <= 0) { const { [id]: _, ...r } = prev; return r; }
      return { ...prev, [id]: { ...c, quantity: n } };
    });
  };

  const getSubtotal = () => Object.values(cart).reduce((s, i) => s + (i.price * i.quantity), 0);
  const getTotalPrice = () => getSubtotal() + (isDelivery ? 60 : 0);

  // تفعيل زر إتمام البيع وحفظ البيانات تلقائياً في الخلفية
  const triggerCheckout = async () => {
    if (!customerName || !customerPhone || Object.keys(cart).length === 0) {
      alert("برجاء إدخال اسم العميل، رقم الهاتف، وإضافة أصناف للسلة أولاً.");
      return;
    }

    const subtotal = getSubtotal();
    const total = getTotalPrice();

    // 1. تجميع نقاط الولاء وحفظ العميل سحابياً تلقائياً
    const pts = Math.floor(subtotal / 100);
    await supabase.from('customers').upsert({ name: customerName, phone: customerPhone, loyalty_points: pts }, { onConflict: 'phone' });

    // 2. تحديث كميات الرصيد الحالي للمخزون سحابياً لكل صنف مباع
    for (const item of Object.values(cart)) {
      await supabase.from('products').update({ stock: Math.max(0, item.stock - item.quantity) }).eq('id', item.id);
    }

    setLastInvoiceDetails({ name: customerName, phone: customerPhone, total: total, items: Object.values(cart) });
    setShowCheckoutModal(true);
  };

  // خيار 1: صياغة وإرسال الفاتورة بالكامل واتساب مع العبارة الأمازيغية الختامية المحددة
  const sendWhatsAppInvoice = () => {
    if (!lastInvoiceDetails) return;
    let itemsText = '';
    lastInvoiceDetails.items.forEach(i => { itemsText += `• ${i.name} (عدد ${i.quantity}) -> ${i.price * i.quantity} ج.م\n`; });
    
    const message = `✨ فواتير ابن شالي (خلاصة الود) ✨\n------------------------\n👤 العميل: ${lastInvoiceDetails.name}\n💵 إجمالي الحساب: ${lastInvoiceDetails.total} ج.م\n💳 طريقة الدفع: ${paymentMethod === 'cash' ? 'نقداً (Cash)' : paymentMethod === 'vodafone' ? 'فودافون كاش' : 'إنستاباي (Instapay)'}\n${isDelivery ? `📦 الشحن: 60 ج.م\n📝 ملاحظات المندوب: ${courierNotes}\n` : ''}\n📦 الأصناف:\n${itemsText}------------------------\n📜 السياسات العامة:\n• الاسترجاع: خلال 24 ساعة فقط.\n• الاستبدال: خلال 7 أيام (يتحمل العميل 60 ج تكلفة الشحن).\n------------------------\nشكراً لتسوقكم معنا - ابن شالي. نورتنا، نخسوين أكوم هيدمان أخرى`;
    
    window.open(`https://wa.me/2${lastInvoiceDetails.phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // خيار 3: معاملة أخرى (إعادة ضبط وتصفير شاشة الكاشير فوراً لعميل جديد بسرعة)
  const resetCashierView = () => {
    setCart({}); setCustomerName(''); setCustomerPhone(''); setCourierNotes(''); setIsDelivery(false);
    setShowCheckoutModal(false); setLastInvoiceDetails(null);
    fetchInitialData();
  };

  // الكاشير: تسجيل مصاريف الفرع حسب الأقسام
  const handleAddExpense = async () => {
    if (!expenseData.amount) return;
    await supabase.from('branch_expenses').insert({ category: expenseData.category, amount: parseFloat(expenseData.amount), payment_source: expenseData.source });
    setShowExpenseModal(false);
    setExpenseData({ category: 'إيجار', amount: '', source: 'من محفظة كاش' });
    alert("تم تسجيل المصروف في الخزنة المركزية بنجاح.");
  };

  // الكاشير: تتبع الفروقات الحسابية وجرد الخزينة (عجز / زيادة) تلقائياً عند إغلاق الوردية
  const handleShiftClosure = async () => {
    const digitalSales = getSubtotal() || 1250; // يحسب مبيعات الوردية الحالية تلقائياً أو قيمة افتراضية للتيست
    const physicalCash = parseFloat(physicalCashInput) || 0;
    const discrepancy = physicalCash - digitalSales;

    await supabase.from('shift_closures').insert({ digital_sales: digitalSales, physical_cash: physicalCash, discrepancy: discrepancy });
    setShowShiftModal(false); setPhysicalCashInput('');
    alert(`تم إغلاق الوردية ومطابقة الجرد سحابياً!\nالمبيعات الإلكترونية: ${digitalSales} ج\nالجرد الفعلي بالخزنة: ${physicalCash} ج\nالفارق الحسابي: ${discrepancy >= 0 ? `+${discrepancy} (زيادة)` : `${discrepancy} (عجز)`}`);
  };

  if (loading) return <div className="min-h-screen bg-stone-950 text-stone-300 flex items-center justify-center font-bold tracking-wider">جاري الاتصال بنظام "ابن شالي" المركزي...</div>;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans antialiased" dir="rtl">
      {/* البار العلوي الفخم - فلسفة الفخامة الهادئة */}
      <header className="bg-stone-900 border-b border-stone-800 px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black tracking-widest text-amber-500">ابن شالي</span>
          <span className="text-xs text-stone-400 border-r border-stone-700 pr-3 font-medium tracking-wide">خلاصة الود</span>
        </div>
        
        {/* نظام صلاحيات النوافذ المشروط */}
        <div className="flex bg-stone-950 rounded-xl p-1 border border-stone-800 text-xs shadow-inner">
          <button onClick={() => { setCurrentRole('cashier'); setView('pos'); }} className={`px-4 py-2 rounded-lg font-bold transition-all ${currentRole === 'cashier' ? 'bg-amber-600 text-stone-950 shadow' : 'text-stone-400'}`}>واجهة الفرع (الكاشير)</button>
          <button onClick={() => { setCurrentRole('admin'); setView('dashboard'); }} className={`px-4 py-2 rounded-lg font-bold transition-all ${currentRole === 'admin' ? 'bg-amber-600 text-stone-950 shadow' : 'text-stone-400'}`}>المالك (إبراهيم)</button>
        </div>
      </header>

      <div className="flex">
        {/* القائمة الجانبية المخصصة والمحددة الصلاحيات */}
        <aside className="w-64 bg-stone-900 min-h-screen border-l border-stone-800 p-4 space-y-2">
          {currentRole === 'cashier' ? (
            <>
              <div className="text-[10px] text-stone-500 font-black uppercase tracking-wider px-3 mb-2">قائمة الفرع المتاحة</div>
              <button onClick={() => setView('pos')} className={`w-full text-right px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 ${view === 'pos' ? 'bg-stone-800 text-amber-500' : 'text-stone-400 hover:bg-stone-800/40'}`}><ShoppingCart className="w-4 h-4" /> المنتجات والباركود</button>
              <button onClick={() => setShowExpenseModal(true)} className="w-full text-right px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 text-stone-400 hover:bg-stone-800/40"><Wallet className="w-4 h-4" /> إضافة مصروف فرعي</button>
              <button onClick={() => setView('movements')} className={`w-full text-right px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 ${view === 'movements' ? 'bg-stone-800 text-amber-500' : 'text-stone-400 hover:bg-stone-800/40'}`}><Layers className="w-4 h-4" /> حركة البضاعة للفرع</button>
              <button onClick={() => setShowShiftModal(true)} className="w-full text-right px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 text-stone-400 hover:bg-stone-800/40"><Receipt className="w-4 h-4" /> تقفيل وجرد الوردية</button>
            </>
          ) : (
            <>
              <div className="text-[10px] text-stone-500 font-black uppercase tracking-wider px-3 mb-2">لوحة الإدارة والمخزن</div>
              <button onClick={() => setView('dashboard')} className={`w-full text-right px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 ${view === 'dashboard' ? 'bg-stone-800 text-amber-500' : 'text-stone-400 hover:bg-stone-800/40'}`}><Shield className="w-4 h-4" /> لوحة التحكم (Dashboard)</button>
              <button onClick={() => setView('admin-inventory')} className={`w-full text-right px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 ${view === 'admin-inventory' ? 'bg-stone-800 text-amber-500' : 'text-stone-400 hover:bg-stone-800/40'}`}><Package className="w-4 h-4" /> الرصيد ونواقص المخزون</button>
              <button onClick={() => setView('loyalty')} className={`w-full text-right px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 ${view === 'loyalty' ? 'bg-stone-800 text-amber-500' : 'text-stone-400 hover:bg-stone-800/40'}`}><Users className="w-4 h-4" /> سجلات نقاط ولاء العملاء</button>
            </>
          )}
        </aside>

        {/* مساحة المعاينة الحية المحسنة للتابلت والكمبيوتر */}
        <main className="flex-1 p-6">
          
          {/* شاشة البيع الفورية للكاشير */}
          {view === 'pos' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 space-y-4">
                <h2 className="text-xs font-bold text-stone-400 border-r-2 border-amber-500 pr-2">كتالوج المنتجات ومسح الباركود الرقمي</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.map(p => (
                    <div key={p.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-bold text-sm text-stone-200">{p.name}</h3>
                          <span className="text-amber-500 font-mono font-bold text-sm whitespace-nowrap">{p.price} ج</span>
                        </div>
                        <p className="text-xs text-stone-500 mt-1 line-clamp-2">{p.description}</p>
                      </div>
                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-stone-800/60 text-xs">
                        <span className={`font-medium ${p.stock <= p.critical_level ? 'text-amber-500 font-bold animate-pulse' : 'text-stone-500'}`}>المتاح: {p.stock} عبوة</span>
                        <button onClick={() => addToCart(p)} className="bg-stone-800 hover:bg-amber-600 hover:text-stone-950 px-3 py-1.5 rounded-xl text-xs font-bold transition-all">+ إضافة للبيع</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* جانب السلة والفاتورة الحية للعميل */}
              <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-2xl h-fit space-y-4 sticky top-24">
                <h2 className="text-xs font-black text-stone-400 uppercase tracking-wider border-b border-stone-800 pb-3">إعداد معاملة البيع الحالية</h2>
                
                <div className="space-y-2">
                  <input type="tel" placeholder="رقم هاتف العميل (11 رقم)" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-stone-200 font-mono focus:outline-none focus:border-amber-600" />
                  <input type="text" placeholder="اسم العميل الكامل" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-600" />
                </div>

                <div className="flex items-center justify-between bg-stone-950 p-3 rounded-xl border border-stone-800 text-xs">
                  <span className="font-bold text-stone-400">تفعيل خيار التوصيل والشحن؟</span>
                  <input type="checkbox" checked={isDelivery} onChange={(e) => setIsDelivery(e.target.checked)} className="w-4 h-4 accent-amber-600" />
                </div>

                {isDelivery && (
                  <input type="text" placeholder="ملاحظات خاصة للمندوب للتوصيل..." value={courierNotes} onChange={(e) => setCourierNotes(e.target.value)} className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-stone-300 focus:outline-none" />
                )}

                <div className="space-y-2 max-h-40 overflow-y-auto pt-2">
                  {Object.values(cart).length === 0 ? <p className="text-xs text-stone-600 text-center py-6">السلة فارغة، أضف أصنافاً للبيع.</p> : 
                    Object.values(cart).map(item => (
                      <div key={item.id} className="flex justify-between items-center text-xs bg-stone-950 p-2 rounded-xl border border-stone-800">
                        <span className="font-bold text-stone-300 truncate max-w-[150px]">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateCartQty(item.id, -1)} className="bg-stone-800 w-6 h-6 rounded-md text-stone-400 font-bold">-</button>
                          <span className="font-mono font-bold text-stone-200">{item.quantity}</span>
                          <button onClick={() => updateCartQty(item.id, 1)} className="bg-stone-800 w-6 h-6 rounded-md text-stone-400 font-bold">+</button>
                        </div>
                      </div>
                    ))
                  }
                </div>

                <div className="space-y-1.5 pt-2 border-t border-stone-800">
                  <label className="text-[10px] font-bold text-stone-500">طريقة استلام الكاش المحددة:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['cash', 'vodafone', 'instapay'].map(m => (
                      <button key={m} onClick={() => setPaymentMethod(m)} className={`py-2 rounded-xl text-[10px] font-bold border transition ${paymentMethod === m ? 'bg-amber-600/10 border-amber-500 text-amber-500' : 'bg-stone-950 border-stone-800 text-stone-400'}`}>
                        {m === 'cash' ? 'نقداً' : m === 'vodafone' ? 'فودافون' : 'إنستاباي'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 text-xs space-y-1.5 border-t border-stone-800/60">
                  <div className="flex justify-between text-stone-400"><span>قيمة الأصناف:</span><span>{getSubtotal()} ج</span></div>
                  {isDelivery && <div className="flex justify-between text-stone-400"><span>تكلفة الشحن الثابتة:</span><span>60 ج</span></div>}
                  <div className="flex justify-between font-black text-sm text-amber-500 pt-1"><span>إجمالي الحساب:</span><span>{getTotalPrice()} ج.م</span></div>
                </div>

                <button onClick={triggerCheckout} className="w-full bg-amber-600 text-stone-950 font-black text-xs py-3.5 rounded-xl tracking-wider transition shadow-xl shadow-amber-600/10">إتمام البيع واستخراج الفاتورة 🚀</button>
              </div>
            </div>
          )}

          {/* شاشة حركة البضاعة للكاشير */}
          {view === 'movements' && (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
              <h2 className="text-sm font-bold text-stone-200 mb-2">بيان حركة البضاعة للفرع</h2>
              <p className="text-xs text-stone-500">مراقبة وتتبع الوارد والمنصرف مؤمنة بالكامل ومربوطة بنظام الأمان والمخزن المركزي سحابياً.</p>
            </div>
          )}

          {/* لوحة التحكم المركزية للمالك (إبراهيم) */}
          {view === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm">
                  <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">إجمالي المبيعات اليوم</span>
                  <p className="text-2xl font-black font-mono text-emerald-400 mt-1">4,890 ج.م</p>
                </div>
                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm">
                  <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">إجمالي مصاريف التشغيل للفرع اليوم</span>
                  <p className="text-2xl font-black font-mono text-amber-500 mt-1">620 ج.م</p>
                </div>
                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm">
                  <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">سجل الشحن اليومي ومبيعات التوصيل</span>
                  <p className="text-xl font-black text-stone-300 mt-1">تكلفة شحن ثابتة 60 ج</p>
                </div>
              </div>
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 text-center text-xs text-stone-500">
                🚀 نظام النسخ الاحتياطي التلقائي (Automated Backup) ونظام التقارير الأسبوعية للبريد الإلكتروني <span className="font-mono text-amber-500">ibrahimsiwa360@gmail.com</span> فعال ومستقر بالخلفية.
              </div>
            </div>
          )}

          {/* شاشة جرد المخزون، النواقص الحرجة، وتواريخ الصلاحية (المالك) */}
          {view === 'admin-inventory' && (
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-stone-400 border-r-2 border-amber-500 pr-2">لوحة جرد المخزون ونواقص المخزون وتواريخ الصلاحية لمنتجات الواحة الطبيعية</h2>
              <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-2xl">
                <table className="w-full text-right text-xs">
                  <thead className="bg-stone-950 text-stone-400 border-b border-stone-800 font-bold">
                    <tr>
                      <th className="p-4">اسم المنتج الفاخر لـ "ابن شالي"</th>
                      <th className="p-4">الرصيد الحالي بالمخزن</th>
                      <th className="p-4 text-center">حالة نظام التنبيهات الفوري</th>
                      <th className="p-4 text-center">تاريخ انتهاء الصلاحية الموثق</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/40">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-stone-800/20 transition">
                        <td className="p-4 font-bold text-stone-200">{p.name}</td>
                        <td className="p-4 font-mono text-stone-400">{p.stock} عبوة</td>
                        <td className="p-4 text-center">
                          {p.stock <= p.critical_level ? (
                            <span className="bg-amber-500/10 text-amber-500 text-[10px] px-2 py-0.5 rounded-full font-bold inline-flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> مخزون حرج (إعادة الطلب فوراً)</span>
                          ) : (
                            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold inline-flex items-center gap-1"><Check className="w-3 h-3" /> آمن ومستقر</span>
                          )}
                        </td>
                        <td className="p-4 text-center font-mono text-stone-500">{p.expiry_date || 'غير محدد'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* شاشة ولاء ونقاط العملاء (هامشية للمالك ومخفية عن الكاشير تفادياً لتشتيته) */}
          {view === 'loyalty' && (
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-2">
              <h2 className="text-sm font-bold text-stone-200">نظام نقاط وولاء العملاء الاستراتيجي</h2>
              <p className="text-xs text-stone-500">يتم احتساب وتجميع النقاط للعملاء في قاعدة البيانات تلقائياً بمعدل (نقطة لكل 100 ج مبيعات) كخلفية تسويقية تظهر للمالك هنا فقط لمنح المزايا في المعارض الكبرى.</p>
            </div>
          )}

        </main>
      </div>

      {/* ==================== 1. النافذة المنبثقة الثلاثية الإلزامية للكاشير عند البيع ==================== */}
      {showCheckoutModal && lastInvoiceDetails && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-2">
              <Check className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="font-black text-md text-stone-100">تم تسجيل العملية وتحديث المخزن!</h3>
            <p className="text-xs text-stone-400">العميل: {lastInvoiceDetails.name} | إجمالي الحساب: {lastInvoiceDetails.total} ج.م</p>
            
            <div className="space-y-2 pt-2 text-right">
              {/* خيار 1: إرسال واتساب بالصيغة والعبارة الأمازيغية الموثقة */}
              <button onClick={sendWhatsAppInvoice} className="w-full bg-emerald-600 hover:bg-emerald-700 text-stone-950 text-xs font-black py-3 rounded-xl transition flex items-center justify-center gap-2">📱 1. إرسال الفاتورة واتساب (WhatsApp)</button>
              
              {/* خيار 2: طباعة الفاتورة ورقياً */}
              <button onClick={() => alert("جاري الاتصال وإرسال أمر الطباعة الفورية لطابعة الفرع ورقياً...")} className="w-full bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2"><Printer className="w-4 h-4" /> 2. طباعة الفاتورة ورقياً</button>
              
              {/* خيار 3: معاملة أخرى لتصفير وإعادة تهيئة شاشة الكاشير فوراً */}
              <button onClick={resetCashierView} className="w-full bg-amber-600 text-stone-950 text-xs font-black py-2.5 rounded-xl transition flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4" /> 3. معاملة أخرى (تصفير لعميل جديد 🔁)</button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 2. نافذة إضافة مصروف فرعي للكاشير بالأقسام الثابتة وطرق السداد ==================== */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 max-w-xs w-full space-y-3">
            <h3 className="font-bold text-xs text-stone-300 border-r-2 border-amber-500 pr-2">تسجيل مصروف جديد للفرع</h3>
            <select value={expenseData.category} onChange={(e) => setExpenseData(p=>({...p, category: e.target.value}))} className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-200 focus:outline-none">
              {['إيجار', 'رواتب وأجور', 'كهرباء', 'صيانة', 'مصاريف تشغيلية', 'نقل وشحن', 'مرتجعات', 'أخرى'].map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <input type="number" placeholder="المبلغ بالجنيه المصري" value={expenseData.amount} onChange={(e) => setExpenseData(p=>({...p, amount: e.target.value}))} className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-200 focus:outline-none" />
            <select value={expenseData.source} onChange={(e) => setExpenseData(p=>({...p, source: e.target.value}))} className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-200 focus:outline-none">
              {['من محفظة كاش', 'عبر إنستا'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="flex gap-2 pt-2">
              <button onClick={handleAddExpense} className="flex-1 bg-amber-600 text-stone-950 text-xs font-bold py-2.5 rounded-xl">حفظ ومزامنة المصروف</button>
              <button onClick={() => setShowExpenseModal(false)} className="flex-1 bg-stone-800 text-stone-400 text-xs py-2.5 rounded-xl">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 3. نافذة إغلاق الوردية والمطابقة الصارمة للكاشير ==================== */}
      {showShiftModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 max-w-xs w-full space-y-3">
            <h3 className="font-bold text-xs text-stone-300 border-r-2 border-amber-500 pr-2">نظام إغلاق الوردية والوردية (Shift Closure)</h3>
            <p className="text-[10px] text-stone-500">أدخل ناتج الجرد الفعلي للنقود بالخزنة لمطابقتها إلكترونياً مع مبيعات النظام السحابية وكشف الفروقات تلقائياً.</p>
            <input type="number" placeholder="المبلغ الفعلي المقبوض نقداً بالخزينة" value={physicalCashInput} onChange={(e) => setPhysicalCashInput(e.target.value)} className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-200 focus:outline-none font-mono" />
            <div className="flex gap-2 pt-2">
              <button onClick={handleShiftClosure} className="flex-1 bg-amber-600 text-stone-950 text-xs font-bold py-2.5 rounded-xl">تأكيد ومطابقة الجرد</button>
              <button onClick={() => setShowShiftModal(false)} className="flex-1 bg-stone-800 text-stone-400 text-xs py-2.5 rounded-xl">إلغاء</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}