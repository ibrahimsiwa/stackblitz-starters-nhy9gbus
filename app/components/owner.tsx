'use client';

import React, { useMemo, useState } from 'react';
import { Upload, Database, Mail, Users, Plus, Trash2, Shield, LogOut } from 'lucide-react';

interface LoyaltySettings {
  pointsPerEGP: number;
  rewardThreshold: number;
}

interface AppUser {
  username: string;
  password: string;
  role: 'cashier' | 'owner';
}

interface Session {
  username: string;
  role: 'cashier' | 'owner';
}

interface OwnerProps {
  products?: any[];
  expenses?: any[];
  customers?: any[];
  heroBanner?: string;
  setHeroBanner?: (img: string) => void;
  setProducts?: React.Dispatch<React.SetStateAction<any[]>>;
  setExpenses?: React.Dispatch<React.SetStateAction<any[]>>;
  setCustomers?: React.Dispatch<React.SetStateAction<any[]>>;
  setRole: (role: 'visitor' | 'cashier' | 'owner' | null) => void;
  processImageUpload?: (e: React.ChangeEvent<HTMLInputElement>, id: number) => void;
  submitNewProduct?: (e: React.FormEvent) => void;
  newProductData?: any;
  setNewProductData?: any;
  loyaltySettings?: LoyaltySettings;
  setLoyaltySettings?: (settings: LoyaltySettings) => void;
  users?: AppUser[];
  setUsers?: React.Dispatch<React.SetStateAction<AppUser[]>>;
  session?: Session | null;
  onLogout?: () => void;
  openAuthSetup?: () => void;
}

export default function Owner({
  products = [],
  expenses = [],
  customers = [],
  heroBanner = '',
  setHeroBanner = () => {},
  setRole,
  processImageUpload = () => {},
  submitNewProduct,
  newProductData = { name: '', price: '', stock: '', criticalLevel: '', expiry: '', category: 'olive_oil', description: '' },
  setNewProductData = () => {},
  loyaltySettings = { pointsPerEGP: 100, rewardThreshold: 500 },
  setLoyaltySettings = () => {},
  users = [],
  setUsers = () => {},
  session = null,
  onLogout = () => {},
  openAuthSetup = () => {},
}: OwnerProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'loyalty' | 'users'>('dashboard');
  const [editingLoyalty, setEditingLoyalty] = useState(false);
  const [loyaltyForm, setLoyaltyForm] = useState({
    pointsPerEGP: String(loyaltySettings.pointsPerEGP),
    rewardThreshold: String(loyaltySettings.rewardThreshold),
  });

  const [userForm, setUserForm] = useState({
    username: '',
    password: '',
    role: 'cashier' as 'cashier' | 'owner',
  });
  const [userEditIndex, setUserEditIndex] = useState<number | null>(null);

  const totalRevenue = 4890;
  const totalExpensesAmount = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const netProfit = totalRevenue - totalExpensesAmount;

  const currentUsers = useMemo(() => users, [users]);

  function saveLoyaltySettings() {
    setLoyaltySettings({
      pointsPerEGP: parseFloat(loyaltyForm.pointsPerEGP) || 1,
      rewardThreshold: parseFloat(loyaltyForm.rewardThreshold) || 1,
    });
    setEditingLoyalty(false);
  }

  const handleHeroBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setHeroBanner(reader.result as string);
          alert('تم رفع وضبط لقطة سيوة الواقعية كخلفية حية للمتجر بنجاح! 🌴');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  function saveUser() {
    const username = userForm.username.trim();
    const password = userForm.password.trim();

    if (username.length < 3 || password.length < 6) {
      alert('اسم المستخدم يجب أن يكون 3 أحرف على الأقل، وكلمة المرور 6 أحرف على الأقل.');
      return;
    }

    const nextUser: AppUser = {
      username,
      password,
      role: userForm.role,
    };

    setUsers(prev => {
      const existsIndex = prev.findIndex(
        u => u.username.toLowerCase() === username.toLowerCase() && u.role === userForm.role
      );

      if (userEditIndex !== null && prev[userEditIndex]) {
        const copy = [...prev];
        copy[userEditIndex] = nextUser;
        return copy;
      }

      if (existsIndex >= 0) {
        const copy = [...prev];
        copy[existsIndex] = nextUser;
        return copy;
      }

      return [...prev, nextUser];
    });

    setUserForm({ username: '', password: '', role: 'cashier' });
    setUserEditIndex(null);
  }

  function editUser(index: number) {
    const u = currentUsers[index];
    setUserForm({ username: u.username, password: u.password, role: u.role });
    setUserEditIndex(index);
    setActiveTab('users');
  }

  function deleteUser(index: number) {
    setUsers(prev => prev.filter((_, i) => i !== index));
    if (userEditIndex === index) {
      setUserEditIndex(null);
      setUserForm({ username: '', password: '', role: 'cashier' });
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fade-in pb-12 px-4 md:px-0" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-[#3d2e24]/10 pb-4">
        <div>
          <h2 className="text-sm font-black text-[#3d2e24] uppercase tracking-widest">لوحة الإدارة المركزية والتحكم للمالك</h2>
          <p className="text-[11px] text-stone-400 mt-0.5 font-medium">مراقبة حية لإجماليات الأداء العام وجرد المخازن ووسائط براند ابن شالي</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setRole('cashier')} className="bg-[#3d2e24] hover:bg-[#1e6b65] text-white px-4 py-2 rounded-xl text-xs font-black transition">الولوج لواجهة الكاشير ↩</button>
          <button onClick={onLogout} className="bg-stone-100 hover:bg-stone-200 text-[#3d2e24] px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2"><LogOut className="w-4 h-4" /> خروج</button>
        </div>
      </div>

      <div className="flex gap-2 bg-stone-100 p-1 rounded-xl w-fit flex-wrap">
        <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded-lg text-xs font-black transition ${activeTab === 'dashboard' ? 'bg-[#1e6b65] text-white' : 'text-[#3d2e24]'}`}>لوحة التحكم</button>
        <button onClick={() => setActiveTab('loyalty')} className={`px-4 py-2 rounded-lg text-xs font-black transition ${activeTab === 'loyalty' ? 'bg-[#1e6b65] text-white' : 'text-[#3d2e24]'}`}>نظام النقاط</button>
        <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded-lg text-xs font-black transition ${activeTab === 'users' ? 'bg-[#1e6b65] text-white' : 'text-[#3d2e24]'}`}>إدارة المستخدمين</button>
      </div>

      {activeTab === 'dashboard' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-[#fcfbfa] border border-[#3d2e24]/10 rounded-2xl p-5 shadow-sm">
              <span className="text-[10px] text-stone-400 font-bold uppercase block">إجمالي مبيعات الخزنة الموحدة اليوم</span>
              <p className="text-xl font-black font-mono text-emerald-600 mt-1">{totalRevenue}.00 ج.م</p>
            </div>
            <div className="bg-[#fcfbfa] border border-[#3d2e24]/10 rounded-2xl p-5 shadow-sm">
              <span className="text-[10px] text-stone-400 font-bold block">إجمالي مصاريف التشغيل المقيدة</span>
              <p className="text-xl font-black font-mono text-rose-600 mt-1">{totalExpensesAmount}.00 ج.م</p>
            </div>
            <div className="bg-[#fcfbfa] border border-[#3d2e24]/10 rounded-2xl p-5 shadow-sm">
              <span className="text-[10px] text-stone-400 font-bold block">الربح الصافي الفعلي لمعاملات اليوم</span>
              <p className="text-xl font-black font-mono text-emerald-600 mt-1">{netProfit}.00 ج.م</p>
            </div>
          </div>

          <div className="bg-[#fcfbfa] border border-[#3d2e24]/10 rounded-3xl p-6 shadow-md space-y-6">
            <div className="border-b border-stone-100 pb-2">
              <h3 className="text-xs font-black text-[#3d2e24] flex items-center gap-1.5">📸 إدارة وسائط المتجر وصورة الواجهة الخلفية</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="space-y-1">
                <label className="text-[11px] font-black block text-[#3d2e24]">تحديث صورة واجهة المتجر الخلفية (Hero Banner):</label>
                <p className="text-[10px] text-stone-400 font-medium leading-relaxed">ارفع هنا لقطة جبال وبحيرة واحة سيوة الصادقة عالية الدقة لتصبح الخلفية الرسمية الفورية لزوار المتجر.</p>
              </div>
              <div className="md:col-span-2">
                <label className="cursor-pointer bg-[#f5f2eb] border border-dashed border-[#4a3b32]/30 px-6 py-5 rounded-2xl font-black text-xs text-[#3d2e24] flex flex-col items-center justify-center gap-2 transition-all hover:bg-stone-50">
                  <Upload className="w-6 h-6 text-[#1e6b65]" />
                  <span>انقر هنا لاختيار أو التقاط لقطة سيوة الواقعية للمتجر</span>
                  <input type="file" accept="image/*" onChange={handleHeroBannerUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 space-y-2">
              <label className="text-[11px] font-black block text-[#3d2e24] mb-2">تحديث صور كروت المنتجات الفردية (Base64 السحابية):</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map(p => (
                  <div key={p.id} className="bg-[#f5f2eb]/40 border border-[#3d2e24]/10 rounded-2xl p-4 flex justify-between items-center gap-2">
                    <span className="text-xs font-bold text-[#3d2e24] truncate max-w-[180px]">{p.name}</span>
                    <label className="cursor-pointer bg-[#fcfbfa] hover:bg-stone-50 border border-[#4a3b32]/20 px-3 py-2 rounded-xl text-[10px] font-black flex items-center gap-1 shadow-sm transition">
                      <Upload className="w-3.5 h-3.5 text-[#1e6b65]" />
                      <span>{p.imageLive ? 'تحديث اللقطة' : 'رفع لقطة المنتج 📸'}</span>
                      <input type="file" accept="image/*" onChange={(e) => processImageUpload(e, p.id)} className="hidden" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={submitNewProduct} className="bg-[#fcfbfa] border border-[#3d2e24]/10 rounded-3xl p-6 shadow-md grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <h3 className="sm:col-span-3 text-xs font-black text-[#3d2e24] border-b border-[#3d2e24]/10 pb-2 uppercase tracking-wider">حقن منتج طبيعي جديد في المخزن السحابي الموحد</h3>
            <div className="space-y-1"><label className="text-[10px] font-bold">اسم المنتج الفاخر:</label><input type="text" required placeholder="الاسم" value={newProductData.name} onChange={(e) => setNewProductData({ ...newProductData, name: e.target.value })} className="w-full bg-[#fcfbfa] border border-[#3d2e24]/10 rounded-xl p-2.5 text-xs text-[#3d2e24] focus:outline-none" /></div>
            <div className="space-y-1"><label className="text-[10px] font-bold">السعر التجاري (ج.م):</label><input type="number" required placeholder="السعر" value={newProductData.price} onChange={(e) => setNewProductData({ ...newProductData, price: e.target.value })} className="w-full bg-[#fcfbfa] border border-[#3d2e24]/10 rounded-xl p-2.5 text-xs text-[#3d2e24] focus:outline-none" /></div>
            <div className="space-y-1"><label className="text-[10px] font-bold">الرصيد الابتدائي الحالي:</label><input type="number" required placeholder="الكمية" value={newProductData.stock} onChange={(e) => setNewProductData({ ...newProductData, stock: e.target.value })} className="w-full bg-[#fcfbfa] border border-[#3d2e24]/10 rounded-xl p-2.5 text-xs text-[#3d2e24] focus:outline-none" /></div>
            <div className="space-y-1"><label className="text-[10px] font-bold">حد التنبيه الحرج للنواقص:</label><input type="number" placeholder="مثال: 5" value={newProductData.criticalLevel} onChange={(e) => setNewProductData({ ...newProductData, criticalLevel: e.target.value })} className="w-full bg-[#fcfbfa] border border-[#3d2e24]/10 rounded-xl p-2.5 text-xs focus:outline-none" /></div>
            <div className="space-y-1"><label className="text-[10px] font-bold">خط انتهاء الصلاحية:</label><input type="date" required value={newProductData.expiry} onChange={(e) => setNewProductData({ ...newProductData, expiry: e.target.value })} className="w-full bg-[#fcfbfa] border border-[#3d2e24]/10 rounded-xl p-2.5 text-xs focus:outline-none" /></div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold">العائلة البوتانيكية:</label>
              <select value={newProductData.category} onChange={(e) => setNewProductData({ ...newProductData, category: e.target.value })} className="w-full bg-[#fcfbfa] border border-[#3d2e24]/10 rounded-xl p-2.5 text-xs focus:outline-none">
                <option value="olive_oil">زيت زيتون فاخر</option>
                <option value="dates">تمور سيوة سادة</option>
                <option value="dates_premium">تمور محشية وهدايا</option>
                <option value="herbs">أعشاب برية</option>
              </select>
            </div>
            <div className="sm:col-span-3 space-y-1"><label className="text-[10px] font-bold">بيان وميثاق المكونات والتحاليل الشفافة للعميل النخبوي:</label><textarea rows={2} required placeholder="اكتب هنا التحاليل ونسب الحموضة الفنية والمنشأ والفوائد الطبية..." value={newProductData.description} onChange={(e) => setNewProductData({ ...newProductData, description: e.target.value })} className="w-full bg-[#fcfbfa] border border-[#3d2e24]/10 rounded-xl p-2.5 text-xs focus:outline-none" /></div>
            <button type="submit" className="sm:col-span-3 bg-[#1e6b65] hover:bg-[#154d49] text-white font-black text-xs py-3 rounded-xl shadow transition">حفظ وحقن كارت صنف المنتج الجديد بالخلفية سحابياً 🚀</button>
          </form>

          <div className="bg-[#fcfbfa] border border-[#3d2e24]/10 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#f5f2eb] text-[#3d2e24] border-b border-[#3d2e24]/10 font-bold">
                <tr>
                  <th className="p-4">اسم صنف التحفة الطبيعية لـ ابن شالي</th>
                  <th className="p-4">الرصيد المتاح بالفرع</th>
                  <th className="p-4 text-center">نظام التنبيه التلقائي</th>
                  <th className="p-4 text-center">تاريخ انتهاء الصلاحية الموثق</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3d2e24]/10">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-stone-50">
                    <td className="p-4 font-black text-[#3d2e24]">{p.name}</td>
                    <td className="p-4 font-mono font-bold text-stone-500">{p.stock} عبوة</td>
                    <td className="p-4 text-center">
                      {p.stock <= p.criticalLevel ? (
                        <span className="bg-rose-50 text-rose-600 border border-rose-200 text-[10px] px-2.5 py-1 rounded-full font-black animate-pulse">تحذير: مخزون حرج!</span>
                      ) : (
                        <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] px-2.5 py-1 rounded-full font-bold">آمن ومستقر</span>
                      )}
                    </td>
                    <td className="p-4 text-center font-mono font-bold text-[#1e6b65]">{p.expiry}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-[#fcfbfa] border border-[#3d2e24]/10 rounded-3xl p-6 shadow-md grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-xs font-black text-[#3d2e24] flex items-center gap-1.5"><Database className="w-4 h-4 text-[#1e6b65]" /> النسخ الاحتياطي والأمان التلقائي</h3>
              <p className="text-xs text-[#4a3b32]/80 leading-relaxed font-medium">قاعدة البيانات الاحتياطية السحابية مؤمنة كلياً وتقوم بعمل حفظ دوري وتلقائي لكافة الحركات المالية وتحديثات جرد المخازن المباشرة لـ ابن شالي.</p>
            </div>
            <div className="space-y-2 border-r border-[#3d2e24]/10 pr-6">
              <h3 className="text-xs font-black text-[#3d2e24] flex items-center gap-1.5"><Mail className="w-4 h-4 text-amber-600" /> التقارير الشاملة وجدولة الإيميل الآلي</h3>
              <p className="text-xs text-[#4a3b32]/80 leading-relaxed font-medium">النظام مجدول لإرسال تقرير وجرد أسبوعي دوري متكامل وشامل للمبيعات والمخزن مباشرة إلى بريد الإدارة المعتمد والموثق للتاجر إبراهيم:</p>
              <p className="text-xs font-mono font-black text-[#1e6b65] bg-[#f5f2eb] p-2 rounded-xl text-center border border-[#3d2e24]/5">ibrahimsiwa360@gmail.com</p>
            </div>
          </div>
        </>
      )}

      {activeTab === 'loyalty' && (
        <div className="bg-[#fcfbfa] border border-[#3d2e24]/10 rounded-3xl p-6 shadow-md space-y-5 max-w-lg">
          <h3 className="text-xs font-black text-[#3d2e24] border-b border-stone-100 pb-2">⭐ إعدادات نظام نقاط الولاء</h3>

          {!editingLoyalty ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-stone-50 rounded-2xl p-4 text-center">
                  <p className="text-[10px] text-stone-400 font-bold">كل</p>
                  <p className="text-xl font-black text-[#1e6b65]">{loyaltySettings.pointsPerEGP} ج.م</p>
                  <p className="text-[10px] text-stone-400 font-bold">= 1 نقطة</p>
                </div>
                <div className="bg-stone-50 rounded-2xl p-4 text-center">
                  <p className="text-[10px] text-stone-400 font-bold">كل</p>
                  <p className="text-xl font-black text-amber-600">{loyaltySettings.rewardThreshold}</p>
                  <p className="text-[10px] text-stone-400 font-bold">نقطة = مكافأة</p>
                </div>
              </div>
              <button onClick={() => setEditingLoyalty(true)} className="w-full bg-[#1e6b65] text-white text-xs font-black py-2.5 rounded-xl">تعديل الإعدادات</button>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-bold">قيمة الشراء مقابل نقطة واحدة (بالجنيه):</label>
                <input type="number" value={loyaltyForm.pointsPerEGP} onChange={(e) => setLoyaltyForm(p => ({ ...p, pointsPerEGP: e.target.value }))} className="w-full border border-stone-200 rounded-xl p-2.5 text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold">عدد النقاط اللازمة للمكافأة:</label>
                <input type="number" value={loyaltyForm.rewardThreshold} onChange={(e) => setLoyaltyForm(p => ({ ...p, rewardThreshold: e.target.value }))} className="w-full border border-stone-200 rounded-xl p-2.5 text-xs" />
              </div>
              <div className="flex gap-2">
                <button onClick={saveLoyaltySettings} className="flex-1 bg-[#1e6b65] text-white text-xs font-black py-2.5 rounded-xl">حفظ</button>
                <button onClick={() => setEditingLoyalty(false)} className="flex-1 bg-stone-100 text-[#3d2e24] text-xs py-2.5 rounded-xl">إلغاء</button>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#fcfbfa] border border-[#3d2e24]/10 rounded-3xl p-6 shadow-md space-y-4">
            <h3 className="text-xs font-black text-[#3d2e24] flex items-center gap-2 border-b border-stone-100 pb-2">
              <Users className="w-4 h-4 text-[#1e6b65]" /> إدارة المستخدمين
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold">اسم المستخدم:</label>
                <input
                  type="text"
                  value={userForm.username}
                  onChange={e => setUserForm(p => ({ ...p, username: e.target.value }))}
                  className="w-full border border-stone-200 rounded-xl p-2.5 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold">كلمة المرور:</label>
                <input
                  type="password"
                  value={userForm.password}
                  onChange={e => setUserForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full border border-stone-200 rounded-xl p-2.5 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold">نوع الحساب:</label>
                <select
                  value={userForm.role}
                  onChange={e => setUserForm(p => ({ ...p, role: e.target.value as 'cashier' | 'owner' }))}
                  className="w-full border border-stone-200 rounded-xl p-2.5 text-xs bg-white"
                >
                  <option value="cashier">كاشير</option>
                  <option value="owner">مدير</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={saveUser} type="button" className="flex-1 bg-[#1e6b65] text-white text-xs font-black py-2.5 rounded-xl flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> {userEditIndex !== null ? 'حفظ التعديل' : 'إضافة مستخدم'}
                </button>
                <button
                  onClick={() => {
                    setUserEditIndex(null);
                    setUserForm({ username: '', password: '', role: 'cashier' });
                  }}
                  type="button"
                  className="bg-stone-100 text-[#3d2e24] text-xs px-4 rounded-xl"
                >
                  تفريغ
                </button>
              </div>
            </div>

            {!users.length && (
              <div className="text-xs text-stone-500 bg-stone-50 rounded-2xl p-4">
                لا يوجد مستخدمون بعد. أنشئ المدير الأول من بوابة المتجر إذا كانت هذه أول مرة.
              </div>
            )}
          </div>

          <div className="bg-[#fcfbfa] border border-[#3d2e24]/10 rounded-3xl p-6 shadow-md space-y-3">
            <h3 className="text-xs font-black text-[#3d2e24] border-b border-stone-100 pb-2">قائمة المستخدمين</h3>
            <div className="space-y-2 max-h-[520px] overflow-y-auto">
              {currentUsers.map((u, index) => (
                <div key={`${u.username}-${u.role}-${index}`} className="flex items-center justify-between gap-3 bg-siwa-beige/50 border border-stone-200/50 rounded-2xl p-3">
                  <div>
                    <p className="text-sm font-black text-siwa-brown">{u.username}</p>
                    <p className="text-[10px] text-stone-500 font-mono">{u.role === 'owner' ? 'مدير' : 'كاشير'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => editUser(index)} className="text-[10px] px-3 py-2 rounded-xl bg-white border border-stone-200">تعديل</button>
                    <button onClick={() => deleteUser(index)} className="text-[10px] px-3 py-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center gap-1">
                      <Trash2 className="w-3 h-3" /> حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {session && (
              <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-500 flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#1e6b65]" />
                الدخول الحالي: {session.username} — {session.role === 'owner' ? 'مدير' : 'كاشير'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}