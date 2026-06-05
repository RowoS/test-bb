import React from 'react';
import Image from 'next/image';
import LogoImage from '@/public/gardemic-logo.svg';
import { SidebarHeaderProps } from '@/shared/types';

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ isOpen }) => {
  return (
    <div className={`flex items-center mb-10 ${!isOpen ? 'justify-center' : 'px-2'}`}>
      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300">
         <Image 
           src={LogoImage}
           alt="Gardemic Logo"
           width={37}
           height={37}
         />
      </div>
      
      <h1 
        className={`
          ml-3 font-bold text-xl text-accent-white tracking-tight transition-all font-aclonica duration-300 overflow-hidden whitespace-nowrap
          ${isOpen ? 'opacity-100 max-w-[150px]' : 'opacity-0 max-w-0'}
        `}
      >
        Gardemic
      </h1>
    </div>
  );
};