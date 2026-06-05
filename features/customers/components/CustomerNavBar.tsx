"use client";

import Image from 'next/image';   // ✅ add this import
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/dropdown-menu";

import { User, UtensilsCrossed, LogOut } from "lucide-react";
import { Button } from "@/shared/ui/button";
import CustomerProfileOverlay from "@/features/profiles/components/overlays/CustomerProfileModal"
import { useCustomerNavBar } from "../hooks/CustomerNavBarLogic";
import { NotificationsDropdown } from "@/features/notifications/components/NotificationButton";

export default function CustomerNavBar() {
  const { handleLogout, openProfile, setOpenProfile, isLoading} = useCustomerNavBar();

   const handleSetOpenProfile = (value: boolean) => {
        setOpenProfile(value);
    };

  return (
    <header className="bg-accent-black fixed top-0 left-0 right-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Replace icon with logo image */}
            <div className="w-10 h-10 bg-[var(--accent-blue)] rounded-lg flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Buybites logo"
                width={50}
                height={50}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold text-white">
              Buybites
            </span>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <NotificationsDropdown />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2 bg-accent-orange hover:bg-hover-orange text-white px-4 md:px-5 py-2 rounded-lg">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleSetOpenProfile(true)}>
                  User Profile
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-500"
                  disabled={isLoading}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {isLoading ? "Logging out..." : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {openProfile && (<CustomerProfileOverlay onClose={() => handleSetOpenProfile(false)} />)}
      </div>
    </header>
  );
}