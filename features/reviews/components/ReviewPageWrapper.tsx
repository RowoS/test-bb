import { SidebarInset, SidebarProvider } from "@/shared/ui/sidebar";
import VendorReviewPage from "./ReviewPage";
import VendorNavBar from "@/features/vendor/components/shared/VendorNavBar";
import VendorSidebar from "@/features/vendor/components/shared/VendorSideBar";

export default function ReviewPageWrapper() {
    return (
    <SidebarProvider style={{ background: "#FFF8F5" }}>
      <VendorSidebar />

      <SidebarInset style={{ background: "#FFF8F5" }}>
        <VendorNavBar />
        <main className="min-h-screen p-6">
            <div className="max-w-9xl mx-auto"
            style={{ marginRight: "8rem" }}>
                <VendorReviewPage />
            </div>
        </main>
      </SidebarInset>

    </SidebarProvider>
  );
}