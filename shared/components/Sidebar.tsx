'use client'

import { SidebarHeader } from "./SidebarHeader"
import { SidebarToggle } from "@/shared/ui/sidebar-toggle"
import { SidebarItem } from "@/shared/ui/sidebar-item"
import { PrimarySidebarItems, SecondarySidebarItems } from "./SidebarItemConfig";
import { useSidebarLogic } from "@/shared/hooks/sidebar-logic";
import { SidebarProfile } from "./SidebarProfile";
import { MenuItemConfig } from "@/shared/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';

export default function Sidebar() {
    const { isOpen, isLocked, toggleLock, containerProps } = useSidebarLogic();
    
    const pathname = usePathname();


    const isRouteActive = (href: string) => {
        const taskContextPaths = ['/dashboard', '/gardens', '/tasks'];
        return (pathname === href || pathname.startsWith(`${href}/`)) ||
               (href === '/tasks' && taskContextPaths.includes(pathname));
    };

    const renderNavItems = (items: MenuItemConfig[]) => (
        items.map((item) => {
            const isActive = isRouteActive(item.href);

            return (
                <Link 
                    key={item.id} 
                    href={item.href || '#'} 
                    className="block"
                >
                    <SidebarItem 
                        icon={item.icon} 
                        label={item.label} 
                        isOpen={isOpen} 
                        isActive={isActive}
                    />
                </Link>
            );
        })
    );


    const mobileItems: (MenuItemConfig & { isProfile?: boolean })[] = [
        ...PrimarySidebarItems,
        SecondarySidebarItems.find(item => item.id === 'Notifications'),
        {
            id: 'Profile',
            label: 'Profile',
            icon: null, //
            href: '/profile',
            isProfile: true 
        }
    ].filter(Boolean) as any; 

    return (
        <>

            <aside
                {...containerProps}
                className={`
                    hidden md:flex
                    shrink-0
                    relative h-screen bg-accent-green shadow-xl flex-col py-6 px-3
                    transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)]
                    ${isOpen ? 'w-64' : 'w-20'}
                `}
            >
                <SidebarToggle isLocked={isLocked} onToggle={toggleLock} />

                <SidebarHeader isOpen={isOpen} />

                <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-2 no-scrollbar">
                    {renderNavItems(PrimarySidebarItems)}
                </div>

                <div className="my-4 border-t border-sage-600/50 w-full" />

                <div className="mb-6 space-y-2">
                    {renderNavItems(SecondarySidebarItems)}
                </div>

                <SidebarProfile 
                    name="Froakie" 
                    avatarUrl="https://picsum.photos/200" 
                    isOpen={isOpen}
                />
            </aside>


            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#F3F6E7] shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex justify-around items-stretch h-20 z-50">
                {mobileItems.map((item) => {
                    const isActive = isRouteActive(item.href);

                    return (
                        <Link 
                            key={item.id} 
                            href={item.href || '#'}
                            className={`flex-1 flex flex-col items-center justify-center pt-2 pb-1 transition-colors ${isActive ? 'bg-[#EEF3DC] border-t-[3px] border-lime-500' : 'border-t-[3px] border-transparent'}`}
                        >
                            <div className="mb-1 text-slate-800">
                                {item.isProfile ? (
                                     <Avatar className="w-7 h-7 border border-sage-800">
                                        <AvatarImage src="https://picsum.photos/200" alt="Froakie" />
                                        <AvatarFallback>FR</AvatarFallback>
                                    </Avatar>
                                ) : (
                                    item.icon
                                )}
                            </div>
                            <span className={`text-xs font-medium ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </>
    )
}