import './globals.css';
import type { Metadata } from 'next';
import { Inter, Cairo } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' });

export const metadata: Metadata = {
  metadataBase: new URL('https://ibnshali.com'),
  title: 'ابن شالي',
  description: 'متجر ابن شالي للمنتجات الطبيعية من سيوة.',
  openGraph: {
    title: 'ابن شالي',
    description: 'متجر ابن شالي للمنتجات الطبيعية من سيوة.',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${inter.variable} ${cairo.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}