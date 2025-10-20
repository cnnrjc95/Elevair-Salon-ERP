import '@/styles/globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import Providers from '@/components/providers/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Elevair Salon ERP',
  description: 'Elevair — modern salon management platform for ambitious teams.',
  metadataBase: new URL('https://elevair.example.com'),
  openGraph: {
    title: 'Elevair Salon ERP',
    description: 'Dark, modern salon ERP for teams who care about hospitality.',
    type: 'website'
  },
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full bg-slate-950">
      <body className={`${inter.className} bg-slate-950 text-slate-100`}> 
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
