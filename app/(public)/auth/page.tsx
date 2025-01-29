'use client';

import Daftar from '@/components/auth/Daftar';
import Login from '@/components/auth/Login';
import React, { useState } from 'react';

const Page = () => {
  // State to manage which section is active
  const [activeSection, setActiveSection] = useState<'login' | 'daftar'>('login');

  // Function to toggle between login and daftar
  const toggleSection = (section: 'login' | 'daftar') => {
    setActiveSection(section);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => toggleSection('login')}
          className={`px-4 py-2 rounded ${activeSection === 'login' ? 'bg-white text-black' : ''}`}>
          Login
        </button>
        <button
          onClick={() => toggleSection('daftar')}
          className={`px-4 py-2 rounded ${
            activeSection === 'daftar' ? 'bg-white text-black' : ''
          }`}>
          Daftar
        </button>
      </div>
      <div>{activeSection === 'login' ? <Login /> : <Daftar />}</div>
    </div>
  );
};

export default Page;
