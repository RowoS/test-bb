import VendorNavBar from "@/features/vendor/components/shared/VendorNavBar";
import VendorSidebar from "@/features/vendor/components/shared/VendorSideBar";
import VendorDashboard from "./VendorDashboard";
import { SidebarProvider, SidebarInset } from "@/shared/ui/sidebar";
import { Package } from "lucide-react";

export default function VendorDashboardWrapper() {
  return (
    <SidebarProvider>
      <VendorSidebar />

      <SidebarInset>
        <VendorNavBar />

        <main className="pt-25">
          <VendorDashboard />
        </main>
      </SidebarInset>

    </SidebarProvider>
  );
}