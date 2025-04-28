import DashboardWrapper from '@/components/app/DashboardWrapper';
import { AuthDashboardProvider } from '@/context/AuthDashboardContext';

import '@/styles/globals.css';
import '@/styles/fonts.css';
import { Analytics } from '@vercel/analytics/react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="font-geist bg-black">
      <body className="min-h-screen bg-black text-white selection:bg-white/65 selection:text-black no-scrollbar">
        <Analytics />
        <div className="flex flex-col justify-center items-center w-full pt-12">
          <AuthDashboardProvider>
            <DashboardWrapper>{children}</DashboardWrapper>
          </AuthDashboardProvider>
        </div>
      </body>
    </html>
  );
}
