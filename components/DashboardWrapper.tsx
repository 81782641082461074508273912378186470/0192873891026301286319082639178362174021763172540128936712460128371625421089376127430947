'use client';

import { useAuth } from '@/context/AuthDashboardContext';
import NavDashboard from '@/components/NavDashboard';

export default function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const { role, license, handleLogout, authDetails, type } = useAuth();
  return (
    <div className="flex flex-col w-full h-screen">
      <NavDashboard
        role={role}
        type={type}
        license={license}
        authDetails={authDetails}
        handleLogout={handleLogout}
      />
      <main className="flex-1 p-6 overflow-y-auto bg-gray-50 sm:p-4">{children}</main>
    </div>
  );
}
