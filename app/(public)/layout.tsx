/* eslint-disable @next/next/next-script-for-ga */
/* eslint-disable @typescript-eslint/no-unused-vars */
import '@/styles/globals.css';
import Navbar from '@/components/ui/NavBar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="font-mono min-h-screen bg-white text-black selection:bg-blue-200 selection:text-black">
        <Navbar />
        <div className="flex flex-col justify-center items-center w-full mt-16 lg:mt-32">
          {children}
        </div>

        <div className="w-full font-mono h-5 fixed bottom-0 flex justify-center items-center bg-cyan-500 sm:bg-blue-500 md:bg-green-500 lg:bg-yellow-500 xl:bg-orange-500 2xl:bg-red-500 ">
          <p className="hidden sm:block md:hidden">sm</p>
          <p className="hidden md:block lg:hidden">md</p>
          <p className="hidden lg:block xl:hidden">lg</p>
          <p className="hidden xl:block 2xl:hidden">xl</p>
          <p className="hidden 2xl:block">2xl</p>
        </div>
      </body>
    </html>
  );
}
