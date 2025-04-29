/* eslint-disable @next/next/next-script-for-ga */
/* eslint-disable @typescript-eslint/no-unused-vars */

import '@/styles/globals.css';
import '@/styles/fonts.css';

import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import BreakPointChecker from '@/components/BreakPointChecker';
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-geist bg-black">
      <body className="min-h-screen bg-black text-white selection:bg-sky-800/80 selection:text-sky-300 no-scrollbar">
        <Analytics />
        <Navbar />
        <div className="flex flex-col justify-center items-center w-full pt-12 no-scrollbar">
          {children}
        </div>
        {/* <BreakPointChecker /> */}
        <Footer />
      </body>
    </html>
  );
}
