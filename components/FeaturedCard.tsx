/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import type { ReactNode } from 'react';

interface FeatureCardProps {
  stepNumber: any;
  icon: ReactNode;
  title: string;
  description: string;
  badge?: string;
}

export function FeatureCard({ stepNumber, icon, title, description, badge }: FeatureCardProps) {
  return (
    <article className="group relative flex flex-col p-5 bg-black text-white max-sm:border-[1px] lg:border-l-[1px] hover:border-[1px] border-dark-600 hover:border-dark-200 transition-all duration-300 hover:bg-gradient-to-bl hover:from-white/10 hover:from-5% hover:via-transparent hover:via-70% hover:to-transparent hover:to-100%">
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-white" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-white" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-white" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-white" />
      <div className="w-full flex justify-between mb-5">
        <div className="text-3xl" aria-label={`Icon for step ${stepNumber}: ${title}`}>
          {icon}
        </div>
        <div className="tracking-widest text-neutral-300 flex items-center gap-2 text-sm">
          <span>[</span> <span>{stepNumber}</span> <span>]</span>
        </div>
      </div>

      <div className="flex items-center mb-5">
        <h3 className="text-xl font-medium">{title}</h3>
        {badge && (
          <span className="ml-2 px-2 py-0.5 text-xs bg-neutral-800 rounded-full">{badge}</span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-start text-white/40">{description}</p>
    </article>
  );
}
