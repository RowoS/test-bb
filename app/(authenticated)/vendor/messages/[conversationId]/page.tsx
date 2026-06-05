import CatalogPage from "@/features/catalog/vendor/CatalogPage";
import { VendorChatPage } from "@/features/chat/components/VendorChatPage";
import VendorNavBar from "@/features/vendor/components/shared/VendorNavBar";
import VendorSidebar from "@/features/vendor/components/shared/VendorSideBar";
import { SidebarInset, SidebarProvider } from "@/shared/ui/sidebar";

export default async function Page({ params }: { params: Promise<{ conversationId: string }> }) {
    return (

        <main className="pt-25" style={{ background: "#f1f5f9" }}>
            <VendorChatPage params={params} />
        </main>
    )
}