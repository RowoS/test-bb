"use client";

import { forwardRef } from "react";
import { Send } from "lucide-react";
import type { ChatMessagesProps } from "../types/types";

export const ChatMessages = forwardRef<HTMLDivElement | null, ChatMessagesProps>(
    ({ messages, currentUserId, isLoadingMore, bottomRef }, containerRef) => {
        return (
            <div
                ref={containerRef}
                className="flex-1 overflow-y-auto px-6 py-6 space-y-4"
            >
                {isLoadingMore && (
                    <div className="text-center py-2">
                        <span className="text-xs text-gray-400">Loading older messages...</span>
                    </div>
                )}

                {messages.map((msg) => {
                    const isOwn = msg.sender_id === currentUserId;
                    return (
                        <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                            <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"} max-w-[65%]`}>
                                <div
                                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                        isOwn
                                            ? "text-white rounded-br-sm"
                                            : "bg-white text-[#1D3557] rounded-bl-sm shadow-sm border border-gray-100"
                                    }`}
                                    style={isOwn ? { background: "linear-gradient(135deg, #FF6B35, #d85327)" } : {}}
                                >
                                {msg.content}
                                </div>
                                <p className="text-xs text-gray-400 mt-1 px-1">
                                    {new Date(msg.created_at).toLocaleTimeString("en-PH", {
                                        hour: "numeric",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                        </div>
                    );
                })}

                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center pt-20">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
                            style={{ background: "linear-gradient(135deg, #FFE8DF, #FFF3E0)" }}>
                            <Send className="w-7 h-7 text-[#FF6B35]" />
                        </div>
                        <p className="text-[#1D3557] font-medium mb-1">No messages yet</p>
                        <p className="text-gray-400 text-sm">Say hello to get the conversation started!</p>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>
        );
    }
);

ChatMessages.displayName = "ChatMessages";