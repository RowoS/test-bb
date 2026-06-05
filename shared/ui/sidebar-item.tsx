import React from 'react';
import { SidebarItemProps } from '@/shared/types';

export const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon, 
  label, 
  isActive = false, 
  isOpen, 
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        group flex items-center w-full p-3 mb-2 rounded-2xl transition-all duration-300 ease-in-out
        ${isActive 
          ? 'bg-accent-white text-sky-500 shadow-sm' 
          : 'text-slate-900 hover:bg-sage-600/30'
        }
      `}
      title={!isOpen ? label : undefined}
    >
      <div className={`
        flex items-center justify-center min-w-6
        ${isActive ? 'text-sky-500' : 'text-slate-800'}
      `}>
        {icon}
      </div>
      
      <span 
        className={`
          ml-4 whitespace-nowrap font-medium text-sm transition-all duration-300 overflow-hidden
          ${isOpen ? 'opacity-100 max-w-sm' : 'opacity-0 max-w-0'}
          ${isActive ? 'text-sky-500' : 'text-slate-800'}
        `}
      >
        {label}
      </span>
    </button>
  );
};