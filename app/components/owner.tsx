"use client";

import { useState } from "react";
import { Product, Customer, Expense, LoyaltySettings, Role } from "../page";

interface OwnerProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
  customers: Customer[];
  setCustomers: (customers: Customer[]) => void;
  expenses: Expense[];
  setExpenses: (expenses: Expense[]) => void;
  loyaltySettings: LoyaltySettings;
  setLoyaltySettings: (settings: LoyaltySettings) => void;
  setRole: (role: Role) => void;
}

export default function Owner({
  products,
  setProducts,
  customers,
  setCustomers,
  expenses,
  setExpenses,
  loyaltySettings,
  setLoyaltySettings,
  setRole,
}: OwnerProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "customers" | "expenses" | "loyalty" | "exit">("dashboard");

  const addProduct = () => {
    const name = prompt("اسم المنتج:");
    if (!name) return;
    const category = prompt("الفئة:");
    const price = parseFloat(prompt("السعر:") || "0");
    const stock = parseInt(prompt("المخزون:") || "0");
    const image = prompt("رابط الصورة:");

    const newProduct: Product = {
      id: Date.now(),
      name,
      category,
      price,
      stock,
      image: image || "/placeholder.jpg",
    };

    setProducts([...products, newProduct]);
  };

  const updateLoyaltySettings = () => {
    const pointsPerEGP = parseFloat(prompt("كم جنيه لنقطة واحدة؟", loyaltySettings.pointsPerEGP.toString()) || "10");
    const rewardThreshold = parseInt(prompt("كم نقطة للمكافأة؟", loyaltySettings.rewardThreshold.toString()) || "100");

    setLoyaltySettings({ pointsPerEGP, rewardThreshold });
  };

  if (activeTab === "exit") {
    return (
      <div className="min-h-screen bg-siwa-beige flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-siwa-charcoal mb-4">تسجيل خروج المدير</h2>
          <button
            onClick={() => setRole("storefront")}
            className="px-6 py-3 bg-siwa-gold text-white rounded-xl hover:bg-siwa-spring transition"
          >
            العودة للمتجر
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-siwa-beige p-4">
      {/* الشريط العلوي */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-siwa-charcoal">لوحة المدير</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setRole("cashier")}
            className="px-4 py-2 bg-siwa-spring text-white rounded-xl"
          >
            الكاشير
          </button>
          <button
            onClick={() => setRole("storefront")}
            className="px-4 py-2 bg-siwa-gold text-white rounded-xl"
          >
            المتجر
          </button>
        </div>
      </div>

      {/* التبويبات */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 rounded-xl whitespace-nowrap ${activeTab === "dashboard" ? "bg-siwa-gold text-white" : "bg-siwa-surface"}`}
        >
          لوحة المعلومات
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 rounded-xl whitespace-nowrap ${activeTab === "products" ? "bg-siwa-gold text-white" : "bg-siwa-surface"}`}
        >
          المنتجات
        </button>
        <button
          onClick={() => setActiveTab("customers")}
          className={`px-4 py-2 rounded-xl whitespace-nowrap ${activeTab === "customers" ? "bg-siwa-gold text-white" : "bg-siwa-surface"}`}
        >
          العملاء
        </button>
        <button
          onClick={() => setActiveTab("expenses")}
          className={`px-4 py-2 rounded-xl whitespace-nowrap ${activeTab === "expenses" ? "bg-siwa-gold text-white" : "bg-siwa-surface"}`}
        >
          المصروفات
        </button>
        <button
          onClick={() => setActiveTab("loyalty")}
          className={`px-4 py-2 rounded-xl whitespace-nowrap ${activeTab === "loyalty" ? "bg-siwa-gold text-white" : "bg-siwa-surface"}`}
        >
          نظام النقاط
        </button>
        <button
          onClick={() => setActiveTab("exit")}
          className={`px-4 py-2 rounded-xl whitespace-nowrap ${activeTab === "exit" ? "bg-siwa-charcoal text-white" : "bg-siwa-surface"}`}
        >
          خروج
        </button>
      </div>

      {/* محتوى التبويبات */}
      {activeTab === "dashboard" && (
        <div className="bg-siwa-surface rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-siwa-charcoal mb-4">لوحة المعلومات</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-siwa-beige p-4 rounded-xl">
              <p className="text-siwa-clay">إجمالي المنتجات</p>
              <p className="text-3xl font-bold text-siwa-spring">{products.length}</p>
            </div>
            <div className="bg-siwa-beige p-4 rounded-xl">
              <p className="text-siwa-clay">إجمالي العملاء</p>
              <p className="text-3xl font-bold text-siwa-gold">{customers.length}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "products" && (
        <div className="bg-siwa-surface rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-siwa-charcoal mb-4">إدارة المنتجات</h3>
          <button
            onClick={addProduct}
            className="mb-4 px-4 py-2 bg-siwa-spring text-white rounded-xl"
          >
            إضافة منتج جديد
          </button>
          <ul className="space-y-2">
            {products.map((product) => (
              <li key={product.id} className="p-3 bg-siwa-beige rounded-xl flex justify-between">
                <span>{product.name}</span>
                <span className="text-siwa-spring">{product.price} ج</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "customers" && (
        <div className="bg-siwa-surface rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-siwa-charcoal mb-4">العملاء</h3>
          <ul className="space-y-2">
            {customers.map((customer) => (
              <li key={customer.id} className="p-3 bg-siwa-beige rounded-xl">
                <div className="flex justify-between">
                  <span className="font-semibold">{customer.name}</span>
                  <span className="text-siwa-gold">{customer.points} نقطة</span>
                </div>
                <p className="text-sm text-siwa-clay">{customer.phone}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "expenses" && (
        <div className="bg-siwa-surface rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-siwa-charcoal mb-4">المصروفات</h3>
          <ul className="space-y-2">
            {expenses.map((expense) => (
              <li key={expense.id} className="p-3 bg-siwa-beige rounded-xl flex justify-between">
                <span>{expense.reason}</span>
                <span className="text-siwa-spring">{expense.amount} ج</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "loyalty" && (
        <div className="bg-siwa-surface rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-siwa-charcoal mb-4">نظام النقاط</h3>
          <div className="mb-6">
            <p className="text-siwa-clay mb-2">الإعدادات الحالية:</p>
            <p className="text-lg">كل {loyaltySettings.pointsPerEGP} جنيه = 1 نقطة</p>
            <p className="text-lg">كل {loyaltySettings.rewardThreshold} نقطة = مكافأة</p>
          </div>
          <button
            onClick={updateLoyaltySettings}
            className="w-full py-3 bg-siwa-gold text-white rounded-xl hover:bg-siwa-spring transition"
          >
            تعديل الإعدادات
          </button>
        </div>
      )}
    </div>
  );
                                                               }
