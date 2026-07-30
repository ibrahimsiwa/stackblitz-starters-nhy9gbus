'use client';

import React, { useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface CartLine {
  id: number;
  name: string;
  price: number;
  count: number;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  points: number;
}

interface Expense {
  id: number;
  amount: number;
  reason: string;
  date: string;
}

interface LoyaltySettings {
  pointsPerEGP: number;
  rewardThreshold: number;
}

interface Cashier2Props {
  setRole: (role: 'visitor' | 'cashier' | 'owner' | null) => void;
  cart: CartLine[];
  setCart: (cart: CartLine[] | ((prev: CartLine[]) => CartLine[])) => void;
  products: Product[];
  expenses: Expense[];
  setExpenses: any;
  customers: Customer[];
  setCustomers: any;
  loyaltySettings?: LoyaltySettings;
}

type Tab = 'cashier' | 'expenses';

export default function Cashier2({
  setRole,
  cart,
  setCart,
  products,
  expenses,
  setExpenses,
  customers,
  setCustomers,
  loyaltySettings = { pointsPerEGP: 100, rewardThreshold: 500 },
}: Cashier2Props) {
  const [activeTab, setActiveTab] = useState<Tab>('cashier');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'vodafone' | 'instapay'>('cash');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [newExpense, setNewExpense] = useState({ reason: '', amount: '' });

  function addToCart(product: Product) {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, count: item.count + 1 } : item
        );
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, count: 1 }];
    });
  }

  function removeFromCart(productId: number) {
    setCart(prev => {
      const target = prev.find(item => item.id === productId);
      if (!target) return prev;
      if (target.count > 1) {
        return prev.map(item =>
          item.id === productId ? { ...item, count: item.count - 1 } : item
        );
      }
      return prev.filter(item => item.id !== productId);
    });
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.count, 0);

  function completeSale() {
    if (cart.length === 0) { alert('السلة فارغة'); return; }
    if (!customerName || !customerPhone) { alert('برجاء إدخال اسم ورقم هاتف العميل'); return; }

    const orderNumber = 'ORD-' + Date.now().toString().slice(-6);
    const pointsEarned = Math.floor(total / loyaltySettings.pointsPerEGP);

    setCustomers((prev: Customer[]) => {
      const existing = prev.find(c => c.phone === customerPhone);
      if (existing) {
        return prev.map(c =>
          c.phone === customerPhone ? { ...c, name: customerName, points: c.points + pointsEarned } : c
        );
      }
      return [...prev, { id: prev.length + 1, name: customerName, phone: customerPhone, points: pointsEarned }];
    });

    const paymentLabel =
      paymentMethod === 'cash' ? 'نقداً' : paymentMethod === 'vodafone' ? 'فودافون كاش' : 'إنستاباي';

    let itemsText = '';
    cart.forEach(item => {
      itemsText += `• ${item.name} × ${item.count} = ${item.price * item.count} ج.م
`;
    });

    const message =
      `🧾 طلب جديد - ابن شالي
` +
      `رقم الأوردر: ${orderNumber}
` +
      `------------------------
` +
      `العميل: ${customerName} (${customerPhone})
` +
      `طريقة الدفع: ${paymentLabel}
` +
      `------------------------
` +
      `${itemsText}` +
      `------------------------
` +
      `الإجمالي: ${total} ج.م
` +
      `النقاط المكتسبة: ${pointsEarned}
` +
      `------------------------
` +
      `#نخساوينا_كوم_هيدماناخ`;

    window.open('https://wa.me/201094241177?text=' + encodeURIComponent(message), '_blank');

    setCart([]);
    setCustomerName('');
    setCustomerPhone('');
  }

  function addExpense() {
    if (!newExpense.reason || !newExpense.amount) return;
    const amount = parseFloat(newExpense.amount);
    if (!amount || amount <= 0) return;
    setExpenses((prev: Expense[]) => [
      ...prev,
      { id: prev.length + 1, amount, reason: newExpense.reason, date: new Date().toISOString().split('T')[0] }
    ]);
    setNewExpense({ reason: '', amount: '' });
  }

  return (
    <div className="min-h-screen bg-siwa-beige p-4" dir="rtl">
      {/* شريط التبويبات: كاشير / مصاريف / خروج */}
      <div className="flex justify-center gap-2 mb-6 bg-white/70 p-1.5 rounded-2xl w-fit mx-auto shadow-sm">
        <button
          onClick={() => setActiveTab('cashier')}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition ${activeTab === 'cashier' ? 'bg-siwa-spring text-white' : 'text-siwa-brown'}`}
        >
          كاشير
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition ${activeTab === 'expenses' ? 'bg-siwa-spring text-white' : 'text-siwa-brown'}`}
        >
          مصاريف
        </button>
        <button
          onClick={() => setRole(null)}
          className="px-5 py-2 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition"
        >
          خروج
        </button>
      </div>

      {activeTab === 'cashier' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* المنتجات: أسماء فقط بدون أسعار */}
          <div className="lg:col-span-2">
            <h2 className="text-xs font-bold text-siwa-brown/60 mb-3">المنتجات</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {products.map(p => (
                <button
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className="bg-white border border-siwa-brown/10 rounded-2xl p-4 text-sm font-bold text-siwa-brown hover:border-siwa-gold hover:shadow-md transition text-center"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* السلة والدفع */}
          <div className="bg-white rounded-3xl p-5 shadow-lg space-y-4 h-fit">
            <h2 className="text-xs font-black text-siwa-brown uppercase border-b border-siwa-brown/10 pb-2">السلة</h2>

            <div className="space-y-2 max-h-52 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-xs text-stone-400 text-center py-4">السلة فارغة</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-xs bg-siwa-beige/60 p-2 rounded-xl">
                    <span className="font-bold text-siwa-brown truncate max-w-[90px]">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 bg-white rounded-md font-bold">-</button>
                      <span className="font-mono">{item.count}</span>
                      <button
                        onClick={() => addToCart({ id: item.id, name: item.name, price: item.price })}
                        className="w-6 h-6 bg-white rounded-md font-bold"
                      >
                        +
                      </button>
                      <span className="font-mono font-bold text-siwa-spring w-14 text-left">{item.price * item.count} ج</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <input
              type="text"
              placeholder="اسم العميل"
              value={customerName}
              onChange={e => setCustomerName(e.target.value)}
              className="w-full border border-siwa-brown/10 rounded-xl px-3 py-2 text-xs"
            />
            <input
              type="tel"
              placeholder="رقم هاتف العميل"
              value={customerPhone}
              onChange={e => setCustomerPhone(e.target.value)}
              className="w-full border border-siwa-brown/10 rounded-xl px-3 py-2 text-xs"
            />

            <div className="grid grid-cols-3 gap-2">
              {(['cash', 'vodafone', 'instapay'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={`py-2 rounded-xl text-[10px] font-bold border transition ${paymentMethod === m ? 'bg-siwa-gold/10 border-siwa-gold text-siwa-gold' : 'border-siwa-brown/10 text-siwa-brown/60'}`}
                >
                  {m === 'cash' ? 'نقداً' : m === 'vodafone' ? 'فودافون' : 'إنستاباي'}
                </button>
              ))}
            </div>

            <div className="flex justify-between font-black text-sm text-siwa-spring border-t border-siwa-brown/10 pt-3">
              <span>الإجمالي</span>
              <span>{total} ج.م</span>
            </div>

            <button onClick={completeSale} className="w-full bg-siwa-spring text-white font-black text-xs py-3 rounded-xl shadow-md">
              إتمام البيع 🚀
            </button>
          </div>
        </div>
      )}

      {activeTab === 'expenses' && (
        <div className="max-w-md mx-auto bg-white rounded-3xl p-6 shadow-lg space-y-4">
          <h2 className="text-xs font-black text-siwa-brown uppercase border-b border-siwa-brown/10 pb-2">تسجيل مصروف</h2>
          <input
            type="text"
            placeholder="سبب المصروف"
            value={newExpense.reason}
            onChange={e => setNewExpense(p => ({ ...p, reason: e.target.value }))}
            className="w-full border border-siwa-brown/10 rounded-xl px-3 py-2 text-xs"
          />
          <input
            type="number"
            placeholder="المبلغ"
            value={newExpense.amount}
            onChange={e => setNewExpense(p => ({ ...p, amount: e.target.value }))}
            className="w-full border border-siwa-brown/10 rounded-xl px-3 py-2 text-xs"
          />
          <button onClick={addExpense} className="w-full bg-siwa-gold text-white font-bold text-xs py-2.5 rounded-xl">
            حفظ المصروف
          </button>

          <div className="pt-3 border-t border-siwa-brown/10 space-y-2 max-h-56 overflow-y-auto">
            {expenses.length === 0 ? (
              <p className="text-xs text-stone-400 text-center">لا توجد مصاريف مسجلة</p>
            ) : (
              expenses.map(exp => (
                <div key={exp.id} className="flex justify-between text-xs bg-siwa-beige/60 p-2 rounded-xl">
                  <span>{exp.reason}</span>
                  <span className="font-bold text-rose-600">{exp.amount} ج.م</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
                                 }
