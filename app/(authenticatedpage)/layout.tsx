import DashboardWrapper from '@/components/DashboardWrapper';
import { AuthDashboardProvider } from '@/context/AuthDashboardContext';

import '@/styles/globals.css';

export const metadata = {
  title: 'Dashboard',
  description: 'Your central dashboard for managing everything.',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex w-full h-screen">
        <AuthDashboardProvider>
          <DashboardWrapper>{children}</DashboardWrapper>
        </AuthDashboardProvider>
      </body>
    </html>
  );
}
