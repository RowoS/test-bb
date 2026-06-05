import ChatPage from "@/features/chat/components/CustomerChatPage";

export default function Page({ params, searchParams }: { params: Promise<{ storeId: string }>, searchParams: Promise<{ from?: string }> }) {
    return <ChatPage params={params} searchParams={searchParams} />;
}