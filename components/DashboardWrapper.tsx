'use client';

import { useAuth } from '@/context/AuthDashboardContext';
import NavDashboard from '@/components/NavDashboard';

export default function DashboardWrapper({ children }: { children: React.ReactNode }) {
  const { role, license, handleLogout, authDetails, type } = useAuth();
  return (
    <>
      <NavDashboard
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
