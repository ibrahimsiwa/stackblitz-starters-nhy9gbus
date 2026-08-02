import './globals.css';
import type { Metadata } from 'next';
import { Cairo, Markazi_Text } from 'next/font/google';

const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-cairo' });
const markazi = Markazi_Text({ subsets: ['arabic', 'latin'], variable: '--font-markazi' });

// ملاحظة: استبدل النطاق التالي بنطاقك الفعلي بعد النشر
export const metadata: Metadata = {
  metadataBase: new URL('https://ibnshali.com'),
  title: 'ابن شالي',
  description: 'منتجات واحة سيوة الطبيعية الفاخرة.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} ${markazi.variable} font-sans`}>{children}</body>
    </html>
  );
}