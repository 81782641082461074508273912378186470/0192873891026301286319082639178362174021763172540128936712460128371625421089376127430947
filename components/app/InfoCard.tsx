/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldConfig } from '@/types/auth';
import React from 'react';

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  fields: FieldConfig[];
  data: Record<string, any>;
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, fields, data, className = '' }) => {
  const renderKeyValue = (label: string, value: any, key: string) => (
    <div
      key={key}
      className="flex w-full justify-between items-center py-3 border-b border-white/5 
                group/field hover:bg-white/5 transition-colors duration-200 px-2">
      <p className="text-sm font-light select-none text-slate-400 group-hover/field:text-slate-300 transition-colors duration-200">
        {label}
      </p>
      <div className="text-sm font-medium text-white/90 select-none group-hover/field:text-white transition-colors duration-200">
        {value ?? '-'}
      </div>
    </div>
  );

  const renderFields = (data: Record<string, any>, fields: FieldConfig[]) =>
    fields.map(({ key, label, format }) => {
      const value = data[key];
      const displayValue = format ? format(value) : value;
      return renderKeyValue(label, displayValue, key);
    });

  return (
    <div
      className={`group relative flex flex-col backdrop-blur-md bg-black/40 overflow-hidden
                   border border-white/10 shadow-lg shadow-black/30 transition-all duration-300
                   hover:shadow-xl hover:shadow-black/40 hover:border-white/20 h-full ${className}`}>
      <div
        className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />
      <div
        className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />
      <div
        className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />
      <div
        className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />

      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />

      <div className="relative flex justify-between items-center p-5 border-b border-white/5">
        <div className="text-white/80 transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
        <div
          className="bg-black/30 px-3 py-1 border border-white/10 
                     flex items-center gap-2 text-xs font-medium tracking-widest text-white/80">
          <span className="text-white">[</span>
          <span>{title}</span>
          <span className="text-white">]</span>
        </div>
      </div>

      <div className="p-5 space-y-1 flex-grow">{renderFields(data, fields)}</div>
    </div>
  );
};

export default InfoCard;
