import VendorNavBar from "@/features/vendor/components/shared/VendorNavBar";
import VendorSidebar from "@/features/vendor/components/shared/VendorSideBar";
import { SidebarProvider, SidebarInset } from "@/shared/ui/sidebar";
import { VendorsOrdersPage} from "./VendorOrderPage";

export default function VendorOrdersWrapper() {
  return (
    <SidebarProvider style={{ background: "#f1f5f9" }}>
      <VendorSidebar />

      <SidebarInset style={{ background: "#f1f5f9" }}>
        <VendorNavBar />

        <main className="pt-25" style={{ marginRight: "8rem" }}>
            <VendorsOrdersPage/>
        </main>

      </SidebarInset>

    </SidebarProvider>
  );
}