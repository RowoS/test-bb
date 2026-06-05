import { ChatWindow } from "@/features/chat/components/ChatWindow";
import { getOrCreateConversation, getStoreName } from "../libs/chat-actions";
import { redirect } from "next/navigation";
import CustomerNavBar from "@/features/customers/components/CustomerNavBar";

interface ChatPageProps {
    params: Promise<{ storeId: string }>;
    searchParams: Promise<{ from?: string }>;
}

export default async function ChatPage({ params, searchParams }: ChatPageProps) {
    const { storeId } = await params;
    const { from } = (await searchParams) ?? {};

    try {
        const { conversationId, userId } = await getOrCreateConversation(storeId);
        const storeName = await getStoreName(storeId);
        
        return (
            <>
                <CustomerNavBar/>
                <ChatWindow 
                    conversationId={conversationId} 
                    currentUserId={userId}
                    storeName={storeName}
                    backUrl={from === "chats" ? "/customer?tab=chats" : undefined}
                />
            </>
        );
    } catch (error: any) {
        if (error.message === "User not authenticated") redirect("/login");

        return (
            <div className="h-screen flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #f8f6f0 0%, #fef9f0 50%, #f5f3ee 100%)" }}>
                <div className="text-center">
                    <p className="text-red-600 mb-4">Error loading chat</p>
                </div>
            </div>
        );
    }
}