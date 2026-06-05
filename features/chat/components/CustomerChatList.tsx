"use client";

import { Search, ChevronRight, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCustomerConversations } from "../hooks/useCustomerChat";

export function CustomerChatList() {
    const router = useRouter();
    const { values, functions } = useCustomerConversations();

    function timeAgo(dateStr: string | null) {
        if (!dateStr) return "";
        const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
        if (diff < 60) return "just now";
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return new Date(dateStr).toLocaleDateString("en-PH", { month: "short", day: "numeric" });
    }

    return (
        <div>
            {/* Header */}
            <div
                className="rounded-xl p-8 mb-6 shadow-lg"
                style={{ background: "linear-gradient(135deg, #1D3557 0%, #1D3557 70%, #2A4A6F 100%)" }}
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1">Messages</h1>
                        <p style={{ color: "#93c5fd" }}>Your conversations with stores</p>
                    </div>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)" }}>
                        <MessageSquare className="w-8 h-8 text-white" />
                    </div>
                </div>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={values.search}
                        onChange={(e) => functions.setSearch(e.target.value)}
                        placeholder="Search conversations..."
                        className="w-full pl-12 pr-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] shadow-sm text-sm"
                    />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div
                    className="rounded-xl shadow-lg p-6 text-white"
                    style={{ background: "linear-gradient(135deg, #FF6B35, #FF8C5A)" }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm mb-1" style={{ color: "#fed7aa" }}>Total Conversations</p>
                            <p className="text-4xl font-bold">{values.conversations.length}</p>
                        </div>
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
                            <MessageSquare className="w-7 h-7 text-white" />
                        </div>
                    </div>
                </div>
                <div
                    className="rounded-xl shadow-lg p-6"
                    style={{ background: "linear-gradient(135deg, #F4D35E, #F7DC7A)", color: "#1D3557" }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm mb-1" style={{ color: "#92400e" }}>Active Stores</p>
                            <p className="text-4xl font-bold">{values.conversations.filter(c => c.last_message).length}</p>
                        </div>
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.4)" }}>
                            <MessageSquare className="w-7 h-7" style={{ color: "#1D3557" }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Conversations Container */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                {/* Container Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-[#1D3557]">All Conversations</h2>
                    <span className="text-sm text-gray-400">{values.conversations.length} total</span>
                </div>

                {values.isLoading ? (
                    <div className="p-16 text-center text-gray-400 text-sm">Loading...</div>
                ) : values.conversations.length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "#fff5f0" }}>
                            <MessageSquare className="w-8 h-8 text-[#FF6B35]" />
                        </div>
                        <p className="text-gray-500 font-medium mb-1">No conversations yet</p>
                        <p className="text-gray-400 text-sm">
                            {values.search ? "No conversations match your search." : "Start chatting with a store!"}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {values.conversations.map((conversation, index) => (
                            <div
                                key={conversation.conversation_id}
                                onClick={() => router.push(`/customer/store/${conversation.store_id}/chat?from=chats`)}
                                className="cursor-pointer transition-all duration-200 group"
                                style={
                                    conversation.last_message
                                        ? { background: "linear-gradient(to right, #fff8f5, #ffffff)" }
                                        : {}
                                }
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "linear-gradient(to right, #fff5f0, #fffaf8)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = conversation.last_message
                                        ? "linear-gradient(to right, #fff8f5, #ffffff)"
                                        : "";
                                }}
                            >
                                {/* Orange left accent for conversations with messages */}
                                <div className="flex items-center">
                                    <div
                                        className="w-1 self-stretch flex-shrink-0 rounded-r"
                                        style={{
                                            background: conversation.last_message ? "#FF6B35" : "transparent",
                                            minHeight: "88px"
                                        }}
                                    />

                                    <div className="flex items-center gap-5 px-6 py-6 flex-1 min-w-0">
                                        {/* Avatar */}
                                        <div className="relative flex-shrink-0">
                                            <div
                                                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md overflow-hidden"
                                                style={{
                                                    background: index % 2 === 0
                                                        ? "linear-gradient(135deg, #FF6B35, #F4D35E)"
                                                        : "linear-gradient(135deg, #1D3557, #2A4A6F)"
                                                }}
                                            >
                                                {conversation.store_logo ? (
                                                    <img
                                                        src={conversation.store_logo}
                                                        alt={conversation.store_name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-white font-bold text-2xl">
                                                        {conversation.store_name.charAt(0).toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-2">
                                                <h3 className="font-bold text-[#1D3557] group-hover:text-[#FF6B35] transition-colors text-lg">
                                                    {conversation.store_name}
                                                </h3>
                                                <span className="text-xs text-gray-500 whitespace-nowrap bg-gray-100 px-2.5 py-1 rounded-full flex-shrink-0">
                                                    {timeAgo(conversation.last_message_at)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500 truncate">
                                                {conversation.last_message ?? "No messages yet"}
                                            </p>
                                        </div>

                                        {/* Arrow */}
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
                                            style={{ background: "#f3f4f6" }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = "#FF6B35"}
                                            onMouseLeave={(e) => e.currentTarget.style.background = "#f3f4f6"}
                                        >
                                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}