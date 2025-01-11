'use client';

import { useAuth } from '@/context/AuthDashboardContext';
import NavDashboard from '@/components/NavDashboard';

export default function DashboardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, license, handleLogout, authDetails, type } = useAuth();
  console.log('WOKWOKWOKWOKWKO', license);
  console.log('WIKWIKWIKWIK', license);
  console.log('WEKWEKWEKWEK', authDetails);
  return (
    <div className="flex flex-col w-full h-screen">
      <NavDashboard
        role={role}
        type={type}
        license={license}
        authDetails={authDetails}
        handleLogout={handleLogout}
      />

      <main className="flex-1 p-6 overflow-y-auto bg-gray-50 sm:p-4">
        <div>
          {type === 'account' && role === 'owner' && (
            <div>
              <h1 className="text-2xl font-bold sm:text-xl">Welcome, Owner</h1>
              <p className="sm:text-sm">Manage your business here.</p>
            </div>
          )}
          {type === 'account' && role === 'admin' && (
            <div>
              <h1 className="text-2xl font-bold sm:text-xl">Welcome, Admin</h1>
              <p className="sm:text-sm">Manage administrative tasks here.</p>
            </div>
          )}
          {type === 'license' && role === 'user' && (
            <div>
              <h1 className="text-2xl font-bold sm:text-xl">
                Welcome, Licensed User
              </h1>
              <p className="sm:text-sm">View your license details here.</p>
            </div>
          )}
        </div>

        {children}
      </main>
    </div>
  );
}
