"use client";

import { useState, useEffect } from "react";
import Storefront from "./components/storefront";
import Owner from "./components/owner";
import Cashier2 from "./components/cashier2";

export type Role = "storefront" | "owner" | "cashier";

export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  acidity?: string;
  description?: string;
};

export type Customer = {
  id: number;
  name: string;
  phone: string;
  points: number;
  totalPurchases: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Expense = {
  id: number;
  amount: number;
  reason: string;
  date: string;
};

export type LoyaltySettings = {
  pointsPerEGP: number;
  rewardThreshold: number;
};

export default function Home() {
  const [role, setRole] = useState<Role>("storefront");
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loyaltySettings, setLoyaltySettings] = useState<LoyaltySettings>({
    pointsPerEGP: 10,
    rewardThreshold: 100,
  });

  useEffect(() => {
    const savedProducts = localStorage.getItem("ibnShali_products");
    const savedCustomers = localStorage.getItem("ibnShali_customers");
    const savedExpenses = localStorage.getItem("ibnShali_expenses");
    const savedLoyalty = localStorage.getItem("ibnShali_loyalty");

    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedCustomers) setCustomers(JSON.parse(savedCustomers));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedLoyalty) setLoyaltySettings(JSON.parse(savedLoyalty));
  }, []);

  useEffect(() => {
    localStorage.setItem("ibnShali_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("ibnShali_customers", JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem("ibnShali_expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("ibnShali_loyalty", JSON.stringify(loyaltySettings));
  }, [loyaltySettings]);

  return (
    <main className="min-h-screen bg-siwa-beige">
      {role === "storefront" && (
        <Storefront
          products={products}
          setRole={setRole}
        />
      )}
      {role === "owner" && (
        <Owner
          products={products}
          setProducts={setProducts}
          customers={customers}
          setCustomers={setCustomers}
          expenses={expenses}
          setExpenses={setExpenses}
          loyaltySettings={loyaltySettings}
          setLoyaltySettings={setLoyaltySettings}
          setRole={setRole}
        />
      )}
      {role === "cashier" && (
        <Cashier2
          products={products}
          customers={customers}
          setCustomers={setCustomers}
          expenses={expenses}
          setExpenses={setExpenses}
          loyaltySettings={loyaltySettings}
          setRole={setRole}
        />
      )}
    </main>
  );
}
