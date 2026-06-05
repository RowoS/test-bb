import CatalogPage from "@/features/catalog/vendor/CatalogPage";
import { SidebarInset, SidebarProvider } from "@/shared/ui/sidebar";
import VendorNavBar from "@/features/vendor/components/shared/VendorNavBar";
import VendorSidebar from "@/features/vendor/components/shared/VendorSideBar";

export default function VendorCatalog() {
  return (
    <SidebarProvider style={{ background: "#FFF8F5" }}>
      <VendorSidebar />

      <SidebarInset style={{ background: "#FFF8F5" }}>
        <VendorNavBar />
        <main className="pt-25" style={{ marginRight: "8rem" }}>
          <CatalogPage />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}