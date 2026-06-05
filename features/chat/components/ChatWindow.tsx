"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Phone, Video, MoreVertical } from "lucide-react";
import { useChat } from "../hooks/useChat";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";
import type { ChatWindowProps } from "../types/types";

export function ChatWindow({ conversationId, currentUserId, storeName, backUrl }: ChatWindowProps) {
    const router = useRouter();
    const { messages, isLoading, isSending, isLoadingMore, send, containerRef, bottomRef } = useChat(conversationId);

    const handleBack = () => {
        if (backUrl) {
            router.push(backUrl);
        } else {
            router.back();
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen" style={{ background: "linear-gradient(135deg, #f8f6f0 0%, #fef9f0 50%, #f5f3ee 100%)" }}>
            {/* Square Box Container */}
            <div className="w-full max-w-7xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col m-4" style={{ height: "80vh" }}>
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shadow-sm flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleBack}
                            className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100"
                        >
                            <ArrowLeft className="w-5 h-5 text-[#1D3557]" />
                        </button>

                        <div className="relative">
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#F4D35E] flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-base">
                                    {storeName?.charAt(0).toUpperCase() ?? "S"}
                                </span>
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
                        </div>

                        <div>
                            <h2 className="font-bold text-[#1D3557] text-base leading-tight">{storeName ?? "Store"}</h2>
                            <p className="text-xs text-green-500 font-medium">Active now</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <button className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#1D3557] hover:bg-gray-100 transition-colors">
                            <Phone className="w-4 h-4" />
                        </button>
                        <button className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#1D3557] hover:bg-gray-100 transition-colors">
                            <Video className="w-4 h-4" />
                        </button>
                        <button className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#1D3557] hover:bg-gray-100 transition-colors">
                            <MoreVertical className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Messages */}
                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-gray-400 text-sm">Loading messages...</p>
                    </div>
                ) : (
                    <ChatMessages
                        ref={containerRef}
                        bottomRef={bottomRef}
                        messages={messages}
                        currentUserId={currentUserId}
                        isLoadingMore={isLoadingMore}
                    />
                )}

                <ChatInput onSend={send} isSending={isSending} />
            </div>
        </div>
    );
}