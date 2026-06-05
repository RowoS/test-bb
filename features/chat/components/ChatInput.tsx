"use client";

import { useState, FormEvent } from "react";
import { Paperclip, Smile, Send } from "lucide-react";
import type { ChatInputProps } from "../types/types";

export function ChatInput({ onSend, isSending }: ChatInputProps) {
    const [input, setInput] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isSending) return;
        await onSend(input);
        setInput("");
    };

    return (
        <div className="px-6 py-4 bg-white border-t border-gray-100 flex-shrink-0">
            <form onSubmit={handleSubmit}>
                <div className="flex items-center gap-3">
                    {/* Attachment */}
                    <button
                        type="button"
                        className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-[#FF6B35] transition-colors flex-shrink-0"
                    >
                        <Paperclip className="w-5 h-5" />
                    </button>

                    {/* Input */}
                    <div className="flex-1 relative flex items-center">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            disabled={isSending}
                            className="w-full px-5 py-3 pr-12 rounded-full border border-gray-200 bg-gray-50 text-sm text-[#1D3557] placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-50"
                            style={{ focusRingColor: "#FF6B35" } as any}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e as any);
                                }
                            }}
                        />
                        <button
                            type="button"
                            className="absolute right-4 text-gray-400 hover:text-[#FF6B35] transition-colors"
                        >
                            <Smile className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Send */}
                    <button
                        type="submit"
                        disabled={isSending || !input.trim()}
                        className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ background: "linear-gradient(135deg, #FF6B35, #d85327)" }}
                    >
                        <Send className="w-4 h-4 text-white" />
                    </button>
                </div>
            </form>
        </div>
    );
}