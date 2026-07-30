'use client';

import React, { useEffect, useMemo, useState } from 'react';
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


  { username: 'abnshaly', password: 'abn325748619', role: 'owner'
 }
};

type LoyaltySettings = {
  pointsPerEGP: number;
  rewardThreshold: number;
};

const USERS_KEY = 'ibnShali_users_v1';
const SESSION_KEY = 'ibnShali_session_v1';

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

  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'setup'>('login');
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirm, setAuthConfirm] = useState('');
  const [authRole, setAuthRole] = useState<UserRole>('cashier');
  const [authMessage, setAuthMessage] = useState('');

  useEffect(() => {
    setMounted(true);
    try {
      const rawUsers = localStorage.getItem(USERS_KEY);
      const rawSession = localStorage.getItem(SESSION_KEY);

      if (rawUsers) setUsers(JSON.parse(rawUsers));
      if (rawSession) {
        const parsed = JSON.parse(rawSession) as AppSession;
        setSession(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (users.length) localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users, mounted]);

  useEffect(() => {
    if (!mounted) return;
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  }, [session, mounted]);

  useEffect(() => {
    if (!mounted) return;
    if (session?.role === 'owner') setRole('owner');
    else if (session?.role === 'cashier') setRole('cashier');
    else setRole('visitor');
  }, [session, mounted]);

  const hasOwner = useMemo(() => users.some(u => u.role === 'owner'), [users]);

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

  function openAuth(mode: 'login' | 'setup') {
    setAuthMode(mode);
    setAuthMessage('');
    setAuthUsername('');
    setAuthPassword('');
    setAuthConfirm('');
    setAuthRole('cashier');
    setAuthOpen(true);
  }

  function handleAuthSubmit() {
    const cleanUsername = authUsername.trim();

    if (!cleanUsername || authPassword.trim().length < 6) {
      setAuthMessage('الاسم مطلوب، وكلمة المرور يجب ألا تقل عن 6 أحرف.');
      return;
    }

    if (authMode === 'setup') {
      if (authPassword !== authConfirm) {
        setAuthMessage('كلمتا المرور غير متطابقتين.');
        return;
      }
      if (users.some(u => u.username.toLowerCase() === cleanUsername.toLowerCase())) {
        setAuthMessage('اسم المستخدم موجود بالفعل.');
        return;
      }

      const ownerUser: AppUser = {
        username: cleanUsername,
        password: authPassword,
        role: 'owner',
      };

      setUsers([ownerUser]);
      setSession({ username: ownerUser.username, role: ownerUser.role });
      setAuthOpen(false);
      return;
    }

    const matched = users.find(
      u =>
        u.username.toLowerCase() === cleanUsername.toLowerCase() &&
        u.password === authPassword &&
        u.role === authRole
    );

    if (!matched) {
      setAuthMessage('بيانات الدخول غير صحيحة أو لا تملك صلاحية لهذا المسار.');
      return;
    }

    setSession({ username: matched.username, role: matched.role });
    setAuthOpen(false);
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
        openAuthSetup={() => openAuth('setup')}
      />
    );
  }

  return (
    <Storefront
      products={products}
      setRole={setRole}
      heroBanner={heroBanner}
      onOpenAuth={() => {
        if (!hasOwner) openAuth('setup');
        else openAuth('login');
      }}
      hasOwner={hasOwner}
      session={session}
      onLogout={handleLogout}
    />
  );
}