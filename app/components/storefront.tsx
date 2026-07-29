"use client";

import { Product, Role } from "../page";
interface StorefrontProps {
  products: Product[];
  setRole: (role: Role) => void;
}

export default function Storefront({ products, setRole }: StorefrontProps) {
  return (
    <div className="min-h-screen bg-siwa-beige">
      {/* الهيدر */}
      <header className="bg-siwa-surface shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-siwa-gold mb-2">ابن شالي</h1>
            <p className="text-siwa-clay">IBN SHALI EST.</p>
          </div>
          
          {/* صورة واحة سيوة */}
          <div className="w-full h-48 bg-siwa-clay rounded-2xl overflow-hidden mb-6">
            <img
              src="/siwa-oasis.jpg"
              alt="واحة سيوة"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* المنتجات */}
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-siwa-charcoal mb-6 text-center">منتجاتنا</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-siwa-surface rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <div className="w-full h-48 bg-siwa-beige">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-t-2xl"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-siwa-charcoal mb-2">{product.name}</h3>
                <p className="text-siwa-clay mb-4">{product.category}</p>
                <button className="w-full py-3 bg-siwa-spring text-white rounded-xl hover:bg-siwa-gold transition">
                  عرض التفاصيل
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* زر دخول الفريق */}
      <footer className="fixed bottom-4 right-4">
        <button
          onClick={() => setRole("owner")}
          className="px-4 py-2 bg-siwa-charcoal text-white rounded-xl text-sm"
        >
          دخول الفريق
        </button>
      </footer>
    </div>
  );
}
