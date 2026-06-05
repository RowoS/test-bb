import React from 'react';
import { ChevronRight } from 'lucide-react';
import { SidebarProfileProps } from '@/shared/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';

export const SidebarProfile: React.FC<SidebarProfileProps> = ({ 
  name, 
  avatarUrl, 
  isOpen 
}) => {

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`
      mt-auto flex items-center p-3 rounded-2xl cursor-pointer hover:bg-sage-600/30 transition-colors
      ${isOpen ? 'justify-start' : 'justify-center'}
    `}>
      <Avatar className="w-10 h-10 border-2 border-sage-800 min-w-10">
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback className="bg-sage-200 text-sage-800 font-bold">
          {initials}
        </AvatarFallback>
      </Avatar>
      
      <div className={`
        ml-3 flex flex-col overflow-hidden transition-all duration-300
        ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}
      `}>
        <span className="text-xs text-slate-700 font-medium">Welcome Back!</span>
        <span className="text-sm font-bold text-slate-900 truncate">{name}</span>
      </div>

      <ChevronRight 
        size={16} 
        className={`
          ml-auto text-slate-800 transition-all duration-300
          ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5 hidden'}
        `}
      />
    </div>
  );
};