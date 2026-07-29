'use client';

import React, { useState } from 'react';
import Storefront from './components/storefront';
import Cashier2 from './components/cashier2'; // ← ده الجديد
import Owner from './components/owner';

type Role = 'visitor' | 'cashier' | 'owner' | null;

export default function Home() {
  // مؤقت: ناخدين state محلي للـ cart/clients/expenses جوه الصفحة
  const [cart, setCart] = useState<{ id: number; name: string; price: number; count: number }[]>([]);
  const [products] = useState([
    { id: 1, name: 'منتج 1', price: 10 },
    { id: 2, name: 'منتج 2', price: 15 },
    { id: 3, name: 'منتج 3', price: 20 },
  ]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([
    { id: 1, name: 'عميل 1', phone: '01000000000', points: 0 },
  ]);

  const [role, setRole] = useState<Role>(null);

  if (role === 'cashier') {
    return (
      <Cashier2
        setRole={setRole}
        cart={cart}
        setCart={setCart}
        products={products}
        expenses={expenses}
        setExpenses={setExpenses}
        customers={customers}
        setCustomers={setCustomers}
      />
    );
  }

  if (role === 'owner') {
    return <Owner setRole={setRole} />;
  }

  if (role === 'visitor') {
    return <Storefront setRole={setRole} />;
  }

  return (
    <div className="min-h-screen bg-[#f5f2eb] flex flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-3xl font-black text-[#1e6b65]">ابن شالي</h1>

      <button
        onClick={() => setRole('visitor')}
        className="bg-[#1e6b65] text-white px-8 py-4 rounded-xl font-bold text-lg"
      >
        المتجر
      </button>

      <button
        onClick={() => setRole('cashier')}
        className="bg-[#3d2e24] text-white px-8 py-4 rounded-xl font-bold text-lg"
      >
        الكاشير
      </button>

      <button
        onClick={() => setRole('owner')}
        className="bg-[#8b5a2b] text-white px-8 py-4 rounded-xl font-bold text-lg"
      >
        الإدارة
      </button>
    </div>
  );
}
