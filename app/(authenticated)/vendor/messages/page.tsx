import { VendorChatList } from "@/features/chat/components/VendorChatList";
import VendorNavBar from "@/features/vendor/components/shared/VendorNavBar";
import VendorSidebar from "@/features/vendor/components/shared/VendorSideBar";
import { SidebarInset, SidebarProvider } from "@/shared/ui/sidebar";

export default function VendorMessagesPage() {
    return (
        <SidebarProvider style={{ background: "#f1f5f9" }}>
            <VendorSidebar />

            <SidebarInset style={{ background: "#f1f5f9" }}>
                <VendorNavBar />
                <main className="pt-25">
                    <VendorChatList />
                </main>
            </SidebarInset>

        </SidebarProvider>
    );
}