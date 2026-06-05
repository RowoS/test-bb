"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/dropdown-menu";

import { User, UtensilsCrossed, LogOut } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {LogOutUser} from "@/features/shared/libs/shared-actions"
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminNavBar() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        try {
            setIsLoading(true);

            await LogOutUser();

            router.replace("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setIsLoading(false);
        }
    };
 

    return (
    <header className="bg-accent-black fixed top-0 left-0 right-0 z-50">
      <div className="w-full px-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[var(--accent-blue)] rounded-lg flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              Buybites
            </span>
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2 bg-accent-orange hover:bg-hover-orange text-white px-5 py-2 rounded-lg">
                  <span>≡</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
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
      </div>

    </header>
  );
}