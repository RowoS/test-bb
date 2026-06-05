"use client"
import Link from "next/link"
import { data } from "@/features/vendor/types/types"

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/shared/ui/sidebar"
import { usePathname } from "next/navigation"

export default function VendorSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="w-48">
      <SidebarContent className="flex flex-col items-center pt-30">
        <SidebarMenu className="space-y-4 w-full flex flex-col items-center">
          {data.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <SidebarMenuItem key={item.label} className="bg-transparent hover:bg-transparent w-full flex justify-center">
                <SidebarMenuButton
                  asChild
                  className={`inline-flex items-center justify-start space-x-2 w-36 h-10 rounded-md text-lg transition-colors
                    ${isActive ? "bg-orange-500 text-white" : "hover:bg-orange-500 hover:text-white"}
                  `}
                >
                  <Link href={item.href}>
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}