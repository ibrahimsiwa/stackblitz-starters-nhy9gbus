'use client';

import React, { useEffect, useState } from 'react';
import Storefront from './components/storefront';
import Cashier2 from './components/cashier2';
import Owner from './components/owner';

type Role = 'visitor' | 'cashier' | 'owner' | null;
type UserRole = 'cashier' | 'owner';

type AppUser = {
  username: string;
  password: string;
  role: UserRole;
};

type AppSession = {
  username: string;
  role: UserRole;
};

type LoyaltySettings = {
  pointsPerEGP: number;
  rewardThreshold: number;
};

const USERS_KEY = 'ibnShali_users_v1';
const SESSION_KEY = 'ibnShali_session_v1';
const PRODUCTS_KEY = 'ibnShali_products_v1';
const EXPENSES_KEY = 'ibnShali_expenses_v1';
const CUSTOMERS_KEY = 'ibnShali_customers_v1';
const CART_KEY = 'ibnShali_cart_v1';
const HERO_KEY = 'ibnShali_heroBanner_v1';
const NEW_PRODUCT_KEY = 'ibnShali_newProduct_v1';
const LOYALTY_KEY = 'ibnShali_loyalty_v1';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [cart, setCart] = useState<{ id: number; name: string; price: number; count: number }[]>([]);
  const [products, setProducts] = useState<any[]>([
    { id: 1, name: 'منتج 1', price: 10, stock: 10, criticalLevel: 3, expiry: '2026-12-31', category: 'olive_oil', description: '' },
    { id: 2, name: 'منتج 2', price: 15, stock: 10, criticalLevel: 3, expiry: '2026-12-31', category: 'dates', description: '' },
    { id: 3, name: 'منتج 3', price: 20, stock: 10, criticalLevel: 3, expiry: '2026-12-31', category: 'herbs', description: '' },
  ]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([
    { id: 1, name: 'عميل 1', phone: '01000000000', points: 0 },
  ]);
  const [heroBanner, setHeroBanner] = useState<string>('');
  const [newProductData, setNewProductData] = useState<any>({
    name: '',
    price: '',
    stock: '',
    criticalLevel: '',
    expiry: '',
    category: 'olive_oil',
    description: '',
  });
  const [loyaltySettings, setLoyaltySettings] = useState<LoyaltySettings>({
    pointsPerEGP: 100,
    rewardThreshold: 500,
  });

  const [role, setRole] = useState<Role>('visitor');
  const [users, setUsers] = useState<AppUser[]>([]);
  const [session, setSession] = useState<AppSession | null>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const rawUsers = localStorage.getItem(USERS_KEY);
      const rawSession = localStorage.getItem(SESSION_KEY);
      const rawProducts = localStorage.getItem(PRODUCTS_KEY);
      const rawExpenses = localStorage.getItem(EXPENSES_KEY);
      const rawCustomers = localStorage.getItem(CUSTOMERS_KEY);
      const rawCart = localStorage.getItem(CART_KEY);
      const rawHero = localStorage.getItem(HERO_KEY);
      const rawNewProduct = localStorage.getItem(NEW_PRODUCT_KEY);
      const rawLoyalty = localStorage.getItem(LOYALTY_KEY);

      if (rawUsers) {
        setUsers(JSON.parse(rawUsers));
      } else {
        const defaultUsers: AppUser[] = [
          { username: 'abnshaly', password: 'abn325748619', role: 'owner' },
        ];
        setUsers(defaultUsers);
        localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
      }

      if (rawSession) setSession(JSON.parse(rawSession));
      if (rawProducts) setProducts(JSON.parse(rawProducts));
      if (rawExpenses) setExpenses(JSON.parse(rawExpenses));
      if (rawCustomers) setCustomers(JSON.parse(rawCustomers));
      if (rawCart) setCart(JSON.parse(rawCart));
      if (rawHero) setHeroBanner(rawHero);
      if (rawNewProduct) setNewProductData(JSON.parse(rawNewProduct));
      if (rawLoyalty) setLoyaltySettings(JSON.parse(rawLoyalty));
    } catch {}
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users, mounted]);

  useEffect(() => {
    if (!mounted) return;
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  }, [session, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }, [products, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  }, [expenses, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
  }, [customers, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(HERO_KEY, heroBanner);
  }, [heroBanner, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(NEW_PRODUCT_KEY, JSON.stringify(newProductData));
  }, [newProductData, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(LOYALTY_KEY, JSON.stringify(loyaltySettings));
  }, [loyaltySettings, mounted]);

  useEffect(() => {
    if (!mounted) return;
    if (session?.role === 'owner') setRole('owner');
    else if (session?.role === 'cashier') setRole('cashier');
    else setRole('visitor');
  }, [session, mounted]);

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
      },
    ]);
    setNewProductData({
      name: '',
      price: '',
      stock: '',
      criticalLevel: '',
      expiry: '',
      category: 'olive_oil',
      description: '',
    });
  }

  function handleLogout() {
    setSession(null);
    setRole('visitor');
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
        setExpenses={setExpenses}
        setCustomers={setCustomers}
        processImageUpload={processImageUpload}
        submitNewProduct={submitNewProduct}
        newProductData={newProductData}
        setNewProductData={setNewProductData}
        loyaltySettings={loyaltySettings}
        setLoyaltySettings={setLoyaltySettings}
        users={users}
        setUsers={setUsers}
        session={session}
        onLogout={handleLogout}
        openAuthSetup={() => {}}
      />
    );
  }

  return (
    <Storefront
      products={products}
      setRole={setRole}
      heroBanner={heroBanner}
      hasOwner={true}
      session={session}
      onLogout={handleLogout}
      onAuthSuccess={(username, role) => {
        setSession({ username, role });
      }}
      users={users}
    />
  );
}