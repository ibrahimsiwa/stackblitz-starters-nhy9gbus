'use client';

import React, { useState } from 'react';
import { BarChart3, Package, Users, Upload, Database, Mail, AlertTriangle, Check } from 'lucide-react';

interface OwnerProps {
  products: any[];
  expenses: any[];
  customers: any[];
  heroBanner: string;
  setHeroBanner: (img: string) => void;
  setProducts: React.Dispatch<React.SetStateAction<any[]>>;
  setRole: (role: 'visitor' | 'cashier' | 'owner') => void;
  processImageUpload: (e: React.ChangeEvent<HTMLInputElement>, id: number) => void;
  submitNewProduct: (e: React.FormEvent) => void;
  newProductData: any;
  setNewProductData: any;
}

export default function Owner({ 
  products, expenses, customers, heroBanner, setHeroBanner, 
  setRole, processImageUpload, submitNewProduct, newProductData, setNewProductData 
}: OwnerProps) {
  
  const totalRevenue = 4890;
  const totalExpensesAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalRevenue - totalExpensesAmount;

  const handleHeroBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setHeroBanner(reader.result as string);
          alert("تم رفع وضبط لقطة سيوة الواقعية كخلفية حية للمتجر بنجاح! 🌴");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fade-in pb-12">
      <div className="flex justify-between items-center border-b border-[#3d2e24]/10 pb-4">
        <div>
          <h2 className="text-sm font-black text-[#3d2e24] uppercase tracking-widest">لوحة الإدارة المركزية والتحكم للمالك</h2>
          <p className="text-[11px] text-stone-400 mt-0.5 font-medium">مراقبة حية لإجماليات الأداء العام وجرد المخازن ووسائط براند ابن شالي</p>
        </div>
        <button onClick={() => setRole('cashier')} className="bg-[#3d2e24] hover:bg-[#1e6b65] text-white px-4 py-2 rounded-xl text-xs font-black transition">الولوج لواجهة الكاشير ↩</button>
      </div>
      
      {/* كروت الأداء المالي والربح الصافي */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#fcfbfa] border border-[#3d2e24]/10 rounded-2xl p-5 shadow-sm"><span className="text-[10px] text-stone-400 font-bold uppercase block">إجمالي مبيعات الخزنة الموحدة اليوم</span><p className="text-xl font-black font-mono text-emerald-600 mt-1">{totalRevenue}.00 ج.م</p></div>
        <div className="bg-[#fcfbfa] border border-[#3d2e24]/10 rounded-2xl p-5 shadow-sm"><span className="text-[10px] text-stone-400 font-bold block">إجمالي مصاريف التشغيل المقيدة</span><p className="text-xl font-black font-mono text-rose-600 mt-1">{totalExpensesAmount}.00 ج.m</p></div>
        <div className="bg-[#fcfbfa] border border-[#3d2e24]/10 rounded-2xl p-5 shadow-sm"><span className="text-[10px] text-stone-400 font-bold block">الربح الصافي الفعلي لمعاملات اليوم</span><p className="text-xl font-black font-mono text-emerald-600 mt-1">{netProfit}.00 ج.م</p></div>
      </div>

      {/* قسم تخصيص وصيانة صور المتجر والواجهة الخلفية السيّوية المباشرة */}
      <div className="bg-[#fcfbfa] border border-[#3d2e24]/10 rounded-3xl p-6 shadow-md space-y-6">
        <div className="border-b border-stone-100 pb-2"><h3 className="text-xs font-black text-[#3d2e24] flex items-center gap-1.5">📸 إدارة وسائط المتجر وصورة الواجهة الخلفية</h3></div>
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

        {/* صيانة صور المنتجات الفردية الفاخرة */}
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

      {/* نموذج حقن صنف جديد بالكامل للمستودع */}
      <form onSubmit={submitNewProduct} className="bg-[#fcfbfa] border border-[#3d2e24]/10 rounded-3xl p-6 shadow-md grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <h3 className="sm:col-span-3 text-xs font-black text-[#3d2e24] border-b border-[#3d2e24]/10 pb-2 uppercase tracking-wider">حقن منتج طبيعي جديد في المخزن السحابي الموحد</h3>
        <div className="space-y-1"><label className="text-[10px] font-bold">اسم المنتج الفاخر:</label><input type="text" required placeholder="الاسم" value={newProductData.name} onChange={(e) => setNewProductData({...newProductData, name: e.target.value})} className="w-full bg-[#fcfbfa] border border-[#3d2e24]/10 rounded-xl p-2.5 text-xs text-[#3d2e24] focus:outline-none" /></div>
        <div className="space-y-1"><label className="text-[10px] font-bold">السعر التجاري (ج.م):</label><input type="number" required placeholder="السعر" value={newProductData.price} onChange={(e) => setNewProductData({...newProductData, price: e.target.value})} className="w-full bg-[#fcfbfa] border border-[#3d2e24]/10 rounded-xl p-2.5 text-xs text-[#3d2e24] focus:outline-none" /></div>
        <div className="space-y-1"><label className="text-[10px] font-bold">الرصيد الابتدائي الحالي:</label><input type="number" required placeholder="الكمية" value={newProductData.stock} onChange={(e) => setNewProductData({...newProductData, stock: e.target.value})} className="w-full bg-[#fcfbfa] border border-[#3d2e24]/10 rounded-xl p-2.5 text-xs text-[#3d2e24] focus:outline-none" /></div>
        <div className="space-y-1"><label className="text-[10px] font-bold">حد التنبيه الحرج للنواقص:</label><input type="number" placeholder="مثال: 5" value={newProductData.criticalLevel} onChange={(e) => setNewProductData({...newProductData, criticalLevel: e.target.value})} className="w-full bg-[#fcfbfa] border border-[#3d2e24]/10 rounded-xl p-2.5 text-xs focus:outline-none" /></div>
        <div className="space-y-1"><label className="text-[10px] font-bold">خط انتهاء الصلاحية:</label><input type="date" required value={newProductData.expiry} onChange={(e) => setNewProductData({...newProductData, expiry: e.target.value})} className="w-full bg-[#fcfbfa] border border-[#3d2e24]/10 rounded-xl p-2.5 text-xs focus:outline-none" /></div>
        <div className="space-y-1"><label className="text-[10px] font-bold">العائلة البوتانيكية:</label>
          <select value={newProductData.category} onChange={(e) => setNewProductData({...newProductData, category: e.target.value})} className="w-full bg-[#fcfbfa] border border-[#3d2e24]/10 rounded-xl p-2.5 text-xs focus:outline-none">
            <option value="olive_oil">زيت زيتون فاخر</option><option value="dates">تمور سيوة سادة</option><option value="dates_premium">تمور محشية وهدايا</option><option value="herbs">أعشاب برية</option>
          </select>
        </div>
        <div className="sm:col-span-3 space-y-1"><label className="text-[10px] font-bold">بيان وميثاق المكونات والتحاليل الشفافة للعميل النخبوي:</label><textarea rows={2} required placeholder="اكتب هنا التحاليل ونسب الحموضة الفنية والمنشأ والفوائد الطبية..." value={newProductData.description} onChange={(e) => setNewProductData({...newProductData, description: e.target.value})} className="w-full bg-[#fcfbfa] border border-[#3d2e24]/10 rounded-xl p-2.5 text-xs focus:outline-none" /></div>
        <button type="submit" className="sm:col-span-3 bg-[#1e6b65] hover:bg-[#154d49] text-white font-black text-xs py-3 rounded-xl shadow transition">حفظ وحقن كارت صنف المنتج الجديد بالخلفية سحابياً 🚀</button>
      </form>

      {/* جدول جرد ورصيد المخزن المركزي */}
      <div className="bg-[#fcfbfa] border border-[#3d2e24]/10 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-right text-xs">
          <thead className="bg-[#f5f2eb] text-[#3d2e24] border-b border-[#3d2e24]/10 font-bold"><tr><th className="p-4">اسم صنف التحفة الطبيعية لـ "ابن شالي"</th><th className="p-4">الرصيد المتاح بالفرع</th><th className="p-4 text-center">نظام التنبيه التلقائي</th><th className="p-4 text-center">تاريخ انتهاء الصلاحية الموثق</th></tr></thead>
          <tbody className="divide-y divide-[#3d2e24]/10">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-stone-50"><td className="p-4 font-black text-[#3d2e24]">{p.name}</td><td className="p-4 font-mono font-bold text-stone-500">{p.stock} عبوة</td><td className="p-4 text-center">{p.stock <= p.criticalLevel ? (<span className="bg-rose-50 text-rose-600 border border-rose-200 text-[10px] px-2.5 py-1 rounded-full font-black animate-pulse">تحذير: مخزون حرج!</span>) : (<span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] px-2.5 py-1 rounded-full font-bold">آمن ومستقر</span>)}</td><td className="p-4 text-center font-mono font-bold text-[#1e6b65]">{p.expiry}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* النسخ الاحتياطي والبريد الإلكتروني المؤتمت للتقارير الأسبوعية للبراند */}
      <div className="bg-[#fcfbfa] border border-[#3d2e24]/10 rounded-3xl p-6 shadow-md grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2"><h3 className="text-xs font-black text-[#3d2e24] flex items-center gap-1.5"><Database className="w-4 h-4 text-[#1e6b65]" /> النسخ الاحتياطي والأمان التلقائي</h3><p className="text-xs text-[#4a3b32]/80 leading-relaxed font-medium">قاعدة البيانات الاحتياطية السحابية مؤمنة كلياً وتقوم بعمل حفظ دوري وتلقائي لكافة الحركات المالية وتحديثات جرد المخازن المباشرة لـ "ابن شالي".</p></div>
        <div className="space-y-2 border-r border-[#3d2e24]/10 pr-6"><h3 className="text-xs font-black text-[#3d2e24] flex items-center gap-1.5"><Mail className="w-4 h-4 text-amber-600" /> التقارير الشاملة وجدولة الإيميل الآلي</h3><p className="text-xs text-[#4a3b32]/80 leading-relaxed font-medium">النظام مجدول لإرسال تقرير وجرد أسبوعي دوري متكامل وشامل للمبيعات والمخزن مباشرة إلى بريد الإدارة المعتمد والموثق للتاجر إبراهيم:</p><p className="text-xs font-mono font-black text-[#1e6b65] bg-[#f5f2eb] p-2 rounded-xl text-center border border-[#3d2e24]/5">ibrahimsiwa360@gmail.com</p></div>
      </div>
    </div>
  );
}