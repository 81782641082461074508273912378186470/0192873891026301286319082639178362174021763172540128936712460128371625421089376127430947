'use client';

import { useAuth } from '@/context/AuthDashboardContext';
import NavApp from '@/components/app/NavDashboard';

export default function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const { role, license, handleLogout, authDetails, type } = useAuth();
  return (
    <>
      <NavApp
        role={role}
        type={type}
        license={license}
        authDetails={authDetails}
        handleLogout={handleLogout}
      />
      {children}
    </>
  );
}
