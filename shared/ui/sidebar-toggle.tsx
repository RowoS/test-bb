import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { SidebarToggleProps } from '@/shared/types';

export const SidebarToggle: React.FC<SidebarToggleProps> = ({ isLocked, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="
        absolute -right-3 top-4 
        bg-white hover:bg-gray-100 text-sage-500 
        rounded-full p-1 shadow-md border border-sage-200
        flex items-center justify-center
        z-50 cursor-pointer transition-transform hover:scale-110
      "
      aria-label={isLocked ? "Collapse Sidebar" : "Lock Open Sidebar"}
    >
      {isLocked ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
    </button>
  );
};