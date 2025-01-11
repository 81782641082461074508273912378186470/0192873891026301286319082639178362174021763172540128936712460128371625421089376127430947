'use client';

import '@/styles/globals.css';
import React from 'react';
import { useAuth } from '@/context/AuthDashboardContext';

export default function DashboardPage() {
  const { role } = useAuth();
  if (!role) return null; // Avoid rendering if role is not loaded yet

  return (
    <div className="p-32 flex flex-col w-full h-screen gap-10 bg-black text-white">
      {role === 'owner' && (
        <div>
          <h1 className="text-2xl font-bold sm:text-xl">Welcome, Owner</h1>
          <p className="sm:text-sm">Manage your business here.</p>
        </div>
      )}
      {role === 'admin' && (
        <div>
          <h1 className="text-2xl font-bold sm:text-xl">Welcome, Admin</h1>
          <p className="sm:text-sm">Manage administrative tasks here.</p>
        </div>
      )}
      {role === 'user' && (
        <div>
          <h1 className="text-2xl font-bold sm:text-xl">Welcome, User</h1>
          <p className="sm:text-sm">View your account details here.</p>
        </div>
      )}
    </div>
  );
}
