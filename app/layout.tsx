import type { Metadata } from 'next';
import { Cormorant_Garamond, Space_Mono, Barlow_Condensed } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const spaceMono = Space_Mono({
  variable: '--font-space-mono',
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const barlowCondensed = Barlow_Condensed({
  variable: '--font-barlow-condensed',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TheLifeFolder — Everything That Matters, Filed',
  description: 'An archive of references, vintage finds, pop culture moments, and writings that felt too important to lose.',
  openGraph: {
    title: 'TheLifeFolder',
    description: 'Everything that matters, filed.',
    siteName: 'TheLifeFolder',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${spaceMono.variable} ${barlowCondensed.variable}`}>
      <body>{children}</body>
    </html>
  );
}
