'use client';

import React, { useState } from 'react';

interface Cashier2Props {
  setRole: (role: 'visitor' | 'cashier' | 'owner' | null) => void;
  cart: { id: number; name: string; price: number; count: number }[];
  setCart: (
    cart:
      | { id: number; name: string; price: number; count: number }[]
      | ((prev: { id: number; name: string; price: number; count: number }[]) => {
          id: number;
          name: string;
          price: number;
          count: number;
        }[])
  ) => void;
  products: any[];
  expenses: any[];
  setExpenses: any;
  customers: any[];
  setCustomers: any;
}

export default function Cashier2({
  setRole,
  cart,
  setCart,
  products,
  expenses,
  setExpenses,
  customers,
  setCustomers
}: Cashier2Props) {
  const [newExpense, setNewExpense] = useState({ category: '', amount: '' });
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '' });

  function addToCart(product: any) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(prev =>
        prev.map(item =>
          item.id === product.id ? { ...item, count: item.count + 1 } : item
        )
      );
    } else {
      setCart(prev => [
        ...prev,
        { id: product.id, name: product.name, price: product.price, count: 1 }
      ]);
    }
  }

  function removeFromCart(productId: number) {
    setCart(prev => {
      const target = prev.find(item => item.id === productId);
      if (!target) return prev;

      if (target.count > 1) {
        return prev.map(item =>
          item.id === productId ? { ...item, count: item.count - 1 } : item
        );
      } else {
        return prev.filter(item => item.id !== productId);
      }
    });
  }

  function completeSale() {
    if (cart.length === 0) return alert('Cart is empty');

    const total = cart.reduce((sum, item) => sum + item.price * item.count, 0);
    const defaultCustomer = customers[0] || { name: 'Quick Customer', phone: '', points: 0 };

    setCustomers(prev => [
      {
        ...defaultCustomer,
        points: (defaultCustomer.points || 0) + total
      },
      ...prev.filter(c => c.phone !== defaultCustomer.phone)
    ]);

    setCart([]);
    alert('Sale completed');
  }

  function sendSaleViaWhatsApp() {
    if (cart.length === 0) return alert('Cart is empty');

    const total = cart.reduce((sum, item) => sum + item.price * item.count, 0);

    const message =
      `Ibn Shali - New order
` +
      `Total: ${total} EGP
` +
      `Thank you`;

    const whatsappUrl = 'https://wa.me/201094241177?text=' + encodeURIComponent(message);
    window.open(whatsappUrl, '_blank');
  }

  function addExpense() {
    if (!newExpense.category || !newExpense.amount) return;

    const amount = parseFloat(newExpense.amount);
    if (amount <= 0) return;

    const expense = {
      id: expenses.length + 1,
      category: newExpense.category,
      amount,
      source: 'From cash wallet',
      date: new Date().toISOString().split('T')[0]
    };

    setExpenses(prev => [...prev, expense]);
    setNewExpense({ category: '', amount: '' });
  }

  function addCustomer() {
    if (!newCustomer.name || !newCustomer.phone) return;

    const customer = {
      id: customers.length + 1,
      name: newCustomer.name,
      phone: newCustomer.phone,
      points: 0
    };

    setCustomers(prev => [...prev, customer]);
    setNewCustomer({ name: '', phone: '' });
  }

  return (
    <div className="min-h-screen bg-[#f5f2eb] p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-[#1e6b65]">Cashier (j2)</h1>
        <button
          onClick={() => setRole(null)}
          className="bg-[#3d2e24] text-white px-4 py-2 rounded-lg text-sm font-bold"
        >
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="font-bold text-lg mb-4 text-[#3d2e24]">Products</h2>
          <div className="grid grid-cols-2 gap-4">
            {products.map(p => (
              <button
                key={p.id}
                onClick={() => addToCart(p)}
                className="bg-white p-4 rounded-xl shadow-sm border border-[#3d2e24]/10 text-left"
              >
                <h3 className="font-bold text-[#3d2e24] text-sm">{p.name}</h3>
                <p className="text-[#1e6b65] font-bold text-sm">{p.price} EGP</p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-bold text-lg mb-4 text-[#3d2e24]">Cart</h2>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-[#3d2e24]/10">
            {cart.length === 0 ? (
              <p className="text-gray-500">Cart is empty</p>
            ) : (
              <>
                <ul>
                  {cart.map(item => (
                    <li key={item.id} className="flex justify-between py-2 border-b">
                      <div>
                        <span>{item.name}</span>
                        <span className="text-sm text-gray-500"> ({item.count} ×)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 text-sm"
                        >
                          −
                        </button>
                        <span className="font-bold">{item.price * item.count} EGP</span>
                        <button
                          onClick={() =>
                            addToCart({ id: item.id, name: item.name, price: item.price })
                          }
                          className="text-green-500 text-sm"
                        >
                          +
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="flex justify-between font-bold text-lg mt-4">
                  <span>Total</span>
                  <span className="text-[#1e6b65]">
                    {cart.reduce((sum, item) => sum + item.price * item.count, 0)} EGP
                  </span>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={completeSale}
                    className="bg-[#1e6b65] text-white px-4 py-2 rounded-lg text-sm font-bold"
                  >
                    Complete Sale
                  </button>
                  <button
                    onClick={sendSaleViaWhatsApp}
                    className="bg-[#3d2e24] text-white px-4 py-2 rounded-lg text-sm font-bold"
                  >
                    Send WhatsApp
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div>
          <h2 className="font-bold text-lg mb-4 text-[#3d2e24]">Expenses</h2>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-[#3d2e24]/10 mb-6">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Category"
                className="border rounded-lg p-2 w-full text-sm"
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              />
              <input
                type="number"
                placeholder="Amount"
                className="border rounded-lg p-2 w-full text-sm"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              />
            </div>
            <button
              onClick={addExpense}
              className="bg-[#1e6b65] text-white px-4 py-2 rounded-lg text-sm font-bold"
            >
              Add Expense
            </button>

            <ul className="mt-4">
              {expenses.map(exp => (
                <li key={exp.id} className="flex justify-between py-2 border-b">
                  <span>{exp.category}</span>
                  <span className="font-bold text-[#1e6b65]">{exp.amount} EGP</span>
                </li>
              ))}
            </ul>
          </div>

          <h2 className="font-bold text-lg mb-4 text-[#3d2e24]">Customers</h2>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-[#3d2e24]/10 mb-6">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Name"
                className="border rounded-lg p-2 w-full text-sm"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Phone"
                className="border rounded-lg p-2 w-full text-sm"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
              />
            </div>
            <button
              onClick={addCustomer}
              className="bg-[#1e6b65] text-white px-4 py-2 rounded-lg text-sm font-bold"
            >
              Add Customer
            </button>

            <ul className="mt-4">
              {customers.map(c => (
                <li key={c.id || c.phone} className="py-2 border-b">
                  <span className="font-bold text-[#3d2e24]">{c.name}</span>
                  <span className="text-gray-500 block">{c.phone}</span>
                  <span className="text-sm text-[#1e6b65]">Points: {c.points}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
         }
