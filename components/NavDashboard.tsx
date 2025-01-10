/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Badge from './Badge';

interface NavDashboardProps {
  role: string | null;
  type: 'account' | 'license' | null;
  license: any; // Replace with appropriate license type if available
  authDetails: any; // Replace with appropriate license type if available
  handleLogout: () => void;
}

export default function NavDashboard({
  role,
  type,
  license,
  handleLogout,
  authDetails,
}: NavDashboardProps) {
  const formattedRole =
    role && type === 'account'
      ? `${role.charAt(0).toUpperCase()}${role.slice(1)}`
      : null;

  function getGreeting(): string {
    const currentHour = new Date().getHours();

    if (currentHour >= 4 && currentHour < 12) {
      return 'Selamat Pagi 🌅';
    } else if (currentHour >= 12 && currentHour < 15) {
      return 'Selamat Siang 🌤️';
    } else if (currentHour >= 15 && currentHour < 18) {
      return 'Selamat Sore 🌇';
    } else {
      return 'Selamat Malam 🎑';
    }
  }

  const licenseKeyDisplay = type === 'license' && license?.key;
  const licenseDeviceNameDisplay =
    (type === 'license' && license?.deviceName) ||
    'Belum Terhubung ke Perangkat Manapun';
  const greeting = getGreeting();
  console.log('hehehehehe', authDetails);
  const user = authDetails?.user;
  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white p-4 z-50 shadow-md flex justify-between items-center">
      <div>
        {type === 'account' && formattedRole && (
          <div>
            <h1 className="text-lg font-bold">
              Hi, {user.name}. {greeting}
            </h1>
            <Badge
              text={formattedRole}
              color="text-white/50"
              bgColor="bg-white/10"
            />
          </div>
        )}
        {type === 'license' && (
          <div>
            <h1 className="text-lg font-bold">{greeting}</h1>
            <Badge
              text={`License: ${licenseKeyDisplay}`}
              color="text-white/50"
              bgColor="bg-white/10"
            />
            <Badge
              text={`Device Name: ${licenseDeviceNameDisplay}`}
              color="text-white/50"
              bgColor="bg-white/10"
            />
          </div>
        )}
      </div>
      <div>
        <p>{user?.email}</p>
        <p>{user?.whatsappNumber}</p>
        <p>{user?.username}</p>
      </div>
      <button
        onClick={handleLogout}
        className="mt-6 text-sm text-red-400 underline"
      >
        Logout
      </button>
    </nav>
  );
}
