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
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-F8M11Q5S92" />

      <body className="min-h-screen bg-black text-white selection:bg-sky-500/10 selection:text-sky-500 no-scrollbar">
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
