'use client';

import React, { useState } from 'react';
import Storefront from './components/storefront';
import Cashier2 from './components/cashier2'; // ← ده الجديد
import Owner from './components/owner';

type Role = 'visitor' | 'cashier' | 'owner' | null;

export default function Home() {
  // مؤقت: ناخدين state محلي للـ cart/clients/expenses جوه الصفحة
  const [cart, setCart] = useState<{ id: number; name: string; price: number; count: number }[]>([]);
  const [products, setProducts] = useState<any[]>([
    { id: 1, name: 'منتج 1', price: 10 },
    { id: 2, name: 'منتج 2', price: 15 },
    { id: 3, name: 'منتج 3', price: 20 },
  ]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([
    { id: 1, name: 'عميل 1', phone: '01000000000', points: 0 },
  ]);
  const [heroBanner, setHeroBanner] = useState<string>('');
  const [newProductData, setNewProductData] = useState<any>({
    name: '', price: '', stock: '', criticalLevel: '', expiry: '', category: 'olive_oil', description: ''
  });
  const [loyaltySettings, setLoyaltySettings] = useState<{ pointsPerEGP: number; rewardThreshold: number }>({
    pointsPerEGP: 100,
    rewardThreshold: 500,
  });

  const [role, setRole] = useState<Role>(null);

  function processImageUpload(e: React.ChangeEvent<HTMLInputElement>, id: number) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setProducts((prev: any[]) => prev.map(p => p.id === id ? { ...p, imageLive: reader.result } : p));
      }
    };
    reader.readAsDataURL(file);
  }

  function submitNewProduct(e: React.FormEvent) {
    e.preventDefault();
    setProducts((prev: any[]) => [
      ...prev,
      {
        id: prev.length + 1,
        name: newProductData.name,
        price: parseFloat(newProductData.price) || 0,
        stock: parseInt(newProductData.stock) || 0,
        criticalLevel: parseInt(newProductData.criticalLevel) || 0,
        expiry: newProductData.expiry,
        category: newProductData.category,
        description: newProductData.description,
      }
    ]);
    setNewProductData({ name: '', price: '', stock: '', criticalLevel: '', expiry: '', category: 'olive_oil', description: '' });
  }

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
        loyaltySettings={loyaltySettings}
      />
    );
  }

  if (role === 'owner') {
    return (
      <Owner
        setRole={setRole}
        products={products}
        expenses={expenses}
        customers={customers}
        heroBanner={heroBanner}
        setHeroBanner={setHeroBanner}
        setProducts={setProducts}
        processImageUpload={processImageUpload}
        submitNewProduct={submitNewProduct}
        newProductData={newProductData}
        setNewProductData={setNewProductData}
        loyaltySettings={loyaltySettings}
        setLoyaltySettings={setLoyaltySettings}
      />
    );
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
