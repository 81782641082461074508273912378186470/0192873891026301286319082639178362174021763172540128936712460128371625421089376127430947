'use client';

import type { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  badge?: string;
}

export function FeatureCard({ icon, title, description, badge }: FeatureCardProps) {
  return (
    <div className="group relative flex flex-col p-8 bg-black text-white border-[0.5px] border-neutral-800 hover:border-neutral-500 transition-all duration-300">
      {/* Corner squares that appear on hover */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-white" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-white" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-white" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-white" />

      <div className="mb-6">{icon}</div>

      <div className="flex items-center mb-4">
        <h3 className="text-xl font-medium">{title}</h3>
        {badge && (
          <span className="ml-2 px-2 py-0.5 text-xs bg-neutral-800 rounded-full">{badge}</span>
        )}
      </div>

      <p className="text-neutral-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
