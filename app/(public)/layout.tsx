/* eslint-disable @next/next/next-script-for-ga */
/* eslint-disable @typescript-eslint/no-unused-vars */
import '@/styles/globals.css';
import '@/styles/fonts.css';

import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';

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

        {/* <div className="w-full font-mono h-5 fixed bottom-0 flex justify-center items-center bg-cyan-500 sm:bg-blue-500 md:bg-green-500 lg:bg-yellow-500 xl:bg-orange-500 2xl:bg-red-500 ">
          <p className="hidden sm:block md:hidden">sm</p>
          <p className="hidden md:block lg:hidden">md</p>
          <p className="hidden lg:block xl:hidden">lg</p>
          <p className="hidden xl:block 2xl:hidden">xl</p>
          <p className="hidden 2xl:block">2xl</p>
        </div> */}
        <Footer />
      </body>
    </html>
  );
}
