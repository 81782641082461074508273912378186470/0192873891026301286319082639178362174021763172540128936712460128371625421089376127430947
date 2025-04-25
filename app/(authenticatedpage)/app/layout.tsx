import DashboardWrapper from '@/components/DashboardWrapper';
import { AuthDashboardProvider } from '@/context/AuthDashboardContext';

import '@/styles/globals.css';
import '@/styles/fonts.css';

export const metadata = {
  title: 'App Center Autolaku',
  description: 'Autolaku Application Center.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="font-geist bg-black">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="min-h-screen bg-black text-white selection:bg-white/65 selection:text-black no-scrollbar">
        <div className="flex flex-col justify-center items-center w-full mt-12">
          <AuthDashboardProvider>
            <DashboardWrapper>{children}</DashboardWrapper>
          </AuthDashboardProvider>
        </div>
      </body>
    </html>
  );
}
