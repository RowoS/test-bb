import { ChatWindow } from "@/features/chat/components/ChatWindow";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function VendorChatPage({ params }: { params: Promise<{ conversationId: string }> }) {
    const { conversationId } = await params;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data } = await supabase
        .from("conversations")
        .select("profiles(username)")
        .eq("id", conversationId)
        .single();

    

    const customerName = (data?.profiles as any)?.username ?? "Customer";

    return (
        <div className="h-screen flex flex-col">
            <ChatWindow
                conversationId={conversationId}
                currentUserId={user.id}
                storeName={customerName}
                backUrl="/vendor/messages"
            />
        </div>
    );
}