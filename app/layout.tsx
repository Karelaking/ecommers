import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/providers';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EthnicWear - Traditional Indian Fashion Online',
  description: 'Discover finest collection of traditional Indian ethnic wear. Shop authentic sarees, salwar kameez, lehengas, kurtis and more with worldwide shipping.',
  keywords: 'ethnic wear, indian fashion, sarees, salwar kameez, lehengas, kurtis, traditional clothing, online shopping',
  authors: [{ name: 'EthnicWear' }],
  creator: 'EthnicWear',
  publisher: 'EthnicWear',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    title: 'EthnicWear - Traditional Indian Fashion Online',
    description: 'Discover finest collection of traditional Indian ethnic wear. Shop authentic sarees, salwar kameez, lehengas, kurtis and more.',
    siteName: 'EthnicWear',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'EthnicWear - Traditional Indian Fashion',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EthnicWear - Traditional Indian Fashion Online',
    description: 'Discover finest collection of traditional Indian ethnic wear.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}