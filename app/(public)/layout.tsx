/* eslint-disable @next/next/next-script-for-ga */
/* eslint-disable @typescript-eslint/no-unused-vars */

import '@/styles/globals.css';
import '@/styles/fonts.css';

import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
// import BreakPointChecker from '@/components/BreakPointChecker';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-geist bg-black">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="min-h-screen bg-black text-white selection:bg-white/65 selection:text-black no-scrollbar ">
        <Navbar />
        <div className="flex flex-col justify-center items-center w-full mt-12">{children}</div>
        {/* <BreakPointChecker /> */}
        <Footer />
      </body>
    </html>
  );
}
