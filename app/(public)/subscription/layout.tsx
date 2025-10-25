'use client';

import React from 'react';
import { HomeWrapper } from '@/components/HomeWrapper';

export default function SubscriptionLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen w-full overflow-hidden text-white relative selection:bg-white/65 selection:text-black no-scrollbar flex flex-col justify-start items-center bg-gradient-to-t from-white/10 from-5% via-transparent via-50% to-black to-100%">
      <HomeWrapper>
        <div className="w-full flex flex-col border-x-[1px] border-white/20 py-24 lg:py-32 px-5 xl:px-0 gap-10 justify-center items-center max-w-screen-xl">
          {children}
        </div>
      </HomeWrapper>
    </main>
  );
}
